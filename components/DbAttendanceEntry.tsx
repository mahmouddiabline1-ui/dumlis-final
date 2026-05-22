import React, { useEffect, useMemo, useState } from 'react';
import { attendanceApi, coursesApi, enrollmentsApi, studentsApi } from '../api';

interface DbAttendanceEntryProps {
  facultyId?: string | null;
}

const DbAttendanceEntry: React.FC<DbAttendanceEntryProps> = ({ facultyId }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState('محاضرة');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const enrolledStudents = useMemo(() => Object.keys(attendanceMap), [attendanceMap]);

  useEffect(() => {
    const loadCourses = async () => {
      const rows = await coursesApi.list({ faculty_id: facultyId || undefined });
      setCourses(rows as any[]);
    };
    loadCourses();
  }, [facultyId]);

  const loadEnrolled = async (selectedCourseId: string) => {
    setLoading(true);
    try {
      const enrollments = await enrollmentsApi.list({ course_id: selectedCourseId, status: 'مسجل' });
      const students = await studentsApi.listAll({ faculty_id: facultyId || undefined });
      const studentsMap = new Set((students as any[]).map((s) => s.student_id));
      const initial: Record<string, string> = {};
      (enrollments as any[]).forEach((e) => {
        if (studentsMap.has(e.student_id)) initial[e.student_id] = 'حاضر';
      });
      setAttendanceMap(initial);
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async () => {
    if (!courseId || !date || enrolledStudents.length === 0) return;
    setSaving(true);
    try {
      const records = enrolledStudents.map((student_id) => ({
        student_id,
        course_id: courseId,
        attendance_date: date,
        session_type: sessionType,
        status: attendanceMap[student_id] || 'غائب',
      }));
      await attendanceApi.bulkCreate(records as any);
      alert('تم حفظ الحضور من قاعدة البيانات بنجاح');
    } catch (e: any) {
      alert(e?.message || 'تعذر حفظ الحضور');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="text-xl font-bold">إدخال حضور الطلاب (DB)</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          className="p-2 border border-gray-300 rounded-lg"
          value={courseId}
          onChange={(e) => {
            const v = e.target.value;
            setCourseId(v);
            if (v) loadEnrolled(v);
          }}
        >
          <option value="">اختر المقرر...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
          ))}
        </select>
        <input className="p-2 border border-gray-300 rounded-lg" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="p-2 border border-gray-300 rounded-lg" value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
          <option value="محاضرة">محاضرة</option>
          <option value="سكشن">سكشن</option>
          <option value="معمل">معمل</option>
        </select>
        <button
          onClick={saveAttendance}
          disabled={saving || !courseId}
          className="bg-primary-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        {loading ? (
          <p>جاري تحميل الطلاب...</p>
        ) : enrolledStudents.length === 0 ? (
          <p className="text-gray-500">لا يوجد طلاب مسجلون لهذا المقرر.</p>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-auto">
            {enrolledStudents.map((studentId) => (
              <div key={studentId} className="flex items-center justify-between border border-gray-100 rounded-lg p-2">
                <span className="font-mono">{studentId}</span>
                <select
                  className="p-1 border border-gray-300 rounded"
                  value={attendanceMap[studentId]}
                  onChange={(e) => setAttendanceMap((prev) => ({ ...prev, [studentId]: e.target.value }))}
                >
                  <option value="حاضر">حاضر</option>
                  <option value="غائب">غائب</option>
                  <option value="بعذر">بعذر</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DbAttendanceEntry;
