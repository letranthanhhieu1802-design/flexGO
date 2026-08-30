import React, { useState } from 'react';
import { 
  ContractItem, 
  ContractStatus, 
  CurrentView, 
  UserProfile 
} from '../../types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  Truck, 
  Ship, 
  Plane, 
  ChevronRight, 
  Eye, 
  PenTool, 
  Plus, 
  Building, 
  Calendar,
  X,
  FileCheck,
  ArrowUpRight
} from 'lucide-react';

interface ContractsPageProps {
  contracts: ContractItem[];
  currentUser: UserProfile;
  mode: 'CUSTOMER' | 'SUPPLIER';
  onNavigate: (view: CurrentView) => void;
  onUpdateContractStatus?: (contractId: string, newStatus: ContractStatus) => void;
}

export const ContractsPage: React.FC<ContractsPageProps> = ({
  contracts,
  currentUser,
  mode,
  onNavigate,
  onUpdateContractStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContract, setActiveContract] = useState<ContractItem | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signatureName, setSignatureName] = useState(currentUser.name);
  const [signatureTitle, setSignatureTitle] = useState(currentUser.roleTitle);
  const [signAgreed, setSignAgreed] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  // Filter contracts
  const filteredContracts = contracts.filter((c) => {
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.supplierCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.route.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const activeCount = contracts.filter((c) => c.status === 'Active').length;
  const pendingCount = contracts.filter((c) => c.status === 'Pending Signature').length;
  const totalValueVND = contracts.reduce((acc, curr) => acc + curr.totalValueVND, 0);

  const getServiceIcon = (type: string) => {
    if (type.includes('Truck')) return <Truck className="w-4 h-4 text-indigo-600" />;
    if (type.includes('Sea')) return <Ship className="w-4 h-4 text-cyan-600" />;
    if (type.includes('Air')) return <Plane className="w-4 h-4 text-sky-600" />;
    return <FileText className="w-4 h-4 text-indigo-600" />;
  };

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Signature':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Draft':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Terminated':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleSignContract = () => {
    if (activeContract && onUpdateContractStatus) {
      onUpdateContractStatus(activeContract.id, 'Active');
      setActiveContract({
        ...activeContract,
        status: 'Active',
        signedDate: new Date().toISOString().split('T')[0],
      });
      setIsSignModalOpen(false);
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
            <span className="font-semibold text-slate-700">
              {mode === 'CUSTOMER' ? 'Customer' : 'Supplier'} Workspace
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">My Contracts</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-indigo-600" />
            <span>{mode === 'CUSTOMER' ? 'Customer Logistics Contracts' : 'Supplier Commercial Contracts'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage binding digital Master Service Agreements (MSA), escrow deposits, SLA milestones, and e-signatures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate({ type: 'workspace', view: mode === 'CUSTOMER' ? 'customer-inquiries' : 'supplier-leads' })}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>{mode === 'CUSTOMER' ? 'New Inquiry' : 'Browse Leads'}</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Binding Contracts</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{activeCount}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% SLA compliance
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending E-Signature</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Requires digital sign-off</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contract Portfolio</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{(totalValueVND / 1000000).toLocaleString()}M <span className="text-xs text-slate-400">VND</span></p>
            <p className="text-xs text-slate-500 mt-0.5">Across {contracts.length} agreements</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {['All', 'Active', 'Pending Signature', 'Completed', 'Draft'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by contract ID, partner, route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Contract ID</th>
                <th className="p-4">Agreement Title & Route</th>
                <th className="p-4">{mode === 'CUSTOMER' ? 'Assigned Supplier' : 'Shipper Client'}</th>
                <th className="p-4">Annual / Total Value</th>
                <th className="p-4">Status</th>
                <th className="p-4">Effective Dates</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No contracts found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setActiveContract(c)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-indigo-700 text-xs whitespace-nowrap">
                      {c.code}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{c.title}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        {getServiceIcon(c.serviceType)}
                        <span>{c.route}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-900 text-xs">
                        {mode === 'CUSTOMER' ? c.supplierCompany : c.customerCompany}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Contact: {mode === 'CUSTOMER' ? c.supplierName : c.customerName}
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-900 text-xs whitespace-nowrap">
                      {c.totalValueDisplay}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                      {c.effectiveDate} → {c.expiryDate}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === 'Pending Signature' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveContract(c);
                              setIsSignModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Sign</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveContract(c);
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Drawer / Modal */}
      {activeContract && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {activeContract.code}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusBadge(activeContract.status)}`}>
                    {activeContract.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{activeContract.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Linked to Inquiry <span className="font-semibold text-slate-700">{activeContract.inquiryCode}</span> & Quote <span className="font-semibold text-slate-700">{activeContract.quotationCode}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveContract(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Agreement Terms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Service Route</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{activeContract.route}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Contract Value</span>
                <span className="font-semibold text-indigo-700 mt-0.5 block">{activeContract.totalValueDisplay}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Terms</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{activeContract.paymentTerms}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Security Deposit</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block">
                  {(activeContract.depositAmountVND / 1000000).toLocaleString()}M VND ({activeContract.depositStatus})
                </span>
              </div>
            </div>

            {/* SLA Terms */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Service Terms & SLA</h3>
              <ul className="space-y-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-3">
                {activeContract.termsSummary.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment & Operational Milestones */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Delivery & Settlement Milestones</h3>
              <div className="space-y-2">
                {activeContract.milestones.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{m.title}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          {m.percentage}% ({(m.amountVND / 1000000).toLocaleString()}M VND)
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{m.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      m.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Legal Documents */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Attached PDF Legal Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeContract.documents.map((doc) => (
                  <div key={doc.id} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="truncate font-medium text-slate-800">{doc.name}</span>
                    </div>
                    <button
                      onClick={() => setPreviewDoc(doc.name)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{doc.size}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400">
                Digital Signatures secured by FlexGO Cryptographic Escrow
              </span>
              <div className="flex items-center gap-3">
                {activeContract.status === 'Pending Signature' && (
                  <button
                    onClick={() => setIsSignModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Execute Digital Signature</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveContract(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E-Signature Modal */}
      {isSignModalOpen && activeContract && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600" />
                <span>Sign Digital Service Agreement</span>
              </h3>
              <button onClick={() => setIsSignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
              <p className="font-semibold text-indigo-900">Contract Reference: {activeContract.code}</p>
              <p className="mt-0.5">Between {activeContract.customerCompany} and {activeContract.supplierCompany}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Authorized Signatory Name</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Corporate Title / Role</label>
                <input
                  type="text"
                  value={signatureTitle}
                  onChange={(e) => setSignatureTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signAgreed}
                    onChange={(e) => setSignAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-600">
                    I confirm that I am legally authorized to execute this agreement and accept all SLA commitments and payment milestones outlined in {activeContract.code}.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="px-3.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                disabled={!signAgreed}
                onClick={handleSignContract}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Sign Contract</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
