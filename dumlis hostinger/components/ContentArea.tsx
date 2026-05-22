import React from 'react';
import Dashboard from './Dashboard';
import StudentDashboard from './StudentDashboard';
import DynamicPage from './DynamicPage';
import { getPageConfig } from '../data/mockData';
import { UserRole } from '../types';

interface ContentAreaProps {
  activeSubItemId: string | null;
  activeTabLabel: string;
  role: UserRole;
  onNavigate: (id: string) => void;
  selectedFacultyId: string | null;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeSubItemId, activeTabLabel, role, onNavigate, selectedFacultyId }) => {
  // If no sub-item selected:
  // 1. If Admin -> Show Admin Dashboard (Charts)
  // 2. If Student -> Show Student Services Grid
  if (!activeSubItemId) {
    if (role === 'student') {
        return <StudentDashboard onNavigate={onNavigate} />;
    }
    return (
      <div className="p-8 animate-fade-in">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">لوحة المعلومات</h1>
          <p className="text-gray-500 mt-2 text-lg">نظرة عامة على الإحصائيات والأداء الحالي للنظام</p>
        </div>
        <Dashboard />
      </div>
    );
  }

  // Get configuration from our mock database
  // Now passing selectedFacultyId to enable filtering based on context
  const pageConfig = getPageConfig(activeSubItemId, selectedFacultyId);

  return (
    <div className="p-6 md:p-8 animate-fade-in w-full max-w-full">
       {/* Breadcrumb */}
       <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
          <span onClick={() => onNavigate('')} className="hover:text-primary-600 cursor-pointer transition-colors">الرئيسية</span>
          <span className="text-gray-300 text-xs">/</span>
          {role !== 'student' && (
             <>
                 <span className="text-primary-800">{activeTabLabel}</span>
                 <span className="text-gray-300 text-xs">/</span>
             </>
          )}
          <span className="text-gold-600 font-bold">{pageConfig.title}</span>
      </div>

      <DynamicPage config={pageConfig} />
    </div>
  );
};

export default ContentArea;