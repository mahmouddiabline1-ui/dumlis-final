import { LucideIcon } from 'lucide-react';

export type UserRole = 'super_admin' | 'faculty_admin' | 'student_affairs' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  faculty?: string; // Optional, for faculty admins
  avatar?: string;
}

export interface SubMenuItem {
  id: string;
  label: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  items: SubMenuItem[];
}

export interface MainTab {
  id: string;
  label: string;
  icon: LucideIcon;
  groups: MenuGroup[];
  role?: UserRole;
}

export interface Faculty {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  studentCount: number;
  staffCount: number;
  color: string;
}

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color: string;
}

// Database / Page Configuration Types
export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'currency' | 'progress' | 'file' | 'long_text' |
  'autocomplete' | 'readonly' | 'select' | 'multi_select' | 'course_list' | 'calculated';
  required?: boolean;
  validation?: {
    pattern?: string;
    message?: string;
  };
  auto_fill?: boolean;
  dynamic?: boolean;
  readonly?: boolean;
  options?: string[];
}

export interface Action {
  type: 'add' | 'edit' | 'delete' | 'view' | 'print' | 'export' | 'approve' | 'reject' | 'upload' |
  'save' | 'validate' | 'preview' | 'cancel' | 'auto_generate';
  label: string;
  primary?: boolean;
}

export interface PageConfig {
  id: string;
  title: string;
  description: string;
  type: 'table' | 'form' | 'dashboard' | 'request_form' | 'attendance_form' | 'smart_form' | 'student_data';
  columns?: Column[];
  data?: any[];
  actions?: Action[];
}

// Academic Structure Types
export interface AcademicFaculty {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  deanId?: string;
  deanName?: string;
  departments: string[]; // Department IDs
  createdAt: string;
  updatedAt: string;
}

export interface AcademicDepartment {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  facultyId: string;
  facultyName?: string;
  headId?: string;
  headName?: string;
  programs: string[]; // Program IDs
  createdAt: string;
  updatedAt: string;
}

export type ProgramDegree = 'بكالوريوس' | 'دبلوم' | 'ماجستير' | 'دكتوراه';
export type ProgramTrack = 'مسار واحد' | 'مسارين' | 'ثلاثة مسارات';

export interface AcademicProgram {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  degree: ProgramDegree;
  departmentId: string;
  departmentName?: string;
  totalHours: number;
  mandatoryHours: number;
  electiveHours: number;
  universityRequirements: number;
  tracks?: {
    id: string;
    name: string;
    courses: string[]; // Course IDs
  }[];
  regulationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyRegulation {
  id: string;
  name: string;
  programId: string;
  registrationRules: string;
  passFailRules: string;
  absencePolicy: string;
  mandatoryHours: number;
  electiveHours: number;
  universityRequirements: number;
  createdAt: string;
  updatedAt: string;
}

// Academic Rules and Regulations for Faculties
export interface AcademicRules {
  id: string;
  facultyId: string;
  facultyName?: string;
  
  // نظام الدراسة
  studySystem: {
    creditHoursSystem: boolean; // نظام الساعات المعتمدة
    academicYearStructure: {
      fallSemester: { weeks: number; startDate?: string };
      springSemester: { weeks: number; startDate?: string };
      summerSemester: { weeks: number; startDate?: string; enabled: boolean };
    };
    creditHourStandard: {
      theoretical: number; // ساعة نظرية = 1 ساعة معتمدة
      practical: number; // ساعة عملية = 2-3 ساعات معتمدة
      summerTraining: number; // التدريب الصيفي = 3 ساعات معتمدة
    };
    hybridLearning: {
      enabled: boolean;
      practicalCourses: {
        faceToFace: { min: number; max: number }; // 60-70%
        online: { min: number; max: number }; // 30-40%
      };
      theoreticalCourses: {
        faceToFace: { min: number; max: number }; // 50-60%
        online: { min: number; max: number }; // 40-50%
      };
    };
    electronicExams: {
      enabled: boolean;
      onCampus: boolean; // داخل الحرم الجامعي
      graduationProjects: boolean; // مناقشة مشاريع التخرج
    };
      graduationRequirements: {
        totalCreditHours: number; // 140 ساعة معتمدة
        minimumGPA: number; // 2.0
        minimumYears: number; // 3 سنوات
        includesUniversityRequirements: boolean;
        includesFacultyRequirements: boolean;
        includesMajorRequirements: boolean;
      };
      specializationStart: {
        level: number; // المستوى الثالث
        sharedLevels: number[]; // المستوى الأول والثاني مشتركة
      };
      levelProgression: {
        level1: {
          name: string; // Freshman
          maxCreditHours: number; // 30 ساعة
          description: string;
        };
        level2: {
          name: string; // Sophomore
          requiredCreditHours: number; // 30 ساعة
          description: string;
        };
        level3: {
          name: string; // Junior
          requiredCreditHours: number; // 66 ساعة
          description: string;
          specializationRequired: boolean;
        };
        level4: {
          name: string; // Senior
          requiredCreditHours: number; // 102 ساعة
          description: string;
        };
      };
      studyPlan: {
        // المستوى الأول والثاني مشتركان لجميع البرامج
        commonLevels: {
          level1: {
            fall: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
              type?: 'mandatory' | 'elective';
              category?: string; // متطلبات الجامعة، العلوم الأساسية، الكلية
            }>;
            spring: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
              type?: 'mandatory' | 'elective';
              category?: string;
            }>;
          };
          level2: {
            fall: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
              type?: 'mandatory' | 'elective';
              category?: string;
            }>;
            spring: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
              type?: 'mandatory' | 'elective';
              category?: string;
            }>;
          };
        };
        // المستوى الثالث والرابع مختلف لكل برنامج
        programLevels: {
          CS: {
            level3: {
              fall: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
              spring: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
            };
            level4: {
              fall: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
              spring: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
            };
          };
          IT: {
            level3: {
              fall: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
              spring: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
            };
            level4: {
              fall: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
              spring: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
            };
          };
          IS: {
            level3: {
              fall: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
              spring: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
            };
            level4: {
              fall: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
              spring: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                type?: 'mandatory' | 'elective';
              }>;
            };
          };
        };
      };
      graduationRequirementsDetails: {
        universityRequirements: {
          totalHours: number; // 10 ساعات
          percentage: number; // 7.14%
          percentageRange: { min: number; max: number }; // 8-10%
          notCountedInCGPA: boolean;
          courses: Array<{
            code: string;
            name: string;
            nameEn?: string;
            theoreticalHours: number;
            practicalHours: number;
            creditHours: number;
            prerequisites?: string[];
          }>;
        };
        basicSciences: {
          totalHours: number; // 21 ساعة
          mandatoryHours: number; // 15 ساعة
          electiveHours: number; // 6 ساعات
          percentage: number; // 15%
          percentageRange: { min: number; max: number }; // 16-18%
          courses: {
            mandatory: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
            }>;
            elective: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
            }>;
          };
        };
        facultyRequirements: {
          totalHours: number; // 45 ساعة
          mandatoryHours: number; // 39 ساعة
          electiveHours: number; // 6 ساعات
          percentage: number; // 32.14%
          percentageRange: { min: number; max: number }; // 32-36%
          courses: {
            mandatory: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
            }>;
            elective: Array<{
              code: string;
              name: string;
              nameEn?: string;
              theoreticalHours: number;
              practicalHours: number;
              creditHours: number;
              prerequisites?: string[];
            }>;
          };
        };
        majorRequirements: {
          totalHours: number; // 57 ساعة
          mandatoryHours: number; // 45 ساعة
          electiveHours: number; // 12 ساعة
          percentage: number; // 40.71%
          percentageRange: { min: number; max: number }; // 34-40%
          programs: {
            CS: {
              name: string; // علوم الحاسب
              nameEn: string; // Computer Science
              mandatory: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
              }>;
              elective: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                allowCrossProgram?: boolean; // يسمح باختيار مقرر من تخصص آخر
              }>;
            };
            IT: {
              name: string; // تكنولوجيا المعلومات
              nameEn: string; // Information Technology
              mandatory: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
              }>;
              elective: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                allowCrossProgram?: boolean;
              }>;
            };
            IS: {
              name: string; // نظم المعلومات
              nameEn: string; // Information Systems
              mandatory: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
              }>;
              elective: Array<{
                code: string;
                name: string;
                nameEn?: string;
                theoreticalHours: number;
                practicalHours: number;
                creditHours: number;
                prerequisites?: string[];
                allowCrossProgram?: boolean;
              }>;
            };
          };
        };
        practicalTraining: {
          hours: number; // 3 ساعات
          percentage: number; // 2.15%
          percentageRange: { min: number; max: number }; // 3-5%
          preventSummerRegistration: boolean;
        };
        graduationProject: {
          hours: number; // 4 ساعات
          percentage: number; // 2.86%
          percentageRange: { min: number; max: number }; // 3-5%
        };
      };
    };
  
  // مواعيد الدراسة والتخرج
  academicCalendar: {
    graduationDates: {
      january: boolean; // دور يناير
      june: boolean; // دور يونيو
      september: boolean; // دور سبتمبر
    };
  };
  
  // التسجيل والحذف والإضافة
  registration: {
    minimumStudentsPerCourse: number;
    minimumCreditHours: number; // 12 ساعة
    maximumCreditHours: number; // 19 ساعة
    maximumCreditHoursWithGPA: {
      enabled: boolean;
      gpaThreshold: number; // 3.00
      maxHours: number; // 22 ساعة
    };
    maximumCreditHoursLastSemester: number; // 22 ساعة في آخر فصل
    summerMaximumHours: number; // 9 ساعات في الصيف
    addDropDeadline: {
      weeks: number; // نهاية الأسبوع الثاني
      maxHours: number; // 6 ساعات
      summerMaxHours: number; // 3 ساعات
    };
    prerequisites: {
      required: boolean;
      allowHigherLevel: boolean;
    };
  };
  
  // الانسحاب من المقرر
  withdrawal: {
    deadline: {
      weeks: number; // نهاية الأسبوع السابع
      minimumHoursAfterWithdrawal: number; // 12 ساعة
    };
    afterDeadline: {
      withoutExcuse: 'fail'; // راسب
      withExcuse: 'withdrawn'; // منسحب
    };
  };
  
  // الحضور والغياب
  attendance: {
    required: boolean; // نظامية
    minimumAttendance: number; // 75%
    maximumAbsence: number; // 25%
    examEligibility: {
      minimumAttendance: number; // 75%
      actionOnExceed: 'warning' | 'prevent_exam' | 'fail';
    };
    examAbsence: {
      withoutExcuse: 'fail'; // غ أو FA
      withExcuse: 'incomplete'; // غير مكتمل
      incompleteConditions: {
        minimumWorkGrade: number; // 60% من أعمال السنة
        examWithinSemester: boolean; // في أول فصل يتم طرح المقرر
      };
    };
  };
  
  // الانقطاع عن الدراسة
  discontinuation: {
    definition: 'no_registration' | 'all_withdrawn';
    allowedWithoutExcuse: {
      consecutive: number; // فصلين متتالين
      nonConsecutive: number; // 4 فصول غير متتالية
    };
    suspensionRequestDeadline: {
      weeks: number; // نهاية الأسبوع السابع
    };
  };
  
  // نظام الامتحانات
  exams: {
    totalGrade: number; // 100 درجة
    passingGrade: number; // 50%
    gradeDistribution: {
      theoreticalPractical: {
        midterm: number; // 20
        oral: number; // 10
        practical: number; // 15
        assignments: number; // 10
        finalWritten: number; // 60
      };
      theoreticalOnly: {
        midterm: number; // 15
        oral: number; // 10
        assignments: number; // 10
        finalWritten: number; // 50
      };
    };
  };
  
  // التدريب العملي
    practicalTraining: {
      enabled: boolean;
      creditHours: number; // 3 ساعات
      minimumCreditHours: number; // 70 ساعة معتمدة
      duration: {
        weeks: number; // 3 أسابيع
        location: 'inside' | 'outside' | 'both';
      };
      summerConflict: {
        preventSummerRegistration: boolean;
      };
      graduationRequirement: boolean;
    };
    
    // مشروع التخرج
    graduationProject: {
      enabled: boolean;
      creditHours: number; // 4 ساعات
      minimumCreditHours: number; // 102 ساعة كحد أدنى
      supervision: {
        required: boolean;
        byFacultyMember: boolean;
        departmentNomination: boolean;
      };
      duration: 'full_year' | 'semester';
      evaluation: {
        supervisor: {
          percentage: number; // 40%
          oral: number; // 20%
          periodicFollowUp: number; // 20%
        };
        committee: {
          percentage: number; // 60%
          members: number; // 3 أعضاء
        };
      };
      discussion: {
        endOfYear: boolean;
        scheduleByDepartment: boolean;
      };
    };
    
    // وضع الطالب تحت الملاحظة الأكاديمية والفصل
    academicWarning: {
      enabled: boolean;
      firstSemesterExempt: boolean;
      gpaThreshold: number; // 2.0
      warningSystem: {
        firstWarning: {
          gpaThreshold: number; // أقل من 2.0
          appliesAfter: 'first_semester'; // بعد الفصل الأول
        };
        secondWarning: {
          maxSemesters: number; // 4 فصول
          notificationToGuardian: boolean;
        };
        dismissal: {
          afterWarnings: boolean;
          maxSemesters: number; // 4 فصول
        };
      };
      additionalOpportunity: {
        enabled: boolean;
        conditions: {
          minimumCreditHours: number; // 112 ساعة
          requiresApproval: boolean;
        };
        allowedSemesters: {
          regular: number; // 2 فصلين
          summer: number; // 1 صيفي
        };
      };
      registrationLimit: {
        underWarning: number; // 13 ساعة
        graduationSemester: {
          allowOneMore: boolean;
        };
      };
      summerExempt: boolean;
      suspensionNotCounted: boolean;
      ranking: {
        byCGPA: boolean;
        tieBreaker: 'total_grade';
      };
    };
    
    // نظام التقييم
    grading: {
      system: 'credit_hours';
      passingGrade: number; // 50
      minimumCGPA: number; // 2.0
      gradeScale: {
        A_plus: { min: number; max: number; points: number }; // 96%+, 4.0
        A: { min: number; max: number; points: number }; // 92-96, 3.7
        A_minus: { min: number; max: number; points: number }; // 88-92, 3.4
        B_plus: { min: number; max: number; points: number }; // 84-88, 3.2
        B: { min: number; max: number; points: number }; // 80-84, 3.0
        B_minus: { min: number; max: number; points: number }; // 76-80, 2.8
        C_plus: { min: number; max: number; points: number }; // 72-76, 2.6
        C: { min: number; max: number; points: number }; // 68-72, 2.4
        C_minus: { min: number; max: number; points: number }; // 64-68, 2.2
        D_plus: { min: number; max: number; points: number }; // 60-64, 2.0
        D: { min: number; max: number; points: number }; // 55-60, 1.5
        D_minus: { min: number; max: number; points: number }; // 50-55, 1.0
        F: { min: number; max: number; points: number }; // أقل من 50, 0
        Abs: { points: number }; // 0
        Con: { points: number; description: string }; // مستمر
        I: { points: number; description: string }; // غير مكتمل
        W: { points: number; description: string }; // منسحب
      };
      overallRating: {
        very_weak: { min: number; max: number };
        weak: { min: number; max: number };
        acceptable: { min: number; max: number };
        good: { min: number; max: number };
        very_good: { min: number; max: number };
        excellent: { min: number; max: number };
      };
      honors: {
        enabled: boolean;
        minimumCGPA: number; // 3.0
        minimumSemesterGPA: number; // 3.0 لكل فصل
        noFailures: boolean;
        maxYears: number; // 4 سنوات
        excludeSuspension: boolean;
      };
    };
    
    // الرسوب والإعادة
    retake: {
      failedCourse: {
        enabled: boolean;
        maxGradeAfterRetake: number; // 83 (B)
        countHoursOnce: boolean;
        showInTranscript: boolean;
      };
      improvementToAvoidDismissal: {
        enabled: boolean;
        maxGradeAfterRetake: number; // 83
        levelRestriction: {
          sameLevel: boolean;
          oneLevelBelow: boolean;
        };
        noMaxLimit: boolean;
        countHoursOnce: boolean;
        showInTranscript: boolean;
        payment: {
          equalsSummerFee: boolean;
          requiresApproval: boolean;
        };
      };
      improvementForBetterGPA: {
        enabled: boolean;
        maxGradeAfterRetake: number; // 83
        maxCourses: number; // 3 مقررات
        levelRestriction: {
          sameLevel: boolean;
          oneLevelBelow: boolean;
        };
        countHoursOnce: boolean;
        showInTranscript: boolean;
      };
    };
    
    // تعديل المسار (تغيير البرنامج)
    programChange: {
      enabled: boolean;
      allowedLevel: number; // المستوى الثالث
      requirements: {
        meetAdmissionCriteria: boolean;
        advisorApproval: boolean;
        departmentApproval: boolean;
        committeeApproval: boolean;
        councilApproval: boolean;
      };
      creditTransfer: {
        enabled: boolean;
        basedOnNewProgram: boolean;
      };
      levelAssignment: {
        basedOnCredits: boolean;
      };
    };
    
    // الرحلات العلمية
    scientificTrips: {
      enabled: boolean;
      organization: {
        byDepartment: boolean;
        supervisedByFaculty: boolean;
      };
      duration: {
        min: number; // 1 يوم
        max: number; // 5 أيام
      };
      requirements: {
        report: boolean;
        presentation: boolean;
        toDepartment: boolean;
      };
      creditHours: number; // 0 (لا تحتسب)
    };
    
    createdAt: string;
    updatedAt: string;
}

export interface AcademicCourse {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  departmentId: string;
  departmentName?: string;
  programId: string;
  programName?: string;
  theoreticalHours: number;
  practicalHours: number;
  totalHours: number;
  prerequisites: string[]; // Course IDs
  description?: string;
  syllabus?: string;
  level: number;
  semester: 'خريف' | 'ربيع' | 'صيفي';
  type: 'إجباري' | 'اختياري' | 'متطلب جامعة';
  createdAt: string;
  updatedAt: string;
}

// Student Data Management Types
export type MilitaryStatus = 'معاف' | 'مجند' | 'مؤجل' | 'لم يحدد' | 'أدى الخدمة';

export interface StudentPersonalData {
  name: string;
  nameEn: string;
  nationalId: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  religion: string;
  gender: 'ذكر' | 'أنثى';
  image?: string;
}

export interface StudentContactData {
  phone: string;
  email: string;
  address: {
    governorate: string;
    city: string;
    street: string;
    buildingNumber?: string;
    details?: string;
  };
}

export interface StudentFamilyData {
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianJob?: string;
  guardianNationalId?: string;
}

export interface StudentQualificationData {
  qualificationType: 'thanaweya_amma' | 'thanaweya_azharia' | 'stem' | 'equivalent';
  qualificationYear: string;
  schoolName: string;
  seatNumber: string; // رقم الجلوس
  totalDegree: number;
  percentage: number;
  division?: 'scientific_science' | 'scientific_math' | 'literary'; // الشعبة
  qualificationDate: string;
}

export interface StudentMedicalData {
  bloodType?: string;
  medicalStatus: 'fit' | 'special_needs' | 'chronic_disease';
  needsBraille?: boolean;
  chronicDiseaseDetails?: string;
  disabilityType?: string;
  vaccinationStatus: 'vaccinated' | 'not_vaccinated';
  lastCheckupDate?: string;
}

export interface StudentMilitaryEducationData {
  status: 'completed' | 'not_completed' | 'exempt';
  completionDate?: string;
  notes?: string;
}

export interface StudentMilitaryData {
  status: MilitaryStatus;
  tripleNumber?: string; // الرقم الثلاثي
  militaryId?: string; // الرقم العسكري
  postponementDate?: string; // تاريخ التأجيل
  postponementReason?: string; // سبب التأجيل
  notes?: string;
}

export interface StudentAcademicData {
  studentCode: string;
  faculty: string;
  department: string;
  program: string;
  level: number;
  gpa: number;
  enrollmentYear: string;
  status: 'active' | 'graduated' | 'suspended' | 'dismissed';
  regulationType: 'new' | 'old';
}

export interface StudentProfile {
  id: string;
  personal: StudentPersonalData;
  contact: StudentContactData;
  family: StudentFamilyData;
  qualification: StudentQualificationData;
  military: StudentMilitaryData;
  militaryEducation: StudentMilitaryEducationData;
  medical: StudentMedicalData;
  academic: StudentAcademicData;
}

export interface ReportSignature {
  id: string;
  report_name: string; // e.g., "Student Affairs Report"
  signatory_name: string; // e.g., "Dr. Mohamed Ali"
  title: string; // e.g., "Dean of Faculty"
  order: number; // For sorting signatures on the page
  is_active: boolean;
}

export interface RegistrationRequest {
  id: string;
  faculty_id?: string;
  student_id: string;
  student_name?: string;
  request_date?: string;
  comment?: string;
  admin_response?: string;
  status: string;
  created_at?: string;
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

export interface CourseEquivalence {
  id: number;
  student_id: string;
  student_name?: string;
  original_course_id: string;
  equivalent_course_id: string;
  status: string;
  course_code?: string;
  equivalent_course?: string;
}