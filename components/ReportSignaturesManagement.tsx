import React, { useState, useEffect } from 'react';
import { ReportSignature } from '../types';
import { reportSignaturesApi } from '../api';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, FileText, User, Award, ArrowUp, ArrowDown } from 'lucide-react';

const ReportSignaturesManagement: React.FC = () => {
    const [signatures, setSignatures] = useState<ReportSignature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSignature, setCurrentSignature] = useState<Partial<ReportSignature>>({});
    const [mode, setMode] = useState<'add' | 'edit'>('add');

    const fetchSignatures = async () => {
        try {
            setIsLoading(true);
            const data = await reportSignaturesApi.list();
            setSignatures(data);
        } catch (error) {
            console.error("Failed to fetch signatures:", error);
            alert("حدث خطأ أثناء تحميل التوقيعات");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSignatures();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التوقيع؟')) {
            try {
                await reportSignaturesApi.delete(id);
                setSignatures(prev => prev.filter(s => s.id !== id));
            } catch (error) {
                console.error("Failed to delete signature:", error);
                alert("حدث خطأ أثناء الحذف");
            }
        }
    };

    const handleEdit = (signature: ReportSignature) => {
        setCurrentSignature(signature);
        setMode('edit');
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentSignature({ is_active: true, order: signatures.length + 1 });
        setMode('add');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            if (mode === 'add') {
                const newSignature = {
                    id: `SIG_${Math.random().toString(36).substr(2, 9)}`,
                    report_name: currentSignature.report_name || '',
                    signatory_name: currentSignature.signatory_name || '',
                    title: currentSignature.title || '',
                    order: Number(currentSignature.order) || 1,
                    is_active: currentSignature.is_active !== undefined ? currentSignature.is_active : true
                };
                const created = await reportSignaturesApi.create(newSignature);
                setSignatures([...signatures, created]);
            } else {
                if (!currentSignature.id) return;
                const updated = await reportSignaturesApi.update(currentSignature.id, currentSignature);
                setSignatures(prev => prev.map(s => s.id === currentSignature.id ? updated : s));
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save signature:", error);
            alert("حدث خطأ أثناء الحفظ");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">توقيعات التقارير</h1>
                    <p className="text-gray-500">إدارة التوقيعات التي تظهر أسفل التقارير الرسمية</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>إضافة توقيع جديد</span>
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : signatures.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        لا توجد توقيعات مسجلة حتى الآن.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {signatures.map((sig) => (
                        <div key={sig.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow relative">
                            <div className="absolute top-4 left-4 flex gap-2">
                                <button onClick={() => handleEdit(sig)} className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(sig.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-start gap-3 mb-4">
                                <div className={`p-2 rounded-lg ${sig.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{sig.report_name}</h3>
                                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1 ${sig.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                                        }`}>
                                        {sig.is_active ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                        {sig.is_active ? 'نشط' : 'غير نشط'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <User size={16} className="text-gray-400 shrink-0" />
                                    <span className="font-semibold">{sig.signatory_name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Award size={16} className="text-gray-400 shrink-0" />
                                    <span>{sig.title}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="flex flex-col items-center justify-center w-4">
                                        <ArrowUp size={8} className="text-gray-300" />
                                        <span className="text-xs font-bold text-gray-500 leading-none">{sig.order}</span>
                                        <ArrowDown size={8} className="text-gray-300" />
                                    </div>
                                    <span className="text-gray-500">ترتيب الظهور</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {mode === 'add' ? 'إضافة توقيع جديد' : 'تعديل التوقيع'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نوع التقرير</label>
                                <select
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={currentSignature.report_name || ''}
                                    onChange={e => setCurrentSignature({ ...currentSignature, report_name: e.target.value })}
                                >
                                    <option value="">اختر التقرير...</option>
                                    <option value="كشوف درجات الطلاب">كشوف درجات الطلاب</option>
                                    <option value="إفادات القيد">إفادات القيد</option>
                                    <option value="شهادات التخرج">شهادات التخرج</option>
                                    <option value="البطاقات التعريفية">البطاقات التعريفية</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموقع</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: أ.د/ محمد عبد العظيم"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={currentSignature.signatory_name || ''}
                                    onChange={e => setCurrentSignature({ ...currentSignature, signatory_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اللقب الوظيفي</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: عميد الكلية"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={currentSignature.title || ''}
                                    onChange={e => setCurrentSignature({ ...currentSignature, title: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الترتيب</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={currentSignature.order || 1}
                                        onChange={e => setCurrentSignature({ ...currentSignature, order: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            checked={currentSignature.is_active ?? true}
                                            onChange={e => setCurrentSignature({ ...currentSignature, is_active: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-gray-700">توقيع نشط</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium shadow-sm disabled:opacity-50"
                                >
                                    {isSaving ? 'جارِ الحفظ...' : (mode === 'add' ? 'إضافة' : 'حفظ التغييرات')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportSignaturesManagement;
