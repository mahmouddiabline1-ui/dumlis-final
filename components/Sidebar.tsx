import React from 'react';
import { MainTab } from '../types';
import { ChevronLeft } from 'lucide-react';

interface SidebarProps {
  activeTab: MainTab;
  activeSubItem: string | null;
  onSelectSubItem: (id: string) => void;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, activeSubItem, onSelectSubItem, userRole }) => {
  return (
    <aside className="w-64 bg-white border border-gray-100 rounded-2xl hidden md:flex flex-col h-[calc(100vh-8rem)] sticky top-24 overflow-y-auto shadow-sm ml-4 custom-scrollbar">
      <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20 -mx-0 rounded-t-2xl">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-primary-50 rounded-lg text-primary-700 shadow-sm">
             <activeTab.icon className="w-6 h-6" />
           </div>
           <h2 className="text-lg font-bold text-gray-900 leading-tight">
             {activeTab.label}
           </h2>
        </div>
        <p className="text-xs text-gray-500 pr-12 font-medium">قائمة العمليات المتاحة</p>
      </div>

      <div className="p-4 space-y-6">
        {activeTab.groups.map((group) => (
          <div key={group.id} className="animate-fade-in-up">
            <h3 className="text-[11px] font-bold text-gold-600 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-sm shadow-gold-500/50"></span>
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.filter(item => !item.superAdminOnly || userRole === 'super_admin').map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectSubItem(item.id)}
                  className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                    ${activeSubItem === item.id 
                      ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-800'
                    }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {activeSubItem === item.id ? (
                    <ChevronLeft className="w-4 h-4 text-gold-400 relative z-10" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  )}
                  
                  {/* Subtle active indicator background effect */}
                  {activeSubItem === item.id && (
                     <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900 z-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
