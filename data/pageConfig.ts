import { PageConfig, AcademicFaculty, AcademicDepartment, AcademicProgram, AcademicCourse, StudyRegulation, AcademicRules } from '../types';
import { FACULTIES } from '../constants';
import { FORM_OPTIONS } from './formOptions';


export const COURSES_DATABASE: any[] = [];
export const ALL_STUDENTS: any[] = [];
export const OLD_REGULATION_STUDENTS: any[] = [];
export const NEW_REGULATION_STUDENTS: any[] = [];
export const STUDENT_ENROLLMENTS: any[] = [];
export const STUDENT_GRADES: any[] = [];
export const ATTENDANCE_RECORDS: any[] = [];
export const CLASSROOM_ASSIGNMENTS: any[] = [];
export const FINANCIAL_RECORDS: any[] = [];
export const COURSE_SCHEDULES: any[] = [];
export const DEPARTMENTS_FCAI: string[] = [];
export const STATUSES: string[] = [];
export const CITIES: string[] = [];
export const LEVELS: string[] = [];
export const REGULATIONS: string[] = [];
export const STUDENT_SCHEDULES: any[] = [];
export const FCAI_STUDENTS: any[] = [];
export const getCurrentAcademicContext = () => ({ semester: 'ربيع', academicYear: '2023-2024' });
export const getDynamicFeesSetup = (facultyId?: string | null) => [];
export const getDynamicFeesCollect = (facultyId?: string | null) => [];
export const getDynamicPaymentPerm = (facultyId?: string | null) => [];

export const MOCK_DATABASE: Record<string, PageConfig> = {
  // ==================================================================================
  // ADMIN: STUDENT LIST (GENERATED DATA)
  // ==================================================================================
  'student_list': {
    id: 'student_list',
    title: 'قوائم الطلاب المقيدين',
    description: `عرض وإدارة بيانات الطلاب التفصيلية (3500 طالب إجمالي - 1500 لائحة قديمة، 2000 لائحة جديدة)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'national_id', label: 'الرقم القومي' },
      { key: 'faculty', label: 'الكلية' },
      { key: 'department', label: 'القسم / الشعبة' },
      { key: 'level', label: 'المستوى' },
      { key: 'regulation', label: 'اللائحة', type: 'status' },
      { key: 'gpa', label: 'GPA' },
      { key: 'phone', label: 'الهاتف' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'city', label: 'المدينة' },
      { key: 'fees_status', label: 'المصروفات', type: 'status' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: ALL_STUDENTS,
    actions: [
      { type: 'add', label: 'تسجيل طالب جديد' },
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة كشف' }
    ]
  },

  // ==================================================================================
  // REGULATION-BASED STUDENT LISTS
  // ==================================================================================
  'old_regulation_students': {
    id: 'old_regulation_students',
    title: 'طلاب اللائحة القديمة',
    description: `قائمة الطلاب المقيدين باللائحة القديمة (${OLD_REGULATION_STUDENTS.length} طالب)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'faculty', label: 'الكلية' },
      { key: 'department', label: 'القسم / الشعبة' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: OLD_REGULATION_STUDENTS,
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة كشف' }
    ]
  },

  'new_regulation_students': {
    id: 'new_regulation_students',
    title: 'طلاب اللائحة الجديدة',
    description: `قائمة الطلاب المقيدين باللائحة الجديدة (${NEW_REGULATION_STUDENTS.length} طالب)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'faculty', label: 'الكلية' },
      { key: 'department', label: 'القسم / الشعبة' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: NEW_REGULATION_STUDENTS,
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة كشف' }
    ]
  },

  'regulation_statistics': {
    id: 'regulation_statistics',
    title: 'إحصائيات اللوائح',
    description: 'إحصائيات مقارنة بين طلاب اللائحة القديمة والجديدة',
    type: 'table',
    columns: [
      { key: 'regulation', label: 'اللائحة' },
      { key: 'total_students', label: 'إجمالي الطلاب' },
      { key: 'fcai_students', label: 'طلاب الحاسبات' },
      { key: 'other_students', label: 'طلاب كليات أخرى' },
      { key: 'active_students', label: 'طلاب نشطين' },
      { key: 'average_gpa', label: 'متوسط المعدل' }
    ],
    data: (() => {
      const oldStats = {
        regulation: 'لائحة قديمة',
        total_students: OLD_REGULATION_STUDENTS.length,
        fcai_students: OLD_REGULATION_STUDENTS.filter(s => s.faculty_code === 'FCAI').length,
        other_students: OLD_REGULATION_STUDENTS.filter(s => s.faculty_code !== 'FCAI').length,
        active_students: OLD_REGULATION_STUDENTS.filter(s => s.status === 'مقيد').length,
        average_gpa: (OLD_REGULATION_STUDENTS.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / OLD_REGULATION_STUDENTS.length).toFixed(2)
      };

      const newStats = {
        regulation: 'لائحة جديدة',
        total_students: NEW_REGULATION_STUDENTS.length,
        fcai_students: NEW_REGULATION_STUDENTS.filter(s => s.faculty_code === 'FCAI').length,
        other_students: NEW_REGULATION_STUDENTS.filter(s => s.faculty_code !== 'FCAI').length,
        active_students: NEW_REGULATION_STUDENTS.filter(s => s.status === 'مقيد').length,
        average_gpa: (NEW_REGULATION_STUDENTS.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / NEW_REGULATION_STUDENTS.length).toFixed(2)
      };

      return [oldStats, newStats];
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة تقرير' }
    ]
  },

  'advanced_student_search': {
    id: 'advanced_student_search',
    title: 'البحث المتقدم في قاعدة بيانات الطلاب',
    description: 'بحث وفلترة متقدمة لقاعدة بيانات الطلاب بناءً على معايير متعددة',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'faculty', label: 'الكلية' },
      { key: 'department', label: 'القسم' },
      { key: 'level', label: 'المستوى' },
      { key: 'regulation', label: 'اللائحة', type: 'status' },
      { key: 'gpa', label: 'المعدل' },
      { key: 'city', label: 'المدينة' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: ALL_STUDENTS,
    actions: [
      { type: 'export', label: 'تصدير النتائج' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // ==================================================================================
  // COURSES AND ENROLLMENT MANAGEMENT
  // ==================================================================================
  'course_catalog': {
    id: 'course_catalog',
    title: 'كتالوج المقررات الدراسية',
    description: 'قائمة شاملة بجميع المقررات المتاحة في النظام',
    type: 'table',
    columns: [
      { key: 'id', label: 'كود المقرر' },
      { key: 'name', label: 'اسم المقرر' },
      { key: 'level', label: 'المستوى' },
      { key: 'department', label: 'القسم' },
      { key: 'hours', label: 'الساعات المعتمدة' },
      { key: 'type', label: 'النوع' },
      { key: 'semester', label: 'الفصل الدراسي' }
    ],
    data: COURSES_DATABASE,
    actions: [
      { type: 'add', label: 'إضافة مقرر جديد' },
      { type: 'edit', label: 'تعديل مقرر' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'student_enrollments': {
    id: 'student_enrollments',
    title: 'تسجيلات الطلاب في المقررات',
    description: `عرض تسجيلات الطلاب في المقررات الدراسية (${STUDENT_ENROLLMENTS.length} تسجيل)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'status', label: 'حالة التسجيل', type: 'status' }
    ],
    data: STUDENT_ENROLLMENTS,
    actions: [
      { type: 'add', label: 'تسجيل طالب في مقرر' },
      { type: 'edit', label: 'تعديل التسجيل' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'detailed_grades': {
    id: 'detailed_grades',
    title: 'درجات الطلاب التفصيلية',
    description: `عرض تفصيلي لدرجات الطلاب في جميع المقررات (${STUDENT_GRADES.length} سجل درجات)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'midterm', label: 'أعمال السنة' },
      { key: 'final', label: 'الامتحان النهائي' },
      { key: 'assignments', label: 'التكليفات' },
      { key: 'total', label: 'المجموع' },
      { key: 'grade_letter', label: 'التقدير' },
      { key: 'grade_points', label: 'النقاط' }
    ],
    data: STUDENT_GRADES,
    actions: [
      { type: 'add', label: 'إضافة درجات' },
      { type: 'edit', label: 'تعديل درجات' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'attendance_log': {
    id: 'attendance_log',
    title: 'سجل حضور الطلاب',
    description: 'سجل حضور شامل للطلاب في المقررات الدراسية',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'session_type', label: 'نوع الجلسة' },
      { key: 'week', label: 'الأسبوع' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'status', label: 'حالة الحضور', type: 'status' }
    ],
    actions: [
      { type: 'add', label: 'تسجيل حضور' },
      { type: 'edit', label: 'تعديل حضور' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'detailed_attendance': {
    id: 'detailed_attendance',
    title: 'سجل الحضور التفصيلي',
    description: `سجل مفصل لحضور الطلاب في جميع المحاضرات (${ATTENDANCE_RECORDS.length} سجل حضور)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'week', label: 'الأسبوع' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'session_type', label: 'نوع الجلسة' },
      { key: 'status', label: 'حالة الحضور', type: 'status' }
    ],
    data: ATTENDANCE_RECORDS,
    actions: [
      { type: 'add', label: 'تسجيل حضور' },
      { type: 'edit', label: 'تعديل حضور' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'financial_records': {
    id: 'financial_records',
    title: 'السجلات المالية للطلاب',
    description: `عرض تفصيلي للرسوم والمدفوعات (${FINANCIAL_RECORDS.length} سجل مالي)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'fee_type', label: 'نوع الرسوم' },
      { key: 'amount', label: 'المبلغ المستحق', type: 'currency' },
      { key: 'paid_amount', label: 'المبلغ المدفوع', type: 'currency' },
      { key: 'remaining', label: 'المتبقي', type: 'currency' },
      { key: 'status', label: 'الحالة', type: 'status' },
      { key: 'due_date', label: 'تاريخ الاستحقاق', type: 'date' }
    ],
    data: FINANCIAL_RECORDS,
    actions: [
      { type: 'add', label: 'إضافة رسوم' },
      { type: 'edit', label: 'تسجيل دفعة' },
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة إيصال' }
    ]
  },

  'fees_report': {
    id: 'fees_report',
    title: 'تقارير بيانات مالية',
    description: 'تقارير تفصيلية للرسوم والمدفوعات لجميع الطلاب',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'fee_type', label: 'نوع الرسوم' },
      { key: 'amount', label: 'المبلغ المستحق', type: 'currency' },
      { key: 'paid_amount', label: 'المبلغ المدفوع', type: 'currency' },
      { key: 'remaining', label: 'المتبقي', type: 'currency' },
      { key: 'status', label: 'الحالة', type: 'status' },
      { key: 'due_date', label: 'تاريخ الاستحقاق', type: 'date' },
      { key: 'semester', label: 'الفصل الدراسي' }
    ],
    data: [],
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // ==================================================================================
  // ANALYTICAL REPORTS WITH RELATIONS
  // ==================================================================================
  'student_academic_profile': {
    id: 'student_academic_profile',
    title: 'الملف الأكاديمي للطلاب',
    description: 'ملف شامل يجمع البيانات الأكاديمية والمالية لكل طالب',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'enrolled_courses', label: 'المقررات المسجلة' },
      { key: 'completed_courses', label: 'المقررات المكتملة' },
      { key: 'current_gpa', label: 'المعدل الحالي' },
      { key: 'attendance_rate', label: 'معدل الحضور' },
      { key: 'financial_status', label: 'الحالة المالية', type: 'status' }
    ],
    data: (() => {
      return ALL_STUDENTS.slice(0, 100).map(student => {
        const enrollments = STUDENT_ENROLLMENTS.filter(e => e.student_id === student.student_id);
        const grades = STUDENT_GRADES.filter(g => g.student_id === student.student_id);
        const attendance = ATTENDANCE_RECORDS.filter(a => a.student_id === student.student_id);
        const financial = FINANCIAL_RECORDS.filter(f => f.student_id === student.student_id);

        const totalAttendance = attendance.length;
        const presentCount = attendance.filter(a => a.status === 'حاضر').length;
        const attendanceRate = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) + '%' : 'N/A';

        const totalOwed = financial.reduce((sum, f) => sum + f.amount, 0);
        const totalPaid = financial.reduce((sum, f) => sum + f.paid_amount, 0);
        const financialStatus = totalPaid >= totalOwed ? 'مسدد بالكامل' : 'يوجد مستحقات';

        return {
          student_id: student.student_id,
          name: student.name,
          enrolled_courses: enrollments.length,
          completed_courses: grades.length,
          current_gpa: student.gpa,
          attendance_rate: attendanceRate,
          financial_status: financialStatus
        };
      });
    })(),
    actions: [
      { type: 'view', label: 'عرض التفاصيل' },
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة الملف' }
    ]
  },

  'course_performance_analysis': {
    id: 'course_performance_analysis',
    title: 'تحليل أداء المقررات',
    description: 'تحليل شامل لأداء الطلاب في المقررات المختلفة',
    type: 'table',
    columns: [
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'enrolled_count', label: 'عدد المسجلين' },
      { key: 'completed_count', label: 'عدد المكملين' },
      { key: 'pass_rate', label: 'معدل النجاح' },
      { key: 'average_grade', label: 'متوسط الدرجات' },
      { key: 'attendance_rate', label: 'معدل الحضور' }
    ],
    data: (() => {
      const courseStats: any[] = [];

      COURSES_DATABASE.forEach(course => {
        const enrollments = STUDENT_ENROLLMENTS.filter(e => e.course_id === course.id);
        const grades = STUDENT_GRADES.filter(g => g.course_id === course.id);
        const attendance = ATTENDANCE_RECORDS.filter(a => a.course_id === course.id);

        const passCount = grades.filter(g => g.grade_points >= 2.0).length;
        const passRate = grades.length > 0 ? ((passCount / grades.length) * 100).toFixed(1) + '%' : 'N/A';

        const avgGrade = grades.length > 0 ?
          (grades.reduce((sum, g) => sum + g.total, 0) / grades.length).toFixed(1) : 'N/A';

        const totalSessions = attendance.length;
        const presentSessions = attendance.filter(a => a.status === 'حاضر').length;
        const attendanceRate = totalSessions > 0 ?
          ((presentSessions / totalSessions) * 100).toFixed(1) + '%' : 'N/A';

        courseStats.push({
          course_id: course.id,
          course_name: course.name,
          enrolled_count: enrollments.length,
          completed_count: grades.length,
          pass_rate: passRate,
          average_grade: avgGrade,
          attendance_rate: attendanceRate
        });
      });

      return courseStats;
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة التقرير' }
    ]
  },

  // ==================================================================================
  // SCHEDULE MANAGEMENT WITH RELATIONS
  // ==================================================================================
  'course_schedules': {
    id: 'course_schedules',
    title: 'جداول المقررات الدراسية',
    description: `جداول جميع المقررات مع تفاصيل المواعيد والقاعات (${COURSE_SCHEDULES.length} جلسة دراسية)`,
    type: 'table',
    columns: [
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'session_type', label: 'نوع الجلسة' },
      { key: 'day', label: 'اليوم' },
      { key: 'time', label: 'الوقت' },
      { key: 'room', label: 'القاعة' },
      { key: 'instructor', label: 'المحاضر' },
      { key: 'level', label: 'المستوى' },
      { key: 'department', label: 'القسم' }
    ],
    data: COURSE_SCHEDULES,
    actions: [
      { type: 'add', label: 'إضافة جلسة جديدة' },
      { type: 'edit', label: 'تعديل الجدول' },
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة الجدول' }
    ]
  },

  'student_personal_schedules': {
    id: 'student_personal_schedules',
    title: 'الجداول الشخصية للطلاب',
    description: `جداول الطلاب الشخصية بناءً على المقررات المسجلة (${STUDENT_SCHEDULES.length} جدول شخصي)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'session_type', label: 'نوع الجلسة' },
      { key: 'day', label: 'اليوم' },
      { key: 'time', label: 'الوقت' },
      { key: 'room', label: 'القاعة' },
      { key: 'instructor', label: 'المحاضر' }
    ],
    data: STUDENT_SCHEDULES.slice(0, 1000), // Show first 1000 for performance
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة الجدول الشخصي' }
    ]
  },

  'room_utilization': {
    id: 'room_utilization',
    title: 'استخدام القاعات الدراسية',
    description: 'تحليل استخدام القاعات الدراسية والمعامل',
    type: 'table',
    columns: [
      { key: 'room', label: 'القاعة' },
      { key: 'total_sessions', label: 'إجمالي الجلسات' },
      { key: 'utilization_rate', label: 'معدل الاستخدام' },
      { key: 'peak_day', label: 'أكثر الأيام استخداماً' },
      { key: 'peak_time', label: 'أكثر الأوقات استخداماً' }
    ],
    data: (() => {
      const roomStats: any[] = [];
      const rooms = [...new Set(COURSE_SCHEDULES.map(s => s.room))];

      rooms.forEach(room => {
        const roomSessions = COURSE_SCHEDULES.filter(s => s.room === room);
        const totalSlots = 5 * 5; // 5 days × 5 time slots
        const utilizationRate = ((roomSessions.length / totalSlots) * 100).toFixed(1) + '%';

        // Find peak day
        const dayCount: any = {};
        roomSessions.forEach(s => {
          dayCount[s.day] = (dayCount[s.day] || 0) + 1;
        });
        const peakDay = Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, '');

        // Find peak time
        const timeCount: any = {};
        roomSessions.forEach(s => {
          timeCount[s.time] = (timeCount[s.time] || 0) + 1;
        });
        const peakTime = Object.keys(timeCount).reduce((a, b) => timeCount[a] > timeCount[b] ? a : b, '');

        roomStats.push({
          room: room,
          total_sessions: roomSessions.length,
          utilization_rate: utilizationRate,
          peak_day: peakDay,
          peak_time: peakTime
        });
      });

      return roomStats.sort((a, b) => b.total_sessions - a.total_sessions);
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة التقرير' }
    ]
  },

  'instructor_workload': {
    id: 'instructor_workload',
    title: 'أعباء المحاضرين التدريسية',
    description: 'توزيع الأعباء التدريسية على أعضاء هيئة التدريس',
    type: 'table',
    columns: [
      { key: 'instructor', label: 'اسم المحاضر' },
      { key: 'total_courses', label: 'عدد المقررات' },
      { key: 'total_sessions', label: 'إجمالي الجلسات' },
      { key: 'teaching_hours', label: 'ساعات التدريس الأسبوعية' },
      { key: 'departments', label: 'الأقسام المُدرَّسة' }
    ],
    data: (() => {
      const instructorStats: any[] = [];
      const instructors = [...new Set(COURSE_SCHEDULES.map(s => s.instructor))];

      instructors.forEach(instructor => {
        const instructorSessions = COURSE_SCHEDULES.filter(s => s.instructor === instructor);
        const courses = [...new Set(instructorSessions.map(s => s.course_id))];
        const departments = [...new Set(instructorSessions.map(s => s.department))];

        // Calculate teaching hours (assuming each session is 2 hours)
        const teachingHours = instructorSessions.length * 2;

        instructorStats.push({
          instructor: instructor,
          total_courses: courses.length,
          total_sessions: instructorSessions.length,
          teaching_hours: teachingHours,
          departments: departments.join(', ')
        });
      });

      return instructorStats.sort((a, b) => b.teaching_hours - a.teaching_hours);
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة التقرير' }
    ]
  },

  // ==================================================================================
  // RELATED DATA VIEWS - STUDENT ENROLLMENTS & GRADES
  // ==================================================================================
  'student_course_enrollments': {
    id: 'student_course_enrollments',
    title: 'تسجيلات الطلاب في المقررات',
    description: `عرض جميع تسجيلات الطلاب في المقررات الدراسية (${STUDENT_ENROLLMENTS.length} تسجيل)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'status', label: 'حالة التسجيل', type: 'status' }
    ],
    data: STUDENT_ENROLLMENTS,
    actions: [
      { type: 'add', label: 'تسجيل طالب في مقرر' },
      { type: 'edit', label: 'تعديل التسجيل' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },


  // ==================================================================================
  // ANALYTICAL REPORTS BASED ON RELATIONS
  // ==================================================================================
  'student_performance_analysis': {
    id: 'student_performance_analysis',
    title: 'تحليل أداء الطلاب',
    description: 'تحليل شامل لأداء الطلاب بناءً على الدرجات والحضور',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'enrolled_courses', label: 'المقررات المسجلة' },
      { key: 'completed_courses', label: 'المقررات المكتملة' },
      { key: 'average_grade', label: 'متوسط الدرجات' },
      { key: 'attendance_rate', label: 'معدل الحضور' },
      { key: 'financial_status', label: 'الحالة المالية', type: 'status' }
    ],
    data: (() => {
      return ALL_STUDENTS.slice(0, 100).map(student => {
        const enrollments = STUDENT_ENROLLMENTS.filter(e => e.student_id === student.student_id);
        const grades = STUDENT_GRADES.filter(g => g.student_id === student.student_id);
        const attendance = ATTENDANCE_RECORDS.filter(a => a.student_id === student.student_id);
        const financials = FINANCIAL_RECORDS.filter(f => f.student_id === student.student_id);

        const avgGrade = grades.length > 0 ?
          (grades.reduce((sum, g) => sum + g.grade_points, 0) / grades.length).toFixed(2) : 'N/A';

        const attendanceRate = attendance.length > 0 ?
          ((attendance.filter(a => a.status === 'حاضر').length / attendance.length) * 100).toFixed(1) + '%' : 'N/A';

        const totalDue = financials.reduce((sum, f) => sum + f.amount, 0);
        const totalPaid = financials.reduce((sum, f) => sum + f.paid_amount, 0);
        const financialStatus = totalPaid >= totalDue ? 'مسدد بالكامل' : 'مستحقات متبقية';

        return {
          student_id: student.student_id,
          name: student.name,
          enrolled_courses: enrollments.length,
          completed_courses: grades.length,
          average_grade: avgGrade,
          attendance_rate: attendanceRate,
          financial_status: financialStatus
        };
      });
    })(),
    actions: [
      { type: 'export', label: 'تصدير تحليل الأداء' },
      { type: 'print', label: 'طباعة التقرير' }
    ]
  },

  'course_enrollment_statistics': {
    id: 'course_enrollment_statistics',
    title: 'إحصائيات تسجيل المقررات',
    description: 'إحصائيات مفصلة عن تسجيل الطلاب في المقررات',
    type: 'table',
    columns: [
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'total_enrolled', label: 'إجمالي المسجلين' },
      { key: 'active_students', label: 'الطلاب النشطين' },
      { key: 'withdrawn_students', label: 'المنسحبين' },
      { key: 'average_attendance', label: 'متوسط الحضور' },
      { key: 'pass_rate', label: 'معدل النجاح' }
    ],
    data: (() => {
      return COURSES_DATABASE.map(course => {
        const enrollments = STUDENT_ENROLLMENTS.filter(e => e.course_id === course.id);
        const activeEnrollments = enrollments.filter(e => e.status === 'مسجل');
        const withdrawnEnrollments = enrollments.filter(e => e.status === 'منسحب');
        const courseGrades = STUDENT_GRADES.filter(g => g.course_id === course.id);
        const courseAttendance = ATTENDANCE_RECORDS.filter(a => a.course_id === course.id);

        const avgAttendance = courseAttendance.length > 0 ?
          ((courseAttendance.filter(a => a.status === 'حاضر').length / courseAttendance.length) * 100).toFixed(1) + '%' : 'N/A';

        const passRate = courseGrades.length > 0 ?
          ((courseGrades.filter(g => g.grade_points >= 2.0).length / courseGrades.length) * 100).toFixed(1) + '%' : 'N/A';

        return {
          course_id: course.id,
          course_name: course.name,
          total_enrolled: enrollments.length,
          active_students: activeEnrollments.length,
          withdrawn_students: withdrawnEnrollments.length,
          average_attendance: avgAttendance,
          pass_rate: passRate
        };
      });
    })(),
    actions: [
      { type: 'export', label: 'تصدير إحصائيات المقررات' },
      { type: 'print', label: 'طباعة التقرير' }
    ]
  },

  'database_relations_overview': {
    id: 'database_relations_overview',
    title: 'نظرة عامة على علاقات قاعدة البيانات',
    description: 'عرض شامل للعلاقات والروابط بين جميع جداول قاعدة البيانات',
    type: 'table',
    columns: [
      { key: 'table_name', label: 'اسم الجدول' },
      { key: 'record_count', label: 'عدد السجلات' },
      { key: 'related_tables', label: 'الجداول المرتبطة' },
      { key: 'primary_key', label: 'المفتاح الأساسي' },
      { key: 'foreign_keys', label: 'المفاتيح الخارجية' }
    ],
    data: [
      {
        table_name: 'الطلاب (Students)',
        record_count: ALL_STUDENTS.length,
        related_tables: 'التسجيلات، الدرجات، الحضور، المالية',
        primary_key: 'student_id',
        foreign_keys: 'faculty_code'
      },
      {
        table_name: 'المقررات (Courses)',
        record_count: COURSES_DATABASE.length,
        related_tables: 'التسجيلات، الدرجات، الجداول، الحضور',
        primary_key: 'course_id',
        foreign_keys: 'department'
      },
      {
        table_name: 'تسجيلات المقررات (Enrollments)',
        record_count: STUDENT_ENROLLMENTS.length,
        related_tables: 'الطلاب، المقررات، الدرجات، الحضور',
        primary_key: 'student_id + course_id',
        foreign_keys: 'student_id, course_id'
      },
      {
        table_name: 'الدرجات (Grades)',
        record_count: STUDENT_GRADES.length,
        related_tables: 'الطلاب، المقررات، التسجيلات',
        primary_key: 'student_id + course_id + semester',
        foreign_keys: 'student_id, course_id'
      },
      {
        table_name: 'الحضور (Attendance)',
        record_count: ATTENDANCE_RECORDS.length,
        related_tables: 'الطلاب، المقررات، التسجيلات',
        primary_key: 'student_id + course_id + date',
        foreign_keys: 'student_id, course_id'
      },
      {
        table_name: 'السجلات المالية (Financial)',
        record_count: FINANCIAL_RECORDS.length,
        related_tables: 'الطلاب',
        primary_key: 'student_id + type + description',
        foreign_keys: 'student_id'
      },
      {
        table_name: 'جداول المقررات (Schedules)',
        record_count: COURSE_SCHEDULES.length,
        related_tables: 'المقررات، التسجيلات',
        primary_key: 'course_id + session_type + day + time',
        foreign_keys: 'course_id'
      }
    ],
    actions: [
      { type: 'export', label: 'تصدير مخطط قاعدة البيانات' },
      { type: 'print', label: 'طباعة التقرير' }
    ]
  },

  'student_complete_profile': {
    id: 'student_complete_profile',
    title: 'الملف الشامل للطالب',
    description: 'عرض جميع بيانات الطالب من كافة الجداول المرتبطة',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'enrolled_courses_count', label: 'المقررات المسجلة' },
      { key: 'completed_courses_count', label: 'المقررات المكتملة' },
      { key: 'attendance_sessions', label: 'جلسات الحضور' },
      { key: 'financial_transactions', label: 'المعاملات المالية' },
      { key: 'avg_grade', label: 'متوسط الدرجات' },
      { key: 'attendance_rate', label: 'معدل الحضور' },
      { key: 'total_fees', label: 'إجمالي الرسوم', type: 'currency' },
      { key: 'paid_amount', label: 'المبلغ المدفوع', type: 'currency' }
    ],
    data: (() => {
      return ALL_STUDENTS.slice(0, 50).map(student => {
        const enrollments = STUDENT_ENROLLMENTS.filter(e => e.student_id === student.student_id);
        const grades = STUDENT_GRADES.filter(g => g.student_id === student.student_id);
        const attendance = ATTENDANCE_RECORDS.filter(a => a.student_id === student.student_id);
        const financials = FINANCIAL_RECORDS.filter(f => f.student_id === student.student_id);

        const avgGrade = grades.length > 0 ?
          (grades.reduce((sum, g) => sum + g.grade_points, 0) / grades.length).toFixed(2) : '0.00';

        const attendanceRate = attendance.length > 0 ?
          ((attendance.filter(a => a.status === 'حاضر').length / attendance.length) * 100).toFixed(1) : '0.0';

        const totalFees = financials.reduce((sum, f) => sum + f.amount, 0);
        const paidAmount = financials.reduce((sum, f) => sum + f.paid_amount, 0);

        return {
          student_id: student.student_id,
          name: student.name,
          enrolled_courses_count: enrollments.length,
          completed_courses_count: grades.length,
          attendance_sessions: attendance.length,
          financial_transactions: financials.length,
          avg_grade: avgGrade,
          attendance_rate: attendanceRate + '%',
          total_fees: totalFees,
          paid_amount: paidAmount
        };
      });
    })(),
    actions: [
      { type: 'view', label: 'عرض التفاصيل' },
      { type: 'export', label: 'تصدير الملفات الشاملة' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // ==================================================================================
  // SHARED FEATURE: REGISTRATION ISSUES (مشاكل التسجيل)
  // ==================================================================================

  // 1. Student View: Submit Request
  'reg_form_issue': {
    id: 'reg_form_issue',
    title: 'استمارة التسجيل (حالات التعثر)',
    description: 'رفع استمارة التسجيل اليدوية في حالة وجود مشاكل تقنية أو تعثر أكاديمي',
    type: 'request_form',
    columns: [
      { key: 'req_id', label: 'رقم الطلب' },
      { key: 'date', label: 'تاريخ الرفع', type: 'date' },
      { key: 'comment', label: 'تعليق الطالب', type: 'long_text' },
      { key: 'admin_response', label: 'رد الإدارة', type: 'long_text' },
      { key: 'status', label: 'حالة الطلب', type: 'status' }
    ],
    data: [
      { req_id: 'REQ-2024-001', date: '2024-09-30', comment: 'لا يمكنني تسجيل مقرر CS305 بسبب المتطلب السابق رغم نجاحي فيه.', admin_response: 'جاري مراجعة النتيجة السابقة.', status: 'قيد المراجعة' }
    ],
    actions: [{ type: 'upload', label: 'رفع استمارة جديدة' }]
  },

  // 2. Admin View: Manage Requests
  'manage_reg_issues': {
    id: 'manage_reg_issues',
    title: 'مشاكل التسجيل (التعثر)',
    description: 'إدارة استمارات التسجيل اليدوية والطلبات المتعثرة للطلاب',
    type: 'table',
    columns: [
      { key: 'req_id', label: 'رقم الطلب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'student_id', label: 'الكود' },
      { key: 'file', label: 'الاستمارة', type: 'file' },
      { key: 'comment', label: 'المشكلة' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: (() => {
      const problems = [
        'مشكلة في المتطلبات السابقة لمقرر CS305',
        'تجاوزت الحد الأقصى للساعات المسموحة',
        'تعارض في مواعيد المقررات',
        'مشكلة في تسجيل مقرر اختياري',
        'طلب إضافة مقرر بعد انتهاء فترة التسجيل',
        'مشكلة في النتيجة السابقة',
        'طلب تعديل المجموعة',
        'مشكلة في تسجيل مشروع التخرج'
      ];
      const statuses = ['قيد المراجعة', 'مقبول', 'مرفوض'];
      const fileTypes = ['reg_form_2024.pdf', 'scan_001.jpg', 'form_scan.pdf', 'request_form.pdf'];

      // Generate 20-30 requests from real students
      const requests: any[] = [];
      const selectedStudents = FCAI_STUDENTS.filter(() => Math.random() > 0.95).slice(0, 25);

      selectedStudents.forEach((student, idx) => {
        const statusRand = Math.random();
        let status = 'قيد المراجعة';
        if (statusRand > 0.7) status = 'مقبول';
        else if (statusRand > 0.85) status = 'مرفوض';

        requests.push({
          req_id: `REQ-2024-${String(idx + 1).padStart(3, '0')}`,
          student_name: student.name,
          student_id: student.student_id,
          file: fileTypes[Math.floor(Math.random() * fileTypes.length)],
          comment: problems[Math.floor(Math.random() * problems.length)],
          status: status
        });
      });

      return requests;
    })(),
    actions: [{ type: 'approve', label: 'قبول وتفعيل' }, { type: 'reject', label: 'رفض الطلب' }, { type: 'view', label: 'عرض الاستمارة' }]
  },

  // ==================================================================================
  // ACADEMIC REGISTRATION PAGES
  // ==================================================================================
  'academic_reg': {
    id: 'academic_reg',
    title: 'التسجيل الأكاديمي للطلاب',
    description: 'إدارة وتسجيل الطلاب في المقررات الدراسية',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'courses_count', label: 'عدد المقررات' },
      { key: 'total_hours', label: 'إجمالي الساعات' },
      { key: 'status', label: 'حالة التسجيل', type: 'status' }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 50).map(student => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        courses_count: Math.floor(Math.random() * 5) + 4,
        total_hours: Math.floor(Math.random() * 6) + 12,
        status: Math.random() > 0.2 ? 'مسجل' : 'غير مسجل'
      }));
    })(),
    actions: [
      { type: 'add', label: 'تسجيل طالب' },
      { type: 'edit', label: 'تعديل التسجيل' },
      { type: 'view', label: 'عرض التفاصيل' }
    ]
  },

  'add_academic_reg': {
    id: 'add_academic_reg',
    title: 'التسجيل الأكاديمي للطلاب - إضافة جديد',
    description: 'تسجيل طالب جديد في المقررات الدراسية مع التحقق الذكي من القواعد الأكاديمية',
    type: 'smart_form',
    columns: [
      {
        key: 'student_id',
        label: 'كود الطالب',
        type: 'autocomplete',
        required: true,
        validation: {
          pattern: '^20[0-9]{6}$',
          message: 'كود الطالب يجب أن يكون 8 أرقام يبدأ بـ 20'
        }
      },
      {
        key: 'student_name',
        label: 'اسم الطالب',
        type: 'readonly',
        auto_fill: true
      },
      {
        key: 'level',
        label: 'المستوى',
        type: 'select',
        required: true,
        auto_fill: true
      },
      {
        key: 'department',
        label: 'القسم',
        type: 'readonly',
        auto_fill: true
      },
      {
        key: 'regulation',
        label: 'اللائحة',
        type: 'readonly',
        auto_fill: true
      },
      {
        key: 'available_courses',
        label: 'المقررات المتاحة',
        type: 'multi_select',
        required: true,
        dynamic: true
      },
      {
        key: 'selected_courses',
        label: 'المقررات المختارة',
        type: 'course_list',
        readonly: true
      },
      {
        key: 'total_hours',
        label: 'إجمالي الساعات',
        type: 'calculated',
        readonly: true
      },
      {
        key: 'registration_status',
        label: 'حالة التسجيل',
        type: 'select',
        required: true,
        options: ['مسجل', 'مؤجل', 'معلق']
      }
    ],
    data: (() => {
      // Smart form data with validation rules
      return [{
        // Student lookup data
        students_lookup: ALL_STUDENTS.map(student => ({
          id: student.student_id,
          name: student.name,
          level: student.level,
          department: student.department,
          regulation: student.regulation,
          faculty: student.faculty,
          status: student.status,
          gpa: student.gpa
        })),

        // Academic rules and constraints
        academic_rules: {
          min_courses_per_level: {
            'المستوى الأول': 6,
            'المستوى الثاني': 6,
            'المستوى الثالث': 5,
            'المستوى الرابع': 4
          },
          max_courses_per_level: {
            'المستوى الأول': 8,
            'المستوى الثاني': 8,
            'المستوى الثالث': 7,
            'المستوى الرابع': 6
          },
          min_hours_per_semester: 12,
          max_hours_per_semester: 21,
          gpa_requirements: {
            'المستوى الثاني': 2.0,
            'المستوى الثالث': 2.2,
            'المستوى الرابع': 2.5
          }
        },

        // Course prerequisites and dependencies
        course_prerequisites: {
          'CS201': ['CS101'],
          'CS202': ['CS101', 'CS102'],
          'CS301': ['CS201', 'CS202'],
          'CS302': ['CS201'],
          'IS201': ['IS101'],
          'IS301': ['IS201'],
          'AI301': ['CS201', 'MATH201']
        },

        // Department-specific course mappings
        department_courses: {
          'علوم الحاسب (CS)': COURSES_DATABASE.filter(c => c.department === 'CS' || c.department === 'عام'),
          'نظم المعلومات (IS)': COURSES_DATABASE.filter(c => c.department === 'IS' || c.department === 'عام'),
          'الذكاء الاصطناعي (AI)': COURSES_DATABASE.filter(c => c.department === 'AI' || c.department === 'عام'),
          'تكنولوجيا المعلومات (IT)': COURSES_DATABASE.filter(c => c.department === 'IT' || c.department === 'عام'),
          'المعلوماتية الطبية (MI)': COURSES_DATABASE.filter(c => c.department === 'MI' || c.department === 'عام'),
          'الأمن السيبراني (SEC)': COURSES_DATABASE.filter(c => c.department === 'SEC' || c.department === 'عام'),
          'عام': COURSES_DATABASE.filter(c => c.department === 'عام')
        },

        // Validation messages
        validation_messages: {
          student_not_found: 'كود الطالب غير موجود في النظام',
          student_already_registered: 'الطالب مسجل بالفعل في هذا الفصل',
          insufficient_gpa: 'المعدل التراكمي للطالب أقل من المطلوب للمستوى',
          prerequisite_missing: 'الطالب لم يجتز المتطلبات السابقة لهذا المقرر',
          max_hours_exceeded: 'إجمالي الساعات يتجاوز الحد الأقصى المسموح',
          min_hours_not_met: 'إجمالي الساعات أقل من الحد الأدنى المطلوب',
          course_conflict: 'يوجد تعارض في مواعيد المقررات المختارة',
          level_mismatch: 'المقرر غير متاح لهذا المستوى',
          department_restriction: 'المقرر مخصص لقسم آخر'
        },

        // Form instructions
        instructions: {
          title: 'تعليمات التسجيل الأكاديمي',
          steps: [
            'أدخل كود الطالب للبحث عن بياناته',
            'تأكد من صحة بيانات الطالب المعروضة',
            'اختر المقررات المناسبة للمستوى والقسم',
            'راجع إجمالي الساعات والتأكد من عدم تجاوز الحدود',
            'تأكد من استيفاء المتطلبات السابقة للمقررات',
            'احفظ التسجيل بعد التأكد من صحة البيانات'
          ],
          warnings: [
            'لا يمكن تسجيل طالب في مقرر لم يجتز متطلباته السابقة',
            'الحد الأدنى للساعات 12 ساعة والحد الأقصى 21 ساعة',
            'يجب التأكد من عدم وجود تعارض في مواعيد المحاضرات',
            'الطلاب ذوو المعدل المنخفض قد يحتاجون موافقة خاصة'
          ]
        }
      }];
    })(),
    actions: [
      { type: 'save', label: 'حفظ التسجيل', primary: true },
      { type: 'validate', label: 'التحقق من القواعد' },
      { type: 'preview', label: 'معاينة التسجيل' },
      { type: 'cancel', label: 'إلغاء' }
    ]
  },
  'block_student_reg': {
    id: 'block_student_reg',
    title: 'حجب تسجيل طالب',
    description: 'حجب أو إلغاء حجب تسجيل طالب في المقررات الدراسية',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'reason', label: 'سبب الحجب' },
      { key: 'block_date', label: 'تاريخ الحجب', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { student_id: '20210001', name: 'أحمد محمد علي', reason: 'عدم سداد الرسوم', block_date: '2024-09-15', status: 'محجوب' },
      { student_id: '20210025', name: 'سارة محمود حسن', reason: 'مشكلة أكاديمية', block_date: '2024-09-20', status: 'محجوب' },
      { student_id: '20210050', name: 'خالد يوسف سعيد', reason: 'عدم استكمال المستندات', block_date: '2024-09-18', status: 'محجوب' },
    ],
    actions: [
      { type: 'add', label: 'حجب تسجيل' },
      { type: 'edit', label: 'إلغاء الحجب' }
    ]
  },
  'balance_reg': {
    id: 'balance_reg',
    title: 'تسجيل موازنة',
    description: 'إدارة تسجيل الطلاب في المقررات المناظرة (الموازنة)',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'original_course', label: 'المقرر الأصلي' },
      { key: 'equivalent_course', label: 'المقرر المناظر' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { student_id: '20210010', name: 'محمد أحمد حسن', original_course: 'CS101', equivalent_course: 'IS101', status: 'معتمد' },
      { student_id: '20210030', name: 'منى سعيد محمود', original_course: 'CS201', equivalent_course: 'IS201', status: 'قيد المراجعة' },
      { student_id: '20210045', name: 'يوسف خالد علي', original_course: 'CS301', equivalent_course: 'IS301', status: 'معتمد' },
    ],
    actions: [
      { type: 'add', label: 'إضافة موازنة' },
      { type: 'approve', label: 'اعتماد' },
      { type: 'reject', label: 'رفض' }
    ]
  },
  'modify_student_courses': {
    id: 'modify_student_courses',
    title: 'تعديل مقررات الطلاب',
    description: 'تعديل أو تغيير المقررات المسجلة للطلاب',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'comment', label: 'التفاصيل/التعليق' },
      { key: 'admin_response', label: 'رد الإدارة' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { student_id: '20210015', name: 'نورا أحمد محمود', old_course: 'CS302', new_course: 'CS303', reason: 'تعارض في المواعيد', status: 'مقبول' },
      { student_id: '20210035', name: 'طارق سعيد يوسف', old_course: 'IS301', new_course: 'IS302', reason: 'طلب الطالب', status: 'قيد المراجعة' },
    ],
    actions: [
      { type: 'add', label: 'طلب تعديل' },
      { type: 'approve', label: 'قبول' },
      { type: 'reject', label: 'رفض' }
    ]
  },
  'block_reg_by_renewal': {
    id: 'block_reg_by_renewal',
    title: 'حجب تسجيل طلاب تبعا لموقف التجديد',
    description: 'حجب تسجيل الطلاب بناءً على حالة تجديد القيد',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'renewal_status', label: 'حالة التجديد' },
      { key: 'block_reason', label: 'سبب الحجب' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { student_id: '20200050', name: 'علي محمود حسن', renewal_status: 'غير مجدد', block_reason: 'عدم تجديد القيد', status: 'محجوب' },
      { student_id: '20200075', name: 'فاطمة أحمد سعيد', renewal_status: 'منتهي', block_reason: 'انتهاء فترة التجديد', status: 'محجوب' },
    ],
    actions: [
      { type: 'view', label: 'عرض التفاصيل' },
      { type: 'export', label: 'تصدير' }
    ]
  },
  'registered_students_report': {
    id: 'registered_students_report',
    title: 'تقرير الطلبة المسجلين',
    description: 'تقرير شامل بجميع الطلاب المسجلين في المقررات',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'courses', label: 'المقررات المسجلة' },
      { key: 'total_hours', label: 'إجمالي الساعات' }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 30).map(student => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        courses: `${Math.floor(Math.random() * 3) + 4} مقررات`,
        total_hours: `${Math.floor(Math.random() * 6) + 12} ساعة`
      }));
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'course_student_count': {
    id: 'course_student_count',
    title: 'تقرير اعداد الطلاب في مقرر',
    description: 'عرض عدد الطلاب المسجلين في كل مقرر دراسي',
    type: 'table',
    columns: [
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'student_count', label: 'عدد الطلاب' },
      { key: 'level', label: 'المستوى' }
    ],
    data: [
      { course_code: 'CS101', course_name: 'مقدمة في البرمجة', registered_count: 85, capacity: 100, available: 15 },
      { course_code: 'CS201', course_name: 'هياكل البيانات', registered_count: 72, capacity: 80, available: 8 },
      { course_code: 'CS301', course_name: 'قواعد البيانات', registered_count: 65, capacity: 70, available: 5 },
      { course_code: 'IS301', course_name: 'تحليل وتصميم نظم', registered_count: 58, capacity: 60, available: 2 },
    ],
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'registered_students_stats': {
    id: 'registered_students_stats',
    title: 'إحصائية الطلاب المسجلين',
    description: 'إحصائيات شاملة عن الطلاب المسجلين',
    type: 'dashboard',
    columns: [
      { key: 'level', label: 'المستوى' },
      { key: 'student_count', label: 'عدد الطلاب' },
      { key: 'percentage', label: 'النسبة' }
    ],
    data: [],
    actions: []
  },
  'registered_by_levels': {
    id: 'registered_by_levels',
    title: 'احصائية المسجلين بالمستويات',
    description: 'توزيع الطلاب المسجلين حسب المستويات الدراسية',
    type: 'table',
    columns: [
      { key: 'level', label: 'المستوى' },
      { key: 'total_students', label: 'إجمالي الطلاب' },
      { key: 'registered', label: 'مسجلين' },
      { key: 'not_registered', label: 'غير مسجلين' },
      { key: 'percentage', label: 'نسبة التسجيل' }
    ],
    data: [
      { level: 'المستوى الأول', total_students: 750, registered: 720, not_registered: 30, percentage: '96%' },
      { level: 'المستوى الثاني', total_students: 700, registered: 680, not_registered: 20, percentage: '97%' },
      { level: 'المستوى الثالث', total_students: 650, registered: 620, not_registered: 30, percentage: '95%' },
      { level: 'المستوى الرابع', total_students: 400, registered: 380, not_registered: 20, percentage: '95%' },
    ],
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'registered_students_chart': {
    id: 'registered_students_chart',
    title: 'إحصائية الطلاب المسجلين (رسم بياني)',
    description: 'عرض بياني لإحصائيات الطلاب المسجلين',
    type: 'dashboard',
    columns: [
      { key: 'level', label: 'المستوى' },
      { key: 'student_count', label: 'عدد الطلاب' },
      { key: 'percentage', label: 'النسبة' }
    ],
    data: [],
    actions: []
  },
  'students_in_course': {
    id: 'students_in_course',
    title: 'تقرير طلاب مسجلين بمقرر',
    description: 'قائمة الطلاب المسجلين في مقرر دراسي محدد',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'group', label: 'المجموعة' },
      { key: 'registration_date', label: 'تاريخ التسجيل', type: 'date' }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 25).map(student => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        group: `المجموعة ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`,
        registration_date: '2024-09-15'
      }));
    })(),
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'unregistered_students': {
    id: 'unregistered_students',
    title: 'الطلاب غير المسجلين',
    description: 'قائمة الطلاب الذين لم يسجلوا في أي مقرر',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'reason', label: 'السبب' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { student_id: '20210005', name: 'أحمد محمود علي', level: 'المستوى الأول', reason: 'عدم سداد الرسوم', status: 'غير مسجل' },
      { student_id: '20210020', name: 'سارة يوسف حسن', level: 'المستوى الثاني', reason: 'مشكلة أكاديمية', status: 'غير مسجل' },
      { student_id: '20210040', name: 'خالد سعيد محمود', level: 'المستوى الثالث', reason: 'عدم استكمال المستندات', status: 'غير مسجل' },
    ],
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'students_by_gpa': {
    id: 'students_by_gpa',
    title: 'احصائية طلاب بالمعدل التراكمي',
    description: 'توزيع الطلاب حسب المعدل التراكمي',
    type: 'table',
    columns: [
      { key: 'gpa_range', label: 'نطاق المعدل' },
      { key: 'student_count', label: 'عدد الطلاب' },
      { key: 'percentage', label: 'النسبة' }
    ],
    data: [
      { gpa_range: '3.5 - 4.0', student_count: 150, percentage: '15%' },
      { gpa_range: '3.0 - 3.5', student_count: 300, percentage: '30%' },
      { gpa_range: '2.5 - 3.0', student_count: 350, percentage: '35%' },
      { gpa_range: '2.0 - 2.5', student_count: 150, percentage: '15%' },
      { gpa_range: 'أقل من 2.0', student_count: 50, percentage: '5%' },
    ],
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'registered_courses_for_students': {
    id: 'registered_courses_for_students',
    title: 'المقررات الدراسية المسجلة للطلاب',
    description: 'عرض جميع المقررات المسجلة لكل طالب',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'courses', label: 'المقررات' },
      { key: 'total_hours', label: 'إجمالي الساعات' }
    ],
    data: (() => {
      const courses = ['CS101', 'CS102', 'CS201', 'CS202', 'CS301', 'CS302'];
      return FCAI_STUDENTS.slice(0, 20).map(student => ({
        student_id: student.student_id,
        name: student.name,
        courses: courses.slice(0, Math.floor(Math.random() * 3) + 4).join(', '),
        total_hours: Math.floor(Math.random() * 6) + 12
      }));
    })(),
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'student_reg_form': {
    id: 'student_reg_form',
    title: 'استمارة تسجيل طالب',
    description: 'استمارة التسجيل الأكاديمي للطالب',
    type: 'form',
    columns: [
      { key: 'student_id', label: 'رقم الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'enrolled_courses', label: 'المقررات المسجلة' },
      { key: 'status', label: 'الحالة' },
      { key: 'approval_status', label: 'حالة الموافقة', type: 'status' },
      { key: 'registration_date', label: 'تاريخ التسجيل', type: 'date' }
    ],
    data: [],
    actions: [
      { type: 'print', label: 'طباعة الاستمارة' },
      { type: 'export', label: 'تصدير PDF' }
    ]
  },
  'multiple_courses_reg': {
    id: 'multiple_courses_reg',
    title: 'مسجلين في أكثر من مقرر',
    description: 'الطلاب المسجلين في أكثر من مقرر دراسي',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'courses_count', label: 'عدد المقررات' },
      { key: 'total_hours', label: 'إجمالي الساعات' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { student_id: '20210012', name: 'محمد أحمد حسن', courses_count: 6, total_hours: 18, status: 'نشط' },
      { student_id: '20210028', name: 'منى سعيد محمود', courses_count: 7, total_hours: 21, status: 'نشط' },
      { student_id: '20210035', name: 'يوسف خالد علي', courses_count: 5, total_hours: 15, status: 'نشط' },
    ],
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },
  'review_student_reg': {
    id: 'review_student_reg',
    title: 'مراجعة تسجيل الطلاب',
    description: 'مراجعة والتحقق من تسجيل الطلاب في المقررات',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'courses', label: 'المقررات' },
      { key: 'review_status', label: 'حالة المراجعة', type: 'status' }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 15).map(student => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        courses: `${Math.floor(Math.random() * 3) + 4} مقررات`,
        review_status: Math.random() > 0.3 ? 'تمت المراجعة' : 'قيد المراجعة'
      }));
    })(),
    actions: [
      { type: 'view', label: 'مراجعة' },
      { type: 'approve', label: 'اعتماد' }
    ]
  },
  'registered_courses_count': {
    id: 'registered_courses_count',
    title: 'عدد المقررات المسجلة',
    description: 'إحصائيات عن عدد المقررات المسجلة للطلاب',
    type: 'table',
    columns: [
      { key: 'courses_count', label: 'عدد المقررات' },
      { key: 'student_count', label: 'عدد الطلاب' },
      { key: 'percentage', label: 'النسبة' }
    ],
    data: [
      { courses_count: '4 مقررات', student_count: 400, percentage: '40%' },
      { courses_count: '5 مقررات', student_count: 350, percentage: '35%' },
      { courses_count: '6 مقررات', student_count: 200, percentage: '20%' },
      { courses_count: '7 مقررات', student_count: 50, percentage: '5%' },
    ],
    actions: [
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // ==================================================================================
  // STUDENT PORTAL PAGES
  // ==================================================================================
  'id_card_view': {
    id: 'id_card_view',
    title: 'البطاقة الجامعية',
    description: 'بيانات البطاقة الجامعية وحالتها',
    type: 'table',
    columns: [
      { key: 'card_year', label: 'العام الجامعي' },
      { key: 'status', label: 'حالة البطاقة', type: 'status' },
      { key: 'delivery', label: 'مكان الاستلام' }
    ],
    data: [
      { card_year: '2024-2025', status: 'جاهز للاستلام', delivery: 'شؤون الطلاب - شباك 4' }
    ]
  },
  'military_edu': {
    id: 'military_edu',
    title: 'التربية العسكرية',
    description: 'موقف الطلاب من دورة التربية العسكرية',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'رقم الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'military_status', label: 'حالة التدريب' },
      { key: 'completion_date', label: 'تاريخ الإنهاء', type: 'date' },
      { key: 'notes', label: 'ملاحظات' }
    ],
    data: []
  },
  'student_fees': {
    id: 'student_fees',
    title: 'الرسوم الدراسية',
    description: 'بيان بالرسوم المستحقة والمسددة',
    type: 'table',
    columns: [
      { key: 'item', label: 'البند' },
      { key: 'amount', label: 'القيمة', type: 'currency' },
      { key: 'paid', label: 'المدفوع', type: 'currency' },
      { key: 'remaining', label: 'المتبقي', type: 'currency' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { item: 'مصروفات دراسية - خريف 2024', amount: '6000', paid: '6000', remaining: '0', status: 'مسدد' },
      { item: 'كتب دراسية', amount: '500', paid: '0', remaining: '500', status: 'غير مسدد' }
    ],
    actions: [{ type: 'print', label: 'طباعة إذن دفع' }]
  },
  'student_grades': {
    id: 'student_grades',
    title: 'النتائج الدراسية',
    description: 'سجل الدرجات والتقديرات للفصول السابقة',
    type: 'table',
    columns: [
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'total', label: 'المجموع' },
      { key: 'grade_letter', label: 'التقدير' },
      { key: 'grade_points', label: 'النقاط' }
    ],
    data: STUDENT_GRADES.slice(0, 50), // Show sample grades for student view
    actions: [
      { type: 'print', label: 'بيان درجات' },
      { type: 'export', label: 'تصدير PDF' }
    ]
  },
  'academic_reg_student': {
    id: 'academic_reg_student',
    title: 'التسجيل الأكاديمي',
    description: 'المقررات المسجلة حالياً',
    type: 'table',
    columns: [
      { key: 'code', label: 'الكود' },
      { key: 'name', label: 'اسم المقرر' },
      { key: 'group', label: 'المجموعة' },
      { key: 'instructor', label: 'المحاضر' }
    ],
    data: [
      { code: 'CS301', name: 'نظم تشغيل', group: 'A', instructor: 'د. خالد' },
      { code: 'CS302', name: 'شبكات حاسب', group: 'A', instructor: 'د. منال' }
    ]
  },
  'uni_email': {
    id: 'uni_email',
    title: 'البريد الجامعي',
    description: 'بيانات حساب مايكروسوفت الجامعي',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'رقم الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'status', label: 'حالة الحساب', type: 'status' },
      { key: 'created_date', label: 'تاريخ الإنشاء', type: 'date' }
    ],
    data: [
      { email: 'ahmed.20210055@stud.uni.edu.eg', status: 'نشط' }
    ],
    actions: [{ type: 'edit', label: 'إعادة تعيين كلمة المرور' }]
  },
  'academic_warnings': {
    id: 'academic_warnings',
    title: 'الإنذارات الأكاديمية',
    description: 'قائمة الطلاب الذين يستحقون إنذارات أكاديمية بسبب انخفاض المعدل',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'رقم الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'gpa', label: 'المعدل التراكمي' },
      { key: 'avg_grade', label: 'متوسط الدرجات' },
      { key: 'warning_level', label: 'درجة الإنذار', type: 'status' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: []
  },

  // ==================================================================================
  // ADMIN PAGES
  // ==================================================================================

  'survey_rules': {
    id: 'survey_rules',
    title: 'قواعد الاستبيان',
    description: 'إعداد القواعد المنظمة لاستبيانات الطلاب وتقييم المقررات',
    type: 'table',
    columns: [
      { key: 'id', label: 'كود القاعدة' },
      { key: 'name', label: 'اسم القاعدة' },
      { key: 'target', label: 'الفئة المستهدفة' },
      { key: 'start_date', label: 'تاريخ البداية', type: 'date' },
      { key: 'end_date', label: 'تاريخ النهاية', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { id: 'SR-001', name: 'استبيان تقييم المقررات - خريف 2024', target: 'جميع الطلاب', start_date: '2024-01-01', end_date: '2024-01-15', status: 'منتهي' },
      { id: 'SR-002', name: 'استبيان الرضا الطلابي', target: 'المستوى الرابع', start_date: '2024-05-01', end_date: '2024-05-30', status: 'نشط' }
    ],
    actions: [{ type: 'add', label: 'إضافة قاعدة' }, { type: 'edit', label: 'تعديل' }]
  },
  // Contact List - Student contact information
  'contact_list': {
    id: 'contact_list',
    title: 'بيانات الاتصال',
    description: 'قائمة ببيانات الاتصال للطلاب',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'phone', label: 'الهاتف' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'faculty', label: 'الكلية' },
      { key: 'department', label: 'القسم' },
      { key: 'level', label: 'المستوى' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: (() => {
      // Return FCAI students with contact info
      return FCAI_STUDENTS.map(student => ({
        student_id: student.student_id,
        name: student.name,
        phone: student.phone,
        email: student.email,
        city: student.city,
        level: student.level
      }));
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // ID Cards - Student ID card information
  'id_cards': {
    id: 'id_cards',
    title: 'بطاقات الهوية',
    description: 'قائمة الطلاب وبيانات بطاقاتهم الشخصية',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'national_id', label: 'الرقم الوطني' },
      { key: 'faculty_id', label: 'الكلية' },
      { key: 'department_id', label: 'القسم' },
      { key: 'level', label: 'المستوى' },
      { key: 'status', label: 'الحالة', type: 'status' },
      { key: 'regulation', label: 'اللائحة' }
    ],
    data: (() => {
      return FCAI_STUDENTS.map(student => {
        const statusRand = Math.random();
        let status = 'جاهز للاستلام';
        let delivery = 'شؤون الطلاب - شباك 4';

        if (statusRand > 0.8) {
          status = 'قيد الطباعة';
          delivery = '-';
        } else if (statusRand > 0.95) {
          status = 'تم الاستلام';
          delivery = 'تم الاستلام';
        }

        return {
          student_id: student.student_id,
          name: student.name,
          card_year: '2024-2025',
          status: status,
          delivery: delivery
        };
      });
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  'student_attendance': {
    id: 'student_attendance',
    title: 'سجل حضور الطلاب',
    description: `متابعة ورصد حضور الطلاب في المحاضرات والسكاشن (${ATTENDANCE_RECORDS.length} سجل)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'رقم الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'session_type', label: 'نوع المحاضرة' },
      { key: 'week', label: 'الأسبوع' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'status', label: 'حالة الحضور', type: 'status' },
      { key: 'actions', label: 'إجراءات' }
    ],
    data: (() => {
      // Enhance attendance records with student names and course names
      return ATTENDANCE_RECORDS.map((record, index) => {
        const student = ALL_STUDENTS.find(s => s.student_id === record.student_id);
        const course = COURSES_DATABASE.find(c => c.id === record.course_id);
        return {
          id: index + 1, // Add unique ID for each record
          ...record,
          student_name: student ? student.name : 'غير معروف',
          course_name: course ? course.name : record.course_name || 'غير معروف',
          // Format date for better display
          formatted_date: record.date,
          // Add actions for each record
          actions: 'تعديل | حذف'
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
    })(),
    actions: [
      { type: 'add', label: 'تسجيل حضور' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'add_attendance': {
    id: 'add_attendance',
    title: 'إدخال حضور الطلاب',
    description: 'تسجيل حضور وغياب الطلاب في المحاضرات والسكاشن',
    type: 'attendance_form',
    columns: [
      { key: 'course_selection', label: 'اختيار المقرر' },
      { key: 'session_type', label: 'نوع الجلسة' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'week', label: 'الأسبوع' },
      { key: 'students_list', label: 'قائمة الطلاب' }
    ],
    data: (() => {
      // Sample form data for attendance entry
      return [
        {
          course_selection: 'اختر المقرر...',
          available_courses: COURSES_DATABASE.filter(course => course.level <= 4).map(course => {
            const enrolledCount = STUDENT_ENROLLMENTS.filter(e => e.course_id === course.id && e.status === 'مسجل').length;
            return {
              id: course.id,
              name: `${course.name} (${course.id})`,
              enrolled_students: Math.max(enrolledCount, 15), // Ensure minimum students
              level: course.level,
              department: course.department,
              hours: course.hours,
              type: course.type
            };
          }),
          session_types: ['محاضرة', 'سكشن', 'معمل'],
          weeks: Array.from({ length: 15 }, (_, i) => `الأسبوع ${i + 1}`),
          current_date: new Date().toISOString().split('T')[0],
          instructions: {
            title: 'تعليمات تسجيل الحضور',
            steps: [
              'اختر المقرر من القائمة المنسدلة',
              'حدد نوع الجلسة (محاضرة/سكشن/معمل)',
              'اختر التاريخ والأسبوع المناسب',
              'ستظهر قائمة الطلاب المسجلين تلقائياً',
              'انقر على اسم الطالب لتغيير حالة الحضور',
              'استخدم الأزرار السريعة لتحديد الكل',
              'احفظ البيانات عند الانتهاء'
            ]
          }
        }
      ];
    })(),
    actions: [
      { type: 'add', label: 'حفظ الحضور' },
      { type: 'export', label: 'تصدير قائمة الحضور' }
    ]
  },


  // ==================================================================================
  // SCHEDULES MANAGEMENT
  // ==================================================================================

  'create_sched': {
    id: 'create_sched',
    title: 'إنشاء جدول دراسي جديد',
    description: 'إنشاء وإدارة الجداول الدراسية للفصول الدراسية المختلفة',
    type: 'table',
    columns: [
      { key: 'schedule_id', label: 'رقم الجدول' },
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'academic_year', label: 'العام الأكاديمي' },
      { key: 'faculty', label: 'الكلية' },
      { key: 'level', label: 'المستوى' },
      { key: 'courses_count', label: 'عدد المقررات' },
      { key: 'status', label: 'الحالة', type: 'status' },
      { key: 'created_date', label: 'تاريخ الإنشاء', type: 'date' },
      { key: 'actions', label: 'إجراءات' }
    ],
    data: [
      {
        id: 1,
        schedule_id: 'SCH-2024-FALL-001',
        semester: 'خريف 2024',
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الأول',
        courses_count: '8',
        status: 'نشط',
        created_date: '2024-09-01',
        actions: 'تعديل | حذف'
      },
      {
        id: 2,
        schedule_id: 'SCH-2024-FALL-002',
        semester: 'خريف 2024',
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الثاني',
        courses_count: '7',
        status: 'نشط',
        created_date: '2024-09-01',
        actions: 'تعديل | حذف'
      },
      {
        id: 3,
        schedule_id: 'SCH-2024-FALL-003',
        semester: 'خريف 2024',
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الثالث',
        courses_count: '6',
        status: 'نشط',
        created_date: '2024-09-02',
        actions: 'تعديل | حذف'
      },
      {
        id: 4,
        schedule_id: 'SCH-2024-FALL-004',
        semester: 'خريف 2024',
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الرابع',
        courses_count: '5',
        status: 'قيد الإنشاء',
        created_date: '2024-09-03',
        actions: 'تعديل | حذف'
      },
      {
        id: 5,
        schedule_id: 'SCH-2024-SPRING-001',
        semester: 'ربيع 2024',
        academic_year: '2023-2024',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الأول',
        courses_count: '8',
        status: 'منتهي',
        created_date: '2024-02-01',
        actions: 'تعديل | حذف'
      }
    ],
    actions: [
      { type: 'add', label: 'إنشاء جدول جديد' },
      { type: 'auto_generate', label: 'توليد تلقائي ذكي' },
      { type: 'edit', label: 'تعديل' },
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  'assign_room': {
    id: 'assign_room',
    title: 'تخصيص القاعات الدراسية',
    description: `توزيع المقررات على القاعات الدراسية المتاحة (${CLASSROOM_ASSIGNMENTS.length} تخصيص)`,
    type: 'table',
    columns: [
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'group', label: 'المجموعة' },
      { key: 'day', label: 'اليوم' },
      { key: 'time', label: 'الوقت' },
      { key: 'room', label: 'القاعة' },
      { key: 'room_type', label: 'نوع القاعة' },
      { key: 'capacity', label: 'السعة' },
      { key: 'enrolled', label: 'المسجلين' },
      { key: 'instructor', label: 'المدرس' },
      { key: 'status', label: 'الحالة', type: 'status' },
      { key: 'actions', label: 'إجراءات' }
    ],
    data: (() => {
      // Dynamic data that updates when new assignments are added
      return CLASSROOM_ASSIGNMENTS.map((assignment, index) => ({
        id: index + 1,
        ...assignment,
        actions: 'تعديل | حذف'
      }));
    })(),
    actions: [
      { type: 'add', label: 'تخصيص قاعة جديدة' },
      { type: 'edit', label: 'تعديل التخصيص' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'add_room_assignment': {
    id: 'add_room_assignment',
    title: 'تخصيص قاعة جديدة',
    description: 'إضافة تخصيص جديد لمقرر في قاعة دراسية مع التحقق من التعارضات',
    type: 'smart_form',
    columns: [
      {
        key: 'course_code',
        label: 'كود المقرر',
        type: 'select',
        required: true,
        options: ['CS101', 'CS102', 'CS201', 'CS202', 'CS301', 'CS302', 'CS401', 'MATH101', 'IS101', 'IS201', 'AI301', 'IT201']
      },
      {
        key: 'course_name',
        label: 'اسم المقرر',
        type: 'readonly',
        auto_fill: true
      },
      {
        key: 'group',
        label: 'المجموعة',
        type: 'select',
        required: true,
        options: ['A', 'B', 'C']
      },
      {
        key: 'day',
        label: 'اليوم',
        type: 'select',
        required: true,
        options: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
      },
      {
        key: 'time',
        label: 'الوقت',
        type: 'select',
        required: true,
        options: ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00']
      },
      {
        key: 'room',
        label: 'القاعة',
        type: 'select',
        required: true,
        dynamic: true
      },
      {
        key: 'capacity',
        label: 'سعة القاعة',
        type: 'readonly',
        auto_fill: true
      },
      {
        key: 'enrolled',
        label: 'عدد المسجلين المتوقع',
        type: 'number',
        required: true
      }
    ],
    data: (() => {
      const courseNames = {
        'CS101': 'مقدمة في علوم الحاسب',
        'CS102': 'برمجة 1',
        'CS201': 'هياكل البيانات',
        'CS202': 'قواعد البيانات',
        'CS301': 'نظم التشغيل',
        'CS302': 'شبكات الحاسب',
        'CS401': 'مشروع التخرج',
        'MATH101': 'رياضيات متقطعة',
        'IS101': 'مقدمة في نظم المعلومات',
        'IS201': 'تحليل وتصميم النظم',
        'AI301': 'الذكاء الاصطناعي',
        'IT201': 'شبكات الحاسب المتقدمة'
      };

      const rooms = [
        { name: 'قاعة 101', capacity: 60, type: 'محاضرات' },
        { name: 'قاعة 102', capacity: 60, type: 'محاضرات' },
        { name: 'قاعة 201', capacity: 80, type: 'محاضرات' },
        { name: 'قاعة 202', capacity: 80, type: 'محاضرات' },
        { name: 'قاعة 301', capacity: 100, type: 'محاضرات' },
        { name: 'معمل 1', capacity: 40, type: 'معامل' },
        { name: 'معمل 2', capacity: 40, type: 'معامل' },
        { name: 'معمل 3', capacity: 40, type: 'معامل' },
        { name: 'قاعة المحاضرات الكبرى', capacity: 200, type: 'محاضرات' }
      ];

      return [{
        course_names: courseNames,
        available_rooms: rooms,
        existing_assignments: CLASSROOM_ASSIGNMENTS,
        validation_rules: {
          no_double_booking: 'لا يمكن حجز نفس القاعة في نفس الوقت واليوم',
          capacity_check: 'عدد المسجلين يجب أن يكون أقل من سعة القاعة',
          room_type_match: 'نوع القاعة يجب أن يناسب نوع المقرر',
          time_conflict: 'لا يمكن تسجيل نفس المجموعة في أوقات متعارضة'
        },
        instructions: {
          title: 'تعليمات تخصيص القاعات',
          steps: [
            'اختر المقرر والمجموعة المطلوب تخصيص قاعة لها',
            'حدد اليوم والوقت المناسب',
            'اختر القاعة المناسبة من القائمة المتاحة',
            'أدخل عدد الطلاب المسجلين المتوقع',
            'تأكد من عدم وجود تعارض مع التخصيصات الموجودة',
            'احفظ التخصيص بعد التأكد من صحة البيانات'
          ]
        }
      }];
    })(),
    actions: [
      { type: 'save', label: 'حفظ التخصيص', primary: true },
      { type: 'validate', label: 'التحقق من التعارضات' },
      { type: 'cancel', label: 'إلغاء' }
    ]
  },

  'lecturers': {
    id: 'lecturers',
    title: 'توزيع المحاضرين',
    description: 'توزيع أعضاء هيئة التدريس على المقررات والمجموعات',
    type: 'table',
    columns: [
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'group', label: 'المجموعة' },
      { key: 'lecturer_name', label: 'اسم المحاضر' },
      { key: 'lecturer_title', label: 'اللقب العلمي' },
      { key: 'department', label: 'القسم' },
      { key: 'hours_per_week', label: 'الساعات الأسبوعية' },
      { key: 'status', label: 'الحالة', type: 'status' },
      { key: 'actions', label: 'إجراءات' }
    ],
    data: (() => {
      const lecturers = [
        { name: 'أ.د. أحمد محمد السيد', title: 'أستاذ', dept: 'علوم الحاسب' },
        { name: 'د. منال حسن إبراهيم', title: 'أستاذ مساعد', dept: 'علوم الحاسب' },
        { name: 'د. خالد محمود علي', title: 'أستاذ مساعد', dept: 'نظم المعلومات' },
        { name: 'د. سارة أحمد فؤاد', title: 'مدرس', dept: 'الذكاء الاصطناعي' },
        { name: 'د. محمد عبدالله نصر', title: 'مدرس', dept: 'تكنولوجيا المعلومات' },
        { name: 'أ.د. فاطمة علي حسن', title: 'أستاذ', dept: 'علوم الحاسب' },
        { name: 'د. يوسف سعيد كامل', title: 'أستاذ مساعد', dept: 'نظم المعلومات' },
        { name: 'د. نورا محمود جمال', title: 'مدرس', dept: 'الذكاء الاصطناعي' }
      ];

      const courses = [
        { code: 'CS101', name: 'مقدمة في علوم الحاسب', groups: ['A', 'B', 'C'], hours: 3 },
        { code: 'CS102', name: 'برمجة 1', groups: ['A', 'B'], hours: 4 },
        { code: 'CS201', name: 'هياكل البيانات', groups: ['A', 'B'], hours: 3 },
        { code: 'CS202', name: 'قواعد البيانات', groups: ['A', 'B'], hours: 3 },
        { code: 'CS301', name: 'نظم التشغيل', groups: ['A'], hours: 3 },
        { code: 'CS302', name: 'شبكات الحاسب', groups: ['A'], hours: 3 },
        { code: 'CS401', name: 'مشروع التخرج', groups: ['A', 'B'], hours: 2 },
        { code: 'MATH101', name: 'رياضيات متقطعة', groups: ['A', 'B'], hours: 3 }
      ];

      const assignments: any[] = [];
      let lecturerIndex = 0;

      courses.forEach(course => {
        course.groups.forEach(group => {
          const lecturer = lecturers[lecturerIndex % lecturers.length];
          assignments.push({
            id: assignments.length + 1,
            course_code: course.code,
            course_name: course.name,
            group: group,
            lecturer_name: lecturer.name,
            lecturer_title: lecturer.title,
            department: lecturer.dept,
            hours_per_week: course.hours.toString(),
            status: 'مكتمل',
            actions: 'تعديل | حذف'
          });
          lecturerIndex++;
        });
      });

      return assignments;
    })(),
    actions: [
      { type: 'add', label: 'توزيع محاضر جديد' },
      { type: 'edit', label: 'تعديل التوزيع' },
      { type: 'export', label: 'تصدير Excel' }
    ]
  },

  'add_lecturer_assignment': {
    id: 'add_lecturer_assignment',
    title: 'توزيع محاضر جديد',
    description: 'إضافة توزيع محاضر جديد على مقرر ومجموعة مع التحقق من التعارضات',
    type: 'form',
    columns: [
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'group', label: 'المجموعة' },
      { key: 'lecturer_name', label: 'اسم المحاضر' },
      { key: 'lecturer_title', label: 'اللقب العلمي' },
      { key: 'department', label: 'القسم' },
      { key: 'hours_per_week', label: 'الساعات الأسبوعية' },
      { key: 'status', label: 'الحالة' }
    ],
    data: [],
    actions: [
      { type: 'save', label: 'حفظ التوزيع' },
      { type: 'cancel', label: 'إلغاء' }
    ]
  },

  // ==================================================================================
  // ALL ACTIVITIES / CHANGES LOG
  // ==================================================================================
  'all_activities': {
    id: 'all_activities',
    title: 'سجل جميع التغييرات',
    description: 'عرض شامل لجميع التغييرات والنشاطات التي تمت في النظام',
    type: 'table',
    columns: [
      { key: 'timestamp', label: 'الوقت', type: 'date' },
      { key: 'user', label: 'المستخدم' },
      { key: 'action', label: 'الإجراء', type: 'status' },
      { key: 'entity_type', label: 'نوع الكيان' },
      { key: 'entity_id', label: 'معرّف الكيان' },
      { key: 'details', label: 'التفاصيل' }
    ],
    data: (() => {
      const now = new Date();
      const activities: any[] = [];
      const users = [
        'أ.د. عميد الكلية',
        'د. أحمد محمد',
        'د. منال حسن',
        'د. خالد محمود',
        'د. سارة أحمد',
        'د. يوسف سعيد',
        'د. نورا محمود',
        'أ.د. رئيس الجامعة'
      ];
      const faculties = [
        'كلية الحاسبات والذكاء الاصطناعي',
        'كلية العلوم',
        'كلية التجارة',
        'كلية التربية',
        'كلية الهندسة',
        'كلية الطب',
        'كلية الصيدلة',
        'كلية الحقوق'
      ];
      const actions = ['edit', 'add', 'update', 'delete'];
      const actionLabels = { edit: 'تعديل', add: 'إضافة', update: 'تحديث', delete: 'حذف' };
      const entities = [
        'جدول دراسي',
        'مقرر دراسي',
        'بيانات طالب',
        'توزيع المحاضرين',
        'قاعة دراسية',
        'درجات الطلاب',
        'رسوم طالب',
        'حضور طلاب',
        'تسجيل أكاديمي',
        'بطاقة هوية',
        'قاعدة استبيان',
        'تقرير أكاديمي'
      ];

      const details = [
        'تم تعديل موعد محاضرة مقرر CS301 من 10:00 إلى 12:00',
        'تم إضافة مقرر جديد "الذكاء الاصطناعي المتقدم" للمستوى الرابع',
        'تم تحديث المعدل التراكمي للطالب 20210055 من 3.2 إلى 3.4',
        'تم تغيير محاضر مقرر CS302 من د. خالد إلى د. سارة',
        'تم تخصيص قاعة 301 لمقرر CS401 - المجموعة A',
        'تم رصد درجات 25 طالب في مقرر هياكل البيانات',
        'تم تعديل حالة رسوم الطالب 20220033 من غير مسدد إلى مسدد',
        'تم تسجيل حضور 45 طالب في محاضرة مقرر برمجة شيئية',
        'تم قبول طلب تسجيل طالب في مقرر إضافي',
        'تم إصدار بطاقة هوية جديدة للطالب 20230012',
        'تم إنشاء قاعدة استبيان جديدة لتقييم المقررات',
        'تم إغلاق باب التسجيل للفصل الدراسي خريف 2024',
        'تم تعديل سعة القاعة 201 من 80 إلى 100 طالب',
        'تم حذف مقرر اختياري غير مطلوب',
        'تم تحديث بيانات الاتصال لطالب',
        'تم إضافة محاضر جديد للقسم',
        'تم تعديل مواعيد الامتحانات النهائية',
        'تم رفض طلب زيادة العبء الدراسي',
        'تم إضافة مجموعة جديدة لمقرر CS201',
        'تم تحديث اللائحة الداخلية للبرنامج'
      ];

      // Generate 50 activities from last 7 days
      for (let i = 0; i < 50; i++) {
        const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days (168 hours)
        const minutesAgo = Math.floor(Math.random() * 60);
        const timestamp = new Date(now.getTime() - (hoursAgo * 3600000 + minutesAgo * 60000));
        const action = actions[Math.floor(Math.random() * actions.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const faculty = faculties[Math.floor(Math.random() * faculties.length)];
        const entity = entities[Math.floor(Math.random() * entities.length)];
        const detail = details[Math.floor(Math.random() * details.length)];

        activities.push({
          id: `ACT-${String(i + 1).padStart(4, '0')}`,
          timestamp: timestamp.toISOString(),
          user: user,
          action: actionLabels[action as keyof typeof actionLabels],
          entity: entity,
          details: detail,
          faculty: faculty
        });
      }

      return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // ==================================================================================
  // STUDY PROGRAMS PAGES
  // ==================================================================================
  'upload_courses': {
    id: 'upload_courses',
    title: 'رفع بيانات المقررات الدراسية',
    description: 'رفع وتحديث بيانات المقررات الدراسية من ملف Excel أو CSV',
    type: 'form',
    columns: [
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'department', label: 'القسم' },
      { key: 'credit_hours', label: 'الساعات المعتمدة' },
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'level', label: 'المستوى' }
    ],
    data: [],
    actions: [
      { type: 'upload', label: 'رفع ملف' },
      { type: 'export', label: 'تحميل قالب' }
    ]
  },
  'equivalent_courses': {
    id: 'equivalent_courses',
    title: 'المقررات المناظرة للموازنة',
    description: 'إدارة المقررات المناظرة بين البرامج المختلفة للموازنة الأكاديمية',
    type: 'table',
    columns: [
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'program', label: 'البرنامج' },
      { key: 'equivalent_course', label: 'المقرر المناظر' },
      { key: 'equivalent_program', label: 'البرنامج المناظر' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { course_code: 'CS101', course_name: 'مقدمة في البرمجة', program: 'علوم الحاسب', equivalent_course: 'IS101', equivalent_program: 'نظم المعلومات', status: 'معتمد' },
      { course_code: 'CS201', course_name: 'هياكل البيانات', program: 'علوم الحاسب', equivalent_course: 'IS201', equivalent_program: 'نظم المعلومات', status: 'معتمد' },
      { course_code: 'CS301', course_name: 'قواعد البيانات', program: 'علوم الحاسب', equivalent_course: 'IS301', equivalent_program: 'نظم المعلومات', status: 'معتمد' },
      { course_code: 'AI401', course_name: 'تعلم الآلة', program: 'ذكاء اصطناعي', equivalent_course: 'CS401', equivalent_program: 'علوم الحاسب', status: 'قيد المراجعة' },
    ],
    actions: [
      { type: 'add', label: 'إضافة مقرر مناظر' },
      { type: 'edit', label: 'تعديل' },
      { type: 'export', label: 'تصدير' }
    ]
  },
  'program_data': {
    id: 'program_data',
    title: 'بيانات البرامج',
    description: 'عرض وإدارة بيانات البرامج الدراسية المعتمدة في الكلية',
    type: 'table',
    columns: [
      { key: 'program_id', label: 'كود البرنامج' },
      { key: 'program_name', label: 'اسم البرنامج' },
      { key: 'degree', label: 'الدرجة العلمية' },
      { key: 'department', label: 'القسم' },
      { key: 'total_hours', label: 'إجمالي الساعات' },
    ],
    data: [
      { program_id: 'CS-B', program_name: 'بكالوريوس علوم الحاسب', degree: 'بكالوريوس', department: 'علوم الحاسب', duration: '4', total_hours: '132', status: 'نشط' },
      { program_id: 'IS-B', program_name: 'بكالوريوس نظم المعلومات', degree: 'بكالوريوس', department: 'نظم المعلومات', duration: '4', total_hours: '132', status: 'نشط' },
      { program_id: 'AI-B', program_name: 'بكالوريوس الذكاء الاصطناعي', degree: 'بكالوريوس', department: 'ذكاء اصطناعي', duration: '4', total_hours: '132', status: 'نشط' },
      { program_id: 'IT-B', program_name: 'بكالوريوس تكنولوجيا المعلومات', degree: 'بكالوريوس', department: 'تكنولوجيا المعلومات', duration: '4', total_hours: '132', status: 'نشط' },
      { program_id: 'CS-M', program_name: 'ماجستير علوم الحاسب', degree: 'ماجستير', department: 'علوم الحاسب', duration: '2', total_hours: '36', status: 'نشط' },
    ],
    actions: [
      { type: 'add', label: 'إضافة برنامج جديد' },
      { type: 'edit', label: 'تعديل' },
      { type: 'view', label: 'عرض التفاصيل' }
    ]
  },
  'program_rules': {
    id: 'program_rules',
    title: 'قواعد البرنامج',
    description: 'إدارة القواعد والشروط الخاصة بكل برنامج دراسي',
    type: 'table',
    columns: [
      { key: 'rule_id', label: 'رقم القاعدة' },
      { key: 'program', label: 'البرنامج' },
      { key: 'rule_type', label: 'نوع القاعدة' },
      { key: 'description', label: 'الوصف' },
      { key: 'version', label: 'الإصدار' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { rule_id: 'RUL-CS-001', program: 'علوم الحاسب', rule_type: 'متطلبات التخرج', description: 'يجب إكمال 132 ساعة معتمدة', version: '2.0', status: 'ساري' },
      { rule_id: 'RUL-CS-002', program: 'علوم الحاسب', rule_type: 'المعدل التراكمي', description: 'الحد الأدنى للمعدل التراكمي 2.0', version: '2.0', status: 'ساري' },
      { rule_id: 'RUL-IS-001', program: 'نظم المعلومات', rule_type: 'متطلبات التخرج', description: 'يجب إكمال 132 ساعة معتمدة', version: '1.5', status: 'ساري' },
      { rule_id: 'RUL-AI-001', program: 'ذكاء اصطناعي', rule_type: 'المقررات الإجبارية', description: 'يجب اجتياز جميع المقررات الإجبارية', version: '1.0', status: 'ساري' },
    ],
    actions: [
      { type: 'add', label: 'إضافة قاعدة جديدة' },
      { type: 'edit', label: 'تعديل' },
      { type: 'view', label: 'عرض التفاصيل' }
    ]
  },
  'study_courses': {
    id: 'study_courses',
    title: 'المقررات الدراسية',
    description: 'قائمة بجميع المقررات الدراسية المتاحة في البرامج المختلفة',
    type: 'table',
    columns: [
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'program', label: 'البرنامج' },
      { key: 'level', label: 'المستوى' },
      { key: 'hours', label: 'الساعات المعتمدة' },
      { key: 'type', label: 'النوع' },
      { key: 'semester', label: 'الفصل الدراسي' }
    ],
    data: [
      { course_code: 'CS101', course_name: 'مقدمة في البرمجة', program: 'علوم الحاسب', level: 'المستوى الأول', hours: 3, type: 'إجباري', status: 'نشط' },
      { course_code: 'CS102', course_name: 'مبادئ الحاسبات', program: 'علوم الحاسب', level: 'المستوى الأول', hours: 3, type: 'إجباري', status: 'نشط' },
      { course_code: 'CS201', course_name: 'هياكل البيانات', program: 'علوم الحاسب', level: 'المستوى الثاني', hours: 3, type: 'إجباري', status: 'نشط' },
      { course_code: 'CS202', course_name: 'الخوارزميات', program: 'علوم الحاسب', level: 'المستوى الثاني', hours: 3, type: 'إجباري', status: 'نشط' },
      { course_code: 'IS301', course_name: 'تحليل وتصميم نظم', program: 'نظم المعلومات', level: 'المستوى الثالث', hours: 3, type: 'إجباري', status: 'نشط' },
      { course_code: 'AI401', course_name: 'تعلم الآلة', program: 'ذكاء اصطناعي', level: 'المستوى الرابع', hours: 3, type: 'إجباري', status: 'نشط' },
      { course_code: 'CS301', course_name: 'قواعد البيانات المتقدمة', program: 'علوم الحاسب', level: 'المستوى الثالث', hours: 3, type: 'اختياري', status: 'نشط' },
    ],
    actions: [
      { type: 'add', label: 'إضافة مقرر' },
      { type: 'edit', label: 'تعديل' },
      { type: 'view', label: 'عرض التفاصيل' }
    ]
  },
  'bylaw_courses': {
    id: 'bylaw_courses',
    title: 'مقررات اللائحة',
    description: 'عرض المقررات الدراسية حسب اللائحة الداخلية المعتمدة',
    type: 'table',
    columns: [
      { key: 'bylaw_id', label: 'رقم اللائحة' },
      { key: 'bylaw_name', label: 'اسم اللائحة' },
      { key: 'program', label: 'البرنامج' },
      { key: 'courses_count', label: 'عدد المقررات' },
      { key: 'approval_date', label: 'تاريخ الاعتماد', type: 'date' },
    ],
    data: [
      { bylaw_id: 'BYL-FCAI-2020', bylaw_name: 'لائحة كلية الحاسبات 2020', program: 'جميع البرامج', courses_count: '45', approval_date: '2020-09-01', status: 'ساري' },
      { bylaw_id: 'BYL-CS-2022', bylaw_name: 'لائحة برنامج علوم الحاسب 2022', program: 'علوم الحاسب', courses_count: '38', approval_date: '2022-03-15', status: 'ساري' },
      { bylaw_id: 'BYL-IS-2022', bylaw_name: 'لائحة برنامج نظم المعلومات 2022', program: 'نظم المعلومات', courses_count: '40', approval_date: '2022-03-15', status: 'ساري' },
      { bylaw_id: 'BYL-AI-2023', bylaw_name: 'لائحة برنامج الذكاء الاصطناعي 2023', program: 'ذكاء اصطناعي', courses_count: '42', approval_date: '2023-09-01', status: 'ساري' },
    ],
    actions: [
      { type: 'view', label: 'عرض المقررات' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // غلق المقررات - إدارة غلق وفتح المقررات حسب الفصل
  'course_close': {
    id: 'course_close',
    title: 'غلق المقررات',
    description: 'إدارة غلق وفتح المقررات الدراسية حسب الفصل الدراسي والعام الأكاديمي',
    type: 'table',
    columns: [
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'academic_year', label: 'العام الأكاديمي' },
      { key: 'closure_date', label: 'تاريخ الغلق', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { id: '1', course_code: 'CS101', course_name: 'مقدمة في البرمجة', semester: 'خريف', academic_year: '2024-2025', closure_date: '2024-11-15', status: 'مغلق' },
      { id: '2', course_code: 'ENG101', course_name: 'اللغة الإنجليزية 1', semester: 'خريف', academic_year: '2024-2025', closure_date: '2024-11-15', status: 'مغلق' },
      { id: '3', course_code: 'CS202', course_name: 'الخوارزميات', semester: 'ربيع', academic_year: '2024-2025', closure_date: '2025-04-10', status: 'مفتوح' }
    ],
    actions: [
      { type: 'add', label: 'إضافة غلق مقرر' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // تعديل النظام - إعدادات النظام والباراميترات
  'sys_edit': {
    id: 'sys_edit',
    title: 'تعديل النظام',
    description: 'إدارة إعدادات النظام والباراميترات (فتح/غلق التسجيل، التواريخ، القيم الافتراضية)',
    type: 'table',
    columns: [
      { key: 'name', label: 'اسم الإعداد' },
      { key: 'value', label: 'القيمة' },
      { key: 'description', label: 'الوصف', type: 'long_text' },
      { key: 'category', label: 'التصنيف' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { id: 'S1', name: 'فتح التسجيل الأكاديمي', value: 'نعم', description: 'يسمح للطلاب بالتسجيل في المقررات للإرشاد الأكاديمي', category: 'أكاديمي', status: 'نشط' },
      { id: 'S2', name: 'تاريخ نهاية التسجيل', value: '2024-10-31', description: 'آخر موعد للطلاب للتسجيل المبكر للمقررات', category: 'أكاديمي', status: 'نشط' },
      { id: 'S3', name: 'غرامة التأخير', value: '150 ج.م', description: 'قيمة الغرامة على تأخير دفع الرسوم', category: 'مالي', status: 'نشط' }
    ],
    actions: [
      { type: 'add', label: 'إضافة إعداد' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // تجهيز رسوم الطلاب
  'fees_setup': {
    id: 'fees_setup',
    title: 'تجهيز رسوم الطلاب',
    description: 'تجهيز وإعداد رسوم الطلاب حسب الفصل الدراسي ونوع الرسوم',
    type: 'table',
    columns: [
      { key: 'semester', label: 'الفصل الدراسي' },
      { key: 'academic_year', label: 'العام الأكاديمي' },
      { key: 'fee_type', label: 'نوع الرسوم' },
      { key: 'amount', label: 'المبلغ', type: 'currency' },
      { key: 'level', label: 'المستوى' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: [
      { type: 'add', label: 'إضافة تجهيز رسوم' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // تحصيل رسوم طالب
  'fees_collect': {
    id: 'fees_collect',
    title: 'تحصيل رسوم طالب',
    description: 'تسجيل تحصيل الرسوم من الطلاب مع رقم الإيصال والتاريخ',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'amount_due', label: 'المبلغ المطلوب', type: 'currency' },
      { key: 'amount_paid', label: 'المبلغ المحصل', type: 'currency' },
      { key: 'payment_date', label: 'تاريخ التحصيل', type: 'date' },
      { key: 'receipt_no', label: 'رقم الإيصال' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: [
      { type: 'add', label: 'إضافة تحصيل' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // إذن دفع
  'payment_perm': {
    id: 'payment_perm',
    title: 'إذن دفع',
    description: 'إصدار وإدارة أذونات الدفع للطلاب',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'amount', label: 'المبلغ', type: 'currency' },
      { key: 'purpose', label: 'الغرض', type: 'long_text' },
      { key: 'request_date', label: 'تاريخ الطلب', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: [
      { type: 'add', label: 'إضافة إذن دفع' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة إذن دفع' }
    ]
  },

  // اضافة عام تخرج للطلاب
  'grad_year': {
    id: 'grad_year',
    title: 'اضافة عام تخرج للطلاب',
    description: 'إضافة أو تعديل عام التخرج للطلاب مع تسجيل الحالة',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'graduation_year', label: 'عام التخرج' },
      { key: 'date', label: 'تاريخ الإضافة', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: [
      { type: 'add', label: 'إضافة عام تخرج' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // تعديل مستويات الطلاب
  'level_mod': {
    id: 'level_mod',
    title: 'تعديل مستويات الطلاب',
    description: 'تعديل المستوى الدراسي للطلاب مع تسجيل السبب والحالة',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'old_level', label: 'المستوى السابق' },
      { key: 'new_level', label: 'المستوى الجديد' },
      { key: 'reason', label: 'سبب التعديل', type: 'long_text' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: [
      { type: 'add', label: 'إضافة تعديل مستوى' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // تعديل المعدل التراكمي
  'gpa_mod': {
    id: 'gpa_mod',
    title: 'تعديل المعدل التراكمي',
    description: 'تعديل المعدل التراكمي للطلاب مع تسجيل السبب والحالة',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'old_gpa', label: 'المعدل السابق' },
      { key: 'new_gpa', label: 'المعدل الجديد' },
      { key: 'reason', label: 'سبب التعديل', type: 'long_text' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: [
      { type: 'add', label: 'إضافة تعديل معدل' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // لوحة المعلومات - إعلانات ورسائل للطلاب
  'info_board': {
    id: 'info_board',
    title: 'لوحة المعلومات',
    description: 'مرحباً بك في نظام إدارة شؤون طلاب جامعة دمياط — إضافة وعرض الإعلانات والرسائل',
    type: 'table',
    columns: [
      { key: 'msg', label: 'الرسالة', type: 'long_text' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { id: 1, msg: 'بدء الفصل الدراسي الثاني 2024/2025 — يُرجى مراجعة جداول التسجيل.', date: '2025-02-01', status: 'منشور' },
      { id: 2, msg: 'آخر موعد لسداد الرسوم الدراسية: 28 فبراير 2025.', date: '2025-02-05', status: 'منشور' },
      { id: 3, msg: 'امتحانات منتصف الفصل ستبدأ في 15 مارس 2025 — يُرجى متابعة الجداول.', date: '2025-03-01', status: 'منشور' },
      { id: 4, msg: 'إعلان نتائج الفصل الأول متاح الآن على بوابة الطالب.', date: '2025-01-20', status: 'منشور' },
      { id: 5, msg: 'صيانة النظام مجدولة يوم الجمعة 10 مارس — قد يتعذر الوصول مؤقتاً.', date: '2025-03-08', status: 'قيد المراجعة' },
    ],
    actions: [
      { type: 'add', label: 'إضافة إعلان' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // Fallback
  'default': {
    id: 'default',
    title: 'لوحة المعلومات',
    description: 'مرحباً بك في نظام إدارة شؤون طلاب جامعة دمياط',
    type: 'table',
    columns: [
      { key: 'msg', label: 'الرسالة', type: 'long_text' },
      { key: 'date', label: 'التاريخ', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [],
    actions: [
      { type: 'add', label: 'إضافة إعلان' },
      { type: 'export', label: 'تصدير' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  // ==================================================================================
  // STUDENT DATA MANAGEMENT
  // ==================================================================================
  'student_data_management': {
    id: 'student_data_management',
    title: 'بيانات الطالب',
    description: 'إدارة بيانات الطالب الشخصية والأكاديمية والتجنيد',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'student_name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'status', label: 'الحالة' },
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'phone', label: 'رقم الهاتف' },
      { key: 'created_at', label: 'تاريخ التسجيل' }
    ],
    data: [],
    actions: [
      { type: 'view', label: 'عرض الملف', primary: true },
      { type: 'edit', label: 'تعديل' }
    ]
  },
  // ==================================================================================
  // DEPARTMENTS (SPECIALIZATIONS) PAGES
  // ==================================================================================
  'view_departments': {
    id: 'view_departments',
    title: 'عرض التخصصات',
    description: 'عرض جميع التخصصات المتاحة في كلية الحاسبات والمعلومات',
    type: 'table',
    columns: [
      { key: 'code', label: 'رمز التخصص' },
      { key: 'name', label: 'اسم التخصص' },
      { key: 'students_count', label: 'عدد الطلاب' },
      { key: 'programs_count', label: 'عدد البرامج' },
      { key: 'courses_count', label: 'عدد المقررات' },
    ],
    data: [
      { code: 'CS', name: 'علوم الحاسب (CS)', students_count: 400, programs_count: 2, courses_count: 15, status: 'نشط' },
      { code: 'IS', name: 'نظم المعلومات (IS)', students_count: 350, programs_count: 2, courses_count: 12, status: 'نشط' },
      { code: 'AI', name: 'الذكاء الاصطناعي (AI)', students_count: 300, programs_count: 1, courses_count: 10, status: 'نشط' },
      { code: 'IT', name: 'تكنولوجيا المعلومات (IT)', students_count: 280, programs_count: 1, courses_count: 10, status: 'نشط' },
      { code: 'MI', name: 'المعلوماتية الطبية (MI)', students_count: 200, programs_count: 1, courses_count: 8, status: 'نشط' },
      { code: 'SEC', name: 'الأمن السيبراني (SEC)', students_count: 250, programs_count: 1, courses_count: 9, status: 'نشط' }
    ],
    actions: [
      { type: 'view', label: 'عرض التفاصيل' },
      { type: 'edit', label: 'تعديل' }
    ]
  },
  'manage_departments': {
    id: 'manage_departments',
    title: 'إدارة التخصصات',
    description: 'إدارة التخصصات والأقسام في كلية الحاسبات والمعلومات',
    type: 'table',
    columns: [
      { key: 'code', label: 'رمز التخصص' },
      { key: 'name', label: 'اسم التخصص' },
      { key: 'head_name', label: 'رئيس القسم' },
      { key: 'students_count', label: 'عدد الطلاب' },
    ],
    data: [
      { code: 'CS', name: 'علوم الحاسب (CS)', head_name: 'د. أحمد محمد السيد', students_count: 400, status: 'نشط' },
      { code: 'IS', name: 'نظم المعلومات (IS)', head_name: 'د. منال حسن إبراهيم', students_count: 350, status: 'نشط' },
      { code: 'AI', name: 'الذكاء الاصطناعي (AI)', head_name: 'د. خالد محمود علي', students_count: 300, status: 'نشط' },
      { code: 'IT', name: 'تكنولوجيا المعلومات (IT)', head_name: 'د. سارة أحمد فؤاد', students_count: 280, status: 'نشط' },
      { code: 'MI', name: 'المعلوماتية الطبية (MI)', head_name: 'د. محمد عبدالله نصر', students_count: 200, status: 'نشط' },
      { code: 'SEC', name: 'الأمن السيبراني (SEC)', head_name: 'أ.د. فاطمة علي حسن', students_count: 250, status: 'نشط' }
    ],
    actions: [
      { type: 'add', label: 'إضافة تخصص جديد' },
      { type: 'edit', label: 'تعديل' },
      { type: 'delete', label: 'حذف' }
    ]
  },
  'department_students': {
    id: 'department_students',
    title: 'طلاب التخصصات',
    description: 'عرض قائمة الطلاب حسب التخصص',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'department', label: 'التخصص' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: (() => {
      const deptStudents: any[] = [];
      DEPARTMENTS_FCAI.filter(d => d !== 'عام').forEach(dept => {
        const students = ALL_STUDENTS.filter(s => s.department === dept).slice(0, 5);
        deptStudents.push(...students);
      });
      return deptStudents;
    })(),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'فلترة' }
    ]
  },
  'department_statistics': {
    id: 'department_statistics',
    title: 'إحصائيات التخصصات',
    description: 'إحصائيات شاملة عن التخصصات والطلاب',
    type: 'table',
    columns: [
      { key: 'department', label: 'التخصص' },
      { key: 'total_students', label: 'إجمالي الطلاب' },
      { key: 'level_1', label: 'المستوى الأول' },
      { key: 'level_2', label: 'المستوى الثاني' },
      { key: 'level_3', label: 'المستوى الثالث' },
      { key: 'level_4', label: 'المستوى الرابع' },
      { key: 'avg_gpa', label: 'متوسط المعدل' }
    ],
    data: [
      { department: 'علوم الحاسب (CS)', total_students: 400, level_1: 100, level_2: 100, level_3: 100, level_4: 100, avg_gpa: '3.2' },
      { department: 'نظم المعلومات (IS)', total_students: 350, level_1: 88, level_2: 88, level_3: 87, level_4: 87, avg_gpa: '3.1' },
      { department: 'الذكاء الاصطناعي (AI)', total_students: 300, level_1: 75, level_2: 75, level_3: 75, level_4: 75, avg_gpa: '3.3' },
      { department: 'تكنولوجيا المعلومات (IT)', total_students: 280, level_1: 70, level_2: 70, level_3: 70, level_4: 70, avg_gpa: '3.0' },
      { department: 'المعلوماتية الطبية (MI)', total_students: 200, level_1: 50, level_2: 50, level_3: 50, level_4: 50, avg_gpa: '3.2' },
      { department: 'الأمن السيبراني (SEC)', total_students: 250, level_1: 63, level_2: 63, level_3: 62, level_4: 62, avg_gpa: '3.4' }
    ],
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'عرض الرسوم البيانية' }
    ]
  },
  'cs_department': {
    id: 'cs_department',
    title: 'قسم علوم الحاسب (CS)',
    description: 'تفاصيل قسم علوم الحاسب والطلاب المسجلين فيه',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: ALL_STUDENTS.filter(s => s.department === 'علوم الحاسب (CS)').slice(0, 50),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'فلترة' }
    ]
  },
  'is_department': {
    id: 'is_department',
    title: 'قسم نظم المعلومات (IS)',
    description: 'تفاصيل قسم نظم المعلومات والطلاب المسجلين فيه',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: ALL_STUDENTS.filter(s => s.department === 'نظم المعلومات (IS)').slice(0, 50),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'فلترة' }
    ]
  },
  'ai_department': {
    id: 'ai_department',
    title: 'قسم الذكاء الاصطناعي (AI)',
    description: 'تفاصيل قسم الذكاء الاصطناعي والطلاب المسجلين فيه',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: ALL_STUDENTS.filter(s => s.department === 'الذكاء الاصطناعي (AI)').slice(0, 50),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'فلترة' }
    ]
  },
  'it_department': {
    id: 'it_department',
    title: 'قسم تكنولوجيا المعلومات (IT)',
    description: 'تفاصيل قسم تكنولوجيا المعلومات والطلاب المسجلين فيه',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: ALL_STUDENTS.filter(s => s.department === 'تكنولوجيا المعلومات (IT)').slice(0, 50),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'فلترة' }
    ]
  },
  'mi_department': {
    id: 'mi_department',
    title: 'قسم المعلوماتية الطبية (MI)',
    description: 'تفاصيل قسم المعلوماتية الطبية والطلاب المسجلين فيه',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: ALL_STUDENTS.filter(s => s.department === 'المعلوماتية الطبية (MI)').slice(0, 50),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'فلترة' }
    ]
  },
  'sec_department': {
    id: 'sec_department',
    title: 'قسم الأمن السيبراني (SEC)',
    description: 'تفاصيل قسم الأمن السيبراني والطلاب المسجلين فيه',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'status', label: 'حالة القيد', type: 'status' }
    ],
    data: ALL_STUDENTS.filter(s => s.department === 'الأمن السيبراني (SEC)').slice(0, 50),
    actions: [
      { type: 'export', label: 'تصدير Excel' },
      { type: 'view', label: 'فلترة' }
    ]
  },

  'view_programs': {
    id: 'view_programs',
    title: 'البرامج الدراسية',
    description: 'عرض البرامج الدراسية المتاحة',
    type: 'table',
    columns: [
      { key: 'id', label: 'معرّف البرنامج' },
      { key: 'name', label: 'اسم البرنامج' },
      { key: 'code', label: 'كود البرنامج' },
      { key: 'degree', label: 'الدرجة' },
      { key: 'department_id', label: 'القسم' }
    ],
    data: []
  },

  'report_signs': {
    id: 'report_signs',
    title: 'التوقيعات على التقارير',
    description: 'إدارة توقيعات أعضاء التوقيع على التقارير',
    type: 'table',
    columns: [
      { key: 'id', label: 'المعرّف' },
      { key: 'report_name', label: 'اسم التقرير' },
      { key: 'signatory_name', label: 'اسم الموقّع' },
      { key: 'title', label: 'الوظيفة' },
      { key: 'order', label: 'الترتيب' },
      { key: 'is_active', label: 'فعّال', type: 'status' }
    ],
    data: []
  },

  'study_regulations': {
    id: 'study_regulations',
    title: 'لوائح الدراسة',
    description: 'عرض ولوائح الدراسة المعتمدة',
    type: 'table',
    columns: [
      { key: 'id', label: 'المعرّف' },
      { key: 'name', label: 'اسم اللائحة' },
      { key: 'program_id', label: 'البرنامج' },
      { key: 'mandatory_hours', label: 'ساعات إجبارية' },
      { key: 'elective_hours', label: 'ساعات اختيارية' }
    ],
    data: []
  },

  'instructor_assignments': {
    id: 'instructor_assignments',
    title: 'تعيينات المحاضرين',
    description: 'إدارة تعيينات المحاضرين على المقررات',
    type: 'table',
    columns: [
      { key: 'course_id', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'instructor', label: 'المحاضر' },
      { key: 'day', label: 'اليوم' },
      { key: 'session_type', label: 'نوع الجلسة' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: []
  },

  'uni_schedule_manager': {
    id: 'uni_schedule_manager',
    title: 'إدارة الجداول الجامعية (رئيس الجامعة)',
    description: 'إدارة وتوليد الجداول الدراسية لكل الكليات',
    type: 'table',
    columns: [
      { key: 'faculty_id', label: 'كود الكلية' },
      { key: 'faculty_name', label: 'الكلية' },
      { key: 'total_courses', label: 'إجمالي المقررات' },
      { key: 'scheduled', label: 'مجدولة' },
      { key: 'unscheduled', label: 'غير مجدولة' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: []
  }
};

export const getPageConfig = (id: string, facultyId?: string | null): PageConfig => {
  const config = MOCK_DATABASE[id];
  if (!config) return { ...MOCK_DATABASE['default'], id };

  // Handle dynamic data generation (functions that return data)
  let finalData: any = config.data;
  if (typeof config.data === 'function') {
    finalData = (config.data as () => any)();
  }

  // تجهيز الرسوم / تحصيل الرسوم / إذن الدفع — ديناميكي حسب السنة والطالب والبرنامج
  if (id === 'fees_setup') {
    finalData = getDynamicFeesSetup(facultyId);
    return {
      ...config,
      data: finalData,
      description: `تجهيز رسوم الطلاب — الفصل الحالي حسب السنة الدراسية والمستوى${facultyId === 'FCAI' ? ' (كلية الحاسبات)' : ''}`
    };
  }
  if (id === 'fees_collect') {
    finalData = getDynamicFeesCollect(facultyId);
    return {
      ...config,
      data: finalData,
      description: `تحصيل الرسوم — مُحمّل من بيانات الطلاب والسجلات المالية (${finalData.length} طالب)`
    };
  }
  if (id === 'payment_perm') {
    finalData = getDynamicPaymentPerm(facultyId);
    return {
      ...config,
      data: finalData,
      description: `إذن الدفع — طلاب لديهم مستحقات (${finalData.length} إذن)`
    };
  }

  // Read departments, programs, and courses from Academic Rules for faculty admin
  if ((id === 'view_departments' || id === 'manage_departments' || id === 'program_data' || id === 'program_rules' || id === 'study_courses' || id === 'bylaw_courses' || id === 'equivalent_courses' || id === 'course_schedules' || id === 'student_personal_schedules' || id === 'room_utilization' || id === 'instructor_workload' || id === 'assign_room' || id === 'instructor_assignments') && facultyId) {
    let academicRules = getAcademicRulesByFaculty(facultyId);
    
    // If no rules found, create default rules
    if (!academicRules) {
      const defaultFaculty = FACULTIES.find(f => f.id === facultyId);
      if (defaultFaculty) {
        academicRules = createDefaultAcademicRules(facultyId, defaultFaculty.name);
        saveAcademicRules(academicRules);
      }
    }
    
    if (academicRules?.studySystem?.graduationRequirementsDetails?.majorRequirements?.programs) {
      const programs = academicRules.studySystem.graduationRequirementsDetails.majorRequirements.programs;
      const programsList = Object.keys(programs).filter(key => programs[key as 'CS' | 'IT' | 'IS']);
      
      if (id === 'view_departments') {
        // Generate departments data from academic rules
        const departmentsData = programsList.map(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          const mandatoryCount = programData.mandatory?.length || 0;
          const electiveCount = programData.elective?.length || 0;
          const totalCourses = mandatoryCount + electiveCount;
          
          // Get student count from actual student data
          const deptName = programData.name;
          const studentsCount = ALL_STUDENTS.filter(s => s.department === deptName).length;
          
          return {
            code: programCode,
            name: deptName,
            students_count: studentsCount,
            programs_count: 1,
            courses_count: totalCourses,
            status: 'نشط'
          };
        });
        
        return {
          ...config,
          data: departmentsData,
          description: `عرض جميع التخصصات المتاحة في ${academicRules.facultyName || 'الكلية'}`
        };
      } else if (id === 'manage_departments') {
        // Generate manage departments data from academic rules
        const departmentsData = programsList.map(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          const deptName = programData.name;
          const studentsCount = ALL_STUDENTS.filter(s => s.department === deptName).length;
          
          return {
            code: programCode,
            name: deptName,
            head_name: 'قيد التعيين', // Default value, can be updated later
            students_count: studentsCount,
            status: 'نشط'
          };
        });
        
        return {
          ...config,
          data: departmentsData,
          description: `إدارة التخصصات والأقسام في ${academicRules.facultyName || 'الكلية'}`
        };
      } else if (id === 'program_data') {
        // Generate programs data from academic rules
        const programsData = programsList.map(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          const mandatoryCount = programData.mandatory?.length || 0;
          const electiveCount = programData.elective?.length || 0;
          const totalCourses = mandatoryCount + electiveCount;
          const mandatoryHours = (programData.mandatory || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0);
          const electiveHours = (programData.elective || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0);
          
          return {
            program_id: `${programCode}-B`,
            program_name: `بكالوريوس ${programData.name}`,
            degree: 'بكالوريوس',
            department: programData.name,
            duration: '4',
            total_hours: '140',
            status: 'نشط'
          };
        });
        
        return {
          ...config,
          data: programsData,
          description: `بيانات البرامج الدراسية في ${academicRules.facultyName || 'الكلية'} (${programsData.length} برنامج)`
        };
      } else if (id === 'program_rules') {
        // Generate program rules data from academic rules
        const rulesData: any[] = [];
        const gradReqs = academicRules.studySystem.graduationRequirements;
        const levelProg = academicRules.studySystem.levelProgression;
        const retake = (academicRules.studySystem as any).retake;
        const programChange = (academicRules.studySystem as any).programChange;
        
        // Add rules for each program
        programsList.forEach(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          const mandatoryCount = programData.mandatory?.length || 0;
          const electiveHours = academicRules.studySystem.graduationRequirementsDetails.majorRequirements.electiveHours;
          
          // Rule 1: Total Credit Hours
          rulesData.push({
            rule_id: `RUL-${programCode}-001`,
            program: programData.name,
            rule_type: 'متطلبات التخرج',
            description: `يجب إكمال ${gradReqs.totalCreditHours} ساعة معتمدة`,
            version: '2.0',
            status: 'ساري'
          });
          
          // Rule 2: Minimum GPA
          rulesData.push({
            rule_id: `RUL-${programCode}-002`,
            program: programData.name,
            rule_type: 'المعدل التراكمي',
            description: `الحد الأدنى للمعدل التراكمي ${gradReqs.minimumGPA}`,
            version: '2.0',
            status: 'ساري'
          });
          
          // Rule 3: Minimum Years
          rulesData.push({
            rule_id: `RUL-${programCode}-003`,
            program: programData.name,
            rule_type: 'مدة الدراسة',
            description: `الحد الأدنى لمدة الدراسة ${gradReqs.minimumYears} سنوات`,
            version: '2.0',
            status: 'ساري'
          });
          
          // Rule 4: Mandatory Courses
          rulesData.push({
            rule_id: `RUL-${programCode}-004`,
            program: programData.name,
            rule_type: 'المقررات الإجبارية',
            description: `يجب اجتياز جميع المقررات الإجبارية (${mandatoryCount} مقرر)`,
            version: '2.0',
            status: 'ساري'
          });
          
          // Rule 5: Elective Courses
          rulesData.push({
            rule_id: `RUL-${programCode}-005`,
            program: programData.name,
            rule_type: 'المقررات الاختيارية',
            description: `يجب اختيار ${electiveHours} ساعة معتمدة من المقررات الاختيارية`,
            version: '2.0',
            status: 'ساري'
          });
          
          // Rule 6: Level Progression
          if (levelProg) {
            rulesData.push({
              rule_id: `RUL-${programCode}-006`,
              program: programData.name,
              rule_type: 'الانتقال بين المستويات',
              description: `المستوى الأول: ${levelProg.level1?.maxCreditHours || 0} ساعة، المستوى الثاني: ${levelProg.level2?.requiredCreditHours || 0} ساعة، المستوى الثالث: ${levelProg.level3?.requiredCreditHours || 0} ساعة`,
              version: '2.0',
              status: 'ساري'
            });
          }
          
          // Rule 7: Retake Rules
          if (retake?.failedCourse?.enabled) {
            rulesData.push({
              rule_id: `RUL-${programCode}-007`,
              program: programData.name,
              rule_type: 'الرسوب والإعادة',
              description: `يمكن إعادة المقرر الراسب، الحد الأقصى للدرجة بعد الإعادة: ${retake.failedCourse.maxGradeAfterRetake}`,
              version: '2.0',
              status: 'ساري'
            });
          }
          
          // Rule 8: Program Change
          if (programChange?.enabled) {
            rulesData.push({
              rule_id: `RUL-${programCode}-008`,
              program: programData.name,
              rule_type: 'تعديل المسار',
              description: `يمكن تعديل المسار في المستوى ${programChange.allowedLevel} بعد موافقة المرشد والقسم واللجنة`,
              version: '2.0',
              status: 'ساري'
            });
          }
        });
        
        return {
          ...config,
          data: rulesData,
          description: `قواعد البرامج الدراسية في ${academicRules.facultyName || 'الكلية'} (${rulesData.length} قاعدة)`
        };
      } else if (id === 'equivalent_courses') {
        // Generate equivalent courses data from academic rules
        // Find courses that appear in multiple programs (potential equivalents)
        const equivalentCoursesData: any[] = [];
        const allCourses: Map<string, { code: string; name: string; programs: string[] }> = new Map();
        
        // Collect all courses from all programs
        programsList.forEach(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          
          // Add mandatory courses
          (programData.mandatory || []).forEach(course => {
            if (course && course.code) {
              if (!allCourses.has(course.code)) {
                allCourses.set(course.code, {
                  code: course.code,
                  name: course.name,
                  programs: []
                });
              }
              const courseInfo = allCourses.get(course.code)!;
              if (!courseInfo.programs.includes(programData.name)) {
                courseInfo.programs.push(programData.name);
              }
            }
          });
          
          // Add elective courses
          (programData.elective || []).forEach(course => {
            if (course && course.code) {
              if (!allCourses.has(course.code)) {
                allCourses.set(course.code, {
                  code: course.code,
                  name: course.name,
                  programs: []
                });
              }
              const courseInfo = allCourses.get(course.code)!;
              if (!courseInfo.programs.includes(programData.name)) {
                courseInfo.programs.push(programData.name);
              }
            }
          });
        });
        
        // Find courses that appear in multiple programs
        allCourses.forEach((courseInfo, courseCode) => {
          if (courseInfo.programs.length > 1) {
            // This course appears in multiple programs - create equivalent entries
            for (let i = 0; i < courseInfo.programs.length; i++) {
              for (let j = i + 1; j < courseInfo.programs.length; j++) {
                equivalentCoursesData.push({
                  course_code: courseCode,
                  course_name: courseInfo.name,
                  program: courseInfo.programs[i],
                  equivalent_course: courseCode,
                  equivalent_program: courseInfo.programs[j],
                  status: 'معتمد'
                });
                
                // Also add reverse equivalent
                equivalentCoursesData.push({
                  course_code: courseCode,
                  course_name: courseInfo.name,
                  program: courseInfo.programs[j],
                  equivalent_course: courseCode,
                  equivalent_program: courseInfo.programs[i],
                  status: 'معتمد'
                });
              }
            }
          }
        });
        
        return {
          ...config,
          data: equivalentCoursesData,
          description: `المقررات المناظرة للموازنة في ${academicRules.facultyName || 'الكلية'} (${equivalentCoursesData.length} مقرر مناظر)`
        };
      } else if (id === 'course_schedules' || id === 'student_personal_schedules' || id === 'room_utilization' || id === 'instructor_workload' || id === 'assign_room' || id === 'instructor_assignments') {
        // Generate schedules and related data from academic rules courses
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
        const timeSlots = [
          '08:00 - 10:00',
          '10:00 - 12:00',
          '12:00 - 14:00',
          '14:00 - 16:00',
          '16:00 - 18:00'
        ];
        // Use dynamically loaded rooms from API (via FORM_OPTIONS), fallback to static list
        const rooms = FORM_OPTIONS.rooms.length > 0 ? FORM_OPTIONS.rooms : [
          'مدرج 101 B', 'مدرج 102 B', 'مدرج 103 B', 'مدرج 104 B', 'مدرج 105 B',
          'قاعة 309 B', 'قاعة 310 B',
          'معمل 201', 'معمل 202', 'معمل 203', 'معمل 204', 'معمل 205', 'معمل 206',
          'معمل 207', 'معمل 208', 'معمل 209', 'معمل 210', 'معمل 211', 'معمل 212',
          'معمل 401', 'معمل 402', 'معمل 403', 'معمل 407', 'معمل 413', 'معمل 414'
        ];
        
        // Room capacities mapping
        const roomCapacities: Record<string, number> = {
          'مدرج 101 B': 150,
          'مدرج 102 B': 150,
          'مدرج 103 B': 150,
          'مدرج 104 B': 250,
          'مدرج 105 B': 250,
          'قاعة 309 B': 60,
          'قاعة 310 B': 60,
          'معمل 201': 35,
          'معمل 202': 5,
          'معمل 203': 25,
          'معمل 204': 25,
          'معمل 205': 25,
          'معمل 206': 35,
          'معمل 207': 35,
          'معمل 208': 23,
          'معمل 209': 23,
          'معمل 210': 25,
          'معمل 211': 25,
          'معمل 212': 35,
          'معمل 401': 25,
          'معمل 402': 25,
          'معمل 403': 23,
          'معمل 407': 35,
          'معمل 408': 0, // في مرحلة التوريد
          'معمل 409': 0, // في مرحلة التوريد
          'معمل 410': 0, // في مرحلة التوريد
          'معمل 411': 0, // في مرحلة التوريد
          'معمل 412': 0, // في مرحلة التوريد
          'معمل 413': 25,
          'معمل 414': 12
        };
        
        // Room types mapping
        const roomTypes: Record<string, string> = {
          'مدرج 101 B': 'مدرج',
          'مدرج 102 B': 'مدرج',
          'مدرج 103 B': 'مدرج',
          'مدرج 104 B': 'مدرج',
          'مدرج 105 B': 'مدرج',
          'قاعة 309 B': 'قاعة',
          'قاعة 310 B': 'قاعة',
          'معمل 201': 'معمل',
          'معمل 202': 'معمل',
          'معمل 203': 'معمل',
          'معمل 204': 'معمل',
          'معمل 205': 'معمل',
          'معمل 206': 'معمل',
          'معمل 207': 'معمل',
          'معمل 208': 'معمل',
          'معمل 209': 'معمل',
          'معمل 210': 'معمل',
          'معمل 211': 'معمل',
          'معمل 212': 'معمل',
          'معمل 401': 'معمل',
          'معمل 402': 'معمل',
          'معمل 403': 'معمل',
          'معمل 407': 'معمل',
          'معمل 408': 'معمل',
          'معمل 409': 'معمل',
          'معمل 410': 'معمل',
          'معمل 411': 'معمل',
          'معمل 412': 'معمل',
          'معمل 413': 'معمل',
          'معمل 414': 'معمل'
        };
        
        // Use dynamically loaded instructors from API (via FORM_OPTIONS), fallback to static list
        const instructors = FORM_OPTIONS.instructor_names.length > 0 ? FORM_OPTIONS.instructor_names : [
          'د. أحمد محمد السيد', 'د. منال حسن إبراهيم', 'د. خالد محمود علي',
          'د. سارة أحمد فؤاد', 'د. محمد عبدالله نصر', 'أ.د. فاطمة علي حسن',
          'د. يوسف سعيد كامل', 'د. نورا محمود جمال'
        ];
        
        // Collect all courses from academic rules
        const allCoursesFromRules: any[] = [];
        programsList.forEach(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          
          // Add mandatory courses
          (programData.mandatory || []).forEach(course => {
            if (course && course.code && course.name) {
              allCoursesFromRules.push({
                id: course.code,
                name: course.name,
                program: programData.name,
                department: programData.name,
                level: 'المستوى الثالث',
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2)
              });
            }
          });
          
          // Add elective courses
          (programData.elective || []).forEach(course => {
            if (course && course.code && course.name) {
              allCoursesFromRules.push({
                id: course.code,
                name: course.name,
                program: programData.name,
                department: programData.name,
                level: 'المستوى الثالث',
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2)
              });
            }
          });
        });
        
        // Generate schedules from courses
        const schedulesData: any[] = [];
        allCoursesFromRules.forEach(course => {
          const sessionsCount = course.hours >= 4 ? 3 : 2; // More hours = more sessions
          
          for (let i = 0; i < sessionsCount; i++) {
            const day = days[Math.floor(Math.random() * days.length)];
            const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            const room = rooms[Math.floor(Math.random() * rooms.length)];
            const instructor = instructors[Math.floor(Math.random() * instructors.length)];
            const sessionType = i === 0 ? 'محاضرة' : (i === 1 ? 'سكشن' : 'معمل');
            
            schedulesData.push({
              course_id: course.id,
              course_name: course.name,
              session_type: sessionType,
              day: day,
              time: time,
              room: room,
              instructor: instructor,
              level: course.level,
              department: course.department,
              capacity: Math.floor(Math.random() * 50) + 30
            });
          }
        });
        
        if (id === 'course_schedules') {
          return {
            ...config,
            data: schedulesData,
            description: `جداول جميع المقررات مع تفاصيل المواعيد والقاعات (${schedulesData.length} جلسة دراسية)`
          };
        } else if (id === 'student_personal_schedules') {
          // Generate student schedules from enrollments
          const studentSchedulesData: any[] = [];
          STUDENT_ENROLLMENTS.slice(0, 100).forEach(enrollment => {
            if (enrollment.status === 'مسجل') {
              const courseSchedules = schedulesData.filter(s => s.course_id === enrollment.course_id);
              courseSchedules.forEach(schedule => {
                studentSchedulesData.push({
                  student_id: enrollment.student_id,
                  course_id: schedule.course_id,
                  course_name: schedule.course_name,
                  session_type: schedule.session_type,
                  day: schedule.day,
                  time: schedule.time,
                  room: schedule.room,
                  instructor: schedule.instructor
                });
              });
            }
          });
          
          return {
            ...config,
            data: studentSchedulesData.slice(0, 1000),
            description: `جداول الطلاب الشخصية بناءً على المقررات المسجلة (${studentSchedulesData.length} جدول شخصي)`
          };
        } else if (id === 'room_utilization') {
          // Generate room utilization stats
          const roomStats: any[] = [];
          const uniqueRooms = [...new Set(schedulesData.map(s => s.room))];
          
          uniqueRooms.forEach(room => {
            const roomSessions = schedulesData.filter(s => s.room === room);
            const totalSlots = 5 * 5; // 5 days × 5 time slots
            const utilizationRate = ((roomSessions.length / totalSlots) * 100).toFixed(1) + '%';
            
            // Find peak day
            const dayCount: any = {};
            roomSessions.forEach(s => {
              dayCount[s.day] = (dayCount[s.day] || 0) + 1;
            });
            const peakDay = Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, '');
            
            // Find peak time
            const timeCount: any = {};
            roomSessions.forEach(s => {
              timeCount[s.time] = (timeCount[s.time] || 0) + 1;
            });
            const peakTime = Object.keys(timeCount).reduce((a, b) => timeCount[a] > timeCount[b] ? a : b, '');
            
            roomStats.push({
              room: room,
              total_sessions: roomSessions.length,
              utilization_rate: utilizationRate,
              peak_day: peakDay,
              peak_time: peakTime
            });
          });
          
          return {
            ...config,
            data: roomStats.sort((a, b) => b.total_sessions - a.total_sessions),
            description: `تحليل استخدام القاعات الدراسية والمعامل (${roomStats.length} قاعة)`
          };
        } else if (id === 'instructor_workload') {
          // Generate instructor workload stats
          const instructorStats: any[] = [];
          const uniqueInstructors = [...new Set(schedulesData.map(s => s.instructor))];
          
          uniqueInstructors.forEach(instructor => {
            const instructorSessions = schedulesData.filter(s => s.instructor === instructor);
            const courses = [...new Set(instructorSessions.map(s => s.course_id))];
            const departments = [...new Set(instructorSessions.map(s => s.department))];
            
            // Calculate teaching hours (assuming each session is 2 hours)
            const teachingHours = instructorSessions.length * 2;
            
            instructorStats.push({
              instructor: instructor,
              total_courses: courses.length,
              total_sessions: instructorSessions.length,
              teaching_hours: teachingHours,
              departments: departments.join(', ')
            });
          });
          
          return {
            ...config,
            data: instructorStats.sort((a, b) => b.teaching_hours - a.teaching_hours),
            description: `توزيع الأعباء التدريسية على أعضاء هيئة التدريس (${instructorStats.length} محاضر)`
          };
        } else if (id === 'assign_room') {
          // Generate room assignments from schedules
          const roomAssignmentsData: any[] = [];
          schedulesData.forEach((schedule, index) => {
            roomAssignmentsData.push({
              id: index + 1,
              course_code: schedule.course_id,
              course_name: schedule.course_name,
              group: 'A',
              day: schedule.day,
              time: schedule.time,
              room: schedule.room,
              room_type: schedule.room_type || (schedule.room.includes('معمل') ? 'معمل' : schedule.room.includes('مدرج') ? 'مدرج' : 'قاعة'),
              capacity: schedule.capacity,
              enrolled: Math.floor(schedule.capacity * 0.8),
              instructor: schedule.instructor,
              status: 'نشط',
              actions: 'تعديل | حذف'
            });
          });
          
          return {
            ...config,
            data: roomAssignmentsData,
            description: `توزيع المقررات على القاعات الدراسية المتاحة (${roomAssignmentsData.length} تخصيص)`
          };
        } else if (id === 'instructor_assignments') {
          // Generate instructor assignments from schedules
          const instructorAssignmentsData: any[] = [];
          const courseGroups: Map<string, string[]> = new Map();
          
          schedulesData.forEach(schedule => {
            if (!courseGroups.has(schedule.course_id)) {
              courseGroups.set(schedule.course_id, ['A', 'B']);
            }
          });
          
          schedulesData.forEach((schedule, index) => {
            const groups = courseGroups.get(schedule.course_id) || ['A'];
            groups.forEach(group => {
              instructorAssignmentsData.push({
                id: instructorAssignmentsData.length + 1,
                course_code: schedule.course_id,
                course_name: schedule.course_name,
                group: group,
                lecturer_name: schedule.instructor,
                lecturer_title: schedule.instructor.includes('أ.د.') ? 'أستاذ' : 'أستاذ مساعد',
                department: schedule.department,
                hours_per_week: schedule.session_type === 'محاضرة' ? 3 : 2,
                status: 'نشط',
                actions: 'تعديل | حذف'
              });
            });
          });
          
          return {
            ...config,
            data: instructorAssignmentsData,
            description: `توزيع أعضاء هيئة التدريس على المقررات والمجموعات (${instructorAssignmentsData.length} توزيع)`
          };
        }
      } else if (id === 'study_courses' || id === 'bylaw_courses') {
        // Generate courses data from academic rules
        const coursesData: any[] = [];
        programsList.forEach(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          if (!programData) return;
          
          // Add mandatory courses
          const mandatoryCourses = programData.mandatory || [];
          mandatoryCourses.forEach(course => {
            if (course && course.code && course.name) {
              coursesData.push({
                course_code: course.code,
                course_name: course.name,
                program: programData.name,
                level: 'المستوى الثالث',
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2),
                type: 'إجباري',
                status: 'نشط'
              });
            }
          });
          
          // Add elective courses
          const electiveCourses = programData.elective || [];
          electiveCourses.forEach(course => {
            if (course && course.code && course.name) {
              coursesData.push({
                course_code: course.code,
                course_name: course.name,
                program: programData.name,
                level: 'المستوى الثالث',
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2),
                type: 'اختياري',
                status: 'نشط'
              });
            }
          });
        });
        
        // Debug: Log courses count
        console.log(`[getPageConfig] study_courses: Found ${coursesData.length} courses from academic rules`);
        console.log(`[getPageConfig] Programs: ${programsList.join(', ')}`);
        programsList.forEach(programCode => {
          const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
          if (programData) {
            console.log(`[getPageConfig] ${programCode}: ${programData.mandatory?.length || 0} mandatory, ${programData.elective?.length || 0} elective`);
          }
        });
        
        return {
          ...config,
          data: coursesData,
          description: id === 'study_courses' 
            ? `المقررات الدراسية في ${academicRules.facultyName || 'الكلية'} (${coursesData.length} مقرر)`
            : `مقررات اللائحة في ${academicRules.facultyName || 'الكلية'} (${coursesData.length} مقرر)`
        };
      }
    }
  }

  // Filter Student List by Faculty if facultyId is provided
  // This ensures the admin only sees students relevant to their faculty
  if (id === 'student_list' && facultyId && finalData && Array.isArray(finalData)) {
    const filteredData = finalData.filter((item: any) => item.faculty_code === facultyId);
    const facultyName = FACULTIES.find(f => f.id === facultyId)?.name || facultyId;
    return {
      ...config,
      data: filteredData,
      description: `عرض وإدارة بيانات الطلاب التفصيلية (${filteredData.length} طالب - ${facultyName})`
    };
  }

  // Filter attendance, registration issues, contact list, and id cards by faculty if needed
  if ((id === 'student_attendance' || id === 'manage_reg_issues' || id === 'contact_list' || id === 'id_cards') && facultyId && finalData && Array.isArray(finalData)) {
    // Filter by matching student IDs from the selected faculty
    const facultyStudentIds = ALL_STUDENTS
      .filter((s: any) => s.faculty_code === facultyId)
      .map((s: any) => s.student_id);
    const filteredData = finalData.filter((item: any) => {
      const studentId = item.student_id;
      return studentId && facultyStudentIds.includes(studentId);
    });
    return {
      ...config,
      data: filteredData,
      description: config.description.replace(/\(\d+ سجل\)/, `(${filteredData.length} سجل)`)
    };
  }

  // Generic faculty scoping for student-centric pages to avoid cross-faculty leakage
  const facultyScopedStudentPages = new Set([
    'advanced_student_search',
    'detailed_grades',
    'detailed_attendance',
    'financial_records',
    'student_academic_profile',
    'student_course_enrollments',
    'student_performance_analysis',
    'student_complete_profile',
    'registered_students_report',
    'registered_students_stats',
    'registered_students_chart',
    'students_in_course',
    'unregistered_students',
    'students_by_gpa',
    'registered_courses_for_students',
    'registered_courses_count',
    'review_student_reg',
    'multiple_courses_reg',
    'department_students',
  ]);

  if (facultyId && finalData && Array.isArray(finalData) && facultyScopedStudentPages.has(id)) {
    const facultyName = FACULTIES.find(f => f.id === facultyId)?.name;
    const facultyStudentIds = new Set(
      ALL_STUDENTS
        .filter((s: any) => s.faculty_code === facultyId)
        .map((s: any) => s.student_id)
    );

    const filteredData = finalData.filter((item: any) => {
      if (item?.faculty_code) return item.faculty_code === facultyId;
      if (item?.faculty_id) return item.faculty_id === facultyId;
      if (item?.faculty && facultyName) return item.faculty === facultyName || item.faculty === facultyId;
      if (item?.student_id) return facultyStudentIds.has(item.student_id);
      return false;
    });

    return {
      ...config,
      data: filteredData,
      description: `${config.description} (${filteredData.length} سجل - ${facultyName || facultyId})`
    };
  }

  return {
    ...config,
    data: finalData
  };
};

// ==================================================================================
// REAL-TIME STATISTICS FUNCTIONS
// ==================================================================================

// Get real student statistics for a specific faculty
export const getStudentStatistics = (facultyId?: string | null) => {
  const targetStudents = facultyId
    ? ALL_STUDENTS.filter((s: any) => s.faculty_code === facultyId)
    : ALL_STUDENTS;

  // Count students by level
  const levelStats = [
    { name: 'المستوى الأول', students: targetStudents.filter(s => s.level === 'المستوى الأول').length },
    { name: 'المستوى الثاني', students: targetStudents.filter(s => s.level === 'المستوى الثاني').length },
    { name: 'المستوى الثالث', students: targetStudents.filter(s => s.level === 'المستوى الثالث').length },
    { name: 'المستوى الرابع', students: targetStudents.filter(s => s.level === 'المستوى الرابع').length },
  ];

  // Count students by fees status
  const paidStudents = targetStudents.filter(s => s.fees_status === 'مسدد').length;
  const unpaidStudents = targetStudents.filter(s => s.fees_status === 'غير مسدد').length;

  const feesStats = [
    { name: 'مسدد', value: paidStudents },
    { name: 'غير مسدد', value: unpaidStudents },
  ];

  // Count students by status
  const activeStudents = targetStudents.filter(s => s.status === 'مقيد').length;
  const graduatedStudents = targetStudents.filter(s => s.status === 'خريج').length;
  const suspendedStudents = targetStudents.filter(s => s.status === 'موقوف').length;
  const expelledStudents = targetStudents.filter(s => s.status === 'مفصول').length;

  // Calculate financial stats (assuming average fee of 2000 EGP per student)
  const averageFee = 2000;
  const totalRevenue = paidStudents * averageFee;
  const paymentRate = targetStudents.length > 0 ? Math.round((paidStudents / targetStudents.length) * 100) : 0;

  return {
    totalStudents: targetStudents.length,
    levelStats,
    feesStats,
    activeStudents,
    graduatedStudents,
    suspendedStudents,
    expelledStudents,
    totalRevenue,
    paymentRate,
    paidStudents,
    unpaidStudents
  };
};

// Get department statistics for FCAI
export const getDepartmentStatistics = () => {
  const departmentStats = DEPARTMENTS_FCAI.map(dept => {
    const deptCode = dept.split('(')[1]?.replace(')', '') || dept;
    const studentsInDept = FCAI_STUDENTS.filter(s => s.department === deptCode).length;
    return {
      name: dept,
      students: studentsInDept
    };
  });

  return departmentStats;
};

// Function to add new room assignment
export const addRoomAssignment = (assignmentData: any) => {
  const newAssignment = {
    id: CLASSROOM_ASSIGNMENTS.length + 1,
    ...assignmentData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  CLASSROOM_ASSIGNMENTS.push(newAssignment);

  // Update the page config data to reflect the new assignment
  const assignRoomConfig = MOCK_DATABASE['assign_room'];
  if (assignRoomConfig) {
    assignRoomConfig.data = CLASSROOM_ASSIGNMENTS.map((assignment, index) => ({
      id: index + 1,
      ...assignment,
      actions: 'تعديل | حذف'
    }));
    assignRoomConfig.description = `توزيع المقررات على القاعات الدراسية المتاحة (${CLASSROOM_ASSIGNMENTS.length} تخصيص)`;
  }

  return newAssignment;
};

// Function to get current room assignments
export const getRoomAssignments = () => {
  return CLASSROOM_ASSIGNMENTS;
};

// Export student arrays for direct access


// ==================================================================================
// ACADEMIC STRUCTURE DATABASE
// ==================================================================================

// In-memory database for academic structure
let ACADEMIC_FACULTIES_DB: AcademicFaculty[] = [];
let ACADEMIC_DEPARTMENTS_DB: AcademicDepartment[] = [];
let ACADEMIC_PROGRAMS_DB: AcademicProgram[] = [];
let ACADEMIC_REGULATIONS_DB: StudyRegulation[] = [];
let ACADEMIC_COURSES_DB: AcademicCourse[] = [];

// Load from localStorage on initialization
const loadAcademicDataFromStorage = () => {
  try {
    const savedFaculties = localStorage.getItem('academicFaculties');
    const savedDepartments = localStorage.getItem('academicDepartments');
    const savedPrograms = localStorage.getItem('academicPrograms');
    const savedRegulations = localStorage.getItem('academicRegulations');
    const savedCourses = localStorage.getItem('academicCourses');

    if (savedFaculties) ACADEMIC_FACULTIES_DB = JSON.parse(savedFaculties);
    if (savedDepartments) ACADEMIC_DEPARTMENTS_DB = JSON.parse(savedDepartments);
    if (savedPrograms) ACADEMIC_PROGRAMS_DB = JSON.parse(savedPrograms);
    if (savedRegulations) ACADEMIC_REGULATIONS_DB = JSON.parse(savedRegulations);
    if (savedCourses) ACADEMIC_COURSES_DB = JSON.parse(savedCourses);
  } catch (error) {
    console.error('Error loading academic data from storage:', error);
  }
};

// Initialize default data from academic rules if no data exists
const initializeDefaultAcademicData = () => {
  // Check if we have any saved data
  const hasSavedData = localStorage.getItem('academicDepartments') || 
                       localStorage.getItem('academicPrograms') || 
                       localStorage.getItem('academicRegulations') || 
                       localStorage.getItem('academicCourses');
  
  if (hasSavedData) return; // Don't initialize if data already exists
  
  // Get academic rules to extract structure
  const savedRules = localStorage.getItem('academicRules');
  if (!savedRules) return;
  
  try {
    const rules: AcademicRules[] = JSON.parse(savedRules);
    
    rules.forEach(rule => {
      if (!rule.studySystem?.graduationRequirementsDetails?.majorRequirements?.programs) return;
      
      const facultyId = rule.facultyId;
      const programs = rule.studySystem.graduationRequirementsDetails.majorRequirements.programs;
      
      // Create departments from programs
      Object.keys(programs).forEach(programCode => {
        const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
        if (!programData) return;
        
        // Check if department already exists
        const deptCode = programCode;
        const existingDept = ACADEMIC_DEPARTMENTS_DB.find(d => d.code === deptCode && d.facultyId === facultyId);
        
        if (!existingDept) {
          const programId = `PROG-${facultyId}-${deptCode}-${Date.now()}`;
          
          const department: AcademicDepartment = {
            id: `DEPT-${facultyId}-${deptCode}-${Date.now()}`,
            name: programData.name,
            nameEn: programData.nameEn,
            code: deptCode,
            facultyId: facultyId,
            headId: '',
            headName: '',
            programs: [programId],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          ACADEMIC_DEPARTMENTS_DB.push(department);
          
          // Create program for this department
          const program: AcademicProgram = {
            id: programId,
            name: programData.name,
            nameEn: programData.nameEn,
            code: deptCode,
            departmentId: department.id,
            degree: 'بكالوريوس',
            totalHours: 140,
            mandatoryHours: (programData.mandatory || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0),
            electiveHours: (programData.elective || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0),
            universityRequirements: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          ACADEMIC_PROGRAMS_DB.push(program);
          
          // Create regulation for this program
          const regulation: StudyRegulation = {
            id: `REG-${facultyId}-${deptCode}-${Date.now()}`,
            name: `لائحة ${programData.name}`,
            programId: program.id,
            registrationRules: '',
            passFailRules: '',
            absencePolicy: '',
            mandatoryHours: program.mandatoryHours,
            electiveHours: program.electiveHours,
            universityRequirements: program.universityRequirements,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          ACADEMIC_REGULATIONS_DB.push(regulation);
          
          // Create courses from program requirements
          const allCourses = [
            ...(programData.mandatory || []),
            ...(programData.elective || [])
          ];
          
          allCourses.forEach((courseData, idx) => {
            const course: AcademicCourse = {
              id: `COURSE-${facultyId}-${deptCode}-${courseData.code}-${Date.now()}-${idx}`,
              code: courseData.code,
              name: courseData.name,
              nameEn: courseData.nameEn,
              departmentId: department.id,
              departmentName: department.name,
              programId: program.id,
              programName: program.name,
              theoreticalHours: courseData.theoreticalHours || 3,
              practicalHours: courseData.practicalHours || 2,
              totalHours: (courseData.theoreticalHours || 3) + (courseData.practicalHours || 2),
              prerequisites: courseData.prerequisites || [],
              level: 3, // Default level, can be adjusted
              semester: 'خريف',
              type: idx < (programData.mandatory?.length || 0) ? 'إجباري' : 'اختياري',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            ACADEMIC_COURSES_DB.push(course);
          });
        }
      });
    });
    
    // Save initialized data
    saveToStorage('academicDepartments', ACADEMIC_DEPARTMENTS_DB);
    saveToStorage('academicPrograms', ACADEMIC_PROGRAMS_DB);
    saveToStorage('academicRegulations', ACADEMIC_REGULATIONS_DB);
    saveToStorage('academicCourses', ACADEMIC_COURSES_DB);
  } catch (error) {
    console.error('Error initializing default academic data:', error);
  }
};

// Save to localStorage helper (must be defined before use)
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Initialize on module load
loadAcademicDataFromStorage();
// Initialize default data after loading from storage
initializeDefaultAcademicData();

// ==================================================================================
// ACADEMIC FACULTIES CRUD
// ==================================================================================

export const getAcademicFaculties = (): AcademicFaculty[] => {
  return [...ACADEMIC_FACULTIES_DB];
};

export const saveAcademicFaculty = (faculty: AcademicFaculty): void => {
  const existingIndex = ACADEMIC_FACULTIES_DB.findIndex(f => f.id === faculty.id);
  if (existingIndex >= 0) {
    ACADEMIC_FACULTIES_DB[existingIndex] = faculty;
  } else {
    ACADEMIC_FACULTIES_DB.push(faculty);
  }
  saveToStorage('academicFaculties', ACADEMIC_FACULTIES_DB);
};

export const deleteAcademicFaculty = (facultyId: string): void => {
  ACADEMIC_FACULTIES_DB = ACADEMIC_FACULTIES_DB.filter(f => f.id !== facultyId);
  saveToStorage('academicFaculties', ACADEMIC_FACULTIES_DB);
};

// ==================================================================================
// ACADEMIC DEPARTMENTS CRUD
// ==================================================================================

export const getAcademicDepartments = (): AcademicDepartment[] => {
  return [...ACADEMIC_DEPARTMENTS_DB];
};

export const saveAcademicDepartment = (department: AcademicDepartment): void => {
  const existingIndex = ACADEMIC_DEPARTMENTS_DB.findIndex(d => d.id === department.id);
  if (existingIndex >= 0) {
    ACADEMIC_DEPARTMENTS_DB[existingIndex] = department;
  } else {
    ACADEMIC_DEPARTMENTS_DB.push(department);
  }
  saveToStorage('academicDepartments', ACADEMIC_DEPARTMENTS_DB);
};

export const deleteAcademicDepartment = (departmentId: string): void => {
  ACADEMIC_DEPARTMENTS_DB = ACADEMIC_DEPARTMENTS_DB.filter(d => d.id !== departmentId);
  saveToStorage('academicDepartments', ACADEMIC_DEPARTMENTS_DB);
};

// ==================================================================================
// ACADEMIC PROGRAMS CRUD
// ==================================================================================

export const getAcademicPrograms = (): AcademicProgram[] => {
  return [...ACADEMIC_PROGRAMS_DB];
};

export const saveAcademicProgram = (program: AcademicProgram): void => {
  const existingIndex = ACADEMIC_PROGRAMS_DB.findIndex(p => p.id === program.id);
  if (existingIndex >= 0) {
    ACADEMIC_PROGRAMS_DB[existingIndex] = program;
  } else {
    ACADEMIC_PROGRAMS_DB.push(program);
  }
  saveToStorage('academicPrograms', ACADEMIC_PROGRAMS_DB);
};

export const deleteAcademicProgram = (programId: string): void => {
  ACADEMIC_PROGRAMS_DB = ACADEMIC_PROGRAMS_DB.filter(p => p.id !== programId);
  saveToStorage('academicPrograms', ACADEMIC_PROGRAMS_DB);
};

// ==================================================================================
// ACADEMIC REGULATIONS CRUD
// ==================================================================================

export const getAcademicRegulations = (): StudyRegulation[] => {
  return [...ACADEMIC_REGULATIONS_DB];
};

export const saveAcademicRegulation = (regulation: StudyRegulation): void => {
  const existingIndex = ACADEMIC_REGULATIONS_DB.findIndex(r => r.id === regulation.id);
  if (existingIndex >= 0) {
    ACADEMIC_REGULATIONS_DB[existingIndex] = regulation;
  } else {
    ACADEMIC_REGULATIONS_DB.push(regulation);
  }
  saveToStorage('academicRegulations', ACADEMIC_REGULATIONS_DB);
};

export const deleteAcademicRegulation = (regulationId: string): void => {
  ACADEMIC_REGULATIONS_DB = ACADEMIC_REGULATIONS_DB.filter(r => r.id !== regulationId);
  saveToStorage('academicRegulations', ACADEMIC_REGULATIONS_DB);
};

// ==================================================================================
// ACADEMIC COURSES CRUD
// ==================================================================================

export const getAcademicCourses = (): AcademicCourse[] => {
  return [...ACADEMIC_COURSES_DB];
};

export const saveAcademicCourse = (course: AcademicCourse): void => {
  const existingIndex = ACADEMIC_COURSES_DB.findIndex(c => c.id === course.id);
  if (existingIndex >= 0) {
    ACADEMIC_COURSES_DB[existingIndex] = course;
  } else {
    ACADEMIC_COURSES_DB.push(course);
  }
  saveToStorage('academicCourses', ACADEMIC_COURSES_DB);
};

export const deleteAcademicCourse = (courseId: string): void => {
  ACADEMIC_COURSES_DB = ACADEMIC_COURSES_DB.filter(c => c.id !== courseId);
  saveToStorage('academicCourses', ACADEMIC_COURSES_DB);
};

// ==================================================================================
// ACADEMIC RULES MANAGEMENT
// ==================================================================================
export const getAcademicRules = (facultyId?: string): AcademicRules[] => {
  const stored = localStorage.getItem('academicRules');
  const rules: AcademicRules[] = stored ? JSON.parse(stored) : [];
  if (facultyId) {
    return rules.filter(r => r.facultyId === facultyId);
  }
  return rules;
};

export const getAcademicRulesByFaculty = (facultyId: string): AcademicRules | null => {
  const rules = getAcademicRules();
  const foundRule = rules.find(r => r.facultyId === facultyId);
  
  if (!foundRule) {
    console.log(`[getAcademicRulesByFaculty] No rules found for faculty: ${facultyId}`);
    return null;
  }
  
  // Debug: Log courses count
  const programs = foundRule.studySystem?.graduationRequirementsDetails?.majorRequirements?.programs;
  if (programs) {
    Object.keys(programs).forEach(programCode => {
      const programData = programs[programCode as 'CS' | 'IT' | 'IS'];
      if (programData) {
        console.log(`[getAcademicRulesByFaculty] ${programCode}: ${programData.mandatory?.length || 0} mandatory, ${programData.elective?.length || 0} elective`);
      }
    });
  }
  
  return foundRule;
};

export const saveAcademicRules = (rules: AcademicRules): void => {
  const allRules = getAcademicRules();
  const existingIndex = allRules.findIndex(r => r.id === rules.id);
  
  if (existingIndex >= 0) {
    allRules[existingIndex] = { ...rules, updatedAt: new Date().toISOString() };
  } else {
    allRules.push({ ...rules, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  
  localStorage.setItem('academicRules', JSON.stringify(allRules));
};

export const deleteAcademicRules = (rulesId: string): void => {
  const rules = getAcademicRules();
  const filtered = rules.filter(r => r.id !== rulesId);
  localStorage.setItem('academicRules', JSON.stringify(filtered));
};

// Create default rules based on the provided structure
export const createDefaultAcademicRules = (facultyId: string, facultyName: string): AcademicRules => {
  return {
    id: `RULES-${facultyId}-${Date.now()}`,
    facultyId,
    facultyName,
    studySystem: {
      creditHoursSystem: true,
      academicYearStructure: {
        fallSemester: { weeks: 17 },
        springSemester: { weeks: 17 },
        summerSemester: { weeks: 8, enabled: true }
      },
      creditHourStandard: {
        theoretical: 1,
        practical: 2,
        summerTraining: 3
      },
      hybridLearning: {
        enabled: false,
        practicalCourses: {
          faceToFace: { min: 60, max: 70 },
          online: { min: 30, max: 40 }
        },
        theoreticalCourses: {
          faceToFace: { min: 50, max: 60 },
          online: { min: 40, max: 50 }
        }
      },
      electronicExams: {
        enabled: false,
        onCampus: true,
        graduationProjects: false
      },
      graduationRequirements: {
        totalCreditHours: 140,
        minimumGPA: 2.0,
        minimumYears: 3,
        includesUniversityRequirements: true,
        includesFacultyRequirements: true,
        includesMajorRequirements: true
      },
      specializationStart: {
        level: 3,
        sharedLevels: [1, 2]
      },
      levelProgression: {
        level1: {
          name: 'Freshman',
          maxCreditHours: 30,
          description: 'يقيد الطالب عند التحاقه بالكلية ويظل مقيداً بالمستوى الأول طالما لم يجتاز 30 ساعة معتمدة'
        },
        level2: {
          name: 'Sophomore',
          requiredCreditHours: 30,
          description: 'ينتقل الطالب من المستوى الأول للمستوى الثاني عند اجتيازه 30 ساعة معتمدة'
        },
        level3: {
          name: 'Junior',
          requiredCreditHours: 66,
          description: 'ينتقل الطالب من المستوى الثاني للمستوى الثالث عند اجتيازه 66 ساعة معتمدة',
          specializationRequired: true
        },
        level4: {
          name: 'Senior',
          requiredCreditHours: 102,
          description: 'ينتقل الطالب من المستوى الثالث للمستوى الرابع عند اجتيازه 102 ساعة معتمدة'
        }
      },
      studyPlan: {
        commonLevels: {
          level1: {
            fall: [
              { code: 'UNV101', name: 'القضايا المجتمعية', nameEn: 'Societal issues', theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: 'mandatory', category: 'متطلبات الجامعة' },
              { code: 'UNV105', name: 'مهارات التواصل والعرض الفعال', nameEn: 'Effective Communication and Presentation Skills', theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: 'mandatory', category: 'متطلبات الجامعة' },
              { code: 'BS101', name: 'الرياضيات في علوم الحاسب', nameEn: 'Mathematics in Computer Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'العلوم الأساسية' },
              { code: 'CS101', name: 'أساسيات علوم الحاسب', nameEn: 'Computer Science Fundamentals', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'CS102', name: 'البرمجة الهيكلية', nameEn: 'Structured Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'IT101', name: 'إلكترونيات', nameEn: 'Electronics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'العلوم الأساسية' },
              { code: 'XX', name: 'مقرر اختياري أساسي (1)', nameEn: 'Elective Basic Course (1)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective', category: 'العلوم الأساسية' }
            ],
            spring: [
              { code: 'UNV102', name: 'لغة انجليزية', nameEn: 'English Language', theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: 'mandatory', category: 'متطلبات الجامعة' },
              { code: 'UNV103', name: 'الكتابة العلمية والفنية', nameEn: 'Technical and Scientific Writing', theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: 'mandatory', category: 'متطلبات الجامعة' },
              { code: 'BS102', name: 'تراكيب محددة', nameEn: 'Discrete Structures', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'العلوم الأساسية' },
              { code: 'BS103', name: 'الجبر الخطي', nameEn: 'Linear Algebra', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'العلوم الأساسية' },
              { code: 'BS104', name: 'تطبيقات الاحتمالات والإحصاء فى الحاسب', nameEn: 'Probability and Statistics Applications in Computer', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'العلوم الأساسية' },
              { code: 'CS103', name: 'البرمجة الشيئية', nameEn: 'Object Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'XX', name: 'مقرر اختياري أساسي (2)', nameEn: 'Elective Basic Course (2)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective', category: 'العلوم الأساسية' }
            ]
          },
          level2: {
            fall: [
              { code: 'UNV104', name: 'الذكاء الاصطناعي والتحول الرقمى في المجتمع', nameEn: 'Artificial Intelligence and Digital Transformation in Society', theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: 'mandatory', category: 'متطلبات الجامعة' },
              { code: 'IS201', name: 'مقدمة في نظم المعلومات', nameEn: 'Introduction to Information Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'IT202', name: 'تراسل البيانات', nameEn: 'Data Communication', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'CS204', name: 'تصميم منطقي', nameEn: 'Logic Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'CS205', name: 'هياكل البيانات', nameEn: 'Data Structures', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'], type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'XX', name: 'مقرر اختياري كلية (1)', nameEn: 'Elective Faculty Course (1)', theoreticalHours: 3, practicalHours: 0, creditHours: 3, type: 'elective', category: 'متطلبات الكلية' }
            ],
            spring: [
              { code: 'IS202', name: 'نظم قواعد البيانات', nameEn: 'Database Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS101'], type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'IS203', name: 'تحليل وتصميم النظم', nameEn: 'Systems Analysis and Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'], type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'IT203', name: 'شبكات الحاسب', nameEn: 'Computer Networks', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT202'], type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'CS206', name: 'مقدمة في الذكاء الاصطناعي', nameEn: 'Introduction to Artificial Intelligence', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'], type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'CS207', name: 'نظم التشغيل', nameEn: 'Operating Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS101'], type: 'mandatory', category: 'متطلبات الكلية' },
              { code: 'XX', name: 'مقرر اختياري كلية (2)', nameEn: 'Elective Faculty Course (2)', theoreticalHours: 3, practicalHours: 0, creditHours: 3, type: 'elective', category: 'متطلبات الكلية' }
            ]
          }
        },
        programLevels: {
          CS: {
            level3: {
              fall: [
                { code: 'IT305', name: 'إشارات ونظم', nameEn: 'Signals and Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT202'], type: 'mandatory' },
                { code: 'CS308', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory' },
                { code: 'CS309', name: 'الحوسبة المرنة', nameEn: 'Soft Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'], type: 'mandatory' },
                { code: 'CS310', name: 'تصميم المترجمات', nameEn: 'Compilers Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'], type: 'mandatory' },
                { code: 'CS311', name: 'تصميم وتحليل خوارزميات', nameEn: 'Design and Analysis of Algorithms', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري علوم حاسب (1)', nameEn: 'Elective Computer Science (1)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ],
              spring: [
                { code: 'CS312', name: 'بنية وتنظيم الحاسب', nameEn: 'Computer Architecture and Organization', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS204'], type: 'mandatory' },
                { code: 'CS313', name: 'تعلم الآلة', nameEn: 'Machine Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'CS314', name: 'معالجة الصور', nameEn: 'Image Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'CS315', name: 'الرسم بالحاسب', nameEn: 'Computer Graphics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'], type: 'mandatory' },
                { code: 'CS429', name: 'التشفير', nameEn: 'Cryptography', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS102'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري علوم حاسب (2)', nameEn: 'Elective Computer Science (2)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ]
            },
            level4: {
              fall: [
                { code: 'CS430', name: 'الحوسبة المتوازية والموزعة', nameEn: 'Parallel and Distributed Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'], type: 'mandatory' },
                { code: 'CS431', name: 'النمذجة والمحاكاة', nameEn: 'Modeling and Simulation', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS311'], type: 'mandatory' },
                { code: 'CS432', name: 'الرؤية بالحاسب', nameEn: 'Computer Vision', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'PR401', name: 'مشروع التخرج', nameEn: 'Project', theoreticalHours: 4, practicalHours: 0, creditHours: 4, prerequisites: ['Pass (102) Credit hours'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري علوم حاسب (3)', nameEn: 'Elective Computer Science (3)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ],
              spring: [
                { code: 'CS433', name: 'الحوسبة السحابية', nameEn: 'Cloud Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'CS434', name: 'التعرف على الأنماط', nameEn: 'Pattern Recognition', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS313'], type: 'mandatory' },
                { code: 'CS435', name: 'التطبيقات الذكية', nameEn: 'Smart Applications', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'], type: 'mandatory' },
                { code: 'PR401', name: 'مشروع التخرج', nameEn: 'Project', theoreticalHours: 0, practicalHours: 0, creditHours: 0, type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري علوم حاسب (4)', nameEn: 'Elective Computer Science (4)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ]
            }
          },
          IT: {
            level3: {
              fall: [
                { code: 'IT305', name: 'إشارات ونظم', nameEn: 'Signals and Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT202'], type: 'mandatory' },
                { code: 'IT306', name: 'شبكات الحاسب المتقدمة', nameEn: 'Advanced Computer Networks', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'IT307', name: 'الوسائط المتعددة', nameEn: 'Multimedia', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'], type: 'mandatory' },
                { code: 'CS308', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory' },
                { code: 'IS429', name: 'تطوير تطبيقات الهاتف المحمول', nameEn: 'Mobile Applications Development', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري تكنولوجيا معلومات (1)', nameEn: 'Elective IT (1)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ],
              spring: [
                { code: 'IT308', name: 'تأمين شبكات الحاسب الآلي', nameEn: 'Computer Network Security', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'IT309', name: 'معالجة الإشارات الرقمية', nameEn: 'Digital Signal Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS101'], type: 'mandatory' },
                { code: 'IT312', name: 'أساسيات أنظمة الروبوت', nameEn: 'Fundamentals of Robotic systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS212'], type: 'mandatory' },
                { code: 'CS313', name: 'تعلم الآلة', nameEn: 'Machine Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'CS314', name: 'معالجة الصور', nameEn: 'Image Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري تكنولوجيا معلومات (2)', nameEn: 'Elective IT (2)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ]
            },
            level4: {
              fall: [
                { code: 'IT415', name: 'الشبكات اللاسلكية المتحركة', nameEn: 'Wireless and Mobile Networks', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'IT416', name: 'الواقع الافتراضي والمعزز', nameEn: 'Virtual and Augmented Reality', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'IT417', name: 'برمجة الشبكات', nameEn: 'Network Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'PR402', name: 'مشروع التخرج', nameEn: 'Project', theoreticalHours: 4, practicalHours: 0, creditHours: 4, prerequisites: ['Pass (102) Credit hours'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري تكنولوجيا معلومات (3)', nameEn: 'Elective IT (3)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ],
              spring: [
                { code: 'IT418', name: 'النظم المدمجة', nameEn: 'Embedded Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'], type: 'mandatory' },
                { code: 'IT423', name: 'انترنت الأشياء', nameEn: 'Internet of Things', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'CS433', name: 'الحوسبة السحابية', nameEn: 'Cloud Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'PR402', name: 'مشروع التخرج', nameEn: 'Project', theoreticalHours: 0, practicalHours: 0, creditHours: 0, type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري تكنولوجيا معلومات (4)', nameEn: 'Elective IT (4)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ]
            }
          },
          IS: {
            level3: {
              fall: [
                { code: 'CS308', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'mandatory' },
                { code: 'IS309', name: 'تأمين المعلومات', nameEn: 'Information Security', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'], type: 'mandatory' },
                { code: 'IS310', name: 'تخزين واسترجاع المعلومات', nameEn: 'Information Storage and Retrieval', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'], type: 'mandatory' },
                { code: 'IS311', name: 'التنقيب عن البيانات', nameEn: 'Data Mining', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'], type: 'mandatory' },
                { code: 'IS314', name: 'نظم قواعد البيانات المتقدمة', nameEn: 'Advanced Database Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري نظم معلومات (1)', nameEn: 'Elective Information Systems (1)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ],
              spring: [
                { code: 'IS312', name: 'نظم المعلومات الذكية', nameEn: 'Intelligent Information Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'], type: 'mandatory' },
                { code: 'IS313', name: 'تحليل وتصميم النظم المتقدمة', nameEn: 'Advanced Systems analysis and Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS203'], type: 'mandatory' },
                { code: 'CS313', name: 'تعلم الآلة', nameEn: 'Machine Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'IS425', name: 'قواعد البيانات الموزعة', nameEn: 'Distributed Databases', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS308'], type: 'mandatory' },
                { code: 'IS426', name: 'تحليل البيانات الكبيرة', nameEn: 'Big Data Analytics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري نظم معلومات (2)', nameEn: 'Elective Information Systems (2)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ]
            },
            level4: {
              fall: [
                { code: 'IS427', name: 'نظم المعلومات الجغرافية', nameEn: 'Geographical Information Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'], type: 'mandatory' },
                { code: 'IS428', name: 'نظم دعم القرار الذكي', nameEn: 'Intelligent Decision Support Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'], type: 'mandatory' },
                { code: 'IS429', name: 'تطوير تطبيقات الهاتف المحمول', nameEn: 'Mobile Applications Development', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'], type: 'mandatory' },
                { code: 'IS430', name: 'العرض المرئي للبيانات', nameEn: 'Data Visualization', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'], type: 'mandatory' },
                { code: 'PR403', name: 'مشروع التخرج', nameEn: 'Project', theoreticalHours: 4, practicalHours: 0, creditHours: 4, prerequisites: ['Pass (102) Credit hours'], type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري نظم معلومات (3)', nameEn: 'Elective Information Systems (3)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ],
              spring: [
                { code: 'CS433', name: 'الحوسبة السحابية', nameEn: 'Cloud Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'], type: 'mandatory' },
                { code: 'CS437', name: 'علم البيانات', nameEn: 'Data Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'], type: 'mandatory' },
                { code: 'PR403', name: 'مشروع التخرج', nameEn: 'Project', theoreticalHours: 0, practicalHours: 0, creditHours: 0, type: 'mandatory' },
                { code: 'XX', name: 'مقرر اختياري نظم معلومات (4)', nameEn: 'Elective Information Systems (4)', theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: 'elective' }
              ]
            }
          }
        }
      },
      graduationRequirementsDetails: {
        universityRequirements: {
          totalHours: 10,
          percentage: 7.14,
          percentageRange: { min: 8, max: 10 },
          notCountedInCGPA: true,
          courses: [
            { code: 'UNV101', name: 'القضايا المجتمعية', nameEn: 'Societal issues', theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: 'UNV102', name: 'لغة انجليزية', nameEn: 'English Language', theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: 'UNV103', name: 'الكتابة العلمية والفنية', nameEn: 'Technical and Scientific Writing', theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: 'UNV104', name: 'الذكاء الاصطناعي والتحول الرقمى في المجتمع', nameEn: 'Artificial Intelligence and Digital Transformation in Society', theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: 'UNV105', name: 'مهارات التواصل والعرض الفعال', nameEn: 'Effective Communication and Presentation Skills', theoreticalHours: 2, practicalHours: 0, creditHours: 2 }
          ]
        },
        basicSciences: {
          totalHours: 21,
          mandatoryHours: 15,
          electiveHours: 6,
          percentage: 15,
          percentageRange: { min: 16, max: 18 },
          courses: {
            mandatory: [
              { code: 'BS101', name: 'الرياضيات في علوم الحاسب', nameEn: 'Mathematics in Computer Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'IT101', name: 'إلكترونيات', nameEn: 'Electronics', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'BS102', name: 'تراكيب محددة', nameEn: 'Discrete Structures', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'BS103', name: 'الجبر الخطي', nameEn: 'Linear Algebra', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'BS104', name: 'تطبيقات الاحتمالات والإحصاء فى الحاسب', nameEn: 'Probability and Statistics Applications in Computer', theoreticalHours: 3, practicalHours: 2, creditHours: 2 }
            ],
            elective: [
              { code: 'BS105', name: 'مقدمة في الفيزياء', nameEn: 'Introduction to Physics', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'BS206', name: 'معادلات الفروق والمعادلات التفاضلية', nameEn: 'Difference & Differential Equations', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS101'] },
              { code: 'BS207', name: 'تحليل عددي', nameEn: 'Numerical Analysis', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS101'] },
              { code: 'BS208', name: 'تطبيقات الاحتمالات والإحصاء المتقدمة فى الحاسب', nameEn: 'Advanced Probability and Statistics Applications in Computer', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
              { code: 'BS209', name: 'بحوث عمليات', nameEn: 'Operations Research', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
              { code: 'BS212', name: 'التفكير العلمي والإبداعي', nameEn: 'Scientific and Creative Thinking', theoreticalHours: 3, practicalHours: 0, creditHours: 3 },
              { code: 'BS213', name: 'تسويق ومبيعات', nameEn: 'Marketing and Sales', theoreticalHours: 3, practicalHours: 0, creditHours: 3 },
              { code: 'BS214', name: 'الرياضيات الحاسوبية للتعلم وعلوم البيانات', nameEn: 'Computational Mathematics for learning and Data Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS102'] }
            ]
          }
        },
        facultyRequirements: {
          totalHours: 45,
          mandatoryHours: 39,
          electiveHours: 6,
          percentage: 32.14,
          percentageRange: { min: 32, max: 36 },
          courses: {
            mandatory: [
              { code: 'CS101', name: 'أساسيات علوم الحاسب', nameEn: 'Computer Science Fundamentals', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'IS201', name: 'مقدمة في نظم المعلومات', nameEn: 'Introduction to Information Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'CS102', name: 'البرمجة الهيكلية', nameEn: 'Structured Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'CS103', name: 'البرمجة الشيئية', nameEn: 'Object Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'IS202', name: 'نظم قواعد البيانات', nameEn: 'Database Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS101'] },
              { code: 'IT202', name: 'تراسل البيانات', nameEn: 'Data Communication', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'IS203', name: 'تحليل وتصميم النظم', nameEn: 'Systems Analysis and Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'] },
              { code: 'IT203', name: 'شبكات الحاسب', nameEn: 'Computer Networks', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT202'] },
              { code: 'CS204', name: 'تصميم منطقي', nameEn: 'Logic Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'CS205', name: 'هياكل البيانات', nameEn: 'Data Structures', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
              { code: 'CS206', name: 'مقدمة في الذكاء الاصطناعي', nameEn: 'Introduction to Artificial Intelligence', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
              { code: 'CS207', name: 'نظم التشغيل', nameEn: 'Operating Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS101'] },
              { code: 'CS308', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', theoreticalHours: 3, practicalHours: 2, creditHours: 2 }
            ],
            elective: [
              { code: 'IT204', name: 'تكنولوجيا الإنترنت', nameEn: 'Internet Technology', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
              { code: 'IS204', name: 'برمجة الويب', nameEn: 'Web Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
              { code: 'IS205', name: 'إدارة مشاريع البرمجيات', nameEn: 'Software Project Management', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'IS206', name: 'تطوير المنتجات الجديدة والابتكار', nameEn: 'New Product Development and Innovation', theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: 'IS207', name: 'ابتكار نظم المعلومات والتقنيات الجديدة', nameEn: 'IS Innovation and New Technologies', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'] },
              { code: 'BS211', name: 'الأخلاق المهنية لعلوم الحاسب', nameEn: 'Professional Ethics for Computer Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2 }
            ]
          }
        },
        majorRequirements: {
          totalHours: 57,
          mandatoryHours: 45,
          electiveHours: 12,
          percentage: 40.71,
          percentageRange: { min: 34, max: 40 },
          programs: {
            CS: {
              name: 'علوم الحاسب',
              nameEn: 'Computer Science',
              mandatory: [
                { code: 'IT305', name: 'إشارات ونظم', nameEn: 'Signals and Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT202'] },
                { code: 'CS309', name: 'الحوسبة المرنة', nameEn: 'Soft Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'CS310', name: 'تصميم المترجمات', nameEn: 'Compilers Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'CS311', name: 'تصميم وتحليل خوارزميات', nameEn: 'Design and Analysis of Algorithms', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'CS312', name: 'بنية وتنظيم الحاسب', nameEn: 'Computer Architecture and Organization', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS204'] },
                { code: 'CS313', name: 'تعلم الآلة', nameEn: 'Machine Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'CS314', name: 'معالجة الصور', nameEn: 'Image Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS103'] },
                { code: 'CS315', name: 'الرسم بالحاسب', nameEn: 'Computer Graphics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'CS429', name: 'التشفير', nameEn: 'Cryptography', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS102'] },
                { code: 'CS430', name: 'الحوسبة المتوازية والموزعة', nameEn: 'Parallel and Distributed Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'CS431', name: 'النمذجة والمحاكاة', nameEn: 'Modeling and Simulation', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS311'] },
                { code: 'CS432', name: 'الرؤية بالحاسب', nameEn: 'Computer Vision', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'CS433', name: 'الحوسبة السحابية', nameEn: 'Cloud Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'CS434', name: 'التعرف على الأنماط', nameEn: 'Pattern Recognition', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS313'] },
                { code: 'CS435', name: 'التطبيقات الذكية', nameEn: 'Smart Applications', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] }
              ],
              elective: [
                { code: 'IT307', name: 'الوسائط المتعددة', nameEn: 'Multimedia', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'IT309', name: 'معالجة الإشارات الرقمية', nameEn: 'Digital Signal Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS101'] },
                { code: 'IS309', name: 'تأمين المعلومات', nameEn: 'Information Security', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
                { code: 'IT310', name: 'نظم الوقت الحقيقي', nameEn: 'Real Time Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS207'] },
                { code: 'IS311', name: 'التنقيب عن البيانات', nameEn: 'Data Mining', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IT312', name: 'أساسيات أنظمة الروبوتات', nameEn: 'Fundamentals of Robotic systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'IT313', name: 'واجهات الحاسب', nameEn: 'Computer Interfaces', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS207'] },
                { code: 'CS316', name: 'نظم التشغيل المتقدم', nameEn: 'Advanced Operating Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS207'] },
                { code: 'CS317', name: 'الذكاء الاصطناعي المتقدم', nameEn: 'Advanced Artificial Intelligence', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'CS318', name: 'البرمجة المنطقية', nameEn: 'Logic Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS102'] },
                { code: 'CS319', name: 'هندسة البرمجيات المتقدمة', nameEn: 'Advanced Software Engineering', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS308'] },
                { code: 'IS321', name: 'اختبار وضمان جودة البرمجيات', nameEn: 'Software Quality Testing and Assurance', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS308'] },
                { code: 'IS322', name: 'تقدير تكاليف تطوير وصيانة مشاريع البرمجيات', nameEn: 'Estimating Costs for Developing and Maintaining Software Projects', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS308'] },
                { code: 'CS320', name: 'المعالجات الدقيقة ولغة التجميع', nameEn: 'Microprocessors and Assembly Language', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'CS321', name: 'الذكاء التطوري والسرب', nameEn: 'Evolutionary and Swarm Intelligence', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'IS323', name: 'تطبيقات الويب', nameEn: 'Web Applications', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS204'] },
                { code: 'CS322', name: 'النماذج الرسومية الاحتمالية', nameEn: 'Probabilistic Graphical Models', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
                { code: 'CS323', name: 'صنع القرار في ظل عدم اليقين', nameEn: 'Decision Making under Uncertainty', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'CS324', name: 'تعلم الآلة المتقدم', nameEn: 'Advanced Machine Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS313'] },
                { code: 'CS325', name: 'النماذج العميقة التوليدية', nameEn: 'Deep Generative Models', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'CS326', name: 'التعلم المعزز', nameEn: 'Reinforcement Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'CS327', name: 'البرمجة لحل المشكلات', nameEn: 'Programming for Problem Solving', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'CS328', name: 'النمذجة القائمة على الوكيل', nameEn: 'Agent-Based Modelling', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'IT416', name: 'الواقع الافتراضي والمعزز', nameEn: 'Virtual and Augmented Reality', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'IT418', name: 'النظم المدمجة', nameEn: 'Embedded Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'IT420', name: 'الوسائط المتعددة المتقدمة', nameEn: 'Advanced Multimedia', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT307'] },
                { code: 'IT423', name: 'انترنت الأشياء', nameEn: 'Internet of Things', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IS426', name: 'تحليل البيانات الكبيرة', nameEn: 'Big Data Analytics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS429', name: 'تطوير تطبيقات الهاتف المحمول', nameEn: 'Mobile Applications Development', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'IS431', name: 'تمثيل المعرفة', nameEn: 'Knowledge Representation', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'CS436', name: 'معالجة اللغات الطبيعية', nameEn: 'Natural Language Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'CS437', name: 'علم البيانات', nameEn: 'Data Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
                { code: 'CS438', name: 'الذكاء الحسابي', nameEn: 'Computational Intelligence', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'CS439', name: 'تعريب الحاسبات', nameEn: 'Computer Arabization', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'CS440', name: 'الرسوم المتحركة بالحاسب', nameEn: 'Computer Animations', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS314'] },
                { code: 'CS441', name: 'التعلم العميق', nameEn: 'Deep Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS313'] },
                { code: 'CS442', name: 'الوكلاء الأذكياء', nameEn: 'Intelligent Agents', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'CS449', name: 'اتجاهات جديدة في علوم الحاسب', nameEn: 'New trends in Computer Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2, allowCrossProgram: true }
              ]
            },
            IT: {
              name: 'تكنولوجيا المعلومات',
              nameEn: 'Information Technology',
              mandatory: [
                { code: 'IT305', name: 'إشارات ونظم', nameEn: 'Signals and Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT202'] },
                { code: 'IT306', name: 'شبكات الحاسب المتقدمة', nameEn: 'Advanced Computer Networks', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IT307', name: 'الوسائط المتعددة', nameEn: 'Multimedia', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'IT308', name: 'تأمين شبكات الحاسب الآلي', nameEn: 'Computer Network Security', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IT309', name: 'معالجة الإشارات الرقمية', nameEn: 'Digital Signal Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS101'] },
                { code: 'CS313', name: 'تعلم الآلة', nameEn: 'Machine Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'CS314', name: 'معالجة الصور', nameEn: 'Image Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'IT312', name: 'أساسيات أنظمة الروبوت', nameEn: 'Fundamentals of Robotic systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS212'] },
                { code: 'IT415', name: 'الشبكات اللاسلكية المتحركة', nameEn: 'Wireless and Mobile Networks', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IT416', name: 'الواقع الافتراضي والمعزز', nameEn: 'Virtual and Augmented Reality', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'IT417', name: 'برمجة الشبكات', nameEn: 'Network Programming', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IT418', name: 'النظم المدمجة', nameEn: 'Embedded Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'CS433', name: 'الحوسبة السحابية', nameEn: 'Cloud Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IT423', name: 'انترنت الأشياء', nameEn: 'Internet of Things', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IS429', name: 'تطوير تطبيقات الهاتف المحمول', nameEn: 'Mobile Applications Development', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] }
              ],
              elective: [
                { code: 'IS309', name: 'تأمين المعلومات', nameEn: 'Information Security', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
                { code: 'IT310', name: 'نظم الوقت الحقيقي', nameEn: 'Real Time Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS207'] },
                { code: 'CS309', name: 'الحوسبة المرنة', nameEn: 'Soft Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'IT311', name: 'ادارة الشبكات', nameEn: 'Network Management', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'CS312', name: 'بنية وتنظيم الحاسب', nameEn: 'Computer Architecture and Organization', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS204'] },
                { code: 'IT313', name: 'واجهات الحاسب', nameEn: 'Computer Interfaces', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS207'] },
                { code: 'CS315', name: 'الرسم بالحاسب', nameEn: 'Computer Graphics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'CS319', name: 'هندسة البرمجيات المتقدمة', nameEn: 'Advanced Software Engineering', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS308'] },
                { code: 'CS320', name: 'المعالجات الدقيقة ولغة التجميع', nameEn: 'Microprocessors and Assembly Language', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'IS323', name: 'تطبيقات الويب', nameEn: 'Web Applications', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS204'] },
                { code: 'IT419', name: 'معالجة الكلام', nameEn: 'Speech Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'IT420', name: 'الوسائط المتعددة المتقدمة', nameEn: 'Advanced Multimedia', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT307'] },
                { code: 'IT421', name: 'تخطيط وتصميم الشبكات', nameEn: 'Network Planning & Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IT422', name: 'تفاعل الإنسان مع الحاسب', nameEn: 'Human Computer Interaction', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS101'] },
                { code: 'IT424', name: 'الأدلة الشرعية في الشبكات', nameEn: 'Network Forensics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT202'] },
                { code: 'IS426', name: 'تحليل البيانات الكبيرة', nameEn: 'Big Data Analytics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IT425', name: 'الأنظمة المدمجة للشبكات', nameEn: 'Networked Embedded Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IS431', name: 'تمثيل المعرفة', nameEn: 'Knowledge Representation', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'CS430', name: 'الحوسبة المتوازية والموزعة', nameEn: 'Parallel and Distributed Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'CS432', name: 'الرؤية بالحاسب', nameEn: 'Computer Vision', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'CS434', name: 'التعرف على الأنماط', nameEn: 'Pattern Recognition', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS313'] },
                { code: 'CS436', name: 'معالجة اللغات الطبيعية', nameEn: 'Natural Language Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'CS437', name: 'علم البيانات', nameEn: 'Data Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
                { code: 'CS440', name: 'الرسوم المتحركة بالحاسب', nameEn: 'Computer Animations', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS314'] },
                { code: 'IT435', name: 'اتجاهات جديدة في تكنولوجيا المعلومات', nameEn: 'New trends in Information Technology', theoreticalHours: 3, practicalHours: 2, creditHours: 2, allowCrossProgram: true }
              ]
            },
            IS: {
              name: 'نظم المعلومات',
              nameEn: 'Information Systems',
              mandatory: [
                { code: 'IS309', name: 'تأمين المعلومات', nameEn: 'Information Security', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] },
                { code: 'IS310', name: 'تخزين واسترجاع المعلومات', nameEn: 'Information Storage and Retrieval', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS311', name: 'التنقيب عن البيانات', nameEn: 'Data Mining', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS312', name: 'نظم المعلومات الذكية', nameEn: 'Intelligent Information Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'] },
                { code: 'IS313', name: 'تحليل وتصميم النظم المتقدمة', nameEn: 'Advanced Systems Analysis and Design', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS203'] },
                { code: 'CS313', name: 'تعلم الآلة', nameEn: 'Machine Learning', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'IS314', name: 'نظم قواعد البيانات المتقدمة', nameEn: 'Advanced Database Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS425', name: 'قواعد البيانات الموزعة', nameEn: 'Distributed Databases', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS314'] },
                { code: 'IS426', name: 'تحليل البيانات الكبيرة', nameEn: 'Big Data Analytics', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS427', name: 'نظم المعلومات الجغرافية', nameEn: 'Geographical Information Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS428', name: 'نظم دعم القرار الذكي', nameEn: 'Intelligent Decision Support Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'] },
                { code: 'IS429', name: 'تطوير تطبيقات الهاتف المحمول', nameEn: 'Mobile Applications Development', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS103'] },
                { code: 'IS430', name: 'العرض المرئي للبيانات', nameEn: 'Data Visualization', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'CS433', name: 'الحوسبة السحابية', nameEn: 'Cloud Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'CS437', name: 'علم البيانات', nameEn: 'Data Science', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS104'] }
              ],
              elective: [
                { code: 'CS309', name: 'الحوسبة المرنة', nameEn: 'Soft Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'IT307', name: 'الوسائط المتعددة', nameEn: 'Multimedia', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS102'] },
                { code: 'IT311', name: 'ادارة الشبكات', nameEn: 'Network Management', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IS315', name: 'معالجة وتنظيم الملفات', nameEn: 'File Processing and Organization', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'IS316', name: 'نظم دعم اتخاذ القرار', nameEn: 'Decision Support Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'] },
                { code: 'IS317', name: 'مستودعات البيانات', nameEn: 'Data Warehouses', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS318', name: 'أمن قواعد البيانات', nameEn: 'Database Security', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS319', name: 'تقنيات التجارة الإلكترونية', nameEn: 'E-Commerce Technologies', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS203'] },
                { code: 'IS320', name: 'تكامل المؤسسات', nameEn: 'Enterprise Integration', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS203'] },
                { code: 'IS321', name: 'اختبار وضمان جودة البرمجيات', nameEn: 'Software Quality Testing and Assurance', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS308'] },
                { code: 'CS319', name: 'هندسة البرمجيات المتقدمة', nameEn: 'Advanced Software Engineering', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS308'] },
                { code: 'IS322', name: 'تقدير تكاليف تطوير وصيانة مشاريع البرمجيات', nameEn: 'Estimating Costs for Developing and Maintaining Software Projects', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS308'] },
                { code: 'IS323', name: 'تطبيقات الويب', nameEn: 'Web Applications', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS204'] },
                { code: 'IT422', name: 'تفاعل الإنسان مع الحاسب', nameEn: 'Human Computer Interaction', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['BS101'] },
                { code: 'IT423', name: 'أنترنت الأشياء', nameEn: 'Internet of Things', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IT203'] },
                { code: 'IS431', name: 'تمثيل المعرفة', nameEn: 'Knowledge Representation', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS202'] },
                { code: 'IS432', name: 'الابتكار في نظم المعلومات والتقنيات الجديدة', nameEn: 'Information Systems Innovation and New Technologies', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS201'] },
                { code: 'IS433', name: 'ضمان الأمن ومراجعة أنظمة المعلومات', nameEn: 'Security Assurance and Information Systems Auditing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['IS309'] },
                { code: 'CS430', name: 'الحوسبة المتوازية والموزعة', nameEn: 'Parallel and Distributed Computing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS205'] },
                { code: 'CS431', name: 'النمذجة والمحاكاة', nameEn: 'Modeling and Simulation', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS311'] },
                { code: 'CS436', name: 'معالجة اللغات الطبيعية', nameEn: 'Natural Language Processing', theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ['CS206'] },
                { code: 'IS438', name: 'اتجاهات جديدة في نظم المعلومات', nameEn: 'New trends in Information Systems', theoreticalHours: 3, practicalHours: 2, creditHours: 2, allowCrossProgram: true }
              ]
            }
          }
        },
        practicalTraining: {
          hours: 3,
          percentage: 2.15,
          percentageRange: { min: 3, max: 5 },
          preventSummerRegistration: true
        },
        graduationProject: {
          hours: 4,
          percentage: 2.86,
          percentageRange: { min: 3, max: 5 }
        }
      }
    },
    academicCalendar: {
      graduationDates: {
        january: true,
        june: true,
        september: true
      }
    },
    registration: {
      minimumStudentsPerCourse: 10,
      minimumCreditHours: 12,
      maximumCreditHours: 19,
      maximumCreditHoursWithGPA: {
        enabled: true,
        gpaThreshold: 3.0,
        maxHours: 22
      },
      maximumCreditHoursLastSemester: 22,
      summerMaximumHours: 9,
      addDropDeadline: {
        weeks: 2,
        maxHours: 6,
        summerMaxHours: 3
      },
      prerequisites: {
        required: true,
        allowHigherLevel: true
      }
    },
    withdrawal: {
      deadline: {
        weeks: 7,
        minimumHoursAfterWithdrawal: 12
      },
      afterDeadline: {
        withoutExcuse: 'fail',
        withExcuse: 'withdrawn'
      }
    },
    attendance: {
      required: true,
      minimumAttendance: 75,
      maximumAbsence: 25,
      examEligibility: {
        minimumAttendance: 75,
        actionOnExceed: 'prevent_exam'
      },
      examAbsence: {
        withoutExcuse: 'fail',
        withExcuse: 'incomplete',
        incompleteConditions: {
          minimumWorkGrade: 60,
          examWithinSemester: true
        }
      }
    },
    discontinuation: {
      definition: 'no_registration',
      allowedWithoutExcuse: {
        consecutive: 2,
        nonConsecutive: 4
      },
      suspensionRequestDeadline: {
        weeks: 7
      }
    },
    exams: {
      totalGrade: 100,
      passingGrade: 50,
      gradeDistribution: {
        theoreticalPractical: {
          midterm: 20,
          oral: 10,
          practical: 15,
          assignments: 10,
          finalWritten: 60
        },
        theoreticalOnly: {
          midterm: 15,
          oral: 10,
          assignments: 10,
          finalWritten: 50
        }
      }
    },
    practicalTraining: {
      enabled: true,
      creditHours: 3,
      minimumCreditHours: 70,
      duration: {
        weeks: 3,
        location: 'both'
      },
      summerConflict: {
        preventSummerRegistration: true
      },
      graduationRequirement: true
    },
    graduationProject: {
      enabled: true,
      creditHours: 4,
      minimumCreditHours: 102,
      supervision: {
        required: true,
        byFacultyMember: true,
        departmentNomination: true
      },
      duration: 'full_year',
      evaluation: {
        supervisor: {
          percentage: 40,
          oral: 20,
          periodicFollowUp: 20
        },
        committee: {
          percentage: 60,
          members: 3
        }
      },
      discussion: {
        endOfYear: true,
        scheduleByDepartment: true
      }
    },
    academicWarning: {
      enabled: true,
      firstSemesterExempt: true,
      gpaThreshold: 2.0,
      warningSystem: {
        firstWarning: {
          gpaThreshold: 2.0,
          appliesAfter: 'first_semester'
        },
        secondWarning: {
          maxSemesters: 4,
          notificationToGuardian: true
        },
        dismissal: {
          afterWarnings: true,
          maxSemesters: 4
        }
      },
      additionalOpportunity: {
        enabled: true,
        conditions: {
          minimumCreditHours: 112,
          requiresApproval: true
        },
        allowedSemesters: {
          regular: 2,
          summer: 1
        }
      },
      registrationLimit: {
        underWarning: 13,
        graduationSemester: {
          allowOneMore: true
        }
      },
      summerExempt: true,
      suspensionNotCounted: true,
      ranking: {
        byCGPA: true,
        tieBreaker: 'total_grade'
      }
    },
    grading: {
      system: 'credit_hours',
      passingGrade: 50,
      minimumCGPA: 2.0,
      gradeScale: {
        A_plus: { min: 96, max: 100, points: 4.0 },
        A: { min: 92, max: 96, points: 3.7 },
        A_minus: { min: 88, max: 92, points: 3.4 },
        B_plus: { min: 84, max: 88, points: 3.2 },
        B: { min: 80, max: 84, points: 3.0 },
        B_minus: { min: 76, max: 80, points: 2.8 },
        C_plus: { min: 72, max: 76, points: 2.6 },
        C: { min: 68, max: 72, points: 2.4 },
        C_minus: { min: 64, max: 68, points: 2.2 },
        D_plus: { min: 60, max: 64, points: 2.0 },
        D: { min: 55, max: 60, points: 1.5 },
        D_minus: { min: 50, max: 55, points: 1.0 },
        F: { min: 0, max: 50, points: 0 },
        Abs: { points: 0 },
        Con: { points: 0, description: 'مقرر مستمر' },
        I: { points: 0, description: 'غير مكتمل' },
        W: { points: 0, description: 'منسحب' }
      },
      overallRating: {
        very_weak: { min: 0, max: 1 },
        weak: { min: 1, max: 2 },
        acceptable: { min: 2, max: 2.5 },
        good: { min: 2.5, max: 3 },
        very_good: { min: 3, max: 3.5 },
        excellent: { min: 3.5, max: 4 }
      },
      honors: {
        enabled: true,
        minimumCGPA: 3.0,
        minimumSemesterGPA: 3.0,
        noFailures: true,
        maxYears: 4,
        excludeSuspension: true
      }
    },
    retake: {
      failedCourse: {
        enabled: true,
        maxGradeAfterRetake: 83,
        countHoursOnce: true,
        showInTranscript: true
      },
      improvementToAvoidDismissal: {
        enabled: true,
        maxGradeAfterRetake: 83,
        levelRestriction: {
          sameLevel: true,
          oneLevelBelow: true
        },
        noMaxLimit: true,
        countHoursOnce: true,
        showInTranscript: true,
        payment: {
          equalsSummerFee: true,
          requiresApproval: true
        }
      },
      improvementForBetterGPA: {
        enabled: true,
        maxGradeAfterRetake: 83,
        maxCourses: 3,
        levelRestriction: {
          sameLevel: true,
          oneLevelBelow: true
        },
        countHoursOnce: true,
        showInTranscript: true
      }
    },
    programChange: {
      enabled: true,
      allowedLevel: 3,
      requirements: {
        meetAdmissionCriteria: true,
        advisorApproval: true,
        departmentApproval: true,
        committeeApproval: true,
        councilApproval: true
      },
      creditTransfer: {
        enabled: true,
        basedOnNewProgram: true
      },
      levelAssignment: {
        basedOnCredits: true
      }
    },
    scientificTrips: {
      enabled: true,
      organization: {
        byDepartment: true,
        supervisedByFaculty: true
      },
      duration: {
        min: 1,
        max: 5
      },
      requirements: {
        report: true,
        presentation: true,
        toDepartment: true
      },
      creditHours: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
