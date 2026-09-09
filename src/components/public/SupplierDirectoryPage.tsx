import React, { useState } from 'react';
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
  Activity
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

  const [displayMode, setDisplayMode] = useState<'gallery' | 'table'>('gallery');
  const filteredSpecialists = [...mockSalesSpecialists].sort((a, b) => b.rating - a.rating);

  // Handle open full detail
  const handleOpenDetail = (specialistId: string) => {
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
    <div id="supplier-directory-gallery-page" className="min-h-screen bg-slate-50/70 pb-20">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Danh bạ nhà cung cấp
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tổng hợp các đối tác uy tín và đáng tin cậy được flexGO xác nhận.
            </p>
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
      </section>

      <section className="border-b border-slate-200 bg-white py-3">
        <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setDisplayMode('gallery')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all ${
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
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all ${
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
      </section>

      {/* =========================================================================
          MAIN CONTENT AREA (SALESMAN-CENTRIC PIC GALLERY)
         ========================================================================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <p className="mb-6 text-xs text-slate-600">
          Tìm thấy <strong className="font-bold text-slate-900">{filteredSpecialists.length}</strong> chuyên viên kinh doanh & quản trị giải pháp logistics
        </p>

        {/* -----------------------------------------------------------------------
            MODE 1: SALESMAN-CENTRIC GALLERY CARDS (TRỌNG TÂM CÁ NHÂN PIC)
           ----------------------------------------------------------------------- */}
        {displayMode === 'gallery' && (
          <div className="mx-auto grid max-w-6xl auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8">
            {filteredSpecialists.map((specialist) => {
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
                    <dd className="text-right font-black text-slate-100">{specialist.profileViews?.toLocaleString('vi-VN') ?? '—'}</dd>
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
            MODE 2: COMPARATIVE TABLE VIEW (BẢNG SO SÁNH NĂNG LỰC CÁ NHÂN PIC)
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

    </div>
  );
};
