import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  ArrowRight,
  Info,
  CheckCircle2,
  Truck,
  Ship,
  Plane,
  ThermometerSnowflake,
  Building2,
  Globe,
  Tag,
  Sparkles,
  Send,
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';
import { QuotationItem, ServiceType, ServiceCostBreakdown, PricingType } from '../../types';

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quote: Partial<QuotationItem>) => void;
  presetInquiryCode?: string;
  presetInquiryTitle?: string;
  presetCustomerCompany?: string;
  presetRoute?: string;
  presetServiceType?: ServiceType;
  presetTargetUnitPrice?: number;
  presetTargetUnitDisplay?: string;
  presetEstimatedValue?: number;
  presetEstimatedValueDisplay?: string;
  presetPricingType?: PricingType;
  presetVolumeDisplay?: string;
}

export const CreateQuotationModal: React.FC<CreateQuotationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  presetInquiryCode = 'FG-2608250001',
  presetInquiryTitle = 'HCMC → Hanoi Trucking Service (FTL 15-Ton)',
  presetCustomerCompany = 'ABC Manufacturing Vietnam Co., Ltd.',
  presetRoute = 'HCMC → Hanoi (1,720 km via QL1A/Expressway)',
  presetServiceType = 'Trucking',
  presetTargetUnitPrice,
  presetTargetUnitDisplay,
  presetEstimatedValue,
  presetEstimatedValueDisplay,
  presetPricingType = 'SPOT',
  presetVolumeDisplay,
}) => {
  const [currency, setCurrency] = useState<'VND' | 'USD'>(
    presetServiceType === 'Sea Freight (FCL)' || presetServiceType === 'Air Freight' ? 'USD' : 'VND'
  );

  // Common Quotation Fields
  const [transitTimeDays, setTransitTimeDays] = useState<number>(2);
  const [transitTimeDisplay, setTransitTimeDisplay] = useState<string>('2 Ngày (48 Giờ cam kết)');
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 45 Days');
  const [validUntil, setValidUntil] = useState<string>('2026-09-15');
  const [notes, setNotes] = useState<string>(
    'Đội xe đạt chuẩn khí thải Euro 5, tài xế 2 người luân phiên, hỗ trợ định vị GPS Live và bảo hiểm hàng hóa 100%.'
  );

  // Service-specific Breakdown States
  // 1. Trucking
  const [truckingBase, setTruckingBase] = useState<number>(8800000);
  const [truckingBAF, setTruckingBAF] = useState<number>(80000);
  const [truckingBOT, setTruckingBOT] = useState<number>(0);
  const [isReturnTruck, setIsReturnTruck] = useState<boolean>(false);
  const [truckingMultiDrop, setTruckingMultiDrop] = useState<number>(0);
  const [truckingLabor, setTruckingLabor] = useState<number>(0);
  const [truckingTailLift, setTruckingTailLift] = useState<number>(0);
  const [truckingGpsFee, setTruckingGpsFee] = useState<number>(0); // 0đ Free default
  const [truckingSealFee, setTruckingSealFee] = useState<number>(0); // 0đ Free default
  const [truckingPodFee, setTruckingPodFee] = useState<number>(0); // 0đ Free default
  const [truckingPermitFee, setTruckingPermitFee] = useState<number>(0);

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

  // Sync state when modal opens or lead changes
  useEffect(() => {
    if (isOpen) {
      if (presetServiceType === 'Trucking') {
        if (presetTargetUnitPrice && presetTargetUnitPrice > 0) {
          const base = Math.round(presetTargetUnitPrice * 0.98);
          const baf = presetTargetUnitPrice - base;
          setTruckingBase(base);
          setTruckingBAF(baf);
        } else {
          setTruckingBase(8800000);
          setTruckingBAF(80000);
        }
        setTruckingBOT(0);
        setTruckingMultiDrop(0);
        setTruckingLabor(0);
        setTruckingTailLift(0);
      }
    }
  }, [isOpen, presetTargetUnitPrice, presetServiceType]);

  if (!isOpen) return null;

  // Calculate Total based on Service Type
  let calculatedTotal = 0;
  let baseFreightVal = 0;
  let fuelSurchargeVal = 0;
  let handlingFeeVal = 0;
  let docFeeVal = 0;
  let otherFeeVal = 0;
  let otherNote = '';

  if (presetServiceType === 'Trucking') {
    const vasTotal = truckingLabor + truckingTailLift + truckingGpsFee + truckingSealFee + truckingPodFee + truckingPermitFee;
    calculatedTotal = truckingBase + truckingBAF + truckingBOT + truckingMultiDrop + vasTotal;
    baseFreightVal = truckingBase;
    fuelSurchargeVal = truckingBAF;
    handlingFeeVal = truckingLabor + truckingTailLift;
    docFeeVal = truckingPodFee;
    otherFeeVal = truckingBOT + truckingMultiDrop + truckingGpsFee + truckingSealFee + truckingPermitFee;
    otherNote = 'Bao gồm BOT, GPS Live, Niêm phong Seal & các tiện ích VAS';
  } else if (presetServiceType === 'Sea Freight (FCL)' || presetServiceType === 'Sea Freight (LCL)') {
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
  } else if (presetServiceType === 'Air Freight') {
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
  } else if (presetServiceType === 'Cold Chain') {
    calculatedTotal = coldBaseFreight + coldGensetFuel + coldDataLogger + coldDepotPlug;
    baseFreightVal = coldBaseFreight;
    fuelSurchargeVal = coldGensetFuel;
    handlingFeeVal = coldDepotPlug;
    docFeeVal = 0;
    otherFeeVal = coldDataLogger;
    otherNote = 'Cung cấp biểu đồ IoT Logger & máy phát Genset liên tục';
  } else if (presetServiceType === 'Warehousing') {
    calculatedTotal = whMonthlyRate + whHandlingInOut + whPalletMgmt + whVASPackaging + whWmsSystemFee;
    baseFreightVal = whMonthlyRate;
    fuelSurchargeVal = 0;
    handlingFeeVal = whHandlingInOut + whPalletMgmt;
    docFeeVal = whWmsSystemFee;
    otherFeeVal = whVASPackaging;
    otherNote = 'Bao gồm dán nhãn VAS, quản lý Pallet & kết nối API WMS';
  } else if (presetServiceType === 'Customs Clearance') {
    calculatedTotal = customsBaseDec + customsAddLines + customsCoFee + customsInspectionFee + customsRedChannel;
    baseFreightVal = customsBaseDec;
    fuelSurchargeVal = 0;
    handlingFeeVal = customsRedChannel + customsInspectionFee;
    docFeeVal = customsCoFee + customsAddLines;
    otherFeeVal = 0;
    otherNote = 'Trọn gói tờ khai, hỗ trợ luồng đỏ & thủ tục cấp C/O';
  } else if (presetServiceType === 'Cross-border') {
    calculatedTotal = crossVnLeg + crossIntlLeg + crossTransshipment + crossClearance + crossGmsPermit;
    baseFreightVal = crossVnLeg + crossIntlLeg;
    fuelSurchargeVal = 0;
    handlingFeeVal = crossTransshipment;
    docFeeVal = crossClearance + crossGmsPermit;
    otherFeeVal = 0;
    otherNote = 'Bao gồm sang tải bãi cửa khẩu & thông quan liên vận GMS';
  } else {
    calculatedTotal = 48000000;
    baseFreightVal = 42000000;
    fuelSurchargeVal = 3800000;
    handlingFeeVal = 1200000;
    docFeeVal = 500000;
    otherFeeVal = 500000;
  }

  // Customer target budget / price calculation
  const rawTargetVND = presetTargetUnitPrice && presetTargetUnitPrice > 0 
    ? presetTargetUnitPrice 
    : (presetServiceType === 'Trucking' ? 8800000 : (presetEstimatedValue || 48000000));

  let customerTargetPrice = rawTargetVND;
  if (currency === 'USD') {
    if (presetServiceType === 'Sea Freight (FCL)') {
      customerTargetPrice = 2800;
    } else if (presetServiceType === 'Air Freight') {
      customerTargetPrice = Math.round((airRatePerKg * airChargeableWeight) + 270);
    } else if (rawTargetVND > 0) {
      customerTargetPrice = Math.round(rawTargetVND / 25400);
    }
  }

  const diffAmount = calculatedTotal - customerTargetPrice;
  const diffPercent = customerTargetPrice > 0 ? ((diffAmount / customerTargetPrice) * 100) : 0;
  const absDiffAmount = Math.abs(diffAmount);
  const absDiffPercent = Math.abs(diffPercent);
  const isLower = diffAmount < -1;
  const isExact = Math.abs(diffAmount) <= 1;
  const isHigher = diffAmount > 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuoteCode = `QUO-${Math.floor(10000 + Math.random() * 90000)}`;

    const costBreakdown: ServiceCostBreakdown = {};
    if (presetServiceType === 'Trucking') {
      costBreakdown.trucking = {
        baseFreightVND: truckingBase,
        fuelBAFSurchargeVND: truckingBAF,
        tollBOTFeesVND: truckingBOT,
        multiDropFeeVND: truckingMultiDrop,
        loadingLaborFeeVND: truckingLabor,
        tailLiftFeeVND: truckingTailLift,
      };
    } else if (presetServiceType === 'Sea Freight (FCL)' || presetServiceType === 'Sea Freight (LCL)') {
      costBreakdown.ocean = {
        oceanFreightUSD: oceanOF,
        exchangeRate: oceanExRate,
        thcPolVND: oceanThcPol,
        thcPodVND: oceanThcPod,
        blSealVgmFeesVND: oceanDocFee,
        bafLssSurchargeVND: oceanLSS,
        freeDemDetDaysOffered: oceanFreeDemDet,
      };
    } else if (presetServiceType === 'Air Freight') {
      costBreakdown.air = {
        ratePerKgUSD: airRatePerKg,
        chargeableWeightKg: airChargeableWeight,
        fscFuelSurchargeUSD: airFSC,
        sscSecuritySurchargeUSD: airSSC,
        awbDocumentFeeVND: airAwbFee,
        airportScreeningFeeVND: airTerminalFee,
        terminalHandlingFeeVND: airTerminalFee,
      };
    } else if (presetServiceType === 'Cold Chain') {
      costBreakdown.coldChain = {
        reeferBaseFreightVND: coldBaseFreight,
        gensetRunningFuelVND: coldGensetFuel,
        dataLoggerCertificateVND: coldDataLogger,
        plugInDepotFeeVND: coldDepotPlug,
      };
    } else if (presetServiceType === 'Warehousing') {
      costBreakdown.warehousing = {
        storageRateMonthlyVND: whMonthlyRate,
        inboundOutboundHandlingVND: whHandlingInOut,
        palletManagementVND: whPalletMgmt,
        vasPackagingLabellingVND: whVASPackaging,
        wmsSystemFeeVND: whWmsSystemFee,
      };
    } else if (presetServiceType === 'Customs Clearance') {
      costBreakdown.customs = {
        customsDeclarationFeeVND: customsBaseDec,
        additionalLinesFeeVND: customsAddLines,
        coIssuanceFeeVND: customsCoFee,
        specializedInspectionFeeVND: customsInspectionFee,
        redChannelHandlingFeeVND: customsRedChannel,
      };
    } else if (presetServiceType === 'Cross-border') {
      costBreakdown.crossBorder = {
        vietnamLegFreightVND: crossVnLeg,
        internationalLegFreightVND: crossIntlLeg,
        borderTransshipmentFeeVND: crossTransshipment,
        borderClearanceFeeVND: crossClearance,
        gmsPermitFeeVND: crossGmsPermit,
      };
    }

    onSubmit({
      code: newQuoteCode,
      inquiryCode: presetInquiryCode,
      inquiryTitle: presetInquiryTitle,
      customerCompany: presetCustomerCompany,
      supplierId: 'supp-01',
      supplierName: 'VinaTrans Logistics JSC',
      supplierRating: 4.9,
      serviceType: presetServiceType,
      route: presetRoute,
      currency,
      baseFreight: baseFreightVal,
      fuelSurcharge: fuelSurchargeVal,
      handlingFee: handlingFeeVal,
      documentationFee: docFeeVal,
      otherCharges: otherFeeVal,
      otherChargesNote: otherNote,
      totalPrice: calculatedTotal,
      costBreakdown,
      transitTimeDays,
      transitTimeDisplay,
      paymentTerms,
      validUntil,
      status: 'Sent',
      notes,
      freeDemurrageDays: presetServiceType.includes('Sea') ? oceanFreeDemDet : undefined,
      createdAt: 'Hôm nay',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="supplier-create-quotation-modal"
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-emerald-900/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 rounded-full uppercase tracking-wider">
                Quotation Builder Engine
              </span>
              <span className="text-xs text-slate-300">Supplier Workspace</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <span>Lập Báo Giá Chi Tiết Theo Loại Hình: {presetServiceType}</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Mã Yêu Cầu (Lead Ref): <span className="font-bold text-emerald-300">{presetInquiryCode}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Inquiry summary header banner */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Tuyến Đường & Hành Trình</span>
              <span className="font-bold text-slate-900">{presetRoute}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Dịch Vụ Yêu Cầu</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                {presetServiceType}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Loại Tiền Tệ</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  type="button"
                  onClick={() => setCurrency('VND')}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    currency === 'VND' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  VND
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    currency === 'USD' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  USD
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
            {presetServiceType === 'Trucking' && (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-4">
                {/* Return truck badge / toggle */}
                <div className="flex items-center justify-between p-2.5 bg-indigo-900 text-white rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded-md">
                      ⚡ BACKHAUL
                    </span>
                    <span className="font-bold">Ưu Đãi Xe Quay Đầu Tuyến Này:</span>
                    <span className="text-slate-300 text-[11px] hidden sm:inline">Giúp chủ hàng tiết kiệm 25-40% cước</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isReturnTruck}
                      onChange={(e) => {
                        setIsReturnTruck(e.target.checked);
                        if (e.target.checked && truckingBase > 6000000) {
                          setTruckingBase(Math.round(truckingBase * 0.7)); // Auto suggest 30% discount
                        }
                      }}
                      className="rounded text-indigo-500 focus:ring-indigo-400"
                    />
                    <span className="text-xs font-bold text-amber-300">Áp dụng Giá Xe Quay Đầu</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cước Vận Chuyển Gốc (Base Freight VND) *
                    </label>
                    <input
                      type="number"
                      value={truckingBase}
                      onChange={(e) => setTruckingBase(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* ITEM DIRECT VAS PRICING & FREE OPTIONS */}
                <div className="pt-3 border-t border-blue-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Biểu Phí Dịch Vụ Giá Trị Gia Tăng (VAS) & Tiện Ích Kèm Theo</span>
                    </span>
                    <span className="text-[10px] text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full font-medium">
                      Nhà xe có thể báo 0đ (Miễn phí / Tặng kèm)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* GPS Tracking Link */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Định Vị GPS Real-time</span>
                        <button
                          type="button"
                          onClick={() => setTruckingGpsFee(0)}
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                            truckingGpsFee === 0 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          {truckingGpsFee === 0 ? '✓ Miễn phí 0đ' : 'Báo 0đ (Free)'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={truckingGpsFee}
                          onChange={(e) => setTruckingGpsFee(Number(e.target.value))}
                          placeholder="0 VND"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">VND</span>
                      </div>
                    </div>

                    {/* Seal & Photo */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Kẹp Chì Seal & Chụp Ảnh</span>
                        <button
                          type="button"
                          onClick={() => setTruckingSealFee(0)}
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                            truckingSealFee === 0 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          {truckingSealFee === 0 ? '✓ Miễn phí 0đ' : 'Báo 0đ (Free)'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={truckingSealFee}
                          onChange={(e) => setTruckingSealFee(Number(e.target.value))}
                          placeholder="0 VND"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">VND</span>
                      </div>
                    </div>

                    {/* POD Return */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Thu Hồi Chứng Từ POD</span>
                        <button
                          type="button"
                          onClick={() => setTruckingPodFee(0)}
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                            truckingPodFee === 0 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          {truckingPodFee === 0 ? '✓ Miễn phí 0đ' : 'Báo 0đ (Free)'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={truckingPodFee}
                          onChange={(e) => setTruckingPodFee(Number(e.target.value))}
                          placeholder="0 VND"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">VND</span>
                      </div>
                    </div>

                    {/* Labor */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Nhân Công Bốc Xếp 2 Đầu</span>
                        <button
                          type="button"
                          onClick={() => setTruckingLabor(0)}
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                            truckingLabor === 0 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          {truckingLabor === 0 ? '✓ Miễn phí 0đ' : 'Báo 0đ'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={truckingLabor}
                          onChange={(e) => setTruckingLabor(Number(e.target.value))}
                          placeholder="0 VND"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">VND</span>
                      </div>
                    </div>

                    {/* Tail Lift */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Xe Bửng Nâng Thủy Lực</span>
                        <button
                          type="button"
                          onClick={() => setTruckingTailLift(0)}
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                            truckingTailLift === 0 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          {truckingTailLift === 0 ? '✓ Miễn phí 0đ' : 'Báo 0đ'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={truckingTailLift}
                          onChange={(e) => setTruckingTailLift(Number(e.target.value))}
                          placeholder="0 VND"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">VND</span>
                      </div>
                    </div>

                    {/* Multi-Drop Surcharge */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Phụ Phí Giao Đa Điểm</span>
                        <button
                          type="button"
                          onClick={() => setTruckingMultiDrop(0)}
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${
                            truckingMultiDrop === 0 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          {truckingMultiDrop === 0 ? '✓ Miễn phí 0đ' : 'Báo 0đ'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={truckingMultiDrop}
                          onChange={(e) => setTruckingMultiDrop(Number(e.target.value))}
                          placeholder="0 VND"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">VND</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OCEAN TARIFF */}
            {(presetServiceType === 'Sea Freight (FCL)' || presetServiceType === 'Sea Freight (LCL)') && (
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-cyan-900"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AIR TARIFF */}
            {presetServiceType === 'Air Freight' && (
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-sky-900"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COLD CHAIN TARIFF */}
            {presetServiceType === 'Cold Chain' && (
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-emerald-950"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WAREHOUSING TARIFF */}
            {presetServiceType === 'Warehousing' && (
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-purple-950"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMS TARIFF */}
            {presetServiceType === 'Customs Clearance' && (
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-amber-950"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CROSS-BORDER TARIFF */}
            {presetServiceType === 'Cross-border' && (
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-orange-950"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-orange-950"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
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
                  <span className="text-[10px] text-emerald-400 font-medium">({presetPricingType === 'CONTRACT' ? 'Định kỳ Hợp đồng' : 'Theo chuyến / Lô'})</span>
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
                {presetVolumeDisplay && (
                  <span className="text-[11px] text-emerald-300/80 font-medium">
                    Sản lượng: {presetVolumeDisplay}
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
                    {presetTargetUnitDisplay || `${customerTargetPrice.toLocaleString()} ${currency}`}
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
                    <span>Khách hàng có đơn giá trần kỳ vọng là <strong className="text-amber-300 font-mono">{presetTargetUnitDisplay || `${customerTargetPrice.toLocaleString()} ${currency}`}</strong>. Hãy cân đối lại chi phí hoặc giải trình rõ năng lực vượt trội tại mục Ghi chú bên dưới.</span>
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
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Phát Hành Báo Giá Chính Thức (Submit Quotation)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
