import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Calculator, 
  Send,
  Sparkles,
  FileText
} from 'lucide-react';
import { QuotationItem, ServiceType, ServiceCostBreakdown, PricingType, SupplierLeadItem } from '../../types';
import { LeadInquiryDetailCard } from '../public/LeadInquiryDetailCard';

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quote: Partial<QuotationItem>) => void;
  lead?: SupplierLeadItem | null;
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
  lead,
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
  const [activeTab, setActiveTab] = useState<'FORM' | 'INQUIRY'>('FORM');
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

  // 1. Trucking Breakdown
  const [truckingBase, setTruckingBase] = useState<number>(5950000);
  const [truckingBAF, setTruckingBAF] = useState<number>(580000);
  const [truckingBOT, setTruckingBOT] = useState<number>(290000);
  const [truckingDocManagement, setTruckingDocManagement] = useState<number>(150000);
  const [isReturnTruck, setIsReturnTruck] = useState<boolean>(false);
  const [truckingMultiDrop, setTruckingMultiDrop] = useState<number>(0);
  const [truckingLabor, setTruckingLabor] = useState<number>(0);
  const [truckingTailLift, setTruckingTailLift] = useState<number>(0);
  const [truckingGpsFee, setTruckingGpsFee] = useState<number>(0);
  const [truckingSealFee, setTruckingSealFee] = useState<number>(0);
  const [truckingPodFee, setTruckingPodFee] = useState<number>(0);

  // 2. Ocean Breakdown
  const [oceanOF, setOceanOF] = useState<number>(2800); // USD
  const [oceanExRate, setOceanExRate] = useState<number>(25400);
  const [oceanThcPol, setOceanThcPol] = useState<number>(3200000);
  const [oceanThcPod, setOceanThcPod] = useState<number>(4500000);
  const [oceanDocFee, setOceanDocFee] = useState<number>(1200000);
  const [oceanLSS, setOceanLSS] = useState<number>(800000);
  const [oceanFreeDemDet, setOceanFreeDemDet] = useState<number>(14);

  // 3. Air Breakdown
  const [airRatePerKg, setAirRatePerKg] = useState<number>(5.8); // USD/Kg
  const [airChargeableWeight, setAirChargeableWeight] = useState<number>(200);
  const [airFSC, setAirFSC] = useState<number>(180); // USD
  const [airSSC, setAirSSC] = useState<number>(90); // USD
  const [airAwbFee, setAirAwbFee] = useState<number>(850000);
  const [airTerminalFee, setAirTerminalFee] = useState<number>(1100000);

  // 4. Cold Chain Breakdown
  const [coldBaseFreight, setColdBaseFreight] = useState<number>(15500000);
  const [coldGensetFuel, setColdGensetFuel] = useState<number>(1800000);
  const [coldDataLogger, setColdDataLogger] = useState<number>(0);
  const [coldDepotPlug, setColdDepotPlug] = useState<number>(0);

  // 5. Warehousing Breakdown
  const [whMonthlyRate, setWhMonthlyRate] = useState<number>(135000000);
  const [whHandlingInOut, setWhHandlingInOut] = useState<number>(18000000);
  const [whPalletMgmt, setWhPalletMgmt] = useState<number>(8500000);
  const [whVASPackaging, setWhVASPackaging] = useState<number>(0);
  const [whWmsSystemFee, setWhWmsSystemFee] = useState<number>(0);

  // 6. Customs Clearance Breakdown
  const [customsBaseDec, setCustomsBaseDec] = useState<number>(1800000);
  const [customsAddLines, setCustomsAddLines] = useState<number>(400000);
  const [customsCoFee, setCustomsCoFee] = useState<number>(1200000);
  const [customsInspectionFee, setCustomsInspectionFee] = useState<number>(0);
  const [customsRedChannel, setCustomsRedChannel] = useState<number>(0);

  // 7. Cross-border Breakdown
  const [crossVnLeg, setCrossVnLeg] = useState<number>(18000000);
  const [crossIntlLeg, setCrossIntlLeg] = useState<number>(24000000);
  const [crossTransshipment, setCrossTransshipment] = useState<number>(3500000);
  const [crossClearance, setCrossClearance] = useState<number>(2500000);
  const [crossGmsPermit, setCrossGmsPermit] = useState<number>(0);

  // 8. Project Cargo Breakdown
  const [projectBase, setProjectBase] = useState<number>(42000000);
  const [projectHeavyPermit, setProjectHeavyPermit] = useState<number>(6500000);
  const [projectEscortSurvey, setProjectEscortSurvey] = useState<number>(4500000);
  const [projectCraneLifting, setProjectCraneLifting] = useState<number>(5500000);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('FORM');
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

  // Reconstruct fallback lead object for Tab 2
  const leadToDisplay: SupplierLeadItem = lead || {
    id: `lead-preset-${presetInquiryCode}`,
    code: presetInquiryCode,
    customerCompany: presetCustomerCompany,
    contactName: 'Lê Trần Thanh Hiếu',
    contactRole: 'Procurement Specialist',
    contactPhone: '0908 123 456',
    contactEmail: 'procurement@shipper-logistics.vn',
    taxId: '0314892831',
    serviceType: presetServiceType,
    origin: presetRoute.split('→')[0]?.trim() || 'Hồ Chí Minh',
    destination: presetRoute.split('→')[1]?.trim() || 'Hà Nội',
    route: presetRoute,
    pricingType: presetPricingType,
    contractTerm: presetPricingType === 'CONTRACT' ? 'Hợp đồng 12 tháng' : 'Theo lô / Chuyến lẻ',
    volumeDisplay: presetVolumeDisplay || '15 Tấn (52 CBM)',
    unitPriceVND: presetTargetUnitPrice || 5950000,
    unitPriceDisplay: presetTargetUnitDisplay || '5.950.000 ₫',
    estimatedValueVND: presetEstimatedValue || 18500000,
    estimatedValueDisplay: presetEstimatedValueDisplay || '18.500.000 ₫',
    createdDate: 'Aug 31, 2026',
    dueDate: 'Sep 15, 2026',
    status: 'Open',
    cargoDetails: 'Linh kiện thiết bị công nghiệp & Phụ tùng máy móc',
    cargoClassification: 'General',
    packaging: 'Pallet gỗ tiêu chuẩn (1.2m x 1.0m)',
    urgency: 'Standard',
    matchScore: 96,
    quotesCount: 3,
    viewsCount: 142,
    isUnlocked: false,
    isSaved: false,
  };

  // Calculate Unit Freight Subtotal & Grand Total based on Service Type
  let unitFreightSubtotal = 0;
  let vasSubtotal = 0;
  let calculatedTotal = 0;
  let baseFreightVal = 0;
  let fuelSurchargeVal = 0;
  let handlingFeeVal = 0;
  let docFeeVal = 0;
  let otherFeeVal = 0;
  let otherNote = '';

  if (presetServiceType === 'Trucking') {
    unitFreightSubtotal = truckingBase + truckingBAF + truckingBOT + truckingDocManagement;
    vasSubtotal = truckingLabor + truckingTailLift + truckingGpsFee + truckingSealFee + truckingPodFee + truckingMultiDrop;
    calculatedTotal = unitFreightSubtotal + vasSubtotal;
    baseFreightVal = truckingBase;
    fuelSurchargeVal = truckingBAF;
    handlingFeeVal = truckingLabor + truckingTailLift;
    docFeeVal = truckingDocManagement + truckingPodFee;
    otherFeeVal = truckingBOT + truckingMultiDrop + truckingGpsFee + truckingSealFee;
    otherNote = 'Bao gồm cước chính, BAF, vé cầu đường BOT, chứng từ & các tiện ích VAS kèm theo';
  } else if (presetServiceType === 'Sea Freight (FCL)' || presetServiceType === 'Sea Freight (LCL)') {
    if (currency === 'USD') {
      unitFreightSubtotal = oceanOF + Math.round((oceanThcPol + oceanThcPod + oceanDocFee + oceanLSS) / oceanExRate);
      calculatedTotal = unitFreightSubtotal;
      baseFreightVal = oceanOF;
      fuelSurchargeVal = Math.round(oceanLSS / oceanExRate);
      handlingFeeVal = Math.round((oceanThcPol + oceanThcPod) / oceanExRate);
      docFeeVal = Math.round(oceanDocFee / oceanExRate);
      otherNote = `Bao gồm THC 2 đầu, Bill/Seal & ${oceanFreeDemDet} ngày Free Dem/Det`;
    } else {
      unitFreightSubtotal = (oceanOF * oceanExRate) + oceanThcPol + oceanThcPod + oceanDocFee + oceanLSS;
      calculatedTotal = unitFreightSubtotal;
      baseFreightVal = oceanOF * oceanExRate;
      fuelSurchargeVal = oceanLSS;
      handlingFeeVal = oceanThcPol + oceanThcPod;
      docFeeVal = oceanDocFee;
      otherNote = `Bao gồm THC 2 đầu, Bill/Seal & ${oceanFreeDemDet} ngày Free Dem/Det`;
    }
  } else if (presetServiceType === 'Air Freight') {
    const airBaseUSD = airRatePerKg * airChargeableWeight;
    if (currency === 'USD') {
      unitFreightSubtotal = Math.round(airBaseUSD + airFSC + airSSC + (airAwbFee + airTerminalFee) / 25400);
      calculatedTotal = unitFreightSubtotal;
      baseFreightVal = airBaseUSD;
      fuelSurchargeVal = airFSC;
      handlingFeeVal = Math.round(airTerminalFee / 25400);
      docFeeVal = Math.round(airAwbFee / 25400);
      otherFeeVal = airSSC;
      otherNote = 'Phụ phí an ninh SSC & Soi chiếu an ninh sân bay';
    } else {
      unitFreightSubtotal = (airBaseUSD + airFSC + airSSC) * 25400 + airAwbFee + airTerminalFee;
      calculatedTotal = unitFreightSubtotal;
      baseFreightVal = airBaseUSD * 25400;
      fuelSurchargeVal = airFSC * 25400;
      handlingFeeVal = airTerminalFee;
      docFeeVal = airAwbFee;
      otherFeeVal = airSSC * 25400;
      otherNote = 'Phụ phí an ninh SSC & Soi chiếu an ninh sân bay';
    }
  } else if (presetServiceType === 'Cold Chain') {
    unitFreightSubtotal = coldBaseFreight + coldGensetFuel;
    vasSubtotal = coldDataLogger + coldDepotPlug;
    calculatedTotal = unitFreightSubtotal + vasSubtotal;
    baseFreightVal = coldBaseFreight;
    fuelSurchargeVal = coldGensetFuel;
    handlingFeeVal = coldDepotPlug;
    otherFeeVal = coldDataLogger;
    otherNote = 'Cung cấp biểu đồ IoT Logger & máy phát Genset liên tục';
  } else if (presetServiceType === 'Warehousing') {
    unitFreightSubtotal = whMonthlyRate + whHandlingInOut + whPalletMgmt;
    vasSubtotal = whVASPackaging + whWmsSystemFee;
    calculatedTotal = unitFreightSubtotal + vasSubtotal;
    baseFreightVal = whMonthlyRate;
    handlingFeeVal = whHandlingInOut + whPalletMgmt;
    docFeeVal = whWmsSystemFee;
    otherFeeVal = whVASPackaging;
    otherNote = 'Bao gồm dán nhãn VAS, quản lý Pallet & kết nối API WMS';
  } else if (presetServiceType === 'Customs Clearance') {
    unitFreightSubtotal = customsBaseDec + customsAddLines + customsCoFee;
    vasSubtotal = customsInspectionFee + customsRedChannel;
    calculatedTotal = unitFreightSubtotal + vasSubtotal;
    baseFreightVal = customsBaseDec;
    handlingFeeVal = customsRedChannel + customsInspectionFee;
    docFeeVal = customsCoFee + customsAddLines;
    otherNote = 'Trọn gói tờ khai, hỗ trợ luồng đỏ & thủ tục cấp C/O';
  } else if (presetServiceType === 'Cross-border') {
    unitFreightSubtotal = crossVnLeg + crossIntlLeg + crossTransshipment;
    vasSubtotal = crossClearance + crossGmsPermit;
    calculatedTotal = unitFreightSubtotal + vasSubtotal;
    baseFreightVal = crossVnLeg + crossIntlLeg;
    handlingFeeVal = crossTransshipment;
    docFeeVal = crossClearance + crossGmsPermit;
    otherNote = 'Bao gồm sang tải bãi cửa khẩu & thông quan liên vận GMS';
  } else if (presetServiceType === 'Project Cargo') {
    unitFreightSubtotal = projectBase + projectHeavyPermit;
    vasSubtotal = projectEscortSurvey + projectCraneLifting;
    calculatedTotal = unitFreightSubtotal + vasSubtotal;
    baseFreightVal = projectBase;
    handlingFeeVal = projectCraneLifting;
    docFeeVal = projectHeavyPermit;
    otherFeeVal = projectEscortSurvey;
    otherNote = 'Bao gồm giấy phép quá khổ quá tải, xe hộ tống & cẩu hạ bãi';
  } else {
    calculatedTotal = 48000000;
    baseFreightVal = 42000000;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 lg:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="supplier-create-quotation-modal"
        className="w-full max-w-[1440px] xl:max-w-[96vw] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col h-[94vh] max-h-[96vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-emerald-900/50">
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

        {/* TABS SWITCHER: TAB 1 (LẬP BÁO GIÁ) & TAB 2 (CHI TIẾT YÊU CẦU INQUIRY) */}
        <div className="px-4 sm:px-6 pt-2.5 pb-0 bg-slate-100 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="modal-tab-quotation-form-btn"
            onClick={() => setActiveTab('FORM')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-t-2 cursor-pointer ${
              activeTab === 'FORM'
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Lập Báo Giá (Quotation Form)</span>
          </button>

          <button
            type="button"
            id="modal-tab-inquiry-details-btn"
            onClick={() => setActiveTab('INQUIRY')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-t-2 cursor-pointer ${
              activeTab === 'INQUIRY'
                ? 'bg-white text-indigo-800 border-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>2. Chi Tiết Yêu Cầu Lead (Inquiry Info)</span>
          </button>
        </div>

        {/* TAB 1: FORM LẬP BÁO GIÁ (2-COLUMN MATRIX TABLE) */}
        {activeTab === 'FORM' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Inquiry summary header banner */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Tuyến Đường & Hành Trình</span>
                <span className="font-bold text-slate-900 text-sm">{presetRoute}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Dịch Vụ Yêu Cầu</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 inline-block mt-0.5">
                  {presetServiceType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Loại Tiền Tệ</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrency('VND')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currency === 'VND' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    VND
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currency === 'USD' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>

            {/* BACKHAUL TOGGLE BANNER (Dành cho đường bộ) */}
            {presetServiceType === 'Trucking' && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl text-xs border border-indigo-900/50 shadow-2xs">
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
            )}

            {/* 2-COLUMN DYNAMIC ITEM MATRIX TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse" id="quotation-builder-matrix-table">
                {/* Table Header */}
                <thead className="bg-slate-100/90 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-5/12 border-r border-slate-200">
                      Hạng Mục Báo Giá & Yêu Cầu Kỹ Thuật
                    </th>
                    <th className="py-3 px-4 w-7/12">
                      <div className="flex items-center justify-between">
                        <span>Báo Giá Của Bạn (VinaTrans Logistics JSC)</span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 normal-case">
                          Khớp chuẩn Ma trận đối soát
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* ─────────────────────────────────────────────────────────────
                      KHỐI 1: CẤU TRÚC ĐƠN GIÁ CƯỚC & PHỤ PHÍ
                  ───────────────────────────────────────────────────────────── */}
                  <tr className="bg-indigo-50/40 font-bold text-indigo-950 border-t border-b border-indigo-100">
                    <td colSpan={2} className="py-2.5 px-4 text-xs font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                      <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                      <span>1. Cấu Trúc Đơn Giá Cước & Phụ Phí (Đơn vị tính: 1 {presetPricingType === 'CONTRACT' ? 'Tháng / Lô' : 'Chuyến'})</span>
                    </td>
                  </tr>

                  {/* DÒNG TỔNG ĐƠN GIÁ CHÀO THẦU */}
                  <tr className="bg-emerald-50/30">
                    <td className="py-3.5 px-4 border-r border-slate-200 font-bold text-slate-900">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-emerald-950 block">Đơn Giá Chào Thầu Tổng</span>
                        <span className="text-[11px] font-normal text-slate-500 block">Đơn giá trọn gói cước vận chuyển (Tự động cộng dồn)</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-emerald-700 tracking-tight">
                          {unitFreightSubtotal.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {currency} / {presetPricingType === 'CONTRACT' ? 'tháng' : 'chuyến'}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* TRUCKING ITEMS */}
                  {presetServiceType === 'Trucking' && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Cước vận chuyển chính (Base Freight) *
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              value={truckingBase}
                              onChange={(e) => setTruckingBase(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phụ phí nhiên liệu (BAF Fuel Surcharge)
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              value={truckingBAF}
                              onChange={(e) => setTruckingBAF(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-900 pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí vé cầu đường BOT & Bốc xếp hạ tầng
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              value={truckingBOT}
                              onChange={(e) => setTruckingBOT(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-900 pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí chứng từ, seal & quản lý đơn
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              value={truckingDocManagement}
                              onChange={(e) => setTruckingDocManagement(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-900 pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">VND</span>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}

                  {/* SEA FREIGHT ITEMS */}
                  {(presetServiceType === 'Sea Freight (FCL)' || presetServiceType === 'Sea Freight (LCL)') && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Cước biển chính (Ocean Freight OF) *
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              value={oceanOF}
                              onChange={(e) => setOceanOF(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-cyan-950 pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">USD</span>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phụ phí nhiên liệu LSS / BAF xăng dầu (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={oceanLSS}
                            onChange={(e) => setOceanLSS(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí nâng hạ bến bãi 2 đầu (THC POL + POD VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={oceanThcPol + oceanThcPod}
                            onChange={(e) => {
                              const half = Math.round(Number(e.target.value) / 2);
                              setOceanThcPol(half);
                              setOceanThcPod(half);
                            }}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí chứng từ Bill / Seal / VGM (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={oceanDocFee}
                            onChange={(e) => setOceanDocFee(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Số ngày miễn phí lưu bãi / Cont (Free Dem/Det)
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2 max-w-xs">
                            <input
                              type="number"
                              value={oceanFreeDemDet}
                              onChange={(e) => setOceanFreeDemDet(Number(e.target.value))}
                              className="w-24 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-indigo-700 text-center"
                            />
                            <span className="text-xs font-semibold text-slate-500">Ngày</span>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}

                  {/* AIR FREIGHT ITEMS */}
                  {presetServiceType === 'Air Freight' && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Đơn giá cước bay (Rate / Kg USD) *
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              step="0.1"
                              value={airRatePerKg}
                              onChange={(e) => setAirRatePerKg(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-sky-950 pr-16"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-600">USD/Kg</span>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phụ phí nhiên liệu & An ninh bay (FSC + SSC USD)
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2 max-w-xs">
                            <input
                              type="number"
                              value={airFSC + airSSC}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                setAirFSC(Math.round(v * 0.67));
                                setAirSSC(Math.round(v * 0.33));
                              }}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                            />
                            <span className="text-xs font-semibold text-slate-400">USD</span>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí phát hành vận đơn AWB & Soi chiếu sân bay (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={airAwbFee + airTerminalFee}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setAirAwbFee(Math.round(v * 0.44));
                              setAirTerminalFee(Math.round(v * 0.56));
                            }}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>
                    </>
                  )}

                  {/* COLD CHAIN ITEMS */}
                  {presetServiceType === 'Cold Chain' && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Cước vận chuyển xe lạnh cơ sở (VND) *
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={coldBaseFreight}
                            onChange={(e) => setColdBaseFreight(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-emerald-950"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí chạy máy lạnh Genset suốt tuyến (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={coldGensetFuel}
                            onChange={(e) => setColdGensetFuel(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>
                    </>
                  )}

                  {/* WAREHOUSING ITEMS */}
                  {presetServiceType === 'Warehousing' && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Đơn giá thuê diện tích / Thể tích kho tháng (VND) *
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={whMonthlyRate}
                            onChange={(e) => setWhMonthlyRate(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-purple-950"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí bốc xếp nâng hạ Inbound / Outbound (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={whHandlingInOut}
                            onChange={(e) => setWhHandlingInOut(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí quản lý vị trí Pallet (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={whPalletMgmt}
                            onChange={(e) => setWhPalletMgmt(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>
                    </>
                  )}

                  {/* CUSTOMS ITEMS */}
                  {presetServiceType === 'Customs Clearance' && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí khai tờ khai hải quan cơ sở (VND) *
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={customsBaseDec}
                            onChange={(e) => setCustomsBaseDec(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-amber-950"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí dòng hàng bổ sung (Add-on lines VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={customsAddLines}
                            onChange={(e) => setCustomsAddLines(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí thủ tục xin cấp C/O (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={customsCoFee}
                            onChange={(e) => setCustomsCoFee(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>
                    </>
                  )}

                  {/* CROSS-BORDER ITEMS */}
                  {presetServiceType === 'Cross-border' && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Cước vận chuyển chặng nội địa Việt Nam (VND) *
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={crossVnLeg}
                            onChange={(e) => setCrossVnLeg(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-orange-950"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Cước vận chuyển chặng quốc tế (VND) *
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={crossIntlLeg}
                            onChange={(e) => setCrossIntlLeg(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-orange-950"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí sang tải / Đổi đầu kéo bãi cửa khẩu (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={crossTransshipment}
                            onChange={(e) => setCrossTransshipment(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>
                    </>
                  )}

                  {/* PROJECT CARGO ITEMS */}
                  {presetServiceType === 'Project Cargo' && (
                    <>
                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Cước vận chuyển hàng dự án đa phương thức (VND) *
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={projectBase}
                            onChange={(e) => setProjectBase(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-indigo-950"
                          />
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                          • Phí giấy phép lưu hành quá khổ quá tải (VND)
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            value={projectHeavyPermit}
                            onChange={(e) => setProjectHeavyPermit(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </td>
                      </tr>
                    </>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      KHỐI 2: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS)
                  ───────────────────────────────────────────────────────────── */}
                  <tr className="bg-purple-50/40 font-bold text-purple-950 border-t border-b border-purple-100">
                    <td colSpan={2} className="py-2.5 px-4 text-xs font-extrabold flex items-center justify-between uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>2. Biểu Phí Dịch Vụ Giá Trị Gia Tăng (VAS) & Tiện Ích Kèm Theo</span>
                      </div>
                      <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 normal-case">
                        Nhà xe có thể chọn Miễn phí 0đ
                      </span>
                    </td>
                  </tr>

                  {/* VAS 1: GPS Live */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Định vị GPS Real-time & Chia sẻ link tracking live
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          value={truckingGpsFee}
                          onChange={(e) => setTruckingGpsFee(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setTruckingGpsFee(truckingGpsFee === 0 ? 100000 : 0)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                            truckingGpsFee === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {truckingGpsFee === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* VAS 2: Kẹp Chì Seal */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Kẹp chì Seal & Chụp ảnh giao nhận biên bản
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          value={truckingSealFee}
                          onChange={(e) => setTruckingSealFee(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setTruckingSealFee(truckingSealFee === 0 ? 50000 : 0)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                            truckingSealFee === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {truckingSealFee === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* VAS 3: Thu Hồi POD */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Thu hồi chứng từ gốc (POD) gửi về văn phòng
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          value={truckingPodFee}
                          onChange={(e) => setTruckingPodFee(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setTruckingPodFee(truckingPodFee === 0 ? 100000 : 0)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                            truckingPodFee === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {truckingPodFee === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* VAS 4: Nhân Công Bốc Xếp */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Nhân công bốc xếp 2 đầu kho
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          value={truckingLabor}
                          onChange={(e) => setTruckingLabor(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setTruckingLabor(truckingLabor === 0 ? 350000 : 0)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                            truckingLabor === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {truckingLabor === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* VAS 5: Xe Bửng Nâng */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Xe bửng nâng thủy lực hỗ trợ dỡ pallet
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          value={truckingTailLift}
                          onChange={(e) => setTruckingTailLift(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setTruckingTailLift(truckingTailLift === 0 ? 200000 : 0)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                            truckingTailLift === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {truckingTailLift === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* VAS 6: Phụ Phí Giao Đa Điểm */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Phụ phí giao đa điểm (Multi-drop)
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <input
                          type="number"
                          value={truckingMultiDrop}
                          onChange={(e) => setTruckingMultiDrop(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setTruckingMultiDrop(truckingMultiDrop === 0 ? 300000 : 0)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                            truckingMultiDrop === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {truckingMultiDrop === 0 ? '✓ Miễn phí 0đ' : 'Tính phí'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* ─────────────────────────────────────────────────────────────
                      KHỐI 3: CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI
                  ───────────────────────────────────────────────────────────── */}
                  <tr className="bg-amber-50/40 font-bold text-amber-950 border-t border-b border-amber-100">
                    <td colSpan={2} className="py-2.5 px-4 text-xs font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>3. Cam Kết Vận Hành & Điều Khoản Thương Mại</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Thời gian vận chuyển cam kết
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={transitTimeDisplay}
                        onChange={(e) => setTransitTimeDisplay(e.target.value)}
                        placeholder="VD: 2 Ngày (48 Giờ cam kết)"
                        className="w-full max-w-sm px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium"
                      />
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Điều khoản thanh toán (Payment Terms)
                    </td>
                    <td className="py-2 px-4">
                      <select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full max-w-sm px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
                      >
                        <option value="Net 30 Days">Net 30 Days (30 Ngày sau khi nhận POD)</option>
                        <option value="Net 45 Days">Net 45 Days (45 Ngày thanh toán)</option>
                        <option value="Net 60 Days">Net 60 Days (Dành cho Key Account)</option>
                        <option value="COD / Thanh toán khi giao hàng">COD (Thanh toán ngay khi giao nhận)</option>
                      </select>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">
                      • Báo giá có hiệu lực đến ngày
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="w-full max-w-xs px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-medium cursor-pointer"
                      />
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700 align-top">
                      • Ghi chú năng lực & Lời nhắn cho chủ hàng
                    </td>
                    <td className="py-2 px-4">
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ghi chú năng lực xe, chuẩn Euro 5, bảo hiểm hàng hóa, quy trình xử lý..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* GRAND TOTAL SUMMARY BAR */}
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
        ) : (
          /* TAB 2: CHI TIẾT YÊU CẦU LEAD / INQUIRY (GIỐNG HỆT BẢNG MỞ RỘNG TRÊN LEAD BOARD) */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 space-y-4 animate-in fade-in duration-150">
            <LeadInquiryDetailCard
              lead={leadToDisplay}
              isUnlocked={leadToDisplay.isUnlocked}
              isCustomerView={false}
            />
          </div>
        )}

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
