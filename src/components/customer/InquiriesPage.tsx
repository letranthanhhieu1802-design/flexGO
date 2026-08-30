import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Truck, 
  Ship, 
  Plane, 
  Train,
  Building2, 
  FileText, 
  Globe,
  ThermometerSnowflake,
  Clock, 
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Eye,
  ExternalLink,
  X,
  Filter,
  Share2,
  Check
} from 'lucide-react';
import { InquiryItem, InquiryStatus, ServiceType, CurrentView, SupplierLeadItem, QuotationItem, SupplierCompany } from '../../types';
import { LeadInquiryDetailCard } from '../public/LeadInquiryDetailCard';

interface InquiriesPageProps {
  inquiries: InquiryItem[];
  leads?: SupplierLeadItem[];
  quotations?: QuotationItem[];
  suppliers?: SupplierCompany[];
  initialSupplierFilter?: string;
  initialSupplierName?: string;
  onOpenCreateModal: () => void;
  onSelectInquiry: (inquiry: InquiryItem | string) => void;
  onNavigate: (view: CurrentView) => void;
}

export const InquiriesPage: React.FC<InquiriesPageProps> = ({
  inquiries,
  leads = [],
  quotations = [],
  suppliers = [],
  initialSupplierFilter = '',
  initialSupplierName = '',
  onOpenCreateModal,
  onSelectInquiry,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [supplierFilter, setSupplierFilter] = useState<string>(initialSupplierFilter || initialSupplierName || '');
  const [expandedInquiryIds, setExpandedInquiryIds] = useState<Record<string, boolean>>({});
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);

  const handleCopyLeadLink = (e: React.MouseEvent, inq: InquiryItem) => {
    e.stopPropagation();
    const leadCode = inq.leadCode || inq.code;
    const url = `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLeadId(inq.id);
    setTimeout(() => setCopiedLeadId(null), 2500);
  };

  useEffect(() => {
    if (initialSupplierFilter || initialSupplierName) {
      setSupplierFilter(initialSupplierFilter || initialSupplierName);
    }
  }, [initialSupplierFilter, initialSupplierName]);

  const toggleExpandInquiry = (inquiryId: string) => {
    setExpandedInquiryIds((prev) => ({
      ...prev,
      [inquiryId]: !prev[inquiryId],
    }));
  };

  // Find active supplier object if available
  const activeSupplierObj = suppliers.find(
    (s) =>
      s.id.toLowerCase() === supplierFilter.toLowerCase() ||
      s.name.toLowerCase() === supplierFilter.toLowerCase()
  );

  // Check if an inquiry involves the selected supplier
  const isInquiryMatchingSupplier = (inq: InquiryItem, filter: string): boolean => {
    if (!filter) return true;
    const lower = filter.toLowerCase().trim();

    // 1. Direct match in quotations
    const matchingQuote = quotations.find((q) => {
      if (q.inquiryCode !== inq.code) return false;
      if (q.supplierId && (q.supplierId.toLowerCase() === lower || (activeSupplierObj && q.supplierId === activeSupplierObj.id))) {
        return true;
      }
      if (q.supplierName && (q.supplierName.toLowerCase() === lower || (activeSupplierObj && q.supplierName.toLowerCase() === activeSupplierObj.name.toLowerCase()) || q.supplierName.toLowerCase().includes(lower))) {
        return true;
      }
      return false;
    });
    if (matchingQuote) return true;

    // 2. Direct match in invitedSuppliers array
    if (inq.invitedSuppliers && inq.invitedSuppliers.length > 0) {
      const isInvited = inq.invitedSuppliers.some(
        (name) =>
          name.toLowerCase() === lower ||
          (activeSupplierObj && name.toLowerCase() === activeSupplierObj.name.toLowerCase()) ||
          name.toLowerCase().includes(lower) ||
          lower.includes(name.toLowerCase())
      );
      if (isInvited) return true;
    }

    // 3. Match in sourceDetails or awarded contract
    if (activeSupplierObj?.sourceDetails?.inquiryCode === inq.code) {
      return true;
    }

    // 4. Text match in inquiry title/description
    if (inq.title.toLowerCase().includes(lower) || inq.description?.toLowerCase().includes(lower)) {
      return true;
    }

    return false;
  };

  // Convert or merge InquiryItem into a SupplierLeadItem representation for LeadInquiryDetailCard
  const convertInquiryToLead = (inq: InquiryItem): SupplierLeadItem => {
    const matchedLead = leads.find(
      (l) =>
        l.inquiryCode === inq.code ||
        l.code === inq.code ||
        l.code.replace('LG-', 'INQ-') === inq.code ||
        (inq.code && l.code.includes(inq.code.replace('INQ-', '')))
    );

    if (matchedLead) {
      return {
        ...matchedLead,
        code: inq.code,
        customerCompany: inq.customerCompany || matchedLead.customerCompany,
        contactName: inq.contactPerson || matchedLead.contactName,
        serviceType: inq.serviceType || matchedLead.serviceType,
        origin: inq.origin || matchedLead.origin,
        destination: inq.destination || matchedLead.destination,
        route: inq.title || matchedLead.route,
        cargoDetails: inq.cargoType || matchedLead.cargoDetails,
        volumeDisplay: inq.weightVolume || matchedLead.volumeDisplay,
        unitPriceDisplay: inq.targetBudget || matchedLead.unitPriceDisplay,
        estimatedValueDisplay: inq.targetBudget || matchedLead.estimatedValueDisplay,
        createdDate: inq.createdDate || matchedLead.createdDate,
        dueDate: inq.expiryDate || inq.pickupDate || matchedLead.dueDate,
        status: (inq.status === 'Awarded' ? 'Won' : inq.status) as any,
        quotesCount: inq.responsesCount ?? matchedLead.quotesCount,
        viewsCount: inq.viewsCount ?? matchedLead.viewsCount,
        isUnlocked: true,
      };
    }

    return {
      id: `lead-from-${inq.id}`,
      code: inq.code,
      customerCompany: inq.customerCompany || 'ABC Manufacturing Co., Ltd.',
      contactName: inq.contactPerson || 'Hieu Le',
      contactRole: 'Procurement Specialist',
      contactPhone: '0908 123 456',
      contactEmail: 'procurement@shipper-logistics.vn',
      taxId: '0314892831',
      serviceType: inq.serviceType,
      origin: inq.origin,
      destination: inq.destination,
      route: `${inq.origin.split('(')[0].trim()} → ${inq.destination.split('(')[0].trim()}`,
      pricingType: 'SPOT',
      contractTerm: 'Chuyến lẻ / Theo nhu cầu',
      volumeDisplay: inq.weightVolume || '15 Tấn (52 CBM)',
      unitPriceVND: 15000000,
      unitPriceDisplay: inq.targetBudget || 'Thỏa thuận',
      estimatedValueVND: 50000000,
      estimatedValueDisplay: inq.targetBudget || 'Thỏa thuận',
      createdDate: inq.createdDate,
      dueDate: inq.expiryDate || inq.pickupDate || 'Aug 30, 2026',
      status: (inq.status === 'Awarded' ? 'Won' : inq.status) as any,
      inquiryCode: inq.code,
      cargoDetails: inq.cargoType || 'Linh kiện thiết bị công nghiệp',
      urgency: 'Standard',
      matchScore: 96,
      quotesCount: inq.responsesCount,
      viewsCount: inq.viewsCount || (inq.responsesCount * 6 + 18),
      isUnlocked: true,
      isSaved: false,
    };
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || inq.serviceType === serviceFilter;
    const matchesSupplier = isInquiryMatchingSupplier(inq, supplierFilter);

    return matchesSearch && matchesStatus && matchesService && matchesSupplier;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      case 'Quoted':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      case 'Awarded':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
    }
  };

  const getServiceIcon = (service: ServiceType) => {
    switch (service) {
      case 'Trucking':
        return <Truck className="w-3.5 h-3.5 text-blue-600" />;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Ship className="w-3.5 h-3.5 text-cyan-600" />;
      case 'Air Freight':
        return <Plane className="w-3.5 h-3.5 text-sky-600" />;
      case 'Rail Freight':
        return <Train className="w-3.5 h-3.5 text-blue-700" />;
      case 'Cold Chain':
        return <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Warehousing':
        return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'Customs Clearance':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      case 'Cross-border':
        return <Globe className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Project Cargo':
        return <Layers className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const statusList: InquiryStatus[] = ['Open', 'Quoted', 'Awarded', 'Closed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb & Context */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Customer Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">Inquiries</span>
      </div>

      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Inquiries</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track all your logistics requirements and supplier quotation responses in one place.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="create-inquiry-top-btn"
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Inquiry</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Counts - 5 Cards (Total + 4 Statuses: Open, Quoted, Awarded, Closed) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-6">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'ALL' ? 'bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-500/20 shadow-xs' : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Total Requirements</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{inquiries.length}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Open')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Open' ? 'bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/20 shadow-xs' : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Open for Quotes</span>
          </span>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {inquiries.filter((i) => i.status === 'Open').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('Quoted')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Quoted' ? 'bg-purple-50/70 border-purple-200 ring-2 ring-purple-500/20 shadow-xs' : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Quoted</span>
          </span>
          <p className="text-xl font-bold text-purple-600 mt-1">
            {inquiries.filter((i) => i.status === 'Quoted').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('Awarded')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Awarded' ? 'bg-emerald-50/70 border-emerald-200 ring-2 ring-emerald-500/20 shadow-xs' : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Awarded</span>
          </span>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {inquiries.filter((i) => i.status === 'Awarded').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('Closed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Closed' ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/20 shadow-xs' : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Closed</span>
          </span>
          <p className="text-xl font-bold text-slate-600 mt-1">
            {inquiries.filter((i) => i.status === 'Closed').length}
          </p>
        </div>
      </div>

      {/* Active Supplier Filter Banner */}
      {supplierFilter && (
        <div 
          id="active-supplier-filter-banner"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 mb-6 bg-gradient-to-r from-indigo-50 via-blue-50/50 to-indigo-50/80 border border-indigo-200 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200 shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-indigo-700">Đang lọc theo Nhà Cung Cấp:</span>
                <span className="text-xs font-bold text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                  {activeSupplierObj?.name || supplierFilter}
                </span>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                  {filteredInquiries.length} inquiries phù hợp
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Hiển thị danh sách các yêu cầu báo giá (Inquiries) có sự tham gia chào giá hoặc được mời trực tiếp của nhà cung cấp này.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="clear-supplier-filter-btn"
              onClick={() => setSupplierFilter('')}
              className="px-3 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-950 bg-white hover:bg-indigo-100/70 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
            >
              <X className="w-3.5 h-3.5 text-indigo-600" />
              <span>Xem tất cả Inquiries</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs mb-6">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="inquiry-search-filter"
            type="text"
            placeholder="Search by ID, route, or cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {/* Supplier Filter Dropdown */}
          {suppliers.length > 0 && (
            <select
              id="inquiry-supplier-select"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className={`px-3 py-2 text-xs font-semibold border rounded-xl focus:outline-hidden transition-colors ${
                supplierFilter
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="">Tất cả Nhà Cung Cấp</option>
              {suppliers.map((supp) => (
                <option key={supp.id} value={supp.name}>
                  {supp.name}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            id="inquiry-status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            {statusList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Service Filter */}
          <select
            id="inquiry-service-select"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Service Types</option>
            <option value="Trucking">Trucking (Đường bộ)</option>
            <option value="Sea Freight (FCL)">Sea Freight FCL (Đường biển)</option>
            <option value="Sea Freight (LCL)">Sea Freight LCL (Hàng lẻ CFS)</option>
            <option value="Air Freight">Air Freight (Hàng không)</option>
            <option value="Rail Freight">Rail Freight (Đường sắt)</option>
            <option value="Cold Chain">Cold Chain (Chuỗi lạnh)</option>
            <option value="Warehousing">Warehousing (Kho bãi 3PL)</option>
            <option value="Customs Clearance">Customs Clearance (Hải quan)</option>
            <option value="Cross-border">Cross-border (Xuyên biên giới)</option>
            <option value="Project Cargo">Project Cargo (Hàng dự án / OOG)</option>
          </select>
        </div>
      </div>

      {/* Modern Data Table */}
      <div 
        id="inquiries-data-table-container"
        className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Title / Route</th>
                <th className="p-4">Service</th>
                <th className="p-4">Ngày đăng</th>
                <th className="p-4">Ngày hết hạn</th>
                <th className="p-4">Status</th>
                <th className="p-4">Quotes</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const isExpanded = Boolean(expandedInquiryIds[inq.id]);
                  const leadRepresentation = convertInquiryToLead(inq);

                  return (
                    <React.Fragment key={inq.id}>
                      <tr
                        id={`inquiry-row-${inq.code}`}
                        onClick={() => toggleExpandInquiry(inq.id)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded
                            ? 'bg-indigo-50/40 hover:bg-indigo-50/60 font-medium'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-4 font-mono text-indigo-700 font-bold text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                            </span>
                            <span>{inq.code}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-900">
                            {inq.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {inq.origin.split('(')[0]} → {inq.destination.split('(')[0]} • {inq.cargoType} ({inq.weightVolume})
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                            {getServiceIcon(inq.serviceType)}
                            <span>{inq.serviceType}</span>
                          </span>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{inq.createdDate}</span>
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="font-semibold">{inq.expiryDate || inq.pickupDate}</span>
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                inq.status === 'Open'
                                  ? 'bg-blue-500'
                                  : inq.status === 'Quoted'
                                  ? 'bg-purple-500'
                                  : inq.status === 'Awarded'
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span className={`px-2 py-0.5 rounded-md text-xs border ${getStatusBadge(inq.status)}`}>
                              {inq.status}
                            </span>
                          </span>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                inq.responsesCount > 0
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {inq.responsesCount > 0 ? `${inq.responsesCount} Quotes` : '0 Quotes'}
                            </span>
                            <div 
                              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 text-xs font-medium"
                              title={`${inq.viewsCount ?? (inq.responsesCount * 6 + 12)} lượt nhà xe đã xem yêu cầu`}
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-semibold text-slate-600">{inq.viewsCount ?? (inq.responsesCount * 6 + 12)}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`share-lead-btn-${inq.code}`}
                              type="button"
                              onClick={(e) => handleCopyLeadLink(e, inq)}
                              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                copiedLeadId === inq.id
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                              }`}
                              title={copiedLeadId === inq.id ? 'Đã sao chép link Lead Board!' : `Sao chép link Lead Board (Mã Lead: ${inq.leadCode || inq.code})`}
                            >
                              {copiedLeadId === inq.id ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              id={`compare-matrix-btn-${inq.code}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate({
                                  type: 'workspace',
                                  view: 'customer-compare',
                                  params: { inquiryCode: inq.code },
                                });
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/90 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                              title={`So sánh báo giá của ${inq.code}`}
                            >
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>Compare Matrix</span>
                            </button>

                            <button
                              type="button"
                              id={`toggle-expand-btn-${inq.code}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandInquiry(inq.id);
                              }}
                              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                isExpanded
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                              }`}
                              title={isExpanded ? 'Thu gọn chi tiết' : 'Xem chi tiết yêu cầu kỹ thuật'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* DÒNG CHI TIẾT EXPANDED (DÀNH CHO CUSTOMER WORKSPACE - CHỈ HIỂN THỊ YÊU CẦU DỊCH VỤ, ẨN THÔNG TIN LIÊN HỆ & NÚT BÁO GIÁ/MỞ KHÓA/LƯU LEAD) */}
                      {isExpanded && (
                        <tr className="bg-indigo-50/30 border-b border-indigo-100 animate-in fade-in duration-150">
                          <td colSpan={8} className="p-3 sm:p-5">
                            <LeadInquiryDetailCard
                              lead={leadRepresentation}
                              isCustomerView={true}
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
      </div>
    </div>
  );
};
