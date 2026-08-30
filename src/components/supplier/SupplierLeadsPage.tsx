import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Building2, 
  Truck, 
  Ship, 
  Plane, 
  Sparkles, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Zap,
  Bookmark,
  BookmarkCheck,
  Star,
  Eye,
  KeyRound,
  ExternalLink,
  Unlock,
  Coins,
  ShieldCheck,
  X
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
  const [viewScope, setViewScope] = useState<'ALL' | 'SAVED'>('ALL');
  const [expandedLeadIds, setExpandedLeadIds] = useState<Record<string, boolean>>({});
  const [unlockedLeadIds, setUnlockedLeadIds] = useState<Record<string, boolean>>({});
  const [leadToUnlockConfirm, setLeadToUnlockConfirm] = useState<SupplierLeadItem | null>(null);
  const [activeCompareModalLead, setActiveCompareModalLead] = useState<SupplierLeadItem | null>(null);
  const [unlockToastMessage, setUnlockToastMessage] = useState<string | null>(null);

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

  const toggleExpandLead = (leadId: string) => {
    setExpandedLeadIds((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
    if (onIncrementLeadViews) {
      onIncrementLeadViews(leadId);
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
    setTimeout(() => {
      setUnlockToastMessage(null);
    }, 4500);

    return true;
  };

  const filteredLeads = leads.filter((l) => {
    // Scope filter (All vs Saved)
    if (viewScope === 'SAVED' && !l.isSaved) {
      return false;
    }

    const matchesSearch =
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.cargoDetails.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
      case 'Quoted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold';
      case 'Won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
      default:
        return <Zap className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {unlockToastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{unlockToastMessage}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Supplier Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">My Leads</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Leads</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý, phân loại các tuyến vận tải đã lưu từ sàn Lead Board. Click vào từng dòng lead để xem hồ sơ chi tiết và gửi báo giá.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="supplier-pipeline-btn"
            onClick={() => onNavigate({ type: 'workspace', view: 'supplier-pipeline' })}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Kanban Pipeline</span>
          </button>
          <button
            id="browse-public-leads-btn"
            onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
            className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Sàn Public Lead Board</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div 
          id="kpi-saved-leads-btn"
          onClick={() => {
            setViewScope('SAVED');
            setStatusFilter('ALL');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            viewScope === 'SAVED'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-amber-50/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Tuyến Đã Lưu (Saved)</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">{savedCount}</p>
          <span className="text-[11px] text-amber-700/80 mt-0.5 block">Đang cân nhắc báo giá</span>
        </div>

        <div 
          onClick={() => {
            setViewScope('ALL');
            setStatusFilter('Open');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            viewScope === 'ALL' && statusFilter === 'Open'
              ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-400 shadow-xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Open Leads</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {leads.filter((l) => l.status === 'Open').length}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Chưa gửi báo giá</span>
        </div>

        <div 
          onClick={() => {
            setViewScope('ALL');
            setStatusFilter('Quoted');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            viewScope === 'ALL' && statusFilter === 'Quoted'
              ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-400 shadow-xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Quoted</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {leads.filter((l) => l.status === 'Quoted').length}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Đã gửi báo giá</span>
        </div>

        <div 
          onClick={() => {
            setViewScope('ALL');
            setStatusFilter('Won');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            viewScope === 'ALL' && statusFilter === 'Won'
              ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-400 shadow-xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Won Deals</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {leads.filter((l) => l.status === 'Won').length} Deals
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Khách hàng chọn</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="leads-search-input"
            type="text"
            placeholder="Tìm theo Mã Lead, Chủ hàng, Tuyến đường, Hàng hóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-1 md:pb-0">
          {/* Scope Segment (All vs Saved) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              id="scope-all-leads-btn"
              onClick={() => setViewScope('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewScope === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tất cả Leads ({leads.length})
            </button>
            <button
              type="button"
              id="scope-saved-leads-btn"
              onClick={() => setViewScope('SAVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewScope === 'SAVED'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Đã lưu ({savedCount})</span>
            </button>
          </div>

          {/* Status Filter */}
          <select
            id="leads-status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden cursor-pointer shrink-0"
          >
            <option value="ALL">All Statuses (Tất cả)</option>
            <option value="Open">Open (Chưa báo giá)</option>
            <option value="Quoted">Quoted (Đã báo giá)</option>
            <option value="Won">Won (Trúng thầu)</option>
            <option value="Lost">Lost (Trượt thầu)</option>
            <option value="Closed">Closed (Hết hạn)</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div 
        id="supplier-leads-table-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">Lưu</th>
                <th className="py-3.5 px-4">Lead ID</th>
                <th className="py-3.5 px-4">Customer & Contact</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Route</th>
                <th className="py-3.5 px-4">Estimated Value</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
                        <Bookmark className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {viewScope === 'SAVED'
                          ? 'Chưa có tuyến tiềm năng nào được lưu'
                          : 'Không tìm thấy cơ hội phù hợp'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {viewScope === 'SAVED'
                          ? 'Hãy truy cập Sàn Lead Board, click biểu tượng Bookmark để lưu lại các tuyến tiềm năng cân nhắc báo giá.'
                          : 'Thử thay đổi từ khóa hoặc bộ lọc trạng thái để xem thêm cơ hội.'}
                      </p>
                      {viewScope === 'SAVED' && (
                        <button
                          type="button"
                          onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          <Flame className="w-3.5 h-3.5 text-orange-300" />
                          <span>Duyệt Sàn Lead Board Ngay</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isExpanded = Boolean(expandedLeadIds[lead.id]);
                  const isUnlocked = Boolean(unlockedLeadIds[lead.id] || lead.isUnlocked);

                  return (
                    <React.Fragment key={lead.id}>
                      <tr
                        id={`lead-row-${lead.code}`}
                        onClick={() => toggleExpandLead(lead.id)}
                        className={`transition-colors cursor-pointer group ${
                          isExpanded
                            ? 'bg-indigo-50/80 border-l-4 border-l-indigo-600'
                            : lead.isSaved
                              ? 'bg-amber-50/20 hover:bg-amber-50/50'
                              : 'hover:bg-indigo-50/40'
                        }`}
                      >
                        {/* Bookmark Toggle Column */}
                        <td className="py-4 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            id={`toggle-save-${lead.code}`}
                            onClick={() => onToggleSaveLead && onToggleSaveLead(lead.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              lead.isSaved
                                ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100 shadow-2xs'
                                : 'border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                            }`}
                            title={lead.isSaved ? 'Đang lưu (Click để bỏ lưu)' : 'Lưu vào My Leads'}
                          >
                            {lead.isSaved ? (
                              <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>

                        <td className="py-4 px-4 font-mono font-semibold text-indigo-700">
                          <div className="flex items-center space-x-1.5">
                            <span>{lead.code}</span>
                            {lead.matchScore >= 95 && (
                              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1 py-0.2 rounded">
                                {lead.matchScore}% Match
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4 max-w-xs">
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {lead.customerCompany}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {lead.contactName} • {lead.contactRole}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                            {getServiceIcon(lead.serviceType)}
                            <span>{lead.serviceType}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-medium text-slate-800">
                          {lead.route}
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-emerald-700 text-sm">
                            {lead.estimatedValueDisplay}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                          {lead.createdDate}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] border ${getStatusBadge(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-2">
                            {lead.status === 'Open' ? (
                              <button
                                id={`create-quote-for-lead-${lead.code}`}
                                onClick={() => onOpenCreateQuotation(lead)}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Báo giá</span>
                              </button>
                            ) : lead.status === 'Quoted' ? (
                              <button
                                id={`view-quote-for-lead-${lead.code}`}
                                onClick={() => onOpenCreateQuotation(lead)}
                                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Đã báo giá</span>
                              </button>
                            ) : lead.status === 'Won' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Trúng thầu</span>
                              </span>
                            ) : lead.status === 'Lost' ? (
                              <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-xs bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                                <span>Trượt thầu</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-500 font-medium text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                                <span>Đã đóng</span>
                              </span>
                            )}

                            {/* Expand/Collapse Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandLead(lead.id);
                              }}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isExpanded
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                              }`}
                              title={isExpanded ? 'Thu gọn chi tiết' : 'Xem chi tiết lead'}
                            >
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
                        <tr className="bg-indigo-50/40 border-b border-indigo-100 animate-in fade-in duration-150">
                          <td colSpan={9} className="p-3 sm:p-4">
                            <LeadInquiryDetailCard
                              lead={lead}
                              isUnlocked={isUnlocked}
                              maskCompanyName={maskCompanyName}
                              maskContactPerson={maskContactPerson}
                              onUnlockClick={() => handleUnlockLead(lead)}
                              onOpenCreateQuotation={onOpenCreateQuotation}
                              onToggleSaveLead={(_, e) => {
                                if (e) e.stopPropagation();
                                onToggleSaveLead && onToggleSaveLead(lead.id);
                              }}
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
      </div>

      {/* UNLOCK LEAD CONFIRMATION MODAL WITH BENEFIT CHECKLIST */}
      {leadToUnlockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setLeadToUnlockConfirm(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                  <KeyRound className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-200 bg-amber-900/30 px-2 py-0.5 rounded-full">
                    FlexCredit Lead Unlock
                  </span>
                  <h3 className="text-lg font-bold mt-1">Mở Khóa Hồ Sơ & Đối Thủ Cạnh Tranh</h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Inquiry Mini Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700">
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

              {/* Unlock Action Button */}
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
