import React from 'react';
import { STUDENT_NAVIGATION } from '../constants';

interface StudentDashboardProps {
  onNavigate: (id: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">بوابة الطالب</h1>
        <p className="text-gray-500 mt-2 text-lg">أهلاً بك، أحمد محمد | المستوى الثالث | قسم علوم الحاسب</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STUDENT_NAVIGATION.map((item) => (
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