import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, AlertTriangle, Info, Save, Eye, X, Clock } from 'lucide-react';

interface SmartFormProps {
  config: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const SmartForm: React.FC<SmartFormProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState<any>({});
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const formConfig = config.data[0];
  const students = formConfig.students_lookup;
  const rules = formConfig.academic_rules;
  const prerequisites = formConfig.course_prerequisites;
  const departmentCourses = formConfig.department_courses;
  const messages = formConfig.validation_messages;

  // Handle student ID input and lookup
  const handleStudentIdChange = (studentId: string) => {
    setFormData({ ...formData, student_id: studentId });
    
    if (studentId.length >= 8) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        setSelectedStudent(student);
        setFormData({
          ...formData,
          student_id: studentId,
          student_name: student.name,
          level: student.level,
          department: student.department,
          regulation: student.regulation
        });
        
        // Load available courses for this student
        loadAvailableCoursesForStudent(student);
      } else {
        setSelectedStudent(null);
        setValidationErrors([messages.student_not_found]);
      }
    }
  };

  // Load courses available for the student based on level and department
  const loadAvailableCoursesForStudent = (student: any) => {
    const studentLevel = parseInt(student.level.replace('المستوى ', ''));
    let courses = [];

    if (student.department === 'عام') {
      courses = departmentCourses['عام'].filter(course => course.level <= studentLevel);
    } else {
      courses = departmentCourses[student.department]?.filter(course => course.level <= studentLevel) || [];
    }

    // Add course enrollment info
    const coursesWithInfo = courses.map(course => ({
      ...course,
      enrolled_count: Math.floor(Math.random() * 40) + 10,
      max_capacity: 50,
      instructor: 'د. محمد أحمد',
      schedule: 'الأحد والثلاثاء 10:00-12:00'
    }));

    setAvailableCourses(coursesWithInfo);
  };

  // Handle course selection
  const handleCourseToggle = (course: any) => {
    const isSelected = selectedCourses.find(c => c.id === course.id);
    
    if (isSelected) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // Calculate total hours
  const calculateTotalHours = () => {
    return selectedCourses.reduce((total, course) => total + course.hours, 0);
  };

  // Validate registration
  const validateRegistration = () => {
    setIsValidating(true);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!selectedStudent) {
      errors.push(messages.student_not_found);
      setValidationErrors(errors);
      setIsValidating(false);
      return;
    }

    const totalHours = calculateTotalHours();
    const studentLevel = selectedStudent.level;

    // Check minimum and maximum hours
    if (totalHours < rules.min_hours_per_semester) {
      errors.push(`${messages.min_hours_not_met} (الحد الأدنى: ${rules.min_hours_per_semester} ساعة)`);
    }

    if (totalHours > rules.max_hours_per_semester) {
      errors.push(`${messages.max_hours_exceeded} (الحد الأقصى: ${rules.max_hours_per_semester} ساعة)`);
    }

    // Check course count limits
    const minCourses = rules.min_courses_per_level[studentLevel];
    const maxCourses = rules.max_courses_per_level[studentLevel];

    if (selectedCourses.length < minCourses) {
      warnings.push(`عدد المقررات أقل من المُوصى به (الحد الأدنى: ${minCourses} مقررات)`);
    }

    if (selectedCourses.length > maxCourses) {
      errors.push(`عدد المقررات يتجاوز الحد الأقصى (الحد الأقصى: ${maxCourses} مقررات)`);
    }

    // Check GPA requirements
    const gpaRequirement = rules.gpa_requirements[studentLevel];
    if (gpaRequirement && parseFloat(selectedStudent.gpa) < gpaRequirement) {
      warnings.push(`${messages.insufficient_gpa} (المطلوب: ${gpaRequirement}، الحالي: ${selectedStudent.gpa})`);
    }

    // Check prerequisites
    selectedCourses.forEach(course => {
      const prereqs = prerequisites[course.id];
      if (prereqs) {
        // This is a simplified check - in real system, you'd check actual student transcript
        const missingPrereqs = prereqs.filter(prereq => 
          !selectedCourses.find(sc => sc.id === prereq)
        );
        if (missingPrereqs.length > 0) {
          warnings.push(`${course.name}: قد تحتاج للمتطلبات السابقة: ${missingPrereqs.join(', ')}`);
        }
      }
    });

    setValidationErrors(errors);
    setValidationWarnings(warnings);
    setIsValidating(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    validateRegistration();
    
    if (validationErrors.length === 0) {
      const registrationData = {
        student_id: selectedStudent.id,
        student_name: selectedStudent.name,
        level: selectedStudent.level,
        department: selectedStudent.department,
        courses: selectedCourses,
        total_hours: calculateTotalHours(),
        registration_date: new Date().toISOString(),
        status: 'مسجل'
      };
      
      onSave(registrationData);
    }
  };

  useEffect(() => {
    if (selectedCourses.length > 0) {
      validateRegistration();
    }
  }, [selectedCourses]);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
        <p className="text-gray-600">{config.description}</p>
      </div>

      {/* Student Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">بيانات الطالب</h3>
          
          {/* Student ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">كود الطالب *</label>
            <div className="relative">
              <input
                type="text"
                value={formData.student_id || ''}
                onChange={(e) => handleStudentIdChange(e.target.value)}
                placeholder="أدخل كود الطالب (8 أرقام)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={8}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Student Details (Auto-filled) */}
          {selectedStudent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                تم العثور على بيانات الطالب
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">الاسم:</span>
                  <p className="text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المستوى:</span>
                  <p className="text-gray-900">{selectedStudent.level}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">القسم:</span>
                  <p className="text-gray-900">{selectedStudent.department}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المعدل:</span>
                  <p className="text-gray-900">{selectedStudent.gpa}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Registration Summary */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">ملخص التسجيل</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">عدد المقررات المختارة:</span>
              <span className="font-semibold text-gray-900">{selectedCourses.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">إجمالي الساعات:</span>
              <span className="font-semibold text-gray-900">{calculateTotalHours()} ساعة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الحد المسموح:</span>
              <span className="text-sm text-gray-500">{rules.min_hours_per_semester} - {rules.max_hours_per_semester} ساعة</span>
            </div>
          </div>

          {/* Validation Results */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertTriangle className="w-5 h-5" />
                أخطاء في التسجيل
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {validationWarnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                <Info className="w-5 h-5" />
                تحذيرات
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Available Courses */}
      {availableCourses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">المقررات المتاحة</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCourses.map((course) => {
              const isSelected = selectedCourses.find(c => c.id === course.id);
              
              return (
                <div
                  key={course.id}
                  onClick={() => handleCourseToggle(course)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.id}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>الساعات:</span>
                      <span>{course.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المستوى:</span>
                      <span>{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>النوع:</span>
                      <span>{course.type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Courses Summary */}
      {selectedCourses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">المقررات المختارة</h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              {selectedCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <span className="font-medium text-gray-900">{course.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({course.id})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{course.hours} ساعة</span>
                    <button
                      onClick={() => handleCourseToggle(course)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">تعليمات التسجيل</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {formConfig.instructions.steps.map((step: string, index: number) => (
            <li key={index}>• {step}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={validateRegistration}
            disabled={!selectedStudent || isValidating}
            className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'التحقق من القواعد'
            )}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!selectedStudent || selectedCourses.length === 0 || validationErrors.length > 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ التسجيل
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartForm;




