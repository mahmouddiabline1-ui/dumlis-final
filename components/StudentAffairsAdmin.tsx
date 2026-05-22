import React, { useEffect, useMemo, useState } from 'react';
import { StudentProfile } from '../types';
import DynamicPage from './DynamicPage';
import { getPageConfig } from '../data/pageConfig';
import { StudentDataManagement } from './StudentDataManagement';
import StudentRegistrationManagement from './StudentRegistrationManagement';
import StudentAffairsDocuments from './StudentAffairsDocuments';
import StudentAffairsUsers from './StudentAffairsUsers';
import DbBackedPage, { isDbBackedPage } from './DbBackedPage';
import DbAttendanceEntry from './DbAttendanceEntry';
import {
  BarChart3,
  CheckCircle2,
  Circle,
  ClipboardList,
  Download,
  FileText,
  Printer,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  UserRound,
  Users,
  Wallet,
  BookOpenCheck,
  ClipboardSignature,
  CalendarCheck2,
  FileStack,
  Plus,
} from 'lucide-react';

type RequirementStatus = 'pending' | 'done';

interface StudentRequirement {
  id: string;
  title: string;
  details?: string;
  status: RequirementStatus;
  updatedAt: string;
}

const defaultRequirements: Omit<StudentRequirement, 'id' | 'updatedAt'>[] = [
  { title: 'صورة بطاقة الرقم القومي', status: 'pending' },
  { title: 'شهادة الميلاد', status: 'pending' },
  { title: 'استمارة 2 جند (للذكور)', status: 'pending' },
  { title: '6 صور شخصية', status: 'pending' },
  { title: 'إيصال المصروفات', status: 'pending' },
];

function storageKey(studentId: string) {
  return `student_affairs_requirements:${studentId}`;
}

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

type StudentAffairsSection =
  | 'requirements'
  | 'student_profile'
  | 'registration'
  | 'academic'
  | 'attendance'
  | 'fees'
  | 'documents'
  | 'requests'
  | 'reports'
  | 'users';

type StudentAffairsReportId =
  | 'student_list'
  | 'old_regulation_students'
  | 'new_regulation_students'
  | 'contact_list'
  | 'id_cards'
  | 'fees_setup'
  | 'fees_collect'
  | 'payment_perm'
  | 'student_reg_form';

const REPORTS: Array<{
  id: StudentAffairsReportId;
  title: string;
  description: string;
  badge?: string;
}> = [
  { id: 'student_list', title: 'قوائم الطلاب المقيدين', description: 'كشف شامل ببيانات الطلاب + طباعة كشف.' },
  { id: 'old_regulation_students', title: 'طلاب اللائحة القديمة', description: 'قائمة طلاب اللائحة القديمة + طباعة كشف.', badge: 'لائحة' },
  { id: 'new_regulation_students', title: 'طلاب اللائحة الجديدة', description: 'قائمة طلاب اللائحة الجديدة + طباعة كشف.', badge: 'لائحة' },
  { id: 'contact_list', title: 'بيانات الاتصال', description: 'هواتف/إيميلات/مدينة/مستوى + طباعة.' },
  { id: 'id_cards', title: 'بطاقات الهوية', description: 'متابعة حالات بطاقات الهوية + طباعة.' },
  { id: 'fees_setup', title: 'تجهيز رسوم الطلاب', description: 'إعداد الرسوم للفصل/العام + طباعة.', badge: 'مالي' },
  { id: 'fees_collect', title: 'تحصيل رسوم طالب', description: 'سجل التحصيل والإيصالات + طباعة.', badge: 'مالي' },
  { id: 'payment_perm', title: 'إذن دفع', description: 'إصدار أذونات الدفع + طباعة.', badge: 'مالي' },
  { id: 'student_reg_form', title: 'استمارة تسجيل طالب', description: 'استمارة جاهزة للطباعة.' },
];

interface StudentAffairsAdminProps {
  facultyId?: string | null;
}

import { studentsApi, studentRequirementsApi } from '../api';

const StudentAffairsAdmin: React.FC<StudentAffairsAdminProps> = ({ facultyId }) => {
  const [section, setSection] = useState<StudentAffairsSection>('requirements');
  const [searchTerm, setSearchTerm] = useState('');
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await studentsApi.list({ faculty_id: facultyId || undefined } as any);
        setDbStudents(data);
      } catch (err) {
        console.error("Failed to fetch students from DB:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [facultyId]);

  // Map DB students to the structure expected by the UI
  const allStudents: StudentProfile[] = useMemo(() => {
    return dbStudents.map(s => ({
      id: s.student_id,
      personal: {
        name: s.name,
        nameEn: s.name,
        nationalId: s.national_id || '',
        birthDate: '',
        birthPlace: s.city || '',
        nationality: 'مصري',
        religion: 'مسلم',
        gender: 'ذكر',
        image: ''
      },
      academic: {
        studentCode: s.student_id,
        faculty: s.faculty_id,
        department: s.department_id || 'عام',
        program: s.department_id || 'عام',
        level: s.level || 1,
        gpa: s.gpa || 0,
        status: s.status === 'مقيد' ? 'active' : 'inactive',
        regulationType: s.regulation === 'لائحة جديدة' ? 'new' : 'old',
        enrollmentYear: s.student_id.substring(0, 4)
      }
    }));
  }, [dbStudents]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  useEffect(() => {
    if (allStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(allStudents[0].id);
    }
  }, [allStudents, selectedStudentId]);

  const selectedStudent = useMemo(
    () => allStudents.find(s => s.id === selectedStudentId) || null,
    [selectedStudentId, allStudents]
  );

  const [requirements, setRequirements] = useState<StudentRequirement[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const [activeReportId, setActiveReportId] = useState<StudentAffairsReportId>('student_list');
  const [activeSimplePageId, setActiveSimplePageId] = useState<string>('student_attendance');

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allStudents;
    return allStudents.filter((s: StudentProfile) => {
      return (
        (s.personal.name || '').toLowerCase().includes(term) ||
        (s.academic.studentCode || '').toLowerCase().includes(term) ||
        (s.personal.nationalId || '').includes(term)
      );
    });
  }, [searchTerm, allStudents]);

  // Ensure selected student remains valid after filtering or data update
  useEffect(() => {
    if (filteredStudents.length > 0) {
      if (!selectedStudentId || !filteredStudents.find(s => s.id === selectedStudentId)) {
        setSelectedStudentId(filteredStudents[0].id);
      }
    }
  }, [filteredStudents, selectedStudentId]);

  // Load requirements for selected student from API
  useEffect(() => {
    if (!selectedStudent) return;
    
    const fetchReqs = async () => {
      try {
        const data = await studentRequirementsApi.list(selectedStudent.id);
        if (data && data.length > 0) {
          // Map DB to UI
          setRequirements(data.map(d => ({
            id: String(d.id),
            title: d.requirement_key,
            details: d.notes || '',
            status: d.status === 'verified' ? 'done' : 'pending',
            updatedAt: d.updated_at
          })));
          setIsDirty(false);
        } else {
          // Initialize defaults
          const initial = defaultRequirements.map(r => ({
            id: newId(),
            title: r.title,
            details: r.details,
            status: r.status,
            updatedAt: nowIso(),
          }));
          setRequirements(initial);
          setIsDirty(true);
        }
      } catch (err) {
        console.error("Failed to fetch requirements:", err);
      }
    };
    
    fetchReqs();
  }, [selectedStudent?.id]);

  const doneCount = requirements.filter(r => r.status === 'done').length;
  const totalCount = requirements.length;

  const toggleStatus = (id: string) => {
    setRequirements(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: r.status === 'done' ? 'pending' : 'done', updatedAt: nowIso() } : r
      )
    );
    setIsDirty(true);
  };

  const updateField = (id: string, patch: Partial<Pick<StudentRequirement, 'title' | 'details'>>) => {
    setRequirements(prev => prev.map(r => (r.id === id ? { ...r, ...patch, updatedAt: nowIso() } : r)));
    setIsDirty(true);
  };

  const addRequirement = () => {
    setRequirements(prev => [
      {
        id: newId(),
        title: 'متطلب جديد',
        details: '',
        status: 'pending',
        updatedAt: nowIso(),
      },
      ...prev,
    ]);
    setIsDirty(true);
  };

  const deleteRequirement = (id: string) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
    setIsDirty(true);
  };

  const save = async () => {
    if (!selectedStudent) return;
    
    try {
      const bulkData = requirements.map(r => ({
        student_id: selectedStudent.id,
        requirement_key: r.title,
        status: (r.status === 'done' ? 'verified' : 'pending') as 'verified' | 'pending',
        notes: r.details
      }));
      
      await studentRequirementsApi.bulkCreate(bulkData as any);
      setIsDirty(false);
      alert('تم الحفظ في قاعدة البيانات بنجاح');
    } catch (err) {
      console.error("Failed to save requirements:", err);
      alert('فشل حفظ المتطلبات');
    }
  };

  const reportConfig = useMemo(() => getPageConfig(activeReportId, facultyId), [activeReportId, facultyId]);
  const simpleConfig = useMemo(() => getPageConfig(activeSimplePageId, facultyId), [activeSimplePageId, facultyId]);

  const sections = useMemo(
    () =>
      [
        { id: 'requirements' as const, label: 'المتطلبات', icon: ClipboardList },
        { id: 'student_profile' as const, label: 'بيانات الطالب', icon: UserRound },
        { id: 'registration' as const, label: 'القيد والتسجيل', icon: BookOpenCheck },
        { id: 'academic' as const, label: 'الحالة الأكاديمية', icon: ClipboardSignature },
        { id: 'attendance' as const, label: 'الحضور والغياب', icon: CalendarCheck2 },
        { id: 'fees' as const, label: 'المصروفات', icon: Wallet },
        { id: 'documents' as const, label: 'المستندات', icon: FileStack },
        { id: 'requests' as const, label: 'طلبات الطلاب', icon: Users },
        { id: 'reports' as const, label: 'التقارير', icon: BarChart3 },
        { id: 'users' as const, label: 'إدارة المستخدمين', icon: Settings },
      ] satisfies Array<{ id: StudentAffairsSection; label: string; icon: any }>,
    []
  );

  return (
    <div className="w-full h-full">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 12mm; }
        }
      `}</style>

      <div className="mb-6 border-b border-gray-100 pb-6 no-print">
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-primary-50 text-primary-700 border border-primary-100">
                <ClipboardList className="w-6 h-6" />
              </span>
              شؤون الطلاب
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              ملف الطالب + القيد والتسجيل + الحضور + المصروفات + المستندات + الطلبات + التقارير + المستخدمين.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-2"
              title="طباعة (حسب الصفحة الحالية)"
            >
              <Printer className="w-4 h-4" />
              طباعة
            </button>
            <button
              onClick={() => {
                const btn = document.querySelector<HTMLButtonElement>('button[data-dynamicpage-action="export"]');
                btn?.click();
              }}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-2"
              title="تصدير (CSV) إذا كان متاحًا"
            >
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>

        {/* Main navigation */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {sections.map(s => {
            const isActive = section === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-900 text-white border-primary-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-500'}`} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {section === 'student_profile' ? (
        <div className="w-full h-[calc(100vh-180px)] overflow-hidden">
          <StudentDataManagement selectedFacultyId={facultyId || null} />
        </div>
      ) : section === 'registration' ? (
        <div className="w-full">
          <StudentRegistrationManagement selectedFacultyId={facultyId || null} />
        </div>
      ) : section === 'academic' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden no-print">
            <div className="p-5 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900">الحالة الأكاديمية</h2>
              <p className="text-sm text-gray-500 mt-1">ملف الطالب الأكاديمي + إنذارات + بيانات شاملة.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { id: 'student_academic_profile', label: 'الملف الأكاديمي للطلاب' },
                { id: 'academic_warnings', label: 'الإنذارات الأكاديمية' },
                { id: 'student_complete_profile', label: 'الملف الشامل للطالب' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSimplePageId(item.id)}
                  className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${
                    activeSimplePageId === item.id ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
                  }`}
                >
                  <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            {isDbBackedPage(activeSimplePageId) ? (
              <DbBackedPage pageId={activeSimplePageId} title={simpleConfig.title} facultyId={facultyId} />
            ) : (
              <DynamicPage config={simpleConfig} selectedFacultyId={facultyId} />
            )}
          </div>
        </div>
      ) : section === 'attendance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden no-print">
            <div className="p-5 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900">الحضور والغياب</h2>
              <p className="text-sm text-gray-500 mt-1">سجل حضور + إدخال حضور + تقارير.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { id: 'student_attendance', label: 'سجل حضور الطلاب' },
                { id: 'add_attendance', label: 'إدخال حضور الطلاب' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSimplePageId(item.id)}
                  className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${
                    activeSimplePageId === item.id ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
                  }`}
                >
                  <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            {activeSimplePageId === 'add_attendance' ? (
              <DbAttendanceEntry facultyId={facultyId} />
            ) : isDbBackedPage(activeSimplePageId) ? (
              <DbBackedPage pageId={activeSimplePageId} title={simpleConfig.title} facultyId={facultyId} />
            ) : (
              <DynamicPage config={simpleConfig} selectedFacultyId={facultyId} />
            )}
          </div>
        </div>
      ) : section === 'fees' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden no-print">
            <div className="p-5 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900">المصروفات</h2>
              <p className="text-sm text-gray-500 mt-1">تجهيز الرسوم + تحصيل + إذن دفع.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { id: 'fees_setup', label: 'تجهيز رسوم الطلاب' },
                { id: 'fees_collect', label: 'تحصيل رسوم طالب' },
                { id: 'payment_perm', label: 'إذن دفع' },
                { id: 'student_fees', label: 'رسوم طالب (عرض)' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSimplePageId(item.id)}
                  className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${
                    activeSimplePageId === item.id ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
                  }`}
                >
                  <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            {isDbBackedPage(activeSimplePageId) ? (
              <DbBackedPage pageId={activeSimplePageId} title={simpleConfig.title} facultyId={facultyId} />
            ) : (
              <DynamicPage config={simpleConfig} selectedFacultyId={facultyId} />
            )}
          </div>
        </div>
      ) : section === 'documents' ? (
        <StudentAffairsDocuments facultyId={facultyId} />
      ) : section === 'requests' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden no-print">
            <div className="p-5 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900">طلبات الطلاب</h2>
              <p className="text-sm text-gray-500 mt-1">متابعة الطلبات وحالاتها + اعتماد/رفض.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { id: 'manage_reg_issues', label: 'مشاكل التسجيل (التعثر)' },
                { id: 'reg_form_issue', label: 'استمارة التسجيل (حالات التعثر)' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSimplePageId(item.id)}
                  className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${
                    activeSimplePageId === item.id ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
                  }`}
                >
                  <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            {isDbBackedPage(activeSimplePageId) ? (
              <DbBackedPage pageId={activeSimplePageId} title={simpleConfig.title} facultyId={facultyId} />
            ) : (
              <DynamicPage config={simpleConfig} selectedFacultyId={facultyId} />
            )}
          </div>
        </div>
      ) : section === 'users' ? (
        <StudentAffairsUsers />
      ) : section === 'requirements' ? (
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] h-[calc(100vh-140px)] w-full">
          {/* Students List */}
          <div className="w-72 border-l border-gray-200 bg-gray-50/30 flex flex-col shrink-0 no-print">
            <div className="p-4 border-b border-gray-200 bg-white space-y-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="بحث بالاسم أو الكود..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="text-xs text-gray-500 flex items-center justify-between">
                <span>عدد الطلاب</span>
                <span className="font-bold text-gray-700">{filteredStudents.length}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-right p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 flex items-center justify-between group ${
                    selectedStudentId === student.id ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
                  }`}
                >
                  <div>
                    <p className={`font-bold text-sm mb-1 ${selectedStudentId === student.id ? 'text-primary-900' : 'text-gray-900'}`}>
                      {student.personal.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{student.academic.studentCode}</span>
                      <span>•</span>
                      <span>{student.academic.program}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    اختيار
                  </span>
                </button>
              ))}

              {filteredStudents.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-sm">
                  لا توجد نتائج مطابقة
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {!selectedStudent ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <FileText size={64} className="mb-4 opacity-50" />
                <p className="text-lg">اختر طالباً من القائمة لعرض المتطلبات</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.personal.name}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedStudent.academic.studentCode}</span>
                        <span>•</span>
                        <span>{selectedStudent.academic.faculty}</span>
                        <span>•</span>
                        <span>{selectedStudent.academic.program}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm">
                        <span className="font-bold text-primary-700">{doneCount}</span>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className="font-bold text-gray-700">{totalCount}</span>
                        <span className="mr-2 text-gray-600">مكتمل</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">قائمة المتطلبات</h3>
                      {isDirty && (
                        <span className="text-[11px] px-2 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200 font-bold">
                          غير محفوظ
                        </span>
                      )}
                    </div>

                    {requirements.length === 0 ? (
                      <div className="p-10 text-center text-gray-500">
                        لا توجد متطلبات حالياً. اضغط “إضافة متطلب”.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {requirements.map((req) => (
                          <div key={req.id} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <button
                                onClick={() => toggleStatus(req.id)}
                                className="mt-1 shrink-0"
                                title={req.status === 'done' ? 'وضع كمعلق' : 'وضع كمكتمل'}
                              >
                                {req.status === 'done' ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <input
                                  value={req.title}
                                  onChange={(e) => updateField(req.id, { title: e.target.value })}
                                  className={`w-full text-right font-bold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-primary-300 transition-colors ${
                                    req.status === 'done' ? 'line-through opacity-70' : ''
                                  }`}
                                />
                                <textarea
                                  value={req.details || ''}
                                  onChange={(e) => updateField(req.id, { details: e.target.value })}
                                  placeholder="ملاحظات/تفاصيل (اختياري)"
                                  className="mt-2 w-full text-right text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all min-h-[70px]"
                                />
                                <div className="mt-2 text-[11px] text-gray-400">
                                  آخر تحديث: {new Date(req.updatedAt).toLocaleString('ar-EG')}
                                </div>
                              </div>

                              <button
                                onClick={() => deleteRequirement(req.id)}
                                className="shrink-0 p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-700 transition-colors"
                                title="حذف المتطلب"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
          {/* Reports list */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden no-print">
            <div className="p-5 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900">تقارير شؤون الطلاب</h2>
              <p className="text-sm text-gray-500 mt-1">اختر تقريراً لعرضه ثم استخدم أوامر الطباعة/التصدير.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {REPORTS.map((r) => {
                const isActive = r.id === activeReportId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveReportId(r.id)}
                    className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${
                      isActive ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${isActive ? 'text-primary-900' : 'text-gray-900'}`}>{r.title}</span>
                          {r.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-200 font-bold">
                              {r.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</div>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600 shrink-0">
                        فتح
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report viewer */}
          <div className="min-w-0">
            {isDbBackedPage(activeReportId) ? (
              <DbBackedPage pageId={activeReportId} title={reportConfig.title} facultyId={facultyId} />
            ) : (
              <DynamicPage
                config={{
                  ...reportConfig,
                  actions: (reportConfig.actions || []).map((a) => {
                    if (a.type === 'export') return { ...a, label: a.label || 'تصدير' };
                    if (a.type === 'print') return { ...a, label: a.label || 'طباعة' };
                    return a;
                  }),
                }}
                selectedFacultyId={facultyId}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAffairsAdmin;
