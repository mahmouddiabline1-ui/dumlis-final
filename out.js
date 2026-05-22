var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// data/pageConfig.ts
var pageConfig_exports = {};
__export(pageConfig_exports, {
  ALL_STUDENTS: () => ALL_STUDENTS,
  ATTENDANCE_RECORDS: () => ATTENDANCE_RECORDS,
  CITIES: () => CITIES,
  CLASSROOM_ASSIGNMENTS: () => CLASSROOM_ASSIGNMENTS,
  COURSES_DATABASE: () => COURSES_DATABASE,
  COURSE_SCHEDULES: () => COURSE_SCHEDULES,
  DEPARTMENTS_FCAI: () => DEPARTMENTS_FCAI,
  FCAI_STUDENTS: () => FCAI_STUDENTS,
  FINANCIAL_RECORDS: () => FINANCIAL_RECORDS,
  LEVELS: () => LEVELS,
  MOCK_DATABASE: () => MOCK_DATABASE,
  NEW_REGULATION_STUDENTS: () => NEW_REGULATION_STUDENTS,
  OLD_REGULATION_STUDENTS: () => OLD_REGULATION_STUDENTS,
  REGULATIONS: () => REGULATIONS,
  STATUSES: () => STATUSES,
  STUDENT_ENROLLMENTS: () => STUDENT_ENROLLMENTS,
  STUDENT_GRADES: () => STUDENT_GRADES,
  STUDENT_SCHEDULES: () => STUDENT_SCHEDULES,
  addRoomAssignment: () => addRoomAssignment,
  createDefaultAcademicRules: () => createDefaultAcademicRules,
  deleteAcademicCourse: () => deleteAcademicCourse,
  deleteAcademicDepartment: () => deleteAcademicDepartment,
  deleteAcademicFaculty: () => deleteAcademicFaculty,
  deleteAcademicProgram: () => deleteAcademicProgram,
  deleteAcademicRegulation: () => deleteAcademicRegulation,
  deleteAcademicRules: () => deleteAcademicRules,
  getAcademicCourses: () => getAcademicCourses,
  getAcademicDepartments: () => getAcademicDepartments,
  getAcademicFaculties: () => getAcademicFaculties,
  getAcademicPrograms: () => getAcademicPrograms,
  getAcademicRegulations: () => getAcademicRegulations,
  getAcademicRules: () => getAcademicRules,
  getAcademicRulesByFaculty: () => getAcademicRulesByFaculty,
  getCurrentAcademicContext: () => getCurrentAcademicContext,
  getDepartmentStatistics: () => getDepartmentStatistics,
  getDynamicFeesCollect: () => getDynamicFeesCollect,
  getDynamicFeesSetup: () => getDynamicFeesSetup,
  getDynamicPaymentPerm: () => getDynamicPaymentPerm,
  getPageConfig: () => getPageConfig,
  getRoomAssignments: () => getRoomAssignments,
  getStudentStatistics: () => getStudentStatistics,
  saveAcademicCourse: () => saveAcademicCourse,
  saveAcademicDepartment: () => saveAcademicDepartment,
  saveAcademicFaculty: () => saveAcademicFaculty,
  saveAcademicProgram: () => saveAcademicProgram,
  saveAcademicRegulation: () => saveAcademicRegulation,
  saveAcademicRules: () => saveAcademicRules
});
module.exports = __toCommonJS(pageConfig_exports);

// constants.tsx
var FACULTIES = [
  {
    id: "FCAI",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
    icon: "\u{1F4BB}",
    studentCount: 2e3,
    staffCount: 120,
    color: "bg-blue-600"
  },
  {
    id: "SCI",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u0639\u0644\u0648\u0645",
    icon: "\u{1F52C}",
    studentCount: 375,
    staffCount: 250,
    color: "bg-green-600"
  },
  {
    id: "COM",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u0629",
    icon: "\u{1F4CA}",
    studentCount: 375,
    staffCount: 300,
    color: "bg-yellow-600"
  },
  {
    id: "EDU",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062A\u0631\u0628\u064A\u0629",
    icon: "\u{1F4DA}",
    studentCount: 375,
    staffCount: 200,
    color: "bg-red-600"
  },
  {
    id: "ENG",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u0647\u0646\u062F\u0633\u0629",
    icon: "\u2699\uFE0F",
    studentCount: 375,
    staffCount: 180,
    color: "bg-purple-600"
  },
  {
    id: "MED",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u0637\u0628",
    icon: "\u{1F3E5}",
    studentCount: 1500,
    staffCount: 150,
    color: "bg-pink-600"
  },
  {
    id: "PHR",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u0629",
    icon: "\u{1F48A}",
    studentCount: 1200,
    staffCount: 100,
    color: "bg-indigo-600"
  },
  {
    id: "LAW",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0642\u0648\u0642",
    icon: "\u2696\uFE0F",
    studentCount: 3e3,
    staffCount: 120,
    color: "bg-gray-600"
  },
  {
    id: "ART",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u0622\u062F\u0627\u0628",
    icon: "\u{1F4D6}",
    studentCount: 4500,
    staffCount: 180,
    color: "bg-orange-600"
  },
  {
    id: "AGR",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u0632\u0631\u0627\u0639\u0629",
    icon: "\u{1F33E}",
    studentCount: 2800,
    staffCount: 140,
    color: "bg-lime-600"
  },
  {
    id: "NRS",
    name: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062A\u0645\u0631\u064A\u0636",
    icon: "\u{1F3E5}",
    studentCount: 2e3,
    staffCount: 110,
    color: "bg-teal-600"
  }
];

// data/pageConfig.ts
var COURSES_DATABASE = [];
var ALL_STUDENTS = [];
var OLD_REGULATION_STUDENTS = [];
var NEW_REGULATION_STUDENTS = [];
var STUDENT_ENROLLMENTS = [];
var STUDENT_GRADES = [];
var ATTENDANCE_RECORDS = [];
var CLASSROOM_ASSIGNMENTS = [];
var FINANCIAL_RECORDS = [];
var COURSE_SCHEDULES = [];
var DEPARTMENTS_FCAI = [];
var STATUSES = [];
var CITIES = [];
var LEVELS = [];
var REGULATIONS = [];
var STUDENT_SCHEDULES = [];
var FCAI_STUDENTS = [];
var getCurrentAcademicContext = () => ({ semester: "\u0631\u0628\u064A\u0639", academicYear: "2023-2024" });
var getDynamicFeesSetup = () => [];
var getDynamicFeesCollect = () => [];
var getDynamicPaymentPerm = () => [];
var MOCK_DATABASE = {
  // ==================================================================================
  // ADMIN: STUDENT LIST (GENERATED DATA)
  // ==================================================================================
  "student_list": {
    id: "student_list",
    title: "\u0642\u0648\u0627\u0626\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0642\u064A\u062F\u064A\u0646",
    description: `\u0639\u0631\u0636 \u0648\u0625\u062F\u0627\u0631\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A\u0629 (3500 \u0637\u0627\u0644\u0628 \u0625\u062C\u0645\u0627\u0644\u064A - 1500 \u0644\u0627\u0626\u062D\u0629 \u0642\u062F\u064A\u0645\u0629\u060C 2000 \u0644\u0627\u0626\u062D\u0629 \u062C\u062F\u064A\u062F\u0629)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "national_id", label: "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0642\u0648\u0645\u064A" },
      { key: "faculty", label: "\u0627\u0644\u0643\u0644\u064A\u0629" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645 / \u0627\u0644\u0634\u0639\u0628\u0629" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "regulation", label: "\u0627\u0644\u0644\u0627\u0626\u062D\u0629", type: "status" },
      { key: "gpa", label: "GPA" },
      { key: "phone", label: "\u0627\u0644\u0647\u0627\u062A\u0641" },
      { key: "email", label: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" },
      { key: "city", label: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629" },
      { key: "fees_status", label: "\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A", type: "status" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: ALL_STUDENTS,
    actions: [
      { type: "add", label: "\u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628 \u062C\u062F\u064A\u062F" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0643\u0634\u0641" }
    ]
  },
  // ==================================================================================
  // REGULATION-BASED STUDENT LISTS
  // ==================================================================================
  "old_regulation_students": {
    id: "old_regulation_students",
    title: "\u0637\u0644\u0627\u0628 \u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0627\u0644\u0642\u062F\u064A\u0645\u0629",
    description: `\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0642\u064A\u062F\u064A\u0646 \u0628\u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 (${OLD_REGULATION_STUDENTS.length} \u0637\u0627\u0644\u0628)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "faculty", label: "\u0627\u0644\u0643\u0644\u064A\u0629" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645 / \u0627\u0644\u0634\u0639\u0628\u0629" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: OLD_REGULATION_STUDENTS,
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0643\u0634\u0641" }
    ]
  },
  "new_regulation_students": {
    id: "new_regulation_students",
    title: "\u0637\u0644\u0627\u0628 \u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629",
    description: `\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0642\u064A\u062F\u064A\u0646 \u0628\u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 (${NEW_REGULATION_STUDENTS.length} \u0637\u0627\u0644\u0628)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "faculty", label: "\u0627\u0644\u0643\u0644\u064A\u0629" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645 / \u0627\u0644\u0634\u0639\u0628\u0629" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: NEW_REGULATION_STUDENTS,
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0643\u0634\u0641" }
    ]
  },
  "regulation_statistics": {
    id: "regulation_statistics",
    title: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u0644\u0648\u0627\u0626\u062D",
    description: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0645\u0642\u0627\u0631\u0646\u0629 \u0628\u064A\u0646 \u0637\u0644\u0627\u0628 \u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u0648\u0627\u0644\u062C\u062F\u064A\u062F\u0629",
    type: "table",
    columns: [
      { key: "regulation", label: "\u0627\u0644\u0644\u0627\u0626\u062D\u0629" },
      { key: "total_students", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0627\u0628" },
      { key: "fcai_students", label: "\u0637\u0644\u0627\u0628 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A" },
      { key: "other_students", label: "\u0637\u0644\u0627\u0628 \u0643\u0644\u064A\u0627\u062A \u0623\u062E\u0631\u0649" },
      { key: "active_students", label: "\u0637\u0644\u0627\u0628 \u0646\u0634\u0637\u064A\u0646" },
      { key: "average_gpa", label: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0645\u0639\u062F\u0644" }
    ],
    data: (() => {
      const oldStats = {
        regulation: "\u0644\u0627\u0626\u062D\u0629 \u0642\u062F\u064A\u0645\u0629",
        total_students: OLD_REGULATION_STUDENTS.length,
        fcai_students: OLD_REGULATION_STUDENTS.filter((s) => s.faculty_code === "FCAI").length,
        other_students: OLD_REGULATION_STUDENTS.filter((s) => s.faculty_code !== "FCAI").length,
        active_students: OLD_REGULATION_STUDENTS.filter((s) => s.status === "\u0645\u0642\u064A\u062F").length,
        average_gpa: (OLD_REGULATION_STUDENTS.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / OLD_REGULATION_STUDENTS.length).toFixed(2)
      };
      const newStats = {
        regulation: "\u0644\u0627\u0626\u062D\u0629 \u062C\u062F\u064A\u062F\u0629",
        total_students: NEW_REGULATION_STUDENTS.length,
        fcai_students: NEW_REGULATION_STUDENTS.filter((s) => s.faculty_code === "FCAI").length,
        other_students: NEW_REGULATION_STUDENTS.filter((s) => s.faculty_code !== "FCAI").length,
        active_students: NEW_REGULATION_STUDENTS.filter((s) => s.status === "\u0645\u0642\u064A\u062F").length,
        average_gpa: (NEW_REGULATION_STUDENTS.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / NEW_REGULATION_STUDENTS.length).toFixed(2)
      };
      return [oldStats, newStats];
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u062A\u0642\u0631\u064A\u0631" }
    ]
  },
  "advanced_student_search": {
    id: "advanced_student_search",
    title: "\u0627\u0644\u0628\u062D\u062B \u0627\u0644\u0645\u062A\u0642\u062F\u0645 \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u0628\u062D\u062B \u0648\u0641\u0644\u062A\u0631\u0629 \u0645\u062A\u0642\u062F\u0645\u0629 \u0644\u0642\u0627\u0639\u062F\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0645\u0639\u0627\u064A\u064A\u0631 \u0645\u062A\u0639\u062F\u062F\u0629",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "faculty", label: "\u0627\u0644\u0643\u0644\u064A\u0629" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "regulation", label: "\u0627\u0644\u0644\u0627\u0626\u062D\u0629", type: "status" },
      { key: "gpa", label: "\u0627\u0644\u0645\u0639\u062F\u0644" },
      { key: "city", label: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: ALL_STUDENTS,
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0646\u062A\u0627\u0626\u062C" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // ==================================================================================
  // COURSES AND ENROLLMENT MANAGEMENT
  // ==================================================================================
  "course_catalog": {
    id: "course_catalog",
    title: "\u0643\u062A\u0627\u0644\u0648\u062C \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: "\u0642\u0627\u0626\u0645\u0629 \u0634\u0627\u0645\u0644\u0629 \u0628\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645",
    type: "table",
    columns: [
      { key: "id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645" },
      { key: "hours", label: "\u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629" },
      { key: "type", label: "\u0627\u0644\u0646\u0648\u0639" },
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" }
    ],
    data: COURSES_DATABASE,
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u0631\u0631 \u062C\u062F\u064A\u062F" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u0645\u0642\u0631\u0631" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  "student_enrollments": {
    id: "student_enrollments",
    title: "\u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    description: `\u0639\u0631\u0636 \u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 (${STUDENT_ENROLLMENTS.length} \u062A\u0633\u062C\u064A\u0644)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644", type: "status" }
    ],
    data: STUDENT_ENROLLMENTS,
    actions: [
      { type: "add", label: "\u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628 \u0641\u064A \u0645\u0642\u0631\u0631" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  "detailed_grades": {
    id: "detailed_grades",
    title: "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A\u0629",
    description: `\u0639\u0631\u0636 \u062A\u0641\u0635\u064A\u0644\u064A \u0644\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A (${STUDENT_GRADES.length} \u0633\u062C\u0644 \u062F\u0631\u062C\u0627\u062A)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
      { key: "midterm", label: "\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0633\u0646\u0629" },
      { key: "final", label: "\u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646 \u0627\u0644\u0646\u0647\u0627\u0626\u064A" },
      { key: "assignments", label: "\u0627\u0644\u062A\u0643\u0644\u064A\u0641\u0627\u062A" },
      { key: "total", label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639" },
      { key: "grade_letter", label: "\u0627\u0644\u062A\u0642\u062F\u064A\u0631" },
      { key: "grade_points", label: "\u0627\u0644\u0646\u0642\u0627\u0637" }
    ],
    data: STUDENT_GRADES,
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u062F\u0631\u062C\u0627\u062A" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u062F\u0631\u062C\u0627\u062A" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  "detailed_attendance": {
    id: "detailed_attendance",
    title: "\u0633\u062C\u0644 \u0627\u0644\u062D\u0636\u0648\u0631 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A",
    description: `\u0633\u062C\u0644 \u0645\u0641\u0635\u0644 \u0644\u062D\u0636\u0648\u0631 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u0627\u062A (${ATTENDANCE_RECORDS.length} \u0633\u062C\u0644 \u062D\u0636\u0648\u0631)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "week", label: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639" },
      { key: "date", label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", type: "date" },
      { key: "session_type", label: "\u0646\u0648\u0639 \u0627\u0644\u062C\u0644\u0633\u0629" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0636\u0648\u0631", type: "status" }
    ],
    data: ATTENDANCE_RECORDS,
    actions: [
      { type: "add", label: "\u062A\u0633\u062C\u064A\u0644 \u062D\u0636\u0648\u0631" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u062D\u0636\u0648\u0631" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  "financial_records": {
    id: "financial_records",
    title: "\u0627\u0644\u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
    description: `\u0639\u0631\u0636 \u062A\u0641\u0635\u064A\u0644\u064A \u0644\u0644\u0631\u0633\u0648\u0645 \u0648\u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A (${FINANCIAL_RECORDS.length} \u0633\u062C\u0644 \u0645\u0627\u0644\u064A)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "type", label: "\u0646\u0648\u0639 \u0627\u0644\u0631\u0633\u0648\u0645" },
      { key: "description", label: "\u0627\u0644\u0648\u0635\u0641" },
      { key: "amount", label: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u062D\u0642", type: "currency" },
      { key: "paid_amount", label: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639", type: "currency" },
      { key: "due_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0633\u062A\u062D\u0642\u0627\u0642", type: "date" },
      { key: "payment_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062F\u0641\u0639", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: FINANCIAL_RECORDS,
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0631\u0633\u0648\u0645" },
      { type: "edit", label: "\u062A\u0633\u062C\u064A\u0644 \u062F\u0641\u0639\u0629" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0625\u064A\u0635\u0627\u0644" }
    ]
  },
  // ==================================================================================
  // ANALYTICAL REPORTS WITH RELATIONS
  // ==================================================================================
  "student_academic_profile": {
    id: "student_academic_profile",
    title: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0644\u0644\u0637\u0644\u0627\u0628",
    description: "\u0645\u0644\u0641 \u0634\u0627\u0645\u0644 \u064A\u062C\u0645\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0648\u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0644\u0643\u0644 \u0637\u0627\u0644\u0628",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "enrolled_courses", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629" },
      { key: "completed_courses", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0645\u0644\u0629" },
      { key: "current_gpa", label: "\u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062D\u0627\u0644\u064A" },
      { key: "attendance_rate", label: "\u0645\u0639\u062F\u0644 \u0627\u0644\u062D\u0636\u0648\u0631" },
      { key: "financial_status", label: "\u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629", type: "status" }
    ],
    data: (() => {
      return ALL_STUDENTS.slice(0, 100).map((student) => {
        const enrollments = STUDENT_ENROLLMENTS.filter((e) => e.student_id === student.student_id);
        const grades = STUDENT_GRADES.filter((g) => g.student_id === student.student_id);
        const attendance = ATTENDANCE_RECORDS.filter((a) => a.student_id === student.student_id);
        const financial = FINANCIAL_RECORDS.filter((f) => f.student_id === student.student_id);
        const totalAttendance = attendance.length;
        const presentCount = attendance.filter((a) => a.status === "\u062D\u0627\u0636\u0631").length;
        const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance * 100).toFixed(1) + "%" : "N/A";
        const totalOwed = financial.reduce((sum, f) => sum + f.amount, 0);
        const totalPaid = financial.reduce((sum, f) => sum + f.paid_amount, 0);
        const financialStatus = totalPaid >= totalOwed ? "\u0645\u0633\u062F\u062F \u0628\u0627\u0644\u0643\u0627\u0645\u0644" : "\u064A\u0648\u062C\u062F \u0645\u0633\u062A\u062D\u0642\u0627\u062A";
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
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0645\u0644\u0641" }
    ]
  },
  "course_performance_analysis": {
    id: "course_performance_analysis",
    title: "\u062A\u062D\u0644\u064A\u0644 \u0623\u062F\u0627\u0621 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    description: "\u062A\u062D\u0644\u064A\u0644 \u0634\u0627\u0645\u0644 \u0644\u0623\u062F\u0627\u0621 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u062E\u062A\u0644\u0641\u0629",
    type: "table",
    columns: [
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "enrolled_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646" },
      { key: "completed_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0643\u0645\u0644\u064A\u0646" },
      { key: "pass_rate", label: "\u0645\u0639\u062F\u0644 \u0627\u0644\u0646\u062C\u0627\u062D" },
      { key: "average_grade", label: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u062F\u0631\u062C\u0627\u062A" },
      { key: "attendance_rate", label: "\u0645\u0639\u062F\u0644 \u0627\u0644\u062D\u0636\u0648\u0631" }
    ],
    data: (() => {
      const courseStats = [];
      COURSES_DATABASE.forEach((course) => {
        const enrollments = STUDENT_ENROLLMENTS.filter((e) => e.course_id === course.id);
        const grades = STUDENT_GRADES.filter((g) => g.course_id === course.id);
        const attendance = ATTENDANCE_RECORDS.filter((a) => a.course_id === course.id);
        const passCount = grades.filter((g) => g.grade_points >= 2).length;
        const passRate = grades.length > 0 ? (passCount / grades.length * 100).toFixed(1) + "%" : "N/A";
        const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.total, 0) / grades.length).toFixed(1) : "N/A";
        const totalSessions = attendance.length;
        const presentSessions = attendance.filter((a) => a.status === "\u062D\u0627\u0636\u0631").length;
        const attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions * 100).toFixed(1) + "%" : "N/A";
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
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631" }
    ]
  },
  // ==================================================================================
  // SCHEDULE MANAGEMENT WITH RELATIONS
  // ==================================================================================
  "course_schedules": {
    id: "course_schedules",
    title: "\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: `\u062C\u062F\u0627\u0648\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0645\u0639 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0648\u0627\u0639\u064A\u062F \u0648\u0627\u0644\u0642\u0627\u0639\u0627\u062A (${COURSE_SCHEDULES.length} \u062C\u0644\u0633\u0629 \u062F\u0631\u0627\u0633\u064A\u0629)`,
    type: "table",
    columns: [
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "session_type", label: "\u0646\u0648\u0639 \u0627\u0644\u062C\u0644\u0633\u0629" },
      { key: "day", label: "\u0627\u0644\u064A\u0648\u0645" },
      { key: "time", label: "\u0627\u0644\u0648\u0642\u062A" },
      { key: "room", label: "\u0627\u0644\u0642\u0627\u0639\u0629" },
      { key: "instructor", label: "\u0627\u0644\u0645\u062D\u0627\u0636\u0631" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645" }
    ],
    data: COURSE_SCHEDULES,
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u062C\u0644\u0633\u0629 \u062C\u062F\u064A\u062F\u0629" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062C\u062F\u0648\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062C\u062F\u0648\u0644" }
    ]
  },
  "student_personal_schedules": {
    id: "student_personal_schedules",
    title: "\u0627\u0644\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
    description: `\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 (${STUDENT_SCHEDULES.length} \u062C\u062F\u0648\u0644 \u0634\u062E\u0635\u064A)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "session_type", label: "\u0646\u0648\u0639 \u0627\u0644\u062C\u0644\u0633\u0629" },
      { key: "day", label: "\u0627\u0644\u064A\u0648\u0645" },
      { key: "time", label: "\u0627\u0644\u0648\u0642\u062A" },
      { key: "room", label: "\u0627\u0644\u0642\u0627\u0639\u0629" },
      { key: "instructor", label: "\u0627\u0644\u0645\u062D\u0627\u0636\u0631" }
    ],
    data: STUDENT_SCHEDULES.slice(0, 1e3),
    // Show first 1000 for performance
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0634\u062E\u0635\u064A" }
    ]
  },
  "room_utilization": {
    id: "room_utilization",
    title: "\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0642\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0642\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0648\u0627\u0644\u0645\u0639\u0627\u0645\u0644",
    type: "table",
    columns: [
      { key: "room", label: "\u0627\u0644\u0642\u0627\u0639\u0629" },
      { key: "total_sessions", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062C\u0644\u0633\u0627\u062A" },
      { key: "utilization_rate", label: "\u0645\u0639\u062F\u0644 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645" },
      { key: "peak_day", label: "\u0623\u0643\u062B\u0631 \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0627\u064B" },
      { key: "peak_time", label: "\u0623\u0643\u062B\u0631 \u0627\u0644\u0623\u0648\u0642\u0627\u062A \u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0627\u064B" }
    ],
    data: (() => {
      const roomStats = [];
      const rooms = [...new Set(COURSE_SCHEDULES.map((s) => s.room))];
      rooms.forEach((room) => {
        const roomSessions = COURSE_SCHEDULES.filter((s) => s.room === room);
        const totalSlots = 5 * 5;
        const utilizationRate = (roomSessions.length / totalSlots * 100).toFixed(1) + "%";
        const dayCount = {};
        roomSessions.forEach((s) => {
          dayCount[s.day] = (dayCount[s.day] || 0) + 1;
        });
        const peakDay = Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, "");
        const timeCount = {};
        roomSessions.forEach((s) => {
          timeCount[s.time] = (timeCount[s.time] || 0) + 1;
        });
        const peakTime = Object.keys(timeCount).reduce((a, b) => timeCount[a] > timeCount[b] ? a : b, "");
        roomStats.push({
          room,
          total_sessions: roomSessions.length,
          utilization_rate: utilizationRate,
          peak_day: peakDay,
          peak_time: peakTime
        });
      });
      return roomStats.sort((a, b) => b.total_sessions - a.total_sessions);
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631" }
    ]
  },
  "instructor_workload": {
    id: "instructor_workload",
    title: "\u0623\u0639\u0628\u0627\u0621 \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u064A\u0646 \u0627\u0644\u062A\u062F\u0631\u064A\u0633\u064A\u0629",
    description: "\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0623\u0639\u0628\u0627\u0621 \u0627\u0644\u062A\u062F\u0631\u064A\u0633\u064A\u0629 \u0639\u0644\u0649 \u0623\u0639\u0636\u0627\u0621 \u0647\u064A\u0626\u0629 \u0627\u0644\u062A\u062F\u0631\u064A\u0633",
    type: "table",
    columns: [
      { key: "instructor", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u062D\u0627\u0636\u0631" },
      { key: "total_courses", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "total_sessions", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062C\u0644\u0633\u0627\u062A" },
      { key: "teaching_hours", label: "\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u062A\u062F\u0631\u064A\u0633 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A\u0629" },
      { key: "departments", label: "\u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0645\u064F\u062F\u0631\u064E\u0651\u0633\u0629" }
    ],
    data: (() => {
      const instructorStats = [];
      const instructors = [...new Set(COURSE_SCHEDULES.map((s) => s.instructor))];
      instructors.forEach((instructor) => {
        const instructorSessions = COURSE_SCHEDULES.filter((s) => s.instructor === instructor);
        const courses = [...new Set(instructorSessions.map((s) => s.course_id))];
        const departments = [...new Set(instructorSessions.map((s) => s.department))];
        const teachingHours = instructorSessions.length * 2;
        instructorStats.push({
          instructor,
          total_courses: courses.length,
          total_sessions: instructorSessions.length,
          teaching_hours: teachingHours,
          departments: departments.join(", ")
        });
      });
      return instructorStats.sort((a, b) => b.teaching_hours - a.teaching_hours);
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631" }
    ]
  },
  // ==================================================================================
  // RELATED DATA VIEWS - STUDENT ENROLLMENTS & GRADES
  // ==================================================================================
  "student_course_enrollments": {
    id: "student_course_enrollments",
    title: "\u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    description: `\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 (${STUDENT_ENROLLMENTS.length} \u062A\u0633\u062C\u064A\u0644)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644", type: "status" }
    ],
    data: STUDENT_ENROLLMENTS,
    actions: [
      { type: "add", label: "\u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628 \u0641\u064A \u0645\u0642\u0631\u0631" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  // ==================================================================================
  // ANALYTICAL REPORTS BASED ON RELATIONS
  // ==================================================================================
  "student_performance_analysis": {
    id: "student_performance_analysis",
    title: "\u062A\u062D\u0644\u064A\u0644 \u0623\u062F\u0627\u0621 \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u062A\u062D\u0644\u064A\u0644 \u0634\u0627\u0645\u0644 \u0644\u0623\u062F\u0627\u0621 \u0627\u0644\u0637\u0644\u0627\u0628 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u062F\u0631\u062C\u0627\u062A \u0648\u0627\u0644\u062D\u0636\u0648\u0631",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "enrolled_courses", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629" },
      { key: "completed_courses", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0645\u0644\u0629" },
      { key: "average_grade", label: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u062F\u0631\u062C\u0627\u062A" },
      { key: "attendance_rate", label: "\u0645\u0639\u062F\u0644 \u0627\u0644\u062D\u0636\u0648\u0631" },
      { key: "financial_status", label: "\u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629", type: "status" }
    ],
    data: (() => {
      return ALL_STUDENTS.slice(0, 100).map((student) => {
        const enrollments = STUDENT_ENROLLMENTS.filter((e) => e.student_id === student.student_id);
        const grades = STUDENT_GRADES.filter((g) => g.student_id === student.student_id);
        const attendance = ATTENDANCE_RECORDS.filter((a) => a.student_id === student.student_id);
        const financials = FINANCIAL_RECORDS.filter((f) => f.student_id === student.student_id);
        const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade_points, 0) / grades.length).toFixed(2) : "N/A";
        const attendanceRate = attendance.length > 0 ? (attendance.filter((a) => a.status === "\u062D\u0627\u0636\u0631").length / attendance.length * 100).toFixed(1) + "%" : "N/A";
        const totalDue = financials.reduce((sum, f) => sum + f.amount, 0);
        const totalPaid = financials.reduce((sum, f) => sum + f.paid_amount, 0);
        const financialStatus = totalPaid >= totalDue ? "\u0645\u0633\u062F\u062F \u0628\u0627\u0644\u0643\u0627\u0645\u0644" : "\u0645\u0633\u062A\u062D\u0642\u0627\u062A \u0645\u062A\u0628\u0642\u064A\u0629";
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
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0623\u062F\u0627\u0621" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631" }
    ]
  },
  "course_enrollment_statistics": {
    id: "course_enrollment_statistics",
    title: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    description: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0645\u0641\u0635\u0644\u0629 \u0639\u0646 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    type: "table",
    columns: [
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "total_enrolled", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646" },
      { key: "active_students", label: "\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0646\u0634\u0637\u064A\u0646" },
      { key: "withdrawn_students", label: "\u0627\u0644\u0645\u0646\u0633\u062D\u0628\u064A\u0646" },
      { key: "average_attendance", label: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u062D\u0636\u0648\u0631" },
      { key: "pass_rate", label: "\u0645\u0639\u062F\u0644 \u0627\u0644\u0646\u062C\u0627\u062D" }
    ],
    data: (() => {
      return COURSES_DATABASE.map((course) => {
        const enrollments = STUDENT_ENROLLMENTS.filter((e) => e.course_id === course.id);
        const activeEnrollments = enrollments.filter((e) => e.status === "\u0645\u0633\u062C\u0644");
        const withdrawnEnrollments = enrollments.filter((e) => e.status === "\u0645\u0646\u0633\u062D\u0628");
        const courseGrades = STUDENT_GRADES.filter((g) => g.course_id === course.id);
        const courseAttendance = ATTENDANCE_RECORDS.filter((a) => a.course_id === course.id);
        const avgAttendance = courseAttendance.length > 0 ? (courseAttendance.filter((a) => a.status === "\u062D\u0627\u0636\u0631").length / courseAttendance.length * 100).toFixed(1) + "%" : "N/A";
        const passRate = courseGrades.length > 0 ? (courseGrades.filter((g) => g.grade_points >= 2).length / courseGrades.length * 100).toFixed(1) + "%" : "N/A";
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
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 \u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631" }
    ]
  },
  "database_relations_overview": {
    id: "database_relations_overview",
    title: "\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0639\u0644\u0627\u0642\u0627\u062A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",
    description: "\u0639\u0631\u0636 \u0634\u0627\u0645\u0644 \u0644\u0644\u0639\u0644\u0627\u0642\u0627\u062A \u0648\u0627\u0644\u0631\u0648\u0627\u0628\u0637 \u0628\u064A\u0646 \u062C\u0645\u064A\u0639 \u062C\u062F\u0627\u0648\u0644 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",
    type: "table",
    columns: [
      { key: "table_name", label: "\u0627\u0633\u0645 \u0627\u0644\u062C\u062F\u0648\u0644" },
      { key: "record_count", label: "\u0639\u062F\u062F \u0627\u0644\u0633\u062C\u0644\u0627\u062A" },
      { key: "related_tables", label: "\u0627\u0644\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629" },
      { key: "primary_key", label: "\u0627\u0644\u0645\u0641\u062A\u0627\u062D \u0627\u0644\u0623\u0633\u0627\u0633\u064A" },
      { key: "foreign_keys", label: "\u0627\u0644\u0645\u0641\u0627\u062A\u064A\u062D \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629" }
    ],
    data: [
      {
        table_name: "\u0627\u0644\u0637\u0644\u0627\u0628 (Students)",
        record_count: ALL_STUDENTS.length,
        related_tables: "\u0627\u0644\u062A\u0633\u062C\u064A\u0644\u0627\u062A\u060C \u0627\u0644\u062F\u0631\u062C\u0627\u062A\u060C \u0627\u0644\u062D\u0636\u0648\u0631\u060C \u0627\u0644\u0645\u0627\u0644\u064A\u0629",
        primary_key: "student_id",
        foreign_keys: "faculty_code"
      },
      {
        table_name: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A (Courses)",
        record_count: COURSES_DATABASE.length,
        related_tables: "\u0627\u0644\u062A\u0633\u062C\u064A\u0644\u0627\u062A\u060C \u0627\u0644\u062F\u0631\u062C\u0627\u062A\u060C \u0627\u0644\u062C\u062F\u0627\u0648\u0644\u060C \u0627\u0644\u062D\u0636\u0648\u0631",
        primary_key: "course_id",
        foreign_keys: "department"
      },
      {
        table_name: "\u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A (Enrollments)",
        record_count: STUDENT_ENROLLMENTS.length,
        related_tables: "\u0627\u0644\u0637\u0644\u0627\u0628\u060C \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A\u060C \u0627\u0644\u062F\u0631\u062C\u0627\u062A\u060C \u0627\u0644\u062D\u0636\u0648\u0631",
        primary_key: "student_id + course_id",
        foreign_keys: "student_id, course_id"
      },
      {
        table_name: "\u0627\u0644\u062F\u0631\u062C\u0627\u062A (Grades)",
        record_count: STUDENT_GRADES.length,
        related_tables: "\u0627\u0644\u0637\u0644\u0627\u0628\u060C \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A\u060C \u0627\u0644\u062A\u0633\u062C\u064A\u0644\u0627\u062A",
        primary_key: "student_id + course_id + semester",
        foreign_keys: "student_id, course_id"
      },
      {
        table_name: "\u0627\u0644\u062D\u0636\u0648\u0631 (Attendance)",
        record_count: ATTENDANCE_RECORDS.length,
        related_tables: "\u0627\u0644\u0637\u0644\u0627\u0628\u060C \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A\u060C \u0627\u0644\u062A\u0633\u062C\u064A\u0644\u0627\u062A",
        primary_key: "student_id + course_id + date",
        foreign_keys: "student_id, course_id"
      },
      {
        table_name: "\u0627\u0644\u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0645\u0627\u0644\u064A\u0629 (Financial)",
        record_count: FINANCIAL_RECORDS.length,
        related_tables: "\u0627\u0644\u0637\u0644\u0627\u0628",
        primary_key: "student_id + type + description",
        foreign_keys: "student_id"
      },
      {
        table_name: "\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A (Schedules)",
        record_count: COURSE_SCHEDULES.length,
        related_tables: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A\u060C \u0627\u0644\u062A\u0633\u062C\u064A\u0644\u0627\u062A",
        primary_key: "course_id + session_type + day + time",
        foreign_keys: "course_id"
      }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 \u0645\u062E\u0637\u0637 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631" }
    ]
  },
  "student_complete_profile": {
    id: "student_complete_profile",
    title: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u0627\u0645\u0644 \u0644\u0644\u0637\u0627\u0644\u0628",
    description: "\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0646 \u0643\u0627\u0641\u0629 \u0627\u0644\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "enrolled_courses_count", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629" },
      { key: "completed_courses_count", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0645\u0644\u0629" },
      { key: "attendance_sessions", label: "\u062C\u0644\u0633\u0627\u062A \u0627\u0644\u062D\u0636\u0648\u0631" },
      { key: "financial_transactions", label: "\u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062A \u0627\u0644\u0645\u0627\u0644\u064A\u0629" },
      { key: "avg_grade", label: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u062F\u0631\u062C\u0627\u062A" },
      { key: "attendance_rate", label: "\u0645\u0639\u062F\u0644 \u0627\u0644\u062D\u0636\u0648\u0631" },
      { key: "total_fees", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0631\u0633\u0648\u0645", type: "currency" },
      { key: "paid_amount", label: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639", type: "currency" }
    ],
    data: (() => {
      return ALL_STUDENTS.slice(0, 50).map((student) => {
        const enrollments = STUDENT_ENROLLMENTS.filter((e) => e.student_id === student.student_id);
        const grades = STUDENT_GRADES.filter((g) => g.student_id === student.student_id);
        const attendance = ATTENDANCE_RECORDS.filter((a) => a.student_id === student.student_id);
        const financials = FINANCIAL_RECORDS.filter((f) => f.student_id === student.student_id);
        const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade_points, 0) / grades.length).toFixed(2) : "0.00";
        const attendanceRate = attendance.length > 0 ? (attendance.filter((a) => a.status === "\u062D\u0627\u0636\u0631").length / attendance.length * 100).toFixed(1) : "0.0";
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
          attendance_rate: attendanceRate + "%",
          total_fees: totalFees,
          paid_amount: paidAmount
        };
      });
    })(),
    actions: [
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0634\u0627\u0645\u0644\u0629" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // ==================================================================================
  // SHARED FEATURE: REGISTRATION ISSUES (مشاكل التسجيل)
  // ==================================================================================
  // 1. Student View: Submit Request
  "reg_form_issue": {
    id: "reg_form_issue",
    title: "\u0627\u0633\u062A\u0645\u0627\u0631\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 (\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062A\u0639\u062B\u0631)",
    description: "\u0631\u0641\u0639 \u0627\u0633\u062A\u0645\u0627\u0631\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u064A\u062F\u0648\u064A\u0629 \u0641\u064A \u062D\u0627\u0644\u0629 \u0648\u062C\u0648\u062F \u0645\u0634\u0627\u0643\u0644 \u062A\u0642\u0646\u064A\u0629 \u0623\u0648 \u062A\u0639\u062B\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A",
    type: "request_form",
    columns: [
      { key: "req_id", label: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628" },
      { key: "date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0631\u0641\u0639", type: "date" },
      { key: "comment", label: "\u062A\u0639\u0644\u064A\u0642 \u0627\u0644\u0637\u0627\u0644\u0628", type: "long_text" },
      { key: "admin_response", label: "\u0631\u062F \u0627\u0644\u0625\u062F\u0627\u0631\u0629", type: "long_text" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628", type: "status" }
    ],
    data: [
      { req_id: "REQ-2024-001", date: "2024-09-30", comment: "\u0644\u0627 \u064A\u0645\u0643\u0646\u0646\u064A \u062A\u0633\u062C\u064A\u0644 \u0645\u0642\u0631\u0631 CS305 \u0628\u0633\u0628\u0628 \u0627\u0644\u0645\u062A\u0637\u0644\u0628 \u0627\u0644\u0633\u0627\u0628\u0642 \u0631\u063A\u0645 \u0646\u062C\u0627\u062D\u064A \u0641\u064A\u0647.", admin_response: "\u062C\u0627\u0631\u064A \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629.", status: "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629" }
    ],
    actions: [{ type: "upload", label: "\u0631\u0641\u0639 \u0627\u0633\u062A\u0645\u0627\u0631\u0629 \u062C\u062F\u064A\u062F\u0629" }]
  },
  // 2. Admin View: Manage Requests
  "manage_reg_issues": {
    id: "manage_reg_issues",
    title: "\u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 (\u0627\u0644\u062A\u0639\u062B\u0631)",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0633\u062A\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u064A\u062F\u0648\u064A\u0629 \u0648\u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u062A\u0639\u062B\u0631\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
    type: "table",
    columns: [
      { key: "req_id", label: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628" },
      { key: "student_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "student_id", label: "\u0627\u0644\u0643\u0648\u062F" },
      { key: "file", label: "\u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0631\u0629", type: "file" },
      { key: "comment", label: "\u0627\u0644\u0645\u0634\u0643\u0644\u0629" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: (() => {
      const problems = [
        "\u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0627\u0644\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0644\u0645\u0642\u0631\u0631 CS305",
        "\u062A\u062C\u0627\u0648\u0632\u062A \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u0645\u0648\u062D\u0629",
        "\u062A\u0639\u0627\u0631\u0636 \u0641\u064A \u0645\u0648\u0627\u0639\u064A\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
        "\u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A",
        "\u0637\u0644\u0628 \u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u0631\u0631 \u0628\u0639\u062F \u0627\u0646\u062A\u0647\u0627\u0621 \u0641\u062A\u0631\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644",
        "\u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
        "\u0637\u0644\u0628 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629",
        "\u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C"
      ];
      const statuses = ["\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", "\u0645\u0642\u0628\u0648\u0644", "\u0645\u0631\u0641\u0648\u0636"];
      const fileTypes = ["reg_form_2024.pdf", "scan_001.jpg", "form_scan.pdf", "request_form.pdf"];
      const requests = [];
      const selectedStudents = FCAI_STUDENTS.filter(() => Math.random() > 0.95).slice(0, 25);
      selectedStudents.forEach((student, idx) => {
        const statusRand = Math.random();
        let status = "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629";
        if (statusRand > 0.7) status = "\u0645\u0642\u0628\u0648\u0644";
        else if (statusRand > 0.85) status = "\u0645\u0631\u0641\u0648\u0636";
        requests.push({
          req_id: `REQ-2024-${String(idx + 1).padStart(3, "0")}`,
          student_name: student.name,
          student_id: student.student_id,
          file: fileTypes[Math.floor(Math.random() * fileTypes.length)],
          comment: problems[Math.floor(Math.random() * problems.length)],
          status
        });
      });
      return requests;
    })(),
    actions: [{ type: "approve", label: "\u0642\u0628\u0648\u0644 \u0648\u062A\u0641\u0639\u064A\u0644" }, { type: "reject", label: "\u0631\u0641\u0636 \u0627\u0644\u0637\u0644\u0628" }, { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0631\u0629" }]
  },
  // ==================================================================================
  // ACADEMIC REGISTRATION PAGES
  // ==================================================================================
  "academic_reg": {
    id: "academic_reg",
    title: "\u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0644\u0644\u0637\u0644\u0627\u0628",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0648\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "courses_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "total_hours", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644", type: "status" }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 50).map((student) => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        courses_count: Math.floor(Math.random() * 5) + 4,
        total_hours: Math.floor(Math.random() * 6) + 12,
        status: Math.random() > 0.2 ? "\u0645\u0633\u062C\u0644" : "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644"
      }));
    })(),
    actions: [
      { type: "add", label: "\u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644" },
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" }
    ]
  },
  "add_academic_reg": {
    id: "add_academic_reg",
    title: "\u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0644\u0644\u0637\u0644\u0627\u0628 - \u0625\u0636\u0627\u0641\u0629 \u062C\u062F\u064A\u062F",
    description: "\u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628 \u062C\u062F\u064A\u062F \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0645\u0639 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0630\u0643\u064A \u0645\u0646 \u0627\u0644\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629",
    type: "smart_form",
    columns: [
      {
        key: "student_id",
        label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628",
        type: "autocomplete",
        required: true,
        validation: {
          pattern: "^20[0-9]{6}$",
          message: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 8 \u0623\u0631\u0642\u0627\u0645 \u064A\u0628\u062F\u0623 \u0628\u0640 20"
        }
      },
      {
        key: "student_name",
        label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628",
        type: "readonly",
        auto_fill: true
      },
      {
        key: "level",
        label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649",
        type: "select",
        required: true,
        auto_fill: true
      },
      {
        key: "department",
        label: "\u0627\u0644\u0642\u0633\u0645",
        type: "readonly",
        auto_fill: true
      },
      {
        key: "regulation",
        label: "\u0627\u0644\u0644\u0627\u0626\u062D\u0629",
        type: "readonly",
        auto_fill: true
      },
      {
        key: "available_courses",
        label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629",
        type: "multi_select",
        required: true,
        dynamic: true
      },
      {
        key: "selected_courses",
        label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u062E\u062A\u0627\u0631\u0629",
        type: "course_list",
        readonly: true
      },
      {
        key: "total_hours",
        label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A",
        type: "calculated",
        readonly: true
      },
      {
        key: "registration_status",
        label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644",
        type: "select",
        required: true,
        options: ["\u0645\u0633\u062C\u0644", "\u0645\u0624\u062C\u0644", "\u0645\u0639\u0644\u0642"]
      }
    ],
    data: (() => {
      return [{
        // Student lookup data
        students_lookup: ALL_STUDENTS.map((student) => ({
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
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644": 6,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A": 6,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B": 5,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639": 4
          },
          max_courses_per_level: {
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644": 8,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A": 8,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B": 7,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639": 6
          },
          min_hours_per_semester: 12,
          max_hours_per_semester: 21,
          gpa_requirements: {
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A": 2,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B": 2.2,
            "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639": 2.5
          }
        },
        // Course prerequisites and dependencies
        course_prerequisites: {
          "CS201": ["CS101"],
          "CS202": ["CS101", "CS102"],
          "CS301": ["CS201", "CS202"],
          "CS302": ["CS201"],
          "IS201": ["IS101"],
          "IS301": ["IS201"],
          "AI301": ["CS201", "MATH201"]
        },
        // Department-specific course mappings
        department_courses: {
          "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 (CS)": COURSES_DATABASE.filter((c) => c.department === "CS" || c.department === "\u0639\u0627\u0645"),
          "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IS)": COURSES_DATABASE.filter((c) => c.department === "IS" || c.department === "\u0639\u0627\u0645"),
          "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A (AI)": COURSES_DATABASE.filter((c) => c.department === "AI" || c.department === "\u0639\u0627\u0645"),
          "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IT)": COURSES_DATABASE.filter((c) => c.department === "IT" || c.department === "\u0639\u0627\u0645"),
          "\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u064A\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 (MI)": COURSES_DATABASE.filter((c) => c.department === "MI" || c.department === "\u0639\u0627\u0645"),
          "\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A (SEC)": COURSES_DATABASE.filter((c) => c.department === "SEC" || c.department === "\u0639\u0627\u0645"),
          "\u0639\u0627\u0645": COURSES_DATABASE.filter((c) => c.department === "\u0639\u0627\u0645")
        },
        // Validation messages
        validation_messages: {
          student_not_found: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645",
          student_already_registered: "\u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0641\u0635\u0644",
          insufficient_gpa: "\u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A \u0644\u0644\u0637\u0627\u0644\u0628 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u0644\u0645\u0633\u062A\u0648\u0649",
          prerequisite_missing: "\u0627\u0644\u0637\u0627\u0644\u0628 \u0644\u0645 \u064A\u062C\u062A\u0632 \u0627\u0644\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0642\u0631\u0631",
          max_hours_exceeded: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A \u064A\u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0627\u0644\u0645\u0633\u0645\u0648\u062D",
          min_hours_not_met: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0627\u0644\u0645\u0637\u0644\u0648\u0628",
          course_conflict: "\u064A\u0648\u062C\u062F \u062A\u0639\u0627\u0631\u0636 \u0641\u064A \u0645\u0648\u0627\u0639\u064A\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u062E\u062A\u0627\u0631\u0629",
          level_mismatch: "\u0627\u0644\u0645\u0642\u0631\u0631 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0648\u0649",
          department_restriction: "\u0627\u0644\u0645\u0642\u0631\u0631 \u0645\u062E\u0635\u0635 \u0644\u0642\u0633\u0645 \u0622\u062E\u0631"
        },
        // Form instructions
        instructions: {
          title: "\u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A",
          steps: [
            "\u0623\u062F\u062E\u0644 \u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628 \u0644\u0644\u0628\u062D\u062B \u0639\u0646 \u0628\u064A\u0627\u0646\u0627\u062A\u0647",
            "\u062A\u0623\u0643\u062F \u0645\u0646 \u0635\u062D\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629",
            "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u0645\u0633\u062A\u0648\u0649 \u0648\u0627\u0644\u0642\u0633\u0645",
            "\u0631\u0627\u062C\u0639 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0648\u0627\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u0639\u062F\u0645 \u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062D\u062F\u0648\u062F",
            "\u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u0633\u062A\u064A\u0641\u0627\u0621 \u0627\u0644\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0644\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
            "\u0627\u062D\u0641\u0638 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0628\u0639\u062F \u0627\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u0635\u062D\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"
          ],
          warnings: [
            "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628 \u0641\u064A \u0645\u0642\u0631\u0631 \u0644\u0645 \u064A\u062C\u062A\u0632 \u0645\u062A\u0637\u0644\u0628\u0627\u062A\u0647 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
            "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0633\u0627\u0639\u0627\u062A 12 \u0633\u0627\u0639\u0629 \u0648\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 21 \u0633\u0627\u0639\u0629",
            "\u064A\u062C\u0628 \u0627\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u0639\u062F\u0645 \u0648\u062C\u0648\u062F \u062A\u0639\u0627\u0631\u0636 \u0641\u064A \u0645\u0648\u0627\u0639\u064A\u062F \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u0627\u062A",
            "\u0627\u0644\u0637\u0644\u0627\u0628 \u0630\u0648\u0648 \u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u0645\u0646\u062E\u0641\u0636 \u0642\u062F \u064A\u062D\u062A\u0627\u062C\u0648\u0646 \u0645\u0648\u0627\u0641\u0642\u0629 \u062E\u0627\u0635\u0629"
          ]
        }
      }];
    })(),
    actions: [
      { type: "save", label: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0633\u062C\u064A\u0644", primary: true },
      { type: "validate", label: "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0642\u0648\u0627\u0639\u062F" },
      { type: "preview", label: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644" },
      { type: "cancel", label: "\u0625\u0644\u063A\u0627\u0621" }
    ]
  },
  "block_student_reg": {
    id: "block_student_reg",
    title: "\u062D\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628",
    description: "\u062D\u062C\u0628 \u0623\u0648 \u0625\u0644\u063A\u0627\u0621 \u062D\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "reason", label: "\u0633\u0628\u0628 \u0627\u0644\u062D\u062C\u0628" },
      { key: "block_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062D\u062C\u0628", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { student_id: "20210001", name: "\u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F \u0639\u0644\u064A", reason: "\u0639\u062F\u0645 \u0633\u062F\u0627\u062F \u0627\u0644\u0631\u0633\u0648\u0645", block_date: "2024-09-15", status: "\u0645\u062D\u062C\u0648\u0628" },
      { student_id: "20210025", name: "\u0633\u0627\u0631\u0629 \u0645\u062D\u0645\u0648\u062F \u062D\u0633\u0646", reason: "\u0645\u0634\u0643\u0644\u0629 \u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629", block_date: "2024-09-20", status: "\u0645\u062D\u062C\u0648\u0628" },
      { student_id: "20210050", name: "\u062E\u0627\u0644\u062F \u064A\u0648\u0633\u0641 \u0633\u0639\u064A\u062F", reason: "\u0639\u062F\u0645 \u0627\u0633\u062A\u0643\u0645\u0627\u0644 \u0627\u0644\u0645\u0633\u062A\u0646\u062F\u0627\u062A", block_date: "2024-09-18", status: "\u0645\u062D\u062C\u0648\u0628" }
    ],
    actions: [
      { type: "add", label: "\u062D\u062C\u0628 \u062A\u0633\u062C\u064A\u0644" },
      { type: "edit", label: "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062D\u062C\u0628" }
    ]
  },
  "balance_reg": {
    id: "balance_reg",
    title: "\u062A\u0633\u062C\u064A\u0644 \u0645\u0648\u0627\u0632\u0646\u0629",
    description: "\u0625\u062F\u0627\u0631\u0629 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0638\u0631\u0629 (\u0627\u0644\u0645\u0648\u0627\u0632\u0646\u0629)",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "original_course", label: "\u0627\u0644\u0645\u0642\u0631\u0631 \u0627\u0644\u0623\u0635\u0644\u064A" },
      { key: "equivalent_course", label: "\u0627\u0644\u0645\u0642\u0631\u0631 \u0627\u0644\u0645\u0646\u0627\u0638\u0631" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { student_id: "20210010", name: "\u0645\u062D\u0645\u062F \u0623\u062D\u0645\u062F \u062D\u0633\u0646", original_course: "CS101", equivalent_course: "IS101", status: "\u0645\u0639\u062A\u0645\u062F" },
      { student_id: "20210030", name: "\u0645\u0646\u0649 \u0633\u0639\u064A\u062F \u0645\u062D\u0645\u0648\u062F", original_course: "CS201", equivalent_course: "IS201", status: "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629" },
      { student_id: "20210045", name: "\u064A\u0648\u0633\u0641 \u062E\u0627\u0644\u062F \u0639\u0644\u064A", original_course: "CS301", equivalent_course: "IS301", status: "\u0645\u0639\u062A\u0645\u062F" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0627\u0632\u0646\u0629" },
      { type: "approve", label: "\u0627\u0639\u062A\u0645\u0627\u062F" },
      { type: "reject", label: "\u0631\u0641\u0636" }
    ]
  },
  "modify_student_courses": {
    id: "modify_student_courses",
    title: "\u062A\u0639\u062F\u064A\u0644 \u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u062A\u0639\u062F\u064A\u0644 \u0623\u0648 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "old_course", label: "\u0627\u0644\u0645\u0642\u0631\u0631 \u0627\u0644\u0642\u062F\u064A\u0645" },
      { key: "new_course", label: "\u0627\u0644\u0645\u0642\u0631\u0631 \u0627\u0644\u062C\u062F\u064A\u062F" },
      { key: "reason", label: "\u0633\u0628\u0628 \u0627\u0644\u062A\u0639\u062F\u064A\u0644" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { student_id: "20210015", name: "\u0646\u0648\u0631\u0627 \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u0648\u062F", old_course: "CS302", new_course: "CS303", reason: "\u062A\u0639\u0627\u0631\u0636 \u0641\u064A \u0627\u0644\u0645\u0648\u0627\u0639\u064A\u062F", status: "\u0645\u0642\u0628\u0648\u0644" },
      { student_id: "20210035", name: "\u0637\u0627\u0631\u0642 \u0633\u0639\u064A\u062F \u064A\u0648\u0633\u0641", old_course: "IS301", new_course: "IS302", reason: "\u0637\u0644\u0628 \u0627\u0644\u0637\u0627\u0644\u0628", status: "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629" }
    ],
    actions: [
      { type: "add", label: "\u0637\u0644\u0628 \u062A\u0639\u062F\u064A\u0644" },
      { type: "approve", label: "\u0642\u0628\u0648\u0644" },
      { type: "reject", label: "\u0631\u0641\u0636" }
    ]
  },
  "block_reg_by_renewal": {
    id: "block_reg_by_renewal",
    title: "\u062D\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0637\u0644\u0627\u0628 \u062A\u0628\u0639\u0627 \u0644\u0645\u0648\u0642\u0641 \u0627\u0644\u062A\u062C\u062F\u064A\u062F",
    description: "\u062D\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u062D\u0627\u0644\u0629 \u062A\u062C\u062F\u064A\u062F \u0627\u0644\u0642\u064A\u062F",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "renewal_status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u062C\u062F\u064A\u062F" },
      { key: "block_reason", label: "\u0633\u0628\u0628 \u0627\u0644\u062D\u062C\u0628" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { student_id: "20200050", name: "\u0639\u0644\u064A \u0645\u062D\u0645\u0648\u062F \u062D\u0633\u0646", renewal_status: "\u063A\u064A\u0631 \u0645\u062C\u062F\u062F", block_reason: "\u0639\u062F\u0645 \u062A\u062C\u062F\u064A\u062F \u0627\u0644\u0642\u064A\u062F", status: "\u0645\u062D\u062C\u0648\u0628" },
      { student_id: "20200075", name: "\u0641\u0627\u0637\u0645\u0629 \u0623\u062D\u0645\u062F \u0633\u0639\u064A\u062F", renewal_status: "\u0645\u0646\u062A\u0647\u064A", block_reason: "\u0627\u0646\u062A\u0647\u0627\u0621 \u0641\u062A\u0631\u0629 \u0627\u0644\u062A\u062C\u062F\u064A\u062F", status: "\u0645\u062D\u062C\u0648\u0628" }
    ],
    actions: [
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" }
    ]
  },
  "registered_students_report": {
    id: "registered_students_report",
    title: "\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0637\u0644\u0628\u0629 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646",
    description: "\u062A\u0642\u0631\u064A\u0631 \u0634\u0627\u0645\u0644 \u0628\u062C\u0645\u064A\u0639 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "courses", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629" },
      { key: "total_hours", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A" }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 30).map((student) => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        courses: `${Math.floor(Math.random() * 3) + 4} \u0645\u0642\u0631\u0631\u0627\u062A`,
        total_hours: `${Math.floor(Math.random() * 6) + 12} \u0633\u0627\u0639\u0629`
      }));
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "course_student_count": {
    id: "course_student_count",
    title: "\u062A\u0642\u0631\u064A\u0631 \u0627\u0639\u062F\u0627\u062F \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0645\u0642\u0631\u0631",
    description: "\u0639\u0631\u0636 \u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0643\u0644 \u0645\u0642\u0631\u0631 \u062F\u0631\u0627\u0633\u064A",
    type: "table",
    columns: [
      { key: "course_code", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "registered_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646" },
      { key: "capacity", label: "\u0627\u0644\u0633\u0639\u0629" },
      { key: "available", label: "\u0627\u0644\u0645\u062A\u0627\u062D" }
    ],
    data: [
      { course_code: "CS101", course_name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0628\u0631\u0645\u062C\u0629", registered_count: 85, capacity: 100, available: 15 },
      { course_code: "CS201", course_name: "\u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", registered_count: 72, capacity: 80, available: 8 },
      { course_code: "CS301", course_name: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", registered_count: 65, capacity: 70, available: 5 },
      { course_code: "IS301", course_name: "\u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0646\u0638\u0645", registered_count: 58, capacity: 60, available: 2 }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "registered_students_stats": {
    id: "registered_students_stats",
    title: "\u0625\u062D\u0635\u0627\u0626\u064A\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646",
    description: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0634\u0627\u0645\u0644\u0629 \u0639\u0646 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646",
    type: "dashboard",
    columns: [],
    data: [],
    actions: []
  },
  "registered_by_levels": {
    id: "registered_by_levels",
    title: "\u0627\u062D\u0635\u0627\u0626\u064A\u0629 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A",
    description: "\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u062D\u0633\u0628 \u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    type: "table",
    columns: [
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "total_students", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0627\u0628" },
      { key: "registered", label: "\u0645\u0633\u062C\u0644\u064A\u0646" },
      { key: "not_registered", label: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644\u064A\u0646" },
      { key: "percentage", label: "\u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644" }
    ],
    data: [
      { level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644", total_students: 750, registered: 720, not_registered: 30, percentage: "96%" },
      { level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A", total_students: 700, registered: 680, not_registered: 20, percentage: "97%" },
      { level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B", total_students: 650, registered: 620, not_registered: 30, percentage: "95%" },
      { level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639", total_students: 400, registered: 380, not_registered: 20, percentage: "95%" }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "registered_students_chart": {
    id: "registered_students_chart",
    title: "\u0625\u062D\u0635\u0627\u0626\u064A\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 (\u0631\u0633\u0645 \u0628\u064A\u0627\u0646\u064A)",
    description: "\u0639\u0631\u0636 \u0628\u064A\u0627\u0646\u064A \u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646",
    type: "dashboard",
    columns: [],
    data: [],
    actions: []
  },
  "students_in_course": {
    id: "students_in_course",
    title: "\u062A\u0642\u0631\u064A\u0631 \u0637\u0644\u0627\u0628 \u0645\u0633\u062C\u0644\u064A\u0646 \u0628\u0645\u0642\u0631\u0631",
    description: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0645\u0642\u0631\u0631 \u062F\u0631\u0627\u0633\u064A \u0645\u062D\u062F\u062F",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "group", label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629" },
      { key: "registration_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0633\u062C\u064A\u0644", type: "date" }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 25).map((student) => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        group: `\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`,
        registration_date: "2024-09-15"
      }));
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "unregistered_students": {
    id: "unregistered_students",
    title: "\u0627\u0644\u0637\u0644\u0627\u0628 \u063A\u064A\u0631 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646",
    description: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0630\u064A\u0646 \u0644\u0645 \u064A\u0633\u062C\u0644\u0648\u0627 \u0641\u064A \u0623\u064A \u0645\u0642\u0631\u0631",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "reason", label: "\u0627\u0644\u0633\u0628\u0628" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { student_id: "20210005", name: "\u0623\u062D\u0645\u062F \u0645\u062D\u0645\u0648\u062F \u0639\u0644\u064A", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644", reason: "\u0639\u062F\u0645 \u0633\u062F\u0627\u062F \u0627\u0644\u0631\u0633\u0648\u0645", status: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644" },
      { student_id: "20210020", name: "\u0633\u0627\u0631\u0629 \u064A\u0648\u0633\u0641 \u062D\u0633\u0646", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A", reason: "\u0645\u0634\u0643\u0644\u0629 \u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629", status: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644" },
      { student_id: "20210040", name: "\u062E\u0627\u0644\u062F \u0633\u0639\u064A\u062F \u0645\u062D\u0645\u0648\u062F", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B", reason: "\u0639\u062F\u0645 \u0627\u0633\u062A\u0643\u0645\u0627\u0644 \u0627\u0644\u0645\u0633\u062A\u0646\u062F\u0627\u062A", status: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644" }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "students_by_gpa": {
    id: "students_by_gpa",
    title: "\u0627\u062D\u0635\u0627\u0626\u064A\u0629 \u0637\u0644\u0627\u0628 \u0628\u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A",
    description: "\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0637\u0644\u0627\u0628 \u062D\u0633\u0628 \u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A",
    type: "table",
    columns: [
      { key: "gpa_range", label: "\u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u0639\u062F\u0644" },
      { key: "student_count", label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628" },
      { key: "percentage", label: "\u0627\u0644\u0646\u0633\u0628\u0629" }
    ],
    data: [
      { gpa_range: "3.5 - 4.0", student_count: 150, percentage: "15%" },
      { gpa_range: "3.0 - 3.5", student_count: 300, percentage: "30%" },
      { gpa_range: "2.5 - 3.0", student_count: 350, percentage: "35%" },
      { gpa_range: "2.0 - 2.5", student_count: 150, percentage: "15%" },
      { gpa_range: "\u0623\u0642\u0644 \u0645\u0646 2.0", student_count: 50, percentage: "5%" }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "registered_courses_for_students": {
    id: "registered_courses_for_students",
    title: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
    description: "\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0644\u0643\u0644 \u0637\u0627\u0644\u0628",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "courses", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "total_hours", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A" }
    ],
    data: (() => {
      const courses = ["CS101", "CS102", "CS201", "CS202", "CS301", "CS302"];
      return FCAI_STUDENTS.slice(0, 20).map((student) => ({
        student_id: student.student_id,
        name: student.name,
        courses: courses.slice(0, Math.floor(Math.random() * 3) + 4).join(", "),
        total_hours: Math.floor(Math.random() * 6) + 12
      }));
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "student_reg_form": {
    id: "student_reg_form",
    title: "\u0627\u0633\u062A\u0645\u0627\u0631\u0629 \u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628",
    description: "\u0627\u0633\u062A\u0645\u0627\u0631\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0644\u0644\u0637\u0627\u0644\u0628",
    type: "form",
    columns: [],
    data: [],
    actions: [
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0631\u0629" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 PDF" }
    ]
  },
  "multiple_courses_reg": {
    id: "multiple_courses_reg",
    title: "\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 \u0645\u0642\u0631\u0631",
    description: "\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 \u0645\u0642\u0631\u0631 \u062F\u0631\u0627\u0633\u064A",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "courses_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "total_hours", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { student_id: "20210012", name: "\u0645\u062D\u0645\u062F \u0623\u062D\u0645\u062F \u062D\u0633\u0646", courses_count: 6, total_hours: 18, status: "\u0646\u0634\u0637" },
      { student_id: "20210028", name: "\u0645\u0646\u0649 \u0633\u0639\u064A\u062F \u0645\u062D\u0645\u0648\u062F", courses_count: 7, total_hours: 21, status: "\u0646\u0634\u0637" },
      { student_id: "20210035", name: "\u064A\u0648\u0633\u0641 \u062E\u0627\u0644\u062F \u0639\u0644\u064A", courses_count: 5, total_hours: 15, status: "\u0646\u0634\u0637" }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "review_student_reg": {
    id: "review_student_reg",
    title: "\u0645\u0631\u0627\u062C\u0639\u0629 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u0645\u0631\u0627\u062C\u0639\u0629 \u0648\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "courses", label: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "review_status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", type: "status" }
    ],
    data: (() => {
      return FCAI_STUDENTS.slice(0, 15).map((student) => ({
        student_id: student.student_id,
        name: student.name,
        level: student.level,
        courses: `${Math.floor(Math.random() * 3) + 4} \u0645\u0642\u0631\u0631\u0627\u062A`,
        review_status: Math.random() > 0.3 ? "\u062A\u0645\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629" : "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"
      }));
    })(),
    actions: [
      { type: "view", label: "\u0645\u0631\u0627\u062C\u0639\u0629" },
      { type: "approve", label: "\u0627\u0639\u062A\u0645\u0627\u062F" }
    ]
  },
  "registered_courses_count": {
    id: "registered_courses_count",
    title: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629",
    description: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0639\u0646 \u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
    type: "table",
    columns: [
      { key: "courses_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "student_count", label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628" },
      { key: "percentage", label: "\u0627\u0644\u0646\u0633\u0628\u0629" }
    ],
    data: [
      { courses_count: "4 \u0645\u0642\u0631\u0631\u0627\u062A", student_count: 400, percentage: "40%" },
      { courses_count: "5 \u0645\u0642\u0631\u0631\u0627\u062A", student_count: 350, percentage: "35%" },
      { courses_count: "6 \u0645\u0642\u0631\u0631\u0627\u062A", student_count: 200, percentage: "20%" },
      { courses_count: "7 \u0645\u0642\u0631\u0631\u0627\u062A", student_count: 50, percentage: "5%" }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // ==================================================================================
  // STUDENT PORTAL PAGES
  // ==================================================================================
  "id_card_view": {
    id: "id_card_view",
    title: "\u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062C\u0627\u0645\u0639\u064A\u0629",
    description: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062C\u0627\u0645\u0639\u064A\u0629 \u0648\u062D\u0627\u0644\u062A\u0647\u0627",
    type: "table",
    columns: [
      { key: "card_year", label: "\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u062C\u0627\u0645\u0639\u064A" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0628\u0637\u0627\u0642\u0629", type: "status" },
      { key: "delivery", label: "\u0645\u0643\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645" }
    ],
    data: [
      { card_year: "2024-2025", status: "\u062C\u0627\u0647\u0632 \u0644\u0644\u0627\u0633\u062A\u0644\u0627\u0645", delivery: "\u0634\u0624\u0648\u0646 \u0627\u0644\u0637\u0644\u0627\u0628 - \u0634\u0628\u0627\u0643 4" }
    ]
  },
  "military_edu": {
    id: "military_edu",
    title: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0639\u0633\u0643\u0631\u064A\u0629",
    description: "\u0645\u0648\u0642\u0641 \u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0646 \u062F\u0648\u0631\u0629 \u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0639\u0633\u0643\u0631\u064A\u0629",
    type: "table",
    columns: [
      { key: "cycle", label: "\u0627\u0644\u062F\u0648\u0631\u0629" },
      { key: "date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u0639\u0642\u0627\u062F", type: "date" },
      { key: "result", label: "\u0627\u0644\u0646\u062A\u064A\u062C\u0629", type: "status" }
    ],
    data: [
      { cycle: "\u062F\u0648\u0631\u0629 \u064A\u0648\u0644\u064A\u0648 2023", date: "2023-07-15", result: "\u0627\u062C\u062A\u0627\u0632" }
    ]
  },
  "student_fees": {
    id: "student_fees",
    title: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: "\u0628\u064A\u0627\u0646 \u0628\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0645\u0633\u062A\u062D\u0642\u0629 \u0648\u0627\u0644\u0645\u0633\u062F\u062F\u0629",
    type: "table",
    columns: [
      { key: "item", label: "\u0627\u0644\u0628\u0646\u062F" },
      { key: "amount", label: "\u0627\u0644\u0642\u064A\u0645\u0629", type: "currency" },
      { key: "paid", label: "\u0627\u0644\u0645\u062F\u0641\u0648\u0639", type: "currency" },
      { key: "remaining", label: "\u0627\u0644\u0645\u062A\u0628\u0642\u064A", type: "currency" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { item: "\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u062F\u0631\u0627\u0633\u064A\u0629 - \u062E\u0631\u064A\u0641 2024", amount: "6000", paid: "6000", remaining: "0", status: "\u0645\u0633\u062F\u062F" },
      { item: "\u0643\u062A\u0628 \u062F\u0631\u0627\u0633\u064A\u0629", amount: "500", paid: "0", remaining: "500", status: "\u063A\u064A\u0631 \u0645\u0633\u062F\u062F" }
    ],
    actions: [{ type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0625\u0630\u0646 \u062F\u0641\u0639" }]
  },
  "student_grades": {
    id: "student_grades",
    title: "\u0627\u0644\u0646\u062A\u0627\u0626\u062C \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: "\u0633\u062C\u0644 \u0627\u0644\u062F\u0631\u062C\u0627\u062A \u0648\u0627\u0644\u062A\u0642\u062F\u064A\u0631\u0627\u062A \u0644\u0644\u0641\u0635\u0648\u0644 \u0627\u0644\u0633\u0627\u0628\u0642\u0629",
    type: "table",
    columns: [
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "total", label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639" },
      { key: "grade_letter", label: "\u0627\u0644\u062A\u0642\u062F\u064A\u0631" },
      { key: "grade_points", label: "\u0627\u0644\u0646\u0642\u0627\u0637" }
    ],
    data: STUDENT_GRADES.slice(0, 50),
    // Show sample grades for student view
    actions: [
      { type: "print", label: "\u0628\u064A\u0627\u0646 \u062F\u0631\u062C\u0627\u062A" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 PDF" }
    ]
  },
  "academic_reg_student": {
    id: "academic_reg_student",
    title: "\u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A",
    description: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u062D\u0627\u0644\u064A\u0627\u064B",
    type: "table",
    columns: [
      { key: "code", label: "\u0627\u0644\u0643\u0648\u062F" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "group", label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629" },
      { key: "instructor", label: "\u0627\u0644\u0645\u062D\u0627\u0636\u0631" }
    ],
    data: [
      { code: "CS301", name: "\u0646\u0638\u0645 \u062A\u0634\u063A\u064A\u0644", group: "A", instructor: "\u062F. \u062E\u0627\u0644\u062F" },
      { code: "CS302", name: "\u0634\u0628\u0643\u0627\u062A \u062D\u0627\u0633\u0628", group: "A", instructor: "\u062F. \u0645\u0646\u0627\u0644" }
    ]
  },
  "uni_email": {
    id: "uni_email",
    title: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u062C\u0627\u0645\u0639\u064A",
    description: "\u0628\u064A\u0627\u0646\u0627\u062A \u062D\u0633\u0627\u0628 \u0645\u0627\u064A\u0643\u0631\u0648\u0633\u0648\u0641\u062A \u0627\u0644\u062C\u0627\u0645\u0639\u064A",
    type: "table",
    columns: [
      { key: "email", label: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0633\u0627\u0628", type: "status" }
    ],
    data: [
      { email: "ahmed.20210055@stud.uni.edu.eg", status: "\u0646\u0634\u0637" }
    ],
    actions: [{ type: "edit", label: "\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }]
  },
  "academic_warnings": {
    id: "academic_warnings",
    title: "\u0627\u0644\u0625\u0646\u0630\u0627\u0631\u0627\u062A \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629",
    description: "\u0633\u062C\u0644 \u0627\u0644\u0625\u0646\u0630\u0627\u0631\u0627\u062A \u0628\u0633\u0628\u0628 \u0627\u0646\u062E\u0641\u0627\u0636 \u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A",
    type: "table",
    columns: [
      { key: "date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0625\u0646\u0630\u0627\u0631" },
      { key: "reason", label: "\u0627\u0644\u0633\u0628\u0628" },
      { key: "gpa", label: "\u0627\u0644\u0645\u0639\u062F\u0644 \u062D\u064A\u0646\u0647\u0627" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    // Empty state demonstration
    actions: []
  },
  // ==================================================================================
  // ADMIN PAGES
  // ==================================================================================
  "survey_rules": {
    id: "survey_rules",
    title: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0627\u0633\u062A\u0628\u064A\u0627\u0646",
    description: "\u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0645\u0646\u0638\u0645\u0629 \u0644\u0627\u0633\u062A\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0648\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    type: "table",
    columns: [
      { key: "id", label: "\u0643\u0648\u062F \u0627\u0644\u0642\u0627\u0639\u062F\u0629" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0642\u0627\u0639\u062F\u0629" },
      { key: "target", label: "\u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641\u0629" },
      { key: "start_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0627\u064A\u0629", type: "date" },
      { key: "end_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0646\u0647\u0627\u064A\u0629", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { id: "SR-001", name: "\u0627\u0633\u062A\u0628\u064A\u0627\u0646 \u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A - \u062E\u0631\u064A\u0641 2024", target: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0637\u0644\u0627\u0628", start_date: "2024-01-01", end_date: "2024-01-15", status: "\u0645\u0646\u062A\u0647\u064A" },
      { id: "SR-002", name: "\u0627\u0633\u062A\u0628\u064A\u0627\u0646 \u0627\u0644\u0631\u0636\u0627 \u0627\u0644\u0637\u0644\u0627\u0628\u064A", target: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639", start_date: "2024-05-01", end_date: "2024-05-30", status: "\u0646\u0634\u0637" }
    ],
    actions: [{ type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0642\u0627\u0639\u062F\u0629" }, { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" }]
  },
  // Contact List - Student contact information
  "contact_list": {
    id: "contact_list",
    title: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0627\u062A\u0635\u0627\u0644",
    description: "\u0642\u0627\u0626\u0645\u0629 \u0628\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0644\u0644\u0637\u0644\u0627\u0628",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "phone", label: "\u0627\u0644\u0647\u0627\u062A\u0641" },
      { key: "email", label: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" },
      { key: "city", label: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" }
    ],
    data: (() => {
      return FCAI_STUDENTS.map((student) => ({
        student_id: student.student_id,
        name: student.name,
        phone: student.phone,
        email: student.email,
        city: student.city,
        level: student.level
      }));
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // ID Cards - Student ID card information
  "id_cards": {
    id: "id_cards",
    title: "\u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0647\u0648\u064A\u0629",
    description: "\u062D\u0627\u0644\u0629 \u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0647\u0648\u064A\u0629 \u0627\u0644\u062C\u0627\u0645\u0639\u064A\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "card_year", label: "\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u062C\u0627\u0645\u0639\u064A" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0628\u0637\u0627\u0642\u0629", type: "status" },
      { key: "delivery", label: "\u0645\u0643\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645" }
    ],
    data: (() => {
      return FCAI_STUDENTS.map((student) => {
        const statusRand = Math.random();
        let status = "\u062C\u0627\u0647\u0632 \u0644\u0644\u0627\u0633\u062A\u0644\u0627\u0645";
        let delivery = "\u0634\u0624\u0648\u0646 \u0627\u0644\u0637\u0644\u0627\u0628 - \u0634\u0628\u0627\u0643 4";
        if (statusRand > 0.8) {
          status = "\u0642\u064A\u062F \u0627\u0644\u0637\u0628\u0627\u0639\u0629";
          delivery = "-";
        } else if (statusRand > 0.95) {
          status = "\u062A\u0645 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645";
          delivery = "\u062A\u0645 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645";
        }
        return {
          student_id: student.student_id,
          name: student.name,
          card_year: "2024-2025",
          status,
          delivery
        };
      });
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "student_attendance": {
    id: "student_attendance",
    title: "\u0633\u062C\u0644 \u062D\u0636\u0648\u0631 \u0627\u0644\u0637\u0644\u0627\u0628",
    description: `\u0645\u062A\u0627\u0628\u0639\u0629 \u0648\u0631\u0635\u062F \u062D\u0636\u0648\u0631 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u0627\u062A \u0648\u0627\u0644\u0633\u0643\u0627\u0634\u0646 (${ATTENDANCE_RECORDS.length} \u0633\u062C\u0644)`,
    type: "table",
    columns: [
      { key: "student_id", label: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "student_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "course_id", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "session_type", label: "\u0646\u0648\u0639 \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u0629" },
      { key: "week", label: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639" },
      { key: "date", label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", type: "date" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0636\u0648\u0631", type: "status" },
      { key: "actions", label: "\u0625\u062C\u0631\u0627\u0621\u0627\u062A" }
    ],
    data: (() => {
      return ATTENDANCE_RECORDS.map((record, index) => {
        const student = ALL_STUDENTS.find((s) => s.student_id === record.student_id);
        const course = COURSES_DATABASE.find((c) => c.id === record.course_id);
        return {
          id: index + 1,
          // Add unique ID for each record
          ...record,
          student_name: student ? student.name : "\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641",
          course_name: course ? course.name : record.course_name || "\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641",
          // Format date for better display
          formatted_date: record.date,
          // Add actions for each record
          actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })(),
    actions: [
      { type: "add", label: "\u062A\u0633\u062C\u064A\u0644 \u062D\u0636\u0648\u0631" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  "add_attendance": {
    id: "add_attendance",
    title: "\u0625\u062F\u062E\u0627\u0644 \u062D\u0636\u0648\u0631 \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u062A\u0633\u062C\u064A\u0644 \u062D\u0636\u0648\u0631 \u0648\u063A\u064A\u0627\u0628 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u0627\u062A \u0648\u0627\u0644\u0633\u0643\u0627\u0634\u0646",
    type: "attendance_form",
    columns: [
      { key: "course_selection", label: "\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "session_type", label: "\u0646\u0648\u0639 \u0627\u0644\u062C\u0644\u0633\u0629" },
      { key: "date", label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", type: "date" },
      { key: "week", label: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639" },
      { key: "students_list", label: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628" }
    ],
    data: (() => {
      return [
        {
          course_selection: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0642\u0631\u0631...",
          available_courses: COURSES_DATABASE.filter((course) => course.level <= 4).map((course) => {
            const enrolledCount = STUDENT_ENROLLMENTS.filter((e) => e.course_id === course.id && e.status === "\u0645\u0633\u062C\u0644").length;
            return {
              id: course.id,
              name: `${course.name} (${course.id})`,
              enrolled_students: Math.max(enrolledCount, 15),
              // Ensure minimum students
              level: course.level,
              department: course.department,
              hours: course.hours,
              type: course.type
            };
          }),
          session_types: ["\u0645\u062D\u0627\u0636\u0631\u0629", "\u0633\u0643\u0634\u0646", "\u0645\u0639\u0645\u0644"],
          weeks: Array.from({ length: 15 }, (_, i) => `\u0627\u0644\u0623\u0633\u0628\u0648\u0639 ${i + 1}`),
          current_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          instructions: {
            title: "\u062A\u0639\u0644\u064A\u0645\u0627\u062A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062D\u0636\u0648\u0631",
            steps: [
              "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0642\u0631\u0631 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0646\u0633\u062F\u0644\u0629",
              "\u062D\u062F\u062F \u0646\u0648\u0639 \u0627\u0644\u062C\u0644\u0633\u0629 (\u0645\u062D\u0627\u0636\u0631\u0629/\u0633\u0643\u0634\u0646/\u0645\u0639\u0645\u0644)",
              "\u0627\u062E\u062A\u0631 \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0648\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u0645\u0646\u0627\u0633\u0628",
              "\u0633\u062A\u0638\u0647\u0631 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B",
              "\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628 \u0644\u062A\u063A\u064A\u064A\u0631 \u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0636\u0648\u0631",
              "\u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0623\u0632\u0631\u0627\u0631 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 \u0644\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0643\u0644",
              "\u0627\u062D\u0641\u0638 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0639\u0646\u062F \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621"
            ]
          }
        }
      ];
    })(),
    actions: [
      { type: "add", label: "\u062D\u0641\u0638 \u0627\u0644\u062D\u0636\u0648\u0631" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062D\u0636\u0648\u0631" }
    ]
  },
  // ==================================================================================
  // SCHEDULES MANAGEMENT
  // ==================================================================================
  "create_sched": {
    id: "create_sched",
    title: "\u0625\u0646\u0634\u0627\u0621 \u062C\u062F\u0648\u0644 \u062F\u0631\u0627\u0633\u064A \u062C\u062F\u064A\u062F",
    description: "\u0625\u0646\u0634\u0627\u0621 \u0648\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0644\u0644\u0641\u0635\u0648\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u062E\u062A\u0644\u0641\u0629",
    type: "table",
    columns: [
      { key: "schedule_id", label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u062F\u0648\u0644" },
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
      { key: "academic_year", label: "\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A" },
      { key: "faculty", label: "\u0627\u0644\u0643\u0644\u064A\u0629" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "courses_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" },
      { key: "created_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0625\u0646\u0634\u0627\u0621", type: "date" },
      { key: "actions", label: "\u0625\u062C\u0631\u0627\u0621\u0627\u062A" }
    ],
    data: [
      {
        id: 1,
        schedule_id: "SCH-2024-FALL-001",
        semester: "\u062E\u0631\u064A\u0641 2024",
        academic_year: "2024-2025",
        faculty: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
        level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644",
        courses_count: "8",
        status: "\u0646\u0634\u0637",
        created_date: "2024-09-01",
        actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
      },
      {
        id: 2,
        schedule_id: "SCH-2024-FALL-002",
        semester: "\u062E\u0631\u064A\u0641 2024",
        academic_year: "2024-2025",
        faculty: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
        level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A",
        courses_count: "7",
        status: "\u0646\u0634\u0637",
        created_date: "2024-09-01",
        actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
      },
      {
        id: 3,
        schedule_id: "SCH-2024-FALL-003",
        semester: "\u062E\u0631\u064A\u0641 2024",
        academic_year: "2024-2025",
        faculty: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
        level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B",
        courses_count: "6",
        status: "\u0646\u0634\u0637",
        created_date: "2024-09-02",
        actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
      },
      {
        id: 4,
        schedule_id: "SCH-2024-FALL-004",
        semester: "\u062E\u0631\u064A\u0641 2024",
        academic_year: "2024-2025",
        faculty: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
        level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639",
        courses_count: "5",
        status: "\u0642\u064A\u062F \u0627\u0644\u0625\u0646\u0634\u0627\u0621",
        created_date: "2024-09-03",
        actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
      },
      {
        id: 5,
        schedule_id: "SCH-2024-SPRING-001",
        semester: "\u0631\u0628\u064A\u0639 2024",
        academic_year: "2023-2024",
        faculty: "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
        level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644",
        courses_count: "8",
        status: "\u0645\u0646\u062A\u0647\u064A",
        created_date: "2024-02-01",
        actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
      }
    ],
    actions: [
      { type: "add", label: "\u0625\u0646\u0634\u0627\u0621 \u062C\u062F\u0648\u0644 \u062C\u062F\u064A\u062F" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  "assign_room": {
    id: "assign_room",
    title: "\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0642\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: `\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0642\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 (${CLASSROOM_ASSIGNMENTS.length} \u062A\u062E\u0635\u064A\u0635)`,
    type: "table",
    columns: [
      { key: "course_code", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "group", label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629" },
      { key: "day", label: "\u0627\u0644\u064A\u0648\u0645" },
      { key: "time", label: "\u0627\u0644\u0648\u0642\u062A" },
      { key: "room", label: "\u0627\u0644\u0642\u0627\u0639\u0629" },
      { key: "room_type", label: "\u0646\u0648\u0639 \u0627\u0644\u0642\u0627\u0639\u0629" },
      { key: "capacity", label: "\u0627\u0644\u0633\u0639\u0629" },
      { key: "enrolled", label: "\u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646" },
      { key: "instructor", label: "\u0627\u0644\u0645\u062F\u0631\u0633" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" },
      { key: "actions", label: "\u0625\u062C\u0631\u0627\u0621\u0627\u062A" }
    ],
    data: (() => {
      return CLASSROOM_ASSIGNMENTS.map((assignment, index) => ({
        id: index + 1,
        ...assignment,
        actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
      }));
    })(),
    actions: [
      { type: "add", label: "\u062A\u062E\u0635\u064A\u0635 \u0642\u0627\u0639\u0629 \u062C\u062F\u064A\u062F\u0629" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u062E\u0635\u064A\u0635" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  "add_room_assignment": {
    id: "add_room_assignment",
    title: "\u062A\u062E\u0635\u064A\u0635 \u0642\u0627\u0639\u0629 \u062C\u062F\u064A\u062F\u0629",
    description: "\u0625\u0636\u0627\u0641\u0629 \u062A\u062E\u0635\u064A\u0635 \u062C\u062F\u064A\u062F \u0644\u0645\u0642\u0631\u0631 \u0641\u064A \u0642\u0627\u0639\u0629 \u062F\u0631\u0627\u0633\u064A\u0629 \u0645\u0639 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0639\u0627\u0631\u0636\u0627\u062A",
    type: "smart_form",
    columns: [
      {
        key: "course_code",
        label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631",
        type: "select",
        required: true,
        options: ["CS101", "CS102", "CS201", "CS202", "CS301", "CS302", "CS401", "MATH101", "IS101", "IS201", "AI301", "IT201"]
      },
      {
        key: "course_name",
        label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631",
        type: "readonly",
        auto_fill: true
      },
      {
        key: "group",
        label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629",
        type: "select",
        required: true,
        options: ["A", "B", "C"]
      },
      {
        key: "day",
        label: "\u0627\u0644\u064A\u0648\u0645",
        type: "select",
        required: true,
        options: ["\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0625\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633"]
      },
      {
        key: "time",
        label: "\u0627\u0644\u0648\u0642\u062A",
        type: "select",
        required: true,
        options: ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"]
      },
      {
        key: "room",
        label: "\u0627\u0644\u0642\u0627\u0639\u0629",
        type: "select",
        required: true,
        dynamic: true
      },
      {
        key: "capacity",
        label: "\u0633\u0639\u0629 \u0627\u0644\u0642\u0627\u0639\u0629",
        type: "readonly",
        auto_fill: true
      },
      {
        key: "enrolled",
        label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0627\u0644\u0645\u062A\u0648\u0642\u0639",
        type: "number",
        required: true
      }
    ],
    data: /* @__PURE__ */ (() => {
      const courseNames = {
        "CS101": "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628",
        "CS102": "\u0628\u0631\u0645\u062C\u0629 1",
        "CS201": "\u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",
        "CS202": "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",
        "CS301": "\u0646\u0638\u0645 \u0627\u0644\u062A\u0634\u063A\u064A\u0644",
        "CS302": "\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628",
        "CS401": "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C",
        "MATH101": "\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0645\u062A\u0642\u0637\u0639\u0629",
        "IS101": "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
        "IS201": "\u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0646\u0638\u0645",
        "AI301": "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
        "IT201": "\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629"
      };
      const rooms = [
        { name: "\u0642\u0627\u0639\u0629 101", capacity: 60, type: "\u0645\u062D\u0627\u0636\u0631\u0627\u062A" },
        { name: "\u0642\u0627\u0639\u0629 102", capacity: 60, type: "\u0645\u062D\u0627\u0636\u0631\u0627\u062A" },
        { name: "\u0642\u0627\u0639\u0629 201", capacity: 80, type: "\u0645\u062D\u0627\u0636\u0631\u0627\u062A" },
        { name: "\u0642\u0627\u0639\u0629 202", capacity: 80, type: "\u0645\u062D\u0627\u0636\u0631\u0627\u062A" },
        { name: "\u0642\u0627\u0639\u0629 301", capacity: 100, type: "\u0645\u062D\u0627\u0636\u0631\u0627\u062A" },
        { name: "\u0645\u0639\u0645\u0644 1", capacity: 40, type: "\u0645\u0639\u0627\u0645\u0644" },
        { name: "\u0645\u0639\u0645\u0644 2", capacity: 40, type: "\u0645\u0639\u0627\u0645\u0644" },
        { name: "\u0645\u0639\u0645\u0644 3", capacity: 40, type: "\u0645\u0639\u0627\u0645\u0644" },
        { name: "\u0642\u0627\u0639\u0629 \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u0627\u062A \u0627\u0644\u0643\u0628\u0631\u0649", capacity: 200, type: "\u0645\u062D\u0627\u0636\u0631\u0627\u062A" }
      ];
      return [{
        course_names: courseNames,
        available_rooms: rooms,
        existing_assignments: CLASSROOM_ASSIGNMENTS,
        validation_rules: {
          no_double_booking: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u062C\u0632 \u0646\u0641\u0633 \u0627\u0644\u0642\u0627\u0639\u0629 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u0648\u0642\u062A \u0648\u0627\u0644\u064A\u0648\u0645",
          capacity_check: "\u0639\u062F\u062F \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0623\u0642\u0644 \u0645\u0646 \u0633\u0639\u0629 \u0627\u0644\u0642\u0627\u0639\u0629",
          room_type_match: "\u0646\u0648\u0639 \u0627\u0644\u0642\u0627\u0639\u0629 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0646\u0627\u0633\u0628 \u0646\u0648\u0639 \u0627\u0644\u0645\u0642\u0631\u0631",
          time_conflict: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0633\u062C\u064A\u0644 \u0646\u0641\u0633 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0641\u064A \u0623\u0648\u0642\u0627\u062A \u0645\u062A\u0639\u0627\u0631\u0636\u0629"
        },
        instructions: {
          title: "\u062A\u0639\u0644\u064A\u0645\u0627\u062A \u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0642\u0627\u0639\u0627\u062A",
          steps: [
            "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0642\u0631\u0631 \u0648\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u062E\u0635\u064A\u0635 \u0642\u0627\u0639\u0629 \u0644\u0647\u0627",
            "\u062D\u062F\u062F \u0627\u0644\u064A\u0648\u0645 \u0648\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u0646\u0627\u0633\u0628",
            "\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0627\u0639\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629",
            "\u0623\u062F\u062E\u0644 \u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0627\u0644\u0645\u062A\u0648\u0642\u0639",
            "\u062A\u0623\u0643\u062F \u0645\u0646 \u0639\u062F\u0645 \u0648\u062C\u0648\u062F \u062A\u0639\u0627\u0631\u0636 \u0645\u0639 \u0627\u0644\u062A\u062E\u0635\u064A\u0635\u0627\u062A \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0629",
            "\u0627\u062D\u0641\u0638 \u0627\u0644\u062A\u062E\u0635\u064A\u0635 \u0628\u0639\u062F \u0627\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u0635\u062D\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"
          ]
        }
      }];
    })(),
    actions: [
      { type: "save", label: "\u062D\u0641\u0638 \u0627\u0644\u062A\u062E\u0635\u064A\u0635", primary: true },
      { type: "validate", label: "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0639\u0627\u0631\u0636\u0627\u062A" },
      { type: "cancel", label: "\u0625\u0644\u063A\u0627\u0621" }
    ]
  },
  "lecturers": {
    id: "lecturers",
    title: "\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u064A\u0646",
    description: "\u062A\u0648\u0632\u064A\u0639 \u0623\u0639\u0636\u0627\u0621 \u0647\u064A\u0626\u0629 \u0627\u0644\u062A\u062F\u0631\u064A\u0633 \u0639\u0644\u0649 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0648\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A",
    type: "table",
    columns: [
      { key: "course_code", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "group", label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629" },
      { key: "lecturer_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u062D\u0627\u0636\u0631" },
      { key: "lecturer_title", label: "\u0627\u0644\u0644\u0642\u0628 \u0627\u0644\u0639\u0644\u0645\u064A" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645" },
      { key: "hours_per_week", label: "\u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A\u0629" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" },
      { key: "actions", label: "\u0625\u062C\u0631\u0627\u0621\u0627\u062A" }
    ],
    data: (() => {
      const lecturers = [
        { name: "\u0623.\u062F. \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F \u0627\u0644\u0633\u064A\u062F", title: "\u0623\u0633\u062A\u0627\u0630", dept: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628" },
        { name: "\u062F. \u0645\u0646\u0627\u0644 \u062D\u0633\u0646 \u0625\u0628\u0631\u0627\u0647\u064A\u0645", title: "\u0623\u0633\u062A\u0627\u0630 \u0645\u0633\u0627\u0639\u062F", dept: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628" },
        { name: "\u062F. \u062E\u0627\u0644\u062F \u0645\u062D\u0645\u0648\u062F \u0639\u0644\u064A", title: "\u0623\u0633\u062A\u0627\u0630 \u0645\u0633\u0627\u0639\u062F", dept: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A" },
        { name: "\u062F. \u0633\u0627\u0631\u0629 \u0623\u062D\u0645\u062F \u0641\u0624\u0627\u062F", title: "\u0645\u062F\u0631\u0633", dept: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A" },
        { name: "\u062F. \u0645\u062D\u0645\u062F \u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0646\u0635\u0631", title: "\u0645\u062F\u0631\u0633", dept: "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A" },
        { name: "\u0623.\u062F. \u0641\u0627\u0637\u0645\u0629 \u0639\u0644\u064A \u062D\u0633\u0646", title: "\u0623\u0633\u062A\u0627\u0630", dept: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628" },
        { name: "\u062F. \u064A\u0648\u0633\u0641 \u0633\u0639\u064A\u062F \u0643\u0627\u0645\u0644", title: "\u0623\u0633\u062A\u0627\u0630 \u0645\u0633\u0627\u0639\u062F", dept: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A" },
        { name: "\u062F. \u0646\u0648\u0631\u0627 \u0645\u062D\u0645\u0648\u062F \u062C\u0645\u0627\u0644", title: "\u0645\u062F\u0631\u0633", dept: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A" }
      ];
      const courses = [
        { code: "CS101", name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", groups: ["A", "B", "C"], hours: 3 },
        { code: "CS102", name: "\u0628\u0631\u0645\u062C\u0629 1", groups: ["A", "B"], hours: 4 },
        { code: "CS201", name: "\u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", groups: ["A", "B"], hours: 3 },
        { code: "CS202", name: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", groups: ["A", "B"], hours: 3 },
        { code: "CS301", name: "\u0646\u0638\u0645 \u0627\u0644\u062A\u0634\u063A\u064A\u0644", groups: ["A"], hours: 3 },
        { code: "CS302", name: "\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628", groups: ["A"], hours: 3 },
        { code: "CS401", name: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C", groups: ["A", "B"], hours: 2 },
        { code: "MATH101", name: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0645\u062A\u0642\u0637\u0639\u0629", groups: ["A", "B"], hours: 3 }
      ];
      const assignments = [];
      let lecturerIndex = 0;
      courses.forEach((course) => {
        course.groups.forEach((group) => {
          const lecturer = lecturers[lecturerIndex % lecturers.length];
          assignments.push({
            id: assignments.length + 1,
            course_code: course.code,
            course_name: course.name,
            group,
            lecturer_name: lecturer.name,
            lecturer_title: lecturer.title,
            department: lecturer.dept,
            hours_per_week: course.hours.toString(),
            status: "\u0645\u0643\u062A\u0645\u0644",
            actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
          });
          lecturerIndex++;
        });
      });
      return assignments;
    })(),
    actions: [
      { type: "add", label: "\u062A\u0648\u0632\u064A\u0639 \u0645\u062D\u0627\u0636\u0631 \u062C\u062F\u064A\u062F" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0648\u0632\u064A\u0639" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" }
    ]
  },
  "add_lecturer_assignment": {
    id: "add_lecturer_assignment",
    title: "\u062A\u0648\u0632\u064A\u0639 \u0645\u062D\u0627\u0636\u0631 \u062C\u062F\u064A\u062F",
    description: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0648\u0632\u064A\u0639 \u0645\u062D\u0627\u0636\u0631 \u062C\u062F\u064A\u062F \u0639\u0644\u0649 \u0645\u0642\u0631\u0631 \u0648\u0645\u062C\u0645\u0648\u0639\u0629 \u0645\u0639 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0639\u0627\u0631\u0636\u0627\u062A",
    type: "form",
    columns: [
      { key: "course_code", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "group", label: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629" },
      { key: "lecturer_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u062D\u0627\u0636\u0631" },
      { key: "lecturer_title", label: "\u0627\u0644\u0644\u0642\u0628 \u0627\u0644\u0639\u0644\u0645\u064A" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645" },
      { key: "hours_per_week", label: "\u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A\u0629" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629" }
    ],
    data: [],
    actions: [
      { type: "save", label: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0648\u0632\u064A\u0639" },
      { type: "cancel", label: "\u0625\u0644\u063A\u0627\u0621" }
    ]
  },
  // ==================================================================================
  // ALL ACTIVITIES / CHANGES LOG
  // ==================================================================================
  "all_activities": {
    id: "all_activities",
    title: "\u0633\u062C\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u063A\u064A\u064A\u0631\u0627\u062A",
    description: "\u0639\u0631\u0636 \u0634\u0627\u0645\u0644 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u063A\u064A\u064A\u0631\u0627\u062A \u0648\u0627\u0644\u0646\u0634\u0627\u0637\u0627\u062A \u0627\u0644\u062A\u064A \u062A\u0645\u062A \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645",
    type: "table",
    columns: [
      { key: "timestamp", label: "\u0627\u0644\u0648\u0642\u062A", type: "date" },
      { key: "user", label: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645" },
      { key: "action", label: "\u0627\u0644\u0625\u062C\u0631\u0627\u0621", type: "status" },
      { key: "entity", label: "\u0627\u0644\u0643\u064A\u0627\u0646" },
      { key: "details", label: "\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644", type: "long_text" },
      { key: "faculty", label: "\u0627\u0644\u0643\u0644\u064A\u0629" }
    ],
    data: (() => {
      const now = /* @__PURE__ */ new Date();
      const activities = [];
      const users = [
        "\u0623.\u062F. \u0639\u0645\u064A\u062F \u0627\u0644\u0643\u0644\u064A\u0629",
        "\u062F. \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F",
        "\u062F. \u0645\u0646\u0627\u0644 \u062D\u0633\u0646",
        "\u062F. \u062E\u0627\u0644\u062F \u0645\u062D\u0645\u0648\u062F",
        "\u062F. \u0633\u0627\u0631\u0629 \u0623\u062D\u0645\u062F",
        "\u062F. \u064A\u0648\u0633\u0641 \u0633\u0639\u064A\u062F",
        "\u062F. \u0646\u0648\u0631\u0627 \u0645\u062D\u0645\u0648\u062F",
        "\u0623.\u062F. \u0631\u0626\u064A\u0633 \u0627\u0644\u062C\u0627\u0645\u0639\u0629"
      ];
      const faculties = [
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u0639\u0644\u0648\u0645",
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u0629",
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u062A\u0631\u0628\u064A\u0629",
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u0647\u0646\u062F\u0633\u0629",
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u0637\u0628",
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u0629",
        "\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0642\u0648\u0642"
      ];
      const actions = ["edit", "add", "update", "delete"];
      const actionLabels = { edit: "\u062A\u0639\u062F\u064A\u0644", add: "\u0625\u0636\u0627\u0641\u0629", update: "\u062A\u062D\u062F\u064A\u062B", delete: "\u062D\u0630\u0641" };
      const entities = [
        "\u062C\u062F\u0648\u0644 \u062F\u0631\u0627\u0633\u064A",
        "\u0645\u0642\u0631\u0631 \u062F\u0631\u0627\u0633\u064A",
        "\u0628\u064A\u0627\u0646\u0627\u062A \u0637\u0627\u0644\u0628",
        "\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0636\u0631\u064A\u0646",
        "\u0642\u0627\u0639\u0629 \u062F\u0631\u0627\u0633\u064A\u0629",
        "\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628",
        "\u0631\u0633\u0648\u0645 \u0637\u0627\u0644\u0628",
        "\u062D\u0636\u0648\u0631 \u0637\u0644\u0627\u0628",
        "\u062A\u0633\u062C\u064A\u0644 \u0623\u0643\u0627\u062F\u064A\u0645\u064A",
        "\u0628\u0637\u0627\u0642\u0629 \u0647\u0648\u064A\u0629",
        "\u0642\u0627\u0639\u062F\u0629 \u0627\u0633\u062A\u0628\u064A\u0627\u0646",
        "\u062A\u0642\u0631\u064A\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A"
      ];
      const details = [
        "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0645\u0648\u0639\u062F \u0645\u062D\u0627\u0636\u0631\u0629 \u0645\u0642\u0631\u0631 CS301 \u0645\u0646 10:00 \u0625\u0644\u0649 12:00",
        '\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u0631\u0631 \u062C\u062F\u064A\u062F "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u0645\u062A\u0642\u062F\u0645" \u0644\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639',
        "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A \u0644\u0644\u0637\u0627\u0644\u0628 20210055 \u0645\u0646 3.2 \u0625\u0644\u0649 3.4",
        "\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0645\u062D\u0627\u0636\u0631 \u0645\u0642\u0631\u0631 CS302 \u0645\u0646 \u062F. \u062E\u0627\u0644\u062F \u0625\u0644\u0649 \u062F. \u0633\u0627\u0631\u0629",
        "\u062A\u0645 \u062A\u062E\u0635\u064A\u0635 \u0642\u0627\u0639\u0629 301 \u0644\u0645\u0642\u0631\u0631 CS401 - \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 A",
        "\u062A\u0645 \u0631\u0635\u062F \u062F\u0631\u062C\u0627\u062A 25 \u0637\u0627\u0644\u0628 \u0641\u064A \u0645\u0642\u0631\u0631 \u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A",
        "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u062D\u0627\u0644\u0629 \u0631\u0633\u0648\u0645 \u0627\u0644\u0637\u0627\u0644\u0628 20220033 \u0645\u0646 \u063A\u064A\u0631 \u0645\u0633\u062F\u062F \u0625\u0644\u0649 \u0645\u0633\u062F\u062F",
        "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u062D\u0636\u0648\u0631 45 \u0637\u0627\u0644\u0628 \u0641\u064A \u0645\u062D\u0627\u0636\u0631\u0629 \u0645\u0642\u0631\u0631 \u0628\u0631\u0645\u062C\u0629 \u0634\u064A\u0626\u064A\u0629",
        "\u062A\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u062A\u0633\u062C\u064A\u0644 \u0637\u0627\u0644\u0628 \u0641\u064A \u0645\u0642\u0631\u0631 \u0625\u0636\u0627\u0641\u064A",
        "\u062A\u0645 \u0625\u0635\u062F\u0627\u0631 \u0628\u0637\u0627\u0642\u0629 \u0647\u0648\u064A\u0629 \u062C\u062F\u064A\u062F\u0629 \u0644\u0644\u0637\u0627\u0644\u0628 20230012",
        "\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0642\u0627\u0639\u062F\u0629 \u0627\u0633\u062A\u0628\u064A\u0627\u0646 \u062C\u062F\u064A\u062F\u0629 \u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
        "\u062A\u0645 \u0625\u063A\u0644\u0627\u0642 \u0628\u0627\u0628 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0644\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u062E\u0631\u064A\u0641 2024",
        "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0633\u0639\u0629 \u0627\u0644\u0642\u0627\u0639\u0629 201 \u0645\u0646 80 \u0625\u0644\u0649 100 \u0637\u0627\u0644\u0628",
        "\u062A\u0645 \u062D\u0630\u0641 \u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u063A\u064A\u0631 \u0645\u0637\u0644\u0648\u0628",
        "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0644\u0637\u0627\u0644\u0628",
        "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0645\u062D\u0627\u0636\u0631 \u062C\u062F\u064A\u062F \u0644\u0644\u0642\u0633\u0645",
        "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0645\u0648\u0627\u0639\u064A\u062F \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A \u0627\u0644\u0646\u0647\u0627\u0626\u064A\u0629",
        "\u062A\u0645 \u0631\u0641\u0636 \u0637\u0644\u0628 \u0632\u064A\u0627\u062F\u0629 \u0627\u0644\u0639\u0628\u0621 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
        "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0645\u062C\u0645\u0648\u0639\u0629 \u062C\u062F\u064A\u062F\u0629 \u0644\u0645\u0642\u0631\u0631 CS201",
        "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0627\u0644\u062F\u0627\u062E\u0644\u064A\u0629 \u0644\u0644\u0628\u0631\u0646\u0627\u0645\u062C"
      ];
      for (let i = 0; i < 50; i++) {
        const hoursAgo = Math.floor(Math.random() * 168);
        const minutesAgo = Math.floor(Math.random() * 60);
        const timestamp = new Date(now.getTime() - (hoursAgo * 36e5 + minutesAgo * 6e4));
        const action = actions[Math.floor(Math.random() * actions.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const faculty = faculties[Math.floor(Math.random() * faculties.length)];
        const entity = entities[Math.floor(Math.random() * entities.length)];
        const detail = details[Math.floor(Math.random() * details.length)];
        activities.push({
          id: `ACT-${String(i + 1).padStart(4, "0")}`,
          timestamp: timestamp.toISOString(),
          user,
          action: actionLabels[action],
          entity,
          details: detail,
          faculty
        });
      }
      return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // ==================================================================================
  // STUDY PROGRAMS PAGES
  // ==================================================================================
  "upload_courses": {
    id: "upload_courses",
    title: "\u0631\u0641\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: "\u0631\u0641\u0639 \u0648\u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0645\u0646 \u0645\u0644\u0641 Excel \u0623\u0648 CSV",
    type: "form",
    columns: [],
    data: [],
    actions: [
      { type: "upload", label: "\u0631\u0641\u0639 \u0645\u0644\u0641" },
      { type: "export", label: "\u062A\u062D\u0645\u064A\u0644 \u0642\u0627\u0644\u0628" }
    ]
  },
  "equivalent_courses": {
    id: "equivalent_courses",
    title: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0638\u0631\u0629 \u0644\u0644\u0645\u0648\u0627\u0632\u0646\u0629",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0638\u0631\u0629 \u0628\u064A\u0646 \u0627\u0644\u0628\u0631\u0627\u0645\u062C \u0627\u0644\u0645\u062E\u062A\u0644\u0641\u0629 \u0644\u0644\u0645\u0648\u0627\u0632\u0646\u0629 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629",
    type: "table",
    columns: [
      { key: "course_code", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "program", label: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C" },
      { key: "equivalent_course", label: "\u0627\u0644\u0645\u0642\u0631\u0631 \u0627\u0644\u0645\u0646\u0627\u0638\u0631" },
      { key: "equivalent_program", label: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u0645\u0646\u0627\u0638\u0631" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { course_code: "CS101", course_name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0628\u0631\u0645\u062C\u0629", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", equivalent_course: "IS101", equivalent_program: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", status: "\u0645\u0639\u062A\u0645\u062F" },
      { course_code: "CS201", course_name: "\u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", equivalent_course: "IS201", equivalent_program: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", status: "\u0645\u0639\u062A\u0645\u062F" },
      { course_code: "CS301", course_name: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", equivalent_course: "IS301", equivalent_program: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", status: "\u0645\u0639\u062A\u0645\u062F" },
      { course_code: "AI401", course_name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", program: "\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A", equivalent_course: "CS401", equivalent_program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", status: "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u0631\u0631 \u0645\u0646\u0627\u0638\u0631" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" }
    ]
  },
  "program_data": {
    id: "program_data",
    title: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0628\u0631\u0627\u0645\u062C",
    description: "\u0639\u0631\u0636 \u0648\u0625\u062F\u0627\u0631\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0628\u0631\u0627\u0645\u062C \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0641\u064A \u0627\u0644\u0643\u0644\u064A\u0629",
    type: "table",
    columns: [
      { key: "program_id", label: "\u0643\u0648\u062F \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C" },
      { key: "program_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C" },
      { key: "degree", label: "\u0627\u0644\u062F\u0631\u062C\u0629 \u0627\u0644\u0639\u0644\u0645\u064A\u0629" },
      { key: "department", label: "\u0627\u0644\u0642\u0633\u0645" },
      { key: "duration", label: "\u0627\u0644\u0645\u062F\u0629 (\u0633\u0646\u0648\u0627\u062A)" },
      { key: "total_hours", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u0627\u0639\u0627\u062A" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { program_id: "CS-B", program_name: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633 \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", degree: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633", department: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", duration: "4", total_hours: "132", status: "\u0646\u0634\u0637" },
      { program_id: "IS-B", program_name: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633 \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", degree: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633", department: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", duration: "4", total_hours: "132", status: "\u0646\u0634\u0637" },
      { program_id: "AI-B", program_name: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A", degree: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633", department: "\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A", duration: "4", total_hours: "132", status: "\u0646\u0634\u0637" },
      { program_id: "IT-B", program_name: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633 \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", degree: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633", department: "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", duration: "4", total_hours: "132", status: "\u0646\u0634\u0637" },
      { program_id: "CS-M", program_name: "\u0645\u0627\u062C\u0633\u062A\u064A\u0631 \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", degree: "\u0645\u0627\u062C\u0633\u062A\u064A\u0631", department: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", duration: "2", total_hours: "36", status: "\u0646\u0634\u0637" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0628\u0631\u0646\u0627\u0645\u062C \u062C\u062F\u064A\u062F" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" },
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" }
    ]
  },
  "program_rules": {
    id: "program_rules",
    title: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0642\u0648\u0627\u0639\u062F \u0648\u0627\u0644\u0634\u0631\u0648\u0637 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643\u0644 \u0628\u0631\u0646\u0627\u0645\u062C \u062F\u0631\u0627\u0633\u064A",
    type: "table",
    columns: [
      { key: "rule_id", label: "\u0631\u0642\u0645 \u0627\u0644\u0642\u0627\u0639\u062F\u0629" },
      { key: "program", label: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C" },
      { key: "rule_type", label: "\u0646\u0648\u0639 \u0627\u0644\u0642\u0627\u0639\u062F\u0629" },
      { key: "description", label: "\u0627\u0644\u0648\u0635\u0641" },
      { key: "version", label: "\u0627\u0644\u0625\u0635\u062F\u0627\u0631" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { rule_id: "RUL-CS-001", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", rule_type: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062A\u062E\u0631\u062C", description: "\u064A\u062C\u0628 \u0625\u0643\u0645\u0627\u0644 132 \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629", version: "2.0", status: "\u0633\u0627\u0631\u064A" },
      { rule_id: "RUL-CS-002", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", rule_type: "\u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A", description: "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A 2.0", version: "2.0", status: "\u0633\u0627\u0631\u064A" },
      { rule_id: "RUL-IS-001", program: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", rule_type: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062A\u062E\u0631\u062C", description: "\u064A\u062C\u0628 \u0625\u0643\u0645\u0627\u0644 132 \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629", version: "1.5", status: "\u0633\u0627\u0631\u064A" },
      { rule_id: "RUL-AI-001", program: "\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A", rule_type: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0625\u062C\u0628\u0627\u0631\u064A\u0629", description: "\u064A\u062C\u0628 \u0627\u062C\u062A\u064A\u0627\u0632 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0625\u062C\u0628\u0627\u0631\u064A\u0629", version: "1.0", status: "\u0633\u0627\u0631\u064A" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0642\u0627\u0639\u062F\u0629 \u062C\u062F\u064A\u062F\u0629" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" },
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" }
    ]
  },
  "study_courses": {
    id: "study_courses",
    title: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
    description: "\u0642\u0627\u0626\u0645\u0629 \u0628\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0627\u0644\u0628\u0631\u0627\u0645\u062C \u0627\u0644\u0645\u062E\u062A\u0644\u0641\u0629",
    type: "table",
    columns: [
      { key: "course_code", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "program", label: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "hours", label: "\u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629" },
      { key: "type", label: "\u0627\u0644\u0646\u0648\u0639" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { course_code: "CS101", course_name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0628\u0631\u0645\u062C\u0629", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644", hours: 3, type: "\u0625\u062C\u0628\u0627\u0631\u064A", status: "\u0646\u0634\u0637" },
      { course_code: "CS102", course_name: "\u0645\u0628\u0627\u062F\u0626 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644", hours: 3, type: "\u0625\u062C\u0628\u0627\u0631\u064A", status: "\u0646\u0634\u0637" },
      { course_code: "CS201", course_name: "\u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A", hours: 3, type: "\u0625\u062C\u0628\u0627\u0631\u064A", status: "\u0646\u0634\u0637" },
      { course_code: "CS202", course_name: "\u0627\u0644\u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0627\u062A", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A", hours: 3, type: "\u0625\u062C\u0628\u0627\u0631\u064A", status: "\u0646\u0634\u0637" },
      { course_code: "IS301", course_name: "\u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0646\u0638\u0645", program: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B", hours: 3, type: "\u0625\u062C\u0628\u0627\u0631\u064A", status: "\u0646\u0634\u0637" },
      { course_code: "AI401", course_name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", program: "\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639", hours: 3, type: "\u0625\u062C\u0628\u0627\u0631\u064A", status: "\u0646\u0634\u0637" },
      { course_code: "CS301", course_name: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B", hours: 3, type: "\u0627\u062E\u062A\u064A\u0627\u0631\u064A", status: "\u0646\u0634\u0637" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u0631\u0631" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" },
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" }
    ]
  },
  "bylaw_courses": {
    id: "bylaw_courses",
    title: "\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0644\u0627\u0626\u062D\u0629",
    description: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u062D\u0633\u0628 \u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0627\u0644\u062F\u0627\u062E\u0644\u064A\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629",
    type: "table",
    columns: [
      { key: "bylaw_id", label: "\u0631\u0642\u0645 \u0627\u0644\u0644\u0627\u0626\u062D\u0629" },
      { key: "bylaw_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0644\u0627\u0626\u062D\u0629" },
      { key: "program", label: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C" },
      { key: "courses_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "version", label: "\u0627\u0644\u0625\u0635\u062F\u0627\u0631" },
      { key: "approval_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { bylaw_id: "BYL-FCAI-2020", bylaw_name: "\u0644\u0627\u0626\u062D\u0629 \u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A 2020", program: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u0631\u0627\u0645\u062C", courses_count: "45", version: "1.0", approval_date: "2020-09-01", status: "\u0633\u0627\u0631\u064A" },
      { bylaw_id: "BYL-CS-2022", bylaw_name: "\u0644\u0627\u0626\u062D\u0629 \u0628\u0631\u0646\u0627\u0645\u062C \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 2022", program: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", courses_count: "38", version: "2.1", approval_date: "2022-03-15", status: "\u0633\u0627\u0631\u064A" },
      { bylaw_id: "BYL-IS-2022", bylaw_name: "\u0644\u0627\u0626\u062D\u0629 \u0628\u0631\u0646\u0627\u0645\u062C \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A 2022", program: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", courses_count: "40", version: "2.0", approval_date: "2022-03-15", status: "\u0633\u0627\u0631\u064A" },
      { bylaw_id: "BYL-AI-2023", bylaw_name: "\u0644\u0627\u0626\u062D\u0629 \u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A 2023", program: "\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A", courses_count: "42", version: "1.0", approval_date: "2023-09-01", status: "\u0633\u0627\u0631\u064A" }
    ],
    actions: [
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // غلق المقررات - إدارة غلق وفتح المقررات حسب الفصل
  "course_close": {
    id: "course_close",
    title: "\u063A\u0644\u0642 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A",
    description: "\u0625\u062F\u0627\u0631\u0629 \u063A\u0644\u0642 \u0648\u0641\u062A\u062D \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u062D\u0633\u0628 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0648\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A",
    type: "table",
    columns: [
      { key: "course_code", label: "\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "course_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0631\u0631" },
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
      { key: "academic_year", label: "\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A" },
      { key: "closure_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u063A\u0644\u0642", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { id: "1", course_code: "CS101", course_name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0628\u0631\u0645\u062C\u0629", semester: "\u062E\u0631\u064A\u0641", academic_year: "2024-2025", closure_date: "2024-11-15", status: "\u0645\u063A\u0644\u0642" },
      { id: "2", course_code: "ENG101", course_name: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 1", semester: "\u062E\u0631\u064A\u0641", academic_year: "2024-2025", closure_date: "2024-11-15", status: "\u0645\u063A\u0644\u0642" },
      { id: "3", course_code: "CS202", course_name: "\u0627\u0644\u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0627\u062A", semester: "\u0631\u0628\u064A\u0639", academic_year: "2024-2025", closure_date: "2025-04-10", status: "\u0645\u0641\u062A\u0648\u062D" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u063A\u0644\u0642 \u0645\u0642\u0631\u0631" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // تعديل النظام - إعدادات النظام والباراميترات
  "sys_edit": {
    id: "sys_edit",
    title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0638\u0627\u0645",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645 \u0648\u0627\u0644\u0628\u0627\u0631\u0627\u0645\u064A\u062A\u0631\u0627\u062A (\u0641\u062A\u062D/\u063A\u0644\u0642 \u0627\u0644\u062A\u0633\u062C\u064A\u0644\u060C \u0627\u0644\u062A\u0648\u0627\u0631\u064A\u062E\u060C \u0627\u0644\u0642\u064A\u0645 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629)",
    type: "table",
    columns: [
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0625\u0639\u062F\u0627\u062F" },
      { key: "value", label: "\u0627\u0644\u0642\u064A\u0645\u0629" },
      { key: "description", label: "\u0627\u0644\u0648\u0635\u0641", type: "long_text" },
      { key: "category", label: "\u0627\u0644\u062A\u0635\u0646\u064A\u0641" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { id: "S1", name: "\u0641\u062A\u062D \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A", value: "\u0646\u0639\u0645", description: "\u064A\u0633\u0645\u062D \u0644\u0644\u0637\u0644\u0627\u0628 \u0628\u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0641\u064A \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0644\u0644\u0625\u0631\u0634\u0627\u062F \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A", category: "\u0623\u0643\u0627\u062F\u064A\u0645\u064A", status: "\u0646\u0634\u0637" },
      { id: "S2", name: "\u062A\u0627\u0631\u064A\u062E \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062A\u0633\u062C\u064A\u0644", value: "2024-10-31", description: "\u0622\u062E\u0631 \u0645\u0648\u0639\u062F \u0644\u0644\u0637\u0644\u0627\u0628 \u0644\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0628\u0643\u0631 \u0644\u0644\u0645\u0642\u0631\u0631\u0627\u062A", category: "\u0623\u0643\u0627\u062F\u064A\u0645\u064A", status: "\u0646\u0634\u0637" },
      { id: "S3", name: "\u063A\u0631\u0627\u0645\u0629 \u0627\u0644\u062A\u0623\u062E\u064A\u0631", value: "150 \u062C.\u0645", description: "\u0642\u064A\u0645\u0629 \u0627\u0644\u063A\u0631\u0627\u0645\u0629 \u0639\u0644\u0649 \u062A\u0623\u062E\u064A\u0631 \u062F\u0641\u0639 \u0627\u0644\u0631\u0633\u0648\u0645", category: "\u0645\u0627\u0644\u064A", status: "\u0646\u0634\u0637" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0625\u0639\u062F\u0627\u062F" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // تجهيز رسوم الطلاب
  "fees_setup": {
    id: "fees_setup",
    title: "\u062A\u062C\u0647\u064A\u0632 \u0631\u0633\u0648\u0645 \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u062A\u062C\u0647\u064A\u0632 \u0648\u0625\u0639\u062F\u0627\u062F \u0631\u0633\u0648\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u062D\u0633\u0628 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0648\u0646\u0648\u0639 \u0627\u0644\u0631\u0633\u0648\u0645",
    type: "table",
    columns: [
      { key: "semester", label: "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
      { key: "academic_year", label: "\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A" },
      { key: "fee_type", label: "\u0646\u0648\u0639 \u0627\u0644\u0631\u0633\u0648\u0645" },
      { key: "amount", label: "\u0627\u0644\u0645\u0628\u0644\u063A", type: "currency" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u062C\u0647\u064A\u0632", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u062A\u062C\u0647\u064A\u0632 \u0631\u0633\u0648\u0645" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // تحصيل رسوم طالب
  "fees_collect": {
    id: "fees_collect",
    title: "\u062A\u062D\u0635\u064A\u0644 \u0631\u0633\u0648\u0645 \u0637\u0627\u0644\u0628",
    description: "\u062A\u0633\u062C\u064A\u0644 \u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u0631\u0633\u0648\u0645 \u0645\u0646 \u0627\u0644\u0637\u0644\u0627\u0628 \u0645\u0639 \u0631\u0642\u0645 \u0627\u0644\u0625\u064A\u0635\u0627\u0644 \u0648\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "student_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "amount_due", label: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0637\u0644\u0648\u0628", type: "currency" },
      { key: "amount_paid", label: "\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0635\u0644", type: "currency" },
      { key: "payment_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u062D\u0635\u064A\u0644", type: "date" },
      { key: "receipt_no", label: "\u0631\u0642\u0645 \u0627\u0644\u0625\u064A\u0635\u0627\u0644" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u062A\u062D\u0635\u064A\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // إذن دفع
  "payment_perm": {
    id: "payment_perm",
    title: "\u0625\u0630\u0646 \u062F\u0641\u0639",
    description: "\u0625\u0635\u062F\u0627\u0631 \u0648\u0625\u062F\u0627\u0631\u0629 \u0623\u0630\u0648\u0646\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0644\u0644\u0637\u0644\u0627\u0628",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "student_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "amount", label: "\u0627\u0644\u0645\u0628\u0644\u063A", type: "currency" },
      { key: "purpose", label: "\u0627\u0644\u063A\u0631\u0636", type: "long_text" },
      { key: "request_date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0625\u0630\u0646 \u062F\u0641\u0639" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629 \u0625\u0630\u0646 \u062F\u0641\u0639" }
    ]
  },
  // اضافة عام تخرج للطلاب
  "grad_year": {
    id: "grad_year",
    title: "\u0627\u0636\u0627\u0641\u0629 \u0639\u0627\u0645 \u062A\u062E\u0631\u062C \u0644\u0644\u0637\u0644\u0627\u0628",
    description: "\u0625\u0636\u0627\u0641\u0629 \u0623\u0648 \u062A\u0639\u062F\u064A\u0644 \u0639\u0627\u0645 \u0627\u0644\u062A\u062E\u0631\u062C \u0644\u0644\u0637\u0644\u0627\u0628 \u0645\u0639 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062D\u0627\u0644\u0629",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "student_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "graduation_year", label: "\u0639\u0627\u0645 \u0627\u0644\u062A\u062E\u0631\u062C" },
      { key: "date", label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0625\u0636\u0627\u0641\u0629", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0639\u0627\u0645 \u062A\u062E\u0631\u062C" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // تعديل مستويات الطلاب
  "level_mod": {
    id: "level_mod",
    title: "\u062A\u0639\u062F\u064A\u0644 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0644\u0644\u0637\u0644\u0627\u0628 \u0645\u0639 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u0628\u0628 \u0648\u0627\u0644\u062D\u0627\u0644\u0629",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "student_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "old_level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0633\u0627\u0628\u0642" },
      { key: "new_level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062C\u062F\u064A\u062F" },
      { key: "reason", label: "\u0633\u0628\u0628 \u0627\u0644\u062A\u0639\u062F\u064A\u0644", type: "long_text" },
      { key: "date", label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0639\u062F\u064A\u0644 \u0645\u0633\u062A\u0648\u0649" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // تعديل المعدل التراكمي
  "gpa_mod": {
    id: "gpa_mod",
    title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A",
    description: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A \u0644\u0644\u0637\u0644\u0627\u0628 \u0645\u0639 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u0628\u0628 \u0648\u0627\u0644\u062D\u0627\u0644\u0629",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "student_name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "old_gpa", label: "\u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u0633\u0627\u0628\u0642" },
      { key: "new_gpa", label: "\u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062C\u062F\u064A\u062F" },
      { key: "reason", label: "\u0633\u0628\u0628 \u0627\u0644\u062A\u0639\u062F\u064A\u0644", type: "long_text" },
      { key: "date", label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0639\u062F\u064A\u0644 \u0645\u0639\u062F\u0644" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // لوحة المعلومات - إعلانات ورسائل للطلاب
  "info_board": {
    id: "info_board",
    title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
    description: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0634\u0624\u0648\u0646 \u0637\u0644\u0627\u0628 \u062C\u0627\u0645\u0639\u0629 \u062F\u0645\u064A\u0627\u0637 \u2014 \u0625\u0636\u0627\u0641\u0629 \u0648\u0639\u0631\u0636 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644",
    type: "table",
    columns: [
      { key: "msg", label: "\u0627\u0644\u0631\u0633\u0627\u0644\u0629", type: "long_text" },
      { key: "date", label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0625\u0639\u0644\u0627\u0646" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // Fallback
  "default": {
    id: "default",
    title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
    description: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0634\u0624\u0648\u0646 \u0637\u0644\u0627\u0628 \u062C\u0627\u0645\u0639\u0629 \u062F\u0645\u064A\u0627\u0637",
    type: "table",
    columns: [
      { key: "msg", label: "\u0627\u0644\u0631\u0633\u0627\u0644\u0629", type: "long_text" },
      { key: "date", label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", type: "date" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u0625\u0639\u0644\u0627\u0646" },
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631" },
      { type: "print", label: "\u0637\u0628\u0627\u0639\u0629" }
    ]
  },
  // ==================================================================================
  // STUDENT DATA MANAGEMENT
  // ==================================================================================
  "student_data_management": {
    id: "student_data_management",
    title: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0648\u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0648\u0627\u0644\u062A\u062C\u0646\u064A\u062F",
    type: "student_data",
    columns: [],
    data: [],
    actions: []
  },
  // ==================================================================================
  // DEPARTMENTS (SPECIALIZATIONS) PAGES
  // ==================================================================================
  "view_departments": {
    id: "view_departments",
    title: "\u0639\u0631\u0636 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A",
    description: "\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
    type: "table",
    columns: [
      { key: "code", label: "\u0631\u0645\u0632 \u0627\u0644\u062A\u062E\u0635\u0635" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u062A\u062E\u0635\u0635" },
      { key: "students_count", label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628" },
      { key: "programs_count", label: "\u0639\u062F\u062F \u0627\u0644\u0628\u0631\u0627\u0645\u062C" },
      { key: "courses_count", label: "\u0639\u062F\u062F \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { code: "CS", name: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 (CS)", students_count: 400, programs_count: 2, courses_count: 15, status: "\u0646\u0634\u0637" },
      { code: "IS", name: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IS)", students_count: 350, programs_count: 2, courses_count: 12, status: "\u0646\u0634\u0637" },
      { code: "AI", name: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A (AI)", students_count: 300, programs_count: 1, courses_count: 10, status: "\u0646\u0634\u0637" },
      { code: "IT", name: "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IT)", students_count: 280, programs_count: 1, courses_count: 10, status: "\u0646\u0634\u0637" },
      { code: "MI", name: "\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u064A\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 (MI)", students_count: 200, programs_count: 1, courses_count: 8, status: "\u0646\u0634\u0637" },
      { code: "SEC", name: "\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A (SEC)", students_count: 250, programs_count: 1, courses_count: 9, status: "\u0646\u0634\u0637" }
    ],
    actions: [
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" }
    ]
  },
  "manage_departments": {
    id: "manage_departments",
    title: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0648\u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0641\u064A \u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A \u0648\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
    type: "table",
    columns: [
      { key: "code", label: "\u0631\u0645\u0632 \u0627\u0644\u062A\u062E\u0635\u0635" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u062A\u062E\u0635\u0635" },
      { key: "head_name", label: "\u0631\u0626\u064A\u0633 \u0627\u0644\u0642\u0633\u0645" },
      { key: "students_count", label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628" },
      { key: "status", label: "\u0627\u0644\u062D\u0627\u0644\u0629", type: "status" }
    ],
    data: [
      { code: "CS", name: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 (CS)", head_name: "\u062F. \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F \u0627\u0644\u0633\u064A\u062F", students_count: 400, status: "\u0646\u0634\u0637" },
      { code: "IS", name: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IS)", head_name: "\u062F. \u0645\u0646\u0627\u0644 \u062D\u0633\u0646 \u0625\u0628\u0631\u0627\u0647\u064A\u0645", students_count: 350, status: "\u0646\u0634\u0637" },
      { code: "AI", name: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A (AI)", head_name: "\u062F. \u062E\u0627\u0644\u062F \u0645\u062D\u0645\u0648\u062F \u0639\u0644\u064A", students_count: 300, status: "\u0646\u0634\u0637" },
      { code: "IT", name: "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IT)", head_name: "\u062F. \u0633\u0627\u0631\u0629 \u0623\u062D\u0645\u062F \u0641\u0624\u0627\u062F", students_count: 280, status: "\u0646\u0634\u0637" },
      { code: "MI", name: "\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u064A\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 (MI)", head_name: "\u062F. \u0645\u062D\u0645\u062F \u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0646\u0635\u0631", students_count: 200, status: "\u0646\u0634\u0637" },
      { code: "SEC", name: "\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A (SEC)", head_name: "\u0623.\u062F. \u0641\u0627\u0637\u0645\u0629 \u0639\u0644\u064A \u062D\u0633\u0646", students_count: 250, status: "\u0646\u0634\u0637" }
    ],
    actions: [
      { type: "add", label: "\u0625\u0636\u0627\u0641\u0629 \u062A\u062E\u0635\u0635 \u062C\u062F\u064A\u062F" },
      { type: "edit", label: "\u062A\u0639\u062F\u064A\u0644" },
      { type: "delete", label: "\u062D\u0630\u0641" }
    ]
  },
  "department_students": {
    id: "department_students",
    title: "\u0637\u0644\u0627\u0628 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A",
    description: "\u0639\u0631\u0636 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628 \u062D\u0633\u0628 \u0627\u0644\u062A\u062E\u0635\u0635",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "department", label: "\u0627\u0644\u062A\u062E\u0635\u0635" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: (() => {
      const deptStudents = [];
      DEPARTMENTS_FCAI.filter((d) => d !== "\u0639\u0627\u0645").forEach((dept) => {
        const students = ALL_STUDENTS.filter((s) => s.department === dept).slice(0, 5);
        deptStudents.push(...students);
      });
      return deptStudents;
    })(),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0641\u0644\u062A\u0631\u0629" }
    ]
  },
  "department_statistics": {
    id: "department_statistics",
    title: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A",
    description: "\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0634\u0627\u0645\u0644\u0629 \u0639\u0646 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0648\u0627\u0644\u0637\u0644\u0627\u0628",
    type: "table",
    columns: [
      { key: "department", label: "\u0627\u0644\u062A\u062E\u0635\u0635" },
      { key: "total_students", label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0627\u0628" },
      { key: "level_1", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644" },
      { key: "level_2", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A" },
      { key: "level_3", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B" },
      { key: "level_4", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639" },
      { key: "avg_gpa", label: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0645\u0639\u062F\u0644" }
    ],
    data: [
      { department: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 (CS)", total_students: 400, level_1: 100, level_2: 100, level_3: 100, level_4: 100, avg_gpa: "3.2" },
      { department: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IS)", total_students: 350, level_1: 88, level_2: 88, level_3: 87, level_4: 87, avg_gpa: "3.1" },
      { department: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A (AI)", total_students: 300, level_1: 75, level_2: 75, level_3: 75, level_4: 75, avg_gpa: "3.3" },
      { department: "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IT)", total_students: 280, level_1: 70, level_2: 70, level_3: 70, level_4: 70, avg_gpa: "3.0" },
      { department: "\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u064A\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 (MI)", total_students: 200, level_1: 50, level_2: 50, level_3: 50, level_4: 50, avg_gpa: "3.2" },
      { department: "\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A (SEC)", total_students: 250, level_1: 63, level_2: 63, level_3: 62, level_4: 62, avg_gpa: "3.4" }
    ],
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0639\u0631\u0636 \u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u064A\u0629" }
    ]
  },
  "cs_department": {
    id: "cs_department",
    title: "\u0642\u0633\u0645 \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 (CS)",
    description: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0642\u0633\u0645 \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A\u0647",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: ALL_STUDENTS.filter((s) => s.department === "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628 (CS)").slice(0, 50),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0641\u0644\u062A\u0631\u0629" }
    ]
  },
  "is_department": {
    id: "is_department",
    title: "\u0642\u0633\u0645 \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IS)",
    description: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0642\u0633\u0645 \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A\u0647",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: ALL_STUDENTS.filter((s) => s.department === "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IS)").slice(0, 50),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0641\u0644\u062A\u0631\u0629" }
    ]
  },
  "ai_department": {
    id: "ai_department",
    title: "\u0642\u0633\u0645 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A (AI)",
    description: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0642\u0633\u0645 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A\u0647",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: ALL_STUDENTS.filter((s) => s.department === "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A (AI)").slice(0, 50),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0641\u0644\u062A\u0631\u0629" }
    ]
  },
  "it_department": {
    id: "it_department",
    title: "\u0642\u0633\u0645 \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IT)",
    description: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0642\u0633\u0645 \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A\u0647",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: ALL_STUDENTS.filter((s) => s.department === "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A (IT)").slice(0, 50),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0641\u0644\u062A\u0631\u0629" }
    ]
  },
  "mi_department": {
    id: "mi_department",
    title: "\u0642\u0633\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u064A\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 (MI)",
    description: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0642\u0633\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u064A\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A\u0647",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: ALL_STUDENTS.filter((s) => s.department === "\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u064A\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 (MI)").slice(0, 50),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0641\u0644\u062A\u0631\u0629" }
    ]
  },
  "sec_department": {
    id: "sec_department",
    title: "\u0642\u0633\u0645 \u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A (SEC)",
    description: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0642\u0633\u0645 \u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A \u0648\u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A\u0647",
    type: "table",
    columns: [
      { key: "student_id", label: "\u0643\u0648\u062F \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "name", label: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628" },
      { key: "level", label: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649" },
      { key: "gpa", label: "GPA" },
      { key: "status", label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0642\u064A\u062F", type: "status" }
    ],
    data: ALL_STUDENTS.filter((s) => s.department === "\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A (SEC)").slice(0, 50),
    actions: [
      { type: "export", label: "\u062A\u0635\u062F\u064A\u0631 Excel" },
      { type: "view", label: "\u0641\u0644\u062A\u0631\u0629" }
    ]
  }
};
var getPageConfig = (id, facultyId) => {
  const config = MOCK_DATABASE[id];
  if (!config) return { ...MOCK_DATABASE["default"], id };
  let finalData = config.data;
  if (typeof config.data === "function") {
    finalData = config.data();
  }
  if (id === "fees_setup") {
    finalData = getDynamicFeesSetup(facultyId);
    return {
      ...config,
      data: finalData,
      description: `\u062A\u062C\u0647\u064A\u0632 \u0631\u0633\u0648\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u2014 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u062D\u0633\u0628 \u0627\u0644\u0633\u0646\u0629 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0648\u0627\u0644\u0645\u0633\u062A\u0648\u0649${facultyId === "FCAI" ? " (\u0643\u0644\u064A\u0629 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A)" : ""}`
    };
  }
  if (id === "fees_collect") {
    finalData = getDynamicFeesCollect(facultyId);
    return {
      ...config,
      data: finalData,
      description: `\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u0631\u0633\u0648\u0645 \u2014 \u0645\u064F\u062D\u0645\u0651\u0644 \u0645\u0646 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0648\u0627\u0644\u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0645\u0627\u0644\u064A\u0629 (${finalData.length} \u0637\u0627\u0644\u0628)`
    };
  }
  if (id === "payment_perm") {
    finalData = getDynamicPaymentPerm(facultyId);
    return {
      ...config,
      data: finalData,
      description: `\u0625\u0630\u0646 \u0627\u0644\u062F\u0641\u0639 \u2014 \u0637\u0644\u0627\u0628 \u0644\u062F\u064A\u0647\u0645 \u0645\u0633\u062A\u062D\u0642\u0627\u062A (${finalData.length} \u0625\u0630\u0646)`
    };
  }
  if ((id === "view_departments" || id === "manage_departments" || id === "program_data" || id === "program_rules" || id === "study_courses" || id === "bylaw_courses" || id === "equivalent_courses" || id === "course_schedules" || id === "student_personal_schedules" || id === "room_utilization" || id === "instructor_workload" || id === "assign_room" || id === "instructor_assignments") && facultyId) {
    let academicRules = getAcademicRulesByFaculty(facultyId);
    if (!academicRules) {
      const defaultFaculty = FACULTIES.find((f) => f.id === facultyId);
      if (defaultFaculty) {
        academicRules = createDefaultAcademicRules(facultyId, defaultFaculty.name);
        saveAcademicRules(academicRules);
      }
    }
    if (academicRules?.studySystem?.graduationRequirementsDetails?.majorRequirements?.programs) {
      const programs = academicRules.studySystem.graduationRequirementsDetails.majorRequirements.programs;
      const programsList = Object.keys(programs).filter((key) => programs[key]);
      if (id === "view_departments") {
        const departmentsData = programsList.map((programCode) => {
          const programData = programs[programCode];
          const mandatoryCount = programData.mandatory?.length || 0;
          const electiveCount = programData.elective?.length || 0;
          const totalCourses = mandatoryCount + electiveCount;
          const deptName = programData.name;
          const studentsCount = ALL_STUDENTS.filter((s) => s.department === deptName).length;
          return {
            code: programCode,
            name: deptName,
            students_count: studentsCount,
            programs_count: 1,
            courses_count: totalCourses,
            status: "\u0646\u0634\u0637"
          };
        });
        return {
          ...config,
          data: departmentsData,
          description: `\u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u064A ${academicRules.facultyName || "\u0627\u0644\u0643\u0644\u064A\u0629"}`
        };
      } else if (id === "manage_departments") {
        const departmentsData = programsList.map((programCode) => {
          const programData = programs[programCode];
          const deptName = programData.name;
          const studentsCount = ALL_STUDENTS.filter((s) => s.department === deptName).length;
          return {
            code: programCode,
            name: deptName,
            head_name: "\u0642\u064A\u062F \u0627\u0644\u062A\u0639\u064A\u064A\u0646",
            // Default value, can be updated later
            students_count: studentsCount,
            status: "\u0646\u0634\u0637"
          };
        });
        return {
          ...config,
          data: departmentsData,
          description: `\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062A\u062E\u0635\u0635\u0627\u062A \u0648\u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0641\u064A ${academicRules.facultyName || "\u0627\u0644\u0643\u0644\u064A\u0629"}`
        };
      } else if (id === "program_data") {
        const programsData = programsList.map((programCode) => {
          const programData = programs[programCode];
          const mandatoryCount = programData.mandatory?.length || 0;
          const electiveCount = programData.elective?.length || 0;
          const totalCourses = mandatoryCount + electiveCount;
          const mandatoryHours = (programData.mandatory || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0);
          const electiveHours = (programData.elective || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0);
          return {
            program_id: `${programCode}-B`,
            program_name: `\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633 ${programData.name}`,
            degree: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633",
            department: programData.name,
            duration: "4",
            total_hours: "140",
            status: "\u0646\u0634\u0637"
          };
        });
        return {
          ...config,
          data: programsData,
          description: `\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0628\u0631\u0627\u0645\u062C \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0641\u064A ${academicRules.facultyName || "\u0627\u0644\u0643\u0644\u064A\u0629"} (${programsData.length} \u0628\u0631\u0646\u0627\u0645\u062C)`
        };
      } else if (id === "program_rules") {
        const rulesData = [];
        const gradReqs = academicRules.studySystem.graduationRequirements;
        const levelProg = academicRules.studySystem.levelProgression;
        const retake = academicRules.studySystem.retake;
        const programChange = academicRules.studySystem.programChange;
        programsList.forEach((programCode) => {
          const programData = programs[programCode];
          const mandatoryCount = programData.mandatory?.length || 0;
          const electiveHours = academicRules.studySystem.graduationRequirementsDetails.majorRequirements.electiveHours;
          rulesData.push({
            rule_id: `RUL-${programCode}-001`,
            program: programData.name,
            rule_type: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062A\u062E\u0631\u062C",
            description: `\u064A\u062C\u0628 \u0625\u0643\u0645\u0627\u0644 ${gradReqs.totalCreditHours} \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629`,
            version: "2.0",
            status: "\u0633\u0627\u0631\u064A"
          });
          rulesData.push({
            rule_id: `RUL-${programCode}-002`,
            program: programData.name,
            rule_type: "\u0627\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A",
            description: `\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A ${gradReqs.minimumGPA}`,
            version: "2.0",
            status: "\u0633\u0627\u0631\u064A"
          });
          rulesData.push({
            rule_id: `RUL-${programCode}-003`,
            program: programData.name,
            rule_type: "\u0645\u062F\u0629 \u0627\u0644\u062F\u0631\u0627\u0633\u0629",
            description: `\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0645\u062F\u0629 \u0627\u0644\u062F\u0631\u0627\u0633\u0629 ${gradReqs.minimumYears} \u0633\u0646\u0648\u0627\u062A`,
            version: "2.0",
            status: "\u0633\u0627\u0631\u064A"
          });
          rulesData.push({
            rule_id: `RUL-${programCode}-004`,
            program: programData.name,
            rule_type: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0625\u062C\u0628\u0627\u0631\u064A\u0629",
            description: `\u064A\u062C\u0628 \u0627\u062C\u062A\u064A\u0627\u0632 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0625\u062C\u0628\u0627\u0631\u064A\u0629 (${mandatoryCount} \u0645\u0642\u0631\u0631)`,
            version: "2.0",
            status: "\u0633\u0627\u0631\u064A"
          });
          rulesData.push({
            rule_id: `RUL-${programCode}-005`,
            program: programData.name,
            rule_type: "\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631\u064A\u0629",
            description: `\u064A\u062C\u0628 \u0627\u062E\u062A\u064A\u0627\u0631 ${electiveHours} \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 \u0645\u0646 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631\u064A\u0629`,
            version: "2.0",
            status: "\u0633\u0627\u0631\u064A"
          });
          if (levelProg) {
            rulesData.push({
              rule_id: `RUL-${programCode}-006`,
              program: programData.name,
              rule_type: "\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u064A\u0646 \u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A",
              description: `\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644: ${levelProg.level1?.maxCreditHours || 0} \u0633\u0627\u0639\u0629\u060C \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A: ${levelProg.level2?.requiredCreditHours || 0} \u0633\u0627\u0639\u0629\u060C \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B: ${levelProg.level3?.requiredCreditHours || 0} \u0633\u0627\u0639\u0629`,
              version: "2.0",
              status: "\u0633\u0627\u0631\u064A"
            });
          }
          if (retake?.failedCourse?.enabled) {
            rulesData.push({
              rule_id: `RUL-${programCode}-007`,
              program: programData.name,
              rule_type: "\u0627\u0644\u0631\u0633\u0648\u0628 \u0648\u0627\u0644\u0625\u0639\u0627\u062F\u0629",
              description: `\u064A\u0645\u0643\u0646 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u0642\u0631\u0631 \u0627\u0644\u0631\u0627\u0633\u0628\u060C \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u062F\u0631\u062C\u0629 \u0628\u0639\u062F \u0627\u0644\u0625\u0639\u0627\u062F\u0629: ${retake.failedCourse.maxGradeAfterRetake}`,
              version: "2.0",
              status: "\u0633\u0627\u0631\u064A"
            });
          }
          if (programChange?.enabled) {
            rulesData.push({
              rule_id: `RUL-${programCode}-008`,
              program: programData.name,
              rule_type: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0633\u0627\u0631",
              description: `\u064A\u0645\u0643\u0646 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0633\u0627\u0631 \u0641\u064A \u0627\u0644\u0645\u0633\u062A\u0648\u0649 ${programChange.allowedLevel} \u0628\u0639\u062F \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0645\u0631\u0634\u062F \u0648\u0627\u0644\u0642\u0633\u0645 \u0648\u0627\u0644\u0644\u062C\u0646\u0629`,
              version: "2.0",
              status: "\u0633\u0627\u0631\u064A"
            });
          }
        });
        return {
          ...config,
          data: rulesData,
          description: `\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u0631\u0627\u0645\u062C \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0641\u064A ${academicRules.facultyName || "\u0627\u0644\u0643\u0644\u064A\u0629"} (${rulesData.length} \u0642\u0627\u0639\u062F\u0629)`
        };
      } else if (id === "equivalent_courses") {
        const equivalentCoursesData = [];
        const allCourses = /* @__PURE__ */ new Map();
        programsList.forEach((programCode) => {
          const programData = programs[programCode];
          (programData.mandatory || []).forEach((course) => {
            if (course && course.code) {
              if (!allCourses.has(course.code)) {
                allCourses.set(course.code, {
                  code: course.code,
                  name: course.name,
                  programs: []
                });
              }
              const courseInfo = allCourses.get(course.code);
              if (!courseInfo.programs.includes(programData.name)) {
                courseInfo.programs.push(programData.name);
              }
            }
          });
          (programData.elective || []).forEach((course) => {
            if (course && course.code) {
              if (!allCourses.has(course.code)) {
                allCourses.set(course.code, {
                  code: course.code,
                  name: course.name,
                  programs: []
                });
              }
              const courseInfo = allCourses.get(course.code);
              if (!courseInfo.programs.includes(programData.name)) {
                courseInfo.programs.push(programData.name);
              }
            }
          });
        });
        allCourses.forEach((courseInfo, courseCode) => {
          if (courseInfo.programs.length > 1) {
            for (let i = 0; i < courseInfo.programs.length; i++) {
              for (let j = i + 1; j < courseInfo.programs.length; j++) {
                equivalentCoursesData.push({
                  course_code: courseCode,
                  course_name: courseInfo.name,
                  program: courseInfo.programs[i],
                  equivalent_course: courseCode,
                  equivalent_program: courseInfo.programs[j],
                  status: "\u0645\u0639\u062A\u0645\u062F"
                });
                equivalentCoursesData.push({
                  course_code: courseCode,
                  course_name: courseInfo.name,
                  program: courseInfo.programs[j],
                  equivalent_course: courseCode,
                  equivalent_program: courseInfo.programs[i],
                  status: "\u0645\u0639\u062A\u0645\u062F"
                });
              }
            }
          }
        });
        return {
          ...config,
          data: equivalentCoursesData,
          description: `\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0627\u0638\u0631\u0629 \u0644\u0644\u0645\u0648\u0627\u0632\u0646\u0629 \u0641\u064A ${academicRules.facultyName || "\u0627\u0644\u0643\u0644\u064A\u0629"} (${equivalentCoursesData.length} \u0645\u0642\u0631\u0631 \u0645\u0646\u0627\u0638\u0631)`
        };
      } else if (id === "course_schedules" || id === "student_personal_schedules" || id === "room_utilization" || id === "instructor_workload" || id === "assign_room" || id === "instructor_assignments") {
        const days = ["\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0625\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633"];
        const timeSlots = [
          "08:00 - 10:00",
          "10:00 - 12:00",
          "12:00 - 14:00",
          "14:00 - 16:00",
          "16:00 - 18:00"
        ];
        const rooms = [
          // المدرجات (Lecture Halls)
          "\u0645\u062F\u0631\u062C 101 B",
          "\u0645\u062F\u0631\u062C 102 B",
          "\u0645\u062F\u0631\u062C 103 B",
          "\u0645\u062F\u0631\u062C 104 B",
          "\u0645\u062F\u0631\u062C 105 B",
          // القاعات (Classrooms)
          "\u0642\u0627\u0639\u0629 309 B",
          "\u0642\u0627\u0639\u0629 310 B",
          // المعامل - الدور الثاني (Labs - 2nd Floor)
          "\u0645\u0639\u0645\u0644 201",
          "\u0645\u0639\u0645\u0644 202",
          "\u0645\u0639\u0645\u0644 203",
          "\u0645\u0639\u0645\u0644 204",
          "\u0645\u0639\u0645\u0644 205",
          "\u0645\u0639\u0645\u0644 206",
          "\u0645\u0639\u0645\u0644 207",
          "\u0645\u0639\u0645\u0644 208",
          "\u0645\u0639\u0645\u0644 209",
          "\u0645\u0639\u0645\u0644 210",
          "\u0645\u0639\u0645\u0644 211",
          "\u0645\u0639\u0645\u0644 212",
          // المعامل - الدور الرابع (Labs - 4th Floor)
          "\u0645\u0639\u0645\u0644 401",
          "\u0645\u0639\u0645\u0644 402",
          "\u0645\u0639\u0645\u0644 403",
          "\u0645\u0639\u0645\u0644 407",
          "\u0645\u0639\u0645\u0644 408",
          "\u0645\u0639\u0645\u0644 409",
          "\u0645\u0639\u0645\u0644 410",
          "\u0645\u0639\u0645\u0644 411",
          "\u0645\u0639\u0645\u0644 412",
          "\u0645\u0639\u0645\u0644 413",
          "\u0645\u0639\u0645\u0644 414"
        ];
        const roomCapacities = {
          "\u0645\u062F\u0631\u062C 101 B": 150,
          "\u0645\u062F\u0631\u062C 102 B": 150,
          "\u0645\u062F\u0631\u062C 103 B": 150,
          "\u0645\u062F\u0631\u062C 104 B": 250,
          "\u0645\u062F\u0631\u062C 105 B": 250,
          "\u0642\u0627\u0639\u0629 309 B": 60,
          "\u0642\u0627\u0639\u0629 310 B": 60,
          "\u0645\u0639\u0645\u0644 201": 35,
          "\u0645\u0639\u0645\u0644 202": 5,
          "\u0645\u0639\u0645\u0644 203": 25,
          "\u0645\u0639\u0645\u0644 204": 25,
          "\u0645\u0639\u0645\u0644 205": 25,
          "\u0645\u0639\u0645\u0644 206": 35,
          "\u0645\u0639\u0645\u0644 207": 35,
          "\u0645\u0639\u0645\u0644 208": 23,
          "\u0645\u0639\u0645\u0644 209": 23,
          "\u0645\u0639\u0645\u0644 210": 25,
          "\u0645\u0639\u0645\u0644 211": 25,
          "\u0645\u0639\u0645\u0644 212": 35,
          "\u0645\u0639\u0645\u0644 401": 25,
          "\u0645\u0639\u0645\u0644 402": 25,
          "\u0645\u0639\u0645\u0644 403": 23,
          "\u0645\u0639\u0645\u0644 407": 35,
          "\u0645\u0639\u0645\u0644 408": 0,
          // في مرحلة التوريد
          "\u0645\u0639\u0645\u0644 409": 0,
          // في مرحلة التوريد
          "\u0645\u0639\u0645\u0644 410": 0,
          // في مرحلة التوريد
          "\u0645\u0639\u0645\u0644 411": 0,
          // في مرحلة التوريد
          "\u0645\u0639\u0645\u0644 412": 0,
          // في مرحلة التوريد
          "\u0645\u0639\u0645\u0644 413": 25,
          "\u0645\u0639\u0645\u0644 414": 12
        };
        const roomTypes = {
          "\u0645\u062F\u0631\u062C 101 B": "\u0645\u062F\u0631\u062C",
          "\u0645\u062F\u0631\u062C 102 B": "\u0645\u062F\u0631\u062C",
          "\u0645\u062F\u0631\u062C 103 B": "\u0645\u062F\u0631\u062C",
          "\u0645\u062F\u0631\u062C 104 B": "\u0645\u062F\u0631\u062C",
          "\u0645\u062F\u0631\u062C 105 B": "\u0645\u062F\u0631\u062C",
          "\u0642\u0627\u0639\u0629 309 B": "\u0642\u0627\u0639\u0629",
          "\u0642\u0627\u0639\u0629 310 B": "\u0642\u0627\u0639\u0629",
          "\u0645\u0639\u0645\u0644 201": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 202": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 203": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 204": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 205": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 206": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 207": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 208": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 209": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 210": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 211": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 212": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 401": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 402": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 403": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 407": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 408": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 409": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 410": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 411": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 412": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 413": "\u0645\u0639\u0645\u0644",
          "\u0645\u0639\u0645\u0644 414": "\u0645\u0639\u0645\u0644"
        };
        const instructors = [
          "\u062F. \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F \u0627\u0644\u0633\u064A\u062F",
          "\u062F. \u0645\u0646\u0627\u0644 \u062D\u0633\u0646 \u0625\u0628\u0631\u0627\u0647\u064A\u0645",
          "\u062F. \u062E\u0627\u0644\u062F \u0645\u062D\u0645\u0648\u062F \u0639\u0644\u064A",
          "\u062F. \u0633\u0627\u0631\u0629 \u0623\u062D\u0645\u062F \u0641\u0624\u0627\u062F",
          "\u062F. \u0645\u062D\u0645\u062F \u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0646\u0635\u0631",
          "\u0623.\u062F. \u0641\u0627\u0637\u0645\u0629 \u0639\u0644\u064A \u062D\u0633\u0646",
          "\u062F. \u064A\u0648\u0633\u0641 \u0633\u0639\u064A\u062F \u0643\u0627\u0645\u0644",
          "\u062F. \u0646\u0648\u0631\u0627 \u0645\u062D\u0645\u0648\u062F \u062C\u0645\u0627\u0644"
        ];
        const allCoursesFromRules = [];
        programsList.forEach((programCode) => {
          const programData = programs[programCode];
          (programData.mandatory || []).forEach((course) => {
            if (course && course.code && course.name) {
              allCoursesFromRules.push({
                id: course.code,
                name: course.name,
                program: programData.name,
                department: programData.name,
                level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B",
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2)
              });
            }
          });
          (programData.elective || []).forEach((course) => {
            if (course && course.code && course.name) {
              allCoursesFromRules.push({
                id: course.code,
                name: course.name,
                program: programData.name,
                department: programData.name,
                level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B",
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2)
              });
            }
          });
        });
        const schedulesData = [];
        allCoursesFromRules.forEach((course) => {
          const sessionsCount = course.hours >= 4 ? 3 : 2;
          for (let i = 0; i < sessionsCount; i++) {
            const day = days[Math.floor(Math.random() * days.length)];
            const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            const room = rooms[Math.floor(Math.random() * rooms.length)];
            const instructor = instructors[Math.floor(Math.random() * instructors.length)];
            const sessionType = i === 0 ? "\u0645\u062D\u0627\u0636\u0631\u0629" : i === 1 ? "\u0633\u0643\u0634\u0646" : "\u0645\u0639\u0645\u0644";
            schedulesData.push({
              course_id: course.id,
              course_name: course.name,
              session_type: sessionType,
              day,
              time,
              room,
              instructor,
              level: course.level,
              department: course.department,
              capacity: Math.floor(Math.random() * 50) + 30
            });
          }
        });
        if (id === "course_schedules") {
          return {
            ...config,
            data: schedulesData,
            description: `\u062C\u062F\u0627\u0648\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0645\u0639 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0648\u0627\u0639\u064A\u062F \u0648\u0627\u0644\u0642\u0627\u0639\u0627\u062A (${schedulesData.length} \u062C\u0644\u0633\u0629 \u062F\u0631\u0627\u0633\u064A\u0629)`
          };
        } else if (id === "student_personal_schedules") {
          const studentSchedulesData = [];
          STUDENT_ENROLLMENTS.slice(0, 100).forEach((enrollment) => {
            if (enrollment.status === "\u0645\u0633\u062C\u0644") {
              const courseSchedules = schedulesData.filter((s) => s.course_id === enrollment.course_id);
              courseSchedules.forEach((schedule) => {
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
            data: studentSchedulesData.slice(0, 1e3),
            description: `\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 (${studentSchedulesData.length} \u062C\u062F\u0648\u0644 \u0634\u062E\u0635\u064A)`
          };
        } else if (id === "room_utilization") {
          const roomStats = [];
          const uniqueRooms = [...new Set(schedulesData.map((s) => s.room))];
          uniqueRooms.forEach((room) => {
            const roomSessions = schedulesData.filter((s) => s.room === room);
            const totalSlots = 5 * 5;
            const utilizationRate = (roomSessions.length / totalSlots * 100).toFixed(1) + "%";
            const dayCount = {};
            roomSessions.forEach((s) => {
              dayCount[s.day] = (dayCount[s.day] || 0) + 1;
            });
            const peakDay = Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, "");
            const timeCount = {};
            roomSessions.forEach((s) => {
              timeCount[s.time] = (timeCount[s.time] || 0) + 1;
            });
            const peakTime = Object.keys(timeCount).reduce((a, b) => timeCount[a] > timeCount[b] ? a : b, "");
            roomStats.push({
              room,
              total_sessions: roomSessions.length,
              utilization_rate: utilizationRate,
              peak_day: peakDay,
              peak_time: peakTime
            });
          });
          return {
            ...config,
            data: roomStats.sort((a, b) => b.total_sessions - a.total_sessions),
            description: `\u062A\u062D\u0644\u064A\u0644 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0642\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0648\u0627\u0644\u0645\u0639\u0627\u0645\u0644 (${roomStats.length} \u0642\u0627\u0639\u0629)`
          };
        } else if (id === "instructor_workload") {
          const instructorStats = [];
          const uniqueInstructors = [...new Set(schedulesData.map((s) => s.instructor))];
          uniqueInstructors.forEach((instructor) => {
            const instructorSessions = schedulesData.filter((s) => s.instructor === instructor);
            const courses = [...new Set(instructorSessions.map((s) => s.course_id))];
            const departments = [...new Set(instructorSessions.map((s) => s.department))];
            const teachingHours = instructorSessions.length * 2;
            instructorStats.push({
              instructor,
              total_courses: courses.length,
              total_sessions: instructorSessions.length,
              teaching_hours: teachingHours,
              departments: departments.join(", ")
            });
          });
          return {
            ...config,
            data: instructorStats.sort((a, b) => b.teaching_hours - a.teaching_hours),
            description: `\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0623\u0639\u0628\u0627\u0621 \u0627\u0644\u062A\u062F\u0631\u064A\u0633\u064A\u0629 \u0639\u0644\u0649 \u0623\u0639\u0636\u0627\u0621 \u0647\u064A\u0626\u0629 \u0627\u0644\u062A\u062F\u0631\u064A\u0633 (${instructorStats.length} \u0645\u062D\u0627\u0636\u0631)`
          };
        } else if (id === "assign_room") {
          const roomAssignmentsData = [];
          schedulesData.forEach((schedule, index) => {
            roomAssignmentsData.push({
              id: index + 1,
              course_code: schedule.course_id,
              course_name: schedule.course_name,
              group: "A",
              day: schedule.day,
              time: schedule.time,
              room: schedule.room,
              room_type: schedule.room_type || (schedule.room.includes("\u0645\u0639\u0645\u0644") ? "\u0645\u0639\u0645\u0644" : schedule.room.includes("\u0645\u062F\u0631\u062C") ? "\u0645\u062F\u0631\u062C" : "\u0642\u0627\u0639\u0629"),
              capacity: schedule.capacity,
              enrolled: Math.floor(schedule.capacity * 0.8),
              instructor: schedule.instructor,
              status: "\u0646\u0634\u0637",
              actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
            });
          });
          return {
            ...config,
            data: roomAssignmentsData,
            description: `\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0642\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 (${roomAssignmentsData.length} \u062A\u062E\u0635\u064A\u0635)`
          };
        } else if (id === "instructor_assignments") {
          const instructorAssignmentsData = [];
          const courseGroups = /* @__PURE__ */ new Map();
          schedulesData.forEach((schedule) => {
            if (!courseGroups.has(schedule.course_id)) {
              courseGroups.set(schedule.course_id, ["A", "B"]);
            }
          });
          schedulesData.forEach((schedule, index) => {
            const groups = courseGroups.get(schedule.course_id) || ["A"];
            groups.forEach((group) => {
              instructorAssignmentsData.push({
                id: instructorAssignmentsData.length + 1,
                course_code: schedule.course_id,
                course_name: schedule.course_name,
                group,
                lecturer_name: schedule.instructor,
                lecturer_title: schedule.instructor.includes("\u0623.\u062F.") ? "\u0623\u0633\u062A\u0627\u0630" : "\u0623\u0633\u062A\u0627\u0630 \u0645\u0633\u0627\u0639\u062F",
                department: schedule.department,
                hours_per_week: schedule.session_type === "\u0645\u062D\u0627\u0636\u0631\u0629" ? 3 : 2,
                status: "\u0646\u0634\u0637",
                actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
              });
            });
          });
          return {
            ...config,
            data: instructorAssignmentsData,
            description: `\u062A\u0648\u0632\u064A\u0639 \u0623\u0639\u0636\u0627\u0621 \u0647\u064A\u0626\u0629 \u0627\u0644\u062A\u062F\u0631\u064A\u0633 \u0639\u0644\u0649 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0648\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A (${instructorAssignmentsData.length} \u062A\u0648\u0632\u064A\u0639)`
          };
        }
      } else if (id === "study_courses" || id === "bylaw_courses") {
        const coursesData = [];
        programsList.forEach((programCode) => {
          const programData = programs[programCode];
          if (!programData) return;
          const mandatoryCourses = programData.mandatory || [];
          mandatoryCourses.forEach((course) => {
            if (course && course.code && course.name) {
              coursesData.push({
                course_code: course.code,
                course_name: course.name,
                program: programData.name,
                level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B",
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2),
                type: "\u0625\u062C\u0628\u0627\u0631\u064A",
                status: "\u0646\u0634\u0637"
              });
            }
          });
          const electiveCourses = programData.elective || [];
          electiveCourses.forEach((course) => {
            if (course && course.code && course.name) {
              coursesData.push({
                course_code: course.code,
                course_name: course.name,
                program: programData.name,
                level: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B",
                hours: (course.theoreticalHours || 3) + (course.practicalHours || 2),
                type: "\u0627\u062E\u062A\u064A\u0627\u0631\u064A",
                status: "\u0646\u0634\u0637"
              });
            }
          });
        });
        console.log(`[getPageConfig] study_courses: Found ${coursesData.length} courses from academic rules`);
        console.log(`[getPageConfig] Programs: ${programsList.join(", ")}`);
        programsList.forEach((programCode) => {
          const programData = programs[programCode];
          if (programData) {
            console.log(`[getPageConfig] ${programCode}: ${programData.mandatory?.length || 0} mandatory, ${programData.elective?.length || 0} elective`);
          }
        });
        return {
          ...config,
          data: coursesData,
          description: id === "study_courses" ? `\u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0641\u064A ${academicRules.facultyName || "\u0627\u0644\u0643\u0644\u064A\u0629"} (${coursesData.length} \u0645\u0642\u0631\u0631)` : `\u0645\u0642\u0631\u0631\u0627\u062A \u0627\u0644\u0644\u0627\u0626\u062D\u0629 \u0641\u064A ${academicRules.facultyName || "\u0627\u0644\u0643\u0644\u064A\u0629"} (${coursesData.length} \u0645\u0642\u0631\u0631)`
        };
      }
    }
  }
  if (id === "student_list" && facultyId && finalData && Array.isArray(finalData)) {
    const filteredData = finalData.filter((item) => item.faculty_code === facultyId);
    const facultyName = FACULTIES.find((f) => f.id === facultyId)?.name || facultyId;
    return {
      ...config,
      data: filteredData,
      description: `\u0639\u0631\u0636 \u0648\u0625\u062F\u0627\u0631\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A\u0629 (${filteredData.length} \u0637\u0627\u0644\u0628 - ${facultyName})`
    };
  }
  if ((id === "student_attendance" || id === "manage_reg_issues" || id === "contact_list" || id === "id_cards") && facultyId && finalData && Array.isArray(finalData)) {
    const facultyStudentIds = ALL_STUDENTS.filter((s) => s.faculty_code === facultyId).map((s) => s.student_id);
    const filteredData = finalData.filter((item) => {
      const studentId = item.student_id;
      return studentId && facultyStudentIds.includes(studentId);
    });
    return {
      ...config,
      data: filteredData,
      description: config.description.replace(/\(\d+ سجل\)/, `(${filteredData.length} \u0633\u062C\u0644)`)
    };
  }
  const facultyScopedStudentPages = /* @__PURE__ */ new Set([
    "advanced_student_search",
    "detailed_grades",
    "detailed_attendance",
    "financial_records",
    "student_academic_profile",
    "student_course_enrollments",
    "student_performance_analysis",
    "student_complete_profile",
    "registered_students_report",
    "registered_students_stats",
    "registered_students_chart",
    "students_in_course",
    "unregistered_students",
    "students_by_gpa",
    "registered_courses_for_students",
    "registered_courses_count",
    "review_student_reg",
    "multiple_courses_reg",
    "department_students"
  ]);
  if (facultyId && finalData && Array.isArray(finalData) && facultyScopedStudentPages.has(id)) {
    const facultyName = FACULTIES.find((f) => f.id === facultyId)?.name;
    const facultyStudentIds = new Set(
      ALL_STUDENTS.filter((s) => s.faculty_code === facultyId).map((s) => s.student_id)
    );
    const filteredData = finalData.filter((item) => {
      if (item?.faculty_code) return item.faculty_code === facultyId;
      if (item?.faculty_id) return item.faculty_id === facultyId;
      if (item?.faculty && facultyName) return item.faculty === facultyName || item.faculty === facultyId;
      if (item?.student_id) return facultyStudentIds.has(item.student_id);
      return false;
    });
    return {
      ...config,
      data: filteredData,
      description: `${config.description} (${filteredData.length} \u0633\u062C\u0644 - ${facultyName || facultyId})`
    };
  }
  return {
    ...config,
    data: finalData
  };
};
var getStudentStatistics = (facultyId) => {
  const targetStudents = facultyId ? ALL_STUDENTS.filter((s) => s.faculty_code === facultyId) : ALL_STUDENTS;
  const levelStats = [
    { name: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644", students: targetStudents.filter((s) => s.level === "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644").length },
    { name: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A", students: targetStudents.filter((s) => s.level === "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A").length },
    { name: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B", students: targetStudents.filter((s) => s.level === "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B").length },
    { name: "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639", students: targetStudents.filter((s) => s.level === "\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639").length }
  ];
  const paidStudents = targetStudents.filter((s) => s.fees_status === "\u0645\u0633\u062F\u062F").length;
  const unpaidStudents = targetStudents.filter((s) => s.fees_status === "\u063A\u064A\u0631 \u0645\u0633\u062F\u062F").length;
  const feesStats = [
    { name: "\u0645\u0633\u062F\u062F", value: paidStudents },
    { name: "\u063A\u064A\u0631 \u0645\u0633\u062F\u062F", value: unpaidStudents }
  ];
  const activeStudents = targetStudents.filter((s) => s.status === "\u0645\u0642\u064A\u062F").length;
  const graduatedStudents = targetStudents.filter((s) => s.status === "\u062E\u0631\u064A\u062C").length;
  const suspendedStudents = targetStudents.filter((s) => s.status === "\u0645\u0648\u0642\u0648\u0641").length;
  const expelledStudents = targetStudents.filter((s) => s.status === "\u0645\u0641\u0635\u0648\u0644").length;
  const averageFee = 2e3;
  const totalRevenue = paidStudents * averageFee;
  const paymentRate = targetStudents.length > 0 ? Math.round(paidStudents / targetStudents.length * 100) : 0;
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
var getDepartmentStatistics = () => {
  const departmentStats = DEPARTMENTS_FCAI.map((dept) => {
    const deptCode = dept.split("(")[1]?.replace(")", "") || dept;
    const studentsInDept = FCAI_STUDENTS.filter((s) => s.department === deptCode).length;
    return {
      name: dept,
      students: studentsInDept
    };
  });
  return departmentStats;
};
var addRoomAssignment = (assignmentData) => {
  const newAssignment = {
    id: CLASSROOM_ASSIGNMENTS.length + 1,
    ...assignmentData,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  CLASSROOM_ASSIGNMENTS.push(newAssignment);
  const assignRoomConfig = MOCK_DATABASE["assign_room"];
  if (assignRoomConfig) {
    assignRoomConfig.data = CLASSROOM_ASSIGNMENTS.map((assignment, index) => ({
      id: index + 1,
      ...assignment,
      actions: "\u062A\u0639\u062F\u064A\u0644 | \u062D\u0630\u0641"
    }));
    assignRoomConfig.description = `\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u0642\u0631\u0631\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0642\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 (${CLASSROOM_ASSIGNMENTS.length} \u062A\u062E\u0635\u064A\u0635)`;
  }
  return newAssignment;
};
var getRoomAssignments = () => {
  return CLASSROOM_ASSIGNMENTS;
};
var ACADEMIC_FACULTIES_DB = [];
var ACADEMIC_DEPARTMENTS_DB = [];
var ACADEMIC_PROGRAMS_DB = [];
var ACADEMIC_REGULATIONS_DB = [];
var ACADEMIC_COURSES_DB = [];
var loadAcademicDataFromStorage = () => {
  try {
    const savedFaculties = localStorage.getItem("academicFaculties");
    const savedDepartments = localStorage.getItem("academicDepartments");
    const savedPrograms = localStorage.getItem("academicPrograms");
    const savedRegulations = localStorage.getItem("academicRegulations");
    const savedCourses = localStorage.getItem("academicCourses");
    if (savedFaculties) ACADEMIC_FACULTIES_DB = JSON.parse(savedFaculties);
    if (savedDepartments) ACADEMIC_DEPARTMENTS_DB = JSON.parse(savedDepartments);
    if (savedPrograms) ACADEMIC_PROGRAMS_DB = JSON.parse(savedPrograms);
    if (savedRegulations) ACADEMIC_REGULATIONS_DB = JSON.parse(savedRegulations);
    if (savedCourses) ACADEMIC_COURSES_DB = JSON.parse(savedCourses);
  } catch (error) {
    console.error("Error loading academic data from storage:", error);
  }
};
var initializeDefaultAcademicData = () => {
  const hasSavedData = localStorage.getItem("academicDepartments") || localStorage.getItem("academicPrograms") || localStorage.getItem("academicRegulations") || localStorage.getItem("academicCourses");
  if (hasSavedData) return;
  const savedRules = localStorage.getItem("academicRules");
  if (!savedRules) return;
  try {
    const rules = JSON.parse(savedRules);
    rules.forEach((rule) => {
      if (!rule.studySystem?.graduationRequirementsDetails?.majorRequirements?.programs) return;
      const facultyId = rule.facultyId;
      const programs = rule.studySystem.graduationRequirementsDetails.majorRequirements.programs;
      Object.keys(programs).forEach((programCode) => {
        const programData = programs[programCode];
        if (!programData) return;
        const deptCode = programCode;
        const existingDept = ACADEMIC_DEPARTMENTS_DB.find((d) => d.code === deptCode && d.facultyId === facultyId);
        if (!existingDept) {
          const programId = `PROG-${facultyId}-${deptCode}-${Date.now()}`;
          const department = {
            id: `DEPT-${facultyId}-${deptCode}-${Date.now()}`,
            name: programData.name,
            nameEn: programData.nameEn,
            code: deptCode,
            facultyId,
            headId: "",
            headName: "",
            programs: [programId],
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          ACADEMIC_DEPARTMENTS_DB.push(department);
          const program = {
            id: programId,
            name: programData.name,
            nameEn: programData.nameEn,
            code: deptCode,
            departmentId: department.id,
            degree: "\u0628\u0643\u0627\u0644\u0648\u0631\u064A\u0648\u0633",
            totalHours: 140,
            mandatoryHours: (programData.mandatory || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0),
            electiveHours: (programData.elective || []).reduce((sum, c) => sum + (c.theoreticalHours || 3), 0),
            universityRequirements: 0,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          ACADEMIC_PROGRAMS_DB.push(program);
          const regulation = {
            id: `REG-${facultyId}-${deptCode}-${Date.now()}`,
            name: `\u0644\u0627\u0626\u062D\u0629 ${programData.name}`,
            programId: program.id,
            registrationRules: "",
            passFailRules: "",
            absencePolicy: "",
            mandatoryHours: program.mandatoryHours,
            electiveHours: program.electiveHours,
            universityRequirements: program.universityRequirements,
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          ACADEMIC_REGULATIONS_DB.push(regulation);
          const allCourses = [
            ...programData.mandatory || [],
            ...programData.elective || []
          ];
          allCourses.forEach((courseData, idx) => {
            const course = {
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
              level: 3,
              // Default level, can be adjusted
              semester: "\u062E\u0631\u064A\u0641",
              type: idx < (programData.mandatory?.length || 0) ? "\u0625\u062C\u0628\u0627\u0631\u064A" : "\u0627\u062E\u062A\u064A\u0627\u0631\u064A",
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            ACADEMIC_COURSES_DB.push(course);
          });
        }
      });
    });
    saveToStorage("academicDepartments", ACADEMIC_DEPARTMENTS_DB);
    saveToStorage("academicPrograms", ACADEMIC_PROGRAMS_DB);
    saveToStorage("academicRegulations", ACADEMIC_REGULATIONS_DB);
    saveToStorage("academicCourses", ACADEMIC_COURSES_DB);
  } catch (error) {
    console.error("Error initializing default academic data:", error);
  }
};
var saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};
loadAcademicDataFromStorage();
initializeDefaultAcademicData();
var getAcademicFaculties = () => {
  return [...ACADEMIC_FACULTIES_DB];
};
var saveAcademicFaculty = (faculty) => {
  const existingIndex = ACADEMIC_FACULTIES_DB.findIndex((f) => f.id === faculty.id);
  if (existingIndex >= 0) {
    ACADEMIC_FACULTIES_DB[existingIndex] = faculty;
  } else {
    ACADEMIC_FACULTIES_DB.push(faculty);
  }
  saveToStorage("academicFaculties", ACADEMIC_FACULTIES_DB);
};
var deleteAcademicFaculty = (facultyId) => {
  ACADEMIC_FACULTIES_DB = ACADEMIC_FACULTIES_DB.filter((f) => f.id !== facultyId);
  saveToStorage("academicFaculties", ACADEMIC_FACULTIES_DB);
};
var getAcademicDepartments = () => {
  return [...ACADEMIC_DEPARTMENTS_DB];
};
var saveAcademicDepartment = (department) => {
  const existingIndex = ACADEMIC_DEPARTMENTS_DB.findIndex((d) => d.id === department.id);
  if (existingIndex >= 0) {
    ACADEMIC_DEPARTMENTS_DB[existingIndex] = department;
  } else {
    ACADEMIC_DEPARTMENTS_DB.push(department);
  }
  saveToStorage("academicDepartments", ACADEMIC_DEPARTMENTS_DB);
};
var deleteAcademicDepartment = (departmentId) => {
  ACADEMIC_DEPARTMENTS_DB = ACADEMIC_DEPARTMENTS_DB.filter((d) => d.id !== departmentId);
  saveToStorage("academicDepartments", ACADEMIC_DEPARTMENTS_DB);
};
var getAcademicPrograms = () => {
  return [...ACADEMIC_PROGRAMS_DB];
};
var saveAcademicProgram = (program) => {
  const existingIndex = ACADEMIC_PROGRAMS_DB.findIndex((p) => p.id === program.id);
  if (existingIndex >= 0) {
    ACADEMIC_PROGRAMS_DB[existingIndex] = program;
  } else {
    ACADEMIC_PROGRAMS_DB.push(program);
  }
  saveToStorage("academicPrograms", ACADEMIC_PROGRAMS_DB);
};
var deleteAcademicProgram = (programId) => {
  ACADEMIC_PROGRAMS_DB = ACADEMIC_PROGRAMS_DB.filter((p) => p.id !== programId);
  saveToStorage("academicPrograms", ACADEMIC_PROGRAMS_DB);
};
var getAcademicRegulations = () => {
  return [...ACADEMIC_REGULATIONS_DB];
};
var saveAcademicRegulation = (regulation) => {
  const existingIndex = ACADEMIC_REGULATIONS_DB.findIndex((r) => r.id === regulation.id);
  if (existingIndex >= 0) {
    ACADEMIC_REGULATIONS_DB[existingIndex] = regulation;
  } else {
    ACADEMIC_REGULATIONS_DB.push(regulation);
  }
  saveToStorage("academicRegulations", ACADEMIC_REGULATIONS_DB);
};
var deleteAcademicRegulation = (regulationId) => {
  ACADEMIC_REGULATIONS_DB = ACADEMIC_REGULATIONS_DB.filter((r) => r.id !== regulationId);
  saveToStorage("academicRegulations", ACADEMIC_REGULATIONS_DB);
};
var getAcademicCourses = () => {
  return [...ACADEMIC_COURSES_DB];
};
var saveAcademicCourse = (course) => {
  const existingIndex = ACADEMIC_COURSES_DB.findIndex((c) => c.id === course.id);
  if (existingIndex >= 0) {
    ACADEMIC_COURSES_DB[existingIndex] = course;
  } else {
    ACADEMIC_COURSES_DB.push(course);
  }
  saveToStorage("academicCourses", ACADEMIC_COURSES_DB);
};
var deleteAcademicCourse = (courseId) => {
  ACADEMIC_COURSES_DB = ACADEMIC_COURSES_DB.filter((c) => c.id !== courseId);
  saveToStorage("academicCourses", ACADEMIC_COURSES_DB);
};
var getAcademicRules = (facultyId) => {
  const stored = localStorage.getItem("academicRules");
  const rules = stored ? JSON.parse(stored) : [];
  if (facultyId) {
    return rules.filter((r) => r.facultyId === facultyId);
  }
  return rules;
};
var getAcademicRulesByFaculty = (facultyId) => {
  const rules = getAcademicRules();
  const foundRule = rules.find((r) => r.facultyId === facultyId);
  if (!foundRule) {
    console.log(`[getAcademicRulesByFaculty] No rules found for faculty: ${facultyId}`);
    return null;
  }
  const programs = foundRule.studySystem?.graduationRequirementsDetails?.majorRequirements?.programs;
  if (programs) {
    Object.keys(programs).forEach((programCode) => {
      const programData = programs[programCode];
      if (programData) {
        console.log(`[getAcademicRulesByFaculty] ${programCode}: ${programData.mandatory?.length || 0} mandatory, ${programData.elective?.length || 0} elective`);
      }
    });
  }
  return foundRule;
};
var saveAcademicRules = (rules) => {
  const allRules = getAcademicRules();
  const existingIndex = allRules.findIndex((r) => r.id === rules.id);
  if (existingIndex >= 0) {
    allRules[existingIndex] = { ...rules, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  } else {
    allRules.push({ ...rules, createdAt: (/* @__PURE__ */ new Date()).toISOString(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  }
  localStorage.setItem("academicRules", JSON.stringify(allRules));
};
var deleteAcademicRules = (rulesId) => {
  const rules = getAcademicRules();
  const filtered = rules.filter((r) => r.id !== rulesId);
  localStorage.setItem("academicRules", JSON.stringify(filtered));
};
var createDefaultAcademicRules = (facultyId, facultyName) => {
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
        minimumGPA: 2,
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
          name: "Freshman",
          maxCreditHours: 30,
          description: "\u064A\u0642\u064A\u062F \u0627\u0644\u0637\u0627\u0644\u0628 \u0639\u0646\u062F \u0627\u0644\u062A\u062D\u0627\u0642\u0647 \u0628\u0627\u0644\u0643\u0644\u064A\u0629 \u0648\u064A\u0638\u0644 \u0645\u0642\u064A\u062F\u0627\u064B \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644 \u0637\u0627\u0644\u0645\u0627 \u0644\u0645 \u064A\u062C\u062A\u0627\u0632 30 \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629"
        },
        level2: {
          name: "Sophomore",
          requiredCreditHours: 30,
          description: "\u064A\u0646\u062A\u0642\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A \u0639\u0646\u062F \u0627\u062C\u062A\u064A\u0627\u0632\u0647 30 \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629"
        },
        level3: {
          name: "Junior",
          requiredCreditHours: 66,
          description: "\u064A\u0646\u062A\u0642\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0646\u064A \u0644\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B \u0639\u0646\u062F \u0627\u062C\u062A\u064A\u0627\u0632\u0647 66 \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629",
          specializationRequired: true
        },
        level4: {
          name: "Senior",
          requiredCreditHours: 102,
          description: "\u064A\u0646\u062A\u0642\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062B\u0627\u0644\u062B \u0644\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639 \u0639\u0646\u062F \u0627\u062C\u062A\u064A\u0627\u0632\u0647 102 \u0633\u0627\u0639\u0629 \u0645\u0639\u062A\u0645\u062F\u0629"
        }
      },
      studyPlan: {
        commonLevels: {
          level1: {
            fall: [
              { code: "UNV101", name: "\u0627\u0644\u0642\u0636\u0627\u064A\u0627 \u0627\u0644\u0645\u062C\u062A\u0645\u0639\u064A\u0629", nameEn: "Societal issues", theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062C\u0627\u0645\u0639\u0629" },
              { code: "UNV105", name: "\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0648\u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0641\u0639\u0627\u0644", nameEn: "Effective Communication and Presentation Skills", theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062C\u0627\u0645\u0639\u0629" },
              { code: "BS101", name: "\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0641\u064A \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Mathematics in Computer Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" },
              { code: "CS101", name: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Science Fundamentals", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "CS102", name: "\u0627\u0644\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0647\u064A\u0643\u0644\u064A\u0629", nameEn: "Structured Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "IT101", name: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A", nameEn: "Electronics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" },
              { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0623\u0633\u0627\u0633\u064A (1)", nameEn: "Elective Basic Course (1)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective", category: "\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" }
            ],
            spring: [
              { code: "UNV102", name: "\u0644\u063A\u0629 \u0627\u0646\u062C\u0644\u064A\u0632\u064A\u0629", nameEn: "English Language", theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062C\u0627\u0645\u0639\u0629" },
              { code: "UNV103", name: "\u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0639\u0644\u0645\u064A\u0629 \u0648\u0627\u0644\u0641\u0646\u064A\u0629", nameEn: "Technical and Scientific Writing", theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062C\u0627\u0645\u0639\u0629" },
              { code: "BS102", name: "\u062A\u0631\u0627\u0643\u064A\u0628 \u0645\u062D\u062F\u062F\u0629", nameEn: "Discrete Structures", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" },
              { code: "BS103", name: "\u0627\u0644\u062C\u0628\u0631 \u0627\u0644\u062E\u0637\u064A", nameEn: "Linear Algebra", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" },
              { code: "BS104", name: "\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0627\u062D\u062A\u0645\u0627\u0644\u0627\u062A \u0648\u0627\u0644\u0625\u062D\u0635\u0627\u0621 \u0641\u0649 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Probability and Statistics Applications in Computer", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" },
              { code: "CS103", name: "\u0627\u0644\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0634\u064A\u0626\u064A\u0629", nameEn: "Object Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0623\u0633\u0627\u0633\u064A (2)", nameEn: "Elective Basic Course (2)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective", category: "\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" }
            ]
          },
          level2: {
            fall: [
              { code: "UNV104", name: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0648\u0627\u0644\u062A\u062D\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u0649 \u0641\u064A \u0627\u0644\u0645\u062C\u062A\u0645\u0639", nameEn: "Artificial Intelligence and Digital Transformation in Society", theoreticalHours: 2, practicalHours: 0, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062C\u0627\u0645\u0639\u0629" },
              { code: "IS201", name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Introduction to Information Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "IT202", name: "\u062A\u0631\u0627\u0633\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Communication", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "CS204", name: "\u062A\u0635\u0645\u064A\u0645 \u0645\u0646\u0637\u0642\u064A", nameEn: "Logic Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "CS205", name: "\u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Structures", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"], type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0643\u0644\u064A\u0629 (1)", nameEn: "Elective Faculty Course (1)", theoreticalHours: 3, practicalHours: 0, creditHours: 3, type: "elective", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" }
            ],
            spring: [
              { code: "IS202", name: "\u0646\u0638\u0645 \u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Database Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS101"], type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "IS203", name: "\u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0646\u0638\u0645", nameEn: "Systems Analysis and Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"], type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "IT203", name: "\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Networks", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT202"], type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "CS206", name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A", nameEn: "Introduction to Artificial Intelligence", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"], type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "CS207", name: "\u0646\u0638\u0645 \u0627\u0644\u062A\u0634\u063A\u064A\u0644", nameEn: "Operating Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS101"], type: "mandatory", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" },
              { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0643\u0644\u064A\u0629 (2)", nameEn: "Elective Faculty Course (2)", theoreticalHours: 3, practicalHours: 0, creditHours: 3, type: "elective", category: "\u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0643\u0644\u064A\u0629" }
            ]
          }
        },
        programLevels: {
          CS: {
            level3: {
              fall: [
                { code: "IT305", name: "\u0625\u0634\u0627\u0631\u0627\u062A \u0648\u0646\u0638\u0645", nameEn: "Signals and Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT202"], type: "mandatory" },
                { code: "CS308", name: "\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Software Engineering", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory" },
                { code: "CS309", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u0631\u0646\u0629", nameEn: "Soft Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"], type: "mandatory" },
                { code: "CS310", name: "\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0645\u062A\u0631\u062C\u0645\u0627\u062A", nameEn: "Compilers Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"], type: "mandatory" },
                { code: "CS311", name: "\u062A\u0635\u0645\u064A\u0645 \u0648\u062A\u062D\u0644\u064A\u0644 \u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0627\u062A", nameEn: "Design and Analysis of Algorithms", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0639\u0644\u0648\u0645 \u062D\u0627\u0633\u0628 (1)", nameEn: "Elective Computer Science (1)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ],
              spring: [
                { code: "CS312", name: "\u0628\u0646\u064A\u0629 \u0648\u062A\u0646\u0638\u064A\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Architecture and Organization", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS204"], type: "mandatory" },
                { code: "CS313", name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", nameEn: "Machine Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "CS314", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0635\u0648\u0631", nameEn: "Image Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "CS315", name: "\u0627\u0644\u0631\u0633\u0645 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Graphics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"], type: "mandatory" },
                { code: "CS429", name: "\u0627\u0644\u062A\u0634\u0641\u064A\u0631", nameEn: "Cryptography", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS102"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0639\u0644\u0648\u0645 \u062D\u0627\u0633\u0628 (2)", nameEn: "Elective Computer Science (2)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ]
            },
            level4: {
              fall: [
                { code: "CS430", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u062A\u0648\u0627\u0632\u064A\u0629 \u0648\u0627\u0644\u0645\u0648\u0632\u0639\u0629", nameEn: "Parallel and Distributed Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"], type: "mandatory" },
                { code: "CS431", name: "\u0627\u0644\u0646\u0645\u0630\u062C\u0629 \u0648\u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629", nameEn: "Modeling and Simulation", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS311"], type: "mandatory" },
                { code: "CS432", name: "\u0627\u0644\u0631\u0624\u064A\u0629 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Vision", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "PR401", name: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C", nameEn: "Project", theoreticalHours: 4, practicalHours: 0, creditHours: 4, prerequisites: ["Pass (102) Credit hours"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0639\u0644\u0648\u0645 \u062D\u0627\u0633\u0628 (3)", nameEn: "Elective Computer Science (3)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ],
              spring: [
                { code: "CS433", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062D\u0627\u0628\u064A\u0629", nameEn: "Cloud Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "CS434", name: "\u0627\u0644\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0646\u0645\u0627\u0637", nameEn: "Pattern Recognition", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS313"], type: "mandatory" },
                { code: "CS435", name: "\u0627\u0644\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0630\u0643\u064A\u0629", nameEn: "Smart Applications", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"], type: "mandatory" },
                { code: "PR401", name: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C", nameEn: "Project", theoreticalHours: 0, practicalHours: 0, creditHours: 0, type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0639\u0644\u0648\u0645 \u062D\u0627\u0633\u0628 (4)", nameEn: "Elective Computer Science (4)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ]
            }
          },
          IT: {
            level3: {
              fall: [
                { code: "IT305", name: "\u0625\u0634\u0627\u0631\u0627\u062A \u0648\u0646\u0638\u0645", nameEn: "Signals and Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT202"], type: "mandatory" },
                { code: "IT306", name: "\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Computer Networks", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "IT307", name: "\u0627\u0644\u0648\u0633\u0627\u0626\u0637 \u0627\u0644\u0645\u062A\u0639\u062F\u062F\u0629", nameEn: "Multimedia", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"], type: "mandatory" },
                { code: "CS308", name: "\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Software Engineering", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory" },
                { code: "IS429", name: "\u062A\u0637\u0648\u064A\u0631 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u062D\u0645\u0648\u0644", nameEn: "Mobile Applications Development", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (1)", nameEn: "Elective IT (1)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ],
              spring: [
                { code: "IT308", name: "\u062A\u0623\u0645\u064A\u0646 \u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628 \u0627\u0644\u0622\u0644\u064A", nameEn: "Computer Network Security", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "IT309", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u0642\u0645\u064A\u0629", nameEn: "Digital Signal Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS101"], type: "mandatory" },
                { code: "IT312", name: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0631\u0648\u0628\u0648\u062A", nameEn: "Fundamentals of Robotic systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS212"], type: "mandatory" },
                { code: "CS313", name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", nameEn: "Machine Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "CS314", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0635\u0648\u0631", nameEn: "Image Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (2)", nameEn: "Elective IT (2)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ]
            },
            level4: {
              fall: [
                { code: "IT415", name: "\u0627\u0644\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u0644\u0627\u0633\u0644\u0643\u064A\u0629 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629", nameEn: "Wireless and Mobile Networks", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "IT416", name: "\u0627\u0644\u0648\u0627\u0642\u0639 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0648\u0627\u0644\u0645\u0639\u0632\u0632", nameEn: "Virtual and Augmented Reality", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "IT417", name: "\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0634\u0628\u0643\u0627\u062A", nameEn: "Network Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "PR402", name: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C", nameEn: "Project", theoreticalHours: 4, practicalHours: 0, creditHours: 4, prerequisites: ["Pass (102) Credit hours"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (3)", nameEn: "Elective IT (3)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ],
              spring: [
                { code: "IT418", name: "\u0627\u0644\u0646\u0638\u0645 \u0627\u0644\u0645\u062F\u0645\u062C\u0629", nameEn: "Embedded Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"], type: "mandatory" },
                { code: "IT423", name: "\u0627\u0646\u062A\u0631\u0646\u062A \u0627\u0644\u0623\u0634\u064A\u0627\u0621", nameEn: "Internet of Things", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "CS433", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062D\u0627\u0628\u064A\u0629", nameEn: "Cloud Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "PR402", name: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C", nameEn: "Project", theoreticalHours: 0, practicalHours: 0, creditHours: 0, type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (4)", nameEn: "Elective IT (4)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ]
            }
          },
          IS: {
            level3: {
              fall: [
                { code: "CS308", name: "\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Software Engineering", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "mandatory" },
                { code: "IS309", name: "\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Information Security", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"], type: "mandatory" },
                { code: "IS310", name: "\u062A\u062E\u0632\u064A\u0646 \u0648\u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Information Storage and Retrieval", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"], type: "mandatory" },
                { code: "IS311", name: "\u0627\u0644\u062A\u0646\u0642\u064A\u0628 \u0639\u0646 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Mining", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"], type: "mandatory" },
                { code: "IS314", name: "\u0646\u0638\u0645 \u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Database Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0646\u0638\u0645 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (1)", nameEn: "Elective Information Systems (1)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ],
              spring: [
                { code: "IS312", name: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0630\u0643\u064A\u0629", nameEn: "Intelligent Information Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"], type: "mandatory" },
                { code: "IS313", name: "\u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0646\u0638\u0645 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Systems analysis and Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS203"], type: "mandatory" },
                { code: "CS313", name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", nameEn: "Machine Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "IS425", name: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0632\u0639\u0629", nameEn: "Distributed Databases", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS308"], type: "mandatory" },
                { code: "IS426", name: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629", nameEn: "Big Data Analytics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0646\u0638\u0645 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (2)", nameEn: "Elective Information Systems (2)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ]
            },
            level4: {
              fall: [
                { code: "IS427", name: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A\u0629", nameEn: "Geographical Information Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"], type: "mandatory" },
                { code: "IS428", name: "\u0646\u0638\u0645 \u062F\u0639\u0645 \u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0630\u0643\u064A", nameEn: "Intelligent Decision Support Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"], type: "mandatory" },
                { code: "IS429", name: "\u062A\u0637\u0648\u064A\u0631 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u062D\u0645\u0648\u0644", nameEn: "Mobile Applications Development", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"], type: "mandatory" },
                { code: "IS430", name: "\u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0645\u0631\u0626\u064A \u0644\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Visualization", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"], type: "mandatory" },
                { code: "PR403", name: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C", nameEn: "Project", theoreticalHours: 4, practicalHours: 0, creditHours: 4, prerequisites: ["Pass (102) Credit hours"], type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0646\u0638\u0645 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (3)", nameEn: "Elective Information Systems (3)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
              ],
              spring: [
                { code: "CS433", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062D\u0627\u0628\u064A\u0629", nameEn: "Cloud Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"], type: "mandatory" },
                { code: "CS437", name: "\u0639\u0644\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"], type: "mandatory" },
                { code: "PR403", name: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u062E\u0631\u062C", nameEn: "Project", theoreticalHours: 0, practicalHours: 0, creditHours: 0, type: "mandatory" },
                { code: "XX", name: "\u0645\u0642\u0631\u0631 \u0627\u062E\u062A\u064A\u0627\u0631\u064A \u0646\u0638\u0645 \u0645\u0639\u0644\u0648\u0645\u0627\u062A (4)", nameEn: "Elective Information Systems (4)", theoreticalHours: 3, practicalHours: 2, creditHours: 2, type: "elective" }
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
            { code: "UNV101", name: "\u0627\u0644\u0642\u0636\u0627\u064A\u0627 \u0627\u0644\u0645\u062C\u062A\u0645\u0639\u064A\u0629", nameEn: "Societal issues", theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: "UNV102", name: "\u0644\u063A\u0629 \u0627\u0646\u062C\u0644\u064A\u0632\u064A\u0629", nameEn: "English Language", theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: "UNV103", name: "\u0627\u0644\u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0639\u0644\u0645\u064A\u0629 \u0648\u0627\u0644\u0641\u0646\u064A\u0629", nameEn: "Technical and Scientific Writing", theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: "UNV104", name: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0648\u0627\u0644\u062A\u062D\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u0649 \u0641\u064A \u0627\u0644\u0645\u062C\u062A\u0645\u0639", nameEn: "Artificial Intelligence and Digital Transformation in Society", theoreticalHours: 2, practicalHours: 0, creditHours: 2 },
            { code: "UNV105", name: "\u0645\u0647\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0648\u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0641\u0639\u0627\u0644", nameEn: "Effective Communication and Presentation Skills", theoreticalHours: 2, practicalHours: 0, creditHours: 2 }
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
              { code: "BS101", name: "\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0641\u064A \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Mathematics in Computer Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "IT101", name: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A", nameEn: "Electronics", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "BS102", name: "\u062A\u0631\u0627\u0643\u064A\u0628 \u0645\u062D\u062F\u062F\u0629", nameEn: "Discrete Structures", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "BS103", name: "\u0627\u0644\u062C\u0628\u0631 \u0627\u0644\u062E\u0637\u064A", nameEn: "Linear Algebra", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "BS104", name: "\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0627\u062D\u062A\u0645\u0627\u0644\u0627\u062A \u0648\u0627\u0644\u0625\u062D\u0635\u0627\u0621 \u0641\u0649 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Probability and Statistics Applications in Computer", theoreticalHours: 3, practicalHours: 2, creditHours: 2 }
            ],
            elective: [
              { code: "BS105", name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0621", nameEn: "Introduction to Physics", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "BS206", name: "\u0645\u0639\u0627\u062F\u0644\u0627\u062A \u0627\u0644\u0641\u0631\u0648\u0642 \u0648\u0627\u0644\u0645\u0639\u0627\u062F\u0644\u0627\u062A \u0627\u0644\u062A\u0641\u0627\u0636\u0644\u064A\u0629", nameEn: "Difference & Differential Equations", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS101"] },
              { code: "BS207", name: "\u062A\u062D\u0644\u064A\u0644 \u0639\u062F\u062F\u064A", nameEn: "Numerical Analysis", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS101"] },
              { code: "BS208", name: "\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0627\u062D\u062A\u0645\u0627\u0644\u0627\u062A \u0648\u0627\u0644\u0625\u062D\u0635\u0627\u0621 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629 \u0641\u0649 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Advanced Probability and Statistics Applications in Computer", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
              { code: "BS209", name: "\u0628\u062D\u0648\u062B \u0639\u0645\u0644\u064A\u0627\u062A", nameEn: "Operations Research", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
              { code: "BS212", name: "\u0627\u0644\u062A\u0641\u0643\u064A\u0631 \u0627\u0644\u0639\u0644\u0645\u064A \u0648\u0627\u0644\u0625\u0628\u062F\u0627\u0639\u064A", nameEn: "Scientific and Creative Thinking", theoreticalHours: 3, practicalHours: 0, creditHours: 3 },
              { code: "BS213", name: "\u062A\u0633\u0648\u064A\u0642 \u0648\u0645\u0628\u064A\u0639\u0627\u062A", nameEn: "Marketing and Sales", theoreticalHours: 3, practicalHours: 0, creditHours: 3 },
              { code: "BS214", name: "\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0648\u0628\u064A\u0629 \u0644\u0644\u062A\u0639\u0644\u0645 \u0648\u0639\u0644\u0648\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Computational Mathematics for learning and Data Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS102"] }
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
              { code: "CS101", name: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Science Fundamentals", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "IS201", name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Introduction to Information Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "CS102", name: "\u0627\u0644\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0647\u064A\u0643\u0644\u064A\u0629", nameEn: "Structured Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "CS103", name: "\u0627\u0644\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0634\u064A\u0626\u064A\u0629", nameEn: "Object Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "IS202", name: "\u0646\u0638\u0645 \u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Database Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS101"] },
              { code: "IT202", name: "\u062A\u0631\u0627\u0633\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Communication", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "IS203", name: "\u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0646\u0638\u0645", nameEn: "Systems Analysis and Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"] },
              { code: "IT203", name: "\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Networks", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT202"] },
              { code: "CS204", name: "\u062A\u0635\u0645\u064A\u0645 \u0645\u0646\u0637\u0642\u064A", nameEn: "Logic Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "CS205", name: "\u0647\u064A\u0627\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Structures", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
              { code: "CS206", name: "\u0645\u0642\u062F\u0645\u0629 \u0641\u064A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A", nameEn: "Introduction to Artificial Intelligence", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
              { code: "CS207", name: "\u0646\u0638\u0645 \u0627\u0644\u062A\u0634\u063A\u064A\u0644", nameEn: "Operating Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS101"] },
              { code: "CS308", name: "\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Software Engineering", theoreticalHours: 3, practicalHours: 2, creditHours: 2 }
            ],
            elective: [
              { code: "IT204", name: "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A", nameEn: "Internet Technology", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
              { code: "IS204", name: "\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0648\u064A\u0628", nameEn: "Web Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
              { code: "IS205", name: "\u0625\u062F\u0627\u0631\u0629 \u0645\u0634\u0627\u0631\u064A\u0639 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Software Project Management", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "IS206", name: "\u062A\u0637\u0648\u064A\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0648\u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631", nameEn: "New Product Development and Innovation", theoreticalHours: 3, practicalHours: 2, creditHours: 2 },
              { code: "IS207", name: "\u0627\u0628\u062A\u0643\u0627\u0631 \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0648\u0627\u0644\u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F\u0629", nameEn: "IS Innovation and New Technologies", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"] },
              { code: "BS211", name: "\u0627\u0644\u0623\u062E\u0644\u0627\u0642 \u0627\u0644\u0645\u0647\u0646\u064A\u0629 \u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Professional Ethics for Computer Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2 }
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
              name: "\u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628",
              nameEn: "Computer Science",
              mandatory: [
                { code: "IT305", name: "\u0625\u0634\u0627\u0631\u0627\u062A \u0648\u0646\u0638\u0645", nameEn: "Signals and Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT202"] },
                { code: "CS309", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u0631\u0646\u0629", nameEn: "Soft Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "CS310", name: "\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0645\u062A\u0631\u062C\u0645\u0627\u062A", nameEn: "Compilers Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "CS311", name: "\u062A\u0635\u0645\u064A\u0645 \u0648\u062A\u062D\u0644\u064A\u0644 \u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0627\u062A", nameEn: "Design and Analysis of Algorithms", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "CS312", name: "\u0628\u0646\u064A\u0629 \u0648\u062A\u0646\u0638\u064A\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Architecture and Organization", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS204"] },
                { code: "CS313", name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", nameEn: "Machine Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "CS314", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0635\u0648\u0631", nameEn: "Image Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS103"] },
                { code: "CS315", name: "\u0627\u0644\u0631\u0633\u0645 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Graphics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "CS429", name: "\u0627\u0644\u062A\u0634\u0641\u064A\u0631", nameEn: "Cryptography", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS102"] },
                { code: "CS430", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u062A\u0648\u0627\u0632\u064A\u0629 \u0648\u0627\u0644\u0645\u0648\u0632\u0639\u0629", nameEn: "Parallel and Distributed Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "CS431", name: "\u0627\u0644\u0646\u0645\u0630\u062C\u0629 \u0648\u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629", nameEn: "Modeling and Simulation", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS311"] },
                { code: "CS432", name: "\u0627\u0644\u0631\u0624\u064A\u0629 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Vision", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "CS433", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062D\u0627\u0628\u064A\u0629", nameEn: "Cloud Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "CS434", name: "\u0627\u0644\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0646\u0645\u0627\u0637", nameEn: "Pattern Recognition", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS313"] },
                { code: "CS435", name: "\u0627\u0644\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0630\u0643\u064A\u0629", nameEn: "Smart Applications", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] }
              ],
              elective: [
                { code: "IT307", name: "\u0627\u0644\u0648\u0633\u0627\u0626\u0637 \u0627\u0644\u0645\u062A\u0639\u062F\u062F\u0629", nameEn: "Multimedia", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "IT309", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u0642\u0645\u064A\u0629", nameEn: "Digital Signal Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS101"] },
                { code: "IS309", name: "\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Information Security", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
                { code: "IT310", name: "\u0646\u0638\u0645 \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u062D\u0642\u064A\u0642\u064A", nameEn: "Real Time Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS207"] },
                { code: "IS311", name: "\u0627\u0644\u062A\u0646\u0642\u064A\u0628 \u0639\u0646 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Mining", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IT312", name: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0631\u0648\u0628\u0648\u062A\u0627\u062A", nameEn: "Fundamentals of Robotic systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "IT313", name: "\u0648\u0627\u062C\u0647\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Interfaces", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS207"] },
                { code: "CS316", name: "\u0646\u0638\u0645 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0645\u062A\u0642\u062F\u0645", nameEn: "Advanced Operating Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS207"] },
                { code: "CS317", name: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u0645\u062A\u0642\u062F\u0645", nameEn: "Advanced Artificial Intelligence", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "CS318", name: "\u0627\u0644\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0645\u0646\u0637\u0642\u064A\u0629", nameEn: "Logic Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS102"] },
                { code: "CS319", name: "\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Software Engineering", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS308"] },
                { code: "IS321", name: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0648\u0636\u0645\u0627\u0646 \u062C\u0648\u062F\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Software Quality Testing and Assurance", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS308"] },
                { code: "IS322", name: "\u062A\u0642\u062F\u064A\u0631 \u062A\u0643\u0627\u0644\u064A\u0641 \u062A\u0637\u0648\u064A\u0631 \u0648\u0635\u064A\u0627\u0646\u0629 \u0645\u0634\u0627\u0631\u064A\u0639 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Estimating Costs for Developing and Maintaining Software Projects", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS308"] },
                { code: "CS320", name: "\u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0627\u062A \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u0648\u0644\u063A\u0629 \u0627\u0644\u062A\u062C\u0645\u064A\u0639", nameEn: "Microprocessors and Assembly Language", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "CS321", name: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u062A\u0637\u0648\u0631\u064A \u0648\u0627\u0644\u0633\u0631\u0628", nameEn: "Evolutionary and Swarm Intelligence", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "IS323", name: "\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0648\u064A\u0628", nameEn: "Web Applications", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS204"] },
                { code: "CS322", name: "\u0627\u0644\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0631\u0633\u0648\u0645\u064A\u0629 \u0627\u0644\u0627\u062D\u062A\u0645\u0627\u0644\u064A\u0629", nameEn: "Probabilistic Graphical Models", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
                { code: "CS323", name: "\u0635\u0646\u0639 \u0627\u0644\u0642\u0631\u0627\u0631 \u0641\u064A \u0638\u0644 \u0639\u062F\u0645 \u0627\u0644\u064A\u0642\u064A\u0646", nameEn: "Decision Making under Uncertainty", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "CS324", name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629 \u0627\u0644\u0645\u062A\u0642\u062F\u0645", nameEn: "Advanced Machine Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS313"] },
                { code: "CS325", name: "\u0627\u0644\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0639\u0645\u064A\u0642\u0629 \u0627\u0644\u062A\u0648\u0644\u064A\u062F\u064A\u0629", nameEn: "Deep Generative Models", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "CS326", name: "\u0627\u0644\u062A\u0639\u0644\u0645 \u0627\u0644\u0645\u0639\u0632\u0632", nameEn: "Reinforcement Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "CS327", name: "\u0627\u0644\u0628\u0631\u0645\u062C\u0629 \u0644\u062D\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0627\u062A", nameEn: "Programming for Problem Solving", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "CS328", name: "\u0627\u0644\u0646\u0645\u0630\u062C\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0648\u0643\u064A\u0644", nameEn: "Agent-Based Modelling", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "IT416", name: "\u0627\u0644\u0648\u0627\u0642\u0639 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0648\u0627\u0644\u0645\u0639\u0632\u0632", nameEn: "Virtual and Augmented Reality", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "IT418", name: "\u0627\u0644\u0646\u0638\u0645 \u0627\u0644\u0645\u062F\u0645\u062C\u0629", nameEn: "Embedded Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "IT420", name: "\u0627\u0644\u0648\u0633\u0627\u0626\u0637 \u0627\u0644\u0645\u062A\u0639\u062F\u062F\u0629 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Multimedia", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT307"] },
                { code: "IT423", name: "\u0627\u0646\u062A\u0631\u0646\u062A \u0627\u0644\u0623\u0634\u064A\u0627\u0621", nameEn: "Internet of Things", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IS426", name: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629", nameEn: "Big Data Analytics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS429", name: "\u062A\u0637\u0648\u064A\u0631 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u062D\u0645\u0648\u0644", nameEn: "Mobile Applications Development", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "IS431", name: "\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u0645\u0639\u0631\u0641\u0629", nameEn: "Knowledge Representation", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "CS436", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0644\u063A\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629", nameEn: "Natural Language Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "CS437", name: "\u0639\u0644\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
                { code: "CS438", name: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628\u064A", nameEn: "Computational Intelligence", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "CS439", name: "\u062A\u0639\u0631\u064A\u0628 \u0627\u0644\u062D\u0627\u0633\u0628\u0627\u062A", nameEn: "Computer Arabization", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "CS440", name: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Animations", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS314"] },
                { code: "CS441", name: "\u0627\u0644\u062A\u0639\u0644\u0645 \u0627\u0644\u0639\u0645\u064A\u0642", nameEn: "Deep Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS313"] },
                { code: "CS442", name: "\u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u0627\u0644\u0623\u0630\u0643\u064A\u0627\u0621", nameEn: "Intelligent Agents", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "CS449", name: "\u0627\u062A\u062C\u0627\u0647\u0627\u062A \u062C\u062F\u064A\u062F\u0629 \u0641\u064A \u0639\u0644\u0648\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "New trends in Computer Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2, allowCrossProgram: true }
              ]
            },
            IT: {
              name: "\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
              nameEn: "Information Technology",
              mandatory: [
                { code: "IT305", name: "\u0625\u0634\u0627\u0631\u0627\u062A \u0648\u0646\u0638\u0645", nameEn: "Signals and Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT202"] },
                { code: "IT306", name: "\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Computer Networks", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IT307", name: "\u0627\u0644\u0648\u0633\u0627\u0626\u0637 \u0627\u0644\u0645\u062A\u0639\u062F\u062F\u0629", nameEn: "Multimedia", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "IT308", name: "\u062A\u0623\u0645\u064A\u0646 \u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628 \u0627\u0644\u0622\u0644\u064A", nameEn: "Computer Network Security", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IT309", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u0631\u0642\u0645\u064A\u0629", nameEn: "Digital Signal Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS101"] },
                { code: "CS313", name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", nameEn: "Machine Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "CS314", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0635\u0648\u0631", nameEn: "Image Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "IT312", name: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0631\u0648\u0628\u0648\u062A", nameEn: "Fundamentals of Robotic systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS212"] },
                { code: "IT415", name: "\u0627\u0644\u0634\u0628\u0643\u0627\u062A \u0627\u0644\u0644\u0627\u0633\u0644\u0643\u064A\u0629 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629", nameEn: "Wireless and Mobile Networks", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IT416", name: "\u0627\u0644\u0648\u0627\u0642\u0639 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0648\u0627\u0644\u0645\u0639\u0632\u0632", nameEn: "Virtual and Augmented Reality", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "IT417", name: "\u0628\u0631\u0645\u062C\u0629 \u0627\u0644\u0634\u0628\u0643\u0627\u062A", nameEn: "Network Programming", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IT418", name: "\u0627\u0644\u0646\u0638\u0645 \u0627\u0644\u0645\u062F\u0645\u062C\u0629", nameEn: "Embedded Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "CS433", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062D\u0627\u0628\u064A\u0629", nameEn: "Cloud Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IT423", name: "\u0627\u0646\u062A\u0631\u0646\u062A \u0627\u0644\u0623\u0634\u064A\u0627\u0621", nameEn: "Internet of Things", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IS429", name: "\u062A\u0637\u0648\u064A\u0631 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u062D\u0645\u0648\u0644", nameEn: "Mobile Applications Development", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] }
              ],
              elective: [
                { code: "IS309", name: "\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Information Security", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
                { code: "IT310", name: "\u0646\u0638\u0645 \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u062D\u0642\u064A\u0642\u064A", nameEn: "Real Time Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS207"] },
                { code: "CS309", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u0631\u0646\u0629", nameEn: "Soft Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "IT311", name: "\u0627\u062F\u0627\u0631\u0629 \u0627\u0644\u0634\u0628\u0643\u0627\u062A", nameEn: "Network Management", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "CS312", name: "\u0628\u0646\u064A\u0629 \u0648\u062A\u0646\u0638\u064A\u0645 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Architecture and Organization", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS204"] },
                { code: "IT313", name: "\u0648\u0627\u062C\u0647\u0627\u062A \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Interfaces", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS207"] },
                { code: "CS315", name: "\u0627\u0644\u0631\u0633\u0645 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Graphics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "CS319", name: "\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Software Engineering", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS308"] },
                { code: "CS320", name: "\u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0627\u062A \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u0648\u0644\u063A\u0629 \u0627\u0644\u062A\u062C\u0645\u064A\u0639", nameEn: "Microprocessors and Assembly Language", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "IS323", name: "\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0648\u064A\u0628", nameEn: "Web Applications", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS204"] },
                { code: "IT419", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0643\u0644\u0627\u0645", nameEn: "Speech Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "IT420", name: "\u0627\u0644\u0648\u0633\u0627\u0626\u0637 \u0627\u0644\u0645\u062A\u0639\u062F\u062F\u0629 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Multimedia", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT307"] },
                { code: "IT421", name: "\u062A\u062E\u0637\u064A\u0637 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0634\u0628\u0643\u0627\u062A", nameEn: "Network Planning & Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IT422", name: "\u062A\u0641\u0627\u0639\u0644 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u0645\u0639 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Human Computer Interaction", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS101"] },
                { code: "IT424", name: "\u0627\u0644\u0623\u062F\u0644\u0629 \u0627\u0644\u0634\u0631\u0639\u064A\u0629 \u0641\u064A \u0627\u0644\u0634\u0628\u0643\u0627\u062A", nameEn: "Network Forensics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT202"] },
                { code: "IS426", name: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629", nameEn: "Big Data Analytics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IT425", name: "\u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u062F\u0645\u062C\u0629 \u0644\u0644\u0634\u0628\u0643\u0627\u062A", nameEn: "Networked Embedded Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IS431", name: "\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u0645\u0639\u0631\u0641\u0629", nameEn: "Knowledge Representation", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "CS430", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u062A\u0648\u0627\u0632\u064A\u0629 \u0648\u0627\u0644\u0645\u0648\u0632\u0639\u0629", nameEn: "Parallel and Distributed Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "CS432", name: "\u0627\u0644\u0631\u0624\u064A\u0629 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Vision", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "CS434", name: "\u0627\u0644\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0646\u0645\u0627\u0637", nameEn: "Pattern Recognition", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS313"] },
                { code: "CS436", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0644\u063A\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629", nameEn: "Natural Language Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "CS437", name: "\u0639\u0644\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
                { code: "CS440", name: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629 \u0628\u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Computer Animations", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS314"] },
                { code: "IT435", name: "\u0627\u062A\u062C\u0627\u0647\u0627\u062A \u062C\u062F\u064A\u062F\u0629 \u0641\u064A \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "New trends in Information Technology", theoreticalHours: 3, practicalHours: 2, creditHours: 2, allowCrossProgram: true }
              ]
            },
            IS: {
              name: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
              nameEn: "Information Systems",
              mandatory: [
                { code: "IS309", name: "\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Information Security", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] },
                { code: "IS310", name: "\u062A\u062E\u0632\u064A\u0646 \u0648\u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Information Storage and Retrieval", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS311", name: "\u0627\u0644\u062A\u0646\u0642\u064A\u0628 \u0639\u0646 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Mining", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS312", name: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0630\u0643\u064A\u0629", nameEn: "Intelligent Information Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"] },
                { code: "IS313", name: "\u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0646\u0638\u0645 \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Systems Analysis and Design", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS203"] },
                { code: "CS313", name: "\u062A\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u0629", nameEn: "Machine Learning", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "IS314", name: "\u0646\u0638\u0645 \u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Database Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS425", name: "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0632\u0639\u0629", nameEn: "Distributed Databases", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS314"] },
                { code: "IS426", name: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0643\u0628\u064A\u0631\u0629", nameEn: "Big Data Analytics", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS427", name: "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A\u0629", nameEn: "Geographical Information Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS428", name: "\u0646\u0638\u0645 \u062F\u0639\u0645 \u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0630\u0643\u064A", nameEn: "Intelligent Decision Support Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"] },
                { code: "IS429", name: "\u062A\u0637\u0648\u064A\u0631 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0647\u0627\u062A\u0641 \u0627\u0644\u0645\u062D\u0645\u0648\u0644", nameEn: "Mobile Applications Development", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS103"] },
                { code: "IS430", name: "\u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0645\u0631\u0626\u064A \u0644\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Visualization", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "CS433", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062D\u0627\u0628\u064A\u0629", nameEn: "Cloud Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "CS437", name: "\u0639\u0644\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Science", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS104"] }
              ],
              elective: [
                { code: "CS309", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u0631\u0646\u0629", nameEn: "Soft Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "IT307", name: "\u0627\u0644\u0648\u0633\u0627\u0626\u0637 \u0627\u0644\u0645\u062A\u0639\u062F\u062F\u0629", nameEn: "Multimedia", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS102"] },
                { code: "IT311", name: "\u0627\u062F\u0627\u0631\u0629 \u0627\u0644\u0634\u0628\u0643\u0627\u062A", nameEn: "Network Management", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IS315", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0648\u062A\u0646\u0638\u064A\u0645 \u0627\u0644\u0645\u0644\u0641\u0627\u062A", nameEn: "File Processing and Organization", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "IS316", name: "\u0646\u0638\u0645 \u062F\u0639\u0645 \u0627\u062A\u062E\u0627\u0630 \u0627\u0644\u0642\u0631\u0627\u0631", nameEn: "Decision Support Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"] },
                { code: "IS317", name: "\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Data Warehouses", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS318", name: "\u0623\u0645\u0646 \u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", nameEn: "Database Security", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS319", name: "\u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629", nameEn: "E-Commerce Technologies", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS203"] },
                { code: "IS320", name: "\u062A\u0643\u0627\u0645\u0644 \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062A", nameEn: "Enterprise Integration", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS203"] },
                { code: "IS321", name: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0648\u0636\u0645\u0627\u0646 \u062C\u0648\u062F\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Software Quality Testing and Assurance", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS308"] },
                { code: "CS319", name: "\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u0642\u062F\u0645\u0629", nameEn: "Advanced Software Engineering", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS308"] },
                { code: "IS322", name: "\u062A\u0642\u062F\u064A\u0631 \u062A\u0643\u0627\u0644\u064A\u0641 \u062A\u0637\u0648\u064A\u0631 \u0648\u0635\u064A\u0627\u0646\u0629 \u0645\u0634\u0627\u0631\u064A\u0639 \u0627\u0644\u0628\u0631\u0645\u062C\u064A\u0627\u062A", nameEn: "Estimating Costs for Developing and Maintaining Software Projects", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS308"] },
                { code: "IS323", name: "\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0648\u064A\u0628", nameEn: "Web Applications", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS204"] },
                { code: "IT422", name: "\u062A\u0641\u0627\u0639\u0644 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u0645\u0639 \u0627\u0644\u062D\u0627\u0633\u0628", nameEn: "Human Computer Interaction", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["BS101"] },
                { code: "IT423", name: "\u0623\u0646\u062A\u0631\u0646\u062A \u0627\u0644\u0623\u0634\u064A\u0627\u0621", nameEn: "Internet of Things", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IT203"] },
                { code: "IS431", name: "\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u0645\u0639\u0631\u0641\u0629", nameEn: "Knowledge Representation", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS202"] },
                { code: "IS432", name: "\u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0641\u064A \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0648\u0627\u0644\u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F\u0629", nameEn: "Information Systems Innovation and New Technologies", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS201"] },
                { code: "IS433", name: "\u0636\u0645\u0627\u0646 \u0627\u0644\u0623\u0645\u0646 \u0648\u0645\u0631\u0627\u062C\u0639\u0629 \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "Security Assurance and Information Systems Auditing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["IS309"] },
                { code: "CS430", name: "\u0627\u0644\u062D\u0648\u0633\u0628\u0629 \u0627\u0644\u0645\u062A\u0648\u0627\u0632\u064A\u0629 \u0648\u0627\u0644\u0645\u0648\u0632\u0639\u0629", nameEn: "Parallel and Distributed Computing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS205"] },
                { code: "CS431", name: "\u0627\u0644\u0646\u0645\u0630\u062C\u0629 \u0648\u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629", nameEn: "Modeling and Simulation", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS311"] },
                { code: "CS436", name: "\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0644\u063A\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629", nameEn: "Natural Language Processing", theoreticalHours: 3, practicalHours: 2, creditHours: 2, prerequisites: ["CS206"] },
                { code: "IS438", name: "\u0627\u062A\u062C\u0627\u0647\u0627\u062A \u062C\u062F\u064A\u062F\u0629 \u0641\u064A \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A", nameEn: "New trends in Information Systems", theoreticalHours: 3, practicalHours: 2, creditHours: 2, allowCrossProgram: true }
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
        gpaThreshold: 3,
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
        withoutExcuse: "fail",
        withExcuse: "withdrawn"
      }
    },
    attendance: {
      required: true,
      minimumAttendance: 75,
      maximumAbsence: 25,
      examEligibility: {
        minimumAttendance: 75,
        actionOnExceed: "prevent_exam"
      },
      examAbsence: {
        withoutExcuse: "fail",
        withExcuse: "incomplete",
        incompleteConditions: {
          minimumWorkGrade: 60,
          examWithinSemester: true
        }
      }
    },
    discontinuation: {
      definition: "no_registration",
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
        location: "both"
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
      duration: "full_year",
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
      gpaThreshold: 2,
      warningSystem: {
        firstWarning: {
          gpaThreshold: 2,
          appliesAfter: "first_semester"
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
        tieBreaker: "total_grade"
      }
    },
    grading: {
      system: "credit_hours",
      passingGrade: 50,
      minimumCGPA: 2,
      gradeScale: {
        A_plus: { min: 96, max: 100, points: 4 },
        A: { min: 92, max: 96, points: 3.7 },
        A_minus: { min: 88, max: 92, points: 3.4 },
        B_plus: { min: 84, max: 88, points: 3.2 },
        B: { min: 80, max: 84, points: 3 },
        B_minus: { min: 76, max: 80, points: 2.8 },
        C_plus: { min: 72, max: 76, points: 2.6 },
        C: { min: 68, max: 72, points: 2.4 },
        C_minus: { min: 64, max: 68, points: 2.2 },
        D_plus: { min: 60, max: 64, points: 2 },
        D: { min: 55, max: 60, points: 1.5 },
        D_minus: { min: 50, max: 55, points: 1 },
        F: { min: 0, max: 50, points: 0 },
        Abs: { points: 0 },
        Con: { points: 0, description: "\u0645\u0642\u0631\u0631 \u0645\u0633\u062A\u0645\u0631" },
        I: { points: 0, description: "\u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644" },
        W: { points: 0, description: "\u0645\u0646\u0633\u062D\u0628" }
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
        minimumCGPA: 3,
        minimumSemesterGPA: 3,
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ALL_STUDENTS,
  ATTENDANCE_RECORDS,
  CITIES,
  CLASSROOM_ASSIGNMENTS,
  COURSES_DATABASE,
  COURSE_SCHEDULES,
  DEPARTMENTS_FCAI,
  FCAI_STUDENTS,
  FINANCIAL_RECORDS,
  LEVELS,
  MOCK_DATABASE,
  NEW_REGULATION_STUDENTS,
  OLD_REGULATION_STUDENTS,
  REGULATIONS,
  STATUSES,
  STUDENT_ENROLLMENTS,
  STUDENT_GRADES,
  STUDENT_SCHEDULES,
  addRoomAssignment,
  createDefaultAcademicRules,
  deleteAcademicCourse,
  deleteAcademicDepartment,
  deleteAcademicFaculty,
  deleteAcademicProgram,
  deleteAcademicRegulation,
  deleteAcademicRules,
  getAcademicCourses,
  getAcademicDepartments,
  getAcademicFaculties,
  getAcademicPrograms,
  getAcademicRegulations,
  getAcademicRules,
  getAcademicRulesByFaculty,
  getCurrentAcademicContext,
  getDepartmentStatistics,
  getDynamicFeesCollect,
  getDynamicFeesSetup,
  getDynamicPaymentPerm,
  getPageConfig,
  getRoomAssignments,
  getStudentStatistics,
  saveAcademicCourse,
  saveAcademicDepartment,
  saveAcademicFaculty,
  saveAcademicProgram,
  saveAcademicRegulation,
  saveAcademicRules
});
