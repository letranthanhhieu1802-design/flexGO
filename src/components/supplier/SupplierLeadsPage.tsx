import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  CheckCircle2, 
  ArrowUpDown,
  Table as TableIcon,
  Columns3,
  X,
  Layers
} from 'lucide-react';
import { 
  SupplierLeadItem, 
  LeadStatus, 
  ServiceType, 
  CurrentView,
  UserPersona,
  QuotationItem,
  FlexCreditWallet
} from '../../types';
import { LeadInquiryDetailCard } from '../public/LeadInquiryDetailCard';
import { SupplierLeadCompareModal } from './SupplierLeadCompareModal';

interface SupplierLeadsPageProps {
  leads: SupplierLeadItem[];
  currentUser?: UserPersona;
  quotations?: QuotationItem[];
  wallet?: FlexCreditWallet;
  onOpenCreateQuotation: (lead: SupplierLeadItem) => void;
  onNavigate: (view: CurrentView) => void;
  onToggleSaveLead?: (leadId: string) => void;
  onUnlockLead?: (leadId: string, creditCost?: number) => boolean;
  onDeductCredit?: (amount: number, reason: string) => boolean;
  onSubmitQuotation?: (quote: QuotationItem) => void;
  onIncrementLeadViews?: (leadId: string) => void;
}

type SortField = 'code' | 'createdDate' | 'dueDate' | 'serviceType' | 'estimatedValueVND' | 'quotesCount' | 'status';
type SortOrder = 'asc' | 'desc';

export const SupplierLeadsPage: React.FC<SupplierLeadsPageProps> = ({
  leads,
  currentUser,
  quotations = [],
  wallet,
  onOpenCreateQuotation,
  onNavigate,
  onToggleSaveLead,
  onUnlockLead,
  onDeductCredit,
  onSubmitQuotation,
  onIncrementLeadViews,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [viewScope, setViewScope] = useState<'ALL' | 'SAVED'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');
  const [expandedLeadIds, setExpandedLeadIds] = useState<Record<string, boolean>>({});
  const [unlockedLeadIds, setUnlockedLeadIds] = useState<Record<string, boolean>>({});
  const [activeCompareModalLead, setActiveCompareModalLead] = useState<SupplierLeadItem | null>(null);
  const [unlockToastMessage, setUnlockToastMessage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Read URL query params on mount (e.g. ?inquiry=INQ-xxxxx or ?rfq=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const inqParam = params.get('inquiry') || params.get('rfq') || params.get('code') || params.get('search');
      if (inqParam) {
        setSearchTerm(inqParam);
        const targetLead = leads.find((l) =>
          l.code.toLowerCase().includes(inqParam.toLowerCase()) ||
          (l.inquiryCode && l.inquiryCode.toLowerCase().includes(inqParam.toLowerCase()))
        );
        if (targetLead) {
          setExpandedLeadIds((prev) => ({ ...prev, [targetLead.id]: true }));
        }
      }
    }
  }, [leads]);

  const savedCount = leads.filter((l) => l.isSaved).length;

  const toggleExpandLead = (leadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedLeadIds((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
    if (onIncrementLeadViews) {
      onIncrementLeadViews(leadId);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Masking helpers
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

  const handleUnlockLead = (lead: SupplierLeadItem) => {
    const isAlreadyUnlocked = Boolean(unlockedLeadIds[lead.id] || lead.isUnlocked);
    if (isAlreadyUnlocked) {
      setActiveCompareModalLead({ ...lead, isUnlocked: true });
      return;
    }

    const creditCost = 50;
    const leadTitle = `${lead.code} - ${lead.customerCompany}`;
    
    if (onUnlockLead) {
      const success = onUnlockLead(lead.id, creditCost);
      if (!success) {
        if (onNavigate) onNavigate({ type: 'workspace', view: 'flexcredit-add' });
        return;
      }
    } else if (onDeductCredit) {
      const success = onDeductCredit(creditCost, `Mở khóa SĐT & Ma trận Báo giá (${leadTitle})`);
      if (!success) {
        if (onNavigate) onNavigate({ type: 'workspace', view: 'flexcredit-add' });
        return;
      }
    }
    
    setUnlockedLeadIds((prev) => ({ ...prev, [lead.id]: true }));
    setExpandedLeadIds((prev) => ({ ...prev, [lead.id]: true }));
    const updatedLead = { ...lead, isUnlocked: true };
    setActiveCompareModalLead(updatedLead);
    
    setUnlockToastMessage(`Đã mở khóa thành công ${lead.customerCompany} (-${creditCost} Credits)! Hotline & Ma trận giá đã sẵn sàng.`);
    setTimeout(() => {
      setUnlockToastMessage(null);
    }, 4500);
  };

  const handleOpenCompareModal = (lead: SupplierLeadItem) => {
    const isAlreadyUnlocked = Boolean(unlockedLeadIds[lead.id] || lead.isUnlocked);
    setActiveCompareModalLead({ ...lead, isUnlocked: isAlreadyUnlocked });
  };

  // Click handler trên thẻ Kanban: Chuyển sang Table View và mở rộng chi tiết của Lead đó
  const handleKanbanCardClick = (lead: SupplierLeadItem) => {
    setViewMode('TABLE');
    setExpandedLeadIds((prev) => ({ ...prev, [lead.id]: true }));
    if (onIncrementLeadViews) {
      onIncrementLeadViews(lead.id);
    }
    setTimeout(() => {
      const rowEl = document.getElementById(`supplier-lead-row-${lead.code}`);
      if (rowEl) {
        rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
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
  const getOperationModeDisplay = (lead: SupplierLeadItem) => {
    const sType = lead.serviceType;
    const specs = lead.serviceSpecs || lead.inquiry?.serviceSpecs;
    const textContext = `${lead.inquiry?.title || ''} ${lead.volumeDisplay || ''} ${lead.cargoDetails || ''} ${lead.contractTerm || ''}`.toLowerCase();

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
      const tradeRole = (specs?.customs?.tradeRole || lead.inquiry?.tradeRole || textContext).toLowerCase();
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

  // Helper Badge Style cho Trạng thái Lead (Thêm Lost)
  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Quoted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusDisplay = (status: LeadStatus) => {
    switch (status) {
      case 'Open':
        return 'Open';
      case 'Quoted':
        return 'Quoted';
      case 'Won':
        return 'Won';
      case 'Lost':
        return 'Lost';
      case 'Closed':
        return 'Closed';
      default:
        return status;
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    if (viewScope === 'SAVED' && !l.isSaved) return false;

    const matchesSearch =
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.cargoDetails.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || l.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Sorting
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aVal: any = a[sortField as keyof SupplierLeadItem] || '';
    let bVal: any = b[sortField as keyof SupplierLeadItem] || '';

    if (sortField === 'estimatedValueVND') {
      aVal = a.estimatedValueVND || 0;
      bVal = b.estimatedValueVND || 0;
    } else if (sortField === 'quotesCount') {
      aVal = a.quotesCount || 0;
      bVal = b.quotesCount || 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Nhóm danh sách Lead theo các cột trạng thái cho Kanban
  const kanbanColumns: { status: LeadStatus; title: string; color: string; bg: string; border: string; badgeBg: string }[] = [
    { status: 'Open', title: 'Open (Đang mở)', color: 'text-blue-700', bg: 'bg-blue-50/50', border: 'border-blue-200', badgeBg: 'bg-blue-100 text-blue-800' },
    { status: 'Quoted', title: 'Quoted (Đã gửi giá)', color: 'text-purple-700', bg: 'bg-purple-50/50', border: 'border-purple-200', badgeBg: 'bg-purple-100 text-purple-800' },
    { status: 'Won', title: 'Won (Thắng thầu)', color: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-emerald-200', badgeBg: 'bg-emerald-100 text-emerald-800' },
    { status: 'Lost', title: 'Lost (Trượt thầu)', color: 'text-rose-700', bg: 'bg-rose-50/50', border: 'border-rose-200', badgeBg: 'bg-rose-100 text-rose-800' },
    { status: 'Closed', title: 'Closed (Đã đóng)', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', badgeBg: 'bg-slate-200 text-slate-800' },
  ];

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200 space-y-5">
      {/* Toast Notification */}
      {unlockToastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{unlockToastMessage}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>Supplier Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-600">My Leads</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cơ Hội Vận Tải Của Tôi (My Leads)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý, phân loại các tuyến vận tải đã lưu từ sàn Lead Board. Click vào bất kỳ thẻ hoặc dòng lead để mở xem chi tiết và thực hiện báo giá.
          </p>
        </div>
      </div>

      {/* Quick Summary Counts - 6 Cards (Total, Open, Quoted, Won, Lost, Closed) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total */}
        <div 
          onClick={() => { setStatusFilter('ALL'); setViewScope('ALL'); }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'ALL' && viewScope === 'ALL' ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500">Tất cả Leads</span>
          <p className="text-xl font-black text-slate-900 mt-1">{leads.length}</p>
        </div>

        {/* Open */}
        <div 
          onClick={() => { setStatusFilter('Open'); setViewScope('ALL'); }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Open' ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Đang mở (Open)</span>
          </span>
          <p className="text-xl font-black text-blue-600 mt-1">
            {leads.filter((l) => l.status === 'Open').length}
          </p>
        </div>

        {/* Quoted */}
        <div 
          onClick={() => { setStatusFilter('Quoted'); setViewScope('ALL'); }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Quoted' ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Đã báo giá</span>
          </span>
          <p className="text-xl font-black text-purple-600 mt-1">
            {leads.filter((l) => l.status === 'Quoted').length}
          </p>
        </div>

        {/* Won */}
        <div 
          onClick={() => { setStatusFilter('Won'); setViewScope('ALL'); }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Won' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Thắng thầu (Won)</span>
          </span>
          <p className="text-xl font-black text-emerald-600 mt-1">
            {leads.filter((l) => l.status === 'Won').length}
          </p>
        </div>

        {/* Lost */}
        <div 
          onClick={() => { setStatusFilter('Lost'); setViewScope('ALL'); }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Lost' ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Trượt thầu (Lost)</span>
          </span>
          <p className="text-xl font-black text-rose-600 mt-1">
            {leads.filter((l) => l.status === 'Lost').length}
          </p>
        </div>

        {/* Closed */}
        <div 
          onClick={() => { setStatusFilter('Closed'); setViewScope('ALL'); }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Closed' ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/20 shadow-xs' : 'bg-white border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Đã đóng (Closed)</span>
          </span>
          <p className="text-xl font-black text-slate-600 mt-1">
            {leads.filter((l) => l.status === 'Closed').length}
          </p>
        </div>
      </div>

      {/* Search, Scope, Service, Status and View Mode Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="supplier-leads-search-input"
            type="text"
            placeholder="Tìm theo Mã ID (FG-...), chủ hàng, tuyến đường, hàng hóa..."
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

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Scope Toggle (Tất cả / Đã lưu) */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewScope('ALL')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewScope === 'ALL'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả Leads ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setViewScope('SAVED')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewScope === 'SAVED'
                  ? 'bg-amber-50 text-amber-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Đã lưu ({savedCount})</span>
            </button>
          </div>

          {/* Service Filter */}
          <select
            id="supplier-lead-service-select"
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

          {/* Status Filter (Chỉ áp dụng khi xem Table) */}
          {viewMode === 'TABLE' && (
            <select
              id="supplier-lead-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Tất cả Trạng thái</option>
              <option value="Open">Open</option>
              <option value="Quoted">Quoted</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
              <option value="Closed">Closed</option>
            </select>
          )}

          {/* View Mode Switcher (Bảng vs Kanban) */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              id="view-mode-table-btn"
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'TABLE'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Xem danh sách bảng dữ liệu 11 cột"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Bảng</span>
            </button>
            <button
              type="button"
              id="view-mode-kanban-btn"
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'KANBAN'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Xem ma trận tiến trình Kanban Board"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW CHẾ ĐỘ 1: KANBAN BOARD VIEW (THUẦN VIEW THEO DÕI, CLICK THẺ SẼ CHUYỂN SANG TABLE & MỞ RỘNG) */}
      {viewMode === 'KANBAN' ? (
        <div id="supplier-leads-kanban-board" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
          {kanbanColumns.map((col) => {
            const columnLeads = sortedLeads.filter((l) => l.status === col.status);

            return (
              <div 
                key={col.status}
                className="bg-slate-50/80 rounded-2xl border border-slate-200 p-3 flex flex-col gap-2.5 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col.status === 'Open' ? 'bg-blue-500' :
                      col.status === 'Quoted' ? 'bg-purple-500' :
                      col.status === 'Won' ? 'bg-emerald-500' :
                      col.status === 'Lost' ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
                    <span className={`text-xs font-bold ${col.color}`}>{col.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeBg}`}>
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards List in Column */}
                <div className="space-y-2.5 overflow-y-auto max-h-[640px] pr-0.5 scroll-smooth">
                  {columnLeads.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs italic">
                      Không có lead nào
                    </div>
                  ) : (
                    columnLeads.map((lead) => {
                      const isContract = lead.pricingType === 'CONTRACT';
                      const rawBudgetNum = lead.estimatedValueVND || (lead.estimatedValueDisplay ? parseInt(lead.estimatedValueDisplay.replace(/\D/g, ''), 10) : 0) || 0;
                      const operationMode = getOperationModeDisplay(lead);

                      return (
                        <div
                          key={lead.id}
                          id={`kanban-card-${lead.code}`}
                          onClick={() => handleKanbanCardClick(lead)}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer space-y-2.5 group select-none relative"
                          title="Bấm vào thẻ để chuyển sang Bảng dữ liệu và mở xem chi tiết hồ sơ lead"
                        >
                          {/* 1. Mã ID + Icon bookmark */}
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-indigo-700 text-xs tracking-tight group-hover:text-indigo-600">
                              {lead.code}
                            </span>
                            {lead.isSaved && (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" title="Đã lưu" />
                            )}
                          </div>

                          {/* 2. Nhóm Dịch Vụ + Nhóm Hàng + Mô Hình */}
                          <div className="flex flex-wrap items-center gap-1">
                            <span className={`inline-block px-1.5 py-0.5 rounded-md text-[9.5px] font-bold border ${getServiceBadgeStyle(lead.serviceType)}`}>
                              {lead.serviceType}
                            </span>
                            <span className={`inline-block px-1.5 py-0.5 rounded-md text-[9.5px] font-bold border ${getCargoBadgeStyle(lead.cargoClassification)}`}>
                              {getCargoLabel(lead.cargoClassification)}
                            </span>
                            <span className="inline-block px-1.5 py-0.5 rounded-md text-[9.5px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {operationMode}
                            </span>
                          </div>

                          {/* 3. Tổng Giá Trị */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-400">Tổng giá trị:</span>
                            <div className="text-right">
                              <span className="text-xs font-black text-emerald-700 block tracking-tight">
                                {rawBudgetNum.toLocaleString('vi-VN')}
                              </span>
                              <span className="text-[8.5px] font-semibold text-slate-500 block">
                                {isContract ? 'VNĐ / tháng' : 'VNĐ / lô'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW CHẾ ĐỘ 2: TABLE VIEW 11 CỘT CHUẨN HÓA (1 KHUNG NHÌN) */
        <div 
          id="supplier-leads-data-table-container"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full flex flex-col"
        >
          <div className="overflow-y-auto max-h-[660px] relative scroll-smooth focus:outline-none w-full">
            <table className="w-full text-left border-collapse table-auto" id="supplier-leads-data-table">
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
                  <th 
                    className="py-2.5 px-1.5 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                    onClick={() => handleSort('serviceType')}
                  >
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

                  {/* 9. Trạng Thái (Status - Có Lost) */}
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
                    onClick={() => handleSort('quotesCount')}
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
                {sortedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-16 text-center text-slate-400">
                      <div className="max-w-md mx-auto space-y-2">
                        <p className="font-bold text-slate-700 text-sm">
                          {viewScope === 'SAVED'
                            ? 'Chưa có tuyến vận tải nào được lưu'
                            : 'Không tìm thấy cơ hội vận tải nào phù hợp'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {viewScope === 'SAVED'
                            ? 'Hãy mở thẻ chi tiết Lead và bấm nút Lưu để theo dõi các tuyến tiềm năng.'
                            : 'Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedLeads.map((lead, idx) => {
                    const isExpanded = Boolean(expandedLeadIds[lead.id]);
                    const isUnlocked = Boolean(unlockedLeadIds[lead.id] || lead.isUnlocked);
                    const isContract = lead.pricingType === 'CONTRACT';
                    const operationMode = getOperationModeDisplay(lead);

                    return (
                      <React.Fragment key={lead.id}>
                        <tr
                          id={`supplier-lead-row-${lead.code}`}
                          onClick={() => toggleExpandLead(lead.id)}
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

                          {/* Cột 2: Ngày Đăng & Hạn Nộp */}
                          <td className="py-2.5 px-2 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <span className="text-slate-700 font-semibold block text-[10.5px]">
                                {lead.createdDate}
                              </span>
                              <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                Hạn: {lead.dueDate || '7 ngày'}
                              </span>
                            </div>
                          </td>

                          {/* Cột 3: Mã ID */}
                          <td className="py-2.5 px-2 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-indigo-700 text-xs">
                                {lead.code}
                              </span>
                              {lead.isSaved && (
                                <BookmarkCheck className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" title="Đã lưu" />
                              )}
                            </div>
                          </td>

                          {/* Cột 4: Nhóm Dịch Vụ */}
                          <td className="py-2.5 px-2 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getServiceBadgeStyle(lead.serviceType)}`}>
                              {lead.serviceType}
                            </span>
                          </td>

                          {/* Cột 5: Nhóm Hàng */}
                          <td className="py-2.5 px-1.5 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCargoBadgeStyle(lead.cargoClassification)}`}>
                              {getCargoLabel(lead.cargoClassification)}
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
                                {(lead.estimatedValueVND || (lead.estimatedValueDisplay ? parseInt(lead.estimatedValueDisplay.replace(/\D/g, ''), 10) : 0) || 0).toLocaleString('vi-VN')}
                              </span>
                              <span className="text-[9.5px] font-semibold text-slate-500 block">
                                {isContract ? 'VNĐ / tháng' : 'VNĐ / lô'}
                              </span>
                            </div>
                          </td>

                          {/* Cột 9: Trạng Thái (Status - Có Lost) */}
                          <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeStyle(lead.status)}`}>
                              {getStatusDisplay(lead.status)}
                            </span>
                          </td>

                          {/* Cột 10: Thống Kê Báo Giá & Lượt Xem */}
                          <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                                {lead.quotesCount || 0} báo giá
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium">
                                {lead.viewsCount || 0} xem
                              </span>
                            </div>
                          </td>

                          {/* Cột 11: Thao Tác (Chỉ 1 nút Xem Chi Tiết) */}
                          <td className="py-2.5 px-2 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`toggle-supplier-lead-btn-${lead.code}`}
                              type="button"
                              onClick={(e) => toggleExpandLead(lead.id, e)}
                              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                                isExpanded
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300'
                              }`}
                              title={isExpanded ? 'Thu gọn chi tiết lead' : 'Mở xem chi tiết hồ sơ & thao tác'}
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

                        {/* DÒNG CHI TIẾT EXPANDED (SUPPLIER VIEW: CÓ NÚT BÁO GIÁ, MỞ KHÓA / SO SÁNH ĐỐI THỦ, CHIA SẺ, LƯU) */}
                        {isExpanded && (
                          <tr className="bg-indigo-50/30 border-b border-indigo-100 animate-in fade-in duration-150">
                            <td colSpan={11} className="p-3 sm:p-5">
                              <LeadInquiryDetailCard
                                lead={{ ...lead, isUnlocked }}
                                isUnlocked={isUnlocked}
                                isCustomerView={false}
                                maskCompanyName={maskCompanyName}
                                maskContactPerson={maskContactPerson}
                                onUnlockClick={() => handleUnlockLead(lead)}
                                onOpenCreateQuotation={() => onOpenCreateQuotation(lead)}
                                onToggleSaveLead={(l, e) => onToggleSaveLead && onToggleSaveLead(l.id)}
                                onCompareClick={() => handleOpenCompareModal(lead)}
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
      )}

      {/* Supplier Lead Compare Modal (Ma Trận Đối Thủ) */}
      {activeCompareModalLead && (
        <SupplierLeadCompareModal
          isOpen={Boolean(activeCompareModalLead)}
          lead={activeCompareModalLead}
          isUnlocked={Boolean(unlockedLeadIds[activeCompareModalLead.id] || activeCompareModalLead.isUnlocked)}
          onClose={() => setActiveCompareModalLead(null)}
          onUnlock={() => handleUnlockLead(activeCompareModalLead)}
          onOpenCreateQuotation={() => {
            const l = activeCompareModalLead;
            setActiveCompareModalLead(null);
            onOpenCreateQuotation(l);
          }}
        />
      )}
    </div>
  );
};
