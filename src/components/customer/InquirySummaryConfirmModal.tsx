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
  const isTruckingLtl = isTrucking && (trucking?.loadType?.includes('LTL') || inquiry.title?.toLowerCase().includes('ltl'));
  const isLcl = inquiry.serviceType === 'Sea Freight (LCL)' || ocean?.mode?.includes('LCL') || inquiry.title?.toLowerCase().includes('lcl');
  const isFcl = (inquiry.serviceType === 'Sea Freight (FCL)' || ocean?.mode?.includes('FCL')) && !isLcl;
  const isOcean = isFcl || isLcl;
  const isRailLcl = inquiry.serviceType === 'Rail Freight' && (rail?.mode?.includes('LCL') || inquiry.title?.toLowerCase().includes('lcl'));
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
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'profile_cargo'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Tab 1: Thông tin yêu cầu</span>
            </button>

            <button
              type="button"
              id="tab-btn-tariff-sheet"
              onClick={() => setActiveTab('tariff_sheet')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'tariff_sheet'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Tab 2: Chi tiết báo giá</span>
            </button>
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
          {/* TAB 1: THÔNG TIN CHI TIẾT YÊU CẦU BÁO GIÁ (4 NHÓM DỮ LIỆU LIỀN MẠCH)        */}
          {/* ========================================================================= */}
          {activeTab === 'profile_cargo' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-7 text-xs text-slate-800 animate-in fade-in duration-150">
              
              {/* ========================================================================= */}
              {/* NHÓM 1: THÔNG TIN KHÁCH HÀNG                                              */}
              {/* ========================================================================= */}
              <div className="space-y-3">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    1. THÔNG TIN KHÁCH HÀNG
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Đơn vị công tác:</span>
                    <span className="font-normal text-slate-800">{customerCompanyName}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã số thuế (MST):</span>
                    <span className="font-normal text-slate-800">{inquiry.taxCode || '0314988234'}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Người phụ trách:</span>
                    <span className="font-normal text-slate-800">{customerContactName}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Chức vụ:</span>
                    <span className="font-normal text-slate-800">{currentUser?.roleTitle || 'Supply Chain Lead / Logistics Manager'}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số điện thoại liên hệ:</span>
                    <span className="font-normal text-slate-800">{customerPhone}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Email liên hệ:</span>
                    <span className="font-normal text-slate-800 truncate" title={customerEmail}>{customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* NHÓM 2: THÔNG TIN SẢN PHẨM & HÀNG HÓA                                     */}
              {/* ========================================================================= */}
              <div className="space-y-3 pt-2">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    2. THÔNG TIN SẢN PHẨM & HÀNG HÓA
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {/* Common cargo fields in sequence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phân loại nhóm hàng:</span>
                      <span className="font-normal text-slate-800">
                        {inquiry.cargoClassification === 'Reefer'
                          ? 'Hàng Đông Lạnh / Kiểm Soát Nhiệt Độ'
                          : inquiry.cargoClassification === 'Hazmat'
                          ? 'Hàng Nguy Hiểm & Hóa Chất (Hazmat/DG)'
                          : 'Hàng Thông Thường (General Cargo)'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Ngành hàng:</span>
                      <span className="font-normal text-slate-800">{inquiry.industry || 'Hàng tiêu dùng FMCG & Công nghiệp'}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tên mặt hàng cụ thể:</span>
                      <span className="font-normal text-slate-800">{inquiry.cargoType || 'Theo danh mục khai báo'}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Quy cách đóng gói:</span>
                      <span className="font-normal text-slate-800">{inquiry.packaging || 'Đóng Pallet tiêu chuẩn'}</span>
                    </div>

                    {/* Khả năng xếp chồng: Only show if explicitly provided (e.g. LTL/LCL ghép hàng), do NOT show for FTL */}
                    {inquiry.stackable !== undefined && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Khả năng xếp chồng:</span>
                        <span className="font-normal text-slate-800">
                          {inquiry.stackable
                            ? 'Có thể xếp chồng (Stackable)'
                            : 'Không được xếp chồng'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Khối lượng Gross:</span>
                      <span className="font-normal text-slate-800">
                        {isTruckingLtl && trucking?.ltlGrossWeightKg
                          ? `${trucking.ltlGrossWeightKg.toLocaleString('vi-VN')} kg`
                          : (inquiry.ftlWeightKg && inquiry.ftlWeightKg !== '0' && inquiry.ftlWeightKg !== '0.0')
                          ? `${inquiry.ftlWeightKg} kg` 
                          : ocean?.lclGrossWeightKg 
                          ? `${ocean.lclGrossWeightKg.toLocaleString('vi-VN')} kg` 
                          : rail?.lclGrossWeightKg
                          ? `${rail.lclGrossWeightKg.toLocaleString('vi-VN')} kg`
                          : air?.grossWeightKgs 
                          ? `${air.grossWeightKgs.toLocaleString('vi-VN')} kg` 
                          : inquiry.weightVolume || 'Theo tải trọng phương tiện'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tổng thể tích:</span>
                      <span className="font-normal text-slate-800">
                        {isTruckingLtl && trucking?.ltlCbm
                          ? `${trucking.ltlCbm} CBM`
                          : inquiry.ftlVolumeCbm 
                          ? `${inquiry.ftlVolumeCbm} CBM` 
                          : ocean?.lclCbm 
                          ? `${ocean.lclCbm} CBM` 
                          : rail?.lclCbm
                          ? `${rail.lclCbm} CBM`
                          : inquiry.cbmVolume
                          ? `${inquiry.cbmVolume} CBM`
                          : 'Theo dung tích thùng xe'}
                      </span>
                    </div>

                    {inquiry.hsCode && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã HS Code:</span>
                        <span className="font-normal text-slate-800">{inquiry.hsCode}</span>
                      </div>
                    )}

                    {inquiry.cargoValue && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trị giá khai báo:</span>
                        <span className="font-normal text-slate-800">{inquiry.cargoValue} {inquiry.cargoValueCurrency || 'USD'}</span>
                      </div>
                    )}
                  </div>

                  {/* LTL / LCL specific breakdown */}
                  {(isTruckingLtl || isLcl || isRailLcl || inquiry.packageCount || Boolean(air?.packageCount)) && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-indigo-900 block">Quy cách kiện ghép (LTL / LCL Specs):</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium">Số lượng kiện:</span>
                          <span className="font-normal text-slate-800">
                            {trucking?.ltlPieces || ocean?.lclPieces || rail?.lclPieces || air?.packageCount || inquiry.packageCount || 1} Kiện / Pallet
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium">Kích thước từng kiện:</span>
                          <span className="font-normal text-slate-800">
                            {(() => {
                              const dims = trucking?.ltlDimensions || ocean?.lclDimensions || rail?.lclDimensions || air?.dimensionsCm || inquiry.dimensionsCm;
                              if (typeof dims === 'string' && dims) return dims;
                              if (dims && typeof dims === 'object' && dims.lengthCm) {
                                return `${dims.lengthCm} x ${dims.widthCm || 0} x ${dims.heightCm || 0} cm`;
                              }
                              return 'Tiêu chuẩn kiện hàng';
                            })()}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium">Trọng lượng tính cước (CW):</span>
                          <span className="font-normal text-slate-800">
                            {trucking?.ltlChargeableWeightKg || trucking?.chargeableWeightKg 
                              ? `${(trucking.ltlChargeableWeightKg || trucking.chargeableWeightKg).toLocaleString('vi-VN')} kg (Quy đổi 1 CBM = 250 kg)` 
                              : ocean?.lclRevenueTon 
                              ? `${ocean.lclRevenueTon} RT (${ocean.lclChargeableWeightKg ? ocean.lclChargeableWeightKg.toLocaleString('vi-VN') + ' kg' : ''})` 
                              : rail?.lclRevenueTon
                              ? `${rail.lclRevenueTon} RT (${rail.lclChargeableWeightKg ? rail.lclChargeableWeightKg.toLocaleString('vi-VN') + ' kg' : ''})`
                              : air?.chargeableWeightKgs 
                              ? `${air.chargeableWeightKgs.toLocaleString('vi-VN')} kg CW` 
                              : 'Theo thể tích thực tế'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reefer specific properties */}
                  {(inquiry.cargoClassification === 'Reefer' || coldChain) && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-cyan-950 block">Yêu cầu bảo quản lạnh & nhiệt độ (Reefer Specs):</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-xs bg-cyan-50/40 p-3 rounded-xl border border-cyan-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-cyan-800/70 font-medium min-w-[140px] shrink-0">Dải nhiệt độ yêu cầu:</span>
                          <span className="font-normal text-slate-800">{inquiry.temperatureRequirement || coldChain?.temperatureCategory || '+2°C ~ +8°C'}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-cyan-800/70 font-medium min-w-[140px] shrink-0">Duy trì điện liên tục:</span>
                          <span className="font-normal text-slate-800">{coldChain?.continuousGenset ? 'Máy phát Clip-on Genset liên tục' : 'Cắm điện bãi Plug-in khi dừng đỗ'}</span>
                        </div>
                        {coldChain?.humidityControl && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-cyan-800/70 font-medium min-w-[140px] shrink-0">Kiểm soát độ ẩm:</span>
                            <span className="font-normal text-slate-800">{coldChain.humidityPercentage || 65}% RH</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hazmat specific properties */}
                  {inquiry.cargoClassification === 'Hazmat' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-rose-950 block">Thông số hàng nguy hiểm & hóa chất (Hazmat / DG Specs):</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-xs bg-rose-50/40 p-3 rounded-xl border border-rose-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Nhóm nguy hiểm (IMO Class):</span>
                          <span className="font-normal text-slate-800">{inquiry.dgClassIMO || 'IMO Class 3 (Chất lỏng dễ cháy)'}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Mã số UN:</span>
                          <span className="font-normal text-slate-800">{inquiry.unNumber || 'UN 1263'}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Nhóm đóng gói:</span>
                          <span className="font-normal text-slate-800">{inquiry.packingGroup || 'Packing Group II'}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Điểm chớp cháy:</span>
                          <span className="font-normal text-slate-800">{inquiry.flashPoint ? `${inquiry.flashPoint}°C` : 'N/A'}</span>
                        </div>
                        {inquiry.msdsFileName && (
                          <div className="flex items-baseline gap-2 md:col-span-2">
                            <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Tài liệu MSDS:</span>
                            <span className="font-normal text-slate-800">📄 {inquiry.msdsFileName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special preservation note if present */}
                  {inquiry.specialHandlingInstructions && (
                    <div className="flex items-baseline gap-2 pt-1 text-xs">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Yêu cầu bảo quản riêng:</span>
                      <span className="font-normal text-slate-800">{inquiry.specialHandlingInstructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* NHÓM 3: THÔNG TIN VẬN HÀNH & KỸ THUẬT                                     */}
              {/* ========================================================================= */}
              <div className="space-y-3 pt-2">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    3. THÔNG TIN VẬN HÀNH & KỸ THUẬT
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Service & Model */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                      <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mô hình vận hành:</span>
                      <span className="font-normal text-slate-800">
                        {isTrucking 
                          ? (trucking?.loadType || 'Nguyên Chuyến (FTL)')
                          : isOcean 
                          ? (isLcl ? 'Ghép Hàng Lẻ (LCL)' : 'Nguyên Container (FCL)')
                          : inquiry.serviceType}
                      </span>
                    </div>
                  </div>

                  {/* Route & Multi-stop details: Side-by-side parallel columns */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                      Hành trình giao nhận:
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                      {/* Cột 1: Điểm Lấy Hàng (Pickup) */}
                      <div className="space-y-2 border-l-2 border-emerald-500 pl-3">
                        <div className="font-black text-xs text-emerald-900">
                          Điểm Lấy Hàng (Pickup)
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-800">
                          <div>
                            <span className="text-slate-500 font-medium block text-[11px]">• Địa chỉ kho xuất hàng chính:</span>
                            <span className="font-normal text-slate-800 block pl-3">
                              {inquiry.origin || 'Chưa chỉ định'}
                            </span>
                          </div>
                          {isTrucking && trucking?.pickupLocations && trucking.pickupLocations.length > 1 && (
                            <div className="space-y-1.5 pt-0.5">
                              {trucking.pickupLocations.slice(1).map((p, idx) => (
                                <div key={idx}>
                                  <span className="text-slate-500 font-medium block text-[11px]">• Điểm lấy {idx + 2} (Kho phụ / Gom thêm):</span>
                                  <span className="font-normal text-slate-800 block pl-3">
                                    {p || `Kho phụ ${idx + 2}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cột 2: Điểm Giao Hàng (Delivery) - Song song cùng hàng */}
                      <div className="space-y-2 border-l-2 border-rose-500 pl-3">
                        <div className="font-black text-xs text-rose-900">
                          Điểm Giao Hàng (Delivery)
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-800">
                          <div>
                            <span className="text-slate-500 font-medium block text-[11px]">• Địa chỉ kho đích chính:</span>
                            <span className="font-normal text-slate-800 block pl-3">
                              {inquiry.destination || 'Chưa chỉ định'}
                            </span>
                          </div>
                          {isTrucking && trucking?.deliveryLocations && trucking.deliveryLocations.length > 1 && (
                            <div className="space-y-1.5 pt-0.5">
                              {trucking.deliveryLocations.slice(1).map((d, idx) => (
                                <div key={idx}>
                                  <span className="text-slate-500 font-medium block text-[11px]">• Điểm giao {idx + 2} (Đại lý / Cửa hàng phụ):</span>
                                  <span className="font-normal text-slate-800 block pl-3">
                                    {d || `Điểm giao ${idx + 2}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle configuration */}
                  <div className="space-y-2 pt-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                      Cấu hình phương tiện yêu cầu:
                    </span>

                    {isTrucking && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại Thùng Phương Tiện:</span>
                          <span className="font-normal text-slate-800">{trucking?.truckType || 'Theo thỏa thuận'}</span>
                        </div>
                        
                        {!isTruckingLtl && trucking?.tonnageCategory && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phân Khúc Tải Trọng:</span>
                            <span className="font-normal text-slate-800">{trucking.tonnageCategory}</span>
                          </div>
                        )}

                        {!isTruckingLtl && trucking?.dimensionsMin && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kích thước lòng thùng:</span>
                            <span className="font-normal text-slate-800">
                              {trucking.dimensionsMin}
                            </span>
                          </div>
                        )}

                        {(trucking?.requestedLeadtime || trucking?.transitTimeMax) && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời Gian Giao Hàng (SLA):</span>
                            <span className="font-normal text-slate-800">{trucking.requestedLeadtime || trucking.transitTimeMax}</span>
                          </div>
                        )}

                        {trucking?.requestedLeadtimeNote && (
                          <div className="flex items-baseline gap-2 md:col-span-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Ghi chú thời gian giao nhận:</span>
                            <span className="font-normal text-slate-800">{trucking.requestedLeadtimeNote}</span>
                          </div>
                        )}

                        {trucking?.vehicleSpecsRequirement && (
                          <div className="flex items-baseline gap-2 md:col-span-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Yêu cầu dỡ hàng / Kỹ thuật:</span>
                            <span className="font-normal text-slate-800">{trucking.vehicleSpecsRequirement}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {isOcean && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại vỏ Container:</span>
                          <span className="font-normal text-slate-800">{ocean?.containerType || (isLcl ? 'LCL CFS' : '40HC')}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều khoản dịch vụ:</span>
                          <span className="font-normal text-slate-800">{ocean?.serviceTerm || 'CY-CY'}</span>
                        </div>
                        {ocean?.freeDemDetDaysRequested && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Yêu cầu Free Dem/Det:</span>
                            <span className="font-normal text-slate-800">{ocean.freeDemDetDaysRequested} Ngày</span>
                          </div>
                        )}
                        {ocean?.preferredCarrier && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hãng tàu chỉ định:</span>
                            <span className="font-normal text-slate-800">{ocean.preferredCarrier}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {inquiry.serviceType === 'Air Freight' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Gói dịch vụ bay:</span>
                          <span className="font-normal text-slate-800">{air?.serviceTypeCategory || 'Air Cargo Tiêu Chuẩn'}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tốc độ hành trình:</span>
                          <span className="font-normal text-slate-800">{air?.serviceLevel || 'Standard (2-3 ngày)'}</span>
                        </div>
                      </div>
                    )}

                    {inquiry.serviceType === 'Warehousing' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình kho:</span>
                          <span className="font-normal text-slate-800">{warehousing?.warehouseType || 'Kho Thường Tiêu Chuẩn'}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Quy mô diện tích / Pallet:</span>
                          <span className="font-normal text-slate-800">{warehousing?.storageAreaSqm ? `${warehousing.storageAreaSqm} m²` : `${warehousing?.palletPositions || 500} Pallets`}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* NHÓM 4: THÔNG TIN LỊCH TRÌNH, SẢN LƯỢNG & MÔ HÌNH BÁO GIÁ                  */}
              {/* ========================================================================= */}
              <div className="space-y-3 pt-2">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    4. THÔNG TIN LỊCH TRÌNH, SẢN LƯỢNG & MÔ HÌNH BÁO GIÁ
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hình thức báo giá:</span>
                      <span className="font-normal text-slate-800">
                        {inquiry.pricingType === 'CONTRACT' ? 'Hợp Đồng Dài Hạn (Contract / Tender)' : 'Chuyến Đơn Lẻ (Spot Quote)'}
                      </span>
                    </div>

                    {isTrucking && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số lượng chuyến cần thuê:</span>
                        <span className="font-normal text-slate-800">
                          {trucking?.loadType === 'LTL (Ghép hàng lẻ)'
                            ? (trucking.ltlShipmentCount ? `${trucking.ltlShipmentCount} ${trucking.ltlFrequencyUnit || 'Chuyến / Tháng'}` : 'Chưa chỉ định')
                            : (trucking?.vehicleCount ? `${trucking.vehicleCount} ${trucking?.vehicleCountUnit || 'Chuyến / Tháng'}` : 'Chưa chỉ định')}
                        </span>
                      </div>
                    )}

                    {inquiry.pricingType === 'CONTRACT' && inquiry.contractTerm && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời hạn hợp đồng:</span>
                        <span className="font-normal text-slate-800">{inquiry.contractTerm}</span>
                      </div>
                    )}

                    {inquiry.pricingType === 'CONTRACT' && (inquiry.volumeCommitment || inquiry.contractVolume) && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tần suất cam kết:</span>
                        <span className="font-normal text-slate-800">
                          {inquiry.volumeCommitment || inquiry.contractVolume}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Schedule Timeline */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-900 block">Mốc thời gian cam kết:</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[11px] block">Hạn chót nhận báo giá:</span>
                        <span className="font-normal text-slate-800 block text-xs">{inquiry.expiryDate || 'Chưa thiết lập'}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[11px] block">Ngày lấy hàng dự kiến:</span>
                        <span className="font-normal text-slate-800 block text-xs">{inquiry.pickupDate || 'Theo thông báo giao nhận'}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[11px] block">Hạn chót giao hàng:</span>
                        <span className="font-normal text-slate-800 block text-xs">{inquiry.deliveryDate || 'Theo cam kết SLA tuyến'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer special note */}
                  {inquiry.description && (
                    <div className="flex items-baseline gap-2 pt-1 text-xs">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Ghi chú đặc thù:</span>
                      <span className="font-normal text-slate-800 italic">"{inquiry.description}"</span>
                    </div>
                  )}

                  {/* Attachments */}
                  {inquiry.attachments && inquiry.attachments.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-slate-400 font-medium block">Hồ sơ & Tài liệu đính kèm ({inquiry.attachments.length} tệp):</span>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {inquiry.attachments.map((att) => (
                          <div key={att.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                            <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="font-normal text-slate-800">{att.name}</span>
                            <span className="text-[10px] text-slate-400">({att.size})</span>
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
                          <span>CỘT 1: HẠNG MỤC CHI PHÍ BÁO GIÁ</span>
                        </th>
                        <th className="py-3 px-3 text-center border-r border-slate-200">
                          CỘT 2: ĐVT
                        </th>
                        <th className="py-2.5 px-3 text-center bg-indigo-50/60 border-r border-slate-200">
                          <div className="flex flex-col items-center justify-center">
                            <div className="inline-flex items-center gap-1.5 font-extrabold text-slate-800 bg-white border border-slate-300 px-2.5 py-1 rounded-lg text-xs shadow-2xs max-w-full truncate">
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
                          <span className="text-xs font-black text-slate-900">Tổng Cước Dự Kiến (All-in Freight)</span>
                          <p className="text-[10.5px] text-slate-500 font-normal mt-0.5">
                            Cước cơ bản cộng toàn bộ phụ phí theo tender
                          </p>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 font-extrabold text-slate-900">
                          {getTariffMainUnit()}
                        </td>
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-base font-black text-slate-900 tracking-tight">
                              {inquiry.targetBudget 
                                ? (inquiry.targetBudget.toString().replace(/₫|VND|USD|\$/g, '').trim())
                                : (isOcean ? '2,450' : 'Thỏa thuận theo tender')}
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
                          <div className="font-black text-slate-900 text-xs">
                            {getServiceMainFreightTitle()}
                          </div>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">
                            Đơn giá cước vận chuyển chặng chính
                          </p>
                        </td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 font-semibold text-slate-700">
                          {getTariffMainUnit()}
                        </td>
                        <td className="py-3 px-4 text-center border-r border-slate-200">
                          <div className="inline-flex items-center justify-center w-full bg-white border border-slate-300 rounded-lg px-3 py-1 shadow-2xs">
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
                              <div className="font-medium text-slate-800">
                                <span>{charge}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-center border-r border-slate-200 font-semibold text-slate-600">
                              {getSurchargeUnit(charge)}
                            </td>
                            <td className="py-2 px-4 text-center border-r border-slate-200">
                              <div className="inline-flex items-center justify-center w-full bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                                <span className="font-mono font-bold text-slate-700 text-xs">
                                  {isOcean ? (charge.toLowerCase().includes('thc') ? '120' : charge.toLowerCase().includes('b/l') ? '40' : charge.toLowerCase().includes('seal') ? '10' : '65') : '0'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 border-r border-slate-200 font-semibold text-slate-600 italic">
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
                              <div className="font-medium text-slate-800">
                                <span>{vas}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-center border-r border-slate-200 font-semibold text-slate-600">
                              {getVasUnit(vas)}
                            </td>
                            <td className="py-2 px-4 text-center border-r border-slate-200">
                              <div className="inline-flex items-center justify-center w-full bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                                <span className="font-mono font-bold text-slate-700 text-xs">0</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 border-r border-slate-200 font-semibold text-slate-500 italic">
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
                <span>Xác nhận</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
