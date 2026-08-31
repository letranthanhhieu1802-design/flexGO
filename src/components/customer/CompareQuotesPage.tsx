import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Check, 
  Star, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Building2, 
  ChevronRight, 
  ArrowLeft,
  Truck,
  Ship,
  Plane,
  Warehouse,
  FileCheck2,
  Globe,
  Leaf,
  Layers,
  Calculator,
  Tag,
  AlertCircle,
  FileText,
  BadgeCheck,
  Calendar,
  Zap,
  HelpCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { QuotationItem, InquiryItem, CurrentView } from '../../types';

interface CompareQuotesPageProps {
  inquiries: InquiryItem[];
  quotations: QuotationItem[];
  initialInquiryCode?: string;
  onNavigate: (view: CurrentView) => void;
  onAwardQuote: (quoteId: string, inquiryCode?: string) => void;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({
  inquiries,
  quotations,
  initialInquiryCode,
  onNavigate,
  onAwardQuote,
}) => {
  const [selectedInquiryCode, setSelectedInquiryCode] = useState<string>(
    initialInquiryCode || inquiries[0]?.code || 'FG-2608250001'
  );
  const [awardedQuoteCode, setAwardedQuoteCode] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<QuotationItem | null>(null);

  const activeInquiry = inquiries.find((i) => i.code === selectedInquiryCode) || inquiries[0];

  // Helper format currency VND
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount) + ' ₫';
  };

  // Parse volume and unit for active inquiry
  const volumeParsed = useMemo(() => {
    if (!activeInquiry) return { quantity: 1, unitName: 'chuyến', display: '1 chuyến' };
    
    const volStr = activeInquiry.weightVolume || '';
    let qty = 1;
    const numMatch = volStr.match(/([\d.,]+)/);
    if (numMatch) {
      const rawNum = parseFloat(numMatch[1].replace(/,/g, ''));
      if (!isNaN(rawNum) && rawNum > 0) {
        qty = rawNum;
      }
    }

    let unit = 'chuyến';
    const lowerVol = volStr.toLowerCase();
    const lowerService = (activeInquiry.serviceType || '').toLowerCase();

    if (lowerVol.includes('cont') || lowerService.includes('sea freight') || lowerService.includes('fcl')) {
      unit = 'cont';
    } else if (lowerVol.includes('kg') || lowerService.includes('air')) {
      unit = 'kg';
    } else if (lowerVol.includes('cbm') || lowerService.includes('lcl')) {
      unit = 'cbm';
    } else if (lowerVol.includes('m²') || lowerVol.includes('sqm') || lowerService.includes('warehousing')) {
      unit = 'm²';
    } else if (lowerVol.includes('tờ khai') || lowerService.includes('customs')) {
      unit = 'tờ khai';
    } else if (lowerVol.includes('chuyến') || lowerService.includes('trucking') || lowerService.includes('cold chain') || lowerService.includes('cross-border')) {
      unit = 'chuyến';
    } else {
      unit = 'lô';
    }

    // Parse target budget numeric value
    let targetNum = 45000000;
    const budgetMatch = (activeInquiry.targetBudget || '').match(/([\d.,]+)/);
    if (budgetMatch) {
      const cleanNum = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (!isNaN(cleanNum) && cleanNum > 0) {
        targetNum = cleanNum;
      }
    }

    return {
      quantity: qty > 0 ? qty : 1,
      unitName: unit,
      display: volStr || `${qty} ${unit}`,
      targetBudgetVND: targetNum,
      targetUnitVND: Math.round(targetNum / (qty > 0 ? qty : 1))
    };
  }, [activeInquiry]);

  // Retrieve existing or generate authentic benchmark quotation matrix for this inquiry
  const compareQuotes = useMemo<QuotationItem[]>(() => {
    if (!activeInquiry) return [];

    const existing = quotations.filter(
      (q) => q.inquiryCode === activeInquiry.code || q.inquiryTitle?.includes(activeInquiry.code)
    );

    const qty = volumeParsed.quantity;
    const unit = volumeParsed.unitName;
    const targetUnitVal = volumeParsed.targetUnitVND;
    const targetTotal = volumeParsed.targetBudgetVND;

    if (existing.length >= 2) {
      return existing.map((q, idx) => {
        const uPrice = q.unitPrice ?? Math.round(q.totalPrice / qty);
        const uBase = q.unitBaseFreight ?? Math.round((q.baseFreight || q.totalPrice * 0.85) / qty);
        const uFuel = q.unitFuelSurcharge ?? Math.round((q.fuelSurcharge || q.totalPrice * 0.08) / qty);
        const uHand = q.unitHandlingFee ?? Math.round((q.handlingFee || q.totalPrice * 0.04) / qty);
        const uDoc = q.unitDocumentationFee ?? Math.max(0, uPrice - uBase - uFuel - uHand);

        return {
          ...q,
          unitPrice: uPrice,
          unitMeasure: unit,
          tenderVolumeQty: qty,
          unitBaseFreight: uBase,
          unitFuelSurcharge: uFuel,
          unitHandlingFee: uHand,
          unitDocumentationFee: uDoc,
          baseFreight: q.baseFreight || uBase * qty,
          fuelSurcharge: q.fuelSurcharge || uFuel * qty,
          handlingFee: q.handlingFee || uHand * qty,
          documentationFee: q.documentationFee || uDoc * qty,
          isBestPrice: idx === 0 || q.isBestPrice,
        };
      });
    }

    // Benchmark supplier quotes generation tailored to the inquiry
    const p1Unit = Math.round(targetUnitVal * 0.96 / 10000) * 10000;
    const p1Base = Math.round(p1Unit * 0.854 / 10000) * 10000;
    const p1Fuel = Math.round(p1Unit * 0.083 / 10000) * 10000;
    const p1Hand = Math.round(p1Unit * 0.042 / 10000) * 10000;
    const p1Doc = Math.max(0, p1Unit - p1Base - p1Fuel - p1Hand);

    const p2Unit = targetUnitVal;
    const p2Base = Math.round(p2Unit * 0.85 / 10000) * 10000;
    const p2Fuel = Math.round(p2Unit * 0.09 / 10000) * 10000;
    const p2Hand = Math.round(p2Unit * 0.03 / 10000) * 10000;
    const p2Doc = Math.max(0, p2Unit - p2Base - p2Fuel - p2Hand);

    const p3Unit = Math.round(targetUnitVal * 1.04 / 10000) * 10000;
    const p3Base = Math.round(p3Unit * 0.846 / 10000) * 10000;
    const p3Fuel = Math.round(p3Unit * 0.087 / 10000) * 10000;
    const p3Hand = Math.round(p3Unit * 0.048 / 10000) * 10000;
    const p3Doc = Math.max(0, p3Unit - p3Base - p3Fuel - p3Hand);

    const generated: QuotationItem[] = [
      {
        id: `quo-gen-1-${activeInquiry.id}`,
        code: 'QUO-89201',
        inquiryCode: activeInquiry.code,
        inquiryTitle: activeInquiry.title,
        customerCompany: 'Công Ty Cổ Phần Tập Đoàn ABC',
        supplierId: 'supp-01',
        supplierName: 'VinaTrans Logistics JSC',
        supplierRating: 4.8,
        serviceType: activeInquiry.serviceType,
        route: `${activeInquiry.origin} → ${activeInquiry.destination}`,
        currency: 'VND',
        unitPrice: p1Unit,
        unitMeasure: unit,
        tenderVolumeQty: qty,
        unitBaseFreight: p1Base,
        unitFuelSurcharge: p1Fuel,
        unitHandlingFee: p1Hand,
        unitDocumentationFee: p1Doc,
        baseFreight: p1Base * qty,
        fuelSurcharge: p1Fuel * qty,
        handlingFee: p1Hand * qty,
        documentationFee: p1Doc * qty,
        otherCharges: 0,
        otherChargesNote: '',
        totalPrice: p1Unit * qty,
        transitTimeDays: 2,
        transitTimeDisplay: '2 Ngày (48 Giờ Chuẩn)',
        paymentTerms: 'Net 45 Days',
        validUntil: '2026-09-15',
        status: activeInquiry.status === 'Awarded' ? 'Accepted' : 'Sent',
        notes: 'Đội xe 240+ đầu kéo & xe thùng kín tiêu chuẩn Euro-5. Bảo hiểm hàng hóa PVI 100% trị giá 2 Tỷ VNĐ. Giám sát nhiệt độ/GPS thời gian thực.',
        freeDemurrageDays: 2,
        co2EstimateKg: 820,
        createdAt: '2 ngày trước',
        isBestPrice: true,
        isFastestTransit: false,
        isBestTerms: true,
        isHighestRating: true,
      },
      {
        id: `quo-gen-2-${activeInquiry.id}`,
        code: 'QUO-89205',
        inquiryCode: activeInquiry.code,
        inquiryTitle: activeInquiry.title,
        customerCompany: 'Công Ty Cổ Phần Tập Đoàn ABC',
        supplierId: 'supp-02',
        supplierName: 'Mekong Express Logistics',
        supplierRating: 4.5,
        serviceType: activeInquiry.serviceType,
        route: `${activeInquiry.origin} → ${activeInquiry.destination}`,
        currency: 'VND',
        unitPrice: p2Unit,
        unitMeasure: unit,
        tenderVolumeQty: qty,
        unitBaseFreight: p2Base,
        unitFuelSurcharge: p2Fuel,
        unitHandlingFee: p2Hand,
        unitDocumentationFee: p2Doc,
        baseFreight: p2Base * qty,
        fuelSurcharge: p2Fuel * qty,
        handlingFee: p2Hand * qty,
        documentationFee: p2Doc * qty,
        otherCharges: 0,
        otherChargesNote: '',
        totalPrice: p2Unit * qty,
        transitTimeDays: 1.5,
        transitTimeDisplay: '1.5 Ngày (36 Giờ Siêu Tốc)',
        paymentTerms: 'Net 30 Days',
        validUntil: '2026-09-10',
        status: 'Sent',
        notes: 'Dịch vụ chuyển phát chuyên tuyến hỏa tốc. Đội xe Scania đời mới, cam kết ưu tiên làn cao tốc và hệ thống camera AI cabin lái xe.',
        freeDemurrageDays: 1,
        co2EstimateKg: 910,
        createdAt: '1 ngày trước',
        isBestPrice: false,
        isFastestTransit: true,
        isBestTerms: false,
        isHighestRating: false,
      },
      {
        id: `quo-gen-3-${activeInquiry.id}`,
        code: 'QUO-89210',
        inquiryCode: activeInquiry.code,
        inquiryTitle: activeInquiry.title,
        customerCompany: 'Công Ty Cổ Phần Tập Đoàn ABC',
        supplierId: 'supp-03',
        supplierName: 'VietLogix Intermodal Corp',
        supplierRating: 4.3,
        serviceType: activeInquiry.serviceType,
        route: `${activeInquiry.origin} → ${activeInquiry.destination}`,
        currency: 'VND',
        unitPrice: p3Unit,
        unitMeasure: unit,
        tenderVolumeQty: qty,
        unitBaseFreight: p3Base,
        unitFuelSurcharge: p3Fuel,
        unitHandlingFee: p3Hand,
        unitDocumentationFee: p3Doc,
        baseFreight: p3Base * qty,
        fuelSurcharge: p3Fuel * qty,
        handlingFee: p3Hand * qty,
        documentationFee: p3Doc * qty,
        otherCharges: 0,
        otherChargesNote: '',
        totalPrice: p3Unit * qty,
        transitTimeDays: 3,
        transitTimeDisplay: '3 Ngày (72 Giờ Tiêu Chuẩn)',
        paymentTerms: 'Net 30 Days',
        validUntil: '2026-09-20',
        status: 'Sent',
        notes: 'Mạng lưới kho bãi trung chuyển rộng khắp 63 tỉnh thành. Bao gồm 24h lưu bãi miễn phí tại kho phân phối đích.',
        freeDemurrageDays: 3,
        co2EstimateKg: 850,
        createdAt: 'Hôm qua',
        isBestPrice: false,
        isFastestTransit: false,
        isBestTerms: false,
        isHighestRating: false,
      },
    ];

    return [...existing, ...generated];
  }, [activeInquiry, quotations, volumeParsed]);

  // Lowest bid calculation
  const lowestBid = useMemo(() => {
    if (compareQuotes.length === 0) return 0;
    return Math.min(...compareQuotes.map((q) => q.totalPrice));
  }, [compareQuotes]);

  // Average unit price
  const avgUnitPrice = useMemo(() => {
    if (compareQuotes.length === 0) return 0;
    const sum = compareQuotes.reduce((acc, q) => acc + (q.unitPrice || 0), 0);
    return Math.round(sum / compareQuotes.length);
  }, [compareQuotes]);

  // Determine winning quote & whether any supplier has been awarded
  const winningQuote = useMemo(() => {
    if (awardedQuoteCode) {
      return compareQuotes.find((q) => q.code === awardedQuoteCode);
    }
    const accepted = compareQuotes.find((q) => q.status === 'Accepted');
    if (accepted) return accepted;
    if (activeInquiry?.status === 'Awarded') {
      return compareQuotes.find((q) => q.isBestPrice) || compareQuotes[0];
    }
    return null;
  }, [awardedQuoteCode, compareQuotes, activeInquiry]);

  const isAnyQuoteAwarded = Boolean(winningQuote);

  const handleSelect = (q: QuotationItem) => {
    if (isAnyQuoteAwarded) return;
    setShowConfirmModal(q);
  };

  const handleConfirmAward = (q: QuotationItem) => {
    setAwardedQuoteCode(q.code);
    onAwardQuote(q.id, activeInquiry?.code);
    setShowConfirmModal(null);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Ship className="w-4 h-4 text-cyan-600" />;
      case 'Air Freight':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'Warehousing':
        return <Warehouse className="w-4 h-4 text-purple-600" />;
      case 'Customs Clearance':
        return <FileCheck2 className="w-4 h-4 text-amber-600" />;
      case 'Cross-border':
        return <Globe className="w-4 h-4 text-emerald-600" />;
      default:
        return <Truck className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <button 
            onClick={() => onNavigate({ type: 'workspace', view: 'customer-inquiries' })}
            className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Inquiries</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-indigo-600">Decision & Compare Matrix</span>
        </div>

        {/* Inquiry Selector */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold shrink-0">Chọn Yêu Cầu (Inquiry):</span>
          <select
            id="compare-inquiry-select"
            value={selectedInquiryCode}
            onChange={(e) => {
              setSelectedInquiryCode(e.target.value);
              setAwardedQuoteCode(null);
            }}
            className="px-3 py-1 text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {inquiries.map((inq) => (
              <option key={inq.code} value={inq.code}>
                {inq.code} - {inq.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dark / Indigo Hero Header matching FlexCredit Market Intelligence */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 lg:p-7 shadow-xl mb-6 relative overflow-hidden border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 text-xs font-bold bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
            {getServiceIcon(activeInquiry.serviceType)}
            <span>{activeInquiry.serviceType}</span>
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-purple-500/20 text-purple-200 rounded-full border border-purple-400/30">
            {activeInquiry.incoterms || 'Door to Door'}
          </span>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
            Mã: {activeInquiry.code}
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-rose-500/20 text-rose-200 rounded-full border border-rose-400/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-300" />
            <span>Hạn nộp báo giá: {activeInquiry.expiryDate || 'Aug 26, 2026'}</span>
          </span>
        </div>

        {/* Title & Route */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{activeInquiry.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 font-medium">
              {activeInquiry.origin} → {activeInquiry.destination} • Quy mô: <strong className="text-white">{volumeParsed.display}</strong>
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-3 py-1">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">Báo Giá Đã Nhận</span>
              <span className="text-lg font-black text-white">{compareQuotes.length} Nhà xe</span>
            </div>
            <div className="text-center px-3 py-1 border-l border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Giá Thấp Nhất</span>
              <span className="text-lg font-black text-emerald-400">{formatVND(lowestBid)}</span>
            </div>
            <div className="text-center px-3 py-1 border-l border-white/10">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">Đơn Giá TB</span>
              <span className="text-lg font-black text-white">{formatVND(avgUnitPrice)}/{volumeParsed.unitName}</span>
            </div>
            <div className="text-center px-3 py-1 border-l border-white/10">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Ngân Sách Mục Tiêu</span>
              <span className="text-lg font-black text-amber-300">{activeInquiry.targetBudget}</span>
            </div>
          </div>
        </div>

        {/* Matrix sub-badge */}
        <div className="mt-4 pt-3 border-t border-indigo-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold">Ma Trận So Sánh Báo Giá Thị Trường ({compareQuotes.length})</span>
            <span className="text-indigo-400">• Bóc tách chi tiết cấu phần cước, SLA & Quyết định trao thầu</span>
          </div>
          <span className="text-[11px] text-indigo-300 bg-indigo-900/50 px-2.5 py-0.5 rounded-full border border-indigo-700/50">
            Đã mở khóa dữ liệu đầy đủ
          </span>
        </div>
      </div>

      {/* Award Success Banner if already awarded */}
      {(awardedQuoteCode || activeInquiry.status === 'Awarded') && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm text-emerald-900">
                Đã Trao Thầu Thành Công Cho Yêu Cầu {activeInquiry.code}!
              </div>
              <p className="text-emerald-700 text-xs mt-0.5">
                Nhà cung cấp đã nhận được thông báo trúng thầu. Bạn có thể tiến hành ký kết phụ lục hợp đồng e-Contract và kích hoạt chuyến vận chuyển.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate({ type: 'workspace', view: 'customer-inquiries' })}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs shrink-0 cursor-pointer text-xs"
          >
            Quay Lại Danh Sách Yêu Cầu →
          </button>
        </div>
      )}

      {/* Main Decision & Comparison Matrix Card */}
      <div 
        id="supplier-comparison-matrix-card"
        className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden"
      >
        {/* Title bar of the Table */}
        <div className="bg-slate-50/90 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Ma Trận So Sánh Báo Giá Thị Trường (Supplier Market Intelligence)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                Bóc tách đơn giá & Tổng chi phí dự án
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bảng đối chiếu toàn diện đơn giá từng đơn vị vận chuyển ({volumeParsed.unitName}), bóc tách cấu phần cước, sau đó tính toán tổng chi phí dự án thầu và cam kết SLA của từng nhà cung cấp.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-5 px-6 font-black text-slate-700 uppercase tracking-wider w-[260px] shrink-0 sticky left-0 bg-slate-50 z-10 shadow-2xs">
                  HẠNG MỤC BÁO GIÁ
                </th>

                {compareQuotes.map((quote, idx) => (
                  <th 
                    key={quote.id} 
                    className={`py-5 px-6 text-center min-w-[280px] border-l border-slate-200 ${
                      quote.isBestPrice ? 'bg-emerald-50/40' : 'bg-slate-50/50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-10 h-10 rounded-2xl font-black text-xs flex items-center justify-center shadow-xs text-white ${
                          idx === 0 
                            ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 ring-2 ring-indigo-300' 
                            : idx === 1 
                            ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 ring-2 ring-purple-300'
                            : 'bg-gradient-to-tr from-blue-600 to-cyan-600 ring-2 ring-blue-300'
                        }`}>
                          {quote.supplierName.slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                            <span>{quote.supplierName}</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{quote.supplierRating}</span>
                            <span className="text-slate-400 font-normal">
                              ({quote.code})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Attribute Badges */}
                      <div className="flex flex-wrap gap-1 justify-center mt-1">
                        {quote.isBestPrice && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                            🏆 Giá Thấp Nhất
                          </span>
                        )}
                        {quote.isFastestTransit && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1 shadow-2xs">
                            ⚡ Nhanh Nhất
                          </span>
                        )}
                        {quote.isBestTerms && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1 shadow-2xs">
                            💳 Công Nợ 45 Ngày
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* ================= SECTION 1: ĐƠN GIÁ TỪNG ĐỐI THỦ ================= */}
              <tr className="bg-emerald-50/80 border-t-2 border-b border-emerald-200">
                <td colSpan={compareQuotes.length + 1} className="py-2.5 px-6 font-black text-emerald-950 uppercase tracking-wide text-[11px] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span>1. ĐƠN GIÁ CỦA TỪNG ĐỐI THỦ (ĐƠN VỊ TÍNH: 1 {volumeParsed.unitName.toUpperCase()})</span>
                </td>
              </tr>

              {/* Row: Main Unit Price */}
              <tr className="bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors">
                <td className="py-3.5 px-6 font-bold text-slate-900 sticky left-0 bg-emerald-50/20 z-10">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="block text-xs font-black text-slate-900">Đơn Giá Chào Thầu</span>
                      <span className="text-[10px] text-slate-500 font-normal">Đơn giá trọn gói trên 1 {volumeParsed.unitName}</span>
                    </div>
                  </div>
                </td>

                {compareQuotes.map((q) => {
                  const uPrice = q.unitPrice ?? Math.round(q.totalPrice / volumeParsed.quantity);
                  const targetUnit = volumeParsed.targetUnitVND;
                  const diffU = uPrice - targetUnit;
                  const pctU = targetUnit > 0 ? (diffU / targetUnit) * 100 : 0;

                  return (
                    <td key={q.id} className="py-3.5 px-6 text-center border-l border-slate-100">
                      <div className="space-y-1">
                        <div className="text-base font-black text-emerald-700 font-mono">
                          {formatVND(uPrice)} <span className="text-[11px] font-semibold text-slate-600">/{volumeParsed.unitName}</span>
                        </div>
                        <div>
                          {pctU < -0.5 ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Giảm {Math.abs(pctU).toFixed(1)}% vs Mục tiêu
                            </span>
                          ) : pctU > 0.5 ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                              +{Math.abs(pctU).toFixed(1)}% vs Mục tiêu
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                              Khớp 100% Mục tiêu
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Breakdown Unit 1: Base Freight */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Đơn giá cước vận chuyển chính (Base)</span>
                </td>
                {compareQuotes.map((q) => {
                  const unitBase = q.unitBaseFreight ?? Math.round((q.baseFreight || q.totalPrice * 0.85) / volumeParsed.quantity);
                  return (
                    <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 font-semibold text-slate-800 font-mono">
                      {formatVND(unitBase)} / {volumeParsed.unitName}
                    </td>
                  );
                })}
              </tr>

              {/* Breakdown Unit 2: Fuel Surcharge (BAF) */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Đơn giá phụ phí nhiên liệu (BAF Fuel)</span>
                </td>
                {compareQuotes.map((q) => {
                  const unitFuel = q.unitFuelSurcharge ?? Math.round((q.fuelSurcharge || q.totalPrice * 0.08) / volumeParsed.quantity);
                  return (
                    <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                      {formatVND(unitFuel)} / {volumeParsed.unitName}
                    </td>
                  );
                })}
              </tr>

              {/* Breakdown Unit 3: Tolls / Handling / BOT */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Đơn giá vé cầu đường BOT & bốc xếp</span>
                </td>
                {compareQuotes.map((q) => {
                  const unitHand = q.unitHandlingFee ?? Math.round((q.handlingFee || q.totalPrice * 0.04) / volumeParsed.quantity);
                  return (
                    <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                      {formatVND(unitHand)} / {volumeParsed.unitName}
                    </td>
                  );
                })}
              </tr>

              {/* Breakdown Unit 4: Documentation / Customs / Seal */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Đơn giá chứng từ, seal & quản lý đơn</span>
                </td>
                {compareQuotes.map((q) => {
                  const unitDoc = q.unitDocumentationFee ?? Math.round((q.documentationFee || q.totalPrice * 0.03) / volumeParsed.quantity);
                  return (
                    <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                      {formatVND(unitDoc)} / {volumeParsed.unitName}
                    </td>
                  );
                })}
              </tr>

              {/* ================= SECTION 2: QUY MÔ DỰ ÁN & HỆ SỐ NHÂN ================= */}
              <tr className="bg-slate-100/90 border-t border-b border-slate-200">
                <td className="py-2.5 px-6 font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5 sticky left-0 bg-slate-100 z-10">
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. QUY MÔ DỰ ÁN / GÓI THẦU (Hệ số nhân sản lượng)</span>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-200 font-extrabold text-indigo-900 bg-slate-50/60">
                    <span>x {volumeParsed.quantity} {volumeParsed.unitName} ({volumeParsed.display})</span>
                  </td>
                ))}
              </tr>

              {/* ================= SECTION 3: TỔNG CHI PHÍ CHO DỰ ÁN THẦU ================= */}
              <tr className="bg-indigo-50/80 border-t-2 border-b border-indigo-200">
                <td colSpan={compareQuotes.length + 1} className="py-2.5 px-6 font-black text-indigo-950 uppercase tracking-wide text-[11px] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-700" />
                  <span>3. TỔNG CHI PHÍ CHO DỰ ÁN THẦU (ALL-IN TOTAL TENDER / CONTRACT COST)</span>
                </td>
              </tr>

              {/* Row: Grand Total Price */}
              <tr className="bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900 sticky left-0 bg-indigo-50/30 z-10">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="block text-sm font-black text-slate-900">Tổng Chi Phí Dự Án Thầu</span>
                      <span className="text-[10px] text-indigo-700 font-semibold block">
                        (= Đơn giá x {volumeParsed.quantity} {volumeParsed.unitName})
                      </span>
                    </div>
                  </div>
                </td>

                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-4 px-6 text-center border-l border-slate-100">
                    <div className="space-y-1">
                      <div className="text-lg font-black text-slate-900 font-mono">
                        {formatVND(q.totalPrice)}
                      </div>
                      <span className="inline-block text-[10px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                        {activeInquiry.incoterms ? `Trọn gói ${activeInquiry.incoterms}` : 'Trọn gói toàn bộ lô hàng'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Breakdown Total 1: Base Freight */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Tổng cước vận chuyển chính toàn gói</span>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 font-semibold text-slate-800 font-mono">
                    {formatVND(q.baseFreight)}
                  </td>
                ))}
              </tr>

              {/* Breakdown Total 2: Fuel Surcharge (BAF) */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Tổng phụ phí nhiên liệu (BAF Fuel) toàn gói</span>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                    {formatVND(q.fuelSurcharge)}
                  </td>
                ))}
              </tr>

              {/* Breakdown Total 3: Tolls / Handling / BOT */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Tổng phí cầu đường BOT & bốc xếp toàn gói</span>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                    {formatVND(q.handlingFee)}
                  </td>
                ))}
              </tr>

              {/* Breakdown Total 4: Documentation / Customs / Seal */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-6 text-slate-700 pl-9 sticky left-0 bg-white z-10">
                  <span>• Tổng chi phí chứng từ, seal, hải quan toàn gói</span>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-2.5 px-6 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                    {formatVND(q.documentationFee)}
                  </td>
                ))}
              </tr>

              {/* ================= SECTION 4: TIÊU CHÍ DỊCH VỤ (SLA) & ĐIỀU KHOẢN ================= */}
              <tr className="bg-purple-50/70 border-t-2 border-b border-purple-200">
                <td colSpan={compareQuotes.length + 1} className="py-2.5 px-6 font-black text-purple-950 uppercase tracking-wide text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>4. TIÊU CHÍ DỊCH VỤ CAM KẾT (SLA) & ĐIỀU KHOẢN THƯƠNG MẠI</span>
                </td>
              </tr>

              {/* Row: Transit Time */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-6 font-bold text-slate-900 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    <span>Thời Gian Vận Chuyển</span>
                  </div>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-3 px-6 text-center border-l border-slate-100">
                    <div className="font-bold text-slate-900 text-xs">{q.transitTimeDisplay}</div>
                    {q.isFastestTransit ? (
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 text-[10px] font-bold text-blue-800 bg-blue-100 rounded-full border border-blue-200">
                        ⚡ Nhanh Nhất
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Tiêu Chuẩn</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Payment Terms */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-6 font-bold text-slate-900 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Điều Khoản Thanh Toán & Công Nợ</span>
                  </div>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-3 px-6 text-center border-l border-slate-100">
                    <div className="font-bold text-indigo-700 text-xs">{q.paymentTerms}</div>
                    {q.isBestTerms ? (
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded-full border border-emerald-200">
                        💳 Công Nợ Dài Hạn
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Tiêu Chuẩn</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Quote Validity */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-6 font-bold text-slate-900 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Hạn Hiệu Lực Báo Giá</span>
                  </div>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-3 px-6 text-center border-l border-slate-100 text-slate-700 font-medium">
                    {q.validUntil}
                  </td>
                ))}
              </tr>

              {/* Row: Free Demurrage */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-6 font-bold text-slate-900 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span>Miễn Phí Lưu Bãi / Demurrage</span>
                  </div>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-3 px-6 text-center border-l border-slate-100 font-semibold text-slate-800">
                    {q.freeDemurrageDays} Ngày miễn phí
                  </td>
                ))}
              </tr>

              {/* Row: Scope & Equipment Notes */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3.5 px-6 font-bold text-slate-900 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Đội Xe, Thiết Bị & Bảo Hiểm</span>
                  </div>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-3.5 px-6 text-center border-l border-slate-100 text-slate-600">
                    <p className="text-[11px] leading-relaxed font-medium text-slate-700">{q.notes}</p>
                  </td>
                ))}
              </tr>

              {/* Row: CO2 Emission Estimate */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-6 font-bold text-slate-900 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Phát Thải CO2 Ước Tính (Green SLA)</span>
                  </div>
                </td>
                {compareQuotes.map((q) => (
                  <td key={q.id} className="py-3 px-6 text-center border-l border-slate-100 font-medium text-emerald-800">
                    🌿 ~{q.co2EstimateKg} kg CO2e
                  </td>
                ))}
              </tr>

              {/* ================= SECTION 5: NÚT SELECT SUPPLIER Ở CUỐI ================= */}
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td className="py-6 px-6 font-black text-slate-900 sticky left-0 bg-slate-100 z-10">
                  <div>
                    <span className="block text-xs uppercase font-extrabold text-slate-900 tracking-wider">
                      5. QUYẾT ĐỊNH TRAO THẦU
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {isAnyQuoteAwarded ? 'Đã hoàn tất trao thầu' : 'Chọn nhà xe để phê duyệt báo giá'}
                    </span>
                  </div>
                </td>

                {compareQuotes.map((q) => {
                  const isAwarded = winningQuote?.code === q.code || q.code === awardedQuoteCode;
                  const isLost = isAnyQuoteAwarded && !isAwarded;

                  return (
                    <td 
                      key={q.id} 
                      className={`py-6 px-6 text-center border-l border-slate-200 transition-all ${
                        isAwarded 
                          ? 'bg-emerald-50/50' 
                          : isLost 
                          ? 'bg-slate-50/80' 
                          : 'bg-white'
                      }`}
                    >
                      {isAwarded ? (
                        <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-100/90 border-2 border-emerald-500 text-emerald-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>✓ Đã Chọn Thầu (Awarded)</span>
                        </div>
                      ) : isLost ? (
                        <div 
                          className="w-full py-3.5 px-4 rounded-2xl bg-slate-100/90 border border-slate-200/90 text-slate-400 font-extrabold text-xs flex items-center justify-center gap-1.5 select-none opacity-50 cursor-not-allowed pointer-events-none shadow-none"
                          title="Báo giá không được chọn (Lost)"
                        >
                          <X className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Lost</span>
                        </div>
                      ) : (
                        <button
                          id={`select-supplier-btn-${q.code}`}
                          onClick={() => handleSelect(q)}
                          className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                            q.isBestPrice
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30'
                              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-600/30'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>[ Select Supplier ]</span>
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal when user clicks [ Select Supplier ] */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <BadgeCheck className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Xác Nhận Trao Thầu Cho {showConfirmModal.supplierName}?
            </h3>
            
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Bạn đang quyết định chọn nhà cung cấp <strong>{showConfirmModal.supplierName}</strong> cho yêu cầu thầu <strong>{activeInquiry.code}</strong> với tổng chi phí <strong>{formatVND(showConfirmModal.totalPrice)}</strong>.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã Báo Giá:</span>
                <span className="font-bold text-slate-900">{showConfirmModal.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Đơn Giá:</span>
                <span className="font-bold text-emerald-700">{formatVND(showConfirmModal.unitPrice || 0)}/{volumeParsed.unitName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng Cước Dự Án:</span>
                <span className="font-black text-emerald-800 text-sm">{formatVND(showConfirmModal.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời Gian Giao Hàng:</span>
                <span className="font-bold text-slate-800">{showConfirmModal.transitTimeDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Điều Khoản Thanh Toán:</span>
                <span className="font-bold text-indigo-700">{showConfirmModal.paymentTerms}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                id="confirm-award-btn"
                onClick={() => handleConfirmAward(showConfirmModal)}
                className="px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận Trao Thầu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
