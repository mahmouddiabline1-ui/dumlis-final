import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, User } from 'lucide-react';
import { studentsApi } from '../api';

interface Student {
  student_id: string;
  name: string;
  level?: number;
  department_id?: string;
}

interface Props {
  fieldKey: string;
  value: string;
  onSelect: (student: Student) => void;
  facultyId?: string | null;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
}

const StudentAutocomplete: React.FC<Props> = ({
  fieldKey,
  value,
  onSelect,
  facultyId,
  placeholder,
  required,
  readOnly,
}) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g. when companion field fills this one)
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = useCallback(
    async (q: string) => {
      if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
      setLoading(true);
      try {
        const params: Record<string, any> = { search: q, limit: 12 };
        if (facultyId) params.faculty_id = facultyId;
        const results = await studentsApi.list(params) as any[];
        setSuggestions(
          results.map((s: any) => ({
            student_id: s.student_id,
            name: s.name,
            level: s.level,
            department_id: s.department_id,
          }))
        );
        setOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [facultyId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    setSelected(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(v), 300);
  };

  const handleSelect = (student: Student) => {
    setQuery(fieldKey === 'student_id' ? student.student_id : student.name);
    setSelected(true);
    setOpen(false);
    setSuggestions([]);
    onSelect(student);
  };

  const levels = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'];

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (suggestions.length > 0 && !selected) setOpen(true); }}
          placeholder={placeholder || `ابحث بـ ${fieldKey === 'student_id' ? 'الرقم' : 'الاسم'}...`}
          required={required}
          readOnly={readOnly}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow pr-10 ${
            selected
              ? 'border-green-400 bg-green-50'
              : 'border-gray-200 bg-white'
          } ${readOnly ? 'bg-gray-50 cursor-default' : ''}`}
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {loading && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.student_id}
              onMouseDown={() => handleSelect(s)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                <p className="text-xs text-gray-500">{s.student_id}{s.level ? ` · المستوى ${levels[s.level] || s.level}` : ''}{s.department_id ? ` · ${s.department_id}` : ''}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 2 && !loading && suggestions.length === 0 && open === false && !selected && (
        <p className="text-xs text-red-500 mt-1">لا يوجد طالب بهذا {fieldKey === 'student_id' ? 'الرقم' : 'الاسم'}</p>
      )}
    </div>
  );
};

export default StudentAutocomplete;
