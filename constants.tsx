import { Users, BookOpen, Calendar, ClipboardCheck, GraduationCap, LayoutGrid, FileText, Settings, Database, DollarSign, CreditCard, Shield, Mail, Image, AlertTriangle, List, Box, CheckSquare, Layers, Clock, Building2, ClipboardList } from 'lucide-react';
import { MainTab, Faculty } from './types';

// ================= ADMIN NAVIGATION =================
export const ADMIN_NAVIGATION: MainTab[] = [
  {
    id: 'students',
    label: 'بيانات الطلاب',
    icon: Users,
    groups: [
      {
        id: 'apps',
        label: 'التطبيقات',
        items: [
          { id: 'info_board', label: 'لوحة المعلومات' },
          { id: 'survey_rules', label: 'ادخال قواعد الاستبيان' },
          { id: 'add_attendance', label: 'ادخال حضور الطلاب' },
          { id: 'student_attendance', label: 'سجل حضور الطلاب' }
        ]
      },
      {
        id: 'supervision',
        label: 'الإشراف',
        items: [
          { id: 'academic_reg', label: 'التسجيل الأكاديمي للطلاب' },
          { id: 'report_signs', label: 'توقيعات التقارير' },
          { id: 'course_close', label: 'غلق المقررات' },
          { id: 'sys_edit', label: 'تعديل النظام' }
        ]
      },
      {
        id: 'data_mod',
        label: 'تعديل البيانات',
        items: [
          { id: 'gpa_mod', label: 'تعديل المعدل التراكمي' },
          { id: 'level_mod', label: 'تعديل مستويات الطلاب' },
          { id: 'grad_year', label: 'اضافة عام تخرج للطلاب' }
        ]
      },
      {
        id: 'financial',
        label: 'بيانات مالية',
        items: [
          { id: 'fees_setup', label: 'تجهيز رسوم الطلاب' },
          { id: 'fees_collect', label: 'تحصيل رسوم طالب' },
          { id: 'payment_perm', label: 'إذن دفع' },
          { id: 'fees_report', label: 'تقارير بيانات مالية' }
        ]
      },
      {
        id: 'reports',
        label: 'التقارير',
        items: [
          { id: 'student_list', label: 'قوائم الطلاب' },
          { id: 'student_data_management', label: 'بيانات الطالب' },
          { id: 'advanced_student_search', label: 'البحث المتقدم' },
          { id: 'old_regulation_students', label: 'طلاب اللائحة القديمة' },
          { id: 'new_regulation_students', label: 'طلاب اللائحة الجديدة' },
          { id: 'regulation_statistics', label: 'إحصائيات اللوائح' },
          { id: 'student_academic_profile', label: 'الملف الأكاديمي للطلاب' },
          { id: 'contact_list', label: 'بيانات الاتصال' },
          { id: 'id_cards', label: 'بطاقات الهوية' }
        ]
      },
      {
        id: 'academic_data',
        label: 'البيانات الأكاديمية',
        items: [
          { id: 'course_catalog', label: 'كتالوج المقررات' },
          { id: 'student_course_enrollments', label: 'تسجيلات المقررات' },
          { id: 'detailed_grades', label: 'درجات الطلاب التفصيلية' },
          { id: 'detailed_attendance', label: 'سجل الحضور التفصيلي' },
          { id: 'financial_records', label: 'السجلات المالية' },
          { id: 'course_schedules', label: 'جداول المقررات' },
          { id: 'student_performance_analysis', label: 'تحليل أداء الطلاب' },
          { id: 'course_enrollment_statistics', label: 'إحصائيات المقررات' },
          { id: 'database_relations_overview', label: 'نظرة عامة على العلاقات' },
          { id: 'student_complete_profile', label: 'الملف الشامل للطالب' },
          { id: 'course_performance_analysis', label: 'تحليل أداء المقررات' }
        ]
      },
      {
        id: 'financial_data',
        label: 'البيانات المالية',
        items: [
          { id: 'financial_records', label: 'السجلات المالية للطلاب' }
        ]
      }
    ]
  },
  {
    id: 'registration',
    label: 'التسجيل الأكاديمي',
    icon: ClipboardCheck,
    groups: [
      {
        id: 'student_reg',
        label: 'تسجيل الطلاب',
        items: [
          { id: 'academic_reg', label: 'التسجيل الأكاديمي للطلاب' },
          { id: 'block_student_reg', label: 'حجب تسجيل طالب' },
          { id: 'balance_reg', label: 'تسجيل موازنة' },
          { id: 'modify_student_courses', label: 'تعديل مقررات الطلاب' },
          { id: 'block_reg_by_renewal', label: 'حجب تسجيل طلاب تبعا لموقف التجديد' }
        ]
      },
      {
        id: 'reg_reports',
        label: 'تقارير',
        items: [
          { id: 'registered_students_report', label: 'تقرير الطلبة المسجلين' },
          { id: 'course_student_count', label: 'تقرير اعداد الطلاب في مقرر' },
          { id: 'registered_students_stats', label: 'إحصائية الطلاب المسجلين' },
          { id: 'registered_by_levels', label: 'احصائية المسجلين بالمستويات' },
          { id: 'registered_students_chart', label: 'إحصائية الطلاب المسجلين (رسم بياني)' },
          { id: 'students_in_course', label: 'تقرير طلاب مسجلين بمقرر' },
          { id: 'unregistered_students', label: 'الطلاب غير المسجلين' },
          { id: 'students_by_gpa', label: 'احصائية طلاب بالمعدل التراكمي' },
          { id: 'registered_courses_for_students', label: 'المقررات الدراسية المسجلة للطلاب' },
          { id: 'student_reg_form', label: 'استمارة تسجيل طالب' },
          { id: 'multiple_courses_reg', label: 'مسجلين في أكثر من مقرر' },
          { id: 'review_student_reg', label: 'مراجعة تسجيل الطلاب' },
          { id: 'registered_courses_count', label: 'عدد المقررات المسجلة' }
        ]
      }
    ]
  },
  {
    id: 'programs',
    label: 'البرامج الدراسية',
    icon: BookOpen,
    groups: [
      {
        id: 'programs_main',
        label: 'البرامج الدراسية',
        items: [
          { id: 'course_management', label: 'إدارة المقررات' },
          { id: 'upload_courses', label: 'رفع بيانات المقررات الدراسية' },
          { id: 'equivalent_courses', label: 'المقررات المناظرة للموازنة' },
          { id: 'program_data', label: 'بيانات البرامج' },
          { id: 'program_rules', label: 'قواعد البرنامج' },
          { id: 'study_courses', label: 'المقررات الدراسية' }
        ]
      },
      {
        id: 'programs_reports',
        label: 'تقارير',
        items: [
          { id: 'bylaw_courses', label: 'مقررات اللائحة' }
        ]
      }
    ]
  },
  {
    id: 'departments',
    label: 'التخصصات',
    icon: Building2,
    groups: [
      {
        id: 'departments_main',
        label: 'إدارة التخصصات',
        items: [
          { id: 'view_departments', label: 'عرض التخصصات' },
          { id: 'manage_departments', label: 'إدارة التخصصات' },
          { id: 'department_students', label: 'طلاب التخصصات' },
          { id: 'department_statistics', label: 'إحصائيات التخصصات' }
        ]
      }
    ]
  },
  {
    id: 'schedules',
    label: 'الجداول الدراسية',
    icon: Calendar,
    groups: [
      {
        id: 'manage',
        label: 'الإدارة',
        items: [
          { id: 'create_sched', label: 'إنشاء جدول جديد' },
          { id: 'assign_room', label: 'تخصيص القاعات' },
          { id: 'lecturers', label: 'توزيع المحاضرين' }
        ]
      },
      {
        id: 'schedule_reports',
        label: 'تقارير الجداول',
        items: [
          { id: 'course_schedules', label: 'جداول المقررات' },
          { id: 'student_personal_schedules', label: 'الجداول الشخصية للطلاب' },
          { id: 'room_utilization', label: 'استخدام القاعات' },
          { id: 'instructor_workload', label: 'أعباء المحاضرين' }
        ]
      }
    ]
  },
  {
    id: 'exams',
    label: 'تعليم وامتحانات',
    icon: GraduationCap,
    groups: [
      {
        id: 'committees',
        label: 'اللجان',
        items: [
          { id: 'comm_def', label: 'تعريف اللجان' },
          { id: 'dist_students', label: 'توزيع الطلاب على اللجان' },
          { id: 'seat_nums', label: 'أرقام الجلوس' }
        ]
      },
      {
        id: 'results',
        label: 'النتائج',
        items: [
          { id: 'enter_grades', label: 'رصد الدرجات' },
          { id: 'control_sheet', label: 'شيت الكنترول' },
          { id: 'announce', label: 'إعلان النتائج' }
        ]
      }
    ]
  },
  {
    id: 'changes',
    label: 'التغييرات',
    icon: Clock,
    groups: [
      {
        id: 'all_changes',
        label: 'سجل التغييرات',
        items: [
          { id: 'all_activities', label: 'جميع التغييرات' }
        ]
      }
    ]
  },
  {
    id: 'student_affairs',
    label: 'شؤون الطلاب',
    icon: ClipboardList,
    groups: [
      {
        id: 'requirements',
        label: 'المتطلبات والمتابعة',
        items: [
          { id: 'student_affairs_requirements', label: 'متطلبات الطلاب' }
        ]
      }
    ]
  }
];

// ================= STUDENT NAVIGATION =================
// Based on the provided image
export const STUDENT_NAVIGATION: any[] = [
  { id: 'id_card_view', label: 'البطاقات التعريفية', icon: CreditCard },
  { id: 'military_edu', label: 'التربية العسكرية', icon: Shield },
  { id: 'student_fees', label: 'الرسوم', icon: DollarSign },
  { id: 'academic_reg_student', label: 'التسجيل الأكاديمي', icon: ClipboardCheck },
  { id: 'uni_email', label: 'بريد الجامعة', icon: Mail },
  { id: 'student_grades', label: 'النتائج الدراسية', icon: FileText },
  { id: 'personal_data', label: 'البيانات الشخصية', icon: Users },
  { id: 'upload_photo', label: 'رفع الصورة الشخصية', icon: Image },
  { id: 'academic_warnings', label: 'إنذارات أكاديمية', icon: AlertTriangle },
  { id: 'reg_form_issue', label: 'استمارة التسجيل (مشاكل)', icon: Layers }, // The "Troubled" feature
  { id: 'branching', label: 'التشعيب', icon: Box },
  { id: 'book_list', label: 'قائمة الكتب', icon: BookOpen },
  { id: 'mailbox', label: 'صندوق البريد', icon: Mail },
  { id: 'survey', label: 'استبيان', icon: CheckSquare },
  { id: 'services', label: 'خدمات', icon: LayoutGrid },
  { id: 'view_schedule', label: 'الجداول', icon: Calendar },
  { id: 'view_attendance', label: 'الحضور والغياب', icon: List },
];

// ================= FACULTIES =================
export const FACULTIES: Faculty[] = [
  {
    id: 'FCAI',
    name: 'كلية الحاسبات والذكاء الاصطناعي',
    icon: '💻',
    studentCount: 2000,
    staffCount: 120,
    color: 'bg-blue-600'
  },
  {
    id: 'SCI',
    name: 'كلية العلوم',
    icon: '🔬',
    studentCount: 375,
    staffCount: 250,
    color: 'bg-green-600'
  },
  {
    id: 'COM',
    name: 'كلية التجارة',
    icon: '📊',
    studentCount: 375,
    staffCount: 300,
    color: 'bg-yellow-600'
  },
  {
    id: 'EDU',
    name: 'كلية التربية',
    icon: '📚',
    studentCount: 375,
    staffCount: 200,
    color: 'bg-red-600'
  },
  {
    id: 'ENG',
    name: 'كلية الهندسة',
    icon: '⚙️',
    studentCount: 375,
    staffCount: 180,
    color: 'bg-purple-600'
  },
  {
    id: 'MED',
    name: 'كلية الطب',
    icon: '🏥',
    studentCount: 1500,
    staffCount: 150,
    color: 'bg-pink-600'
  },
  {
    id: 'PHR',
    name: 'كلية الصيدلة',
    icon: '💊',
    studentCount: 1200,
    staffCount: 100,
    color: 'bg-indigo-600'
  },
  {
    id: 'LAW',
    name: 'كلية الحقوق',
    icon: '⚖️',
    studentCount: 3000,
    staffCount: 120,
    color: 'bg-gray-600'
  },
  {
    id: 'ART',
    name: 'كلية الآداب',
    icon: '📖',
    studentCount: 4500,
    staffCount: 180,
    color: 'bg-orange-600'
  },
  {
    id: 'AGR',
    name: 'كلية الزراعة',
    icon: '🌾',
    studentCount: 2800,
    staffCount: 140,
    color: 'bg-lime-600'
  },
  {
    id: 'NRS',
    name: 'كلية التمريض',
    icon: '🏥',
    studentCount: 2000,
    staffCount: 110,
    color: 'bg-teal-600'
  }
];
