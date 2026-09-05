import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Truck, 
  TrendingUp, 
  Share2, 
  X, 
  Check, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  Send, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  MessageSquare,
  Receipt
} from 'lucide-react';
import { CurrentView, SalesSpecialistProfile } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { 
  SalemanPersonalProfile, 
  CompanyInfoProfile, 
  StudioTemplateConfig, 
  THEME_COLOR_OPTIONS 
} from '../supplier/studio/studioTypes';
import { 
  initialSalemanProfile, 
  initialCompanyProfile, 
  initialStudioConfig 
} from '../supplier/studio/mockStudioData';
import { TabProfileTemplateRenderer } from '../supplier/studio/TabProfileTemplateRenderer';
import { TabCompanyView } from '../supplier/studio/TabCompanyView';
import { TabPerformanceReviews } from '../supplier/studio/TabPerformanceReviews';
import { SupplierDeclaredServicesView } from './supplier-profile/SupplierDeclaredServicesView';
import { SupplierProfilePricingTab } from './supplier-profile/SupplierProfilePricingTab';

interface SupplierProfileDetailPageProps {
  specialistId: string;
  overrideProfile?: SalesSpecialistProfile;
  salemanProfile?: SalemanPersonalProfile;
  companyProfile?: CompanyInfoProfile;
  studioConfig?: StudioTemplateConfig;
  onBackToDirectory: () => void;
  onSelectSpecialist: (id: string) => void;
  onOpenCreateInquiry: () => void;
  onNavigate: (view: CurrentView) => void;
}

export const SupplierProfileDetailPage: React.FC<SupplierProfileDetailPageProps> = ({
  specialistId,
  overrideProfile,
  salemanProfile,
  companyProfile,
  studioConfig,
  onBackToDirectory,
  onSelectSpecialist,
  onOpenCreateInquiry,
  onNavigate,
}) => {
  // 4 Primary Profile Tabs declared by Saleman:
  // 1. 'profile' (1. Hồ Sơ Chuyên Viên)
  // 2. 'company' (2. Pháp Nhân & Doanh Nghiệp)
  // 3. 'services' (3. Danh Mục Dịch Vụ & Bảng Cước)
  // 4. 'performance' (4. Chỉ Số Hiệu Suất & Đánh Giá)
  const [activeMainTab, setActiveMainTab] = useState<'profile' | 'company' | 'services' | 'performance'>('profile');

  // Modals & Interactive RFQ
  const [isDirectRFQModalOpen, setIsDirectRFQModalOpen] = useState<boolean>(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState<boolean>(false);
  const [selectedRateItemForRFQ, setSelectedRateItemForRFQ] = useState<any | null>(null);

  // Toast notifications
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Active Specialist data
  const activeSpecialist = useMemo(() => {
    if (overrideProfile) return overrideProfile;
    return mockSalesSpecialists.find((s) => s.id === specialistId) || mockSalesSpecialists[0];
  }, [specialistId, overrideProfile]);

  // Synchronize with Saleman Studio Data if available, fallback to defaults
  const effectiveSalemanProfile = useMemo(() => {
    if (salemanProfile) return salemanProfile;
    return {
      ...initialSalemanProfile,
      vietnameseName: activeSpecialist.vietnameseName || initialSalemanProfile.vietnameseName,
      name: activeSpecialist.name || initialSalemanProfile.name,
      title: activeSpecialist.title || initialSalemanProfile.title,
      phone: activeSpecialist.contactPhone || initialSalemanProfile.phone,
      email: activeSpecialist.contactEmail || initialSalemanProfile.email,
    };
  }, [salemanProfile, activeSpecialist]);

  const effectiveCompanyProfile = useMemo(() => {
    if (companyProfile) return companyProfile;
    return {
      ...initialCompanyProfile,
      companyName: activeSpecialist.companyName || initialCompanyProfile.companyName,
    };
  }, [companyProfile, activeSpecialist]);

  const effectiveStudioConfig = studioConfig || initialStudioConfig;
  const activeTheme = THEME_COLOR_OPTIONS[effectiveStudioConfig.themeColor];

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToast(`Đã sao chép ${label}: ${text}`);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  // Download Rate Sheet PDF / Contract Template Mock Helper
  const handleDownloadRateSheet = (type: 'rateSheet' | 'contractTemplate') => {
    if (type === 'rateSheet') {
      setCopiedToast(`Đang tải file "Bang_Gia_Chuan_2026_${activeSpecialist.companyName.replace(/\s+/g, '_')}.pdf"...`);
    } else {
      setCopiedToast(`Đang tải file "Hop_Dong_Nguyen_Tac_Van_Chuyen_${activeSpecialist.companyName.replace(/\s+/g, '_')}.docx"...`);
    }
    setTimeout(() => setCopiedToast(null), 4000);
  };

  const handleOpenRFQForRate = (rateItem: any) => {
    setSelectedRateItemForRFQ(rateItem);
    setIsDirectRFQModalOpen(true);
  };

  const handleOpenRFQForService = (service: any) => {
    setSelectedRateItemForRFQ({
      routeOrService: `Dịch vụ: ${service.title} (${service.serviceType})`,
      category: service.serviceType,
      vehicleOrUnit: service.keySpecs?.[0] || 'Dịch vụ tiêu chuẩn',
      benchmarkPriceDisplay: service.pricingSummary || 'Báo giá theo yêu cầu'
    });
    setIsDirectRFQModalOpen(true);
  };

  return (
    <div id="supplier-profile-detail-page" className="min-h-screen bg-slate-50/60 pb-24 text-slate-800">
      
      {/* Toast Alert Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb Bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDirectory}
              id="back-to-directory-btn"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Quay Lại</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span>/</span>
              <span className="text-slate-600 font-medium">{activeSpecialist.companyName}</span>
              <span>/</span>
              <span className="font-bold text-slate-900">{activeSpecialist.vietnameseName}</span>
            </div>
          </div>

          {/* Quick Customer Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRateItemForRFQ(null);
                setIsDirectRFQModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Gửi RFQ Nhanh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsConsultModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden md:inline">Đặt Hẹn Tư Vấn</span>
            </button>

            <button
              onClick={() => handleCopy(window.location.href, 'Link hồ sơ')}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Chia sẻ hồ sơ này"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* =========================================================================
            4 PRIMARY PUBLIC TABS (MATCHING 4 STUDIO DECLARATION TABS)
            1. Hồ Sơ Chuyên Viên (Sales Specialist Profile)
            2. Pháp Nhân & Doanh Nghiệp (Company Landing Page)
            3. Danh Mục Dịch Vụ & Bảng Cước (Services & Benchmark Tariffs)
            4. Chỉ Số Hiệu Suất & Đánh Giá (Platform KPIs & Reviews)
           ========================================================================= */}
        <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-2 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            
            {/* Tab 1: Hồ Sơ Chuyên Viên (My Profile) */}
            <button
              onClick={() => setActiveMainTab('profile')}
              id="tab-profile"
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-2 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeMainTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className="h-4 w-4" />
              <span>1. Hồ Sơ Chuyên Viên</span>
            </button>

            {/* Tab 2: Pháp Nhân & Doanh Nghiệp (My Company) */}
            <button
              onClick={() => setActiveMainTab('company')}
              id="tab-company"
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-2 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeMainTab === 'company'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>2. Pháp Nhân Doanh Nghiệp</span>
            </button>

            {/* Tab 3: Danh Mục Dịch Vụ & Bảng Cước */}
            <button
              onClick={() => setActiveMainTab('services')}
              id="tab-services"
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-2 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeMainTab === 'services'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>3. Dịch Vụ & Bảng Cước</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeMainTab === 'services' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {activeSpecialist.services?.length || 6}
              </span>
            </button>

            {/* Tab 4: Chỉ Số & Đánh Giá */}
            <button
              onClick={() => setActiveMainTab('performance')}
              id="tab-performance"
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-2 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeMainTab === 'performance'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>4. Chỉ Số & Đánh Giá</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeMainTab === 'performance' ? 'bg-purple-800 text-purple-100' : 'bg-slate-200 text-slate-700'
              }`}>
                142
              </span>
            </button>

          </div>
        </div>

        {/* =========================================================================
            RENDER 4 TABS IN PUBLIC VIEW MODE (READ-ONLY)
           ========================================================================= */}
        <div className="pt-2">
          {/* TAB 1: Saleman Personal Profile (TopCV Style Template) */}
          {activeMainTab === 'profile' && (
            <TabProfileTemplateRenderer
              profile={effectiveSalemanProfile}
              onChangeProfile={() => {}}
              config={effectiveStudioConfig}
              isReadOnly={true}
            />
          )}

          {/* TAB 2: Company Landing Page (Corporate Template) */}
          {activeMainTab === 'company' && (
            <TabCompanyView
              company={effectiveCompanyProfile}
              onChangeCompany={() => {}}
              config={effectiveStudioConfig}
              isReadOnly={true}
            />
          )}

          {/* TAB 3: Services & Benchmark Rates (Cây Danh Mục Năng Lực & Biểu Phí Đã Khai Báo) */}
          {activeMainTab === 'services' && (
            <SupplierDeclaredServicesView
              services={activeSpecialist.services}
              companyName={effectiveCompanyProfile.companyName || activeSpecialist.companyName}
              specialistName={effectiveSalemanProfile.vietnameseName || activeSpecialist.vietnameseName}
              onOpenRFQForRate={handleOpenRFQForRate}
              onOpenConsult={() => setIsConsultModalOpen(true)}
              onDownloadRateSheet={handleDownloadRateSheet}
            />
          )}

          {/* TAB 4: Platform Performance Metrics & Reviews */}
          {activeMainTab === 'performance' && (
            <TabPerformanceReviews
              config={effectiveStudioConfig}
            />
          )}
        </div>

      </div>

      {/* =========================================================================
          MODAL: DIRECT RFQ SUBMISSION (GỬI YÊU CẦU BÁO GIÁ TRỰC TIẾP)
         ========================================================================= */}
      {isDirectRFQModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold">
                  {activeSpecialist.avatarInitial}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Gửi Yêu Cầu Báo Giá Đến {activeSpecialist.vietnameseName}
                  </h3>
                  <p className="text-xs text-slate-500">{activeSpecialist.title} • {activeSpecialist.companyName}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDirectRFQModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Đã gửi yêu cầu báo giá thành công đến ${activeSpecialist.vietnameseName}! Chuyên viên sẽ liên hệ và gửi quotation chi tiết qua Zalo/Email trong vòng 15 phút.`);
                setIsDirectRFQModalOpen(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              {selectedRateItemForRFQ && (
                <div className="rounded-xl bg-blue-50 p-3 border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-900 uppercase">Tuyến / Dịch vụ đang chọn:</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedRateItemForRFQ.routeOrService}</p>
                  <p className="text-slate-600 text-xs">Giá tham khảo: <strong className="text-blue-700">{selectedRateItemForRFQ.benchmarkPriceDisplay}</strong></p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên của bạn / Doanh nghiệp *</label>
                  <input
                    required
                    type="text"
                    defaultValue="ABC Manufacturing Co., Ltd."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại / Zalo nhận báo giá *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Địa điểm bốc hàng (Origin)</label>
                  <input
                    key={selectedRateItemForRFQ?.origin || 'origin-default'}
                    type="text"
                    placeholder="VD: KCN Tân Bình, TP.HCM"
                    defaultValue={selectedRateItemForRFQ?.origin || "KCN Tân Bình, TP. Hồ Chí Minh"}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa điểm giao hàng (Destination)</label>
                  <input
                    key={selectedRateItemForRFQ?.destination || 'dest-default'}
                    type="text"
                    placeholder="VD: KCN Thăng Long, Hà Nội"
                    defaultValue={selectedRateItemForRFQ?.destination || "KCN Thăng Long II, Hưng Yên"}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chi tiết loại hàng & Ghi chú bổ sung</label>
                <textarea
                  rows={3}
                  placeholder="Loại hàng, số lượng tấn/khối, yêu cầu nhiệt độ, ngày dự kiến bốc hàng..."
                  defaultValue="Lô hàng 15 tấn linh kiện điện tử, đóng trên pallet chuẩn, cần xe thùng kín 2 tài xế, bốc hàng ngày 25/08."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-[11px] text-emerald-600 font-semibold">
                  ⚡ Cam kết phản hồi báo giá trong &lt; 15 phút
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDirectRFQModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    Gửi Báo Giá Ngay
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BOOK 1:1 CONSULTATION (ĐẶT LỊCH HẸN TƯ VẤN)
         ========================================================================= */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Đặt Lịch Tư Vấn 1:1 Cùng {activeSpecialist.vietnameseName}
                </h3>
                <p className="text-xs text-slate-500">Tư vấn giải pháp tối ưu tuyến & cắt giảm 10-20% chi phí cước</p>
              </div>
              <button 
                onClick={() => setIsConsultModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Đã đặt lịch tư vấn thành công với ${activeSpecialist.vietnameseName}! Lời mời Google Meet và lịch hẹn đã được gửi đến email của bạn.`);
                setIsConsultModalOpen(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hình thức tư vấn</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-500 bg-blue-50/50 p-2 text-xs font-semibold text-blue-700 cursor-pointer">
                    <input type="radio" name="consultType" defaultChecked className="hidden" />
                    <span>Google Meet (Online)</span>
                  </label>
                  <label className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input type="radio" name="consultType" className="hidden" />
                    <span>Gọi Điện Thoại</span>
                  </label>
                  <label className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input type="radio" name="consultType" className="hidden" />
                    <span>Tại Văn Phòng</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chọn ngày hẹn</label>
                  <input
                    type="date"
                    defaultValue="2026-08-25"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khung giờ tiện nhất</label>
                  <select className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none">
                    <option>09:00 - 10:00 Sáng</option>
                    <option>10:30 - 11:30 Sáng</option>
                    <option>14:00 - 15:00 Chiều</option>
                    <option>15:30 - 16:30 Chiều</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chủ đề mong muốn trao đổi</label>
                <textarea
                  rows={2}
                  placeholder="VD: Cần tối ưu tuyến cước Bắc - Nam định kỳ 20 chuyến/tháng, điều khoản công nợ Net 45..."
                  defaultValue="Tư vấn giải pháp hợp đồng logistics dài hạn cho nhà máy điện tử, tuyến HCMC - Hà Nội."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Xác Nhận Đặt Hẹn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
