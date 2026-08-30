import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  ArrowRight, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { QuotationItem, QuotationStatus, CurrentView } from '../../types';

interface SupplierQuotationsPageProps {
  quotations: QuotationItem[];
  onOpenCreateModal: () => void;
  onNavigate: (view: CurrentView) => void;
}

export const SupplierQuotationsPage: React.FC<SupplierQuotationsPageProps> = ({
  quotations,
  onOpenCreateModal,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.inquiryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.route.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Viewed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
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

  const statuses: QuotationStatus[] = ['Draft', 'Sent', 'Viewed', 'Negotiating', 'Accepted', 'Rejected', 'Expired'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        <span>Supplier Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-indigo-600">My Quotations</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Quotations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, edit, and track all formal freight rate bids and SLA proposals submitted to clients.
          </p>
        </div>

        <button
          id="supplier-create-quotation-top-btn"
          onClick={onOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Quotation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs my-6">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="supplier-quotes-search"
            type="text"
            placeholder="Search by quote ID, customer, route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            id="supplier-quote-status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div 
        id="supplier-quotes-table-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Quotation ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Inquiry / Subject</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Total Value</th>
                <th className="py-3.5 px-4">Payment Terms</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((q) => (
                <tr
                  key={q.id}
                  id={`supplier-quote-row-${q.code}`}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 font-mono font-bold text-indigo-700">
                    {q.code}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900">
                    {q.customerCompany}
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-semibold text-slate-800 truncate">{q.inquiryTitle}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{q.inquiryCode}</p>
                  </td>

                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {q.serviceType}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-black text-slate-900 text-sm">
                      {q.totalPrice.toLocaleString()} {q.currency}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-indigo-700 font-semibold">
                    {q.paymentTerms}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
