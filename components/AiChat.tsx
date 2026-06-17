import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon, Loader2, Paperclip, Download } from 'lucide-react';
import { UserRole } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  userRole: UserRole | null;
  authToken: string | null;
}

const BASE_URL =
  typeof import.meta !== 'undefined'
    ? ((import.meta as any).env?.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8000')
    : 'http://localhost:8000';

const ROLE_LABELS: Record<string, string> = {
  super_admin:     'مساعد الإدارة العليا',
  faculty_admin:   'مساعد أدمن الكلية',
  student_affairs: 'مساعد شؤون الطلاب',
  student:         'مساعدك الجامعي',
};

const ROLE_HINTS: Record<string, string> = {
  super_admin:     'اسألني عن أي شيء في النظام...',
  faculty_admin:   'اسألني عن الطلاب، الرسوم، الطلبات...',
  student_affairs: 'اسألني عن الطلاب والوثائق...',
  student:         'اسألني عن درجاتك، حضورك، جدولك...',
};

// ── Parse assistant message for download links ────────────────────────────────
// Matches: [نص](URL) or [download:filename.xlsx](URL)
function MessageContent({ content, isAdmin }: { content: string; isAdmin: boolean }) {
  // Split on markdown links [text](url)
  const parts = content.split(/(\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g);
  if (parts.length === 1) return <span>{content}</span>;

  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    if (parts[i] && !parts[i].startsWith('[')) {
      elements.push(<span key={i}>{parts[i]}</span>);
      i++;
    } else if (parts[i]?.startsWith('[')) {
      const text = parts[i + 1] || 'تحميل';
      const url  = parts[i + 2] || '';
      const isDownload = text.includes('تحميل') || text.includes('Excel') || url.includes('export') || url.includes('template');
      elements.push(
        <a key={i} href={url} download className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium underline ${isAdmin ? 'text-indigo-600' : 'text-emerald-600'}`}>
          {isDownload && <Download size={11}/>} {text}
        </a>
      );
      i += 3;
    } else {
      i++;
    }
  }
  return <>{elements}</>;
}

export default function AiChat({ userRole, authToken }: Props) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  // pending file state — replaces window._pendingGradeFile
  const [pendingFile, setPendingFile]   = useState<File | null>(null);
  const [pendingCourse, setPendingCourse] = useState('');
  const [pendingSemester, setPendingSemester] = useState('2024-2025 خريف');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const isAdmin = userRole && userRole !== 'student';

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  if (!authToken || !userRole) return null;

  const authHdr = { Authorization: `Bearer ${authToken}` };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHdr },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error(`خطأ ${res.status}`);
      const data = await res.json();
      setMessages([...history, { role: 'assistant', content: data.response }]);
    } catch (e: any) {
      setMessages([...history, { role: 'assistant', content: `عذراً، حدث خطأ: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPendingCourse('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const cancelUpload = () => {
    setPendingFile(null);
    setPendingCourse('');
  };

  const doImport = async () => {
    if (!pendingFile || !pendingCourse.trim() || !pendingSemester.trim()) return;
    setUploading(true);
    const courseId = pendingCourse.trim();
    const semester = pendingSemester.trim();
    const userMsg: Message = { role: 'user', content: `📎 استيراد شيت درجات: ${pendingFile.name}\nالمادة: ${courseId} | الفصل: ${semester}` };
    const history = [...messages, userMsg];
    setMessages(history);
    setPendingFile(null);
    setPendingCourse('');
    try {
      const fd = new FormData();
      fd.append('file', pendingFile);
      const p = new URLSearchParams({ course_id: courseId, semester });
      const res = await fetch(`${BASE_URL}/grades/import-excel?${p}`, {
        method: 'POST', headers: authHdr, body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'فشل الاستيراد');
      const reply = `✅ تم استيراد الشيت بنجاح!\n• المادة: ${courseId} | الفصل: ${semester}\n• إضافة جديدة: ${data.created} طالب\n• تحديث: ${data.updated} طالب\n• تجاهل: ${data.skipped}${data.errors?.length ? '\n⚠️ أخطاء: ' + data.errors.slice(0, 3).join(' | ') : ''}`;
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch (ex: any) {
      setMessages([...history, { role: 'assistant', content: `❌ فشل الاستيراد: ${ex.message}` }]);
    } finally {
      setUploading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const label = ROLE_LABELS[userRole] ?? 'المساعد الذكي';
  const hint  = ROLE_HINTS[userRole]  ?? 'اسألني عن أي شيء...';

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
          isAdmin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
        } text-white`}
        title={label}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {messages.length > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 left-6 z-50 flex flex-col w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ height: '540px' }}
          dir="rtl"
        >
          {/* Header */}
          <div className={`flex items-center gap-3 px-4 py-3 ${isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'} text-white`}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight">{label}</p>
              <p className="text-xs text-white/70 truncate">مدعوم بـ Gemini / Groq AI</p>
            </div>
            <button onClick={() => setOpen(false)} className="mr-auto text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Pending file import form */}
          {pendingFile && (
            <div className="px-3 py-3 bg-blue-50 border-b border-blue-200 space-y-2" dir="rtl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                  📎 {pendingFile.name}
                </span>
                <button onClick={cancelUpload} className="text-gray-400 hover:text-red-500"><X size={13}/></button>
              </div>
              <input
                placeholder="كود المادة — مثال: CS101"
                value={pendingCourse}
                onChange={e => setPendingCourse(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                dir="ltr"
              />
              <input
                placeholder="الفصل الدراسي — مثال: 2024-2025 خريف"
                value={pendingSemester}
                onChange={e => setPendingSemester(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                dir="rtl"
              />
              <button
                onClick={doImport}
                disabled={uploading || !pendingCourse.trim() || !pendingSemester.trim()}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
              >
                {uploading ? <><Loader2 size={12} className="animate-spin"/> جاري الاستيراد...</> : '📥 استيراد الشيت'}
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
                <Bot size={40} className={isAdmin ? 'text-indigo-300' : 'text-emerald-300'} />
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-xs">{hint}</p>
                {isAdmin && (
                  <p className="text-xs text-gray-400 mt-1">📎 يمكنك رفع شيت Excel للدرجات</p>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs ${
                  msg.role === 'user' ? (isAdmin ? 'bg-indigo-500' : 'bg-emerald-500') : 'bg-gray-400'
                }`}>
                  {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? isAdmin ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-emerald-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                }`}>
                  <MessageContent content={msg.content} isAdmin={!!isAdmin} />
                </div>
              </div>
            ))}

            {(loading || uploading) && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">{uploading ? 'جاري استيراد الشيت...' : 'جاري التفكير...'}</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-end">
            {isAdmin && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  title="رفع شيت درجات Excel"
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-gray-200"
                >
                  <Paperclip size={16} />
                </button>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileUpload} />
              </>
            )}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={hint}
              rows={1}
              disabled={loading || uploading}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 max-h-24"
              style={{ direction: 'rtl' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading || uploading}
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-40 ${
                isAdmin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
