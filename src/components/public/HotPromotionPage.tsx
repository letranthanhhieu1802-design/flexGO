import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Tag, 
  Percent, 
  Calendar, 
  Clock, 
  Truck, 
  Ship, 
  Plane, 
  Train,
  Snowflake, 
  Warehouse,
  FileCheck2, 
  FileText, 
  Building2, 
  Globe, 
  ShieldCheck, 
  Star, 
  Send, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Eye, 
  ThumbsUp, 
  TrendingDown, 
  BadgeCheck, 
  Plus, 
  X, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Layers, 
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Share2,
  Users,
  Zap,
  Coins,
  ArrowUpDown,
  Copy,
  Hourglass,
  Repeat,
  Boxes,
  RotateCcw,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { HotPromotionItem, PromotionCategory, PromotionBadgeType, ServiceType, CurrentView, UserProfile } from '../../types';
import { mockPromotionAuditData } from '../../data/mockPromotionAuditData';
import { HotPromotionRateDetailCard } from './HotPromotionRateDetailCard';
import { HotPromotionFullCostMatrixModal } from './HotPromotionFullCostMatrixModal';

interface HotPromotionPageProps {
  currentUser: UserProfile;
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: () => void;
  onIncrementPromotionViews?: (promoId: string) => void;
}

type SortField = 'discount' | 'price' | 'createdDate' | 'views' | 'daysRemaining' | 'code' | 'service' | 'pic';
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

export const HotPromotionPage: React.FC<HotPromotionPageProps> = ({
  currentUser,
  onNavigate,
  onOpenCreateInquiry,
  onIncrementPromotionViews,
}) => {
  // Audit fixture: one promotion for every valid Supplier service/cargo/model combination.
  const initialCombined = useMemo(() => mockPromotionAuditData, []);

  const [promotionsList, setPromotionsList] = useState<HotPromotionItem[]>(initialCombined);
  
  // Service category and sorting states
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('discount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Synchronized horizontal scrollbars for Table View
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef<boolean>(false);
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(1100);

  // Interactive Bookmarks & Modals
  const [bookmarkedDealIds, setBookmarkedDealIds] = useState<string[]>(['promo-001', 'promo-002']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedDealForBooking, setSelectedDealForBooking] = useState<HotPromotionItem | null>(null);
  const [selectedPromoForModal, setSelectedPromoForModal] = useState<HotPromotionItem | null>(null);
  const [isCreatePromoModalOpen, setIsCreatePromoModalOpen] = useState<boolean>(false);

  // New Promotion Form state (for Supplier listing)
  const [newPromoForm, setNewPromoForm] = useState({
    title: '',
    serviceType: 'Trucking' as ServiceType,
    category: 'Trucking' as PromotionCategory,
    origin: '',
    destination: '',
    originalPriceVND: 15000000,
    discountPercent: 20,
    vehicleOrUnit: 'Xe Tải 15 Tấn Thùng Kín',
    cargoSuitability: 'Hàng tiêu dùng, nông sản, bao bì',
    transitTime: '24 Giờ',
    availableCapacity: 'Còn 5 chuyến tuần này',
    validUntil: '2026-09-30',
    badgeType: 'BACKHAUL_DEAL' as PromotionBadgeType,
    badgeLabel: 'CƯỚC CHIỀU VỀ HOT',
    highlights: 'Cam kết chạy đúng giờ, GPS hành trình 24/7, Miễn phí bốc xếp',
    paymentTerms: 'Công nợ 30 ngày'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleBookmark = (id: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedDealIds.includes(id)) {
      setBookmarkedDealIds(prev => prev.filter(bId => bId !== id));
      showToast(`Đã bỏ lưu biểu giá: ${title.slice(0, 30)}...`);
    } else {
      setBookmarkedDealIds(prev => [...prev, id]);
      showToast(`Đã lưu biểu giá vào danh sách quan tâm!`);
    }
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleIncrementPromotionViews = (promoId: string) => {
    if (!promoId) return;
    if (onIncrementPromotionViews) {
      onIncrementPromotionViews(promoId);
    }
    setPromotionsList(prevList =>
      prevList.map(item =>
        item.id === promoId
          ? { ...item, viewsCount: (item.viewsCount || 0) + 1 }
          : item
      )
    );
  };

  const toggleRowExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const willBeExpanded = !expandedRowIds[id];
    setExpandedRowIds(prev => ({
      ...prev,
      [id]: willBeExpanded
    }));

    // Mỗi lần user click mở xem chi tiết tuyến giá -> tăng 1 lượt xem cho tuyến đó (tương tự logic ở lead board)
    if (willBeExpanded) {
      handleIncrementPromotionViews(id);
    }
  };

  // 8 Core Logistics Services Filter Navigator (2 hàng x 4 loại hình, chuẩn hóa đồng bộ như Lead Board)
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

  // Count promotions per service
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: promotionsList.length,
      Trucking: promotionsList.filter((p) => p.serviceType === 'Trucking' || p.category === 'Trucking' || p.serviceType === 'Cold Chain' || p.category === 'Cold Chain').length,
      'Sea Freight': promotionsList.filter((p) => p.serviceType === 'Sea Freight (FCL)' || p.serviceType === 'Sea Freight (LCL)' || p.category === 'Sea Freight').length,
      'Air Freight': promotionsList.filter((p) => p.serviceType === 'Air Freight' || p.category === 'Air Freight').length,
      'Rail Freight': promotionsList.filter((p) => p.serviceType === 'Rail Freight' || p.category === 'Rail Freight').length,
      Warehousing: promotionsList.filter((p) => p.serviceType === 'Warehousing' || p.category === 'Warehousing').length,
      'Customs Clearance': promotionsList.filter((p) => p.serviceType === 'Customs Clearance' || p.category === 'Customs' || (p.category as string) === 'Customs Clearance').length,
      'Cross-border': promotionsList.filter((p) => p.serviceType === 'Cross-border' || p.category === 'Cross-border' || (p.serviceType as string) === 'Cross-Border' || (p.category as string) === 'CrossBorder').length,
      'Project Cargo': promotionsList.filter((p) => p.serviceType === 'Project Cargo' || p.category === 'Project Cargo').length,
    };
    return counts;
  }, [promotionsList]);

  // Dynamic Market KPI Stats
  const marketStats = useMemo(() => {
    const totalPromotions = promotionsList.length;
    const maxDiscount = Math.max(...promotionsList.map(p => p.discountPercent), 0);
    const totalViewsCount = promotionsList.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
    const totalInterested = promotionsList.reduce((sum, p) => sum + (p.interestedCount || 0), 0);
    const verifiedSpecialistsCount = new Set(promotionsList.map(p => p.specialistId)).size;

    return {
      totalPromotions,
      maxDiscount,
      totalViewsCount,
      totalInterested,
      verifiedSpecialistsCount
    };
  }, [promotionsList]);

  // Filtered & Sorted Promotions
  const filteredAndSortedPromotions = useMemo(() => {
    return promotionsList
      .filter((promo) => {
        let matchesService = true;
        if (selectedService !== 'ALL') {
          if (selectedService === 'Trucking') {
            matchesService = promo.serviceType === 'Trucking' || promo.category === 'Trucking' || promo.serviceType === 'Cold Chain' || promo.category === 'Cold Chain';
          } else if (selectedService === 'Sea Freight') {
            matchesService = promo.serviceType === 'Sea Freight (FCL)' || promo.serviceType === 'Sea Freight (LCL)' || promo.category === 'Sea Freight';
          } else if (selectedService === 'Air Freight') {
            matchesService = promo.serviceType === 'Air Freight' || promo.category === 'Air Freight';
          } else if (selectedService === 'Rail Freight') {
            matchesService = promo.serviceType === 'Rail Freight' || promo.category === 'Rail Freight';
          } else if (selectedService === 'Warehousing') {
            matchesService = promo.serviceType === 'Warehousing' || promo.category === 'Warehousing';
          } else if (selectedService === 'Customs Clearance') {
            matchesService = promo.serviceType === 'Customs Clearance' || promo.category === 'Customs' || (promo.category as string) === 'Customs Clearance';
          } else if (selectedService === 'Cross-border') {
            matchesService = promo.serviceType === 'Cross-border' || promo.category === 'Cross-border' || (promo.serviceType as string) === 'Cross-Border' || (promo.category as string) === 'CrossBorder';
          } else if (selectedService === 'Project Cargo') {
            matchesService = promo.serviceType === 'Project Cargo' || promo.category === 'Project Cargo';
          } else {
            matchesService = promo.serviceType === selectedService || promo.category === selectedService;
          }
        }

        return matchesService;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'discount') {
          comp = a.discountPercent - b.discountPercent;
          if (comp === 0) {
            comp = (a.isFeatured ? 1 : 0) - (b.isFeatured ? 1 : 0);
          }
        } else if (sortField === 'price') {
          comp = a.promotionalPriceVND - b.promotionalPriceVND;
        } else if (sortField === 'views') {
          comp = (a.viewsCount || 0) - (b.viewsCount || 0);
        } else if (sortField === 'daysRemaining') {
          comp = a.daysRemaining - b.daysRemaining;
        } else if (sortField === 'code') {
          comp = a.code.localeCompare(b.code);
        } else if (sortField === 'service') {
          comp = a.serviceType.localeCompare(b.serviceType);
        } else if (sortField === 'pic') {
          const picA = a.specialistVietnameseName || a.specialistName || '';
          const picB = b.specialistVietnameseName || b.specialistName || '';
          comp = picA.localeCompare(picB);
        } else {
          comp = a.validFrom.localeCompare(b.validFrom);
        }

        return sortDirection === 'desc' ? -comp : comp;
      });
  }, [promotionsList, selectedService, sortField, sortDirection]);

  // Synchronize top and bottom scrollbars
  useEffect(() => {
    const updateScrollDims = () => {
      if (tableScrollRef.current) {
        setTableScrollWidth(tableScrollRef.current.scrollWidth);
      }
    };
    updateScrollDims();
    const timer = setTimeout(updateScrollDims, 150);
    window.addEventListener('resize', updateScrollDims);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScrollDims);
    };
  }, [filteredAndSortedPromotions, currentPage, pageSize]);

  const handleTopScroll = () => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    if (topScrollRef.current && tableScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
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
    }
    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPromotions.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedPromotions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredAndSortedPromotions.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedPromotions, safeCurrentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle Publish New Promotion Listing by Supplier
  const handlePublishPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    const promoPrice = Math.round(newPromoForm.originalPriceVND * (1 - newPromoForm.discountPercent / 100));
    
    const newPromo: HotPromotionItem = {
      id: `promo-${Date.now()}`,
      code: `PRM-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newPromoForm.title,
      badgeType: newPromoForm.badgeType,
      badgeLabel: newPromoForm.badgeLabel,
      discountPercent: newPromoForm.discountPercent,
      originalPriceVND: newPromoForm.originalPriceVND,
      originalPriceDisplay: `${newPromoForm.originalPriceVND.toLocaleString('vi-VN')} ₫`,
      promotionalPriceVND: promoPrice,
      promotionalPriceDisplay: `${promoPrice.toLocaleString('vi-VN')} ₫`,
      pricingUnit: `VND / ${newPromoForm.vehicleOrUnit}`,
      serviceType: newPromoForm.serviceType,
      category: newPromoForm.category,
      origin: newPromoForm.origin,
      destination: newPromoForm.destination,
      routeDisplay: `${newPromoForm.origin} → ${newPromoForm.destination}`,
      transitTime: newPromoForm.transitTime,
      vehicleOrUnit: newPromoForm.vehicleOrUnit,
      cargoSuitability: newPromoForm.cargoSuitability,
      availableCapacity: newPromoForm.availableCapacity,
      specialistId: 'sales-minh-tran',
      specialistName: currentUser.name || 'Minh Tran',
      specialistVietnameseName: currentUser.name || 'Trần Văn Minh',
      specialistTitle: currentUser.roleTitle || 'Key Account Manager & Logistics Specialist',
      specialistAvatarInitial: currentUser.name ? currentUser.name.charAt(0) : 'TM',
      specialistPhone: '+84 (0) 908 123 456',
      specialistRating: 4.95,
      specialistReviewsCount: 142,
      companyId: 'supp-01',
      companyName: currentUser.companyName || 'VinaTrans Logistics JSC',
      companyLogo: 'VT',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: newPromoForm.validUntil,
      daysRemaining: 20,
      slotsRemaining: 8,
      totalSlots: 10,
      paymentTerms: newPromoForm.paymentTerms,
      highlights: newPromoForm.highlights.split(',').map(h => h.trim()),
      includedPerks: ['Bảo hiểm hàng hóa 5 Tỷ', 'Giám sát hành trình GPS', 'Hỗ trợ bốc dỡ'],
      viewsCount: 1,
      interestedCount: 0,
      bookedCount: 0,
      isFeatured: true
    };

    setPromotionsList([newPromo, ...promotionsList]);
    setIsCreatePromoModalOpen(false);
    showToast(`Đã niêm yết chương trình khuyến mãi "${newPromo.title}" thành công lên sàn!`);
  };

  // Helper Badge Color
  const getBadgeStyle = (badgeType: PromotionBadgeType) => {
    switch (badgeType) {
      case 'FLASH_SALE':
        return 'bg-rose-500 text-white shadow-2xs font-bold';
      case 'BACKHAUL_DEAL':
        return 'bg-amber-500 text-slate-950 font-black shadow-2xs';
      case 'EXCLUSIVE_FLEXGO':
        return 'bg-indigo-600 text-white shadow-2xs font-bold';
      case 'HOT_ROUTE':
        return 'bg-blue-600 text-white shadow-2xs font-bold';
      case 'VOLUME_DISCOUNT':
        return 'bg-emerald-600 text-white shadow-2xs font-bold';
      case 'LIMITED_CAPACITY':
        return 'bg-purple-600 text-white shadow-2xs font-bold';
      default:
        return 'bg-slate-800 text-white font-bold';
    }
  };

  const getServiceBadgeStyle = (service: ServiceType | string, serviceGroup?: string) => {
    const target = serviceGroup || service;
    if (target === 'Đường bộ' || target === 'Trucking' || target === 'Cold Chain') {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
        icon: <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
        label: 'Đường bộ',
      };
    }
    if (target === 'Đường biển' || target === 'Sea Freight' || target === 'Sea Freight (FCL)' || target === 'Sea Freight (LCL)') {
      return {
        bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
        icon: <Ship className="w-3.5 h-3.5 text-cyan-600 shrink-0" />,
        label: 'Đường biển',
      };
    }
    if (target === 'Hàng không' || target === 'Air Freight') {
      return {
        bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
        icon: <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
        label: 'Hàng không',
      };
    }
    if (target === 'Đường sắt' || target === 'Rail Freight') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        icon: <Train className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
        label: 'Đường sắt',
      };
    }
    if (target === 'Kho bãi 3PL' || target === 'Warehousing') {
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
        icon: <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />,
        label: 'Kho bãi 3PL',
      };
    }
    if (target === 'Thủ tục hải quan' || target === 'Customs Clearance' || target === 'Customs') {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
        icon: <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
        label: 'Thủ tục hải quan',
      };
    }
    if (target === 'Xuyên biên giới' || target === 'Cross-border') {
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200/80',
        icon: <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />,
        label: 'Xuyên biên giới',
      };
    }
    if (target === 'Dự án' || target === 'Project Cargo') {
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        icon: <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
        label: 'Dự án',
      };
    }
    return {
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
      icon: <Layers className="w-3.5 h-3.5 text-slate-600 shrink-0" />,
      label: 'Logistics',
    };
  };

  // Standardized 10-column data resolver according to agreed business logic
  const formatPromotionRow = (promo: HotPromotionItem, itemIndex: number) => {
    const stt = itemIndex;

    // 2. Hạn giá (Format dd/mm/yyyy - strictly without SLA or 'Còn XX ngày')
    let validUntilDisplay = promo.validUntil || '31/12/2026';
    if (validUntilDisplay.includes('-')) {
      const parts = validUntilDisplay.split('-');
      if (parts.length === 3) {
        validUntilDisplay = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    // 3. Mã
    const code = promo.code;

    // 4. Nhóm dịch vụ
    let serviceGroup = promo.serviceGroup;
    if (!serviceGroup) {
      if (promo.category === 'Trucking' || promo.serviceType === 'Trucking' || promo.category === 'Cold Chain' || promo.serviceType === 'Cold Chain') {
        serviceGroup = 'Đường bộ';
      } else if (promo.category === 'Sea Freight' || promo.serviceType.includes('Sea')) {
        serviceGroup = 'Đường biển';
      } else if (promo.category === 'Air Freight' || promo.serviceType.includes('Air')) {
        serviceGroup = 'Hàng không';
      } else if (promo.category === 'Rail Freight' || promo.serviceType.includes('Rail')) {
        serviceGroup = 'Đường sắt';
      } else if (promo.category === 'Warehousing' || promo.serviceType === 'Warehousing') {
        serviceGroup = 'Kho bãi 3PL';
      } else if (promo.category === 'Customs' || promo.serviceType === 'Customs Clearance') {
        serviceGroup = 'Thủ tục hải quan';
      } else if (promo.category === 'Cross-border' || promo.serviceType === 'Cross-border') {
        serviceGroup = 'Xuyên biên giới';
      } else if (promo.category === 'Project Cargo' || promo.serviceType === 'Project Cargo') {
        serviceGroup = 'Dự án';
      } else {
        serviceGroup = 'Đường bộ';
      }
    }

    const serviceStyle = getServiceBadgeStyle(promo.serviceType, serviceGroup);

    // 5. Nhóm hàng (Strictly 3 standardized values: 'Hàng thường' | 'Hàng lạnh' | 'Hàng nguy hiểm')
    let cargoGroup: 'Hàng thường' | 'Hàng lạnh' | 'Hàng nguy hiểm' = promo.cargoGroup || 'Hàng thường';
    if (!promo.cargoGroup) {
      const text = `${promo.title} ${promo.cargoSuitability || ''} ${promo.vehicleOrUnit || ''} ${promo.serviceType} ${promo.category}`.toLowerCase();
      if (text.includes('lạnh') || text.includes('cold') || text.includes('âm sâu') || text.includes('đông lạnh')) {
        cargoGroup = 'Hàng lạnh';
      } else if (text.includes('nguy hiểm') || text.includes('hóa chất') || text.includes('haz') || text.includes('cháy nổ') || text.includes('imo')) {
        cargoGroup = 'Hàng nguy hiểm';
      } else {
        cargoGroup = 'Hàng thường';
      }
    }

    // 6. Mô hình (Strictly standard model codes)
    let serviceModel = promo.serviceModel;
    if (!serviceModel) {
      if (serviceGroup === 'Đường bộ') {
        serviceModel = promo.vehicleOrUnit?.includes('LTL') || promo.id.includes('ltl') ? 'LTL' : 'FTL';
      } else if (serviceGroup === 'Đường biển') {
        serviceModel = promo.serviceType.includes('LCL') || promo.vehicleOrUnit?.includes('LCL') || promo.id.includes('lcl') ? 'LCL' : 'FCL';
      } else if (serviceGroup === 'Hàng không') {
        serviceModel = promo.id.includes('exp') || promo.title.toLowerCase().includes('hỏa tốc') ? 'Express' : 'Air Cargo';
      } else if (serviceGroup === 'Đường sắt') {
        serviceModel = promo.id.includes('lcl') ? 'LCL' : 'FCL';
      } else if (serviceGroup === 'Kho bãi 3PL') {
        const lower = `${promo.title} ${promo.id} ${promo.vehicleOrUnit}`.toLowerCase();
        if (lower.includes('ngoại quan') || lower.includes('bon')) serviceModel = 'Kho ngoại quan';
        else if (lower.includes('tmđt') || lower.includes('fulfillment') || lower.includes('ful')) serviceModel = 'Kho TMĐT';
        else if (lower.includes('lạnh') || lower.includes('cold') || lower.includes('cld')) serviceModel = 'Kho lạnh';
        else if (lower.includes('tự quản') || lower.includes('self')) serviceModel = 'Kho tự quản';
        else serviceModel = 'Kho thường';
      } else if (serviceGroup === 'Thủ tục hải quan') {
        serviceModel = 'Cửa khẩu / ICD';
      } else if (serviceGroup === 'Xuyên biên giới') {
        serviceModel = promo.vehicleOrUnit?.includes('LTL') || promo.id.includes('ltl') ? 'LTL' : 'FTL';
      } else if (serviceGroup === 'Dự án') {
        const lower = `${promo.title} ${promo.id}`.toLowerCase();
        if (lower.includes('xdock') || lower.includes('cross-dock')) serviceModel = 'X-dock';
        else if (lower.includes('port') || lower.includes('cảng') || lower.includes('icd')) serviceModel = 'Cảng / ICD';
        else serviceModel = 'Phân phối';
      } else {
        serviceModel = 'FTL';
      }
    }

    // 7. Cột Mô tả: Chuẩn hóa theo đúng hành lang tuyến / địa chỉ kho / cửa khẩu gọn gàng
    // Không ghi dài dòng, không dùng từ ngữ quảng cáo / marketing
    let descriptionMain = '';
    let descriptionSub = '';

    if (serviceGroup === 'Đường bộ') {
      // Tuyến đường vận chuyển = Hành lang tuyến. Subtext: Phân khúc tải trọng
      const rawRoute = promo.routeDisplay || `${promo.origin} ↔ ${promo.destination}`;
      descriptionMain = rawRoute.replace(/\(.*?\)/g, '').trim();
      if (!descriptionMain || descriptionMain === 'undefined ↔ undefined') {
        descriptionMain = 'Hà Nội ↔ TP. Hồ Chí Minh';
      }

      if (serviceModel === 'LTL') {
        descriptionSub = 'Hàng lẻ LTL';
      } else if (promo.vehicleOrUnit) {
        const m = promo.vehicleOrUnit.match(/(?:Xe(?:\s+Tải)?\s+)?(\d+(?:\.\d+)?\s*Tấn)/i);
        descriptionSub = m ? (promo.cargoGroup === 'Hàng lạnh' ? `Xe lạnh ${m[1]}` : `Xe ${m[1]}`) : (promo.cargoGroup === 'Hàng lạnh' ? 'Xe lạnh 15 Tấn' : 'Xe 15 Tấn');
      } else {
        descriptionSub = promo.cargoGroup === 'Hàng lạnh' ? 'Xe lạnh 15 Tấn' : 'Xe 15 Tấn';
      }
    } else if (serviceGroup === 'Đường biển') {
      // Tuyến đường vận chuyển = Hành lang tuyến. Subtext: Container FCL hoặc lịch tàu LCL
      const rawRoute = promo.routeDisplay || `${promo.origin} → ${promo.destination}`;
      descriptionMain = rawRoute.replace(/\(.*?\)/g, '').trim();
      if (!descriptionMain || descriptionMain === 'undefined → undefined') {
        descriptionMain = 'Cát Lái → Singapore';
      }

      if (serviceModel === 'LCL') {
        descriptionSub = 'Lịch tàu: Thứ 3 & Thứ 6';
      } else {
        descriptionSub = promo.vehicleOrUnit?.includes('20') ? 'Container 20GP' : 'Container 40HC';
      }
    } else if (serviceGroup === 'Hàng không') {
      // Tuyến đường vận chuyển = Hành lang tuyến. Subtext: Lịch bay
      const rawRoute = promo.routeDisplay || `${promo.origin} → ${promo.destination}`;
      descriptionMain = rawRoute.replace(/\(.*?\)/g, '').trim();
      if (!descriptionMain || descriptionMain === 'undefined → undefined') {
        descriptionMain = 'Tân Sơn Nhất (SGN) → Narita (NRT)';
      }
      descriptionSub = 'Lịch bay: Hàng ngày';
    } else if (serviceGroup === 'Đường sắt') {
      // Tuyến đường vận chuyển = Hành lang tuyến. Subtext: Container FCL hoặc lịch tàu LCL
      descriptionMain = promo.routeDisplay?.replace(/\(.*?\)/g, '').trim() || 'Yên Viên ↔ Sóng Thần';
      descriptionSub = serviceModel === 'LCL' ? 'Lịch tàu: 3 chuyến/tuần' : 'Container 40HC';
    } else if (serviceGroup === 'Kho bãi 3PL') {
      // Địa chỉ chi tiết kho. Subtext: Diện tích hoặc Công suất xử lý (TMĐT)
      const rawAddr = promo.origin || promo.destination || 'KCN Sóng Thần 1, Dĩ An, Bình Dương';
      descriptionMain = rawAddr.split('/')[0].replace(/\(.*?\)/g, '').trim();
      if (!descriptionMain || descriptionMain.toLowerCase().includes('kết nối')) {
        descriptionMain = 'KCN Sóng Thần 1, Dĩ An, Bình Dương';
      }
      descriptionSub = serviceModel === 'Kho TMĐT' ? 'Công suất: 20.000 đơn/ngày' : 'Diện tích: 15.000 m²';
    } else if (serviceGroup === 'Thủ tục hải quan') {
      // Khu vực cửa khẩu. Subtext: Loại hình tờ khai
      descriptionMain = 'Chi cục Hải quan Cảng Cát Lái';
      descriptionSub = 'Tờ khai nhập kinh doanh';
    } else if (serviceGroup === 'Xuyên biên giới') {
      // Tuyến đường vận chuyển = Hành lang tuyến. Subtext: Loại phương tiện (FTL) hoặc Hình thức thông quan (LTL)
      descriptionMain = 'Hà Nội / Hải Phòng ↔ Bằng Tường (TQ)';
      descriptionSub = serviceModel === 'LTL' ? 'Thông quan chính ngạch' : 'Xe Container 40HC';
    } else if (serviceGroup === 'Dự án') {
      if (serviceModel === 'X-dock') {
        descriptionMain = 'ICD Tân Cảng - Long Bình (Đồng Nai)';
        descriptionSub = 'Cước sàn phân loại cross-dock';
      } else if (serviceModel === 'Cảng / ICD') {
        descriptionMain = 'Cảng Cát Lái / SP-ITC';
        descriptionSub = 'Nâng hạ & bốc xếp cảng';
      } else {
        descriptionMain = 'TP. Hồ Chí Minh ↔ Miền Tây';
        descriptionSub = 'Đội xe phân phối đa điểm';
      }
    } else {
      descriptionMain = promo.routeDisplay || `${promo.origin} ↔ ${promo.destination}`;
      descriptionSub = promo.vehicleOrUnit || 'Vận chuyển tiêu chuẩn';
    }

    // 8. Cột Đơn giá: CHỈ THỂ HIỆN ĐƠN VỊ TIỀN TỆ LÀ VNĐ (₫), KHÔNG DÙNG USD
    // Dòng trên là số tiền VNĐ (bold), dòng dưới là ĐVT nhỏ. Không % giảm, không gạch ngang
    let priceAmount = '';
    let priceUnit = '';

    if (promo.promotionalPriceVND && promo.promotionalPriceVND > 0) {
      if (promo.promotionalPriceVND < 500 && serviceModel !== 'X-dock') {
        // Quy đổi từ USD sang VNĐ nếu là giá USD nhỏ
        const converted = promo.promotionalPriceVND * 25000;
        priceAmount = `${converted.toLocaleString('vi-VN')} ₫`;
      } else {
        priceAmount = `${promo.promotionalPriceVND.toLocaleString('vi-VN')} ₫`;
      }
    } else if (serviceGroup === 'Đường bộ') {
      priceAmount = serviceModel === 'LTL' ? '1.650 ₫' : '28.500.000 ₫';
    } else if (serviceGroup === 'Đường biển') {
      priceAmount = serviceModel === 'LCL' ? '625.000 ₫' : '11.250.000 ₫';
    } else if (serviceGroup === 'Hàng không') {
      priceAmount = '71.000 ₫';
    } else if (serviceGroup === 'Đường sắt') {
      priceAmount = serviceModel === 'LCL' ? '1.200 ₫' : '21.500.000 ₫';
    } else if (serviceGroup === 'Kho bãi 3PL') {
      priceAmount = serviceModel === 'Kho TMĐT' ? '5.000.000 ₫' : (serviceModel === 'Kho lạnh' ? '180.000 ₫' : '95.000 ₫');
    } else if (serviceGroup === 'Thủ tục hải quan') {
      priceAmount = '850.000 ₫';
    } else if (serviceGroup === 'Xuyên biên giới') {
      priceAmount = serviceModel === 'LTL' ? '18.000 ₫' : '32.000.000 ₫';
    } else if (serviceGroup === 'Dự án') {
      priceAmount = serviceModel === 'X-dock' ? '180 ₫' : (serviceModel === 'Cảng / ICD' ? '320.000 ₫' : '2.200.000 ₫');
    } else {
      priceAmount = '2.500.000 ₫';
    }

    // Xác định đơn vị tính (Dòng subtext dưới)
    if (serviceGroup === 'Kho bãi 3PL') {
      priceUnit = serviceModel === 'Kho TMĐT' ? 'Min / tháng' : '/ m² / tháng';
    } else if (serviceGroup === 'Thủ tục hải quan') {
      priceUnit = '/ Tờ khai';
    } else if (
      serviceGroup === 'Hàng không' || 
      (serviceGroup === 'Đường bộ' && serviceModel === 'LTL') || 
      (serviceGroup === 'Đường sắt' && serviceModel === 'LCL') || 
      (serviceGroup === 'Xuyên biên giới' && serviceModel === 'LTL')
    ) {
      priceUnit = '/ kg';
    } else if (serviceGroup === 'Đường biển') {
      priceUnit = serviceModel === 'LCL' ? '/ CBM' : (promo.vehicleOrUnit?.includes('20') ? '/ Cont 20GP' : '/ Cont 40HC');
    } else if (serviceGroup === 'Đường sắt') {
      priceUnit = '/ Container';
    } else if (serviceGroup === 'Dự án') {
      if (serviceModel === 'X-dock') priceUnit = '/ kg (Cước sàn)';
      else if (serviceModel === 'Cảng / ICD') priceUnit = '/ Lần nâng hạ';
      else priceUnit = '/ Chuyến';
    } else {
      priceUnit = '/ Chuyến';
    }

    // 9. Số Inquiries / Xem
    const inquiries = promo.inquiriesCount || promo.interestedCount || 12;
    const views = typeof promo.viewsCount === 'number' ? promo.viewsCount : 850;
    const inquiriesViewsDisplay = `${inquiries.toLocaleString('vi-VN')} / ${views.toLocaleString('vi-VN')}`;

    // PIC & Công ty
    const picName = promo.specialistVietnameseName || promo.specialistName || 'Trần Văn Minh';
    const companyName = promo.companyName || 'VinaTrans Logistics JSC';

    return {
      stt,
      picName,
      companyName,
      validUntilDisplay,
      code,
      serviceGroup,
      serviceStyle,
      cargoGroup,
      serviceModel,
      descriptionMain,
      descriptionSub,
      calculatedPriceDisplay: `${priceAmount} ${priceUnit}`.trim(),
      priceAmount,
      priceUnit,
      inquiriesViewsDisplay,
      inquiries,
      views,
    };
  };

  return (
    <div id="hot-promotions-page" className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200 space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-medium text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          HERO & MARKETPLACE KPI BANNER (Chuẩn thiết kế đồng bộ với Lead Board)
         ========================================================================= */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow & Decorative Shapes */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Biểu giá niêm yết
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Từ các nhà cung cấp uy tín và đáng tin cậy được flexGO xác nhận.
            </p>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate({
                type: 'workspace',
                view: 'supplier-profile-edit',
                params: { editorTab: 'services' },
              })}
              id="supplier-list-promo-btn"
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg hover:shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Niêm Yết Giá / Ưu Đãi Mới</span>
            </button>

            <button
              onClick={onOpenCreateInquiry}
              id="customer-post-inquiry-btn"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-orange-400" />
              <span>Đăng Yêu Cầu Tuyến Riêng</span>
            </button>
          </div>
        </div>

        {/* 4 Marketplace KPI Stat Boxes */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          {/* KPI 1: Tổng Tuyến Niêm Yết */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-orange-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Tổng Tuyến & Biểu Giá</span>
              <div className="w-7 h-7 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-orange-400 tracking-tight">
                {marketStats.totalPromotions}
              </span>
              <span className="text-xs font-bold text-orange-300/90">suất công khai</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span>Tổng hợp từ Profile Sales Specialists</span>
            </div>
          </div>

          {/* KPI 2: Giảm Giá Tối Đa */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Mức Giảm Tối Đa</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                -{marketStats.maxDiscount}%
              </span>
              <span className="text-xs font-bold text-emerald-300/90">cước chiều về</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span>Tiết kiệm chi phí thực tế</span>
            </div>
          </div>

          {/* KPI 3: Chuyên Viên Chính Chủ */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-blue-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Chuyên Viên (PIC) Phụ Trách</span>
              <div className="w-7 h-7 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-400 tracking-tight">
                {marketStats.verifiedSpecialistsCount}
              </span>
              <span className="text-xs font-bold text-blue-300/90">chuyên viên verified</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <BadgeCheck className="w-3 h-3 text-blue-400" />
              <span>100% kết nối trực tiếp chính chủ</span>
            </div>
          </div>

          {/* KPI 4: Lượt Xem & Quan Tâm */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-cyan-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Lượt Xem & Quan Tâm</span>
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
              <span>{marketStats.totalInterested} đơn đăng ký quan tâm</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          1. SERVICE TABS NAVIGATOR (8 NHÓM DỊCH VỤ LOGISTICS & VẬN TẢI - ĐỒNG BỘ LEADBOARD)
         ========================================================================= */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Phân Loại Theo 8 Nhóm Dịch Vụ Logistics & Vận Tải</span>
            </h2>
            {selectedService !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedService('ALL');
                  setCurrentPage(1);
                }}
                className="px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                title="Bỏ lọc để xem toàn bộ danh sách biểu giá"
              >
                <span>✕ Bỏ chọn</span>
                <span className="text-slate-400">({promotionsList.length})</span>
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400">
            Hiển thị <strong className="text-slate-800">{filteredAndSortedPromotions.length}</strong> / {promotionsList.length} biểu giá
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
                id={`promo-service-tab-${tab.id}`}
                onClick={() => {
                  setSelectedService(prev => prev === tab.id ? 'ALL' : tab.id);
                  setCurrentPage(1);
                }}
                className={`group p-3 rounded-2xl text-xs font-bold transition-all flex flex-col justify-between cursor-pointer border text-left min-h-[96px] relative ${
                  isSelected
                    ? tab.activeClass
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Top line: Icon + Badge + Count */}
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

      {/* Main content: table view */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full flex flex-col">
          {/* Scrollable Table Area: Vertical max-h-[640px], NO horizontal scrollbar */}
          <div 
            ref={tableScrollRef}
            className="overflow-y-auto overflow-x-hidden max-h-[640px] relative scroll-smooth focus:outline-none w-full"
            tabIndex={0}
          >
            <table className="w-full text-left border-collapse table-fixed" id="promotions-data-table">
              <colgroup>
                {/* 1. STT */}
                <col className="w-[3%]" />
                {/* 2. PIC / CÔNG TY */}
                <col className="w-[18%]" />
                {/* 3. HẠN GIÁ */}
                <col className="w-[7%]" />
                {/* 4. MÃ */}
                <col className="w-[9%]" />
                {/* 5. NHÓM DỊCH VỤ */}
                <col className="w-[8%]" />
                {/* 6. NHÓM HÀNG */}
                <col className="w-[8%]" />
                {/* 7. MÔ HÌNH */}
                <col className="w-[11%]" />
                {/* 8. MÔ TẢ (Giảm độ rộng nhỏ lại) */}
                <col className="w-[12%]" />
                {/* 9. ĐƠN GIÁ */}
                <col className="w-[9%]" />
                {/* 10. INQUIRIES / XEM */}
                <col className="w-[7%]" />
                {/* 11. THAO TÁC */}
                <col className="w-[8%]" />
              </colgroup>

              {/* Frozen Sticky Table Header - Standardized 11 Columns */}
              <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs border-b border-slate-200">
                <tr className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider select-none">
                  {/* 1. STT */}
                  <th className="py-2.5 px-1 text-center sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                    STT
                  </th>

                  {/* 2. PIC (Tên PIC & Tên công ty) */}
                  <th 
                    className="py-2.5 px-2 cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200 overflow-hidden"
                    onClick={() => handleSort('pic')}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <span>PIC / CÔNG TY</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  </th>
                  
                  {/* 3. Hạn Giá */}
                  <th 
                    className="py-2.5 px-1 text-center cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('createdDate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>HẠN GIÁ</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  </th>

                  {/* 4. Mã */}
                  <th 
                    className="py-2.5 px-1 text-center cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>MÃ</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  </th>

                  {/* 5. Nhóm Dịch Vụ */}
                  <th 
                    className="py-2.5 px-1 text-center cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('service')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>NHÓM DỊCH VỤ</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  </th>

                  {/* 6. Nhóm Hàng */}
                  <th className="py-2.5 px-1 text-center whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                    <span>NHÓM HÀNG</span>
                  </th>

                  {/* 7. Mô Hình */}
                  <th className="py-2.5 px-1 text-center whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                    <span>MÔ HÌNH</span>
                  </th>

                  {/* 8. Mô Tả */}
                  <th className="py-2.5 px-2 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200 overflow-hidden">
                    <span>MÔ TẢ</span>
                  </th>

                  {/* 9. Đơn Giá */}
                  <th 
                    className="py-2.5 px-2 text-right cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>ĐƠN GIÁ</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  </th>

                  {/* 10. Số Inquiries / Xem */}
                  <th 
                    className="py-2.5 px-1 text-center cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>INQUIRIES / XEM</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  </th>

                  {/* 11. Thao Tác */}
                  <th className="py-2.5 px-1 text-center whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                    <span>THAO TÁC</span>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAndSortedPromotions.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto">
                          <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">Không tìm thấy biểu giá phù hợp</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Chọn một nhóm dịch vụ khác để xem các biểu giá đang được niêm yết.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedService('ALL');
                          }}
                          className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Xem Tất Cả Biểu Giá</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPromotions.map((promo, index) => {
                    const itemIndex = (safeCurrentPage - 1) * pageSize + index + 1;
                    const row = formatPromotionRow(promo, itemIndex);
                    const isBookmarked = bookmarkedDealIds.includes(promo.id);

                    return (
                      <tr
                        key={promo.id}
                        id={`promo-row-${row.code}`}
                        className={`hover:bg-orange-50/40 transition-colors ${
                          index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        {/* 1. STT */}
                        <td className="py-2 px-1 text-center font-mono text-slate-500 font-bold text-xs select-none">
                          {row.stt}
                        </td>

                        {/* 2. PIC (Tên PIC & Tên công ty - Kích thước chữ công ty nhỏ lại) */}
                        <td className="py-2 px-2 overflow-hidden">
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-slate-800 text-xs truncate" title={row.picName}>
                              {row.picName}
                            </p>
                            <p className="text-[9.5px] text-slate-400 font-normal leading-tight truncate" title={row.companyName}>
                              {row.companyName}
                            </p>
                          </div>
                        </td>

                        {/* 3. Hạn Giá */}
                        <td className="py-2 px-1 text-center whitespace-nowrap">
                          <span className="text-xs font-semibold text-slate-700">
                            {row.validUntilDisplay}
                          </span>
                        </td>

                        {/* 4. Mã */}
                        <td className="py-2 px-1 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 font-mono font-bold text-slate-800 text-xs">
                            <span className="text-orange-600 hover:underline">{row.code}</span>
                            <button
                              onClick={(e) => handleCopyCode(row.code, e)}
                              className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                              title="Sao chép mã"
                            >
                              {copiedCode === row.code ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* 5. Nhóm Dịch Vụ */}
                        <td className="py-2 px-1 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${row.serviceStyle.bg}`}
                          >
                            {row.serviceGroup}
                          </span>
                        </td>

                        {/* 6. Nhóm Hàng */}
                        <td className="py-2 px-1 whitespace-nowrap text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${
                              row.cargoGroup === 'Hàng lạnh'
                                ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                : row.cargoGroup === 'Hàng nguy hiểm'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {row.cargoGroup}
                          </span>
                        </td>

                        {/* 7. Mô Hình */}
                        <td className="py-2 px-1 text-center overflow-hidden">
                          <span className="text-[11.5px] font-bold text-slate-800 truncate block" title={row.serviceModel}>
                            {row.serviceModel}
                          </span>
                        </td>

                        {/* 8. Mô Tả (Dòng 1: Hành lang/Địa chỉ, Dòng 2: Subtext chi tiết) */}
                        <td className="py-2 px-2 overflow-hidden">
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-slate-900 text-xs group-hover:text-orange-600 transition-colors truncate" title={row.descriptionMain}>
                              {row.descriptionMain}
                            </p>
                            <p className="text-[10.5px] text-slate-500 font-medium truncate" title={row.descriptionSub}>
                              {row.descriptionSub}
                            </p>
                          </div>
                        </td>

                        {/* 9. Đơn Giá: Số tiền dòng trên (VNĐ), ĐVT dòng subtext dưới, không % giảm, không gạch ngang */}
                        <td className="py-2 px-2 text-right whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="text-xs font-black text-slate-900 block tracking-tight">
                              {row.priceAmount}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 block truncate">
                              {row.priceUnit}
                            </span>
                          </div>
                        </td>

                        {/* 10. Thống Kê Số Inquiries / Xem */}
                        <td className="py-2 px-1 text-center whitespace-nowrap">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                              {row.inquiries} inquiries
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {row.views.toLocaleString('vi-VN')} xem
                            </span>
                          </div>
                        </td>

                        {/* 11. Thao Tác (Xem đầy đủ ở trên, 2 nút Lưu & Xem chi tiết ở dưới thu nhỏ) */}
                        <td className="py-1.5 px-1 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col items-center justify-center gap-1 mx-auto w-full max-w-[84px]">
                            {/* Nút 1: Xem đầy đủ (nằm ở trên) */}
                            <button
                              id={`btn-view-full-${row.code}`}
                              type="button"
                              onClick={() => {
                                handleIncrementPromotionViews(promo.id);
                                setSelectedPromoForModal(promo);
                              }}
                              className="w-full py-1 px-1.5 text-[10.5px] font-bold rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 border border-orange-200/90 transition-all inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs leading-tight active:scale-95"
                              title="Xem biểu giá ma trận cước đầy đủ"
                            >
                              <Maximize2 className="w-3 h-3 text-orange-600 shrink-0" />
                              <span className="whitespace-nowrap">Xem đầy đủ</span>
                            </button>

                            {/* Hàng dưới: 2 nút Lưu & Xem chi tiết (kích thước nhỏ lại) */}
                            <div className="flex items-center justify-center gap-1 w-full">
                              {/* Nút 2: Lưu */}
                              <button
                                id={`btn-bookmark-promo-${row.code}`}
                                type="button"
                                onClick={(e) => toggleBookmark(promo.id, promo.title, e)}
                                className={`flex-1 py-0.5 px-1 text-[10px] font-bold rounded-md border transition-all inline-flex items-center justify-center cursor-pointer shadow-2xs ${
                                  isBookmarked
                                    ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600'
                                    : 'bg-white border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200'
                                }`}
                                title={isBookmarked ? 'Đã lưu (Bấm để bỏ lưu)' : 'Lưu biểu giá'}
                              >
                                {isBookmarked ? (
                                  <BookmarkCheck className="w-3 h-3" />
                                ) : (
                                  <Bookmark className="w-3 h-3" />
                                )}
                              </button>

                              {/* Nút 3: Xem chi tiết hồ sơ */}
                              <button
                                id={`btn-view-profile-${row.code}`}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate({
                                    type: 'public',
                                    tab: 'supplier-profile',
                                    params: { specialistId: promo.specialistId, viewState: 'detail' }
                                  });
                                }}
                                className="flex-1 py-0.5 px-1 text-[10px] font-bold rounded-md bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-all inline-flex items-center justify-center cursor-pointer shadow-2xs"
                                title="Xem chi tiết hồ sơ năng lực của PIC"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Pagination & Stats (Đồng bộ với Lead Board) */}
          <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-medium">
              Hiển thị <strong>{Math.min(filteredAndSortedPromotions.length, (safeCurrentPage - 1) * pageSize + 1)}</strong> - <strong>{Math.min(filteredAndSortedPromotions.length, safeCurrentPage * pageSize)}</strong> trong tổng số <strong>{filteredAndSortedPromotions.length}</strong> biểu giá
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Trước</span>
              </button>

              <span className="px-3 py-1 font-bold text-slate-900">
                Trang {safeCurrentPage} / {totalPages}
              </span>

              <button
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Sau</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      {/* =========================================================================
          MODAL 1: BOOK PROMOTION / LOCK IN DEAL (CUSTOMER)
         ========================================================================= */}
      {selectedDealForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Khóa Giá & Đặt Giữ Chỗ Tuyến Ưu Đãi</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedDealForBooking.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDealForBooking(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 space-y-3.5 text-xs text-slate-700">
              <div className="rounded-xl bg-orange-50/80 p-3.5 border border-orange-100">
                <p className="font-bold text-slate-900 text-sm">{selectedDealForBooking.title}</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Mức giá khuyến mãi:</span>
                  <span className="text-lg font-black text-orange-600">
                    {selectedDealForBooking.promotionalPriceDisplay}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Thời gian vận chuyển: {selectedDealForBooking.transitTime}</span>
                  <span className="font-bold text-emerald-600">Giảm {selectedDealForBooking.discountPercent}%</span>
                </div>
              </div>

              {/* Specialist Contact Details */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">Chuyên viên phụ trách trực tiếp:</span>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{selectedDealForBooking.specialistVietnameseName}</p>
                    <p className="text-[11px] text-slate-500">{selectedDealForBooking.companyName}</p>
                  </div>
                  <a
                    href={`tel:${selectedDealForBooking.specialistPhone}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{selectedDealForBooking.specialistPhone}</span>
                  </a>
                </div>
              </div>

              {/* Inquiry details form preview */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">Ngày dự kiến bốc hàng / xuất hàng:</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">Ghi chú yêu cầu đặc biệt (tùy chọn):</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Cần xe có bửng nâng, giao trước 17h, hàng đóng thùng carton..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedDealForBooking(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setSelectedDealForBooking(null);
                  showToast(`Đã gửi yêu cầu giữ chỗ biểu giá ${selectedDealForBooking.code} thành công! Chuyên viên sẽ gọi lại cho bạn trong ít phút.`);
                }}
                className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
              >
                Xác Nhận Giữ Chỗ & Khóa Giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PUBLISH NEW PROMOTION (SUPPLIER)
         ========================================================================= */}
      {isCreatePromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Niêm Yết Chương Trình Khuyến Mãi / Cước Chiều Về</h3>
                  <p className="text-xs text-slate-500">Đăng tải lên sàn Hot Promotions & kết nối trực tiếp với Chủ hàng</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreatePromoModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePublishPromotion} className="mt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Tiêu đề chương trình khuyến mãi *</label>
                <input
                  type="text"
                  required
                  value={newPromoForm.title}
                  onChange={(e) => setNewPromoForm({ ...newPromoForm, title: e.target.value })}
                  placeholder="Ví dụ: Cước Xe Tải 15T Bắc Nam Tuyến Hà Nội → TP.HCM - Giảm 20% Cước Chiều Về"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Danh mục dịch vụ</label>
                  <select
                    value={newPromoForm.serviceType}
                    onChange={(e) => {
                      const st = e.target.value as ServiceType;
                      let cat: PromotionCategory = 'Trucking';
                      if (st === 'Sea Freight (FCL)' || st === 'Sea Freight (LCL)') cat = 'Sea Freight';
                      else if (st === 'Cold Chain') cat = 'Cold Chain';
                      else if (st === 'Air Freight') cat = 'Air Freight';
                      else if (st === 'Warehousing') cat = 'Warehousing';
                      else if (st === 'Customs Clearance') cat = 'Customs';
                      else if (st === 'Cross-border') cat = 'Cross-border';
                      setNewPromoForm({ ...newPromoForm, serviceType: st, category: cat });
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white focus:border-orange-500 focus:outline-none font-semibold"
                  >
                    <option value="Trucking">🚛 Vận tải đường bộ</option>
                    <option value="Sea Freight (FCL)">🚢 Cước biển FCL</option>
                    <option value="Sea Freight (LCL)">📦 Cước biển LCL (CFS)</option>
                    <option value="Cold Chain">❄️ Chuỗi lạnh & Vận tải lạnh</option>
                    <option value="Air Freight">✈️ Cước hàng không</option>
                    <option value="Warehousing">🏬 Kho bãi & 3PL</option>
                    <option value="Customs Clearance">📋 Thủ tục hải quan</option>
                    <option value="Cross-Border">🌐 Vận tải xuyên biên giới</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Loại ưu đãi (Badge)</label>
                  <select
                    value={newPromoForm.badgeType}
                    onChange={(e) => {
                      const bt = e.target.value as PromotionBadgeType;
                      let label = 'FLASH SALE TUẦN';
                      if (bt === 'BACKHAUL_DEAL') label = 'CƯỚC CHIỀU VỀ HOT';
                      else if (bt === 'HOT_ROUTE') label = 'TUYẾN HOT CÔNG NGHIỆP';
                      else if (bt === 'VOLUME_DISCOUNT') label = 'GIẢM THEO SỐ LƯỢNG';
                      else if (bt === 'EXCLUSIVE_FLEXGO') label = 'ĐỘC QUYỀN FLEXGO';
                      else if (bt === 'LIMITED_CAPACITY') label = 'GIỮ CHỖ CÓ HẠN';
                      setNewPromoForm({ ...newPromoForm, badgeType: bt, badgeLabel: label });
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white focus:border-orange-500 focus:outline-none font-semibold"
                  >
                    <option value="BACKHAUL_DEAL">🚚 Cước chiều về (Backhaul)</option>
                    <option value="FLASH_SALE">⚡ Flash Sale tuần</option>
                    <option value="HOT_ROUTE">🌟 Tuyến hot công nghiệp</option>
                    <option value="VOLUME_DISCOUNT">📦 Giảm theo số lượng</option>
                    <option value="EXCLUSIVE_FLEXGO">💎 Độc quyền flexGO</option>
                    <option value="LIMITED_CAPACITY">⏳ Giữ chỗ có hạn</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">% Giảm giá (%)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={newPromoForm.discountPercent}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, discountPercent: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-emerald-700 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Điểm đi (Origin) *</label>
                  <input
                    type="text"
                    required
                    value={newPromoForm.origin}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, origin: e.target.value })}
                    placeholder="VD: Cảng Cát Lái, TP.HCM / Hà Nội"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Điểm đến (Destination) *</label>
                  <input
                    type="text"
                    required
                    value={newPromoForm.destination}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, destination: e.target.value })}
                    placeholder="VD: KCN VSIP Bắc Ninh / Hải Phòng"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Giá gốc niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={newPromoForm.originalPriceVND}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, originalPriceVND: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Phương tiện / Quy cách</label>
                  <input
                    type="text"
                    value={newPromoForm.vehicleOrUnit}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, vehicleOrUnit: e.target.value })}
                    placeholder="VD: Xe Tải 15T Kín / Cont 40HC"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Thời gian hành trình</label>
                  <input
                    type="text"
                    value={newPromoForm.transitTime}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, transitTime: e.target.value })}
                    placeholder="VD: 36 - 40 Giờ"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Cam kết & Đặc quyền dịch vụ (cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={newPromoForm.highlights}
                  onChange={(e) => setNewPromoForm({ ...newPromoForm, highlights: e.target.value })}
                  placeholder="VD: GPS Realtime 24/7, Miễn phí bốc xếp 2 đầu, Bảo hiểm hàng hóa 5 Tỷ"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreatePromoModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-orange-700 cursor-pointer"
                >
                  Công Bố Niêm Yết Lên Sàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Cost Matrix Modal View */}
      <HotPromotionFullCostMatrixModal
        item={selectedPromoForModal}
        isOpen={!!selectedPromoForModal}
        onClose={() => setSelectedPromoForModal(null)}
        onBookPromotion={setSelectedDealForBooking}
      />
    </div>
  );
};
