import React, { useState } from 'react';
import { 
  CreditTransaction, 
  TransactionType, 
  CurrentView, 
  UserProfile 
} from '../../types';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  X, 
  ChevronRight, 
  Receipt,
  Calendar,
  Building,
  Printer
} from 'lucide-react';

interface TransactionHistoryPageProps {
  transactions: CreditTransaction[];
  currentUser: UserProfile;
  onNavigate: (view: CurrentView) => void;
}

export const TransactionHistoryPage: React.FC<TransactionHistoryPageProps> = ({
  transactions,
  currentUser,
  onNavigate,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvoiceTx, setActiveInvoiceTx] = useState<CreditTransaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = selectedType === 'ALL' || tx.type === selectedType;
    const matchesSearch =
      tx.txCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.referenceCode && tx.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'TOP_UP':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LEAD_UNLOCK':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'QUOTATION_FEE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'INQUIRY_BOOST':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PROMO_BONUS':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-indigo-600" onClick={() => onNavigate({ type: 'public', tab: 'home' })}>
              FlexGO
            </span>
            <span>/</span>
            <span className="cursor-pointer hover:text-indigo-600" onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-wallet' })}>
              FlexCredit
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">Transaction History</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-indigo-600" />
            <span>FlexCredit Corporate Ledger</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete audit trail of all corporate credit purchases, RFQ lead unlocks, promotional credits, and tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-add' })}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Add Credits
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'TOP_UP', label: 'Top-Ups' },
            { id: 'LEAD_UNLOCK', label: 'Lead Unlocks' },
            { id: 'QUOTATION_FEE', label: 'Quote Fees' },
            { id: 'PROMO_BONUS', label: 'Bonus & Promos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by TX ID, reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Activity Title & Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Credits Change</th>
                <th className="p-4">Payment / Reference</th>
                <th className="p-4 text-right">E-Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                      {tx.txCode}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{tx.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tx.description}</div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getTypeBadge(tx.type)}`}>
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                      {tx.date} • {tx.time}
                    </td>

                    <td className="p-4 font-mono font-bold text-xs whitespace-nowrap">
                      <span className={tx.creditsChange > 0 ? 'text-emerald-600' : 'text-slate-900'}>
                        {tx.creditsChange > 0 ? `+${tx.creditsChange.toLocaleString()}` : tx.creditsChange.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans ml-1">Credits</span>
                    </td>

                    <td className="p-4 text-xs text-slate-600">
                      {tx.paymentMethod || tx.referenceCode || 'Internal Balance'}
                    </td>

                    <td className="p-4 text-right">
                      {tx.invoiceNumber ? (
                        <button
                          onClick={() => setActiveInvoiceTx(tx)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>VAT Invoice</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VAT Invoice Preview Modal */}
      {activeInvoiceTx && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  GO
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">VAT Electronic Invoice</h3>
                  <p className="text-xs text-slate-400 font-mono">No. {activeInvoiceTx.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveInvoiceTx(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400 block font-medium">Billed To (Customer):</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{currentUser.companyName}</span>
                  <span className="text-slate-500 block text-[11px]">Tax Code: 0314892019</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Issuer (Service Provider):</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">FlexGO Logistics Tech Vietnam JSC</span>
                  <span className="text-slate-500 block text-[11px]">Tax Code: 0318924018</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between font-semibold text-slate-900 border-b border-slate-100 pb-2">
                  <span>Description</span>
                  <span>Amount (VND)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{activeInvoiceTx.title}</span>
                  <span className="font-mono">{((activeInvoiceTx.amountVND || 0) / 1.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>VAT (10% standard rate)</span>
                  <span className="font-mono">{((activeInvoiceTx.amountVND || 0) - ((activeInvoiceTx.amountVND || 0) / 1.1)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-2 text-sm">
                  <span>Total Incl. VAT</span>
                  <span className="font-mono text-indigo-700">{(activeInvoiceTx.amountVND || 0).toLocaleString()} VND</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified Digital Tax Stamp
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('PDF invoice downloaded successfully.')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
