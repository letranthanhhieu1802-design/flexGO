import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Trophy, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Globe, 
  Globe2,
  Anchor,
  Compass,
  DollarSign, 
  Clock, 
  Truck, 
  Ship, 
  Plane, 
  Warehouse, 
  FileText, 
  Snowflake, 
  TrendingUp, 
  Check, 
  X, 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Layers, 
  Tag, 
  AlertCircle, 
  HelpCircle, 
  Share2, 
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  FileCheck
} from 'lucide-react';
import { 
  SalesSpecialistProfile, 
  CurrentView, 
  ServiceType,
  InternationalTradeLaneRegion
} from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { 
  MAIN_INTERNATIONAL_TRADE_LANES, 
  POL_VIETNAM_PORTS, 
  ALL_SHIPPING_LINES,
  POPULAR_POD_BY_REGION 
} from '../../data/tradeLanesData';
import { SupplierProfileDetailPage } from '../public/SupplierProfileDetailPage';
import { SupplierServiceCapabilityModal } from './SupplierServiceCapabilityModal';
import { 
  StudioTemplateConfig, 
  SalemanPersonalProfile, 
  CompanyInfoProfile 
} from './studio/studioTypes';
import { 
  initialSalemanProfile, 
  initialCompanyProfile, 
  initialStudioConfig 
} from './studio/mockStudioData';
import { StudioToolbar } from './studio/StudioToolbar';
import { TemplateSelectorModal } from './studio/TemplateSelectorModal';
import { TabProfileTemplateRenderer } from './studio/TabProfileTemplateRenderer';
import { TabCompanyView } from './studio/TabCompanyView';
import { TabPerformanceReviews } from './studio/TabPerformanceReviews';

interface SupplierProfileEditPageProps {
  currentSpecialistId?: string;
  onNavigate: (view: CurrentView) => void;
  onSaveSuccess?: (updatedProfile: SalesSpecialistProfile) => void;
  initialTab?: 'profile' | 'company' | 'services' | 'performance';
}

export const SupplierProfileEditPage: React.FC<SupplierProfileEditPageProps> = ({
  currentSpecialistId = 'sales-minh-tran',
  onNavigate,
  onSaveSuccess,
  initialTab = 'profile',
}) => {
  // Mode: 'edit' (Editor UI) vs 'preview' (Live Customer View)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  // Active Tab inside Studio (4 core tabs)
  const [activeEditorTab, setActiveEditorTab] = useState<
    'profile' | 'company' | 'services' | 'performance'
  >(initialTab);

  // Studio Template Configuration State
  const [studioConfig, setStudioConfig] = useState<StudioTemplateConfig>(initialStudioConfig);

  // Saleman Personal Profile State (TopCV Style)
  const [salemanProfile, setSalemanProfile] = useState<SalemanPersonalProfile>(initialSalemanProfile);

  // Company Information State
  const [companyProfile, setCompanyProfile] = useState<CompanyInfoProfile>(initialCompanyProfile);

  // Template Selector Modal Visibility
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

  // Load initial specialist data
  const initialData = useMemo(() => {
    const found = mockSalesSpecialists.find((s) => s.id === currentSpecialistId);
    return found ? JSON.parse(JSON.stringify(found)) : JSON.parse(JSON.stringify(mockSalesSpecialists[0]));
  }, [currentSpecialistId]);

  // Profile Form State
  const [profile, setProfile] = useState<SalesSpecialistProfile>(initialData);

  // Status banners & feedback
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sub-items editing states
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editingRateCardIndex, setEditingRateCardIndex] = useState<number | null>(null);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState<number | null>(null);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);

  // New tag helper states
  const [newSpecialtyInput, setNewSpecialtyInput] = useState<string>('');
  const [newLanguageInput, setNewLanguageInput] = useState<string>('');
  const [newCertInput, setNewCertInput] = useState<string>('');

  // Rate Card Filters inside Editor
  const [rateCardCategoryFilter, setRateCardCategoryFilter] = useState<string>('ALL');
  const [rateCardTradeLaneFilter, setRateCardTradeLaneFilter] = useState<string>('ALL');

  // Save Handler
  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Sync studio data into the main profile
    const updatedProfile: SalesSpecialistProfile = {
      ...profile,
      name: salemanProfile.name,
      vietnameseName: salemanProfile.vietnameseName,
      title: salemanProfile.title,
      motto: salemanProfile.motto,
      bio: salemanProfile.bio,
      phone: salemanProfile.phone,
      email: salemanProfile.email,
      specialties: salemanProfile.specialties,
      languages: salemanProfile.languages,
      companyName: companyProfile.companyName,
      companyNameEn: companyProfile.companyNameEn,
      companyBio: companyProfile.companyBio,
      taxId: companyProfile.taxId,
      avatarUrl: salemanProfile.avatarUrl || profile.avatarUrl,
      avatarInitial: salemanProfile.avatarInitial || profile.avatarInitial,
    };
    setProfile(updatedProfile);

    // In-memory update of mockSalesSpecialists
    const index = mockSalesSpecialists.findIndex((s) => s.id === profile.id);
    if (index !== -1) {
      mockSalesSpecialists[index] = JSON.parse(JSON.stringify(updatedProfile));
    }

    if (onSaveSuccess) {
      onSaveSuccess(updatedProfile);
    }

    setIsSaved(true);
    setSaveToast('Đã lưu toàn bộ hồ sơ Saleman & Doanh nghiệp thành công!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveToast(null);
    }, 4000);
  };

  // Reset to original data
  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn hoàn tác mọi thay đổi chưa lưu?')) {
      const found = mockSalesSpecialists.find((s) => s.id === currentSpecialistId) || mockSalesSpecialists[0];
      setProfile(JSON.parse(JSON.stringify(found)));
      setSaveToast('Đã khôi phục dữ liệu gốc.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Helpers for array operations
  const handleAddSpecialty = () => {
    if (newSpecialtyInput.trim() && !profile.specialties.includes(newSpecialtyInput.trim())) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, newSpecialtyInput.trim()],
      });
      setNewSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    const updated = [...profile.specialties];
    updated.splice(index, 1);
    setProfile({ ...profile, specialties: updated });
  };

  const handleAddLanguage = () => {
    if (newLanguageInput.trim() && !profile.languages.includes(newLanguageInput.trim())) {
      setProfile({
        ...profile,
        languages: [...profile.languages, newLanguageInput.trim()],
      });
      setNewLanguageInput('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const updated = [...profile.languages];
    updated.splice(index, 1);
    setProfile({ ...profile, languages: updated });
  };

  const handleAddCert = () => {
    if (newCertInput.trim() && !profile.certifications.includes(newCertInput.trim())) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, newCertInput.trim()],
      });
      setNewCertInput('');
    }
  };

  const handleRemoveCert = (index: number) => {
    const updated = [...profile.certifications];
    updated.splice(index, 1);
    setProfile({ ...profile, certifications: updated });
  };

  // Service Capability Operations
  const handleSaveCapabilityServices = (declaredList: any[]) => {
    if (declaredList) {
      setProfile((prev) => ({
        ...prev,
        services: declaredList,
      }));
      setSaveToast(`Đã lưu ${declaredList.length} dịch vụ từ Cây Khai Báo Năng Lực!`);
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  const handleRemoveService = (index: number) => {
    if (window.confirm('Xóa dịch vụ này khỏi danh mục năng lực?')) {
      const updated = [...profile.services];
      updated.splice(index, 1);
      setProfile({ ...profile, services: updated });
      if (editingServiceIndex === index) setEditingServiceIndex(null);
    }
  };

  // Rate Card Operations
  const handleAddNewRateCard = () => {
    const newRate = {
      id: `rc-custom-${Date.now()}`,
      category: 'Trucking' as const,
      routeOrService: 'TP. Hồ Chí Minh ↔ Tuyến Mới',
      vehicleOrUnit: 'Xe tải 15 Tấn FTL',
      transitTime: '48 Giờ',
      benchmarkPriceVND: 35000000,
      benchmarkPriceDisplay: '35,000,000 VND',
      priceNotes: 'Đã bao gồm phí cầu đường, nhiên liệu BAF & 2 tài xế',
      includedPerks: ['GPS Live', 'Bảo hiểm hàng hóa', 'Hỗ trợ bốc xếp 2 đầu'],
      isPopular: false,
    };
    setProfile({
      ...profile,
      rateCard: [...profile.rateCard, newRate],
    });
    setEditingRateCardIndex(profile.rateCard.length);
  };

  const handleAddNewInternationalRateCard = (region: InternationalTradeLaneRegion = 'NorthAmerica') => {
    const regionNames: Partial<Record<InternationalTradeLaneRegion, { route: string; pod: string; priceUsd: number; time: string; line: string }>> = {
      NorthAmerica: { route: 'Cái Mép / Cát Lái ➔ Los Angeles (USLAX)', pod: 'Los Angeles (USLAX)', priceUsd: 2850, time: '16 - 18 Ngày', line: 'ONE / COSCO' },
      Asia: { route: 'Cát Lái ➔ Thượng Hải (CNSHA)', pod: 'Thượng Hải (CNSHA)', priceUsd: 290, time: '4 - 6 Ngày', line: 'SITC / Wanhai' },
      Europe: { route: 'Cái Mép ➔ Rotterdam (NLRTM)', pod: 'Rotterdam (NLRTM)', priceUsd: 3450, time: '24 - 27 Ngày', line: 'Maersk / MSC' },
      Oceania: { route: 'Cát Lái ➔ Sydney (AUMEL)', pod: 'Sydney (AUSYD)', priceUsd: 1450, time: '14 - 16 Ngày', line: 'ANL / CMA CGM' },
      Africa: { route: 'Cái Mép ➔ Durban (ZADUR)', pod: 'Durban (ZADUR)', priceUsd: 2950, time: '28 - 32 Ngày', line: 'MSC / PIL' },
      LatinAmerica: { route: 'Cái Mép ➔ Santos (BRSSZ)', pod: 'Santos (BRSSZ)', priceUsd: 3800, time: '35 - 40 Ngày', line: 'CMA CGM / Hapag-Lloyd' },
      MiddleEast: { route: 'Cát Lái ➔ Jebel Ali (AEJEA)', pod: 'Jebel Ali (AEJEA)', priceUsd: 1650, time: '14 - 17 Ngày', line: 'OOCL / Evergreen' },
      Domestic: { route: 'Cát Lái ➔ Hải Phòng', pod: 'Hải Phòng (VNHPH)', priceUsd: 350, time: '2 - 3 Ngày', line: 'VIMC / Biển Đông' },
    };

    const preset = (region && regionNames[region]) ? regionNames[region]! : regionNames.NorthAmerica!;
    const priceVnd = preset.priceUsd * 25450;

    const newRate = {
      id: `rc-intl-${Date.now()}`,
      category: 'Ocean' as const,
      tradeLaneRegion: region,
      shippingLine: preset.line,
      pol: 'Cảng Cái Mép (VNTCK) / Cát Lái',
      pod: preset.pod,
      usdPrice: preset.priceUsd,
      routeOrService: preset.route,
      vehicleOrUnit: "Container 40'HC FCL",
      transitTime: preset.time,
      benchmarkPriceVND: priceVnd,
      benchmarkPriceDisplay: `${priceVnd.toLocaleString('vi-VN')} VND`,
      priceNotes: 'Đã bao gồm BAF, LSS, CIC. Miễn phí 14 ngày Demurrage/Detention tại cảng đến.',
      includedPerks: ['Cam kết vỏ cont', 'Hỗ trợ VGM & SI', 'Khai báo hải quan e-Manifest', 'Bảo hiểm chỗ mùa cao điểm'],
      isPopular: true,
    };

    setProfile({
      ...profile,
      rateCard: [...profile.rateCard, newRate],
    });
    setEditingRateCardIndex(profile.rateCard.length);
  };

  const handleRemoveRateCard = (index: number) => {
    if (window.confirm('Xóa tuyến cước này khỏi bảng giá công khai?')) {
      const updated = [...profile.rateCard];
      updated.splice(index, 1);
      setProfile({ ...profile, rateCard: updated });
      if (editingRateCardIndex === index) setEditingRateCardIndex(null);
    }
  };

  // Achievement Operations
  const handleAddNewAchievement = () => {
    const newAch = {
      id: `ach-custom-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: 'Giải Thưởng / Dự Án Vận Tải Tiêu Biểu',
      organization: 'Cơ quan / Khách hàng trao tặng',
      description: 'Mô tả kết quả đạt được, quy mô dự án và giá trị mang lại cho chuỗi cung ứng...',
      badgeIcon: 'Trophy',
    };
    setProfile({
      ...profile,
      achievements: [...profile.achievements, newAch],
    });
    setEditingAchievementIndex(profile.achievements.length);
  };

  const handleRemoveAchievement = (index: number) => {
    const updated = [...profile.achievements];
    updated.splice(index, 1);
    setProfile({ ...profile, achievements: updated });
    if (editingAchievementIndex === index) setEditingAchievementIndex(null);
  };

  // Testimonial Operations
  const handleAddNewTestimonial = () => {
    const newTest = {
      id: `test-custom-${Date.now()}`,
      clientName: 'Nguyễn Văn A',
      clientRole: 'Giám Đốc Chuỗi Cung Ứng',
      clientCompany: 'Tập Đoàn Sản Xuất & XNK',
      avatarInitial: 'NA',
      rating: 5,
      date: 'Gần đây',
      routeHandled: 'Tuyến Bắc - Nam & Cát Lái',
      content: 'Dịch vụ chuyên nghiệp, giao hàng đúng hẹn và hỗ trợ chứng từ hải quan cực kỳ nhanh chóng.',
    };
    setProfile({
      ...profile,
      testimonials: [...profile.testimonials, newTest],
    });
    setEditingTestimonialIndex(profile.testimonials.length);
  };

  const handleRemoveTestimonial = (index: number) => {
    const updated = [...profile.testimonials];
    updated.splice(index, 1);
    setProfile({ ...profile, testimonials: updated });
    if (editingTestimonialIndex === index) setEditingTestimonialIndex(null);
  };

  // Filtered Rate Card list in Editor
  const filteredEditorRateCards = useMemo(() => {
    return profile.rateCard.filter((r) => {
      const matchCat = rateCardCategoryFilter === 'ALL' || r.category === rateCardCategoryFilter;
      const matchLane = 
        rateCardTradeLaneFilter === 'ALL' || 
        (r.tradeLaneRegion && r.tradeLaneRegion === rateCardTradeLaneFilter) ||
        (!r.tradeLaneRegion && rateCardTradeLaneFilter === 'Domestic');
      return matchCat && matchLane;
    });
  }, [profile.rateCard, rateCardCategoryFilter, rateCardTradeLaneFilter]);

  // =========================================================================
  // RENDER LIVE CUSTOMER VIEW PREVIEW
  // =========================================================================
  if (viewMode === 'preview') {
    return (
      <div className="min-h-screen bg-slate-100">
        {/* Render the actual Customer Detail Page Component with live profile data */}
        <SupplierProfileDetailPage
          specialistId={profile.id}
          overrideProfile={profile}
          salemanProfile={salemanProfile}
          companyProfile={companyProfile}
          studioConfig={studioConfig}
          onBackToDirectory={() => setViewMode('edit')}
          onSelectSpecialist={() => {}}
          onOpenCreateInquiry={() => {}}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  // =========================================================================
  // RENDER SUPPLIER PROFILE EDITOR
  // =========================================================================
  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Thành công</div>
            <div className="text-xs text-slate-300">{saveToast}</div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span 
          className="cursor-pointer hover:text-indigo-600 transition-colors" 
          onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
        >
          Supplier Workspace
        </span>
        <span>/</span>
        <span className="font-semibold text-slate-700">Hồ Sơ Năng Lực</span>
        <span>/</span>
        <span className="text-indigo-600 font-bold">Profile Studio</span>
      </div>

      {/* Studio TopCV Toolbar */}
      <StudioToolbar
        config={studioConfig}
        onChangeConfig={setStudioConfig}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onPreview={() => setViewMode('preview')}
        onSave={() => handleSaveProfile()}
        onReset={handleReset}
        activeEditorTab={activeEditorTab}
      />

      {/* Editor Navigation Tabs (4 Core Studio Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs scrollbar-thin">
        {[
          { id: 'profile', label: '1. Hồ Sơ Chuyên Viên (My Profile)', icon: User, count: null },
          { id: 'company', label: '2. Pháp Nhân & Doanh Nghiệp (My Company)', icon: Building2, count: null },
          { id: 'services', label: '3. Danh Mục Dịch Vụ & Bảng Cước', icon: Truck, count: profile.services.length },
          { id: 'performance', label: '4. Chỉ Số Hiệu Suất & Đánh Giá (Reviews)', icon: TrendingUp, count: 142 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeEditorTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveEditorTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                  isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: SALEMAN PERSONAL PROFILE (TOPCV STUDIO TEMPLATE ENGINE)
      ========================================================================= */}
      {activeEditorTab === 'profile' && (
        <TabProfileTemplateRenderer
          profile={salemanProfile}
          onChangeProfile={setSalemanProfile}
          config={studioConfig}
          isReadOnly={false}
        />
      )}

      {/* =========================================================================
          TAB 2: COMPANY INFORMATION & CREDENTIALS
      ========================================================================= */}
      {activeEditorTab === 'company' && (
        <TabCompanyView
          company={companyProfile}
          onChangeCompany={setCompanyProfile}
          config={studioConfig}
          isReadOnly={false}
        />
      )}

      {/* =========================================================================
          TAB 3: SERVICES & PRICING (INLINE FULL CAPABILITY TREE)
      ========================================================================= */}
      {activeEditorTab === 'services' && (
        <div className="space-y-6">
          <SupplierServiceCapabilityModal
            isInline={true}
            onSave={handleSaveCapabilityServices}
            existingServices={profile.services}
          />
        </div>
      )}

      {/* =========================================================================
          TAB 4: PERFORMANCE METRICS & CLIENT TESTIMONIALS
      ========================================================================= */}
      {activeEditorTab === 'performance' && (
        <TabPerformanceReviews config={studioConfig} />
      )}

      {/* TopCV Style Template Selector Modal */}
      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        activeTab={activeEditorTab === 'company' ? 'company' : 'profile'}
        selectedTemplateId={studioConfig.activeTemplateId}
        onSelectTemplate={(tplId) => {
          setStudioConfig((prev) => ({ ...prev, activeTemplateId: tplId }));
        }}
        selectedCompanyTemplateId={studioConfig.activeCompanyTemplateId || 'corporate-flagship'}
        onSelectCompanyTemplate={(cTplId) => {
          setStudioConfig((prev) => ({ ...prev, activeCompanyTemplateId: cTplId }));
        }}
        selectedThemeColor={studioConfig.themeColor}
        onSelectThemeColor={(cId) => {
          setStudioConfig((prev) => ({ ...prev, themeColor: cId }));
        }}
      />
    </div>
  );
};
