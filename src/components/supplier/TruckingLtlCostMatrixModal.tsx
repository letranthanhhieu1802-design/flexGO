import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Truck, 
  Save, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  Check, 
  Zap, 
  Package, 
  Box, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { CapabilityRouteItem } from './SupplierServiceCapabilityModal';
import { getReadOnlyMatrixInteractionProps } from './readOnlyCostMatrix';
import {
  SCHEDULE_DAYS_OF_WEEK,
  SCHEDULE_FREQUENCY_PRESETS,
  SCHEDULE_DEPARTURE_TIMES,
} from './TruckingFtlCostMatrixModal';

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

// Danh mục phụ phí LTL (Surcharges)
export const LTL_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu (BAF LTL Fuel Surcharge)', unit: 'đ / Kg & đ / CBM' },
  { id: 'hubHandling', name: 'Phí nâng hạ bến bãi & bốc xếp Hub gom hàng', unit: 'đ / Kg & đ / CBM' },
  { id: 'transhipment', name: 'Phí sang tải xe nhỏ trung chuyển nội đô', unit: 'đ / Kg & đ / CBM' },
  { id: 'nightDelivery', name: 'Phụ phí giao hàng ban đêm / giờ cấm tải', unit: 'đ / Lô' },
  { id: 'docManagement', name: 'Phí vận đơn, seal & quản lý mã vạch kiện hàng', unit: 'đ / Lô' },
  { id: 'peakSeason', name: 'Phụ phí cao điểm mùa vụ LTL (Peak Season)', unit: 'đ / Kg & đ / CBM' },
];

// Danh mục tiện ích VAS LTL
export const LTL_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'doorPickup', name: 'Phí lấy hàng tận nơi (Door Pick-up)', unit: 'VND / Lô', defaultPrice: 100000 },
  { id: 'doorDelivery', name: 'Phí giao hàng tận nơi (Door Delivery)', unit: 'VND / Lô', defaultPrice: 100000 },
  { id: 'laborFloor', name: 'Bốc vác lên tầng cao / Vào hẻm sâu', unit: 'VND / Kiện', defaultPrice: 50000 },
  { id: 'wrapPe', name: 'Quấn màng co PE & nẹp góc carton chống trầy', unit: 'VND / Kiện', defaultPrice: 30000 },
  { id: 'cratePallet', name: 'Đóng kiện gỗ / Đóng pallet chuyên dụng', unit: 'VND / Kiện', defaultPrice: 150000 },
  { id: 'codService', name: 'Dịch vụ thu hộ tiền mặt (COD) & đối soát 24h', unit: '% COD', defaultPrice: 1 },
  { id: 'podReturn', name: 'Thu hồi chứng từ gốc (e-POD ký nhận)', unit: 'VND / Bộ', defaultPrice: 0 },
  { id: 'hubStorage', name: 'Phí lưu kho quá hạn tại Hub gom (sau ngày miễn phí)', unit: 'VND / Kiện / Ngày', defaultPrice: 20000 },
  { id: 'insuranceLtl', name: 'Bảo hiểm hàng hóa vận chuyển toàn diện (All-Risk)', unit: 'VND / Lô', defaultPrice: 50000 },
  { id: 'barcodeTracking', name: 'Dán mã Barcode / QR truy xuất hành trình real-time', unit: 'VND / Kiện', defaultPrice: 0 },
];

// LOV Tỷ lệ quy đổi hàng nhẹ
export const LTL_VOLUMETRIC_RATIOS = [
  '1 CBM = 250 Kg (Tiêu chuẩn)',
  '1 CBM = 200 Kg (Hàng siêu nhẹ)',
  '1 CBM = 300 Kg (Hàng thương mại)',
  '1 CBM = 333 Kg (Chuẩn chuyển phát)',
];

interface TruckingLtlCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CapabilityRouteItem | null;
  onSave: (routeId: string, updatedData: Partial<CapabilityRouteItem>) => void;
  isReadOnly?: boolean;
}

export const TruckingLtlCostMatrixModal: React.FC<TruckingLtlCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
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

  // MIN CHARGES (MOQ)
  const [minChargeKg, setMinChargeKg] = useState<number>(100000);
  const [minChargeCbm, setMinChargeCbm] = useState<number>(150000);

  // CƯỚC VẬN CHUYỂN CHÍNH (BASE FREIGHT)
  const [basePricesKg, setBasePricesKg] = useState<Record<string, number>>({
    w1: 2500,
    w2: 2000,
    w3: 1650,
    w4: 1350,
    w5: 1100,
  });

  const [basePricesCbm, setBasePricesCbm] = useState<Record<string, number>>({
    v1: 600000,
    v2: 500000,
    v3: 420000,
    v4: 380000,
    v5: 320000,
  });

  // HẠNG MỤC 1: PHỤ PHÍ THEO BẬC (SURCHARGES)
  const [activeSurcharges, setActiveSurcharges] = useState<string[]>([
    'fuelBAF',
    'hubHandling',
  ]);

  const [surchargePricesKg, setSurchargePricesKg] = useState<Record<string, Record<string, number>>>({
    fuelBAF: { w1: 150, w2: 130, w3: 110, w4: 90, w5: 80 },
    hubHandling: { w1: 150, w2: 120, w3: 100, w4: 80, w5: 70 },
  });

  const [surchargePricesCbm, setSurchargePricesCbm] = useState<Record<string, Record<string, number>>>({
    fuelBAF: { v1: 35000, v2: 30000, v3: 25000, v4: 22000, v5: 20000 },
    hubHandling: { v1: 30000, v2: 25000, v3: 20000, v4: 18000, v5: 15000 },
  });

  // HẠNG MỤC 2: VAS & TIỆN ÍCH KÈM THEO
  const [vasItems, setVasItems] = useState<Array<{
    id: string;
    name: string;
    unit: string;
    price: number;
    isFree: boolean;
  }>>([
    { id: 'doorPickup', name: 'Phí lấy hàng tận nơi (Door Pick-up)', unit: 'VND / Lô', price: 100000, isFree: false },
    { id: 'doorDelivery', name: 'Phí giao hàng tận nơi (Door Delivery)', unit: 'VND / Lô', price: 100000, isFree: false },
    { id: 'laborFloor', name: 'Bốc vác lên tầng cao / Vào hẻm sâu', unit: 'VND / Kiện', price: 50000, isFree: false },
    { id: 'wrapPe', name: 'Quấn màng co PE & nẹp góc carton', unit: 'VND / Kiện', price: 30000, isFree: false },
    { id: 'cratePallet', name: 'Đóng kiện gỗ / Đóng pallet chuyên dụng', unit: 'VND / Kiện', price: 150000, isFree: false },
    { id: 'codService', name: 'Dịch vụ thu hộ tiền mặt (COD) & đối soát 24h', unit: '% COD', price: 1, isFree: false },
    { id: 'podReturn', name: 'Thu hồi chứng từ gốc (e-POD ký nhận)', unit: 'VND / Bộ', price: 0, isFree: true },
    { id: 'hubStorage', name: 'Phí lưu kho quá hạn tại Hub gom', unit: 'VND / Kiện / Ngày', price: 20000, isFree: false },
  ]);

  // HẠNG MỤC 3: CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI
  const [volumetricRatio, setVolumetricRatio] = useState<string>('1 CBM = 250 Kg (Tiêu chuẩn)');
  const [departureSchedule, setDepartureSchedule] = useState<string>(
    route.sla || 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)'
  );
  const [transitSla, setTransitSla] = useState<string>('24 - 48 giờ');
  const [freeLoadingHours, setFreeLoadingHours] = useState<number>(2);
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30 Days');
  const [validUntil, setValidUntil] = useState<string>(route.validUntil || '2026-12-31');

  // ĐIỀU CHỈNH 1: MODAL CẤU HÌNH LỊCH CHẠY & GIỜ XUẤT BẾN LTL
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

  // ĐIỀU CHỈNH 2: ĐỒNG BỘ THANH CUỘN NGANG LÊN PHÍA TRÊN BẢNG MA TRẬN
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

  // Lấy dữ liệu sẵn có từ route nếu đã từng cấu hình
  useEffect(() => {
    if (route.ltlPricing) {
      if (route.ltlPricing.minCharge) {
        setMinChargeKg(route.ltlPricing.minCharge);
      }
      if (route.ltlPricing.weightTiers && route.ltlPricing.weightTiers.length > 0) {
        setWeightTiers(route.ltlPricing.weightTiers.map(t => ({ id: t.id, rangeLabel: t.rangeLabel, minVal: t.minKg, maxVal: t.maxKg })));
        const newKg: Record<string, number> = {};
        route.ltlPricing.weightTiers.forEach(t => { newKg[t.id] = t.price; });
        setBasePricesKg(newKg);
      }
      if (route.ltlPricing.volumeTiers && route.ltlPricing.volumeTiers.length > 0) {
        setVolumeTiers(route.ltlPricing.volumeTiers.map(t => ({ id: t.id, rangeLabel: t.rangeLabel, minVal: t.minCbm, maxVal: t.maxCbm })));
        const newCbm: Record<string, number> = {};
        route.ltlPricing.volumeTiers.forEach(t => { newCbm[t.id] = t.price; });
        setBasePricesCbm(newCbm);
      }
    }
    if (route.sla) {
      setDepartureSchedule(route.sla);
    }
    if (route.validUntil) {
      setValidUntil(route.validUntil);
    }
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
    setBasePricesKg(prev => ({ ...prev, [newId]: 1000 }));
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
    setBasePricesCbm(prev => ({ ...prev, [newId]: 300000 }));
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
    const minKgPrice = kgPrices.length > 0 ? Math.min(...kgPrices) : 1650;
    const maxKgPrice = kgPrices.length > 0 ? Math.max(...kgPrices) : 2500;

    const cbmPrices = Object.values(basePricesCbm).filter((p): p is number => typeof p === 'number' && p > 0);
    const minCbmPrice = cbmPrices.length > 0 ? Math.min(...cbmPrices) : 320000;
    const maxCbmPrice = cbmPrices.length > 0 ? Math.max(...cbmPrices) : 600000;

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

    onSave(route.id, {
      price: minKgPrice || 1650,
      sla: departureSchedule,
      validUntil: validUntil,
      ltlPricing: updatedLtlPricing,
      // Lưu lại dải giá tóm tắt
      customRoute: `${route.route} (Kg: ${minKgPrice.toLocaleString('vi-VN')} - ${maxKgPrice.toLocaleString('vi-VN')} đ | CBM: ${minCbmPrice.toLocaleString('vi-VN')} - ${maxCbmPrice.toLocaleString('vi-VN')} đ)`,
    });

    onClose();
  };

  return (
    <div
      {...getReadOnlyMatrixInteractionProps(isReadOnly)}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-hidden animate-in fade-in duration-150"
    >
      <div className="w-full max-w-[96vw] 2xl:max-w-[1560px] h-[94vh] max-h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 my-auto animate-in zoom-in-95 duration-150">
        
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
              <div className="text-xs text-indigo-200/90 font-medium mt-0.5 flex items-center gap-3">
                <span>Tuyến: <strong className="text-white font-bold">{route.route}</strong></span>
                <span className="text-indigo-400">•</span>
                <span>Từ: <strong className="text-white font-semibold">{route.origin}</strong></span>
                <ArrowRight className="w-3 h-3 text-indigo-300 inline" />
                <span>Đến: <strong className="text-white font-semibold">{route.destination}</strong></span>
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
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOOLBAR NÚT HÀNH ĐỘNG THÊM BẬC */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
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
                        placeholder="2000"
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
                      placeholder="100000"
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
                        placeholder="450000"
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
                      placeholder="150000"
                    />
                  </td>
                </tr>

                {/* CÁC PHỤ PHÍ (SURCHARGES) ĐƯỢC CHỌN TỪ LOV */}
                {activeSurcharges.map((sId) => {
                  const sInfo = LTL_SECTION_1_SURCHARGES_LOV.find(s => s.id === sId) || {
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

                      {/* Khối Kg: Cột MOQ phụ phí (thường là gạch ngang -) */}
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
                        <option value="" disabled>+ Chọn phụ phí thêm từ LOV ({LTL_SECTION_1_SURCHARGES_LOV.length} mục)...</option>
                        {LTL_SECTION_1_SURCHARGES_LOV.filter(s => !activeSurcharges.includes(s.id)).map(s => (
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
                          const item = LTL_SECTION_2_VAS_LOV.find(v => v.id === e.target.value);
                          if (item) {
                            handleAddVasItem(item);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="" disabled>+ Chọn tiện ích VAS thêm ({LTL_SECTION_2_VAS_LOV.length} mục)...</option>
                        {LTL_SECTION_2_VAS_LOV.filter(v => !vasItems.some(item => item.id === v.id)).map(v => (
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

                {/* 3.1 Tỷ lệ quy đổi hàng nhẹ */}
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
                      {LTL_VOLUMETRIC_RATIOS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* 3.2 Lịch xuất bến xe gom hàng lẻ */}
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

                {/* 3.3 SLA Thời gian vận chuyển cam kết */}
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

                {/* 3.4 Điều khoản thanh toán */}
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

                {/* 3.5 Báo giá có hiệu lực đến ngày */}
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

      {/* MODAL: CẤU HÌNH LỊCH CHẠY & GIỜ XUẤT BẾN (TRUCKING LTL) */}
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
                    Cấu Hình Lịch Chạy & Giờ Xuất Bến (Trucking LTL)
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 flex-wrap mt-0.5">
                    <span>Tuyến: <strong className="text-indigo-700">{route?.route || route?.routeCode}</strong> ({route?.origin} ⇄ {route?.destination})</span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                      Xe: {route?.truckTonnage || '15.0T'} - {route?.truckBodyType || 'Xe Tải Thùng Kín'}
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
