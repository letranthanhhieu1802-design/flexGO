import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Clock, 
  ChevronRight, 
  Truck, 
  Ship, 
  Plane, 
  CheckCircle2, 
  XCircle, 
  ClockAlert, 
  Send, 
  Filter, 
  Snowflake, 
  Warehouse, 
  ShieldCheck, 
  Globe, 
  Eye, 
  Info,
  FileText,
  BookmarkCheck,
  Bookmark,
  Unlock,
  Sparkles,
  Layers
} from 'lucide-react';
import { OpportunityItem, PipelineStage, CurrentView, ServiceType, SupplierLeadSourceType } from '../../types';

interface OpportunityKanbanPageProps {
  opportunities: OpportunityItem[];
  onSelectOpportunity: (opp: OpportunityItem) => void;
  onOpenCreateQuotation: () => void;
  onNavigate: (view: CurrentView) => void;
  onMoveStage?: (oppId: string, newStage: PipelineStage) => void;
}

export const OpportunityKanbanPage: React.FC<OpportunityKanbanPageProps> = ({
  opportunities,
  onSelectOpportunity,
  onOpenCreateQuotation,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // Normalize any legacy or case difference into the 5 official lead stages
  const normalizeStage = (st: string): PipelineStage => {
    if (!st) return 'Open';
    const s = st.trim();
    if (s === 'Open' || s === 'NEW' || s === 'OPEN') return 'Open';
    if (s === 'Quoted' || s === 'QUOTED' || s === 'QUALIFIED' || s === 'QUOTATION_SENT' || s === 'NEGOTIATION') return 'Quoted';
    if (s === 'Won' || s === 'WON' || s === 'ACCEPTED' || s === 'AWARDED') return 'Won';
    if (s === 'Lost' || s === 'LOST' || s === 'REJECTED') return 'Lost';
    if (s === 'Closed' || s === 'CLOSED' || s === 'EXPIRED') return 'Closed';
    return 'Open';
  };

  // Helper for source badges
  const getSourceBadge = (source?: SupplierLeadSourceType) => {
    switch (source) {
      case 'DIRECT_RFQ':
        return {
          label: 'Direct RFQ',
          icon: <Send className="w-3 h-3 text-purple-600" />,
          pill: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'QUOTED':
        return {
          label: 'Đã báo giá',
          icon: <CheckCircle2 className="w-3 h-3 text-indigo-600" />,
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'UNLOCKED':
        return {
          label: 'Mở khóa FC',
          icon: <Unlock className="w-3 h-3 text-emerald-600" />,
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'SAVED':
      default:
        return {
          label: 'Đã lưu',
          icon: <BookmarkCheck className="w-3 h-3 text-amber-600" />,
          pill: 'bg-amber-50 text-amber-700 border-amber-200',
        };
    }
  };

  // 5 exact Lead Statuses as requested in the design specification
  const stages: { 
    key: PipelineStage; 
    label: string; 
    subLabel: string;
    color: string; 
    border: string; 
    pill: string;
    headerBg: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    { 
      key: 'Open', 
      label: 'Open (Chưa báo giá)', 
      subLabel: 'Inquiry đang mở, chưa gửi báo giá',
      color: 'bg-blue-500', 
      border: 'border-blue-200', 
      pill: 'bg-blue-50 text-blue-700 border-blue-200',
      headerBg: 'bg-blue-50/50',
      icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
      description: 'Cơ hội mới tiếp nhận từ hệ thống, đang chờ nhà xe lập & gửi báo giá'
    },
    { 
      key: 'Quoted', 
      label: 'Quoted (Đã báo giá)', 
      subLabel: 'Đã nộp báo giá / Đang thẩm định',
      color: 'bg-amber-500', 
      border: 'border-amber-200', 
      pill: 'bg-amber-50 text-amber-700 border-amber-200',
      headerBg: 'bg-amber-50/50',
      icon: <Send className="w-3.5 h-3.5 text-amber-600" />,
      description: 'Báo giá đã được gửi thành công, khách hàng đang so sánh & đàm phán'
    },
    { 
      key: 'Won', 
      label: 'Won (Trúng thầu)', 
      subLabel: 'Khách hàng chốt thầu / Đã trao đơn',
      color: 'bg-emerald-500', 
      border: 'border-emerald-200', 
      pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      headerBg: 'bg-emerald-50/50',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      description: 'Báo giá được chấp thuận, hợp đồng vận tải đã ký kết'
    },
    { 
      key: 'Lost', 
      label: 'Lost (Trượt thầu)', 
      subLabel: 'Khách hàng chọn báo giá khác',
      color: 'bg-rose-500', 
      border: 'border-rose-200', 
      pill: 'bg-rose-50 text-rose-700 border-rose-200',
      headerBg: 'bg-rose-50/50',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      description: 'Gói thầu đã hoàn tất nhưng khách hàng chọn đơn vị cung cấp khác'
    },
    { 
      key: 'Closed', 
      label: 'Closed (Hết hạn)', 
      subLabel: 'Quá hạn nộp hoặc RFQ đã đóng',
      color: 'bg-slate-400', 
      border: 'border-slate-200', 
      pill: 'bg-slate-100 text-slate-700 border-slate-200',
      headerBg: 'bg-slate-100/50',
      icon: <ClockAlert className="w-3.5 h-3.5 text-slate-500" />,
      description: 'Yêu cầu báo giá đã hết hạn nhận hồ sơ hoặc bị hủy bỏ'
    },
  ];

  const filteredOpps = opportunities.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.code && o.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.owner && o.owner.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesService = serviceFilter === 'ALL' || o.serviceType === serviceFilter;
    const matchesSource = sourceFilter === 'ALL' || o.source === sourceFilter;
    return matchesSearch && matchesService && matchesSource;
  });

  const getStageTotal = (stage: PipelineStage) => {
    const stageItems = filteredOpps.filter((o) => normalizeStage(o.stage) === stage);
    const sum = stageItems.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
    return {
      count: stageItems.length,
      sumDisplay: (sum / 1000000).toLocaleString('vi-VN') + 'M ₫',
    };
  };

  const getServiceIcon = (service: ServiceType) => {
    switch (service) {
      case 'Trucking':
        return <Truck className="w-3 h-3 text-indigo-600" />;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Ship className="w-3 h-3 text-blue-600" />;
      case 'Air Freight':
        return <Plane className="w-3 h-3 text-sky-600" />;
      case 'Cold Chain':
        return <Snowflake className="w-3 h-3 text-cyan-600" />;
      case 'Warehousing':
        return <Warehouse className="w-3 h-3 text-amber-600" />;
      case 'Customs Clearance':
        return <ShieldCheck className="w-3 h-3 text-emerald-600" />;
      case 'Cross-border':
        return <Globe className="w-3 h-3 text-orange-600" />;
      default:
        return <Truck className="w-3 h-3 text-indigo-600" />;
    }
  };

  // Counts for sources
  const savedCount = opportunities.filter((o) => o.source === 'SAVED').length;
  const quotedCount = opportunities.filter((o) => o.source === 'QUOTED').length;
  const unlockedCount = opportunities.filter((o) => o.source === 'UNLOCKED').length;
  const directRfqCount = opportunities.filter((o) => o.source === 'DIRECT_RFQ').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Supplier Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">Opportunity Sales Pipeline (Kanban)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Opportunity Sales Pipeline
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              Chế độ xem tiến trình Lead
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Bảng Kanban tổng quan phản ánh trạng thái tự động của các cơ hội (Leads) dựa trên luồng xử lý Inquiry & Báo giá thực tế trong hệ thống.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Leads Table View</span>
          </button>
          <button
            id="kanban-new-deal-btn"
            onClick={onOpenCreateQuotation}
            className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quote</span>
          </button>
        </div>
      </div>

      {/* Info Callout explaining system-driven status */}
      <div className="mt-4 p-3 bg-blue-50/60 border border-blue-200/80 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <p className="font-medium">
          <strong>Lưu ý:</strong> Trạng thái Lead được hệ thống cập nhật tự động theo hành động thực tế (Khi nộp báo giá → <span className="font-bold text-amber-700">Quoted</span>, Khi khách hàng chốt hợp đồng → <span className="font-bold text-emerald-700">Won</span>, Khi chọn nhà xe khác → <span className="font-bold text-rose-700">Lost</span>, hoặc Quá hạn RFQ → <span className="font-bold text-slate-700">Closed</span>).
        </p>
      </div>

      {/* Filters Bar */}
      <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="kanban-search-input"
            type="text"
            placeholder="Tìm kiếm theo công ty, tuyến đường, mã lead, người phụ trách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Dịch vụ:</span>
          {['ALL', 'Trucking', 'Sea Freight (FCL)', 'Cold Chain', 'Cross-border', 'Warehousing'].map((svc) => (
            <button
              key={svc}
              onClick={() => setServiceFilter(svc)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                serviceFilter === svc 
                  ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {svc === 'ALL' ? 'Tất cả' : svc}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex items-start space-x-4 overflow-x-auto pb-8 pt-2">
        {stages.map((st) => {
          const stats = getStageTotal(st.key);
          const stageDeals = filteredOpps.filter((o) => normalizeStage(o.stage) === st.key);

          return (
            <div
              key={st.key}
              id={`kanban-col-${st.key.toLowerCase()}`}
              className="w-76 shrink-0 bg-slate-100/70 rounded-3xl p-3.5 border border-slate-200/80 flex flex-col min-h-[520px] max-h-[80vh]"
            >
              {/* Column Header */}
              <div className="p-2 mb-1 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${st.color} shadow-xs`} />
                  <span className="font-bold text-xs text-slate-900 tracking-tight">
                    {st.label}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full shadow-2xs border ${st.pill}`}>
                  {stats.count}
                </span>
              </div>

              {/* Total Value Bar */}
              <div className="px-2 pb-2.5 text-[11px] font-semibold text-slate-500 flex justify-between items-center border-b border-slate-200/80 mb-3">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Tổng giá trị:</span>
                <span className="text-slate-900 font-bold font-mono text-xs">{stats.sumDisplay}</span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {stageDeals.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs italic bg-white/40 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-1">
                    <span>Không có cơ hội nào</span>
                    <span className="text-[10px] text-slate-400 font-normal">{st.subLabel}</span>
                  </div>
                ) : (
                  stageDeals.map((opp) => {
                    const currentStageKey = normalizeStage(opp.stage);

                    return (
                      <div
                        key={opp.id}
                        id={`deal-card-${opp.id}`}
                        onClick={() => onSelectOpportunity(opp)}
                        className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group relative"
                      >
                        {/* Service & Code */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            {getServiceIcon(opp.serviceType)}
                            <span>{opp.serviceType}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            {opp.code || opp.quotationCode || 'LEAD'}
                          </span>
                        </div>

                        {/* Customer Company */}
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {opp.customerCompany}
                        </h4>
                        
                        {/* Route */}
                        <p className="text-[11px] text-slate-600 mt-1 font-medium truncate flex items-center gap-1">
                          <span className="text-slate-400 font-normal">Tuyến:</span>
                          <span className="truncate">{opp.route}</span>
                        </p>

                        {/* Value & Probability */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Giá trị dự kiến</span>
                            <span className="text-xs font-black text-emerald-700 font-mono">
                              {opp.estimatedValueDisplay || `${(opp.estimatedValue || 0).toLocaleString('vi-VN')} ₫`}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Xác suất</span>
                            <span className={`text-xs font-bold ${
                              opp.probability >= 80 ? 'text-emerald-700' : opp.probability >= 50 ? 'text-indigo-700' : 'text-slate-500'
                            }`}>
                              {opp.probability}%
                            </span>
                          </div>
                        </div>

                        {/* Next Action & Owner */}
                        <div className="mt-2.5 p-2 bg-slate-50 rounded-xl text-[10px] text-slate-600 space-y-1">
                          {opp.nextAction && (
                            <div className="flex items-center space-x-1 truncate text-slate-700 font-medium">
                              <Clock className="w-3 h-3 text-orange-500 shrink-0" />
                              <span className="truncate">{opp.nextAction}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-100">
                            <span>Phụ trách: <strong className="text-slate-700">{opp.owner}</strong></span>
                            <span>{opp.expectedCloseDate}</span>
                          </div>
                        </div>

                        {/* System Status / Action Display Bar (View-Only status reflection) */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Left: Stage status indication */}
                          <div>
                            {currentStageKey === 'Open' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                <Clock className="w-3 h-3 text-blue-600" />
                                <span>Chưa gửi báo giá</span>
                              </span>
                            ) : currentStageKey === 'Quoted' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                <Send className="w-3 h-3 text-amber-600" />
                                <span>{opp.quotationCode ? `Đã báo: ${opp.quotationCode}` : 'Đã báo giá'}</span>
                              </span>
                            ) : currentStageKey === 'Won' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Đã trúng thầu</span>
                              </span>
                            ) : currentStageKey === 'Lost' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>Trượt thầu</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                <ClockAlert className="w-3 h-3 text-slate-500" />
                                <span>Hết hạn RFQ</span>
                              </span>
                            )}
                          </div>

                          {/* Right: Informational View / Action */}
                          <div className="flex items-center gap-1">
                            {currentStageKey === 'Open' ? (
                              <button
                                onClick={() => onOpenCreateQuotation()}
                                className="px-2.5 py-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                                title="Lập báo giá cho cơ hội này"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>Báo giá ngay</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onSelectOpportunity(opp)}
                                className="px-2 py-1 text-[10px] font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                                title="Xem thông tin chi tiết khách hàng & cơ hội"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Xem</span>
                              </button>
                            )}
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
    </div>
  );
};
