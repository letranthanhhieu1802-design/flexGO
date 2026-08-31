import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  X,
  ArrowUpDown
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

type SortField = 'code' | 'createdDate' | 'expiryDate' | 'serviceType' | 'estimatedValueVND' | 'responsesCount' | 'status';
type SortOrder = 'asc' | 'desc';

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
  const [sortField, setSortField] = useState<SortField>('createdDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    if (initialSupplierFilter || initialSupplierName) {
      setSupplierFilter(initialSupplierFilter || initialSupplierName);
    }
  }, [initialSupplierFilter, initialSupplierName]);

  const toggleExpandInquiry = (inquiryId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedInquiryIds((prev) => ({
      ...prev,
      [inquiryId]: !prev[inquiryId],
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Find active supplier object if available by Supplier Code (S-YYMMDDXX), ID, or Name
  const activeSupplierObj = suppliers.find((s) => {
    const filter = supplierFilter.toLowerCase().trim();
    return (
      (s.code && s.code.toLowerCase() === filter) ||
      s.id.toLowerCase() === filter ||
      s.name.toLowerCase() === filter
    );
  });

  // Check if an inquiry involves the selected supplier (matched by Supplier Code / ID)
  const isInquiryMatchingSupplier = (inq: InquiryItem, filter: string): boolean => {
    if (!filter) return true;
    const lower = filter.toLowerCase().trim();
    const targetSupplierId = activeSupplierObj?.id?.toLowerCase() || lower;
    const targetSupplierCode = activeSupplierObj?.code?.toLowerCase() || lower;

    // 1. Direct match in quotations by supplierId or supplier code
    const matchingQuote = quotations.find((q) => {
      if (q.inquiryCode !== inq.code) return false;
      const qSupplierId = (q.supplierId || '').toLowerCase();
      if (qSupplierId === targetSupplierId || qSupplierId === targetSupplierCode) {
        return true;
      }
      if (activeSupplierObj && q.supplierName && q.supplierName.toLowerCase() === activeSupplierObj.name.toLowerCase()) {
        return true;
      }
      return false;
    });
    if (matchingQuote) return true;

    // 2. Direct match in invitedSuppliers array by Supplier Code or Supplier ID
    if (inq.invitedSuppliers && inq.invitedSuppliers.length > 0) {
      const isInvited = inq.invitedSuppliers.some((nameOrCode) => {
        const lowerVal = nameOrCode.toLowerCase().trim();
        return (
          lowerVal === targetSupplierCode ||
          lowerVal === targetSupplierId ||
          (activeSupplierObj && lowerVal === activeSupplierObj.name.toLowerCase())
        );
      });
      if (isInvited) return true;
    }

    // 3. Match in sourceDetails or awarded contract
    if (activeSupplierObj?.sourceDetails?.inquiryCode === inq.code) {
      return true;
    }

    return false;
  };

  // Convert or merge InquiryItem into a SupplierLeadItem representation for LeadInquiryDetailCard
  const convertInquiryToLead = (inq: InquiryItem): SupplierLeadItem => {
    const matchedLead = leads.find(
      (l) => l.code === inq.code || l.inquiryCode === inq.code || l.code === inq.leadCode
    );

    const isContract = inq.pricingType === 'CONTRACT';
    const rawBudgetNum = parseInt(inq.targetBudget?.replace(/\D/g, '') || '50000000', 10);
    const formattedVND = rawBudgetNum.toLocaleString('vi-VN') + ' ₫';
    const displayTotal = isContract ? `${formattedVND} / tháng` : formattedVND;

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
        unitPriceDisplay: matchedLead.unitPriceDisplay || (isContract ? `${Math.round(rawBudgetNum / 20).toLocaleString('vi-VN')} ₫ / chuyến` : formattedVND),
        estimatedValueVND: matchedLead.estimatedValueVND || rawBudgetNum,
        estimatedValueDisplay: matchedLead.estimatedValueDisplay || displayTotal,
        createdDate: inq.createdDate || matchedLead.createdDate,
        dueDate: inq.expiryDate || inq.pickupDate || matchedLead.dueDate,
        status: (inq.status === 'Awarded' ? 'Won' : inq.status) as any,
        quotesCount: inq.responsesCount ?? matchedLead.quotesCount,
        viewsCount: inq.viewsCount ?? matchedLead.viewsCount,
        isUnlocked: true,
        inquiry: inq,
      };
    }

    return {
      id: `lead-from-${inq.id}`,
      code: inq.code,
      customerCompany: inq.customerCompany || 'ABC Manufacturing Co., Ltd.',
      contactName: inq.contactPerson || 'Lê Trần Thanh Hiếu',
      contactRole: 'Procurement Specialist',
      contactPhone: '0908 123 456',
      contactEmail: 'procurement@shipper-logistics.vn',
      taxId: '0314892831',
      serviceType: inq.serviceType,
      origin: inq.origin,
      destination: inq.destination,
      route: inq.title || `${inq.origin.split('(')[0].trim()} → ${inq.destination.split('(')[0].trim()}`,
      pricingType: inq.pricingType || 'SPOT',
      contractTerm: inq.contractTerm || (isContract ? 'Hợp đồng 12 tháng' : 'Theo lô / Chuyến lẻ'),
      volumeDisplay: inq.weightVolume || '15 Tấn (52 CBM)',
      unitPriceVND: isContract ? Math.round(rawBudgetNum / 20) : rawBudgetNum,
      unitPriceDisplay: isContract ? `${Math.round(rawBudgetNum / 20).toLocaleString('vi-VN')} ₫ / chuyến` : formattedVND,
      estimatedValueVND: rawBudgetNum,
      estimatedValueDisplay: displayTotal,
      createdDate: inq.createdDate,
      dueDate: inq.expiryDate || inq.pickupDate || 'Sep 10, 2026',
      status: (inq.status === 'Awarded' ? 'Won' : inq.status) as any,
      inquiryCode: inq.code,
      cargoDetails: inq.cargoType || 'Linh kiện thiết bị công nghiệp',
      urgency: 'Standard',
      matchScore: 96,
      quotesCount: inq.responsesCount,
      viewsCount: inq.viewsCount || (inq.responsesCount * 6 + 18),
      isUnlocked: true,
      isSaved: false,
      cargoClassification: inq.cargoClassification,
      packaging: inq.packaging,
      requestedSurcharges: inq.requestedSurcharges,
      selectedVAS: inq.selectedVAS,
      serviceSpecs: inq.serviceSpecs,
      inquiry: inq,
    };
  };

  // Helper Badge Style cho Service Group (Phẳng, không icon)
  const getServiceBadgeStyle = (service: ServiceType) => {
    switch (service) {
      case 'Trucking':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Sea Freight (FCL)':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
      case 'Sea Freight (LCL)':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      case 'Air Freight':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Rail Freight':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Cold Chain':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Warehousing':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Customs Clearance':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Cross-border':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Project Cargo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Helper Badge Style cho Phân loại hàng hóa
  const getCargoBadgeStyle = (classification?: string) => {
    switch (classification) {
      case 'Reefer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hazmat':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCargoLabel = (classification?: string) => {
    switch (classification) {
      case 'Reefer':
        return 'Hàng lạnh';
      case 'Hazmat':
        return 'Hàng nguy hiểm';
      default:
        return 'Hàng thường';
    }
  };

  // Helper xác định Hình Thức / Mô Hình dịch vụ theo chuẩn rút gọn
  const getOperationModeDisplay = (inq: InquiryItem) => {
    const sType = inq.serviceType;
    const specs = inq.serviceSpecs;
    const textContext = `${inq.title || ''} ${inq.weightVolume || ''} ${inq.cargoType || ''} ${inq.contractTerm || ''}`.toLowerCase();

    // 1. Đường bộ (Trucking & Cold Chain)
    if (sType === 'Trucking' || sType === 'Cold Chain') {
      const loadType = specs?.trucking?.loadType;
      if (loadType?.includes('LTL') || textContext.includes('ltl') || textContext.includes('hàng ghép') || textContext.includes('ghép hàng')) {
        return 'LTL';
      }
      return 'FTL';
    }

    // 2. Đường biển (Sea Freight FCL & LCL)
    if (sType === 'Sea Freight (FCL)' || sType === 'Sea Freight (LCL)') {
      if (sType === 'Sea Freight (LCL)' || specs?.ocean?.mode?.includes('LCL') || textContext.includes('lcl') || textContext.includes('gom lẻ')) {
        return 'LCL';
      }
      return 'FCL';
    }

    // 3. Hàng không (Air Freight)
    if (sType === 'Air Freight') {
      const isExpress = specs?.air?.airServiceType === 'Express / Courier' || 
                        specs?.air?.serviceLevel?.toLowerCase().includes('priority') ||
                        textContext.includes('express') || 
                        textContext.includes('hỏa tốc') || 
                        textContext.includes('chuyển phát');
      return isExpress ? 'Express' : 'Air Freight';
    }

    // 4. Đường sắt (Rail Freight)
    if (sType === 'Rail Freight') {
      const isLcl = specs?.rail?.mode?.includes('LCL') || textContext.includes('lcl') || textContext.includes('hàng lẻ') || textContext.includes('ghép');
      return isLcl ? 'LCL' : 'FCL';
    }

    // 5. Kho bãi (Warehousing)
    if (sType === 'Warehousing') {
      const whType = (specs?.warehousing?.warehouseType || textContext).toLowerCase();
      if (whType.includes('ngoại quan') || whType.includes('bonded')) return 'Kho ngoại quan';
      if (whType.includes('lạnh') || whType.includes('mát') || whType.includes('cold')) return 'Kho lạnh';
      if (whType.includes('nguy hiểm') || whType.includes('dg') || whType.includes('hóa chất')) return 'Kho hàng nguy hiểm';
      if (whType.includes('fulfillment') || whType.includes('tmđt') || whType.includes('thương mại điện tử')) return 'Kho Fulfillment';
      if (whType.includes('tự quản') || whType.includes('self-storage')) return 'Kho tự quản';
      return 'Kho thường';
    }

    // 6. Thủ tục hải quan (Customs Clearance)
    if (sType === 'Customs Clearance') {
      const tradeRole = (specs?.customs?.tradeRole || inq.tradeRole || textContext).toLowerCase();
      const decType = (specs?.customs?.declarationType || '').toLowerCase();
      if (tradeRole.includes('xuất') || tradeRole.includes('export') || decType.includes('xuất') || decType.includes('b11')) {
        return 'Xuất khẩu';
      }
      return 'Nhập khẩu';
    }

    // 7. Xuyên biên giới (Cross-border)
    if (sType === 'Cross-border') {
      if (textContext.includes('ltl') || textContext.includes('hàng ghép') || textContext.includes('ghép')) {
        return 'LTL';
      }
      return 'FTL';
    }

    // 8. Logistics Dự án (Project Cargo)
    if (sType === 'Project Cargo') {
      const cat = specs?.project?.projectCategory;
      if (cat === 'DISTRIBUTION' || textContext.includes('phân phối')) return 'Phân phối';
      if (cat === 'CROSS_DOCK' || textContext.includes('cross-dock') || textContext.includes('chia chọn')) return 'Cross-dock';
      if (cat === 'PORT_ICD' || textContext.includes('cảng') || textContext.includes('icd') || textContext.includes('con thoi')) return 'Cảng';
      if (cat === 'MULTIMODAL' || textContext.includes('đa phương thức')) return 'Đa phương thức';
      return 'Phân phối';
    }

    return 'FTL';
  };

  // Helper Badge Style cho Trạng thái Inquiry
  const getStatusBadgeStyle = (status: InquiryStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Quoted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Awarded':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusDisplay = (status: InquiryStatus) => {
    switch (status) {
      case 'Open':
        return 'Open';
      case 'Quoted':
        return 'Quoted';
      case 'Awarded':
        return 'Awarded';
      case 'Closed':
        return 'Closed';
    }
  };

  // Filter inquiries
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

  // Sorting
  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    let aVal: any = a[sortField as keyof InquiryItem] || '';
    let bVal: any = b[sortField as keyof InquiryItem] || '';

    if (sortField === 'estimatedValueVND') {
      aVal = parseInt(a.targetBudget?.replace(/\D/g, '') || '0', 10);
      bVal = parseInt(b.targetBudget?.replace(/\D/g, '') || '0', 10);
    } else if (sortField === 'responsesCount') {
      aVal = a.responsesCount || 0;
      bVal = b.responsesCount || 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200 space-y-5">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>Customer Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-600">My Inquiries</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Yêu Cầu Báo Giá Của Tôi (My Inquiries)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý hồ sơ yêu cầu chào giá, theo dõi phản hồi báo giá từ các nhà cung cấp và đối soát Ma trận để Trao thầu.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="create-inquiry-top-btn"
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Yêu Cầu Báo Giá Mới</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'ALL' ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500">Tất cả Yêu cầu</span>
          <p className="text-xl font-black text-slate-900 mt-1">{inquiries.length}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Open')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Open' ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Đang mở chào giá</span>
          </span>
          <p className="text-xl font-black text-blue-600 mt-1">
            {inquiries.filter((i) => i.status === 'Open').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('Quoted')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Quoted' ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Đã có báo giá</span>
          </span>
          <p className="text-xl font-black text-purple-600 mt-1">
            {inquiries.filter((i) => i.status === 'Quoted').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('Awarded')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Awarded' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Đã trao thầu</span>
          </span>
          <p className="text-xl font-black text-emerald-600 mt-1">
            {inquiries.filter((i) => i.status === 'Awarded').length}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('Closed')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Closed' ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Đã đóng / Hết hạn</span>
          </span>
          <p className="text-xl font-black text-slate-600 mt-1">
            {inquiries.filter((i) => i.status === 'Closed').length}
          </p>
        </div>
      </div>

      {/* Active Supplier Filter Banner */}
      {supplierFilter && (
        <div 
          id="active-supplier-filter-banner"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 via-blue-50/50 to-indigo-50/80 border border-indigo-200 rounded-2xl animate-in fade-in duration-200 shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs shrink-0">
              NCC
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-indigo-700">Đang lọc Inquiries theo Mã NCC:</span>
                <span className="font-mono font-bold text-xs text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                  {activeSupplierObj?.code || supplierFilter}
                </span>
                {activeSupplierObj && (
                  <span className="text-xs font-bold text-slate-800">
                    - {activeSupplierObj.name}
                  </span>
                )}
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                  {filteredInquiries.length} inquiries phù hợp
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="clear-supplier-filter-btn"
              onClick={() => setSupplierFilter('')}
              className="px-3 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-950 bg-white hover:bg-indigo-100/70 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <X className="w-3.5 h-3.5 text-indigo-600" />
              <span>Xem tất cả Inquiries</span>
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="inquiries-search-input"
            type="text"
            placeholder="Tìm theo Mã ID (FG-...), tuyến đường, loại hàng hóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Service Filter */}
          <select
            id="inquiry-service-select"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Tất cả Nhóm Dịch Vụ</option>
            <option value="Trucking">Đường bộ</option>
            <option value="Sea Freight (FCL)">Đường biển (FCL)</option>
            <option value="Sea Freight (LCL)">Đường biển (LCL)</option>
            <option value="Air Freight">Hàng không</option>
            <option value="Rail Freight">Đường sắt</option>
            <option value="Cold Chain">Chuỗi lạnh</option>
            <option value="Warehousing">Kho bãi 3PL</option>
            <option value="Customs Clearance">Hải quan</option>
            <option value="Cross-border">Xuyên biên giới</option>
            <option value="Project Cargo">Logistics Dự án</option>
          </select>

          {/* Status Filter */}
          <select
            id="inquiry-status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Tất cả Trạng thái</option>
            <option value="Open">Open</option>
            <option value="Quoted">Quoted</option>
            <option value="Awarded">Awarded</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* MODERN STANDARDIZED 11-COLUMN DATA TABLE (Căn chỉnh 100% trong 1 khung nhìn, không cần cuộn ngang) */}
      <div 
        id="inquiries-data-table-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full flex flex-col"
      >
        <div className="overflow-y-auto max-h-[660px] relative scroll-smooth focus:outline-none w-full">
          <table className="w-full text-left border-collapse table-auto" id="inquiries-data-table">
            {/* Table Header */}
            <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs border-b border-slate-200">
              <tr className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider select-none">
                {/* 1. STT */}
                <th className="py-2.5 px-1.5 w-8 text-center sticky top-0 z-20 bg-slate-100 border-b border-slate-200">STT</th>
                
                {/* 2. Ngày đăng & Hạn */}
                <th 
                  className="py-2.5 px-2 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('createdDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Ngày Đăng / Hạn</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 3. Mã ID */}
                <th 
                  className="py-2.5 px-2 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('code')}
                >
                  <div className="flex items-center gap-1">
                    <span>Mã ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 4. Nhóm Dịch Vụ */}
                <th className="py-2.5 px-2 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                  <span>Nhóm Dịch Vụ</span>
                </th>

                {/* 5. Nhóm Hàng */}
                <th className="py-2.5 px-1.5 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                  <span>Nhóm Hàng</span>
                </th>

                {/* 6. Mô Hình */}
                <th className="py-2.5 px-1.5 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                  <span>Mô Hình</span>
                </th>

                {/* 7. Loại Hợp Đồng */}
                <th className="py-2.5 px-1.5 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                  <span>Loại Hợp Đồng</span>
                </th>

                {/* 8. Tổng Giá Trị */}
                <th 
                  className="py-2.5 px-2 text-right cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('estimatedValueVND')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Tổng Giá Trị</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 9. Trạng Thái (Status) */}
                <th 
                  className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Trạng Thái</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 10. Báo Giá / Lượt Xem */}
                <th 
                  className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                  onClick={() => handleSort('responsesCount')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Báo Giá / Xem</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 11. Thao Tác (Chỉ 1 nút Xem Chi Tiết) */}
                <th className="py-2.5 px-2 text-center whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                  <span>Thao Tác</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedInquiries.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-bold text-slate-700 text-sm">Không tìm thấy yêu cầu báo giá nào phù hợp</p>
                      <p className="text-xs text-slate-400">Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Tạo Yêu Cầu Báo Giá Mới".</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedInquiries.map((inq, idx) => {
                  const isExpanded = Boolean(expandedInquiryIds[inq.id]);
                  const leadRepresentation = convertInquiryToLead(inq);
                  const isContract = inq.pricingType === 'CONTRACT';
                  const rawBudgetNum = parseInt(inq.targetBudget?.replace(/\D/g, '') || '0', 10);
                  const operationMode = getOperationModeDisplay(inq);

                  return (
                    <React.Fragment key={inq.id}>
                      <tr
                        id={`inquiry-row-${inq.code}`}
                        onClick={() => toggleExpandInquiry(inq.id)}
                        className={`transition-colors cursor-pointer select-none ${
                          isExpanded
                            ? 'bg-indigo-50/60 font-medium'
                            : idx % 2 === 0
                            ? 'bg-white hover:bg-slate-50/90'
                            : 'bg-slate-50/40 hover:bg-slate-100/70'
                        }`}
                      >
                        {/* Cột 1: STT */}
                        <td className="py-2.5 px-1.5 text-center text-slate-400 font-mono text-[10.5px]">
                          {idx + 1}
                        </td>

                        {/* Cột 2: Ngày Đăng & Hạn */}
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="text-slate-700 font-semibold block text-[10.5px]">
                              {inq.createdDate}
                            </span>
                            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              Hạn: {inq.expiryDate || inq.pickupDate || '7 ngày'}
                            </span>
                          </div>
                        </td>

                        {/* Cột 3: Mã ID */}
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span className="font-mono font-bold text-indigo-700 text-xs">
                            {inq.code}
                          </span>
                        </td>

                        {/* Cột 4: Nhóm Dịch Vụ */}
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getServiceBadgeStyle(inq.serviceType)}`}>
                            {inq.serviceType}
                          </span>
                        </td>

                        {/* Cột 5: Nhóm Hàng */}
                        <td className="py-2.5 px-1.5 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCargoBadgeStyle(inq.cargoClassification)}`}>
                            {getCargoLabel(inq.cargoClassification)}
                          </span>
                        </td>

                        {/* Cột 6: Mô Hình */}
                        <td className="py-2.5 px-1.5 whitespace-nowrap">
                          <span className="text-slate-800 font-semibold text-xs">
                            {operationMode}
                          </span>
                        </td>

                        {/* Cột 7: Loại Hợp Đồng */}
                        <td className="py-2.5 px-1.5 whitespace-nowrap">
                          {isContract ? (
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              Hợp đồng
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                              Theo lô
                            </span>
                          )}
                        </td>

                        {/* Cột 8: Tổng Giá Trị */}
                        <td className="py-2.5 px-2 text-right whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="text-xs sm:text-[12.5px] font-black text-emerald-700 block tracking-tight">
                              {rawBudgetNum ? rawBudgetNum.toLocaleString('vi-VN') : 'Thỏa thuận'}
                            </span>
                            <span className="text-[9.5px] font-semibold text-slate-500 block">
                              {isContract ? 'VNĐ / tháng' : 'VNĐ / lô'}
                            </span>
                          </div>
                        </td>

                        {/* Cột 9: Trạng Thái (Status) */}
                        <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeStyle(inq.status)}`}>
                            {getStatusDisplay(inq.status)}
                          </span>
                        </td>

                        {/* Cột 10: Thống Kê Báo Giá & Lượt Xem */}
                        <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                              {inq.responsesCount || 0} báo giá
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">
                              {inq.viewsCount || (inq.responsesCount * 6 + 12)} xem
                            </span>
                          </div>
                        </td>

                        {/* Cột 11: Thao Tác (Chỉ 1 nút Xem Chi Tiết) */}
                        <td className="py-2.5 px-2 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            id={`toggle-inquiry-btn-${inq.code}`}
                            type="button"
                            onClick={(e) => toggleExpandInquiry(inq.id, e)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                              isExpanded
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300'
                            }`}
                            title={isExpanded ? 'Thu gọn chi tiết inquiry' : 'Mở xem chi tiết hồ sơ'}
                          >
                            <span>{isExpanded ? 'Đóng' : 'Xem chi tiết'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* DÒNG CHI TIẾT EXPANDED (CUSTOMER VIEW: CÓ COMPARE MATRIX & CHIA SẺ BÊN TRONG) */}
                      {isExpanded && (
                        <tr className="bg-indigo-50/30 border-b border-indigo-100 animate-in fade-in duration-150">
                          <td colSpan={11} className="p-3 sm:p-5">
                            <LeadInquiryDetailCard
                              lead={leadRepresentation}
                              isCustomerView={true}
                              onCompareClick={() => {
                                onNavigate({
                                  type: 'workspace',
                                  view: 'customer-compare',
                                  params: { inquiryCode: inq.code },
                                });
                              }}
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
