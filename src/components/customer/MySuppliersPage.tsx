import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Star, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Send,
  Heart,
  Trophy,
  Globe,
  FileText,
  Coins,
  Sparkles,
  Layers,
  LayoutGrid,
  TableProperties,
  ArrowUpRight,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  Zap,
  Tag,
  Check,
  Copy,
  Info,
  Eye
} from 'lucide-react';
import { 
  SupplierCompany, 
  SupplierCategory, 
  CustomerSupplierSourceType,
  ServiceType,
  CurrentView,
  InquiryItem,
  QuotationItem
} from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { Supplier360Drawer } from './Supplier360Drawer';
import { AddCurrentSupplierModal } from './AddCurrentSupplierModal';

interface MySuppliersPageProps {
  suppliers: SupplierCompany[];
  inquiries?: InquiryItem[];
  quotations?: QuotationItem[];
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: (supplierId?: string) => void;
  onAddSupplier?: (supplier: SupplierCompany) => void;
}

export const MySuppliersPage: React.FC<MySuppliersPageProps> = ({
  suppliers: initialSuppliers,
  inquiries = [],
  quotations = [],
  onNavigate,
  onOpenCreateInquiry,
  onAddSupplier: externalAddSupplier,
}) => {
  // Local state for suppliers list (supports adding new Current Suppliers dynamically)
  const [localSuppliers, setLocalSuppliers] = useState<SupplierCompany[]>(initialSuppliers);
  
  // Sync if initialSuppliers changes
  React.useEffect(() => {
    setLocalSuppliers(initialSuppliers);
  }, [initialSuppliers]);

  // Set of Inquiry Codes/IDs owned by this Customer
  const customerInquiryCodes = useMemo(() => {
    return new Set(inquiries.map((i) => i.code));
  }, [inquiries]);

  // Calculate the count of quotations submitted by this supplier specifically for this Customer's inquiries
  const getSupplierQuoteCountForCustomer = (supplier: SupplierCompany): number => {
    if (quotations && quotations.length > 0) {
      const matchQuotes = quotations.filter((q) => {
        const isSupplierMatch = 
          q.supplierId === supplier.id ||
          (q.supplierName && q.supplierName.trim().toLowerCase() === supplier.name.trim().toLowerCase());
        const isInquiryMatch = 
          customerInquiryCodes.has(q.inquiryCode) || 
          inquiries.some((i) => i.id === q.inquiryId || i.code === q.inquiryCode);
        return isSupplierMatch && isInquiryMatch;
      });
      if (matchQuotes.length > 0) {
        return matchQuotes.length;
      }
    }
    // Realistic fallback counts based on customer relationships
    if (supplier.source === 'AWARDED_QUOTE') {
      return supplier.inquiriesHandledCount ?? 3;
    } else if (supplier.source === 'DIRECT_PROFILE_REQUEST') {
      return supplier.inquiriesHandledCount ?? 2;
    } else {
      return supplier.inquiriesHandledCount ?? 1;
    }
  };

  // Navigate to My Inquiries filtered by this supplier code (Mã NCC / Supplier ID)
  const handleViewSupplierInquiries = (supplier: SupplierCompany, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const targetCodeOrId = supplier.code || supplier.id;
    onNavigate({
      type: 'workspace',
      view: 'customer-inquiries',
      params: {
        supplierCode: targetCodeOrId,
        supplierId: supplier.id,
        supplierName: supplier.name,
      },
    });
  };

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Drawers & Modals
  const [selectedSupplierFor360, setSelectedSupplierFor360] = useState<SupplierCompany | null>(null);
  const [is360DrawerOpen, setIs360DrawerOpen] = useState(false);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Source count metrics
  const totalCount = localSuppliers.length;
  const awardedCount = localSuppliers.filter((s) => s.source === 'AWARDED_QUOTE').length;
  const directProfileCount = localSuppliers.filter((s) => s.source === 'DIRECT_PROFILE_REQUEST').length;
  const currentSupplierCount = localSuppliers.filter((s) => s.source === 'CURRENT_SUPPLIER').length;

  const copyToClipboard = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddCurrentSupplier = (newSupplier: SupplierCompany) => {
    setLocalSuppliers((prev) => [newSupplier, ...prev]);
    if (externalAddSupplier) {
      externalAddSupplier(newSupplier);
    }
  };

  const handleOpenSupplier360 = (supplier: SupplierCompany, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // Find matching specialist in mockSalesSpecialists
    const matchedSpecialist = mockSalesSpecialists.find(
      (s) =>
        s.companyId === supplier.id ||
        s.companyName.toLowerCase() === supplier.name.toLowerCase() ||
        s.name.toLowerCase() === (supplier.contactPerson || '').toLowerCase() ||
        s.vietnameseName.toLowerCase() === (supplier.contactPerson || '').toLowerCase() ||
        (supplier.name.toLowerCase().includes('vinatrans') && s.id.includes('minh')) ||
        (supplier.name.toLowerCase().includes('mekong') && s.id.includes('linh')) ||
        (supplier.name.toLowerCase().includes('saigon') && s.id.includes('nam')) ||
        (supplier.name.toLowerCase().includes('ocean') && s.id.includes('nam'))
    );

    const specialistId = matchedSpecialist ? matchedSpecialist.id : 'sales-minh-tran';

    onNavigate({
      type: 'public',
      tab: 'supplier-profile',
      params: {
        specialistId: specialistId,
        viewState: 'detail',
        supplierId: supplier.id,
        from: 'customer-suppliers',
      },
    });
  };

  // Filter logic
  const filteredSuppliers = useMemo(() => {
    return localSuppliers.filter((s) => {
      const matchesSearch =
        (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.taxId && s.taxId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.hubLocations.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.services.some((sv) => sv.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.preferredRoutes.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.sourceDetails?.inquiryCode && s.sourceDetails.inquiryCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.sourceDetails?.quoteCode && s.sourceDetails.quoteCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.sourceDetails?.rateCode && s.sourceDetails.rateCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSource = sourceFilter === 'ALL' || s.source === sourceFilter;
      const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
      const matchesService = serviceFilter === 'ALL' || s.services.includes(serviceFilter as ServiceType);

      return matchesSearch && matchesSource && matchesCategory && matchesService;
    });
  }, [localSuppliers, searchTerm, sourceFilter, categoryFilter, serviceFilter]);

  const getCategoryBadge = (category: SupplierCategory) => {
    switch (category) {
      case 'Preferred':
        return 'bg-purple-100 text-purple-800 border-purple-200 font-bold';
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold';
      case 'Potential':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Current Supplier':
        return 'bg-sky-100 text-sky-800 border-sky-200 font-bold';
      case 'Inactive':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderSourceBadge = (supplier: SupplierCompany) => {
    const source = supplier.source || 'AWARDED_QUOTE';
    switch (source) {
      case 'AWARDED_QUOTE':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs whitespace-nowrap">
            Awarded
          </span>
        );

      case 'DIRECT_PROFILE_REQUEST':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs whitespace-nowrap">
            Direct RFQ
          </span>
        );

      case 'CURRENT_SUPPLIER':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs whitespace-nowrap">
            Current Supplier
          </span>
        );

      default:
        return null;
    }
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
              <span className="text-indigo-400 font-bold">My Suppliers (CRM Mạng Lưới Nhà Cung Cấp)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shadow-xs shrink-0">
                <Building2 className="w-5 h-5 text-indigo-200" />
              </div>
              <span>My Suppliers</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Quản lý tập trung mạng lưới nhà cung cấp từ 3 nguồn: <strong>Trao thầu Báo giá (Awarded)</strong>, <strong>Yêu cầu Profile Trực tiếp (Direct RFQ)</strong> và <strong>Current Supplier (Khai báo giá vận hành)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="declare-current-supplier-btn"
              onClick={() => setIsAddSupplierModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-sky-200 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-sky-300" />
              <span>+ Khai Báo Current Supplier</span>
            </button>

            <button
              id="browse-public-suppliers-btn"
              onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
              className="px-3.5 py-2.5 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <span>Danh Bạ Nhà Xe Công Khai</span>
            </button>

            <button
              id="create-rfq-for-suppliers-btn"
              onClick={() => onOpenCreateInquiry()}
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Supplier RFQ</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive KPI Cards in LeadBoard Dark Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10 relative z-10">
          {/* Card 1: Tổng Nhà Cung Cấp */}
          <div 
            onClick={() => setSourceFilter('ALL')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'ALL'
                ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Tổng Nhà Cung Cấp</span>
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400 tracking-tight">{totalCount}</span>
              <span className="text-xs font-bold text-cyan-300/90">đối tác vận tải</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Toàn bộ mạng lưới nhà xe & forwarder</p>
          </div>

          {/* Card 2: Awarded */}
          <div 
            onClick={() => setSourceFilter('AWARDED_QUOTE')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'AWARDED_QUOTE'
                ? 'bg-slate-800/90 border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Awarded (Trúng Thầu)</span>
              <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-300 tracking-tight">{awardedCount}</span>
              <span className="text-xs font-bold text-indigo-200/90">nhà cung cấp</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Trao thầu từ Inquiry trên sàn</p>
          </div>

          {/* Card 3: Direct RFQ */}
          <div 
            onClick={() => setSourceFilter('DIRECT_PROFILE_REQUEST')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'DIRECT_PROFILE_REQUEST'
                ? 'bg-slate-800/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Direct RFQ (Trực Tiếp)</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Globe className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">{directProfileCount}</span>
              <span className="text-xs font-bold text-emerald-300/90">nhà cung cấp</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Yêu cầu chào giá 1-1 qua Profile</p>
          </div>

          {/* Card 4: Current Supplier */}
          <div 
            onClick={() => setSourceFilter('CURRENT_SUPPLIER')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'CURRENT_SUPPLIER'
                ? 'bg-slate-800/90 border-sky-400 ring-2 ring-sky-400/40 shadow-lg shadow-sky-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-sky-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Current Supplier</span>
              <div className="w-7 h-7 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-sky-400 tracking-tight">{currentSupplierCount}</span>
              <span className="text-xs font-bold text-sky-300/90">nhà cung cấp</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Khai báo giá vận hành nội bộ</p>
          </div>
        </div>
      </div>

      {/* Source Quick Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto w-full p-1 bg-slate-100/90 rounded-2xl mb-6">
        <button
          onClick={() => setSourceFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            sourceFilter === 'ALL'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Tất Cả Nguồn ({totalCount})
        </button>

        <button
          onClick={() => setSourceFilter('AWARDED_QUOTE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            sourceFilter === 'AWARDED_QUOTE'
              ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-indigo-600" />
          <span>Awarded ({awardedCount})</span>
        </button>

        <button
          onClick={() => setSourceFilter('DIRECT_PROFILE_REQUEST')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            sourceFilter === 'DIRECT_PROFILE_REQUEST'
              ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>Direct RFQ ({directProfileCount})</span>
        </button>

        <button
          onClick={() => setSourceFilter('CURRENT_SUPPLIER')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            sourceFilter === 'CURRENT_SUPPLIER'
              ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-sky-600" />
          <span>Current Supplier ({currentSupplierCount})</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên nhà xe, MST, dịch vụ, tuyến đường, đầu mối..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tất cả phân loại</option>
              <option value="Preferred">Preferred (Đối tác chiến lược)</option>
              <option value="Active">Active (Đang vận hành)</option>
              <option value="Potential">Potential (Tiềm năng)</option>
              <option value="Current Supplier">Current Supplier (Ngoại sàn)</option>
            </select>
          </div>

          {/* Service Filter */}
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tất cả dịch vụ</option>
              <option value="Trucking">Trucking (Đường bộ)</option>
              <option value="Sea Freight (FCL)">Sea Freight (FCL)</option>
              <option value="Sea Freight (LCL)">Sea Freight (LCL)</option>
              <option value="Air Freight">Air Freight (Hàng không)</option>
              <option value="Cold Chain">Cold Chain (Chuỗi lạnh)</option>
              <option value="Warehousing">Warehousing (Kho bãi)</option>
              <option value="Customs Clearance">Customs Clearance (Hải quan)</option>
              <option value="Cross-border">Cross-border (Liên vận)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              title="Xem dạng Bảng CRM"
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Xem dạng Lưới Thẻ"
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards View */}
      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy nhà cung cấp phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Không có kết quả khớp với bộ lọc hiện tại. Bạn có thể xóa từ khóa tìm kiếm hoặc khai báo thêm Current Supplier.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => {
                setSearchTerm('');
                setSourceFilter('ALL');
                setCategoryFilter('ALL');
                setServiceFilter('ALL');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Xóa Bộ Lọc
            </button>
            <button
              onClick={() => setIsAddSupplierModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
            >
              + Khai Báo Current Supplier
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* CRM Master Table View (Mirroring MiniCRM) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">STT</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Mã NCC</th>
                  <th className="py-3.5 px-4 min-w-[180px]">Thông Tin PIC</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Công Ty</th>
                  <th className="py-3.5 px-4">Dịch Vụ Cung Cấp</th>
                  <th className="py-3.5 px-4">Nguồn</th>
                  <th className="py-3.5 px-4 text-center">Số Lượng Báo Giá</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSuppliers.map((supplier, idx) => (
                  <tr 
                    key={supplier.id}
                    onClick={() => handleOpenSupplier360(supplier)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Cột 1: STT */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Cột 2: Mã NCC (S-YYMMDDXX) */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-200/70 inline-block shadow-2xs">
                        {supplier.code || `S-2608200${idx + 1}`}
                      </span>
                    </td>

                    {/* Cột 3: Thông Tin PIC (Tên + Chức vụ subtext) */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={(e) => handleOpenSupplier360(supplier, e)}
                        className="text-left font-extrabold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer block text-xs"
                        title="Bấm để xem Profile chi tiết của PIC nhà cung cấp"
                      >
                        <span>{supplier.contactPerson || 'Chưa cập nhật'}</span>
                      </button>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {supplier.contactRole || (supplier.contactPerson === 'Minh Tran' ? 'Key Account Manager' : supplier.contactPerson === 'Le Quoc Bao' ? 'Pricing & Sales Lead' : supplier.contactPerson === 'Thanh Vo' ? 'Operations Manager' : 'Chuyên viên Báo giá & Điều hành')}
                      </div>
                    </td>

                    {/* Cột 4: Công Ty (Tên công ty + MST) */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {supplier.name}
                      </div>
                      {supplier.taxId ? (
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          MST: {supplier.taxId}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic mt-0.5">
                          MST: Đang cập nhật
                        </div>
                      )}
                    </td>

                    {/* Cột 5: Dịch Vụ Cung Cấp (Hiển thị đầy đủ tất cả các dịch vụ đã tick chọn) */}
                    <td className="py-4 px-4 max-w-sm">
                      <div className="flex flex-wrap gap-1">
                        {supplier.services.map((srv) => (
                          <span key={srv} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Cột 6: Nguồn */}
                    <td className="py-4 px-4">
                      {renderSourceBadge(supplier)}
                    </td>

                    {/* Cột 7: Số Lượng Báo Giá (Tính theo số báo giá cho Inquiry của Customer này) */}
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        id={`supplier-quotes-btn-${supplier.id}`}
                        onClick={(e) => handleViewSupplierInquiries(supplier, e)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 font-bold text-xs border border-slate-200 hover:border-indigo-300 transition-all hover:scale-105 shadow-2xs cursor-pointer"
                        title={`Bấm để xem các Inquiries của bạn mà ${supplier.name} đã gửi báo giá`}
                      >
                        <span>{getSupplierQuoteCountForCustomer(supplier)} báo giá</span>
                      </button>
                    </td>

                    {/* Cột 8: Thao Tác (360 View) */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenSupplier360(supplier)}
                          className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          360° View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => handleOpenSupplier360(supplier)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Source Badge & Category */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  {renderSourceBadge(supplier)}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] border shrink-0 ${getCategoryBadge(supplier.category)}`}>
                    {supplier.category}
                  </span>
                </div>

                {/* Company Logo & Name */}
                <div className="flex items-start gap-3 my-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 font-black text-base flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                    {supplier.logo || 'VT'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {supplier.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{supplier.tagline}</p>
                    
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      {supplier.taxId && (
                        <span className="font-mono text-slate-500">MST: {supplier.taxId}</span>
                      )}
                      <span className="text-slate-300">•</span>
                      {supplier.hasFlexGoAccount !== false ? (
                        <span className="text-emerald-600 font-semibold text-[10px] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold text-[10px] flex items-center gap-0.5">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Ngoại sàn</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services & Routes */}
                <div className="my-3 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {supplier.services.map((srv) => (
                      <span key={srv} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {srv}
                      </span>
                    ))}
                  </div>

                  {supplier.preferredRoutes && supplier.preferredRoutes.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <ArrowRight className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{supplier.preferredRoutes[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Bottom: Contact & Actions */}
              <div className="pt-3 border-t border-slate-100 mt-2 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{supplier.contactPerson}</span>
                  <span className="font-bold text-slate-700">{supplier.contactPhone}</span>
                </div>

                <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenSupplier360(supplier)}
                    className="py-2 px-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Hồ Sơ 360°
                  </button>

                  <button
                    onClick={() => onOpenCreateInquiry(supplier.id)}
                    className="py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Tạo RFQ</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 360 Drawer Component */}
      <Supplier360Drawer
        supplier={selectedSupplierFor360}
        isOpen={is360DrawerOpen}
        onClose={() => {
          setIs360DrawerOpen(false);
          setSelectedSupplierFor360(null);
        }}
        onOpenCreateInquiry={onOpenCreateInquiry}
        onNavigate={onNavigate}
      />

      {/* Add Current Supplier Modal */}
      <AddCurrentSupplierModal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        onAddSupplier={handleAddCurrentSupplier}
      />
    </div>
  );
};
