import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Ship, 
  Plane, 
  ArrowRight, 
  Plus, 
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
  TableProperties,
  ArrowUpRight,
  Shield,
  Zap,
  CheckCircle,
  Eye,
  Flame,
  Activity,
  ArrowUpDown,
  Search,
  Check,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { SupplierCompany, CurrentView, ServiceType } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { SupplierProfileDetailPage } from './SupplierProfileDetailPage';

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  Trucking: 'Đường bộ',
  'Sea Freight (FCL)': 'Đường biển FCL',
  'Sea Freight (LCL)': 'Đường biển LCL',
  'Air Freight': 'Hàng không',
  'Rail Freight': 'Đường sắt',
  Warehousing: 'Kho bãi',
  'Customs Clearance': 'Thủ tục hải quan',
  'Cross-border': 'Vận tải xuyên biên giới',
  'Project Cargo': 'Hàng dự án',
  'Cold Chain': 'Vận tải lạnh',
};

// Cấu hình danh mục dịch vụ đã kích hoạt & khai báo niêm yết giá theo chuẩn 3 cấp [Nhóm / Loại hàng / Mô hình]
interface DeclaredServiceBadge {
  fullText: string;
  badgeClass: string;
}

const getDeclaredServiceBadges = (specialistId: string): DeclaredServiceBadge[] => {
  switch (specialistId) {
    case 'sales-minh-tran':
      return [
        { fullText: 'Đường bộ / Hàng thường / FTL', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
        { fullText: 'Đường biển / Hàng thường / FCL', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
        { fullText: 'Kho 3PL / Hàng thường / Kho thường', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
        { fullText: 'Hàng không / Hàng thường / Cargo', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
        { fullText: 'Đường bộ / Hàng lạnh / FTL', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
      ];
    case 'sales-hoang-nam':
      return [
        { fullText: 'Đường biển / Hàng thường / FCL', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
        { fullText: 'Đường biển / Hàng thường / LCL', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
        { fullText: 'Thủ tục hải quan / Hàng thường / Khai báo & C/O', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
        { fullText: 'Đường bộ / Hàng thường / FTL', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
      ];
    case 'sales-minh-khang':
      return [
        { fullText: 'Hàng không / Hàng thường / Cargo', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
        { fullText: 'Hàng không / Hàng thường / Express', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        { fullText: 'Thủ tục hải quan / Hàng nguy hiểm / Khai báo & C/O', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
      ];
    case 'sales-huong-giang':
      return [
        { fullText: 'Thủ tục hải quan / Hàng thường / Khai báo & C/O', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
        { fullText: 'Thủ tục hải quan / Hàng nguy hiểm / Khai báo & C/O', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
        { fullText: 'Đường biển / Hàng thường / FCL', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
      ];
    case 'sales-tuan-anh':
      return [
        { fullText: 'Integrated / Hàng dự án / Đa phương thức', badgeClass: 'bg-violet-50 text-violet-700 border-violet-200' },
        { fullText: 'Đường bộ / Hàng thường / FTL', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
        { fullText: 'Đường biển / Hàng thường / FCL', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
      ];
    case 'sales-mai-linh':
      return [
        { fullText: 'Đường bộ / Hàng lạnh / FTL', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
        { fullText: 'Cross-Border / Hàng thường / FTL', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' },
        { fullText: 'Hàng không / Hàng thường / Express', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      ];
    case 'sales-thi-mai':
      return [
        { fullText: 'Kho 3PL / Hàng thường / Kho ngoại quan', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
        { fullText: 'Kho 3PL / Hàng thường / Kho thường', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
        { fullText: 'Đường sắt / Hàng thường / FCL', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      ];
    default:
      return [
        { fullText: 'Đường bộ / Hàng thường / FTL', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
        { fullText: 'Đường biển / Hàng thường / FCL', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
      ];
  }
};

interface SupplierDirectoryPageProps {
  suppliers: SupplierCompany[];
  initialSpecialistId?: string;
  initialViewState?: 'directory' | 'detail';
  fromView?: string;
  onOpenCreateInquiry: () => void;
  onNavigate: (view: CurrentView) => void;
}

type SortField = 'rating' | 'profileViews' | 'rfqRequests' | 'quotesCount' | 'ordersCount' | 'revenue' | 'name';

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

  const [viewsCountMap, setViewsCountMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('supplier_profile_views_map');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    const initial: Record<string, number> = {};
    mockSalesSpecialists.forEach((s) => {
      initial[s.id] = s.profileViews || 12390;
    });
    return initial;
  });

  const [displayMode, setDisplayMode] = useState<'gallery' | 'table'>('gallery');
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedSpecialists = useMemo(() => {
    const list = [...mockSalesSpecialists];
    return list.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      switch (sortField) {
        case 'rating':
          valA = a.rating;
          valB = b.rating;
          break;
        case 'profileViews':
          valA = viewsCountMap[a.id] ?? (a.profileViews || 0);
          valB = viewsCountMap[b.id] ?? (b.profileViews || 0);
          break;
        case 'rfqRequests':
          valA = a.viewerInteractions?.rfqRequestsCount || 0;
          valB = b.viewerInteractions?.rfqRequestsCount || 0;
          break;
        case 'quotesCount':
          valA = a.keyMetrics.quotesCount || 0;
          valB = b.keyMetrics.quotesCount || 0;
          break;
        case 'ordersCount':
          valA = a.keyMetrics.ordersCount || 0;
          valB = b.keyMetrics.ordersCount || 0;
          break;
        case 'name':
          return sortOrder === 'asc' 
            ? a.vietnameseName.localeCompare(b.vietnameseName, 'vi')
            : b.vietnameseName.localeCompare(a.vietnameseName, 'vi');
        default:
          valA = a.rating;
          valB = b.rating;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [sortField, sortOrder, viewsCountMap]);

  const totalPages = Math.max(1, Math.ceil(sortedSpecialists.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedSpecialists = sortedSpecialists.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  // Handle open full detail & increment profile view count
  const handleOpenDetail = (specialistId: string) => {
    setViewsCountMap((prev) => {
      const current = prev[specialistId] ?? (mockSalesSpecialists.find((s) => s.id === specialistId)?.profileViews || 12390);
      const updated = { ...prev, [specialistId]: current + 1 };
      try {
        localStorage.setItem('supplier_profile_views_map', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSelectedSpecialistId(specialistId);
    setViewState('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div id="supplier-directory-gallery-page" className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200 space-y-5">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Danh bạ nhà cung cấp
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tổng hợp các đối tác uy tín và đáng tin cậy được flexGO xác nhận.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="public-post-inquiry-btn"
              onClick={onOpenCreateInquiry}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Yêu Cầu Vận Chuyển Mới</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Nhà cung cấp xác thực</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">{mockSalesSpecialists.length}+</span>
              <span className="text-xs font-bold text-emerald-300/90">đối tác</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Đã được flexGO xác nhận</p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-cyan-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Nhóm dịch vụ</span>
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400 tracking-tight">8</span>
              <span className="text-xs font-bold text-cyan-300/90">nhóm</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Dịch vụ logistics & vận tải</p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Biểu giá niêm yết</span>
              <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-300 tracking-tight">45+</span>
              <span className="text-xs font-bold text-purple-200/90">biểu giá</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Niêm yết công khai, minh bạch</p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-amber-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Thời gian phản hồi</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 tracking-tight">&lt; 15</span>
              <span className="text-xs font-bold text-amber-300/90">phút</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Phản hồi yêu cầu báo giá</p>
          </div>
        </div>
      </div>

      {/* Control / View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 sm:px-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <p className="text-xs text-slate-600 font-medium">
          Tìm thấy <strong className="font-bold text-slate-900">{mockSalesSpecialists.length}</strong> chuyên viên kinh doanh & quản trị giải pháp logistics
        </p>

        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold shadow-2xs self-end sm:self-auto">
          <button
            onClick={() => setDisplayMode('gallery')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all cursor-pointer ${
              displayMode === 'gallery'
                ? 'bg-white font-bold text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Thẻ cá nhân</span>
          </button>
          <button
            onClick={() => setDisplayMode('table')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all cursor-pointer ${
              displayMode === 'table'
                ? 'bg-white font-bold text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableProperties className="h-3.5 w-3.5" />
            <span>Bảng đối chiếu</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTENT AREA
         ========================================================================= */}
      <div className="pt-1">
        {/* -----------------------------------------------------------------------
            MODE 1: SALESMAN-CENTRIC GALLERY CARDS (TRỌNG TÂM CÁ NHÂN PIC)
           ----------------------------------------------------------------------- */}
        {displayMode === 'gallery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {sortedSpecialists.map((specialist) => {
              const primaryServiceType = specialist.services[0]?.serviceType;
              const primaryService = primaryServiceType ? SERVICE_TYPE_LABELS[primaryServiceType] : 'Logistics';
              const managedRevenue = specialist.keyMetrics.revenueManagedVND.split('(')[0].trim();

              return (
                <div
                  key={specialist.id}
                  id={`salesman-card-${specialist.id}`}
                  className="group relative flex min-h-108 min-w-0 cursor-pointer flex-col rounded-2xl border border-slate-700 bg-[linear-gradient(160deg,#334155_0%,#172033_34%,#020b07_66%,#020704_100%)] p-5 text-white shadow-lg transition-all hover:-translate-y-1 hover:border-orange-500/60 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
                  onClick={() => handleOpenDetail(specialist.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleOpenDetail(specialist.id);
                    }
                  }}
                  role="button"
                  aria-label={`Xem hồ sơ ${specialist.vietnameseName}`}
                  tabIndex={0}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-2xl bg-[radial-gradient(circle_at_30%_0%,rgba(251,146,60,0.2),transparent_58%)]" />

                  <div className="relative flex items-start justify-between">
                    <div className="relative">
                      {specialist.avatarUrl ? (
                        <img
                          src={specialist.avatarUrl}
                          alt={specialist.vietnameseName}
                          className="h-32 w-32 rounded-full border-4 border-slate-500/60 object-cover shadow-lg"
                        />
                      ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-slate-500/60 bg-linear-to-tr from-blue-700 via-indigo-600 to-indigo-800 text-3xl font-black text-white shadow-lg">
                          {specialist.avatarInitial}
                        </div>
                      )}
                      {specialist.onlineStatus === 'ONLINE' && (
                        <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 ring-3 ring-slate-800" title="Đang trực tuyến" />
                      )}
                    </div>
                  </div>

                  <div className="relative mt-4">
                    <h3 className="text-xl font-black leading-tight break-words text-white transition-colors group-hover:text-orange-300">
                      {specialist.vietnameseName}
                    </h3>
                    <p className="mt-2 text-xs font-extrabold leading-5 break-words text-orange-500">
                      {specialist.companyName}
                    </p>
                  </div>

                  <dl className="relative mt-5 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-x-2 gap-y-2 text-xs leading-5 break-words">
                    <dt className="text-slate-400">Lượt xem</dt>
                    <dd className="text-right font-black text-slate-100">{(viewsCountMap[specialist.id] ?? (specialist.profileViews || 12390)).toLocaleString('vi-VN')}</dd>
                    <dt className="text-slate-400">Yêu cầu báo giá</dt>
                    <dd className="text-right font-black text-slate-100">{specialist.viewerInteractions?.rfqRequestsCount.toLocaleString('vi-VN') ?? '—'}</dd>
                    <dt className="text-slate-400">Số báo giá</dt>
                    <dd className="text-right font-black text-slate-100">{specialist.keyMetrics.quotesCount?.toLocaleString('vi-VN') ?? '—'}</dd>
                    <dt className="text-slate-400">Số đơn hàng</dt>
                    <dd className="text-right font-black text-slate-100">{specialist.keyMetrics.ordersCount?.toLocaleString('vi-VN') ?? '—'}</dd>
                    <dt className="text-slate-400">Giá trị</dt>
                    <dd className="text-right font-black text-slate-100">{managedRevenue}</dd>
                    <dt className="text-slate-400">Dịch vụ niêm yết</dt>
                    <dd className="text-right font-black text-slate-100">{primaryService}</dd>
                  </dl>
                </div>
              );
            })}
          </div>
        )}

        {/* -----------------------------------------------------------------------
            MODE 2: COMPARATIVE TABLE VIEW (BẢNG ĐỐI CHIẾU ĐỒNG BỘ LEADBOARD STYLE)
           ----------------------------------------------------------------------- */}
        {displayMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full flex flex-col">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto" id="supplier-comparison-table">
                {/* Table Header */}
                <thead className="bg-slate-100 shadow-xs border-b border-slate-200">
                  <tr className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider select-none">
                    {/* 1. STT */}
                    <th className="py-2.5 px-1.5 w-8 text-center sticky top-0 bg-slate-100 border-b border-slate-200">
                      STT
                    </th>

                    {/* 2. PIC */}
                    <th 
                      className="py-2.5 px-2.5 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Chuyên Viên (PIC)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    {/* 3. Đơn Vị */}
                    <th className="py-2.5 px-2 whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200">
                      <span>Đơn Vị</span>
                    </th>

                    {/* 4. Dịch Vụ (Cấu trúc: Nhóm / Nhóm Hàng / Mô Hình) */}
                    <th className="py-2.5 px-2 sticky top-0 bg-slate-100 border-b border-slate-200">
                      <span>Dịch Vụ Niêm Yết</span>
                    </th>

                    {/* 5. Lượt Xem */}
                    <th 
                      className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200"
                      onClick={() => handleSort('profileViews')}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <span>Lượt Xem</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    {/* 6. Yêu Cầu Báo Giá */}
                    <th 
                      className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200"
                      onClick={() => handleSort('rfqRequests')}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <span>Yêu Cầu</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    {/* 7. Số Báo Giá */}
                    <th 
                      className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200"
                      onClick={() => handleSort('quotesCount')}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <span>Báo Giá</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    {/* 8. Số Đơn Hàng (Cột mới) */}
                    <th 
                      className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200"
                      onClick={() => handleSort('ordersCount')}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <span>Đơn Hàng</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    {/* 9. Giá Trị */}
                    <th className="py-2.5 px-2 text-right whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200">
                      <span>Quản Lý Doanh Số</span>
                    </th>

                    {/* 10. Đánh Giá */}
                    <th 
                      className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <span>Đánh Giá</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>

                    {/* 11. Thao Tác */}
                    <th className="py-2.5 px-2 text-center whitespace-nowrap sticky top-0 bg-slate-100 border-b border-slate-200">
                      <span>Thao Tác</span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedSpecialists.map((spec, index) => {
                    const itemIndex = (safeCurrentPage - 1) * pageSize + index + 1;
                    const declaredBadges = getDeclaredServiceBadges(spec.id);
                    const managedRevenue = spec.keyMetrics.revenueManagedVND.split('(')[0].trim();

                    return (
                      <tr
                        key={spec.id}
                        className="hover:bg-indigo-50/40 transition-colors group"
                      >
                        {/* 1. STT */}
                        <td className="py-2.5 px-1.5 text-center font-mono text-slate-500 font-bold text-xs select-none">
                          {itemIndex}
                        </td>

                        {/* 2. PIC (Tên tĩnh, Avatar, Chức danh) */}
                        <td className="py-2.5 px-2.5">
                          <div className="flex items-start gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 font-bold text-white text-xs shadow-2xs shrink-0 mt-0.5">
                              {spec.avatarInitial}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs leading-snug break-words">
                                {spec.vietnameseName}
                              </p>
                              <p className="text-[10.5px] text-slate-500 font-medium leading-snug break-words mt-0.5" title={spec.title}>
                                {spec.title}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 3. Đơn Vị */}
                        <td className="py-2.5 px-2">
                          <div className="flex items-start gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="font-semibold text-slate-800 text-xs break-words leading-snug">
                              {spec.companyName}
                            </span>
                          </div>
                        </td>

                        {/* 4. Dịch Vụ: Dạng [Nhóm / Loại hàng / Mô hình] */}
                        <td className="py-2.5 px-2">
                          <div className="flex flex-wrap gap-1">
                            {declaredBadges.map((badge, bIdx) => (
                              <span
                                key={bIdx}
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold border tracking-tight leading-tight ${badge.badgeClass}`}
                              >
                                {badge.fullText}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 5. Lượt Xem */}
                        <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-bold text-indigo-800 bg-indigo-50/80 px-1.5 py-0.5 rounded-md border border-indigo-100 text-[10.5px]">
                            <Eye className="h-3 w-3 text-indigo-600 shrink-0" />
                            {(viewsCountMap[spec.id] ?? (spec.profileViews || 14820)).toLocaleString('vi-VN')}
                          </span>
                        </td>

                        {/* 6. Yêu Cầu Báo Giá */}
                        <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {(spec.viewerInteractions?.rfqRequestsCount || 180).toLocaleString('vi-VN')} yêu cầu
                          </span>
                        </td>

                        {/* 7. Số Báo Giá */}
                        <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            {(spec.keyMetrics.quotesCount || 150).toLocaleString('vi-VN')} báo giá
                          </span>
                        </td>

                        {/* 8. Số Đơn Hàng */}
                        <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            {(spec.keyMetrics.ordersCount || 95).toLocaleString('vi-VN')} đơn hàng
                          </span>
                        </td>

                        {/* 9. Giá Trị */}
                        <td className="py-2.5 px-2 text-right whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="text-[12px] font-black text-emerald-700 block tracking-tight">
                              {managedRevenue}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 block">
                              Quản lý doanh số
                            </span>
                          </div>
                        </td>

                        {/* 10. Đánh Giá */}
                        <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 font-bold text-slate-900 bg-amber-50/50 px-1.5 py-0.5 rounded-md border border-amber-200/60 text-[10.5px]">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{spec.rating}</span>
                            <span className="text-[9.5px] text-slate-400 font-normal">({spec.reviewsCount || 120})</span>
                          </div>
                        </td>

                        {/* 11. Thao Tác */}
                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleOpenDetail(spec.id)}
                            className="inline-flex items-center justify-center gap-0.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition-all border border-indigo-200/80 hover:border-indigo-600 shadow-2xs cursor-pointer"
                          >
                            <span>Xem Profile</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Summary Footer (Chuẩn 1:1 LeadBoard Style) */}
            <div className="px-4 py-3 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 select-none">
              <div className="flex items-center gap-2">
                <span>
                  Đang hiển thị <strong className="font-bold text-slate-900">{((safeCurrentPage - 1) * pageSize) + 1} - {Math.min(safeCurrentPage * pageSize, sortedSpecialists.length)}</strong> trên tổng <strong className="font-bold text-slate-900">{sortedSpecialists.length}</strong> chuyên viên
                </span>
              </div>

              {/* Page navigation controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Trang đầu"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[28px] h-7 px-2 text-xs font-bold rounded-lg transition-colors ${
                      safeCurrentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Trang sau"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Trang cuối"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={5}>5 dòng / trang</option>
                  <option value={10}>10 dòng / trang</option>
                  <option value={20}>20 dòng / trang</option>
                  <option value={50}>50 dòng / trang</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
