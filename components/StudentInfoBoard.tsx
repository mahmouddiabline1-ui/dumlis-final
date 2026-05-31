import React, { useEffect, useState } from 'react';
import { Bell, Clock, Info } from 'lucide-react';
import { announcementsApi } from '../api';

const StudentInfoBoard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const facultyId = localStorage.getItem('userFacultyId') || undefined;
    announcementsApi.list({ faculty_id: facultyId })
      .then((data) => setAnnouncements(data || []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  const priorityColor = (p: string) => {
    if (p === 'عاجل') return 'border-red-400 bg-red-50';
    if (p === 'مهم') return 'border-yellow-400 bg-yellow-50';
    return 'border-blue-200 bg-blue-50';
  };

  const priorityBadge = (p: string) => {
    if (p === 'عاجل') return 'bg-red-100 text-red-700';
    if (p === 'مهم') return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary-50 rounded-xl">
          <Bell className="w-6 h-6 text-primary-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة الإعلانات</h1>
          <p className="text-gray-500 text-sm">الإعلانات والأخبار الموجهة للطلاب</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">جاري التحميل...</div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Info className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">لا توجد إعلانات حالياً</p>
          <p className="text-gray-400 text-sm mt-1">تابع هذه الصفحة للاطلاع على آخر الأخبار</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className={`rounded-xl border-r-4 p-5 ${priorityColor(a.priority || 'عادي')}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-base">{a.title}</h3>
                    {a.priority && a.priority !== 'عادي' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge(a.priority)}`}>
                        {a.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{a.body}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{a.created_at ? new Date(a.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInfoBoard;
