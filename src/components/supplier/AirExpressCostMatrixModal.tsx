import React, { useState, useMemo } from 'react';
import {
  X,
  Zap,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  HelpCircle,
  TrendingDown,
  Info,
  Scale,
  Package,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CapabilityRouteItem } from './SupplierServiceCapabilityModal';
import { getReadOnlyMatrixInteractionProps } from './readOnlyCostMatrix';

export interface AirExpressTierColumn {
  id: string;
  rangeLabel: string;
  minVal: number;
  maxVal: number;
}

export interface AirExpressSurchargeItem {
  id: string;
  name: string;
  unit: string;
  type: 'variable' | 'fixed';
  defaultKg?: number;
  defaultFixedPrice?: number;
}

export interface AirExpressVasItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface AirExpressPricingConfig {
  currency: 'VND' | 'USD';
  weightTiers: AirExpressTierColumn[];
  minChargeKg: number;
  basePricesKg: Record<string, number>;
  activeSurcharges: AirExpressSurchargeItem[];
  variablePricesKg: Record<string, Record<string, number>>;
  fixedPrices: Record<string, number>;
  vasItems: AirExpressVasItem[];
  wmRatio: string;
  departureSchedule: string;
  airTransitTime: string;
  transitType: 'Direct' | 'Transit';
  deliveryMode: string;
  packagingStandard?: string;
  paymentTerms: string;
  validUntil: string;
}

interface AirExpressCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CapabilityRouteItem | null;
  onSave: (routeId: string, updatedData: Partial<CapabilityRouteItem>) => void;
  isReadOnly?: boolean;
}

export const EXPRESS_CARRIERS_LIST = [
  'DHL Express',
  'FedEx Express',
  'UPS Express',
  'SF Express (Thuận Phong)',
  'EMS (VNPost Express)',
  'Viettel Post Express',
  'Kerry Express',
  'J&T Express',
  'Khác (Nhập hãng khác)...',
];

// Danh mục phụ phí Express chuẩn
export const EXPRESS_VARIABLE_SURCHARGES_LOV: AirExpressSurchargeItem[] = [
  { id: 'fsc', name: 'Phụ phí nhiên liệu hàng không (FSC - Express Fuel Surcharge)', unit: 'USD / Kg', type: 'variable', defaultKg: 0.8 },
  { id: 'ess', name: 'Phụ phí tình huống khẩn cấp mạng lưới bay (Emergency Situation Surcharge)', unit: 'USD / Kg', type: 'variable', defaultKg: 0.5 },
  { id: 'oda', name: 'Phụ phí giao hàng vùng sâu vùng xa (Out of Area Delivery - ODA)', unit: 'USD / Kg', type: 'variable', defaultKg: 0.6 },
  { id: 'ow_surcharge', name: 'Phụ phí bưu kiện nặng quá tải trọng (> 70kg / Kiện)', unit: 'USD / Kg', type: 'variable', defaultKg: 0.7 },
  { id: 'os_surcharge', name: 'Phụ phí bưu kiện kích thước quá khổ (> 120cm / Cạnh)', unit: 'USD / Kg', type: 'variable', defaultKg: 0.5 },
  { id: 'lithium_batt', name: 'Phụ phí xử lý bưu kiện Pin Lithium (Section II DGR Courier)', unit: 'USD / Kg', type: 'variable', defaultKg: 1.2 },
];

export const EXPRESS_FIXED_SURCHARGES_LOV: AirExpressSurchargeItem[] = [
  { id: 'customs_formal', name: 'Phí thủ tục hải quan bưu kiện chuyển phát nhanh (Express Clearance)', unit: 'USD / Lô', type: 'fixed', defaultFixedPrice: 15 },
  { id: 'e_awb_label', name: 'Phí phát hành mã vạch bưu chính & vận đơn điện tử (e-AWB & Barcode)', unit: 'USD / Vận đơn', type: 'fixed', defaultFixedPrice: 3 },
  { id: 'addr_correction', name: 'Phí đính chính địa chỉ người nhận sau khi phát hành (Address Correction)', unit: 'USD / Lần', type: 'fixed', defaultFixedPrice: 12 },
  { id: 'duty_advancement', name: 'Phí ứng nộp thuế xuất nhập khẩu hộ (Duty Advancement Surcharge)', unit: 'USD / Lô', type: 'fixed', defaultFixedPrice: 10 },
  { id: 'bonded_storage', name: 'Phí lưu kho bưu kiện quá 3 ngày làm việc (Express Storage)', unit: 'USD / Ngày', type: 'fixed', defaultFixedPrice: 8 },
];

// Danh mục tiện ích VAS chuẩn cho Chuyển phát nhanh Express
export const EXPRESS_VAS_LOV: AirExpressVasItem[] = [
  { id: 'vas_insurance', name: 'Bảo hiểm bưu gửi Express All-Risks (100% giá trị bưu kiện)', unit: 'USD / Lô', price: 25 },
  { id: 'vas_direct_sig', name: 'Yêu cầu chữ ký trực tiếp tận tay người nhận (Direct Signature Required)', unit: 'USD / Vận đơn', price: 5 },
  { id: 'vas_photo_pod', name: 'Chụp ảnh bằng chứng phát hàng thành công kèm tọa độ GPS (Photo POD)', unit: 'USD / Vận đơn', price: 0 },
  { id: 'vas_tamper_seal', name: 'Dán tem niêm phong bảo mật chống can thiệp bưu phẩm (Security Tamper-Proof)', unit: 'USD / Kiện', price: 2 },
  { id: 'vas_saturday_del', name: 'Dịch vụ phát hàng khẩn cấp ngày Thứ Bảy / Chủ Nhật (Weekend Delivery)', unit: 'USD / Lô', price: 18 },
  { id: 'vas_pack_box', name: 'Đóng thùng carton 5 lớp gia cường và chèn mút bóng khí chống sốc', unit: 'USD / Kiện', price: 6 },
];

export const AirExpressCostMatrixModal: React.FC<AirExpressCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  isReadOnly = false,
}) => {
  if (!isOpen || !route) return null;

  // TIỀN TỆ
  const [currency, setCurrency] = useState<'VND' | 'USD'>(route.currency === 'VND' ? 'VND' : 'USD');

  // KHỐI TRỌNG LƯỢNG (KG) - 6 BẬC EXPRESS TIÊU CHUẨN (+45KG BASE)
  const [weightTiers, setWeightTiers] = useState<AirExpressTierColumn[]>([
    { id: 'exp_w1', rangeLabel: '< 5 Kg (Tài liệu / Hàng mẫu)', minVal: 0.5, maxVal: 5.0 },
    { id: 'exp_w2', rangeLabel: '5.1 – 20 Kg (Kiện nhỏ)', minVal: 5.1, maxVal: 20.0 },
    { id: 'exp_w3', rangeLabel: '+21 Kg (Thương mại nhẹ)', minVal: 21.0, maxVal: 44.9 },
    { id: 'exp_w4', rangeLabel: '+45 Kg (Base Rate)', minVal: 45.0, maxVal: 70.9 },
    { id: 'exp_w5', rangeLabel: '+71 Kg (Kiện lớn)', minVal: 71.0, maxVal: 99.9 },
    { id: 'exp_w6', rangeLabel: '+100 Kg (Lô sỉ Express)', minVal: 100.0, maxVal: 999999 },
  ]);

  // MIN CHARGE (CƯỚC SÀN TỐI THIỂU CHO 1 BƯU GỬI)
  const [minChargeKg, setMinChargeKg] = useState<number>(currency === 'USD' ? 18 : 450000);

  // BASE AIR EXPRESS FREIGHT PRICES (CƯỚC EXPRESS CƠ BẢN)
  const [basePricesKg, setBasePricesKg] = useState<Record<string, number>>(() => {
    const isUsd = currency === 'USD';
    return isUsd
      ? { exp_w1: 14.5, exp_w2: 10.2, exp_w3: 7.8, exp_w4: 6.5, exp_w5: 5.6, exp_w6: 4.8 }
      : { exp_w1: 360000, exp_w2: 255000, exp_w3: 195000, exp_w4: 162000, exp_w5: 140000, exp_w6: 120000 };
  });

  // PHỤ PHÍ BIẾN ĐỔI THEO KG (MỤC 1A)
  const [activeSurcharges, setActiveSurcharges] = useState<AirExpressSurchargeItem[]>([
    EXPRESS_VARIABLE_SURCHARGES_LOV[0], // FSC
    EXPRESS_VARIABLE_SURCHARGES_LOV[1], // ESS
    EXPRESS_VARIABLE_SURCHARGES_LOV[2], // ODA
  ]);

  const [variablePricesKg, setVariablePricesKg] = useState<Record<string, Record<string, number>>>(() => {
    const isUsd = currency === 'USD';
    return {
      fsc: isUsd
        ? { exp_w1: 0.9, exp_w2: 0.9, exp_w3: 0.8, exp_w4: 0.8, exp_w5: 0.7, exp_w6: 0.7 }
        : { exp_w1: 22000, exp_w2: 22000, exp_w3: 20000, exp_w4: 20000, exp_w5: 18000, exp_w6: 18000 },
      ess: isUsd
        ? { exp_w1: 0.6, exp_w2: 0.6, exp_w3: 0.5, exp_w4: 0.5, exp_w5: 0.4, exp_w6: 0.4 }
        : { exp_w1: 15000, exp_w2: 15000, exp_w3: 12000, exp_w4: 12000, exp_w5: 10000, exp_w6: 10000 },
      oda: isUsd
        ? { exp_w1: 0.7, exp_w2: 0.7, exp_w3: 0.6, exp_w4: 0.6, exp_w5: 0.5, exp_w6: 0.5 }
        : { exp_w1: 18000, exp_w2: 18000, exp_w3: 15000, exp_w4: 15000, exp_w5: 12000, exp_w6: 12000 },
    };
  });

  // PHỤ PHÍ CỐ ĐỊNH (MỤC 1B)
  const [fixedSurcharges, setFixedSurcharges] = useState<AirExpressSurchargeItem[]>([
    EXPRESS_FIXED_SURCHARGES_LOV[0], // Customs formal clearance
    EXPRESS_FIXED_SURCHARGES_LOV[1], // e-AWB barcode label
  ]);

  const [fixedPrices, setFixedPrices] = useState<Record<string, number>>(() => {
    const isUsd = currency === 'USD';
    return {
      customs_formal: isUsd ? 15 : 380000,
      e_awb_label: isUsd ? 3 : 75000,
    };
  });

  // MỤC 2: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS TÙY CHỌN - ĐẶT TRÊN CAM KẾT VẬN HÀNH)
  const [vasItems, setVasItems] = useState<AirExpressVasItem[]>([
    EXPRESS_VAS_LOV[0], // Insurance
    EXPRESS_VAS_LOV[1], // Direct Signature
    EXPRESS_VAS_LOV[2], // Photo POD (Free 0d)
  ]);

  // MỤC 3: THUỘC TÍNH VẬN HÀNH & ĐIỀU KHOẢN EXPRESS (DẠNG BẢNG PHẲNG)
  const [departureSchedule, setDepartureSchedule] = useState<string>(route.sla || 'Hàng ngày (Cắt bưu gửi 16:30)');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDays, setScheduleDays] = useState<string[]>(['T2', 'T3', 'T4', 'T5', 'T6', 'T7']);
  const [scheduleCutoffTime, setScheduleCutoffTime] = useState<string>('16:30');
  const [airTransitTime, setAirTransitTime] = useState<string>('24 - 48 Giờ (Hỏa tốc Express)');
  const [transitType, setTransitType] = useState<'Direct' | 'Transit'>('Direct');
  const [deliveryMode, setDeliveryMode] = useState<string>('Door-to-Door (Lấy tận nơi - Giao tận tay)');
  const [carrier, setCarrier] = useState<string>(route.vehicleType || route.shippingLine || 'DHL Express');
  const [wmRatio, setWmRatio] = useState<string>('1 CBM = 200 Kg (Chuẩn Express Courier: D×R×C / 5.000)');
  const [generalPackagingStandard, setGeneralPackagingStandard] = useState<string>(
    'Thùng carton đóng gói bưu kiện chuyển phát tiêu chuẩn IATA (Quấn màng co PE & niêm phong)'
  );
  const [validUntil, setValidUntil] = useState<string>(route.validUntil || '2026-12-31');
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30 Days (Công nợ 30 ngày)');

  // Modal thêm bậc Kg mới
  const [isAddTierModalOpen, setIsAddTierModalOpen] = useState(false);
  const [newTierLabel, setNewTierLabel] = useState('');
  const [newTierMin, setNewTierMin] = useState(150);
  const [newTierMax, setNewTierMax] = useState(250);

  // Chuyển đổi tiền tệ
  const handleToggleCurrency = (newCurr: 'VND' | 'USD') => {
    if (newCurr === currency) return;
    const rate = 25000;
    const convert = (val: number) => (newCurr === 'VND' ? Math.round(val * rate) : Math.round((val / rate) * 100) / 100);

    setMinChargeKg(prev => convert(prev));

    setBasePricesKg(prev => {
      const next: Record<string, number> = {};
      Object.keys(prev).forEach(k => { next[k] = convert(prev[k]); });
      return next;
    });

    setVariablePricesKg(prev => {
      const next: Record<string, Record<string, number>> = {};
      Object.keys(prev).forEach(sKey => {
        next[sKey] = {};
        Object.keys(prev[sKey]).forEach(tKey => {
          next[sKey][tKey] = convert(prev[sKey][tKey]);
        });
      });
      return next;
    });

    setFixedPrices(prev => {
      const next: Record<string, number> = {};
      Object.keys(prev).forEach(k => { next[k] = convert(prev[k]); });
      return next;
    });

    setVasItems(prev =>
      prev.map(v => ({
        ...v,
        price: v.price === 0 ? 0 : convert(v.price),
      }))
    );

    setCurrency(newCurr);
  };

  // Tính tổng cước ALL-IN cho từng bậc Kg
  const getAllInPriceKg = (tierId: string): number => {
    const base = basePricesKg[tierId] || 0;
    let sumSurcharges = 0;
    activeSurcharges.forEach(s => {
      sumSurcharges += (variablePricesKg[s.id]?.[tierId] || 0);
    });
    return Math.round((base + sumSurcharges) * 100) / 100;
  };

  // Xóa / Thêm Bậc Kg
  const handleDeleteTier = (tierId: string) => {
    if (weightTiers.length <= 2) {
      alert('Phải giữ lại tối thiểu 2 bậc trọng lượng để định giá bưu kiện!');
      return;
    }
    setWeightTiers(prev => prev.filter(t => t.id !== tierId));
  };

  const handleCreateNewTier = () => {
    if (!newTierLabel.trim()) return;
    const newId = `exp_w_${Date.now()}`;
    const newCol: AirExpressTierColumn = {
      id: newId,
      rangeLabel: newTierLabel,
      minVal: Number(newTierMin),
      maxVal: Number(newTierMax),
    };

    setWeightTiers(prev => [...prev, newCol]);

    // Gán giá mặc định
    const lastPrice = basePricesKg[weightTiers[weightTiers.length - 1]?.id] || (currency === 'USD' ? 4.5 : 110000);
    setBasePricesKg(prev => ({ ...prev, [newId]: lastPrice }));

    setVariablePricesKg(prev => {
      const next = { ...prev };
      activeSurcharges.forEach(s => {
        if (!next[s.id]) next[s.id] = {};
        next[s.id][newId] = currency === 'USD' ? (s.defaultKg || 0.5) : ((s.defaultKg || 0.5) * 25000);
      });
      return next;
    });

    setIsAddTierModalOpen(false);
    setNewTierLabel('');
  };

  // Thêm / Xóa phụ phí biến đổi
  const handleAddVariableSurcharge = (item: AirExpressSurchargeItem) => {
    if (activeSurcharges.some(s => s.id === item.id)) return;
    setActiveSurcharges(prev => [...prev, item]);
    const defaultVal = currency === 'USD' ? (item.defaultKg || 0.5) : ((item.defaultKg || 0.5) * 25000);
    setVariablePricesKg(prev => {
      const tierMap: Record<string, number> = {};
      weightTiers.forEach(t => { tierMap[t.id] = defaultVal; });
      return { ...prev, [item.id]: tierMap };
    });
  };

  const handleDeleteVariableSurcharge = (id: string) => {
    setActiveSurcharges(prev => prev.filter(s => s.id !== id));
  };

  // Thêm / Xóa phụ phí cố định
  const handleAddFixedSurcharge = (item: AirExpressSurchargeItem) => {
    if (fixedSurcharges.some(s => s.id === item.id)) return;
    setFixedSurcharges(prev => [...prev, item]);
    const defaultPrice = currency === 'USD'
      ? (item.defaultFixedPrice || 10)
      : ((item.defaultFixedPrice || 10) * 25000);
    setFixedPrices(prev => ({ ...prev, [item.id]: defaultPrice }));
  };

  const handleDeleteFixedSurcharge = (id: string) => {
    setFixedSurcharges(prev => prev.filter(s => s.id !== id));
  };

  // VAS handlers
  const handleAddVasFromLOV = (vasId: string) => {
    const found = EXPRESS_VAS_LOV.find(v => v.id === vasId);
    if (!found || vasItems.some(item => item.id === vasId)) return;
    const priceVal = currency === 'USD' ? found.price : found.price * 25000;
    setVasItems(prev => [...prev, { ...found, price: priceVal }]);
  };

  const handleDeleteVasItem = (id: string) => {
    setVasItems(prev => prev.filter(v => v.id !== id));
  };

  const handleUpdateVasPrice = (id: string, newPrice: number) => {
    setVasItems(prev => prev.map(v => v.id === id ? { ...v, price: newPrice } : v));
  };

  // Cấu hình lịch bay / bưu gửi
  const handleSaveSchedule = () => {
    if (scheduleDays.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ngày lấy hàng / bay trong tuần!');
      return;
    }
    const daysStr = scheduleDays.length === 7 ? 'Hàng ngày' : scheduleDays.join(', ');
    const formatted = `${daysStr} (Cắt bưu gửi ${scheduleCutoffTime})`;
    setDepartureSchedule(formatted);
    setIsScheduleModalOpen(false);
  };

  // Lưu toàn bộ cấu hình ma trận Express
  const handleSaveAll = () => {
    const payload: AirExpressPricingConfig = {
      currency,
      weightTiers,
      minChargeKg,
      basePricesKg,
      activeSurcharges,
      variablePricesKg,
      fixedPrices,
      vasItems,
      wmRatio,
      departureSchedule,
      airTransitTime,
      transitType,
      deliveryMode,
      packagingStandard: generalPackagingStandard,
      paymentTerms,
      validUntil,
    };

    const repPrice = getAllInPriceKg('exp_w4') || basePricesKg['exp_w4'] || 6.5;

    onSave(route.id, {
      airExpressPricing: payload,
      price: repPrice,
      pricingUnit: 'Kg',
      currency,
      departureSchedule,
      sla: departureSchedule,
      transitType,
      validUntil,
      vehicleType: carrier,
      shippingLine: carrier,
    });

    onClose();
  };

  // Tính số cột dữ liệu trong bảng (Số bậc Kg + 1 cột Min Charge)
  const totalDataCols = weightTiers.length + 1;

  return (
    <div
      {...getReadOnlyMatrixInteractionProps(isReadOnly)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-xs overflow-hidden"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* =========================================================================
            1. HEADER BANNER
        ========================================================================= */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white flex items-center justify-between shrink-0 border-b border-amber-800/40">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  HÀNG THƯỜNG
                </span>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Ma Trận Biểu Phí Chuyển Phát Hỏa Tốc (Air Express Matrix)
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-black bg-amber-400 text-slate-950">
                  {currency} ({currency === 'USD' ? '$' : '₫'})
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Tuyến: <strong className="text-white">{route.route || `${route.origin} ⇄ ${route.destination}`}</strong></span>
                <span>•</span>
                <span>Điểm lấy hàng: <strong className="text-white">{route.origin || 'Kho nội thành / Hub xuất phát'}</strong></span>
                <span>➔</span>
                <span>Quốc gia / Đích: <strong className="text-white">{route.destination || 'Quốc gia đến'}</strong></span>
                <span>•</span>
                <span>Hãng: <strong className="text-amber-300">{carrier}</strong></span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-amber-300 font-bold bg-amber-900/50 px-2 py-0.2 rounded border border-amber-700/50">
                  <Scale className="w-3 h-3" />
                  1 CBM = 200 Kg (Chuẩn Express: D×R×C / 5.000)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              data-readonly-allow="true"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. TOOLBAR THANH TÁC VỤ
        ========================================================================= */}
        <div className="px-6 py-2.5 bg-amber-50/40 border-b border-amber-200/60 flex items-center justify-between gap-4 flex-wrap shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Định giá chuyển phát theo trọng lượng bưu kiện (6 bậc Kg chuyên dụng):
            </span>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-300">
              ⚡ Mốc cước sàn tham chiếu: <strong>+45 Kg Base Rate</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency switcher */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-300 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleToggleCurrency('VND')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'VND' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                VND (₫)
              </button>
              <button
                type="button"
                onClick={() => handleToggleCurrency('USD')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Nút thêm bậc Kg */}
            <button
              type="button"
              onClick={() => setIsAddTierModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Thêm Bậc Kg</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. BẢNG MA TRẬN BIỂU PHÍ CHUYỂN PHÁT NHANH EXPRESS (CUỘN NGANG/DỌC)
        ========================================================================= */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-xs text-left border-collapse min-w-[960px]">
            {/* THEAD CÁC BẬC KG */}
            <thead className="sticky top-0 z-30 bg-slate-100 shadow-2xs border-b border-slate-300 select-none">
              <tr>
                <th
                  rowSpan={2}
                  className="sticky left-0 z-40 bg-slate-100 border-r-2 border-slate-300 p-3 font-extrabold text-slate-800 uppercase tracking-wider text-[11px] w-80 shadow-[2px_0_5px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <span>DÒNG BIỂU PHÍ & DỊCH VỤ EXPRESS</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded font-bold border border-amber-300/60">
                      Chuyên chở Air Express
                    </span>
                  </div>
                </th>

                {/* Tiêu đề nhóm trọng lượng */}
                <th
                  colSpan={weightTiers.length}
                  className="p-2 text-center font-extrabold text-amber-950 bg-amber-100/60 border-r border-amber-300 text-xs uppercase tracking-wide"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span>BIỂU PHÍ THEO TRỌNG LƯỢNG BƯU KIỆN (KG)</span>
                    <span className="text-[10px] text-amber-800 font-bold bg-white px-2 py-0.5 rounded-full border border-amber-300">
                      {currency}/Kg
                    </span>
                  </div>
                </th>

                {/* Cột Min Charge */}
                <th
                  rowSpan={2}
                  className="p-2.5 text-center font-extrabold text-amber-950 bg-amber-50 border-r last:border-r-0 border-amber-200 text-xs w-36 align-middle"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="uppercase tracking-wider">MIN CHARGE</span>
                    <span className="text-[10px] text-slate-500 font-normal">Tối thiểu / Bưu gửi</span>
                  </div>
                </th>
              </tr>

              {/* Hàng bậc cụ thể */}
              <tr className="bg-amber-50/80 border-t border-amber-200 text-slate-800">
                {weightTiers.map((tier, idx) => {
                  const isBaseTier = tier.id === 'exp_w4' || tier.rangeLabel.includes('Base');
                  return (
                    <th
                      key={tier.id}
                      className={`p-2 text-center border-r border-amber-200 text-xs font-bold ${
                        isBaseTier ? 'bg-amber-200/90 text-amber-950 ring-2 ring-inset ring-amber-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 group">
                        <span className="font-mono text-slate-500 font-normal text-[10px]">#{idx + 1}</span>
                        <span className={`font-bold ${isBaseTier ? 'text-amber-950 font-black' : ''}`}>
                          {tier.rangeLabel}
                        </span>
                        {weightTiers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTier(tier.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-0.5 cursor-pointer"
                            title="Xóa bậc này"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-slate-800">
              {/* =========================================================================
                  DÒNG 1: TỔNG CƯỚC DỰ KIẾN (ALL-IN)
              ========================================================================= */}
              <tr className="bg-amber-50/70 font-extrabold text-amber-950 border-b-2 border-amber-300">
                <td className="sticky left-0 z-20 bg-amber-100/90 border-r-2 border-slate-300 px-4 py-3 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wide flex items-center gap-1.5 text-amber-950">
                        <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                        TỔNG CƯỚC DỰ KIẾN (ALL-IN)
                      </span>
                      <p className="text-[10px] text-amber-800 font-normal mt-0.5">
                        Cước chuyển phát cơ bản + Phụ phí biến đổi
                      </p>
                    </div>
                    <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-black">
                      Tự tính
                    </span>
                  </div>
                </td>

                {/* Các bậc Kg */}
                {weightTiers.map((tier) => {
                  const allIn = getAllInPriceKg(tier.id);
                  const isBase = tier.id === 'exp_w4' || tier.rangeLabel.includes('Base');
                  return (
                    <td
                      key={tier.id}
                      className={`p-2 text-center border-r border-slate-200 font-mono text-xs font-black ${
                        isBase ? 'bg-amber-200/60 text-amber-950' : 'text-slate-900'
                      }`}
                    >
                      {currency === 'USD' ? `$${allIn.toFixed(2)}` : `${allIn.toLocaleString('vi-VN')} ₫`}
                    </td>
                  );
                })}

                {/* Min charge All-in */}
                <td className="p-2 text-center font-mono font-black text-amber-950 bg-amber-100/60 border-r last:border-r-0 border-slate-200">
                  {currency === 'USD' ? `$${minChargeKg}` : `${minChargeKg.toLocaleString('vi-VN')} ₫`}
                </td>
              </tr>

              {/* =========================================================================
                  DÒNG 2: CƯỚC BAY CƠ BẢN (Air Express Freight - Base Price)
              ========================================================================= */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">
                        Cước Express Cơ Bản (Base Freight) *
                      </span>
                      <p className="text-[10px] text-slate-400 font-normal">
                        Cước thuần vận chuyển door-to-door theo từng khung trọng lượng
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      Bắt buộc
                    </span>
                  </div>
                </td>

                {weightTiers.map((tier) => {
                  const isBase = tier.id === 'exp_w4' || tier.rangeLabel.includes('Base');
                  return (
                    <td
                      key={tier.id}
                      className={`p-1.5 text-center border-r border-slate-200 ${isBase ? 'bg-amber-50/40' : ''}`}
                    >
                      <input
                        type="number"
                        step={currency === 'USD' ? '0.1' : '1000'}
                        value={basePricesKg[tier.id] ?? 0}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setBasePricesKg(prev => ({ ...prev, [tier.id]: val }));
                        }}
                        className={`w-full text-center px-1.5 py-1 bg-white border rounded-lg text-xs font-bold focus:outline-none transition-all ${
                          isBase
                            ? 'border-amber-400 text-amber-950 ring-1 ring-amber-400'
                            : 'border-slate-300 text-slate-900 focus:border-amber-500'
                        }`}
                      />
                    </td>
                  );
                })}

                {/* Min charge input */}
                <td className="p-1.5 text-center border-r last:border-r-0 border-slate-200 bg-amber-50/20">
                  <input
                    type="number"
                    step={currency === 'USD' ? '1' : '10000'}
                    value={minChargeKg}
                    onChange={(e) => setMinChargeKg(parseFloat(e.target.value) || 0)}
                    className="w-full text-center px-1.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-950 focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </td>
              </tr>

              {/* =========================================================================
                  MỤC 1A: PHỤ PHÍ BIẾN ĐỔI THEO TRỌNG LƯỢNG (KG)
              ========================================================================= */}
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td colSpan={totalDataCols + 1} className="px-4 py-2 text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">1A</span>
                      <span>MỤC 1A: PHỤ PHÍ BIẾN ĐỔI THEO TRỌNG LƯỢNG (KG)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Cộng dồn tự động vào cước theo từng nấc cân nặng
                    </span>
                  </div>
                </td>
              </tr>

              {activeSurcharges.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 text-xs">{s.name}</span>
                        <p className="text-[10px] text-slate-400">Đơn vị: {currency} / Kg</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteVariableSurcharge(s.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Xóa phụ phí này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Nhập giá phụ phí theo từng bậc Kg */}
                  {weightTiers.map((tier) => (
                    <td key={tier.id} className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="number"
                        step={currency === 'USD' ? '0.05' : '500'}
                        value={variablePricesKg[s.id]?.[tier.id] ?? 0}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setVariablePricesKg(prev => ({
                            ...prev,
                            [s.id]: {
                              ...(prev[s.id] || {}),
                              [tier.id]: val,
                            },
                          }));
                        }}
                        className="w-full text-center px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:border-amber-500 focus:outline-none"
                      />
                    </td>
                  ))}

                  <td className="p-1.5 text-center text-slate-400 font-mono text-xs bg-slate-50 border-r last:border-r-0 border-slate-200">
                    -
                  </td>
                </tr>
              ))}

              {/* Thêm phụ phí biến đổi từ LOV */}
              <tr data-readonly-hide="true">
                <td colSpan={totalDataCols + 1} className="p-2 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const found = EXPRESS_VARIABLE_SURCHARGES_LOV.find(item => item.id === val);
                          if (found) handleAddVariableSurcharge(found);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="w-full text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-dashed border-amber-300 rounded-xl py-1.5 px-3 transition-colors cursor-pointer focus:outline-none"
                    >
                      <option value="" disabled>+ Thêm phụ phí biến đổi theo Kg (FSC, ODA, ESS, Pin Lithium...)</option>
                      {EXPRESS_VARIABLE_SURCHARGES_LOV
                        .filter(item => !activeSurcharges.some(s => s.id === item.id))
                        .map(item => (
                          <option key={item.id} value={item.id}>
                            + {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </td>
              </tr>

              {/* =========================================================================
                  MỤC 1B: PHỤ PHÍ CỐ ĐỊNH THEO BƯU GỬI / TỜ KHAI (PER SHIPMENT / WAYBILL)
              ========================================================================= */}
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td colSpan={totalDataCols + 1} className="px-4 py-2 text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">1B</span>
                      <span>MỤC 1B: PHỤ PHÍ CỐ ĐỊNH & THỦ TỤC THEO BƯU GỬI (PER SHIPMENT / WAYBILL)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Tính cố định theo từng lô bưu kiện phát sinh
                    </span>
                  </div>
                </td>
              </tr>

              {fixedSurcharges.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 text-xs">{s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFixedSurcharge(s.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Xóa phụ phí này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Span across all columns */}
                  <td colSpan={totalDataCols} className="p-2 bg-slate-50/30">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step={currency === 'USD' ? '1' : '10000'}
                          value={fixedPrices[s.id] ?? 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setFixedPrices(prev => ({ ...prev, [s.id]: val }));
                          }}
                          className="w-32 text-right px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                        <span className="text-xs text-slate-600 font-semibold">
                          {currency === 'USD' ? '$' : '₫'} / {s.unit.split('/')[1] || 'Lô'}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Thêm phụ phí cố định */}
              <tr data-readonly-hide="true">
                <td colSpan={totalDataCols + 1} className="p-2 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const found = EXPRESS_FIXED_SURCHARGES_LOV.find(item => item.id === val);
                          if (found) handleAddFixedSurcharge(found);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="w-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl py-1.5 px-3 transition-colors cursor-pointer focus:outline-none"
                    >
                      <option value="" disabled>+ Thêm phụ phí cố định (Hải quan Express, e-AWB, đính chính địa chỉ...)</option>
                      {EXPRESS_FIXED_SURCHARGES_LOV
                        .filter(item => !fixedSurcharges.some(s => s.id === item.id))
                        .map(item => (
                          <option key={item.id} value={item.id}>
                            + {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </td>
              </tr>

              {/* =========================================================================
                  MỤC 2: TIỆN ÍCH KÈM THEO & DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS TÙY CHỌN)
                  (ĐẶT TRÊN MỤC CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THEO YÊU CẦU CỦA USER)
              ========================================================================= */}
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td colSpan={totalDataCols + 1} className="px-4 py-2 text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>MỤC 2: TIỆN ÍCH KÈM THEO & DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS TÙY CHỌN)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Chỉ tính khi khách hàng yêu cầu xử lý bưu phẩm đặc biệt
                    </span>
                  </div>
                </td>
              </tr>

              {vasItems.map((vas) => {
                const isFree = vas.price === 0;

                return (
                  <tr key={vas.id} className="hover:bg-slate-50/80 divide-x divide-slate-200">
                    <td className="sticky left-0 z-20 bg-white px-4 py-2 border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-xs">
                          {vas.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteVasItem(vas.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Xóa tiện ích này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Span across all columns */}
                    <td colSpan={totalDataCols} className="p-2 bg-purple-50/20">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            disabled={isFree}
                            step={currency === 'USD' ? '1' : '10000'}
                            value={vas.price}
                            onChange={(e) => handleUpdateVasPrice(vas.id, parseFloat(e.target.value) || 0)}
                            className={`w-36 text-right px-2.5 py-1 bg-white border rounded-lg text-xs font-bold focus:outline-none ${
                              isFree ? 'text-slate-400 border-slate-200 bg-slate-50' : 'text-purple-900 border-purple-300 focus:border-purple-500'
                            }`}
                          />
                          <span className="text-xs text-slate-500 font-bold">
                            {currency === 'USD' ? '$' : '₫'} / {vas.unit.split('/')[1] || 'Lô'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUpdateVasPrice(vas.id, isFree ? 15 : 0)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            isFree 
                              ? 'bg-purple-600 text-white border-purple-600 shadow-2xs' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isFree ? '✓ Đã Bao Gồm (0đ)' : 'Đặt Miễn Phí (0đ)'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* DÒNG THÊM VAS */}
              <tr data-readonly-hide="true" className="border-b border-slate-200">
                <td colSpan={totalDataCols + 1} className="p-2 bg-purple-50/30">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddVasFromLOV(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="w-full text-xs font-bold text-purple-700 bg-purple-50/80 hover:bg-purple-100 border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-xl py-2 px-3 text-left transition-all cursor-pointer focus:outline-none"
                  >
                    <option value="" disabled>
                      + Thêm tiện ích VAS chuyên dụng cho Chuyển Phát Nhanh Express...
                    </option>
                    {EXPRESS_VAS_LOV
                      .filter(v => !vasItems.some(item => item.id === v.id))
                      .map(v => (
                        <option key={v.id} value={v.id}>
                          + {v.name} ({currency === 'USD' ? `$${v.price}` : `${(v.price * 25000).toLocaleString('vi-VN')} ₫`})
                        </option>
                      ))}
                  </select>
                </td>
              </tr>

              {/* =========================================================================
                  MỤC 3: CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN EXPRESS (CẤU TRÚC BẢNG PHẲNG)
              ========================================================================= */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={totalDataCols + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span>3. CAM KẾT VẬN HÀNH, LỊCH TRÌNH & ĐIỀU KHOẢN CHUYỂN PHÁT NHANH</span>
                  </div>
                </td>
              </tr>

              {/* 1. Lịch Lấy Hàng & Giờ Cắt Bưu Gửi (Closing/Cut-off) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>1. Lịch Lấy Hàng & Giờ Cắt Bưu Gửi (Daily Cut-off)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Lịch thu gom bưu kiện trong tuần và giờ chốt nhận bưu gửi tại trạm gom hub
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="max-w-md mx-auto px-4 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:border-amber-500 hover:bg-amber-50/20 hover:text-amber-900 transition-all shadow-2xs flex items-center justify-between gap-2 group cursor-pointer"
                    title="Nhấp để cấu hình chi tiết lịch lấy hàng và giờ cắt bưu gửi"
                  >
                    <span className="truncate flex-1 text-center font-medium">
                      {departureSchedule}
                    </span>
                    <Calendar className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                </td>
              </tr>

              {/* 2. Loại Tuyến (Transit Type): Direct hoặc Transit */}
              <tr className="hover:bg-slate-50/60 transition-colors bg-amber-50/20">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. Loại Tuyến (Transit Type)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Chuyến bay thẳng trực tiếp hay có chuyển tiếp qua các trung tâm chia chọn hub quốc tế
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <select
                      value={transitType}
                      onChange={(e) => setTransitType(e.target.value as 'Direct' | 'Transit')}
                      className={`w-full px-3 py-1.5 text-xs font-bold text-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer ${
                        transitType === 'Direct' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Direct">Direct (Bay thẳng trực tiếp)</option>
                      <option value="Transit">Transit (Quá cảnh / Chuyển tiếp hub quốc tế)</option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 3. Thời Gian Phát Hàng (Transit Time / SLA) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>3. Thời Gian Phát Hàng (Transit Time / SLA)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Thời gian giao phát bưu phẩm từ khi nhận hàng đến địa chỉ đích
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={airTransitTime}
                      onChange={(e) => setAirTransitTime(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
                    >
                      <option value="12 - 24 Giờ (Hỏa tốc đặc biệt Next Flight Out)">12 - 24 Giờ (Hỏa tốc đặc biệt Next Flight Out)</option>
                      <option value="24 - 48 Giờ (Hỏa tốc Express)">24 - 48 Giờ (Hỏa tốc Express / Chuyển phát tiêu chuẩn)</option>
                      <option value="2 - 3 Ngày (Chuyển tiếp khu vực)">2 - 3 Ngày (Chuyển tiếp khu vực)</option>
                      <option value="3 - 5 Ngày (Tiết kiệm Economy Express)">3 - 5 Ngày (Tiết kiệm Economy Express / Tuyến xa)</option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 4. Hình Thức Giao Nhận (Service / Delivery Mode) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>4. Hình Thức Giao Nhận (Service / Delivery Mode)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Phương thức lấy hàng và phát trả bưu gửi cho người nhận
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={deliveryMode}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Door-to-Door (Lấy tận nơi - Giao tận tay)">Door-to-Door (Lấy tận nơi - Giao tận tay)</option>
                      <option value="Airport-to-Door (Sân bay đến địa chỉ người nhận)">Airport-to-Door (Sân bay đến địa chỉ người nhận)</option>
                      <option value="Door-to-Airport (Từ nơi gửi đến sân bay đích)">Door-to-Airport (Từ nơi gửi đến sân bay đích)</option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 5. Quy Tắc Trọng Lượng Thể Tích Express (Express W/V Ratio) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    <span>5. Quy Tắc Trọng Lượng Thể Tích Express (Courier W/V Ratio)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Tỷ lệ quy đổi chuẩn mạng lưới chuyển phát nhanh quốc tế giữa CBM và Kg
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={wmRatio}
                      onChange={(e) => setWmRatio(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="1 CBM = 200 Kg (Chuẩn Express Courier: D×R×C / 5.000)">
                        1 CBM = 200 Kg (Chuẩn Express Courier: D×R×C / 5.000)
                      </option>
                      <option value="1 CBM = 167 Kg (Chuẩn Hàng Không IATA: D×R×C / 6.000)">
                        1 CBM = 167 Kg (Chuẩn Hàng Không IATA: D×R×C / 6.000)
                      </option>
                      <option value="1 CBM = 250 Kg (Hàng mật độ cao / Heavy Parcel)">
                        1 CBM = 250 Kg (Hàng mật độ cao / Heavy Parcel)
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 6. Quy Cách Đóng Gói Tiêu Chuẩn Express (Packaging Standard) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    <span>6. Quy Cách Đóng Gói Tiêu Chuẩn Express (Packaging Standard)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Tiêu chuẩn phong bì, thùng carton và dán mã vạch kiểm soát bưu kiện
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={generalPackagingStandard}
                      onChange={(e) => setGeneralPackagingStandard(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Thùng carton đóng gói bưu kiện chuyển phát tiêu chuẩn IATA (Quấn màng co PE & niêm phong)">
                        Thùng carton đóng gói bưu kiện chuyển phát tiêu chuẩn (Quấn PE & dán tem niêm phong)
                      </option>
                      <option value="Túi phong bì bưu chính chống thấm (Express Flyer Bag / Envelope)">
                        Túi phong bì bưu chính chống thấm (Express Flyer Bag / Envelope)
                      </option>
                      <option value="Đóng gói gia cố thùng gỗ chèn mút bóng khí (Crated Goods)">
                        Đóng gói gia cố thùng gỗ chèn mút bóng khí (Crated Goods)
                      </option>
                      <option value="Thùng carton 5 lớp gia cố nẹp góc chống sốc chuyên dụng">
                        Thùng carton 5 lớp gia cố nẹp góc chống sốc chuyên dụng
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 7. Thời Hạn Hiệu Lực Giá (Valid Until) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>7. Thời Hạn Hiệu Lực Giá (Valid Until)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Mốc ngày kết thúc áp dụng biểu cước chuyển phát nhanh này
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs text-center font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
                    />
                  </div>
                </td>
              </tr>

              {/* 8. Điều Khoản Thanh Toán & Công Nợ (Payment Terms) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>8. Điều Khoản Thanh Toán & Công Nợ (Payment Terms)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Thời hạn công nợ và hình thức thu hộ/thanh toán cước bưu kiện
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="Net 30 Days (Công nợ 30 ngày)">Net 30 Days (Công nợ 30 ngày)</option>
                      <option value="Net 15 Days (Công nợ 15 ngày)">Net 15 Days (Công nợ 15 ngày)</option>
                      <option value="Net 7 Days (Công nợ 7 ngày)">Net 7 Days (Công nợ 7 ngày)</option>
                      <option value="Prepaid (Thanh toán trước khi bay)">Prepaid (Thanh toán trước khi bay)</option>
                      <option value="Freight Collect / COD (Thu hộ tại đầu nhận)">Freight Collect / COD (Thu hộ tại đầu nhận)</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            4. MODAL FOOTER
        ========================================================================= */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Đơn giá cơ sở: <strong>
                {currency === 'USD'
                  ? `$${getAllInPriceKg('exp_w4')}`
                  : `${getAllInPriceKg('exp_w4').toLocaleString('vi-VN')} ₫`} / Kg (+45kg Base)
              </strong>
            </span>
            <span>•</span>
            <span>Tỷ lệ quy đổi: <strong>1 CBM = 200 Kg (1:5.000)</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              data-readonly-allow="true"
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              {isReadOnly ? 'Đóng' : 'Hủy'}
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              data-readonly-hide="true"
              className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer font-black"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Lưu Cấu Hình Biểu Phí Express</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            5. MODAL POPUP: CẤU HÌNH LỊCH BAY & GIỜ CẮT BƯU GỬI
        ========================================================================= */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
            <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 w-full max-w-md space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Cấu Hình Lịch Lấy Hàng & Giờ Cắt Bưu Gửi
                </span>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  Ngày gom hàng / xuất chuyến trong tuần:
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => {
                    const isSelected = scheduleDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setScheduleDays(prev => prev.filter(d => d !== day));
                          } else {
                            setScheduleDays(prev => [...prev, day]);
                          }
                        }}
                        className={`py-2 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Giờ chốt nhận bưu gửi hàng ngày (Daily Cut-off Time):
                </label>
                <input
                  type="time"
                  value={scheduleCutoffTime}
                  onChange={(e) => setScheduleCutoffTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-600"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            6. MODAL POPUP: THÊM BẬC KG MỚI
        ========================================================================= */}
        {isAddTierModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
            <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 w-full max-w-md space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600" />
                  Thêm Bậc Trọng Lượng Express Mới
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddTierModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tên hiển thị bậc cân nặng *:
                  </label>
                  <input
                    type="text"
                    value={newTierLabel}
                    onChange={(e) => setNewTierLabel(e.target.value)}
                    placeholder="VD: +150 Kg, +250 Kg (Lô siêu nặng)..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Từ (Kg):</label>
                    <input
                      type="number"
                      value={newTierMin}
                      onChange={(e) => setNewTierMin(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Đến (Kg):</label>
                    <input
                      type="number"
                      value={newTierMax}
                      onChange={(e) => setNewTierMax(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddTierModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewTier}
                  className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-600"
                >
                  Tạo Bậc Mới
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
