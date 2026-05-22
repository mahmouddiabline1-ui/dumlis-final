import React, { useEffect, useState } from 'react';
import { Download, Printer, Search, Grid, Users, Building2, FileText } from 'lucide-react';
import { committeesApi, studentsApi } from '../api';

interface SeatingNumbersProps {
  selectedFacultyId?: string | null;
}

const SeatingNumbers: React.FC<SeatingNumbersProps> = ({ selectedFacultyId }) => {
  const [committees, setCommittees] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [studentsMap, setStudentsMap] = useState<Record<string, string>>({});
  const [selectedCommittee, setSelectedCommittee] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      const [comms, students] = await Promise.all([
        committeesApi.list({}),
        studentsApi.listAll({ faculty_id: selectedFacultyId || undefined }),
      ]);
      setCommittees(comms as any[]);
      const map: Record<string, string> = {};
      (students as any[]).forEach((s) => {
        map[s.student_id] = s.name;
      });
      setStudentsMap(map);
    };
    load();
  }, [selectedFacultyId]);

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

  const selectedCommitteeData = committees.find((c) => String(c.id) === String(selectedCommittee));

  const filteredAssignments = assignments.filter((a: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(studentsMap[a.student_id] || '')
        .toLowerCase()
        .includes(term) ||
      String(a.student_id || '')
        .toLowerCase()
        .includes(term) ||
      String(a.seat_number || '')
        .toLowerCase()
        .includes(term)
    );
  });

  const generateSeatingLayout = () => {
    if (!selectedCommitteeData) return null;
    const rows = selectedCommitteeData.seating_rows || 10;
    const seatsPerRow = selectedCommitteeData.seating_cols || 10;
    const layout: (any | null)[][] = [];
    for (let row = 0; row < rows; row++) {
      layout[row] = [];
      for (let col = 0; col < seatsPerRow; col++) {
        layout[row][col] = null;
      }
    }
    filteredAssignments.forEach((assignment: any) => {
      if (assignment.seat_row && assignment.seat_column) {
        const rowIndex = assignment.seat_row - 1;
        const colIndex = assignment.seat_column - 1;
        if (rowIndex >= 0 && rowIndex < rows && colIndex >= 0 && colIndex < seatsPerRow) {
          layout[rowIndex][colIndex] = assignment;
        }
      }
    });
    return layout;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!selectedCommitteeData || filteredAssignments.length === 0) return;

    const data = filteredAssignments.map((a: any) => ({
      'كود الطالب': a.student_id,
      'اسم الطالب': studentsMap[a.student_id] || a.student_id,
      'اللجنة': selectedCommitteeData?.name || '',
      'القاعة': selectedCommitteeData?.room_code || selectedCommitteeData?.room_id || '',
      'رقم الجلوس': a.seat_number,
      'الصف': a.seat_row,
      'العمود': a.seat_column,
    }));

    const csv = [Object.keys(data[0]).join(','), ...data.map((row) => Object.values(row).join(','))].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `أرقام_الجلوس_${selectedCommitteeData.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const seatingLayout = generateSeatingLayout();
  const seatsPerRow = selectedCommitteeData?.seating_cols || 10;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">أرقام الجلوس</h1>
            <p className="text-gray-500">عرض وطباعة أرقام جلوس الطلاب في اللجان الامتحانية (قاعدة البيانات)</p>
          </div>
          {selectedCommitteeData && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                تصدير Excel
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Printer size={18} />
                طباعة
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-4">اختر اللجنة</h3>

          <select
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none mb-4"
          >
            <option value="">اختر لجنة...</option>
            {committees.map((committee) => (
              <option key={committee.id} value={committee.id}>
                {committee.name} - {committee.room_code || committee.room_id}
              </option>
            ))}
          </select>

          {selectedCommitteeData && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
                {selectedCommitteeData.exam_date && (
                  <div className="text-gray-600">
                    <strong>تاريخ:</strong> {selectedCommitteeData.exam_date}
                  </div>
                )}
                {selectedCommitteeData.exam_time && (
                  <div className="text-gray-600">
                    <strong>وقت:</strong> {selectedCommitteeData.exam_time}
                  </div>
                )}
                {(selectedCommitteeData.seating_rows || selectedCommitteeData.seating_cols) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-gray-600">
                      <strong>ترتيب الجلوس:</strong>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedCommitteeData.seating_rows || 10} صف × {selectedCommitteeData.seating_cols || 10} مقعد
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedCommitteeData && (
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-right"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-white">
          {!selectedCommitteeData ? (
            <div className="text-center py-12">
              <Grid className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg">اختر لجنة لعرض أرقام الجلوس</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg">لا يوجد طلاب موزعين على هذه اللجنة</p>
            </div>
          ) : (
            <div className="space-y-6">
              {seatingLayout && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Grid size={20} />
                    خريطة الجلوس - {selectedCommitteeData.room_code || selectedCommitteeData.room_id}
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="inline-block">
                      <div className="flex mb-2">
                        <div className="w-12"></div>
                        {Array.from({ length: seatsPerRow }, (_, i) => (
                          <div key={i} className="w-16 text-center text-xs text-gray-500 font-medium">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      {seatingLayout.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex mb-2">
                          <div className="w-12 text-center text-xs text-gray-500 font-medium flex items-center justify-center">
                            {rowIndex + 1}
                          </div>
                          {row.map((seat: any, colIndex: number) => (
                            <div
                              key={colIndex}
                              className={`w-16 h-16 mx-1 border rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                                seat
                                  ? 'bg-primary-100 border-primary-300 text-primary-900'
                                  : 'bg-gray-50 border-gray-200 text-gray-400'
                              }`}
                              title={
                                seat
                                  ? `${studentsMap[seat.student_id] || seat.student_id} - ${seat.seat_number}`
                                  : 'مقعد فارغ'
                              }
                            >
                              {seat ? (
                                <div className="text-center">
                                  <div className="font-bold">{seat.seat_number}</div>
                                  <div className="text-[10px] text-gray-600 truncate w-full px-1">{seat.student_id}</div>
                                </div>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <span className="inline-block w-4 h-4 bg-primary-100 border border-primary-300 rounded mr-2"></span>
                    طالب مسجل
                    <span className="inline-block w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2 ml-4"></span>
                    مقعد فارغ
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={20} />
                    قائمة مفصلة بأرقام الجلوس ({filteredAssignments.length} طالب)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">م</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">كود الطالب</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اسم الطالب</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رقم الجلوس</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الصف</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">العمود</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAssignments
                        .sort((a: any, b: any) => {
                          const rowA = a.seat_row || 0;
                          const rowB = b.seat_row || 0;
                          if (rowA !== rowB) return rowA - rowB;
                          return (a.seat_column || 0) - (b.seat_column || 0);
                        })
                        .map((assignment: any, index: number) => (
                          <tr key={assignment.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">{assignment.student_id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {studentsMap[assignment.student_id] || assignment.student_id}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono font-bold text-primary-600">
                              {assignment.seat_number}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{assignment.seat_row || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{assignment.seat_column || '-'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatingNumbers;
