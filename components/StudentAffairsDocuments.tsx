import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StudentProfile } from '../types';
import { Download, FileText, Search, Trash2, UploadCloud } from 'lucide-react';
import { studentsApi, studentDocumentsApi } from '../api';

type DocType =
  | 'birth_certificate'
  | 'national_id'
  | 'high_school_certificate'
  | 'student_pdf';

interface StudentDocument {
  id: string;
  type: DocType;
  title: string;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  uploadedAt: string;
}

const DOC_TYPES: Array<{ type: DocType; title: string }> = [
  { type: 'birth_certificate', title: 'شهادة الميلاد' },
  { type: 'national_id', title: 'صورة البطاقة' },
  { type: 'high_school_certificate', title: 'شهادة الثانوية' },
  { type: 'student_pdf', title: 'ملفات الطالب PDF' },
];

function newId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function storageKey(studentId: string) {
  return `student_affairs_documents:${studentId}`;
}

function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface StudentAffairsDocumentsProps {
  facultyId?: string | null;
}

const StudentAffairsDocuments: React.FC<StudentAffairsDocumentsProps> = ({ facultyId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await studentsApi.list({ faculty_id: facultyId || undefined } as any);
        setDbStudents(data);
      } catch (err) {
        console.error("Failed to fetch students from DB:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [facultyId]);

  // Map DB students to the structure expected by the UI
  const allStudents: StudentProfile[] = useMemo(() => {
    return dbStudents.map(s => ({
      id: s.student_id,
      personal: {
        name: s.name,
        nameEn: s.name,
        nationalId: s.national_id || '',
        birthDate: '',
        birthPlace: s.city || '',
        nationality: 'مصري',
        religion: 'مسلم',
        gender: 'ذكر',
        image: ''
      },
      academic: {
        studentCode: s.student_id,
        faculty: s.faculty_id,
        department: s.department_id || 'عام',
        program: s.department_id || 'عام',
        level: s.level || 1,
        gpa: s.gpa || 0,
        status: s.status === 'مقيد' ? 'active' : 'inactive',
        regulationType: s.regulation === 'لائحة جديدة' ? 'new' : 'old',
        enrollmentYear: s.student_id.substring(0, 4)
      }
    }));
  }, [dbStudents]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  useEffect(() => {
    if (allStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(allStudents[0].id);
    }
  }, [allStudents, selectedStudentId]);

  const selectedStudent = useMemo(
    () => allStudents.find(s => s.id === selectedStudentId) || null,
    [selectedStudentId, allStudents]
  );

  const [docs, setDocs] = useState<StudentDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingType, setPendingType] = useState<DocType>('student_pdf');

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allStudents;
    return allStudents.filter((s: StudentProfile) => {
      return (
        (s.personal.name || '').toLowerCase().includes(term) ||
        (s.academic.studentCode || '').toLowerCase().includes(term) ||
        (s.personal.nationalId || '').includes(term)
      );
    });
  }, [searchTerm, allStudents]);

  useEffect(() => {
    if (!selectedStudent) return;
    
    const fetchDocs = async () => {
      try {
        const data = await studentDocumentsApi.list(selectedStudent.id);
        setDocs(data.map(d => ({
          id: String(d.id),
          type: d.type as DocType,
          title: d.title,
          filename: d.filename || '',
          mimeType: d.mime_type || '',
          size: d.size || 0,
          dataUrl: d.data_url,
          uploadedAt: d.uploaded_at
        })));
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };
    
    fetchDocs();
  }, [selectedStudent?.id]);

  const save = (next: StudentDocument[]) => {
    if (!selectedStudent) return;
    setDocs(next);
    localStorage.setItem(storageKey(selectedStudent.id), JSON.stringify(next));
  };

  const onPickFile = (type: DocType) => {
    setPendingType(type);
    fileInputRef.current?.click();
  };

  const onFileSelected = async (file: File | null) => {
    if (!file || !selectedStudent) return;
    // Guard: localStorage is small; keep demo files small
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxBytes) {
      alert('الملف كبير جداً للعرض التجريبي. الحد الأقصى 2MB.');
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('read_failed'));
      reader.readAsDataURL(file);
    });

    const typeTitle = DOC_TYPES.find(d => d.type === pendingType)?.title || 'مستند';

    try {
      const newItem = await studentDocumentsApi.create({
        student_id: selectedStudent.id,
        type: pendingType,
        title: typeTitle,
        filename: file.name,
        mime_type: file.type || 'application/octet-stream',
        size: file.size,
        data_url: dataUrl,
      });

      setDocs(prev => [{
        id: String(newItem.id),
        type: newItem.type as DocType,
        title: newItem.title,
        filename: newItem.filename || '',
        mimeType: newItem.mime_type || '',
        size: newItem.size || 0,
        dataUrl: newItem.data_url,
        uploadedAt: newItem.uploaded_at
      }, ...prev]);
    } catch (err) {
      console.error("Failed to upload document:", err);
      alert('فشل رفع الملف');
    }
  };

  const removeDoc = async (id: string) => {
    try {
      await studentDocumentsApi.delete(Number(id));
      setDocs(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert('فشل حذف الملف');
    }
  };

  return (
    <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] h-[calc(100vh-180px)] w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => onFileSelected(e.target.files?.[0] || null)}
      />

      {/* Students List */}
      <div className="w-72 border-l border-gray-200 bg-gray-50/30 flex flex-col shrink-0 no-print">
        <div className="p-4 border-b border-gray-200 bg-white space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث بالاسم أو الكود..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={`w-full text-right p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 flex items-center justify-between group ${
                selectedStudentId === student.id ? 'bg-primary-50 border-r-4 border-r-primary-600' : 'border-r-4 border-r-transparent'
              }`}
            >
              <div>
                <p className={`font-bold text-sm mb-1 ${selectedStudentId === student.id ? 'text-primary-900' : 'text-gray-900'}`}>
                  {student.personal.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{student.academic.studentCode}</span>
                  <span>•</span>
                  <span>{student.academic.program}</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                اختيار
              </span>
            </button>
          ))}

          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              لا توجد نتائج مطابقة
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {!selectedStudent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FileText size={64} className="mb-4 opacity-50" />
            <p className="text-lg">اختر طالباً من القائمة لعرض المستندات</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">مستندات الطالب</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{selectedStudent.personal.name}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedStudent.academic.studentCode}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {DOC_TYPES.map(t => (
                    <button
                      key={t.type}
                      onClick={() => onPickFile(t.type)}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-2"
                      title={`رفع: ${t.title}`}
                    >
                      <UploadCloud className="w-4 h-4" />
                      رفع {t.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">الملفات</h3>
                  <span className="text-sm text-gray-500">{docs.length} ملف</span>
                </div>

                {docs.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    لا توجد ملفات مرفوعة بعد. استخدم أزرار الرفع بالأعلى.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {docs.map(doc => (
                      <div key={doc.id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900">{doc.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                              {Math.ceil(doc.size / 1024)} KB
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1 break-words">{doc.filename}</div>
                          <div className="text-[11px] text-gray-400 mt-2">
                            تاريخ الرفع: {new Date(doc.uploadedAt).toLocaleString('ar-EG')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => downloadDataUrl(doc.filename, doc.dataUrl)}
                            className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-2"
                            title="تحميل"
                          >
                            <Download className="w-4 h-4" />
                            تحميل
                          </button>
                          <button
                            onClick={() => removeDoc(doc.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-700 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 text-xs text-gray-500">
                ملاحظة: يتم تخزين المستندات بأمان في قاعدة البيانات المركزية.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAffairsDocuments;

