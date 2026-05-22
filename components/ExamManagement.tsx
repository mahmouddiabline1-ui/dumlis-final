import React, { useState, useEffect } from 'react';
import { committeesApi, roomsApi, enrollmentsApi } from '../api';
import {
  BookOpen, Home, Users, Settings, Plus, Trash2, Edit2, Save, X,
  ChevronRight, AlertCircle, CheckCircle, Clock, MapPin
} from 'lucide-react';

interface ExamManagementProps {
  activeFacultyId?: string | null;
}

interface Committee {
  id: number;
  name: string;
  course_id: number;
  course_name: string;
  room_id: number;
  room_code: string;
  exam_date: string;
  exam_time: string;
  capacity: number;
  assigned_students: number;
  status: string;
}

interface SeatingArrangement {
  id: string;
  row: number;
  column: number;
  studentId?: string;
  studentName?: string;
  status: 'empty' | 'occupied' | 'reserved';
}

const ExamManagement: React.FC<ExamManagementProps> = ({ activeFacultyId }) => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [seatingData, setSeatingData] = useState<SeatingArrangement[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSeatingDialog, setShowSeatingDialog] = useState(false);
  const [generatingSeating, setGeneratingSeating] = useState(false);

  // Load committees
  useEffect(() => {
    const loadCommittees = async () => {
      try {
        setLoading(true);
        const data = await committeesApi.list();
        const filtered = data.filter((c: any) => {
          if (activeFacultyId && c.faculty_id !== activeFacultyId) return false;
          return true;
        });
        setCommittees(filtered);
      } catch (error) {
        console.error('Failed to load committees:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCommittees();
  }, [activeFacultyId]);

  // Load enrolled students for selected committee
  useEffect(() => {
    const loadEnrolledStudents = async () => {
      if (!selectedCommittee) {
        setEnrolledStudents([]);
        return;
      }

      try {
        const data = await enrollmentsApi.list({ committee_id: selectedCommittee.id });
        setEnrolledStudents(data);
      } catch (error) {
        console.error('Failed to load enrolled students:', error);
      }
    };
    loadEnrolledStudents();
  }, [selectedCommittee?.id]);

  // Generate seating arrangement
  const handleGenerateSeating = async () => {
    if (!selectedCommittee) return;

    try {
      setGeneratingSeating(true);

      // Get room info for capacity
      const room = await roomsApi.get(selectedCommittee.room_id);
      const capacity = room?.capacity || 30;
      const seatsPerRow = Math.ceil(Math.sqrt(capacity));

      // Generate seating grid
      const arrangement: SeatingArrangement[] = [];
      for (let row = 1; row <= seatsPerRow; row++) {
        for (let col = 1; col <= seatsPerRow; col++) {
          const seatIndex = (row - 1) * seatsPerRow + col - 1;
          if (seatIndex < capacity) {
            arrangement.push({
              id: `${row}-${col}`,
              row,
              column: col,
              status: seatIndex < enrolledStudents.length ? 'occupied' : 'empty',
              studentId: seatIndex < enrolledStudents.length ? enrolledStudents[seatIndex]?.id : undefined,
              studentName: seatIndex < enrolledStudents.length ? enrolledStudents[seatIndex]?.name : undefined,
            });
          }
        }
      }

      setSeatingData(arrangement);
      setShowSeatingDialog(true);

      // Save seating arrangement
      for (let i = 0; i < Math.min(arrangement.length, enrolledStudents.length); i++) {
        const seat = arrangement[i];
        const student = enrolledStudents[i];
        await committeesApi.assignStudent(selectedCommittee.id, {
          student_id: student.id,
          seat_number: i + 1,
          seat_row: seat.row,
          seat_column: seat.column,
        });
      }
    } catch (error) {
      console.error('Failed to generate seating:', error);
      alert('فشل توليد الجلوس: ' + error);
    } finally {
      setGeneratingSeating(false);
    }
  };

  // Print exam sheet
  const handlePrintExamSheet = (committee: Committee) => {
    const seatingContent = seatingData
      .filter(s => s.status === 'occupied')
      .map(s => `الصف: ${s.row} | العمود: ${s.column} | ${s.studentName}`)
      .join('\n');

    const printContent = `
═══════════════════════════════════════════
        كشف الامتحان
═══════════════════════════════════════════

المقرر: ${committee.course_name}
الغرفة: ${committee.room_code}
السعة: ${committee.capacity}
التاريخ: ${committee.exam_date}
الوقت: ${committee.exam_time}

عدد الطلاب المسجلين: ${enrolledStudents.length}

ترتيب الجلوس:
───────────────────────────────────────────
${seatingContent || 'لا توجد بيانات جلوس'}
───────────────────────────────────────────
    `;

    const printWindow = window.open('', '', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head>
          <title>كشف امتحان - ${committee.course_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${printContent}</pre>
          <button onclick="window.print()">طباعة</button>
          <button onclick="window.close()">إغلاق</button>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary-900 mb-2">إدارة الامتحانات والجلوس</h2>
        <p className="text-gray-600">إدارة اللجان الامتحانية وتوليد ترتيبات الجلوس</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Committees List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h3 className="font-bold text-lg text-primary-900">اللجان الامتحانية</h3>
              <p className="text-sm text-gray-500 mt-1">عدد اللجان: {committees.length}</p>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {committees.map(committee => (
                <button
                  key={committee.id}
                  onClick={() => setSelectedCommittee(committee)}
                  className={`w-full text-right p-4 hover:bg-gray-50 transition-colors border-r-4 ${
                    selectedCommittee?.id === committee.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-primary-900">{committee.course_name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {committee.room_code} - السعة: {committee.capacity}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {committee.exam_date} {committee.exam_time}
                      </div>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          committee.status === 'نشط'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {committee.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Committee Details */}
          {selectedCommittee && (
            <div className="space-y-4">
              {/* Committee Info Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-lg text-primary-900 mb-4">معلومات اللجنة</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المقرر:</span>
                    <span className="font-medium">{selectedCommittee.course_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الغرفة:</span>
                    <span className="font-medium">{selectedCommittee.room_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعة:</span>
                    <span className="font-medium">{selectedCommittee.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التاريخ والوقت:</span>
                    <span className="font-medium">{selectedCommittee.exam_date} {selectedCommittee.exam_time}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-600">الطلاب المسجلين:</span>
                    <span className="font-bold text-primary-600">{enrolledStudents.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateSeating}
                  disabled={generatingSeating || enrolledStudents.length === 0}
                  className="w-full mt-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {generatingSeating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      توليد الجلوس
                    </>
                  )}
                </button>

                <button
                  onClick={() => handlePrintExamSheet(selectedCommittee)}
                  disabled={seatingData.length === 0}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  طباعة الكشف
                </button>
              </div>

              {/* Enrolled Students */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-lg text-primary-900 mb-4">الطلاب المسجلين</h3>

                {enrolledStudents.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {enrolledStudents.map((student, idx) => (
                      <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{idx + 1}. {student.name}</span>
                        <span className="text-xs text-gray-500">{student.id}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">لا توجد طلاب مسجلين</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seating Grid Dialog */}
      {showSeatingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
            <div className="sticky top-0 bg-primary-50 border-b p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">ترتيب الجلوس</h3>
              <button
                onClick={() => setShowSeatingDialog(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))` }}>
                {seatingData.map(seat => (
                  <div
                    key={seat.id}
                    className={`p-3 rounded text-center text-xs border-2 ${
                      seat.status === 'occupied'
                        ? 'bg-green-50 border-green-400'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="font-bold">R{seat.row}C{seat.column}</div>
                    {seat.studentName && (
                      <div className="text-gray-700 mt-1 truncate">{seat.studentName}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
