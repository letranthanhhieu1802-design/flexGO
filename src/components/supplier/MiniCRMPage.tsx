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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Supplier Mini CRM</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">My Customers</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Customers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tập trung tài khoản khách hàng từ 3 nguồn: <strong>Mở khóa FlexCredit</strong>, <strong>Landing Page Doanh nghiệp</strong> và <strong>Trao thầu Báo giá</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Lead Board</span>
          </button>

          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'supplier-pipeline' })}
            className="px-3.5 py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
          >
            Sales Pipeline
          </button>
        </div>
      </div>

      {/* 3 Customer Acquisition Channels Explanation Banner */}
      <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 rounded-md border border-indigo-400/30">
                CRM Acquisition Engine
              </span>
              <span className="text-xs text-indigo-200 font-semibold">3 Kênh thu hút khách hàng độc quyền</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Dữ liệu khách hàng được đồng bộ tự động khi bạn mở khóa lead thị trường, nhận yêu cầu trực tiếp qua Landing Page, hoặc khi chủ hàng chấp thuận trao thầu báo giá.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center shrink-0">
            <div 
              onClick={() => setSourceFilter('FLEXCREDIT_UNLOCKED')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                sourceFilter === 'FLEXCREDIT_UNLOCKED' ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-300">
                <Coins className="w-3 h-3" />
                <span>Lead Board</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{flexCreditCount}</p>
            </div>

            <div 
              onClick={() => setSourceFilter('DIRECT_PROFILE_REQUEST')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                sourceFilter === 'DIRECT_PROFILE_REQUEST' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-300">
                <Globe className="w-3 h-3" />
                <span>Landing Page</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{directProfileCount}</p>
            </div>

            <div 
              onClick={() => setSourceFilter('AWARDED_QUOTE')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                sourceFilter === 'AWARDED_QUOTE' ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400/40' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-300">
                <Trophy className="w-3 h-3" />
                <span>Trao Thầu</span>
              </div>
              <p className="text-base font-black text-white mt-0.5">{awardedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Tổng khách hàng (Shippers)</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Tất cả tài khoản CRM</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">Mở khóa Lead Board</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-800 mt-1">{flexCreditCount}</p>
          <span className="text-[11px] text-amber-700/80 mt-0.5 block">Dùng FlexCredit mở khóa</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900">Supplier Landing Page</span>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-800 mt-1">{directProfileCount}</p>
          <span className="text-[11px] text-emerald-700/80 mt-0.5 block">Inbound miễn phí (0 Credit)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-2xs bg-gradient-to-br from-white to-indigo-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-900">Trao thầu Báo giá (Won)</span>
            <Trophy className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-800 mt-1">{awardedCount}</p>
          <span className="text-[11px] text-indigo-700/80 mt-0.5 block">Ký kết hợp đồng thực tế</span>
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
