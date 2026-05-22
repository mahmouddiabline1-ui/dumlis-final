import React, { useState } from 'react';
import { ADMIN_NAVIGATION } from './constants';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import FacultyGrid from './components/FacultyGrid';
import FacultyAnalytics from './components/FacultyAnalytics';
import LoginPage from './components/LoginPage';
import { Bell, Search, User as UserIcon, Menu, LogOut, ChevronDown } from 'lucide-react';
import { UserRole, User } from './types';

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Navigation State
  const [activeTabId, setActiveTabId] = useState<string>(ADMIN_NAVIGATION[0].id);
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Super Admin Specific State
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);

  // Determine active tab object
  const activeTab = ADMIN_NAVIGATION.find(tab => tab.id === activeTabId) || ADMIN_NAVIGATION[0];

  const handleLogin = (role: UserRole) => {
    // Mock User Data based on role
    let user: User;
    if (role === 'super_admin') {
      user = { id: '1', name: 'أ.د. رئيس الجامعة', role: 'super_admin' };
    } else if (role === 'faculty_admin') {
      user = { id: '2', name: 'أ.د. عميد الكلية', role: 'faculty_admin', faculty: 'FCAI' };
      setSelectedFacultyId('FCAI'); // Auto-select for Faculty Admin
    } else {
      user = { id: '3', name: 'الطالب أحمد محمد', role: 'student', faculty: 'FCAI' };
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveSubItemId(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedFacultyId(null);
    setActiveSubItemId(null);
  };

  const handleTabChange = (id: string) => {
    setActiveTabId(id);
    setActiveSubItemId(null);
    setIsMobileMenuOpen(false);
  };

  // ----------------------------------------------------------------------
  // RENDER LOGIN PAGE IF NOT AUTHENTICATED
  // ----------------------------------------------------------------------
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ----------------------------------------------------------------------
  // SUPER ADMIN VIEW: FACULTY SELECTION GRID OR ANALYTICS
  // ----------------------------------------------------------------------
  if (currentUser?.role === 'super_admin') {
    // Show Analytics if faculty is selected
    if (selectedFacultyId) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-primary-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/logo.PNG" 
                  alt="Logo" 
                  className="w-12 h-12 bg-white rounded-full p-1 shadow-md border-2 border-gold-500 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold tracking-wider text-white uppercase font-sans">DUMLIS</h1>
                  <p className="text-[10px] text-gold-400 opacity-90">Damietta University</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-primary-800 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                تسجيل خروج
              </button>
            </div>
          </header>
          <main className="flex-1 p-8">
            <FacultyAnalytics 
              facultyId={selectedFacultyId} 
              onBack={() => setSelectedFacultyId(null)} 
            />
          </main>
        </div>
      );
    }
    
    // Show Grid if no faculty selected
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-primary-900 text-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.PNG" 
                alt="Logo" 
                className="w-12 h-12 bg-white rounded-full p-1 shadow-md border-2 border-gold-500 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold tracking-wider text-white uppercase font-sans">DUMLIS</h1>
                <p className="text-[10px] text-gold-400 opacity-90">Damietta University</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-primary-800 rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </button>
          </div>
        </header>
        <main className="flex-1 p-8">
          <FacultyGrid onSelectFaculty={setSelectedFacultyId} />
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN APP LAYOUT (Faculty Admin / Student / Super Admin inside Faculty)
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header & Navigation */}
      <header className="bg-primary-900 text-white shadow-lg sticky top-0 z-50">
        {/* Top Bar: Logo and User Profile */}
        <div className="border-b border-primary-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Right: Logo */}
            <div className="flex items-center gap-4">
               {/* Back button for Super Admin to go back to grid */}
               {currentUser?.role === 'super_admin' && selectedFacultyId && (
                   <button 
                    onClick={() => setSelectedFacultyId(null)}
                    className="p-2 bg-primary-800 rounded-full hover:bg-gold-500 hover:text-primary-900 transition-colors mr-2"
                    title="العودة للكليات"
                   >
                       <ChevronDown className="w-4 h-4 rotate-90" />
                   </button>
               )}

              <img 
                src="/logo.PNG" 
                alt="FCAI Logo" 
                className="w-12 h-12 bg-white rounded-full p-1 shadow-md border-2 border-gold-500 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold tracking-wider text-white uppercase font-sans">DUMLIS</h1>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] text-primary-200 opacity-90">
                        {currentUser?.role === 'student' ? 'بوابة الطالب' : 'نظام إدارة شؤون طلاب جامعة دمياط'}
                    </p>
                    {selectedFacultyId && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gold-500 text-primary-900 rounded-sm font-bold">
                            {selectedFacultyId === 'FCAI' ? 'كلية الحاسبات' : selectedFacultyId}
                        </span>
                    )}
                </div>
              </div>
            </div>

            {/* Center: Search (Hidden on mobile) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder={currentUser?.role === 'student' ? "بحث في الخدمات..." : "بحث سريع (طالب، مقرر، قرار)..."}
                  className="w-full bg-primary-800/50 border border-primary-700 text-primary-100 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:bg-primary-800 focus:border-gold-500/50 transition-all placeholder:text-primary-400"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 group-focus-within:text-gold-400 transition-colors" />
              </div>
            </div>

            {/* Left: User Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLogout}
                className="p-2 text-primary-200 hover:text-red-400 hover:bg-primary-800 rounded-full transition-colors"
                title="تسجيل خروج"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button className="p-2 text-primary-200 hover:text-white hover:bg-primary-800 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-primary-900"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-2 border-l border-primary-700 ml-2">
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                  <p className="text-xs text-primary-300">
                      {currentUser?.role === 'super_admin' ? 'رئيس الجامعة' : 
                       currentUser?.role === 'faculty_admin' ? 'مدير النظام' : 'طالب مقيد'}
                  </p>
                </div>
                
                <div className="relative group">
                    <button className="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center text-primary-200 hover:bg-gold-500 hover:text-primary-900 transition-all shadow-inner border border-primary-600">
                    <UserIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Main Navigation Tabs (Admins Only) */}
        {currentUser?.role !== 'student' && (
            <div className="container mx-auto px-4">
            <div className="flex items-center justify-between md:justify-start overflow-x-auto no-scrollbar gap-1">
                
                {/* Mobile Hamburger */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-3 text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {ADMIN_NAVIGATION.map((tab) => {
                const isActive = activeTabId === tab.id;
                return (
                    <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                        relative px-4 py-4 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap
                        ${isActive ? 'text-white' : 'text-primary-300 hover:text-white'}
                    `}
                    >
                    <tab.icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'opacity-70'}`} />
                    {tab.label}
                    {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500 rounded-t-full shadow-[0_-2px_6px_rgba(255,215,0,0.4)]"></span>
                    )}
                    </button>
                );
                })}
            </div>
            </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 container mx-auto max-w-7xl px-0 md:px-4 py-6 gap-6 relative">
        {/* Sidebar Navigation (Admin Only) */}
        {currentUser?.role !== 'student' && (
            <Sidebar 
            activeTab={activeTab} 
            activeSubItem={activeSubItemId} 
            onSelectSubItem={setActiveSubItemId}
            />
        )}

        {/* Content Area */}
        <main className="flex-1 bg-transparent min-w-0">
          <ContentArea 
            activeSubItemId={activeSubItemId}
            activeTabLabel={currentUser?.role !== 'student' ? activeTab.label : ''}
            role={currentUser?.role || 'student'}
            onNavigate={(id) => setActiveSubItemId(id || null)}
            selectedFacultyId={selectedFacultyId}
          />
        </main>
      </div>
    </div>
  );
}

export default App;