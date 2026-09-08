import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  Ship, 
  Layers, 
  Box, 
  DollarSign, 
  FileText, 
  Anchor, 
  Sparkles, 
  Clock, 
  Save, 
  CheckCircle2, 
  Scale
} from 'lucide-react';
import {
  SCHEDULE_DAYS_OF_WEEK,
} from './TruckingFtlCostMatrixModal';

export const LCL_CLOSING_TIMES = [
  { time: '17:00', label: '17:00 (Cắt máng CFS ca chiều)' },
  { time: '12:00', label: '12:00 (Cắt máng CFS ca trưa)' },
  { time: '09:00', label: '09:00 (Cắt máng CFS ca sáng)' },
  { time: '20:00', label: '20:00 (Cắt máng CFS ca tối)' },
  { time: 'Trước ETD 24h', label: 'Trước ETD 24h (Cut-off 24h)' },
  { time: 'Trước ETD 48h', label: 'Trước ETD 48h (Cut-off 48h)' },
];

export interface LclTierColumn {
  id: string;
  rangeLabel: string;
  minVal: number;
  maxVal: number;
}

export interface OceanLclSurchargeItem {
  id: string;
  name: string;
  unit: string;
  type: 'variable' | 'fixed';
  defaultCbm?: number;
  defaultKg?: number;
  defaultFixedPrice?: number;
}

export interface OceanLclVasItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface OceanLclPricingConfig {
  currency: 'VND' | 'USD';
  volumeTiers: LclTierColumn[];
  weightTiers: LclTierColumn[];
  minChargeCbm: number;
  minChargeKg: number;
  basePricesCbm: Record<string, number>;
  basePricesKg: Record<string, number>;
  activeSurcharges: OceanLclSurchargeItem[];
  variablePricesCbm: Record<string, Record<string, number>>;
  variablePricesKg: Record<string, Record<string, number>>;
  fixedPrices: Record<string, number>;
  vasItems: OceanLclVasItem[];
  wmRatio: string;
  departureSchedule: string;
  oceanTransitTime: string;
  transitType: 'Direct' | 'Transit';
  paymentTerms: string;
  validUntil: string;
}

interface OceanLclCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: any;
  onSave: (routeId: string, updatedData: any) => void;
  cargoType?: string;
}

// =========================================================================
// DANH MỤC PHỤ PHÍ CHUẨN LOV CHO OCEAN LCL (TƯƠNG TỰ FCL SURCHARGES LOV)
// =========================================================================
export const OCEAN_LCL_SURCHARGES_LOV: OceanLclSurchargeItem[] = [
  // Phụ phí biến đổi theo CBM / Kg
  { id: 'thc_fee', name: 'Phí xếp dỡ tại cảng bốc (THC POL)', unit: 'VND / CBM', type: 'variable', defaultCbm: 185241, defaultKg: 185 },
  { id: 'cfs_fee', name: 'Phí bốc xếp & khai thác kho CFS (CFS Fee)', unit: 'VND / CBM', type: 'variable', defaultCbm: 264630, defaultKg: 265 },
  { id: 'fuel_baf', name: 'Phụ phí nhiên liệu xanh BAF / LSS', unit: 'VND / CBM', type: 'variable', defaultCbm: 119084, defaultKg: 119 },
  { id: 'ddc_fee', name: 'Phí giao hàng tại đích (Destination Delivery Charge - DDC)', unit: 'VND / CBM', type: 'variable', defaultCbm: 529260, defaultKg: 529 },
  { id: 'pss', name: 'Phụ phí mùa cao điểm (Peak Season Surcharge - PSS)', unit: 'VND / CBM', type: 'variable', defaultCbm: 120000, defaultKg: 120 },
  { id: 'cic', name: 'Phụ phí mất cân bằng vỏ container (CIC / EBS)', unit: 'VND / CBM', type: 'variable', defaultCbm: 95000, defaultKg: 95 },
  { id: 'gri', name: 'Phụ phí tăng cước chung đường biển (General Rate Increase - GRI)', unit: 'VND / CBM', type: 'variable', defaultCbm: 85000, defaultKg: 85 },
  { id: 'port_congestion', name: 'Phụ phí tắc nghẽn cảng bốc dỡ (Port Congestion Surcharge - PCS)', unit: 'VND / CBM', type: 'variable', defaultCbm: 100000, defaultKg: 100 },
  { id: 'war_risk', name: 'Phụ phí rủi ro chiến tranh / eo biển (War Risk Surcharge - WRS)', unit: 'VND / CBM', type: 'variable', defaultCbm: 80000, defaultKg: 80 },

  // Phụ phí cố định theo Bộ chứng từ / Lô hàng
  { id: 'bl_fee', name: 'Phí phát hành vận đơn (B/L Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 529260 },
  { id: 'seal_fee', name: 'Phí chì niêm phong Container (Seal Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 200000 },
  { id: 'do_fee', name: 'Phí phát hành lệnh giao hàng (D/O Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 264630 },
  { id: 'ams_afr', name: 'Khai báo an ninh AMS (Mỹ) / AFR (Nhật) / ENS (EU)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 264630 },
  { id: 'handling_fee', name: 'Phí quản lý & chứng từ gom hàng lẻ (Handling Charge)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 317556 },
  { id: 'telex', name: 'Phí điện giao hàng (Telex Release Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 350000 },
  { id: 'isps', name: 'Phí an ninh cảng biển (ISPS / Port Security Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 250000 },
  { id: 'amendment', name: 'Phí chỉnh sửa vận đơn (B/L Amendment Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 350000 },
  { id: 'manifest', name: 'Phí truyền dữ liệu Manifest điện tử', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 250000 },
  { id: 'bl_surrender', name: 'Phí thu hồi vận đơn gốc (Surrendered B/L Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 350000 },
  { id: 'customs_decl', name: 'Phí thủ tục hải quan xuất nhập khẩu tại CFS', unit: 'VND / Tờ khai', type: 'fixed', defaultFixedPrice: 800000 },
];

// =========================================================================
// DANH MỤC TIỆN ÍCH VAS CHUẨN LOV CHO OCEAN LCL (TƯƠNG TỰ FCL VAS LOV)
// =========================================================================
export const OCEAN_LCL_VAS_LOV: OceanLclVasItem[] = [
  { id: 'vas_free_storage', name: 'Miễn phí lưu kho CFS (5 - 7 ngày đầu)', unit: 'VND / Lô', price: 0 },
  { id: 'vas_ebl', name: 'Phát hành vận đơn điện tử e-BL / Seaway Bill', unit: 'VND / Set', price: 0 },
  { id: 'vas_wrap_pe', name: 'Quấn màng co PE & nẹp góc bảo vệ kiện lẻ tại CFS', unit: 'VND / Kiện', price: 35000 },
  { id: 'vas_wooden_crate', name: 'Đóng kiện gỗ & hun trùng pallet tiêu chuẩn ISPM 15', unit: 'VND / Kiện', price: 180000 },
  { id: 'vas_check_photo', name: 'Kiểm đếm, chụp ảnh đối soát kiện hàng tại kho CFS', unit: 'VND / Lô', price: 100000 },
  { id: 'vas_cfs_storage', name: 'Phí lưu kho CFS quá hạn (sau thời gian miễn phí)', unit: 'VND / CBM / Ngày', price: 25000 },
  { id: 'vas_shipping_mark', name: 'In dán nhãn Shipping Mark & mã vạch Barcode', unit: 'VND / Kiện', price: 15000 },
  { id: 'vas_scale_vgm', name: 'Cân tải trọng điện tử & in phiếu VGM kiện lẻ', unit: 'VND / Lô', price: 80000 },
  { id: 'vas_palletizing', name: 'Xếp hàng lên pallet & đóng đai nhựa PP/PET chuyên dụng', unit: 'VND / Pallet', price: 90000 },
  { id: 'vas_customs_support', name: 'Hỗ trợ kéo hàng kiểm hóa thực tế tại kho CFS', unit: 'VND / Lô', price: 300000 },
  { id: 'vas_insurance', name: 'Bảo hiểm hàng hải quốc tế All-Risks (Loại A)', unit: 'VND / Lô', price: 500000 },
];

export const OceanLclCostMatrixModal: React.FC<OceanLclCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
}) => {
  if (!isOpen || !route) return null;

  // TIỀN TỆ
  const [currency, setCurrency] = useState<'VND' | 'USD'>('VND');

  // KHỐI 1: BẬC THỂ TÍCH (CBM)
  const [volumeTiers, setVolumeTiers] = useState<LclTierColumn[]>([
    { id: 'v1', rangeLabel: '< 1.0 CBM', minVal: 0.1, maxVal: 1.0 },
    { id: 'v2', rangeLabel: '1.0 – 3.0 CBM', minVal: 1.0, maxVal: 3.0 },
    { id: 'v3', rangeLabel: '3.1 – 5.0 CBM', minVal: 3.1, maxVal: 5.0 },
    { id: 'v4', rangeLabel: '5.1 – 10.0 CBM', minVal: 5.1, maxVal: 10.0 },
    { id: 'v5', rangeLabel: '> 10.0 CBM', minVal: 10.1, maxVal: 999999 },
  ]);

  // KHỐI 2: BẬC TRỌNG LƯỢNG (KG / TẤN)
  const [weightTiers, setWeightTiers] = useState<LclTierColumn[]>([
    { id: 'w1', rangeLabel: '< 500 Kg', minVal: 1, maxVal: 500 },
    { id: 'w2', rangeLabel: '501 – 1.000 Kg', minVal: 501, maxVal: 1000 },
    { id: 'w3', rangeLabel: '1.001 – 3.000 Kg', minVal: 1001, maxVal: 3000 },
    { id: 'w4', rangeLabel: '3.001 – 5.000 Kg', minVal: 3001, maxVal: 5000 },
    { id: 'w5', rangeLabel: '> 5.000 Kg', minVal: 5001, maxVal: 999999 },
  ]);

  // MIN CHARGES (MOQ)
  const [minChargeCbm, setMinChargeCbm] = useState<number>(1500000);
  const [minChargeKg, setMinChargeKg] = useState<number>(1500000);

  // CƯỚC BIỂN CƠ BẢN (BASE FREIGHT O/F)
  const [basePricesCbm, setBasePricesCbm] = useState<Record<string, number>>({
    v1: 2117040,
    v2: 1950000,
    v3: 1800000,
    v4: 1650000,
    v5: 1500000,
  });

  const [basePricesKg, setBasePricesKg] = useState<Record<string, number>>({
    w1: 2117,
    w2: 1950,
    w3: 1800,
    w4: 1650,
    w5: 1500,
  });

  // MỤC 1: PHỤ PHÍ HÃNG TÀU & CẢNG BIỂN (SURCHARGES) - ACTIVE LIST
  const [activeSurcharges, setActiveSurcharges] = useState<OceanLclSurchargeItem[]>([
    { id: 'thc_fee', name: 'Phí xếp dỡ tại cảng bốc (THC POL)', unit: 'VND / CBM', type: 'variable', defaultCbm: 185241, defaultKg: 185 },
    { id: 'bl_fee', name: 'Phí phát hành vận đơn (B/L Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 529260 },
    { id: 'seal_fee', name: 'Phí chì niêm phong Container (Seal Fee)', unit: 'VND / Set', type: 'fixed', defaultFixedPrice: 200000 },
    { id: 'fuel_baf', name: 'Phụ phí nhiên liệu xanh BAF / LSS', unit: 'VND / CBM', type: 'variable', defaultCbm: 119084, defaultKg: 119 },
    { id: 'cfs_fee', name: 'Phí bốc xếp & khai thác kho CFS (CFS Fee)', unit: 'VND / CBM', type: 'variable', defaultCbm: 264630, defaultKg: 265 },
    { id: 'ddc_fee', name: 'Phí giao hàng tại đích (Destination Delivery Charge - DDC)', unit: 'VND / CBM', type: 'variable', defaultCbm: 529260, defaultKg: 529 },
  ]);

  // GIÁ PHỤ PHÍ BIẾN ĐỔI THEO CBM VÀ KG
  const [variablePricesCbm, setVariablePricesCbm] = useState<Record<string, Record<string, number>>>({
    thc_fee: { v1: 185241, v2: 185241, v3: 175000, v4: 165000, v5: 155000 },
    cfs_fee: { v1: 264630, v2: 264630, v3: 250000, v4: 240000, v5: 220000 },
    fuel_baf: { v1: 119084, v2: 119084, v3: 110000, v4: 105000, v5: 95000 },
    ddc_fee: { v1: 529260, v2: 529260, v3: 500000, v4: 480000, v5: 450000 },
  });

  const [variablePricesKg, setVariablePricesKg] = useState<Record<string, Record<string, number>>>({
    thc_fee: { w1: 185, w2: 185, w3: 175, w4: 165, w5: 155 },
    cfs_fee: { w1: 265, w2: 265, w3: 250, w4: 240, w5: 220 },
    fuel_baf: { w1: 119, w2: 119, w3: 110, w4: 105, w5: 95 },
    ddc_fee: { w1: 529, w2: 529, w3: 500, w4: 480, w5: 450 },
  });

  // GIÁ PHỤ PHÍ CỐ ĐỊNH (THEO BỘ CHỨNG TỪ / LÔ)
  const [fixedPrices, setFixedPrices] = useState<Record<string, number>>({
    bl_fee: 529260,
    seal_fee: 200000,
    do_fee: 264630,
    ams_afr: 264630,
    handling_fee: 317556,
  });

  // MỤC 2: VAS & TIỆN ÍCH KÈM THEO - ACTIVE LIST
  const [vasItems, setVasItems] = useState<OceanLclVasItem[]>([
    { id: 'vas_free_storage', name: 'Miễn phí lưu kho CFS (5 - 7 ngày đầu)', unit: 'VND / Lô', price: 0 },
    { id: 'vas_ebl', name: 'Phát hành vận đơn điện tử e-BL / Seaway Bill', unit: 'VND / Set', price: 0 },
    { id: 'vas_wrap_pe', name: 'Quấn màng co PE & nẹp góc bảo vệ kiện lẻ tại CFS', unit: 'VND / Kiện', price: 35000 },
    { id: 'vas_wooden_crate', name: 'Đóng kiện gỗ & hun trùng pallet tiêu chuẩn ISPM 15', unit: 'VND / Kiện', price: 180000 },
  ]);

  // MỤC 3: CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN
  const [departureSchedule, setDepartureSchedule] = useState<string>(route.sla || route.departureSchedule || 'Thứ 4, Thứ 7 (Cắt hàng CFS 17:00)');
  const [transitType, setTransitType] = useState<'Direct' | 'Transit'>('Direct');
  const [oceanTransitTime, setOceanTransitTime] = useState<string>('3 - 5 Ngày (Nội Á)');
  const [wmRatio, setWmRatio] = useState<string>('1 CBM = 1.000 Kg (Chuẩn W/M Hải Vận Quốc Tế)');
  const [validUntil, setValidUntil] = useState<string>(route.validUntil || '2026-12-31');
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30 Days');

  // MODAL TỰ NHẬP PHỤ PHÍ MỚI
  const [isCustomSurchargeModalOpen, setIsCustomSurchargeModalOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<string>('VND / CBM');
  const [customType, setCustomType] = useState<'variable' | 'fixed'>('variable');
  const [customDefaultPrice, setCustomDefaultPrice] = useState<number>(100000);

  // MODAL CẤU HÌNH LỊCH ĐÓNG HÀNG & GIỜ CẮT MÁNG CFS
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [scheduleModalDays, setScheduleModalDays] = useState<string[]>(['Thứ 4', 'Thứ 7']);
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
        setScheduleModalDays(['Thứ 4', 'Thứ 7']);
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

  // TÍNH TOÁN ĐƠN GIÁ ALL-IN (CƯỚC BIỂN + PHỤ PHÍ BIẾN ĐỔI THEO BẬC)
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
    const newTier: LclTierColumn = {
      id: newId,
      rangeLabel: `Bậc ${nextIdx} (> ${volumeTiers[volumeTiers.length - 1]?.maxVal || 10} CBM)`,
      minVal: (volumeTiers[volumeTiers.length - 1]?.maxVal || 10) + 0.1,
      maxVal: 999999,
    };
    setVolumeTiers([...volumeTiers, newTier]);
    setBasePricesCbm(prev => ({ ...prev, [newId]: 1400000 }));
    setVariablePricesCbm(prev => {
      const updated = { ...prev };
      activeSurcharges.filter(s => s.type === 'variable').forEach(s => {
        if (!updated[s.id]) updated[s.id] = {};
        updated[s.id][newId] = s.defaultCbm || 100000;
      });
      return updated;
    });
  };

  // THÊM BẬC KG MỚI
  const handleAddWeightTier = () => {
    const nextIdx = weightTiers.length + 1;
    const newId = `w${Date.now()}`;
    const newTier: LclTierColumn = {
      id: newId,
      rangeLabel: `Bậc ${nextIdx} (> ${weightTiers[weightTiers.length - 1]?.maxVal || 5000} Kg)`,
      minVal: (weightTiers[weightTiers.length - 1]?.maxVal || 5000) + 1,
      maxVal: 999999,
    };
    setWeightTiers([...weightTiers, newTier]);
    setBasePricesKg(prev => ({ ...prev, [newId]: 1400 }));
    setVariablePricesKg(prev => {
      const updated = { ...prev };
      activeSurcharges.filter(s => s.type === 'variable').forEach(s => {
        if (!updated[s.id]) updated[s.id] = {};
        updated[s.id][newId] = s.defaultKg || 100;
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

    const lovItem = OCEAN_LCL_SURCHARGES_LOV.find(s => s.id === surchargeId);
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
    const newItem: OceanLclSurchargeItem = {
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
    const lovItem = OCEAN_LCL_VAS_LOV.find(v => v.id === vasId);
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
    const payload: OceanLclPricingConfig = {
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
      oceanTransitTime,
      transitType,
      paymentTerms,
      validUntil,
    };

    onSave(route.id, {
      oceanLclPricing: payload,
      price: getAllInPriceCbm(volumeTiers[0]?.id || 'v1') || basePricesCbm['v1'] || 2117040,
      pricingUnit: 'CBM',
      departureSchedule,
      sla: oceanTransitTime,
      transitType,
      validUntil,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-7xl w-full max-h-[96vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* =========================================================================
            MODAL HEADER (CHUẨN FCL & LCL UNIFIED)
        ========================================================================= */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30 shadow-inner shrink-0">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500 text-slate-950">
                  Biểu Phí Chi Tiết
                </span>
                <h3 className="text-base font-black tracking-tight text-white">
                  Ma Trận Biểu Phí Hàng Lẻ Đóng Ghép Đa Bậc (Ocean LCL Matrix)
                </h3>
                <span className="text-xs font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                  {currency === 'VND' ? 'VND (₫)' : 'USD ($)'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap font-medium">
                <span>Tuyến: <strong className="text-white">{route.route || route.routeCode}</strong></span>
                <span>• Từ: <strong>{route.origin}</strong></span>
                <span>➔ Đến: <strong>{route.destination}</strong></span>
                <span className="bg-sky-900/60 text-sky-200 text-[11px] font-bold px-2 py-0.5 rounded border border-sky-700/50">
                  Hãng Tàu/Co-loader: {route.vehicleType || 'Maersk Line'}
                </span>
                <span className="bg-emerald-950/70 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
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
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Khai báo song song 2 chiều: <strong className="text-sky-700">Thể Tích ({volumeTiers.length} bậc CBM)</strong> & <strong className="text-indigo-700">Khối Lượng ({weightTiers.length} bậc Kg)</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-normal">Đồng bộ chuẩn hiển thị & thêm phụ phí theo FCL</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-sky-600" />
              <span>Thêm Bậc Thể Tích (CBM)</span>
            </button>

            <button
              type="button"
              onClick={handleAddWeightTier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-300 hover:bg-indigo-100 font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
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
            BẢNG HỢP NHẤT DUY NHẤT (UNIFIED MATRIX TABLE - 100% STYLE FCL)
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
                <th colSpan={volumeTiers.length + 1} className="bg-sky-50 text-sky-950 py-2.5 px-3 border-r-2 border-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Box className="w-4 h-4 text-sky-600" />
                    <span className="font-black tracking-wide uppercase">BIỂU GIÁ THEO THỂ TÍCH (CUBIC METER - CBM)</span>
                    <span className="text-[10.5px] font-normal text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                      {currency === 'VND' ? 'đ/CBM' : 'USD/CBM'}
                    </span>
                  </div>
                </th>

                {/* KHỐI 2: TRỌNG LƯỢNG (KG) */}
                <th colSpan={weightTiers.length + 1} className="bg-indigo-50 text-indigo-950 py-2.5 px-3">
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span className="font-black tracking-wide uppercase">BIỂU GIÁ THEO TRỌNG LƯỢNG (REVENUE TON / KG)</span>
                    <span className="text-[10.5px] font-normal text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300">
                      {currency === 'VND' ? 'đ/kg' : 'USD/kg'}
                    </span>
                  </div>
                </th>
              </tr>

              {/* TẦNG 2: CHI TIẾT CÁC CỘT BẬC */}
              <tr className="border-b border-slate-300 divide-x divide-slate-200 text-center font-bold">
                {/* CBM Columns */}
                {volumeTiers.map((t, idx) => (
                  <th key={t.id} className="bg-sky-50/70 py-2 px-2 text-slate-800 font-bold min-w-[105px] max-w-[125px]">
                    <div className="flex items-center justify-between text-[11px] text-sky-900 font-extrabold">
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
                      className="w-full text-center text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded px-1 py-0.5 mt-0.5 focus:border-sky-500 focus:outline-none"
                    />
                  </th>
                ))}
                <th className="bg-sky-100/70 text-sky-950 py-2 px-2 border-r-2 border-slate-300 min-w-[105px]">
                  <div className="text-[11px] font-black">MIN CHARGE</div>
                  <div className="text-[9.5px] font-normal text-slate-500">Tối thiểu / Lô</div>
                </th>

                {/* Kg Columns */}
                {weightTiers.map((t, idx) => (
                  <th key={t.id} className="bg-indigo-50/70 py-2 px-2 text-slate-800 font-bold min-w-[105px] max-w-[125px]">
                    <div className="flex items-center justify-between text-[11px] text-indigo-900 font-extrabold">
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
                      className="w-full text-center text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 rounded px-1 py-0.5 mt-0.5 focus:border-indigo-500 focus:outline-none"
                    />
                  </th>
                ))}
                <th className="bg-indigo-100/70 text-indigo-950 py-2 px-2 min-w-[105px]">
                  <div className="text-[11px] font-black">MIN CHARGE</div>
                  <div className="text-[9.5px] font-normal text-slate-500">Tối thiểu / Lô</div>
                </th>
              </tr>

              {/* TỔNG CƯỚC THAM CHIẾU DỰ KIẾN (ALL-IN) - CHUẨN FCL */}
              <tr className="bg-sky-50/80 border-b border-sky-200">
                <td className="sticky left-0 z-30 bg-sky-50 text-left px-4 py-3 font-black text-sky-950 text-xs border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-sky-600" />
                      <span>TỔNG CƯỚC DỰ KIẾN (OF + PHỤ PHÍ BIẾN ĐỔI)</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 bg-sky-200 text-sky-800 font-mono font-bold rounded">
                      Tự động cộng
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Cước biển cơ bản cộng toàn bộ phụ phí biến đổi theo bậc
                  </p>
                </td>

                {/* All-in CBM */}
                {volumeTiers.map((t) => (
                  <td key={`total-cbm-${t.id}`} className="p-2 text-center font-black text-sky-950 bg-sky-50/50 font-mono text-[13px] border-r border-slate-200">
                    {getAllInPriceCbm(t.id).toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                    <div className="text-[9.5px] font-bold text-sky-700 font-sans">/ CBM</div>
                  </td>
                ))}
                <td className="p-2 text-center font-bold text-sky-950 border-r-2 border-slate-300 bg-sky-100/40 font-mono text-xs">
                  {minChargeCbm.toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                  <div className="text-[9px] font-normal text-slate-500 font-sans">Min/Lô</div>
                </td>

                {/* All-in Kg */}
                {weightTiers.map((t) => (
                  <td key={`total-kg-${t.id}`} className="p-2 text-center font-black text-indigo-950 bg-indigo-50/50 font-mono text-[13px] border-r border-slate-200">
                    {getAllInPriceKg(t.id).toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                    <div className="text-[9.5px] font-bold text-indigo-700 font-sans">/ kg</div>
                  </td>
                ))}
                <td className="p-2 text-center font-bold text-indigo-950 bg-indigo-100/40 font-mono text-xs">
                  {minChargeKg.toLocaleString()} {currency === 'VND' ? '₫' : '$'}
                  <div className="text-[9px] font-normal text-slate-500 font-sans">Min/Lô</div>
                </td>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* ===================================================================
                  CƯỚC BIỂN CƠ BẢN (BASE OCEAN FREIGHT - OF) * [BẮT BUỘC]
              =================================================================== */}
              <tr className="bg-white hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Ship className="w-3.5 h-3.5 text-sky-600" />
                      <span>Cước Biển Cơ Bản (Ocean Freight - OF) *</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold rounded border border-rose-200">
                      Bắt buộc
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Đơn giá cước vận chuyển chặng biển ({currency === 'VND' ? 'VND / CBM & VND / kg' : 'USD / CBM & USD / kg'})
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
                      className="w-full text-center px-1.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 border-r-2 border-slate-300 bg-slate-50/40">
                  <input
                    type="number"
                    min="0"
                    value={minChargeCbm}
                    onChange={(e) => setMinChargeCbm(Number(e.target.value) || 0)}
                    className="w-full text-center px-1.5 py-1 text-xs font-bold text-sky-950 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-2xs"
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
                      className="w-full text-center px-1.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 bg-slate-50/40">
                  <input
                    type="number"
                    min="0"
                    value={minChargeKg}
                    onChange={(e) => setMinChargeKg(Number(e.target.value) || 0)}
                    className="w-full text-center px-1.5 py-1 text-xs font-bold text-indigo-950 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-2xs"
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
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>1A. PHỤ PHÍ BIẾN ĐỔI THEO KHỐI LƯỢNG & THỂ TÍCH (CBM & KG)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH CÁC PHỤ PHÍ BIẾN ĐỔI (VARIABLE) */}
              {activeSurcharges.filter(s => s.type === 'variable').map((surcharge) => (
                <tr key={`surcharge-row-${surcharge.id}`} className="hover:bg-sky-50/20 transition-colors">
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
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 border text-sky-800 bg-sky-50 border-sky-200">
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
                          className="w-full text-center px-1.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none font-mono"
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
                          className="w-full text-center px-1.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none font-mono"
                        />
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-center text-slate-400 font-mono bg-slate-50/20">-</td>
                </tr>
              ))}

              {/* HÀNG THÊM PHỤ PHÍ BIẾN ĐỔI 1A TỪ DANH MỤC LOV */}
              <tr className="bg-slate-50/80 border-b border-sky-100 hover:bg-sky-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  {(() => {
                    const activeIds = activeSurcharges.map(a => a.id);
                    const unaddedVariable = OCEAN_LCL_SURCHARGES_LOV.filter(l => l.type === 'variable' && !activeIds.includes(l.id));

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
                            className="text-[11px] text-sky-700 font-bold hover:underline cursor-pointer"
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
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-sky-400 rounded-lg hover:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
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
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
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
                          className="w-full text-center px-3 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
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
              <tr className="bg-slate-50/80 border-b border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  {(() => {
                    const activeIds = activeSurcharges.map(a => a.id);
                    const unaddedFixed = OCEAN_LCL_SURCHARGES_LOV.filter(l => l.type === 'fixed' && !activeIds.includes(l.id));

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
                            className="text-[11px] text-indigo-700 font-bold hover:underline cursor-pointer"
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
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-indigo-400 rounded-lg hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH VAS ĐANG ÁP DỤNG */}
              {vasItems.map((vas) => (
                <tr key={`vas-row-${vas.id}`} className="hover:bg-indigo-50/20 transition-colors">
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
                              ? 'border-indigo-300 font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500' 
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

              {/* HÀNG THÊM VAS TỪ DANH MỤC LOV (CHUẨN FCL SELECT DASHED) */}
              <tr className="bg-slate-50/80 border-b border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  {(() => {
                    const activeIds = vasItems.map(a => a.id);
                    const unadded = OCEAN_LCL_VAS_LOV.filter(l => !activeIds.includes(l.id));

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
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-indigo-400 rounded-lg hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                  MỤC 3: CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN - CHUẨN FCL
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={totalDataCols + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Anchor className="w-3.5 h-3.5 text-sky-700" />
                    <span>3. CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN</span>
                  </div>
                </td>
              </tr>

              {/* 1. Lịch đóng hàng & Giờ cắt máng CFS (Closing/Cut-off) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>1. Lịch Tàu Chạy & Giờ Cắt Máng CFS (Closing/Cut-off)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Lịch đóng hàng trong tuần và giờ hạn chót nhận hàng tại kho CFS
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <button
                    type="button"
                    onClick={handleOpenScheduleModal}
                    className="max-w-md mx-auto px-4 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:border-sky-500 hover:bg-sky-50/20 hover:text-sky-900 transition-all shadow-2xs flex items-center justify-between gap-2 group cursor-pointer"
                    title="Nhấp để cấu hình chi tiết lịch tàu chạy và giờ cắt máng CFS"
                  >
                    <span className="truncate flex-1 text-center font-medium">
                      {departureSchedule}
                    </span>
                    <Calendar className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                </td>
              </tr>

              {/* 2. Loại Tuyến (Transit Type): Direct hoặc Transit */}
              <tr className="hover:bg-slate-50/60 transition-colors bg-sky-50/20">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5 text-sky-600" />
                    <span>2. Loại Tuyến (Transit Type)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Tàu chạy thẳng trực tiếp hay có ghé cảng trung chuyển gom hàng
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <select
                      value={transitType}
                      onChange={(e) => setTransitType(e.target.value as 'Direct' | 'Transit')}
                      className={`w-full px-3 py-1.5 text-xs font-bold text-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer ${
                        transitType === 'Direct' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Direct">Direct (Tàu chạy thẳng)</option>
                      <option value="Transit">Transit (Tàu chuyển tải qua cảng trung chuyển)</option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 3. Thời Gian Hành Trình (Transit Time) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>3. Thời Gian Hành Trình (Transit Time)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Số ngày tàu chạy dự kiến từ cảng bốc đến cảng dỡ
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <input
                      type="text"
                      value={oceanTransitTime}
                      onChange={(e) => setOceanTransitTime(e.target.value)}
                      placeholder="VD: 3 - 5 Ngày (Nội Á)"
                      className="w-full px-3 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    />
                  </div>
                </td>
              </tr>

              {/* 4. Quy Tắc Tính Cước W/M */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-sky-600" />
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
                      className="w-full px-3 py-1.5 text-xs font-bold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="1 CBM = 1.000 Kg (Chuẩn W/M Hải Vận Quốc Tế)">
                        1 CBM = 1.000 Kg (Chuẩn W/M Hải Vận Quốc Tế)
                      </option>
                      <option value="1 CBM = 500 Kg (Chuyên chở hàng thể tích lớn)">
                        1 CBM = 500 Kg (Chuyên chở hàng thể tích lớn)
                      </option>
                      <option value="1 CBM = 800 Kg (Tuyến Đông Nam Á)">
                        1 CBM = 800 Kg (Tuyến Đông Nam Á)
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 5. Thời Hạn Hiệu Lực Giá (Valid Until) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>5. Thời Hạn Hiệu Lực Giá (Valid Until)</span>
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
                      className="w-full px-3 py-1.5 text-xs text-center font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer"
                    />
                  </div>
                </td>
              </tr>

              {/* 6. Điều Khoản Thanh Toán (Payment Terms) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>6. Điều Khoản Thanh Toán (Payment Terms)</span>
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
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="Net 15 Days">Net 15 Days (Thanh toán sau 15 ngày)</option>
                      <option value="Net 30 Days">Net 30 Days (Thanh toán sau 30 ngày)</option>
                      <option value="Net 45 Days">Net 45 Days (Thanh toán sau 45 ngày)</option>
                      <option value="Prepaid (Trước khi phát hành B/L)">Prepaid (Trước khi phát hành B/L)</option>
                      <option value="Thanh toán khi hàng cập cảng đích">Thanh toán khi hàng cập cảng đích</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            MODAL FOOTER (CHUẨN FCL & LCL UNIFIED)
        ========================================================================= */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Đang cấu hình <strong className="text-slate-800">{volumeTiers.length} bậc CBM</strong> & <strong className="text-slate-800">{weightTiers.length} bậc Kg</strong> cho tuyến này.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleConfirmSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Ma Trận Biểu Phí LCL</span>
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL CON: TỰ NHẬP PHỤ PHÍ MỚI (KHI CHỌN TỪ DROPDOWN)
      ========================================================================= */}
      {isCustomSurchargeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-md w-full p-5 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Thêm Phụ Phí Tùy Chỉnh Mới</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsCustomSurchargeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tên phụ phí mới *:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="VD: Phí hun trùng kiểm dịch gỗ tại kho CFS..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phân loại áp dụng:</label>
                  <select
                    value={customType}
                    onChange={(e) => {
                      const t = e.target.value as 'variable' | 'fixed';
                      setCustomType(t);
                      if (t === 'fixed') {
                        setCustomUnit('VND / Set');
                      } else {
                        setCustomUnit('VND / CBM');
                      }
                    }}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="variable">Biến đổi theo CBM / Kg</option>
                    <option value="fixed">Cố định theo Bộ / Lô</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Đơn vị tính:</label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    {customType === 'variable' ? (
                      <>
                        <option value="VND / CBM">VND / CBM</option>
                        <option value="VND / Kg">VND / Kg</option>
                        <option value="USD / CBM">USD / CBM</option>
                      </>
                    ) : (
                      <>
                        <option value="VND / Set">VND / Set (Bộ)</option>
                        <option value="VND / Shipment">VND / Shipment (Lô)</option>
                        <option value="VND / Tờ khai">VND / Tờ khai</option>
                        <option value="USD / Set">USD / Set</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mức phí áp dụng ({currency === 'VND' ? '₫' : '$'}):</label>
                <input
                  type="number"
                  min="0"
                  value={customDefaultPrice}
                  onChange={(e) => setCustomDefaultPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCustomSurchargeModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveCustomSurcharge}
                disabled={!customName.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg shadow-sm cursor-pointer"
              >
                Thêm Vào Bảng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL CON: CẤU HÌNH LỊCH ĐÓNG HÀNG & GIỜ CẮT MÁNG CFS (CUT-OFF)
      ========================================================================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Cấu Hình Lịch Đóng Hàng & Giờ Cắt Máng CFS
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Chọn ngày đóng hàng trong tuần và mốc giờ cắt máng tại kho CFS
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CHỌN NGÀY TRONG TUẦN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>1. Chọn ngày đóng hàng CFS trong tuần:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (scheduleModalDays.length === 7) {
                      setScheduleModalDays(['Thứ 4', 'Thứ 7']);
                    } else {
                      setScheduleModalDays(SCHEDULE_DAYS_OF_WEEK.map(d => d.name));
                    }
                  }}
                  className="text-[11px] text-sky-600 hover:underline cursor-pointer"
                >
                  {scheduleModalDays.length === 7 ? 'Đặt lại thứ 4 & 7' : 'Chọn cả tuần (Hàng ngày)'}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {SCHEDULE_DAYS_OF_WEEK.map((day) => {
                  const isSelected = scheduleModalDays.includes(day.name);
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          if (scheduleModalDays.length > 1) {
                            setScheduleModalDays(scheduleModalDays.filter(d => d !== day.name));
                          }
                        } else {
                          setScheduleModalDays([...scheduleModalDays, day.name]);
                        }
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-200'
                      }`}
                    >
                      {day.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHỌN GIỜ CẮT MÁNG CFS (CLOSING/CUT-OFF TIME) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                2. Giờ cắt máng nhận hàng kho CFS (Cut-off Time):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LCL_CLOSING_TIMES.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setScheduleModalTime(slot.time)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer text-xs ${
                      scheduleModalTime === slot.time
                        ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-1 ring-sky-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-sky-900">{slot.time}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{slot.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW */}
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Kết quả hiển thị:</span>
              <strong className="text-sky-950 font-bold">
                {getSchedulePreviewString(scheduleModalDays, scheduleModalTime)}
              </strong>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs cursor-pointer"
              >
                Xác Nhận Lịch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
