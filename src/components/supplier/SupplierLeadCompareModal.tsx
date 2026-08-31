import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  KeyRound,
  Unlock,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  Zap,
  Send,
  Calculator,
  ChevronRight,
  AlertCircle,
  Copy,
  Check,
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  Coins,
  Layers,
  ArrowRight,
  Eye,
  Percent,
  CheckCheck,
  BarChart3,
  BadgeAlert,
  Info,
  Lock,
  Target,
  Tag,
  FileText,
  Edit3,
  Sliders,
  Flame,
  ArrowDownRight,
  TrendingDownIcon
} from 'lucide-react';
import {
  SupplierLeadItem,
  QuotationItem,
  UserPersona,
  FlexCreditWallet,
  ServiceType,
  CurrentView
} from '../../types';
import { QuoteConfirmationModal } from './QuoteConfirmationModal';
import { LeadInquiryDetailCard } from '../public/LeadInquiryDetailCard';

interface SupplierLeadCompareModalProps {
  isOpen: boolean;
  lead: SupplierLeadItem | null;
  currentUser: UserPersona;
  quotations: QuotationItem[];
  wallet?: FlexCreditWallet;
  isUnlocked: boolean;
  onClose: () => void;
  onUnlockWithCredit: (leadId: string, creditCost: number) => boolean;
  onSubmitQuotation: (quote: Partial<QuotationItem>) => void;
  onNavigate?: (view: CurrentView) => void;
  creditCostOverride?: number;
  discountBadge?: string;
}

export const SupplierLeadCompareModal: React.FC<SupplierLeadCompareModalProps> = ({
  isOpen,
  lead,
  currentUser,
  quotations,
  wallet,
  isUnlocked,
  onClose,
  onUnlockWithCredit,
  onSubmitQuotation,
  onNavigate,
  creditCostOverride,
  discountBadge,
}) => {
  if (!isOpen || !lead) return null;

  const creditCost = creditCostOverride ?? 50; // Custom or Standard 50 FlexCredits
  const currentBalance = wallet?.balanceCredits ?? 1250;

  // Local State & Immediate Unlock sync
  const [isLocallyUnlocked, setIsLocallyUnlocked] = useState(isUnlocked);
  const [activeModalTab, setActiveModalTab] = useState<'matrix' | 'inquiry'>('matrix');
  const [activeTab, setActiveTab] = useState<'compare' | 'submit_quote'>('compare');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMST, setCopiedMST] = useState(false);
  const [unlockSuccessAnimation, setUnlockSuccessAnimation] = useState(false);

  useEffect(() => {
    setIsLocallyUnlocked(isUnlocked);
  }, [isUnlocked]);

  const effectiveUnlocked = isUnlocked || isLocallyUnlocked;

  // Masking helper for company name
  const maskCompanyName = (name: string, unlocked: boolean) => {
    if (unlocked) return name;
    const words = name.trim().split(/\s+/);
    if (words.length <= 2) {
      return `${name.slice(0, 4)}••••••••`;
    }
    return `${words[0]} ${words[1]} ••••••••••••`;
  };

  // Parse lead volume & measure unit
  const leadVolumeParsed = useMemo(() => {
    const volStr = lead.volumeDisplay || '';
    
    // Extract quantity from volumeDisplay if available (e.g., '10 Chuyến/Tháng', '4 Cont 40HC', '500 Kg CW')
    let qty = 1;
    const numMatch = volStr.match(/([\d.,]+)/);
    if (numMatch) {
      const rawNum = parseFloat(numMatch[1].replace(/,/g, ''));
      if (!isNaN(rawNum) && rawNum > 0) {
        qty = rawNum;
      }
    }

    // Determine unit name based on service type & volumeDisplay
    let unit = 'chuyến';
    const lowerVol = volStr.toLowerCase();
    const lowerService = (lead.serviceType || '').toLowerCase();

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

    // If unitPriceVND and estimatedValueVND are present and estimated > unit, use exact ratio
    if (lead.unitPriceVND && lead.unitPriceVND > 0 && lead.estimatedValueVND && lead.estimatedValueVND > lead.unitPriceVND) {
      const calculatedQty = Math.round(lead.estimatedValueVND / lead.unitPriceVND);
      if (calculatedQty > 0) {
        qty = calculatedQty;
      }
    }

    return {
      quantity: Math.max(1, qty),
      unitName: unit,
      display: volStr || `${qty} ${unit}`,
    };
  }, [lead]);

  // Quick Quotation Form State (Comprehensive Multi-Service Structure)
  const [currency, setCurrency] = useState<'VND' | 'USD'>(
    lead.serviceType === 'Sea Freight (FCL)' || lead.serviceType === 'Air Freight' ? 'USD' : 'VND'
  );

  // Mode state: Live Matrix Bidding Column
  const [isBiddingActive, setIsBiddingActive] = useState<boolean>(true);

  // Direct Unit Price Breakdown States for Matrix Bidding
  const [myUnitBase, setMyUnitBase] = useState<number>(() => {
    const qty = leadVolumeParsed.quantity || 1;
    const targetUnit = lead.unitPriceVND && lead.unitPriceVND > 0 
      ? lead.unitPriceVND 
      : Math.round((lead.estimatedValueVND || 50000000) / qty);
    return Math.round((targetUnit * 0.82) / 10000) * 10000;
  });

  const [myUnitFuel, setMyUnitFuel] = useState<number>(() => {
    const qty = leadVolumeParsed.quantity || 1;
    const targetUnit = lead.unitPriceVND && lead.unitPriceVND > 0 
      ? lead.unitPriceVND 
      : Math.round((lead.estimatedValueVND || 50000000) / qty);
    return Math.round((targetUnit * 0.08) / 10000) * 10000;
  });

  const [myUnitHandling, setMyUnitHandling] = useState<number>(() => {
    const qty = leadVolumeParsed.quantity || 1;
    const targetUnit = lead.unitPriceVND && lead.unitPriceVND > 0 
      ? lead.unitPriceVND 
      : Math.round((lead.estimatedValueVND || 50000000) / qty);
    return Math.round((targetUnit * 0.04) / 10000) * 10000;
  });

  const [myUnitDoc, setMyUnitDoc] = useState<number>(() => {
    const qty = leadVolumeParsed.quantity || 1;
    const targetUnit = lead.unitPriceVND && lead.unitPriceVND > 0 
      ? lead.unitPriceVND 
      : Math.round((lead.estimatedValueVND || 50000000) / qty);
    return Math.round((targetUnit * 0.02) / 10000) * 10000;
  });

  const [myUnitOther, setMyUnitOther] = useState<number>(0);
  const [myTransitTimeDays, setMyTransitTimeDays] = useState<number>(1.5);
  const [myTransitTimeDisplay, setMyTransitTimeDisplay] = useState<string>('1.5 Ngày (36h Siêu Tốc)');
  const [myPaymentTerms, setMyPaymentTerms] = useState<string>('Net 30 Days');
  const [myFreeDemurrageDays, setMyFreeDemurrageDays] = useState<number>(2);
  const [myNotes, setMyNotes] = useState<string>(
    'Đội xe đạt chuẩn khí thải Euro 5, tài xế 2 người luân phiên, hỗ trợ định vị GPS Live 24/7 và bảo hiểm hàng hóa 100%.'
  );

  // Common Quotation Fields
  const [transitTimeDays, setTransitTimeDays] = useState<number>(2);
  const [transitTimeDisplay, setTransitTimeDisplay] = useState<string>('2 Ngày (48 Giờ cam kết)');
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 45 Days');
  const [validUntil, setValidUntil] = useState<string>('2026-09-30');
  const [notes, setNotes] = useState<string>(
    'Đội xe đạt chuẩn khí thải Euro 5, tài xế 2 người luân phiên, hỗ trợ định vị GPS Live và bảo hiểm hàng hóa 100%.'
  );

  // Service-specific Breakdown States
  // 1. Trucking
  const [truckingBase, setTruckingBase] = useState<number>(() => {
    if (lead.unitPriceVND && lead.unitPriceVND > 0) return Math.round(lead.unitPriceVND * 0.95);
    return Math.round((lead.estimatedValueVND || 50000000) * 0.85);
  });
  const [truckingBAF, setTruckingBAF] = useState<number>(() => {
    if (lead.unitPriceVND && lead.unitPriceVND > 0) return Math.round(lead.unitPriceVND * 0.05);
    return Math.round((lead.estimatedValueVND || 50000000) * 0.08);
  });
  const [truckingBOT, setTruckingBOT] = useState<number>(0);
  const [truckingMultiDrop, setTruckingMultiDrop] = useState<number>(0);
  const [truckingLabor, setTruckingLabor] = useState<number>(0);
  const [truckingTailLift, setTruckingTailLift] = useState<number>(0);

  // 2. Ocean
  const [oceanOF, setOceanOF] = useState<number>(2800); // USD
  const [oceanExRate, setOceanExRate] = useState<number>(25400);
  const [oceanThcPol, setOceanThcPol] = useState<number>(3200000);
  const [oceanThcPod, setOceanThcPod] = useState<number>(4500000);
  const [oceanDocFee, setOceanDocFee] = useState<number>(1200000);
  const [oceanLSS, setOceanLSS] = useState<number>(800000);
  const [oceanFreeDemDet, setOceanFreeDemDet] = useState<number>(14);

  // 3. Air
  const [airRatePerKg, setAirRatePerKg] = useState<number>(5.8); // USD/Kg
  const [airChargeableWeight, setAirChargeableWeight] = useState<number>(200);
  const [airFSC, setAirFSC] = useState<number>(180); // USD
  const [airSSC, setAirSSC] = useState<number>(90); // USD
  const [airAwbFee, setAirAwbFee] = useState<number>(850000);
  const [airTerminalFee, setAirTerminalFee] = useState<number>(1100000);

  // 4. Cold Chain
  const [coldBaseFreight, setColdBaseFreight] = useState<number>(15500000);
  const [coldGensetFuel, setColdGensetFuel] = useState<number>(1800000);
  const [coldDataLogger, setColdDataLogger] = useState<number>(450000);
  const [coldDepotPlug, setColdDepotPlug] = useState<number>(750000);

  // 5. Warehousing
  const [whMonthlyRate, setWhMonthlyRate] = useState<number>(135000000);
  const [whHandlingInOut, setWhHandlingInOut] = useState<number>(18000000);
  const [whPalletMgmt, setWhPalletMgmt] = useState<number>(8500000);
  const [whVASPackaging, setWhVASPackaging] = useState<number>(6500000);
  const [whWmsSystemFee, setWhWmsSystemFee] = useState<number>(3000000);

  // 6. Customs
  const [customsBaseDec, setCustomsBaseDec] = useState<number>(1800000);
  const [customsAddLines, setCustomsAddLines] = useState<number>(400000);
  const [customsCoFee, setCustomsCoFee] = useState<number>(1200000);
  const [customsInspectionFee, setCustomsInspectionFee] = useState<number>(800000);
  const [customsRedChannel, setCustomsRedChannel] = useState<number>(600000);

  // 7. Cross-border
  const [crossVnLeg, setCrossVnLeg] = useState<number>(18000000);
  const [crossIntlLeg, setCrossIntlLeg] = useState<number>(24000000);
  const [crossTransshipment, setCrossTransshipment] = useState<number>(3500000);
  const [crossClearance, setCrossClearance] = useState<number>(2500000);
  const [crossGmsPermit, setCrossGmsPermit] = useState<number>(1200000);

  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSubmittedSuccess, setQuoteSubmittedSuccess] = useState(false);
  const [hasJustSubmitted, setHasJustSubmitted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingQuotePayload, setPendingQuotePayload] = useState<{
    quoteItem: Partial<QuotationItem>;
    quoteData: any;
  } | null>(null);

  // Check if current supplier has already submitted a quotation for this lead
  const existingUserQuote = useMemo(() => {
    return quotations.find(
      (q) =>
        (q.inquiryCode === lead.inquiryCode || q.inquiryCode === lead.code || q.route === lead.route) &&
        (q.supplierId === currentUser.id || q.supplierName === currentUser.companyName)
    );
  }, [quotations, lead, currentUser]);

  const isAlreadyQuoted = Boolean(existingUserQuote || hasJustSubmitted || lead.status === 'Quoted');

  // Calculate Total based on Service Type
  let calculatedTotal = 0;
  let baseFreightVal = 0;
  let fuelSurchargeVal = 0;
  let handlingFeeVal = 0;
  let docFeeVal = 0;
  let otherFeeVal = 0;
  let otherNote = '';

  if (lead.serviceType === 'Trucking') {
    calculatedTotal = truckingBase + truckingBAF + truckingBOT + truckingMultiDrop + truckingLabor + truckingTailLift;
    baseFreightVal = truckingBase;
    fuelSurchargeVal = truckingBAF;
    handlingFeeVal = truckingLabor + truckingTailLift;
    docFeeVal = 0;
    otherFeeVal = truckingBOT + truckingMultiDrop;
    otherNote = 'Phí BOT cầu đường & phụ phí giao điểm phụ';
  } else if (lead.serviceType === 'Sea Freight (FCL)' || lead.serviceType === 'Sea Freight (LCL)') {
    if (currency === 'USD') {
      calculatedTotal = oceanOF + Math.round((oceanThcPol + oceanThcPod + oceanDocFee + oceanLSS) / oceanExRate);
      baseFreightVal = oceanOF;
      fuelSurchargeVal = Math.round(oceanLSS / oceanExRate);
      handlingFeeVal = Math.round((oceanThcPol + oceanThcPod) / oceanExRate);
      docFeeVal = Math.round(oceanDocFee / oceanExRate);
      otherFeeVal = 0;
      otherNote = `Bao gồm THC 2 đầu, Bill/Seal & ${oceanFreeDemDet} ngày Free Dem/Det`;
    } else {
      calculatedTotal = (oceanOF * oceanExRate) + oceanThcPol + oceanThcPod + oceanDocFee + oceanLSS;
      baseFreightVal = oceanOF * oceanExRate;
      fuelSurchargeVal = oceanLSS;
      handlingFeeVal = oceanThcPol + oceanThcPod;
      docFeeVal = oceanDocFee;
      otherFeeVal = 0;
      otherNote = `Bao gồm THC 2 đầu, Bill/Seal & ${oceanFreeDemDet} ngày Free Dem/Det`;
    }
  } else if (lead.serviceType === 'Air Freight') {
    const airBaseUSD = airRatePerKg * airChargeableWeight;
    if (currency === 'USD') {
      calculatedTotal = Math.round(airBaseUSD + airFSC + airSSC + (airAwbFee + airTerminalFee) / 25400);
      baseFreightVal = airBaseUSD;
      fuelSurchargeVal = airFSC;
      handlingFeeVal = Math.round(airTerminalFee / 25400);
      docFeeVal = Math.round(airAwbFee / 25400);
      otherFeeVal = airSSC;
      otherNote = 'Phụ phí an ninh SSC & Soi chiếu an ninh sân bay';
    } else {
      const airTotalVND = (airBaseUSD + airFSC + airSSC) * 25400 + airAwbFee + airTerminalFee;
      calculatedTotal = airTotalVND;
      baseFreightVal = airBaseUSD * 25400;
      fuelSurchargeVal = airFSC * 25400;
      handlingFeeVal = airTerminalFee;
      docFeeVal = airAwbFee;
      otherFeeVal = airSSC * 25400;
      otherNote = 'Phụ phí an ninh SSC & Soi chiếu an ninh sân bay';
    }
  } else if (lead.serviceType === 'Cold Chain') {
    calculatedTotal = coldBaseFreight + coldGensetFuel + coldDataLogger + coldDepotPlug;
    baseFreightVal = coldBaseFreight;
    fuelSurchargeVal = coldGensetFuel;
    handlingFeeVal = coldDepotPlug;
    docFeeVal = 0;
    otherFeeVal = coldDataLogger;
    otherNote = 'Cung cấp biểu đồ IoT Logger & máy phát Genset liên tục';
  } else if (lead.serviceType === 'Warehousing') {
    calculatedTotal = whMonthlyRate + whHandlingInOut + whPalletMgmt + whVASPackaging + whWmsSystemFee;
    baseFreightVal = whMonthlyRate;
    fuelSurchargeVal = 0;
    handlingFeeVal = whHandlingInOut + whPalletMgmt;
    docFeeVal = whWmsSystemFee;
    otherFeeVal = whVASPackaging;
    otherNote = 'Bao gồm dán nhãn VAS, quản lý Pallet & kết nối API WMS';
  } else if (lead.serviceType === 'Customs Clearance') {
    calculatedTotal = customsBaseDec + customsAddLines + customsCoFee + customsInspectionFee + customsRedChannel;
    baseFreightVal = customsBaseDec;
    fuelSurchargeVal = 0;
    handlingFeeVal = customsRedChannel + customsInspectionFee;
    docFeeVal = customsCoFee + customsAddLines;
    otherFeeVal = 0;
    otherNote = 'Trọn gói tờ khai, hỗ trợ luồng đỏ & thủ tục cấp C/O';
  } else if (lead.serviceType === 'Cross-border') {
    calculatedTotal = crossVnLeg + crossIntlLeg + crossTransshipment + crossClearance + crossGmsPermit;
    baseFreightVal = crossVnLeg + crossIntlLeg;
    fuelSurchargeVal = 0;
    handlingFeeVal = crossTransshipment;
    docFeeVal = crossClearance + crossGmsPermit;
    otherFeeVal = 0;
    otherNote = 'Bao gồm sang tải bãi cửa khẩu & thông quan liên vận GMS';
  } else {
    calculatedTotal = truckingBase + truckingBAF;
    baseFreightVal = truckingBase;
    fuelSurchargeVal = truckingBAF;
    handlingFeeVal = 0;
    docFeeVal = 0;
    otherFeeVal = 0;
    otherNote = 'Cước trọn gói cam kết';
  }

  // Customer target budget / price calculation
  const customerTargetPrice = useMemo(() => {
    if (lead.unitPriceVND && lead.unitPriceVND > 0) return lead.unitPriceVND;
    if (lead.estimatedValueVND && lead.estimatedValueVND > 0) return lead.estimatedValueVND;
    return calculatedTotal;
  }, [lead.unitPriceVND, lead.estimatedValueVND, calculatedTotal]);

  const diffAmount = calculatedTotal - customerTargetPrice;
  const diffPercent = customerTargetPrice > 0 ? (diffAmount / customerTargetPrice) * 100 : 0;
  const isLower = diffAmount < 0;
  const isExact = diffAmount === 0;
  const isHigher = diffAmount > 0;
  const absDiffPercent = Math.abs(diffPercent);
  const absDiffAmount = Math.abs(diffAmount);

  // Find or generate competitor quotations for this lead/inquiry
  const competitorQuotes = useMemo(() => {
    const qty = leadVolumeParsed.quantity;
    const unit = leadVolumeParsed.unitName;
    const estVal = lead.estimatedValueVND || 50000000;
    const targetUnitVal = lead.unitPriceVND && lead.unitPriceVND > 0
      ? lead.unitPriceVND
      : Math.round(estVal / qty);

    // 1. Check existing quotations in system that match this inquiryCode
    const existing = quotations.filter(
      (q) => (lead.inquiryCode && q.inquiryCode === lead.inquiryCode) || q.inquiryTitle.includes(lead.code)
    );

    if (existing.length >= 2) {
      return existing.map(q => {
        const uPrice = q.unitPrice ?? Math.round(q.totalPrice / qty);
        return {
          ...q,
          unitPrice: uPrice,
          unitMeasure: unit,
          tenderVolumeQty: qty,
          unitBaseFreight: q.unitBaseFreight ?? Math.round(q.baseFreight / qty),
          unitFuelSurcharge: q.unitFuelSurcharge ?? Math.round(q.fuelSurcharge / qty),
          unitHandlingFee: q.unitHandlingFee ?? Math.round(q.handlingFee / qty),
          unitDocumentationFee: q.unitDocumentationFee ?? Math.round(q.documentationFee / qty),
        };
      });
    }

    // 2. Generate authentic market benchmark competitor quotes based on lead characteristics
    // Competitor 1: Top 1 Best Price (-4% vs target)
    const unitP1 = Math.round(targetUnitVal * 0.96 / 10000) * 10000;
    const unitBase1 = Math.round(unitP1 * 0.854 / 10000) * 10000;
    const unitFuel1 = Math.round(unitP1 * 0.083 / 10000) * 10000;
    const unitHand1 = Math.round(unitP1 * 0.042 / 10000) * 10000;
    const unitDoc1 = Math.max(0, unitP1 - unitBase1 - unitFuel1 - unitHand1);
    const totalP1 = unitP1 * qty;

    // Competitor 2: Fastest SLA (100% target price)
    const unitP2 = targetUnitVal;
    const unitBase2 = Math.round(unitP2 * 0.85 / 10000) * 10000;
    const unitFuel2 = Math.round(unitP2 * 0.09 / 10000) * 10000;
    const unitHand2 = Math.round(unitP2 * 0.03 / 10000) * 10000;
    const unitDoc2 = Math.max(0, unitP2 - unitBase2 - unitFuel2 - unitHand2);
    const totalP2 = unitP2 * qty;

    // Competitor 3: High Reliability (+4% vs target)
    const unitP3 = Math.round(targetUnitVal * 1.04 / 10000) * 10000;
    const unitBase3 = Math.round(unitP3 * 0.846 / 10000) * 10000;
    const unitFuel3 = Math.round(unitP3 * 0.087 / 10000) * 10000;
    const unitHand3 = Math.round(unitP3 * 0.048 / 10000) * 10000;
    const unitDoc3 = Math.max(0, unitP3 - unitBase3 - unitFuel3 - unitHand3);
    const totalP3 = unitP3 * qty;

    const generated: QuotationItem[] = [
      {
        id: `quo-comp-1-${lead.id}`,
        code: `QUO-89${Math.floor(100 + Math.random() * 899)}`,
        inquiryCode: lead.inquiryCode || lead.code,
        inquiryTitle: `${lead.route} (${lead.serviceType})`,
        customerCompany: lead.customerCompany,
        supplierId: 'supp-01',
        supplierName: 'VinaTrans Logistics JSC',
        supplierRating: 4.8,
        serviceType: lead.serviceType,
        route: lead.route,
        currency: 'VND',
        unitPrice: unitP1,
        unitMeasure: unit,
        tenderVolumeQty: qty,
        unitBaseFreight: unitBase1,
        unitFuelSurcharge: unitFuel1,
        unitHandlingFee: unitHand1,
        unitDocumentationFee: unitDoc1,
        unitOtherCharges: 0,
        baseFreight: unitBase1 * qty,
        fuelSurcharge: unitFuel1 * qty,
        handlingFee: unitHand1 * qty,
        documentationFee: unitDoc1 * qty,
        otherCharges: 0,
        otherChargesNote: 'GPS Live Tracking & IoT Sensor',
        totalPrice: totalP1,
        transitTimeDays: 2,
        transitTimeDisplay: '2 Ngày (48h Chuẩn)',
        paymentTerms: 'Net 45 Days',
        validUntil: '2026-09-15',
        status: 'Sent',
        notes: 'Đội xe 240+ xe đầu kéo & xe thùng kín, bảo hiểm hàng hóa PVI 2 tỷ VND, 2 tài xế.',
        freeDemurrageDays: 2,
        co2EstimateKg: 820,
        createdAt: '2 ngày trước',
        isBestPrice: true,
        isFastestTransit: false,
        isBestTerms: true,
        isHighestRating: true,
      },
      {
        id: `quo-comp-2-${lead.id}`,
        code: `QUO-89${Math.floor(200 + Math.random() * 799)}`,
        inquiryCode: lead.inquiryCode || lead.code,
        inquiryTitle: `${lead.route} (${lead.serviceType})`,
        customerCompany: lead.customerCompany,
        supplierId: 'supp-02',
        supplierName: 'Mekong Express Logistics',
        supplierRating: 4.5,
        serviceType: lead.serviceType,
        route: lead.route,
        currency: 'VND',
        unitPrice: unitP2,
        unitMeasure: unit,
        tenderVolumeQty: qty,
        unitBaseFreight: unitBase2,
        unitFuelSurcharge: unitFuel2,
        unitHandlingFee: unitHand2,
        unitDocumentationFee: unitDoc2,
        unitOtherCharges: 0,
        baseFreight: unitBase2 * qty,
        fuelSurcharge: unitFuel2 * qty,
        handlingFee: unitHand2 * qty,
        documentationFee: unitDoc2 * qty,
        otherCharges: 0,
        otherChargesNote: 'Ưu tiên đường gom cao tốc',
        totalPrice: totalP2,
        transitTimeDays: 1,
        transitTimeDisplay: '1.5 Ngày (36h Siêu Tốc)',
        paymentTerms: 'Net 30 Days',
        validUntil: '2026-09-10',
        status: 'Sent',
        notes: 'Chạy thẳng cao tốc, trung chuyển hỏa tốc, hệ thống camera AI trong cabin tài xế.',
        freeDemurrageDays: 1,
        co2EstimateKg: 910,
        createdAt: '1 ngày trước',
        isBestPrice: false,
        isFastestTransit: true,
        isBestTerms: false,
        isHighestRating: false,
      },
      {
        id: `quo-comp-3-${lead.id}`,
        code: `QUO-89${Math.floor(300 + Math.random() * 699)}`,
        inquiryCode: lead.inquiryCode || lead.code,
        inquiryTitle: `${lead.route} (${lead.serviceType})`,
        customerCompany: lead.customerCompany,
        supplierId: 'supp-03',
        supplierName: 'VietLogix Intermodal Corp',
        supplierRating: 4.3,
        serviceType: lead.serviceType,
        route: lead.route,
        currency: 'VND',
        unitPrice: unitP3,
        unitMeasure: unit,
        tenderVolumeQty: qty,
        unitBaseFreight: unitBase3,
        unitFuelSurcharge: unitFuel3,
        unitHandlingFee: unitHand3,
        unitDocumentationFee: unitDoc3,
        unitOtherCharges: 0,
        baseFreight: unitBase3 * qty,
        fuelSurcharge: unitFuel3 * qty,
        handlingFee: unitHand3 * qty,
        documentationFee: unitDoc3 * qty,
        otherCharges: 0,
        otherChargesNote: 'Bãi đệm lưu kho miễn phí 24h',
        totalPrice: totalP3,
        transitTimeDays: 3,
        transitTimeDisplay: '3 Ngày (Tiêu chuẩn)',
        paymentTerms: 'Net 30 Days',
        validUntil: '2026-09-20',
        status: 'Sent',
        notes: 'Hỗ trợ kho bãi trung chuyển tại 2 đầu, mạng lưới vận tải liên tỉnh vững chắc.',
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
  }, [lead, quotations, leadVolumeParsed]);

  // Market Price Analytics
  const marketAnalytics = useMemo(() => {
    const prices = competitorQuotes.map((q) => q.totalPrice).filter((p) => p > 0);
    const unitPrices = competitorQuotes.map((q) => q.unitPrice ?? Math.round(q.totalPrice / leadVolumeParsed.quantity)).filter((p) => p > 0);

    const minPrice = prices.length ? Math.min(...prices) : lead.estimatedValueVND;
    const maxPrice = prices.length ? Math.max(...prices) : lead.estimatedValueVND;
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : lead.estimatedValueVND;
    const targetBudget = lead.estimatedValueVND || avgPrice;

    const minUnitPrice = unitPrices.length ? Math.min(...unitPrices) : Math.round(targetBudget / leadVolumeParsed.quantity);
    const maxUnitPrice = unitPrices.length ? Math.max(...unitPrices) : Math.round(targetBudget / leadVolumeParsed.quantity);
    const avgUnitPrice = unitPrices.length ? Math.round(unitPrices.reduce((a, b) => a + b, 0) / unitPrices.length) : Math.round(targetBudget / leadVolumeParsed.quantity);

    // Recommended Winning Price Corridor
    const recommendedWinPrice = Math.round((minPrice * 0.98) / 100000) * 100000;
    const recommendedWinUnitPrice = Math.round((minUnitPrice * 0.98) / 10000) * 10000;

    return {
      minPrice,
      maxPrice,
      avgPrice,
      targetBudget,
      minUnitPrice,
      maxUnitPrice,
      avgUnitPrice,
      recommendedWinPrice,
      recommendedWinUnitPrice,
      quoteCount: competitorQuotes.length,
    };
  }, [competitorQuotes, lead, leadVolumeParsed]);

  // Matrix Direct Bid Calculations
  const myUnitPrice = myUnitBase + myUnitFuel + myUnitHandling + myUnitDoc + myUnitOther;
  const myTotalPrice = myUnitPrice * leadVolumeParsed.quantity;
  const myTotalBase = myUnitBase * leadVolumeParsed.quantity;
  const myTotalFuel = myUnitFuel * leadVolumeParsed.quantity;
  const myTotalHandling = myUnitHandling * leadVolumeParsed.quantity;
  const myTotalDoc = myUnitDoc * leadVolumeParsed.quantity;
  const myTotalOther = myUnitOther * leadVolumeParsed.quantity;

  // Real-time Rank Analysis of Direct Matrix Bid vs Competitors
  const myRankAnalytics = useMemo(() => {
    const compUnitPrices = competitorQuotes.map((q) => q.unitPrice ?? Math.round(q.totalPrice / leadVolumeParsed.quantity));
    const allUnitPrices = [...compUnitPrices, myUnitPrice].sort((a, b) => a - b);
    const rank = allUnitPrices.indexOf(myUnitPrice) + 1;
    const isTop1 = rank === 1;
    const top1Price = marketAnalytics.minUnitPrice;
    const diffFromTop1 = myUnitPrice - top1Price;
    const targetUnit = lead.unitPriceVND && lead.unitPriceVND > 0 
      ? lead.unitPriceVND 
      : Math.round((lead.estimatedValueVND || 50000000) / leadVolumeParsed.quantity);
    const diffPercentVsTarget = targetUnit > 0 ? ((myUnitPrice - targetUnit) / targetUnit) * 100 : 0;

    return {
      rank,
      totalQuotes: allUnitPrices.length,
      isTop1,
      diffFromTop1,
      diffPercentVsTarget,
      targetUnit,
    };
  }, [competitorQuotes, myUnitPrice, leadVolumeParsed, marketAnalytics.minUnitPrice, lead]);

  // One-click Auto AI Price Optimization (Beats Top 1 Competitor by 2%)
  const handleApplyWinningPrice = () => {
    const winUnit = Math.round((marketAnalytics.minUnitPrice * 0.98) / 10000) * 10000;
    const base = Math.round((winUnit * 0.854) / 10000) * 10000;
    const fuel = Math.round((winUnit * 0.083) / 10000) * 10000;
    const handling = Math.round((winUnit * 0.042) / 10000) * 10000;
    const doc = Math.max(0, winUnit - base - fuel - handling);

    setMyUnitBase(base);
    setMyUnitFuel(fuel);
    setMyUnitHandling(handling);
    setMyUnitDoc(doc);
    setMyUnitOther(0);
    setIsBiddingActive(true);
  };

  // Submit Matrix Direct Bid Handler -> Triggers Confirmation & Win Opportunity Analysis
  const handleSubmitMatrixBid = () => {
    const quoteData = {
      unitPrice: myUnitPrice,
      totalPrice: myTotalPrice,
      currency: 'VND' as const,
      unitBaseFreight: myUnitBase,
      unitFuelSurcharge: myUnitFuel,
      unitHandlingFee: myUnitHandling,
      unitDocumentationFee: myUnitDoc,
      unitOtherCharges: myUnitOther,
      otherChargesNote: 'Cước trọn gói cam kết theo ma trận cạnh tranh thị trường',
      leadVolumeQuantity: leadVolumeParsed.quantity,
      leadVolumeUnit: leadVolumeParsed.unitName,
      transitTimeDisplay: myTransitTimeDisplay,
      transitTimeDays: myTransitTimeDays,
      paymentTerms: myPaymentTerms,
      validUntil: validUntil,
      freeDemurrageDays: myFreeDemurrageDays,
      notes: myNotes,
      supplierName: currentUser.companyName || 'Công ty Vận tải của bạn',
    };

    const newQuote: Partial<QuotationItem> = {
      code: `QUO-${Math.floor(10000 + Math.random() * 90000)}`,
      inquiryCode: lead.inquiryCode || lead.code,
      inquiryTitle: `${lead.route} (${lead.serviceType})`,
      customerCompany: lead.customerCompany,
      supplierId: currentUser.id || 'current-user-supplier',
      supplierName: currentUser.companyName || 'Công ty Vận tải của bạn',
      supplierRating: 4.9,
      serviceType: lead.serviceType,
      route: lead.route,
      currency: 'VND',
      unitPrice: myUnitPrice,
      unitMeasure: leadVolumeParsed.unitName,
      tenderVolumeQty: leadVolumeParsed.quantity,
      unitBaseFreight: myUnitBase,
      unitFuelSurcharge: myUnitFuel,
      unitHandlingFee: myUnitHandling,
      unitDocumentationFee: myUnitDoc,
      unitOtherCharges: myUnitOther,
      baseFreight: myTotalBase,
      fuelSurcharge: myTotalFuel,
      handlingFee: myTotalHandling,
      documentationFee: myTotalDoc,
      otherCharges: myTotalOther,
      otherChargesNote: 'Cước trọn gói cam kết theo ma trận cạnh tranh thị trường',
      totalPrice: myTotalPrice,
      transitTimeDays: myTransitTimeDays,
      transitTimeDisplay: myTransitTimeDisplay,
      paymentTerms: myPaymentTerms,
      validUntil: validUntil,
      status: 'Sent',
      notes: myNotes,
      freeDemurrageDays: myFreeDemurrageDays,
      createdAt: 'Vừa xong',
      isBestPrice: myRankAnalytics.isTop1,
      isFastestTransit: myTransitTimeDays <= 1.5,
      isBestTerms: myPaymentTerms.includes('45') || myPaymentTerms.includes('60'),
      isHighestRating: true,
    };

    setPendingQuotePayload({
      quoteItem: newQuote,
      quoteData: quoteData,
    });
    setShowConfirmationModal(true);
  };

  // Submit Quotation Form Handler -> Triggers Confirmation & Win Opportunity Analysis
  const handleSubmitQuoteForm = (e: React.FormEvent) => {
    e.preventDefault();

    const unitCalc = Math.round(calculatedTotal / (leadVolumeParsed.quantity || 1));
    const quoteData = {
      unitPrice: unitCalc,
      totalPrice: calculatedTotal,
      currency: currency,
      unitBaseFreight: Math.round(baseFreightVal / (leadVolumeParsed.quantity || 1)),
      unitFuelSurcharge: Math.round(fuelSurchargeVal / (leadVolumeParsed.quantity || 1)),
      unitHandlingFee: Math.round(handlingFeeVal / (leadVolumeParsed.quantity || 1)),
      unitDocumentationFee: Math.round(docFeeVal / (leadVolumeParsed.quantity || 1)),
      unitOtherCharges: Math.round(otherFeeVal / (leadVolumeParsed.quantity || 1)),
      otherChargesNote: otherNote,
      leadVolumeQuantity: leadVolumeParsed.quantity,
      leadVolumeUnit: leadVolumeParsed.unitName,
      transitTimeDisplay: transitTimeDisplay,
      transitTimeDays: transitTimeDays,
      paymentTerms: paymentTerms,
      validUntil: validUntil,
      freeDemurrageDays: 2,
      notes: notes,
      supplierName: currentUser.companyName || 'Công ty Vận tải của bạn',
    };

    const newQuote: Partial<QuotationItem> = {
      code: `QUO-${Math.floor(10000 + Math.random() * 90000)}`,
      inquiryCode: lead.inquiryCode || lead.code,
      inquiryTitle: `${lead.route} (${lead.serviceType})`,
      customerCompany: lead.customerCompany,
      supplierId: currentUser.id || 'current-user-supplier',
      supplierName: currentUser.companyName || 'Công ty Vận tải của bạn',
      supplierRating: 4.9,
      serviceType: lead.serviceType,
      route: lead.route,
      currency: currency,
      unitPrice: unitCalc,
      unitMeasure: leadVolumeParsed.unitName,
      tenderVolumeQty: leadVolumeParsed.quantity,
      baseFreight: baseFreightVal,
      fuelSurcharge: fuelSurchargeVal,
      handlingFee: handlingFeeVal,
      documentationFee: docFeeVal,
      otherCharges: otherFeeVal,
      otherChargesNote: otherNote,
      totalPrice: calculatedTotal,
      transitTimeDays: transitTimeDays,
      transitTimeDisplay: transitTimeDisplay,
      paymentTerms: paymentTerms,
      validUntil: validUntil,
      status: 'Sent',
      notes: notes,
      createdAt: 'Vừa xong',
    };

    setPendingQuotePayload({
      quoteItem: newQuote,
      quoteData: quoteData,
    });
    setShowConfirmationModal(true);
  };

  // Final Confirmation Submit Handler from Popup Modal
  const handleConfirmFinalQuote = () => {
    if (!pendingQuotePayload) return;
    setIsSubmittingQuote(true);

    setTimeout(() => {
      onSubmitQuotation(pendingQuotePayload.quoteItem);
      setIsSubmittingQuote(false);
      setShowConfirmationModal(false);
      setHasJustSubmitted(true);
      setQuoteSubmittedSuccess(true);
      setActiveTab('compare');
      setTimeout(() => {
        setQuoteSubmittedSuccess(false);
      }, 3000);
    }, 600);
  };

  // Real-time rank calculation of user's quotation against competitors
  const currentQuoteRanking = useMemo(() => {
    const currentPriceVND = currency === 'USD' ? calculatedTotal * 25400 : calculatedTotal;
    const allPrices = [...competitorQuotes.map((q) => q.totalPrice), currentPriceVND].sort((a, b) => a - b);
    const myRank = allPrices.indexOf(currentPriceVND) + 1;
    const totalCompetitors = allPrices.length;
    const diffFromLowest = currentPriceVND - marketAnalytics.minPrice;

    return {
      rank: myRank,
      total: totalCompetitors,
      isLowest: myRank === 1,
      diffFromLowest,
    };
  }, [competitorQuotes, calculatedTotal, currency, marketAnalytics.minPrice]);

  // Unlock Handler
  const handleUnlockClick = () => {
    const success = onUnlockWithCredit(lead.id, creditCost);
    if (success !== false) {
      setIsLocallyUnlocked(true);
      setUnlockSuccessAnimation(true);
      setTimeout(() => setUnlockSuccessAnimation(false), 2000);
    }
  };

  const copyToClipboard = (text: string, type: 'phone' | 'email' | 'mst') => {
    navigator.clipboard?.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'mst') {
      setCopiedMST(true);
      setTimeout(() => setCopiedMST(false), 2000);
    }
  };

  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="supplier-lead-intelligence-modal"
        className="bg-white rounded-3xl max-w-[1440px] xl:max-w-[96vw] w-full max-h-[96vh] md:max-h-[95vh] h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b border-indigo-900/50 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {lead.serviceType}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  {lead.pricingType === 'CONTRACT' ? 'Hợp đồng định kỳ' : 'Theo Lô / Chuyến'}
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold px-2 py-0.5 rounded bg-white/10">
                  {lead.code}
                </span>
                {lead.inquiryCode && (
                  <span className="font-mono text-xs text-slate-400">
                    Ref: {lead.inquiryCode}
                  </span>
                )}
                {lead.dueDate && (
                  <span className="text-[11px] text-rose-300 font-semibold flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
                    <Clock className="w-3 h-3 text-rose-400" /> Hạn nộp báo giá: {lead.dueDate}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{lead.route}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                {lead.cargoDetails} • <span className="font-bold text-white">{lead.volumeDisplay}</span>
              </p>
            </div>

            {/* Top Right Action & FlexCredit Status */}
            <div className="flex items-center gap-3 shrink-0">
              {effectiveUnlocked ? (
                <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3.5 py-1.5 rounded-2xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Đã Mở Khóa Đầy Đủ</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3.5 py-1.5 rounded-2xl text-xs font-bold">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Mở khóa: {creditCost} FlexCredit</span>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs: Tab 1 Matrix & Tab 2 Inquiry */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              id="compare-modal-tab-matrix-btn"
              onClick={() => setActiveModalTab('matrix')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'matrix'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. Ma Trận So Sánh Báo Giá Thị Trường ({competitorQuotes.length})</span>
              {isAlreadyQuoted && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-2xs">
                  ✓ Đã Báo Giá
                </span>
              )}
            </button>

            <button
              type="button"
              id="compare-modal-tab-inquiry-btn"
              onClick={() => setActiveModalTab('inquiry')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'inquiry'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Chi Tiết Yêu Cầu Lead (Inquiry Info)</span>
            </button>
          </div>
        </div>

        {/* MODAL MAIN CONTENT SCROLL AREA */}
        {activeModalTab === 'inquiry' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 space-y-4 animate-in fade-in duration-150">
            <LeadInquiryDetailCard
              lead={lead}
              isUnlocked={effectiveUnlocked}
              isCustomerView={false}
            />
          </div>
        ) : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 1. CUSTOMER PROFILE INTELLIGENCE SECTION */}
          <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Hồ Sơ Doanh Nghiệp Khách Hàng (Shipper)
                </h3>
              </div>

              {effectiveUnlocked ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pháp nhân & SĐT Hotline Đã Mở Khóa
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1 shadow-2xs">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Thông tin SĐT & Pháp nhân đang bị khóa
                </span>
              )}
            </div>

            <div className="p-5">
              {effectiveUnlocked ? (
                /* UNLOCKED FULL CUSTOMER INTELLIGENCE VIEW */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Company Legal Info */}
                    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 block">Doanh nghiệp phát hành</span>
                      <h4 className="text-sm font-extrabold text-slate-900">{lead.customerCompany}</h4>
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Mã số thuế:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-bold text-slate-800">0314892831</span>
                            <button
                              onClick={() => copyToClipboard('0314892831', 'mst')}
                              className="text-indigo-600 hover:text-indigo-800 p-0.5 cursor-pointer"
                              title="Sao chép MST"
                            >
                              {copiedMST ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-400 text-[11px] shrink-0">Địa chỉ kho:</span>
                          <span className="text-right font-medium text-slate-800 text-[11px]">
                            {lead.origin}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Xếp hạng tín nhiệm:</span>
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> VIP Shipper (AAA)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Person Direct Info */}
                    <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Đầu mối phụ trách mua hàng</span>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {lead.contactName} <span className="text-xs font-normal text-slate-500">({lead.contactRole})</span>
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Số điện thoại:</span>
                          <div className="flex items-center gap-1.5">
                            <a 
                              href={`tel:${lead.contactPhone || '0908123456'}`}
                              className="font-mono font-black text-emerald-800 text-sm hover:underline"
                            >
                              {lead.contactPhone || '0908 123 456'}
                            </a>
                            <button
                              onClick={() => copyToClipboard(lead.contactPhone || '0908 123 456', 'phone')}
                              className="text-slate-500 hover:text-slate-800 p-0.5 cursor-pointer"
                              title="Sao chép SĐT"
                            >
                              {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Email báo giá:</span>
                          <div className="flex items-center gap-1">
                            <a 
                              href={`mailto:${lead.contactEmail || 'logistics@customer.vn'}`}
                              className="font-medium text-indigo-600 hover:underline text-[11px]"
                            >
                              {lead.contactEmail || 'logistics@customer.vn'}
                            </a>
                            <button
                              onClick={() => copyToClipboard(lead.contactEmail || 'logistics@customer.vn', 'email')}
                              className="text-slate-500 hover:text-slate-800 p-0.5 cursor-pointer"
                              title="Sao chép Email"
                            >
                              {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Direct Fast Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`https://zalo.me/${(lead.contactPhone || '0908123456').replace(/\s+/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat Zalo</span>
                          </a>
                          <a
                            href={`tel:${lead.contactPhone || '0908123456'}`}
                            className="flex-1 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Gọi Điện</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Requirements & Budget Specs */}
                    <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-amber-700 block">Kỳ vọng thương mại</span>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Ngân sách dự toán:</span>
                          <span className="font-extrabold text-emerald-700">{lead.estimatedValueDisplay}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Đơn giá mục tiêu:</span>
                          <span className="font-bold text-slate-800">{lead.unitPriceDisplay}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Quy mô gói thầu:</span>
                          <span className="font-semibold text-purple-700">{lead.volumeDisplay}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Hạn chót tiếp nhận:</span>
                          <span className="font-bold text-rose-600">{lead.dueDate || 'Còn 5 ngày'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* LOCKED PREVIEW BANNER WITH EXACT ORANGE BUTTON MATCHING USER'S SCREENSHOT */
                <div className="bg-gradient-to-br from-amber-500/10 via-orange-50/40 to-indigo-500/10 border border-amber-200/90 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        <Lock className="w-4 h-4" />
                      </span>
                      <div>
                        {discountBadge && (
                          <div className="mb-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black shadow-2xs">
                            <Sparkles className="w-3 h-3 text-yellow-200" />
                            <span>{discountBadge}</span>
                          </div>
                        )}
                        <h4 className="text-base font-black text-slate-900 tracking-tight">
                          Mở Khóa Thông Tin Hotline Trực Tiếp & Toàn Bộ Ma Trận Đối Thủ
                        </h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                      Xem đầy đủ Số điện thoại Di động, Chat Zalo 1-1, Email người phụ trách mua hàng của <strong className="text-slate-900">{maskCompanyName(lead.customerCompany, effectiveUnlocked)}</strong> và bóc tách bảng báo giá chi tiết, cước phí của tất cả các nhà xe đối thủ đang tham gia chào giá.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> SĐT, Zalo & Email trực tiếp
                      </span>
                      <span className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        <CheckCheck className="w-3.5 h-3.5 text-indigo-600" /> Bóc tách giá các nhà xe đối thủ
                      </span>
                      <span className="flex items-center gap-1 text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        <CheckCheck className="w-3.5 h-3.5 text-purple-600" /> Gợi ý giá thắng thầu AI
                      </span>
                    </div>
                  </div>

                  {/* Unlock Button / Wallet balance matching exact image styling */}
                  <div className="flex flex-col items-center shrink-0 space-y-2.5">
                    <button
                      id="supplier-unlock-with-credit-btn"
                      type="button"
                      onClick={handleUnlockClick}
                      className="px-8 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Mở Khóa Ngay ({creditCost} FlexCredit)</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>Số dư ví của bạn: <strong className="font-extrabold text-slate-900">{currentBalance} Credits</strong></span>
                      {currentBalance < creditCost && onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-add' })}
                          className="text-indigo-600 hover:underline font-bold ml-1 cursor-pointer"
                        >
                          Nạp thêm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. MARKET ANALYTICS & WINNING PRICE CORRIDOR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* 1. Đơn giá thấp nhất */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              effectiveUnlocked ? 'bg-emerald-50/80 border-emerald-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Đơn Giá Thấp Nhất (Top 1)
              </span>
              <span className="text-base font-black text-emerald-700 block">
                {effectiveUnlocked ? `${formatVND(marketAnalytics.minUnitPrice)}/${leadVolumeParsed.unitName}` : '••••••••• ₫'}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                {effectiveUnlocked ? `Tổng gói ~ ${formatVND(marketAnalytics.minPrice)}` : '🔒 Khóa bởi FlexCredit'}
              </span>
            </div>

            {/* 2. Đơn giá cao nhất */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Đơn Giá Cao Nhất
              </span>
              <span className="text-base font-black text-slate-700 block">
                {effectiveUnlocked ? `${formatVND(marketAnalytics.maxUnitPrice)}/${leadVolumeParsed.unitName}` : '••••••••• ₫'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {effectiveUnlocked ? `Tổng gói ~ ${formatVND(marketAnalytics.maxPrice)}` : '🔒 Khóa'}
              </span>
            </div>

            {/* 3. Đơn giá TB thị trường */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              effectiveUnlocked ? 'bg-indigo-50/80 border-indigo-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-indigo-800 block mb-1">
                Đơn Giá TB Thị Trường
              </span>
              <span className="text-base font-black text-indigo-800 block">
                {effectiveUnlocked ? `${formatVND(marketAnalytics.avgUnitPrice)}/${leadVolumeParsed.unitName}` : '••••••••• ₫'}
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">
                {effectiveUnlocked ? `Trung bình ${competitorQuotes.length} báo giá` : '🔒 Khóa bởi FlexCredit'}
              </span>
            </div>

            {/* 4. Đối thủ cạnh tranh */}
            <div className="p-3.5 rounded-2xl bg-cyan-50/80 border border-cyan-200">
              <span className="text-[10px] uppercase font-bold text-cyan-800 block mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-600" /> Đối Thủ Cạnh Tranh
              </span>
              <span className="text-base font-black text-cyan-800 block">
                {competitorQuotes.length} Nhà xe
              </span>
              <span className="text-[10px] text-cyan-600 font-medium">Đã gửi báo giá</span>
            </div>
          </div>

          {/* TAB 1: COMPETITOR QUOTATION COMPARISON MATRIX */}
          {activeTab === 'compare' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Ma Trận So Sánh Báo Giá Thị Trường (Supplier Market Intelligence)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      Bóc tách đơn giá & Tổng chi phí dự án
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bảng đối chiếu toàn diện đơn giá từng đơn vị vận chuyển ({leadVolumeParsed.unitName}), bóc tách cấu phần cước, sau đó tính toán tổng chi phí dự án thầu và cam kết SLA của từng nhà cung cấp.
                  </p>
                </div>

                {!effectiveUnlocked && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUnlockClick}
                      className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Mở khóa xem giá đối thủ ({creditCost} Cr)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Side-by-Side Competitor Matrix Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                {!effectiveUnlocked && (
                  <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-semibold">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Dữ liệu tên nhà xe, đơn giá bóc tách và tổng cước dự án của đối thủ đang được bảo mật.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleUnlockClick}
                      className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Mở Khóa Ngay ({creditCost} FlexCredit)</span>
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-5 font-bold text-slate-600 uppercase tracking-wider w-[240px] shrink-0 sticky left-0 bg-slate-50 z-10 shadow-xs">
                          HẠNG MỤC BÁO GIÁ
                        </th>

                        {/* Interactive Supplier Bidding Column (Báo Giá Của Bạn) */}
                        {isBiddingActive && (
                          <th className="py-4 px-4 text-center min-w-[280px] bg-gradient-to-b from-emerald-100/95 via-emerald-50/90 to-teal-50/95 border-x-2 border-emerald-500 shadow-md relative z-0">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-300">
                                  Bạn
                                </div>
                                <div className="text-left">
                                  <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                    <span>{currentUser.name || 'Người Báo Giá (Bạn)'}</span>
                                    {isAlreadyQuoted ? (
                                      <span className="px-2 py-0.5 bg-emerald-700 text-white text-[9px] font-black rounded-md uppercase tracking-wider flex items-center gap-0.5 shadow-2xs">
                                        <CheckCircle2 className="w-2.5 h-2.5" /> Đã Báo Giá
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-black rounded-md uppercase tracking-wider">
                                        Soạn Giá
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-medium">
                                    {currentUser.companyName || 'Công Ty Của Bạn'}
                                  </div>
                                </div>
                              </div>

                              {isAlreadyQuoted && (
                                <div className="mt-2 w-full py-1 px-2 bg-emerald-600/15 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 select-none">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Báo Giá Đã Được Ghi Nhận</span>
                                </div>
                              )}
                            </div>
                          </th>
                        )}

                        {/* Competitor Columns */}
                        {competitorQuotes.map((quote, idx) => {
                          const picName = quote.contactPerson || (idx === 0 ? 'Nguyễn Hoàng Nam' : idx === 1 ? 'Trần Minh Đức' : idx === 2 ? 'Lê Quốc Tuấn' : 'Vũ Đình Hải');
                          const avatarText = effectiveUnlocked ? (picName.split(' ').pop() || quote.supplierName.slice(0, 2)) : `#${idx + 1}`;
                          return (
                            <th key={quote.id} className="py-4 px-5 text-center min-w-[250px] border-l border-slate-100">
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shadow-xs ${
                                    effectiveUnlocked ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
                                  }`}>
                                    {avatarText}
                                  </div>
                                  <div className="text-left">
                                    <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                                      <span>
                                        {effectiveUnlocked ? picName : `Nhà xe Đối thủ #${idx + 1}`}
                                      </span>
                                      {effectiveUnlocked && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium">
                                      {effectiveUnlocked ? quote.supplierName : 'Đang tham gia chào giá'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {/* ================= SECTION 1: ĐƠN GIÁ TỪNG ĐỐI THỦ ================= */}
                      <tr className="bg-emerald-50/70 border-t-2 border-b border-emerald-200">
                        <td colSpan={competitorQuotes.length + (isBiddingActive ? 2 : 1)} className="py-2.5 px-5 font-black text-emerald-900 uppercase tracking-wide text-[11px] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-emerald-700" />
                          <span>1. ĐƠN GIÁ CỦA TỪNG ĐỐI THỦ (ĐƠN VỊ TÍNH: 1 {leadVolumeParsed.unitName.toUpperCase()})</span>
                        </td>
                      </tr>

                      {/* Row: Main Unit Price */}
                      <tr className="bg-emerald-50/20 hover:bg-emerald-50/40">
                        <td className="py-3 px-5 font-bold text-slate-900 sticky left-0 bg-emerald-50/20 z-10">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="block text-xs font-extrabold text-slate-900">Đơn Giá Chào Thầu</span>
                              <span className="text-[10px] text-slate-500 font-normal">Đơn giá trọn gói trên 1 {leadVolumeParsed.unitName}</span>
                            </div>
                          </div>
                        </td>

                        {/* Interactive Unit Price (User) */}
                        {isBiddingActive && (
                          <td className="py-3 px-4 text-center border-x-2 border-emerald-500 bg-emerald-100/50 shadow-inner">
                            <div className="text-base font-black text-emerald-900 font-mono tracking-tight flex items-center justify-center gap-1">
                              <span>{formatVND(myUnitPrice)}</span>
                              <span className="text-xs font-semibold text-slate-700">/{leadVolumeParsed.unitName}</span>
                            </div>
                          </td>
                        )}

                        {competitorQuotes.map((q) => {
                          const uPrice = q.unitPrice ?? Math.round(q.totalPrice / leadVolumeParsed.quantity);

                          return (
                            <td key={q.id} className="py-3 px-5 text-center border-l border-slate-100">
                              {effectiveUnlocked ? (
                                <div className="text-base font-black text-emerald-700 font-mono">
                                  {formatVND(uPrice)} <span className="text-[11px] font-semibold text-slate-600">/{leadVolumeParsed.unitName}</span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="text-base font-black text-slate-400 font-mono tracking-wider">
                                    ••••••••• ₫/{leadVolumeParsed.unitName}
                                  </span>
                                  <span className="block text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Khóa (50 Credits)
                                  </span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Breakdown Unit 1: Base Freight */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Đơn giá cước vận chuyển chính (Base)</span>
                        </td>

                        {/* Interactive Base Freight Input (User) */}
                        {isBiddingActive && (
                          <td className="py-2.5 px-3 border-x-2 border-emerald-500 bg-emerald-50/20">
                            {isAlreadyQuoted ? (
                              <div className="py-1 text-center font-bold text-emerald-950 font-mono text-xs">
                                {formatVND(myUnitBase)} <span className="text-[10px] text-slate-500 font-normal">/{leadVolumeParsed.unitName}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="10000"
                                  min="0"
                                  value={myUnitBase}
                                  onChange={(e) => setMyUnitBase(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-full text-right font-mono font-bold text-xs px-2 py-1.5 rounded-lg border-2 border-emerald-400 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                                />
                                <span className="text-[10px] text-slate-500 font-medium shrink-0">₫/{leadVolumeParsed.unitName}</span>
                              </div>
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => {
                          const unitBase = q.unitBaseFreight ?? Math.round(q.baseFreight / leadVolumeParsed.quantity);
                          return (
                            <td key={q.id} className="py-2 px-5 text-center border-l border-slate-100 font-semibold text-slate-800 font-mono">
                              {effectiveUnlocked ? `${formatVND(unitBase)} / ${leadVolumeParsed.unitName}` : '••••••••• ₫'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Breakdown Unit 2: Fuel Surcharge (BAF) */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Đơn giá phụ phí nhiên liệu (BAF Fuel)</span>
                        </td>

                        {/* Interactive Fuel Surcharge Input (User) */}
                        {isBiddingActive && (
                          <td className="py-2.5 px-3 border-x-2 border-emerald-500 bg-emerald-50/20">
                            {isAlreadyQuoted ? (
                              <div className="py-1 text-center font-medium text-slate-800 font-mono text-xs">
                                {formatVND(myUnitFuel)} <span className="text-[10px] text-slate-500 font-normal">/{leadVolumeParsed.unitName}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="10000"
                                  min="0"
                                  value={myUnitFuel}
                                  onChange={(e) => setMyUnitFuel(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-full text-right font-mono font-bold text-xs px-2 py-1.5 rounded-lg border-2 border-emerald-400 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                                />
                                <span className="text-[10px] text-slate-500 font-medium shrink-0">₫/{leadVolumeParsed.unitName}</span>
                              </div>
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => {
                          const unitFuel = q.unitFuelSurcharge ?? Math.round(q.fuelSurcharge / leadVolumeParsed.quantity);
                          return (
                            <td key={q.id} className="py-2 px-5 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                              {effectiveUnlocked ? `${formatVND(unitFuel)} / ${leadVolumeParsed.unitName}` : '••••••••• ₫'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Breakdown Unit 3: Tolls / Handling / BOT */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Đơn giá vé cầu đường BOT & bốc xếp</span>
                        </td>

                        {/* Interactive Tolls / Handling Input (User) */}
                        {isBiddingActive && (
                          <td className="py-2.5 px-3 border-x-2 border-emerald-500 bg-emerald-50/20">
                            {isAlreadyQuoted ? (
                              <div className="py-1 text-center font-medium text-slate-800 font-mono text-xs">
                                {formatVND(myUnitHandling)} <span className="text-[10px] text-slate-500 font-normal">/{leadVolumeParsed.unitName}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="10000"
                                  min="0"
                                  value={myUnitHandling}
                                  onChange={(e) => setMyUnitHandling(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-full text-right font-mono font-bold text-xs px-2 py-1.5 rounded-lg border-2 border-emerald-400 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                                />
                                <span className="text-[10px] text-slate-500 font-medium shrink-0">₫/{leadVolumeParsed.unitName}</span>
                              </div>
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => {
                          const unitHand = q.unitHandlingFee ?? Math.round(q.handlingFee / leadVolumeParsed.quantity);
                          return (
                            <td key={q.id} className="py-2 px-5 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                              {effectiveUnlocked ? `${formatVND(unitHand)} / ${leadVolumeParsed.unitName}` : '••••••••• ₫'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Breakdown Unit 4: Documentation / Customs / Seal */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Đơn giá chứng từ, seal & quản lý đơn</span>
                        </td>

                        {/* Interactive Documentation Input (User) */}
                        {isBiddingActive && (
                          <td className="py-2.5 px-3 border-x-2 border-emerald-500 bg-emerald-50/20">
                            {isAlreadyQuoted ? (
                              <div className="py-1 text-center font-medium text-slate-800 font-mono text-xs">
                                {formatVND(myUnitDoc)} <span className="text-[10px] text-slate-500 font-normal">/{leadVolumeParsed.unitName}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="10000"
                                  min="0"
                                  value={myUnitDoc}
                                  onChange={(e) => setMyUnitDoc(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-full text-right font-mono font-bold text-xs px-2 py-1.5 rounded-lg border-2 border-emerald-400 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                                />
                                <span className="text-[10px] text-slate-500 font-medium shrink-0">₫/{leadVolumeParsed.unitName}</span>
                              </div>
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => {
                          const unitDoc = q.unitDocumentationFee ?? Math.round(q.documentationFee / leadVolumeParsed.quantity);
                          return (
                            <td key={q.id} className="py-2 px-5 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                              {effectiveUnlocked ? `${formatVND(unitDoc)} / ${leadVolumeParsed.unitName}` : '••••••••• ₫'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* ================= SECTION 2: QUY MÔ DỰ ÁN & HỆ SỐ NHÂN ================= */}
                      <tr className="bg-slate-100/90 border-t border-b border-slate-200">
                        <td className="py-2 px-5 font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5 sticky left-0 bg-slate-100 z-10">
                          <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                          <span>2. QUY MÔ DỰ ÁN / GÓI THẦU (Hệ số nhân sản lượng)</span>
                        </td>

                        {/* Interactive Multiplier Qty (User) */}
                        {isBiddingActive && (
                          <td className="py-2 px-4 text-center border-x-2 border-emerald-500 font-black text-emerald-950 bg-emerald-100/80 shadow-2xs">
                            <span>x {leadVolumeParsed.quantity} {leadVolumeParsed.unitName} ({leadVolumeParsed.display})</span>
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-2 px-5 text-center border-l border-slate-200 font-extrabold text-indigo-900 bg-slate-50/60">
                            <span>x {leadVolumeParsed.quantity} {leadVolumeParsed.unitName} ({leadVolumeParsed.display})</span>
                          </td>
                        ))}
                      </tr>

                      {/* ================= SECTION 3: TỔNG CHI PHÍ CHO DỰ ÁN THẦU ================= */}
                      <tr className="bg-indigo-50/70 border-t-2 border-b border-indigo-200">
                        <td colSpan={competitorQuotes.length + (isBiddingActive ? 2 : 1)} className="py-2.5 px-5 font-black text-indigo-950 uppercase tracking-wide text-[11px] flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-indigo-700" />
                          <span>3. TỔNG CHI PHÍ CHO DỰ ÁN THẦU (ALL-IN TOTAL TENDER / CONTRACT COST)</span>
                        </td>
                      </tr>

                      {/* Row: Grand Total Price */}
                      <tr className="bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-900 sticky left-0 bg-indigo-50/30 z-10">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-indigo-600" />
                            <div>
                              <span className="block text-sm font-black text-slate-900">Tổng Chi Phí Dự Án Thầu</span>
                              <span className="text-[10px] text-indigo-700 font-semibold block">
                                (= Đơn giá x {leadVolumeParsed.quantity} {leadVolumeParsed.unitName})
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Interactive Grand Total (User) */}
                        {isBiddingActive && (
                          <td className="py-3.5 px-4 text-center border-x-2 border-emerald-500 bg-emerald-100/60 shadow-inner">
                            <div className="space-y-1">
                              <div className="text-lg font-black text-emerald-950 font-mono">
                                {formatVND(myTotalPrice)}
                              </div>
                              <span className="inline-block text-[10px] text-emerald-900 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
                                Trọn gói hợp đồng ({leadVolumeParsed.quantity} {leadVolumeParsed.unitName})
                              </span>
                            </div>
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-3.5 px-5 text-center border-l border-slate-100">
                            {effectiveUnlocked ? (
                              <div className="space-y-1">
                                <div className="text-base font-black text-slate-900 font-mono">
                                  {formatVND(q.totalPrice)}
                                </div>
                                <span className="inline-block text-[10px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                                  {lead.pricingType === 'CONTRACT' ? 'Trọn gói hợp đồng' : 'Trọn gói toàn bộ lô hàng'}
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="text-base font-black text-slate-400 font-mono tracking-wider">
                                  ••••••••• ₫
                                </span>
                                <span className="block text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  Khóa (50 Credits)
                                </span>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Breakdown Total 1: Base Freight */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Tổng cước vận chuyển chính toàn gói</span>
                        </td>

                        {isBiddingActive && (
                          <td className="py-2.5 px-4 text-center border-x-2 border-emerald-500 bg-emerald-50/30 font-bold text-slate-900 font-mono">
                            {formatVND(myTotalBase)}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-2.5 px-5 text-center border-l border-slate-100 font-semibold text-slate-800 font-mono">
                            {effectiveUnlocked ? formatVND(q.baseFreight) : '••••••••• ₫'}
                          </td>
                        ))}
                      </tr>

                      {/* Breakdown Total 2: Fuel Surcharge (BAF) */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Tổng phụ phí nhiên liệu (BAF Fuel) toàn gói</span>
                        </td>

                        {isBiddingActive && (
                          <td className="py-2.5 px-4 text-center border-x-2 border-emerald-500 bg-emerald-50/30 font-medium text-slate-800 font-mono">
                            {formatVND(myTotalFuel)}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-2.5 px-5 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                            {effectiveUnlocked ? formatVND(q.fuelSurcharge) : '••••••••• ₫'}
                          </td>
                        ))}
                      </tr>

                      {/* Breakdown Total 3: Tolls / Handling / BOT */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Tổng phí cầu đường BOT & bốc xếp toàn gói</span>
                        </td>

                        {isBiddingActive && (
                          <td className="py-2.5 px-4 text-center border-x-2 border-emerald-500 bg-emerald-50/30 font-medium text-slate-800 font-mono">
                            {formatVND(myTotalHandling)}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-2.5 px-5 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                            {effectiveUnlocked ? formatVND(q.handlingFee) : '••••••••• ₫'}
                          </td>
                        ))}
                      </tr>

                      {/* Breakdown Total 4: Documentation / Customs / Seal */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-5 text-slate-700 pl-8 sticky left-0 bg-white z-10">
                          <span>• Tổng chi phí chứng từ, seal, hải quan toàn gói</span>
                        </td>

                        {isBiddingActive && (
                          <td className="py-2.5 px-4 text-center border-x-2 border-emerald-500 bg-emerald-50/30 font-medium text-slate-800 font-mono">
                            {formatVND(myTotalDoc)}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-2.5 px-5 text-center border-l border-slate-100 text-slate-700 font-medium font-mono">
                            {effectiveUnlocked ? formatVND(q.documentationFee) : '••••••••• ₫'}
                          </td>
                        ))}
                      </tr>

                      {/* ================= SECTION 4: TIÊU CHÍ DỊCH VỤ (SLA) & ĐIỀU KHOẢN ================= */}
                      <tr className="bg-purple-50/60 border-t-2 border-b border-purple-200">
                        <td colSpan={competitorQuotes.length + (isBiddingActive ? 2 : 1)} className="py-2 px-5 font-bold text-purple-950 uppercase tracking-wide text-[11px] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-purple-700" />
                          <span>4. TIÊU CHÍ DỊCH VỤ CAM KẾT (SLA) & ĐIỀU KHOẢN THƯƠNG MẠI</span>
                        </td>
                      </tr>

                      {/* Row: Transit Time & Speed */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-5 font-bold text-slate-900 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-600" />
                            <span>Thời Gian Vận Chuyển</span>
                          </div>
                        </td>

                        {/* Interactive Transit Time (User) */}
                        {isBiddingActive && (
                          <td className="py-3 px-3 border-x-2 border-emerald-500 bg-white text-center">
                            {isAlreadyQuoted ? (
                              <div className="text-center font-extrabold text-slate-900 text-xs py-1">
                                <span>{myTransitTimeDisplay}</span>
                                <span className="block text-[10px] text-emerald-700 font-medium">Cam kết giao đúng SLA</span>
                              </div>
                            ) : (
                              <select
                                value={myTransitTimeDisplay}
                                onChange={(e) => {
                                  setMyTransitTimeDisplay(e.target.value);
                                  const days = e.target.value.includes('1.5') ? 1.5 : e.target.value.includes('1') ? 1 : e.target.value.includes('2') ? 2 : 3;
                                  setMyTransitTimeDays(days);
                                }}
                                className="w-full text-xs font-bold text-slate-900 bg-emerald-50/40 border border-emerald-300 rounded-lg p-1.5 focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="1.5 Ngày (36h Siêu Tốc)">1.5 Ngày (36h Siêu Tốc)</option>
                                <option value="2 Ngày (48h Chuẩn)">2 Ngày (48h Chuẩn)</option>
                                <option value="3 Ngày (Tiêu chuẩn)">3 Ngày (Tiêu chuẩn)</option>
                                <option value="4 Ngày (Tiết kiệm)">4 Ngày (Tiết kiệm)</option>
                              </select>
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-3.5 px-5 text-center border-l border-slate-100">
                            <div className="font-extrabold text-slate-900">
                              {effectiveUnlocked ? q.transitTimeDisplay : `${q.transitTimeDays} Ngày (Cam kết SLA)`}
                            </div>
                            <span className="text-[10px] text-slate-500">Cam kết giao đúng hẹn</span>
                          </td>
                        ))}
                      </tr>

                      {/* Row: Payment Terms */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-5 font-bold text-slate-900 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>Điều Khoản Công Nợ</span>
                          </div>
                        </td>

                        {/* Interactive Payment Terms (User) */}
                        {isBiddingActive && (
                          <td className="py-3 px-3 border-x-2 border-emerald-500 bg-white text-center">
                            {isAlreadyQuoted ? (
                              <div className="text-center py-1">
                                <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
                                  {myPaymentTerms}
                                </span>
                              </div>
                            ) : (
                              <select
                                value={myPaymentTerms}
                                onChange={(e) => setMyPaymentTerms(e.target.value)}
                                className="w-full text-xs font-bold text-purple-900 bg-purple-50 border border-purple-300 rounded-lg p-1.5 focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="Net 30 Days">Net 30 Days</option>
                                <option value="Net 45 Days">Net 45 Days</option>
                                <option value="Net 60 Days">Net 60 Days</option>
                                <option value="Thanh toán ngay (COD)">Thanh toán ngay (COD)</option>
                                <option value="Đặt cọc 30% + Net 30">Đặt cọc 30% + Net 30</option>
                              </select>
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-3.5 px-5 text-center border-l border-slate-100">
                            <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                              {effectiveUnlocked ? q.paymentTerms : '••••••••'}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Row: Demurrage / Staging */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-3 px-5 text-slate-800 font-semibold sticky left-0 bg-white z-10">
                          <span>Miễn phí lưu bãi / Đậu xe</span>
                        </td>

                        {/* Interactive Free Demurrage (User) */}
                        {isBiddingActive && (
                          <td className="py-3 px-3 border-x-2 border-emerald-500 bg-white text-center">
                            {isAlreadyQuoted ? (
                              <div className="text-center py-1 text-xs font-bold text-slate-800">
                                <strong>{myFreeDemurrageDays} Ngày</strong> miễn phí
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                <input
                                  type="number"
                                  min="0"
                                  max="30"
                                  value={myFreeDemurrageDays}
                                  onChange={(e) => setMyFreeDemurrageDays(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-14 text-center font-bold text-xs p-1.5 rounded-lg border border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                                />
                                <span className="text-xs font-semibold text-slate-700">Ngày</span>
                              </div>
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-3 px-5 text-center border-l border-slate-100 text-slate-700">
                            <strong>{q.freeDemurrageDays ?? 2} Ngày</strong> miễn phí
                          </td>
                        ))}
                      </tr>

                      {/* Row: Fleet & Value-Added Services */}
                      <tr className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-5 font-bold text-slate-900 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Ghi Chú Năng Lực & Cam Kết</span>
                          </div>
                        </td>

                        {/* Interactive Notes (User) */}
                        {isBiddingActive && (
                          <td className="py-3 px-3 border-x-2 border-emerald-500 bg-white text-left">
                            {isAlreadyQuoted ? (
                              <div className="py-1 text-left text-slate-700 leading-relaxed text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                                {myNotes || 'Đầy đủ năng lực phương tiện, bảo hiểm & cam kết SLA.'}
                              </div>
                            ) : (
                              <textarea
                                rows={2}
                                value={myNotes}
                                onChange={(e) => setMyNotes(e.target.value)}
                                className="w-full text-[11px] p-2 rounded-lg border border-emerald-300 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500 resize-none text-slate-800"
                                placeholder="Cam kết đội xe, bảo hiểm, định vị..."
                              />
                            )}
                          </td>
                        )}

                        {competitorQuotes.map((q) => (
                          <td key={q.id} className="py-3.5 px-5 text-left border-l border-slate-100 text-slate-600 leading-relaxed text-[11px]">
                            {effectiveUnlocked ? q.notes : '••••••••••••••••••••••••••••••••••••••••••••••••••'}
                          </td>
                        ))}
                      </tr>

                      {/* Row: Direct Submission Action */}
                      {isBiddingActive && (
                        <tr className="bg-emerald-100/70 border-t-2 border-b-2 border-emerald-500">
                          <td className="py-3.5 px-5 font-black text-emerald-950 sticky left-0 bg-emerald-100/90 z-10">
                            <div className="flex items-center gap-2">
                              <Send className="w-4 h-4 text-emerald-700" />
                              <span>HÀNH ĐỘNG NỘP BÁO GIÁ</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center border-x-2 border-emerald-500 bg-emerald-50/80">
                            {isAlreadyQuoted ? (
                              <button
                                type="button"
                                disabled={true}
                                className="w-full py-2.5 px-3 bg-emerald-800 text-emerald-100 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80 border border-emerald-600 transition-all select-none"
                                title="Bạn đã nộp báo giá cho gói thầu này"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                                <span>ĐÃ BÁO GIÁ</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSubmitMatrixBid}
                                disabled={isSubmittingQuote}
                                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-all disabled:opacity-50"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isSubmittingQuote ? 'Đang gửi...' : 'NỘP BÁO GIÁ NÀY'}</span>
                              </button>
                            )}
                          </td>
                          {competitorQuotes.map((q) => (
                            <td key={q.id} className="py-3 px-5 text-center text-[11px] text-slate-400 border-l border-slate-100">
                              (Báo giá của đối thủ)
                            </td>
                          ))}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPREHENSIVE COMPETITIVE QUOTATION BUILDER */}
          {activeTab === 'submit_quote' && (
            <form onSubmit={handleSubmitQuoteForm} className="space-y-5 animate-in fade-in duration-150">
              {/* Top Banner Status & Live Ranking Simulation */}
              <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                currentQuoteRanking.isLowest
                  ? 'bg-emerald-500/10 border-emerald-300 text-emerald-900'
                  : 'bg-indigo-500/10 border-indigo-300 text-indigo-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    currentQuoteRanking.isLowest ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {currentQuoteRanking.isLowest ? <Award className="w-6 h-6" /> : <Calculator className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider">Xếp Hạng Dự Kiến Của Báo Giá</span>
                      {currentQuoteRanking.isLowest ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                          🏆 TOP 1 BEST PRICE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
                          Hạng {currentQuoteRanking.rank} / {currentQuoteRanking.total}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5">
                      {currentQuoteRanking.isLowest
                        ? `Tuyệt vời! Giá chào của bạn đang thấp hơn đối thủ dẫn đầu ${formatVND(Math.abs(currentQuoteRanking.diffFromLowest))} (Tỷ lệ chốt thầu ước tính: 94%)`
                        : `Mức giá hiện tại cao hơn đối thủ thấp nhất ${formatVND(currentQuoteRanking.diffFromLowest)}. Hãy tối ưu cước chính để leo lên Top 1.`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Tổng Giá Chào Của Bạn</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {calculatedTotal.toLocaleString()} {currency}
                  </span>
                </div>
              </div>

              {/* SERVICE SPECIFICATIONS & CURRENCY SWITCHER */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Loại hình vận tải</span>
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 mt-0.5">
                      {lead.serviceType === 'Trucking' && <Truck className="w-3.5 h-3.5 text-blue-600" />}
                      {(lead.serviceType === 'Sea Freight (FCL)' || lead.serviceType === 'Sea Freight (LCL)') && <Ship className="w-3.5 h-3.5 text-cyan-600" />}
                      {lead.serviceType === 'Air Freight' && <Plane className="w-3.5 h-3.5 text-sky-600" />}
                      {lead.serviceType === 'Cold Chain' && <Snowflake className="w-3.5 h-3.5 text-emerald-600" />}
                      {lead.serviceType === 'Warehousing' && <Warehouse className="w-3.5 h-3.5 text-purple-600" />}
                      {lead.serviceType === 'Customs Clearance' && <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />}
                      {lead.serviceType === 'Cross-border' && <Globe className="w-3.5 h-3.5 text-orange-600" />}
                      <span>{lead.serviceType}</span>
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mã Yêu Cầu (Lead Ref)</span>
                    <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">
                      {lead.code} {lead.inquiryCode ? `(Ref: ${lead.inquiryCode})` : ''}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sản lượng yêu cầu</span>
                    <span className="text-xs font-bold text-purple-800 block mt-0.5">
                      {lead.volumeDisplay}
                    </span>
                  </div>
                </div>

                {/* Currency selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Đơn vị tiền tệ:</span>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCurrency('VND')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currency === 'VND' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      VND (₫)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currency === 'USD' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>
              </div>

              {/* DYNAMIC SERVICE PRICING BREAKDOWN */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    <span>1. Cấu Trúc Khai Báo Chi Tiết Giá (Itemized Tariff Breakdown)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Khớp với yêu cầu kỹ thuật của khách hàng</span>
                </div>

                {/* TRUCKING TARIFF */}
                {lead.serviceType === 'Trucking' && (
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cước Vận Chuyển Gốc (Base Freight VND) *
                        </label>
                        <input
                          type="number"
                          value={truckingBase}
                          onChange={(e) => setTruckingBase(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phụ Phí Nhiên Liệu (BAF Fuel Surcharge VND)
                        </label>
                        <input
                          type="number"
                          value={truckingBAF}
                          onChange={(e) => setTruckingBAF(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Cầu Đường BOT Tuyến Đường (VND)
                        </label>
                        <input
                          type="number"
                          value={truckingBOT}
                          onChange={(e) => setTruckingBOT(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phụ Phí Giao Nhiều Điểm (Multi-drop VND)
                        </label>
                        <input
                          type="number"
                          value={truckingMultiDrop}
                          onChange={(e) => setTruckingMultiDrop(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Nhân Công Bốc Xếp 2 Đầu (VND)
                        </label>
                        <input
                          type="number"
                          value={truckingLabor}
                          onChange={(e) => setTruckingLabor(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phụ Phí Xe Bửng Nâng Thủy Lực (VND)
                        </label>
                        <input
                          type="number"
                          value={truckingTailLift}
                          onChange={(e) => setTruckingTailLift(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* OCEAN TARIFF */}
                {(lead.serviceType === 'Sea Freight (FCL)' || lead.serviceType === 'Sea Freight (LCL)') && (
                  <div className="p-4 bg-cyan-50/50 rounded-2xl border border-cyan-200/80 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cước Biển Chính (Ocean Freight O/F USD) *
                        </label>
                        <input
                          type="number"
                          value={oceanOF}
                          onChange={(e) => setOceanOF(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-cyan-900 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tỷ Giá Quy Đổi (USD/VND)
                        </label>
                        <input
                          type="number"
                          value={oceanExRate}
                          onChange={(e) => setOceanExRate(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cam Kết Free Dem/Det (Số Ngày Miễn Phí)
                        </label>
                        <select
                          value={oceanFreeDemDet}
                          onChange={(e) => setOceanFreeDemDet(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-emerald-800"
                        >
                          <option value={7}>7 Ngày</option>
                          <option value={14}>14 Ngày (Tiêu chuẩn)</option>
                          <option value={21}>21 Ngày (Ưu đãi)</option>
                          <option value={28}>28 Ngày (Dài hạn)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          THC Cảng Bốc (POL VND)
                        </label>
                        <input
                          type="number"
                          value={oceanThcPol}
                          onChange={(e) => setOceanThcPol(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          THC Cảng Dỡ (POD VND)
                        </label>
                        <input
                          type="number"
                          value={oceanThcPod}
                          onChange={(e) => setOceanThcPod(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí B/L, Seal, VGM (VND)
                        </label>
                        <input
                          type="number"
                          value={oceanDocFee}
                          onChange={(e) => setOceanDocFee(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phụ Phí LSS/BAF (VND)
                        </label>
                        <input
                          type="number"
                          value={oceanLSS}
                          onChange={(e) => setOceanLSS(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* AIR TARIFF */}
                {lead.serviceType === 'Air Freight' && (
                  <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200/80 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Đơn Giá Cước Air (USD/Kg CW) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={airRatePerKg}
                          onChange={(e) => setAirRatePerKg(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-sky-900 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Khối Lượng Tính Cước (Chargeable Kg)
                        </label>
                        <input
                          type="number"
                          value={airChargeableWeight}
                          onChange={(e) => setAirChargeableWeight(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phụ Phí Nhiên Liệu FSC (USD)
                        </label>
                        <input
                          type="number"
                          value={airFSC}
                          onChange={(e) => setAirFSC(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phụ Phí An Ninh SSC (USD)
                        </label>
                        <input
                          type="number"
                          value={airSSC}
                          onChange={(e) => setAirSSC(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Vận Đơn AWB & Chứng Từ (VND)
                        </label>
                        <input
                          type="number"
                          value={airAwbFee}
                          onChange={(e) => setAirAwbFee(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Soi Chiếu Ga Hàng Không TCS/NCTS (VND)
                        </label>
                        <input
                          type="number"
                          value={airTerminalFee}
                          onChange={(e) => setAirTerminalFee(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* COLD CHAIN TARIFF */}
                {lead.serviceType === 'Cold Chain' && (
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cước Vận Tải Xe Lạnh Chuyên Dụng (VND) *
                        </label>
                        <input
                          type="number"
                          value={coldBaseFreight}
                          onChange={(e) => setColdBaseFreight(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-emerald-950 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Nhiên Liệu Chạy Máy Lạnh / Genset (VND)
                        </label>
                        <input
                          type="number"
                          value={coldGensetFuel}
                          onChange={(e) => setColdGensetFuel(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Cung Cấp Dữ Liệu Biểu Đồ Nhiệt IoT (VND)
                        </label>
                        <input
                          type="number"
                          value={coldDataLogger}
                          onChange={(e) => setColdDataLogger(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Cắm Điện Lưu Bãi Chờ Giao (Plug-in Depot VND)
                        </label>
                        <input
                          type="number"
                          value={coldDepotPlug}
                          onChange={(e) => setColdDepotPlug(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* WAREHOUSING TARIFF */}
                {lead.serviceType === 'Warehousing' && (
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Đơn Giá Thuê Mặt Bằng / Tháng (VND) *
                        </label>
                        <input
                          type="number"
                          value={whMonthlyRate}
                          onChange={(e) => setWhMonthlyRate(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-purple-950 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Nâng Hạ Inbound/Outbound (VND)
                        </label>
                        <input
                          type="number"
                          value={whHandlingInOut}
                          onChange={(e) => setWhHandlingInOut(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Quản Lý Vị Trí Pallet (VND)
                        </label>
                        <input
                          type="number"
                          value={whPalletMgmt}
                          onChange={(e) => setWhPalletMgmt(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Dịch Vụ VAS Tem Nhãn & Đóng Gói Kitting (VND)
                        </label>
                        <input
                          type="number"
                          value={whVASPackaging}
                          onChange={(e) => setWhVASPackaging(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Cổng API Tích Hợp Hệ Thống WMS (VND)
                        </label>
                        <input
                          type="number"
                          value={whWmsSystemFee}
                          onChange={(e) => setWhWmsSystemFee(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CUSTOMS TARIFF */}
                {lead.serviceType === 'Customs Clearance' && (
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phí Khai Tờ Khai Hải Quan Chính (VND) *
                        </label>
                        <input
                          type="number"
                          value={customsBaseDec}
                          onChange={(e) => setCustomsBaseDec(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-amber-950 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Dòng Hàng Bổ Sung (Add-on lines VND)
                        </label>
                        <input
                          type="number"
                          value={customsAddLines}
                          onChange={(e) => setCustomsAddLines(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Thủ Tục Làm Cấp C/O (VND)
                        </label>
                        <input
                          type="number"
                          value={customsCoFee}
                          onChange={(e) => setCustomsCoFee(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Đăng Ký Kiểm Tra Chuyên Ngành (VND)
                        </label>
                        <input
                          type="number"
                          value={customsInspectionFee}
                          onChange={(e) => setCustomsInspectionFee(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Hỗ Trợ Bốc Xếp & Kiểm Hóa Luồng Đỏ (VND)
                        </label>
                        <input
                          type="number"
                          value={customsRedChannel}
                          onChange={(e) => setCustomsRedChannel(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CROSS-BORDER TARIFF */}
                {lead.serviceType === 'Cross-border' && (
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cước Vận Chuyển Chặng Việt Nam (VND) *
                        </label>
                        <input
                          type="number"
                          value={crossVnLeg}
                          onChange={(e) => setCrossVnLeg(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-orange-950 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cước Vận Chuyển Chặng Quốc Tế (VND) *
                        </label>
                        <input
                          type="number"
                          value={crossIntlLeg}
                          onChange={(e) => setCrossIntlLeg(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-orange-950 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Sang Tải / Đổi Đầu Kéo Bãi Cửa Khẩu (VND)
                        </label>
                        <input
                          type="number"
                          value={crossTransshipment}
                          onChange={(e) => setCrossTransshipment(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Thủ Tục Thông Quan Biên Giới 2 Đầu (VND)
                        </label>
                        <input
                          type="number"
                          value={crossClearance}
                          onChange={(e) => setCrossClearance(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phí Giấy Phép Xe Liên Vận GMS / ASEAN (VND)
                        </label>
                        <input
                          type="number"
                          value={crossGmsPermit}
                          onChange={(e) => setCrossGmsPermit(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GRAND TOTAL SUMMARY BAR WITH CUSTOMER BUDGET BENCHMARK & % VARIANCE */}
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-emerald-700/40 space-y-3.5">
                {/* Top row: Calculated total price */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider block flex items-center gap-1.5">
                      <span>Tổng Báo Giá Trọn Gói Tự Động Tính (All-in Total Price)</span>
                      <span className="text-[10px] text-emerald-400 font-medium">({lead.pricingType === 'CONTRACT' ? 'Định kỳ Hợp đồng' : 'Theo chuyến / Lô'})</span>
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight flex items-baseline gap-2">
                      <span>{calculatedTotal.toLocaleString()}</span>
                      <span className="text-base sm:text-lg font-bold text-emerald-300">{currency}</span>
                    </div>
                    <p className="text-xs text-emerald-200/90 mt-0.5 font-medium">
                      {otherNote}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 shrink-0">
                    <span className="px-3 py-1 bg-emerald-800/90 border border-emerald-500/50 rounded-xl text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 shadow-2xs">
                      Full Tariff Synced
                    </span>
                    {lead.volumeDisplay && (
                      <span className="text-[11px] text-emerald-300/80 font-medium">
                        Sản lượng: {lead.volumeDisplay}
                      </span>
                    )}
                  </div>
                </div>

                {/* DÒNG TÍNH & HIỂN THỊ % CHÊNH LỆCH SO VỚI ĐƠN GIÁ DỰ KIẾN CỦA CUSTOMER */}
                <div className="pt-3 border-t border-emerald-800/80 bg-slate-950/45 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3.5 sm:p-4 rounded-b-2xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Thông tin đơn giá dự kiến của customer */}
                    <div className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-700/60 px-3 py-1.5 rounded-xl shadow-2xs text-xs">
                      <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-emerald-200 font-medium">Đơn giá dự kiến của Customer:</span>
                      <span className="font-extrabold text-amber-300 font-mono text-xs">
                        {lead.unitPriceDisplay || `${customerTargetPrice.toLocaleString()} ${currency}`}
                      </span>
                    </div>

                    {/* Huy hiệu % Chênh lệch */}
                    <div className="flex items-center gap-2">
                      {isLower && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 text-xs font-bold shadow-2xs">
                          <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Thấp hơn -{absDiffPercent.toFixed(1)}% (-{absDiffAmount.toLocaleString()} {currency})</span>
                        </div>
                      )}

                      {isExact && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/25 border border-cyan-400/60 text-cyan-200 text-xs font-bold shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                          <span>Khớp 100% (0.0% Chênh lệch)</span>
                        </div>
                      )}

                      {isHigher && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/25 border border-amber-400/60 text-amber-300 text-xs font-bold shadow-2xs">
                          <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Cao hơn +{absDiffPercent.toFixed(1)}% (+{absDiffAmount.toLocaleString()} {currency})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dòng đánh giá & Gợi ý cân đối giá cho supplier */}
                  <div className="mt-2.5 pt-2 border-t border-emerald-900/60 text-[11px] flex items-center gap-1.5">
                    {isLower && (
                      <span className="text-emerald-300/90 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Mức giá rất cạnh tranh! Dự kiến tăng <strong className="text-white underline decoration-emerald-400/50">85% tỷ lệ trúng thầu</strong> khi chủ hàng so sánh báo giá.</span>
                      </span>
                    )}
                    {isExact && (
                      <span className="text-cyan-200/90 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Báo giá khớp hoàn hảo với đơn giá dự kiến của khách hàng. Cơ hội chốt hợp đồng rất cao.</span>
                      </span>
                    )}
                    {isHigher && (
                      <span className="text-amber-200/90 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Khách hàng có đơn giá trần kỳ vọng là <strong className="text-amber-300 font-mono">{lead.unitPriceDisplay || `${customerTargetPrice.toLocaleString()} ${currency}`}</strong>. Hãy cân đối lại chi phí hoặc giải trình rõ năng lực vượt trội tại mục Ghi chú bên dưới.</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SLA, TRANSIT & COMMERCIAL TERMS */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  2. Cam Kết Thời Gian Giao Hàng & Điều Khoản Thương Mại
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Thời Gian Vận Chuyển (Transit Time)</span>
                    </label>
                    <input
                      type="text"
                      value={transitTimeDisplay}
                      onChange={(e) => setTransitTimeDisplay(e.target.value)}
                      placeholder="VD: 2 Ngày (48 Giờ cam kết)"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Điều Khoản Thanh Toán (Payment Terms)</span>
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="Net 30 Days">Net 30 Days (30 Ngày sau khi nhận POD)</option>
                      <option value="Net 45 Days">Net 45 Days (45 Ngày thanh toán)</option>
                      <option value="Net 60 Days">Net 60 Days (Dành cho Key Account)</option>
                      <option value="COD / Thanh toán khi giao hàng">COD (Thanh toán ngay khi giao nhận)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span>Báo Giá Có Hiệu Lực Đến Ngày (Valid Until)</span>
                    </label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ghi Chú Chi Tiết Năng Lực & Cam Kết Kỹ Thuật
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú năng lực phương tiện, bảo hiểm, quy trình xử lý sự cố..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Form Submission Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('compare')}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  ← Quay lại Ma Trận So Sánh
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingQuote || quoteSubmittedSuccess || isAlreadyQuoted}
                    className={`px-6 py-3 rounded-2xl text-xs font-extrabold text-white shadow-lg transition-all flex items-center gap-2 ${
                      isAlreadyQuoted || quoteSubmittedSuccess
                        ? 'bg-emerald-700 cursor-not-allowed opacity-90'
                        : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 cursor-pointer'
                    }`}
                  >
                    {isSubmittingQuote ? (
                      <span>Đang nộp báo giá...</span>
                    ) : (isAlreadyQuoted || quoteSubmittedSuccess) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Đã Nộp Báo Giá ({calculatedTotal.toLocaleString()} {currency})</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Xác Nhận Nộp Báo Giá ({calculatedTotal.toLocaleString()} {currency})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
        )}

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">FlexGO Intelligence Center</span>
            <span>•</span>
            <span>Cập nhật báo giá thị trường thời gian thực</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* POPUP: QUOTE CONFIRMATION & WIN OPPORTUNITY ANALYSIS MODAL */}
      {showConfirmationModal && pendingQuotePayload && (
        <QuoteConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirmSubmit={handleConfirmFinalQuote}
          isSubmitting={isSubmittingQuote}
          lead={lead}
          quoteData={pendingQuotePayload.quoteData}
          marketAnalytics={marketAnalytics}
          competitorQuotes={competitorQuotes}
        />
      )}
    </div>
  );
};
