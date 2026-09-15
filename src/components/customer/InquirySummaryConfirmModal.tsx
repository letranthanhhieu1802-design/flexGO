import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  FileCheck,
  Bookmark,
  BookmarkCheck,
  Lock,
  Unlock,
  KeyRound,
  Trophy,
  Trash2,
  Eye
} from 'lucide-react';
import { InquiryItem, ServiceType, UserProfile, SupplierLeadItem, QuotationItem, CustomerRateItem } from '../../types';
import { getSurchargesForService } from './inquiryForms/SurchargesSection';

interface InquirySummaryConfirmModalProps {
  isOpen: boolean;
  inquiry: InquiryItem | null;
  currentUser?: UserProfile | null;
  matchingSuppliersCount?: number;
  isPublished?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  // Supplier View props
  isSupplierView?: boolean;
  isCustomerView?: boolean;
  lead?: SupplierLeadItem | null;
  isUnlocked?: boolean;
  onUnlock?: () => void;
  isSaved?: boolean;
  onSaveLead?: () => void;
  quotations?: QuotationItem[];
  onSubmitQuotation?: (quote: Partial<QuotationItem>) => void;
  // Awarded RFQ specific props
  onlyAwardedSupplier?: boolean;
  awardedSupplierName?: string;
  awardedRateData?: CustomerRateItem | null;
  defaultTab?: 'profile_cargo' | 'tariff_sheet';
}

export const InquirySummaryConfirmModal: React.FC<InquirySummaryConfirmModalProps> = ({
  isOpen,
  inquiry,
  currentUser,
  matchingSuppliersCount = 0,
  isPublished: isPublishedProp,
  onClose,
  onConfirm = () => {},
  isSupplierView: isSupplierViewProp = false,
  isCustomerView,
  lead = null,
  isUnlocked: isUnlockedProp,
  onUnlock,
  isSaved: isSavedProp,
  onSaveLead,
  quotations = [],
  onSubmitQuotation,
  onlyAwardedSupplier = false,
  awardedSupplierName: awardedSupplierNameProp,
  awardedRateData = null,
  defaultTab = 'profile_cargo',
}) => {
  const isSupplierView = isCustomerView !== undefined ? !isCustomerView : isSupplierViewProp;
  const [activeTab, setActiveTab] = useState<'profile_cargo' | 'tariff_sheet'>(defaultTab || 'profile_cargo');
  const [internalPublished, setInternalPublished] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [localUnlocked, setLocalUnlocked] = useState<boolean>(Boolean(isUnlockedProp));
  const [isQuoting, setIsQuoting] = useState<boolean>(false);
  const [localSaved, setLocalSaved] = useState<boolean>(Boolean(isSavedProp));
  const [awardedSupplierName, setAwardedSupplierName] = useState<string | null>(awardedSupplierNameProp || inquiry?.awardedSupplierName || null);
  const [quoteSubmittedToast, setQuoteSubmittedToast] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fallback / Normalized inquiry from lead if inquiry prop is omitted or partially null
  const effectiveInquiry: InquiryItem | null = useMemo(() => {
    if (inquiry) return inquiry;
    if (lead?.inquiry) return lead.inquiry;
    if (lead) {
      return {
        id: lead.id,
        code: lead.inquiryCode || lead.code,
        leadCode: lead.inquiryCode || lead.code,
        title: `${lead.serviceType}: ${lead.route}`,
        customerCompany: lead.customerCompany,
        contactPerson: lead.contactName,
        contactPhone: lead.contactPhone,
        contactEmail: lead.contactEmail,
        serviceType: lead.serviceType,
        origin: lead.origin,
        destination: lead.destination,
        route: lead.route,
        cargoType: lead.cargoDetails || 'Hàng hóa tiêu chuẩn',
        weightVolume: lead.volumeDisplay || '1 lô hàng',
        targetBudget: lead.unitPriceDisplay || `${(lead.unitPriceVND || 45000000).toLocaleString('vi-VN')} ₫`,
        pricingType: lead.pricingType || 'SPOT',
        status: lead.status || 'Open',
        createdDate: lead.createdDate || 'Hôm nay',
        expiryDate: lead.dueDate || '2026-09-30',
        responsesCount: lead.quotesCount || 0,
        viewsCount: lead.viewsCount || 0,
        currency: 'VND',
        serviceSpecs: lead.serviceSpecs,
        selectedVAS: lead.selectedVAS,
        requestedSurcharges: lead.requestedSurcharges,
      };
    }
    return null;
  }, [inquiry, lead]);

  const isPublished = isPublishedProp !== undefined ? isPublishedProp : internalPublished;

  useEffect(() => {
    setLocalUnlocked(Boolean(isUnlockedProp));
  }, [isUnlockedProp]);

  useEffect(() => {
    setLocalSaved(Boolean(isSavedProp));
  }, [isSavedProp]);

  // Reset internal state when modal opens with a new inquiry
  useEffect(() => {
    if (isOpen) {
      setCopiedLink(false);
      setActiveTab(defaultTab || 'profile_cargo');
      setIsQuoting(false);
      setQuoteSubmittedToast(null);
      setLocalUnlocked(Boolean(isUnlockedProp));
      setLocalSaved(Boolean(isSavedProp));
      if (isPublishedProp === undefined) {
        setInternalPublished(false);
      }
      if (awardedSupplierNameProp) {
        setAwardedSupplierName(awardedSupplierNameProp);
      } else if (inquiry?.awardedSupplierName) {
        setAwardedSupplierName(inquiry.awardedSupplierName);
      }
    }
  }, [isOpen, isPublishedProp, isUnlockedProp, isSavedProp, defaultTab, awardedSupplierNameProp, inquiry]);

  // Scroll to top when published so the user clearly sees the generated Lead Code and Share Banner
  useEffect(() => {
    if (isPublished && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isPublished]);

  // Lock document body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Lead Code and Inquiry Code are 1:1 identical (Mã lead và Mã Inquiry là 1)
  const leadCode = effectiveInquiry?.leadCode || effectiveInquiry?.code || lead?.inquiryCode || lead?.code || '';

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

  const effectiveUnlocked = isSupplierView ? (localUnlocked || Boolean(isUnlockedProp) || Boolean(lead?.isUnlocked)) : true;

  const handleToggleQuote = () => {
    setIsQuoting(prev => {
      const next = !prev;
      if (next) {
        setActiveTab('tariff_sheet');
      }
      return next;
    });
  };

  const handleUnlock = () => {
    if (onUnlock) {
      onUnlock();
    }
    setLocalUnlocked(true);
  };

  const handleToggleSave = () => {
    if (onSaveLead) {
      onSaveLead();
    }
    setLocalSaved(prev => !prev);
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

  const specs = effectiveInquiry?.serviceSpecs || lead?.serviceSpecs || {};
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
  const currentServiceType = effectiveInquiry?.serviceType || lead?.serviceType || 'Trucking';
  const isTrucking = currentServiceType === 'Trucking';
  const isTruckingLtl = isTrucking && Boolean(trucking?.loadType?.includes('LTL'));
  const isColdChain = currentServiceType === 'Cold Chain';
  const isProjectCargo = currentServiceType === 'Project Cargo';
  const isLcl = currentServiceType === 'Sea Freight (LCL)' || (currentServiceType === 'Sea Freight (FCL)' && Boolean(ocean?.mode?.includes('LCL')));
  const isFcl = (currentServiceType === 'Sea Freight (FCL)' || Boolean(ocean?.mode?.includes('FCL'))) && !isLcl;
  const isOcean = currentServiceType === 'Sea Freight (FCL)' || currentServiceType === 'Sea Freight (LCL)';
  const isAir = currentServiceType === 'Air Freight';
  const isAirExpress = isAir && air?.airServiceType === 'Express / Courier';
  const isAirCargo = isAir && !isAirExpress;
  const isRail = currentServiceType === 'Rail Freight';
  const isRailLcl = isRail && Boolean(rail?.mode?.includes('LCL'));
  const isRailFcl = isRail && !isRailLcl;
  const isWarehousing = currentServiceType === 'Warehousing';
  const isCrossBorder = currentServiceType === 'Cross-border';
  const isCrossBorderLtl = isCrossBorder && Boolean(crossBorder?.loadType?.includes('LTL'));
  const isCrossBorderFtl = isCrossBorder && !isCrossBorderLtl;
  const isCustoms = currentServiceType === 'Customs Clearance';
  const isCustomsExport = isCustoms && Boolean(customs?.tradeRole?.includes('Xuất'));
  const isCustomsImport = isCustoms && !isCustomsExport;

  const pickupList: string[] = (isTrucking && trucking?.pickupLocations && trucking.pickupLocations.length > 0)
    ? trucking.pickupLocations.map(l => l.trim()).filter(Boolean)
    : (isCrossBorder && crossBorder?.pickupLocations && crossBorder.pickupLocations.length > 0)
      ? crossBorder.pickupLocations.map(l => l.trim()).filter(Boolean)
      : [effectiveInquiry?.origin || lead?.origin || ''].filter(Boolean);

  const deliveryList: string[] = (isTrucking && trucking?.deliveryLocations && trucking.deliveryLocations.length > 0)
    ? trucking.deliveryLocations.map(l => l.trim()).filter(Boolean)
    : (isCrossBorder && crossBorder?.deliveryLocations && crossBorder.deliveryLocations.length > 0)
      ? crossBorder.deliveryLocations.map(l => l.trim()).filter(Boolean)
      : [effectiveInquiry?.destination || lead?.destination || ''].filter(Boolean);

  const totalPickupCount = pickupList.length || 1;
  const totalDeliveryCount = deliveryList.length || 1;
  const isMultiPoint = totalPickupCount > 1 || totalDeliveryCount > 1;

  // Customer Profile Information
  const customerCompanyName = lead?.customerCompany || effectiveInquiry?.customerCompany || currentUser?.companyName || 'ABC Manufacturing Vietnam Co., Ltd.';
  const customerContactName = lead?.contactName || inquiry?.contactPerson || (currentUser ? `${currentUser.name} (${currentUser.roleTitle || 'Logistics & Supply Chain'})` : 'Lê Hoàng Hiếu (Logistics Lead)');
  const customerEmail = lead?.contactEmail || currentUser?.email || 'hieu.le@abcmfg.vn';
  const customerPhone = lead?.contactPhone || '+84 908 123 456';
  const customerTaxId = lead?.taxId || inquiry?.taxCode || '0314892831';

  // Masking helpers for TH1 & TH2 (Customer masked when !effectiveUnlocked)
  const maskCompanyName = (name: string) => {
    if (!name) return 'Tập đoàn ********';
    const words = name.trim().split(/\s+/);
    if (words.length <= 2) {
      return `${name.slice(0, 4)}********`;
    }
    return `${words[0]} ${words[1]} ********`;
  };

  const maskContactPerson = (name: string) => {
    if (!name) return 'Nguyễn ***';
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return `${name.slice(0, 3)}***`;
    return `${parts[0]} ${parts[1] || ''} ***`;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '0908 *** ***';
    const cleaned = phone.trim();
    return `${cleaned.slice(0, 4)} *** ***`;
  };

  const maskEmail = (email: string) => {
    if (!email) return 'c***@***.vn';
    const [user, domain] = email.split('@');
    return `${user.slice(0, 1)}***@${domain ? `***.${domain.split('.').pop()}` : '***.vn'}`;
  };

  const maskTaxId = (tax: string) => {
    if (!tax) return '0314******';
    return `${tax.slice(0, 4)}******`;
  };

  // Helper to remove any emojis/icons from stored data strings
  const cleanTextNoEmoji = (text?: string): string => {
    if (!text) return '';
    return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}🚪⚓📦🚢🛫🛬🇻🇳]/gu, '').trim();
  };

  // Surcharge Unit calculation helper
  const getSurchargeUnit = (surchargeName: string): string => {
    if (!surchargeName) return 'Mục';
    const s = surchargeName.toLowerCase();
    if (s.includes('fsc') || s.includes('nhiên liệu') || s.includes('xăng dầu') || s.includes('ssc') || s.includes('an ninh') || s.includes('x-ray') || s.includes('soi chiếu') || s.includes('terminal')) {
      return 'Kg';
    }
    if (s.includes('awb') || s.includes('b/l') || s.includes('vận đơn') || s.includes('tờ khai') || s.includes('hải quan') || s.includes('chứng từ') || s.includes('kiểm dịch') || s.includes('hun trùng') || s.includes('c/o') || s.includes('giấy phép')) {
      return 'Set (Bộ)';
    }
    if (s.includes('thc') || s.includes('nâng hạ') || s.includes('seal') || s.includes('chì') || s.includes('vệ sinh cont') || s.includes('cắm điện')) {
      return isOcean && isFcl ? (ocean?.containerType ? ocean.containerType.split(' ')[0] : 'Cont') : 'Chuyến';
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
      return isWarehousing ? 'Pallet / Tấn' : 'Chuyến / Tấn';
    }
    if (isWarehousing) {
      if (s.includes('inbound') || s.includes('nhập kho') || s.includes('outbound') || s.includes('xuất kho')) return 'Pallet / Tấn';
      if (s.includes('quản lý') || s.includes('wms')) return 'Tháng';
      if (s.includes('đơn')) return 'Đơn hàng';
      return 'Mục';
    }
    if (isAir) return 'Kg';
    return isOcean ? 'Cont' : 'Chuyến';
  };

  const getVasUnit = (vasName: string): string => {
    if (!vasName) return 'Hạng mục';
    const v = vasName.toLowerCase();
    if (v.includes('bảo hiểm')) return '% Trị giá hàng';
    if (v.includes('hải quan') || v.includes('c/o') || v.includes('hun trùng') || v.includes('kiểm dịch')) return 'Bộ hồ sơ';
    if (v.includes('gps') || v.includes('tracking') || v.includes('nhiệt độ')) return 'Kèm cước';
    if (v.includes('đóng gói') || v.includes('pallet') || v.includes('dán tem') || v.includes('quấn màng')) return 'Pallet / Kiện';
    if (v.includes('bốc xếp') || v.includes('nâng hạ') || v.includes('xe nâng')) return 'Tấn / Giờ';
    return 'Hạng mục';
  };

  // Customer's requested currency
  const targetCurrency = useMemo<string>(() => {
    if (inquiry?.currency) return inquiry.currency.toUpperCase();
    const budgetStr = inquiry?.targetBudget || '';
    if (budgetStr.includes('EUR') || budgetStr.includes('€')) return 'EUR';
    if (budgetStr.includes('USD') || budgetStr.includes('$')) return 'USD';
    if (budgetStr.includes('CNY') || budgetStr.includes('¥')) return 'CNY';
    if (budgetStr.includes('JPY')) return 'JPY';
    if (budgetStr.includes('VND') || budgetStr.includes('₫')) return 'VND';
    return (inquiry?.cargoValueCurrency || 'VND').toUpperCase();
  }, [inquiry?.currency, inquiry?.targetBudget, inquiry?.cargoValueCurrency]);

  const targetCurrencySymbol = useMemo<string>(() => {
    switch (targetCurrency) {
      case 'EUR': return '€';
      case 'USD': return '$';
      case 'CNY': return '¥';
      case 'JPY': return '¥';
      case 'VND': return '₫';
      default: return targetCurrency;
    }
  }, [targetCurrency]);

  const targetCurrencySuffix = useMemo<string>(() => {
    return targetCurrency === 'VND' ? ' ₫' : ` ${targetCurrency}`;
  }, [targetCurrency]);

  // Tariff Unit calculation helper (ĐVT column with currency and specific mode/container)
  const getTariffMainUnit = (): string => {
    const curr = targetCurrency;

    switch (inquiry?.serviceType) {
      case 'Sea Freight (FCL)': {
        let contShort = 'Cont 20ft';
        if (ocean?.containerType) {
          const ct = ocean.containerType;
          if (ct.includes('40HC') || ct.includes('40ft High Cube')) contShort = 'Cont 40HC';
          else if (ct.includes('40RF') || (ct.includes('40') && ct.includes('Reefer'))) contShort = 'Cont 40RF';
          else if (ct.includes('20RF') || (ct.includes('20') && ct.includes('Reefer'))) contShort = 'Cont 20RF';
          else if (ct.includes('40GP') || ct.includes('40ft General') || ct.includes('40DC')) contShort = 'Cont 40ft';
          else if (ct.includes('45HC') || ct.includes('45ft')) contShort = 'Cont 45HC';
          else if (ct.includes('20ft') || ct.includes('20GP') || ct.includes('20DC')) contShort = 'Cont 20ft';
          else if (ct.includes('Open Top') || ct.includes('OT')) contShort = `Cont ${ct.split(' ')[0]} OT`;
          else if (ct.includes('Flat Rack') || ct.includes('FR')) contShort = `Cont ${ct.split(' ')[0]} FR`;
          else if (ct.includes('Tank') || ct.includes('TK')) contShort = `Cont ${ct.split(' ')[0]} Tank`;
          else contShort = `Cont ${ct.split(' ')[0]}`;
        }
        return `${curr} / ${contShort}`;
      }
      case 'Sea Freight (LCL)':
        return `${curr} / kg`;
      case 'Air Freight':
        return `${curr} / kg`;
      case 'Trucking':
        return trucking?.loadType?.includes('LTL')
          ? `${curr} / kg`
          : `${curr} / Chuyến`;
      case 'Cold Chain':
        return `${curr} / Chuyến`;
      case 'Rail Freight':
        return isRailLcl
          ? `${curr} / Tấn (RT)`
          : `${curr} / Cont`;
      case 'Warehousing':
        if (warehousing?.billingUnitPreference?.includes('Pallet')) return `${curr} / Pallet / tháng`;
        if (warehousing?.billingUnitPreference?.includes('CBM')) return `${curr} / CBM / tháng`;
        if (warehousing?.billingUnitPreference?.includes('Order')) return `${curr} / Đơn hàng`;
        return `${curr} / m² / tháng`;
      case 'Customs Clearance':
        return `${curr} / Tờ khai`;
      case 'Cross-border':
        return isCrossBorderLtl ? `${curr} / kg` : `${curr} / Chuyến`;
      case 'Project Cargo':
        return `${curr} / Trọn gói`;
      default: {
        if (isFcl) {
          let contShort = 'Cont 20ft';
          if (ocean?.containerType) {
            const ct = ocean.containerType;
            if (ct.includes('40HC')) contShort = 'Cont 40HC';
            else if (ct.includes('40RF')) contShort = 'Cont 40RF';
            else if (ct.includes('20RF')) contShort = 'Cont 20RF';
            else if (ct.includes('40')) contShort = 'Cont 40ft';
            else if (ct.includes('20')) contShort = 'Cont 20ft';
            else contShort = `Cont ${ct.split(' ')[0]}`;
          }
          return `${curr} / ${contShort}`;
        }
        if (isLcl) {
          return `${curr} / kg`;
        }
        return `${curr} / Đơn vị`;
      }
    }
  };

  // Quoting & Competitor Calculations for Tab 2
  const rawTargetBudget = useMemo(() => {
    return parseInt(inquiry?.targetBudget?.replace(/\D/g, '') || '50000000', 10);
  }, [inquiry]);

  // Supplier quote inputs (starts empty with 0 placeholder, no auto-price proposal)
  const [myTotalQuoteInput, setMyTotalQuoteInput] = useState<string>('');
  const [myBaseFreightInput, setMyBaseFreightInput] = useState<string>('');

  useEffect(() => {
    setMyTotalQuoteInput('');
    setMyBaseFreightInput('');
  }, [inquiry?.code, inquiry?.id]);

  // Quoted surcharges state for supplier quote
  interface QuotedSurchargeItem {
    id: string;
    name: string;
    unit: string;
    price: string;
    isFromCustomer?: boolean;
  }

  const [quotedSurcharges, setQuotedSurcharges] = useState<QuotedSurchargeItem[]>(() => {
    const requested = inquiry?.requestedSurcharges || [];
    return requested.map((r, idx) => ({
      id: `req-${idx}-${r}`,
      name: r,
      unit: getSurchargeUnit(r),
      price: '',
      isFromCustomer: true,
    }));
  });

  const [quotedVasPrices, setQuotedVasPrices] = useState<Record<string, string>>(() => {
    const vasList = inquiry?.selectedVAS || [];
    const init: Record<string, string> = {};
    vasList.forEach(v => { init[v] = ''; });
    return init;
  });

  useEffect(() => {
    if (inquiry) {
      const requested = inquiry.requestedSurcharges || [];
      if (requested.length > 0) {
        setQuotedSurcharges(
          requested.map((r, idx) => ({
            id: `req-${idx}-${r}`,
            name: r,
            unit: getSurchargeUnit(r),
            price: '',
            isFromCustomer: true,
          }))
        );
      } else {
        setQuotedSurcharges([]);
      }

      const vasList = inquiry.selectedVAS || [];
      const initVas: Record<string, string> = {};
      vasList.forEach(v => { initVas[v] = ''; });
      setQuotedVasPrices(initVas);
    }
  }, [inquiry]);

  const handleVasPriceChange = (vasName: string, priceStr: string) => {
    setQuotedVasPrices(prev => ({ ...prev, [vasName]: priceStr }));
  };

  const handleSurchargePriceChange = (id: string, priceStr: string) => {
    setQuotedSurcharges(prev => prev.map(item => item.id === id ? { ...item, price: priceStr } : item));
  };

  const handleRemoveSurcharge = (id: string) => {
    setQuotedSurcharges(prev => prev.filter(item => item.id !== id));
  };

  const handleAddSurchargeFromLOV = (lovId: string) => {
    if (!inquiry) return;
    const serviceLovList = getSurchargesForService(inquiry.serviceType, warehousing?.warehouseType);
    const found = serviceLovList.find(s => s.id === lovId);
    if (!found) return;
    setQuotedSurcharges(prev => [
      ...prev,
      {
        id: `lov-${Date.now()}-${found.id}`,
        name: found.name,
        unit: getSurchargeUnit(found.name),
        price: '',
        isFromCustomer: false,
      }
    ]);
  };

  const availableServiceLOV = useMemo(() => {
    if (!inquiry) return [];
    return getSurchargesForService(inquiry.serviceType, warehousing?.warehouseType);
  }, [inquiry, warehousing?.warehouseType]);

  const unaddedSurcharges = useMemo(() => {
    return availableServiceLOV.filter(lov => !quotedSurcharges.some(qs => qs.name === lov.name || (lov.code && qs.name.includes(lov.code))));
  }, [availableServiceLOV, quotedSurcharges]);

  const currencySymbol = targetCurrencySymbol;

  useEffect(() => {
    if (isQuoting && inquiry) {
      const baseNum = parseFloat(myBaseFreightInput.replace(/\D/g, '')) || 0;
      const surchargesTotal = quotedSurcharges.reduce((sum, item) => {
        const val = parseFloat(item.price.replace(/\D/g, '')) || 0;
        return sum + val;
      }, 0);
      const vasTotal: number = (Object.values(quotedVasPrices) as (string | number)[]).reduce<number>((sum, priceStr) => {
        const str = String(priceStr || '');
        const val = parseFloat(str.replace(/\D/g, '')) || 0;
        return sum + val;
      }, 0);
      if (baseNum > 0 || surchargesTotal > 0 || vasTotal > 0) {
        const total = baseNum + surchargesTotal + vasTotal;
        const uSuffix = inquiry.pricingType === 'CONTRACT' ? ' / tháng' : '';
        setMyTotalQuoteInput(total.toLocaleString('vi-VN') + targetCurrencySuffix + uSuffix);
      } else {
        setMyTotalQuoteInput('');
      }
    }
  }, [myBaseFreightInput, quotedSurcharges, quotedVasPrices, isQuoting, targetCurrencySuffix, inquiry?.pricingType]);

  const [hasSubmittedQuote, setHasSubmittedQuote] = useState<boolean>(false);

  const handleSendQuote = () => {
    setHasSubmittedQuote(true);
    if (onSubmitQuotation) {
      onSubmitQuotation({
        inquiryCode: leadCode,
        totalPrice: rawTargetBudget * 0.95,
      });
    }
    setQuoteSubmittedToast(`Đã gửi báo giá thành công cho lead ${leadCode}! Khách hàng sẽ nhận được phản hồi ngay.`);
    setTimeout(() => {
      setQuoteSubmittedToast(null);
    }, 4500);
  };

  const competitorQuotes = useMemo(() => {
    const activeInq = inquiry || effectiveInquiry;
    if (!activeInq) return [];

    // NẾU LÀ VIEW GIÁ TỪ TRAO THẦU: CHỈ HIỂN THỊ DUY NHẤT 1 CỘT CỦA SUPPLIER TRÚNG THẦU
    if (onlyAwardedSupplier) {
      const winnerName = awardedSupplierNameProp || awardedRateData?.supplierName || activeInq.awardedSupplierName || 'Á Châu Logistics (Top 1)';
      const winnerPic = awardedRateData?.supplierContact || 'Nguyễn Văn Tuấn';

      const rawBudget = parseInt(activeInq.targetBudget?.replace(/\D/g, '') || '65000000', 10);
      const locale = activeInq.currency === 'USD' ? 'en-US' : 'vi-VN';

      let totalQuote = 0;
      let baseFreight = 0;
      const surchargeMap: Record<string, string> = {};

      if (awardedRateData && awardedRateData.baseRateAmount > 0) {
        baseFreight = awardedRateData.baseRateAmount;
        let nonIncludedSurchargesTotal = 0;
        if (awardedRateData.surcharges && awardedRateData.surcharges.length > 0) {
          awardedRateData.surcharges.forEach((sc) => {
            if (sc.includedInBaseRate) {
              surchargeMap[sc.name] = 'Đã bao gồm';
            } else {
              nonIncludedSurchargesTotal += sc.amount || 0;
              surchargeMap[sc.name] = (sc.amount || 0).toLocaleString(locale);
            }
          });
        }
        totalQuote = awardedRateData.allInclusive ? baseFreight : (baseFreight + nonIncludedSurchargesTotal);
      } else {
        totalQuote = Math.round((rawBudget * 0.94) / 10000) * 10000;
        baseFreight = Math.round(totalQuote * 0.85);
      }

      const surchargeEach = Math.round((totalQuote - baseFreight) / Math.max(1, (activeInq.requestedSurcharges?.length || 1)));

      const vasPrices: Record<string, string> = {};
      if (activeInq.selectedVAS && activeInq.selectedVAS.length > 0) {
        activeInq.selectedVAS.forEach((vas, vIdx) => {
          const baseVasAmount = ((vIdx + 1) * 350000 + 400000) * 0.94;
          const roundedVas = Math.round(baseVasAmount / 10000) * 10000;
          vasPrices[vas] = roundedVas.toLocaleString(locale);
        });
      }

      return [{
        id: 'comp-awarded-winner',
        picName: winnerPic,
        companyName: winnerName,
        supplierName: winnerName,
        factor: 0.94,
        totalQuote,
        baseFreight,
        surchargeEach,
        surchargeMap,
        vasPrices,
        formattedTotal: totalQuote.toLocaleString(locale),
        formattedBase: baseFreight.toLocaleString(locale),
        formattedSurcharge: surchargeEach.toLocaleString(locale),
        isAwarded: true,
      }];
    }

    const count = lead?.quotesCount ?? activeInq.responsesCount ?? 0;
    if (count === 0) return [];

    const rawBudget = parseInt(activeInq.targetBudget?.replace(/\D/g, '') || '50000000', 10);
    const isContractVal = activeInq.pricingType === 'CONTRACT';
    const cSuffix = targetCurrencySuffix;
    const uSuffix = isContractVal ? ' / tháng' : '';

    const sampleSuppliers = [
      { picName: 'Nguyễn Văn Tuấn', companyName: 'Á Châu Logistics (Top 1)', factor: 0.94 },
      { picName: 'Trần Thị Mai Phương', companyName: 'VinaFast Express', factor: 0.98 },
      { picName: 'Lê Hoàng Nam', companyName: 'Hoàng Hà Logistics', factor: 1.05 },
      { picName: 'Phạm Đức Trọng', companyName: 'Tân Cảng Overland', factor: 1.02 },
    ];

    return sampleSuppliers.slice(0, Math.min(count, 4)).map((s, idx) => {
      const totalQuote = Math.round((rawBudget * s.factor) / 10000) * 10000;
      const baseFreight = Math.round(totalQuote * 0.85);
      const surchargeEach = Math.round((totalQuote - baseFreight) / Math.max(1, (activeInq.requestedSurcharges?.length || 1)));

      const locale = activeInq.currency === 'USD' ? 'en-US' : 'vi-VN';

      // Tính toán biểu giá VAS cụ thể do supplier khai báo (chỉ hiển thị số)
      const vasPrices: Record<string, string> = {};
      if (activeInq.selectedVAS && activeInq.selectedVAS.length > 0) {
        activeInq.selectedVAS.forEach((vas, vIdx) => {
          const baseVasAmount = ((vIdx + 1) * 350000 + 400000) * (s.factor || 1);
          const roundedVas = Math.round(baseVasAmount / 10000) * 10000;
          vasPrices[vas] = roundedVas.toLocaleString(locale);
        });
      }

      return {
        id: `comp-${idx + 1}`,
        picName: s.picName,
        companyName: s.companyName,
        supplierName: s.companyName,
        factor: s.factor,
        totalQuote,
        baseFreight,
        surchargeEach,
        vasPrices,
        formattedTotal: totalQuote.toLocaleString(locale),
        formattedBase: baseFreight.toLocaleString(locale),
        formattedSurcharge: surchargeEach.toLocaleString(locale),
        isAwarded: false,
      };
    });
  }, [inquiry, effectiveInquiry, lead, onlyAwardedSupplier, awardedSupplierNameProp, awardedRateData, targetCurrencySuffix]);

  // Early return ONLY after all Hooks have been declared (Rules of Hooks)
  if (!isOpen || (!inquiry && !effectiveInquiry)) return null;

  // Safe inquiry reference for all subsequent renders
  const activeInquiry: InquiryItem = (inquiry || effectiveInquiry)!;

  // Dynamic Section Titles & Configuration per Service Type
  const getServiceMainFreightTitle = (): string => {
    switch (activeInquiry.serviceType) {
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
    switch (activeInquiry.serviceType) {
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
    if (activeInquiry.serviceType === 'Warehousing') {
      return '2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) TẠI KHO';
    }
    return '2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO';
  };

  const getServiceSection3Title = (): string => {
    switch (activeInquiry.serviceType) {
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
    switch (activeInquiry.serviceType) {
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



  const routeDisplay = isWarehousing
    ? `Khu vực đặt kho: ${activeInquiry.origin} ➔ Bán kính phân phối: ${activeInquiry.destination}`
    : isCustoms
      ? `Chi cục HQ: ${activeInquiry.origin || customs?.customsSubDepartment || ''} ➔ Cảng/Cửa khẩu: ${activeInquiry.destination || customs?.portOrBorderGate || ''}`
      : `${activeInquiry.origin || ''} ➔ ${activeInquiry.destination || ''}`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden animate-in fade-in duration-150">
      <div
        id="inquiry-summary-confirm-modal"
        className="w-full max-w-[96vw] 2xl:max-w-[1560px] h-[94vh] max-h-[95vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
              TÓM TẮT YÊU CẦU BÁO GIÁ
            </h3>
            {leadCode ? (
              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/90 px-2.5 py-0.5 rounded-lg border border-indigo-700/60 hidden sm:inline">
                {leadCode}
              </span>
            ) : null}
            {activeInquiry?.viewsCount !== undefined && activeInquiry.viewsCount > 0 && (
              <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15 inline-flex items-center gap-1.5" title="Tổng số lượt xem yêu cầu báo giá này">
                <Eye className="w-3.5 h-3.5 text-slate-300" />
                <span>{activeInquiry.viewsCount} lượt xem</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isSupplierView && (
              <>
                {/* 1. Nút Chia sẻ */}
                <button
                  type="button"
                  id="supplier-modal-btn-share"
                  onClick={handleCopyLink}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    copiedLink
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border-white/10'
                  }`}
                  title="Sao chép link Lead"
                >
                  {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5 text-slate-300" />}
                  <span className="hidden md:inline">{copiedLink ? 'Đã copy link' : 'Chia sẻ'}</span>
                </button>

                {/* 2. Nút Lưu lead */}
                <button
                  type="button"
                  id="supplier-modal-btn-save"
                  onClick={handleToggleSave}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    localSaved
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border-white/10'
                  }`}
                  title={localSaved ? 'Bỏ lưu lead' : 'Lưu lead'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${localSaved ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  <span className="hidden md:inline">{localSaved ? 'Đã lưu' : 'Lưu lead'}</span>
                </button>

                {/* 3. Nút Mở khóa */}
                {effectiveUnlocked ? (
                  <div className="px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Đã mở khóa</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    id="supplier-modal-btn-unlock"
                    onClick={handleUnlock}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs transition-all cursor-pointer active:scale-95"
                    title="Mở khóa thông tin khách hàng & ma trận giá đối thủ (-50 Credits)"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-900" />
                    <span>Mở khóa (-50 Credits)</span>
                  </button>
                )}

                {/* 4. Nút Báo giá ngay */}
                <button
                  type="button"
                  id="supplier-modal-btn-quote"
                  onClick={handleToggleQuote}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs ${
                    isQuoting
                      ? 'bg-indigo-500 text-white ring-2 ring-indigo-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                  title="Nhập và gửi báo giá"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isQuoting ? 'Đang báo giá' : 'Báo giá ngay'}</span>
                </button>
              </>
            )}

            {/* Nút đóng */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer ml-1"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST THÔNG BÁO BÁO GIÁ THÀNH CÔNG */}
        {quoteSubmittedToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2 duration-150 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{quoteSubmittedToast}</span>
            </div>
            <button type="button" onClick={() => setQuoteSubmittedToast(null)} className="text-emerald-200 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-TAB NAVIGATION BAR */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              type="button"
              id="tab-btn-customer-cargo"
              onClick={() => setActiveTab('profile_cargo')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'profile_cargo'
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
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'tariff_sheet'
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

          {/* BADGE KHI ĐÃ PHÁT HÀNH THÀNH CÔNG - Nhỏ gọn, tinh tế */}
          {isPublished && (
            <div className="flex items-center">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 shadow-2xs animate-in slide-in-from-top-1 duration-150">
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                  Mã Lead:
                </span>
                <span className="text-xs font-mono font-extrabold text-emerald-950 px-2 py-0.5 rounded bg-emerald-100/80 border border-emerald-200">
                  {leadCode}
                </span>

                <div className="h-4 w-px bg-emerald-300/80 mx-1" />

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${copiedLink
                      ? 'bg-slate-900 text-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                    }`}
                >
                  {copiedLink ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link Lead</span>
                    </>
                  )}
                </button>
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
                    <span className="font-normal text-slate-800">
                      {isSupplierView && !effectiveUnlocked ? maskCompanyName(customerCompanyName) : customerCompanyName}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã số thuế (MST):</span>
                    <span className="font-normal text-slate-800">
                      {isSupplierView && !effectiveUnlocked ? maskTaxId(customerTaxId) : customerTaxId}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Người phụ trách:</span>
                    <span className="font-normal text-slate-800">
                      {isSupplierView && !effectiveUnlocked ? maskContactPerson(customerContactName) : customerContactName}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Chức vụ:</span>
                    <span className="font-normal text-slate-800">{lead?.contactRole || currentUser?.roleTitle || 'Supply Chain Lead / Logistics Manager'}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số điện thoại liên hệ:</span>
                    <span className="font-normal text-slate-800">
                      {isSupplierView && !effectiveUnlocked ? maskPhone(customerPhone) : customerPhone}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Email liên hệ:</span>
                    <span className="font-normal text-slate-800 truncate" title={customerEmail}>
                      {isSupplierView && !effectiveUnlocked ? maskEmail(customerEmail) : customerEmail}
                    </span>
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
                      <span className="font-normal text-slate-800">{inquiry.industry}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tên mặt hàng cụ thể:</span>
                      <span className="font-normal text-slate-800">
                        {inquiry.cargoType || inquiry.industry}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Quy cách đóng gói:</span>
                      <span className="font-normal text-slate-800">{inquiry.packaging}</span>
                    </div>

                    {/* Khả năng xếp chồng: Hiển thị ở Mục 2 (Chỉ dành cho các dịch vụ vận tải hàng rời / ghép hàng) */}
                    {!isWarehousing && (inquiry.stackable !== undefined || ocean?.lclStackable !== undefined || air?.stackable !== undefined || trucking?.ltlStackable !== undefined || rail?.lclStackable !== undefined || crossBorder?.stackable !== undefined) && (
                      <div className={`flex items-baseline gap-2 ${isCrossBorderLtl && !inquiry.hsCode && !inquiry.cargoValue ? 'md:col-span-2' : ''}`}>
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Khả năng xếp chồng:</span>
                        <span className="font-normal text-slate-800">
                          {(inquiry.stackable ?? ocean?.lclStackable ?? air?.stackable ?? trucking?.ltlStackable ?? rail?.lclStackable ?? crossBorder?.stackable)
                            ? 'Có thể xếp chồng (Stackable)'
                            : 'Không được xếp chồng'}
                        </span>
                      </div>
                    )}

                    {/* Dành cho các dịch vụ vận tải: Hiển thị Khối lượng Gross & CBM (LTL Xuyên biên giới đưa xuống bảng quy cách kiện) */}
                    {!isWarehousing && !isCrossBorderLtl && (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Khối lượng Gross:</span>
                          <span className="font-normal text-slate-800">
                            {isTruckingLtl && trucking?.ltlGrossWeightKg
                              ? `${trucking.ltlGrossWeightKg.toLocaleString('vi-VN')} kg`
                              : isCrossBorderLtl && crossBorder?.ltlGrossWeightKg
                                ? `${crossBorder.ltlGrossWeightKg.toLocaleString('vi-VN')} kg`
                                : (inquiry.ftlWeightKg && inquiry.ftlWeightKg !== '0' && inquiry.ftlWeightKg !== '0.0')
                                  ? `${inquiry.ftlWeightKg} kg`
                                  : ocean?.lclGrossWeightKg
                                    ? `${ocean.lclGrossWeightKg.toLocaleString('vi-VN')} kg`
                                    : rail?.lclGrossWeightKg
                                      ? `${rail.lclGrossWeightKg.toLocaleString('vi-VN')} kg`
                                      : air?.grossWeightKgs
                                        ? `${air.grossWeightKgs.toLocaleString('vi-VN')} kg`
                                        : crossBorder?.grossWeightKgs
                                          ? `${crossBorder.grossWeightKgs.toLocaleString('vi-VN')} kg`
                                          : inquiry.weightVolume || 'Theo tải trọng phương tiện'}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tổng thể tích:</span>
                          <span className="font-normal text-slate-800">
                            {isTruckingLtl && trucking?.ltlCbm
                              ? `${trucking.ltlCbm} CBM`
                              : isCrossBorderLtl && crossBorder?.ltlCbm
                                ? `${crossBorder.ltlCbm} CBM`
                                : inquiry.ftlVolumeCbm
                                  ? `${inquiry.ftlVolumeCbm} CBM`
                                  : ocean?.lclCbm
                                    ? `${ocean.lclCbm} CBM`
                                    : (rail?.lclCbm || rail?.cbmVolume)
                                      ? `${rail?.lclCbm || rail?.cbmVolume} CBM`
                                      : crossBorder?.cbmVolume
                                        ? `${crossBorder.cbmVolume} CBM`
                                        : (isAir && (air?.cbmVolume || inquiry.cbmVolume))
                                          ? `${air?.cbmVolume || inquiry.cbmVolume} CBM`
                                          : isAir
                                            ? 'Chưa tính CBM'
                                            : 'Theo dung tích thùng xe'}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Dành riêng cho Dịch Vụ Kho: Hiển thị thông số kỹ thuật hàng hóa thực tế từ Form */}
                    {isWarehousing && inquiry.cargoClassification === 'Reefer' && (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Dải nhiệt độ yêu cầu:</span>
                          <span className="font-bold text-cyan-900">
                            {inquiry.temperatureRequirement}
                          </span>
                        </div>
                        {warehousing?.humidityRequirement && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kiểm soát độ ẩm:</span>
                            <span className="font-normal text-slate-800">
                              {warehousing.humidityRequirement === 'Tùy chỉnh riêng (% RH)'
                                ? (warehousing.customHumidity || 'Độ ẩm tùy chỉnh')
                                : warehousing.humidityRequirement}
                            </span>
                          </div>
                        )}
                        {warehousing?.inboundTemperatureState && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trạng thái nhiệt khi nhập kho:</span>
                            <span className="font-normal text-slate-800">
                              {warehousing.inboundTemperatureState === 'NEED_COOLING'
                                ? 'Cần cấp đông / làm lạnh tại kho'
                                : 'Hàng đã đạt chuẩn nhiệt độ'}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {isWarehousing && inquiry.cargoClassification === 'Hazmat' && (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Nhóm nguy hiểm (IMO Class):</span>
                          <span className="font-bold text-amber-900">
                            {inquiry.dgClassIMO}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã số UN (UN Number):</span>
                          <span className="font-normal text-slate-800">
                            {inquiry.unNumber}
                          </span>
                        </div>
                        {inquiry.packingGroup && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Nhóm đóng gói (PG):</span>
                            <span className="font-normal text-slate-800">
                              {inquiry.packingGroup}
                            </span>
                          </div>
                        )}
                        {inquiry.flashPoint && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điểm chớp cháy:</span>
                            <span className="font-normal text-slate-800">
                              {`${inquiry.flashPoint}°C`}
                            </span>
                          </div>
                        )}
                        {inquiry.msdsFileName && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phiếu an toàn MSDS:</span>
                            <span className="font-normal text-slate-800">
                              📄 {inquiry.msdsFileName}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {inquiry.preservationRequirement && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Yêu cầu bảo quản & xếp dỡ:</span>
                        <span className="font-normal text-slate-800">{inquiry.preservationRequirement}</span>
                      </div>
                    )}

                    {/* Dành riêng cho Kho Ngoại Quan: Mã HS Code & Trị Giá Hàng Gửi Kho đưa lên Mục 2 ngang hàng với Yêu cầu bảo quản */}
                    {isWarehousing && (warehousing?.bondedHsCode || warehousing?.bondedEstimatedValue || inquiry.hsCode) && (
                      <div className={`flex items-baseline gap-2 ${!inquiry.preservationRequirement ? 'md:col-span-2' : ''}`}>
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã HS Code & Trị Giá Hàng Gửi Kho:</span>
                        <span className="font-normal text-slate-800">
                          {(warehousing?.bondedHsCode || inquiry.hsCode) ? `HS: ${warehousing?.bondedHsCode || inquiry.hsCode}` : ''}
                          {warehousing?.bondedEstimatedValue ? ` — ${typeof warehousing.bondedEstimatedValue === 'number' ? warehousing.bondedEstimatedValue.toLocaleString('vi-VN') : warehousing.bondedEstimatedValue} ${warehousing.bondedEstimatedValueCurrency || 'USD'}` : ''}
                        </span>
                      </div>
                    )}

                    {(inquiry.hsCode || customs?.hsCodePrimary) && !isWarehousing && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã HS Code:</span>
                        <span className="font-normal text-slate-800">{inquiry.hsCode || customs?.hsCodePrimary}</span>
                      </div>
                    )}

                    {(inquiry.cargoValue || customs?.cargoValue || customs?.invoiceValueUSD) && !isWarehousing && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trị giá khai báo:</span>
                        <span className="font-normal text-slate-800">
                          {inquiry.cargoValue
                            ? `${inquiry.cargoValue} ${inquiry.cargoValueCurrency || 'USD'}`
                            : (customs?.cargoValue
                              ? `${customs.cargoValue} ${customs.cargoValueCurrency || 'USD'}`
                              : `${customs?.invoiceValueUSD?.toLocaleString('vi-VN')} USD`)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* LTL / LCL specific breakdown (Chỉ dành cho dịch vụ vận tải, không hiển thị cho kho bãi và hải quan) */}
                  {!isWarehousing && !isCustoms && (isTruckingLtl || isLcl || isRailLcl || isCrossBorderLtl || inquiry.packageCount || Boolean(air?.packageCount)) && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-indigo-900 block">
                        {isAir ? 'Quy cách kiện hàng không (Air Cargo Specs):' : isRailLcl ? 'Quy cách kiện đường sắt (Rail LCL Specs):' : isCrossBorderLtl ? 'Quy cách kiện ghép xuyên biên giới (Cross-Border LTL Specs):' : 'Quy cách kiện ghép (LTL / LCL Specs):'}
                      </span>
                      {isCrossBorderLtl ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                          {/* Hàng 1: Số lượng kiện & Kích thước từng kiện */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số lượng kiện:</span>
                            <span className="font-normal text-slate-800">
                              {crossBorder?.ltlPieces ? `${crossBorder.ltlPieces.toLocaleString('vi-VN')} Kiện / Pallet` : '1 Kiện / Pallet'}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kích thước từng kiện:</span>
                            <span className="font-normal text-slate-800">
                              {(() => {
                                const dims = crossBorder?.ltlDimensions;
                                if (dims && dims.lengthCm) {
                                  return `${dims.lengthCm} x ${dims.widthCm || 0} x ${dims.heightCm || 0} cm`;
                                }
                                return 'Tiêu chuẩn kiện hàng';
                              })()}
                            </span>
                          </div>

                          {/* Hàng 2: Khối lượng Gross & Tổng thể tích (Đưa vào đây theo yêu cầu) */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Khối lượng Gross:</span>
                            <span className="font-normal text-slate-800">
                              {crossBorder?.ltlGrossWeightKg
                                ? `${crossBorder.ltlGrossWeightKg.toLocaleString('vi-VN')} kg`
                                : (crossBorder?.grossWeightKgs ? `${crossBorder.grossWeightKgs.toLocaleString('vi-VN')} kg` : (inquiry.ftlWeightKg ? `${inquiry.ftlWeightKg} kg` : 'Theo thỏa thuận'))}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tổng thể tích:</span>
                            <span className="font-normal text-slate-800">
                              {crossBorder?.ltlCbm
                                ? `${crossBorder.ltlCbm.toLocaleString('vi-VN')} CBM`
                                : (crossBorder?.cbmVolume ? `${crossBorder.cbmVolume.toLocaleString('vi-VN')} CBM` : (inquiry.ftlVolumeCbm ? `${inquiry.ftlVolumeCbm} CBM` : 'Theo thỏa thuận'))}
                            </span>
                          </div>

                          {/* Hàng 3: Trọng lượng tính cước CW */}
                          <div className="flex items-baseline gap-2 md:col-span-2 pt-1.5 border-t border-slate-200/60">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trọng lượng tính cước (CW):</span>
                            <span className="font-bold text-orange-950">
                              {crossBorder?.ltlChargeableWeightKg
                                ? `${crossBorder.ltlChargeableWeightKg.toLocaleString('vi-VN')} kg`
                                : 'Theo thể tích thực tế'}{' '}
                              <span className="font-normal text-slate-500 text-[11px]">(Quy đổi theo tỷ lệ 1 CBM = 250 kg)</span>
                            </span>
                          </div>
                        </div>
                      ) : (
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
                                if (isAir && air?.airDimensions?.lengthCm) {
                                  return `${air.airDimensions.lengthCm} x ${air.airDimensions.widthCm || 0} x ${air.airDimensions.heightCm || 0} cm`;
                                }
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
                                    ? `${rail.lclRevenueTon} RT (${rail.lclChargeableWeightKg ? rail.lclChargeableWeightKg.toLocaleString('vi-VN') + ' kg - Quy đổi 1 CBM = 1.000 kg' : ''})`
                                    : air?.chargeableWeightKgs
                                      ? `${air.chargeableWeightKgs.toLocaleString('vi-VN')} kg CW`
                                      : 'Theo thể tích thực tế'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reefer specific properties (Vận chuyển bảo quản lạnh xe tải/cont) */}
                  {!isWarehousing && (inquiry.cargoClassification === 'Reefer' || coldChain) && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-cyan-950 block">Yêu cầu bảo quản lạnh & nhiệt độ (Reefer Specs):</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-xs bg-cyan-50/40 p-3 rounded-xl border border-cyan-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-cyan-800/70 font-medium min-w-[140px] shrink-0">Dải nhiệt độ yêu cầu:</span>
                          <span className="font-normal text-slate-800">{inquiry.temperatureRequirement || coldChain?.temperatureCategory}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-cyan-800/70 font-medium min-w-[140px] shrink-0">Duy trì điện liên tục:</span>
                          <span className="font-normal text-slate-800">
                            {isCrossBorder
                              ? 'Máy phát Clip-on Genset liên tục suốt tuyến biên giới'
                              : coldChain?.continuousGenset
                                ? 'Máy phát Clip-on Genset liên tục'
                                : 'Cắm điện bãi Plug-in khi dừng đỗ'}
                          </span>
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

                  {/* Hazmat specific properties (Vận chuyển hàng nguy hiểm đường biển/bộ) */}
                  {!isWarehousing && inquiry.cargoClassification === 'Hazmat' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-rose-950 block">Thông số hàng nguy hiểm & hóa chất (Hazmat / DG Specs):</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-xs bg-rose-50/40 p-3 rounded-xl border border-rose-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Nhóm nguy hiểm (IMO Class):</span>
                          <span className="font-normal text-slate-800">{inquiry.dgClassIMO}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Mã số UN:</span>
                          <span className="font-normal text-slate-800">{inquiry.unNumber}</span>
                        </div>
                        {inquiry.packingGroup && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Nhóm đóng gói:</span>
                            <span className="font-normal text-slate-800">{inquiry.packingGroup}</span>
                          </div>
                        )}
                        {inquiry.flashPoint && (
                          <div className="flex items-baseline gap-2">
                            <span className="text-rose-800/70 font-medium min-w-[140px] shrink-0">Điểm chớp cháy:</span>
                            <span className="font-normal text-slate-800">{`${inquiry.flashPoint}°C`}</span>
                          </div>
                        )}
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
                  {isOcean ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hình Thức Đóng Hàng Biển (FCL / LCL):</span>
                        <span className="font-normal text-slate-800">
                          {isLcl ? 'LCL (Hàng lẻ đóng ghép CFS)' : 'FCL (Full Container)'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Vai Trò Của Doanh Nghiệp Trong Lô Hàng (Trade Role):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(ocean?.tradeRole || inquiry.tradeRole)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Thương Mại (Incoterms 2020):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(ocean?.incoterm || inquiry.incoterms)}
                        </span>
                      </div>

                      {/* FCL Specific Fields: Loại Vỏ Container & Thời Gian Miễn Phí (Đưa lên trên Điều kiện nhận/giao hàng) */}
                      {isFcl && (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại Vỏ Container:</span>
                            <span className="font-normal text-slate-800">
                              {ocean?.containerType}
                            </span>
                          </div>
                          {ocean?.freeDemDetDaysRequested && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời Gian Miễn Phí Lưu Cont / Bãi (Free Dem/Det):</span>
                              <span className="font-normal text-slate-800">
                                {`${ocean.freeDemDetDaysRequested} Ngày`}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* LCL Specific Fields: Số Lượng Kiện (Đưa lên trên Điều kiện nhận/giao hàng) */}
                      {isLcl && ocean?.lclPieces && (
                        <div className="flex items-baseline gap-2 md:col-span-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số Lượng Kiện / Pallet Cần Gom Ghép:</span>
                          <span className="font-normal text-slate-800">
                            {`${ocean.lclPieces} Kiện / Pallet`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Nhận Hàng (Origin Term):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(ocean?.originServiceTerm || inquiry.originServiceTerm)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Giao Hàng (Destination Term):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(ocean?.destinationServiceTerm || inquiry.destinationServiceTerm)}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {isLcl ? 'Địa Chỉ Lấy Hàng Kho CFS (Origin CFS Warehouse):' : 'Cảng Bốc Hàng (Port of Loading - POL):'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {ocean?.polPort || inquiry.origin}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {isLcl ? 'Địa Chỉ Giao Hàng Kho CFS (Destination CFS Warehouse):' : 'Cảng Dỡ Hàng (Port of Discharge - POD):'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {ocean?.podPort || inquiry.destination}
                        </span>
                      </div>

                      {/* Địa Chỉ Kho Lấy Hàng & Giao Hàng: chỉ hiển thị khi có khai báo */}
                      {ocean?.pickupAddress && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Địa Chỉ Kho Lấy Hàng (Shipper Warehouse):</span>
                          <span className="font-normal text-slate-800">
                            {ocean.pickupAddress}
                          </span>
                        </div>
                      )}
                      {ocean?.deliveryAddress && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Địa Chỉ Giao Hàng (Consignee Warehouse):</span>
                          <span className="font-normal text-slate-800">
                            {ocean.deliveryAddress}
                          </span>
                        </div>
                      )}

                    </div>
                  ) : isAir ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      {/* Hàng 1: Loại hình dịch vụ & Hình thức dịch vụ bay */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hình Thức Dịch Vụ Bay:</span>
                        <span className="font-normal text-slate-800">
                          {isAirExpress ? 'Express / Courier (Chuyển phát nhanh)' : 'Air Freight / Cargo (Hàng không thương mại)'}
                        </span>
                      </div>

                      {/* Hàng 2: Vai trò & Incoterms */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Vai Trò Của Doanh Nghiệp Trong Lô Hàng (Trade Role):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(air?.tradeRole || inquiry.tradeRole)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Thương Mại (Incoterms 2020):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(air?.incoterm || inquiry.incoterms)}
                        </span>
                      </div>

                      {isAirCargo ? (
                        <>
                          {/* Hàng 3: Điều kiện nhận hàng & Giao hàng */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Nhận Hàng (Origin Term):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.originServiceTerm || inquiry.originServiceTerm)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Giao Hàng (Destination Term):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.destinationServiceTerm || inquiry.destinationServiceTerm)}
                            </span>
                          </div>

                          {/* Hàng 4: Sân bay đi & Sân bay đến */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Sân Bay Đi (AOD - Airport of Departure):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.originAirport || inquiry.origin)}
                            </span>
                          </div>
                          {/* Hàng 4: Sân bay đến */}
                          <div className="flex items-baseline gap-2 md:col-span-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Sân Bay Đến (AOA - Airport of Arrival):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.destinationAirport || inquiry.destination)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Express Courier Specific Fields */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phân Loại Bưu Kiện (Express Package Type):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.expressPackageType)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Cấp Độ Chuyển Phát (Speed Level):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.expressSpeedLevel)}
                            </span>
                          </div>

                          {/* Địa chỉ lấy hàng & Giao hàng tận nơi Door-to-Door cùng 1 hàng */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Địa Chỉ Lấy Hàng Tận Nơi (Pickup Address):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.pickupAddress || inquiry.origin)}
                              {air?.originPostalCode ? ` (Mã Zip: ${air.originPostalCode})` : ''}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Địa Chỉ Giao Hàng Tận Nơi (Delivery Address):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(air?.deliveryAddress || inquiry.destination)}
                              {air?.destinationPostalCode ? ` (Mã Zip: ${air.destinationPostalCode})` : ''}
                            </span>
                          </div>

                          {/* Yêu cầu ký nhận POD & Hỗ trợ thủ tục hải quan */}
                          {air?.signatureRequired && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Yêu Cầu Ký Nhận Tận Tay (POD):</span>
                              <span className="font-normal text-slate-800">
                                Yêu cầu ký nhận tận tay
                              </span>
                            </div>
                          )}
                          {air?.expressCustomsSupport && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hỗ Trợ Thủ Tục Hải Quan:</span>
                              <span className="font-normal text-slate-800">
                                Có hỗ trợ thủ tục hải quan trọn gói
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : isRail ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      {/* Hàng 1: Loại hình dịch vụ & Phương thức vận chuyển đường sắt */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phương Thức Vận Chuyển Đường Sắt (Mode of Rail Transport):</span>
                        <span className="font-normal text-slate-800">
                          {isRailLcl ? 'LCL (Hàng lẻ đóng ghép kho ga)' : 'FCL (Nguyên container ga - ga)'}
                        </span>
                      </div>

                      {/* Hàng 2: Vai trò của doanh nghiệp & Điều kiện thương mại Incoterms */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Vai Trò Của Doanh Nghiệp Trong Lô Hàng (Trade Role):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(rail?.tradeRole || inquiry.tradeRole)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Thương Mại (Incoterms 2020):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(rail?.incoterm || inquiry.incoterms)}
                        </span>
                      </div>

                      {/* Hàng 3: FCL Container Type & Free Dem/Det (Đưa lên trên Điều kiện nhận/giao hàng) */}
                      {isRailFcl && (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại Container / Toa Xe:</span>
                            <span className="font-normal text-slate-800">
                              {rail?.containerType}
                            </span>
                          </div>
                          {rail?.freeDemDetDaysRequested && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời Gian Miễn Phí Lưu Bãi Ga (Free Dem/Det):</span>
                              <span className="font-normal text-slate-800">
                                {`${rail.freeDemDetDaysRequested} Ngày`}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Hàng 3: LCL Specific: Số Lượng Kiện Cần Ghép (Đưa lên trên Điều kiện nhận/giao hàng) */}
                      {isRailLcl && rail?.lclPieces && (
                        <div className="flex items-baseline gap-2 md:col-span-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số Lượng Kiện / Pallet Cần Ghép:</span>
                          <span className="font-normal text-slate-800">
                            {`${rail.lclPieces} Kiện / Pallet`}
                          </span>
                        </div>
                      )}

                      {/* Hàng 4: Điều kiện nhận hàng & Giao hàng */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Nhận Hàng (Origin Term):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(rail?.originServiceTerm || inquiry.originServiceTerm)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Giao Hàng (Destination Term):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(rail?.destinationServiceTerm || inquiry.destinationServiceTerm)}
                        </span>
                      </div>

                      {/* Hàng 5: Ga xếp hàng (POL Ga) & Ga dỡ hàng (POD Ga) */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {isRailLcl ? 'Địa Chỉ Kho Ga Nhận Hàng (Origin CFS Rail Station):' : 'Ga Xếp Hàng (Origin Rail Station / POL Ga):'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(rail?.originStation || inquiry.origin)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {isRailLcl ? 'Địa Chỉ Kho Ga Trả Hàng (Destination CFS Rail Station):' : 'Ga Dỡ Hàng (Destination Rail Station / POD Ga):'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(rail?.destinationStation || inquiry.destination)}
                        </span>
                      </div>

                      {/* Hàng 6: Địa chỉ kho lấy hàng & Địa chỉ kho giao hàng (chỉ hiển thị khi có khai báo) */}
                      {rail?.pickupAddress && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Địa Chỉ Kho Lấy Hàng (Shipper Warehouse):</span>
                          <span className="font-normal text-slate-800">
                            {cleanTextNoEmoji(rail.pickupAddress)}
                          </span>
                        </div>
                      )}
                      {rail?.deliveryAddress && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Địa Chỉ Giao Hàng (Consignee Warehouse):</span>
                          <span className="font-normal text-slate-800">
                            {cleanTextNoEmoji(rail.deliveryAddress)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : isWarehousing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      {/* Hàng 1: Loại hình dịch vụ & Mô hình kho bãi */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mô Hình & Loại Hình Kho Bãi:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(warehousing?.warehouseType)}
                        </span>
                      </div>

                      {/* Hàng 2: Đơn vị tính phí & Quy mô lưu kho tách biệt thành 2 trường riêng biệt */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Đơn Vị Tính Phí Thuê Kho:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(warehousing?.billingUnitPreference)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {warehousing?.billingUnitPreference?.includes('Pallet')
                            ? 'Số Vị Trí Pallet Cần Thuê:'
                            : warehousing?.billingUnitPreference?.includes('CBM')
                              ? 'Tổng Thể Tích Lưu Trữ:'
                              : warehousing?.billingUnitPreference?.includes('Order') || warehousing?.warehouseType === 'Kho TMĐT / Fulfillment'
                                ? 'Dung Lượng Lưu Kho Đệm:'
                                : 'Diện Tích Sàn Cần Thuê:'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {warehousing?.billingUnitPreference?.includes('Pallet')
                            ? (warehousing.palletPositions ? `${warehousing.palletPositions.toLocaleString('vi-VN')} Pallet` : '')
                            : warehousing?.billingUnitPreference?.includes('CBM')
                              ? (warehousing.cbmVolume ? `${warehousing.cbmVolume.toLocaleString('vi-VN')} CBM` : '')
                              : warehousing?.billingUnitPreference?.includes('Order') || warehousing?.warehouseType === 'Kho TMĐT / Fulfillment'
                                ? `${warehousing.bufferStorageQty ? warehousing.bufferStorageQty.toLocaleString('vi-VN') : (warehousing.bufferPalletPositions || '')} ${cleanTextNoEmoji(warehousing.bufferStorageUnit) || ''}`
                                : (warehousing?.storageAreaSqm ? `${warehousing.storageAreaSqm.toLocaleString('vi-VN')} m²` : '')}
                        </span>
                      </div>

                      {/* Hàng 2.5: Đối với Kho TMĐT / Fulfillment: Sản lượng đơn hàng & B2C SKUs */}
                      {(warehousing?.warehouseType === 'Kho TMĐT / Fulfillment' || warehousing?.billingUnitPreference?.includes('Order')) && (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Sản Lượng Đơn TMĐT:</span>
                            <span className="font-normal text-slate-800">
                              {warehousing?.monthlyOrdersCount
                                ? `${warehousing.monthlyOrdersCount.toLocaleString('vi-VN')} Đơn / Tháng`
                                : (warehousing?.dailyOrdersCount ? `${warehousing.dailyOrdersCount.toLocaleString('vi-VN')} Đơn / Ngày` : 'Theo thực tế đơn phát sinh')}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số Mã Hàng TMĐT (SKUs):</span>
                            <span className="font-normal text-slate-800">
                              {(warehousing?.b2cSkusCount || warehousing?.skuCount)
                                ? `${(warehousing.b2cSkusCount || warehousing.skuCount)!.toLocaleString('vi-VN')} SKUs`
                                : 'Theo thực tế nhập hàng'}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Hàng 3: SKUs & Thông số phụ kỹ thuật (nếu có) */}
                      {((warehousing?.warehouseType?.includes('Bonded') || warehousing?.warehouseType?.includes('ngoại quan')) && warehousing?.bondedPurpose) || (warehousing?.billingUnitPreference?.includes('Pallet') && warehousing?.palletSpecsDescription) ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số Lượng Mã Hàng Quản Lý (SKUs):</span>
                            <span className="font-normal text-slate-800">
                              {warehousing?.skuCount ? `${warehousing.skuCount.toLocaleString('vi-VN')} SKUs` : 'Theo thực tế nhập hàng'}
                            </span>
                          </div>
                          {(warehousing?.warehouseType?.includes('Bonded') || warehousing?.warehouseType?.includes('ngoại quan')) && warehousing?.bondedPurpose ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mục Đích / Luồng Hàng Kho Ngoại Quan:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(warehousing.bondedPurpose)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Quy Cách & Chiều Cao 1 Pallet:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(warehousing?.palletSpecsDescription)}
                              </span>
                            </div>
                          )}
                        </>
                      ) : !(warehousing?.warehouseType === 'Kho TMĐT / Fulfillment' || warehousing?.billingUnitPreference?.includes('Order')) ? (
                        <div className="flex items-baseline gap-2 md:col-span-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số Lượng Mã Hàng Quản Lý (SKUs):</span>
                          <span className="font-normal text-slate-800">
                            {warehousing?.skuCount ? `${warehousing.skuCount.toLocaleString('vi-VN')} SKUs` : 'Theo thực tế nhập hàng'}
                          </span>
                        </div>
                      ) : null}

                      {/* Hàng 4: Lưu lượng Nhập - Xuất Inbound/Outbound hoặc Đặc thù kho tự quản */}
                      {warehousing?.warehouseType === 'Kho tự quản (Self-Storage)' ? null : (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Lưu Lượng Nhập Kho (Inbound):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(warehousing?.dailyInboundVolume) || (warehousing?.inboundQty ? `${warehousing.inboundQty.toLocaleString('vi-VN')} ${cleanTextNoEmoji(warehousing.inboundUnit)} / ${warehousing.inboundPeriod}` : 'Theo nhu cầu nhập hàng')}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Lưu Lượng Xuất Kho (Outbound):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(warehousing?.dailyOutboundVolume) || (warehousing?.outboundQty ? `${warehousing.outboundQty.toLocaleString('vi-VN')} ${cleanTextNoEmoji(warehousing.outboundUnit)} / ${warehousing.outboundPeriod}` : 'Theo nhu cầu xuất hàng')}
                            </span>
                          </div>

                          {/* Hàng 5: Nguyên tắc quản lý tồn kho & Tích hợp phần mềm WMS API */}
                          {warehousing?.inventoryMethod && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Nguyên Tắc Quản Lý Hạn Dùng:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(warehousing.inventoryMethod)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tích Hợp Phần Mềm WMS / API / EDI:</span>
                            <span className="font-normal text-slate-800">
                              {warehousing?.wmsIntegrationNeeded ? 'Yêu cầu kết nối cổng API / EDI giữa phần mềm WMS với ERP/SAP/TMĐT' : 'Quản lý theo cổng Portal chuẩn của nhà kho'}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Hàng 6: Khu vực đặt kho & Bán kính phân phối */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Khu Vực / Tỉnh Thành Mong Muốn Đặt Kho:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(warehousing?.targetLocation || inquiry.origin)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phạm Vi & Bán Kính Phân Phối Trọng Tâm:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(inquiry.destination)}
                        </span>
                      </div>
                    </div>
                  ) : isCrossBorder ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      {/* Hàng 1: Loại hình dịch vụ & Hình thức vận chuyển */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hình Thức Vận Chuyển:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(crossBorder?.loadType)}
                        </span>
                      </div>

                      {/* Hàng 2: Vai trò doanh nghiệp & Điều kiện thương mại Incoterms */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Vai Trò Doanh Nghiệp (Trade Role):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(crossBorder?.tradeRole || inquiry.tradeRole)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Thương Mại (Incoterms 2020):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(crossBorder?.incoterms || inquiry.incoterms)}
                        </span>
                      </div>

                      {/* Hàng 3: Cửa khẩu biên giới & Phương thức vượt biên giới */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Cửa Khẩu Biên Giới (Border Checkpoint):</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(crossBorder?.borderGate)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phương Thức Vượt Biên Giới:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(crossBorder?.cargoMode)}
                        </span>
                      </div>

                      {/* Hàng 4: Phạm vi thủ tục hải quan & Điều kiện nhận/giao hàng */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phạm Vi Thủ Tục Hải Quan:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(crossBorder?.customsScope)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều Kiện Lấy & Giao Hàng:</span>
                        <span className="font-normal text-slate-800">
                          Lấy: {cleanTextNoEmoji(crossBorder?.originTerm)} ➔ Giao: {cleanTextNoEmoji(crossBorder?.destinationTerm)}
                        </span>
                      </div>

                      {/* Hàng 5: Hành trình giao nhận - parallel side-by-side columns (Emerald & Rose) */}
                      <div className="md:col-span-2 space-y-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                          Hành trình giao nhận xuyên biên giới:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                          {/* Cột 1: Điểm Lấy Hàng (Pickup) */}
                          <div className="space-y-2 border-l-2 border-emerald-500 pl-3">
                            <div className="font-black text-xs text-emerald-900">
                              Điểm Lấy Hàng (Pickup)
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-800">
                              <div>
                                <span className="text-slate-500 font-medium block text-[11px]">• Địa chỉ kho đi chính:</span>
                                <span className="font-normal text-slate-800 block pl-3">
                                  {inquiry.origin}
                                </span>
                              </div>
                              {crossBorder?.pickupLocations && crossBorder.pickupLocations.length > 1 && (
                                <div className="space-y-1.5 pt-0.5">
                                  {crossBorder.pickupLocations.slice(1).map((p, idx) => (
                                    <div key={idx}>
                                      <span className="text-slate-500 font-medium block text-[11px]">• Điểm lấy {idx + 2} (Kho gom phụ):</span>
                                      <span className="font-normal text-slate-800 block pl-3">
                                        {p || `Kho gom phụ ${idx + 2}`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Cột 2: Điểm Giao Hàng (Delivery) */}
                          <div className="space-y-2 border-l-2 border-rose-500 pl-3">
                            <div className="font-black text-xs text-rose-900">
                              Điểm Giao Hàng (Delivery)
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-800">
                              <div>
                                <span className="text-slate-500 font-medium block text-[11px]">• Địa chỉ kho đích chính:</span>
                                <span className="font-normal text-slate-800 block pl-3">
                                  {inquiry.destination}
                                </span>
                              </div>
                              {crossBorder?.deliveryLocations && crossBorder.deliveryLocations.length > 1 && (
                                <div className="space-y-1.5 pt-0.5">
                                  {crossBorder.deliveryLocations.slice(1).map((d, idx) => (
                                    <div key={idx}>
                                      <span className="text-slate-500 font-medium block text-[11px]">• Điểm giao {idx + 2} (Multi-drop phụ):</span>
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

                      {/* Hàng 6: Cấu hình phương tiện FTL (2 cột: Loại phương tiện & Phân khúc tải trọng) */}
                      {isCrossBorderFtl && (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại Phương Tiện / Thùng Xe:</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(crossBorder?.vehicleType)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phân Khúc Tải Trọng:</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(crossBorder?.tonnageCategory)}
                            </span>
                          </div>

                          {/* Hàng 7: SLA Leadtime & Ghi chú */}
                          {crossBorder?.leadtimeSLA && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời Gian Vận Chuyển (SLA):</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(crossBorder.leadtimeSLA)}
                              </span>
                            </div>
                          )}
                          {crossBorder?.leadtimeNote && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Ghi Chú Tiến Độ / Lịch Trình:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(crossBorder.leadtimeNote)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : isCustoms ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      {/* Hàng 1: Loại hình dịch vụ & Mô hình thủ tục */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mô Hình Thủ Tục Hải Quan:</span>
                        <span className="font-normal text-slate-800">
                          {isCustomsExport ? 'Thủ tục Xuất khẩu (Export Clearance)' : 'Thủ tục Nhập khẩu (Import Clearance)'}
                        </span>
                      </div>

                      {/* Hàng 2: Loại hình tờ khai & Hình thức đứng tên tờ khai */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại Hình Tờ Khai Hải Quan:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(customs?.declarationType)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hình Thức Đứng Tên Tờ Khai:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(customs?.declarationEntity)}
                        </span>
                      </div>

                      {/* Hàng 3: Chi cục HQ mở tờ khai & Cảng/Cửa khẩu/Sân bay/ICD thực tế */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Chi Cục Hải Quan Mở Tờ Khai:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(customs?.customsSubDepartment || inquiry.origin)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Cảng / Sân Bay / Cửa Khẩu / ICD:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(customs?.portOrBorderGate || inquiry.destination)}
                        </span>
                      </div>

                      {/* Hàng 4: Mã HS Code chính & Trị giá hóa đơn khai báo - chỉ hiển thị khi có dữ liệu */}
                      {(customs?.hsCodePrimary || inquiry.hsCode) && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã HS Code Chính:</span>
                          <span className="font-mono font-bold text-amber-950">
                            {customs?.hsCodePrimary || inquiry.hsCode}
                          </span>
                        </div>
                      )}
                      {(customs?.cargoValue || inquiry.cargoValue || customs?.invoiceValueUSD) && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trị Giá Khai Báo (Invoice Value):</span>
                          <span className="font-normal text-slate-800">
                            {customs?.cargoValue || inquiry.cargoValue
                              ? `${typeof (customs?.cargoValue || inquiry.cargoValue) === 'number' ? (customs?.cargoValue || inquiry.cargoValue).toLocaleString('vi-VN') : (customs?.cargoValue || inquiry.cargoValue)} ${customs?.cargoValueCurrency || inquiry.cargoValueCurrency || 'USD'}`
                              : `${customs?.invoiceValueUSD?.toLocaleString('vi-VN')} USD`}
                          </span>
                        </div>
                      )}

                      {/* Hàng 5: Chứng nhận xuất xứ (C/O) & Kiểm tra chuyên ngành - chỉ hiển thị nếu có */}
                      {customs?.coFormRequested && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Chứng Nhận Xuất Xứ (C/O):</span>
                          <span className="font-normal text-slate-800">
                            {cleanTextNoEmoji(customs.coFormRequested)}
                          </span>
                        </div>
                      )}
                      {customs?.specializedInspectionType && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thủ Tục Kiểm Tra Chuyên Ngành:</span>
                          <span className="font-normal text-slate-800">
                            {cleanTextNoEmoji(customs.specializedInspectionType)}
                          </span>
                        </div>
                      )}

                      {/* Hàng 6: Hỗ trợ kiểm hóa luồng đỏ & Số lượng tờ khai cam kết */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kiểm Hóa Thực Tế Luồng Đỏ:</span>
                        <span className="font-normal text-slate-800">
                          {customs?.redChannelInspectionSupport ? 'Yêu cầu nhân sự hiện trường bốc xếp, cắt seal & kiểm hóa' : 'Không yêu cầu (Chủ hàng tự xử lý)'}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Quy Mô Tờ Khai Dự Kiến:</span>
                        <span className="font-normal text-slate-800">
                          {customs?.declarationCount ? `${customs.declarationCount} ${cleanTextNoEmoji(customs.declarationFrequencyUnit) || 'Tờ khai'}` : (customs?.committedVolume ? `${customs.committedVolume} Tờ khai / ${customs.committedFrequency || 'Tháng'}` : '1 Tờ khai (Một lần / Spot)')}
                        </span>
                      </div>
                    </div>
                  ) : isColdChain ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      {/* Hàng 1: Loại hình dịch vụ & Dải nhiệt độ bảo quản */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Dải Nhiệt Độ Bảo Quản:</span>
                        <span className="font-bold text-emerald-800">
                          {cleanTextNoEmoji(coldChain?.temperatureCategory || inquiry.temperatureRequirement || 'Đông lạnh / Mát kiểm soát')}
                        </span>
                      </div>

                      {/* Hàng 2: Loại xe / Container lạnh & Chạy máy phát Genset */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại Xe / Cont Lạnh:</span>
                        <span className="font-normal text-slate-800">
                          {cleanTextNoEmoji(coldChain?.vehicleOrContType || 'Xe tải lạnh chuyên dụng')}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Máy Phát Điện Genset:</span>
                        <span className="font-normal text-slate-800">
                          {coldChain?.backupGensetIncluded ? 'Duy trì cấp điện Clip-on Genset liên tục' : 'Theo quy chuẩn xe lạnh'}
                        </span>
                      </div>

                      {/* Hàng 3: Tiền làm lạnh & IoT GPS Data Logger */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tiền Làm Lạnh (Pre-cooling):</span>
                        <span className="font-normal text-slate-800">
                          {coldChain?.preCoolingRequested ? 'Làm lạnh thùng trước 30-60 phút trước khi bốc hàng' : 'Không yêu cầu'}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">IoT Data Logger & GPS:</span>
                        <span className="font-normal text-slate-800">
                          {coldChain?.realtimeGpsTempLogging ? 'Ghi & truyền biểu đồ nhiệt độ online 24/7' : 'Theo dõi định kỳ'}
                        </span>
                      </div>

                      {/* Hàng 4: Kho Lạnh Xuất Phát & Kho Lạnh Đích */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kho Lạnh Xuất Phát (Origin):</span>
                        <span className="font-normal text-slate-800">
                          {inquiry.origin}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kho Lạnh Đích Đến (Destination):</span>
                        <span className="font-normal text-slate-800">
                          {inquiry.destination}
                        </span>
                      </div>

                      {/* Hàng 5: Tiêu chuẩn Dược phẩm GDP / HACCP */}
                      {coldChain?.isPharmaCertifiedGDP && (
                        <div className="flex items-baseline gap-2 md:col-span-2">
                          <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Tiêu Chuẩn Chuỗi Lạnh:</span>
                          <span className="font-normal text-emerald-800 font-bold">
                            Đạt chứng nhận kiểm soát nhiệt độ nghiêm ngặt chuẩn GDP Dược Phẩm / HACCP
                          </span>
                        </div>
                      )}
                    </div>
                  ) : isProjectCargo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                      {/* Hàng 1: Loại hình dịch vụ & Mô hình dự án */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hình dịch vụ:</span>
                        <span className="font-normal text-slate-800">{getServiceNameVi(inquiry.serviceType)}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phân Loại Mô Hình Dự Án:</span>
                        <span className="font-normal text-slate-800">
                          {project?.projectCategory === 'CROSS_DOCK'
                            ? 'Cross-Docking & Trung Chuyển Nhanh'
                            : project?.projectCategory === 'PORT_ICD'
                              ? 'Vận Tải Cảng Biển & ICD / Depot'
                              : project?.projectCategory === 'MULTIMODAL'
                                ? 'Vận Tải Đa Phương Thức (Multimodal)'
                                : cleanTextNoEmoji(project?.projectCategory || 'Mạng Lưới Phân Phối (Distribution)')}
                        </span>
                      </div>

                      {project?.projectCategory === 'CROSS_DOCK' ? (
                        <>
                          {project?.xDockScope && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phạm Vi Cross-Dock:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(project.xDockScope)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Sản Lượng Thông Qua:</span>
                            <span className="font-normal text-slate-800">
                              {project?.xDockThroughputPalletsDay
                                ? `${project.xDockThroughputPalletsDay.toLocaleString('vi-VN')} Pallet / Ngày`
                                : (project?.xDockThroughputCbmDay ? `${project.xDockThroughputCbmDay.toLocaleString('vi-VN')} CBM / Ngày` : (project?.xDockInboundVolume || 'Theo thỏa thuận'))}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trạm Gom Nguồn (Cross-Dock Hub):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(project?.xDockHubLocation || inquiry.origin)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trạm Phân Phối Đích (Dest Hub):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(project?.xDockDestinationHub || inquiry.destination)}
                            </span>
                          </div>
                          {project?.xDockSortationServices && project.xDockSortationServices.length > 0 && (
                            <div className="flex items-baseline gap-2 md:col-span-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Dịch Vụ Phân Loại / Chia Chọn:</span>
                              <span className="font-normal text-slate-800">
                                {project.xDockSortationServices.join(', ')}
                              </span>
                            </div>
                          )}
                          {project?.xDockVehicleTypes && project.xDockVehicleTypes.length > 0 && (
                            <div className="flex items-baseline gap-2 md:col-span-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Cấu Hình Đội Xe Trung Chuyển:</span>
                              <span className="font-normal text-slate-800">
                                {project.xDockVehicleTypes.join(', ')}
                              </span>
                            </div>
                          )}
                        </>
                      ) : project?.projectCategory === 'PORT_ICD' ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Cảng Biển Gốc (Origin Port):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(project?.portIcdOriginPort || inquiry.origin)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">ICD / Depot Đích (Destination):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(project?.portIcdDestinationIcd || inquiry.destination)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Sản Lượng Container:</span>
                            <span className="font-normal text-slate-800">
                              {project?.portIcdContVolumeMonth
                                ? `${project.portIcdContVolumeMonth.toLocaleString('vi-VN')} Cont / Tháng`
                                : (project?.portIcdMonthlyTeuOrVolume || 'Theo thỏa thuận')}
                            </span>
                          </div>
                          {project?.portIcdHaulageType && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phương Thức Kéo Cont:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(project.portIcdHaulageType)}
                              </span>
                            </div>
                          )}
                          {project?.portIcdContTypes && project.portIcdContTypes.length > 0 && (
                            <div className="flex items-baseline gap-2 md:col-span-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại Container Vận Chuyển:</span>
                              <span className="font-normal text-slate-800">
                                {project.portIcdContTypes.join(', ')}
                              </span>
                            </div>
                          )}
                        </>
                      ) : project?.projectCategory === 'MULTIMODAL' ? (
                        <>
                          {project?.multimodalCombo && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mô Hình Đa Phương Thức:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(project.multimodalCombo)}
                              </span>
                            </div>
                          )}
                          {project?.multimodalTargetLeadtime && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời Gian Giao Hàng (SLA):</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(project.multimodalTargetLeadtime)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Chặng Đầu (First-mile Origin):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(project?.multimodalFirstMile || inquiry.origin)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Chặng Cuối (Last-mile Dest):</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(project?.multimodalLastMile || inquiry.destination)}
                            </span>
                          </div>
                          {project?.multimodalTransitHub && (
                            <div className="flex items-baseline gap-2 md:col-span-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trạm Trung Chuyển (Transit Hub):</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(project.multimodalTransitHub)}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Hàng 2: Kênh phân phối & Phạm vi địa lý */}
                          {project?.distributionChannel && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kênh Phân Phối Mục Tiêu:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(project.distributionChannel)}
                              </span>
                            </div>
                          )}
                          {project?.coverageScope && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phạm Vi Địa Lý Phân Phối:</span>
                              <span className="font-normal text-slate-800">
                                {cleanTextNoEmoji(project.coverageScope)}
                              </span>
                            </div>
                          )}

                          {/* Hàng 3: Kho Tổng / Nhà máy xuất hàng & Điểm đến */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Kho Tổng Xuất Hàng Chính (Hubs):</span>
                            <span className="font-normal text-slate-800">
                              {project?.originWarehouses && project.originWarehouses.length > 0
                                ? project.originWarehouses.join('; ')
                                : inquiry.origin}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Địa Bàn Phân Phối / Điểm Đến:</span>
                            <span className="font-normal text-slate-800">
                              {cleanTextNoEmoji(project?.destinationSite || inquiry.destination)}
                            </span>
                          </div>

                          {/* Hàng 4: Cấu hình đội xe & Báo cáo KPI OTIF */}
                          {project?.fleetRequirements && project.fleetRequirements.length > 0 && (
                            <div className="flex items-baseline gap-2 md:col-span-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Đội Xe Vận Tải Yêu Cầu:</span>
                              <span className="font-normal text-slate-800">
                                {project.fleetRequirements.join(', ')}
                              </span>
                            </div>
                          )}

                          {project?.keyKPIRequirements && project.keyKPIRequirements.length > 0 && (
                            <div className="flex items-baseline gap-2 md:col-span-2">
                              <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Cam Kết KPI Vận Hành:</span>
                              <span className="font-normal text-slate-800">
                                {project.keyKPIRequirements.join(', ')}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <>
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
                                <span className="text-slate-500 font-medium block text-[11px]">• Địa chỉ kho đi chính:</span>
                                <span className="font-normal text-slate-800 block pl-3">
                                  {inquiry.origin}
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
                                  {inquiry.destination}
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
                              <span className="font-normal text-slate-800">{cleanTextNoEmoji(trucking?.truckType)}</span>
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
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* NHÓM 4: THỜI HẠN THUÊ KHO, TIẾN ĐỘ & HÌNH THỨC HỢP ĐỒNG (KHO BÃI) HOẶC SẢN LƯỢNG */}
              {/* ========================================================================= */}
              <div className="space-y-3 pt-2">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {isWarehousing
                      ? '4. THỜI HẠN THUÊ KHO, TIẾN ĐỘ & HÌNH THỨC HỢP ĐỒNG'
                      : '4. THÔNG TIN LỊCH TRÌNH, SẢN LƯỢNG & MÔ HÌNH BÁO GIÁ'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hình thức báo giá:</span>
                      <span className="font-normal text-slate-800">
                        {isWarehousing
                          ? (inquiry.pricingType === 'CONTRACT' ? 'Thuê Kho Dài Hạn (Contract / Dedicated Hub)' : 'Thuê Kho Ngắn Hạn / Mùa Vụ (Spot Storage)')
                          : (inquiry.pricingType === 'CONTRACT' ? 'Hợp Đồng Dài Hạn (Contract / Tender)' : 'Chuyến Đơn Lẻ (Spot Quote)')}
                      </span>
                    </div>

                    {isTrucking && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số lượng chuyến cần thuê:</span>
                        <span className="font-normal text-slate-800">
                          {trucking?.loadType === 'LTL (Ghép hàng lẻ)'
                            ? `${trucking?.ltlShipmentCount || ''} ${trucking?.ltlFrequencyUnit || ''}`.trim()
                            : `${trucking?.vehicleCount || ''} ${trucking?.vehicleCountUnit || ''}`.trim()}
                        </span>
                      </div>
                    )}

                    {isOcean && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {isLcl ? 'Số Lượng Chuyến Ghép:' : 'Số Lượng Container Cần Thuê:'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {isLcl
                            ? `${ocean?.lclShipmentCount || ''} ${ocean?.lclFrequencyUnit || ''}`.trim()
                            : `${ocean?.containerCount || ''} ${ocean?.containerCountUnit || ''}`.trim()}
                        </span>
                      </div>
                    )}

                    {isAir && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          Số Lượng Chuyến Hàng Không:
                        </span>
                        <span className="font-normal text-slate-800">
                          {air?.shipmentCount
                            ? `${air.shipmentCount} ${air.frequencyUnit || ''}`.trim()
                            : ''}
                        </span>
                      </div>
                    )}

                    {isRail && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {isRailLcl ? 'Số Lượng Chuyến Ghép:' : 'Số Lượng Container / Toa Xe Cần Thuê:'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {isRailLcl
                            ? `${rail?.lclShipmentCount || ''} ${cleanTextNoEmoji(rail?.lclFrequencyUnit) || ''}`.trim()
                            : `${rail?.containerCount || ''} ${cleanTextNoEmoji(rail?.containerCountUnit) || ''}`.trim()}
                        </span>
                      </div>
                    )}

                    {isCrossBorder && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          {isCrossBorderLtl ? 'Số Lượng Lô Hàng Cần Ghép:' : 'Số Lượng Chuyến / Xe Cần Thuê:'}
                        </span>
                        <span className="font-normal text-slate-800">
                          {isCrossBorderLtl
                            ? `${crossBorder?.shipmentCount || ''} ${cleanTextNoEmoji(crossBorder?.frequencyUnit) || ''}`.trim()
                            : `${crossBorder?.vehicleCount || ''} ${cleanTextNoEmoji(crossBorder?.frequencyUnit) || ''}`.trim()}
                        </span>
                      </div>
                    )}

                    {isWarehousing && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          Thời Hạn Thuê Kho:
                        </span>
                        <span className="font-normal text-slate-800">
                          {warehousing?.rentalDurationMonths
                            ? `${warehousing.rentalDurationMonths} Tháng`
                            : (inquiry.contractTerm || (inquiry.pricingType === 'CONTRACT' ? 'Hợp đồng dài hạn' : 'Lưu kho ngắn hạn (Spot)'))}
                        </span>
                      </div>
                    )}

                    {isCustoms && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium min-w-[130px] shrink-0">
                          Số Lượng Tờ Khai Yêu Cầu:
                        </span>
                        <span className="font-normal text-slate-800">
                          {customs?.declarationCount ? `${customs.declarationCount} ${cleanTextNoEmoji(customs.declarationFrequencyUnit) || 'Tờ khai'}`.trim() : (customs?.committedVolume ? `${customs.committedVolume} Tờ khai / ${customs.committedFrequency || 'Tháng'}` : '')}
                        </span>
                      </div>
                    )}

                    {inquiry.pricingType === 'CONTRACT' && inquiry.contractTerm && !isWarehousing && (
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
                        <span className="font-normal text-slate-800 block text-xs">{inquiry.expiryDate}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[11px] block">
                          {isWarehousing ? 'Ngày bắt đầu thuê kho dự kiến:' : 'Ngày lấy hàng dự kiến:'}
                        </span>
                        <span className="font-normal text-slate-800 block text-xs">{inquiry.pickupDate}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[11px] block">
                          {isWarehousing ? 'Hạn chót nghiệm thu / Vận hành:' : 'Hạn chót giao hàng:'}
                        </span>
                        <span className="font-normal text-slate-800 block text-xs">{inquiry.deliveryDate}</span>
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
                  <table className="border-collapse text-xs text-left border-spacing-0 table-fixed" style={{ width: onlyAwardedSupplier ? '100%' : 'max-content' }}>
                    {/* CỐ ĐỊNH KÍCH THƯỚC CỘT CHUẨN FORM BIỂU GIÁ NHÀ CUNG CẤP */}
                    <colgroup>
                      <col style={{ width: onlyAwardedSupplier ? '380px' : '300px', minWidth: onlyAwardedSupplier ? '380px' : '300px' }} />
                      <col style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }} />
                      <col style={{ width: onlyAwardedSupplier ? '240px' : '260px', minWidth: onlyAwardedSupplier ? '240px' : '260px' }} />
                      {isQuoting && (
                        <col style={{ width: '280px', minWidth: '280px', maxWidth: '280px' }} />
                      )}
                      {competitorQuotes.map((c) => (
                        <col key={c.id} style={{ width: onlyAwardedSupplier ? '280px' : '220px', minWidth: onlyAwardedSupplier ? '280px' : '220px' }} />
                      ))}
                    </colgroup>
                    <thead>
                      <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 border-r border-slate-200">
                          <span>CỘT 1: HẠNG MỤC CHI PHÍ BÁO GIÁ</span>
                        </th>
                        <th className="py-3 px-3 text-center border-r border-slate-200">
                          CỘT 2: ĐVT
                        </th>
                        <th className="py-3 px-3 text-center bg-indigo-50/60 border-r border-slate-200">
                          <span className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider">
                            GIÁ MỤC TIÊU CỦA KH
                          </span>
                        </th>

                        {/* CỘT BÁO GIÁ CỦA BẠN (KHI USER NHẤN BÁO GIÁ) */}
                        {isQuoting && (
                          <th className="py-2.5 px-3 text-center bg-indigo-600 text-white border-r border-indigo-700">
                            <div className="flex flex-col items-center justify-center">
                              <div className="inline-flex items-center gap-1 font-black text-white bg-indigo-700 px-2.5 py-1 rounded-lg text-xs shadow-xs">
                                <Send className="w-3 h-3 text-indigo-200" />
                                <span>BÁO GIÁ CỦA BẠN</span>
                              </div>
                              <span className="text-[9.5px] text-indigo-100 font-medium mt-0.5">Cột chào thầu trực tiếp</span>
                            </div>
                          </th>
                        )}

                        {/* CÁC CỘT CỦA SUPPLIER (KHI onlyAwardedSupplier: CHỈ 1 CỘT DUY NHẤT CỦA SUPPLIER TRÚNG THẦU) */}
                        {competitorQuotes.map((comp, cIdx) => (
                          <th key={comp.id} className={`py-2.5 px-3 text-center border-r border-slate-200 align-top ${onlyAwardedSupplier ? 'bg-emerald-50/40' : 'bg-slate-50'}`}>
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              {effectiveUnlocked ? (
                                <>
                                  {/* 1. NÚT TRAO THẦU Ở TRÊN ĐẦU BẢNG */}
                                  {!isSupplierView && (
                                    <div className="w-full flex justify-center pb-1 border-b border-slate-200/80">
                                      {(awardedSupplierName === comp.companyName || onlyAwardedSupplier || comp.isAwarded) ? (
                                        <span className="w-full py-1.5 px-2.5 bg-emerald-600 text-white font-black text-[11px] rounded-lg shadow-xs inline-flex items-center justify-center gap-1 select-none">
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          <span>Đã Trao Thầu</span>
                                        </span>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAwardedSupplierName(comp.companyName);
                                            setQuoteSubmittedToast(`Đã trao thầu thành công cho ${comp.companyName} (${comp.picName})! Hợp đồng điện tử đã được tạo.`);
                                            setTimeout(() => setQuoteSubmittedToast(null), 4000);
                                          }}
                                          className="w-full py-1 px-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] rounded-lg shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:shadow-md"
                                          title="Trao thầu cho nhà cung cấp này"
                                        >
                                          <Trophy className="w-3.5 h-3.5 text-white shrink-0" />
                                          <span>Trao Thầu</span>
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* 2. TÊN PIC VÀ SUBTEXT TÊN CÔNG TY */}
                                  <div className="flex flex-col items-center justify-center w-full px-1">
                                    <span className="font-black text-slate-900 text-xs tracking-tight truncate w-full text-center" title={comp.picName}>
                                      {comp.picName}
                                    </span>
                                    <span className="text-[10.5px] text-slate-600 font-bold truncate w-full text-center mt-0.5" title={comp.companyName}>
                                      {comp.companyName}
                                    </span>
                                    {onlyAwardedSupplier && (
                                      <span className="text-[9.5px] text-emerald-700 font-bold mt-0.5 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                                        Nhà thầu chiến thắng
                                      </span>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="inline-flex items-center gap-1 font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md text-[11px]">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    <span>Nhà cung cấp #{cIdx + 1}</span>
                                  </div>
                                  <span className="text-[9px] text-amber-700 font-semibold mt-0.5">Bảo mật (Chưa mở khóa)</span>
                                </>
                              )}
                            </div>
                          </th>
                        ))}
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
                              {activeInquiry.targetBudget
                                ? (activeInquiry.targetBudget.toString().replace(/₫|VND|USD|\$/g, '').trim())
                                : '—'}
                            </span>
                          </div>
                        </td>

                        {/* Cột Báo giá của bạn: Tổng cước */}
                        {isQuoting && (
                          <td className="py-2 px-3 text-center border-r border-slate-200 bg-indigo-50/60">
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                value={myTotalQuoteInput}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^\d]/g, '');
                                  if (!val) {
                                    setMyTotalQuoteInput('');
                                    return;
                                  }
                                  const num = parseInt(val, 10);
                                  setMyTotalQuoteInput(num.toLocaleString('vi-VN') + targetCurrencySuffix);
                                }}
                                className="w-full text-center font-black text-indigo-900 bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 outline-none shadow-2xs"
                                placeholder="0"
                              />
                              <button
                                type="button"
                                onClick={handleSendQuote}
                                className={`w-full py-1 px-2 rounded-lg text-white font-extrabold text-[10.5px] shadow-xs cursor-pointer flex items-center justify-center gap-1 transition-all active:scale-95 ${
                                  hasSubmittedQuote ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                              >
                                {hasSubmittedQuote ? <Check className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                                <span>{hasSubmittedQuote ? 'Đã gửi báo giá' : 'Xác nhận báo giá'}</span>
                              </button>
                            </div>
                          </td>
                        )}

                        {/* Các cột đối thủ: Tổng cước */}
                        {competitorQuotes.map((comp) => (
                          <td key={comp.id} className="py-3 px-3 text-center border-r border-slate-200 bg-slate-50/40">
                            {effectiveUnlocked ? (
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-sm font-black text-slate-900 tracking-tight">
                                  {comp.formattedTotal}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-1 select-none">
                                <span className="font-mono text-slate-400 tracking-widest text-sm">••••••••</span>
                                <span className="text-[9px] text-amber-600 font-semibold flex items-center gap-0.5 mt-0.5">
                                  <Lock className="w-2.5 h-2.5" /> Ẩn giá
                                </span>
                              </div>
                            )}
                          </td>
                        ))}
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
                          <div className="inline-flex items-center justify-center w-full min-h-[30px] bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                            <span className="font-mono font-bold text-slate-700 text-xs">
                              {activeInquiry.targetBudget ? 'Bao gồm' : '—'}
                            </span>
                          </div>
                        </td>

                        {/* Cột Báo giá của bạn: Cước chính */}
                        {isQuoting && (
                          <td className="py-2 px-3 text-center border-r border-slate-200 bg-indigo-50/40">
                            <input
                              type="text"
                              value={myBaseFreightInput}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^\d]/g, '');
                                if (!val) {
                                  setMyBaseFreightInput('');
                                  return;
                                }
                                const num = parseInt(val, 10);
                                setMyBaseFreightInput(num.toLocaleString('vi-VN') + targetCurrencySuffix);
                              }}
                              className="w-full text-center font-bold text-indigo-900 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-400 outline-none shadow-2xs"
                              placeholder="0"
                            />
                          </td>
                        )}

                        {/* Các cột đối thủ: Cước chính */}
                        {competitorQuotes.map((comp) => (
                          <td key={comp.id} className="py-3 px-3 text-center border-r border-slate-200">
                            {effectiveUnlocked ? (
                              <span className="font-mono font-bold text-slate-800 text-xs">
                                {comp.formattedBase}
                              </span>
                            ) : (
                              <span className="font-mono text-slate-300 tracking-widest text-xs select-none">••••••••</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* 1. PHỤ PHÍ HÃNG TÀU / VẬN HÀNH / ĐỊA PHƯƠNG */}
                      <tr className="bg-slate-100/90 font-black text-slate-800 text-[11px] uppercase tracking-wider border-t-2 border-slate-200">
                        <td colSpan={3 + (isQuoting ? 1 : 0) + competitorQuotes.length} className="py-2 px-4 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <span>{getServiceSection1Title()}</span>
                            {activeInquiry.quotationScope === 'ALL_IN' ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 tracking-normal">
                                Yêu cầu Báo Giá Trọn Gói (All-in)
                              </span>
                            ) : activeInquiry.requestedSurcharges && activeInquiry.requestedSurcharges.length > 0 ? (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 tracking-normal">
                                Báo Giá Bóc Tách ({activeInquiry.requestedSurcharges.length} mục đã chỉ định)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-md tracking-normal">
                                Tùy chọn phụ phí
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {isQuoting ? (
                        <>
                          {quotedSurcharges.length > 0 ? (
                            quotedSurcharges.map((charge) => (
                              <tr key={charge.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2 px-4 border-r border-slate-200">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSurcharge(charge.id)}
                                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                                        title={`Xóa phụ phí "${charge.name}"`}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="text-slate-400 text-xs shrink-0">•</span>
                                      <span className="text-xs font-semibold text-slate-800 truncate" title={charge.name}>
                                        {charge.name}
                                      </span>
                                    </div>
                                    <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0 select-none">
                                      LOV
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 px-3 text-center border-r border-slate-200 font-medium text-slate-600 text-xs">
                                  {charge.unit}
                                </td>
                                <td className="py-2 px-4 text-center border-r border-slate-200">
                                  <div className="inline-flex items-center justify-center w-full min-h-[30px] bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                                    <span className="font-mono font-bold text-slate-700 text-xs">
                                      {charge.isFromCustomer ? 'Theo chuẩn' : 'Bổ sung'}
                                    </span>
                                  </div>
                                </td>

                                {/* Cột Báo giá của bạn: Nhập giá phụ phí */}
                                <td className="py-2 px-3 text-center border-r border-slate-200 bg-indigo-50/40">
                                  <div className="relative flex items-center">
                                    <input
                                      type="text"
                                      value={charge.price}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/[^\d.]/g, '');
                                        const num = parseFloat(val.replace(/\./g, ''));
                                        const formatted = isNaN(num) ? '' : num.toLocaleString('vi-VN');
                                        handleSurchargePriceChange(charge.id, formatted || val);
                                      }}
                                      placeholder="0"
                                      className="w-full py-1.5 pl-3 pr-7 text-right font-mono font-medium text-xs text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                                    />
                                    <span className="absolute right-2.5 text-[11px] font-semibold text-slate-400 pointer-events-none">
                                      {currencySymbol}
                                    </span>
                                  </div>
                                </td>

                                {/* Các cột đối thủ: Phụ phí */}
                                {competitorQuotes.map((comp) => {
                                  const surchargeVal = comp.surchargeMap && comp.surchargeMap[charge.name]
                                    ? comp.surchargeMap[charge.name]
                                    : comp.formattedSurcharge;
                                  return (
                                    <td key={comp.id} className="py-2 px-3 text-center border-r border-slate-200">
                                      {effectiveUnlocked ? (
                                        <span className="font-mono font-medium text-slate-700 text-xs">
                                          {surchargeVal}
                                        </span>
                                      ) : (
                                        <span className="font-mono text-slate-300 tracking-widest text-xs select-none">••••••••</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))
                          ) : (
                            <tr className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-4 border-r border-slate-200 font-medium text-slate-600 text-xs italic">
                                Khách hàng yêu cầu báo giá Trọn gói (All-in). Bạn có thể bấm chọn thêm phụ phí bên dưới để bóc tách minh bạch.
                              </td>
                              <td className="py-2.5 px-3 text-center border-r border-slate-200 text-slate-400">—</td>
                              <td className="py-2.5 px-4 text-center border-r border-slate-200">
                                <div className="inline-flex items-center justify-center w-full min-h-[30px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-500 font-medium text-xs">
                                  Đã bao gồm
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center border-r border-slate-200 bg-indigo-50/30 text-indigo-700 text-xs font-semibold">
                                Đã tính trong all-in
                              </td>
                              {competitorQuotes.map((comp) => (
                                <td key={comp.id} className="py-2.5 px-3 text-center border-r border-slate-200 text-xs text-slate-500">
                                  {effectiveUnlocked ? 'Đã bao gồm' : '••••••••'}
                                </td>
                              ))}
                            </tr>
                          )}

                          {/* HÀNG HÀNH ĐỘNG DƯỚI CÙNG: CHỌN PHỤ PHÍ THÊM TỪ LOV */}
                          {unaddedSurcharges.length > 0 && (
                            <tr className="bg-indigo-50/20 hover:bg-indigo-50/40 transition-colors border-b border-slate-200">
                              <td className="py-2 px-4 border-r border-slate-200">
                                <div className="relative">
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleAddSurchargeFromLOV(e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:border-indigo-400 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                                  >
                                    <option value="" disabled>
                                      + Chọn phụ phí thêm từ LOV ({unaddedSurcharges.length} mục)...
                                    </option>
                                    {unaddedSurcharges.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        + {item.name} — [{getSurchargeUnit(item.name)}]
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-400 text-[10px] font-medium italic select-none">
                                Theo LOV
                              </td>
                              <td colSpan={1 + 1 + competitorQuotes.length} className="py-2 px-4 border-r border-slate-200 bg-slate-50/30"></td>
                            </tr>
                          )}
                        </>
                      ) : (
                        /* CHẾ ĐỘ CUSTOMER VIEW: XEM DANH SÁCH PHỤ PHÍ ĐÃ YÊU CẦU */
                        activeInquiry.requestedSurcharges && activeInquiry.requestedSurcharges.length > 0 ? (
                          activeInquiry.requestedSurcharges.map((charge, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2 px-4 border-r border-slate-200">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">•</span>
                                  <span className="font-semibold text-slate-800 text-xs">
                                    {charge}
                                  </span>
                                  <span className="text-[9px] font-black px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded shrink-0 border border-slate-200">
                                    LOV
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center border-r border-slate-200 font-semibold text-slate-600 text-xs">
                                {getSurchargeUnit(charge)}
                              </td>
                              <td className="py-2 px-4 text-center border-r border-slate-200">
                                <div className="inline-flex items-center justify-center w-full min-h-[30px] bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                                  <span className="font-mono font-bold text-slate-700 text-xs">Theo chuẩn</span>
                                </div>
                              </td>

                              {/* Các cột đối thủ: Phụ phí */}
                              {competitorQuotes.map((comp) => {
                                const surchargeVal = comp.surchargeMap && comp.surchargeMap[charge]
                                  ? comp.surchargeMap[charge]
                                  : comp.formattedSurcharge;
                                return (
                                  <td key={comp.id} className="py-2 px-3 text-center border-r border-slate-200">
                                    {effectiveUnlocked ? (
                                      <span className="font-mono font-medium text-slate-700 text-xs">
                                        {surchargeVal}
                                      </span>
                                    ) : (
                                      <span className="font-mono text-slate-300 tracking-widest text-xs select-none">••••••••</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        ) : (
                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-4 border-r border-slate-200 font-medium text-slate-600 text-xs italic">
                              Đã bao gồm trọn gói trong cước chính (Báo giá All-in).
                            </td>
                            <td className="py-2.5 px-3 text-center border-r border-slate-200 text-slate-400">—</td>
                            <td className="py-2.5 px-4 text-center border-r border-slate-200">
                              <div className="inline-flex items-center justify-center w-full min-h-[30px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-500 font-medium text-xs">
                                Đã bao gồm
                              </div>
                            </td>
                            {competitorQuotes.map((comp) => (
                              <td key={comp.id} className="py-2.5 px-3 text-center border-r border-slate-200 text-xs text-slate-500">
                                {effectiveUnlocked ? 'Đã bao gồm' : '••••••••'}
                              </td>
                            ))}
                          </tr>
                        )
                      )}

                      {/* 2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) */}
                      <tr className="bg-purple-50/70 font-black text-slate-800 text-[11px] uppercase tracking-wider border-t-2 border-purple-100">
                        <td colSpan={3 + (isQuoting ? 1 : 0) + competitorQuotes.length} className="py-2 px-4 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <span>{getServiceSection2Title()}</span>
                            {activeInquiry.selectedVAS && activeInquiry.selectedVAS.length > 0 && (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md border border-purple-200 lowercase tracking-normal">
                                {activeInquiry.selectedVAS.length} dịch vụ
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {activeInquiry.selectedVAS && activeInquiry.selectedVAS.length > 0 ? (
                        activeInquiry.selectedVAS.map((vas, idx) => (
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
                              <div className="inline-flex items-center justify-center w-full min-h-[30px] bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                                <span className="font-mono font-bold text-indigo-700 text-xs">Yêu cầu</span>
                              </div>
                            </td>

                            {/* Cột Báo giá của bạn: VAS */}
                            {isQuoting && (
                              <td className="py-2 px-3 text-center border-r border-slate-200 bg-indigo-50/30">
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={quotedVasPrices[vas] || ''}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/[^\d.]/g, '');
                                      const num = parseFloat(val.replace(/\./g, ''));
                                      const formatted = isNaN(num) ? '' : num.toLocaleString('vi-VN');
                                      handleVasPriceChange(vas, formatted || val);
                                    }}
                                    placeholder="0"
                                    className="w-full py-1.5 pl-3 pr-7 text-right font-mono font-medium text-xs text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                                  />
                                  <span className="absolute right-2.5 text-[11px] font-semibold text-slate-400 pointer-events-none">
                                    {currencySymbol}
                                  </span>
                                </div>
                              </td>
                            )}

                            {/* Các cột đối thủ: VAS */}
                            {competitorQuotes.map((comp) => (
                              <td key={comp.id} className="py-2 px-3 text-center border-r border-slate-200">
                                {effectiveUnlocked ? (
                                  <span className="font-mono font-medium text-slate-700 text-xs">
                                    {comp.vasPrices[vas] || `0 ${currencySymbol}`}
                                  </span>
                                ) : (
                                  <span className="font-mono text-slate-300 tracking-widest text-xs select-none">••••••••</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 border-r border-slate-200 font-semibold text-slate-500 italic">
                            Không yêu cầu thêm dịch vụ giá trị gia tăng phụ trợ.
                          </td>
                          <td className="py-2.5 px-3 text-center border-r border-slate-200 text-slate-400">—</td>
                          <td className="py-2.5 px-4 text-center border-r border-slate-200">
                            <div className="inline-flex items-center justify-center w-full min-h-[30px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-400 font-medium text-xs">
                              —
                            </div>
                          </td>
                          {isQuoting && (
                            <td className="py-2.5 px-3 text-center border-r border-slate-200 bg-indigo-50/30 text-slate-400 text-xs">—</td>
                          )}
                          {competitorQuotes.map((comp) => (
                            <td key={comp.id} className="py-2.5 px-3 text-center border-r border-slate-200 text-xs text-slate-400">—</td>
                          ))}
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions - Chỉ hiển thị khi chưa xác nhận và KHÔNG PHẢI SUPPLIER VIEW */}
        {!isPublished && !isSupplierView && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Quay Lại Chỉnh Sửa Form</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="btn-confirm-publish-inquiry"
                onClick={handleConfirmPublish}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Xác nhận</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
