import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  DollarSign, 
  ArrowRight, 
  Star, 
  Sparkles, 
  Eye, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  ShieldCheck, 
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { QuotationItem, QuotationStatus, ServiceType, CurrentView } from '../../types';

interface CustomerQuotationsPageProps {
  quotations: QuotationItem[];
  onNavigate: (view: CurrentView) => void;
  onAwardQuote: (quoteId: string) => void;
}

export const CustomerQuotationsPage: React.FC<CustomerQuotationsPageProps> = ({
  quotations,
  onNavigate,
  onAwardQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<QuotationItem | null>(null);

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch =
      q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.inquiryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.route.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || q.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
      case 'Negotiating':
        return 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Expired':
        return 'bg-slate-100 text-slate-400 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Customer Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">Quotation Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quotation Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, evaluate, and compare all logistics bids received from FlexGO suppliers.
          </p>
        </div>

        <button
          id="goto-compare-quotes-btn"
          onClick={() => onNavigate({ type: 'workspace', view: 'customer-compare' })}
          className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Comparison Matrix</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs my-6">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="quotes-search-input"
            type="text"
            placeholder="Search by quote ID, supplier, route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <select
            id="quotes-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Negotiating">Negotiating</option>
          </select>

          <select
            id="quotes-service-filter"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Services</option>
            <option value="Trucking">Trucking</option>
            <option value="Sea Freight (FCL)">Sea Freight (FCL)</option>
            <option value="Air Freight">Air Freight</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div 
        id="customer-quotes-table-card"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Quotation ID</th>
                <th className="py-3.5 px-4">Inquiry / Requirement</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Transit Time</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((q) => (
                <tr
                  key={q.id}
                  id={`quote-row-${q.code}`}
                  onClick={() => setSelectedQuote(q)}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 font-mono font-semibold text-indigo-700">
                    {q.code}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-semibold text-slate-900 truncate">{q.inquiryTitle}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{q.inquiryCode}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                        {q.supplierName.slice(0, 2)}
                      </div>
                      <span className="font-medium text-slate-800">{q.supplierName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {q.serviceType}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 text-sm">
                      {q.totalPrice.toLocaleString()} {q.currency}
                    </span>
                    {q.isBestPrice && (
                      <span className="block text-[10px] font-bold text-emerald-600">
                        🟢 Lowest Price
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {q.transitTimeDisplay}
                  </td>
                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {q.validUntil}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] border ${getStatusBadge(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        id={`view-quote-btn-${q.code}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(q);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Quotation Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            id="quote-detail-modal"
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-300 font-mono font-semibold">
                  {selectedQuote.code} • {selectedQuote.inquiryCode}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Quotation from {selectedQuote.supplierName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Supplier Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                    {selectedQuote.supplierName.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedQuote.supplierName}</h4>
                    <p className="text-[11px] text-slate-500">Verified FlexGO Partner • Rating {selectedQuote.supplierRating}/5.0</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Route</span>
                  <p className="font-semibold text-slate-800">{selectedQuote.route}</p>
                </div>
              </div>

              {/* Itemized Pricing Breakdown */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Itemized Pricing Breakdown
                </h4>
                <div className="space-y-2 divide-y divide-slate-100">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Base Freight Rate:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedQuote.baseFreight.toLocaleString()} {selectedQuote.currency}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-600">Fuel Surcharge (BAF):</span>
                    <span className="font-semibold text-slate-900">
                      {selectedQuote.fuelSurcharge.toLocaleString()} {selectedQuote.currency}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-600">Terminal & Handling Fee (THC):</span>
                    <span className="font-semibold text-slate-900">
                      {selectedQuote.handlingFee.toLocaleString()} {selectedQuote.currency}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-600">Documentation & EDI Fee:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedQuote.documentationFee.toLocaleString()} {selectedQuote.currency}
                    </span>
                  </div>
                  {selectedQuote.otherCharges > 0 && (
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-600">Other Surcharges ({selectedQuote.otherChargesNote || 'Special Surcharge'}):</span>
                      <span className="font-semibold text-slate-900">
                        {selectedQuote.otherCharges.toLocaleString()} {selectedQuote.currency}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 text-sm font-bold text-indigo-900 border-t-2 border-slate-200">
                    <span>TOTAL ESTIMATED COST:</span>
                    <span className="text-base text-indigo-600">
                      {selectedQuote.totalPrice.toLocaleString()} {selectedQuote.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Terms */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Transit Time</span>
                  <span className="font-bold text-slate-800">{selectedQuote.transitTimeDisplay}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment Terms</span>
                  <span className="font-bold text-indigo-700">{selectedQuote.paymentTerms}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Validity Date</span>
                  <span className="font-bold text-slate-800">{selectedQuote.validUntil}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                  Supplier Terms & Notes
                </span>
                <p className="text-slate-700 italic">
                  "{selectedQuote.notes}"
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedQuote(null);
                    onNavigate({ type: 'workspace', view: 'customer-compare' });
                  }}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Compare with other quotes →
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      onAwardQuote(selectedQuote.id);
                      setSelectedQuote(null);
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                  >
                    Accept & Award Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
