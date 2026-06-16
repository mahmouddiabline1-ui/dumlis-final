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
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);

  const isAdmin = userRole && userRole !== 'student';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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

  // ── File upload (grades import via chat) ──────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Ask AI what course/semester to use via a prompt
    const promptMsg: Message = {
      role: 'user',
      content: `تم رفع شيت درجات: "${file.name}"\nلاستيراده يجب تحديد:\n- كود المادة (course_id)\n- الفصل الدراسي (semester)\nمثال: CS101 | 2024-2025 خريف`,
    };
    setMessages(prev => [...prev, promptMsg]);

    // Store file for later use after user provides course/semester
    // Simpler approach: show upload UI inline in chat
    setUploadMsg({ text: `📎 ملف جاهز: ${file.name} — أرسل: "كود المادة | الفصل" لاستيراده`, ok: true });
    // Keep file in ref for next send
    (window as any)._pendingGradeFile = file;

    if (fileRef.current) fileRef.current.value = '';
  };

  // Override send to handle pending file upload
  const sendWithFileCheck = async () => {
    const pendingFile: File | undefined = (window as any)._pendingGradeFile;
    if (pendingFile && input.includes('|')) {
      const parts = input.split('|').map(s => s.trim());
      const courseId = parts[0];
      const semester = parts[1];

      if (courseId && semester) {
        setUploading(true);
        setUploadMsg(null);
        const userMsg: Message = { role: 'user', content: `استيراد الشيت: مادة ${courseId} | فصل ${semester}` };
        const history = [...messages, userMsg];
        setMessages(history);
        setInput('');

        try {
          const fd = new FormData();
          fd.append('file', pendingFile);
          const p = new URLSearchParams({ course_id: courseId, semester });
          const res = await fetch(`${BASE_URL}/grades/import-excel?${p}`, {
            method: 'POST', headers: authHdr, body: fd,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.detail || 'فشل الاستيراد');
          const reply = `✅ تم استيراد شيت الدرجات بنجاح!\n• المادة: ${courseId} | الفصل: ${semester}\n• إضافة جديدة: ${data.created} طالب\n• تحديث: ${data.updated} طالب\n• تجاهل: ${data.skipped}${data.errors?.length ? '\n⚠️ أخطاء: ' + data.errors.slice(0,3).join(' | ') : ''}`;
          setMessages([...history, { role: 'assistant', content: reply }]);
          (window as any)._pendingGradeFile = undefined;
        } catch (ex: any) {
          setMessages([...messages, { role: 'assistant', content: `❌ فشل الاستيراد: ${ex.message}` }]);
        } finally {
          setUploading(false);
        }
        return;
      }
    }
    await send();
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendWithFileCheck();
    }
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

          {/* Upload notification */}
          {uploadMsg && (
            <div className={`px-3 py-2 text-xs font-medium flex items-center justify-between ${uploadMsg.ok ? 'bg-blue-50 text-blue-700 border-b border-blue-200' : 'bg-red-50 text-red-600 border-b border-red-200'}`}>
              <span>{uploadMsg.text}</span>
              <button onClick={() => { setUploadMsg(null); (window as any)._pendingGradeFile = undefined; }}><X size={12}/></button>
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
              placeholder={uploadMsg ? 'اكتب: كود المادة | الفصل الدراسي' : hint}
              rows={1}
              disabled={loading || uploading}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 max-h-24"
              style={{ direction: 'rtl' }}
            />
            <button
              onClick={sendWithFileCheck}
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
