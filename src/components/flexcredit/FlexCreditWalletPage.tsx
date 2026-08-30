import React from 'react';
import { 
  FlexCreditWallet, 
  CreditTransaction, 
  CurrentView, 
  UserProfile 
} from '../../types';
import { 
  Coins, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw 
} from 'lucide-react';

interface FlexCreditWalletPageProps {
  wallet: FlexCreditWallet;
  transactions: CreditTransaction[];
  currentUser: UserProfile;
  onNavigate: (view: CurrentView) => void;
  onToggleAutoReload?: (enabled: boolean) => void;
}

export const FlexCreditWalletPage: React.FC<FlexCreditWalletPageProps> = ({
  wallet,
  transactions,
  currentUser,
  onNavigate,
}) => {
  const recentTransactions = transactions.slice(0, 5);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return 'bg-amber-500 text-slate-900 border-amber-300';
      case 'Silver':
        return 'bg-slate-300 text-slate-900 border-slate-400';
      case 'Enterprise Platinum':
        return 'bg-indigo-900 text-white border-indigo-500';
      default:
        return 'bg-indigo-600 text-white border-indigo-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-indigo-600" onClick={() => onNavigate({ type: 'public', tab: 'home' })}>
              FlexGO
            </span>
            <span>/</span>
            <span className="font-semibold text-slate-700">FlexCredit</span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">My Wallet</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Coins className="w-7 h-7 text-amber-500" />
            <span>FlexCredit Corporate Wallet</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your FlexCredits for instant Lead Board RFQ bidding, priority inquiries, and verified carrier unlocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-transactions' })}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Transaction Ledger</span>
          </button>
          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-add' })}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add FlexCredit</span>
          </button>
        </div>
      </div>

      {/* Main Wallet Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Hero Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-300">
                  Corporate Credit Account
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getTierColor(wallet.tierName)}`}>
                  {wallet.tierName} Tier
                </span>
              </div>
              <span className="text-xs text-indigo-200 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 1 Credit = 1,000 VND
              </span>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium text-indigo-200">Available Balance</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  {wallet.balanceCredits.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-amber-400 font-sans">FlexCredits</span>
              </div>
              <p className="text-sm text-indigo-300 mt-1">
                ≈ {(wallet.balanceVND).toLocaleString()} VND Value (Includes {wallet.bonusCredits} Loyalty Bonus Credits)
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-indigo-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-indigo-300 font-medium">Lead Unlocks Discount</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">-{wallet.discountOnLeads}% OFF</p>
            </div>
            <div>
              <p className="text-[11px] text-indigo-300 font-medium">Monthly Credit Burn</p>
              <p className="text-base font-bold text-white mt-0.5">{wallet.monthlySpentCredits.toLocaleString()} Credits</p>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end">
              <button
                onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-add' })}
                className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Instant Top-Up</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier Benefits & Rate Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>FlexCredit Rate Card</span>
              </h3>
              <span className="text-[11px] text-slate-400">Live Fees</span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800">Unlock Shipper Lead Contact</p>
                  <p className="text-[11px] text-slate-500">Includes direct email & phone</p>
                </div>
                <span className="font-bold text-indigo-600 font-mono">100 Credits</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800">Submit Verified Quotation</p>
                  <p className="text-[11px] text-slate-500">Guaranteed buyer view & SLA badge</p>
                </div>
                <span className="font-bold text-indigo-600 font-mono">50 Credits</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800">Urgent Lead Board Broadcast</p>
                  <p className="text-[11px] text-slate-500">Top sticky banner for 72h</p>
                </div>
                <span className="font-bold text-indigo-600 font-mono">200 Credits</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800">API Telematics Webhook Feed</p>
                  <p className="text-[11px] text-slate-500">Real-time GPS dispatch bridge</p>
                </div>
                <span className="font-bold text-emerald-600 font-mono">FREE in Gold</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              Tax E-Invoice Supported
            </p>
            <p className="text-[11px] text-indigo-700 mt-0.5">
              10% VAT electronic invoice automatically generated and emailed to your accounting department.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs / Auto Reload & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Recent Wallet Activity</h2>
              <p className="text-xs text-slate-500">Latest credit additions and lead bidding debits</p>
            </div>
            <button
              onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-transactions' })}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    tx.creditsChange > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tx.creditsChange > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{tx.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tx.date} at {tx.time} • Ref: {tx.txCode}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-mono font-bold text-sm ${
                    tx.creditsChange > 0 ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {tx.creditsChange > 0 ? `+${tx.creditsChange.toLocaleString()}` : tx.creditsChange.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto Top-Up & Safety Escrow */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>Smart Auto Top-Up</span>
          </h2>
          <p className="text-xs text-slate-500">
            Prevent your RFQ bidding and quotation submissions from pausing during high-velocity quote surges.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Auto Top-Up Status</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                {wallet.autoTopUpEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-2 space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Trigger Threshold:</span>
                <span className="font-mono font-semibold">{wallet.autoTopUpThreshold} Credits</span>
              </div>
              <div className="flex justify-between">
                <span>Top-Up Package:</span>
                <span className="font-mono font-semibold">+{wallet.autoTopUpAmount} Credits</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold">Linked Corporate Card (•• 4219)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-add' })}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Configure Auto Top-Up
          </button>
        </div>
      </div>
    </div>
  );
};
