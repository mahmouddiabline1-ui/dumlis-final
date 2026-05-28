import React, { useState, useEffect, useRef } from 'react';
import { ADMIN_NAVIGATION, FACULTIES } from './constants';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import FacultyGrid from './components/FacultyGrid';
import FacultyAnalytics from './components/FacultyAnalytics';
import AcademicStructureManagement from './components/AcademicStructureManagement';
import LoginPage from './components/LoginPage';
import StudentAffairsAdmin from './components/StudentAffairsAdmin';
import DatabaseMigrator from './components/DatabaseMigrator';
import { Bell, Search, User as UserIcon, Menu, LogOut, ChevronDown, Building2 } from 'lucide-react';
import { UserRole, User } from './types';
import { authApi } from './api';
import { loadDynamicOptions } from './data/formOptions';
import { lookupApi } from './lookupApi';
import { FacultyContextProvider } from './contexts/FacultyContext';

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Navigation State — lazy initializers read from localStorage immediately to avoid race condition
  const [activeTabId, setActiveTabId] = useState<string>(
    () => localStorage.getItem('lastActiveTab') || ADMIN_NAVIGATION[0].id
  );
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(() => {
    const saved = localStorage.getItem('lastActiveSubItem');
    return saved && saved !== '' ? saved : null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFirstRender = useRef(true);

  // Super Admin Specific State — restore selected faculty from localStorage
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    () => localStorage.getItem('lastSelectedFacultyId') || null
  );
  const [showAcademicStructure, setShowAcademicStructure] = useState<boolean>(
    () => localStorage.getItem('lastShowAcademicStructure') === 'true'
  );

  // Faculty Switcher State (for multi-faculty data isolation)
  const [showFacultyMenu, setShowFacultyMenu] = useState(false);
  const facultySwitcherRef = useRef<HTMLDivElement>(null);

  // Global Search State
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [searchSource, setSearchSource] = useState<string>('all'); // 'all', 'students', 'courses', 'programs', 'decisions', 'departments'
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Flat list of all navigable pages for autocomplete
  const searchablePages = React.useMemo(() =>
    ADMIN_NAVIGATION.flatMap(tab =>
      tab.groups.flatMap(group =>
        group.items.map(item => ({
          id: item.id,
          label: item.label,
          tabId: tab.id,
          tabLabel: tab.label,
        }))
      )
    ), []);

  // Live suggestions filtered by what the user typed
  const liveSuggestions = React.useMemo(() => {
    if (!globalSearchTerm.trim() || globalSearchTerm.length < 1) return [];
    const term = globalSearchTerm.trim().toLowerCase();
    return searchablePages.filter(p =>
      p.label.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    ).slice(0, 8);
  }, [globalSearchTerm, searchablePages]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (facultySwitcherRef.current && !facultySwitcherRef.current.contains(event.target as Node)) {
        setShowFacultyMenu(false);
      }
    };

    if (showSearchDropdown || showFacultyMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchDropdown, showFacultyMenu]);

  // Determine active tab object
  const activeTab = ADMIN_NAVIGATION.find(tab => tab.id === activeTabId) || ADMIN_NAVIGATION[0];

  // Load dynamic form options only AFTER authentication is confirmed
  useEffect(() => {
    if (isAuthenticated) {
      loadDynamicOptions().then(() => {
        // After fetching faculties, validate the saved faculty ID
        const restoredFaculty = localStorage.getItem('lastSelectedFacultyId');
        if (restoredFaculty && currentUser?.role === 'super_admin') {
          // Fetch faculties to validate
          lookupApi.getFaculties().then(faculties => {
            const validFaculty = faculties.find(f => f.id === restoredFaculty);
            if (!validFaculty) {
              // Stale ID — clear it
              console.warn(`Stale faculty ID "${restoredFaculty}" in localStorage, clearing it`);
              localStorage.removeItem('lastSelectedFacultyId');
              lookupApi.setActiveFacultyId(null);
              setSelectedFacultyId(null);
            }
          }).catch(err => {
            console.warn('Failed to validate saved faculty ID', err);
          });
        }
      }).catch(err => {
        console.warn('Failed to load dynamic form options, using static fallbacks', err);
      });
    }
  }, [isAuthenticated, currentUser?.role]);

  // Persist current page — skip first render to avoid overwriting saved values before auth restores them
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('lastActiveTab', activeTabId);
    localStorage.setItem('lastActiveSubItem', activeSubItemId || '');
  }, [activeTabId, activeSubItemId]);

  // Persist selected faculty (for super_admin view)
  useEffect(() => {
    if (selectedFacultyId) {
      localStorage.setItem('lastSelectedFacultyId', selectedFacultyId);
    } else {
      localStorage.removeItem('lastSelectedFacultyId');
    }
  }, [selectedFacultyId]);

  // Persist academic structure view state
  useEffect(() => {
    localStorage.setItem('lastShowAcademicStructure', showAcademicStructure ? 'true' : 'false');
  }, [showAcademicStructure]);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authApi.me().then(res => {
         const dummyPayload = {
            role: res.role as UserRole,
            username: res.username,
            facultyId: res.faculty_id
         };
         handleLogin(dummyPayload);
      }).catch(err => {
         console.error('Session expired', err);
         handleLogout();
      });
    }
  }, []);

  const handleLogin = (payload: { role: UserRole; username?: string; facultyId?: string; studentId?: string; landing?: { tabId: string; subItemId?: string | null } }) => {
    const { role, username, facultyId, studentId, landing } = payload;
    let user: User = {
      id: studentId || username || '1',
      name: username || 'مستخدم',
      role: role,
      faculty: facultyId || undefined,
    };

    if (role === 'super_admin') {
      user.name = 'رئيس الجامعة';
      const savedFaculty = localStorage.getItem('lastSelectedFacultyId');
      const restoredFaculty = savedFaculty || null;
      setSelectedFacultyId(restoredFaculty);
      lookupApi.setActiveFacultyId(restoredFaculty);
    } else if (role === 'faculty_admin') {
      user.name = `مدير النظام`;
      setSelectedFacultyId(facultyId || 'FCAI');
      lookupApi.setActiveFacultyId(facultyId || 'FCAI');
    } else if (role === 'student_affairs') {
      user.name = 'موظف شؤون الطلاب';
      setSelectedFacultyId(facultyId || 'FCAI');
      lookupApi.setActiveFacultyId(facultyId || 'FCAI');
    } else {
      user.name = `طالب - ${username || 'عضو'}`;
      setSelectedFacultyId(facultyId || 'FCAI');
      lookupApi.setActiveFacultyId(facultyId || 'FCAI');
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // Trigger dynamic options load immediately after successful login
    loadDynamicOptions().catch(() => {});

    if (landing?.tabId) {
      setActiveTabId(landing.tabId);
      setActiveSubItemId(landing.subItemId ?? null);
    }
    // No else needed — lazy useState initializers already restored the page from localStorage
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedFacultyId(null);
    setShowAcademicStructure(false);
    setActiveSubItemId(null);
    setGlobalSearchTerm('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentStudentId');
    localStorage.removeItem('lastActiveTab');
    localStorage.removeItem('lastActiveSubItem');
    localStorage.removeItem('lastSelectedFacultyId');
    localStorage.removeItem('lastShowAcademicStructure');
  };

  // Handle faculty switching for super admin
  const handleFacultySwitcher = (newFacultyId: string | null) => {
    setSelectedFacultyId(newFacultyId);
    setShowFacultyMenu(false);
    lookupApi.setActiveFacultyId(newFacultyId);
  };

  // Global Search Handler
  const handleGlobalSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setShowSuggestions(false);
    setShowSearchDropdown(false);

    // If there's a matching page, navigate there directly
    const term = searchTerm.trim().toLowerCase();
    const match = searchablePages.find(p =>
      p.label.toLowerCase().includes(term) || p.id.toLowerCase() === term
    );
    if (match) {
      setActiveTabId(match.tabId);
      setActiveSubItemId(match.id);
      return;
    }

    // Fallback: navigate by source category
    switch (searchSource) {
      case 'students':
        setActiveTabId('students');
        setActiveSubItemId('advanced_student_search');
        break;
      case 'courses':
        setActiveTabId('programs');
        setActiveSubItemId('study_courses');
        break;
      case 'programs':
        setActiveTabId('programs');
        setActiveSubItemId('program_data');
        break;
      case 'departments':
        setActiveTabId('departments');
        setActiveSubItemId('view_departments');
        break;
      default:
        setActiveTabId('students');
        setActiveSubItemId('advanced_student_search');
    }
  };

  // Search sources configuration
  const searchSources = [
    { id: 'all', label: 'الكل', icon: '🔍' },
    { id: 'students', label: 'الطلاب', icon: '👥' },
    { id: 'courses', label: 'المقررات', icon: '📚' },
    { id: 'programs', label: 'البرامج', icon: '🎓' },
    { id: 'departments', label: 'التخصصات', icon: '🏢' },
    { id: 'decisions', label: 'القرارات', icon: '📋' }
  ];

  // Handle Enter key press in search
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGlobalSearch(globalSearchTerm);
    }
  };

  const handleTabChange = (id: string) => {
    // Only reset sub-item if changing to a different tab
    if (id !== activeTabId) {
      setActiveSubItemId(null);
    }
    setActiveTabId(id);
    setIsMobileMenuOpen(false);
  };

  // ----------------------------------------------------------------------
  // RENDER LOGIN PAGE IF NOT AUTHENTICATED
  // ----------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <FacultyContextProvider>
        <LoginPage onLogin={handleLogin} />
      </FacultyContextProvider>
    );
  }

  // ----------------------------------------------------------------------
  // STUDENT AFFAIRS VIEW: STANDALONE PAGE
  // ----------------------------------------------------------------------
  if (currentUser?.role === 'student_affairs') {
    return (
      <FacultyContextProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <DatabaseMigrator />
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
                <p className="text-[10px] text-gold-400 opacity-90">بوابة شؤون الطلاب</p>
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
        <main className="flex-1 p-6 md:p-8">
          <StudentAffairsAdmin facultyId={currentUser.faculty || null} />
        </main>
        </div>
      </FacultyContextProvider>
    );
  }

  // ----------------------------------------------------------------------
  // SUPER ADMIN VIEW: FACULTY SELECTION GRID OR ANALYTICS
  // ----------------------------------------------------------------------
  if (currentUser?.role === 'super_admin') {
    // Show Academic Structure Management if requested
    if (showAcademicStructure) {
      return (
        <FacultyContextProvider>
          <div className="min-h-screen bg-gray-50">
            <DatabaseMigrator />
            <AcademicStructureManagement
              onClose={() => setShowAcademicStructure(false)}
              facultyId={selectedFacultyId || undefined}
            />
          </div>
        </FacultyContextProvider>
      );
    }

    // Show Analytics if faculty is selected
    if (selectedFacultyId) {
      return (
        <FacultyContextProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
          <DatabaseMigrator />
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
                onManageAcademicStructure={() => setShowAcademicStructure(true)}
              />
            </main>
          </div>
        </FacultyContextProvider>
      );
    }

    // Show Grid if no faculty selected
    return (
      <FacultyContextProvider>
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
            <FacultyGrid
              onSelectFaculty={setSelectedFacultyId}
              onManageAcademicStructure={() => setShowAcademicStructure(true)}
            />
          </main>
        </div>
      </FacultyContextProvider>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN APP LAYOUT (Faculty Admin / Student / Super Admin inside Faculty)
  // ----------------------------------------------------------------------
  return (
    <FacultyContextProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <DatabaseMigrator />
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
                alt="University Logo"
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
                      {FACULTIES.find(f => f.id === selectedFacultyId)?.name || selectedFacultyId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Search (Hidden on mobile) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative group" ref={searchDropdownRef}>
                {/* Search Source Dropdown */}
                <button
                  onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                  className="absolute right-0 top-0 h-full px-3 flex items-center gap-1 text-primary-300 hover:text-gold-400 transition-colors z-10 border-r border-primary-700"
                  title="اختر مصدر البحث"
                >
                  <span className="text-xs">{searchSources.find(s => s.id === searchSource)?.icon}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showSearchDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showSearchDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                    {searchSources.map((source) => (
                      <button
                        key={source.id}
                        onClick={() => {
                          setSearchSource(source.id);
                          setShowSearchDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-right text-sm flex items-center justify-between gap-2 hover:bg-primary-50 transition-colors ${
                          searchSource === source.id ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span>{source.label}</span>
                        <span className="text-base">{source.icon}</span>
                      </button>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={globalSearchTerm}
                  onChange={(e) => {
                    setGlobalSearchTerm(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                    setShowSearchDropdown(false);
                  }}
                  onKeyDown={handleSearchKeyPress}
                  onFocus={() => {
                    setShowSearchDropdown(false);
                    if (globalSearchTerm.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="ابحث عن صفحة، طالب، مقرر..."
                  className="w-full bg-primary-800/50 border border-primary-700 text-primary-100 text-sm rounded-full pl-4 pr-24 py-2 focus:outline-none focus:bg-primary-800 focus:border-gold-500/50 transition-all placeholder:text-primary-400"
                />
                <button
                  onClick={() => handleGlobalSearch(globalSearchTerm)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 group-focus-within:text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Live Suggestions Dropdown */}
                {showSuggestions && liveSuggestions.length > 0 && (
                  <div className="absolute top-full mt-2 right-0 w-full bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    {liveSuggestions.map((page) => (
                      <button
                        key={`${page.tabId}-${page.id}`}
                        onMouseDown={() => {
                          setActiveTabId(page.tabId);
                          setActiveSubItemId(page.id);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-2.5 text-right flex items-center justify-between gap-3 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-gray-900">{page.label}</span>
                          <span className="text-[10px] text-gray-400">{page.tabLabel}</span>
                        </div>
                        <Search className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Left: User Actions */}
            <div className="flex items-center gap-3">
              {/* Faculty Switcher (Super Admin Only) */}
              {currentUser?.role === 'super_admin' && (
                <div className="relative" ref={facultySwitcherRef}>
                  <button
                    onClick={() => setShowFacultyMenu(!showFacultyMenu)}
                    className="flex items-center gap-2 bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg text-white text-sm transition-colors"
                    title="تبديل الكلية"
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="hidden md:inline">
                      {selectedFacultyId
                        ? FACULTIES.find(f => f.id === selectedFacultyId)?.name || 'الكل'
                        : 'جميع الكليات'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFacultyMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Faculty Menu */}
                  {showFacultyMenu && (
                    <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-xl z-50 w-56 text-right">
                      {/* All Faculties Option */}
                      <button
                        onClick={() => handleFacultySwitcher(null)}
                        className={`w-full text-right px-4 py-3 text-sm hover:bg-gray-100 transition-colors border-b ${
                          selectedFacultyId === null ? 'bg-blue-50 text-primary-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        📊 جميع الكليات
                      </button>

                      {/* Individual Faculties */}
                      {FACULTIES.map(faculty => (
                        <button
                          key={faculty.id}
                          onClick={() => handleFacultySwitcher(faculty.id)}
                          className={`w-full text-right px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${
                            selectedFacultyId === faculty.id ? 'bg-blue-50 text-primary-700 font-medium border-r-4 border-primary-700' : 'text-gray-700'
                          }`}
                        >
                          🏫 {faculty.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                      currentUser?.role === 'faculty_admin' ? (FACULTIES.find(f => f.id === selectedFacultyId)?.name || 'مدير النظام') : 
                      currentUser?.role === 'student_affairs' ? 'موظف شؤون الطلاب' : 'طالب مقيد'}
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
      <div className="flex flex-1 w-full px-2 md:px-4 py-4 gap-4 relative">
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
            globalSearchTerm={globalSearchTerm}
          />
        </main>
      </div>
    </div>
    </FacultyContextProvider>
  );
}

export default App;