import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  FileArchive, 
  Paperclip, 
  CheckCircle2, 
  X, 
  Send, 
  Truck, 
  Ship, 
  Plane, 
  Train, 
  Warehouse, 
  Sparkles, 
  Phone, 
  Mail, 
  Clock, 
  Layers, 
  Check, 
  Edit3, 
  Globe, 
  ThermometerSnowflake, 
  Anchor, 
  Share2, 
  Copy, 
  CheckCheck, 
  ShieldAlert, 
  Flame, 
  Snowflake,
  Landmark,
  Flag,
  Scale,
  Box,
  Receipt,
  Zap,
  Tag,
  BadgeDollarSign,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  PackageCheck,
  Package,
  ArrowRight,
  Route,
  Info,
  ChevronRight,
  Boxes,
  Briefcase,
  SlidersHorizontal,
  Compass,
  FileCheck
} from 'lucide-react';
import { InquiryItem, ServiceType, UserProfile } from '../../types';

interface InquirySummaryConfirmModalProps {
  isOpen: boolean;
  inquiry: InquiryItem | null;
  currentUser?: UserProfile | null;
  matchingSuppliersCount: number;
  isPublished?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const InquirySummaryConfirmModal: React.FC<InquirySummaryConfirmModalProps> = ({
  isOpen,
  inquiry,
  currentUser,
  matchingSuppliersCount,
  isPublished: isPublishedProp,
  onClose,
  onConfirm,
}) => {
  const [activeTab, setActiveTab] = useState<'profile_cargo' | 'tariff_sheet'>('profile_cargo');
  const [internalPublished, setInternalPublished] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isPublished = isPublishedProp !== undefined ? isPublishedProp : internalPublished;

  // Reset internal state when modal opens with a new inquiry
  useEffect(() => {
    if (isOpen) {
      setCopiedLink(false);
      setActiveTab('profile_cargo');
      if (isPublishedProp === undefined) {
        setInternalPublished(false);
      }
    }
  }, [isOpen, isPublishedProp]);

  // Scroll to top when published so the user clearly sees the generated Lead Code and Share Banner
  useEffect(() => {
    if (isPublished && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isPublished]);

  if (!isOpen || !inquiry) return null;

  // Lead Code and Inquiry Code are 1:1 identical (Mã lead và Mã Inquiry là 1)
  const leadCode = inquiry.leadCode || inquiry.code;

  // Share URL pointing directly to the Lead Board filtered by this Lead Code
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`
    : `https://logistics.vietnam.io/?tab=lead-board&leadCode=${leadCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleConfirmPublish = () => {
    setInternalPublished(true);
    onConfirm();
  };

  const getServiceIcon = (service: ServiceType) => {
    switch (service) {
      case 'Trucking':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'Cold Chain':
        return <ThermometerSnowflake className="w-5 h-5 text-cyan-600" />;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Ship className="w-5 h-5 text-blue-600" />;
      case 'Air Freight':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'Rail Freight':
        return <Train className="w-5 h-5 text-indigo-600" />;
      case 'Warehousing':
        return <Warehouse className="w-5 h-5 text-purple-600" />;
      case 'Customs Clearance':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'Cross-border':
        return <Globe className="w-5 h-5 text-orange-600" />;
      case 'Project Cargo':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      default:
        return <Truck className="w-5 h-5 text-slate-600" />;
    }
  };

  const getServiceNameVi = (service: ServiceType): string => {
    switch (service) {
      case 'Trucking': return 'Vận Tải Đường Bộ (Trucking)';
      case 'Cold Chain': return 'Vận Tải Hàng Lạnh (Cold Chain Logistics)';
      case 'Sea Freight (FCL)': 
      case 'Sea Freight (LCL)': 
        return 'Vận Tải Đường Biển (Ocean Freight)';
      case 'Air Freight': return 'Vận Tải Hàng Không (Air Freight)';
      case 'Rail Freight': return 'Vận Tải Đường Sắt (Rail Freight)';
      case 'Warehousing': return 'Dịch Vụ Kho Bãi & Trung Tâm Phân Phối (3PL)';
      case 'Customs Clearance': return 'Khai Báo Hải Quan & Thông Quan (Customs)';
      case 'Cross-border': return 'Vận Tải Bộ Xuyên Biên Giới (Cross-Border)';
      case 'Project Cargo': return 'Vận Tải Hàng Dự Án / Siêu Trường Siêu Trọng (Project Cargo)';
      default: return service;
    }
  };

  const specs = inquiry.serviceSpecs || {};
  const trucking = specs.trucking;
  const ocean = specs.ocean;
  const air = specs.air;
  const coldChain = specs.coldChain;
  const warehousing = specs.warehousing;
  const customs = specs.customs;
  const crossBorder = specs.crossBorder;
  const rail = specs.rail;
  const project = specs.project;

  // Active pick-up and drop-off points
  const isTrucking = inquiry.serviceType === 'Trucking';
  const isLcl = inquiry.serviceType === 'Sea Freight (LCL)' || ocean?.mode?.includes('LCL') || inquiry.title?.toLowerCase().includes('lcl');
  const isFcl = (inquiry.serviceType === 'Sea Freight (FCL)' || ocean?.mode?.includes('FCL')) && !isLcl;
  const isOcean = isFcl || isLcl;
  const pickupList: string[] = isTrucking && trucking?.pickupLocations && trucking.pickupLocations.length > 0
    ? trucking.pickupLocations.map(l => l.trim()).filter(Boolean)
    : [inquiry.origin].filter(Boolean);

  const deliveryList: string[] = isTrucking && trucking?.deliveryLocations && trucking.deliveryLocations.length > 0
    ? trucking.deliveryLocations.map(l => l.trim()).filter(Boolean)
    : [inquiry.destination].filter(Boolean);

  const totalPickupCount = pickupList.length || 1;
  const totalDeliveryCount = deliveryList.length || 1;
  const isMultiPoint = totalPickupCount > 1 || totalDeliveryCount > 1;

  // Customer Profile Information
  const customerCompanyName = inquiry.customerCompany || currentUser?.companyName || 'ABC Manufacturing Vietnam Co., Ltd.';
  const customerContactName = inquiry.contactPerson || (currentUser ? `${currentUser.name} (${currentUser.roleTitle || 'Logistics & Supply Chain'})` : 'Lê Hoàng Hiếu (Logistics Lead)');
  const customerEmail = currentUser?.email || 'hieu.le@abcmfg.vn';
  const customerPhone = '+84 908 123 456';

  // Tariff Unit calculation helper (Clean ĐVT column - without repeating currency)
  const getTariffMainUnit = (): string => {
    switch (inquiry.serviceType) {
      case 'Sea Freight (FCL)':
        return ocean?.containerType ? ocean.containerType.split(' ')[0] : 'Cont 40HC';
      case 'Sea Freight (LCL)':
        return 'RT (CBM/Tấn)';
      case 'Air Freight':
        return 'Kg (CW)';
      case 'Trucking':
        return trucking?.loadType?.includes('LTL') 
          ? 'Kg (hoặc CBM)' 
          : `Chuyến (${trucking?.truckType || 'Xe tải'})`;
      case 'Cold Chain':
        return `Chuyến (${coldChain?.vehicleOrContType || 'Xe lạnh'})`;
      case 'Rail Freight':
        return rail?.mode?.includes('LCL') 
          ? 'Kg (hoặc CBM)' 
          : 'Cont / Toa';
      case 'Warehousing':
        return 'm² / Tháng (hoặc Pallet)';
      case 'Customs Clearance':
        return 'Tờ khai';
      case 'Cross-border':
        return 'Chuyến';
      case 'Project Cargo':
        return 'Trọn gói';
      default:
        return 'Đơn vị';
    }
  };

  const getSurchargeUnit = (surchargeName: string): string => {
    const s = surchargeName.toLowerCase();
    if (s.includes('thc') || s.includes('nâng hạ') || s.includes('seal') || s.includes('chì') || s.includes('vệ sinh cont') || s.includes('cắm điện')) {
      return isOcean && isFcl ? (ocean?.containerType ? ocean.containerType.split(' ')[0] : 'Cont') : 'Chuyến';
    }
    if (s.includes('b/l') || s.includes('vận đơn') || s.includes('tờ khai') || s.includes('hải quan') || s.includes('chứng từ') || s.includes('kiểm dịch') || s.includes('hun trùng') || s.includes('c/o') || s.includes('giấy phép')) {
      return 'Set (Bộ)';
    }
    if (s.includes('cbm') || s.includes('cfs') || s.includes('khối')) {
      return 'CBM';
    }
    if (s.includes('kg') || s.includes('tấn') || s.includes('tải trọng')) {
      return 'Kg';
    }
    if (s.includes('pallet')) {
      return 'Pallet';
    }
    if (s.includes('bốc xếp') || s.includes('nhân công') || s.includes('bốc dỡ')) {
      return 'Chuyến / Tấn';
    }
    return isOcean ? 'Cont' : 'Chuyến';
  };

  const getVasUnit = (vasName: string): string => {
    const v = vasName.toLowerCase();
    if (v.includes('bảo hiểm')) return '% Trị giá hàng';
    if (v.includes('hải quan') || v.includes('c/o') || v.includes('hun trùng') || v.includes('kiểm dịch')) return 'Bộ hồ sơ';
    if (v.includes('gps') || v.includes('tracking') || v.includes('nhiệt độ')) return 'Kèm cước';
    if (v.includes('đóng gói') || v.includes('pallet') || v.includes('dán tem') || v.includes('quấn màng')) return 'Pallet / Kiện';
    if (v.includes('bốc xếp') || v.includes('nâng hạ') || v.includes('xe nâng')) return 'Tấn / Giờ';
    return 'Hạng mục';
  };

  // Dynamic Section Titles & Configuration per Service Type
  const getServiceMainFreightTitle = (): string => {
    switch (inquiry.serviceType) {
      case 'Sea Freight (FCL)':
        return 'Cước Biển Cơ Bản (Ocean Freight - OF) *';
      case 'Sea Freight (LCL)':
        return 'Cước Biển Gom Hàng Lẻ (Ocean LCL Freight) *';
      case 'Trucking':
        return 'Cước Vận Chuyển Đường Bộ Chính Tuyến (Main Haul Freight) *';
      case 'Cold Chain':
        return 'Cước Vận Chuyển Đông Lạnh Chính Tuyến (Reefer Freight) *';
      case 'Air Freight':
        return 'Cước Vận Chuyển Hàng Không (Air Freight Rate - AFT) *';
      case 'Rail Freight':
        return 'Cước Vận Chuyển Đường Sắt (Rail Freight) *';
      case 'Warehousing':
        return 'Phí Lưu Kho Cơ Bản (Base Storage Fee) *';
      case 'Customs Clearance':
        return 'Phí Dịch Vụ Khai Báo Hải Quan (Customs Clearance Fee) *';
      case 'Cross-border':
        return 'Cước Vận Chuyển Xuyên Biên Giới (Cross-Border Freight) *';
      case 'Project Cargo':
        return 'Cước Vận Chuyển Hàng Dự Án Trọn Gói (Project Freight) *';
      default:
        return 'Cước Vận Chuyển Cơ Bản (Base Freight) *';
    }
  };

  const getServiceSection1Title = (): string => {
    switch (inquiry.serviceType) {
      case 'Sea Freight (FCL)':
        return '1. PHỤ PHÍ HÃNG TÀU & CẢNG BIỂN (SURCHARGES)';
      case 'Sea Freight (LCL)':
        return '1. PHỤ PHÍ HÃNG TÀU & KHO CFS (LCL SURCHARGES)';
      case 'Trucking':
        return '1. PHỤ PHÍ VẬN HÀNH & ĐỊA PHƯƠNG (SURCHARGES)';
      case 'Cold Chain':
        return '1. PHỤ PHÍ BẢO QUẢN & VẬN HÀNH LẠNH (SURCHARGES)';
      case 'Air Freight':
        return '1. PHỤ PHÍ SÂN BAY & HÃNG HÀNG KHÔNG (AIRLINE & TERMINAL SURCHARGES)';
      case 'Rail Freight':
        return '1. PHỤ PHÍ GA & BÃI ĐƯỜNG SẮT (STATION & RAIL SURCHARGES)';
      case 'Warehousing':
        return '1. PHÍ VẬN HÀNH KHO & XẾP DỠ (INBOUND / OUTBOUND / HANDLING)';
      case 'Customs Clearance':
        return '1. PHÍ THỦ TỤC & KIỂM TRA CHUYÊN NGÀNH (INSPECTION & PERMITS)';
      case 'Cross-border':
        return '1. PHỤ PHÍ CỬA KHẨU & CHUYỂN TẢI BIÊN GIỚI (BORDER SURCHARGES)';
      case 'Project Cargo':
        return '1. PHỤ PHÍ KHẢO SÁT & VẬN TẢI ĐẶC BIỆT (SURCHARGES)';
      default:
        return '1. PHỤ PHÍ VẬN HÀNH & ĐỊA PHƯƠNG (SURCHARGES)';
    }
  };

  const getServiceSection2Title = (): string => {
    if (inquiry.serviceType === 'Warehousing') {
      return '2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) TẠI KHO';
    }
    return '2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO';
  };

  const getServiceSection3Title = (): string => {
    switch (inquiry.serviceType) {
      case 'Sea Freight (FCL)':
        return '3. CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN (SLA & TERMS)';
      case 'Sea Freight (LCL)':
        return '3. CAM KẾT LỊCH ĐÓNG GHÉP & VẬN CHUYỂN LCL';
      case 'Trucking':
        return '3. CAM KẾT LỊCH XE & ĐIỀU KHOẢN VẬN CHUYỂN';
      case 'Cold Chain':
        return '3. CAM KẾT NHIỆT ĐỘ & LỊCH TRÌNH VẬN HÀNH';
      case 'Air Freight':
        return '3. CAM KẾT CHUYẾN BAY & ĐIỀU KHOẢN VẬN CHUYỂN';
      case 'Rail Freight':
        return '3. CAM KẾT LỊCH TÀU GA & ĐIỀU KHOẢN VẬN CHUYỂN';
      case 'Warehousing':
        return '3. CAM KẾT THỜI GIAN VẬN HÀNH & HỢP ĐỒNG THUÊ KHO';
      case 'Customs Clearance':
        return '3. CAM KẾT THỜI GIAN THÔNG QUAN & HỒ SƠ';
      case 'Cross-border':
        return '3. CAM KẾT LỊCH TRÌNH & THỦ TỤC CỬA KHẨU';
      case 'Project Cargo':
        return '3. CAM KẾT TIẾN ĐỘ & PHƯƠNG ÁN HẠ TẦNG';
      default:
        return '3. CAM KẾT LỊCH TRÌNH & ĐIỀU KHOẢN VẬN CHUYỂN';
    }
  };

  const getServiceSection3Icon = () => {
    switch (inquiry.serviceType) {
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Anchor className="w-3.5 h-3.5 text-sky-600" />;
      case 'Trucking':
        return <Truck className="w-3.5 h-3.5 text-blue-600" />;
      case 'Cold Chain':
        return <ThermometerSnowflake className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Air Freight':
        return <Plane className="w-3.5 h-3.5 text-sky-600" />;
      case 'Rail Freight':
        return <Train className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Warehousing':
        return <Building2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'Customs Clearance':
        return <FileText className="w-3.5 h-3.5 text-purple-600" />;
      case 'Cross-border':
        return <Globe className="w-3.5 h-3.5 text-orange-600" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const getCol3HeaderConfig = () => {
    switch (inquiry.serviceType) {
      case 'Sea Freight (FCL)':
        return {
          tag: 'Cont #1',
          label: ocean?.containerType ? `${ocean.containerType} —— (${ocean.containerCount || 1} Cont)` : '40ft High Cube (40HC) —— (76 CBM)',
        };
      case 'Sea Freight (LCL)':
        return {
          tag: 'Lô Hàng LCL #1',
          label: ocean?.cbmVolume ? `${ocean.cbmVolume} CBM / ${ocean.grossWeightKgs || 0} kg` : 'Hàng lẻ LCL (Gom kho CFS)',
        };
      case 'Trucking':
        return {
          tag: 'Cấu Hình Xe #1',
          label: trucking?.truckType ? `${trucking.truckType} —— (${trucking.tonnageCategory || 'Tiêu chuẩn'})` : 'Xe Tải Thùng Kín (Dry Box Truck)',
        };
      case 'Cold Chain':
        return {
          tag: 'Cấu Hình Xe Lạnh #1',
          label: coldChain?.vehicleOrContType ? `${coldChain.vehicleOrContType} —— (${coldChain.temperatureCategory?.split(':')[0] || 'Chilled'})` : 'Xe Tải Đông Lạnh (Thermo King)',
        };
      case 'Air Freight':
        return {
          tag: 'Lô Hàng Air #1',
          label: air?.chargeableWeightKgs ? `${air.chargeableWeightKgs} kg CW —— (${air.serviceLevel?.split('(')[0] || 'Standard'})` : 'Standard Air Cargo',
        };
      case 'Rail Freight':
        return {
          tag: 'Cấu Hình Toa/Cont #1',
          label: rail?.wagonOrContType || 'Container 40HC Đường Sắt',
        };
      case 'Warehousing':
        return {
          tag: 'Gói Thuê Kho #1',
          label: warehousing?.warehouseType ? `${warehousing.warehouseType} —— (${warehousing.storageAreaSqm || 1000} m²)` : 'Kho Thường Tiêu Chuẩn',
        };
      case 'Customs Clearance':
        return {
          tag: 'Hồ Sơ Tờ Khai #1',
          label: customs?.declarationType ? `${customs.declarationType} —— (HS: ${customs.hsCodePrimary || '8471'})` : 'Tờ khai Nhập khẩu Kinh doanh',
        };
      case 'Cross-border':
        return {
          tag: 'Phương Án Vận Tải #1',
          label: crossBorder?.cargoMode ? `${crossBorder.cargoMode} —— (${crossBorder.borderGate?.split('(')[0] || 'Hữu Nghị'})` : 'Xe Liên Vận GMS Chạy Thẳng',
        };
      case 'Project Cargo':
        return {
          tag: 'Gói Dự Án #1',
          label: project?.projectType || 'Vận tải siêu trường siêu trọng',
        };
      default:
        return {
          tag: 'Cấu Hình #1',
          label: getTariffMainUnit(),
        };
    }
  };

  const routeDisplay = `${inquiry.origin || 'Điểm đi'} ➔ ${inquiry.destination || 'Điểm đến'}`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden animate-in fade-in duration-150">
      <div 
        id="inquiry-summary-confirm-modal"
        className="w-full max-w-[96vw] 2xl:max-w-[1560px] h-[94vh] max-h-[95vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/50">
          <h3 className="text-base font-bold text-white tracking-wide uppercase">
            YÊU CẦU BÁO GIÁ
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-TAB NAVIGATION BAR */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              type="button"
              id="tab-btn-customer-cargo"
              onClick={() => setActiveTab('profile_cargo')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile_cargo'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Tab 1: Khách Hàng & Hàng Hóa</span>
            </button>

            <button
              type="button"
              id="tab-btn-tariff-sheet"
              onClick={() => setActiveTab('tariff_sheet')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tariff_sheet'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tab 2: Bảng Niêm Yết & Cấu Trúc Báo Giá</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Tuyến:</span>
            <span className="text-slate-200 font-bold max-w-xs truncate" title={routeDisplay}>{routeDisplay}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={scrollContainerRef} className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/70 flex-1">
          
          {/* BANNER KHI ĐÃ PHÁT HÀNH THÀNH CÔNG */}
          {isPublished && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500/40 text-emerald-950 shadow-sm animate-in slide-in-from-top-3 duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shrink-0 mt-0.5">
                    <CheckCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-emerald-950">
                        Đã Tạo Mã Lead & Niêm Yết Lên Sàn (Lead Board)
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-mono font-bold shadow-xs">
                        Mã Lead & RFQ: {inquiry.code}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        Đang Mở Thầu
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                      Yêu cầu báo giá <strong className="font-mono font-bold text-emerald-900">{inquiry.code}</strong> (Mã Lead: <strong className="font-mono font-bold text-emerald-900">{inquiry.code}</strong>) đã được hệ thống niêm yết công khai trên <strong>Lead Board</strong> cho <span className="font-black">{matchingSuppliersCount} nhà vận tải & logistics</span>. Khi chia sẻ liên kết bên dưới, đối tác sẽ được điều hướng thẳng đến Lead Board và tự động lọc chính xác theo mã Lead này.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      copiedLink 
                        ? 'bg-slate-900 text-emerald-300 ring-2 ring-emerald-400' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Đã Sao Chép Link Lead Board!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-white" />
                        <span>Sao Chép Link Lead Board ({leadCode})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share URL Box */}
              <div className="mt-3.5 pt-3 border-t border-emerald-500/20">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1.5">
                  Liên Kết Trực Tiếp Tới Bảng Lead Board (Đã Tự Động Lọc Theo Mã Lead {leadCode}):
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono shadow-inner overflow-hidden">
                    <Globe className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                    <span className="truncate">{shareUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs ${
                      copiedLink 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                    <span>{copiedLink ? 'Đã chép' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: THÔNG TIN KHÁCH HÀNG & HÀNG HÓA (4 KHỐI THỐNG NHẤT LIỀN MẠCH)        */}
          {/* ========================================================================= */}
          {activeTab === 'profile_cargo' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* ========================================================================= */}
              {/* KHỐI 1: THÔNG TIN KHÁCH HÀNG (CUSTOMER PROFILE)                           */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>1. Thông Tin Khách Hàng (Customer Profile)</span>
                  </span>
                </div>

                <div className="p-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Company Name & Tax ID */}
                    <div className="md:col-span-6 space-y-1.5 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4">
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase block">
                        Đơn vị yêu cầu báo giá (Doanh nghiệp)
                      </span>
                      <p className="font-black text-slate-900 text-sm leading-snug">
                        {customerCompanyName}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Mã số thuế (MST):</span>
                        <strong className="text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {inquiry.taxCode || '0314988234'}
                        </strong>
                      </div>
                    </div>

                    {/* Contact Person & Roles & Direct Channels */}
                    <div className="md:col-span-6 space-y-2">
                      <div>
                        <span className="text-[10.5px] font-bold text-slate-400 uppercase block">
                          Người phụ trách & Đầu mối liên hệ
                        </span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-sm">
                        {customerContactName}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-bold">{customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 truncate">
                          <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-bold truncate" title={customerEmail}>{customerEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* KHỐI 2: THÔNG TIN SẢN PHẨM & HÀNG HÓA (CARGO SPECIFICATIONS)              */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Box className="w-4 h-4 text-indigo-600" />
                    <span>2. Thông Tin Sản Phẩm & Quy Cách Hàng Hóa (Cargo Specifications)</span>
                  </span>
                  <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-md border ${
                    inquiry.cargoClassification === 'Reefer'
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                      : inquiry.cargoClassification === 'Hazmat'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {inquiry.cargoClassification === 'Reefer' ? '❄️ Hàng Đông Lạnh (Reefer)' : inquiry.cargoClassification === 'Hazmat' ? '⚠️ Hàng Nguy Hiểm (Hazmat/IMO)' : '📦 Hàng Thông Thường'}
                  </span>
                </div>

                {/* Technical Specifications Table */}
                <div className="divide-y divide-slate-100 text-xs">
                  
                  {/* Row 1: Industry & Commodity Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="p-3">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Ngành hàng</span>
                      <span className="font-extrabold text-slate-900 mt-0.5 block">{inquiry.industry || 'Hàng tiêu dùng FMCG & Công nghiệp'}</span>
                    </div>
                    <div className="p-3 bg-slate-50/30">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Tên mặt hàng chi tiết</span>
                      <span className="font-extrabold text-indigo-950 mt-0.5 block">{inquiry.cargoType || 'Theo danh mục khai báo'}</span>
                    </div>
                    <div className="p-3">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Quy cách đóng gói</span>
                      <span className="font-extrabold text-slate-900 mt-0.5 block">{inquiry.packaging || 'Đóng Pallet tiêu chuẩn'}</span>
                    </div>
                    <div className="p-3 bg-slate-50/30">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Số lượng kiện / Pallet</span>
                      <span className="font-extrabold text-indigo-900 mt-0.5 block">
                        {inquiry.packageCount || ocean?.lclPieces || air?.packageCount 
                          ? `${inquiry.packageCount || ocean?.lclPieces || air?.packageCount} Kiện / Pallet` 
                          : 'Theo phiếu giao nhận'}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Dimensions, Gross Weight, Volume & CW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="p-3">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Kích thước (D x R x C cm)</span>
                      <span className="font-mono font-bold text-slate-800 mt-0.5 block">
                        {(() => {
                          const dims = inquiry.dimensionsCm || ocean?.lclDimensions || air?.dimensionsCm;
                          if (typeof dims === 'string') return dims;
                          if (dims?.lengthCm) return `${dims.lengthCm} x ${dims.widthCm || 100} x ${dims.heightCm || 150} cm`;
                          return 'Tiêu chuẩn thùng xe / cont';
                        })()}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50/30">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Khối lượng thực (Gross Weight)</span>
                      <span className="font-extrabold text-emerald-800 mt-0.5 block">
                        {inquiry.ftlWeightKg 
                          ? `${inquiry.ftlWeightKg} kg` 
                          : ocean?.lclGrossWeightKg 
                          ? `${ocean.lclGrossWeightKg} kg` 
                          : air?.grossWeightKgs 
                          ? `${air.grossWeightKgs} kg` 
                          : inquiry.weightVolume || 'Theo tải trọng xe'}
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Thể tích thực (Volume)</span>
                      <span className="font-extrabold text-cyan-900 mt-0.5 block">
                        {inquiry.ftlVolumeCbm 
                          ? `${inquiry.ftlVolumeCbm} CBM` 
                          : ocean?.lclCbm 
                          ? `${ocean.lclCbm} CBM` 
                          : 'Theo thùng xe'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50/30">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">
                        {inquiry.serviceType === 'Air Freight' ? 'Trọng lượng tính cước (CW)' : 'Revenue Ton / Slot Pallet'}
                      </span>
                      <span className="font-extrabold text-sky-900 mt-0.5 block">
                        {air?.chargeableWeightKgs 
                          ? `${air.chargeableWeightKgs} kg CW` 
                          : ocean?.lclRevenueTon 
                          ? `${ocean.lclRevenueTon} RT` 
                          : warehousing?.palletPositions 
                          ? `${warehousing.palletPositions} Pallets` 
                          : 'Tiêu chuẩn'}
                      </span>
                    </div>
                  </div>

                  {/* Row 3: HS Code & Trade Role & Invoice Value */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="p-3">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Mã HS Code</span>
                      <span className="font-mono font-bold text-amber-900 mt-0.5 block">
                        {inquiry.hsCode || specs.customs?.hsCodePrimary || specs.ocean?.hsCode || specs.air?.hsCode || specs.crossBorder?.hsCode || 'Chưa khai báo'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50/30">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Trị giá khai báo (Invoice)</span>
                      <span className="font-extrabold text-emerald-900 mt-0.5 block">
                        {inquiry.cargoValue || specs.ocean?.cargoValue || specs.air?.cargoValue || specs.customs?.cargoValue 
                          ? `${inquiry.cargoValue || specs.ocean?.cargoValue || specs.air?.cargoValue || specs.customs?.cargoValue} ${inquiry.cargoValueCurrency || specs.ocean?.cargoValueCurrency || 'USD'}`
                          : 'Theo hóa đơn'}
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Vai trò ngoại thương</span>
                      <span className="font-extrabold text-slate-900 mt-0.5 block">
                        {inquiry.tradeRole === 'EXPORTER' ? 'Doanh nghiệp Xuất khẩu' : inquiry.tradeRole === 'IMPORTER' ? 'Doanh nghiệp Nhập khẩu' : 'Vận tải Nội địa'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50/30">
                      <span className="text-slate-400 font-medium block text-[10.5px] uppercase">Điều kiện Incoterms</span>
                      <span className="font-extrabold text-indigo-900 mt-0.5 block">
                        {inquiry.incoterm || ocean?.incoterm || air?.incoterm || 'FOB / CIF / Tiêu chuẩn'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Card: Điều kiện bảo quản đặc biệt (Hàng Lạnh hoặc Hàng Nguy Hiểm) */}
                {(inquiry.cargoClassification === 'Reefer' || inquiry.cargoClassification === 'Hazmat' || coldChain) && (
                  <div className={`p-4 border-t text-xs space-y-2.5 ${
                    inquiry.cargoClassification === 'Reefer' || coldChain
                      ? 'bg-cyan-50/60 border-cyan-200'
                      : 'bg-rose-50/60 border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-black uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
                        {inquiry.cargoClassification === 'Reefer' || coldChain ? (
                          <>
                            <ThermometerSnowflake className="w-4 h-4 text-cyan-700" />
                            <span>Quy Chuẩn Bảo Quản Lạnh & Nhiệt Độ (Reefer Standards)</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-4 h-4 text-rose-700" />
                            <span>Quy Chuẩn An Toàn Hàng Nguy Hiểm (IMO / Hazmat Protocol)</span>
                          </>
                        )}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white border border-current/20">
                        Bắt buộc tuân thủ
                      </span>
                    </div>

                    {/* Reefer Details */}
                    {(inquiry.cargoClassification === 'Reefer' || coldChain) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="p-2.5 rounded-xl bg-white border border-cyan-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Dải nhiệt độ cài đặt</span>
                          <span className="font-extrabold text-cyan-950 mt-0.5 block">
                            {inquiry.temperatureRequirement || coldChain?.temperatureCategory || 'Chưa cài đặt cụ thể'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-cyan-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Kiểm soát độ ẩm (% RH)</span>
                          <span className="font-extrabold text-cyan-950 mt-0.5 block">
                            {warehousing?.customHumidity || warehousing?.humidityRequirement || (coldChain?.humidityControl ? `${coldChain.humidityPercentage || 65}% RH` : 'Theo chuẩn kho lạnh')}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-cyan-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Nhiệt độ hàng đầu vào</span>
                          <span className="font-extrabold text-emerald-800 mt-0.5 block">
                            {warehousing?.inboundTemperatureState === 'NEED_COOLING' ? '⚡ Cần làm lạnh cấp tốc' : '✓ Hàng đã đạt chuẩn'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-cyan-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Máy phát Genset / GDP</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">
                            {coldChain?.continuousGenset ? '✓ Genset liên tục' : coldChain?.gdpPharmaCompliant ? '✓ Chuẩn GDP Pharma' : '✓ Theo tiêu chuẩn lạnh'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Hazmat Details */}
                    {inquiry.cargoClassification === 'Hazmat' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Phân loại DG Class</span>
                          <span className="font-extrabold text-rose-900 mt-0.5 block">{inquiry.dgClassIMO || 'Chưa khai báo'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Mã số UN</span>
                          <span className="font-mono font-black text-slate-900 mt-0.5 block">{inquiry.unNumber || 'UN N/A'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Nhóm đóng gói</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{inquiry.packingGroup || 'PG II'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Điểm chớp cháy / MSDS</span>
                          <span className="font-extrabold text-slate-900 truncate mt-0.5 block" title={inquiry.msdsFileName || inquiry.flashPoint || ''}>
                            {inquiry.flashPoint ? `Flash Point: ${inquiry.flashPoint}` : inquiry.msdsFileName ? `File: ${inquiry.msdsFileName}` : 'Đầy đủ hồ sơ'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* KHỐI 3: THÔNG TIN VẬN HÀNH & KỸ THUẬT (OPERATIONS & SERVICE SPECS)        */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                    <span>3. Thông Tin Vận Hành & Yêu Cầu Kỹ Thuật (Operations & Service Specs)</span>
                  </span>
                  <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                    {getServiceNameVi(inquiry.serviceType)}
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  
                  {/* 3.1. Tuyến Đường & Hành Trình Vận Chuyển */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Route className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Hành Trình Tuyến Điểm & Điều Khoản Giao Nhận</span>
                      </span>
                      <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {isMultiPoint ? `${totalPickupCount} Điểm Bốc ➔ ${totalDeliveryCount} Điểm Dỡ` : 'Tuyến Điểm - Điểm'}
                      </span>
                    </div>

                    {/* Timeline Route Flow A -> B */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      
                      {/* Point A: Origin */}
                      <div className="p-3 rounded-xl bg-white border border-emerald-200/90 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black">A</span>
                            <span>
                              {isOcean ? (isLcl ? 'Kho CFS Bốc Hàng (Origin CFS)' : 'Cảng Bốc Hàng (POL)') :
                               inquiry.serviceType === 'Air Freight' ? 'Sân Bay Đi (AOD)' :
                               inquiry.serviceType === 'Warehousing' ? 'Khu Vực Kho Cần Thuê' :
                               inquiry.serviceType === 'Customs Clearance' ? 'Địa Điểm Làm Thủ Tục Hải Quan' :
                               'Điểm Bốc Hàng (Origin)'}
                            </span>
                          </span>
                          {(ocean?.originServiceTerm || air?.originServiceTerm) && (
                            <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Term: {ocean?.originServiceTerm || air?.originServiceTerm}
                            </span>
                          )}
                        </div>
                        <p className="font-black text-slate-900 text-xs">
                          {inquiry.origin || 'Chưa chỉ định điểm đi'}
                        </p>

                        {/* Multi-pickup list if any */}
                        {isTrucking && trucking?.pickupLocations && trucking.pickupLocations.length > 1 && (
                          <div className="mt-2 pt-1.5 border-t border-emerald-100 space-y-0.5">
                            <span className="text-[9.5px] font-black text-emerald-900 uppercase block">Lộ trình {trucking.pickupLocations.length} điểm bốc:</span>
                            {trucking.pickupLocations.map((p, idx) => (
                              <p key={idx} className="text-[10.5px] text-slate-700 font-medium truncate">• #{idx + 1}: {p}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Point B: Destination */}
                      <div className="p-3 rounded-xl bg-white border border-rose-200/90 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-black">B</span>
                            <span>
                              {isOcean ? (isLcl ? 'Kho CFS Đích (Destination CFS)' : 'Cảng Dỡ Hàng (POD)') :
                               inquiry.serviceType === 'Air Freight' ? 'Sân Bay Đến (AOA)' :
                               inquiry.serviceType === 'Warehousing' ? 'Phạm Vi Phân Phối Trọng Tâm' :
                               inquiry.serviceType === 'Customs Clearance' ? 'Nơi Bàn Giao Hồ Sơ / Hàng' :
                               'Điểm Giao Hàng (Destination)'}
                            </span>
                          </span>
                          {(ocean?.destinationServiceTerm || air?.destinationServiceTerm) && (
                            <span className="text-[9.5px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              Term: {ocean?.destinationServiceTerm || air?.destinationServiceTerm}
                            </span>
                          )}
                        </div>
                        <p className="font-black text-slate-900 text-xs">
                          {inquiry.destination || 'Chưa chỉ định điểm đến'}
                        </p>

                        {/* Multi-delivery list if any */}
                        {isTrucking && trucking?.deliveryLocations && trucking.deliveryLocations.length > 1 && (
                          <div className="mt-2 pt-1.5 border-t border-rose-100 space-y-0.5">
                            <span className="text-[9.5px] font-black text-rose-900 uppercase block">Lộ trình {trucking.deliveryLocations.length} điểm giao:</span>
                            {trucking.deliveryLocations.map((d, idx) => (
                              <p key={idx} className="text-[10.5px] text-slate-700 font-medium truncate">• #{idx + 1}: {d}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3.2. Cấu Hình Kỹ Thuật & Phương Tiện Chuyên Sâu (Ánh Xạ Động Theo Dịch Vụ) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Cấu Hình Phương Tiện & Nghiệp Vụ Chuyên Ngành</span>
                    </span>

                    {/* 1. TRUCKING */}
                    {isTrucking && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Hình thức vận tải</span>
                          <span className="font-extrabold text-indigo-950 mt-0.5 block">{trucking?.loadType || 'FTL (Nguyên chuyến)'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Loại xe / Thùng xe</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{trucking?.truckType || 'Xe tải thùng kín tiêu chuẩn'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Phân khúc tải trọng</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{trucking?.tonnageCategory || '5.0 Tấn'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Số lượng xe yêu cầu</span>
                          <span className="font-extrabold text-indigo-900 mt-0.5 block">{trucking?.truckCount || 1} Xe</span>
                        </div>
                        {trucking?.vehicleSpecsRequirement && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2 lg:col-span-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Yêu cầu phương tiện đặc biệt</span>
                            <span className="font-bold text-slate-800 mt-0.5 block">{trucking.vehicleSpecsRequirement}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. OCEAN FREIGHT */}
                    {isOcean && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Hình thức đóng cont</span>
                          <span className="font-extrabold text-blue-900 mt-0.5 block">{ocean?.mode || (isLcl ? 'LCL (Hàng lẻ gom CFS)' : 'FCL (Full Container)')}</span>
                        </div>
                        {isFcl && (
                          <>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Loại vỏ Container</span>
                              <span className="font-extrabold text-slate-900 mt-0.5 block">{ocean?.containerType || '40ft High Cube (40HC)'}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Số lượng vỏ Cont</span>
                              <span className="font-extrabold text-indigo-900 mt-0.5 block">{ocean?.containerCount || 1} Cont</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Yêu cầu Free Dem/Det</span>
                              <span className="font-extrabold text-emerald-800 mt-0.5 block">{ocean?.freeDemDetDaysRequested ? `${ocean.freeDemDetDaysRequested} Ngày` : '14 Ngày'}</span>
                            </div>
                          </>
                        )}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Điều khoản dịch vụ (Term)</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{ocean?.serviceTerm || 'CY-CY (Cảng - Cảng)'}</span>
                        </div>
                        {ocean?.preferredCarrier && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Hãng tàu chỉ định</span>
                            <span className="font-bold text-slate-900 mt-0.5 block">{ocean.preferredCarrier}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. AIR FREIGHT */}
                    {inquiry.serviceType === 'Air Freight' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Phân loại dịch vụ bay</span>
                          <span className="font-extrabold text-sky-900 mt-0.5 block">{air?.serviceTypeCategory || 'Air Cargo Tiêu Chuẩn'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Gói thời gian bay</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{air?.serviceLevel || 'Standard (2-3 ngày)'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Trọng lượng tính cước</span>
                          <span className="font-extrabold text-sky-900 mt-0.5 block">{air?.chargeableWeightKgs ? `${air.chargeableWeightKgs} kg CW` : 'Theo thực tế'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Ký nhận tận tay</span>
                          <span className="font-bold text-emerald-800 mt-0.5 block">{air?.requireSignature ? '✓ Bắt buộc chữ ký' : 'Tiêu chuẩn'}</span>
                        </div>
                      </div>
                    )}

                    {/* 4. WAREHOUSING */}
                    {inquiry.serviceType === 'Warehousing' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Loại hình kho thuê</span>
                          <span className="font-extrabold text-purple-950 mt-0.5 block">{warehousing?.warehouseType || 'Kho Thường Tiêu Chuẩn (Grade A)'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Đơn vị tính thuê kho</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{warehousing?.pricingMetric || 'Theo m² sàn / tháng'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Quy mô diện tích / Pallet</span>
                          <span className="font-extrabold text-indigo-900 mt-0.5 block">
                            {warehousing?.storageAreaSqm ? `${warehousing.storageAreaSqm} m²` : warehousing?.palletPositions ? `${warehousing.palletPositions} Pallets` : '1.000 m²'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Tích hợp WMS & SKU</span>
                          <span className="font-bold text-emerald-800 mt-0.5 block">
                            {warehousing?.skuCount ? `${warehousing.skuCount} SKU` : '✓ Tích hợp WMS'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 5. CUSTOMS CLEARANCE */}
                    {inquiry.serviceType === 'Customs Clearance' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Loại hình tờ khai</span>
                          <span className="font-extrabold text-amber-900 mt-0.5 block">{customs?.declarationType || 'A11 (Nhập kinh doanh tiêu dùng)'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Chi cục HQ mở tờ khai</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{customs?.customsSubDepartment || inquiry.origin || 'Chi cục HQ Cát Lái'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Chứng nhận xuất xứ (C/O)</span>
                          <span className="font-bold text-indigo-900 mt-0.5 block">{customs?.coRequirement || 'Không yêu cầu'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Kiểm tra chuyên ngành</span>
                          <span className="font-bold text-rose-900 mt-0.5 block">{customs?.specializedInspection || 'Không có'}</span>
                        </div>
                      </div>
                    )}

                    {/* 6. CROSS-BORDER */}
                    {inquiry.serviceType === 'Cross-border' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Tuyến hành lang</span>
                          <span className="font-extrabold text-orange-950 mt-0.5 block">{crossBorder?.countryPair || 'Vietnam - China'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Cửa khẩu thông quan</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{crossBorder?.borderGate || 'Cửa khẩu Quốc tế Hữu Nghị'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Phương thức vận tải</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{crossBorder?.cargoMode || 'Xe Liên Vận GMS'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Thủ tục hải quan 2 đầu</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{crossBorder?.transitCustomsScope || 'Thủ tục 2 đầu trọn gói'}</span>
                        </div>
                      </div>
                    )}

                    {/* 7. RAIL FREIGHT */}
                    {inquiry.serviceType === 'Rail Freight' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Hình thức vận tải ga</span>
                          <span className="font-extrabold text-indigo-950 mt-0.5 block">{rail?.mode || 'FCL Ga - Ga'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Hành lang đường sắt</span>
                          <span className="font-extrabold text-slate-900 mt-0.5 block">{rail?.corridorType || 'Tuyến Bắc - Nam'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Loại toa / Cont ga</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{rail?.wagonOrContType || 'Cont 40HC Đường Sắt'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Dịch vụ kéo Drayage</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{rail?.drayageService || 'Door-to-Door'}</span>
                        </div>
                      </div>
                    )}

                    {/* 8. PROJECT CARGO */}
                    {inquiry.serviceType === 'Project Cargo' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Mô hình dự án</span>
                          <span className="font-extrabold text-indigo-950 mt-0.5 block">{project?.projectType || 'Distribution Tender'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Phạm vi công việc</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">{project?.scopeOfWork || 'Vận chuyển trọn gói'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Cam kết đoàn xe</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">{project?.fleetCommitment || 'Theo kế hoạch'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Tiêu chuẩn KPI/SLA</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">{project?.kpiSla || 'SLA 98%'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* ========================================================================= */}
              {/* KHỐI 4: THÔNG TIN KHÁC (COMMERCIAL TERMS, TIMINGS, NOTES & ATTACHMENTS)    */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>4. Thông Tin Khác (Commercial Terms, Timings, Notes & Attachments)</span>
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    Thời hạn & Hồ sơ khảo sát
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  
                  {/* Row 1: Commercial Model & Key Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Mô hình báo giá</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-extrabold text-slate-900 text-xs">
                          {inquiry.pricingType === 'CONTRACT' ? 'Hợp đồng dài hạn' : 'Chuyến đơn lẻ (Spot)'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          inquiry.pricingType === 'CONTRACT' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {inquiry.pricingType === 'CONTRACT' ? 'CONTRACT' : 'SPOT'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Kỳ hạn & Sản lượng cam kết</span>
                      <span className="font-extrabold text-slate-800 text-xs mt-1 block">
                        {inquiry.pricingType === 'CONTRACT' 
                          ? `${inquiry.contractTerm || '12 tháng'} • ${inquiry.volumeCommitment || inquiry.contractVolume || 'Theo kế hoạch'}` 
                          : 'Theo từng chuyến đặt xe'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Thời gian lấy hàng dự kiến</span>
                      <span className="font-extrabold text-slate-900 text-xs mt-1 block">
                        {inquiry.pickupDate || 'Linh hoạt theo thỏa thuận'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Hạn chót nhận báo giá</span>
                      <span className="font-extrabold text-amber-800 text-xs mt-1 block">
                        {inquiry.expiryDate || 'Trong 48 giờ'}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Customer Special Notes (if any) */}
                  {inquiry.description && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10.5px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Ghi Chú Vận Hành & Dặn Dò Riêng Của Khách Hàng:</span>
                      </span>
                      <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 italic text-slate-800 leading-relaxed text-xs">
                        "{inquiry.description}"
                      </div>
                    </div>
                  )}

                  {/* Row 3: Attachments List (if any) */}
                  {inquiry.attachments && inquiry.attachments.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Hồ Sơ & Tài Liệu Đính Kèm Khảo Sát ({inquiry.attachments.length} tệp tin):</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {inquiry.attachments.map((att) => (
                          <div key={att.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 group hover:border-indigo-300 transition-colors">
                            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                              {att.type === 'excel' ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-extrabold text-slate-800 truncate text-xs" title={att.name}>{att.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{att.size} • {att.uploadedDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: BẢNG NIÊM YẾT & CẤU TRÚC BÁO GIÁ (TARIFF & QUOTATION SHEET)          */}
          {/* ========================================================================= */}
          {activeTab === 'tariff_sheet' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* TARIFF SHEET TABLE (GRID TABLE THEO FORM NHÀ CUNG CẤP VỚI CỘT BORDER RÕ RÀNG) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-fit max-w-full">
                <div className="overflow-x-auto custom-matrix-scroll">
                  <table className="border-collapse text-xs text-left border-spacing-0 table-fixed" style={{ width: 'max-content' }}>
                    {/* CỐ ĐỊNH KÍCH THƯỚC CỘT CHUẨN FORM BIỂU GIÁ NHÀ CUNG CẤP */}
                    <colgroup>
                      <col style={{ width: '320px', minWidth: '320px', maxWidth: '320px' }} />
                      <col style={{ width: '110px', minWidth: '110px', maxWidth: '110px' }} />
                      <col style={{ width: '280px', minWidth: '280px', maxWidth: '280px' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 border-r border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-700" />
                            <span>CỘT 1: HẠNG MỤC CHI PHÍ BÁO GIÁ</span>
                          </div>
                        </th>
                        <th className="py-3 px-3 text-center border-r border-slate-200">
                          CỘT 2: ĐVT
                        </th>
                        <th className="py-2.5 px-3 text-center bg-indigo-50/60 border-r border-slate-200">
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-100/80 border border-indigo-200 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                              {getCol3HeaderConfig().tag}
                            </span>
                            <div className="inline-flex items-center gap-1.5 font-extrabold text-slate-800 bg-white border border-slate-300 px-2.5 py-0.5 rounded-lg text-xs shadow-2xs max-w-full truncate">
                              <span className="truncate">{getCol3HeaderConfig().label}</span>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      
                      {/* TỔNG CƯỚC DỰ KIẾN (ALL-IN FREIGHT) */}
                      <tr className="bg-sky-50/60 hover:bg-sky-50/90 transition-colors">
                        <td className="py-3 px-4 border-r border-slate-200 font-black text-slate-900">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="text-xs font-black text-slate-900">Tổng Cước Dự Kiến (All-in Freight)</span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 font-normal mt-0.5 pl-6">
                            Cước cơ bản cộng toàn bộ phụ phí theo tender
                          </p>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 font-extrabold text-slate-900">
                          {getTariffMainUnit()}
                        </td>
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-base font-black text-slate-900 tracking-tight">
                              {inquiry.targetBudget ? `${inquiry.targetBudget} ${inquiry.currency || ''}` : (isOcean ? '$2,450' : 'Thỏa thuận theo tender')}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                              {getTariffMainUnit()}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* CƯỚC VẬN CHUYỂN CƠ BẢN */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 border-r border-slate-200">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            {getServiceIcon(inquiry.serviceType)}
                            <span className="font-black text-slate-900 text-xs">
                              {getServiceMainFreightTitle()}
                            </span>
                            <span className="px-1.5 py-0.5 text-[9.5px] bg-rose-50 text-rose-700 font-bold rounded border border-rose-200">
                              Bắt buộc
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 mt-0.5 pl-6">
                            Đơn giá cước vận chuyển chặng chính
                          </p>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 font-semibold text-slate-700">
                          {getTariffMainUnit()}
                        </td>
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <div className="inline-flex items-center justify-between gap-2 w-full bg-white border border-slate-300 rounded-lg px-3 py-1 shadow-2xs">
                            <span className="text-slate-400 font-bold">{isOcean ? '$' : '₫'}</span>
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              {isOcean ? '2,215' : 'Supplier chào giá'}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* 1. PHỤ PHÍ HÃNG TÀU / VẬN HÀNH / ĐỊA PHƯƠNG */}
                      <tr className="bg-slate-100/90 font-black text-slate-800 text-[11px] uppercase tracking-wider border-t-2 border-slate-200">
                        <td colSpan={3} className="py-2 px-4 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{getServiceSection1Title()}</span>
                            {inquiry.requestedSurcharges && inquiry.requestedSurcharges.length > 0 && (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 lowercase tracking-normal">
                                {inquiry.requestedSurcharges.length} mục đã chỉ định
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {inquiry.requestedSurcharges && inquiry.requestedSurcharges.length > 0 ? (
                        inquiry.requestedSurcharges.map((charge, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 px-4 border-r border-slate-200">
                              <div className="font-medium text-slate-800 flex items-center gap-2 pl-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{charge}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-center border-r border-slate-200 font-semibold text-slate-600">
                              {getSurchargeUnit(charge)}
                            </td>
                            <td className="py-2 px-4 text-center border-r border-slate-200">
                              <div className="inline-flex items-center justify-between gap-2 w-full bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                                <span className="text-slate-400 font-bold">{isOcean ? '$' : '₫'}</span>
                                <span className="font-mono font-bold text-slate-700 text-xs">
                                  {isOcean ? (charge.toLowerCase().includes('thc') ? '120' : charge.toLowerCase().includes('b/l') ? '40' : charge.toLowerCase().includes('seal') ? '10' : '65') : '0'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 border-r border-slate-200 font-semibold text-slate-600 italic pl-6">
                            Theo biểu phí phụ phí chuẩn ban hành của nhà vận tải / cảng biển.
                          </td>
                          <td className="py-2.5 px-3 text-center border-r border-slate-200 text-slate-400">—</td>
                          <td className="py-2.5 px-4 text-center border-r border-slate-200">
                            <div className="inline-flex items-center justify-center w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-500 font-medium text-xs">
                              Chuẩn hãng
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* 2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) */}
                      <tr className="bg-purple-50/70 font-black text-slate-800 text-[11px] uppercase tracking-wider border-t-2 border-purple-100">
                        <td colSpan={3} className="py-2 px-4 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span>{getServiceSection2Title()}</span>
                            {inquiry.selectedVAS && inquiry.selectedVAS.length > 0 && (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md border border-purple-200 lowercase tracking-normal">
                                {inquiry.selectedVAS.length} dịch vụ
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {inquiry.selectedVAS && inquiry.selectedVAS.length > 0 ? (
                        inquiry.selectedVAS.map((vas, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 px-4 border-r border-slate-200">
                              <div className="font-medium text-slate-800 flex items-center gap-2 pl-2">
                                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                <span>{vas}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-center border-r border-slate-200 font-semibold text-slate-600">
                              {getVasUnit(vas)}
                            </td>
                            <td className="py-2 px-4 text-center border-r border-slate-200">
                              <div className="inline-flex items-center justify-between gap-2 w-full bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                                <span className="text-slate-400 font-bold">{isOcean ? '$' : '₫'}</span>
                                <span className="font-mono font-bold text-slate-700 text-xs">0</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 border-r border-slate-200 font-semibold text-slate-500 italic pl-6">
                            Không yêu cầu thêm dịch vụ giá trị gia tăng phụ trợ.
                          </td>
                          <td className="py-2.5 px-3 text-center border-r border-slate-200 text-slate-400">—</td>
                          <td className="py-2.5 px-4 text-center border-r border-slate-200">
                            <div className="inline-flex items-center justify-center w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-400 font-medium text-xs">
                              Không áp dụng
                            </div>
                          </td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {!isPublished ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Quay Lại Chỉnh Sửa Form</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Đóng & Về Danh Sách RFQ</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick tab switcher in footer */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'profile_cargo' ? 'tariff_sheet' : 'profile_cargo')}
              className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <span>Xem {activeTab === 'profile_cargo' ? 'Tab 2: Bảng Niêm Yết Giá →' : '← Tab 1: Khách Hàng & Hàng Hóa'}</span>
            </button>

            {isPublished ? (
              <button
                type="button"
                id="btn-share-rfq"
                onClick={handleCopyLink}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-[0.98] ${
                  copiedLink
                    ? 'bg-slate-900 text-emerald-300 ring-2 ring-emerald-400 shadow-slate-900/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30 hover:scale-[1.02]'
                }`}
              >
                {copiedLink ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>Đã Sao Chép Link Lead Board!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-white" />
                    <span>Chia Sẻ RFQ (Gửi Nhà Cung Cấp Ngoài)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                id="btn-confirm-publish-inquiry"
                onClick={handleConfirmPublish}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Xác Nhận Phát Hành Yêu Cầu (Confirm & Publish)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
