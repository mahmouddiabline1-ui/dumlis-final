/**
 * Form Options for Dropdown Menus
 * ================================
 * Provides both dynamic data from the backend and static enums.
 * Dynamic options (faculties, departments, courses, rooms, instructors) are loaded from the API.
 * Static enums (status, days, time slots, etc.) are defined here.
 */

import { lookupApi } from '../lookupApi';

// Static reference data (not in database)
const STATIC_OPTIONS = {
  groups: ['A', 'B', 'C', 'D'],

  academic_titles: [
    'أستاذ دكتور',
    'أستاذ مساعد',
    'دكتور',
    'مدرس',
    'مدرس مساعد',
    'معيد'
  ],

  weekly_hours: ['2', '3', '4', '6', '8', '12'],

  setting_categories: [
    'عام',
    'تسجيل أكاديمي',
    'درجات',
    'تواريخ',
    'رسوم',
    'عرض',
    'أخرى'
  ],

  status_options: [
    'مفتوح',
    'مغلق',
    'قيد الغلق',
    'منشور',
    'نشط',
    'غير نشط',
    'مؤجل',
    'ملغي',
    'مكتمل',
    'قيد المراجعة',
    'مؤكد',
    'مؤقت',
    'مسودة',
    'أرشفة'
  ],

  days: [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس'
  ],

  time_slots: [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00'
  ],

  room_types: [
    'محاضرات',
    'معامل',
    'قاعة مناقشة',
    'مدرج'
  ],

  student_levels: [
    'المستوى الأول',
    'المستوى الثاني',
    'المستوى الثالث',
    'المستوى الرابع',
    'المستوى الخامس',
    'المستوى السادس',
    'المستوى السابع'
  ],

  level_options: [
    { label: 'المستوى الأول', value: '1' },
    { label: 'المستوى الثاني', value: '2' },
    { label: 'المستوى الثالث', value: '3' },
    { label: 'المستوى الرابع', value: '4' },
    { label: 'المستوى الخامس', value: '5' },
    { label: 'المستوى السادس', value: '6' },
    { label: 'المستوى السابع', value: '7' },
  ],

  student_status: [
    'مقيد',
    'نشط',
    'منسحب',
    'منقطع',
    'موقوف',
    'خريج',
    'مفصول',
    'منقول',
    'مستجد'
  ],

  id_card_status: [
    'نشط',
    'لم يُطبع',
    'قيد الإنشاء',
    'طُبع',
    'ملغي',
    'مفقود'
  ],

  level_mod_status: [
    'قيد المراجعة',
    'موافق عليه',
    'مرفوض',
    'مكتمل'
  ],

  program_rule_status: [
    'ساري',
    'غير ساري',
    'قيد المراجعة',
    'ملغي'
  ],

  military_status: [
    'لم يلتحق',
    'ملتحق',
    'مكتمل',
    'معفي',
    'مؤجل'
  ],

  enrollment_status: ['مسجل', 'منسحب', 'مؤجل', 'معلق'],
  student_reg_status: ['قيد المراجعة', 'مقبول', 'مرفوض'],
  financial_status: ['مسدد', 'غير مسدد', 'مسدد جزئياً'],
  committee_status: ['active', 'completed', 'cancelled'],
  closure_status: ['مكتمل', 'مفتوح', 'مغلق'],
  active_inactive: ['نشط', 'غير نشط'],

  fees_status: [
    'مسدد',
    'غير مسدد',
    'مسدد جزئياً',
    'معفي'
  ],

  fee_types: [
    'رسوم التسجيل',
    'رسوم الفصل الدراسي',
    'رسوم الخدمات',
    'رسوم الكتب',
    'رسوم المعامل',
    'أخرى'
  ],

  regulations: [
    'لائحة قديمة',
    'لائحة جديدة'
  ],

  cities: [
    'دمياط', 'المنصورة', 'بورسعيد', 'رأس البر', 'فارسكور', 'كفر سعد',
    'القاهرة', 'جمصة', 'الزرقا', 'الروضة', 'كفر البطيخ', 'ميت أبو غالب',
    'شربين', 'طلخا', 'بلقاس', 'أجا', 'الإسكندرية', 'الجيزة',
    'أسوان', 'الأقصر', 'سوهاج', 'قنا', 'المنيا', 'بني سويف',
    'الفيوم', 'أسيوط', 'البحيرة', 'الغربية', 'الدقهلية', 'الشرقية',
    'كفر الشيخ', 'مطروح'
  ],

  semesters: [
    '2024-2025 خريف',
    '2024-2025 ربيع',
    '2025-2026 خريف',
    '2025-2026 ربيع',
    '2023-2024 خريف',
    '2023-2024 ربيع',
  ],

  academic_years: [
    '2024-2025',
    '2023-2024',
    '2022-2023',
    '2025-2026'
  ],

  graduation_years: (() => {
    const y = new Date().getFullYear();
    const years: string[] = [];
    for (let i = y + 2; i >= y - 15; i--) years.push(String(i));
    return years;
  })(),

  schedule_status: [
    'نشط',
    'قيد الإنشاء',
    'مؤجل',
    'منتهي',
    'ملغي',
    'مجمد'
  ],

  course_counts: [
    '4', '5', '6', '7', '8', '9', '10', '11', '12'
  ],

  course_types: [
    'إجباري',
    'اختياري',
    'متطلب كلية',
    'متطلب جامعة'
  ],

  session_types: [
    'محاضرة',
    'سكشن',
    'معمل',
    'ندوة',
    'ورشة عمل'
  ],

  attendance_status: [
    'حاضر',
    'غائب',
    'متأخر',
    'معذور'
  ],

  grade_letters: [
    'A+', 'A', 'A-',
    'B+', 'B', 'B-',
    'C+', 'C', 'C-',
    'D+', 'D',
    'F'
  ],

  registration_status: [
    'مسجل',
    'غير مسجل',
    'منسحب',
    'مؤجل',
    'معلق'
  ]
};

// Runtime cache for dynamic options
export const FORM_OPTIONS = {
  ...STATIC_OPTIONS,
  course_codes: [] as string[],
  course_names: {} as Record<string, string>,
  instructor_names: [] as string[],
  departments: [] as string[],
  rooms: [] as string[],
  faculties: [] as string[],
  student_ids: [] as string[],
};

/**
 * Load dynamic options from the backend (courses, faculties, departments, etc.)
 * Call this during app initialization
 */
export async function loadDynamicOptions() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (!token) return false;

  try {
    // Load faculties
    const faculties = await lookupApi.getFaculties();
    FORM_OPTIONS.faculties = faculties.map(f => f.name);

    // Load departments
    const departments = await lookupApi.getDepartments();
    FORM_OPTIONS.departments = departments.map(d => d.name);

    // Load courses
    const courses = await lookupApi.getCourses();
    FORM_OPTIONS.course_codes = courses.map(c => c.id);
    FORM_OPTIONS.course_names = courses.reduce((acc, c) => {
      acc[c.id] = c.name;
      return acc;
    }, {} as Record<string, string>);

    // Load rooms
    const rooms = await lookupApi.getRooms();
    FORM_OPTIONS.rooms = rooms.map(r => r.name);

    // Load instructors
    const instructors = await lookupApi.getInstructors();
    FORM_OPTIONS.instructor_names = instructors.map(i => i.name);

    // Load student IDs for autocomplete
    try {
      const students = await lookupApi.getStudents();
      FORM_OPTIONS.student_ids = students.map((s: any) => s.student_id || s.id);
    } catch (_) {
      // non-critical
    }

    console.log('✅ Dynamic form options loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to load dynamic form options:', error);
    // Fall through gracefully - app will still work with empty arrays
    return false;
  }
}

export const getFieldOptions = (fieldKey: string): string[] => {
  const fieldMapping: { [key: string]: string[] } = {
    'course_code': FORM_OPTIONS.course_codes,
    'course_name': Object.values(FORM_OPTIONS.course_names),
    'group': FORM_OPTIONS.groups,
    'instructor': FORM_OPTIONS.instructor_names,
    'instructor_name': FORM_OPTIONS.instructor_names,
    'اسم_المحاضر': FORM_OPTIONS.instructor_names,
    'academic_title': FORM_OPTIONS.academic_titles,
    'اللقب_العلمي': FORM_OPTIONS.academic_titles,
    'department': FORM_OPTIONS.departments,
    'القسم': FORM_OPTIONS.departments,
    'weekly_hours': FORM_OPTIONS.weekly_hours,
    'الساعات_الأسبوعية': FORM_OPTIONS.weekly_hours,
    'status': FORM_OPTIONS.status_options,
    'الحالة': FORM_OPTIONS.status_options,
    'enrollment_status': FORM_OPTIONS.enrollment_status,
    'request_status': FORM_OPTIONS.student_reg_status,
    'payment_status': FORM_OPTIONS.financial_status,
    'student_id': FORM_OPTIONS.student_ids,
    'day': FORM_OPTIONS.days,
    'اليوم': FORM_OPTIONS.days,
    'time': FORM_OPTIONS.time_slots,
    'الوقت': FORM_OPTIONS.time_slots,
    'room': FORM_OPTIONS.rooms,
    'القاعة': FORM_OPTIONS.rooms,
    'room_type': FORM_OPTIONS.room_types,
    'level': FORM_OPTIONS.student_levels,
    'المستوى': FORM_OPTIONS.student_levels,
    'old_level': FORM_OPTIONS.student_levels,
    'new_level': FORM_OPTIONS.student_levels,
    'student_status': FORM_OPTIONS.student_status,
    'fees_status': FORM_OPTIONS.fees_status,
    'fee_type': FORM_OPTIONS.fee_types,
    'نوع_الرسوم': FORM_OPTIONS.fee_types,
    'regulation': FORM_OPTIONS.regulations,
    'city': FORM_OPTIONS.cities,
    'المدينة': FORM_OPTIONS.cities,
    'faculty': FORM_OPTIONS.faculties,
    'الكلية': FORM_OPTIONS.faculties,
    'semester': FORM_OPTIONS.semesters,
    'الفصل_الدراسي': FORM_OPTIONS.semesters,
    'academic_year': FORM_OPTIONS.academic_years,
    'العام_الأكاديمي': FORM_OPTIONS.academic_years,
    'graduation_year': FORM_OPTIONS.graduation_years,
    'عام_التخرج': FORM_OPTIONS.graduation_years,
    'schedule_status': FORM_OPTIONS.schedule_status,
    'courses_count': FORM_OPTIONS.course_counts,
    'عدد_المقررات': FORM_OPTIONS.course_counts,
    'course_type': FORM_OPTIONS.course_types,
    'session_type': FORM_OPTIONS.session_types,
    'attendance_status': FORM_OPTIONS.attendance_status,
    'grade': FORM_OPTIONS.grade_letters,
    'registration_status': FORM_OPTIONS.registration_status,
    'category': FORM_OPTIONS.setting_categories,
    'التصنيف': FORM_OPTIONS.setting_categories,
    'course_id': FORM_OPTIONS.course_codes,
  };

  return fieldMapping[fieldKey] || [];
};

export const shouldUseDropdown = (fieldKey: string, fieldLabel: string): boolean => {
  const dropdownFields = [
    'course_code', 'group', 'instructor', 'instructor_name', 'اسم_المحاضر',
    'academic_title', 'اللقب_العلمي', 'department', 'القسم',
    'weekly_hours', 'الساعات_الأسبوعية', 'status', 'الحالة',
    'day', 'اليوم', 'time', 'الوقت', 'room', 'القاعة', 'room_type',
    'level', 'المستوى', 'old_level', 'new_level', 'student_status', 'fees_status', 'fee_type', 'نوع_الرسوم', 'regulation',
    'city', 'المدينة', 'faculty', 'الكلية', 'semester', 'الفصل_الدراسي',
    'academic_year', 'العام_الأكاديمي', 'graduation_year', 'عام_التخرج', 'schedule_status', 'courses_count', 'عدد_المقررات',
    'course_type', 'session_type', 'attendance_status', 'grade', 'registration_status',
    'category', 'التصنيف', 'student_id', 'course_id',
    'enrollment_status', 'request_status', 'payment_status',
  ];

  return dropdownFields.includes(fieldKey) ||
         dropdownFields.some(field => fieldLabel.includes(field)) ||
         fieldLabel.includes('حالة') ||
         fieldLabel.includes('نوع') ||
         fieldLabel.includes('قسم') ||
         fieldLabel.includes('مستوى') ||
         fieldLabel.includes('مجموعة');
};
