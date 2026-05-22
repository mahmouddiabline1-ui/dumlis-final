import React, { useState, useEffect } from 'react';
import { STUDENT_NAVIGATION } from '../constants';
import { studentsApi } from '../api';

interface StudentDashboardProps {
  onNavigate: (id: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const studentId = localStorage.getItem('currentStudentId') || '20210001';
        const data = await studentsApi.get(studentId);
        setStudent(data);
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-right" dir="rtl">
      <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">بوابة الطالب</h1>
          <p className="text-gray-500 mt-2 text-lg">
            أهلاً بك، {student?.name || 'أحمد محمد'} | المستوى {student?.level || 'الثالث'} | {student?.department_id || 'قسم علوم الحاسب'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...STUDENT_NAVIGATION].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-primary-200 hover:bg-primary-50/40 transition-all duration-300 group text-center h-40"
          >
            <div className="w-12 h-12 mb-4 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-md">
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-primary-800 transition-colors">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;