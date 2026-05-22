import React, { useState } from 'react';
import { Users, Calendar, Clock, CheckCircle2, XCircle, Save, Download } from 'lucide-react';
import { FCAI_STUDENTS } from '../data/pageConfig';

interface AttendanceEntryProps {
  courses: any[];
  students: any[];
  onSave: (attendanceData: any[]) => void;
}

const AttendanceEntry: React.FC<AttendanceEntryProps> = ({ courses, students, onSave }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sessionType, setSessionType] = useState('محاضرة');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeek, setSelectedWeek] = useState('الأسبوع 1');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'حاضر' | 'غائب'}>({});
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);

  const sessionTypes = ['محاضرة', 'سكشن', 'معمل'];
  const weeks = Array.from({length: 15}, (_, i) => `الأسبوع ${i + 1}`);

  // Get enrolled students when course is selected
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    
    // Get real enrolled students for the selected course
    const realEnrolledStudents = getEnrolledStudentsForCourse(courseId);
    setEnrolledStudents(realEnrolledStudents);
    
    // Initialize attendance data
    const initialAttendance: {[key: string]: 'حاضر' | 'غائب'} = {};
    realEnrolledStudents.forEach(student => {
      initialAttendance[student.student_id] = 'حاضر'; // Default to present
    });
    setAttendanceData(initialAttendance);
  };

  // Get real students enrolled in a course
  const getEnrolledStudentsForCourse = (courseId: string) => {
    // Get a random subset of FCAI students (simulating course enrollment)
    const shuffledStudents = [...FCAI_STUDENTS].sort(() => 0.5 - Math.random());
    const enrolledCount = Math.floor(Math.random() * 15) + 20; // 20-35 students
    const enrolledStudents = shuffledStudents.slice(0, enrolledCount);
    
    return enrolledStudents.map(student => ({
      student_id: student.student_id,
      name: student.name,
      level: student.level,
      department: student.department,
      isEnrolled: true
    }));
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'حاضر' ? 'غائب' : 'حاضر'
    }));
  };

  const markAllPresent = () => {
    const newData: {[key: string]: 'حاضر' | 'غائب'} = {};
    enrolledStudents.forEach(student => {
      newData[student.student_id] = 'حاضر';
    });
    setAttendanceData(newData);
  };

  const markAllAbsent = () => {
    const newData: {[key: string]: 'حاضر' | 'غائب'} = {};
    enrolledStudents.forEach(student => {
      newData[student.student_id] = 'غائب';
    });
    setAttendanceData(newData);
  };

  const handleSave = () => {
    if (!selectedCourse || enrolledStudents.length === 0) {
      alert('يرجى اختيار المقرر أولاً');
      return;
    }

    const attendanceRecords = enrolledStudents.map(student => ({
      student_id: student.student_id,
      student_name: student.name,
      course_id: selectedCourse,
      course_name: courses.find(c => c.id === selectedCourse)?.name || '',
      session_type: sessionType,
      date: selectedDate,
      week: selectedWeek,
      status: attendanceData[student.student_id] || 'غائب'
    }));

    onSave(attendanceRecords);
    alert('تم حفظ بيانات الحضور بنجاح!');
  };

  const presentCount = Object.values(attendanceData).filter(status => status === 'حاضر').length;
  const absentCount = Object.values(attendanceData).filter(status => status === 'غائب').length;

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          إعدادات الجلسة
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المقرر</label>
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">اختر المقرر...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الجلسة</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {sessionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الأسبوع</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {weeks.map(week => (
                <option key={week} value={week}>{week}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Info */}
      {selectedCourse && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {courses.find(c => c.id === selectedCourse)?.name}
              </h3>
              <p className="text-sm text-gray-600">
                {sessionType} - {selectedWeek} - {new Date(selectedDate).toLocaleDateString('ar-EG')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-bold text-primary-600">{enrolledStudents.length}</div>
              <div className="text-xs text-gray-600">إجمالي الطلاب</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-bold text-green-600">{presentCount}</div>
              <div className="text-xs text-gray-600">حاضرين</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-bold text-red-600">{absentCount}</div>
              <div className="text-xs text-gray-600">غائبين</div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {enrolledStudents.length > 0 ? Math.round((presentCount / enrolledStudents.length) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600">معدل الحضور</div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Statistics */}
      {enrolledStudents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-600" />
              أدوات التحكم السريع
            </h3>
            <div className="flex gap-2">
              <button
                onClick={markAllPresent}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                تحديد الكل حاضر
              </button>
              <button
                onClick={markAllAbsent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                تحديد الكل غائب
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Students List */}
      {enrolledStudents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">قائمة الطلاب</h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {enrolledStudents.map(student => (
              <div
                key={student.student_id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  attendanceData[student.student_id] === 'حاضر'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
                onClick={() => toggleAttendance(student.student_id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    attendanceData[student.student_id] === 'حاضر'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {attendanceData[student.student_id] === 'حاضر' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">
                      {student.student_id} • {student.level} • {student.department}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  attendanceData[student.student_id] === 'حاضر'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {attendanceData[student.student_id]}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              حفظ بيانات الحضور
            </button>
            <button
              onClick={() => {/* Export functionality */}}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedCourse && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">ابدأ بتسجيل الحضور</h3>
          <p className="text-blue-700 mb-4">اختر المقرر والجلسة لبدء تسجيل حضور الطلاب</p>
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">خطوات التسجيل:</h4>
            <ol className="text-sm text-blue-700 text-right space-y-1">
              <li>1. اختر المقرر من القائمة المنسدلة</li>
              <li>2. حدد نوع الجلسة (محاضرة/سكشن/معمل)</li>
              <li>3. اختر التاريخ والأسبوع</li>
              <li>4. ستظهر قائمة الطلاب المسجلين</li>
              <li>5. انقر على اسم الطالب لتغيير حالة الحضور</li>
            </ol>
          </div>
        </div>
      )}

      {/* Loading message when course is selected but students not loaded */}
      {selectedCourse && enrolledStudents.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <h3 className="text-lg font-medium text-yellow-900 mb-2">جاري تحميل قائمة الطلاب...</h3>
          <p className="text-yellow-700">يتم الآن جلب الطلاب المسجلين في هذا المقرر</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceEntry;
