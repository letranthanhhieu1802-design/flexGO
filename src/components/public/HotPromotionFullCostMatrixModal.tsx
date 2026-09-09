import React, { useMemo } from 'react';
import { HotPromotionItem } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { FULL_MOCK_CAPABILITY_SERVICES, DeclaredServiceModelItem } from '../../data/mockDeclaredServices';
import { CapabilityRouteItem, WarehouseDetailModalData } from '../supplier/SupplierServiceCapabilityModal';
import { WarehouseDetailModal } from '../supplier/WarehouseDetailModal';
import { OceanFclCostMatrixModal } from '../supplier/OceanFclCostMatrixModal';
import { OceanLclCostMatrixModal } from '../supplier/OceanLclCostMatrixModal';
import { TruckingFtlCostMatrixModal } from '../supplier/TruckingFtlCostMatrixModal';
import { TruckingLtlCostMatrixModal } from '../supplier/TruckingLtlCostMatrixModal';
import { RailFclCostMatrixModal } from '../supplier/RailFclCostMatrixModal';
import { RailLclCostMatrixModal } from '../supplier/RailLclCostMatrixModal';
import { AirCargoCostMatrixModal } from '../supplier/AirCargoCostMatrixModal';
import { AirExpressCostMatrixModal } from '../supplier/AirExpressCostMatrixModal';
import { CrossBorderFtlCostMatrixModal } from '../supplier/CrossBorderFtlCostMatrixModal';
import { CrossBorderLtlCostMatrixModal } from '../supplier/CrossBorderLtlCostMatrixModal';

interface HotPromotionFullCostMatrixModalProps {
  item: HotPromotionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookPromotion?: (item: HotPromotionItem) => void;
}

export const HotPromotionFullCostMatrixModal: React.FC<HotPromotionFullCostMatrixModalProps> = ({
  item,
  isOpen,
  onClose,
  onBookPromotion,
}) => {
  if (!item || !isOpen) return null;

  // 1. Resolve declaredModel and declaredRoute
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

  // 3. Service Group & Model Flags
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

  const effectiveRoute = declaredRoute || ({
    id: item.id,
    routeCode: item.code,
    origin: item.origin,
    destination: item.destination
  } as any);

  const effectiveRouteId = effectiveRoute?.id || item.id || 'wh-route-01';

  // Warehouse specific data
  const warehouseData: WarehouseDetailModalData | undefined = (declaredRoute as any)?.warehouseDetailData || (declaredModel as any)?.warehouseDetailData;
  const fallbackWarehouseDetailData: WarehouseDetailModalData = {
    routeId: effectiveRouteId,
    warehouseName: declaredRoute?.name || item.title || 'Kho Tiêu Chuẩn Quốc Tế ICD Tân Cảng',
    warehouseCode: declaredRoute?.routeCode || item.code || 'WH-SGN-01',
    province: 'Bình Dương',
    address: declaredRoute?.warehouseAddress || item.origin || 'KCN Sóng Thần 1, TP. Dĩ An, Tỉnh Bình Dương',
    photos: [],
    techSpecs: {
      clearHeight: 12.5,
      floorLoad: 5.5,
      floorType: 'Bê tông xoa Hardener / Epoxy siêu phẳng',
      rackingTypes: ['Selective Racking 5 Tầng'],
      dockDoorsCount: 6,
      hasDockLeveler: true,
      operatingHoursTrucks: '24/7 (Không giới hạn giờ xe cont)',
      fireProtectionSystem: 'Sprinkler tự động đạt chuẩn thẩm duyệt PCCC',
      cctvSurveillance: 'Camera an ninh CCTV 24/7 toàn khuôn viên',
      wmsSoftwareName: 'WMS Infor SCM Cloud',
    },
    freeSurcharges: [],
    paidSurcharges: [],
    vasItems: [],
    capacityArea: 25000,
    availableArea: 8500,
    pricePerArea: item.promotionalPriceVND || 95000,
    currency: 'VND',
    receptionStatus: 'ready',
    operatingHours: '24/7 (Không giới hạn giờ xe cont)',
  };

  return (
    <>
      {isWarehousing && (
        <WarehouseDetailModal
          isOpen={isOpen}
          onClose={onClose}
          data={warehouseData || fallbackWarehouseDetailData}
          isReadOnly={true}
          companyName={specialist.companyName}
          onRequestQuote={() => {
            onClose();
            if (onBookPromotion) onBookPromotion(item);
          }}
        />
      )}

      {isOcean && isFCL && (
        <OceanFclCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
        />
      )}

      {isOcean && isLCL && (
        <OceanLclCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType={isColdCargo ? 'reefer' : 'general'}
        />
      )}

      {isTrucking && isFTL && (
        <TruckingFtlCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
        />
      )}

      {isTrucking && isLTL && (
        <TruckingLtlCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
        />
      )}

      {isRail && isFCL && (
        <RailFclCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType={isColdCargo ? 'reefer' : 'general'}
        />
      )}

      {isRail && isLCL && (
        <RailLclCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType="general"
        />
      )}

      {isAir && !isAirExpress && (
        <AirCargoCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
        />
      )}

      {isAirExpress && (
        <AirExpressCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
        />
      )}

      {isCrossBorder && isFTL && (
        <CrossBorderFtlCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType={isColdCargo ? 'reefer' : (isHazmatCargo ? 'hazmat' : 'general')}
        />
      )}

      {isCrossBorder && isLTL && (
        <CrossBorderLtlCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType="general"
        />
      )}

      {(isCustoms || isProject) && (
        <TruckingFtlCostMatrixModal
          isOpen={isOpen}
          onClose={onClose}
          route={effectiveRoute}
          onSave={() => {}}
          isReadOnly
          cargoType={isColdCargo ? 'reefer' : 'general'}
        />
      )}
    </>
  );
};
