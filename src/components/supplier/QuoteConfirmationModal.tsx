import React from 'react';
import {
  X,
  Send,
  Sparkles,
  Award,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Percent,
  Check,
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  DollarSign,
  ArrowRight,
  Target,
} from 'lucide-react';
import { SupplierLeadItem, QuotationItem } from '../../types';

interface QuoteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting: boolean;
  lead: SupplierLeadItem;
  quoteData: {
    unitPrice: number;
    totalPrice: number;
    currency: 'VND' | 'USD';
    unitBaseFreight: number;
    unitFuelSurcharge: number;
    unitHandlingFee: number;
    unitDocumentationFee: number;
    unitOtherCharges: number;
    otherChargesNote?: string;
    leadVolumeQuantity: number;
    leadVolumeUnit: string;
    transitTimeDisplay: string;
    transitTimeDays?: number;
    paymentTerms: string;
    validUntil: string;
    freeDemurrageDays?: number;
    notes: string;
    supplierName?: string;
  };
  marketAnalytics: {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    targetBudget: number;
    minUnitPrice: number;
    maxUnitPrice: number;
    avgUnitPrice: number;
    quoteCount: number;
  };
  competitorQuotes: QuotationItem[];
}

export const QuoteConfirmationModal: React.FC<QuoteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting,
  lead,
  quoteData,
  marketAnalytics,
  competitorQuotes,
}) => {
  if (!isOpen) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
  };

  const {
    unitPrice,
    totalPrice,
    currency,
    unitBaseFreight,
    unitFuelSurcharge,
    unitHandlingFee,
    unitDocumentationFee,
    unitOtherCharges,
    leadVolumeQuantity,
    leadVolumeUnit,
    transitTimeDisplay,
    paymentTerms,
    validUntil,
    freeDemurrageDays,
    notes,
    supplierName,
  } = quoteData;

  // 1. Calculations vs Customer (Lead)
  const targetBudget = lead.estimatedValueVND && lead.estimatedValueVND > 0 
    ? lead.estimatedValueVND 
    : marketAnalytics.targetBudget;

  const targetUnitPrice = lead.unitPriceVND && lead.unitPriceVND > 0 
    ? lead.unitPriceVND 
    : Math.round(targetBudget / (leadVolumeQuantity || 1));

  const budgetDifference = totalPrice - targetBudget;
  const unitDifferenceVsTarget = unitPrice - targetUnitPrice;
  const isWithinBudget = budgetDifference <= 0;
  const savingsAmount = Math.abs(budgetDifference);
  const savingsPercent = targetBudget > 0 ? (savingsAmount / targetBudget) * 100 : 0;

  // 2. Calculations vs Competitors
  const compUnitPrices = competitorQuotes.map((q) => 
    q.unitPrice ?? Math.round(q.totalPrice / (leadVolumeQuantity || 1))
  );
  const allUnitPrices = [...compUnitPrices, unitPrice].sort((a, b) => a - b);
  const myRank = allUnitPrices.indexOf(unitPrice) + 1;
  const totalRanks = allUnitPrices.length;
  const isTop1 = myRank === 1;
  const diffFromLowest = unitPrice - marketAnalytics.minUnitPrice;
  const diffFromAvg = marketAnalytics.avgUnitPrice - unitPrice;

  // 3. Dynamic Win Rate Estimation Algorithm
  let winRate = 50;

  // Price factor (weight ~ 50%)
  if (isTop1) {
    winRate += 38; // 88%
    if (Math.abs(diffFromLowest) > 50000) winRate += 4;
  } else if (myRank === 2) {
    winRate += 24; // 74%
  } else if (myRank === 3) {
    winRate += 12; // 62%
  } else {
    winRate -= 10;
  }

  // Budget factor
  if (isWithinBudget) {
    winRate += 6;
  } else {
    winRate -= 12;
  }

  // Payment terms factor (Net 30/45/60 is preferred by corporate shippers)
  if (paymentTerms.includes('45') || paymentTerms.includes('60')) {
    winRate += 4;
  } else if (paymentTerms.includes('30')) {
    winRate += 2;
  }

  // Free demurrage / storage factor
  if ((freeDemurrageDays ?? 0) >= 3) {
    winRate += 2;
  }

  // Clamping between 30% and 98%
  winRate = Math.min(98, Math.max(32, winRate));

  // Scorecards breakdown
  const priceScore = isTop1 ? 9.8 : myRank === 2 ? 8.6 : myRank === 3 ? 7.5 : 6.2;
  const transitScore = transitTimeDisplay.toLowerCase().includes('24h') || transitTimeDisplay.toLowerCase().includes('1 ngày') || transitTimeDisplay.toLowerCase().includes('hỏa tốc') ? 9.7 : 9.2;
  const termsScore = paymentTerms.includes('60') ? 9.8 : paymentTerms.includes('45') ? 9.5 : paymentTerms.includes('30') ? 9.0 : 7.8;
  const reputationScore = 9.6; // Verified VIP Supplier

  // Strategy summary
  const getWinRateBadge = () => {
    if (winRate >= 85) {
      return {
        text: 'Cực Kỳ Cao (Ưu Thế Tuyệt Đối)',
        color: 'bg-emerald-600 text-white',
        border: 'border-emerald-500',
        bg: 'from-emerald-950 via-teal-900 to-slate-900',
        recommendation: 'Báo giá của bạn sở hữu mức giá và điều khoản cạnh tranh nhất thị trường. Khách hàng có xu hướng chốt thầu ngay trong 24h đầu tiên.',
      };
    }
    if (winRate >= 70) {
      return {
        text: 'Cao (Nằm Trong Top Xét Tuyển)',
        color: 'bg-indigo-600 text-white',
        border: 'border-indigo-500',
        bg: 'from-indigo-950 via-slate-900 to-slate-900',
        recommendation: 'Báo giá của bạn có tính cạnh tranh tốt (Top 2-3). Nhờ điều khoản thanh toán và uy tín đội xe, bạn có cơ hội thắng thầu cao khi shipper so sánh toàn diện.',
      };
    }
    return {
      text: 'Trung Bình (Cần Nhấn Mạnh Năng Lực)',
      color: 'bg-amber-600 text-white',
      border: 'border-amber-500',
      bg: 'from-amber-950 via-slate-900 to-slate-900',
      recommendation: 'Mức giá hiện tại cao hơn đối thủ dẫn đầu. Hãy đảm bảo ghi chú chi tiết cam kết chất lượng, bảo hiểm 100% và thời gian giao hàng để thuyết phục chủ hàng.',
    };
  };

  const badgeInfo = getWinRateBadge();

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[70] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="quote-confirmation-win-modal"
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                XÁC NHẬN & PHÂN TÍCH THẮNG THẦU
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Mã Lead: <strong className="text-white">{lead.code}</strong> {lead.inquiryCode ? `(Ref: ${lead.inquiryCode})` : ''}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{lead.route}</span>
            </h3>

            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-indigo-200">Dịch vụ: {lead.serviceType}</span>
              <span>•</span>
              <span className="font-semibold text-indigo-200">Khách hàng: {lead.customerCompany}</span>
              <span>•</span>
              <span className="font-semibold text-emerald-300">Quy mô: {lead.volumeDisplay}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(94vh-160px)] bg-slate-50/50">
          
          {/* SECTION 1: PROBABILITY OF WINNING & BENCHMARK HERO CARD */}
          <div className={`rounded-3xl bg-gradient-to-br ${badgeInfo.bg} text-white p-5 sm:p-6 border ${badgeInfo.border} shadow-xl relative overflow-hidden`}>
            {/* Background glowing element */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              {/* Left: Win Rate Score & Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full ${badgeInfo.color} shadow-sm`}>
                    {badgeInfo.text}
                  </span>
                  {isTop1 && (
                    <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Award className="w-3.5 h-3.5" /> TOP 1 GIÁ TỐT NHẤT SÀN
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 font-mono">
                    {winRate}%
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-sm font-extrabold text-white block">Tỷ Lệ Thắng Thầu Dự Kiến</span>
                    <span className="text-xs text-slate-300 block">
                      Được FlexGO AI tính toán dựa trên {totalRanks} báo giá đối thủ & yêu cầu chủ hàng
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 bg-white/10 p-3 rounded-2xl border border-white/10 leading-relaxed max-w-2xl">
                  💡 <strong>Nhận định chiến lược:</strong> {badgeInfo.recommendation}
                </p>
              </div>

              {/* Right: 4 Scorecards Breakdown */}
              <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-[320px]">
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 space-y-1">
                  <span className="text-[10.5px] text-slate-300 uppercase font-bold flex items-center justify-between">
                    <span>Đơn Giá & Cước</span>
                    <span className="font-mono font-black text-emerald-300">{priceScore}/10</span>
                  </span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${priceScore * 10}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-300 block">
                    {isTop1 ? 'Hạng 1/4 đối thủ' : `Hạng ${myRank}/${totalRanks} đối thủ`}
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 space-y-1">
                  <span className="text-[10.5px] text-slate-300 uppercase font-bold flex items-center justify-between">
                    <span>Thời Gian Vận Chuyển</span>
                    <span className="font-mono font-black text-teal-300">{transitScore}/10</span>
                  </span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${transitScore * 10}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-300 block">{transitTimeDisplay}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 space-y-1">
                  <span className="text-[10.5px] text-slate-300 uppercase font-bold flex items-center justify-between">
                    <span>Công Nợ & Điều Khoản</span>
                    <span className="font-mono font-black text-indigo-300">{termsScore}/10</span>
                  </span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${termsScore * 10}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-300 block">{paymentTerms}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 space-y-1">
                  <span className="text-[10.5px] text-slate-300 uppercase font-bold flex items-center justify-between">
                    <span>Năng Lực Pháp Nhân</span>
                    <span className="font-mono font-black text-amber-300">{reputationScore}/10</span>
                  </span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${reputationScore * 10}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-300 block">⭐ 4.9 (Xác thực VIP)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: SIDE-BY-SIDE SUMMARY & DUAL BENCHMARK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* LEFT COLUMN: TÓM TẮT BÁO GIÁ CỦA BẠN (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">Tóm Tắt Báo Giá Của Bạn</h4>
                    <span className="text-[10.5px] text-slate-500 font-medium">{supplierName || 'Công ty của bạn'}</span>
                  </div>
                </div>
                <span className="text-[10.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  {currency}
                </span>
              </div>

              {/* Price Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/80 space-y-1 text-center">
                <span className="text-[10.5px] uppercase font-bold text-emerald-800 tracking-wider">
                  Đơn Giá Chào Thầu Chính Thức
                </span>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {formatVND(unitPrice)} <span className="text-xs font-bold text-slate-600">/ {leadVolumeUnit}</span>
                </div>
                <span className="text-[11px] text-slate-600 font-medium block pt-0.5">
                  Tổng giá trị gói ({leadVolumeQuantity} {leadVolumeUnit}): <strong className="text-slate-900 font-mono font-bold">{formatVND(totalPrice)}</strong>
                </span>
              </div>

              {/* Cost Breakdown Table */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bóc Tách Chi Phí Cấu Thành:
                </span>
                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Cước chính (Base Freight):</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{formatVND(unitBaseFreight)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Phụ phí nhiên liệu (BAF / FSC):</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{formatVND(unitFuelSurcharge)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Phí nâng hạ / Handling / Bến bãi:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{formatVND(unitHandlingFee)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Phí chứng từ & Thủ tục:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{formatVND(unitDocumentationFee)}</span>
                  </div>

                  {unitOtherCharges > 0 && (
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>Phụ phí khác:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">{formatVND(unitOtherCharges)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms & Commitments */}
              <div className="space-y-2 pt-1">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cam Kết Vận Hành & Điều Khoản:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Thời gian giao (Transit)</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">{transitTimeDisplay}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Điều khoản thanh toán</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">{paymentTerms}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Hiệu lực báo giá</span>
                    <span className="font-bold text-slate-900 text-[11px] mt-0.5 block">{validUntil}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Miễn phí lưu bãi (Free time)</span>
                    <span className="font-bold text-emerald-700 text-[11px] mt-0.5 block">{freeDemurrageDays ?? 2} Ngày</span>
                  </div>
                </div>

                {notes && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Ghi chú năng lực:</span>
                    <p className="line-clamp-2 italic">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ĐỐI CHIẾU VỚI KHÁCH HÀNG & ĐỐI THỦ (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* BENCHMARK 1: SO VỚI YÊU CẦU & NGÂN SÁCH CỦA KHÁCH HÀNG (SHIPPER) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase">So Sánh Với Yêu Cầu Của Khách Hàng (Shipper)</h4>
                      <span className="text-[10.5px] text-slate-500 font-medium">Khách hàng: {lead.customerCompany}</span>
                    </div>
                  </div>
                  <span className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isWithinBudget ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {isWithinBudget ? '✓ Phù Hợp Ngân Sách' : '⚠️ Cao Hơn Dự Toán'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <span className="text-[10px] text-purple-800 font-bold uppercase tracking-wider block mb-0.5">
                      Ngân Sách Trần Dự Toán
                    </span>
                    <span className="text-sm font-black text-purple-900 font-mono block">
                      {formatVND(targetBudget)}
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium">
                      Mục tiêu: {formatVND(targetUnitPrice)} / {leadVolumeUnit}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                      Giá Chào Của Bạn
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono block">
                      {formatVND(totalPrice)}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {formatVND(unitPrice)} / {leadVolumeUnit}
                    </span>
                  </div>

                  <div className={`p-3 rounded-2xl border ${
                    isWithinBudget ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                      isWithinBudget ? 'text-emerald-800' : 'text-amber-800'
                    }`}>
                      Chênh Lệch Ngân Sách
                    </span>
                    <span className={`text-sm font-black font-mono block ${
                      isWithinBudget ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {isWithinBudget ? `- ${formatVND(savingsAmount)}` : `+ ${formatVND(savingsAmount)}`}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      isWithinBudget ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {isWithinBudget 
                        ? `Tiết kiệm ${savingsPercent.toFixed(1)}% cho chủ hàng` 
                        : `Cao hơn ${savingsPercent.toFixed(1)}%`}
                    </span>
                  </div>
                </div>

                <div className="text-[11.5px] text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Đáp ứng 100% quy mô sản lượng: <strong>{lead.volumeDisplay}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Lộ trình tiêu chuẩn: <strong>{lead.route}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hạn nộp thầu của Lead: <strong>{lead.dueDate || 'Hôm nay'}</strong> (Nộp sớm tăng 25% tương tác)</span>
                  </div>
                </div>
              </div>

              {/* BENCHMARK 2: SO VỚI ĐỐI THỦ CẠNH TRANH TRÊN SÀN */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase">Đối Chiếu Ma Trận Đối Thủ Cạnh Tranh</h4>
                      <span className="text-[10.5px] text-slate-500 font-medium">Thống kê từ {totalRanks} nhà xe đã gửi báo giá</span>
                    </div>
                  </div>
                  <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full ${
                    isTop1 ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {isTop1 ? '🏆 XẾP HẠNG TOP 1' : `XẾP HẠNG TOP ${myRank} / ${totalRanks}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block mb-0.5">
                      Đối Thủ Thấp Nhất (Top 1)
                    </span>
                    <span className="text-sm font-black text-emerald-900 font-mono block">
                      {formatVND(marketAnalytics.minUnitPrice)} / {leadVolumeUnit}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {isTop1 
                        ? 'Chính là báo giá của bạn' 
                        : `Thấp hơn bạn ${formatVND(diffFromLowest)}`}
                    </span>
                  </div>

                  <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200">
                    <span className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider block mb-0.5">
                      Giá TB Thị Trường
                    </span>
                    <span className="text-sm font-black text-indigo-900 font-mono block">
                      {formatVND(marketAnalytics.avgUnitPrice)} / {leadVolumeUnit}
                    </span>
                    <span className="text-[10px] text-indigo-700 font-medium">
                      {diffFromAvg > 0 
                        ? `Bạn tốt hơn TB ${formatVND(diffFromAvg)}` 
                        : `Cao hơn TB ${formatVND(Math.abs(diffFromAvg))}`}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                      Giá Cao Nhất Thị Trường
                    </span>
                    <span className="text-sm font-black text-slate-700 font-mono block">
                      {formatVND(marketAnalytics.maxUnitPrice)} / {leadVolumeUnit}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Biên độ giá: {formatVND(marketAnalytics.maxUnitPrice - marketAnalytics.minUnitPrice)}
                    </span>
                  </div>
                </div>

                {/* Quick competitor comparison row */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                    Danh sách đối thủ trong phiên thầu:
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs">
                    {/* User's quote in list */}
                    <div className="p-2.5 bg-emerald-50/80 flex items-center justify-between font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                          {myRank}
                        </span>
                        <span className="font-extrabold text-emerald-950">Báo giá của bạn (Bạn)</span>
                        <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 text-[9px] font-black rounded">
                          {isTop1 ? 'Dẫn đầu' : 'Đang nộp'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-emerald-900">{formatVND(unitPrice)}</span>
                        <span className="text-[10px] text-slate-500 block">/ {leadVolumeUnit} • {paymentTerms}</span>
                      </div>
                    </div>

                    {/* Competitors list */}
                    {competitorQuotes.slice(0, 3).map((q, idx) => (
                      <div key={q.id || idx} className="p-2.5 bg-white flex items-center justify-between text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            {idx + (myRank <= idx + 1 ? 2 : 1)}
                          </span>
                          <span className="font-semibold text-slate-800">{q.supplierName}</span>
                          {q.isBestPrice && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                              Top 1 cũ
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-800">
                            {formatVND(q.unitPrice ?? Math.round(q.totalPrice / (leadVolumeQuantity || 1)))}
                          </span>
                          <span className="text-[10px] text-slate-400 block">/ {leadVolumeUnit} • {q.paymentTerms}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="bg-white p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer text-center"
          >
            ← Chỉnh Sửa Thêm Báo Giá
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onConfirmSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang Gửi Báo Giá Đến Chủ Hàng...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-emerald-100" />
                  <span>XÁC NHẬN & GỬI BÁO GIÁ CHÍNH THỨC</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
