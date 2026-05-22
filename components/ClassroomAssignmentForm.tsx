import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Save, AlertTriangle, CheckCircle2, X, Calendar, MapPin, Users } from 'lucide-react';
import { coursesApi, roomsApi, schedulesApi } from '../api';
import type { Course, CourseSchedule, Room } from '../api';

interface ClassroomAssignmentFormProps {
  config: any;
  facultyId?: string | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const SESSION_TYPES = ['محاضرة', 'سكشن', 'معمل'] as const;

const ClassroomAssignmentForm: React.FC<ClassroomAssignmentFormProps> = ({
  config,
  facultyId,
  onSave,
  onCancel,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [formData, setFormData] = useState<{
    course_id: string;
    session_type: string;
    day: string;
    time_label: string;
    room_id: string;
    instructor: string;
    semester: string;
    group_label: string;
    enrolled_count: number;
  }>({
    course_id: '',
    session_type: 'محاضرة',
    day: '',
    time_label: '',
    room_id: '',
    instructor: '',
    semester: '',
    group_label: '',
    enrolled_count: 0,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [c, r, s] = await Promise.all([
      coursesApi.list({ faculty_id: facultyId || undefined }),
      roomsApi.list({}),
      schedulesApi.list({}),
    ]);
    setCourses(c);
    setRooms(r);
    setSchedules(s);
  }, [facultyId]);

  useEffect(() => {
    load();
  }, [load]);

  const courseById = useMemo(() => {
    const m: Record<string, Course> = {};
    courses.forEach((c) => {
      m[c.id] = c;
    });
    return m;
  }, [courses]);

  const roomById = useMemo(() => {
    const m: Record<string, Room> = {};
    rooms.forEach((r) => {
      m[r.id] = r;
    });
    return m;
  }, [rooms]);

  const conflictingRoomIds = useMemo(() => {
    if (!formData.day || !formData.time_label) return new Set<string>();
    const s = new Set<string>();
    schedules.forEach((sch) => {
      if (sch.day === formData.day && sch.time_label === formData.time_label && sch.room_id) {
        s.add(sch.room_id);
      }
    });
    return s;
  }, [schedules, formData.day, formData.time_label]);

  const availableRooms = useMemo(() => {
    return rooms.filter((room) => !conflictingRoomIds.has(room.id));
  }, [rooms, conflictingRoomIds]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!formData.course_id) errors.push('اختر المقرر');
    if (!formData.day) errors.push('اختر اليوم');
    if (!formData.time_label?.trim()) errors.push('أدخل الوقت (مثال: 10:00 - 12:00)');
    if (!formData.room_id) errors.push('اختر القاعة');
    if (!formData.session_type) errors.push('اختر نوع الحصة');

    const conflict = schedules.find(
      (s) =>
        s.day === formData.day &&
        s.time_label === formData.time_label &&
        s.room_id === formData.room_id
    );
    if (conflict) {
      errors.push('هذه القاعة محجوزة في نفس اليوم والوقت');
    }

    const room = roomById[formData.room_id];
    if (room && formData.enrolled_count > room.capacity) {
      errors.push(`عدد المسجلين (${formData.enrolled_count}) يتجاوز سعة القاعة (${room.capacity})`);
    } else if (room && formData.enrolled_count > room.capacity * 0.9) {
      warnings.push('القاعة ممتلئة تقريباً');
    }

    setValidationErrors(errors);
    setValidationWarnings(warnings);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const created = await schedulesApi.create({
        course_id: formData.course_id,
        session_type: formData.session_type,
        day: formData.day,
        time_label: formData.time_label,
        room_id: formData.room_id,
        instructor: formData.instructor || undefined,
        semester: formData.semester || undefined,
        group_label: formData.group_label || undefined,
        enrolled_count: formData.enrolled_count || 0,
      });
      onSave(created);
      await load();
    } catch (e: any) {
      setValidationErrors([e?.message || 'فشل الحفظ']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.title || 'تخصيص قاعة'}</h1>
        <p className="text-gray-600">{config.description || 'إضافة جدول محاضرة/سكشن/معمل إلى قاعدة البيانات.'}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المقرر *</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={formData.course_id}
              onChange={(e) => handleFieldChange('course_id', e.target.value)}
            >
              <option value="">اختر المقرر...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
            {formData.course_id && (
              <p className="text-xs text-gray-500 mt-1">
                {courseById[formData.course_id]?.credit_hours != null && (
                  <>ساعات معتمدة: {courseById[formData.course_id]?.credit_hours} — </>
                )}
                المستوى: {courseById[formData.course_id]?.level ?? '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحصة *</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={formData.session_type}
              onChange={(e) => handleFieldChange('session_type', e.target.value)}
            >
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar size={14} /> اليوم *
            </label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={formData.day}
              onChange={(e) => handleFieldChange('day', e.target.value)}
            >
              <option value="">اختر اليوم...</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوقت *</label>
            <input
              type="text"
              placeholder="مثال: 10:00 - 12:00"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.time_label}
              onChange={(e) => handleFieldChange('time_label', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MapPin size={14} /> القاعة * (غير المحجوزة لنفس اليوم/الوقت)
            </label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={formData.room_id}
              onChange={(e) => handleFieldChange('room_id', e.target.value)}
              disabled={!formData.day || !formData.time_label?.trim()}
            >
              <option value="">اختر القاعة...</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} — سعة {room.capacity} ({room.room_type})
                </option>
              ))}
            </select>
            {formData.room_id && roomById[formData.room_id] && (
              <p className="text-xs text-gray-500 mt-1">
                المبنى: {roomById[formData.room_id].building || '—'} — الطابق:{' '}
                {roomById[formData.room_id].floor ?? '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المجموعة</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.group_label}
              onChange={(e) => handleFieldChange('group_label', e.target.value)}
              placeholder="مثال: أ، ب، 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفصل الدراسي</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.semester}
              onChange={(e) => handleFieldChange('semester', e.target.value)}
              placeholder="مثال: 2024-2025 خريف"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Users size={14} /> عدد المسجلين
            </label>
            <input
              type="number"
              min={0}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.enrolled_count}
              onChange={(e) => handleFieldChange('enrolled_count', Number(e.target.value) || 0)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">المحاضر</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.instructor}
              onChange={(e) => handleFieldChange('instructor', e.target.value)}
            />
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 space-y-1">
            {validationErrors.map((e, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{e}</span>
              </div>
            ))}
          </div>
        )}

        {validationWarnings.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 space-y-1">
            {validationWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <X size={18} />
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'جاري الحفظ...' : 'حفظ في الجدول'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassroomAssignmentForm;
