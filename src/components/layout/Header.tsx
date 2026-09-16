import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Building2, 
  User, 
  Settings, 
  LogOut, 
  Inbox, 
  DollarSign, 
  BarChart3, 
  Users, 
  Flame, 
  Target, 
  FileText,
  FileSpreadsheet,
  Coins,
  CreditCard,
  History,
  PlusCircle,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
  BookOpen,
  Phone,
  Sparkles,
  Lock
} from 'lucide-react';
import { 
  UserProfile, 
  CurrentView, 
  PublicNavTab, 
  CompanyType, 
  NotificationItem,
  WorkspaceView
} from '../../types';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  currentUser: UserProfile;
  currentView: CurrentView;
  isLoggedIn?: boolean;
  notifications?: NotificationItem[];
  onNavigate: (view: CurrentView) => void;
  onLogout?: () => void;
  onSwitchCompanyType?: (type: CompanyType) => void;
  onOpenSearch?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenCreateInquiry?: () => void;
  onMarkAllAsRead?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentView,
  isLoggedIn = true,
  notifications = [],
  onNavigate,
  onLogout,
  onSwitchCompanyType,
  onOpenSearch,
  onOpenCommandPalette,
  onOpenCreateInquiry,
  onMarkAllAsRead = () => {},
  onOpenAuthModal,
}) => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrolledPastTop, setIsScrolledPastTop] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setIsAvatarOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setIsCompanyMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smart Headroom Navbar on Landing Page (Flexport style)
  useEffect(() => {
    if (currentView.type !== 'public' || currentView.tab !== 'home') {
      setIsNavVisible(true);
      setIsScrolledPastTop(false);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When at or near top (<= 60px) -> fully transparent & visible
      if (currentScrollY <= 60) {
        setIsScrolledPastTop(false);
        setIsNavVisible(true);
      } else {
        setIsScrolledPastTop(true);
        // User scrolls down -> auto-hide navbar to maximize reading viewport
        if (currentScrollY > lastScrollYRef.current + 8) {
          setIsNavVisible(false);
          setIsAvatarOpen(false);
          setIsNotifOpen(false);
          setIsCompanyMenuOpen(false);
        } 
        // User scrolls up -> reveal navbar with frosted glass background
        else if (currentScrollY < lastScrollYRef.current - 8) {
          setIsNavVisible(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const isPublicActive = (tab: PublicNavTab) => {
    return currentView.type === 'public' && currentView.tab === tab;
  };

  const isWorkspaceActive = (view: WorkspaceView) => {
    return currentView.type === 'workspace' && currentView.view === view;
  };

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const navigateAndClose = (view: WorkspaceView) => {
    onNavigate({ type: 'workspace', view });
    setIsAvatarOpen(false);
  };

  return (
    <>
      {/* 1. Top Announcement Bar (Fixed at top-0, always brand navy #1c235a, never hides on scroll) */}
      <div className={`w-full h-6 px-4 flex justify-center items-center text-[8.5px] text-white/90 overflow-hidden border-b border-white/5 bg-[#1c235a] ${
        isPublicActive('home') ? 'fixed top-0 left-0 z-50' : 'sticky top-0 z-50'
      }`}>
        <div className="text-center font-medium tracking-[0.15em] text-white/90 truncate hover:text-[#ff5e14] transition-colors duration-300 cursor-default">
          We believe Vietnam will go further when we connect, grow, and move forward together.
        </div>
      </div>

      {/* 2. Main Navigation Header (Fixed at top-6 on landing page, auto-hides on scroll down, reveals with original frosted glass on scroll up) */}
      <header className={`w-full px-4 md:px-6 py-2 flex items-center justify-between transition-all duration-300 ${
        isPublicActive('home')
          ? `fixed top-6 left-0 z-40 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'} ${
              isScrolledPastTop
                ? 'bg-black/30 backdrop-blur-md border-b border-white/5 text-white shadow-xl'
                : 'bg-transparent border-b border-white/10 text-white'
            }`
          : 'sticky top-6 z-40 bg-[#1c235a] border-b border-white/10 text-white shadow-md'
      }`}>
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5">
          <button
            id="flexgo-logo-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'home' })}
            className="flex items-center gap-2 group focus:outline-hidden cursor-pointer"
          >
            <img src="/icon-192.png" alt="flexGO Logo" className="w-8 h-8 object-contain rounded-full shadow-xs group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-xl font-black tracking-tight text-white leading-none font-['Montserrat',sans-serif]">
                flex<span className="text-[#ff5e14]">GO</span>
              </span>
              <span className="text-[8px] tracking-widest text-white/70 font-bold uppercase mt-0.5">
                Always best price
              </span>
            </div>
          </button>
        </div>

        {/* Center: Public Navigation (Centered Perfectly!) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-white absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'home' })}
            className={`py-2 transition-colors cursor-pointer ${
              isPublicActive('home')
                ? 'text-[#ff5e14]'
                : 'text-white/80 hover:text-[#ff5e14]'
            }`}
          >
            [ Home ]
          </button>

          <button
            id="nav-lead-board-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
            className={`py-2 transition-colors cursor-pointer ${
              isPublicActive('lead-board')
                ? 'text-[#ff5e14]'
                : 'text-white/80 hover:text-[#ff5e14]'
            }`}
          >
            Lead Board
          </button>

          <button
            id="nav-supplier-profile-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
            className={`py-2 transition-colors cursor-pointer ${
              isPublicActive('supplier-profile')
                ? 'text-[#ff5e14]'
                : 'text-white/80 hover:text-[#ff5e14]'
            }`}
          >
            Supplier Profile
          </button>

          <button
            id="nav-hot-promotion-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'hot-promotion' })}
            className={`py-2 transition-colors cursor-pointer ${
              isPublicActive('hot-promotion')
                ? 'text-[#ff5e14]'
                : 'text-white/80 hover:text-[#ff5e14]'
            }`}
          >
            Hot Promotion
          </button>

          {/* Company Dropdown Navigation */}
          <div 
            className="relative py-2 flex items-center" 
            ref={companyRef}
            onMouseEnter={() => setIsCompanyMenuOpen(true)}
            onMouseLeave={() => setIsCompanyMenuOpen(false)}
          >
            <button
              id="nav-company-btn"
              onClick={() => {
                onNavigate({ type: 'public', tab: 'company' });
                setIsCompanyMenuOpen(false);
              }}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                isPublicActive('company')
                  ? 'text-[#ff5e14]'
                  : 'text-white/80 hover:text-[#ff5e14]'
              }`}
            >
              <span>Company</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isCompanyMenuOpen ? 'rotate-180 text-[#ff5e14]' : 'text-white/40'}`} />
            </button>

            {/* Company Dropdown Menu */}
            {isCompanyMenuOpen && (
              <div 
                id="company-nav-dropdown"
                className="absolute top-10 left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>Hệ Sinh Thái FlexGO</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Nền tảng logistics B2B & mạng lưới vận tải
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    id="company-subnav-about-btn"
                    onClick={() => {
                      onNavigate({ type: 'public', tab: 'company', params: { subTab: 'about' } });
                      setIsCompanyMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">1. Về flexGO</span>
                  </button>

                  <button
                    id="company-subnav-pricing-btn"
                    onClick={() => {
                      onNavigate({ type: 'public', tab: 'company', params: { subTab: 'pricing' } });
                      setIsCompanyMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600">2. Bảng Giá</span>
                  </button>

                  <button
                    id="company-subnav-resources-btn"
                    onClick={() => {
                      onNavigate({ type: 'public', tab: 'company', params: { subTab: 'resources' } });
                      setIsCompanyMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">3. Tài Nguyên</span>
                  </button>

                  <button
                    id="company-subnav-trust-btn"
                    onClick={() => {
                      onNavigate({ type: 'public', tab: 'company', params: { subTab: 'trust' } });
                      setIsCompanyMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">4. Điều khoản & Pháp Lý</span>
                  </button>

                  <button
                    id="company-subnav-contact-btn"
                    onClick={() => {
                      onNavigate({ type: 'public', tab: 'company', params: { subTab: 'contact' } });
                      setIsCompanyMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-purple-600">5. Liên Hệ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Quick Search */}
          {onOpenSearch && (
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="text-white hover:text-[#ff5e14] transition-colors cursor-pointer p-1"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Quick Create Inquiry Button */}
          {onOpenCreateInquiry && (
            <button
              id="header-create-inquiry-btn"
              onClick={onOpenCreateInquiry}
              className="hidden xl:inline-flex items-center gap-1.5 bg-[#ff5e14] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs hover:bg-[#e04f0e] transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post RFQ</span>
            </button>
          )}

          {/* Conditional: Logged In vs Logged Out State */}
          {isLoggedIn ? (
            <>
              {/* Notifications Trigger */}
              <div className="relative" ref={notifRef}>
                <button
                  id="header-notification-btn"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg relative transition-colors cursor-pointer"
                  title="Thông báo"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff5e14] rounded-full ring-2 ring-[#1c235a]"></span>
                  )}
                </button>

                {isNotifOpen && (
                  <NotificationDropdown
                    notifications={notifications}
                    onClose={() => setIsNotifOpen(false)}
                    onMarkAllAsRead={onMarkAllAsRead}
                    onNavigate={onNavigate}
                  />
                )}
              </div>

              {/* ========================================================= */}
              {/* COMPACT AVATAR TRIGGER & STRUCTURED WORKSPACE DROPDOWN */}
              {/* ========================================================= */}
              <div className="relative" ref={avatarRef}>
                <button
                  id="user-avatar-dropdown-trigger"
                  onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                  className="w-8 h-8 rounded-full bg-indigo-600 hover:ring-2 hover:ring-[#ff5e14] text-white flex items-center justify-center font-black text-xs shadow-md transition-all cursor-pointer focus:outline-hidden"
                  title={`${currentUser.name} (${currentUser.companyName})`}
                >
                  {initials}
                </button>

            {/* FDD STRUCTURED DROPDOWN: CUSTOMER | SUPPLIER | FLEXCREDIT | SETTINGS */}
            {isAvatarOpen && (
              <div
                id="avatar-workspace-dropdown-panel"
                className="absolute right-0 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 mt-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Header User Identity */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0">
                      {initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 text-xs truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.companyName}</div>
                    </div>
                  </div>
                </div>

                {/* Dropdown Scrollable Sections */}
                <div className="max-h-[75vh] overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
                  
                  {/* 1. CUSTOMER SECTION */}
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      <span>CUSTOMER</span>
                    </div>

                    <button
                      onClick={() => navigateAndClose('customer-inquiries')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('customer-inquiries') ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Inbox className="w-4 h-4 text-indigo-500" />
                        <span>My Inquiries</span>
                      </div>
                    </button>

                    <button
                      id="nav-customer-rates-btn"
                      onClick={() => navigateAndClose('customer-rates')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('customer-rates') ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                        <span>My Rates (Biểu Giá Dịch Vụ)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateAndClose('customer-suppliers')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('customer-suppliers') ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        <span>My Suppliers</span>
                      </div>
                    </button>
                  </div>

                  {/* 2. SUPPLIER SECTION */}
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      <span>SUPPLIER</span>
                    </div>

                    <button
                      onClick={() => navigateAndClose('supplier-leads')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('supplier-leads') ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span>My Leads</span>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateAndClose('supplier-crm')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('supplier-crm') ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-amber-500" />
                        <span>My Customers</span>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateAndClose('supplier-profile-edit')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('supplier-profile-edit') ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Showcase & Rate Cards</span>
                      </div>
                    </button>
                  </div>

                  {/* 3. FLEXCREDIT SECTION */}
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      <span>FLEXCREDIT</span>
                    </div>

                    <button
                      onClick={() => navigateAndClose('flexcredit-wallet')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('flexcredit-wallet') ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span>My Wallet</span>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateAndClose('flexcredit-add')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('flexcredit-add') ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PlusCircle className="w-4 h-4 text-emerald-600" />
                        <span>Add Credit</span>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateAndClose('flexcredit-transactions')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('flexcredit-transactions') ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <History className="w-4 h-4 text-slate-500" />
                        <span>Transaction History</span>
                      </div>
                    </button>
                  </div>

                  {/* 4. SETTINGS SECTION */}
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      SETTINGS
                    </div>

                    <button
                      onClick={() => navigateAndClose('settings-profile')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('settings-profile') ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsAvatarOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="header-login-btn"
              onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : null}
              className="text-xs font-bold text-white hover:text-[#ff5e14] transition-colors cursor-pointer uppercase tracking-wider px-2.5 py-1.5"
            >
              Log In
            </button>

            <button
              id="header-signin-btn"
              onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#ff5e14] transition-colors cursor-pointer uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/25 hover:border-[#ff5e14] hover:bg-white/5 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#ff5e14]" />
              <span>Sign In</span>
            </button>
          </div>
        )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Sign Out of FlexGO</h3>
              <p className="text-xs text-slate-500 mt-1">
                You are currently signed in as <span className="font-semibold text-slate-800">{currentUser.name}</span> ({currentUser.companyName}).
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Stay Signed In
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  if (onLogout) onLogout();
                  onNavigate({ type: 'public', tab: 'home' });
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
