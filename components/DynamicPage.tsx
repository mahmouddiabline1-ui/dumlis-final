import React, { useState, useEffect } from 'react';
import { PageConfig, Column } from '../types';
import { Plus, Edit2, Trash2, Printer, FileText, CheckCircle2, Download, Search, Filter, Save, XCircle, Clock, UploadCloud, Paperclip, Send, X } from 'lucide-react';
import AttendanceEntry from './AttendanceEntry';
import SmartForm from './SmartForm';
import ClassroomAssignmentForm from './ClassroomAssignmentForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getFieldOptions, shouldUseDropdown, FORM_OPTIONS } from '../data/formOptions';
import {
  courseClosuresApi,
  studentsApi,
  coursesApi,
  schedulesApi,
  reportSignaturesApi,
  usersApi,
  courseEquivalencesApi,
  regRequestsApi,
  attendanceApi,
  financialApi,
  enrollmentsApi,
  committeesApi,
  gradesApi,
  systemSettingsApi,
  surveyRulesApi,
  feeSetupApi,
  studentRequirementsApi,
  staffApi,
  announcementsApi,
  academicCalendarApi,
  departmentsApi,
  programsApi,
  academicRulesApi,
  studentProfileApi,
  regulationsApi,
} from '../api';

interface DynamicPageProps {
  config: PageConfig;
  initialSearchTerm?: string;
  selectedFacultyId?: string | null;
  onSaveSuccess?: () => void;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ config, initialSearchTerm, selectedFacultyId, onSaveSuccess }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [dataVersion, setDataVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Persist and restore modal state
  useEffect(() => {
    const savedModalState = sessionStorage.getItem(`modal_${config.id}`);
    if (savedModalState) {
      try {
        const { showModal: savedShow, modalType: savedType, editingRow: savedRow, formData: savedForm } = JSON.parse(savedModalState);
        setShowModal(savedShow);
        setModalType(savedType);
        setEditingRow(savedRow);
        setFormData(savedForm);
        sessionStorage.removeItem(`modal_${config.id}`); // Clear after restoring
      } catch (e) {
        console.log('Could not restore modal state');
      }
    }
  }, [config.id]);

  // Save modal state when it changes
  useEffect(() => {
    if (showModal && (editingRow || modalType === 'add')) {
      sessionStorage.setItem(`modal_${config.id}`, JSON.stringify({ showModal, modalType, editingRow, formData }));
    } else {
      sessionStorage.removeItem(`modal_${config.id}`);
    }
  }, [showModal, modalType, editingRow, formData, config.id]);

  // Update search term when initialSearchTerm changes
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Filter data based on search (dataVersion ensures re-render when data changes)
  const filteredData = React.useMemo(() => {
    return (config.data || []).filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [config.data, searchTerm, dataVersion]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    // Scroll to top of table
    const tableElement = document.querySelector('table');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Handle action button clicks
  const handleAction = (action: any, config: any, row?: any) => {
    switch (action.type) {
      case 'add':
        setEditingRow(null);
        setFormData({});
        setModalType('add');
        setShowModal(true);
        break;
      
      case 'export':
        exportToExcel(filteredData, config);
        break;
      
      case 'print':
        window.print();
        break;
      
      case 'edit':
        setEditingRow(row);
        setFormData(row || {});
        setModalType('edit');
        setShowModal(true);
        break;
      
      case 'approve':
        if (row?.id && confirm('هل أنت متأكد من قبول هذا الطلب؟')) {
          (async () => {
            try {
              await regRequestsApi.update(row.id, { status: 'مقبول' });
              showNotification('تم قبول الطلب بنجاح!', 'success');
              setDataVersion(v => v + 1);
            } catch (err) {
              showNotification(`خطأ: ${err instanceof Error ? err.message : String(err)}`, 'error');
            }
          })();
        }
        break;

      case 'reject':
        if (row?.id && confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
          (async () => {
            try {
              await regRequestsApi.update(row.id, { status: 'مرفوض' });
              showNotification('تم رفض الطلب.', 'error');
              setDataVersion(v => v + 1);
            } catch (err) {
              showNotification(`خطأ: ${err instanceof Error ? err.message : String(err)}`, 'error');
            }
          })();
        }
        break;
      
      case 'view':
        setEditingRow(row);
        setFormData(row || {});
        setModalType('view');
        setShowModal(true);
        break;
      
      case 'auto_generate':
        if (config.id === 'create_sched') {
          if (confirm('هل تريد البدء في توليد الجدول الدراسي تلقائياً بناءً على البيانات الحالية والذكاء الاصطناعي؟')) {
            const faculty_id = localStorage.getItem('userFacultyId') || undefined;
            const month = new Date().getMonth() + 1;
            let semester = 'خريف';
            if (month === 6) semester = 'صيف';
            else if (month === 1) semester = 'ربيع';
            
            showNotification('بدأت عملية التوليد التلقائي... قد تستغرق بضع ثوانٍ', 'success');
            schedulesApi.autoGenerate({ faculty_id, semester, dry_run: false })
              .then(res => {
                showNotification(`تم توليد ${res.generated} جلسة دراسية بنجاح!`, 'success');
                setDataVersion(v => v + 1); // Refresh data
              })
              .catch(err => {
                console.error(err);
                showNotification('فشلت عملية التوليد التلقائي. تأكد من إعداد القاعات والمقررات.', 'error');
              });
          }
        }
        break;
      
      default:
        setModalType(action.type);
        setShowModal(true);
    }
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
    notification.innerHTML = `${type === 'success' ? '✅' : '❌'} ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Get API updater/creator based on page ID
  const getApiFunction = (pageId: string, operation: 'create' | 'update') => {
    const apiMap = {
      create: {
        course_close: courseClosuresApi.create,
        student_list: studentsApi.create,
        study_courses: coursesApi.create,
        course_schedules: schedulesApi.create,
        report_signs: reportSignaturesApi.create,
        lecturers: schedulesApi.create,
        equivalent_courses: courseEquivalencesApi.create,
        review_student_reg: regRequestsApi.create,
        manage_reg_issues: regRequestsApi.create,
        balance_reg: regRequestsApi.create,
        block_reg_by_renewal: regRequestsApi.create,
        attendance_log: attendanceApi.create,
        financial_records: financialApi.create,
        enrollments: enrollmentsApi.create,
        assign_room: committeesApi.create,
        // ── newly wired pages ──
        advanced_student_search: studentsApi.create,
        department_students: studentsApi.create,
        student_data_management: studentsApi.create,
        student_academic_profile: studentsApi.create,
        comm_def: committeesApi.create,
        sys_edit: (data: any) => systemSettingsApi.create(data),
        fees_setup: (data: any) => feeSetupApi.create(data),
        survey_rules: (data: any) => surveyRulesApi.create(data),
        enter_grades: (data: any) => gradesApi.create(data),
        student_affairs_requirements: (data: any) => studentRequirementsApi.create(data),
        lecturers_staff: (data: any) => staffApi.create(data),
        academic_calendar: (data: any) => academicCalendarApi.create(data),
        announcements_page: (data: any) => announcementsApi.create(data),
        info_board: (data: any) => announcementsApi.create(data),
        default: (data: any) => announcementsApi.create(data),
        fees_collect: (data: any) => financialApi.create(data),
        payment_perm: (data: any) => financialApi.create(data),
        manage_departments: (data: any) => departmentsApi.create(data),
        program_data: (data: any) => programsApi.create(data),
        program_rules: (data: any) => academicRulesApi.create(data),
        student_attendance: attendanceApi.create,
        detailed_attendance: attendanceApi.create,
        fees_report: financialApi.create,
        student_fees: financialApi.create,
        student_grades: gradesApi.create,
        student_enrollments: enrollmentsApi.create,
        military_edu: (data: any) => studentProfileApi.update(data.student_id, {
          mil_edu_status: data.military_status,
          mil_edu_completion: data.completion_date || null,
          mil_edu_notes: data.notes || '',
        }),
        contact_list: studentsApi.create,
        id_cards: studentsApi.create,
      } as Record<string, (data: any) => Promise<any>>,
      update: {
        course_close: (id: any, data: any) => courseClosuresApi.update(id, data),
        student_list: (id: any, data: any) => studentsApi.update(id, data),
        study_courses: (id: any, data: any) => coursesApi.update(id, data),
        course_schedules: (id: any, data: any) => schedulesApi.update(id, data),
        report_signs: (id: any, data: any) => reportSignaturesApi.update(id, data),
        lecturers: (id: any, data: any) => schedulesApi.update(id, data),
        equivalent_courses: (id: any, data: any) => courseEquivalencesApi.update(id, data),
        review_student_reg: (id: any, data: any) => regRequestsApi.update(id, data),
        manage_reg_issues: (id: any, data: any) => regRequestsApi.update(id, data),
        balance_reg: (id: any, data: any) => regRequestsApi.update(id, data),
        block_reg_by_renewal: (id: any, data: any) => regRequestsApi.update(id, data),
        attendance_log: (id: any, data: any) => attendanceApi.update(id, data),
        financial_records: (id: any, data: any) => financialApi.update(id, data),
        enrollments: (id: any, data: any) => enrollmentsApi.update(id, data),
        assign_room: (id: any, data: any) => committeesApi.update(id, data),
        // ── newly wired pages ──
        advanced_student_search: (id: any, data: any) => studentsApi.update(id, data),
        department_students: (id: any, data: any) => studentsApi.update(id, data),
        student_data_management: (id: any, data: any) => studentsApi.update(id, data),
        student_academic_profile: (id: any, data: any) => studentsApi.update(id, data),
        comm_def: (id: any, data: any) => committeesApi.update(id, data),
        sys_edit: (id: any, data: any) => systemSettingsApi.update(id, data),
        fees_setup: (id: any, data: any) => feeSetupApi.update(id, data),
        survey_rules: (id: any, data: any) => surveyRulesApi.update(id, data),
        enter_grades: (id: any, data: any) => gradesApi.update(id, data),
        student_affairs_requirements: (id: any, data: any) => studentRequirementsApi.update(id, data),
        lecturers_staff: (id: any, data: any) => staffApi.update(id, data),
        academic_calendar: (id: any, data: any) => academicCalendarApi.update(id, data),
        announcements_page: (id: any, data: any) => announcementsApi.update(id, data),
        info_board: (id: any, data: any) => announcementsApi.update(id, data),
        default: (id: any, data: any) => announcementsApi.update(id, data),
        fees_collect: (id: any, data: any) => financialApi.update(id, data),
        payment_perm: (id: any, data: any) => financialApi.update(id, data),
        manage_departments: (id: any, data: any) => departmentsApi.update(id, data),
        view_departments: (id: any, data: any) => departmentsApi.update(id, data),
        program_data: (id: any, data: any) => programsApi.update(id, data),
        program_rules: (id: any, data: any) => academicRulesApi.update(id, data),
        bylaw_courses: (id: any, data: any) => regulationsApi.update(id, data),
        course_catalog: (id: any, data: any) => coursesApi.update(id, data),
        // ── pages that update student fields directly — return shaped response to avoid raw student fields overwriting display fields ──
        gpa_mod: async (id: any, data: any) => {
          await studentsApi.update(id, {
            gpa: parseFloat(data.new_gpa),
            gpa_mod_status: data.status,
            gpa_mod_reason: data.reason || '',
          });
          const newGpa = parseFloat(data.new_gpa);
          const oldGpa = parseFloat(data.old_gpa);
          return {
            id, student_id: id,
            student_name: data.student_name,
            old_gpa: oldGpa.toFixed(2),
            new_gpa: newGpa.toFixed(2),
            difference: (newGpa - oldGpa).toFixed(2),
            reason: data.reason || '',
            date: data.date,
            status: data.status || (Math.abs(newGpa - oldGpa) > 0.1 ? 'قيد المراجعة' : 'موافق عليه'),
          };
        },
        level_mod: async (id: any, data: any) => {
          await studentsApi.update(id, {
            level: Number(data.new_level_raw) || Number(data.level),
            level_mod_status: data.status,
            level_mod_reason: data.reason || '',
          });
          return { ...data, id, updated_at: new Date().toISOString() };
        },
        military_edu: async (id: any, data: any) => {
          await studentProfileApi.update(id, {
            mil_edu_status: data.military_status,
            mil_edu_completion: data.completion_date || null,
            mil_edu_notes: data.notes || '',
          });
          return { ...data, id, updated_at: new Date().toISOString() };
        },
        contact_list: (id: any, data: any) => studentsApi.update(id, data),
        id_cards: (id: any, data: any) => studentsApi.update(id, data),
        grad_year: async (id: any, data: any) => {
          await studentsApi.update(id, { graduation_year: parseInt(data.graduation_year) });
          return { ...data, id, updated_at: new Date().toISOString() };
        },
        student_attendance: (id: any, data: any) => attendanceApi.update(id, data),
        detailed_attendance: (id: any, data: any) => attendanceApi.update(id, data),
        fees_report: (id: any, data: any) => financialApi.update(id, data),
        student_fees: (id: any, data: any) => financialApi.update(id, data),
        student_grades: (id: any, data: any) => gradesApi.update(id, data),
        student_enrollments: (id: any, data: any) => enrollmentsApi.update(id, data),
      } as Record<string, (id: any, data: any) => Promise<any>>,
    };

    if (operation === 'create') {
      return apiMap.create[pageId];
    } else {
      return apiMap.update[pageId];
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Auto-generate semester based on month if not set
      if (config.id === 'create_sched' && modalType === 'add' && !formData.semester) {
        const month = new Date().getMonth() + 1;
        if (month >= 6 && month <= 7) {
          formData.semester = 'الفصل الصيفي';
        } else if (month >= 8 || month <= 12) {
          formData.semester = 'الفصل الأول';
        } else if (month >= 1 && month <= 5) {
          formData.semester = 'الفصل الثاني';
        }
      }

      // Auto-generate schedule_id for new schedules
      if (config.id === 'create_sched' && modalType === 'add' && !formData.schedule_id) {
        const semesterCode = formData.semester?.includes('صيفي') ? 'SUMMER' :
                            formData.semester?.includes('الأول') ? 'FALL' :
                            formData.semester?.includes('الثاني') ? 'SPRING' : 'FALL';
        const year = formData.academic_year ? formData.academic_year.split('-')[0] : new Date().getFullYear();

        const existingSchedules = config.data || [];
        const existingNumbers = existingSchedules
          .map((s: any) => s.schedule_id)
          .filter((id: string) => id && id.includes(`SCH-${year}-${semesterCode}`))
          .map((id: string) => {
            const parts = id.split('-');
            return parseInt(parts[parts.length - 1]) || 0;
          });

        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        formData.schedule_id = `SCH-${year}-${semesterCode}-${String(nextNumber).padStart(3, '0')}`;
      }

      if (config.id === 'create_sched' && modalType === 'add' && !formData.academic_year) {
        const currentYear = new Date().getFullYear();
        formData.academic_year = `${currentYear}-${currentYear + 1}`;
      }

      if (config.id === 'create_sched' && modalType === 'add' && !formData.created_date) {
        formData.created_date = new Date().toISOString().split('T')[0];
      }

      if (config.id === 'create_sched' && modalType === 'add' && !formData.status) {
        formData.status = 'قيد الإنشاء';
      }

      if (config.id === 'create_sched' && modalType === 'add' && !formData.courses_count) {
        formData.courses_count = '6';
      }

      if (modalType === 'add') {
        if (config.id === 'info_board' || config.id === 'default') {
          if (!formData.date) formData.date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'منشور';
        }
        if (config.id === 'course_close') {
          const y = new Date().getFullYear();
          if (!formData.academic_year) formData.academic_year = `${y}-${y + 1}`;
          if (!formData.closure_date) formData.closure_date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'مفتوح';
        }
        if (config.id === 'sys_edit') {
          if (!formData.status) formData.status = 'نشط';
          if (!formData.category) formData.category = 'عام';
        }
        if (config.id === 'gpa_mod') {
          if (!formData.date) formData.date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'قيد المراجعة';
        }
        if (config.id === 'level_mod') {
          if (!formData.date) formData.date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'قيد المراجعة';
        }
        if (config.id === 'grad_year') {
          if (!formData.date) formData.date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'قيد المراجعة';
          if (!formData.graduation_year) formData.graduation_year = String(new Date().getFullYear());
        }
        if (config.id === 'fees_setup') {
          const y = new Date().getFullYear();
          if (!formData.academic_year) formData.academic_year = `${y}-${y + 1}`;
          if (!formData.date) formData.date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'نشط';
        }
        if (config.id === 'fees_collect') {
          if (!formData.payment_date) formData.payment_date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'مسدد';
        }
        if (config.id === 'payment_perm') {
          if (!formData.request_date) formData.request_date = new Date().toISOString().split('T')[0];
          if (!formData.status) formData.status = 'قيد المراجعة';
        }

        // Try to call API for pages that have it
        const apiCreator = getApiFunction(config.id, 'create');
        if (apiCreator) {
          try {
            const response = await (apiCreator as any)(formData);
            // Update state with response from server
            const newRecord = {
              ...response,
              actions: 'تعديل | حذف'
            };
            if (config.data) {
              config.data.push(newRecord);
            } else {
              config.data = [newRecord];
            }
          } catch (apiError) {
            console.error('API error during create:', apiError);
            // Fallback to local-only update if API fails
            const maxId = config.data?.length > 0 ? Math.max(...config.data.map((item: any) => item.id || 0)) : 0;
            const newRecord = {
              id: maxId + 1,
              ...formData,
              actions: 'تعديل | حذف',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            if (config.data) {
              config.data.push(newRecord);
            } else {
              config.data = [newRecord];
            }
          }
        } else {
          // No API for this page, just update locally
          const maxId = config.data?.length > 0 ? Math.max(...config.data.map((item: any) => item.id || 0)) : 0;
          const newRecord = {
            id: maxId + 1,
            ...formData,
            actions: 'تعديل | حذف',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          if (config.data) {
            config.data.push(newRecord);
          } else {
            config.data = [newRecord];
          }
        }

        showNotification('تم إضافة السجل بنجاح!', 'success');
        setDataVersion(prev => prev + 1);
      } else if (modalType === 'edit') {
        // Check for schedule conflicts before saving
        if (config.id === 'course_schedules' && formData.room_id && formData.day && formData.time_start && formData.time_end) {
          try {
            const conflict = await schedulesApi.checkConflict({
              room_id: formData.room_id,
              day: formData.day,
              time_start: formData.time_start,
              time_end: formData.time_end,
              exclude_id: editingRow?.id
            });
            if (conflict.has_conflict) {
              const conflictInfo = conflict.conflicts[0];
              showNotification(
                `القاعة ${formData.room_id} محجوزة في هذا الوقت من قبل المقرر ${conflictInfo.course_id}`,
                'error'
              );
              setIsSubmitting(false);
              return;
            }
          } catch (err) {
            console.warn('Conflict check failed:', err);
          }
        }

        // Prepare form data for API - convert level_raw to level for student pages
        let apiFormData = { ...formData };
        if ((config.id === 'student_list' || config.id === 'department_students' || config.id === 'advanced_student_search') && formData.level_raw) {
          apiFormData.level = formData.level_raw;
        }

        // Try to call API for pages that have it
        const apiUpdater = getApiFunction(config.id, 'update');
        if (apiUpdater && editingRow && editingRow.id) {
          try {
            const response = await apiUpdater(editingRow.id, apiFormData);
            // Update state with response from server
            if (config.data) {
              const index = config.data.findIndex((item: any) => item.id === editingRow.id);
              if (index !== -1) {
                config.data[index] = {
                  ...config.data[index],
                  ...response,
                  updated_at: new Date().toISOString()
                };
              }
            }
            showNotification('تم تحديث السجل بنجاح!', 'success');
            setDataVersion(prev => prev + 1);
            onSaveSuccess?.();
          } catch (apiError: any) {
            console.error('API error during update:', apiError);
            const msg = apiError?.message || 'حدث خطأ أثناء التحديث';
            showNotification(`فشل التحديث: ${msg}`, 'error');
          }
        } else {
          // No API for this page, just update locally
          if (config.data && editingRow) {
            const index = config.data.findIndex((item: any) => item.id === editingRow.id);
            if (index !== -1) {
              config.data[index] = {
                ...config.data[index],
                ...formData,
                updated_at: new Date().toISOString()
              };
            }
          }
          showNotification('تم تحديث السجل بنجاح!', 'success');
          setDataVersion(prev => prev + 1);
        }
      }

      setShowModal(false);
      setFormData({});
      setEditingRow(null);
    } catch (error: any) {
      console.error('Submission error:', error);
      showNotification('حدث خطأ أثناء حفظ البيانات: ' + (error?.message || 'خطأ غير معروف'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export to Excel function
  const exportToExcel = (data: any[], config: any) => {
    if (!data || data.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    // Create CSV content
    const headers = config.columns?.map((col: any) => col.label).join(',') || '';
    const rows = data.map(row => 
      config.columns?.map((col: any) => {
        const value = row[col.key] || '';
        // Escape commas and quotes in CSV
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');

    const csvContent = headers + '\n' + rows;
    
    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${config.title || 'data'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    notification.innerHTML = `✅ تم تصدير ${data.length} سجل بنجاح!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    let colorClass = 'bg-gray-100 text-gray-700';
    let Icon = null;

    if (['نشط', 'حاضر', 'مقيد', 'نعم', 'منتهي', 'مقبول', 'ساري', 'تمت الطباعة', 'متوفر', 'منشور', 'مورد', 'مكتمل', 'مسدد', 'اجتاز', 'إضافة', 'مفتوح'].includes(status)) {
      colorClass = 'bg-green-50 text-green-700 border border-green-200';
      Icon = CheckCircle2;
    } else if (['غير نشط', 'غائب', 'موقوف', 'لا', 'مرفوض', 'لم يطبع', 'غير متوفر', 'غير منشور', 'غير مسدد', 'حذف', 'مغلق'].includes(status)) {
      colorClass = 'bg-red-50 text-red-700 border border-red-200';
      Icon = XCircle;
    } else if (['قيد المراجعة', 'مجمد', 'مجدول', 'بعذر', 'موشك على الامتلاء', 'جاهز للاستلام', 'تعديل', 'تحديث'].includes(status)) {
      colorClass = 'bg-amber-50 text-amber-700 border border-amber-200';
      Icon = Clock;
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  const renderCell = (row: any, col: Column) => {
    const value = row[col.key];
    
    if (col.type === 'status') {
      return getStatusBadge(value);
    }
    
    if (col.type === 'currency') {
      return <span className="font-mono font-medium text-gray-900">{Number(value).toLocaleString()} ج.م</span>;
    }

    if (col.type === 'file') {
        return (
            <div className="flex items-center gap-2 text-primary-600 cursor-pointer hover:underline">
                <Paperclip className="w-3 h-3" />
                <span>{value}</span>
            </div>
        )
    }

    if (col.type === 'progress') {
      const percent = value.includes('%') ? parseInt(value) : 60;
      return (
        <div className="w-full max-w-[140px]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">{value}</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 rounded-full" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      );
    }

    // Format date for activity log
    if (col.type === 'date' && config.id === 'all_activities' && value) {
      const date = new Date(value);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      let timeAgo = '';
      if (minutes < 1) timeAgo = 'الآن';
      else if (minutes < 60) timeAgo = `منذ ${minutes} دقيقة`;
      else if (hours < 24) timeAgo = `منذ ${hours} ساعة`;
      else if (days < 7) timeAgo = `منذ ${days} يوم`;
      else {
        timeAgo = date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      return (
        <div className="flex flex-col">
          <span className="text-gray-700 font-medium">{timeAgo}</span>
          <span className="text-xs text-gray-400">
            {date.toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      );
    }

    return <span className="text-gray-700">{value}</span>;
  };

  return (
    <div className={`space-y-6 ${config.id === 'all_activities' ? 'w-full' : ''}`}>
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-gold-500"></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{config.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {config.actions?.map((action, idx) => (
            <button 
              key={idx}
              onClick={() => handleAction(action, config)}
              data-dynamicpage-action={action.type}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95
                ${action.type === 'add' || action.type === 'approve' || action.type === 'upload'
                  ? 'bg-primary-800 text-white hover:bg-primary-900 hover:shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary-700'}
              `}
            >
              {action.type === 'add' && <Plus className="w-4 h-4" />}
              {action.type === 'print' && <Printer className="w-4 h-4" />}
              {action.type === 'view' && <FileText className="w-4 h-4" />}
              {action.type === 'edit' && <Edit2 className="w-4 h-4" />}
              {action.type === 'approve' && <CheckCircle2 className="w-4 h-4" />}
              {action.type === 'reject' && <XCircle className="w-4 h-4" />}
              {action.type === 'export' && <Download className="w-4 h-4" />}
              {action.type === 'upload' && <UploadCloud className="w-4 h-4" />}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
        
        {/* REQUEST FORM VIEW (Specifically for Registration Issues) */}
        {config.type === 'request_form' && (
            <div className="flex flex-col md:flex-row h-full">
                {/* Left: New Request Form */}
                <div className="w-full md:w-1/3 p-6 border-l border-gray-100 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-gold-500" />
                        تقديم طلب جديد
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-white text-center cursor-pointer hover:border-gold-400 hover:bg-gold-50/10 transition-colors">
                            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">اضغط لرفع الاستمارة (PDF/Image)</p>
                            <p className="text-xs text-gray-400 mt-1">الحد الأقصى 5 ميجا</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">شرح المشكلة</label>
                            <textarea 
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm min-h-[120px]"
                                placeholder="اكتب تفاصيل المشكلة هنا..."
                            ></textarea>
                        </div>

                        <button className="w-full py-2.5 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            إرسال الطلب
                        </button>
                    </div>
                </div>

                {/* Right: History Table (Reusing table logic logic simplified) */}
                <div className="w-full md:w-2/3 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">سجل الطلبات السابقة</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {config.columns?.map(col => (
                                        <th key={col.key} className="p-3 text-xs font-bold text-gray-600">{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {config.data?.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                        {config.columns?.map(col => (
                                            <td key={col.key} className="p-3 text-sm">{renderCell(row, col)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {config.type === 'attendance_form' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h1>
              <p className="text-gray-600">{config.description}</p>
            </div>
            <AttendanceEntry
              courses={config.data?.[0]?.available_courses || []}
              students={filteredData || []} // Pass all students data
              onSave={(attendanceData) => {
                console.log('Saving attendance:', attendanceData);
                showNotification('تم حفظ بيانات الحضور بنجاح!', 'success');
              }}
            />
          </div>
        )}

        {config.type === 'smart_form' && (
          <div className="animate-fade-in">
            {config.id === 'add_room_assignment' ? (
              <ClassroomAssignmentForm
                config={config}
                facultyId={selectedFacultyId || null}
                onSave={(assignmentData) => {
                  console.log('Saving room assignment:', assignmentData);
                  showNotification('تم حفظ تخصيص القاعة بنجاح!', 'success');
                  // In real app, this would save to database and update the table
                  setTimeout(() => {
                    window.history.back();
                  }, 1500);
                }}
                onCancel={() => {
                  window.history.back();
                }}
              />
            ) : (
              <SmartForm
                config={config}
                onSave={(registrationData) => {
                  console.log('Saving registration:', registrationData);
                  showNotification('تم حفظ التسجيل الأكاديمي بنجاح!', 'success');
                  // In real app, this would save to database
                }}
                onCancel={() => {
                  // Navigate back or close form
                  window.history.back();
                }}
              />
            )}
          </div>
        )}

        {config.type === 'dashboard' && (
          <div className="p-8 animate-fade-in bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="mb-8 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">التمثيل البياني للبيانات</h3>
                <div className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {config.id.includes('stats') ? 'إحصائيات' : 'رسم بياني'}
                </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {config.id.includes('chart') || config.id.includes('pie') ? (
                        <PieChart>
                            <Pie
                                data={config.data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey={Object.keys(config.data[0] || {}).find(k => typeof config.data[0][k] === 'number') || 'value'}
                                nameKey={Object.keys(config.data[0] || {}).find(k => typeof config.data[0][k] === 'string') || 'name'}
                                label
                            >
                                {config.data.map((_: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={['#102a43', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][index % 5]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    ) : (
                        <BarChart data={config.data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey={Object.keys(config.data[0] || {}).find(k => typeof config.data[0][k] === 'string') || 'name'} 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar 
                                dataKey={Object.keys(config.data[0] || {}).find(k => typeof config.data[0][k] === 'number') || 'value'} 
                                fill="#102a43" 
                                radius={[6, 6, 0, 0]} 
                                barSize={40} 
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
             </div>

             <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {config.data.map((item: any, idx: number) => {
                    const nameKey = Object.keys(item).find(k => typeof item[k] === 'string') || 'name';
                    const valKey = Object.keys(item).find(k => typeof item[k] === 'number') || 'value';
                    return (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">{item[nameKey]}</p>
                            <p className="text-lg font-bold text-gray-900">{item[valKey]}</p>
                        </div>
                    );
                })}
             </div>
          </div>
        )}

        {config.type === 'table' && (
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col ${config.id === 'all_activities' ? 'w-full' : ''}`}>
            {/* Toolbar */}
            <div className={`p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between ${config.id === 'all_activities' ? '' : ''}`}>
              <div className={`relative flex-1 ${config.id === 'all_activities' ? 'max-w-lg' : 'max-w-md'}`}>
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="بحث في البيانات..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm outline-none transition-all placeholder:text-gray-400"
                />
                {searchTerm && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {filteredData.length} نتيجة
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all" title="تصفية">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all" title="تصدير">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className={`w-full text-right ${config.id === 'all_activities' ? 'min-w-[1600px]' : ''}`}>
                <thead className="bg-primary-50/50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 w-12">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4" />
                    </th>
                    {config.columns?.map(col => (
                      <th 
                        key={col.key} 
                        className={`p-4 text-xs font-bold text-primary-800 uppercase tracking-wider ${
                          config.id === 'all_activities' && col.key === 'details' ? 'min-w-[400px]' :
                          config.id === 'all_activities' && col.key === 'timestamp' ? 'min-w-[180px]' :
                          config.id === 'all_activities' && col.key === 'user' ? 'min-w-[150px]' :
                          config.id === 'all_activities' && col.key === 'entity' ? 'min-w-[150px]' :
                          config.id === 'all_activities' && col.key === 'faculty' ? 'min-w-[200px]' :
                          config.id === 'all_activities' ? 'min-w-[120px]' : ''
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="p-4 text-xs font-bold text-primary-800 w-24">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-primary-50/30 transition-colors group">
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4" />
                        </td>
                        {config.columns?.map(col => (
                          <td 
                            key={`${idx}-${col.key}`} 
                            className={`p-4 text-sm ${
                              config.id === 'all_activities' && col.key === 'details' ? 'whitespace-normal min-w-[400px] max-w-[500px]' :
                              config.id === 'all_activities' && col.key === 'timestamp' ? 'whitespace-normal min-w-[180px]' :
                              config.id === 'all_activities' ? 'whitespace-normal' : 'whitespace-nowrap'
                            }`}
                          >
                            {renderCell(row, col)}
                          </td>
                        ))}
                        <td className="p-4 flex gap-2">
                          <button 
                            onClick={() => handleAction({ type: 'edit', label: 'تعديل' }, config, row)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-60 group-hover:opacity-100"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
                                try {
                                  // Try to call API delete if available
                                  const apiMap: Record<string, (id: any) => Promise<any>> = {
                                    course_close: (id) => courseClosuresApi.delete(id),
                                    student_list: (id) => studentsApi.delete(id),
                                    study_courses: (id) => coursesApi.delete(id),
                                    course_schedules: (id) => schedulesApi.delete(id),
                                    report_signs: (id) => reportSignaturesApi.delete(id),
                                    lecturers: (id) => schedulesApi.delete(id),
                                    equivalent_courses: (id) => courseEquivalencesApi.delete(id),
                                    review_student_reg: (id) => regRequestsApi.delete(id),
                                    manage_reg_issues: (id) => regRequestsApi.delete(id),
                                    balance_reg: (id) => regRequestsApi.delete(id),
                                    block_reg_by_renewal: (id) => regRequestsApi.delete(id),
                                    attendance_log: (id) => attendanceApi.delete(id),
                                    financial_records: (id) => financialApi.delete(id),
                                    enrollments: (id) => enrollmentsApi.delete(id),
                                    assign_room: (id) => committeesApi.delete(id),
                                    // additional pages
                                    sys_edit: (id) => systemSettingsApi.delete(id),
                                    fees_setup: (id) => feeSetupApi.delete(id),
                                    survey_rules: (id) => surveyRulesApi.delete(id),
                                    contact_list: (id) => studentsApi.delete(id),
                                    id_cards: (id) => studentsApi.delete(id),
                                    program_data: (id) => programsApi.delete(id),
                                    manage_departments: (id) => departmentsApi.delete(id),
                                    view_departments: (id) => departmentsApi.delete(id),
                                    fees_collect: (id) => financialApi.delete(id),
                                    payment_perm: (id) => financialApi.delete(id),
                                    fees_report: (id) => financialApi.delete(id),
                                    student_fees: (id) => financialApi.delete(id),
                                    student_grades: (id) => gradesApi.delete(id),
                                    student_enrollments: (id) => enrollmentsApi.delete(id),
                                    student_attendance: (id) => attendanceApi.delete(id),
                                    detailed_attendance: (id) => attendanceApi.delete(id),
                                    advanced_student_search: (id) => studentsApi.delete(id),
                                    department_students: (id) => studentsApi.delete(id),
                                    student_data_management: (id) => studentsApi.delete(id),
                                    bylaw_courses: (id) => regulationsApi.delete(id),
                                    program_rules: (id) => academicRulesApi.delete(id),
                                    course_catalog: (id) => coursesApi.delete(id),
                                  };

                                  const apiDelete = apiMap[config.id];
                                  if (apiDelete) {
                                    await apiDelete(row.id);
                                  }

                                  // Remove from config data
                                  if (config.data) {
                                    const index = config.data.findIndex((item: any) => item.id === row.id);
                                    if (index !== -1) {
                                      config.data.splice(index, 1);
                                      setDataVersion(prev => prev + 1);
                                    }
                                  }
                                  showNotification('تم حذف السجل بنجاح!', 'success');
                                } catch (error: any) {
                                  console.error('Delete error:', error);
                                  showNotification('فشل حذف السجل: ' + (error?.message || 'خطأ غير معروف'), 'error');
                                }
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-60 group-hover:opacity-100"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={(config.columns?.length || 0) + 2} className="p-20 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 opacity-20" />
                          </div>
                          <p className="text-lg font-medium">لا توجد بيانات لعرضها</p>
                          <p className="text-sm opacity-60">حاول تغيير مصطلحات البحث أو إضافة سجلات جديدة</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 bg-gray-50/30 mt-auto">
                <div className="flex items-center gap-4">
                  <p>
                    عرض {startIndex + 1} - {Math.min(endIndex, filteredData.length)} من {filteredData.length} سجل
                  </p>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                  >
                    <option value={10}>10 لكل صفحة</option>
                    <option value={25}>25 لكل صفحة</option>
                    <option value={50}>50 لكل صفحة</option>
                    <option value={100}>100 لكل صفحة</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    disabled={currentPage === 1 || totalPages === 0}
                    className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
                  >
                    السابق
                  </button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page as number);
                          }}
                          className={`w-8 h-8 flex items-center justify-center rounded text-xs transition-colors cursor-pointer ${
                            currentPage === page
                              ? 'bg-primary-600 text-white font-medium'
                              : 'hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {config.type === 'form' && (
           <div className="p-8 max-w-3xl mx-auto w-full">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">عنوان السجل</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" placeholder="أدخل العنوان..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">التصنيف</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-shadow">
                    <option>اختر التصنيف...</option>
                    <option>عام</option>
                    <option>خاص</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">الوصف التفصيلي</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow resize-none" placeholder="أكتب التفاصيل هنا..."></textarea>
                </div>
                
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">تاريخ التفعيل</label>
                   <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" />
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
               <button className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors">إلغاء</button>
               <button className="px-6 py-2.5 bg-primary-800 text-white rounded-lg hover:bg-primary-900 font-medium flex items-center gap-2 shadow-lg shadow-primary-900/10 transition-all hover:shadow-xl hover:-translate-y-0.5">
                 <Save className="w-4 h-4" />
                 حفظ البيانات
               </button>
             </div>
           </div>
        )}
      </div>

      {/* Modal for Add/Edit/View */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {modalType === 'add' ? 'إضافة جديد' : modalType === 'edit' ? 'تعديل' : 'عرض التفاصيل'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {config.columns?.filter(col => col.key !== 'actions').map((col) => {
                  const isReadOnly = modalType === 'view';
                  const value = formData[col.key] || '';

                  // Special handling for schedule creation
                  if (config.id === 'create_sched' && col.key === 'semester' && modalType === 'add') {
                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <select
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow bg-white"
                          required={modalType === 'add'}
                        >
                          <option value="">اختر الفصل الدراسي...</option>
                          <option value="خريف 2024">خريف 2024</option>
                          <option value="ربيع 2025">ربيع 2025</option>
                          <option value="صيف 2025">صيف 2025</option>
                        </select>
                      </div>
                    );
                  }

                  if (config.id === 'create_sched' && col.key === 'level' && modalType === 'add') {
                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <select
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow bg-white"
                          required={modalType === 'add'}
                        >
                          <option value="">اختر المستوى...</option>
                          <option value="المستوى الأول">المستوى الأول</option>
                          <option value="المستوى الثاني">المستوى الثاني</option>
                          <option value="المستوى الثالث">المستوى الثالث</option>
                          <option value="المستوى الرابع">المستوى الرابع</option>
                        </select>
                      </div>
                    );
                  }

                  if (config.id === 'create_sched' && col.key === 'status' && modalType === 'add') {
                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <select
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow bg-white"
                          required={modalType === 'add'}
                        >
                          <option value="">اختر الحالة...</option>
                          <option value="قيد الإنشاء">قيد الإنشاء</option>
                          <option value="نشط">نشط</option>
                          <option value="منتهي">منتهي</option>
                        </select>
                      </div>
                    );
                  }

                  if (col.type === 'long_text') {
                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <textarea
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                          disabled={isReadOnly}
                          rows={4}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow resize-none disabled:bg-gray-50"
                          required={modalType === 'add'}
                        />
                      </div>
                    );
                  }

                  if (col.type === 'date') {
                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <input
                          type="date"
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow disabled:bg-gray-50"
                          required={modalType === 'add'}
                        />
                      </div>
                    );
                  }

                  // Level field: show Arabic labels, submit integer values
                  if (col.key === 'level' && FORM_OPTIONS.level_options?.length > 0) {
                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <select
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow disabled:bg-gray-50 bg-white"
                          required={modalType === 'add'}
                        >
                          <option value="">اختر المستوى...</option>
                          {FORM_OPTIONS.level_options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  // Context-aware status options based on page type
                  const getContextualOptions = (colKey: string): string[] => {
                    if (colKey === 'status') {
                      const pageStatusMap: Record<string, string[]> = {
                        enrollments: FORM_OPTIONS.enrollment_status,
                        academic_reg: FORM_OPTIONS.enrollment_status,
                        review_student_reg: FORM_OPTIONS.student_reg_status,
                        manage_reg_issues: FORM_OPTIONS.student_reg_status,
                        balance_reg: FORM_OPTIONS.student_reg_status,
                        block_reg_by_renewal: FORM_OPTIONS.student_reg_status,
                        attendance_log: FORM_OPTIONS.attendance_status,
                        add_attendance: FORM_OPTIONS.attendance_status,
                        student_attendance: FORM_OPTIONS.attendance_status,
                        detailed_attendance: FORM_OPTIONS.attendance_status,
                        gpa_mod: ['قيد المراجعة', 'موافق عليه'],
                        financial_records: FORM_OPTIONS.financial_status,
                        fees_collect: FORM_OPTIONS.financial_status,
                        payment_perm: FORM_OPTIONS.financial_status,
                        course_close: FORM_OPTIONS.closure_status,
                        assign_room: FORM_OPTIONS.committee_status,
                        comm_def: FORM_OPTIONS.committee_status,
                        sys_edit: FORM_OPTIONS.active_inactive,
                        announcements_page: FORM_OPTIONS.active_inactive,
                        info_board: FORM_OPTIONS.active_inactive,
                        lecturers_staff: FORM_OPTIONS.active_inactive,
                        fees_setup: FORM_OPTIONS.active_inactive,
                      };
                      return pageStatusMap[config.id] || getFieldOptions(colKey);
                    }
                    return getFieldOptions(colKey);
                  };

                  // Check if this field should use dropdown
                  const fieldOptions = getContextualOptions(col.key);
                  const useDropdown = shouldUseDropdown(col.key, col.label) || fieldOptions.length > 0;

                  // Special handling for course name - auto-fill from course code
                  if (col.key === 'course_name' && formData.course_code) {
                    const autoFilledName = FORM_OPTIONS.course_names[formData.course_code as keyof typeof FORM_OPTIONS.course_names];
                    if (autoFilledName && value !== autoFilledName) {
                      setFormData({ ...formData, course_name: autoFilledName });
                    }
                  }

                  if (useDropdown && fieldOptions.length > 0) {
                    // Use datalist (searchable autocomplete) for large option sets
                    if (fieldOptions.length > 20) {
                      return (
                        <div key={col.key} className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                          <input
                            list={`dl-${col.key}-${config.id}`}
                            value={value}
                            onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                            disabled={isReadOnly}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow disabled:bg-gray-50"
                            placeholder={`ابدأ الكتابة للبحث في ${col.label}...`}
                            required={modalType === 'add'}
                          />
                          <datalist id={`dl-${col.key}-${config.id}`}>
                            {fieldOptions.map((opt) => <option key={opt} value={opt} />)}
                          </datalist>
                        </div>
                      );
                    }

                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <select
                          value={value}
                          onChange={(e) => {
                            const newFormData = { ...formData, [col.key]: e.target.value };

                            // Auto-fill course name when course code is selected
                            if (col.key === 'course_code') {
                              const courseName = FORM_OPTIONS.course_names[e.target.value as keyof typeof FORM_OPTIONS.course_names];
                              if (courseName) {
                                newFormData.course_name = courseName;
                              }
                            }

                            setFormData(newFormData);
                          }}
                          disabled={isReadOnly}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow disabled:bg-gray-50 bg-white"
                          required={modalType === 'add'}
                        >
                          <option value="">اختر {col.label}...</option>
                          {fieldOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  // For course name, make it readonly if course code is selected
                  if (col.key === 'course_name' && formData.course_code) {
                    return (
                      <div key={col.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                        <input
                          type="text"
                          value={value}
                          readOnly
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="سيتم ملؤه تلقائياً..."
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={col.key} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">{col.label}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                        disabled={isReadOnly}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow disabled:bg-gray-50"
                        placeholder={`أدخل ${col.label}...`}
                        required={modalType === 'add'}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              {modalType !== 'view' && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary-800 text-white rounded-lg hover:bg-primary-900 font-medium flex items-center gap-2 shadow-lg shadow-primary-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {modalType === 'add' ? 'إضافة' : 'حفظ التعديلات'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {modalType === 'view' && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-primary-800 text-white rounded-lg hover:bg-primary-900 font-medium transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicPage;