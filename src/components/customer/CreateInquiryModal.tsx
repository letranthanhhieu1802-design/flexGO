import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  Ship, 
  Plane, 
  Train,
  Building2, 
  FileText, 
  Globe, 
  Layers,
  ThermometerSnowflake, 
  Package, 
  Calendar, 
  Clock,
  DollarSign, 
  Sparkles, 
  Users, 
  Send,
  AlertTriangle,
  Paperclip,
  Check,
  Coins,
  ArrowRightLeft,
  Banknote,
  UploadCloud,
  FileSpreadsheet,
  Image as ImageIcon,
  Trash2,
  FileArchive,
  ShieldCheck,
  Scale,
  Box,
  Tag,
  Droplets,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { 
  ServiceType, 
  InquiryItem,
  InquiryAttachment,
  CargoClassification,
  PricingType,
  TruckingInquirySpecs,
  OceanInquirySpecs,
  AirInquirySpecs,
  ColdChainInquirySpecs,
  WarehousingInquirySpecs,
  CustomsInquirySpecs,
  CrossBorderInquirySpecs,
  RailInquirySpecs,
  ProjectInquirySpecs,
  ServiceSpecificSpecs,
  UserProfile,
  QuotationScope
} from '../../types';

import { PricingTypeSection } from './inquiryForms/PricingTypeSection';
import { VASSection, VASItemDef } from './inquiryForms/VASSection';
import { 
  SurchargesSection, 
  OCEAN_SURCHARGES, 
  TRUCKING_SURCHARGES, 
  AIR_SURCHARGES, 
  GENERAL_LOGISTICS_SURCHARGES 
} from './inquiryForms/SurchargesSection';

import { 
  TruckingInquiryForm, 
  TRUCKING_VAS_ITEMS,
  TRUCKING_GENERAL_FTL_VAS,
  TRUCKING_GENERAL_LTL_VAS,
  TRUCKING_REEFER_VAS,
  TRUCKING_HAZMAT_VAS
} from './inquiryForms/TruckingInquiryForm';
import { OceanInquiryForm, OCEAN_VAS_ITEMS } from './inquiryForms/OceanInquiryForm';
import { AirInquiryForm, AIR_VAS_ITEMS } from './inquiryForms/AirInquiryForm';
import { ColdChainInquiryForm, COLD_CHAIN_VAS_ITEMS } from './inquiryForms/ColdChainInquiryForm';
import { WarehousingInquiryForm, getWarehousingVASItems } from './inquiryForms/WarehousingInquiryForm';
import { CustomsInquiryForm, CUSTOMS_VAS_ITEMS } from './inquiryForms/CustomsInquiryForm';
import { CrossBorderInquiryForm, CROSS_BORDER_VAS_ITEMS } from './inquiryForms/CrossBorderInquiryForm';
import { RailInquiryForm, RAIL_VAS_ITEMS } from './inquiryForms/RailInquiryForm';
import { ProjectInquiryForm, PROJECT_VAS_ITEMS } from './inquiryForms/ProjectInquiryForm';
import { InquirySummaryConfirmModal } from './InquirySummaryConfirmModal';
import { generateFlexGOCode } from '../../utils/codeGenerator';

export interface IndustryOption {
  id: string;
  name: string;
  categoryName: string;
  defaultCommodities?: string;
}

export const LOGISTICS_INDUSTRY_LOV: IndustryOption[] = [
  { id: 'fmcg', name: 'Hàng Tiêu Dùng Nhanh & Thực Phẩm (FMCG & Food Processing)', categoryName: 'FMCG & Thực phẩm' },
  { id: 'electronics', name: 'Điện Tử, Viễn Thông & Công Nghệ Cao (High-Tech & Electronics)', categoryName: 'Điện tử & High-Tech' },
  { id: 'textile', name: 'Dệt May, Da Giày & Thời Trang (Textile, Garment & Footwear)', categoryName: 'Dệt may & Da giày' },
  { id: 'agri', name: 'Nông Sản, Trái Cây & Thủy Hải Sản (Agriculture & Seafood)', categoryName: 'Nông & Thủy sản' },
  { id: 'pharma', name: 'Dược Phẩm, Mỹ Phẩm & Thiết Bị Y Tế (Pharma & Healthcare)', categoryName: 'Dược phẩm & Y tế' },
  { id: 'chemicals', name: 'Hóa Chất, Hạt Nhựa & Sơn Phụ Gia (Chemicals & Polymers)', categoryName: 'Hóa chất & Nhựa' },
  { id: 'machinery', name: 'Máy Móc, Thiết Bị Cơ Khí & Phụ Tùng (Machinery & Spare Parts)', categoryName: 'Cơ khí & Máy móc' },
  { id: 'building', name: 'Vật Liệu Xây Dựng, Sắt Thép & Gỗ Nội Thất (Building Materials & Furniture)', categoryName: 'VLXD & Nội thất' },
  { id: 'automotive', name: 'Ô Tô, Xe Máy & Công Nghiệp Phụ Trợ (Automotive & Components)', categoryName: 'Ô tô & Phụ trợ' },
  { id: 'ecommerce', name: 'Thương Mại Điện Tử & Bán Lẻ Phân Phối (E-Commerce & Retail)', categoryName: 'TMĐT & Bán lẻ' },
  { id: 'energy', name: 'Năng Lượng, Dầu Khí & Thiết Bị Dự Án (Energy & Project Cargo)', categoryName: 'Năng lượng & Dự án' },
  { id: 'paper', name: 'Bao Bì, Giấy & In Ấn (Packaging & Paper)', categoryName: 'Bao bì & Giấy' },
  { id: 'feed', name: 'Thức Ăn Chăn Nuôi & Phân Bón Nông Nghiệp (Feed & Fertilizer)', categoryName: 'Thức ăn chăn nuôi' },
  { id: 'other', name: 'Ngành Hàng Khác / Hàng Hóa Tổng Hợp (Other Industries)', categoryName: 'Ngành khác' },
];

export interface ReeferTemperatureRangeOption {
  id: string;
  label: string;
  value: string;
  range: string;
  badge: string;
  description: string;
}

export const REEFER_TEMPERATURE_RANGES_LOV: ReeferTemperatureRangeOption[] = [
  {
    id: 'frozen-ultra',
    label: '🧊 Đông Âm Sâu (-25°C đến -18°C)',
    value: '-25°C đến -18°C (Đông lạnh âm sâu / Ultra-Low Frozen)',
    range: '-25°C đến -18°C',
    badge: 'Đông âm sâu (-25°C ~ -18°C)',
    description: 'Cá ngừ đại dương sashimi, kem cao cấp, mẫu sinh phẩm y tế đặc biệt',
  },
  {
    id: 'frozen-standard',
    label: '❄️ Đông Lạnh Tiêu Chuẩn (-18°C đến -2°C)',
    value: '-18°C đến -2°C (Đông lạnh tiêu chuẩn / Frozen Cargo)',
    range: '-18°C đến -2°C',
    badge: 'Đông lạnh (-18°C ~ -2°C)',
    description: 'Thủy hải sản đông lạnh, thịt bò/heo/gà đông lạnh, thực phẩm chế biến đóng gói',
  },
  {
    id: 'super-chilled',
    label: '🥩 Ướp Lạnh Tươi Sống (-2°C đến +2°C)',
    value: '-2°C đến +2°C (Ướp lạnh tươi sống / Super Chilled)',
    range: '-2°C đến +2°C',
    badge: 'Ướp lạnh (-2°C ~ +2°C)',
    description: 'Thịt tươi mát, phi lê cá hồi tươi, hải sản tươi sống bảo quản đá',
  },
  {
    id: 'pharma-dairy',
    label: '💊 Mát Dược Phẩm & Bơ Sữa (+2°C đến +8°C)',
    value: '+2°C đến +8°C (Dược phẩm GDP, Vắc-xin & Sữa / Pharma & Dairy)',
    range: '+2°C đến +8°C',
    badge: 'Mát chuẩn (+2°C ~ +8°C)',
    description: 'Vắc xin, huyết thanh, sinh phẩm y tế GDP, sữa chua, bơ sữa, hóa chất nhạy nhiệt',
  },
  {
    id: 'fresh-produce',
    label: '🍎 Mát Rau Củ, Trái Cây & Hoa Tươi (+8°C đến +15°C)',
    value: '+8°C đến +15°C (Mát rau củ, Trái cây & Hoa tươi / Cool Fresh Produce)',
    range: '+8°C đến +15°C',
    badge: 'Trái cây & Hoa (+8°C ~ +15°C)',
    description: 'Táo, nho, cherry, dâu tây, hoa tươi Đà Lạt, chuối xanh xuất khẩu, rau củ quả mát',
  },
  {
    id: 'controlled-room',
    label: '🍫 Kiểm Soát Nhiệt Độ Phòng CRT (+15°C đến +25°C)',
    value: '+15°C đến +25°C (Kiểm soát nhiệt độ phòng / CRT - Controlled Room Temp)',
    range: '+15°C đến +25°C',
    badge: 'CRT (+15°C ~ +25°C)',
    description: 'Socola, bánh kẹo cao cấp, rượu vang, mỹ phẩm cao cấp, tân dược bảo quản phòng mát',
  },
  {
    id: 'custom',
    label: '✏️ Tùy Chỉnh Dải Nhiệt Độ Riêng (Nhập thủ công)...',
    value: 'custom',
    range: 'custom',
    badge: 'Tùy chỉnh riêng',
    description: 'Nhập dải nhiệt độ tùy biến chính xác theo quy chuẩn SOP bảo quản riêng của chủ hàng',
  },
];

export interface CurrencyOption {
  code: 'VND' | 'USD' | 'EUR' | 'CNY' | 'JPY';
  symbol: string;
  label: string;
  defaultRate: number; // Rate against VND
  flag: string;
  symbolPosition: 'before' | 'after';
}

export const CURRENCY_OPTIONS_LOV: CurrencyOption[] = [
  { code: 'VND', symbol: '₫', label: 'VND (Việt Nam Đồng)', defaultRate: 1, flag: '🇻🇳', symbolPosition: 'after' },
  { code: 'USD', symbol: '$', label: 'USD (Đô la Mỹ)', defaultRate: 25450, flag: '🇺🇸', symbolPosition: 'before' },
  { code: 'EUR', symbol: '€', label: 'EUR (Euro Châu Âu)', defaultRate: 27650, flag: '🇪🇺', symbolPosition: 'before' },
  { code: 'CNY', symbol: '¥', label: 'CNY (Nhân Dân Tệ)', defaultRate: 3520, flag: '🇨🇳', symbolPosition: 'before' },
  { code: 'JPY', symbol: '¥', label: 'JPY (Yên Nhật)', defaultRate: 168, flag: '🇯🇵', symbolPosition: 'before' },
];

interface CreateInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inquiry: InquiryItem) => void;
  currentUser?: UserProfile | null;
  initialBenchmarkRate?: any;
}

export const CreateInquiryModal: React.FC<CreateInquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  initialBenchmarkRate,
}) => {
  // SECTION 1: Service Category Selection (8 core services)
  const [serviceType, setServiceType] = useState<ServiceType>('Trucking');

  // SECTION 2: Pricing Type & Contract Term
  const [pricingType, setPricingType] = useState<PricingType>('SPOT');
  const [contractTerm, setContractTerm] = useState('Hợp đồng 12 tháng');
  const [committedFrequency, setCommittedFrequency] = useState('2 - 3 chuyến / tuần');

  // SECTION 3: Cargo Classification & Details
  const [cargoClassification, setCargoClassification] = useState<CargoClassification>('General');
  const [industry, setIndustry] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [cargoValue, setCargoValue] = useState('');
  const [cargoValueCurrency, setCargoValueCurrency] = useState<'USD' | 'VND' | 'EUR' | 'CNY' | 'JPY'>('USD');
  const [packagePackaging, setPackagePackaging] = useState('Đóng Pallet gỗ tiêu chuẩn');
  const [customPackaging, setCustomPackaging] = useState('');
  const [isStackable, setIsStackable] = useState(true);
  const [weightKg, setWeightKg] = useState('');
  const [volumeCbm, setVolumeCbm] = useState('');
  const [preservationRequirement, setPreservationRequirement] = useState('');
  
  // Reefer Specific Specs
  const [temperatureRequirement, setTemperatureRequirement] = useState('');
  const [needContinuousGenset, setNeedContinuousGenset] = useState(true);

  // Hazmat / DG Specific Specs
  const [dgClassIMO, setDgClassIMO] = useState('Class 3 - Chất lỏng dễ cháy (Flammable Liquids)');
  const [unNumber, setUnNumber] = useState('');
  const [packingGroup, setPackingGroup] = useState('PG II (Mức độ nguy hiểm trung bình)');
  const [flashPoint, setFlashPoint] = useState<string>('');
  const [msdsFileName, setMsdsFileName] = useState<string>('MSDS_Safety_Data_Sheet.pdf');

  // SECTION 4: Service Specific Routes & Technical Specs
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [truckingSpecs, setTruckingSpecs] = useState<TruckingInquirySpecs>({
    pricingType: 'SPOT',
    truckType: 'Xe Tải Thùng Kín (Dry Box Truck)',
    tonnageCategory: '15.0T (Tải nặng 3 chân)',
    loadType: 'FTL (Nguyên chuyến)',
    vehicleCount: 1,
    vehicleCountUnit: 'Chuyến / Tháng',
    pickupPointsCount: 1,
    pickupLocations: [''],
    deliveryPointsCount: 1,
    deliveryLocations: [''],
    requestedLeadtime: '',
    ltlPieces: 4,
    ltlPackaging: 'Pallet chuẩn 120x100cm',
    ltlDimensions: { lengthCm: 120, widthCm: 100, heightCm: 150 },
    ltlCbm: 7.2,
    ltlGrossWeightKg: 1200,
    ltlChargeableWeightKg: 1800,
    ltlStackable: true,
    ltlShipmentCount: 1,
    ltlFrequencyUnit: 'Chuyến / Tháng',
    multiDropPoints: 1,
    loadingLaborRequired: false,
    unloadingLaborRequired: false,
    tailLiftRequired: false,
    craneAssistanceRequired: false,
    prohibitedHoursPassNeeded: false,
    selectedVAS: [],
  });

  const isTruckingFTL = serviceType === 'Trucking' && truckingSpecs.loadType === 'FTL (Nguyên chuyến)';
  const isImportExportService = (
    serviceType === 'Sea Freight (FCL)' ||
    serviceType === 'Sea Freight (LCL)' ||
    serviceType === 'Air Freight' ||
    serviceType === 'Customs Clearance' ||
    serviceType === 'Cross-border'
  );

  const handleWeightChange = (val: string) => {
    const clean = val.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.]/g, '');
    if (!clean) {
      setWeightKg('');
      return;
    }
    if (!clean.includes('.')) {
      const num = parseInt(clean, 10);
      if (!isNaN(num)) {
        setWeightKg(num.toLocaleString('vi-VN'));
      } else {
        setWeightKg(val);
      }
    } else {
      setWeightKg(val);
    }
  };

  const handleVolumeChange = (val: string) => {
    setVolumeCbm(val);
  };

  const [oceanSpecs, setOceanSpecs] = useState<OceanInquirySpecs>({
    pricingType: 'SPOT',
    tradeRole: 'Xuất khẩu (Export)',
    mode: 'FCL (Full Container)',
    originServiceTerm: 'CY',
    destinationServiceTerm: 'CY',
    containerType: '40ft High Cube (40HC)',
    containerCount: 1,
    containerCountUnit: 'Container / Tháng',
    lclShipmentCount: 1,
    lclFrequencyUnit: 'Chuyến / Tháng',
    cbmVolume: undefined,
    grossWeightKgs: undefined,
    polPort: '',
    podPort: '',
    incoterm: 'FOB',
    commodityCategory: 'Electronics & High-Tech',
    freeDemDetDaysRequested: 14,
    packageType: 'Palletized',
    selectedVAS: [],
  });

  const [airSpecs, setAirSpecs] = useState<AirInquirySpecs>({
    pricingType: 'SPOT',
    airServiceType: 'Air Freight / Cargo',
    tradeRole: 'Xuất khẩu (Export)',
    serviceLevel: 'Standard Air Freight (3-4 days)',
    originServiceTerm: 'AIRPORT',
    destinationServiceTerm: 'AIRPORT',
    expressPackageType: 'Parcel / Package (Bưu phẩm / Hàng mẫu đóng hộp)',
    expressSpeedLevel: 'Express Tiêu Chuẩn (2-3 ngày)',
    originAirport: '',
    destinationAirport: '',
    packageCount: undefined,
    grossWeightKgs: undefined,
    volumetricWeightKgs: undefined,
    chargeableWeightKgs: undefined,
    dimensionsCm: '',
    isDangerousGoods: false,
    isTemperatureSensitive: false,
    customsAtAirport: true,
    stackable: true,
    shipmentCount: 1,
    frequencyUnit: 'Chuyến / Tháng',
    selectedVAS: [],
  });

  const [coldChainSpecs, setColdChainSpecs] = useState<ColdChainInquirySpecs>({
    pricingType: 'SPOT',
    temperatureCategory: 'Frozen (-25°C to -18°C: Kem, Thủy hải sản)',
    vehicleOrContType: 'Xe tải lạnh 8T-15T',
    preCoolingRequested: true,
    realtimeGpsTempLogging: true,
    backupGensetIncluded: true,
    isPharmaCertifiedGDP: false,
    selectedVAS: [],
  });

  const [warehousingSpecs, setWarehousingSpecs] = useState<WarehousingInquirySpecs>({
    pricingType: 'SPOT',
    warehousingLeaseModel: 'OVERFLOW',
    warehouseType: 'Kho thường (Grade A Dry)',
    billingUnitPreference: 'm² (Diện tích sàn)',
    storageAreaSqm: undefined,
    palletPositions: undefined,
    cbmVolume: undefined,
    skuCount: undefined,
    bufferStorageQty: undefined,
    bufferStorageUnit: 'Pallet (Vị trí)',
    bufferPalletPositions: undefined,
    rentalDurationMonths: 12,
    inboundQty: undefined,
    inboundUnit: 'Container 40ft (FEU)',
    inboundPeriod: 'Tuần',
    dailyInboundVolume: undefined,
    outboundQty: undefined,
    outboundUnit: 'Pallet',
    outboundPeriod: 'Ngày',
    dailyOutboundVolume: undefined,
    inventoryMethod: undefined,
    wmsIntegrationNeeded: false,
    selectedVAS: [],
  });

  const [customsSpecs, setCustomsSpecs] = useState<CustomsInquirySpecs>({
    pricingType: 'SPOT',
    tradeRole: 'Nhập khẩu (Import)',
    declarationType: 'Nhập khẩu kinh doanh (A11)',
    customsSubDepartment: '',
    hsCodePrimary: '',
    itemDescription: '',
    invoiceValueUSD: undefined,
    coFormRequested: 'Không yêu cầu',
    redChannelInspectionSupport: false,
    selectedVAS: [],
  });

  const [crossBorderSpecs, setCrossBorderSpecs] = useState<CrossBorderInquirySpecs>({
    pricingType: 'SPOT',
    tradeRole: 'Xuất khẩu (Export)',
    borderGate: 'Mộc Bài / Xa Mát (VN ↔ Campuchia)',
    originCity: '',
    destinationCity: '',
    cargoMode: 'Xe liên vận chạy thẳng (Direct GMS)',
    vehicleCount: 1,
    customsAtBorderIncluded: true,
    transitPermitGMSNeeded: true,
    selectedVAS: [],
  });

  const [railSpecs, setRailSpecs] = useState<RailInquirySpecs>({
    pricingType: 'SPOT',
    tradeRole: 'Nội địa Bắc - Nam (Domestic Rail)',
    mode: 'FCL (Nguyên container ga - ga)',
    originServiceTerm: 'CY',
    destinationServiceTerm: 'CY',
    containerType: 'Cont 40ft HC',
    containerCount: 1,
    containerCountUnit: 'Container / Tháng',
    originStation: '',
    destinationStation: '',
    incoterm: 'DAP',
    freeDemDetDaysRequested: 7,
    lclPieces: undefined,
    lclDimensions: undefined,
    lclCbm: undefined,
    lclGrossWeightKg: undefined,
    lclChargeableWeightKg: undefined,
    lclRevenueTon: undefined,
    lclStackable: true,
    lclShipmentCount: 1,
    lclFrequencyUnit: 'Chuyến / Tháng',
    drayageFirstMile: true,
    drayageLastMile: true,
    selectedVAS: [],
  });

  const [projectSpecs, setProjectSpecs] = useState<ProjectInquirySpecs>({
    pricingType: 'CONTRACT',
    contractTerm: 'Hợp đồng 12 tháng (1 năm tiêu chuẩn đấu thầu)',
    projectCategory: 'DISTRIBUTION',
    distributionChannel: 'B2B / Siêu thị (Modern Trade)',
    originWarehouses: [''],
    coverageScope: 'Toàn quốc (Bắc - Trung - Nam)',
    fleetRequirements: ['🚚 Xe tải nhỏ 1.25T - 2.5T (Giao nội đô / Phố cấm giờ)', '🚚 Xe tải trung 5.0T - 8.0T (Tuyến vệ tinh liên tỉnh)'],
    monthlyTripsOrVolume: '150 chuyến / tháng',
    xDockHubLocation: '',
    xDockTemperature: 'Nhiệt độ thường (Ambient)',
    inboundDailyVolume: '5 - 10 xe cont 40ft/ngày',
    outboundMaxTurnaroundTime: 'Trong vòng 4 - 8 Giờ',
    multimodalCombination: 'Đường Biển + Đường Bộ (Sea - Road Freight)',
    multimodalContainerType: 'Container 40ft High Cube (40HC)',
    selectedVAS: [],
  });

  // SECTION 5: Surcharges & Local Charges State
  const [quotationScope, setQuotationScope] = useState<QuotationScope>('ALL_IN');
  const [requestedSurcharges, setRequestedSurcharges] = useState<string[]>([
    'Phí xếp dỡ tại cảng bốc (Terminal Handling Charge - POL)',
    'Phí chứng từ & Vận đơn đường biển (Bill of Lading / Documentation Fee)',
    'Phí kẹp chì niêm phong (Container Seal Fee)',
    'Phí khai báo tải trọng xác thực (Verified Gross Mass - VGM)',
    'Lệnh giao hàng đầu dỡ (Delivery Order - D/O Fee)',
    'Phí xếp dỡ tại cảng dỡ (Terminal Handling Charge - POD)',
    'Phí vệ sinh container (Container Cleaning / Washing Fee)',
    'Phụ phí biến động nhiên liệu xanh (Bunker Adjustment / Low Sulphur)',
  ]);
  const [surchargesNotes, setSurchargesNotes] = useState<string>('');

  // SECTION 6: VAS Selection State per Service
  const [selectedVASList, setSelectedVASList] = useState<string[]>([]);

  // SECTION 7: Budget, Currency, Exchange Rate, Dates & Notes
  const [currency, setCurrency] = useState<'VND' | 'USD' | 'EUR' | 'CNY' | 'JPY'>('VND');
  const [exchangeRate, setExchangeRate] = useState<number>(25450);
  const [targetBudget, setTargetBudget] = useState('');
  const [pickupDate, setPickupDate] = useState('2026-08-28');
  const [deliveryDate, setDeliveryDate] = useState('2026-08-30');
  const [expiryDate, setExpiryDate] = useState('2026-08-27');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // SECTION 6: File Attachments State
  const [attachments, setAttachments] = useState<InquiryAttachment[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getFileCategory = (fileName: string): 'pdf' | 'excel' | 'word' | 'image' | 'archive' | 'doc' => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['xlsx', 'xls', 'csv'].includes(ext)) return 'excel';
    if (['docx', 'doc'].includes(ext)) return 'word';
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return 'image';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
    return 'doc';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newAttachments: InquiryAttachment[] = Array.from(files).map((file, idx) => ({
      id: `att-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileCategory(file.name),
      uploadedDate: 'Hôm nay',
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Common SLA compliance checkboxes
  const [gpsRequired, setGpsRequired] = useState(true);
  const [insuranceRequired, setInsuranceRequired] = useState(true);

  // Validation and Summary Confirmation States
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSummaryConfirmModal, setShowSummaryConfirmModal] = useState<boolean>(false);
  const [draftInquiry, setDraftInquiry] = useState<InquiryItem | null>(null);
  const [hasPublishedInquiry, setHasPublishedInquiry] = useState<boolean>(false);

  useEffect(() => {
    if (initialBenchmarkRate) {
      if (initialBenchmarkRate.serviceType) setServiceType(initialBenchmarkRate.serviceType);
      if (initialBenchmarkRate.title) setTitle(`RFQ: ${initialBenchmarkRate.title}`);
      if (initialBenchmarkRate.origin) setOrigin(initialBenchmarkRate.origin);
      if (initialBenchmarkRate.destination) setDestination(initialBenchmarkRate.destination);
      if (initialBenchmarkRate.cargoType) setCargoType(initialBenchmarkRate.cargoType);
      if (initialBenchmarkRate.hsCodePrimary || initialBenchmarkRate.hsCode) {
        setHsCode(initialBenchmarkRate.hsCodePrimary || initialBenchmarkRate.hsCode);
      }
      if (initialBenchmarkRate.rateDisplay) setTargetBudget(`Ngân sách mục tiêu: ${initialBenchmarkRate.rateDisplay}`);
    }
  }, [initialBenchmarkRate, isOpen]);

  if (!isOpen) return null;

  // 8 Core services list defined by the user
  const servicesList: { 
    type: ServiceType; 
    icon: React.ComponentType<{ className?: string }>; 
    label: string; 
    badge: string; 
    subtext: string;
    themeColor: 'blue' | 'cyan' | 'teal' | 'sky' | 'emerald' | 'purple' | 'amber' | 'orange' | 'indigo';
  }[] = [
    { type: 'Trucking', icon: Truck, label: 'Đường Bộ', badge: 'LTL / FTL', subtext: 'Xe tải thùng kín, bạt, đầu kéo cont', themeColor: 'indigo' },
    { type: 'Sea Freight (FCL)', icon: Ship, label: 'Đường Biển', badge: 'FCL / LCL', subtext: 'Cảng đi - Cảng đến quốc tế & nội địa', themeColor: 'blue' },
    { type: 'Air Freight', icon: Plane, label: 'Hàng Không', badge: 'Cargo / Express', subtext: 'Chuyển phát nhanh & Air Cargo hỏa tốc', themeColor: 'sky' },
    { type: 'Rail Freight', icon: Train, label: 'Đường Sắt', badge: 'FCL / LCL Ga', subtext: 'Tuyến Bắc Nam & Ga liên vận', themeColor: 'blue' },
    { type: 'Warehousing', icon: Building2, label: 'Kho Bãi 3PL', badge: '6 Loại hình kho', subtext: 'Kho thường, ngoại quan, lạnh, DG, TMĐT', themeColor: 'purple' },
    { type: 'Customs Clearance', icon: FileText, label: 'Thủ Tục Hải Quan', badge: 'Khai báo & C/O', subtext: 'Thông quan cảng, sân bay, KCN, DNCX', themeColor: 'amber' },
    { type: 'Cross-border', icon: Globe, label: 'Cross-Border', badge: 'VN ↔ GMS / TQ', subtext: 'Vận tải bộ xuyên biên giới liên vận', themeColor: 'orange' },
    { type: 'Project Cargo', icon: Layers, label: 'Integrated / Dự Án', badge: 'OOG / Đa PT', subtext: 'Hàng siêu trường siêu trọng, nhà máy', themeColor: 'indigo' },
  ];

  const currentServiceDef = servicesList.find((s) => s.type === serviceType) || servicesList[0];

  // Helper to determine budget label, placeholder and contextual badge based on service & mode
  const getTargetBudgetConfig = () => {
    if (serviceType === 'Trucking') {
      if (truckingSpecs.loadType === 'LTL (Ghép hàng lẻ)') {
        return {
          label: 'Đơn Giá Kỳ Vọng / kg (Trọng lượng tính cước)',
          placeholder: 'VD: 2.500 VND / kg (hoặc 450.000 VND / CBM)',
          badge: 'Tính theo Kg (LTL)',
          hint: `Trọng lượng tính cước: ~${(truckingSpecs.ltlChargeableWeightKg || 1800).toLocaleString('vi-VN')} kg (~${truckingSpecs.ltlCbm || 7.2} CBM)`,
          defaultVal: '2.500 VND / kg',
        };
      }
      return {
        label: 'Đơn Giá Kỳ Vọng / Chuyến',
        placeholder: 'VD: 45.000.000 VND / chuyến',
        badge: 'Nguyên chuyến (FTL)',
        hint: `Tải trọng xe: ${truckingSpecs.tonnageCategory || '15.0T'}`,
        defaultVal: '45.000.000 VND / chuyến',
      };
    }
    if (serviceType === 'Sea Freight (FCL)') {
      return {
        label: 'Đơn Giá Kỳ Vọng / Container',
        placeholder: 'VD: 2.800 USD / Cont 40HC',
        badge: 'USD / Container',
        hint: `Container: ${oceanSpecs.containerType || '40HC'}`,
        defaultVal: '3.800 USD',
      };
    }
    if (serviceType === 'Sea Freight (LCL)') {
      return {
        label: 'Đơn Giá Kỳ Vọng / CBM (hoặc RT)',
        placeholder: 'VD: 45 USD / CBM',
        badge: 'USD / CBM',
        hint: `Thể tích: ${oceanSpecs.cbmVolume || 8.5} CBM`,
        defaultVal: '650 USD',
      };
    }
    if (serviceType === 'Air Freight') {
      return {
        label: 'Đơn Giá Kỳ Vọng / kg (Chargeable Weight)',
        placeholder: 'VD: 4,5 USD / kg',
        badge: 'USD / Kg',
        hint: `Trọng lượng tính cước: ${(airSpecs.chargeableWeightKgs || 200).toLocaleString('vi-VN')} kg`,
        defaultVal: '1.450 USD',
      };
    }
    if (serviceType === 'Warehousing') {
      return {
        label: 'Đơn Giá Kỳ Vọng / m² (hoặc Pallet / Tháng)',
        placeholder: 'VD: 120.000 VND / m² / tháng',
        badge: 'VND / Tháng',
        hint: `Diện tích: ${(warehousingSpecs.storageAreaSqm || 1500).toLocaleString('vi-VN')} m²`,
        defaultVal: '165.000.000 VND/Tháng',
      };
    }
    if (serviceType === 'Customs Clearance') {
      return {
        label: 'Đơn Giá Kỳ Vọng / Bộ Tờ Khai',
        placeholder: 'VD: 1.500.000 VND / tờ khai',
        badge: 'VND / Bộ tờ khai',
        hint: `Loại hình: ${customsSpecs.declarationType || 'Nhập khẩu kinh doanh'}`,
        defaultVal: '3.500.000 VND/Bộ tờ khai',
      };
    }
    if (serviceType === 'Cross-border') {
      return {
        label: 'Đơn Giá Kỳ Vọng / Chuyến Xe Liên Vận',
        placeholder: 'VD: 3.200 USD / chuyến',
        badge: 'USD / Chuyến',
        hint: `Cửa khẩu: ${crossBorderSpecs.borderGate || 'Mộc Bài'}`,
        defaultVal: '3.200 USD',
      };
    }
    if (serviceType === 'Rail Freight') {
      return {
        label: 'Đơn Giá Kỳ Vọng / Container (hoặc Toa)',
        placeholder: 'VD: 18.000.000 VND / cont',
        badge: 'VND / Cont',
        hint: `Ga: ${railSpecs.originStation} → ${railSpecs.destinationStation}`,
        defaultVal: '36.000.000 VND',
      };
    }
    if (serviceType === 'Project Cargo') {
      return {
        label: 'Giá Trị Dự Kiến (Ngân Sách Gói Thầu Dự Án)',
        placeholder: 'VD: 500.000.000 VND / 2.500.000.000 VND...',
        badge: 'Ngân Sách Gói Thầu',
        hint: `Mô hình: ${
          projectSpecs.projectCategory === 'DISTRIBUTION'
            ? 'Phân phối chuỗi'
            : projectSpecs.projectCategory === 'CROSS_DOCK'
            ? 'Trạm Cross-Dock'
            : projectSpecs.projectCategory === 'PORT_ICD'
            ? 'Cảng / Cảng cạn ICD'
            : 'Đa phương thức'
        }`,
        defaultVal: '500.000.000 VND',
      };
    }
    return {
      label: 'Đơn Giá Kỳ Vọng / Chuyến',
      placeholder: 'VD: 45.000.000 VND / chuyến',
      badge: 'VND / Chuyến',
      hint: '',
      defaultVal: '45.000.000 VND',
    };
  };

  const budgetConfig = getTargetBudgetConfig();

  const handleCurrencyChange = (newCurr: 'VND' | 'USD' | 'EUR' | 'CNY' | 'JPY') => {
    setCurrency(newCurr);
    const found = CURRENCY_OPTIONS_LOV.find((c) => c.code === newCurr);
    if (found && found.defaultRate > 1) {
      setExchangeRate(found.defaultRate);
    } else if (newCurr === 'VND') {
      setExchangeRate(25450); // reference rate for USD
    }
  };

  // Handler for target budget formatting with thousand dots
  const handleTargetBudgetChange = (inputVal: string) => {
    if (!inputVal.trim()) {
      setTargetBudget('');
      return;
    }

    // Strip thousand dots
    const clean = inputVal.replace(/\./g, '').trim();

    // Check if user is typing decimal (with comma e.g. 4,5)
    if (clean.includes(',')) {
      const parts = clean.split(',');
      const intDigits = parts[0].replace(/\D/g, '');
      const decDigits = parts[1].replace(/\D/g, '');
      const formattedInt = intDigits ? Number(intDigits).toLocaleString('vi-VN') : '0';
      setTargetBudget(`${formattedInt},${decDigits}`);
      return;
    }

    // Only digits
    const digitsOnly = clean.replace(/\D/g, '');
    if (digitsOnly) {
      const num = Number(digitsOnly);
      setTargetBudget(num.toLocaleString('vi-VN'));
    } else {
      setTargetBudget(inputVal);
    }
  };

  const parseNumericValue = (str: string): number => {
    if (!str) return 0;
    const normalized = str.replace(/\./g, '').replace(/,/g, '.');
    const match = normalized.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const numericBudget = parseNumericValue(targetBudget);

  const getConversionCalculation = () => {
    if (currency === 'VND') return null;
    if (!numericBudget || numericBudget <= 0) return null;
    const rate = exchangeRate > 0 ? exchangeRate : (CURRENCY_OPTIONS_LOV.find(c => c.code === currency)?.defaultRate || 25450);
    const vndVal = Math.round(numericBudget * rate);
    return {
      label: `Quy đổi tương đương sang VNĐ`,
      value: `${vndVal.toLocaleString('vi-VN')} ₫`,
      formula: `1 ${currency} = ${rate.toLocaleString('vi-VN')} ₫`,
    };
  };

  const conversionCalc = getConversionCalculation();

  // Get VAS item list matching currently active service & cargo classification
  const getCurrentVASItems = (): VASItemDef[] => {
    switch (serviceType) {
      case 'Trucking':
        if (cargoClassification === 'Reefer') {
          return TRUCKING_REEFER_VAS;
        }
        if (cargoClassification === 'Hazmat') {
          return TRUCKING_HAZMAT_VAS;
        }
        return truckingSpecs.loadType === 'LTL (Ghép hàng lẻ)' 
          ? TRUCKING_GENERAL_LTL_VAS 
          : TRUCKING_GENERAL_FTL_VAS;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return OCEAN_VAS_ITEMS;
      case 'Air Freight':
        return AIR_VAS_ITEMS;
      case 'Rail Freight':
        return RAIL_VAS_ITEMS;
      case 'Cold Chain':
        return COLD_CHAIN_VAS_ITEMS;
      case 'Warehousing':
        return getWarehousingVASItems(warehousingSpecs.warehouseType, cargoClassification);
      case 'Customs Clearance':
        return CUSTOMS_VAS_ITEMS;
      case 'Cross-border':
        return CROSS_BORDER_VAS_ITEMS;
      case 'Project Cargo':
        return PROJECT_VAS_ITEMS;
      default:
        return TRUCKING_GENERAL_FTL_VAS;
    }
  };

  const handleToggleVAS = (vasName: string) => {
    if (selectedVASList.includes(vasName)) {
      setSelectedVASList(selectedVASList.filter((item) => item !== vasName));
    } else {
      setSelectedVASList([...selectedVASList, vasName]);
    }
  };

  const getDefaultSurchargesForService = (service: ServiceType): string[] => {
    switch (service) {
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return OCEAN_SURCHARGES.filter((s) => s.isPopularDefault).map((s) => s.name);
      case 'Trucking':
        return TRUCKING_SURCHARGES.filter((s) => s.isPopularDefault).map((s) => s.name);
      case 'Air Freight':
        return AIR_SURCHARGES.filter((s) => s.isPopularDefault).map((s) => s.name);
      default:
        return GENERAL_LOGISTICS_SURCHARGES.filter((s) => s.isPopularDefault).map((s) => s.name);
    }
  };

  // Handle service type change & update appropriate defaults
  const handleSelectService = (newService: ServiceType) => {
    setServiceType(newService);
    if (newService === 'Cold Chain') {
      setCargoClassification('Reefer');
    }
    setRequestedSurcharges(getDefaultSurchargesForService(newService));
  };

  const validateInquiryForm = (): string[] => {
    const errors: string[] = [];

    // 1. Kiểm tra Nơi đi / Địa điểm xuất phát theo từng loại dịch vụ
    if (serviceType === 'Customs Clearance') {
      if (!origin.trim() && !customsSpecs.customsSubDepartment?.trim()) {
        errors.push('Vui lòng nhập Chi Cục Hải Quan Mở Tờ Khai.');
      }
    } else if (serviceType === 'Warehousing') {
      if (!origin.trim() && !warehousingSpecs.targetLocation?.trim()) {
        errors.push('Vui lòng nhập Khu vực & Địa bàn kho bãi mục tiêu.');
      }
    } else if (serviceType === 'Project Cargo') {
      if (!origin.trim() && !projectSpecs.coverageScope?.trim()) {
        errors.push('Vui lòng nhập Phạm vi địa bàn hoặc Mạng lưới HUB dự án.');
      }
    } else if (serviceType === 'Air Freight') {
      if (!origin.trim() && !airSpecs.originAirport?.trim()) {
        errors.push('Vui lòng chọn Sân bay đi / Cất cánh (AOD).');
      }
    } else if (serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') {
      if (!origin.trim() && !oceanSpecs.polPort?.trim()) {
        errors.push('Vui lòng chọn Cảng bốc hàng (POL) hoặc Kho CFS xuất phát.');
      }
    } else if (serviceType === 'Rail Freight') {
      if (!origin.trim() && !railSpecs.originStation?.trim()) {
        errors.push('Vui lòng chọn Ga xuất phát / Ga đi.');
      }
    } else if (serviceType === 'Cross-border') {
      if (!origin.trim() && !crossBorderSpecs.originProvince?.trim()) {
        errors.push('Vui lòng chọn Tỉnh/Thành xuất phát.');
      }
    } else {
      if (!origin.trim()) {
        errors.push('Địa điểm lấy hàng / Nơi đi (Origin) là bắt buộc.');
      }
    }

    // 2. Kiểm tra Nơi đến / Điểm giao (Chỉ áp dụng cho các nhóm dịch vụ vận tải có tuyến đường)
    const requiresDestination = [
      'Trucking',
      'Sea Freight (FCL)',
      'Sea Freight (LCL)',
      'Air Freight',
      'Rail Freight',
      'Cross-border',
      'Cold Chain',
    ].includes(serviceType);

    if (requiresDestination && !destination.trim()) {
      if (serviceType === 'Air Freight') {
        errors.push('Vui lòng chọn Sân bay đến / Hạ cánh (AOA).');
      } else if (serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') {
        errors.push('Vui lòng chọn Cảng dỡ hàng (POD) hoặc Kho CFS đích.');
      } else if (serviceType === 'Rail Freight') {
        errors.push('Vui lòng chọn Ga đến / Ga đích.');
      } else if (serviceType === 'Cross-border') {
        errors.push('Vui lòng chọn Quốc gia & Địa điểm đích.');
      } else {
        errors.push('Địa điểm giao hàng / Nơi đến (Destination) là bắt buộc.');
      }
    }

    // 3. Hạn chót nhận báo giá (RFQ Deadline)
    if (!expiryDate) {
      errors.push('Hạn chót nhận báo giá (RFQ Deadline) là bắt buộc.');
    }

    // 4. Ngày bắt đầu / Lấy hàng dự kiến
    if (!pickupDate) {
      if (serviceType === 'Customs Clearance') {
        errors.push('Vui lòng chọn Ngày dự kiến mở tờ khai / làm thủ tục hải quan.');
      } else if (serviceType === 'Warehousing') {
        errors.push('Vui lòng chọn Ngày dự kiến bắt đầu thuê kho.');
      } else if (serviceType === 'Project Cargo') {
        errors.push('Vui lòng chọn Ngày dự kiến triển khai dự án.');
      } else {
        errors.push('Ngày lấy hàng dự kiến (Pickup Date) là bắt buộc.');
      }
    }

    // 5. Kiểm tra Trọng lượng / Thể tích (Miễn trừ cho Kho Bãi, Dự Án, Thủ Tục Hải Quan và FCL đã có số container)
    const isWeightVolumeExempt = ['Warehousing', 'Project Cargo', 'Customs Clearance'].includes(serviceType);
    const hasOceanFclContainer = (serviceType === 'Sea Freight (FCL)' || (serviceType === 'Sea Freight (LCL)' && oceanSpecs.mode?.includes('FCL'))) && (oceanSpecs.containerCount || 0) > 0;
    const hasAirWeight = serviceType === 'Air Freight' && Boolean(airSpecs.grossWeightKgs || airSpecs.chargeableWeightKgs);

    if (!isWeightVolumeExempt && !hasOceanFclContainer && !hasAirWeight && !weightKg.trim() && !volumeCbm.trim()) {
      errors.push('Vui lòng nhập Khối lượng (kg) hoặc Thể tích (cbm) của hàng hóa.');
    }

    // 6. Ràng buộc hàng lạnh / nguy hiểm
    if (cargoClassification === 'Reefer' && !temperatureRequirement) {
      errors.push('Vui lòng chọn dải nhiệt độ bảo quản cho hàng đông lạnh.');
    }

    if (cargoClassification === 'Hazmat' && !dgClassIMO) {
      errors.push('Vui lòng chọn phân loại hàng nguy hiểm (DG IMO Class).');
    }

    if ((cargoClassification === 'Reefer' || cargoClassification === 'Hazmat')) {
      if ((serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') && oceanSpecs.mode === 'LCL (Hàng lẻ đóng ghép CFS)') {
        errors.push(`Hàng ${cargoClassification === 'Reefer' ? 'Lạnh' : 'Nguy Hiểm'} bắt buộc vận chuyển FCL nguyên container, không thể chọn LCL.`);
      }
      if (serviceType === 'Rail Freight' && railSpecs.mode === 'LCL (Hàng lẻ ghép toa)') {
        errors.push(`Hàng ${cargoClassification === 'Reefer' ? 'Lạnh' : 'Nguy Hiểm'} bắt buộc vận chuyển FCL nguyên toa/container, không thể chọn LCL.`);
      }
    }

    return errors;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const errors = validateInquiryForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      const formElement = document.getElementById('create-inquiry-form-body');
      if (formElement) {
        formElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setValidationErrors([]);
    const finalTitle = title.trim() || (
      serviceType === 'Customs Clearance'
        ? `Thủ tục Hải quan - ${origin.trim() || customsSpecs.customsSubDepartment || 'Chi cục Hải quan'}`
        : serviceType === 'Warehousing'
        ? `Thuê kho bãi 3PL - ${origin.trim() || warehousingSpecs.targetLocation || 'Kho tiêu chuẩn'}`
        : serviceType === 'Project Cargo'
        ? `Dự án logistics - ${projectSpecs.projectName || origin.trim() || 'Chuỗi cung ứng'}`
        : (origin && destination ? `${origin.split(',')[0]} → ${destination.split(',')[0]} (${serviceType})` : `Yêu cầu báo giá ${serviceType}`)
    );

    const reqs: string[] = [];
    if (gpsRequired) reqs.push('GPS Live Telematics Tracking');
    if (insuranceRequired) reqs.push('Bảo hiểm 100% giá trị hàng hóa');
    if (cargoClassification === 'Reefer' || serviceType === 'Cold Chain') {
      reqs.push(`Kiểm soát nhiệt độ: ${temperatureRequirement}`);
      if (needContinuousGenset) reqs.push('Cắm điện máy phát Genset liên tục');
    }
    if (cargoClassification === 'Hazmat') {
      reqs.push(`Hàng nguy hiểm: ${dgClassIMO} (${unNumber})`);
      reqs.push('Kèm bản MSDS/SDS chính thức');
    }

    // Clean up pickup and delivery locations for Trucking
    let cleanedTruckingSpecs = { ...truckingSpecs };
    if (serviceType === 'Trucking') {
      const validPickups = (truckingSpecs.pickupLocations || []).map(l => l.trim()).filter(Boolean);
      const validDeliveries = (truckingSpecs.deliveryLocations || []).map(l => l.trim()).filter(Boolean);
      
      const finalPickups = validPickups.length > 0 ? validPickups : [origin.trim() || 'Điểm lấy hàng'];
      const finalDeliveries = validDeliveries.length > 0 ? validDeliveries : [destination.trim() || 'Điểm giao hàng'];

      cleanedTruckingSpecs = {
        ...truckingSpecs,
        pickupLocations: finalPickups,
        pickupPointsCount: finalPickups.length,
        deliveryLocations: finalDeliveries,
        deliveryPointsCount: finalDeliveries.length,
        multiDropPoints: finalDeliveries.length,
      };
    }

    // Assemble service specific specs
    const serviceSpecs: ServiceSpecificSpecs = {};
    if (serviceType === 'Trucking') {
      serviceSpecs.trucking = { 
        ...cleanedTruckingSpecs, 
        ftlWeightKg: isTruckingFTL ? (weightKg.trim() || undefined) : undefined,
        ftlVolumeCbm: isTruckingFTL ? (volumeCbm.trim() || undefined) : undefined,
        pricingType, 
        contractTerm, 
        committedFrequency, 
        selectedVAS: selectedVASList 
      };
    } else if (serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') {
      serviceSpecs.ocean = { 
        ...oceanSpecs, 
        tradeRole: oceanSpecs.tradeRole || 'Xuất khẩu (Export)',
        hsCode: hsCode.trim() || oceanSpecs.hsCode, 
        cargoValue: cargoValue.trim() || oceanSpecs.cargoValue,
        cargoValueCurrency: cargoValue.trim() ? cargoValueCurrency : oceanSpecs.cargoValueCurrency,
        pricingType, 
        contractTerm, 
        committedFrequency, 
        selectedVAS: selectedVASList 
      };
    } else if (serviceType === 'Air Freight') {
      serviceSpecs.air = { 
        ...airSpecs, 
        tradeRole: airSpecs.tradeRole || 'Xuất khẩu (Export)',
        hsCode: hsCode.trim() || airSpecs.hsCode, 
        cargoValue: cargoValue.trim() || airSpecs.cargoValue,
        cargoValueCurrency: cargoValue.trim() ? cargoValueCurrency : airSpecs.cargoValueCurrency,
        pricingType, 
        contractTerm, 
        committedFrequency, 
        selectedVAS: selectedVASList 
      };
    } else if (serviceType === 'Rail Freight') {
      serviceSpecs.rail = { ...railSpecs, pricingType, contractTerm, committedFrequency, selectedVAS: selectedVASList };
    } else if (serviceType === 'Cold Chain') {
      serviceSpecs.coldChain = { ...coldChainSpecs, pricingType, contractTerm, committedFrequency, selectedVAS: selectedVASList };
    } else if (serviceType === 'Warehousing') {
      const leaseModel = pricingType === 'SPOT' ? 'OVERFLOW' : 'LONG_TERM';
      let durationMonths = 12;
      if (contractTerm?.includes('1 Tháng')) durationMonths = 1;
      else if (contractTerm?.includes('2 Tháng')) durationMonths = 2;
      else if (contractTerm?.includes('3 Tháng')) durationMonths = 3;
      else if (contractTerm?.includes('6 Tháng')) durationMonths = 6;
      else if (contractTerm?.includes('24 tháng') || contractTerm?.includes('2 năm')) durationMonths = 24;
      else if (contractTerm?.includes('36 tháng') || contractTerm?.includes('3 năm')) durationMonths = 36;
      else if (contractTerm?.includes('60 tháng') || contractTerm?.includes('5 năm')) durationMonths = 60;

      serviceSpecs.warehousing = { 
        ...warehousingSpecs, 
        warehousingLeaseModel: leaseModel,
        rentalDurationMonths: durationMonths,
        pricingType, 
        contractTerm, 
        committedFrequency, 
        selectedVAS: selectedVASList 
      };
    } else if (serviceType === 'Customs Clearance') {
      serviceSpecs.customs = { 
        ...customsSpecs, 
        tradeRole: customsSpecs.tradeRole || 'Nhập khẩu (Import)',
        hsCodePrimary: hsCode.trim() || customsSpecs.hsCodePrimary, 
        cargoValue: cargoValue.trim() || customsSpecs.cargoValue,
        cargoValueCurrency: cargoValue.trim() ? cargoValueCurrency : customsSpecs.cargoValueCurrency,
        pricingType, 
        contractTerm, 
        committedFrequency, 
        selectedVAS: selectedVASList 
      };
    } else if (serviceType === 'Cross-border') {
      serviceSpecs.crossBorder = { 
        ...crossBorderSpecs, 
        tradeRole: crossBorderSpecs.tradeRole || 'Xuất khẩu (Export)',
        hsCode: hsCode.trim() || crossBorderSpecs.hsCode, 
        cargoValue: cargoValue.trim() || crossBorderSpecs.cargoValue,
        cargoValueCurrency: cargoValue.trim() ? cargoValueCurrency : crossBorderSpecs.cargoValueCurrency,
        pricingType, 
        contractTerm, 
        committedFrequency, 
        selectedVAS: selectedVASList 
      };
    } else if (serviceType === 'Project Cargo') {
      serviceSpecs.project = { ...projectSpecs, pricingType, contractTerm, committedFrequency, selectedVAS: selectedVASList };
    }

    const finalPackaging = packagePackaging === 'Khác' 
      ? (customPackaging.trim() || 'Quy cách đóng gói khác') 
      : packagePackaging;

    const finalCargoType = cargoType.trim() 
      ? cargoType.trim() 
      : (industry ? industry.split('(')[0].trim() : 'Hàng hóa tổng hợp');

    let finalWeightVolume = 'Theo thỏa thuận';
    if (serviceType === 'Warehousing') {
      if (warehousingSpecs.billingUnitPreference?.includes('Pallet')) {
        finalWeightVolume = `${warehousingSpecs.palletPositions || 0} Pallet slots`;
      } else if (warehousingSpecs.billingUnitPreference?.includes('CBM')) {
        finalWeightVolume = `${warehousingSpecs.cbmVolume || 0} CBM`;
      } else if (warehousingSpecs.billingUnitPreference?.includes('Order')) {
        finalWeightVolume = `${warehousingSpecs.dailyOrderCount || 0} Đơn/ngày`;
      } else {
        finalWeightVolume = `${warehousingSpecs.storageAreaSqm || 0} m² sàn`;
      }
    } else {
      const parts: string[] = [];
      if (weightKg.trim()) parts.push(`${weightKg.trim()} kg`);
      if (volumeCbm.trim()) parts.push(`${volumeCbm.trim()} CBM`);
      finalWeightVolume = parts.length > 0 ? parts.join(' / ') : 'Theo thỏa thuận';
    }

    const formattedTargetBudget = targetBudget.trim() 
      ? (targetBudget.toLowerCase().includes(currency.toLowerCase()) ? targetBudget : `${targetBudget} ${currency}`)
      : `${budgetConfig.defaultVal}`;

    // Smart route string for multi-point or single point
    let calculatedRoute = `${origin.split(',')[0]} → ${destination.split(',')[0]}`;
    if (serviceType === 'Trucking' && cleanedTruckingSpecs.pickupLocations && cleanedTruckingSpecs.deliveryLocations) {
      const pCount = cleanedTruckingSpecs.pickupLocations.length;
      const dCount = cleanedTruckingSpecs.deliveryLocations.length;
      if (pCount > 1 || dCount > 1) {
        calculatedRoute = `${pCount} điểm lấy → ${dCount} điểm giao`;
      }
    }

    const activeTradeRole = isImportExportService 
      ? (serviceSpecs.ocean?.tradeRole || serviceSpecs.air?.tradeRole || serviceSpecs.customs?.tradeRole || serviceSpecs.crossBorder?.tradeRole)
      : undefined;

    const activeOriginServiceTerm = serviceSpecs.ocean?.originServiceTerm || serviceSpecs.air?.originServiceTerm;
    const activeDestinationServiceTerm = serviceSpecs.ocean?.destinationServiceTerm || serviceSpecs.air?.destinationServiceTerm;

    const newInquiry: InquiryItem = {
      id: `draft-${Date.now()}`,
      code: '',
      title: finalTitle,
      serviceType,
      pricingType,
      contractTerm: pricingType === 'CONTRACT' ? contractTerm : undefined,
      committedVolume: pricingType === 'CONTRACT' ? committedFrequency : undefined,
      selectedVAS: selectedVASList,
      quotationScope,
      requestedSurcharges: requestedSurcharges.length > 0 ? requestedSurcharges : undefined,
      surchargesNotes: surchargesNotes.trim() ? surchargesNotes.trim() : undefined,
      cargoClassification,
      temperatureRequirement: cargoClassification === 'Reefer' ? temperatureRequirement : undefined,
      preservationRequirement: preservationRequirement.trim() ? preservationRequirement.trim() : undefined,
      dgClassIMO: cargoClassification === 'Hazmat' ? dgClassIMO : undefined,
      unNumber: cargoClassification === 'Hazmat' ? unNumber : undefined,
      packingGroup: cargoClassification === 'Hazmat' ? packingGroup : undefined,
      flashPoint: cargoClassification === 'Hazmat' && flashPoint.trim() ? flashPoint.trim() : undefined,
      msdsFileName: cargoClassification === 'Hazmat' ? (msdsFileName || 'MSDS_Safety_Data_Sheet.pdf') : undefined,
      origin: origin || (cleanedTruckingSpecs.pickupLocations?.[0] ?? 'Điểm đi'),
      destination: destination || (cleanedTruckingSpecs.deliveryLocations?.[0] ?? 'Điểm đến'),
      route: calculatedRoute,
      originServiceTerm: activeOriginServiceTerm,
      destinationServiceTerm: activeDestinationServiceTerm,
      industry: industry.trim() ? industry : undefined,
      hsCode: isImportExportService ? (hsCode.trim() || undefined) : undefined,
      tradeRole: activeTradeRole,
      cargoValue: isImportExportService ? (cargoValue.trim() || undefined) : undefined,
      cargoValueCurrency: isImportExportService && cargoValue.trim() ? cargoValueCurrency : undefined,
      cargoType: finalCargoType,
      packaging: finalPackaging,
      weightVolume: finalWeightVolume,
      ftlWeightKg: weightKg.trim() || undefined,
      ftlVolumeCbm: volumeCbm.trim() || undefined,
      targetBudget: formattedTargetBudget,
      currency,
      exchangeRate: currency === 'VND' ? 1 : exchangeRate,
      pickupDate,
      deliveryDate,
      expiryDate,
      description,
      specialRequirements: reqs,
      attachments: attachments.length > 0 ? attachments : undefined,
      status: 'Open',
      responsesCount: 0,
      viewsCount: 1,
      customerCompany: currentUser?.companyName || 'ABC Manufacturing Vietnam Co., Ltd.',
      contactPerson: currentUser ? `${currentUser.name} (${currentUser.roleTitle || 'Logistics & Supply Chain'})` : 'Lê Hoàng Hiếu (Logistics Lead)',
      createdDate: 'Hôm nay',
      serviceSpecs,
    };

    setHasPublishedInquiry(false);
    setDraftInquiry(newInquiry);
    setShowSummaryConfirmModal(true);
  };

  const handleConfirmFinalPublish = () => {
    if (draftInquiry) {
      const generatedCode = generateFlexGOCode(new Date(), Math.floor(1 + Math.random() * 50));
      const finalPublishedInquiry: InquiryItem = {
        ...draftInquiry,
        id: `inq-${Date.now()}`,
        code: generatedCode,
        leadCode: generatedCode, // Mã lead và Mã Inquiry là 1
      };
      setDraftInquiry(finalPublishedInquiry);
      onSubmit(finalPublishedInquiry);
      setHasPublishedInquiry(true);
    }
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryConfirmModal(false);
    if (hasPublishedInquiry) {
      onClose();
    }
  };

  // Calculate matching suppliers dynamically
  const matchingSuppliersCount = 
    serviceType === 'Trucking' ? 26 :
    serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)' ? 21 :
    serviceType === 'Air Freight' ? 14 :
    serviceType === 'Rail Freight' ? 9 :
    serviceType === 'Cold Chain' ? 12 :
    serviceType === 'Warehousing' ? 18 :
    serviceType === 'Customs Clearance' ? 22 :
    serviceType === 'Cross-border' ? 11 : 8;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="create-inquiry-modal-card"
        className="w-full max-w-[98vw] 2xl:max-w-[1680px] bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-2 sm:my-3 flex flex-col h-[96vh] max-h-[96vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 rounded-full uppercase tracking-wider">
                RFQ DISPATCHER
              </span>
              <span className="text-xs text-slate-300">Tạo Yêu Cầu Báo Giá Logistics Chuẩn Hóa 7 Bước</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <span>Đăng Yêu Cầu Báo Giá Mới (Send RFQ)</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <form id="create-inquiry-form-body" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Validation Warning Banner if required fields are missing */}
          {validationErrors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-900 mb-1">
                    Vui lòng hoàn tất các trường thông tin bắt buộc trước khi phát hành ({validationErrors.length} mục):
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-rose-700">
                    {validationErrors.map((err, idx) => (
                      <li key={idx} className="font-semibold">{err}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setValidationErrors([])}
                  className="p-1 text-rose-400 hover:text-rose-700 rounded-md hover:bg-rose-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 1: Chọn Loại Hình Dịch Vụ */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                <span>Chọn Loại Hình Dịch Vụ</span>
              </label>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                8 Dịch vụ vận tải & kho bãi chuyên sâu
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
              {servicesList.map((s) => {
                const isSelected = serviceType === s.type || (s.type === 'Sea Freight (FCL)' && serviceType === 'Sea Freight (LCL)');
                const IconComponent = s.icon;
                return (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => handleSelectService(s.type)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.badge}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs font-bold block ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {s.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                        {s.subtext}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Hình Thức Báo Giá / Loại Hình Hợp Đồng */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <span>Hình Thức Báo Giá / Loại Hình Hợp Đồng</span>
              </label>
            </div>

            <PricingTypeSection
              pricingType={pricingType}
              onChangePricingType={(newType) => {
                setPricingType(newType);
                setWarehousingSpecs((prev) => ({
                  ...prev,
                  pricingType: newType,
                  warehousingLeaseModel: newType === 'CONTRACT' ? 'LONG_TERM' : 'OVERFLOW',
                }));
                setCustomsSpecs((prev) => ({
                  ...prev,
                  pricingType: newType,
                }));
              }}
              contractTerm={contractTerm}
              onChangeContractTerm={setContractTerm}
              committedVolume={customsSpecs.committedVolume}
              onChangeCommittedVolume={(val) => setCustomsSpecs((prev) => ({ ...prev, committedVolume: val }))}
              committedFrequency={customsSpecs.committedFrequency || committedFrequency}
              onChangeCommittedFrequency={(val) => {
                setCommittedFrequency(val);
                setCustomsSpecs((prev) => ({ ...prev, committedFrequency: val }));
              }}
              serviceType={serviceType}
              serviceLabel={currentServiceDef.label}
              themeColor={currentServiceDef.themeColor}
            />
          </div>

          {/* SECTION 3: Phân Nhóm Hàng Hóa & Quy Cách Đóng Gói */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                <span>Phân Nhóm Hàng Hóa & Quy Cách Đóng Gói</span>
              </label>
            </div>

            {/* 3 Tabs for Cargo Group */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCargoClassification('General');
                  if (serviceType === 'Trucking') {
                    setTruckingSpecs((prev) => ({
                      ...prev,
                      truckType: 'Xe Tải Thùng Kín (Dry Box Truck)',
                      tonnageCategory: '15.0T (Tải nặng 3 chân)',
                      loadType: 'FTL (Nguyên chuyến)',
                    }));
                    setSelectedVASList([TRUCKING_GENERAL_FTL_VAS[0].name, TRUCKING_GENERAL_FTL_VAS[5].name]);
                  }
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                  cargoClassification === 'General'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                }`}
              >
                <div className={`p-2 rounded-xl ${cargoClassification === 'General' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs block font-bold">Hàng Thường (General)</span>
                  <span className="text-[10px] text-slate-500 block">Bách hóa, linh kiện, tiêu dùng</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCargoClassification('Reefer');
                  if (serviceType === 'Trucking') {
                    setTruckingSpecs((prev) => ({
                      ...prev,
                      truckType: 'Xe Tải Thùng Đông Lạnh Trung (Regional Reefer)',
                      tonnageCategory: '5.0T – 6.5T (Thùng dài 5.8m – 6.2m)',
                      loadType: 'FTL (Nguyên chuyến)',
                    }));
                    setSelectedVASList([TRUCKING_REEFER_VAS[0].name, TRUCKING_REEFER_VAS[1].name]);
                  }
                  if (serviceType === 'Sea Freight (LCL)') {
                    setServiceType('Sea Freight (FCL)');
                  }
                  setOceanSpecs((prev) => ({
                    ...prev,
                    mode: 'FCL (Full Container)',
                    containerType: prev.containerType?.includes('Reefer') ? prev.containerType : '40ft Reefer (40RF)',
                  }));
                  setRailSpecs((prev) => ({
                    ...prev,
                    mode: 'FCL (Nguyên container ga - ga)',
                    containerType: 'Cont Lạnh (Reefer Rail)',
                  }));
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                  cargoClassification === 'Reefer'
                    ? 'border-cyan-600 bg-cyan-50/80 ring-2 ring-cyan-500/20 text-cyan-950 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                }`}
              >
                <div className={`p-2 rounded-xl ${cargoClassification === 'Reefer' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <ThermometerSnowflake className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs block font-bold">Hàng Lạnh (Reefer)</span>
                  <span className="text-[10px] text-slate-500 block">Nông sản, thực phẩm, dược phẩm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCargoClassification('Hazmat');
                  if (serviceType === 'Trucking') {
                    setTruckingSpecs((prev) => ({
                      ...prev,
                      truckType: 'Xe Tải Thùng Kín Chuyên Dụng Hóa Chất (DG Dry Box)',
                      tonnageCategory: '5.0T – 8.0T (Hóa chất liên tỉnh)',
                      loadType: 'FTL (Nguyên chuyến)',
                    }));
                    setSelectedVASList([TRUCKING_HAZMAT_VAS[0].name, TRUCKING_HAZMAT_VAS[2].name]);
                  }
                  if (serviceType === 'Sea Freight (LCL)') {
                    setServiceType('Sea Freight (FCL)');
                  }
                  setOceanSpecs((prev) => ({
                    ...prev,
                    mode: 'FCL (Full Container)',
                  }));
                  setRailSpecs((prev) => ({
                    ...prev,
                    mode: 'FCL (Nguyên container ga - ga)',
                  }));
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                  cargoClassification === 'Hazmat'
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20 text-amber-950 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                }`}
              >
                <div className={`p-2 rounded-xl ${cargoClassification === 'Hazmat' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs block font-bold">Hàng Nguy Hiểm (DG)</span>
                  <span className="text-[10px] text-slate-500 block">Hóa chất, pin, IMO Hazmat</span>
                </div>
              </button>
            </div>

            {/* Dynamic Specific Inputs for Reefer Cargo */}
            {cargoClassification === 'Reefer' && (
              <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-2xl space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-950">
                    <ThermometerSnowflake className="w-4 h-4 text-cyan-700" />
                    <span>
                      {serviceType === 'Warehousing'
                        ? 'Yêu Cầu Kiểm Soát Nhiệt Độ, Độ Ẩm & Bảo Quản Kho Lạnh *'
                        : 'Yêu Cầu Kiểm Soát Nhiệt Độ & Bảo Quản Lạnh *'}
                    </span>
                  </div>
                  {serviceType === 'Warehousing' && (
                    <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded-md border border-cyan-200">
                      Cold Storage Product Specs
                    </span>
                  )}
                </div>

                {serviceType === 'Customs Clearance' ? (
                  <div className="p-3 bg-cyan-100/70 border border-cyan-300 rounded-xl text-xs text-cyan-950 flex items-start gap-2.5">
                    <span className="text-base">🌿</span>
                    <div>
                      <span className="font-bold block">Nghiệp vụ hải quan hàng thực phẩm / bảo quản lạnh:</span>
                      <p className="text-cyan-900 mt-0.5">
                        Hàng nông sản, thủy sản, thực phẩm đông lạnh/tươi sống thường thuộc diện <strong>Kiểm dịch thực vật / động vật</strong> và <strong>Kiểm tra An toàn thực phẩm (ATTP)</strong>. Vui lòng khai báo các loại chứng nhận và kiểm tra chuyên ngành ở Mục 4.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Select LOV standard range */}
                    <div className="lg:col-span-6">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Dải Nhiệt Độ Chuẩn *
                      </label>
                      <select
                        value={
                          REEFER_TEMPERATURE_RANGES_LOV.find((opt) => opt.value === temperatureRequirement)?.id ||
                          (temperatureRequirement ? 'custom' : 'frozen-deep')
                        }
                        onChange={(e) => {
                          const opt = REEFER_TEMPERATURE_RANGES_LOV.find((o) => o.id === e.target.value);
                          if (opt && opt.id !== 'custom') {
                            setTemperatureRequirement(opt.value);
                          } else {
                            if (!temperatureRequirement) setTemperatureRequirement('');
                          }
                        }}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-cyan-300 rounded-xl font-bold text-cyan-950 focus:border-cyan-500 shadow-2xs"
                      >
                        {REEFER_TEMPERATURE_RANGES_LOV.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Refine / Custom manual input */}
                    <div className="lg:col-span-6">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Chi Tiết Dải Cài Đặt Thực Tế (°C) *
                      </label>
                      <input
                        type="text"
                        required
                        value={temperatureRequirement}
                        onChange={(e) => setTemperatureRequirement(e.target.value)}
                        placeholder="VD: -18°C đến -22°C hoặc +2°C đến +8°C"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-cyan-300 rounded-xl font-bold text-cyan-900 focus:border-cyan-500 shadow-2xs"
                      />
                    </div>
                  </div>
                )}

                {/* Additional Cold Storage Product Parameters (Humidity & Inbound State) */}
                {serviceType === 'Warehousing' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1 border-t border-cyan-200/60">
                    {/* 1. Humidity Control */}
                    <div className="lg:col-span-6">
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Yêu Cầu Kiểm Soát Độ Ẩm (Relative Humidity - % RH)</span>
                      </label>
                      <select
                        value={warehousingSpecs.humidityRequirement || 'Không yêu cầu kiểm soát độ ẩm đặc biệt (Chuẩn kho lạnh/mát)'}
                        onChange={(e) => setWarehousingSpecs({ ...warehousingSpecs, humidityRequirement: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-cyan-300 rounded-xl font-bold text-cyan-950 focus:border-cyan-500 shadow-2xs cursor-pointer"
                      >
                        <option value="Không yêu cầu kiểm soát độ ẩm đặc biệt (Chuẩn kho lạnh/mát)">
                          ❄️ Không yêu cầu độ ẩm đặc biệt (Chuẩn kho đông/mát thông thường)
                        </option>
                        <option value="Độ ẩm tiêu chuẩn (50% - 65% RH)">
                          💧 Độ ẩm tiêu chuẩn (50% - 65% RH) - Hàng nông sản, trái cây
                        </option>
                        <option value="Kiểm soát độ ẩm khô khắt khe (< 45% RH)">
                          🏜️ Kiểm soát độ ẩm khô khắt khe (&lt; 45% RH) - Dược phẩm, chip điện tử
                        </option>
                        <option value="Độ ẩm cao giữ ẩm (> 85% RH)">
                          🌧️ Độ ẩm cao giữ ẩm (&gt; 85% RH) - Hoa tươi, rau củ quả lá
                        </option>
                        <option value="Tùy chỉnh riêng (% RH)">
                          ✏️ Tùy chỉnh riêng (% RH)
                        </option>
                      </select>

                      {warehousingSpecs.humidityRequirement === 'Tùy chỉnh riêng (% RH)' && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                          <input
                            type="text"
                            required
                            value={warehousingSpecs.customHumidity || ''}
                            onChange={(e) => setWarehousingSpecs({ ...warehousingSpecs, customHumidity: e.target.value })}
                            placeholder="Nhập dải độ ẩm yêu cầu (VD: 40% - 50% RH)..."
                            className="w-full px-3 py-2 text-xs bg-white border border-cyan-400 rounded-xl focus:border-cyan-600 font-bold text-cyan-950 shadow-2xs placeholder:font-normal"
                          />
                        </div>
                      )}
                    </div>

                    {/* 2. Inbound Cargo Temperature State */}
                    <div className="lg:col-span-6">
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Trạng Thái Nhiệt Độ Hàng Khi Đưa Vào Kho *</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setWarehousingSpecs({ ...warehousingSpecs, inboundTemperatureState: 'PRE_COOLED' })}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            warehousingSpecs.inboundTemperatureState !== 'NEED_COOLING'
                              ? 'border-cyan-600 bg-white ring-2 ring-cyan-500/20 text-cyan-950 font-bold shadow-2xs'
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                              warehousingSpecs.inboundTemperatureState !== 'NEED_COOLING' ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300'
                            }`}>
                              {warehousingSpecs.inboundTemperatureState !== 'NEED_COOLING' && <CheckCircle2 className="w-2.5 h-2.5" />}
                            </span>
                            <span className="text-xs font-bold">Hàng đã đạt chuẩn</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 pl-5 font-normal">
                            Đã hạ nhiệt/cấp đông trước (Pre-cooled).
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWarehousingSpecs({ ...warehousingSpecs, inboundTemperatureState: 'NEED_COOLING' })}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            warehousingSpecs.inboundTemperatureState === 'NEED_COOLING'
                              ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20 text-amber-950 font-bold shadow-2xs'
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                              warehousingSpecs.inboundTemperatureState === 'NEED_COOLING' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                            }`}>
                              {warehousingSpecs.inboundTemperatureState === 'NEED_COOLING' && <CheckCircle2 className="w-2.5 h-2.5" />}
                            </span>
                            <span className="text-xs font-bold">Cần cấp đông tại kho</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 pl-5 font-normal">
                            Hàng tươi mới cần cấp đông gió.
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Continuous Genset Checkbox - Only for transport services (hidden for Warehousing and Customs) */}
                {serviceType !== 'Warehousing' && serviceType !== 'Customs Clearance' && (
                  <div className="pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-white p-2.5 rounded-xl border border-cyan-200 w-full hover:border-cyan-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={needContinuousGenset}
                        onChange={(e) => setNeedContinuousGenset(e.target.checked)}
                        className="rounded text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="font-bold text-cyan-950 text-xs">Bảo lưu điện liên tục máy phát Genset / Plug-in (Continuous Power)</span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Specific Inputs for Hazmat / DG Cargo */}
            {cargoClassification === 'Hazmat' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Khai Báo Thông Số Hàng Nguy Hiểm & Hóa Chất (IMO / GHS DG Class) *</span>
                  </div>
                  {serviceType === 'Warehousing' && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                      DG Warehouse Specs
                    </span>
                  )}
                </div>

                {/* Row 1: IMO Class, UN Number, Packing Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhóm Nguy Hiểm (IMO Class) *
                    </label>
                    <select
                      value={dgClassIMO}
                      onChange={(e) => setDgClassIMO(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-amber-200 rounded-xl font-bold text-amber-950 focus:border-amber-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Class 2.1 - Khí dễ cháy (Flammable Gas)">Class 2.1 - Khí dễ cháy</option>
                      <option value="Class 2.2 - Khí không cháy, không độc">Class 2.2 - Khí không độc hại</option>
                      <option value="Class 3 - Chất lỏng dễ cháy (Flammable Liquids)">Class 3 - Chất lỏng dễ cháy</option>
                      <option value="Class 4.1 - Chất rắn dễ cháy">Class 4.1 - Chất rắn dễ cháy</option>
                      <option value="Class 4.2 - Chất tự bốc cháy">Class 4.2 - Chất tự bốc cháy</option>
                      <option value="Class 4.3 - Chất nguy hiểm khi tiếp xúc nước">Class 4.3 - Nguy hiểm khi gặp nước</option>
                      <option value="Class 5.1 - Chất oxy hóa (Oxidizing)">Class 5.1 - Chất oxy hóa</option>
                      <option value="Class 5.2 - Peroxit hữu cơ">Class 5.2 - Peroxit hữu cơ</option>
                      <option value="Class 6.1 - Chất độc hại (Toxic)">Class 6.1 - Chất độc hại</option>
                      <option value="Class 8 - Chất ăn mòn (Corrosive)">Class 8 - Chất ăn mòn</option>
                      <option value="Class 9 - Nguy hiểm khác (Pin Lithium / Khác)">Class 9 - Pin Lithium & Nguy hiểm khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mã Số UN (UN Number) *
                    </label>
                    <input
                      type="text"
                      required
                      value={unNumber}
                      onChange={(e) => setUnNumber(e.target.value)}
                      placeholder="VD: UN 1263, UN 1993, UN 3480"
                      className="w-full px-3 py-2.5 text-xs bg-white border border-amber-200 rounded-xl font-bold text-amber-900 focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhóm Đóng Gói (Packing Group) *
                    </label>
                    <select
                      value={packingGroup}
                      onChange={(e) => setPackingGroup(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-amber-200 rounded-xl font-bold text-amber-950 focus:border-amber-500 shadow-2xs cursor-pointer"
                    >
                      <option value="PG I (Mức độ nguy hiểm cao)">PG I - Mức độ nguy hiểm cao</option>
                      <option value="PG II (Mức độ nguy hiểm trung bình)">PG II - Mức độ nguy hiểm trung bình</option>
                      <option value="PG III (Mức độ nguy hiểm thấp)">PG III - Mức độ nguy hiểm thấp</option>
                      <option value="Không áp dụng (Non-applicable / Pin Lithium / Khí nén)">Không áp dụng (Pin Lithium / Khí nén)</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Flash Point & MSDS File Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-amber-200/60">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>Điểm Chớp Cháy (Flash Point - °C)</span>
                      {dgClassIMO.includes('Class 3') && (
                        <span className="text-[10px] text-rose-600 font-bold ml-1">* Quan trọng cho PCCC Class 3</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={flashPoint}
                      onChange={(e) => setFlashPoint(e.target.value)}
                      placeholder={dgClassIMO.includes('Class 3') ? "VD: 18°C hoặc 23°C (Bắt buộc kiểm tra PCCC)" : "VD: 24°C, > 60°C hoặc Không áp dụng"}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-amber-200 rounded-xl font-bold text-amber-900 focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                        <span>Đính Kèm Bảng An Toàn Hóa Chất (MSDS / SDS)</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-normal">PDF, DOC</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-1.5 px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-700 truncate shadow-2xs">
                        <Paperclip className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate font-semibold text-slate-800">
                          {msdsFileName || 'MSDS_Chemical_Safety_Sheet.pdf'}
                        </span>
                      </div>
                      <label className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold border border-amber-300 cursor-pointer shrink-0 transition-colors shadow-2xs">
                        <span>Đổi File</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setMsdsFileName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Cargo Info, Weight & Preservation Requirements */}
            <div className="space-y-3">
              <div className={`grid grid-cols-1 ${
                serviceType === 'Warehousing'
                  ? 'sm:grid-cols-3'
                  : isImportExportService
                  ? 'sm:grid-cols-2 lg:grid-cols-4'
                  : 'sm:grid-cols-2'
              } gap-3`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Ngành Hàng (Industry) *</span>
                    </label>
                  </div>
                  <select
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-semibold text-slate-800 transition-colors"
                  >
                    <option value="">-- Chọn ngành hàng (Bắt buộc) * --</option>
                    {LOGISTICS_INDUSTRY_LOV.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Tên / Chủng Loại Hàng Hóa Cụ Thể
                    </label>
                  </div>
                  <input
                    type="text"
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    placeholder="VD: Bao bì, bo mạch, hạt nhựa, nông sản... (Tùy chọn)"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium text-slate-900"
                  />
                </div>

                {serviceType === 'Warehousing' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Quy Cách Đóng Gói (Packaging) *
                      </label>
                    </div>
                    <select
                      value={packagePackaging}
                      onChange={(e) => {
                        setPackagePackaging(e.target.value);
                        if (e.target.value !== 'Khác') {
                          setCustomPackaging('');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-xs bg-purple-50/50 border border-purple-200 rounded-xl focus:bg-white focus:border-purple-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
                    >
                      <option value="Đóng Pallet gỗ / nhựa tiêu chuẩn">🪵 Đóng Pallet gỗ / nhựa tiêu chuẩn (Palletized)</option>
                      <option value="Thùng carton rời / Chưa lên pallet">📦 Thùng carton rời / Chưa lên pallet (Loose Cartons)</option>
                      <option value="Kiện gỗ / Khung gỗ / Thùng gỗ kín">🪵 Kiện gỗ / Khung gỗ / Thùng gỗ kín (Wooden Crates)</option>
                      <option value="Bao tải dệt / Bao Jumbo (FIBC)">🌾 Bao tải dệt / Bao Jumbo (FIBC Big Bags)</option>
                      <option value="Thùng phi / Can nhựa / Bồn IBC">🛢️ Thùng phi / Can nhựa / Bồn IBC (Drums & IBCs)</option>
                      <option value="Hàng cuộn / Ống / Bó thanh dài">🛞 Hàng cuộn / Ống / Bó thanh dài (Coils & Pipes)</option>
                      <option value="Thiết bị / Máy móc nguyên chiếc">🚗 Thiết bị / Máy móc nguyên chiếc (Machinery & CBU)</option>
                      <option value="Hàng rời không đóng gói">🛍️ Hàng rời không đóng gói (Bulk / Loose Cargo)</option>
                      <option value="Khác">✏️ Khác (Tự nhập quy cách đóng gói...)</option>
                    </select>

                    {packagePackaging === 'Khác' && (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                        <input
                          type="text"
                          required
                          value={customPackaging}
                          onChange={(e) => setCustomPackaging(e.target.value)}
                          placeholder="Nhập quy cách đóng gói cụ thể (VD: Thùng mút xốp, Màng co PE, Cuộn Reel...)"
                          className="w-full px-3 py-2 text-xs bg-amber-50/50 border border-amber-300 rounded-xl focus:bg-white focus:border-amber-500 font-medium text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    )}
                  </div>
                )}

                {isImportExportService && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Mã HS Code (Import/Export)</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        4 - 8 chữ số
                      </span>
                    </div>
                    <input
                      type="text"
                      value={hsCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHsCode(val);
                        if (serviceType === 'Customs Clearance') {
                          setCustomsSpecs((prev) => ({ ...prev, hsCodePrimary: val }));
                        }
                        if (serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') {
                          setOceanSpecs((prev) => ({ ...prev, hsCode: val }));
                        }
                        if (serviceType === 'Air Freight') {
                          setAirSpecs((prev) => ({ ...prev, hsCode: val }));
                        }
                        if (serviceType === 'Cross-border') {
                          setCrossBorderSpecs((prev) => ({ ...prev, hsCode: val }));
                        }
                      }}
                      placeholder="VD: 8471.30.20, 8504.40..."
                      className="w-full px-3.5 py-2.5 text-xs bg-amber-50/40 border border-amber-200 rounded-xl focus:bg-white focus:border-amber-500 font-mono font-bold text-amber-950 shadow-2xs placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>
                )}

                {isImportExportService && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Giá Trị Hàng Hóa (Cargo Value)</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Khai báo / Bảo hiểm
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={cargoValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCargoValue(val);
                            if (serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') {
                              setOceanSpecs((prev) => ({ ...prev, cargoValue: val, cargoValueCurrency }));
                            }
                            if (serviceType === 'Air Freight') {
                              setAirSpecs((prev) => ({ ...prev, cargoValue: val, cargoValueCurrency }));
                            }
                            if (serviceType === 'Customs Clearance') {
                              const numVal = parseFloat(val.replace(/,/g, '')) || 0;
                              setCustomsSpecs((prev) => ({ ...prev, cargoValue: val, cargoValueCurrency, invoiceValueUSD: numVal }));
                            }
                            if (serviceType === 'Cross-border') {
                              setCrossBorderSpecs((prev) => ({ ...prev, cargoValue: val, cargoValueCurrency }));
                            }
                          }}
                          placeholder="VD: 50,000 / 1.200.000.000..."
                          className="w-full px-3 py-2.5 text-xs bg-emerald-50/40 border border-emerald-200 rounded-xl focus:bg-white focus:border-emerald-500 font-mono font-bold text-emerald-950 shadow-2xs placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                        />
                      </div>
                      <select
                        value={cargoValueCurrency}
                        onChange={(e) => {
                          const curr = e.target.value as any;
                          setCargoValueCurrency(curr);
                          if (serviceType === 'Sea Freight (FCL)' || serviceType === 'Sea Freight (LCL)') {
                            setOceanSpecs((prev) => ({ ...prev, cargoValueCurrency: curr }));
                          }
                          if (serviceType === 'Air Freight') {
                            setAirSpecs((prev) => ({ ...prev, cargoValueCurrency: curr }));
                          }
                          if (serviceType === 'Customs Clearance') {
                            setCustomsSpecs((prev) => ({ ...prev, cargoValueCurrency: curr }));
                          }
                          if (serviceType === 'Cross-border') {
                            setCrossBorderSpecs((prev) => ({ ...prev, cargoValueCurrency: curr }));
                          }
                        }}
                        className="w-20 px-2 py-2.5 text-xs bg-emerald-50/50 border border-emerald-200 rounded-xl font-bold text-emerald-900 focus:bg-white focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="USD">USD</option>
                        <option value="VND">VND</option>
                        <option value="EUR">EUR</option>
                        <option value="CNY">CNY</option>
                        <option value="JPY">JPY</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2 for standard freight services: Packaging, Weight, Volume */}
              {serviceType !== 'Warehousing' && serviceType !== 'Project Cargo' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Quy Cách Đóng Gói (Packaging)
                      </label>
                    </div>
                    <select
                      value={packagePackaging}
                      onChange={(e) => {
                        setPackagePackaging(e.target.value);
                        if (e.target.value !== 'Khác') {
                          setCustomPackaging('');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-semibold text-slate-800"
                    >
                      <option value="Đóng Pallet gỗ / nhựa tiêu chuẩn">🪵 Đóng Pallet gỗ / nhựa tiêu chuẩn (Palletized)</option>
                      <option value="Thùng carton rời / Chưa lên pallet">📦 Thùng carton rời / Chưa lên pallet (Loose Cartons)</option>
                      <option value="Kiện gỗ / Khung gỗ / Thùng gỗ kín">🪵 Kiện gỗ / Khung gỗ / Thùng gỗ kín (Wooden Crates)</option>
                      <option value="Bao tải dệt / Bao Jumbo (FIBC)">🌾 Bao tải dệt / Bao Jumbo (FIBC Big Bags)</option>
                      <option value="Thùng phi / Can nhựa / Bồn IBC">🛢️ Thùng phi / Can nhựa / Bồn IBC (Drums & IBCs)</option>
                      <option value="Hàng cuộn / Ống / Bó thanh dài">🛞 Hàng cuộn / Ống / Bó thanh dài (Coils & Pipes)</option>
                      <option value="Thiết bị / Máy móc nguyên chiếc">🚗 Thiết bị / Máy móc nguyên chiếc (Machinery & CBU)</option>
                      <option value="Hàng rời không đóng gói">🛍️ Hàng rời không đóng gói (Bulk / Loose Cargo)</option>
                      <option value="Khác">✏️ Khác (Tự nhập quy cách đóng gói...)</option>
                    </select>

                    {packagePackaging === 'Khác' && (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                        <input
                          type="text"
                          required
                          value={customPackaging}
                          onChange={(e) => setCustomPackaging(e.target.value)}
                          placeholder="Nhập quy cách đóng gói cụ thể (VD: Thùng mút xốp, Màng co PE, Cuộn Reel...)"
                          className="w-full px-3 py-2 text-xs bg-amber-50/50 border border-amber-300 rounded-xl focus:bg-white focus:border-amber-500 font-medium text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Tổng Khối Lượng (kg) *</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Gross Weight
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={weightKg}
                        onChange={(e) => handleWeightChange(e.target.value)}
                        placeholder="VD: 15.000"
                        className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-bold text-slate-900 shadow-2xs transition-colors"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        kg
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Tổng Thể Tích (cbm) *</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Volume
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={volumeCbm}
                        onChange={(e) => handleVolumeChange(e.target.value)}
                        placeholder="VD: 45"
                        className="w-full pl-3.5 pr-12 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-bold text-slate-900 shadow-2xs transition-colors"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        cbm
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 2 for Project Cargo: Packaging only (Full width, no Gross Weight / Volume) */}
              {serviceType === 'Project Cargo' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Quy Cách Đóng Gói Hàng Hóa Dự Án (Packaging)
                    </label>
                  </div>
                  <select
                    value={packagePackaging}
                    onChange={(e) => {
                      setPackagePackaging(e.target.value);
                      if (e.target.value !== 'Khác') {
                        setCustomPackaging('');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Đóng Pallet gỗ / nhựa tiêu chuẩn">🪵 Đóng Pallet gỗ / nhựa tiêu chuẩn (Palletized)</option>
                    <option value="Thùng carton rời / Chưa lên pallet">📦 Thùng carton rời / Chưa lên pallet (Loose Cartons)</option>
                    <option value="Kiện gỗ / Khung gỗ / Thùng gỗ kín">🪵 Kiện gỗ / Khung gỗ / Thùng gỗ kín (Wooden Crates)</option>
                    <option value="Bao tải dệt / Bao Jumbo (FIBC)">🌾 Bao tải dệt / Bao Jumbo (FIBC Big Bags)</option>
                    <option value="Thùng phi / Can nhựa / Bồn IBC">🛢️ Thùng phi / Can nhựa / Bồn IBC (Drums & IBCs)</option>
                    <option value="Hàng cuộn / Ống / Bó thanh dài">🛞 Hàng cuộn / Ống / Bó thanh dài (Coils & Pipes)</option>
                    <option value="Thiết bị / Máy móc nguyên chiếc">🚗 Thiết bị / Máy móc nguyên chiếc (Machinery & CBU)</option>
                    <option value="Hàng rời không đóng gói">🛍️ Hàng rời không đóng gói (Bulk / Loose Cargo)</option>
                    <option value="Khác">✏️ Khác (Tự nhập quy cách đóng gói...)</option>
                  </select>

                  {packagePackaging === 'Khác' && (
                    <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <input
                        type="text"
                        required
                        value={customPackaging}
                        onChange={(e) => setCustomPackaging(e.target.value)}
                        placeholder="Nhập quy cách đóng gói cụ thể (VD: Thùng mút xốp, Màng co PE, Cuộn Reel...)"
                        className="w-full px-3 py-2 text-xs bg-amber-50/50 border border-amber-300 rounded-xl focus:bg-white focus:border-amber-500 font-medium text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Trường Yêu Cầu Bảo Quản (Customer input) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Yêu Cầu Bảo Quản (Storage & Preservation Requirements)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Tùy chọn ghi chú bảo quản</span>
                </div>
                <input
                  type="text"
                  value={preservationRequirement}
                  onChange={(e) => setPreservationRequirement(e.target.value)}
                  placeholder="VD: Che bạt kín chống ướt, bảo quản khô ráo, nhiệt độ thường (20°C - 30°C), không xếp chồng..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium text-slate-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Thông Tin Chi Tiết Yêu Cầu */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">4</span>
                <span>Thông Tin Chi Tiết Yêu Cầu ({serviceType.startsWith('Sea Freight') ? 'Sea Freight' : serviceType})</span>
              </label>
            </div>

            {/* Dynamic Rendering of Specialized Forms */}
            {serviceType === 'Trucking' && (
              <TruckingInquiryForm
                specs={truckingSpecs}
                onChange={(newSpecs) => {
                  if (newSpecs.loadType !== truckingSpecs.loadType) {
                    if (newSpecs.loadType === 'LTL (Ghép hàng lẻ)') {
                      if (targetBudget.includes('45,000,000') || targetBudget.includes('48,000,000') || targetBudget.includes('chuyến')) {
                        setTargetBudget('2,500 VND / kg');
                      }
                    } else {
                      if (targetBudget.includes('2,500') || targetBudget.includes('/ kg')) {
                        setTargetBudget('45,000,000 VND / chuyến');
                      }
                    }
                  }
                  setTruckingSpecs(newSpecs);
                }}
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
                cargoClassification={cargoClassification}
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
                cargoClassification={cargoClassification}
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

            {serviceType === 'Rail Freight' && (
              <RailInquiryForm
                specs={railSpecs}
                onChange={setRailSpecs}
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
                cargoClassification={cargoClassification}
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
                cargoClassification={cargoClassification}
                pricingType={pricingType}
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

            {serviceType === 'Project Cargo' && (
              <ProjectInquiryForm
                specs={projectSpecs}
                onChange={setProjectSpecs}
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
                cargoClassification={cargoClassification}
              />
            )}
          </div>

          {/* SECTION 5: Yêu Cầu Phụ Phí & Điều Khoản Báo Giá (Local Charges & Surcharges) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">5</span>
                <span>
                  {serviceType === 'Warehousing'
                    ? 'Yêu Cầu Phụ Phí & Điều Khoản Báo Giá Kho Bãi (Operational Surcharges)'
                    : serviceType.startsWith('Sea Freight') || serviceType === 'Air Freight'
                    ? 'Yêu Cầu Phụ Phí & Điều Khoản Báo Giá (Local Charges & Surcharges)'
                    : 'Yêu Cầu Phụ Phí & Điều Khoản Báo Giá (Surcharges & Terms)'}
                </span>
              </label>
              <span className="text-[11px] font-semibold text-indigo-600">
                {quotationScope === 'ALL_IN' ? 'Gói Trọn Gói (All-in)' : 'Tách Mục (Itemized)'} • {requestedSurcharges.length} Phụ phí đã chọn
              </span>
            </div>

            <SurchargesSection
              serviceType={serviceType}
              warehouseType={serviceType === 'Warehousing' ? warehousingSpecs.warehouseType : undefined}
              cargoClassification={cargoClassification}
              quotationScope={quotationScope}
              onChangeQuotationScope={setQuotationScope}
              selectedSurcharges={requestedSurcharges}
              onChangeSelectedSurcharges={setRequestedSurcharges}
              surchargesNotes={surchargesNotes}
              onChangeSurchargesNotes={setSurchargesNotes}
              themeColor={currentServiceDef.themeColor}
            />
          </div>

          {/* SECTION 6: VAS (Dịch Vụ Giá Trị Gia Tăng) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">6</span>
                <span>Dịch Vụ Giá Trị Gia Tăng (VAS)</span>
              </label>
              <span className="text-[11px] font-semibold text-indigo-600">
                {selectedVASList.length} Dịch vụ đã chọn
              </span>
            </div>

            <VASSection
              items={getCurrentVASItems()}
              selectedVAS={selectedVASList}
              onToggleVAS={handleToggleVAS}
              serviceTitle={`VAS Phù Hợp Cho ${currentServiceDef.label}`}
              themeColor={currentServiceDef.themeColor}
            />
          </div>

          {/* SECTION 7: Ngân Sách, Tiền Tệ, Tỉ Giá Và Thời Hạn Báo Giá */}
          <div className="pt-2 border-t border-slate-100 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">7</span>
                <span>
                  {serviceType === 'Project Cargo'
                    ? (currency === 'VND' ? 'Giá Trị Dự Kiến & Thời Hạn Báo Giá' : 'Giá Trị Dự Kiến, Tiền Tệ & Thời Hạn Báo Giá')
                    : (currency === 'VND' ? 'Đơn Giá Kỳ Vọng & Thời Hạn Báo Giá' : 'Đơn Giá Kỳ Vọng, Tiền Tệ & Thời Hạn Báo Giá')}
                </span>
              </label>
              {currency !== 'VND' && (
                <div className="flex items-center gap-2 animate-in fade-in duration-200">
                  <span className="text-[11px] font-medium text-slate-500">Tỉ giá tham khảo:</span>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
                    <Banknote className="w-3 h-3 text-indigo-600" />
                    1 {currency} = {exchangeRate.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              )}
            </div>

            {/* Sub-grid 1: Currency, Target Budget, Exchange Rate, Conversion Preview */}
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                {/* Currency Selection */}
                <div className={currency === 'VND' ? 'sm:col-span-4' : 'sm:col-span-3'}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đơn Vị Tiền Tệ *</span>
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-800 shadow-xs"
                  >
                    {CURRENCY_OPTIONS_LOV.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Budget Input */}
                <div className={currency === 'VND' ? 'sm:col-span-8' : 'sm:col-span-4'}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{budgetConfig.label}</span>
                    </label>
                    {budgetConfig.badge && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                        {budgetConfig.badge}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={targetBudget}
                      onChange={(e) => handleTargetBudgetChange(e.target.value)}
                      placeholder={budgetConfig.placeholder}
                      className="w-full pl-3.5 pr-14 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-bold text-emerald-700 shadow-xs"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {currency}
                    </span>
                  </div>
                </div>

                {/* Exchange Rate Input - ONLY SHOWN FOR NON-VND */}
                {currency !== 'VND' && (
                  <div className="sm:col-span-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tỉ Giá Quy Đổi (1 {currency} / VND) *</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-normal">Tự động / Tùy chỉnh</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        1 {currency} =
                      </span>
                      <input
                        type="text"
                        value={exchangeRate ? exchangeRate.toLocaleString('vi-VN') : ''}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          setExchangeRate(digitsOnly ? parseInt(digitsOnly, 10) : 0);
                        }}
                        placeholder="25.450"
                        className="w-full pl-16 pr-12 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-800 shadow-xs text-right"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        VND
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Real-time Conversion Result Box - ONLY SHOWN FOR NON-VND */}
              {currency !== 'VND' && conversionCalc && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{conversionCalc.label}:</span>
                    <span className="font-black text-emerald-700 text-sm bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                      {conversionCalc.value}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    (Áp dụng theo tỉ giá: {conversionCalc.formula})
                  </span>
                </div>
              )}
            </div>

            {/* Sub-grid 2: Dates (Quote Expiry, Pickup, Delivery) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Hạn Chót Nhận Báo Giá *</span>
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {serviceType === 'Project Cargo'
                      ? 'Ngày Bắt Đầu Triển Khai *'
                      : 'Ngày Lấy Hàng Dự Kiến *'}
                  </span>
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    {serviceType === 'Project Cargo'
                      ? 'Thời Hạn Dự Án / Hạn Chót Vận Hành *'
                      : 'Hạn Chót Giao Hàng *'}
                  </span>
                </label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Title / Inquiry Label (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiêu Đề Yêu Cầu Báo Giá (Tùy chọn - Hệ thống tự động điền nếu để trống)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  cargoType && origin && destination
                    ? `VD: Vận chuyển ${cargoType} tuyến ${origin.split(',')[0]} - ${destination.split(',')[0]}`
                    : 'VD: Vận chuyển linh kiện điện tử KCN Tân Bình đi KCN Thăng Long'
                }
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium text-slate-900"
              />
            </div>

            {/* Scope of Work / Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi Chú Yêu Cầu Đặc Thù Bổ Sung
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi rõ yêu cầu đặc biệt về bảo quản, nâng hạ, bàn giao chứng từ POD gốc..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
              />
            </div>

            {/* File Attachments Upload Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tài Liệu / Bảng Kê / Hình Ảnh Đính Kèm (Packing List, MSDS, Bản vẽ...)</span>
                </label>
                <span className="text-[10.5px] text-slate-400 font-normal">
                  PDF, Excel, Word, Hình ảnh (Tối đa 25MB/tệp)
                </span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.png,.jpg,.jpeg,.zip,.rar"
                onChange={(e) => {
                  handleFileUpload(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />

              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-3.5 transition-all cursor-pointer text-center ${
                  isDraggingFile
                    ? 'border-indigo-500 bg-indigo-50/80 scale-[0.99]'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-indigo-600 hover:underline">
                      Nhấn để tải lên
                    </span>
                    <span className="text-slate-500"> hoặc kéo thả tài liệu vào đây</span>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">|</span>
                  <span className="text-[11px] text-slate-400">Hỗ trợ nhiều tệp</span>
                </div>
              </div>

              {/* Uploaded Files List */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2.5">
                  {attachments.map((att) => {
                    const isExcel = att.type === 'excel';
                    const isPdf = att.type === 'pdf';
                    const isWord = att.type === 'word';
                    const isImg = att.type === 'image';
                    const isArchive = att.type === 'archive';

                    return (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs group hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isExcel
                                ? 'bg-emerald-50 text-emerald-600'
                                : isPdf
                                ? 'bg-rose-50 text-rose-600'
                                : isWord
                                ? 'bg-blue-50 text-blue-600'
                                : isImg
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {isExcel && <FileSpreadsheet className="w-4 h-4" />}
                            {isPdf && <FileText className="w-4 h-4" />}
                            {isWord && <FileText className="w-4 h-4" />}
                            {isImg && <ImageIcon className="w-4 h-4" />}
                            {isArchive && <FileArchive className="w-4 h-4" />}
                            {!isExcel && !isPdf && !isWord && !isImg && !isArchive && <Paperclip className="w-4 h-4" />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate" title={att.name}>
                              {att.name}
                            </p>
                            <p className="text-[10.5px] text-slate-400">
                              {att.size} • {att.uploadedDate}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAttachment(att.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          title="Xóa tệp đính kèm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Supplier Matching Intelligence Preview */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/30 border border-indigo-400/30 text-indigo-300">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase text-indigo-300">AI Supplier Match</span>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-full font-bold">
                    {matchingSuppliersCount} Nhà Cung Cấp Đủ Điều Kiện
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Yêu cầu sẽ được gửi tới các đơn vị đã xác minh năng lực và hồ sơ phương tiện phù hợp.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">VT</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">MK</div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">GL</div>
              </div>
              <span className="text-[11px] text-indigo-200 font-semibold ml-1">+{matchingSuppliersCount - 3} suppliers</span>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Form chuẩn hóa 6 bước tinh gọn cho báo giá tự động
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Phát Hành Yêu Cầu Báo Giá (Send RFQ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Review & Confirmation Modal */}
      <InquirySummaryConfirmModal
        isOpen={showSummaryConfirmModal}
        inquiry={draftInquiry}
        currentUser={currentUser}
        matchingSuppliersCount={matchingSuppliersCount}
        isPublished={hasPublishedInquiry}
        onClose={handleCloseSummaryModal}
        onConfirm={handleConfirmFinalPublish}
      />
    </div>
  );
};
