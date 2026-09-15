import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Truck, 
  Ship, 
  Plane, 
  Building2, 
  FileText, 
  ThermometerSnowflake, 
  Globe, 
  Clock, 
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Eye,
  FileSpreadsheet,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  DollarSign,
  TrendingDown,
  ArrowUpRight,
  Edit3,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Package,
  MapPin,
  FileCheck,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { 
  CustomerRateItem, 
  ServiceType, 
  RateStatus, 
  RateSourceType,
  CurrentView,
  SupplierCompany,
  InquiryItem,
  QuotationItem,
  HotPromotionItem
} from '../../types';
import { CreateOrEditRateModal } from './CreateOrEditRateModal';
import { InquirySummaryConfirmModal } from './InquirySummaryConfirmModal';
import { HotPromotionFullCostMatrixModal } from '../public/HotPromotionFullCostMatrixModal';

interface CustomerRatesPageProps {
  rates: CustomerRateItem[];
  suppliers?: SupplierCompany[];
  inquiries?: InquiryItem[];
  quotations?: QuotationItem[];
  onSaveRate: (rate: CustomerRateItem) => void;
  onDeleteRate: (rateId: string) => void;
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiryWithBenchmark?: (benchmarkData: any) => void;
}

export const CustomerRatesPage: React.FC<CustomerRatesPageProps> = ({
  rates,
  suppliers = [],
  inquiries = [],
  quotations = [],
  onSaveRate,
  onDeleteRate,
  onNavigate,
  onOpenCreateInquiryWithBenchmark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [expandedRateIds, setExpandedRateIds] = useState<Record<string, boolean>>({});
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<CustomerRateItem | null>(null);

  // Awarded RFQ 2-Tab Modal State
  const [selectedAwardedRate, setSelectedAwardedRate] = useState<CustomerRateItem | null>(null);
  const [isAwardedModalOpen, setIsAwardedModalOpen] = useState(false);

  // Hot Promotion Full Cost Matrix Modal State (for internal contract rates)
  const [selectedPromoForModal, setSelectedPromoForModal] = useState<HotPromotionItem | null>(null);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  const toggleExpandRate = (rateId: string) => {
    setExpandedRateIds((prev) => ({
      ...prev,
      [rateId]: !prev[rateId],
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingRate(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rate: CustomerRateItem) => {
    setEditingRate(rate);
    setIsModalOpen(true);
  };

  const handleOpenAwardedModal = (rate: CustomerRateItem) => {
    setSelectedAwardedRate(rate);
    setIsAwardedModalOpen(true);
  };

  const mapRateToPromotionItem = (rate: CustomerRateItem): HotPromotionItem => {
    let promoCat: any = 'Trucking';
    const st = (rate.serviceType || '').toLowerCase();
    if (st.includes('sea') || st.includes('biển') || st.includes('ocean')) promoCat = 'Sea Freight';
    else if (st.includes('air') || st.includes('không')) promoCat = 'Air Freight';
    else if (st.includes('cold') || st.includes('lạnh')) promoCat = 'Cold Chain';
    else if (st.includes('ware') || st.includes('kho')) promoCat = 'Warehousing';
    else if (st.includes('custom') || st.includes('quan')) promoCat = 'Customs';
    else if (st.includes('cross') || st.includes('biên')) promoCat = 'Cross-border';
    else if (st.includes('rail') || st.includes('sắt')) promoCat = 'Rail Freight';
    else if (st.includes('project') || st.includes('án')) promoCat = 'Project Cargo';

    return {
      id: rate.id,
      code: rate.code,
      title: rate.title,
      badgeType: 'HOT_ROUTE',
      badgeLabel: 'HĐ Nội Bộ',
      discountPercent: 0,
      originalPriceVND: rate.baseRateAmount || 0,
      originalPriceDisplay: rate.rateDisplay,
      promotionalPriceVND: rate.baseRateAmount || 0,
      promotionalPriceDisplay: rate.rateDisplay,
      pricingUnit: String(rate.pricingUnit || 'VND / Chuyến'),
      serviceType: rate.serviceType,
      category: promoCat,
      origin: rate.origin,
      destination: rate.destination,
      routeDisplay: rate.routeDisplay || `${rate.origin} → ${rate.destination}`,
      transitTime: rate.transitTime || 'Thỏa thuận',
      vehicleOrUnit: rate.equipmentOrVehicleType || 'Tiêu chuẩn',
      cargoSuitability: rate.cargoType,
      availableCapacity: rate.loadType || 'Sẵn sàng',
      specialistId: 'spec-internal',
      specialistName: rate.supplierContact || rate.supplierName,
      specialistVietnameseName: rate.supplierContact || rate.supplierName,
      specialistTitle: 'Đại diện Hợp đồng nội bộ',
      specialistAvatarInitial: (rate.supplierName || 'V').substring(0, 1).toUpperCase(),
      specialistPhone: rate.supplierPhone || '1900 6868',
      specialistRating: 5.0,
      specialistReviewsCount: 18,
      companyId: rate.supplierId || 'sup-internal',
      companyName: rate.supplierName,
      companyLogo: '',
      validFrom: rate.validFrom,
      validUntil: rate.validTo,
      daysRemaining: 180,
      slotsRemaining: 10,
      totalSlots: 10,
      paymentTerms: rate.paymentTerms,
      highlights: ['Hợp đồng nội bộ đã ký kết', 'Cam kết giữ biểu giá ổn định'],
      includedPerks: rate.surcharges?.filter((s) => s.includedInBaseRate).map((s) => s.name) || [],
      notes: rate.notes,
      viewsCount: 1,
      interestedCount: 1,
      bookedCount: 1,
      serviceGroup: rate.serviceType,
      calculatedPriceDisplay: rate.rateDisplay,
    };
  };

  const handleOpenMatrixModal = (rate: CustomerRateItem) => {
    const promoItem = mapRateToPromotionItem(rate);
    setSelectedPromoForModal(promoItem);
    setIsMatrixModalOpen(true);
  };

  // Find linked inquiry & quote for awarded modal
  const selectedAwardedInquiry = useMemo((): InquiryItem | null => {
    if (!selectedAwardedRate) return null;
    if (selectedAwardedRate.linkedInquiryCode) {
      const found = inquiries.find((i) => i.code === selectedAwardedRate.linkedInquiryCode);
      if (found) {
        return {
          ...found,
          awardedSupplierName: selectedAwardedRate.supplierName || found.awardedSupplierName,
        };
      }
    }

    // Synthesize realistic full inquiry if not directly found in inquiries array
    return {
      id: `inq-awarded-${selectedAwardedRate.id}`,
      code: selectedAwardedRate.linkedInquiryCode || `INQ-${selectedAwardedRate.code}`,
      leadCode: selectedAwardedRate.linkedInquiryCode || `INQ-${selectedAwardedRate.code}`,
      title: selectedAwardedRate.title || `Yêu cầu báo giá: ${selectedAwardedRate.origin} → ${selectedAwardedRate.destination}`,
      customerCompany: 'Công ty Cổ phần Prime Vận Tải',
      contactPerson: 'Đặng Tuấn Anh (Trưởng phòng Điều phối Logistics)',
      contactPhone: '0908 123 456',
      contactEmail: 'tuancustomer@primemfg.vn',
      serviceType: (selectedAwardedRate.serviceType as any) || 'Trucking',
      origin: selectedAwardedRate.origin,
      destination: selectedAwardedRate.destination,
      route: selectedAwardedRate.routeDisplay || `${selectedAwardedRate.origin} → ${selectedAwardedRate.destination}`,
      cargoType: selectedAwardedRate.cargoType || 'Hàng công nghiệp tiêu chuẩn',
      weightVolume: selectedAwardedRate.loadType || 'Nguyên chuyến',
      targetBudget: selectedAwardedRate.rateDisplay,
      expiryDate: selectedAwardedRate.validTo,
      pickupDate: selectedAwardedRate.validFrom,
      deliveryDate: selectedAwardedRate.validTo,
      createdDate: selectedAwardedRate.createdDate || '2026-08-31',
      quotationScope: selectedAwardedRate.allInclusive ? 'ALL_IN' : 'ITEMIZED',
      requestedSurcharges: selectedAwardedRate.surcharges?.map((s) => s.name) || [],
      selectedVAS: [],
      responsesCount: 1,
      viewsCount: 88,
      status: 'Awarded',
      awardedSupplierName: selectedAwardedRate.supplierName,
      pricingType: selectedAwardedRate.contractCode ? 'CONTRACT' : 'SPOT',
      description: selectedAwardedRate.notes || 'Hợp đồng trao thầu đã ký kết thành công trên hệ thống FlexGO.',
      serviceSpecs: selectedAwardedRate.specs,
    };
  }, [selectedAwardedRate, inquiries]);

  const selectedAwardedQuotation = useMemo(() => {
    if (!selectedAwardedRate) return null;
    return quotations.find(
      (q) =>
        (selectedAwardedRate.linkedQuoteId && q.id === selectedAwardedRate.linkedQuoteId) ||
        (selectedAwardedRate.linkedInquiryCode &&
          q.inquiryCode === selectedAwardedRate.linkedInquiryCode &&
          (q.status === 'Accepted' || q.supplierName === selectedAwardedRate.supplierName)) ||
        (selectedAwardedRate.linkedInquiryCode && q.inquiryCode === selectedAwardedRate.linkedInquiryCode)
    ) || null;
  }, [selectedAwardedRate, quotations]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = rates.length;
    const active = rates.filter((r) => r.status === 'Active').length;
    const expiringSoon = rates.filter((r) => r.status === 'ExpiringSoon').length;
    const expired = rates.filter((r) => r.status === 'Expired').length;
    const awardedCount = rates.filter((r) => r.sourceType === 'AWARDED_INQUIRY').length;
    const manualCount = rates.filter((r) => r.sourceType === 'MANUAL_ENTRY').length;

    return {
      total,
      active,
      expiringSoon,
      expired,
      awardedCount,
      manualCount,
    };
  }, [rates]);

  // Filtering
  const filteredRates = useMemo(() => {
    return rates.filter((rate) => {
      const matchesSearch =
        rate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rate.contractCode && rate.contractCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rate.linkedInquiryCode && rate.linkedInquiryCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesService = serviceFilter === 'ALL' || rate.serviceType === serviceFilter;
      const matchesStatus = statusFilter === 'ALL' || rate.status === statusFilter;
      const matchesSource = sourceFilter === 'ALL' || rate.sourceType === sourceFilter;

      return matchesSearch && matchesService && matchesStatus && matchesSource;
    });
  }, [rates, searchTerm, serviceFilter, statusFilter, sourceFilter]);

  // Helpers
  const getCargoGroup = (rate: CustomerRateItem) => {
    const text = `${rate.cargoType || ''} ${rate.title || ''} ${rate.serviceType || ''}`.toLowerCase();
    if (rate.serviceType === 'Cold Chain' || text.includes('lạnh') || text.includes('reefer') || text.includes('mát') || text.includes('thực phẩm tươi')) {
      return 'Hàng lạnh';
    }
    if (text.includes('nguy hiểm') || text.includes('hazmat') || text.includes('dg') || text.includes('hóa chất') || text.includes('pin')) {
      return 'Hàng nguy hiểm';
    }
    return 'Hàng thường';
  };

  const getOperationMode = (rate: CustomerRateItem) => {
    const sType = rate.serviceType;
    const text = `${rate.equipmentOrVehicleType || ''} ${rate.loadType || ''} ${rate.title || ''}`.toLowerCase();
    if (sType === 'Trucking' || sType === 'Cold Chain') {
      if (text.includes('ltl') || text.includes('hàng ghép') || text.includes('ghép')) return 'LTL';
      return 'FTL';
    }
    if (sType === 'Sea Freight (FCL)' || sType === 'Sea Freight (LCL)') {
      if (sType === 'Sea Freight (LCL)' || text.includes('lcl') || text.includes('gom lẻ')) return 'LCL';
      return 'FCL';
    }
    if (sType === 'Air Freight') {
      if (text.includes('express') || text.includes('hỏa tốc')) return 'Express';
      return 'Air Cargo';
    }
    if (sType === 'Warehousing') {
      if (text.includes('lạnh')) return 'Kho lạnh';
      if (text.includes('ngoại quan')) return 'Kho ngoại quan';
      return 'Kho thường';
    }
    if (sType === 'Customs Clearance') {
      if (text.includes('xuất')) return 'Xuất khẩu';
      return 'Nhập khẩu';
    }
    if (sType === 'Cross-border') {
      if (text.includes('ltl') || text.includes('ghép')) return 'LTL';
      return 'FTL';
    }
    return rate.loadType || 'FTL';
  };

  // Helper chia Đơn giá: Tiền ở trên và Đơn vị ở dưới
  const getRateDisplayParts = (rate: CustomerRateItem) => {
    if (rate.rateDisplay && rate.rateDisplay.includes('/')) {
      const slashIdx = rate.rateDisplay.indexOf('/');
      const amountPart = rate.rateDisplay.slice(0, slashIdx).trim();
      const unitPart = rate.rateDisplay.slice(slashIdx).trim();
      return { amountPart, unitPart };
    }

    const amountPart = rate.baseRateCurrency === 'USD'
      ? `$${rate.baseRateAmount.toLocaleString('en-US')}`
      : `${rate.baseRateAmount.toLocaleString('vi-VN')} ₫`;
    const cleanUnit = (rate.pricingUnit || '').replace(/^(VND|USD)\s*\/?\s*/i, '').trim();
    const unitPart = cleanUnit ? `/ ${cleanUnit}` : '';
    return { amountPart, unitPart };
  };

  // Helper lấy thông tin PIC/Nhà Cung Cấp: Tên Saleman ở trên, Tên công ty ở dưới
  const getPICSupplierInfo = (rate: CustomerRateItem) => {
    let picName = rate.supplierContact?.trim() || '';
    if (picName.includes('(') && picName.includes(')')) {
      const match = picName.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        picName = match[1].trim();
      }
    }
    if (!picName) {
      picName = 'Chuyên viên phụ trách';
    }

    return {
      picName,
      companyName: rate.supplierName || 'Nhà cung cấp',
    };
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'Trucking':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Ship className="w-4 h-4 text-cyan-600" />;
      case 'Air Freight':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'Cold Chain':
        return <ThermometerSnowflake className="w-4 h-4 text-emerald-600" />;
      case 'Warehousing':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'Customs Clearance':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'Cross-border':
        return <Globe className="w-4 h-4 text-orange-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: RateStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Đang Áp Dụng</span>
          </span>
        );
      case 'ExpiringSoon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Sắp Hết Hạn</span>
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Hết Hiệu Lực</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Bản Nháp</span>
          </span>
        );
    }
  };

  // Export mock CSV
  const handleExportCSV = () => {
    const headers = 'Mã Biểu Giá,Dịch Vụ,Tuyến Đường,Nhà Cung Cấp,Mức Cước,Đơn Vị Tính,All-in,Mã HĐ,Thời Hạn,Trạng Thái\n';
    const rows = filteredRates
      .map(
        (r) =>
          `"${r.code}","${r.serviceType}","${r.origin.split(',')[0]} → ${r.destination.split(',')[0]}","${r.supplierName}","${r.baseRateAmount}","${r.pricingUnit}","${r.allInclusive ? 'Có' : 'Không'}","${r.contractCode || ''}","${r.validFrom} - ${r.validTo}","${r.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FlexGO_Customer_Rates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200 space-y-5">
      {/* ========================================================= */}
      {/* 1. HERO HEADER BLOCK & KPI TILES (LeadBoard Dark Style) */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
              <span>Customer Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-400 font-bold">Logistics Rate Card & Price Master</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Rates
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Quản lý tập trung toàn bộ biểu giá cước logistics doanh nghiệp đang sử dụng. Lưu trữ giá hợp đồng nội bộ và đồng bộ tự động giá từ các gói trao thầu (Awarded RFQ).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="create-new-rate-btn"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Khai Báo Biểu Giá Mới</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive KPI Cards in LeadBoard Dark Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10 relative z-10">
          {/* Card 1: Tổng Tuyến / Biểu Giá */}
          <div 
            onClick={() => { setStatusFilter('ALL'); setSourceFilter('ALL'); }}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              statusFilter === 'ALL' && sourceFilter === 'ALL'
                ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Tổng Tuyến / Biểu Giá</span>
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400 tracking-tight">{stats.total}</span>
              <span className="text-xs font-bold text-cyan-300/90">tuyến / biểu giá</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">
              {stats.manualCount > 0 || stats.awardedCount > 0 
                ? `• ${stats.manualCount} tự khai báo • ${stats.awardedCount} trao thầu` 
                : 'Đã số hóa trên hệ thống'}
            </p>
          </div>

          {/* Card 2: Đang Có Hiệu Lực */}
          <div 
            onClick={() => { setStatusFilter('Active'); setSourceFilter('ALL'); }}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              statusFilter === 'Active'
                ? 'bg-slate-800/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Đang Có Hiệu Lực</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">{stats.active}</span>
              <span className="text-xs font-bold text-emerald-300/90">sẵn sàng áp dụng</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Sẵn sàng vận hành & đối soát cước</p>
          </div>

          {/* Card 3: Sắp Hết Hạn / Hết Hạn */}
          <div 
            onClick={() => { setStatusFilter('ExpiringSoon'); setSourceFilter('ALL'); }}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              statusFilter === 'ExpiringSoon' || statusFilter === 'Expired'
                ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Sắp Hết Hạn / Hết Hạn</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 tracking-tight">{stats.expiringSoon + stats.expired}</span>
              <span className="text-xs font-bold text-amber-300/90">cần đàm phán lại</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Cần gia hạn HĐ hoặc tạo RFQ mới</p>
          </div>

          {/* Card 4: Đồng Bộ Trao Thầu (Awarded) */}
          <div 
            onClick={() => { setSourceFilter('AWARDED_INQUIRY'); setStatusFilter('ALL'); }}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'AWARDED_INQUIRY'
                ? 'bg-slate-800/90 border-purple-400 ring-2 ring-purple-400/40 shadow-lg shadow-purple-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Đồng Bộ Trao Thầu (Awarded)</span>
              <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-300 tracking-tight">{stats.awardedCount}</span>
              <span className="text-xs font-bold text-purple-200/90">từ trao thầu sàn</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Tự động lưu từ các Inquiry đã chốt</p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FILTERS & SEARCH */}
      {/* ========================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tuyến đường, nhà xe (supplier), hàng hóa, mã hợp đồng, mã inquiry..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="ALL">Tất Cả Trạng Thái</option>
              <option value="Active">Đang Áp Dụng (Active)</option>
              <option value="ExpiringSoon">Sắp Hết Hạn (Expiring Soon)</option>
              <option value="Expired">Đã Hết Hạn (Expired)</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="ALL">Tất Cả Nguồn Giá</option>
              <option value="AWARDED_INQUIRY">Đồng bộ từ Trao thầu (Awarded)</option>
              <option value="MANUAL_ENTRY">Khai báo nội bộ (Manual)</option>
            </select>
          </div>
        </div>

        {/* Service Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setServiceFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              serviceFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất Cả Dịch Vụ ({rates.length})
          </button>
          
          <button
            onClick={() => setServiceFilter('Trucking')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Trucking'
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Trucking</span>
          </button>

          <button
            onClick={() => setServiceFilter('Sea Freight (FCL)')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Sea Freight (FCL)'
                ? 'bg-cyan-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Cước Biển FCL</span>
          </button>

          <button
            onClick={() => setServiceFilter('Sea Freight (LCL)')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Sea Freight (LCL)'
                ? 'bg-teal-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Cước Biển LCL</span>
          </button>

          <button
            onClick={() => setServiceFilter('Air Freight')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Air Freight'
                ? 'bg-sky-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Hàng Không (Air)</span>
          </button>

          <button
            onClick={() => setServiceFilter('Cold Chain')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Cold Chain'
                ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            <span>Chuỗi Lạnh</span>
          </button>

          <button
            onClick={() => setServiceFilter('Warehousing')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Warehousing'
                ? 'bg-amber-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Kho Bãi</span>
          </button>

          <button
            onClick={() => setServiceFilter('Customs Clearance')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Customs Clearance'
                ? 'bg-purple-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Hải Quan</span>
          </button>

          <button
            onClick={() => setServiceFilter('Cross-border')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              serviceFilter === 'Cross-border'
                ? 'bg-orange-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Xuyên Biên Giới</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MASTER RATES TABLE WITH EXPANDABLE BENTO DETAILS */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[3.5%]" />  {/* 1. STT */}
              <col className="w-[10.5%]" /> {/* 2. Nhóm Dịch Vụ */}
              <col className="w-[8%]" />    {/* 3. Nhóm Hàng */}
              <col className="w-[6%]" />    {/* 4. Mô Hình */}
              <col className="w-[19%]" />   {/* 5. Chi Tiết */}
              <col className="w-[13.5%]" /> {/* 6. Đơn Giá */}
              <col className="w-[18%]" />   {/* 7. PIC / Nhà Cung Cấp */}
              <col className="w-[8%]" />    {/* 8. Nguồn Giá */}
              <col className="w-[6.5%]" />  {/* 9. Hiệu Lực Giá */}
              <col className="w-[7%]" />    {/* 10. Thao Tác */}
            </colgroup>
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-2.5 px-1 text-center">STT</th>
                <th className="py-2.5 px-1.5">Nhóm Dịch Vụ</th>
                <th className="py-2.5 px-1.5">Nhóm Hàng</th>
                <th className="py-2.5 px-1.5">Mô Hình</th>
                <th className="py-2.5 px-2">Chi Tiết</th>
                <th className="py-2.5 px-2">Đơn Giá</th>
                <th className="py-2.5 px-2">PIC/Nhà Cung Cấp</th>
                <th className="py-2.5 px-1.5">Nguồn Giá</th>
                <th className="py-2.5 px-1.5">Hiệu Lực Giá</th>
                <th className="py-2.5 px-1 text-center">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-500">
                    <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-700">Không tìm thấy biểu giá nào phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "+ Khai Báo Biểu Giá Mới" để thêm bảng giá dịch vụ.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRates.map((rate, idx) => {
                  const isExpanded = Boolean(expandedRateIds[rate.id]);

                  return (
                    <React.Fragment key={rate.id}>
                      {/* MAIN MASTER ROW */}
                      <tr
                        id={`rate-row-${rate.code}`}
                        onClick={() => toggleExpandRate(rate.id)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded
                            ? 'bg-indigo-50/40 hover:bg-indigo-50/60 font-medium'
                            : idx % 2 === 0
                            ? 'bg-white hover:bg-slate-50/90'
                            : 'bg-slate-50/40 hover:bg-slate-100/70'
                        }`}
                      >
                        {/* Cột 1: STT */}
                        <td className="py-2.5 px-1 text-center text-slate-400 font-mono text-xs">
                          {idx + 1}
                        </td>

                        {/* Cột 2: Nhóm Dịch Vụ */}
                        <td className="py-2.5 px-1.5">
                          <span className="font-semibold text-slate-900 text-xs block truncate" title={rate.serviceType}>
                            {rate.serviceType}
                          </span>
                        </td>

                        {/* Cột 3: Nhóm Hàng */}
                        <td className="py-2.5 px-1.5 text-xs text-slate-700">
                          <span className="block truncate" title={getCargoGroup(rate)}>
                            {getCargoGroup(rate)}
                          </span>
                        </td>

                        {/* Cột 4: Mô Hình */}
                        <td className="py-2.5 px-1.5 text-xs text-slate-700">
                          <span className="block truncate" title={getOperationMode(rate)}>
                            {getOperationMode(rate)}
                          </span>
                        </td>

                        {/* Cột 5: Chi Tiết (Tuyến đường/phạm vi dịch vụ ngắn gọn, hiển thị 2 dòng linh hoạt) */}
                        <td className="py-2.5 px-2">
                          <div
                            className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2"
                            title={rate.routeDisplay || `${rate.origin.split(',')[0]} → ${rate.destination.split(',')[0]}`}
                          >
                            {rate.routeDisplay || `${rate.origin.split(',')[0]} → ${rate.destination.split(',')[0]}`}
                          </div>
                        </td>

                        {/* Cột 6: Đơn Giá (thể hiện giá trị tiền ở trên và đơn vị ở dưới chữ nhỏ) */}
                        <td className="py-2.5 px-2">
                          {(() => {
                            const { amountPart, unitPart } = getRateDisplayParts(rate);
                            return (
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 text-xs block leading-tight truncate" title={amountPart}>
                                  {amountPart}
                                </span>
                                {unitPart && (
                                  <span className="text-[10.5px] text-slate-500 block leading-tight truncate mt-0.5" title={unitPart}>
                                    {unitPart}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* Cột 7: PIC/Nhà Cung Cấp (Tên Saleman ở trên, Tên công ty ở dưới chữ nhỏ) */}
                        <td className="py-2.5 px-2">
                          {(() => {
                            const { picName, companyName } = getPICSupplierInfo(rate);
                            return (
                              <div className="space-y-0.5 min-w-0">
                                <span className="font-semibold text-slate-900 block text-xs truncate" title={rate.supplierContact || picName}>
                                  {picName}
                                </span>
                                <span className="text-[10.5px] text-slate-500 block truncate" title={companyName}>
                                  {companyName}
                                </span>
                              </div>
                            );
                          })()}
                        </td>

                        {/* Cột 8: Nguồn Giá */}
                        <td className="py-2.5 px-1.5 text-xs text-slate-700">
                          {rate.sourceType === 'AWARDED_INQUIRY' ? (
                            <div className="space-y-0.5 min-w-0">
                              <span className="block truncate text-[11px] text-slate-700">Trao thầu RFQ</span>
                              {rate.linkedInquiryCode && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate({
                                      type: 'workspace',
                                      view: 'customer-inquiries',
                                    });
                                  }}
                                  className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5 font-mono truncate block"
                                  title={rate.linkedInquiryCode}
                                >
                                  <span className="truncate">{rate.linkedInquiryCode}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-0.5 min-w-0">
                              <span className="block truncate text-[11px] text-slate-700">HĐ Nội bộ</span>
                              {rate.contractCode && (
                                <span className="text-[10px] text-slate-400 font-mono block truncate" title={rate.contractCode}>
                                  {rate.contractCode}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Cột 9: Hiệu Lực Giá (Chỉ thể hiện ngày giá hết hạn) */}
                        <td className="py-2.5 px-1.5">
                          <span className="text-[11px] text-slate-700 font-mono block truncate" title={rate.validTo}>
                            {rate.validTo}
                          </span>
                        </td>

                        {/* Cột 10: Thao Tác - Phân biệt giữa Awarded và HĐ Nội bộ */}
                        <td className="py-2 px-1 text-center" onClick={(e) => e.stopPropagation()}>
                          {rate.sourceType === 'AWARDED_INQUIRY' ? (
                            <div className="flex flex-col items-center justify-center gap-1 mx-auto w-full max-w-[84px]">
                              {/* NÚT XEM CHI TIẾT CHO GIÁ TỪ AWARDED RFQ */}
                              <button
                                id={`btn-view-awarded-${rate.code}`}
                                type="button"
                                onClick={() => handleOpenAwardedModal(rate)}
                                className="w-full py-1.5 px-1.5 text-[10.5px] font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border border-indigo-200/90 transition-all inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs leading-tight active:scale-95"
                                title="Xem chi tiết trao thầu RFQ (Tab 1: Tóm tắt yêu cầu, Tab 2: Giá trúng thầu)"
                              >
                                <FileText className="w-3 h-3 text-indigo-600 shrink-0" />
                                <span className="whitespace-nowrap">Chi tiết</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-1 mx-auto w-full max-w-[84px]">
                              {/* NÚT XEM ĐẦY ĐỦ CHO GIÁ KHÁCH HÀNG TỰ KHAI BÁO (THEO PHONG CÁCH HOT PROMOTION) */}
                              <button
                                id={`btn-view-matrix-${rate.code}`}
                                type="button"
                                onClick={() => handleOpenMatrixModal(rate)}
                                className="w-full py-1 px-1 text-[10px] font-bold rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 border border-orange-200/90 transition-all inline-flex items-center justify-center gap-0.5 cursor-pointer shadow-2xs leading-tight active:scale-95"
                                title="Xem biểu giá ma trận cước đầy đủ"
                              >
                                <Maximize2 className="w-2.5 h-2.5 text-orange-600 shrink-0" />
                                <span className="whitespace-nowrap">Đầy đủ</span>
                              </button>

                              {/* Hàng nút phụ cho HĐ nội bộ: Sửa & Xóa */}
                              <div className="flex items-center gap-0.5 w-full justify-between">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(rate)}
                                  className="flex-1 py-0.5 px-0.5 rounded text-[9px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-0.5 cursor-pointer"
                                  title="Chỉnh sửa hợp đồng nội bộ"
                                >
                                  <Edit3 className="w-2 h-2 text-slate-500 shrink-0" />
                                  <span>Sửa</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onDeleteRate(rate.id)}
                                  className="py-0.5 px-1 rounded text-[9px] font-semibold bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors flex items-center justify-center cursor-pointer"
                                  title="Xóa giá nội bộ"
                                >
                                  <Trash2 className="w-2 h-2 shrink-0" />
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* ========================================================= */}
                      {/* EXPANDED BENTO DETAIL FOR RATE ITEM */}
                      {/* ========================================================= */}
                      {isExpanded && (
                        <tr className="bg-indigo-50/20 border-b border-indigo-100 animate-in fade-in duration-150">
                          <td colSpan={10} className="p-4 sm:p-6">
                            <div className="space-y-4">
                              {/* Top Banner with Full Route & Title */}
                              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                      {rate.code}
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-900">{rate.title}</h3>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                                    <span><strong>Điểm nhận:</strong> {rate.origin}</span>
                                    <span>•</span>
                                    <span><strong>Điểm giao:</strong> {rate.destination}</span>
                                    <span>•</span>
                                    <span><strong>Hàng hóa:</strong> {rate.cargoType}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onOpenCreateInquiryWithBenchmark) {
                                        onOpenCreateInquiryWithBenchmark(rate);
                                      }
                                    }}
                                    className="px-3.5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Đăng RFQ Mới Từ Giá Này</span>
                                  </button>
                                </div>
                              </div>

                              {/* Bento Grid 4 Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                
                                {/* Bento 1: Bóc Tách Đơn Giá & Phụ Phí */}
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                    <span>Bóc Tách Cước & Phụ Phí</span>
                                  </div>

                                  <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-500">Cước cơ sở (Base):</span>
                                      <span className="font-extrabold text-slate-900">{rate.rateDisplay}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-500">Điều khoản cước:</span>
                                      <span className="font-semibold text-indigo-700">
                                        {rate.allInclusive ? 'Trọn gói All-in' : 'Bóc tách phụ phí'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-500">Thuế suất VAT:</span>
                                      <span className="font-semibold text-slate-700">{rate.vatPercent ?? 8}%</span>
                                    </div>
                                  </div>

                                  {rate.surcharges && rate.surcharges.length > 0 && (
                                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Danh mục phụ phí:
                                      </span>
                                      {rate.surcharges.map((sc) => (
                                        <div key={sc.id} className="flex justify-between items-start text-[11px]">
                                          <span className="text-slate-600 leading-tight">
                                            {sc.name} ({sc.includedInBaseRate ? 'Đã gồm' : 'Ngoài cước'}):
                                          </span>
                                          <span className="font-semibold text-slate-900 shrink-0 ml-2">
                                            {sc.amount > 0 ? `${sc.amount.toLocaleString('vi-VN')} ${sc.currency}` : 'Miễn phí'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Bento 2: Thông Số Kỹ Thuật & SLA */}
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                                    <Layers className="w-4 h-4 text-blue-600" />
                                    <span>Thông Số Kỹ Thuật (Specs)</span>
                                  </div>

                                  <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-500">Phương tiện:</span>
                                      <span className="font-bold text-slate-900">{rate.equipmentOrVehicleType || 'Chuẩn'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-500">Quy cách tải:</span>
                                      <span className="font-semibold text-slate-800">{rate.loadType || 'FTL'}</span>
                                    </div>
                                    {rate.freeDemDetDays && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Free Dem/Det:</span>
                                        <span className="font-bold text-indigo-600">{rate.freeDemDetDays} ngày</span>
                                      </div>
                                    )}
                                    {rate.truckingSpecs?.palletQuantity && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Số lượng Pallet:</span>
                                        <span className="font-semibold text-slate-800">{rate.truckingSpecs.palletQuantity} Pallets</span>
                                      </div>
                                    )}
                                    {rate.coldChainSpecs?.temperatureCategory && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Dải nhiệt độ:</span>
                                        <span className="font-semibold text-emerald-700">{rate.coldChainSpecs.temperatureCategory.split(':')[0]}</span>
                                      </div>
                                    )}
                                    {rate.warehousingSpecs?.storageAreaSqm && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Diện tích thuê:</span>
                                        <span className="font-semibold text-amber-700">{rate.warehousingSpecs.storageAreaSqm} m²</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span>Thời gian vận chuyển: <strong>{rate.transitTime || 'Thỏa thuận'}</strong></span>
                                    </div>
                                  </div>
                                </div>

                                {/* Bento 3: Đối Tác Vận Tải & Hợp Đồng */}
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                                    <Building2 className="w-4 h-4 text-purple-600" />
                                    <span>Đối Tác & Pháp Lý</span>
                                  </div>

                                  <div className="space-y-1.5 text-xs">
                                    <div>
                                      <span className="text-slate-400 text-[10.5px] block">Doanh nghiệp phụ trách:</span>
                                      <span className="font-extrabold text-slate-900 block">{rate.supplierName}</span>
                                    </div>
                                    {rate.supplierTaxId && (
                                      <div className="text-[11px] text-slate-500">
                                        MST: <strong>{rate.supplierTaxId}</strong>
                                      </div>
                                    )}
                                    {rate.supplierContact && (
                                      <div className="text-[11px] text-slate-500">
                                        Liên hệ: <strong>{rate.supplierContact}</strong> ({rate.supplierPhone})
                                      </div>
                                    )}
                                    {rate.contractCode && (
                                      <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
                                        Hợp đồng / Phụ lục: <strong className="font-mono text-indigo-700">{rate.contractCode}</strong>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Bento 4: Điều Khoản Công Nợ & Ghi Chú */}
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                                    <span>Điều Khoản & Cam Kết</span>
                                  </div>

                                  <div className="space-y-1.5 text-xs">
                                    <div>
                                      <span className="text-slate-400 text-[10.5px] block">Điều khoản thanh toán:</span>
                                      <span className="font-semibold text-slate-800 block leading-snug">{rate.paymentTerms}</span>
                                    </div>

                                    {rate.notes && (
                                      <div className="pt-1.5 border-t border-slate-100">
                                        <span className="text-slate-400 text-[10.5px] block">Ghi chú vận hành:</span>
                                        <p className="text-[11px] text-slate-600 line-clamp-3 italic">
                                          "{rate.notes}"
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <CreateOrEditRateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveRate={onSaveRate}
        editingRate={editingRate}
        suppliers={suppliers}
      />

      {/* AWARDED RFQ MODAL - SỬ DỤNG CHÍNH MODAL TÓM TẮT YÊU CẦU & MA TRẬN BÁO GIÁ CỦA MY INQUIRY, CHỈ HIỂN THỊ CỘT CỦA SUPPLIER TRÚNG THẦU */}
      <InquirySummaryConfirmModal
        isOpen={isAwardedModalOpen}
        onClose={() => {
          setIsAwardedModalOpen(false);
          setSelectedAwardedRate(null);
        }}
        inquiry={selectedAwardedInquiry}
        currentUser={null}
        isCustomerView={true}
        isPublished={true}
        onlyAwardedSupplier={true}
        awardedSupplierName={selectedAwardedRate?.supplierName}
        awardedRateData={selectedAwardedRate}
        quotations={quotations}
      />

      {/* HOT PROMOTION FULL COST MATRIX MODAL FOR INTERNAL CONTRACT RATES */}
      <HotPromotionFullCostMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => {
          setIsMatrixModalOpen(false);
          setSelectedPromoForModal(null);
        }}
        item={selectedPromoForModal}
      />
    </div>
  );
};
