import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, DollarSign, BookOpen, TrendingUp, ArrowRight, Calendar, ClipboardCheck, Clock, BarChart3 } from 'lucide-react';
import { FACULTIES } from '../constants';
import { StatCardProps } from '../types';
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
}

const FacultyAnalytics: React.FC<FacultyAnalyticsProps> = ({ facultyId, onBack }) => {
  const [selectedView, setSelectedView] = useState<string>('analytics'); // 'analytics' or activity category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const faculty = FACULTIES.find(f => f.id === facultyId);
  
  if (!faculty) {
    return <div>الكلية غير موجودة</div>;
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
  ];

  // Generate analytics data based on faculty
  const levelDistribution = [
    { name: 'المستوى 1', students: Math.floor(faculty.studentCount * 0.3) },
    { name: 'المستوى 2', students: Math.floor(faculty.studentCount * 0.28) },
    { name: 'المستوى 3', students: Math.floor(faculty.studentCount * 0.25) },
    { name: 'المستوى 4', students: Math.floor(faculty.studentCount * 0.17) },
  ];

  const feesData = [
    { name: 'مسدد', value: Math.floor(faculty.studentCount * 0.85) },
    { name: 'غير مسدد', value: Math.floor(faculty.studentCount * 0.15) },
  ];

  const totalRevenue = faculty.studentCount * 6000;
  const paidRevenue = feesData[0].value * 6000;
  const paymentRate = Math.round((feesData[0].value / faculty.studentCount) * 100);

  const COLORS = ['#102a43', '#f59e0b'];

  // Generate activity log data based on faculty with categories
  const generateActivities = (): ActivityItem[] => {
    const now = new Date();
    const activities: ActivityItem[] = [];
    
    // Schedules activities
    activities.push({
      id: '1',
      timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
      user: 'أ.د. عميد الكلية',
      action: 'edit',
      entity: 'جدول دراسي',
      details: `تم تعديل موعد محاضرة مقرر CS301 من 10:00 إلى 12:00`,
      faculty: faculty.name,
      category: 'schedules'
    });

    activities.push({
      id: '5',
      timestamp: new Date(now.getTime() - 6 * 3600000).toISOString(),
      user: 'أ.د. عميد الكلية',
      action: 'add',
      entity: 'قاعة دراسية',
      details: `تم تخصيص قاعة 301 لمقرر CS401 - المجموعة A`,
      faculty: faculty.name,
      category: 'schedules'
    });

    // Courses activities
    activities.push({
      id: '2',
      timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
      user: 'د. أحمد محمد',
      action: 'add',
      entity: 'مقرر دراسي',
      details: `تم إضافة مقرر جديد "الذكاء الاصطناعي المتقدم" للمستوى الرابع`,
      faculty: faculty.name,
      category: 'courses'
    });

    // Students activities
    activities.push({
      id: '3',
      timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(),
      user: 'أ.د. عميد الكلية',
      action: 'update',
      entity: 'بيانات طالب',
      details: `تم تحديث المعدل التراكمي للطالب 20210055 من 3.2 إلى 3.4`,
      faculty: faculty.name,
      category: 'students'
    });

    activities.push({
      id: '8',
      timestamp: new Date(now.getTime() - 18 * 3600000).toISOString(),
      user: 'د. نورا محمود',
      action: 'add',
      entity: 'حضور طلاب',
      details: `تم تسجيل حضور 45 طالب في محاضرة مقرر برمجة شيئية`,
      faculty: faculty.name,
      category: 'students'
    });

    // Lecturers activities
    activities.push({
      id: '4',
      timestamp: new Date(now.getTime() - 4 * 3600000).toISOString(),
      user: 'د. منال حسن',
      action: 'edit',
      entity: 'توزيع المحاضرين',
      details: `تم تغيير محاضر مقرر CS302 من د. خالد إلى د. سارة`,
      faculty: faculty.name,
      category: 'lecturers'
    });

    // Registration activities
    activities.push({
      id: '6',
      timestamp: new Date(now.getTime() - 8 * 3600000).toISOString(),
      user: 'د. يوسف سعيد',
      action: 'update',
      entity: 'درجات الطلاب',
      details: `تم رصد درجات 25 طالب في مقرر هياكل البيانات`,
      faculty: faculty.name,
      category: 'registration'
    });

    // Fees activities
    activities.push({
      id: '7',
      timestamp: new Date(now.getTime() - 12 * 3600000).toISOString(),
      user: 'أ.د. عميد الكلية',
      action: 'edit',
      entity: 'رسوم طالب',
      details: `تم تعديل حالة رسوم الطالب 20220033 من غير مسدد إلى مسدد`,
      faculty: faculty.name,
      category: 'fees'
    });

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const allActivities = generateActivities();
  
  // Calculate counts for each category
  sidebarItems.forEach(item => {
    if (item.id === 'all') {
      item.count = allActivities.length;
    } else if (item.id !== 'analytics') {
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
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedView(item.id)}
                  className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                    ${isActive
                      ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} />
                    <span className="relative z-10">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-gold-500 text-primary-900' : 'bg-gray-200 text-gray-600'}`}>
                      {item.count}
                    </span>
                  )}
                  {isActive && (
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
                  value={faculty.studentCount.toLocaleString()} 
                  change="+8% عن العام الماضي"
                  icon={Users} 
                  color="bg-primary-700" 
                />
                <StatCard 
                  title="أعضاء هيئة التدريس" 
                  value={faculty.staffCount.toLocaleString()} 
                  change="+5% زيادة"
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
                  title="المقررات الدراسية" 
                  value={faculty.studentCount > 5000 ? '45' : faculty.studentCount > 3000 ? '38' : '32'} 
                  change="محدث"
                  icon={BookOpen} 
                  color="bg-blue-600" 
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Level Distribution */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">توزيع الطلاب حسب المستوى</h3>
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
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
                    <ResponsiveContainer width="100%" height="100%">
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

