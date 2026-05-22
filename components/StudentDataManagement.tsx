import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { StudentCommitteeAssignment, Committee } from '../data/committeesData';
import {
  User, Phone, Shield, GraduationCap, Search, ChevronRight,
  MapPin, Stethoscope, Users, ScrollText, Award, HeartPulse, Plus, Save, X,
  BookOpen, Building2, Calendar, Clock
} from 'lucide-react';

import { studentsApi, coursesApi, enrollmentsApi, facultiesApi, departmentsApi, committeesApi } from '../api';

interface StudentDataManagementProps {
  regulationFilter?: 'new' | 'old';
  selectedFacultyId?: string | null;
}

const StudentDataManagement: React.FC<StudentDataManagementProps> = ({ regulationFilter, selectedFacultyId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'family' | 'qualification' | 'academic' | 'military' | 'military_edu' | 'medical' | 'registration' | 'committees'>('personal');
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [studentEnrollments, setStudentEnrollments] = useState<any[]>([]);
  const [committeeAssignments, setCommitteeAssignments] = useState<StudentCommitteeAssignment[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [facultiesOptions, setFacultiesOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [departmentsOptions, setDepartmentsOptions] = useState<Array<{ id: string; name: string; faculty_id: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const initialAddForm = {
    student_id: '',
    name: '',
    national_id: '',
    faculty_id: selectedFacultyId || '',
    department_id: '',
    level: '1',
    regulation: 'لائحة جديدة',
    gpa: '',
    phone: '',
    email: '',
    city: '',
    status: 'مقيد',
    fees_status: 'غير مسدد',
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
    guardian_job: '',
    guardian_national_id: '',
    military_status: '',
    military_notes: '',
    military_edu_status: '',
    military_edu_notes: '',
    blood_type: '',
    medical_status: '',
  };
  const [addForm, setAddForm] = useState(initialAddForm);

  // Load committees from API
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const data = await committeesApi.list();
        setCommittees(data as any);
      } catch (err) {
        console.error("Failed to fetch committees:", err);
      }
    };

    // Fetch all courses for mapping
    const fetchCourses = async () => {
      try {
        const data = await coursesApi.list({ limit: 500 } as any);
        setAllCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    const fetchFaculties = async () => {
      try {
        const data = await facultiesApi.list();
        setFacultiesOptions(data.map(f => ({ id: f.id, name: f.name })));
      } catch (err) {
        console.error("Failed to fetch faculties:", err);
      }
    };
    fetchCommittees();
    fetchCourses();
    fetchFaculties();
  }, []);

  // Fetch student-specific committee assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      if (selectedStudent) {
        try {
          const data = await committeesApi.listAssignments({ student_id: selectedStudent.id });
          setCommitteeAssignments(data as any);
        } catch (err) {
          console.error("Failed to fetch assignments:", err);
        }
      } else {
        setCommitteeAssignments([]);
      }
    };
    fetchAssignments();
  }, [selectedStudent?.id]);

  // Update enrollments when selected student changes
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (selectedStudent) {
        try {
          const data = await enrollmentsApi.list({ student_id: selectedStudent.id, status: 'مسجل' });
          setStudentEnrollments(data);
        } catch (err) {
          console.error("Failed to fetch enrollments:", err);
        }
      }
    };
    fetchEnrollments();
  }, [selectedStudent]);

  // Fetch students from DB
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedFacultyId) {
        params.faculty_id = selectedFacultyId;
      }
      if (regulationFilter) {
        params.regulation = regulationFilter === 'new' ? 'لائحة جديدة' : 'لائحة قديمة';
      }
      const data = await studentsApi.listAll(params);
      setDbStudents(data);
    } catch (err) {
      console.error("Failed to fetch students from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedFacultyId, regulationFilter]);

  useEffect(() => {
    setAddForm(prev => ({ ...prev, faculty_id: selectedFacultyId || prev.faculty_id }));
  }, [selectedFacultyId]);

  useEffect(() => {
    const loadDepartments = async () => {
      const facultyForDepartments = addForm.faculty_id || selectedFacultyId || undefined;
      try {
        const data = await departmentsApi.list(facultyForDepartments || undefined);
        setDepartmentsOptions(data.map((d: any) => ({
          id: d.id,
          name: d.name,
          faculty_id: d.faculty_id,
        })));
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setDepartmentsOptions([]);
      }
    };
    loadDepartments();
  }, [addForm.faculty_id, selectedFacultyId]);


  // Map DB students to the structure expected by the UI
  const allAvailableStudents = dbStudents.length > 0 ? dbStudents.map(s => {
    return {
      id: s.student_id,
      personal: {
        name: s.name,
        nameEn: s.name, // Fallback if no English name
        nationalId: s.national_id || '',
        birthDate: '',
        birthPlace: s.city || '',
        nationality: 'مصري',
        religion: 'مسلم',
        gender: 'ذكر',
        image: ''
      },
      contact: {
        phone: s.phone || '',
        email: s.email || '',
        address: {
          governorate: s.city || '',
          city: s.city || '',
          street: '',
          buildingNumber: ''
        }
      },
      family: {
        guardianName:      s.guardian_name || '',
        guardianRelation:  s.guardian_relation || '',
        guardianPhone:     s.guardian_phone || '',
        guardianJob:       s.guardian_job || '',
        guardianNationalId: s.guardian_national_id || '',
      },
      qualification: {
        qualificationType: 'thanaweya_amma',
        qualificationYear: '',
        schoolName: '',
        seatNumber: '',
        totalDegree: 0,
        percentage: 0,
        division: 'scientific_math',
        qualificationDate: ''
      },
      military: {
        status:             s.military_status || '',
        tripleNumber:       s.military_triple_number || '',
        postponementDate:   s.military_postponement_date || '',
        postponementReason: s.military_postponement_reason || '',
        notes:              s.military_notes || '',
      },
      militaryEducation: {
        status:         s.military_edu_status || 'not_done',
        completionDate: s.military_edu_completion_date || '',
        notes:          s.military_edu_notes || '',
      },
      medical: {
        medicalStatus:     s.medical_status || '',
        bloodType:         s.blood_type || '',
        vaccinationStatus: s.vaccination_status || '',
        lastCheckupDate:   s.last_checkup_date || '',
      },
      academic: {
        studentCode: s.student_id,
        faculty: s.faculty_name || s.faculty_id,
        department: s.department_name || s.department_id || 'عام',
        program: s.department_name || s.department_id || 'عام',
        level: s.level || 1,
        gpa: s.gpa || 0,
        enrollmentYear: s.student_id.substring(0, 4),
        status: s.status === 'مقيد' ? 'active' : 'inactive',
        regulationType: s.regulation === 'لائحة جديدة' ? 'new' : 'old'
      }
    };
  }) : [];

  const filteredStudents = allAvailableStudents.filter(student => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const matchesSearch = (student.personal.name || '').toLowerCase().includes(term) ||
      (student.personal.nameEn || '').toLowerCase().includes(term) ||
      (student.academic.studentCode || '').toLowerCase().includes(term) ||
      (student.personal.nationalId || '').includes(term);

    // If regulation filter is present, check against academic.regulationType
    if (regulationFilter) {
      return matchesSearch && student.academic.regulationType === regulationFilter;
    }

    return matchesSearch;
  });

  useEffect(() => {
    if (!isAddingMode) {
      // If we have filtered students
      if (filteredStudents.length > 0) {
        // If no student selected, or selected student is not in the filtered list
        if (!selectedStudent || !filteredStudents.find(s => s.id === selectedStudent.id)) {
          setSelectedStudent(filteredStudents[0]);
        }
      } else {
        setSelectedStudent(null);
      }
    }
  }, [regulationFilter, searchTerm, filteredStudents.length, isAddingMode]); // specialized dependency to avoid excessive updates

  const handleAddClick = () => {
    setIsAddingMode(true);
    setSelectedStudent(null);
    setAddForm({
      ...initialAddForm,
      faculty_id: selectedFacultyId || '',
    });
    // Reset to first tab when adding
    setActiveTab('personal');
  };

  const handleCancelAdd = () => {
    setIsAddingMode(false);
    setAddForm({
      ...initialAddForm,
      faculty_id: selectedFacultyId || '',
    });
    if (filteredStudents.length > 0) {
      setSelectedStudent(filteredStudents[0]);
    }
  };

  const handleStartEdit = () => {
    const s = dbStudents.find(ds => ds.student_id === selectedStudent?.id);
    setEditForm({
      guardian_name:        s?.guardian_name || '',
      guardian_relation:    s?.guardian_relation || '',
      guardian_phone:       s?.guardian_phone || '',
      guardian_job:         s?.guardian_job || '',
      guardian_national_id: s?.guardian_national_id || '',
      military_status:      s?.military_status || '',
      military_notes:       s?.military_notes || '',
      blood_type:           s?.blood_type || '',
      medical_status:       s?.medical_status || '',
      phone:                s?.phone || '',
      email:                s?.email || '',
      city:                 s?.city || '',
    });
    setIsEditingExisting(true);
  };

  const handleCancelEdit = () => {
    setIsEditingExisting(false);
    setEditForm({});
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;
    setIsSavingStudent(true);
    try {
      await studentsApi.update(selectedStudent.id, {
        guardian_name:        editForm.guardian_name || undefined,
        guardian_relation:    editForm.guardian_relation || undefined,
        guardian_phone:       editForm.guardian_phone || undefined,
        guardian_job:         editForm.guardian_job || undefined,
        guardian_national_id: editForm.guardian_national_id || undefined,
        military_status:      editForm.military_status || undefined,
        military_notes:       editForm.military_notes || undefined,
        blood_type:           editForm.blood_type || undefined,
        medical_status:       editForm.medical_status || undefined,
        phone:                editForm.phone || undefined,
        email:                editForm.email || undefined,
        city:                 editForm.city || undefined,
      } as any);
      await fetchStudents();
      setIsEditingExisting(false);
      setEditForm({});
      alert('تم حفظ التعديلات بنجاح');
    } catch (err) {
      alert('تعذر حفظ التعديلات');
      console.error(err);
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleSaveStudent = async () => {
    if (!addForm.student_id.trim() || !addForm.name.trim()) {
      alert('يرجى إدخال الكود الجامعي واسم الطالب');
      return;
    }
    if (!addForm.faculty_id.trim()) {
      alert('يرجى اختيار الكلية');
      return;
    }
    if (!addForm.department_id.trim()) {
      alert('يرجى اختيار القسم');
      return;
    }

    const parsedLevel = Number(addForm.level);
    if (!Number.isInteger(parsedLevel) || parsedLevel < 1 || parsedLevel > 7) {
      alert('المستوى يجب أن يكون من 1 إلى 7');
      return;
    }

    setIsSavingStudent(true);
    try {
      await studentsApi.create({
        student_id: addForm.student_id.trim(),
        name: addForm.name.trim(),
        national_id: addForm.national_id.trim() || undefined,
        faculty_id: addForm.faculty_id,
        department_id: addForm.department_id,
        level: parsedLevel,
        regulation: addForm.regulation,
        gpa: addForm.gpa.trim() ? Number(addForm.gpa) : undefined,
        phone: addForm.phone.trim() || undefined,
        email: addForm.email.trim() || undefined,
        city: addForm.city.trim() || undefined,
        status: addForm.status,
        fees_status: addForm.fees_status,
        guardian_name:        addForm.guardian_name || undefined,
        guardian_relation:    addForm.guardian_relation || undefined,
        guardian_phone:       addForm.guardian_phone || undefined,
        guardian_job:         addForm.guardian_job || undefined,
        guardian_national_id: addForm.guardian_national_id || undefined,
        military_status:      addForm.military_status || undefined,
        military_notes:       addForm.military_notes || undefined,
        blood_type:           addForm.blood_type || undefined,
        medical_status:       addForm.medical_status || undefined,
      } as any);

      await fetchStudents();
      setIsAddingMode(false);
      alert('تم حفظ الطالب بنجاح');
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes('409') || msg.toLowerCase().includes('already exists')) {
        alert('هذا الكود الجامعي موجود بالفعل. استخدم كوداً آخر.');
      } else {
        alert('تعذر حفظ الطالب. تأكد من صحة البيانات وحاول مرة أخرى.');
      }
      console.error('Failed to save student:', err);
    } finally {
      setIsSavingStudent(false);
    }
  };

  // Tab Button Component
  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap min-w-fit flex-1 justify-center ${activeTab === id
          ? 'border-primary-600 text-primary-600 bg-primary-50/50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  // Info Field Component
  const InfoField = ({ label, value, fullWidth = false }: any) => (
    <div className={`p-3 bg-gray-50 rounded-lg border border-gray-200 ${fullWidth ? 'col-span-1 md:col-span-2 xl:col-span-3' : ''}`}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="text-gray-900 font-semibold text-sm break-words">{value || '-'}</div>
    </div>
  );

  // Input Field Component (Editable)
  const InputField = ({ label, placeholder, fullWidth = false, type = "text", value, onChange }: any) => (
    <div className={`p-1 ${fullWidth ? 'col-span-1 md:col-span-2 xl:col-span-3' : ''}`}>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );

  // Select Field Component (Editable)
  const SelectField = ({ label, options, fullWidth = false, value, onChange }: any) => (
    <div className={`p-1 ${fullWidth ? 'col-span-1 md:col-span-2 xl:col-span-3' : ''}`}>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <select
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">اختر {label}...</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] h-[calc(100vh-140px)] w-full">

      {/* Sidebar - Search & List */}
      <div className="w-72 border-l border-gray-200 bg-gray-50/30 flex flex-col shrink-0">
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

          <button
            onClick={handleAddClick}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-medium text-sm shadow-sm ${isAddingMode
                ? 'bg-primary-600 text-white ring-2 ring-primary-200'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
          >
            <Plus size={18} />
            إضافة طالب جديد
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => {
                setIsAddingMode(false);
                setSelectedStudent(student);
                setIsEditingExisting(false);
                setEditForm({});
              }}
              className={`w-full text-right p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 flex items-center justify-between group ${!isAddingMode && selectedStudent?.id === student.id ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
                }`}
            >
              <div>
                <p className={`font-bold text-sm mb-1 ${selectedStudent?.id === student.id ? 'text-primary-900' : 'text-gray-900'}`}>
                  {student.personal.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{student.academic.studentCode}</span>
                  <span>•</span>
                  <span>{student.academic.program}</span>
                </div>
              </div>
              <ChevronRight size={16} className={`text-gray-400 ${selectedStudent?.id === student.id ? 'text-primary-600' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}

          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              لا توجد نتائج مطابقة
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {isAddingMode ? (
          <>
            {/* Add Mode Header */}
            <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">إضافة طالب جديد</h1>
                <p className="text-gray-500 text-sm">قم بإدخال بيانات الطالب في التبويبات أدناه</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                >
                  <X size={18} />
                  إلغاء
                </button>
                <button
                  onClick={handleSaveStudent}
                  disabled={isSavingStudent}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm hover:shadow flex items-center gap-2 font-medium"
                >
                  <Save size={18} />
                  {isSavingStudent ? 'جاري الحفظ...' : 'حفظ البيانات'}
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-col border-b border-gray-200">
              <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
                <TabButton id="personal" label="بيانات شخصية" icon={User} />
                <TabButton id="contact" label="بيانات الاتصال" icon={Phone} />
                <TabButton id="family" label="بيانات العائلة" icon={Users} />
                <TabButton id="qualification" label="المؤهل السابق" icon={ScrollText} />
              </div>
              <div className="flex overflow-x-auto no-scrollbar">
                <TabButton id="academic" label="بيانات دراسية" icon={GraduationCap} />
                <TabButton id="registration" label="التسجيل الأكاديمي" icon={BookOpen} />
                <TabButton id="committees" label="اللجان وأرقام الجلوس" icon={Building2} />
                <TabButton id="military" label="التجنيد" icon={Shield} />
                <TabButton id="military_edu" label="التربية العسكرية" icon={Award} />
                <TabButton id="medical" label="الكشف الطبي" icon={Stethoscope} />
              </div>
            </div>

            {/* Add Mode Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {activeTab === 'personal' && (
                <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm space-y-4 animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="text-primary-600" size={20} />
                    البيانات الأساسية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <InputField
                      label="الاسم بالكامل (عربي)"
                      placeholder="أدخل الاسم رباعي بالعربية"
                      fullWidth
                      value={addForm.name}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, name: v }))}
                    />
                    <InputField label="الاسم بالكامل (إنجليزي)" placeholder="Enter full name in English" fullWidth />
                    <InputField
                      label="الرقم القومي"
                      placeholder="14 رقم"
                      value={addForm.national_id}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, national_id: v }))}
                    />
                    <InputField label="تاريخ الميلاد" type="date" />
                    <InputField label="مكان الميلاد" placeholder="المحافظة - المركز" />
                    <SelectField label="النوع" options={['ذكر', 'أنثى']} />
                    <InputField label="الجنسية" placeholder="مثال: مصري" />
                    <SelectField label="الديانة" options={['مسلم', 'مسيحي']} />
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600">
                      <MapPin size={20} /> العنوان
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InputField
                        label="المحافظة"
                        placeholder="اختر المحافظة"
                        value={addForm.city}
                        onChange={(v: string) => setAddForm(prev => ({ ...prev, city: v }))}
                      />
                      <InputField label="المدينة / المركز" placeholder="المدينة" />
                      <InputField label="الشارع" placeholder="اسم الشارع" />
                      <InputField label="رقم العقار" placeholder="رقم المنزل" />
                      <InputField label="تفاصيل إضافية" placeholder="علامة مميزة" fullWidth />
                    </div>
                  </div>
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600">
                      <Phone size={20} /> الاتصال
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InputField
                        label="رقم الهاتف"
                        placeholder="01xxxxxxxxx"
                        value={addForm.phone}
                        onChange={(v: string) => setAddForm(prev => ({ ...prev, phone: v }))}
                      />
                      <InputField
                        label="البريد الإلكتروني"
                        placeholder="example@university.edu.eg"
                        value={addForm.email}
                        onChange={(v: string) => setAddForm(prev => ({ ...prev, email: v }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'family' && (
                <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600"><Users size={20} /> ولي الأمر</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <InputField label="اسم ولي الأمر" placeholder="الاسم ثلاثي"
                      value={addForm.guardian_name}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, guardian_name: v }))} />
                    <SelectField label="صلة القرابة" options={['الأب', 'الأم', 'العم', 'الخال', 'الجد', 'أخرى']}
                      value={addForm.guardian_relation}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, guardian_relation: v }))} />
                    <InputField label="هاتف ولي الأمر" placeholder="01xxxxxxxxx"
                      value={addForm.guardian_phone}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, guardian_phone: v }))} />
                    <InputField label="وظيفة ولي الأمر" placeholder="الوظيفة"
                      value={addForm.guardian_job}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, guardian_job: v }))} />
                    <InputField label="الرقم القومي لولي الأمر" placeholder="14 رقم"
                      value={addForm.guardian_national_id}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, guardian_national_id: v }))} />
                  </div>
                </div>
              )}

              {activeTab === 'qualification' && (
                <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600"><ScrollText size={20} /> المؤهل السابق</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <SelectField label="نوع المؤهل" options={['ثانوية عامة', 'ثانوية أزهرية', 'STEM', 'معادل']} />
                    <InputField label="سنة المؤهل" placeholder="2023" />
                    <InputField label="المدرسة" placeholder="اسم المدرسة" />
                    <InputField label="رقم الجلوس" placeholder="رقم الجلوس" />
                    <InputField label="المجموع الكلي" type="number" placeholder="410" />
                    <InputField label="النسبة المئوية" type="number" placeholder="%" />
                    <SelectField label="الشعبة" options={['علمي علوم', 'علمي رياضة', 'أدبي']} />
                    <InputField label="تاريخ المؤهل" type="date" />
                  </div>
                </div>
              )}

              {activeTab === 'military' && (
                <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600"><Shield size={20} /> التجنيد</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <SelectField label="الموقف من التجنيد" options={['مؤجل', 'معاف', 'مجند', 'لم يحل الدور']}
                      value={addForm.military_status}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, military_status: v }))} />
                    <InputField label="الرقم الثلاثي" placeholder="xxx/xxx/xxx" />
                    <InputField label="تاريخ التأجيل" type="date" />
                    <InputField label="سبب التأجيل" placeholder="للتعليم / سبب طبي" />
                    <InputField label="ملاحظات عسكرية" placeholder="ملاحظات إضافية" fullWidth
                      value={addForm.military_notes}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, military_notes: v }))} />
                  </div>
                </div>
              )}

              {activeTab === 'military_edu' && (
                <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600"><Award size={20} /> التربية العسكرية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <SelectField label="الحالة" options={['ناجح', 'راسب', 'معاف', 'لم يؤدها بعد']}
                      value={addForm.military_edu_status}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, military_edu_status: v }))} />
                    <InputField label="تاريخ الإتمام" type="date" />
                    <InputField label="ملاحظات" placeholder="رقم الدورة / سبب الإعفاء" fullWidth
                      value={addForm.military_edu_notes}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, military_edu_notes: v }))} />
                  </div>
                </div>
              )}

              {activeTab === 'medical' && (
                <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600"><Stethoscope size={20} /> الكشف الطبي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <SelectField label="الحالة الطبية" options={['لائق', 'غير لائق', 'ذوي احتياجات خاصة']}
                      value={addForm.medical_status}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, medical_status: v }))} />
                    <SelectField label="فصيلة الدم" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                      value={addForm.blood_type}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, blood_type: v }))} />
                    <SelectField label="التطعيم" options={['كامل', 'جرعة واحدة', 'غير مطعم']} />
                    <InputField label="تاريخ آخر كشف" type="date" />
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-primary-600"><GraduationCap size={20} /> البيانات الدراسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <InputField
                      label="الكود الجامعي"
                      placeholder="مثال: 20260001"
                      value={addForm.student_id}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, student_id: v }))}
                    />
                    <SelectField
                      label="حالة القيد"
                      options={['مقيد', 'موقوف', 'خريج', 'مفصول']}
                      value={addForm.status}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, status: v }))}
                    />
                    <div className="p-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">الكلية *</label>
                      <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={addForm.faculty_id}
                        onChange={(e) => {
                          const faculty_id = e.target.value;
                          setAddForm(prev => ({ ...prev, faculty_id, department_id: '' }));
                        }}
                      >
                        <option value="">اختر الكلية...</option>
                        {facultiesOptions.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="p-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">القسم *</label>
                      <select
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={addForm.department_id}
                        onChange={(e) => setAddForm(prev => ({ ...prev, department_id: e.target.value }))}
                        disabled={!addForm.faculty_id}
                      >
                        <option value="">اختر القسم...</option>
                        {departmentsOptions.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <SelectField
                      label="اللائحة"
                      options={['لائحة جديدة', 'لائحة قديمة']}
                      fullWidth
                      value={addForm.regulation}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, regulation: v }))}
                    />
                    <InputField
                      label="المستوى الحالي"
                      type="number"
                      placeholder="1"
                      value={addForm.level}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, level: v }))}
                    />
                    <SelectField
                      label="حالة المصروفات"
                      options={['مسدد', 'غير مسدد']}
                      value={addForm.fees_status}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, fees_status: v }))}
                    />
                    <InputField
                      label="GPA"
                      type="number"
                      placeholder="0 - 5"
                      value={addForm.gpa}
                      onChange={(v: string) => setAddForm(prev => ({ ...prev, gpa: v }))}
                    />
                    <InputField label="عام الالتحاق" placeholder="2023/2024" />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : selectedStudent ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-primary-100 p-1 bg-white shrink-0">
                <img
                  src={selectedStudent.personal.image || "https://via.placeholder.com/150"}
                  alt={selectedStudent.personal.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedStudent.personal.name}</h1>
                <p className="text-gray-500 text-lg flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">{selectedStudent.academic.studentCode}</span>
                  <span>|</span>
                  <span>{selectedStudent.academic.faculty}</span>
                  <span>-</span>
                  <span>{selectedStudent.academic.department}</span>
                  {selectedStudent.academic.regulationType && (
                    <span className={`px-2 py-0.5 rounded text-sm ${selectedStudent.academic.regulationType === 'new'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                      }`}>
                      {selectedStudent.academic.regulationType === 'new' ? 'لائحة جديدة' : 'لائحة قديمة'}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {isEditingExisting ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                    >
                      <X size={18} /> إلغاء
                    </button>
                    <button
                      onClick={handleUpdateStudent}
                      disabled={isSavingStudent}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm flex items-center gap-2 font-medium"
                    >
                      <Save size={18} />
                      {isSavingStudent ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Save size={18} /> تعديل البيانات
                  </button>
                )}
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-col border-b border-gray-200">
              {/* First Row */}
              <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
                <TabButton id="personal" label="بيانات شخصية" icon={User} />
                <TabButton id="contact" label="بيانات الاتصال" icon={Phone} />
                <TabButton id="family" label="بيانات العائلة" icon={Users} />
                <TabButton id="qualification" label="المؤهل السابق" icon={ScrollText} />
              </div>
              {/* Second Row */}
              <div className="flex overflow-x-auto no-scrollbar">
                <TabButton id="academic" label="بيانات دراسية" icon={GraduationCap} />
                <TabButton id="registration" label="التسجيل الأكاديمي" icon={BookOpen} />
                <TabButton id="committees" label="اللجان وأرقام الجلوس" icon={Building2} />
                <TabButton id="military" label="التجنيد" icon={Shield} />
                <TabButton id="military_edu" label="التربية العسكرية" icon={Award} />
                <TabButton id="medical" label="الكشف الطبي" icon={Stethoscope} />
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">

              {/* Personal Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="text-primary-600" size={20} />
                      البيانات الأساسية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InfoField label="الاسم بالكامل (عربي)" value={selectedStudent.personal.name} fullWidth />
                      <InfoField label="الاسم بالكامل (إنجليزي)" value={selectedStudent.personal.nameEn} fullWidth />
                      <InfoField label="الرقم القومي" value={selectedStudent.personal.nationalId} />
                      <InfoField label="تاريخ الميلاد" value={selectedStudent.personal.birthDate} />
                      <InfoField label="مكان الميلاد" value={selectedStudent.personal.birthPlace} />
                      <InfoField label="النوع" value={selectedStudent.personal.gender} />
                      <InfoField label="الجنسية" value={selectedStudent.personal.nationality} />
                      <InfoField label="الديانة" value={selectedStudent.personal.religion} />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="text-primary-600" size={20} />
                      العنوان
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InfoField label="المحافظة" value={selectedStudent.contact.address.governorate} />
                      <InfoField label="المدينة / المركز" value={selectedStudent.contact.address.city} />
                      <InfoField label="الشارع" value={selectedStudent.contact.address.street} />
                      <InfoField label="رقم العقار" value={selectedStudent.contact.address.buildingNumber} />
                      <InfoField label="تفاصيل إضافية" value={selectedStudent.contact.address.details} fullWidth />
                    </div>
                  </div>

                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="text-primary-600" size={20} />
                      معلومات الاتصال
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InfoField label="رقم الهاتف" value={selectedStudent.contact.phone} />
                      <InfoField label="البريد الإلكتروني" value={selectedStudent.contact.email} />
                    </div>
                  </div>
                </div>
              )}

              {/* Family Tab */}
              {activeTab === 'family' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="text-primary-600" size={20} />
                      ولي الأمر
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {isEditingExisting ? (
                        <>
                          <InputField label="اسم ولي الأمر" placeholder="الاسم ثلاثي"
                            value={editForm.guardian_name}
                            onChange={(v: string) => setEditForm(p => ({ ...p, guardian_name: v }))} />
                          <SelectField label="صلة القرابة" options={['الأب', 'الأم', 'العم', 'الخال', 'الجد', 'أخرى']}
                            value={editForm.guardian_relation}
                            onChange={(v: string) => setEditForm(p => ({ ...p, guardian_relation: v }))} />
                          <InputField label="هاتف ولي الأمر" placeholder="01xxxxxxxxx"
                            value={editForm.guardian_phone}
                            onChange={(v: string) => setEditForm(p => ({ ...p, guardian_phone: v }))} />
                          <InputField label="وظيفة ولي الأمر" placeholder="الوظيفة"
                            value={editForm.guardian_job}
                            onChange={(v: string) => setEditForm(p => ({ ...p, guardian_job: v }))} />
                          <InputField label="الرقم القومي لولي الأمر" placeholder="14 رقم"
                            value={editForm.guardian_national_id}
                            onChange={(v: string) => setEditForm(p => ({ ...p, guardian_national_id: v }))} />
                        </>
                      ) : (
                        <>
                          <InfoField label="اسم ولي الأمر" value={selectedStudent.family.guardianName} />
                          <InfoField label="صلة القرابة" value={selectedStudent.family.guardianRelation} />
                          <InfoField label="هاتف ولي الأمر" value={selectedStudent.family.guardianPhone} />
                          <InfoField label="وظيفة ولي الأمر" value={selectedStudent.family.guardianJob} />
                          <InfoField label="الرقم القومي لولي الأمر" value={selectedStudent.family.guardianNationalId} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Qualification Tab */}
              {activeTab === 'qualification' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ScrollText className="text-primary-600" size={20} />
                      المؤهل السابق
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InfoField label="نوع المؤهل" value={
                        selectedStudent.qualification.qualificationType === 'thanaweya_amma' ? 'ثانوية عامة' :
                          selectedStudent.qualification.qualificationType === 'thanaweya_azharia' ? 'ثانوية أزهرية' :
                            selectedStudent.qualification.qualificationType === 'stem' ? 'STEM' : 'معادل'
                      } />
                      <InfoField label="سنة المؤهل" value={selectedStudent.qualification.qualificationYear} />
                      <InfoField label="المدرسة" value={selectedStudent.qualification.schoolName} />
                      <InfoField label="رقم الجلوس" value={selectedStudent.qualification.seatNumber} />
                      <InfoField label="المجموع الكلي" value={selectedStudent.qualification.totalDegree} />
                      <InfoField label="النسبة المئوية" value={`%${selectedStudent.qualification.percentage}`} />
                      <InfoField label="الشعبة" value={
                        selectedStudent.qualification.division === 'scientific_science' ? 'علمي علوم' :
                          selectedStudent.qualification.division === 'scientific_math' ? 'علمي رياضة' : 'أدبي'
                      } />
                      <InfoField label="تاريخ المؤهل" value={selectedStudent.qualification.qualificationDate} />
                    </div>
                  </div>
                </div>
              )}

              {/* Military Tab */}
              {activeTab === 'military' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="text-primary-600" size={20} />
                      بيانات التجنيد
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {isEditingExisting ? (
                        <>
                          <SelectField label="الموقف من التجنيد" options={['مؤجل', 'معاف', 'مجند', 'لم يحل الدور']}
                            value={editForm.military_status}
                            onChange={(v: string) => setEditForm({ ...editForm, military_status: v })} />
                          <InfoField label="الرقم الثلاثي" value={selectedStudent.military.tripleNumber} />
                          <InfoField label="تاريخ التأجيل" value={selectedStudent.military.postponementDate} />
                          <InfoField label="سبب التأجيل" value={selectedStudent.military.postponementReason} />
                          <InputField label="ملاحظات عسكرية" placeholder="ملاحظات إضافية" fullWidth
                            value={editForm.military_notes}
                            onChange={(v: string) => setEditForm({ ...editForm, military_notes: v })} />
                        </>
                      ) : (
                        <>
                          <InfoField label="الموقف من التجنيد" value={selectedStudent.military.status} />
                          <InfoField label="الرقم الثلاثي" value={selectedStudent.military.tripleNumber} />
                          <InfoField label="تاريخ التأجيل" value={selectedStudent.military.postponementDate} />
                          <InfoField label="سبب التأجيل" value={selectedStudent.military.postponementReason} />
                          <InfoField label="ملاحظات عسكرية" value={selectedStudent.military.notes} fullWidth />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Military Education Tab */}
              {activeTab === 'military_edu' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="text-primary-600" size={20} />
                      التربية العسكرية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InfoField label="الحالة" value={
                        selectedStudent.militaryEducation.status === 'completed' ? 'تخرج' :
                          selectedStudent.militaryEducation.status === 'exempt' ? 'معاف' : 'لم يكمل'
                      } />
                      <InfoField label="تاريخ الإتمام" value={selectedStudent.militaryEducation.completionDate} />
                      <InfoField label="ملاحظات" value={selectedStudent.militaryEducation.notes} fullWidth />
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Tab */}
              {activeTab === 'medical' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <HeartPulse className="text-primary-600" size={20} />
                      الكشف الطبي
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {isEditingExisting ? (
                        <>
                          <SelectField label="الحالة الطبية" options={['لائق', 'غير لائق', 'ذوي احتياجات خاصة']}
                            value={editForm.medical_status}
                            onChange={(v: string) => setEditForm({ ...editForm, medical_status: v })} />
                          <SelectField label="فصيلة الدم" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                            value={editForm.blood_type}
                            onChange={(v: string) => setEditForm({ ...editForm, blood_type: v })} />
                          <InfoField label="التطعيم" value={selectedStudent.medical.vaccinationStatus} />
                          <InfoField label="تاريخ آخر كشف" value={selectedStudent.medical.lastCheckupDate} />
                        </>
                      ) : (
                        <>
                          <InfoField label="الحالة الطبية" value={selectedStudent.medical.medicalStatus || '-'} />
                          <InfoField label="فصيلة الدم" value={selectedStudent.medical.bloodType} />
                          <InfoField label="التطعيم" value={selectedStudent.medical.vaccinationStatus} />
                          <InfoField label="تاريخ آخر كشف" value={selectedStudent.medical.lastCheckupDate} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Tab */}
              {activeTab === 'academic' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="text-primary-600" size={20} />
                      البيانات الدراسية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <InfoField label="الكود الجامعي" value={selectedStudent.academic.studentCode} />
                      <InfoField label="حالة القيد" value={selectedStudent.academic.status === 'active' ? 'مقيد' : selectedStudent.academic.status} />
                      <InfoField label="الكلية" value={selectedStudent.academic.faculty} />
                      <InfoField label="القسم" value={selectedStudent.academic.department} />
                      <InfoField label="البرنامج" value={selectedStudent.academic.program} fullWidth />
                      <InfoField label="المستوى الحالي" value={selectedStudent.academic.level} />
                      <InfoField label="عام الالتحاق" value={selectedStudent.academic.enrollmentYear} />

                      <div className="col-span-1 md:col-span-2 xl:col-span-3 mt-4 p-4 bg-primary-50 rounded-lg border border-primary-100 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-primary-500 flex items-center justify-center text-primary-700 font-bold text-xl shadow-sm">
                          {selectedStudent.academic.gpa}
                        </div>
                        <div>
                          <p className="text-sm text-primary-800 font-bold">المعدل التراكمي (GPA)</p>
                          <p className="text-xs text-primary-600">تقدير عام جيد جداً</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Tab */}
              {activeTab === 'registration' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="text-primary-600" size={20} />
                        المقررات المسجلة
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-bold text-primary-600">{studentEnrollments.length}</span>
                        <span>مقرر</span>
                        <span className="mx-2">|</span>
                        <span className="font-bold text-primary-600">
                          {studentEnrollments.reduce((sum, e) => {
                            const course = allCourses.find(c => c.id === e.course_id);
                            return sum + (course ? (course.hours || 3) : 0);
                          }, 0)}
                        </span>
                        <span>ساعة معتمدة</span>
                      </div>
                    </div>
                    
                    {studentEnrollments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="mx-auto mb-2 text-gray-400" size={32} />
                        <p>لا توجد مقررات مسجلة</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {studentEnrollments.map((enrollment, index) => {
                          const course = allCourses.find(c => c.id === enrollment.course_id);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                    {enrollment.course_id}
                                  </span>
                                  <h3 className="font-bold text-gray-900">{enrollment.course_name || course?.name}</h3>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                  <span>{course?.hours || 0} ساعات</span>
                                  <span>•</span>
                                  <span>المستوى {course?.level || '-'}</span>
                                  <span>•</span>
                                  <span>{enrollment.semester || '2024-2025 خريف'}</span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                enrollment.status === 'مسجل' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {enrollment.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Committees Tab */}
              {activeTab === 'committees' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border p-6 rounded-xl border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="text-primary-600" size={20} />
                      اللجان الامتحانية وأرقام الجلوس
                    </h3>
                    
                    {(() => {
                      // Find student in dbStudents
                      const allStudent = dbStudents.find(s => 
                        s.student_id === selectedStudent.id ||
                        s.name === selectedStudent.personal.name
                      );
                      
                      if (!allStudent) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <Building2 className="mx-auto mb-2 text-gray-400" size={32} />
                            <p>لا توجد بيانات لجان متاحة</p>
                          </div>
                        );
                      }

                      const studentAssignments = committeeAssignments.filter(
                        a => a.studentId === allStudent.student_id
                      );

                      if (studentAssignments.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <Building2 className="mx-auto mb-2 text-gray-400" size={32} />
                            <p>لم يتم توزيعك على أي لجنة بعد</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          {studentAssignments.map((assignment, index) => {
                            const committee = committees.find(c => c.id === assignment.committeeId);
                            return (
                              <div
                                key={index}
                                className="p-5 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-200"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-base mb-1">
                                      {assignment.committeeName}
                                    </h4>
                                    {assignment.courseName && (
                                      <p className="text-sm text-gray-600">{assignment.courseName}</p>
                                    )}
                                  </div>
                                  <div className="bg-primary-600 text-white px-4 py-2 rounded-lg text-center min-w-[80px]">
                                    <p className="text-xs font-medium mb-1">رقم الجلوس</p>
                                    <p className="text-xl font-bold font-mono">{assignment.seatNumber}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin size={16} />
                                    <span className="font-medium">القاعة:</span>
                                    <span>{assignment.roomCode}</span>
                                  </div>
                                  {assignment.examDate && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <Calendar size={16} />
                                      <span className="font-medium">التاريخ:</span>
                                      <span>{assignment.examDate}</span>
                                    </div>
                                  )}
                                  {assignment.examTime && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <Clock size={16} />
                                      <span className="font-medium">الوقت:</span>
                                      <span>{assignment.examTime}</span>
                                    </div>
                                  )}
                                  {assignment.row && assignment.column && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <span className="font-medium">الموقع:</span>
                                      <span>الصف {assignment.row} - العمود {assignment.column}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <User size={64} className="mb-4 opacity-50" />
            <p className="text-lg">
              {filteredStudents.length === 0
                ? 'لا توجد بيانات طلاب مطابقة للمعايير'
                : 'اختر طالباً من القائمة لعرض البيانات'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { StudentDataManagement };
