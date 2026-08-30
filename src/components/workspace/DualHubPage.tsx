import React from 'react';
import { 
  Building2, 
  ArrowRight, 
  Truck, 
  Flame, 
  DollarSign, 
  Sparkles, 
  BarChart3, 
  CheckCircle2, 
  Users,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { CurrentView, UserPersona, InquiryItem, QuotationItem, SupplierLeadItem } from '../../types';

interface DualHubPageProps {
  currentUser: UserPersona;
  inquiries: InquiryItem[];
  quotations: QuotationItem[];
  leads: SupplierLeadItem[];
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: () => void;
  onOpenCreateQuotation: () => void;
}

export const DualHubPage: React.FC<DualHubPageProps> = ({
  currentUser,
  inquiries,
  quotations,
  leads,
  onNavigate,
  onOpenCreateInquiry,
  onOpenCreateQuotation,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Unified Account Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">Dual Operation Hub</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 lg:p-8 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-orange-400 text-slate-950 rounded-full uppercase tracking-wider">
                Full 3PL Dual Capability
              </span>
              <span className="text-xs text-indigo-300 font-mono">
                {currentUser.companyName}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-2">
              Dual Logistics Control Center
            </h1>
            <p className="text-sm text-indigo-200 mt-1 max-w-2xl">
              Seamlessly toggle between your <strong>Procurement Operations</strong> (buying capacity from carriers) and <strong>Sales Pipelines</strong> (providing services to enterprise shippers).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCreateInquiry}
              className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-orange-400 hover:bg-orange-500 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Post RFQ
            </button>
            <button
              onClick={onOpenCreateQuotation}
              className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Quote Deal
            </button>
          </div>
        </div>
      </div>

      {/* Two Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Workspace Pane */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Shipper Procurement</h3>
                  <p className="text-xs text-slate-500">Manage RFQs & Compare Carrier Quotes</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {inquiries.length} Active RFQs
              </span>
            </div>

            {/* Quick List */}
            <div className="mt-4 space-y-3">
              {inquiries.slice(0, 2).map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => onNavigate({ type: 'workspace', view: 'customer-inquiry-detail', params: { inquiryCode: inq.code } })}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-700">{inq.code}</span>
                    <span className="font-semibold text-slate-500">{inq.quotesCount} quotes received</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{inq.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{inq.route}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate({ type: 'workspace', view: 'customer-inquiries' })}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
            >
              <span>Open My Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate({ type: 'workspace', view: 'customer-compare' })}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              Comparison Matrix
            </button>
          </div>
        </div>

        {/* Supplier Workspace Pane */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Supplier Sales Pipeline</h3>
                  <p className="text-xs text-slate-500">Lead Qualification & Quotation Submissions</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {leads.length} Hot Leads
              </span>
            </div>

            {/* Quick List */}
            <div className="mt-4 space-y-3">
              {leads.slice(0, 2).map((ld) => (
                <div
                  key={ld.id}
                  onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-700">{ld.code}</span>
                    <span className="font-bold text-emerald-700">{ld.estimatedValueDisplay}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{ld.customerCompany}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{ld.route}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
            >
              <span>Open My Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate({ type: 'workspace', view: 'supplier-pipeline' })}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              Sales Kanban
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
