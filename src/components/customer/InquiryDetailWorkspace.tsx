import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Edit3, 
  UserPlus, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Calendar, 
  MapPin, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Star, 
  ChevronRight,
  TrendingUp,
  Download,
  Send,
  Eye,
  Check,
  Paperclip,
  FileSpreadsheet,
  Image as ImageIcon,
  FileArchive
} from 'lucide-react';
import { InquiryItem, QuotationItem, SupplierCompany, CurrentView } from '../../types';

interface InquiryDetailWorkspaceProps {
  inquiry: InquiryItem;
  quotations?: QuotationItem[];
  suppliers?: SupplierCompany[];
  onBack: () => void;
  onNavigate: (view: CurrentView) => void;
  onAwardQuote: (quotationId: string) => void;
}

export const InquiryDetailWorkspace: React.FC<InquiryDetailWorkspaceProps> = ({
  inquiry,
  quotations = [],
  suppliers = [],
  onBack,
  onNavigate,
  onAwardQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'suppliers' | 'quotations' | 'compare' | 'activity' | 'files'>('overview');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedSupplierToInvite, setSelectedSupplierToInvite] = useState<string>('');
  const [invitedList, setInvitedList] = useState<string[]>(inquiry?.invitedSuppliers || ['VinaTrans Logistics JSC', 'Saigon Ocean Freight & Logistics']);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);

  // Lead Code and Inquiry Code are 1:1 identical (Mã lead và Mã Inquiry là 1)
  const leadCode = inquiry?.leadCode || inquiry?.code || '';

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`
    : `https://logistics.vietnam.io/?tab=lead-board&leadCode=${leadCode}`;

  const handleShareLead = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  // Filter quotations specifically for this inquiry safely
  const inquiryQuotes = (quotations || []).filter(
    (q) => q && (q.inquiryCode === inquiry?.code || (q.inquiryTitle && inquiry?.code && q.inquiryTitle.includes(inquiry.code)) || q.serviceType === inquiry?.serviceType)
  );

  const handleInviteSupplier = () => {
    if (selectedSupplierToInvite && !invitedList.includes(selectedSupplierToInvite)) {
      setInvitedList([...invitedList, selectedSupplierToInvite]);
      setSelectedSupplierToInvite('');
      setInviteModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Nav & Breadcrumbs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <button
            onClick={onBack}
            className="hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inquiries</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-indigo-600 font-mono">{inquiry.code}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Customer Command Center</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
                {inquiry.code}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${
                inquiry.status === 'Open' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                inquiry.status === 'Quoted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                inquiry.status === 'Awarded' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                Status: {inquiry.status.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400">Created: {inquiry.createdDate}</span>
              {inquiry.expiryDate && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    Expires: {inquiry.expiryDate}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
              {inquiry.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
              <span>Origin: <strong>{inquiry.origin}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Destination: <strong>{inquiry.destination}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Service: <strong>{inquiry.serviceType}</strong></span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              id="share-lead-board-btn"
              onClick={handleShareLead}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                copiedShareLink
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-emerald-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
              title={`Sao chép link Lead Board lọc theo mã Lead: ${leadCode}`}
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Đã chép link Lead ({leadCode})!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chia sẻ Lead ({leadCode})</span>
                </>
              )}
            </button>

            <button
              id="invite-suppliers-btn"
              onClick={() => setInviteModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Suppliers</span>
            </button>

            <button
              id="compare-tab-trigger-btn"
              onClick={() => setActiveTab('compare')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compare Quotes ({inquiryQuotes.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 mt-6 border-b border-slate-100 -mb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'suppliers', label: `Invited Suppliers (${invitedList.length})` },
            { id: 'quotations', label: `Quotations (${inquiryQuotes.length})` },
            { id: 'compare', label: 'Compare Matrix' },
            { id: 'activity', label: 'Activity Timeline' },
            { id: 'files', label: 'Files & Documents (3)' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Scope of Logistics Requirement</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {inquiry.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Cargo Type & Sector</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{inquiry.cargoType}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(inquiry.tradeRole || inquiry.serviceSpecs?.ocean?.tradeRole || inquiry.serviceSpecs?.air?.tradeRole || inquiry.serviceSpecs?.customs?.tradeRole || inquiry.serviceSpecs?.crossBorder?.tradeRole) && (
                      <span className="inline-block text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        🌐 {inquiry.tradeRole || inquiry.serviceSpecs?.ocean?.tradeRole || inquiry.serviceSpecs?.air?.tradeRole || inquiry.serviceSpecs?.customs?.tradeRole || inquiry.serviceSpecs?.crossBorder?.tradeRole}
                      </span>
                    )}
                    {inquiry.industry && (
                      <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {inquiry.industry}
                      </span>
                    )}
                    {(inquiry.hsCode || inquiry.serviceSpecs?.customs?.hsCodePrimary || inquiry.serviceSpecs?.ocean?.hsCode || inquiry.serviceSpecs?.air?.hsCode || inquiry.serviceSpecs?.crossBorder?.hsCode) && (
                      <span className="inline-block text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        🏷️ HS: {inquiry.hsCode || inquiry.serviceSpecs?.customs?.hsCodePrimary || inquiry.serviceSpecs?.ocean?.hsCode || inquiry.serviceSpecs?.air?.hsCode || inquiry.serviceSpecs?.crossBorder?.hsCode}
                      </span>
                    )}
                    {(inquiry.cargoValue || inquiry.serviceSpecs?.ocean?.cargoValue || inquiry.serviceSpecs?.air?.cargoValue || inquiry.serviceSpecs?.customs?.cargoValue || inquiry.serviceSpecs?.crossBorder?.cargoValue) && (
                      <span className="inline-block text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        💰 Trị giá: {inquiry.cargoValue || inquiry.serviceSpecs?.ocean?.cargoValue || inquiry.serviceSpecs?.air?.cargoValue || inquiry.serviceSpecs?.customs?.cargoValue || inquiry.serviceSpecs?.crossBorder?.cargoValue} {inquiry.cargoValueCurrency || inquiry.serviceSpecs?.ocean?.cargoValueCurrency || inquiry.serviceSpecs?.air?.cargoValueCurrency || inquiry.serviceSpecs?.customs?.cargoValueCurrency || inquiry.serviceSpecs?.crossBorder?.cargoValueCurrency || 'USD'}
                      </span>
                    )}
                    {inquiry.packaging && (
                      <span className="inline-block text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        📦 {inquiry.packaging}
                      </span>
                    )}
                    {inquiry.preservationRequirement && (
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        🛡️ {inquiry.preservationRequirement}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Weight & Volume</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{inquiry.weightVolume}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Incoterms</span>
                  <p className="text-sm font-bold text-indigo-600 mt-0.5">{inquiry.incoterms || 'DAP'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Pickup Date</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{inquiry.pickupDate}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Delivery Deadline</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{inquiry.deliveryDate}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Target Budget</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">{inquiry.targetBudget || '48,000,000 VND'}</p>
                  {inquiry.currency && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                        {inquiry.currency}
                      </span>
                      {inquiry.exchangeRate && inquiry.currency !== 'VND' && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          (1 {inquiry.currency} ≈ {inquiry.exchangeRate.toLocaleString('vi-VN')} ₫)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Attachments in Overview */}
              {inquiry.attachments && inquiry.attachments.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tài Liệu Đính Kèm ({inquiry.attachments.length} Tệp tin)</span>
                    </span>
                    <button 
                      onClick={() => setActiveTab('files')}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Xem tất cả tệp →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inquiry.attachments.map((att) => {
                      const isExcel = att.type === 'excel';
                      const isPdf = att.type === 'pdf';
                      const isWord = att.type === 'word';
                      const isImg = att.type === 'image';
                      const isArchive = att.type === 'archive';

                      return (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isExcel
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : isPdf
                                  ? 'bg-rose-100 text-rose-700'
                                  : isWord
                                  ? 'bg-blue-100 text-blue-700'
                                  : isImg
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isExcel && <FileSpreadsheet className="w-4 h-4" />}
                              {isPdf && <FileText className="w-4 h-4" />}
                              {isWord && <FileText className="w-4 h-4" />}
                              {isImg && <ImageIcon className="w-4 h-4" />}
                              {isArchive && <FileArchive className="w-4 h-4" />}
                              {!isExcel && !isPdf && !isWord && !isImg && !isArchive && <Paperclip className="w-4 h-4" />}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate" title={att.name}>
                                {att.name}
                              </p>
                              <p className="text-[10.5px] text-slate-400">
                                {att.size} • {att.uploadedDate}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert(`Tải xuống tài liệu: ${att.name}`)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                            title="Tải xuống tệp"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Service Specific Technical Specifications */}
            {inquiry.serviceSpecs && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Technical & Equipment Specifications ({inquiry.serviceType})</span>
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                    Form Synced
                  </span>
                </h3>

                {/* Trucking Specs */}
                {inquiry.serviceSpecs.trucking && (
                  <div className="space-y-3 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold">Hình thức tải</span>
                        <span className="font-bold text-blue-900">{inquiry.serviceSpecs.trucking.loadType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Loại thùng phương tiện</span>
                        <span className="font-bold text-slate-800">{inquiry.serviceSpecs.trucking.truckType}</span>
                      </div>
                      {inquiry.serviceSpecs.trucking.tonnageCategory && (
                        <div>
                          <span className="text-slate-400 block font-semibold">Phân khúc tải trọng</span>
                          <span className="font-bold text-indigo-700">{inquiry.serviceSpecs.trucking.tonnageCategory}</span>
                        </div>
                      )}
                      {inquiry.serviceSpecs.trucking.vehicleCount && (
                        <div>
                          <span className="text-slate-400 block font-semibold">Số lượng chuyến & Đơn vị</span>
                          <span className="font-bold text-slate-800">
                            {inquiry.serviceSpecs.trucking.vehicleCount} {inquiry.serviceSpecs.trucking.vehicleCountUnit ? inquiry.serviceSpecs.trucking.vehicleCountUnit.toLowerCase() : 'chuyến'}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 block font-semibold">Số điểm lấy / giao</span>
                        <span className="font-bold text-slate-800">
                          {inquiry.serviceSpecs.trucking.pickupPointsCount || inquiry.serviceSpecs.trucking.pickupLocations?.length || 1} Điểm lấy ── {inquiry.serviceSpecs.trucking.deliveryPointsCount || inquiry.serviceSpecs.trucking.multiDropPoints || 1} Điểm giao
                        </span>
                      </div>
                      {inquiry.serviceSpecs.trucking.routeDistanceKm && (
                        <div>
                          <span className="text-slate-400 block font-semibold">Cự ly ước tính</span>
                          <span className="font-bold text-slate-800">{inquiry.serviceSpecs.trucking.routeDistanceKm} km</span>
                        </div>
                      )}
                    </div>

                    {/* FTL Requested Leadtime if available */}
                    {inquiry.serviceSpecs.trucking.loadType === 'FTL (Nguyên chuyến)' && inquiry.serviceSpecs.trucking.requestedLeadtime && (
                      <div className="p-2.5 bg-indigo-50/90 rounded-lg border border-indigo-200/80 flex items-center justify-between text-xs">
                        <span className="font-semibold text-indigo-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Thời gian giao hàng cam kết (Leadtime SLA):</span>
                        </span>
                        <span className="font-bold text-indigo-800 bg-white px-2.5 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
                          {inquiry.serviceSpecs.trucking.requestedLeadtime}
                          {inquiry.serviceSpecs.trucking.requestedLeadtimeNote ? ` (${inquiry.serviceSpecs.trucking.requestedLeadtimeNote})` : ''}
                        </span>
                      </div>
                    )}

                    {/* Multi-pickup list if > 1 */}
                    {inquiry.serviceSpecs.trucking.pickupLocations && inquiry.serviceSpecs.trucking.pickupLocations.length > 1 && (
                      <div className="p-2.5 bg-white/80 rounded-lg border border-blue-200/60 text-xs space-y-1">
                        <span className="font-bold text-blue-900 block">Các điểm lấy hàng ({inquiry.serviceSpecs.trucking.pickupLocations.length} điểm):</span>
                        <div className="space-y-0.5 pl-2 text-slate-700">
                          {inquiry.serviceSpecs.trucking.pickupLocations.map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span>{loc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Multi-drop list if > 1 */}
                    {inquiry.serviceSpecs.trucking.deliveryLocations && inquiry.serviceSpecs.trucking.deliveryLocations.length > 1 && (
                      <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200/60 text-xs space-y-1">
                        <span className="font-bold text-rose-900 block">Các điểm giao hàng / Multi-drop ({inquiry.serviceSpecs.trucking.deliveryLocations.length} điểm):</span>
                        <div className="space-y-0.5 pl-2 text-slate-700">
                          {inquiry.serviceSpecs.trucking.deliveryLocations.map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span>{loc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LTL Specific Details if available */}
                    {inquiry.serviceSpecs.trucking.loadType === 'LTL (Ghép hàng lẻ)' && (
                      <div className="p-3 bg-white/80 rounded-lg border border-blue-200/60 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Số kiện & Quy cách:</span>
                          <span className="font-bold text-slate-800">{inquiry.serviceSpecs.trucking.ltlPieces || 1} Kiện ({inquiry.serviceSpecs.trucking.ltlPackaging || 'Pallet'})</span>
                        </div>
                        {inquiry.serviceSpecs.trucking.ltlDimensions && (
                          <div>
                            <span className="text-[10px] text-slate-400 block">Kích thước (DxRxC):</span>
                            <span className="font-bold text-slate-800">{inquiry.serviceSpecs.trucking.ltlDimensions.lengthCm}x{inquiry.serviceSpecs.trucking.ltlDimensions.widthCm}x{inquiry.serviceSpecs.trucking.ltlDimensions.heightCm} cm</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-slate-400 block">Tổng CBM:</span>
                          <span className="font-bold text-emerald-700">{inquiry.serviceSpecs.trucking.ltlCbm || 0} m³</span>
                        </div>
                        {inquiry.serviceSpecs.trucking.ltlGrossWeightKg !== undefined && inquiry.serviceSpecs.trucking.ltlGrossWeightKg !== null ? (
                          <div>
                            <span className="text-[10px] text-slate-400 block">Trọng lượng thực tế (Gross):</span>
                            <span className="font-bold text-slate-900">{Number(inquiry.serviceSpecs.trucking.ltlGrossWeightKg).toLocaleString('vi-VN')} kg</span>
                          </div>
                        ) : null}
                        <div>
                          <span className="text-[10px] text-slate-400 block">Trọng lượng tính cước:</span>
                          <span className="font-bold text-indigo-700">{Number(inquiry.serviceSpecs.trucking.ltlChargeableWeightKg || 0).toLocaleString('vi-VN')} kg</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ocean Specs */}
                {inquiry.serviceSpecs.ocean && (
                  <div className="space-y-3 bg-cyan-50/40 p-4 rounded-xl border border-cyan-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold">Mode</span>
                        <span className="font-bold text-cyan-900">{inquiry.serviceSpecs.ocean.mode}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Cảng Bốc (POL)</span>
                        <span className="font-bold text-slate-800">{inquiry.serviceSpecs.ocean.polPort}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Cảng Dỡ (POD)</span>
                        <span className="font-bold text-slate-800">{inquiry.serviceSpecs.ocean.podPort}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Loại Cont / Số lượng</span>
                        <span className="font-bold text-indigo-700">
                          {inquiry.serviceSpecs.ocean.containerCount || 1} {inquiry.serviceSpecs.ocean.containerCountUnit ? (inquiry.serviceSpecs.ocean.containerCountUnit.startsWith('Container') ? inquiry.serviceSpecs.ocean.containerCountUnit : `Cont (${inquiry.serviceSpecs.ocean.containerCountUnit})`) : 'Cont'} x {inquiry.serviceSpecs.ocean.containerType || '40HC'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Incoterms</span>
                        <span className="font-bold text-slate-800">{inquiry.serviceSpecs.ocean.incoterm}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Free Dem/Det yêu cầu</span>
                        <span className="font-bold text-emerald-700">{inquiry.serviceSpecs.ocean.freeDemDetDaysRequested} Ngày</span>
                      </div>
                    </div>

                    {/* LCL Specific Details if available */}
                    {(inquiry.serviceSpecs.ocean.mode?.includes('LCL') || inquiry.serviceSpecs.ocean.lclCbm || inquiry.serviceSpecs.ocean.lclPieces) && (
                      <div className="p-3 bg-white/90 rounded-lg border border-cyan-200/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-cyan-800 block font-semibold">Số kiện & Quy cách:</span>
                          <span className="font-bold text-slate-800">
                            {inquiry.serviceSpecs.ocean.lclPieces || 1} Kiện ({inquiry.serviceSpecs.ocean.lclPackaging || inquiry.serviceSpecs.ocean.packageType || 'Pallet'})
                          </span>
                        </div>
                        {inquiry.serviceSpecs.ocean.lclDimensions && (
                          <div>
                            <span className="text-[10px] text-cyan-800 block font-semibold">Kích thước (DxRxC):</span>
                            <span className="font-bold text-slate-800">
                              {inquiry.serviceSpecs.ocean.lclDimensions.lengthCm}x{inquiry.serviceSpecs.ocean.lclDimensions.widthCm}x{inquiry.serviceSpecs.ocean.lclDimensions.heightCm} cm
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-cyan-800 block font-semibold">Tổng CBM:</span>
                          <span className="font-bold text-cyan-900">{inquiry.serviceSpecs.ocean.lclCbm || inquiry.serviceSpecs.ocean.cbmVolume || 0} m³</span>
                        </div>
                        {inquiry.serviceSpecs.ocean.lclGrossWeightKg !== undefined && inquiry.serviceSpecs.ocean.lclGrossWeightKg !== null ? (
                          <div>
                            <span className="text-[10px] text-cyan-800 block font-semibold">Trọng lượng thực (Gross):</span>
                            <span className="font-bold text-slate-900">{Number(inquiry.serviceSpecs.ocean.lclGrossWeightKg).toLocaleString('vi-VN')} kg</span>
                          </div>
                        ) : null}
                        <div>
                          <span className="text-[10px] text-cyan-800 block font-semibold">Trọng lượng tính cước (W/M):</span>
                          <span className="font-bold text-indigo-700">
                            {Number(inquiry.serviceSpecs.ocean.lclChargeableWeightKg || 0).toLocaleString('vi-VN')} kg ({inquiry.serviceSpecs.ocean.lclRevenueTon || ((inquiry.serviceSpecs.ocean.lclChargeableWeightKg || 0) / 1000).toFixed(2)} RT)
                          </span>
                        </div>
                        {typeof inquiry.serviceSpecs.ocean.lclStackable === 'boolean' && (
                          <div>
                            <span className="text-[10px] text-cyan-800 block font-semibold">Xếp chồng (Stackable):</span>
                            <span className={`font-bold ${inquiry.serviceSpecs.ocean.lclStackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {inquiry.serviceSpecs.ocean.lclStackable ? '✓ Cho phép' : '⚠️ Không chồng'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {(inquiry.serviceSpecs.ocean.pickupAddress || inquiry.serviceSpecs.ocean.deliveryAddress) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-cyan-100/80 text-xs">
                        {inquiry.serviceSpecs.ocean.pickupAddress && (
                          <div className="bg-white/90 p-2.5 rounded-lg border border-cyan-200/80 shadow-2xs">
                            <span className="text-[10px] text-cyan-800 font-bold block">📍 Kho lấy hàng (Shipper Warehouse):</span>
                            <span className="font-medium text-slate-800 block mt-0.5">{inquiry.serviceSpecs.ocean.pickupAddress}</span>
                          </div>
                        )}
                        {inquiry.serviceSpecs.ocean.deliveryAddress && (
                          <div className="bg-white/90 p-2.5 rounded-lg border border-rose-200/80 shadow-2xs">
                            <span className="text-[10px] text-rose-800 font-bold block">📍 Kho giao hàng (Consignee Warehouse):</span>
                            <span className="font-medium text-slate-800 block mt-0.5">{inquiry.serviceSpecs.ocean.deliveryAddress}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Air Specs */}
                {inquiry.serviceSpecs.air && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                    <div>
                      <span className="text-slate-400 block font-semibold">Air Service Level</span>
                      <span className="font-bold text-sky-900">{inquiry.serviceSpecs.air.serviceLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Sân bay AOD → AOA</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.air.originAirport} → {inquiry.serviceSpecs.air.destinationAirport}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Chargeable Weight (CW)</span>
                      <span className="font-bold text-indigo-700">{inquiry.serviceSpecs.air.chargeableWeightKgs} Kg CW</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Số kiện & Kích thước</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.air.packageCount} kiện ({inquiry.serviceSpecs.air.dimensionsCm} cm)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Hàng nguy hiểm IATA</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.air.isDangerousGoods ? 'Có (DG)' : 'Không (Non-DG)'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Thông quan sân bay</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.air.customsAtAirport ? 'Yêu cầu hỗ trợ' : 'Tự túc'}</span>
                    </div>
                  </div>
                )}

                {/* Cold Chain Specs */}
                {inquiry.serviceSpecs.coldChain && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                    <div>
                      <span className="text-slate-400 block font-semibold">Dải nhiệt độ SLA</span>
                      <span className="font-bold text-emerald-900">{inquiry.serviceSpecs.coldChain.temperatureCategory}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Thiết bị lạnh</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.coldChain.vehicleOrContType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Làm lạnh thùng trước</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.coldChain.preCoolingRequested ? 'Bắt buộc' : 'Không'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">IoT Temp Logger</span>
                      <span className="font-bold text-emerald-700">{inquiry.serviceSpecs.coldChain.realtimeGpsTempLogging ? 'Realtime Online' : 'Không'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Máy phát Clip-on Genset</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.coldChain.backupGensetIncluded ? 'Có cam kết' : 'Không'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Chứng nhận GDP / WHO</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.coldChain.isPharmaCertifiedGDP ? 'Yêu cầu' : 'Tiêu chuẩn'}</span>
                    </div>
                  </div>
                )}

                {/* Warehousing Specs */}
                {inquiry.serviceSpecs.warehousing && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs bg-purple-50/40 p-4 rounded-xl border border-purple-100">
                    <div>
                      <span className="text-slate-400 block font-semibold">Mô hình kho</span>
                      <span className="font-bold text-purple-900">{inquiry.serviceSpecs.warehousing.warehouseType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Diện tích & Vị trí Pallet</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.warehousing.storageAreaSqm} m² / {inquiry.serviceSpecs.warehousing.palletPositions} Pallets</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Thời hạn thuê</span>
                      <span className="font-bold text-indigo-700">{inquiry.serviceSpecs.warehousing.rentalDurationMonths} Tháng</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Nhập / Xuất ngày</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.warehousing.dailyInboundVolume} • {inquiry.serviceSpecs.warehousing.dailyOutboundVolume}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-semibold">Dịch vụ VAS</span>
                      <span className="font-bold text-slate-800">{(inquiry.serviceSpecs.warehousing.requiredVAS || []).join(', ') || 'Tiêu chuẩn'}</span>
                    </div>
                  </div>
                )}

                {/* Customs Specs */}
                {inquiry.serviceSpecs.customs && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                    <div>
                      <span className="text-slate-400 block font-semibold">Loại hình tờ khai</span>
                      <span className="font-bold text-amber-900">{inquiry.serviceSpecs.customs.declarationType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Chi cục Hải quan</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.customs.customsSubDepartment}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Mã HS Code & Trị giá</span>
                      <span className="font-bold text-indigo-700">{inquiry.serviceSpecs.customs.hsCodePrimary} (${inquiry.serviceSpecs.customs.invoiceValueUSD?.toLocaleString()})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Mẫu C/O yêu cầu</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.customs.coFormRequested || 'Không'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Kiểm tra chuyên ngành</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.customs.specializedInspectionType || 'Không'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Hỗ trợ luồng đỏ</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.customs.redChannelInspectionSupport ? 'Có kiểm hóa' : 'Không'}</span>
                    </div>
                  </div>
                )}

                {/* Cross Border Specs */}
                {inquiry.serviceSpecs.crossBorder && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs bg-orange-50/40 p-4 rounded-xl border border-orange-100">
                    <div>
                      <span className="text-slate-400 block font-semibold">Cửa khẩu biên giới</span>
                      <span className="font-bold text-orange-950">{inquiry.serviceSpecs.crossBorder.borderGate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Phương thức xe</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.crossBorder.cargoMode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Số lượng xe</span>
                      <span className="font-bold text-indigo-700">{inquiry.serviceSpecs.crossBorder.vehicleCount} Xe</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Thông quan 2 đầu</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.crossBorder.customsAtBorderIncluded ? 'Trọn gói' : 'Tự túc'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Giấy phép liên vận GMS</span>
                      <span className="font-bold text-slate-800">{inquiry.serviceSpecs.crossBorder.transitPermitGMSNeeded ? 'Yêu cầu' : 'Không'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Special requirements */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mandatory SLA & Compliance Requirements</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                {(inquiry.specialRequirements || ['GPS Live Telematics', 'Temperature Controlled 20-25°C', 'Tail-lift Hydraulic', 'Cargo Insurance included']).map((req, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Highlights */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Responses Summary</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-orange-400 text-slate-950 rounded-full">
                  {inquiryQuotes.length} Quotes
                </span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black tracking-tight">48,000,000 VND</div>
                <p className="text-xs text-indigo-200 mt-0.5">Lowest Quotation (VinaTrans)</p>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-700/60 space-y-2 text-xs">
                <div className="flex justify-between text-indigo-200">
                  <span>Fastest Transit:</span>
                  <span className="font-semibold text-white">1.5 Days (Mekong Express)</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>Best Terms:</span>
                  <span className="font-semibold text-white">Net 45 Days</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('compare')}
                className="w-full mt-6 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Launch Quote Comparison</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Inquiry Owner
              </h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  HL
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{inquiry.contactPerson}</p>
                  <p className="text-[11px] text-slate-500">{inquiry.customerCompany}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: INVITED SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Invited Logistics Suppliers</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Suppliers who received this requirement and can submit quotations.
              </p>
            </div>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite More Suppliers</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invitedList.map((suppName, idx) => {
              const matchedSupplier = suppliers.find((s) => s.name === suppName);
              const hasQuoted = inquiryQuotes.some((q) => q.supplierName === suppName);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                      {suppName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-slate-900">{suppName}</p>
                        {matchedSupplier?.verified && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {matchedSupplier?.tagline || 'Specialized fleet provider'}
                      </p>
                    </div>
                  </div>

                  <div>
                    {hasQuoted ? (
                      <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded-full flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Quoted</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: QUOTATIONS LIST */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Received Quotations ({inquiryQuotes.length})</h3>
              <p className="text-xs text-slate-500">
                Detailed pricing bids submitted by verified suppliers for this requirement.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('compare')}
              className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Matrix Comparison</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {inquiryQuotes.map((q) => (
              <div
                key={q.id}
                id={`quote-card-${q.code}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 text-white font-black text-base flex items-center justify-center shadow-md">
                      {q.supplierName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-bold text-slate-900">{q.supplierName}</h4>
                        <div className="flex items-center text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                          <span>{q.supplierRating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Quote #{q.code} • Submitted {q.createdAt} • Valid until {q.validUntil}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">
                      {q.totalPrice.toLocaleString()} {q.currency}
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      {q.isBestPrice && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          🟢 Lowest Price
                        </span>
                      )}
                      {q.isFastestTransit && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          🟢 Fastest Transit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Base Freight</span>
                    <span className="font-bold text-slate-800">{q.baseFreight.toLocaleString()} {q.currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fuel Surcharge</span>
                    <span className="font-bold text-slate-800">{q.fuelSurcharge.toLocaleString()} {q.currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Handling Fee</span>
                    <span className="font-bold text-slate-800">{q.handlingFee.toLocaleString()} {q.currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Transit Time</span>
                    <span className="font-bold text-slate-800">{q.transitTimeDisplay}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment Terms</span>
                    <span className="font-bold text-indigo-700">{q.paymentTerms}</span>
                  </div>
                </div>

                {/* Notes and action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-slate-600 italic">
                    "{q.notes}"
                  </p>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onAwardQuote(q.id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Accept & Award
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: COMPARE MATRIX */}
      {activeTab === 'compare' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Quotation Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side evaluation of received supplier bids for {inquiry.title}.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-4 font-bold text-slate-600 uppercase tracking-wider w-1/4">
                    Evaluation Criteria
                  </th>
                  {inquiryQuotes.map((q) => (
                    <th key={q.id} className="py-4 px-4 font-bold text-slate-900 text-center w-1/4">
                      <div className="font-bold text-sm">{q.supplierName}</div>
                      <div className="text-[11px] text-slate-400 font-mono font-normal">
                        {q.code}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Total Price */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Total Price (VND)</td>
                  {inquiryQuotes.map((q) => (
                    <td key={q.id} className="py-3.5 px-4 text-center">
                      <div className="font-bold text-sm text-slate-900">
                        {q.totalPrice.toLocaleString()} VND
                      </div>
                      {q.isBestPrice && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          🟢 Lowest Price
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Transit Time */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Transit Time</td>
                  {inquiryQuotes.map((q) => (
                    <td key={q.id} className="py-3.5 px-4 text-center">
                      <div className="font-semibold text-slate-800">{q.transitTimeDisplay}</div>
                      {q.isFastestTransit && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          🟢 Fastest Transit
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Payment Terms */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Payment Terms</td>
                  {inquiryQuotes.map((q) => (
                    <td key={q.id} className="py-3.5 px-4 text-center">
                      <div className="font-bold text-indigo-700">{q.paymentTerms}</div>
                      {q.isBestTerms && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          🟢 Best Payment Terms
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Supplier Rating */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Supplier Rating & Score</td>
                  {inquiryQuotes.map((q) => (
                    <td key={q.id} className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                        <span>{q.supplierRating} / 5.0</span>
                      </div>
                      {q.isHighestRating && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          🟢 Highest Supplier Rating
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Free Demurrage / Staging */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Free Demurrage / Staging</td>
                  {inquiryQuotes.map((q) => (
                    <td key={q.id} className="py-3.5 px-4 text-center font-medium text-slate-700">
                      {q.freeDemurrageDays || 2} Days
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr className="bg-slate-50/80">
                  <td className="py-4 px-4 font-bold text-slate-700">Select Preferred Supplier</td>
                  {inquiryQuotes.map((q) => (
                    <td key={q.id} className="py-4 px-4 text-center">
                      <button
                        onClick={() => onAwardQuote(q.id)}
                        className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ${
                          q.isBestPrice
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        [ Select Supplier ]
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: ACTIVITY TIMELINE */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-6">Requirement Audit Trail</h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            <div className="relative flex items-start space-x-4">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white z-10">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">Received quotation from VinaTrans Logistics</p>
                  <span className="text-[11px] text-slate-400">Today, 09:30 AM</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Submitted QUO-89201 for 48,000,000 VND (Lowest Quote).
                </p>
              </div>
            </div>

            <div className="relative flex items-start space-x-4">
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white z-10">
                <Send className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">Inquiry Published & Broadcasted</p>
                  <span className="text-[11px] text-slate-400">Aug 20, 2026</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Requirement broadcasted to 4 preferred logistics suppliers on FlexGO.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: FILES */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-indigo-600" />
                <span>Attached Requirement Documents & Specs</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các hồ sơ kỹ thuật, bảng kê chi tiết và chứng từ đính kèm của yêu cầu báo giá
              </p>
            </div>
            <button 
              type="button"
              onClick={() => alert('Chức năng tải thêm tài liệu bổ sung')}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-indigo-200 shadow-2xs"
            >
              + Tải Thêm Tài Liệu
            </button>
          </div>

          {((inquiry.attachments && inquiry.attachments.length > 0) ? inquiry.attachments : [
            { id: 'f-1', name: 'Cargo_Specs_Electronic_Sensors.pdf', size: '2.4 MB', type: 'pdf', uploadedDate: '2026-08-27' },
            { id: 'f-2', name: 'Packing_List_Detailed_Manifest.xlsx', size: '1.1 MB', type: 'excel', uploadedDate: '2026-08-27' },
            { id: 'f-3', name: 'Loading_Bay_Clearance_TanBinh.pdf', size: '850 KB', type: 'pdf', uploadedDate: '2026-08-27' },
          ]).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {((inquiry.attachments && inquiry.attachments.length > 0) ? inquiry.attachments : [
                { id: 'f-1', name: 'Cargo_Specs_Electronic_Sensors.pdf', size: '2.4 MB', type: 'pdf', uploadedDate: '2026-08-27' },
                { id: 'f-2', name: 'Packing_List_Detailed_Manifest.xlsx', size: '1.1 MB', type: 'excel', uploadedDate: '2026-08-27' },
                { id: 'f-3', name: 'Loading_Bay_Clearance_TanBinh.pdf', size: '850 KB', type: 'pdf', uploadedDate: '2026-08-27' },
              ]).map((f, i) => {
                const isExcel = f.type === 'excel';
                const isPdf = f.type === 'pdf';
                const isWord = f.type === 'word';
                const isImg = f.type === 'image';
                const isArchive = f.type === 'archive';

                return (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-300 hover:bg-white transition-all shadow-2xs">
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isExcel
                            ? 'bg-emerald-100 text-emerald-700'
                            : isPdf
                            ? 'bg-rose-100 text-rose-700'
                            : isWord
                            ? 'bg-blue-100 text-blue-700'
                            : isImg
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {isExcel && <FileSpreadsheet className="w-4 h-4" />}
                        {isPdf && <FileText className="w-4 h-4" />}
                        {isWord && <FileText className="w-4 h-4" />}
                        {isImg && <ImageIcon className="w-4 h-4" />}
                        {isArchive && <FileArchive className="w-4 h-4" />}
                        {!isExcel && !isPdf && !isWord && !isImg && !isArchive && <Paperclip className="w-4 h-4" />}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate block" title={f.name}>
                          {f.name}
                        </span>
                        <span className="text-[10.5px] text-slate-400">
                          {f.size} • {f.uploadedDate}
                        </span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => alert(`Tải xuống tài liệu: ${f.name}`)}
                      className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
                      title="Tải xuống tệp"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Chưa có tài liệu nào được đính kèm.
            </div>
          )}
        </div>
      )}

      {/* Invite Supplier Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Invite Supplier to this Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a verified logistics provider to send a direct invitation.
            </p>

            <div className="my-4 space-y-2 max-h-60 overflow-y-auto">
              {suppliers.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSupplierToInvite(s.name)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                    selectedSupplierToInvite === s.name
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>{s.name}</span>
                  </div>
                  <span className="text-amber-500 font-bold">★ {s.rating}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setInviteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteSupplier}
                disabled={!selectedSupplierToInvite}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
