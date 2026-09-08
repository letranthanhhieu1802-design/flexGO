import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  Plane, 
  Layers, 
  Box, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Clock, 
  Save, 
  CheckCircle2, 
  Scale,
  ThermometerSnowflake,
  AlertTriangle,
  RefreshCw,
  Info,
  ShieldCheck,
  Package,
  PlaneTakeoff
} from 'lucide-react';
import {
  SCHEDULE_DAYS_OF_WEEK,
} from './TruckingFtlCostMatrixModal';

export const AIR_CUTOFF_TIMES = [
  { time: '18:00', label: '18:00 (Cắt hàng ga TCS / SCSC Tân Sơn Nhất)' },
  { time: '20:00', label: '20:00 (Cắt hàng ga NCTS / ALSC Nội Bài)' },
  { time: '16:00', label: '16:00 (Cắt hàng ga SCSC ca chiều)' },
  { time: '12:00', label: '12:00 (Cắt hàng ga ca trưa)' },
  { time: 'Trước ETD 4h', label: 'Trước ETD 4h (Chuyến bay thường)' },
  { time: 'Trước ETD 6h', label: 'Trước ETD 6h (Hàng nguy hiểm / Hàng lạnh)' },
];

export interface AirTierColumn {
  id: string;
  rangeLabel: string;
  minVal: number;
  maxVal: number;
}

export interface AirCargoSurchargeItem {
  id: string;
  name: string;
  unit: string;
  type: 'variable' | 'fixed';
  defaultCbm?: number;
  defaultKg?: number;
  defaultFixedPrice?: number;
}

export interface AirCargoVasItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export interface AirCargoPricingConfig {
  currency: 'VND' | 'USD';
  volumeTiers: AirTierColumn[];
  weightTiers: AirTierColumn[];
  minChargeCbm: number;
  minChargeKg: number;
  basePricesCbm: Record<string, number>;
  basePricesKg: Record<string, number>;
  activeSurcharges: AirCargoSurchargeItem[];
  variablePricesCbm: Record<string, Record<string, number>>;
  variablePricesKg: Record<string, Record<string, number>>;
  fixedPrices: Record<string, number>;
  vasItems: AirCargoVasItem[];
  wmRatio: string;
  departureSchedule: string;
  airTransitTime: string;
  transitType: 'Direct' | 'Transit';
  aircraftType: string;
  flightType: string;
  temperatureRange?: string;
  tempPackagingType?: string;
  iataDgClass?: string;
  dgAircraftRule?: string;
  packagingStandard?: string;
  paymentTerms: string;
  validUntil: string;
}

interface AirCargoCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: any;
  onSave: (routeId: string, updatedData: any) => void;
  cargoType?: 'general' | 'perishable' | 'dangerous' | string;
}

// =========================================================================
// DANH MỤC PHỤ PHÍ CHUẨN LOV CHO HÀNG KHÔNG (AIR CARGO)
// =========================================================================
export const AIR_GENERAL_SURCHARGES_LOV: AirCargoSurchargeItem[] = [
  // Biến đổi
  { id: 'fsc_fuel', name: 'Phụ phí nhiên liệu hàng không (FSC - Fuel Surcharge)', unit: 'USD / Kg', type: 'variable', defaultCbm: 150, defaultKg: 0.9 },
  { id: 'ssc_security', name: 'Phụ phí an ninh soi chiếu (SSC / ISS Security Surcharge)', unit: 'USD / Kg', type: 'variable', defaultCbm: 25, defaultKg: 0.15 },
  { id: 'thc_airport', name: 'Phí phục vụ hàng hóa nhà ga sân bay (Airport THC POL)', unit: 'USD / Kg', type: 'variable', defaultCbm: 15, defaultKg: 0.09 },
  { id: 'xray_fee', name: 'Phí soi chiếu an ninh X-Ray hàng không (Screening Fee)', unit: 'USD / Kg', type: 'variable', defaultCbm: 10, defaultKg: 0.06 },
  { id: 'airport_storage', name: 'Phí lưu kho quá hạn ga hàng không (Airport Storage Surcharge)', unit: 'USD / Kg / Ngày', type: 'variable', defaultCbm: 8, defaultKg: 0.05 },

  // Cố định
  { id: 'awb_fee', name: 'Phí phát hành vận đơn hàng không (AWB / HAWB Fee)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 15 },
  { id: 'edi_ams', name: 'Khai báo manifest điện tử hải quan sân bay (EDI / AMS / AFR)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 12 },
  { id: 'do_air_fee', name: 'Phí lệnh giao hàng sân bay (Airport D/O Fee)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 20 },
  { id: 'handling_air', name: 'Phí xử lý & chia tách vận đơn (Breakbulk / Handling Fee)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 15 },
  { id: 'cca_fee', name: 'Phí chỉnh sửa vận đơn hàng không (CCA Fee - Correction Advice)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 25 },
  { id: 'customs_air', name: 'Phí thủ tục hải quan xuất nhập khẩu tại ga hàng không', unit: 'USD / Tờ khai', type: 'fixed', defaultFixedPrice: 40 },
];

export const AIR_PERISHABLE_SURCHARGES_LOV: AirCargoSurchargeItem[] = [
  // Biến đổi
  { id: 'fsc_fuel', name: 'Phụ phí nhiên liệu hàng không (FSC - Fuel Surcharge)', unit: 'USD / Kg', type: 'variable', defaultCbm: 150, defaultKg: 0.9 },
  { id: 'ssc_security', name: 'Phụ phí an ninh soi chiếu (SSC / ISS Security Surcharge)', unit: 'USD / Kg', type: 'variable', defaultCbm: 25, defaultKg: 0.15 },
  { id: 'cool_storage', name: 'Phí bảo quản phòng lạnh ga sân bay (Cool Storage Fee / Kg / Ngày)', unit: 'USD / Kg', type: 'variable', defaultCbm: 35, defaultKg: 0.2 },
  { id: 'thc_cold', name: 'Phí bốc xếp ga hàng lạnh chuyên dụng (Cold Terminal Handling)', unit: 'USD / Kg', type: 'variable', defaultCbm: 20, defaultKg: 0.12 },
  { id: 'rkn_plugging', name: 'Phí cắm sạc & giám sát container nhiệt RKN/RAP tại sân bay', unit: 'USD / Kg', type: 'variable', defaultCbm: 25, defaultKg: 0.15 },

  // Cố định
  { id: 'awb_fee', name: 'Phí phát hành vận đơn hàng không (AWB / HAWB Fee)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 15 },
  { id: 'edi_ams', name: 'Khai báo manifest điện tử hải quan sân bay (EDI / AMS / AFR)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 12 },
  { id: 'dry_ice_replenish', name: 'Phí châm đá khô / nạp gel lạnh tại điểm transit', unit: 'USD / Lô', type: 'fixed', defaultFixedPrice: 80 },
  { id: 'logger_check', name: 'Phí hiệu chuẩn & đọc dữ liệu cảm biến nhiệt (Data Logger Reading)', unit: 'USD / Lô', type: 'fixed', defaultFixedPrice: 30 },
  { id: 'rkn_lease', name: 'Phí thuê thùng giữ nhiệt công nghệ cao Envirotainer / RKN', unit: 'USD / Chiếc', type: 'fixed', defaultFixedPrice: 350 },
  { id: 'disinfection_fee', name: 'Phí kiểm dịch & khử trùng khoang lạnh tàu bay (Disinfection)', unit: 'USD / Lô', type: 'fixed', defaultFixedPrice: 45 },
];

export const AIR_DANGEROUS_SURCHARGES_LOV: AirCargoSurchargeItem[] = [
  // Biến đổi
  { id: 'fsc_fuel', name: 'Phụ phí nhiên liệu hàng không (FSC - Fuel Surcharge)', unit: 'USD / Kg', type: 'variable', defaultCbm: 150, defaultKg: 0.9 },
  { id: 'ssc_security', name: 'Phụ phí an ninh soi chiếu (SSC / ISS Security Surcharge)', unit: 'USD / Kg', type: 'variable', defaultCbm: 25, defaultKg: 0.15 },
  { id: 'dg_handling_surcharge', name: 'Phụ phí bốc xếp & giám sát an toàn hàng nguy hiểm (DG Handling)', unit: 'USD / Kg', type: 'variable', defaultCbm: 40, defaultKg: 0.25 },
  { id: 'dg_quarantine_storage', name: 'Phí lưu kho khu cách ly nguy hiểm sân bay (DG Isolation Storage)', unit: 'USD / Kg / Ngày', type: 'variable', defaultCbm: 30, defaultKg: 0.18 },

  // Cố định
  { id: 'dg_acceptance_fee', name: 'Phí kiểm tra chấp thuận hàng nguy hiểm (DG Acceptance Check Fee)', unit: 'USD / AWB', type: 'fixed', defaultFixedPrice: 75 },
  { id: 'dgd_declaration_fee', name: 'Phí phát hành tờ khai người gửi hàng nguy hiểm (Shipper Declaration DGD)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 50 },
  { id: 'un_packaging_check', name: 'Phí giám định tiêu chuẩn bao bì đóng gói UN (UN Packaging Fee)', unit: 'USD / Lô', type: 'fixed', defaultFixedPrice: 45 },
  { id: 'dg_permit_fee', name: 'Phí cấp phép an toàn bay DGR Cảng vụ hàng không', unit: 'USD / Lô', type: 'fixed', defaultFixedPrice: 60 },
  { id: 'awb_fee', name: 'Phí phát hành vận đơn hàng không (AWB Fee)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 15 },
  { id: 'edi_ams', name: 'Khai báo manifest điện tử hải quan sân bay (EDI / AMS / AFR)', unit: 'USD / Set', type: 'fixed', defaultFixedPrice: 12 },
];

// =========================================================================
// DANH MỤC TIỆN ÍCH VAS CHO HÀNG KHÔNG
// =========================================================================
export const AIR_GENERAL_VAS_LOV: AirCargoVasItem[] = [
  { id: 'vas_pe_wrap', name: 'Quấn màng co PE & nẹp góc bảo vệ kiện hàng tại ga sân bay', unit: 'USD / Kiện', price: 2 },
  { id: 'vas_wooden_crate', name: 'Đóng pallet gỗ hun trùng chuyên dụng hàng không (ISPM 15)', unit: 'USD / Kiện', price: 15 },
  { id: 'vas_xray_priority', name: 'Ưu tiên qua cổng soi chiếu an ninh X-Ray TCS / SCSC', unit: 'USD / Lô', price: 0 },
  { id: 'vas_e_awb', name: 'Phát hành mã vận đơn điện tử e-AWB trực tuyến', unit: 'USD / Set', price: 0 },
  { id: 'vas_relabel', name: 'In dán nhãn tem an ninh & Barcode IATA', unit: 'USD / Kiện', price: 1 },
  { id: 'vas_air_insurance', name: 'Bảo hiểm hàng không quốc tế All-Risks 100%', unit: 'USD / Lô', price: 25 },
];

export const AIR_PERISHABLE_VAS_LOV: AirCargoVasItem[] = [
  { id: 'vas_foam_box', name: 'Đóng thùng xốp cách nhiệt & nạp gel lạnh giữ nhiệt', unit: 'USD / Thùng', price: 6 },
  { id: 'vas_thermal_blanket', name: 'Bọc màng giữ nhiệt chuyên dụng (Thermal Blanket)', unit: 'USD / Pallet', price: 25 },
  { id: 'vas_logger_realtime', name: 'Gắn thiết bị giám sát nhiệt độ GPS/Sensor thời gian thực', unit: 'USD / Thiết bị', price: 20 },
  { id: 'vas_cool_room_free', name: 'Miễn phí lưu kho lạnh sân bay 24 giờ đầu', unit: 'USD / Lô', price: 0 },
  { id: 'vas_cold_insurance', name: 'Bảo hiểm đứt gãy chuỗi lạnh GDP / Perishable All-Risks', unit: 'USD / Lô', price: 35 },
];

export const AIR_DANGEROUS_VAS_LOV: AirCargoVasItem[] = [
  { id: 'vas_un_packaging', name: 'Đóng gói bao bì chuyên dụng chuẩn chứng nhận UN (UN Certified)', unit: 'USD / Kiện', price: 20 },
  { id: 'vas_dgr_labels', name: 'Dán bộ nhãn cảnh báo nguy hiểm IATA Hazard Class (Class 1-9)', unit: 'USD / Kiện', price: 3 },
  { id: 'vas_dg_checklist', name: 'Kiểm tra checklist hồ sơ DGR trước khi hạ hàng ra sân bay', unit: 'USD / Lô', price: 0 },
  { id: 'vas_dg_escort', name: 'Nhân sự áp tải & bàn giao an ninh nguy hiểm tại khu vực bay', unit: 'USD / Lô', price: 40 },
  { id: 'vas_dg_insurance', name: 'Bảo hiểm rủi ro hàng nguy hiểm hàng không chuyên biệt', unit: 'USD / Lô', price: 50 },
];

export const AirCargoCostMatrixModal: React.FC<AirCargoCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  cargoType = 'general',
}) => {
  if (!isOpen || !route) return null;

  // Xác định phân nhóm hàng thực tế
  const resolvedCargoType = (() => {
    const rType = String(cargoType || '').toLowerCase();
    const routeText = `${route.route || ''} ${route.routeCode || ''} ${route.vehicleType || ''}`.toLowerCase();
    if (rType.includes('ref') || rType.includes('lạnh') || routeText.includes('lạnh') || routeText.includes('ref') || routeText.includes('perish')) {
      return 'perishable';
    }
    if (rType.includes('haz') || rType.includes('nguy hiểm') || routeText.includes('nguy hiểm') || routeText.includes('haz') || routeText.includes('dg')) {
      return 'dangerous';
    }
    return 'general';
  })();

  // TIỀN TỆ
  const [currency, setCurrency] = useState<'VND' | 'USD'>(route.currency === 'VND' ? 'VND' : 'USD');

  // KHỐI 1: BẬC THỂ TÍCH (CBM)
  const [volumeTiers, setVolumeTiers] = useState<AirTierColumn[]>([
    { id: 'v1', rangeLabel: '< 1.0 CBM', minVal: 0.1, maxVal: 1.0 },
    { id: 'v2', rangeLabel: '1.0 – 3.0 CBM', minVal: 1.0, maxVal: 3.0 },
    { id: 'v3', rangeLabel: '3.1 – 5.0 CBM', minVal: 3.1, maxVal: 5.0 },
    { id: 'v4', rangeLabel: '5.1 – 10.0 CBM', minVal: 5.1, maxVal: 10.0 },
    { id: 'v5', rangeLabel: '> 10.0 CBM', minVal: 10.1, maxVal: 999999 },
  ]);

  // KHỐI 2: BẬC TRỌNG LƯỢNG (KG - CHUẨN IATA AIR FREIGHT)
  const [weightTiers, setWeightTiers] = useState<AirTierColumn[]>([
    { id: 'w_min', rangeLabel: 'Min Charge', minVal: 1, maxVal: 20 },
    { id: 'w_under45', rangeLabel: '-45 Kg', minVal: 21, maxVal: 44 },
    { id: 'w_plus45', rangeLabel: '+45 Kg', minVal: 45, maxVal: 99 },
    { id: 'w_plus100', rangeLabel: '+100 Kg (Base)', minVal: 100, maxVal: 299 },
    { id: 'w_plus300', rangeLabel: '+300 Kg', minVal: 300, maxVal: 499 },
    { id: 'w_plus500', rangeLabel: '+500 Kg', minVal: 500, maxVal: 999 },
    { id: 'w_plus1000', rangeLabel: '+1.000 Kg', minVal: 1000, maxVal: 999999 },
  ]);

  // MIN CHARGES (MOQ)
  const [minChargeCbm, setMinChargeCbm] = useState<number>(currency === 'USD' ? 60 : 1500000);
  const [minChargeKg, setMinChargeKg] = useState<number>(currency === 'USD' ? 60 : 1500000);

  // BASE AIR FREIGHT PRICES (CƯỚC BAY CƠ BẢN A/F)
  const [basePricesCbm, setBasePricesCbm] = useState<Record<string, number>>(() => {
    const isUsd = currency === 'USD';
    if (resolvedCargoType === 'dangerous') {
      return isUsd
        ? { v1: 950, v2: 850, v3: 750, v4: 680, v5: 620 }
        : { v1: 23500000, v2: 21000000, v3: 18500000, v4: 16800000, v5: 15300000 };
    }
    if (resolvedCargoType === 'perishable') {
      return isUsd
        ? { v1: 850, v2: 760, v3: 680, v4: 610, v5: 550 }
        : { v1: 21000000, v2: 18800000, v3: 16800000, v4: 15100000, v5: 13600000 };
    }
    return isUsd
      ? { v1: 650, v2: 580, v3: 520, v4: 460, v5: 410 }
      : { v1: 16000000, v2: 14300000, v3: 12800000, v4: 11400000, v5: 10100000 };
  });

  const [basePricesKg, setBasePricesKg] = useState<Record<string, number>>(() => {
    const isUsd = currency === 'USD';
    if (resolvedCargoType === 'dangerous') {
      return isUsd
        ? { w_min: 75, w_under45: 7.2, w_plus45: 6.2, w_plus100: 5.2, w_plus300: 4.5, w_plus500: 4.0, w_plus1000: 3.6 }
        : { w_min: 1850000, w_under45: 180000, w_plus45: 155000, w_plus100: 130000, w_plus300: 112000, w_plus500: 100000, w_plus1000: 90000 };
    }
    if (resolvedCargoType === 'perishable') {
      return isUsd
        ? { w_min: 65, w_under45: 6.5, w_plus45: 5.6, w_plus100: 4.8, w_plus300: 4.1, w_plus500: 3.7, w_plus1000: 3.3 }
        : { w_min: 1600000, w_under45: 162000, w_plus45: 140000, w_plus100: 120000, w_plus300: 102000, w_plus500: 92000, w_plus1000: 82000 };
    }
    return isUsd
      ? { w_min: 50, w_under45: 5.5, w_plus45: 4.8, w_plus100: 4.2, w_plus300: 3.5, w_plus500: 3.1, w_plus1000: 2.8 }
      : { w_min: 1250000, w_under45: 137000, w_plus45: 120000, w_plus100: 105000, w_plus300: 87000, w_plus500: 77000, w_plus1000: 70000 };
  });

  // MỤC 1: SURCHARGES (ACTIVE LIST)
  const [activeSurcharges, setActiveSurcharges] = useState<AirCargoSurchargeItem[]>(() => {
    if (resolvedCargoType === 'dangerous') {
      return [
        AIR_DANGEROUS_SURCHARGES_LOV[0], // Fuel FSC
        AIR_DANGEROUS_SURCHARGES_LOV[1], // Security SSC
        AIR_DANGEROUS_SURCHARGES_LOV[2], // DG Handling
        AIR_DANGEROUS_SURCHARGES_LOV[4], // DG Acceptance Fee (fixed)
        AIR_DANGEROUS_SURCHARGES_LOV[5], // DGD Declaration Fee (fixed)
        AIR_DANGEROUS_SURCHARGES_LOV[8], // AWB Fee (fixed)
      ];
    }
    if (resolvedCargoType === 'perishable') {
      return [
        AIR_PERISHABLE_SURCHARGES_LOV[0], // Fuel FSC
        AIR_PERISHABLE_SURCHARGES_LOV[1], // Security SSC
        AIR_PERISHABLE_SURCHARGES_LOV[2], // Cool Storage Fee
        AIR_PERISHABLE_SURCHARGES_LOV[5], // AWB Fee (fixed)
        AIR_PERISHABLE_SURCHARGES_LOV[7], // Dry Ice Replenish (fixed)
        AIR_PERISHABLE_SURCHARGES_LOV[8], // Logger Check (fixed)
      ];
    }
    return [
      AIR_GENERAL_SURCHARGES_LOV[0], // Fuel FSC
      AIR_GENERAL_SURCHARGES_LOV[1], // Security SSC
      AIR_GENERAL_SURCHARGES_LOV[2], // Airport THC
      AIR_GENERAL_SURCHARGES_LOV[5], // AWB Fee (fixed)
      AIR_GENERAL_SURCHARGES_LOV[6], // EDI / AMS (fixed)
      AIR_GENERAL_SURCHARGES_LOV[7], // D/O Fee (fixed)
    ];
  });

  // PHỤ PHÍ BIẾN ĐỔI THEO CBM VÀ KG
  const [variablePricesCbm, setVariablePricesCbm] = useState<Record<string, Record<string, number>>>(() => {
    const isUsd = currency === 'USD';
    const mult = isUsd ? 1 : 25000;
    return {
      fsc_fuel: { v1: 150 * mult, v2: 150 * mult, v3: 140 * mult, v4: 130 * mult, v5: 120 * mult },
      ssc_security: { v1: 25 * mult, v2: 25 * mult, v3: 23 * mult, v4: 21 * mult, v5: 20 * mult },
      thc_airport: { v1: 15 * mult, v2: 15 * mult, v3: 14 * mult, v4: 13 * mult, v5: 12 * mult },
      cool_storage: { v1: 35 * mult, v2: 35 * mult, v3: 32 * mult, v4: 30 * mult, v5: 28 * mult },
      dg_handling_surcharge: { v1: 40 * mult, v2: 40 * mult, v3: 38 * mult, v4: 35 * mult, v5: 32 * mult },
    };
  });

  const [variablePricesKg, setVariablePricesKg] = useState<Record<string, Record<string, number>>>(() => {
    const isUsd = currency === 'USD';
    const mult = isUsd ? 1 : 25000;
    return {
      fsc_fuel: { w_min: 15 * mult, w_under45: 1.0 * mult, w_plus45: 0.95 * mult, w_plus100: 0.9 * mult, w_plus300: 0.85 * mult, w_plus500: 0.8 * mult, w_plus1000: 0.75 * mult },
      ssc_security: { w_min: 5 * mult, w_under45: 0.18 * mult, w_plus45: 0.16 * mult, w_plus100: 0.15 * mult, w_plus300: 0.14 * mult, w_plus500: 0.13 * mult, w_plus1000: 0.12 * mult },
      thc_airport: { w_min: 5 * mult, w_under45: 0.1 * mult, w_plus45: 0.09 * mult, w_plus100: 0.09 * mult, w_plus300: 0.08 * mult, w_plus500: 0.08 * mult, w_plus1000: 0.07 * mult },
      cool_storage: { w_min: 10 * mult, w_under45: 0.25 * mult, w_plus45: 0.22 * mult, w_plus100: 0.2 * mult, w_plus300: 0.18 * mult, w_plus500: 0.17 * mult, w_plus1000: 0.15 * mult },
      dg_handling_surcharge: { w_min: 15 * mult, w_under45: 0.3 * mult, w_plus45: 0.28 * mult, w_plus100: 0.25 * mult, w_plus300: 0.22 * mult, w_plus500: 0.2 * mult, w_plus1000: 0.18 * mult },
    };
  });

  // PHỤ PHÍ CỐ ĐỊNH THEO AWB / LÔ
  const [fixedPrices, setFixedPrices] = useState<Record<string, number>>(() => {
    const isUsd = currency === 'USD';
    const mult = isUsd ? 1 : 25000;
    return {
      awb_fee: 15 * mult,
      edi_ams: 12 * mult,
      do_air_fee: 20 * mult,
      handling_air: 15 * mult,
      dry_ice_replenish: 80 * mult,
      logger_check: 30 * mult,
      dg_acceptance_fee: 75 * mult,
      dgd_declaration_fee: 50 * mult,
      un_packaging_check: 45 * mult,
      dg_permit_fee: 60 * mult,
    };
  });

  // MỤC 2: VAS (ACTIVE LIST)
  const [vasItems, setVasItems] = useState<AirCargoVasItem[]>(() => {
    const isUsd = currency === 'USD';
    const mult = isUsd ? 1 : 25000;
    if (resolvedCargoType === 'dangerous') {
      return AIR_DANGEROUS_VAS_LOV.map(v => ({ ...v, price: isUsd ? v.price : v.price * mult }));
    }
    if (resolvedCargoType === 'perishable') {
      return AIR_PERISHABLE_VAS_LOV.map(v => ({ ...v, price: isUsd ? v.price : v.price * mult }));
    }
    return AIR_GENERAL_VAS_LOV.map(v => ({ ...v, price: isUsd ? v.price : v.price * mult }));
  });

  // MỤC 3: ĐIỀU KHOẢN VẬN HÀNH & KỸ THUẬT
  const [departureSchedule, setDepartureSchedule] = useState<string>(route.sla || route.departureSchedule || 'Hàng ngày (Cắt TCS 18:00)');
  const [transitType, setTransitType] = useState<'Direct' | 'Transit'>((route.transitType === 'Transit') ? 'Transit' : 'Direct');
  const [airTransitTime, setAirTransitTime] = useState<string>(route.sla?.includes('giờ') || route.sla?.includes('ngày') ? route.sla : '12 - 24 Giờ');
  const [aircraftType, setAircraftType] = useState<string>(route.aircraftType || 'Passenger Aircraft (Pax Cargo)');
  const [flightType, setFlightType] = useState<string>(route.flightType || 'Scheduled Flight (Chuyến bay thường lệ)');
  const [wmRatio, setWmRatio] = useState<string>('1 CBM = 167 Kg (Chuẩn Air Cargo IATA: D×R×C / 6.000)');
  const [validUntil, setValidUntil] = useState<string>(route.validUntil || '2026-12-31');
  const [paymentTerms, setPaymentTerms] = useState<string>(route.paymentTerms || 'Net 30 Days');

  // Trường chuyên biệt hàng Lạnh & Nguy Hiểm & Hàng Thường
  const [temperatureRange, setTemperatureRange] = useState<string>(route.temperatureRange || '+2°C đến +8°C (Chilled / Dược phẩm)');
  const [tempPackagingType, setTempPackagingType] = useState<string>(route.tempPackagingType || 'Thùng xốp + Gel lạnh chuyên dụng');
  const [iataDgClass, setIataDgClass] = useState<string>(route.iataDgClass || 'Class 9: Hàng nguy hiểm khác (Pin Lithium / Đá khô)');
  const [dgAircraftRule, setDgAircraftRule] = useState<string>(route.dgAircraftRule || 'Passenger & Cargo Aircraft (PAX/CAO)');
  const [generalPackagingStandard, setGeneralPackagingStandard] = useState<string>(
    route.packagingStandard || 'Thùng carton đóng Pallet tiêu chuẩn IATA (Quấn PE & Strapping)'
  );

  // POPUP TỰ NHẬP PHỤ PHÍ
  const [isCustomSurchargeModalOpen, setIsCustomSurchargeModalOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<string>(currency === 'USD' ? 'USD / Kg' : 'VND / Kg');
  const [customType, setCustomType] = useState<'variable' | 'fixed'>('variable');
  const [customDefaultPrice, setCustomDefaultPrice] = useState<number>(currency === 'USD' ? 0.2 : 5000);

  // POPUP CẤU HÌNH LỊCH BAY & GIỜ CUT-OFF GA HÀNG KHÔNG
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [scheduleModalDays, setScheduleModalDays] = useState<string[]>(['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']);
  const [scheduleModalTime, setScheduleModalTime] = useState<string>('18:00');

  const getSchedulePreviewString = (days: string[], time: string) => {
    if (days.length === 7) return `Hàng ngày${time ? ` (Cắt ga ${time})` : ''}`;
    if (days.length > 0) return `${days.join(', ')}${time ? ` (Cắt ga ${time})` : ''}`;
    if (time) return `Cắt ga ${time}`;
    return 'Chưa chọn lịch bay';
  };

  const handleOpenScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    const formatted = getSchedulePreviewString(scheduleModalDays, scheduleModalTime);
    setDepartureSchedule(formatted);
    setIsScheduleModalOpen(false);
  };

  // ĐỒNG BỘ CUỘN BẢNG
  const tableRef = useRef<HTMLTableElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(1400);

  useEffect(() => {
    if (tableRef.current) {
      setTableScrollWidth(tableRef.current.scrollWidth);
    }
  }, [volumeTiers, weightTiers, activeSurcharges, isOpen]);

  const handleTopScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleBottomScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (topScrollRef.current) {
      topScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // TÍNH TOÁN ALL-IN PRICE CHO TỪNG BẬC CBM VÀ KG
  const getAllInPriceCbm = (tierId: string): number => {
    const base = basePricesCbm[tierId] || 0;
    const surchargesSum = activeSurcharges
      .filter(s => s.type === 'variable')
      .reduce((sum, s) => sum + (variablePricesCbm[s.id]?.[tierId] || 0), 0);
    return base + surchargesSum;
  };

  const getAllInPriceKg = (tierId: string): number => {
    const base = basePricesKg[tierId] || 0;
    const surchargesSum = activeSurcharges
      .filter(s => s.type === 'variable')
      .reduce((sum, s) => sum + (variablePricesKg[s.id]?.[tierId] || 0), 0);
    return Number((base + surchargesSum).toFixed(2));
  };

  // ĐỒNG BỘ GIÁ TỰ ĐỘNG THEO TỶ LỆ IATA CHUẨN: 1 CBM = 167 KG
  const handleAutoConvertIataRatio = (source: 'kgToCbm' | 'cbmToKg') => {
    if (source === 'kgToCbm') {
      // 1 CBM = 167 Kg
      const baseKgRef = basePricesKg['w_plus100'] || basePricesKg['w_plus45'] || 4.2;
      const calculatedCbmBase = currency === 'USD' 
        ? Number((baseKgRef * 167 * 0.92).toFixed(1))
        : Math.round(baseKgRef * 167 * 0.92);

      setBasePricesCbm({
        v1: currency === 'USD' ? Number((calculatedCbmBase * 1.25).toFixed(1)) : Math.round(calculatedCbmBase * 1.25),
        v2: currency === 'USD' ? Number((calculatedCbmBase * 1.1).toFixed(1)) : Math.round(calculatedCbmBase * 1.1),
        v3: calculatedCbmBase,
        v4: currency === 'USD' ? Number((calculatedCbmBase * 0.88).toFixed(1)) : Math.round(calculatedCbmBase * 0.88),
        v5: currency === 'USD' ? Number((calculatedCbmBase * 0.78).toFixed(1)) : Math.round(calculatedCbmBase * 0.78),
      });
    } else {
      // CBM to Kg: 1 Kg = 1 CBM / 167
      const baseCbmRef = basePricesCbm['v2'] || 580;
      const calculatedKgBase = currency === 'USD' 
        ? Number((baseCbmRef / 167).toFixed(2))
        : Math.round(baseCbmRef / 167);

      setBasePricesKg({
        w_min: currency === 'USD' ? Number((calculatedKgBase * 12).toFixed(1)) : Math.round(calculatedKgBase * 12),
        w_under45: currency === 'USD' ? Number((calculatedKgBase * 1.35).toFixed(2)) : Math.round(calculatedKgBase * 1.35),
        w_plus45: currency === 'USD' ? Number((calculatedKgBase * 1.15).toFixed(2)) : Math.round(calculatedKgBase * 1.15),
        w_plus100: calculatedKgBase,
        w_plus300: currency === 'USD' ? Number((calculatedKgBase * 0.85).toFixed(2)) : Math.round(calculatedKgBase * 0.85),
        w_plus500: currency === 'USD' ? Number((calculatedKgBase * 0.75).toFixed(2)) : Math.round(calculatedKgBase * 0.75),
        w_plus1000: currency === 'USD' ? Number((calculatedKgBase * 0.68).toFixed(2)) : Math.round(calculatedKgBase * 0.68),
      });
    }
  };

  // THÊM BẬC CBM
  const handleAddVolumeTier = () => {
    const nextIdx = volumeTiers.length + 1;
    const newId = `v${Date.now()}`;
    const newTier: AirTierColumn = {
      id: newId,
      rangeLabel: `Bậc ${nextIdx} (> ${volumeTiers[volumeTiers.length - 1]?.maxVal || 10} CBM)`,
      minVal: (volumeTiers[volumeTiers.length - 1]?.maxVal || 10) + 0.1,
      maxVal: 999999,
    };
    setVolumeTiers([...volumeTiers, newTier]);
    setBasePricesCbm(prev => ({ ...prev, [newId]: currency === 'USD' ? 380 : 9500000 }));
    setVariablePricesCbm(prev => {
      const updated = { ...prev };
      activeSurcharges.filter(s => s.type === 'variable').forEach(s => {
        if (!updated[s.id]) updated[s.id] = {};
        updated[s.id][newId] = s.defaultCbm || (currency === 'USD' ? 20 : 500000);
      });
      return updated;
    });
  };

  // THÊM BẬC KG
  const handleAddWeightTier = () => {
    const nextIdx = weightTiers.length + 1;
    const newId = `w${Date.now()}`;
    const newTier: AirTierColumn = {
      id: newId,
      rangeLabel: `Bậc ${nextIdx} (> ${weightTiers[weightTiers.length - 1]?.maxVal || 1000} Kg)`,
      minVal: (weightTiers[weightTiers.length - 1]?.maxVal || 1000) + 1,
      maxVal: 999999,
    };
    setWeightTiers([...weightTiers, newTier]);
    setBasePricesKg(prev => ({ ...prev, [newId]: currency === 'USD' ? 2.5 : 62000 }));
    setVariablePricesKg(prev => {
      const updated = { ...prev };
      activeSurcharges.filter(s => s.type === 'variable').forEach(s => {
        if (!updated[s.id]) updated[s.id] = {};
        updated[s.id][newId] = s.defaultKg || (currency === 'USD' ? 0.1 : 2500);
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
  const currentSurchargesLov = resolvedCargoType === 'dangerous' 
    ? AIR_DANGEROUS_SURCHARGES_LOV 
    : (resolvedCargoType === 'perishable' ? AIR_PERISHABLE_SURCHARGES_LOV : AIR_GENERAL_SURCHARGES_LOV);

  const handleAddSurchargeFromLOV = (surchargeId: string) => {
    if (surchargeId === '__custom__') {
      setIsCustomSurchargeModalOpen(true);
      return;
    }

    const lovItem = currentSurchargesLov.find(s => s.id === surchargeId);
    if (!lovItem || activeSurcharges.some(s => s.id === lovItem.id)) return;

    setActiveSurcharges([...activeSurcharges, lovItem]);

    const mult = currency === 'USD' ? 1 : 25000;
    if (lovItem.type === 'variable') {
      setVariablePricesCbm(prev => ({
        ...prev,
        [lovItem.id]: volumeTiers.reduce((acc, t) => ({ ...acc, [t.id]: (lovItem.defaultCbm || 20) * mult }), {}),
      }));
      setVariablePricesKg(prev => ({
        ...prev,
        [lovItem.id]: weightTiers.reduce((acc, t) => ({ ...acc, [t.id]: (lovItem.defaultKg || 0.1) * mult }), {}),
      }));
    } else {
      setFixedPrices(prev => ({
        ...prev,
        [lovItem.id]: (lovItem.defaultFixedPrice || 25) * mult,
      }));
    }
  };

  // THÊM PHỤ PHÍ TỰ NHẬP
  const handleSaveCustomSurcharge = () => {
    if (!customName.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newItem: AirCargoSurchargeItem = {
      id: newId,
      name: customName.trim(),
      unit: customUnit,
      type: customType,
      defaultCbm: customType === 'variable' ? customDefaultPrice * 167 : undefined,
      defaultKg: customType === 'variable' ? customDefaultPrice : undefined,
      defaultFixedPrice: customType === 'fixed' ? customDefaultPrice : undefined,
    };

    setActiveSurcharges([...activeSurcharges, newItem]);

    if (customType === 'variable') {
      setVariablePricesCbm(prev => ({
        ...prev,
        [newId]: volumeTiers.reduce((acc, t) => ({ ...acc, [t.id]: customDefaultPrice * 167 }), {}),
      }));
      setVariablePricesKg(prev => ({
        ...prev,
        [newId]: weightTiers.reduce((acc, t) => ({ ...acc, [t.id]: customDefaultPrice }), {}),
      }));
    } else {
      setFixedPrices(prev => ({
        ...prev,
        [newId]: customDefaultPrice,
      }));
    }

    setIsCustomSurchargeModalOpen(false);
    setCustomName('');
  };

  // XÓA PHỤ PHÍ
  const handleDeleteSurcharge = (id: string) => {
    setActiveSurcharges(activeSurcharges.filter(s => s.id !== id));
  };

  // THÊM TIỆN ÍCH VAS
  const currentVasLov = resolvedCargoType === 'dangerous'
    ? AIR_DANGEROUS_VAS_LOV
    : (resolvedCargoType === 'perishable' ? AIR_PERISHABLE_VAS_LOV : AIR_GENERAL_VAS_LOV);

  const handleAddVasFromLOV = (vasId: string) => {
    const item = currentVasLov.find(v => v.id === vasId);
    if (!item || vasItems.some(v => v.id === item.id)) return;
    const mult = currency === 'USD' ? 1 : 25000;
    setVasItems([...vasItems, { ...item, price: item.price * mult }]);
  };

  const handleDeleteVasItem = (id: string) => {
    setVasItems(vasItems.filter(v => v.id !== id));
  };

  const handleUpdateVasPrice = (id: string, price: number) => {
    setVasItems(vasItems.map(v => v.id === id ? { ...v, price } : v));
  };

  // TỔNG SỐ CỘT DỮ LIỆU
  const totalDataCols = volumeTiers.length + 1 + weightTiers.length;

  // LƯU TOÀN BỘ MA TRẬN
  const handleConfirmSave = () => {
    const payload: AirCargoPricingConfig = {
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
      airTransitTime,
      transitType,
      aircraftType,
      flightType,
      temperatureRange: resolvedCargoType === 'perishable' ? temperatureRange : undefined,
      tempPackagingType: resolvedCargoType === 'perishable' ? tempPackagingType : undefined,
      iataDgClass: resolvedCargoType === 'dangerous' ? iataDgClass : undefined,
      dgAircraftRule: resolvedCargoType === 'dangerous' ? dgAircraftRule : undefined,
      packagingStandard: resolvedCargoType === 'general' ? generalPackagingStandard : undefined,
      paymentTerms,
      validUntil,
    };

    const repPrice = getAllInPriceKg('w_plus100') || basePricesKg['w_plus100'] || 4.2;

    onSave(route.id, {
      airCargoPricing: payload,
      price: repPrice,
      pricingUnit: 'Kg',
      currency,
      departureSchedule,
      sla: departureSchedule,
      transitType,
      validUntil,
      temperatureRange: resolvedCargoType === 'perishable' ? temperatureRange : undefined,
      tempPackagingType: resolvedCargoType === 'perishable' ? tempPackagingType : undefined,
      iataDgClass: resolvedCargoType === 'dangerous' ? iataDgClass : undefined,
      dgAircraftRule: resolvedCargoType === 'dangerous' ? dgAircraftRule : undefined,
      aircraftType,
    });

    onClose();
  };

  // Màu sắc chủ đạo theo nhóm hàng
  const cargoHeaderConfig = {
    general: {
      gradient: 'from-slate-900 via-sky-950 to-indigo-950',
      icon: Plane,
      iconColor: 'text-sky-400 bg-sky-500/20 border-sky-400/30',
      title: 'Ma Trận Biểu Phí Hàng Không Chuẩn (General Air Cargo Matrix)',
      badge: 'HÀNG THƯỜNG',
      badgeClass: 'bg-sky-500 text-slate-950',
      subBadge: 'Chuẩn Air Cargo: 1 CBM = 167 Kg',
    },
    perishable: {
      gradient: 'from-slate-900 via-teal-950 to-cyan-950',
      icon: ThermometerSnowflake,
      iconColor: 'text-teal-400 bg-teal-500/20 border-teal-400/30',
      title: 'Ma Trận Biểu Phí Hàng Lạnh Hàng Không (Perishable Cold Chain Air Matrix)',
      badge: 'HÀNG LẠNH',
      badgeClass: 'bg-teal-500 text-slate-950',
      subBadge: 'Kiểm Soát Chuỗi Lạnh CEIV Pharma / GDP',
    },
    dangerous: {
      gradient: 'from-slate-900 via-amber-950 to-rose-950',
      icon: AlertTriangle,
      iconColor: 'text-amber-400 bg-amber-500/20 border-amber-400/30',
      title: 'Ma Trận Biểu Phí Hàng Nguy Hiểm (IATA Dangerous Goods DGR Matrix)',
      badge: 'HÀNG NGUY HIỂM',
      badgeClass: 'bg-amber-500 text-slate-950',
      subBadge: 'Quy Định IATA DGR Class 1 - 9 / UN Spec',
    },
  }[resolvedCargoType];

  const HeaderIcon = cargoHeaderConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-7xl w-full max-h-[96vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* =========================================================================
            1. MODAL HEADER (CHUẨN UNIFIED AIR MATRIX)
        ========================================================================= */}
        <div className={`px-6 py-4 bg-gradient-to-r ${cargoHeaderConfig.gradient} text-white flex items-center justify-between border-b border-slate-800 shadow-md shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${cargoHeaderConfig.iconColor} flex items-center justify-center border shadow-inner shrink-0`}>
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${cargoHeaderConfig.badgeClass}`}>
                  {cargoHeaderConfig.badge}
                </span>
                <h3 className="text-base font-black tracking-tight text-white">
                  {cargoHeaderConfig.title}
                </h3>
                <span className="text-xs font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                  {currency === 'VND' ? 'VND (₫)' : 'USD ($)'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap font-medium">
                <span>Tuyến: <strong className="text-white">{route.route || route.routeCode}</strong></span>
                <span>• Sân bay đi: <strong>{route.origin}</strong></span>
                <span>➔ Đến: <strong>{route.destination}</strong></span>
                <span className="bg-sky-900/60 text-sky-200 text-[11px] font-bold px-2 py-0.5 rounded border border-sky-700/50">
                  Hãng bay: {route.vehicleType || 'Vietnam Airlines (VN Cargo)'}
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
            2. SUBHEADER: ĐIỀU KHIỂN BẬC, TỶ LỆ QUY ĐỔI & TIỀN TỆ
        ========================================================================= */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Khai báo song song: <strong className="text-sky-700">Thể Tích ({volumeTiers.length} bậc CBM)</strong> & <strong className="text-indigo-700">Trọng Lượng ({weightTiers.length} bậc Kg IATA)</strong></span>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAutoConvertIataRatio('kgToCbm')}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded font-bold transition-colors cursor-pointer border border-sky-300"
                title="Tự động tính giá CBM từ bậc +100Kg theo chuẩn 1 CBM = 167 Kg"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Quy đổi Kg ➔ CBM</span>
              </button>
              <button
                type="button"
                onClick={() => handleAutoConvertIataRatio('cbmToKg')}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded font-bold transition-colors cursor-pointer border border-indigo-300"
                title="Tự động tính giá Kg từ bậc CBM theo chuẩn 1 CBM = 167 Kg"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Quy đổi CBM ➔ Kg</span>
              </button>
            </div>
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
              <span>Thêm Bậc CBM</span>
            </button>

            <button
              type="button"
              onClick={handleAddWeightTier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-300 hover:bg-indigo-100 font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Thêm Bậc Kg</span>
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
            3. BẢNG MA TRẬN HỢP NHẤT DUY NHẤT (UNIFIED MATRIX TABLE)
        ========================================================================= */}
        <div 
          ref={bottomScrollRef}
          onScroll={handleBottomScroll}
          className="flex-1 overflow-x-auto overflow-y-auto min-h-0 bg-white"
        >
          <table ref={tableRef} className="w-full border-collapse text-xs text-left min-w-[1380px]">
            <thead>
              {/* TẦNG 1: HEADER THỂ TÍCH & TRỌNG LƯỢNG */}
              <tr className="border-b border-slate-300 text-center font-bold">
                <th rowSpan={2} className="sticky left-0 z-30 bg-slate-100 text-slate-800 px-4 py-3 border-r-2 border-slate-300 text-xs w-[340px] min-w-[340px] shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  DÒNG BIỂU PHÍ & DỊCH VỤ HÀNG KHÔNG
                </th>
                
                {/* KHỐI 1: THỂ TÍCH (CBM) */}
                <th colSpan={volumeTiers.length + 1} className="bg-sky-50 text-sky-950 py-2.5 px-3 border-r-2 border-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Box className="w-4 h-4 text-sky-600" />
                    <span className="font-black tracking-wide uppercase">BIỂU GIÁ THEO THỂ TÍCH AIR CARGO (CBM)</span>
                    <span className="text-[10.5px] font-normal text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                      {currency === 'VND' ? 'đ/CBM' : 'USD/CBM'}
                    </span>
                  </div>
                </th>

                {/* KHỐI 2: TRỌNG LƯỢNG (KG - CHUẨN IATA) */}
                <th colSpan={weightTiers.length} className="bg-indigo-50 text-indigo-950 py-2.5 px-3">
                  <div className="flex items-center justify-center gap-2">
                    <Plane className="w-4 h-4 text-indigo-600" />
                    <span className="font-black tracking-wide uppercase">BIỂU GIÁ THEO TRỌNG LƯỢNG IATA (CHARGEABLE WEIGHT - KG)</span>
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
                  <div className="text-[9.5px] font-normal text-slate-500">Tối thiểu / Lô CBM</div>
                </th>

                {/* Kg Columns */}
                {weightTiers.map((t) => (
                  <th key={t.id} className={`py-2 px-2 text-slate-800 font-bold min-w-[105px] max-w-[125px] ${t.id === 'w_plus100' ? 'bg-indigo-100/90 text-indigo-950 border-x border-indigo-300' : 'bg-indigo-50/70'}`}>
                    <div className="flex items-center justify-between text-[11px] text-indigo-900 font-extrabold">
                      <span>{t.id === 'w_plus100' ? 'BẬC CHUẨN' : t.rangeLabel.split(' ')[0]}</span>
                      {weightTiers.length > 1 && t.id.startsWith('w') && !['w_min', 'w_under45', 'w_plus45', 'w_plus100'].includes(t.id) && (
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
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              
              {/* =========================================================================
                  DÒNG TỔNG CƯỚC DỰ KIẾN (ALL-IN RATE TỰ TÍNH)
              ========================================================================= */}
              <tr className="bg-amber-50/90 font-bold divide-x divide-amber-200/80 border-b-2 border-amber-300">
                <td className="sticky left-0 z-20 bg-amber-100/95 text-amber-950 px-4 py-2.5 border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-amber-900">
                      TỔNG CƯỚC DỰ KIẾN (ALL-IN)
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                      Tự tính
                    </span>
                  </div>
                  <div className="text-[10px] font-normal text-amber-800 mt-0.5">
                    Cước bay + Phụ phí biến đổi
                  </div>
                </td>

                {/* All-in CBM */}
                {volumeTiers.map((t) => (
                  <td key={t.id} className="p-2 text-right text-xs font-black text-amber-900 bg-amber-50/70">
                    {currency === 'USD' 
                      ? `$${getAllInPriceCbm(t.id).toFixed(2)}`
                      : `${getAllInPriceCbm(t.id).toLocaleString('vi-VN')} ₫`}
                  </td>
                ))}
                <td className="p-2 text-right text-xs font-black text-amber-900 bg-amber-100/80 border-r-2 border-slate-300">
                  {currency === 'USD' ? `$${minChargeCbm}` : `${minChargeCbm.toLocaleString('vi-VN')} ₫`}
                </td>

                {/* All-in Kg */}
                {weightTiers.map((t) => (
                  <td key={t.id} className={`p-2 text-right text-xs font-black text-amber-950 ${t.id === 'w_plus100' ? 'bg-amber-100' : 'bg-amber-50/70'}`}>
                    {currency === 'USD' 
                      ? `$${getAllInPriceKg(t.id).toFixed(2)}`
                      : `${getAllInPriceKg(t.id).toLocaleString('vi-VN')} ₫`}
                  </td>
                ))}
              </tr>

              {/* =========================================================================
                  DÒNG CƯỚC BAY CƠ BẢN (AIR FREIGHT - A/F) * BẮT BUỘC
              ========================================================================= */}
              <tr className="bg-white hover:bg-slate-50/80 divide-x divide-slate-200 font-semibold">
                <td className="sticky left-0 z-20 bg-white px-4 py-3 border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">
                      Cước Bay Cơ Bản (Air Freight - A/F) *
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold border border-rose-200">
                      Bắt buộc
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Cước bay thuần chặng sân bay - sân bay (Airport to Airport)
                  </div>
                </td>

                {/* Base CBM Inputs */}
                {volumeTiers.map((t) => (
                  <td key={t.id} className="p-1.5 bg-sky-50/20">
                    <input
                      type="number"
                      step={currency === 'USD' ? '0.1' : '1000'}
                      value={basePricesCbm[t.id] ?? 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setBasePricesCbm({ ...basePricesCbm, [t.id]: val });
                      }}
                      className="w-full text-right px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </td>
                ))}
                {/* Min CBM */}
                <td className="p-1.5 bg-sky-100/30 border-r-2 border-slate-300">
                  <input
                    type="number"
                    step={currency === 'USD' ? '1' : '50000'}
                    value={minChargeCbm}
                    onChange={(e) => setMinChargeCbm(parseFloat(e.target.value) || 0)}
                    className="w-full text-right px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </td>

                {/* Base Kg Inputs */}
                {weightTiers.map((t) => (
                  <td key={t.id} className={`p-1.5 ${t.id === 'w_plus100' ? 'bg-indigo-100/40 font-black' : 'bg-indigo-50/20'}`}>
                    <input
                      type="number"
                      step={currency === 'USD' ? '0.01' : '100'}
                      value={basePricesKg[t.id] ?? 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setBasePricesKg({ ...basePricesKg, [t.id]: val });
                      }}
                      className={`w-full text-right px-2 py-1 bg-white border rounded-lg text-xs font-bold text-slate-800 focus:outline-none ${
                        t.id === 'w_plus100' ? 'border-indigo-400 focus:border-indigo-600 ring-1 ring-indigo-200' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                  </td>
                ))}
              </tr>

              {/* =========================================================================
                  MỤC 1A: PHỤ PHÍ BIẾN ĐỔI THEO THỂ TÍCH & TRỌNG LƯỢNG (VARIABLE)
              ========================================================================= */}
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td colSpan={totalDataCols + 1} className="px-4 py-2 text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1A</span>
                      <span>MỤC 1A: PHỤ PHÍ BIẾN ĐỔI THEO THỂ TÍCH (CBM) & TRỌNG LƯỢNG (KG)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Phụ phí nhân với số lượng CBM hoặc Kg thực tế
                    </span>
                  </div>
                </td>
              </tr>

              {activeSurcharges.filter(s => s.type === 'variable').map((surcharge) => (
                <tr key={surcharge.id} className="hover:bg-slate-50/80 divide-x divide-slate-200">
                  <td className="sticky left-0 z-20 bg-white px-4 py-2 border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 text-xs">
                          {surcharge.name}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Đơn vị: {surcharge.unit}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSurcharge(surcharge.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Xóa phụ phí này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* CBM Values */}
                  {volumeTiers.map((t) => (
                    <td key={t.id} className="p-1.5 bg-sky-50/10">
                      <input
                        type="number"
                        step={currency === 'USD' ? '0.1' : '500'}
                        value={variablePricesCbm[surcharge.id]?.[t.id] ?? 0}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setVariablePricesCbm({
                            ...variablePricesCbm,
                            [surcharge.id]: {
                              ...(variablePricesCbm[surcharge.id] || {}),
                              [t.id]: val,
                            },
                          });
                        }}
                        className="w-full text-right px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700 focus:border-sky-500 focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="p-1.5 text-center text-slate-400 text-xs bg-sky-50/20 border-r-2 border-slate-300">
                    -
                  </td>

                  {/* Kg Values */}
                  {weightTiers.map((t) => (
                    <td key={t.id} className="p-1.5 bg-indigo-50/10">
                      <input
                        type="number"
                        step={currency === 'USD' ? '0.01' : '10'}
                        value={variablePricesKg[surcharge.id]?.[t.id] ?? 0}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setVariablePricesKg({
                            ...variablePricesKg,
                            [surcharge.id]: {
                              ...(variablePricesKg[surcharge.id] || {}),
                              [t.id]: val,
                            },
                          });
                        }}
                        className="w-full text-right px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* DÒNG NÉT ĐỨT THÊM PHỤ PHÍ BIẾN ĐỔI */}
              <tr className="border-b border-slate-200">
                <td colSpan={totalDataCols + 1} className="p-2 bg-sky-50/30">
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddSurchargeFromLOV(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="w-full text-xs font-bold text-sky-700 bg-sky-50/80 hover:bg-sky-100 border-2 border-dashed border-sky-300 hover:border-sky-400 rounded-xl py-2 px-3 text-left transition-all cursor-pointer focus:outline-none"
                    >
                      <option value="" disabled>
                        + Thêm phụ phí biến đổi (chọn từ danh mục chuẩn hàng không hoặc tự tạo)...
                      </option>
                      {currentSurchargesLov
                        .filter(s => s.type === 'variable' && !activeSurcharges.some(a => a.id === s.id))
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            + {s.name} ({s.unit})
                          </option>
                        ))}
                      <option value="__custom__" className="text-indigo-600 font-black">
                        + Tự tạo phụ phí biến đổi mới...
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* =========================================================================
                  MỤC 1B: PHỤ PHÍ CỐ ĐỊNH THEO AWB / LÔ (SPAN FULL WIDTH)
              ========================================================================= */}
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td colSpan={totalDataCols + 1} className="px-4 py-2 text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1B</span>
                      <span>MỤC 1B: PHỤ PHÍ CỐ ĐỊNH THEO VẬN ĐƠN / LÔ HÀNG (AWB / HBL / SHIPMENT)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Phụ phí thu trọn gói theo từng vận đơn hàng không hoặc tờ khai
                    </span>
                  </div>
                </td>
              </tr>

              {activeSurcharges.filter(s => s.type === 'fixed').map((surcharge) => {
                const price = fixedPrices[surcharge.id] ?? 0;
                const isFree = price === 0;

                return (
                  <tr key={surcharge.id} className="hover:bg-slate-50/80 divide-x divide-slate-200">
                    <td className="sticky left-0 z-20 bg-white px-4 py-2 border-r-2 border-slate-300 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-800 text-xs">
                            {surcharge.name}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Đơn vị: {surcharge.unit}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSurcharge(surcharge.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Xóa phụ phí này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Span across all tier columns */}
                    <td colSpan={totalDataCols} className="p-2 bg-emerald-50/20">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            disabled={isFree}
                            step={currency === 'USD' ? '1' : '10000'}
                            value={price}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setFixedPrices({ ...fixedPrices, [surcharge.id]: val });
                            }}
                            className={`w-36 text-right px-2.5 py-1 bg-white border rounded-lg text-xs font-bold focus:outline-none ${
                              isFree ? 'text-slate-400 border-slate-200 bg-slate-50' : 'text-emerald-900 border-emerald-300 focus:border-emerald-500'
                            }`}
                          />
                          <span className="text-xs text-slate-500 font-bold">
                            {currency === 'USD' ? '$' : '₫'} / {surcharge.unit.split('/')[1] || 'Lô'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setFixedPrices({
                              ...fixedPrices,
                              [surcharge.id]: isFree ? (surcharge.defaultFixedPrice || 25) : 0,
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            isFree 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isFree ? '✓ Đã Miễn Phí (0đ)' : 'Đặt Miễn Phí (0đ)'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* DÒNG NÉT ĐỨT THÊM PHỤ PHÍ CỐ ĐỊNH */}
              <tr className="border-b border-slate-200">
                <td colSpan={totalDataCols + 1} className="p-2 bg-emerald-50/30">
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddSurchargeFromLOV(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="w-full text-xs font-bold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border-2 border-dashed border-emerald-300 hover:border-emerald-400 rounded-xl py-2 px-3 text-left transition-all cursor-pointer focus:outline-none"
                    >
                      <option value="" disabled>
                        + Thêm phụ phí cố định (chọn từ danh mục chuẩn hàng không hoặc tự tạo)...
                      </option>
                      {currentSurchargesLov
                        .filter(s => s.type === 'fixed' && !activeSurcharges.some(a => a.id === s.id))
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            + {s.name} ({s.unit})
                          </option>
                        ))}
                      <option value="__custom__" className="text-emerald-700 font-black">
                        + Tự tạo phụ phí cố định mới...
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* =========================================================================
                  MỤC 2: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) THEO NHÓM HÀNG
              ========================================================================= */}
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td colSpan={totalDataCols + 1} className="px-4 py-2 text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>MỤC 2: TIỆN ÍCH KÈM THEO & DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS TÙY CHỌN)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Chỉ tính khi khách hàng yêu cầu xử lý đặc biệt
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
              <tr className="border-b border-slate-200">
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
                      + Thêm tiện ích VAS chuyên dụng cho {cargoHeaderConfig.badge}...
                    </option>
                    {currentVasLov
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
                  MỤC 3: CAM KẾT LỊCH BAY & ĐIỀU KHOẢN VẬN CHUYỂN HÀNG KHÔNG
              ========================================================================= */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={totalDataCols + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 text-sky-700" />
                    <span>3. CAM KẾT LỊCH BAY & ĐIỀU KHOẢN VẬN CHUYỂN</span>
                  </div>
                </td>
              </tr>

              {/* 1. Lịch Bay & Giờ Cắt Ga Hàng Không (Closing/Cut-off) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>1. Lịch Bay & Giờ Cắt Ga Hàng Không (Closing/Cut-off)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Lịch chuyến bay trong tuần và giờ hạn chót nhận hàng tại ga hàng không (TCS / SCSC / NCTS / ASc...)
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <button
                    type="button"
                    onClick={handleOpenScheduleModal}
                    className="max-w-md mx-auto px-4 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:border-sky-500 hover:bg-sky-50/20 hover:text-sky-900 transition-all shadow-2xs flex items-center justify-between gap-2 group cursor-pointer"
                    title="Nhấp để cấu hình chi tiết lịch bay và giờ cắt ga hàng không"
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
                    <Plane className="w-3.5 h-3.5 text-sky-600" />
                    <span>2. Loại Tuyến (Transit Type)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Chuyến bay thẳng trực tiếp hay có quá cảnh/trung chuyển qua sân bay hub
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
                      <option value="Direct">Direct (Bay thẳng trực tiếp)</option>
                      <option value="Transit">Transit (Quá cảnh / Chuyển tiếp hub)</option>
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
                    Thời gian bay dự kiến từ sân bay đi (AOD) đến sân bay đến (AOA)
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={airTransitTime}
                      onChange={(e) => setAirTransitTime(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer"
                    >
                      <option value="12 - 24 Giờ">12 - 24 Giờ (Chuyến bay trong ngày)</option>
                      <option value="24 - 36 Giờ">24 - 36 Giờ (Bay thẳng / Chuyển tiếp nhanh)</option>
                      <option value="2 - 3 Ngày">2 - 3 Ngày (Chuyển tiếp hub khu vực)</option>
                      <option value="3 - 5 Ngày">3 - 5 Ngày (Tuyến xa / Châu Mỹ)</option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 4. Loại Tàu Bay Vận Chuyển (Aircraft Type) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <PlaneTakeoff className="w-3.5 h-3.5 text-sky-600" />
                    <span>4. Loại Tàu Bay Vận Chuyển (Aircraft Type)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Vận chuyển bằng khoang bụng máy bay hành khách (Pax/Belly) hay chuyên cơ chở hàng (Freighter)
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={aircraftType}
                      onChange={(e) => setAircraftType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Passenger Aircraft (Pax Cargo)">Passenger Aircraft (Tàu khách chở bụng rỗng - Belly Cargo)</option>
                      <option value="Freighter (Chuyên cơ chở hàng Cargo)">Freighter (Chuyên cơ chuyên dụng chở hàng Cargo Aircraft)</option>
                      <option value="Cả hai (Belly & Freighter)">Linh hoạt cả tàu khách & chuyên cơ</option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 5. Quy Tắc Trọng Lượng Thể Tích Hàng Không (Air Cargo W/V Ratio) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-sky-600" />
                    <span>5. Quy Tắc Trọng Lượng Thể Tích Hàng Không (Air Cargo W/V Ratio)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Tỷ lệ quy đổi chuẩn IATA giữa thể tích (CBM) và khối lượng tính cước (Kg)
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-md mx-auto">
                    <select
                      value={wmRatio}
                      onChange={(e) => setWmRatio(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="1 CBM = 167 Kg (Chuẩn Air Cargo IATA: D×R×C / 6.000)">
                        1 CBM = 167 Kg (Chuẩn Air Cargo IATA: D×R×C / 6.000)
                      </option>
                      <option value="1 CBM = 200 Kg (Chuyên chở hàng thể tích / Express 1:5000)">
                        1 CBM = 200 Kg (Chuyên chở hàng thể tích / Express 1:5000)
                      </option>
                      <option value="1 CBM = 250 Kg (Hàng mật độ cao / Heavy Cargo)">
                        1 CBM = 250 Kg (Hàng mật độ cao / Heavy Cargo)
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              {/* 6. Thuộc tính chuyên biệt theo nhóm hàng */}
              {resolvedCargoType === 'perishable' ? (
                <tr className="hover:bg-slate-50/60 transition-colors bg-teal-50/20">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-teal-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-1.5">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-teal-600" />
                      <span>6. Dải Nhiệt Độ Bảo Quản & Quy Cách Giữ Nhiệt (Cold Chain Specs)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                      Tiêu chuẩn kiểm soát nhiệt độ dược phẩm/thực phẩm và vật liệu bảo ôn hàng bay
                    </p>
                  </td>
                  <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                    <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={temperatureRange}
                        onChange={(e) => setTemperatureRange(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-teal-50 border border-teal-300 rounded-lg text-xs font-bold text-teal-950 text-center focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-2xs"
                        title="Dải nhiệt độ yêu cầu"
                      >
                        <option value="+2°C đến +8°C (Chilled / Dược phẩm)">+2°C đến +8°C (Chilled / Dược phẩm / Vắc-xin)</option>
                        <option value="-20°C đến -18°C (Deep Frozen / Hàng đông lạnh)">-20°C đến -18°C (Deep Frozen / Hàng đông lạnh)</option>
                        <option value="+15°C đến +25°C (Controlled Room Temperature)">+15°C đến +25°C (Controlled Room Temperature)</option>
                        <option value="Bảo quản bằng đá khô (-78.5°C)">Bảo quản bằng đá khô (-78.5°C)</option>
                      </select>
                      <select
                        value={tempPackagingType}
                        onChange={(e) => setTempPackagingType(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-2xs"
                        title="Quy cách bao bì giữ nhiệt"
                      >
                        <option value="Thùng xốp + Gel lạnh chuyên dụng">Thùng xốp + Gel lạnh chuyên dụng</option>
                        <option value="Thùng xốp + Nạp đá khô">Thùng xốp + Nạp đá khô</option>
                        <option value="Container nhiệt chủ động RKN/RAP cắm sạc điện">Container nhiệt chủ động RKN/RAP cắm sạc điện</option>
                        <option value="Màng giữ nhiệt chuyên dụng (Thermal Blanket)">Màng giữ nhiệt chuyên dụng (Thermal Blanket)</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ) : resolvedCargoType === 'dangerous' ? (
                <tr className="hover:bg-slate-50/60 transition-colors bg-amber-50/20">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-amber-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>6. Phân Lớp IATA DGR & Quy Định Loại Tàu Bay (Dangerous Goods Specs)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                      Phân nhóm nguy hiểm theo IATA DGR và quy định hạn chế chuyên chở trên tàu bay
                    </p>
                  </td>
                  <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                    <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={iataDgClass}
                        onChange={(e) => setIataDgClass(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 text-center focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                        title="Phân lớp nguy hiểm (IATA DG Class)"
                      >
                        <option value="Class 9: Hàng nguy hiểm khác (Pin Lithium / Đá khô)">Class 9: Pin Lithium / Đá khô</option>
                        <option value="Class 3: Chất lỏng dễ cháy (Flammable Liquids)">Class 3: Chất lỏng dễ cháy</option>
                        <option value="Class 8: Chất ăn mòn (Corrosives)">Class 8: Chất ăn mòn</option>
                        <option value="Class 2.1: Khí dễ cháy (Flammable Gas)">Class 2.1: Khí dễ cháy</option>
                        <option value="Class 2.2: Khí không dễ cháy, không độc hại">Class 2.2: Khí không cháy, không độc</option>
                        <option value="Class 4.1: Chất rắn dễ cháy">Class 4.1: Chất rắn dễ cháy</option>
                        <option value="Class 6.1: Chất độc hại (Toxic Substances)">Class 6.1: Chất độc hại</option>
                      </select>
                      <select
                        value={dgAircraftRule}
                        onChange={(e) => setDgAircraftRule(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                        title="Quy định loại tàu bay (Aircraft Restriction)"
                      >
                        <option value="Passenger & Cargo Aircraft (PAX/CAO)">Được phép bay cả tàu khách & tàu hàng (PAX/CAO)</option>
                        <option value="Cargo Aircraft Only (CAO)">Chỉ được chở trên chuyên cơ chở hàng (CAO)</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-sky-600" />
                      <span>6. Quy Cách Đóng Gói Tiêu Chuẩn Hàng Không (Packaging Standard)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                      Tiêu chuẩn bao bì, đóng gói pallet và quấn màng co bảo vệ hàng bay
                    </p>
                  </td>
                  <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                    <div className="max-w-md mx-auto">
                      <select
                        value={generalPackagingStandard}
                        onChange={(e) => setGeneralPackagingStandard(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-center text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer"
                      >
                        <option value="Thùng carton đóng Pallet tiêu chuẩn IATA (Quấn PE & Strapping)">Thùng carton đóng Pallet tiêu chuẩn IATA (Quấn PE & Strapping)</option>
                        <option value="Kiện hàng đóng gói riêng lẻ (Loose Cargo / Loose Cartons)">Kiện hàng đóng gói riêng lẻ (Loose Cargo / Loose Cartons)</option>
                        <option value="Kiện gỗ hun trùng đạt chuẩn kiểm dịch quốc tế ISPM 15">Kiện gỗ hun trùng đạt chuẩn kiểm dịch quốc tế ISPM 15</option>
                        <option value="Đóng thùng xốp / bảo ôn cách nhiệt đặc biệt">Đóng thùng xốp / bảo ôn cách nhiệt đặc biệt</option>
                      </select>
                    </div>
                  </td>
                </tr>
              )}

              {/* 7. Thời Hạn Hiệu Lực Giá (Valid Until) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>7. Thời Hạn Hiệu Lực Giá (Valid Until)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Mốc ngày kết thúc áp dụng biểu cước hàng không này
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

              {/* 8. Điều Khoản Thanh Toán & Công Nợ (Payment Terms) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>8. Điều Khoản Thanh Toán & Công Nợ (Payment Terms)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Thời hạn công nợ và hình thức thanh toán cước hàng không
                  </p>
                </td>
                <td colSpan={totalDataCols} className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs text-slate-800 cursor-pointer"
                    >
                      <option value="Net 30 Days">Net 30 Days (Công nợ 30 ngày)</option>
                      <option value="Net 15 Days">Net 15 Days (Công nợ 15 ngày)</option>
                      <option value="Net 7 Days">Net 7 Days (Công nợ 7 ngày)</option>
                      <option value="Prepaid / Cash">Prepaid / Cash (Thanh toán trước cất cánh)</option>
                      <option value="Freight Collect">Freight Collect (Thu cước tại đầu nhận)</option>
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
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Đơn giá cơ sở: <strong>{currency === 'USD' ? `$${getAllInPriceKg('w_plus100')}` : `${getAllInPriceKg('w_plus100').toLocaleString('vi-VN')} ₫`} / Kg (+100kg Base)</strong>
            </span>
            <span>•</span>
            <span>Tỷ lệ quy đổi: <strong>1 CBM = 167 Kg</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-md cursor-pointer shadow-sky-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình Biểu Phí Air Cargo</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POPUP 1: TỰ NHẬP PHỤ PHÍ MỚI
      ========================================================================= */}
      {isCustomSurchargeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                Thêm Phụ Phí Hàng Không Tùy Chọn
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
                <label className="font-bold text-slate-700 block mb-1">Tên phụ phí hàng không:</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="VD: Phí kiểm tra mã pin lithium, Phí soi chiếu đặc biệt..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại phụ phí:</label>
                  <select
                    value={customType}
                    onChange={(e) => {
                      const val = e.target.value as 'variable' | 'fixed';
                      setCustomType(val);
                      if (val === 'variable') {
                        setCustomUnit(currency === 'USD' ? 'USD / Kg' : 'VND / Kg');
                        setCustomDefaultPrice(currency === 'USD' ? 0.2 : 5000);
                      } else {
                        setCustomUnit(currency === 'USD' ? 'USD / AWB' : 'VND / AWB');
                        setCustomDefaultPrice(currency === 'USD' ? 25 : 600000);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  >
                    <option value="variable">Biến đổi theo CBM & Kg</option>
                    <option value="fixed">Cố định theo AWB / Lô</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đơn vị tính:</label>
                  <input
                    type="text"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Đơn giá mặc định ({currency === 'USD' ? 'USD' : 'VND'}):
                </label>
                <input
                  type="number"
                  step={currency === 'USD' ? (customType === 'variable' ? '0.01' : '1') : '1000'}
                  value={customDefaultPrice}
                  onChange={(e) => setCustomDefaultPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCustomSurchargeModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveCustomSurcharge}
                className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Thêm Vào Ma Trận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          POPUP 2: CẤU HÌNH LỊCH BAY & GIỜ CẮT MÁNG GA HÀNG KHÔNG
      ========================================================================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                Cấu Hình Lịch Bay & Giờ Cắt Hàng Ga Sân Bay
              </h4>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700">Ngày bay trong tuần:</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (scheduleModalDays.length === 7) {
                        setScheduleModalDays(['Thứ 2', 'Thứ 4', 'Thứ 6']);
                      } else {
                        setScheduleModalDays([...SCHEDULE_DAYS_OF_WEEK]);
                      }
                    }}
                    className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    {scheduleModalDays.length === 7 ? 'Bỏ chọn hàng ngày' : 'Chọn cả tuần (Hàng ngày)'}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {SCHEDULE_DAYS_OF_WEEK.map((day) => {
                    const isSelected = scheduleModalDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setScheduleModalDays(scheduleModalDays.filter(d => d !== day));
                          } else {
                            setScheduleModalDays([...scheduleModalDays, day]);
                          }
                        }}
                        className={`py-1.5 px-2 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-sky-600 text-white border-sky-600 shadow-2xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Giờ cắt máng đóng hàng tại nhà ga (Cut-off Time):
                </label>
                <div className="space-y-1.5">
                  {AIR_CUTOFF_TIMES.map((item) => (
                    <label
                      key={item.time}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                        scheduleModalTime === item.time 
                          ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cutoffTimeAir"
                        value={item.time}
                        checked={scheduleModalTime === item.time}
                        onChange={() => setScheduleModalTime(item.time)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Xem trước hiển thị:</span>
                <span className="text-xs font-bold text-slate-800">
                  {getSchedulePreviewString(scheduleModalDays, scheduleModalTime)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Áp Dụng Lịch Bay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
