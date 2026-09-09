import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Truck, 
  Save, 
  Clock, 
  Calendar, 
  Check, 
  Zap, 
  Package, 
  Box, 
  ArrowRight,
  ShieldCheck,
  Globe,
  MapPin,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { CapabilityRouteItem } from './SupplierServiceCapabilityModal';
import { getReadOnlyMatrixInteractionProps } from './readOnlyCostMatrix';
import {
  SCHEDULE_DAYS_OF_WEEK,
  SCHEDULE_FREQUENCY_PRESETS,
  SCHEDULE_DEPARTURE_TIMES,
} from './TruckingFtlCostMatrixModal';
import {
  CROSS_BORDER_GATE_GROUPS,
  CROSS_BORDER_GATES_LOV,
} from './SupplierServiceCapabilityModal';

export interface LtlTierColumn {
  id: string;
  rangeLabel: string;
  minVal?: number;
  maxVal?: number;
}

export interface LOVItem {
  id: string;
  name: string;
  unit: string;
  defaultPrice?: number;
  description?: string;
}

// Danh mục phụ phí LTL Xuyên biên giới theo bậc (Surcharges)
export const CB_LTL_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu biến động (BAF Cross-Border Fuel)', unit: 'đ / Kg & đ / CBM' },
  { id: 'hubHandling', name: 'Phí nâng hạ bến bãi & bốc xếp Hub gom hàng quốc tế', unit: 'đ / Kg & đ / CBM' },
  { id: 'borderTransshipment', name: 'Phí sang tải & bến bãi hạ tải tại cửa khẩu', unit: 'đ / Kg & đ / CBM' },
  { id: 'customsStaging', name: 'Phí hạ bãi kiểm hóa hải quan tại cửa khẩu 2 đầu', unit: 'đ / Kg & đ / CBM' },
  { id: 'driverPilot', name: 'Phí hoa tiêu / Đổi tài xế qua barie biên giới', unit: 'đ / Kg & đ / CBM' },
  { id: 'docManagement', name: 'Phí vận đơn liên vận quốc tế & Quản lý tờ khai ghép', unit: 'đ / Kg & đ / CBM' },
  { id: 'peakSeason', name: 'Phụ phí mùa vụ cao điểm / Ùn tắc cửa khẩu', unit: 'đ / Kg & đ / CBM' },
];

// Danh mục tiện ích VAS LTL Xuyên biên giới dùng chung cho tuyến
export const CB_LTL_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'doorPickup', name: 'Phí lấy hàng tận nơi (Door Pick-up)', unit: 'VND / Lô', defaultPrice: 200000 },
  { id: 'doorDelivery', name: 'Phí giao hàng tận nơi (Door Delivery)', unit: 'VND / Lô', defaultPrice: 250000 },
  { id: 'customs2ends', name: 'Thủ tục hải quan LTL trọn gói 2 đầu (VN ↔ TQ/Lào/Cam)', unit: 'VND / Bộ', defaultPrice: 1800000 },
  { id: 'eSeal', name: 'Kẹp chì điện tử định vị Hải quan (e-Seal GPS xuyên quốc gia)', unit: 'VND / Lô', defaultPrice: 300000 },
  { id: 'roamingGps', name: 'Thiết bị GPS Roaming quốc tế & Link tracking live 24/7', unit: 'VND / Lô', defaultPrice: 0 },
  { id: 'podReturn', name: 'Thu hồi chứng từ gốc & Biên bản giao nhận quốc tế (e-POD)', unit: 'VND / Bộ', defaultPrice: 0 },
  { id: 'laborHandling', name: 'Bốc vác lên tầng cao / Vào hẻm sâu / Sang bao bãi cửa khẩu', unit: 'VND / Kiện', defaultPrice: 50000 },
  { id: 'wrapPe', name: 'Quấn màng co PE & nẹp góc carton chống trầy xước', unit: 'VND / Kiện', defaultPrice: 30000 },
  { id: 'cratePallet', name: 'Đóng kiện gỗ / Đóng pallet tiêu chuẩn ISPM 15', unit: 'VND / Kiện', defaultPrice: 150000 },
  { id: 'fumigation', name: 'Hun trùng / Khử trùng kiểm dịch thực vật tại cửa khẩu', unit: 'VND / Lô', defaultPrice: 500000 },
  { id: 'allRiskInsurance', name: 'Bảo hiểm trách nhiệm hàng hóa liên vận quốc tế (All-Risk)', unit: 'VND / Lô', defaultPrice: 0 },
  { id: 'hubStorage', name: 'Phí lưu kho quá hạn tại Hub gom/đích (sau ngày miễn phí)', unit: 'VND / Kiện / Ngày', defaultPrice: 25000 },
];

// Danh mục Hình thức thông quan LTL Xuyên Biên Giới
export const CB_LTL_CUSTOMS_MODES = [
  'Chính ngạch trọn gói (Full Clearance)',
  'Chủ hàng tự mở tờ khai (Customer Self-Clearance)',
  'Ghép tờ khai chung xe (Consolidated Clearance)',
  'Sang tải phân phối tại kho bãi cửa khẩu',
];

// Danh mục Loại hình giao nhận LTL Xuyên Biên Giới
export const CB_LTL_SERVICE_MODES = [
  'Door-to-Door (Giao nhận tận nơi 2 đầu)',
  'Door-to-CFS (Lấy tận nơi, giao tại kho Hub đích)',
  'CFS-to-Door (Gửi tại kho Hub đi, giao tận nơi)',
  'CFS-to-CFS (Giao nhận tại trạm kho Hub 2 đầu)',
];

// Danh mục Tỷ lệ quy đổi thể tích sang khối lượng
export const CB_LTL_VOLUMETRIC_RATIOS = [
  '1 CBM = 333 Kg (Tiêu chuẩn đường bộ liên vận)',
  '1 CBM = 250 Kg (Tiêu chuẩn vận tải thông thường)',
  '1 CBM = 300 Kg (Hàng thương mại dày đặc)',
  '1 CBM = 200 Kg (Hàng nhẹ cồng kềnh)',
];

interface CrossBorderLtlCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CapabilityRouteItem | null;
  onSave: (routeId: string, updatedData: Partial<CapabilityRouteItem>) => void;
  cargoType?: 'general' | 'reefer' | 'hazmat';
  isReadOnly?: boolean;
}

export const CrossBorderLtlCostMatrixModal: React.FC<CrossBorderLtlCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  cargoType = 'general',
  isReadOnly = false,
}) => {
  if (!isOpen || !route) return null;

  // CÁC CỘT BẬC TRỌNG LƯỢNG (KG)
  const [weightTiers, setWeightTiers] = useState<LtlTierColumn[]>([
    { id: 'w1', rangeLabel: '< 50 Kg', minVal: 1, maxVal: 50 },
    { id: 'w2', rangeLabel: '51 – 200 Kg', minVal: 51, maxVal: 200 },
    { id: 'w3', rangeLabel: '201 – 500 Kg', minVal: 201, maxVal: 500 },
    { id: 'w4', rangeLabel: '501 – 1.000 Kg', minVal: 501, maxVal: 1000 },
    { id: 'w5', rangeLabel: '> 1.000 Kg', minVal: 1001, maxVal: 999999 },
  ]);

  // CÁC CỘT BẬC THỂ TÍCH (CBM)
  const [volumeTiers, setVolumeTiers] = useState<LtlTierColumn[]>([
    { id: 'v1', rangeLabel: '< 1.0 CBM', minVal: 0.1, maxVal: 1.0 },
    { id: 'v2', rangeLabel: '1.0 – 3.0 CBM', minVal: 1.0, maxVal: 3.0 },
    { id: 'v3', rangeLabel: '3.1 – 5.0 CBM', minVal: 3.1, maxVal: 5.0 },
    { id: 'v4', rangeLabel: '5.1 – 10.0 CBM', minVal: 5.1, maxVal: 10.0 },
    { id: 'v5', rangeLabel: '> 10.0 CBM', minVal: 10.1, maxVal: 999999 },
  ]);

  // MIN CHARGES (CƯỚC SÀN TỐI THIỂU CHO KG VÀ CHO CBM)
  const [minChargeKg, setMinChargeKg] = useState<number>(150000);
  const [minChargeCbm, setMinChargeCbm] = useState<number>(350000);

  // CƯỚC VẬN CHUYỂN CHÍNH (BASE FREIGHT)
  const [basePricesKg, setBasePricesKg] = useState<Record<string, number>>({
    w1: 3800,
    w2: 3200,
    w3: 2600,
    w4: 2100,
    w5: 1750,
  });

  const [basePricesCbm, setBasePricesCbm] = useState<Record<string, number>>({
    v1: 850000,
    v2: 750000,
    v3: 650000,
    v4: 580000,
    v5: 490000,
  });

  // HẠNG MỤC 1: PHỤ PHÍ THEO BẬC (SURCHARGES)
  const [activeSurcharges, setActiveSurcharges] = useState<string[]>([
    'fuelBAF',
    'hubHandling',
    'borderTransshipment',
  ]);

  const [surchargePricesKg, setSurchargePricesKg] = useState<Record<string, Record<string, number>>>({
    fuelBAF: { w1: 250, w2: 200, w3: 180, w4: 150, w5: 120 },
    hubHandling: { w1: 200, w2: 170, w3: 150, w4: 120, w5: 100 },
    borderTransshipment: { w1: 250, w2: 220, w3: 190, w4: 160, w5: 130 },
  });

  const [surchargePricesCbm, setSurchargePricesCbm] = useState<Record<string, Record<string, number>>>({
    fuelBAF: { v1: 50000, v2: 45000, v3: 40000, v4: 35000, v5: 30000 },
    hubHandling: { v1: 45000, v2: 40000, v3: 35000, v4: 30000, v5: 25000 },
    borderTransshipment: { v1: 55000, v2: 50000, v3: 45000, v4: 40000, v5: 35000 },
  });

  // HẠNG MỤC 2: VAS & TIỆN ÍCH KÈM THEO
  const [vasItems, setVasItems] = useState<Array<{
    id: string;
    name: string;
    unit: string;
    price: number;
    isFree: boolean;
  }>>([
    { id: 'doorPickup', name: 'Phí lấy hàng tận nơi (Door Pick-up)', unit: 'VND / Lô', price: 200000, isFree: false },
    { id: 'doorDelivery', name: 'Phí giao hàng tận nơi (Door Delivery)', unit: 'VND / Lô', price: 250000, isFree: false },
    { id: 'customs2ends', name: 'Thủ tục hải quan LTL trọn gói 2 đầu (VN ↔ TQ/Lào/Cam)', unit: 'VND / Bộ', price: 1800000, isFree: false },
    { id: 'eSeal', name: 'Kẹp chì điện tử định vị Hải quan (e-Seal GPS xuyên quốc gia)', unit: 'VND / Lô', price: 300000, isFree: false },
    { id: 'roamingGps', name: 'Thiết bị GPS Roaming quốc tế & Link tracking live 24/7', unit: 'VND / Lô', price: 0, isFree: true },
    { id: 'podReturn', name: 'Thu hồi chứng từ gốc & Biên bản giao nhận quốc tế (e-POD)', unit: 'VND / Bộ', price: 0, isFree: true },
    { id: 'laborHandling', name: 'Bốc vác lên tầng cao / Vào hẻm sâu / Sang bao bãi cửa khẩu', unit: 'VND / Kiện', price: 50000, isFree: false },
    { id: 'wrapPe', name: 'Quấn màng co PE & nẹp góc carton chống trầy xước', unit: 'VND / Kiện', price: 30000, isFree: false },
    { id: 'cratePallet', name: 'Đóng kiện gỗ / Đóng pallet tiêu chuẩn ISPM 15', unit: 'VND / Kiện', price: 150000, isFree: false },
    { id: 'fumigation', name: 'Hun trùng / Khử trùng kiểm dịch thực vật tại cửa khẩu', unit: 'VND / Lô', price: 500000, isFree: false },
  ]);

  // HẠNG MỤC 3: CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI
  const [customsMode, setCustomsMode] = useState<string>(
    route.customsLtlMode || CB_LTL_CUSTOMS_MODES[0]
  );
  const [serviceMode, setServiceMode] = useState<string>(
    (route as any).serviceMode || CB_LTL_SERVICE_MODES[0]
  );
  const [originHub, setOriginHub] = useState<string>(
    route.origin || 'Kho Hub ICD Mỹ Đình (Hà Nội)'
  );
  const [destinationHub, setDestinationHub] = useState<string>(
    route.destination || 'Kho Hub Bằng Tường / Quảng Châu (TQ)'
  );
  
  const getInferredGate = () => {
    if (route.borderGate) return route.borderGate;
    const text = `${route.route || ''} ${route.origin || ''} ${route.destination || ''}`.toLowerCase();
    if (text.includes('trung quốc') || text.includes('tq') || text.includes('quảng châu') || text.includes('bằng tường') || text.includes('hà nội') || text.includes('bắc ninh')) {
      if (text.includes('móng cái') || text.includes('đông hưng') || text.includes('quảng ninh')) {
        return 'Móng Cái / Cầu Bắc Luân II (Quảng Ninh VN ↔ Đông Hưng Quảng Tây TQ)';
      }
      if (text.includes('lào cai') || text.includes('hà khẩu')) {
        return 'Kim Thành (Lào Cai VN ↔ Hà Khẩu Vân Nam TQ)';
      }
      return 'Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường / Hữu Nghị Quan TQ)';
    }
    if (text.includes('lào') || text.includes('viêng chăn') || text.includes('thái lan') || text.includes('bangkok')) {
      if (text.includes('lao bảo') || text.includes('quảng trị') || text.includes('thái lan')) {
        return 'Lao Bảo (Quảng Trị VN ↔ Savannakhet Lào ↔ Mukdahan Thái Lan)';
      }
      return 'Cầu Treo (Hà Tĩnh VN ↔ Namphao Lào ↔ Viêng Chăn)';
    }
    if (text.includes('campuchia') || text.includes('phnom penh') || text.includes('bavet') || text.includes('hcm') || text.includes('sài gòn')) {
      return 'Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)';
    }
    return CROSS_BORDER_GATES_LOV[0];
  };

  const [borderGate, setBorderGate] = useState<string>(getInferredGate());
  const [volumetricRatio, setVolumetricRatio] = useState<string>(
    (route as any).volumetricRatio || '1 CBM = 333 Kg (Tiêu chuẩn đường bộ liên vận)'
  );
  const [departureSchedule, setDepartureSchedule] = useState<string>(
    route.departureSchedule || route.sla || 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)'
  );
  const [transitSla, setTransitSla] = useState<string>(route.sla || '24 - 48 giờ');
  const [paymentTerms, setPaymentTerms] = useState<string>((route as any).paymentTerms || 'Net 30 Days');
  const [validUntil, setValidUntil] = useState<string>(route.validUntil || '2026-12-31');

  // MODAL CẤU HÌNH LỊCH CHẠY & GIỜ XUẤT BẾN LTL
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [scheduleModalDays, setScheduleModalDays] = useState<string[]>(['Thứ 2', 'Thứ 4', 'Thứ 6']);
  const [scheduleModalTime, setScheduleModalTime] = useState<string>('20:00');

  const getSchedulePreviewString = (days: string[], time: string) => {
    if (days.length === 7) return `Hàng ngày${time ? ` (Xuất bến ${time})` : ''}`;
    if (days.length > 0) return `${days.join(', ')}${time ? ` (Xuất bến ${time})` : ''}`;
    if (time) return `Xuất bến ${time}`;
    return 'Chưa chọn lịch chạy';
  };

  const handleOpenScheduleModal = () => {
    if (departureSchedule.includes('Hàng ngày')) {
      setScheduleModalDays(SCHEDULE_DAYS_OF_WEEK.map(d => d.name));
    } else {
      const matchedDays = SCHEDULE_DAYS_OF_WEEK.filter(d => departureSchedule.includes(d.name)).map(d => d.name);
      if (matchedDays.length > 0) {
        setScheduleModalDays(matchedDays);
      } else {
        setScheduleModalDays(['Thứ 2', 'Thứ 4', 'Thứ 6']);
      }
    }

    const timeMatch = departureSchedule.match(/(\d{2}:\d{2})/);
    if (timeMatch) {
      setScheduleModalTime(timeMatch[1]);
    } else {
      setScheduleModalTime('20:00');
    }

    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    const result = getSchedulePreviewString(scheduleModalDays, scheduleModalTime);
    setDepartureSchedule(result);
    setIsScheduleModalOpen(false);
  };

  // ĐỒNG BỘ THANH CUỘN NGANG LÊN PHÍA TRÊN BẢNG MA TRẬN
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(1450);
  const tableRef = useRef<HTMLTableElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef<boolean>(false);

  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableScrollWidth(tableRef.current.scrollWidth);
      }
    };
    updateWidth();
    const timer = setTimeout(updateWidth, 200);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [weightTiers, volumeTiers]);

  const handleTopScroll = () => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    if (bottomScrollRef.current && topScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  const handleBottomScroll = () => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    if (topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  // Load existing matrix if present in route
  useEffect(() => {
    if ((route as any).ltlMatrixData) {
      const data = (route as any).ltlMatrixData;
      if (data.weightTiers && data.weightTiers.length > 0) setWeightTiers(data.weightTiers);
      if (data.volumeTiers && data.volumeTiers.length > 0) setVolumeTiers(data.volumeTiers);
      if (data.minChargeKg !== undefined) setMinChargeKg(data.minChargeKg);
      if (data.minChargeCbm !== undefined) setMinChargeCbm(data.minChargeCbm);
      if (data.basePricesKg) setBasePricesKg(data.basePricesKg);
      if (data.basePricesCbm) setBasePricesCbm(data.basePricesCbm);
      if (data.activeSurcharges) setActiveSurcharges(data.activeSurcharges);
      if (data.surchargePricesKg) setSurchargePricesKg(data.surchargePricesKg);
      if (data.surchargePricesCbm) setSurchargePricesCbm(data.surchargePricesCbm);
      if (data.vasItems) setVasItems(data.vasItems);
      if (data.customsMode) setCustomsMode(data.customsMode);
      if (data.serviceMode) setServiceMode(data.serviceMode);
      if (data.volumetricRatio) setVolumetricRatio(data.volumetricRatio);
    } else {
      if (route.pricePerKg) {
        setBasePricesKg((prev) => ({ ...prev, w1: route.pricePerKg || 3800 }));
      }
      if (route.pricePerCbm) {
        setBasePricesCbm((prev) => ({ ...prev, v1: route.pricePerCbm || 850000 }));
      }
      if (route.minChargeShipment) {
        setMinChargeKg(route.minChargeShipment);
      }
    }
    if (route.origin) setOriginHub(route.origin);
    if (route.destination) setDestinationHub(route.destination);
    if (route.borderGate) setBorderGate(route.borderGate);
    if (route.departureSchedule || route.sla) setDepartureSchedule(route.departureSchedule || route.sla || 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)');
    if (route.validUntil) setValidUntil(route.validUntil);
  }, [route]);

  // Tính All-in Price cho từng bậc Kg
  const getAllInKg = (tierId: string) => {
    const base = basePricesKg[tierId] || 0;
    let sur = 0;
    activeSurcharges.forEach(sId => {
      sur += surchargePricesKg[sId]?.[tierId] || 0;
    });
    return base + sur;
  };

  // Tính All-in Price cho từng bậc CBM
  const getAllInCbm = (tierId: string) => {
    const base = basePricesCbm[tierId] || 0;
    let sur = 0;
    activeSurcharges.forEach(sId => {
      sur += surchargePricesCbm[sId]?.[tierId] || 0;
    });
    return base + sur;
  };

  // Thêm bậc Kg
  const handleAddWeightTier = () => {
    const newId = `w_${Date.now()}`;
    const newLabel = `Bậc mới ${weightTiers.length + 1}`;
    setWeightTiers([...weightTiers, { id: newId, rangeLabel: newLabel }]);
    setBasePricesKg(prev => ({ ...prev, [newId]: 1500 }));
  };

  // Xóa bậc Kg
  const handleRemoveWeightTier = (id: string) => {
    if (weightTiers.length <= 2) return;
    setWeightTiers(weightTiers.filter(t => t.id !== id));
  };

  // Thêm bậc CBM
  const handleAddVolumeTier = () => {
    const newId = `v_${Date.now()}`;
    const newLabel = `Bậc CBM ${volumeTiers.length + 1}`;
    setVolumeTiers([...volumeTiers, { id: newId, rangeLabel: newLabel }]);
    setBasePricesCbm(prev => ({ ...prev, [newId]: 400000 }));
  };

  // Xóa bậc CBM
  const handleRemoveVolumeTier = (id: string) => {
    if (volumeTiers.length <= 2) return;
    setVolumeTiers(volumeTiers.filter(t => t.id !== id));
  };

  // Thêm phụ phí từ LOV
  const handleAddSurcharge = (id: string) => {
    if (!activeSurcharges.includes(id)) {
      setActiveSurcharges([...activeSurcharges, id]);
    }
  };

  // Xóa phụ phí
  const handleRemoveSurcharge = (id: string) => {
    setActiveSurcharges(activeSurcharges.filter(s => s !== id));
  };

  // Thêm tiện ích VAS từ LOV
  const handleAddVasItem = (item: LOVItem) => {
    if (vasItems.some(v => v.id === item.id)) return;
    setVasItems([
      ...vasItems,
      {
        id: item.id,
        name: item.name,
        unit: item.unit,
        price: item.defaultPrice || 0,
        isFree: (item.defaultPrice || 0) === 0,
      }
    ]);
  };

  // Xóa VAS
  const handleRemoveVas = (id: string) => {
    setVasItems(vasItems.filter(v => v.id !== id));
  };

  // Lưu cấu hình
  const handleSaveMatrix = () => {
    const kgPrices = Object.values(basePricesKg).filter((p): p is number => typeof p === 'number' && p > 0);
    const minKgPrice = kgPrices.length > 0 ? Math.min(...kgPrices) : 3800;
    const maxKgPrice = kgPrices.length > 0 ? Math.max(...kgPrices) : 5500;

    const cbmPrices = Object.values(basePricesCbm).filter((p): p is number => typeof p === 'number' && p > 0);
    const minCbmPrice = cbmPrices.length > 0 ? Math.min(...cbmPrices) : 490000;
    const maxCbmPrice = cbmPrices.length > 0 ? Math.max(...cbmPrices) : 850000;

    const updatedLtlPricing = {
      minCharge: minChargeKg,
      pricingBasis: route.pricingUnit === 'CBM' ? ('volume' as const) : ('weight' as const),
      currency: 'VND' as const,
      weightTiers: weightTiers.map(t => ({
        id: t.id,
        rangeLabel: t.rangeLabel,
        subLabel: '',
        minKg: t.minVal || 1,
        maxKg: t.maxVal || 999999,
        price: getAllInKg(t.id),
      })),
      volumeTiers: volumeTiers.map(t => ({
        id: t.id,
        rangeLabel: t.rangeLabel,
        subLabel: '',
        minCbm: t.minVal || 0.1,
        maxCbm: t.maxVal || 999999,
        price: getAllInCbm(t.id),
      })),
    };

    const payload: Partial<CapabilityRouteItem> & { ltlMatrixData: any; serviceMode: string; volumetricRatio: string } = {
      price: minKgPrice || 3800,
      pricePerKg: minKgPrice || 3800,
      pricePerCbm: minCbmPrice || 490000,
      minChargeShipment: minChargeKg,
      currency: 'VND',
      sla: transitSla,
      departureSchedule: departureSchedule,
      validUntil: validUntil,
      origin: originHub,
      destination: destinationHub,
      borderGate: borderGate,
      customsLtlMode: customsMode,
      serviceMode: serviceMode,
      volumetricRatio: volumetricRatio,
      ltlPricing: updatedLtlPricing,
      customRoute: `${route.route || `${originHub} ⇄ ${destinationHub}`} (Kg: ${minKgPrice.toLocaleString('vi-VN')} - ${maxKgPrice.toLocaleString('vi-VN')} đ | CBM: ${minCbmPrice.toLocaleString('vi-VN')} - ${maxCbmPrice.toLocaleString('vi-VN')} đ)`,
      ltlMatrixData: {
        weightTiers,
        volumeTiers,
        minChargeKg,
        minChargeCbm,
        basePricesKg,
        basePricesCbm,
        activeSurcharges,
        surchargePricesKg,
        surchargePricesCbm,
        vasItems,
        customsMode,
        serviceMode,
        originHub,
        destinationHub,
        borderGate,
        volumetricRatio,
        departureSchedule,
        transitSla,
        paymentTerms,
        validUntil,
      }
    };

    onSave(route.id, payload);
    onClose();
  };

  return (
    <div
      {...getReadOnlyMatrixInteractionProps(isReadOnly)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-[96vw] xl:max-w-[1550px] max-h-[94vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between border-b border-indigo-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <Truck className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10.5px] font-black tracking-wider uppercase bg-amber-400 text-amber-950 shadow-2xs">
                  Biểu Phí Chi Tiết
                </span>
                <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                  Ma Trận Đơn Giá Ghép Hàng Lẻ Đa Bậc (Road LTL Matrix)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/15">
                  VND (₫)
                </span>
              </div>
              <div className="text-xs text-indigo-200/90 font-medium mt-0.5 flex items-center gap-3 flex-wrap">
                <span>Tuyến: <strong className="text-white font-bold">{route.route || `${originHub} ⇄ ${destinationHub}`}</strong></span>
                <span className="text-indigo-400">•</span>
                <span>Từ: <strong className="text-white font-semibold">{originHub}</strong></span>
                <ArrowRight className="w-3 h-3 text-indigo-300 inline" />
                <span>Đến: <strong className="text-white font-semibold">{destinationHub}</strong></span>
                <span className="text-indigo-400">•</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                  {volumetricRatio}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              data-readonly-allow="true"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng hộp thoại"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOOLBAR NÚT HÀNH ĐỘNG THÊM BẬC */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Package className="w-4 h-4 text-indigo-600" />
            <span>Khai báo song song 2 chiều: <strong className="text-cyan-700 font-bold">Trọng Lượng (Kg)</strong> & <strong className="text-orange-700 font-bold">Thể Tích (CBM)</strong> trên cùng 1 bảng ma trận</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddWeightTier}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-700" />
              <span>+ Thêm Bậc Khối Lượng (Kg)</span>
            </button>

            <button
              type="button"
              onClick={handleAddVolumeTier}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-700" />
              <span>+ Thêm Bậc Thể Tích (CBM)</span>
            </button>
          </div>
        </div>

        {/* BẢNG MA TRẬN CUỘN NGANG (SPREADSHEET SIDE-BY-SIDE MATRIX) */}
        <div className="flex-1 overflow-auto bg-white p-4 flex flex-col">
          
          {/* THANH CUỘN NGANG PHÍA TRÊN BẢNG DỮ LIỆU */}
          <div
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="w-full overflow-x-auto overflow-y-hidden mb-2 rounded-lg bg-slate-100 border border-slate-300 shadow-2xs"
            title="Thanh cuộn ngang"
          >
            <div style={{ width: `${tableScrollWidth}px`, height: '1px' }} />
          </div>

          {/* TABLE CONTAINER: ẨN THANH CUỘN Ở ĐÁY VÀ ĐỒNG BỘ VỚI THANH CUỘN Ở TRÊN */}
          <div 
            ref={bottomScrollRef}
            onScroll={handleBottomScroll}
            className="border border-slate-300 rounded-xl overflow-x-auto shadow-xs flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <table ref={tableRef} className="w-full border-collapse text-xs text-left min-w-[1300px]">
              
              {/* THEAD: 2 TẦNG HEADER (TẦNG 1: KHỐI CHÍNH, TẦNG 2: BẬC & DẢI RANGE) */}
              <thead>
                {/* TẦNG 1 */}
                <tr className="border-b border-slate-300 text-slate-800 select-none">
                  {/* Cột 1 cố định bên trái */}
                  <th 
                    rowSpan={2} 
                    className="sticky left-0 z-30 bg-slate-100 border-r-2 border-slate-300 px-4 py-3 min-w-[320px] max-w-[320px] font-black text-slate-800 uppercase tracking-wider text-[11px] shadow-[2px_0_5px_rgba(0,0,0,0.06)] align-middle"
                  >
                    HẠNG MỤC CHI PHÍ BÁO GIÁ LTL
                  </th>

                  {/* KHỐI 1: THEO TRỌNG LƯỢNG (KG) */}
                  <th 
                    colSpan={weightTiers.length + 2} 
                    className="bg-cyan-50 border-r-2 border-cyan-400 py-2 px-3 text-center font-black text-cyan-950 uppercase tracking-wider text-xs border-b border-cyan-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-700" />
                      <span>BIỂU GIÁ THEO TRỌNG LƯỢNG (KILOGRAM - KG)</span>
                    </div>
                  </th>

                  {/* KHỐI 2: THEO THỂ TÍCH (CBM) */}
                  <th 
                    colSpan={volumeTiers.length + 2} 
                    className="bg-amber-50 py-2 px-3 text-center font-black text-amber-950 uppercase tracking-wider text-xs border-b border-amber-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Box className="w-4 h-4 text-amber-700" />
                      <span>BIỂU GIÁ THEO THỂ TÍCH (CUBIC METER - CBM)</span>
                    </div>
                  </th>
                </tr>

                {/* TẦNG 2: CỘT ĐVT, CÁC BẬC GIÁ VÀ CỘT MOQ */}
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold select-none text-[11px]">
                  {/* Khối Kg: ĐVT */}
                  <th className="bg-cyan-50/70 border-r border-cyan-200 px-2.5 py-2 text-center w-20 min-w-[75px] text-cyan-950">
                    ĐVT
                  </th>
                  
                  {/* Khối Kg: Các cột bậc */}
                  {weightTiers.map((tier, idx) => (
                    <th 
                      key={tier.id} 
                      className="bg-cyan-50/40 border-r border-cyan-200 px-2 py-1.5 text-center min-w-[105px]"
                    >
                      <div className="flex items-center justify-between text-[10px] text-cyan-800 font-semibold mb-0.5">
                        <span>BẬC #{idx + 1}</span>
                        {weightTiers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveWeightTier(tier.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                            title="Xóa bậc này"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={tier.rangeLabel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWeightTiers(weightTiers.map(t => t.id === tier.id ? { ...t, rangeLabel: val } : t));
                        }}
                        className="w-full text-center font-bold text-cyan-950 bg-white border border-cyan-300 rounded px-1.5 py-0.5 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                      />
                    </th>
                  ))}

                  {/* Khối Kg: Cột MOQ (Cước sàn) */}
                  <th className="bg-cyan-100/70 border-r-2 border-cyan-400 px-2 py-2 text-center w-28 min-w-[110px] text-cyan-950 font-black">
                    CƯỚC SÀN (MOQ)
                  </th>

                  {/* Khối CBM: ĐVT */}
                  <th className="bg-amber-50/70 border-r border-amber-200 px-2.5 py-2 text-center w-20 min-w-[75px] text-amber-950">
                    ĐVT
                  </th>

                  {/* Khối CBM: Các cột bậc */}
                  {volumeTiers.map((tier, idx) => (
                    <th 
                      key={tier.id} 
                      className="bg-amber-50/40 border-r border-amber-200 px-2 py-1.5 text-center min-w-[105px]"
                    >
                      <div className="flex items-center justify-between text-[10px] text-amber-800 font-semibold mb-0.5">
                        <span>BẬC #{idx + 1}</span>
                        {volumeTiers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVolumeTier(tier.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                            title="Xóa bậc này"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={tier.rangeLabel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVolumeTiers(volumeTiers.map(t => t.id === tier.id ? { ...t, rangeLabel: val } : t));
                        }}
                        className="w-full text-center font-bold text-amber-950 bg-white border border-amber-300 rounded px-1.5 py-0.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </th>
                  ))}

                  {/* Khối CBM: Cột MOQ (Cước sàn) */}
                  <th className="bg-amber-100/70 px-2 py-2 text-center w-28 min-w-[110px] text-amber-950 font-black">
                    CƯỚC SÀN (MOQ)
                  </th>
                </tr>
              </thead>

              {/* TBODY: DỮ LIỆU HÀNG NGANG */}
              <tbody className="divide-y divide-slate-200">
                
                {/* 1. HEADER SECTION 1: ĐƠN GIÁ CƯỚC & PHỤ PHÍ */}
                <tr className="bg-slate-100/80 font-black text-slate-800">
                  <td colSpan={1 + (weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2 text-[11px] uppercase tracking-wider text-slate-700">
                    1. CẤU TRÚC ĐƠN GIÁ CƯỚC VẬN CHUYỂN & PHỤ PHÍ THEO BẬC
                  </td>
                </tr>

                {/* DÒNG ALL-IN TỰ ĐỘNG CỘNG */}
                <tr className="bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-emerald-50/50 border-b border-emerald-200 font-bold">
                  {/* Cột cố định tên dòng */}
                  <td className="sticky left-0 z-20 bg-emerald-50 border-r-2 border-slate-300 px-4 py-2.5 text-emerald-950 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-1.5 text-xs font-black">
                      <span className="text-amber-500">☀️</span>
                      <span>ĐƠN GIÁ CHÀO THẦU TỔNG (ALL-IN FREIGHT)</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-normal">
                      = Cước chính + Các phụ phí theo bậc
                    </div>
                  </td>

                  {/* Khối Kg: ĐVT */}
                  <td className="border-r border-cyan-200 px-2 py-2 text-center font-bold text-cyan-900 bg-cyan-50/30">
                    đ/kg
                  </td>

                  {/* Khối Kg: All-in các bậc */}
                  {weightTiers.map((tier) => (
                    <td key={`allin-w-${tier.id}`} className="border-r border-cyan-200 px-2 py-2 text-right bg-cyan-50/20">
                      <span className="font-mono font-black text-cyan-900 text-xs">
                        {getAllInKg(tier.id).toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                  ))}

                  {/* Khối Kg: All-in MOQ */}
                  <td className="border-r-2 border-cyan-400 px-2 py-2 text-right bg-cyan-100/40">
                    <span className="font-mono font-black text-cyan-950 text-xs">
                      {minChargeKg.toLocaleString('vi-VN')} ₫
                    </span>
                  </td>

                  {/* Khối CBM: ĐVT */}
                  <td className="border-r border-amber-200 px-2 py-2 text-center font-bold text-amber-900 bg-amber-50/30">
                    đ/CBM
                  </td>

                  {/* Khối CBM: All-in các bậc */}
                  {volumeTiers.map((tier) => (
                    <td key={`allin-v-${tier.id}`} className="border-r border-amber-200 px-2 py-2 text-right bg-amber-50/20">
                      <span className="font-mono font-black text-amber-900 text-xs">
                        {getAllInCbm(tier.id).toLocaleString('vi-VN')} ₫
                      </span>
                    </td>
                  ))}

                  {/* Khối CBM: All-in MOQ */}
                  <td className="px-2 py-2 text-right bg-amber-100/40">
                    <span className="font-mono font-black text-amber-950 text-xs">
                      {minChargeCbm.toLocaleString('vi-VN')} ₫
                    </span>
                  </td>
                </tr>

                {/* DÒNG CƯỚC CHÍNH (BASE FREIGHT) */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span>• Cước vận chuyển chính (Base Freight)</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Cước chặng trục chính Hub-to-Hub cố định
                    </div>
                  </td>

                  {/* Khối Kg: ĐVT */}
                  <td className="border-r border-cyan-200 px-2 py-2 text-center text-slate-600 font-semibold bg-cyan-50/10">
                    đ/kg
                  </td>

                  {/* Khối Kg: Input cước chính các bậc */}
                  {weightTiers.map((tier) => (
                    <td key={`base-w-${tier.id}`} className="border-r border-cyan-200 p-1">
                      <input
                        type="number"
                        value={basePricesKg[tier.id] || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setBasePricesKg({ ...basePricesKg, [tier.id]: val });
                        }}
                        className="w-full text-right font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                        placeholder="3800"
                      />
                    </td>
                  ))}

                  {/* Khối Kg: Input Cước sàn (MOQ) */}
                  <td className="border-r-2 border-cyan-400 p-1 bg-cyan-50/20">
                    <input
                      type="number"
                      value={minChargeKg || ''}
                      onChange={(e) => setMinChargeKg(parseFloat(e.target.value) || 0)}
                      className="w-full text-right font-mono font-bold text-cyan-950 bg-white border border-cyan-300 rounded px-2 py-1 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                      placeholder="150000"
                    />
                  </td>

                  {/* Khối CBM: ĐVT */}
                  <td className="border-r border-amber-200 px-2 py-2 text-center text-slate-600 font-semibold bg-amber-50/10">
                    đ/CBM
                  </td>

                  {/* Khối CBM: Input cước chính các bậc */}
                  {volumeTiers.map((tier) => (
                    <td key={`base-v-${tier.id}`} className="border-r border-amber-200 p-1">
                      <input
                        type="number"
                        value={basePricesCbm[tier.id] || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setBasePricesCbm({ ...basePricesCbm, [tier.id]: val });
                        }}
                        className="w-full text-right font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        placeholder="850000"
                      />
                    </td>
                  ))}

                  {/* Khối CBM: Input Cước sàn (MOQ) */}
                  <td className="p-1 bg-amber-50/20">
                    <input
                      type="number"
                      value={minChargeCbm || ''}
                      onChange={(e) => setMinChargeCbm(parseFloat(e.target.value) || 0)}
                      className="w-full text-right font-mono font-bold text-amber-950 bg-white border border-amber-300 rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="350000"
                    />
                  </td>
                </tr>

                {/* CÁC PHỤ PHÍ (SURCHARGES) ĐƯỢC CHỌN TỪ LOV */}
                {activeSurcharges.map((sId) => {
                  const sInfo = CB_LTL_SECTION_1_SURCHARGES_LOV.find(s => s.id === sId) || {
                    id: sId,
                    name: sId,
                    unit: 'đ/kg & đ/CBM'
                  };

                  return (
                    <tr key={`sur-row-${sId}`} className="hover:bg-slate-50 transition-colors">
                      <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">• {sInfo.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSurcharge(sId)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                            title="Xóa phụ phí này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Khối Kg: ĐVT */}
                      <td className="border-r border-cyan-200 px-2 py-2 text-center text-slate-500 text-[11px] bg-cyan-50/10">
                        đ/kg
                      </td>

                      {/* Khối Kg: Input phụ phí theo bậc */}
                      {weightTiers.map((tier) => (
                        <td key={`sur-w-${sId}-${tier.id}`} className="border-r border-cyan-200 p-1">
                          <input
                            type="number"
                            value={surchargePricesKg[sId]?.[tier.id] || ''}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setSurchargePricesKg({
                                ...surchargePricesKg,
                                [sId]: {
                                  ...(surchargePricesKg[sId] || {}),
                                  [tier.id]: val,
                                }
                              });
                            }}
                            className="w-full text-right font-mono text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                            placeholder="0"
                          />
                        </td>
                      ))}

                      {/* Khối Kg: Cột MOQ phụ phí */}
                      <td className="border-r-2 border-cyan-400 px-2 py-2 text-center text-slate-400 bg-cyan-50/10 font-bold">
                        -
                      </td>

                      {/* Khối CBM: ĐVT */}
                      <td className="border-r border-amber-200 px-2 py-2 text-center text-slate-500 text-[11px] bg-amber-50/10">
                        đ/CBM
                      </td>

                      {/* Khối CBM: Input phụ phí theo bậc */}
                      {volumeTiers.map((tier) => (
                        <td key={`sur-v-${sId}-${tier.id}`} className="border-r border-amber-200 p-1">
                          <input
                            type="number"
                            value={surchargePricesCbm[sId]?.[tier.id] || ''}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setSurchargePricesCbm({
                                ...surchargePricesCbm,
                                [sId]: {
                                  ...(surchargePricesCbm[sId] || {}),
                                  [tier.id]: val,
                                }
                              });
                            }}
                            className="w-full text-right font-mono text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            placeholder="0"
                          />
                        </td>
                      ))}

                      {/* Khối CBM: Cột MOQ phụ phí */}
                      <td className="px-2 py-2 text-center text-slate-400 bg-amber-50/10 font-bold">
                        -
                      </td>
                    </tr>
                  );
                })}

                {/* HÀNG CHỌN THÊM PHỤ PHÍ TỪ LOV */}
                <tr data-readonly-hide="true" className="bg-slate-50/60">
                  <td colSpan={1 + (weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Thêm phụ phí LTL từ danh mục:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddSurcharge(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="" disabled>+ Chọn phụ phí thêm từ LOV ({CB_LTL_SECTION_1_SURCHARGES_LOV.length} mục)...</option>
                        {CB_LTL_SECTION_1_SURCHARGES_LOV.filter(s => !activeSurcharges.includes(s.id)).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>

                {/* 2. HEADER SECTION 2: BIỂU PHÍ VAS & TIỆN ÍCH KÈM THEO */}
                <tr className="bg-slate-100/80 font-black text-slate-800">
                  <td colSpan={1 + (weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2 text-[11px] uppercase tracking-wider text-slate-700">
                    2. BIỂU PHÍ DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH DÙNG CHUNG CHO TUYẾN
                  </td>
                </tr>

                {/* CÁC DÒNG TIỆN ÍCH VAS */}
                {vasItems.map((vas) => (
                  <tr key={`vas-row-${vas.id}`} className="hover:bg-slate-50 transition-colors">
                    {/* Cột 1: Tên dịch vụ VAS */}
                    <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">• {vas.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVas(vas.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                          title="Xóa dịch vụ này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Khối áp dụng toàn bảng cho VAS */}
                    <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-semibold w-24">ĐVT: {vas.unit}</span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVasItems(vasItems.map(v => v.id === vas.id ? { ...v, isFree: !v.isFree } : v));
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              vas.isFree
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {vas.isFree ? '✓ Miễn phí' : 'Có tính phí'}
                          </button>

                          {!vas.isFree && (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={vas.price || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setVasItems(vasItems.map(v => v.id === vas.id ? { ...v, price: val } : v));
                                }}
                                className="w-32 px-2 py-1 bg-white border border-slate-300 rounded text-right font-mono font-bold text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                placeholder="50000"
                              />
                              <span className="text-slate-600 font-medium text-xs">{vas.unit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* HÀNG THÊM TIỆN ÍCH VAS */}
                <tr data-readonly-hide="true" className="bg-slate-50/60">
                  <td colSpan={1 + (weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Thêm dịch vụ VAS từ danh mục chuẩn:</span>
                      <select
                        onChange={(e) => {
                          const item = CB_LTL_SECTION_2_VAS_LOV.find(v => v.id === e.target.value);
                          if (item) {
                            handleAddVasItem(item);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="" disabled>+ Chọn tiện ích VAS thêm ({CB_LTL_SECTION_2_VAS_LOV.length} mục)...</option>
                        {CB_LTL_SECTION_2_VAS_LOV.filter(v => !vasItems.some(item => item.id === v.id)).map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.unit})</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>

                {/* 3. HEADER SECTION 3: CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI */}
                <tr className="bg-slate-100/80 font-black text-slate-800">
                  <td colSpan={1 + (weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2 text-[11px] uppercase tracking-wider text-slate-700">
                    3. CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI
                  </td>
                </tr>

                {/* 3.1 Hình thức thông quan LTL */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <span>• Hình Thức Thông Quan LTL Xuyên Biên Giới</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">Quy trình thông quan hàng ghép tại 2 đầu cửa khẩu</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <select
                      value={customsMode}
                      onChange={(e) => setCustomsMode(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer w-full max-w-xl"
                    >
                      {CB_LTL_CUSTOMS_MODES.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* 3.2 Loại hình giao nhận LTL */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <span>• Loại Hình Giao Nhận LTL</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">Phạm vi vận tải Door-to-Door, Door-to-CFS, CFS-to-Door hoặc CFS-to-CFS</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <select
                      value={serviceMode}
                      onChange={(e) => setServiceMode(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer w-full max-w-xl"
                    >
                      {CB_LTL_SERVICE_MODES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* 3.3 Cửa khẩu biên giới */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <span>• Cửa Khẩu Biên Giới (Border Gate)</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">Cửa khẩu thông quan hàng ghép liên vận quốc tế</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <select
                      value={borderGate}
                      onChange={(e) => setBorderGate(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer w-full max-w-xl"
                    >
                      {CROSS_BORDER_GATE_GROUPS.map((grp) => (
                        <optgroup key={grp.group} label={grp.group}>
                          {grp.gates.map((gate) => (
                            <option key={gate} value={gate}>
                              {gate}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* 3.4 Kho gom và Kho giao */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <span>• Kho Gom Hàng (Origin Hub) & Kho Giao (Dest Hub)</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">Điểm tiếp nhận và bàn giao hàng lẻ liên vận</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Kho Gom Hàng (Origin CFS/Hub):</span>
                        <input
                          type="text"
                          value={originHub}
                          onChange={(e) => setOriginHub(e.target.value)}
                          placeholder="Kho Hub ICD Mỹ Đình (Hà Nội)..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Kho Giao Hàng (Destination CFS/Hub):</span>
                        <input
                          type="text"
                          value={destinationHub}
                          onChange={(e) => setDestinationHub(e.target.value)}
                          placeholder="Kho Hub Bằng Tường / Quảng Châu (TQ)..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* 3.5 Tỷ lệ quy đổi hàng nhẹ */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900">• Tỷ lệ quy đổi hàng nhẹ (Volumetric Dim Factor)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Hệ số tính Chargeable Weight chuẩn ngành gom hàng</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <select
                      value={volumetricRatio}
                      onChange={(e) => setVolumetricRatio(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                    >
                      {CB_LTL_VOLUMETRIC_RATIOS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* 3.6 Lịch xuất bến xe gom hàng lẻ */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900">• Lịch xuất bến xe gom hàng lẻ (Tần suất chạy)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Ngày gom xe và giờ xuất bến cố định trong tuần</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2.5">
                    {/* NÚT THỂ HIỆN LỊCH XUẤT BẾN NHƯ HÌNH THAM KHẢO */}
                    <button
                      type="button"
                      onClick={handleOpenScheduleModal}
                      className="px-5 py-2 bg-white hover:bg-indigo-50/50 text-slate-900 border border-indigo-400 hover:border-indigo-600 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 group"
                      title="Nhấp để mở bảng cấu hình lịch chạy & giờ xuất bến LTL"
                    >
                      <span className="font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                        {departureSchedule || 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)'}
                      </span>
                    </button>
                  </td>
                </tr>

                {/* 3.7 SLA Thời gian vận chuyển cam kết */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900">• Thời gian vận chuyển cam kết (Transit SLA)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Thời gian phát hàng kể từ khi xe xuất bến</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <input
                      type="text"
                      value={transitSla}
                      onChange={(e) => setTransitSla(e.target.value)}
                      placeholder="24 - 48 giờ"
                      className="w-48 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                </tr>

                {/* 3.8 Điều khoản thanh toán */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900">• Điều khoản thanh toán</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Net 30 Days">Net 30 Days (Thanh toán sau 30 ngày đối soát)</option>
                      <option value="Net 45 Days">Net 45 Days</option>
                      <option value="Net 15 Days">Net 15 Days</option>
                      <option value="COD">Thanh toán ngay khi giao hàng (COD)</option>
                      <option value="Prepaid">Thanh toán trước khi nhận hàng</option>
                    </select>
                  </td>
                </tr>

                {/* 3.9 Báo giá có hiệu lực đến ngày */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-slate-900">• Báo giá có hiệu lực đến ngày (Valid Until)</div>
                  </td>
                  <td colSpan={(weightTiers.length + 2) + (volumeTiers.length + 2)} className="px-4 py-2">
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Biểu phí được lưu bảo mật và tự động tính toán tổng cước khi khách hàng tra cứu theo Kg hoặc CBM</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              data-readonly-allow="true"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isReadOnly ? 'Đóng' : 'Hủy Bỏ'}
            </button>

            <button
              type="button"
              onClick={handleSaveMatrix}
              data-readonly-hide="true"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Xác Nhận & Lưu Ma Trận Biểu Phí LTL</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL: CẤU HÌNH LỊCH CHẠY & GIỜ XUẤT BẾN (CROSS-BORDER LTL) */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 shadow-indigo-600/20 text-white flex items-center justify-center shadow-md shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cấu Hình Lịch Chạy & Giờ Xuất Bến (Cross-Border LTL)
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 flex-wrap mt-0.5">
                    <span>Tuyến: <strong className="text-indigo-700">{route?.route || route?.routeCode}</strong> ({originHub} ⇄ {destinationHub})</span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-200">
                      Cửa khẩu: {borderGate.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
              {/* 1. Chọn Nhanh Tần Suất */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1. Chọn nhanh tần suất
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SCHEDULE_FREQUENCY_PRESETS.map((preset, pIdx) => {
                    const isSelected = preset.days.every(d => scheduleModalDays.includes(d)) && 
                      scheduleModalDays.length === preset.days.length;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setScheduleModalDays([...preset.days]);
                        }}
                        className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Các Ngày Chạy Trong Tuần (7/7 Ngày) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    2. Các ngày chạy trong tuần ({scheduleModalDays.length}/7 ngày)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (scheduleModalDays.length === 7) {
                        setScheduleModalDays([]);
                      } else {
                        setScheduleModalDays(SCHEDULE_DAYS_OF_WEEK.map(d => d.name));
                      }
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {scheduleModalDays.length === 7 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SCHEDULE_DAYS_OF_WEEK.map((day) => {
                    const isChecked = scheduleModalDays.includes(day.name);
                    return (
                      <label
                        key={day.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none ${
                          isChecked 
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs ring-1 ring-indigo-500/20' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let current = [...scheduleModalDays];
                            if (e.target.checked) {
                              if (!current.includes(day.name)) current.push(day.name);
                            } else {
                              current = current.filter(d => d !== day.name);
                            }
                            const sorted = SCHEDULE_DAYS_OF_WEEK.filter(d => current.includes(d.name)).map(d => d.name);
                            setScheduleModalDays(sorted);
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{day.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Thời Gian Xe Xuất Bến */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  3. Thời gian xe xuất bến
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {SCHEDULE_DEPARTURE_TIMES.map((dt, dtIdx) => {
                    const isChosen = scheduleModalTime === dt.time;
                    return (
                      <button
                        key={dtIdx}
                        type="button"
                        onClick={() => {
                          setScheduleModalTime(dt.time);
                        }}
                        className={`px-2.5 py-1.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                          isChosen
                            ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 font-medium hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold">{dt.time}</span>
                        <span className={`text-[10px] block truncate ${isChosen ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {dt.label.replace(`${dt.time} `, '')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Hoặc nhập giờ xuất bến khác:
                  </span>
                  <input
                    type="time"
                    value={scheduleModalTime || '20:00'}
                    onChange={(e) => setScheduleModalTime(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Xem Trước Chuỗi Kết Quả (Live Preview) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Xem trước hiển thị trên biểu giá xe:
                </span>
                <div className="text-xs font-bold text-indigo-900 border-indigo-200 bg-white border rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {getSchedulePreviewString(scheduleModalDays, scheduleModalTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Lưu Lịch Chạy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
