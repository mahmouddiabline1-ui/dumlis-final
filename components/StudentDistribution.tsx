import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, Building2, Search, RefreshCw } from 'lucide-react';
import { committeesApi, studentsApi } from '../api';

interface StudentDistributionProps {
  selectedFacultyId?: string | null;
}

const StudentDistribution: React.FC<StudentDistributionProps> = ({ selectedFacultyId }) => {
  const [committees, setCommittees] = useState<any[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<string>('');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [busy, setBusy] = useState(false);

  const selectedCommitteeData = useMemo(
    () => committees.find((c) => String(c.id) === String(selectedCommittee)),
    [committees, selectedCommittee]
  );

  const reloadBase = useCallback(async () => {
    const [comms, students] = await Promise.all([
      committeesApi.list({}),
      studentsApi.listAll({ faculty_id: selectedFacultyId || undefined }),
    ]);
    setCommittees(comms as any[]);
    setAllStudents(students as any[]);
  }, [selectedFacultyId]);

  useEffect(() => {
    reloadBase();
  }, [reloadBase]);

  useEffect(() => {
    const loadAssignments = async () => {
      if (!selectedCommittee) {
        setAssignments([]);
        return;
      }
      const rows = await committeesApi.listStudents(Number(selectedCommittee));
      setAssignments(rows as any[]);
    };
    loadAssignments();
  }, [selectedCommittee]);

  const handleAutoDistribute = async () => {
    if (!selectedCommitteeData) {
      alert('يرجى اختيار لجنة أولاً');
      return;
    }
    setBusy(true);
    try {
      const assignedIds = new Set(assignments.map((a: any) => a.student_id));
      const unassigned = allStudents.filter((s: any) => !assignedIds.has(s.student_id));
      const remaining = Math.max(0, (selectedCommitteeData.capacity || 0) - assignments.length);
      const target = unassigned.slice(0, remaining);
      if (target.length === 0) {
        alert(remaining <= 0 ? 'القاعة ممتلئة!' : 'لا يوجد طلاب غير موزعين');
        return;
      }
      for (let i = 0; i < target.length; i++) {
        const seatRow = Math.floor((assignments.length + i) / 10) + 1;
        const seatCol = ((assignments.length + i) % 10) + 1;
        await committeesApi.assignStudent(Number(selectedCommittee), {
          student_id: target[i].student_id,
          committee_id: Number(selectedCommittee),
          seat_number: `${seatRow}-${seatCol}`,
          seat_row: seatRow,
          seat_column: seatCol,
        });
      }
      const rows = await committeesApi.listStudents(Number(selectedCommittee));
      setAssignments(rows as any[]);
      await reloadBase();
    } catch (e: any) {
      alert(e?.message || 'فشل التوزيع');
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveAssignment = async (studentId: string) => {
    if (!selectedCommittee) return;
    if (!confirm('هل أنت متأكد من إزالة هذا الطالب من اللجنة؟')) return;
    setBusy(true);
    try {
      await committeesApi.removeStudent(Number(selectedCommittee), studentId);
      const rows = await committeesApi.listStudents(Number(selectedCommittee));
      setAssignments(rows as any[]);
      await reloadBase();
    } catch (e: any) {
      alert(e?.message || 'فشل الإزالة');
    } finally {
      setBusy(false);
    }
  };

  const filteredAssignments = assignments.filter((a: any) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const name = allStudents.find((s: any) => s.student_id === a.student_id)?.name || '';
    return (
      String(a.student_id || '')
        .toLowerCase()
        .includes(term) ||
      String(name)
        .toLowerCase()
        .includes(term) ||
      String(a.seat_number || '')
        .toLowerCase()
        .includes(term)
    );
  });

  const assignedSet = new Set(assignments.map((a: any) => a.student_id));
  const unassignedStudents = allStudents.filter((s: any) => !assignedSet.has(s.student_id));

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">توزيع الطلاب على اللجان</h1>
            <p className="text-gray-500">توزيع الطلاب على اللجان الامتحانية وتحديد أرقام الجلوس (قاعدة البيانات)</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-4">اللجان المتاحة</h3>

          <select
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none mb-4"
            disabled={busy}
          >
            <option value="">اختر لجنة...</option>
            {committees.map((committee) => (
              <option key={committee.id} value={committee.id}>
                {committee.name} - {committee.room_code || committee.room_id} ({committee.assigned_students || 0}/
                {committee.capacity})
              </option>
            ))}
          </select>

          {selectedCommitteeData && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h4 className="font-bold text-gray-900 mb-3">{selectedCommitteeData.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={16} />
                  <span>{selectedCommitteeData.room_code || selectedCommitteeData.room_id}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={16} />
                  <span>
                    {selectedCommitteeData.assigned_students || 0} / {selectedCommitteeData.capacity} طالب
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">المقاعد المتاحة:</span>
                    <span className="font-bold text-primary-600">
                      {selectedCommitteeData.capacity - (selectedCommitteeData.assigned_students || 0)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoDistribute}
                    disabled={busy}
                    className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw size={18} />
                    {busy ? 'جاري التوزيع...' : 'توزيع تلقائي'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">إحصائيات</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي الطلاب (الكلية الحالية):</span>
                <span className="font-bold">{allStudents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الطلاب الموزعين (هذه اللجنة):</span>
                <span className="font-bold text-green-600">{assignments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الطلاب غير الموزعين (الكلية):</span>
                <span className="font-bold text-red-600">{unassignedStudents.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="بحث في الطلاب الموزعين..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg mb-2">
                {selectedCommittee ? 'لا يوجد طلاب موزعين على هذه اللجنة' : 'اختر لجنة لعرض الطلاب الموزعين'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">كود الطالب</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اسم الطالب</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اللجنة</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">القاعة</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رقم الجلوس</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssignments.map((assignment: any) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{assignment.student_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {allStudents.find((s: any) => s.student_id === assignment.student_id)?.name ||
                          assignment.student_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{selectedCommitteeData?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {selectedCommitteeData?.room_code || selectedCommitteeData?.room_id}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono font-bold text-primary-600">
                        {assignment.seat_number}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemoveAssignment(assignment.student_id)}
                          disabled={busy}
                          className="text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
                        >
                          إزالة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDistribution;
