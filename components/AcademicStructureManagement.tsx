import React, { useState, useEffect } from 'react';
import { 
  Building2, GraduationCap, BookOpen, FileText, Plus, Edit, Trash2, 
  Save, X, ChevronRight, ChevronLeft, CheckCircle2, Clock, Award, 
  Users, Search, AlertCircle, ArrowRight, ArrowLeft
} from 'lucide-react';
import { 
  AcademicFaculty, AcademicDepartment, AcademicProgram, AcademicCourse,
  StudyRegulation, ProgramDegree, AcademicRules
} from '../types';
import {
  facultiesApi, departmentsApi, programsApi, regulationsApi, coursesApi, academicRulesApi
} from '../api';
import { FACULTIES } from '../constants';
import SimpleAcademicRulesEditor from './SimpleAcademicRulesEditor';

interface AcademicStructureManagementProps {
  onClose: () => void;
  facultyId?: string;
}

type WizardStep = 'faculties' | 'departments' | 'programs' | 'regulations' | 'courses' | 'academic_rules';
type ManagementMode = 'add' | 'edit';

const AcademicStructureManagement: React.FC<AcademicStructureManagementProps> = ({ onClose, facultyId }) => {
  const [showModeSelection, setShowModeSelection] = useState<boolean>(!!facultyId);
  const [managementMode, setManagementMode] = useState<ManagementMode | null>(null);
  const [currentStep, setCurrentStep] = useState<WizardStep>('faculties');
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());
  const [activeEditTab, setActiveEditTab] = useState<'departments' | 'programs' | 'regulations' | 'courses' | 'academic_rules'>('departments');
  
  // Data States
  const [faculties, setFaculties] = useState<AcademicFaculty[]>([]);
  const [departments, setDepartments] = useState<AcademicDepartment[]>([]);
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [regulations, setRegulations] = useState<StudyRegulation[]>([]);
  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [academicRules, setAcademicRules] = useState<AcademicRules | null>(null);

  // Editing States
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editingRegulationId, setEditingRegulationId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [selectedGlobalFacultyId, setSelectedGlobalFacultyId] = useState<string | null>(null);

  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [isAddingRegulation, setIsAddingRegulation] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  // Load data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch ALL base data (we'll filter later if needed)
        const [allFacs, allDeptsRaw, allProgsRaw, allRegsRaw, allCoursesRaw] = await Promise.all([
          facultiesApi.list(),
          departmentsApi.list(facultyId),
          programsApi.list({ faculty_id: facultyId }),
          regulationsApi.list({ faculty_id: facultyId }),
          coursesApi.list({ faculty_id: facultyId })
        ]);

        // 2. Map API responses to UI types (handle snake_case -> camelCase)
        const safeFacs = Array.isArray(allFacs) ? allFacs : [];
        const safeProgs = Array.isArray(allProgsRaw) ? allProgsRaw : [];
        const safeRegs = Array.isArray(allRegsRaw) ? allRegsRaw : [];
        const safeDepts = Array.isArray(allDeptsRaw) ? allDeptsRaw : [];
        const safeCourses = Array.isArray(allCoursesRaw) ? allCoursesRaw : [];

        const mappedProgs: AcademicProgram[] = safeProgs.map(p => ({
          ...p,
          nameEn: p.name_en,
          departmentId: p.department_id,
          totalHours: p.total_hours,
          mandatoryHours: p.mandatory_hours,
          electiveHours: p.elective_hours,
          universityRequirements: p.university_requirements,
          createdAt: p.created_at || new Date().toISOString(),
          updatedAt: p.updated_at || new Date().toISOString()
        } as any));

        const mappedRegs: StudyRegulation[] = safeRegs.map(r => ({
          ...r,
          programId: r.program_id,
          registrationRules: r.registration_rules || '',
          passFailRules: r.pass_fail_rules || '',
          absencePolicy: r.absence_policy || '',
          mandatoryHours: r.mandatory_hours,
          electiveHours: r.elective_hours,
          universityRequirements: r.university_requirements,
          createdAt: r.created_at || new Date().toISOString(),
          updatedAt: r.updated_at || new Date().toISOString()
        } as any));

        const mappedDepts: AcademicDepartment[] = safeDepts.map(d => ({
          ...d,
          nameEn: (d as any).name_en || '',
          facultyId: (d as any).faculty_id || '',
          headName: (d as any).head_name || '',
          programs: mappedProgs.filter(p => p.departmentId === d.id).map(p => p.id),
          createdAt: (d as any).created_at || new Date().toISOString(),
          updatedAt: (d as any).updated_at || new Date().toISOString()
        }));

        const mappedCourses: AcademicCourse[] = safeCourses.map(c => ({
          id: c.id,
          code: (c as any).code || c.id,
          name: c.name,
          nameEn: c.name_en || '',
          departmentId: c.department_id || '',
          departmentName: safeDepts.find(d => d.id === c.department_id)?.name || '',
          programId: (c as any).program_id || '',
          programName: safeProgs.find(p => p.id === (c as any).program_id)?.name || '',
          theoreticalHours: c.theoretical_hours || 2,
          practicalHours: c.practical_hours || 2,
          totalHours: (c.theoretical_hours || 0) + (c.practical_hours || 0) || c.credit_hours,
          prerequisites: c.prerequisites || [],
          description: c.description || '',
          syllabus: c.syllabus || '',
          level: typeof c.level === 'number' ? c.level : (parseInt(String(c.level)) || 1),
          semester: c.semester || 'خريف',
          type: c.course_type === 'mandatory' ? 'إجباري' : 'اختياري',
          createdAt: c.created_at || new Date().toISOString(),
          updatedAt: c.updated_at || new Date().toISOString()
        } as any));

        const mappedFaculties: AcademicFaculty[] = safeFacs.map(f => ({
          ...f,
          nameEn: f.name_en,
          departments: safeDepts.filter(d => (d as any).faculty_id === f.id).map(d => d.id),
          createdAt: f.created_at || new Date().toISOString(),
          updatedAt: f.updated_at || new Date().toISOString()
        } as any));

        // 3. Filter if facultyId is provided
        if (facultyId) {
          try {
            const rulesResp = await academicRulesApi.getByFaculty(facultyId);
            if (rulesResp && rulesResp.rules_data) {
              setAcademicRules(rulesResp.rules_data as AcademicRules);
            }
          } catch (err) {
            console.log("No rules found in DB for facultyId:", facultyId);
          }

          const currentFacDeptIds = new Set(safeDepts.map(d => d.id));
          setFaculties(mappedFaculties.filter(f => f.id === facultyId || f.code === facultyId));
          setDepartments(mappedDepts);
          setPrograms(mappedProgs.filter(p => currentFacDeptIds.has(p.departmentId)));
          const facProgIds = new Set(mappedProgs.filter(p => currentFacDeptIds.has(p.departmentId)).map(p => p.id));
          setRegulations(mappedRegs.filter(r => facProgIds.has(r.programId)));
          setCourses(mappedCourses.filter(c => currentFacDeptIds.has(c.departmentId)));
        } else {
          // General view
          setFaculties(mappedFaculties);
          setDepartments(mappedDepts);
          setPrograms(mappedProgs);
          setRegulations(mappedRegs);
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Error fetching academic structure data:", error);
      }
    };

    fetchData();

    if (facultyId && managementMode === 'edit') {
        setCurrentStep('departments');
        setCompletedSteps(new Set(['faculties']));
    }
  }, [facultyId, managementMode]);

  // Form States for each step
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    nameEn: '',
    code: '',
    deanId: '',
    deanName: ''
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    nameEn: '',
    code: '',
    facultyId: '',
    headId: '',
    headName: ''
  });

  const [programForm, setProgramForm] = useState({
    name: '',
    nameEn: '',
    code: '',
    degree: 'بكالوريوس' as ProgramDegree,
    departmentId: '',
    totalHours: '',
    mandatoryHours: '',
    electiveHours: '',
    universityRequirements: '',
    tracks: [] as { id: string; name: string; courses: string[] }[]
  });

  const [regulationForm, setRegulationForm] = useState({
    name: '',
    programId: '',
    registrationRules: '',
    passFailRules: '',
    absencePolicy: '',
    mandatoryHours: '',
    electiveHours: '',
    universityRequirements: ''
  });

  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    nameEn: '',
    departmentId: '',
    programId: '',
    theoreticalHours: '',
    practicalHours: '',
    totalHours: '',
    prerequisites: [] as string[],
    level: '',
    semester: 'خريف' as 'خريف' | 'ربيع' | 'صيفي',
    type: 'إجباري' as 'إجباري' | 'اختياري' | 'متطلب جامعة',
    description: '',
    syllabus: ''
  });

  const steps: { id: WizardStep; label: string; icon: any; description: string }[] = [
    { 
      id: 'faculties', 
      label: 'إدارة الكليات', 
      icon: Building2,
      description: 'إضافة وتعديل الكليات وتحديد عمداء الكليات'
    },
    { 
      id: 'departments', 
      label: 'إدارة الأقسام', 
      icon: GraduationCap,
      description: 'ربط الأقسام بالكليات وتحديد رؤساء الأقسام'
    },
    { 
      id: 'programs', 
      label: 'إدارة البرامج', 
      icon: BookOpen,
      description: 'إنشاء البرامج الأكاديمية وتحديد المسارات'
    },
    { 
      id: 'regulations', 
      label: 'إدارة اللوائح', 
      icon: FileText,
      description: 'قواعد التسجيل والرسوب والغياب'
    },
    { 
      id: 'courses', 
      label: 'إدارة المقررات', 
      icon: Award,
      description: 'إضافة المقررات والمتطلبات السابقة'
    },
    { 
      id: 'academic_rules', 
      label: 'القواعد الأكاديمية', 
      icon: FileText,
      description: 'إدارة القواعد واللوائح الأكاديمية للكلية'
    }
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: WizardStep) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const targetIndex = steps.findIndex(s => s.id === stepId);
    
    // Allow going back or to completed steps
    if (targetIndex <= currentIndex || completedSteps.has(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFacultyId) {
        await facultiesApi.update(editingFacultyId, {
          name: facultyForm.name,
          name_en: facultyForm.nameEn,
          code: facultyForm.code,
        });
        alert('تم تحديث الكلية بنجاح!');
      } else {
        await facultiesApi.create({
          id: facultyForm.code || `FAC-${Date.now()}`,
          name: facultyForm.name,
          name_en: facultyForm.nameEn,
          code: facultyForm.code,
        });
        alert('تم إضافة الكلية بنجاح!');
      }
      
      const allFacs = await facultiesApi.list();
      setFaculties(allFacs.map(f => ({
        ...f,
        nameEn: f.name_en,
        departments: [], 
        createdAt: f.created_at || new Date().toISOString(),
        updatedAt: f.updated_at || new Date().toISOString()
      })));
      
      setEditingFacultyId(null);
      setFacultyForm({ name: '', nameEn: '', code: '', deanId: '', deanName: '' });
    } catch (error) {
      console.error("Error saving faculty:", error);
      alert('حدث خطأ أثناء حفظ الكلية');
    }
  };

  const handleEditFaculty = (faculty: AcademicFaculty) => {
    setEditingFacultyId(faculty.id);
    setFacultyForm({
      name: faculty.name,
      nameEn: faculty.nameEn || '',
      code: faculty.code,
      deanId: faculty.deanId || '',
      deanName: faculty.deanName || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFaculty = async (facultyId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الكلية؟ سيتم حذف جميع الأقسام والبرامج المرتبطة بها.')) {
      try {
        await facultiesApi.delete(facultyId);
        const allFacs = await facultiesApi.list();
        setFaculties(allFacs.map(f => ({
          ...f,
          nameEn: f.name_en,
          departments: [],
          createdAt: f.created_at || new Date().toISOString(),
          updatedAt: f.updated_at || new Date().toISOString()
        })));
        alert('تم حذف الكلية بنجاح!');
      } catch (error) {
        console.error("Error deleting faculty:", error);
      }
    }
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentForm.facultyId) {
      alert('يرجى اختيار الكلية أولاً');
      return;
    }
    
    try {
      if (editingDepartmentId) {
        await departmentsApi.update(editingDepartmentId, {
          name: departmentForm.name,
          name_en: departmentForm.nameEn,
          code: departmentForm.code,
          faculty_id: departmentForm.facultyId,
          head_name: departmentForm.headName
        });
        alert('تم تحديث القسم بنجاح!');
      } else {
        await departmentsApi.create({
          id: `DEPT-${Date.now()}`,
          name: departmentForm.name,
          name_en: departmentForm.nameEn,
          code: departmentForm.code,
          faculty_id: departmentForm.facultyId,
          head_name: departmentForm.headName
        });
        alert('تم إضافة القسم بنجاح!');
      }
      
      // Refresh departments
      const allDepts = await departmentsApi.list(facultyId);
      setDepartments(allDepts.map(d => ({
        ...d,
        nameEn: (d as any).name_en,
        facultyId: (d as any).faculty_id,
        headName: (d as any).head_name,
        programs: [],
        createdAt: (d as any).created_at || new Date().toISOString(),
        updatedAt: (d as any).updated_at || new Date().toISOString()
      })));
      
      setEditingDepartmentId(null);
      const currentFacultyId = facultyId ? (faculties[0]?.id || facultyId) : '';
      setDepartmentForm({ name: '', nameEn: '', code: '', facultyId: currentFacultyId, headId: '', headName: '' });
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleEditDepartment = (department: AcademicDepartment) => {
    setEditingDepartmentId(department.id);
    setDepartmentForm({
      name: department.name,
      nameEn: department.nameEn || '',
      code: department.code,
      facultyId: department.facultyId,
      headId: department.headId || '',
      headName: department.headName || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع البرامج المرتبطة به.')) {
      try {
        await departmentsApi.delete(departmentId);
        const allDepts = await departmentsApi.list(facultyId);
        setDepartments(allDepts.map(d => ({
          ...d,
          nameEn: (d as any).name_en,
          facultyId: (d as any).faculty_id,
          headName: (d as any).head_name,
          programs: [],
          createdAt: (d as any).created_at || new Date().toISOString(),
          updatedAt: (d as any).updated_at || new Date().toISOString()
        })));
        alert('تم حذف القسم بنجاح!');
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.departmentId) {
      alert('يرجى اختيار القسم أولاً');
      return;
    }
    
    try {
      const programData = {
        name: programForm.name,
        name_en: programForm.nameEn,
        code: programForm.code,
        degree: programForm.degree,
        department_id: programForm.departmentId,
        faculty_id: facultyId,
        total_hours: parseInt(programForm.totalHours),
        mandatory_hours: parseInt(programForm.mandatoryHours),
        elective_hours: parseInt(programForm.electiveHours),
        university_requirements: parseInt(programForm.universityRequirements),
        tracks: programForm.tracks
      };

      if (editingProgramId) {
        await programsApi.update(editingProgramId, programData as any);
        alert('تم تحديث البرنامج بنجاح!');
      } else {
        await programsApi.create({
          id: `PROG-${Date.now()}`,
          ...programData
        } as any);
        alert('تم إضافة البرنامج بنجاح!');
      }
      
      // Refresh programs
      const allProgs = await programsApi.list();
      setPrograms(allProgs.map(p => ({
        ...p,
        nameEn: p.name_en,
        departmentId: p.department_id,
        totalHours: p.total_hours,
        mandatoryHours: p.mandatory_hours,
        electiveHours: p.elective_hours,
        universityRequirements: p.university_requirements,
        createdAt: p.created_at || new Date().toISOString(),
        updatedAt: p.updated_at || new Date().toISOString()
      } as any)));
      
      setEditingProgramId(null);
      setProgramForm({
        name: '', nameEn: '', code: '', degree: 'بكالوريوس',
        departmentId: '', totalHours: '', mandatoryHours: '', electiveHours: '', universityRequirements: '', tracks: []
      });
    } catch (error) {
      console.error("Error saving program:", error);
    }
  };

  const handleEditProgram = (program: AcademicProgram) => {
    setEditingProgramId(program.id);
    setProgramForm({
      name: program.name,
      nameEn: program.nameEn || '',
      code: program.code,
      degree: program.degree,
      departmentId: program.departmentId,
      totalHours: program.totalHours.toString(),
      mandatoryHours: program.mandatoryHours.toString(),
      electiveHours: program.electiveHours.toString(),
      universityRequirements: program.universityRequirements.toString(),
      tracks: program.tracks || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProgram = async (programId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا البرنامج؟ سيتم حذف جميع اللوائح والمقررات المرتبطة به.')) {
      try {
        await programsApi.delete(programId);
        const allProgs = await programsApi.list();
        setPrograms(allProgs.map(p => ({
            ...p,
            nameEn: p.name_en,
            departmentId: p.department_id,
            totalHours: p.total_hours,
            mandatoryHours: p.mandatory_hours,
            electiveHours: p.elective_hours,
            universityRequirements: p.university_requirements,
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString()
          } as any)));
        alert('تم حذف البرنامج بنجاح!');
      } catch (error) {
        console.error("Error deleting program:", error);
      }
    }
  };

  const handleRegulationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regulationForm.programId) {
      alert('يرجى اختيار البرنامج أولاً');
      return;
    }
    
    try {
      const regulationData = {
        name: regulationForm.name,
        program_id: regulationForm.programId,
        registration_rules: regulationForm.registrationRules,
        pass_fail_rules: regulationForm.passFailRules,
        absence_policy: regulationForm.absencePolicy,
        mandatory_hours: parseInt(regulationForm.mandatoryHours),
        elective_hours: parseInt(regulationForm.electiveHours),
        university_requirements: parseInt(regulationForm.universityRequirements)
      };

      if (editingRegulationId) {
        await regulationsApi.update(editingRegulationId, regulationData as any);
        alert('تم تحديث اللائحة بنجاح!');
      } else {
        await regulationsApi.create({
          id: `REG-${Date.now()}`,
          ...regulationData
        } as any);
        alert('تم إضافة اللائحة بنجاح!');
      }
      
      const allRegs = await regulationsApi.list();
      setRegulations(allRegs.map(r => ({
        ...r,
        programId: r.program_id,
        registrationRules: r.registration_rules,
        passFailRules: r.pass_fail_rules,
        absencePolicy: r.absence_policy,
        mandatoryHours: r.mandatory_hours,
        electiveHours: r.elective_hours,
        universityRequirements: r.university_requirements,
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || new Date().toISOString()
      } as any)));
      
      setEditingRegulationId(null);
      setRegulationForm({
        name: '', programId: '', registrationRules: '', passFailRules: '', absencePolicy: '',
        mandatoryHours: '', electiveHours: '', universityRequirements: ''
      });
    } catch (error) {
      console.error("Error saving regulation:", error);
    }
  };

  const handleEditRegulation = (regulation: StudyRegulation) => {
    setEditingRegulationId(regulation.id);
    setRegulationForm({
      name: regulation.name,
      programId: regulation.programId,
      registrationRules: regulation.registrationRules,
      passFailRules: regulation.passFailRules,
      absencePolicy: regulation.absencePolicy,
      mandatoryHours: regulation.mandatoryHours.toString(),
      electiveHours: regulation.electiveHours.toString(),
      universityRequirements: regulation.universityRequirements.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRegulation = async (regulationId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه اللائحة؟')) {
      try {
        await regulationsApi.delete(regulationId);
        const allRegs = await regulationsApi.list();
        setRegulations(allRegs.map(r => ({
          ...r,
          programId: r.program_id,
          registrationRules: r.registration_rules,
          passFailRules: r.pass_fail_rules,
          absencePolicy: r.absence_policy,
          mandatoryHours: r.mandatory_hours,
          electiveHours: r.elective_hours,
          universityRequirements: r.university_requirements,
          createdAt: r.created_at || new Date().toISOString(),
          updatedAt: r.updated_at || new Date().toISOString()
        } as any)));
        alert('تم حذف اللائحة بنجاح!');
      } catch (error) {
        console.error("Error deleting regulation:", error);
      }
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.programId) {
      alert('يرجى اختيار البرنامج أولاً');
      return;
    }
    
    try {
      const courseData = {
        name: courseForm.name,
        name_en: courseForm.nameEn,
        level: parseInt(courseForm.level),
        department_id: courseForm.departmentId,
        program_id: courseForm.programId,
        faculty_id: facultyId,
        credit_hours: parseInt(courseForm.totalHours),
        theoretical_hours: parseInt(courseForm.theoreticalHours),
        practical_hours: parseInt(courseForm.practicalHours),
        course_type: courseForm.type,
        semester: courseForm.semester,
        description: courseForm.description,
        syllabus: courseForm.syllabus,
        prerequisites: courseForm.prerequisites
      };

      if (editingCourseId) {
        await coursesApi.update(editingCourseId, courseData as any);
        alert('تم تحديث المقرر بنجاح!');
      } else {
        await coursesApi.create({
          id: courseForm.code || `COURSE-${Date.now()}`,
          ...courseData
        } as any);
        alert('تم إضافة المقرر بنجاح!');
      }
      
      const allCourses = await coursesApi.list();
      setCourses(allCourses.map(c => ({
        id: c.id,
        code: (c as any).code || c.id,
        name: c.name,
        nameEn: c.name_en || '',
        departmentId: c.department_id || '',
        departmentName: departments.find(d => d.id === c.department_id)?.name || '',
        programId: (c as any).program_id || '',
        programName: programs.find(p => p.id === (c as any).program_id)?.name || '',
        theoreticalHours: c.theoretical_hours || 2,
        practicalHours: c.practical_hours || 2,
        totalHours: (c.theoretical_hours || 0) + (c.practical_hours || 0) || c.credit_hours,
        prerequisites: c.prerequisites || [],
        description: c.description || '',
        syllabus: c.syllabus || '',
        level: c.level,
        semester: (c.semester as any) || 'خريف',
        type: c.course_type as any,
        createdAt: c.created_at || new Date().toISOString(),
        updatedAt: c.updated_at || new Date().toISOString()
      })));
      
      setEditingCourseId(null);
      setCourseForm({
        code: '', name: '', nameEn: '', departmentId: '', programId: '',
        theoreticalHours: '', practicalHours: '', totalHours: '', prerequisites: [],
        level: '', semester: 'خريف', type: 'إجباري', description: '', syllabus: ''
      });
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEditCourse = (course: AcademicCourse) => {
    setEditingCourseId(course.id);
    setCourseForm({
      code: course.code,
      name: course.name,
      nameEn: course.nameEn || '',
      departmentId: course.departmentId,
      programId: course.programId,
      theoreticalHours: course.theoreticalHours.toString(),
      practicalHours: course.practicalHours.toString(),
      totalHours: course.totalHours.toString(),
      prerequisites: course.prerequisites,
      level: course.level.toString(),
      semester: course.semester,
      type: course.type,
      description: course.description || '',
      syllabus: course.syllabus || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقرر؟')) {
      try {
        await coursesApi.delete(courseId);
        const allCourses = await coursesApi.list();
        setCourses(allCourses.map(c => ({
            id: c.id,
            code: (c as any).code || c.id,
            name: c.name,
            nameEn: c.name_en || '',
            departmentId: c.department_id || '',
            departmentName: departments.find(d => d.id === c.department_id)?.name || '',
            programId: (c as any).program_id || '',
            programName: programs.find(p => p.id === (c as any).program_id)?.name || '',
            theoreticalHours: c.theoretical_hours || 2,
            practicalHours: c.practical_hours || 2,
            totalHours: (c.theoretical_hours || 0) + (c.practical_hours || 0) || c.credit_hours,
            prerequisites: c.prerequisites || [],
            description: c.description || '',
            syllabus: c.syllabus || '',
            level: c.level,
            semester: (c.semester as any) || 'خريف',
            type: c.course_type as any,
            createdAt: c.created_at || new Date().toISOString(),
            updatedAt: c.updated_at || new Date().toISOString()
        })));
        alert('تم حذف المقرر بنجاح!');
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'faculties':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded">
              <h3 className="font-bold text-blue-900 mb-2">إدارة الكليات</h3>
              <p className="text-sm text-blue-700">
                {managementMode === 'edit' 
                  ? 'عرض وتعديل بيانات الكلية المحددة. يمكنك تعديل أو حذف الكلية.'
                  : 'قم بإضافة الكليات وتحديد عميد كل كلية. يمكنك إضافة عدة كليات ثم الانتقال للخطوة التالية.'}
              </p>
            </div>

            <form onSubmit={handleFacultySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الكلية (عربي) *</label>
                  <input
                    type="text"
                    value={facultyForm.name}
                    onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: كلية الحاسبات والذكاء الاصطناعي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الكلية (إنجليزي)</label>
                  <input
                    type="text"
                    value={facultyForm.nameEn}
                    onChange={(e) => setFacultyForm({ ...facultyForm, nameEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Faculty of Computer Science and AI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رمز الكلية *</label>
                  <input
                    type="text"
                    value={facultyForm.code}
                    onChange={(e) => setFacultyForm({ ...facultyForm, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: FCAI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عميد الكلية</label>
                  <input
                    type="text"
                    value={facultyForm.deanName}
                    onChange={(e) => setFacultyForm({ ...facultyForm, deanName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="اسم عميد الكلية"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                >
                  {editingFacultyId ? (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ التعديلات
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      إضافة كلية
                    </>
                  )}
                </button>
                {editingFacultyId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFacultyId(null);
                      setFacultyForm({ name: '', nameEn: '', code: '', deanId: '', deanName: '' });
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            {faculties.length > 0 && (
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-4">الكليات المضافة ({faculties.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {faculties.map((faculty) => (
                    <div key={faculty.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900">{faculty.name}</h5>
                          <p className="text-sm text-gray-600">رمز: {faculty.code}</p>
                          {faculty.deanName && <p className="text-xs text-gray-500">عميد: {faculty.deanName}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditFaculty(faculty)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFaculty(faculty.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'departments':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border-r-4 border-green-500 p-4 rounded">
              <h3 className="font-bold text-green-900 mb-2">إدارة الأقسام</h3>
              <p className="text-sm text-green-700">
                {managementMode === 'edit'
                  ? 'عرض وتعديل الأقسام المرتبطة بهذه الكلية. يمكنك إضافة أقسام جديدة أو تعديل أو حذف الأقسام الموجودة.'
                  : 'قم بربط الأقسام بالكليات التي أضفتها في الخطوة السابقة. حدد رئيس كل قسم.'}
              </p>
            </div>

            <form onSubmit={handleDepartmentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الكلية *</label>
                  {facultyId && faculties.length > 0 ? (
                    <select
                      value={departmentForm.facultyId || faculties[0].id}
                      onChange={(e) => setDepartmentForm({ ...departmentForm, facultyId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-100"
                      disabled
                    >
                      <option value={faculties[0].id}>{faculties[0].name}</option>
                    </select>
                  ) : (
                    <select
                      value={departmentForm.facultyId}
                      onChange={(e) => setDepartmentForm({ ...departmentForm, facultyId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر الكلية</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم القسم (عربي) *</label>
                  <input
                    type="text"
                    value={departmentForm.name}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: علوم الحاسب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم القسم (إنجليزي)</label>
                  <input
                    type="text"
                    value={departmentForm.nameEn}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, nameEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رمز القسم *</label>
                  <input
                    type="text"
                    value={departmentForm.code}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: CS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رئيس القسم</label>
                  <input
                    type="text"
                    value={departmentForm.headName}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, headName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="اسم رئيس القسم"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                >
                  {editingDepartmentId ? (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ التعديلات
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      إضافة قسم
                    </>
                  )}
                </button>
                {editingDepartmentId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDepartmentId(null);
                      setDepartmentForm({ name: '', nameEn: '', code: '', facultyId: '', headId: '', headName: '' });
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            {departments.length > 0 && (
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-4">الأقسام المضافة ({departments.length})</h4>
                <div className="space-y-3">
                  {departments.map((dept) => {
                    const faculty = faculties.find(f => f.id === dept.facultyId);
                    return (
                      <div key={dept.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{dept.name}</h5>
                            <p className="text-sm text-gray-600">رمز: {dept.code} | الكلية: {faculty?.name}</p>
                            {dept.headName && <p className="text-xs text-gray-500">رئيس القسم: {dept.headName}</p>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditDepartment(dept)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(dept.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border-r-4 border-purple-500 p-4 rounded">
              <h3 className="font-bold text-purple-900 mb-2">إدارة البرامج الأكاديمية</h3>
              <p className="text-sm text-purple-700">
                {managementMode === 'edit'
                  ? 'عرض وتعديل البرامج المرتبطة بأقسام هذه الكلية. يمكنك إضافة برامج جديدة أو تعديل أو حذف البرامج الموجودة.'
                  : 'قم بإنشاء البرامج الأكاديمية وربطها بالأقسام. حدد الدرجة العلمية وعدد الساعات المطلوبة.'}
              </p>
            </div>

            <form onSubmit={handleProgramSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                  <select
                    value={programForm.departmentId}
                    onChange={(e) => setProgramForm({ ...programForm, departmentId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الدرجة العلمية *</label>
                  <select
                    value={programForm.degree}
                    onChange={(e) => setProgramForm({ ...programForm, degree: e.target.value as ProgramDegree })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="بكالوريوس">بكالوريوس</option>
                    <option value="دبلوم">دبلوم</option>
                    <option value="ماجستير">ماجستير</option>
                    <option value="دكتوراه">دكتوراه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم البرنامج (عربي) *</label>
                  <input
                    type="text"
                    value={programForm.name}
                    onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: بكالوريوس علوم الحاسب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رمز البرنامج *</label>
                  <input
                    type="text"
                    value={programForm.code}
                    onChange={(e) => setProgramForm({ ...programForm, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: CS-BS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">إجمالي الساعات *</label>
                  <input
                    type="number"
                    value={programForm.totalHours}
                    onChange={(e) => setProgramForm({ ...programForm, totalHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="135"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ساعات إجبارية *</label>
                  <input
                    type="number"
                    value={programForm.mandatoryHours}
                    onChange={(e) => setProgramForm({ ...programForm, mandatoryHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ساعات اختيارية *</label>
                  <input
                    type="number"
                    value={programForm.electiveHours}
                    onChange={(e) => setProgramForm({ ...programForm, electiveHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">متطلبات جامعة *</label>
                  <input
                    type="number"
                    value={programForm.universityRequirements}
                    onChange={(e) => setProgramForm({ ...programForm, universityRequirements: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                >
                  {editingProgramId ? (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ التعديلات
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      إضافة برنامج
                    </>
                  )}
                </button>
                {editingProgramId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProgramId(null);
                      setProgramForm({
                        name: '', nameEn: '', code: '', degree: 'بكالوريوس',
                        departmentId: '', totalHours: '', mandatoryHours: '', electiveHours: '', universityRequirements: '', tracks: []
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            {programs.length > 0 && (
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-4">البرامج المضافة ({programs.length})</h4>
                <div className="space-y-3">
                  {programs.map((prog) => {
                    const dept = departments.find(d => d.id === prog.departmentId);
                    return (
                      <div key={prog.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{prog.name}</h5>
                            <p className="text-sm text-gray-600">
                              {prog.degree} | القسم: {dept?.name} | إجمالي: {prog.totalHours} ساعة
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProgram(prog)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(prog.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'regulations':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border-r-4 border-orange-500 p-4 rounded">
              <h3 className="font-bold text-orange-900 mb-2">إدارة اللوائح الدراسية</h3>
              <p className="text-sm text-orange-700">
                {managementMode === 'edit'
                  ? 'عرض وتعديل اللوائح المرتبطة ببرامج هذه الكلية. يمكنك إضافة لوائح جديدة أو تعديل أو حذف اللوائح الموجودة.'
                  : 'قم بإنشاء اللوائح الدراسية لكل برنامج. حدد قواعد التسجيل والرسوب والغياب.'}
              </p>
            </div>

            <form onSubmit={handleRegulationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البرنامج *</label>
                  <select
                    value={regulationForm.programId}
                    onChange={(e) => setRegulationForm({ ...regulationForm, programId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر البرنامج</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم اللائحة *</label>
                  <input
                    type="text"
                    value={regulationForm.name}
                    onChange={(e) => setRegulationForm({ ...regulationForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: لائحة 2024"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">قواعد التسجيل *</label>
                  <textarea
                    value={regulationForm.registrationRules}
                    onChange={(e) => setRegulationForm({ ...regulationForm, registrationRules: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف قواعد التسجيل..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">قوانين الرسوب والنجاح *</label>
                  <textarea
                    value={regulationForm.passFailRules}
                    onChange={(e) => setRegulationForm({ ...regulationForm, passFailRules: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف قوانين الرسوب والنجاح..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">سياسات الغياب *</label>
                  <textarea
                    value={regulationForm.absencePolicy}
                    onChange={(e) => setRegulationForm({ ...regulationForm, absencePolicy: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف سياسات الغياب..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ساعات إجبارية *</label>
                  <input
                    type="number"
                    value={regulationForm.mandatoryHours}
                    onChange={(e) => setRegulationForm({ ...regulationForm, mandatoryHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ساعات اختيارية *</label>
                  <input
                    type="number"
                    value={regulationForm.electiveHours}
                    onChange={(e) => setRegulationForm({ ...regulationForm, electiveHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">متطلبات جامعة *</label>
                  <input
                    type="number"
                    value={regulationForm.universityRequirements}
                    onChange={(e) => setRegulationForm({ ...regulationForm, universityRequirements: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                >
                  {editingRegulationId ? (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ التعديلات
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      إضافة لائحة
                    </>
                  )}
                </button>
                {editingRegulationId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRegulationId(null);
                      setRegulationForm({
                        name: '', programId: '', registrationRules: '', passFailRules: '', absencePolicy: '',
                        mandatoryHours: '', electiveHours: '', universityRequirements: ''
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            {regulations.length > 0 && (
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-4">اللوائح المضافة ({regulations.length})</h4>
                <div className="space-y-3">
                  {regulations.map((reg) => {
                    const prog = programs.find(p => p.id === reg.programId);
                    return (
                      <div key={reg.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{reg.name}</h5>
                            <p className="text-sm text-gray-600">البرنامج: {prog?.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditRegulation(reg)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRegulation(reg.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border-r-4 border-indigo-500 p-4 rounded">
              <h3 className="font-bold text-indigo-900 mb-2">إدارة المقررات الدراسية</h3>
              <p className="text-sm text-indigo-700">
                {managementMode === 'edit'
                  ? 'عرض وتعديل المقررات المرتبطة ببرامج هذه الكلية. يمكنك إضافة مقررات جديدة أو تعديل أو حذف المقررات الموجودة.'
                  : 'قم بإضافة المقررات الدراسية وربطها بالبرامج. حدد المتطلبات السابقة ووصف المقرر.'}
              </p>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البرنامج *</label>
                  <select
                    value={courseForm.programId}
                    onChange={(e) => setCourseForm({ ...courseForm, programId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر البرنامج</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                  <select
                    value={courseForm.departmentId}
                    onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">كود المقرر *</label>
                  <input
                    type="text"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: CS101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم المقرر (عربي) *</label>
                  <input
                    type="text"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="مثال: مقدمة في البرمجة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ساعات نظرية *</label>
                  <input
                    type="number"
                    value={courseForm.theoreticalHours}
                    onChange={(e) => setCourseForm({ ...courseForm, theoreticalHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ساعات عملية *</label>
                  <input
                    type="number"
                    value={courseForm.practicalHours}
                    onChange={(e) => setCourseForm({ ...courseForm, practicalHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">إجمالي الساعات *</label>
                  <input
                    type="number"
                    value={courseForm.totalHours}
                    onChange={(e) => setCourseForm({ ...courseForm, totalHours: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المستوى *</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر المستوى</option>
                    <option value="1">المستوى الأول</option>
                    <option value="2">المستوى الثاني</option>
                    <option value="3">المستوى الثالث</option>
                    <option value="4">المستوى الرابع</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفصل الدراسي *</label>
                  <select
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="خريف">خريف</option>
                    <option value="ربيع">ربيع</option>
                    <option value="صيفي">صيفي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع المقرر *</label>
                  <select
                    value={courseForm.type}
                    onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="إجباري">إجباري</option>
                    <option value="اختياري">اختياري</option>
                    <option value="متطلب جامعة">متطلب جامعة</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">وصف المقرر (Syllabus)</label>
                  <textarea
                    value={courseForm.syllabus}
                    onChange={(e) => setCourseForm({ ...courseForm, syllabus: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف تفصيلي للمقرر..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                >
                  {editingCourseId ? (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ التعديلات
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      إضافة مقرر
                    </>
                  )}
                </button>
                {editingCourseId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCourseId(null);
                      setCourseForm({
                        code: '', name: '', nameEn: '', departmentId: '', programId: '',
                        theoreticalHours: '', practicalHours: '', totalHours: '', prerequisites: [],
                        level: '', semester: 'خريف', type: 'إجباري', description: '', syllabus: ''
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            {courses.length > 0 && (
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-4">المقررات المضافة ({courses.length})</h4>
                <div className="space-y-3">
                  {courses.map((course) => {
                    const prog = programs.find(p => p.id === course.programId);
                    return (
                      <div key={course.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{course.code} - {course.name}</h5>
                            <p className="text-sm text-gray-600">
                              {course.theoreticalHours}ن + {course.practicalHours}ع = {course.totalHours} ساعة | 
                              البرنامج: {prog?.name} | {course.semester}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Handle mode selection
  // Handle mode selection
  const handleModeSelect = async (mode: ManagementMode) => {
    setManagementMode(mode);
    setShowModeSelection(false);
    
    if (mode === 'edit' && facultyId) {
      try {
        const [allFacs, allDepts, allProgs, allRegs, allCourses] = await Promise.all([
          facultiesApi.list(),
          departmentsApi.list(facultyId),
          programsApi.list(),
          regulationsApi.list(),
          coursesApi.list()
        ]);
        
        const savedFaculty = allFacs.find(f => f.code === facultyId || f.id === facultyId);
        
        if (savedFaculty) {
          const mappedFaculty: AcademicFaculty = {
            ...savedFaculty,
            nameEn: savedFaculty.name_en || '',
            departments: [],
            createdAt: savedFaculty.created_at || new Date().toISOString(),
            updatedAt: savedFaculty.updated_at || new Date().toISOString()
          };
          
          setFaculties([mappedFaculty]);
          setDepartmentForm(prev => ({ ...prev, facultyId: mappedFaculty.id }));

          // Map responses
          const mappedProgs: AcademicProgram[] = allProgs.map(p => ({
            ...p,
            nameEn: p.name_en,
            departmentId: p.department_id,
            totalHours: p.total_hours,
            mandatoryHours: p.mandatory_hours,
            electiveHours: p.elective_hours,
            universityRequirements: p.university_requirements,
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString()
          } as any));

          const mappedRegs: StudyRegulation[] = allRegs.map(r => ({
            ...r,
            programId: r.program_id,
            registrationRules: r.registration_rules || '',
            passFailRules: r.pass_fail_rules || '',
            absencePolicy: r.absence_policy || '',
            mandatoryHours: r.mandatory_hours,
            electiveHours: r.elective_hours,
            universityRequirements: r.university_requirements,
            createdAt: r.created_at || new Date().toISOString(),
            updatedAt: r.updated_at || new Date().toISOString()
          } as any));

          const facultyDepartments = allDepts.map(d => ({
            ...d,
            nameEn: (d as any).name_en || '',
            facultyId: (d as any).faculty_id || '',
            headName: (d as any).head_name || '',
            programs: mappedProgs.filter(p => p.departmentId === d.id).map(p => p.id),
            createdAt: (d as any).created_at || new Date().toISOString(),
            updatedAt: (d as any).updated_at || new Date().toISOString()
          }));
          setDepartments(facultyDepartments);
          
          const deptIds = new Set(facultyDepartments.map(d => d.id));
          const facultyPrograms = mappedProgs.filter(p => deptIds.has(p.departmentId));
          setPrograms(facultyPrograms);
          
          const progIds = new Set(facultyPrograms.map(p => p.id));
          const facultyRegulations = mappedRegs.filter(r => progIds.has(r.programId));
          setRegulations(facultyRegulations);
          
          const facultyCourses = allCourses.filter(c => (c.department_id && deptIds.has(c.department_id)) || (c as any).program_id && progIds.has((c as any).program_id)).map(c => ({
            id: c.id,
            code: (c as any).code || c.id,
            name: c.name,
            nameEn: c.name_en || '',
            departmentId: c.department_id || '',
            departmentName: allDepts.find(d => d.id === c.department_id)?.name || '',
            programId: (c as any).program_id || '',
            programName: allProgs.find(p => p.id === (c as any).program_id)?.name || '',
            theoreticalHours: c.theoretical_hours || 2,
            practicalHours: c.practical_hours || 2,
            totalHours: (c.theoretical_hours || 0) + (c.practical_hours || 0) || c.credit_hours,
            prerequisites: c.prerequisites || [],
            description: c.description || '',
            syllabus: c.syllabus || '',
            level: c.level,
            semester: (c.semester as any) || 'خريف',
            type: c.course_type as any,
            createdAt: c.created_at || new Date().toISOString(),
            updatedAt: c.updated_at || new Date().toISOString()
          }));
          setCourses(facultyCourses);
        } else {
            // Handle if faculty not found in DB but exists in FACULTIES (mock)
            const defaultFaculty = FACULTIES.find(f => f.id === facultyId);
            if (defaultFaculty) {
                const defaultFacultyRecord: AcademicFaculty = {
                  id: defaultFaculty.id,
                  name: defaultFaculty.name,
                  code: defaultFaculty.id,
                  departments: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                setFaculties([defaultFacultyRecord]);
                setDepartmentForm(prev => ({ ...prev, facultyId: defaultFacultyRecord.id }));
            }
        }
        
        setCurrentStep('departments');
        setCompletedSteps(new Set(['faculties']));
      } catch (error) {
        console.error("Error reloading data in mode select:", error);
      }
    }
  };

  // Show mode selection modal if facultyId is provided
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">إدارة الهيكل الأكاديمي</h2>
            <p className="text-gray-600">اختر نوع العملية التي تريد تنفيذها</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Mode */}
            <button
              onClick={() => handleModeSelect('add')}
              className="group p-8 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-right"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <Plus className="w-8 h-8 text-primary-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">إضافة جديد</h3>
              <p className="text-gray-600 text-sm">
                إضافة أقسام وبرامج ولوائح ومقررات جديدة للكلية
              </p>
            </button>

            {/* Edit Mode */}
            <button
              onClick={() => handleModeSelect('edit')}
              className="group p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-right"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Edit className="w-8 h-8 text-blue-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">تعديل البيانات</h3>
              <p className="text-gray-600 text-sm">
                تعديل أو حذف الأقسام والبرامج واللوائح والمقررات الموجودة
              </p>
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render edit mode with different layout
  if (managementMode === 'edit' && facultyId) {
    const currentFaculty = faculties[0] || FACULTIES.find(f => f.id === facultyId);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">تعديل الهيكل الأكاديمي</h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentFaculty?.name || 'الكلية المحددة'} - تعديل الأقسام والبرامج واللوائح والمقررات
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveEditTab('departments')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeEditTab === 'departments'
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="w-4 h-4 inline-block ml-2" />
                الأقسام ({departments.length})
              </button>
              <button
                onClick={() => setActiveEditTab('programs')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeEditTab === 'programs'
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4 inline-block ml-2" />
                البرامج ({programs.length})
              </button>
              <button
                onClick={() => setActiveEditTab('regulations')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeEditTab === 'regulations'
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 inline-block ml-2" />
                اللوائح ({regulations.length})
              </button>
              <button
                onClick={() => setActiveEditTab('courses')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeEditTab === 'courses'
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Award className="w-4 h-4 inline-block ml-2" />
                المقررات ({courses.length})
              </button>
              <button
                onClick={() => setActiveEditTab('academic_rules')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeEditTab === 'academic_rules'
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 inline-block ml-2" />
                القواعد الأكاديمية
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {activeEditTab === 'departments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">إدارة الأقسام</h2>
                    <p className="text-gray-600 mt-1">عرض وتعديل الأقسام المرتبطة بهذه الكلية</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingDepartmentId(null);
                      setIsAddingDepartment(true);
                      const currentFacultyId = faculties[0]?.id || facultyId || '';
                      setDepartmentForm({ 
                        name: '', nameEn: '', code: '', 
                        facultyId: currentFacultyId, 
                        headId: '', headName: '' 
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة قسم جديد
                  </button>
                </div>

                {/* Department Form */}
                {(editingDepartmentId || isAddingDepartment || departments.length === 0) && (
                  <form onSubmit={handleDepartmentSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم القسم (عربي) *</label>
                        <input
                          type="text"
                          value={departmentForm.name}
                          onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="مثال: علوم الحاسب"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رمز القسم *</label>
                        <input
                          type="text"
                          value={departmentForm.code}
                          onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value.toUpperCase() })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="مثال: CS"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رئيس القسم</label>
                        <input
                          type="text"
                          value={departmentForm.headName}
                          onChange={(e) => setDepartmentForm({ ...departmentForm, headName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="اسم رئيس القسم"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                      >
                        {editingDepartmentId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingDepartmentId ? 'حفظ التعديلات' : 'إضافة قسم'}
                      </button>
                      {(editingDepartmentId || isAddingDepartment) && departments.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDepartmentId(null);
                            setIsAddingDepartment(false);
                            const currentFacultyId = faculties[0]?.id || facultyId || '';
                            setDepartmentForm({ name: '', nameEn: '', code: '', facultyId: currentFacultyId, headId: '', headName: '' });
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                          إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Departments List */}
                {departments.length > 0 ? (
                  <div className="space-y-3">
                    {departments.map((dept) => (
                      <div key={dept.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{dept.name}</h5>
                            <p className="text-sm text-gray-600">رمز: {dept.code}</p>
                            {dept.headName && <p className="text-xs text-gray-500">رئيس القسم: {dept.headName}</p>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditDepartment(dept)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(dept.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد أقسام مضافة بعد</p>
                  </div>
                )}
              </div>
            )}

            {activeEditTab === 'programs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">إدارة البرامج</h2>
                    <p className="text-gray-600 mt-1">عرض وتعديل البرامج المرتبطة بأقسام هذه الكلية</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProgramId(null);
                      setIsAddingProgram(true);
                      setProgramForm({
                        name: '', nameEn: '', code: '', degree: 'بكالوريوس',
                        departmentId: '', totalHours: '', mandatoryHours: '', electiveHours: '', universityRequirements: '', tracks: []
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة برنامج جديد
                  </button>
                </div>

                {/* Program Form */}
                {(editingProgramId || isAddingProgram || programs.length === 0) && (
                  <form onSubmit={handleProgramSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                        <select
                          value={programForm.departmentId}
                          onChange={(e) => setProgramForm({ ...programForm, departmentId: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">اختر القسم</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم البرنامج (عربي) *</label>
                        <input
                          type="text"
                          value={programForm.name}
                          onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="مثال: بكالوريوس علوم الحاسب"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رمز البرنامج *</label>
                        <input
                          type="text"
                          value={programForm.code}
                          onChange={(e) => setProgramForm({ ...programForm, code: e.target.value.toUpperCase() })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="مثال: CS-BS"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الدرجة العلمية *</label>
                        <select
                          value={programForm.degree}
                          onChange={(e) => setProgramForm({ ...programForm, degree: e.target.value as ProgramDegree })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="بكالوريوس">بكالوريوس</option>
                          <option value="دبلوم">دبلوم</option>
                          <option value="ماجستير">ماجستير</option>
                          <option value="دكتوراه">دكتوراه</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">إجمالي الساعات *</label>
                        <input
                          type="number"
                          value={programForm.totalHours}
                          onChange={(e) => setProgramForm({ ...programForm, totalHours: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="135"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ساعات إجبارية *</label>
                        <input
                          type="number"
                          value={programForm.mandatoryHours}
                          onChange={(e) => setProgramForm({ ...programForm, mandatoryHours: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ساعات اختيارية *</label>
                        <input
                          type="number"
                          value={programForm.electiveHours}
                          onChange={(e) => setProgramForm({ ...programForm, electiveHours: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">متطلبات جامعة *</label>
                        <input
                          type="number"
                          value={programForm.universityRequirements}
                          onChange={(e) => setProgramForm({ ...programForm, universityRequirements: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="15"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                      >
                        {editingProgramId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingProgramId ? 'حفظ التعديلات' : 'إضافة برنامج'}
                      </button>
                      {(editingProgramId || isAddingProgram) && programs.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProgramId(null);
                            setIsAddingProgram(false);
                            setProgramForm({
                              name: '', nameEn: '', code: '', degree: 'بكالوريوس',
                              departmentId: '', totalHours: '', mandatoryHours: '', electiveHours: '', universityRequirements: '', tracks: []
                            });
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                          إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Programs List */}
                {programs.length > 0 ? (
                  <div className="space-y-3">
                    {programs.map((prog) => {
                      const dept = departments.find(d => d.id === prog.departmentId);
                      return (
                        <div key={prog.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900">{prog.name}</h5>
                              <p className="text-sm text-gray-600">
                                {prog.degree} | القسم: {dept?.name} | إجمالي: {prog.totalHours} ساعة
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditProgram(prog)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProgram(prog.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد برامج مضافة بعد</p>
                  </div>
                )}
              </div>
            )}

            {activeEditTab === 'regulations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">إدارة اللوائح</h2>
                    <p className="text-gray-600 mt-1">عرض وتعديل اللوائح المرتبطة ببرامج هذه الكلية</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRegulationId(null);
                      setIsAddingRegulation(true);
                      setRegulationForm({
                        name: '', programId: '', registrationRules: '', passFailRules: '', absencePolicy: '',
                        mandatoryHours: '', electiveHours: '', universityRequirements: ''
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة لائحة جديدة
                  </button>
                </div>

                {/* Regulation Form */}
                {(editingRegulationId || isAddingRegulation || regulations.length === 0) && (
                  <form onSubmit={handleRegulationSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">البرنامج *</label>
                        <select
                          value={regulationForm.programId}
                          onChange={(e) => setRegulationForm({ ...regulationForm, programId: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">اختر البرنامج</option>
                          {programs.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم اللائحة *</label>
                        <input
                          type="text"
                          value={regulationForm.name}
                          onChange={(e) => setRegulationForm({ ...regulationForm, name: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="مثال: لائحة 2024"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">قواعد التسجيل *</label>
                        <textarea
                          value={regulationForm.registrationRules}
                          onChange={(e) => setRegulationForm({ ...regulationForm, registrationRules: e.target.value })}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="وصف قواعد التسجيل..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">قوانين الرسوب والنجاح *</label>
                        <textarea
                          value={regulationForm.passFailRules}
                          onChange={(e) => setRegulationForm({ ...regulationForm, passFailRules: e.target.value })}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="وصف قوانين الرسوب والنجاح..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">سياسات الغياب *</label>
                        <textarea
                          value={regulationForm.absencePolicy}
                          onChange={(e) => setRegulationForm({ ...regulationForm, absencePolicy: e.target.value })}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="وصف سياسات الغياب..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ساعات إجبارية *</label>
                        <input
                          type="number"
                          value={regulationForm.mandatoryHours}
                          onChange={(e) => setRegulationForm({ ...regulationForm, mandatoryHours: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ساعات اختيارية *</label>
                        <input
                          type="number"
                          value={regulationForm.electiveHours}
                          onChange={(e) => setRegulationForm({ ...regulationForm, electiveHours: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">متطلبات جامعة *</label>
                        <input
                          type="number"
                          value={regulationForm.universityRequirements}
                          onChange={(e) => setRegulationForm({ ...regulationForm, universityRequirements: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                      >
                        {editingRegulationId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingRegulationId ? 'حفظ التعديلات' : 'إضافة لائحة'}
                      </button>
                      {(editingRegulationId || isAddingRegulation) && regulations.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRegulationId(null);
                            setIsAddingRegulation(false);
                            setRegulationForm({
                              name: '', programId: '', registrationRules: '', passFailRules: '', absencePolicy: '',
                              mandatoryHours: '', electiveHours: '', universityRequirements: ''
                            });
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                          إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Regulations List */}
                {regulations.length > 0 ? (
                  <div className="space-y-3">
                    {regulations.map((reg) => {
                      const prog = programs.find(p => p.id === reg.programId);
                      return (
                        <div key={reg.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900">{reg.name}</h5>
                              <p className="text-sm text-gray-600">البرنامج: {prog?.name}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditRegulation(reg)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRegulation(reg.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد لوائح مضافة بعد</p>
                  </div>
                )}
              </div>
            )}

            {activeEditTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">إدارة المقررات</h2>
                    <p className="text-gray-600 mt-1">عرض وتعديل المقررات المرتبطة ببرامج هذه الكلية</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCourseId(null);
                      setIsAddingCourse(true);
                      setCourseForm({
                        code: '', name: '', nameEn: '', departmentId: '', programId: '',
                        theoreticalHours: '', practicalHours: '', totalHours: '', prerequisites: [],
                        level: '', semester: 'خريف', type: 'إجباري', description: '', syllabus: ''
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة مقرر جديد
                  </button>
                </div>

                {/* Course Form */}
                {(editingCourseId || isAddingCourse || courses.length === 0) && (
                  <form onSubmit={handleCourseSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">البرنامج *</label>
                        <select
                          value={courseForm.programId}
                          onChange={(e) => setCourseForm({ ...courseForm, programId: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">اختر البرنامج</option>
                          {programs.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                        <select
                          value={courseForm.departmentId}
                          onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">اختر القسم</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">كود المقرر *</label>
                        <input
                          type="text"
                          value={courseForm.code}
                          onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="مثال: CS101"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم المقرر (عربي) *</label>
                        <input
                          type="text"
                          value={courseForm.name}
                          onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="مثال: مقدمة في البرمجة"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ساعات نظرية *</label>
                        <input
                          type="number"
                          value={courseForm.theoreticalHours}
                          onChange={(e) => setCourseForm({ ...courseForm, theoreticalHours: e.target.value })}
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ساعات عملية *</label>
                        <input
                          type="number"
                          value={courseForm.practicalHours}
                          onChange={(e) => setCourseForm({ ...courseForm, practicalHours: e.target.value })}
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">إجمالي الساعات *</label>
                        <input
                          type="number"
                          value={courseForm.totalHours}
                          onChange={(e) => setCourseForm({ ...courseForm, totalHours: e.target.value })}
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المستوى *</label>
                        <select
                          value={courseForm.level}
                          onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">اختر المستوى</option>
                          <option value="1">المستوى الأول</option>
                          <option value="2">المستوى الثاني</option>
                          <option value="3">المستوى الثالث</option>
                          <option value="4">المستوى الرابع</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الفصل الدراسي *</label>
                        <select
                          value={courseForm.semester}
                          onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value as any })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="خريف">خريف</option>
                          <option value="ربيع">ربيع</option>
                          <option value="صيفي">صيفي</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع المقرر *</label>
                        <select
                          value={courseForm.type}
                          onChange={(e) => setCourseForm({ ...courseForm, type: e.target.value as any })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="إجباري">إجباري</option>
                          <option value="اختياري">اختياري</option>
                          <option value="متطلب جامعة">متطلب جامعة</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">وصف المقرر (Syllabus)</label>
                        <textarea
                          value={courseForm.syllabus}
                          onChange={(e) => setCourseForm({ ...courseForm, syllabus: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="وصف تفصيلي للمقرر..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
                      >
                        {editingCourseId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingCourseId ? 'حفظ التعديلات' : 'إضافة مقرر'}
                      </button>
                      {(editingCourseId || isAddingCourse) && courses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCourseId(null);
                            setIsAddingCourse(false);
                            setCourseForm({
                              code: '', name: '', nameEn: '', departmentId: '', programId: '',
                              theoreticalHours: '', practicalHours: '', totalHours: '', prerequisites: [],
                              level: '', semester: 'خريف', type: 'إجباري', description: '', syllabus: ''
                            });
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                          إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Courses List */}
                {courses.length > 0 ? (
                  <div className="space-y-3">
                    {courses.map((course) => {
                      const prog = programs.find(p => p.id === course.programId);
                      return (
                        <div key={course.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900">{course.code} - {course.name}</h5>
                              <p className="text-sm text-gray-600">
                                {course.theoreticalHours}ن + {course.practicalHours}ع = {course.totalHours} ساعة | 
                                البرنامج: {prog?.name} | {course.semester}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد مقررات مضافة بعد</p>
                  </div>
                )}
              </div>
            )}

            {activeEditTab === 'academic_rules' && (
              <SimpleAcademicRulesEditor facultyId={facultyId} facultyName={faculties[0]?.name} />
            )}
            {false && (
              <div className="space-y-6">
                {facultyId ? (
                  <AcademicRulesManagement
                    facultyId={facultyId}
                    facultyName={faculties[0]?.name || facultyId}
                  />
                ) : (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="max-w-md mx-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-center">اختر الكلية لإدارة القواعد الأكاديمية الخاصة بها</label>
                      <select
                        value={selectedGlobalFacultyId || ''}
                        onChange={(e) => setSelectedGlobalFacultyId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-8"
                      >
                        <option value="">-- اختر الكلية --</option>
                        {faculties.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    {selectedGlobalFacultyId && (
                      <div className="mt-8 border-t border-gray-200 pt-8">
                        <AcademicRulesManagement
                          key={selectedGlobalFacultyId}
                          facultyId={selectedGlobalFacultyId}
                          facultyName={faculties.find(f => f.id === selectedGlobalFacultyId)?.name || selectedGlobalFacultyId}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الهيكل الأكاديمي</h1>
            <p className="text-sm text-gray-600 mt-1">بناء الهيكل الأكاديمي للجامعة بالكامل</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.has(step.id);
              const isAccessible = index <= currentStepIndex || isCompleted;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => isAccessible && handleStepClick(step.id)}
                    disabled={!isAccessible}
                    className={`
                      flex flex-col items-center flex-1 relative
                      ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                      ${isActive 
                        ? 'bg-primary-700 text-white shadow-lg scale-110' 
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {isCompleted && !isActive ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`
                      text-xs font-medium text-center
                      ${isActive ? 'text-primary-700 font-bold' : 'text-gray-600'}
                    `}>
                      {step.label}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`
                        absolute top-6 left-[60%] w-full h-0.5 -z-10
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                      `} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {React.createElement(steps[currentStepIndex].icon, { className: "w-6 h-6 text-primary-700" })}
              <h2 className="text-2xl font-bold text-gray-900">{steps[currentStepIndex].label}</h2>
            </div>
            <p className="text-gray-600">{steps[currentStepIndex].description}</p>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors
                ${isFirstStep 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>

            <div className="text-sm text-gray-500">
              الخطوة {currentStepIndex + 1} من {steps.length}
            </div>

            {!isLastStep ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 font-medium transition-colors"
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  alert('تم إكمال جميع الخطوات بنجاح!');
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                إنهاء
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicStructureManagement;
