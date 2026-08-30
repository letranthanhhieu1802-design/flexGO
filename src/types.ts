export type CompanyType = 'CUSTOMER' | 'SUPPLIER' | 'BOTH';

export type PublicNavTab = 'home' | 'lead-board' | 'supplier-profile' | 'hot-promotion' | 'company';
export type PublicTab = PublicNavTab;

export type WorkspaceView =
  // Customer Views
  | 'customer-inquiries'
  | 'customer-inquiry-detail'
  | 'customer-quotations'
  | 'customer-compare'
  | 'customer-suppliers'
  | 'customer-rates'
  | 'customer-contracts'
  // Supplier Views
  | 'supplier-leads'
  | 'supplier-quotations'
  | 'supplier-crm'
  | 'supplier-crm-customers'
  | 'supplier-crm-customer-detail'
  | 'supplier-pipeline'
  | 'supplier-analytics'
  | 'supplier-contracts'
  | 'supplier-profile-edit'
  // FlexCredit Views
  | 'flexcredit-wallet'
  | 'flexcredit-add'
  | 'flexcredit-transactions'
  // Settings Views
  | 'settings-profile'
  | 'settings-company'
  // Dual Hub View
  | 'dual-hub'
  // Legacy alias Settings
  | 'company-settings'
  | 'account-settings';

export type CurrentView = 
  | { type: 'public'; tab: PublicNavTab; params?: { subTab?: 'about' | 'pricing' | 'resources' | 'trust' | 'contact'; [key: string]: any } }
  | { type: 'workspace'; view: WorkspaceView; contextId?: string; params?: { inquiryCode?: string; [key: string]: any } };

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleTitle: string;
  companyName: string;
  companyType: CompanyType;
  badgeCount: {
    customerInquiries: number;
    customerQuotations: number;
    customerSuppliers: number;
    supplierLeads: number;
    supplierInquiries: number;
    supplierQuotations: number;
    supplierOpportunities: number;
    supplierCustomers: number;
    supplierActivities: number;
  };
}

export type UserPersona = UserProfile;

export type ServiceType = 
  | 'Trucking' 
  | 'Sea Freight (FCL)' 
  | 'Sea Freight (LCL)' 
  | 'Air Freight' 
  | 'Rail Freight'
  | 'Warehousing' 
  | 'Customs Clearance' 
  | 'Cross-border' 
  | 'Project Cargo'
  | 'Cold Chain';

export type QuotationScope = 'ALL_IN' | 'ITEMIZED';

export interface SurchargeItemDef {
  id: string;
  code: string;
  name: string;
  desc: string;
  category: 'POL' | 'POD' | 'FREIGHT' | 'INLAND' | 'GENERAL';
  categoryLabel: string;
  isPopularDefault?: boolean;
}

export type CargoClassification = 'General' | 'Reefer' | 'Hazmat';

export type InquiryStatus = 
  | 'Open' 
  | 'Quoted' 
  | 'Awarded' 
  | 'Closed';

export interface TruckingInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  loadType: 'FTL (Nguyên chuyến)' | 'LTL (Ghép hàng lẻ)';
  truckType: string;
  tonnageCategory: string;
  vehicleCount?: number;
  vehicleCountUnit?: string;
  // FTL specific payload & volume
  ftlWeightKg?: number | string;
  ftlVolumeCbm?: number | string;
  // LTL specific specifications
  ltlPieces?: number;
  ltlPackaging?: string;
  ltlDimensions?: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  ltlCbm?: number;
  ltlGrossWeightKg?: number;
  ltlChargeableWeightKg?: number;
  ltlStackable?: boolean;
  ltlShipmentCount?: number;
  ltlFrequencyUnit?: string;
  // Reefer specific specifications
  reeferTempRange?: string;
  reeferSetPoint?: string;
  reeferGensetRequired?: boolean;
  // Hazmat specific specifications
  dgClass?: string;
  dgUnNumber?: string;
  dgPackingGroup?: string;
  dgMsdsFileName?: string;
  // Common routing, locations & handling
  pickupPointsCount?: number;
  pickupLocations?: string[];
  deliveryPointsCount?: number;
  deliveryLocations?: string[];
  requestedLeadtime?: string;
  requestedLeadtimeNote?: string;
  multiDropPoints: number;
  loadingLaborRequired?: boolean;
  unloadingLaborRequired?: boolean;
  tailLiftRequired?: boolean;
  craneAssistanceRequired?: boolean;
  prohibitedHoursPassNeeded?: boolean;
  palletQuantity?: number;
  routeDistanceKm?: number;
  selectedVAS?: string[];
}

export interface OceanInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  tradeRole?: 'Xuất khẩu (Export)' | 'Nhập khẩu (Import)' | 'Nội địa (Domestic)';
  cargoValue?: number | string;
  cargoValueCurrency?: string;
  mode: 'FCL (Full Container)' | 'LCL (Hàng lẻ đóng ghép CFS)';
  originServiceTerm?: 'DOOR' | 'CY' | 'CFS';
  destinationServiceTerm?: 'DOOR' | 'CY' | 'CFS';
  pickupAddress?: string;
  deliveryAddress?: string;
  containerType?: '20ft General (20DC)' | '40ft General (40DC)' | '40ft High Cube (40HC)' | '20ft Reefer (20RF)' | '40ft Reefer (40RF)' | 'Open Top / Flat Rack' | 'ISO Tank';
  containerCount?: number;
  containerCountUnit?: string;
  cbmVolume?: number;
  grossWeightKgs?: number;
  // LCL specific specifications (dimensions, pieces, CBM, Chargeable Weight & Stackable)
  lclPieces?: number;
  lclPackaging?: string;
  lclDimensions?: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  lclCbm?: number;
  lclGrossWeightKg?: number;
  lclChargeableWeightKg?: number;
  lclRevenueTon?: number;
  lclStackable?: boolean;
  lclShipmentCount?: number;
  lclFrequencyUnit?: string;
  polPort: string; // Port of Loading
  podPort: string; // Port of Discharge
  incoterm: 'FOB' | 'CIF' | 'CFR' | 'EXW' | 'DAP' | 'DDP' | 'FCA';
  commodityCategory: 'General Cargo' | 'Electronics & High-Tech' | 'Garments & Footwear' | 'Furniture & Wood' | 'Dangerous Goods (DG/IMO)' | 'Perishables';
  dgClassIMO?: string;
  unNumber?: string;
  hsCode?: string;
  freeDemDetDaysRequested: number; // e.g. 14, 21 days
  packageType: 'Palletized' | 'Carton Boxes' | 'Wooden Crates' | 'Drums/Barrels' | 'Loose / Bulk';
  selectedVAS?: string[];
}

export interface AirInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  airServiceType: 'Air Freight / Cargo' | 'Express / Courier';
  tradeRole?: 'Xuất khẩu (Export)' | 'Nhập khẩu (Import)' | 'Nội địa (Domestic)';
  cargoValue?: number | string;
  cargoValueCurrency?: string;
  // Air Freight specific
  serviceLevel?: 'Standard Air Freight (3-4 days)' | 'Economy Air Cargo (5-7 days)' | 'Priority Direct Flight (1-2 days)';
  originServiceTerm?: 'DOOR' | 'AIRPORT';
  destinationServiceTerm?: 'DOOR' | 'AIRPORT';
  originAirport?: string; // SGN, HAN, DAD, HPH, etc.
  destinationAirport?: string; // NRT, ICN, FRA, LAX, SIN, etc.
  // Express / Courier specific
  expressPackageType?: 'Document / Letter (Tài liệu / Thư tín)' | 'Parcel / Package (Bưu phẩm / Hàng mẫu đóng hộp)';
  expressSpeedLevel?: 'Express Hỏa Tốc (1-2 ngày)' | 'Express Tiêu Chuẩn (2-3 ngày)' | 'Express Tiết Kiệm (4-5 ngày)';
  originPostalCode?: string;
  destinationPostalCode?: string;
  signatureRequired?: boolean;
  expressCustomsSupport?: boolean;
  // Common locations & package details
  pickupAddress?: string;
  deliveryAddress?: string;
  packageCount: number;
  grossWeightKgs: number;
  volumetricWeightKgs: number;
  chargeableWeightKgs: number;
  dimensionsCm: string; // L x W x H
  isDangerousGoods: boolean;
  iataDGClass?: string;
  isTemperatureSensitive: boolean;
  requiredTemperatureRange?: string;
  customsAtAirport: boolean;
  hsCode?: string;
  stackable?: boolean;
  shipmentCount?: number;
  frequencyUnit?: string;
  selectedVAS?: string[];
}

export interface ColdChainInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  temperatureCategory: 'Frozen (-25°C to -18°C: Kem, Thủy hải sản)' | 'Chilled (0°C to +4°C: Thịt tươi, Sữa)' | 'Cool (+8°C to +15°C: Rau củ, Trái cây)' | 'Pharma GDP (+2°C to +8°C / +15°C to +25°C)';
  vehicleOrContType: 'Xe tải lạnh 1.5T' | 'Xe tải lạnh 3.5T' | 'Xe tải lạnh 8T-15T' | 'Container Lạnh 20RF' | 'Container Lạnh 40RF';
  preCoolingRequested: boolean;
  realtimeGpsTempLogging: boolean;
  humidityControlPercent?: string;
  backupGensetIncluded: boolean;
  isPharmaCertifiedGDP: boolean;
  selectedVAS?: string[];
}

export interface WarehousingInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  warehousingLeaseModel?: 'OVERFLOW' | 'LONG_TERM'; // Kho tràn (Overflow / Seasonal) vs Kho dài hạn (Long-term / Dedicated)
  warehouseType: 'Kho thường (Grade A Dry)' | 'Kho ngoại quan (Bonded)' | 'Kho lạnh / Kho mát (Cold Storage)' | 'Kho hàng nguy hiểm (DG Warehouse)' | 'Kho TMĐT / Fulfillment' | 'Kho tự quản (Self-Storage)';
  billingUnitPreference?: 'm² (Diện tích sàn)' | 'Pallet (Vị trí Pallet/tháng)' | 'CBM (Thể tích thực m³)' | 'Order (Hoàn tất đơn hàng TMĐT)';
  storageAreaSqm?: number;
  palletPositions?: number;
  bufferPalletPositions?: number;
  bufferStorageQty?: number;
  bufferStorageUnit?: 'Pallet (Vị trí)' | 'Ngăn Kệ / Ô Kệ (Shelving Bins)' | 'Khay Nhựa / Thùng Tote (Totes)' | 'm² (Diện tích sàn)' | 'CBM (Thể tích thực m³)' | string;
  palletSpecsDescription?: string;
  cbmVolume?: number;
  dailyOrderCount?: number;
  rentalDurationMonths: number;
  skuCount?: number;
  inboundQty?: number;
  inboundUnit?: string;
  inboundPeriod?: 'Ngày' | 'Tuần' | 'Tháng';
  dailyInboundVolume?: string;
  outboundQty?: number;
  outboundUnit?: string;
  outboundPeriod?: 'Ngày' | 'Tuần' | 'Tháng';
  dailyOutboundVolume?: string;
  inventoryMethod?: 'FIFO (Nhập trước xuất trước)' | 'FEFO (Hạn gần xuất trước)' | 'Serial / Lot Tracking' | 'Tiêu chuẩn';
  wmsIntegrationNeeded?: boolean;
  humidityRequirement?: string;
  customHumidity?: string;
  inboundTemperatureState?: 'PRE_COOLED' | 'NEED_COOLING';
  bondedPurpose?: string;
  bondedHsCode?: string;
  bondedEstimatedValue?: number | string;
  bondedEstimatedValueCurrency?: 'USD' | 'VND' | 'EUR' | 'CNY' | 'JPY' | string;
  requiredVAS?: string[];
  selectedVAS?: string[];
}

export interface CustomsInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedVolume?: number;
  committedFrequency?: string;
  tradeRole?: 'Xuất khẩu (Export)' | 'Nhập khẩu (Import)';
  cargoValue?: number | string;
  cargoValueCurrency?: string;
  declarationType: 'Nhập khẩu kinh doanh (A11)' | 'Nhập gia công (E21)' | 'Nhập SXXK (E31)' | 'Xuất khẩu kinh doanh (B11)' | 'Xuất SXXK (E62)' | 'Tạm nhập tái xuất (G11)' | 'Phi mậu dịch (H11)';
  customsSubDepartment: string; // Chi cục Hải quan Cát Lái, Cảng Hải Phòng, Nội Bài, Tân Sơn Nhất, v.v.
  hsCodePrimary: string;
  itemDescription: string;
  invoiceValueUSD?: number;
  coFormRequested?: 'Form E (ASEAN-China)' | 'Form D (ASEAN)' | 'Form EUR.1 (EVFTA)' | 'Form AK (Korea)' | 'Form VJ (Japan)' | 'Không yêu cầu';
  specializedInspectionType?: 'Kiểm dịch thực vật / động vật' | 'Vệ sinh An toàn Thực phẩm' | 'Kiểm tra Hiệu suất Năng lượng' | 'Giám định Chất lượng Hàng hóa' | 'Không có';
  redChannelInspectionSupport: boolean;
  selectedVAS?: string[];
}

export interface CrossBorderInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  tradeRole?: 'Xuất khẩu (Export)' | 'Nhập khẩu (Import)';
  incoterms?: string;
  originTerm?: 'Door (Lấy tận nơi)' | 'Border (Giao tại bãi cửa khẩu)';
  destinationTerm?: 'Door (Giao tận nơi)' | 'Border (Nhận tại bãi cửa khẩu)';
  loadType?: 'FTL (Nguyên chuyến / Nguyên cont)' | 'LTL (Ghép hàng lẻ)';
  borderGate: string;
  originCity: string;
  destinationCity: string;
  pickupPointsCount?: number;
  pickupLocations?: string[];
  deliveryPointsCount?: number;
  deliveryLocations?: string[];
  multiDropPoints?: number;
  cargoMode: 'Xe liên vận chạy thẳng (Direct GMS)' | 'Sang tải / Đổi đầu kéo tại cửa khẩu (Transshipment)';
  customsScope?: 'Chỉ cước vận chuyển (Chủ hàng tự làm HQ)' | 'Thông quan Hải quan đầu VN' | 'Thông quan Trọn gói 2 đầu (VN + Nước bạn)';
  vehicleType?: string;
  vehicleCount?: number;
  shipmentCount?: number;
  frequencyUnit?: string;
  leadtimeSLA?: string;
  leadtimeNote?: string;
  customsAtBorderIncluded?: boolean;
  transitPermitGMSNeeded?: boolean;
  hsCode?: string;
  cargoValue?: number | string;
  cargoValueCurrency?: string;
  selectedVAS?: string[];
}

export interface RailInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  tradeRole?: 'Liên vận xuất khẩu (Export Rail)' | 'Liên vận nhập khẩu (Import Rail)' | 'Nội địa Bắc - Nam (Domestic Rail)';
  cargoValue?: number | string;
  cargoValueCurrency?: string;
  mode: 'FCL (Nguyên container ga - ga)' | 'LCL (Hàng lẻ đóng ghép kho ga)';
  originServiceTerm?: 'DOOR' | 'CY' | 'CFS';
  destinationServiceTerm?: 'DOOR' | 'CY' | 'CFS';
  pickupAddress?: string;
  deliveryAddress?: string;
  originStation: string;
  destinationStation: string;
  containerType?: 'Cont 20ft' | 'Cont 40ft HC' | 'Cont Lạnh (Reefer Rail)' | 'Toa xe thùng kín / bạt';
  containerCount?: number;
  containerCountUnit?: string;
  grossWeightKgs?: number;
  cbmVolume?: number;
  incoterm?: string;
  freeDemDetDaysRequested?: number;
  // LCL specific specifications (dimensions, pieces, CBM, Chargeable Weight & Stackable)
  lclPieces?: number;
  lclPackaging?: string;
  lclDimensions?: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  lclCbm?: number;
  lclGrossWeightKg?: number;
  lclChargeableWeightKg?: number;
  lclRevenueTon?: number;
  lclStackable?: boolean;
  lclShipmentCount?: number;
  lclFrequencyUnit?: string;
  drayageFirstMile?: boolean;
  drayageLastMile?: boolean;
  selectedVAS?: string[];
}

export interface ProjectInquirySpecs {
  pricingType?: PricingType;
  contractTerm?: string;
  committedFrequency?: string;
  projectType: 'Hàng siêu trường siêu trọng (OOG)' | 'Vận chuyển thiết bị toàn bộ nhà máy' | 'Đa phương thức kết hợp (Multimodal)';
  cargoDimensions?: string;
  maxUnitWeightTons?: number;
  routeSurveyRequired: boolean;
  heavyLashingRequired: boolean;
  siteEngineerRequired: boolean;
  specialPermitRequired: boolean;
  selectedVAS?: string[];
}

export interface ServiceSpecificSpecs {
  trucking?: TruckingInquirySpecs;
  ocean?: OceanInquirySpecs;
  air?: AirInquirySpecs;
  coldChain?: ColdChainInquirySpecs;
  warehousing?: WarehousingInquirySpecs;
  customs?: CustomsInquirySpecs;
  crossBorder?: CrossBorderInquirySpecs;
  rail?: RailInquirySpecs;
  project?: ProjectInquirySpecs;
}

export interface InquiryAttachment {
  id: string;
  name: string;
  size: string;
  type?: 'pdf' | 'excel' | 'word' | 'image' | 'archive' | 'doc' | string;
  uploadedDate: string;
  url?: string;
}

export interface InquiryItem {
  id: string;
  code: string; // e.g. INQ-00124
  leadCode?: string; // e.g. LG-00124 on Lead Board
  title: string;
  customerCompany: string;
  contactPerson: string;
  serviceType: ServiceType;
  pricingType?: PricingType;
  contractTerm?: string;
  committedVolume?: string;
  selectedVAS?: string[];
  quotationScope?: QuotationScope;
  requestedSurcharges?: string[];
  surchargesNotes?: string;
  cargoClassification?: CargoClassification;
  temperatureRequirement?: string;
  preservationRequirement?: string;
  dgClassIMO?: string;
  unNumber?: string;
  packingGroup?: string;
  flashPoint?: string;
  msdsFileName?: string;
  origin: string;
  destination: string;
  route?: string;
  originServiceTerm?: string;
  destinationServiceTerm?: string;
  cargoType: string;
  industry?: string;
  hsCode?: string;
  tradeRole?: string;
  cargoValue?: number | string;
  cargoValueCurrency?: string;
  packaging?: string;
  weightVolume: string;
  ftlWeightKg?: number | string;
  ftlVolumeCbm?: number | string;
  cargoWeight?: string;
  cargoDimensions?: string;
  incoterms?: string;
  targetBudget?: string;
  currency?: 'VND' | 'USD' | 'EUR' | 'CNY' | 'JPY' | string;
  exchangeRate?: number;
  pickupDate: string;
  deliveryDate: string;
  createdDate: string;
  expiryDate?: string;
  status: InquiryStatus;
  responsesCount: number;
  viewsCount?: number;
  description: string;
  specialRequirements?: string[];
  invitedSuppliers?: string[];
  serviceSpecs?: ServiceSpecificSpecs;
  attachments?: InquiryAttachment[];
}

export interface ServiceCostBreakdown {
  trucking?: {
    baseFreightVND: number;
    fuelBAFSurchargeVND: number;
    tollBOTFeesVND: number;
    multiDropFeeVND: number;
    loadingLaborFeeVND: number;
    tailLiftFeeVND: number;
  };
  ocean?: {
    oceanFreightUSD: number;
    exchangeRate: number;
    thcPolVND: number;
    thcPodVND: number;
    blSealVgmFeesVND: number;
    bafLssSurchargeVND: number;
    freeDemDetDaysOffered: number;
  };
  air?: {
    ratePerKgUSD: number;
    chargeableWeightKg: number;
    fscFuelSurchargeUSD: number;
    sscSecuritySurchargeUSD: number;
    awbDocumentFeeVND: number;
    airportScreeningFeeVND: number;
    terminalHandlingFeeVND: number;
  };
  coldChain?: {
    reeferBaseFreightVND: number;
    gensetRunningFuelVND: number;
    dataLoggerCertificateVND: number;
    plugInDepotFeeVND: number;
  };
  warehousing?: {
    storageRateMonthlyVND: number;
    inboundOutboundHandlingVND: number;
    palletManagementVND: number;
    vasPackagingLabellingVND: number;
    wmsSystemFeeVND: number;
  };
  customs?: {
    customsDeclarationFeeVND: number;
    additionalLinesFeeVND: number;
    coIssuanceFeeVND: number;
    specializedInspectionFeeVND: number;
    redChannelHandlingFeeVND: number;
  };
  crossBorder?: {
    vietnamLegFreightVND: number;
    internationalLegFreightVND: number;
    borderTransshipmentFeeVND: number;
    borderClearanceFeeVND: number;
    gmsPermitFeeVND: number;
  };
}

export type QuotationStatus = 
  | 'Draft' 
  | 'Sent' 
  | 'Viewed' 
  | 'Under Review' 
  | 'Negotiating' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Expired';

export interface QuotationItem {
  id: string;
  code: string; // e.g. QUO-89201
  inquiryCode: string;
  inquiryTitle: string;
  customerCompany: string;
  supplierId: string;
  supplierName: string;
  supplierLogo?: string;
  supplierRating: number;
  serviceType: ServiceType;
  route: string;
  
  // Itemized breakdown
  currency: 'VND' | 'USD';
  unitPrice?: number;
  unitPriceDisplay?: string;
  unitMeasure?: string;
  unitBaseFreight?: number;
  unitFuelSurcharge?: number;
  unitHandlingFee?: number;
  unitDocumentationFee?: number;
  unitOtherCharges?: number;
  tenderVolumeQty?: number;
  baseFreight: number;
  fuelSurcharge: number;
  handlingFee: number;
  documentationFee: number;
  otherCharges: number;
  otherChargesNote?: string;
  totalPrice: number;

  costBreakdown?: ServiceCostBreakdown;

  transitTimeDays: number;
  transitTimeDisplay: string;
  paymentTerms: string; // e.g. "Net 30 Days", "Net 45 Days"
  validUntil: string;
  status: QuotationStatus;
  notes: string;
  freeDemurrageDays?: number;
  co2EstimateKg?: number;
  createdAt: string;
  isBestPrice?: boolean;
  isFastestTransit?: boolean;
  isBestTerms?: boolean;
  isHighestRating?: boolean;
}

export type SupplierCategory = 'All' | 'Preferred' | 'Active' | 'Potential' | 'Inactive' | 'Current Supplier';

export type CustomerSupplierSourceType = 
  | 'AWARDED_QUOTE'            // 1. Awarded from customer inquiries
  | 'DIRECT_PROFILE_REQUEST'   // 2. Direct RFQ requested from supplier profile
  | 'CURRENT_SUPPLIER';        // 3. Current operational supplier declared by customer (offline/not yet registered on flexGO)

export interface SupplierSourceDetails {
  sourceType: CustomerSupplierSourceType;
  sourceLabel: string;
  inquiryCode?: string;
  quoteCode?: string;
  rateCode?: string;
  contractCode?: string;
  declaredDate?: string;
  isRegisteredOnFlexGo?: boolean;
  notes?: string;
}

export interface SupplierCompany {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  category: SupplierCategory;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  services: ServiceType[];
  hubLocations: string[];
  fleetSize: string;
  warehouseArea: string;
  establishedYear: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  totalQuotesSubmitted: number;
  awardedDealsCount: number;
  onTimeDeliveryRate: string;
  description: string;
  certifications: string[];
  preferredRoutes: string[];
  profileViews?: number;
  monthlyViews?: number;
  todayViews?: number;
  viewGrowth?: string;
  
  // Specific properties for Customer's My Suppliers (mirroring MiniCRM)
  source?: CustomerSupplierSourceType;
  sourceDetails?: SupplierSourceDetails;
  hasFlexGoAccount?: boolean; // true if registered supplier on flexGO, false if Current Supplier declared offline
  taxId?: string;
  headquartersAddress?: string;
  annualSpendVND?: number;
  annualSpendDisplay?: string;
  activeContractsCount?: number;
  inquiriesHandledCount?: number;
  lastInteractionDate?: string;
  operatingStatus?: 'Active' | 'PendingLink' | 'Reviewing' | 'Archived';
}

export type LeadStatus = 
  | 'Open' 
  | 'Quoted' 
  | 'Won' 
  | 'Lost' 
  | 'Closed';

export type PricingType = 'SPOT' | 'CONTRACT';

export type SupplierLeadSourceType = 
  | 'SAVED'        // 1. Inquiries mà supplier lưu khi lướt trên bảng leadboard hoặc trong my customer (tab inquiries)
  | 'QUOTED'       // 2. Inquiries mà supplier báo giá trên lead board
  | 'UNLOCKED'     // 3. Inquiries mà supplier dùng flexcredit để mở khóa
  | 'DIRECT_RFQ';  // 4. Inquiries đến từ Direct RFQ trong supplier profile

export interface SupplierLeadItem {
  id: string;
  code: string; // e.g. LG-00124
  customerCompany: string;
  contactName: string;
  contactRole: string;
  contactPhone?: string;
  contactEmail?: string;
  taxId?: string;
  serviceType: ServiceType;
  origin: string;
  destination: string;
  route: string;
  pricingType: PricingType; // 'SPOT' (Theo lô / chuyến) | 'CONTRACT' (Hợp đồng định kỳ)
  contractTerm?: string; // e.g. 'Hợp đồng 12 tháng', 'Hợp đồng 6 tháng', 'Chuyến lẻ'
  volumeDisplay: string; // Sản lượng / Tần suất: e.g. '30 chuyến / tháng', '4 Cont 40HC', '2,500 m²'
  unitPriceVND?: number; // Đơn giá số (nếu có)
  unitPriceDisplay: string; // Đơn giá dự kiến: e.g. '16,600,000 ₫ / chuyến', '70,000,000 ₫ / cont'
  estimatedValueVND: number; // Tổng giá trị dự kiến
  estimatedValueDisplay: string;
  createdDate: string;
  dueDate?: string; // Hạn chót nộp báo giá (Due Date)
  status: LeadStatus;
  inquiryCode?: string;
  cargoDetails: string;
  urgency: 'Standard' | 'Urgent' | 'High Value';
  matchScore: number; // e.g. 96%
  quotesCount?: number; // Số lượng báo giá đã nộp
  viewsCount?: number;  // Số lượt mở xem
  isUnlocked?: boolean; // Trạng thái mở khóa thông tin liên hệ
  isSaved?: boolean;    // Đã lưu lead vào My Leads để theo dõi
  savedAt?: string;     // Thời điểm lưu
  source?: SupplierLeadSourceType; // Nguồn của lead trong My Leads
  sourceOrigin?: 'LEAD_BOARD' | 'MY_CUSTOMER_INQUIRY' | 'DIRECT_RFQ'; // Gốc phát sinh lưu/mở khóa
  sourceNotes?: string; // Ghi chú nguồn
  isDirectRfq?: boolean; // Yêu cầu báo giá trực tiếp từ trang hồ sơ Supplier
}

export type OpportunityStage = 
  | 'Open' 
  | 'Quoted' 
  | 'Won' 
  | 'Lost' 
  | 'Closed'
  | 'NEW'
  | 'QUALIFIED'
  | 'QUOTATION_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'CLOSED';

export type PipelineStage = 'Open' | 'Quoted' | 'Won' | 'Lost' | 'Closed';

export interface OpportunityItem {
  id: string;
  code?: string;
  title: string;
  customerCompany: string;
  contactPerson: string;
  serviceType: ServiceType;
  route: string;
  estimatedValue: number;
  estimatedValueDisplay?: string;
  currency: 'VND' | 'USD';
  stage: PipelineStage | OpportunityStage;
  owner: string;
  expectedCloseDate: string;
  probability: number; // 0-100
  notes: string;
  nextAction?: string;
  quotationCode?: string;
  leadCode?: string;
  inquiryCode?: string;
  source?: SupplierLeadSourceType;
  lastUpdated: string;
}

export type CustomerSourceType = 
  | 'FLEXCREDIT_UNLOCKED'     // 1. Mở khóa thông tin từ bảng Lead Board bằng FlexCredit
  | 'DIRECT_PROFILE_REQUEST'  // 2. Inbound RFQ trực tiếp từ Supplier Profile / Landing Page (Miễn phí mở khóa 0 Credit)
  | 'AWARDED_QUOTE';          // 3. Khách hàng đã trao thầu (Awarded) báo giá của Supplier

export interface CRMCustomerSourceDetails {
  sourceType: CustomerSourceType;
  sourceLabel: string;
  inquiryCode?: string;
  leadCode?: string;
  quoteCode?: string;
  contractCode?: string;
  profileName?: string;
  profileUrl?: string;
  unlockedCostCredits?: number;
  unlockedDate?: string;
  isCreditExempt?: boolean; // Miễn phí credit đối với Inbound Profile & Awarded
  notes?: string;
}

export interface CRMCustomer {
  id: string;
  companyName: string;
  companyShortName?: string;
  englishName?: string;
  taxId?: string;
  legalRepresentative?: string;
  establishedYear?: number | string;
  businessType?: string;
  registeredCapital?: string;
  employeeScale?: string;
  website?: string;
  kycStatus?: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  verifiedDate?: string;
  registrationDate?: string;
  flexGoMemberTier?: string;
  industry: string;
  location: string;
  headquartersAddress?: string;
  factoryAddress?: string;
  warehouseAddress?: string;
  contactPerson: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  secondaryContactPerson?: string;
  secondaryContactRole?: string;
  secondaryContactEmail?: string;
  secondaryContactPhone?: string;
  source: CustomerSourceType;
  sourceDetails?: CRMCustomerSourceDetails;
  openOpportunitiesCount: number;
  inquiriesCount?: number;
  estimatedValueVND?: number;
  estimatedValueDisplay?: string;
  totalRevenueVND: number;
  totalRevenueDisplay: string;
  lastActivity: string;
  status: 'Active' | 'Prospect' | 'VIP' | 'Dormant';
  notes: string;
  address: string;
  primaryCargo?: string;
  cargoSpecialProps?: string;
  keyRoutes?: string[];
  preferredModes?: string[];
  monthlyVolumeEst?: string;
  annualVolumeEst: string;
  slaRequirements?: string[];
  preferredPaymentTerms?: string;
  operatingMarkets?: string[];
  createdDate?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  timeDisplay: string;
  type: 'quotation' | 'inquiry' | 'meeting' | 'call' | 'created' | 'deal';
  title: string;
  description: string;
  actor: string;
  relatedEntityCode?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  message?: string;
  timeAgo?: string;
  timestamp?: string;
  read: boolean;
  type: 'quote_received' | 'inquiry_matched' | 'lead_new' | 'quote_accepted' | 'status_update' | 'quotation' | 'deal' | 'lead' | 'system';
  actionTarget?: CurrentView;
  linkTo?: CurrentView;
}

// ----------------------------------------------------
// CONTRACT MANAGEMENT TYPES
// ----------------------------------------------------
export type ContractStatus = 
  | 'Draft' 
  | 'Pending Signature' 
  | 'Active' 
  | 'Completed' 
  | 'Terminated';

export interface ContractMilestone {
  id: string;
  title: string;
  description: string;
  percentage: number;
  amountVND: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  dueDate: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedDate: string;
}

export interface ContractItem {
  id: string;
  code: string; // e.g. CTR-2026-089
  title: string;
  inquiryCode: string;
  quotationCode: string;
  customerName: string;
  customerContact: string;
  customerCompany: string;
  supplierName: string;
  supplierContact: string;
  supplierCompany: string;
  serviceType: ServiceType;
  route: string;
  totalValueVND: number;
  totalValueDisplay: string;
  currency: 'VND' | 'USD';
  status: ContractStatus;
  effectiveDate: string;
  expiryDate: string;
  signedDate?: string;
  paymentTerms: string;
  depositAmountVND: number;
  depositStatus: 'Paid' | 'Pending' | 'Waived';
  milestones: ContractMilestone[];
  documents: ContractDocument[];
  termsSummary: string[];
  cargoVolume: string;
  transitDays: number;
  insuranceIncluded: boolean;
}

// ----------------------------------------------------
// FLEXCREDIT WALLET & BILLING TYPES
// ----------------------------------------------------
export interface FlexCreditWallet {
  balanceCredits: number;
  balanceVND: number;
  bonusCredits: number;
  tierName: 'Standard' | 'Silver' | 'Gold' | 'Enterprise Platinum';
  discountOnLeads: number; // percentage
  monthlySpentCredits: number;
  autoTopUpEnabled: boolean;
  autoTopUpThreshold: number;
  autoTopUpAmount: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  priceVND: number;
  priceDisplay: string;
  popular?: boolean;
  tag?: string;
  features: string[];
  ratePerCredit: number;
}

export type TransactionType = 
  | 'TOP_UP' 
  | 'LEAD_UNLOCK' 
  | 'INQUIRY_BOOST' 
  | 'QUOTATION_FEE' 
  | 'CONTRACT_ESCROW' 
  | 'REFUND' 
  | 'PROMO_BONUS';

export interface CreditTransaction {
  id: string;
  txCode: string;
  type: TransactionType;
  title: string;
  description: string;
  creditsChange: number; // positive or negative
  amountVND?: number;
  date: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Failed';
  referenceCode?: string;
  paymentMethod?: string;
  invoiceNumber?: string;
}

export type InternationalTradeLaneRegion = 
  | 'NorthAmerica'    // Bắc Mỹ (2,692)
  | 'Asia'            // Châu Á (4,011)
  | 'Europe'          // Châu Âu (3,037)
  | 'Oceania'         // Châu Đại Dương (1,523)
  | 'Africa'          // Châu Phi (1,640)
  | 'LatinAmerica'    // Mỹ La Tinh và Caribê (1,890)
  | 'MiddleEast'      // Trung Đông (2,365)
  | 'Domestic';       // Tuyến Nội Địa

export interface InternationalTradeLaneMeta {
  id: InternationalTradeLaneRegion;
  label: string;
  count: number;
  englishLabel: string;
  nameVi?: string;
  nameEn?: string;
  icon?: string;
  popularPorts: string[];
  shippingLines: string[];
}

export interface SalesSpecialistProfile {
  id: string;
  name: string;
  vietnameseName: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  avatarUrl?: string;
  avatarInitial: string;
  phone: string;
  zaloPhone: string;
  email: string;
  yearsOfExperience: number;
  rating: number;
  reviewsCount: number;
  responseTime: string;
  location: string;
  languages: string[];
  verifiedStatus: boolean;
  onlineStatus: 'ONLINE' | 'IN_MEETING' | 'OFFLINE';
  bio: string;
  motto: string;
  specialties: string[];
  profileViews?: number;
  monthlyViews?: number;
  todayViews?: number;
  viewGrowthPercentage?: number;
  viewerInteractions?: {
    rfqRequestsCount: number;
    consultationsCount: number;
    rateDownloadsCount: number;
    viewsLast7Days: number[];
  };
  keyMetrics: {
    shipmentsCount: string;
    revenueManagedVND: string;
    onTimeDeliveryRate: string;
    activeClientsCount: number;
    satisfactionRate: string;
    rfqResponseAvgMins: number;
  };
  achievements: {
    id: string;
    year: string;
    title: string;
    organization: string;
    description: string;
    badgeIcon: string;
  }[];
  services: {
    id: string;
    serviceType: ServiceType;
    title: string;
    highlight: string;
    description: string;
    keySpecs: string[];
    suitableFor: string;
    slaCommitment: string;
    pricingSummary: string;
  }[];
  rateCard: {
    id: string;
    category: 'Trucking' | 'Ocean' | 'ColdChain' | 'Air' | 'Customs' | 'Warehousing' | 'CrossBorder';
    routeOrService: string;
    tradeLaneRegion?: InternationalTradeLaneRegion;
    shippingLine?: string;
    pol?: string; // Port of Loading
    pod?: string; // Port of Discharge
    usdPrice?: number;
    vehicleOrUnit: string;
    transitTime: string;
    benchmarkPriceVND: number;
    benchmarkPriceDisplay: string;
    backhaulPriceDisplay?: string;
    distanceKm?: string;
    priceNotes: string;
    includedPerks: string[];
    isPopular?: boolean;
    serviceTier?: 'Standard' | 'Express' | 'Economy' | 'Direct' | 'HeavyDuty';
    costBreakdown?: {
      baseFreight: string;
      fuelAndTolls: string;
      insurance: string;
      handling: string;
    };
    surcharges?: {
      name: string;
      price: string;
      note?: string;
    }[];
  }[];
  testimonials: {
    id: string;
    clientName: string;
    clientRole: string;
    clientCompany: string;
    avatarInitial: string;
    rating: number;
    date: string;
    routeHandled: string;
    content: string;
  }[];
  certifications: string[];
}

export type RatePricingUnit = 
  | 'VND / Chuyến'
  | 'VND / Tấn'
  | 'VND / Kg'
  | 'VND / CBM'
  | 'USD / Cont 20ft'
  | 'USD / Cont 40ft'
  | 'USD / CBM'
  | 'USD / Kg'
  | 'USD / Chuyến'
  | 'VND / Cont 20ft'
  | 'VND / Cont 40ft'
  | 'VND / m² / Tháng'
  | 'VND / Pallet / Ngày'
  | 'VND / Tờ khai'
  | 'VND / Kiện';

export type RateSourceType = 'MANUAL_ENTRY' | 'AWARDED_INQUIRY';
export type RateStatus = 'Active' | 'ExpiringSoon' | 'Expired' | 'Draft';

export interface RateSurchargeItem {
  id: string;
  name: string;
  amount: number;
  currency: 'VND' | 'USD';
  unit: string;
  includedInBaseRate: boolean;
  isMandatory: boolean;
}

export interface CustomerRateItem {
  id: string;
  code: string;
  serviceType: ServiceType;
  title: string;
  origin: string;
  destination: string;
  routeDisplay?: string;
  cargoType: string;
  equipmentOrVehicleType?: string;
  loadType?: string;
  
  // Rate details
  baseRateAmount: number;
  baseRateCurrency: 'VND' | 'USD';
  pricingUnit: RatePricingUnit | string;
  rateDisplay: string;
  allInclusive: boolean;
  vatPercent?: number;
  surcharges?: RateSurchargeItem[];
  
  // Service Specs corresponding with Customer Inquiries
  specs?: ServiceSpecificSpecs;
  truckingSpecs?: TruckingInquirySpecs;
  oceanSpecs?: OceanInquirySpecs;
  airSpecs?: AirInquirySpecs;
  coldChainSpecs?: ColdChainInquirySpecs;
  warehousingSpecs?: WarehousingInquirySpecs;
  customsSpecs?: CustomsInquirySpecs;
  crossBorderSpecs?: CrossBorderInquirySpecs;
  
  // Supplier & Contract
  supplierId?: string;
  supplierName: string;
  supplierTaxId?: string;
  supplierContact?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  contractCode?: string;
  sourceType: RateSourceType;
  linkedInquiryCode?: string;
  linkedQuoteId?: string;
  
  // SLA & Terms
  paymentTerms: string;
  transitTime?: string;
  freeDemDetDays?: number;
  validFrom: string;
  validTo: string;
  status: RateStatus;
  
  // Extra
  notes?: string;
  createdDate: string;
  updatedDate: string;
  documentCount?: number;
}

export type PromotionCategory = 
  | 'Trucking' 
  | 'Sea Freight' 
  | 'Cold Chain' 
  | 'Air Freight' 
  | 'Customs' 
  | 'Warehousing' 
  | 'Cross-border';

export type PromotionBadgeType = 
  | 'FLASH_SALE' 
  | 'BACKHAUL_DEAL' 
  | 'HOT_ROUTE' 
  | 'VOLUME_DISCOUNT' 
  | 'LIMITED_CAPACITY' 
  | 'EXCLUSIVE_FLEXGO';

export interface HotPromotionItem {
  id: string;
  code: string;
  title: string;
  badgeType: PromotionBadgeType;
  badgeLabel: string;
  discountPercent: number;
  originalPriceVND: number;
  originalPriceDisplay: string;
  promotionalPriceVND: number;
  promotionalPriceDisplay: string;
  pricingUnit: string;
  
  // Route / Location
  serviceType: ServiceType;
  category: PromotionCategory;
  origin: string;
  destination: string;
  routeDisplay: string;
  transitTime: string;
  
  // Vehicle / Equipment / Scope
  vehicleOrUnit: string;
  cargoSuitability: string;
  availableCapacity: string;
  
  // Supplier & Salesman (PIC) Info
  specialistId: string;
  specialistName: string;
  specialistVietnameseName: string;
  specialistTitle: string;
  specialistAvatarInitial: string;
  specialistPhone: string;
  specialistRating: number;
  specialistReviewsCount: number;
  companyId: string;
  companyName: string;
  companyLogo: string;
  
  // Validity & Conditions
  validFrom: string;
  validUntil: string;
  daysRemaining: number;
  slotsRemaining: number;
  totalSlots: number;
  minOrderQuantity?: string;
  paymentTerms: string;
  
  // Highlights & Perks
  highlights: string[];
  includedPerks: string[];
  notes?: string;
  
  // Stats
  viewsCount: number;
  interestedCount: number;
  bookedCount: number;
  isFeatured?: boolean;
}



