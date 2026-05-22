const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'data', 'mockData.ts');
const pageConfigPath = path.join(__dirname, 'data', 'pageConfig.ts');

let content = fs.readFileSync(mockDataPath, 'utf8');

// The file has imports at the top, and MOCK_DATABASE starts around export const MOCK_DATABASE
const mockDbIndex = content.indexOf('export const MOCK_DATABASE');
if (mockDbIndex === -1) {
  console.error('Could not find MOCK_DATABASE');
  process.exit(1);
}

const getPageConfigIndex = content.indexOf('export const getPageConfig');

const imports = `import { PageConfig, AcademicFaculty, AcademicDepartment, AcademicProgram, AcademicCourse, StudyRegulation, AcademicRules } from '../types';
import { FACULTIES } from '../constants';\n\n`;

let configContent = content.substring(mockDbIndex);

// We need to remove the `data: ...` properties from MOCK_DATABASE so we don't need the constant arrays.
// Because it's hard to parse perfectly without AST, we can just define empty arrays at the top of pageConfig.ts to satisfy typescript, or replace them.
const stubs = `
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
export const STUDENT_SCHEDULES: any[] = [];
export const FCAI_STUDENTS: any[] = [];
export const getCurrentAcademicContext = () => ({ semester: 'ربيع', academicYear: '2023-2024' });
export const getDynamicFeesSetup = () => [];
export const getDynamicFeesCollect = () => [];
export const getDynamicPaymentPerm = () => [];

`;

fs.writeFileSync(pageConfigPath, imports + stubs + configContent);
console.log('Created pageConfig.ts successfully');
