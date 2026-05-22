import { PageConfig } from '../types';
import { FACULTIES } from '../constants';

// ==================================================================================
// DATA GENERATORS
// ==================================================================================

const FIRST_NAMES = [
  'أحمد', 'محمد', 'محمود', 'علي', 'عمر', 'إبراهيم', 'يوسف', 'خالد', 'حسن', 'حسين', 
  'عبدالله', 'عبدالرحمن', 'مصطفى', 'عمرو', 'زياد', 'كريم', 'طارق', 'سعيد', 'مازن', 'سامي',
  'عبدالرحيم', 'عبدالعزيز', 'عبدالفتاح', 'عبدالحميد', 'عبدالرازق', 'عبدالسلام', 'عبدالستار', 'عبدالمنعم',
  'سارة', 'مريم', 'نور', 'منى', 'هدى', 'فاطمة', 'عائشة', 'زينب', 'سلمى', 'يارا',
  'ندى', 'آية', 'رانيا', 'داليا', 'هبة', 'شيماء', 'نهى', 'أماني', 'ياسمين', 'ريم',
  'فريدة', 'جيهان', 'إيناس', 'إيمان', 'إسراء', 'مروة', 'مها', 'ليلى', 'سوسن', 'هند'
];

const MIDDLE_NAMES = [
  'محمد', 'أحمد', 'علي', 'حسن', 'إبراهيم', 'السيد', 'عبدالله', 'محمود', 'عثمان', 'سليم',
  'سليمان', 'يوسف', 'طه', 'موسى', 'عيسى', 'داود', 'صالح', 'عامر', 'عزت', 'فؤاد',
  'نصر', 'جمال', 'كامل', 'راضي', 'سعد', 'زكي', 'فاروق', 'عبدالعال', 'متولي', 'شريف',
  'عبدالمنعم', 'عبدالرازق', 'عبدالستار', 'عبدالسلام', 'عبدالحميد', 'عبدالفتاح', 'عبدالعزيز', 'عبدالرحيم'
];

const LAST_NAMES = [
  'محمد', 'أحمد', 'علي', 'حسن', 'إبراهيم', 'السيد', 'عبدالله', 'محمود', 'عثمان', 'سليم',
  'سليمان', 'يوسف', 'طه', 'موسى', 'عيسى', 'داود', 'صالح', 'عامر', 'عزت', 'فؤاد',
  'نصر', 'جمال', 'كامل', 'راضي', 'سعد', 'زكي', 'فاروق', 'عبدالعال', 'متولي', 'شريف',
  'النجار', 'الشريف', 'الزيات', 'الخطيب', 'المصري', 'الدسوقي', 'المنصوري', 'الدمياطي'
];

const LEVELS = ['المستوى الأول', 'المستوى الثاني', 'المستوى الثالث', 'المستوى الرابع'];
const STATUSES = ['مقيد', 'موقوف', 'خريج', 'مفصول'];
const CITIES = [
  'دمياط', 'المنصورة', 'بورسعيد', 'رأس البر', 'فارسكور', 'كفر سعد', 'القاهرة', 'جمصة',
  'الزرقا', 'الروضة', 'كفر البطيخ', 'ميت أبو غالب', 'شربين', 'طلخا', 'بلقاس', 'أجا'
];
const DEPARTMENTS_FCAI = ['علوم الحاسب (CS)', 'نظم المعلومات (IS)', 'الذكاء الاصطناعي (AI)', 'تكنولوجيا المعلومات (IT)', 'المعلوماتية الطبية (MI)', 'الأمن السيبراني (SEC)', 'عام']; 

// Generate realistic student data
const generateRandomStudent = (facultyId: string, index: number, levelIndex?: number) => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const middleName = MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)];
  const thirdName = MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const fullName = `${firstName} ${middleName} ${thirdName} ${lastName}`;
  
  // Distribute levels evenly: 125 students per level
  const actualLevelIndex = levelIndex !== undefined ? levelIndex : Math.floor((index - 1) / 125);
  const level = LEVELS[actualLevelIndex];
  
  // Calculate admission year based on level (assuming 2024 is current year)
  // Level 1 = 2024, Level 2 = 2023, Level 3 = 2022, Level 4 = 2021
  const admissionYear = 2024 - actualLevelIndex;
  const studentId = `${admissionYear}${String(index).padStart(4, '0')}`;
  
  // More realistic GPA distribution (most students between 2.5-3.5)
  const gpaBase = 2.0 + Math.random() * 1.8; // 2.0 to 3.8
  const gpa = (gpaBase + (Math.random() > 0.7 ? Math.random() * 0.7 : 0)).toFixed(2);
  
  // Status: 90% active, 5% suspended, 3% graduated, 2% expelled
  const statusRand = Math.random();
  let status = 'مقيد';
  if (statusRand > 0.98) status = 'مفصول';
  else if (statusRand > 0.95) status = 'خريج';
  else if (statusRand > 0.90) status = 'موقوف';
  
  // Fees: 85% paid, 15% unpaid
  const fees = Math.random() > 0.15 ? 'مسدد' : 'غير مسدد';
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  
  // More realistic National ID Generation
  // Birth year: approximately 18-22 years old at admission
  const birthYear = admissionYear - (18 + Math.floor(Math.random() * 5));
  const natYear = String(birthYear).slice(-2);
  const natMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const natDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  // Governorate code for Damietta: 11
  const governorateCode = '11';
  // Random 4-digit serial
  const serial = String(Math.floor(Math.random() * 9000) + 1000);
  // Check digit (simplified)
  const checkDigit = String(Math.floor(Math.random() * 10));
  const nationalId = `3${natYear}${natMonth}${natDay}${governorateCode}${serial}${checkDigit}`;

  // Department Logic: Levels 1-2 are "عام", Levels 3-4 choose a major
  let department = 'عام';
  if (facultyId === 'FCAI' && actualLevelIndex >= 2) {
    // Distribute departments: CS (35%), IS (25%), AI (25%), IT (15%)
    const deptRand = Math.random();
    if (deptRand < 0.35) department = 'علوم الحاسب (CS)';
    else if (deptRand < 0.60) department = 'نظم المعلومات (IS)';
    else if (deptRand < 0.85) department = 'الذكاء الاصطناعي (AI)';
    else department = 'تكنولوجيا المعلومات (IT)';
  } else if (facultyId !== 'FCAI') {
    department = 'شعبة عامة';
  }

  const facultyName = FACULTIES.find(f => f.id === facultyId)?.name || facultyId;
  
  // Generate email: firstname.lastname.studentid
  const emailFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const emailLastName = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const email = `${emailFirstName}.${emailLastName}.${studentId}@stud.du.edu.eg`;

  // More realistic phone number (Egyptian mobile: 010, 011, 012, 015)
  const phonePrefix = ['010', '011', '012', '015'][Math.floor(Math.random() * 4)];
  const phoneSuffix = String(Math.floor(Math.random() * 90000000) + 10000000);
  const phone = `${phonePrefix}${phoneSuffix}`;

  return {
    student_id: studentId,
    name: fullName,
    national_id: nationalId,
    faculty: facultyName,
    faculty_code: facultyId,
    department: department,
    level: level,
    gpa: gpa,
    phone: phone,
    email: email,
    city: city,
    status: status,
    fees_status: fees
  };
};

// Generate exactly 500 students for FCAI, evenly distributed across 4 levels (125 each)
const FCAI_STUDENTS = [
  // Level 1: 125 students (2024 admission)
  ...Array.from({ length: 125 }).map((_, i) => generateRandomStudent('FCAI', i + 1, 0)),
  // Level 2: 125 students (2023 admission)
  ...Array.from({ length: 125 }).map((_, i) => generateRandomStudent('FCAI', i + 126, 1)),
  // Level 3: 125 students (2022 admission)
  ...Array.from({ length: 125 }).map((_, i) => generateRandomStudent('FCAI', i + 251, 2)),
  // Level 4: 125 students (2021 admission)
  ...Array.from({ length: 125 }).map((_, i) => generateRandomStudent('FCAI', i + 376, 3)),
];

// Generate students for other faculties (100 each)
const OTHER_STUDENTS = [
  ...Array.from({ length: 100 }).map((_, i) => generateRandomStudent('SCI', i + 1001)),
  ...Array.from({ length: 100 }).map((_, i) => generateRandomStudent('COM', i + 2001)),
  ...Array.from({ length: 100 }).map((_, i) => generateRandomStudent('EDU', i + 3001)),
];

const ALL_STUDENTS = [...FCAI_STUDENTS, ...OTHER_STUDENTS];


export const MOCK_DATABASE: Record<string, PageConfig> = {
  // ==================================================================================
  // ADMIN: STUDENT LIST (GENERATED DATA)
  // ==================================================================================
  'student_list': {
    id: 'student_list',
    title: 'قوائم الطلاب المقيدين',
    description: `عرض وإدارة بيانات الطلاب التفصيلية (500 طالب لكلية الحاسبات - موزعين بالتساوي: 125 طالب لكل مستوى)`,
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'national_id', label: 'الرقم القومي' },
      { key: 'department', label: 'القسم / الشعبة' },
      { key: 'level', label: 'المستوى' },
      { key: 'gpa', label: 'GPA' },
      { key: 'phone', label: 'الهاتف' },
      { key: 'email', label: 'البريد الإلكتروني' },
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
      { key: 'old_course', label: 'المقرر القديم' },
      { key: 'new_course', label: 'المقرر الجديد' },
      { key: 'reason', label: 'سبب التعديل' },
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
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'registered_count', label: 'عدد المسجلين' },
      { key: 'capacity', label: 'السعة' },
      { key: 'available', label: 'المتاح' }
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
    columns: [],
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
    columns: [],
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
    columns: [],
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
    description: 'موقف الطالب من دورة التربية العسكرية',
    type: 'table',
    columns: [
      { key: 'cycle', label: 'الدورة' },
      { key: 'date', label: 'تاريخ الانعقاد', type: 'date' },
      { key: 'result', label: 'النتيجة', type: 'status' }
    ],
    data: [
      { cycle: 'دورة يوليو 2023', date: '2023-07-15', result: 'اجتاز' }
    ]
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
      { key: 'course', label: 'المقرر' },
      { key: 'hours', label: 'الساعات' },
      { key: 'grade', label: 'التقدير' },
      { key: 'points', label: 'النقاط' }
    ],
    data: [
      { semester: 'ربيع 2024', course: 'تراكيب محددة', hours: '3', grade: 'A', points: '4.0' },
      { semester: 'ربيع 2024', course: 'برمجة شيئية', hours: '3', grade: 'B+', points: '3.3' },
      { semester: 'ربيع 2024', course: 'تحليل نظم', hours: '3', grade: 'A-', points: '3.7' }
    ],
    actions: [{ type: 'print', label: 'بيان درجات' }]
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
      { key: 'email', label: 'البريد الإلكتروني' },
      { key: 'status', label: 'حالة الحساب', type: 'status' }
    ],
    data: [
      { email: 'ahmed.20210055@stud.uni.edu.eg', status: 'نشط' }
    ],
    actions: [{ type: 'edit', label: 'إعادة تعيين كلمة المرور' }]
  },
  'academic_warnings': {
    id: 'academic_warnings',
    title: 'الإنذارات الأكاديمية',
    description: 'سجل الإنذارات بسبب انخفاض المعدل التراكمي',
    type: 'table',
    columns: [
      { key: 'date', label: 'تاريخ الإنذار' },
      { key: 'reason', label: 'السبب' },
      { key: 'gpa', label: 'المعدل حينها' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [], // Empty state demonstration
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
      { key: 'city', label: 'المدينة' },
      { key: 'level', label: 'المستوى' }
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
    description: 'حالة بطاقات الهوية الجامعية للطلاب',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'كود الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'card_year', label: 'العام الجامعي' },
      { key: 'status', label: 'حالة البطاقة', type: 'status' },
      { key: 'delivery', label: 'مكان الاستلام' }
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
    description: 'متابعة ورصد حضور الطلاب في المحاضرات والسكاشن',
    type: 'table',
    columns: [
      { key: 'student_id', label: 'رقم الطالب' },
      { key: 'name', label: 'اسم الطالب' },
      { key: 'course', label: 'المقرر' },
      { key: 'session_type', label: 'نوع المحاضرة' },
      { key: 'week', label: 'الأسبوع' },
      { key: 'status', label: 'حالة الحضور', type: 'status' }
    ],
    data: (() => {
      // Generate attendance records from real student data
      const courses = ['برمجة 1', 'هياكل بيانات', 'قواعد بيانات', 'شبكات حاسب', 'نظم تشغيل', 'ذكاء اصطناعي', 'برمجة شيئية', 'تحليل نظم'];
      const sessionTypes = ['محاضرة', 'سكشن', 'معمل'];
      const weeks = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6', 'الأسبوع 7', 'الأسبوع 8'];
      
      const attendanceData: any[] = [];
      // Take first 100 students from FCAI and generate attendance records
      FCAI_STUDENTS.slice(0, 100).forEach((student, idx) => {
        // Each student has 3-5 attendance records
        const recordCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < recordCount; i++) {
          const course = courses[Math.floor(Math.random() * courses.length)];
          const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
          const week = weeks[Math.floor(Math.random() * weeks.length)];
          const isPresent = Math.random() > 0.15; // 85% attendance rate
          
          attendanceData.push({
            student_id: student.student_id,
            name: student.name,
            course: course,
            session_type: sessionType,
            week: week,
            status: isPresent ? 'حاضر' : 'غائب'
          });
        }
      });
      return attendanceData;
    })(),
    actions: [{ type: 'add', label: 'تسجيل حضور' }]
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
      { key: 'created_date', label: 'تاريخ الإنشاء', type: 'date' }
    ],
    data: [
      { 
        schedule_id: 'SCH-2024-FALL-001', 
        semester: 'خريف 2024', 
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الأول',
        courses_count: '8',
        status: 'نشط',
        created_date: '2024-09-01'
      },
      { 
        schedule_id: 'SCH-2024-FALL-002', 
        semester: 'خريف 2024', 
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الثاني',
        courses_count: '7',
        status: 'نشط',
        created_date: '2024-09-01'
      },
      { 
        schedule_id: 'SCH-2024-FALL-003', 
        semester: 'خريف 2024', 
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الثالث',
        courses_count: '6',
        status: 'نشط',
        created_date: '2024-09-02'
      },
      { 
        schedule_id: 'SCH-2024-FALL-004', 
        semester: 'خريف 2024', 
        academic_year: '2024-2025',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الرابع',
        courses_count: '5',
        status: 'قيد الإنشاء',
        created_date: '2024-09-03'
      },
      { 
        schedule_id: 'SCH-2024-SPRING-001', 
        semester: 'ربيع 2024', 
        academic_year: '2023-2024',
        faculty: 'كلية الحاسبات والذكاء الاصطناعي',
        level: 'المستوى الأول',
        courses_count: '8',
        status: 'منتهي',
        created_date: '2024-02-01'
      }
    ],
    actions: [
      { type: 'add', label: 'إنشاء جدول جديد' },
      { type: 'edit', label: 'تعديل' },
      { type: 'export', label: 'تصدير Excel' },
      { type: 'print', label: 'طباعة' }
    ]
  },

  'assign_room': {
    id: 'assign_room',
    title: 'تخصيص القاعات الدراسية',
    description: 'توزيع المقررات على القاعات الدراسية المتاحة',
    type: 'table',
    columns: [
      { key: 'course_code', label: 'كود المقرر' },
      { key: 'course_name', label: 'اسم المقرر' },
      { key: 'group', label: 'المجموعة' },
      { key: 'day', label: 'اليوم' },
      { key: 'time', label: 'الوقت' },
      { key: 'room', label: 'القاعة' },
      { key: 'capacity', label: 'السعة' },
      { key: 'enrolled', label: 'المسجلين' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: (() => {
      const courses = [
        { code: 'CS101', name: 'مقدمة في علوم الحاسب', groups: ['A', 'B', 'C'] },
        { code: 'CS102', name: 'برمجة 1', groups: ['A', 'B'] },
        { code: 'CS201', name: 'هياكل البيانات', groups: ['A', 'B'] },
        { code: 'CS202', name: 'قواعد البيانات', groups: ['A', 'B'] },
        { code: 'CS301', name: 'نظم التشغيل', groups: ['A'] },
        { code: 'CS302', name: 'شبكات الحاسب', groups: ['A'] },
        { code: 'CS401', name: 'مشروع التخرج', groups: ['A', 'B'] },
        { code: 'MATH101', name: 'رياضيات متقطعة', groups: ['A', 'B'] }
      ];
      
      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
      const times = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00'];
      const rooms = [
        { name: 'قاعة 101', capacity: 60 },
        { name: 'قاعة 102', capacity: 60 },
        { name: 'قاعة 201', capacity: 80 },
        { name: 'قاعة 202', capacity: 80 },
        { name: 'قاعة 301', capacity: 100 },
        { name: 'معمل 1', capacity: 40 },
        { name: 'معمل 2', capacity: 40 },
        { name: 'قاعة المحاضرات الكبرى', capacity: 200 }
      ];
      
      const assignments: any[] = [];
      let id = 1;
      
      courses.forEach(course => {
        course.groups.forEach(group => {
          const day = days[Math.floor(Math.random() * days.length)];
          const time = times[Math.floor(Math.random() * times.length)];
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          const enrolled = Math.floor(Math.random() * (room.capacity * 0.9)) + Math.floor(room.capacity * 0.3);
          const status = enrolled >= room.capacity * 0.9 ? 'ممتلئة' : enrolled >= room.capacity * 0.7 ? 'موشك على الامتلاء' : 'متاحة';
          
          assignments.push({
            id: id++,
            course_code: course.code,
            course_name: course.name,
            group: group,
            day: day,
            time: time,
            room: room.name,
            capacity: room.capacity,
            enrolled: enrolled,
            status: status
          });
        });
      });
      
      return assignments;
    })(),
    actions: [
      { type: 'add', label: 'تخصيص قاعة جديدة' },
      { type: 'edit', label: 'تعديل التخصيص' },
      { type: 'export', label: 'تصدير Excel' }
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
      { key: 'status', label: 'الحالة', type: 'status' }
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
            course_code: course.code,
            course_name: course.name,
            group: group,
            lecturer_name: lecturer.name,
            lecturer_title: lecturer.title,
            department: lecturer.dept,
            hours_per_week: course.hours,
            status: 'مكتمل'
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
      { key: 'entity', label: 'الكيان' },
      { key: 'details', label: 'التفاصيل', type: 'long_text' },
      { key: 'faculty', label: 'الكلية' }
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
    columns: [],
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
      { key: 'duration', label: 'المدة (سنوات)' },
      { key: 'total_hours', label: 'إجمالي الساعات' },
      { key: 'status', label: 'الحالة', type: 'status' }
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
      { key: 'status', label: 'الحالة', type: 'status' }
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
      { key: 'version', label: 'الإصدار' },
      { key: 'approval_date', label: 'تاريخ الاعتماد', type: 'date' },
      { key: 'status', label: 'الحالة', type: 'status' }
    ],
    data: [
      { bylaw_id: 'BYL-FCAI-2020', bylaw_name: 'لائحة كلية الحاسبات 2020', program: 'جميع البرامج', courses_count: '45', version: '1.0', approval_date: '2020-09-01', status: 'ساري' },
      { bylaw_id: 'BYL-CS-2022', bylaw_name: 'لائحة برنامج علوم الحاسب 2022', program: 'علوم الحاسب', courses_count: '38', version: '2.1', approval_date: '2022-03-15', status: 'ساري' },
      { bylaw_id: 'BYL-IS-2022', bylaw_name: 'لائحة برنامج نظم المعلومات 2022', program: 'نظم المعلومات', courses_count: '40', version: '2.0', approval_date: '2022-03-15', status: 'ساري' },
      { bylaw_id: 'BYL-AI-2023', bylaw_name: 'لائحة برنامج الذكاء الاصطناعي 2023', program: 'ذكاء اصطناعي', courses_count: '42', version: '1.0', approval_date: '2023-09-01', status: 'ساري' },
    ],
    actions: [
      { type: 'view', label: 'عرض المقررات' },
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
    columns: [{ key: 'msg', label: 'الرسالة' }],
    data: [{ msg: 'لا توجد بيانات متاحة حالياً' }],
    actions: []
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

  // Filter Student List by Faculty if facultyId is provided
  // This ensures the admin only sees students relevant to their faculty
  if (id === 'student_list' && facultyId && finalData && Array.isArray(finalData)) {
     const filteredData = finalData.filter((item: any) => item.faculty_code === facultyId);
     return {
        ...config,
        data: filteredData,
        description: `عرض وإدارة بيانات الطلاب التفصيلية (${filteredData.length} طالب لكلية الحاسبات)`
     };
  }

  // Filter attendance, registration issues, contact list, and id cards by faculty if needed
  if ((id === 'student_attendance' || id === 'manage_reg_issues' || id === 'contact_list' || id === 'id_cards') && facultyId && finalData && Array.isArray(finalData)) {
    // Filter by matching student IDs from FCAI students
    const fcaiStudentIds = FCAI_STUDENTS.map(s => s.student_id);
    const filteredData = finalData.filter((item: any) => {
      const studentId = item.student_id;
      return studentId && fcaiStudentIds.includes(studentId);
    });
    return {
      ...config,
      data: filteredData,
      description: config.description + ` (${filteredData.length} سجل)`
    };
  }

  return {
    ...config,
    data: finalData
  };
};