import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, DollarSign, BookOpen, TrendingUp, ArrowRight, Calendar, ClipboardCheck, Clock, BarChart3, Building2, Settings } from 'lucide-react';
import { FACULTIES } from '../constants';
import { StatCardProps } from '../types';
import { departmentsApi, studentsApi } from '../api';
import ActivityLog, { ActivityItem } from './ActivityLog';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {change && <p className="text-xs text-green-600 mt-2 font-medium">{change}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

interface FacultyAnalyticsProps {
  facultyId: string;
  onBack: () => void;
  onManageAcademicStructure?: () => void;
}

const FacultyAnalytics: React.FC<FacultyAnalyticsProps> = ({ facultyId, onBack, onManageAcademicStructure }) => {
  const [selectedView, setSelectedView] = useState<string>('analytics'); // 'analytics' or activity category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Try to find faculty in default list first
  let faculty = FACULTIES.find(f => f.id === facultyId);
  
  if (!faculty) {
    // If not in constants, it might be a custom one from the DB
    // We'll use a placeholder for UI metadata if not found
    faculty = {
      id: facultyId,
      name: `كلية ${facultyId}`,
      icon: '🎓',
      color: 'bg-primary-600',
      studentCount: 0,
      staffCount: 0
    };
  }

  // Sidebar menu items
  const sidebarItems = [
    { id: 'analytics', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'all', label: 'جميع التغييرات', icon: Clock, count: 0 },
    { id: 'schedules', label: 'الجداول الدراسية', icon: Calendar, count: 0 },
    { id: 'courses', label: 'المقررات الدراسية', icon: BookOpen, count: 0 },
    { id: 'students', label: 'بيانات الطلاب', icon: Users, count: 0 },
    { id: 'lecturers', label: 'توزيع المحاضرين', icon: GraduationCap, count: 0 },
    { id: 'registration', label: 'التسجيل الأكاديمي', icon: ClipboardCheck, count: 0 },
    { id: 'fees', label: 'الرسوم المالية', icon: DollarSign, count: 0 },
    ...(onManageAcademicStructure ? [{ id: 'academic_structure', label: 'إدارة الهيكل الأكاديمي', icon: Building2, isAction: true }] : []),
  ];

  // Check if this is a custom faculty (not in default FACULTIES list)
  const isCustomFaculty = !FACULTIES.find(f => f.id === facultyId);
  
  // Get real analytics data based on faculty
  const [departmentStats, setDepartmentStats] = useState<{name: string, students: number}[] | null>(null);
  const [stats, setStats] = useState<any>(null);
  // MUST be declared before any conditional return (Rules of Hooks)
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await studentsApi.statistics(facultyId);
        setStats(s);
      } catch (err) {
        console.error('Failed loading statistics from DB:', err);
        setStats({
          totalStudents: 0,
          levelStats: [],
          feesStats: [],
          activeStudents: 0,
          graduatedStudents: 0,
          suspendedStudents: 0,
          expelledStudents: 0,
          totalRevenue: 0,
          paymentRate: 0
        });
      }

      if (facultyId) {
        try {
          const depts = await departmentsApi.list(facultyId);
          const mappedDepts = depts.map(d => ({
            name: `${d.name} (${d.code})`,
            students: 0
          }));
          setDepartmentStats(mappedDepts);
        } catch (e) {
          console.error("Error fetching depts for analytics:", e);
        }
      }
    };
    fetchData();
  }, [facultyId]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { activityLogsApi } = await import('../api');
        const logs = await activityLogsApi.list({ limit: 200 });
        if ((logs as any[]).length > 0) {
          const mapped: ActivityItem[] = (logs as any[]).map((log: any) => ({
            id: String(log.id),
            timestamp: log.performed_at,
            user: log.username || 'مسؤول النظام',
            action: (log.action as 'add' | 'edit' | 'update' | 'delete') || 'edit',
            entity: log.entity_type || 'بيانات',
            details: log.description || log.action,
            faculty: faculty.name,
            category: log.entity_type?.toLowerCase().includes('schedule') ? 'schedules'
              : log.entity_type?.toLowerCase().includes('course') ? 'courses'
              : log.entity_type?.toLowerCase().includes('student') ? 'students'
              : log.entity_type?.toLowerCase().includes('grade') ? 'registration'
              : log.entity_type?.toLowerCase().includes('financial') ? 'fees'
              : 'all',
          }));
          setAllActivities(mapped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
          return;
        }
      } catch {
        // Fall through to static activities
      }
      // Fallback static activities
      const now = new Date();
      setAllActivities([
        { id: '1', timestamp: new Date(now.getTime() - 15 * 60000).toISOString(), user: 'أ.د. عميد الكلية', action: 'edit', entity: 'جدول دراسي', details: 'تم تعديل موعد محاضرة', faculty: faculty.name, category: 'schedules' },
        { id: '2', timestamp: new Date(now.getTime() - 45 * 60000).toISOString(), user: 'د. أحمد محمد', action: 'add', entity: 'مقرر دراسي', details: 'تم إضافة مقرر جديد للمستوى الرابع', faculty: faculty.name, category: 'courses' },
        { id: '3', timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(), user: 'أ.د. عميد الكلية', action: 'update', entity: 'بيانات طالب', details: 'تم تحديث المعدل التراكمي لطالب', faculty: faculty.name, category: 'students' },
      ]);
    };
    fetchActivities();
  }, [facultyId]);

  // ── Early return AFTER all hooks ─────────────────────────────────
  if (!stats) return <div className="p-8 text-center text-gray-500 font-medium">جاري تحميل الإحصائيات...</div>;

  const levelDistribution = stats.levelStats;
  const feesData = stats.feesStats;
  const totalRevenue = stats.totalRevenue;
  const paymentRate = stats.paymentRate;

  const COLORS = ['#102a43', '#f59e0b'];

  // Calculate counts for each sidebar item
  sidebarItems.forEach(item => {
    if (item.id === 'all') {
      item.count = allActivities.length;
    } else if (item.id !== 'analytics' && !(item as any).isAction) {
      item.count = allActivities.filter(a => a.category === item.id).length;
    }
  });

  // Filter activities based on selected category
  const filteredActivities = selectedView === 'all' 
    ? allActivities 
    : selectedView !== 'analytics'
    ? allActivities.filter(a => a.category === selectedView)
    : [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl ${faculty.color} flex items-center justify-center text-3xl shadow-lg`}>
              {faculty.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{faculty.name}</h1>
              <p className="text-gray-500 mt-1">إحصائيات وتحليل تفصيلي</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white border border-gray-100 rounded-2xl hidden md:flex flex-col h-[calc(100vh-12rem)] overflow-y-auto shadow-sm custom-scrollbar sticky top-24">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50 sticky top-0 z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-50 rounded-lg text-primary-700 shadow-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                القوائم
              </h2>
            </div>
            <p className="text-xs text-gray-500 pr-12 font-medium">اختر القائمة</p>
          </div>

          <div className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedView === item.id;
              const isAction = (item as any).isAction;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isAction && onManageAcademicStructure) {
                      onManageAcademicStructure();
                    } else {
                      setSelectedView(item.id);
                    }
                  }}
                  className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                    ${isActive && !isAction
                      ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20' 
                      : isAction
                      ? 'text-primary-700 hover:bg-primary-50 hover:text-primary-800 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive && !isAction ? 'text-gold-400' : isAction ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className="relative z-10">{item.label}</span>
                  </div>
                  {item.count !== undefined && !isAction && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-gold-500 text-primary-900' : 'bg-gray-200 text-gray-600'}`}>
                      {item.count}
                    </span>
                  )}
                  {isAction && (
                    <Settings className="w-4 h-4 text-primary-600" />
                  )}
                  {isActive && !isAction && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900 z-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {selectedView === 'analytics' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  title="إجمالي الطلاب" 
                  value={stats.totalStudents.toLocaleString()} 
                  change={`${stats.activeStudents} طالب مقيد`}
                  icon={Users} 
                  color="bg-primary-700" 
                />
                <StatCard 
                  title="الخريجين" 
                  value={stats.graduatedStudents.toLocaleString()} 
                  change={`${Math.round((stats.graduatedStudents / stats.totalStudents) * 100)}% من الإجمالي`}
                  icon={GraduationCap} 
                  color="bg-gold-500" 
                />
                <StatCard 
                  title="إجمالي الإيرادات" 
                  value={`${(totalRevenue / 1000000).toFixed(1)}M ج.م`} 
                  change={`${paymentRate}% نسبة السداد`}
                  icon={DollarSign} 
                  color="bg-green-600" 
                />
                <StatCard 
                  title="حالات التعثر" 
                  value={(stats.suspendedStudents + stats.expelledStudents).toString()} 
                  change={`${stats.suspendedStudents} موقوف، ${stats.expelledStudents} مفصول`}
                  icon={BookOpen} 
                  color="bg-red-500" 
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Level Distribution */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">توزيع الطلاب حسب المستوى</h3>
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height={250} minHeight={250}>
                      <BarChart data={levelDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                          cursor={{ fill: '#f0f4f8' }}
                        />
                        <Bar dataKey="students" fill="#102a43" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Fees Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">حالة سداد الرسوم</h3>
                  <div className="h-64 w-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height={250} minHeight={250}>
                      <PieChart>
                        <Pie
                          data={feesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {feesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {feesData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department Distribution for FCAI or custom faculties */}
              {departmentStats && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">توزيع الطلاب حسب القسم</h3>
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height={250} minHeight={250}>
                      <BarChart data={departmentStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                          cursor={{ fill: '#f0f4f8' }}
                        />
                        <Bar dataKey="students" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ActivityLog facultyId={facultyId} activities={filteredActivities} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyAnalytics;

