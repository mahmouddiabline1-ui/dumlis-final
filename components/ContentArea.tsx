import React from 'react';
import Dashboard from './Dashboard';
import StudentDashboard from './StudentDashboard';
import DynamicPage from './DynamicPage';
import { StudentDataManagement } from './StudentDataManagement';
import ReportSignaturesManagement from './ReportSignaturesManagement';
import StudentRegistrationManagement from './StudentRegistrationManagement';
import CourseManagement from './CourseManagement';
import CommitteeDefinition from './CommitteeDefinition';
import StudentDistribution from './StudentDistribution';
import SeatingNumbers from './SeatingNumbers';
import StudentAcademicView from './StudentAcademicView';
import StudentAffairsAdmin from './StudentAffairsAdmin';
import ExamManagement from './ExamManagement';
import FinanceManagement from './FinanceManagement';
import { getPageConfig } from '../data/pageConfig';
import { UserRole } from '../types';
import DbBackedPage, { isDbBackedPage } from './DbBackedPage';
import DbAttendanceEntry from './DbAttendanceEntry';
import StudentInfoBoard from './StudentInfoBoard';

interface ContentAreaProps {
  activeSubItemId: string | null;
  activeTabLabel: string;
  role: UserRole;
  onNavigate: (id: string) => void;
  selectedFacultyId: string | null;
  globalSearchTerm?: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeSubItemId, activeTabLabel, role, onNavigate, selectedFacultyId, globalSearchTerm }) => {
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
        <Dashboard selectedFacultyId={selectedFacultyId} />
      </div>
    );
  }

  // Handle course management page
  if (activeSubItemId === 'course_management') {
    return (
      <div className="p-0 animate-fade-in w-full max-w-full">
        <CourseManagement onClose={() => onNavigate('')} selectedFacultyId={selectedFacultyId} />
      </div>
    );
  }

  // Handle Report Signatures page
  if (activeSubItemId === 'report_signs') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <ReportSignaturesManagement />
      </div>
    );
  }

  // Handle Academic Registration page
  if (activeSubItemId === 'academic_reg') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <StudentRegistrationManagement selectedFacultyId={selectedFacultyId} />
      </div>
    );
  }

  // Handle Committee Definition page
  if (activeSubItemId === 'comm_def') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <CommitteeDefinition />
      </div>
    );
  }

  // Handle Student Distribution page
  if (activeSubItemId === 'dist_students') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <StudentDistribution selectedFacultyId={selectedFacultyId} />
      </div>
    );
  }

  // Handle Seating Numbers page
  if (activeSubItemId === 'seat_nums') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <SeatingNumbers selectedFacultyId={selectedFacultyId} />
      </div>
    );
  }

  // Handle Student Academic Registration page (for students)
  if (activeSubItemId === 'academic_reg_student' && role === 'student') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <StudentAcademicView />
      </div>
    );
  }

  // Handle Student Affairs (Admin) page
  if (activeSubItemId === 'student_affairs_requirements' && role !== 'student') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <StudentAffairsAdmin facultyId={selectedFacultyId} />
      </div>
    );
  }

  if (activeSubItemId === 'add_attendance') {
    return (
      <div className="p-6 md:p-8 animate-fade-in w-full max-w-full h-full">
        <DbAttendanceEntry facultyId={selectedFacultyId} />
      </div>
    );
  }

  // Handle Exam Management page
  if (activeSubItemId === 'exam_management') {
    return (
      <div className="p-0 animate-fade-in w-full max-w-full">
        <ExamManagement activeFacultyId={selectedFacultyId} />
      </div>
    );
  }

  // Handle Finance Management page
  if (activeSubItemId === 'finance_management') {
    return (
      <div className="p-0 animate-fade-in w-full max-w-full">
        <FinanceManagement activeFacultyId={selectedFacultyId} />
      </div>
    );
  }

  // Student back navigation bar — shown on every student inner page
  const StudentBackBar = role === 'student' ? (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 text-sm shadow-sm">
      <button
        onClick={() => onNavigate('')}
        className="flex items-center gap-1.5 text-primary-700 hover:text-primary-900 font-medium transition-colors"
      >
        <span className="text-base">→</span>
        الرئيسية
      </button>
      <span className="text-gray-300">/</span>
      <span className="text-gray-600 font-medium">{getPageConfig(activeSubItemId, selectedFacultyId).title}</span>
    </div>
  ) : null;

  // لوحة المعلومات — admin sees analytics dashboard, students see announcements board
  if (activeSubItemId === 'info_board') {
    if (role === 'student') {
      return (
        <div className="animate-fade-in">
          {StudentBackBar}
          <StudentInfoBoard />
        </div>
      );
    }
    return (
      <div className="p-8 animate-fade-in">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">لوحة المعلومات</h1>
          <p className="text-gray-500 mt-2 text-lg">نظرة عامة على الإحصائيات والأداء الحالي للنظام</p>
        </div>
        <Dashboard selectedFacultyId={selectedFacultyId} />
      </div>
    );
  }

  if (isDbBackedPage(activeSubItemId)) {
    const dbPageConfig = getPageConfig(activeSubItemId, selectedFacultyId);
    return (
      <div className="animate-fade-in w-full max-w-full h-full">
        {StudentBackBar}
        <div className="p-6 md:p-8">
          <DbBackedPage pageId={activeSubItemId} title={dbPageConfig.title} facultyId={selectedFacultyId} initialSearchTerm={globalSearchTerm} />
        </div>
      </div>
    );
  }

  // Get configuration from our mock database
  // Now passing selectedFacultyId to enable filtering based on context
  const pageConfig = getPageConfig(activeSubItemId, selectedFacultyId);

  // Handle student data management page and regulation pages
  if (pageConfig.type === 'student_data' || pageConfig.id === 'old_regulation_students' || pageConfig.id === 'new_regulation_students') {
    const regulationFilter =
      pageConfig.id === 'old_regulation_students' ? 'old' :
        pageConfig.id === 'new_regulation_students' ? 'new' : undefined;

    return (
      <div className="w-full h-full overflow-hidden">
        <StudentDataManagement
          regulationFilter={regulationFilter}
          selectedFacultyId={selectedFacultyId}
        />
      </div>
    );
  }

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

      <DynamicPage
        config={pageConfig}
        initialSearchTerm={globalSearchTerm}
        selectedFacultyId={selectedFacultyId}
      />
    </div>
  );
};

export default ContentArea;