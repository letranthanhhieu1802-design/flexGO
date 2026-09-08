import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  Train, 
  Layers, 
  Box, 
  DollarSign, 
  Sparkles, 
  Clock, 
  Save, 
  CheckCircle2, 
  Scale
} from 'lucide-react';
import {
  SCHEDULE_DAYS_OF_WEEK,
} from './TruckingFtlCostMatrixModal';

export const RAIL_LCL_CLOSING_TIMES = [
  { time: '17:00', label: '17:00 (Cắt máng CFS ga ca chiều)' },
  { time: '12:00', label: '12:00 (Cắt máng CFS ga ca trưa)' },
  { time: '09:00', label: '09:00 (Cắt máng CFS ga ca sáng)' },
  { time: '20:00', label: '20:00 (Cắt máng CFS ga ca tối)' },
  { time: 'Trước giờ tàu chạy 6h', label: 'Trước giờ tàu chạy 6h (Cut-off 6h)' },
  { time: 'Trước giờ tàu chạy 12h', label: 'Trước giờ tàu chạy 12h (Cut-off 12h)' },
  { time: 'Trước giờ tàu chạy 24h', label: 'Trước giờ tàu chạy 24h (Cut-off 24h)' },
];

export interface RailLclTierColumn {
  id: string;
  rangeLabel: string;
  minVal: number;
  maxVal: number;
}

export interface RailLclSurchargeItem {
  id: string;
  name: string;
  unit: string;
  type: 'variable' | 'fixed';
  defaultCbm?: number;
  defaultKg?: number;
  defaultFixedPrice?: number;
}

export interface RailLclVasItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface RailLclPricingConfig {
  currency: 'VND' | 'USD';
  volumeTiers: RailLclTierColumn[];
  weightTiers: RailLclTierColumn[];
  minChargeCbm: number;
  minChargeKg: number;
  basePricesCbm: Record<string, number>;
  basePricesKg: Record<string, number>;
  activeSurcharges: RailLclSurchargeItem[];
  variablePricesCbm: Record<string, Record<string, number>>;
  variablePricesKg: Record<string, Record<string, number>>;
  fixedPrices: Record<string, number>;
  vasItems: RailLclVasItem[];
  wmRatio: string;
  departureSchedule: string;
  railTransitTime: string;
  transitType: 'Direct Express' | 'Consolidated' | 'Transit';
  cutoffTime: string;
  maxPackageWeight: number;
  maxPackageDimension: string;
  paymentTerms: string;
  validUntil: string;
}

interface RailLclCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: any;
  onSave: (routeId: string, updatedData: any) => void;
  cargoType?: string;
}

// =========================================================================
// DANH MỤC PHỤ PHÍ CHUẨN LOV CHO RAIL LCL (ĐƯỜNG SẮT HÀNG LẺ)
// =========================================================================
export const RAIL_LCL_SURCHARGES_LOV: RailLclSurchargeItem[] = [
  // 1A. Phụ phí biến đổi theo CBM / Kg
  { id: 'thc_pol', name: 'Phí xếp dỡ tại ga gửi (Terminal Handling POL)', unit: 'VND / CBM', type: 'variable', defaultCbm: 120000, defaultKg: 120 },
  { id: 'cfs_origin_fee', name: 'Phí bốc xếp & khai thác kho CFS ga đi (CFS Fee)', unit: 'VND / CBM', type: 'variable', defaultCbm: 180000, defaultKg: 180 },
  { id: 'thc_pod', name: 'Phí xếp dỡ tại ga nhận (Terminal Handling POD)', unit: 'VND / CBM', type: 'variable', defaultCbm: 120000, defaultKg: 120 },
  { id: 'cfs_dest_fee', name: 'Phí bốc xếp & khai thác kho CFS ga đến', unit: 'VND / CBM', type: 'variable', defaultCbm: 180000, defaultKg: 180 },
  { id: 'fuel_surcharge', name: 'Phụ phí biến động nhiên liệu đầu máy kéo (Fuel Surcharge)', unit: 'VND / CBM', type: 'variable', defaultCbm: 75000, defaultKg: 75 },
  { id: 'transloading_fee', name: 'Phí chuyển tải / sang toa tại ga chuyển khổ ray (Transloading)', unit: 'VND / CBM', type: 'variable', defaultCbm: 150000, defaultKg: 150 },
  { id: 'peak_season_rail', name: 'Phụ phí mùa cao điểm đường sắt (Peak Season Surcharge)', unit: 'VND / CBM', type: 'variable', defaultCbm: 90000, defaultKg: 90 },
  { id: 'heavy_lift_surcharge', name: 'Phụ phí nâng hạ hàng nặng / siêu trường tại bãi hàng ga', unit: 'VND / CBM', type: 'variable', defaultCbm: 130000, defaultKg: 130 },
  { id: 'shunting_fee', name: 'Phí dồn dịch đầu máy & kéo toa vào đường nhánh chuyên dùng', unit: 'VND / CBM', type: 'variable', defaultCbm: 85000, defaultKg: 85 },

  // 1B. Phụ phí cố định theo Bộ chứng từ / Lô hàng
  { id: 'rail_waybill_fee', name: 'Phí phát hành vận đơn đường sắt (Rail Waybill Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 350000 },
  { id: 'rail_seal_fee', name: 'Phí kẹp chì niêm phong toa / vách ngăn ghép hàng (Rail Seal)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 150000 },
  { id: 'rail_do_fee', name: 'Phí phát hành lệnh giao hàng đường sắt (Rail D/O Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 250000 },
  { id: 'rail_handling_fee', name: 'Phí phân loại & quản lý lô hàng ghép ga (Handling Charge)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 200000 },
  { id: 'rail_manifest_fee', name: 'Phí truyền dữ liệu điện tử Hải Quan ga liên vận quốc tế', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 250000 },
  { id: 'rail_amendment_fee', name: 'Phí chỉnh sửa bổ sung thông tin vận đơn đường sắt', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 300000 },
  { id: 'rail_customs_decl', name: 'Phí thủ tục hải quan xuất nhập khẩu tại kho CFS ga', unit: 'VND / Tờ khai', type: 'fixed', defaultFixedPrice: 800000 },
  { id: 'rail_quarantine_fee', name: 'Phí hỗ trợ kiểm dịch thực vật / động vật tại ga liên vận', unit: 'VND / Lô', type: 'fixed', defaultFixedPrice: 450000 },
];

// =========================================================================
// DANH MỤC TIỆN ÍCH VAS CHUẨN LOV CHO RAIL LCL
// =========================================================================
export const RAIL_LCL_VAS_LOV: RailLclVasItem[] = [
  { id: 'vas_free_storage', name: 'Miễn phí lưu kho CFS ga (3 - 5 ngày đầu)', unit: 'VND / Lô', price: 0 },
  { id: 'vas_pickup_truck', name: 'Lấy hàng tận nơi Door Pickup bằng xe tải trung chuyển về Ga', unit: 'VND / Lô', price: 350000 },
  { id: 'vas_delivery_truck', name: 'Giao hàng tận nơi Door Delivery từ Ga đến kho người nhận', unit: 'VND / Lô', price: 400000 },
  { id: 'vas_wooden_crate', name: 'Đóng kiện gỗ & hun trùng pallet chống va đập khi tàu rung lắc', unit: 'VND / Kiện', price: 150000 },
  { id: 'vas_wrap_pe', name: 'Quấn màng co PE & nẹp góc bảo vệ chống ẩm mốc', unit: 'VND / Kiện', price: 30000 },
  { id: 'vas_lashing_airbag', name: 'Chèn lót túi khí & đai chằng buộc chống xô lệch trong toa tàu', unit: 'VND / Lô', price: 120000 },
  { id: 'vas_check_photo', name: 'Kiểm đếm số lượng, chụp ảnh đối soát tình trạng hàng tại bãi ga', unit: 'VND / Lô', price: 80000 },
  { id: 'vas_overdue_storage', name: 'Phí lưu kho CFS ga quá hạn (sau thời gian miễn phí)', unit: 'VND / CBM / Ngày', price: 20000 },
  { id: 'vas_barcode_mark', name: 'In dán mã vạch kiểm soát kiện hàng đường sắt', unit: 'VND / Kiện', price: 10000 },
  { id: 'vas_insurance', name: 'Bảo hiểm hàng hóa đường sắt toàn diện (Rail All-Risks)', unit: 'VND / Lô', price: 300000 },
];

export const RailLclCostMatrixModal: React.FC<RailLclCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
}) => {
  if (!isOpen || !route) return null;

  // TIỀN TỆ
  const [currency, setCurrency] = useState<'VND' | 'USD'>('VND');

  // KHỐI 1: BẬC THỂ TÍCH (CBM)
  const [volumeTiers, setVolumeTiers] = useState<RailLclTierColumn[]>([
    { id: 'v1', rangeLabel: '< 1.0 CBM', minVal: 0.1, maxVal: 1.0 },
    { id: 'v2', rangeLabel: '1.0 – 3.0 CBM', minVal: 1.0, maxVal: 3.0 },
    { id: 'v3', rangeLabel: '3.1 – 5.0 CBM', minVal: 3.1, maxVal: 5.0 },
    { id: 'v4', rangeLabel: '5.1 – 10.0 CBM', minVal: 5.1, maxVal: 10.0 },
    { id: 'v5', rangeLabel: '> 10.0 CBM', minVal: 10.1, maxVal: 999999 },
  ]);

  // KHỐI 2: BẬC TRỌNG LƯỢNG (KG)
  const [weightTiers, setWeightTiers] = useState<RailLclTierColumn[]>([
    { id: 'w1', rangeLabel: '< 300 Kg', minVal: 1, maxVal: 300 },
    { id: 'w2', rangeLabel: '300 – 1.000 Kg', minVal: 301, maxVal: 1000 },
    { id: 'w3', rangeLabel: '1.001 – 2.500 Kg', minVal: 1001, maxVal: 2500 },
    { id: 'w4', rangeLabel: '2.501 – 5.000 Kg', minVal: 2501, maxVal: 5000 },
    { id: 'w5', rangeLabel: '> 5.000 Kg', minVal: 5001, maxVal: 999999 },
  ]);

  // MIN CHARGES (MOQ)
  const [minChargeCbm, setMinChargeCbm] = useState<number>(350000);
  const [minChargeKg, setMinChargeKg] = useState<number>(350000);

  // CƯỚC ĐƯỜNG SẮT CƠ BẢN (BASE RAIL FREIGHT - RF)
  const [basePricesCbm, setBasePricesCbm] = useState<Record<string, number>>({
    v1: 650000,
    v2: 600000,
    v3: 550000,
    v4: 500000,
    v5: 450000,
  });

  const [basePricesKg, setBasePricesKg] = useState<Record<string, number>>({
    w1: 1800,
    w2: 1650,
    w3: 1500,
    w4: 1350,
    w5: 1200,
  });

  // MỤC 1: PHỤ PHÍ GA & ĐƯỜNG SẮT (SURCHARGES) - ACTIVE LIST
  const [activeSurcharges, setActiveSurcharges] = useState<RailLclSurchargeItem[]>([
    { id: 'thc_pol', name: 'Phí xếp dỡ tại ga gửi (Terminal Handling POL)', unit: 'VND / CBM', type: 'variable', defaultCbm: 120000, defaultKg: 120 },
    { id: 'cfs_origin_fee', name: 'Phí bốc xếp & khai thác kho CFS ga đi (CFS Fee)', unit: 'VND / CBM', type: 'variable', defaultCbm: 180000, defaultKg: 180 },
    { id: 'fuel_surcharge', name: 'Phụ phí biến động nhiên liệu đầu máy kéo (Fuel Surcharge)', unit: 'VND / CBM', type: 'variable', defaultCbm: 75000, defaultKg: 75 },
    { id: 'thc_pod', name: 'Phí xếp dỡ tại ga nhận (Terminal Handling POD)', unit: 'VND / CBM', type: 'variable', defaultCbm: 120000, defaultKg: 120 },
    { id: 'rail_waybill_fee', name: 'Phí phát hành vận đơn đường sắt (Rail Waybill Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 350000 },
    { id: 'rail_seal_fee', name: 'Phí kẹp chì niêm phong toa / vách ngăn ghép hàng', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 150000 },
    { id: 'rail_do_fee', name: 'Phí phát hành lệnh giao hàng đường sắt (Rail D/O Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 250000 },
  ]);

  // GIÁ PHỤ PHÍ BIẾN ĐỔI THEO CBM VÀ KG
  const [variablePricesCbm, setVariablePricesCbm] = useState<Record<string, Record<string, number>>>({
    thc_pol: { v1: 120000, v2: 120000, v3: 110000, v4: 100000, v5: 90000 },
    cfs_origin_fee: { v1: 180000, v2: 180000, v3: 170000, v4: 160000, v5: 150000 },
    fuel_surcharge: { v1: 75000, v2: 75000, v3: 70000, v4: 65000, v5: 60000 },
    thc_pod: { v1: 120000, v2: 120000, v3: 110000, v4: 100000, v5: 90000 },
  });

  const [variablePricesKg, setVariablePricesKg] = useState<Record<string, Record<string, number>>>({
    thc_pol: { w1: 120, w2: 120, w3: 110, w4: 100, w5: 90 },
    cfs_origin_fee: { w1: 180, w2: 180, w3: 170, w4: 160, w5: 150 },
    fuel_surcharge: { w1: 75, w2: 75, w3: 70, w4: 65, w5: 60 },
    thc_pod: { w1: 120, w2: 120, w3: 110, w4: 100, w5: 90 },
  });

  // GIÁ PHỤ PHÍ CỐ ĐỊNH (THEO BỘ CHỨNG TỪ / LÔ)
  const [fixedPrices, setFixedPrices] = useState<Record<string, number>>({
    rail_waybill_fee: 350000,
    rail_seal_fee: 150000,
    rail_do_fee: 250000,
  });

  // MỤC 2: VAS & TIỆN ÍCH KÈM THEO - ACTIVE LIST
  const [vasItems, setVasItems] = useState<RailLclVasItem[]>([
    { id: 'vas_free_storage', name: 'Miễn phí lưu kho CFS ga (3 - 5 ngày đầu)', unit: 'VND / Lô', price: 0 },
    { id: 'vas_pickup_truck', name: 'Lấy hàng tận nơi Door Pickup bằng xe tải trung chuyển về Ga', unit: 'VND / Lô', price: 350000 },
    { id: 'vas_delivery_truck', name: 'Giao hàng tận nơi Door Delivery từ Ga đến kho người nhận', unit: 'VND / Lô', price: 400000 },
    { id: 'vas_wooden_crate', name: 'Đóng kiện gỗ & hun trùng pallet chống va đập khi tàu rung lắc', unit: 'VND / Kiện', price: 150000 },
  ]);

  // MỤC 3: CAM KẾT LỊCH CHẠY TÀU & ĐIỀU KHOẢN VẬN CHUYỂN
  const [departureSchedule, setDepartureSchedule] = useState<string>(route.departureSchedule || 'Thứ 3, Thứ 6 hàng tuần (Cắt CFS Ga 17:00)');
  const [transitType, setTransitType] = useState<'Direct Express' | 'Consolidated' | 'Transit'>('Direct Express');
  const [railTransitTime, setRailTransitTime] = useState<string>(route.sla || '48 - 60 Giờ (Ga ⇄ Ga)');
  const [wmRatio, setWmRatio] = useState<string>('1 CBM = 333 Kg (Chuẩn Đường Sắt Nội Địa / Liên Vận)');
  const [cutoffTime, setCutoffTime] = useState<string>('17:00 (Trước giờ tàu chạy 12h)');
  const [maxPackageWeight, setMaxPackageWeight] = useState<number>(3000);
  const [maxPackageDimension, setMaxPackageDimension] = useState<string>('Dài 3.0m x Rộng 2.0m x Cao 2.2m (Cửa toa tiêu chuẩn)');
  const [validUntil, setValidUntil] = useState<string>(route.validUntil || '2026-12-31');
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30 Days (Thanh toán sau 30 ngày)');

  // MODAL TỰ NHẬP PHỤ PHÍ MỚI
  const [isCustomSurchargeModalOpen, setIsCustomSurchargeModalOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<string>('VND / CBM');
  const [customType, setCustomType] = useState<'variable' | 'fixed'>('variable');
  const [customDefaultPrice, setCustomDefaultPrice] = useState<number>(100000);

  // MODAL CẤU HÌNH LỊCH CHẠY TÀU & GIỜ CẮT MÁNG CFS GA
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [scheduleModalDays, setScheduleModalDays] = useState<string[]>(['Thứ 3', 'Thứ 6']);
  const [scheduleModalTime, setScheduleModalTime] = useState<string>('17:00');

  const getSchedulePreviewString = (days: string[], time: string) => {
    if (days.length === 7) return `Hàng ngày${time ? ` (Cắt hàng CFS ${time})` : ''}`;
    if (days.length > 0) return `${days.join(', ')}${time ? ` (Cắt hàng CFS ${time})` : ''}`;
    if (time) return `Cắt hàng CFS ${time}`;
    return 'Chưa chọn lịch CFS';
  };

  const handleOpenScheduleModal = () => {
    if (departureSchedule.includes('Hàng ngày')) {
      setScheduleModalDays(SCHEDULE_DAYS_OF_WEEK.map(d => d.name));
    } else {
      const matchedDays = SCHEDULE_DAYS_OF_WEEK.filter(d => departureSchedule.includes(d.name)).map(d => d.name);
      if (matchedDays.length > 0) {
        setScheduleModalDays(matchedDays);
      } else {
        setScheduleModalDays(['Thứ 3', 'Thứ 6']);
      }
    }

    const timeMatch = departureSchedule.match(/(\d{2}:\d{2})/);
    if (timeMatch) {
      setScheduleModalTime(timeMatch[1]);
    } else {
      setScheduleModalTime('17:00');
    }

    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    const result = getSchedulePreviewString(scheduleModalDays, scheduleModalTime);
    setDepartureSchedule(result);
    setIsScheduleModalOpen(false);
  };

  // ĐỒNG BỘ THANH CUỘN NGANG CHO BẢNG MA TRẬN
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

  // TÍNH TOÁN ĐƠN GIÁ ALL-IN (CƯỚC ĐƯỜNG SẮT + PHỤ PHÍ BIẾN ĐỔI THEO BẬC)
  const getAllInPriceCbm = (tierId: string): number => {
    const base = basePricesCbm[tierId] || 0;
    const variableSum = activeSurcharges
      .filter(s => s.type === 'variable')
      .reduce((sum, surcharge) => {
        const p = variablePricesCbm[surcharge.id]?.[tierId] || 0;
        return sum + p;
      }, 0);
    return base + variableSum;
  };

  const getAllInPriceKg = (tierId: string): number => {
    const base = basePricesKg[tierId] || 0;
    const variableSum = activeSurcharges
      .filter(s => s.type === 'variable')
      .reduce((sum, surcharge) => {
        const p = variablePricesKg[surcharge.id]?.[tierId] || 0;
        return sum + p;
      }, 0);
    return base + variableSum;
  };

  // THÊM BẬC CBM MỚI
  const handleAddVolumeTier = () => {
    const nextIdx = volumeTiers.length + 1;
    const newId = `v${Date.now()}`;
    const newTier: RailLclTierColumn = {
      id: newId,
      rangeLabel: `Bậc ${nextIdx} (> ${volumeTiers[volumeTiers.length - 1]?.maxVal || 10} CBM)`,
      minVal: (volumeTiers[volumeTiers.length - 1]?.maxVal || 10) + 0.1,
      maxVal: 999999,
    };
    setVolumeTiers([...volumeTiers, newTier]);
    setBasePricesCbm(prev => ({ ...prev, [newId]: 400000 }));
    setVariablePricesCbm(prev => {
      const updated = { ...prev };
      activeSurcharges.filter(s => s.type === 'variable').forEach(s => {
        if (!updated[s.id]) updated[s.id] = {};
        updated[s.id][newId] = s.defaultCbm || 80000;
      });
      return updated;
    });
  };

  // THÊM BẬC KG MỚI
  const handleAddWeightTier = () => {
    const nextIdx = weightTiers.length + 1;
    const newId = `w${Date.now()}`;
    const newTier: RailLclTierColumn = {
      id: newId,
      rangeLabel: `Bậc ${nextIdx} (> ${weightTiers[weightTiers.length - 1]?.maxVal || 5000} Kg)`,
      minVal: (weightTiers[weightTiers.length - 1]?.maxVal || 5000) + 1,
      maxVal: 999999,
    };
    setWeightTiers([...weightTiers, newTier]);
    setBasePricesKg(prev => ({ ...prev, [newId]: 1100 }));
    setVariablePricesKg(prev => {
      const updated = { ...prev };
      activeSurcharges.filter(s => s.type === 'variable').forEach(s => {
        if (!updated[s.id]) updated[s.id] = {};
        updated[s.id][newId] = s.defaultKg || 80;
      });
      return updated;
    });
  };

  // XÓA BẬC
  const handleDeleteVolumeTier = (id: string) => {
    if (volumeTiers.length <= 1) return;
    setVolumeTiers(volumeTiers.filter(t => t.id !== id));
  };

  const handleDeleteWeightTier = (id: string) => {
    if (weightTiers.length <= 1) return;
    setWeightTiers(weightTiers.filter(t => t.id !== id));
  };

  // THÊM PHỤ PHÍ TỪ DANH MỤC LOV
  const handleAddSurchargeFromLOV = (surchargeId: string) => {
    if (surchargeId === '__custom__') {
      setIsCustomSurchargeModalOpen(true);
      return;
    }

    const lovItem = RAIL_LCL_SURCHARGES_LOV.find(s => s.id === surchargeId);
    if (!lovItem || activeSurcharges.some(s => s.id === lovItem.id)) return;

    setActiveSurcharges([...activeSurcharges, lovItem]);

    if (lovItem.type === 'variable') {
      setVariablePricesCbm(prev => ({
        ...prev,
        [lovItem.id]: volumeTiers.reduce((acc, t) => ({ ...acc, [t.id]: lovItem.defaultCbm || 100000 }), {}),
      }));
      setVariablePricesKg(prev => ({
        ...prev,
        [lovItem.id]: weightTiers.reduce((acc, t) => ({ ...acc, [t.id]: lovItem.defaultKg || 100 }), {}),
      }));
    } else {
      setFixedPrices(prev => ({
        ...prev,
        [lovItem.id]: lovItem.defaultFixedPrice || 250000,
      }));
    }
  };

  // THÊM PHỤ PHÍ TỰ NHẬP
  const handleSaveCustomSurcharge = () => {
    if (!customName.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newItem: RailLclSurchargeItem = {
      id: newId,
      name: customName.trim(),
      unit: customUnit,
      type: customType,
      defaultCbm: customType === 'variable' ? customDefaultPrice : undefined,
      defaultKg: customType === 'variable' ? Math.round(customDefaultPrice / 1000) : undefined,
      defaultFixedPrice: customType === 'fixed' ? customDefaultPrice : undefined,
    };

    setActiveSurcharges([...activeSurcharges, newItem]);

    if (customType === 'variable') {
      setVariablePricesCbm(prev => ({
        ...prev,
        [newId]: volumeTiers.reduce((acc, t) => ({ ...acc, [t.id]: customDefaultPrice }), {}),
      }));
      setVariablePricesKg(prev => ({
        ...prev,
        [newId]: weightTiers.reduce((acc, t) => ({ ...acc, [t.id]: Math.round(customDefaultPrice / 1000) }), {}),
      }));
    } else {
      setFixedPrices(prev => ({
        ...prev,
        [newId]: customDefaultPrice,
      }));
    }

    setCustomName('');
    setIsCustomSurchargeModalOpen(false);
  };

  // XÓA PHỤ PHÍ
  const handleDeleteSurcharge = (id: string) => {
    setActiveSurcharges(activeSurcharges.filter(s => s.id !== id));
  };

  // THÊM TIỆN ÍCH VAS TỪ LOV
  const handleAddVasFromLOV = (vasId: string) => {
    const lovItem = RAIL_LCL_VAS_LOV.find(v => v.id === vasId);
    if (!lovItem || vasItems.some(v => v.id === lovItem.id)) return;
    setVasItems([...vasItems, lovItem]);
  };

  // XÓA TIỆN ÍCH VAS
  const handleDeleteVas = (id: string) => {
    setVasItems(vasItems.filter(v => v.id !== id));
  };

  // CẬP NHẬT GIÁ VAS
  const handleUpdateVasPrice = (id: string, price: number) => {
    setVasItems(vasItems.map(v => v.id === id ? { ...v, price } : v));
  };

  // TỔNG SỐ CỘT PHÍA BÊN PHẢI (Volume Tiers + Min CBM + Weight Tiers + Min Kg)
  const totalDataCols = volumeTiers.length + 1 + weightTiers.length + 1;

  // LƯU TOÀN BỘ MA TRẬN
  const handleConfirmSave = () => {
    const payload: RailLclPricingConfig = {
      currency,
      volumeTiers,
      weightTiers,
      minChargeCbm,
      minChargeKg,
      basePricesCbm,
      basePricesKg,
      activeSurcharges,
      variablePricesCbm,
      variablePricesKg,
      fixedPrices,
      vasItems,
      wmRatio,
      departureSchedule,
      railTransitTime,
      transitType,
      cutoffTime,
      maxPackageWeight,
      maxPackageDimension,
      paymentTerms,
      validUntil,
    };

    onSave(route.id, {
      railLclPricing: payload,
      price: getAllInPriceCbm(volumeTiers[0]?.id || 'v1') || basePricesCbm['v1'] || 650000,
      pricingUnit: 'CBM',
      departureSchedule,
      sla: railTransitTime,
      transitType,
      validUntil,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-7xl w-full max-h-[96vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* =========================================================================
            MODAL HEADER (CHUẨN LCL UNIFIED CHO ĐƯỜNG SẮT)
        ========================================================================= */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white flex items-center justify-between border-b border-emerald-900/40 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30 shadow-inner shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950">
                  Biểu Phí Chi Tiết
                </span>
                <h3 className="text-base font-black tracking-tight text-white">
                  Ma Trận Biểu Phí Hàng Lẻ Ghép Toa Đa Bậc (Rail LCL Matrix)
                </h3>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {currency === 'VND' ? 'VND (₫)' : 'USD ($)'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap font-medium">
                <span>Tuyến: <strong className="text-white">{route.route || route.routeCode}</strong></span>
                <span>• Từ: <strong>{route.origin}</strong></span>
                <span>➔ Đến: <strong>{route.destination}</strong></span>
                <span className="bg-emerald-900/60 text-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-700/50">
                  Đơn vị vận hành: {route.shippingLine || 'VNR (Đường Sắt Việt Nam)'}
                </span>
                <span className="bg-teal-950/70 text-teal-300 text-[11px] font-bold px-2 py-0.5 rounded border border-teal-800/60 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  {wmRatio}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SUBHEADER: ĐIỀU KHIỂN BẬC & TIỀN TỆ
        ========================================================================= */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Khai báo song song 2 chiều: <strong className="text-emerald-700">Thể Tích ({volumeTiers.length} bậc CBM)</strong> & <strong className="text-teal-700">Khối Lượng ({weightTiers.length} bậc Kg)</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-normal">Đồng bộ chuẩn hiển thị phụ phí biến đổi & cố định</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-200/80 p-0.5 border border-slate-300">
              <button
                type="button"
                onClick={() => setCurrency('VND')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'VND' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                VND (₫)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddVolumeTier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thêm Bậc Thể Tích (CBM)</span>
            </button>

            <button
              type="button"
              onClick={handleAddWeightTier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>Thêm Bậc Khối Lượng (Kg)</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            THANH CUỘN NGANG ĐỒNG BỘ CHO BẢNG MA TRẬN
        ========================================================================= */}
        <div className="px-6 py-2 bg-slate-100/60 border-b border-slate-200 shrink-0">
          <div
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="w-full overflow-x-auto overflow-y-hidden rounded-lg bg-slate-200/80 border border-slate-300 shadow-2xs"
            title="Thanh cuộn ngang bảng ma trận"
          >
            <div style={{ width: `${tableScrollWidth}px`, height: '2px' }} />
          </div>
        </div>

        {/* =========================================================================
            BẢNG HỢP NHẤT DUY NHẤT (UNIFIED MATRIX TABLE - CHUẨN LCL FULL)
        ========================================================================= */}
        <div 
          ref={bottomScrollRef}
          onScroll={handleBottomScroll}
          className="flex-1 overflow-x-auto overflow-y-auto min-h-0 bg-white"
        >
          <table ref={tableRef} className="w-full border-collapse text-xs text-left min-w-[1350px]">
            <thead>
              {/* TẦNG 1: NHÃN CỘT THỂ TÍCH & TRỌNG LƯỢNG */}
              <tr className="border-b border-slate-300 text-center font-bold">
                <th rowSpan={2} className="sticky left-0 z-30 bg-slate-100 text-slate-800 px-4 py-3 border-r-2 border-slate-300 text-xs w-[340px] min-w-[340px] shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  DÒNG BIỂU PHÍ & DỊCH VỤ
                </th>
                
                {/* KHỐI 1: THỂ TÍCH (CBM) */}
                <th colSpan={volumeTiers.length + 1} className="bg-emerald-50 text-emerald-950 py-2.5 px-3 border-r-2 border-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Box className="w-4 h-4 text-emerald-600" />
                    <span className="font-black tracking-wide uppercase">BIỂU GIÁ THEO THỂ TÍCH (CUBIC METER - CBM)</span>
                    <span className="text-[10.5px] font-normal text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {currency === 'VND' ? 'đ/CBM' : 'USD/CBM'}
                    </span>
                  </div>
                </th>

                {/* KHỐI 2: TRỌNG LƯỢNG (KG) */}
                <th colSpan={weightTiers.length + 1} className="bg-teal-50 text-teal-950 py-2.5 px-3">
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span className="font-black tracking-wide uppercase">BIỂU GIÁ THEO TRỌNG LƯỢNG (WEIGHT - KG)</span>
                    <span className="text-[10.5px] font-normal text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
                      {currency === 'VND' ? 'đ/kg' : 'USD/kg'}
                    </span>
                  </div>
                </th>
              </tr>

              {/* TẦNG 2: CHI TIẾT CÁC CỘT BẬC */}
              <tr className="border-b border-slate-300 divide-x divide-slate-200 text-center font-bold">
                {/* CBM Columns */}
                {volumeTiers.map((t, idx) => (
                  <th key={t.id} className="bg-emerald-50/70 py-2 px-2 text-slate-800 font-bold min-w-[105px] max-w-[125px]">
                    <div className="flex items-center justify-between text-[11px] text-emerald-900 font-extrabold">
                      <span>BẬC #{idx + 1}</span>
                      {volumeTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteVolumeTier(t.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Xóa bậc này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={t.rangeLabel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVolumeTiers(volumeTiers.map(vt => vt.id === t.id ? { ...vt, rangeLabel: val } : vt));
                      }}
                      className="w-full text-center text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded px-1 py-0.5 mt-0.5 focus:border-emerald-500 focus:outline-none"
                    />
                  </th>
                ))}
                <th className="bg-emerald-100/70 text-emerald-950 py-2 px-2 border-r-2 border-slate-300 min-w-[105px]">
                  <div className="text-[11px] font-black">MIN CHARGE</div>
                  <div className="text-[9.5px] font-normal text-slate-500">Tối thiểu / Lô</div>
                </th>

                {/* Kg Columns */}
                {weightTiers.map((t, idx) => (
                  <th key={t.id} className="bg-teal-50/70 py-2 px-2 text-slate-800 font-bold min-w-[105px] max-w-[125px]">
                    <div className="flex items-center justify-between text-[11px] text-teal-900 font-extrabold">
                      <span>BẬC #{idx + 1}</span>
                      {weightTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteWeightTier(t.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Xóa bậc này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={t.rangeLabel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWeightTiers(weightTiers.map(wt => wt.id === t.id ? { ...wt, rangeLabel: val } : wt));
                      }}
                      className="w-full text-center text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded px-1 py-0.5 mt-0.5 focus:border-teal-500 focus:outline-none"
                    />
                  </th>
                ))}
                <th className="bg-teal-100/70 text-teal-950 py-2 px-2 min-w-[105px]">
                  <div className="text-[11px] font-black">MIN CHARGE</div>
                  <div className="text-[9.5px] font-normal text-slate-500">Tối thiểu / Lô</div>
                </th>
              </tr>

              {/* TỔNG CƯỚC DỰ KIẾN (ALL-IN) - TỰ ĐỘNG CỘNG */}
              <tr className="bg-emerald-50/80 border-b border-emerald-200">
                <td className="sticky left-0 z-30 bg-emerald-50 text-left px-4 py-3 font-black text-emerald-950 text-xs border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>TỔNG CƯỚC DỰ KIẾN (RF + PHỤ PHÍ BIẾN ĐỔI)</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 bg-emerald-200 text-emerald-900 font-mono font-bold rounded">
                      Tự động cộng
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Cước đường sắt cơ bản cộng toàn bộ phụ phí biến đổi theo bậc
                  </p>
                </td>

                {/* All-in CBM */}
                {volumeTiers.map((t) => (
                  <td key={`total-cbm-${t.id}`} className="p-2 text-center font-black text-emerald-950 bg-emerald-50/50 font-mono text-[13px] border-r border-slate-200">
                    {getAllInPriceCbm(t.id).toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                    <div className="text-[9.5px] font-bold text-emerald-700 font-sans">/ CBM</div>
                  </td>
                ))}
                <td className="p-2 text-center font-bold text-emerald-950 border-r-2 border-slate-300 bg-emerald-100/40 font-mono text-xs">
                  {minChargeCbm.toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                  <div className="text-[9px] font-normal text-slate-500 font-sans">Min/Lô</div>
                </td>

                {/* All-in Kg */}
                {weightTiers.map((t) => (
                  <td key={`total-kg-${t.id}`} className="p-2 text-center font-black text-teal-950 bg-teal-50/50 font-mono text-[13px] border-r border-slate-200">
                    {getAllInPriceKg(t.id).toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                    <div className="text-[9.5px] font-bold text-teal-700 font-sans">/ kg</div>
                  </td>
                ))}
                <td className="p-2 text-center font-bold text-teal-950 bg-teal-100/40 font-mono text-xs">
                  {minChargeKg.toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                  <div className="text-[9px] font-normal text-slate-500 font-sans">Min/Lô</div>
                </td>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* ===================================================================
                  CƯỚC ĐƯỜNG SẮT CƠ BẢN (BASE RAIL FREIGHT - RF) * [BẮT BUỘC]
              =================================================================== */}
              <tr className="bg-white hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Train className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cước Vận Chuyển Hàng Lẻ Ga ⇄ Ga (Rail Freight - RF) *</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold rounded border border-rose-200">
                      Bắt buộc
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Đơn giá cước vận chuyển đường sắt ({currency === 'VND' ? 'VND / CBM & VND / kg' : 'USD / CBM & USD / kg'})
                  </p>
                </td>

                {/* Base Prices CBM */}
                {volumeTiers.map((t) => (
                  <td key={`base-cbm-${t.id}`} className="px-2 py-1.5 text-center border-r border-slate-200">
                    <input
                      type="number"
                      min="0"
                      value={basePricesCbm[t.id] ?? 0}
                      onChange={(e) => setBasePricesCbm({ ...basePricesCbm, [t.id]: Number(e.target.value) || 0 })}
                      className="w-full text-center px-1.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 border-r-2 border-slate-300 bg-slate-50/40">
                  <input
                    type="number"
                    min="0"
                    value={minChargeCbm}
                    onChange={(e) => setMinChargeCbm(Number(e.target.value) || 0)}
                    className="w-full text-center px-1.5 py-1 text-xs font-bold text-emerald-950 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
                  />
                </td>

                {/* Base Prices Kg */}
                {weightTiers.map((t) => (
                  <td key={`base-kg-${t.id}`} className="px-2 py-1.5 text-center border-r border-slate-200">
                    <input
                      type="number"
                      min="0"
                      value={basePricesKg[t.id] ?? 0}
                      onChange={(e) => setBasePricesKg({ ...basePricesKg, [t.id]: Number(e.target.value) || 0 })}
                      className="w-full text-center px-1.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono shadow-2xs"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 bg-slate-50/40">
                  <input
                    type="number"
                    min="0"
                    value={minChargeKg}
                    onChange={(e) => setMinChargeKg(Number(e.target.value) || 0)}
                    className="w-full text-center px-1.5 py-1 text-xs font-bold text-teal-950 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono shadow-2xs"
                  />
                </td>
              </tr>

              {/* ===================================================================
                  MỤC 1A: PHỤ PHÍ BIẾN ĐỔI THEO KHỐI LƯỢNG & THỂ TÍCH (CBM & KG)
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={totalDataCols + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1A. PHỤ PHÍ BIẾN ĐỔI THEO KHỐI LƯỢNG & THỂ TÍCH (CBM & KG)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH CÁC PHỤ PHÍ BIẾN ĐỔI (VARIABLE) */}
              {activeSurcharges.filter(s => s.type === 'variable').map((surcharge) => (
                <tr key={`surcharge-row-${surcharge.id}`} className="hover:bg-emerald-50/20 transition-colors">
                  {/* CỘT TIÊU ĐỀ TRÁI STICKY */}
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 font-medium text-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleDeleteSurcharge(surcharge.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                          title={`Xóa phụ phí "${surcharge.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="truncate text-xs font-semibold text-slate-800" title={surcharge.name}>
                          {surcharge.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 border text-emerald-800 bg-emerald-50 border-emerald-200">
                        {surcharge.unit}
                      </span>
                    </div>
                  </td>

                  {/* CBM Tier Inputs */}
                  {volumeTiers.map((t) => {
                    const val = variablePricesCbm[surcharge.id]?.[t.id] ?? 0;
                    return (
                      <td key={`surch-cbm-${surcharge.id}-${t.id}`} className="px-2 py-1.5 text-center border-r border-slate-200">
                        <input
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) => {
                            const num = Number(e.target.value) || 0;
                            setVariablePricesCbm({
                              ...variablePricesCbm,
                              [surcharge.id]: {
                                ...(variablePricesCbm[surcharge.id] || {}),
                                [t.id]: num,
                              },
                            });
                          }}
                          className="w-full text-center px-1.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                        />
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-center text-slate-400 border-r-2 border-slate-300 font-mono bg-slate-50/20">-</td>

                  {/* Kg Tier Inputs */}
                  {weightTiers.map((t) => {
                    const val = variablePricesKg[surcharge.id]?.[t.id] ?? 0;
                    return (
                      <td key={`surch-kg-${surcharge.id}-${t.id}`} className="px-2 py-1.5 text-center border-r border-slate-200">
                        <input
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) => {
                            const num = Number(e.target.value) || 0;
                            setVariablePricesKg({
                              ...variablePricesKg,
                              [surcharge.id]: {
                                ...(variablePricesKg[surcharge.id] || {}),
                                [t.id]: num,
                              },
                            });
                          }}
                          className="w-full text-center px-1.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none font-mono"
                        />
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-center text-slate-400 font-mono bg-slate-50/20">-</td>
                </tr>
              ))}

              {/* HÀNG THÊM PHỤ PHÍ BIẾN ĐỔI 1A TỪ DANH MỤC LOV */}
              <tr className="bg-slate-50/80 border-b border-emerald-100 hover:bg-emerald-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  {(() => {
                    const activeIds = activeSurcharges.map(a => a.id);
                    const unaddedVariable = RAIL_LCL_SURCHARGES_LOV.filter(l => l.type === 'variable' && !activeIds.includes(l.id));

                    if (unaddedVariable.length === 0) {
                      return (
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Đã thêm toàn bộ phụ phí biến đổi từ danh mục chuẩn</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomType('variable');
                              setCustomUnit('VND / CBM');
                              setIsCustomSurchargeModalOpen(true);
                            }}
                            className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            + Tự nhập thêm...
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value === '__custom_variable__') {
                              setCustomType('variable');
                              setCustomUnit('VND / CBM');
                              setIsCustomSurchargeModalOpen(true);
                            } else if (e.target.value) {
                              handleAddSurchargeFromLOV(e.target.value);
                            }
                            e.target.value = '';
                          }}
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-emerald-400 rounded-lg hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            + Chọn thêm phụ phí biến đổi theo CBM / Kg ({unaddedVariable.length} mục có sẵn)...
                          </option>
                          {unaddedVariable.map((item) => (
                            <option key={item.id} value={item.id}>
                              + {item.name} ({item.unit})
                            </option>
                          ))}
                          <option value="__custom_variable__">
                            ★ + Tự nhập phụ phí biến đổi mới...
                          </option>
                        </select>
                      </div>
                    );
                  })()}
                </td>
                <td colSpan={totalDataCols} className="border-r last:border-r-0 border-slate-200 bg-slate-50/30"></td>
              </tr>

              {/* ===================================================================
                  MỤC 1B: PHỤ PHÍ CỐ ĐỊNH THEO BỘ CHỨNG TỪ & LÔ HÀNG (SET / LÔ)
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={totalDataCols + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>1B. PHỤ PHÍ CỐ ĐỊNH THEO BỘ CHỨNG TỪ & LÔ HÀNG (SET / LÔ / CHỨNG TỪ)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH CÁC PHỤ PHÍ CỐ ĐỊNH (FIXED) */}
              {activeSurcharges.filter(s => s.type === 'fixed').map((surcharge) => (
                <tr key={`surcharge-row-${surcharge.id}`} className="hover:bg-slate-50/50 transition-colors">
                  {/* CỘT TIÊU ĐỀ TRÁI STICKY */}
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 font-medium text-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleDeleteSurcharge(surcharge.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                          title={`Xóa phụ phí "${surcharge.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="truncate text-xs font-semibold text-slate-800" title={surcharge.name}>
                          {surcharge.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 border text-slate-600 bg-slate-100 border-slate-200">
                        {surcharge.unit}
                      </span>
                    </div>
                  </td>

                  {/* DỮ LIỆU ĐƠN GIÁ CỐ ĐỊNH MỞ RỘNG TOÀN BỘ CỘT */}
                  <td colSpan={totalDataCols} className="px-4 py-1.5 bg-slate-50/40 text-center border-r last:border-r-0 border-slate-200">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-[11px] text-slate-500 font-medium">Mức thu cố định:</span>
                      <div className="relative w-48">
                        <input
                          type="number"
                          min="0"
                          value={fixedPrices[surcharge.id] ?? 0}
                          onChange={(e) => {
                            const num = Number(e.target.value) || 0;
                            setFixedPrices({
                              ...fixedPrices,
                              [surcharge.id]: num,
                            });
                          }}
                          className="w-full text-center px-3 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {currency === 'VND' ? '₫' : '$'} / {surcharge.unit.replace(/^(VND|USD)\s*\/\s*/i, '')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFixedPrices({
                            ...fixedPrices,
                            [surcharge.id]: 0,
                          });
                        }}
                        className="text-[10.5px] px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        Miễn phí (0đ)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* HÀNG THÊM PHỤ PHÍ CỐ ĐỊNH 1B TỪ DANH MỤC LOV */}
              <tr className="bg-slate-50/80 border-b border-teal-100 hover:bg-teal-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  {(() => {
                    const activeIds = activeSurcharges.map(a => a.id);
                    const unaddedFixed = RAIL_LCL_SURCHARGES_LOV.filter(l => l.type === 'fixed' && !activeIds.includes(l.id));

                    if (unaddedFixed.length === 0) {
                      return (
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Đã thêm toàn bộ phụ phí cố định từ danh mục chuẩn</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomType('fixed');
                              setCustomUnit('VND / Set');
                              setIsCustomSurchargeModalOpen(true);
                            }}
                            className="text-[11px] text-teal-700 font-bold hover:underline cursor-pointer"
                          >
                            + Tự nhập thêm...
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value === '__custom_fixed__') {
                              setCustomType('fixed');
                              setCustomUnit('VND / Set');
                              setIsCustomSurchargeModalOpen(true);
                            } else if (e.target.value) {
                              handleAddSurchargeFromLOV(e.target.value);
                            }
                            e.target.value = '';
                          }}
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-teal-400 rounded-lg hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            + Chọn thêm phụ phí cố định theo Set / Lô ({unaddedFixed.length} mục có sẵn)...
                          </option>
                          {unaddedFixed.map((item) => (
                            <option key={item.id} value={item.id}>
                              + {item.name} ({item.unit})
                            </option>
                          ))}
                          <option value="__custom_fixed__">
                            ★ + Tự nhập phụ phí cố định mới...
                          </option>
                        </select>
                      </div>
                    );
                  })()}
                </td>
                <td colSpan={totalDataCols} className="border-r last:border-r-0 border-slate-200 bg-slate-50/30"></td>
              </tr>

              {/* ===================================================================
                  MỤC 2: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={totalDataCols + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH VAS ĐANG ÁP DỤNG */}
              {vasItems.map((vas) => (
                <tr key={`vas-row-${vas.id}`} className="hover:bg-amber-50/20 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 font-medium text-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleDeleteVas(vas.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                          title={`Xóa dịch vụ "${vas.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="truncate text-xs font-semibold text-slate-800" title={vas.name}>
                          {vas.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 border border-slate-200">
                        {vas.unit}
                      </span>
                    </div>
                  </td>

                  <td colSpan={totalDataCols} className="px-4 py-1.5 text-center border-r last:border-r-0 border-slate-200">
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative w-44">
                        <input
                          type="number"
                          min="0"
                          value={vas.price || ''}
                          onChange={(e) => handleUpdateVasPrice(vas.id, parseFloat(e.target.value) || 0)}
                          placeholder="0 (Miễn phí)"
                          className={`w-full px-3 py-1 text-xs text-center rounded-lg border font-mono transition-all ${
                            vas.price > 0 
                              ? 'border-amber-300 font-bold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500' 
                              : 'border-slate-200 text-slate-400 bg-slate-50/50'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{currency === 'VND' ? '₫' : '$'}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateVasPrice(vas.id, 0)}
                        className="text-[10.5px] px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        Miễn phí (0đ)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* HÀNG THÊM VAS TỪ DANH MỤC LOV */}
              <tr className="bg-slate-50/80 border-b border-amber-100 hover:bg-amber-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  {(() => {
                    const activeIds = vasItems.map(a => a.id);
                    const unadded = RAIL_LCL_VAS_LOV.filter(l => !activeIds.includes(l.id));

                    if (unadded.length === 0) {
                      return (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 py-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Đã thêm toàn bộ tiện ích VAS từ danh mục chuẩn</span>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddVasFromLOV(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-amber-400 rounded-lg hover:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            + Chọn thêm tiện ích VAS ({unadded.length} mục có sẵn)...
                          </option>
                          {unadded.map((item) => (
                            <option key={item.id} value={item.id}>
                              + {item.name} ({item.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </td>
                <td colSpan={totalDataCols} className="border-r last:border-r-0 border-slate-200 bg-slate-50/30"></td>
              </tr>

              {/* ===================================================================
                  MỤC 3: CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={totalDataCols + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>3. CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN</span>
                  </div>
                </td>
              </tr>

              {/* 1. Lịch chạy tàu & Giờ cắt máng CFS Ga (Closing/Cut-off) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Lịch Chạy Tàu & Giờ Cắt Máng CFS Ga (Closing/Cut-off)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Lịch đóng hàng trong tuần và giờ hạn chót nhận hàng tại kho CFS ga
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <button
                    type="button"
                    onClick={handleOpenScheduleModal}
                    className="max-w-md mx-auto px-4 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/20 hover:text-emerald-900 transition-all shadow-2xs flex items-center justify-between gap-2 group cursor-pointer"
                    title="Nhấp để cấu hình chi tiết lịch chạy tàu và giờ cắt máng CFS ga"
                  >
                    <span className="truncate flex-1 text-center font-medium">
                      {departureSchedule}
                    </span>
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                </td>
              </tr>

              {/* 2. Loại Hình Tàu Vận Chuyển (Transit Type) */}
              <tr className="hover:bg-slate-50/60 transition-colors bg-emerald-50/10">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Loại Hình Tàu Vận Chuyển (Transit Type)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Tàu chuyên tuyến nhanh chạy thẳng hay tàu gom ghép toa thường
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <select
                      value={transitType}
                      onChange={(e) => setTransitType(e.target.value as any)}
                      className={`w-full px-3 py-1.5 text-xs font-bold text-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer ${
                        transitType === 'Direct Express' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-teal-50 text-teal-800 border-teal-300'
                      }`}
                    >
                      <option value="Direct Express">Direct Express (Tàu chuyên tuyến nhanh Ga ⇄ Ga)</option>
                      <option value="Consolidated">Consolidated (Tàu gom ghép hàng thường)</option>
                      <option value="Transit">Transit (Tàu chuyển tải toa tại ga trung gian)</option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 3. Thời Gian Hành Trình (Transit Time) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. Thời Gian Hành Trình (Transit Time)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Thời gian chạy tàu dự kiến từ ga gửi đến ga nhận (POL ⇄ POD)
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <input
                      type="text"
                      value={railTransitTime}
                      onChange={(e) => setRailTransitTime(e.target.value)}
                      placeholder="VD: 48 - 60 Giờ (Ga ⇄ Ga)"
                      className="w-full px-3 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>
                </td>
              </tr>

              {/* 4. Quy Tắc Tính Cước W/M */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4. Quy Tắc Tính Cước W/M (Weight / Measurement)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Tỷ lệ quy đổi so sánh giữa thể tích (CBM) và khối lượng (Kg)
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={wmRatio}
                      onChange={(e) => setWmRatio(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="1 CBM = 333 Kg (Chuẩn Đường Sắt Nội Địa / Liên Vận)">
                        1 CBM = 333 Kg (Chuẩn Đường Sắt Nội Địa / Liên Vận)
                      </option>
                      <option value="1 CBM = 500 Kg (Tàu Chuyên Tuyến Nhanh Á - Âu)">
                        1 CBM = 500 Kg (Tàu Chuyên Tuyến Nhanh Á - Âu)
                      </option>
                      <option value="1 CBM = 1.000 Kg (Chuẩn W/M Quốc Tế)">
                        1 CBM = 1.000 Kg (Chuẩn W/M Quốc Tế)
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 5. Giới Hạn Tải Trọng & Kích Thước Kiện Hàng */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-emerald-600" />
                    <span>5. Giới Hạn Tải Trọng & Kích Thước Kiện Hàng</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Trọng lượng tối đa 1 kiện và kích thước phù hợp cửa toa hàng
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">Max/kiện:</span>
                      <input
                        type="number"
                        min="100"
                        value={maxPackageWeight}
                        onChange={(e) => setMaxPackageWeight(Number(e.target.value) || 0)}
                        className="w-24 text-center px-2 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-slate-600">kg</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-[11px] text-slate-500 font-medium">Kích thước:</span>
                      <input
                        type="text"
                        value={maxPackageDimension}
                        onChange={(e) => setMaxPackageDimension(e.target.value)}
                        placeholder="Dài x Rộng x Cao"
                        className="w-full text-center px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {/* 6. Thời Hạn Hiệu Lực Giá (Valid Until) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>6. Thời Hạn Hiệu Lực Giá (Valid Until)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Mốc ngày kết thúc áp dụng biểu cước này
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
                    />
                  </div>
                </td>
              </tr>

              {/* 7. Điều Khoản Thanh Toán (Payment Terms) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>7. Điều Khoản Thanh Toán (Payment Terms)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Thời hạn công nợ và hình thức thanh toán cước
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="Net 30 Days (Thanh toán sau 30 ngày)">Net 30 Days (Thanh toán sau 30 ngày)</option>
                      <option value="Net 15 Days (Thanh toán sau 15 ngày)">Net 15 Days (Thanh toán sau 15 ngày)</option>
                      <option value="Net 7 Days (Thanh toán sau 7 ngày)">Net 7 Days (Thanh toán sau 7 ngày)</option>
                      <option value="Thu ngay khi nhận hàng (Prepaid / COD)">Thu ngay khi nhận hàng (Prepaid / COD)</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            MODAL FOOTER: HÀNH ĐỘNG LƯU / ĐÓNG
        ========================================================================= */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Đang cấu hình <strong className="text-emerald-700">{volumeTiers.length} bậc CBM</strong> & <strong className="text-teal-700">{weightTiers.length} bậc Kg</strong> cho tuyến đường sắt hàng lẻ này.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/80 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Ma Trận Biểu Phí Rail LCL</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POPUP CẤU HÌNH LỊCH CHẠY TÀU & GIỜ CẮT MÁNG CFS GA
      ========================================================================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Cấu Hình Lịch Chạy Tàu & Giờ Cắt Máng CFS Ga</span>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  1. Ngày chạy tàu trong tuần:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SCHEDULE_DAYS_OF_WEEK.map((d) => {
                    const isSelected = scheduleModalDays.includes(d.name);
                    return (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setScheduleModalDays(scheduleModalDays.filter(day => day !== d.name));
                          } else {
                            setScheduleModalDays([...scheduleModalDays, d.name]);
                          }
                        }}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d.name}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleModalDays(SCHEDULE_DAYS_OF_WEEK.map(d => d.name))}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    + Chọn tất cả (Hàng ngày)
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setScheduleModalDays(['Thứ 3', 'Thứ 6'])}
                    className="text-[11px] text-slate-600 hover:underline"
                  >
                    Mặc định T3 & T6
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  2. Giờ cắt máng nhận hàng kho CFS ga (Cut-off Time):
                </label>
                <select
                  value={scheduleModalTime}
                  onChange={(e) => setScheduleModalTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {RAIL_LCL_CLOSING_TIMES.map((t, idx) => (
                    <option key={idx} value={t.time}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs">
                <span className="text-slate-500 font-medium">Xem trước chuỗi hiển thị:</span>
                <div className="font-bold text-emerald-950 mt-1">
                  {getSchedulePreviewString(scheduleModalDays, scheduleModalTime)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Áp Dụng Lịch Này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          POPUP TỰ NHẬP PHỤ PHÍ MỚI
      ========================================================================= */}
      {isCustomSurchargeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-sm font-black text-slate-900">
                Thêm Phụ Phí Đường Sắt Mới (Tự Nhập)
              </h4>
              <button
                type="button"
                onClick={() => setIsCustomSurchargeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên phụ phí đường sắt: *
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="VD: Phí kiểm dịch ga liên vận, Phí lưu bãi đặc biệt..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loại phụ phí:
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => {
                      const t = e.target.value as 'variable' | 'fixed';
                      setCustomType(t);
                      if (t === 'variable') setCustomUnit('VND / CBM');
                      else setCustomUnit('VND / Set');
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="variable">Biến đổi (Theo CBM / Kg)</option>
                    <option value="fixed">Cố định (Theo Set / Lô)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đơn vị tính:
                  </label>
                  <input
                    type="text"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    placeholder="VND / CBM, VND / Set..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mức thu mặc định ({currency}):
                </label>
                <input
                  type="number"
                  min="0"
                  value={customDefaultPrice}
                  onChange={(e) => setCustomDefaultPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCustomSurchargeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveCustomSurcharge}
                disabled={!customName.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
              >
                Thêm Vào Biểu Phí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
