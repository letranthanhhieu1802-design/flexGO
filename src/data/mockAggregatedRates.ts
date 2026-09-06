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
      let serviceGroup = 'Đường bộ';
      let serviceModel = 'FTL';
      let cargoGroup: 'Hàng thường' | 'Hàng lạnh' | 'Hàng nguy hiểm' = 'Hàng thường';

      if (rc.category === 'Trucking') {
        serviceType = 'Trucking';
        category = 'Trucking';
        serviceGroup = 'Đường bộ';
        serviceModel = rc.vehicleOrUnit?.includes('LTL') ? 'LTL' : 'FTL';
      } else if (rc.category === 'Ocean') {
        const isLcl = rc.vehicleOrUnit?.includes('LCL');
        serviceType = isLcl ? 'Sea Freight (LCL)' : 'Sea Freight (FCL)';
        category = 'Sea Freight';
        serviceGroup = 'Đường biển';
        serviceModel = isLcl ? 'LCL' : 'FCL';
      } else if (rc.category === 'Air') {
        serviceType = 'Air Freight';
        category = 'Air Freight';
        serviceGroup = 'Hàng không';
        serviceModel = 'Air Cargo';
      } else if (rc.category === 'Customs') {
        serviceType = 'Customs Clearance';
        category = 'Customs';
        serviceGroup = 'Thủ tục hải quan';
        serviceModel = 'Cửa khẩu / ICD';
      } else if (rc.category === 'Warehousing') {
        serviceType = 'Warehousing';
        category = 'Warehousing';
        serviceGroup = 'Kho bãi 3PL';
        serviceModel = rc.routeOrService?.toLowerCase().includes('ngoại quan') ? 'Kho ngoại quan' : 'Kho thường';
      } else if (rc.category === 'ColdChain') {
        serviceType = 'Cold Chain';
        category = 'Cold Chain';
        serviceGroup = 'Đường bộ';
        serviceModel = 'FTL';
        cargoGroup = 'Hàng lạnh';
      } else if (rc.category === 'CrossBorder') {
        serviceType = 'Cross-border';
        category = 'Cross-border';
        serviceGroup = 'Xuyên biên giới';
        serviceModel = rc.vehicleOrUnit?.includes('LTL') ? 'LTL' : 'FTL';
      }

      // Check cargo group from keywords
      const lowerText = `${rc.routeOrService} ${rc.vehicleOrUnit} ${rc.priceNotes || ''}`.toLowerCase();
      if (lowerText.includes('lạnh') || lowerText.includes('cold') || lowerText.includes('âm sâu')) {
        cargoGroup = 'Hàng lạnh';
      } else if (lowerText.includes('nguy hiểm') || lowerText.includes('hóa chất') || lowerText.includes('haz') || lowerText.includes('imo')) {
        cargoGroup = 'Hàng nguy hiểm';
      }

      // Determine Origin & Destination from routeOrService
      let origin = 'TP. Hồ Chí Minh';
      let destination = 'Hà Nội';
      const routeText = rc.routeOrService;

      if (routeText.includes('↔') || routeText.includes('→') || routeText.includes('-') || routeText.includes('⇄')) {
        const parts = routeText.split(/↔|→|-|⇄/).map(p => p.trim());
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

      // Build 10-column standardized Description & Price
      let descriptionMain = rc.routeOrService;
      let descriptionSub = rc.vehicleOrUnit || 'Theo phân khúc xe';
      let calculatedPriceDisplay = `${promotionalPriceVND.toLocaleString('vi-VN')} ₫ / ${rc.vehicleOrUnit || 'Chuyến'}`;

      if (serviceGroup === 'Đường bộ') {
        descriptionMain = rc.routeOrService;
        descriptionSub = rc.vehicleOrUnit || 'Xe 15 Tấn - Thùng kín';
        calculatedPriceDisplay = serviceModel === 'LTL' 
          ? '1.650 ₫ / kg' 
          : `${promotionalPriceVND.toLocaleString('vi-VN')} ₫ / Chuyến`;
      } else if (serviceGroup === 'Đường biển') {
        descriptionMain = rc.routeOrService;
        descriptionSub = serviceModel === 'LCL' ? 'Lịch tàu: Thứ 3 & Thứ 6 hàng tuần' : 'Container 40HC';
        calculatedPriceDisplay = serviceModel === 'LCL' ? '$25 / CBM' : rc.benchmarkPriceDisplay;
      } else if (serviceGroup === 'Hàng không') {
        descriptionMain = rc.routeOrService;
        descriptionSub = 'Lịch bay: Hàng ngày (Daily Flight)';
        calculatedPriceDisplay = '24.000 ₫ / kg';
      } else if (serviceGroup === 'Kho bãi 3PL') {
        descriptionMain = rc.routeOrService;
        descriptionSub = 'Diện tích trống: 5,000 m² (4,500 Pallet)';
        calculatedPriceDisplay = '110.000 ₫ / m² / tháng';
      } else if (serviceGroup === 'Thủ tục hải quan') {
        descriptionMain = rc.routeOrService;
        descriptionSub = 'Tờ khai Nhập khẩu kinh doanh (A11, A12)';
        calculatedPriceDisplay = '850.000 ₫ / Tờ khai';
      } else if (serviceGroup === 'Xuyên biên giới') {
        descriptionMain = rc.routeOrService;
        descriptionSub = serviceModel === 'LTL' ? 'Khai báo chính ngạch kết hợp gom LTL' : 'Container 40ft / 45ft Chạy Thẳng';
        calculatedPriceDisplay = serviceModel === 'LTL' ? '18.000 ₫ / kg' : `${promotionalPriceVND.toLocaleString('vi-VN')} ₫ / Chuyến`;
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
        inquiriesCount: 12 + ((specIdx * 3 + rcIdx) % 15),
        bookedCount: 3 + ((specIdx + rcIdx) % 6),
        isFeatured: rc.isPopular,

        // Standardized 10-column fields
        serviceGroup,
        cargoGroup,
        serviceModel,
        descriptionMain,
        descriptionSub,
        calculatedPriceDisplay,
      };

      aggregated.push(promoItem);
    });
  });

  return aggregated;
}

// Synthesize all routes declared by suppliers in capability tree into Hot Promotions listings
export function generateAggregatedDeclaredPromotions(): HotPromotionItem[] {
  const declaredPromoItems: HotPromotionItem[] = [];

  FULL_MOCK_CAPABILITY_SERVICES.forEach((model, mIdx) => {
    model.routes.forEach((r, rIdx) => {
      const promo = r.promotionPercent || (rIdx % 2 === 0 ? 10 : 5);

      let category: PromotionCategory = 'Trucking';
      let serviceType: ServiceType = 'Trucking';
      let serviceGroup = 'Đường bộ';
      let serviceModel = 'FTL';
      let cargoGroup: 'Hàng thường' | 'Hàng lạnh' | 'Hàng nguy hiểm' = 'Hàng thường';

      if (model.id.startsWith('trk-')) {
        category = 'Trucking';
        serviceType = 'Trucking';
        serviceGroup = 'Đường bộ';
        serviceModel = model.id.includes('ltl') ? 'LTL' : 'FTL';
        if (model.id.includes('ref')) cargoGroup = 'Hàng lạnh';
      } else if (model.id.startsWith('sea-') || model.id.startsWith('ocn-')) {
        category = 'Sea Freight';
        const isLcl = model.id.includes('lcl');
        serviceType = isLcl ? 'Sea Freight (LCL)' : 'Sea Freight (FCL)';
        serviceGroup = 'Đường biển';
        serviceModel = isLcl ? 'LCL' : 'FCL';
      } else if (model.id.startsWith('air-')) {
        category = 'Air Freight';
        serviceType = 'Air Freight';
        serviceGroup = 'Hàng không';
        serviceModel = model.id.includes('exp') ? 'Express' : 'Air Cargo';
      } else if (model.id.startsWith('rail-')) {
        category = 'Rail Freight';
        serviceType = 'Rail Freight';
        serviceGroup = 'Đường sắt';
        serviceModel = model.id.includes('lcl') ? 'LCL' : 'FCL';
      } else if (model.id.startsWith('cst-')) {
        category = 'Customs';
        serviceType = 'Customs Clearance';
        serviceGroup = 'Thủ tục hải quan';
        serviceModel = 'Cửa khẩu / ICD';
      } else if (model.id.startsWith('wh-')) {
        category = 'Warehousing';
        serviceType = 'Warehousing';
        serviceGroup = 'Kho bãi 3PL';
        if (model.id.includes('bon')) serviceModel = 'Kho ngoại quan';
        else if (model.id.includes('ful') || model.id.includes('ecom')) serviceModel = 'Kho TMĐT';
        else if (model.id.includes('cld') || model.id.includes('cold') || model.id.includes('ref')) {
          serviceModel = 'Kho lạnh';
          cargoGroup = 'Hàng lạnh';
        } else if (model.id.includes('self')) serviceModel = 'Kho tự quản';
        else serviceModel = 'Kho thường';
      } else if (model.id.startsWith('cb-')) {
        category = 'Cross-border';
        serviceType = 'Cross-border';
        serviceGroup = 'Xuyên biên giới';
        serviceModel = model.id.includes('ltl') ? 'LTL' : 'FTL';
      } else if (model.id.startsWith('prj-') || model.id.startsWith('proj-')) {
        category = 'Project Cargo';
        serviceType = 'Project Cargo';
        serviceGroup = 'Dự án';
        if (model.id.includes('xdock')) serviceModel = 'X-dock';
        else if (model.id.includes('port')) serviceModel = 'Cảng / ICD';
        else serviceModel = 'Phân phối';
      }

      // Check keywords for cargo group
      const comboText = `${r.route || ''} ${r.truckBodyType || ''} ${r.vehicleType || ''} ${model.title || ''}`.toLowerCase();
      if (comboText.includes('lạnh') || comboText.includes('âm sâu') || comboText.includes('cold')) {
        cargoGroup = 'Hàng lạnh';
      } else if (comboText.includes('nguy hiểm') || comboText.includes('hóa chất') || comboText.includes('haz') || comboText.includes('cháy nổ')) {
        cargoGroup = 'Hàng nguy hiểm';
      }

      // Build 2-level text for Description column according to user instructions
      let descriptionMain = r.route || `${r.origin} ⇄ ${r.destination}`;
      let descriptionSub = r.truckTonnage || r.vehicleType || 'Tiêu chuẩn ngành';

      if (serviceGroup === 'Đường bộ') {
        descriptionMain = r.route || `${r.origin} ⇄ ${r.destination}`;
        descriptionSub = r.truckTonnage || r.vehicleType || 'Xe 15.0T (Tải nặng 3 chân)';
      } else if (serviceGroup === 'Đường biển') {
        descriptionMain = r.route || `${r.origin} ⇄ ${r.destination}`;
        if (serviceModel === 'FCL') {
          descriptionSub = r.truckBodyType || 'Container 40ft High Cube (40HC)';
        } else {
          descriptionSub = r.departureSchedule || 'Lịch tàu: Thứ 3 & Thứ 6 hàng tuần';
        }
      } else if (serviceGroup === 'Hàng không') {
        descriptionMain = r.route || `${r.origin} ⇄ ${r.destination}`;
        descriptionSub = r.departureSchedule || r.sla || 'Lịch bay: Hàng ngày (Daily Flight)';
      } else if (serviceGroup === 'Đường sắt') {
        descriptionMain = r.route || `${r.origin} ⇄ ${r.destination}`;
        if (serviceModel === 'FCL') {
          descriptionSub = r.truckBodyType || 'Container 40ft High Cube (40HC)';
        } else {
          descriptionSub = r.departureSchedule || 'Lịch tàu nhanh H4: Thứ 3 & Thứ 7';
        }
      } else if (serviceGroup === 'Kho bãi 3PL') {
        descriptionMain = r.warehouseAddress || r.destination || 'KCN Sóng Thần 1, TP. Dĩ An, Bình Dương';
        if (serviceModel === 'Kho TMĐT') {
          descriptionSub = `Công suất xử lý: ${(r.dailyOrderCapacity || 3500).toLocaleString('vi-VN')} đơn/ngày`;
        } else {
          const area = r.capacityArea ? `${r.capacityArea.toLocaleString('vi-VN')} m²` : '15,000 m²';
          const pallets = r.capacityPallets ? ` (${r.capacityPallets.toLocaleString('vi-VN')} Pallet)` : '';
          descriptionSub = `Diện tích trống: ${area}${pallets}`;
        }
      } else if (serviceGroup === 'Thủ tục hải quan') {
        descriptionMain = r.customsBranchName || r.customsAreaName || r.route || 'Chi Cục Hải Quan Cửa Khẩu Cảng Sài Gòn KV1 (Cát Lái)';
        descriptionSub = r.customsDeclarationType || 'Tờ khai Nhập khẩu kinh doanh (A11, A12)';
      } else if (serviceGroup === 'Xuyên biên giới') {
        descriptionMain = r.route || `${r.origin} ⇄ ${r.destination}`;
        if (serviceModel === 'FTL') {
          descriptionSub = r.truckBodyType || 'Xe Container 40ft / 45ft Chạy Thẳng';
        } else {
          descriptionSub = r.customsLtlMode || 'Thông quan chính ngạch kết hợp gom LTL';
        }
      } else if (serviceGroup === 'Dự án') {
        if (serviceModel === 'X-dock') {
          descriptionMain = r.xdockAddress || r.xdockName || 'Trạm Cross-Dock Hub Sóng Thần (Bình Dương)';
          descriptionSub = `Công suất giải phóng sàn: ${r.floorProcessingCapacity || '250 Tấn / Ngày'}`;
        } else if (serviceModel === 'Cảng / ICD') {
          descriptionMain = r.portIcdName || 'Cảng Cạn ICD Sóng Thần (Bình Dương)';
          descriptionSub = `Sức chứa bãi: ${(r.yardCapacityTeu || 15000).toLocaleString('vi-VN')} TEU`;
        } else {
          descriptionMain = r.route || 'Hành lang phân phối Hub Vệ Tinh Vùng Kinh Tế Trọng Điểm';
          descriptionSub = 'Phân phối đa điểm bán kính 50km';
        }
      }

      // Build Unit Price column based on exact formulas defined by user
      let calculatedPriceDisplay = 'Liên hệ';
      const currency = r.currency || 'VND';

      if (serviceGroup === 'Đường bộ') {
        if (serviceModel === 'FTL') {
          const p = r.price || 28500000;
          calculatedPriceDisplay = `${p.toLocaleString('vi-VN')} ₫ / ${r.pricingUnit || 'Chuyến'}`;
        } else {
          // LTL mức bậc 3
          calculatedPriceDisplay = '1.650 ₫ / kg';
        }
      } else if (serviceGroup === 'Đường biển') {
        if (serviceModel === 'FCL') {
          if (currency === 'USD') {
            calculatedPriceDisplay = `$${r.price || 450} / ${r.pricingUnit || 'Cont 40HC'}`;
          } else {
            calculatedPriceDisplay = `${(r.price || 9500000).toLocaleString('vi-VN')} ₫ / ${r.pricingUnit || 'Container'}`;
          }
        } else {
          // LCL mức bậc 2
          calculatedPriceDisplay = currency === 'USD' ? '$25 / CBM' : '450.000 ₫ / CBM';
        }
      } else if (serviceGroup === 'Hàng không') {
        // Hàng không bậc 3
        if (currency === 'USD') {
          calculatedPriceDisplay = `$${r.price || 2.85} / kg`;
        } else {
          calculatedPriceDisplay = `${(r.price || 24000).toLocaleString('vi-VN')} ₫ / kg`;
        }
      } else if (serviceGroup === 'Đường sắt') {
        if (serviceModel === 'FCL') {
          calculatedPriceDisplay = `${(r.price || 21500000).toLocaleString('vi-VN')} ₫ / ${r.pricingUnit || 'Container'}`;
        } else {
          calculatedPriceDisplay = '1.200 ₫ / kg';
        }
      } else if (serviceGroup === 'Kho bãi 3PL') {
        if (serviceModel === 'Kho TMĐT') {
          const minChg = r.minChargeMonthly || 5000000;
          calculatedPriceDisplay = `Min: ${minChg.toLocaleString('vi-VN')} ₫ / tháng`;
        } else {
          if (currency === 'USD') {
            calculatedPriceDisplay = `$${r.pricePerArea || 6.5} / m² / tháng`;
          } else {
            const areaPrice = r.pricePerArea || r.price || 95000;
            calculatedPriceDisplay = `${areaPrice.toLocaleString('vi-VN')} ₫ / m² / tháng`;
          }
        }
      } else if (serviceGroup === 'Thủ tục hải quan') {
        const stdFee = r.price || 850000;
        calculatedPriceDisplay = `${stdFee.toLocaleString('vi-VN')} ₫ / ${r.pricingUnit || 'Tờ khai'}`;
      } else if (serviceGroup === 'Xuyên biên giới') {
        if (serviceModel === 'FTL') {
          const p = r.price || 32000000;
          calculatedPriceDisplay = `${p.toLocaleString('vi-VN')} ₫ / ${r.pricingUnit || 'Chuyến'}`;
        } else {
          const kgPrice = r.pricePerKg || r.price || 18000;
          calculatedPriceDisplay = `${kgPrice.toLocaleString('vi-VN')} ₫ / kg`;
        }
      } else if (serviceGroup === 'Dự án') {
        if (serviceModel === 'X-dock') {
          const floorFee = r.pricePerKg || r.price || 180;
          calculatedPriceDisplay = `${floorFee.toLocaleString('vi-VN')} ₫ / kg (Cước sàn)`;
        } else if (serviceModel === 'Cảng / ICD') {
          const liftFee = r.priceLiftOnOff || r.price || 320000;
          calculatedPriceDisplay = `${liftFee.toLocaleString('vi-VN')} ₫ / Nâng hạ`;
        } else {
          calculatedPriceDisplay = '2.200.000 ₫ / Chuyến';
        }
      }

      const origPrice = r.price || (r.pricePerPallet ? r.pricePerPallet * 50 : 18500000);
      const promoPrice = Math.round(origPrice * (1 - promo / 100));

      const item: HotPromotionItem = {
        id: `declared-promo-${model.id}-${r.id || rIdx}`,
        code: r.routeCode || `PRM-${category.toUpperCase().slice(0, 3)}-${String(200 + mIdx * 10 + rIdx * 5).padStart(3, '0')}`,
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
          `Tuyến được áp dụng chính sách niêm yết trực tiếp từ nhà cung cấp`,
          'Cam kết an toàn hàng hóa 100%, bảo hiểm lên đến 5 Tỷ VND',
          'Đội ngũ chuyên viên hỗ trợ trực tiếp 24/7'
        ],
        includedPerks: ['GPS Real-time', 'Bảo hiểm hàng hóa', 'Hóa đơn VAT điện tử'],
        notes: 'Áp dụng biểu giá niêm yết từ Cây Năng Lực Dịch Vụ flexGO',
        viewsCount: 1250 + mIdx * 80 + rIdx * 40,
        interestedCount: 35 + mIdx * 5 + rIdx * 3,
        inquiriesCount: 15 + mIdx * 2 + rIdx,
        bookedCount: 8 + (rIdx % 5),
        isFeatured: true,

        // Standardized 10-column fields
        serviceGroup,
        cargoGroup,
        serviceModel,
        descriptionMain,
        descriptionSub,
        calculatedPriceDisplay,

        // Declared Capability Data from Tab 3 (Supplier Profile)
        declaredRoute: r,
        declaredModel: model,
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
