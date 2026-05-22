import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Building2, Calendar, Clock, MapPin, AlertCircle, FileText, Download, Printer, RefreshCw } from 'lucide-react';
import { 
  studentsApi, 
  enrollmentsApi, 
  coursesApi, 
  committeesApi 
} from '../api';
import { StudentCommitteeAssignment } from '../data/committeesData';

const StudentAcademicView: React.FC = () => {
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [committeeAssignments, setCommitteeAssignments] = useState<StudentCommitteeAssignment[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get student ID from localStorage or use a default for demo
      const studentId = localStorage.getItem('currentStudentId') || '20210001';
      
      // Fetch data in parallel
      const [student, studentEnrollments, courses, committees] = await Promise.all([
        studentsApi.get(studentId),
        enrollmentsApi.list({ student_id: studentId, status: 'مسجل' }),
        coursesApi.list(),
        committeesApi.list()
      ]);

      if (!student) {
        throw new Error('لم يتم العثور على بيانات الطالب');
      }

      setCurrentStudent(student);
      setEnrollments(studentEnrollments);
      setAllCourses(courses);

      // Fetch committee assignments from DB
      try {
        const studentAssignments = await committeesApi.listAssignments({ student_id: studentId });
        setCommitteeAssignments(studentAssignments.map(a => ({
          id: String(a.id),
          studentId: a.student_id,
          studentName: student.name,
          studentCode: a.student_id,
          committeeId: String(a.committee_id),
          committeeName: a.committee_name || `لجنة رقم ${a.committee_id}`,
          roomCode: a.room_code || '',
          seatNumber: a.seat_number || '-',
          courseName: a.course_name || '',
          examDate: a.exam_date || '',
          examTime: a.exam_time || ''
        })) as any[]);
      } catch (err) {
        console.error("Failed to fetch committee assignments from DB:", err);
        setCommitteeAssignments([]);
      }
    } catch (err: any) {
      console.error('Error fetching academic data:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !currentStudent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-gray-900 font-bold mb-2">{error || 'لا توجد بيانات طالب متاحة'}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const totalHours = enrollments.reduce((sum, e) => {
    const course = allCourses.find(c => c.id === e.course_id);
    return sum + (course ? (course.credit_hours || course.hours || 0) : 0);
  }, 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-right" dir="rtl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">التسجيل الأكاديمي</h1>
            <p className="text-primary-100">عرض بيانات التسجيل واللجان وأرقام الجلوس</p>
          </div>
          <div className="text-left">
            <p className="text-lg font-bold">{currentStudent.name}</p>
            <p className="text-sm text-primary-200">{currentStudent.student_id}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Column (Arabic context) - Registration Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-primary-600" />
                المعلومات الأكاديمية
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">الكلية</p>
                  <p className="font-bold text-blue-700">{currentStudent.faculty_id || currentStudent.faculty}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">القسم</p>
                  <p className="font-bold text-purple-700">{currentStudent.department_id || currentStudent.department || 'عام'}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">المستوى</p>
                  <p className="font-bold text-green-700">{currentStudent.level}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">المعدل</p>
                  <p className="font-bold text-orange-700">{currentStudent.gpa}</p>
                </div>
              </div>
            </div>

            {/* Registered Courses */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen size={20} className="text-primary-600" />
                  المقررات المسجلة
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-bold text-primary-600">{enrollments.length}</span>
                  <span>مقرر</span>
                  <span className="mx-2">|</span>
                  <span className="font-bold text-primary-600">{totalHours}</span>
                  <span>ساعة معتمدة</span>
                </div>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="mx-auto mb-2 text-gray-400" size={32} />
                  <p>لا توجد مقررات مسجلة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment, index) => {
                    const course = allCourses.find(c => c.id === enrollment.course_id);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                              {enrollment.course_id}
                            </span>
                            <h3 className="font-bold text-gray-900">{enrollment.course_name || course?.name}</h3>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                            <span>{course?.credit_hours || course?.hours || 0} ساعات</span>
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

          {/* Left Column (Arabic context) - Committee & Seating Info */}
          <div className="space-y-6">
            {/* Committee Assignments */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-primary-600" />
                اللجان الامتحانية
              </h2>
              
              {committeeAssignments.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Building2 className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm">لم يتم توزيعك على أي لجنة بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {committeeAssignments.map((assignment, index) => {
                    return (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-right">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">
                              {assignment.committeeName}
                            </h3>
                            {assignment.courseName && (
                              <p className="text-xs text-gray-600">{assignment.courseName}</p>
                            )}
                          </div>
                          <div className="bg-primary-600 text-white px-3 py-1 rounded-lg text-center min-w-[60px]">
                            <p className="text-xs font-medium mb-0.5">رقم الجلوس</p>
                            <p className="text-lg font-bold font-mono">{assignment.seatNumber}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-xs text-right">
                          <div className="flex items-center gap-2 text-gray-700 justify-end">
                            <span>{assignment.roomCode}</span>
                            <span className="font-medium">:القاعة</span>
                            <MapPin size={14} />
                          </div>
                          {assignment.examDate && (
                            <div className="flex items-center gap-2 text-gray-700 justify-end">
                              <span>{assignment.examDate}</span>
                              <span className="font-medium">:التاريخ</span>
                              <Calendar size={14} />
                            </div>
                          )}
                          {assignment.examTime && (
                            <div className="flex items-center gap-2 text-gray-700 justify-end">
                              <span>{assignment.examTime}</span>
                              <span className="font-medium">:الوقت</span>
                              <Clock size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary-600" />
                ملخص سريع
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">المقررات المسجلة</span>
                  <span className="font-bold text-blue-700">{enrollments.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">الساعات المعتمدة</span>
                  <span className="font-bold text-purple-700">{totalHours}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">اللجان المخصصة</span>
                  <span className="font-bold text-green-700">{committeeAssignments.length}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Printer size={16} />
                طباعة
              </button>
              <button
                onClick={() => {
                  const data = {
                    student: currentStudent,
                    enrollments,
                    committeeAssignments
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `student_data_${currentStudent.student_id}.json`;
                  a.click();
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Download size={16} />
                تصدير
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicView;
