import React, { useEffect, useMemo, useState } from 'react';
import {
  attendanceApi,
  coursesApi,
  departmentsApi,
  enrollmentsApi,
  facultiesApi,
  financialApi,
  gradesApi,
  programsApi,
  schedulesApi,
  studentsApi,
  academicRulesApi,
  systemSettingsApi,
  courseClosuresApi,
  regulationsApi,
  reportSignaturesApi,
  courseEquivalencesApi,
  roomsApi,
  regRequestsApi as registrationRequestsApi,
  activityLogsApi,
  surveyRulesApi,
  announcementsApi,
  feeSetupApi
} from '../api';
import DynamicPage from './DynamicPage';
import { getPageConfig } from '../data/pageConfig';

interface DbBackedPageProps {
  pageId: string;
  title: string;
  facultyId?: string | null;
  initialSearchTerm?: string;
}

type TableResult = {
  columns: string[];
  rows: Record<string, any>[];
};

const DB_BACKED_IDS = new Set([
  'student_list',
  'advanced_student_search',
  'detailed_grades',
  'attendance_log',
  'detailed_attendance',
  'student_attendance',
  'financial_records',
  'fees_report',
  'course_catalog',
  'study_courses',
  'bylaw_courses',
  'student_course_enrollments',
  'course_schedules',
  'program_data',
  'view_departments',
  'manage_departments',
  'department_students',
  'department_statistics',
  'registered_students_report',
  'registered_students_stats',
  'registered_students_chart',
  'students_in_course',
  'unregistered_students',
  'students_by_gpa',
  'registered_courses_for_students',
  'registered_courses_count',
  'student_academic_profile',
  'student_complete_profile',
  'student_performance_analysis',
  'contact_list',
  'id_cards',
  'regulation_statistics',
  'course_enrollment_statistics',
  'database_relations_overview',
  'course_performance_analysis',
  'course_close',
  'program_rules',
  'view_programs',
  'report_signs',
  'study_regulations',
  'student_data_management',
  'equivalent_courses',
  'room_utilization',
  'student_personal_schedules',
  'instructor_workload',
  'assign_room',
  'instructor_assignments',
  'student_grades',
  'student_enrollments',
  'course_student_count',
  'lecturers',
  'old_regulation_students',
  'new_regulation_students',
  'academic_warnings',
  'military_edu',
  'student_fees',
  'uni_email',
  'survey_rules',
  'create_sched',
  'upload_courses',
  'payment_perm',
  'fees_setup',
  'fees_collect',
  'gpa_mod',
  'grad_year',
  'all_activities',
  'multiple_courses_reg',
  'modify_student_courses',
  'review_student_reg',
  'student_reg_form',
  'block_student_reg',
  'balance_reg',
  'block_reg_by_renewal',
  'add_room_assignment',
  'add_lecturer_assignment',
  'ai_department',
  'cs_department',
  'is_department',
  'it_department',
  'mi_department',
  'sec_department',
  'phys_department',
  'chem_department',
  'math_department',
  'zoo_department',
  'bot_department',
  'geol_department',
  'cvl_department',
  'mech_department',
  'elec_department',
  'arch_department',
  'cce_department',
  'acc_department',
  'mgt_department',
  'eco_department',
  'bis_department',
  'fmi_department',
  'registered_by_levels',
  'manage_reg_issues',
  'reg_form_issue',
  'level_mod',
  'id_card_view',
  'sys_edit',
  'default',
]);

export const isDbBackedPage = (pageId: string) => DB_BACKED_IDS.has(pageId);

const DbBackedPage: React.FC<DbBackedPageProps> = ({ pageId, title, facultyId, initialSearchTerm }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveVersion, setSaveVersion] = useState(0);
  const currentUser = {
    id: typeof localStorage !== 'undefined' ? localStorage.getItem('userStudentId') || '' : ''
  };
  const [result, setResult] = useState<TableResult>({ columns: [], rows: [] });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchForPage(pageId, facultyId || undefined, currentUser);
        setResult(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [pageId, facultyId, currentUser.id, saveVersion]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return result.rows;
    return result.rows.filter((r) =>
      Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(term))
    );
  }, [result.rows, searchTerm]);

  if (loading) {
    return <div className="p-6 text-gray-600 font-medium">جاري تحميل البيانات من قاعدة البيانات...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600 font-medium bg-red-50 rounded-lg">تعذر تحميل البيانات: {error}</div>;
  }

  // Get structure and UI metadata using getPageConfig
  const mockConfig = getPageConfig(pageId, facultyId);

  // Combine DB data with mock structure
  const baseDescription = mockConfig.description.split('(')[0].trim();
  const displayFaculty = facultyId === 'FCAI' ? 'كلية الحاسبات والذكاء الاصطناعي' : facultyId || '';
  const finalDescription = facultyId 
    ? `${baseDescription} (${result.rows.length} سجل - ${displayFaculty})`
    : `${baseDescription} (${result.rows.length} سجل)`;

  const combinedConfig = {
    ...mockConfig,
    id: pageId,
    title: title,
    description: finalDescription,
    // Provide fallback column definitions if mockConfig doesn't have them
    columns: mockConfig.columns?.length 
      ? mockConfig.columns 
      : result.columns.map(c => ({ key: c, label: c, type: 'text' as const })),
    data: result.rows,
  };

  return (
    <div className="h-full w-full">
      <DynamicPage config={combinedConfig as any} selectedFacultyId={facultyId} initialSearchTerm={initialSearchTerm} onSaveSuccess={() => setSaveVersion(v => v + 1)} />
    </div>
  );
};

async function fetchForPage(pageId: string, facultyId?: string, currentUser?: { id: string }): Promise<TableResult> {
  const mapStudentToUI = (s: any) => {
    // Convert numeric level to string e.g. 1 -> Level 1
    const levels = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
    const levelStr = s.level && typeof s.level === 'number'
      ? `المستوى ${levels[s.level - 1] || s.level}`
      : s.level;

    return {
      ...s,
      id: s.student_id,   // DynamicPage uses `id` for API updates
      faculty: s.faculty_id,
      department: s.department_id || 'عام',
      level: levelStr,    // display string for UI
      level_raw: s.level, // numeric level for API calls
    };
  };

  if (pageId === 'student_list' || pageId === 'department_students') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    return {
      columns: ['student_id', 'name', 'national_id', 'faculty', 'department', 'level', 'status', 'regulation', 'gpa', 'fees_status'],
      rows: students.map((s: any) => ({
        ...mapStudentToUI(s),
        faculty: s.faculty_id, // Ensure key matches pageConfig
        department: s.department_id || 'عام',
      })),
    };
  }

  if (pageId === 'advanced_student_search') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    return {
      columns: [
        'student_id',
        'name',
        'faculty',
        'department',
        'level',
        'status',
        'regulation',
        'phone',
        'email',
        'fees_status',
      ],
      rows: students.map((s: any) => ({
        ...mapStudentToUI(s),
        faculty: s.faculty_id,
        department: s.department_id || 'عام',
      })),
    };
  }

  if (pageId === 'regulation_statistics') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const byReg = new Map<string, { total: number; fcai: number; other: number; active: number; gpaSum: number; count: number }>();
    students.forEach((s: any) => {
      const r = s.regulation || 'غير محدد';
      const entry = byReg.get(r) || { total: 0, fcai: 0, other: 0, active: 0, gpaSum: 0, count: 0 };
      entry.total++;
      if (s.faculty_id === 'FCAI') entry.fcai++;
      else entry.other++;
      if (s.status === 'مسجل' || s.status === 'نشط') entry.active++;
      entry.gpaSum += s.gpa || 0;
      entry.count++;
      byReg.set(r, entry);
    });
    return {
      columns: ['regulation', 'total_students', 'fcai_students', 'other_students', 'active_students', 'average_gpa'],
      rows: Array.from(byReg.entries()).map(([regulation, data]) => ({
        regulation,
        total_students: data.total,
        fcai_students: data.fcai,
        other_students: data.other,
        active_students: data.active,
        average_gpa: (data.gpaSum / data.count).toFixed(2),
      })),
    };
  }

  if (pageId === 'contact_list') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    return {
      columns: ['student_id', 'name', 'phone', 'email', 'faculty', 'department', 'level', 'status'],
      rows: students.map((s: any) => ({
        id: s.student_id,
        ...s,
        faculty: s.faculty_id,
        department: s.department_id || 'N/A',
      })),
    };
  }

  if (pageId === 'id_cards') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    return {
      columns: ['student_id', 'name', 'national_id', 'faculty_id', 'department_id', 'level', 'status', 'regulation'],
      rows: (students as any[]).map((s: any) => ({ ...s, id: s.student_id })),
    };
  }

  if (pageId === 'course_enrollment_statistics') {
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseIds = new Set((courses as any[]).map((c) => c.id));
    const courseMap = new Map((courses as any[]).map((c) => [c.id, c]));

    const [enrollments, grades, attendance] = await Promise.all([
      enrollmentsApi.listAll({}),
      gradesApi.listAll({}),
      attendanceApi.listAll({ faculty_id: facultyId || undefined }),
    ]);

    // Build per-course maps
    const enrollMap = new Map<string, any[]>();
    (enrollments as any[]).filter(e => courseIds.has(e.course_id)).forEach(e => {
      const arr = enrollMap.get(e.course_id) || []; arr.push(e); enrollMap.set(e.course_id, arr);
    });
    const gradeMap = new Map<string, any[]>();
    (grades as any[]).filter(g => courseIds.has(g.course_id)).forEach(g => {
      const arr = gradeMap.get(g.course_id) || []; arr.push(g); gradeMap.set(g.course_id, arr);
    });
    const attendMap = new Map<string, any[]>();
    (attendance as any[]).filter(a => courseIds.has(a.course_id)).forEach(a => {
      const arr = attendMap.get(a.course_id) || []; arr.push(a); attendMap.set(a.course_id, arr);
    });

    const rows = (courses as any[]).map((course: any) => {
      const courseEnrollments = enrollMap.get(course.id) || [];
      const courseGrades      = gradeMap.get(course.id) || [];
      const courseAttendance  = attendMap.get(course.id) || [];

      const active    = courseEnrollments.filter((e: any) => e.status === 'مسجل' || e.status === 'نشط').length;
      const withdrawn = courseEnrollments.filter((e: any) => e.status === 'منسحب').length;
      const passed    = courseGrades.filter((g: any) => Number(g.total) >= 60).length;
      const passRate  = courseGrades.length > 0 ? ((passed / courseGrades.length) * 100).toFixed(1) + '%' : '-';
      const present   = courseAttendance.filter((a: any) => a.status === 'حاضر' || a.status === 'present').length;
      const avgAttendance = courseAttendance.length > 0
        ? ((present / courseAttendance.length) * 100).toFixed(1) + '%' : '-';

      return {
        id:             course.id,
        course_id:      course.id,
        course_name:    course.name,
        total_enrolled: courseEnrollments.length,
        active_students: active,
        withdrawn_students: withdrawn,
        average_attendance: avgAttendance,
        pass_rate:      passRate,
      };
    });

    return {
      columns: ['course_id', 'course_name', 'total_enrolled', 'active_students', 'withdrawn_students', 'average_attendance', 'pass_rate'],
      rows,
    };
  }

  if (pageId === 'database_relations_overview') {
    const [faculties, depts, students, courses, enrollments] = await Promise.all([
      facultiesApi.list(),
      departmentsApi.list(facultyId),
      studentsApi.listAll({ faculty_id: facultyId }),
      coursesApi.list({ faculty_id: facultyId }),
      enrollmentsApi.listAll({}),
    ]);
    const studentIds = new Set((students as any[]).map((s) => s.student_id));
    const enrollmentsFaculty = (enrollments as any[]).filter((e) => studentIds.has(e.student_id));
    return {
      columns: ['table_name', 'record_count', 'related_tables', 'primary_key', 'foreign_keys'],
      rows: [
        { table_name: 'Faculties', record_count: faculties.length, related_tables: 'Students, Departments', primary_key: 'id', foreign_keys: 'none' },
        { table_name: 'Departments', record_count: depts.length, related_tables: 'Students, Courses', primary_key: 'id', foreign_keys: 'faculty_id' },
        { table_name: 'Students', record_count: students.length, related_tables: 'Enrollments, Grades', primary_key: 'id', foreign_keys: 'faculty_id' },
        { table_name: 'Courses', record_count: (courses as any[]).length, related_tables: 'Enrollments, Grades', primary_key: 'id', foreign_keys: 'faculty_id' },
        { table_name: 'Enrollments', record_count: enrollmentsFaculty.length, related_tables: 'Students, Courses', primary_key: 'id', foreign_keys: 'student_id, course_id' },
      ],
    };
  }

  if (pageId === 'course_performance_analysis') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentIds = new Set((students as any[]).map((s) => s.student_id));
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseIds = new Set((courses as any[]).map((c) => c.id));
    const courseMap = new Map((courses as any[]).map((c) => [c.id, c]));
    const [grades, enrollments, attendance] = await Promise.all([
      gradesApi.listAll({}),
      enrollmentsApi.listAll({}),
      attendanceApi.list({ faculty_id: facultyId }),
    ]);
    const byCourse = new Map<string, { enrollments: number; grades: number; gradeSum: number; passed: number; attendanceSum: number; attendanceCount: number }>();
    (enrollments as any[]).forEach((e) => {
      if (!courseIds.has(e.course_id)) return;
      const cur = byCourse.get(e.course_id) || { enrollments: 0, grades: 0, gradeSum: 0, passed: 0, attendanceSum: 0, attendanceCount: 0 };
      cur.enrollments++;
      byCourse.set(e.course_id, cur);
    });
    (grades as any[]).forEach((g) => {
      if (!studentIds.has(g.student_id) || !courseIds.has(g.course_id)) return;
      const t = Number(g.total);
      if (Number.isNaN(t)) return;
      const cur = byCourse.get(g.course_id) || { enrollments: 0, grades: 0, gradeSum: 0, passed: 0, attendanceSum: 0, attendanceCount: 0 };
      cur.grades++;
      cur.gradeSum += t;
      if (t >= 60) cur.passed += 1;
      byCourse.set(g.course_id, cur);
    });
    (attendance as any[]).forEach((a) => {
      if (!courseIds.has(a.course_id)) return;
      const cur = byCourse.get(a.course_id) || { enrollments: 0, grades: 0, gradeSum: 0, passed: 0, attendanceSum: 0, attendanceCount: 0 };
      if (a.status === 'حاضر' || a.status === 'present') {
        cur.attendanceSum++;
      }
      cur.attendanceCount++;
      byCourse.set(a.course_id, cur);
    });
    return {
      columns: ['course_id', 'course_name', 'enrolled_count', 'completed_count', 'average_grade', 'attendance_rate', 'pass_rate'],
      rows: Array.from(byCourse.entries()).map(([course_id, v]) => ({
        course_id,
        course_name: (courseMap.get(course_id) as any)?.name || course_id,
        enrolled_count: v.enrollments,
        completed_count: v.grades,
        average_grade: v.grades ? Math.round((v.gradeSum / v.grades) * 100) / 100 : '-',
        attendance_rate: v.attendanceCount > 0 ? ((v.attendanceSum / v.attendanceCount) * 100).toFixed(1) + '%' : '-',
        pass_rate: v.grades ? ((v.passed / v.grades) * 100).toFixed(1) + '%' : '-',
      })),
    };
  }

  if (pageId === 'program_data') {
    const programs = await programsApi.list({});
    return {
      columns: ['program_id', 'program_name', 'degree', 'department', 'total_hours'],
      rows: programs.map((p: any) => ({
        id: p.id,
        program_id: p.id,
        program_name: p.name,
        degree: p.degree || 'بكالوريوس',
        department: p.department_id || 'N/A',
        total_hours: p.total_hours || 0,
      }))
    };
  }

  if (pageId === 'view_departments') {
    const departments = await departmentsApi.list(facultyId);
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const programs = await programsApi.list({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const studentsByDept = new Map<string, number>();
    const programsByDept = new Map<string, number>();
    const coursesByDept = new Map<string, number>();
    students.forEach((s: any) => { const d = s.department_id || 'N/A'; studentsByDept.set(d, (studentsByDept.get(d) || 0) + 1); });
    (programs as any[]).forEach((p) => { const d = p.department_id || 'N/A'; programsByDept.set(d, (programsByDept.get(d) || 0) + 1); });
    (courses as any[]).forEach((c) => { const d = c.department_id || 'N/A'; coursesByDept.set(d, (coursesByDept.get(d) || 0) + 1); });
    return {
      columns: ['code', 'name', 'students_count', 'programs_count', 'courses_count'],
      rows: (departments as any[]).map((d) => ({
        id: d.id,
        code: d.code || '-',
        name: d.name,
        students_count: studentsByDept.get(d.id) || 0,
        programs_count: programsByDept.get(d.id) || 0,
        courses_count: coursesByDept.get(d.id) || 0,
      })),
    };
  }

  if (pageId === 'manage_departments') {
    const departments = await departmentsApi.list(facultyId);
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentsByDept = new Map<string, number>();
    students.forEach((s: any) => { const d = s.department_id || 'N/A'; studentsByDept.set(d, (studentsByDept.get(d) || 0) + 1); });
    return {
      columns: ['code', 'name', 'head_name', 'students_count'],
      rows: (departments as any[]).map((d) => ({
        id: d.id,
        code: d.code || '-',
        name: d.name,
        head_name: d.head_name || '-',
        students_count: studentsByDept.get(d.id) || 0,
      })),
    };
  }

  if (pageId === 'department_statistics') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const departments = await departmentsApi.list(facultyId);
    const deptMap = new Map((departments as any[]).map((d) => [d.id, d.name]));
    const byDept = new Map<string, { total: number; level1: number; level2: number; level3: number; level4: number; gpaSum: number; count: number }>();
    students.forEach((s: any) => {
      const d = s.department_id || 'N/A';
      const entry = byDept.get(d) || { total: 0, level1: 0, level2: 0, level3: 0, level4: 0, gpaSum: 0, count: 0 };
      entry.total++;
      if (s.level === 1 || s.level === '1') entry.level1++;
      else if (s.level === 2 || s.level === '2') entry.level2++;
      else if (s.level === 3 || s.level === '3') entry.level3++;
      else if (s.level === 4 || s.level === '4') entry.level4++;
      entry.gpaSum += s.gpa || 0;
      entry.count++;
      byDept.set(d, entry);
    });
    return {
      columns: ['department', 'total_students', 'level_1', 'level_2', 'level_3', 'level_4', 'avg_gpa'],
      rows: Array.from(byDept.entries()).map(([dept_id, v]) => ({
        id: dept_id,
        department: deptMap.get(dept_id) || dept_id,
        total_students: v.total,
        level_1: v.level1,
        level_2: v.level2,
        level_3: v.level3,
        level_4: v.level4,
        avg_gpa: v.count ? (v.gpaSum / v.count).toFixed(2) : '-',
      })),
    };
  }

  if (pageId === 'course_catalog' || pageId === 'study_courses') {
    const courses = await coursesApi.list({ faculty_id: facultyId });
    return {
      columns: pageId === 'course_catalog' ? ['id', 'name', 'level', 'department', 'hours', 'type', 'semester'] : ['course_code', 'course_name', 'program', 'level', 'hours', 'type', 'semester'],
      rows: (courses as any[]).map((c) => ({
        id: c.id,
        course_code: c.id,
        name: c.name,
        course_name: c.name,
        department: c.department_id || 'عام',
        program: c.department_id || 'عام',
        level: pageId === 'course_catalog' ? (c.level || 1) : `المستوى ${c.level || 1}`,
        hours: c.credit_hours || 3,
        type: c.course_type || 'إجباري',
        semester: c.semester || '-',
      }))
    };
  }

  if (pageId === 'bylaw_courses') {
    const [regulations, courses] = await Promise.all([
      regulationsApi.list({}),
      coursesApi.list({ faculty_id: facultyId }),
    ]);
    return {
      columns: ['bylaw_id', 'bylaw_name', 'program', 'courses_count', 'approval_date'],
      rows: (regulations as any[]).map((r: any) => ({
        id: r.id,
        bylaw_id: r.id,
        bylaw_name: r.name,
        program: r.program_name || r.program_id || 'عام',
        courses_count: (courses as any[]).filter((c) => c.program_id === r.program_id).length,
        approval_date: r.created_at ? r.created_at.toString().split('T')[0] : '',
      })),
    };
  }

  if (pageId === 'course_schedules') {
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseIds = new Set(courses.map((c: any) => c.id));
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));
    const [schedules, rooms] = await Promise.all([
      schedulesApi.list({}),
      roomsApi.list({}),
    ]);
    const roomMap = new Map((rooms as any[]).map((r) => [r.id, r]));
    const filtered = (schedules as any[]).filter((s) => courseIds.has(s.course_id));
    return {
      columns: ['course_id', 'course_name', 'session_type', 'day', 'time', 'room', 'instructor', 'level', 'department'],
      rows: filtered.map((s: any) => {
        const course = courseMap.get(s.course_id);
        const room = s.room_id ? roomMap.get(s.room_id) : null;
        return {
          id: s.id,
          course_id: s.course_id,
          course_name: course?.name || '-',
          session_type: s.session_type || '-',
          day: s.day || '-',
          time: s.time_label || `${s.time_start || ''} - ${s.time_end || ''}`.trim() || '-',
          room: room?.name || s.room_id || '-',
          instructor: s.instructor || '-',
          level: course?.level || '-',
          department: course?.department_id || '-',
        };
      }),
    };
  }

  if (pageId === 'student_course_enrollments') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentIds = new Set(students.map((s: any) => s.student_id));
    const [enrollments, courses] = await Promise.all([
      enrollmentsApi.listAll({}),
      coursesApi.list({ faculty_id: facultyId }),
    ]);
    const courseMap = new Map((courses as any[]).map((c) => [c.id, c]));
    const filtered = (enrollments as any[]).filter((e) => studentIds.has(e.student_id));
    return {
      columns: ['student_id', 'course_id', 'course_name', 'semester', 'status'],
      rows: filtered.map((e: any) => ({
        student_id: e.student_id,
        course_id: e.course_id,
        course_name: (courseMap.get(e.course_id) as any)?.name || '-',
        semester: e.semester || '-',
        status: e.status || '-',
      })),
    };
  }

  if (pageId === 'registered_courses_for_students') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentIds = new Set(students.map((s: any) => s.student_id));
    const enrollments = await enrollmentsApi.listAll({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseMap = new Map((courses as any[]).map((c) => [c.id, c]));
    const byStudent = new Map<string, { name: string; courseNames: string[]; totalHours: number }>();
    students.forEach((s: any) => {
      byStudent.set(s.student_id, { name: s.name, courseNames: [], totalHours: 0 });
    });
    (enrollments as any[])
      .filter((e) => studentIds.has(e.student_id))
      .forEach((e) => {
        const course = courseMap.get(e.course_id) as any;
        const student = byStudent.get(e.student_id);
        if (student && course) {
          student.courseNames.push(course.name);
          student.totalHours += course.credit_hours || 3;
        }
      });
    return {
      columns: ['student_id', 'name', 'courses', 'total_hours'],
      rows: Array.from(byStudent.entries()).map(([student_id, data]) => ({
        student_id,
        name: data.name,
        courses: data.courseNames.join(', '),
        total_hours: data.totalHours,
      })),
    };
  }

  if (pageId === 'detailed_grades') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentIds = new Set(students.map((s: any) => s.student_id));
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseMap = new Map((courses as any[]).map((c) => [c.id, c]));
    const grades = await gradesApi.listAll({});

    let rows = (grades as any[])
      .filter((g) => studentIds.has(g.student_id))
      .map((g) => ({
        id:          g.id,
        student_id:  g.student_id,
        course_id:   g.course_id,
        course_name: (courseMap.get(g.course_id) as any)?.name || '',
        semester:    g.semester || 'N/A',
        midterm:     g.midterm ?? g.year_work ?? '-',
        final:       g.final ?? g.final_exam ?? '-',
        assignments: g.assignments ?? g.practical ?? '-',
        total:       Number(g.total) || 0,
        grade_letter: g.grade_letter || '-',
        grade_points: g.grade_points ?? '-',
      }));

    return {
      columns: ['student_id', 'course_id', 'course_name', 'semester', 'midterm', 'final', 'assignments', 'total', 'grade_letter', 'grade_points'],
      rows,
    };
  }

  if (pageId === 'attendance_log' || pageId === 'detailed_attendance' || pageId === 'student_attendance') {
    const [attendance, courses, students] = await Promise.all([
      attendanceApi.listAll({ faculty_id: facultyId || undefined }),
      coursesApi.list({ faculty_id: facultyId || undefined }),
      studentsApi.listAll({ faculty_id: facultyId || undefined }),
    ]);
    const courseMap = new Map((courses as any[]).map(c => [c.id, c.name]));
    const studentMap = new Map((students as any[]).map(s => [s.student_id, s.name]));

    const rows = (attendance as any[]).map((a: any) => {
      const attDate = a.attendance_date ? new Date(a.attendance_date) : new Date();
      return {
        id:           a.id,
        student_id:   a.student_id,
        student_name: studentMap.get(a.student_id) || '-',
        course_id:    a.course_id,
        course_name:  courseMap.get(a.course_id) || a.course_id,
        week:         a.week_number ? `الأسبوع ${a.week_number}` : '-',
        date:         attDate.toISOString().split('T')[0],
        session_type: a.session_type || 'محاضرة',
        status:       a.status || 'حاضر',
      };
    });

    const columns = pageId === 'detailed_attendance'
      ? ['student_id', 'course_id', 'course_name', 'week', 'date', 'session_type', 'status']
      : ['student_id', 'student_name', 'course_id', 'course_name', 'session_type', 'week', 'date', 'status'];

    return {
      columns,
      rows
    };
  }


  if (pageId === 'financial_records' || pageId === 'fees_report') {
    const [financial, students] = await Promise.all([
      financialApi.listAll({ faculty_id: facultyId || undefined }),
      studentsApi.listAll({ faculty_id: facultyId || undefined }),
    ]);
    const stuMap = new Map((students as any[]).map(s => [s.student_id, s.name]));

    const rows = (financial as any[]).map(f => ({
      id: f.id,
      student_id: f.student_id,
      name: stuMap.get(f.student_id) || 'طالب غير معروف',
      fee_type: f.fee_type || 'رسوم دراسية',
      amount: f.amount,           // keep as number for API
      paid_amount: f.paid_amount, // keep as number for API
      remaining: f.amount - f.paid_amount,
      status: f.paid_amount >= f.amount ? 'مسدد' : 'متبقي',
      due_date: f.due_date ? f.due_date.toString().split('T')[0] : '', // ISO for date picker
      semester: f.semester || '',
    }));

    return {
      columns: ['student_id', 'name', 'fee_type', 'amount', 'paid_amount', 'remaining', 'status', 'due_date'],
      rows,
    };
  }

  if (pageId === 'course_close') {
    const closures = await courseClosuresApi.list({});
    // Keep closure_date as ISO (yyyy-MM-dd) so modal date-picker works correctly
    const rows = (closures as any[]).map(c => ({
      ...c,
      closure_date: c.closure_date ? c.closure_date.toString().split('T')[0] : '',
    }));
    return {
      columns: ['course_code', 'course_name', 'academic_year', 'semester', 'closure_date', 'status'],
      rows,
    };
  }

  if (pageId === 'program_rules') {
    if (!facultyId) return { columns: ['message'], rows: [{ message: 'يرجى اختيار الكلية' }] };
    try {
      const ruleResp = await academicRulesApi.getByFaculty(facultyId);
      if (!ruleResp) return { columns: ['message'], rows: [{ message: 'لا توجد قواعد أكاديمية مضافة لهذه الكلية بعد' }] };
      const rd = ruleResp?.rules_data || {};
      const rows = [
        { rule_id: 'R1', program: 'عام', rule_type: 'الحد الأدنى للساعات', description: `${rd.min_credit_hours ?? '-'} ساعة`, version: '1.0', status: 'ساري' },
        { rule_id: 'R2', program: 'عام', rule_type: 'الحد الأقصى للساعات', description: `${rd.max_credit_hours ?? '-'} ساعة`, version: '1.0', status: 'ساري' },
        { rule_id: 'R3', program: 'عام', rule_type: 'درجة النجاح', description: `${rd.pass_grade ?? '-'}%`, version: '1.0', status: 'ساري' },
        { rule_id: 'R4', program: 'عام', rule_type: 'الحد الأدنى للمعدل', description: `${rd.gpa_pass ?? '-'}`, version: '1.0', status: 'ساري' },
      ].filter(r => !r.description.includes('-'));
      if (rows.length === 0) return { columns: ['message'], rows: [{ message: 'لا توجد قواعد محددة بعد' }] };
      return { columns: ['rule_id', 'program', 'rule_type', 'description', 'version', 'status'], rows };
    } catch {
      return { columns: ['message'], rows: [{ message: 'لا توجد قواعد مضافة لهذه الكلية بعد' }] };
    }
  }

  if (pageId === 'view_programs') {
    const progs = await programsApi.list({});
    return { columns: ['id', 'name', 'code', 'degree', 'department_id'], rows: progs };
  }

  if (pageId === 'report_signs') {
    const signs = await reportSignaturesApi.list();
    return { columns: ['id', 'report_name', 'signatory_name', 'title', 'order', 'is_active'], rows: signs };
  }

  if (pageId === 'study_regulations') {
    const regs = await regulationsApi.list({});
    return { columns: ['id', 'name', 'program_id', 'mandatory_hours', 'elective_hours'], rows: regs };
  }

  if (pageId === 'equivalent_courses') {
    const equivalences = await courseEquivalencesApi.list({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    // Expand equivalences with course and program details
    const rows = (equivalences as any[]).map((eq) => {
      const origCourse = courseMap.get(eq.original_course_id);
      const equivCourse = courseMap.get(eq.equivalent_course_id);

      return {
        id: eq.id,
        course_code: eq.original_course_id,
        course_name: origCourse?.name || eq.original_course_id,
        program: origCourse?.faculty_id || 'N/A',
        equivalent_course: eq.equivalent_course_id,
        equivalent_program: equivCourse?.faculty_id || 'N/A',
        status: eq.status,
      };
    }).filter(row =>
      // Filter to show equivalences where at least one course belongs to selected faculty
      facultyId ? (row.program === facultyId || row.equivalent_program === facultyId) : true
    );

    return {
      columns: ['course_code', 'course_name', 'program', 'equivalent_course', 'equivalent_program', 'status'],
      rows,
    };
  }

  if (pageId === 'room_utilization') {
    const rooms = await roomsApi.list({});
    const schedules = await schedulesApi.list({});

    // Filter rooms by faculty if specified
    const facultyRooms = facultyId
      ? (rooms as any[]).filter((r: any) => r.faculty_id === facultyId)
      : rooms;

    // Calculate utilization statistics per room
    const rows = (facultyRooms as any[]).map((room: any) => {
      const roomSchedules = (schedules as any[]).filter((s: any) => s.room_id === room.id);
      const totalSlots = 5 * 5; // 5 days × 5 time slots per week
      const utilizationRate = totalSlots > 0
        ? ((roomSchedules.length / totalSlots) * 100).toFixed(1) + '%'
        : '0%';

      // Find peak day
      const dayCount = new Map<string, number>();
      roomSchedules.forEach((s: any) => {
        dayCount.set(s.day || 'N/A', (dayCount.get(s.day || 'N/A') || 0) + 1);
      });
      const peakDay = dayCount.size > 0
        ? Array.from(dayCount.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : 'N/A';

      // Find peak time
      const timeCount = new Map<string, number>();
      roomSchedules.forEach((s: any) => {
        timeCount.set(s.session_type || 'N/A', (timeCount.get(s.session_type || 'N/A') || 0) + 1);
      });
      const peakTime = timeCount.size > 0
        ? Array.from(timeCount.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : 'N/A';

      return {
        id: room.id,
        room: room.code || room.name,
        total_sessions: roomSchedules.length,
        utilization_rate: utilizationRate,
        peak_day: peakDay,
        peak_time: peakTime,
      };
    });

    return {
      columns: ['room', 'total_sessions', 'utilization_rate', 'peak_day', 'peak_time'],
      rows,
    };
  }

  if (pageId === 'student_personal_schedules') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentIds = new Set(students.map((s: any) => s.student_id));
    const enrollments = await enrollmentsApi.listAll({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));
    const schedules = await schedulesApi.list({});

    // Get schedule details for enrolled courses
    const rows: any[] = [];
    (enrollments as any[])
      .filter((e) => studentIds.has(e.student_id))
      .forEach((enrollment) => {
        const course = courseMap.get(enrollment.course_id);
        if (!course) return;

        const courseSchedules = (schedules as any[]).filter((s) => s.course_id === enrollment.course_id);

        if (courseSchedules.length === 0) {
          // If no schedule, still show the enrollment
          rows.push({
            id: enrollment.id,
            student_id: enrollment.student_id,
            course_id: enrollment.course_id,
            course_name: course.name,
            session_type: 'N/A',
            day: 'N/A',
            time: 'N/A',
            room: 'N/A',
            instructor: 'N/A',
          });
        } else {
          // Add a row for each schedule session
          courseSchedules.forEach((schedule) => {
            rows.push({
              id: schedule.id,
              student_id: enrollment.student_id,
              course_id: enrollment.course_id,
              course_name: course.name,
              session_type: schedule.session_type || 'N/A',
              day: schedule.day || 'N/A',
              time: schedule.time_start && schedule.time_end ? `${schedule.time_start} - ${schedule.time_end}` : (schedule.time_label || 'N/A'),
              room: schedule.room_id || 'N/A',
              instructor: schedule.instructor || 'N/A',
            });
          });
        }
      });

    return {
      columns: ['student_id', 'course_id', 'course_name', 'session_type', 'day', 'time', 'room', 'instructor'],
      rows,
    };
  }

  if (pageId === 'instructor_workload') {
    const schedules = await schedulesApi.list({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseIds = new Set(courses.map((c: any) => c.id));

    // Filter schedules to faculty
    const facultySchedules = (schedules as any[]).filter((s) => courseIds.has(s.course_id));

    // Group by instructor
    const instructorMap = new Map<string, { courses: Set<string>; hours: number; departments: Set<string> }>();
    facultySchedules.forEach((schedule) => {
      const instructor = schedule.instructor || 'غير محدد';
      if (!instructorMap.has(instructor)) {
        instructorMap.set(instructor, { courses: new Set(), hours: 0, departments: new Set() });
      }
      const data = instructorMap.get(instructor)!;
      data.courses.add(schedule.course_id);
      data.hours += Number(schedule.hours_per_session || schedule.duration || 2);
      if (schedule.department) data.departments.add(schedule.department);
    });

    const rows = Array.from(instructorMap.entries()).map(([instructor, data]) => ({
      id: instructor,
      instructor,
      total_courses: data.courses.size,
      total_sessions: data.hours > 0 ? Math.ceil(data.hours / 2) : 0,
      teaching_hours: data.hours,
      departments: Array.from(data.departments).join(', ') || 'N/A',
    }));

    return {
      columns: ['instructor', 'total_courses', 'total_sessions', 'teaching_hours', 'departments'],
      rows,
    };
  }

  if (pageId === 'assign_room') {
    const [courses, schedules, rooms] = await Promise.all([
      coursesApi.list({ faculty_id: facultyId }),
      schedulesApi.list({}),
      roomsApi.list({}),
    ]);
    const courseIds = new Set(courses.map((c: any) => c.id));
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));
    const roomMap = new Map((rooms as any[]).map((r) => [r.id, r]));
    const facultySchedules = (schedules as any[]).filter((s) => courseIds.has(s.course_id));

    const rows = facultySchedules.map((schedule) => {
      const room = schedule.room_id ? roomMap.get(schedule.room_id) : null;
      return {
        id: schedule.id,
        course_code: courseMap.get(schedule.course_id)?.code || schedule.course_id,
        course_name: courseMap.get(schedule.course_id)?.name || '-',
        group: schedule.group_label || 'أ',
        day: schedule.day || '-',
        time: schedule.time_label || `${schedule.time_start || ''} - ${schedule.time_end || ''}`.trim() || '-',
        room: room?.name || schedule.room_id || '-',
        room_type: room?.room_type || '-',
        capacity: room?.capacity || schedule.enrolled_count || '-',
        enrolled: schedule.enrolled_count || 0,
        instructor: schedule.instructor || '-',
        status: schedule.room_id ? 'مُعيَّن' : 'بانتظار التعيين',
        actions: '',
      };
    });

    return {
      columns: ['course_code', 'course_name', 'group', 'day', 'time', 'room', 'room_type', 'capacity', 'enrolled', 'instructor', 'status', 'actions'],
      rows,
    };
  }

  if (pageId === 'instructor_assignments') {
    const schedules = await schedulesApi.list({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseIds = new Set(courses.map((c: any) => c.id));
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    // Filter schedules to faculty
    const facultySchedules = (schedules as any[]).filter((s) => courseIds.has(s.course_id));

    const rows = facultySchedules.map((schedule) => ({
      id: schedule.id,
      course_id: schedule.course_id,
      course_name: courseMap.get(schedule.course_id)?.name || schedule.course_id,
      instructor: schedule.instructor || 'غير محدد',
      day: schedule.day || 'N/A',
      session_type: schedule.session_type || 'محاضرة',
      status: schedule.instructor ? 'مُعيَّن' : 'بانتظار التعيين',
    }));

    return {
      columns: ['course_id', 'course_name', 'instructor', 'day', 'session_type', 'status'],
      rows,
    };
  }

  if (pageId === 'student_grades') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentIds = new Set(students.map((s: any) => s.student_id));
    const grades = await gradesApi.listAll({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    // Filter grades to faculty students
    const rows = (grades as any[])
      .filter((g) => studentIds.has(g.student_id))
      .map((grade) => {
        const course = courseMap.get(grade.course_id);
        return {
          id: grade.id,
          student_id: grade.student_id,
          course_id: grade.course_id,
          course_name: course?.name || grade.course_id,
          semester: grade.semester || 'N/A',
          grade_letter: grade.grade_letter || 'N/A',
          total: grade.total || 0,
          evaluation_date: grade.created_at ? grade.created_at.toString().split('T')[0] : '',
        };
      });

    return {
      columns: ['student_id', 'course_id', 'course_name', 'semester', 'grade_letter', 'total', 'evaluation_date'],
      rows,
    };
  }

  if (pageId === 'student_enrollments') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const studentIds = new Set(students.map((s: any) => s.student_id));
    const enrollments = await enrollmentsApi.listAll({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    // Filter enrollments to faculty students
    const rows = (enrollments as any[])
      .filter((e) => studentIds.has(e.student_id))
      .map((enrollment) => {
        const course = courseMap.get(enrollment.course_id);
        return {
          id: enrollment.id,
          student_id: enrollment.student_id,
          course_id: enrollment.course_id,
          course_name: course?.name || enrollment.course_id,
          semester: enrollment.semester || 'N/A',
          status: enrollment.status || 'مسجل',
        };
      });

    return {
      columns: ['student_id', 'course_id', 'course_name', 'semester', 'status'],
      rows,
    };
  }

  if (pageId === 'course_student_count') {
    const [students, enrollments, courses] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({}),
      coursesApi.list({ faculty_id: facultyId })
    ]);
    const studentIds = new Set(students.map((s: any) => s.student_id));

    // Count students per course
    const courseCount = new Map<string, number>();
    (enrollments as any[])
      .filter((e) => studentIds.has(e.student_id))
      .forEach((enrollment) => {
        courseCount.set(enrollment.course_id, (courseCount.get(enrollment.course_id) || 0) + 1);
      });

    const rows = (courses as any[]).map((course: any) => ({
      id: course.id,
      course_id: course.id,
      course_name: course.name,
      student_count: courseCount.get(course.id) || 0,
      level: course.level || '-',
    }));

    return {
      columns: ['course_id', 'course_name', 'student_count', 'level'],
      rows,
    };
  }

  if (pageId === 'lecturers') {
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const schedules = await schedulesApi.list({});

    // Generate lecturer assignments from schedules
    const rows: any[] = [];
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    (schedules as any[])
      .filter((s) => courseMap.has(s.course_id))
      .forEach((schedule) => {
        const course = courseMap.get(schedule.course_id);
        rows.push({
          id: schedule.id,
          course_code: schedule.course_id,
          course_name: course?.name || schedule.course_id,
          group: schedule.session_type || 'مجموعة 1',
          lecturer_name: schedule.instructor || 'غير محدد',
          lecturer_title: 'أستاذ',
          status: schedule.instructor ? 'معين' : 'بانتظار التعيين',
        });
      });

    return {
      columns: ['course_code', 'course_name', 'group', 'lecturer_name', 'lecturer_title', 'status'],
      rows,
    };
  }

  if (pageId === 'old_regulation_students' || pageId === 'new_regulation_students') {
    const regulation = pageId === 'old_regulation_students' ? 'لائحة قديمة' : 'لائحة جديدة';
    const students = await studentsApi.listAll({ faculty_id: facultyId, regulation });

    const rows = (students as any[]).map((student) => ({
      id: student.student_id,
      student_id: student.student_id,
      name: student.name,
      faculty: student.faculty_id,
      department: student.department_id || 'عام',
      level: student.level,
      gpa: student.gpa || 'N/A',
      status: student.status || 'مقيد',
    }));

    return {
      columns: ['student_id', 'name', 'faculty', 'department', 'level', 'gpa', 'status'],
      rows,
    };
  }

  if (pageId === 'academic_warnings') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const grades = await gradesApi.listAll({});

    // Calculate GPA and identify students with low GPA
    const studentGPA = new Map<string, number[]>();
    (grades as any[]).forEach((grade) => {
      if (!studentGPA.has(grade.student_id)) {
        studentGPA.set(grade.student_id, []);
      }
      const total = Number(grade.total) || 0;
      studentGPA.get(grade.student_id)!.push(total);
    });

    const rows = (students as any[])
      .map((student) => {
        const grades_array = studentGPA.get(student.student_id) || [];
        const avg = grades_array.length > 0 ? grades_array.reduce((a, b) => a + b) / grades_array.length : 0;
        const warning = avg < 60 ? 'تحذير' : avg < 70 ? 'متوسط' : 'جيد';

        return {
          id: student.student_id,
          student_id: student.student_id,
          name: student.name,
          gpa: (student.gpa || 0).toFixed(2),
          avg_grade: avg.toFixed(2),
          warning_level: warning,
          status: warning === 'تحذير' ? 'بحاجة متابعة' : 'جيد',
        };
      })
      .filter((s) => s.warning_level !== 'جيد'); // Show only students with warnings

    return {
      columns: ['student_id', 'name', 'gpa', 'avg_grade', 'warning_level', 'status'],
      rows,
    };
  }

  if (pageId === 'military_edu') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    // Try to get real military education data from student_profiles
    let profileMap: Record<string, any> = {};
    try {
      // Fetch all student profiles in one shot via the students endpoint (profiles are included)
      students.forEach((s: any) => {
        profileMap[s.student_id] = {
          mil_edu_status: s.mil_edu_status || null,
          mil_edu_completion: s.mil_edu_completion || null,
          mil_edu_notes: s.mil_edu_notes || null,
        };
      });
    } catch { /* non-fatal */ }

    const rows = (students as any[]).map((student) => {
      const profile = profileMap[student.student_id] || {};
      return {
        id: student.student_id,
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        military_status: profile.mil_edu_status || (() => {
          const lvl = Number(student.level) || 0;
          if (lvl <= 1) return 'لم يبدأ';
          if (lvl <= 2) return 'جاري';
          return 'مكتمل';
        })(),
        completion_date: profile.mil_edu_completion || '-',
        notes: profile.mil_edu_notes || 'لا توجد ملاحظات',
      };
    });

    return {
      columns: ['student_id', 'name', 'level', 'military_status', 'completion_date', 'notes'],
      rows,
    };
  }

  if (pageId === 'student_fees') {
    const financial = await financialApi.listAll({ faculty_id: facultyId });

    const feesByType = new Map<string, { amount: number; paid: number; remaining: number; count: number }>();
    (financial as any[]).forEach((record: any) => {
      const feeType = record.fee_type || 'رسوم عامة';
      if (!feesByType.has(feeType)) {
        feesByType.set(feeType, { amount: 0, paid: 0, remaining: 0, count: 0 });
      }
      const data = feesByType.get(feeType)!;
      data.amount += Number(record.amount) || 0;
      data.paid += Number(record.paid_amount) || 0;
      data.count += 1;
    });

    const rows = Array.from(feesByType.entries()).map(([item, data]) => {
      const remaining = data.amount - data.paid;
      return {
        id: item,
        item,
        amount: data.amount.toFixed(2),
        paid: data.paid.toFixed(2),
        remaining: remaining.toFixed(2),
        status: remaining <= 0 ? 'مسدد' : (data.paid > 0 ? 'مسدد جزئياً' : 'غير مسدد'),
      };
    });

    return {
      columns: ['item', 'amount', 'paid', 'remaining', 'status'],
      rows,
    };
  }

  if (pageId === 'uni_email') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });

    const rows = (students as any[]).map((student) => ({
      id: student.student_id,
      student_id: student.student_id,
      name: student.name,
      email: student.email || `${student.student_id}@stud.du.edu.eg`,
      status: student.email ? 'مفعّل' : 'بانتظار التفعيل',
      created_date: student.created_at ? student.created_at.toString().split('T')[0] : '',
    }));

    return {
      columns: ['student_id', 'name', 'email', 'status', 'created_date'],
      rows,
    };
  }

  if (pageId === 'create_sched') {
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const schedules = await schedulesApi.list({});

    const rows = (courses as any[]).map((course: any) => {
      const courseSchedules = (schedules as any[]).filter((s) => s.course_id === course.id);
      return {
        id: course.id,
        course_id: course.id,
        course_name: course.name,
        total_sessions: courseSchedules.length,
        scheduled: courseSchedules.length > 0 ? 'نعم' : 'لا',
        status: courseSchedules.length > 0 ? 'مكتمل' : 'بانتظار الجدولة',
      };
    });

    return {
      columns: ['course_id', 'course_name', 'total_sessions', 'scheduled', 'status'],
      rows,
    };
  }

  if (pageId === 'upload_courses') {
    const courses = await coursesApi.list({ faculty_id: facultyId });

    const rows = (courses as any[]).map((course: any) => ({
      id: course.id,
      course_id: course.id,
      course_name: course.name,
      department: course.department_id || 'N/A',
      credit_hours: course.credit_hours || 3,
      semester: course.semester || 'N/A',
      level: course.level || '-',
    }));

    return {
      columns: ['course_id', 'course_name', 'department', 'credit_hours', 'semester', 'level'],
      rows,
    };
  }

  if (pageId === 'payment_perm') {
    const [students, financial] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      financialApi.listAll({ faculty_id: facultyId }),
    ]);

    const lastPaymentMap = new Map<string, string>();
    (financial as any[]).forEach((r: any) => {
      if (r.payment_date) {
        const existing = lastPaymentMap.get(r.student_id);
        if (!existing || r.payment_date > existing) {
          lastPaymentMap.set(r.student_id, r.payment_date);
        }
      }
    });

    const totalPaidMap = new Map<string, number>();
    (financial as any[]).forEach((r: any) => {
      const paid = Number(r.paid_amount || r.amount || 0);
      totalPaidMap.set(r.student_id, (totalPaidMap.get(r.student_id) || 0) + paid);
    });

    const rows = (students as any[]).map((student) => ({
      id: student.student_id,
      student_id: student.student_id,
      student_name: student.name,
      amount: totalPaidMap.get(student.student_id) ?? 0,
      purpose: 'تسديد رسوم دراسية',
      request_date: lastPaymentMap.get(student.student_id) ? lastPaymentMap.get(student.student_id)!.toString().split('T')[0] : '',
      status: student.fees_status === 'مسدد' ? 'مصرح' : 'غير مصرح',
    }));

    return {
      columns: ['student_id', 'student_name', 'amount', 'purpose', 'request_date', 'status'],
      rows,
    };
  }

  if (pageId === 'fees_setup') {
    const feeSetups = await feeSetupApi.list({ faculty_id: facultyId });
    return {
      columns: ['semester', 'academic_year', 'fee_type', 'amount', 'level', 'status'],
      rows: (feeSetups as any[]).map((f: any) => ({
        id: f.id,
        semester: f.semester || '-',
        academic_year: f.academic_year || '-',
        fee_type: f.fee_type || '-',
        amount: Number(f.amount) || 0,
        level: f.level || '-',
        status: (f.status === 'نشط' || f.status === 'Active') ? 'نشط' : 'غير نشط',
      })),
    };
  }

  if (pageId === 'fees_collect') {
    const [financial, students] = await Promise.all([
      financialApi.listAll({ faculty_id: facultyId }),
      studentsApi.listAll({ faculty_id: facultyId }),
    ]);

    const studentMap = new Map((students as any[]).map(s => [s.student_id, s.name]));

    const rows = (financial as any[])
      .map((record: any) => ({
        id: record.id,
        student_id: record.student_id,
        student_name: studentMap.get(record.student_id) || 'غير معروف',
        amount_due: (Number(record.amount) || 0).toFixed(2),
        amount_paid: (Number(record.paid_amount) || 0).toFixed(2),
        payment_date: record.payment_date ? record.payment_date.toString().split('T')[0] : '',
        receipt_no: record.receipt_no || '-',
        status: record.status || 'قيد السداد',
      }));

    return {
      columns: ['student_id', 'student_name', 'amount_due', 'amount_paid', 'payment_date', 'receipt_no', 'status'],
      rows,
    };
  }

  if (pageId === 'gpa_mod') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const grades = await gradesApi.listAll({});

    const studentGrades = new Map<string, number[]>();
    (grades as any[]).forEach((grade) => {
      if (!studentGrades.has(grade.student_id)) {
        studentGrades.set(grade.student_id, []);
      }
      studentGrades.get(grade.student_id)!.push(Number(grade.total) || 0);
    });

    const rows = (students as any[]).map((student) => {
      const grades_array = studentGrades.get(student.student_id) || [];
      let calculated_gpa: string;
      if (student.gpa) {
        calculated_gpa = (student.gpa as number).toFixed(2);
      } else if (grades_array.length > 0) {
        calculated_gpa = (grades_array.reduce((a, b) => a + b) / grades_array.length / 25 * 4).toFixed(2);
      } else {
        calculated_gpa = '0.00';
      }
      const current_gpa = (student.gpa || 0).toFixed(2);
      const hasDifference = Math.abs(Number(calculated_gpa) - Number(current_gpa)) > 0.1;

      return {
        id:              student.student_id,
        student_id:      student.student_id,
        student_name:    student.name,
        old_gpa:         current_gpa,
        new_gpa:         calculated_gpa,
        difference:      (Number(calculated_gpa) - Number(current_gpa)).toFixed(2),
        reason:          student.gpa_mod_reason || '',
        date:            new Date().toISOString().split('T')[0],
        status:          student.gpa_mod_status || (hasDifference ? 'قيد المراجعة' : 'موافق عليه'),
      };
    });

    return {
      columns: ['student_id', 'student_name', 'old_gpa', 'new_gpa', 'difference', 'reason', 'date', 'status'],
      rows,
    };
  }

  if (pageId === 'grad_year') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });

    const rows = (students as any[])
      .filter((s) => Number(s.level) >= 4)
      .map((student) => ({
        id: student.student_id,
        student_id: student.student_id,
        student_name: student.name,
        graduation_year: student.graduation_year || String(new Date().getFullYear() + Math.max(0, 7 - (Number(student.level) || 4))),
        date: new Date().toISOString().split('T')[0],
        status: student.graduation_year ? 'محدد' : (Number(student.level) >= 6 ? 'مؤهل للتخرج' : 'قريب من التخرج'),
      }));

    return {
      columns: ['student_id', 'student_name', 'graduation_year', 'date', 'status'],
      rows,
    };
  }

  if (pageId === 'all_activities') {
    let activities: any[] = [];
    try {
      activities = await activityLogsApi.list({ faculty_id: facultyId });
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
      activities = [];
    }

    const rows = (activities as any[]).map((activity: any) => ({
      id: activity.id,
      activity_id: activity.id || '-',
      timestamp: activity.created_at ? activity.created_at.toString().split('T')[0] : '',
      user: activity.user_name || activity.username || 'النظام',
      action: activity.action || '-',
      entity_type: activity.entity_type || '-',
      entity_id: activity.entity_id || '-',
      details: activity.description || '-',
    }));

    return {
      columns: ['activity_id', 'timestamp', 'user', 'action', 'entity_type', 'entity_id', 'details'],
      rows,
    };
  }

  if (pageId === 'multiple_courses_reg') {
    const [students, enrollments, courses] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({}),
      coursesApi.list({ faculty_id: facultyId }),
    ]);
    const courseMap = new Map((courses as any[]).map((c) => [c.id, c]));
    const enrollMap = new Map<string, { count: number; hours: number }>();
    (enrollments as any[]).forEach((e) => {
      const entry = enrollMap.get(e.student_id) || { count: 0, hours: 0 };
      const course = courseMap.get(e.course_id);
      entry.count++;
      entry.hours += Number(course?.credit_hours) || 3;
      enrollMap.set(e.student_id, entry);
    });
    const rows = (students as any[])
      .filter((s) => (enrollMap.get(s.student_id)?.count || 0) > 0)
      .map((student) => {
        const { count, hours } = enrollMap.get(student.student_id) || { count: 0, hours: 0 };
        return {
          id:            student.student_id,
          student_id:    student.student_id,
          name:          student.name,
          courses_count: count,
          total_hours:   hours,
          status:        student.status || '-',
        };
      });
    return { columns: ['student_id', 'name', 'courses_count', 'total_hours', 'status'], rows };
  }

  if (pageId === 'review_student_reg') {
    const [requests, students] = await Promise.all([
      registrationRequestsApi.list({ faculty_id: facultyId }),
      studentsApi.listAll({ faculty_id: facultyId })
    ]);
    const studentMap = new Map((students as any[]).map(s => [s.student_id, s.name]));

    const rows = (requests as any[]).map((req: any) => ({
      id: req.id,
      student_id:    req.student_id || '-',
      name:          studentMap.get(req.student_id) || '-',
      request_date:  req.request_date ? req.request_date.toString().split('T')[0] : '',
      comment:       req.comment || '-',
      status:        req.status || 'قيد المراجعة',
      admin_response: req.admin_response || '-',
    }));

    return {
      columns: ['student_id', 'name', 'request_date', 'comment', 'status', 'admin_response'],
      rows,
    };
  }

  if (pageId === 'modify_student_courses') {
    const [requests, students] = await Promise.all([
      registrationRequestsApi.list({ faculty_id: facultyId }),
      studentsApi.listAll({ faculty_id: facultyId })
    ]);
    const studentMap = new Map((students as any[]).map(s => [s.student_id, s.name]));

    return {
      columns: ['student_id', 'name', 'comment', 'admin_response', 'status'],
      rows: (requests as any[]).map((req: any) => ({
        id: req.id,
        student_id: req.student_id || '-',
        name: studentMap.get(req.student_id) || '-',
        comment: req.comment || '-',
        admin_response: req.admin_response || '-',
        status: req.status || 'معلق',
      })),
    };
  }

  if (pageId === 'student_reg_form') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const enrollments = await enrollmentsApi.listAll({});
    const studentEnrollments = new Map<string, { count: number; statuses: Set<string>; dates: string[] }>();
    (enrollments as any[]).forEach((e) => {
      if (!studentEnrollments.has(e.student_id)) {
        studentEnrollments.set(e.student_id, { count: 0, statuses: new Set(), dates: [] });
      }
      const entry = studentEnrollments.get(e.student_id)!;
      entry.count += 1;
      if (e.status) entry.statuses.add(e.status);
      if (e.created_at) entry.dates.push(e.created_at);
    });
    const rows = (students as any[]).map((student) => {
      const enrollment = studentEnrollments.get(student.student_id);
      const latestDate = enrollment?.dates.sort().reverse()[0];
      const statuses = enrollment?.statuses.values().next().value || 'معلق';
      return {
        id: student.student_id,
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        enrolled_courses: enrollment?.count || 0,
        status: statuses,
        approval_status: statuses === 'مصرح' ? 'موافق عليه' : 'بانتظار',
        registration_date: latestDate ? latestDate.toString().split('T')[0] : '',
      };
    });
    return {
      columns: ['student_id', 'name', 'level', 'enrolled_courses', 'status', 'approval_status', 'registration_date'],
      rows,
    };
  }

  if (pageId === 'block_student_reg') {
    const [blocks, students] = await Promise.all([
      registrationRequestsApi.listBlocks({}),
      studentsApi.listAll({ faculty_id: facultyId })
    ]);
    const studentMap = new Map((students as any[]).map(s => [s.student_id, s.name]));

    return {
      columns: ['student_id', 'name', 'reason', 'block_date', 'status'],
      rows: (blocks as any[]).map((b: any) => ({
        id: b.id,
        student_id: b.student_id || '-',
        name: studentMap.get(b.student_id) || '-',
        reason: b.reason || '-',
        block_date: b.block_date ? b.block_date.toString().split('T')[0] : '',
        status: b.status || 'محجوب',
      })),
    };
  }

  if (pageId === 'balance_reg') {
    const [equivalences, students, courses] = await Promise.all([
      courseEquivalencesApi.list({}),
      studentsApi.listAll({ faculty_id: facultyId }),
      coursesApi.list({ faculty_id: facultyId })
    ]);
    const studentMap = new Map((students as any[]).map(s => [s.student_id, s.name]));
    const courseMap = new Map((courses as any[]).map(c => [c.id, c.name]));

    return {
      columns: ['student_id', 'name', 'original_course', 'equivalent_course', 'status'],
      rows: (equivalences as any[]).map((eq: any) => ({
        id: eq.id,   // preserve id for API updates
        student_id: eq.student_id || '-',
        name: studentMap.get(eq.student_id) || '-',
        original_course: courseMap.get(eq.original_course_id) || eq.original_course_id || '-',
        equivalent_course: courseMap.get(eq.equivalent_course_id) || eq.equivalent_course_id || '-',
        status: eq.status || 'مُوازَن',
      })),
    };
  }

  if (pageId === 'block_reg_by_renewal') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    // Show students with رسوم غير مسددة or any non-active status
    const blockedStudents = students.filter((s: any) =>
      s.fees_status === 'غير مسدد' || s.status === 'متوقف_عن_الدراسة' || s.status === 'موقوف'
    );
    const displayStudents = blockedStudents;
    return {
      columns: ['student_id', 'name', 'renewal_status', 'block_reason', 'status'],
      rows: displayStudents.map((s: any) => ({
        id: s.student_id,
        student_id: s.student_id,
        name: s.name,
        renewal_status: s.status === 'متوقف_عن_الدراسة' ? 'متوقف' : 'يحتاج تجديد',
        block_reason: s.fees_status === 'غير مسدد' ? 'الرسوم غير مسددة' : 'لم يجدد القيد',
        status: 'محظور',
      })),
    };
  }

  if (pageId === 'add_room_assignment') {
    const rooms = await roomsApi.list({});
    const schedules = await schedulesApi.list({});

    // Find available rooms (not assigned to any schedule at the given time)
    const assignedRooms = new Set((schedules as any[])
      .filter((s) => s.room_id && s.day && s.time_slot)
      .map((s) => s.room_id)
    );

    const availableRooms = (rooms as any[]).filter(
      (r) => r.status === 'متاحة' || !assignedRooms.has(r.id)
    );

    const rows = (schedules as any[])
      .filter((s) => !s.room_id)
      .slice(0, 50)
      .map((schedule, idx) => ({
        id: schedule.id,
        schedule_id: schedule.id,
        course_id: schedule.course_id,
        day: schedule.day || 'N/A',
        time: schedule.time_slot || 'N/A',
        current_room: schedule.room_id || '-',
        // Suggest first available room, or none if all are assigned
        suggested_room: availableRooms[idx % Math.max(availableRooms.length, 1)]?.code || '-',
        status: 'بانتظار التعيين',
      }));

    return {
      columns: ['schedule_id', 'course_id', 'day', 'time', 'current_room', 'suggested_room', 'status'],
      rows,
    };
  }

  if (pageId === 'add_lecturer_assignment') {
    const schedules = await schedulesApi.list({});
    const courses = await coursesApi.list({ faculty_id: facultyId });
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    const rows = (schedules as any[])
      .filter((s) => courseMap.has(s.course_id))
      .slice(0, 50)
      .map((schedule) => ({
        id: schedule.id,
        schedule_id: schedule.id,
        course_id: schedule.course_id,
        course_name: courseMap.get(schedule.course_id)?.name || schedule.course_id,
        assigned_instructor: schedule.instructor_name || '-',
        assignment_status: schedule.instructor_name ? 'معين' : 'بانتظار',
        approval_date: schedule.approval_date ? schedule.approval_date.toString().split('T')[0] : '',
      }));

    return {
      columns: ['schedule_id', 'course_id', 'course_name', 'assigned_instructor', 'assignment_status', 'approval_date'],
      rows,
    };
  }

  if (pageId.endsWith('_department')) {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const departments = await departmentsApi.list(facultyId);

    // Map page ID to department code (e.g., 'cs_department' -> search for dept with code 'CS')
    const deptCode = pageId.split('_')[0].toUpperCase();

    // Find actual department by code or name
    const dept = (departments as any[]).find((d: any) =>
      (d.code && d.code.toUpperCase() === deptCode) ||
      (d.name && d.name.toLowerCase().includes(deptCode.toLowerCase())) ||
      d.id === deptCode
    );

    // Filter students by actual department_id from database
    const deptStudents = dept
      ? students.filter((s: any) => s.department_id === dept.id)
      : [];

    const rows = (deptStudents as any[]).map((student) => ({
      id: student.student_id,
      student_id: student.student_id,
      name: student.name,
      level: student.level,
      gpa: (student.gpa || 0).toFixed(2),
      status: student.status || 'مقيد',
      fees_status: student.fees_status || 'غير مسدد',
    }));

    return {
      columns: ['student_id', 'name', 'level', 'gpa', 'status', 'fees_status'],
      rows,
    };
  }

  if (pageId === 'student_data_management') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });

    const rows = (students as any[]).map((student) => ({
      id: student.student_id,
      student_id: student.student_id,
      student_name: student.name,
      email: student.email || 'N/A',
      phone: student.phone || 'N/A',
      level: student.level,
      status: student.status || 'مقيد',
      created_at: student.created_at ? student.created_at.toString().split('T')[0] : '',
    }));

    return {
      columns: ['student_id', 'student_name', 'email', 'phone', 'level', 'status', 'created_at'],
      rows,
    };
  }

  if (pageId === 'registered_by_levels') {
    const [students, enrollments] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({})
    ]);

    const enrolledSet = new Set((enrollments as any[]).map(e => e.student_id));
    const statsByLevel = new Map<number, { total: number, registered: number }>();

    (students as any[]).forEach((s) => {
      const level = Number(s.level) || 1;
      const entry = statsByLevel.get(level) || { total: 0, registered: 0 };
      entry.total++;
      if (enrolledSet.has(s.student_id)) entry.registered++;
      statsByLevel.set(level, entry);
    });

    const rows = Array.from(statsByLevel.entries())
      .sort(([a], [b]) => a - b)
      .map(([level, data]) => ({
        level: `المستوى ${level}`,
        total_students: data.total,
        registered: data.registered,
        not_registered: data.total - data.registered,
        percentage: ((data.registered / data.total) * 100).toFixed(1) + '%',
      }));

    return {
      columns: ['level', 'total_students', 'registered', 'not_registered', 'percentage'],
      rows,
    };
  }

  if (pageId === 'manage_reg_issues') {
    let requests: any[] = [];
    try {
      requests = await registrationRequestsApi.list({ faculty_id: facultyId });
    } catch (err) {
      requests = [];
    }
    const rows = (requests as any[])
      .filter((r: any) => r.status === 'مرفوض' || r.status === 'معلق')
      .map((req: any) => ({
        id: req.id,
        req_id: req.id || '-',
        student_id: req.student_id || '-',
        student_name: req.student_name || '-',
        file: '-',
        comment: req.admin_response || req.reason || '-',
        status: req.status || '-',
      }));
    return {
      columns: ['req_id', 'student_id', 'student_name', 'file', 'comment', 'status'],
      rows,
    };
  }

  if (pageId === 'reg_form_issue') {
    let requests: any[] = [];
    try {
      requests = await registrationRequestsApi.list({ faculty_id: facultyId });
    } catch (err) {
      requests = [];
    }
    const rows = (requests as any[])
      .filter((r: any) => r.status === 'مرفوض' || r.status === 'معلق')
      .map((req: any) => ({
        id: req.id,
        req_id: req.id || '-',
        date: req.created_at ? req.created_at.toString().split('T')[0] : '',
        comment: req.reason || '-',
        admin_response: req.admin_response || '-',
        status: req.status || '-',
      }));
    return {
      columns: ['req_id', 'date', 'comment', 'admin_response', 'status'],
      rows,
    };
  }

  if (pageId === 'level_mod') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const levels = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];

    const rows = (students as any[]).map((student) => {
      const lvl = Number(student.level) || 1;
      const nextLvl = Math.min(7, lvl + 1);
      return {
        id:            student.student_id,
        student_id:    student.student_id,
        student_name:  student.name,
        old_level:     `المستوى ${levels[lvl - 1] || lvl}`,
        new_level:     `المستوى ${levels[nextLvl - 1] || nextLvl}`,
        new_level_raw: nextLvl,
        reason:        student.level_mod_reason || '',
        date:          new Date().toISOString().split('T')[0],
        status:        student.level_mod_status || 'قيد المراجعة',
      };
    });

    return {
      columns: ['student_id', 'student_name', 'old_level', 'new_level', 'reason', 'date', 'status'],
      rows: rows,
    };
  }



  if (pageId === 'id_card_view') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const currentYear = new Date().getFullYear();
    const cardYear = `${currentYear}-${currentYear + 1}`;

    const rows = (students as any[]).map((student) => ({
      id:          student.student_id,
      student_id:  student.student_id,
      name:        student.name,
      national_id: student.national_id,
      card_year:   cardYear,
      status:   student.id_card_status || 'لم يُطبع',
      delivery: 'لم يستلم'
    }));

    return {
      columns: ['student_id', 'name', 'national_id', 'card_year', 'status', 'delivery'],
      rows: rows,
    };
  }

  if (pageId === 'sys_edit') {
    const settings = await systemSettingsApi.list();
    const rows = (settings as any[]).map((setting: any) => ({
      id: setting.id || '-',
      name: setting.name || '-',
      value: setting.value || '-',
      description: setting.description || '-',
      category: setting.category || 'عام',
      status: (setting.status === 'Active' || setting.status === 'نشط') ? 'نشط' : 'غير نشط',
    }));

    return {
      columns: ['id', 'name', 'value', 'description', 'category', 'status'],
      rows,
    };
  }

  if (pageId === 'default') {
    const announcements = await announcementsApi.list({ faculty_id: facultyId });
    return {
      columns: ['msg', 'date', 'status'],
      rows: (announcements as any[]).map((a: any) => ({
        id: a.id,
        msg: a.body || a.title || '-',
        date: a.created_at ? a.created_at.toString().split('T')[0] : '',
        status: a.is_active ? 'نشط' : 'غير نشط',
      })),
    };
  }

  if (pageId === 'registered_students_report') {
    const [students, enrollments, courses] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({}),
      coursesApi.list({ faculty_id: facultyId }),
    ]);
    const courseMap = new Map((courses as any[]).map((c) => [c.id, c]));
    const enrollByStudent = new Map<string, { courses: string[]; hours: number }>();
    (enrollments as any[])
      .filter((e) => (students as any[]).some((s) => s.student_id === e.student_id))
      .forEach((e) => {
        const entry = enrollByStudent.get(e.student_id) || { courses: [], hours: 0 };
        const course = courseMap.get(e.course_id);
        if (course) {
          entry.courses.push(course.name);
          entry.hours += course.credit_hours || 3;
        }
        enrollByStudent.set(e.student_id, entry);
      });
    return {
      columns: ['student_id', 'name', 'level', 'courses', 'total_hours'],
      rows: (students as any[]).map((s) => {
        const enroll = enrollByStudent.get(s.student_id) || { courses: [], hours: 0 };
        return {
          id: s.student_id,
          student_id: s.student_id,
          name: s.name,
          level: s.level,
          courses: enroll.courses.length,
          total_hours: enroll.hours,
        };
      }),
    };
  }

  if (pageId === 'registered_students_stats' || pageId === 'registered_students_chart') {
    // هذه صفحات dashboard — نعيد إحصائيات موجزة
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const total = (students as any[]).length;
    const byLevel = new Map<number, number>();
    (students as any[]).forEach((s) => byLevel.set(Number(s.level) || 1, (byLevel.get(Number(s.level) || 1) || 0) + 1));
    return {
      columns: ['level', 'student_count', 'percentage'],
      rows: Array.from(byLevel.entries())
        .sort(([a], [b]) => a - b)
        .map(([level, count]) => ({
          level:         `المستوى ${level}`,
          student_count: count,
          percentage:    total > 0 ? ((count / total) * 100).toFixed(1) + '%' : '0%',
        })),
    };
  }

  if (pageId === 'students_in_course') {
    const [students, enrollments] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({})
    ]);
    return {
      columns: ['student_id', 'name', 'level', 'semester', 'status', 'registration_date'],
      rows: (enrollments as any[])
        .filter((e) => (students as any[]).some((s) => s.student_id === e.student_id))
        .slice(0, 100)
        .map((e) => {
          const student = (students as any[]).find((s) => s.student_id === e.student_id);
          return {
            id:                e.id,
            student_id:        e.student_id,
            name:              student?.name || '-',
            level:             student?.level || '-',
            semester:          e.semester || '-',
            status:            e.status || 'مسجل',
            registration_date: e.created_at ? e.created_at.toString().split('T')[0] : '',
          };
        }),
    };
  }

  if (pageId === 'unregistered_students') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const enrollments = await enrollmentsApi.listAll({});
    const enrolledIds = new Set((enrollments as any[]).map((e) => e.student_id));
    return {
      columns: ['student_id', 'name', 'level', 'fees_status', 'status'],
      rows: (students as any[])
        .filter((s) => !enrolledIds.has(s.student_id))
        .map((s) => ({
          id:         s.student_id,
          student_id: s.student_id,
          name:       s.name,
          level:      s.level,
          fees_status: s.fees_status || 'غير محدد',
          status:     'غير مسجل',
        })),
    };
  }

  if (pageId === 'students_by_gpa') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const total = (students as any[]).length || 1;
    const ranges = [
      { label: '3.5 - 4.0', min: 3.5, max: 4.0 },
      { label: '3.0 - 3.5', min: 3.0, max: 3.5 },
      { label: '2.5 - 3.0', min: 2.5, max: 3.0 },
      { label: '2.0 - 2.5', min: 2.0, max: 2.5 },
      { label: 'أقل من 2.0', min: 0,   max: 2.0 },
    ];
    return {
      columns: ['gpa_range', 'student_count', 'percentage'],
      rows: ranges.map(({ label, min, max }) => {
        const count = (students as any[]).filter((s) => {
          const g = Number(s.gpa) || 0;
          return g >= min && g < max;
        }).length;
        return { gpa_range: label, student_count: count, percentage: ((count / total) * 100).toFixed(1) + '%' };
      }),
    };
  }

  if (pageId === 'registered_courses_count') {
    const students = await studentsApi.listAll({ faculty_id: facultyId });
    const enrollments = await enrollmentsApi.listAll({});
    const enrollMap = new Map<string, number>();
    (enrollments as any[]).forEach((e) => enrollMap.set(e.student_id, (enrollMap.get(e.student_id) || 0) + 1));
    const countDist = new Map<number, number>();
    (students as any[]).forEach((s) => {
      const cnt = enrollMap.get(s.student_id) || 0;
      countDist.set(cnt, (countDist.get(cnt) || 0) + 1);
    });
    const total = (students as any[]).length || 1;
    return {
      columns: ['courses_count', 'student_count', 'percentage'],
      rows: Array.from(countDist.entries())
        .sort(([a], [b]) => a - b)
        .map(([courses_count, student_count]) => ({
          courses_count: `${courses_count} مقررات`,
          student_count,
          percentage: ((student_count / total) * 100).toFixed(1) + '%',
        })),
    };
  }

  if (pageId === 'student_performance_analysis') {
    const [students, enrollments, grades, attendance, financial] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({}),
      gradesApi.listAll({}),
      attendanceApi.listAll({ faculty_id: facultyId || undefined }),
      financialApi.listAll({ faculty_id: facultyId || undefined }),
    ]);
    const enrollMap   = new Map<string, number>();
    const completedMap= new Map<string, number>();
    const gradeMap    = new Map<string, number[]>();
    const attendMap   = new Map<string, { total: number; present: number }>();
    const finMap      = new Map<string, { owed: number; paid: number }>();

    (enrollments as any[]).forEach((e) => {
      enrollMap.set(e.student_id, (enrollMap.get(e.student_id) || 0) + 1);
      if (e.status === 'مكتمل' || e.status === 'ناجح') completedMap.set(e.student_id, (completedMap.get(e.student_id) || 0) + 1);
    });
    (grades as any[]).forEach((g) => {
      const arr = gradeMap.get(g.student_id) || []; arr.push(Number(g.total) || 0); gradeMap.set(g.student_id, arr);
    });
    (attendance as any[]).forEach((a) => {
      const cur = attendMap.get(a.student_id) || { total: 0, present: 0 };
      cur.total += 1; if (a.status === 'حاضر' || a.status === 'present') cur.present += 1;
      attendMap.set(a.student_id, cur);
    });
    (financial as any[]).forEach((f) => {
      const cur = finMap.get(f.student_id) || { owed: 0, paid: 0 };
      cur.owed += Number(f.amount) || 0; cur.paid += Number(f.paid_amount) || 0;
      finMap.set(f.student_id, cur);
    });

    return {
      columns: ['student_id', 'name', 'enrolled_courses', 'completed_courses', 'average_grade', 'attendance_rate', 'financial_status'],
      rows: (students as any[]).map((s) => {
        const gs = gradeMap.get(s.student_id) || [];
        const att = attendMap.get(s.student_id);
        const fin = finMap.get(s.student_id);
        return {
          id:               s.student_id,
          student_id:       s.student_id,
          name:             s.name,
          enrolled_courses: enrollMap.get(s.student_id) || 0,
          completed_courses:completedMap.get(s.student_id) || 0,
          average_grade:    gs.length > 0 ? (gs.reduce((a, b) => a + b) / gs.length).toFixed(2) : 'N/A',
          attendance_rate:  att && att.total > 0 ? ((att.present / att.total) * 100).toFixed(1) + '%' : 'N/A',
          financial_status: !fin ? 'N/A' : fin.paid >= fin.owed ? 'مسدد بالكامل' : 'مستحقات متبقية',
        };
      }),
    };
  }




  // ─── الملف الأكاديمي للطلاب ───
  if (pageId === 'student_academic_profile') {
    const [students, enrollments, , attendance, financial] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({}),
      gradesApi.listAll({}),
      attendanceApi.listAll({ faculty_id: facultyId || undefined }),
      financialApi.listAll({ faculty_id: facultyId || undefined }),
    ]);

    const enrollMap  = new Map<string, number>();
    const completedMap = new Map<string, number>();
    const attendMap  = new Map<string, { total: number; present: number }>();
    const finMap     = new Map<string, { owed: number; paid: number }>();

    (enrollments as any[]).forEach((e) => {
      enrollMap.set(e.student_id, (enrollMap.get(e.student_id) || 0) + 1);
      if (e.status === 'مكتمل' || e.status === 'ناجح' || e.status === 'passed')
        completedMap.set(e.student_id, (completedMap.get(e.student_id) || 0) + 1);
    });
    (attendance as any[]).forEach((a) => {
      const cur = attendMap.get(a.student_id) || { total: 0, present: 0 };
      cur.total += 1;
      if (a.status === 'حاضر' || a.status === 'present') cur.present += 1;
      attendMap.set(a.student_id, cur);
    });
    (financial as any[]).forEach((f) => {
      const cur = finMap.get(f.student_id) || { owed: 0, paid: 0 };
      cur.owed += Number(f.amount) || 0;
      cur.paid += Number(f.paid_amount) || 0;
      finMap.set(f.student_id, cur);
    });

    const rows = (students as any[]).map((s) => {
      const att   = attendMap.get(s.student_id);
      const fin   = finMap.get(s.student_id);
      const attendanceRate = att && att.total > 0
        ? ((att.present / att.total) * 100).toFixed(1) + '%' : 'N/A';
      const financialStatus = !fin ? 'N/A'
        : fin.paid >= fin.owed ? 'مسدد بالكامل' : 'يوجد مستحقات';

      return {
        id:                s.student_id,
        student_id:        s.student_id,
        name:              s.name,
        enrolled_courses:  enrollMap.get(s.student_id) || 0,
        completed_courses: completedMap.get(s.student_id) || 0,
        current_gpa:       (s.gpa || 0).toFixed(2),
        attendance_rate:   attendanceRate,
        financial_status:  financialStatus,
      };
    });

    return {
      columns: ['student_id', 'name', 'enrolled_courses', 'completed_courses', 'current_gpa', 'attendance_rate', 'financial_status'],
      rows,
    };
  }

  // ─── الملف الشامل للطالب ─── جلب 4 APIs وبناء الإحصائيات الكاملة
  if (pageId === 'student_complete_profile') {
    const [students, enrollments, grades, financials, attendance] = await Promise.all([
      studentsApi.listAll({ faculty_id: facultyId }),
      enrollmentsApi.listAll({}),
      gradesApi.listAll({}),
      financialApi.listAll({ faculty_id: facultyId || undefined }),
      attendanceApi.listAll({ faculty_id: facultyId || undefined }),
    ]);

    // Build lookup maps per student
    const enrollMap  = new Map<string, any[]>();
    const gradeMap   = new Map<string, any[]>();
    const finMap     = new Map<string, any[]>();
    const attendMap  = new Map<string, any[]>();

    (enrollments  as any[]).forEach(e => { const arr = enrollMap.get(e.student_id)  || []; arr.push(e); enrollMap.set(e.student_id, arr); });
    (grades       as any[]).forEach(g => { const arr = gradeMap.get(g.student_id)   || []; arr.push(g); gradeMap.set(g.student_id, arr); });
    (financials   as any[]).forEach(f => { const arr = finMap.get(f.student_id)     || []; arr.push(f); finMap.set(f.student_id, arr); });
    (attendance   as any[]).forEach(a => { const arr = attendMap.get(a.student_id)  || []; arr.push(a); attendMap.set(a.student_id, arr); });

    const rows = (students as any[]).slice(0, 50).map((s) => {
      const stuEnrollments  = enrollMap.get(s.student_id)  || [];
      const stuGrades       = gradeMap.get(s.student_id)   || [];
      const stuFinancials   = finMap.get(s.student_id)     || [];
      const stuAttendance   = attendMap.get(s.student_id)  || [];

      const completedEnrollments = stuEnrollments.filter((e: any) => e.status === 'مكتمل' || e.status === 'ناجح');
      const avgGrade = stuGrades.length > 0
        ? (stuGrades.reduce((sum: number, g: any) => sum + (Number(g.total) || 0), 0) / stuGrades.length).toFixed(1)
        : '0.0';
      const presentSessions = stuAttendance.filter((a: any) => a.status === 'حاضر' || a.status === 'present').length;
      const attendanceRate = stuAttendance.length > 0
        ? ((presentSessions / stuAttendance.length) * 100).toFixed(1) + '%'
        : '0.0%';
      const totalFees  = stuFinancials.reduce((sum: number, f: any) => sum + (Number(f.amount)      || 0), 0);
      const paidAmount = stuFinancials.reduce((sum: number, f: any) => sum + (Number(f.paid_amount) || 0), 0);

      return {
        id:                       s.student_id,
        student_id:               s.student_id,
        name:                     s.name,
        enrolled_courses_count:   stuEnrollments.length,
        completed_courses_count:  completedEnrollments.length,
        attendance_sessions:      stuAttendance.length,
        financial_transactions:   stuFinancials.length,
        avg_grade:                avgGrade,
        attendance_rate:          attendanceRate,
        total_fees:               totalFees,
        paid_amount:              paidAmount,
      };
    });

    return {
      columns: ['student_id', 'name', 'enrolled_courses_count', 'completed_courses_count',
                'attendance_sessions', 'financial_transactions', 'avg_grade', 'attendance_rate',
                'total_fees', 'paid_amount'],
      rows,
    };
  }

  // ─── حضور الطالب (Student Attendance) ───
  if (pageId === 'view_attendance') {
    const currentStudentId = currentUser?.id || '';
    const [attendance, courses] = await Promise.all([
      attendanceApi.list({ student_id: currentStudentId }),
      coursesApi.list({ faculty_id: facultyId })
    ]);
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    const rows = (attendance as any[]).map((a: any) => ({
      id: a.id,
      course_id: a.course_id,
      course_name: courseMap.get(a.course_id)?.name || a.course_id,
      date: a.attendance_date ? a.attendance_date.toString().split('T')[0] : '',
      status: a.status || '-',
    }));

    return {
      columns: ['course_id', 'course_name', 'date', 'status'],
      rows,
    };
  }

  // ─── جدول الطالب (Student Schedule) ───
  if (pageId === 'view_schedule') {
    const currentStudentId = currentUser?.id || '';
    const [schedule, courses] = await Promise.all([
      schedulesApi.forStudent(currentStudentId),
      coursesApi.list({ faculty_id: facultyId })
    ]);
    const courseMap = new Map(courses.map((c: any) => [c.id, c]));
    const roomMap = new Map();

    const rows = (schedule as any[]).map((s: any) => ({
      id: s.id,
      course_id: s.course_id,
      course_name: courseMap.get(s.course_id)?.name || s.course_id,
      day: s.day || '-',
      time: s.time_label || `${s.time_start || ''} - ${s.time_end || ''}`.trim() || '-',
      room: s.room_id || '-',
      instructor: s.instructor || '-',
    }));

    return {
      columns: ['course_id', 'course_name', 'day', 'time', 'room', 'instructor'],
      rows,
    };
  }

  // ─── بيانات الطالب (Student Personal Data) ───
  if (pageId === 'personal_data') {
    const currentStudentId = currentUser?.id || '';
    const student = await studentsApi.get(currentStudentId);

    const rows = [{
      id: student.student_id,
      student_id: student.student_id,
      name: student.name,
      email: student.email || '-',
      phone: student.phone || '-',
      level: student.level || '-',
      department: student.department_id || '-',
      status: student.status || '-',
    }];

    return {
      columns: ['student_id', 'name', 'email', 'phone', 'level', 'department', 'status'],
      rows,
    };
  }

  // ─── قواعس الاستبيان (Academic Rules) ───
  if (pageId === 'survey_rules') {
    const rules = await surveyRulesApi.list({ faculty_id: facultyId });
    return {
      columns: ['id', 'code', 'name', 'target', 'start_date', 'end_date', 'status'],
      rows: (rules as any[]).map((rule: any) => ({
        id: rule.id,
        code: rule.code || '-',
        name: rule.name || '-',
        target: rule.target || '-',
        start_date: rule.start_date ? rule.start_date.toString().split('T')[0] : '',
        end_date: rule.end_date ? rule.end_date.toString().split('T')[0] : '',
        status: rule.status || 'نشط',
      })),
    };
  }

  // ─── إدارة الجداول الجامعية (University Schedule Manager) ───
  if (pageId === 'uni_schedule_manager') {
    const [faculties, courses, schedules] = await Promise.all([
      facultiesApi.list(),
      coursesApi.list({ faculty_id: facultyId }),
      schedulesApi.list({})
    ]);

    const facultyCourseMap = new Map<string, number>();
    const facultyScheduleMap = new Map<string, number>();

    (courses as any[]).forEach((course: any) => {
      const count = facultyCourseMap.get(course.faculty_id) || 0;
      facultyCourseMap.set(course.faculty_id, count + 1);
    });

    (schedules as any[]).forEach((schedule: any) => {
      const count = facultyScheduleMap.get(schedule.faculty_id) || 0;
      facultyScheduleMap.set(schedule.faculty_id, count + 1);
    });

    const rows = (faculties as any[]).map((fac: any) => {
      const total = facultyCourseMap.get(fac.id) || 0;
      const scheduled = facultyScheduleMap.get(fac.id) || 0;
      const unscheduled = total - scheduled;
      const pct = total > 0 ? Math.round((scheduled / total) * 100) : 0;

      return {
        id: fac.id,
        faculty_id: fac.id,
        faculty_name: fac.name,
        total_courses: total,
        scheduled,
        unscheduled,
        status: pct === 100 ? 'مكتمل' : pct > 50 ? 'قيد الجدولة' : 'بانتظار الجدولة'
      };
    });

    return {
      columns: ['faculty_id', 'faculty_name', 'total_courses', 'scheduled', 'unscheduled', 'status'],
      rows
    };
  }


  // ─── صفحات الأقسام (22 قسم) ───
  // map: pageId → { codes: possible department_id/department values, label: اسم القسم }
  const DEPT_MAP: Record<string, { codes: string[]; label: string }> = {
    'ai_department':   { codes: ['AI', 'ai', 'الذكاء الاصطناعي', 'الذكاء الاصطناعي (AI)'], label: 'الذكاء الاصطناعي' },
    'cs_department':   { codes: ['CS', 'cs', 'علوم الحاسب', 'علوم الحاسب (CS)'],            label: 'علوم الحاسب' },
    'is_department':   { codes: ['IS', 'is', 'نظم المعلومات', 'نظم المعلومات (IS)'],        label: 'نظم المعلومات' },
    'it_department':   { codes: ['IT', 'it', 'تكنولوجيا المعلومات', 'تكنولوجيا المعلومات (IT)'], label: 'تكنولوجيا المعلومات' },
    'mi_department':   { codes: ['MI', 'mi', 'المعلوماتية الطبية', 'المعلوماتية الطبية (MI)'],    label: 'المعلوماتية الطبية' },
    'sec_department':  { codes: ['SEC', 'sec', 'أمن المعلومات', 'أمن المعلومات (SEC)'],     label: 'أمن المعلومات' },
    'phys_department': { codes: ['PHYS', 'phys', 'الفيزياء'],                                label: 'الفيزياء' },
    'chem_department': { codes: ['CHEM', 'chem', 'الكيمياء'],                                label: 'الكيمياء' },
    'math_department': { codes: ['MATH', 'math', 'الرياضيات'],                               label: 'الرياضيات' },
    'zoo_department':  { codes: ['ZOO', 'zoo', 'علم الحيوان'],                               label: 'علم الحيوان' },
    'bot_department':  { codes: ['BOT', 'bot', 'النبات'],                                    label: 'النبات' },
    'geol_department': { codes: ['GEOL', 'geol', 'الجيولوجيا'],                              label: 'الجيولوجيا' },
    'cvl_department':  { codes: ['CVL', 'cvl', 'الهندسة المدنية'],                          label: 'الهندسة المدنية' },
    'mech_department': { codes: ['MECH', 'mech', 'الهندسة الميكانيكية'],                    label: 'الهندسة الميكانيكية' },
    'elec_department': { codes: ['ELEC', 'elec', 'الهندسة الكهربائية'],                     label: 'الهندسة الكهربائية' },
    'arch_department': { codes: ['ARCH', 'arch', 'العمارة'],                                 label: 'العمارة' },
    'cce_department':  { codes: ['CCE', 'cce', 'هندسة الحاسب'],                             label: 'هندسة الحاسب' },
    'acc_department':  { codes: ['ACC', 'acc', 'المحاسبة'],                                  label: 'المحاسبة' },
    'mgt_department':  { codes: ['MGT', 'mgt', 'الإدارة'],                                   label: 'الإدارة' },
    'eco_department':  { codes: ['ECO', 'eco', 'الاقتصاد'],                                  label: 'الاقتصاد' },
    'bis_department':  { codes: ['BIS', 'bis', 'نظم معلومات الأعمال'],                      label: 'نظم معلومات الأعمال' },
    'fmi_department':  { codes: ['FMI', 'fmi', 'المعلوماتية المالية'],                      label: 'المعلوماتية المالية' },
  };

  if (pageId in DEPT_MAP) {
    const dept = DEPT_MAP[pageId];
    const codesSet = new Set(dept.codes.map(c => c.toLowerCase()));
    const students = await studentsApi.listAll({ faculty_id: facultyId });

    const deptStudents = (students as any[]).filter((s: any) => {
      const did = (s.department_id || '').toLowerCase();
      const dname = (s.department || '').toLowerCase();
      return codesSet.has(did) || codesSet.has(dname) ||
             dept.codes.some(c => did.includes(c.toLowerCase()) || dname.includes(c.toLowerCase()));
    });

    // إذا مفيش طلاب مفلترين → نعرض كل طلاب الكلية (الـ department_id مش مدخل في الـ seed)
    const finalStudents = deptStudents.length > 0 ? deptStudents : (students as any[]);

    const rows = finalStudents.map((s: any) => ({
      id:         s.student_id,
      student_id: s.student_id,
      name:       s.name,
      level:      s.level,
      gpa:        (s.gpa || 0).toFixed(2),
      status:     s.status || 'مقيد',
    }));

    return {
      columns: ['student_id', 'name', 'level', 'gpa', 'status'],
      rows,
    };
  }

  // لا نعرض جدول الكليات كبديل — يُربك المستخدم إن نُسي تعريف الصفحة
  return {
    columns: ['message'],
    rows: [{ message: 'لا يوجد جلب بيانات مُعرّف لهذا المعرف في الواجهة الخلفية.' }],
  };
}

export default DbBackedPage;
