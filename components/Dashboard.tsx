import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, DollarSign, AlertCircle } from 'lucide-react';
import { StatCardProps } from '../types';

const COLORS = ['#102a43', '#f59e0b'];

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

interface DashboardProps {
  selectedFacultyId?: string | null;
}

import { studentsApi } from '../api';

const Dashboard: React.FC<DashboardProps> = ({ selectedFacultyId }) => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await studentsApi.statistics(selectedFacultyId);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedFacultyId]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }
  
  // Format revenue display
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ج.م`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K ج.م`;
    }
    return `${amount} ج.م`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي الطلاب" 
          value={stats.totalStudents.toLocaleString()} 
          change={`${stats.activeStudents} طالب مقيد`}
          icon={Users} 
          color="bg-primary-700" 
        />
        <StatCard
          title="الخريجين"
          value={stats.graduatedStudents.toString()}
          change={`${stats.totalStudents > 0 ? Math.round((stats.graduatedStudents / stats.totalStudents) * 100) : 0}% من الإجمالي`}
          icon={GraduationCap}
          color="bg-gold-500"
        />
        <StatCard 
          title="التحصيل المالي" 
          value={formatRevenue(stats.totalRevenue)} 
          change={`${stats.paymentRate}% نسبة السداد`}
          icon={DollarSign} 
          color="bg-green-600" 
        />
        <StatCard 
          title="حالات التعثر" 
          value={(stats.suspendedStudents + stats.expelledStudents).toString()} 
          change={`${stats.suspendedStudents} موقوف، ${stats.expelledStudents} مفصول`}
          icon={AlertCircle} 
          color="bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            توزيع الطلاب حسب المستوى
            {selectedFacultyId === 'FCAI' && <span className="text-sm text-gray-500 mr-2">(كلية الحاسبات)</span>}
          </h3>
          <div className="h-64 w-full" style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.levelStats}>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">حالة سداد الرسوم</h3>
          <div className="h-64 w-full flex justify-center items-center" style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.feesStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.feesStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {stats.feesStats.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm text-gray-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;