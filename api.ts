/**
 * DUMLIS API Client
 * =================
 * Central TypeScript client for the FastAPI backend at http://localhost:8000.
 * All component-level mock-data calls should be replaced with these functions.
 */

// API Base URL - use environment variable or detect from current domain
const _env = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const BASE_URL = (_env?.VITE_API_URL && String(_env.VITE_API_URL).replace(/\/$/, '')) || 'https://dumlis-final-production.up.railway.app';

/** مسار الدرجات: لا يستخدم /grades لأن بعض الإضافات تحجب المسار فيظهر Failed to fetch */
const GRADES_PREFIX = '/student-grades';

// ─────────────────────────────────────────────────────────────────────────────
// Generic fetch helper
// ─────────────────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...authHeader, ...(options?.headers as Record<string, string> | undefined) },
      ...options,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `${msg} — تحقق من تشغيل الخادم (${BASE_URL}) وأن المتصفح يسمح بالاتصال (CORS / إضافات الحجب).`
    );
  }
  if (!res.ok) {
    const msg = await res.text();
    // If auth fails, clear invalid token
    if (res.status === 401) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      // Silence the error if it's a pre-auth lookup call
      if (!token) {
        throw new ApiError(res.status, "Authentication required");
      }
    }
    throw new ApiError(res.status, msg);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types (minimal, matches Pydantic response schemas)
// ─────────────────────────────────────────────────────────────────────────────
export interface Faculty {
  id: string;
  name: string;
  name_en?: string;
  code: string;
  icon?: string;
  student_count: number;
  staff_count: number;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  faculty_id: string;
  name: string;
  name_en?: string;
  code: string;
  head_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Student {
  student_id: string;
  name: string;
  national_id?: string;
  faculty_id: string;
  department_id?: string;
  level: number;
  regulation: string;
  gpa?: number;
  phone?: string;
  email?: string;
  city?: string;
  status: string;
  fees_status: string;
}

export interface StudentCount {
  count: number;
}

export interface Course {
  id: string;
  name: string;
  name_en?: string;
  level: number;
  department_id?: string;
  program_id?: string;
  faculty_id?: string;
  credit_hours: number;
  course_type: string;
  semester?: string;
  theoretical_hours?: number;
  practical_hours?: number;
  prerequisites?: string[];
  description?: string;
  syllabus?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Enrollment {
  id: number;
  student_id: string;
  course_id: string;
  semester: string;
  status: string;
}

export interface Grade {
  id: number;
  student_id: string;
  course_id: string;
  semester: string;
  midterm?: number;
  final_exam?: number;
  assignments?: number;
  total?: number;
  grade_letter?: string;
  grade_points?: number;
}

export interface AttendanceRecord {
  id: number;
  student_id: string;
  course_id: string;
  attendance_date: string;
  status: string;
  session_type?: string;
  week_number?: number;
}

export interface AttendanceSummary {
  student_id: string;
  course_id: string;
  total_sessions: number;
  present: number;
  absent: number;
  attendance_rate: number;
}

export interface FinancialRecord {
  id: number;
  student_id: string;
  fee_type: string;
  amount: number;
  paid_amount: number;
  status: string;
  semester?: string;
  due_date?: string;
}

export interface FinancialSummary {
  student_id: string;
  total_due: number;
  total_paid: number;
  remaining: number;
  status: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  room_type: string;
  capacity: number;
  building?: string;
  floor?: number;
  status: string;
}

export interface CourseSchedule {
  id: number;
  course_id: string;
  room_id?: string;
  session_type: string;
  day: string;
  time_label?: string;
  instructor?: string;
  semester?: string;
  group_label?: string;
  enrolled_count?: number;
}

export interface Committee {
  id: number;
  name: string;
  course_id?: string;
  course_name?: string;
  room_id: string;
  room_code?: string;
  capacity: number;
  assigned_students: number;
  exam_date?: string;
  exam_time?: string;
  supervisor?: string;
  status: string;
  seating_rows?: number;
  seating_cols?: number;
  seating_layout?: string;
  semester?: string;
}

export interface RegistrationRequest {
  id: string;
  student_id: string;
  comment?: string;
  status: string;
  admin_response?: string;
  request_date?: string;
}

export interface StudentBlock {
  id: number;
  faculty_id?: string;
  student_id: string;
  student_name?: string;
  reason: string;
  block_date: string;
  status: string;
  notes?: string;
}

export interface CourseClose {
  id: number;
  course_code: string;
  course_name?: string;
  academic_year: string;
  semester: string;
  closure_date: string;
  status: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────────────────────────────────────────
export interface AuthLoginResponse {
  access_token: string;
  token_type: string;
  user_role: 'super_admin' | 'faculty_admin' | 'student_affairs' | 'student';
  username: string;
  faculty_id?: string | null;
  student_id?: string | null;
}

export const authApi = {
  login: (credentials: { username: string; password: string }) => {
    const body = new URLSearchParams({
      username: credentials.username,
      password: credentials.password,
    });
    return request<AuthLoginResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
  },
  me: () => request<{ id: string; username: string; role: string; faculty_id?: string }>('/auth/me'),
};

// ─────────────────────────────────────────────────────────────────────────────
// Faculty API
// ─────────────────────────────────────────────────────────────────────────────
export const facultiesApi = {
  list: () => request<Faculty[]>('/faculties/'),
  get:  (id: string) => request<Faculty>(`/faculties/${id}`),
  create: (data: Partial<Faculty>) => request<Faculty>('/faculties/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Faculty>) => request<Faculty>(`/faculties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/faculties/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Departments API
// ─────────────────────────────────────────────────────────────────────────────
export const departmentsApi = {
  list: (facultyId?: string) =>
    request<Department[]>(`/departments/${facultyId ? `?faculty_id=${facultyId}` : ''}`),
  get:  (id: string) => request<Department>(`/departments/${id}`),
  create: (data: Partial<Department>) => request<Department>('/departments/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Department>) => request<Department>(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/departments/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Students API
// ─────────────────────────────────────────────────────────────────────────────
export const studentsApi = {
  list: (params: {
    faculty_id?: string;
    department_id?: string;
    level?: number;
    status?: string;
    regulation?: string;
    fees_status?: string;
    search?: string;
    skip?: number;
    limit?: number;
  } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<Student[]>(`/students/?${q.toString()}`);
  },
  /** Fetch all matching students (API max limit is 500 per request). */
  listAll: async (
    params: {
      faculty_id?: string;
      department_id?: string;
      level?: number;
      status?: string;
      regulation?: string;
      fees_status?: string;
      search?: string;
    } = {}
  ) => {
    const pageSize = 500;
    const all: Student[] = [];
    let skip = 0;
    for (;;) {
      const q = new URLSearchParams();
      Object.entries({ ...params, skip, limit: pageSize }).forEach(([k, v]) =>
        v !== undefined && q.set(k, String(v))
      );
      const batch = await request<Student[]>(`/students/?${q.toString()}`);
      all.push(...batch);
      if (batch.length < pageSize) break;
      skip += pageSize;
    }
    return all;
  },
  count: (params: { faculty_id?: string; level?: number; status?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<StudentCount>(`/students/count?${q.toString()}`);
  },
  statistics: (facultyId?: string | null) => {
    const q = new URLSearchParams();
    if (facultyId) q.set('faculty_id', facultyId);
    return request<any>(`/students/statistics?${q.toString()}`);
  },
  get:    (id: string) => request<Student>(`/students/${id}`),
  create: (data: Partial<Student>) => request<Student>('/students/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Student>) => request<Student>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/students/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Student Profile API
// ─────────────────────────────────────────────────────────────────────────────
export const studentProfileApi = {
  get: (studentId: string) =>
    request<any>(`/students/${studentId}/profile`),
  update: (studentId: string, data: any) =>
    request<any>(`/students/${studentId}/profile`, { method: 'POST', body: JSON.stringify(data) }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Courses API
// ─────────────────────────────────────────────────────────────────────────────
export const coursesApi = {
  list: (params: { faculty_id?: string; department_id?: string; level?: number; semester?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<Course[]>(`/courses/?${q.toString()}`);
  },
  get:    (id: string) => request<Course>(`/courses/${id}`),
  create: (data: Partial<Course>) => request<Course>('/courses/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Course>) => request<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/courses/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Enrollments API
// ─────────────────────────────────────────────────────────────────────────────
export const enrollmentsApi = {
  list: (params: { student_id?: string; course_id?: string; semester?: string; status?: string; skip?: number; limit?: number } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<Enrollment[]>(`/enrollments/?${q.toString()}`);
  },
  get:    (id: number) => request<Enrollment>(`/enrollments/${id}`),
  create: (data: Partial<Enrollment>) => request<Enrollment>('/enrollments/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Enrollment>) => request<Enrollment>(`/enrollments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/enrollments/${id}`, { method: 'DELETE' }),
  listAll: async (params: { student_id?: string; course_id?: string; semester?: string; status?: string } = {}) => {
    const pageSize = 1000;
    const all: Enrollment[] = [];
    let skip = 0;
    for (;;) {
      const batch = await enrollmentsApi.list({ ...params, skip, limit: pageSize });
      all.push(...batch);
      if (batch.length < pageSize) break;
      skip += pageSize;
    }
    return all;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Grades API
// ─────────────────────────────────────────────────────────────────────────────
export const gradesApi = {
  list: (params: {
    student_id?: string;
    course_id?: string;
    semester?: string;
    skip?: number;
    limit?: number;
  } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<Grade[]>(`${GRADES_PREFIX}/?${q.toString()}`);
  },
  /** جلب كل الدرجات (الخادم يسمح بحد أقصى 1000 لكل طلب). */
  listAll: async (params: { student_id?: string; course_id?: string; semester?: string } = {}) => {
    const pageSize = 1000;
    const all: Grade[] = [];
    let skip = 0;
    for (;;) {
      const batch = await gradesApi.list({ ...params, skip, limit: pageSize });
      all.push(...batch);
      if (batch.length < pageSize) break;
      skip += pageSize;
    }
    return all;
  },
  get:    (id: number) => request<Grade>(`${GRADES_PREFIX}/${id}`),
  create: (data: Partial<Grade>) => request<Grade>(`${GRADES_PREFIX}/`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Grade>) => request<Grade>(`${GRADES_PREFIX}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`${GRADES_PREFIX}/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Attendance API
// ─────────────────────────────────────────────────────────────────────────────
export const attendanceApi = {
  list: (params: { student_id?: string; course_id?: string; faculty_id?: string; status?: string; date_from?: string; date_to?: string; skip?: number; limit?: number } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<AttendanceRecord[]>(`/attendance/?${q.toString()}`);
  },
  summary: (studentId: string, courseId: string) =>
    request<AttendanceSummary>(`/attendance/summary/${studentId}/${courseId}`),
  get:    (id: number) => request<AttendanceRecord>(`/attendance/${id}`),
  create: (data: Partial<AttendanceRecord>) => request<AttendanceRecord>('/attendance/', { method: 'POST', body: JSON.stringify(data) }),
  bulkCreate: (records: Partial<AttendanceRecord>[]) =>
    request<{ created: number }>('/attendance/bulk', { method: 'POST', body: JSON.stringify({ records }) }),
  update: (id: number, data: { status: string; notes?: string }) =>
    request<AttendanceRecord>(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/attendance/${id}`, { method: 'DELETE' }),
  listAll: async (params: { student_id?: string; course_id?: string; faculty_id?: string; status?: string; date_from?: string; date_to?: string } = {}) => {
    const pageSize = 1000;
    const all: AttendanceRecord[] = [];
    let skip = 0;
    for (;;) {
      const batch = await attendanceApi.list({ ...params, skip, limit: pageSize });
      all.push(...batch);
      if (batch.length < pageSize) break;
      skip += pageSize;
    }
    return all;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Financial API
// ─────────────────────────────────────────────────────────────────────────────
export const financialApi = {
  list: (params: { student_id?: string; status?: string; academic_year?: string; faculty_id?: string; skip?: number; limit?: number } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<FinancialRecord[]>(`/financial/?${q.toString()}`);
  },
  summary: (studentId: string) =>
    request<FinancialSummary>(`/financial/student/${studentId}/summary`),
  get:    (id: number) => request<FinancialRecord>(`/financial/${id}`),
  create: (data: Partial<FinancialRecord>) => request<FinancialRecord>('/financial/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<FinancialRecord>) =>
    request<FinancialRecord>(`/financial/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/financial/${id}`, { method: 'DELETE' }),
  listAll: async (params: { student_id?: string; status?: string; academic_year?: string; faculty_id?: string } = {}) => {
    const pageSize = 1000;
    const all: FinancialRecord[] = [];
    let skip = 0;
    for (;;) {
      const batch = await financialApi.list({ ...params, skip, limit: pageSize });
      all.push(...batch);
      if (batch.length < pageSize) break;
      skip += pageSize;
    }
    return all;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Schedules API
// ─────────────────────────────────────────────────────────────────────────────
export const schedulesApi = {
  list: (params: { course_id?: string; room_id?: string; day?: string; semester?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<CourseSchedule[]>(`/schedules/?${q.toString()}`);
  },
  forStudent: (studentId: string, semester?: string) =>
    request<CourseSchedule[]>(`/schedules/student/${studentId}${semester ? `?semester=${encodeURIComponent(semester)}` : ''}`),
  get:    (id: number) => request<CourseSchedule>(`/schedules/${id}`),
  create: (data: Partial<CourseSchedule>) => request<CourseSchedule>('/schedules/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CourseSchedule>) => request<CourseSchedule>(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/schedules/${id}`, { method: 'DELETE' }),
  checkConflict: (data: { room_id: string; day: string; time_start?: string; time_end?: string; exclude_id?: number }) =>
    request<{ has_conflict: boolean; conflicts: any[] }>('/schedules/check-conflict', { method: 'POST', body: JSON.stringify(data) }),
  bulkCreate: (schedules: any[]) =>
    request<{ created: number; rows: CourseSchedule[] }>('/schedules/bulk-create', { method: 'POST', body: JSON.stringify({ schedules }) }),
  roomAvailability: (params: { room_id?: string; day?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<any[]>(`/schedules/room-availability?${q.toString()}`);
  },
  autoGenerate: (data: { faculty_id?: string; semester?: string; academic_year?: string; dry_run?: boolean }) =>
    request<{ generated: number; preview: CourseSchedule[]; dry_run: boolean }>('/schedules/auto-generate', { method: 'POST', body: JSON.stringify(data) }),
  availabilityGrid: (params: { faculty_id?: string; semester?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<any>(`/schedules/availability-grid?${q.toString()}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Rooms API
// ─────────────────────────────────────────────────────────────────────────────
export const roomsApi = {
  list: (params: { room_type?: string; status?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<Room[]>(`/rooms/?${q.toString()}`);
  },
  get:    (id: string) => request<Room>(`/rooms/${id}`),
  create: (data: Partial<Room>) => request<Room>('/rooms/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Room>) => request<Room>(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/rooms/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Committees API
// ─────────────────────────────────────────────────────────────────────────────
export const committeesApi = {
  list: (params: { status?: string; semester?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<Committee[]>(`/committees/?${q.toString()}`);
  },
  get:    (id: number) => request<Committee>(`/committees/${id}`),
  create: (data: Partial<Committee>) => request<Committee>('/committees/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Committee>) => request<Committee>(`/committees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/committees/${id}`, { method: 'DELETE' }),
  listStudents: (committeeId: number) => request<any[]>(`/committees/${committeeId}/students`),
  assignStudent: (
    committeeId: number,
    data: { student_id: string; committee_id: number; seat_number?: string; seat_row?: number; seat_column?: number }
  ) => request<any>(`/committees/${committeeId}/students`, { method: 'POST', body: JSON.stringify(data) }),
  removeStudent: (committeeId: number, studentId: string) =>
    request<void>(`/committees/${committeeId}/students/${studentId}`, { method: 'DELETE' }),
  listAssignments: (params: { student_id?: string; committee_id?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.student_id) q.set('student_id', params.student_id);
    if (params.committee_id) q.set('committee_id', String(params.committee_id));
    return request<any[]>(`/committees/assignments?${q.toString()}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Registration Requests API
// ─────────────────────────────────────────────────────────────────────────────
import { ReportSignature } from './types';
export const regRequestsApi = {
  list: (params: { student_id?: string; status?: string; faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<RegistrationRequest[]>(`/registration-requests/?${q.toString()}`);
  },
  listBlocks: (params: { student_id?: string; status?: string; faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<StudentBlock[]>(`/registration-requests/blocks/?${q.toString()}`);
  },
  get:    (id: string) => request<RegistrationRequest>(`/registration-requests/${id}`),
  create: (data: { id: string; student_id: string; comment?: string }) =>
    request<RegistrationRequest>('/registration-requests/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { status?: string; admin_response?: string }) =>
    request<RegistrationRequest>(`/registration-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/registration-requests/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Course Closures API
// ─────────────────────────────────────────────────────────────────────────────
export const courseClosuresApi = {
  list: (params: { course_code?: string; academic_year?: string; semester?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<CourseClose[]>(`/course-closures?${q.toString()}`);
  },
  get: (id: number) => request<CourseClose>(`/course-closures/${id}`),
  create: (data: Partial<CourseClose>) => request<CourseClose>('/course-closures', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CourseClose>) => request<CourseClose>(`/course-closures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/course-closures/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Report Signatures API
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Report Signatures API
// ─────────────────────────────────────────────────────────────────────────────
export const reportSignaturesApi = {
  list: () => request<ReportSignature[]>('/report-signatures/'),
  get:  (id: string) => request<ReportSignature>(`/report-signatures/${id}`),
  create: (data: Partial<ReportSignature>) => request<ReportSignature>('/report-signatures/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ReportSignature>) => request<ReportSignature>(`/report-signatures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/report-signatures/${id}`, { method: 'DELETE' }),
};

// Academic Structure Types (matching backend snake_case)
export interface ProgramResponse {
  id: string;
  name: string;
  name_en?: string;
  code: string;
  degree: string;
  department_id: string;
  faculty_id: string;
  total_hours: number;
  mandatory_hours: number;
  elective_hours: number;
  university_requirements: number;
  tracks?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface RegulationResponse {
  id: string;
  name: string;
  program_id: string;
  registration_rules?: string;
  pass_fail_rules?: string;
  absence_policy?: string;
  mandatory_hours: number;
  elective_hours: number;
  university_requirements: number;
  created_at?: string;
  updated_at?: string;
}

export interface RulesResponse {
  id: string;
  faculty_id: string;
  rules_data: any;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Academic Structure APIs
// ─────────────────────────────────────────────────────────────────────────────

export const programsApi = {
  list: (params: { faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.faculty_id) q.set('faculty_id', params.faculty_id);
    return request<ProgramResponse[]>(`/programs/?${q.toString()}`);
  },
  get: (id: string) => request<ProgramResponse>(`/programs/${id}`),
  create: (data: Partial<ProgramResponse>) => request<ProgramResponse>('/programs/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ProgramResponse>) => request<ProgramResponse>(`/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/programs/${id}`, { method: 'DELETE' }),
};

export const regulationsApi = {
  list: (params: { program_id?: string, faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.program_id) q.set('program_id', params.program_id);
    if (params.faculty_id) q.set('faculty_id', params.faculty_id);
    return request<RegulationResponse[]>(`/regulations/?${q.toString()}`);
  },
  get: (id: string) => request<RegulationResponse>(`/regulations/${id}`),
  create: (data: Partial<RegulationResponse>) => request<RegulationResponse>('/regulations/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<RegulationResponse>) => request<RegulationResponse>(`/regulations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/regulations/${id}`, { method: 'DELETE' }),
};


// ─────────────────────────────────────────────────────────────────────────────
// Student Affairs Enhancements API
// ─────────────────────────────────────────────────────────────────────────────

export interface StudentRequirement {
  id: number;
  student_id: string;
  requirement_key: string;
  status: 'pending' | 'submitted' | 'verified';
  notes?: string;
  updated_at: string;
}

export interface StudentDocument {
  id: number;
  student_id: string;
  type: string;
  title: string;
  filename?: string;
  mime_type?: string;
  size?: number;
  data_url: string;
  uploaded_at: string;
}

export interface ActivityLog {
  id: number;
  user_id?: string;
  faculty_id?: string;
  entity_type: string;
  entity_id?: string;
  action: string;
  description?: string;
  performed_at: string;
}

export const studentRequirementsApi = {
  list: (studentId?: string) =>
    request<StudentRequirement[]>(`/student-requirements/${studentId ? `?student_id=${studentId}` : ''}`),
  get: (id: number) =>
    request<StudentRequirement>(`/student-requirements/${id}`),
  create: (data: Partial<StudentRequirement>) =>
    request<StudentRequirement>('/student-requirements/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<StudentRequirement>) =>
    request<StudentRequirement>(`/student-requirements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/student-requirements/${id}`, { method: 'DELETE' }),
  bulkCreate: (data: Partial<StudentRequirement>[]) =>
    request<StudentRequirement[]>('/student-requirements/bulk', { method: 'POST', body: JSON.stringify(data) }),
};

export const studentDocumentsApi = {
  list: (studentId?: string) =>
    request<StudentDocument[]>(`/student-documents/${studentId ? `?student_id=${studentId}` : ''}`),
  create: (data: Partial<StudentDocument>) =>
    request<StudentDocument>('/student-documents/', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/student-documents/${id}`, { method: 'DELETE' }),
};

export interface CourseEquivalence {
  id?: number;
  student_id: string;
  original_course_id: string;
  equivalent_course_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const courseEquivalencesApi = {
  list: (params: { student_id?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<CourseEquivalence[]>(`/course-equivalences/?${q.toString()}`);
  },
  get: (id: number) =>
    request<CourseEquivalence>(`/course-equivalences/${id}`),
  create: (data: Partial<CourseEquivalence>) =>
    request<CourseEquivalence>('/course-equivalences/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CourseEquivalence>) =>
    request<CourseEquivalence>(`/course-equivalences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/course-equivalences/${id}`, { method: 'DELETE' }),
};

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  faculty_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const usersApi = {
  list: (params: { faculty_id?: string; role?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<UserResponse[]>(`/users/?${q.toString()}`);
  },
  get: (id: string) => request<UserResponse>(`/users/${id}`),
  create: (data: any) => request<UserResponse>('/users/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<UserResponse>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
};

export const activityLogsApi = {
  list: (params: { faculty_id?: string; entity_type?: string; limit?: number } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<ActivityLog[]>(`/activity-logs/?${q.toString()}`);
  },
  create: (data: Partial<ActivityLog>) =>
    request<ActivityLog>('/activity-logs/', { method: 'POST', body: JSON.stringify(data) }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Academic Rules API
// ─────────────────────────────────────────────────────────────────────────────
export const academicRulesApi = {
  list: (params: { faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.faculty_id) q.set('faculty_id', params.faculty_id);
    return request<any[]>(`/academic-rules/?${q.toString()}`);
  },
  get:    (id: string) => request<any>(`/academic-rules/${id}`),
  getByFaculty: (faculty_id: string) => request<any>(`/academic-rules/by-faculty/${faculty_id}`),
  create: (data: any) => request<any>(`/academic-rules/`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/academic-rules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/academic-rules/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// System Settings API
// ─────────────────────────────────────────────────────────────────────────────
export const systemSettingsApi = {
  list: (params: { faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.faculty_id) q.set('faculty_id', params.faculty_id);
    return request<any[]>(`/system-settings/?${q.toString()}`);
  },
  get: (id: string) => request<any>(`/system-settings/${id}`),
  create: (data: any) => request<any>('/system-settings/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/system-settings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/system-settings/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Survey Rules API
// ─────────────────────────────────────────────────────────────────────────────
export const surveyRulesApi = {
  list: (params: { faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.faculty_id) q.set('faculty_id', params.faculty_id);
    return request<any[]>(`/survey-rules/?${q.toString()}`);
  },
  get: (id: string) => request<any>(`/survey-rules/${id}`),
  create: (data: any) => request<any>('/survey-rules/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/survey-rules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/survey-rules/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Staff API
// ─────────────────────────────────────────────────────────────────────────────
export const staffApi = {
  list: (params: { faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.faculty_id) q.set('faculty_id', params.faculty_id);
    return request<any[]>(`/staff/?${q.toString()}`);
  },
  get: (id: string) => request<any>(`/staff/${id}`),
  create: (data: any) => request<any>('/staff/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/staff/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Academic Calendar API
// ─────────────────────────────────────────────────────────────────────────────
export const academicCalendarApi = {
  list: (params: { faculty_id?: string; year?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<any[]>(`/academic-calendar/?${q.toString()}`);
  },
  get: (id: string) => request<any>(`/academic-calendar/${id}`),
  create: (data: any) => request<any>('/academic-calendar/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/academic-calendar/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/academic-calendar/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Announcements API
// ─────────────────────────────────────────────────────────────────────────────
export const announcementsApi = {
  list: (params: { faculty_id?: string; status?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    return request<any[]>(`/announcements/?${q.toString()}`);
  },
  get: (id: string) => request<any>(`/announcements/${id}`),
  create: (data: any) => request<any>('/announcements/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/announcements/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Fee Setup API
// ─────────────────────────────────────────────────────────────────────────────
export const feeSetupApi = {
  list: (params: { faculty_id?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.faculty_id) q.set('faculty_id', params.faculty_id);
    return request<any[]>(`/fee-setup/?${q.toString()}`);
  },
  get: (id: number) => request<any>(`/fee-setup/${id}`),
  create: (data: any) => request<any>('/fee-setup/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/fee-setup/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/fee-setup/${id}`, { method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────
export const checkBackend = () => request<{ status: string; version?: string }>('/health');
