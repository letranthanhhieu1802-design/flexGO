import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Ship,
  Plane,
  Train,
  Check, 
  ChevronRight, 
  ChevronDown, 
  ShieldCheck, 
  Clock, 
  Send, 
  MapPin, 
  Zap, 
  Building2,
  Package,
  Layers,
  Receipt,
  X,
  Thermometer,
  Eye,
  Sliders,
  Camera,
  DollarSign,
  Flame,
  Award,
  Maximize2
} from 'lucide-react';
import { 
  CAPABILITY_SERVICE_TREE, 
  CapabilityRouteItem, 
  PaidSurchargeItem, 
  CapabilityVasItem,
  WarehouseTechSpecs,
  WAREHOUSE_SUGGESTED_SURCHARGES,
  WAREHOUSE_SUGGESTED_VAS
} from '../../supplier/SupplierServiceCapabilityModal';
import { FULL_MOCK_CAPABILITY_SERVICES, DeclaredServiceModelItem } from '../../../data/mockDeclaredServices';
import { WarehouseDetailModal } from '../../supplier/WarehouseDetailModal';
import { TruckingFtlCostMatrixModal } from '../../supplier/TruckingFtlCostMatrixModal';
import { TruckingLtlCostMatrixModal } from '../../supplier/TruckingLtlCostMatrixModal';
import { OceanFclCostMatrixModal } from '../../supplier/OceanFclCostMatrixModal';
import { OceanLclCostMatrixModal } from '../../supplier/OceanLclCostMatrixModal';
import { RailFclCostMatrixModal } from '../../supplier/RailFclCostMatrixModal';
import { RailLclCostMatrixModal } from '../../supplier/RailLclCostMatrixModal';
import { AirCargoCostMatrixModal } from '../../supplier/AirCargoCostMatrixModal';
import { AirExpressCostMatrixModal } from '../../supplier/AirExpressCostMatrixModal';
import { CrossBorderFtlCostMatrixModal } from '../../supplier/CrossBorderFtlCostMatrixModal';
import { CrossBorderLtlCostMatrixModal } from '../../supplier/CrossBorderLtlCostMatrixModal';

interface SupplierDeclaredServicesViewProps {
  services?: any[];
  companyName?: string;
  specialistName?: string;
  onOpenRFQForRate?: (item: {
    routeOrService: string;
    benchmarkPriceDisplay: string;
    origin?: string;
    destination?: string;
    vehicleOrUnit?: string;
  }) => void;
  onOpenConsult?: () => void;
  onDownloadRateSheet?: (type: 'rateSheet' | 'contractTemplate') => void;
}

export const SupplierDeclaredServicesView: React.FC<SupplierDeclaredServicesViewProps> = ({
  services = [],
  companyName = 'VinaTrans Logistics JSC',
  specialistName = 'Trần Văn Minh',
  onOpenRFQForRate,
  onOpenConsult,
}) => {
  // 1. Build declaredModelMap from FULL_MOCK_CAPABILITY_SERVICES + custom services prop
  const declaredModelMap = useMemo(() => {
    const map: Record<string, DeclaredServiceModelItem | any> = {};

    // First, load all mock services across all 8 categories
    FULL_MOCK_CAPABILITY_SERVICES.forEach((mockItem) => {
      map[mockItem.id] = mockItem;
    });

    // If custom services are provided, merge them
    if (services && services.length > 0) {
      services.forEach((srv) => {
        CAPABILITY_SERVICE_TREE.forEach((cat) => {
          cat.cargoGroups.forEach((cg) => {
            cg.models.forEach((m) => {
              const isMatch = 
                srv.id === `srv-${m.id}` || 
                srv.id === m.id || 
                (srv.modelCode && srv.modelCode === m.code) ||
                (srv.title && (srv.title.includes(m.name) || (m.code && srv.title.includes(m.code))));

              if (isMatch) {
                map[m.id] = {
                  ...map[m.id],
                  ...srv,
                };
              }
            });
          });
        });
      });
    }

    return map;
  }, [services]);

  // 2. Filter the Master Tree to strictly contain ONLY declared categories & models
  const filteredTree = useMemo(() => {
    return CAPABILITY_SERVICE_TREE.map((cat) => {
      const filteredCargoGroups = cat.cargoGroups.map((cg) => {
        const declaredModels = cg.models.filter((m) => Boolean(declaredModelMap[m.id]));
        return {
          ...cg,
          models: declaredModels,
        };
      }).filter((cg) => cg.models.length > 0);

      return {
        ...cat,
        cargoGroups: filteredCargoGroups,
      };
    }).filter((cat) => cat.cargoGroups.length > 0);
  }, [declaredModelMap]);

  // Total declared services count
  const totalDeclaredCount = useMemo(() => {
    return filteredTree.reduce((acc, cat) => {
      return acc + cat.cargoGroups.reduce((subAcc, cg) => subAcc + cg.models.length, 0);
    }, 0);
  }, [filteredTree]);

  // Active Selected Model in the Tree
  const [selectedModelId, setSelectedModelId] = useState<string>('wh-gen-std');

  // Tree expansion state (all expanded by default for easy customer browsing)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CAPABILITY_SERVICE_TREE.forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // State for Customer Warehouse Detail Modal
  const [activeMatrixModalRoute, setActiveMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);

  const [activeWarehouseModalData, setActiveWarehouseModalData] = useState<{
    route: CapabilityRouteItem;
    category: any;
    cargoGroup: any;
    model: any;
  } | null>(null);

  // Find active model object & category & cargoGroup
  const activeDetails = useMemo(() => {
    for (const cat of filteredTree) {
      for (const cg of cat.cargoGroups) {
        const m = cg.models.find((model) => model.id === selectedModelId);
        if (m) {
          const declaredData = declaredModelMap[m.id];
          return {
            category: cat,
            cargoGroup: cg,
            model: m,
            declaredData,
          };
        }
      }
    }
    // Fallback if not found in filteredTree
    if (filteredTree.length > 0 && filteredTree[0].cargoGroups.length > 0 && filteredTree[0].cargoGroups[0].models.length > 0) {
      const firstCat = filteredTree[0];
      const firstCg = firstCat.cargoGroups[0];
      const firstM = firstCg.models[0];
      return {
        category: firstCat,
        cargoGroup: firstCg,
        model: firstM,
        declaredData: declaredModelMap[firstM.id],
      };
    }
    return null;
  }, [filteredTree, selectedModelId, declaredModelMap]);

  if (!activeDetails) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <p className="text-sm font-semibold text-slate-500">Chưa có dịch vụ nào được khai báo trong hệ thống.</p>
      </div>
    );
  }

  const { category, cargoGroup, model, declaredData } = activeDetails;

  // Resolve content data (prefer supplier custom declaration, fallback to defaults)
  const fleetInfo = declaredData?.fleet || (declaredData?.description ? declaredData.description.replace(/^Năng lực:\s*/i, '').split('.')[0] : model.defaultFleet);
  const operationInfo = declaredData?.operationCapacity || model.defaultOperation;
  const commitmentInfo = declaredData?.serviceCommitment || declaredData?.highlight || model.defaultCommitment;
  
  const routesList: CapabilityRouteItem[] = (declaredData?.routes && declaredData.routes.length > 0) 
    ? declaredData.routes 
    : model.defaultRoutes;

  const paidSurchargesList: PaidSurchargeItem[] = (declaredData?.paidSurcharges && declaredData.paidSurcharges.length > 0)
    ? declaredData.paidSurcharges
    : (model.paidSurchargeOptions?.filter((p) => p.isChecked) || []);

  const vasList: string[] = (declaredData?.vasList && declaredData.vasList.length > 0)
    ? declaredData.vasList
    : (model.defaultVas || []);

  const handleTriggerRFQForRoute = (route: CapabilityRouteItem) => {
    if (onOpenRFQForRate) {
      const nameDisplay = route.warehouseName || route.route || model.name;
      const originDisplay = route.warehouseProvince || route.origin || '';
      const destDisplay = route.warehouseAddress || route.destination || '';
      const priceDisplay = route.pricingUnit 
        ? `${(route.price || 0).toLocaleString('vi-VN')} ${route.currency || 'VND'} / ${route.pricingUnit}`
        : `${(route.price || 0).toLocaleString('vi-VN')} ${route.currency || 'VND'}`;

      onOpenRFQForRate({
        routeOrService: `${model.name}: ${nameDisplay}`,
        benchmarkPriceDisplay: priceDisplay,
        origin: originDisplay,
        destination: destDisplay,
        vehicleOrUnit: route.vehicleType || route.truckBodyType || model.name,
      });
    }
  };

  const handleTriggerRFQForCurrentService = () => {
    if (onOpenRFQForRate) {
      const primaryRoute = routesList[0];
      const priceDisplay = primaryRoute
        ? `${primaryRoute.price.toLocaleString('vi-VN')} ${primaryRoute.currency} / ${primaryRoute.pricingUnit}`
        : 'Liên hệ báo giá theo nhu cầu';

      onOpenRFQForRate({
        routeOrService: `Dịch vụ ${category.name.split(' (')[0]} - ${model.name}`,
        benchmarkPriceDisplay: priceDisplay,
        origin: primaryRoute?.warehouseProvince || primaryRoute?.origin,
        destination: primaryRoute?.warehouseAddress || primaryRoute?.destination,
        vehicleOrUnit: model.name,
      });
    }
  };


  const buildWarehouseDetailData = (
    route: CapabilityRouteItem,
    modelObj: any,
    cargoGroupObj: any,
    categoryObj: any
  ): any => {
    const currentModelId = modelObj?.id || 'wh-gen-std';
    const isColdStorage = Boolean(categoryObj?.id === 'warehousing' && (modelObj?.id?.includes('ref') || modelObj?.name?.includes('Kho Lạnh') || modelObj?.code === 'Reefer' || (route as any).isColdStorage));
    const isChemicalStorage = Boolean(categoryObj?.id === 'warehousing' && (modelObj?.id?.includes('haz') || modelObj?.name?.includes('Nguy Hiểm') || modelObj?.code === 'Hazmat' || (route as any).isChemicalStorage));
    const isBondedStorage = Boolean(categoryObj?.id === 'warehousing' && (modelObj?.id?.includes('bon') || modelObj?.name?.includes('Ngoại Quan') || modelObj?.code === 'Bonded' || (route as any).isBondedStorage));
    const isSelfStorage = Boolean(categoryObj?.id === 'warehousing' && (modelObj?.id?.includes('self') || modelObj?.name?.includes('Tự Quản') || modelObj?.code === 'Self-storage' || (route as any).isSelfStorage));
    const isFulfillment = Boolean(categoryObj?.id === 'warehousing' && (modelObj?.id?.includes('ful') || modelObj?.name?.includes('Fulfillment') || modelObj?.name?.includes('TMĐT') || modelObj?.code === 'Fulfillment' || (route as any).isFulfillment));

    const existingPhotos = (route.warehousePhotos && route.warehousePhotos.length > 0)
      ? route.warehousePhotos
      : [
          {
            id: 'ph-df-1',
            url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
            name: 'Mặt tiền & Sân bãi container bê tông chịu lực 80T',
            tag: 'Mặt tiền & Sân bãi',
            isCover: true,
          },
          {
            id: 'ph-df-2',
            url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&auto=format&fit=crop&q=80',
            name: 'Hệ thống giá kệ Selective Racking 5 tầng đạt chuẩn FEM/EN',
            tag: 'Kệ Racking',
            isCover: false,
          },
          {
            id: 'ph-df-3',
            url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=1200&auto=format&fit=crop&q=80',
            name: 'Mặt sàn Hardener siêu phẳng kháng bụi & PCCC Sprinkler ESFR',
            tag: 'Sàn & Trần kho',
            isCover: false,
          },
          {
            id: 'ph-df-4',
            url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&auto=format&fit=crop&q=80',
            name: 'Dãy cửa Dock tự động tích hợp Dock Leveler thủy lực',
            tag: 'Cửa Dock & Leveler',
            isCover: false,
          },
        ];

    const existingSpecs: WarehouseTechSpecs = route.warehouseTechSpecs || {
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

    const existingFree = (route.warehouseFreeSurcharges && route.warehouseFreeSurcharges.length > 0)
      ? route.warehouseFreeSurcharges
      : (modelObj?.defaultFreeSurcharges || [
          'Miễn phí 02 giờ neo xe chờ bốc dỡ',
          'Miễn phí tài khoản phần mềm WMS Portal theo dõi tồn kho 24/7',
          'Bảo vệ an ninh 24/7 & Giám sát camera an ninh',
          'Bảo hiểm cháy nổ & trách nhiệm kho bãi 100%',
          'Phí bến bãi đỗ xe container chờ xuất nhập',
          'Vệ sinh và kiểm soát côn trùng định kỳ'
        ]);

    const existingPaid = (route.warehousePaidSurcharges && route.warehousePaidSurcharges.length > 0)
      ? route.warehousePaidSurcharges
      : (modelObj?.paidSurchargeOptions || WAREHOUSE_SUGGESTED_SURCHARGES.slice(0, 5).map(s => ({
          id: s.code,
          name: s.name,
          priceText: s.defaultPrice,
          isChecked: true,
          category: s.category,
          unit: s.unit
        })));

    const existingVas = (route.warehouseVasItems && route.warehouseVasItems.length > 0)
      ? route.warehouseVasItems
      : (WAREHOUSE_SUGGESTED_VAS.slice(0, 4).map(v => ({
          id: v.code,
          name: v.name,
          category: v.category,
          unit: v.unit,
          priceText: v.defaultPrice,
          slaNote: 'SLA trong ngày',
          isChecked: true
        })));

    const capArea = route.capacityArea ?? 2500;
    const capPallet = route.capacityPallets ?? 1800;
    const capVol = route.capacityVolume ?? 3000;
    const availArea = route.availableArea ?? 850;
    const availPallet = route.availablePallets ?? 600;
    const availVol = route.availableVolume ?? 1100;

    return {
      routeId: route.id,
      modelId: currentModelId,
      warehouseCode: route.customsWarehouseCode || route.warehouseCode || route.routeCode || 'WH-BD-001',
      warehouseName: route.warehouseName || route.route || 'Kho Trung Tâm KCN Sóng Thần 1',
      province: route.warehouseProvince || route.origin || 'Bình Dương',
      address: route.warehouseAddress || route.destination || 'KCN Sóng Thần 1, TP. Dĩ An',
      isColdStorage,
      isChemicalStorage,
      isBondedStorage,
      isSelfStorage,
      isFulfillment,
      customsWarehouseCode: route.customsWarehouseCode || route.warehouseCode || 'WH-BD-001',
      customsAuthority: route.customsAuthority || 'Chi cục Hải quan KCN Sóng Thần',
      photos: existingPhotos,
      techSpecs: existingSpecs,
      freeSurcharges: existingFree,
      paidSurcharges: existingPaid,
      vasItems: existingVas,
      capacityArea: capArea,
      capacityPallets: capPallet,
      capacityVolume: capVol,
      availableArea: availArea,
      availablePallets: availPallet,
      availableVolume: availVol,
      occupiedArea: route.occupiedArea ?? Math.max(0, capArea - availArea),
      occupiedPallets: route.occupiedPallets ?? Math.max(0, capPallet - availPallet),
      occupiedVolume: route.occupiedVolume ?? Math.max(0, capVol - availVol),
      receptionStatus: route.receptionStatus || 'ready',
      pricePerArea: route.pricePerArea ?? (route.price || 95000),
      pricePerPallet: route.pricePerPallet ?? 110000,
      pricePerVolume: route.pricePerVolume ?? 120000,
      pricePerTon: route.pricePerTon ?? 150000,
      minChargeMonthly: route.minChargeMonthly ?? 3000000,
      currency: route.currency || 'VND',
      validUntil: route.validUntil || '2026-12-31',
      promotionPercent: route.promotionPercent ?? 10,
      sla: route.sla || '2 - 4 giờ kể từ khi xe vào dock',
      operatingHours: route.operatingHours || '24/7 (Không cấm giờ xe cont)',
      cutOffTime: route.cutOffTime || '16:30 hàng ngày',
      paymentTerms: route.paymentTerms || 'Net 30 ngày',
    };
  };

  const handleOpenWarehouseModal = (route: CapabilityRouteItem) => {
    setActiveWarehouseModalData({
      route,
      category,
      cargoGroup,
      model,
    });
  };

  // Local state for item/route view counts
  const [itemViewsMap, setItemViewsMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('supplier_profile_route_views_map');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const getRouteViewCount = (route: CapabilityRouteItem, idx: number) => {
    const routeKey = route.id || route.routeCode || route.warehouseCode || (route as any).portCode || (route as any).xdockCode || `${selectedModelId}-${idx}`;
    if (itemViewsMap[routeKey] !== undefined) {
      return itemViewsMap[routeKey];
    }
    // Seed deterministic view count based on model and route attributes
    const seedString = `${selectedModelId}-${routeKey}-${idx}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    const baseViews = 320 + Math.abs(hash % 1250);
    return baseViews;
  };

  const handleIncrementRouteViews = (route: CapabilityRouteItem, idx: number) => {
    const routeKey = route.id || route.routeCode || route.warehouseCode || (route as any).portCode || (route as any).xdockCode || `${selectedModelId}-${idx}`;
    const currentCount = getRouteViewCount(route, idx);
    const updated = {
      ...itemViewsMap,
      [routeKey]: currentCount + 1,
    };
    setItemViewsMap(updated);
    try {
      localStorage.setItem('supplier_profile_route_views_map', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleOpenWarehouseModalWithView = (route: CapabilityRouteItem, idx: number) => {
    handleIncrementRouteViews(route, idx);
    handleOpenWarehouseModal(route);
  };

  const handleOpenMatrixModalWithView = (route: CapabilityRouteItem, idx: number) => {
    handleIncrementRouteViews(route, idx);
    setActiveMatrixModalRoute(route);
  };

  // Helper category identification flags matching SupplierServiceCapabilityModal.tsx
  const isWarehousingTable = category.id === 'warehousing';
  const isCustomsTable = category.id === 'customs' || category.serviceType === 'Customs Clearance';
  const isCrossBorderLtl = (category.id === 'cross-border' || category.serviceType === 'Cross-border') && (model.id?.includes('ltl') || model.name?.includes('LTL') || model.code === 'LTL');
  const isCrossBorderFtl = (category.id === 'cross-border' || category.serviceType === 'Cross-border') && !isCrossBorderLtl;
  const isXdockTable = category.id === 'project' && (model.id?.includes('xdock') || model.name?.toLowerCase().includes('cross-dock') || model.name?.toLowerCase().includes('x-dock'));
  const isPortTable = category.id === 'project' && (model.id?.includes('port') || model.name?.toLowerCase().includes('cảng') || model.code?.toLowerCase().includes('port'));
  const isTruckingTable = category.id === 'trucking';
  const isOceanTable = category.id === 'ocean' || model.id?.startsWith('sea-');
  const isRailTable = category.id === 'rail' || model.id?.startsWith('rail-');
  const isAirTable = category.id === 'air' || model.id?.startsWith('air-');
  const isExpressTable = category.id === 'air' && (model.id === 'air-gen-exp' || model.name?.includes('Express') || model.code === 'Express');
  const isAirCargoTable = isAirTable && !isExpressTable;
  const isOceanFclTable = isOceanTable && (model.id?.includes('fcl') || model.name?.includes('FCL') || model.code === 'FCL');
  const isOceanLclTable = isOceanTable && (model.id?.includes('lcl') || model.name?.includes('LCL') || model.code === 'LCL');
  const isRailFclTable = isRailTable && (model.id?.includes('fcl') || model.name?.includes('FCL') || model.code === 'FCL');
  const isRailLclTable = isRailTable && (model.id?.includes('lcl') || model.name?.includes('LCL') || model.code === 'LCL');
  const isFclTable = isOceanFclTable || isRailFclTable;
  const isLclTable = isOceanLclTable || isRailLclTable;
  const isLtlTable = isTruckingTable && (model.id === 'trk-gen-ltl' || model.name?.includes('LTL') || model.code === 'LTL');
  const isTruckingFtlTable = isTruckingTable && !isLtlTable;
  const isLtlOrLclTable = isLtlTable || isLclTable;

  const isBonded = isWarehousingTable && (model.id === 'wh-gen-bon' || model.id?.includes('bon') || model.name?.toLowerCase().includes('ngoại quan') || model.code?.toLowerCase().includes('ngoại quan'));
  const isFulfillment = isWarehousingTable && (model.id === 'wh-gen-ful' || model.id?.includes('ful') || model.name?.toLowerCase().includes('fulfillment') || model.name?.toLowerCase().includes('tmđt') || model.code?.toLowerCase().includes('fulfillment'));
  const isSelfStorage = isWarehousingTable && (model.id === 'wh-gen-self' || model.id?.includes('self') || model.name?.toLowerCase().includes('tự quản') || model.code?.toLowerCase().includes('tự quản'));

  return (
    <div className="space-y-6">

      {/* =========================================================================
          MAIN 2-COLUMN VIEW: TREE DIRECTORY (LEFT) + WORKSPACE DETAIL (RIGHT)
      ========================================================================= */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[720px]">
          
          {/* =====================================================================
              🌿 LEFT COLUMN: CÂY DANH MỤC DỊCH VỤ (8 NHÓM DỊCH VỤ)
          ===================================================================== */}
          <div className="md:col-span-4 lg:col-span-3 border-r border-slate-200 bg-slate-50/60 p-4 space-y-3 select-none">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Danh Mục Cung Ứng</span>
              </div>
              <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                {totalDeclaredCount} dịch vụ
              </span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredTree.map((cat) => {
                const isCatExpanded = Boolean(expandedCategories[cat.id]);
                const IconComp = cat.icon || Truck;
                const catModelsCount = cat.cargoGroups.reduce((acc, cg) => acc + cg.models.length, 0);
                const hasSelectedModel = cat.cargoGroups.some(cg => cg.models.some(m => m.id === selectedModelId));

                return (
                  <div 
                    key={cat.id} 
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      hasSelectedModel ? 'border-indigo-300 bg-indigo-50/20 shadow-xs' : 'border-slate-200 bg-white shadow-2xs'
                    }`}
                  >
                    {/* Category Header */}
                    <div
                      onClick={() => toggleCategory(cat.id)}
                      className="flex items-center justify-between p-2.5 hover:bg-slate-100/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-slate-400">
                          {isCatExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </span>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          hasSelectedModel ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black text-slate-800 truncate">{cat.name.split(' (')[0]}</span>
                      </div>

                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full shrink-0">
                        {catModelsCount}
                      </span>
                    </div>

                    {/* Cargo Groups & Models */}
                    {isCatExpanded && (
                      <div className="px-2 pb-2 space-y-2 bg-slate-50/40 border-t border-slate-100 pt-1.5">
                        {cat.cargoGroups.map((cg) => (
                          <div key={cg.id} className="space-y-1">
                            <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              • {cg.name}
                            </div>

                            <div className="space-y-1 pl-1">
                              {cg.models.map((m) => {
                                const isSelected = selectedModelId === m.id;
                                const rCount = (declaredModelMap[m.id]?.routes?.length) || m.defaultRoutes.length;

                                return (
                                  <div
                                    key={m.id}
                                    onClick={() => setSelectedModelId(m.id)}
                                    className={`group flex items-center justify-between py-2 px-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                        : 'text-slate-700 bg-white hover:bg-indigo-50/60 hover:text-indigo-900 border border-slate-200/60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                                        isSelected ? 'bg-white text-indigo-600' : 'bg-emerald-100 text-emerald-700'
                                      }`}>
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      </div>
                                      <span className="truncate">{m.name}</span>
                                    </div>

                                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0 ${
                                      isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                      {rCount} {cat.id === 'warehousing' ? 'kho' : 'tuyến'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =====================================================================
              📝 RIGHT COLUMN: THÔNG TIN CHI TIẾT DỊCH VỤ ĐANG CHỌN (READ-ONLY)
          ===================================================================== */}
          <div className="md:col-span-8 lg:col-span-9 p-5 sm:p-7 overflow-y-auto space-y-6 bg-white">
            
            {/* Header: Service Title */}
            <div className="pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
                  <span>{category.name.split(' (')[0]}</span>
                  <span>/</span>
                  <span>{cargoGroup.name}</span>
                  <span>/</span>
                  <span className="font-bold text-slate-900">{model.code || model.name}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {model.name}
                </h3>
              </div>
            </div>

            {/* ===================================================================
                PHẦN 1: THÔNG TIN NĂNG LỰC CHUNG (3 READ-ONLY CARDS)
            =================================================================== */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">1</span>
                <span>Thông Tin Năng Lực Chung</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Card 1: Quy mô */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Quy mô phương tiện & Hạ tầng</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {fleetInfo}
                  </p>
                </div>

                {/* Card 2: Năng lực vận hành */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span>Vận hành & Công nghệ</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {operationInfo}
                  </p>
                </div>

                {/* Card 3: Cam kết SLA */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cam kết SLA & Bồi thường</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {commitmentInfo}
                  </p>
                </div>
              </div>
            </div>

            {/* ===================================================================
                PHẦN 2: BẢNG CƯỚC DỮ LIỆU CHUẨN ĐẦY ĐỦ CÁC CỘT (MATCHING DECLARATION)
            =================================================================== */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">2</span>
                    <span>
                      {category.id === 'warehousing' ? 'Danh Sách Cơ Sở Kho Bãi & Bảng Giá Tham Chiếu' : 'Các Tuyến Đường & Biểu Giá Tham Chiếu'} ({routesList.length})
                    </span>
                  </h4>
                </div>
              </div>

              {/* Data Table with Exact Column Sets */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto max-h-[520px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10">
                      {/* 1. KHO NGOẠI QUAN */}
                      {isWarehousingTable && isBonded && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-3 min-w-[130px] text-center bg-indigo-50/80 text-indigo-950 font-black">Mã Kho HQ</th>
                          <th className="py-2.5 px-3 min-w-[220px]">Tên Kho Ngoại Quan / CFS</th>
                          <th className="py-2.5 px-3 min-w-[220px] bg-amber-50/80 text-amber-950 font-black">Chi Cục Hải Quan Quản Lý</th>
                          <th className="py-2.5 px-3 min-w-[130px]">Tỉnh / TP</th>
                          <th className="py-2.5 px-3 min-w-[240px]">Địa Chỉ</th>
                          <th className="py-2.5 px-3 min-w-[180px] text-center bg-indigo-50/70 text-indigo-950 font-black">Chi Tiết</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 2. KHO TMĐT / FULFILLMENT */}
                      {isWarehousingTable && isFulfillment && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-3 min-w-[130px] text-center bg-purple-50/80 text-purple-950 font-black">Mã kho</th>
                          <th className="py-2.5 px-3 min-w-[240px]">Tên Trung Tâm Fulfillment</th>
                          <th className="py-2.5 px-3 min-w-[130px]">Tỉnh/TP</th>
                          <th className="py-2.5 px-3 min-w-[240px]">Địa chỉ</th>
                          <th className="py-2.5 px-3 min-w-[180px] text-center bg-purple-50/70 text-purple-950 font-black">Chi tiết</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 3. KHO TỰ QUẢN (SELF-STORAGE) */}
                      {isWarehousingTable && isSelfStorage && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-3 min-w-[130px] text-center bg-amber-50/80 text-amber-950 font-black">Mã Kho</th>
                          <th className="py-2.5 px-3 min-w-[220px]">Tên Cơ Sở Kho TỰ Quản</th>
                          <th className="py-2.5 px-3 min-w-[130px]">Tỉnh/Thành Phố</th>
                          <th className="py-2.5 px-3 min-w-[240px]">Địa Chỉ Chi Tiết</th>
                          <th className="py-2.5 px-3 min-w-[180px] text-center bg-amber-50/70 text-amber-950 font-black">Chi Tiết</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 4. KHO TIÊU CHUẨN / KHO LẠNH / KHO HÓA CHẤT */}
                      {isWarehousingTable && !isBonded && !isFulfillment && !isSelfStorage && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-3 min-w-[130px] text-center bg-indigo-50/70 text-indigo-950 font-black">Mã Kho</th>
                          <th className="py-2.5 px-3 min-w-[240px]">Tên Kho</th>
                          <th className="py-2.5 px-3 min-w-[140px]">Tỉnh</th>
                          <th className="py-2.5 px-3 min-w-[260px]">Địa Chỉ Chi Tiết</th>
                          <th className="py-2.5 px-3 min-w-[180px] text-center bg-indigo-50/70 text-indigo-950 font-black">Chi Tiết</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 5. TRUCKING FTL */}
                      {isTruckingTable && isTruckingFtlTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-indigo-50/70 text-indigo-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] bg-indigo-50/70 text-indigo-950 font-black">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Điểm Đi</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Điểm Đến</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-indigo-100/80 text-indigo-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 6. TRUCKING LTL */}
                      {isTruckingTable && isLtlTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-indigo-50/70 text-indigo-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] bg-indigo-50/70 text-indigo-950 font-black">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Điểm Đầu (Điểm Đi)</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Điểm Cuối (Điểm Đến)</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-indigo-100/80 text-indigo-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 7. OCEAN FCL */}
                      {isOceanTable && isOceanFclTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-sky-50/70 text-sky-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] bg-sky-50/70 text-sky-950 font-black">Khu Vực</th>
                          <th className="py-2.5 px-2.5 min-w-[170px]">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Cảng Đi (POL)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Cảng Đến (POD)</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-sky-100/80 text-sky-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 8. OCEAN LCL */}
                      {isOceanTable && isOceanLclTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-sky-50/70 text-sky-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] bg-sky-50/70 text-sky-950 font-black">Khu Vực</th>
                          <th className="py-2.5 px-2.5 min-w-[170px]">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Kho CFS / Điểm Đi</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Kho CFS / Cảng Đến</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-sky-100/80 text-sky-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 9. RAIL FCL */}
                      {isRailTable && isRailFclTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-emerald-50/70 text-emerald-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] bg-emerald-50/70 text-emerald-950 font-black">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Ga Đi (POL)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Ga Đến (POD)</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Đơn Vị Vận Hành</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-emerald-100/80 text-emerald-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 10. RAIL LCL */}
                      {isRailTable && isRailLclTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-emerald-50/70 text-emerald-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] bg-emerald-50/70 text-emerald-950 font-black">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Ga Đi (POL)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Ga Đến (POD)</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Đơn Vị Vận Hành</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-emerald-100/80 text-emerald-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 11. AIR CARGO */}
                      {isAirCargoTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-sky-50/70 text-sky-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] bg-sky-50/70 text-sky-950 font-black">Khu Vực</th>
                          <th className="py-2.5 px-2.5 min-w-[170px]">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Sân Bay Đi (AOD)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Sân Bay Đến (AOA)</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-sky-100/80 text-sky-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 12. AIR EXPRESS */}
                      {isExpressTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-amber-50/80 text-amber-950 font-black">Mã Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] bg-amber-50/80 text-amber-950 font-black">Khu Vực</th>
                          <th className="py-2.5 px-2.5 min-w-[170px]">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Lấy (Door Origin)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Phát (Door Destination)</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-amber-100/90 text-amber-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 13. CROSS-BORDER FTL */}
                      {isCrossBorderFtl && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-orange-50/80 text-orange-950 font-black">Mã Tuyến XBG</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] bg-orange-50/80 text-orange-950 font-black">Hành Lang Tuyến XBG</th>
                          <th className="py-2.5 px-2.5 min-w-[200px] bg-amber-50/80 text-amber-950 font-black">Cửa Khẩu Biên Giới</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Đi (Origin)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Đến (Destination)</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-orange-100/80 text-orange-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 14. CROSS-BORDER LTL */}
                      {isCrossBorderLtl && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-orange-50/80 text-orange-950 font-black">Mã Tuyến LTL</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] bg-orange-50/80 text-orange-950 font-black">Hành Lang Tuyến XBG</th>
                          <th className="py-2.5 px-2.5 min-w-[200px] bg-amber-50/80 text-amber-950 font-black">Cửa Khẩu Biên Giới</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Kho Gom Hàng (Origin Hub)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Kho Giao Hàng (Dest Hub)</th>
                          <th className="py-2.5 px-2.5 min-w-[180px] text-center bg-orange-100/80 text-orange-950 font-black">Chi Tiết Biểu Phí</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 15. PROJECT CARGO (X-DOCK) */}
                      {isXdockTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-purple-50 text-purple-950 font-black">Mã Trạm X-Dock</th>
                          <th className="py-2.5 px-2.5 min-w-[200px]">Tên Trạm Cross-Dock / Hub</th>
                          <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / Thành Phố</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">KCN / Vị Trí Trạm</th>
                          <th className="py-2.5 px-2.5 text-center min-w-[180px] bg-indigo-50 text-indigo-950 font-black">Chi Tiết (Specs, Sàn, VAS)</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 16. PROJECT CARGO (PORT / ICD) */}
                      {isPortTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-sky-50 text-sky-950 font-black">Mã Cảng / ICD</th>
                          <th className="py-2.5 px-2.5 min-w-[200px]">Tên Cảng / Cảng Cạn ICD / Depot</th>
                          <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / Thành Phố</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Vị Trí / Khu Bến Cảng</th>
                          <th className="py-2.5 px-2.5 text-center min-w-[180px] bg-indigo-50 text-indigo-950 font-black">Chi Tiết (Cầu Bến, Bãi, VAS)</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}

                      {/* 17. THỦ TỤC HẢI QUAN */}
                      {isCustomsTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-amber-50 text-amber-950 font-black">Mã Dịch Vụ</th>
                          <th className="py-2.5 px-2.5 min-w-[220px] bg-amber-50 text-amber-950 font-black">Chi Cục Hải Quan Mở Tờ Khai</th>
                          <th className="py-2.5 px-2.5 min-w-[170px]">Khu Vực / Cửa Khẩu / Cảng</th>
                          <th className="py-2.5 px-2.5 min-w-[170px]">Loại Hình Tờ Khai Áp Dụng</th>
                          <th className="py-2.5 px-2 text-right min-w-[150px] bg-emerald-50 text-emerald-950 font-black">Phí Khai Chuẩn</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">SLA Thông Quan</th>
                          <th className="py-2.5 px-2 text-center w-28 min-w-[105px] bg-slate-100 font-bold text-slate-700">Lượt Xem</th>
                        </tr>
                      )}
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      {routesList.map((route, idx) => {
                        // ----------------------------------------------------
                        // ROW 1: KHO NGOẠI QUAN (wh-gen-bon)
                        // ----------------------------------------------------
                        if (isWarehousingTable && isBonded) {
                          const photoCount = route.warehousePhotos?.length || 0;
                          return (
                            <tr key={route.id || idx} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-12 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40">
                                {route.customsWarehouseCode || route.warehouseCode || `02B1B${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.warehouseName || route.route}</td>
                              <td className="p-2 font-semibold text-amber-950 bg-amber-50/20">
                                {route.customsAuthority || 'Chi cục Hải quan quản lý'}
                              </td>
                              <td className="p-2 font-medium text-slate-700">{route.warehouseProvince || route.origin || 'TP. Hồ Chí Minh'}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-center bg-indigo-50/10">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem thông số kỹ thuật, ảnh thực tế, biểu phí lưu kho & VAS"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                  <span>Chi tiết</span>
                                  {photoCount > 0 && (
                                    <span className="text-[10px] px-1 py-0.2 bg-white rounded text-indigo-700 font-semibold border border-indigo-200">
                                      {photoCount}📸
                                    </span>
                                  )}
                                  <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 2: KHO TMĐT / FULFILLMENT (wh-gen-ful)
                        // ----------------------------------------------------
                        if (isWarehousingTable && isFulfillment) {
                          const photoCount = route.warehousePhotos?.length || 0;
                          return (
                            <tr key={route.id || idx} className="hover:bg-purple-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-12 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-purple-700 bg-purple-50/40">
                                {route.warehouseCode || `FUL-HCM-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.warehouseName || route.route}</td>
                              <td className="p-2 font-medium text-slate-700">{route.warehouseProvince || route.origin || 'TP. Hồ Chí Minh'}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-center bg-purple-50/10">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem công suất xử lý đơn, WMS, biểu phí Pick&Pack & VAS"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
                                  <span>Chi tiết</span>
                                  {photoCount > 0 && (
                                    <span className="text-[10px] px-1 py-0.2 bg-white rounded text-purple-700 font-semibold border border-purple-200">
                                      {photoCount}📸
                                    </span>
                                  )}
                                  <ChevronRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 3: KHO TỰ QUẢN (wh-gen-self)
                        // ----------------------------------------------------
                        if (isWarehousingTable && isSelfStorage) {
                          const photoCount = route.warehousePhotos?.length || 0;
                          return (
                            <tr key={route.id || idx} className="hover:bg-amber-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-12 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-amber-700 bg-amber-50/40">
                                {route.warehouseCode || `SELF-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.warehouseName || route.route}</td>
                              <td className="p-2 font-medium text-slate-700">{route.warehouseProvince || route.origin || 'TP. Hồ Chí Minh'}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-center bg-amber-50/10">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem quy cách khoang, thẻ từ ra vào 24/7 & biểu phí thuê m²/m³"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                                  <span>Chi tiết</span>
                                  {photoCount > 0 && (
                                    <span className="text-[10px] px-1 py-0.2 bg-white rounded text-amber-800 font-semibold border border-amber-200">
                                      {photoCount}📸
                                    </span>
                                  )}
                                  <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 4: KHO TIÊU CHUẨN / KHO LẠNH / HÓA CHẤT
                        // ----------------------------------------------------
                        if (isWarehousingTable && !isBonded && !isFulfillment && !isSelfStorage) {
                          const photoCount = route.warehousePhotos?.length || 0;
                          return (
                            <tr key={route.id || idx} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-12 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40">
                                {route.warehouseCode || `WH-DC-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.warehouseName || route.route}</td>
                              <td className="p-2 font-medium text-slate-700">{route.warehouseProvince || route.origin || 'Bình Dương'}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-center bg-indigo-50/10">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem kết cấu sàn, giá kệ, PCCC, album ảnh & biểu phí m²/Pallet"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                  <span>Chi tiết</span>
                                  {photoCount > 0 && (
                                    <span className="text-[10px] px-1 py-0.2 bg-white rounded text-indigo-700 font-semibold border border-indigo-200">
                                      {photoCount}📸
                                    </span>
                                  )}
                                  <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 5: TRUCKING FTL
                        // ----------------------------------------------------
                        if (isTruckingTable && isTruckingFtlTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40">
                                {route.routeCode || `RC-FTL-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 text-center bg-indigo-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận biểu phí chi tiết theo từng loại xe, phụ phí & VAS"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 6: TRUCKING LTL
                        // ----------------------------------------------------
                        if (isTruckingTable && isLtlTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40">
                                {route.routeCode || `RC-LTL-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 text-center bg-indigo-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận biểu phí ghép hàng lẻ LTL theo Kg & CBM"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 7: OCEAN FCL
                        // ----------------------------------------------------
                        if (isOceanTable && isOceanFclTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-sky-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-sky-700 bg-sky-50/40">
                                {route.routeCode || `RC-FCL-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-medium text-slate-700 bg-sky-50/20">{route.region || 'Châu Á'}</td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 text-center bg-sky-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem biểu phí container 20ft/40ft/45ft, phụ phí local charges & lịch tàu"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 8: OCEAN LCL
                        // ----------------------------------------------------
                        if (isOceanTable && isOceanLclTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-sky-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-sky-700 bg-sky-50/40">
                                {route.routeCode || `RC-LCL-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-medium text-slate-700 bg-sky-50/20">{route.region || 'Châu Á'}</td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 text-center bg-sky-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận cước gom hàng lẻ LCL CBM & Kg, phụ phí CFS & local charges"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 9: RAIL FCL
                        // ----------------------------------------------------
                        if (isRailTable && isRailFclTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-emerald-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40">
                                {route.routeCode || `RC-RAIL-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 font-semibold text-slate-800">{route.shippingLine || 'Đường Sắt Việt Nam (VNR)'}</td>
                              <td className="p-2 text-center bg-emerald-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận giá container đường sắt, phụ phí ga & lịch chạy tàu hàng"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 10: RAIL LCL
                        // ----------------------------------------------------
                        if (isRailTable && isRailLclTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-emerald-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40">
                                {route.routeCode || `RC-RLCL-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 font-semibold text-slate-800">{route.shippingLine || 'Đường Sắt Việt Nam (VNR)'}</td>
                              <td className="p-2 text-center bg-emerald-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận cước ghép hàng lẻ đường sắt LCL theo Kg & CBM"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 11: AIR CARGO
                        // ----------------------------------------------------
                        if (isAirCargoTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-sky-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-sky-700 bg-sky-50/40">
                                {route.routeCode || `RC-AIR-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-medium text-slate-700 bg-sky-50/20">{route.region || 'Đông Bắc Á'}</td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 text-center bg-sky-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận cước hàng không Air Cargo theo các bậc trọng lượng & phụ phí FSC/SSC"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 12: AIR EXPRESS
                        // ----------------------------------------------------
                        if (isExpressTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-amber-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-amber-700 bg-amber-50/40">
                                {route.routeCode || `RC-EXP-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-medium text-slate-700 bg-amber-50/20">{route.region || 'Đông Nam Á'}</td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                              <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                              <td className="p-2 text-center bg-amber-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem bảng cước chuyển phát nhanh Express Door-to-Door"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 13: CROSS-BORDER FTL
                        // ----------------------------------------------------
                        if (isCrossBorderFtl) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-orange-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-orange-800 bg-orange-50/40">
                                {route.routeCode || `CB-FTL-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 font-semibold text-amber-950 bg-amber-50/20">{route.borderGate || 'Cửa khẩu Quốc tế Hữu Nghị'}</td>
                              <td className="p-2 font-medium text-slate-700">{route.origin}</td>
                              <td className="p-2 font-medium text-slate-700">{route.destination}</td>
                              <td className="p-2 text-center bg-orange-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận biểu phí phương tiện vận tải đường bộ xuyên biên giới (FTL)"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 14: CROSS-BORDER LTL
                        // ----------------------------------------------------
                        if (isCrossBorderLtl) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-orange-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-orange-800 bg-orange-50/40">
                                {route.routeCode || `CB-LTL-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 font-semibold text-amber-950 bg-amber-50/20">{route.borderGate || 'Cửa khẩu Quốc tế Hữu Nghị'}</td>
                              <td className="p-2 font-medium text-slate-700">{route.origin}</td>
                              <td className="p-2 font-medium text-slate-700">{route.destination}</td>
                              <td className="p-2 text-center bg-orange-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenMatrixModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem ma trận cước ghép hàng lẻ xuyên biên giới theo Kg & CBM"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
                                  <span>Xem chi tiết</span>
                                  <ChevronRight className="w-3 h-3 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 15: PROJECT CARGO (X-DOCK)
                        // ----------------------------------------------------
                        if (isXdockTable) {
                          const photoCount = route.warehousePhotos?.length || 0;
                          return (
                            <tr key={route.id || idx} className="hover:bg-purple-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-purple-700 bg-purple-50/40">
                                {route.xdockCode || route.routeCode || `XD-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.xdockName || route.warehouseName || route.route}</td>
                              <td className="p-2 font-medium text-slate-700">{route.xdockProvince || route.warehouseProvince || route.origin || 'Bình Dương'}</td>
                              <td className="p-2 text-slate-600">{route.xdockAddress || route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-center bg-indigo-50/10">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem công suất sàn chia chọn, cửa dock, SLA giải phóng & biểu phí handling"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                  <span>Chi tiết</span>
                                  {photoCount > 0 && (
                                    <span className="text-[10px] px-1 py-0.2 bg-white rounded text-indigo-700 font-semibold border border-indigo-200">
                                      {photoCount}📸
                                    </span>
                                  )}
                                  <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 16: PROJECT CARGO (PORT / ICD)
                        // ----------------------------------------------------
                        if (isPortTable) {
                          const photoCount = route.warehousePhotos?.length || 0;
                          return (
                            <tr key={route.id || idx} className="hover:bg-sky-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-sky-700 bg-sky-50/40">
                                {(route as any).portCode || route.routeCode || `PORT-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.portIcdName || route.warehouseName || route.route}</td>
                              <td className="p-2 font-medium text-slate-700">{route.portIcdProvince || route.warehouseProvince || route.origin || 'Hải Phòng'}</td>
                              <td className="p-2 text-slate-600">{route.portIcdAddress || route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-center bg-indigo-50/10">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModalWithView(route, idx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                  title="Xem năng lực cầu bến, bãi TEU, thiết bị cẩu nâng hạ & biểu phí shuttle cont"
                                >
                                  <Sliders className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                  <span>Chi tiết</span>
                                  {photoCount > 0 && (
                                    <span className="text-[10px] px-1 py-0.2 bg-white rounded text-indigo-700 font-semibold border border-indigo-200">
                                      {photoCount}📸
                                    </span>
                                  )}
                                  <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 17: THỦ TỤC HẢI QUAN
                        // ----------------------------------------------------
                        if (isCustomsTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-amber-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-amber-800 bg-amber-50/40">
                                {route.routeCode || `CUS-CL-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900 bg-amber-50/20">{route.customsBranchName || route.route || route.origin}</td>
                              <td className="p-2 font-medium text-slate-700">{route.customsAreaName || route.destination}</td>
                              <td className="p-2 font-semibold text-slate-800">{route.customsDeclarationType || route.vehicleType || 'Kinh doanh (A11/A12)'}</td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/30">
                                {(route.price || 850000).toLocaleString('vi-VN')} ₫ / {route.pricingUnit || 'Tờ khai'}
                              </td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || '4 - 8 giờ'}</td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1 shadow-2xs">
                                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>{getRouteViewCount(route, idx).toLocaleString('vi-VN')}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        }

                        return null;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            

          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL: CUSTOMER WAREHOUSE PREVIEW MODAL (UNIFIED 3-TAB DECLARATION LAYOUT IN READ-ONLY MODE)
      ========================================================================= */}
      {activeWarehouseModalData && (
        <WarehouseDetailModal
          isOpen={Boolean(activeWarehouseModalData)}
          onClose={() => setActiveWarehouseModalData(null)}
          data={buildWarehouseDetailData(
            activeWarehouseModalData.route,
            activeWarehouseModalData.model,
            activeWarehouseModalData.cargoGroup,
            activeWarehouseModalData.category
          )}
          isReadOnly={true}
          companyName={companyName}
          onRequestQuote={() => {
            handleTriggerRFQForRoute(activeWarehouseModalData.route);
            setActiveWarehouseModalData(null);
          }}
          cargoGroupId={activeWarehouseModalData.cargoGroup?.id}
        />
      )}

      {/* =========================================================================
          MODAL MA TRẬN BIỂU PHÍ CHUYÊN SÂU DÀNH CHO KHÁCH HÀNG (PREVIEW / PUBLIC)
      ========================================================================= */}
      {activeMatrixModalRoute && (
        <>
          {isTruckingTable && isTruckingFtlTable && (
            <TruckingFtlCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}

          {isTruckingTable && isLtlTable && (
            <TruckingLtlCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
            />
          )}

          {isOceanTable && isOceanFclTable && (
            <OceanFclCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}

          {isOceanTable && isOceanLclTable && (
            <OceanLclCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}

          {isRailTable && isRailFclTable && (
            <RailFclCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}

          {isRailTable && isRailLclTable && (
            <RailLclCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}

          {isAirCargoTable && (
            <AirCargoCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}

          {isExpressTable && (
            <AirExpressCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
            />
          )}

          {isCrossBorderFtl && (
            <CrossBorderFtlCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}

          {isCrossBorderLtl && (
            <CrossBorderLtlCostMatrixModal
              isOpen={Boolean(activeMatrixModalRoute)}
              onClose={() => setActiveMatrixModalRoute(null)}
              route={activeMatrixModalRoute}
              onSave={() => {}}
              isReadOnly
              cargoType={activeMatrixModalRoute?.cargoType as any}
            />
          )}
        </>
      )}

    </div>
  );
};
