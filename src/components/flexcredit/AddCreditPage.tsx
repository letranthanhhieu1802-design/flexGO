import React, { useState } from 'react';
import { 
  CreditPackage, 
  CurrentView, 
  UserProfile, 
  FlexCreditWallet, 
  CreditTransaction 
} from '../../types';
import { 
  PlusCircle, 
  Check, 
  CreditCard, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  Receipt, 
  ChevronRight,
  Calculator,
  Percent
} from 'lucide-react';

interface AddCreditPageProps {
  wallet: FlexCreditWallet;
  packages: CreditPackage[];
  currentUser: UserProfile;
  onNavigate: (view: CurrentView) => void;
  onAddCreditSuccess?: (addedCredits: number, priceVND: number, packageName: string, tx: CreditTransaction) => void;
}

export const AddCreditPage: React.FC<AddCreditPageProps> = ({
  wallet,
  packages,
  currentUser,
  onNavigate,
  onAddCreditSuccess,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[1]?.id || packages[0]?.id);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customCredits, setCustomCredits] = useState<number>(3000);
  const [paymentMethod, setPaymentMethod] = useState<'VIETQR' | 'VNPAY' | 'BANK_TRANSFER' | 'CARD'>('VIETQR');
  const [requestVATInvoice, setRequestVATInvoice] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [completedTx, setCompletedTx] = useState<CreditTransaction | null>(null);

  // Selected package details
  const currentPkg = packages.find((p) => p.id === selectedPackageId) || packages[1];

  // Calculated values
  const totalCredits = isCustomMode
    ? customCredits + Math.floor(customCredits * 0.1) // 10% bonus
    : currentPkg.credits + currentPkg.bonusCredits;

  const basePriceVND = isCustomMode ? customCredits * 1000 : currentPkg.priceVND;
  const discountVND = couponApplied ? Math.floor(basePriceVND * 0.1) : 0;
  const finalPriceVND = basePriceVND - discountVND;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'FLEX2026' || couponCode.trim().toUpperCase() === 'LOGISTICS10') {
      setCouponApplied(true);
    } else {
      alert('Invalid Promo Code. Try "FLEX2026" or "LOGISTICS10" for 10% instant discount!');
    }
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newTx: CreditTransaction = {
        id: `tx-${Date.now()}`,
        txCode: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        type: 'TOP_UP',
        title: `Credit Top-Up: ${isCustomMode ? 'Custom Top-Up' : currentPkg.name}`,
        description: `Payment via ${paymentMethod} (${requestVATInvoice ? 'E-Invoice Issued' : 'Standard Receipt'})`,
        creditsChange: totalCredits,
        amountVND: finalPriceVND,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Completed',
        paymentMethod: paymentMethod === 'VIETQR' ? 'VietQR Instant Transfer' : paymentMethod,
        invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      };

      setCompletedTx(newTx);
      setIsCompletedModalOpen(true);

      if (onAddCreditSuccess) {
        onAddCreditSuccess(totalCredits, finalPriceVND, isCustomMode ? 'Custom Package' : currentPkg.name, newTx);
      }
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Header */}
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
            <span className="text-indigo-600 font-bold">Add Credit</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PlusCircle className="w-7 h-7 text-indigo-600" />
            <span>Add FlexCredit Corporate Balance</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Instant credit provisioning for Lead Board RFQ bidding, priority customer inquiry matching, and verified carrier directory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs flex items-center gap-2">
            <span className="text-slate-500">Current Balance:</span>
            <span className="font-bold text-indigo-700 font-mono text-sm">{wallet.balanceCredits.toLocaleString()} Credits</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Packages vs Checkout Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Package Selection Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Select FlexCredit Tier Package</h2>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isCustomMode ? 'Show Standard Packages' : 'Custom Credit Amount'}</span>
            </button>
          </div>

          {!isCustomMode ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                        {pkg.tag}
                      </span>
                    )}

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{pkg.name}</h3>
                      <div className="mt-3">
                        <div className="text-2xl font-black text-slate-900">
                          {pkg.priceDisplay}
                        </div>
                        <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                          {pkg.credits.toLocaleString()} + <span className="font-bold text-emerald-600">{pkg.bonusCredits} Bonus</span> Credits
                        </p>
                      </div>

                      <ul className="mt-5 space-y-2 text-xs text-slate-600">
                        {pkg.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span className="text-[11px]">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select Tier'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Custom Credit Calculator</h3>
              <p className="text-xs text-slate-500">
                Enter your desired credit amount (1 Credit = 1,000 VND). Enjoy 10% automatic bonus credits on orders over 2,000 credits.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Desired FlexCredits</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={customCredits}
                    onChange={(e) => setCustomCredits(Math.max(500, parseInt(e.target.value) || 500))}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-500">Credits</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                <div>
                  <span className="font-bold block">Estimated Delivery:</span>
                  <span>{customCredits.toLocaleString()} Purchased + {Math.floor(customCredits * 0.1)} Free Bonus Credits</span>
                </div>
                <span className="text-base font-black font-mono">{(customCredits + Math.floor(customCredits * 0.1)).toLocaleString()} Total</span>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Select Instant Payment Gateway</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('VIETQR')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  paymentMethod === 'VIETQR'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">VietQR Instant Scan</div>
                  <div className="text-[11px] text-slate-500">Instant credit activation via 35+ VN banks</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('VNPAY')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  paymentMethod === 'VNPAY'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">VNPay / ATM Card</div>
                  <div className="text-[11px] text-slate-500">Domestic ATM & VNPay QR wallet</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Corporate Wire (VCB / TCB)</div>
                  <div className="text-[11px] text-slate-500">Official company wire transfer with PO</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  paymentMethod === 'CARD'
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">International Visa / Master</div>
                  <div className="text-[11px] text-slate-500">Corporate purchasing credit card</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary & Execution Column */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Package Selection:</span>
              <span className="font-semibold text-slate-900">{isCustomMode ? 'Custom Amount' : currentPkg.name}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Credits Credited:</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">+{totalCredits.toLocaleString()} Credits</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">{basePriceVND.toLocaleString()} VND</span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount (10%):</span>
                <span>-{discountVND.toLocaleString()} VND</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Total Payable:</span>
              <span className="font-black text-xl text-slate-900 font-mono">
                {finalPriceVND.toLocaleString()} <span className="text-xs text-slate-400 font-sans">VND</span>
              </span>
            </div>
          </div>

          {/* Promo Code Input */}
          <div className="space-y-2 text-xs">
            <label className="block text-slate-700 font-semibold">Promo / Referral Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try FLEX2026"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase tracking-wider focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponApplied || !couponCode}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {couponApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
          </div>

          {/* VAT Invoice Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requestVATInvoice}
                onChange={(e) => setRequestVATInvoice(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Issue Electronic VAT Invoice (E-Invoice)</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Automatically billed to: <span className="font-semibold text-slate-700">{currentUser.companyName}</span>
                </span>
              </div>
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleExecutePayment}
            disabled={isProcessing}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isProcessing ? (
              <span>Processing Payment Gateway...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Pay {finalPriceVND.toLocaleString()} VND</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            256-bit SSL Encrypted • Instant automatic provisioning in &lt; 5 seconds
          </p>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompletedModalOpen && completedTx && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                FlexCredits have been instantly credited to your corporate balance.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">{completedTx.txCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Credited Amount:</span>
                <span className="font-bold text-emerald-600 font-mono">+{completedTx.creditsChange.toLocaleString()} Credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">New Available Balance:</span>
                <span className="font-bold text-indigo-700 font-mono">{(wallet.balanceCredits + completedTx.creditsChange).toLocaleString()} Credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Electronic Invoice:</span>
                <span className="font-mono text-slate-800">{completedTx.invoiceNumber} (Sent to email)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  onNavigate({ type: 'workspace', view: 'flexcredit-wallet' });
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
              >
                Go to Wallet
              </button>
              <button
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  onNavigate({ type: 'public', tab: 'lead-board' });
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Browse Lead Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
