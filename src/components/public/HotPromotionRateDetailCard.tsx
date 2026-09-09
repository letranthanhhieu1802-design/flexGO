import React, { useState, useMemo } from 'react';
import {
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  Tag,
  Clock,
  CheckCircle2,
  Building2,
  BadgeCheck,
  Phone,
  Star,
  ExternalLink,
  Bookmark,
  Calendar,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Flame,
  Check,
  X,
  FileText,
  Receipt,
  Zap,
  Camera,
  Eye,
  MapPin,
  ShieldAlert,
  Boxes,
  Maximize2,
  ChevronRight,
  ShieldCheck,
  TrainTrack
} from 'lucide-react';
import { HotPromotionItem, CurrentView } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { FULL_MOCK_CAPABILITY_SERVICES, DeclaredServiceModelItem } from '../../data/mockDeclaredServices';
import { 
  CapabilityRouteItem, 
  WarehousePhotoItem, 
  WarehouseTechSpecs, 
  WarehouseDetailModalData, 
  WAREHOUSE_SUGGESTED_SURCHARGES, 
  WAREHOUSE_SUGGESTED_VAS, 
  getWarehouseTechSpecCategories
} from '../supplier/SupplierServiceCapabilityModal';
import { WarehousePricingContinuousTable } from '../supplier/WarehousePricingContinuousTable';
import { WarehouseDetailModal } from '../supplier/WarehouseDetailModal';
import { OceanFclCostMatrixModal, OCEAN_FCL_GENERAL_SURCHARGES_LOV, OCEAN_FCL_GENERAL_VAS_LOV } from '../supplier/OceanFclCostMatrixModal';
import { OceanLclCostMatrixModal } from '../supplier/OceanLclCostMatrixModal';
import { TruckingFtlCostMatrixModal, TRUCKING_SECTION_1_SURCHARGES_LOV, TRUCKING_SECTION_2_VAS_LOV } from '../supplier/TruckingFtlCostMatrixModal';
import { TruckingLtlCostMatrixModal } from '../supplier/TruckingLtlCostMatrixModal';
import { RailFclCostMatrixModal } from '../supplier/RailFclCostMatrixModal';
import { RailLclCostMatrixModal } from '../supplier/RailLclCostMatrixModal';
import { AirCargoCostMatrixModal } from '../supplier/AirCargoCostMatrixModal';
import { AirExpressCostMatrixModal } from '../supplier/AirExpressCostMatrixModal';
import { CrossBorderFtlCostMatrixModal } from '../supplier/CrossBorderFtlCostMatrixModal';
import { CrossBorderLtlCostMatrixModal } from '../supplier/CrossBorderLtlCostMatrixModal';

interface HotPromotionRateDetailCardProps {
  item: HotPromotionItem;
  onNavigate: (view: CurrentView) => void;
  onBookPromotion: (item: HotPromotionItem) => void;
  onToggleBookmark: (id: string, title: string) => void;
  isBookmarked: boolean;
}

export const HotPromotionRateDetailCard: React.FC<HotPromotionRateDetailCardProps> = ({
  item,
  onNavigate,
  onBookPromotion,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [selectedPhotoForPreview, setSelectedPhotoForPreview] = useState<WarehousePhotoItem | null>(null);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);

  // Sub-tabs for Warehouse
  const [warehouseActiveTab, setWarehouseActiveTab] = useState<'pricing' | 'techSpecs' | 'photos'>('pricing');
  const [activeTechCategory, setActiveTechCategory] = useState<string>('structure');

  // Container configuration tab for Ocean FCL
  const [activeOceanContTab, setActiveOceanContTab] = useState<string>('cont-20dc');

  // Vehicle configuration tab for Trucking FTL
  const [activeTruckVehicleTab, setActiveTruckVehicleTab] = useState<string>('truck-5t');

  // 1. Resolve declaredModel and declaredRoute from Tab 3 Data (Supplier Profile Capability Tree)
  const { declaredModel, declaredRoute } = useMemo(() => {
    let model: DeclaredServiceModelItem | undefined = item.declaredModel;
    let route: CapabilityRouteItem | undefined = item.declaredRoute;

    if (model && route) {
      return { declaredModel: model, declaredRoute: route };
    }

    // Lookup matching route by routeCode or ID across all declared models in Tab 3
    for (const m of FULL_MOCK_CAPABILITY_SERVICES) {
      const foundR = m.routes?.find(r => r.routeCode === item.code || r.id === item.id);
      if (foundR) {
        return { declaredModel: m, declaredRoute: foundR };
      }
    }

    // Fallback: match by service category / model id
    const serviceKey = (item.serviceGroup || item.category || item.serviceType || '').toLowerCase();
    const matchedM = FULL_MOCK_CAPABILITY_SERVICES.find(m => {
      const id = m.id.toLowerCase();
      if (serviceKey.includes('kho') || serviceKey.includes('warehousing')) {
        if (serviceKey.includes('lạnh') || serviceKey.includes('cold')) return id.includes('cld') || id.includes('cold');
        if (serviceKey.includes('ngoại quan') || serviceKey.includes('bonded')) return id.includes('bon');
        if (serviceKey.includes('tmđt') || serviceKey.includes('ecom')) return id.includes('ecom') || id.includes('ful');
        return id.startsWith('wh-');
      }
      if (serviceKey.includes('biển') || serviceKey.includes('sea')) {
        return id.startsWith('sea-') || id.startsWith('ocn-');
      }
      if (serviceKey.includes('không') || serviceKey.includes('air')) {
        return id.startsWith('air-');
      }
      if (serviceKey.includes('sắt') || serviceKey.includes('rail')) {
        return id.startsWith('rail-');
      }
      if (serviceKey.includes('quan') || serviceKey.includes('customs')) {
        return id.startsWith('cst-');
      }
      if (serviceKey.includes('biên') || serviceKey.includes('cross')) {
        return id.startsWith('cb-');
      }
      if (serviceKey.includes('án') || serviceKey.includes('project')) {
        return id.startsWith('prj-');
      }
      if (serviceKey.includes('lạnh') || serviceKey.includes('cold')) {
        return id.includes('cld') || id.includes('cold') || id.includes('ref');
      }
      return id.startsWith('trk-');
    }) || FULL_MOCK_CAPABILITY_SERVICES[0];

    return {
      declaredModel: matchedM,
      declaredRoute: matchedM?.routes?.[0] || undefined
    };
  }, [item]);

  // 2. Resolve Specialist PIC details
  const specialist = useMemo(() => {
    return mockSalesSpecialists.find(s => s.id === item.specialistId) || {
      id: item.specialistId || 'sales-minh-tran',
      vietnameseName: item.specialistVietnameseName || 'Trần Văn Minh',
      title: item.specialistTitle || 'Senior Key Account Manager & Freight Solutions Director',
      companyName: item.companyName || 'VinaTrans Logistics JSC',
      phone: item.specialistPhone || '+84 (0) 908 123 456',
      email: 'sales@' + (item.companyName || 'vinatrans').toLowerCase().replace(/[^a-z0-9]/g, '') + '.vn',
      avatarInitial: item.specialistAvatarInitial || 'TM',
      rating: item.specialistRating || 4.95,
      reviewsCount: item.specialistReviewsCount || 184,
      verifiedStatus: true,
      motto: 'Tối ưu chi phí thực tế – Đảm bảo hành trình chuẩn xác từng giờ',
    };
  }, [item]);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(item.specialistPhone || specialist.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getServiceIcon = () => {
    const s = (item.serviceGroup || item.serviceType || '').toLowerCase();
    if (s.includes('kho') || s.includes('warehousing')) return Warehouse;
    if (s.includes('biển') || s.includes('sea')) return Ship;
    if (s.includes('không') || s.includes('air')) return Plane;
    if (s.includes('sắt') || s.includes('rail')) return TrainTrack;
    if (s.includes('quan') || s.includes('customs')) return FileCheck2;
    if (s.includes('biên') || s.includes('cross')) return Globe;
    if (s.includes('lạnh') || s.includes('cold')) return Snowflake;
    return Truck;
  };

  const ServiceIcon = getServiceIcon();

  // 3. Extract Specific Tab 3 Data Fields
  const routeCode = declaredRoute?.routeCode || item.code;
  const originName = declaredRoute?.origin || item.origin || 'Điểm xuất phát';
  const destName = declaredRoute?.destination || item.destination || 'Điểm đến';
  const slaDesc = declaredRoute?.sla || item.transitTime || '24 - 48 Giờ';

  // Specific Service Group & Model Flags
  const serviceGroup = (item.serviceGroup || item.category || item.serviceType || '').toLowerCase();
  const serviceModel = (item.serviceModel || '').toUpperCase();
  const titleLower = (item.title || '').toLowerCase();
  const vehicleLower = (item.vehicleOrUnit || '').toLowerCase();
  const cargoGroup = (item.cargoGroup || '').toLowerCase();

  const isWarehousing = serviceGroup.includes('kho') || serviceGroup.includes('warehousing') || titleLower.includes('kho bãi');
  const isCustoms = serviceGroup.includes('quan') || serviceGroup.includes('customs') || titleLower.includes('hải quan');
  const isCrossBorder = serviceGroup.includes('biên') || serviceGroup.includes('cross') || titleLower.includes('xuyên biên giới');
  const isOcean = serviceGroup.includes('biển') || serviceGroup.includes('sea') || serviceGroup.includes('ocn') || titleLower.includes('đường biển');
  const isAir = serviceGroup.includes('không') || serviceGroup.includes('air') || titleLower.includes('hàng không');
  const isRail = serviceGroup.includes('sắt') || serviceGroup.includes('rail') || titleLower.includes('đường sắt');
  const isProject = serviceGroup.includes('án') || serviceGroup.includes('project') || titleLower.includes('cross-dock') || titleLower.includes('x-dock') || titleLower.includes('icd') || titleLower.includes('cảng');
  const isTrucking = !isCrossBorder && !isCustoms && !isWarehousing && !isOcean && !isAir && !isRail && !isProject;

  // Sub-model identification
  const isLTL = serviceModel.includes('LTL') || serviceModel.includes('GHÉP') || titleLower.includes('hàng lẻ') || titleLower.includes('ghép') || vehicleLower.includes('kg') || vehicleLower.includes('cbm');
  const isFTL = !isLTL;

  const isLCL = serviceModel.includes('LCL') || serviceModel.includes('CFS') || titleLower.includes('lcl') || titleLower.includes('cfs');
  const isFCL = !isLCL;
  const isAirExpress = isAir && (serviceModel.includes('EXPRESS') || titleLower.includes('express') || titleLower.includes('hỏa tốc'));

  const isColdCargo = cargoGroup.includes('lạnh') || cargoGroup.includes('cold') || cargoGroup.includes('reefer') || (item.badgeLabel || '').toLowerCase().includes('lạnh');
  const isHazmatCargo = cargoGroup.includes('nguy hiểm') || cargoGroup.includes('dg') || cargoGroup.includes('imo') || (item.badgeLabel || '').toLowerCase().includes('nguy hiểm');

  // Warehouse specific data
  const warehouseSpecs: WarehouseTechSpecs = declaredRoute?.warehouseTechSpecs || (declaredModel as any)?.techSpecs || {
    clearHeight: 12.5,
    floorLoad: 5.5,
    floorType: 'Bê tông cốt thép xoa nền Hardener & sơn phủ Epoxy chống sinh bụi',
    columnGrid: '12m x 24m (Nhịp rộng tối ưu chuyển làn cho xe nâng Reach Truck)',
    ventilation: 'Hệ thống thông gió tự nhiên kết hợp quạt hút cưỡng bức đỉnh mái',
    rackingTypes: ['Selective Racking', 'Drive-in Racking'],
    rackingLevels: 5,
    palletLoadLimit: 1200,
    compatiblePalletSizes: ['1.0m × 1.2m (ISO/GMA)', '1.1m × 1.1m (Tiêu chuẩn Châu Á)'],
    dockDoorsCount: 6,
    hasDockLeveler: true,
    yardTurnaround: 'Sân bê tông rộng 35m, xe cont 40ft/45ft quay đầu dễ dàng 24/7',
    operatingHoursTrucks: '24/7 (Không cấm giờ xe cont)',
    fireProtectionSystem: 'PCCC tự động Sprinkler ESFR (Đã nghiệm thu PCCC)',
    fireProtectionApprovalNo: 'Nghiệm thu PCCC số 184/TD-PCCC',
    cctvSurveillance: 'Hệ thống camera AI nhận diện biển số & bao quát 100% góc chết kho',
    securityGuards: 'Bảo vệ chuyên nghiệp 2 lớp túc trực 24/7/365',
    wmsSoftwareName: 'WMS Infor SCM Cloud (Hỗ trợ quét Barcode 1D/2D / RFID)',
    scanningTechnologies: ['Barcode 1D / 2D Handheld', 'RFID Portal Gateway'],
    hasApiIntegration: true,
    realtimeWebPortal: true,
    certifications: ['ISO 9001:2015', 'ISO 14001', 'C-TPAT Security Standard'],
    hasFullInsurance: true,
    hasBackupGeneratorAts: true,
  };

  const warehousePhotos: WarehousePhotoItem[] = declaredRoute?.warehousePhotos || (declaredModel as any)?.photos || [
    {
      id: 'ph-wh-1',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
      name: 'Toàn cảnh mặt ngoài cơ sở kho bãi & Sân quay đầu xe Container',
      tag: 'Toàn Cảnh Cơ Sở Kho',
      isCover: true,
    },
    {
      id: 'ph-wh-2',
      url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&auto=format&fit=crop&q=80',
      name: 'Hệ thống giá kệ Selective Racking tải trọng nặng 5 tầng',
      tag: 'Mặt Sàn & Giá Kệ Racking',
      isCover: false,
    },
    {
      id: 'ph-wh-3',
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=80',
      name: 'Dãy cửa Dock tự động tích hợp Dock Leveler thủy lực',
      tag: 'Cửa Dock & Leveler',
      isCover: false,
    },
    {
      id: 'ph-wh-4',
      url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&auto=format&fit=crop&q=80',
      name: 'Hệ thống báo cháy tự động Sprinkler ESFR và camera giám sát AI',
      tag: 'PCCC & An Ninh',
      isCover: false,
    }
  ];

  // 4. Build WarehouseDetailModalData for continuous spreadsheet table
  const warehouseDetailData: WarehouseDetailModalData = useMemo(() => {
    const freeUtils = (declaredRoute?.warehouseFreeSurcharges && declaredRoute.warehouseFreeSurcharges.length > 0)
      ? declaredRoute.warehouseFreeSurcharges
      : [
          'Miễn phí 02 giờ neo xe chờ bốc dỡ',
          'Miễn phí tài khoản phần mềm WMS Portal theo dõi tồn kho 24/7',
          'Bảo vệ an ninh 24/7 & Giám sát camera an ninh',
          'Bảo hiểm cháy nổ & trách nhiệm kho bãi 100%',
          'Phí bến bãi đỗ xe container chờ xuất nhập',
          'Vệ sinh và kiểm soát côn trùng định kỳ'
        ];

    const varSurcharges = [
      {
        id: 'sur-inbound',
        code: 'SUR-INBOUND',
        name: 'Phí nâng hạ & dỡ hàng nhập kho (Inbound)',
        category: 'Handling Inbound',
        unit: 'VND / Lần / Cột',
        columnPrices: { 'col-1': 35000, 'col-2': 35000, 'col-3': 30000 }
      },
      {
        id: 'sur-outbound',
        code: 'SUR-OUTBOUND',
        name: 'Phí lấy hàng & bốc xếp xuất kho (Outbound)',
        category: 'Handling Outbound',
        unit: 'VND / Lần / Cột',
        columnPrices: { 'col-1': 35000, 'col-2': 35000, 'col-3': 30000 }
      },
      {
        id: 'sur-count',
        code: 'SUR-COUNT',
        name: 'Phí kiểm đếm chi tiết theo Serial / Barcode SKU',
        category: 'Kiểm Đếm & Phân Loại',
        unit: 'VND / Đơn vị / Cột',
        columnPrices: { 'col-1': 1500, 'col-2': 1500, 'col-3': 1200 }
      },
      {
        id: 'sur-pallet-wrap',
        code: 'SUR-WRAP',
        name: 'Phí quấn màng co PE bảo vệ kiện hàng',
        category: 'Đóng Gói & Bảo Vệ',
        unit: 'VND / Cuộn / Cột',
        columnPrices: { 'col-1': 25000, 'col-2': 25000, 'col-3': 20000 }
      },
      {
        id: 'sur-pallet-wood',
        code: 'SUR-PALLET-WOOD',
        name: 'Phí cung cấp pallet gỗ tiêu chuẩn xuất khẩu',
        category: 'Vật Tư & Phụ Trợ',
        unit: 'VND / Pallet / Cột',
        columnPrices: { 'col-1': 120000, 'col-2': 120000, 'col-3': 110000 }
      }
    ];

    const fixSurcharges = [
      {
        id: 'fix-yard-cont',
        code: 'FIX-YARD-CONT',
        name: 'Phí lưu bãi xe container qua đêm tại sân kho',
        unit: 'VND / Xe / Đêm',
        price: 150000,
        note: 'Miễn phí 2 giờ đầu bốc dỡ ban ngày'
      },
      {
        id: 'fix-ot-night',
        code: 'FIX-OT-NIGHT',
        name: 'Phí mở cửa kho vận hành ngoài giờ / Chủ nhật / Ngày lễ',
        unit: 'VND / Giờ',
        price: 300000,
        note: 'Báo trước 4 tiếng cho thủ kho'
      },
      {
        id: 'fix-plug-cont',
        code: 'FIX-PLUG-CONT',
        name: 'Phí điện lạnh cắm container Reefer lưu bãi',
        unit: 'VND / Giờ',
        price: 65000,
        note: 'Giám sát nhiệt độ 24/7'
      }
    ];

    const vasItems = [
      {
        id: 'vas-kitting',
        code: 'VAS-KITTING',
        name: 'Đóng gói lại / Kitting / Dán tem nhãn phụ tiếng Việt',
        category: 'Kitting & Labeling',
        unit: 'VND / Sản phẩm',
        priceText: '800 ₫ / Tem nhãn',
        slaNote: 'SLA hoàn thành trong ngày'
      },
      {
        id: 'vas-return',
        code: 'VAS-RETURN',
        name: 'Phân loại & Xử lý hàng hoàn trả sàn TMĐT (Reverse Logistics)',
        category: 'Reverse Logistics',
        unit: 'VND / Kiện hàng',
        priceText: '3.500 ₫ / Kiện',
        slaNote: 'Kiểm tra ngoại quan và nhập hệ thống'
      },
      {
        id: 'vas-customs-bonded',
        code: 'VAS-CUSTOMS-BONDED',
        name: 'Dịch vụ khai báo hải quan kho ngoại quan trọn gói',
        category: 'Hải Quan Kho Ngoại Quan',
        unit: 'VND / Tờ khai',
        priceText: '650.000 ₫ / Tờ khai',
        slaNote: 'Phối hợp công chức Hải quan trực kho'
      },
      {
        id: 'vas-fifo-lot',
        code: 'VAS-FIFO-LOT',
        name: 'Quản lý Date / Hạn sử dụng theo lô FIFO / FEFO chuyên sâu',
        category: 'Quản Lý Date & Batch',
        unit: 'VND / Tháng',
        priceText: 'Miễn phí trên phần mềm WMS',
        slaNote: 'Cảnh báo date tự động trước 60 ngày'
      }
    ];
    const isColdStorage = Boolean(cargoGroup.includes('lạnh') || titleLower.includes('lạnh'));
    const isChemicalStorage = Boolean(cargoGroup.includes('nguy hiểm') || titleLower.includes('nguy hiểm'));
    const isBondedStorage = Boolean(titleLower.includes('ngoại quan') || serviceModel.includes('NGOẠI QUAN'));
    const isSelfStorage = Boolean(titleLower.includes('tự quản') || serviceModel.includes('TỰ QUẢN'));
    const isFulfillment = Boolean(titleLower.includes('fulfillment') || titleLower.includes('tmđt') || serviceModel.includes('TMĐT'));

    return {
      routeId: declaredRoute?.id || item.code || item.id,
      warehouseCode: declaredRoute?.customsWarehouseCode || declaredRoute?.warehouseCode || item.code || 'WH-BD-001',
      warehouseName: declaredRoute?.warehouseName || item.title || 'Kho Trung Tâm KCN Sóng Thần 1',
      province: declaredRoute?.city || 'Bình Dương',
      address: declaredRoute?.warehouseAddress || item.origin || 'KCN Sóng Thần 1, Dĩ An, Bình Dương',
      isColdStorage,
      isChemicalStorage,
      isBondedStorage,
      isSelfStorage,
      isFulfillment,
      customsWarehouseCode: declaredRoute?.customsWarehouseCode || 'WH-BD-001',
      customsAuthority: declaredRoute?.customsAuthority || 'Chi cục Hải quan KCN Sóng Thần',
      photos: warehousePhotos,
      techSpecs: warehouseSpecs,
      freeSurcharges: freeUtils,
      paidSurcharges: [
        { id: 'sur-inbound', name: 'Phí nâng hạ & dỡ hàng nhập kho (Inbound)', priceText: '35.000 ₫/lần', isChecked: true },
        { id: 'sur-outbound', name: 'Phí lấy hàng & bốc xếp xuất kho (Outbound)', priceText: '35.000 ₫/lần', isChecked: true }
      ],
      vasItems: [
        { id: 'vas-kitting', name: 'Đóng gói lại / Kitting / Dán tem nhãn phụ', priceText: '800 ₫/sản phẩm', isChecked: true }
      ],
      capacityArea: 2500,
      capacityPallets: 1800,
      capacityVolume: 3000,
      availableArea: 850,
      availablePallets: 600,
      availableVolume: 1100,
      occupiedArea: 1650,
      occupiedPallets: 1200,
      occupiedVolume: 1900,
      receptionStatus: 'ready',
      pricePerArea: declaredRoute?.priceM2 || 95000,
      pricePerPallet: declaredRoute?.pricePallet || 110000,
      pricePerVolume: declaredRoute?.priceCbm || 120000,
      minChargeMonthly: 3000000,
      currency: 'VND',
      validUntil: declaredRoute?.validUntil || item.validUntil || '2026-12-31',
      promotionPercent: item.discountPercent || 10,
      sla: declaredRoute?.sla || '2 - 4 giờ kể từ khi xe vào dock',
      operatingHours: declaredRoute?.operatingHours || '24/7 (Không cấm giờ xe cont)',
      cutOffTime: declaredRoute?.cutOffTime || '16:30 hàng ngày',
      paymentTerms: declaredRoute?.paymentTerms || 'Net 30 ngày',
      pricingContinuousMatrix: {
        columns: [
          { id: 'col-1', name: '1. Diện Tích Sàn (m²)', unit: 'm²' },
          { id: 'col-2', name: '2. Sức Chứa Pallet (Racking)', unit: 'Pallet' },
          { id: 'col-3', name: '3. Thể Tích Chứa (m³ / CBM)', unit: 'm³' }
        ],
        capacityRow: {
          design: { 'col-1': 2500, 'col-2': 1800, 'col-3': 3000 },
          occupied: { 'col-1': 1650, 'col-2': 1200, 'col-3': 1900 },
          available: { 'col-1': 850, 'col-2': 600, 'col-3': 1100 }
        },
        rentalPriceRow: {
          'col-1': declaredRoute?.priceM2 || 95000,
          'col-2': declaredRoute?.pricePallet || 110000,
          'col-3': declaredRoute?.priceCbm || 120000
        },
        minChargeMonthlyRow: {
          'col-1': 3000000,
          'col-2': 10000000,
          'col-3': 8000000
        },
        variableSurcharges: varSurcharges,
        fixedSurcharges: fixSurcharges,
        vasList: vasItems,
        rules: {
          operatingHours: declaredRoute?.operatingHours || '24/7 (Không cấm giờ xe cont)',
          cutOffTime: declaredRoute?.cutOffTime || '16:30 hàng ngày',
          sla: declaredRoute?.sla || '2 - 4 giờ kể từ khi xe vào dock',
          validUntil: declaredRoute?.validUntil || item.validUntil || '2026-12-31',
          promotionPercent: item.discountPercent || 10,
          paymentTerms: declaredRoute?.paymentTerms || 'Net 30 ngày'
        }
      }
    };
  }, [declaredRoute, declaredModel, item, warehousePhotos, warehouseSpecs]);

  const [warehouseData, setWarehouseData] = useState<WarehouseDetailModalData | null>(warehouseDetailData);

  const techCategories = useMemo(() => {
    return getWarehouseTechSpecCategories(declaredModel?.id, declaredModel?.cargoGroupId);
  }, [declaredModel]);

  return (
    <div className="bg-slate-50/95 rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-inner space-y-3.5 text-xs animate-in fade-in duration-150">
      {/* =========================================================================
          THẺ THÔNG TIN CHUYÊN VIÊN (PIC) & ĐẶT GIỮ CHỖ TRÊN 1 HÀNG DUY NHẤT (FULL WIDTH)
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-3.5 shadow-2xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 sm:gap-4">
        {/* Left: PIC Profile */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0">
            {specialist.avatarInitial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 
                onClick={() => {
                  onNavigate({ 
                    type: 'public', 
                    tab: 'supplier-profile', 
                    params: { specialistId: item.specialistId, viewState: 'detail' } 
                  });
                }}
                className="text-sm font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                title="Bấm để xem hồ sơ năng lực đầy đủ của chuyên viên"
              >
                {specialist.vietnameseName}
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Specialist</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              {specialist.title} • <span className="font-bold text-indigo-950">{specialist.companyName}</span>
            </p>
          </div>
        </div>

        {/* Center: Rating, Response, Hotline & Direct Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-start xl:justify-center border-t xl:border-t-0 xl:border-l xl:border-r border-slate-100 pt-2.5 xl:pt-0 xl:px-4">
          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-xs">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <strong className="text-slate-800">{specialist.rating}</strong>
              <span className="text-slate-400 text-[10.5px]">({specialist.reviewsCount})</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span className="text-slate-500">Phản hồi:</span>
              <strong className="text-emerald-700">&lt; 15 Phút</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1.5 rounded-lg">
            <Phone className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-mono font-bold text-slate-800 text-xs">{specialist.phone}</span>
            <button
              onClick={handleCopyPhone}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-white px-1.5 py-0.5 rounded border border-indigo-200 cursor-pointer transition-colors"
            >
              {copiedPhone ? 'Đã chép!' : 'Copy'}
            </button>
          </div>

          <a
            href={'tel:' + specialist.phone}
            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Gọi Trực Tiếp</span>
          </a>

          <button
            onClick={() => {
              onNavigate({ 
                type: 'public', 
                tab: 'supplier-profile', 
                params: { specialistId: item.specialistId, viewState: 'detail' } 
              });
            }}
            className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            title="Xem toàn bộ biểu giá và hồ sơ năng lực của PIC này"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Xem Hồ Sơ</span>
          </button>
        </div>

        {/* Right: Bookmark, Countdown & Primary CTA */}
        <div className="flex items-center gap-2.5 justify-between xl:justify-end border-t xl:border-t-0 border-slate-100 pt-2.5 xl:pt-0 shrink-0">
          <button
            onClick={() => onToggleBookmark(item.id, item.title)}
            title={isBookmarked ? 'Bỏ lưu ưu đãi' : 'Lưu biểu giá này'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-semibold">Ưu đãi còn</span>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 inline-block">
              {item.daysRemaining || 30} ngày
            </span>
          </div>

          <button
            onClick={() => onBookPromotion(item)}
            id={`book-detail-btn-${item.code}`}
            className="py-2 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Khóa Giá & Đặt Giữ Chỗ Ngay</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          NỘI DUNG GIÁ CƯỚC ÁNH XẠ CHUẨN MÀN HÌNH PRE-VIEW (100% WIDTH)
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Service Header Strip with Full Modal Launcher */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-orange-600/30 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
              <ServiceIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 font-bold text-[10px] rounded border border-orange-500/30 uppercase">
                  {item.serviceGroup || item.category}
                </span>
                <span className="font-mono text-slate-300 font-bold text-xs">{routeCode}</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="font-extrabold text-white text-xs truncate">
                  {declaredRoute?.warehouseName || declaredRoute?.route || item.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {originName} ⇄ {destName} • Đơn vị: <strong className="text-amber-300">{item.pricingUnit}</strong> • SLA: <strong>{slaDesc}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <div className="text-right mr-2 hidden md:block">
              <span className="text-[10px] text-slate-400 block">Đơn giá áp dụng</span>
              <strong className="text-sm font-black text-amber-300">{item.promotionalPriceDisplay}</strong>
            </div>

            <button
              onClick={() => setIsFullModalOpen(true)}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Mở toàn màn hình theo dạng popup modal"
            >
              <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Mở Xem Modal Đầy Đủ</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CASE 1: NHÓM DỊCH VỤ KHO BÃI 3PL
           ========================================================================= */}
        {isWarehousing && (
          <div className="p-3 sm:p-4 space-y-4">
            {/* Warehouse Facility Sub-bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Mã Kho:</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                  {warehouseDetailData.warehouseCode}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tên Cơ Sở:</span>
                <strong className="text-slate-800">{warehouseDetailData.warehouseName}</strong>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Địa Điểm:</span>
                <span className="text-slate-600">{warehouseDetailData.address}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tiêu Chuẩn:</span>
                <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200 text-[10.5px]">
                  {warehouseDetailData.isBondedStorage ? 'Kho Ngoại Quan & CFS' : (warehouseDetailData.isColdStorage ? 'Kho Lạnh Tiêu Chuẩn' : (warehouseDetailData.isFulfillment ? 'Kho TMĐT Fulfillment' : 'Kho Thường Tiêu Chuẩn 3PL'))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Sẵn sàng nhận hàng</span>
                </span>
              </div>
            </div>

            {/* Warehouse Sub-tabs Switcher */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-1">
              <button
                onClick={() => setWarehouseActiveTab('pricing')}
                className={`py-2 px-3.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  warehouseActiveTab === 'pricing'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>1. Ma Trận Giá, Phụ Phí & VAS</span>
              </button>

              <button
                onClick={() => setWarehouseActiveTab('techSpecs')}
                className={`py-2 px-3.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  warehouseActiveTab === 'techSpecs'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Thông Số Kỹ Thuật (Specs) & Tiện Ích</span>
              </button>

              <button
                onClick={() => setWarehouseActiveTab('photos')}
                className={`py-2 px-3.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  warehouseActiveTab === 'photos'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>3. Album Ảnh Thực Tế ({warehousePhotos.length})</span>
              </button>
            </div>

            {/* Tab 1: Continuous Spreadsheet Matrix Table */}
            {warehouseActiveTab === 'pricing' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <WarehousePricingContinuousTable
                  data={warehouseData || warehouseDetailData}
                  setData={setWarehouseData}
                  surchargesLov={WAREHOUSE_SUGGESTED_SURCHARGES}
                  vasLov={WAREHOUSE_SUGGESTED_VAS}
                  isReadOnly={true}
                />
              </div>
            )}

            {/* Tab 2: Technical Specifications & Free Utilities */}
            {warehouseActiveTab === 'techSpecs' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left Categories List */}
                <div className="md:col-span-4 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {techCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTechCategory(cat.id)}
                      className={`w-full text-left p-2.5 rounded-lg font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        activeTechCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>

                {/* Right Category Details */}
                <div className="md:col-span-8 bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-4">
                  {activeTechCategory === 'structure' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Chiều cao thông thủy (Clear Height):</span>
                        <strong className="text-slate-900 text-sm">{warehouseSpecs.clearHeight} mét</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Tải trọng sàn thiết kế (Floor Load):</span>
                        <strong className="text-slate-900 text-sm">{warehouseSpecs.floorLoad} Tấn / m²</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Quy cách bề mặt sàn:</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">{warehouseSpecs.floorType}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Khẩu độ bước cột (Column Grid):</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">{warehouseSpecs.columnGrid}</p>
                      </div>
                    </div>
                  )}

                  {activeTechCategory === 'racking' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Số tầng giá kệ:</span>
                        <strong className="text-slate-900 text-sm">{warehouseSpecs.rackingLevels} tầng Selective</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Tải trọng tối đa mỗi vị trí Pallet:</span>
                        <strong className="text-slate-900 text-sm">{warehouseSpecs.palletLoadLimit} kg / Pallet</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Quy cách Pallet tương thích:</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">{warehouseSpecs.compatiblePalletSizes?.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {activeTechCategory === 'dock' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Số lượng cửa Dock bốc dỡ:</span>
                        <strong className="text-slate-900 text-sm">{warehouseSpecs.dockDoorsCount} Cửa</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Dock Leveler thủy lực tự động:</span>
                        <strong className="text-emerald-700 text-sm">{warehouseSpecs.hasDockLeveler ? '✓ Đã lắp đặt' : 'Không'}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Quy cách sân bãi quay đầu xe:</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">{warehouseSpecs.yardTurnaround}</p>
                      </div>
                    </div>
                  )}

                  {activeTechCategory === 'fire_security' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Hệ thống PCCC:</span>
                        <strong className="text-slate-900 text-xs mt-0.5 block">{warehouseSpecs.fireProtectionSystem}</strong>
                        <span className="text-emerald-700 font-semibold text-[11px] block mt-0.5">{warehouseSpecs.fireProtectionApprovalNo}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Hệ thống camera CCTV:</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">{warehouseSpecs.cctvSurveillance}</p>
                      </div>
                    </div>
                  )}

                  {activeTechCategory === 'wms' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Hệ thống phần mềm WMS:</span>
                        <strong className="text-slate-900 text-xs mt-0.5 block">{warehouseSpecs.wmsSoftwareName}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Tích hợp API/EDI:</span>
                        <strong className="text-emerald-700 text-sm">{warehouseSpecs.hasApiIntegration ? '✓ Đầy đủ RESTful API' : 'Không'}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Web Portal tồn kho trực tuyến:</span>
                        <strong className="text-emerald-700 text-sm">{warehouseSpecs.realtimeWebPortal ? '✓ Đã kích hoạt 24/7' : 'Không'}</strong>
                      </div>
                    </div>
                  )}

                  {activeTechCategory === 'permits' && (
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Chứng chỉ quản lý chất lượng & An ninh:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {warehouseSpecs.certifications?.map((c, i) => (
                            <span key={i} className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-md">
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTechCategory === 'utilities' && (
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Danh sách tiện ích & dịch vụ đã bao gồm miễn phí:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {warehouseDetailData.freeSurcharges.map((util, uIdx) => (
                          <div key={uIdx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-semibold text-slate-800 text-xs">{util}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Photo Gallery with Lightbox Zoom */}
            {warehouseActiveTab === 'photos' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {warehousePhotos.map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => setSelectedPhotoForPreview(photo)}
                    className="group relative h-40 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-2xs hover:border-indigo-400 transition-all"
                    title="Bấm để xem ảnh phóng to"
                  >
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                      <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {photo.isCover && (
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                        Ảnh đại diện
                      </span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] px-2 py-1 truncate font-medium">
                      {photo.tag || photo.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            CASE 2: NHÓM VẬN TẢI ĐƯỜNG BIỂN FCL (NGUYÊN CONTAINER) - KHỚP 100% ẢNH 2!
           ========================================================================= */}
        {isOcean && isFCL && (
          <div className="p-3 sm:p-4 space-y-4">
            {/* Banner & Container Configurations Tab */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Cấu hình Container:</span>
                <button
                  onClick={() => setActiveOceanContTab('cont-20dc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeOceanContTab === 'cont-20dc'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Cont #1: 20ft General (20DC) —— (33 CBM / 28.2 Tấn)
                </button>
                <button
                  onClick={() => setActiveOceanContTab('cont-40dc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeOceanContTab === 'cont-40dc'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Cont #2: 40ft General (40DC) —— (67 CBM / 28.5 Tấn)
                </button>
                <button
                  onClick={() => setActiveOceanContTab('cont-40hc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeOceanContTab === 'cont-40hc'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Cont #3: 40ft High Cube (40HC) —— (76 CBM / 28.5 Tấn)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  Hãng tàu: {declaredRoute?.carrier || 'Hải An / VIMC Lines'}
                </span>
              </div>
            </div>

            {/* Container Rate Matrix Display Table (Matching Image 2) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-3 bg-linear-to-r from-blue-50 to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Tổng cước dự kiến (OF + Phụ phí bắt buộc):</span>
                  <span className="text-lg font-black text-indigo-950">
                    {activeOceanContTab === 'cont-20dc' ? '$450 USD / Cont' : (activeOceanContTab === 'cont-40dc' ? '$780 USD / Cont' : '$850 USD / Cont')}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Đã bao gồm toàn bộ phụ phí bốc dỡ THC & chứng từ
                </span>
              </div>

              {/* Ocean Freight Base */}
              <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-indigo-600" />
                  <div>
                    <strong className="text-slate-900 text-xs">Cước Biển Cơ Bản (Ocean Freight - OF) *</strong>
                    <span className="text-[10px] text-slate-400 block">Đơn giá cước vận chuyển chặng biển</span>
                  </div>
                </div>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {activeOceanContTab === 'cont-20dc' ? '$320 USD' : (activeOceanContTab === 'cont-40dc' ? '$550 USD' : '$600 USD')}
                </span>
              </div>

              {/* 1. PHỤ PHÍ HÃNG TÀU & CẢNG BIỂN */}
              <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200 font-extrabold text-[11px] text-slate-700 uppercase flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Phụ Phí Hãng Tàu & Cảng Biển (Surcharges)</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {OCEAN_FCL_GENERAL_SURCHARGES_LOV.slice(0, 5).map((sur, sIdx) => (
                  <div key={sIdx} className="p-2.5 px-3 flex items-center justify-between text-xs hover:bg-slate-50/50">
                    <span className="text-slate-700 font-medium">{sur.name}</span>
                    <span className="font-mono font-bold text-slate-800">
                      ${sur.defaultPrice} {sur.unit}
                    </span>
                  </div>
                ))}
              </div>

              {/* 2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) */}
              <div className="bg-slate-50/80 px-3 py-2 border-b border-t border-slate-200 font-extrabold text-[11px] text-slate-700 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Dịch Vụ Giá Trị Gia Tăng (VAS) & Tiện Ích Kèm Theo</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {OCEAN_FCL_GENERAL_VAS_LOV.slice(0, 4).map((vas, vIdx) => (
                  <div key={vIdx} className="p-2.5 px-3 flex items-center justify-between text-xs hover:bg-slate-50/50">
                    <span className="text-slate-700 font-medium">{vas.name}</span>
                    <span className={`font-mono font-bold ${vas.defaultPrice === 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {vas.defaultPrice === 0 ? 'Miễn phí' : `$${vas.defaultPrice} ${vas.unit}`}
                    </span>
                  </div>
                ))}
              </div>

              {/* 3. CAM KẾT LỊCH TÀU & VẬN CHUYỂN */}
              <div className="bg-slate-50/80 px-3 py-2 border-b border-t border-slate-200 font-extrabold text-[11px] text-slate-700 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. Cam Kết Lịch Tàu & Điều Khoản Vận Chuyển</span>
              </div>
              <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Lịch tàu chạy & Cắt máng (Closing):</span>
                  <strong className="text-slate-900 text-xs mt-0.5 block">Thứ 4, Thứ 7 hàng tuần (Cut-off 17:00)</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Thời gian hành hải (Transit Time):</span>
                  <strong className="text-slate-900 text-xs mt-0.5 block">{slaDesc} (Tàu chạy Direct)</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Miễn phí lưu bãi / cont (Free Dem/Det):</span>
                  <strong className="text-emerald-700 text-xs mt-0.5 block">14 - 21 Ngày tại cảng đến</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CASE 3: NHÓM VẬN TẢI ĐƯỜNG BỘ FTL (NGUYÊN CHUYẾN)
           ========================================================================= */}
        {isTrucking && isFTL && (
          <div className="p-3 sm:p-4 space-y-4">
            {/* Vehicle Selection Ribbon */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Cấu hình Phương Tiện:</span>
                <button
                  onClick={() => setActiveTruckVehicleTab('truck-5t')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTruckVehicleTab === 'truck-5t'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Xe 5 Tấn (Thùng kín 6.2m)
                </button>
                <button
                  onClick={() => setActiveTruckVehicleTab('truck-8t')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTruckVehicleTab === 'truck-8t'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Xe 8 Tấn (Thùng bạt 8.2m)
                </button>
                <button
                  onClick={() => setActiveTruckVehicleTab('truck-15t')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTruckVehicleTab === 'truck-15t'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Xe 15 Tấn (3 chân 9.6m)
                </button>
                <button
                  onClick={() => setActiveTruckVehicleTab('truck-cont')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTruckVehicleTab === 'truck-cont'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Đầu kéo Container 40ft/45ft
                </button>
              </div>

              <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                Đội xe: 45 xe hoạt động GPS 24/7
              </span>
            </div>

            {/* FTL Pricing Breakdown Matrix */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-3 bg-linear-to-r from-orange-50 to-amber-50/40 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Tổng cước chuyến dự kiến:</span>
                  <span className="text-lg font-black text-slate-900">
                    {activeTruckVehicleTab === 'truck-5t' ? '8.500.000 ₫ / Chuyến' : (activeTruckVehicleTab === 'truck-8t' ? '12.500.000 ₫ / Chuyến' : (activeTruckVehicleTab === 'truck-15t' ? '18.500.000 ₫ / Chuyến' : '22.000.000 ₫ / Chuyến'))}
                  </span>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ✓ Bao gồm phí cầu đường cao tốc & nhiên liệu
                </span>
              </div>

              {/* Surcharges Section */}
              <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200 font-extrabold text-[11px] text-slate-700 uppercase flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Phụ Phí Vận Tải & Điều Kiện Giao Nhận</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {TRUCKING_SECTION_1_SURCHARGES_LOV.slice(0, 4).map((sur, sIdx) => (
                  <div key={sIdx} className="p-2.5 px-3 flex items-center justify-between text-xs hover:bg-slate-50/50">
                    <span className="text-slate-700 font-medium">{sur.name}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {(sur.defaultPrice || 350000).toLocaleString('vi-VN')} ₫ / {sur.unit}
                    </span>
                  </div>
                ))}
              </div>

              {/* VAS & Commitments */}
              <div className="bg-slate-50/80 px-3 py-2 border-b border-t border-slate-200 font-extrabold text-[11px] text-slate-700 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Tiện Ích Đã Bao Gồm & Cam Kết SLA</span>
              </div>
              <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Giám sát hành trình:</span>
                  <strong className="text-slate-900 text-xs mt-0.5 block">Định vị GPS Real-time & e-POD</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Bảo hiểm hàng hóa:</span>
                  <strong className="text-slate-900 text-xs mt-0.5 block">Bảo hiểm trách nhiệm 5 Tỷ VND</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Miễn phí chờ bốc dỡ:</span>
                  <strong className="text-emerald-700 text-xs mt-0.5 block">02 Giờ đầu tiên tại 2 đầu</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CASE 4: CÁC DỊCH VỤ KHÁC (LTL, OCEAN LCL, RAIL, AIR, CUSTOMS)
           ========================================================================= */}
        {!isWarehousing && !(isOcean && isFCL) && !(isTrucking && isFTL) && (
          <div className="p-3 sm:p-4 space-y-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Biểu cước niêm yết áp dụng:</span>
                  <strong className="text-base text-slate-900">{item.promotionalPriceDisplay}</strong>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md border border-indigo-200">
                  SLA: {slaDesc}
                </span>
              </div>

              {/* Weight / Volume Tiers Table */}
              <div className="p-3 bg-white space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Ma Trận Bậc Khối Lượng & Biểu Phí Ghép Hàng:</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Bậc Trọng Lượng / Khối Lượng</th>
                        <th className="p-2.5">Đơn Giá Ghép / Kg</th>
                        <th className="p-2.5">Đơn Giá Ghép / CBM</th>
                        <th className="p-2.5">Thời Gian Giao Nhận</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-medium">&lt; 100 kg / &lt; 0.5 CBM (Min Charge)</td>
                        <td className="p-2.5 font-bold text-slate-900">350.000 ₫ / Lô</td>
                        <td className="p-2.5 font-bold text-slate-900">350.000 ₫ / Lô</td>
                        <td className="p-2.5 text-slate-600">{slaDesc}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">100 - 500 kg / 0.5 - 2 CBM</td>
                        <td className="p-2.5 font-bold text-emerald-700">1.800 ₫ / kg</td>
                        <td className="p-2.5 font-bold text-emerald-700">420.000 ₫ / CBM</td>
                        <td className="p-2.5 text-slate-600">{slaDesc}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">500 - 2.000 kg / 2 - 5 CBM</td>
                        <td className="p-2.5 font-bold text-emerald-700">1.400 ₫ / kg</td>
                        <td className="p-2.5 font-bold text-emerald-700">380.000 ₫ / CBM</td>
                        <td className="p-2.5 text-slate-600">{slaDesc}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">&gt; 2.000 kg / &gt; 5 CBM (Quy mô lớn)</td>
                        <td className="p-2.5 font-bold text-indigo-700">1.100 ₫ / kg</td>
                        <td className="p-2.5 font-bold text-indigo-700">340.000 ₫ / CBM</td>
                        <td className="p-2.5 text-slate-600">{slaDesc}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL PREVIEW FULL SCREEN VIEW (TƯƠNG ỨNG TỪNG NHÓM DỊCH VỤ)
         ========================================================================= */}
      {isFullModalOpen && (
        <>
          {isWarehousing && (
            <WarehouseDetailModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              data={warehouseData || warehouseDetailData}
              isReadOnly={true}
              companyName={specialist.companyName}
              onRequestQuote={() => {
                setIsFullModalOpen(false);
                onBookPromotion(item);
              }}
            />
          )}

          {isOcean && isFCL && (
            <OceanFclCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
            />
          )}

          {isOcean && isLCL && (
            <OceanLclCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType={isColdCargo ? 'reefer' : 'general'}
            />
          )}

          {isTrucking && isFTL && (
            <TruckingFtlCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
            />
          )}

          {isTrucking && isLTL && (
            <TruckingLtlCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
            />
          )}

          {isRail && isFCL && (
            <RailFclCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType={isColdCargo ? 'reefer' : 'general'}
            />
          )}

          {isRail && isLCL && (
            <RailLclCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType="general"
            />
          )}

          {isAir && !isAirExpress && (
            <AirCargoCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
            />
          )}

          {isAirExpress && (
            <AirExpressCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
            />
          )}

          {isCrossBorder && isFTL && (
            <CrossBorderFtlCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
            />
          )}

          {isCrossBorder && isLTL && (
            <CrossBorderLtlCostMatrixModal
              isOpen={isFullModalOpen}
              onClose={() => setIsFullModalOpen(false)}
              route={declaredRoute || ({ id: item.id, routeCode: item.code, origin: item.origin, destination: item.destination } as any)}
              onSave={() => {}}
              isReadOnly
              cargoType="general"
            />
          )}
        </>
      )}

      {/* LIGHTBOX PREVIEW MODAL FOR WAREHOUSE PHOTO */}
      {selectedPhotoForPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedPhotoForPreview(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
              <span className="font-bold text-slate-800 text-xs truncate">{selectedPhotoForPreview.name}</span>
              <button 
                onClick={() => setSelectedPhotoForPreview(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden bg-slate-900 flex items-center justify-center">
              <img src={selectedPhotoForPreview.url} alt={selectedPhotoForPreview.name} className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
