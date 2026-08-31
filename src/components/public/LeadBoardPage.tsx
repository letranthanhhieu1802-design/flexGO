import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Flame, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Truck, 
  Ship, 
  Plane, 
  Train,
  ArrowRight, 
  Plus, 
  Building2, 
  Clock, 
  Tag, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  ChevronDown,
  ChevronUp,
  MoveHorizontal,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  SlidersHorizontal,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Info,
  Shield,
  Layers,
  ArrowUpDown,
  ExternalLink,
  Eye,
  Send,
  Boxes,
  HelpCircle,
  RotateCcw,
  Zap,
  Lock,
  Unlock,
  Phone,
  PhoneCall,
  Mail,
  UserCheck,
  MessageSquare,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  FileText,
  Briefcase,
  Calculator,
  Repeat,
  PackageCheck,
  Hourglass,
  BarChart3,
  Coins,
  Bookmark,
  BookmarkCheck,
  X,
  Share2
} from 'lucide-react';
import { SupplierLeadItem, ServiceType, CurrentView, UserPersona, PricingType, LeadStatus, QuotationItem, FlexCreditWallet } from '../../types';
import { SupplierLeadCompareModal } from '../supplier/SupplierLeadCompareModal';
import { LeadInquiryDetailCard } from './LeadInquiryDetailCard';

interface LeadBoardPageProps {
  leads: SupplierLeadItem[];
  currentUser: UserPersona;
  quotations?: QuotationItem[];
  wallet?: FlexCreditWallet;
  initialSearchTerm?: string;
  onOpenCreateQuotation: (lead: SupplierLeadItem) => void;
  onOpenCreateInquiry: () => void;
  onNavigate: (view: CurrentView) => void;
  onDeductCredit?: (amount: number, description: string) => boolean;
  onUnlockLead?: (leadId: string, creditCost?: number) => boolean;
  onSubmitQuotation?: (quote: Partial<QuotationItem>) => void;
  onToggleSaveLead?: (leadId: string) => void;
  onIncrementLeadViews?: (leadId: string) => void;
}

type SortField = 'createdDate' | 'dueDate' | 'code' | 'estimatedValueVND' | 'unitPriceVND' | 'pricingType' | 'quotesCount' | 'viewsCount' | 'customerCompany' | 'route' | 'status';
type SortDirection = 'asc' | 'desc';

interface ServiceTabItem {
  id: string;
  name: string;
  nameVi: string;
  badge: string;
  subtext: string;
  serviceType: ServiceType | 'ALL';
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgLightClass: string;
  activeClass: string;
}

export const LeadBoardPage: React.FC<LeadBoardPageProps> = ({
  leads,
  currentUser,
  quotations = [],
  wallet,
  initialSearchTerm = '',
  onOpenCreateQuotation,
  onOpenCreateInquiry,
  onNavigate,
  onDeductCredit,
  onUnlockLead,
  onSubmitQuotation,
  onToggleSaveLead,
  onIncrementLeadViews,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [pricingTypeFilter, setPricingTypeFilter] = useState<'ALL' | 'CONTRACT' | 'SPOT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [unlockFilter, setUnlockFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('createdDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedLeadIds, setExpandedLeadIds] = useState<Record<string, boolean>>({});
  const [unlockedLeadIds, setUnlockedLeadIds] = useState<Record<string, boolean>>({});
  const [activeCompareModalLead, setActiveCompareModalLead] = useState<SupplierLeadItem | null>(null);
  const [leadToUnlockConfirm, setLeadToUnlockConfirm] = useState<SupplierLeadItem | null>(null);
  const [unlockToastMessage, setUnlockToastMessage] = useState<string | null>(null);
  const [savedToastMessage, setSavedToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedLeadLinkId, setCopiedLeadLinkId] = useState<string | null>(null);
  const [tableDensity, setTableDensity] = useState<'compact' | 'comfortable'>('comfortable');

  // Read URL query params on mount or when initialSearchTerm changes (e.g. from shared RFQ link: ?tab=lead-board&leadCode=LG-xxxxx)
  useEffect(() => {
    let effectiveSearch = initialSearchTerm;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryParam =
        params.get('leadCode') ||
        params.get('lead') ||
        params.get('inquiry') ||
        params.get('rfq') ||
        params.get('code') ||
        params.get('search');
      if (queryParam) {
        effectiveSearch = queryParam;
      }
    }

    if (effectiveSearch) {
      setSearchTerm(effectiveSearch);
      setSelectedService('ALL'); // Reset service tab so deep linked lead is immediately visible
      const targetLead = leads.find((l) =>
        l.code.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        (l.inquiryCode && l.inquiryCode.toLowerCase().includes(effectiveSearch.toLowerCase()))
      );
      if (targetLead) {
        setExpandedLeadIds((prev) => ({ ...prev, [targetLead.id]: true }));
      }
    }
  }, [initialSearchTerm, leads]);

  const handleCopyLeadLink = (leadCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`
      : `https://logistics.vietnam.io/?tab=lead-board&leadCode=${leadCode}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLeadLinkId(leadCode);
    setTimeout(() => setCopiedLeadLinkId(null), 2500);
  };

  // 8 Core Logistics Services Filter Navigator (2 hàng x 4 loại hình)
  const serviceTabs: ServiceTabItem[] = [
    {
      id: 'Trucking',
      name: 'Trucking',
      nameVi: 'Đường Bộ',
      badge: 'LTL / FTL',
      subtext: 'Xe tải thùng kín, bạt, đông lạnh...',
      serviceType: 'Trucking',
      icon: Truck,
      colorClass: 'text-blue-600',
      bgLightClass: 'bg-blue-50',
      activeClass: 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600',
    },
    {
      id: 'Sea Freight',
      name: 'Sea Freight',
      nameVi: 'Đường Biển',
      badge: 'FCL / LCL',
      subtext: 'Cảng đi - Cảng đến quốc tế & nội địa',
      serviceType: 'Sea Freight (FCL)',
      icon: Ship,
      colorClass: 'text-cyan-600',
      bgLightClass: 'bg-cyan-50',
      activeClass: 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-600',
    },
    {
      id: 'Air Freight',
      name: 'Air Freight',
      nameVi: 'Hàng Không',
      badge: 'Cargo / Express',
      subtext: 'Chuyển phát nhanh & Air Cargo',
      serviceType: 'Air Freight',
      icon: Plane,
      colorClass: 'text-sky-600',
      bgLightClass: 'bg-sky-50',
      activeClass: 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-600',
    },
    {
      id: 'Rail Freight',
      name: 'Rail Freight',
      nameVi: 'Đường Sắt',
      badge: 'FCL / LCL Ga',
      subtext: 'Tuyến Bắc Nam & Ga liên vận',
      serviceType: 'Rail Freight',
      icon: Train,
      colorClass: 'text-emerald-600',
      bgLightClass: 'bg-emerald-50',
      activeClass: 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600',
    },
    {
      id: 'Warehousing',
      name: 'Warehousing',
      nameVi: 'Kho Bãi 3PL',
      badge: '6 Loại hình kho',
      subtext: 'Kho thường, ngoại quan, lạnh...',
      serviceType: 'Warehousing',
      icon: Building2,
      colorClass: 'text-purple-600',
      bgLightClass: 'bg-purple-50',
      activeClass: 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-600',
    },
    {
      id: 'Customs Clearance',
      name: 'Customs Clearance',
      nameVi: 'Thủ Tục Hải Quan',
      badge: 'Khai báo & C/O',
      subtext: 'Thông quan cảng, sân bay, cửa khẩu',
      serviceType: 'Customs Clearance',
      icon: FileText,
      colorClass: 'text-amber-600',
      bgLightClass: 'bg-amber-50',
      activeClass: 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-600',
    },
    {
      id: 'Cross-border',
      name: 'Cross-Border',
      nameVi: 'Cross-Border',
      badge: 'VN ↔ GMS / TQ',
      subtext: 'Vận tải bộ xuyên biên giới',
      serviceType: 'Cross-border',
      icon: Globe,
      colorClass: 'text-orange-600',
      bgLightClass: 'bg-orange-50',
      activeClass: 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-600',
    },
    {
      id: 'Project Cargo',
      name: 'Project Cargo',
      nameVi: 'Integrated / Dự Án',
      badge: 'OOG / Đa PT',
      subtext: 'Hàng siêu trường siêu trọng, dự án',
      serviceType: 'Project Cargo',
      icon: Layers,
      colorClass: 'text-indigo-600',
      bgLightClass: 'bg-indigo-50',
      activeClass: 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-600',
    },
  ];

  // Count leads per service
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: leads.length,
      Trucking: leads.filter((l) => l.serviceType === 'Trucking' || l.serviceType === 'Cold Chain').length,
      'Sea Freight': leads.filter((l) => l.serviceType === 'Sea Freight (FCL)' || l.serviceType === 'Sea Freight (LCL)').length,
      'Air Freight': leads.filter((l) => l.serviceType === 'Air Freight').length,
      'Rail Freight': leads.filter((l) => l.serviceType === 'Rail Freight').length,
      Warehousing: leads.filter((l) => l.serviceType === 'Warehousing').length,
      'Customs Clearance': leads.filter((l) => l.serviceType === 'Customs Clearance').length,
      'Cross-border': leads.filter((l) => l.serviceType === 'Cross-border' || (l.serviceType as string) === 'Cross-Border').length,
      'Project Cargo': leads.filter((l) => l.serviceType === 'Project Cargo').length,
    };
    return counts;
  }, [leads]);

  // Overall Marketplace KPIs separated by Contract vs Spot
  const marketStats = useMemo(() => {
    const totalLeads = leads.length;
    const contractLeads = leads.filter(l => l.pricingType === 'CONTRACT');
    const spotLeads = leads.filter(l => l.pricingType === 'SPOT');
    
    const contractEstMonthlyTotal = contractLeads.reduce((sum, l) => sum + (l.estimatedValueVND || 0), 0);
    const spotEstTotal = spotLeads.reduce((sum, l) => sum + (l.estimatedValueVND || 0), 0);
    const totalEstValue = leads.reduce((sum, l) => sum + (l.estimatedValueVND || 0), 0);
    const totalQuotesSubmitted = leads.reduce((sum, l) => sum + (l.quotesCount || 0), 0);
    const totalViewsCount = leads.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
    const unlockedCount = leads.filter((l) => Boolean(unlockedLeadIds[l.id] || l.isUnlocked)).length;

    return {
      totalLeads,
      contractCount: contractLeads.length,
      spotCount: spotLeads.length,
      contractEstMonthlyTotal,
      spotEstTotal,
      totalEstValue,
      totalQuotesSubmitted,
      totalViewsCount,
      unlockedCount,
    };
  }, [leads, unlockedLeadIds]);

  // Masking helper for guest / non-unlocked view (5 ký tự đầu + 5 sao cho công ty; 3 ký tự đầu + 3 sao cho khách hàng)
  const maskCompanyName = (name: string, isUnlocked: boolean) => {
    if (isUnlocked) return name;
    const prefix = (name || '').slice(0, 5);
    return `${prefix}*****`;
  };

  const maskContactPerson = (name: string, isUnlocked: boolean) => {
    if (isUnlocked) return name;
    const prefix = (name || '').slice(0, 3);
    return `${prefix}***`;
  };

  const maskPhoneNumber = (phone: string | undefined, isUnlocked: boolean) => {
    if (!phone) return '09•• ••• •••';
    if (isUnlocked) return phone;
    const clean = phone.replace(/\s+/g, '');
    return `${clean.slice(0, 4)} ••• •••`;
  };

  // Filtered and Sorted Leads
  const filteredAndSortedLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const isUnlocked = Boolean(unlockedLeadIds[lead.id] || lead.isUnlocked);

        // Search (Chỉ tìm kiếm theo Mã Lead)
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          lead.code.toLowerCase().includes(term) ||
          (lead.inquiryCode && lead.inquiryCode.toLowerCase().includes(term));

        // Service Tab (Hỗ trợ 8 nhóm dịch vụ cốt lõi)
        const matchesService =
          selectedService === 'ALL' ||
          (selectedService === 'Trucking'
            ? lead.serviceType === 'Trucking' || lead.serviceType === 'Cold Chain'
            : selectedService === 'Sea Freight'
            ? lead.serviceType === 'Sea Freight (FCL)' || lead.serviceType === 'Sea Freight (LCL)'
            : selectedService === 'Cross-border'
            ? lead.serviceType === 'Cross-border' || (lead.serviceType as string) === 'Cross-Border'
            : lead.serviceType === selectedService);

        // Pricing Type Filter (Lô / Hợp đồng)
        const matchesPricingType =
          pricingTypeFilter === 'ALL' || lead.pricingType === pricingTypeFilter;

        // Status Filter (Trạng thái liên hệ / vòng đời Lead)
        const matchesStatus =
          statusFilter === 'ALL' || lead.status === statusFilter;

        // Urgency Filter
        const matchesUrgency =
          urgencyFilter === 'ALL' || lead.urgency === urgencyFilter;

        // Unlock Status Filter
        let matchesUnlock = true;
        if (unlockFilter === 'UNLOCKED') {
          matchesUnlock = isUnlocked;
        } else if (unlockFilter === 'LOCKED') {
          matchesUnlock = !isUnlocked;
        }

        // Region Filter
        let matchesRegion = true;
        if (regionFilter === 'NORTH') {
          matchesRegion = lead.route.includes('Hanoi') || lead.route.includes('Hai Phong') || lead.origin.includes('Bắc Giang') || lead.destination.includes('Hải Phòng');
        } else if (regionFilter === 'SOUTH') {
          matchesRegion = lead.route.includes('HCMC') || lead.route.includes('Cát Lái') || lead.origin.includes('Bình Dương') || lead.origin.includes('Đồng Nai') || lead.origin.includes('Mekong');
        } else if (regionFilter === 'CROSS_BORDER') {
          matchesRegion = lead.serviceType === 'Cross-border' || lead.route.includes('Campuchia') || lead.route.includes('Qingdao') || lead.route.includes('Tokyo') || lead.route.includes('Busan');
        }

        return matchesSearch && matchesService && matchesPricingType && matchesStatus && matchesUrgency && matchesUnlock && matchesRegion;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'estimatedValueVND') {
          comp = (a.estimatedValueVND || 0) - (b.estimatedValueVND || 0);
        } else if (sortField === 'unitPriceVND') {
          comp = (a.unitPriceVND || 0) - (b.unitPriceVND || 0);
        } else if (sortField === 'pricingType') {
          comp = a.pricingType.localeCompare(b.pricingType);
        } else if (sortField === 'status') {
          comp = a.status.localeCompare(b.status);
        } else if (sortField === 'dueDate') {
          comp = (a.dueDate || '').localeCompare(b.dueDate || '');
        } else if (sortField === 'quotesCount') {
          comp = (a.quotesCount || 0) - (b.quotesCount || 0);
        } else if (sortField === 'viewsCount') {
          comp = (a.viewsCount || 0) - (b.viewsCount || 0);
        } else if (sortField === 'customerCompany') {
          comp = a.customerCompany.localeCompare(b.customerCompany);
        } else if (sortField === 'code') {
          comp = a.code.localeCompare(b.code);
        } else if (sortField === 'route') {
          comp = a.route.localeCompare(b.route);
        } else {
          // Default: createdDate
          comp = a.id.localeCompare(b.id);
        }
        return sortDirection === 'asc' ? comp : -comp;
      });
  }, [leads, searchTerm, selectedService, pricingTypeFilter, statusFilter, urgencyFilter, unlockFilter, regionFilter, sortField, sortDirection, unlockedLeadIds]);

  // Pagination states (Mặc định 10 dòng / trang)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Synchronized Top Horizontal Scrollbar and Table Scrollbar
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(1650);
  const [scrollPosition, setScrollPosition] = useState<{ left: number; maxScroll: number; percent: number }>({
    left: 0,
    maxScroll: 0,
    percent: 0,
  });
  const isSyncingScroll = useRef<boolean>(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedService, pricingTypeFilter, statusFilter, urgencyFilter, unlockFilter, regionFilter, sortField, sortDirection]);

  // Update table scroll dimensions
  useEffect(() => {
    const updateScrollDims = () => {
      if (tableScrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = tableScrollRef.current;
        setTableScrollWidth(scrollWidth);
        const maxScroll = Math.max(0, scrollWidth - clientWidth);
        setScrollPosition({
          left: scrollLeft,
          maxScroll,
          percent: maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * 100) : 0,
        });
      }
    };

    updateScrollDims();
    const timer = setTimeout(updateScrollDims, 150);
    window.addEventListener('resize', updateScrollDims);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScrollDims);
    };
  }, [filteredAndSortedLeads, tableDensity, currentPage, pageSize]);

  const handleTopScroll = () => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    if (topScrollRef.current && tableScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      const { scrollWidth, clientWidth, scrollLeft } = tableScrollRef.current;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);
      setScrollPosition({
        left: scrollLeft,
        maxScroll,
        percent: maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * 100) : 0,
      });
    }
    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  const handleTableScroll = () => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    if (topScrollRef.current && tableScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
      const { scrollWidth, clientWidth, scrollLeft } = tableScrollRef.current;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);
      setScrollPosition({
        left: scrollLeft,
        maxScroll,
        percent: maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * 100) : 0,
      });
    }
    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  const scrollTableHorizontally = (offset: number) => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedLeads.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedLeads = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredAndSortedLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedLeads, safeCurrentPage, pageSize]);

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const willBeExpanded = !expandedLeadIds[id];
    setExpandedLeadIds((prev) => ({ ...prev, [id]: willBeExpanded }));

    // Mỗi lần user click mở xem chi tiết lead (bất kể 1 hay nhiều user) -> tăng 1 lượt xem cho lead đó
    if (willBeExpanded && onIncrementLeadViews) {
      onIncrementLeadViews(id);
    }
  };

  const handleToggleSave = (lead: SupplierLeadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const willBeSaved = !lead.isSaved;
    if (onToggleSaveLead) {
      onToggleSaveLead(lead.id);
    }
    setSavedToastMessage(
      willBeSaved
        ? `Đã lưu cơ hội ${lead.code} vào "My Leads" để cân nhắc báo giá & mở khóa SĐT sau!`
        : `Đã gỡ lead ${lead.code} khỏi danh sách đã lưu.`
    );
    setTimeout(() => {
      setSavedToastMessage(null);
    }, 3500);
  };

  const toggleExpandAll = () => {
    const allExpanded = filteredAndSortedLeads.every((l) => expandedLeadIds[l.id]);
    const newState: Record<string, boolean> = {};
    if (!allExpanded) {
      filteredAndSortedLeads.forEach((l) => {
        newState[l.id] = true;
        if (!expandedLeadIds[l.id] && onIncrementLeadViews) {
          onIncrementLeadViews(l.id);
        }
      });
    }
    setExpandedLeadIds(newState);
  };

  const handleUnlockLead = (lead: SupplierLeadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isAlreadyUnlocked = Boolean(unlockedLeadIds[lead.id] || lead.isUnlocked);
    if (isAlreadyUnlocked) {
      setActiveCompareModalLead({ ...lead, isUnlocked: true });
    } else {
      setLeadToUnlockConfirm(lead);
    }
  };

  const handleOpenCompareModal = (lead: SupplierLeadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isAlreadyUnlocked = Boolean(unlockedLeadIds[lead.id] || lead.isUnlocked);
    setActiveCompareModalLead({ ...lead, isUnlocked: isAlreadyUnlocked });
  };

  const confirmUnlockWithCredit = (leadId: string, creditCost: number = 50) => {
    const targetLead = leads.find((l) => l.id === leadId);
    const leadTitle = targetLead ? `${targetLead.code} - ${targetLead.customerCompany}` : leadId;
    
    if (onUnlockLead) {
      const success = onUnlockLead(leadId, creditCost);
      if (!success) {
        if (onNavigate) {
          onNavigate({ type: 'workspace', view: 'flexcredit-add' });
        }
        return false;
      }
    } else if (onDeductCredit) {
      const success = onDeductCredit(creditCost, `Mở khóa SĐT & Ma trận Báo giá (${leadTitle})`);
      if (!success) {
        if (onNavigate) {
          onNavigate({ type: 'workspace', view: 'flexcredit-add' });
        }
        return false;
      }
    }
    
    setUnlockedLeadIds((prev) => ({ ...prev, [leadId]: true }));
    setExpandedLeadIds((prev) => ({ ...prev, [leadId]: true }));
    setLeadToUnlockConfirm(null);
    if (targetLead) {
      const updatedLead = { ...targetLead, isUnlocked: true };
      setActiveCompareModalLead(updatedLead);
    }
    
    setUnlockToastMessage(`Đã mở khóa thành công ${targetLead?.customerCompany || 'Lead'} (-${creditCost} Credits)! Hotline & Ma trận giá đã sẵn sàng.`);
    setTimeout(() => setUnlockToastMessage(null), 4000);
    return true;
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // Helper Badge Color Functions
  const getServiceBadgeStyle = (service: ServiceType) => {
    switch (service) {
      case 'Trucking':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
          icon: <Truck className="w-3 h-3 text-blue-600 shrink-0" />,
          label: 'Đường bộ',
        };
      case 'Sea Freight (FCL)':
        return {
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
          icon: <Ship className="w-3 h-3 text-cyan-600 shrink-0" />,
          label: 'Biển (FCL)',
        };
      case 'Sea Freight (LCL)':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200/80',
          icon: <Boxes className="w-3 h-3 text-teal-600 shrink-0" />,
          label: 'Biển (LCL)',
        };
      case 'Air Freight':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
          icon: <Plane className="w-3 h-3 text-sky-600 shrink-0" />,
          label: 'Hàng không',
        };
      case 'Cold Chain':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          icon: <Snowflake className="w-3 h-3 text-emerald-600 shrink-0" />,
          label: 'Chuỗi lạnh',
        };
      case 'Warehousing':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          icon: <Warehouse className="w-3 h-3 text-amber-600 shrink-0" />,
          label: 'Kho bãi',
        };
      case 'Customs Clearance':
        return {
          bg: 'bg-violet-50 text-violet-700 border-violet-200/80',
          icon: <FileCheck2 className="w-3 h-3 text-violet-600 shrink-0" />,
          label: 'Hải quan',
        };
      case 'Cross-border':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          icon: <Globe className="w-3 h-3 text-rose-600 shrink-0" />,
          label: 'Xuyên biên giới',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <Zap className="w-3 h-3 text-slate-600 shrink-0" />,
          label: service,
        };
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200 space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span className="cursor-pointer hover:text-indigo-600" onClick={() => onNavigate({ type: 'public', tab: 'home' })}>
          FlexGO Public Sàn Vận Tải
        </span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600 font-bold">Public Freight Lead Board</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 lowercase font-normal">phân định báo giá theo lô & hợp đồng định kỳ</span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SÀN YÊU CẦU VẬN TẢI CÔNG KHAI (PUBLIC B2B FREIGHT LEADS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Bảng Săn Lead Vận Tải: Theo Lô & Hợp Đồng Định Kỳ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Minh bạch 100% cấu trúc định giá: phân tách rõ ràng giữa <strong>Hợp đồng định kỳ dài hạn (Contract)</strong> và <strong>Vận chuyển theo lô/chuyến (Spot)</strong>. 
              Hiển thị chi tiết từng cột: <em>Loại hình</em>, <em>Sản lượng cam kết</em>, <em>Đơn giá dự kiến</em> và <em>Tổng giá trị dự toán</em>.
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

        {/* Top Market Metric Bar: 4 Ấn Tượng Chính (Open Leads, Tổng Giá Trị, Tổng Lượt Xem, Tổng Báo Giá) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10">
          {/* KPI 1: Open Lead Hiện Tại */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Open Lead Hiện Tại</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                {marketStats.totalLeads}
              </span>
              <span className="text-xs font-bold text-emerald-300/90">lead mở</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{marketStats.contractCount} Hợp đồng • {marketStats.spotCount} Theo lô</span>
            </div>
          </div>

          {/* KPI 2: Tổng Giá Trị Dự Kiến */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-amber-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Tổng Giá Trị Dự Kiến</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 tracking-tight">
                ~{(marketStats.totalEstValue / 1000000000).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-amber-300/90">Tỷ VNĐ</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>Quy mô nguồn hàng sẵn sàng</span>
            </div>
          </div>

          {/* KPI 3: Tổng Số Lượt Xem */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-cyan-500/40 transition-all group" title="Tổng số lần user click vào lead để mở xem chi tiết (cộng dồn theo mỗi lần click)">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Tổng Số Lượt Xem</span>
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400 tracking-tight">
                {marketStats.totalViewsCount.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs font-bold text-cyan-300/90">lượt xem</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Dựa theo số lần click mở chi tiết</span>
            </div>
          </div>

          {/* KPI 4: Tổng Số Báo Giá */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Tổng Số Báo Giá</span>
              <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-300 tracking-tight">
                {marketStats.totalQuotesSubmitted}
              </span>
              <span className="text-xs font-bold text-purple-200/90">báo giá</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Send className="w-3 h-3 text-purple-400" />
              <span>Tỷ lệ cạnh tranh minh bạch</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. SERVICE TABS NAVIGATOR (8 Nhóm Dịch Vụ Cốt Lõi - 2 hàng x 4 cột) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Phân Loại Theo 8 Nhóm Dịch Vụ Logistics & Vận Tải</span>
            </h2>
            {selectedService !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedService('ALL')}
                className="px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                title="Bỏ lọc để xem toàn bộ danh sách lead"
              >
                <span>✕ Bỏ chọn</span>
                <span className="text-slate-400">({leads.length})</span>
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400">
            Hiển thị <strong className="text-slate-800">{filteredAndSortedLeads.length}</strong> / {leads.length} cơ hội
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full">
          {serviceTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedService === tab.id;
            const count = serviceCounts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                id={`leadboard-service-tab-${tab.id}`}
                onClick={() => setSelectedService(prev => prev === tab.id ? 'ALL' : tab.id)}
                className={`group p-3 rounded-2xl text-xs font-bold transition-all flex flex-col justify-between cursor-pointer border text-left min-h-[96px] relative ${
                  isSelected
                    ? tab.activeClass
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Top line: Icon + Badge + Lead Count */}
                <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                  <div
                    className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : `${tab.bgLightClass} ${tab.colorClass}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tab.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-black rounded-md tracking-tight ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-[10.5px] font-black rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </div>

                {/* Middle & Bottom: Service Title & Subtext */}
                <div className="min-w-0 mt-auto">
                  <div className="leading-tight truncate text-xs font-black">{tab.nameVi}</div>
                  <div
                    className={`text-[10px] font-medium leading-tight mt-0.5 truncate ${
                      isSelected ? 'text-white/80' : 'text-slate-400'
                    }`}
                    title={tab.subtext}
                  >
                    {tab.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THANH TÌM KIẾM THEO MÃ LEAD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="leadboard-search-input"
            type="text"
            placeholder="Tìm kiếm theo Mã Lead (VD: LG-58992, LG-00124, LG-34569)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium text-slate-900"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* BANNER HIỂN THỊ KHI ĐANG LỌC THEO LIÊN KẾT CHIA SẺ RFQ / SEARCH TERM */}
      {searchTerm && (
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg border border-indigo-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-white flex items-center gap-2 flex-wrap">
                <span>Đang Lọc Theo Mã Lead / Yêu Cầu Báo Giá:</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-300 font-mono font-bold rounded-lg border border-emerald-400/40 text-xs">
                  {searchTerm}
                </span>
                <span className="text-xs text-emerald-300 font-bold">
                  ({filteredAndSortedLeads.length} cơ hội vận chuyển)
                </span>
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Nhấp vào dòng yêu cầu để mở rộng xem toàn bộ thông số kỹ thuật, SLA và gửi báo giá cạnh tranh.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border border-white/10"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa Lọc / Xem Toàn Bộ Lead Board</span>
          </button>
        </div>
      )}

      {/* 3. PUBLIC LEADS DATA TABLE WITH TOP & BOTTOM SYNCHRONIZED SCROLLBARS, FROZEN HEADER, AND VERTICAL SCROLL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full flex flex-col">
        {/* Top Horizontal Scrollbar (Đồng bộ trực quan với thanh cuộn bên dưới) */}
        <div 
          ref={topScrollRef}
          onScroll={handleTopScroll}
          className="w-full overflow-x-auto overflow-y-hidden bg-slate-50 border-b border-slate-200 z-30 select-none"
          title="Thanh cuộn ngang"
        >
          <div style={{ width: `${tableScrollWidth}px`, height: '1px' }} />
        </div>

        {/* Scrollable Table Area: Vertical max-h-[620px] + Horizontal scroll with Frozen Sticky Header (Bottom scrollbar hidden) */}
        <div 
          ref={tableScrollRef}
          onScroll={handleTableScroll}
          className="overflow-x-auto overflow-y-auto max-h-[620px] relative scroll-smooth focus:outline-none hide-horizontal-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          tabIndex={0}
        >
          <table className="w-full min-w-[960px] text-left border-collapse" id="leadboard-data-table">
            {/* Frozen Sticky Table Header (Stay fixed during vertical scroll) */}
            <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs border-b border-slate-200">
              <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
                <th className="py-3.5 px-3 w-12 text-center sticky top-0 z-20 bg-slate-100 border-b border-slate-200">STT</th>
                
                {/* Cột 1: Ngày đăng & Hạn nộp */}
                <th 
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap min-w-[130px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('createdDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Ngày Đăng / Hạn</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Cột 2: Mã Lead */}
                <th 
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap min-w-[110px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('code')}
                >
                  <div className="flex items-center gap-1">
                    <span>Mã Lead</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Cột 3: Loại dịch vụ */}
                <th className="py-3.5 px-3 whitespace-nowrap min-w-[140px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                  <span>Dịch Vụ Logistics</span>
                </th>

                {/* Cột 4: Loại hình (Lô / Hợp đồng) */}
                <th 
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap min-w-[125px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('pricingType')}
                >
                  <div className="flex items-center gap-1">
                    <span>Loại Hình</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Cột 5: Tổng giá trị dự kiến */}
                <th 
                  className="py-3.5 px-3 text-right cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap min-w-[155px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('estimatedValueVND')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Tổng Giá Trị Dự Kiến</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Cột 6: Thống kê Báo Giá & Lượt Xem */}
                <th 
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap min-w-[120px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('quotesCount')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Báo Giá / Xem</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Cột 7: Thao tác */}
                <th className="py-3.5 px-3 text-center min-w-[130px] whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                  <span>Thao Tác</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAndSortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {searchTerm ? `Không tìm thấy Mã Lead "${searchTerm}"` : 'Không tìm thấy yêu cầu vận tải phù hợp'}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {searchTerm
                          ? 'Vui lòng kiểm tra lại chính xác Mã Lead (VD: LG-58992, LG-00124, LG-34569) hoặc xóa tìm kiếm để xem toàn bộ sàn cơ hội.'
                          : 'Thử điều chỉnh lại bộ lọc hoặc chọn danh mục dịch vụ khác để khám phá các cơ hội khả dụng.'}
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedService('ALL');
                          setPricingTypeFilter('ALL');
                          setUrgencyFilter('ALL');
                          setUnlockFilter('ALL');
                          setRegionFilter('ALL');
                        }}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Xem Tất Cả Cơ Hội</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead, index) => {
                  const serviceStyle = getServiceBadgeStyle(lead.serviceType);
                  const isExpanded = !!expandedLeadIds[lead.id];
                  const isUnlocked = !!unlockedLeadIds[lead.id];
                  const padClass = tableDensity === 'compact' ? 'py-2 px-3' : 'py-3.5 px-3';
                  const isContract = lead.pricingType === 'CONTRACT';
                  const itemIndex = (safeCurrentPage - 1) * pageSize + index + 1;

                  return (
                    <React.Fragment key={lead.id}>
                      <tr
                        id={`lead-row-${lead.code}`}
                        onClick={() => toggleExpand(lead.id)}
                        className={`hover:bg-indigo-50/40 transition-colors cursor-pointer group ${
                          isExpanded ? 'bg-indigo-50/30' : index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        {/* Cột STT (Số Thứ Tự) */}
                        <td className={`${padClass} text-center font-mono text-slate-500 font-bold text-xs w-12 select-none`}>
                          {itemIndex}
                        </td>

                        {/* Cột 1: Ngày Đăng & Hạn Nộp */}
                        <td className={`${padClass} whitespace-nowrap`}>
                          <div className="space-y-1 text-xs">
                            <div className="text-slate-500 font-medium flex items-center gap-1" title={`Ngày đăng tin: ${lead.createdDate}`}>
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{lead.createdDate}</span>
                            </div>
                            {lead.dueDate && (
                              <div className="flex items-center gap-1 text-[10.5px] text-rose-600 font-bold bg-rose-50/90 px-1.5 py-0.5 rounded border border-rose-200/70 w-fit" title={`Hạn chót nộp báo giá: ${lead.dueDate}`}>
                                <Hourglass className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                                <span>Hạn: {lead.dueDate}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Cột 2: Mã Lead */}
                        <td className={`${padClass} whitespace-nowrap`}>
                          <div className="flex items-center gap-1 font-mono font-bold text-slate-800 text-xs">
                            <span className="text-indigo-600 hover:underline">{lead.code}</span>
                            <button
                              onClick={(e) => handleCopyCode(lead.code, e)}
                              className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                              title="Copy mã Lead"
                            >
                              {copiedCode === lead.code ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Cột 3: Loại dịch vụ */}
                        <td className={`${padClass} whitespace-nowrap`}>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold border ${serviceStyle.bg}`}
                            title={lead.serviceType}
                          >
                            {serviceStyle.icon}
                            <span>{serviceStyle.label}</span>
                          </span>
                        </td>

                        {/* Cột 4: Loại hình (Lô / Hợp đồng) */}
                        <td className={padClass}>
                          <div className="space-y-1">
                            {isContract ? (
                              <div className="inline-flex flex-col items-start gap-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                                  <Repeat className="w-2.5 h-2.5 text-purple-600" />
                                  <span>Hợp đồng</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  {lead.contractTerm || 'Định kỳ dài hạn'}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex flex-col items-start gap-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200">
                                  <Tag className="w-2.5 h-2.5 text-cyan-700" />
                                  <span>Theo Lô (Spot)</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  {lead.contractTerm || 'Chuyến lẻ / Dự án'}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Cột 5: Tổng giá trị dự kiến */}
                        <td className={`${padClass} text-right whitespace-nowrap`}>
                          <div className="space-y-0.5">
                            <span className="text-xs font-extrabold text-emerald-700 block">
                              {lead.estimatedValueDisplay}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 block">
                              {isContract ? 'Ngân sách / tháng' : 'Tổng dự toán lô'}
                            </span>
                          </div>
                        </td>

                        {/* Cột 6: Thống kê Báo Giá & Lượt Xem */}
                        <td className={`${padClass} text-center whitespace-nowrap`}>
                          <div className="flex flex-col items-center gap-1">
                            {/* Số lượng báo giá đã nộp */}
                            <div 
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                (lead.quotesCount || 0) === 0
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : (lead.quotesCount || 0) <= 2
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                              title={`${lead.quotesCount || 0} nhà xe / đối tác đã nộp báo giá`}
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>{lead.quotesCount || 0} Báo giá</span>
                            </div>

                            {/* Số lượt xem */}
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium" title={`${lead.viewsCount || 0} lần click mở xem chi tiết`}>
                              <Eye className="w-3 h-3 text-slate-400" />
                              <span>{lead.viewsCount || 0} xem</span>
                            </div>
                          </div>
                        </td>

                        {/* Cột 7: Thao tác (Xem chi tiết & Thao tác) */}
                        <td className={`${padClass} text-center whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Nút Sao chép liên kết Lead Board */}
                            <button
                              id={`share-lead-row-btn-${lead.code}`}
                              type="button"
                              onClick={(e) => handleCopyLeadLink(lead.code, e)}
                              className={`p-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                                copiedLeadLinkId === lead.code
                                  ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300'
                                  : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-slate-200 hover:border-slate-300'
                              }`}
                              title={
                                copiedLeadLinkId === lead.code
                                  ? 'Đã sao chép link Lead Board!'
                                  : `Sao chép liên kết Lead Board lọc theo mã ${lead.code}`
                              }
                            >
                              {copiedLeadLinkId === lead.code ? (
                                <Check className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              id={`toggle-lead-btn-${lead.code}`}
                              type="button"
                              onClick={(e) => toggleExpand(lead.id, e)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                                isExpanded
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300'
                              }`}
                              title={isExpanded ? 'Thu gọn chi tiết lead' : 'Mở xem chi tiết hồ sơ & cụm thao tác (báo giá, mở khóa, lưu lead)'}
                            >
                              <span>{isExpanded ? 'Đóng' : 'Xem chi tiết'}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Technical Specs Row */}
                      {isExpanded && (
                        <tr className="bg-indigo-50/40 border-b border-indigo-100">
                          <td colSpan={8} className="p-3 sm:p-4">
                            <LeadInquiryDetailCard
                              lead={lead}
                              isUnlocked={isUnlocked}
                              maskCompanyName={maskCompanyName}
                              maskContactPerson={maskContactPerson}
                              onUnlockClick={() => handleUnlockLead(lead)}
                              onOpenCreateQuotation={onOpenCreateQuotation}
                              onToggleSaveLead={handleToggleSave}
                              onCompareClick={handleOpenCompareModal}
                            />
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

        {/* 4. PAGINATION & TABLE FOOTER CONTROLS (10 items / page default) */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 text-xs text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-3 select-none">
          {/* Left: Summary Info */}
          <div className="flex items-center gap-2 text-slate-500">
            <span>
              Đang hiển thị <strong>{filteredAndSortedLeads.length > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0}</strong> - <strong>{Math.min(safeCurrentPage * pageSize, filteredAndSortedLeads.length)}</strong> trên tổng <strong>{filteredAndSortedLeads.length}</strong> cơ hội
            </span>
            {filteredAndSortedLeads.length !== leads.length && (
              <span className="text-slate-400 hidden lg:inline">
                (lọc từ {leads.length} leads tổng)
              </span>
            )}
          </div>

          {/* Center: Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 self-center">
              {/* First Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Trang đầu"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers(safeCurrentPage, totalPages).map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 select-none">
                      ...
                    </span>
                  );
                }
                const pageNum = Number(p);
                const isActive = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Trang kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Trang cuối"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Right: Page Size Selector & Breakdown */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span>Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value={10}>10 dòng / trang</option>
                <option value={20}>20 dòng / trang</option>
                <option value={50}>50 dòng / trang</option>
                <option value={100}>100 dòng / trang</option>
              </select>
            </div>

            <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400 pl-2 border-l border-slate-200">
              <span className="text-purple-700 font-semibold">{marketStats.contractCount} Hợp đồng</span>
              <span>•</span>
              <span className="text-cyan-700 font-semibold">{marketStats.spotCount} Báo giá lô</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      {unlockToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">Mở Khóa Thành Công!</h5>
            <p className="text-[11px] text-slate-300">{unlockToastMessage}</p>
          </div>
          <button 
            onClick={() => setUnlockToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SAVED / BOOKMARK TOAST NOTIFICATION */}
      {savedToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">My Leads - Cập Nhật Lưu Trữ</h5>
            <p className="text-[11px] text-slate-300">{savedToastMessage}</p>
          </div>
          <button 
            onClick={() => setSavedToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DEDICATED UNLOCK CONFIRMATION MODAL */}
      {leadToUnlockConfirm && (
        <div 
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setLeadToUnlockConfirm(null)}
        >
          <div 
            id="lead-unlock-confirmation-dialog"
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-auto text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b border-indigo-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Xác Nhận Mở Khóa Lead & Đối Thủ
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sử dụng FlexCredit để mở khóa toàn bộ thông tin
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLeadToUnlockConfirm(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Lead Summary Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {leadToUnlockConfirm.code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {leadToUnlockConfirm.serviceType}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {leadToUnlockConfirm.route}
                </h4>
                <p className="text-xs text-slate-600">
                  Chủ hàng: <strong className="text-slate-900">{maskCompanyName(leadToUnlockConfirm.customerCompany, false)}</strong> • Sản lượng: <strong>{leadToUnlockConfirm.volumeDisplay}</strong>
                </p>
              </div>

              {/* Unlocked Benefits Checklist */}
              <div className="space-y-2">
                <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Quyền Lợi Nhận Được Sau Khi Mở Khóa:
                </h5>
                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Hotline, Zalo & Email Người Mua Hàng</span>
                      <span className="text-[11px] text-slate-500">Trao đổi 1-1 trực tiếp, chốt lịch khảo sát và gửi báo giá ưu đãi.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Ma Trận Giá Của Các Nhà Xe Đối Thủ</span>
                      <span className="text-[11px] text-slate-500">Xem mức giá thấp nhất Top 1, bóc tách cước chính, phụ phí BAF và vé BOT.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Tên & Năng Lực Của Các Đối Thủ</span>
                      <span className="text-[11px] text-slate-500">Xếp hạng uy tín, thời gian giao hàng SLA và điều khoản công nợ đối thủ.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlock Action Button with Exact Orange Style */}
              <div className="pt-2 flex flex-col items-center gap-2.5">
                <button
                  id="confirm-unlock-modal-btn"
                  type="button"
                  onClick={() => confirmUnlockWithCredit(leadToUnlockConfirm.id, 50)}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Mở Khóa Ngay (50 FlexCredit)</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>
                    Số dư ví của bạn: <strong className="font-extrabold text-slate-900">{wallet?.balanceCredits ?? 15350} Credits</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Trừ 50 Credits ngay khi xác nhận</span>
              <button
                type="button"
                onClick={() => setLeadToUnlockConfirm(null)}
                className="font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
              >
                Để sau / Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLIER LEAD COMPARE & QUOTE MODAL (WITH FLEXCREDIT UNLOCK) */}
      {activeCompareModalLead && (
        <SupplierLeadCompareModal
          isOpen={true}
          lead={activeCompareModalLead}
          currentUser={currentUser}
          quotations={quotations}
          wallet={wallet}
          isUnlocked={Boolean(unlockedLeadIds[activeCompareModalLead.id] || activeCompareModalLead.isUnlocked)}
          onClose={() => setActiveCompareModalLead(null)}
          onUnlockWithCredit={(leadId, creditCost) => confirmUnlockWithCredit(leadId, creditCost)}
          onSubmitQuotation={onSubmitQuotation || (() => {})}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
