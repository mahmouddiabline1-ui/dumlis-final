import React, { useState, useEffect } from 'react';
import { Save, X, FileText, CheckCircle2, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { AcademicRules } from '../types';
import { academicRulesApi } from '../api';
import { FACULTIES } from '../constants';

interface AcademicRulesManagementProps {
  facultyId: string;
  facultyName?: string;
  onClose?: () => void;
}

type ProgramType = 'CS' | 'IT' | 'IS';
type CourseType = 'mandatory' | 'elective';

interface CourseFormData {
  code: string;
  name: string;
  nameEn: string;
  theoreticalHours: number;
  practicalHours: number;
  creditHours: number;
  prerequisites: string[];
  allowCrossProgram?: boolean;
}

const AcademicRulesManagement: React.FC<AcademicRulesManagementProps> = ({ facultyId, facultyName, onClose }) => {
  const [rules, setRules] = useState<AcademicRules | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingCourse, setEditingCourse] = useState<{ program: ProgramType; type: CourseType; index: number } | null>(null);
  const [addingCourse, setAddingCourse] = useState<{ program: ProgramType; type: CourseType } | null>(null);
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    code: '',
    name: '',
    nameEn: '',
    theoreticalHours: 3,
    practicalHours: 2,
    creditHours: 2,
    prerequisites: [],
    allowCrossProgram: false
  });

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const rulesResp = await academicRulesApi.getByFaculty(facultyId);
        if (rulesResp) {
          const rulesData = rulesResp.rules_data || {};
          const defaultRules: AcademicRules = {
            id: rulesResp.id,
            facultyId: rulesResp.faculty_id,
            facultyName: facultyName,
            studySystem: {
              creditHoursSystem: true,
              academicYearStructure: {
                fallSemester: { weeks: 15, startDate: '2024-09-01' },
                springSemester: { weeks: 15, startDate: '2025-02-01' },
                summerSemester: { weeks: 8, startDate: '2025-06-01', enabled: true },
              },
              creditHourStandard: { theoretical: 1, practical: 2, summerTraining: 3 },
              hybridLearning: {
                enabled: false,
                practicalCourses: { faceToFace: { min: 60, max: 70 }, online: { min: 30, max: 40 } },
                theoreticalCourses: { faceToFace: { min: 50, max: 60 }, online: { min: 40, max: 50 } },
              },
              electronicExams: {
                enabled: true,
                onCampus: true,
                graduationProjects: true,
              },
              graduationRequirements: {
                totalCreditHours: 120,
                minimumGPA: 2.0,
                minimumYears: 3,
                includesUniversityRequirements: true,
                includesFacultyRequirements: true,
                includesMajorRequirements: true,
              },
              specializationStart: {
                level: 3,
                sharedLevels: [1, 2],
              },
              levelProgression: {
                level1: { name: 'السنة الأولى', maxCreditHours: 30, description: 'المستوى الأول' },
                level2: { name: 'السنة الثانية', requiredCreditHours: 30, description: 'المستوى الثاني' },
                level3: { name: 'السنة الثالثة', requiredCreditHours: 66, description: 'المستوى الثالث', specializationRequired: true },
                level4: { name: 'السنة الرابعة', requiredCreditHours: 102, description: 'المستوى الرابع' },
              },
              studyPlan: {
                commonLevels: {
                  level1: { fall: [], spring: [] },
                  level2: { fall: [], spring: [] },
                },
                specializations: {},
              },
            },
            grading: {
              scale: 100,
              passingGrade: (rulesData as any).pass_grade || 60,
              letterGrades: [
                { letter: 'A+', min: 95, max: 100 },
                { letter: 'A', min: 90, max: 94 },
                { letter: 'B+', min: 85, max: 89 },
                { letter: 'B', min: 80, max: 84 },
                { letter: 'C+', min: 75, max: 79 },
                { letter: 'C', min: 70, max: 74 },
                { letter: 'D', min: 60, max: 69 },
                { letter: 'F', min: 0, max: 59 },
              ],
            },
            enrollment: {
              minCreditHours: (rulesData as any).min_credit_hours || 12,
              maxCreditHours: (rulesData as any).max_credit_hours || 18,
              minGPA: (rulesData as any).gpa_pass || 1.0,
            },
            academicStanding: {
              goodStanding: { minGPA: 2.0, minCumulativeGPA: 2.0 },
              probation: { minGPA: 1.5, minCumulativeGPA: 1.5 },
              dismissal: { minGPA: 1.0, minCumulativeGPA: 1.0 },
            },
            prerequisitesAndCorequisites: {
              enforcePrerequisites: true,
              allowCoRequisites: true,
              minGradeForPrerequisite: 60,
            },
            graduationRequirements: {
              minTotalCredits: 120,
              minGPA: 2.0,
              minSemesterGPA: 2.0,
              maxStudyYears: 7,
            },
            attendancePolicy: {
              minAttendancePercentage: 75,
              allowedAbsences: 10,
              excusedAbsences: 3,
            },
            degreesAndCertificates: {
              minorPrograms: true,
              doubleDegreePossible: false,
              certificates: true,
            },
          };
          setRules(defaultRules);
        }
      } catch (err) {
        console.log("No rules found for faculty:", facultyId, err);
      }
    };
    fetchRules();
  }, [facultyId, facultyName]);

  const handleSave = async () => {
    if (!rules) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Find if entry already exists to decide between create/update
      let existingId: string | null = null;
      try {
        const currentResp = await academicRulesApi.getByFaculty(facultyId);
        if (currentResp) existingId = currentResp.id;
      } catch (e) {
        // 404 is expected when no rules exist yet for this faculty — proceed to create
        if (e instanceof Error && (e as any).status !== 404) {
          console.warn("Unexpected error checking for existing rules:", e);
        }
      }

      if (existingId) {
        await academicRulesApi.update(existingId, {
          rules_data: rules
        });
      } else {
        await academicRulesApi.create({
          id: `RULE_${facultyId}`,
          faculty_id: facultyId,
          rules_data: rules
        });
      }

      setSaveMessage({ type: 'success', text: 'تم حفظ القواعد الأكاديمية بنجاح!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error saving academic rules:", error);
      setSaveMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' });
    } finally {
      setIsSaving(false);
    }
  };
  const updateRules = (path: string, value: any) => {
    if (!rules) return;
    
    const keys = path.split('.');
    const newRules = { ...rules };
    let current: any = newRules;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setRules(newRules);
  };

  const handleAddCourse = (program: ProgramType, type: CourseType) => {
    setAddingCourse({ program, type });
    setEditingCourse(null);
    setCourseForm({
      code: '',
      name: '',
      nameEn: '',
      theoreticalHours: 3,
      practicalHours: 2,
      creditHours: 2,
      prerequisites: [],
      allowCrossProgram: type === 'elective' ? false : undefined
    });
  };

  const handleEditCourse = (program: ProgramType, type: CourseType, index: number) => {
    if (!rules) return;
    const course = rules.studySystem.graduationRequirementsDetails?.majorRequirements?.programs?.[program]?.[type]?.[index];
    if (!course) return;
    setEditingCourse({ program, type, index });
    setAddingCourse(null);
    setCourseForm({
      code: course.code,
      name: course.name,
      nameEn: course.nameEn || '',
      theoreticalHours: course.theoreticalHours,
      practicalHours: course.practicalHours,
      creditHours: course.creditHours,
      prerequisites: course.prerequisites || [],
      allowCrossProgram: course.allowCrossProgram
    });
  };

  const handleDeleteCourse = (program: ProgramType, type: CourseType, index: number) => {
    if (!rules) return;
    if (!confirm('هل أنت متأكد من حذف هذا المقرر؟')) return;

    const newRules = { ...rules };
    const courses = [...(newRules.studySystem.graduationRequirementsDetails?.majorRequirements?.programs?.[program]?.[type] || [])];
    courses.splice(index, 1);
    if (newRules.studySystem.graduationRequirementsDetails?.majorRequirements?.programs?.[program]) {
      newRules.studySystem.graduationRequirementsDetails.majorRequirements.programs[program][type] = courses;
      setRules(newRules);
    }
  };

  const handleSaveCourse = () => {
    if (!rules || (!editingCourse && !addingCourse)) return;
    if (!courseForm.code || !courseForm.name) {
      alert('يرجى إدخال كود المقرر واسمه');
      return;
    }

    const newRules = { ...rules };
    const course = {
      code: courseForm.code,
      name: courseForm.name,
      nameEn: courseForm.nameEn || undefined,
      theoreticalHours: courseForm.theoreticalHours,
      practicalHours: courseForm.practicalHours,
      creditHours: courseForm.creditHours,
      prerequisites: courseForm.prerequisites.filter(p => p.trim() !== ''),
      allowCrossProgram: courseForm.allowCrossProgram
    };

    if (editingCourse) {
      if (!newRules.studySystem.graduationRequirementsDetails?.majorRequirements?.programs?.[editingCourse.program]?.[editingCourse.type]) return;
      newRules.studySystem.graduationRequirementsDetails.majorRequirements.programs[editingCourse.program][editingCourse.type][editingCourse.index] = course;
    } else if (addingCourse) {
      if (!newRules.studySystem.graduationRequirementsDetails?.majorRequirements?.programs?.[addingCourse.program]?.[addingCourse.type]) return;
      newRules.studySystem.graduationRequirementsDetails.majorRequirements.programs[addingCourse.program][addingCourse.type].push(course);
    }

    setRules(newRules);
    setEditingCourse(null);
    setAddingCourse(null);
    setCourseForm({
      code: '',
      name: '',
      nameEn: '',
      theoreticalHours: 3,
      practicalHours: 2,
      creditHours: 2,
      prerequisites: [],
      allowCrossProgram: false
    });
  };

  const handleCancelCourse = () => {
    setEditingCourse(null);
    setAddingCourse(null);
    setCourseForm({
      code: '',
      name: '',
      nameEn: '',
      theoreticalHours: 3,
      practicalHours: 2,
      creditHours: 2,
      prerequisites: [],
      allowCrossProgram: false
    });
  };

  const addPrerequisite = () => {
    setCourseForm({
      ...courseForm,
      prerequisites: [...courseForm.prerequisites, '']
    });
  };

  const updatePrerequisite = (index: number, value: string) => {
    const newPrerequisites = [...courseForm.prerequisites];
    newPrerequisites[index] = value;
    setCourseForm({ ...courseForm, prerequisites: newPrerequisites });
  };

  const removePrerequisite = (index: number) => {
    const newPrerequisites = courseForm.prerequisites.filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, prerequisites: newPrerequisites });
  };

  const renderCourseForm = (program: ProgramType, programName: string) => {
    const isActive = (addingCourse?.program === program || editingCourse?.program === program);
    if (!isActive) return null;

    return (
      <div className="border-2 border-primary-300 rounded-lg p-4 bg-primary-50 mt-4">
        <h5 className="font-semibold text-gray-900 mb-3">
          {editingCourse ? 'تعديل مقرر' : 'إضافة مقرر جديد'} - {programName}
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كود المقرر *</label>
            <input
              type="text"
              value={courseForm.code}
              onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="مثال: CS101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربية *</label>
            <input
              type="text"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="اسم المقرر"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزية</label>
            <input
              type="text"
              value={courseForm.nameEn}
              onChange={(e) => setCourseForm({ ...courseForm, nameEn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Course Name"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نظري</label>
              <input
                type="number"
                value={courseForm.theoreticalHours}
                onChange={(e) => setCourseForm({ ...courseForm, theoreticalHours: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عملي</label>
              <input
                type="number"
                value={courseForm.practicalHours}
                onChange={(e) => setCourseForm({ ...courseForm, practicalHours: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">معتمدة</label>
              <input
                type="number"
                value={courseForm.creditHours}
                onChange={(e) => setCourseForm({ ...courseForm, creditHours: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">المتطلبات السابقة</label>
            <div className="space-y-2">
              {courseForm.prerequisites.map((prereq, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={prereq}
                    onChange={(e) => updatePrerequisite(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="كود المقرر المطلوب"
                  />
                  <button
                    onClick={() => removePrerequisite(idx)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addPrerequisite}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                إضافة متطلب سابق
              </button>
            </div>
          </div>
          {addingCourse?.type === 'elective' && (
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={courseForm.allowCrossProgram || false}
                  onChange={(e) => setCourseForm({ ...courseForm, allowCrossProgram: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">يسمح باختيار مقرر من تخصص آخر</span>
              </label>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSaveCourse}
            className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
          >
            <Save className="w-4 h-4" />
            حفظ
          </button>
          <button
            onClick={handleCancelCourse}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <X className="w-4 h-4" />
            إلغاء
          </button>
        </div>
      </div>
    );
  };

  const renderProgramCourses = (program: ProgramType, programName: string, programNameEn: string) => {
    if (!rules) return null;
    const programData = rules.studySystem.graduationRequirementsDetails?.majorRequirements?.programs?.[program];
    if (!programData) return null;
    
    return (
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">{programName} ({program})</h4>
        </div>
        <div className="space-y-4">
          {/* المقررات الإجبارية */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-700">
                المقررات الإجبارية ({programData.mandatory?.length || 0} مقرر - {(programData.mandatory || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة)
              </h5>
              <button
                onClick={() => handleAddCourse(program, 'mandatory')}
                className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                إضافة
              </button>
            </div>
            {renderCourseForm(program, programName)}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(programData.mandatory || []).map((course, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{course.code}</span> - {course.name}
                    <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCourse(program, 'mandatory', idx)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(program, 'mandatory', idx)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* المقررات الاختيارية */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-700">
                المقررات الاختيارية ({programData.elective?.length || 0} مقرر - {(programData.elective || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة)
              </h5>
              <button
                onClick={() => handleAddCourse(program, 'elective')}
                className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                إضافة
              </button>
            </div>
            {renderCourseForm(program, programName)}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(programData.elective || []).map((course, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{course.code}</span> - {course.name}
                    <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                    )}
                    {course.allowCrossProgram && (
                      <span className="text-xs text-primary-600 block">✓ يسمح باختيار مقرر من تخصص آخر</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCourse(program, 'elective', idx)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(program, 'elective', idx)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!rules) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-600" />
        <p className="text-gray-700 mb-4">لم يتم العثور على قواعد أكاديمية لهذه الكلية</p>
        <p className="text-sm text-gray-500">قد يكون النظام لا يزال يحمل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">القواعد الأكاديمية</h1>
              <p className="text-sm text-gray-600 mt-1">{facultyName || FACULTIES.find(f => f.id === facultyId)?.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'جاري الحفظ...' : 'حفظ القواعد'}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
          {saveMessage && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {saveMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{saveMessage.text}</span>
            </div>
          )}
        </div>

        {/* Rules Sections */}
        <div className="space-y-6">
          {/* نظام الدراسة */}
          <Section title="نظام الدراسة" icon={FileText}>
            <div className="space-y-4">
              <CheckboxField
                label="نظام الساعات المعتمدة"
                checked={rules.studySystem.creditHoursSystem}
                onChange={(val) => updateRules('studySystem.creditHoursSystem', val)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberField
                  label="الفصل الدراسي الأول (أسابيع)"
                  value={rules.studySystem.academicYearStructure.fallSemester.weeks}
                  onChange={(val) => updateRules('studySystem.academicYearStructure.fallSemester.weeks', val)}
                />
                <NumberField
                  label="الفصل الدراسي الثاني (أسابيع)"
                  value={rules.studySystem.academicYearStructure.springSemester.weeks}
                  onChange={(val) => updateRules('studySystem.academicYearStructure.springSemester.weeks', val)}
                />
                <div>
                  <CheckboxField
                    label="تفعيل الفصل الصيفي"
                    checked={rules.studySystem.academicYearStructure.summerSemester.enabled}
                    onChange={(val) => updateRules('studySystem.academicYearStructure.summerSemester.enabled', val)}
                  />
                  {rules.studySystem.academicYearStructure.summerSemester.enabled && (
                    <NumberField
                      label="الفصل الصيفي (أسابيع)"
                      value={rules.studySystem.academicYearStructure.summerSemester.weeks}
                      onChange={(val) => updateRules('studySystem.academicYearStructure.summerSemester.weeks', val)}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">معيار الساعة المعتمدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberField
                    label="ساعة نظرية"
                    value={rules.studySystem.creditHourStandard.theoretical}
                    onChange={(val) => updateRules('studySystem.creditHourStandard.theoretical', val)}
                  />
                  <NumberField
                    label="ساعة عملية"
                    value={rules.studySystem.creditHourStandard.practical}
                    onChange={(val) => updateRules('studySystem.creditHourStandard.practical', val)}
                  />
                  <NumberField
                    label="التدريب الصيفي"
                    value={rules.studySystem.creditHourStandard.summerTraining}
                    onChange={(val) => updateRules('studySystem.creditHourStandard.summerTraining', val)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <CheckboxField
                  label="تفعيل التعلم الهجين"
                  checked={rules.studySystem.hybridLearning.enabled}
                  onChange={(val) => updateRules('studySystem.hybridLearning.enabled', val)}
                />
                {rules.studySystem.hybridLearning.enabled && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">المقررات العملية</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <RangeField
                          label="وجهًا لوجه (%)"
                          min={rules.studySystem.hybridLearning.practicalCourses.faceToFace.min}
                          max={rules.studySystem.hybridLearning.practicalCourses.faceToFace.max}
                          onChange={(min, max) => {
                            updateRules('studySystem.hybridLearning.practicalCourses.faceToFace', { min, max });
                            updateRules('studySystem.hybridLearning.practicalCourses.online', { 
                              min: 100 - max, 
                              max: 100 - min 
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">المقررات النظرية</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <RangeField
                          label="وجهًا لوجه (%)"
                          min={rules.studySystem.hybridLearning.theoreticalCourses.faceToFace.min}
                          max={rules.studySystem.hybridLearning.theoreticalCourses.faceToFace.max}
                          onChange={(min, max) => {
                            updateRules('studySystem.hybridLearning.theoreticalCourses.faceToFace', { min, max });
                            updateRules('studySystem.hybridLearning.theoreticalCourses.online', { 
                              min: 100 - max, 
                              max: 100 - min 
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <CheckboxField
                  label="تفعيل الامتحانات الإلكترونية"
                  checked={rules.studySystem.electronicExams.enabled}
                  onChange={(val) => updateRules('studySystem.electronicExams.enabled', val)}
                />
                {rules.studySystem.electronicExams.enabled && (
                  <div className="mt-4 space-y-2">
                    <CheckboxField
                      label="داخل الحرم الجامعي"
                      checked={rules.studySystem.electronicExams.onCampus}
                      onChange={(val) => updateRules('studySystem.electronicExams.onCampus', val)}
                    />
                    <CheckboxField
                      label="مناقشة مشاريع التخرج إلكترونيًا"
                      checked={rules.studySystem.electronicExams.graduationProjects}
                      onChange={(val) => updateRules('studySystem.electronicExams.graduationProjects', val)}
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">متطلبات التخرج</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberField
                    label="إجمالي الساعات المعتمدة"
                    value={rules.studySystem.graduationRequirements.totalCreditHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirements.totalCreditHours', val)}
                  />
                  <NumberField
                    label="الحد الأدنى للمعدل التراكمي"
                    value={rules.studySystem.graduationRequirements.minimumGPA}
                    onChange={(val) => updateRules('studySystem.graduationRequirements.minimumGPA', val)}
                    step={0.1}
                  />
                  <NumberField
                    label="الحد الأدنى لسنوات الدراسة"
                    value={rules.studySystem.graduationRequirements.minimumYears}
                    onChange={(val) => updateRules('studySystem.graduationRequirements.minimumYears', val)}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <CheckboxField
                    label="يشمل متطلبات الجامعة"
                    checked={rules.studySystem.graduationRequirements.includesUniversityRequirements}
                    onChange={(val) => updateRules('studySystem.graduationRequirements.includesUniversityRequirements', val)}
                  />
                  <CheckboxField
                    label="يشمل متطلبات الكلية"
                    checked={rules.studySystem.graduationRequirements.includesFacultyRequirements}
                    onChange={(val) => updateRules('studySystem.graduationRequirements.includesFacultyRequirements', val)}
                  />
                  <CheckboxField
                    label="يشمل متطلبات التخصص"
                    checked={rules.studySystem.graduationRequirements.includesMajorRequirements}
                    onChange={(val) => updateRules('studySystem.graduationRequirements.includesMajorRequirements', val)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">بداية التخصص</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberField
                    label="المستوى الذي يبدأ فيه التخصص"
                    value={rules.studySystem.specializationStart.level}
                    onChange={(val) => updateRules('studySystem.specializationStart.level', val)}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* مواعيد التخرج */}
          <Section title="مواعيد التخرج" icon={FileText}>
            <div className="space-y-2">
              <CheckboxField
                label="دور يناير (نهاية الفصل الأول)"
                checked={rules.academicCalendar.graduationDates.january}
                onChange={(val) => updateRules('academicCalendar.graduationDates.january', val)}
              />
              <CheckboxField
                label="دور يونيو (نهاية الفصل الثاني)"
                checked={rules.academicCalendar.graduationDates.june}
                onChange={(val) => updateRules('academicCalendar.graduationDates.june', val)}
              />
              <CheckboxField
                label="دور سبتمبر (نهاية الفصل الصيفي)"
                checked={rules.academicCalendar.graduationDates.september}
                onChange={(val) => updateRules('academicCalendar.graduationDates.september', val)}
              />
            </div>
          </Section>

          {/* التسجيل والحذف والإضافة */}
          <Section title="التسجيل والحذف والإضافة" icon={FileText}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="الحد الأدنى لعدد الطلاب في المقرر"
                  value={rules.registration.minimumStudentsPerCourse}
                  onChange={(val) => updateRules('registration.minimumStudentsPerCourse', val)}
                />
                <NumberField
                  label="الحد الأدنى للساعات المعتمدة"
                  value={rules.registration.minimumCreditHours}
                  onChange={(val) => updateRules('registration.minimumCreditHours', val)}
                />
                <NumberField
                  label="الحد الأقصى للساعات المعتمدة"
                  value={rules.registration.maximumCreditHours}
                  onChange={(val) => updateRules('registration.maximumCreditHours', val)}
                />
                <NumberField
                  label="الحد الأقصى في الفصل الصيفي"
                  value={rules.registration.summerMaximumHours}
                  onChange={(val) => updateRules('registration.summerMaximumHours', val)}
                />
              </div>

              <div className="border-t pt-4">
                <CheckboxField
                  label="رفع الحد الأقصى للمعدل العالي"
                  checked={rules.registration.maximumCreditHoursWithGPA.enabled}
                  onChange={(val) => updateRules('registration.maximumCreditHoursWithGPA.enabled', val)}
                />
                {rules.registration.maximumCreditHoursWithGPA.enabled && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberField
                      label="الحد الأدنى للمعدل التراكمي"
                      value={rules.registration.maximumCreditHoursWithGPA.gpaThreshold}
                      onChange={(val) => updateRules('registration.maximumCreditHoursWithGPA.gpaThreshold', val)}
                      step={0.1}
                    />
                    <NumberField
                      label="الحد الأقصى للساعات"
                      value={rules.registration.maximumCreditHoursWithGPA.maxHours}
                      onChange={(val) => updateRules('registration.maximumCreditHoursWithGPA.maxHours', val)}
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">الحذف والإضافة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberField
                    label="آخر أسبوع للحذف/الإضافة"
                    value={rules.registration.addDropDeadline.weeks}
                    onChange={(val) => updateRules('registration.addDropDeadline.weeks', val)}
                  />
                  <NumberField
                    label="الحد الأقصى للحذف/الإضافة (فصل عادي)"
                    value={rules.registration.addDropDeadline.maxHours}
                    onChange={(val) => updateRules('registration.addDropDeadline.maxHours', val)}
                  />
                  <NumberField
                    label="الحد الأقصى للحذف/الإضافة (صيفي)"
                    value={rules.registration.addDropDeadline.summerMaxHours}
                    onChange={(val) => updateRules('registration.addDropDeadline.summerMaxHours', val)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <CheckboxField
                  label="متطلبات المقررات السابقة مطلوبة"
                  checked={rules.registration.prerequisites.required}
                  onChange={(val) => updateRules('registration.prerequisites.required', val)}
                />
                <CheckboxField
                  label="السماح بالتسجيل في المستويات الأعلى"
                  checked={rules.registration.prerequisites.allowHigherLevel}
                  onChange={(val) => updateRules('registration.prerequisites.allowHigherLevel', val)}
                />
              </div>
            </div>
          </Section>

          {/* الانسحاب من المقرر */}
          <Section title="الانسحاب من المقرر" icon={FileText}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="آخر أسبوع للانسحاب"
                  value={rules.withdrawal.deadline.weeks}
                  onChange={(val) => updateRules('withdrawal.deadline.weeks', val)}
                />
                <NumberField
                  label="الحد الأدنى للساعات بعد الانسحاب"
                  value={rules.withdrawal.deadline.minimumHoursAfterWithdrawal}
                  onChange={(val) => updateRules('withdrawal.deadline.minimumHoursAfterWithdrawal', val)}
                />
              </div>
            </div>
          </Section>

          {/* الحضور والغياب */}
          <Section title="الحضور والغياب" icon={FileText}>
            <div className="space-y-4">
              <CheckboxField
                label="الدراسة نظامية (مطلوب الحضور)"
                checked={rules.attendance.required}
                onChange={(val) => updateRules('attendance.required', val)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="الحد الأدنى للحضور (%)"
                  value={rules.attendance.minimumAttendance}
                  onChange={(val) => updateRules('attendance.minimumAttendance', val)}
                />
                <NumberField
                  label="الحد الأقصى للغياب (%)"
                  value={rules.attendance.maximumAbsence}
                  onChange={(val) => updateRules('attendance.maximumAbsence', val)}
                />
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">أهلية دخول الامتحان</h3>
                <NumberField
                  label="الحد الأدنى للحضور لدخول الامتحان (%)"
                  value={rules.attendance.examEligibility.minimumAttendance}
                  onChange={(val) => updateRules('attendance.examEligibility.minimumAttendance', val)}
                />
              </div>
            </div>
          </Section>

          {/* نظام الامتحانات */}
          <Section title="نظام الامتحانات" icon={FileText}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="الدرجة الكلية"
                  value={rules.exams.totalGrade}
                  onChange={(val) => updateRules('exams.totalGrade', val)}
                />
                <NumberField
                  label="الحد الأدنى للنجاح (%)"
                  value={rules.exams.passingGrade}
                  onChange={(val) => updateRules('exams.passingGrade', val)}
                />
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">توزيع الدرجات - مقرر نظري وعملي</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <NumberField
                    label="امتحان نصف فصلي"
                    value={rules.exams.gradeDistribution.theoreticalPractical.midterm}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalPractical.midterm', val)}
                  />
                  <NumberField
                    label="امتحان شفوي"
                    value={rules.exams.gradeDistribution.theoreticalPractical.oral}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalPractical.oral', val)}
                  />
                  <NumberField
                    label="امتحان عملي"
                    value={rules.exams.gradeDistribution.theoreticalPractical.practical}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalPractical.practical', val)}
                  />
                  <NumberField
                    label="تكليفات"
                    value={rules.exams.gradeDistribution.theoreticalPractical.assignments}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalPractical.assignments', val)}
                  />
                  <NumberField
                    label="امتحان نظري نهائي"
                    value={rules.exams.gradeDistribution.theoreticalPractical.finalWritten}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalPractical.finalWritten', val)}
                  />
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">توزيع الدرجات - مقرر نظري فقط</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <NumberField
                    label="امتحان نصف فصلي"
                    value={rules.exams.gradeDistribution.theoreticalOnly.midterm}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalOnly.midterm', val)}
                  />
                  <NumberField
                    label="امتحان شفوي"
                    value={rules.exams.gradeDistribution.theoreticalOnly.oral}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalOnly.oral', val)}
                  />
                  <NumberField
                    label="تكليفات"
                    value={rules.exams.gradeDistribution.theoreticalOnly.assignments}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalOnly.assignments', val)}
                  />
                  <NumberField
                    label="امتحان نظري نهائي"
                    value={rules.exams.gradeDistribution.theoreticalOnly.finalWritten}
                    onChange={(val) => updateRules('exams.gradeDistribution.theoreticalOnly.finalWritten', val)}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* التدريب العملي */}
          <Section title="التدريب العملي" icon={FileText}>
            <div className="space-y-4">
              <CheckboxField
                label="تفعيل التدريب العملي"
                checked={rules.practicalTraining.enabled}
                onChange={(val) => updateRules('practicalTraining.enabled', val)}
              />
              {rules.practicalTraining.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NumberField
                      label="الساعات المعتمدة"
                      value={rules.practicalTraining.creditHours}
                      onChange={(val) => updateRules('practicalTraining.creditHours', val)}
                    />
                    <NumberField
                      label="الحد الأدنى للساعات المعتمدة"
                      value={rules.practicalTraining.minimumCreditHours}
                      onChange={(val) => updateRules('practicalTraining.minimumCreditHours', val)}
                    />
                    <NumberField
                      label="المدة (أسابيع)"
                      value={rules.practicalTraining.duration.weeks}
                      onChange={(val) => updateRules('practicalTraining.duration.weeks', val)}
                    />
                  </div>
                  <CheckboxField
                    label="متطلب أساسي للتخرج"
                    checked={rules.practicalTraining.graduationRequirement}
                    onChange={(val) => updateRules('practicalTraining.graduationRequirement', val)}
                  />
                  <CheckboxField
                    label="منع التسجيل في الصيف عند تعارضه مع التدريب"
                    checked={rules.practicalTraining.summerConflict.preventSummerRegistration}
                    onChange={(val) => updateRules('practicalTraining.summerConflict.preventSummerRegistration', val)}
                  />
                </>
              )}
            </div>
          </Section>

          {/* مشروع التخرج */}
          <Section title="مشروع التخرج" icon={FileText}>
            <div className="space-y-4">
              <CheckboxField
                label="تفعيل مشروع التخرج"
                checked={rules.graduationProject.enabled}
                onChange={(val) => updateRules('graduationProject.enabled', val)}
              />
              {rules.graduationProject.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberField
                      label="الساعات المعتمدة"
                      value={rules.graduationProject.creditHours}
                      onChange={(val) => updateRules('graduationProject.creditHours', val)}
                    />
                    <NumberField
                      label="الحد الأدنى للساعات المعتمدة للتسجيل"
                      value={rules.graduationProject.minimumCreditHours}
                      onChange={(val) => updateRules('graduationProject.minimumCreditHours', val)}
                    />
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">الإشراف</h3>
                    <div className="space-y-2">
                      <CheckboxField
                        label="مطلوب إشراف"
                        checked={rules.graduationProject.supervision.required}
                        onChange={(val) => updateRules('graduationProject.supervision.required', val)}
                      />
                      <CheckboxField
                        label="بواسطة عضو هيئة تدريس"
                        checked={rules.graduationProject.supervision.byFacultyMember}
                        onChange={(val) => updateRules('graduationProject.supervision.byFacultyMember', val)}
                      />
                      <CheckboxField
                        label="ترشيح من القسم العلمي"
                        checked={rules.graduationProject.supervision.departmentNomination}
                        onChange={(val) => updateRules('graduationProject.supervision.departmentNomination', val)}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">توزيع الدرجات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">تقييم المشرف (40%)</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <NumberField
                            label="شفوي (%)"
                            value={rules.graduationProject.evaluation.supervisor.oral}
                            onChange={(val) => updateRules('graduationProject.evaluation.supervisor.oral', val)}
                          />
                          <NumberField
                            label="متابعة دورية (%)"
                            value={rules.graduationProject.evaluation.supervisor.periodicFollowUp}
                            onChange={(val) => updateRules('graduationProject.evaluation.supervisor.periodicFollowUp', val)}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">لجنة الحكم (60%)</h4>
                        <NumberField
                          label="عدد أعضاء اللجنة"
                          value={rules.graduationProject.evaluation.committee.members}
                          onChange={(val) => updateRules('graduationProject.evaluation.committee.members', val)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <CheckboxField
                      label="المناقشة في نهاية العام"
                      checked={rules.graduationProject.discussion.endOfYear}
                      onChange={(val) => updateRules('graduationProject.discussion.endOfYear', val)}
                    />
                    <CheckboxField
                      label="جدولة من قبل القسم"
                      checked={rules.graduationProject.discussion.scheduleByDepartment}
                      onChange={(val) => updateRules('graduationProject.discussion.scheduleByDepartment', val)}
                    />
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* وضع الطالب تحت الملاحظة الأكاديمية */}
          <Section title="الملاحظة الأكاديمية والفصل" icon={FileText}>
            <div className="space-y-4">
              <CheckboxField
                label="تفعيل نظام الملاحظة الأكاديمية"
                checked={rules.academicWarning.enabled}
                onChange={(val) => updateRules('academicWarning.enabled', val)}
              />
              {rules.academicWarning.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CheckboxField
                      label="إعفاء الفصل الدراسي الأول"
                      checked={rules.academicWarning.firstSemesterExempt}
                      onChange={(val) => updateRules('academicWarning.firstSemesterExempt', val)}
                    />
                    <NumberField
                      label="الحد الأدنى للمعدل التراكمي"
                      value={rules.academicWarning.gpaThreshold}
                      onChange={(val) => updateRules('academicWarning.gpaThreshold', val)}
                      step={0.1}
                    />
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">نظام الإنذارات</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">الإنذار الأول</h4>
                        <NumberField
                          label="الحد الأدنى للمعدل التراكمي"
                          value={rules.academicWarning.warningSystem.firstWarning.gpaThreshold}
                          onChange={(val) => updateRules('academicWarning.warningSystem.firstWarning.gpaThreshold', val)}
                          step={0.1}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">الإنذار الثاني</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <NumberField
                            label="الحد الأقصى للفصول"
                            value={rules.academicWarning.warningSystem.secondWarning.maxSemesters}
                            onChange={(val) => updateRules('academicWarning.warningSystem.secondWarning.maxSemesters', val)}
                          />
                          <CheckboxField
                            label="إشعار ولي الأمر"
                            checked={rules.academicWarning.warningSystem.secondWarning.notificationToGuardian}
                            onChange={(val) => updateRules('academicWarning.warningSystem.secondWarning.notificationToGuardian', val)}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">الفصل</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CheckboxField
                            label="بعد الإنذارات"
                            checked={rules.academicWarning.warningSystem.dismissal.afterWarnings}
                            onChange={(val) => updateRules('academicWarning.warningSystem.dismissal.afterWarnings', val)}
                          />
                          <NumberField
                            label="الحد الأقصى للفصول"
                            value={rules.academicWarning.warningSystem.dismissal.maxSemesters}
                            onChange={(val) => updateRules('academicWarning.warningSystem.dismissal.maxSemesters', val)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">فرصة إضافية</h3>
                    <CheckboxField
                      label="تفعيل الفرصة الإضافية"
                      checked={rules.academicWarning.additionalOpportunity.enabled}
                      onChange={(val) => updateRules('academicWarning.additionalOpportunity.enabled', val)}
                    />
                    {rules.academicWarning.additionalOpportunity.enabled && (
                      <div className="mt-4 space-y-4">
                        <NumberField
                          label="الحد الأدنى للساعات المعتمدة"
                          value={rules.academicWarning.additionalOpportunity.conditions.minimumCreditHours}
                          onChange={(val) => updateRules('academicWarning.additionalOpportunity.conditions.minimumCreditHours', val)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <NumberField
                            label="الفصول النظامية"
                            value={rules.academicWarning.additionalOpportunity.allowedSemesters.regular}
                            onChange={(val) => updateRules('academicWarning.additionalOpportunity.allowedSemesters.regular', val)}
                          />
                          <NumberField
                            label="الفصول الصيفية"
                            value={rules.academicWarning.additionalOpportunity.allowedSemesters.summer}
                            onChange={(val) => updateRules('academicWarning.additionalOpportunity.allowedSemesters.summer', val)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">حدود التسجيل</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <NumberField
                        label="الحد الأقصى تحت الملاحظة (ساعات)"
                        value={rules.academicWarning.registrationLimit.underWarning}
                        onChange={(val) => updateRules('academicWarning.registrationLimit.underWarning', val)}
                      />
                      <CheckboxField
                        label="السماح بمقرر إضافي في فصل التخرج"
                        checked={rules.academicWarning.registrationLimit.graduationSemester.allowOneMore}
                        onChange={(val) => updateRules('academicWarning.registrationLimit.graduationSemester.allowOneMore', val)}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <CheckboxField
                      label="إعفاء الفصل الصيفي"
                      checked={rules.academicWarning.summerExempt}
                      onChange={(val) => updateRules('academicWarning.summerExempt', val)}
                    />
                    <CheckboxField
                      label="عدم احتساب إيقاف القيد"
                      checked={rules.academicWarning.suspensionNotCounted}
                      onChange={(val) => updateRules('academicWarning.suspensionNotCounted', val)}
                    />
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* نظام التقييم */}
          <Section title="نظام التقييم" icon={FileText}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  label="الحد الأدنى للنجاح"
                  value={rules.grading.passingGrade}
                  onChange={(val) => updateRules('grading.passingGrade', val)}
                />
                <NumberField
                  label="الحد الأدنى للمعدل التراكمي"
                  value={rules.grading.minimumCGPA}
                  onChange={(val) => updateRules('grading.minimumCGPA', val)}
                  step={0.1}
                />
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">مقياس التقديرات</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-4 gap-2 font-medium text-gray-700 pb-2 border-b">
                    <span>التقدير</span>
                    <span>النسبة (%)</span>
                    <span>النقاط</span>
                    <span>تعديل</span>
                  </div>
                  {Object.entries(rules.grading.gradeScale).map(([key, grade]: [string, any]) => (
                    <div key={key} className="grid grid-cols-4 gap-2 items-center">
                      <span className="font-medium">{key.replace('_', ' ')}</span>
                      {grade.min !== undefined ? (
                        <>
                          <span>{grade.min} - {grade.max}</span>
                          <span>{grade.points}</span>
                          <button className="text-primary-600 hover:text-primary-800 text-xs">تعديل</button>
                        </>
                      ) : (
                        <>
                          <span>{grade.description || '-'}</span>
                          <span>{grade.points}</span>
                          <button className="text-primary-600 hover:text-primary-800 text-xs">تعديل</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">التقدير العام</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(rules.grading.overallRating).map(([key, rating]: [string, any]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="font-medium w-32">{key.replace('_', ' ')}</span>
                      <span>{rating.min} - {rating.max}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">مرتبة الشرف</h3>
                <CheckboxField
                  label="تفعيل مرتبة الشرف"
                  checked={rules.grading.honors.enabled}
                  onChange={(val) => updateRules('grading.honors.enabled', val)}
                />
                {rules.grading.honors.enabled && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberField
                      label="الحد الأدنى للمعدل التراكمي"
                      value={rules.grading.honors.minimumCGPA}
                      onChange={(val) => updateRules('grading.honors.minimumCGPA', val)}
                      step={0.1}
                    />
                    <NumberField
                      label="الحد الأدنى للمعدل الفصلي"
                      value={rules.grading.honors.minimumSemesterGPA}
                      onChange={(val) => updateRules('grading.honors.minimumSemesterGPA', val)}
                      step={0.1}
                    />
                    <NumberField
                      label="الحد الأقصى لسنوات الدراسة"
                      value={rules.grading.honors.maxYears}
                      onChange={(val) => updateRules('grading.honors.maxYears', val)}
                    />
                    <div className="space-y-2">
                      <CheckboxField
                        label="عدم الرسوب في أي مقرر"
                        checked={rules.grading.honors.noFailures}
                        onChange={(val) => updateRules('grading.honors.noFailures', val)}
                      />
                      <CheckboxField
                        label="استثناء إيقاف القيد"
                        checked={rules.grading.honors.excludeSuspension}
                        onChange={(val) => updateRules('grading.honors.excludeSuspension', val)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* الرسوب والإعادة */}
          <Section title="الرسوب والإعادة" icon={FileText}>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">إعادة مقرر رسب فيه الطالب</h3>
                <CheckboxField
                  label="تفعيل إعادة المقررات الراسبة"
                  checked={rules.retake.failedCourse.enabled}
                  onChange={(val) => updateRules('retake.failedCourse.enabled', val)}
                />
                {rules.retake.failedCourse.enabled && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberField
                      label="الحد الأقصى للدرجة بعد الإعادة"
                      value={rules.retake.failedCourse.maxGradeAfterRetake}
                      onChange={(val) => updateRules('retake.failedCourse.maxGradeAfterRetake', val)}
                    />
                    <CheckboxField
                      label="احتساب الساعات مرة واحدة"
                      checked={rules.retake.failedCourse.countHoursOnce}
                      onChange={(val) => updateRules('retake.failedCourse.countHoursOnce', val)}
                    />
                    <CheckboxField
                      label="إظهار في السجل الأكاديمي"
                      checked={rules.retake.failedCourse.showInTranscript}
                      onChange={(val) => updateRules('retake.failedCourse.showInTranscript', val)}
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">إعادة للتحسين (لتجنب الفصل)</h3>
                <CheckboxField
                  label="تفعيل إعادة المقررات للتحسين"
                  checked={rules.retake.improvementToAvoidDismissal.enabled}
                  onChange={(val) => updateRules('retake.improvementToAvoidDismissal.enabled', val)}
                />
                {rules.retake.improvementToAvoidDismissal.enabled && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <NumberField
                        label="الحد الأقصى للدرجة بعد الإعادة"
                        value={rules.retake.improvementToAvoidDismissal.maxGradeAfterRetake}
                        onChange={(val) => updateRules('retake.improvementToAvoidDismissal.maxGradeAfterRetake', val)}
                      />
                      <CheckboxField
                        label="لا يوجد حد أقصى للمقررات"
                        checked={rules.retake.improvementToAvoidDismissal.noMaxLimit}
                        onChange={(val) => updateRules('retake.improvementToAvoidDismissal.noMaxLimit', val)}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">قيود المستوى</h4>
                      <div className="space-y-2">
                        <CheckboxField
                          label="نفس المستوى"
                          checked={rules.retake.improvementToAvoidDismissal.levelRestriction.sameLevel}
                          onChange={(val) => updateRules('retake.improvementToAvoidDismissal.levelRestriction.sameLevel', val)}
                        />
                        <CheckboxField
                          label="مستوى أقل بمستوى واحد"
                          checked={rules.retake.improvementToAvoidDismissal.levelRestriction.oneLevelBelow}
                          onChange={(val) => updateRules('retake.improvementToAvoidDismissal.levelRestriction.oneLevelBelow', val)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CheckboxField
                        label="احتساب الساعات مرة واحدة"
                        checked={rules.retake.improvementToAvoidDismissal.countHoursOnce}
                        onChange={(val) => updateRules('retake.improvementToAvoidDismissal.countHoursOnce', val)}
                      />
                      <CheckboxField
                        label="إظهار في السجل الأكاديمي"
                        checked={rules.retake.improvementToAvoidDismissal.showInTranscript}
                        onChange={(val) => updateRules('retake.improvementToAvoidDismissal.showInTranscript', val)}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">الرسوم</h4>
                      <div className="space-y-2">
                        <CheckboxField
                          label="مساوي لرسوم الفصل الصيفي"
                          checked={rules.retake.improvementToAvoidDismissal.payment.equalsSummerFee}
                          onChange={(val) => updateRules('retake.improvementToAvoidDismissal.payment.equalsSummerFee', val)}
                        />
                        <CheckboxField
                          label="يتطلب موافقة"
                          checked={rules.retake.improvementToAvoidDismissal.payment.requiresApproval}
                          onChange={(val) => updateRules('retake.improvementToAvoidDismissal.payment.requiresApproval', val)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">إعادة للتحسين (لرفع المعدل)</h3>
                <CheckboxField
                  label="تفعيل إعادة المقررات للتحسين"
                  checked={rules.retake.improvementForBetterGPA.enabled}
                  onChange={(val) => updateRules('retake.improvementForBetterGPA.enabled', val)}
                />
                {rules.retake.improvementForBetterGPA.enabled && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <NumberField
                        label="الحد الأقصى للدرجة بعد الإعادة"
                        value={rules.retake.improvementForBetterGPA.maxGradeAfterRetake}
                        onChange={(val) => updateRules('retake.improvementForBetterGPA.maxGradeAfterRetake', val)}
                      />
                      <NumberField
                        label="الحد الأقصى للمقررات"
                        value={rules.retake.improvementForBetterGPA.maxCourses}
                        onChange={(val) => updateRules('retake.improvementForBetterGPA.maxCourses', val)}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">قيود المستوى</h4>
                      <div className="space-y-2">
                        <CheckboxField
                          label="نفس المستوى"
                          checked={rules.retake.improvementForBetterGPA.levelRestriction.sameLevel}
                          onChange={(val) => updateRules('retake.improvementForBetterGPA.levelRestriction.sameLevel', val)}
                        />
                        <CheckboxField
                          label="مستوى أقل بمستوى واحد"
                          checked={rules.retake.improvementForBetterGPA.levelRestriction.oneLevelBelow}
                          onChange={(val) => updateRules('retake.improvementForBetterGPA.levelRestriction.oneLevelBelow', val)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CheckboxField
                        label="احتساب الساعات مرة واحدة"
                        checked={rules.retake.improvementForBetterGPA.countHoursOnce}
                        onChange={(val) => updateRules('retake.improvementForBetterGPA.countHoursOnce', val)}
                      />
                      <CheckboxField
                        label="إظهار في السجل الأكاديمي"
                        checked={rules.retake.improvementForBetterGPA.showInTranscript}
                        onChange={(val) => updateRules('retake.improvementForBetterGPA.showInTranscript', val)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* تعديل المسار */}
          <Section title="تعديل المسار (تغيير البرنامج)" icon={FileText}>
            <div className="space-y-4">
              <CheckboxField
                label="تفعيل تعديل المسار"
                checked={rules.programChange.enabled}
                onChange={(val) => updateRules('programChange.enabled', val)}
              />
              {rules.programChange.enabled && (
                <>
                  <NumberField
                    label="المستوى المسموح به"
                    value={rules.programChange.allowedLevel}
                    onChange={(val) => updateRules('programChange.allowedLevel', val)}
                  />
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">المتطلبات</h3>
                    <div className="space-y-2">
                      <CheckboxField
                        label="استيفاء شروط القبول"
                        checked={rules.programChange.requirements.meetAdmissionCriteria}
                        onChange={(val) => updateRules('programChange.requirements.meetAdmissionCriteria', val)}
                      />
                      <CheckboxField
                        label="موافقة المرشد الأكاديمي"
                        checked={rules.programChange.requirements.advisorApproval}
                        onChange={(val) => updateRules('programChange.requirements.advisorApproval', val)}
                      />
                      <CheckboxField
                        label="موافقة القسم العلمي"
                        checked={rules.programChange.requirements.departmentApproval}
                        onChange={(val) => updateRules('programChange.requirements.departmentApproval', val)}
                      />
                      <CheckboxField
                        label="موافقة لجنة شئون التعليم والطلاب"
                        checked={rules.programChange.requirements.committeeApproval}
                        onChange={(val) => updateRules('programChange.requirements.committeeApproval', val)}
                      />
                      <CheckboxField
                        label="موافقة مجلس الكلية"
                        checked={rules.programChange.requirements.councilApproval}
                        onChange={(val) => updateRules('programChange.requirements.councilApproval', val)}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">نقل الساعات المعتمدة</h3>
                    <CheckboxField
                      label="تفعيل نقل الساعات"
                      checked={rules.programChange.creditTransfer.enabled}
                      onChange={(val) => updateRules('programChange.creditTransfer.enabled', val)}
                    />
                    <CheckboxField
                      label="بناءً على البرنامج الجديد"
                      checked={rules.programChange.creditTransfer.basedOnNewProgram}
                      onChange={(val) => updateRules('programChange.creditTransfer.basedOnNewProgram', val)}
                    />
                  </div>
                  <div className="border-t pt-4">
                    <CheckboxField
                      label="تحديد المستوى بناءً على الساعات المعتمدة"
                      checked={rules.programChange.levelAssignment.basedOnCredits}
                      onChange={(val) => updateRules('programChange.levelAssignment.basedOnCredits', val)}
                    />
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* الخطة الدراسية الاسترشادية */}
          {rules.studySystem.studyPlan && (
            <Section title="الخطة الدراسية الاسترشادية" icon={FileText}>
              <div className="space-y-6">
                {/* المستوى الأول والثاني (مشتركان) */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">المستوى الأول والثاني (مشتركان لجميع البرامج)</h3>
                  
                  {/* المستوى الأول */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">المستوى الأول (Freshman)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الأول</h5>
                        <div className="space-y-2 text-sm">
                          {rules.studySystem.studyPlan.commonLevels?.level1?.fall?.map((course, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{course.code}</span> - {course.name}
                              <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                              {course.prerequisites && course.prerequisites.length > 0 && (
                                <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t">
                          <span className="font-medium text-gray-700">
                            الإجمالي: {(rules.studySystem.studyPlan.commonLevels?.level1?.fall || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الثاني</h5>
                      <div className="space-y-2 text-sm">
                          {rules.studySystem.studyPlan.commonLevels?.level1?.spring?.map((course, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{course.code}</span> - {course.name}
                              <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                              {course.prerequisites && course.prerequisites.length > 0 && (
                                <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t">
                          <span className="font-medium text-gray-700">
                            الإجمالي: {(rules.studySystem.studyPlan.commonLevels?.level1?.spring || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* المستوى الثاني */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">المستوى الثاني (Sophomore)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الأول</h5>
                      <div className="space-y-2 text-sm">
                          {rules.studySystem.studyPlan.commonLevels?.level2?.fall?.map((course, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{course.code}</span> - {course.name}
                              <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                              {course.prerequisites && course.prerequisites.length > 0 && (
                                <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t">
                          <span className="font-medium text-gray-700">
                            الإجمالي: {(rules.studySystem.studyPlan.commonLevels?.level2?.fall || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الثاني</h5>
                      <div className="space-y-2 text-sm">
                          {rules.studySystem.studyPlan.commonLevels?.level2?.spring?.map((course, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{course.code}</span> - {course.name}
                              <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                              {course.prerequisites && course.prerequisites.length > 0 && (
                                <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t">
                          <span className="font-medium text-gray-700">
                            الإجمالي: {(rules.studySystem.studyPlan.commonLevels?.level2?.spring || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* المستوى الثالث والرابع لكل برنامج */}
                {rules.studySystem.studyPlan.programLevels && (['CS', 'IT', 'IS'] as ProgramType[]).map((program) => {
                  const programNames = {
                    CS: { ar: 'علوم الحاسب', en: 'Computer Science' },
                    IT: { ar: 'تكنولوجيا المعلومات', en: 'Information Technology' },
                    IS: { ar: 'نظم المعلومات', en: 'Information Systems' }
                  };
                  const programData = rules.studySystem.studyPlan.programLevels?.[program];
                  if (!programData) return null;
                
                return (
                  <div key={program} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">برنامج {programNames[program].ar} ({program})</h3>
                    
                    {/* المستوى الثالث */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">المستوى الثالث (Junior)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3">
                          <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الأول</h5>
                          <div className="space-y-2 text-sm">
                            {programData.level3?.fall?.map((course, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <span className="font-medium">{course.code}</span> - {course.name}
                                  <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                                  {course.prerequisites && course.prerequisites.length > 0 && (
                                    <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                            <div className="mt-2 pt-2 border-t">
                              <span className="font-medium text-gray-700">
                                الإجمالي: {(programData.level3?.fall || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="border rounded-lg p-3">
                          <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الثاني</h5>
                          <div className="space-y-2 text-sm">
                            {programData.level3?.spring?.map((course, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <span className="font-medium">{course.code}</span> - {course.name}
                                  <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                                  {course.prerequisites && course.prerequisites.length > 0 && (
                                    <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                            <div className="mt-2 pt-2 border-t">
                              <span className="font-medium text-gray-700">
                                الإجمالي: {(programData.level3?.spring || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* المستوى الرابع */}
                    {programData.level4?.fall && programData.level4.fall.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">المستوى الرابع (Senior)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الأول</h5>
                            <div className="space-y-2 text-sm">
                              {programData.level4.fall.map((course, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div>
                                    <span className="font-medium">{course.code}</span> - {course.name}
                                    <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                                    {course.prerequisites && course.prerequisites.length > 0 && (
                                      <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className="mt-2 pt-2 border-t">
                                <span className="font-medium text-gray-700">
                                  الإجمالي: {(programData.level4?.fall || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium text-gray-700 mb-2">الفصل الدراسي الثاني</h5>
                            <div className="space-y-2 text-sm">
                              {programData.level4?.spring?.map((course, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div>
                                    <span className="font-medium">{course.code}</span> - {course.name}
                                    <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                                    {course.prerequisites && course.prerequisites.length > 0 && (
                                      <span className="text-xs text-gray-400 block">متطلبات: {course.prerequisites.join(', ')}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className="mt-2 pt-2 border-t">
                                <span className="font-medium text-gray-700">
                                  الإجمالي: {(programData.level4?.spring || []).reduce((sum, c) => sum + (c.creditHours || 0), 0)} ساعة معتمدة
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
                })}
              </div>
            </Section>
          )}

          {/* الرحلات العلمية */}
          <Section title="الرحلات العلمية" icon={FileText}>
            <div className="space-y-4">
              <CheckboxField
                label="تفعيل الرحلات العلمية"
                checked={rules.scientificTrips.enabled}
                onChange={(val) => updateRules('scientificTrips.enabled', val)}
              />
              {rules.scientificTrips.enabled && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">التنظيم</h3>
                    <div className="space-y-2">
                      <CheckboxField
                        label="من قبل القسم العلمي"
                        checked={rules.scientificTrips.organization.byDepartment}
                        onChange={(val) => updateRules('scientificTrips.organization.byDepartment', val)}
                      />
                      <CheckboxField
                        label="تحت إشراف أعضاء هيئة التدريس"
                        checked={rules.scientificTrips.organization.supervisedByFaculty}
                        onChange={(val) => updateRules('scientificTrips.organization.supervisedByFaculty', val)}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">المدة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <NumberField
                        label="الحد الأدنى (أيام)"
                        value={rules.scientificTrips.duration.min}
                        onChange={(val) => updateRules('scientificTrips.duration.min', val)}
                      />
                      <NumberField
                        label="الحد الأقصى (أيام)"
                        value={rules.scientificTrips.duration.max}
                        onChange={(val) => updateRules('scientificTrips.duration.max', val)}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">المتطلبات</h3>
                    <div className="space-y-2">
                      <CheckboxField
                        label="تقرير عن الرحلة"
                        checked={rules.scientificTrips.requirements.report}
                        onChange={(val) => updateRules('scientificTrips.requirements.report', val)}
                      />
                      <CheckboxField
                        label="عرض تقديمي"
                        checked={rules.scientificTrips.requirements.presentation}
                        onChange={(val) => updateRules('scientificTrips.requirements.presentation', val)}
                      />
                      <CheckboxField
                        label="تقديم للقسم العلمي"
                        checked={rules.scientificTrips.requirements.toDepartment}
                        onChange={(val) => updateRules('scientificTrips.requirements.toDepartment', val)}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <NumberField
                      label="الساعات المعتمدة (عادة 0)"
                      value={rules.scientificTrips.creditHours}
                      onChange={(val) => updateRules('scientificTrips.creditHours', val)}
                    />
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* الانتقال بين المستويات */}
          <Section title="الانتقال بين المستويات" icon={FileText}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">المستوى الأول (Freshman)</h4>
                  <p className="text-sm text-gray-600 mb-3">{rules.studySystem.levelProgression.level1.description}</p>
                  <NumberField
                    label="الحد الأقصى للساعات المعتمدة"
                    value={rules.studySystem.levelProgression.level1.maxCreditHours}
                    onChange={(val) => updateRules('studySystem.levelProgression.level1.maxCreditHours', val)}
                  />
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">المستوى الثاني (Sophomore)</h4>
                  <p className="text-sm text-gray-600 mb-3">{rules.studySystem.levelProgression.level2.description}</p>
                  <NumberField
                    label="الساعات المعتمدة المطلوبة"
                    value={rules.studySystem.levelProgression.level2.requiredCreditHours}
                    onChange={(val) => updateRules('studySystem.levelProgression.level2.requiredCreditHours', val)}
                  />
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">المستوى الثالث (Junior)</h4>
                  <p className="text-sm text-gray-600 mb-3">{rules.studySystem.levelProgression.level3.description}</p>
                  <NumberField
                    label="الساعات المعتمدة المطلوبة"
                    value={rules.studySystem.levelProgression.level3.requiredCreditHours}
                    onChange={(val) => updateRules('studySystem.levelProgression.level3.requiredCreditHours', val)}
                  />
                  <CheckboxField
                    label="يتطلب التخصص"
                    checked={rules.studySystem.levelProgression.level3.specializationRequired}
                    onChange={(val) => updateRules('studySystem.levelProgression.level3.specializationRequired', val)}
                    className="mt-2"
                  />
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">المستوى الرابع (Senior)</h4>
                  <p className="text-sm text-gray-600 mb-3">{rules.studySystem.levelProgression.level4.description}</p>
                  <NumberField
                    label="الساعات المعتمدة المطلوبة"
                    value={rules.studySystem.levelProgression.level4.requiredCreditHours}
                    onChange={(val) => updateRules('studySystem.levelProgression.level4.requiredCreditHours', val)}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* متطلبات التخرج التفصيلية */}
          <Section title="متطلبات التخرج التفصيلية" icon={FileText}>
            <div className="space-y-6">
              {/* متطلبات الجامعة */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">متطلبات الجامعة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <NumberField
                    label="إجمالي الساعات"
                    value={rules.studySystem.graduationRequirementsDetails.universityRequirements.totalHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.universityRequirements.totalHours', val)}
                  />
                  <NumberField
                    label="النسبة (%)"
                    value={rules.studySystem.graduationRequirementsDetails.universityRequirements.percentage}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.universityRequirements.percentage', val)}
                    step={0.01}
                  />
                  <CheckboxField
                    label="لا تحتسب في المعدل التراكمي"
                    checked={rules.studySystem.graduationRequirementsDetails.universityRequirements.notCountedInCGPA}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.universityRequirements.notCountedInCGPA', val)}
                  />
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">المقررات ({rules.studySystem.graduationRequirementsDetails.universityRequirements.courses.length} مقرر)</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {rules.studySystem.graduationRequirementsDetails.universityRequirements.courses.map((course, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{course.code}</span> - {course.name}
                          <span className="text-xs text-gray-500 ml-2">({course.creditHours} ساعة)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* متطلبات العلوم الأساسية */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">متطلبات العلوم الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <NumberField
                    label="إجمالي الساعات"
                    value={rules.studySystem.graduationRequirementsDetails.basicSciences.totalHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.basicSciences.totalHours', val)}
                  />
                  <NumberField
                    label="إجبارية"
                    value={rules.studySystem.graduationRequirementsDetails.basicSciences.mandatoryHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.basicSciences.mandatoryHours', val)}
                  />
                  <NumberField
                    label="اختيارية"
                    value={rules.studySystem.graduationRequirementsDetails.basicSciences.electiveHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.basicSciences.electiveHours', val)}
                  />
                  <NumberField
                    label="النسبة (%)"
                    value={rules.studySystem.graduationRequirementsDetails.basicSciences.percentage}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.basicSciences.percentage', val)}
                    step={0.01}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">المقررات الإجبارية ({rules.studySystem.graduationRequirementsDetails.basicSciences.courses.mandatory.length} مقرر)</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {rules.studySystem.graduationRequirementsDetails.basicSciences.courses.mandatory.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span><span className="font-medium">{course.code}</span> - {course.name} ({course.creditHours} ساعة)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">المقررات الاختيارية ({rules.studySystem.graduationRequirementsDetails.basicSciences.courses.elective.length} مقرر)</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {rules.studySystem.graduationRequirementsDetails.basicSciences.courses.elective.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span><span className="font-medium">{course.code}</span> - {course.name} ({course.creditHours} ساعة)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* متطلبات الكلية */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">متطلبات الكلية</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <NumberField
                    label="إجمالي الساعات"
                    value={rules.studySystem.graduationRequirementsDetails.facultyRequirements.totalHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.facultyRequirements.totalHours', val)}
                  />
                  <NumberField
                    label="إجبارية"
                    value={rules.studySystem.graduationRequirementsDetails.facultyRequirements.mandatoryHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.facultyRequirements.mandatoryHours', val)}
                  />
                  <NumberField
                    label="اختيارية"
                    value={rules.studySystem.graduationRequirementsDetails.facultyRequirements.electiveHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.facultyRequirements.electiveHours', val)}
                  />
                  <NumberField
                    label="النسبة (%)"
                    value={rules.studySystem.graduationRequirementsDetails.facultyRequirements.percentage}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.facultyRequirements.percentage', val)}
                    step={0.01}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">المقررات الإجبارية ({rules.studySystem.graduationRequirementsDetails.facultyRequirements.courses.mandatory.length} مقرر)</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {rules.studySystem.graduationRequirementsDetails.facultyRequirements.courses.mandatory.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span><span className="font-medium">{course.code}</span> - {course.name} ({course.creditHours} ساعة)</span>
                          {course.prerequisites && course.prerequisites.length > 0 && (
                            <span className="text-xs text-gray-500">متطلبات: {course.prerequisites.join(', ')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">المقررات الاختيارية ({rules.studySystem.graduationRequirementsDetails.facultyRequirements.courses.elective.length} مقرر)</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {rules.studySystem.graduationRequirementsDetails.facultyRequirements.courses.elective.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span><span className="font-medium">{course.code}</span> - {course.name} ({course.creditHours} ساعة)</span>
                          {course.prerequisites && course.prerequisites.length > 0 && (
                            <span className="text-xs text-gray-500">متطلبات: {course.prerequisites.join(', ')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* متطلبات التخصص */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">متطلبات التخصص</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <NumberField
                    label="إجمالي الساعات"
                    value={rules.studySystem.graduationRequirementsDetails.majorRequirements.totalHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.majorRequirements.totalHours', val)}
                  />
                  <NumberField
                    label="إجبارية"
                    value={rules.studySystem.graduationRequirementsDetails.majorRequirements.mandatoryHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.majorRequirements.mandatoryHours', val)}
                  />
                  <NumberField
                    label="اختيارية"
                    value={rules.studySystem.graduationRequirementsDetails.majorRequirements.electiveHours}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.majorRequirements.electiveHours', val)}
                  />
                  <NumberField
                    label="النسبة (%)"
                    value={rules.studySystem.graduationRequirementsDetails.majorRequirements.percentage}
                    onChange={(val) => updateRules('studySystem.graduationRequirementsDetails.majorRequirements.percentage', val)}
                    step={0.01}
                  />
                </div>

                {renderProgramCourses('CS', 'برنامج علوم الحاسب', 'Computer Science')}
                {renderProgramCourses('IT', 'برنامج تكنولوجيا المعلومات', 'Information Technology')}
                {renderProgramCourses('IS', 'برنامج نظم المعلومات', 'Information Systems')}
              </div>

              {/* ملخص إجمالي */}
              <div className="border rounded-lg p-4 bg-primary-50">
                <h3 className="font-semibold text-gray-900 mb-3">ملخص إجمالي متطلبات التخرج</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">متطلبات الجامعة</p>
                    <p className="text-lg font-bold">{rules.studySystem.graduationRequirementsDetails.universityRequirements.totalHours} ساعة</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">العلوم الأساسية</p>
                    <p className="text-lg font-bold">{rules.studySystem.graduationRequirementsDetails.basicSciences.totalHours} ساعة</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">متطلبات الكلية</p>
                    <p className="text-lg font-bold">{rules.studySystem.graduationRequirementsDetails.facultyRequirements.totalHours} ساعة</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">متطلبات التخصص</p>
                    <p className="text-lg font-bold">{rules.studySystem.graduationRequirementsDetails.majorRequirements.totalHours} ساعة</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">التدريب العملي</p>
                    <p className="text-lg font-bold">{rules.studySystem.graduationRequirementsDetails.practicalTraining.hours} ساعة</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">مشروع التخرج</p>
                    <p className="text-lg font-bold">{rules.studySystem.graduationRequirementsDetails.graduationProject.hours} ساعة</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">الإجمالي</p>
                    <p className="text-2xl font-bold text-primary-700">
                      {rules.studySystem.graduationRequirementsDetails.universityRequirements.totalHours +
                       rules.studySystem.graduationRequirementsDetails.basicSciences.totalHours +
                       rules.studySystem.graduationRequirementsDetails.facultyRequirements.totalHours +
                       rules.studySystem.graduationRequirementsDetails.majorRequirements.totalHours +
                       rules.studySystem.graduationRequirementsDetails.practicalTraining.hours +
                       rules.studySystem.graduationRequirementsDetails.graduationProject.hours} ساعة معتمدة
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

// Helper Components
interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-5 h-5 text-primary-700" />
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  className?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({ label, value, onChange, step = 1, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      step={step}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
    />
  </div>
);

interface RangeFieldProps {
  label: string;
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

const RangeField: React.FC<RangeFieldProps> = ({ label, min, max, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex gap-2">
      <input
        type="number"
        value={min}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0, max)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      />
      <span className="self-center text-gray-500">-</span>
      <input
        type="number"
        value={max}
        onChange={(e) => onChange(min, parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      />
    </div>
  </div>
);

export default AcademicRulesManagement;

