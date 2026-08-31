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

interface SupplierProfileEditPageProps {
  currentSpecialistId?: string;
  onNavigate: (view: CurrentView) => void;
  onSaveSuccess?: (updatedProfile: SalesSpecialistProfile) => void;
}

export const SupplierProfileEditPage: React.FC<SupplierProfileEditPageProps> = ({
  currentSpecialistId = 'sales-minh-tran',
  onNavigate,
  onSaveSuccess,
}) => {
  // Mode: 'edit' (Editor UI) vs 'preview' (Live Customer View)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  // Active Tab inside Editor
  const [activeEditorTab, setActiveEditorTab] = useState<
    'basic' | 'metrics' | 'services' | 'rateCard' | 'achievements' | 'certifications' | 'testimonials'
  >('basic');

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
    
    // In-memory update of mockSalesSpecialists
    const index = mockSalesSpecialists.findIndex((s) => s.id === profile.id);
    if (index !== -1) {
      mockSalesSpecialists[index] = JSON.parse(JSON.stringify(profile));
    }

    if (onSaveSuccess) {
      onSaveSuccess(profile);
    }

    setIsSaved(true);
    setSaveToast('Đã lưu và cập nhật hồ sơ hiển thị công khai thành công!');
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

  // Capability Modal State
  const [isCapabilityModalOpen, setIsCapabilityModalOpen] = useState<boolean>(false);

  // Service Portfolio Operations
  const handleAddNewService = () => {
    setIsCapabilityModalOpen(true);
  };

  const handleSaveCapabilityServices = (declaredList: any[]) => {
    if (declaredList && declaredList.length > 0) {
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
        {/* Floating Preview Controller Bar */}
        <div className="sticky top-16 z-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-6 py-3 border-b border-indigo-500/30 shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Customer Preview Mode</span>
            </span>
            <p className="text-xs text-slate-300 hidden sm:block">
              Đây là giao diện 100% thực tế mà Khách hàng doanh nghiệp (Customer) nhìn thấy khi xem hồ sơ chi tiết của bạn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('edit')}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
              <span>Quay Lại Chỉnh Sửa (Edit Profile)</span>
            </button>
            <button
              onClick={() => handleSaveProfile()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu & Xuất Bản Hồ Sơ</span>
            </button>
          </div>
        </div>

        {/* Render the actual Customer Detail Page Component with live profile data */}
        <SupplierProfileDetailPage
          specialistId={profile.id}
          overrideProfile={profile}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span 
              className="cursor-pointer hover:text-indigo-600" 
              onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
            >
              Supplier Workspace
            </span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Hồ Sơ Năng Lực</span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">Cập Nhật Profile & Bảng Cước</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600" />
            <span>Quản Lý & Đồng Bộ Hồ Sơ Nhà Vận Tải (Supplier Profile Studio)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa toàn diện thông tin chuyên viên, năng lực đội xe, bảng cước chuẩn, cam kết SLA và thành tích theo đúng bố cục hiển thị cho Khách hàng xem.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Hoàn tác thay đổi"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Khôi Phục</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Xem Trước Như Khách Hàng Thấy (Live Preview)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveProfile()}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Lưu & Công Khai Hồ Sơ</span>
          </button>
        </div>
      </div>

      {/* Verification & Live Visibility Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900/40 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4.5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0 border-2 border-indigo-300/30">
            {profile.avatarInitial || 'VT'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-black text-white">{profile.name}</h2>
              <span className="text-sm text-indigo-200 font-medium">({profile.vietnameseName})</span>
              <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Supplier</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                profile.onlineStatus === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300'
              }`}>
                ● {profile.onlineStatus}
              </span>
            </div>
            <p className="text-xs text-indigo-200 font-semibold mt-1 flex items-center gap-2">
              <span>{profile.title}</span>
              <span>•</span>
              <span className="text-white font-bold">{profile.companyName}</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{profile.phone}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-300" />
                <span>{profile.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white">{profile.rating}</span>
                <span>({profile.reviewsCount} Đánh giá)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Profile Traffic Statistics */}
        <div className="flex items-center gap-3 sm:gap-6 bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Lượt Xem Hồ Sơ</span>
            <div className="text-lg font-black text-white mt-0.5">{(profile.profileViews || 14820).toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +28.4% tháng này
            </span>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Yêu Cầu RFQ Nhận</span>
            <div className="text-lg font-black text-white mt-0.5">{profile.viewerInteractions?.rfqRequestsCount || 245}</div>
            <span className="text-[11px] text-indigo-300">Khách hàng kết nối</span>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Tải Bảng Giá</span>
            <div className="text-lg font-black text-white mt-0.5">{profile.viewerInteractions?.rateDownloadsCount || 890}</div>
            <span className="text-[11px] text-amber-300">Lượt tải PDF</span>
          </div>
        </div>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs scrollbar-thin">
        {[
          { id: 'basic', label: '1. Định Danh & Liên Hệ', icon: User, count: null },
          { id: 'metrics', label: '2. Chỉ Số Năng Lực (KPIs)', icon: TrendingUp, count: null },
          { id: 'services', label: '3. Danh Mục Dịch Vụ', icon: Truck, count: profile.services.length },
          { id: 'rateCard', label: '4. Bảng Cước & Tuyến Đường', icon: DollarSign, count: profile.rateCard.length },
          { id: 'achievements', label: '5. Thành Tích & Dự Án', icon: Trophy, count: profile.achievements.length },
          { id: 'certifications', label: '6. Chứng Chỉ Logistics', icon: ShieldCheck, count: profile.certifications.length },
          { id: 'testimonials', label: '7. Đánh Giá Khách Hàng', icon: Star, count: profile.testimonials.length },
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
                  ? 'bg-indigo-600 text-white shadow-sm'
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
          TAB 1: BASIC SPECIALIST & COMPANY IDENTITY
      ========================================================================= */}
      {activeEditorTab === 'basic' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>Thông Tin Định Danh Chuyên Viên & Doanh Nghiệp</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiển thị ở phần đầu trang hồ sơ chi tiết và trong danh bạ đại lý vận tải.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Công Khai (Public)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Hiển Thị (Display Name) *
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: Minh Tran"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Tiếng Việt Đầy Đủ
              </label>
              <input
                type="text"
                value={profile.vietnameseName}
                onChange={(e) => setProfile({ ...profile, vietnameseName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: Trần Văn Minh"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chức Danh / Vị Trí Đảm Nhiệm *
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: Senior Key Account Manager & Freight Director"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Doanh Nghiệp Logistics *
              </label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: VinaTrans Logistics JSC"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ký Hiệu Viết Tắt (Logo Initials)
              </label>
              <input
                type="text"
                value={profile.avatarInitial}
                onChange={(e) => setProfile({ ...profile, avatarInitial: e.target.value.toUpperCase() })}
                maxLength={4}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 uppercase"
                placeholder="VD: TM hoặc VT"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Trạng Thái Trực Tuyến (Live Status)
              </label>
              <select
                value={profile.onlineStatus}
                onChange={(e) => setProfile({ ...profile, onlineStatus: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ONLINE">ONLINE (Đang sẵn sàng phản hồi tức thì)</option>
                <option value="IN_MEETING">IN_MEETING (Đang họp / Khảo sát hiện trường)</option>
                <option value="OFFLINE">OFFLINE (Ngoại tuyến)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số Điện Thoại Hotline Trực Tiếp *
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: +84 (0) 908 123 456"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số Zalo Tư Vấn Nhanh
              </label>
              <input
                type="text"
                value={profile.zaloPhone}
                onChange={(e) => setProfile({ ...profile, zaloPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: 0908123456"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Doanh Nghiệp Nhận Báo Giá *
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: minh.tran@vinatranslogistics.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số Năm Kinh Nghiệm Trong Ngành
              </label>
              <input
                type="number"
                value={profile.yearsOfExperience}
                onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                min={1}
                max={40}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cam Kết Thời Gian Phản Hồi Báo Giá
              </label>
              <input
                type="text"
                value={profile.responseTime}
                onChange={(e) => setProfile({ ...profile, responseTime: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: < 15 Phút hoặc < 30 Phút"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa Bàn Phụ Trách & Trụ Sở Hoạt Động
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="VD: TP. Hồ Chí Minh, Bình Dương & Hà Nội"
              />
            </div>
          </div>

          {/* Slogan & Bio */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Khẩu Hiệu Kinh Doanh / Slogan Cam Kết (Motto)
              </label>
              <input
                type="text"
                value={profile.motto}
                onChange={(e) => setProfile({ ...profile, motto: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl italic font-bold text-indigo-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder='VD: "Tối ưu chi phí thực tế – Đảm bảo hành trình chuẩn xác từng giờ"'
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tiểu Sử Chuyên Môn & Giới Thiệu Năng Lực (Bio)
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-normal text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                placeholder="Giới thiệu kinh nghiệm, lĩnh vực chuyên môn sâu, thế mạnh đội xe và cam kết phục vụ khách hàng doanh nghiệp..."
              />
            </div>
          </div>

          {/* Specialties & Languages Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Specialties */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Chuyên Môn & Dịch Vụ Cốt Lõi (Specialties)</span>
                <span className="text-[10px] text-slate-500">{profile.specialties.length} thẻ</span>
              </label>
              
              <div className="flex flex-wrap gap-1.5">
                {profile.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSpecialtyInput}
                  onChange={(e) => setNewSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                  placeholder="Thêm chuyên môn mới..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
            </div>

            {/* Languages */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Ngôn Ngữ Giao Dịch & Hỗ Trợ (Languages)</span>
                <span className="text-[10px] text-slate-500">{profile.languages.length} ngôn ngữ</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {profile.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{lang}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newLanguageInput}
                  onChange={(e) => setNewLanguageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                  placeholder="Thêm ngôn ngữ (VD: Japanese N2)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: OPERATIONAL METRICS & KPIS
      ========================================================================= */}
      {activeEditorTab === 'metrics' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Chỉ Số Hiệu Suất & Năng Lực Vận Hành Thực Tế (Key Metrics)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các chỉ số uy tín hiển thị nổi bật dạng Scorecard trên trang hồ sơ chi tiết của bạn.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              Scorecard Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tổng Số Chuyến / TEUs Đã Xử Lý *
              </label>
              <input
                type="text"
                value={profile.keyMetrics.shipmentsCount}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    keyMetrics: { ...profile.keyMetrics, shipmentsCount: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900"
                placeholder="VD: 1,450+ TEUs / Chuyến"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Khẳng định quy mô vận tải</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Doanh Số / Trị Giá Hàng Hóa Quản Lý *
              </label>
              <input
                type="text"
                value={profile.keyMetrics.revenueManagedVND}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    keyMetrics: { ...profile.keyMetrics, revenueManagedVND: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-extrabold text-emerald-800"
                placeholder="VD: 92.5 Tỷ VND (~$3.8M)"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Năng lực xử lý tài chính an toàn</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tỷ Lệ Giao Hàng Đúng Hẹn (On-Time SLA) *
              </label>
              <input
                type="text"
                value={profile.keyMetrics.onTimeDeliveryRate}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    keyMetrics: { ...profile.keyMetrics, onTimeDeliveryRate: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-extrabold text-blue-800"
                placeholder="VD: 99.6%"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Cam kết chuẩn giờ hành trình</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số Lượng Khách Hàng Doanh Nghiệp Đang Phục Vụ
              </label>
              <input
                type="number"
                value={profile.keyMetrics.activeClientsCount}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    keyMetrics: { ...profile.keyMetrics, activeClientsCount: Number(e.target.value) },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-extrabold text-purple-900"
                min={1}
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Key Enterprise Accounts</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Điểm Đánh Giá Mức Độ Hài Lòng
              </label>
              <input
                type="text"
                value={profile.keyMetrics.satisfactionRate}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    keyMetrics: { ...profile.keyMetrics, satisfactionRate: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-extrabold text-amber-900"
                placeholder="VD: 4.95 / 5.0"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Đánh giá từ khách hàng thực tế</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thời Gian Phản Hồi RFQ Trung Bình (Phút)
              </label>
              <input
                type="number"
                value={profile.keyMetrics.rfqResponseAvgMins}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    keyMetrics: { ...profile.keyMetrics, rfqResponseAvgMins: Number(e.target.value) },
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-extrabold text-indigo-900"
                min={1}
                max={120}
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Tốc độ gửi báo giá chuẩn</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SERVICES & SOLUTIONS PORTFOLIO
      ========================================================================= */}
      {activeEditorTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>Danh Mục Dịch Vụ Logistics & Giải Pháp Cung Ứng ({profile.services.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khách hàng xem các thẻ dịch vụ này ở Tab "Dịch Vụ & Năng Lực" để hiểu rõ năng lực kỹ thuật và SLA.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddNewService}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Dịch Vụ Mới</span>
              </button>
            </div>

            {/* List of Services */}
            <div className="space-y-4 mt-6">
              {profile.services.map((srv, index) => {
                const isEditing = editingServiceIndex === index;
                return (
                  <div
                    key={srv.id || index}
                    className={`rounded-2xl border transition-all ${
                      isEditing
                        ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-500/20 p-6 shadow-md'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white p-5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold">
                          {srv.serviceType}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{srv.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingServiceIndex(isEditing ? null : index)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                            isEditing
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isEditing ? 'Đóng Chỉnh Sửa' : 'Chỉnh Sửa'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(index)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Xóa dịch vụ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preview summary when not editing */}
                    {!isEditing && (
                      <div className="mt-3 space-y-2 text-xs text-slate-600">
                        <p className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                          ★ {srv.highlight}
                        </p>
                        <p className="line-clamp-2">{srv.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-slate-500 pt-1">
                          <span>SLA: <strong className="text-slate-800">{srv.slaCommitment}</strong></span>
                          <span>•</span>
                          <span>Giá tham khảo: <strong className="text-indigo-900">{srv.pricingSummary}</strong></span>
                        </div>
                      </div>
                    )}

                    {/* Full Form Editor when editing */}
                    {isEditing && (
                      <div className="mt-5 space-y-4 pt-4 border-t border-indigo-200 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Loại Hình Dịch Vụ</label>
                            <select
                              value={srv.serviceType}
                              onChange={(e) => {
                                const updated = [...profile.services];
                                updated[index].serviceType = e.target.value as ServiceType;
                                setProfile({ ...profile, services: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                            >
                              <option value="Trucking">Trucking (Vận Tải Đường Bộ)</option>
                              <option value="Sea Freight (FCL)">Sea Freight (FCL Đường Biển)</option>
                              <option value="Sea Freight (LCL)">Sea Freight (LCL Hàng Lẻ)</option>
                              <option value="Air Freight">Air Freight (Hàng Không)</option>
                              <option value="Cold Chain">Cold Chain (Chuỗi Cung Ứng Lạnh)</option>
                              <option value="Warehousing">Warehousing (Kho Bãi & Hoàn Tất Đơn Hàng)</option>
                              <option value="Customs Clearance">Customs Clearance (Đại Lý Hải Quan)</option>
                              <option value="Cross-border">Cross-border (Xuyên Biên Giới GMS)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Dịch Vụ Hiển Thị</label>
                            <input
                              type="text"
                              value={srv.title}
                              onChange={(e) => {
                                const updated = [...profile.services];
                                updated[index].title = e.target.value;
                                setProfile({ ...profile, services: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Điểm Nổi Bật / Khác Biệt (Highlight Tag)</label>
                          <input
                            type="text"
                            value={srv.highlight}
                            onChange={(e) => {
                              const updated = [...profile.services];
                              updated[index].highlight = e.target.value;
                              setProfile({ ...profile, services: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-emerald-900"
                            placeholder="VD: Đội xe 240+ chiếc, 2 tài xế/xe, GPS hành trình & cảm biến nhiệt độ 24/7"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Mô Tả Chi Tiết Năng Lực & Giải Pháp</label>
                          <textarea
                            rows={2}
                            value={srv.description}
                            onChange={(e) => {
                              const updated = [...profile.services];
                              updated[index].description = e.target.value;
                              setProfile({ ...profile, services: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Đối Tượng & Mặt Hàng Phù Hợp (Suitable For)</label>
                            <input
                              type="text"
                              value={srv.suitableFor}
                              onChange={(e) => {
                                const updated = [...profile.services];
                                updated[index].suitableFor = e.target.value;
                                setProfile({ ...profile, services: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                              placeholder="VD: Hàng điện tử, linh kiện, FMCG, may mặc..."
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Cam Kết SLA & Chính Sách Bồi Thường</label>
                            <input
                              type="text"
                              value={srv.slaCommitment}
                              onChange={(e) => {
                                const updated = [...profile.services];
                                updated[index].slaCommitment = e.target.value;
                                setProfile({ ...profile, services: updated });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900"
                              placeholder="VD: Giao hàng đúng hẹn 99.6% | Bồi thường 100% nếu thất thoát"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Khung Giá Tóm Tắt Tham Khảo</label>
                          <input
                            type="text"
                            value={srv.pricingSummary}
                            onChange={(e) => {
                              const updated = [...profile.services];
                              updated[index].pricingSummary = e.target.value;
                              setProfile({ ...profile, services: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-indigo-900"
                            placeholder="VD: Từ 42,000,000 VND / chuyến xe 15T FTL HCMC - Hà Nội"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: RATE CARDS & ROUTE TARIFFS (INTERNATIONAL & DOMESTIC)
      ========================================================================= */}
      {activeEditorTab === 'rateCard' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Bảng Cước Chuẩn & Tuyến Quốc Tế / Nội Địa ({profile.rateCard.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khai báo giá cước theo 7 tuyến vận chuyển quốc tế chính (Bắc Mỹ, Châu Âu, Châu Á, v.v.) và tuyến nội địa để hiển thị công khai cho chủ hàng gửi RFQ.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddNewRateCard}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Truck className="w-4 h-4 text-slate-600" />
                  <span>+ Tuyến Nội Địa</span>
                </button>
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => handleAddNewInternationalRateCard('NorthAmerica')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Ship className="w-4 h-4" />
                    <span>+ Tuyến Quốc Tế</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Fast Template Quick Bar */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Thêm nhanh mẫu giá theo 7 Tuyến Vận Tải Quốc Tế Chính:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {MAIN_INTERNATIONAL_TRADE_LANES.map((lane) => (
                  <button
                    key={lane.id}
                    type="button"
                    onClick={() => handleAddNewInternationalRateCard(lane.id)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{lane.icon}</span>
                    <span>+ {lane.nameVi}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Trade Lane Filter Pills inside Editor */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Dịch vụ:</span>
                {['ALL', 'Ocean', 'Trucking', 'ColdChain', 'Air', 'Warehousing', 'Customs'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRateCardCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      rateCardCategoryFilter === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tất Cả' : cat === 'Ocean' ? 'Đường Biển (Ocean)' : cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Khu vực:</span>
                <button
                  type="button"
                  onClick={() => setRateCardTradeLaneFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    rateCardTradeLaneFilter === 'ALL'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tất Cả Khu Vực
                </button>
                {MAIN_INTERNATIONAL_TRADE_LANES.map((lane) => (
                  <button
                    key={lane.id}
                    type="button"
                    onClick={() => setRateCardTradeLaneFilter(lane.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      rateCardTradeLaneFilter === lane.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{lane.icon}</span>
                    <span>{lane.nameVi}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setRateCardTradeLaneFilter('Domestic')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    rateCardTradeLaneFilter === 'Domestic'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🇻🇳 Tuyến Nội Địa
                </button>
              </div>
            </div>

            {/* Rate Cards List */}
            <div className="space-y-4">
              {filteredEditorRateCards.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                  Không có tuyến cước nào phù hợp với bộ lọc hiện tại.
                </div>
              ) : (
                filteredEditorRateCards.map((rate, index) => {
                  const actualIndex = profile.rateCard.findIndex((r) => r.id === rate.id);
                  const isEditing = editingRateCardIndex === actualIndex;
                  const laneInfo = MAIN_INTERNATIONAL_TRADE_LANES.find(l => l.id === rate.tradeLaneRegion);

                  return (
                    <div
                      key={rate.id || index}
                      className={`rounded-2xl border transition-all ${
                        isEditing
                          ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 p-6 shadow-md'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white p-5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-bold text-[11px]">
                              {rate.category}
                            </span>
                            {rate.tradeLaneRegion && laneInfo && (
                              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300/60 text-[11px] font-bold rounded-md flex items-center gap-1">
                                <span>{laneInfo.icon}</span>
                                <span>{laneInfo.nameVi}</span>
                              </span>
                            )}
                            {rate.shippingLine && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold rounded-md">
                                Hãng: {rate.shippingLine}
                              </span>
                            )}
                            <h4 className="text-sm font-extrabold text-slate-900">{rate.routeOrService}</h4>
                            {rate.isPopular && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-full">
                                ★ Nổi Bật
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-3">
                            {rate.pol && <span>POL: <strong className="text-slate-700">{rate.pol}</strong></span>}
                            {rate.pod && <span>➔ POD: <strong className="text-slate-700">{rate.pod}</strong></span>}
                            <span>Loại: <strong>{rate.vehicleOrUnit}</strong></span>
                            <span>•</span>
                            <span>Thời gian: <strong>{rate.transitTime}</strong></span>
                            <span>•</span>
                            {rate.usdPrice ? (
                              <span className="text-emerald-700 font-extrabold text-sm">
                                ${rate.usdPrice.toLocaleString('en-US')} USD (~{rate.benchmarkPriceDisplay || `${rate.benchmarkPriceVND.toLocaleString('vi-VN')} VND`})
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-extrabold text-sm">
                                {rate.benchmarkPriceDisplay || `${rate.benchmarkPriceVND.toLocaleString()} VND`}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingRateCardIndex(isEditing ? null : actualIndex)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                              isEditing
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isEditing ? 'Đóng' : 'Khai Báo / Sửa'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRateCard(actualIndex)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Xóa tuyến"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Full Form Editor for Rate Card */}
                      {isEditing && (
                        <div className="mt-5 space-y-4 pt-4 border-t border-emerald-200 text-xs">
                          {/* Row 1: Category & Trade Lane Region */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Phân Loại Dịch Vụ</label>
                              <select
                                value={rate.category}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  updated[actualIndex].category = e.target.value as any;
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                              >
                                <option value="Ocean">Sea Freight (Đường Biển Quốc Tế)</option>
                                <option value="Trucking">Trucking (Đường Bộ Nội Địa)</option>
                                <option value="ColdChain">Cold Chain (Hàng Lạnh)</option>
                                <option value="Air">Air Freight (Hàng Không)</option>
                                <option value="Warehousing">Warehousing (Kho Bãi)</option>
                                <option value="Customs">Customs (Hải Quan)</option>
                                <option value="CrossBorder">CrossBorder (Xuyên Biên Giới)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Tuyến Quốc Tế (Trade Lane)</label>
                              <select
                                value={rate.tradeLaneRegion || ''}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  const val = e.target.value as InternationalTradeLaneRegion;
                                  updated[actualIndex].tradeLaneRegion = val || undefined;
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-emerald-900"
                              >
                                <option value="">-- Tuyến Nội Địa (Không thuộc Quốc tế) --</option>
                                {MAIN_INTERNATIONAL_TRADE_LANES.map((lane) => (
                                  <option key={lane.id} value={lane.id}>
                                    {lane.icon} {lane.nameVi} ({lane.nameEn})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Hãng Tàu / Hãng Vận Chuyển</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={rate.shippingLine || ''}
                                  onChange={(e) => {
                                    const updated = [...profile.rateCard];
                                    updated[actualIndex].shippingLine = e.target.value;
                                    setProfile({ ...profile, rateCard: updated });
                                  }}
                                  placeholder="VD: ONE, COSCO, Maersk, MSC..."
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                                />
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const updated = [...profile.rateCard];
                                      updated[actualIndex].shippingLine = e.target.value;
                                      setProfile({ ...profile, rateCard: updated });
                                    }
                                  }}
                                  value=""
                                  className="px-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 cursor-pointer"
                                  title="Chọn nhanh hãng tàu"
                                >
                                  <option value="">Chọn</option>
                                  {ALL_SHIPPING_LINES.map((line) => (
                                    <option key={line} value={line}>{line}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Row 2: POL & POD & Route Name */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Cảng Đi (POL - Port of Loading)</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={rate.pol || ''}
                                  onChange={(e) => {
                                    const updated = [...profile.rateCard];
                                    updated[actualIndex].pol = e.target.value;
                                    setProfile({ ...profile, rateCard: updated });
                                  }}
                                  placeholder="VD: Cảng Cái Mép, Cát Lái..."
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                                />
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const updated = [...profile.rateCard];
                                      updated[actualIndex].pol = e.target.value;
                                      setProfile({ ...profile, rateCard: updated });
                                    }
                                  }}
                                  value=""
                                  className="px-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 cursor-pointer"
                                  title="Chọn cảng VN phổ biến"
                                >
                                  <option value="">Chọn</option>
                                  {POL_VIETNAM_PORTS.map((port) => (
                                    <option key={port} value={port}>{port}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Cảng Đến (POD - Port of Discharge)</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={rate.pod || ''}
                                  onChange={(e) => {
                                    const updated = [...profile.rateCard];
                                    updated[actualIndex].pod = e.target.value;
                                    setProfile({ ...profile, rateCard: updated });
                                  }}
                                  placeholder="VD: Los Angeles (USLAX)..."
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                                />
                                {rate.tradeLaneRegion && POPULAR_POD_BY_REGION[rate.tradeLaneRegion] && (
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        const updated = [...profile.rateCard];
                                        updated[actualIndex].pod = e.target.value;
                                        setProfile({ ...profile, rateCard: updated });
                                      }
                                    }}
                                    value=""
                                    className="px-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-bold cursor-pointer"
                                    title="Chọn cảng đích theo khu vực"
                                  >
                                    <option value="">Gợi ý</option>
                                    {POPULAR_POD_BY_REGION[rate.tradeLaneRegion].map((p) => (
                                      <option key={p} value={p}>{p}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block font-bold text-slate-700">Tên Tuyến Hiển Thị</label>
                                {rate.pol && rate.pod && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...profile.rateCard];
                                      updated[actualIndex].routeOrService = `${rate.pol} ➔ ${rate.pod}`;
                                      setProfile({ ...profile, rateCard: updated });
                                    }}
                                    className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                                  >
                                    Tạo tự động
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={rate.routeOrService}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  updated[actualIndex].routeOrService = e.target.value;
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                              />
                            </div>
                          </div>

                          {/* Row 3: Unit, Transit time & Price USD / VND */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Loại Container / Phương Tiện</label>
                              <input
                                type="text"
                                value={rate.vehicleOrUnit}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  updated[actualIndex].vehicleOrUnit = e.target.value;
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                placeholder="VD: Cont 40'HC / Xe 15T"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Thời Gian Cam Kết</label>
                              <input
                                type="text"
                                value={rate.transitTime}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  updated[actualIndex].transitTime = e.target.value;
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                                placeholder="VD: 16 - 18 Ngày"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Giá Quốc Tế (USD)</label>
                              <input
                                type="number"
                                value={rate.usdPrice || ''}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  const usdVal = Number(e.target.value);
                                  updated[actualIndex].usdPrice = usdVal;
                                  if (usdVal > 0) {
                                    const vndVal = usdVal * 25450;
                                    updated[actualIndex].benchmarkPriceVND = vndVal;
                                    updated[actualIndex].benchmarkPriceDisplay = `${vndVal.toLocaleString('vi-VN')} VND`;
                                  }
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                placeholder="VD: 2850"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-emerald-700"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Đơn Giá Chuẩn (VND)</label>
                              <input
                                type="number"
                                value={rate.benchmarkPriceVND}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  const val = Number(e.target.value);
                                  updated[actualIndex].benchmarkPriceVND = val;
                                  updated[actualIndex].benchmarkPriceDisplay = `${val.toLocaleString('vi-VN')} VND`;
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                              />
                            </div>
                          </div>

                          {/* Row 4: Notes & Popular Checkbox */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block font-bold text-slate-700 mb-1">Ghi Chú Phụ Phí & Điều Khoản (Dem/Det, BAF, CIC...)</label>
                              <input
                                type="text"
                                value={rate.priceNotes}
                                onChange={(e) => {
                                  const updated = [...profile.rateCard];
                                  updated[actualIndex].priceNotes = e.target.value;
                                  setProfile({ ...profile, rateCard: updated });
                                }}
                                placeholder="VD: Đã gồm BAF, LSS, CIC. Miễn phí 14 ngày Dem/Det..."
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                              />
                            </div>

                            <div className="flex items-center gap-4 pt-5">
                              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                                <input
                                  type="checkbox"
                                  checked={rate.isPopular || false}
                                  onChange={(e) => {
                                    const updated = [...profile.rateCard];
                                    updated[actualIndex].isPopular = e.target.checked;
                                    setProfile({ ...profile, rateCard: updated });
                                  }}
                                  className="w-4 h-4 text-emerald-600 rounded"
                                />
                                <span>Tuyến Nổi Bật / Bán Chạy (Popular)</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ACHIEVEMENTS & CASE STUDIES
      ========================================================================= */}
      {activeEditorTab === 'achievements' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Thành Tích, Giải Thưởng & Dự Án Vận Tải Lớn ({profile.achievements.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xây dựng độ tin cậy tuyệt đối khi Khách hàng doanh nghiệp khảo sát năng lực nhà vận chuyển.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddNewAchievement}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Thành Tích Mới</span>
            </button>
          </div>

          <div className="space-y-4">
            {profile.achievements.map((ach, index) => {
              const isEditing = editingAchievementIndex === index;
              return (
                <div
                  key={ach.id || index}
                  className={`rounded-2xl border transition-all ${
                    isEditing
                      ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20 p-6 shadow-md'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white p-5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-md">
                            {ach.year}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{ach.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{ach.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingAchievementIndex(isEditing ? null : index)}
                        className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        {isEditing ? 'Đóng' : 'Chỉnh Sửa'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!isEditing && (
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed pl-13">
                      {ach.description}
                    </p>
                  )}

                  {isEditing && (
                    <div className="mt-5 space-y-4 pt-4 border-t border-amber-200 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Năm Đạt Được</label>
                          <input
                            type="text"
                            value={ach.year}
                            onChange={(e) => {
                              const updated = [...profile.achievements];
                              updated[index].year = e.target.value;
                              setProfile({ ...profile, achievements: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Thành Tích / Giải Thưởng</label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => {
                              const updated = [...profile.achievements];
                              updated[index].title = e.target.value;
                              setProfile({ ...profile, achievements: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Cơ Quan Cấp / Tổ Chức Trao Tặng</label>
                        <input
                          type="text"
                          value={ach.organization}
                          onChange={(e) => {
                            const updated = [...profile.achievements];
                            updated[index].organization = e.target.value;
                            setProfile({ ...profile, achievements: updated });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Mô Tả Kết Quả & Giá Trị Đạt Được</label>
                        <textarea
                          rows={2}
                          value={ach.description}
                          onChange={(e) => {
                            const updated = [...profile.achievements];
                            updated[index].description = e.target.value;
                            setProfile({ ...profile, achievements: updated });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: CERTIFICATIONS & COMPLIANCE
      ========================================================================= */}
      {activeEditorTab === 'certifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Chứng Chỉ Năng Lực & Giấy Phép Vận Tải Ngành ({profile.certifications.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiển thị với huy hiệu xác minh màu xanh lá cây tại phần cuối hồ sơ của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.certifications.map((cert, index) => (
              <div
                key={index}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-800">{cert}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(index)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 pt-4">
            <label className="block text-xs font-bold text-slate-900">Thêm Chứng Chỉ Mới</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCertInput}
                onChange={(e) => setNewCertInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCert())}
                placeholder="VD: ISO 14001:2015 Quản lý Môi trường hoặc Giấy phép Liên vận GMS..."
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Chứng Chỉ</span>
              </button>
            </div>

            {/* Quick suggested chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-400 font-semibold">Gợi ý nhanh:</span>
              {[
                'ISO 9001:2015',
                'AEO Customs Broker',
                'IATA Cargo Agent',
                'GDP Pharma Cold Chain',
                'FIATA Member',
                'VLA Member',
                'HACCP Certified',
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    if (!profile.certifications.includes(sug)) {
                      setProfile({
                        ...profile,
                        certifications: [...profile.certifications, sug],
                      });
                    }
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-700 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: CUSTOMER TESTIMONIALS
      ========================================================================= */}
      {activeEditorTab === 'testimonials' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Đánh Giá Từ Khách Hàng Doanh Nghiệp ({profile.testimonials.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiển thị ở Tab "Đánh Giá Từ Khách Hàng" với đầy đủ thông tin tên công ty và số sao.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddNewTestimonial}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Nhận Xét Mới</span>
            </button>
          </div>

          <div className="space-y-4">
            {profile.testimonials.map((test, index) => {
              const isEditing = editingTestimonialIndex === index;
              return (
                <div
                  key={test.id || index}
                  className={`rounded-2xl border transition-all ${
                    isEditing
                      ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20 p-6 shadow-md'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white p-5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center text-xs">
                        {test.avatarInitial || 'KH'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{test.clientName}</h4>
                          <span className="text-xs text-slate-400">• {test.clientRole}</span>
                        </div>
                        <p className="text-xs font-semibold text-indigo-700 mt-0.5">{test.clientCompany}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingTestimonialIndex(isEditing ? null : index)}
                        className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        {isEditing ? 'Đóng' : 'Sửa'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTestimonial(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="mt-3 text-xs text-slate-600 space-y-1 pl-13">
                      <p className="text-[11px] text-slate-400 font-medium">Tuyến đã phục vụ: <strong>{test.routeHandled}</strong></p>
                      <p className="italic">"{test.content}"</p>
                    </div>
                  )}

                  {isEditing && (
                    <div className="mt-5 space-y-4 pt-4 border-t border-amber-200 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tên Người Đánh Giá</label>
                          <input
                            type="text"
                            value={test.clientName}
                            onChange={(e) => {
                              const updated = [...profile.testimonials];
                              updated[index].clientName = e.target.value;
                              setProfile({ ...profile, testimonials: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Chức Vụ</label>
                          <input
                            type="text"
                            value={test.clientRole}
                            onChange={(e) => {
                              const updated = [...profile.testimonials];
                              updated[index].clientRole = e.target.value;
                              setProfile({ ...profile, testimonials: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tên Doanh Nghiệp Khách Hàng</label>
                          <input
                            type="text"
                            value={test.clientCompany}
                            onChange={(e) => {
                              const updated = [...profile.testimonials];
                              updated[index].clientCompany = e.target.value;
                              setProfile({ ...profile, testimonials: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-indigo-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tuyến Đường / Dịch Vụ Đã Phục Vụ</label>
                          <input
                            type="text"
                            value={test.routeHandled}
                            onChange={(e) => {
                              const updated = [...profile.testimonials];
                              updated[index].routeHandled = e.target.value;
                              setProfile({ ...profile, testimonials: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Đánh Giá (Số Sao 1 - 5)</label>
                          <select
                            value={test.rating}
                            onChange={(e) => {
                              const updated = [...profile.testimonials];
                              updated[index].rating = Number(e.target.value);
                              setProfile({ ...profile, testimonials: updated });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-amber-800"
                          >
                            <option value={5}>★★★★★ 5 Sao (Xuất sắc)</option>
                            <option value={4}>★★★★☆ 4 Sao (Rất tốt)</option>
                            <option value={3}>★★★☆☆ 3 Sao (Khá)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nội Dung Nhận Xét Của Khách Hàng</label>
                        <textarea
                          rows={2}
                          value={test.content}
                          onChange={(e) => {
                            const updated = [...profile.testimonials];
                            updated[index].content = e.target.value;
                            setProfile({ ...profile, testimonials: updated });
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl italic"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Sticky Floating Save Bar */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div className="flex items-center space-x-3 text-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white block">Tất Cả Dữ Liệu Hồ Sơ Được Đồng Bộ Theo Thời Gian Thực</span>
            <span className="text-slate-400 text-[11px]">Bấm Xem Trước để kiểm tra trải nghiệm khách hàng trước khi phát hành</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-indigo-300" />
            <span>Xem Trước (Preview)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveProfile()}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Lưu & Công Khai Hồ Sơ</span>
          </button>
        </div>
      </div>

      {/* Service Capability Tree Modal */}
      <SupplierServiceCapabilityModal
        isOpen={isCapabilityModalOpen}
        onClose={() => setIsCapabilityModalOpen(false)}
        onSave={handleSaveCapabilityServices}
        existingServices={profile.services}
      />
    </div>
  );
};
