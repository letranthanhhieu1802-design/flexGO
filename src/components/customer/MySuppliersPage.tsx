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
  CurrentView 
} from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { Supplier360Drawer } from './Supplier360Drawer';
import { AddCurrentSupplierModal } from './AddCurrentSupplierModal';

interface MySuppliersPageProps {
  suppliers: SupplierCompany[];
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: (supplierId?: string) => void;
  onAddSupplier?: (supplier: SupplierCompany) => void;
}

export const MySuppliersPage: React.FC<MySuppliersPageProps> = ({
  suppliers: initialSuppliers,
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

  // Navigate to My Inquiries filtered by this supplier
  const handleViewSupplierInquiries = (supplier: SupplierCompany, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onNavigate({
      type: 'workspace',
      view: 'customer-inquiries',
      params: {
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs whitespace-nowrap">
            <Trophy className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Awarded</span>
          </span>
        );

      case 'DIRECT_PROFILE_REQUEST':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs whitespace-nowrap">
            <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Direct RFQ</span>
          </span>
        );

      case 'CURRENT_SUPPLIER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs whitespace-nowrap">
            <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Current Supplier</span>
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Customer Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">My Suppliers (CRM Mạng Lưới Nhà Cung Cấp)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Suppliers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tập trung mạng lưới nhà cung cấp từ 3 nguồn: <strong>Trao thầu Báo giá</strong>, <strong>Yêu cầu Profile Trực tiếp</strong> và <strong>Current Supplier (Khai báo giá vận hành)</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-wrap">
          <button
            id="declare-current-supplier-btn"
            onClick={() => setIsAddSupplierModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-sky-600" />
            <span>+ Khai Báo Current Supplier</span>
          </button>

          <button
            id="browse-public-suppliers-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Danh Bạ Nhà Xe Công Khai</span>
          </button>

          <button
            id="create-rfq-for-suppliers-btn"
            onClick={() => onOpenCreateInquiry()}
            className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Supplier RFQ</span>
          </button>
        </div>
      </div>

      {/* 3 Supplier Sourcing & Acquisition Channels Explanation Banner */}
      <div className="my-6 p-4.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 rounded-md border border-indigo-400/30">
                Supplier Sourcing Engine
              </span>
              <span className="text-xs text-indigo-200 font-semibold">3 Nguồn Nhà Cung Cấp Vận Tải: Awarded • Direct RFQ • Current Supplier</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Mạng lưới nhà cung cấp được tổng hợp từ các báo giá trúng thầu (Awarded), yêu cầu chào giá 1-1 qua hồ sơ (Direct RFQ), và các nhà cung cấp tự khai báo (Current Supplier).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center shrink-0">
            {/* Awarded */}
            <div 
              onClick={() => setSourceFilter(sourceFilter === 'AWARDED_QUOTE' ? 'ALL' : 'AWARDED_QUOTE')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                sourceFilter === 'AWARDED_QUOTE' 
                  ? 'bg-indigo-500/30 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400/40' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-300">
                <Trophy className="w-3 h-3 text-indigo-400" />
                <span>Awarded</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{awardedCount}</p>
            </div>

            {/* Direct Profile */}
            <div 
              onClick={() => setSourceFilter(sourceFilter === 'DIRECT_PROFILE_REQUEST' ? 'ALL' : 'DIRECT_PROFILE_REQUEST')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                sourceFilter === 'DIRECT_PROFILE_REQUEST' 
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-300">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Direct RFQ</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{directProfileCount}</p>
            </div>

            {/* Current Supplier */}
            <div 
              onClick={() => setSourceFilter(sourceFilter === 'CURRENT_SUPPLIER' ? 'ALL' : 'CURRENT_SUPPLIER')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                sourceFilter === 'CURRENT_SUPPLIER' 
                  ? 'bg-sky-500/30 border-sky-400 text-sky-200 ring-2 ring-sky-400/40' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-sky-300">
                <FileText className="w-3 h-3 text-sky-400" />
                <span>Current Supplier</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{currentSupplierCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Nhà Cung Cấp</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Toàn bộ đối tác vận tải</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Awarded</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{awardedCount}</p>
            <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Trao thầu từ Inquiry</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Direct RFQ</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{directProfileCount}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Yêu cầu báo giá 1-1</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Current Supplier</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{currentSupplierCount}</p>
            <p className="text-[11px] text-sky-600 font-medium mt-0.5">Khai báo giá vận hành</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <FileText className="w-6 h-6" />
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
                  <th className="py-3.5 px-4">Nhà Cung Cấp</th>
                  <th className="py-3.5 px-4">MST</th>
                  <th className="py-3.5 px-4">Nguồn</th>
                  <th className="py-3.5 px-4">Dịch Vụ Cung Cấp</th>
                  <th className="py-3.5 px-4">Trụ Sở</th>
                  <th className="py-3.5 px-4">Thông Tin PIC</th>
                  <th className="py-3.5 px-4 text-center">Số Lượng Báo Giá</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSuppliers.map((supplier) => (
                  <tr 
                    key={supplier.id}
                    onClick={() => handleOpenSupplier360(supplier)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Cột 1: Nhà Cung Cấp */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {supplier.name}
                      </span>
                    </td>

                    {/* Cột 2: MST */}
                    <td className="py-4 px-4">
                      {supplier.taxId ? (
                        <span className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-1 rounded-md text-xs border border-slate-200">
                          {supplier.taxId}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">---</span>
                      )}
                    </td>

                    {/* Cột 3: Nguồn */}
                    <td className="py-4 px-4">
                      {renderSourceBadge(supplier)}
                    </td>

                    {/* Cột 4: Dịch Vụ Cung Cấp */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {supplier.services.slice(0, 3).map((srv) => (
                          <span key={srv} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {srv}
                          </span>
                        ))}
                        {supplier.services.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-bold">
                            +{supplier.services.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Cột 5: Trụ Sở */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]" title={supplier.headquartersAddress || supplier.hubLocations[0]}>
                          {supplier.headquartersAddress && supplier.headquartersAddress !== 'Đang cập nhật'
                            ? supplier.headquartersAddress
                            : supplier.hubLocations[0] || 'Toàn quốc'}
                        </span>
                      </div>
                    </td>

                    {/* Cột 6: Thông Tin PIC */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={(e) => handleOpenSupplier360(supplier, e)}
                        className="text-left font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 group/pic"
                        title="Bấm để xem Profile chi tiết của PIC nhà cung cấp"
                      >
                        <span className="group-hover/pic:underline">{supplier.contactPerson || 'Chưa cập nhật'}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover/pic:text-indigo-600 transition-colors opacity-0 group-hover/pic:opacity-100" />
                      </button>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 font-medium">{supplier.contactPhone || supplier.contactEmail}</span>
                        {supplier.contactPhone && (
                          <button
                            onClick={(e) => copyToClipboard(supplier.contactPhone, `phone-${supplier.id}`, e)}
                            title="Sao chép SĐT"
                            className="p-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                          >
                            {copiedKey === `phone-${supplier.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Cột 7: Số Lượng Báo Giá */}
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        id={`supplier-quotes-btn-${supplier.id}`}
                        onClick={(e) => handleViewSupplierInquiries(supplier, e)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 font-bold text-xs border border-slate-200 hover:border-indigo-300 transition-all hover:scale-105 shadow-2xs cursor-pointer group/quoteBtn"
                        title={`Bấm để xem các Inquiries mà ${supplier.name} đã tham gia gửi báo giá`}
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600 group-hover/quoteBtn:scale-110 transition-transform" />
                        <span>{supplier.inquiriesHandledCount ?? (supplier.source === 'AWARDED_QUOTE' ? 3 : 1)} báo giá</span>
                      </button>
                    </td>

                    {/* Cột 8: Thao Tác (360 View) */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenSupplier360(supplier)}
                          className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>360° View</span>
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
