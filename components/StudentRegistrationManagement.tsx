import React, { useState, useEffect } from 'react';
import { Search, BookOpen, CheckCircle, AlertCircle, Save, User, ArrowRight, Filter, X, Info } from 'lucide-react';
import { 
    studentsApi, 
    coursesApi, 
    enrollmentsApi, 
    academicRulesApi 
} from '../api';
import { Student, Enrollment, Course, RulesResponse } from '../api';

interface StudentRegistrationManagementProps {
    selectedFacultyId?: string | null;
}

const StudentRegistrationManagement: React.FC<StudentRegistrationManagementProps> = ({ selectedFacultyId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [allCoursesMap, setAllCoursesMap] = useState<Map<string, any>>(new Map());
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [academicRules, setAcademicRules] = useState<any | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [courseLevel, setCourseLevel] = useState<number | 'all'>('all');

    // Load academic rules on component mount or when faculty changes
    useEffect(() => {
        const fetchRules = async () => {
            const facultyId = selectedFacultyId || (selectedStudent?.faculty_id);
            if (facultyId) {
                try {
                    const rules = await academicRulesApi.getByFaculty(facultyId);
                    setAcademicRules(rules.rules_data);
                } catch (error) {
                    console.error('Failed to fetch academic rules:', error);
                }
            }
        };
        fetchRules();
    }, [selectedFacultyId, selectedStudent]);

    // Update courses when courseLevel filter changes
    useEffect(() => {
        if (selectedStudent) {
            loadStudentData(selectedStudent, courseLevel);
        }
    }, [courseLevel]);

    // Live Auto-Suggestions Logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchTerm.trim() || searchTerm.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            try {
                // We use listAll because the search parameter natively filters it matching the DB queries
                const results = await studentsApi.listAll({
                    search: searchTerm.trim(),
                    faculty_id: selectedFacultyId || undefined
                });
                setSuggestions(results.slice(0, 5));
                setShowSuggestions(true);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedFacultyId]);

    // Search logic
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        try {
            const results = await studentsApi.list({ 
                search: searchTerm.trim(),
                faculty_id: selectedFacultyId || undefined
            });

            if (results && results.length > 0) {
                const student = results[0];
                setCourseLevel('all');
                setSelectedStudent(student);
                await loadStudentData(student);
            } else {
                alert('لم يتم العثور على الطالب في هذه الكلية.');
                setSelectedStudent(null);
            }
        } catch (error) {
            console.error('Search failed:', error);
            alert('حدث خطأ أثناء البحث');
        } finally {
            setIsSearching(false);
        }
    };

    const loadStudentData = async (student: any, filterLevel?: number | 'all') => {
        setIsLoadingData(true);
        try {
            // 1. Determine level for fetching
            let fetchLevel: any = undefined;
            if (filterLevel === undefined) {
                // If not provided, try to use student level or default to 'all' for broader view
                fetchLevel = undefined; // Showing all by default is more helpful
            } else if (filterLevel !== 'all') {
                fetchLevel = filterLevel;
            }

            // 2. Fetch available courses for this faculty
            const courses = await coursesApi.list({ 
                faculty_id: student.faculty_id,
                level: fetchLevel
            });
            
            // Map course data to match UI needs
            const mappedCourses = courses.map(c => ({
                id: c.id,
                code: c.id,
                name: c.name,
                hours: c.credit_hours || 3,
                type: c.course_type || 'إجباري',
                department: c.department_id || 'عام',
                level: c.level
            }));

            setAvailableCourses(mappedCourses);

            // 3. Fetch current enrollments
            const enrollments = await enrollmentsApi.list({ 
                student_id: student.student_id,
                status: 'مسجل' 
            });
            
            // 4. Fetch details for all courses we just got (to ensure hours are known)
            // We'll update the allCoursesMap with both available and currently enrolled courses
            // Clear map if this is a fresh student load, otherwise append
            const newAllCoursesMap = filterLevel === undefined ? new Map() : new Map(allCoursesMap);
            mappedCourses.forEach(c => newAllCoursesMap.set(c.id, c));
            
            // For courses already enrolled but not in mappedCourses (different levels)
            const enrolledCourseIds = enrollments.map(e => e.course_id);
            const missingIds = enrolledCourseIds.filter(id => !newAllCoursesMap.has(id));
            
            if (missingIds.length > 0) {
                // Fetch these missing courses
                try {
                    // We might need an API to fetch multiple courses by ID or just list all for faculty
                    const allFacultyCourses = await coursesApi.list({ faculty_id: student.faculty_id });
                    allFacultyCourses.forEach(c => {
                        if (!newAllCoursesMap.has(c.id)) {
                            newAllCoursesMap.set(c.id, {
                                id: c.id,
                                code: c.id,
                                name: c.name,
                                hours: c.credit_hours || 3,
                                type: c.course_type || 'إجباري',
                                department: c.department_id || 'عام',
                                level: c.level
                            });
                        }
                    });
                } catch (err) {
                    console.error("Failed to fetch missing course details:", err);
                }
            }

            setAllCoursesMap(newAllCoursesMap);
            setSelectedCourses(enrolledCourseIds);
            setShowSuccess(false);
            setValidationErrors([]);
            setValidationWarnings([]);
        } catch (error) {
            console.error('Failed to load student data:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const toggleCourse = (courseId: string) => {
        if (selectedCourses.includes(courseId)) {
            setSelectedCourses(prev => prev.filter(id => id !== courseId));
        } else {
            setSelectedCourses(prev => [...prev, courseId]);
        }
        // Clear validation when course selection changes
        setValidationErrors([]);
        setValidationWarnings([]);
    };

    // Validate registration based on academic rules
    const validateRegistration = (): boolean => {
        if (!selectedStudent || !academicRules) {
            setValidationErrors(['لا توجد قواعد أكاديمية محددة. يرجى التأكد من إعداد القواعد في لوحة الإدارة.']);
            return false;
        }

        setIsValidating(true);
        const errors: string[] = [];
        const warnings: string[] = [];

        const totalHours = calculateTotalHours();
        const studentGPA = parseFloat(selectedStudent.gpa) || 0;
        const levelData = selectedStudent.level;
        const studentLevel = typeof levelData === 'number' ? levelData : 
                            (typeof levelData === 'string' ? (parseInt(levelData.match(/\d+/)?.[0] || '1') || 1) : 1);
        const isLastSemester = studentLevel === 4;

        const rules = academicRules.registration || {
            minimumCreditHours: 12,
            maximumCreditHours: 21,
            maximumCreditHoursWithGPA: { enabled: false, gpaThreshold: 3.0, maxHours: 24 },
            maximumCreditHoursLastSemester: 24
        };

        // Check minimum credit hours
        if (totalHours < rules.minimumCreditHours) {
            errors.push(`عدد الساعات المعتمدة أقل من الحد الأدنى المطلوب (${rules.minimumCreditHours} ساعة). الساعات الحالية: ${totalHours}`);
        }

        // Check maximum credit hours
        let maxHours = rules.maximumCreditHours;
        
        // Check if student qualifies for higher hours based on GPA
        if (rules.maximumCreditHoursWithGPA?.enabled && studentGPA >= rules.maximumCreditHoursWithGPA.gpaThreshold) {
            maxHours = rules.maximumCreditHoursWithGPA.maxHours;
        }

        // Check if last semester allows more hours
        if (isLastSemester && totalHours <= (rules.maximumCreditHoursLastSemester || 24)) {
            if (totalHours > maxHours) {
                maxHours = rules.maximumCreditHoursLastSemester || 24;
            }
        }

        if (totalHours > maxHours) {
            errors.push(`عدد الساعات المعتمدة يتجاوز الحد الأقصى المسموح (${maxHours} ساعة). الساعات الحالية: ${totalHours}`);
        }

        // Check academic warning limits if applicable
        if (academicRules.academicWarning?.enabled && studentGPA < (academicRules.academicWarning?.gpaThreshold || 2.0)) {
            const warningLimit = academicRules.academicWarning?.registrationLimit?.underWarning || 12;
            if (totalHours > warningLimit) {
                errors.push(`الطالب تحت الملاحظة الأكاديمية. الحد الأقصى المسموح: ${warningLimit} ساعة.`);
            }
        }

        setValidationErrors(errors);
        setValidationWarnings(warnings);
        setIsValidating(false);

        return errors.length === 0;
    };

    const calculateTotalHours = (): number => {
        return selectedCourses.reduce((sum, courseId) => {
            const course = allCoursesMap.get(courseId);
            return sum + (course ? course.hours : 0);
        }, 0);
    };

    const handleSave = async () => {
        if (!validateRegistration() || !selectedStudent) {
            return;
        }

        setIsLoadingData(true);
        try {
            // 1. Get current enrollments to see what changed
            const currentEnrollments = await enrollmentsApi.list({ 
                student_id: selectedStudent.student_id,
                status: 'مسجل'
            });
            const currentCourseIds = currentEnrollments.map(e => e.course_id);

            // 2. Identify new courses to add
            const toAdd = selectedCourses.filter(id => !currentCourseIds.includes(id));
            
            // 3. Identify courses to remove
            const toRemove = currentEnrollments.filter(e => !selectedCourses.includes(e.course_id));

            // 4. Perform deletions
            for (const enrollment of toRemove) {
                await enrollmentsApi.delete(enrollment.id);
            }

            // 5. Perform additions
            for (const courseId of toAdd) {
                await enrollmentsApi.create({
                    student_id: selectedStudent.student_id,
                    course_id: courseId,
                    semester: '2024-2025 خريف',
                    status: 'مسجل'
                });
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setValidationErrors([]);
                setValidationWarnings([]);
            }, 3000);
        } catch (error) {
            console.error('Failed to save registration:', error);
            alert('حدث خطأ أثناء حفظ التسجيل');
        } finally {
            setIsLoadingData(false);
        }
    };

    const totalHours = calculateTotalHours();

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">التسجيل الأكاديمي للطلاب</h1>
                <p className="text-gray-500">تسجيل المقررات الدراسية للفصل الحالي</p>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Right Sidebar: Search & Student Info */}
                <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
                    {/* Search Box */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <h3 className="font-bold text-gray-900 mb-3 text-sm">بحث عن طالب</h3>
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="كود الطالب / الرقم القومي / اسم الطالب"
                                    className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-right"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    autoComplete="off"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                
                                {/* Autocomplete Suggestions Box */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-right">
                                        {suggestions.map(student => (
                                            <div 
                                                key={student.student_id} 
                                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                                onClick={() => {
                                                    setSearchTerm(student.student_id);
                                                    setShowSuggestions(false);
                                                    setSelectedStudent(student);
                                                    loadStudentData(student);
                                                }}
                                            >
                                                <div className="font-bold text-sm text-gray-900">{student.name}</div>
                                                <div className="text-xs text-gray-500 flex gap-2">
                                                    <span className="bg-gray-100 px-1 py-0.5 rounded font-mono">{student.student_id}</span>
                                                    <span>|</span>
                                                    <span>{student.faculty_id}</span>
                                                    <span>|</span>
                                                    <span>{student.department_id || 'عام'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-3 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                            >
                                بحث
                            </button>
                        </form>
                        {isSearching && (
                            <div className="mt-4 flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                            </div>
                        )}
                    </div>

                    {/* Student Info Card */}
                    {selectedStudent ? (
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 animate-in slide-in-from-right duration-300">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{selectedStudent.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{selectedStudent.student_id}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">الكلية:</span>
                                    <span className="font-medium">{selectedStudent.faculty}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">القسم:</span>
                                    <span className="font-medium">{selectedStudent.department}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">المستوى:</span>
                                    <span className="font-medium">{selectedStudent.level}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">المعدل (GPA):</span>
                                    <span className="font-bold text-primary-600">{selectedStudent.gpa}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">اللائحة:</span>
                                    <span className="font-medium">{selectedStudent.regulation}</span>
                                </div>
                            </div>

                            {/* Registration Stats */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <h4 className="font-bold text-gray-900 text-sm mb-3">ملخص التسجيل الحالي</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                                        <span className="block text-xl font-bold text-blue-700">{selectedCourses.length}</span>
                                        <span className="text-xs text-blue-600">مقررات</span>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                                        <span className="block text-xl font-bold text-purple-700">{totalHours}</span>
                                        <span className="text-xs text-purple-600">ساعة معتمدة</span>
                                    </div>
                                </div>

                                {/* Rules Info */}
                                {academicRules && academicRules.registration && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                                            <Info size={14} className="text-primary-600" />
                                            القواعد الأكاديمية
                                        </h4>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div>الحد الأدنى: {academicRules.registration?.minimumCreditHours || 12} ساعة</div>
                                            <div>الحد الأقصى: {academicRules.registration?.maximumCreditHours || 21} ساعة</div>
                                            {academicRules.registration?.maximumCreditHoursWithGPA?.enabled && (
                                                <div className="text-primary-600">
                                                    مع معدل ≥ {academicRules.registration?.maximumCreditHoursWithGPA?.gpaThreshold}: 
                                                    {academicRules.registration?.maximumCreditHoursWithGPA?.maxHours} ساعة
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <ArrowRight className="mx-auto mb-2 text-gray-400" size={32} />
                            <p className="text-gray-500 text-sm">قم بالبحث عن طالب للبدء في التسجيل</p>
                        </div>
                    )}
                </div>

                {/* Left Content: Course Selection */}
                <div className="flex-1 p-6 overflow-y-auto bg-white">
                    {selectedStudent ? (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="text-primary-600" size={20} />
                                    المقررات المتاحة للتسجيل
                                </h2>
                                <div className="flex gap-2 items-center">
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        {[1, 2, 3, 4, 'all'].map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => setCourseLevel(lvl as any)}
                                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                                                    courseLevel === lvl 
                                                    ? 'bg-white text-primary-700 shadow-sm' 
                                                    : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                {lvl === 'all' ? 'الكل' : `م${lvl}`}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1">
                                        <Filter size={12} /> {availableCourses.length} مقرر متاح
                                    </span>
                                </div>
                            </div>

                            {/* Course List */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-20">
                                {availableCourses.map(course => (
                                    <div
                                        key={course.id}
                                        className={`
                        relative border rounded-xl p-4 transition-all cursor-pointer hover:shadow-md
                        ${selectedCourses.includes(course.id)
                                                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                                                : 'border-gray-200 bg-white hover:border-gray-300'}
                      `}
                                        onClick={() => toggleCourse(course.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`font-bold mb-1 ${selectedCourses.includes(course.id) ? 'text-primary-900' : 'text-gray-900'}`}>
                                                    {course.name}
                                                </h4>
                                                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded font-mono">
                                                    {course.id}
                                                </span>
                                            </div>
                                            <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center transition-colors
                          ${selectedCourses.includes(course.id) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-300'}
                        `}>
                                                <CheckCircle size={14} className={selectedCourses.includes(course.id) ? 'opacity-100' : 'opacity-0'} />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                {course.hours} ساعات
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                المستوى {course.level}
                                            </span>
                                            <span>{course.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Validation Messages */}
                            {(validationErrors.length > 0 || validationWarnings.length > 0) && (
                                <div className="mb-4 space-y-2">
                                    {validationErrors.map((error, idx) => (
                                        <div key={idx} className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    ))}
                                    {validationWarnings.map((warning, idx) => (
                                        <div key={idx} className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg text-sm">
                                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                            <span>{warning}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center z-10">
                                <div>
                                    <span className="text-sm text-gray-500 ml-2">إجمالي الساعات المختارة:</span>
                                    <span className={`text-xl font-bold ml-2 ${
                                        academicRules && academicRules.registration && (
                                            totalHours < (academicRules.registration.minimumCreditHours || 12) ||
                                            totalHours > (academicRules.registration.maximumCreditHours || 21)
                                        ) ? 'text-red-600' : 'text-primary-700'
                                    }`}>
                                        {totalHours}
                                    </span>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={selectedCourses.length === 0 || isValidating}
                                    className={`
                      px-8 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all
                      ${selectedCourses.length > 0 && !isValidating
                                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-md hover:scale-[1.02]'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                    `}
                                >
                                    <Save size={18} />
                                    {isValidating ? 'جارٍ التحقق...' : 'حفظ التسجيل'}
                                </button>
                            </div>

                            {/* Success Toast */}
                            {showSuccess && (
                                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-in slide-in-from-bottom fade-in duration-300 z-50">
                                    <CheckCircle size={20} />
                                    <span className="font-bold">تم حفظ تسجيل المقررات بنجاح!</span>
                                </div>
                            )}

                            {/* No Rules Warning */}
                            {!academicRules && selectedStudent && (
                                <div className="mb-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg text-sm">
                                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold">تحذير:</span> لم يتم العثور على قواعد أكاديمية محددة. 
                                        يرجى التأكد من إعداد القواعد في لوحة الإدارة من قبل المشرف العام.
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <BookOpen size={48} className="opacity-20" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-500 mb-2">مرحباً بك في نظام التسجيل الأكاديمي</h3>
                            <p className="max-w-md text-center text-sm leading-relaxed">
                                يمكنك من خلال هذه الشاشة تسجيل المقررات الدراسية للطلاب ومراجعة ساعاتهم المعتمدة.
                                ابدأ بالبحث عن الطالب في القائمة الجانبية.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentRegistrationManagement;
