import type {
  HotPromotionItem,
  PromotionBadgeType,
  PromotionCategory,
  ServiceType,
} from '../types';
import {
  CAPABILITY_SERVICE_TREE,
} from '../components/supplier/SupplierServiceCapabilityModal';
import type {
  CapabilityRouteItem,
  CapabilityVasItem,
  ServiceCategoryTree,
} from '../components/supplier/SupplierServiceCapabilityModal';

type CargoGroupName = 'Hàng thường' | 'Hàng lạnh' | 'Hàng nguy hiểm';
type CapabilityModel = ServiceCategoryTree['cargoGroups'][number]['models'][number];

interface ServiceMeta {
  prefix: string;
  serviceType: ServiceType;
  category: PromotionCategory;
  serviceGroup: string;
}

const SERVICE_META: Record<string, ServiceMeta> = {
  trucking: {
    prefix: 'TRK',
    serviceType: 'Trucking',
    category: 'Trucking',
    serviceGroup: 'Đường bộ',
  },
  ocean: {
    prefix: 'SEA',
    serviceType: 'Sea Freight (FCL)',
    category: 'Sea Freight',
    serviceGroup: 'Đường biển',
  },
  air: {
    prefix: 'AIR',
    serviceType: 'Air Freight',
    category: 'Air Freight',
    serviceGroup: 'Hàng không',
  },
  rail: {
    prefix: 'RAIL',
    serviceType: 'Rail Freight',
    category: 'Rail Freight',
    serviceGroup: 'Đường sắt',
  },
  warehousing: {
    prefix: 'WH',
    serviceType: 'Warehousing',
    category: 'Warehousing',
    serviceGroup: 'Kho bãi 3PL',
  },
  customs: {
    prefix: 'CUS',
    serviceType: 'Customs Clearance',
    category: 'Customs',
    serviceGroup: 'Thủ tục hải quan',
  },
  'cross-border': {
    prefix: 'CB',
    serviceType: 'Cross-border',
    category: 'Cross-border',
    serviceGroup: 'Xuyên biên giới',
  },
  project: {
    prefix: 'PRJ',
    serviceType: 'Project Cargo',
    category: 'Project Cargo',
    serviceGroup: 'Dự án',
  },
};

const BADGES: Array<{ type: PromotionBadgeType; label: string }> = [
  { type: 'FLASH_SALE', label: 'FLASH SALE AUDIT' },
  { type: 'BACKHAUL_DEAL', label: 'ƯU ĐÃI CHIỀU VỀ' },
  { type: 'HOT_ROUTE', label: 'TUYẾN HOT' },
  { type: 'VOLUME_DISCOUNT', label: 'ƯU ĐÃI SẢN LƯỢNG' },
  { type: 'LIMITED_CAPACITY', label: 'SỐ LƯỢNG GIỚI HẠN' },
  { type: 'EXCLUSIVE_FLEXGO', label: 'ĐỘC QUYỀN FLEXGO' },
];

const DISCOUNTS = [5, 10, 15, 20, 25, 30];
const VALID_UNTIL_DATES = ['2026-09-30', '2026-10-31', '2026-11-30', '2026-12-31'];

const AUDIT_SPECIALISTS = [
  {
    id: 'audit-sales-01',
    name: 'Minh Tran',
    vietnameseName: 'Trần Văn Minh',
    title: 'Senior Key Account Manager & Freight Solutions Director',
    avatarInitial: 'TM',
    phone: '+84 (0) 908 123 456',
    rating: 4.95,
    reviewsCount: 184,
    companyId: 'audit-supp-01',
    companyName: 'VinaTrans Logistics JSC',
    companyLogo: 'VT',
  },
  {
    id: 'audit-sales-02',
    name: 'Hoang Long Nguyen',
    vietnameseName: 'Nguyễn Hoàng Long',
    title: 'Cold Chain & Contract Logistics Director',
    avatarInitial: 'HL',
    phone: '+84 (0) 912 345 678',
    rating: 4.96,
    reviewsCount: 168,
    companyId: 'audit-supp-02',
    companyName: 'Mekong Express Cold Logistics',
    companyLogo: 'ME',
  },
  {
    id: 'audit-sales-03',
    name: 'Huong Giang Nguyen',
    vietnameseName: 'Nguyễn Thị Hương Giang',
    title: 'Customs Compliance & Dangerous Goods Specialist',
    avatarInitial: 'HG',
    phone: '+84 (0) 906 444 222',
    rating: 4.94,
    reviewsCount: 152,
    companyId: 'audit-supp-03',
    companyName: 'Saigon Ocean Freight & Logistics',
    companyLogo: 'SO',
  },
];

const CARGO_CODE: Record<CargoGroupName, string> = {
  'Hàng thường': 'GEN',
  'Hàng lạnh': 'REF',
  'Hàng nguy hiểm': 'HAZ',
};

const CARGO_TYPE: Record<CargoGroupName, 'general' | 'reefer' | 'hazmat'> = {
  'Hàng thường': 'general',
  'Hàng lạnh': 'reefer',
  'Hàng nguy hiểm': 'hazmat',
};

const CARGO_SUITABILITY: Record<CargoGroupName, string> = {
  'Hàng thường': 'Hàng tiêu dùng, nguyên vật liệu, máy móc, linh kiện và hàng đóng pallet',
  'Hàng lạnh': 'Thực phẩm lạnh/đông lạnh, dược phẩm, vắc-xin và hàng cần kiểm soát nhiệt độ',
  'Hàng nguy hiểm': 'Hóa chất, pin lithium, hàng IMO/IATA DGR và hàng cần giấy phép chuyên ngành',
};

const normalizeModelName = (
  categoryId: string,
  cargoGroup: CargoGroupName,
  model: CapabilityModel,
) => {
  const id = model.id.toLowerCase();

  if (categoryId === 'trucking' || categoryId === 'cross-border') {
    return id.includes('ltl') ? 'LTL' : 'FTL';
  }
  if (categoryId === 'ocean' || categoryId === 'rail') {
    return id.includes('lcl') ? 'LCL' : 'FCL';
  }
  if (categoryId === 'air') {
    return id.includes('exp') ? 'Express' : 'Air Cargo';
  }
  if (categoryId === 'warehousing') {
    if (id.includes('ful')) return 'Kho TMĐT / Fulfillment';
    if (id.includes('bon')) return 'Kho ngoại quan';
    if (id.includes('self')) return 'Kho tự quản';
    if (id.includes('cold')) return 'Kho lạnh & Kho mát';
    if (cargoGroup === 'Hàng nguy hiểm') return 'Kho nguy hiểm';
    return 'Kho thường';
  }
  if (categoryId === 'customs') {
    if (cargoGroup === 'Hàng lạnh') return 'Kiểm dịch / ATTP';
    if (cargoGroup === 'Hàng nguy hiểm') return 'Hóa chất / Giấy phép DG';
    return 'Khai báo xuất nhập khẩu';
  }
  if (categoryId === 'project') {
    if (id.includes('xdock')) return 'Cross-dock';
    if (id.includes('port')) return 'Cảng / ICD';
    if (id.includes('multi')) return 'Đa phương thức';
    return 'Phân phối';
  }

  return model.code || model.name;
};

const resolveVndPrice = (
  categoryId: string,
  serviceModel: string,
  route: CapabilityRouteItem,
) => {
  const candidates: Array<number | undefined> = [];

  if (categoryId === 'warehousing') {
    if (serviceModel.includes('TMĐT')) {
      candidates.push(route.minChargeMonthly, route.pickPackPrice, route.price);
    } else {
      candidates.push(route.pricePerArea, route.pricePerPallet, route.pricePerVolume, route.price);
    }
  } else if (categoryId === 'project') {
    if (serviceModel === 'Cross-dock') candidates.push(route.pricePerKg, route.price);
    else if (serviceModel === 'Cảng / ICD') candidates.push(route.priceLiftOnOff, route.price);
    else candidates.push(route.price, route.priceShuttle40ft, route.priceShuttle20ft);
  } else if (serviceModel === 'LTL' || serviceModel === 'LCL') {
    candidates.push(route.pricePerKg, route.pricePerCbm, route.price);
  } else {
    candidates.push(route.price, route.pricePerKg, route.pricePerCbm);
  }

  const sourcePrice = candidates.find((value) => typeof value === 'number' && value > 0) || 1_000_000;
  return route.currency === 'USD' ? Math.round(sourcePrice * 25_000) : Math.round(sourcePrice);
};

const resolvePricingUnit = (categoryId: string, serviceModel: string, route: CapabilityRouteItem) => {
  if (categoryId === 'warehousing') {
    return serviceModel.includes('TMĐT') ? 'Min / tháng' : 'm² / tháng';
  }
  if (categoryId === 'customs') return 'Tờ khai';
  if (categoryId === 'air' || serviceModel === 'LTL') return 'kg';
  if (serviceModel === 'LCL') return 'CBM';
  if (categoryId === 'ocean' || categoryId === 'rail') return route.pricingUnit || 'Container';
  if (categoryId === 'project') {
    if (serviceModel === 'Cross-dock') return 'kg (Cước sàn)';
    if (serviceModel === 'Cảng / ICD') return 'Lần nâng hạ';
  }
  return route.pricingUnit || 'Chuyến';
};

const resolveDescription = (
  categoryId: string,
  serviceModel: string,
  route: CapabilityRouteItem,
) => {
  if (categoryId === 'warehousing') {
    const main = route.warehouseAddress || route.warehouseName || route.origin;
    const sub = serviceModel.includes('TMĐT')
      ? `Công suất: ${(route.dailyOrderCapacity || 3_500).toLocaleString('vi-VN')} đơn/ngày`
      : `Diện tích: ${(route.capacityArea || route.availableArea || 15_000).toLocaleString('vi-VN')} m²`;
    return { main, sub };
  }
  if (categoryId === 'customs') {
    return {
      main: route.customsBranchName || route.customsAreaName || route.route,
      sub: route.customsDeclarationType || serviceModel,
    };
  }
  if (categoryId === 'project') {
    if (serviceModel === 'Cross-dock') {
      return {
        main: route.xdockAddress || route.xdockName || route.route,
        sub: `Công suất: ${route.floorProcessingCapacity || '250 Tấn/ngày'}`,
      };
    }
    if (serviceModel === 'Cảng / ICD') {
      return {
        main: route.portIcdAddress || route.portIcdName || route.route,
        sub: `Sức chứa: ${(route.yardCapacityTeu || 15_000).toLocaleString('vi-VN')} TEU`,
      };
    }
  }

  return {
    main: route.route || `${route.origin} ⇄ ${route.destination}`,
    sub: route.truckTonnage || route.vehicleType || route.departureSchedule || route.sla,
  };
};

const toWarehouseVasItems = (model: CapabilityModel): CapabilityVasItem[] =>
  model.defaultVas.map((name, index) => ({
    id: `audit-vas-${model.id}-${index + 1}`,
    name,
    category: 'Dịch vụ VAS đã khai báo',
    priceText: 'Theo biểu giá khai báo',
    isChecked: true,
  }));

const createAuditRoute = (
  sourceRoute: CapabilityRouteItem,
  model: CapabilityModel,
  cargoGroup: CargoGroupName,
  code: string,
  discountPercent: number,
  validUntil: string,
): CapabilityRouteItem => ({
  ...sourceRoute,
  id: `audit-route-${model.id}`,
  modelId: model.id,
  routeCode: code,
  cargoType: CARGO_TYPE[cargoGroup],
  promotionPercent: discountPercent,
  validUntil,
  pricingStyle: sourceRoute.pricingStyle || 'All-in',
  paymentTerms: sourceRoute.paymentTerms || 'Công nợ Net 30 ngày sau đối soát',
  operatingHours: sourceRoute.operatingHours || 'Vận hành và hỗ trợ khách hàng 24/7',
  cutOffTime: sourceRoute.cutOffTime || '16:30 hàng ngày',
  warehouseFreeSurcharges: sourceRoute.warehouseFreeSurcharges || model.defaultFreeSurcharges,
  warehousePaidSurcharges: sourceRoute.warehousePaidSurcharges || model.paidSurchargeOptions,
  warehouseVasItems: sourceRoute.warehouseVasItems || toWarehouseVasItems(model),
  // Keep the supplier declaration data together with the selected route.
  freeSurcharges: model.defaultFreeSurcharges,
  paidSurcharges: model.paidSurchargeOptions,
  vasList: model.defaultVas,
} as CapabilityRouteItem);

const createAuditItem = (
  category: ServiceCategoryTree,
  cargoGroup: ServiceCategoryTree['cargoGroups'][number],
  model: CapabilityModel,
  index: number,
): HotPromotionItem => {
  const meta = SERVICE_META[category.id];
  const cargoName = cargoGroup.name;
  const modelName = normalizeModelName(category.id, cargoName, model);
  const badge = BADGES[index % BADGES.length];
  const discountPercent = DISCOUNTS[index % DISCOUNTS.length];
  const validUntil = VALID_UNTIL_DATES[index % VALID_UNTIL_DATES.length];
  const code = `AUD-${meta.prefix}-${CARGO_CODE[cargoName]}-${String(index + 1).padStart(2, '0')}`;
  const fallbackRoute: CapabilityRouteItem = {
    id: `audit-source-${model.id}`,
    route: `${category.name} - ${model.name}`,
    origin: 'TP. Hồ Chí Minh',
    destination: 'Hà Nội',
    vehicleType: model.vehicleLov[0] || model.name,
    pricingUnit: model.unitLov[0] || 'Chuyến',
    price: 1_000_000,
    currency: 'VND',
    sla: '24 - 48 giờ',
    promotionPercent: discountPercent,
  };
  const route = createAuditRoute(
    model.defaultRoutes[0] || fallbackRoute,
    model,
    cargoName,
    code,
    discountPercent,
    validUntil,
  );
  const originalPriceVND = resolveVndPrice(category.id, modelName, route);
  const promotionalPriceVND = Math.max(1, Math.round(originalPriceVND * (1 - discountPercent / 100)));
  const pricingUnit = resolvePricingUnit(category.id, modelName, route);
  const description = resolveDescription(category.id, modelName, route);
  const specialist = AUDIT_SPECIALISTS[index % AUDIT_SPECIALISTS.length];
  const declaredRoutes = model.defaultRoutes.map((item, routeIndex) =>
    routeIndex === 0
      ? route
      : ({ ...item, modelId: model.id, cargoType: CARGO_TYPE[cargoName] } as CapabilityRouteItem),
  );
  const declaredModel = {
    ...model,
    title: `${category.name} - ${model.name}`,
    cargoGroupId: cargoGroup.id,
    cargoGroupName: cargoName,
    fleet: model.defaultFleet,
    operationCapacity: model.defaultOperation,
    serviceCommitment: model.defaultCommitment,
    routes: declaredRoutes.length > 0 ? declaredRoutes : [route],
    freeSurcharges: model.defaultFreeSurcharges,
    paidSurcharges: model.paidSurchargeOptions,
    vasList: model.defaultVas,
  };

  const serviceType = category.id === 'ocean' && modelName === 'LCL'
    ? 'Sea Freight (LCL)'
    : meta.serviceType;

  return {
    id: `audit-promotion-${model.id}`,
    code,
    title: `${meta.serviceGroup} · ${cargoName} · ${model.name}`,
    badgeType: badge.type,
    badgeLabel: badge.label,
    discountPercent,
    originalPriceVND,
    originalPriceDisplay: `${originalPriceVND.toLocaleString('vi-VN')} ₫`,
    promotionalPriceVND,
    promotionalPriceDisplay: `${promotionalPriceVND.toLocaleString('vi-VN')} ₫`,
    pricingUnit: `₫ / ${pricingUnit}`,
    serviceType,
    category: meta.category,
    origin: route.origin || description.main,
    destination: route.destination || description.main,
    routeDisplay: route.route || description.main,
    transitTime: route.sla || '24 - 48 giờ',
    vehicleOrUnit: route.vehicleType || route.truckBodyType || model.vehicleLov[0] || model.name,
    cargoSuitability: CARGO_SUITABILITY[cargoName],
    availableCapacity: model.defaultOperation,
    specialistId: specialist.id,
    specialistName: specialist.name,
    specialistVietnameseName: specialist.vietnameseName,
    specialistTitle: specialist.title,
    specialistAvatarInitial: specialist.avatarInitial,
    specialistPhone: specialist.phone,
    specialistRating: specialist.rating,
    specialistReviewsCount: specialist.reviewsCount,
    companyId: specialist.companyId,
    companyName: specialist.companyName,
    companyLogo: specialist.companyLogo,
    validFrom: '2026-09-01',
    validUntil,
    daysRemaining: 21 + (index % 90),
    slotsRemaining: 3 + (index % 18),
    totalSlots: 24 + (index % 36),
    minOrderQuantity: `1 ${pricingUnit}`,
    paymentTerms: route.paymentTerms || 'Công nợ Net 30 ngày sau đối soát',
    highlights: [
      model.defaultFleet,
      model.defaultOperation,
      model.defaultCommitment,
    ],
    includedPerks: model.defaultFreeSurcharges.length > 0
      ? model.defaultFreeSurcharges.slice(0, 4)
      : ['Báo giá minh bạch', 'Theo dõi trạng thái trực tuyến', 'Hóa đơn VAT điện tử'],
    notes: `Dữ liệu mock audit theo đúng cấu trúc khai báo Supplier: ${category.name} / ${cargoName} / ${model.name}.`,
    viewsCount: 650 + index * 47,
    interestedCount: 12 + (index % 39),
    inquiriesCount: 5 + (index % 31),
    bookedCount: 2 + (index % 11),
    isFeatured: index % 4 === 0,
    serviceGroup: meta.serviceGroup,
    cargoGroup: cargoName,
    serviceModel: modelName,
    descriptionMain: description.main,
    descriptionSub: description.sub,
    calculatedPriceDisplay: `${promotionalPriceVND.toLocaleString('vi-VN')} ₫ / ${pricingUnit}`,
    currency: 'VND',
    declaredRoute: route,
    declaredModel,
  };
};

export const mockPromotionAuditData: HotPromotionItem[] = CAPABILITY_SERVICE_TREE.flatMap((category) =>
  category.cargoGroups.flatMap((cargoGroup) =>
    cargoGroup.models.map((model) => ({ category, cargoGroup, model })),
  ),
).map(({ category, cargoGroup, model }, index) =>
  createAuditItem(category, cargoGroup, model, index),
);

