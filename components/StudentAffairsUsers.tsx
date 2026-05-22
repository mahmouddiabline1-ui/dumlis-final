import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, KeyRound, Plus, Search, Shield, Trash2, UserCog } from 'lucide-react';

type StaffRole = 'Admin' | 'Staff' | 'Viewer';

interface StaffUser {
  id: string;
  name: string;
  username: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ActivityLogItem {
  id: string;
  at: string;
  actor: string;
  action: string;
}

function newId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const USERS_KEY = 'student_affairs_users';
const ACTIVITY_KEY = 'student_affairs_activity';

function loadJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const seedUsers: StaffUser[] = [
  {
    id: 'u_admin',
    name: 'مسؤول شؤون الطلاب',
    username: 'affairs',
    role: 'Admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

import { usersApi, activityLogsApi } from '../api';

const StudentAffairsUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [activity, setActivity] = useState<ActivityLogItem[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState<{ name: string; username: string; role: StaffRole }>({
    name: '',
    username: '',
    role: 'Staff',
  });

  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const dbUsers = await usersApi.list();
      setUsers(dbUsers.map(u => ({
        id: u.id,
        name: u.username, // DB User model currently doesn't have separately stored display name, using username
        username: u.username,
        role: (u.role === 'faculty_admin' ? 'Admin' : u.role === 'student_affairs' ? 'Staff' : 'Viewer') as StaffRole,
        isActive: u.is_active,
        createdAt: u.created_at || new Date().toISOString(),
        updatedAt: u.updated_at || new Date().toISOString()
      })));

      const dbLogs = await activityLogsApi.list({ limit: 50 });
      setActivity(dbLogs.map(l => ({
        id: String(l.id),
        at: l.performed_at,
        actor: l.user_id || 'نظام',
        action: l.action
      })));
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.username.toLowerCase().includes(term) || 
      u.role.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const pushActivity = async (action: string) => {
    try {
      await activityLogsApi.create({
        entity_type: 'staff_user',
        action: action,
        performed_at: new Date().toISOString()
      });
      // Refresh logs
      const dbLogs = await activityLogsApi.list({ limit: 50 });
      setActivity(dbLogs.map(l => ({
        id: String(l.id),
        at: l.performed_at,
        actor: l.user_id || 'نظام',
        action: l.action
      })));
    } catch (e) {
      console.error("Failed to log activity:", e);
    }
  };

  const add = async () => {
    const name = newUser.name.trim();
    const username = newUser.username.trim().toLowerCase();
    if (!name || !username) {
      alert('يرجى إدخال الاسم واسم المستخدم');
      return;
    }
    
    try {
      await usersApi.create({
        username: username,
        email: `${username}@dumlis.edu.eg`, // Generated email
        password: 'default_password_123', // Default for new staff
        role: newUser.role === 'Admin' ? 'faculty_admin' : 'student_affairs',
        is_active: true
      });
      
      await pushActivity(`إنشاء مستخدم: ${username} (${newUser.role})`);
      setShowAdd(false);
      setNewUser({ name: '', username: '', role: 'Staff' });
      fetchAll();
    } catch (err) {
      console.error("Failed to create user:", err);
      alert('فشل إنشاء المستخدم');
    }
  };

  const toggleActive = async (id: string) => {
    const u = users.find(x => x.id === id);
    if (!u) return;
    
    try {
      await usersApi.update(id, { is_active: !u.isActive });
      await pushActivity(`${!u.isActive ? 'تفعيل' : 'تعطيل'} مستخدم: ${u.username}`);
      fetchAll();
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
  };

  const changeRole = async (id: string, role: StaffRole) => {
    const u = users.find(x => x.id === id);
    if (!u) return;

    try {
      await usersApi.update(id, { 
        role: role === 'Admin' ? 'faculty_admin' : 'student_affairs' 
      });
      await pushActivity(`تغيير صلاحية: ${u.username} -> ${role}`);
      fetchAll();
    } catch (err) {
      console.error("Failed to change user role:", err);
    }
  };

  const resetPassword = (id: string) => {
    const u = users.find(x => x.id === id);
    pushActivity(`إعادة تعيين كلمة المرور: ${u?.username}`);
    alert('تم إرسال رابط إعادة تعيين كلمة المرور (تجريبي).');
  };

  const remove = async (id: string) => {
    const u = users.find(x => x.id === id);
    if (!confirm(`حذف المستخدم ${u?.username}؟`)) return;
    
    try {
      await usersApi.delete(id);
      await pushActivity(`حذف مستخدم: ${u?.username}`);
      fetchAll();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog className="w-6 h-6 text-primary-700" />
              إدارة المستخدمين
            </h2>
            <p className="text-gray-500 mt-1">إنشاء حساب موظف + صلاحيات + سجل نشاط (تجريبي).</p>
          </div>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="px-4 py-2.5 rounded-xl bg-primary-900 text-white hover:bg-primary-800 font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إنشاء مستخدم
          </button>
        </div>

        {showAdd && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={newUser.name}
                onChange={(e) => setNewUser(v => ({ ...v, name: e.target.value }))}
                placeholder="اسم الموظف"
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <input
                value={newUser.username}
                onChange={(e) => setNewUser(v => ({ ...v, username: e.target.value }))}
                placeholder="اسم المستخدم"
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser(v => ({ ...v, role: e.target.value as StaffRole }))}
                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={add} className="px-4 py-2 rounded-lg bg-primary-900 text-white hover:bg-primary-800 font-bold">
                حفظ
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between gap-3 flex-col md:flex-row">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث بالاسم/اليوزر/الدور..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">عدد المستخدمين: <span className="font-bold text-gray-700">{filtered.length}</span></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-3 text-xs font-bold text-gray-600">الاسم</th>
                <th className="p-3 text-xs font-bold text-gray-600">اسم المستخدم</th>
                <th className="p-3 text-xs font-bold text-gray-600">الصلاحية</th>
                <th className="p-3 text-xs font-bold text-gray-600">الحالة</th>
                <th className="p-3 text-xs font-bold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-sm font-bold text-gray-900">{u.name}</td>
                  <td className="p-3 text-sm font-mono text-gray-700">{u.username}</td>
                  <td className="p-3 text-sm">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as StaffRole)}
                      className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-sm"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="p-3 text-sm">
                    <button
                      onClick={() => toggleActive(u.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                        u.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {u.isActive ? 'نشط' : 'معطل'}
                    </button>
                  </td>
                  <td className="p-3 text-sm">
                    <div className="flex items-center gap-2 justify-start">
                      <button
                        onClick={() => resetPassword(u.id)}
                        className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-2"
                        title="إعادة تعيين كلمة المرور"
                      >
                        <KeyRound className="w-4 h-4" />
                        إعادة تعيين
                      </button>
                      <button
                        onClick={() => remove(u.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-700 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    لا توجد نتائج
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold-600" />
          <h3 className="font-bold text-gray-900">سجل النشاط</h3>
          <span className="text-xs text-gray-500">(آخر 200 عملية)</span>
        </div>
        <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
          {activity.length === 0 ? (
            <div className="p-8 text-center text-gray-500">لا يوجد نشاط بعد</div>
          ) : (
            activity.map(a => (
              <div key={a.id} className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900">{a.action}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(a.at).toLocaleString('ar-EG')}</div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-bold">{a.actor}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAffairsUsers;

