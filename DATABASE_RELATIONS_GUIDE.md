# دليل علاقات قاعدة البيانات - نظام إدارة شؤون الطلاب

## نظرة عامة
تم ربط جميع جداول قاعدة البيانات ببعضها البعض لإنشاء نظام متكامل ومترابط يوفر رؤية شاملة لبيانات الطلاب.

## الجداول الرئيسية والعلاقات

### 1. جدول الطلاب (Students) 👥
**عدد السجلات**: 3500 طالب
**المفتاح الأساسي**: `student_id`
**العلاقات**:
- يرتبط بجدول التسجيلات (1:N)
- يرتبط بجدول الدرجات (1:N)
- يرتبط بجدول الحضور (1:N)
- يرتبط بجدول السجلات المالية (1:N)

### 2. جدول المقررات (Courses) 📚
**عدد السجلات**: 25 مقرر
**المفتاح الأساسي**: `course_id`
**العلاقات**:
- يرتبط بجدول التسجيلات (1:N)
- يرتبط بجدول الدرجات (1:N)
- يرتبط بجدول الحضور (1:N)
- يرتبط بجدول الجداول الدراسية (1:N)

### 3. جدول تسجيلات المقررات (Student Enrollments) 📝
**عدد السجلات**: ~15,000 تسجيل
**المفتاح الأساسي**: `student_id + course_id + semester`
**المفاتيح الخارجية**:
- `student_id` → Students.student_id
- `course_id` → Courses.course_id

### 4. جدول الدرجات (Grades) 🎯
**عدد السجلات**: ~10,000 سجل درجات
**المفتاح الأساسي**: `student_id + course_id + semester`
**المفاتيح الخارجية**:
- `student_id` → Students.student_id
- `course_id` → Courses.course_id

### 5. جدول الحضور (Attendance) ✅
**عدد السجلات**: ~75,000 سجل حضور
**المفتاح الأساسي**: `student_id + course_id + date + session_type`
**المفاتيح الخارجية**:
- `student_id` → Students.student_id
- `course_id` → Courses.course_id

### 6. جدول السجلات المالية (Financial Records) 💰
**عدد السجلات**: ~8,000 معاملة مالية
**المفتاح الأساسي**: `student_id + type + description`
**المفاتيح الخارجية**:
- `student_id` → Students.student_id

### 7. جدول الجداول الدراسية (Course Schedules) 📅
**عدد السجلات**: ~50 جلسة دراسية
**المفتاح الأساسي**: `course_id + session_type + day + time`
**المفاتيح الخارجية**:
- `course_id` → Courses.course_id

## الصفحات المترابطة في النظام

### 1. صفحات البيانات الأساسية
- **قوائم الطلاب**: عرض جميع الطلاب مع إمكانية الفلترة
- **البحث المتقدم**: بحث متقدم عبر جميع الجداول
- **طلاب اللائحة القديمة/الجديدة**: فلترة حسب نوع اللائحة

### 2. صفحات البيانات المترابطة
- **تسجيلات المقررات**: عرض علاقة الطلاب بالمقررات
- **الدرجات التفصيلية**: درجات الطلاب مرتبطة بالتسجيلات
- **السجلات المالية**: المعاملات المالية لكل طالب
- **جداول المقررات**: مواعيد وأماكن المقررات

### 3. صفحات التحليل والإحصائيات
- **تحليل أداء الطلاب**: تحليل شامل يجمع بيانات من جميع الجداول
- **إحصائيات المقررات**: إحصائيات التسجيل والحضور والنجاح
- **الملف الشامل للطالب**: جمع جميع بيانات الطالب في مكان واحد

### 4. صفحات إدارية متخصصة
- **مشاكل التسجيل**: مرتبطة بالطلاب الفعليين
- **سجل الحضور**: مرتبط بالتسجيلات الفعلية
- **نظرة عامة على العلاقات**: مخطط قاعدة البيانات

## أمثلة على الاستعلامات المترابطة

### 1. الحصول على الملف الأكاديمي الكامل لطالب
```javascript
const getStudentCompleteProfile = (studentId) => {
  const student = ALL_STUDENTS.find(s => s.student_id === studentId);
  const enrollments = STUDENT_ENROLLMENTS.filter(e => e.student_id === studentId);
  const grades = STUDENT_GRADES.filter(g => g.student_id === studentId);
  const attendance = ATTENDANCE_RECORDS.filter(a => a.student_id === studentId);
  const financials = FINANCIAL_RECORDS.filter(f => f.student_id === studentId);
  
  return { student, enrollments, grades, attendance, financials };
};
```

### 2. إحصائيات مقرر شاملة
```javascript
const getCourseStatistics = (courseId) => {
  const course = COURSES_DATABASE.find(c => c.id === courseId);
  const enrollments = STUDENT_ENROLLMENTS.filter(e => e.course_id === courseId);
  const grades = STUDENT_GRADES.filter(g => g.course_id === courseId);
  const attendance = ATTENDANCE_RECORDS.filter(a => a.course_id === courseId);
  const schedule = COURSE_SCHEDULES.filter(s => s.course_id === courseId);
  
  return { course, enrollments, grades, attendance, schedule };
};
```

### 3. تحليل الأداء الأكاديمي
```javascript
const getPerformanceAnalysis = (studentId) => {
  const grades = STUDENT_GRADES.filter(g => g.student_id === studentId);
  const attendance = ATTENDANCE_RECORDS.filter(a => a.student_id === studentId);
  
  const avgGPA = grades.reduce((sum, g) => sum + g.grade_points, 0) / grades.length;
  const attendanceRate = attendance.filter(a => a.status === 'حاضر').length / attendance.length;
  
  return { avgGPA, attendanceRate, totalCourses: grades.length };
};
```

## المميزات المضافة

### 1. التكامل الكامل
- جميع البيانات مترابطة ومتسقة
- لا توجد بيانات معزولة أو غير مرتبطة
- إمكانية التنقل بين البيانات المرتبطة

### 2. التحليل الشامل
- تقارير تجمع بيانات من جداول متعددة
- إحصائيات متقدمة تعتمد على العلاقات
- رؤى تحليلية عميقة

### 3. سهولة الإدارة
- واجهات موحدة للبيانات المترابطة
- فلترة ذكية تحترم العلاقات
- تصدير شامل للبيانات المترابطة

### 4. الأداء المحسن
- استعلامات محسنة للبيانات المترابطة
- فهرسة ذكية للمفاتيح الخارجية
- تحميل تدريجي للبيانات الكبيرة

## إحصائيات العلاقات

| نوع العلاقة | عدد الروابط | مثال |
|-------------|-------------|-------|
| طالب ← تسجيلات | ~15,000 | كل طالب مسجل في 4-6 مقررات |
| طالب ← درجات | ~10,000 | 70% من التسجيلات لها درجات |
| طالب ← حضور | ~75,000 | ~15 جلسة حضور لكل تسجيل |
| طالب ← مالية | ~8,000 | 2-3 معاملات مالية لكل طالب |
| مقرر ← جداول | ~50 | 2-3 جلسات لكل مقرر |

## الخلاصة
تم إنشاء نظام قاعدة بيانات متكامل ومترابط يوفر:
- **3500 طالب** مع بياناتهم الكاملة
- **علاقات متعددة** تربط جميع جوانب العملية التعليمية
- **تقارير شاملة** تجمع البيانات من مصادر متعددة
- **واجهات سهلة** للوصول للبيانات المترابطة
- **تحليلات متقدمة** تعتمد على العلاقات

النظام جاهز للاستخدام ويوفر رؤية شاملة ومتكاملة لإدارة شؤون الطلاب! 🎉




