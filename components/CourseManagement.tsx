import React, { useState, useEffect } from 'react';
import { 
  Award, Plus, X, Save, Trash2, Edit, Search, 
  BookOpen, CheckCircle2
} from 'lucide-react';
import { 
  coursesApi, 
  departmentsApi, 
  programsApi, 
  Department, 
  ProgramResponse, 
  Course 
} from '../api';

interface CourseManagementProps {
  onClose: () => void;
  selectedFacultyId?: string | null;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ onClose, selectedFacultyId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [courseForm, setCourseForm] = useState({
    id: '',
    code: '',
    name: '',
    nameEn: '',
    departmentId: '',
    programId: '',
    theoreticalHours: '',
    practicalHours: '',
    totalHours: '',
    level: '',
    semester: 'خريف',
    type: 'إجباري',
    description: '',
    syllabus: ''
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [depts, progs, cats] = await Promise.all([
          departmentsApi.list(selectedFacultyId || undefined),
          programsApi.list({ faculty_id: selectedFacultyId || undefined }),
          coursesApi.list({ faculty_id: selectedFacultyId || undefined })
        ]);
        setDepartments(depts);
        setPrograms(progs);
        setCourses(cats);
      } catch (error) {
        console.error("Failed to load course management data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedFacultyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseForm.programId || !courseForm.departmentId) {
      alert('يرجى اختيار البرنامج والقسم أولاً');
      return;
    }

    try {
      const payload: Partial<Course> = {
        id: courseForm.id || courseForm.code || `C-${Date.now()}`,
        name: courseForm.name,
        name_en: courseForm.nameEn,
        level: parseInt(courseForm.level) || 1,
        department_id: courseForm.departmentId,
        program_id: courseForm.programId,
        credit_hours: parseInt(courseForm.totalHours) || 3,
        course_type: courseForm.type,
        semester: courseForm.semester,
        theoretical_hours: parseInt(courseForm.theoreticalHours) || 0,
        practical_hours: parseInt(courseForm.practicalHours) || 0,
        description: courseForm.description,
        syllabus: courseForm.syllabus
      };

      if (editingCourse) {
        const updated = await coursesApi.update(editingCourse, payload);
        setCourses(courses.map(c => c.id === editingCourse ? updated : c));
        setEditingCourse(null);
        alert('تم تحديث المقرر بنجاح!');
      } else {
        const created = await coursesApi.create(payload);
        setCourses([...courses, created]);
        alert('تم إضافة المقرر بنجاح!');
      }

      // Reset form
      handleCancel();
    } catch (error: any) {
      console.error("Save Error:", error);
      alert(error.message || 'فشل حفظ المقرر في قاعدة البيانات');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course.id);
    setCourseForm({
      id: course.id,
      code: course.id,
      name: course.name,
      nameEn: course.name_en || '',
      departmentId: course.department_id || '',
      programId: course.program_id || '',
      theoreticalHours: (course.theoretical_hours || 0).toString(),
      practicalHours: (course.practical_hours || 0).toString(),
      totalHours: (course.credit_hours || 0).toString(),
      level: (course.level || 1).toString(),
      semester: course.semester || 'خريف',
      type: course.course_type || 'إجباري',
      description: course.description || '',
      syllabus: course.syllabus || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (courseId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقرر؟')) {
      try {
        await coursesApi.delete(courseId);
        setCourses(courses.filter(c => c.id !== courseId));
        alert('تم حذف المقرر بنجاح من قاعدة البيانات!');
      } catch (error: any) {
        alert(error.message || 'فشل حذف المقرر');
      }
    }
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setCourseForm({
      id: '', code: '', name: '', nameEn: '', departmentId: '', programId: '',
      theoreticalHours: '', practicalHours: '', totalHours: '',
      level: '', semester: 'خريف', type: 'إجباري', description: '', syllabus: ''
    });
  };

  const filteredCourses = courses.filter(course =>
    course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المقررات الدراسية</h1>
            <p className="text-sm text-gray-600 mt-1">قم بإضافة المقررات الدراسية وربطها بالبرامج والأقسام.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="mb-6 flex items-center gap-3">
             <Award className="w-6 h-6 text-primary-700" />
             <h2 className="text-xl font-bold text-gray-900">{editingCourse ? 'تعديل المقرر' : 'إضافة مقرر جديد'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البرنامج *</label>
                <select
                  value={courseForm.programId}
                  onChange={(e) => setCourseForm({ ...courseForm, programId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">اختر البرنامج</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                <select
                  value={courseForm.departmentId}
                  onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">اختر القسم</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">كود المقرر *</label>
                <input
                  type="text"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                  required
                  disabled={!!editingCourse}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المقرر (عربي) *</label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 md:col-span-1">
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">نظرية</label>
                    <input type="number" value={courseForm.theoreticalHours} onChange={e => setCourseForm({...courseForm, theoreticalHours: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">عملية</label>
                    <input type="number" value={courseForm.practicalHours} onChange={e => setCourseForm({...courseForm, practicalHours: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">إجمالي الساعات</label>
                    <input type="number" value={courseForm.totalHours} onChange={e => setCourseForm({...courseForm, totalHours: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المستوى *</label>
                <select value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})} required className="w-full px-4 py-2 border rounded-lg">
                   {[1,2,3,4].map(l => <option key={l} value={l}>المستوى {l}</option>)}
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">نوع المقرر</label>
                 <select value={courseForm.type} onChange={e => setCourseForm({...courseForm, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                    <option value="إجباري">إجباري</option>
                    <option value="اختياري">اختياري</option>
                    <option value="متطلب جامعة">متطلب جامعة</option>
                 </select>
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-2">توصيف المقرر</label>
                 <textarea value={courseForm.syllabus} onChange={e => setCourseForm({...courseForm, syllabus: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button type="submit" className="px-8 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 flex items-center gap-2">
                {editingCourse ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingCourse ? 'حفظ التعديلات' : 'إضافة المقرر'}
              </button>
              {editingCourse && <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg">إلغاء</button>}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6 flex items-center justify-between">
             <h2 className="text-xl font-bold text-gray-900">قائمة المقررات ({courses.length})</h2>
             <div className="relative w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث في الكود أو الاسم..." className="w-full px-4 py-2 pr-10 border rounded-lg" />
             </div>
          </div>

          <div className="space-y-4">
             {filteredCourses.map(course => (
               <div key={course.id} className="p-5 border rounded-lg hover:shadow-sm flex items-center justify-between">
                 <div>
                   <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{course.id} - {course.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{course.course_type}</span>
                   </div>
                   <div className="text-sm text-gray-500 flex gap-4">
                      <span>الساعات: {course.credit_hours}</span>
                      <span>المستوى: {course.level}</span>
                      <span>{course.semester}</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                 </div>
               </div>
             ))}
             {filteredCourses.length === 0 && (
               <div className="text-center py-10 text-gray-400">لا توجد نتائج مطابقة لبحثك</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
