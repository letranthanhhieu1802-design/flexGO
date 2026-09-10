import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  ChevronRight, 
  ShieldCheck, 
  Star,
  Coins,
  Globe,
  Trophy,
  Sparkles,
  Info,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Zap
} from 'lucide-react';
import { CRMCustomer, CustomerSourceType, CurrentView, InquiryItem, SupplierLeadItem } from '../../types';

interface MiniCRMPageProps {
  customers: CRMCustomer[];
  inquiries?: InquiryItem[];
  leads?: SupplierLeadItem[];
  viewedInquiryCodes?: string[];
  onSelectCustomer: (customerId: string, initialTab?: 'overview' | 'inquiries') => void;
  onNavigate: (view: CurrentView) => void;
}

export const MiniCRMPage: React.FC<MiniCRMPageProps> = ({
  customers,
  inquiries = [],
  leads = [],
  viewedInquiryCodes = [],
  onSelectCustomer,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // Calculate Seen (A) and Unseen (B) inquiries for each customer
  const getCustomerInquiryCounts = (c: CRMCustomer) => {
    const custLeads = (leads || []).filter((l) => {
      const matchComp =
        l.customerCompany?.toLowerCase().trim() === c.companyName.toLowerCase().trim() ||
        (c.companyShortName && l.customerCompany?.toLowerCase().trim() === c.companyShortName.toLowerCase().trim());
      const matchInq = c.sourceDetails?.inquiryCode && (l.code === c.sourceDetails.inquiryCode || l.inquiryCode === c.sourceDetails.inquiryCode);
      return matchComp || matchInq;
    });

    const custInqs = (inquiries || []).filter((i) => {
      const matchComp = i.customerCompany?.toLowerCase().trim() === c.companyName.toLowerCase().trim();
      const matchInq = c.sourceDetails?.inquiryCode && i.code === c.sourceDetails.inquiryCode;
      return matchComp || matchInq;
    });

    const distinctCodes = new Set<string>();
    custLeads.forEach((l) => {
      if (l.code) distinctCodes.add(l.code);
      if (l.inquiryCode) distinctCodes.add(l.inquiryCode);
    });
    custInqs.forEach((i) => {
      if (i.code) distinctCodes.add(i.code);
    });

    const totalCount = Math.max(c.inquiriesCount ?? c.openOpportunitiesCount ?? 1, distinctCodes.size);
    const viewedSet = new Set(viewedInquiryCodes || []);

    let seen = 0;
    let unseen = 0;

    if (distinctCodes.size > 0) {
      distinctCodes.forEach((code) => {
        if (viewedSet.has(code)) {
          seen++;
        } else {
          unseen++;
        }
      });
      if (totalCount > seen + unseen) {
        seen += totalCount - (seen + unseen);
      }
    } else {
      if (c.id === 'crm-01') {
        const hasSeenFirst = viewedSet.has('FG-2608250001');
        seen = hasSeenFirst ? 1 : 0;
        unseen = totalCount - seen;
      } else if (c.id === 'crm-02') {
        const hasSeenFirst = viewedSet.has('FG-2608250002');
        seen = hasSeenFirst ? 2 : 1;
        unseen = totalCount - seen;
      } else {
        seen = totalCount;
        unseen = 0;
      }
    }

    return { seen, unseen, total: seen + unseen };
  };

  // Source count metrics
  const totalCount = customers.length;
  const flexCreditCount = customers.filter((c) => c.source === 'FLEXCREDIT_UNLOCKED').length;
  const directProfileCount = customers.filter((c) => c.source === 'DIRECT_PROFILE_REQUEST').length;
  const awardedCount = customers.filter((c) => c.source === 'AWARDED_QUOTE').length;

  const filtered = customers.filter((c) => {
    const matchesSearch =
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.taxId && c.taxId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.sourceDetails?.leadCode && c.sourceDetails.leadCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.sourceDetails?.quoteCode && c.sourceDetails.quoteCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || c.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: CRMCustomer['status']) => {
    switch (status) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800 border-purple-200 font-bold';
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold';
      case 'Prospect':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Dormant':
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const renderSourceBadge = (customer: CRMCustomer) => {
    const source = customer.source || 'FLEXCREDIT_UNLOCKED';
    switch (source) {
      case 'FLEXCREDIT_UNLOCKED':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs whitespace-nowrap">
            flexCredit
          </span>
        );

      case 'DIRECT_PROFILE_REQUEST':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs whitespace-nowrap">
            Direct
          </span>
        );

      case 'AWARDED_QUOTE':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs whitespace-nowrap">
            Awarded
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-6 animate-in fade-in duration-200 space-y-5">
      {/* ========================================================= */}
      {/* 1. HERO HEADER BLOCK & 4 KPI TILES (LeadBoard Dark Style) */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
              <span>Supplier Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-400 font-bold">My Customers (Mini CRM)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shadow-xs shrink-0">
                <Users className="w-5 h-5 text-indigo-200" />
              </div>
              <span>My Customers</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Quản lý tập trung tài khoản khách hàng từ 3 nguồn: <strong>Mở khóa FlexCredit</strong>, <strong>Landing Page Doanh nghiệp</strong> và <strong>Trao thầu Báo giá (Won)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="goto-leadboard-btn"
              onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Sàn Lead Board</span>
            </button>

            <button
              id="goto-sales-pipeline-btn"
              onClick={() => onNavigate({ type: 'workspace', view: 'supplier-pipeline' })}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>+ Sales Pipeline</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive KPI Cards in LeadBoard Dark Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10 relative z-10">
          {/* Card 1: Tổng khách hàng */}
          <div 
            onClick={() => setSourceFilter('ALL')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'ALL'
                ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Tổng Khách Hàng (Shippers)</span>
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400 tracking-tight">{totalCount}</span>
              <span className="text-xs font-bold text-cyan-300/90">chủ hàng</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Toàn bộ tài khoản trong CRM</p>
          </div>

          {/* Card 2: Mở khóa Lead Board (FlexCredit) */}
          <div 
            onClick={() => setSourceFilter('FLEXCREDIT_UNLOCKED')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'FLEXCREDIT_UNLOCKED'
                ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Mở Khóa Lead Board</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 tracking-tight">{flexCreditCount}</span>
              <span className="text-xs font-bold text-amber-300/90">khách hàng</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Dùng FlexCredit mở khóa liên hệ</p>
          </div>

          {/* Card 3: Landing Page / Profile Inbound */}
          <div 
            onClick={() => setSourceFilter('DIRECT_PROFILE_REQUEST')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'DIRECT_PROFILE_REQUEST'
                ? 'bg-slate-800/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Landing Page Doanh Nghiệp</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Globe className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">{directProfileCount}</span>
              <span className="text-xs font-bold text-emerald-300/90">khách hàng</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Inbound trực tiếp (0 Credit)</p>
          </div>

          {/* Card 4: Trao thầu Báo giá (Won) */}
          <div 
            onClick={() => setSourceFilter('AWARDED_QUOTE')}
            className={`backdrop-blur-md rounded-2xl p-4 border transition-all cursor-pointer group select-none ${
              sourceFilter === 'AWARDED_QUOTE'
                ? 'bg-slate-800/90 border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-950/40'
                : 'bg-slate-800/60 border-white/10 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Trao Thầu Báo Giá (Won)</span>
              <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-300 tracking-tight">{awardedCount}</span>
              <span className="text-xs font-bold text-indigo-200/90">khách hàng</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">Ký kết hợp đồng vận chuyển thực tế</p>
          </div>
        </div>
      </div>

      {/* Source Quick Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'Tất cả nguồn', count: totalCount, icon: Layers },
          { id: 'FLEXCREDIT_UNLOCKED', label: '1. Mở khóa Lead Board (FlexCredit)', count: flexCreditCount, icon: Coins },
          { id: 'DIRECT_PROFILE_REQUEST', label: '2. Landing Page / Profile Inbound (Free)', count: directProfileCount, icon: Globe },
          { id: 'AWARDED_QUOTE', label: '3. Trao thầu Báo giá (Awarded)', count: awardedCount, icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = sourceFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSourceFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs mb-6">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="crm-search-input"
            type="text"
            placeholder="Tìm theo tên công ty, người liên hệ, ngành hàng, mã lead/quote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <select
            id="crm-source-filter"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Tất cả kênh nguồn (3 Nguồn)</option>
            <option value="FLEXCREDIT_UNLOCKED">⚡ 1. Mở khóa Lead Board (FlexCredit)</option>
            <option value="DIRECT_PROFILE_REQUEST">🌐 2. Supplier Profile / Landing Page</option>
            <option value="AWARDED_QUOTE">🏆 3. Khách hàng Trao thầu (Awarded)</option>
          </select>

          <select
            id="crm-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Tất cả hạng VIP/Active</option>
            <option value="VIP">Hạng VIP</option>
            <option value="Active">Hạng Active</option>
            <option value="Prospect">Hạng Prospect</option>
          </select>
        </div>
      </div>

      {/* CRM Table */}
      <div 
        id="crm-customers-table-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-12">STT</th>
                <th className="py-3.5 px-4 min-w-[130px]">Mã Khách Hàng</th>
                <th className="py-3.5 px-4 min-w-[180px]">Thông Tin PIC</th>
                <th className="py-3.5 px-4 min-w-[220px]">Doanh Nghiệp</th>
                <th className="py-3.5 px-4 min-w-[180px]">Ngành Hàng</th>
                <th className="py-3.5 px-4">Nguồn</th>
                <th className="py-3.5 px-4 text-center">Số Inquiries</th>
                <th className="py-3.5 px-4 font-bold">Tổng Giá Trị</th>
                <th className="py-3.5 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">Không tìm thấy khách hàng phù hợp</p>
                    <p className="text-[11px] text-slate-400 mt-1">Thử thay đổi bộ lọc nguồn hoặc từ khóa tìm kiếm</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    id={`crm-row-${c.id}`}
                    onClick={() => onSelectCustomer(c.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Cột 1: STT */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Cột 2: Mã Khách Hàng (C-YYMMDDXX) */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-200/70 inline-block shadow-2xs">
                        {c.code || `C-2608150${idx + 1}`}
                      </span>
                    </td>

                    {/* Cột 3: Thông Tin PIC (Tên + Chức vụ subtext) */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                        {c.contactPerson}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {c.contactRole || 'Đại diện mua hàng'}
                      </div>
                    </td>

                    {/* Cột 4: Doanh Nghiệp (Tên công ty + MST) */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {c.companyName}
                      </div>
                      {c.taxId ? (
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          MST: {c.taxId}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic mt-0.5">
                          MST: Đang cập nhật
                        </div>
                      )}
                    </td>

                    {/* Cột 5: Ngành Hàng */}
                    <td className="py-4 px-4">
                      <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block max-w-[200px] leading-snug">
                        {c.industry || 'Đa ngành nghề'}
                      </span>
                    </td>

                    {/* Cột 6: Nguồn (Awarded / Direct / flexCredit) */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {renderSourceBadge(c)}
                    </td>

                    {/* Cột 7: Số Inquiries - A (+B) */}
                    <td className="py-4 px-4 text-center">
                      {(() => {
                        const counts = getCustomerInquiryCounts(c);
                        return (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCustomer(c.id, 'inquiries');
                            }}
                            className="inline-flex items-center justify-center gap-1 min-w-[52px] h-7 px-2 text-xs font-mono font-bold text-slate-800 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer group/inq"
                            title="Bấm để chuyển sang Tab Inquiries của khách hàng này"
                          >
                            <span>{counts.seen}</span>
                            {counts.unseen > 0 ? (
                              <span className="text-amber-700 font-extrabold bg-amber-100/90 px-1 py-0.2 rounded border border-amber-300 text-[11px] group-hover/inq:bg-amber-200">
                                (+{counts.unseen})
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal text-[11px]">
                                (+0)
                              </span>
                            )}
                          </button>
                        );
                      })()}
                    </td>

                    {/* Cột 8: Tổng Giá Trị */}
                    <td className="py-4 px-4 font-black text-slate-900 whitespace-nowrap text-xs">
                      {c.estimatedValueDisplay || c.totalRevenueDisplay || '1,450,000,000 ₫'}
                    </td>

                    {/* Cột 9: Chi Tiết */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectCustomer(c.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        360° View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
