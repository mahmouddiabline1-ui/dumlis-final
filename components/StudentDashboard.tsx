import React, { useState, useEffect } from 'react';
import { STUDENT_NAVIGATION } from '../constants';
import { studentsApi, attendanceApi, enrollmentsApi, announcementsApi } from '../api';
import { GraduationCap, Users, BookOpen, Bell, TrendingUp } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (id: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({ gpa: '—', attendance: '—', courses: '—' });
  const [latestAnnouncement, setLatestAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem('currentStudentId') || localStorage.getItem('userStudentId') || '';
    const facultyId = localStorage.getItem('userFacultyId') || undefined;

    const load = async () => {
      setLoading(true);
      try {
        const [studentData, attendanceData, enrollmentData, announcementData] = await Promise.allSettled([
          studentsApi.get(studentId),
          attendanceApi.list({ student_id: studentId, limit: 200 } as any),
          enrollmentsApi.listAll({ student_id: studentId, status: 'مسجل' }),
          announcementsApi.list({ faculty_id: facultyId }),
        ]);

        if (studentData.status === 'fulfilled') setStudent(studentData.value);

        const present = attendanceData.status === 'fulfilled'
          ? (attendanceData.value as any[]).filter((a: any) => a.status === 'حاضر' || a.status === 'present').length
          : 0;
        const total = attendanceData.status === 'fulfilled' ? (attendanceData.value as any[]).length : 0;
        const attendancePct = total > 0 ? Math.round((present / total) * 100) + '%' : '—';

        const courseCount = enrollmentData.status === 'fulfilled' ? String((enrollmentData.value as any[]).length) : '—';

        const gpaVal = studentData.status === 'fulfilled' ? (studentData.value as any)?.gpa : null;
        const gpaStr = gpaVal != null ? Number(gpaVal).toFixed(2) : '—';

        setStats({ gpa: gpaStr, attendance: attendancePct, courses: courseCount });

        if (announcementData.status === 'fulfilled' && (announcementData.value as any[]).length > 0) {
          setLatestAnnouncement((announcementData.value as any[])[0]);
        }
      } catch (_) {
        // non-critical
      } finally {
        setLoading(false);
      }
    };
    if (studentId) load(); else setLoading(false);
  }, []);

  const levels = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
  const levelLabel = student?.level ? `المستوى ${levels[student.level] || student.level}` : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-right p-6 md:p-8" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
            {(student?.name || 'ط').charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student?.name || 'بوابة الطالب'}</h1>
            <p className="text-gray-500 text-sm">{levelLabel}{student?.department_id ? ` · ${student.department_id}` : ''}</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">المعدل التراكمي</p>
            <p className="text-xl font-bold text-gray-900">{stats.gpa}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">نسبة الحضور</p>
            <p className="text-xl font-bold text-gray-900">{stats.attendance}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">المقررات المسجلة</p>
            <p className="text-xl font-bold text-gray-900">{stats.courses}</p>
          </div>
        </div>

        {latestAnnouncement ? (
          <button
            onClick={() => onNavigate('info_board')}
            className="bg-amber-50 rounded-xl border border-amber-200 shadow-sm p-4 flex items-start gap-3 text-right hover:bg-amber-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-700 font-medium mb-0.5">آخر إعلان</p>
              <p className="text-sm font-bold text-gray-800 truncate">{latestAnnouncement.title}</p>
            </div>
          </button>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">الكلية</p>
              <p className="text-sm font-bold text-gray-900 truncate">{student?.faculty_id || '—'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation grid */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">الخدمات</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...STUDENT_NAVIGATION].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-primary-200 hover:bg-primary-50/40 transition-all duration-300 group text-center h-36"
          >
            <div className="w-11 h-11 mb-3 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-primary-800 transition-colors">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
