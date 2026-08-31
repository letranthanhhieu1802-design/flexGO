import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Calculator, 
  Send,
  Sparkles,
  Check
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
  const [transitTimeDisplay, setTransitTimeDisplay] = useState<string>('2 Ngày (48 Giờ cam kết)');
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 45 Days');
  const [validUntil, setValidUntil] = useState<string>('2026-09-15');
  const [notes, setNotes] = useState<string>(
    'Đội xe đạt chuẩn khí thải Euro 5, tài xế 2 người luân phiên, hỗ trợ định vị GPS Live và bảo hiểm hàng hóa 100%.'
  );

  // Service-specific Breakdown States
  // 1. Trucking
  const [truckingBase, setTruckingBase] = useState<number>(5950000);
  const [truckingBAF, setTruckingBAF] = useState<number>(580000);
  const [truckingBOT, setTruckingBOT] = useState<number>(290000);
  const [truckingDocManagement, setTruckingDocManagement] = useState<number>(150000);
  const [isReturnTruck, setIsReturnTruck] = useState<boolean>(false);
  const [truckingMultiDrop, setTruckingMultiDrop] = useState<number>(0);
  const [truckingLabor, setTruckingLabor] = useState<number>(0);
  const [truckingTailLift, setTruckingTailLift] = useState<number>(0);
  const [truckingGpsFee, setTruckingGpsFee] = useState<number>(0); // 0đ Free default
  const [truckingSealFee, setTruckingSealFee] = useState<number>(0); // 0đ Free default
  const [truckingPodFee, setTruckingPodFee] = useState<number>(0); // 0đ Free default

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
  const [coldDataLogger, setColdDataLogger] = useState<number>(0);
  const [coldDepotPlug, setColdDepotPlug] = useState<number>(0);

  // 5. Warehousing
  const [whMonthlyRate, setWhMonthlyRate] = useState<number>(135000000);
  const [whHandlingInOut, setWhHandlingInOut] = useState<number>(18000000);
  const [whPalletMgmt, setWhPalletMgmt] = useState<number>(8500000);
  const [whVASPackaging, setWhVASPackaging] = useState<number>(0);
  const [whWmsSystemFee, setWhWmsSystemFee] = useState<number>(0);

  // 6. Customs
  const [customsBaseDec, setCustomsBaseDec] = useState<number>(1800000);
  const [customsAddLines, setCustomsAddLines] = useState<number>(400000);
  const [customsCoFee, setCustomsCoFee] = useState<number>(1200000);
  const [customsInspectionFee, setCustomsInspectionFee] = useState<number>(0);
  const [customsRedChannel, setCustomsRedChannel] = useState<number>(0);

  // 7. Cross-border
  const [crossVnLeg, setCrossVnLeg] = useState<number>(18000000);
  const [crossIntlLeg, setCrossIntlLeg] = useState<number>(24000000);
  const [crossTransshipment, setCrossTransshipment] = useState<number>(3500000);
  const [crossClearance, setCrossClearance] = useState<number>(2500000);
  const [crossGmsPermit, setCrossGmsPermit] = useState<number>(0);

  // Sync state when modal opens or lead changes
  useEffect(() => {
    if (isOpen) {
      if (presetServiceType === 'Trucking') {
        if (presetTargetUnitPrice && presetTargetUnitPrice > 0) {
          const base = Math.round(presetTargetUnitPrice * 0.85);
          const baf = Math.round(presetTargetUnitPrice * 0.08);
          const bot = Math.round(presetTargetUnitPrice * 0.05);
          const doc = presetTargetUnitPrice - (base + baf + bot);
          setTruckingBase(base);
          setTruckingBAF(baf);
          setTruckingBOT(bot);
          setTruckingDocManagement(doc > 0 ? doc : 150000);
        } else {
          setTruckingBase(5950000);
          setTruckingBAF(580000);
          setTruckingBOT(290000);
          setTruckingDocManagement(150000);
        }
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
    const vasTotal = truckingLabor + truckingTailLift + truckingGpsFee + truckingSealFee + truckingPodFee + truckingMultiDrop;
    calculatedTotal = truckingBase + truckingBAF + truckingBOT + truckingDocManagement + vasTotal;
    baseFreightVal = truckingBase;
    fuelSurchargeVal = truckingBAF;
    handlingFeeVal = truckingLabor + truckingTailLift;
    docFeeVal = truckingDocManagement + truckingPodFee;
    otherFeeVal = truckingBOT + truckingMultiDrop + truckingGpsFee + truckingSealFee;
    otherNote = 'Bao gồm cước chính, BAF, vé cầu đường BOT, chứng từ & các tiện ích VAS kèm theo';
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
      transitTimeDays: 2,
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
              Mã Yêu Cầu (Lead Ref): <span className="font-bold text-emerald-300 font-mono">{presetInquiryCode}</span>
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

          {/* SECTION 1: CẤU TRÚC ĐƠN GIÁ CƯỚC & PHỤ PHÍ THEO HÀNG */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>1. Cấu Trúc Khai Báo Chi Tiết Giá (Itemized Tariff Breakdown)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Khớp từng dòng với ma trận đối soát</span>
            </div>

            {/* TRUCKING TARIFF BREAKDOWN */}
            {presetServiceType === 'Trucking' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                {/* Backhaul toggle banner */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white text-xs border-b border-indigo-900/50">
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
                        if (e.target.checked && truckingBase > 4500000) {
                          setTruckingBase(Math.round(truckingBase * 0.75));
                        }
                      }}
                      className="rounded text-indigo-500 focus:ring-indigo-400"
                    />
                    <span className="text-xs font-bold text-amber-300">Áp dụng Giá Xe Quay Đầu</span>
                  </label>
                </div>

                {/* Table Itemized Rows */}
                <div className="p-4 space-y-3 bg-slate-50/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cước Vận Chuyển Gốc (Base Freight) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={truckingBase}
                          onChange={(e) => setTruckingBase(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phụ Phí Nhiên Liệu (BAF Fuel)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={truckingBAF}
                          onChange={(e) => setTruckingBAF(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-900 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phí Cầu Đường BOT Tuyến Đường
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={truckingBOT}
                          onChange={(e) => setTruckingBOT(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-900 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phí Chứng Từ & Quản Lý Đơn
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={truckingDocManagement}
                          onChange={(e) => setTruckingDocManagement(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-900 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OCEAN TARIFF BREAKDOWN */}
            {(presetServiceType === 'Sea Freight (FCL)' || presetServiceType === 'Sea Freight (LCL)') && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cước Biển Chính (Ocean Freight OF) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={oceanOF}
                        onChange={(e) => setOceanOF(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-cyan-950 pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">USD</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phụ Phí LSS / BAF Xăng Dầu (VND)
                    </label>
                    <input
                      type="number"
                      value={oceanLSS}
                      onChange={(e) => setOceanLSS(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phí Chứng Từ Bill / Seal / VGM (VND)
                    </label>
                    <input
                      type="number"
                      value={oceanDocFee}
                      onChange={(e) => setOceanDocFee(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phí Nâng Hạ Cảng Xuất (THC POL VND)
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
                      Phí Nâng Hạ Cảng Nhập (THC POD VND)
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
                      Số Ngày Miễn Phí Lưu Cont (Free Dem/Det)
                    </label>
                    <input
                      type="number"
                      value={oceanFreeDemDet}
                      onChange={(e) => setOceanFreeDemDet(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-indigo-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AIR TARIFF BREAKDOWN */}
            {presetServiceType === 'Air Freight' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Đơn Giá Cước Bay (Rate / Kg USD) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={airRatePerKg}
                      onChange={(e) => setAirRatePerKg(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-sky-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phụ Phí Nhiên Liệu Hàng Không (FSC USD)
                    </label>
                    <input
                      type="number"
                      value={airFSC}
                      onChange={(e) => setAirFSC(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phụ Phí An Ninh Hàng Không (SSC USD)
                    </label>
                    <input
                      type="number"
                      value={airSSC}
                      onChange={(e) => setAirSSC(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phí Phát Hành Vận Đơn (AWB Fee VND)
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
                      Phí Lao Vụ Sân Bay & Soi Chiếu (Terminal/X-Ray VND)
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

            {/* COLD CHAIN TARIFF BREAKDOWN */}
            {presetServiceType === 'Cold Chain' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cước Vận Chuyển Xe Lạnh Cơ Sở (VND) *
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
                      Phí Chạy Máy Lạnh Genset Suốt Tuyến (VND)
                    </label>
                    <input
                      type="number"
                      value={coldGensetFuel}
                      onChange={(e) => setColdGensetFuel(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WAREHOUSING TARIFF BREAKDOWN */}
            {presetServiceType === 'Warehousing' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
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
              </div>
            )}

            {/* CUSTOMS TARIFF BREAKDOWN */}
            {presetServiceType === 'Customs Clearance' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
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
              </div>
            )}

            {/* CROSS-BORDER TARIFF BREAKDOWN */}
            {presetServiceType === 'Cross-border' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
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
                      Phí Sang Tải / Bãi Cửa Khẩu (VND)
                    </label>
                    <input
                      type="number"
                      value={crossTransshipment}
                      onChange={(e) => setCrossTransshipment(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: BIỂU PHÍ DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>2. Biểu Phí Dịch Vụ Giá Trị Gia Tăng (VAS) & Tiện Ích Kèm Theo</span>
              </label>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Nhà xe có thể báo 0đ (Miễn phí / Tặng kèm)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* VAS 1: GPS Live */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Định vị GPS Real-time</span>
                  <button
                    type="button"
                    onClick={() => setTruckingGpsFee(truckingGpsFee === 0 ? 100000 : 0)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      truckingGpsFee === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {truckingGpsFee === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={truckingGpsFee}
                    onChange={(e) => setTruckingGpsFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg pr-10 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">VND</span>
                </div>
              </div>

              {/* VAS 2: Kẹp Chì Seal */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Kẹp Chì Seal & Chụp Ảnh</span>
                  <button
                    type="button"
                    onClick={() => setTruckingSealFee(truckingSealFee === 0 ? 50000 : 0)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      truckingSealFee === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {truckingSealFee === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={truckingSealFee}
                    onChange={(e) => setTruckingSealFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg pr-10 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">VND</span>
                </div>
              </div>

              {/* VAS 3: Thu Hồi POD */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Thu Hồi Chứng Từ POD Gốc</span>
                  <button
                    type="button"
                    onClick={() => setTruckingPodFee(truckingPodFee === 0 ? 100000 : 0)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      truckingPodFee === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {truckingPodFee === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={truckingPodFee}
                    onChange={(e) => setTruckingPodFee(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg pr-10 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">VND</span>
                </div>
              </div>

              {/* VAS 4: Nhân Công Bốc Xếp */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Nhân Công Bốc Xếp 2 Đầu</span>
                  <button
                    type="button"
                    onClick={() => setTruckingLabor(truckingLabor === 0 ? 350000 : 0)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      truckingLabor === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {truckingLabor === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={truckingLabor}
                    onChange={(e) => setTruckingLabor(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg pr-10 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">VND</span>
                </div>
              </div>

              {/* VAS 5: Xe Bửng Nâng */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Xe Bửng Nâng Thủy Lực</span>
                  <button
                    type="button"
                    onClick={() => setTruckingTailLift(truckingTailLift === 0 ? 200000 : 0)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      truckingTailLift === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {truckingTailLift === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={truckingTailLift}
                    onChange={(e) => setTruckingTailLift(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg pr-10 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">VND</span>
                </div>
              </div>

              {/* VAS 6: Giao Đa Điểm */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Phụ Phí Giao Đa Điểm</span>
                  <button
                    type="button"
                    onClick={() => setTruckingMultiDrop(truckingMultiDrop === 0 ? 300000 : 0)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      truckingMultiDrop === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {truckingMultiDrop === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={truckingMultiDrop}
                    onChange={(e) => setTruckingMultiDrop(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg pr-10 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">VND</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: YÊU CẦU VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              3. Cam Kết Vận Hành & Điều Khoản Thương Mại
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Thời Gian Vận Chuyển Cam Kết</span>
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
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
                  <span>Báo Giá Có Hiệu Lực Đến Ngày</span>
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi Chú Năng Lực Phương Tiện & Lời Nhắn Cho Chủ Hàng
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú năng lực xe, chuẩn Euro 5, bảo hiểm hàng hóa, quy trình xử lý..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* SECTION 4: TỔNG BÁO GIÁ TRỌN GÓI TỰ ĐỘNG TÍNH (CLEAN, NO AUTO-COMPARISON BADGES) */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-emerald-700/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider block">
                  Tổng Báo Giá Trọn Gói Tự Động Tính (All-in Total Price)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight flex items-baseline gap-2">
                  <span>{calculatedTotal.toLocaleString('vi-VN')}</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-300">{currency}</span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-1 font-medium">
                  {otherNote}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <span className="px-3 py-1 bg-emerald-800/90 border border-emerald-500/50 rounded-xl text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 shadow-2xs">
                  {presetPricingType === 'CONTRACT' ? 'Định kỳ Hợp đồng' : 'Theo chuyến / Lô'}
                </span>
                {presetVolumeDisplay && (
                  <span className="text-[11px] text-emerald-300/80 font-medium">
                    Sản lượng: {presetVolumeDisplay}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Phát Hành Báo Giá Chính Thức (Submit Quotation)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
