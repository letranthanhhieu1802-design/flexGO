import { HotPromotionItem, PromotionCategory, PromotionBadgeType, ServiceType } from '../types';
import { mockSalesSpecialists } from './mockSalesSpecialists';

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

export const allAggregatedPromotions: HotPromotionItem[] = generateAggregatedSpecialistRates();
