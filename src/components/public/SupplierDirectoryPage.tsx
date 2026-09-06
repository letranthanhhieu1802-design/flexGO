import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Ship, 
  Plane, 
  ArrowRight, 
  Plus, 
  Send,
  ChevronRight,
  User,
  Award,
  Trophy,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Download,
  Sparkles,
  DollarSign,
  Calculator,
  ThumbsUp,
  Check,
  Copy,
  ExternalLink,
  Share2,
  Briefcase,
  Globe,
  Percent,
  CheckCircle2,
  Snowflake,
  FileText,
  X,
  Package,
  Layers,
  TrendingUp,
  BadgeCheck,
  PhoneCall,
  LayoutGrid,
  Users,
  TableProperties,
  ArrowUpRight,
  Shield,
  Zap,
  SlidersHorizontal,
  Bookmark,
  CheckCircle,
  Eye,
  Flame,
  Activity,
  UserCheck
} from 'lucide-react';
import { SupplierCompany, CurrentView, SalesSpecialistProfile } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { SupplierProfileDetailPage } from './SupplierProfileDetailPage';

interface SupplierDirectoryPageProps {
  suppliers: SupplierCompany[];
  initialSpecialistId?: string;
  initialViewState?: 'directory' | 'detail';
  fromView?: string;
  onOpenCreateInquiry: () => void;
  onNavigate: (view: CurrentView) => void;
}

export const SupplierDirectoryPage: React.FC<SupplierDirectoryPageProps> = ({
  suppliers,
  initialSpecialistId,
  initialViewState,
  fromView,
  onOpenCreateInquiry,
  onNavigate,
}) => {
  // Navigation View State: 'directory' (gallery list) or 'detail' (full specialist/supplier profile)
  const [viewState, setViewState] = useState<'directory' | 'detail'>(
    initialViewState || (initialSpecialistId ? 'detail' : 'directory')
  );
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>(
    initialSpecialistId || 'sales-minh-tran'
  );

  React.useEffect(() => {
    if (initialSpecialistId) {
      setSelectedSpecialistId(initialSpecialistId);
    }
    if (initialViewState) {
      setViewState(initialViewState);
    } else if (initialSpecialistId) {
      setViewState('detail');
    }
  }, [initialSpecialistId, initialViewState]);

  // Display mode in directory: 'gallery' (salesman cards), 'compact' (compact list), 'table' (matrix)
  const [displayMode, setDisplayMode] = useState<'gallery' | 'compact' | 'table'>('gallery');

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'experience' | 'response' | 'shipments'>('rating');

  // Quick RFQ Modal state for a specific Salesperson
  const [isQuickRFQModalOpen, setIsQuickRFQModalOpen] = useState<boolean>(false);
  const [targetSpecialistForRFQ, setTargetSpecialistForRFQ] = useState<SalesSpecialistProfile | null>(null);

  // Bookmarks state (specialist IDs)
  const [bookmarkedSpecialistIds, setBookmarkedSpecialistIds] = useState<string[]>(['sales-minh-tran']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleBookmark = (id: string, name: string) => {
    if (bookmarkedSpecialistIds.includes(id)) {
      setBookmarkedSpecialistIds(bookmarkedSpecialistIds.filter((bId) => bId !== id));
      showToast(`Đã bỏ lưu hồ sơ ${name}`);
    } else {
      setBookmarkedSpecialistIds([...bookmarkedSpecialistIds, id]);
      showToast(`Đã lưu hồ sơ ${name} vào danh bạ yêu thích`);
    }
  };

  // Distinct company list for filtering
  const distinctCompanies = useMemo(() => {
    const map = new Map<string, string>();
    mockSalesSpecialists.forEach(s => {
      map.set(s.companyId, s.companyName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filtered and sorted Sales Specialists (Individual PIC Profiles)
  const filteredSpecialists = useMemo(() => {
    return mockSalesSpecialists
      .filter((spec) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          !searchTerm ||
          spec.vietnameseName.toLowerCase().includes(searchLower) ||
          spec.name.toLowerCase().includes(searchLower) ||
          spec.title.toLowerCase().includes(searchLower) ||
          spec.companyName.toLowerCase().includes(searchLower) ||
          spec.location.toLowerCase().includes(searchLower) ||
          spec.specialties.some((s) => s.toLowerCase().includes(searchLower)) ||
          spec.services.some((srv) => srv.title.toLowerCase().includes(searchLower) || srv.serviceType.toLowerCase().includes(searchLower)) ||
          spec.rateCard.some((rc) => rc.routeOrService.toLowerCase().includes(searchLower));

        const matchesService = 
          selectedService === 'ALL' ||
          spec.services.some((srv) => srv.serviceType.toLowerCase().includes(selectedService.toLowerCase())) ||
          spec.specialties.some((sp) => sp.toLowerCase().includes(selectedService.toLowerCase()));

        const matchesCompany = 
          selectedCompany === 'ALL' ||
          spec.companyId === selectedCompany;

        const matchesVerified = !onlyVerified || spec.verifiedStatus;
        const matchesOnline = !onlyOnline || spec.onlineStatus === 'ONLINE';

        return matchesSearch && matchesService && matchesCompany && matchesVerified && matchesOnline;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'views') {
          return (b.profileViews || 0) - (a.profileViews || 0);
        }
        if (sortBy === 'experience') {
          return b.yearsOfExperience - a.yearsOfExperience;
        }
        if (sortBy === 'response') {
          return a.keyMetrics.rfqResponseAvgMins - b.keyMetrics.rfqResponseAvgMins;
        }
        if (sortBy === 'shipments') {
          const numA = parseInt(a.keyMetrics.shipmentsCount.replace(/[^0-9]/g, '') || '0');
          const numB = parseInt(b.keyMetrics.shipmentsCount.replace(/[^0-9]/g, '') || '0');
          return numB - numA;
        }
        return 0;
      });
  }, [searchTerm, selectedService, selectedCompany, onlyVerified, onlyOnline, sortBy]);

  // Handle open full detail
  const handleOpenDetail = (specialistId: string) => {
    setSelectedSpecialistId(specialistId);
    setViewState('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuickRFQ = (specialist: SalesSpecialistProfile) => {
    setTargetSpecialistForRFQ(specialist);
    setIsQuickRFQModalOpen(true);
  };

  // If in Detail view, render the comprehensive Profile Detail Component
  if (viewState === 'detail') {
    return (
      <SupplierProfileDetailPage
        specialistId={selectedSpecialistId}
        onBackToDirectory={() => {
          if (fromView === 'customer-suppliers') {
            onNavigate({ type: 'workspace', view: 'customer-suppliers' });
          } else {
            setViewState('directory');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onSelectSpecialist={(newId) => setSelectedSpecialistId(newId)}
        onOpenCreateInquiry={onOpenCreateInquiry}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div id="supplier-directory-gallery-page" className="min-h-screen bg-slate-50/70 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          HERO BANNER: SALESMAN-CENTRIC PIC PROFILES
         ========================================================================= */}
      <section className="border-b border-slate-200 bg-linear-to-b from-white via-slate-50 to-slate-100/80 pt-8 pb-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 border border-blue-200/80 shadow-2xs">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <span>Hồ Sơ Năng Lực & Uy Tín Cá Nhân Chuyên Viên Logistics (PIC)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Danh Bạ Chuyên Viên Logistics & Bảng Giá Niêm Yết
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Mỗi Chuyên viên Kinh doanh (Salesman/PIC) trực tiếp chăm sóc và cập nhật biểu giá, năng lực vận hành, tuyến thế mạnh và chỉ số uy tín cá nhân của mình. Kết nối trực tiếp với người phụ trách thực tế để nhận tư vấn cước nhanh trong 15 phút.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={onOpenCreateInquiry}
                id="directory-create-inquiry-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.99] transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Phát Hành RFQ Đến Tất Cả Sales</span>
              </button>
            </div>
          </div>

          {/* Quick Value Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-slate-900">{mockSalesSpecialists.length}+ Chuyên Viên</p>
                <p className="text-xs text-slate-500">Cập nhật hồ sơ cá nhân</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-emerald-700">100% Xác Thực</p>
                <p className="text-xs text-slate-500">Kinh nghiệm & Doanh nghiệp</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-slate-900">&lt; 15 Phút</p>
                <p className="text-xs text-slate-500">Tốc độ phản hồi báo giá</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-slate-900">45+ Biểu Giá Tuyến</p>
                <p className="text-xs text-slate-500">Niêm yết công khai minh bạch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TOOLBAR: SEARCH, FILTERS, COMPANY SELECTOR & SORT
         ========================================================================= */}
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md py-3 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên Salesman, dịch vụ, tuyến vận chuyển, công ty..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter by Company & Sort */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
              {/* Company Filter Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 hidden sm:inline">Công ty:</span>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-none max-w-[180px] truncate"
                >
                  <option value="ALL">🏢 Tất cả công ty</option>
                  {distinctCompanies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 hidden sm:inline">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="rating">⭐ Đánh giá uy tín cao nhất</option>
                  <option value="views">👁️ Lượt xem Profile nhiều nhất</option>
                  <option value="experience">💼 Thâm niên kinh nghiệm</option>
                  <option value="response">⚡ Tốc độ phản hồi nhanh nhất</option>
                  <option value="shipments">🏆 Số chuyến / Lô đã xử lý</option>
                </select>
              </div>

              {/* View Modes */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold shadow-2xs">
                <button
                  onClick={() => setDisplayMode('gallery')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
                    displayMode === 'gallery'
                      ? 'bg-white text-blue-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Xem dạng thẻ cá nhân (Gallery)"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Thẻ Cá Nhân</span>
                </button>

                <button
                  onClick={() => setDisplayMode('compact')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
                    displayMode === 'compact'
                      ? 'bg-white text-blue-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Xem danh sách thu gọn"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Danh Sách</span>
                </button>

                <button
                  onClick={() => setDisplayMode('table')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
                    displayMode === 'table'
                      ? 'bg-white text-blue-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Xem bảng đối chiếu chỉ số"
                >
                  <TableProperties className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Bảng Đối Chiếu</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Service Filter Chips */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0">Chuyên môn:</span>
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'Trucking', label: '🚛 Đường bộ FTL/LTL' },
              { id: 'Sea Freight', label: '🚢 Đường biển FCL' },
              { id: 'Cold Chain', label: '❄️ Vận tải lạnh' },
              { id: 'Air Freight', label: '✈️ Hàng không' },
              { id: 'Customs', label: '📋 Thủ tục hải quan' },
              { id: 'Warehousing', label: '🏬 Kho bãi 3PL' },
              { id: 'Cross-border', label: '🌐 Xuyên biên giới' },
            ].map((srv) => (
              <button
                key={srv.id}
                onClick={() => setSelectedService(srv.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  selectedService === srv.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {srv.label}
              </button>
            ))}

            {/* Quick Online & Verified filter tags */}
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1 ${
                onlyOnline
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Đang Online</span>
            </button>

            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1 ${
                onlyVerified
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>Đã xác thực</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN CONTENT AREA (SALESMAN-CENTRIC PIC GALLERY)
         ========================================================================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results Count & Active Filters Indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <p>
            Tìm thấy <strong className="text-slate-900 font-bold">{filteredSpecialists.length}</strong> chuyên viên kinh doanh & quản trị giải pháp logistics
          </p>
          {(searchTerm || selectedService !== 'ALL' || selectedCompany !== 'ALL' || onlyVerified || onlyOnline) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedService('ALL');
                setSelectedCompany('ALL');
                setOnlyVerified(false);
                setOnlyOnline(false);
              }}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              <span>Xóa tất cả bộ lọc</span>
            </button>
          )}
        </div>

        {/* -----------------------------------------------------------------------
            MODE 1: SALESMAN-CENTRIC GALLERY CARDS (TRỌNG TÂM CÁ NHÂN PIC)
           ----------------------------------------------------------------------- */}
        {displayMode === 'gallery' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredSpecialists.map((specialist) => {
              const isBookmarked = bookmarkedSpecialistIds.includes(specialist.id);

              return (
                <div
                  key={specialist.id}
                  id={`salesman-card-${specialist.id}`}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <div>
                    {/* Top Card Header: SALESMAN IDENTITY AS PRIMARY FOCUS */}
                    <div className="border-b border-slate-100 p-5 bg-linear-to-r from-slate-50/90 via-white to-slate-50/60">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-4">
                          {/* Salesman Personal Avatar with Online Badge */}
                          <div className="relative shrink-0">
                            <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-linear-to-tr from-blue-700 via-indigo-600 to-indigo-800 font-bold text-white shadow-sm text-xl ring-2 ring-white">
                              {specialist.avatarInitial}
                            </div>
                            {specialist.onlineStatus === 'ONLINE' && (
                              <span 
                                className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" 
                                title="Đang trực tuyến (Sẵn sàng nhận RFQ)"
                              >
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            {/* Personal Name & Verified Badge */}
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 
                                onClick={() => handleOpenDetail(specialist.id)}
                                className="text-lg font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors"
                              >
                                {specialist.vietnameseName}
                              </h3>
                              <span className="text-xs text-slate-400 font-medium">({specialist.name})</span>
                              {specialist.verifiedStatus && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                                  Chuyên viên Uy tín
                                </span>
                              )}
                            </div>

                            {/* Salesman Professional Title */}
                            <p className="text-xs font-semibold text-blue-700 line-clamp-1">
                              {specialist.title}
                            </p>

                            {/* Secondary Affiliation: Đang công tác tại Công ty logistics */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                              <span className="text-slate-400">Công tác tại:</span>
                              <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-800 border border-slate-200/60">
                                <div className="flex h-4 w-4 items-center justify-center rounded bg-blue-600 text-[9px] font-bold text-white">
                                  {specialist.companyLogo}
                                </div>
                                <span className="font-semibold">{specialist.companyName}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(specialist.id, specialist.vietnameseName)}
                          className={`rounded-lg p-2 transition-colors ${
                            isBookmarked
                              ? 'text-amber-500 bg-amber-50'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                          }`}
                          title={isBookmarked ? 'Bỏ lưu' : 'Lưu hồ sơ chuyên viên'}
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      {/* Personal Performance Metric Row: Views, Rating, Deals, Response Time */}
                      <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-xl bg-white p-2.5 border border-slate-100 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Lượt xem hồ sơ</span>
                          <span className="font-bold text-indigo-700 flex items-center justify-center gap-0.5 mt-0.5 text-[11px] sm:text-xs">
                            <Eye className="h-3 w-3 text-indigo-600 shrink-0" />
                            {(specialist.profileViews || 14820).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <div className="border-l border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Đánh giá</span>
                          <span className="font-bold text-slate-900 flex items-center justify-center gap-0.5 mt-0.5 text-[11px] sm:text-xs">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                            {specialist.rating} ({specialist.reviewsCount})
                          </span>
                        </div>
                        <div className="border-l border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Kinh nghiệm</span>
                          <span className="font-bold text-slate-900 mt-0.5 block text-[11px] sm:text-xs">
                            {specialist.yearsOfExperience}+ Năm
                          </span>
                        </div>
                        <div className="border-l border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Phản hồi RFQ</span>
                          <span className="font-bold text-emerald-600 mt-0.5 block text-[11px] sm:text-xs">
                            {specialist.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Personal Motto, Specialties & Published Tariff Count */}
                    <div className="p-5 space-y-4">
                      {/* Personal Motto / Cam kết dịch vụ cá nhân */}
                      <div className="rounded-xl bg-slate-50/80 p-3 text-xs italic text-slate-700 border border-slate-100/90 flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="not-italic font-semibold text-slate-900 block mb-0.5">Cam kết dịch vụ:</strong>
                          <span>{specialist.motto}</span>
                        </div>
                      </div>

                      {/* Personal Specialties & Strengths (Thế mạnh & Chuyên môn vận hành) */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Thế mạnh & Chuyên môn vận hành:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {specialist.specialties.slice(0, 4).map((specItem, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start gap-2 rounded-xl bg-slate-50/90 border border-slate-200/70 p-2.5 text-slate-700 hover:bg-white hover:border-blue-200 transition-colors"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="font-medium leading-relaxed">{specItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Published Tariff Count Badge (Chỉ số lượng dịch vụ có bảng cước niêm yết) */}
                      {specialist.rateCard && specialist.rateCard.length > 0 && (
                        <div 
                          onClick={() => handleOpenDetail(specialist.id)}
                          className="flex items-center justify-between rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 p-3 text-xs cursor-pointer hover:border-blue-300 hover:shadow-xs transition-all group/rate"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs shrink-0">
                              <DollarSign className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">
                                Đã công bố {specialist.rateCard.length} bảng cước vận chuyển chuẩn
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Biểu phí tham chiếu minh bạch • Tra cứu trực tiếp
                              </span>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 group-hover/rate:text-blue-900 shrink-0">
                            <span>Xem biểu phí</span>
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/rate:translate-x-0.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer: Tinh gọn chỉ 2 nút chuyển đổi trọng tâm */}
                  <div className="border-t border-slate-100 p-4 bg-slate-50/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenQuickRFQ(specialist)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-2xs hover:bg-blue-50 hover:border-blue-300 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Gửi RFQ Cho PIC</span>
                    </button>

                    <button
                      onClick={() => handleOpenDetail(specialist.id)}
                      id={`view-detail-btn-${specialist.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <span>Xem Profile & Bảng Giá</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* -----------------------------------------------------------------------
            MODE 2: COMPACT LIST VIEW
           ----------------------------------------------------------------------- */}
        {displayMode === 'compact' && (
          <div className="space-y-4">
            {filteredSpecialists.map((specialist) => (
              <div
                key={specialist.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-300 transition-all gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-linear-to-tr from-blue-700 to-indigo-700 font-bold text-white text-lg">
                      {specialist.avatarInitial}
                    </div>
                    {specialist.onlineStatus === 'ONLINE' && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 
                        onClick={() => handleOpenDetail(specialist.id)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {specialist.vietnameseName}
                      </h3>
                      <span className="text-xs text-slate-400">({specialist.name})</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {specialist.rating} ({specialist.reviewsCount})
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-blue-700">{specialist.title}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        Công tác tại: <strong>{specialist.companyName}</strong>
                      </span>
                      <span>•</span>
                      <span>{specialist.yearsOfExperience}+ năm kinh nghiệm</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">Phản hồi {specialist.responseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {(specialist.profileViews || 14820).toLocaleString('vi-VN')} views
                  </span>
                  <button
                    onClick={() => handleOpenQuickRFQ(specialist)}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Gửi RFQ
                  </button>
                  <button
                    onClick={() => handleOpenDetail(specialist.id)}
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                  >
                    <span>Xem Hồ Sơ</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* -----------------------------------------------------------------------
            MODE 3: COMPARATIVE TABLE VIEW (BẢNG SO SÁNH NĂNG LỰC CÁ NHÂN PIC)
           ----------------------------------------------------------------------- */}
        {displayMode === 'table' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Chuyên Viên Sales (PIC)</th>
                    <th className="py-3.5 px-4">Đơn Vị Công Tác</th>
                    <th className="py-3.5 px-4">Thế Mạnh Chuyên Môn</th>
                    <th className="py-3.5 px-4 text-center">Lượt Xem</th>
                    <th className="py-3.5 px-4 text-center">Đánh Giá</th>
                    <th className="py-3.5 px-4 text-center">Kinh Nghiệm</th>
                    <th className="py-3.5 px-4 text-center">Tốc Độ Phản Hồi</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSpecialists.map((spec) => (
                    <tr key={spec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs shrink-0">
                            {spec.avatarInitial}
                          </div>
                          <div>
                            <p 
                              className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer" 
                              onClick={() => handleOpenDetail(spec.id)}
                            >
                              {spec.vietnameseName}
                            </p>
                            <p className="text-xs text-blue-700">{spec.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800">{spec.companyName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {spec.specialties.slice(0, 2).map((sp, i) => (
                            <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 line-clamp-1">
                              {sp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          <Eye className="h-3 w-3 text-indigo-600" />
                          {(spec.profileViews || 14820).toLocaleString('vi-VN')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {spec.rating}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-800">
                        {spec.yearsOfExperience}+ Năm
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          {spec.responseTime}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(spec.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <span>Xem Profile</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: DIRECT RFQ FOR SELECTED SALESPERSON (PIC)
         ========================================================================= */}
      {isQuickRFQModalOpen && targetSpecialistForRFQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                  {targetSpecialistForRFQ.avatarInitial}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Gửi Yêu Cầu Báo Giá Trực Tiếp Cho PIC
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold">
                    {targetSpecialistForRFQ.vietnameseName} ({targetSpecialistForRFQ.companyName})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsQuickRFQModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Đã gửi yêu cầu báo giá thành công đến chuyên viên ${targetSpecialistForRFQ.vietnameseName} (${targetSpecialistForRFQ.companyName})! Chuyên viên sẽ liên hệ lại trong vòng 15 phút.`);
                setIsQuickRFQModalOpen(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Công ty / Người liên hệ *</label>
                  <input
                    required
                    type="text"
                    defaultValue="ABC Manufacturing Co., Ltd."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại / Zalo *</label>
                  <input
                    required
                    type="tel"
                    defaultValue="0918 888 999"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tuyến xuất phát</label>
                  <input
                    type="text"
                    defaultValue="TP. Hồ Chí Minh / Bình Dương"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tuyến đích</label>
                  <input
                    type="text"
                    defaultValue="Hà Nội / Hải Phòng"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chi tiết hàng hóa & Yêu cầu vận chuyển</label>
                <textarea
                  rows={3}
                  defaultValue="Cần báo giá cước vận chuyển 15 tấn hàng định kỳ 4 chuyến/tuần. Yêu cầu xe thùng kín bảo đảm GPS và bảo hiểm hàng hóa."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  {targetSpecialistForRFQ.vietnameseName} phản hồi trong {targetSpecialistForRFQ.responseTime}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickRFQModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    Gửi Trực Tiếp Cho PIC
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
