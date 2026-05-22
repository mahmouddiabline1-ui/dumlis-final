import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Building2, Users, Calendar, Clock, Search, RefreshCw, Zap } from 'lucide-react';
import { 
  committeesApi, 
  coursesApi, 
  roomsApi, 
  enrollmentsApi, 
  studentsApi,
  Committee,
  Course,
  Room
} from '../api';

const CommitteeDefinition: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'classroom' | 'lab'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // API Data
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);

  const [formData, setFormData] = useState<Partial<Committee>>({
    name: '',
    course_id: '',
    course_name: '',
    room_id: '',
    room_code: '',
    capacity: 0,
    assigned_students: 0,
    exam_date: '',
    exam_time: '',
    supervisor: '',
    status: 'active',
    seating_rows: 5,
    seating_cols: 6,
    seating_layout: 'grid'
  });

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [comms, courses, rooms] = await Promise.all([
        committeesApi.list(),
        coursesApi.list(),
        roomsApi.list()
      ]);
      setCommittees(comms);
      setAllCourses(courses);
      setAllRooms(rooms);
    } catch (error) {
      console.error('Failed to load committee data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingCommittee(null);
    setFormData({
      name: '',
      course_id: '',
      course_name: '',
      room_id: '',
      room_code: '',
      capacity: 0,
      assigned_students: 0,
      exam_date: '',
      exam_time: '',
      supervisor: '',
      status: 'active',
      seating_rows: 5,
      seating_cols: 6,
      seating_layout: 'grid'
    });
    setShowForm(true);
  };

  const handleEdit = (committee: Committee) => {
    setEditingCommittee(committee);
    setFormData({
      name: committee.name,
      course_id: committee.course_id || '',
      course_name: committee.course_name || '',
      room_id: committee.room_id || '',
      room_code: committee.room_code || '',
      capacity: committee.capacity,
      assigned_students: committee.assigned_students,
      exam_date: committee.exam_date || '',
      exam_time: committee.exam_time || '',
      supervisor: committee.supervisor || '',
      status: committee.status,
      seating_rows: committee.seating_rows || 5,
      seating_cols: committee.seating_cols || 6,
      seating_layout: committee.seating_layout || 'grid'
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('هل أنت متأكد من حذف هذه اللجنة؟')) {
      try {
        await committeesApi.delete(Number(id));
        setCommittees(prev => prev.filter(c => String(c.id) !== String(id)));
      } catch (error) {
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleAutoGenerate = async () => {
    if (confirm('سيتم توليد اللجان تلقائياً بناءً على المقررات المسجلة وتوزيع الطلاب عليها. هل تريد المتابعة؟')) {
      setIsGenerating(true);
      
      try {
        // Fetch necessary data for generation
        const [enrollments, dbStudents] = await Promise.all([
          enrollmentsApi.list({ status: 'مسجل' }),
          studentsApi.listAll({})
        ]);

        if (enrollments.length === 0) {
          alert('لا توجد تسجيلات طلاب متاحة في قاعدة البيانات.');
          setIsGenerating(false);
          return;
        }

        // Group students by course
        const courseStudents: Record<string, string[]> = {};
        enrollments.forEach(enrollment => {
          if (!courseStudents[enrollment.course_id]) {
            courseStudents[enrollment.course_id] = [];
          }
          courseStudents[enrollment.course_id].push(enrollment.student_id);
        });

        for (const [course_id, studentIds] of Object.entries(courseStudents)) {
          const course = allCourses.find(c => c.id === course_id);
          if (!course) continue;

          // Find available rooms
          let availableRooms = allRooms
            .filter(r => r.status === 'available' || r.status === 'Available')
            .sort((a, b) => b.capacity - a.capacity);
          
          if (availableRooms.length === 0) continue;

          let remainingStudents = studentIds.length;
          let roomIndex = 0;
          let committeeNumber = 1;

          while (remainingStudents > 0 && roomIndex < availableRooms.length) {
            const room = availableRooms[roomIndex];
            const studentsForThisRoom = Math.min(remainingStudents, room.capacity);
            
            if (studentsForThisRoom > 0) {
              const committeeName = `لجنة ${course.name} - ${committeeNumber}`;
              
              const committeeData: Partial<Committee> = {
                name: committeeName,
                course_id,
                course_name: course.name,
                room_id: room.id,
                room_code: room.code,
                capacity: room.capacity,
                assigned_students: studentsForThisRoom,
                status: 'active'
              };

              // Create in DB
              await committeesApi.create(committeeData);

              remainingStudents -= studentsForThisRoom;
              committeeNumber++;
            }
            roomIndex++;
          }
        }

        loadData(); // Refresh list
        alert('تم توليد اللجان وتوزيع الطلاب بنجاح!');
      } catch (error) {
        console.error('Error in auto generation:', error);
        alert('حدث خطأ أثناء التوليد التلقائي');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleRoomChange = (roomId: string) => {
    const room = allRooms.find(r => r.id === roomId);
    if (room) {
      setFormData({
        ...formData,
        room_id: room.id,
        room_code: room.code,
        capacity: room.capacity
      });
    }
  };

  const handleCourseChange = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      setFormData({
        ...formData,
        course_id: course.id,
        course_name: course.name
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.room_id) {
      alert('يرجى إدخال اسم اللجنة واختيار القاعة');
      return;
    }

    try {
      if (editingCommittee) {
        await committeesApi.update(Number(editingCommittee.id), formData);
      } else {
        await committeesApi.create(formData);
      }
      loadData();
      setShowForm(false);
      setEditingCommittee(null);
    } catch (error) {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const filteredCommittees = committees.filter(committee => {
    const matchesSearch = 
      committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (committee.room_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (committee.course_name && committee.course_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || 
      (filterType === 'classroom' && allRooms.some(r => r.id === committee.room_id && (r.room_type === 'classroom' || r.type === 'classroom'))) ||
      (filterType === 'lab' && allRooms.some(r => r.id === committee.room_id && (r.room_type === 'lab' || r.type === 'lab')));

    return matchesSearch && (matchesType as boolean);
  });

  const availableRooms = allRooms.filter(room => {
    if (filterType === 'classroom') return room.room_type === 'classroom' || (room as any).type === 'classroom';
    if (filterType === 'lab') return room.room_type === 'lab' || (room as any).type === 'lab';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center text-right">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">تعريف اللجان (قاعدة البيانات)</h1>
            <p className="text-gray-500">إدارة وتحديد اللجان الامتحانية والقاعات والمعامل من قاعدة البيانات المركزية</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAutoGenerate}
              disabled={isGenerating}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={20} />
              {isGenerating ? 'جارٍ التوليد...' : 'توليد تلقائي للجان والتوزيع'}
            </button>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} />
              إضافة لجنة جديدة
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث في اللجان..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-right"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as 'all' | 'classroom' | 'lab')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">الكل</option>
            <option value="classroom">قاعات</option>
            <option value="lab">معامل</option>
          </select>
        </div>
      </div>

      {/* Committees Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredCommittees.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 text-lg mb-2">لا توجد لجان محددة</p>
            <p className="text-gray-400 text-sm">ابدأ بإضافة لجنة جديدة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommittees.map(committee => {
              const room = allRooms.find(r => r.id === committee.room_id);
              return (
                <div
                  key={committee.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{committee.name}</h3>
                      {committee.course_name && (
                        <p className="text-sm text-gray-600">{committee.course_name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(committee)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(committee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 size={16} />
                      <span>{committee.room_code}</span>
                      <span className="text-gray-400">({room?.room_type === 'lab' || (room as any)?.type === 'lab' ? 'معمل' : 'قاعة'})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={16} />
                      <span>{committee.assigned_students} / {committee.capacity} طالب</span>
                    </div>
                    {committee.exam_date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{committee.exam_date}</span>
                      </div>
                    )}
                    {committee.exam_time && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>{committee.exam_time}</span>
                      </div>
                    )}
                    {committee.supervisor && (
                      <div className="text-gray-600">
                        <span className="font-medium">المشرف:</span> {committee.supervisor}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      committee.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : committee.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {committee.status === 'active' ? 'نشط' : 
                       committee.status === 'completed' ? 'مكتمل' : 'ملغي'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCommittee ? 'تعديل اللجنة' : 'إضافة لجنة جديدة'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCommittee(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم اللجنة *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-right"
                  placeholder="مثال: لجنة امتحان CS101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المقرر (اختياري)</label>
                <select
                  value={formData.course_id}
                  onChange={e => handleCourseChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">اختر مقرر...</option>
                  {allCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.id} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">القاعة / المعمل *</label>
                <select
                  value={formData.room_id}
                  onChange={e => handleRoomChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">اختر قاعة أو معمل...</option>
                  {availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.code} - {room.name} ({room.capacity} طالب) - {room.room_type === 'lab' || (room as any).type === 'lab' ? 'معمل' : 'قاعة'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الامتحان</label>
                  <input
                    type="date"
                    value={formData.exam_date}
                    onChange={e => setFormData({ ...formData, exam_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وقت الامتحان</label>
                  <input
                    type="time"
                    value={formData.exam_time}
                    onChange={e => setFormData({ ...formData, exam_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المشرف (اختياري)</label>
                <input
                  type="text"
                  value={formData.supervisor}
                  onChange={e => setFormData({ ...formData, supervisor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-right"
                  placeholder="اسم المشرف"
                />
              </div>

              {formData.room_id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>السعة:</strong> {formData.capacity} طالب
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCommittee(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="إلغاء"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                title="حفظ"
              >
                <Save size={18} />
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeDefinition;

