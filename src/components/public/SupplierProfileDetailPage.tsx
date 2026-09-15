import React, { useState, useMemo, useEffect } from 'react';
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
  Receipt,
  FileText,
  FileCheck,
  Lock,
} from 'lucide-react';
import { CurrentView, SalesSpecialistProfile } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { 
  SalemanPersonalProfile, 
  StudioTemplateConfig, 
  THEME_COLOR_OPTIONS 
} from '../supplier/studio/studioTypes';
import { 
  initialSalemanProfile, 
  initialStudioConfig 
} from '../supplier/studio/mockStudioData';
import { TabProfileTemplateRenderer } from '../supplier/studio/TabProfileTemplateRenderer';
import { TabPerformanceReviews } from '../supplier/studio/TabPerformanceReviews';
import { SupplierDeclaredServicesView } from './supplier-profile/SupplierDeclaredServicesView';
import { SupplierProfilePricingTab } from './supplier-profile/SupplierProfilePricingTab';
import { SupplierServiceCapabilityModal } from '../supplier/SupplierServiceCapabilityModal';
import { PublicCompanyIdentityBanner } from '../supplier/studio/CompanyIdentityBanner';
import type { CompanyIdentityBannerData } from '../supplier/studio/CompanyIdentityBanner';

interface SupplierProfileDetailPageProps {
  specialistId: string;
  overrideProfile?: SalesSpecialistProfile;
  salemanProfile?: SalemanPersonalProfile;
  companyIdentityBanner?: CompanyIdentityBannerData;
  studioConfig?: StudioTemplateConfig;
  onBackToDirectory: () => void;
  onSelectSpecialist: (id: string) => void;
  onOpenCreateInquiry: () => void;
  onNavigate: (view: CurrentView) => void;
  fromView?: string;
  supplierId?: string;
  initialTab?: 'profile' | 'services' | 'performance' | 'contract';
  hasFlexGoAccount?: boolean;
  supplierName?: string;
  supplierTaxId?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export const SupplierProfileDetailPage: React.FC<SupplierProfileDetailPageProps> = ({
  specialistId,
  overrideProfile,
  salemanProfile,
  companyIdentityBanner,
  studioConfig,
  onBackToDirectory,
  onSelectSpecialist,
  onOpenCreateInquiry,
  onNavigate,
  fromView,
  supplierId,
  initialTab,
  hasFlexGoAccount,
  supplierName,
  supplierTaxId,
  contactPerson,
  contactPhone,
  contactEmail,
}) => {
  const isOfflineSupplier = hasFlexGoAccount === false;
  const effectiveOfflineName = supplierName || companyIdentityBanner?.companyName || 'Nhà Cung Cấp Mới';
  const effectiveOfflineTaxId = supplierTaxId;
  const effectiveOfflineContact = contactPerson || salemanProfile?.vietnameseName;
  const effectiveOfflinePhone = contactPhone || salemanProfile?.phone;
  const effectiveOfflineEmail = contactEmail || salemanProfile?.email;

  // 4 Profile Tabs:
  // 1. 'profile' (1. Hồ Sơ Chuyên Viên)
  // 2. 'services' (2. Danh Mục Dịch Vụ & Bảng Cước)
  // 3. 'performance' (3. Chỉ Số Hiệu Suất & Đánh Giá)
  // 4. 'contract' (4. Hợp Đồng & Biểu Giá Riêng - Private Customer Tariff)
  const [activeMainTab, setActiveMainTab] = useState<'profile' | 'services' | 'performance' | 'contract'>(
    isOfflineSupplier ? 'contract' : (initialTab || 'profile')
  );

  useEffect(() => {
    if (isOfflineSupplier) {
      setActiveMainTab('contract');
    } else if (initialTab) {
      setActiveMainTab(initialTab);
    }
  }, [initialTab, isOfflineSupplier, specialistId, supplierId]);

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

  const effectiveCompanyName = companyIdentityBanner?.companyName || activeSpecialist.companyName;

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

  // Effective Key for Private Contract between this Customer and this Supplier
  const effectiveSupplierKey = supplierId || specialistId || 'default';
  const effectiveContractStorageKey = `customer_private_contract_${effectiveSupplierKey}`;

  const [customerContractServices, setCustomerContractServices] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(effectiveContractStorageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    // Default initial contract services tailored for contract context
    return [
      {
        id: 'srv-trk-gen-ftl',
        modelCode: 'FTL',
        title: 'Đường bộ - Hàng thường - FTL',
        description: 'Đội xe hợp đồng phân bổ ưu tiên 20 xe tải 5T - 15T',
        highlight: 'Cam kết giao hàng đúng hẹn 99.8%, bồi thường 100% rủi ro mất mát',
        freeSurcharges: ['Phí cầu đường BOT toàn tuyến', 'Định vị GPS hành trình 24/7'],
        paidSurcharges: [
          { id: 'psc-1', name: 'Phí bốc xếp 2 đầu bến bãi', priceText: '400,000 ₫ / Điểm', isChecked: true },
          { id: 'psc-2', name: 'Phí lưu đêm xe quá 12h', priceText: '600,000 ₫ / Đêm', isChecked: false },
        ],
        routes: [
          {
            id: 'r-ctr-1',
            routeCode: 'CTR-FTL-001',
            route: 'TP.HCM ⇄ Bình Dương / Đồng Nai',
            origin: 'KCN Tân Bình (TP.HCM)',
            destination: 'KCN VSIP 1 (Bình Dương)',
            vehicleType: 'Xe tải thùng kín 8.0T',
            pricingUnit: 'Chuyến',
            price: 2600000,
            currency: 'VND',
            sla: '3 - 5 giờ',
            pricingStyle: 'All-in',
            validUntil: '2026-12-31',
            promotionPercent: 0,
          },
          {
            id: 'r-ctr-2',
            routeCode: 'CTR-FTL-002',
            route: 'TP.HCM ⇄ Hà Nội',
            origin: 'Kho Hub Bình Tân (TP.HCM)',
            destination: 'KCN Thăng Long (Hà Nội)',
            vehicleType: 'Xe tải thùng kín 15.0T',
            pricingUnit: 'Chuyến',
            price: 27500000,
            currency: 'VND',
            sla: '48 - 52 giờ',
            pricingStyle: 'All-in',
            validUntil: '2026-12-31',
            promotionPercent: 5,
          },
        ],
      },
      {
        id: 'srv-rail-gen-fcl',
        modelCode: 'FCL',
        title: 'Đường sắt - Hàng thường - FCL',
        description: 'Cam kết 5 - 10 container đường sắt Bắc Nam/tuần',
        highlight: 'Tiết kiệm 30% chi phí so với đường bộ, đúng giờ 99%',
        freeSurcharges: ['Phí nâng hạ cont tại bãi ga', 'Theo dõi seal chì điện tử'],
        paidSurcharges: [
          { id: 'prail-1', name: 'Phí kéo container First-mile / Last-mile', priceText: '1,800,000 ₫ / Chuyến', isChecked: true },
        ],
        routes: [
          {
            id: 'r-rail-ctr-1',
            routeCode: 'CTR-RAIL-001',
            route: 'Ga Sóng Thần (Bình Dương) ⇄ Ga Giáp Bát / Yên Viên (Hà Nội)',
            origin: 'Ga Sóng Thần (Bình Dương)',
            destination: 'Ga Giáp Bát (Hà Nội)',
            vehicleType: 'Container 40ft High Cube (40HC)',
            pricingUnit: 'Cont',
            price: 18500000,
            currency: 'VND',
            sla: '55 - 65 giờ',
            pricingStyle: 'Ga - Ga',
            validUntil: '2026-12-31',
            promotionPercent: 0,
          },
        ],
      },
    ];
  });

  const handleSaveCustomerContractServices = (declaredList: any[]) => {
    setCustomerContractServices(declaredList);
    try {
      localStorage.setItem(effectiveContractStorageKey, JSON.stringify(declaredList));
      const existingRates = JSON.parse(localStorage.getItem('customer_custom_rates_list') || '[]');
      const newRateItems: any[] = [];
      declaredList.forEach((srv) => {
        (srv.routes || []).forEach((rt: any) => {
          newRateItems.push({
            id: `rate-ctr-${rt.id || Math.random().toString(36).substr(2, 6)}`,
            code: rt.routeCode || `CTR-${Math.floor(1000 + Math.random() * 9000)}`,
            serviceType: srv.serviceType || 'Trucking',
            title: `[Hợp đồng] ${rt.route || `${rt.origin} → ${rt.destination}`}`,
            origin: rt.origin,
            destination: rt.destination,
            routeDisplay: rt.route || `${rt.origin} → ${rt.destination}`,
            cargoType: srv.suitableFor || srv.cargoGroup || 'Hàng tiêu chuẩn hợp đồng',
            equipmentOrVehicleType: rt.vehicleType || 'Xe / Cont hợp đồng',
            loadType: srv.modelCode || 'FTL',
            baseRateAmount: rt.price || 0,
            baseRateCurrency: rt.currency || 'VND',
            pricingUnit: `${rt.currency || 'VND'} / ${rt.pricingUnit || 'Chuyến'}`,
            rateDisplay: `${(rt.price || 0).toLocaleString('vi-VN')} ${rt.currency || 'VND'} / ${rt.pricingUnit || 'Chuyến'}`,
            allInclusive: rt.pricingStyle === 'All-in',
            vatPercent: 8,
            supplierId: effectiveSupplierKey,
            supplierName: effectiveCompanyName,
            supplierContact: effectiveSalemanProfile.vietnameseName || activeSpecialist.vietnameseName,
            supplierPhone: effectiveSalemanProfile.phone || activeSpecialist.contactPhone,
            supplierEmail: effectiveSalemanProfile.email || activeSpecialist.contactEmail,
            contractCode: `HD-2026/${effectiveSupplierKey.toUpperCase()}`,
            sourceType: 'PRIVATE_CONTRACT',
            paymentTerms: 'Net 30 ngày',
            transitTime: rt.sla || 'Theo SLA cam kết',
            validFrom: '2026-01-01',
            validTo: rt.validUntil || '2026-12-31',
            status: 'Active',
            createdDate: new Date().toISOString().split('T')[0],
          });
        });
      });
      localStorage.setItem('customer_custom_rates_list', JSON.stringify([...newRateItems, ...existingRates.filter((r: any) => r.supplierId !== effectiveSupplierKey)]));
    } catch (e) {}

    setCopiedToast(`Đã lưu thành công biểu giá hợp đồng riêng với ${effectiveCompanyName}!`);
    setTimeout(() => setCopiedToast(null), 4000);
  };

  const contractRoutesCount = useMemo(() => {
    return customerContractServices.reduce((acc, s) => acc + (s.routes?.length || 0), 0);
  }, [customerContractServices]);

  return (
    <div id="supplier-profile-detail-page" className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 min-h-screen pb-24 text-slate-800 space-y-5 animate-in fade-in duration-200">
      
      {/* Toast Alert Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb Bar */}
      <div className="sticky top-0 z-30 border border-slate-200/90 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDirectory}
              id="back-to-directory-btn"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Quay Lại</span>
            </button>

            {isOfflineSupplier ? (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                <span>/</span>
                <span className="text-slate-600 font-medium">Nhà Cung Cấp Của Tôi</span>
                <span>/</span>
                <span className="font-bold text-slate-900">{effectiveOfflineName}</span>
                <span>/</span>
                <span className="text-amber-700 font-semibold">Hợp Đồng & Biểu Giá Riêng</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                <span>/</span>
                <span className="text-slate-600 font-medium">{activeSpecialist.companyName}</span>
                <span>/</span>
                <span className="font-bold text-slate-900">{activeSpecialist.vietnameseName}</span>
              </div>
            )}
          </div>

          {/* Quick Customer Action Buttons */}
          <div className="flex items-center gap-2">
            {!isOfflineSupplier ? (
              <>
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                {effectiveOfflinePhone && (
                  <a
                    href={`tel:${effectiveOfflinePhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/90 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Gọi {effectiveOfflinePhone}</span>
                  </a>
                )}
                {effectiveOfflineEmail && (
                  <a
                    href={`mailto:${effectiveOfflineEmail}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/90 hover:bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Gửi Email</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {companyIdentityBanner && !isOfflineSupplier && (
          <PublicCompanyIdentityBanner data={companyIdentityBanner} />
        )}

        {/* Offline Supplier Header Banner (Chỉ hiện khi nhà cung cấp chưa có tài khoản flexGO) */}
        {isOfflineSupplier && (
          <div className="rounded-2xl border border-amber-200/90 bg-linear-to-r from-amber-50/90 via-white to-orange-50/40 p-5 shadow-2xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                  {effectiveOfflineName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-base sm:text-lg font-black text-slate-900">
                      {effectiveOfflineName}
                    </h1>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-700" />
                      Đối Tác Ngoại Sàn (Chưa có tài khoản flexGO)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-1.5 text-xs text-slate-600">
                    {effectiveOfflineTaxId && (
                      <span className="flex items-center gap-1.5">
                        <span className="text-slate-400">MST:</span>
                        <strong className="font-mono text-slate-900 bg-amber-100/60 px-1.5 py-0.2 rounded border border-amber-200">{effectiveOfflineTaxId}</strong>
                      </span>
                    )}
                    {effectiveOfflineContact && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Người phụ trách: <strong className="text-slate-900">{effectiveOfflineContact}</strong></span>
                      </span>
                    )}
                    {effectiveOfflinePhone && (
                      <span className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SĐT/Zalo: <strong className="text-slate-900">{effectiveOfflinePhone}</strong></span>
                      </span>
                    )}
                    {effectiveOfflineEmail && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>Email: <strong className="text-slate-900">{effectiveOfflineEmail}</strong></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-slate-500 bg-white border border-amber-200 px-3 py-1.5 rounded-xl shadow-2xs">
                  Biểu giá hợp đồng nội bộ do bạn quản lý
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Primary public profile tabs */}
        {!isOfflineSupplier && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs scrollbar-thin">
            {[
              { id: 'profile', label: '1. PIC profile', icon: User },
              { id: 'services', label: '2. Services', icon: Truck },
              { id: 'performance', label: '3. PIC performance', icon: TrendingUp },
              ...(fromView === 'customer-suppliers' || activeMainTab === 'contract' ? [
                { 
                  id: 'contract', 
                  label: '4. Contract',
                  icon: FileCheck, 
                  isPrivate: true,
                }
              ] : []),
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMainTab(tab.id as typeof activeMainTab)}
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                      : tab.isPrivate
                      ? 'bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100/80 border border-indigo-200'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.isPrivate ? 'text-indigo-600' : 'text-slate-600'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            RENDER TABS IN PUBLIC / CUSTOMER VIEW MODE
           ========================================================================= */}
        <div className="pt-2">
          {/* TAB 1: Saleman Personal Profile (TopCV Style Template) */}
          {!isOfflineSupplier && activeMainTab === 'profile' && (
            <TabProfileTemplateRenderer
              profile={effectiveSalemanProfile}
              onChangeProfile={() => {}}
              config={effectiveStudioConfig}
              isReadOnly={true}
            />
          )}

          {/* TAB 2: Services & Benchmark Rates (Cây Danh Mục Năng Lực & Biểu Phí Đã Khai Báo) */}
          {!isOfflineSupplier && activeMainTab === 'services' && (
            <SupplierDeclaredServicesView
              services={activeSpecialist.services}
              companyName={effectiveCompanyName}
              specialistName={effectiveSalemanProfile.vietnameseName || activeSpecialist.vietnameseName}
              onOpenRFQForRate={handleOpenRFQForRate}
              onOpenConsult={() => setIsConsultModalOpen(true)}
              onDownloadRateSheet={handleDownloadRateSheet}
            />
          )}

          {/* TAB 3: Platform Performance Metrics & Reviews */}
          {!isOfflineSupplier && activeMainTab === 'performance' && (
            <TabPerformanceReviews
              config={effectiveStudioConfig}
            />
          )}

          {/* TAB 4: Hợp Đồng & Biểu Giá Riêng (Hiển thị khi activeMainTab === 'contract' hoặc là Offline Supplier) */}
          {(isOfflineSupplier || activeMainTab === 'contract') && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/90 via-white to-blue-50/60 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900">
                        Hợp Đồng & Biểu Giá Riêng: {effectiveOfflineName || effectiveCompanyName}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Bảo Mật Nội Bộ
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cam kết năng lực, điều khoản công nợ và biểu giá tuyến dưới đây là thỏa thuận riêng của bạn với nhà cung cấp này, được lưu trữ độc lập và tự động áp dụng khi tạo đơn/booking.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownloadRateSheet('contractTemplate')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tải Hợp Đồng Mẫu</span>
                  </button>
                </div>
              </div>

              <SupplierServiceCapabilityModal
                isInline={true}
                isCustomerContractMode={true}
                customTitle={`Khai Báo & Quản Lý Biểu Giá Hợp Đồng Riêng`}
                saveButtonText="Lưu Biểu Giá Hợp Đồng"
                existingServices={customerContractServices}
                onSave={handleSaveCustomerContractServices}
                supplierName={effectiveOfflineName || effectiveCompanyName}
              />
            </div>
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
