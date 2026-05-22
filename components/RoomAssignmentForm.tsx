import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, Save, Eye, X, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { addRoomAssignment } from '../data/pageConfig';

interface RoomAssignmentFormProps {
  config: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const RoomAssignmentForm: React.FC<RoomAssignmentFormProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState<any>({});
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const formConfig = config.data[0];
  const courseNames = formConfig.course_names;
  const rooms = formConfig.available_rooms;
  const existingAssignments = formConfig.existing_assignments;
  const rules = formConfig.validation_rules;

  // Handle course selection
  const handleCourseChange = (courseCode: string) => {
    setFormData({
      ...formData,
      course_code: courseCode,
      course_name: courseNames[courseCode] || ''
    });
  };

  // Handle day and time selection to filter available rooms
  const handleTimeSlotChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Filter available rooms based on conflicts
    if (updatedData.day && updatedData.time) {
      const conflictingAssignments = existingAssignments.filter((assignment: any) => 
        assignment.day === updatedData.day && assignment.time === updatedData.time
      );
      
      const occupiedRooms = conflictingAssignments.map((assignment: any) => assignment.room);
      const freeRooms = rooms.filter((room: any) => !occupiedRooms.includes(room.name));
      
      setAvailableRooms(freeRooms);
    }
  };

  // Handle room selection
  const handleRoomChange = (roomName: string) => {
    const selectedRoom = rooms.find((room: any) => room.name === roomName);
    setFormData({
      ...formData,
      room: roomName,
      capacity: selectedRoom ? selectedRoom.capacity : 0
    });
  };

  // Validate assignment
  const validateAssignment = () => {
    setIsValidating(true);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!formData.course_code || !formData.group || !formData.day || !formData.time || !formData.room || !formData.enrolled) {
      errors.push('جميع الحقول مطلوبة');
      setValidationErrors(errors);
      setIsValidating(false);
      return;
    }

    // Check for double booking
    const conflict = existingAssignments.find((assignment: any) => 
      assignment.day === formData.day && 
      assignment.time === formData.time && 
      assignment.room === formData.room
    );

    if (conflict) {
      errors.push(`${rules.no_double_booking}: ${conflict.course_code} - ${conflict.group}`);
    }

    // Check capacity
    const selectedRoom = rooms.find((room: any) => room.name === formData.room);
    if (selectedRoom && formData.enrolled > selectedRoom.capacity) {
      errors.push(`${rules.capacity_check} (السعة: ${selectedRoom.capacity}، المسجلين: ${formData.enrolled})`);
    }

    // Check if room is nearly full
    if (selectedRoom && formData.enrolled > selectedRoom.capacity * 0.9) {
      warnings.push(`القاعة ستكون ممتلئة تقريباً (${Math.round((formData.enrolled / selectedRoom.capacity) * 100)}%)`);
    }

    // Check for same course/group conflicts
    const courseConflict = existingAssignments.find((assignment: any) => 
      assignment.course_code === formData.course_code && 
      assignment.group === formData.group &&
      assignment.day === formData.day
    );

    if (courseConflict && courseConflict.time !== formData.time) {
      warnings.push(`نفس المجموعة لديها محاضرة أخرى في نفس اليوم في الوقت ${courseConflict.time}`);
    }

    // Check room type matching (simplified logic)
    if (selectedRoom) {
      const isLabCourse = formData.course_code.includes('CS') && (formData.course_code.includes('102') || formData.course_code.includes('202'));
      if (isLabCourse && selectedRoom.type !== 'معامل') {
        warnings.push('هذا المقرر قد يحتاج لمعمل حاسوب');
      }
    }

    setValidationErrors(errors);
    setValidationWarnings(warnings);
    setIsValidating(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    validateAssignment();
    
    if (validationErrors.length === 0) {
      const selectedRoom = rooms.find((room: any) => room.name === formData.room);
      const status = formData.enrolled >= selectedRoom.capacity * 0.9 ? 'ممتلئة' : 
                    formData.enrolled >= selectedRoom.capacity * 0.7 ? 'موشك على الامتلاء' : 'متاحة';

      const assignmentData = {
        id: Date.now(), // Simple ID generation
        course_code: formData.course_code,
        course_name: formData.course_name,
        group: formData.group,
        day: formData.day,
        time: formData.time,
        room: formData.room,
        capacity: selectedRoom.capacity,
        enrolled: parseInt(formData.enrolled),
        status: status,
        room_type: selectedRoom.type,
        created_date: new Date().toISOString()
      };
      
      onSave(assignmentData);
    }
  };

  useEffect(() => {
    if (formData.day && formData.time && formData.room && formData.enrolled) {
      validateAssignment();
    }
  }, [formData]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
        <p className="text-gray-600">{config.description}</p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Course and Time */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">معلومات المقرر والوقت</h3>
          
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">كود المقرر *</label>
            <select
              value={formData.course_code || ''}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">اختر المقرر...</option>
              {Object.entries(courseNames).map(([code, name]) => (
                <option key={code} value={code}>{code} - {name}</option>
              ))}
            </select>
          </div>

          {/* Course Name (Auto-filled) */}
          {formData.course_name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المقرر</label>
              <input
                type="text"
                value={formData.course_name}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
              />
            </div>
          )}

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المجموعة *</label>
            <select
              value={formData.group || ''}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">اختر المجموعة...</option>
              <option value="A">المجموعة A</option>
              <option value="B">المجموعة B</option>
              <option value="C">المجموعة C</option>
            </select>
          </div>

          {/* Day Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اليوم *</label>
            <select
              value={formData.day || ''}
              onChange={(e) => handleTimeSlotChange('day', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">اختر اليوم...</option>
              <option value="الأحد">الأحد</option>
              <option value="الإثنين">الإثنين</option>
              <option value="الثلاثاء">الثلاثاء</option>
              <option value="الأربعاء">الأربعاء</option>
              <option value="الخميس">الخميس</option>
            </select>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الوقت *</label>
            <select
              value={formData.time || ''}
              onChange={(e) => handleTimeSlotChange('time', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">اختر الوقت...</option>
              <option value="08:00 - 10:00">08:00 - 10:00</option>
              <option value="10:00 - 12:00">10:00 - 12:00</option>
              <option value="12:00 - 14:00">12:00 - 14:00</option>
              <option value="14:00 - 16:00">14:00 - 16:00</option>
              <option value="16:00 - 18:00">16:00 - 18:00</option>
            </select>
          </div>
        </div>

        {/* Right Column - Room and Capacity */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">معلومات القاعة</h3>
          
          {/* Available Rooms */}
          {formData.day && formData.time && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                القاعات المتاحة * 
                <span className="text-xs text-green-600 mr-2">({availableRooms.length} قاعة متاحة)</span>
              </label>
              <select
                value={formData.room || ''}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">اختر القاعة...</option>
                {availableRooms.map((room) => (
                  <option key={room.name} value={room.name}>
                    {room.name} - {room.type} (سعة: {room.capacity})
                  </option>
                ))}
              </select>
            </div>
          )}

          {!formData.day || !formData.time ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Info className="w-5 h-5" />
                <span className="text-sm">اختر اليوم والوقت أولاً لعرض القاعات المتاحة</span>
              </div>
            </div>
          ) : null}

          {/* Room Capacity (Auto-filled) */}
          {formData.capacity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">سعة القاعة</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${formData.capacity} طالب`}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                />
                <Users className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Expected Enrollment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عدد المسجلين المتوقع *</label>
            <input
              type="number"
              value={formData.enrolled || ''}
              onChange={(e) => setFormData({ ...formData, enrolled: e.target.value })}
              placeholder="أدخل عدد الطلاب المتوقع..."
              min="1"
              max={formData.capacity || 200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Validation Results */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertTriangle className="w-5 h-5" />
                أخطاء في التخصيص
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {validationWarnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                <Info className="w-5 h-5" />
                تحذيرات
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Summary */}
      {formData.course_code && formData.room && formData.enrolled && (
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">ملخص التخصيص</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">المقرر:</span>
              <span className="font-medium">{formData.course_code}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">الوقت:</span>
              <span className="font-medium">{formData.day} {formData.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">القاعة:</span>
              <span className="font-medium">{formData.room}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">الإشغال:</span>
              <span className="font-medium">{formData.enrolled}/{formData.capacity}</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">تعليمات التخصيص</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {formConfig.instructions.steps.map((step: string, index: number) => (
            <li key={index}>• {step}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={validateAssignment}
            disabled={!formData.course_code || !formData.room || isValidating}
            className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'التحقق من التعارضات'
            )}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!formData.course_code || !formData.room || !formData.enrolled || validationErrors.length > 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ التخصيص
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomAssignmentForm;
