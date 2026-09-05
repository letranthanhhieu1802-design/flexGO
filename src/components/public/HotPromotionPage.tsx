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
  Info,
  Coins,
  ArrowUpDown,
  Copy,
  LayoutList,
  LayoutGrid,
  Hourglass,
  Repeat,
  Boxes,
  RotateCcw
} from 'lucide-react';
import { HotPromotionItem, PromotionCategory, PromotionBadgeType, ServiceType, CurrentView, UserProfile } from '../../types';
import { allAggregatedPromotions } from '../../data/mockAggregatedRates';
import { mockPromotions } from '../../data/mockPromotions';
import { HotPromotionRateDetailCard } from './HotPromotionRateDetailCard';

interface HotPromotionPageProps {
  currentUser: UserProfile;
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: () => void;
}

type SortField = 'discount' | 'price' | 'createdDate' | 'views' | 'daysRemaining' | 'code' | 'service';
type SortDirection = 'asc' | 'desc';

interface ServiceTabItem {
  id: string;
  name: string;
  nameVi: string;
  serviceType: ServiceType | 'ALL';
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgLightClass: string;
  activeClass: string;
}

export const HotPromotionPage: React.FC<HotPromotionPageProps> = ({
  currentUser,
  onNavigate,
  onOpenCreateInquiry
}) => {
  // Combine custom declared promotions with the aggregated rate cards from verified supplier profiles
  const initialCombined = useMemo(() => {
    const combined = [...mockPromotions, ...allAggregatedPromotions];
    // Remove duplicates by ID if any
    const seen = new Set<string>();
    return combined.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, []);

  const [promotionsList, setPromotionsList] = useState<HotPromotionItem[]>(initialCombined);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('discount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // View & Density States (Table view like Lead Board vs Card Grid view)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [tableDensity, setTableDensity] = useState<'comfortable' | 'compact'>('comfortable');
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

  const toggleRowExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedRowIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Service Tabs Configuration (8 categories, 2 lines x 4 cols, exactly matching Lead Board layout)
  const serviceTabs: ServiceTabItem[] = [
    {
      id: 'ALL',
      name: 'All Modes',
      nameVi: 'Tất cả dịch vụ',
      serviceType: 'ALL',
      icon: Layers,
      colorClass: 'text-orange-600',
      bgLightClass: 'bg-orange-50',
      activeClass: 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-600',
    },
    {
      id: 'Trucking',
      name: 'Trucking',
      nameVi: 'Vận tải đường bộ',
      serviceType: 'Trucking',
      icon: Truck,
      colorClass: 'text-blue-600',
      bgLightClass: 'bg-blue-50',
      activeClass: 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600',
    },
    {
      id: 'Sea Freight (FCL)',
      name: 'Ocean FCL',
      nameVi: 'Đường biển FCL',
      serviceType: 'Sea Freight (FCL)',
      icon: Ship,
      colorClass: 'text-cyan-600',
      bgLightClass: 'bg-cyan-50',
      activeClass: 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-600',
    },
    {
      id: 'Sea Freight (LCL)',
      name: 'Ocean LCL',
      nameVi: 'Đường biển LCL (CFS)',
      serviceType: 'Sea Freight (LCL)',
      icon: Boxes,
      colorClass: 'text-teal-600',
      bgLightClass: 'bg-teal-50',
      activeClass: 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-600',
    },
    {
      id: 'Air Freight',
      name: 'Air Freight',
      nameVi: 'Hàng không Express',
      serviceType: 'Air Freight',
      icon: Plane,
      colorClass: 'text-sky-600',
      bgLightClass: 'bg-sky-50',
      activeClass: 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-600',
    },
    {
      id: 'Cold Chain',
      name: 'Cold Chain',
      nameVi: 'Chuỗi lạnh & Nhiệt độ',
      serviceType: 'Cold Chain',
      icon: Snowflake,
      colorClass: 'text-emerald-600',
      bgLightClass: 'bg-emerald-50',
      activeClass: 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600',
    },
    {
      id: 'Warehousing',
      name: 'Warehousing',
      nameVi: 'Kho bãi & 3PL',
      serviceType: 'Warehousing',
      icon: Warehouse,
      colorClass: 'text-amber-600',
      bgLightClass: 'bg-amber-50',
      activeClass: 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-600',
    },
    {
      id: 'Customs Clearance',
      name: 'Customs Broker',
      nameVi: 'Thủ tục hải quan',
      serviceType: 'Customs Clearance',
      icon: FileCheck2,
      colorClass: 'text-purple-600',
      bgLightClass: 'bg-purple-50',
      activeClass: 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-600',
    },
  ];

  // Service count calculation
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: promotionsList.length };
    serviceTabs.forEach(tab => {
      if (tab.id !== 'ALL') {
        counts[tab.id] = promotionsList.filter(p => {
          if (tab.id === 'Sea Freight (FCL)') {
            return p.serviceType === 'Sea Freight (FCL)' || p.category === 'Sea Freight';
          }
          if (tab.id === 'Sea Freight (LCL)') {
            return p.serviceType === 'Sea Freight (LCL)';
          }
          return p.serviceType === tab.serviceType || p.category === tab.id;
        }).length;
      }
    });
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
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          !searchTerm ||
          promo.code.toLowerCase().includes(searchLower) ||
          promo.title.toLowerCase().includes(searchLower) ||
          promo.routeDisplay.toLowerCase().includes(searchLower) ||
          promo.origin.toLowerCase().includes(searchLower) ||
          promo.destination.toLowerCase().includes(searchLower) ||
          promo.specialistVietnameseName.toLowerCase().includes(searchLower) ||
          promo.companyName.toLowerCase().includes(searchLower) ||
          promo.vehicleOrUnit.toLowerCase().includes(searchLower) ||
          promo.cargoSuitability.toLowerCase().includes(searchLower);

        const matchesService = 
          selectedService === 'ALL' || 
          promo.serviceType === selectedService ||
          promo.category.toLowerCase() === selectedService.toLowerCase() ||
          (selectedService === 'Sea Freight (FCL)' && promo.category === 'Sea Freight');

        const matchesBadge = 
          selectedBadge === 'ALL' || 
          promo.badgeType === selectedBadge;

        return matchesSearch && matchesService && matchesBadge;
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
        } else {
          comp = a.validFrom.localeCompare(b.validFrom);
        }

        return sortDirection === 'desc' ? -comp : comp;
      });
  }, [promotionsList, searchTerm, selectedService, selectedBadge, sortField, sortDirection]);

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
  }, [filteredAndSortedPromotions, tableDensity, currentPage, pageSize, viewMode]);

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

  const toggleExpandAll = () => {
    const allExpanded = paginatedPromotions.every(p => expandedRowIds[p.id]);
    const newState: Record<string, boolean> = {};
    if (!allExpanded) {
      paginatedPromotions.forEach(p => {
        newState[p.id] = true;
      });
    }
    setExpandedRowIds(newState);
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
          label: 'Đường biển FCL',
        };
      case 'Sea Freight (LCL)':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200/80',
          icon: <Boxes className="w-3 h-3 text-teal-600 shrink-0" />,
          label: 'Đường biển LCL',
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
          label: 'Kho bãi 3PL',
        };
      case 'Customs Clearance':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
          icon: <FileCheck2 className="w-3 h-3 text-purple-600 shrink-0" />,
          label: 'Hải quan',
        };
      case 'Cross-border':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200/80',
          icon: <Globe className="w-3 h-3 text-orange-600 shrink-0" />,
          label: 'Xuyên biên giới',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <Layers className="w-3 h-3 text-slate-600 shrink-0" />,
          label: 'Logistics',
        };
    }
  };

  return (
    <div id="hot-promotions-page" className="min-h-screen bg-slate-50/70 pb-20 space-y-6">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>Sàn Cước Khuyến Mãi & Biểu Giá Dịch Vụ Nhà Cung Cấp Niêm Yết</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Hot Promotions & Biểu Giá Dịch Vụ
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tổng hợp tự động toàn bộ <strong>biểu giá dịch vụ, cước chiều về, cước Flash Sale, kho bãi & thủ tục hải quan</strong> do các Nhà xe, Hãng vận tải và Chuyên viên Kinh doanh (PIC) niêm yết trên trang cá nhân của họ để Chủ hàng tra cứu và khóa giá nhanh.
            </p>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreatePromoModalOpen(true)}
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
          1. SERVICE TABS NAVIGATOR (2 dòng x 4 cột, y hệt như Lead Board)
         ========================================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
            <span>Phân Loại Theo Phương Thức Vận Tải & Dịch Vụ Niêm Yết</span>
          </h2>
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
                  setSelectedService(tab.id);
                  setCurrentPage(1);
                }}
                className={`group px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer border w-full text-left ${
                  isSelected
                    ? tab.activeClass
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : `${tab.bgLightClass} ${tab.colorClass}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="leading-tight truncate text-xs font-bold">{tab.nameVi}</div>
                    <div className={`text-[10px] font-medium leading-none mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {tab.name}
                    </div>
                  </div>
                </div>
                <span
                  className={`ml-1 px-2 py-0.5 text-[10.5px] font-extrabold rounded-full shrink-0 ${
                    isSelected ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2. TOOLBAR: SEARCH, BADGE FILTERS, DENSITY & VIEW SWITCHER
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="promo-search-input"
              type="text"
              placeholder="Tìm theo Mã Biểu Giá, Tuyến đường, Chuyên viên PIC, Nhà xe, Loại phương tiện..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters & Display Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Badge Type Filter */}
            <div className="flex items-center gap-1 bg-orange-50/70 border border-orange-200 rounded-xl px-2.5 py-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <select
                id="promo-badge-filter"
                value={selectedBadge}
                onChange={(e) => {
                  setSelectedBadge(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-orange-900 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Mọi loại ưu đãi</option>
                <option value="BACKHAUL_DEAL">Cước chiều về (Backhaul)</option>
                <option value="FLASH_SALE">Flash Sale tuần</option>
                <option value="HOT_ROUTE">Tuyến hot công nghiệp</option>
                <option value="VOLUME_DISCOUNT">Giảm theo số lượng</option>
                <option value="EXCLUSIVE_FLEXGO">Độc quyền flexGO</option>
                <option value="LIMITED_CAPACITY">Giữ chỗ có hạn</option>
              </select>
            </div>

            {/* Expand / Collapse All Toggle */}
            <button
              onClick={toggleExpandAll}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Đóng / Mở tất cả chi tiết thông số kỹ thuật"
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Đóng/Mở Chi Tiết</span>
            </button>

            {/* View Mode Toggle: Table (Lead Board style) vs Grid (Card style) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  viewMode === 'table' ? 'bg-white text-orange-600 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Xem dạng Bảng Dữ Liệu Tra Cứu (như Lead Board)"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Dạng Bảng (Lead Board)</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  viewMode === 'grid' ? 'bg-white text-orange-600 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Xem dạng Thẻ (Cards Grid)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Dạng Thẻ (Cards)</span>
              </button>
            </div>

            {/* Table Density Switcher */}
            {viewMode === 'table' && (
              <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setTableDensity('comfortable')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    tableDensity === 'comfortable' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Chuẩn
                </button>
                <button
                  onClick={() => setTableDensity('compact')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    tableDensity === 'compact' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Thu gọn
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN CONTENT: TABLE VIEW (LEAD BOARD STYLE) VS GRID VIEW
         ========================================================================= */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full flex flex-col">
          {/* Top Horizontal Scrollbar (Synchronized) */}
          <div 
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="w-full overflow-x-auto overflow-y-hidden bg-slate-50 border-b border-slate-200 z-30 select-none"
            title="Thanh cuộn ngang"
          >
            <div style={{ width: `${tableScrollWidth}px`, height: '1px' }} />
          </div>

          {/* Scrollable Table Area with Frozen Sticky Header */}
          <div 
            ref={tableScrollRef}
            onScroll={handleTableScroll}
            className="overflow-x-auto overflow-y-auto max-h-[650px] relative scroll-smooth focus:outline-none hide-horizontal-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            tabIndex={0}
          >
            <table className="w-full min-w-[1020px] text-left border-collapse" id="promotions-data-table">
              {/* Frozen Sticky Table Header */}
              <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs border-b border-slate-200">
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
                  <th className="py-3.5 px-3 w-12 text-center sticky top-0 z-20 bg-slate-100 border-b border-slate-200">STT</th>
                  
                  {/* Cột 1: Ngày Công Bố & Hạn Áp Dụng */}
                  <th 
                    className="py-3.5 px-3 cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap min-w-[130px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('createdDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Ngày Đăng / Hạn</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Cột 2: Mã Biểu Giá */}
                  <th 
                    className="py-3.5 px-3 cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap min-w-[110px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Mã Niêm Yết</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Cột 3: Dịch Vụ Logistics */}
                  <th 
                    className="py-3.5 px-3 cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap min-w-[140px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('service')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Dịch Vụ Logistics</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Cột 4: Loại Ưu Đãi / Tuyến Niêm Yết */}
                  <th className="py-3.5 px-3 whitespace-nowrap min-w-[200px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                    <span>Tuyến Đường & Loại Ưu Đãi</span>
                  </th>

                  {/* Cột 5: Chuyên Viên (PIC) Phụ Trách */}
                  <th className="py-3.5 px-3 whitespace-nowrap min-w-[180px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                    <span>Chuyên Viên (PIC) & Nhà Xe</span>
                  </th>

                  {/* Cột 6: Giá Niêm Yết & % Giảm */}
                  <th 
                    className="py-3.5 px-3 text-right cursor-pointer hover:text-orange-600 transition-colors whitespace-nowrap min-w-[160px] sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Giá Khuyến Mãi / Suất</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Cột 7: Thao Tác (Chi tiết, Gọi điện, Khóa giá) */}
                  <th className="py-3.5 px-3 text-center min-w-[140px] whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                    <span>Thao Tác</span>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAndSortedPromotions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto">
                          <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">Không tìm thấy biểu giá ưu đãi phù hợp</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Thử điều chỉnh lại từ khóa tìm kiếm hoặc chọn danh mục dịch vụ khác để tra cứu các biểu giá khả dụng.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedService('ALL');
                            setSelectedBadge('ALL');
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
                    const serviceStyle = getServiceBadgeStyle(promo.serviceType);
                    const isExpanded = !!expandedRowIds[promo.id];
                    const isBookmarked = bookmarkedDealIds.includes(promo.id);
                    const padClass = tableDensity === 'compact' ? 'py-2 px-3' : 'py-3.5 px-3';
                    const itemIndex = (safeCurrentPage - 1) * pageSize + index + 1;

                    return (
                      <React.Fragment key={promo.id}>
                        <tr
                          id={`promo-row-${promo.code}`}
                          onClick={() => toggleRowExpand(promo.id)}
                          className={`hover:bg-orange-50/40 transition-colors cursor-pointer group ${
                            isExpanded ? 'bg-orange-50/30' : index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                          }`}
                        >
                          {/* Cột STT */}
                          <td className={`${padClass} text-center font-mono text-slate-500 font-bold text-xs w-12 select-none`}>
                            {itemIndex}
                          </td>

                          {/* Cột 1: Ngày Công Bố & Hạn Áp Dụng */}
                          <td className={`${padClass} whitespace-nowrap`}>
                            <div className="space-y-1 text-xs">
                              <div className="text-slate-500 font-medium flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{promo.validFrom}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10.5px] text-rose-600 font-bold bg-rose-50/90 px-1.5 py-0.5 rounded border border-rose-200/70 w-fit">
                                <Hourglass className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                                <span>Còn {promo.daysRemaining} ngày</span>
                              </div>
                            </div>
                          </td>

                          {/* Cột 2: Mã Niêm Yết */}
                          <td className={`${padClass} whitespace-nowrap`}>
                            <div className="flex items-center gap-1 font-mono font-bold text-slate-800 text-xs">
                              <span className="text-orange-600 hover:underline">{promo.code}</span>
                              <button
                                onClick={(e) => handleCopyCode(promo.code, e)}
                                className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                                title="Sao chép mã biểu giá"
                              >
                                {copiedCode === promo.code ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Cột 3: Dịch Vụ Logistics */}
                          <td className={`${padClass} whitespace-nowrap`}>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold border ${serviceStyle.bg}`}
                              title={promo.serviceType}
                            >
                              {serviceStyle.icon}
                              <span>{serviceStyle.label}</span>
                            </span>
                          </td>

                          {/* Cột 4: Tuyến Đường & Loại Ưu Đãi */}
                          <td className={padClass}>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${getBadgeStyle(promo.badgeType)}`}>
                                  {promo.badgeLabel}
                                </span>
                              </div>
                              <p className="font-bold text-slate-900 text-xs group-hover:text-orange-600 transition-colors line-clamp-1">
                                {promo.routeDisplay}
                              </p>
                              <span className="text-[10px] text-slate-500 font-medium block truncate">
                                {promo.vehicleOrUnit}
                              </span>
                            </div>
                          </td>

                          {/* Cột 5: Chuyên Viên (PIC) & Nhà Xe */}
                          <td className={padClass}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {promo.specialistAvatarInitial}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onNavigate({ 
                                        type: 'public', 
                                        tab: 'supplier-profile', 
                                        params: { specialistId: promo.specialistId, viewState: 'detail' } 
                                      });
                                    }}
                                    className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate block"
                                    title="Xem trang cá nhân của Chuyên viên (PIC)"
                                  >
                                    {promo.specialistVietnameseName}
                                  </span>
                                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                </div>
                                <span className="text-[10px] text-slate-500 font-medium block truncate">
                                  {promo.companyName}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Cột 6: Giá Niêm Yết & % Giảm */}
                          <td className={`${padClass} text-right whitespace-nowrap`}>
                            <div className="space-y-0.5">
                              <div className="flex items-baseline justify-end gap-1.5">
                                <span className="text-[10.5px] text-slate-400 line-through">
                                  {promo.originalPriceDisplay}
                                </span>
                                <span className="text-xs font-black text-orange-600 block">
                                  {promo.promotionalPriceDisplay}
                                </span>
                              </div>
                              <div className="flex items-center justify-end gap-1">
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Percent className="w-2.5 h-2.5" />
                                  <span>Giảm {promo.discountPercent}%</span>
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Cột 7: Thao Tác (Xem chi tiết & Khóa giá) */}
                          <td className={`${padClass} text-center whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                id={`toggle-promo-btn-${promo.code}`}
                                type="button"
                                onClick={(e) => toggleRowExpand(promo.id, e)}
                                className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                                  isExpanded
                                    ? 'bg-orange-600 text-white shadow-xs'
                                    : 'bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 hover:border-orange-300'
                                }`}
                                title={isExpanded ? 'Thu gọn chi tiết' : 'Mở xem chi tiết thông số kỹ thuật và hồ sơ PIC'}
                              >
                                <span>{isExpanded ? 'Đóng' : 'Chi tiết'}</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <button
                                onClick={() => setSelectedDealForBooking(promo)}
                                className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-2xs transition-colors cursor-pointer"
                                title="Khóa giá và liên hệ giữ chỗ ngay"
                              >
                                <span>Khóa Giá</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Technical Specs Row */}
                        {isExpanded && (
                          <tr className="bg-orange-50/40 border-b border-orange-100">
                            <td colSpan={8} className="p-3 sm:p-4">
                              <HotPromotionRateDetailCard
                                item={promo}
                                onNavigate={onNavigate}
                                onBookPromotion={setSelectedDealForBooking}
                                onToggleBookmark={toggleBookmark}
                                isBookmarked={isBookmarked}
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
      ) : (
        /* PROMOTION CARDS GRID VIEW */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {paginatedPromotions.map((promo) => {
            const isBookmarked = bookmarkedDealIds.includes(promo.id);
            const savingsVND = promo.originalPriceVND - promo.promotionalPriceVND;

            return (
              <div
                key={promo.id}
                id={`promotion-card-${promo.id}`}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-orange-300 transition-all group"
              >
                <div>
                  {/* Card Header: Badge, Discount Pill, Expiry Countdown & Bookmark */}
                  <div className="border-b border-slate-100 p-5 bg-linear-to-r from-orange-50/50 via-white to-slate-50/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${getBadgeStyle(promo.badgeType)}`}>
                          <Flame className="h-3 w-3" />
                          {promo.badgeLabel}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <Percent className="h-3 w-3" />
                          Giảm {promo.discountPercent}%
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <Clock className="h-3 w-3 text-slate-400" />
                          Còn {promo.daysRemaining} ngày
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(promo.id, promo.title)}
                        className={`rounded-lg p-2 transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                        title={isBookmarked ? 'Bỏ lưu ưu đãi' : 'Lưu ưu đãi này'}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    {/* Deal Title */}
                    <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {promo.title}
                    </h3>

                    {/* Route Box with Visual Indicator */}
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Tuyến Vận Chuyển:</span>
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{promo.origin}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                          <span>{promo.destination}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Thời gian:</span>
                        <span className="font-semibold text-slate-700">{promo.transitTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Comparison Spotlight Box */}
                  <div className="p-5 space-y-4">
                    <div className="rounded-xl bg-linear-to-r from-orange-50/80 via-amber-50/40 to-slate-50 p-4 border border-orange-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-slate-400 line-through">
                              {promo.originalPriceDisplay}
                            </span>
                            <span className="text-xl sm:text-2xl font-black text-orange-600">
                              {promo.promotionalPriceDisplay}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Đơn vị tính: {promo.pricingUnit}
                          </span>
                        </div>

                        <div className="sm:text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            Tiết kiệm {savingsVND > 0 ? `${savingsVND.toLocaleString('vi-VN')} ₫` : `${promo.discountPercent}%`}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {promo.availableCapacity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Salesman (PIC) & Company Anchor */}
                    <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-sm shrink-0">
                          {promo.specialistAvatarInitial}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span 
                              onClick={() => {
                                onNavigate({ 
                                  type: 'public', 
                                  tab: 'supplier-profile', 
                                  params: { specialistId: promo.specialistId, viewState: 'detail' } 
                                });
                              }}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                            >
                              {promo.specialistVietnameseName}
                            </span>
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {promo.specialistTitle} • <strong>{promo.companyName}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onNavigate({ 
                            type: 'public', 
                            tab: 'supplier-profile', 
                            params: { specialistId: promo.specialistId, viewState: 'detail' } 
                          });
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer shrink-0"
                      >
                        Hồ sơ PIC ›
                      </button>
                    </div>

                    {/* Highlights & Included Perks */}
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Đặc quyền & Cam kết dịch vụ:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {promo.highlights.slice(0, 4).map((hl, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-slate-100 p-4 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${promo.specialistPhone}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      title={`Gọi cho ${promo.specialistVietnameseName}`}
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Gọi PIC</span>
                    </a>

                    <button
                      onClick={() => setSelectedDealForBooking(promo)}
                      className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Gửi RFQ Tuyến Này</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedDealForBooking(promo)}
                    id={`book-promo-btn-${promo.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Khóa Giá & Nhận Ưu Đãi</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
    </div>
  );
};
