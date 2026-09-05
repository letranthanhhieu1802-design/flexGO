import { HotPromotionItem, PromotionCategory, PromotionBadgeType, ServiceType } from '../types';
import { mockSalesSpecialists } from './mockSalesSpecialists';
import { FULL_MOCK_CAPABILITY_SERVICES } from './mockDeclaredServices';

// Helper function to synthesize all rate cards declared by verified supplier sales specialists into Hot Promotions / Rate Card listings
export function generateAggregatedSpecialistRates(): HotPromotionItem[] {
  const aggregated: HotPromotionItem[] = [];

  mockSalesSpecialists.forEach((specialist, specIdx) => {
    specialist.rateCard?.forEach((rc, rcIdx) => {
      // Map category
      let serviceType: ServiceType = 'Trucking';
      let category: PromotionCategory = 'Trucking';

      if (rc.category === 'Trucking') {
        serviceType = 'Trucking';
        category = 'Trucking';
      } else if (rc.category === 'Ocean') {
        serviceType = rc.vehicleOrUnit?.includes('LCL') ? 'Sea Freight (LCL)' : 'Sea Freight (FCL)';
        category = 'Sea Freight';
      } else if (rc.category === 'Air') {
        serviceType = 'Air Freight';
        category = 'Air Freight';
      } else if (rc.category === 'Customs') {
        serviceType = 'Customs Clearance';
        category = 'Customs';
      } else if (rc.category === 'Warehousing') {
        serviceType = 'Warehousing';
        category = 'Warehousing';
      } else if (rc.category === 'ColdChain') {
        serviceType = 'Cold Chain';
        category = 'Cold Chain';
      } else if (rc.category === 'CrossBorder') {
        serviceType = 'Cross-border';
        category = 'Cross-border';
      }

      // Determine Origin & Destination from routeOrService
      let origin = 'TP. Hồ Chí Minh';
      let destination = 'Hà Nội';
      const routeText = rc.routeOrService;

      if (routeText.includes('↔') || routeText.includes('→') || routeText.includes('-')) {
        const parts = routeText.split(/↔|→|-/).map(p => p.trim());
        if (parts.length >= 2) {
          origin = parts[0];
          destination = parts[1];
        }
      } else {
        origin = specialist.location || 'Toàn quốc';
        destination = rc.routeOrService;
      }

      // Compute discount percent & promo pricing
      const discountPercent = rc.isPopular ? 20 : (10 + ((specIdx * 3 + rcIdx * 5) % 15));
      const originalPriceVND = Math.round(rc.benchmarkPriceVND * (1 + discountPercent / 100));
      const promotionalPriceVND = rc.benchmarkPriceVND;

      // Badge type assignment
      let badgeType: PromotionBadgeType = 'FLASH_SALE';
      let badgeLabel = 'FLASH SALE TUẦN';
      if (routeText.toLowerCase().includes('chiều về') || routeText.toLowerCase().includes('hà nội ↔') || routeText.toLowerCase().includes('nam ↔')) {
        badgeType = 'BACKHAUL_DEAL';
        badgeLabel = 'CƯỚC CHIỀU VỀ HOT';
      } else if (rc.isPopular) {
        badgeType = 'HOT_ROUTE';
        badgeLabel = 'TUYẾN HOT CÔNG NGHIỆP';
      } else if (discountPercent >= 20) {
        badgeType = 'EXCLUSIVE_FLEXGO';
        badgeLabel = 'ĐỘC QUYỀN FLEXGO';
      } else {
        badgeType = 'VOLUME_DISCOUNT';
        badgeLabel = 'GIẢM GIÁ TRỰC TIẾP';
      }

      const promoItem: HotPromotionItem = {
        id: `spec-rate-${specialist.id}-${rc.id}`,
        code: `PRM-${rc.category.toUpperCase().slice(0, 3)}-${String(100 + specIdx * 10 + rcIdx).padStart(3, '0')}`,
        title: `${rc.routeOrService} - ${rc.vehicleOrUnit} (Giảm ${discountPercent}%)`,
        badgeType,
        badgeLabel,
        discountPercent,
        originalPriceVND,
        originalPriceDisplay: `${originalPriceVND.toLocaleString('vi-VN')} ₫`,
        promotionalPriceVND,
        promotionalPriceDisplay: rc.benchmarkPriceDisplay,
        pricingUnit: rc.vehicleOrUnit || 'VND / Đơn vị',
        serviceType,
        category,
        origin,
        destination,
        routeDisplay: rc.routeOrService,
        transitTime: rc.transitTime || '24 - 48 Giờ',
        vehicleOrUnit: rc.vehicleOrUnit,
        cargoSuitability: specialist.specialties?.[0] || 'Hàng công nghiệp, tiêu dùng, xuất nhập khẩu',
        availableCapacity: `Sẵn sàng điều xe trong 2-4h (Còn ${5 + ((specIdx + rcIdx) % 8)} suất)`,
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
        validFrom: '2026-08-01',
        validUntil: '2026-09-30',
        daysRemaining: 15 + ((specIdx * 4 + rcIdx * 2) % 20),
        slotsRemaining: 4 + ((specIdx + rcIdx * 2) % 12),
        totalSlots: 15 + (rcIdx % 10),
        minOrderQuantity: '1 Chuyến / Lô hàng',
        paymentTerms: 'Công nợ Net 30/45 ngày (Doanh nghiệp thẩm định)',
        highlights: [
          rc.priceNotes || 'Đã bao gồm chi phí cơ bản, tài xế chuyên nghiệp và bảo hiểm.',
          ...(rc.includedPerks || []),
          `Đội ngũ của ${specialist.vietnameseName} hỗ trợ trực tiếp 24/7`,
          `Bảo hiểm trách nhiệm hàng hóa lên đến 5 Tỷ VND`
        ],
        includedPerks: rc.includedPerks || ['GPS Real-time', 'Bảo hiểm hàng hóa', 'Hóa đơn VAT điện tử'],
        notes: rc.priceNotes,
        viewsCount: 650 + specIdx * 180 + rcIdx * 45,
        interestedCount: 20 + specIdx * 5 + rcIdx * 3,
        bookedCount: 3 + ((specIdx + rcIdx) % 6),
        isFeatured: rc.isPopular
      };

      aggregated.push(promoItem);
    });
  });

  return aggregated;
}

// Synthesize all routes with promotion declared by suppliers in capability tree into Hot Promotions listings
export function generateAggregatedDeclaredPromotions(): HotPromotionItem[] {
  const declaredPromoItems: HotPromotionItem[] = [];

  FULL_MOCK_CAPABILITY_SERVICES.forEach((model) => {
    model.routes.forEach((r, rIdx) => {
      const promo = r.promotionPercent || 0;
      if (promo <= 0) return;

      let category: PromotionCategory = 'Trucking';
      let serviceType: ServiceType = 'Trucking';

      if (model.id.startsWith('trk-')) {
        category = 'Trucking';
        serviceType = 'Trucking';
      } else if (model.id.startsWith('ocn-')) {
        category = 'Sea Freight';
        serviceType = model.id.includes('lcl') ? 'Sea Freight (LCL)' : 'Sea Freight (FCL)';
      } else if (model.id.startsWith('air-')) {
        category = 'Air Freight';
        serviceType = 'Air Freight';
      } else if (model.id.startsWith('cst-')) {
        category = 'Customs';
        serviceType = 'Customs Clearance';
      } else if (model.id.startsWith('wh-')) {
        category = 'Warehousing';
        serviceType = 'Warehousing';
      } else if (model.id.startsWith('cb-')) {
        category = 'Cross-border';
        serviceType = 'Cross-border';
      } else if (model.id.startsWith('prj-')) {
        category = 'Trucking';
        serviceType = 'Trucking';
      }

      const origPrice = r.price || (r.pricePerPallet ? r.pricePerPallet * 50 : 18500000);
      const promoPrice = Math.round(origPrice * (1 - promo / 100));

      const item: HotPromotionItem = {
        id: `declared-promo-${model.id}-${r.id || rIdx}`,
        code: r.routeCode || `PRM-${category.toUpperCase().slice(0, 3)}-${String(200 + rIdx * 5).padStart(3, '0')}`,
        title: `${r.route || r.warehouseName || model.title} (Giảm ${promo}%)`,
        badgeType: promo >= 10 ? 'EXCLUSIVE_FLEXGO' : 'HOT_ROUTE',
        badgeLabel: promo >= 10 ? `HOT DEAL -${promo}%` : `ƯU ĐÃI -${promo}%`,
        discountPercent: promo,
        originalPriceVND: origPrice,
        originalPriceDisplay: `${origPrice.toLocaleString('vi-VN')} ₫`,
        promotionalPriceVND: promoPrice,
        promotionalPriceDisplay: `${promoPrice.toLocaleString('vi-VN')} ₫`,
        pricingUnit: r.pricingUnit ? `VND / ${r.pricingUnit}` : 'VND / Chuyến',
        serviceType,
        category,
        origin: r.origin || r.warehouseProvince || 'Toàn quốc',
        destination: r.destination || r.warehouseAddress || 'Toàn quốc',
        routeDisplay: r.route || `${r.origin || 'Xuất phát'} → ${r.destination || 'Điểm đến'}`,
        transitTime: r.sla || '24 - 48 Giờ',
        vehicleOrUnit: r.vehicleType || r.truckBodyType || 'Chuẩn Logistics flexGO',
        cargoSuitability: 'Hàng tiêu dùng, bao bì, máy móc, linh kiện, nông sản',
        availableCapacity: `Sẵn sàng phục vụ (Đang có khuyến mãi -${promo}%)`,
        specialistId: 'sales-minh-tran',
        specialistName: 'Minh Tran',
        specialistVietnameseName: 'Trần Văn Minh',
        specialistTitle: 'Senior Key Account Manager & Freight Solutions Director',
        specialistAvatarInitial: 'TM',
        specialistPhone: '+84 (0) 908 123 456',
        specialistRating: 4.95,
        specialistReviewsCount: 184,
        companyId: 'supp-01',
        companyName: 'VinaTrans Logistics JSC',
        companyLogo: 'VT',
        validFrom: '2026-08-01',
        validUntil: r.validUntil || '2026-12-31',
        daysRemaining: 30,
        slotsRemaining: 8,
        totalSlots: 20,
        minOrderQuantity: '1 Lô / Chuyến',
        paymentTerms: 'Công nợ Net 30/45 ngày (Doanh nghiệp thẩm định)',
        highlights: [
          `Tuyến được áp dụng chính sách khuyến mãi trực tiếp -${promo}% từ nhà cung cấp`,
          'Cam kết an toàn hàng hóa 100%, bảo hiểm lên đến 5 Tỷ VND',
          'Đội ngũ chuyên viên hỗ trợ trực tiếp 24/7'
        ],
        includedPerks: ['GPS Real-time', 'Bảo hiểm hàng hóa', 'Hóa đơn VAT điện tử'],
        notes: 'Áp dụng biểu giá niêm yết từ Cây Năng Lực Dịch Vụ flexGO',
        viewsCount: 1250 + rIdx * 70,
        interestedCount: 45 + rIdx * 4,
        bookedCount: 8 + (rIdx % 5),
        isFeatured: true
      };

      declaredPromoItems.push(item);
    });
  });

  return declaredPromoItems;
}

export const allAggregatedPromotions: HotPromotionItem[] = [
  ...generateAggregatedDeclaredPromotions(),
  ...generateAggregatedSpecialistRates()
];
