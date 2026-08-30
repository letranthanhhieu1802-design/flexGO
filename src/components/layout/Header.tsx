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
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  X,
  BookOpen,
  Phone,
  Sparkles
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
  notifications?: NotificationItem[];
  onNavigate: (view: CurrentView) => void;
  onSwitchCompanyType?: (type: CompanyType) => void;
  onOpenSearch?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenCreateInquiry?: () => void;
  onMarkAllAsRead?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentView,
  notifications = [],
  onNavigate,
  onSwitchCompanyType,
  onOpenSearch,
  onOpenCommandPalette,
  onOpenCreateInquiry,
  onMarkAllAsRead = () => {},
}) => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

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
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setIsCompanyMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-30 sticky top-0 shadow-xs">
        {/* Brand Logo & Public Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Brand Logo */}
          <button
            id="flexgo-logo-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'home' })}
            className="flex items-center gap-2.5 group focus:outline-hidden cursor-pointer"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <span className="text-xl font-black tracking-tight text-indigo-950">
              flex<span className="text-orange-500">GO</span>
            </span>
          </button>

          {/* Public Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate({ type: 'public', tab: 'home' })}
              className={`text-sm font-medium h-16 flex items-center transition-colors cursor-pointer ${
                isPublicActive('home')
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              Home
            </button>

            <button
              id="nav-lead-board-btn"
              onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
              className={`text-sm font-medium h-16 flex items-center transition-colors cursor-pointer gap-1.5 ${
                isPublicActive('lead-board')
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              <span>Lead Board</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-600 rounded-full">
                Live RFQs
              </span>
            </button>

            <button
              id="nav-supplier-profile-btn"
              onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
              className={`text-sm font-medium h-16 flex items-center transition-colors cursor-pointer ${
                isPublicActive('supplier-profile')
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              Supplier Profile
            </button>

            <button
              id="nav-hot-promotion-btn"
              onClick={() => onNavigate({ type: 'public', tab: 'hot-promotion' })}
              className={`text-sm font-medium h-16 flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPublicActive('hot-promotion')
                  ? 'text-orange-600 border-b-2 border-orange-600 font-semibold'
                  : 'text-slate-500 hover:text-orange-600'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Hot Promotion</span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-600 rounded-full animate-pulse">
                HOT
              </span>
            </button>

            {/* Company Dropdown Navigation */}
            <div 
              className="relative h-16 flex items-center" 
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
                className={`text-sm font-medium h-16 flex items-center gap-1 transition-colors cursor-pointer ${
                  isPublicActive('company')
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <span>Company</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isCompanyMenuOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              {/* Company Dropdown Menu */}
              {isCompanyMenuOpen && (
                <div 
                  id="company-nav-dropdown"
                  className="absolute top-14 left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150"
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
                      className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">Về FlexGO (About Us)</p>
                        <p className="text-[10px] text-slate-500">Sứ mệnh, ban lãnh đạo & quy mô</p>
                      </div>
                    </button>

                    <button
                      id="company-subnav-pricing-btn"
                      onClick={() => {
                        onNavigate({ type: 'public', tab: 'company', params: { subTab: 'pricing' } });
                        setIsCompanyMenuOpen(false);
                      }}
                      className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0 mt-0.5">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600">Bảng Giá (Pricing & Plans)</p>
                          <span className="px-1 py-0.2 text-[9px] font-extrabold bg-orange-100 text-orange-700 rounded-sm">Hot</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Gói dịch vụ Shippers & Carriers</p>
                      </div>
                    </button>

                    <button
                      id="company-subnav-resources-btn"
                      onClick={() => {
                        onNavigate({ type: 'public', tab: 'company', params: { subTab: 'resources' } });
                        setIsCompanyMenuOpen(false);
                      }}
                      className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">Tài Nguyên (Resources & Hub)</p>
                        <p className="text-[10px] text-slate-500">Báo cáo cước & Công cụ tính CBM</p>
                      </div>
                    </button>

                    <button
                      id="company-subnav-trust-btn"
                      onClick={() => {
                        onNavigate({ type: 'public', tab: 'company', params: { subTab: 'trust' } });
                        setIsCompanyMenuOpen(false);
                      }}
                      className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Bảo Mật & Pháp Lý (Trust & Security)</p>
                        <p className="text-[10px] text-slate-500">Thẩm định 5 bước & Bảo hiểm 5 tỷ</p>
                      </div>
                    </button>

                    <button
                      id="company-subnav-contact-btn"
                      onClick={() => {
                        onNavigate({ type: 'public', tab: 'company', params: { subTab: 'contact' } });
                        setIsCompanyMenuOpen(false);
                      }}
                      className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600">Liên Hệ & Văn Phòng (Contact)</p>
                        <p className="text-[10px] text-slate-500">4 văn phòng toàn quốc & Đặt Demo</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Inquiry Button */}
          {onOpenCreateInquiry && (
            <button
              id="header-create-inquiry-btn"
              onClick={onOpenCreateInquiry}
              className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post RFQ</span>
            </button>
          )}

          {/* Quick Search Shortcut */}
          <button
            id="global-search-shortcut-btn"
            onClick={onOpenCommandPalette}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Persona Switcher Quick Menu */}
          {onSwitchCompanyType && (
            <div className="relative hidden md:block" ref={roleRef}>
              <button
                id="demo-persona-toggle-btn"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-slate-500 font-normal">Role:</span>
                <span className="font-semibold text-slate-900">{currentUser.companyType}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div 
                  id="persona-switch-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-slate-900">Switch Workspace Persona</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Toggle active business view context.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSwitchCompanyType('CUSTOMER');
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                      currentUser.companyType === 'CUSTOMER' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>1. Customer (Shipper / Importer)</span>
                    {currentUser.companyType === 'CUSTOMER' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchCompanyType('SUPPLIER');
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                      currentUser.companyType === 'SUPPLIER' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>2. Supplier (Carrier / 3PL)</span>
                    {currentUser.companyType === 'SUPPLIER' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchCompanyType('BOTH');
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                      currentUser.companyType === 'BOTH' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>3. Dual Hub (4PL / Hybrid)</span>
                    {currentUser.companyType === 'BOTH' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications Trigger */}
          <div className="relative" ref={notifRef}>
            <button
              id="header-notification-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
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
          {/* MY ACCOUNT TRIGGER & STRUCTURED WORKSPACE DROPDOWN */}
          {/* ========================================================= */}
          <div className="relative" ref={avatarRef}>
            <button
              id="user-avatar-dropdown-trigger"
              onClick={() => setIsAvatarOpen(!isAvatarOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  <span>My Account</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[90px]">
                  {currentUser.roleTitle.split(' ')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* FDD STRUCTURED DROPDOWN: CUSTOMER | SUPPLIER | FLEXCREDIT | SETTINGS */}
            {isAvatarOpen && (
              <div
                id="avatar-workspace-dropdown-panel"
                className="absolute right-0 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 mt-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Header User Identity */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0">
                      {initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 text-xs truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.companyName}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase rounded shrink-0">
                    {currentUser.companyType}
                  </span>
                </div>

                {/* Dropdown Scrollable Sections */}
                <div className="max-h-[75vh] overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
                  
                  {/* 1. CUSTOMER SECTION */}
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-between">
                      <span>CUSTOMER</span>
                      <span className="text-[9px] bg-indigo-50 px-1.5 py-0.2 rounded font-normal text-indigo-500">Shipper Hub</span>
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
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 rounded">
                        {currentUser.badgeCount.customerInquiries}
                      </span>
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
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 rounded">
                        Rate Card
                      </span>
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
                      <span className="text-[10px] text-slate-400">
                        {currentUser.badgeCount.customerSuppliers}
                      </span>
                    </button>
                  </div>

                  {/* 2. SUPPLIER SECTION */}
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center justify-between">
                      <span>SUPPLIER</span>
                      <span className="text-[9px] bg-amber-50 px-1.5 py-0.2 rounded font-normal text-amber-600">Carrier Hub</span>
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
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 rounded">
                        08 Live
                      </span>
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
                      <span className="text-[10px] text-slate-400">
                        35
                      </span>
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
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 rounded">
                        Public Detail
                      </span>
                    </button>
                  </div>

                  {/* 3. FLEXCREDIT SECTION */}
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center justify-between">
                      <span>FLEXCREDIT</span>
                      <span className="text-[9px] bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold text-emerald-600">4,250 Cr</span>
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
                      <span className="text-[10px] font-bold text-amber-600">
                        Gold Tier
                      </span>
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
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 rounded">
                        Top-up
                      </span>
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
                      <span className="text-[10px] text-slate-400">
                        Ledger
                      </span>
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
                      <span className="text-[10px] text-slate-400">Security</span>
                    </button>

                    <button
                      onClick={() => navigateAndClose('settings-company')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left ${
                        isWorkspaceActive('settings-company') ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span>Company Profile</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">Verified</span>
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
