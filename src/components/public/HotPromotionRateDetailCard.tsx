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
  Percent,
  Clock,
  CheckCircle2,
  Building2,
  BadgeCheck,
  Phone,
  Send,
  ArrowRight,
  ShieldCheck,
  Star,
  ExternalLink,
  Plus,
  Bookmark,
  Calendar,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Briefcase,
  SlidersHorizontal,
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
  Maximize2
} from 'lucide-react';
import { HotPromotionItem, CurrentView, UserProfile } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';
import { FULL_MOCK_CAPABILITY_SERVICES, DeclaredServiceModelItem } from '../../data/mockDeclaredServices';
import { CapabilityRouteItem, WarehousePhotoItem, WarehouseTechSpecs } from '../supplier/SupplierServiceCapabilityModal';

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
    if (s.includes('sắt') || s.includes('rail')) return Truck;
    if (s.includes('quan') || s.includes('customs')) return FileCheck2;
    if (s.includes('biên') || s.includes('cross')) return Globe;
    if (s.includes('lạnh') || s.includes('cold')) return Snowflake;
    return Truck;
  };

  const ServiceIcon = getServiceIcon();

  // 3. Extract Specific Tab 3 Data Fields
  const routeCode = declaredRoute?.routeCode || item.code;
  const routeName = declaredRoute?.route || item.routeDisplay || `${item.origin} ⇄ ${item.destination}`;
  const originName = declaredRoute?.origin || item.origin;
  const destName = declaredRoute?.destination || item.destination;
  const vehicleDesc = declaredRoute?.truckBodyType || declaredRoute?.vehicleType || item.vehicleOrUnit || 'Xe Tải Thùng Kín (Dry Box)';
  const tonnageDesc = declaredRoute?.truckTonnage || 'Tiêu chuẩn ngành';
  const slaDesc = declaredRoute?.sla || item.transitTime || '24 - 48 Giờ';
  const scheduleDesc = declaredRoute?.departureSchedule || 'Hàng ngày';
  const pricingStyleDesc = declaredRoute?.pricingStyle || 'All-in';
  const validUntilDesc = declaredRoute?.validUntil || item.validUntil;

  // Surcharges from Tab 3
  const freeSurchargesList: string[] = declaredRoute?.warehouseFreeSurcharges || declaredModel?.freeSurcharges || [
    'Phí nhiên liệu & Cầu đường cao tốc (Đã bao gồm)',
    'Định vị GPS giám sát hành trình thời gian thực',
    'Miễn phí 02 giờ neo xe chờ bốc dỡ',
    'Biên bản bàn giao chứng từ ký nhận (e-POD)'
  ];

  const paidSurchargesList = declaredRoute?.warehousePaidSurcharges || declaredModel?.paidSurcharges || [
    { id: 'p-1', name: 'Phí neo xe phát sinh ngoài 2 giờ quy định', priceText: '150,000 ₫ / Giờ', isChecked: true },
    { id: 'p-2', name: 'Phí bốc xếp thủ công hạ hàng tận nơi', priceText: '350,000 ₫ / Tấn', isChecked: true },
    { id: 'p-3', name: 'Phí giao thêm điểm phụ cùng cung đường', priceText: '500,000 ₫ / Điểm', isChecked: true },
  ];

  const vasList = (declaredModel?.vasList || [
    'Dán seal chì niêm phong hàng hóa',
    'Kiểm đếm kiện tại kho',
    'Chụp ảnh nghiệm thu hiện trường'
  ]);

  // Capability commitments from Tab 3
  const fleetInfo = declaredModel?.fleet || 'Đội xe 45 xe tải thùng kín, bạt (1.5T - 15T) và 30 đầu kéo container 40ft/45ft';
  const operationInfo = declaredModel?.operationCapacity || 'Hệ thống TMS điều phối GPS 24/7, 2 tài xế/chuyến đường dài, hỗ trợ bốc xếp tại kho';
  const commitmentInfo = declaredModel?.serviceCommitment || 'Cam kết giao hàng đúng hẹn 99.6%, bảo hiểm hàng hóa 100% lên đến 5 Tỷ VND/chuyến';

  // Specific Service Group & Model Flags
  const serviceGroup = (item.serviceGroup || item.category || item.serviceType || '').toLowerCase();
  const serviceModel = (item.serviceModel || declaredModel?.serviceModel || '').toUpperCase();
  const cargoGroup = (item.cargoGroup || declaredModel?.cargoGroup || 'Hàng thường');
  const titleLower = (item.title || '').toLowerCase();
  const vehicleLower = (item.vehicleOrUnit || '').toLowerCase();

  const isCrossBorder = serviceGroup.includes('biên') || serviceGroup.includes('cross') || titleLower.includes('xuyên biên giới') || titleLower.includes('liên vận');
  const isCustoms = serviceGroup.includes('quan') || serviceGroup.includes('custom') || titleLower.includes('hải quan');
  const isWarehousing = serviceGroup.includes('kho') || serviceGroup.includes('warehous') || titleLower.includes('kho bãi');
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

  const isBonded = isWarehousing && (serviceModel.includes('NGOẠI QUAN') || serviceModel.includes('BONDED') || serviceModel.includes('CFS') || titleLower.includes('ngoại quan') || titleLower.includes('bonded'));
  const isEcom = isWarehousing && (serviceModel.includes('TMĐT') || serviceModel.includes('ECOM') || serviceModel.includes('FULFILLMENT') || titleLower.includes('fulfillment') || titleLower.includes('tmđt'));
  const isSelfStorage = isWarehousing && (serviceModel.includes('TỰ QUẢN') || serviceModel.includes('SELF') || titleLower.includes('tự quản'));
  const isColdWarehouse = isWarehousing && (cargoGroup.includes('Lạnh') || titleLower.includes('lạnh') || serviceGroup.includes('lạnh'));
  const isStandardWarehouse = isWarehousing && !isBonded && !isEcom && !isSelfStorage;

  const isCrossBorderLtl = isCrossBorder && (isLTL || titleLower.includes('ghép') || titleLower.includes('ltl'));
  const isCrossBorderFtl = isCrossBorder && !isCrossBorderLtl;

  const isXdock = isProject && (serviceModel.includes('CROSS') || serviceModel.includes('DOCK') || titleLower.includes('cross-dock') || titleLower.includes('x-dock') || titleLower.includes('hub'));
  const isPort = isProject && !isXdock;

  const isColdCargo = cargoGroup.includes('Lạnh') || cargoGroup.includes('Cold') || cargoGroup.includes('Reefer') || (item.badgeLabel || '').includes('Lạnh');
  const isHazardous = cargoGroup.includes('Nguy hiểm') || cargoGroup.includes('DG') || cargoGroup.includes('IMO') || (item.badgeLabel || '').includes('Nguy hiểm');

  const warehouseSpecs: WarehouseTechSpecs | undefined = declaredRoute?.warehouseTechSpecs || (declaredModel as any)?.techSpecs;
  const warehousePhotos: WarehousePhotoItem[] = declaredRoute?.warehousePhotos || (declaredModel as any)?.photos || [];

  return (
    <div className="bg-slate-50/95 rounded-2xl p-4 sm:p-5 border border-indigo-100 shadow-inner space-y-4 text-xs animate-in fade-in duration-150">
      {/* Main 2-Column Layout (70% Technical & Surcharges | 30% PIC & Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* =========================================================================
            LEFT COLUMN (8/12): FULL TECHNICAL DATA, SURCHARGES & CAPABILITIES
           ========================================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* KHỐI 1: THÔNG TIN CHI TIẾT (ÁNH XẠ CHUẨN TAB 3 THEO TỪNG NHÓM DỊCH VỤ) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">1</span>
                <ServiceIcon className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Thông Tin Chi Tiết</span>
                <span className="font-mono text-orange-600 font-bold ml-0.5">({routeCode})</span>
              </h4>
              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Dữ liệu gốc Tab 3
              </span>
            </div>

            {/* DYNAMIC SPECS GRID ACCORDING TO SERVICE TYPE & MODEL */}
            {/* 1. KHO BÃI 3PL */}
            {isWarehousing && isBonded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Kho HQ & Tên Kho:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">{declaredRoute?.customsWarehouseCode || declaredRoute?.warehouseCode || routeCode}</span>
                    <span className="truncate">{declaredRoute?.warehouseName || item.title}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Mô hình: Kho Ngoại Quan & Kho CFS chuyên dụng</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chi Cục Hải Quan Quản Lý:</span>
                  <p className="font-bold text-amber-900">{declaredRoute?.customsAuthority || 'Hải quan KV Cảng Cát Lái / KCN Sóng Thần'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Có cán bộ Hải quan giám sát & niêm phong tại kho</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cổng Cảng / KCN / Địa Chỉ:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.warehouseAddress || originName}</p>
                  <span className="text-[10.5px] text-slate-500 block">Khu vực: {declaredRoute?.city || 'Hồ Chí Minh / Bình Dương'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Diện Tích & Thể Tích CBM:</span>
                  <p className="font-bold text-slate-900">
                    {declaredRoute?.capacityArea ? `${declaredRoute.capacityArea.toLocaleString('vi-VN')} m²` : '18.000 m²'} • {declaredRoute?.capacityCbm ? `${declaredRoute.capacityCbm.toLocaleString('vi-VN')} m³` : '45.000 m³'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Sức chứa: {declaredRoute?.capacityPallets ? `${declaredRoute.capacityPallets.toLocaleString('vi-VN')} Pallet vị trí` : '15.000 Pallet vị trí'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Lưu Kho CBM & Pallet:</span>
                  <p className="font-bold text-emerald-700 text-sm">
                    {declaredRoute?.priceCbm ? `${declaredRoute.priceCbm.toLocaleString('vi-VN')} ₫/CBM/ngày` : `${item.promotionalPriceDisplay}`}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">
                    Đơn giá m²: {declaredRoute?.priceM2 ? `${declaredRoute.priceM2.toLocaleString('vi-VN')} ₫/m²/tháng` : '145.000 ₫/m²/tháng'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cước Sàn Tối Thiểu (Min Charge):</span>
                  <p className="font-bold text-amber-900">{(declaredRoute?.minChargeAmount || 500000).toLocaleString('vi-VN')} ₫ / Lô hàng</p>
                  <span className="text-[10.5px] text-slate-500 block">Tiền tệ niêm yết: VNĐ (Đã bao gồm giám sát)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Giờ Xe Ra Vào & Giám Sát:</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.operatingHours || 'Tiếp nhận xe 24/7 (Cả ngày lễ)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Hệ thống camera CCTV an ninh trực tuyến lưu trữ 90 ngày</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi độc quyền: Giảm {item.discountPercent}% cho 3 tháng đầu</span>
                </div>
              </div>
            )}

            {isWarehousing && isEcom && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Kho FUL & Trung Tâm Fulfillment:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">{declaredRoute?.fulfillmentCode || declaredRoute?.warehouseCode || routeCode}</span>
                    <span className="truncate">{declaredRoute?.warehouseName || item.title}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Mô hình: E-commerce Fulfillment & B2C Warehousing</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Địa Chỉ / KCN Trọng Điểm:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.warehouseAddress || originName}</p>
                  <span className="text-[10.5px] text-slate-500 block">Gần nút giao cao tốc, xe tải trung chuyển dễ dàng</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Công Suất Xử Lý Đơn Hàng:</span>
                  <p className="font-bold text-indigo-900">
                    {declaredRoute?.dailyOrderCapacity ? `${declaredRoute.dailyOrderCapacity.toLocaleString('vi-VN')} Đơn/Ngày` : '25.000 Đơn/Ngày'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Sức chứa: {declaredRoute?.skuCapacity ? `${declaredRoute.skuCapacity.toLocaleString('vi-VN')} SKUs` : '80.000 SKUs'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phí Xử Lý Đơn (Pick & Pack):</span>
                  <p className="font-bold text-emerald-700 text-sm">
                    {(declaredRoute?.pickPackFee || 4500).toLocaleString('vi-VN')} ₫ / Đơn cơ bản
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Phí thêm item: {(declaredRoute?.extraItemFee || 800).toLocaleString('vi-VN')} ₫/item</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lưu Kho Đệm (Pallet / Bins):</span>
                  <p className="font-bold text-slate-900">
                    {declaredRoute?.bufferStorageFee ? `${declaredRoute.bufferStorageFee.toLocaleString('vi-VN')} ₫/m³/tháng` : '180.000 ₫/m³/tháng'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Hệ thống kệ chia chọn đa tầng Mezzanine hiện đại</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cước Sàn Tối Thiểu (Min/Tháng):</span>
                  <p className="font-bold text-amber-900">
                    {(declaredRoute?.minMonthlyFee || 3000000).toLocaleString('vi-VN')} ₫ / Tháng
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Đã gồm tài khoản WMS quản lý tồn kho trực tiếp</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Đóng Hàng & Cut-Off Giờ:</span>
                  <p className="font-bold text-indigo-900">Cut-off 16:00 (Xuất hàng cùng ngày 99.8%)</p>
                  <span className="text-[10.5px] text-slate-500 block">Tích hợp API sàn Shopee, TikTok Shop, Lazada</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Miễn phí lưu kho đệm tháng đầu tiên</span>
                </div>
              </div>
            )}

            {isWarehousing && isSelfStorage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Kho TQ & Tên Cơ Sở:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">{declaredRoute?.warehouseCode || routeCode}</span>
                    <span className="truncate">{declaredRoute?.warehouseName || item.title}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Mô hình: Kho Tự Quản Thông Minh (Self Storage)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">KCN / Địa Chỉ Chi Tiết:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.warehouseAddress || originName}</p>
                  <span className="text-[10.5px] text-slate-500 block">Khu vực trung tâm, đường xe tải không cấm giờ</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Diện Tích Sàn & Thể Tích:</span>
                  <p className="font-bold text-slate-900">
                    {declaredRoute?.capacityArea ? `${declaredRoute.capacityArea.toLocaleString('vi-VN')} m²` : '6.000 m²'} • {declaredRoute?.capacityCbm ? `${declaredRoute.capacityCbm.toLocaleString('vi-VN')} m³` : '18.000 m³'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Số khoang phân lô: 120 khoang (10m² - 200m²)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Thuê Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">
                    {declaredRoute?.priceM2 ? `${declaredRoute.priceM2.toLocaleString('vi-VN')} ₫/m²/tháng` : item.promotionalPriceDisplay}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn vị tính: {item.pricingUnit}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cước Sàn Tối Thiểu (Min/Tháng):</span>
                  <p className="font-bold text-amber-900">{(declaredRoute?.minMonthlyFee || 1500000).toLocaleString('vi-VN')} ₫ / Tháng</p>
                  <span className="text-[10.5px] text-slate-500 block">Không bắt buộc ký hợp đồng dài hạn</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Giờ Ra Vào & Tiện Ích:</span>
                  <p className="font-bold text-indigo-900">Chủ động ra vào 24/7 bằng thẻ từ hoặc vân tay</p>
                  <span className="text-[10.5px] text-slate-500 block">Khóa riêng biệt, camera an ninh riêng từng khoang</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PCCC & Bảo Hiểm:</span>
                  <p className="font-bold text-slate-900">PCCC tự động Sprinkler thẩm duyệt nghiệm thu</p>
                  <span className="text-[10.5px] text-slate-500 block">Bảo hiểm cháy nổ cơ sở vật chất 100%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Giảm {item.discountPercent}% cho hợp đồng từ 6 tháng</span>
                </div>
              </div>
            )}

            {isWarehousing && isStandardWarehouse && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Kho & Tên Trung Tâm DC:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">{declaredRoute?.warehouseCode || routeCode}</span>
                    <span className="truncate">{declaredRoute?.warehouseName || item.title}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">
                    Phân loại: {isColdWarehouse ? 'Kho Lạnh Âm Sâu & Kho Mát Đạt Chuẩn HACCP' : 'Kho Phân Phối Tiêu Chuẩn Hiện Đại (Standard DC)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Địa Chỉ KCN & Tỉnh / TP:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.warehouseAddress || originName}</p>
                  <span className="text-[10.5px] text-slate-500 block">Khu bãi đỗ xe container rộng 4.000 m², không kẹt xe</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Quy Mô Diện Tích & Thể Tích:</span>
                  <p className="font-bold text-slate-900">
                    {declaredRoute?.capacityArea ? `${declaredRoute.capacityArea.toLocaleString('vi-VN')} m²` : '15.000 m²'} • {declaredRoute?.capacityCbm ? `${declaredRoute.capacityCbm.toLocaleString('vi-VN')} m³` : '40.000 m³'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">
                    {isColdWarehouse 
                      ? 'Dải nhiệt độ: -18°C ~ -25°C (Đông lạnh) / 0°C ~ 5°C (Mát)' 
                      : 'Chiều cao trần tĩnh: 12m | Tải trọng sàn: 5 Tấn/m²'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sức Chứa Pallet & Cửa Dock:</span>
                  <p className="font-bold text-slate-900">
                    {declaredRoute?.capacityPallets ? `${declaredRoute.capacityPallets.toLocaleString('vi-VN')} Pallet` : '12.000 Pallet vị trí'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Hệ thống 8 Cửa Dock Leveler thủy lực tự động</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Thuê Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">
                    {declaredRoute?.priceM2 ? `${declaredRoute.priceM2.toLocaleString('vi-VN')} ₫/m²/tháng` : item.promotionalPriceDisplay}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">
                    Đơn giá Pallet: {declaredRoute?.pricePallet ? `${declaredRoute.pricePallet.toLocaleString('vi-VN')} ₫/Pallet/tháng` : '135.000 ₫/Pallet/tháng'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cước Sàn Tối Thiểu (Min/Tháng):</span>
                  <p className="font-bold text-amber-900">{(declaredRoute?.minMonthlyFee || 2500000).toLocaleString('vi-VN')} ₫ / Tháng</p>
                  <span className="text-[10.5px] text-slate-500 block">Áp dụng linh hoạt theo diện tích hoặc số lượng pallet</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Vận Hành & An Ninh:</span>
                  <p className="font-bold text-indigo-900">Tiếp nhận & xuất hàng 24/7 | Xe nâng điện Reach Truck</p>
                  <span className="text-[10.5px] text-slate-500 block">WMS tích hợp Barcode quét mã vạch kiểm kê theo thời gian thực</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho hợp đồng ký mới</span>
                </div>
              </div>
            )}

            {/* 2. DỰ ÁN & KHAI THÁC CẢNG / X-DOCK */}
            {isProject && isXdock && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Trạm X-Dock & Tên Hub:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">{declaredRoute?.routeCode || routeCode}</span>
                    <span className="truncate">{declaredRoute?.warehouseName || item.title}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Trạm Cross-Docking trung chuyển & chia chọn nhanh</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">KCN / Vị Trí Trạm:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.warehouseAddress || originName}</p>
                  <span className="text-[10.5px] text-slate-500 block">Điểm giao thoa các hành lang vận tải liên tỉnh</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Công Suất Sàn Trung Chuyển:</span>
                  <p className="font-bold text-indigo-900">
                    {declaredRoute?.capacityPerDay ? `${declaredRoute.capacityPerDay.toLocaleString('vi-VN')} Tấn/Ngày` : '1.200 Tấn/Ngày'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Diện tích sàn thao tác: 8.000 m² (12 In-Docks, 16 Out-Docks)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Phân Loại & Đơn Giá CBM:</span>
                  <p className="font-bold text-emerald-700 text-sm">
                    {declaredRoute?.pricePerKg ? `${declaredRoute.pricePerKg.toLocaleString('vi-VN')} ₫/kg` : '350 ₫/kg'} • {declaredRoute?.pricePerCbm ? `${declaredRoute.pricePerCbm.toLocaleString('vi-VN')} ₫/m³` : '95.000 ₫/m³'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn giá Pallet: {(declaredRoute?.pricePerPallet || 45000).toLocaleString('vi-VN')} ₫/pallet</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cước Sàn Tối Thiểu (Min/Lô):</span>
                  <p className="font-bold text-amber-900">{(declaredRoute?.minChargeAmount || 500000).toLocaleString('vi-VN')} ₫ / Lô chuyển tiếp</p>
                  <span className="text-[10.5px] text-slate-500 block">Bao gồm phân loại theo tuyến giao hàng cuối</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Giải Phóng Sàn:</span>
                  <p className="font-bold text-indigo-900">{'< 12 Giờ (Cross-dock chuyển thẳng)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Cam kết không lưu hàng qua đêm trên sàn</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Công Nghệ Quản Lý Hub:</span>
                  <p className="font-bold text-slate-900">Hệ thống băng chuyền phân loại tự động kết hợp Barcode</p>
                  <span className="text-[10.5px] text-slate-500 block">Theo dõi luồng hàng thời gian thực trên cổng đối tác</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Giảm {item.discountPercent}% cho sản lượng vượt cam kết</span>
                </div>
              </div>
            )}

            {isProject && isPort && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Cảng / ICD & Tên Cảng Cạn:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">{declaredRoute?.routeCode || routeCode}</span>
                    <span className="truncate">{declaredRoute?.warehouseName || item.title}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Cảng cạn ICD / Depot Container tiếp vận hậu cần</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Vị Trí / Khu Bến Cảng:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.warehouseAddress || originName}</p>
                  <span className="text-[10.5px] text-slate-500 block">Kết nối luồng hàng hải & đường bộ thông suốt</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sức Chứa Bãi Chứa Cont (TEU):</span>
                  <p className="font-bold text-indigo-900">
                    {declaredRoute?.capacityTeu ? `${declaredRoute.capacityTeu.toLocaleString('vi-VN')} TEU` : '25.000 TEU'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Trang bị 6 Cẩu bờ RTG/STS và xe nâng vỏ cont hiện đại</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cước Shuttle Cont 20ft & 40ft:</span>
                  <p className="font-bold text-emerald-700 text-sm">
                    20ft: {(declaredRoute?.shuttle20Price || 750000).toLocaleString('vi-VN')} ₫ • 40ft: {(declaredRoute?.shuttle40Price || 1150000).toLocaleString('vi-VN')} ₫
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Shuttle giữa bãi ICD và cầu bến cảng chính</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phí Cẩu Nâng Hạ (Lift On / Lift Off):</span>
                  <p className="font-bold text-amber-900">
                    {(declaredRoute?.liftOnPrice || 350000).toLocaleString('vi-VN')} ₫ / Lần nâng hạ cont
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Miễn phí thời gian chờ cẩu dưới 15 phút</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Luân Chuyển Cont Bãi:</span>
                  <p className="font-bold text-indigo-900">Tiếp nhận & hạ cont 24/7 (Giải phóng xe {'< 25 phút'})</p>
                  <span className="text-[10.5px] text-slate-500 block">Hệ thống TOS điều phối bãi cont tự động</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Dịch Vụ Kèm Theo Tại Cảng:</span>
                  <p className="font-bold text-slate-900">Sửa chữa vỏ cont (IICL), vệ sinh rửa cont, cấp điện cont lạnh</p>
                  <span className="text-[10.5px] text-slate-500 block">Hỗ trợ soi chiếu container Hải quan tại bãi</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% phí nâng hạ cho hãng tàu</span>
                </div>
              </div>
            )}

            {/* 3. THỦ TỤC HẢI QUAN */}
            {isCustoms && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Dịch Vụ & Chi Cục Hải Quan Mở Tờ Khai:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">{declaredRoute?.routeCode || routeCode}</span>
                    <span className="truncate">{declaredRoute?.customsBranchName || routeName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Khu vực: {declaredRoute?.customsAreaName || originName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Loại Hình Tờ Khai Áp Dụng:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.customsDeclarationType || 'Nhập kinh doanh (A11, A12), SXXK (E21, E62)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Hình thức: {declaredRoute?.customsServiceForm || 'Đại lý Hải Quan chính thức (Ký số Đại lý)'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phí Khai Chuẩn (Luồng Xanh / Vàng):</span>
                  <p className="font-bold text-emerald-700 text-sm">{(declaredRoute?.price || 850000).toLocaleString('vi-VN')} ₫ / Tờ khai chính</p>
                  <span className="text-[10.5px] text-slate-500 block">Phí dòng hàng / tờ khai phụ: {(declaredRoute?.customsExtraItemPrice || 50000).toLocaleString('vi-VN')} ₫/tờ</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phí Kiểm Hóa Luồng Đỏ:</span>
                  <p className="font-bold text-rose-700">{(declaredRoute?.customsRedChannelPrice || 1200000).toLocaleString('vi-VN')} ₫ / Lô hàng</p>
                  <span className="text-[10.5px] text-slate-500 block">Có nhân viên hiện trường túc trực kiểm hóa 24/7</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Thông Quan Cam Kết:</span>
                  <p className="font-bold text-indigo-900">Luồng Xanh: &lt; 30 phút | Luồng Vàng: &lt; 2 Giờ làm việc</p>
                  <span className="text-[10.5px] text-slate-500 block">Kiểm tra hồ sơ chứng từ trước khi truyền chính thức</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chứng Từ & Giấy Phép Chuyên Ngành:</span>
                  <p className="font-bold text-slate-900">Hỗ trợ C/O Form D, E, AK, VK, Kiểm dịch thực vật & Hợp quy</p>
                  <span className="text-[10.5px] text-slate-500 block">Tư vấn mã HS Code và tối ưu hóa biểu thuế nhập khẩu</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phạm Vi Nghiệp Vụ Trọn Gói:</span>
                  <p className="font-bold text-slate-900">Đại lý ký số thay chủ hàng, chịu trách nhiệm pháp lý tờ khai</p>
                  <span className="text-[10.5px] text-slate-500 block">Theo dõi tình trạng thông quan trên cổng Hải quan tự động VNACCS</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho 20 tờ khai đầu tiên</span>
                </div>
              </div>
            )}

            {/* 4. VẬN TẢI XUYÊN BIÊN GIỚI */}
            {isCrossBorder && isCrossBorderLtl && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Tuyến & Hành Lang Ghép XBG:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">{routeCode}</span>
                    <span>{originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Dịch vụ ghép hàng lẻ xuyên biên giới LTL chuyên tuyến</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cửa Khẩu Biên Giới (Border Gate):</span>
                  <p className="font-bold text-amber-900">{declaredRoute?.borderGate || 'Cửa khẩu Quốc tế Hữu Nghị / Bằng Tường / Tân Thanh'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Thông quan nhanh qua luồng xe ưu tiên LTL</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Kho Gom Hàng (Origin Hub):</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.originHub || 'Hub Phật Sơn / Bằng Tường / Đông Quản'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Tiếp nhận hàng lẻ từ các nhà máy vệ tinh</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Kho Phân Phối Đích (Dest Hub):</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.destHub || 'Hub Hà Nội (Long Biên) / TP.HCM (Sóng Thần)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Hỗ trợ giao hàng tận nơi chặng cuối (Last-mile)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Cước Kg & CBM:</span>
                  <p className="font-bold text-emerald-700 text-sm">
                    Kg: {(declaredRoute?.pricePerKg || 8500).toLocaleString('vi-VN')} ₫/kg • CBM: {(declaredRoute?.pricePerCbm || 1850000).toLocaleString('vi-VN')} ₫/m³
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Cước sàn: {(declaredRoute?.minChargeAmount || 500000).toLocaleString('vi-VN')} ₫/lô</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hình Thức Thông Quan LTL:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.customsMethodLtl || 'Khai ghép tiểu ngạch hoặc Gom chung tờ khai chính ngạch'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Bao trọn thủ tục xuất nhập khẩu 2 đầu biên giới</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Giao Hàng & Lịch Chạy:</span>
                  <p className="font-bold text-indigo-900">Xe xuất bến hàng ngày (Cut-off 17:00) • SLA: {declaredRoute?.sla || '3 - 4 Ngày'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Hệ thống GPS theo dõi xe liên vận xuyên suốt hành trình</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho kiện hàng trên 300kg</span>
                </div>
              </div>
            )}

            {isCrossBorder && isCrossBorderFtl && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mã Tuyến & Hành Lang Xuyên Biên Giới:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">{routeCode}</span>
                    <span>{originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">{routeName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cửa Khẩu Biên Giới (Border Gate):</span>
                  <p className="font-bold text-amber-900">{declaredRoute?.borderGate || 'Cửa khẩu Quốc tế Hữu Nghị / Kim Thành / Mộc Bài / Cha Lo'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Làn luồng xanh thông quan ưu tiên cho xe tải liên vận</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Loại Phương Tiện / Cont XBG:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.truckBodyType || declaredRoute?.vehicleType || item.vehicleOrUnit || 'Đầu kéo Cont 40HC / 45ft Liên Vận Quốc Tế'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Có giấy phép vận tải đường bộ liên vận GMS / Việt - Trung</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phương Thức Vượt Biên & Hải Quan:</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.borderCrossingMethod || 'Đổi đầu kéo tại cửa khẩu hoặc Xe chạy thẳng sang tải Door-to-Door'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Hải quan: {declaredRoute?.customsScope || 'Bao gồm thủ tục tờ khai liên vận 2 đầu'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Giá Cước FTL Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">{item.promotionalPriceDisplay}</p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn vị: {item.pricingUnit} ({pricingStyleDesc})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Hành Trình (SLA Vận Chuyển):</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.sla || item.transitTime || '48 - 72 Giờ Door-to-Door'}</p>
                  <span className="text-[10.5px] text-slate-500 block">2 Bác tài chạy luân phiên, không dừng đỗ ngoài lộ trình</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Giám Sát Định Vị & Seal Chì:</span>
                  <p className="font-bold text-slate-900">GPS định vị quốc tế 2 đầu biên giới, dán Seal Hải quan điện tử</p>
                  <span className="text-[10.5px] text-slate-500 block">Bảo hiểm hàng hóa vận tải quốc tế đến 5 Tỷ VNĐ/chuyến</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho hợp đồng chuyến 2 chiều</span>
                </div>
              </div>
            )}

            {/* 5. VẬN TẢI HÀNG KHÔNG */}
            {isAir && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hành Lang Bay & Sân Bay Đi:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">{routeCode}</span>
                    <span>{declaredRoute?.originAirport || originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{declaredRoute?.destAirport || destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Cặp sân bay: {declaredRoute?.airportPair || 'SGN ⇄ HAN / DAD'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hãng Bay & Loại Dịch Vụ:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.airline || 'Vietnam Airlines Cargo / Vietjet Air Cargo'}</p>
                  <span className="text-[10.5px] text-slate-500 block">
                    Phân loại: {item.badgeLabel?.includes('Express') ? 'Hàng Không Chuyển Phát Hỏa Tốc (Air Express)' : 'Hàng Không Tiêu Chuẩn (General Cargo)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Cước Bay Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">{item.promotionalPriceDisplay}</p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn vị: {item.pricingUnit} (Áp dụng bậc cước +100kg Base)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Bay & SLA Vận Chuyển:</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.sla || item.transitTime || 'Bay cùng ngày (Same-day 4 - 6 Giờ)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Hàng giao tận sân bay hoặc door-to-door theo yêu cầu</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lịch Chuyến Bay & Giờ Cắt Hàng (Cut-Off):</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.departureSchedule || '4 Chuyến/Ngày (Sáng - Trưa - Chiều - Tối)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Cut-off nhận hàng trước giờ cất cánh 180 phút</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Quy Đổi Thể Tích Hàng Không:</span>
                  <p className="font-bold text-slate-900">Tỷ lệ quy đổi IATA chuẩn: 1 CBM = 167 Kg</p>
                  <span className="text-[10.5px] text-slate-500 block">Tính cước theo Gross Weight hoặc Chargeable Weight (lấy giá trị lớn hơn)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">An Ninh Hàng Không & Soi Chiếu:</span>
                  <p className="font-bold text-slate-900">Đã bao gồm phí soi chiếu an ninh X-ray & chứng từ AWB</p>
                  <span className="text-[10.5px] text-slate-500 block">Hỗ trợ cấp phiếu gửi hàng điện tử e-Airway Bill</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho khách hàng ký hợp đồng tháng</span>
                </div>
              </div>
            )}

            {/* 6. VẬN TẢI ĐƯỜNG SẮT */}
            {isRail && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hành Lang Tuyến Đường Sắt:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">{routeCode}</span>
                    <span>{declaredRoute?.originStation || originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{declaredRoute?.destStation || destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Tuyến đường sắt Bắc Nam chuyên tuyến</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Ga Xuất Phát & Ga Đến:</span>
                  <p className="font-bold text-slate-900">
                    Ga Đi: {declaredRoute?.originStation || 'Ga Sóng Thần (Bình Dương)'} • Ga Đến: {declaredRoute?.destStation || 'Ga Yên Viên / Giáp Bát (Hà Nội)'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Kho bãi ga tiếp nhận xe tải và container 40ft</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Toa Xe / Loại Vỏ Container:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.containerType || declaredRoute?.railCarType || 'Container 40HC / Toa xe chuyên dụng P/G'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Khả năng chuyên chở tải trọng lớn lên đến 28 Tấn/cont</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Cước Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">{item.promotionalPriceDisplay}</p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn vị: {item.pricingUnit} ({pricingStyleDesc})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Hành Trình (SLA):</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.sla || item.transitTime || '48 - 60 Giờ Ga - Ga'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Hành trình cố định không ảnh hưởng bởi thời tiết & kẹt xe</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tần Suất Đoàn Tàu & Giờ Xuất Phát:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.departureSchedule || 'Khởi hành hàng ngày lúc 20:00 (Đoàn tàu chuyên tuyến Giáp Bát - Sóng Thần)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Cut-off nhận container tại bãi ga trước 16:00</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Nâng Hạ Hai Đầu Ga (LO/LO):</span>
                  <p className="font-bold text-slate-900">Đã bao gồm chi phí cẩu gắp Lift On / Lift Off tại ga đi & ga đến</p>
                  <span className="text-[10.5px] text-slate-500 block">Hỗ trợ xe đầu kéo kéo cont giao tận kho khách hàng</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Giảm {item.discountPercent}% cho lô hàng từ 5 container trở lên</span>
                </div>
              </div>
            )}

            {/* 7. ĐƯỜNG BIỂN (FCL & LCL) */}
            {isOcean && isLCL && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tuyến Đóng Ghép Biển LCL:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">{routeCode}</span>
                    <span>{originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Khu vực: {declaredRoute?.region || 'Nội địa Bắc - Nam / Quốc tế Intra-Asia'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Kho CFS Đóng Hàng (Origin CFS):</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.originCfs || declaredRoute?.origin || 'CFS Cát Lái / CFS Tân Cảng Logistics'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Kho dỡ đích: {declaredRoute?.destCfs || declaredRoute?.destination || 'CFS Cảng Hải Phòng (Đình Vũ)'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Vị Đóng Ghép / Co-Loader:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.coloader || declaredRoute?.shippingLine || 'Top CFS Consolidator / Vinafco Co-loader'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Uy tín đóng ghép trực tiếp không qua trung gian</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Cước CFS Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">{item.promotionalPriceDisplay}</p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn vị: {item.pricingUnit} (Theo nguyên tắc W/M 1 CBM = 1.000 Kg)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Vận Chuyển (Transit Time):</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.sla || item.transitTime || '3 - 4 Ngày Port to Port'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Thời gian rút hàng tại kho CFS đích: &lt; 24h kể từ khi tàu cập</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lịch Đóng Cont & Giờ Cut-Off CFS:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.departureSchedule || 'Đóng cont T3 & T6 hàng tuần'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Cut-off nhận hàng tại kho CFS trước 17:00 ngày hôm trước</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chứng Từ Vận Tải Biển CFS:</span>
                  <p className="font-bold text-slate-900">Phát hành House Bill of Lading (HBL) / Vận đơn đường biển</p>
                  <span className="text-[10.5px] text-slate-500 block">Hỗ trợ khai báo E-Manifest & phân tách tờ khai thứ cấp</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho đơn hàng ghép từ 5 CBM</span>
                </div>
              </div>
            )}

            {isOcean && isFCL && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tuyến Vận Chuyển Biển FCL:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">{routeCode}</span>
                    <span>{originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Khu vực: {declaredRoute?.region || 'Tuyến Hải Phòng - TP.HCM - Đà Nẵng'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cảng Đi (POL) & Cảng Đến (POD):</span>
                  <p className="font-bold text-slate-900">
                    POL: {declaredRoute?.origin || item.origin} • POD: {declaredRoute?.destination || item.destination}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Tuyến chạy thẳng (Direct), không chuyển tải</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hãng Tàu & Loại Vỏ Container:</span>
                  <p className="font-bold text-slate-900">
                    {declaredRoute?.shippingLine || 'Vinafco / SITC / Maersk / ONE'} • {declaredRoute?.containerType || declaredRoute?.vehicleType || item.vehicleOrUnit || 'Container 40HC / 20GP'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">
                    {isColdCargo ? 'Cont Lạnh (Reefer RF) Set-point: -18°C' : 'Cont khô bách hóa tiêu chuẩn biển quốc tế'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Cước Biển Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">{item.promotionalPriceDisplay}</p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn vị: {item.pricingUnit} (Cước Ocean Freight All-in)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Hành Trình (Transit Time):</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.sla || item.transitTime || '3 - 4 Ngày Port to Port'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Lịch trình ổn định, cập cầu cảng ưu tiên</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lịch Tàu Chạy & Giờ Cắt Máng (Closing):</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.departureSchedule || 'Khởi hành T4 & T7 hàng tuần'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Closing time hạ bãi trước 12:00 ngày tàu chạy</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chính Sách Miễn Phí Dem / Det:</span>
                  <p className="font-bold text-emerald-700">
                    {declaredRoute?.freeDemDetDays ? `${declaredRoute.freeDemDetDays} Ngày lưu bãi/cont miễn phí (Dem/Det Combined)` : '14 Ngày Free Dem/Det kết hợp'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Linh hoạt thời gian lưu bãi cho khách hàng bốc hàng</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho booking đặt trước 7 ngày</span>
                </div>
              </div>
            )}

            {/* 8. ĐƯỜNG BỘ (TRUCKING FTL & LTL) */}
            {isTrucking && isLTL && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hành Lang Ghép Tuyến LTL:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">{routeCode}</span>
                    <span>{originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">{routeName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Kho Gom Hàng & Kho Phân Phối:</span>
                  <p className="font-bold text-slate-900">
                    Gom: {declaredRoute?.originHub || declaredRoute?.origin || 'Hub Miền Nam (KCN Sóng Thần)'} • Giao: {declaredRoute?.destHub || declaredRoute?.destination || 'Hub Miền Bắc (Long Biên / Bắc Ninh)'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Nhận hàng tận nơi và giao hàng tận nơi (Door-to-Door)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phương Thức Ghép & Khối Lượng Tối Thiểu:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.consolidationType || 'Ghép xe tải thùng kín / Cont đường dài chuyên tuyến'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Min Charge: {declaredRoute?.minCharge || '50 kg hoặc 0.3 CBM / Đơn'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Cước Niêm Yết:</span>
                  <p className="font-bold text-emerald-700 text-sm">{item.promotionalPriceDisplay}</p>
                  <span className="text-[10.5px] text-slate-500 block">
                    Đơn vị: {item.pricingUnit} • Cước kg: {(declaredRoute?.pricePerKg || 2500).toLocaleString('vi-VN')} ₫/kg
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Hành Trình (SLA):</span>
                  <p className="font-bold text-indigo-900">{declaredRoute?.sla || item.transitTime || '36 - 48 Giờ'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Cam kết chuẩn giờ giao hàng 99.5%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lịch Xuất Bến & Giờ Cut-Off:</span>
                  <p className="font-bold text-slate-900">{declaredRoute?.departureSchedule || '2 Chuyến/Ngày (Xuất bến 19:00 & 22:00)'}</p>
                  <span className="text-[10.5px] text-slate-500 block">Cut-off nhận hàng tại kho trước 17:00 hàng ngày</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Định Vị & e-POD Ký Nhận:</span>
                  <p className="font-bold text-slate-900">Giám sát lộ trình GPS thời gian thực và ký nhận e-POD điện tử</p>
                  <span className="text-[10.5px] text-slate-500 block">Kiểm tra hiện trạng kiện hàng và chụp ảnh bàn giao</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho khách hàng mới</span>
                </div>
              </div>
            )}

            {isTrucking && isFTL && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hành Lang Tuyến FTL:</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">{routeCode}</span>
                    <span>{originName}</span>
                    <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{destName}</span>
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">{routeName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Điểm Lấy & Trả Hàng Chi Tiết:</span>
                  <p className="font-bold text-slate-900">
                    Lấy: {declaredRoute?.origin || item.origin} • Giao: {declaredRoute?.destination || item.destination}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Chạy thẳng Direct không sang xe hạ tải</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phương Tiện / Loại Thùng Xe:</span>
                  <p className="font-bold text-slate-900">{vehicleDesc}</p>
                  <span className="text-[10.5px] text-slate-500 block">Phân khúc tải trọng: <strong className="text-slate-800">{tonnageDesc}</strong></span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn Giá Cước Nguyên Chuyến:</span>
                  <p className="font-bold text-emerald-700 text-sm">{item.promotionalPriceDisplay}</p>
                  <span className="text-[10.5px] text-slate-500 block">Đơn vị: {item.pricingUnit} ({pricingStyleDesc})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Hành Trình (SLA):</span>
                  <p className="font-bold text-indigo-900">{slaDesc}</p>
                  <span className="text-[10.5px] text-slate-500 block">Bao trọn tuyến, 2 tài xế luân phiên đảm bảo an toàn</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lịch Khởi Hành / Tần Suất:</span>
                  <p className="font-bold text-slate-900">{scheduleDesc}</p>
                  <span className="text-[10.5px] text-slate-500 block">Đáp ứng xe trong vòng 2 giờ kể từ khi xác nhận booking</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {isColdCargo ? 'Dải Nhiệt Độ & Cảm Biến IoT:' : isHazardous ? 'Cấp Độ Nguy Hiểm & PCCC:' : 'Giám Sát Hành Trình GPS:'}
                  </span>
                  <p className="font-bold text-slate-900">
                    {isColdCargo 
                      ? `${declaredRoute?.tempRange || '-18°C ~ -22°C (Frozen)'} • Cảm biến IoT 24/7` 
                      : isHazardous 
                        ? `${declaredRoute?.dgClass || 'IMO Class 3 / 8'} • Trang bị PCCC & Giấy phép` 
                        : 'Giám sát GPS thời gian thực, cảnh báo quá tốc độ'}
                  </p>
                  <span className="text-[10.5px] text-slate-500 block">Miễn phí 02 giờ neo xe chờ bốc dỡ tại mỗi đầu</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Hạn Giá & Khuyến Mãi:</span>
                  <p className="font-bold text-slate-900">{validUntilDesc}</p>
                  <span className="text-[10.5px] text-emerald-700 block font-semibold">Ưu đãi: Tiết kiệm {item.discountPercent}% cho chuyến đặt ngay hôm nay</span>
                </div>
              </div>
            )}
          </div>

          {/* KHỐI 2: CHÍNH SÁCH PHỤ PHÍ & DỊCH VỤ GIA TĂNG (VAS) - LẤY TRỰC TIẾP TỪ PHẦN 3 TAB 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">2</span>
              <span>Chính Sách Phụ Phí & Dịch Vụ Gia Tăng (VAS)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 2.1: Tiện ích đã bao gồm (Miễn phí) */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Tiện Ích Đã Bao Gồm Trong Cước (Miễn Phí)</span>
                </div>
                <div className="space-y-1.5 pt-0.5">
                  {freeSurchargesList.map((itemStr, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-100 text-xs text-slate-800 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{itemStr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2.2: Dịch vụ phụ trợ tùy chọn & Phí phát sinh */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span>Dịch Vụ Phụ Trợ Tùy Chọn & Phí Phát Sinh (Nếu có)</span>
                </div>
                <div className="space-y-1.5 pt-0.5">
                  {paidSurchargesList.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80 text-xs shadow-2xs">
                      <span className="font-medium text-slate-800">{p.name}</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] shrink-0 ml-2">
                        {p.priceText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2.3: Dịch vụ VAS nếu có */}
            {vasList.length > 0 && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dịch Vụ Gia Tăng Đặc Biệt (Value-Added Services):</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {vasList.map((vas, vIdx) => (
                    <span key={vIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-2xs">
                      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{vas}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KHỐI 3: THÔNG TIN NĂNG LỰC CHUNG & CAM KẾT SLA (TỪ PHẦN 1 TAB 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">3</span>
              <span>Năng Lực Vận Hành & Cam Kết Dịch Vụ Của Supplier</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Quy mô & Hạ tầng:</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed text-[11.5px]">{fleetInfo}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Vận hành & Công nghệ:</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed text-[11.5px]">{operationInfo}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cam kết SLA & Bồi thường:</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed text-[11.5px]">{commitmentInfo}</p>
              </div>
            </div>
          </div>

          {/* KHỐI 4 (RIÊNG CHO KHO BÃI): THÔNG SỐ KỸ THUẬT & THƯ VIỆN ẢNH KHO */}
          {isWarehousing && warehouseSpecs && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-indigo-600" />
                  <span>Thông Số Hạ Tầng Kho Bãi Đạt Chuẩn Công Nghiệp</span>
                </h4>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  Tiêu chuẩn WMS & PCCC
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Chiều cao thông thủy:</span>
                  <strong className="text-slate-800 text-xs">{warehouseSpecs.clearHeight} m</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Tải trọng sàn:</span>
                  <strong className="text-slate-800 text-xs">{warehouseSpecs.floorLoad} Tấn / m²</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Hệ thống giá kệ:</span>
                  <strong className="text-slate-800 text-xs">{warehouseSpecs.rackingLevels} tầng Selective</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Cửa Dock Leveler:</span>
                  <strong className="text-slate-800 text-xs">{warehouseSpecs.dockDoorsCount} cửa tự động</strong>
                </div>
              </div>

              {/* Photos Gallery preview if exists */}
              {warehousePhotos.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Hình ảnh thực tế bãi kho ({warehousePhotos.length} ảnh):</span>
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {warehousePhotos.slice(0, 5).map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedPhotoForPreview(photo)}
                        className="group relative h-20 rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-2xs hover:border-indigo-400 transition-all"
                        title={photo.name}
                      >
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                          <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate font-medium">
                          {photo.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT COLUMN (4/12): SPECIALIST (PIC) PROFILE & ACTION BOX
           ========================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Sales Specialist (PIC) Contact Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Chuyên Viên (PIC) Phụ Trách Tuyến
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Specialist</span>
              </span>
            </div>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0">
                {specialist.avatarInitial}
              </div>
              <div className="min-w-0">
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
                <p className="text-[11px] text-slate-500 font-medium truncate">{specialist.title}</p>
                <p className="text-[11px] font-bold text-indigo-900 truncate mt-0.5">{specialist.companyName}</p>
              </div>
            </div>

            {/* Rating & Response Rate */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Đánh giá uy tín</span>
                <span className="font-extrabold text-slate-800 text-xs flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{specialist.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({specialist.reviewsCount})</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Tốc độ phản hồi</span>
                <span className="font-extrabold text-emerald-700 text-xs block mt-0.5">&lt; 15 Phút</span>
              </div>
            </div>

            {/* Direct Contact Phone & Hotline */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-mono font-bold text-slate-800 text-xs">{specialist.phone}</span>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200 cursor-pointer"
                >
                  {copiedPhone ? 'Đã chép!' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${specialist.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
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
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Xem toàn bộ biểu giá và các tuyến khác của PIC này trong Tab 3"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Xem Hồ Sơ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Box: Book Promotion / Create Custom RFQ */}
          <div className="bg-linear-to-b from-orange-500/10 to-amber-500/5 rounded-xl border border-orange-200 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-orange-900">Khóa Giá Ưu Đãi Ngay</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Còn {item.daysRemaining || 15} ngày
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Áp dụng mức giá khuyến mãi <strong>{item.promotionalPriceDisplay}</strong> cho lô hàng của bạn theo đúng quy cách niêm yết.
            </p>

            <button
              onClick={() => onBookPromotion(item)}
              id={`book-detail-btn-${item.code}`}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Khóa Giá & Đặt Giữ Chỗ Ngay</span>
            </button>
          </div>
        </div>
      </div>

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
                className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm"
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
