/**
 * Lookup API Service
 * ==================
 * Handles fetching all form options and reference data from the FastAPI backend.
 * This replaces hardcoded dropdown data with live data from the database.
 */

import * as api from './api';

export interface FormOptionsCacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class LookupApiService {
  private cache: Map<string, FormOptionsCacheEntry> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private activeFacultyId: string | null = null;

  /**
   * Set the active faculty for filtering data
   */
  setActiveFacultyId(facultyId: string | null) {
    this.activeFacultyId = facultyId;
    this.clearFormOptionsCache();
  }

  /**
   * Get the currently active faculty ID
   */
  getActiveFacultyId(): string | null {
    return this.activeFacultyId;
  }

  /**
   * Fetch all form options at once
   */
  async loadAllOptions() {
    return {
      faculties: await this.getFaculties(),
      departments: await this.getDepartments(),
      courses: await this.getCourses(),
      instructors: await this.getInstructors(),
      rooms: await this.getRooms(),
      programs: await this.getPrograms(),
    };
  }

  /**
   * Get all faculties
   */
  async getFaculties() {
    return this.getCached('faculties', async () => {
      const faculties = await api.facultiesApi.list();
      return faculties.map(f => ({
        id: f.id,
        name: f.name,
        name_en: f.name_en,
        code: f.code,
      }));
    });
  }

  /**
   * Get departments, optionally filtered by faculty
   */
  async getDepartments(facultyId?: string) {
    const fId = facultyId || this.activeFacultyId;
    const key = fId ? `departments_${fId}` : 'departments';
    return this.getCached(key, async () => {
      const departments = await api.departmentsApi.list(fId || undefined);
      return departments.map(d => ({
        id: d.id,
        faculty_id: d.faculty_id,
        name: d.name,
        name_en: d.name_en,
        code: d.code,
        head_name: d.head_name,
      }));
    });
  }

  /**
   * Get all courses, optionally filtered
   */
  async getCourses(params?: { faculty_id?: string; department_id?: string; level?: number }) {
    const mergedParams = {
      ...params,
      faculty_id: params?.faculty_id || this.activeFacultyId || undefined,
    };
    const key = mergedParams.faculty_id || mergedParams.department_id || mergedParams.level
      ? `courses_${JSON.stringify(mergedParams)}`
      : 'courses';
    return this.getCached(key, async () => {
      const courses = await api.coursesApi.list(mergedParams);
      return courses.map(c => ({
        id: c.id,
        name: c.name,
        name_en: c.name_en,
        level: c.level,
        course_type: c.course_type,
        credit_hours: c.credit_hours,
        department_id: c.department_id,
        faculty_id: c.faculty_id,
      }));
    });
  }

  /**
   * Get all rooms for dropdown (classrooms and labs)
   */
  async getRooms(params?: { room_type?: string; status?: string }) {
    const key = params ? `rooms_${JSON.stringify(params)}` : 'rooms';
    return this.getCached(key, async () => {
      const rooms = await api.roomsApi.list(params);
      return rooms.map(r => ({
        id: r.id,
        code: r.code,
        name: r.name,
        room_type: r.room_type,
        capacity: r.capacity,
        building: r.building,
        status: r.status,
      }));
    });
  }

  /**
   * Get instructors (from users with instructor role or from courses)
   * Since we don't have a dedicated instructors endpoint, we fetch from users API
   */
  async getInstructors() {
    return this.getCached('instructors', async () => {
      try {
        const users = await api.usersApi.list();
        // Filter to get instructors (adjust role name as needed)
        return users
          .filter(u => u.role === 'instructor' || u.role === 'faculty_admin')
          .map(u => ({
            id: u.id,
            name: u.username,
            email: u.email,
            role: u.role,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch (e) {
        console.warn('Failed to fetch instructors from users API', e);
        return [];
      }
    });
  }

  /**
   * Get all programs, optionally filtered by faculty
   */
  async getPrograms(facultyId?: string) {
    const fId = facultyId || this.activeFacultyId;
    const key = fId ? `programs_${fId}` : 'programs';
    return this.getCached(key, async () => {
      const programs = await api.programsApi.list(fId ? { faculty_id: fId } : {});
      return programs.map(p => ({
        id: p.id,
        name: p.name,
        name_en: p.name_en,
        code: p.code,
        degree: p.degree,
        department_id: p.department_id,
        faculty_id: p.faculty_id,
      }));
    });
  }

  /**
   * Get regulations for a program
   */
  async getRegulations(programId?: string) {
    const key = programId ? `regulations_${programId}` : 'regulations';
    return this.getCached(key, async () => {
      const params = programId ? { program_id: programId } : {};
      const regulations = await api.regulationsApi.list(params);
      return regulations.map(r => ({
        id: r.id,
        name: r.name,
        program_id: r.program_id,
      }));
    });
  }

  /**
   * Get committees (for display in dropdowns if needed)
   */
  async getCommittees() {
    return this.getCached('committees', async () => {
      const committees = await api.committeesApi.list();
      return committees.map(c => ({
        id: c.id,
        name: c.name,
        course_name: c.course_name,
        room_code: c.room_code,
        status: c.status,
      }));
    });
  }

  /**
   * Generic cache getter - checks TTL and returns cached data if valid
   */
  private async getCached<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl: ttl || this.DEFAULT_TTL,
      });
      return data;
    } catch (error) {
      // If auth error and not logged in yet, return empty array
      if (error instanceof Error && error.message.includes('Could not validate credentials')) {
        console.warn(`⚠️ Not authenticated yet. Returning empty data for: ${key}`);
        return [] as unknown as T;
      }
      console.error(`Failed to fetch lookup data for key: ${key}`, error);
      // Return empty array as fallback instead of throwing
      return [] as unknown as T;
    }
  }

  /**
   * Clear cache for a specific key or all if no key provided
   */
  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Clear cache for all form options (useful when data changes)
   */
  clearFormOptionsCache() {
    this.clearCache('faculties');
    this.clearCache('departments');
    this.clearCache('courses');
    this.clearCache('instructors');
    this.clearCache('rooms');
    this.clearCache('programs');
    this.clearCache('committees');
  }
}

export const lookupApi = new LookupApiService();
