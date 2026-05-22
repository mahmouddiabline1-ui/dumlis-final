import React from 'react';
import { Edit2, Plus, Trash2, Save, Clock, User, Calendar } from 'lucide-react';

interface ActivityItem {
  id: string;
  timestamp: string;
  user: string;
  action: 'edit' | 'add' | 'delete' | 'update';
  entity: string;
  details: string;
  faculty?: string;
  category?: string;
}

interface ActivityLogProps {
  facultyId: string;
  activities: ActivityItem[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ facultyId, activities }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'edit':
        return <Edit2 className="w-4 h-4" />;
      case 'add':
        return <Plus className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'update':
        return <Save className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'edit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'add':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'delete':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'update':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'edit':
        return 'تعديل';
      case 'add':
        return 'إضافة';
      case 'delete':
        return 'حذف';
      case 'update':
        return 'تحديث';
      default:
        return 'إجراء';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          سجل التغييرات والنشاطات
        </h3>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {activities.length} نشاط
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>لا توجد تغييرات مسجلة</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${getActionColor(activity.action)}`}>
                {getActionIcon(activity.action)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-bold">{activity.user}</span>
                      {' '}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getActionColor(activity.action)}`}>
                        {getActionLabel(activity.action)}
                      </span>
                      {' '}
                      <span className="text-gray-600">{activity.entity}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
export type { ActivityItem };

