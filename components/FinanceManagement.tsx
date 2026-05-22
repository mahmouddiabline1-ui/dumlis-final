import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, AlertCircle, CheckCircle,
  Calendar, User, Filter, Download, RefreshCw
} from 'lucide-react';

interface FinanceManagementProps {
  activeFacultyId?: string | null;
}

interface FinancialRecord {
  id: string;
  student_id: string;
  student_name: string;
  fee_type: string;
  amount: number;
  paid_amount: number;
  remaining: number;
  status: 'مسدد' | 'غير مسدد' | 'مسدد جزئي';
  due_date: string;
  payment_date?: string;
  notes?: string;
}

interface FinancialSummary {
  totalDue: number;
  totalPaid: number;
  totalRemaining: number;
  pendingCount: number;
  collectionRate: number;
}

const FinanceManagement: React.FC<FinanceManagementProps> = ({ activeFacultyId }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalDue: 0,
    totalPaid: 0,
    totalRemaining: 0,
    pendingCount: 0,
    collectionRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'مسدد' | 'غير مسدد' | 'مسدد جزئي'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'due_date' | 'remaining' | 'student_name'>('due_date');

  const loadFinancialData = async () => {
    try {
      setLoading(true);

      // Dynamic import to avoid circular deps
      const { financialApi, studentsApi } = await import('../api');

      // Fetch real data from the API — scoped to activeFacultyId by backend JWT
      const rawRecords = await financialApi.list(
        activeFacultyId ? { faculty_id: activeFacultyId } : {}
      );

      // Build a student name lookup map from a parallel students fetch
      let studentNameMap: Record<string, string> = {};
      try {
        const students = await studentsApi.listAll(
          activeFacultyId ? { faculty_id: activeFacultyId } : {}
        );
        (students as any[]).forEach((s: any) => {
          studentNameMap[s.student_id] = s.name;
        });
      } catch {
        // Non-fatal: names will fall back to student_id
      }

      const mapped: FinancialRecord[] = (rawRecords as any[]).map((r: any) => {
        const amount      = Number(r.amount)      || 0;
        const paid_amount = Number(r.paid_amount) || 0;
        const remaining   = amount - paid_amount;
        let status: 'مسدد' | 'غير مسدد' | 'مسدد جزئي' = 'غير مسدد';
        if (remaining <= 0)         status = 'مسدد';
        else if (paid_amount > 0)   status = 'مسدد جزئي';

        return {
          id:            String(r.id),
          student_id:    r.student_id,
          student_name:  studentNameMap[r.student_id] || r.student_id,
          fee_type:      r.fee_type || 'رسوم عامة',
          amount,
          paid_amount,
          remaining,
          status,
          due_date:      r.due_date      || r.payment_date || '-',
          payment_date:  r.payment_date  || undefined,
        };
      });

      setRecords(mapped);

      // Calculate summary
      const totals = mapped.reduce(
        (acc, record) => ({
          totalDue:       acc.totalDue       + record.amount,
          totalPaid:      acc.totalPaid      + record.paid_amount,
          totalRemaining: acc.totalRemaining + record.remaining,
          pendingCount:   acc.pendingCount   + (record.status === 'غير مسدد' ? 1 : 0),
        }),
        { totalDue: 0, totalPaid: 0, totalRemaining: 0, pendingCount: 0 }
      );

      setSummary({
        ...totals,
        collectionRate: totals.totalDue > 0 ? Math.round((totals.totalPaid / totals.totalDue) * 100) : 0,
      });
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, [activeFacultyId]);

  // Filter and search records
  const filteredRecords = records
    .filter(record => {
      if (filterStatus !== 'all' && record.status !== filterStatus) return false;
      if (searchTerm && !record.student_name.includes(searchTerm) && !record.student_id.includes(searchTerm)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'remaining':
          return b.remaining - a.remaining;
        case 'student_name':
          return a.student_name.localeCompare(b.student_name);
        default:
          return 0;
      }
    });

  const handleExport = () => {
    const csv = [
      ['كود الطالب', 'اسم الطالب', 'نوع الرسم', 'المبلغ', 'المسدد', 'المتبقي', 'الحالة', 'تاريخ الاستحقاق'],
      ...filteredRecords.map(r => [
        r.student_id,
        r.student_name,
        r.fee_type,
        r.amount,
        r.paid_amount,
        r.remaining,
        r.status,
        r.due_date,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_المالية_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-primary-900 mb-2">إدارة المالية</h2>
            <p className="text-gray-600">تتبع الرسوم والمدفوعات الطلابية</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Due */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-gray-600 text-sm mb-1">الرسوم الكلية</p>
                <p className="text-3xl font-bold text-blue-600">
                  {summary.totalDue.toLocaleString()} ج.م
                </p>
              </div>
              <DollarSign className="w-6 h-6 text-blue-600 opacity-50" />
            </div>
            <p className="text-xs text-gray-600">إجمالي الرسوم المستحقة</p>
          </div>

          {/* Total Paid */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-gray-600 text-sm mb-1">المسدد</p>
                <p className="text-3xl font-bold text-green-600">
                  {summary.totalPaid.toLocaleString()} ج.م
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600 opacity-50" />
            </div>
            <p className="text-xs text-gray-600">إجمالي المدفوعات</p>
          </div>

          {/* Remaining */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-gray-600 text-sm mb-1">المتبقي</p>
                <p className="text-3xl font-bold text-red-600">
                  {summary.totalRemaining.toLocaleString()} ج.م
                </p>
              </div>
              <AlertCircle className="w-6 h-6 text-red-600 opacity-50" />
            </div>
            <p className="text-xs text-gray-600">المبالغ المتأخرة</p>
          </div>

          {/* Collection Rate */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-gray-600 text-sm mb-1">نسبة التحصيل</p>
                <p className="text-3xl font-bold text-purple-600">
                  {summary.collectionRate}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600 opacity-50" />
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${summary.collectionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="كود أو اسم الطالب"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">الكل</option>
              <option value="مسدد">مسدد</option>
              <option value="غير مسدد">غير مسدد</option>
              <option value="مسدد جزئي">مسدد جزئي</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="due_date">تاريخ الاستحقاق</option>
              <option value="remaining">المبلغ المتبقي</option>
              <option value="student_name">اسم الطالب</option>
            </select>
          </div>

          {/* Refresh */}
          <div className="flex items-end">
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">كود الطالب</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">اسم الطالب</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">نوع الرسم</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">المبلغ</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">المسدد</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">المتبقي</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الاستحقاق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{record.student_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.student_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.fee_type}</td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        {record.amount.toLocaleString()} ج.م
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600">
                        {record.paid_amount.toLocaleString()} ج.م
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        {record.remaining.toLocaleString()} ج.م
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === 'مسدد'
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'مسدد جزئي'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.due_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      لا توجد سجلات مالية تطابق معايير البحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-600">
              إجمالي السجلات: <span className="font-medium">{filteredRecords.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
