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
  Sparkles, 
  Building2,
  Package,
  Layers,
  Receipt,
  PhoneCall,
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
  WarehousePhotoItem,
  WarehouseTechSpecs,
  getWarehousePhotoSlots,
  getWarehouseTechSpecCategories,
  CUSTOMS_AUTHORITIES_LOV
} from '../../supplier/SupplierServiceCapabilityModal';
import { FULL_MOCK_CAPABILITY_SERVICES, DeclaredServiceModelItem } from '../../../data/mockDeclaredServices';

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
  const [activeWarehouseModalData, setActiveWarehouseModalData] = useState<{
    route: CapabilityRouteItem;
    category: any;
    cargoGroup: any;
    model: any;
  } | null>(null);

  const [warehouseModalTab, setWarehouseModalTab] = useState<'photos' | 'techSpecs' | 'surcharges' | 'vas'>('photos');
  const [activeTechCategory, setActiveTechCategory] = useState<string>('structure');
  const [zoomedPhoto, setZoomedPhoto] = useState<WarehousePhotoItem | null>(null);

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

  const freeSurchargesList: string[] = (declaredData?.freeSurcharges && declaredData.freeSurcharges.length > 0)
    ? declaredData.freeSurcharges
    : (model.defaultFreeSurcharges || []);

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

  const handleOpenWarehouseModal = (route: CapabilityRouteItem) => {
    setActiveWarehouseModalData({
      route,
      category,
      cargoGroup,
      model,
    });
    setWarehouseModalTab('photos');
    const techCategories = getWarehouseTechSpecCategories(model.id, cargoGroup.id);
    if (techCategories.length > 0) {
      setActiveTechCategory(techCategories[0].id);
    }
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
  const isFclTable = (isOceanTable && (model.id?.includes('fcl') || model.name?.includes('FCL') || model.code === 'FCL')) || (isRailTable && (model.id?.includes('fcl') || model.name?.includes('FCL')));
  const isOceanLclTable = isOceanTable && (model.id?.includes('lcl') || model.name?.includes('LCL') || model.code === 'LCL');
  const isRailLclTable = isRailTable && (model.id?.includes('lcl') || model.name?.includes('LCL') || model.code === 'LCL');
  const isLclTable = isOceanLclTable || isRailLclTable;
  const isLtlTable = isTruckingTable && (model.id === 'trk-gen-ltl' || model.name?.includes('LTL') || model.code === 'LTL');
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

            {/* Support hotline assistance */}
            <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-3 text-xs space-y-1.5 mt-4">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tư Vấn Thiết Kế Giải Pháp</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Quý khách có nhu cầu thuê kho diện tích lớn hoặc vận tải dự án đặc thù ngoài biểu giá niêm yết?
              </p>
              {onOpenConsult && (
                <button
                  type="button"
                  onClick={onOpenConsult}
                  className="w-full mt-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Liên Hệ Chuyên Viên Ngay</span>
                </button>
              )}
            </div>
          </div>

          {/* =====================================================================
              📝 RIGHT COLUMN: THÔNG TIN CHI TIẾT DỊCH VỤ ĐANG CHỌN (READ-ONLY)
          ===================================================================== */}
          <div className="md:col-span-8 lg:col-span-9 p-5 sm:p-7 overflow-y-auto space-y-6 bg-white">
            
            {/* Header: Service Title & Badges */}
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
                  <span>{category.name.split(' (')[0]}</span>
                  <span>/</span>
                  <span>{cargoGroup.name}</span>
                  <span>/</span>
                  <span className="font-bold text-slate-900">{model.code || model.name}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                  <span>{model.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ● Sẵn sàng nhận RFQ & Booking
                  </span>
                  {category.id === 'warehousing' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Có hình ảnh thực tế & Specs
                    </span>
                  )}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleTriggerRFQForCurrentService}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Yêu Cầu Báo Giá Dịch Vụ Này</span>
              </button>
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
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Biểu cước chi tiết minh bạch, chuẩn hóa theo từng phân khúc dịch vụ và loại hình vận hành.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {category.id === 'warehousing' && (
                    <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      📸 Bấm "Chi tiết" để xem ảnh thực tế & thông số kỹ thuật kho
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ⚡ Giá chuẩn tham chiếu
                  </span>
                </div>
              </div>

              {/* Data Table with Exact Column Sets */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto max-h-[520px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10">
                      {/* 1. KHO BÃI 3PL */}
                      {isWarehousingTable && isBonded && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[125px] text-center bg-indigo-50 text-indigo-950 font-black">Mã Kho HQ</th>
                          <th className="py-2.5 px-2.5 min-w-[185px]">Tên Kho Ngoại Quan / CFS</th>
                          <th className="py-2.5 px-2.5 min-w-[220px] bg-amber-50 text-amber-950 font-black">Chi Cục Hải Quan Quản Lý</th>
                          <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / TP</th>
                          <th className="py-2.5 px-2.5 min-w-[185px]">Cổng Cảng / KCN / Địa Chỉ</th>
                          <th className="py-2.5 px-2 text-right min-w-[110px] bg-blue-50 text-blue-950">Diện Tích (m²)</th>
                          <th className="py-2.5 px-2 text-right min-w-[115px] bg-blue-50 text-blue-950 font-bold">Sức Chứa CBM (m³)</th>
                          <th className="py-2.5 px-2 text-right min-w-[115px] bg-blue-50 text-blue-950">Số Pallet (Vị Trí)</th>
                          <th className="py-2.5 px-2 text-right min-w-[150px] bg-emerald-50 text-emerald-950 font-black">Giá CBM (/ CBM / Ngày)</th>
                          <th className="py-2.5 px-2 text-right min-w-[140px] bg-emerald-50 text-emerald-950">Giá Pallet (/ Ngày)</th>
                          <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50 text-emerald-950">Giá m² (/ Tháng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[155px] bg-amber-50 text-amber-950">Cước Sàn (Min/Lô)</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[145px] text-center">Giờ Xe & Giám Sát HQ</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2.5 min-w-[170px] text-center bg-indigo-50 text-indigo-950 font-black">Chi Tiết (Specs & Ảnh)</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {isWarehousingTable && isFulfillment && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[115px] text-center bg-purple-50 text-purple-950 font-black">Mã Kho FUL</th>
                          <th className="py-2.5 px-2.5 min-w-[185px]">Tên Trung Tâm Fulfillment</th>
                          <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / Thành Phố</th>
                          <th className="py-2.5 px-2.5 min-w-[185px]">Địa Chỉ / KCN Trọng Điểm</th>
                          <th className="py-2.5 px-2 text-right min-w-[125px] bg-blue-50 text-blue-950 font-bold">Công Suất (Đơn/Ngày)</th>
                          <th className="py-2.5 px-2 text-right min-w-[115px] bg-blue-50 text-blue-950">Sức Chứa SKUs</th>
                          <th className="py-2.5 px-2 text-right min-w-[125px] bg-blue-50 text-blue-950">Lưu Đệm (Pallet/Bins)</th>
                          <th className="py-2.5 px-2 text-right min-w-[155px] bg-emerald-50 text-emerald-950 font-black">Phí Xử Lý Đơn (Pick&Pack)</th>
                          <th className="py-2.5 px-2 text-right min-w-[145px] bg-emerald-50 text-emerald-950">Phí Thêm Item (/Item)</th>
                          <th className="py-2.5 px-2 text-right min-w-[140px] bg-emerald-50 text-emerald-950">Lưu Kho Đệm (/Tháng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[145px] bg-amber-50 text-amber-950">Cước Sàn (Min/Tháng)</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[140px] text-center">SLA & Cut-Off</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2.5 min-w-[170px] text-center bg-purple-50 text-purple-950 font-black">Chi Tiết (WMS, Sàn, VAS)</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {isWarehousingTable && isSelfStorage && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[115px] text-center bg-amber-50 text-amber-950 font-black">Mã Kho TQ</th>
                          <th className="py-2.5 px-2.5 min-w-[185px]">Tên Cơ Sở Kho Tự Quản</th>
                          <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / Thành Phố</th>
                          <th className="py-2.5 px-2.5 min-w-[185px]">KCN / Địa Chỉ Chi Tiết</th>
                          <th className="py-2.5 px-2 text-right min-w-[125px] bg-blue-50 text-blue-950 font-bold">Diện Tích Sàn (m²)</th>
                          <th className="py-2.5 px-2 text-right min-w-[115px] bg-blue-50 text-blue-950">Thể Tích (m³)</th>
                          <th className="py-2.5 px-2 text-right min-w-[125px] bg-blue-50 text-blue-950">Số Khoang Phân Lô</th>
                          <th className="py-2.5 px-2 text-right min-w-[140px] bg-emerald-50 text-emerald-950 font-black">Giá m² (/Tháng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[140px] bg-emerald-50 text-emerald-950">Giá m³ (/Tháng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[145px] bg-amber-50 text-amber-950">Cước Sàn (Min/Tháng)</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[145px] text-center">Giờ Ra Vào & Truy Cập</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2.5 min-w-[170px] text-center bg-amber-50 text-amber-950 font-black">Chi Tiết (Specs, Ảnh, Tiện Ích)</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {isWarehousingTable && !isBonded && !isFulfillment && !isSelfStorage && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-indigo-50 text-indigo-950 font-black">Mã Kho</th>
                          <th className="py-2.5 px-2.5 min-w-[190px]">Tên Kho / Trung Tâm DC</th>
                          <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / Thành Phố</th>
                          <th className="py-2.5 px-2.5 min-w-[190px]">KCN / Địa Chỉ Chi Tiết</th>
                          <th className="py-2.5 px-2 text-right min-w-[110px] bg-blue-50 text-blue-950 font-bold">Diện Tích (m²)</th>
                          <th className="py-2.5 px-2 text-right min-w-[115px] bg-blue-50 text-blue-950">Số Pallet (Vị Trí)</th>
                          <th className="py-2.5 px-2 text-right min-w-[110px] bg-blue-50 text-blue-950">Thể Tích (m³)</th>
                          <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50 text-emerald-950 font-black">Giá m² (/Tháng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50 text-emerald-950 font-black">Giá Pallet (/Tháng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50 text-emerald-950">Giá m³ (/Tháng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[145px] bg-amber-50 text-amber-950">Cước Sàn (Min/Tháng)</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">SLA Vận Hành</th>
                          <th className="py-2.5 px-2.5 min-w-[125px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2.5 min-w-[170px] text-center bg-indigo-50 text-indigo-950 font-black">Chi Tiết (Specs & Ảnh)</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {/* 2. PROJECT CARGO (X-DOCK & PORT) */}
                      {isXdockTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[105px] text-center bg-purple-50 text-purple-950 font-black">Mã Trạm X-Dock</th>
                          <th className="py-2.5 px-2.5 min-w-[195px]">Tên Trạm Cross-Dock / Hub</th>
                          <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / Thành Phố</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">KCN / Vị Trí Trạm</th>
                          <th className="py-2.5 px-2.5 min-w-[140px] text-right bg-blue-50 text-blue-950 font-black">Công Suất Sàn</th>
                          <th className="py-2.5 px-2 text-right min-w-[110px] bg-emerald-50 text-emerald-950 font-black">Đơn Giá Kg</th>
                          <th className="py-2.5 px-2 text-right min-w-[115px] bg-emerald-50 text-emerald-950 font-black">Đơn Giá CBM</th>
                          <th className="py-2.5 px-2 text-right min-w-[120px] bg-emerald-50 text-emerald-950 font-black">Đơn Giá Pallet</th>
                          <th className="py-2.5 px-2 text-right min-w-[125px] bg-amber-50 text-amber-950 font-black">Cước Sàn (Min/Lô)</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">SLA Giải Phóng</th>
                          <th className="py-2.5 px-2.5 min-w-[125px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2.5 text-center min-w-[140px] bg-indigo-50 text-indigo-950 font-black">Chi Tiết (Specs, Ảnh)</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {isPortTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[105px] text-center bg-sky-50 text-sky-950 font-black">Mã Cảng / ICD</th>
                          <th className="py-2.5 px-2.5 min-w-[200px]">Tên Cảng / Cảng Cạn ICD / Depot</th>
                          <th className="py-2.5 px-2.5 min-w-[135px]">Tỉnh / Thành Phố</th>
                          <th className="py-2.5 px-2.5 min-w-[160px]">Vị Trí / Khu Bến Cảng</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-right bg-blue-50 text-blue-950 font-black">Sức Chứa Bãi (TEU)</th>
                          <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50 text-emerald-950 font-black">Shuttle Cont 20ft</th>
                          <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50 text-emerald-950 font-black">Shuttle Cont 40ft</th>
                          <th className="py-2.5 px-2 text-right min-w-[130px] bg-amber-50 text-amber-950 font-black">Nâng Hạ (Lift On/Off)</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[135px] text-center">SLA Luân Chuyển</th>
                          <th className="py-2.5 px-2.5 min-w-[125px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2.5 text-center min-w-[140px] bg-indigo-50 text-indigo-950 font-black">Chi Tiết (Specs, Ảnh)</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {/* 3. THỦ TỤC HẢI QUAN */}
                      {isCustomsTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-amber-50 text-amber-950 font-black">Mã Dịch Vụ</th>
                          <th className="py-2.5 px-2.5 min-w-[230px] bg-amber-50 text-amber-950 font-black">Chi Cục Hải Quan Mở Tờ Khai</th>
                          <th className="py-2.5 px-2.5 min-w-[175px]">Khu Vực / Cửa Khẩu / Cảng / KCN</th>
                          <th className="py-2.5 px-2.5 min-w-[200px]">Loại Hình Tờ Khai Áp Dụng</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">ĐVT</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2 text-right min-w-[160px] bg-emerald-50 text-emerald-950 font-black">Phí Khai Chuẩn (Xanh/Vàng)</th>
                          <th className="py-2.5 px-2 text-right min-w-[145px] bg-emerald-50 text-emerald-950">Phí Tờ Khai Phụ (/Tờ)</th>
                          <th className="py-2.5 px-2 text-right min-w-[160px] bg-rose-50 text-rose-950 font-bold">Phí Kiểm Hóa Luồng Đỏ (/Lô)</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">SLA Thông Quan</th>
                          <th className="py-2.5 px-2.5 min-w-[155px] text-center">Hình Thức Khai Báo</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {/* 4. VẬN TẢI XUYÊN BIÊN GIỚI */}
                      {isCrossBorderLtl && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[105px] text-center bg-orange-50 text-orange-950 font-black">Mã Tuyến LTL</th>
                          <th className="py-2.5 px-2.5 min-w-[195px]">Hành Lang Tuyến Ghép XBG</th>
                          <th className="py-2.5 px-2.5 min-w-[200px] bg-amber-50 text-amber-950 font-black">Cửa Khẩu Biên Giới (Border Gate)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Kho Gom Hàng (Origin Hub)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Kho Phân Phối / Đích (Dest Hub)</th>
                          <th className="py-2.5 px-2.5 min-w-[170px] text-center">Hình Thức Thông Quan LTL</th>
                          <th className="py-2.5 px-2 text-right min-w-[110px] bg-emerald-50 text-emerald-950 font-black">Đơn Giá Kg (/Kg)</th>
                          <th className="py-2.5 px-2 text-right min-w-[125px] bg-emerald-50 text-emerald-950 font-black">Đơn Giá CBM (/CBM)</th>
                          <th className="py-2.5 px-2 text-right min-w-[120px] bg-amber-50 text-amber-950 font-black">Cước Sàn (Min/Lô)</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[115px] text-center">SLA Giao Hàng</th>
                          <th className="py-2.5 px-2.5 min-w-[170px] text-center bg-blue-50 text-blue-950 font-black">Lịch Chạy / Tần Suất</th>
                          <th className="py-2.5 px-2.5 min-w-[125px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {isCrossBorderFtl && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[100px] text-center bg-orange-50 text-orange-950 font-black">Mã Tuyến XBG</th>
                          <th className="py-2.5 px-2.5 min-w-[200px]">Hành Lang Tuyến Xuyên Biên Giới</th>
                          <th className="py-2.5 px-2.5 min-w-[210px] bg-amber-50 text-amber-950 font-black">Cửa Khẩu Biên Giới (Border Gate)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Đi (Origin)</th>
                          <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Đến (Destination)</th>
                          <th className="py-2.5 px-2.5 min-w-[185px]">Loại Phương Tiện / Cont</th>
                          <th className="py-2.5 px-2.5 min-w-[160px] text-center">Phương Thức Vượt Biên</th>
                          <th className="py-2.5 px-2.5 min-w-[160px] text-center">Phạm Vi Hải Quan</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">ĐVT</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2 text-right min-w-[145px] bg-emerald-50 text-emerald-950 font-black">Giá Cước FTL</th>
                          <th className="py-2.5 px-2.5 min-w-[125px] text-center">SLA Vận Chuyển</th>
                          <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}

                      {/* 5. VẬN TẢI TIÊU CHUẨN (TRUCKING / OCEAN / RAIL / AIR) */}
                      {!isWarehousingTable && !isCustomsTable && !isCrossBorderLtl && !isCrossBorderFtl && !isXdockTable && !isPortTable && (
                        <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                          <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                          <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-slate-100 font-bold">Mã Tuyến</th>
                          {(isOceanTable || isAirTable) && (
                            <th className="py-2.5 px-2.5 min-w-[140px]">Khu Vực</th>
                          )}
                          <th className="py-2.5 px-2.5 min-w-[145px]">Hành Lang Tuyến</th>
                          <th className="py-2.5 px-2.5 min-w-[135px]">
                            {isRailLclTable ? 'Kho Bãi Ga Đi' : (isOceanLclTable ? 'Kho CFS Đi' : (isAirCargoTable ? 'Sân Bay Đi' : (isExpressTable ? 'Điểm Lấy Hàng' : 'Điểm Đi')))}
                          </th>
                          <th className="py-2.5 px-2.5 min-w-[135px]">
                            {isRailLclTable ? 'Kho Bãi Ga Đến' : (isOceanLclTable ? 'Kho CFS Đến' : (isAirCargoTable ? 'Sân Bay Đến' : (isExpressTable ? 'Điểm Đến' : 'Điểm Đến')))}
                          </th>
                          {isOceanTable && isFclTable && (
                            <>
                              <th className="py-2.5 px-2.5 min-w-[170px]">Hãng Tàu</th>
                              <th className="py-2.5 px-2.5 min-w-[180px]">Loại Vỏ Container</th>
                            </>
                          )}
                          {isOceanTable && isOceanLclTable && (
                            <th className="py-2.5 px-2.5 min-w-[180px]">Hãng Tàu / Co-loader</th>
                          )}
                          {isRailTable && isFclTable && (
                            <th className="py-2.5 px-2.5 min-w-[180px]">Loại Vỏ Container</th>
                          )}
                          {isAirCargoTable && (
                            <th className="py-2.5 px-2.5 min-w-[180px]">Hãng Bay (Airline)</th>
                          )}
                          {isExpressTable && (
                            <th className="py-2.5 px-2.5 min-w-[180px]">Hãng Chuyển Phát</th>
                          )}
                          {isTruckingTable && (
                            <>
                              <th className="py-2.5 px-2.5 min-w-[190px]">Loại Thùng Phương Tiện</th>
                              <th className="py-2.5 px-2.5 min-w-[180px]">Phân Khúc Tải Trọng</th>
                            </>
                          )}
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">ĐVT</th>
                          <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                          <th className="py-2.5 px-2.5 min-w-[155px] text-right font-black text-emerald-950 bg-emerald-50">
                            {isAirCargoTable ? 'Đơn Giá (+100kg Base)' : (isExpressTable ? 'Đơn Giá (+45kg Base)' : 'Đơn Giá')}
                          </th>
                          <th className={`py-2.5 px-2 text-center ${(isAirCargoTable || isExpressTable) ? 'min-w-[165px]' : (isLtlOrLclTable ? 'min-w-[160px]' : 'min-w-[90px]')}`}>
                            {(isAirCargoTable || isExpressTable) ? 'Lịch Bay & Cut-off' : (isLtlOrLclTable ? 'Lịch Chạy & Cut-off' : 'SLA')}
                          </th>
                          {!isExpressTable && (
                            <th className="py-2.5 px-2.5 min-w-[125px] text-center">Loại Tuyến</th>
                          )}
                          {isFclTable && (
                            <th className="py-2.5 px-2.5 min-w-[140px] text-center">Free Dem/Det</th>
                          )}
                          <th className="py-2.5 px-2.5 min-w-[125px] text-center">Hạn Giá</th>
                          <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                          <th className="py-2.5 px-2 text-center min-w-[100px] bg-slate-100 font-bold">Báo Giá</th>
                        </tr>
                      )}
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      {routesList.map((route, idx) => {
                        const hasPromo = (route.promotionPercent || 0) > 0;
                        const discountedPrice = hasPromo 
                          ? Math.round(route.price * (1 - route.promotionPercent / 100)) 
                          : route.price;

                        // ----------------------------------------------------
                        // ROW 1: KHO NGOẠI QUAN (wh-gen-bon)
                        // ----------------------------------------------------
                        if (isWarehousingTable && isBonded) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40">
                                {route.customsWarehouseCode || route.warehouseCode || `02B1B${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.warehouseName || route.route}</td>
                              <td className="p-2 font-semibold text-amber-900 bg-amber-50/20">
                                {route.customsAuthority || 'Chi cục Hải quan Cửa khẩu Cảng Sài Gòn KV1'}
                              </td>
                              <td className="p-2 font-semibold text-slate-800">{route.warehouseProvince || route.origin}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {(route.capacityArea ?? 8000).toLocaleString('vi-VN')} m²
                              </td>
                              <td className="p-2 text-right font-bold text-blue-900 bg-blue-50/30">
                                {(route.capacityVolume ?? 12000).toLocaleString('vi-VN')} m³
                              </td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {(route.capacityPallets ?? 6500).toLocaleString('vi-VN')}
                              </td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/30">
                                ${(route.pricePerVolume ?? 0.35).toFixed(2)}
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-800 bg-emerald-50/20">
                                ${(route.pricePerPallet ?? 0.45).toFixed(2)}
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-800 bg-emerald-50/20">
                                ${(route.pricePerArea ?? 6.5).toFixed(1)}
                              </td>
                              <td className="p-2 text-right font-bold text-amber-900 bg-amber-50/30">
                                ${(route.minChargeMonthly ?? 45).toFixed(0)}
                              </td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'USD'}</td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || '24/7 (HQ 08h00 - 17h00)'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center bg-indigo-50/20">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModal(route)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer hover:shadow-indigo-600/30"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Chi Tiết & Ảnh</span>
                                  <span className="bg-indigo-400 text-white text-[10px] px-1 py-0.2 rounded-full font-bold">
                                    {(route.warehousePhotos?.length || 4)}📸
                                  </span>
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 2: KHO TMĐT / FULFILLMENT (wh-gen-ful)
                        // ----------------------------------------------------
                        if (isWarehousingTable && isFulfillment) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-purple-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-purple-700 bg-purple-50/30">
                                {route.warehouseCode || `FUL-HCM-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.warehouseName || route.route}</td>
                              <td className="p-2 font-semibold text-slate-800">{route.warehouseProvince || route.origin}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-right font-bold text-blue-900 bg-blue-50/30">
                                {(route.dailyOrderCapacity ?? 3500).toLocaleString('vi-VN')}
                              </td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {(route.maxSkuCount ?? 8000).toLocaleString('vi-VN')}
                              </td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {(route.bufferCapacity ?? 800).toLocaleString('vi-VN')}
                              </td>
                              <td className="p-2 text-right font-black text-emerald-700 bg-emerald-50/30">
                                {(route.pickPackPrice ?? 8500).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-700 bg-emerald-50/20">
                                {(route.extraItemPrice ?? 1500).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-700 bg-emerald-50/20">
                                {(route.bufferStoragePrice ?? 120000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-amber-700 bg-amber-50/30">
                                {(route.minChargeMonthly ?? 5000000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || 'Đóng gói < 2h'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center bg-purple-50/30">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModal(route)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Chi Tiết (WMS & Ảnh)</span>
                                  <span className="bg-purple-400 text-white text-[10px] px-1 py-0.2 rounded-full font-bold">
                                    {(route.warehousePhotos?.length || 4)}📸
                                  </span>
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 3: KHO TỰ QUẢN (wh-gen-self)
                        // ----------------------------------------------------
                        if (isWarehousingTable && isSelfStorage) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-amber-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-amber-800 bg-amber-50/30">
                                {route.warehouseCode || `SELF-HCM-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.warehouseName || route.route}</td>
                              <td className="p-2 font-semibold text-slate-800">{route.warehouseProvince || route.origin}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-right font-bold text-blue-900 bg-blue-50/30">
                                {(route.capacityArea ?? 1200).toLocaleString('vi-VN')} m²
                              </td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {(route.capacityVolume ?? 3600).toLocaleString('vi-VN')} m³
                              </td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {route.storageUnitsCount ?? 65} khoang
                              </td>
                              <td className="p-2 text-right font-black text-emerald-700 bg-emerald-50/30">
                                {(route.pricePerArea ?? 190000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-700 bg-emerald-50/20">
                                {(route.pricePerVolume ?? 85000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-amber-700 bg-amber-50/30">
                                {(route.minChargeMonthly ?? 1200000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || 'Ra vào 24/7 (Thẻ từ)'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center bg-amber-50/30">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModal(route)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Chi Tiết & Ảnh</span>
                                  <span className="bg-amber-400 text-white text-[10px] px-1 py-0.2 rounded-full font-bold">
                                    {(route.warehousePhotos?.length || 3)}📸
                                  </span>
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 4: KHO TIÊU CHUẨN / KHO LẠNH (wh-gen-std, wh-ref-cold)
                        // ----------------------------------------------------
                        if (isWarehousingTable && !isBonded && !isFulfillment && !isSelfStorage) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/30">
                                {route.warehouseCode || `WH-DC-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">
                                {route.warehouseName || route.route}
                              </td>
                              <td className="p-2 font-semibold text-slate-800">{route.warehouseProvince || route.origin}</td>
                              <td className="p-2 text-slate-600">{route.warehouseAddress || route.destination}</td>
                              <td className="p-2 text-right font-bold text-blue-900 bg-blue-50/30">
                                {(route.capacityArea ?? 15000).toLocaleString('vi-VN')} m²
                              </td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {(route.capacityPallets ?? 12000).toLocaleString('vi-VN')}
                              </td>
                              <td className="p-2 text-right font-semibold text-slate-800 bg-blue-50/20">
                                {(route.capacityVolume ?? 18000).toLocaleString('vi-VN')} m³
                              </td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/30">
                                {(route.pricePerArea ?? 95000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/20">
                                {(route.pricePerPallet ?? 110000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-800 bg-emerald-50/20">
                                {(route.pricePerVolume ?? 120000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-amber-800 bg-amber-50/30">
                                {(route.minChargeMonthly ?? 5000000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || 'Xuất nhập 2 - 4h'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center bg-indigo-50/30">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModal(route)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer hover:shadow-indigo-600/30"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Chi Tiết & Specs</span>
                                  <span className="bg-indigo-400 text-white text-[10px] px-1 py-0.2 rounded-full font-bold">
                                    {(route.warehousePhotos?.length || 5)}📸
                                  </span>
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 5: PROJECT CARGO - X-DOCK
                        // ----------------------------------------------------
                        if (isXdockTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-purple-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-purple-700 bg-purple-50/20">
                                {route.xdockCode || route.routeCode || `XD-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.xdockName || route.route}</td>
                              <td className="p-2 font-semibold text-slate-800">{route.xdockProvince || route.origin}</td>
                              <td className="p-2 text-slate-600">{route.xdockAddress || route.destination}</td>
                              <td className="p-2 text-right font-black text-blue-900 bg-blue-50/30">
                                {route.floorProcessingCapacity || '250 Tấn / Ngày'}
                              </td>
                              <td className="p-2 text-right font-black text-emerald-700 bg-emerald-50/30">
                                {(route.pricePerKg ?? 180).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-700 bg-emerald-50/20">
                                {(route.pricePerCbm ?? 45000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-700 bg-emerald-50/20">
                                {(route.pricePerPallet ?? 35000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-amber-700 bg-amber-50/30">
                                {(route.minChargeXdock ?? 250000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || '< 4 giờ (Sang xe ngay)'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center bg-purple-50/30">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModal(route)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Chi Tiết & Ảnh</span>
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 6: PROJECT CARGO - PORT / ICD
                        // ----------------------------------------------------
                        if (isPortTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-sky-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-sky-800 bg-sky-50/20">
                                {route.portIcdCode || route.routeCode || `ICD-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.portIcdName || route.route}</td>
                              <td className="p-2 font-semibold text-slate-800">{route.portIcdProvince || route.origin}</td>
                              <td className="p-2 text-slate-600">{route.portIcdAddress || route.destination}</td>
                              <td className="p-2 text-right font-black text-blue-900 bg-blue-50/30">
                                {(route.yardCapacityTeu ?? 15000).toLocaleString('vi-VN')} TEU
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-700 bg-emerald-50/30">
                                {(route.priceShuttle20ft ?? 850000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-black text-emerald-700 bg-emerald-50/30">
                                {(route.priceShuttle40ft ?? 1350000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-amber-700 bg-amber-50/20">
                                {(route.priceLiftOnOff ?? 320000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || 'Luân chuyển < 12h'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center bg-sky-50/30">
                                <button
                                  type="button"
                                  onClick={() => handleOpenWarehouseModal(route)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Chi Tiết Bãi</span>
                                </button>
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 7: THỦ TỤC HẢI QUAN
                        // ----------------------------------------------------
                        if (isCustomsTable) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-amber-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-amber-800 bg-amber-50/20">
                                {route.routeCode || `CST-${String(idx + 1).padStart(3, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-amber-950 bg-amber-50/20">
                                {route.customsBranchName || route.route}
                              </td>
                              <td className="p-2 font-semibold text-slate-800">{route.customsAreaName || route.origin}</td>
                              <td className="p-2 text-slate-700">{route.customsDeclarationType || 'Nhập kinh doanh tiêu dùng (A11, A12)'}</td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.pricingUnit || 'Tờ khai'}</td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/30">
                                {(route.price || 850000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-emerald-800 bg-emerald-50/20">
                                {(route.customsExtraItemPrice ?? 50000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-rose-800 bg-rose-50/20">
                                {(route.customsRedChannelPrice ?? 1200000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || 'Xanh < 30p | Vàng < 2h'}</td>
                              <td className="p-2 text-center text-slate-600">{route.customsServiceForm || 'Đại lý HQ trọn gói'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 8: VẬN TẢI XUYÊN BIÊN GIỚI (LTL / FTL)
                        // ----------------------------------------------------
                        if (isCrossBorderLtl) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-orange-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-orange-800 bg-orange-50/20">
                                {route.routeCode || `CB-LTL-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 font-semibold text-amber-950 bg-amber-50/20">{route.borderGate || 'Cửa khẩu Hữu Nghị'}</td>
                              <td className="p-2 font-medium text-slate-700">{route.origin}</td>
                              <td className="p-2 font-medium text-slate-700">{route.destination}</td>
                              <td className="p-2 text-center text-slate-600">{route.customsLtlMode || 'Chính ngạch gom LTL'}</td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/30">
                                {(route.pricePerKg ?? 18000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/30">
                                {(route.pricePerCbm ?? 2800000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-right font-bold text-amber-800 bg-amber-50/20">
                                {(route.minChargeShipment ?? 500000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || '3 - 5 ngày'}</td>
                              <td className="p-2 text-center text-blue-950 font-semibold bg-blue-50/20">{route.departureSchedule || 'Hàng ngày'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        if (isCrossBorderFtl) {
                          return (
                            <tr key={route.id || idx} className="hover:bg-orange-50/20 transition-colors divide-x divide-slate-100 text-xs">
                              <td className="p-2 text-center font-bold text-slate-500 w-9 bg-slate-50/50">{idx + 1}</td>
                              <td className="p-2 text-center font-mono font-bold text-orange-800 bg-orange-50/20">
                                {route.routeCode || `CB-FTL-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="p-2 font-bold text-slate-900">{route.route}</td>
                              <td className="p-2 font-semibold text-amber-950 bg-amber-50/20">{route.borderGate || 'Cửa khẩu Quốc tế Hữu Nghị'}</td>
                              <td className="p-2 font-medium text-slate-700">{route.origin}</td>
                              <td className="p-2 font-medium text-slate-700">{route.destination}</td>
                              <td className="p-2 text-slate-700">{route.truckBodyType || 'Container 40ft/45ft'}</td>
                              <td className="p-2 text-center text-slate-600">{route.transitMode || 'Đổi tài xế tại biên giới'}</td>
                              <td className="p-2 text-center text-slate-600">{route.customsScope || 'Trọn gói HQ 2 đầu'}</td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.pricingUnit || 'Chuyến'}</td>
                              <td className="p-2 text-center font-bold text-slate-800">{route.currency || 'VND'}</td>
                              <td className="p-2 text-right font-black text-emerald-800 bg-emerald-50/30">
                                {(route.price || 32000000).toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="p-2 text-center text-slate-700 font-medium">{route.sla || '24 - 36 giờ'}</td>
                              <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                              <td className="p-2 text-center">
                                {hasPromo ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                    -{route.promotionPercent}%
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">0%</span>
                                )}
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTriggerRFQForRoute(route)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Báo Giá</span>
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        // ----------------------------------------------------
                        // ROW 9: TIÊU CHUẨN (TRUCKING / OCEAN / RAIL / AIR)
                        // ----------------------------------------------------
                        return (
                          <tr key={route.id || idx} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-100 text-xs">
                            <td className="p-2 text-center font-bold text-slate-400 w-9 bg-slate-50/50">{idx + 1}</td>
                            <td className="p-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40">
                              {route.routeCode || `RC-${(model.code || 'TRK')}-${String(idx + 1).padStart(3, '0')}`}
                            </td>
                            {(isOceanTable || isAirTable) && (
                              <td className="p-2 font-medium text-slate-700">{route.region || 'Nội địa / Châu Á'}</td>
                            )}
                            <td className="p-2 font-bold text-slate-900">{route.route}</td>
                            <td className="p-2 text-slate-700 font-medium">{route.origin}</td>
                            <td className="p-2 text-slate-700 font-medium">{route.destination}</td>
                            
                            {isOceanTable && isFclTable && (
                              <>
                                <td className="p-2 font-semibold text-slate-800">{route.shippingLine || 'Hải An / VIMC'}</td>
                                <td className="p-2 text-slate-700">{route.truckBodyType || 'Cont 40HC'}</td>
                              </>
                            )}
                            {isOceanTable && isOceanLclTable && (
                              <td className="p-2 font-semibold text-slate-800">{route.shippingLine || 'Co-loader Lines'}</td>
                            )}
                            {isRailTable && isFclTable && (
                              <td className="p-2 text-slate-700">{route.truckBodyType || 'Cont 40HC Đường Sắt'}</td>
                            )}
                            {isAirCargoTable && (
                              <td className="p-2 font-semibold text-slate-800">{route.shippingLine || 'Vietnam Airlines Cargo'}</td>
                            )}
                            {isExpressTable && (
                              <td className="p-2 font-semibold text-slate-800">{route.shippingLine || 'Hỏa Tốc Express'}</td>
                            )}
                            {isTruckingTable && (
                              <>
                                <td className="p-2 font-semibold text-slate-800">
                                  {route.truckBodyType?.split(' (')[0] || route.vehicleType || 'Xe tải kín'}
                                </td>
                                <td className="p-2 text-slate-600">
                                  {route.truckTonnage?.split(' (')[0] || '15.0T'}
                                </td>
                              </>
                            )}

                            <td className="p-2 text-center font-bold text-slate-800">{route.pricingUnit}</td>
                            <td className="p-2 text-center font-bold text-slate-800">{route.currency}</td>
                            <td className="p-2 text-right font-black text-emerald-700 bg-emerald-50/30">
                              {route.currency === 'USD' ? `$${route.price.toFixed(2)}` : `${route.price.toLocaleString('vi-VN')} ₫`}
                            </td>
                            <td className="p-2 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{route.departureSchedule || route.sla || 'Theo thỏa thuận'}</span>
                              </span>
                            </td>
                            {!isExpressTable && (
                              <td className="p-2 text-center text-slate-600 font-medium">{route.transitType || 'Direct'}</td>
                            )}
                            {isFclTable && (
                              <td className="p-2 text-center font-bold text-indigo-700">
                                {route.freeDemDetDays ? `${route.freeDemDetDays} ngày` : '14 ngày'}
                              </td>
                            )}
                            <td className="p-2 text-center text-slate-600">{route.validUntil || '2026-12-31'}</td>
                            <td className="p-2 text-center">
                              {hasPromo ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                  -{route.promotionPercent}%
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium">0%</span>
                              )}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleTriggerRFQForRoute(route)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Báo Giá</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ===================================================================
                PHẦN 3: CHÍNH SÁCH PHỤ PHÍ & DỊCH VỤ GIA TĂNG (VAS) - READ ONLY
                (Dịch vụ kho bãi được khai báo & hiển thị riêng biệt trong chi tiết từng cơ sở kho)
            =================================================================== */}
            {!isWarehousingTable && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">3</span>
                  <span>Chính Sách Phụ Phí & Dịch Vụ Gia Tăng (VAS)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* 3.1: Miễn phí đã bao gồm */}
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Tiện Ích Đã Bao Gồm Trong Giá Cước (Miễn Phí)</span>
                    </div>

                    {freeSurchargesList.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {freeSurchargesList.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-slate-700 font-semibold text-xs shadow-2xs"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Đã bao gồm chi phí nhiên liệu & phí cầu đường.</p>
                    )}
                  </div>

                  {/* 3.2: Có phí khi phát sinh / VAS */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                      <Receipt className="w-4 h-4 text-indigo-600" />
                      <span>Dịch Vụ Phụ Trợ Tùy Chọn & Phí Phát Sinh (Nếu có)</span>
                    </div>

                    {paidSurchargesList.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        {paidSurchargesList.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-2xs"
                          >
                            <span className="font-medium text-slate-800">{p.name}</span>
                            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px]">
                              {p.priceText}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Áp dụng theo thỏa thuận cụ thể trong hợp đồng vận chuyển.</p>
                    )}
                  </div>

                </div>

                {/* 3.3: VAS đặc biệt nếu có */}
                {vasList.length > 0 && (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Dịch Vụ Gia Tăng Đặc Biệt (Value-Added Services)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vasList.map((vas, vIdx) => (
                        <span
                          key={vIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-2xs"
                        >
                          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{vas}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL: CUSTOMER WAREHOUSE PREVIEW MODAL (ALBUM ẢNH + SPECS + PHỤ PHÍ + VAS)
      ========================================================================= */}
      {activeWarehouseModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] min-h-[600px] max-h-[850px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* 1. Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                      {activeWarehouseModalData.route.warehouseName || activeWarehouseModalData.route.route}
                    </h3>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Mã: {activeWarehouseModalData.route.warehouseCode || activeWarehouseModalData.route.routeCode}
                    </span>
                    {activeWarehouseModalData.model.id?.includes('ref') && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-cyan-300" />
                        Kho Lạnh Đa Nhiệt
                      </span>
                    )}
                    {activeWarehouseModalData.model.id?.includes('bon') && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/30">
                        Kho Ngoại Quan CFS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>
                      {activeWarehouseModalData.route.warehouseAddress || activeWarehouseModalData.route.destination}, {activeWarehouseModalData.route.warehouseProvince || activeWarehouseModalData.route.origin}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-indigo-300 font-medium">Hồ sơ năng lực cơ sở kho bãi chính thức của {companyName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleTriggerRFQForRoute(activeWarehouseModalData.route);
                    setActiveWarehouseModalData(null);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yêu Cầu Báo Giá Kho Này</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWarehouseModalData(null)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer border border-slate-700/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Top Tab Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-2.5 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setWarehouseModalTab('photos')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    warehouseModalTab === 'photos'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>📸 Album Ảnh Thực Tế</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    warehouseModalTab === 'photos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {activeWarehouseModalData.route.warehousePhotos?.length || 4} ảnh
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWarehouseModalTab('techSpecs')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    warehouseModalTab === 'techSpecs'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>🏗️ Thông Số Kỹ Thuật (Specs)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    warehouseModalTab === 'techSpecs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {getWarehouseTechSpecCategories(activeWarehouseModalData.model.id, activeWarehouseModalData.cargoGroup.id).length} Nhóm
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWarehouseModalTab('surcharges')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    warehouseModalTab === 'surcharges'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>🏷️ Phụ Phí Handling & Lưu Kho</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    warehouseModalTab === 'surcharges' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {(activeWarehouseModalData.route.warehousePaidSurcharges?.length || paidSurchargesList.length)} phí
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWarehouseModalTab('vas')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    warehouseModalTab === 'vas'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✨ Dịch Vụ Gia Tăng (VAS)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    warehouseModalTab === 'vas' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {(activeWarehouseModalData.route.warehouseVasItems?.length || vasList.length)} VAS
                  </span>
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hạ tầng kho đã được xác minh thực địa</span>
              </div>
            </div>

            {/* 3. Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-50/50">
              
              {/* TAB 1: ALBUM ẢNH THỰC TẾ KHO */}
              {warehouseModalTab === 'photos' && (() => {
                const photos: WarehousePhotoItem[] = activeWarehouseModalData.route.warehousePhotos && activeWarehouseModalData.route.warehousePhotos.length > 0
                  ? activeWarehouseModalData.route.warehousePhotos
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

                return (
                  <div className="space-y-6">
                    {/* Header banner */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>Hình Ảnh Thực Tế Cơ Sở Kho Bãi ({photos.length} Góc Ảnh)</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Đã Kiểm Tra Thực Địa
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Hình ảnh độ phân giải cao ghi nhận trực tiếp hạ tầng mặt bằng, sàn, kệ Racking, hệ thống PCCC và cửa dock bốc dỡ xe container.
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Nhấp vào ảnh để phóng to
                      </span>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {photos.map((ph, pIdx) => (
                        <div
                          key={ph.id || pIdx}
                          onClick={() => setZoomedPhoto(ph)}
                          className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all cursor-pointer aspect-4/3 flex flex-col"
                        >
                          <img
                            src={ph.url}
                            alt={ph.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                            <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-bold border border-white/20">
                              {ph.tag || 'Góc ảnh kho'}
                            </span>
                            {ph.isCover && (
                              <span className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black shadow-xs">
                                ★ Ảnh Bìa
                              </span>
                            )}
                          </div>

                          {/* Bottom Caption & Action */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white flex items-end justify-between gap-2">
                            <div className="truncate">
                              <p className="text-xs font-bold truncate text-white drop-shadow-xs">{ph.name}</p>
                              <p className="text-[10px] text-slate-300 font-medium">Bấm để phóng to xem chi tiết</p>
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-xs flex items-center justify-center shrink-0 text-white transition-colors">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 2: THÔNG SỐ KỸ THUẬT (SPECS) */}
              {warehouseModalTab === 'techSpecs' && (() => {
                const specs: WarehouseTechSpecs = activeWarehouseModalData.route.warehouseTechSpecs || {
                  clearHeight: 12.5,
                  floorLoad: 5.5,
                  floorType: 'Bê tông xoa nền Hardener phủ Epoxy tự phẳng',
                  columnGrid: '12m x 24m',
                  rackingTypes: ['Selective Racking (5 tầng)', 'Double Deep Racking'],
                  rackingLevels: 5,
                  palletLoadLimit: 1200,
                  dockDoorsCount: 16,
                  hasDockLeveler: true,
                  hasDockShelter: true,
                  yardTurnaround: 'Sân bãi bê tông rộng 42m cho xe cont 45ft',
                  operatingHoursTrucks: 'Tiếp nhận xe 24/7',
                  fireProtectionSystem: 'Sprinkler tự động ESFR độ nhạy cao',
                  fireProtectionApprovalNo: '148/TD-PCCC',
                  cctvSurveillance: '64 Camera IP Full HD 4K ghi hình 24/7',
                  securityGuards: 'Bảo vệ chuyên nghiệp 24/7',
                  wmsSoftwareName: 'Infor CloudSuite WMS & FlexGO WMS',
                  scanningTechnologies: ['Barcode 1D/2D QR', 'Thiết bị PDA Handheld'],
                  hasApiIntegration: true,
                };

                const techCategories = getWarehouseTechSpecCategories(activeWarehouseModalData.model.id, activeWarehouseModalData.cargoGroup.id);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left Category Menu */}
                    <div className="md:col-span-4 lg:col-span-3 space-y-1.5">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 pb-1">
                        Nhóm Thông Số Kỹ Thuật
                      </div>
                      {techCategories.map((tc) => {
                        const isCatSelected = activeTechCategory === tc.id;
                        return (
                          <div
                            key={tc.id}
                            onClick={() => setActiveTechCategory(tc.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isCatSelected
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-sm'
                                : 'bg-white text-slate-700 hover:bg-indigo-50/60 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-sm">{tc.icon}</span>
                              <span className="truncate">{tc.label}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isCatSelected ? 'text-white' : 'text-slate-400'}`} />
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Detailed Specs View */}
                    <div className="md:col-span-8 lg:col-span-9 bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-2xs">
                      
                      {/* Structure & Floor */}
                      {activeTechCategory.includes('structure') && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>🏗️ Kết Cấu Kho & Mặt Sàn Chịu Lực</span>
                            </h4>
                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Grade A Standard</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Chiều cao thông thủy (Clear Height)</span>
                              <p className="text-sm font-black text-slate-900">{specs.clearHeight ? `${specs.clearHeight} mét` : '12.5 mét'}</p>
                              <span className="text-[10px] text-slate-400">Tối ưu cho kệ Racking 5 - 6 tầng</span>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Tải trọng sàn thiết kế (Floor Load)</span>
                              <p className="text-sm font-black text-indigo-700">{specs.floorLoad ? `${specs.floorLoad} Tấn / m²` : '5.5 Tấn / m²'}</p>
                              <span className="text-[10px] text-slate-400">Chịu lực tập trung cho xe nâng tải nặng</span>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 sm:col-span-2">
                              <span className="text-slate-500 font-medium">Quy cách bề mặt sàn</span>
                              <p className="text-xs font-bold text-slate-800">{specs.floorType || 'Bê tông cốt thép xoa nền Hardener phủ sơn Epoxy'}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 sm:col-span-2">
                              <span className="text-slate-500 font-medium">Khẩu độ bước cột (Column Grid)</span>
                              <p className="text-xs font-bold text-slate-800">{specs.columnGrid || '12m x 24m (Nhịp rộng không cản trở xe nâng)'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Racking & Storage */}
                      {activeTechCategory.includes('racking') && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>📦 Hệ Thống Giá Kệ & Sức Chứa Pallet</span>
                            </h4>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">FEM / EN Standard</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Loại giá kệ lắp đặt</span>
                              <p className="text-xs font-black text-slate-900">{specs.rackingTypes?.join(', ') || 'Selective Racking, Double Deep'}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Số tầng kệ chứa hàng</span>
                              <p className="text-sm font-black text-slate-900">{specs.rackingLevels || 5} Tầng</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Tải trọng thiết kế tối đa / Pallet</span>
                              <p className="text-sm font-black text-emerald-700">{specs.palletLoadLimit || 1200} Kg / Pallet</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Kích thước Pallet tương thích</span>
                              <p className="text-xs font-bold text-slate-800">1.0m x 1.2m & 1.2m x 1.2m</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dock & Yard */}
                      {activeTechCategory.includes('dock') && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>🚛 Cửa Dock Xuất Nhập & Sân Bãi Container</span>
                            </h4>
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">24/7 Access</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Số lượng cửa Dock tự động</span>
                              <p className="text-sm font-black text-indigo-700">{specs.dockDoorsCount || 16} Cửa</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Cầu nâng tự động (Dock Leveler)</span>
                              <p className="text-xs font-bold text-emerald-700">✓ Có trang bị thủy lực tự động</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 sm:col-span-2">
                              <span className="text-slate-500 font-medium">Sân bãi container quay đầu</span>
                              <p className="text-xs font-bold text-slate-800">{specs.yardTurnaround || 'Sân bê tông rộng 42m, xe đầu kéo cont 45ft quay đầu tự do 360°'}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 sm:col-span-2">
                              <span className="text-slate-500 font-medium">Khung giờ tiếp nhận xe tải & cont</span>
                              <p className="text-xs font-bold text-slate-800">{specs.operatingHoursTrucks || 'Tiếp nhận xe 24/7 (Không vướng giờ cấm tải nội đô)'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fire & Security */}
                      {activeTechCategory.includes('fire') && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>🔥 Hệ Thống PCCC & An Ninh An Toàn Kho</span>
                            </h4>
                            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Đã Nghiệm Thu 100%</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 sm:col-span-2">
                              <span className="text-slate-500 font-medium">Hệ thống chữa cháy tự động</span>
                              <p className="text-xs font-black text-rose-700">{specs.fireProtectionSystem || 'PCCC Sprinkler tự động ESFR độ nhạy cao, báo cháy Beam quang học'}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Giấy chứng nhận thẩm duyệt & nghiệm thu PCCC</span>
                              <p className="text-xs font-bold text-slate-900">{specs.fireProtectionApprovalNo || '148/TD-PCCC cấp bởi Cảnh sát PCCC'}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Camera an ninh giám sát (CCTV)</span>
                              <p className="text-xs font-bold text-slate-900">{specs.cctvSurveillance || '64 Camera IP Full HD 4K ghi hình 24/7'}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 sm:col-span-2">
                              <span className="text-slate-500 font-medium">Lực lượng bảo vệ thường trực</span>
                              <p className="text-xs font-bold text-slate-800">{specs.securityGuards || 'Lực lượng an ninh bảo vệ chuyên nghiệp túc trực barie kiểm soát 24/7'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* WMS & Tech */}
                      {activeTechCategory.includes('wms') && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>💻 Phần Mềm WMS & Công Nghệ Quản Lý Tồn Kho</span>
                            </h4>
                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Realtime API</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 sm:col-span-2">
                              <span className="text-slate-500 font-medium">Tên hệ thống quản trị kho (WMS)</span>
                              <p className="text-sm font-black text-indigo-700">{specs.wmsSoftwareName || 'Infor CloudSuite WMS & FlexGO WMS Enterprise'}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Công nghệ định vị & quét mã</span>
                              <p className="text-xs font-bold text-slate-800">Barcode 1D/2D, QR Code & PDA Handheld Honeywell</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Kết nối dữ liệu API / EDI</span>
                              <p className="text-xs font-bold text-emerald-700">✓ Sẵn sàng API tích hợp ERP (SAP, Oracle, Odoo, Sapo)</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* General Cert / Fallback */}
                      {!['structure', 'racking', 'dock', 'fire', 'wms'].some(k => activeTechCategory.includes(k)) && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span>📜 Tiêu Chuẩn Vận Hành & Chứng Nhận</span>
                            </h4>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Chứng nhận hệ thống quản lý</span>
                              <p className="text-xs font-bold text-slate-900">ISO 9001:2015, ISO 14001, HACCP (Kho Lạnh)</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                              <span className="text-slate-500 font-medium">Bảo hiểm trách nhiệm kho bãi</span>
                              <p className="text-xs font-bold text-emerald-700">Bảo hiểm 100% tài sản lưu kho lên đến 50 Tỷ VND</p>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}

              {/* TAB 3: PHỤ PHÍ HANDLING & LƯU KHO (KHAI BÁO CHI TIẾT RIÊNG TỪNG CƠ SỞ KHO) */}
              {warehouseModalTab === 'surcharges' && (() => {
                const curRoute = activeWarehouseModalData.route;
                const freeList = curRoute.warehouseFreeSurcharges && curRoute.warehouseFreeSurcharges.length > 0
                  ? curRoute.warehouseFreeSurcharges
                  : (activeWarehouseModalData.cargoGroup.freeSurcharges || []);
                const paidList = curRoute.warehousePaidSurcharges && curRoute.warehousePaidSurcharges.length > 0
                  ? curRoute.warehousePaidSurcharges
                  : (activeWarehouseModalData.cargoGroup.paidSurcharges || paidSurchargesList);

                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>Biểu Phí Dịch Vụ Bốc Xếp & Vận Hành Kho (Handling Surcharges)</span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Bảng giá niêm yết các hạng mục nâng hạ, bốc xếp và dịch vụ phát sinh khi vận hành tại: <span className="font-semibold text-slate-700">{curRoute.warehouseName || curRoute.route}</span>
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                          Áp dụng riêng cho cơ sở kho này
                        </span>
                      </div>
                    </div>

                    {/* Tiện ích miễn phí đã bao gồm */}
                    {freeList.length > 0 && (
                      <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/25 p-4 space-y-2.5">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>Tiện Ích Đã Bao Gồm Trong Giá Cước (Miễn Phí Tại Kho Này)</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {freeList.map((item, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-slate-700 font-semibold text-xs shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{item}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Phụ phí có phí phát sinh */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                        <Receipt className="w-4 h-4 text-indigo-600" />
                        <span>Phụ Phí Bốc Xếp, Nâng Hạ & Vận Hành Phát Sinh</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {paidList.map((p) => (
                          <div
                            key={p.id}
                            className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between gap-3 text-xs hover:border-indigo-200 hover:shadow-xs transition-all"
                          >
                            <div className="space-y-1">
                              <span className="font-bold text-slate-900">{p.name}</span>
                              <p className="text-[11px] text-slate-500">Phí tiêu chuẩn áp dụng cho cơ sở kho này</p>
                            </div>
                            <span className="font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 text-xs shrink-0 whitespace-nowrap">
                              {p.priceText}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 4: DỊCH VỤ GIA TĂNG (VAS KHAI BÁO CHI TIẾT RIÊNG TỪNG CƠ SỞ KHO) */}
              {warehouseModalTab === 'vas' && (() => {
                const curRoute = activeWarehouseModalData.route;
                const vasItems = curRoute.warehouseVasItems && curRoute.warehouseVasItems.length > 0
                  ? curRoute.warehouseVasItems
                  : (activeWarehouseModalData.cargoGroup.vasList?.map((v, i) => ({
                      id: `v-fallback-${i}`,
                      name: v,
                      category: 'Dịch Vụ Gia Tăng',
                      priceText: 'Theo thỏa thuận',
                      isChecked: true,
                      desc: 'Dịch vụ xử lý, hoàn tất và đóng gói tại kho theo quy chuẩn khách hàng.'
                    })) || []);

                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>Dịch Vụ Giá Trị Gia Tăng Tại Kho (Value-Added Services - VAS)</span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Các giải pháp đóng gói, dán nhãn mác, hoàn tất đơn hàng và chuẩn bị hàng hóa phân phối tại <span className="font-semibold text-slate-700">{curRoute.warehouseName || curRoute.route}</span>.
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                          Chuyên biệt cho cơ sở này
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {vasItems.map((vas, idx) => (
                        <div
                          key={vas.id || idx}
                          className="p-4 rounded-2xl border border-indigo-100 bg-white shadow-2xs space-y-2.5 text-xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {vas.category || 'VAS Cơ Sở'}
                              </span>
                              {vas.priceText && (
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] shrink-0 border border-emerald-200/60">
                                  {vas.priceText}
                                </span>
                              )}
                            </div>
                            <div className="flex items-start gap-2 text-slate-900 font-bold">
                              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                              <span className="text-xs leading-snug">{vas.name}</span>
                            </div>
                            {vas.desc && (
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                {vas.desc}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-2">
                            <span>Trạng thái</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" /> Sẵn sàng cung ứng
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* 4. Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500">
                Cần tham quan khảo sát trực tiếp cơ sở kho? Hãy liên hệ chuyên viên để sắp xếp lịch hẹn.
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveWarehouseModalData(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTriggerRFQForRoute(activeWarehouseModalData.route);
                    setActiveWarehouseModalData(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yêu Cầu Báo Giá Cơ Sở Kho Này</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          LIGHTBOX: PHÓNG TO ẢNH THỰC TẾ KHO
      ========================================================================= */}
      {zoomedPhoto && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setZoomedPhoto(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 sm:aspect-16/9 bg-black">
              <img
                src={zoomedPhoto.url}
                alt={zoomedPhoto.name}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setZoomedPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-400/30">
                  {zoomedPhoto.tag || 'Ảnh Thực Tế Cơ Sở'}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{zoomedPhoto.name}</h4>
              </div>

              <button
                type="button"
                onClick={() => setZoomedPhoto(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Đóng Ảnh Phóng To
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
