import React, { useState } from 'react';
import { PageConfig, Column } from '../types';
import { Plus, Edit2, Trash2, Printer, FileText, CheckCircle2, Download, Search, Filter, Save, XCircle, Clock, UploadCloud, Paperclip, Send, X } from 'lucide-react';

interface DynamicPageProps {
  config: PageConfig;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Filter data based on search
  const filteredData = (config.data || []).filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
        if (confirm('هل أنت متأكد من قبول هذا الطلب؟')) {
          showNotification('تم قبول الطلب بنجاح!', 'success');
          // In real app, update the data here
        }
        break;
      
      case 'reject':
        if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
          showNotification('تم رفض الطلب.', 'error');
          // In real app, update the data here
        }
        break;
      
      case 'view':
        setEditingRow(row);
        setFormData(row || {});
        setModalType('view');
        setShowModal(true);
        break;
      
      case 'upload':
        // Trigger file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.jpg,.jpeg,.png';
        fileInput.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            alert(`✅ تم رفع الملف: ${file.name}\nالحجم: ${(file.size / 1024).toFixed(2)} KB`);
          }
        };
        fileInput.click();
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate schedule_id for new schedules
    if (config.id === 'create_sched' && modalType === 'add' && !formData.schedule_id) {
      const semesterCode = formData.semester?.includes('خريف') ? 'FALL' : 
                          formData.semester?.includes('ربيع') ? 'SPRING' : 
                          formData.semester?.includes('صيف') ? 'SUMMER' : 'FALL';
      const year = new Date().getFullYear();
      const randomNum = String(Math.floor(Math.random() * 900) + 100);
      formData.schedule_id = `SCH-${year}-${semesterCode}-${randomNum}`;
    }
    
    // Auto-generate academic_year if not provided
    if (config.id === 'create_sched' && modalType === 'add' && !formData.academic_year) {
      const currentYear = new Date().getFullYear();
      formData.academic_year = `${currentYear}-${currentYear + 1}`;
    }
    
    // Auto-generate created_date if not provided
    if (config.id === 'create_sched' && modalType === 'add' && !formData.created_date) {
      formData.created_date = new Date().toISOString().split('T')[0];
    }
    
    if (modalType === 'add') {
      showNotification('تم إضافة السجل بنجاح!', 'success');
    } else if (modalType === 'edit') {
      showNotification('تم تحديث السجل بنجاح!', 'success');
    }
    setShowModal(false);
    setFormData({});
    setEditingRow(null);
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

    if (['نشط', 'حاضر', 'مقيد', 'نعم', 'منتهي', 'مقبول', 'ساري', 'تمت الطباعة', 'متوفر', 'منشور', 'مورد', 'مكتمل', 'مسدد', 'اجتاز', 'إضافة'].includes(status)) {
      colorClass = 'bg-green-50 text-green-700 border border-green-200';
      Icon = CheckCircle2;
    } else if (['غير نشط', 'غائب', 'موقوف', 'لا', 'مرفوض', 'منتهي', 'لم يطبع', 'غير متوفر', 'غير منشور', 'غير مسدد', 'حذف'].includes(status)) {
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
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
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
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
                                showNotification('تم حذف السجل بنجاح!', 'success');
                                // In real app, remove from data array here
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
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30 mt-auto">
              <p>عرض {filteredData.length} من {config.data?.length} سجل</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 text-xs">السابق</button>
                <div className="flex items-center gap-1">
                   <span className="w-6 h-6 flex items-center justify-center bg-primary-600 text-white rounded text-xs">1</span>
                   <span className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded text-xs cursor-pointer">2</span>
                </div>
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 text-xs">التالي</button>
              </div>
            </div>
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
                    className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-800 text-white rounded-lg hover:bg-primary-900 font-medium flex items-center gap-2 shadow-lg shadow-primary-900/10 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {modalType === 'add' ? 'إضافة' : 'حفظ التعديلات'}
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