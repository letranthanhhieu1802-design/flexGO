import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  Ship, 
  Plane, 
  Building2, 
  FileText, 
  ThermometerSnowflake, 
  Globe, 
  DollarSign, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Info,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  Tag
} from 'lucide-react';
import { 
  CustomerRateItem, 
  ServiceType, 
  RateSurchargeItem, 
  RateStatus, 
  RatePricingUnit,
  TruckingInquirySpecs,
  OceanInquirySpecs,
  AirInquirySpecs,
  ColdChainInquirySpecs,
  WarehousingInquirySpecs,
  CustomsInquirySpecs,
  CrossBorderInquirySpecs,
  SupplierCompany
} from '../../types';

import { TruckingInquiryForm } from './inquiryForms/TruckingInquiryForm';
import { OceanInquiryForm } from './inquiryForms/OceanInquiryForm';
import { AirInquiryForm } from './inquiryForms/AirInquiryForm';
import { ColdChainInquiryForm } from './inquiryForms/ColdChainInquiryForm';
import { WarehousingInquiryForm } from './inquiryForms/WarehousingInquiryForm';
import { CustomsInquiryForm } from './inquiryForms/CustomsInquiryForm';
import { CrossBorderInquiryForm } from './inquiryForms/CrossBorderInquiryForm';

interface CreateOrEditRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRate: (rate: CustomerRateItem) => void;
  editingRate?: CustomerRateItem | null;
  suppliers?: SupplierCompany[];
  prefilledFromInquiry?: any;
}

const SERVICE_OPTIONS: { type: ServiceType; label: string; icon: any; color: string; defaultUnit: RatePricingUnit }[] = [
  { type: 'Trucking', label: 'Vận tải Nội địa (Trucking)', icon: Truck, color: 'text-blue-600 bg-blue-50 border-blue-200', defaultUnit: 'VND / Chuyến' },
  { type: 'Sea Freight (FCL)', label: 'Cước Biển FCL (Nguyên Cont)', icon: Ship, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', defaultUnit: 'USD / Cont 40ft' },
  { type: 'Sea Freight (LCL)', label: 'Cước Biển LCL (Hàng Lẻ)', icon: Ship, color: 'text-teal-600 bg-teal-50 border-teal-200', defaultUnit: 'USD / CBM' },
  { type: 'Air Freight', label: 'Vận tải Hàng không (Air)', icon: Plane, color: 'text-sky-600 bg-sky-50 border-sky-200', defaultUnit: 'VND / Kg' },
  { type: 'Cold Chain', label: 'Vận tải Lạnh (Cold Chain)', icon: ThermometerSnowflake, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', defaultUnit: 'VND / Chuyến' },
  { type: 'Warehousing', label: 'Lưu kho & Bãi (Warehouse)', icon: Building2, color: 'text-amber-600 bg-amber-50 border-amber-200', defaultUnit: 'VND / m² / Tháng' },
  { type: 'Customs Clearance', label: 'Thủ tục Hải quan (Customs)', icon: FileText, color: 'text-purple-600 bg-purple-50 border-purple-200', defaultUnit: 'VND / Tờ khai' },
  { type: 'Cross-border', label: 'Vận tải Xuyên biên giới', icon: Globe, color: 'text-orange-600 bg-orange-50 border-orange-200', defaultUnit: 'VND / Chuyến' },
];

const PRICING_UNITS: RatePricingUnit[] = [
  'VND / Chuyến',
  'VND / Tấn',
  'VND / Kg',
  'VND / CBM',
  'USD / Cont 20ft',
  'USD / Cont 40ft',
  'VND / Cont 20ft',
  'VND / Cont 40ft',
  'VND / m² / Tháng',
  'VND / Pallet / Ngày',
  'VND / Tờ khai',
  'VND / Kiện',
];

export const CreateOrEditRateModal: React.FC<CreateOrEditRateModalProps> = ({
  isOpen,
  onClose,
  onSaveRate,
  editingRate,
  suppliers = [],
  prefilledFromInquiry,
}) => {
  if (!isOpen) return null;

  const isEditMode = Boolean(editingRate);

  // General state
  const [serviceType, setServiceType] = useState<ServiceType>(editingRate?.serviceType || 'Trucking');
  const [title, setTitle] = useState(editingRate?.title || '');
  const [origin, setOrigin] = useState(editingRate?.origin || 'KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú, TP.HCM');
  const [destination, setDestination] = useState(editingRate?.destination || 'KCN Thăng Long I, Huyện Đông Anh, Hà Nội');
  const [cargoType, setCargoType] = useState(editingRate?.cargoType || 'Thiết bị điện tử & Máy móc công nghiệp');
  const [equipmentOrVehicleType, setEquipmentOrVehicleType] = useState(editingRate?.equipmentOrVehicleType || 'Xe tải thùng kín 15T Heavy');
  const [loadType, setLoadType] = useState(editingRate?.loadType || 'FTL (Nguyên chuyến)');

  // Rate & Surcharge state
  const [baseRateAmount, setBaseRateAmount] = useState<number>(editingRate?.baseRateAmount || 25000000);
  const [baseRateCurrency, setBaseRateCurrency] = useState<'VND' | 'USD'>(editingRate?.baseRateCurrency || 'VND');
  const [pricingUnit, setPricingUnit] = useState<string>(editingRate?.pricingUnit || 'VND / Chuyến');
  const [allInclusive, setAllInclusive] = useState<boolean>(editingRate?.allInclusive ?? true);
  const [vatPercent, setVatPercent] = useState<number>(editingRate?.vatPercent ?? 8);
  const [surcharges, setSurcharges] = useState<RateSurchargeItem[]>(
    editingRate?.surcharges || [
      { id: 'sc-1', name: 'Phí cầu đường BOT / Phí bến bãi', amount: 0, currency: 'VND', unit: 'Chuyến', includedInBaseRate: true, isMandatory: true },
      { id: 'sc-2', name: 'Phí bốc xếp nâng hạ 2 đầu kho', amount: 1000000, currency: 'VND', unit: 'Chuyến', includedInBaseRate: false, isMandatory: false },
    ]
  );

  // Supplier & Contract state
  const [supplierName, setSupplierName] = useState(editingRate?.supplierName || 'VinaTrans Logistics JSC');
  const [supplierTaxId, setSupplierTaxId] = useState(editingRate?.supplierTaxId || '0301428591');
  const [supplierContact, setSupplierContact] = useState(editingRate?.supplierContact || 'Trần Văn Minh (GĐ Vận tải)');
  const [supplierPhone, setSupplierPhone] = useState(editingRate?.supplierPhone || '0908 123 456');
  const [supplierEmail, setSupplierEmail] = useState(editingRate?.supplierEmail || 'minh.tran@vinatrans.com.vn');
  const [contractCode, setContractCode] = useState(editingRate?.contractCode || 'HD-2026/VTR-01');
  const [paymentTerms, setPaymentTerms] = useState(editingRate?.paymentTerms || 'Net 30 ngày kể từ khi nhận đủ POD');
  const [transitTime, setTransitTime] = useState(editingRate?.transitTime || '48 - 52 giờ');
  const [validFrom, setValidFrom] = useState(editingRate?.validFrom || '2026-01-01');
  const [validTo, setValidTo] = useState(editingRate?.validTo || '2026-12-31');
  const [status, setStatus] = useState<RateStatus>(editingRate?.status || 'Active');
  const [notes, setNotes] = useState(editingRate?.notes || 'Cam kết xe chuẩn Euro 5, tài xế có đầy đủ chứng chỉ an toàn.');

  // Specialized Sub-forms state (100% synchronized with Customer Inquiries)
  const [truckingSpecs, setTruckingSpecs] = useState<TruckingInquirySpecs>(
    editingRate?.truckingSpecs || {
      truckType: 'Box Truck',
      tonnageCategory: '15T Heavy',
      loadType: 'FTL (Nguyên chuyến)',
      multiDropPoints: 1,
      loadingLaborRequired: true,
      unloadingLaborRequired: true,
      tailLiftRequired: false,
      craneAssistanceRequired: false,
      prohibitedHoursPassNeeded: true,
      palletQuantity: 16,
      routeDistanceKm: 1720,
      selectedVAS: ['Bảo hiểm hàng hóa 100%', 'Theo dõi GPS hành trình trực tuyến'],
    }
  );

  const [oceanSpecs, setOceanSpecs] = useState<OceanInquirySpecs>(
    editingRate?.oceanSpecs || {
      mode: 'FCL (Full Container)',
      containerType: '40ft High Cube (40HC)',
      containerCount: 2,
      cbmVolume: 76,
      grossWeightKgs: 24000,
      polPort: 'Cảng Cát Lái (VNCLI), TP.HCM',
      podPort: 'Port of Hamburg (DEHAM), Germany',
      incoterm: 'FOB',
      commodityCategory: 'Electronics & High-Tech',
      freeDemDetDaysRequested: 14,
      packageType: 'Palletized',
      selectedVAS: ['Hun trùng theo tiêu chuẩn ISPM 15', 'Kẹp chì điện tử GPS Tracker'],
    }
  );

  const [airSpecs, setAirSpecs] = useState<AirInquirySpecs>(
    editingRate?.airSpecs || {
      serviceLevel: 'Standard Air Freight (3-4 days)',
      originAirport: 'SGN (Sân bay Quốc tế Tân Sơn Nhất, TP.HCM)',
      destinationAirport: 'NRT (Sân bay Narita Tokyo, Nhật Bản)',
      packageCount: 12,
      grossWeightKgs: 350,
      volumetricWeightKgs: 380,
      chargeableWeightKgs: 380,
      dimensionsCm: '60x40x50 cm x 12 kiện',
      isDangerousGoods: false,
      isTemperatureSensitive: false,
      customsAtAirport: true,
      selectedVAS: ['Khai báo hải quan kho TCS', 'Dán tem hàng giá trị cao Vulnerable Cargo'],
    }
  );

  const [coldChainSpecs, setColdChainSpecs] = useState<ColdChainInquirySpecs>(
    editingRate?.coldChainSpecs || {
      temperatureCategory: 'Chilled (0°C to +4°C: Thịt tươi, Sữa)',
      vehicleOrContType: 'Xe tải lạnh 8T-15T',
      preCoolingRequested: true,
      realtimeGpsTempLogging: true,
      humidityControlPercent: '90%',
      backupGensetIncluded: true,
      isPharmaCertifiedGDP: false,
      selectedVAS: ['Datalogger ghi nhiệt độ tự động USB/Cloud'],
    }
  );

  const [warehousingSpecs, setWarehousingSpecs] = useState<WarehousingInquirySpecs>(
    editingRate?.warehousingSpecs || {
      warehouseType: 'Kho thường (Grade A Dry)',
      storageAreaSqm: 1200,
      palletPositions: 750,
      rentalDurationMonths: 12,
      dailyInboundVolume: '2-3 Cont 40ft/tuần',
      dailyOutboundVolume: '150 Đơn hàng/ngày',
      requiredVAS: ['Dán nhãn phụ tiếng Việt', 'Đóng gói Kitting', 'Kiểm đếm Barcode', 'Tích hợp API WMS thời gian thực'],
      wmsIntegrationNeeded: true,
      selectedVAS: ['PCCC tự động Sprinkler đạt chuẩn', 'Bảo hiểm cháy nổ kho bãi'],
    }
  );

  const [customsSpecs, setCustomsSpecs] = useState<CustomsInquirySpecs>(
    editingRate?.customsSpecs || {
      declarationType: 'Nhập khẩu kinh doanh (A11)',
      customsSubDepartment: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
      hsCodePrimary: '8471.30.20',
      itemDescription: 'Máy tính xách tay & Màn hình hiển thị',
      invoiceValueUSD: 85000,
      coFormRequested: 'Form E (ASEAN-China)',
      specializedInspectionType: 'Không có',
      redChannelInspectionSupport: true,
      selectedVAS: ['Truyền tờ khai điện tử VNACCS/VCIS'],
    }
  );

  const [crossBorderSpecs, setCrossBorderSpecs] = useState<CrossBorderInquirySpecs>(
    editingRate?.crossBorderSpecs || {
      borderGate: 'Hữu Nghị / Tân Thanh (VN ↔ Trung Quốc)',
      originCity: 'Bắc Ninh, Việt Nam',
      destinationCity: 'Bằng Tường (Pingxiang), Quảng Tây, Trung Quốc',
      cargoMode: 'Xe liên vận chạy thẳng (Direct GMS)',
      vehicleType: 'Đầu Kéo Container Kín (Dry Box Container)',
      tonnageCategory: 'Container 40ft High Cube (40HC) — [Tải 28 - 30 Tấn / 76 CBM]',
      vehicleCount: 2,
      customsAtBorderIncluded: true,
      transitPermitGMSNeeded: true,
      selectedVAS: ['Khai báo hải quan 2 đầu VN - TQ', 'GPS giám sát xe qua biên giới'],
    }
  );

  // Tab switcher in Modal: 1: Thông tin Dịch vụ & Tuyến | 2: Thông số Kỹ thuật Chi tiết | 3: Đơn giá & Phụ phí | 4: Nhà xe & Hợp đồng
  const [activeStep, setActiveStep] = useState<number>(1);

  // Surcharges helpers
  const handleAddSurcharge = () => {
    setSurcharges((prev) => [
      ...prev,
      {
        id: `sc-custom-${Date.now()}`,
        name: 'Phụ phí mới',
        amount: 500000,
        currency: baseRateCurrency,
        unit: 'Chuyến',
        includedInBaseRate: false,
        isMandatory: false,
      },
    ]);
  };

  const handleUpdateSurcharge = (id: string, field: keyof RateSurchargeItem, value: any) => {
    setSurcharges((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveSurcharge = (id: string) => {
    setSurcharges((prev) => prev.filter((item) => item.id !== id));
  };

  // Quick select existing supplier
  const handleSelectExistingSupplier = (supName: string) => {
    setSupplierName(supName);
    const found = suppliers.find((s) => s.name === supName);
    if (found) {
      if (found.taxId) setSupplierTaxId(found.taxId);
      if (found.email) setSupplierEmail(found.email);
      if (found.phone) setSupplierPhone(found.phone);
    }
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedRateDisplay =
      baseRateCurrency === 'USD'
        ? `$${baseRateAmount.toLocaleString('en-US')} / ${pricingUnit.replace('USD / ', '').replace('VND / ', '')}`
        : `${baseRateAmount.toLocaleString('vi-VN')} ₫ / ${pricingUnit.replace('VND / ', '')}`;

    const newRateItem: CustomerRateItem = {
      id: editingRate?.id || `rate-cust-${Date.now()}`,
      code: editingRate?.code || `RATE-${serviceType.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      serviceType,
      title: title || `Biểu giá ${serviceType}: ${origin.split(',')[0]} → ${destination.split(',')[0]}`,
      origin,
      destination,
      routeDisplay: `${origin.split(',')[0]} → ${destination.split(',')[0]}`,
      cargoType,
      equipmentOrVehicleType,
      loadType,
      baseRateAmount,
      baseRateCurrency,
      pricingUnit,
      rateDisplay: formattedRateDisplay,
      allInclusive,
      vatPercent,
      surcharges,
      truckingSpecs: serviceType === 'Trucking' ? truckingSpecs : undefined,
      oceanSpecs: serviceType.includes('Sea') ? oceanSpecs : undefined,
      airSpecs: serviceType === 'Air Freight' ? airSpecs : undefined,
      coldChainSpecs: serviceType === 'Cold Chain' ? coldChainSpecs : undefined,
      warehousingSpecs: serviceType === 'Warehousing' ? warehousingSpecs : undefined,
      customsSpecs: serviceType === 'Customs Clearance' ? customsSpecs : undefined,
      crossBorderSpecs: serviceType === 'Cross-border' ? crossBorderSpecs : undefined,
      supplierName,
      supplierTaxId,
      supplierContact,
      supplierPhone,
      supplierEmail,
      contractCode,
      sourceType: editingRate?.sourceType || 'MANUAL_ENTRY',
      linkedInquiryCode: editingRate?.linkedInquiryCode,
      paymentTerms,
      transitTime,
      validFrom,
      validTo,
      status,
      notes,
      createdDate: editingRate?.createdDate || '2026-08-24',
      updatedDate: '2026-08-24',
      documentCount: editingRate?.documentCount || 1,
    };

    onSaveRate(newRateItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  {isEditMode ? `Chỉnh Sửa Biểu Giá: ${editingRate?.code}` : 'Khai Báo Biểu Giá Dịch Vụ Mới'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 text-indigo-700 rounded-full">
                  Customer Rate Master
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý biểu giá chuẩn của doanh nghiệp, đồng bộ thông số kỹ thuật với hệ thống Inquiry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeStep === 1
                ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${activeStep === 1 ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>1</span>
            <span>Dịch Vụ & Tuyến Đường</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeStep === 2
                ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${activeStep === 2 ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>2</span>
            <span>Thông Số Kỹ Thuật (SLA/Specs)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeStep === 3
                ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${activeStep === 3 ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>3</span>
            <span>Đơn Giá & Bóc Tách Phụ Phí</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeStep === 4
                ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${activeStep === 4 ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>4</span>
            <span>Nhà Vận Tải & Hợp Đồng</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* ==================================================== */}
          {/* STEP 1: DỊCH VỤ & TUYẾN ĐƯỜNG */}
          {/* ==================================================== */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  1. Lựa Chọn Phương Thức Vận Tải / Dịch Vụ Logistics <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SERVICE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = serviceType === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => {
                          setServiceType(opt.type);
                          setPricingUnit(opt.defaultUnit);
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? `${opt.color} ring-2 ring-indigo-500 font-bold shadow-xs`
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-xs leading-snug">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Route Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Định Danh Biểu Giá (Tiêu Đề Quản Lý) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Tuyến Bắc Nam FTL: KCN Tân Bình (HCM) → KCN Thăng Long (HN)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điểm Đi / Kho Đi / Cảng Đi (Origin) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="VD: KCN Tân Bình, TP.HCM hoặc Cảng Cát Lái (VNCLI)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điểm Đến / Kho Nhận / Cảng Đến (Destination) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="VD: KCN Thăng Long, Hà Nội hoặc Port of Hamburg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loại Hàng Hóa & Quy Cách Đóng Gói
                  </label>
                  <input
                    type="text"
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    placeholder="VD: Linh kiện điện tử, Máy móc đóng kiện gỗ, Rau củ quả..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phương Tiện / Loại Thiết Bị Chỉ Định
                  </label>
                  <input
                    type="text"
                    value={equipmentOrVehicleType}
                    onChange={(e) => setEquipmentOrVehicleType(e.target.value)}
                    placeholder="VD: Xe tải 15T thùng kín, Cont 40HC, Kho mát..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: THÔNG SỐ KỸ THUẬT (ĐỒNG BỘ 100% VỚI INQUIRY) */}
          {/* ==================================================== */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Các trường thông số kỹ thuật dưới đây tương ứng chính xác với biểu mẫu đăng Inquiry/Lead để dễ dàng đối chiếu benchmark khi phát hành báo giá.
                </span>
              </div>

              {serviceType === 'Trucking' && (
                <TruckingInquiryForm
                  specs={truckingSpecs}
                  onChange={setTruckingSpecs}
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                />
              )}

              {(serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') && (
                <OceanInquiryForm
                  specs={oceanSpecs}
                  onChange={setOceanSpecs}
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                />
              )}

              {serviceType === 'Air Freight' && (
                <AirInquiryForm
                  specs={airSpecs}
                  onChange={setAirSpecs}
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                />
              )}

              {serviceType === 'Cold Chain' && (
                <ColdChainInquiryForm
                  specs={coldChainSpecs}
                  onChange={setColdChainSpecs}
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                />
              )}

              {serviceType === 'Warehousing' && (
                <WarehousingInquiryForm
                  specs={warehousingSpecs}
                  onChange={setWarehousingSpecs}
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                />
              )}

              {serviceType === 'Customs Clearance' && (
                <CustomsInquiryForm
                  specs={customsSpecs}
                  onChange={setCustomsSpecs}
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                />
              )}

              {serviceType === 'Cross-border' && (
                <CrossBorderInquiryForm
                  specs={crossBorderSpecs}
                  onChange={setCrossBorderSpecs}
                  origin={origin}
                  setOrigin={setOrigin}
                  destination={destination}
                  setDestination={setDestination}
                />
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: ĐƠN GIÁ & BÓC TÁCH PHỤ PHÍ */}
          {/* ==================================================== */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Base Rate & Currency */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-bold text-slate-900">Cước Phí Cơ Sở (Base Freight Rate)</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBaseRateCurrency('VND')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        baseRateCurrency === 'VND'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      VND (₫)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBaseRateCurrency('USD')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        baseRateCurrency === 'USD'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mức Cước Cơ Sở <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={baseRateAmount}
                      onChange={(e) => setBaseRateAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 font-bold text-sm text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Đơn Vị Tính Cước (Pricing Unit)
                    </label>
                    <select
                      value={pricingUnit}
                      onChange={(e) => setPricingUnit(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs font-medium text-slate-900 bg-white"
                    >
                      {PRICING_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Thuế Suất VAT (%)
                    </label>
                    <select
                      value={vatPercent}
                      onChange={(e) => setVatPercent(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs font-medium text-slate-900 bg-white"
                    >
                      <option value={0}>0% (Miễn thuế / Xuất khẩu)</option>
                      <option value={8}>8% (Nghị định giảm thuế VAT)</option>
                      <option value={10}>10% (Thuế suất chuẩn)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="allInclusiveCheck"
                    checked={allInclusive}
                    onChange={(e) => setAllInclusive(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="allInclusiveCheck" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Trọn gói All-in (Đã bao gồm tất cả chi phí cầu đường, nhiên liệu BAF và bốc xếp thông thường)
                  </label>
                </div>
              </div>

              {/* Surcharges List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Bóc Tách Phụ Phí & Chi Phí Phát Sinh</h4>
                    <p className="text-xs text-slate-500">Khai báo các khoản phụ phí định mức hoặc chi phí tính ngoài</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSurcharge}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Phụ Phí</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {surcharges.map((sc) => (
                    <div
                      key={sc.id}
                      className="p-3 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={sc.name}
                          onChange={(e) => handleUpdateSurcharge(sc.id, 'name', e.target.value)}
                          placeholder="Tên phụ phí (VD: Phí THC, BAF, Cầu đường...)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-800"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={sc.amount}
                            onChange={(e) => handleUpdateSurcharge(sc.id, 'amount', Number(e.target.value))}
                            placeholder="Số tiền"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800"
                          />
                          <span className="text-[11px] font-bold text-slate-500 shrink-0">{sc.currency}</span>
                        </div>
                        <input
                          type="text"
                          value={sc.unit}
                          onChange={(e) => handleUpdateSurcharge(sc.id, 'unit', e.target.value)}
                          placeholder="Đơn vị tính (Chuyến / Cont / m²)"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700"
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sc.includedInBaseRate}
                            onChange={(e) => handleUpdateSurcharge(sc.id, 'includedInBaseRate', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>Đã gồm trong cước</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveSurcharge(sc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: NHÀ XE, HỢP ĐỒNG & HIỆU LỰC */}
          {/* ==================================================== */}
          {activeStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Supplier selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đơn Vị Cung Cấp Dịch Vụ (Supplier) <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      placeholder="VD: VinaTrans Logistics JSC"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs font-bold text-slate-900"
                      required
                    />
                    {suppliers.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Chọn nhanh:</span>
                        {suppliers.slice(0, 3).map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSelectExistingSupplier(s.name)}
                            className="text-[10.5px] px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors cursor-pointer"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã Số Thuế Nhà Vận Tải (Tax ID)
                  </label>
                  <input
                    type="text"
                    value={supplierTaxId}
                    onChange={(e) => setSupplierTaxId(e.target.value)}
                    placeholder="VD: 0301428591"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đầu Mối Liên Hệ & Số Điện Thoại
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={supplierContact}
                      onChange={(e) => setSupplierContact(e.target.value)}
                      placeholder="Tên người phụ trách"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      value={supplierPhone}
                      onChange={(e) => setSupplierPhone(e.target.value)}
                      placeholder="Số điện thoại"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã Hợp Đồng / Phụ Lục Biểu Giá (Contract Code)
                  </label>
                  <input
                    type="text"
                    value={contractCode}
                    onChange={(e) => setContractCode(e.target.value)}
                    placeholder="VD: HD-2026/VTR-ABC01"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời Gian Vận Chuyển Cam Kết (Transit Time SLA)
                  </label>
                  <input
                    type="text"
                    value={transitTime}
                    onChange={(e) => setTransitTime(e.target.value)}
                    placeholder="VD: 48 giờ (Bắc Nam), 28 ngày (Châu Âu)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điều Khoản Công Nợ & Thanh Toán (Payment Terms)
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="VD: Net 30 ngày kể từ ngày nhận đủ POD gốc"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày Bắt Đầu Áp Dụng (Valid From)
                  </label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày Hết Hạn Hiệu Lực (Valid To) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trạng Thái Biểu Giá
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RateStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="Active">Đang Áp Dụng (Active)</option>
                    <option value="ExpiringSoon">Sắp Hết Hạn (Expiring Soon)</option>
                    <option value="Expired">Đã Hết Hiệu Lực (Expired)</option>
                    <option value="Draft">Bản Nháp (Draft)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi Chú Đặc Thù Vận Hành & Cam Kết Dịch Vụ
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú điều kiện phát sinh, thời gian cắm điện cont lạnh, cam kết bồi thường..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ← Bước Trước
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Tiếp Tục →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditMode ? 'Lưu Cập Nhật Biểu Giá' : 'Hoàn Tất Khai Báo Biểu Giá'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
