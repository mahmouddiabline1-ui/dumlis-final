import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
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

export default function AiChat({ userRole, authToken }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isAdmin = userRole && userRole !== 'student';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!authToken || !userRole) return null;

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error(`خطأ ${res.status}`);
      const data = await res.json();
      setMessages([...history, { role: 'assistant', content: data.response }]);
    } catch (e: any) {
      setMessages([
        ...history,
        { role: 'assistant', content: `عذراً، حدث خطأ: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
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
          isAdmin
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-emerald-600 hover:bg-emerald-700'
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
          style={{ height: '520px' }}
          dir="rtl"
        >
          {/* Header */}
          <div
            className={`flex items-center gap-3 px-4 py-3 ${
              isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
            } text-white`}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight">{label}</p>
              <p className="text-xs text-white/70 truncate">مدعوم بـ Groq AI</p>
            </div>
            <button onClick={() => setOpen(false)} className="mr-auto text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
                <Bot size={40} className={isAdmin ? 'text-indigo-300' : 'text-emerald-300'} />
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-xs">{hint}</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs ${
                    msg.role === 'user'
                      ? isAdmin ? 'bg-indigo-500' : 'bg-emerald-500'
                      : 'bg-gray-400'
                  }`}
                >
                  {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? isAdmin
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-emerald-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">جاري التفكير...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={hint}
              rows={1}
              disabled={loading}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 max-h-24"
              style={{ direction: 'rtl' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
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
