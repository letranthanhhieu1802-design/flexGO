import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  X, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Truck, 
  Ship, 
  Plane, 
  Train, 
  Building2, 
  FileText, 
  Globe, 
  Layers,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  ShieldCheck,
  Package,
  Boxes,
  Plus,
  Trash2,
  Copy,
  Flame,
  Percent,
  Tag,
  Download,
  Upload,
  FileSpreadsheet,
  FileUp,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  Zap,
  Camera,
  Image,
  Eye,
  Star,
  Sliders,
  Thermometer,
  ShieldAlert,
  Warehouse
} from 'lucide-react';
import { ServiceType } from '../../types';
import { 
  TruckingFtlCostMatrixModal, 
  VehiclePricingMatrixColumn, 
  createDefaultVehiclePricingColumn 
} from './TruckingFtlCostMatrixModal';
import { 
  TruckingLtlCostMatrixModal 
} from './TruckingLtlCostMatrixModal';
import {
  OceanLclCostMatrixModal
} from './OceanLclCostMatrixModal';
import {
  AirCargoCostMatrixModal
} from './AirCargoCostMatrixModal';
import {
  AirExpressCostMatrixModal
} from './AirExpressCostMatrixModal';
import {
  OceanFclCostMatrixModal,
  ContainerPricingMatrixColumn,
  createDefaultContainerPricingColumn,
} from './OceanFclCostMatrixModal';
import {
  RailFclCostMatrixModal,
  RailContainerPricingMatrixColumn,
  createDefaultRailContainerPricingColumn,
} from './RailFclCostMatrixModal';
import {
  RailLclCostMatrixModal
} from './RailLclCostMatrixModal';
import {
  CrossBorderFtlCostMatrixModal,
  CrossBorderVehiclePricingMatrixColumn,
  createDefaultCrossBorderPricingColumn,
} from './CrossBorderFtlCostMatrixModal';
import {
  CrossBorderLtlCostMatrixModal,
} from './CrossBorderLtlCostMatrixModal';
import {
  WarehousePricingContinuousTable,
  WAREHOUSE_FREE_UTILITIES_SUGGESTIONS,
  COLD_FREE_UTILITIES_SUGGESTIONS,
  HAZMAT_FREE_UTILITIES_SUGGESTIONS,
  BONDED_GENERAL_FREE_UTILITIES_SUGGESTIONS,
  BONDED_COLD_FREE_UTILITIES_SUGGESTIONS,
  BONDED_HAZMAT_FREE_UTILITIES_SUGGESTIONS,
  SELF_GENERAL_FREE_UTILITIES_SUGGESTIONS,
  SELF_COLD_FREE_UTILITIES_SUGGESTIONS,
  SELF_HAZMAT_FREE_UTILITIES_SUGGESTIONS,
} from './WarehousePricingContinuousTable';

export const DAYS_OF_WEEK_LOV = [
  { id: 'T2', name: 'Thứ 2', short: 'T2' },
  { id: 'T3', name: 'Thứ 3', short: 'T3' },
  { id: 'T4', name: 'Thứ 4', short: 'T4' },
  { id: 'T5', name: 'Thứ 5', short: 'T5' },
  { id: 'T6', name: 'Thứ 6', short: 'T6' },
  { id: 'T7', name: 'Thứ 7', short: 'T7' },
  { id: 'CN', name: 'Chủ Nhật', short: 'CN' },
];

export const SCHEDULE_PRESETS = [
  { label: 'Hàng ngày', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'] },
  { label: 'T2 - T6', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'] },
  { label: 'T2, T4, T6', days: ['Thứ 2', 'Thứ 4', 'Thứ 6'] },
  { label: 'T3, T5, T7', days: ['Thứ 3', 'Thứ 5', 'Thứ 7'] },
  { label: 'T2 - T7', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] },
];

export const DEPARTURE_TIMES_LOV = [
  { time: '20:00', label: '20:00 (Xuất bến ca tối chính)' },
  { time: '19:30', label: '19:30 (Xuất bến ca tối sớm)' },
  { time: '21:00', label: '21:00 (Xuất bến ca tối)' },
  { time: '22:00', label: '22:00 (Xuất bến ca đêm)' },
  { time: '12:00', label: '12:00 (Xuất bến ca trưa)' },
  { time: '06:00', label: '06:00 (Xuất bến ca sáng sớm)' },
];

export const LCL_DEPARTURE_TIMES_LOV = [
  { time: '17:00', label: '17:00 (Cắt hàng CFS - Closing Time)' },
  { time: '12:00', label: '12:00 (Cắt hàng CFS ca trưa)' },
  { time: '09:00', label: '09:00 (Cắt hàng CFS ca sáng)' },
  { time: '20:00', label: '20:00 (Tàu chạy / Xuất bến ca tối)' },
  { time: 'Trước ETD 24h', label: 'Trước ETD 24h (Cut-off 24h)' },
  { time: 'Trước ETD 48h', label: 'Trước ETD 48h (Cut-off 48h)' },
];

export const OCEAN_TRADE_LANE_REGIONS_LOV = [
  'Bắc Mỹ',
  'Châu Á',
  'Châu Âu',
  'Châu Đại Dương',
  'Châu Phi',
  'Mỹ La Tinh & Caribê',
  'Trung Đông',
  'Tuyến Nội Địa',
];

export const LCL_SHIPPING_LINES = [
  'Maersk (Maersk Line)',
  'ONE (Ocean Network Express)',
  'MSC (Mediterranean Shipping Co)',
  'COSCO Shipping',
  'CMA CGM',
  'Evergreen Marine',
  'Hapag-Lloyd',
  'Yang Ming Line',
  'Wanhai Lines',
  'SITC Container Lines',
  'OOCL',
  'ZIM Integrated Shipping',
  'KMTC Line',
  'Sinokor Merchant Marine',
  'Vanguard Logistics (Co-loader)',
  'ECU Worldwide (Co-loader)',
  'Đường Sắt Việt Nam (VNR / Ratraco)',
  'Khác (Nhập hãng tàu khác)...',
];

export const LCL_PACKAGING_TYPES = LCL_SHIPPING_LINES;

export const RAIL_OPERATORS_LOV = [
  'Đường Sắt Việt Nam (VNR)',
  'Công ty CP Vận tải & Thương mại Đường sắt (Ratraco)',
  'Công ty CP Vận tải Đường sắt Hà Nội (Haraco)',
  'Công ty CP Vận tải Đường sắt Sài Gòn',
  'Khác (Nhập đơn vị vận hành khác)...',
];

export const RAIL_TRADE_LANE_CORRIDORS_LOV = [
  'Tuyến Bắc - Nam (Hà Nội ⇄ TP.HCM / Bình Dương)',
  'Tuyến Liên Vận Quốc Tế (Việt Nam ⇄ Trung Quốc / Châu Âu qua Ga Đồng Đăng)',
  'Tuyến Phía Bắc (Hà Nội ⇄ Hải Phòng / Lào Cai / Lạng Sơn)',
  'Tuyến Miền Trung (Đà Nẵng ⇄ Quảng Nam / Bình Định)',
  'Khác (Nhập hành lang tuyến khác)...',
];

export const AIR_TRADE_LANE_REGIONS_LOV = [
  'Đông Nam Á (ASEAN)',
  'Đông Bắc Á (Nhật - Hàn - Trung - Đài)',
  'Châu Âu (EU - UK)',
  'Bắc Mỹ (USA - Canada)',
  'Úc & New Zealand (Oceania)',
  'Trung Đông & Nam Á (Middle East / India)',
  'Nội địa Việt Nam (Trục Bắc - Trung - Nam)',
  'Khác (Toàn cầu)...',
];

export const AIR_AIRLINES_LOV = [
  'Vietnam Airlines (VN Cargo)',
  'Vietjet Air Cargo (VJ Cargo)',
  'Bamboo Airways Cargo (QH)',
  'Singapore Airlines Cargo (SQ)',
  'Qatar Airways Cargo (QR)',
  'Korean Air Cargo (KE)',
  'Cathay Cargo (CX)',
  'Emirates SkyCargo (EK)',
  'EVA Air Cargo (BR)',
  'China Airlines Cargo (CI)',
  'All Nippon Airways (ANA Cargo - NH)',
  'Japan Airlines (JAL Cargo - JL)',
  'Asiana Airlines Cargo (OZ)',
  'Thai Airways Cargo (TG)',
  'Lufthansa Cargo (LH)',
  'Turkish Airlines Cargo (TK)',
  'Air France - KLM Cargo (AF/KL)',
  'Khác (Nhập hãng bay khác)...',
];

export const EXPRESS_CARRIERS_LOV = [
  'DHL Express',
  'FedEx Express',
  'UPS Express',
  'EMS (VNPost)',
  'SF Express (Thuận Phong)',
  'Kerry Express',
  'J&T Express',
  'Viettel Post Express',
  'Khác (Nhập hãng khác)...',
];


export const CUSTOMS_AUTHORITIES_LOV = [
  'Chi cục HQ KCN Sóng Thần (Bình Dương)',
  'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV4 (Cát Lái / ICD Phước Long)',
  'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Đình Vũ)',
  'Chi cục HQ ICD Mỹ Đình / Gia Lâm (Hà Nội)',
  'Chi cục HQ Bắc Ninh (KCN Yên Phong / VSIP)',
  'Chi cục HQ Cửa khẩu Cảng Cái Mép (Bà Rịa - Vũng Tàu)',
  'Chi cục HQ KCN Biên Hòa / Long Bình (Đồng Nai)',
  'Chi cục HQ Cửa khẩu Quốc tế Hữu Nghị / Tân Thanh (Lạng Sơn)',
  'Chi cục HQ Chuyển Phát Nhanh / Tân Sơn Nhất',
  'Chi cục HQ Cửa khẩu Sân bay Quốc tế Nội Bài',
  'Khác (Nhập chi cục khác)...',
];

export const VIETNAM_PROVINCES_LOV = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Hải Phòng',
  'Bình Dương',
  'Đồng Nai',
  'Bà Rịa - Vũng Tàu',
  'Bắc Ninh',
  'Hưng Yên',
  'Hải Dương',
  'Đà Nẵng',
  'Cần Thơ',
  'Quảng Ninh',
  'Lạng Sơn',
  'Long An',
  'Tây Ninh',
  'Bình Phước',
  'Vĩnh Phúc',
  'Hà Nam',
  'Nam Định',
  'Khánh Hòa',
];

export const AIR_CUTOFF_TIMES_LOV = [
  { time: '18:00', label: '18:00 (Cắt hàng TCS/SCSC tiêu chuẩn)' },
  { time: '16:00', label: '16:00 (Cắt hàng ca chiều)' },
  { time: '12:00', label: '12:00 (Cắt hàng ca trưa - Day flight)' },
  { time: '20:00', label: '20:00 (Cắt hàng ca tối NCTS/ASc)' },
  { time: '22:00', label: '22:00 (Cắt hàng ca đêm - Red eye)' },
  { time: '4h trước ETD', label: 'Trước ETD 4h (Cắt hàng khẩn AOG)' },
  { time: '6h trước ETD', label: 'Trước ETD 6h (Cut-off tiêu chuẩn)' },
];

export interface ScheduleModalData {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  selectedDays: string[];
  departureTime: string;
  customNote: string;
  isLcl?: boolean;
  isAirCargo?: boolean;
}

// =========================================================================
// LTL & LCL TIERED PRICING DEFINITIONS (KHUNG BẬC GIÁ CHUẨN THỊ TRƯỜNG CỐ ĐỊNH)
// =========================================================================
export interface LtlWeightTier {
  id: string;
  rangeLabel: string;
  subLabel: string;
  minKg: number;
  maxKg: number;
  price: number; // VND per Kg or USD per Kg
}

export interface LtlVolumeTier {
  id: string;
  rangeLabel: string;
  subLabel: string;
  minCbm: number;
  maxCbm: number;
  price: number; // VND per CBM or USD per CBM/RT
}

export interface LtlTieredPricingConfig {
  minCharge: number; // Cước tối thiểu (VND or USD)
  pricingBasis: 'weight' | 'volume'; // Đơn vị tính chính
  currency?: 'VND' | 'USD';
  weightTiers: LtlWeightTier[];
  volumeTiers: LtlVolumeTier[];
}

export const DEFAULT_LTL_WEIGHT_TIERS: LtlWeightTier[] = [
  { id: 'w1', rangeLabel: '1 – 50 Kg', subLabel: 'Hàng lẻ kiện nhỏ', minKg: 1, maxKg: 50, price: 2500 },
  { id: 'w2', rangeLabel: '51 – 200 Kg', subLabel: 'Hàng lẻ thông dụng', minKg: 51, maxKg: 200, price: 2000 },
  { id: 'w3', rangeLabel: '201 – 500 Kg', subLabel: 'Hàng sỉ kiện trung', minKg: 201, maxKg: 500, price: 1650 },
  { id: 'w4', rangeLabel: '501 – 1,000 Kg', subLabel: 'Hàng kiện lớn (0.5 – 1T)', minKg: 501, maxKg: 1000, price: 1350 },
  { id: 'w5', rangeLabel: '> 1,000 Kg', subLabel: 'Ghép lô tải nặng (> 1T)', minKg: 1001, maxKg: 999999, price: 1100 },
];

export const DEFAULT_LTL_VOLUME_TIERS: LtlVolumeTier[] = [
  { id: 'v1', rangeLabel: '< 1.0 CBM', subLabel: 'Kiện hàng nhẹ nhỏ', minCbm: 0.1, maxCbm: 1.0, price: 600000 },
  { id: 'v2', rangeLabel: '1.0 – 3.0 CBM', subLabel: 'Ghép thể tích phổ biến', minCbm: 1.0, maxCbm: 3.0, price: 500000 },
  { id: 'v3', rangeLabel: '3.1 – 6.0 CBM', subLabel: 'Kiện cồng kềnh trung', minCbm: 3.1, maxCbm: 6.0, price: 420000 },
  { id: 'v4', rangeLabel: '6.1 – 10.0 CBM', subLabel: 'Lô hàng thể tích lớn', minCbm: 6.1, maxCbm: 10.0, price: 380000 },
  { id: 'v5', rangeLabel: '> 10.0 CBM', subLabel: 'Lô siêu khối tích (> 10 m³)', minCbm: 10.1, maxCbm: 999999, price: 320000 },
];

export const createDefaultLtlPricingConfig = (basis: 'weight' | 'volume' = 'weight', baseKgPrice: number = 2000, baseCbmPrice: number = 500000): LtlTieredPricingConfig => {
  return {
    minCharge: basis === 'weight' ? 100000 : 150000,
    pricingBasis: basis,
    currency: 'VND',
    weightTiers: [
      { id: 'w1', rangeLabel: '1 – 50 Kg', subLabel: 'Hàng lẻ kiện nhỏ', minKg: 1, maxKg: 50, price: Math.round(baseKgPrice * 1.25) },
      { id: 'w2', rangeLabel: '51 – 200 Kg', subLabel: 'Hàng lẻ thông dụng', minKg: 51, maxKg: 200, price: baseKgPrice },
      { id: 'w3', rangeLabel: '201 – 500 Kg', subLabel: 'Hàng sỉ kiện trung', minKg: 201, maxKg: 500, price: Math.round(baseKgPrice * 0.825) },
      { id: 'w4', rangeLabel: '501 – 1,000 Kg', subLabel: 'Hàng kiện lớn (0.5 – 1T)', minKg: 501, maxKg: 1000, price: Math.round(baseKgPrice * 0.675) },
      { id: 'w5', rangeLabel: '> 1,000 Kg', subLabel: 'Ghép lô tải nặng (> 1T)', minKg: 1001, maxKg: 999999, price: Math.round(baseKgPrice * 0.55) },
    ],
    volumeTiers: [
      { id: 'v1', rangeLabel: '< 1.0 CBM', subLabel: 'Kiện hàng nhẹ nhỏ', minCbm: 0.1, maxCbm: 1.0, price: Math.round(baseCbmPrice * 1.2) },
      { id: 'v2', rangeLabel: '1.0 – 3.0 CBM', subLabel: 'Ghép thể tích phổ biến', minCbm: 1.0, maxCbm: 3.0, price: baseCbmPrice },
      { id: 'v3', rangeLabel: '3.1 – 6.0 CBM', subLabel: 'Kiện cồng kềnh trung', minCbm: 3.1, maxCbm: 6.0, price: Math.round(baseCbmPrice * 0.84) },
      { id: 'v4', rangeLabel: '6.1 – 10.0 CBM', subLabel: 'Lô hàng thể tích lớn', minCbm: 6.1, maxCbm: 10.0, price: Math.round(baseCbmPrice * 0.76) },
      { id: 'v5', rangeLabel: '> 10.0 CBM', subLabel: 'Lô siêu khối tích (> 10 m³)', minCbm: 10.1, maxCbm: 999999, price: Math.round(baseCbmPrice * 0.64) },
    ],
  };
};

export const createDefaultLclPricingConfig = (
  basis: 'volume' | 'weight' = 'volume', 
  currency: 'USD' | 'VND' = 'USD', 
  basePrice: number = 25
): LtlTieredPricingConfig => {
  if (currency === 'USD') {
    const baseVal = basePrice > 0 && basePrice < 1000 ? basePrice : 25;
    return {
      minCharge: 25,
      pricingBasis: basis,
      currency: 'USD',
      weightTiers: [
        { id: 'w1', rangeLabel: '< 500 Kg', subLabel: 'Kiện lẻ nhỏ (Min 0.5 Tấn)', minKg: 1, maxKg: 500, price: Math.round(baseVal * 1.4) },
        { id: 'w2', rangeLabel: '501 – 1,000 Kg', subLabel: 'Lô hàng trung (0.5 – 1 Tấn)', minKg: 501, maxKg: 1000, price: baseVal },
        { id: 'w3', rangeLabel: '1,001 – 3,000 Kg', subLabel: 'Lô hàng nặng (1 – 3 Tấn)', minKg: 1001, maxKg: 3000, price: Math.round(baseVal * 0.8) },
        { id: 'w4', rangeLabel: '3,001 – 5,000 Kg', subLabel: 'Lô hàng tải nặng (3 – 5 Tấn)', minKg: 3001, maxKg: 5000, price: Math.round(baseVal * 0.68) },
        { id: 'w5', rangeLabel: '> 5,000 Kg', subLabel: 'Lô siêu trọng (> 5 Tấn)', minKg: 5001, maxKg: 999999, price: Math.round(baseVal * 0.56) },
      ],
      volumeTiers: [
        { id: 'v1', rangeLabel: '< 1.0 CBM / RT', subLabel: 'Kiện hàng lẻ nhỏ (Min 1 CBM)', minCbm: 0.1, maxCbm: 1.0, price: Math.round(baseVal * 1.4) },
        { id: 'v2', rangeLabel: '1.0 – 3.0 CBM / RT', subLabel: 'Lô hàng thể tích tiêu chuẩn', minCbm: 1.0, maxCbm: 3.0, price: baseVal },
        { id: 'v3', rangeLabel: '3.1 – 6.0 CBM / RT', subLabel: 'Lô hàng thể tích trung bình', minCbm: 3.1, maxCbm: 6.0, price: Math.round(baseVal * 0.8) },
        { id: 'v4', rangeLabel: '6.1 – 10.0 CBM / RT', subLabel: 'Lô hàng gom thể tích lớn', minCbm: 6.1, maxCbm: 10.0, price: Math.round(baseVal * 0.68) },
        { id: 'v5', rangeLabel: '> 10.0 CBM / RT', subLabel: 'Lô hàng siêu khối tích (> 10 m³)', minCbm: 10.1, maxCbm: 999999, price: Math.round(baseVal * 0.56) },
      ],
    };
  } else {
    const baseVnd = basePrice >= 1000 ? basePrice : 500000;
    return createDefaultLtlPricingConfig(basis, 2000, baseVnd);
  }
};

export const createDefaultAirPricingConfig = (
  currency: 'USD' | 'VND' = 'USD',
  basePlus100Price: number = 4.2
): LtlTieredPricingConfig => {
  if (currency === 'USD') {
    const baseVal = basePlus100Price > 0 && basePlus100Price < 100 ? basePlus100Price : 4.2;
    return {
      minCharge: 45,
      pricingBasis: 'weight',
      currency: 'USD',
      weightTiers: [
        { id: 'w1', rangeLabel: '-45 Kg', subLabel: 'Hàng lẻ kiện nhỏ (Min Charge)', minKg: 1, maxKg: 44, price: Number((baseVal * 1.38).toFixed(2)) },
        { id: 'w2', rangeLabel: '+45 Kg', subLabel: 'Lô hàng kiện tiêu chuẩn', minKg: 45, maxKg: 99, price: Number((baseVal * 1.14).toFixed(2)) },
        { id: 'w3', rangeLabel: '+100 Kg (Base)', subLabel: 'Mốc giá sàn chuẩn thị trường', minKg: 100, maxKg: 299, price: Number(baseVal.toFixed(2)) },
        { id: 'w4', rangeLabel: '+300 Kg', subLabel: 'Lô hàng sỉ trung bình', minKg: 300, maxKg: 499, price: Number((baseVal * 0.85).toFixed(2)) },
        { id: 'w5', rangeLabel: '+500 Kg', subLabel: 'Lô hàng tải nặng', minKg: 500, maxKg: 999, price: Number((baseVal * 0.76).toFixed(2)) },
        { id: 'w6', rangeLabel: '+1,000 Kg (+1 Ton)', subLabel: 'Lô siêu trọng / Đóng mâm ULD', minKg: 1000, maxKg: 999999, price: Number((baseVal * 0.67).toFixed(2)) },
      ],
      volumeTiers: [],
    };
  } else {
    const baseVnd = basePlus100Price >= 1000 ? basePlus100Price : 105000;
    return {
      minCharge: 1150000,
      pricingBasis: 'weight',
      currency: 'VND',
      weightTiers: [
        { id: 'w1', rangeLabel: '-45 Kg', subLabel: 'Hàng lẻ kiện nhỏ (Min Charge)', minKg: 1, maxKg: 44, price: Math.round(baseVnd * 1.38) },
        { id: 'w2', rangeLabel: '+45 Kg', subLabel: 'Lô hàng kiện tiêu chuẩn', minKg: 45, maxKg: 99, price: Math.round(baseVnd * 1.14) },
        { id: 'w3', rangeLabel: '+100 Kg (Base)', subLabel: 'Mốc giá sàn chuẩn thị trường', minKg: 100, maxKg: 299, price: Math.round(baseVnd) },
        { id: 'w4', rangeLabel: '+300 Kg', subLabel: 'Lô hàng sỉ trung bình', minKg: 300, maxKg: 499, price: Math.round(baseVnd * 0.85) },
        { id: 'w5', rangeLabel: '+500 Kg', subLabel: 'Lô hàng tải nặng', minKg: 500, maxKg: 999, price: Math.round(baseVnd * 0.76) },
        { id: 'w6', rangeLabel: '+1,000 Kg (+1 Ton)', subLabel: 'Lô siêu trọng / Đóng mâm ULD', minKg: 1000, maxKg: 999999, price: Math.round(baseVnd * 0.67) },
      ],
      volumeTiers: [],
    };
  }
};

export const createDefaultExpressPricingConfig = (
  currency: 'USD' | 'VND' = 'USD',
  basePlus45Price: number = 6.5
): LtlTieredPricingConfig => {
  if (currency === 'USD') {
    const baseVal = basePlus45Price > 0 && basePlus45Price < 200 ? basePlus45Price : 6.5;
    return {
      minCharge: 15,
      pricingBasis: 'weight',
      currency: 'USD',
      weightTiers: [
        { id: 'w1', rangeLabel: '1 – 5 Kg', subLabel: 'Kiện chứng từ / Hàng mẫu nhỏ', minKg: 1, maxKg: 5, price: Number((baseVal * 2.15).toFixed(2)) },
        { id: 'w2', rangeLabel: '6 – 20 Kg', subLabel: 'Kiện nhỏ thông dụng', minKg: 6, maxKg: 20, price: Number((baseVal * 1.54).toFixed(2)) },
        { id: 'w3', rangeLabel: '+21 Kg', subLabel: 'Lô hàng thương mại nhẹ', minKg: 21, maxKg: 44, price: Number((baseVal * 1.23).toFixed(2)) },
        { id: 'w4', rangeLabel: '+45 Kg (Base)', subLabel: 'Mốc giá sàn Express chuẩn', minKg: 45, maxKg: 70, price: Number(baseVal.toFixed(2)) },
        { id: 'w5', rangeLabel: '+71 Kg', subLabel: 'Lô hàng kiện lớn', minKg: 71, maxKg: 99, price: Number((baseVal * 0.86).toFixed(2)) },
        { id: 'w6', rangeLabel: '+100 Kg', subLabel: 'Lô sỉ Express số lượng lớn', minKg: 100, maxKg: 999999, price: Number((baseVal * 0.75).toFixed(2)) },
      ],
      volumeTiers: [],
    };
  } else {
    const baseVnd = basePlus45Price >= 1000 ? basePlus45Price : 165000;
    return {
      minCharge: 380000,
      pricingBasis: 'weight',
      currency: 'VND',
      weightTiers: [
        { id: 'w1', rangeLabel: '1 – 5 Kg', subLabel: 'Kiện chứng từ / Hàng mẫu nhỏ', minKg: 1, maxKg: 5, price: Math.round(baseVnd * 2.15) },
        { id: 'w2', rangeLabel: '6 – 20 Kg', subLabel: 'Kiện nhỏ thông dụng', minKg: 6, maxKg: 20, price: Math.round(baseVnd * 1.54) },
        { id: 'w3', rangeLabel: '+21 Kg', subLabel: 'Lô hàng thương mại nhẹ', minKg: 21, maxKg: 44, price: Math.round(baseVnd * 1.23) },
        { id: 'w4', rangeLabel: '+45 Kg (Base)', subLabel: 'Mốc giá sàn Express chuẩn', minKg: 45, maxKg: 70, price: Math.round(baseVnd) },
        { id: 'w5', rangeLabel: '+71 Kg', subLabel: 'Lô hàng kiện lớn', minKg: 71, maxKg: 99, price: Math.round(baseVnd * 0.86) },
        { id: 'w6', rangeLabel: '+100 Kg', subLabel: 'Lô sỉ Express số lượng lớn', minKg: 100, maxKg: 999999, price: Math.round(baseVnd * 0.75) },
      ],
      volumeTiers: [],
    };
  }
};

export interface TieredPricingModalData {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  currency: 'VND' | 'USD';
  isLcl?: boolean;
  isAirCargo?: boolean;
  isExpress?: boolean;
  isRailLcl?: boolean;
  pricingConfig: LtlTieredPricingConfig;
}

export const TRANSIT_TYPE_LOV = [
  { value: 'Direct', label: 'Direct (Đi thẳng)' },
  { value: 'Transit', label: 'Transit (Chuyển tải)' },
];

export const FREE_DEM_DET_LOV = [
  { value: 7, label: '7 Ngày (Chuẩn hãng tàu)' },
  { value: 10, label: '10 Ngày' },
  { value: 14, label: '14 Ngày (Khuyên dùng)' },
  { value: 21, label: '21 Ngày' },
  { value: 28, label: '28 Ngày' },
  { value: 0, label: 'Khác (Nhập ngày)...' },
];

export const USD_TO_VND_EXCHANGE_RATE = 25400; // Tỷ giá tham chiếu USD / VND quy đổi tức thì

export const TRUCKING_BODY_TYPES = [
  'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]',
  'Xe Tải Mui Bạt (Tarpaulin Truck) - [Mở bạt 2 bên hông]',
  'Xe Tải Có Bửng Nâng Thủy Lực (Tail-lift) - [Bửng nâng tự động]',
  'Xe Tải Thùng Lửng / Mooc Sàn (Flatbed) - [Cẩu hạ từ trên nóc]',
  'Đầu Kéo Kéo Container (Tractor Drayage) - [Kéo vỏ Cont Cảng / ICD]',
  'Khác (Nhập tùy chọn)...',
];

export const TRUCKING_BODY_TYPE_MAP: Record<string, string[]> = {
  'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]': [
    '1.0T – 1.9T (Vào phố ban ngày) —— (7 – 9 CBM)',
    '2.5T – 3.5T (Tải nhẹ liên tỉnh) —— (14 – 16 CBM)',
    '5.0T – 6.5T (Tải trung) —— (25 – 30 CBM)',
    '8.0T (Tải nặng 2 chân) —— (45 – 50 CBM)',
    '15.0T (Tải nặng 3 chân) —— (55 – 60 CBM)',
  ],
  'Xe Tải Mui Bạt (Tarpaulin Truck) - [Mở bạt 2 bên hông]': [
    '2.5T – 3.5T (Mui bạt tiêu chuẩn) —— (~15 CBM)',
    '5.0T – 7.0T (Mui bạt trung) —— (~32 CBM)',
    '8.0T – 9.0T (2 chân thùng dài 9.8m cồng kềnh) —— (~55 CBM)',
    '15.0T (3 chân mui bạt) —— (~58 CBM)',
    '18.0T – 20.0T (4 chân - 5 chân tải nặng) —— (~65 CBM)',
  ],
  'Xe Tải Có Bửng Nâng Thủy Lực (Tail-lift) - [Bửng nâng tự động]': [
    '1.9T – 2.5T (Bửng nâng tải 500kg) —— (9 – 12 CBM)',
    '5.0T (Bửng nâng tải 1.0T – 1.5T) —— (~26 CBM)',
    '8.0T – 15.0T (Bửng nâng tải nặng 2.0T) —— (45 – 55 CBM)',
  ],
  'Xe Tải Thùng Lửng / Mooc Sàn (Flatbed) - [Cẩu hạ từ trên nóc]': [
    '5.0T – 8.0T (Thùng lửng cẩu hàng) —— (Không giới hạn nóc)',
    '15.0T (Thùng lửng 3 chân) —— (Không giới hạn nóc)',
  ],
  'Đầu Kéo Kéo Container (Tractor Drayage) - [Kéo vỏ Cont Cảng / ICD]': [
    'Đầu kéo + Rơ-mooc 20ft (Tải trọng 26 - 28 Tấn) —— (~33 CBM)',
    'Đầu kéo + Rơ-mooc 40ft (Xương / Cổ cò - Tải trọng 28 - 30 Tấn) —— (~67 CBM)',
    'Đầu kéo + Rơ-mooc 45ft High Cube —— (~85 CBM)',
  ],
};

export const ALL_DEFAULT_TRUCKING_TONNAGES = [
  '1.0T – 1.9T (Vào phố ban ngày) —— (7 – 9 CBM)',
  '2.5T – 3.5T (Tải nhẹ liên tỉnh) —— (14 – 16 CBM)',
  '5.0T – 6.5T (Tải trung) —— (25 – 30 CBM)',
  '8.0T (Tải nặng 2 chân) —— (45 – 50 CBM)',
  '15.0T (Tải nặng 3 chân) —— (55 – 60 CBM)',
  '18.0T – 20.0T (4 chân - 5 chân tải nặng) —— (~65 CBM)',
  'Đầu kéo + Rơ-mooc 20ft (Tải trọng 26 - 28 Tấn) —— (~33 CBM)',
  'Đầu kéo + Rơ-mooc 40ft (Xương / Cổ cò - Tải trọng 28 - 30 Tấn) —— (~67 CBM)',
  'Đầu kéo + Rơ-mooc 45ft High Cube —— (~85 CBM)',
];

// REEFER (HÀNG LẠNH) TRUCK BODY TYPES & TONNAGES (ĐỒNG BỘ 100% VỚI MÀN HÌNH ĐĂNG NHU CẦU CUSTOMER)
export const REEFER_TRUCKING_BODY_TYPES = [
  'Xe Tải Thùng Đông Lạnh Nhỏ (City Reefer) - [Vào phố / Giao siêu thị]',
  'Xe Tải Thùng Đông Lạnh Trung (Regional Reefer) - [Giàn lạnh Thermo King]',
  'Xe Tải Đông Lạnh Tải Nặng 3 Chân (Long-haul Reefer) - [Trục Bắc Nam / 16-18 Pallets]',
  'Đầu Kéo Kéo Container Lạnh (Reefer Drayage) - [Cont 20RF / 40RF + Genset]',
  'Khác (Nhập tùy chọn)...',
];

export const REEFER_TRUCKING_BODY_TYPE_MAP: Record<string, string[]> = {
  'Xe Tải Thùng Đông Lạnh Nhỏ (City Reefer) - [Vào phố / Giao siêu thị]': [
    '1.0T – 1.4T (Vào phố ban ngày) —— (6 – 7 CBM)',
    '1.9T – 2.4T (Thùng lạnh 3-4 Pallets) —— (9 – 11 CBM)',
  ],
  'Xe Tải Thùng Đông Lạnh Trung (Regional Reefer) - [Giàn lạnh Thermo King]': [
    '3.5T (Thùng dài 4.3m – 5.2m) —— (15 – 18 CBM)',
    '5.0T – 6.5T (Thùng dài 5.8m – 6.2m) —— (24 – 28 CBM)',
  ],
  'Xe Tải Đông Lạnh Tải Nặng 3 Chân (Long-haul Reefer) - [Trục Bắc Nam / 16-18 Pallets]': [
    '12.0T – 15.0T (3 Chân thùng dài 9.2m – 9.6m) —— (48 – 54 CBM)',
  ],
  'Đầu Kéo Kéo Container Lạnh (Reefer Drayage) - [Cont 20RF / 40RF + Genset]': [
    'Đầu kéo + Cont 20RF Lạnh (22 – 24 Tấn) —— (~28 CBM)',
    'Đầu kéo + Cont 40RF / 40RH Cao Lạnh (26 – 28 Tấn) —— (~67 CBM)',
  ],
};

export const ALL_DEFAULT_REEFER_TONNAGES = [
  '1.0T – 1.4T (Vào phố ban ngày) —— (6 – 7 CBM)',
  '1.9T – 2.4T (Thùng lạnh 3-4 Pallets) —— (9 – 11 CBM)',
  '3.5T (Thùng dài 4.3m – 5.2m) —— (15 – 18 CBM)',
  '5.0T – 6.5T (Thùng dài 5.8m – 6.2m) —— (24 – 28 CBM)',
  '12.0T – 15.0T (3 Chân thùng dài 9.2m – 9.6m) —— (48 – 54 CBM)',
  'Đầu kéo + Cont 20RF Lạnh (22 – 24 Tấn) —— (~28 CBM)',
  'Đầu kéo + Cont 40RF / 40RH Cao Lạnh (26 – 28 Tấn) —— (~67 CBM)',
];

// HAZMAT (HÀNG NGUY HIỂM / DG) TRUCK BODY TYPES & TONNAGES (ĐỒNG BỘ 100% VỚI MÀN HÌNH ĐĂNG NHU CẦU CUSTOMER)
export const HAZMAT_TRUCKING_BODY_TYPES = [
  'Xe Tải Thùng Kín Chuyên Dụng Hóa Chất (DG Dry Box) - [Sàn chống tĩnh điện / Tiếp địa]',
  'Xe Bồn Xitec Chuyên Dụng (Chemical Tanker) - [Bồn Inox 316L / Chống tràn]',
  'Đầu Kéo Kéo Bồn ISO Tank / Cont Hóa Chất (Hazmat Drayage) - [ISO Tank T11/T75 Quốc tế]',
  'Khác (Nhập tùy chọn)...',
];

export const HAZMAT_TRUCKING_BODY_TYPE_MAP: Record<string, string[]> = {
  'Xe Tải Thùng Kín Chuyên Dụng Hóa Chất (DG Dry Box) - [Sàn chống tĩnh điện / Tiếp địa]': [
    '1.9T – 3.5T (Hóa chất nội đô) —— (12 – 15 CBM)',
    '5.0T – 8.0T (Hóa chất liên tỉnh) —— (28 – 40 CBM)',
    '15.0T (3 Chân chở phuy / IBC Tank) —— (50 – 55 CBM)',
  ],
  'Xe Bồn Xitec Chuyên Dụng (Chemical Tanker) - [Bồn Inox 316L / Chống tràn]': [
    '10.000 Lít – 18.000 Lít (Bồn 3-4 ngăn) —— (10 – 18 m³)',
    '25.000 Lít – 32.000 Lít (Mooc bồn Axit/Kiềm) —— (25 – 32 m³)',
  ],
  'Đầu Kéo Kéo Bồn ISO Tank / Cont Hóa Chất (Hazmat Drayage) - [ISO Tank T11/T75 Quốc tế]': [
    'Đầu kéo + Bồn ISO Tank 20ft (T11 / T50 / T75) —— (24.000 – 26.000 Lít)',
    'Đầu kéo + Cont 20ft / 40ft chở hàng đóng phuy —— (33 – 67 CBM)',
  ],
};

export const ALL_DEFAULT_HAZMAT_TONNAGES = [
  '1.9T – 3.5T (Hóa chất nội đô) —— (12 – 15 CBM)',
  '5.0T – 8.0T (Hóa chất liên tỉnh) —— (28 – 40 CBM)',
  '15.0T (3 Chân chở phuy / IBC Tank) —— (50 – 55 CBM)',
  '10.000 Lít – 18.000 Lít (Bồn 3-4 ngăn) —— (10 – 18 m³)',
  '25.000 Lít – 32.000 Lít (Mooc bồn Axit/Kiềm) —— (25 – 32 m³)',
  'Đầu kéo + Bồn ISO Tank 20ft (T11 / T50 / T75) —— (24.000 – 26.000 Lít)',
  'Đầu kéo + Cont 20ft / 40ft chở hàng đóng phuy —— (33 – 67 CBM)',
];

// LTL (GHÉP HÀNG LẺ) TRUCK BODY TYPES & TONNAGES (ĐỒNG BỘ 100% VỚI MÀN HÌNH ĐĂNG NHU CẦU CUSTOMER)
export const LTL_TRUCKING_BODY_TYPES = [
  'Xe Thùng Kín Chuyên Tuyến Ghép LTL',
  'Xe Mui Bạt Trục Bắc - Nam (Ghép Hàng Thể Tích)',
  'Khác (Nhập tùy chọn)...',
];

export const LTL_TRUCKING_BODY_TYPE_MAP: Record<string, string[]> = {
  'Xe Thùng Kín Chuyên Tuyến Ghép LTL': [
    '5.0T – 6.5T (Trung chuyển liên tỉnh / Hub vệ tinh) —— (25 – 30 CBM)',
    '8.0T – 9.0T (2 Chân thùng dài ghép tuyến) —— (45 – 50 CBM)',
    '15.0T (3 Chân thùng kín chạy tuyến cố định) —— (55 – 60 CBM)',
    'Đầu Kéo + Cont 40ft/45ft HC (Ghép tuyến Bắc - Nam) —— (70 – 85 CBM)',
  ],
  'Xe Mui Bạt Trục Bắc - Nam (Ghép Hàng Thể Tích)': [
    '8.0T – 9.0T (2 Chân thùng dài 9.8m ghép hàng cồng kềnh) —— (~55 CBM)',
    '15.0T (3 Chân mui bạt mở hông) —— (~58 CBM)',
    '18.0T – 20.0T (4 Chân - 5 Chân tải nặng ghép máy móc / hàng dài) —— (~65 CBM)',
    'Đầu Kéo + Rơ-mooc lồng mui bạt (Ghép siêu khối tích) —— (~75 – 85 CBM)',
  ],
};

export const ALL_DEFAULT_LTL_TONNAGES = [
  '5.0T – 6.5T (Trung chuyển liên tỉnh / Hub vệ tinh) —— (25 – 30 CBM)',
  '8.0T – 9.0T (2 Chân thùng dài ghép tuyến) —— (45 – 50 CBM)',
  '15.0T (3 Chân thùng kín chạy tuyến cố định) —— (55 – 60 CBM)',
  '18.0T – 20.0T (4 Chân - 5 Chân tải nặng ghép máy móc / hàng dài) —— (~65 CBM)',
  'Đầu Kéo + Cont 40ft/45ft HC (Ghép tuyến Bắc - Nam) —— (70 – 85 CBM)',
  'Đầu Kéo + Rơ-mooc lồng mui bạt (Ghép siêu khối tích) —— (~75 – 85 CBM)',
];

export const CUSTOMS_BRANCHES_LOV = [
  'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
  'Chi cục HQ Cửa khẩu Sân bay Quốc tế Tân Sơn Nhất',
  'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV4 (ICD Phước Long / Transimex)',
  'Chi cục HQ Cửa khẩu Cảng Hiệp Phước (TP.HCM)',
  'Chi cục HQ Cửa khẩu Cảng Cái Mép (Bà Rịa - Vũng Tàu)',
  'Chi cục HQ Quản lý Hàng Đầu tư Gia công (TP.HCM)',
  'Chi cục HQ KCN VSIP (Bình Dương)',
  'Chi cục HQ KCN Sóng Thần (Bình Dương)',
  'Chi cục HQ Long Thành / Nhơn Trạch (Đồng Nai)',
  'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV1 (Cảng Hoàng Diệu)',
  'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Cảng Đình Vũ / Nam Hải Đình Vũ)',
  'Chi cục HQ Cửa khẩu Cảng Đình Vũ (Hải Phòng)',
  'Chi cục HQ Cửa khẩu Cảng Lạch Huyện (Hải Phòng - TC-HICT)',
  'Chi cục HQ Cửa khẩu Sân bay Quốc tế Nội Bài (Hà Nội)',
  'Chi cục HQ Quản lý Hàng Đầu tư Gia công (Hà Nội)',
  'Chi cục HQ KCN Tiên Sơn / Yên Phong (Bắc Ninh)',
  'Chi cục HQ KCN Thái Nguyên (Samsung Thái Nguyên)',
  'Chi cục HQ Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)',
  'Chi cục HQ Cửa khẩu Quốc tế Móng Cái (Quảng Ninh)',
  'Chi cục HQ Cửa khẩu Quốc tế Tân Thanh (Lạng Sơn)',
  'Chi cục HQ Cửa khẩu Quốc tế Mộc Bài (Tây Ninh)',
  'Chi cục HQ Cửa khẩu Quốc tế Hoa Lư (Bình Phước)',
  'Khác (Nhập tùy chọn)...',
];

export const CUSTOMS_DECLARATION_TYPES_LOV = [
  'Tất cả loại hình (A11, E21, E31, B11...)',
  'Nhập khẩu kinh doanh (A11, A12)',
  'Xuất khẩu kinh doanh (B11, B12, B13)',
  'Nhập nguyên liệu gia công (E21)',
  'Xuất sản phẩm gia công (E52)',
  'Nhập nguyên liệu SXXK (E31)',
  'Xuất sản phẩm SXXK (E62)',
  'Doanh nghiệp chế xuất EPE (E11, E15, E42)',
  'Tạm nhập tái xuất (G11, G21)',
  'Phi mậu dịch (H11, H21)',
  'Khác (Nhập tùy chọn)...',
];

export const CUSTOMS_SERVICE_FORMS_LOV = [
  'Đại lý Hải quan chính thức',
  'Khai thuê dịch vụ',
];

export const FULFILLMENT_WAREHOUSE_SUGGESTED_SURCHARGES = [
  { code: 'FUL-SCH-01', name: 'Phí bốc dỡ & kiểm đếm hàng nhập kho chi tiết (Inbound Receiving & QC)', category: 'Nhập Kho & Kiểm Đếm', unit: 'SKU', defaultPrice: '500 ₫ / SKU', isFree: false },
  { code: 'FUL-SCH-02', name: 'Phí nhặt hàng & đóng gói đơn hàng chuẩn (Pick & Pack Base Order)', category: 'Xử Lý Đơn Hàng', unit: 'Đơn hàng', defaultPrice: '8,500 ₫ / Đơn', isFree: false },
  { code: 'FUL-SCH-03', name: 'Phí thêm sản phẩm trong cùng 1 đơn (Extra Item / SKU)', category: 'Xử Lý Đơn Hàng', unit: 'Sản phẩm', defaultPrice: '1,500 ₫ / Item', isFree: false },
  { code: 'FUL-SCH-04', name: 'Phí xử lý & phân loại hàng hoàn trả (Reverse Logistics Return)', category: 'Xử Lý Hàng Hoàn', unit: 'Đơn hoàn', defaultPrice: '5,000 ₫ / Đơn hoàn', isFree: false },
  { code: 'FUL-SCH-05', name: 'Phí đóng thùng carton kích thước lớn (Carton Box L/XL)', category: 'Vật Tư Đóng Gói', unit: 'Hộp', defaultPrice: '4,000 ₫ / Hộp', isFree: false },
  { code: 'FUL-SCH-06', name: 'Phí quấn xốp nổ bóng khí (Bubble wrap) chống sốc hàng dễ vỡ', category: 'Vật Tư Đóng Gói', unit: 'Sản phẩm', defaultPrice: '2,500 ₫ / Món', isFree: false },
  { code: 'FUL-SCH-07', name: 'Phí dán tem Barcode / Serial phụ cho từng SKU', category: 'Tem Nhãn & Mã Vạch', unit: 'Tem', defaultPrice: '300 ₫ / Tem', isFree: false },
  { code: 'FUL-SCH-08', name: 'Phí chèn thiệp cảm ơn, voucher & tờ rơi quảng cáo combo', category: 'Quà Tặng & Combo', unit: 'Đơn hàng', defaultPrice: '500 ₫ / Đơn', isFree: true },
  { code: 'FUL-SCH-09', name: 'Phí lưu kho đệm vượt định mức (Overstay Buffer Storage)', category: 'Lưu Trữ Đệm', unit: 'Pallet / Tháng', defaultPrice: '120,000 ₫ / Pallet', isFree: false },
  { code: 'FUL-SCH-10', name: 'Phí xử lý đơn hỏa tốc ngoài giờ cắt ca (Urgent Cut-off Surcharge)', category: 'Vận Hành Hỏa Tốc', unit: 'Đơn hàng', defaultPrice: '3,000 ₫ / Đơn', isFree: false },
];

export const FULFILLMENT_WAREHOUSE_SUGGESTED_VAS = [
  { code: 'FUL-VAS-01', name: 'Đồng bộ API tự động với sàn Shopee, TikTok Shop, Lazada, Tiki', category: 'Tích Hợp Sàn TMĐT', unit: 'Hệ thống', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'FUL-VAS-02', name: 'In phiếu giao hàng (Packing Slip), tem vận chuyển bưu tá tự động', category: 'In Ấn & Tem Vận Đơn', unit: 'Đơn hàng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'FUL-VAS-03', name: 'Bảo hiểm mất mát, thất thoát hàng hóa trong kho 100%', category: 'Bảo Hiểm & An Ninh', unit: '% Giá trị hàng', defaultPrice: '0.05% Giá trị hàng', isFree: true },
  { code: 'FUL-VAS-04', name: 'Kitting combo / Đóng set quà tặng thương hiệu (Custom Gift Set)', category: 'Kitting & Set Quà', unit: 'Set', defaultPrice: '5,000 ₫ / Set', isFree: false },
  { code: 'FUL-VAS-05', name: 'Dán băng keo in logo / Niêm phong thương hiệu riêng của Shop', category: 'Đóng Gói Thương Hiệu', unit: 'Đơn hàng', defaultPrice: '1,000 ₫ / Đơn', isFree: false },
  { code: 'FUL-VAS-06', name: 'Kiểm tra ngoại quan, chụp ảnh bằng chứng hàng hoàn trả khiếu nại', category: 'Xử Lý Hàng Hoàn', unit: 'Đơn hoàn', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'FUL-VAS-07', name: 'Lưu trữ & trích xuất camera bàn đóng gói hỗ trợ đối soát khiếu nại sàn', category: 'Đối Soát & CCTV', unit: 'Vụ việc', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'FUL-VAS-08', name: 'Cập nhật số tồn kho thực tế (Sync Stock) 24/7 chống bán vượt tồn (Overselling)', category: 'Quản Lý Tồn Kho', unit: 'Tài khoản', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'FUL-VAS-09', name: 'Bàn giao đơn hỏa tốc cho Shipper / ĐVVC lấy hàng 4 khung giờ/ngày', category: 'Bàn Giao Vận Chuyển', unit: 'Khung giờ', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'FUL-VAS-10', name: 'Báo cáo hiệu suất hoàn tất đơn hàng & tỷ lệ trả hàng (KPI SLA Report)', category: 'Báo Cáo & Phân Tích', unit: 'Tháng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
];

export const WAREHOUSE_SUGGESTED_SURCHARGES = [
  { code: 'WH-SCH-01', name: 'Phí nâng hạ & dỡ hàng nhập kho (Inbound)', category: 'Bốc Xếp & Vận Hành', unit: 'Pallet', defaultPrice: '35,000 ₫ / Pallet', isFree: false },
  { code: 'WH-SCH-02', name: 'Phí lấy hàng & bốc xếp xuất kho (Outbound)', category: 'Bốc Xếp & Vận Hành', unit: 'Pallet', defaultPrice: '35,000 ₫ / Pallet', isFree: false },
  { code: 'WH-SCH-03', name: 'Phí rút ruột container 20ft bằng xe nâng', category: 'Rút / Đóng Cont', unit: 'Cont 20ft', defaultPrice: '700,000 ₫ / Cont', isFree: false },
  { code: 'WH-SCH-04', name: 'Phí rút ruột container 40ft thủ công & lên Pallet', category: 'Rút / Đóng Cont', unit: 'Cont 40ft', defaultPrice: '1,200,000 ₫ / Cont', isFree: false },
  { code: 'WH-SCH-05', name: 'Phí đóng hàng vào container (Stuffing)', category: 'Rút / Đóng Cont', unit: 'Cont 40ft', defaultPrice: '1,300,000 ₫ / Cont', isFree: false },
  { code: 'WH-SCH-06', name: 'Phí kiểm đếm chi tiết từng SKU lẻ', category: 'Kiểm Đếm & Phân Loại', unit: 'SKU', defaultPrice: '500 ₫ / SKU', isFree: false },
  { code: 'WH-SCH-07', name: 'Phí làm việc ngoài giờ hành chính (Overtime)', category: 'Vận Hành Ngoài Giờ', unit: 'Giờ', defaultPrice: '200,000 ₫ / Giờ', isFree: false },
  { code: 'WH-SCH-08', name: 'Phí lưu bãi xe container chờ dỡ (sau 2h free)', category: 'Bãi Xe & Lưu Ca', unit: 'Xe / Giờ', defaultPrice: '100,000 ₫ / Giờ', isFree: false },
  { code: 'WH-SCH-09', name: 'Phí phân loại hàng theo PO / Hóa đơn', category: 'Kiểm Đếm & Phân Loại', unit: 'Kiện', defaultPrice: '2,000 ₫ / Kiện', isFree: false },
  { code: 'WH-SCH-10', name: 'Phí vận hành ngày Lễ / Tết / Chủ nhật', category: 'Vận Hành Ngoài Giờ', unit: 'Lô hàng', defaultPrice: '500,000 ₫ / Lô', isFree: false },
  { code: 'WH-SCH-11', name: 'Phí hủy kiện rác thải & xử lý pallet hỏng', category: 'Dịch Vụ Khác', unit: 'Pallet', defaultPrice: '25,000 ₫ / Pallet', isFree: false },
];

export const COLD_WAREHOUSE_SUGGESTED_SURCHARGES = [
  { code: 'COLD-SCH-01', name: 'Phí nâng hạ & dỡ hàng vào buồng lạnh (Inbound)', category: 'Bốc Xếp Kho Lạnh', unit: 'Pallet', defaultPrice: '45,000 ₫ / Pallet', isFree: false },
  { code: 'COLD-SCH-02', name: 'Phí lấy hàng & soạn đơn xuất buồng lạnh (Outbound)', category: 'Bốc Xếp Kho Lạnh', unit: 'Pallet', defaultPrice: '45,000 ₫ / Pallet', isFree: false },
  { code: 'COLD-SCH-03', name: 'Phí cắm điện container lạnh tại bãi (Reefer Plug-in & PTI)', category: 'Bãi Xe Cont Lạnh', unit: 'Giờ', defaultPrice: '85,000 ₫ / Giờ', isFree: false },
  { code: 'COLD-SCH-04', name: 'Phí kiểm tra & đo nhiệt độ lõi sản phẩm (Core Temp Check)', category: 'Kiểm Định ATTP', unit: 'Lô', defaultPrice: '150,000 ₫ / Lô', isFree: false },
  { code: 'COLD-SCH-05', name: 'Phí bọc màng co cách nhiệt & bảo ôn Pallet (Thermal Wrap)', category: 'Đóng Gói Bảo Ôn', unit: 'Pallet', defaultPrice: '65,000 ₫ / Pallet', isFree: false },
  { code: 'COLD-SCH-06', name: 'Phí rút ruột container lạnh 40ft RF vào phòng đệm Antechamber', category: 'Rút / Đóng Cont Lạnh', unit: 'Cont 40ft', defaultPrice: '1,600,000 ₫ / Cont', isFree: false },
  { code: 'COLD-SCH-07', name: 'Phí làm việc ngoài giờ trong buồng lạnh (Cold Overtime)', category: 'Vận Hành Ngoài Giờ', unit: 'Giờ', defaultPrice: '300,000 ₫ / Giờ', isFree: false },
  { code: 'COLD-SCH-08', name: 'Phí cấp điện máy phát điện dự phòng ATS khi mất điện lưới', category: 'Năng Lượng Dự Phòng', unit: 'Giờ', defaultPrice: '150,000 ₫ / Giờ', isFree: false },
  { code: 'COLD-SCH-09', name: 'Phí xả đá & làm sạch buồng lạnh chuyên sâu theo yêu cầu', category: 'Vệ Sinh & Khử Khuẩn', unit: 'Lần', defaultPrice: '800,000 ₫ / Lần', isFree: false },
  { code: 'COLD-SCH-10', name: 'Phí cấp chứng thư nhiệt độ lưu kho theo lô (Temperature Log Certificate)', category: 'Kiểm Định ATTP', unit: 'Bộ chứng từ', defaultPrice: '100,000 ₫ / Bộ', isFree: false },
];

export const HAZMAT_WAREHOUSE_SUGGESTED_SURCHARGES = [
  { code: 'HAZ-SCH-01', name: 'Phí nâng hạ & tiếp nhận hàng hóa chất nguy hiểm (Inbound DG)', category: 'Bốc Xếp Hóa Chất', unit: 'Pallet', defaultPrice: '65,000 ₫ / Pallet', isFree: false },
  { code: 'HAZ-SCH-02', name: 'Phí bốc xếp & xuất kho hóa chất nguy hiểm (Outbound DG)', category: 'Bốc Xếp Hóa Chất', unit: 'Pallet', defaultPrice: '65,000 ₫ / Pallet', isFree: false },
  { code: 'HAZ-SCH-03', name: 'Phí bốc xếp bằng xe nâng chống cháy nổ (Ex-proof forklift)', category: 'Thiết Bị Chuyên Dụng', unit: 'Pallet', defaultPrice: '80,000 ₫ / Pallet', isFree: false },
  { code: 'HAZ-SCH-04', name: 'Phí kiểm tra rò rỉ, áp suất van & niêm phong bồn chứa', category: 'An Toàn & Kỹ Thuật', unit: 'Kiện', defaultPrice: '50,000 ₫ / Kiện', isFree: false },
  { code: 'HAZ-SCH-05', name: 'Phí ứng trực thiết bị ứng phó sự cố tràn đổ (Spill Kit Response)', category: 'An Toàn Môi Trường', unit: 'Lô', defaultPrice: '350,000 ₫ / Lô', isFree: false },
  { code: 'HAZ-SCH-06', name: 'Phí thẩm định hồ sơ kỹ thuật & phiếu an toàn hóa chất (MSDS Audit)', category: 'Hồ Sơ Pháp Lý', unit: 'SKU', defaultPrice: '250,000 ₫ / SKU', isFree: false },
  { code: 'HAZ-SCH-07', name: 'Phí rút ruột container hóa chất phuy/IBC Tank kẹp chuyên dụng', category: 'Rút Cont Nguy Hiểm', unit: 'Cont', defaultPrice: '1,800,000 ₫ / Cont', isFree: false },
  { code: 'HAZ-SCH-08', name: 'Phí trung hòa dung dịch rò rỉ & xử lý chất thải nguy hại', category: 'An Toàn Môi Trường', unit: 'Lần xử lý', defaultPrice: '1,200,000 ₫ / Lần', isFree: false },
  { code: 'HAZ-SCH-09', name: 'Phí đo nồng độ khí cháy & hơi độc định kỳ trong kho', category: 'Quan Trắc Khí Độc', unit: 'Lần đo', defaultPrice: '500,000 ₫ / Lần', isFree: false },
  { code: 'HAZ-SCH-10', name: 'Phí bốc dỡ hàng nguy hiểm ngoài giờ có giám sát an toàn viên', category: 'Vận Hành Ngoài Giờ', unit: 'Giờ', defaultPrice: '400,000 ₫ / Giờ', isFree: false },
];

export const WAREHOUSE_SUGGESTED_VAS = [
  { code: 'WH-VAS-01', name: 'Dán tem phụ tiếng Việt / Barcode SKU', category: 'Tem Nhãn & Barcode', unit: 'Tem', defaultPrice: '400 ₫ / Tem', isFree: false },
  { code: 'WH-VAS-02', name: 'Quấn màng co PE Pallet & Đóng đai bảo vệ', category: 'Đóng Gói & Xử Lý', unit: 'Pallet', defaultPrice: '35,000 ₫ / Pallet', isFree: false },
  { code: 'WH-VAS-03', name: 'Đóng thùng carton kitting combo / Hộp quà', category: 'Đóng Gói & Xử Lý', unit: 'Hộp', defaultPrice: '5,000 ₫ / Hộp', isFree: false },
  { code: 'WH-VAS-04', name: 'Bảo hiểm cháy nổ tài sản kho bãi 100%', category: 'Bảo Hiểm & An Ninh', unit: '% Giá trị hàng', defaultPrice: '0.05% Giá trị hàng', isFree: true },
  { code: 'WH-VAS-05', name: 'Chụp ảnh nghiệm thu tình trạng hàng xuất nhập', category: 'Kiểm Định & QC', unit: 'Lô hàng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'WH-VAS-06', name: 'Hun trùng kiểm dịch Pallet gỗ xuất khẩu (ISPM 15)', category: 'Đóng Gói & Xử Lý', unit: 'Pallet', defaultPrice: '25,000 ₫ / Pallet', isFree: false },
  { code: 'WH-VAS-07', name: 'Đóng kiện gỗ nan / kiện gỗ kín bảo vệ hàng dễ vỡ', category: 'Đóng Gói & Xử Lý', unit: 'Kiện', defaultPrice: '180,000 ₫ / Kiện', isFree: false },
  { code: 'WH-VAS-08', name: 'Kiểm tra chất lượng & Đếm ngoại quan chi tiết (AQL)', category: 'Kiểm Định & QC', unit: 'Kiện', defaultPrice: '1,500 ₫ / Kiện', isFree: false },
  { code: 'WH-VAS-09', name: 'In phiếu giao hàng (Packing List) & Bàn giao e-POD', category: 'Tem Nhãn & Barcode', unit: 'Bộ chứng từ', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'WH-VAS-10', name: 'Bảo quản nhiệt độ điều hòa mát (+18°C ~ +25°C)', category: 'Bảo Quản & Nhiệt Độ', unit: 'Pallet / Tháng', defaultPrice: '45,000 ₫ / Pallet', isFree: false },
];

export const COLD_WAREHOUSE_SUGGESTED_VAS = [
  { code: 'COLD-VAS-01', name: 'Dán tem nhãn chịu nhiệt âm sâu không bong tróc (Freezer Label)', category: 'Tem Nhãn Kho Lạnh', unit: 'Tem', defaultPrice: '600 ₫ / Tem', isFree: false },
  { code: 'COLD-VAS-02', name: 'Thay túi đá gel bảo ôn & đá khô CO2 cho thùng hàng xuất khẩu', category: 'Bảo Ôn Đóng Gói', unit: 'Hộp', defaultPrice: '12,000 ₫ / Hộp', isFree: false },
  { code: 'COLD-VAS-03', name: 'Quấn bọc màng bạc cách nhiệt Pallet (Thermal Foil Blanket)', category: 'Bảo Ôn Đóng Gói', unit: 'Pallet', defaultPrice: '75,000 ₫ / Pallet', isFree: false },
  { code: 'COLD-VAS-04', name: 'Bảo hiểm suy giảm phẩm chất hàng do lỗi nhiệt độ 100%', category: 'Bảo Hiểm Chuỗi Lạnh', unit: '% Giá trị hàng', defaultPrice: '0.08% Giá trị hàng', isFree: true },
  { code: 'COLD-VAS-05', name: 'Chụp ảnh nghiệm thu nhiệt độ và ngoại quan hàng xuất nhập', category: 'Kiểm Định & QC', unit: 'Lô hàng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'COLD-VAS-06', name: 'Cung cấp thiết bị ghi nhiệt độ tự động USB Data Logger dùng 1 lần', category: 'Thiết Bị Giám Sát', unit: 'Thiết bị', defaultPrice: '120,000 ₫ / Cái', isFree: false },
  { code: 'COLD-VAS-07', name: 'Phân loại, cân trọng lượng & kitting hàng đông lạnh theo đơn', category: 'Sơ Chế & Phân Loại', unit: 'Kg', defaultPrice: '1,800 ₫ / Kg', isFree: false },
  { code: 'COLD-VAS-08', name: 'Cấp đông nhanh buồng gió (Blast Freezing) hạ nhiệt khẩn cấp', category: 'Cấp Đông Cưỡng Bức', unit: 'Tấn', defaultPrice: '600,000 ₫ / Tấn', isFree: false },
  { code: 'COLD-VAS-09', name: 'Đóng thùng xốp EPS giữ nhiệt xuất buồng lạnh', category: 'Bảo Ôn Đóng Gói', unit: 'Thùng', defaultPrice: '35,000 ₫ / Thùng', isFree: false },
  { code: 'COLD-VAS-10', name: 'Trích xuất biểu đồ nhiệt độ liên tục thời gian thực (Real-time IoT)', category: 'Dữ Liệu & Báo Cáo', unit: 'Lô hàng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
];

export const HAZMAT_WAREHOUSE_SUGGESTED_VAS = [
  { code: 'HAZ-VAS-01', name: 'Dán nhãn cảnh báo nguy hiểm GHS / UN DG Diamond chịu hóa chất', category: 'Nhãn Cảnh Báo Nguy Hiểm', unit: 'Tem', defaultPrice: '1,200 ₫ / Tem', isFree: false },
  { code: 'HAZ-VAS-02', name: 'Cung cấp pallet chống tràn dung dịch (Spill Containment Pallet)', category: 'Vật Tư Chống Tràn', unit: 'Pallet / Tháng', defaultPrice: '350,000 ₫ / Pallet', isFree: false },
  { code: 'HAZ-VAS-03', name: 'Kẹp chì niêm phong an toàn chống giả mạo van bồn hóa chất', category: 'Niêm Phong An Ninh', unit: 'Seal chì', defaultPrice: '25,000 ₫ / Seal', isFree: false },
  { code: 'HAZ-VAS-04', name: 'Bảo hiểm trách nhiệm ô nhiễm môi trường & bên thứ ba 100%', category: 'Bảo Hiểm Trách Nhiệm', unit: '% Giá trị hàng', defaultPrice: '0.12% Giá trị hàng', isFree: true },
  { code: 'HAZ-VAS-05', name: 'Kiểm định MSDS & dán mã QR tra cứu an toàn hóa chất', category: 'Kiểm Định An Toàn', unit: 'Lô hàng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'HAZ-VAS-06', name: 'Bơm rót san chiết dung môi hóa chất từ IBC Tank ra phuy 200L', category: 'San Chiết Sang Bồn', unit: 'Phuy', defaultPrice: '150,000 ₫ / Phuy', isFree: false },
  { code: 'HAZ-VAS-07', name: 'Cung cấp bao cát hút dầu/hóa chất & phao thấm khẩn cấp', category: 'Vật Tư Chống Tràn', unit: 'Bộ', defaultPrice: '280,000 ₫ / Bộ', isFree: false },
  { code: 'HAZ-VAS-08', name: 'Dán tem cảnh báo tương thích hóa chất theo bảng phân cách IMDG', category: 'Nhãn Cảnh Báo Nguy Hiểm', unit: 'Tem', defaultPrice: '2,500 ₫ / Tem', isFree: false },
  { code: 'HAZ-VAS-09', name: 'Quấn màng PE chống tĩnh điện (Anti-static Wrap) cho kiện hàng hóa chất', category: 'Đóng Gói Chuyên Dụng', unit: 'Pallet', defaultPrice: '65,000 ₫ / Pallet', isFree: false },
  { code: 'HAZ-VAS-10', name: 'Lập báo cáo lưu trữ hóa chất định kỳ gửi Sở Công Thương', category: 'Hồ Sơ Pháp Lý', unit: 'Báo cáo', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
];

export const BONDED_GENERAL_SUGGESTED_SURCHARGES = [
  { code: 'BON-GEN-SCH-01', name: 'Phí giám sát hải quan ngoài giờ hành chính / ngày nghỉ lễ', category: 'Giám Sát Hải Quan', unit: 'Lô', defaultPrice: '500,000 ₫ / Lô', isFree: false },
  { code: 'BON-GEN-SCH-02', name: 'Phí bốc xếp phục vụ kiểm hóa thực tế tại kho ngoại quan', category: 'Kiểm Hóa & Bốc Xếp', unit: 'Pallet', defaultPrice: '45,000 ₫ / Pallet', isFree: false },
  { code: 'BON-GEN-SCH-03', name: 'Phí niêm phong, kẹp chì seal hải quan & biên bản bàn giao', category: 'Niêm Phong Hải Quan', unit: 'Seal chì', defaultPrice: '30,000 ₫ / Seal', isFree: false },
  { code: 'BON-GEN-SCH-04', name: 'Phí rút ruột container hàng nhập kho ngoại quan (Unstuffing)', category: 'Rút / Đóng Hàng CFS', unit: 'Cont 20ft', defaultPrice: '850,000 ₫ / Cont', isFree: false },
  { code: 'BON-GEN-SCH-05', name: 'Phí đóng ghép container hàng lẻ CFS xuất khẩu (CFS Stuffing)', category: 'Rút / Đóng Hàng CFS', unit: 'CBM', defaultPrice: '45,000 ₫ / CBM', isFree: false },
  { code: 'BON-GEN-SCH-06', name: 'Phí phân loại hàng hóa theo Master Bill / House Bill / PO', category: 'Kiểm Đếm & Phân Loại', unit: 'Kiện', defaultPrice: '3,000 ₫ / Kiện', isFree: false },
  { code: 'BON-GEN-SCH-07', name: 'Phí thủ tục thanh khoản, xuất kho ngoại quan vào nội địa / tái xuất', category: 'Hồ Sơ Thanh Khoản', unit: 'Bộ tờ khai', defaultPrice: '250,000 ₫ / Bộ', isFree: false },
  { code: 'BON-GEN-SCH-08', name: 'Phí lưu bãi container chờ kiểm tra thực tế hàng hóa quá 24h', category: 'Bãi Xe & Lưu Ca', unit: 'Cont / Ngày', defaultPrice: '200,000 ₫ / Ngày', isFree: false },
];

export const BONDED_COLD_SUGGESTED_SURCHARGES = [
  { code: 'BON-COLD-SCH-01', name: 'Phí cắm điện container lạnh tại bãi chờ thông quan (Reefer Plug-in)', category: 'Bãi Xe Cont Lạnh', unit: 'Giờ', defaultPrice: '95,000 ₫ / Giờ', isFree: false },
  { code: 'BON-COLD-SCH-02', name: 'Phí phục vụ lấy mẫu kiểm dịch động vật / thực vật buồng lạnh', category: 'Kiểm Dịch & Lấy Mẫu', unit: 'Lô', defaultPrice: '300,000 ₫ / Lô', isFree: false },
  { code: 'BON-COLD-SCH-03', name: 'Phí kiểm tra, đo nhiệt độ tâm sản phẩm và lập biên bản kiểm tra', category: 'Kiểm Định ATTP', unit: 'Lô', defaultPrice: '180,000 ₫ / Lô', isFree: false },
  { code: 'BON-COLD-SCH-04', name: 'Phí bốc xếp nâng hạ đưa hàng vào buồng lạnh ngoại quan', category: 'Bốc Xếp Buồng Lạnh', unit: 'Pallet', defaultPrice: '55,000 ₫ / Pallet', isFree: false },
  { code: 'BON-COLD-SCH-05', name: 'Phí giám sát hải quan & kiểm dịch ngoài giờ buồng lạnh', category: 'Giám Sát Chuyên Ngành', unit: 'Giờ', defaultPrice: '350,000 ₫ / Giờ', isFree: false },
  { code: 'BON-COLD-SCH-06', name: 'Phí xả đá buồng đệm và phun khử trùng tiêu độc trước/sau kiểm hóa', category: 'Vệ Sinh Khử Khuẩn', unit: 'Lần', defaultPrice: '600,000 ₫ / Lần', isFree: false },
  { code: 'BON-COLD-SCH-07', name: 'Phí bảo ôn màng bạc cách nhiệt Thermal Foil cho pallet tái xuất', category: 'Đóng Gói Bảo Ôn', unit: 'Pallet', defaultPrice: '85,000 ₫ / Pallet', isFree: false },
  { code: 'BON-COLD-SCH-08', name: 'Phí cắm điện bổ sung & test kỹ thuật PTI container lạnh xuất khẩu', category: 'Kỹ Thuật PTI', unit: 'Cont', defaultPrice: '450,000 ₫ / Cont', isFree: false },
];

export const BONDED_HAZMAT_SUGGESTED_SURCHARGES = [
  { code: 'BON-HAZ-SCH-01', name: 'Phí thẩm định hồ sơ kỹ thuật, mã UN & phân nhóm nguy hiểm cho Hải quan', category: 'Thẩm Định Hồ Sơ HQ', unit: 'SKU', defaultPrice: '300,000 ₫ / SKU', isFree: false },
  { code: 'BON-HAZ-SCH-02', name: 'Phí giám sát an toàn đặc biệt khi mở container phuy/IBC Tank kiểm hóa', category: 'Giám Sát An Toàn DG', unit: 'Cont', defaultPrice: '600,000 ₫ / Cont', isFree: false },
  { code: 'BON-HAZ-SCH-03', name: 'Phí lấy mẫu giám định thành phần hóa chất phục vụ khai báo chuyên ngành', category: 'Lấy Mẫu Giám Định', unit: 'Mẫu', defaultPrice: '450,000 ₫ / Mẫu', isFree: false },
  { code: 'BON-HAZ-SCH-04', name: 'Phí bốc xếp bằng xe nâng chuyên dụng chống cháy nổ (Ex-proof forklift)', category: 'Thiết Bị Phòng Nổ', unit: 'Pallet', defaultPrice: '95,000 ₫ / Pallet', isFree: false },
  { code: 'BON-HAZ-SCH-05', name: 'Phí kẹp chì niêm phong van bồn / đai niêm phuy hóa chất ngoại quan', category: 'Niêm Phong An Ninh', unit: 'Seal chì', defaultPrice: '35,000 ₫ / Seal', isFree: false },
  { code: 'BON-HAZ-SCH-06', name: 'Phí trung hòa dung dịch rò rỉ & xử lý chất thải nguy hại phát sinh', category: 'An Toàn Môi Trường', unit: 'Lần xử lý', defaultPrice: '1,500,000 ₫ / Lần', isFree: false },
  { code: 'BON-HAZ-SCH-07', name: 'Phí ứng trực thiết bị Spill-Kit và an toàn viên khi kiểm hóa hàng DG', category: 'Ứng Phó Khẩn Cấp', unit: 'Lô', defaultPrice: '500,000 ₫ / Lô', isFree: false },
  { code: 'BON-HAZ-SCH-08', name: 'Phí đo nồng độ khí cháy nổ LEL và độc tố trước khi mở cửa khoang chứa', category: 'Quan Trắc Khí Độc', unit: 'Lần đo', defaultPrice: '400,000 ₫ / Lần', isFree: false },
];

export const BONDED_GENERAL_SUGGESTED_VAS = [
  { code: 'BON-GEN-VAS-01', name: 'Dán nhãn phụ tiếng Việt / Barcode SKU trước khi mở tờ khai nhập khẩu', category: 'Tem Nhãn & Barcode', unit: 'Tem', defaultPrice: '500 ₫ / Tem', isFree: false },
  { code: 'BON-GEN-VAS-02', name: 'Đóng gói lại, bao bọc màng co gia cố kiện hàng hư hỏng quốc tế', category: 'Đóng Gói & Gia Cố', unit: 'Kiện', defaultPrice: '25,000 ₫ / Kiện', isFree: false },
  { code: 'BON-GEN-VAS-03', name: 'Đại lý dịch vụ khai thuê hải quan trọn gói kho ngoại quan', category: 'Khai Thuê Hải Quan', unit: 'Bộ tờ khai', defaultPrice: '800,000 ₫ / Bộ', isFree: false },
  { code: 'BON-GEN-VAS-04', name: 'Cấp chứng thư hun trùng (Fumigation Certificate) cho hàng tái xuất', category: 'Kiểm Dịch & Khử Trùng', unit: 'Pallet', defaultPrice: '30,000 ₫ / Pallet', isFree: false },
  { code: 'BON-GEN-VAS-05', name: 'Lấy mẫu gửi cơ quan giám định chuyên ngành (Vinacontrol / Quatest)', category: 'Giám Định Chất Lượng', unit: 'Lần', defaultPrice: '350,000 ₫ / Lần', isFree: false },
  { code: 'BON-GEN-VAS-06', name: 'Đóng kiện gỗ xuất khẩu đạt tiêu chuẩn kiểm dịch ISPM 15', category: 'Đóng Kiện Xuất Khẩu', unit: 'Kiện', defaultPrice: '220,000 ₫ / Kiện', isFree: false },
  { code: 'BON-GEN-VAS-07', name: 'Quét mã vạch kiểm tra e-Manifest đối soát danh sách cont hải quan', category: 'Dữ Liệu & Đối Soát', unit: 'Lô hàng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'BON-GEN-VAS-08', name: 'Bảo hiểm hàng hóa lưu trữ kho ngoại quan 100%', category: 'Bảo Hiểm Kho Bãi', unit: '% Giá trị hàng', defaultPrice: '0.05% Giá trị hàng', isFree: true },
];

export const BONDED_COLD_SUGGESTED_VAS = [
  { code: 'BON-COLD-VAS-01', name: 'Cấp chứng thư nhiệt độ lưu kho phục vụ hồ sơ kiểm dịch ATTP', category: 'Chứng Từ Kiểm Dịch', unit: 'Bộ chứng từ', defaultPrice: '150,000 ₫ / Bộ', isFree: false },
  { code: 'BON-COLD-VAS-02', name: 'Bọc màng bảo ôn cách nhiệt Thermal Foil cho pallet tạm nhập tái xuất', category: 'Bảo Ôn Chuỗi Lạnh', unit: 'Pallet', defaultPrice: '80,000 ₫ / Pallet', isFree: false },
  { code: 'BON-COLD-VAS-03', name: 'Đóng thùng xốp EPS giữ nhiệt & cấp bù đá khô CO2 / đá gel cho mẫu', category: 'Bảo Ôn Đóng Gói', unit: 'Thùng', defaultPrice: '45,000 ₫ / Thùng', isFree: false },
  { code: 'BON-COLD-VAS-04', name: 'Cấp đông nhanh phục hồi nhiệt (Blast Freezing) trước khi đóng cont', category: 'Cấp Đông Cưỡng Bức', unit: 'Tấn', defaultPrice: '750,000 ₫ / Tấn', isFree: false },
  { code: 'BON-COLD-VAS-05', name: 'Dán tem nhãn chịu nhiệt âm sâu chống thấm nước (Freezer Label)', category: 'Tem Nhãn Kho Lạnh', unit: 'Tem', defaultPrice: '800 ₫ / Tem', isFree: false },
  { code: 'BON-COLD-VAS-06', name: 'Cung cấp USB Data Logger ghi nhiệt độ liên tục cho container xuất khẩu', category: 'Thiết Bị Giám Sát', unit: 'Thiết bị', defaultPrice: '130,000 ₫ / Cái', isFree: false },
  { code: 'BON-COLD-VAS-07', name: 'Trích xuất biểu đồ nhiệt độ tự động gửi cơ quan Kiểm dịch', category: 'Dữ Liệu & Báo Cáo', unit: 'Lô hàng', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'BON-COLD-VAS-08', name: 'Bảo hiểm rủi ro suy giảm phẩm chất do nhiệt độ kho lạnh ngoại quan 100%', category: 'Bảo Hiểm Chuỗi Lạnh', unit: '% Giá trị hàng', defaultPrice: '0.08% Giá trị hàng', isFree: true },
];

export const BONDED_HAZMAT_SUGGESTED_VAS = [
  { code: 'BON-HAZ-VAS-01', name: 'Dán nhãn cảnh báo nguy hiểm GHS / UN Diamond song ngữ theo quy định', category: 'Nhãn Cảnh Báo Nguy Hiểm', unit: 'Tem', defaultPrice: '1,500 ₫ / Tem', isFree: false },
  { code: 'BON-HAZ-VAS-02', name: 'Thực hiện khai báo hóa chất nhập khẩu trên một cửa quốc gia NSW', category: 'Khai Báo Chuyên Ngành', unit: 'Lần khai', defaultPrice: '500,000 ₫ / Lần', isFree: false },
  { code: 'BON-HAZ-VAS-03', name: 'Cung cấp pallet chống tràn dung dịch & quấn màng PE chống tĩnh điện', category: 'Vật Tư Chống Tràn', unit: 'Pallet / Tháng', defaultPrice: '380,000 ₫ / Pallet', isFree: false },
  { code: 'BON-HAZ-VAS-04', name: 'Đóng gói bao bì UN chuyên dụng đạt chuẩn vận chuyển hàng nguy hiểm', category: 'Đóng Gói Chuẩn UN', unit: 'Bao bì', defaultPrice: '180,000 ₫ / Bao bì', isFree: false },
  { code: 'BON-HAZ-VAS-05', name: 'Bơm rót sang chiết hóa chất từ bồn ISO Tank / IBC Tank sang phuy 200L', category: 'San Chiết Sang Bồn', unit: 'Phuy', defaultPrice: '200,000 ₫ / Phuy', isFree: false },
  { code: 'BON-HAZ-VAS-06', name: 'Khảo sát MSDS và cấp phiếu an toàn hóa chất tiếng Việt đóng dấu hợp quy', category: 'Hồ Sơ An Toàn MSDS', unit: 'Bộ hồ sơ', defaultPrice: '300,000 ₫ / Bộ', isFree: false },
  { code: 'BON-HAZ-VAS-07', name: 'Kẹp chì niêm phong van bồn an toàn chống can thiệp', category: 'Niêm Phong Hải Quan', unit: 'Seal chì', defaultPrice: '35,000 ₫ / Seal', isFree: false },
  { code: 'BON-HAZ-VAS-08', name: 'Bảo hiểm trách nhiệm ô nhiễm môi trường & cháy nổ kho ngoại quan 100%', category: 'Bảo Hiểm Trách Nhiệm', unit: '% Giá trị hàng', defaultPrice: '0.15% Giá trị hàng', isFree: true },
];

export const SELF_GENERAL_SUGGESTED_SURCHARGES = [
  { code: 'SELF-GEN-SCH-01', name: 'Phí cấp thẻ từ / vân tay phụ ra vào 24/7 bổ sung', category: 'Thẻ Từ & Kiểm Soát', unit: 'Thẻ', defaultPrice: '50,000 ₫ / Thẻ', isFree: false },
  { code: 'SELF-GEN-SCH-02', name: 'Phí gửi chìa khóa dự phòng niêm phong tại quầy lễ tân', category: 'Quản Lý Khóa & Niêm Phong', unit: 'Tháng', defaultPrice: '100,000 ₫ / Tháng', isFree: false },
  { code: 'SELF-GEN-SCH-03', name: 'Phí vệ sinh, xịt khử khuẩn & khử mùi khoang tự quản theo yêu cầu', category: 'Vệ Sinh Khoang Chứa', unit: 'Lần', defaultPrice: '150,000 ₫ / Lần', isFree: false },
  { code: 'SELF-GEN-SCH-04', name: 'Phí phụ trội điện sinh hoạt ổ cắm 220V trong khoang', category: 'Điện Sinh Hoạt', unit: 'kWh', defaultPrice: '3,500 ₫ / kWh', isFree: false },
  { code: 'SELF-GEN-SCH-05', name: 'Phí hỗ trợ nhân công khuân vác, bốc dỡ đồ ngoài giờ', category: 'Hỗ Trợ Bốc Xếp', unit: 'Giờ/Người', defaultPrice: '120,000 ₫ / Giờ', isFree: false },
];

export const SELF_COLD_SUGGESTED_SURCHARGES = [
  { code: 'SELF-COLD-SCH-01', name: 'Phí duy trì nguồn điện máy phát dự phòng ATS 24/7 buồng lạnh', category: 'Năng Lượng Dự Phòng', unit: 'Tháng', defaultPrice: '200,000 ₫ / Tháng', isFree: false },
  { code: 'SELF-COLD-SCH-02', name: 'Phí kiểm định & hiệu chuẩn cảm biến nhiệt độ độc lập IoT', category: 'Kiểm Định Cảm Biến', unit: 'Lần', defaultPrice: '150,000 ₫ / Lần', isFree: false },
  { code: 'SELF-COLD-SCH-03', name: 'Phí xả đá & vệ sinh buồng lạnh tự quản theo chuẩn HACCP', category: 'Vệ Sinh Khử Khuẩn', unit: 'Lần', defaultPrice: '250,000 ₫ / Lần', isFree: false },
  { code: 'SELF-COLD-SCH-04', name: 'Phí tài khoản Mobile App giám sát nhiệt độ real-time & cảnh báo SMS', category: 'Phần Mềm IoT', unit: 'Tháng', defaultPrice: '50,000 ₫ / Tháng', isFree: false },
  { code: 'SELF-COLD-SCH-05', name: 'Phí túi đá gel bảo quản bổ sung khi khách lấy hàng', category: 'Vật Tư Bảo Ôn', unit: 'Túi', defaultPrice: '15,000 ₫ / Túi', isFree: false },
];

export const SELF_HAZMAT_SUGGESTED_SURCHARGES = [
  { code: 'SELF-HAZ-SCH-01', name: 'Phí duy trì quạt thông gió cưỡng bức chống nổ Ex-proof 24/7', category: 'Hệ Thống Phòng Nổ', unit: 'Tháng', defaultPrice: '300,000 ₫ / Tháng', isFree: false },
  { code: 'SELF-HAZ-SCH-02', name: 'Phí kiểm tra định kỳ nồng độ khí rò rỉ & hiệu chuẩn cảm biến LEL', category: 'Quan Trắc Khí Rò Rỉ', unit: 'Tháng', defaultPrice: '200,000 ₫ / Tháng', isFree: false },
  { code: 'SELF-HAZ-SCH-03', name: 'Phí túc trực trạm rửa mắt khẩn cấp & bộ Spill-Kit tại chỗ', category: 'An Toàn Môi Trường', unit: 'Tháng', defaultPrice: '150,000 ₫ / Tháng', isFree: false },
  { code: 'SELF-HAZ-SCH-04', name: 'Phí thẩm định danh mục MSDS & quy chuẩn tương thích hóa chất', category: 'Hồ Sơ An Toàn MSDS', unit: 'SKU', defaultPrice: '200,000 ₫ / SKU', isFree: false },
  { code: 'SELF-HAZ-SCH-05', name: 'Phí thu gom, trung hòa và xử lý chất thải rò rỉ khẩn cấp', category: 'Xử Lý Sự Cố Hóa Chất', unit: 'Lần', defaultPrice: '800,000 ₫ / Lần', isFree: false },
];

export const SELF_GENERAL_SUGGESTED_VAS = [
  { code: 'SELF-GEN-VAS-01', name: 'Thùng carton đóng gói dọn nhà / lưu kho kích thước chuẩn (5 lớp)', category: 'Vật Tư Đóng Gói', unit: 'Thùng', defaultPrice: '25,000 ₫ / Thùng', isFree: false },
  { code: 'SELF-GEN-VAS-02', name: 'Màng quấn PE & xốp bong bóng chống sốc bọc đồ nội thất', category: 'Vật Tư Đóng Gói', unit: 'Cuộn', defaultPrice: '80,000 ₫ / Cuộn', isFree: false },
  { code: 'SELF-GEN-VAS-03', name: 'Ổ khóa cơ chống cắt & bộ 3 chìa bảo mật cao riêng biệt', category: 'Khóa & Bảo Mật', unit: 'Bộ', defaultPrice: '120,000 ₫ / Bộ', isFree: false },
  { code: 'SELF-GEN-VAS-04', name: 'Bảo hiểm cháy nổ tài sản cá nhân trong khoang tự quản', category: 'Bảo Hiểm Tài Sản', unit: '% Giá trị', defaultPrice: '0.05% Giá trị', isFree: true },
  { code: 'SELF-GEN-VAS-05', name: 'Xe đẩy hàng 4 bánh & xe nâng tay sử dụng miễn phí tại chỗ', category: 'Tiện Ích Miễn Phí', unit: 'Lượt', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'SELF-GEN-VAS-06', name: 'Hỗ trợ nhân công bốc xếp, vận chuyển đồ đạc vào khoang', category: 'Nhân Công Bốc Xếp', unit: 'Giờ/Người', defaultPrice: '150,000 ₫ / Giờ', isFree: false },
];

export const SELF_COLD_SUGGESTED_VAS = [
  { code: 'SELF-COLD-VAS-01', name: 'Hộp xốp EPS cách nhiệt giữ lạnh & túi đá gel bảo ôn', category: 'Bảo Ôn Chuỗi Lạnh', unit: 'Bộ', defaultPrice: '40,000 ₫ / Bộ', isFree: false },
  { code: 'SELF-COLD-VAS-02', name: 'Dán tem nhãn chịu nhiệt âm sâu không bong tróc (Freezer Label)', category: 'Tem Nhãn Kho Lạnh', unit: 'Tem', defaultPrice: '800 ₫ / Tem', isFree: false },
  { code: 'SELF-COLD-VAS-03', name: 'Đo nhiệt độ tâm sản phẩm và trích xuất file log nhiệt độ', category: 'Giám Sát Nhiệt Độ', unit: 'Lô', defaultPrice: '0 ₫ (Miễn phí)', isFree: true },
  { code: 'SELF-COLD-VAS-04', name: 'Bảo hiểm suy giảm phẩm chất hàng hóa do sự cố nhiệt độ', category: 'Bảo Hiểm Chuỗi Lạnh', unit: '% Giá trị', defaultPrice: '0.08% Giá trị', isFree: true },
  { code: 'SELF-COLD-VAS-05', name: 'Cung cấp khay chứa Inox 304 tiêu chuẩn chuyên dùng kho lạnh', category: 'Vật Tư Kho Lạnh', unit: 'Khay/Tháng', defaultPrice: '50,000 ₫ / Khay', isFree: false },
];

export const SELF_HAZMAT_SUGGESTED_VAS = [
  { code: 'SELF-HAZ-VAS-01', name: 'Dán tem nhãn cảnh báo hóa chất GHS / UN Diamond kháng dung môi', category: 'Nhãn Cảnh Báo Nguy Hiểm', unit: 'Tem', defaultPrice: '1,500 ₫ / Tem', isFree: false },
  { code: 'SELF-HAZ-VAS-02', name: 'Cung cấp khay hứng chống tràn axit/kiềm chuyên dụng trong khoang', category: 'Khay Hứng Chống Tràn', unit: 'Khay/Tháng', defaultPrice: '120,000 ₫ / Khay', isFree: false },
  { code: 'SELF-HAZ-VAS-03', name: 'Bộ bảo hộ lao động PPE dùng 1 lần (găng tay nitrile, khẩu trang than)', category: 'Bảo Hộ Lao Động PPE', unit: 'Bộ', defaultPrice: '50,000 ₫ / Bộ', isFree: false },
  { code: 'SELF-HAZ-VAS-04', name: 'Kẹp chì niêm phong seal chống can thiệp cửa khoang', category: 'Niêm Phong An Ninh', unit: 'Seal chì', defaultPrice: '15,000 ₫ / Seal', isFree: false },
  { code: 'SELF-HAZ-VAS-05', name: 'Bảo hiểm trách nhiệm ô nhiễm môi trường & cháy nổ hóa chất 100%', category: 'Bảo Hiểm Trách Nhiệm', unit: '% Giá trị', defaultPrice: '0.15% Giá trị', isFree: true },
];

export const CROSS_BORDER_GATE_GROUPS = [
  {
    group: '🇰🇭 Tuyến Cửa Khẩu Campuchia (Cambodia Route)',
    gates: [
      'Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)',
      'Hoa Lư (Bình Phước VN ↔ Trapeang Sre / Kratie Campuchia)',
      'Bình Hiệp (Long An VN ↔ Prey Vo / Svay Rieng Campuchia)',
      'Tịnh Biên / Vĩnh Xương (An Giang VN ↔ Phnom Den / Kandal Campuchia)',
      'Hà Tiên (Kiên Giang VN ↔ Prek Chak / Kampot Campuchia)',
      'Lệ Thanh (Gia Lai VN ↔ Oyadav / Ratanakiri Campuchia)',
    ],
  },
  {
    group: '🇨🇳 Tuyến Cửa Khẩu Trung Quốc (China Route)',
    gates: [
      'Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường / Hữu Nghị Quan TQ)',
      'Móng Cái / Cầu Bắc Luân II (Quảng Ninh VN ↔ Đông Hưng Quảng Tây TQ)',
      'Kim Thành (Lào Cai VN ↔ Hà Khẩu Vân Nam TQ)',
      'Trà Lĩnh (Cao Bằng VN ↔ Long Bang Quảng Tây TQ)',
      'Tà Lùng (Cao Bằng VN ↔ Thủy Khẩu Quảng Tây TQ)',
      'Chi Ma (Lạng Sơn VN ↔ Ái Điểm Quảng Tây TQ)',
      'Thanh Thủy (Hà Giang VN ↔ Thiên Bảo Vân Nam TQ)',
    ],
  },
  {
    group: '🇱🇦 🇹🇭 Tuyến Cửa Khẩu Lào & Thái Lan (Laos & Thailand Route)',
    gates: [
      'Lao Bảo (Quảng Trị VN ↔ Savannakhet Lào ↔ Mukdahan Thái Lan)',
      'Cha Lo (Quảng Bình VN ↔ Na Phao Lào ↔ Nakhon Phanom Thái Lan)',
      'Cầu Treo (Hà Tĩnh VN ↔ Namphao Lào ↔ Viêng Chăn)',
      'Bờ Y (Kon Tum VN ↔ Phouvong Nam Lào ↔ Attapeu)',
      'Nậm Cắn (Nghệ An VN ↔ Namkan Xiengkhouang Lào)',
      'Tây Trang (Điện Biên VN ↔ Pang Hok Phongsaly Lào)',
      'La Lay (Quảng Trị VN ↔ Lalay Saravane Lào)',
    ],
  },
];

export const CROSS_BORDER_GATES_LOV = CROSS_BORDER_GATE_GROUPS.flatMap(g => g.gates);

export const CROSS_BORDER_FTL_VEHICLES_LOV = [
  'Đầu Kéo Container 40ft High Cube (40HC)',
  'Đầu Kéo Container Lạnh 40ft Reefer (40RF)',
  'Đầu Kéo Container 20ft (20GP / 20RF)',
  'Xe Tải Thùng Kín 15.0T (3 Chân liên vận GMS)',
  'Xe Tải Mui Bạt 15.0T - 18.0T (3-4 Chân)',
  'Đầu Kéo Sơ-mi Rơ-moóc Sàn / Lùn (Flatbed / Lowbed)',
  'Khác (Nhập tùy chọn)...',
];

export const CROSS_BORDER_TRANSIT_MODES_LOV = [
  'Xe liên vận chạy thẳng (Direct GMS)',
  'Sang tải / Đổi đầu kéo (Transshipment)',
];

export const CROSS_BORDER_CUSTOMS_SCOPES_LOV = [
  'Trọn gói 2 đầu (VN + Nước bạn)',
  'Chỉ HQ đầu VN',
  'Chỉ cước vận chuyển (Chủ hàng tự làm HQ)',
];

export const CROSS_BORDER_LTL_CUSTOMS_MODES_LOV = [
  'Trọn gói Bao thuế Door-to-Door (Phổ biến)',
  'Mở tờ khai ghép chính ngạch',
  'Chủ hàng tự mở tờ khai',
];

export const CROSS_BORDER_LTL_SCHEDULE_LOV = [
  'Hàng ngày (Daily - T2 đến CN)',
  'Thứ 2, 4, 6 (Mon - Wed - Fri)',
  'Thứ 3, 5, 7 (Tue - Thu - Sat)',
  'Thứ 2, 3, 4, 5, 6 (T2 - T6)',
  'Thứ 2 & Thứ 5 hàng tuần',
  'Thứ 3 & Thứ 6 hàng tuần',
  'Thứ 7 hàng tuần (Weekend)',
  '2 - 3 chuyến / tuần (Theo lịch)',
  'Khác (Nhập tùy chọn)...',
];

export const getTonnagesForBodyType = (
  bodyType?: string, 
  cargoTypeOrIsReefer?: 'general' | 'reefer' | 'hazmat' | 'ltl' | boolean
): string[] => {
  let map = TRUCKING_BODY_TYPE_MAP;
  let allDefaults = ALL_DEFAULT_TRUCKING_TONNAGES;

  if (cargoTypeOrIsReefer === 'ltl') {
    map = LTL_TRUCKING_BODY_TYPE_MAP;
    allDefaults = ALL_DEFAULT_LTL_TONNAGES;
  } else if (cargoTypeOrIsReefer === 'hazmat') {
    map = HAZMAT_TRUCKING_BODY_TYPE_MAP;
    allDefaults = ALL_DEFAULT_HAZMAT_TONNAGES;
  } else if (cargoTypeOrIsReefer === 'reefer' || cargoTypeOrIsReefer === true) {
    map = REEFER_TRUCKING_BODY_TYPE_MAP;
    allDefaults = ALL_DEFAULT_REEFER_TONNAGES;
  }

  if (!bodyType) return [...allDefaults, 'Khác (Nhập tùy chọn)...'];
  
  // Find key matching
  for (const [key, tonnages] of Object.entries(map)) {
    if (bodyType === key || bodyType.includes(key) || key.includes(bodyType)) {
      return [...tonnages, 'Khác (Nhập tùy chọn)...'];
    }
  }
  
  return [...allDefaults, 'Khác (Nhập tùy chọn)...'];
};


export interface WarehousePhotoSlotDef {
  key: string;
  icon: string;
  label: string;
  description: string;
}

export const getWarehousePhotoSlots = (modelId?: string, cargoGroupId?: string): WarehousePhotoSlotDef[] => {
  // 0A. Cross-Dock (proj-gen-xdock, proj-ref-xdock, proj-haz-xdock)
  if (modelId?.includes('xdock') || modelId?.includes('cross-dock') || modelId?.includes('x-dock')) {
    if (modelId?.includes('ref') || cargoGroupId?.includes('ref')) {
      return [
        { key: 'facade', icon: '🏢', label: 'Mặt Tiền & Sân Bãi Tiếp Nhận Xe Lạnh', description: 'Khu vực sân đỗ tiếp nhận xe tải đông lạnh Inbound/Outbound' },
        { key: 'anteroom', icon: '🚪', label: 'Buồng Đệm Anteroom & Cửa Cuốn Nhanh', description: 'Khu vực đệm duy trì nhiệt độ mát (+15°C) khi sang xe' },
        { key: 'dock_shelter', icon: '🚛', label: 'Cửa Dock Đệm Khí Trùm Kín (Dock Shelter)', description: 'Cửa xuất nhập hàng có trùm đệm khí chống thất thoát nhiệt' },
        { key: 'temp_control', icon: '🌡️', label: 'Bảng Điều Khiển & Cảm Biến IoT Buồng Đệm', description: 'Đồng hồ theo dõi nhiệt độ sàn đệm lạnh liên tục 24/7' },
        { key: 'ice_station', icon: '🧊', label: 'Trạm Bảo Quản Đá Gel & Đá Khô Bổ Sung', description: 'Tủ cấp đông đá gel và khu vực chèn lót giữ lạnh khi sang xe' },
        { key: 'cctv_ops', icon: '📹', label: 'Camera An Ninh & Quy Trình Sang Xe Lạnh', description: 'CCTV giám sát quy trình sang xe hỏa tốc trong 2 giờ' },
      ];
    }
    if (modelId?.includes('haz') || cargoGroupId?.includes('haz')) {
      return [
        { key: 'facade', icon: '🏢', label: 'Mặt Tiền & Khoảng Cách Ly An Toàn PCCC', description: 'Cổng vào khu bãi sang tải hóa chất biệt lập có rào chắn' },
        { key: 'haz_pad', icon: '☣️', label: 'Bãi Cách Ly Ngoài Trời & Rãnh Gom Tràn', description: 'Sàn bê tông chuyên dụng có rãnh thu gom hóa chất rò rỉ' },
        { key: 'spill_kit', icon: '🚨', label: 'Đội Phản Ứng Nhanh & Xe Spill-Kit', description: 'Trạm vật tư ứng phó sự cố hóa chất Spill-Kit túc trực 24/7' },
        { key: 'ppe_station', icon: '🦺', label: 'Bồn Rửa Mắt Khẩn Cấp & Tủ Đồ Bảo Hộ PPE', description: 'Trạm vòi tắm/rửa mắt khẩn cấp và trang bị bảo hộ chuyên dụng' },
        { key: 'foam_pccc', icon: '🔥', label: 'Hệ Thống PCCC Bọt Foam Áp Lực Cao', description: 'Hệ thống chữa cháy chuyên dụng cho hóa chất lỏng & dung môi' },
        { key: 'cctv_haz', icon: '📹', label: 'Camera Giám Sát An Toàn Hóa Chất 24/7', description: 'CCTV phòng nổ theo dõi toàn bộ khu vực sang tải' },
      ];
    }
    return [
      { key: 'facade', icon: '🏢', label: 'Mặt Tiền & Sân Bãi Tiếp Nhận Xe In/Out', description: 'Sân bê tông rộng rãi cho xe tải nặng và cont 40ft quay đầu' },
      { key: 'dock_doors', icon: '🚛', label: 'Dãy Cửa Dock Xuất Nhập & Dock Leveler', description: 'Cửa Dock nâng tự động tiếp nhận hàng đồng thời 2 chiều' },
      { key: 'sorting_conveyor', icon: '⚙️', label: 'Sàn Chia Chọn & Băng Chuyền Con Lăn', description: 'Hệ thống băng chuyền phân tuyến và phân loại theo Store Code' },
      { key: 'store_barcode', icon: '🏷️', label: 'Bàn Dán Mã Store Code & Quét Barcode', description: 'Khu vực quét mã vạch DWS và in tem phân tuyến siêu thị' },
      { key: 'staging_pallet', icon: '🪵', label: 'Khu Đóng Gộp Pallet & Quấn Màng PE Outbound', description: 'Khu vực tập kết pallet theo từng đơn hàng siêu thị trước khi xuất bến' },
      { key: 'fire_cctv', icon: '🔥', label: 'PCCC Sprinkler & Camera Soi Kiện Hàng', description: 'PCCC tự động và camera an ninh giám sát tiến độ giải phóng sàn' },
    ];
  }

  // 0B. Cảng & Cảng Cạn ICD (proj-gen-port, proj-ref-port, proj-haz-port)
  if (modelId?.includes('port') || modelId?.includes('cảng') || modelId?.includes('icd')) {
    if (modelId?.includes('ref') || cargoGroupId?.includes('ref')) {
      return [
        { key: 'facade', icon: '⚓', label: 'Bến Cầu Cảng & Bãi Chuyên Dụng Cont Lạnh', description: 'Toàn cảnh cầu bến tiếp nhận sà lan và bãi cont lạnh' },
        { key: 'reefer_plugs', icon: '🔌', label: 'Giàn Cắm Điện Cont Lạnh (Reefer Plugs)', description: 'Hệ thống trụ điện 380V/32A cắm điện buồng lạnh liên tục 24/7' },
        { key: 'data_logger', icon: '🌡️', label: 'Trạm Đo & Data Logger Giám Sát Nhiệt', description: 'Bảng ghi nhận nhiệt độ và biên bản kiểm tra kỹ thuật PTI' },
        { key: 'genset_trucks', icon: '🚛', label: 'Đội Xe Đầu Kéo Trang Bị Cụm Genset', description: 'Đầu kéo gắn máy phát điện Genset chuyên tuyến Cảng - Nhà máy' },
        { key: 'cranes', icon: '🏗️', label: 'Hệ Thống Cẩu RTG & Reach Stacker Nâng Hạ', description: 'Thiết bị nâng hạ chuyên dụng bốc dỡ container lạnh an toàn' },
        { key: 'cctv_port', icon: '📹', label: 'Camera Giám Sát Bãi Cont Lạnh 24/7', description: 'CCTV theo dõi giàn cắm điện và phương tiện ra vào bãi' },
      ];
    }
    if (modelId?.includes('haz') || cargoGroupId?.includes('haz')) {
      return [
        { key: 'facade', icon: '⚓', label: 'Cổng Kiểm Soát An Ninh Hàng Nguy Hiểm Cảng', description: 'Trạm kiểm soát an ninh hàng DG theo quy chuẩn Cảng vụ' },
        { key: 'dg_yard', icon: '☣️', label: 'Bãi Cách Ly Container Nguy Hiểm DG', description: 'Khu bãi biệt lập có đê bao và khoảng cách an toàn hàng hải' },
        { key: 'fire_truck', icon: '🔥', label: 'Xe Chữa Cháy Thường Trực Hiện Trường', description: 'Phương tiện chữa cháy chuyên dụng túc trực khi nâng hạ cont DG' },
        { key: 'spill_drain', icon: '🚨', label: 'Hố Thu Gom Rò Rỉ Hóa Chất Bến Cảng', description: 'Hệ thống thu gom sự cố rò rỉ hóa chất và phao quây cảng biển' },
        { key: 'warning_ghs', icon: '🦺', label: 'Biển Báo Nguy Hiểm Chuẩn IMO / GHS', description: 'Hệ thống biển cảnh báo phân nhóm Class nguy hiểm tại bãi' },
        { key: 'cctv_port', icon: '📹', label: 'Camera An Ninh Giám Sát Bãi DG 24/7', description: 'CCTV phòng nổ kết nối trực tiếp với Trung tâm điều hành Cảng vụ' },
      ];
    }
    return [
      { key: 'facade', icon: '⚓', label: 'Bến Cầu Cảng Tiếp Nhận Sà Lan & Tàu Biển', description: 'Chiều dài cầu bến, mớn nước và năng lực tiếp nhận phương tiện' },
      { key: 'cont_yard', icon: '📦', label: 'Bãi Chứa Container & Depot Bãi Vỏ Rỗng', description: 'Bãi chứa container hàng và bãi depot vỏ rỗng tiêu chuẩn IICL' },
      { key: 'cranes_sts', icon: '🏗️', label: 'Hệ Thống Cẩu Bờ STS & Cẩu Bãi RTG', description: 'Hệ thống cẩu giàn bờ STS và cẩu bãi RTG năng suất cao' },
      { key: 'reach_stacker', icon: '🚜', label: 'Đội Xe Nâng Chụp Reach Stacker 45T', description: 'Xe nâng gắp cont 45T và xe nâng vỏ cont rỗng chuyên dụng' },
      { key: 'gate_ocr', icon: '🚛', label: 'Cổng Trạm Gate-In/Out Cân Điện Tử & OCR', description: 'Cổng kiểm soát tự động quét OCR số cont và cân xe 80T' },
      { key: 'tos_cctv', icon: '💻', label: 'Trung Tâm Điều Hành TOS & Camera Cảng', description: 'Phòng điều hành phần mềm TOS kết nối VASSCM Hải quan và E-Port' },
    ];
  }
  // 0C. Kho Tự Quản (Self-Storage) - Hàng thường, Hàng lạnh, Hàng nguy hiểm
  if (modelId?.includes('self') || modelId?.includes('tự quản')) {
    if (modelId?.includes('ref') || cargoGroupId?.includes('ref') || modelId?.includes('cold') || modelId?.includes('lạnh')) {
      return [
        { key: 'facade', icon: '🏢', label: 'Lối Vào & Cổng Kiểm Soát Thẻ Từ / Vân Tay 24/7', description: 'Khu vực check-in ra vào tự do 24/7 cho khách hàng' },
        { key: 'locker_aisle', icon: '🚪', label: 'Dãy Khoang Lạnh Cá Nhân (Locker Lạnh)', description: 'Hành lang dãy khoang lạnh cá nhân độc lập dải nhiệt âm/dương' },
        { key: 'inside_locker', icon: '❄️', label: 'Bên Trong Khoang Lưu Trữ Lạnh Tự Quản', description: 'Không gian bên trong khoang, khay Inox 304, nhiệt kế kiểm tra' },
        { key: 'temp_control', icon: '🌡️', label: 'Đồng Hồ Hiển Thị Nhiệt Độ & Cảm Biến IoT', description: 'Màn hình LED theo dõi nhiệt độ và cảnh báo vượt ngưỡng' },
        { key: 'cctv_security', icon: '📹', label: 'Camera Giám Sát Hành Lang & Khóa Số Bảo Mật', description: 'CCTV 24/7 lối đi, pát khóa số bảo mật riêng từng khoang' },
        { key: 'power_backup', icon: '⚡', label: 'Máy Phát Điện ATS Dự Phòng Chuyển Mạch 5s', description: 'Hệ thống điện máy phát tự động duy trì lạnh liên tục 24/7' },
      ];
    }
    if (modelId?.includes('haz') || cargoGroupId?.includes('haz') || modelId?.includes('nguy hiểm')) {
      return [
        { key: 'facade', icon: '🏢', label: 'Cổng Kiểm Soát An Ninh & Biển Báo Hóa Chất', description: 'Khu vực cổng, biển báo nguy hiểm phân nhóm hóa chất tự quản' },
        { key: 'storage_units', icon: '☣️', label: 'Dãy Khoang Tự Quản Hóa Chất (Vách Chống Cháy EI60)', description: 'Dãy khoang vách ngăn chống cháy EI60, cửa chống cháy độc lập' },
        { key: 'sump_tray', icon: '🛡️', label: 'Khay Hứng & Sàn Chống Tràn Axit / Hóa Chất', description: 'Sàn phủ kháng hóa chất, khay hứng dung dịch tràn đổ chuyên dụng' },
        { key: 'explosion_vent', icon: '💨', label: 'Quạt Thông Gió Chống Cháy Nổ Ex-Proof 24/7', description: 'Quạt hút Ex-proof 24/7, cảm biến rò rỉ khí/hơi độc LEL' },
        { key: 'ppe_eyewash', icon: '🦺', label: 'Trạm Rửa Mắt Khẩn Cấp & Tủ Trang Bị PPE', description: 'Emergency eyewash/shower và tủ đồ bảo hộ cá nhân tại chỗ' },
        { key: 'security_cctv', icon: '📹', label: 'Camera CCTV Phòng Nổ & PCCC Tự Động', description: 'CCTV phòng nổ 24/7 và hệ thống chữa cháy chuyên dụng' },
      ];
    }
    return [
      { key: 'facade', icon: '🏢', label: 'Mặt Tiền & Cổng Kiểm Soát Ra Vào Tự Do 24/7', description: 'Cổng ra vào tòa nhà kho, khu vực tiếp nhận xe tải/xe dọn đồ của khách hàng' },
      { key: 'storage_units', icon: '🚪', label: 'Dãy Hành Lang Khoang Phân Lô Cửa Cuốn', description: 'Hành lang các dãy khoang chứa cửa cuốn/cửa sắt sạch sẽ, đèn LED cảm ứng' },
      { key: 'inside_unit', icon: '📦', label: 'Bên Trong Khoang Sàn Tự Quản Khóa Riêng', description: 'Không gian bên trong khoang (vách tôn thép chống cháy, sàn sạch, pát khóa độc lập)' },
      { key: 'security_cctv', icon: '🔑', label: 'Kiểm Soát Thẻ Từ & Camera An Ninh CCTV 24/7', description: 'Đầu đọc thẻ từ RFID / Vân tay vào cửa 24/7 và camera an ninh hành lang' },
      { key: 'packing_tools', icon: '🛒', label: 'Xe Đẩy Hàng 4 Bánh & Bàn Đóng Gói Tại Chỗ', description: 'Xe đẩy hàng 4 bánh, xe nâng tay cơ khí miễn phí và quầy vật tư đóng gói' },
      { key: 'fire_climate', icon: '🔥', label: 'PCCC Sprinkler Tự Động & Máy Hút Ẩm', description: 'PCCC Sprinkler tự động từng khoang, máy hút ẩm công nghiệp chống ẩm mốc' },
    ];
  }

  // 1. Kho lạnh & Kho mát (Cold / Refrigerated)
  if (modelId?.includes('ref') || cargoGroupId?.includes('ref') || modelId?.includes('cold')) {
    if (modelId?.includes('bon')) {
      return [
        { key: 'facade', icon: '🏢', label: 'Mặt tiền & Cổng kiểm soát Hải quan', description: 'Toàn cảnh cổng kho ngoại quan, trạm kiểm soát HQ' },
        { key: 'cold_chamber', icon: '❄️', label: 'Hệ thống Buồng lạnh & Dàn lạnh bảo quản', description: 'Bên trong buồng lạnh, dải nhiệt độ, dàn lạnh' },
        { key: 'racking', icon: '📦', label: 'Hệ thống Giá kệ Racking kho lạnh', description: 'Dãy kệ Drive-in, Selective chuyên dụng hàng lạnh' },
        { key: 'dock_shelter', icon: '🚛', label: 'Cửa Dock đệm khí giữ nhiệt (Dock Shelter)', description: 'Cửa bốc dỡ cont lạnh có trùm đệm khí cách nhiệt' },
        { key: 'quarantine', icon: '🔬', label: 'Khu vực Lấy mẫu & Kiểm dịch Hải quan', description: 'Bàn lấy mẫu, kiểm tra ATTP / kiểm dịch động thực vật' },
        { key: 'power_backup', icon: '⚡', label: 'Máy phát điện dự phòng & Cụm máy nén', description: 'Máy phát ATS tự động, cụm máy nén Bitzer/Guentner' },
      ];
    }
    if (modelId?.includes('self')) {
      return [
        { key: 'facade', icon: '🏢', label: 'Lối vào & Cổng kiểm soát thẻ từ/vân tay', description: 'Khu vực check-in ra vào tự do 24/7' },
        { key: 'locker_aisle', icon: '🚪', label: 'Dãy khoang lạnh cá nhân (Locker lạnh)', description: 'Hành lang dãy khoang lạnh cá nhân độc lập' },
        { key: 'inside_locker', icon: '❄️', label: 'Bên trong khoang lưu trữ lạnh', description: 'Không gian bên trong khoang, khay kệ, nhiệt kế' },
        { key: 'temp_control', icon: '🌡️', label: 'Bảng đồng hồ nhiệt độ & Cảm biến IoT', description: 'Màn hình theo dõi nhiệt độ từng khoang' },
        { key: 'cctv_security', icon: '📹', label: 'Hệ thống Camera an ninh & Khóa số', description: 'CCTV 24/7 lối đi, khóa số bảo mật từng tủ' },
        { key: 'power_backup', icon: '⚡', label: 'Hệ thống điện dự phòng chuyển mạch ATS', description: 'Máy phát điện tự động duy trì lạnh liên tục' },
      ];
    }
    return [
      { key: 'facade', icon: '🏢', label: 'Mặt tiền & Sân bãi bốc dỡ xe container lạnh', description: 'Toàn cảnh kho, sân bê tông tiếp nhận xe cont lạnh' },
      { key: 'anteroom', icon: '🚪', label: 'Phòng đệm giữ nhiệt (Anteroom) & Cửa cuốn nhanh', description: 'Khu vực đệm duy trì nhiệt khi bốc dỡ hàng' },
      { key: 'cold_chamber', icon: '❄️', label: 'Buồng trữ lạnh & Hệ thống Dàn lạnh', description: 'Không gian buồng lạnh, dải nhiệt âm/dương' },
      { key: 'racking', icon: '📦', label: 'Hệ thống Giá kệ Racking kho lạnh', description: 'Kệ Selective / Drive-in chuyên dụng' },
      { key: 'dock_shelter', icon: '🚛', label: 'Cửa Dock có đệm khí trùm kín (Dock Shelter)', description: 'Cửa xuất nhập hàng chống thất thoát nhiệt' },
      { key: 'compressor_iot', icon: '💻', label: 'Cụm máy nén & Bảng điều khiển nhiệt độ IoT', description: 'Cụm máy nén công nghiệp, màn hình giám sát' },
    ];
  }

  // 2. Kho Hàng Nguy Hiểm / Hóa Chất (Hazmat / Chemical)
  if (modelId?.includes('haz') || cargoGroupId?.includes('haz') || modelId?.includes('nguy hiểm')) {
    return [
      { key: 'facade', icon: '🏢', label: 'Mặt tiền & Khoảng cách ly an toàn PCCC', description: 'Khu vực cổng, biển báo nguy hiểm, khoảng cách an toàn' },
      { key: 'haz_storage', icon: '☣️', label: 'Khu vực Lưu trữ hóa chất & Rãnh thu gom tràn', description: 'Sàn kho chuyên dụng, rãnh gom hóa chất tràn đổ' },
      { key: 'foam_fire', icon: '🔥', label: 'Hệ thống PCCC chuyên dụng (Bọt Foam / Khí CO2)', description: 'Đầu phun bọt Foam, tủ chữa cháy tự động' },
      { key: 'explosion_vent', icon: '💨', label: 'Hệ thống Quạt thông gió chống cháy nổ', description: 'Quạt hút chống tia lửa, cảm biến rò rỉ khí/hóa chất' },
      { key: 'ppe_eyewash', icon: '🦺', label: 'Bồn rửa mắt khẩn cấp & Thiết bị bảo hộ PPE', description: 'Trạm ứng phó sự cố hóa chất, vòi tắm khẩn cấp' },
      { key: 'security_cctv', icon: '📹', label: 'Hệ thống Camera & Cảnh báo an ninh 24/7', description: 'CCTV giám sát chuyên biệt, biển cảnh báo liên bộ' },
    ];
  }

  // 3. Kho Ngoại Quan thường (Bonded Warehouse)
  if (modelId?.includes('bon') || modelId?.includes('ngoại quan')) {
    return [
      { key: 'facade', icon: '🏢', label: 'Mặt tiền & Cổng kiểm soát Hải quan', description: 'Cổng vào kho ngoại quan, chốt trực hải quan' },
      { key: 'customs_area', icon: '🏛️', label: 'Khu vực Biệt lập & Niêm phong Hải quan', description: 'Hàng rào ngăn cách biệt lập, cửa có niêm chì' },
      { key: 'racking', icon: '📦', label: 'Hệ thống Giá kệ & Lưu trữ hàng ngoại quan', description: 'Kệ chứa hàng theo từng tờ khai hải quan' },
      { key: 'inspection', icon: '🔍', label: 'Khu vực Kiểm hóa & Phân loại hàng hóa', description: 'Bàn kiểm hóa thực tế của cán bộ hải quan' },
      { key: 'cctv_3layer', icon: '📹', label: 'Hệ thống Camera CCTV 3 lớp theo dõi 24/7', description: 'Camera kết nối dữ liệu trực tiếp với Chi cục HQ' },
      { key: 'fire_safety', icon: '🔥', label: 'Hệ thống PCCC Sprinkler & An ninh kho', description: 'Đầu phun PCCC tự động, hệ thống an toàn' },
    ];
  }

  // 4. Kho TMĐT / Fulfillment
  if (modelId?.includes('ful') || modelId?.includes('fulfillment') || modelId?.includes('tmđt')) {
    return [
      { key: 'facade', icon: '🏢', label: 'Mặt Tiền & Khu Bàn Giao ĐVVC', description: 'Cổng kiểm soát an ninh & khu vực đỗ xe/bàn giao bưu tá SPX, GHN, J&T, Viettel Post...' },
      { key: 'bins_picking', icon: '🗄️', label: 'Kệ Chia Chọn Ô Bins & Nhặt Hàng', description: 'Hệ thống giá kệ chia nhỏ ô Bins/Totes, lối đi nhặt hàng, tem mã vị trí Barcode' },
      { key: 'packing_cctv', icon: '📦', label: 'Bàn Đóng Gói & Camera Giám Sát', description: 'Bàn đóng hàng, máy in bill A6, cân điện tử & Camera soi từng đơn đóng gói' },
      { key: 'buffer_stock', icon: '🪵', label: 'Khu Lưu Kho Đệm & Racking Pallet', description: 'Khu lưu trữ hàng hóa số lượng lớn dạng Pallet/kiện dự phòng bổ sung' },
      { key: 'reverse_logistics', icon: '🔄', label: 'Xử Lý Hàng Hoàn & Kiểm Định QA', description: 'Khu tiếp nhận hàng hoàn TMĐT, kiểm tra seal niêm phong, phân loại tái nhập kho' },
      { key: 'fire_wms_ops', icon: '🔥', label: 'PCCC, An Ninh & Phòng Điều Hành WMS', description: 'PCCC Sprinkler tự động, camera 24/7 & văn phòng nhân sự vận hành WMS/OMS' },
    ];
  }

  // 6. Kho Thường Tiêu Chuẩn (Standard General Warehouse - Default)
  return [
    { key: 'facade', icon: '🏢', label: 'Mặt tiền & Sân bãi bốc dỡ xe container', description: 'Toàn cảnh cổng kho, sân bê tông tiếp nhận cont 40ft/45ft' },
    { key: 'racking', icon: '📦', label: 'Hệ thống Giá kệ Racking chứa hàng', description: 'Dãy kệ Selective / Drive-in nhiều tầng thực tế' },
    { key: 'floor_ceiling', icon: '🏗️', label: 'Mặt sàn bê tông & Trần thông thủy', description: 'Mặt sàn Hardener/Epoxy chống bụi và độ cao trần' },
    { key: 'dock_leveler', icon: '🚛', label: 'Cửa Dock & Cầu nâng thủy lực', description: 'Dãy cửa xuất nhập hàng, cầu nâng bốc dỡ cont' },
    { key: 'fire_security', icon: '🔥', label: 'Hệ thống PCCC & Camera An ninh (CCTV)', description: 'Đầu phun Sprinkler, hộp chữa cháy, camera 24/7' },
    { key: 'vas_area', icon: '✨', label: 'Khu vực Bàn phân loại / Đóng gói VAS', description: 'Bàn dán tem phụ, máy quấn màng co pallet' },
  ];
};


export interface WarehouseTechCategoryDef {
  id: string;
  icon: string;
  label: string;
  desc: string;
}

export const getWarehouseTechSpecCategories = (modelId?: string, cargoGroupId?: string): WarehouseTechCategoryDef[] => {
  const getBaseCategories = (): WarehouseTechCategoryDef[] => {
    // 0A. Cross-Dock (proj-gen-xdock, proj-ref-xdock, proj-haz-xdock)
  if (modelId?.includes('xdock') || modelId?.includes('cross-dock') || modelId?.includes('x-dock')) {
    if (modelId?.includes('ref') || cargoGroupId?.includes('ref')) {
      return [
        { id: 'xdock_cold_temp', icon: '❄️', label: 'Buồng Đệm Lạnh & Dải Nhiệt', desc: 'Dải nhiệt độ +2°C~+8°C / +15°C~+25°C, giàn lạnh' },
        { id: 'xdock_cold_dock', icon: '🚛', label: 'Cửa Dock Lạnh & Đệm Khí Shelter', desc: 'Dock shelter trùm kín cont, dock leveler cách nhiệt' },
        { id: 'xdock_cold_ops', icon: '⏱️', label: 'Quy Trình Sang Xe & Đá Gel Bổ Sung', desc: 'SLA sang xe < 2h, tủ đá gel/đá khô, chèn lót' },
        { id: 'xdock_cold_iot', icon: '💻', label: 'Cảm Biến IoT & Giám Sát Nhiệt Độ', desc: 'Data logger 24/7, cảnh báo nhiệt độ qua App' },
        { id: 'xdock_cold_fire', icon: '🔥', label: 'PCCC & An Ninh Vận Hành', desc: 'PCCC nghiệm thu, camera giám sát 24/7' },
        { id: 'xdock_cold_cert', icon: '📜', label: 'Chứng Nhận ATTP & Chuỗi Lạnh', desc: 'HACCP, ISO 22000, GDP chuỗi lạnh' },
      ];
    }
    if (modelId?.includes('haz') || cargoGroupId?.includes('haz')) {
      return [
        { id: 'xdock_haz_license', icon: '☣️', label: 'Giấy Phép & Phân Nhóm Hóa Chất', desc: 'Giấy phép Sở Công Thương, Class 2-9, MSDS' },
        { id: 'xdock_haz_isolation', icon: '🏗️', label: 'Bãi Cách Ly & Rãnh Chống Tràn', desc: 'Khoảng cách an toàn, sàn rãnh gom tràn hóa chất' },
        { id: 'xdock_haz_fire', icon: '🔥', label: 'PCCC Bọt Foam & Xe Chữa Cháy', desc: 'Hệ thống bọt Foam, xe chữa cháy túc trực' },
        { id: 'xdock_haz_spill', icon: '🚨', label: 'Ứng Phó Sự Cố Spill-Kit & PPE', desc: 'Spill-Kit 24/7, bồn rửa mắt, chứng chỉ NĐ 113' },
        { id: 'xdock_haz_security', icon: '📜', label: 'An Ninh & Bảo Hiểm Môi Trường', desc: 'CCTV phòng nổ, bảo hiểm ô nhiễm môi trường' },
      ];
    }
    return [
      { id: 'xdock_structure', icon: '🏗️', label: 'Kết Cấu Sàn & Cửa Dock Xuất Nhập', desc: 'Diện tích sàn, số cửa dock In/Out, Dock Leveler' },
      { id: 'xdock_sorting', icon: '⚙️', label: 'Thiết Bị Chia Chọn & Băng Chuyền', desc: 'Băng tải con lăn, DWS cân đo tự động, xe nâng' },
      { id: 'xdock_retail', icon: '🏪', label: 'Kết Nối Chuỗi Siêu Thị / Đại Lý', desc: 'Tích hợp GO!, WinMart, AEON, Co.opmart, BHX...' },
      { id: 'xdock_timing', icon: '⏱️', label: 'Khung Giờ Nhận & SLA Xuất Bến', desc: 'Giờ xe cập sàn, SLA giải phóng sàn < 4h - 8h' },
      { id: 'xdock_wms', icon: '💻', label: 'Phần Mềm WMS X-Dock & API', desc: 'Quét Store Code, Scan e-POD, tích hợp ERP' },
      { id: 'xdock_fire', icon: '🔥', label: 'PCCC & An Ninh Sàn Chia Chọn', desc: 'PCCC Sprinkler, camera soi từng kiện hàng 24/7' },
    ];
  }

  // 0B. Cảng & Cảng Cạn ICD (proj-gen-port, proj-ref-port, proj-haz-port)
  if (modelId?.includes('port') || modelId?.includes('cảng') || modelId?.includes('icd')) {
    if (modelId?.includes('ref') || cargoGroupId?.includes('ref')) {
      return [
        { id: 'port_cold_plugs', icon: '🔌', label: 'Giàn Cắm Điện Reefer Plugs', desc: 'Số lượng ổ cắm, công suất máy phát ATS dự phòng' },
        { id: 'port_cold_temp', icon: '🌡️', label: 'Giám Sát Nhiệt Độ & Trạm Đo PTI', desc: 'Data logger 24/7, kiểm tra kỹ thuật giàn lạnh PTI' },
        { id: 'port_cold_fleet', icon: '🚛', label: 'Đội Xe Kéo Gắn Cụm Genset', desc: 'Đầu kéo gắn máy phát Genset chuyên tuyến Cảng - Kho' },
        { id: 'port_cold_berth', icon: '⚓', label: 'Cầu Bến & Thiết Bị Nâng Hạ Cont Lạnh', desc: 'Bến tiếp nhận sà lan lạnh, cẩu RTG/Reach Stacker' },
        { id: 'port_cold_cert', icon: '📜', label: 'Chứng Nhận An Toàn & Bảo Hiểm', desc: 'Chứng chỉ bến bãi, bảo hiểm cont lạnh 100%' },
      ];
    }
    if (modelId?.includes('haz') || cargoGroupId?.includes('haz')) {
      return [
        { id: 'port_haz_license', icon: '📜', label: 'Phê Duyệt Tiếp Nhận Cảng Vụ', desc: 'Quyết định cấp phép của Cảng vụ hàng hải' },
        { id: 'port_haz_yard', icon: '☣️', label: 'Bãi Cách Ly Container DG', desc: 'Khu bãi biệt lập, khoảng cách an toàn hàng hải' },
        { id: 'port_haz_fire', icon: '🔥', label: 'Hệ Thống PCCC Foam & Xe Chữa Cháy', desc: 'Vòi phun bọt Foam, xe chữa cháy thường trực' },
        { id: 'port_haz_spill', icon: '🚨', label: 'Ứng Phó Sự Cố Tràn Đổ Hóa Chất', desc: 'Hố thu gom sự cố, phao quây hóa chất cảng biển' },
        { id: 'port_haz_security', icon: '⚓', label: 'An Ninh Cảng ISPS & Bảo Hiểm', desc: 'Chứng chỉ an ninh ISPS, bảo hiểm bến cảng' },
      ];
    }
    return [
      { id: 'port_berth', icon: '⚓', label: 'Cầu Bến & Tiếp Nhận Sà Lan/Tàu', desc: 'Chiều dài bến, mớn nước, tải trọng sà lan tiếp nhận' },
      { id: 'port_cranes', icon: '🏗️', label: 'Thiết Bị Cẩu Nâng Hạ & Bãi Cont', desc: 'Cẩu bờ STS, cẩu bãi RTG, Reach Stacker 45T' },
      { id: 'port_gate', icon: '🚛', label: 'Cổng Trạm Gate-In/Out & OCR', desc: 'Cân điện tử 80T, camera OCR quét số cont tự động' },
      { id: 'port_tos', icon: '💻', label: 'Phần Mềm TOS & VASSCM Hải Quan', desc: 'Hệ thống TOS điều hành, kết nối E-Port & Hải quan' },
      { id: 'port_isps', icon: '📜', label: 'Chứng Chỉ An Ninh ISPS & Giấy Phép', desc: 'Quyết định Bộ GTVT, chứng chỉ ISPS, bảo hiểm 100%' },
    ];
  }
  // 1. Kho Lạnh & Kho Mát (wh-ref-cold, wh-ref-bon, wh-ref-self)
  if (modelId?.includes('ref') || cargoGroupId?.includes('ref') || modelId?.includes('cold')) {
    return [
      { id: 'cold_temperature', icon: '❄️', label: 'Dải Nhiệt Độ & Cụm Máy Lạnh', desc: 'Dải nhiệt âm/dương, máy nén Bitzer, ATS' },
      { id: 'cold_structure', icon: '🏗️', label: 'Kết Cấu Panel & Mặt Sàn Lạnh', desc: 'Panel cách nhiệt PIR/PU, sưởi chống đông sàn' },
      { id: 'cold_racking', icon: '📦', label: 'Giá Kệ Lạnh & Quản Lý FIFO/FEFO', desc: 'Kệ lạnh chuyên dụng, quản lý date/hạn dùng' },
      { id: 'cold_dock', icon: '🚛', label: 'Cửa Dock Lạnh & Đệm Khí Shelter', desc: 'Đệm khí trùm cont, cầu nâng cách nhiệt, Reefer plug' },
      { id: 'cold_fire', icon: '🔥', label: 'PCCC Kho Lạnh & An Toàn Vận Hành', desc: 'PCCC Sprinkler khô, thoát hiểm buồng lạnh' },
      { id: 'cold_cert', icon: '📜', label: 'Chứng Nhận ATTP & Dược Phẩm', desc: 'HACCP, ISO 22000, BRC, GDP Dược phẩm' },
    ];
  }

  // 2. Kho Hàng Nguy Hiểm & Hóa Chất (wh-haz-std)
  if (modelId?.includes('haz') || cargoGroupId?.includes('haz') || modelId?.includes('nguy hiểm')) {
    return [
      { id: 'haz_license', icon: '☣️', label: 'Giấy Phép & Phân Nhóm Hóa Chất', desc: 'Giấy phép Sở Công Thương, Class nguy hiểm, MSDS' },
      { id: 'haz_structure', icon: '🏗️', label: 'Kết Cấu Cách Ly & Rãnh Chống Tràn', desc: 'Sàn kháng axit, rãnh gom tràn, tường chống cháy' },
      { id: 'haz_fire', icon: '🔥', label: 'PCCC Chuyên Dụng Bọt Foam / Khí', desc: 'Sprinkler bọt Foam/CO2, quạt hút phòng nổ' },
      { id: 'haz_ppe', icon: '🦺', label: 'Ứng Phó Sự Cố & Bảo Hộ (PPE)', desc: 'Bồn rửa mắt khẩn cấp, Spill kit, chứng chỉ NĐ 113' },
      { id: 'haz_security', icon: '📜', label: 'An Ninh & Bảo Hiểm Môi Trường', desc: 'CCTV phòng nổ, bảo hiểm ô nhiễm môi trường' },
    ];
  }

  // 3. Kho Ngoại Quan (wh-gen-bon, wh-ref-bon)
  if (modelId?.includes('bon') || modelId?.includes('ngoại quan')) {
    return [
      { id: 'bon_customs', icon: '🏛️', label: 'Tiêu Chuẩn Hải Quan & Khu Biệt Lập', desc: 'Chi cục HQ quản lý, QĐ thành lập, niêm chì HQ' },
      { id: 'bon_structure', icon: '🏗️', label: 'Kết Cấu Kho & Sân Bãi Container', desc: 'Chiều cao, tải trọng sàn, cự ly cảng biển' },
      { id: 'bon_racking', icon: '📦', label: 'Quản Lý Lưu Trữ Theo Tờ Khai', desc: 'Phân lô theo tờ khai/vận đơn, bàn kiểm hóa HQ' },
      { id: 'bon_cctv', icon: '📹', label: 'Camera Hải Quan & Dữ Liệu VASSCM', desc: 'CCTV 3 lớp lưu 12 tháng, kết nối Chi cục HQ & VASSCM' },
      { id: 'bon_fire', icon: '🔥', label: 'PCCC & An Ninh Kiểm Soát Ra Vào', desc: 'PCCC nghiệm thu, bảo vệ barie 2 lớp 24/7' },
    ];
  }

  // 4. Kho TMĐT / Fulfillment (wh-gen-ful)
  if (modelId?.includes('ful') || modelId?.includes('fulfillment') || modelId?.includes('tmđt')) {
    return [
      { id: 'ful_capacity', icon: '⚡', label: 'Năng Lực Xử Lý Đơn & Pick-Pack', desc: 'Công suất đơn/ngày, bàn đóng gói, SLA < 12h' },
      { id: 'ful_tech', icon: '💻', label: 'Tích Hợp Sàn TMĐT & WMS/OMS', desc: 'Tự động API Shopee/TikTok/Lazada, Barcode SKU' },
      { id: 'ful_reverse', icon: '🔄', label: 'Xử Lý Hàng Hoàn (Reverse Logistics)', desc: 'Bàn kiểm tra hàng hoàn, tỷ lệ sai sót < 0.05%' },
      { id: 'ful_dock', icon: '🚛', label: 'Cửa Giao Nhận Nhanh ĐVVC', desc: 'Tiếp nhận xe van/shipper, khung giờ cut-off ca' },
      { id: 'ful_fire', icon: '🔥', label: 'PCCC & Giám Sát Bàn Đóng Gói', desc: 'PCCC tự động, camera soi từng gói hàng' },
    ];
  }

  // 5. Kho Tự Quản (wh-gen-self, wh-ref-self, wh-haz-self)
  if (modelId?.includes('self') || modelId?.includes('tự quản')) {
    if (modelId?.includes('ref') || cargoGroupId?.includes('ref') || modelId?.includes('cold') || modelId?.includes('lạnh')) {
      return [
        { id: 'self_cold_units', icon: '❄️', label: 'Quy Cách Locker Lạnh & Khoang Âm', desc: 'Dải nhiệt -18°C ~ -25°C / +2°C ~ +8°C, thể tích 1m³ - 15m³' },
        { id: 'self_cold_power', icon: '⚡', label: 'Hệ Thống Lạnh & Máy Phát ATS', desc: 'Máy phát ATS tự động chuyển mạch 5s, cụm máy nén độc lập' },
        { id: 'self_cold_access', icon: '🔑', label: 'Kiểm Soát Thẻ Từ & Cảm Biến IoT', desc: 'Mã PIN/thẻ từ ra vào 24/7, giám sát nhiệt độ qua Mobile App' },
        { id: 'self_cold_safety', icon: '🛡️', label: 'Vệ Sinh HACCP & Bảo Hiểm Lạnh', desc: 'Tiêu chuẩn HACCP, khử khuẩn định kỳ, bảo hiểm chuỗi lạnh 100%' },
      ];
    }
    if (modelId?.includes('haz') || cargoGroupId?.includes('haz') || modelId?.includes('nguy hiểm')) {
      return [
        { id: 'self_haz_units', icon: '☣️', label: 'Quy Cách Khoang Hóa Chất', desc: 'Vách chống cháy EI60, cửa chống cháy, khóa chuyên dụng độc lập' },
        { id: 'self_haz_vent', icon: '💨', label: 'Thông Gió Chống Nổ & Khay Tràn', desc: 'Quạt hút Ex-proof 24/7, khay hứng/sàn chống ăn mòn axit/kiềm' },
        { id: 'self_haz_spill', icon: '🦺', label: 'Trạm Rửa Mắt, PPE & Spill-Kit', desc: 'Emergency shower/eyewash, bộ ứng phó sự cố hóa chất 24/7' },
        { id: 'self_haz_fire', icon: '🔥', label: 'PCCC Chuyên Dụng & Hồ Sơ Pháp Lý', desc: 'PCCC bọt Foam/Sprinkler, giấy phép lưu kho hóa chất đủ điều kiện' },
      ];
    }
    return [
      { id: 'self_units', icon: '🚪', label: 'Quy Cách Khoang Sàn Phân Lô', desc: 'Dải diện tích/thể tích 1-30m³, vách tôn thép, cửa cuốn khóa riêng' },
      { id: 'self_access', icon: '🔑', label: 'Ra Vào Tự Do 24/7 & An Ninh', desc: 'Thẻ từ/vân tay 24/7, camera CCTV hành lang, khách giữ chìa' },
      { id: 'self_amenities', icon: '🛒', label: 'Tiện Ích Xe Đẩy & Máy Hút Ẩm', desc: 'Xe đẩy bốc dỡ miễn phí, máy hút ẩm < 60%, thùng carton' },
      { id: 'self_fire', icon: '🔥', label: 'PCCC & Bảo Hiểm Khoang Chứa', desc: 'PCCC Sprinkler từng khoang, bảo hiểm tài sản cá nhân 100%' },
    ];
  }

    // 6. Kho Thường Tiêu Chuẩn (Standard General Warehouse - Default)
    return [
      { id: 'structure', icon: '🏗️', label: 'Kết Cấu & Mặt Sàn', desc: 'Chiều cao, tải trọng sàn, nền' },
      { id: 'racking', icon: '📦', label: 'Giá Kệ & Sức Chứa', desc: 'Loại kệ, tầng kệ, tải Pallet' },
      { id: 'dock', icon: '🚛', label: 'Cửa Dock & Sân Bãi', desc: 'Cửa xuất nhập, dock leveler, sân cont' },
      { id: 'fire', icon: '🔥', label: 'PCCC & An Ninh', desc: 'Sprinkler, nghiệm thu, camera 24/7' },
      { id: 'wms', icon: '💻', label: 'WMS & Công Nghệ', desc: 'Phần mềm quản lý, Barcode, API' },
      { id: 'cert', icon: '📜', label: 'Giấy Phép & Chứng Nhận', desc: 'ISO, LEED, Bảo hiểm kho bãi' },
    ];
  };

  return [
    ...getBaseCategories(),
    {
      id: 'utilities',
      icon: '🎁',
      label: 'Tiện Ích Đi Kèm (Miễn Phí)',
      desc: 'Tiện ích & dịch vụ đã bao gồm 100% trong giá thuê',
    },
  ];
};

export interface WarehouseTechSpecs {
  // General & Structure
  clearHeight?: number; // m
  floorLoad?: number; // tan/m2
  floorType?: string; // Hardener / Epoxy / Be tong sieu phang
  columnGrid?: string; // Khau do buoc cot (VD: 12m x 18m)
  ventilation?: string; // Thong gio tu nhien / cuong buc

  // Racking
  rackingTypes?: string[]; // Selective, Drive-in, VNA, Double Deep...
  rackingLevels?: number; // So tang ke (VD: 5)
  palletLoadLimit?: number; // kg / pallet
  compatiblePalletSizes?: string[]; // 1m x 1.2m, 1.1m x 1.1m...

  // Dock & Yard
  dockDoorsCount?: number; // So cua dock
  hasDockLeveler?: boolean; // Cau nang tu dong
  hasDockShelter?: boolean; // Dem khi dock shelter
  yardTurnaround?: string; // San bai quay dau xe cont
  operatingHoursTrucks?: string; // Khung gio tiep nhan xe cont

  // Fire & Safety
  fireProtectionSystem?: string; // Sprinkler tu dong, hong nuoc...
  fireProtectionApprovalNo?: string; // So giay nghiem thu PCCC
  cctvSurveillance?: string; // Camera 24/7
  securityGuards?: string; // Bao ve chuyen nghiep

  // WMS & Tech
  wmsSoftwareName?: string; // Ten phan mem WMS
  scanningTechnologies?: string[]; // Barcode, QR, RFID
  hasApiIntegration?: boolean; // Tich hop API da san / ERP
  realtimeWebPortal?: boolean; // Web portal bao cao ton kho

  // Cert & Insurance
  certifications?: string[]; // ISO 9001, HACCP, ISO 22000, GDP, LEED...
  hasFullInsurance?: boolean; // Bao hiem kho bai 100%

  // Cold Storage Specs
  temperatureRange?: string; // Dai nhiet do
  coolingSystemBrand?: string; // Hang may lanh / dan lanh
  hasAutoDataLogger?: boolean; // Data logger ghi nhiet 24/7
  hasBackupGeneratorAts?: boolean; // May phat dien du phong ATS < 15s
  hasAnteroomFastDoor?: boolean; // Phong dem giu nhiet & Cua cuon nhanh
  insulationPanelType?: string; // Panel PIR/PU do day
  hasUnderfloorHeating?: boolean; // Suoi nen chong dong bang
  hasFefoFifoWms?: boolean; // WMS quan ly date FIFO/FEFO
  hasEmergencyChamberRelease?: boolean; // Chot thoat hiem buong lanh co suoi

  // Hazmat Storage Specs
  hazmatLicenseNo?: string; // Giay phep kho hoa chat
  permittedHazmatClasses?: string[]; // Class 2, 3, 4, 5, 8, 9
  hasMsdsManagement?: boolean; // Quan ly MSDS 100%
  hasSpillContainment?: boolean; // Ranh va ho ga chong tran
  hasExplosionProofFans?: boolean; // Quat thong gio chong chay no
  hasEmergencyEyewashShower?: boolean; // Bon rua mat & Tam khan cap
  hasCertifiedHazmatStaff?: boolean; // Nhan vien co chung chi ND 113
  hasEnvironmentalInsurance?: boolean; // Bao hiem o nhiem moi truong

  // Bonded Warehouse Specs
  customsAuthorityName?: string; // Chi cuc Hai quan quan ly
  bondedDecisionNo?: string; // So QD thanh lap kho ngoai quan
  distanceToPortKm?: number; // Cu ly toi cang bien / cua khau (km)
  hasCustomsSealingArea?: boolean; // Khu biet lap & niem chi HQ
  hasVasscmConnected?: boolean; // Ket noi VASSCM Hai quan
  hasCustomsDirectCctvFeed?: boolean; // Truyen hinh anh CCTV truc tiep toi Chi cuc HQ

  // Fulfillment Specs
  dailyOrderCapacity?: number; // Cong suat don / ngay
  fulfillmentSlaHours?: string; // Cam ket dong goi < 12h hoac < 24h
  connectedEcommercePlatforms?: string[]; // Shopee, TikTok, Lazada...
  hasItemBarcodeVerification?: boolean; // Quet barcode tung san pham
  hasReverseLogisticsArea?: boolean; // Khu xu ly hang hoan
  packingStationCount?: number; // So ban dong goi

  // Self Storage Specs
  unitVolumeRanges?: string[]; // 1m3, 3m3, 5m3, 10m3...
  has247CardAccess?: boolean; // Ra vao 24/7 the tu
  hasIndependentKeyLock?: boolean; // Khach tu giu chia khoa rieng
  hasFreeHandlingTrolleys?: boolean; // Xe day hang noi bo mien phi
  hasOnsitePackagingSupplies?: boolean; // Vat tu dong goi tai cho
  hasDehumidifierClimateControl?: boolean; // May hut am chong am moc
  hasIoTTemperatureMonitoringApp?: boolean; // Mobile App giam sat nhiet do real-time
  hasExProofVentilation247?: boolean; // Quat hut phong no Ex-proof 24/7
  hasIndividualSumpTray?: boolean; // Khay hung chong tran axit/hoa chat trong khoang
  hasEmergencyEyewashNearby?: boolean; // Tram rua mat khan cap ke ben khoang
}

export interface WarehousePhotoItem {
  id: string;
  url: string;
  name?: string;
  tag?: string;
  slotKey?: string;
  isCover?: boolean;
}

export interface WarehouseDetailModalData {
  routeId: string;
  modelId?: string;
  warehouseCode: string;
  warehouseName: string;
  province: string;
  address: string;
  isColdStorage?: boolean;
  isChemicalStorage?: boolean;
  isBondedStorage?: boolean;
  isSelfStorage?: boolean;
  isFulfillment?: boolean;
  customsWarehouseCode?: string;
  customsAuthority?: string;
  photos: WarehousePhotoItem[];
  techSpecs: WarehouseTechSpecs;
  freeSurcharges: string[];
  paidSurcharges: PaidSurchargeItem[];
  vasItems: CapabilityVasItem[];

  // Năng lực sức chứa (Thiết kế & Hiện trạng còn trống)
  capacityArea?: number;
  capacityPallets?: number;
  capacityVolume?: number;
  availableArea?: number;
  availablePallets?: number;
  availableVolume?: number;
  occupiedArea?: number;
  occupiedPallets?: number;
  occupiedVolume?: number;
  receptionStatus?: 'ready' | 'nearly_full' | 'full';

  // Đơn giá thuê kho cơ bản & Điều khoản thương mại
  pricePerArea?: number;
  pricePerPallet?: number;
  pricePerVolume?: number;
  pricePerTon?: number;
  minChargeMonthly?: number;
  currency?: 'VND' | 'USD';
  validUntil?: string;
  promotionPercent?: number;
  sla?: string;
  operatingHours?: string;
  cutOffTime?: string;
  paymentTerms?: string;
}

export interface CapabilityRouteItem {
  id: string;
  modelId?: string;
  routeCode?: string; // Mã tuyến tự sinh (VD: RC-FTL-001)
  region?: string; // Phân vùng thương mại hàng hải (Bắc Mỹ, Châu Á, Châu Âu...)
  route: string;
  customRoute?: string;
  origin: string;
  destination: string;
  truckBodyType?: string;
  customTruckBodyType?: string;
  truckTonnage?: string;
  customTruckTonnage?: string;
  vehicleType?: string;
  shippingLine?: string;
  customPackagingType?: string;
  customShippingLine?: string;
  pricingUnit: string;
  price: number;
  currency: 'VND' | 'USD';
  sla: string;
  transitType?: 'Direct' | 'Transit';
  freeDemDetDays?: number;
  customFreeDemDetDays?: string;
  pricingStyle?: 'All-in' | 'Chưa gồm phụ phí';
  validUntil?: string;
  promotionPercent: number;
  ltlPricing?: LtlTieredPricingConfig;
  vehiclePricingMatrix?: VehiclePricingMatrixColumn[];
  containerPricingMatrix?: ContainerPricingMatrixColumn[];
  railContainerPricingMatrix?: RailContainerPricingMatrixColumn[];
  airCargoPricing?: any;
  temperatureRange?: string;
  tempPackagingType?: string;
  iataDgClass?: string;
  dgAircraftRule?: string;
  aircraftType?: string;
  cargoType?: 'general' | 'reefer' | 'hazmat';
  // Truong thong tin chuyen biet cho Kho Bai 3PL (Warehousing)
  warehouseCode?: string;
  warehouseName?: string;
  warehouseProvince?: string;
  warehouseAddress?: string;
  capacityArea?: number;
  capacityPallets?: number;
  capacityVolume?: number;
  availableArea?: number;
  availablePallets?: number;
  availableVolume?: number;
  occupiedArea?: number;
  occupiedPallets?: number;
  occupiedVolume?: number;
  receptionStatus?: 'ready' | 'nearly_full' | 'full';
  pricePerArea?: number;
  pricePerPallet?: number;
  pricePerVolume?: number;
  pricePerTon?: number;
  minChargeMonthly?: number;
  operatingHours?: string;
  cutOffTime?: string;
  paymentTerms?: string;
  warehousePhotos?: WarehousePhotoItem[];
  warehouseTechSpecs?: WarehouseTechSpecs;
  warehouseFreeSurcharges?: string[];
  warehousePaidSurcharges?: PaidSurchargeItem[];
  warehouseVasItems?: CapabilityVasItem[];
  customsAuthority?: string;
  customsWarehouseCode?: string;
  dailyOrderCapacity?: number;
  maxSkuCount?: number;
  bufferCapacity?: number;
  bufferUnit?: string;
  pickPackPrice?: number;
  extraItemPrice?: number;
  bufferStoragePrice?: number;
  storageUnitsCount?: number;
  customsBranchName?: string;
  customsAreaName?: string;
  customsDeclarationType?: string;
  customsServiceForm?: string;
  customsExtraItemPrice?: number;
  customsRedChannelPrice?: number;
  borderGate?: string;
  transitMode?: string;
  customsScope?: string;
  pricePerKg?: number;
  pricePerCbm?: number;
  minChargeShipment?: number;
  customsLtlMode?: string;
  departureSchedule?: string;
  // Truong thong tin chuyen biet cho Cross-dock & Port (Project Cargo)
  xdockCode?: string;
  xdockName?: string;
  xdockProvince?: string;
  xdockAddress?: string;
  floorProcessingCapacity?: string;
  minChargeXdock?: number;
  portIcdCode?: string;
  portIcdName?: string;
  portIcdProvince?: string;
  portIcdAddress?: string;
  yardCapacityTeu?: number;
  priceShuttle20ft?: number;
  priceShuttle40ft?: number;
  priceLiftOnOff?: number;
}

export interface PaidSurchargeItem {
  id: string;
  code?: string;
  name: string;
  category?: string;
  priceText: string;
  unit?: string;
  slaNote?: string;
  isChecked: boolean;
}

export interface CapabilityVasItem {
  id: string;
  code?: string;
  name: string;
  desc?: string;
  category: string; // VD: 'Dịch Vụ Bốc Xếp & Đóng Gói', 'Phương Tiện & Thiết Bị Phụ Trợ', 'Giám Sát, An Ninh & Chứng Từ', 'Quy Định, Pháp Lý & Bảo Hiểm'
  tag?: string;
  priceText: string;
  unit?: string;
  slaNote?: string;
  isChecked: boolean;
  isPopular?: boolean;
}

export const DEFAULT_TRUCKING_VAS_ITEMS: CapabilityVasItem[] = [
  // 1. Dịch Vụ Bốc Xếp & Đóng Gói
  {
    id: 'vas-trk-1',
    name: 'Bốc xếp nhân công 2 đầu kho (Loading / Unloading Labor)',
    desc: 'Hỗ trợ đội ngũ công nhân khuân vác, bốc dỡ hàng hóa từ sàn kho lên thùng xe và ngược lại.',
    category: 'Dịch Vụ Bốc Xếp & Đóng Gói',
    tag: 'Bốc xếp 2 đầu',
    priceText: '500,000 ₫ / Điểm',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-trk-2',
    name: 'Đóng gói màng co PE & Quấn bọc Pallet (Packaging & Palletizing)',
    desc: 'Quấn bọc màng co PE nhiều lớp chống nước, chống bụi và quấn đai nẹp kiện hàng.',
    category: 'Dịch Vụ Bốc Xếp & Đóng Gói',
    tag: 'Đóng gói PE / Pallet',
    priceText: '150,000 ₫ / Pallet',
    isChecked: false,
  },
  {
    id: 'vas-trk-3',
    name: 'Đóng thùng gỗ / Khung sắt bảo vệ hàng dễ vỡ (Wooden Crate Packing)',
    desc: 'Gia công thùng gỗ kín hoặc khung nan bảo vệ chống va đập cho máy móc, linh kiện điện tử.',
    category: 'Dịch Vụ Bốc Xếp & Đóng Gói',
    tag: 'Đóng thùng gỗ',
    priceText: '600,000 ₫ / Kiện',
    isChecked: false,
  },
  {
    id: 'vas-trk-4',
    name: 'Chèn lót túi khí & Chằng buộc tăng đơ lashing (Lashing & Dunnage)',
    desc: 'Sử dụng túi khí chèn khe hở và dây cảo tăng đơ chịu lực cố định kiện hàng trong thùng xe.',
    category: 'Dịch Vụ Bốc Xếp & Đóng Gói',
    tag: 'Chằng buộc an toàn',
    priceText: '350,000 ₫ / Chuyến',
    isChecked: false,
  },

  // 2. Phương Tiện & Thiết Bị Phụ Trợ
  {
    id: 'vas-trk-5',
    name: 'Hạ bửng nâng thủy lực thùng xe (Hydraulic Tail-lift Truck)',
    desc: 'Xe tải trang bị bàn nâng thủy lực phía sau hỗ trợ lên/xuống pallet hoặc kiện nặng không cần xe nâng.',
    category: 'Phương Tiện & Thiết Bị Phụ Trợ',
    tag: 'Bửng nâng thủy lực',
    priceText: '200,000 ₫ / Điểm',
    isChecked: false,
    isPopular: true,
  },
  {
    id: 'vas-trk-6',
    name: 'Dịch vụ cẩu tự hành / Xe cẩu hạ bãi (Mobile Crane Handling)',
    desc: 'Bố trí xe cẩu tự hành 3.5T - 15T cẩu hạ máy móc thiết bị nặng tại hiện trường.',
    category: 'Phương Tiện & Thiết Bị Phụ Trợ',
    tag: 'Cẩu tự hành',
    priceText: '1,500,000 ₫ / Ca',
    isChecked: false,
  },
  {
    id: 'vas-trk-7',
    name: 'Tìm xe quay đầu / Ghép chiều về (Backhaul / Return Trucking)',
    desc: 'Ưu tiên kết nối xe rỗng chiều về tuyến này để tối ưu 25% - 40% chi phí cước vận chuyển.',
    category: 'Phương Tiện & Thiết Bị Phụ Trợ',
    tag: 'Xe quay đầu giá tốt',
    priceText: 'Giảm 25-40% cước',
    isChecked: true,
    isPopular: true,
  },

  // 3. Giám Sát, An Ninh & Chứng Từ
  {
    id: 'vas-trk-8',
    name: 'Định vị GPS Real-time & Share Link hành trình 24/7 (Live GPS Tracking)',
    desc: 'Cung cấp đường link GPS theo dõi trực tuyến 24/7 lộ trình xe di chuyển cho chủ hàng và kho nhận.',
    category: 'Giám Sát, An Ninh & Chứng Từ',
    tag: 'GPS Real-time 24/7',
    priceText: '0 ₫ (Miễn phí)',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-trk-9',
    name: 'Niêm phong chì Seal an ninh & Chụp ảnh đối soát 2 đầu (Security Seal & Inspection)',
    desc: 'Kẹp chì an ninh bảo mật thùng xe và chụp ảnh đối soát kiện hàng 2 đầu gửi/nhận trước khi xuất bến.',
    category: 'Giám Sát, An Ninh & Chứng Từ',
    tag: 'Niêm phong Seal',
    priceText: '0 ₫ (Miễn phí)',
    isChecked: false,
  },
  {
    id: 'vas-trk-10',
    name: 'Thu hồi chứng từ gốc POD hỏa tốc trong 24h-48h (POD Return Express)',
    desc: 'Bàn giao lại biên bản giao nhận có chữ ký đóng dấu gốc về văn phòng chủ hàng hỏa tốc.',
    category: 'Giám Sát, An Ninh & Chứng Từ',
    tag: 'Thu hồi POD gốc',
    priceText: '100,000 ₫ / Bộ',
    isChecked: true,
    isPopular: true,
  },

  // 4. Quy Định, Pháp Lý & Bảo Hiểm
  {
    id: 'vas-trk-11',
    name: 'Giấy phép vào phố giờ cấm tải nội đô (HN/HCM) (City Day Entry Permit)',
    desc: 'Thu xếp giấy phép lưu thông nội đô giờ cấm tải cho xe tải vào ban ngày.',
    category: 'Quy Định, Pháp Lý & Bảo Hiểm',
    tag: 'Giấy phép phố cấm',
    priceText: '350,000 ₫ / Giấy phép',
    isChecked: false,
    isPopular: true,
  },
  {
    id: 'vas-trk-12',
    name: 'Bảo hiểm trách nhiệm hàng hóa vận tải nội địa 100% (Cargo Insurance)',
    desc: 'Bảo hiểm trách nhiệm vận chuyển bồi thường 100% giá trị khai báo khi xảy ra sự cố trên hành trình.',
    category: 'Quy Định, Pháp Lý & Bảo Hiểm',
    tag: 'Bảo hiểm 100%',
    priceText: '0.15% Giá trị hàng',
    isChecked: true,
  },
  {
    id: 'vas-trk-13',
    name: 'Phí lưu ca xe / Chờ bốc dỡ qua đêm tại kho (Truck Detention Fee)',
    desc: 'Chi phí bồi dưỡng thời gian xe phải chờ quá số giờ định mức hoặc lưu qua đêm tại kho.',
    category: 'Quy Định, Pháp Lý & Bảo Hiểm',
    tag: 'Lưu ca bãi đêm',
    priceText: '500,000 ₫ / Đêm',
    isChecked: false,
  },
];

// REEFER (HÀNG LẠNH) TRUCKING VAS ITEMS (ĐỒNG BỘ 100% VỚI MÀN HÌNH ĐĂNG NHU CẦU CUSTOMER)
export const DEFAULT_REEFER_TRUCKING_VAS_ITEMS: CapabilityVasItem[] = [
  // 1. Dịch Vụ Bốc Xếp & Bảo Quản Lạnh
  {
    id: 'vas-rf-1',
    name: 'Bốc dỡ & Bốc xếp hàng hóa 2 đầu kho lạnh (Cold Loading Labor)',
    desc: 'Đội ngũ nhân công bốc dỡ, chuyển hàng từ kho lạnh lên/xuống thùng xe nhanh chóng, đúng quy trình cách nhiệt.',
    category: 'Dịch Vụ Bốc Xếp & Bảo Quản Lạnh',
    tag: 'Bốc dỡ kho lạnh',
    priceText: '600,000 ₫ / Điểm',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-rf-2',
    name: 'Bốc dỡ qua Dock trùm túi khí phòng lạnh (Inflatable Shelter Cold Dock)',
    desc: 'Bốc dỡ qua cửa đệm khí phòng lạnh cách nhiệt, ngăn thoát nhiệt và chống đọng sương bề mặt hàng.',
    category: 'Dịch Vụ Bốc Xếp & Bảo Quản Lạnh',
    tag: 'Dock trùm túi khí',
    priceText: '250,000 ₫ / Điểm',
    isChecked: false,
  },
  {
    id: 'vas-rf-3',
    name: 'Cung cấp đá gel bảo ôn, đá khô / Thùng xốp bổ trợ (Gel Ice Packs & Foam Box)',
    desc: 'Trang bị phụ trợ duy trì độ lạnh cho các kiện hàng lấy dỡ phân tán hoặc giao hàng chặng cuối.',
    category: 'Dịch Vụ Bốc Xếp & Bảo Quản Lạnh',
    tag: 'Đá gel / Thùng xốp',
    priceText: '150,000 ₫ / Kiện',
    isChecked: false,
  },

  // 2. Thiết Bị & Phương Tiện Lạnh Chuyên Dụng
  {
    id: 'vas-rf-4',
    name: 'Làm lạnh trước thùng xe 30-60 phút (Pre-cooling)',
    desc: 'Đưa nhiệt độ buồng lạnh về đúng Set-point (-20°C đến 5°C) trước khi mở cửa nhận hàng, chống sốc nhiệt.',
    category: 'Thiết Bị & Phương Tiện Lạnh',
    tag: 'Pre-cooling',
    priceText: '0 ₫ (Miễn phí)',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-rf-5',
    name: 'Máy phát điện dự phòng Clip-on Genset (Continuous Power)',
    desc: 'Đảm bảo giàn lạnh cont/xe chạy liên tục suốt tuyến Bắc - Nam không gián đoạn nguồn điện.',
    category: 'Thiết Bị & Phương Tiện Lạnh',
    tag: 'Genset liên tục',
    priceText: '400,000 ₫ / Ca',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-rf-6',
    name: 'Hạ bửng nâng thủy lực giao hàng chuỗi siêu thị (Hydraulic Tail-lift)',
    desc: 'Xe tải đông lạnh trang bị bửng nâng hạ pallet hàng đông lạnh vào kho/cửa hàng không có dock.',
    category: 'Thiết Bị & Phương Tiện Lạnh',
    tag: 'Bửng nâng thủy lực',
    priceText: '200,000 ₫ / Điểm',
    isChecked: false,
  },

  // 3. Giám Sát Nhiệt Độ & Chứng Từ
  {
    id: 'vas-rf-7',
    name: 'Thiết bị IoT GPS & Cảm biến nhiệt Real-time 24/7 (Live Temp Log)',
    desc: 'Cung cấp link theo dõi nhiệt độ trực tuyến 24/7 và cảnh báo lệch dải nhiệt độ tức thì.',
    category: 'Giám Sát Nhiệt Độ & Chứng Từ',
    tag: 'IoT Cảm biến nhiệt 24/7',
    priceText: '0 ₫ (Miễn phí)',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-rf-8',
    name: 'Xuất biểu đồ dữ liệu nhiệt độ PDF toàn trình có mốc thời gian (Temp Graph Export)',
    desc: 'Bàn giao file PDF biểu đồ nhiệt độ tự động ghi nhận từ lúc đóng hàng đến lúc mở cửa giao nhận.',
    category: 'Giám Sát Nhiệt Độ & Chứng Từ',
    tag: 'Xuất biểu đồ nhiệt PDF',
    priceText: '0 ₫ (Miễn phí)',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-rf-9',
    name: 'Thu hồi chứng từ gốc POD & Biên bản nghiệm thu nhiệt độ trong 24h-48h',
    desc: 'Bàn giao lại biên bản giao nhận có chữ ký xác nhận nhiệt độ đạt chuẩn về văn phòng chủ hàng hỏa tốc.',
    category: 'Giám Sát Nhiệt Độ & Chứng Từ',
    tag: 'Thu hồi POD & Biên bản nhiệt',
    priceText: '100,000 ₫ / Bộ',
    isChecked: true,
    isPopular: true,
  },

  // 4. Quy Định, Pháp Lý & Bảo Hiểm
  {
    id: 'vas-rf-10',
    name: 'Bảo hiểm rủi ro đứt gãy chuỗi lạnh 100% (Temperature Excursion Policy)',
    desc: 'Cam kết bồi thường 100% nếu xảy ra sự cố suy giảm chất lượng do máy lạnh trục trặc hoặc mất nhiệt độ.',
    category: 'Quy Định, Pháp Lý & Bảo Hiểm',
    tag: 'Bảo hiểm chuỗi lạnh 100%',
    priceText: '0.2% Giá trị hàng',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-rf-11',
    name: 'Giao hàng đa điểm & Kiểm đếm chi tiết từng điểm dỡ lạnh (Multi-drop & Counting)',
    desc: 'Giao hàng phân tán nhiều điểm (chuỗi siêu thị, đại lý, kho phụ) và kiểm đếm chi tiết từng kiện.',
    category: 'Quy Định, Pháp Lý & Bảo Hiểm',
    tag: 'Giao đa điểm siêu thị',
    priceText: '300,000 ₫ / Điểm',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-rf-12',
    name: 'Cắm điện duy trì tại bãi / kho trung chuyển qua đêm (Yard Plug-in Fee)',
    desc: 'Cung cấp nguồn điện 3 pha tại bãi đỗ xe khi xe chờ dỡ hàng qua đêm hoặc lưu ca chờ thủ tục.',
    category: 'Quy Định, Pháp Lý & Bảo Hiểm',
    tag: 'Cắm điện bãi qua đêm',
    priceText: '500,000 ₫ / Đêm',
    isChecked: false,
  },
];

// HAZMAT (HÀNG NGUY HIỂM) TRUCKING VAS ITEMS (ĐỒNG BỘ 100% VỚI MÀN HÌNH ĐĂNG NHU CẦU CUSTOMER)
export const DEFAULT_HAZMAT_TRUCKING_VAS_ITEMS: CapabilityVasItem[] = [
  // 1. Pháp Lý & Giấy Phép Hàng Nguy Hiểm
  {
    id: 'vas-dg-1',
    name: 'Xin Giấy phép vận chuyển hàng nguy hiểm (PCCC & Bộ Công An)',
    desc: 'Hoàn tất hồ sơ thẩm định và xin giấy phép lưu hành theo Nghị định 34/2024/NĐ-CP.',
    category: 'Pháp Lý & Giấy Phép',
    tag: 'Giấy phép PCCC',
    priceText: '1,200,000 ₫ / Lô',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-dg-2',
    name: 'Khai báo hóa chất Bộ Công Thương & Kiểm tra an toàn',
    desc: 'Thực hiện khai báo hóa chất nguy hiểm trên Cổng thông tin một cửa quốc gia.',
    category: 'Pháp Lý & Giấy Phép',
    tag: 'Khai báo Bộ Công Thương',
    priceText: '500,000 ₫ / Bộ',
    isChecked: false,
  },

  // 2. Trang Bị An Toàn & Xử Lý Sự Cố Khẩn Cấp
  {
    id: 'vas-dg-3',
    name: 'Bộ trang bị xử lý sự cố tràn đổ Spill Kit (Spill Kit Response)',
    desc: 'Bộ dụng cụ khẩn cấp trên xe gồm cát trơ, tấm thấm hóa chất, xẻng chống tia lửa và thùng chứa sự cố.',
    category: 'Trang Bị & An Toàn',
    tag: 'Spill Kit khẩn cấp',
    priceText: '0 ₫ (Miễn phí)',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-dg-4',
    name: 'Dán biển cảnh báo Placard IMO / UN 4 chiều (IMO Placarding)',
    desc: 'Dán bảng số UN và nhãn cảnh báo nguy hiểm 4 mặt xe theo quy chuẩn quốc tế ADR/IMO.',
    category: 'Trang Bị & An Toàn',
    tag: 'Dán biển Placard',
    priceText: '150,000 ₫ / Xe',
    isChecked: true,
    isPopular: true,
  },
  {
    id: 'vas-dg-5',
    name: 'Tài xế & Áp tải có chứng chỉ nghiệp vụ an toàn DG (Certified Crew)',
    desc: 'Đội ngũ đã được đào tạo và cấp thẻ an toàn vận chuyển hóa chất / PCCC hợp lệ.',
    category: 'Trang Bị & An Toàn',
    tag: 'Chứng chỉ DG',
    priceText: '300,000 ₫ / Chuyến',
    isChecked: true,
    isPopular: true,
  },

  // 3. Chằng Buộc & Phương Tiện Đặc Thù
  {
    id: 'vas-dg-6',
    name: 'Chằng buộc & Khóa lashing chuyên dụng Thùng phuy / IBC Tank',
    desc: 'Khóa tăng đơ sàn và thanh chống xô lệch đặc dụng cho bồn 1000L và phuy hóa chất.',
    category: 'Chằng Buộc & Phương Tiện',
    tag: 'Khóa lashing IBC/Phuy',
    priceText: '350,000 ₫ / Xe',
    isChecked: true,
  },
  {
    id: 'vas-dg-7',
    name: 'Xe hộ tống an ninh / Xe hoa tiêu dẫn đường (Escort Convoy)',
    desc: 'Xe dẫn đường chuyên dụng cho các lô hàng hóa chất cực kỳ nguy hiểm qua đèo dốc, hầm đường bộ.',
    category: 'Chằng Buộc & Phương Tiện',
    tag: 'Xe hộ tống dẫn đường',
    priceText: '1,500,000 ₫ / Chuyến',
    isChecked: false,
  },

  // 4. Bảo Hiểm & Môi Trường
  {
    id: 'vas-dg-8',
    name: 'Bảo hiểm trách nhiệm môi trường & Cháy nổ hóa chất (Liability)',
    desc: 'Bảo hiểm bao gồm chi phí tẩy rửa khắc phục ô nhiễm môi trường và thiệt hại cháy nổ.',
    category: 'Bảo Hiểm & Môi Trường',
    tag: 'Bảo hiểm môi trường',
    priceText: '0.25% Giá trị hàng',
    isChecked: true,
    isPopular: true,
  },
];

export const getDefaultVasItemsForModel = (modelId?: string, categoryId?: string): CapabilityVasItem[] => {
  if (modelId === 'trk-haz-ftl' || modelId?.includes('haz') || modelId?.includes('dg')) {
    return JSON.parse(JSON.stringify(DEFAULT_HAZMAT_TRUCKING_VAS_ITEMS));
  }

  if (modelId === 'trk-ref-ftl' || modelId?.includes('ref') || modelId?.includes('cold')) {
    return JSON.parse(JSON.stringify(DEFAULT_REEFER_TRUCKING_VAS_ITEMS));
  }

  if (categoryId === 'trucking' || modelId?.startsWith('trk-')) {
    return JSON.parse(JSON.stringify(DEFAULT_TRUCKING_VAS_ITEMS));
  }

  if (categoryId === 'ocean' || modelId?.startsWith('ocn-')) {
    return [
      {
        id: 'vas-ocn-1',
        name: 'Khai báo tải trọng xác thực VGM & Cân cont (VGM Filing & Scale)',
        desc: 'Truyền dữ liệu VGM điện tử cho hãng tàu theo công ước quốc tế SOLAS.',
        category: 'Thủ Tục Cảng & Chứng Từ Hàng Hải',
        tag: 'Khai báo VGM',
        priceText: '350,000 ₫ / Cont',
        isChecked: true,
      },
      {
        id: 'vas-ocn-2',
        name: 'Phát hành chứng từ xuất xứ hàng hóa C/O (Certificate of Origin)',
        desc: 'Xin cấp C/O các form A, B, D, E, AK, AJ, VJ, EUR.1...',
        category: 'Thủ Tục Cảng & Chứng Từ Hàng Hải',
        tag: 'C/O Express',
        priceText: '600,000 ₫ / Bộ',
        isChecked: true,
      },
      {
        id: 'vas-ocn-3',
        name: 'Khử trùng / Hun trùng kiểm dịch thực vật (Fumigation & Phytosanitary)',
        desc: 'Cấp chứng thư hun trùng đạt chuẩn quốc tế xuất khẩu.',
        category: 'Thủ Tục Cảng & Chứng Từ Hàng Hải',
        tag: 'Hun trùng',
        priceText: '450,000 ₫ / Cont',
        isChecked: false,
      },
      {
        id: 'vas-ocn-4',
        name: 'Bảo hiểm vận chuyển đường biển quốc tế (Marine Cargo Insurance ICC-A)',
        desc: 'Bảo hiểm mọi rủi ro hàng hải bồi thường 110% CIF.',
        category: 'An Toàn & Bảo Hiểm Hàng Hải',
        tag: 'Bảo hiểm ICC-A',
        priceText: '0.18% Giá trị Invoice',
        isChecked: true,
      },
      {
        id: 'vas-ocn-5',
        name: 'Kẹp chì định vị điện tử GPS E-Seal (Electronic Container Seal)',
        desc: 'Thiết bị khóa định vị vệ tinh theo dõi nhiệt độ & mở cửa container.',
        category: 'An Toàn & Bảo Hiểm Hàng Hải',
        tag: 'E-Seal GPS',
        priceText: '250,000 ₫ / Cont',
        isChecked: false,
      },
      {
        id: 'vas-ocn-6',
        name: 'Đóng hàng / Rút ruột container tại kho CFS / Bãi Cảng',
        desc: 'Đội ngũ xe nâng và công nhân rút/đóng hàng chuyên nghiệp.',
        category: 'Khai Thác Bãi & Rút Ruột Cont',
        tag: 'Rút ruột cont',
        priceText: '1,200,000 ₫ / Cont 40ft',
        isChecked: false,
      },
    ];
  }

  if (categoryId === 'air' || modelId?.startsWith('air-')) {
    return [
      {
        id: 'vas-air-1',
        name: 'Đóng thùng carton chuẩn IATA / Quấn màng bọc Pallet hàng không',
        desc: 'Gia cố bao bì chịu lực va đập khi xếp dỡ khoang hàng máy bay.',
        category: 'Đóng Gói & Xử Lý Sân Bay',
        tag: 'Đóng gói IATA',
        priceText: '200,000 ₫ / Kiện',
        isChecked: false,
      },
      {
        id: 'vas-air-2',
        name: 'Soi chiếu an ninh X-Ray & Cân đo thể tích tự động (X-Ray & Dimension)',
        desc: 'Kiểm tra an ninh nhà ga hàng không Nội Bài / Tân Sơn Nhất.',
        category: 'Đóng Gói & Xử Lý Sân Bay',
        tag: 'Soi chiếu X-Ray',
        priceText: '0 ₫ (Miễn phí)',
        isChecked: true,
      },
      {
        id: 'vas-air-3',
        name: 'Khai báo hàng nguy hiểm DGR & Dán nhãn chuẩn UN (Dangerous Goods Declaration)',
        desc: 'Chứng chỉ IATA DGR khai báo pin lithium, hóa chất, sơn...',
        category: 'Chứng Từ & Khai Báo Hàng Không',
        tag: 'DGR Declaration',
        priceText: '1,200,000 ₫ / Lô',
        isChecked: false,
      },
      {
        id: 'vas-air-4',
        name: 'Cấp phát House AWB / Master AWB hỏa tốc (e-AWB Instant Transmission)',
        desc: 'Truyền e-AWB qua hệ thống CASS hãng hàng không.',
        category: 'Chứng Từ & Khai Báo Hàng Không',
        tag: 'e-AWB Express',
        priceText: '300,000 ₫ / Bộ',
        isChecked: true,
      },
      {
        id: 'vas-air-5',
        name: 'Giao nhận tận nơi Door-to-Airport / Airport-to-Door hỏa tốc',
        desc: 'Xe tải trung chuyển sân bay giao nhận trong ngày.',
        category: 'Giao Nhận & Bảo Hiểm',
        tag: 'Door-to-Airport',
        priceText: '500,000 ₫ / Chuyến',
        isChecked: true,
      },
      {
        id: 'vas-air-6',
        name: 'Bảo hiểm hàng không giá trị cao (All-Risk Air Cargo Insurance)',
        desc: 'Bảo hiểm toàn diện cho hàng linh kiện điện tử, dược phẩm.',
        category: 'Giao Nhận & Bảo Hiểm',
        tag: 'Bảo hiểm Hàng không',
        priceText: '0.2% Giá trị hàng',
        isChecked: true,
      },
    ];
  }

  // Generic fallback
  return [
    {
      id: 'vas-gen-1',
      name: 'Bốc xếp & Nâng hạ hàng hóa chuyên dụng (Handling Support)',
      desc: 'Bố trí công nhân và phương tiện nâng hạ máy móc hàng hóa.',
      category: 'Dịch Vụ Bốc Xếp & Đóng Gói',
      tag: 'Bốc xếp chuyên nghiệp',
      priceText: '300,000 ₫ / Điểm',
      isChecked: true,
    },
    {
      id: 'vas-gen-2',
      name: 'Đóng kiện gỗ & Màng co bảo vệ hàng hóa (Protective Packing)',
      desc: 'Bao gói chống trầy xước, chống va đập cho hàng hóa giá trị.',
      category: 'Dịch Vụ Bốc Xếp & Đóng Gói',
      tag: 'Bảo vệ đóng gói',
      priceText: '400,000 ₫ / Kiện',
      isChecked: false,
    },
    {
      id: 'vas-gen-3',
      name: 'Định vị GPS Real-time & Giám sát trực tuyến 24/7 (Live Monitoring)',
      desc: 'Theo dõi tiến độ hành trình và trạng thái hàng hóa trực tuyến.',
      category: 'Giám Sát, An Ninh & Chứng Từ',
      tag: 'GPS 24/7',
      priceText: '0 ₫ (Miễn phí)',
      isChecked: true,
    },
    {
      id: 'vas-gen-4',
      name: 'Thu hồi chứng từ gốc & Đối soát biên bản trong 24h-48h (POD Return)',
      desc: 'Bàn giao chứng từ gốc giao nhận về văn phòng khách hàng.',
      category: 'Giám Sát, An Ninh & Chứng Từ',
      tag: 'Thu hồi chứng từ',
      priceText: '100,000 ₫ / Bộ',
      isChecked: true,
    },
    {
      id: 'vas-gen-5',
      name: 'Bảo hiểm trách nhiệm hàng hóa 100% (Cargo Insurance)',
      desc: 'Cam kết bồi thường 100% giá trị hàng hóa khi phát sinh tổn thất.',
      category: 'Quy Định, Pháp Lý & Bảo Hiểm',
      tag: 'Bảo hiểm 100%',
      priceText: '0.15% Giá trị hàng',
      isChecked: true,
    },
  ];
};

export interface ModelCapabilityFormData {
  fleet: string;
  operationCapacity: string;
  serviceCommitment: string;
  routes: CapabilityRouteItem[];
  freeSurchargeOptions?: string[];
  freeSurcharges: string[];
  paidSurcharges: PaidSurchargeItem[];
  vasOptions?: string[];
  selectedVas: string[];
  vasItems?: CapabilityVasItem[];
}

export interface ServiceCategoryTree {
  id: string;
  name: string;
  serviceType: ServiceType;
  icon: any;
  cargoGroups: {
    id: string;
    name: 'Hàng thường' | 'Hàng lạnh' | 'Hàng nguy hiểm';
    models: {
      id: string;
      name: string;
      code: string;
      defaultFleet: string;
      defaultOperation: string;
      defaultCommitment: string;
      defaultRoutes: CapabilityRouteItem[];
      freeSurchargeOptions: string[];
      defaultFreeSurcharges: string[];
      paidSurchargeOptions: PaidSurchargeItem[];
      vasOptions: string[];
      defaultVas: string[];
      vehicleLov: string[];
      unitLov: string[];
    }[];
  }[];
}

// 8 Service Categories with 100% Comprehensive Standardized Surcharges (Free & Paid) + VAS LOV Options
export const CAPABILITY_SERVICE_TREE: ServiceCategoryTree[] = [
  {
    id: 'trucking',
    name: 'Đường bộ (Trucking)',
    serviceType: 'Trucking',
    icon: Truck,
    cargoGroups: [
      {
        id: 'trucking-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'trk-gen-ftl',
            name: 'FTL (Bao nguyên chuyến)',
            code: 'FTL',
            defaultFleet: '35 xe tải các loại (1.5T - 15T, Đầu kéo container)',
            defaultOperation: '2 tài xế/xe chạy liên tục, hệ thống quản lý TMS định vị GPS 24/7, đội hỗ trợ sự cố 24/7',
            defaultCommitment: 'Cam kết giao hàng đúng hẹn 99.5%, bồi thường 100% giá trị hàng hóa nếu xảy ra mất mát',
            vehicleLov: [
              'Xe tải 15T thùng kín',
              'Xe tải 8T thùng kín',
              'Xe tải 5T thùng kín',
              'Xe tải 3.5T bạt',
              'Xe tải 2.5T nội đô',
              'Xe tải 1.5T',
              'Đầu kéo Cont 40ft',
              'Xe bửng nâng thủy lực',
              'Xe cẩu tự hành 5T-15T',
            ],
            unitLov: ['Chuyến'],
            defaultRoutes: [
              {
                id: 'r-1',
                routeCode: 'RC-FTL-001',
                route: 'HCM ⇄ Hà Nội',
                origin: 'KCN Tân Bình (TP.HCM)',
                destination: 'KCN Thăng Long (Hà Nội)',
                truckBodyType: 'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]',
                truckTonnage: '15.0T (Tải nặng 3 chân) —— (55 – 60 CBM)',
                vehicleType: 'Xe tải 15T thùng kín',
                pricingUnit: 'Chuyến',
                price: 28500000,
                currency: 'VND',
                sla: '48 - 60 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 15,
              },
              {
                id: 'r-2',
                routeCode: 'RC-FTL-002',
                route: 'HCM ⇄ Đà Nẵng',
                origin: 'KCN Sóng Thần (Bình Dương)',
                destination: 'KCN Hòa Khánh (Đà Nẵng)',
                truckBodyType: 'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]',
                truckTonnage: '8.0T (Tải nặng 2 chân) —— (45 – 50 CBM)',
                vehicleType: 'Xe tải 8T thùng kín',
                pricingUnit: 'Chuyến',
                price: 16500000,
                currency: 'VND',
                sla: '24 - 36 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 0,
              },
              {
                id: 'r-3',
                routeCode: 'RC-FTL-003',
                route: 'HCM ⇄ Nha Trang',
                origin: 'Bình Tân (TP.HCM)',
                destination: 'Cam Ranh (Khánh Hòa)',
                truckBodyType: 'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]',
                truckTonnage: '5.0T – 6.5T (Tải trung) —— (25 – 30 CBM)',
                vehicleType: 'Xe tải 5T thùng kín',
                pricingUnit: 'Chuyến',
                price: 7800000,
                currency: 'VND',
                sla: '10 - 12 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 20,
              },
            ],
            freeSurchargeOptions: [
              'Phí cầu đường & Trạm thu phí BOT toàn tuyến (Toll Fees)',
              'Định vị GPS Real-time & Share Link hành trình 24/7',
              'Niêm phong chì Seal an ninh & Chụp ảnh đối soát 2 đầu',
              'Thu hồi chứng từ gốc POD trong 24h-48h',
              'Bảo hiểm trách nhiệm dân sự bắt buộc',
            ],
            defaultFreeSurcharges: [
              'Phí cầu đường & Trạm thu phí BOT toàn tuyến (Toll Fees)',
              'Định vị GPS Real-time & Share Link hành trình 24/7',
              'Niêm phong chì Seal an ninh & Chụp ảnh đối soát 2 đầu',
              'Thu hồi chứng từ gốc POD trong 24h-48h',
            ],
            paidSurchargeOptions: [
              { id: 'p-1', name: 'Phí lưu ca xe / Chờ bốc dỡ qua đêm', priceText: '500,000 ₫ / Đêm', isChecked: true },
              { id: 'p-2', name: 'Giấy phép vào phố giờ cấm tải (HN/HCM)', priceText: '350,000 ₫ / Giấy phép', isChecked: true },
              { id: 'p-3', name: 'Hạ bửng nâng thủy lực thùng xe', priceText: '200,000 ₫ / Điểm', isChecked: false },
              { id: 'p-4', name: 'Xe cẩu tự hành bốc dỡ máy móc nặng', priceText: '1,500,000 ₫ / Ca', isChecked: false },
              { id: 'p-5', name: 'Nhân công bốc vác lên tầng / Vào hẻm sâu', priceText: '150,000 ₫ / Điểm', isChecked: false },
            ],
            vasOptions: [
              'Tìm xe quay đầu / Ghép chiều về (Backhaul)',
              'Bốc xếp nhân công 2 đầu kho',
              'Định vị GPS Real-time & Share Link hành trình',
              'Giấy phép vào phố giờ cấm tải (HN/HCM)',
              'Hạ bửng nâng thủy lực thùng xe',
              'Niêm phong kẹp chì Seal an ninh & Ảnh đối soát',
              'Thu hồi chứng từ gốc POD hỏa tốc 24-48h',
              'Chèn lót túi khí & Chằng buộc lashing',
              'Dịch vụ cẩu tự hành / Xe cẩu hạ bãi',
              'Bảo hiểm trách nhiệm hàng hóa 100%',
              'Đóng gói màng co PE / Pallet',
              'Đóng thùng gỗ / Khung sắt bảo vệ',
            ],
            defaultVas: [
              'Bốc xếp nhân công 2 đầu kho',
              'Định vị GPS Real-time & Share Link hành trình',
              'Thu hồi chứng từ gốc POD hỏa tốc 24-48h',
              'Bảo hiểm trách nhiệm hàng hóa 100%',
            ],
          },
          {
            id: 'trk-gen-ltl',
            name: 'LTL (Ghép hàng lẻ)',
            code: 'LTL',
            defaultFleet: 'Đội xe trung chuyển nội đô & Hub gom hàng liên tỉnh (Xe thùng kín chuyên tuyến, Xe mui bạt ghép khối tích)',
            defaultOperation: 'Gom hàng xuất bến mỗi ngày lúc 20:00, mạng lưới phân phối đa điểm',
            defaultCommitment: 'Giao hàng đúng hẹn 99%, đối soát e-POD chụp ảnh trong 12h',
            vehicleLov: [
              'Xe Thùng Kín Chuyên Tuyến Ghép LTL',
              'Xe Mui Bạt Trục Bắc - Nam (Ghép Hàng Thể Tích)',
            ],
            unitLov: ['Kg', 'CBM'],
            defaultRoutes: [
              {
                id: 'r-ltl-1',
                routeCode: 'RC-LTL-001',
                route: 'Hà Nội ⇄ TP.HCM',
                origin: 'Hub Thanh Trì (Hà Nội)',
                destination: 'Hub Quận 12 (TP.HCM)',
                truckBodyType: 'Xe Thùng Kín Chuyên Tuyến Ghép LTL',
                truckTonnage: '15.0T (3 Chân thùng kín chạy tuyến cố định) —— (55 – 60 CBM)',
                vehicleType: 'Xe thùng kín 15T ghép tuyến',
                pricingUnit: 'Kg',
                price: 1650,
                currency: 'VND',
                sla: 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 10,
                ltlPricing: createDefaultLtlPricingConfig('weight', 2000, 500000),
              },
              {
                id: 'r-ltl-2',
                routeCode: 'RC-LTL-002',
                route: 'HCM ⇄ Đà Nẵng',
                origin: 'Hub Bình Tân (TP.HCM)',
                destination: 'Hub Hòa Cầm (Đà Nẵng)',
                truckBodyType: 'Xe Mui Bạt Trục Bắc - Nam (Ghép Hàng Thể Tích)',
                truckTonnage: '8.0T – 9.0T (2 Chân thùng dài 9.8m ghép hàng cồng kềnh) —— (~55 CBM)',
                vehicleType: 'Xe mui bạt 8T thùng dài ghép tuyến',
                pricingUnit: 'CBM',
                price: 420000,
                currency: 'VND',
                sla: 'Thứ 3, Thứ 5, Thứ 7 (Xuất bến 19:30)',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 0,
                ltlPricing: createDefaultLtlPricingConfig('volume', 1800, 420000),
              },
            ],
            freeSurchargeOptions: [
              'Định vị kiện hàng theo mã Barcode / QR',
              'e-POD chụp ảnh ký nhận tức thì qua App',
              'Quấn màng PE chống bụi kiện hàng',
            ],
            defaultFreeSurcharges: [
              'Định vị kiện hàng theo mã Barcode / QR',
              'e-POD chụp ảnh ký nhận tức thì qua App',
            ],
            paidSurchargeOptions: [
              { id: 'pltl-1', name: 'Bốc vác lên tầng / Vào hẻm sâu', priceText: '150,000 ₫ / Kiện', isChecked: true },
              { id: 'pltl-2', name: 'Dịch vụ thu hộ COD & Đối soát 24h', priceText: '1% giá trị thu hộ', isChecked: true },
              { id: 'pltl-3', name: 'Phí lưu kho quá 3 ngày tại bãi xe', priceText: '30,000 ₫ / Kiện / Ngày', isChecked: false },
            ],
            vasOptions: [
              'Giao nhận tận nơi Door-to-Door',
              'Đóng gói màng co PE / Đóng khung gỗ kiện lẻ',
              'Dịch vụ thu hộ tiền hàng COD & Đối soát 24h',
              'Bốc vác lên tầng / Vào hẻm sâu',
              'Dán tem nhãn mã vạch kiện lẻ',
              'Bảo hiểm hàng hóa vận chuyển',
            ],
            defaultVas: [
              'Giao nhận tận nơi Door-to-Door',
              'Đóng gói màng co PE / Đóng khung gỗ kiện lẻ',
              'Dịch vụ thu hộ tiền hàng COD & Đối soát 24h',
            ],
          },
        ],
      },
      {
        id: 'trucking-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'trk-ref-ftl',
            name: 'FTL (Xe lạnh nguyên chuyến)',
            code: 'FTL',
            defaultFleet: '20 xe đông lạnh chuyên dụng (1.0T - 15T, Container 20RF/40RF, Thermo King kép)',
            defaultOperation: 'Kiểm soát dải nhiệt độ -25°C đến +15°C, định vị IoT GPS 24/7, xuất biểu đồ nhiệt PDF toàn trình',
            defaultCommitment: 'Cam kết không đứt gãy chuỗi lạnh, đền bù 100% nếu xảy ra sốc nhiệt hoặc hỏng hóc máy lạnh',
            vehicleLov: [
              'Xe đông lạnh 15T (3 chân)',
              'Xe đông lạnh 8T (2 chân)',
              'Xe đông lạnh 5T',
              'Xe đông lạnh 3.5T',
              'Xe đông lạnh 1.9T (Vào phố)',
              'Xe đông lạnh 1.4T (Vào phố)',
              'Đầu kéo Cont 40RF Lạnh',
              'Đầu kéo Cont 20RF Lạnh',
            ],
            unitLov: ['Chuyến'],
            defaultRoutes: [
              {
                id: 'r-ref-1',
                routeCode: 'RC-FTL-001',
                route: 'Đà Lạt ⇄ TP.HCM',
                origin: 'Đức Trọng (Lâm Đồng)',
                destination: 'Chợ đầu mối Thủ Đức (TP.HCM)',
                truckBodyType: 'Xe Tải Thùng Đông Lạnh Trung (Regional Reefer) - [Giàn lạnh Thermo King]',
                truckTonnage: '5.0T – 6.5T (Thùng dài 5.8m – 6.2m) —— (24 – 28 CBM)',
                vehicleType: 'Xe đông lạnh 5T',
                pricingUnit: 'Chuyến',
                price: 9500000,
                currency: 'VND',
                sla: '7 - 9 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
              {
                id: 'r-ref-2',
                routeCode: 'RC-FTL-002',
                route: 'Cần Thơ ⇄ Hà Nội',
                origin: 'KCN Trà Nóc (Cần Thơ)',
                destination: 'KCN Quang Minh (Hà Nội)',
                truckBodyType: 'Xe Tải Đông Lạnh Tải Nặng 3 Chân (Long-haul Reefer) - [Trục Bắc Nam / 16-18 Pallets]',
                truckTonnage: '12.0T – 15.0T (3 Chân thùng dài 9.2m – 9.6m) —— (48 – 54 CBM)',
                vehicleType: 'Xe đông lạnh 15T',
                pricingUnit: 'Chuyến',
                price: 45000000,
                currency: 'VND',
                sla: '45 - 50 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Pre-cooling làm lạnh thùng trước 30-60 phút',
              'Cảm biến nhiệt độ IoT GPS Real-time 24/7',
              'Xuất biểu đồ nhiệt PDF toàn trình đối soát',
              'Phí cầu đường & Trạm thu phí BOT toàn tuyến',
            ],
            defaultFreeSurcharges: [
              'Pre-cooling làm lạnh thùng trước 30-60 phút',
              'Cảm biến nhiệt độ IoT GPS Real-time 24/7',
              'Xuất biểu đồ nhiệt PDF toàn trình đối soát',
              'Phí cầu đường & Trạm thu phí BOT toàn tuyến',
            ],
            paidSurchargeOptions: [
              { id: 'pref-1', name: 'Máy phát điện Genset cắm điện dự phòng liên tục', priceText: '400,000 ₫ / Ca', isChecked: true },
              { id: 'pref-2', name: 'Giao hàng đa điểm chuỗi siêu thị / đại lý lẻ', priceText: '300,000 ₫ / Điểm', isChecked: true },
              { id: 'pref-3', name: 'Phí cắm điện duy trì tại bãi / lưu ca đêm', priceText: '500,000 ₫ / Đêm', isChecked: false },
              { id: 'pref-4', name: 'Bốc dỡ qua Dock trùm túi khí phòng lạnh', priceText: '250,000 ₫ / Điểm', isChecked: false },
              { id: 'pref-5', name: 'Cung cấp đá gel bảo ôn / Đá khô bổ trợ', priceText: '150,000 ₫ / Kiện', isChecked: false },
            ],
            vasOptions: [
              'Bốc dỡ & Bốc xếp kho lạnh 2 đầu gửi/nhận',
              'Làm lạnh trước thùng xe 30-60 phút (Pre-cooling)',
              'Thiết bị IoT GPS & Cảm biến nhiệt Real-time 24/7',
              'Xuất biểu đồ dữ liệu nhiệt độ PDF toàn trình',
              'Máy phát điện dự phòng Clip-on Genset liên tục',
              'Bảo hiểm rủi ro đứt gãy chuỗi lạnh 100%',
              'Giao hàng đa điểm & Kiểm đếm chi tiết từng điểm dỡ lạnh',
              'Hạ bửng nâng thủy lực giao hàng chuỗi siêu thị',
              'Bốc dỡ qua Dock trùm túi khí phòng lạnh',
              'Cung cấp đá gel bảo ôn, đá khô / Thùng xốp bổ trợ',
              'Cắm điện duy trì tại bãi / kho qua đêm',
              'Thu hồi chứng từ gốc POD & Biên bản nghiệm thu nhiệt',
            ],
            defaultVas: [
              'Bốc dỡ & Bốc xếp kho lạnh 2 đầu gửi/nhận',
              'Làm lạnh trước thùng xe 30-60 phút (Pre-cooling)',
              'Thiết bị IoT GPS & Cảm biến nhiệt Real-time 24/7',
              'Xuất biểu đồ dữ liệu nhiệt độ PDF toàn trình',
              'Máy phát điện dự phòng Clip-on Genset liên tục',
              'Bảo hiểm rủi ro đứt gãy chuỗi lạnh 100%',
            ],
          },
        ],
      },
      {
        id: 'trucking-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'trk-haz-ftl',
            name: 'FTL (Xe chuyên dụng nguyên chuyến)',
            code: 'FTL',
            defaultFleet: '15 xe chuyên dụng trang bị bọt PCCC, rãnh chống tràn và giấy phép DG (Bồn Xitec, ISO Tank, Xe tải thùng kín DG)',
            defaultOperation: 'Tài xế & Áp tải 100% có chứng chỉ nghiệp vụ an toàn DG, trang bị bộ Spill-Kit khẩn cấp & dán nhãn Placard UN 4 chiều',
            defaultCommitment: 'Tuân thủ 100% quy chuẩn an toàn hóa chất Nghị định 34/2024/NĐ-CP, cam kết bảo hiểm trách nhiệm môi trường',
            vehicleLov: [
              'Xe tải chở hóa chất 15T (3 chân)',
              'Xe tải chở hóa chất 8T',
              'Xe tải chở hóa chất 3.5T (Nội đô)',
              'Xe bồn Xitec Inox 316L (10k - 18k Lít)',
              'Mooc bồn Xitec Axit/Kiềm (25k - 32k Lít)',
              'Đầu kéo chở bồn ISO Tank 20ft',
              'Đầu kéo chở Cont hóa chất 20ft/40ft',
            ],
            unitLov: ['Chuyến'],
            defaultRoutes: [
              {
                id: 'r-haz-1',
                routeCode: 'RC-DG-001',
                route: 'Bà Rịa - Vũng Tàu ⇄ Bình Dương',
                origin: 'KCN Phú Mỹ (BR-VT)',
                destination: 'KCN VSIP 2 (Bình Dương)',
                truckBodyType: 'Xe Tải Thùng Kín Chuyên Dụng Hóa Chất (DG Dry Box) - [Sàn chống tĩnh điện / Tiếp địa]',
                truckTonnage: '15.0T (3 Chân chở phuy / IBC Tank) —— (50 – 55 CBM)',
                vehicleType: 'Xe tải 15T thùng kín chuyên dụng hóa chất',
                pricingUnit: 'Chuyến',
                price: 14500000,
                currency: 'VND',
                sla: '4 - 6 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 0,
              },
              {
                id: 'r-haz-2',
                routeCode: 'RC-DG-002',
                route: 'Hải Phòng ⇄ Bắc Ninh',
                origin: 'Cảng Đình Vũ (Hải Phòng)',
                destination: 'KCN Yên Phong (Bắc Ninh)',
                truckBodyType: 'Đầu Kéo Kéo Bồn ISO Tank / Cont Hóa Chất (Hazmat Drayage) - [ISO Tank T11/T75 Quốc tế]',
                truckTonnage: 'Đầu kéo + Bồn ISO Tank 20ft (T11 / T50 / T75) —— (24.000 – 26.000 Lít)',
                vehicleType: 'Đầu kéo bồn ISO Tank 20ft',
                pricingUnit: 'Chuyến',
                price: 18000000,
                currency: 'VND',
                sla: '5 - 7 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 5,
              },
            ],
            freeSurchargeOptions: [
              'Bộ ứng cứu tràn đổ hóa chất Spill-Kit & Bình bọt Foam PCCC',
              'Trang thiết bị bảo hộ lao động an toàn hóa chất PPE tiêu chuẩn',
              'Dán biển cảnh báo số UN & Placard IMO 4 chiều quanh xe',
              'Phí cầu đường & Trạm thu phí BOT chính tuyến',
            ],
            defaultFreeSurcharges: [
              'Bộ ứng cứu tràn đổ hóa chất Spill-Kit & Bình bọt Foam PCCC',
              'Trang thiết bị bảo hộ lao động an toàn hóa chất PPE tiêu chuẩn',
              'Dán biển cảnh báo số UN & Placard IMO 4 chiều quanh xe',
              'Phí cầu đường & Trạm thu phí BOT chính tuyến',
            ],
            paidSurchargeOptions: [
              { id: 'phaz-1', name: 'Phí xin giấy phép lưu hành hàng nguy hiểm (PCCC & Bộ Công An)', priceText: '1,200,000 ₫ / Lô', isChecked: true },
              { id: 'phaz-2', name: 'Phí hộ tống an toàn qua hầm Hải Vân / đèo dốc đặc biệt', priceText: '1,500,000 ₫ / Chuyến', isChecked: false },
              { id: 'phaz-3', name: 'Phí kiểm tra nồng độ khí / Thử áp lực bồn xitec trước khi nạp', priceText: '600,000 ₫ / Lần', isChecked: false },
              { id: 'phaz-4', name: 'Phí chèn lót túi khí & khóa tăng đơ sàn chống xô lệch phuy/IBC', priceText: '250,000 ₫ / Xe', isChecked: true },
            ],
            vasOptions: [
              'Xin Giấy phép vận chuyển hàng nguy hiểm (PCCC & Bộ Công An)',
              'Khai báo hóa chất Bộ Công Thương & Kiểm tra an toàn',
              'Bộ trang bị xử lý sự cố tràn đổ Spill Kit (Spill Kit Response)',
              'Dán biển cảnh báo Placard IMO / UN 4 chiều (IMO Placarding)',
              'Tài xế & Áp tải có chứng chỉ nghiệp vụ an toàn DG (Certified Crew)',
              'Chằng buộc & Khóa lashing chuyên dụng Thùng phuy / IBC Tank',
              'Xe hộ tống an ninh / Xe hoa tiêu dẫn đường (Escort Convoy)',
              'Bảo hiểm trách nhiệm môi trường & Cháy nổ hóa chất (Liability)',
            ],
            defaultVas: [
              'Xin Giấy phép vận chuyển hàng nguy hiểm (PCCC & Bộ Công An)',
              'Bộ trang bị xử lý sự cố tràn đổ Spill Kit (Spill Kit Response)',
              'Dán biển cảnh báo Placard IMO / UN 4 chiều (IMO Placarding)',
              'Tài xế & Áp tải có chứng chỉ nghiệp vụ an toàn DG (Certified Crew)',
              'Chằng buộc & Khóa lashing chuyên dụng Thùng phuy / IBC Tank',
              'Bảo hiểm trách nhiệm môi trường & Cháy nổ hóa chất (Liability)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ocean',
    name: 'Đường biển (Sea Freight)',
    serviceType: 'Sea Freight (FCL)',
    icon: Ship,
    cargoGroups: [
      {
        id: 'ocean-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'sea-gen-fcl',
            name: 'FCL (Full Container)',
            code: 'FCL',
            defaultFleet: 'Service Contract trực tiếp với Maersk, ONE, COSCO, MSC, Evergreen',
            defaultOperation: 'Cam kết giữ chỗ Space & Equipment mùa cao điểm, phát hành Seaway Bill / e-BL trong 2h',
            defaultCommitment: 'Đảm bảo đúng lịch tàu, hỗ trợ Free Dem/Det 14 - 21 ngày tại cảng đến',
            vehicleLov: ['40ft High Cube (40HC)', '20ft General (20DC)', '40ft General (40DC)', '20ft Reefer (20RF Lạnh)', '40ft Reefer (40RF Lạnh)', '45ft High Cube (45HC)', 'Open Top / Flat Rack', 'ISO Tank Bồn chất lỏng'],
            unitLov: ['Cont'],
            defaultRoutes: [
              {
                id: 'r-sea-1',
                routeCode: 'RC-FCL-001',
                route: 'Cát Lái (VNCLI) ⇄ Hamburg (Đức)',
                origin: 'Cảng Cát Lái (TP.HCM)',
                destination: 'Cảng Hamburg (Germany)',
                vehicleType: '40ft High Cube (40HC)',
                pricingUnit: 'Cont',
                price: 2450,
                currency: 'USD',
                sla: '28 - 32 ngày',
                transitType: 'Direct',
                freeDemDetDays: 14,
                validUntil: '2026-12-31',
                promotionPercent: 12,
              },
              {
                id: 'r-sea-2',
                routeCode: 'RC-FCL-002',
                route: 'Cái Mép (VNCMT) ⇄ Los Angeles (USLAX)',
                origin: 'Cảng Cái Mép (Bà Rịa - Vũng Tàu)',
                destination: 'Cảng Los Angeles (USA)',
                vehicleType: '40ft High Cube (40HC)',
                pricingUnit: 'Cont',
                price: 2850,
                currency: 'USD',
                sla: '16 - 18 ngày',
                transitType: 'Direct',
                freeDemDetDays: 14,
                validUntil: '2026-12-31',
                promotionPercent: 15,
              },
            ],
            freeSurchargeOptions: [
              'Gia hạn Free Demurrage / Detention 14-21 ngày',
              'Phát hành vận đơn điện tử e-BL / Telex Release',
              'Phí kẹp chì niêm phong Container Seal Fee',
              'Phí khai báo VGM & Truyền dữ liệu Manifest',
            ],
            defaultFreeSurcharges: [
              'Gia hạn Free Demurrage / Detention 14-21 ngày',
              'Phát hành vận đơn điện tử e-BL / Telex Release',
              'Phí kẹp chì niêm phong Container Seal Fee',
            ],
            paidSurchargeOptions: [
              { id: 'psea-1', name: 'Phí xếp dỡ tại cảng bốc (THC POL)', priceText: '$120 / Cont 40HC', isChecked: true },
              { id: 'psea-2', name: 'Phí xếp dỡ tại cảng dỡ (THC POD)', priceText: '$150 / Cont 40HC', isChecked: true },
              { id: 'psea-3', name: 'Khai báo an ninh AMS/ISF (Mỹ) / AFR (Nhật)', priceText: '$35 / BL', isChecked: true },
              { id: 'psea-4', name: 'Phí vệ sinh container (Cleaning Fee)', priceText: '$25 / Cont', isChecked: true },
              { id: 'psea-5', name: 'Phụ phí nhiên liệu xanh BAF / LSS', priceText: '$65 / Cont', isChecked: false },
            ],
            vasOptions: [
              'Chính sách gia hạn Free Demurrage/Detention 14-21 ngày',
              'Phát hành vận đơn điện tử e-BL / Telex Release',
              'Khai báo an ninh trước giờ tàu (AMS/ISF/AFR)',
              'Lashing chằng buộc hàng chuyên dụng trong cont',
              'Bảo hiểm hàng hải quốc tế All-Risks (Loại A)',
              'Hun trùng kiểm dịch gỗ ISPM 15 & Cấp chứng thư',
              'Thủ tục hải quan trọn gói tại bến cảng',
            ],
            defaultVas: [
              'Chính sách gia hạn Free Demurrage/Detention 14-21 ngày',
              'Lashing chằng buộc hàng chuyên dụng trong cont',
              'Bảo hiểm hàng hải quốc tế All-Risks (Loại A)',
            ],
          },
          {
            id: 'sea-gen-lcl',
            name: 'LCL (Hàng lẻ đóng ghép CFS)',
            code: 'LCL',
            defaultFleet: 'Kho CFS gom hàng lẻ trực tiếp tại Cát Lái, Tân Cảng, Đình Vũ',
            defaultOperation: 'Đóng hàng đóng ghép chuyên tuyến hàng tuần, giảm thiểu rủi ro va đập',
            defaultCommitment: 'Bảng giá cước minh bạch, không phát sinh chi phí ẩn tại cảng đến',
            vehicleLov: LCL_SHIPPING_LINES,
            unitLov: ['CBM', 'RT (Revenue Ton)', 'Kg', 'Pallet'],
            defaultRoutes: [
              {
                id: 'r-sea-lcl-1',
                routeCode: 'RC-LCL-001',
                route: 'Cát Lái ⇄ Singapore (SGSIN)',
                origin: 'Kho CFS Cát Lái (TP.HCM)',
                destination: 'Cảng Singapore (SGSIN)',
                vehicleType: 'Maersk (Maersk Line)',
                pricingUnit: 'CBM',
                price: 25,
                currency: 'USD',
                sla: 'Thứ 4, Thứ 7 (Cắt hàng CFS 17:00)',
                transitType: 'Direct',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 20,
                ltlPricing: createDefaultLclPricingConfig('volume', 'USD', 25),
              },
              {
                id: 'r-sea-lcl-2',
                routeCode: 'RC-LCL-002',
                route: 'Hải Phòng ⇄ Thượng Hải (CNSHA)',
                origin: 'Kho CFS Đình Vũ (Hải Phòng)',
                destination: 'Cảng Thượng Hải (China)',
                vehicleType: 'ONE (Ocean Network Express)',
                pricingUnit: 'CBM',
                price: 22,
                currency: 'USD',
                sla: 'Thứ 3, Thứ 6 (Cắt hàng CFS 12:00)',
                transitType: 'Direct',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 10,
                ltlPricing: createDefaultLclPricingConfig('volume', 'USD', 22),
              },
            ],
            freeSurchargeOptions: [
              'Quấn màng PE bảo vệ kiện lẻ tại kho CFS',
              'Kiểm đếm chụp ảnh kiện hàng đối soát',
              'Phát hành vận đơn House Bill e-BL',
            ],
            defaultFreeSurcharges: [
              'Quấn màng PE bảo vệ kiện lẻ tại kho CFS',
              'Phát hành vận đơn House Bill e-BL',
            ],
            paidSurchargeOptions: [
              { id: 'plcl-1', name: 'Phí bốc xếp & Khai thác kho CFS', priceText: '$8 / CBM', isChecked: true },
              { id: 'plcl-2', name: 'Lệnh giao hàng đầu dỡ (D/O Fee)', priceText: '$30 / HBL', isChecked: true },
              { id: 'plcl-3', name: 'Phí lưu kho CFS quá 5 ngày', priceText: '$5 / CBM / Ngày', isChecked: false },
            ],
            vasOptions: [
              'Đóng màng co PE / Đóng kiện gỗ bảo vệ',
              'Dán tem nhãn vận chuyển mã vạch',
              'Dịch vụ gom hàng CFS & Phân loại mã hàng lẻ',
              'Giao tận nơi Door-to-Door nước ngoài',
              'Bảo hiểm hàng hải quốc tế',
              'Thủ tục hải quan hàng lẻ CFS',
            ],
            defaultVas: [
              'Đóng màng co PE / Đóng kiện gỗ bảo vệ',
              'Dán tem nhãn vận chuyển mã vạch',
              'Bảo hiểm hàng hải quốc tế',
            ],
          },
        ],
      },
      {
        id: 'ocean-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'sea-ref-fcl',
            name: 'FCL (Container lạnh Reefer)',
            code: 'FCL',
            defaultFleet: 'Booking cont lạnh Reefer (-25°C ~ +15°C) PTI đạt chuẩn hãng tàu',
            defaultOperation: 'Cắm điện liên tục tại bãi cảng và trên tàu, theo dõi nhiệt độ Data Logger',
            defaultCommitment: 'Cam kết chất lượng nông thủy sản tươi nguyên vẹn khi tới cảng đích',
            vehicleLov: ['40ft Reefer (40RF/40RH Lạnh)', '20ft Reefer (20RF Lạnh)'],
            unitLov: ['Cont'],
            defaultRoutes: [
              {
                id: 'r-sea-ref-1',
                routeCode: 'RC-REF-001',
                route: 'Cát Lái ⇄ Thượng Hải (CNSHA)',
                origin: 'Cảng Cát Lái (TP.HCM)',
                destination: 'Cảng Thượng Hải (China)',
                vehicleType: '40ft Reefer (40RF/40RH Lạnh)',
                pricingUnit: 'Cont',
                price: 1850,
                currency: 'USD',
                sla: '6 - 8 ngày',
                transitType: 'Direct',
                freeDemDetDays: 7,
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'PTI Test kiểm tra giàn lạnh cont trước cấp vỏ',
              'Data Logger giám sát nhiệt độ và độ ẩm',
              'Phát hành e-BL / Telex Release',
            ],
            defaultFreeSurcharges: [
              'PTI Test kiểm tra giàn lạnh cont trước cấp vỏ',
              'Data Logger giám sát nhiệt độ và độ ẩm',
            ],
            paidSurchargeOptions: [
              { id: 'pref-plug', name: 'Phí cắm điện bãi cảng Reefer Plug', priceText: '$65 / Ngày', isChecked: true },
              { id: 'pref-thc', name: 'Phí xếp dỡ bến bãi cont lạnh (THC Reefer)', priceText: '$180 / Cont 40RF', isChecked: true },
              { id: 'pref-clean', name: 'Phí tẩy rửa khử trùng cont lạnh', priceText: '$35 / Cont', isChecked: false },
            ],
            vasOptions: [
              'PTI Test kiểm tra giàn lạnh cont trước cấp vỏ',
              'Data Logger giám sát nhiệt độ và độ ẩm liên tục',
              'Cắm điện bãi cảng Reefer Plug 24/7',
              'Kiểm dịch thực vật / Động vật xuất khẩu tại cảng',
              'Bảo hiểm đứt gãy chuỗi lạnh hàng hải',
              'Làm lạnh buồng cont trước khi đóng hàng',
            ],
            defaultVas: [
              'PTI Test kiểm tra giàn lạnh cont trước cấp vỏ',
              'Data Logger giám sát nhiệt độ và độ ẩm liên tục',
              'Bảo hiểm đứt gãy chuỗi lạnh hàng hải',
            ],
          },
        ],
      },
      {
        id: 'ocean-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'sea-haz-fcl',
            name: 'FCL (Container IMO Hazmat)',
            code: 'FCL',
            defaultFleet: 'Slot container IMO Class 3, 6, 8, 9 với các hãng tàu chuyên tuyến',
            defaultOperation: 'Duyệt MSDS nhanh với bộ phận DG Hãng tàu trong 24h, xếp cont vị trí an toàn trên boong',
            defaultCommitment: 'Tuân thủ 100% Bộ luật Hàng hải quốc tế IMDG Code',
            vehicleLov: ['Cont 20ft DG IMO', 'Cont 40ft DG IMO', 'Bồn ISO Tank'],
            unitLov: ['Cont'],
            defaultRoutes: [
              {
                id: 'r-sea-haz-1',
                routeCode: 'RC-IMO-001',
                route: 'Cái Mép ⇄ Rotterdam (NLRTM)',
                origin: 'Cảng Cái Mép (BR-VT)',
                destination: 'Cảng Rotterdam (Hà Lan)',
                vehicleType: 'Cont 40ft DG IMO',
                pricingUnit: 'Cont',
                price: 3650,
                currency: 'USD',
                sla: '26 - 30 ngày',
                transitType: 'Direct',
                freeDemDetDays: 7,
                validUntil: '2026-12-31',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Thẩm định bảng dữ liệu an toàn MSDS với hãng tàu',
              'Dán tem nhãn cảnh báo IMO chuẩn 4 mặt cont',
            ],
            defaultFreeSurcharges: [
              'Thẩm định bảng dữ liệu an toàn MSDS với hãng tàu',
              'Dán tem nhãn cảnh báo IMO chuẩn 4 mặt cont',
            ],
            paidSurchargeOptions: [
              { id: 'phaz-dg', name: 'Phụ phí hàng nguy hiểm DG Surcharge', priceText: '$150 / Cont', isChecked: true },
              { id: 'phaz-thc', name: 'Phí THC bãi cảng cont nguy hiểm', priceText: '$160 / Cont', isChecked: true },
              { id: 'phaz-sec', name: 'Phí giám sát an toàn cảng vụ', priceText: '$45 / Cont', isChecked: false },
            ],
            vasOptions: [
              'Duyệt bảng dữ liệu an toàn MSDS với DG Hãng tàu',
              'Dán tem nhãn cảnh báo IMO chuẩn 4 mặt cont',
              'Chằng buộc lashing chống dịch chuyển hóa chất',
              'Khai báo an toàn hàng hải nguy hiểm IMO',
              'Bảo hiểm rủi ro hóa chất hàng hải',
            ],
            defaultVas: [
              'Duyệt bảng dữ liệu an toàn MSDS với DG Hãng tàu',
              'Chằng buộc lashing chống dịch chuyển hóa chất',
              'Bảo hiểm rủi ro hóa chất hàng hải',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'air',
    name: 'Hàng không (Air Freight)',
    serviceType: 'Air Freight',
    icon: Plane,
    cargoGroups: [
      {
        id: 'air-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'air-gen-cargo',
            name: 'Air Cargo (Bay thường / General Cargo)',
            code: 'Air Cargo',
            defaultFleet: 'Hợp đồng Block Space Agreement (BSA) Vietnam Airlines, Singapore Airlines, EVA Air, Qatar Airways',
            defaultOperation: 'Book tải bay hàng ngày, ưu tiên qua soi chiếu an ninh TCS/SCSC/NCTS 24/7',
            defaultCommitment: 'Bay đúng lịch trình cam kết, đền bù 100% nếu trễ chuyến ảnh hưởng tiến độ xuất hàng',
            vehicleLov: AIR_AIRLINES_LOV,
            unitLov: ['Kg'],
            defaultRoutes: [
              {
                id: 'r-air-1',
                routeCode: 'RC-AIR-001',
                region: 'Đông Bắc Á (Nhật - Hàn - Trung - Đài)',
                route: 'SGN (Tân Sơn Nhất) ⇄ NRT (Tokyo Narita)',
                origin: 'Sân bay Tân Sơn Nhất (SGN)',
                destination: 'Sân bay Narita Tokyo (NRT)',
                vehicleType: 'Vietnam Airlines (VN Cargo)',
                pricingUnit: 'Kg',
                price: 4.2,
                currency: 'USD',
                sla: 'Hàng ngày (Cắt TCS 18:00)',
                transitType: 'Direct',
                validUntil: '2026-12-31',
                promotionPercent: 10,
                ltlPricing: createDefaultAirPricingConfig('USD', 4.2),
              },
              {
                id: 'r-air-2',
                routeCode: 'RC-AIR-002',
                region: 'Châu Âu (EU - UK)',
                route: 'HAN (Nội Bài) ⇄ FRA (Frankfurt Germany)',
                origin: 'Sân bay Nội Bài (HAN)',
                destination: 'Sân bay Frankfurt (FRA)',
                vehicleType: 'Lufthansa Cargo (LH)',
                pricingUnit: 'Kg',
                price: 5.6,
                currency: 'USD',
                sla: 'T3, T5, T7 (Cắt NCTS 20:00)',
                transitType: 'Direct',
                validUntil: '2026-12-31',
                promotionPercent: 5,
                ltlPricing: createDefaultAirPricingConfig('USD', 5.6),
              },
              {
                id: 'r-air-3',
                routeCode: 'RC-AIR-003',
                region: 'Đông Nam Á (ASEAN)',
                route: 'SGN (Tân Sơn Nhất) ⇄ SIN (Singapore Changi)',
                origin: 'Sân bay Tân Sơn Nhất (SGN)',
                destination: 'Sân bay Singapore Changi (SIN)',
                vehicleType: 'Singapore Airlines Cargo (SQ)',
                pricingUnit: 'Kg',
                price: 2.4,
                currency: 'USD',
                sla: 'Hàng ngày (Cắt SCSC 16:00)',
                transitType: 'Direct',
                validUntil: '2026-12-31',
                promotionPercent: 0,
                ltlPricing: createDefaultAirPricingConfig('USD', 2.4),
              },
            ],
            freeSurchargeOptions: [
              'Phí soi chiếu an ninh X-Ray ưu tiên tại ga hàng không',
              'Phí phát hành vận đơn hàng không điện tử (e-AWB Fee)',
              'Phí truyền dữ liệu Manifest hải quan (EDI Fee)',
            ],
            defaultFreeSurcharges: [
              'Phí soi chiếu an ninh X-Ray ưu tiên tại ga hàng không',
              'Phí phát hành vận đơn hàng không điện tử (e-AWB Fee)',
            ],
            paidSurchargeOptions: [
              { id: 'pair-1', name: 'Phụ phí nhiên liệu hàng không (FSC Fuel)', priceText: '12,000 ₫ / Kg', isChecked: true },
              { id: 'pair-2', name: 'Phí phục vụ nhà ga hàng không (Airport THC)', priceText: '1,200 ₫ / Kg', isChecked: true },
              { id: 'pair-3', name: 'Phí chia tách Bill & Lệnh nhận hàng D/O', priceText: '650,000 ₫ / Bộ', isChecked: false },
              { id: 'pair-4', name: 'Phí lưu kho ga hàng không quá hạn', priceText: '800 ₫ / Kg / Ngày', isChecked: false },
            ],
            vasOptions: [
              'Soi chiếu an ninh X-Ray ưu tiên tại kho TCS/SCSC',
              'Cấp mã vận đơn hàng không điện tử e-AWB',
              'Đóng thùng carton / Thùng gỗ chuẩn IATA',
              'Giao nhận cấp tốc Door-to-Airport / Airport-to-Door',
              'Thông quan khẩn cấp hàng mẫu / Phụ tùng AOG',
              'Bảo hiểm hàng không All-Risks 100%',
            ],
            defaultVas: [
              'Soi chiếu an ninh X-Ray ưu tiên tại kho TCS/SCSC',
              'Đóng thùng carton / Thùng gỗ chuẩn IATA',
              'Bảo hiểm hàng không All-Risks 100%',
            ],
          },
          {
            id: 'air-gen-exp',
            name: 'Express (Hỏa tốc / Chuyển phát nhanh)',
            code: 'Express',
            defaultFleet: 'Đại lý cấp 1 DHL Express, FedEx, UPS toàn cầu',
            defaultOperation: 'Phát hàng trong 24h - 48h, thông quan hàng mẫu khẩn cấp AOG',
            defaultCommitment: 'Tốc độ chuyển phát nhanh nhất, bồi thường cam kết thời gian',
            vehicleLov: ['Chuyển phát nhanh Express Courier', 'Hand-Carry áp tải VIP'],
            unitLov: ['Kg', 'Kiện'],
            defaultRoutes: [
              {
                id: 'r-air-exp-1',
                route: 'TP.HCM ⇄ Singapore',
                origin: 'Nội thành TP.HCM',
                destination: 'Singapore',
                vehicleType: 'Chuyển phát nhanh Express Courier',
                pricingUnit: 'Kg',
                price: 320000,
                currency: 'VND',
                sla: '24 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 15,
              },
            ],
            freeSurchargeOptions: [
              'Lấy hàng tận nơi Door-to-Door nội thành',
              'Cập nhật tracking hành trình từng giờ qua App',
            ],
            defaultFreeSurcharges: [
              'Lấy hàng tận nơi Door-to-Door nội thành',
              'Cập nhật tracking hành trình từng giờ qua App',
            ],
            paidSurchargeOptions: [
              { id: 'pexp-1', name: 'Phụ phí xăng dầu hàng không biến động', priceText: 'Theo biểu phí hãng', isChecked: true },
              { id: 'pexp-2', name: 'Phụ phí giao nhận vùng sâu vùng xa (RAS)', priceText: '350,000 ₫ / Đơn', isChecked: true },
              { id: 'pexp-3', name: 'Phụ phí bưu kiện vượt kích thước quy chuẩn', priceText: '250,000 ₫ / Kiện', isChecked: false },
            ],
            vasOptions: [
              'Lấy hàng tận nơi Door-to-Door hỏa tốc',
              'Thông quan khẩn cấp hàng mẫu / Chứng từ',
              'Dịch vụ áp tải VIP bay cùng kiện hàng (Hand-Carry)',
              'Phát hàng hẹn giờ 24h - 48h toàn cầu',
              'Bảo hiểm chuyển phát nhanh 100%',
            ],
            defaultVas: [
              'Lấy hàng tận nơi Door-to-Door hỏa tốc',
              'Thông quan khẩn cấp hàng mẫu / Chứng từ',
            ],
          },
        ],
      },
      {
        id: 'air-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'air-ref-cargo',
            name: 'Air Cargo (Dược phẩm / Vắc-xin / Hàng bảo quản lạnh)',
            code: 'Air Cargo',
            defaultFleet: 'Thùng giữ nhiệt Envirotainer RKN/RAP, đóng đá khô & Gel lạnh chuyên dụng',
            defaultOperation: 'Quy trình xử lý lạnh chuẩn CEIV Pharma IATA, ưu tiên nhập kho lạnh sân bay',
            defaultCommitment: 'Giữ dải nhiệt độ chính xác (+2°C ~ +8°C hoặc -20°C) suốt hành trình bay',
            vehicleLov: ['Envirotainer RKN', 'Thùng cách nhiệt Va-Q-tec', 'Air Cargo Đá khô'],
            unitLov: ['Kg', 'Thùng'],
            defaultRoutes: [
              {
                id: 'r-air-ref-1',
                route: 'HAN (Nội Bài) ⇄ FRA (Frankfurt)',
                origin: 'Sân bay Nội Bài (Hà Nội)',
                destination: 'Sân bay Frankfurt (Đức)',
                vehicleType: 'Envirotainer RKN',
                pricingUnit: 'Kg',
                price: 145000,
                currency: 'VND',
                sla: '24 - 36 giờ',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Cảm biến nhiệt độ Data Logger thời gian thực',
              'Ưu tiên lưu kho lạnh sân bay GDP',
            ],
            defaultFreeSurcharges: [
              'Cảm biến nhiệt độ Data Logger thời gian thực',
              'Ưu tiên lưu kho lạnh sân bay GDP',
            ],
            paidSurchargeOptions: [
              { id: 'pref-air-1', name: 'Phí bảo quản phòng lạnh ga sân bay (Cool Storage)', priceText: '1,500 ₫ / Kg / Ngày', isChecked: true },
              { id: 'pref-air-2', name: 'Phí bổ sung đá khô / Gel lạnh tại điểm transit', priceText: '$80 / Thùng', isChecked: true },
            ],
            vasOptions: [
              'Bổ sung đá khô / Gel lạnh chuyên dụng tại transit',
              'Thùng giữ nhiệt công nghệ cao Envirotainer / Va-Q-tec',
              'Ưu tiên lưu kho lạnh sân bay GDP (+2°C ~ +8°C / -20°C)',
              'Giám sát nhiệt độ thời gian thực qua App',
              'Bảo hiểm dược phẩm GDP toàn trình',
            ],
            defaultVas: [
              'Bổ sung đá khô / Gel lạnh chuyên dụng tại transit',
              'Thùng giữ nhiệt công nghệ cao Envirotainer / Va-Q-tec',
              'Bảo hiểm dược phẩm GDP toàn trình',
            ],
          },
        ],
      },
      {
        id: 'air-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'air-haz-cargo',
            name: 'Air Cargo (Hàng nguy hiểm chuẩn IATA DGR)',
            code: 'Air Cargo',
            defaultFleet: 'Chuyên viên có chứng chỉ IATA DGR Category 6, bao bì UN certified',
            defaultOperation: 'Kiểm tra tem nhãn và lập Shipper Declaration for Dangerous Goods đúng chuẩn',
            defaultCommitment: '100% hàng hóa được chấp nhận bay mà không bị trả hàng do sai quy cách',
            vehicleLov: ['IATA DGR Cargo', 'Bao bì UN Certified'],
            unitLov: ['Kg', 'Kiện'],
            defaultRoutes: [
              {
                id: 'r-air-haz-1',
                route: 'SGN ⇄ ICN (Seoul)',
                origin: 'Sân bay Tân Sơn Nhất (TP.HCM)',
                destination: 'Sân bay Incheon (Hàn Quốc)',
                vehicleType: 'IATA DGR Cargo',
                pricingUnit: 'Kg',
                price: 175000,
                currency: 'VND',
                sla: '2 - 3 ngày',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Kiểm tra checklist hồ sơ DGR trước khi ra sân bay',
              'Dán tem nhãn phân lớp nguy hiểm IATA',
            ],
            defaultFreeSurcharges: [
              'Kiểm tra checklist hồ sơ DGR trước khi ra sân bay',
              'Dán tem nhãn phân lớp nguy hiểm IATA',
            ],
            paidSurchargeOptions: [
              { id: 'pdg-air-1', name: 'Phụ phí kiểm tra & tiếp nhận DG (Dangerous Goods Fee)', priceText: '$75 / AWB', isChecked: true },
              { id: 'pdg-air-2', name: 'Phí lưu kho khu cách ly nguy hiểm sân bay', priceText: '2,500 ₫ / Kg / Ngày', isChecked: false },
            ],
            vasOptions: [
              'Lập tờ khai DGR Shipper Declaration for Dangerous Goods',
              'Đóng gói bao bì chuẩn UN Certified Packaging',
              'Dán nhãn phân lớp IATA Dangerous Goods',
              'Kiểm tra an ninh bay chuyên biệt hàng nguy hiểm',
              'Bảo hiểm hàng nguy hiểm hàng không',
            ],
            defaultVas: [
              'Lập tờ khai DGR Shipper Declaration for Dangerous Goods',
              'Đóng gói bao bì chuẩn UN Certified Packaging',
              'Dán nhãn phân lớp IATA Dangerous Goods',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'rail',
    name: 'Đường sắt (Rail Freight)',
    serviceType: 'Trucking',
    icon: Train,
    cargoGroups: [
      {
        id: 'rail-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'rail-gen-fcl',
            name: 'FCL (Toa xe / Container nguyên Ga-Ga)',
            code: 'FCL',
            defaultFleet: 'Đoàn tàu hàng chuyên tuyến Bắc Nam & Ga Sóng Thần, Giáp Bát, Yên Viên',
            defaultOperation: 'Chạy đúng giờ theo biểu đồ chạy tàu của Tổng công ty Đường sắt VN',
            defaultCommitment: 'Tiết kiệm 30% chi phí so với đường bộ, an toàn tuyệt đối',
            vehicleLov: ['Container 20ft', 'Container 40ft'],
            unitLov: ['Cont'],
            defaultRoutes: [
              {
                id: 'r-rail-1',
                routeCode: 'RC-RAIL-001',
                route: 'Tuyến Bắc - Nam (Hà Nội ⇄ TP.HCM / Bình Dương)',
                origin: 'Ga Sóng Thần (Bình Dương / TP.HCM)',
                destination: 'Ga Giáp Bát (Hà Nội)',
                shippingLine: 'Đường Sắt Việt Nam (VNR)',
                vehicleType: 'Container 40ft GP / 40HC đường sắt —— (76 CBM / 28.5 Tấn)',
                pricingUnit: 'Cont',
                price: 21000000,
                currency: 'VND',
                sla: '65 - 72 Giờ',
                transitType: 'Direct',
                departureSchedule: 'Thứ 3, Thứ 6 hàng tuần (Cắt bãi ga 18:00)',
                freeDemDetDays: 7,
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Phí kẹp chì niêm phong an ninh đường sắt',
              'Phí nâng hạ container tại bãi ga (Rail Lo-Lo Fee)',
              'Phí vận đơn đường sắt (Railway Bill CIM/SMGS)',
            ],
            defaultFreeSurcharges: [
              'Phí kẹp chì niêm phong an ninh đường sắt',
              'Phí nâng hạ container tại bãi ga (Rail Lo-Lo Fee)',
            ],
            paidSurchargeOptions: [
              { id: 'prail-1', name: 'Phí lưu bãi ga & Lưu toa xe quá hạn', priceText: '150,000 ₫ / Cont / Ngày', isChecked: true },
              { id: 'prail-2', name: 'Phí kéo container First-mile / Last-mile', priceText: '1,800,000 ₫ / Chuyến', isChecked: false },
            ],
            vasOptions: [
              'Cẩu hạ container 2 đầu ga (Sóng Thần, Giáp Bát, Yên Viên)',
              'Kẹp chì niêm phong an ninh đường sắt',
              'Kéo container First-mile / Last-mile tận kho',
              'Chằng buộc lashing toa xe an toàn',
              'Bảo hiểm hàng hóa đường sắt 100%',
            ],
            defaultVas: [
              'Cẩu hạ container 2 đầu ga (Sóng Thần, Giáp Bát, Yên Viên)',
              'Kéo container First-mile / Last-mile tận kho',
              'Bảo hiểm hàng hóa đường sắt 100%',
            ],
          },
          {
            id: 'rail-gen-lcl',
            name: 'LCL (Hàng lẻ đóng ghép Ga-Ga)',
            code: 'LCL',
            defaultFleet: 'Toa xe hàng ghép liên tỉnh',
            defaultOperation: 'Gom hàng tại kho bãi ga, giao nhận tại các ga dọc tuyến Bắc Nam',
            defaultCommitment: 'Cước phí rẻ nhất cho hàng nặng, không sợ tắc đường',
            vehicleLov: RAIL_OPERATORS_LOV,
            unitLov: ['Kg'],
            defaultRoutes: [
              {
                id: 'r-rail-lcl-1',
                routeCode: 'RC-RAIL-LCL-001',
                route: 'Sài Gòn ⇄ Hà Nội',
                origin: 'Ga Sóng Thần (TP.HCM / Bình Dương)',
                destination: 'Ga Giáp Bát (Hà Nội)',
                vehicleType: 'Đường Sắt Việt Nam (VNR)',
                pricingUnit: 'Kg',
                price: 1100,
                currency: 'VND',
                sla: 'Thứ 3, Thứ 6 (Cắt hàng bãi ga 18:00)',
                transitType: 'Direct',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 5,
                ltlPricing: createDefaultLtlPricingConfig('weight', 1100, 320000),
              },
            ],
            freeSurchargeOptions: [
              'Bốc dỡ sang toa tại bãi ga',
              'Cấp biên bản giao nhận hàng hóa đường sắt',
            ],
            defaultFreeSurcharges: [
              'Bốc dỡ sang toa tại bãi ga',
            ],
            paidSurchargeOptions: [
              { id: 'prail-lcl', name: 'Giao nhận tận nơi Door-to-Door', priceText: 'Theo cự ly km', isChecked: true },
              { id: 'prail-lcl-2', name: 'Phí lưu kho ga quá 48h', priceText: '20,000 ₫ / Kiện / Ngày', isChecked: false },
            ],
            vasOptions: [
              'Bốc xếp tại bãi kho ga',
              'Vận chuyển tận nơi Door-to-Door',
              'Đóng gói bọc màng PE chống bụi',
              'Thu hộ tiền hàng COD tại ga đến',
            ],
            defaultVas: [
              'Bốc xếp tại bãi kho ga',
              'Vận chuyển tận nơi Door-to-Door',
            ],
          },
        ],
      },
      {
        id: 'rail-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'rail-ref-fcl',
            name: 'FCL (Container lạnh đường sắt)',
            code: 'FCL',
            defaultFleet: 'Container lạnh 40ft trang bị máy phát điện Genset hoạt động suốt chuyến',
            defaultOperation: 'Kỹ thuật viên kiểm tra nhiệt độ tại mỗi ga dừng chính',
            defaultCommitment: 'Nhiệt độ ổn định -20°C suốt tuyến Bắc Nam',
            vehicleLov: ['Container 40RF đường sắt'],
            unitLov: ['Cont 40RF', 'Chuyến'],
            defaultRoutes: [
              {
                id: 'r-rail-ref-1',
                routeCode: 'RC-RAIL-REF-001',
                route: 'Tuyến Liên Vận Quốc Tế (Việt Nam ⇄ Trung Quốc / Châu Âu qua Ga Đồng Đăng)',
                origin: 'Ga Sóng Thần (Bình Dương)',
                destination: 'Ga Đồng Đăng (Lạng Sơn)',
                shippingLine: 'Công ty CP Vận tải & Thương mại Đường sắt (Ratraco)',
                vehicleType: 'Container 40RF Lạnh đường sắt —— (Kèm máy phát điện Genset -20°C)',
                pricingUnit: 'Cont 40RF',
                price: 34000000,
                currency: 'VND',
                sla: '72 Giờ',
                transitType: 'Direct',
                departureSchedule: 'Thứ 2, Thứ 5 hàng tuần (Cắt bãi ga 16:00)',
                freeDemDetDays: 5,
                validUntil: '2026-12-31',
                pricingStyle: 'All-in',
                promotionPercent: 5,
              },
            ],
            freeSurchargeOptions: [
              'Cấp điện máy phát Genset liên tục trên toa',
              'Kiểm tra kỹ thuật nhiệt độ từng chặng ga',
            ],
            defaultFreeSurcharges: [
              'Cấp điện máy phát Genset liên tục trên toa',
              'Kiểm tra kỹ thuật nhiệt độ từng chặng ga',
            ],
            paidSurchargeOptions: [
              { id: 'pr-ref', name: 'Phí cắm điện lưu bãi ga chờ dỡ', priceText: '350,000 ₫ / Ngày', isChecked: true },
              { id: 'pr-ref-sangtoa', name: 'Phí chuyển tải sang toa liên vận TQ', priceText: '1,500,000 ₫ / Cont', isChecked: false },
            ],
            vasOptions: [
              'Cấp điện máy phát Genset liên tục trên toa xe lạnh',
              'Kiểm tra kỹ thuật nhiệt độ từng chặng ga',
              'Thủ tục hải quan liên vận quốc tế sang TQ qua Ga Đồng Đăng',
              'Bảo hiểm đứt gãy nhiệt độ đường sắt',
            ],
            defaultVas: [
              'Cấp điện máy phát Genset liên tục trên toa xe lạnh',
              'Thủ tục hải quan liên vận quốc tế sang TQ qua Ga Đồng Đăng',
            ],
          },
        ],
      },
      {
        id: 'rail-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'rail-haz-fcl',
            name: 'FCL (Toa xe / Container nguy hiểm đường sắt)',
            code: 'FCL',
            defaultFleet: 'Toa xe chuyên biệt cách ly an toàn theo quy chuẩn Đường sắt',
            defaultOperation: 'Áp tải kỹ thuật an toàn theo quy định vận chuyển hóa chất',
            defaultCommitment: 'An toàn tuyệt đối trên đường ray',
            vehicleLov: ['Container nguy hiểm đường sắt', 'Toa xi-téc hóa chất'],
            unitLov: ['Cont 40ft', 'Toa xe'],
            defaultRoutes: [
              {
                id: 'r-rail-haz-1',
                routeCode: 'RC-RAIL-HAZ-001',
                route: 'Tuyến Bắc - Nam (Hà Nội ⇄ TP.HCM / Bình Dương)',
                origin: 'Ga Sóng Thần (Bình Dương)',
                destination: 'Ga Yên Viên (Hà Nội)',
                shippingLine: 'Công ty CP Vận tải Đường sắt Hà Nội (Haraco)',
                vehicleType: 'Container 40ft IMO Hazmat đường sắt —— (Hóa chất đóng pallet/kiện)',
                pricingUnit: 'Cont 40ft',
                price: 38000000,
                currency: 'VND',
                sla: '4 - 5 Ngày',
                transitType: 'Direct',
                departureSchedule: 'Thứ 4, Thứ 7 hàng tuần (Cắt bãi ga 17:00)',
                freeDemDetDays: 5,
                validUntil: '2026-12-31',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Trang bị bình PCCC chuyên dụng trên toa',
              'Kiểm tra kỹ thuật an toàn chốt nối định kỳ',
            ],
            defaultFreeSurcharges: [
              'Trang bị bình PCCC chuyên dụng trên toa',
            ],
            paidSurchargeOptions: [
              { id: 'pr-haz', name: 'Phí áp tải an toàn đường sắt chuyên biệt', priceText: '2,000,000 ₫ / Chuyến', isChecked: true },
              { id: 'pr-haz-pccc', name: 'Phí trực ban PCCC tại bãi ga', priceText: '800,000 ₫ / Ca', isChecked: false },
            ],
            vasOptions: [
              'Toa xe chuyên dụng cách ly an toàn',
              'Áp tải kỹ thuật an toàn hóa chất đường ray',
              'Hồ sơ an toàn hóa chất đường sắt',
              'Bảo hiểm bồi thường sự cố môi trường',
            ],
            defaultVas: [
              'Toa xe chuyên dụng cách ly an toàn',
              'Áp tải kỹ thuật an toàn hóa chất đường ray',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'warehousing',
    name: 'Kho bãi 3PL (Warehousing)',
    serviceType: 'Warehousing',
    icon: Building2,
    cargoGroups: [
      {
        id: 'wh-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'wh-gen-std',
            name: 'Kho thường (Kho tiêu chuẩn)',
            code: 'Kho thường',
            defaultFleet: 'Hệ thống kho 15,000m² tại KCN Sóng Thần, VSIP, Tân Bình, Bắc Ninh',
            defaultOperation: 'Phần mềm WMS quản lý tồn kho Real-time, quét mã vạch Barcode/RFID',
            defaultCommitment: 'Chính xác tồn kho 99.9%, xuất nhập hàng trong vòng 2 - 4 giờ',
            vehicleLov: ['Kho thường Grade A', 'Kho phân phối DC', 'Kho tiêu chuẩn'],
            unitLov: ['m² / Tháng', 'Pallet / Ngày', 'm³ / Tháng', 'Tấn / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-1',
                routeCode: 'WH-BD-001',
                warehouseCode: 'WH-BD-001',
                route: 'Kho KCN Sóng Thần 1',
                warehouseName: 'Kho KCN Sóng Thần 1',
                origin: 'Bình Dương',
                warehouseProvince: 'Bình Dương',
                destination: 'KCN Sóng Thần 1, Dĩ An',
                warehouseAddress: 'KCN Sóng Thần 1, Dĩ An',
                vehicleType: 'Kho thường Grade A',
                pricingUnit: 'm² / Tháng',
                price: 95000,
                pricePerArea: 95000,
                pricePerPallet: 110000,
                pricePerVolume: 120000,
                capacityArea: 2500,
                capacityPallets: 1800,
                capacityVolume: 3000,
                minChargeMonthly: 3000000,
                currency: 'VND',
                sla: 'Xuất nhập 2 - 4h',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Bảo vệ 24/7 & Camera an ninh giám sát',
              'Bảo hiểm cháy nổ kho bãi 100%',
              'Phần mềm WMS quản lý tồn kho thời gian thực',
            ],
            defaultFreeSurcharges: [
              'Bảo vệ 24/7 & Camera an ninh giám sát',
              'Bảo hiểm cháy nổ kho bãi 100%',
              'Phần mềm WMS quản lý tồn kho thời gian thực',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-1', name: 'Phí nâng hạ & dỡ hàng nhập kho (Inbound)', priceText: '35,000 ₫ / Pallet', isChecked: true },
              { id: 'pwh-2', name: 'Phí lấy hàng & bốc xếp xuất kho (Outbound)', priceText: '35,000 ₫ / Pallet', isChecked: true },
              { id: 'pwh-3', name: 'Phí rút ruột container thủ công & lên Pallet', priceText: '1,200,000 ₫ / Cont 40ft', isChecked: false },
              { id: 'pwh-4', name: 'Phí làm việc ngoài giờ hành chính', priceText: '200,000 ₫ / Giờ', isChecked: false },
            ],
            vasOptions: [
              'Dán tem phụ tiếng Việt / Barcode SKU',
              'Quấn màng co PE Pallet & Đóng đai bảo vệ',
              'Đóng gói Kitting combo / Hộp quà',
              'Kiểm đếm quét mã vạch Barcode/RFID',
              'Bảo hiểm cháy nổ kho bãi 100%',
            ],
            defaultVas: [
              'Dán tem phụ tiếng Việt / Barcode SKU',
              'Quấn màng co PE Pallet & Đóng đai bảo vệ',
              'Bảo hiểm cháy nổ kho bãi 100%',
            ],
          },
          {
            id: 'wh-gen-bon',
            name: 'Kho ngoại quan (Bonded Warehouse)',
            code: 'Kho ngoại quan',
            defaultFleet: 'Kho ngoại quan đạt chuẩn hải quan gần cảng Cát Lái & Đình Vũ',
            defaultOperation: 'Thủ tục hải quan kho ngoại quan nhanh chóng, quản lý theo dõi tờ khai chi tiết',
            defaultCommitment: 'Bảo mật an toàn hàng hóa, hỗ trợ thủ tục hải quan 24/7',
            vehicleLov: ['Kho ngoại quan gần cảng biển'],
            unitLov: ['m² / Tháng', 'Pallet / Ngày'],
            defaultRoutes: [
              {
                id: 'r-wh-bon-1',
                customsWarehouseCode: '02B1B01',
                warehouseCode: '02B1B01',
                routeCode: '02B1B01',
                warehouseName: 'Kho Ngoại Quan & CFS Cát Lái',
                route: 'Kho Ngoại Quan & CFS Cát Lái',
                customsAuthority: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV4 (Cát Lái / ICD Phước Long)',
                warehouseProvince: 'TP. Hồ Chí Minh',
                origin: 'TP. Hồ Chí Minh',
                warehouseAddress: 'Khu thương mại Cát Lái, P. Cát Lái, TP. Thủ Đức',
                destination: 'Khu thương mại Cát Lái, P. Cát Lái, TP. Thủ Đức',
                vehicleType: 'Kho ngoại quan gần cảng biển',
                pricingUnit: 'CBM / Ngày',
                price: 0.35,
                pricePerVolume: 0.35,
                pricePerPallet: 0.45,
                pricePerArea: 6.5,
                capacityArea: 5000,
                capacityVolume: 8000,
                capacityPallets: 4200,
                currency: 'USD',
                sla: 'Tiếp nhận cont 24/7 (HQ 8h-17h)',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Báo cáo tồn kho định kỳ cơ quan hải quan',
              'Bảo vệ chuyên nghiệp & Camera giám sát 3 lớp',
            ],
            defaultFreeSurcharges: [
              'Báo cáo tồn kho định kỳ cơ quan hải quan',
              'Bảo vệ chuyên nghiệp & Camera giám sát 3 lớp',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-bon-1', name: 'Phí mở & thanh khoản tờ khai kho ngoại quan', priceText: '800,000 ₫ / Bộ', isChecked: true },
              { id: 'pwh-bon-2', name: 'Phí nâng hạ bốc xếp pallet kho ngoại quan', priceText: '45,000 ₫ / Pallet', isChecked: true },
            ],
            vasOptions: [
              'Khai báo hải quan mở & thanh khoản kho ngoại quan',
              'Hun trùng kiểm dịch gỗ ISPM 15',
              'Tách ghép chia chọn hàng xuất khẩu',
              'Báo cáo tồn kho định kỳ cơ quan hải quan',
              'Bảo hiểm hàng hóa ngoại quan',
            ],
            defaultVas: [
              'Khai báo hải quan mở & thanh khoản kho ngoại quan',
              'Hun trùng kiểm dịch gỗ ISPM 15',
            ],
          },
          {
            id: 'wh-gen-ful',
            name: 'Kho TMĐT / Fulfillment',
            code: 'Kho Fulfillment',
            defaultFleet: 'Kho fulfillment trang bị băng chuyền nhặt hàng & phần mềm WMS Real-time',
            defaultOperation: 'Tích hợp API với Shopee, TikTok Shop, Lazada, tự động in đơn và đóng gói',
            defaultCommitment: 'Đóng gói và giao đơn cho đơn vị vận chuyển trong vòng 12 giờ',
            vehicleLov: ['Kho TMĐT E-Commerce'],
            unitLov: ['Đơn hàng', 'Sản phẩm (Item)'],
            defaultRoutes: [
              {
                id: 'r-wh-ful-1',
                routeCode: 'FUL-HCM-01',
                warehouseCode: 'FUL-HCM-01',
                route: 'Trung Tâm Fulfillment Tân Bình (TP.HCM)',
                warehouseName: 'Trung Tâm Fulfillment Tân Bình (TP.HCM)',
                origin: 'TP. Hồ Chí Minh',
                warehouseProvince: 'TP. Hồ Chí Minh',
                destination: 'KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú',
                warehouseAddress: 'KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú',
                vehicleType: 'Kho TMĐT E-Commerce',
                pricingUnit: 'Đơn hàng',
                price: 8500,
                pickPackPrice: 8500,
                extraItemPrice: 1500,
                bufferStoragePrice: 120000,
                dailyOrderCapacity: 3500,
                maxSkuCount: 5000,
                bufferCapacity: 500,
                bufferUnit: 'Pallet',
                minChargeMonthly: 5000000,
                currency: 'VND',
                sla: 'Đóng gói < 2h (Cut-off 16h)',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Đồng bộ API tự động với các sàn Shopee/TikTok/Lazada',
              'Cập nhật tồn kho SKU thời gian thực',
            ],
            defaultFreeSurcharges: [
              'Đồng bộ API tự động với các sàn Shopee/TikTok/Lazada',
              'Cập nhật tồn kho SKU thời gian thực',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-ful-1', name: 'Phí xử lý đơn hàng hoàn (Reverse Logistics)', priceText: '5,000 ₫ / Đơn hoàn', isChecked: true },
              { id: 'pwh-ful-2', name: 'Phí đóng thùng carton kích thước lớn', priceText: '4,000 ₫ / Hộp', isChecked: false },
            ],
            vasOptions: [
              'Đồng bộ API tự động với sàn Shopee, TikTok Shop, Lazada',
              'In đơn, đóng gói carton & bàn giao hỏa tốc < 12h',
              'Xử lý hàng hoàn đổi trả (Reverse Logistics)',
              'Chèn thiệp cảm ơn & Quà tặng combo',
              'Dán tem barcode SKU lẻ',
            ],
            defaultVas: [
              'Đồng bộ API tự động với sàn Shopee, TikTok Shop, Lazada',
              'In đơn, đóng gói carton & bàn giao hỏa tốc < 12h',
              'Chèn thiệp cảm ơn & Quà tặng combo',
            ],
          },
          {
            id: 'wh-gen-self',
            name: 'Kho tự quản (Self-Storage)',
            code: 'Kho tự quản',
            defaultFleet: 'Hệ thống khoang chứa mini tự quản có khóa số cá nhân & camera 24/7',
            defaultOperation: 'Khách hàng tự do ra vào 24/7 bằng thẻ từ hoặc vân tay',
            defaultCommitment: 'Bảo mật riêng tư tuyệt đối, bảo hiểm tài sản 100%',
            vehicleLov: ['Khoang tự quản Mini Storage'],
            unitLov: ['m³ / Tháng', 'Khoang / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-self-1',
                routeCode: 'SELF-HCM-01',
                warehouseCode: 'SELF-HCM-01',
                route: 'Kho Tự Quản Tân Bình (TP.HCM)',
                warehouseName: 'Kho Tự Quản Tân Bình (TP.HCM)',
                origin: 'TP. Hồ Chí Minh',
                warehouseProvince: 'TP. Hồ Chí Minh',
                destination: 'KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú',
                warehouseAddress: 'KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú',
                vehicleType: 'Khoang sàn tự quản',
                pricingUnit: 'm² / Tháng',
                price: 180000,
                pricePerArea: 180000,
                pricePerVolume: 75000,
                capacityArea: 800,
                capacityVolume: 2400,
                storageUnitsCount: 45,
                minChargeMonthly: 1000000,
                currency: 'VND',
                sla: 'Ra vào tự do 24/7 (Thẻ từ)',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Ra vào tự do 24/7 bằng khóa vân tay/thẻ từ',
              'Hệ thống chiếu sáng & Wifi miễn phí',
              'Sử dụng xe đẩy nội bộ miễn phí',
            ],
            defaultFreeSurcharges: [
              'Ra vào tự do 24/7 bằng khóa vân tay/thẻ từ',
              'Hệ thống chiếu sáng & Wifi miễn phí',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-self-1', name: 'Bộ vật tư đóng gói (Thùng carton, màng xốp, băng keo)', priceText: '150,000 ₫ / Bộ', isChecked: true },
              { id: 'pwh-self-2', name: 'Bảo hiểm tài sản mở rộng giá trị cao', priceText: '100,000 ₫ / Tháng', isChecked: false },
            ],
            vasOptions: [
              'Bảo hiểm tài sản khoang tự quản',
              'Khóa số độc lập & Truy cập 24/7',
              'Cung cấp vật tư đóng gói tại chỗ',
              'Hỗ trợ xe đẩy bốc dỡ nội bộ',
            ],
            defaultVas: [
              'Bảo hiểm tài sản khoang tự quản',
              'Khóa số độc lập & Truy cập 24/7',
            ],
          },
        ],
      },
      {
        id: 'wh-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'wh-ref-cold',
            name: 'Kho lạnh & Kho mát (Cold Storage)',
            code: 'Kho lạnh',
            defaultFleet: 'Kho lạnh đa nhiệt độ (-25°C ~ +15°C) sức chứa 8,000 Pallets',
            defaultOperation: 'Hệ thống quản lý hạn sử dụng FIFO/FEFO tự động, giám sát nhiệt độ IoT',
            defaultCommitment: 'Đảm bảo nhiệt độ chuẩn 100%, bảo hiểm suy giảm chất lượng thực phẩm',
            vehicleLov: ['Kho lạnh (-25°C ~ -18°C)', 'Kho mát (+2°C ~ +8°C)', 'Kho điều hòa (+15°C ~ +22°C)'],
            unitLov: ['Pallet / Ngày', 'Tấn / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-ref-1',
                route: 'Kho Lạnh VSIP (Bình Dương)',
                origin: 'KCN VSIP 1 (Bình Dương)',
                destination: 'Lưu trữ & Phân phối lạnh',
                vehicleType: 'Kho lạnh (-25°C ~ -18°C)',
                pricingUnit: 'Pallet / Ngày',
                price: 22000,
                currency: 'VND',
                sla: 'Bảo quản liên tục 24/7',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Cảm biến giám sát nhiệt độ IoT 24/7',
              'Xuất biểu đồ nhiệt độ lưu kho định kỳ',
              'Hệ thống máy phát điện dự phòng tự động',
            ],
            defaultFreeSurcharges: [
              'Cảm biến giám sát nhiệt độ IoT 24/7',
              'Xuất biểu đồ nhiệt độ lưu kho định kỳ',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-cold-1', name: 'Phí cấp đông nhanh (Blast Freezing)', priceText: '500,000 ₫ / Tấn', isChecked: true },
              { id: 'pwh-cold-2', name: 'Phí bốc xếp xe nâng kho lạnh', priceText: '40,000 ₫ / Pallet', isChecked: true },
            ],
            vasOptions: [
              'Cấp đông nhanh Pre-cooling / Blast Freezing',
              'Quản lý hạn sử dụng chuẩn FIFO / FEFO',
              'Cảm biến giám sát nhiệt độ IoT 24/7',
              'Xuất biểu đồ nhiệt độ lưu kho định kỳ',
              'Bảo hiểm hư hỏng do mất nhiệt độ',
            ],
            defaultVas: [
              'Quản lý hạn sử dụng chuẩn FIFO / FEFO',
              'Cảm biến giám sát nhiệt độ IoT 24/7',
              'Bảo hiểm hư hỏng do mất nhiệt độ',
            ],
          },
          {
            id: 'wh-ref-bon',
            name: 'Kho ngoại quan (Bonded Cold)',
            code: 'Kho ngoại quan lạnh',
            defaultFleet: 'Kho ngoại quan lạnh chuyên dụng gần cảng Cát Lái & Hải Phòng',
            defaultOperation: 'Thủ tục hải quan và kiểm dịch nhanh chóng cho nông thủy sản xuất nhập khẩu',
            defaultCommitment: 'Lưu trữ an toàn trong thời gian chờ thông quan',
            vehicleLov: ['Kho ngoại quan lạnh'],
            unitLov: ['Pallet / Ngày', 'Tấn / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-ref-bon-1',
                customsWarehouseCode: '02B1B08-RF',
                warehouseCode: '02B1B08-RF',
                routeCode: '02B1B08-RF',
                warehouseName: 'Kho Ngoại Quan Lạnh Đình Vũ - Hải Phòng',
                route: 'Kho Ngoại Quan Lạnh Đình Vũ - Hải Phòng',
                customsAuthority: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Đình Vũ)',
                warehouseProvince: 'Hải Phòng',
                origin: 'Hải Phòng',
                warehouseAddress: 'KCN Đình Vũ, P. Đông Hải 2, Q. Hải An, TP. Hải Phòng',
                destination: 'KCN Đình Vũ, P. Đông Hải 2, Q. Hải An, TP. Hải Phòng',
                vehicleType: 'Kho ngoại quan lạnh',
                pricingUnit: 'Pallet / Ngày',
                price: 28000,
                pricePerVolume: 0.55,
                pricePerPallet: 0.75,
                pricePerArea: 9.5,
                capacityArea: 3500,
                capacityVolume: 6000,
                capacityPallets: 2800,
                currency: 'USD',
                sla: 'Tiếp nhận cont lạnh 24/7',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Báo cáo nhiệt độ gửi cơ quan kiểm dịch',
              'Giám sát chuỗi lạnh không đứt gãy 24/7',
            ],
            defaultFreeSurcharges: [
              'Báo cáo nhiệt độ gửi cơ quan kiểm dịch',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-ref-bon-1', name: 'Phí lấy mẫu kiểm dịch tại kho', priceText: '500,000 ₫ / Lô', isChecked: true },
              { id: 'pwh-ref-bon-2', name: 'Phí nâng hạ bốc dỡ hàng đông lạnh', priceText: '50,000 ₫ / Pallet', isChecked: true },
            ],
            vasOptions: [
              'Kiểm dịch thực vật / Động vật nông thủy sản',
              'Thủ tục hải quan tạm nhập tái xuất lạnh',
              'Báo cáo nhiệt độ gửi cơ quan kiểm dịch',
              'Lấy mẫu kiểm tra vệ sinh ATTP',
            ],
            defaultVas: [
              'Kiểm dịch thực vật / Động vật nông thủy sản',
              'Thủ tục hải quan tạm nhập tái xuất lạnh',
            ],
          },
          {
            id: 'wh-ref-self',
            name: 'Kho tự quản (Self-Storage Lạnh)',
            code: 'Khoang lạnh tự quản',
            defaultFleet: 'Khoang mini trữ lạnh cá nhân (-18°C đến +5°C) có khóa số riêng biệt',
            defaultOperation: 'Tự do truy cập 24/7, máy phát điện dự phòng tự động chuyển mạch trong 5 giây',
            defaultCommitment: 'Bảo quản hoàn hảo cho thực phẩm nhập khẩu và mẫu nghiên cứu sinh học',
            vehicleLov: ['Khoang lạnh tự quản'],
            unitLov: ['m³ / Tháng', 'Khoang / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-ref-self-1',
                route: 'Khoang Lạnh Tự Quản Thủ Đức (TP.HCM)',
                origin: 'TP. Thủ Đức (TP.HCM)',
                destination: 'Lưu trữ lạnh cá nhân',
                vehicleType: 'Khoang lạnh tự quản',
                pricingUnit: 'm³ / Tháng',
                price: 850000,
                currency: 'VND',
                sla: 'Truy cập 24/7',
                pricingStyle: 'All-in',
                promotionPercent: 15,
              },
            ],
            freeSurchargeOptions: [
              'Điện máy phát dự phòng tự động trong 5 giây',
              'Khóa từ độc lập & Camera giám sát 24/7',
            ],
            defaultFreeSurcharges: [
              'Điện máy phát dự phòng tự động trong 5 giây',
              'Khóa từ độc lập & Camera giám sát 24/7',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-ref-self-1', name: 'Thùng xốp bảo ôn & Đá gel bổ sung', priceText: '80,000 ₫ / Bộ', isChecked: true },
            ],
            vasOptions: [
              'Khoang lạnh độc lập (-18°C ~ +5°C)',
              'Backup điện máy phát tự động trong 5 giây',
              'Khóa từ độc lập & Camera 24/7',
              'Cung cấp đá gel / Thùng xốp bảo quản',
            ],
            defaultVas: [
              'Backup điện máy phát tự động trong 5 giây',
              'Khóa từ độc lập & Camera 24/7',
            ],
          },
        ],
      },
      {
        id: 'wh-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'wh-haz-std',
            name: 'Kho nguy hiểm (Hazmat Storage)',
            code: 'Kho hóa chất',
            defaultFleet: 'Kho hóa chất chuyên dụng PCCC tự động bọt Foam, rãnh chống tràn và giấy phép liên bộ',
            defaultOperation: 'Nhân viên kho có chứng chỉ an toàn hóa chất, hệ thống thông gió chống nổ 24/7',
            defaultCommitment: 'An toàn tuyệt đối, tuân thủ nghiêm ngặt Luật Hóa chất',
            vehicleLov: ['Kho hóa chất chuyên dụng', 'Kho chứa hàng nguy hiểm DG'],
            unitLov: ['m² / Tháng', 'Tấn / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-haz-1',
                route: 'Kho Hóa Chất Nhơn Trạch (Đồng Nai)',
                origin: 'KCN Nhơn Trạch (Đồng Nai)',
                destination: 'Lưu trữ hóa chất công nghiệp',
                vehicleType: 'Kho hóa chất chuyên dụng',
                pricingUnit: 'm² / Tháng',
                price: 180000,
                currency: 'VND',
                sla: 'Bảo quản an toàn 24/7',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Hệ thống PCCC tự động bọt Foam',
              'Rãnh thu gom hóa chất tràn & Bể chứa sự cố',
              'Thông gió chống cháy nổ 24/7',
            ],
            defaultFreeSurcharges: [
              'Hệ thống PCCC tự động bọt Foam',
              'Rãnh thu gom hóa chất tràn & Bể chứa sự cố',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-haz-1', name: 'Phí xử lý & tiêu hủy bao bì nguy hại', priceText: 'Theo khối lượng kg', isChecked: true },
              { id: 'pwh-haz-2', name: 'Phí bốc dỡ phuy/bồn hóa chất chuyên dụng', priceText: '60,000 ₫ / Phuy', isChecked: true },
            ],
            vasOptions: [
              'Hệ thống PCCC bọt Foam tự động',
              'Rãnh thu gom hóa chất tràn & Bể chứa sự cố',
              'Bảo hiểm trách nhiệm bồi thường môi trường',
              'Báo cáo tồn kho hóa chất gửi Sở Công Thương',
              'Đội ứng phó sự cố hóa chất túc trực 24/7',
            ],
            defaultVas: [
              'Hệ thống PCCC bọt Foam tự động',
              'Bảo hiểm trách nhiệm bồi thường môi trường',
              'Báo cáo tồn kho hóa chất gửi Sở Công Thương',
            ],
          },
          {
            id: 'wh-haz-bon',
            name: 'Kho ngoại quan (Bonded Hazmat)',
            code: 'Ngoại quan hóa chất',
            defaultFleet: 'Kho ngoại quan chuyên dụng cho nguyên liệu hóa chất và hạt nhựa',
            defaultOperation: 'Khai báo hóa chất ngoại quan trên Cổng thông tin một cửa quốc gia trong ngày',
            defaultCommitment: 'Hồ sơ pháp lý đầy đủ, an toàn lưu kho cao nhất',
            vehicleLov: ['Kho ngoại quan hóa chất'],
            unitLov: ['m² / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-haz-bon-1',
                customsWarehouseCode: '02IKB06-DG',
                warehouseCode: '02IKB06-DG',
                routeCode: '02IKB06-DG',
                warehouseName: 'Kho Ngoại Quan Hóa Chất Đình Vũ (DG & Hazmat)',
                route: 'Kho Ngoại Quan Hóa Chất Đình Vũ (DG & Hazmat)',
                customsAuthority: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Đình Vũ)',
                warehouseProvince: 'Hải Phòng',
                origin: 'Hải Phòng',
                warehouseAddress: 'Khu Hóa Chất Chuyên Dụng Đình Vũ, Q. Hải An, TP. Hải Phòng',
                destination: 'Khu Hóa Chất Chuyên Dụng Đình Vũ, Q. Hải An, TP. Hải Phòng',
                vehicleType: 'Kho ngoại quan hóa chất',
                pricingUnit: 'm² / Tháng',
                price: 220000,
                pricePerVolume: 0.65,
                pricePerPallet: 0.85,
                pricePerArea: 11.0,
                capacityArea: 3000,
                capacityVolume: 5000,
                capacityPallets: 2200,
                currency: 'USD',
                sla: 'Thủ tục HQ & Giám sát an toàn 24/7',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Khai báo hóa chất trên cổng một cửa quốc gia',
              'Lưu trữ hồ sơ MSDS điện tử',
            ],
            defaultFreeSurcharges: [
              'Khai báo hóa chất trên cổng một cửa quốc gia',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-haz-bon-1', name: 'Phí giám định chất lượng hóa chất nhập khẩu', priceText: 'Theo biểu phí Vinacontrol', isChecked: true },
            ],
            vasOptions: [
              'Khai báo hóa chất một cửa quốc gia',
              'Giám định chất lượng hóa chất chuyên ngành',
              'Lưu mẫu thử nghiệm an toàn',
              'Thủ tục hải quan ngoại quan hóa chất',
            ],
            defaultVas: [
              'Khai báo hóa chất một cửa quốc gia',
              'Giám định chất lượng hóa chất chuyên ngành',
            ],
          },
          {
            id: 'wh-haz-self',
            name: 'Kho tự quản (Self-Storage Nguy hiểm)',
            code: 'Khoang nguy hiểm tự quản',
            defaultFleet: 'Khoang cách ly mini chống cháy nổ cho mẫu hóa chất thử nghiệm & phụ gia đặc thù',
            defaultOperation: 'Kiểm soát ra vào nghiêm ngặt bằng vân tay và camera giám sát nồng độ khí',
            defaultCommitment: 'An toàn phòng chống cháy nổ tuyệt đối',
            vehicleLov: ['Khoang tự quản hóa chất'],
            unitLov: ['Khoang / Tháng'],
            defaultRoutes: [
              {
                id: 'r-wh-haz-self-1',
                route: 'Khoang Hóa Chất Tự Quản Khu Công Nghệ Cao (TP.HCM)',
                origin: 'Khu Công Nghệ Cao (TP.HCM)',
                destination: 'Lưu mẫu thử nghiệm R&D',
                vehicleType: 'Khoang tự quản hóa chất',
                pricingUnit: 'Khoang / Tháng',
                price: 1200000,
                currency: 'VND',
                sla: 'Truy cập an toàn',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Tủ an toàn chống cháy nổ cách ly chuyên biệt',
              'Cảm biến tự động cảnh báo nồng độ khí',
            ],
            defaultFreeSurcharges: [
              'Tủ an toàn chống cháy nổ cách ly chuyên biệt',
            ],
            paidSurchargeOptions: [
              { id: 'pwh-haz-self-1', name: 'Phí kiểm tra an toàn PCCC định kỳ', priceText: '200,000 ₫ / Tháng', isChecked: true },
            ],
            vasOptions: [
              'Tủ an toàn chống cháy nổ cách ly',
              'Cảm biến cảnh báo nồng độ khí rò rỉ',
              'Kiểm soát ra vào vân tay bảo mật',
              'Bảo hiểm rủi ro cháy nổ hóa chất',
            ],
            defaultVas: [
              'Tủ an toàn chống cháy nổ cách ly',
              'Cảm biến cảnh báo nồng độ khí rò rỉ',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'customs',
    name: 'Thủ tục hải quan (Customs Clearance)',
    serviceType: 'Customs Clearance',
    icon: FileText,
    cargoGroups: [
      {
        id: 'cus-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'cus-gen-std',
            name: 'Hàng thường (Khai báo hải quan hàng bách hóa, xuất nhập khẩu)',
            code: 'Hải quan hàng thường',
            defaultFleet: 'Đội ngũ 30 khai báo viên có chứng chỉ Tổng cục Hải quan tại 18 chi cục',
            defaultOperation: 'Truyền tờ khai điện tử qua phần mềm ECUS/VNACCS trong 30 phút, xử lý luồng Vàng/Đỏ nhanh gọn',
            defaultCommitment: 'Thông quan trong 4 - 8 giờ cho luồng Xanh/Vàng, không phát sinh chi phí phạt',
            vehicleLov: ['Tờ khai Xuất/Nhập Kinh Doanh', 'Tờ khai Gia Công & SXXK', 'Tờ khai Chế Xuất EPE', 'Tờ khai Tạm Nhập Tái Xuất'],
            unitLov: ['Tờ khai', 'Bộ chứng từ', 'Lô hàng'],
            defaultRoutes: [
              {
                id: 'r-cus-1',
                routeCode: 'CUS-CL-01',
                route: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                customsBranchName: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                origin: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                customsAreaName: 'Cảng Cát Lái (TP.HCM)',
                destination: 'Cảng Cát Lái (TP.HCM)',
                customsDeclarationType: 'Tất cả loại hình (A11, E21, E31, B11...)',
                vehicleType: 'Tất cả loại hình (A11, E21, E31, B11...)',
                pricingUnit: 'Tờ khai',
                price: 850000,
                customsExtraItemPrice: 250000,
                customsRedChannelPrice: 600000,
                customsServiceForm: 'Đại lý Hải quan chính thức',
                currency: 'VND',
                sla: 'Luồng Vàng 2-4h',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 15,
              },
              {
                id: 'r-cus-2',
                routeCode: 'CUS-TSN-01',
                route: 'Chi cục HQ Cửa khẩu Sân bay Quốc tế Tân Sơn Nhất',
                customsBranchName: 'Chi cục HQ Cửa khẩu Sân bay Quốc tế Tân Sơn Nhất',
                origin: 'Chi cục HQ Cửa khẩu Sân bay Quốc tế Tân Sơn Nhất',
                customsAreaName: 'Sân bay Tân Sơn Nhất (TP.HCM)',
                destination: 'Sân bay Tân Sơn Nhất (TP.HCM)',
                customsDeclarationType: 'Tất cả loại hình (A11, E21, E31, B11...)',
                vehicleType: 'Tất cả loại hình (A11, E21, E31, B11...)',
                pricingUnit: 'Tờ khai',
                price: 950000,
                customsExtraItemPrice: 250000,
                customsRedChannelPrice: 700000,
                customsServiceForm: 'Đại lý Hải quan chính thức',
                currency: 'VND',
                sla: 'Luồng Vàng 1-2h',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Tư vấn áp mã HS Code & Thuế suất chuẩn xác',
              'Kiểm tra đối soát trước bộ chứng từ Invoice / Packing List',
              'Truyền tờ khai hải quan điện tử VNACCS',
            ],
            defaultFreeSurcharges: [
              'Tư vấn áp mã HS Code & Thuế suất chuẩn xác',
              'Kiểm tra đối soát trước bộ chứng từ Invoice / Packing List',
            ],
            paidSurchargeOptions: [
              { id: 'pcus-1', name: 'Phí hỗ trợ kiểm hóa thực tế luồng Đỏ', priceText: '500,000 ₫ / Cont', isChecked: true },
              { id: 'pcus-2', name: 'Phí xin C/O các Form D, E, EUR.1, VK', priceText: '600,000 ₫ / Bộ', isChecked: false },
              { id: 'pcus-3', name: 'Phí đại diện tham vấn giá tại chi cục HQ', priceText: '1,000,000 ₫ / Vụ việc', isChecked: false },
            ],
            vasOptions: [
              'Xin cấp C/O các form (Form D, E, EUR.1, VK, CPTPP...)',
              'Tư vấn áp mã HS Code chính xác',
              'Tham vấn giá hải quan & Hỗ trợ kiểm hóa luồng Đỏ',
              'Thủ tục hoàn thuế & Báo cáo quyết toán năm',
              'Xin giấy phép nhập khẩu tự động',
            ],
            defaultVas: [
              'Xin cấp C/O các form (Form D, E, EUR.1, VK, CPTPP...)',
              'Tư vấn áp mã HS Code chính xác',
              'Tham vấn giá hải quan & Hỗ trợ kiểm hóa luồng Đỏ',
            ],
          },
        ],
      },
      {
        id: 'cus-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'cus-ref-std',
            name: 'Hàng lạnh (Kiểm dịch thực vật / động vật / ATTP)',
            code: 'Kiểm dịch hàng lạnh',
            defaultFleet: 'Đội ngũ chuyên viên khai báo kiểm dịch thực vật / động vật và thủ tục hải quan lạnh tại 12 cửa khẩu cảng',
            defaultOperation: 'Đăng ký kiểm dịch trực tuyến trên Cổng NSW trước khi tàu cập cảng, lấy mẫu tại hiện trường bến cảng trong 24h',
            defaultCommitment: 'Hỗ trợ đưa hàng về kho bảo quản nhanh chóng, chứng thư kiểm dịch / ATTP chuẩn xác 100%',
            vehicleLov: ['Nhập khẩu kinh doanh (A11, A12)', 'Tất cả loại hình (A11, E21, E31, B11...)', 'Tạm nhập tái xuất (G11, G21)'],
            unitLov: ['Tờ khai', 'Lô hàng', 'Bộ chứng từ'],
            defaultRoutes: [
              {
                id: 'r-cus-ref-1',
                routeCode: 'CUS-REF-CL',
                route: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                customsBranchName: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                origin: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                customsAreaName: 'Cảng Cát Lái & Bãi Kiểm dịch Vùng VI',
                destination: 'Cảng Cát Lái & Bãi Kiểm dịch Vùng VI',
                customsDeclarationType: 'Nhập khẩu kinh doanh (A11, A12)',
                vehicleType: 'Nhập khẩu kinh doanh (A11, A12)',
                pricingUnit: 'Tờ khai',
                price: 1100000,
                customsExtraItemPrice: 300000,
                customsRedChannelPrice: 750000,
                customsServiceForm: 'Đại lý Hải quan chính thức',
                currency: 'VND',
                sla: 'Luồng Vàng 2-4h (Kiểm dịch 24-48h)',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
              {
                id: 'r-cus-ref-2',
                routeCode: 'CUS-REF-HP',
                route: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Cảng Đình Vũ / Nam Hải Đình Vũ)',
                customsBranchName: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Cảng Đình Vũ / Nam Hải Đình Vũ)',
                origin: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Cảng Đình Vũ / Nam Hải Đình Vũ)',
                customsAreaName: 'Cảng Đình Vũ & Chi cục Thú y Vùng II',
                destination: 'Cảng Đình Vũ & Chi cục Thú y Vùng II',
                customsDeclarationType: 'Nhập khẩu kinh doanh (A11, A12)',
                vehicleType: 'Nhập khẩu kinh doanh (A11, A12)',
                pricingUnit: 'Tờ khai',
                price: 1150000,
                customsExtraItemPrice: 300000,
                customsRedChannelPrice: 800000,
                customsServiceForm: 'Đại lý Hải quan chính thức',
                currency: 'VND',
                sla: 'Luồng Vàng 2-4h (Kiểm dịch 24-48h)',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 5,
              },
            ],
            freeSurchargeOptions: [
              'Đăng ký hồ sơ kiểm dịch trực tuyến trên Cổng Một cửa Quốc gia (NSW)',
              'Tư vấn mã HS Code và biểu thuế nhập khẩu ưu đãi nông sản',
              'Theo dõi tiến độ duyệt hồ sơ và cấp chứng thư trực tuyến',
            ],
            defaultFreeSurcharges: [
              'Đăng ký hồ sơ kiểm dịch trực tuyến trên Cổng Một cửa Quốc gia (NSW)',
              'Tư vấn mã HS Code và biểu thuế nhập khẩu ưu đãi nông sản',
            ],
            paidSurchargeOptions: [
              { id: 'pchk-1', name: 'Phí làm thủ tục đưa hàng về kho bảo quản chờ kết quả kiểm tra', priceText: '600,000 ₫ / Lô', isChecked: true },
              { id: 'pchk-2', name: 'Phí cử nhân sự lấy mẫu kiểm dịch tại bãi cảng / kho CFS', priceText: '400,000 ₫ / Lô', isChecked: true },
              { id: 'pchk-3', name: 'Lệ phí kiểm tra An toàn thực phẩm (VSATTP) nhà nước', priceText: 'Theo biên lai thu', isChecked: true },
              { id: 'pchk-4', name: 'Phí hỗ trợ kiểm hóa luồng Đỏ tại bãi cắm điện cont lạnh', priceText: '750,000 ₫ / Cont', isChecked: false },
            ],
            vasOptions: [
              'Đăng ký kiểm dịch Thực vật (Phytosanitary) / Động vật (Veterinary) trên Cổng NSW',
              'Làm thủ tục đưa hàng về kho bảo quản (Giải phóng container lạnh nhanh)',
              'Kiểm tra Vệ sinh An toàn Thực phẩm (Food Safety) & Cấp chứng thư thông quan',
              'Xin Giấy phép kiểm dịch thực vật / động vật nhập khẩu (Cục BVTV / Cục Thú y)',
              'Xin cấp C/O các Form ưu đãi thuế xuất nhập khẩu (Form E, D, EUR.1, AK, VJ...)',
              'Lấy mẫu kiểm tra tại bến cảng nhanh trong 24h & Nộp mẫu phòng Lab chỉ định',
            ],
            defaultVas: [
              'Đăng ký kiểm dịch Thực vật (Phytosanitary) / Động vật (Veterinary) trên Cổng NSW',
              'Làm thủ tục đưa hàng về kho bảo quản (Giải phóng container lạnh nhanh)',
              'Kiểm tra Vệ sinh An toàn Thực phẩm (Food Safety) & Cấp chứng thư thông quan',
            ],
          },
        ],
      },
      {
        id: 'cus-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'cus-haz-std',
            name: 'Hàng nguy hiểm (Khai báo hóa chất, giấy phép liên bộ DG)',
            code: 'Hải quan hóa chất',
            defaultFleet: 'Đội ngũ chuyên viên chứng chỉ an toàn hóa chất và tài khoản đại lý Cục Hóa chất (Bộ Công Thương)',
            defaultOperation: 'Thẩm định bảng dữ liệu an toàn MSDS, khai báo hóa chất tự động trên Cổng NSW trong 2 giờ',
            defaultCommitment: 'Hồ sơ pháp lý hợp lệ 100%, thông quan an toàn và đúng quy chuẩn Nghị định 113',
            vehicleLov: ['Nhập khẩu kinh doanh (A11, A12)', 'Tất cả loại hình (A11, E21, E31, B11...)', 'Tạm nhập tái xuất (G11, G21)'],
            unitLov: ['Tờ khai', 'Lô hàng', 'Bộ chứng từ'],
            defaultRoutes: [
              {
                id: 'r-cus-haz-1',
                routeCode: 'CUS-HAZ-HP',
                route: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Cảng Đình Vũ / Nam Hải Đình Vũ)',
                customsBranchName: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Cảng Đình Vũ / Nam Hải Đình Vũ)',
                origin: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng KV3 (Cảng Đình Vũ / Nam Hải Đình Vũ)',
                customsAreaName: 'Khu bến Cảng Đình Vũ (Hải Phòng)',
                destination: 'Khu bến Cảng Đình Vũ (Hải Phòng)',
                customsDeclarationType: 'Nhập khẩu kinh doanh (A11, A12)',
                vehicleType: 'Nhập khẩu kinh doanh (A11, A12)',
                pricingUnit: 'Tờ khai',
                price: 1350000,
                customsExtraItemPrice: 350000,
                customsRedChannelPrice: 850000,
                customsServiceForm: 'Đại lý Hải quan chính thức',
                currency: 'VND',
                sla: '24 - 48 giờ',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 5,
              },
              {
                id: 'r-cus-haz-2',
                routeCode: 'CUS-HAZ-CL',
                route: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                customsBranchName: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                origin: 'Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái)',
                customsAreaName: 'Bãi kiểm hóa chuyên dụng DG Cát Lái',
                destination: 'Bãi kiểm hóa chuyên dụng DG Cát Lái',
                customsDeclarationType: 'Nhập khẩu kinh doanh (A11, A12)',
                vehicleType: 'Nhập khẩu kinh doanh (A11, A12)',
                pricingUnit: 'Tờ khai',
                price: 1350000,
                customsExtraItemPrice: 350000,
                customsRedChannelPrice: 850000,
                customsServiceForm: 'Đại lý Hải quan chính thức',
                currency: 'VND',
                sla: '24 - 48 giờ',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 5,
              },
            ],
            freeSurchargeOptions: [
              'Thẩm định Bảng dữ liệu an toàn hóa chất (MSDS) & Phân nhóm UN/Class',
              'Kiểm tra đối chiếu danh mục hóa chất Nghị định 113/2017/NĐ-CP',
              'Tư vấn nhãn cảnh báo nguy hiểm GHS và mã HS Code chuẩn xác',
            ],
            defaultFreeSurcharges: [
              'Thẩm định Bảng dữ liệu an toàn hóa chất (MSDS) & Phân nhóm UN/Class',
              'Kiểm tra đối chiếu danh mục hóa chất Nghị định 113/2017/NĐ-CP',
            ],
            paidSurchargeOptions: [
              { id: 'phaz-cus-1', name: 'Phí khai báo hóa chất nhập khẩu trên Cổng Một cửa Quốc gia (NSW)', priceText: '400,000 ₫ / Bộ MSDS', isChecked: true },
              { id: 'phaz-cus-2', name: 'Phí xin Giấy phép nhập khẩu tiền chất công nghiệp / hóa chất hạn chế', priceText: '1,800,000 ₫ / Giấy phép', isChecked: true },
              { id: 'phaz-cus-3', name: 'Phí đăng ký kiểm tra nhà nước chất lượng hóa chất nhập khẩu', priceText: '600,000 ₫ / Bộ', isChecked: false },
              { id: 'phaz-cus-4', name: 'Phí hỗ trợ kiểm hóa thực tế tại bãi cách ly chuyên dụng DG', priceText: '850,000 ₫ / Cont', isChecked: true },
            ],
            vasOptions: [
              'Thẩm định bảng dữ liệu an toàn hóa chất MSDS & Tra cứu mã UN / Class DG',
              'Khai báo hóa chất tự động trên Cổng Một cửa Quốc gia (NSW) trong 2 giờ',
              'Xin giấy phép nhập khẩu tiền chất công nghiệp (Bộ Công Thương)',
              'Xin giấy phép nhập khẩu hóa chất Bảng / Hóa chất hạn chế SXKD',
              'Đăng ký kiểm tra nhà nước chất lượng hóa chất nhập khẩu',
              'In ấn & Dán nhãn phụ tiếng Việt / Nhãn cảnh báo nguy hiểm GHS theo quy định',
              'Tư vấn và xin Giấy phép vận chuyển hàng nguy hiểm liên tỉnh',
            ],
            defaultVas: [
              'Thẩm định bảng dữ liệu an toàn hóa chất MSDS & Tra cứu mã UN / Class DG',
              'Khai báo hóa chất tự động trên Cổng Một cửa Quốc gia (NSW) trong 2 giờ',
              'Xin giấy phép nhập khẩu tiền chất công nghiệp (Bộ Công Thương)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cross-border',
    name: 'Xuyên biên giới (Cross-Border)',
    serviceType: 'Cross-border',
    icon: Globe,
    cargoGroups: [
      {
        id: 'cb-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'cb-gen-ftl',
            name: 'FTL (Bao xe xuyên biên giới: VN ↔ TQ / Lào / Campuchia)',
            code: 'FTL',
            defaultFleet: 'Đội xe tải liên vận quốc tế giấy phép GMS và đại lý sang tải tại cặp cửa khẩu',
            defaultOperation: 'Thủ tục hải quan 2 đầu biên giới khép kín, đội xe chuyển tiếp tại Trung Quốc, Campuchia, Lào',
            defaultCommitment: 'Thời gian vận chuyển nhanh hơn đường biển 60%, chi phí tối ưu',
            vehicleLov: ['Xe tải liên vận 15T', 'Đầu kéo liên vận GMS', 'Xe sang tải cửa khẩu'],
            unitLov: ['Chuyến', 'Tấn', 'Cont 40ft'],
            defaultRoutes: [
              {
                id: 'r-cb-1',
                routeCode: 'CB-CHN-01',
                route: 'Hà Nội ⇄ Bằng Tường / Quảng Châu (TQ)',
                borderGate: 'Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường / Hữu Nghị Quan TQ)',
                origin: 'KCN Bắc Ninh / Hà Nội (Door)',
                destination: 'Quảng Châu (Trung Quốc) (Door)',
                vehicleType: 'Đầu Kéo Container 40ft High Cube (40HC)',
                transitMode: 'Xe liên vận chạy thẳng (Direct GMS)',
                customsScope: 'Trọn gói 2 đầu (VN + Nước bạn)',
                pricingUnit: 'Chuyến',
                price: 42000000,
                currency: 'VND',
                sla: '36 - 48 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
              {
                id: 'r-cb-2',
                routeCode: 'CB-CAM-01',
                route: 'TP.HCM ⇄ Phnom Penh (Campuchia)',
                borderGate: 'Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)',
                origin: 'KCN Tân Bình (TP.HCM) (Door)',
                destination: 'Phnom Penh SEZ (Campuchia) (Door)',
                vehicleType: 'Xe Tải Thùng Kín 15.0T (3 Chân liên vận GMS)',
                transitMode: 'Xe liên vận chạy thẳng (Direct GMS)',
                customsScope: 'Trọn gói 2 đầu (VN + Nước bạn)',
                pricingUnit: 'Chuyến',
                price: 18500000,
                currency: 'VND',
                sla: '18 - 24 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 15,
              },
            ],
            freeSurchargeOptions: [
              'Thủ tục thông quan xuất cảnh biên giới',
              'Định vị GPS hành trình liên vận quốc tế',
              'Niêm phong kẹp chì an ninh biên giới',
            ],
            defaultFreeSurcharges: [
              'Thủ tục thông quan xuất cảnh biên giới',
              'Định vị GPS hành trình liên vận quốc tế',
            ],
            paidSurchargeOptions: [
              { id: 'pcb-1', name: 'Phí sang tải tại bãi kiểm hóa cửa khẩu', priceText: '1,500,000 ₫ / Xe', isChecked: true },
              { id: 'pcb-2', name: 'Phí bãi đỗ xe chờ xuất cảnh quá 24h', priceText: '300,000 ₫ / Đêm', isChecked: false },
            ],
            vasOptions: [
              'Thủ tục hải quan 2 đầu biên giới (VN ↔ TQ/Lào/Cam)',
              'Dịch vụ sang tải tại bãi kiểm hóa cửa khẩu',
              'Đổi đầu kéo liên vận quốc tế tại mốc biên giới',
              'Định vị GPS hành trình liên vận quốc tế',
              'Bảo hiểm hàng hóa quốc tế toàn trình',
            ],
            defaultVas: [
              'Thủ tục hải quan 2 đầu biên giới (VN ↔ TQ/Lào/Cam)',
              'Dịch vụ sang tải tại bãi kiểm hóa cửa khẩu',
              'Bảo hiểm hàng hóa quốc tế toàn trình',
            ],
          },
          {
            id: 'cb-gen-ltl',
            name: 'LTL (Ghép hàng lẻ xuyên biên giới)',
            code: 'LTL',
            defaultFleet: 'Tuyến xe gom hàng lẻ định kỳ hàng ngày đi Campuchia, Trung Quốc, Lào (Quy đổi 1 CBM = 250 Kg)',
            defaultOperation: 'Gom hàng tại kho Hub trung tâm Hà Nội & TP.HCM, giao tận tay người nhận ở nước ngoài',
            defaultCommitment: 'Giao hàng Door-to-Door, đối soát thu hộ COD ngoại tệ, lịch xe cố định hàng ngày',
            vehicleLov: ['Tuyến gom hàng lẻ biên giới (LTL)'],
            unitLov: ['Kg / CBM', 'Kg', 'CBM', 'Lô hàng'],
            defaultRoutes: [
              {
                id: 'r-cb-ltl-1',
                routeCode: 'CB-LTL-CAM01',
                route: 'TP.HCM ⇄ Phnom Penh (Campuchia)',
                borderGate: 'Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)',
                origin: 'Kho Hub Tân Bình (TP.HCM)',
                destination: 'Kho Hub Phnom Penh (Campuchia)',
                customsLtlMode: 'Trọn gói Bao thuế Door-to-Door (Phổ biến)',
                pricePerKg: 3500,
                pricePerCbm: 750000,
                minChargeShipment: 350000,
                pricingUnit: 'Kg / CBM',
                price: 3500,
                currency: 'VND',
                sla: '24 - 36 giờ',
                departureSchedule: 'Hàng ngày (Daily - T2 đến CN)',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
              {
                id: 'r-cb-ltl-2',
                routeCode: 'CB-LTL-CHN01',
                route: 'Hà Nội ⇄ Bằng Tường / Quảng Châu (TQ)',
                borderGate: 'Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường / Hữu Nghị Quan TQ)',
                origin: 'Kho Hub Mỹ Đình / Gia Lâm (Hà Nội)',
                destination: 'Kho Hub Bằng Tường / Bạch Vân (Quảng Châu TQ)',
                customsLtlMode: 'Trọn gói Bao thuế Door-to-Door (Phổ biến)',
                pricePerKg: 8500,
                pricePerCbm: 1850000,
                minChargeShipment: 500000,
                pricingUnit: 'Kg / CBM',
                price: 8500,
                currency: 'VND',
                sla: '48 - 72 giờ',
                departureSchedule: 'Thứ 2, 4, 6 (Mon - Wed - Fri)',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 5,
              },
            ],
            freeSurchargeOptions: [
              'Quấn màng co PE bảo vệ kiện hàng lẻ',
              'Cập nhật trạng thái lộ trình trực tuyến qua App/SMS',
              'Miễn phí lưu kho gom hàng 48h tại Hub xuất',
            ],
            defaultFreeSurcharges: [
              'Quấn màng co PE bảo vệ kiện hàng lẻ',
              'Cập nhật trạng thái lộ trình trực tuyến qua App/SMS',
            ],
            paidSurchargeOptions: [
              { id: 'pcb-ltl-1', name: 'Phí dịch vụ thu hộ tiền hàng ngoại tệ (COD tại Campuchia / TQ)', priceText: '1.5% giá trị thu hộ', isChecked: true },
              { id: 'pcb-ltl-2', name: 'Phí giao hàng vùng sâu vùng xa nội địa nước bạn (Out-of-Area)', priceText: '250,000 ₫ / Lô', isChecked: false },
              { id: 'pcb-ltl-3', name: 'Phí bốc dỡ nâng hạ kiện siêu nặng (> 300 Kg/kiện) tại kho Hub', priceText: '300,000 ₫ / Kiện', isChecked: false },
              { id: 'pcb-ltl-4', name: 'Phí dán tem phụ tiếng bản địa (Khmer / Trung / Lào)', priceText: '2,000 ₫ / Tem', isChecked: false },
            ],
            vasOptions: [
              'Giao nhận tận nơi Door-to-Door tại Phnom Penh / Quảng Châu / Viêng Chăn',
              'Dịch vụ thu hộ tiền hàng ngoại tệ (COD) và đối soát tài khoản nhanh',
              'Dán tem nhãn phụ tiếng bản địa theo quy chuẩn nước sở tại',
              'Đóng kiện gỗ / Chèn lót chống sốc hàng dễ vỡ cho chặng quốc tế',
              'Bảo hiểm hàng hóa quốc tế toàn trình theo giá trị khai báo',
            ],
            defaultVas: [
              'Giao nhận tận nơi Door-to-Door tại Phnom Penh / Quảng Châu / Viêng Chăn',
              'Dịch vụ thu hộ tiền hàng ngoại tệ (COD) và đối soát tài khoản nhanh',
              'Dán tem nhãn phụ tiếng bản địa theo quy chuẩn nước sở tại',
            ],
          },
        ],
      },
      {
        id: 'cb-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'cb-ref-ftl',
            name: 'FTL (Xe lạnh xuyên biên giới)',
            code: 'FTL',
            defaultFleet: 'Xe đông lạnh liên vận chạy thẳng qua cửa khẩu Hữu Nghị, Tân Thanh, Mộc Bài',
            defaultOperation: 'Hỗ trợ làn xanh ưu tiên thông quan nông sản tươi sống, cắm điện buồng lạnh liên tục',
            defaultCommitment: 'Nông sản giữ độ tươi ngon đạt chuẩn khi giao cho đối tác thương lái quốc tế',
            vehicleLov: ['Xe đông lạnh liên vận 15T', 'Đầu kéo Cont lạnh liên vận'],
            unitLov: ['Chuyến', 'Cont 40RF'],
            defaultRoutes: [
              {
                id: 'r-cb-ref-1',
                routeCode: 'CB-REF-01',
                route: 'Tiền Giang ⇄ Bằng Tường / Gia Hưng (TQ)',
                borderGate: 'Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường / Hữu Nghị Quan TQ)',
                origin: 'Cái Bè (Tiền Giang) (Door)',
                destination: 'Chợ đầu mối Bằng Tường (Trung Quốc) (Door)',
                vehicleType: 'Đầu Kéo Container Lạnh 40ft Reefer (40RF)',
                transitMode: 'Xe liên vận chạy thẳng (Direct GMS)',
                customsScope: 'Trọn gói 2 đầu (VN + Nước bạn)',
                pricingUnit: 'Chuyến',
                price: 65000000,
                currency: 'VND',
                sla: '48 - 60 giờ',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Ưu tiên thông quan nhanh làn xanh nông sản tươi',
              'Theo dõi nhiệt độ thùng xe real-time qua App',
            ],
            defaultFreeSurcharges: [
              'Ưu tiên thông quan nhanh làn xanh nông sản tươi',
              'Theo dõi nhiệt độ thùng xe real-time qua App',
            ],
            paidSurchargeOptions: [
              { id: 'pcb-ref-1', name: 'Phí cắm điện buồng lạnh tại bãi chờ cửa khẩu', priceText: '500,000 ₫ / Đêm', isChecked: true },
              { id: 'pcb-ref-2', name: 'Phí kiểm dịch thực vật tại cửa khẩu 2 đầu', priceText: '800,000 ₫ / Xe', isChecked: false },
            ],
            vasOptions: [
              'Ưu tiên thông quan nhanh làn xanh nông sản tươi',
              'Cắm điện buồng lạnh tại bãi chờ cửa khẩu',
              'Theo dõi nhiệt độ thùng xe real-time qua App',
              'Kiểm dịch thực vật tại cửa khẩu 2 đầu biên giới',
              'Sang tải buồng lạnh chuyên dụng',
            ],
            defaultVas: [
              'Ưu tiên thông quan nhanh làn xanh nông sản tươi',
              'Theo dõi nhiệt độ thùng xe real-time qua App',
              'Kiểm dịch thực vật tại cửa khẩu 2 đầu biên giới',
            ],
          },
        ],
      },
      {
        id: 'cb-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'cb-haz-ftl',
            name: 'FTL (Xe chuyên dụng xuyên biên giới)',
            code: 'FTL',
            defaultFleet: 'Xe chuyên chở hóa chất có giấy phép liên vận GMS chở hàng nguy hiểm',
            defaultOperation: 'Đội ngũ hộ tống an toàn qua cửa khẩu quốc tế, tài xế có chứng chỉ song ngữ',
            defaultCommitment: 'Hồ sơ quá cảnh liên quốc gia đầy đủ, an toàn tuyệt đối',
            vehicleLov: ['Xe chuyên dụng hóa chất liên vận'],
            unitLov: ['Chuyến', 'Tấn'],
            defaultRoutes: [
              {
                id: 'r-cb-haz-1',
                routeCode: 'CB-HAZ-01',
                route: 'Hà Nội ⇄ Viêng Chăn (Lào)',
                borderGate: 'Cầu Treo (Hà Tĩnh VN ↔ Namphao Lào ↔ Viêng Chăn)',
                origin: 'Hà Nội (Door)',
                destination: 'Thủ đô Viêng Chăn (Lào) (Door)',
                vehicleType: 'Đầu Kéo Container 20ft (20GP / 20RF)',
                transitMode: 'Xe liên vận chạy thẳng (Direct GMS)',
                customsScope: 'Trọn gói 2 đầu (VN + Nước bạn)',
                pricingUnit: 'Chuyến',
                price: 75000000,
                currency: 'VND',
                sla: '3 - 5 ngày',
                pricingStyle: 'All-in',
                validUntil: '2026-12-31',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Bộ ứng cứu sự cố hóa chất chuẩn quốc tế',
              'Kẹp chì seal an ninh liên vận',
            ],
            defaultFreeSurcharges: [
              'Bộ ứng cứu sự cố hóa chất chuẩn quốc tế',
            ],
            paidSurchargeOptions: [
              { id: 'pcb-haz-1', name: 'Phí giấy phép vận chuyển quá cảnh liên quốc gia GMS', priceText: '3,500,000 ₫ / Giấy phép', isChecked: true },
              { id: 'pcb-haz-2', name: 'Phí hộ tống an toàn qua cửa khẩu quốc tế', priceText: '1,500,000 ₫ / Chuyến', isChecked: false },
            ],
            vasOptions: [
              'Giấy phép vận chuyển quá cảnh liên quốc gia',
              'Hộ tống an toàn qua cửa khẩu quốc tế',
              'Bộ ứng cứu sự cố hóa chất quốc tế',
              'Bảo hiểm trách nhiệm ô nhiễm môi trường xuyên biên giới',
            ],
            defaultVas: [
              'Giấy phép vận chuyển quá cảnh liên quốc gia',
              'Hộ tống an toàn qua cửa khẩu quốc tế',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'project',
    name: 'Dịch vụ dự án & Tích hợp (Project Cargo)',
    serviceType: 'Trucking',
    icon: Layers,
    cargoGroups: [
      {
        id: 'proj-gen',
        name: 'Hàng thường',
        models: [
          {
            id: 'proj-gen-dist',
            name: 'Phân phối (Distribution)',
            code: 'Phân phối',
            defaultFleet: 'Mạng lưới điều phối đa điểm toàn quốc cho chuỗi bán lẻ & nhà máy sản xuất',
            defaultOperation: 'Tháp điều hành Control Tower quản lý tiến độ giao nhận 63 tỉnh thành thời gian thực',
            defaultCommitment: 'Đảm bảo tỷ lệ hoàn thành đơn hàng 99.8%, báo cáo KPI hàng ngày',
            vehicleLov: ['Đội xe phân phối đa tải trọng', 'Hệ thống Cross-dock điều phối'],
            unitLov: ['Gói / Tuyến', 'Chuyến', 'Tấn'],
            defaultRoutes: [
              {
                id: 'r-proj-1',
                route: 'Kho DC Miền Nam ⇄ Hệ thống siêu thị toàn quốc',
                origin: 'Kho DC Sóng Thần (Bình Dương)',
                destination: 'Chuỗi siêu thị 63 tỉnh thành',
                vehicleType: 'Đội xe phân phối đa tải trọng',
                pricingUnit: 'Gói / Tuyến',
                price: 18000000,
                currency: 'VND',
                sla: 'Theo lịch phân phối',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Báo cáo KPI giao nhận & Đối soát e-POD hàng ngày',
              'Quản lý thu hồi vỏ pallet & thùng rỗng',
              'Tháp điều hành Control Tower 24/7',
            ],
            defaultFreeSurcharges: [
              'Báo cáo KPI giao nhận & Đối soát e-POD hàng ngày',
              'Tháp điều hành Control Tower 24/7',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-1', name: 'Giao hàng hẹn giờ chính xác (Time-slot siêu thị)', priceText: '200,000 ₫ / Điểm', isChecked: true },
              { id: 'pproj-2', name: 'Phí giao hàng ca đêm (sau 22:00)', priceText: '300,000 ₫ / Điểm', isChecked: false },
            ],
            vasOptions: [
              'Tháp điều hành Control Tower quản lý 63 tỉnh thành',
              'Giao hàng hẹn giờ chính xác Time-slot siêu thị',
              'Báo cáo KPI giao nhận & Đối soát e-POD hàng ngày',
              'Quản lý thu hồi vỏ pallet & Thùng rỗng',
              'Bảo hiểm trách nhiệm phân phối tổng thể',
            ],
            defaultVas: [
              'Tháp điều hành Control Tower quản lý 63 tỉnh thành',
              'Báo cáo KPI giao nhận & Đối soát e-POD hàng ngày',
              'Bảo hiểm trách nhiệm phân phối tổng thể',
            ],
          },
          {
            id: 'proj-gen-xdock',
            name: 'Cross-dock (X-Dock)',
            code: 'Cross-dock',
            defaultFleet: 'Sàn trung chuyển cross-docking không lưu kho, phân luồng xuất bến ngay',
            defaultOperation: 'Tiếp nhận hàng từ nhà máy, chia chọn theo tuyến và sang xe xuất bến trong 4 - 6 giờ',
            defaultCommitment: 'Tối ưu vòng quay hàng tồn kho, giảm 40% chi phí lưu kho',
            vehicleLov: ['Sàn trung chuyển Cross-dock'],
            unitLov: ['Kg', 'CBM', 'Pallet', 'Lô hàng'],
            defaultRoutes: [
              {
                id: 'r-proj-xdock-1',
                xdockCode: 'XD-BD-01',
                routeCode: 'XD-BD-01',
                xdockName: 'Trạm X-Dock Sóng Thần (Bình Dương)',
                warehouseName: 'Trạm X-Dock Sóng Thần (Bình Dương)',
                route: 'Trạm X-Dock Sóng Thần (Bình Dương)',
                xdockProvince: 'Bình Dương',
                warehouseProvince: 'Bình Dương',
                origin: 'Bình Dương',
                xdockAddress: 'KCN Sóng Thần 1, TP. Dĩ An',
                warehouseAddress: 'KCN Sóng Thần 1, TP. Dĩ An',
                destination: 'KCN Sóng Thần 1, TP. Dĩ An',
                floorProcessingCapacity: '150 Tấn / Ngày',
                pricePerKg: 180,
                pricePerCbm: 45000,
                pricePerPallet: 35000,
                minChargeXdock: 150000,
                minChargeMonthly: 150000,
                price: 180,
                pricingUnit: 'Kg / CBM / Pallet',
                currency: 'VND',
                sla: '< 4 giờ (Xuất bến ngay)',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
              {
                id: 'r-proj-xdock-2',
                xdockCode: 'XD-HN-01',
                routeCode: 'XD-HN-01',
                xdockName: 'Trạm X-Dock Gia Lâm (Hà Nội)',
                warehouseName: 'Trạm X-Dock Gia Lâm (Hà Nội)',
                route: 'Trạm X-Dock Gia Lâm (Hà Nội)',
                xdockProvince: 'Hà Nội',
                warehouseProvince: 'Hà Nội',
                origin: 'Hà Nội',
                xdockAddress: 'Khu công nghiệp Đài Tư, Q. Long Biên',
                warehouseAddress: 'Khu công nghiệp Đài Tư, Q. Long Biên',
                destination: 'Khu công nghiệp Đài Tư, Q. Long Biên',
                floorProcessingCapacity: '120 Tấn / Ngày',
                pricePerKg: 190,
                pricePerCbm: 48000,
                pricePerPallet: 38000,
                minChargeXdock: 150000,
                minChargeMonthly: 150000,
                price: 190,
                pricingUnit: 'Kg / CBM / Pallet',
                currency: 'VND',
                sla: '< 4 giờ (Xuất bến ngay)',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 5,
              },
            ],
            freeSurchargeOptions: [
              'Quét mã barcode tự động xuất bến < 4h',
              'Phân luồng sang xe trực tiếp không lưu bãi',
            ],
            defaultFreeSurcharges: [
              'Quét mã barcode tự động xuất bến < 4h',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-xdock-1', name: 'Phí phân loại chia chọn chi tiết theo mã SKU', priceText: '500 ₫ / Sản phẩm', isChecked: true },
              { id: 'pproj-xdock-2', name: 'Phí quấn màng co PE kiện hàng sang tải', priceText: '25,000 ₫ / Pallet', isChecked: false },
            ],
            vasOptions: [
              'Phân loại chia chọn nhanh theo mã SKU',
              'Quét mã vạch Barcode tự động xuất bến < 4h',
              'Sang xe tải không lưu kho',
              'Bọc màng PE kiện hàng sang tải',
            ],
            defaultVas: [
              'Phân loại chia chọn nhanh theo mã SKU',
              'Quét mã vạch Barcode tự động xuất bến < 4h',
            ],
          },
          {
            id: 'proj-gen-port',
            name: 'Cảng (Port Logistics)',
            code: 'Port Logistics',
            defaultFleet: 'Hạ tầng bến bãi, sà lan và xe đầu kéo rút hàng tại các cụm cảng nước sâu',
            defaultOperation: 'Rút ruột container, nâng hạ máy móc thiết bị nặng và giải phóng cont trong 12h',
            defaultCommitment: 'Không để phát sinh phí lưu bãi lưu cont của hãng tàu',
            vehicleLov: ['Xe đầu kéo bãi cảng', 'Cẩu chuyên dụng rút ruột cont'],
            unitLov: ['Cont 20ft', 'Cont 40ft', 'Chuyến'],
            defaultRoutes: [
              {
                id: 'r-proj-port-1',
                portIcdCode: 'ICD-ST-01',
                routeCode: 'ICD-ST-01',
                portIcdName: 'Cảng Cạn ICD Sóng Thần (Bình Dương)',
                warehouseName: 'Cảng Cạn ICD Sóng Thần (Bình Dương)',
                route: 'Cảng Cạn ICD Sóng Thần (Bình Dương)',
                portIcdProvince: 'Bình Dương',
                warehouseProvince: 'Bình Dương',
                origin: 'Bình Dương',
                portIcdAddress: 'TX. Dĩ An, Tỉnh Bình Dương',
                warehouseAddress: 'TX. Dĩ An, Tỉnh Bình Dương',
                destination: 'TX. Dĩ An, Tỉnh Bình Dương',
                yardCapacityTeu: 15000,
                priceShuttle20ft: 1200000,
                priceShuttle40ft: 1800000,
                priceLiftOnOff: 350000,
                price: 1200000,
                pricingUnit: 'Cont',
                currency: 'VND',
                sla: '< 6 giờ (Shuttle Cảng - ICD)',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 10,
              },
              {
                id: 'r-proj-port-2',
                portIcdCode: 'PORT-CM-01',
                routeCode: 'PORT-CM-01',
                portIcdName: 'Cảng Quốc Tế Cái Mép (TCIT / CMIT)',
                warehouseName: 'Cảng Quốc Tế Cái Mép (TCIT / CMIT)',
                route: 'Cảng Quốc Tế Cái Mép (TCIT / CMIT)',
                portIcdProvince: 'Bà Rịa - Vũng Tàu',
                warehouseProvince: 'Bà Rịa - Vũng Tàu',
                origin: 'Bà Rịa - Vũng Tàu',
                portIcdAddress: 'Khu bến Cái Mép - Thị Vải, TX. Phú Mỹ',
                warehouseAddress: 'Khu bến Cái Mép - Thị Vải, TX. Phú Mỹ',
                destination: 'Khu bến Cái Mép - Thị Vải, TX. Phú Mỹ',
                yardCapacityTeu: 35000,
                priceShuttle20ft: 1650000,
                priceShuttle40ft: 2400000,
                priceLiftOnOff: 450000,
                price: 1650000,
                pricingUnit: 'Cont',
                currency: 'VND',
                sla: 'Nâng hạ < 15 phút/xe',
                pricingStyle: 'Chưa gồm phụ phí',
                validUntil: '2026-12-31',
                promotionPercent: 5,
              },
            ],
            freeSurchargeOptions: [
              'Hạ vỏ container rỗng về bãi chỉ định giải phóng cont < 12h',
              'Bảo quản container an toàn bãi cảng',
            ],
            defaultFreeSurcharges: [
              'Hạ vỏ container rỗng về bãi chỉ định giải phóng cont < 12h',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-port-1', name: 'Phí nâng hạ cẩu bãi cảng máy móc nặng ngoài giờ', priceText: '600,000 ₫ / Cont', isChecked: true },
              { id: 'pproj-port-2', name: 'Phí cẩu tự hành rút ruột thiết bị siêu trường', priceText: '2,500,000 ₫ / Cont', isChecked: false },
            ],
            vasOptions: [
              'Nâng hạ cẩu bờ chuyên dụng 50T - 500T',
              'Rút ruột container máy móc nặng tại bến cảng',
              'Hạ vỏ cont rỗng về bãi chỉ định giải phóng cont < 12h',
              'Bảo quản container an toàn bãi cảng',
            ],
            defaultVas: [
              'Nâng hạ cẩu bờ chuyên dụng 50T - 500T',
              'Rút ruột container máy móc nặng tại bến cảng',
            ],
          },
          {
            id: 'proj-gen-multi',
            name: 'Đa phương thức (Multimodal)',
            code: 'Đa phương thức',
            defaultFleet: 'Giải pháp kết hợp Biển + Sắt + Bộ + Sà lan sông tối ưu 25% chi phí logistics',
            defaultOperation: 'Điều phối đa phương thức liên hoàn, một đầu mối duy nhất xuyên suốt hành trình',
            defaultCommitment: 'Cam kết tiến độ tổng thể, giảm lượng phát thải carbon',
            vehicleLov: ['Đa phương thức Biển + Sắt + Bộ', 'Sà lan sông kết hợp xe tải'],
            unitLov: ['Lô hàng', 'Tấn', 'Container'],
            defaultRoutes: [
              {
                id: 'r-proj-multi-1',
                route: 'Tuyến Hành lang Bắc - Nam (Biển + Sắt + Bộ)',
                origin: 'Nhà máy miền Nam',
                destination: 'Phân phối miền Bắc',
                vehicleType: 'Đa phương thức Biển + Sắt + Bộ',
                pricingUnit: 'Lô hàng',
                price: 22500000,
                currency: 'VND',
                sla: '4 - 5 ngày',
                pricingStyle: 'All-in',
                promotionPercent: 12,
              },
            ],
            freeSurchargeOptions: [
              'Quản lý chuỗi cung ứng trọn gói 4PL',
              'Một vận đơn duy nhất xuyên suốt Biển + Sắt + Bộ + Sông',
            ],
            defaultFreeSurcharges: [
              'Quản lý chuỗi cung ứng trọn gói 4PL',
              'Một vận đơn duy nhất xuyên suốt Biển + Sắt + Bộ + Sông',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-multi-1', name: 'Bảo hiểm hàng hóa đa phương thức mở rộng', priceText: '0.15% giá trị hàng', isChecked: true },
            ],
            vasOptions: [
              'Quản lý chuỗi cung ứng trọn gói 4PL',
              'Một vận đơn duy nhất xuyên suốt Biển + Sắt + Bộ + Sông',
              'Tối ưu lộ trình giảm 25% chi phí & Giảm phát thải CO2',
              'Bảo hiểm mọi rủi ro hàng hóa đa phương thức',
            ],
            defaultVas: [
              'Quản lý chuỗi cung ứng trọn gói 4PL',
              'Một vận đơn duy nhất xuyên suốt Biển + Sắt + Bộ + Sông',
            ],
          },
        ],
      },
      {
        id: 'proj-ref',
        name: 'Hàng lạnh',
        models: [
          {
            id: 'proj-ref-dist',
            name: 'Phân phối (Cold Distribution)',
            code: 'Phân phối lạnh',
            defaultFleet: 'Đội xe lạnh phân phối chuỗi siêu thị, F&B và nhà hàng khách sạn',
            defaultOperation: 'Giao hàng đúng khung giờ Time-slot, nghiệm thu nhiệt độ từng điểm dỡ',
            defaultCommitment: 'Giữ nhiệt độ chuẩn, đền bù 100% nếu đứt gãy chuỗi lạnh',
            vehicleLov: ['Xe đông lạnh phân phối siêu thị'],
            unitLov: ['Chuyến', 'Điểm giao'],
            defaultRoutes: [
              {
                id: 'r-proj-ref-1',
                route: 'Kho DC Lạnh ⇄ Chuỗi WinMart / Co.opmart',
                origin: 'Kho DC Lạnh Bình Dương',
                destination: 'Chuỗi siêu thị TP.HCM & Đông Nam Bộ',
                vehicleType: 'Xe đông lạnh phân phối siêu thị',
                pricingUnit: 'Chuyến',
                price: 12500000,
                currency: 'VND',
                sla: 'Giao theo Time-slot',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Bàn giao kiểm đếm nhiệt độ từng điểm giao',
              'Biên bản nghiệm thu chất lượng hàng tươi',
            ],
            defaultFreeSurcharges: [
              'Bàn giao kiểm đếm nhiệt độ từng điểm giao',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-cold-1', name: 'Phí giao hàng sáng sớm trước 6h', priceText: '250,000 ₫ / Chuyến', isChecked: true },
            ],
            vasOptions: [
              'Bàn giao kiểm đếm nhiệt độ từng điểm giao',
              'Biên bản nghiệm thu chất lượng hàng tươi',
              'Giao hàng sáng sớm trước 6h',
              'Bảo hiểm đứt gãy chuỗi lạnh',
            ],
            defaultVas: [
              'Bàn giao kiểm đếm nhiệt độ từng điểm giao',
              'Biên bản nghiệm thu chất lượng hàng tươi',
            ],
          },
          {
            id: 'proj-ref-xdock',
            name: 'Cross-dock (Cold X-Dock)',
            code: 'X-Dock Lạnh',
            defaultFleet: 'Sàn trung chuyển duy trì nhiệt độ mát (+10°C đến +15°C) chống sốc nhiệt',
            defaultOperation: 'Sang xe lạnh trong vòng 2 giờ, bảo quản đá gel bổ sung',
            defaultCommitment: 'Đảm bảo hàng tươi sống giữ nguyên chất lượng',
            vehicleLov: ['Sàn trung chuyển lạnh Cross-dock'],
            unitLov: ['Tấn', 'Pallet'],
            defaultRoutes: [
              {
                id: 'r-proj-ref-xdock-1',
                route: 'Hub Lạnh Trung Tâm ⇄ Xe tỏa đi các tỉnh',
                origin: 'Kho đệm lạnh TP.HCM',
                destination: 'Các tỉnh lân cận',
                vehicleType: 'Sàn trung chuyển lạnh Cross-dock',
                pricingUnit: 'Tấn',
                price: 160000,
                currency: 'VND',
                sla: '2 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Cảm biến nhiệt độ buồng đệm lạnh',
            ],
            defaultFreeSurcharges: [
              'Cảm biến nhiệt độ buồng đệm lạnh',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-ice-1', name: 'Phí bổ sung đá gel / đá khô giữ lạnh', priceText: '50,000 ₫ / Kg', isChecked: true },
            ],
            vasOptions: [
              'Sàn trung chuyển lạnh duy trì nhiệt độ mát buồng đệm',
              'Bảo quản đá gel / Đá khô bổ sung',
              'Sang xe lạnh hỏa tốc trong 2 giờ',
            ],
            defaultVas: [
              'Sàn trung chuyển lạnh duy trì nhiệt độ mát buồng đệm',
              'Sang xe lạnh hỏa tốc trong 2 giờ',
            ],
          },
          {
            id: 'proj-ref-port',
            name: 'Cảng (Port Cold Logistics)',
            code: 'Cảng hàng lạnh',
            defaultFleet: 'Bãi cắm điện cont lạnh Reefer plug & xe kéo cont lạnh chuyên dụng',
            defaultOperation: 'Rút cont lạnh và kéo về nhà máy trong vòng 6h sau khi dỡ tàu',
            defaultCommitment: 'Nhiệt độ cont lạnh được duy trì liên tục không ngắt quãng',
            vehicleLov: ['Xe kéo cont lạnh Reefer'],
            unitLov: ['Cont 40RF', 'Chuyến'],
            defaultRoutes: [
              {
                id: 'r-proj-ref-port-1',
                route: 'Cảng Cát Lái ⇄ Nhà máy thủy sản Long An',
                origin: 'Cảng Cát Lái (TP.HCM)',
                destination: 'KCN Thuận Đạo (Long An)',
                vehicleType: 'Xe kéo cont lạnh Reefer',
                pricingUnit: 'Cont 40RF',
                price: 4500000,
                currency: 'VND',
                sla: '4 - 6 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Cắm điện bãi cảng Reefer plug 24/7',
              'Theo dõi nhiệt độ giàn lạnh Reefer liên tục',
            ],
            defaultFreeSurcharges: [
              'Cắm điện bãi cảng Reefer plug 24/7',
              'Theo dõi nhiệt độ giàn lạnh Reefer liên tục',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-reefer-genset-1', name: 'Phí chạy Genset cắm điện trên đường bộ', priceText: '600,000 ₫ / Chuyến', isChecked: true },
            ],
            vasOptions: [
              'Cắm điện bãi cảng Reefer plug 24/7',
              'Theo dõi nhiệt độ giàn lạnh Reefer liên tục',
              'Kéo cont lạnh về nhà máy trong 6h sau khi dỡ tàu',
            ],
            defaultVas: [
              'Cắm điện bãi cảng Reefer plug 24/7',
              'Theo dõi nhiệt độ giàn lạnh Reefer liên tục',
            ],
          },
          {
            id: 'proj-ref-multi',
            name: 'Đa phương thức (Cold Multimodal)',
            code: 'Đa phương thức lạnh',
            defaultFleet: 'Chuỗi logistics lạnh kết hợp Tàu biển lạnh + Đường sắt lạnh + Xe tải lạnh',
            defaultOperation: 'Kiểm soát dải nhiệt độ khép kín 100% từ vùng nguyên liệu tới điểm phân phối',
            defaultCommitment: 'Bảo hiểm rủi ro mất nhiệt độ toàn trình',
            vehicleLov: ['Chuỗi logistics lạnh đa phương thức'],
            unitLov: ['Container lạnh', 'Lô hàng'],
            defaultRoutes: [
              {
                id: 'r-proj-ref-multi-1',
                route: 'Miền Tây ⇄ Xuất khẩu Trung Quốc',
                origin: 'Đồng Bằng Sông Cửu Long',
                destination: 'Chợ đầu mối Trung Quốc',
                vehicleType: 'Chuỗi logistics lạnh đa phương thức',
                pricingUnit: 'Container lạnh',
                price: 48000000,
                currency: 'VND',
                sla: '3 - 4 ngày',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Giám sát chuỗi lạnh Cold Chain 100% không đứt gãy',
            ],
            defaultFreeSurcharges: [
              'Giám sát chuỗi lạnh Cold Chain 100% không đứt gãy',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-cold-ins-1', name: 'Bảo hiểm hư hỏng nông sản lạnh toàn trình', priceText: '0.25% giá trị hàng', isChecked: true },
            ],
            vasOptions: [
              'Giám sát chuỗi lạnh Cold Chain 100% không đứt gãy',
              'Bảo hiểm rủi ro mất nhiệt độ toàn trình',
              'Kết hợp tàu lạnh + Đường sắt lạnh + Xe lạnh',
            ],
            defaultVas: [
              'Giám sát chuỗi lạnh Cold Chain 100% không đứt gãy',
              'Bảo hiểm rủi ro mất nhiệt độ toàn trình',
            ],
          },
        ],
      },
      {
        id: 'proj-haz',
        name: 'Hàng nguy hiểm',
        models: [
          {
            id: 'proj-haz-dist',
            name: 'Phân phối (Hazmat Distribution)',
            code: 'Phân phối hóa chất',
            defaultFleet: 'Mạng lưới phân phối hóa chất công nghiệp, sơn và dung môi có giấy phép PCCC',
            defaultOperation: 'Tài xế chuyên nghiệp, kẹp chì an toàn và quy trình giao nhận hóa chất nghiêm ngặt',
            defaultCommitment: 'An toàn cháy nổ và bảo vệ môi trường 100%',
            vehicleLov: ['Xe tải phân phối hóa chất', 'Đầu kéo Cont DG'],
            unitLov: ['Chuyến', 'Tấn'],
            defaultRoutes: [
              {
                id: 'r-proj-haz-1',
                route: 'Kho Hóa Chất Trung Tâm ⇄ Các nhà máy tại KCN',
                origin: 'Kho Hóa Chất Nhơn Trạch',
                destination: 'KCN Biên Hòa / Sóng Thần / Đức Hòa',
                vehicleType: 'Xe tải phân phối hóa chất',
                pricingUnit: 'Chuyến',
                price: 26000000,
                currency: 'VND',
                sla: 'Theo lịch an toàn',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Kẹp chì seal an toàn bảo mật',
              'Biên bản bàn giao hóa chất nghiêm ngặt',
            ],
            defaultFreeSurcharges: [
              'Kẹp chì seal an toàn bảo mật',
              'Biên bản bàn giao hóa chất nghiêm ngặt',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-haz-pccc-1', name: 'Phí xe chữa cháy bảo vệ hiện trường', priceText: '2,500,000 ₫ / Ca', isChecked: true },
            ],
            vasOptions: [
              'Kẹp chì seal an toàn bảo mật',
              'Biên bản bàn giao hóa chất nghiêm ngặt',
              'Xe chữa cháy bảo vệ hiện trường',
              'Bảo hiểm bồi thường ô nhiễm môi trường',
            ],
            defaultVas: [
              'Kẹp chì seal an toàn bảo mật',
              'Biên bản bàn giao hóa chất nghiêm ngặt',
            ],
          },
          {
            id: 'proj-haz-xdock',
            name: 'Cross-dock (Hazmat X-Dock)',
            code: 'X-Dock Hóa chất',
            defaultFleet: 'Bãi sang tải ngoài trời đạt tiêu chuẩn cách ly an toàn hóa chất',
            defaultOperation: 'Sang tải nhanh trong 4 giờ, đội phản ứng nhanh túc trực xử lý sự cố',
            defaultCommitment: 'Không để xảy ra rò rỉ hay ô nhiễm môi trường',
            vehicleLov: ['Bãi sang tải hóa chất chuyên biệt'],
            unitLov: ['Tấn', 'Phuy / Bồn IBC'],
            defaultRoutes: [
              {
                id: 'r-proj-haz-xdock-1',
                route: 'Bãi Sang Tải Hóa Chất ⇄ Nhà máy tiêu thụ',
                origin: 'Bãi trung chuyển hóa chất',
                destination: 'Nhà máy',
                vehicleType: 'Bãi sang tải hóa chất chuyên biệt',
                pricingUnit: 'Tấn',
                price: 190000,
                currency: 'VND',
                sla: '4 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Bãi sang tải ngoài trời cách ly an toàn',
              'Trang thiết bị ứng phó sự cố hóa chất Spill-Kit',
            ],
            defaultFreeSurcharges: [
              'Bãi sang tải ngoài trời cách ly an toàn',
              'Trang thiết bị ứng phó sự cố hóa chất Spill-Kit',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-haz-spill-1', name: 'Phí xử lý bồn rửa hóa chất', priceText: '800,000 ₫ / Lần', isChecked: true },
            ],
            vasOptions: [
              'Bãi sang tải ngoài trời cách ly an toàn',
              'Trang thiết bị ứng phó sự cố hóa chất Spill-Kit',
              'Đội phản ứng nhanh túc trực 24/7',
            ],
            defaultVas: [
              'Bãi sang tải ngoài trời cách ly an toàn',
              'Trang thiết bị ứng phó sự cố hóa chất Spill-Kit',
            ],
          },
          {
            id: 'proj-haz-port',
            name: 'Cảng (Port Hazmat Logistics)',
            code: 'Cảng hóa chất',
            defaultFleet: 'Hạ tầng tiếp nhận và vận chuyển container nguy hiểm tại cảng biển',
            defaultOperation: 'Rút hàng giải phóng cont nguy hiểm theo khung giờ quy định của cảng vụ',
            defaultCommitment: 'Tuân thủ nghiêm ngặt quy định an toàn cảng biển',
            vehicleLov: ['Xe chuyên dụng rút cont hóa chất bãi cảng'],
            unitLov: ['Cont', 'Chuyến'],
            defaultRoutes: [
              {
                id: 'r-proj-haz-port-1',
                route: 'Cảng Cái Mép ⇄ Bồn chứa hóa chất chuyên dụng',
                origin: 'Cảng Cái Mép (BR-VT)',
                destination: 'Kho bồn hóa chất Phú Mỹ',
                vehicleType: 'Xe chuyên dụng rút cont hóa chất bãi cảng',
                pricingUnit: 'Cont',
                price: 5800000,
                currency: 'VND',
                sla: '4 - 8 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Xe chữa cháy trực tại hiện trường',
              'Kẹp chì seal an ninh cảng vụ',
            ],
            defaultFreeSurcharges: [
              'Xe chữa cháy trực tại hiện trường',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-haz-port-fee-1', name: 'Lệ phí an ninh hàng nguy hiểm cảng vụ', priceText: '$45 / Cont', isChecked: true },
            ],
            vasOptions: [
              'Xe chữa cháy trực tại hiện trường',
              'Thủ tục an ninh hàng nguy hiểm cảng vụ',
              'Rút cont hóa chất theo giờ quy định',
            ],
            defaultVas: [
              'Xe chữa cháy trực tại hiện trường',
              'Thủ tục an ninh hàng nguy hiểm cảng vụ',
            ],
          },
          {
            id: 'proj-haz-multi',
            name: 'Đa phương thức (Hazmat Multimodal)',
            code: 'Đa phương thức DG',
            defaultFleet: 'Vận chuyển hóa chất nguy hiểm kết hợp Biển + Đường sắt chuyên biệt',
            defaultOperation: 'Hành lang an toàn khép kín từ nhà máy lọc dầu đến các trạm phân phối',
            defaultCommitment: 'Bảo hiểm bồi thường ô nhiễm môi trường toàn diện',
            vehicleLov: ['Đa phương thức DG Biển + Sắt'],
            unitLov: ['Lô hàng', 'Container'],
            defaultRoutes: [
              {
                id: 'r-proj-haz-multi-1',
                route: 'Nhà máy Lọc hóa dầu ⇄ Trạm phân phối toàn quốc',
                origin: 'Dung Quất / Nghi Sơn',
                destination: 'Phân phối toàn quốc',
                vehicleType: 'Đa phương thức DG Biển + Sắt',
                pricingUnit: 'Lô hàng',
                price: 55000000,
                currency: 'VND',
                sla: 'Hành lang an toàn',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Giấy phép vận chuyển liên tỉnh & liên bộ',
              'Hành lang an toàn khép kín',
            ],
            defaultFreeSurcharges: [
              'Giấy phép vận chuyển liên tỉnh & liên bộ',
            ],
            paidSurchargeOptions: [
              { id: 'pproj-haz-multi-ins-1', name: 'Bảo hiểm trách nhiệm ô nhiễm môi trường', priceText: '0.3% giá trị lô hàng', isChecked: true },
            ],
            vasOptions: [
              'Giấy phép vận chuyển liên tỉnh & liên bộ',
              'Hành lang an toàn khép kín Biển + Đường sắt chuyên biệt',
              'Bảo hiểm bồi thường ô nhiễm môi trường',
            ],
            defaultVas: [
              'Giấy phép vận chuyển liên tỉnh & liên bộ',
              'Bảo hiểm bồi thường ô nhiễm môi trường',
            ],
          },
        ],
      },
    ],
  },
];

const getServiceTreeDisplayName = (name: string): string => {
  if (name.startsWith('Air Cargo')) return 'Bay thường';
  if (name.startsWith('Express')) return 'Chuyển phát nhanh';

  return name.replace(/\s*\([^)]*\)\s*$/, '').trim();
};

interface SupplierServiceCapabilityModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave: (declaredServices: any[]) => void;
  existingServices?: any[];
  isInline?: boolean;
}

export const SupplierServiceCapabilityModal: React.FC<SupplierServiceCapabilityModalProps> = ({
  isOpen = false,
  onClose,
  onSave,
  existingServices = [],
  isInline = false,
}) => {
  // Tree expansion state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    trucking: true,
    ocean: true,
    air: true,
    rail: false,
    warehousing: false,
    customs: false,
    'cross-border': false,
    project: false,
  });

  const [expandedCargoGroups, setExpandedCargoGroups] = useState<Record<string, boolean>>({
    'trucking-gen': true,
    'trucking-ref': true,
    'ocean-gen': true,
    'air-gen': true,
  });

  // Selected Service Models: Map model.id -> boolean
  const [selectedModelIds, setSelectedModelIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (existingServices.length > 0) {
      existingServices.forEach((srv) => {
        const matched = CAPABILITY_SERVICE_TREE.flatMap((c) =>
          c.cargoGroups.flatMap((g) => g.models)
        ).find((m) => m.name.includes(srv.title) || srv.title.includes(m.name) || m.code === srv.title);
        if (matched) {
          initial[matched.id] = true;
        }
      });
    } else {
      initial['trk-gen-ftl'] = true;
      initial['trk-gen-ltl'] = true;
      initial['trk-ref-ftl'] = true;
      initial['sea-gen-fcl'] = true;
      initial['air-gen-cargo'] = true;
    }
    return initial;
  });

  // Active focused model for the right-side form
  const [activeModelId, setActiveModelId] = useState<string>('trk-gen-ftl');

  // New Surcharges & VAS Creation Input States
  const [isAddingFreeSurcharge, setIsAddingFreeSurcharge] = useState(false);
  const [newFreeSurchargeName, setNewFreeSurchargeName] = useState('');

  const [isAddingPaidSurcharge, setIsAddingPaidSurcharge] = useState(false);
  const [newPaidSurchargeName, setNewPaidSurchargeName] = useState('');
  const [newPaidSurchargePrice, setNewPaidSurchargePrice] = useState('');

  const [isAddingVas, setIsAddingVas] = useState(false);
  const [newVasName, setNewVasName] = useState('');
  const [newVasCategory, setNewVasCategory] = useState('');
  const [newVasDesc, setNewVasDesc] = useState('');
  const [newVasPrice, setNewVasPrice] = useState('');
  const [newVasTag, setNewVasTag] = useState('');

  // Excel Import / Export State
  const [excelImportPreview, setExcelImportPreview] = useState<{
    fileName: string;
    routes: CapabilityRouteItem[];
    validCount: number;
    errorCount: number;
    warnings: string[];
  } | null>(null);
  const [excelImportMode, setExcelImportMode] = useState<'replace' | 'append'>('replace');
  const [isExportingTemplate, setIsExportingTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scheduleModalData, setScheduleModalData] = useState<ScheduleModalData | null>(null);
  const [costMatrixModalRoute, setCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [ltlCostMatrixModalRoute, setLtlCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [oceanLclCostMatrixModalRoute, setOceanLclCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [airCargoCostMatrixModalRoute, setAirCargoCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [airExpressCostMatrixModalRoute, setAirExpressCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [oceanFclCostMatrixModalRoute, setOceanFclCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [railFclCostMatrixModalRoute, setRailFclCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [railLclCostMatrixModalRoute, setRailLclCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [crossBorderFtlCostMatrixModalRoute, setCrossBorderFtlCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);
  const [crossBorderLtlCostMatrixModalRoute, setCrossBorderLtlCostMatrixModalRoute] = useState<CapabilityRouteItem | null>(null);

  const handleOpenCrossBorderLtlCostMatrixModal = (route: CapabilityRouteItem) => {
    setCrossBorderLtlCostMatrixModalRoute(route);
  };

  const handleSaveCrossBorderLtlCostMatrix = (routeId: string, updatedData: Partial<CapabilityRouteItem>) => {
    handleUpdateRouteRowMultiple(routeId, updatedData);
  };

  const handleOpenLtlCostMatrixModal = (route: CapabilityRouteItem) => {
    setLtlCostMatrixModalRoute(route);
  };

  const handleSaveLtlCostMatrix = (routeId: string, updatedData: Partial<CapabilityRouteItem>) => {
    handleUpdateRouteRowMultiple(routeId, updatedData);
  };

  const handleOpenAirCargoCostMatrixModal = (route: CapabilityRouteItem) => {
    setAirCargoCostMatrixModalRoute(route);
  };

  const handleSaveAirCargoCostMatrix = (routeId: string, updatedData: Partial<CapabilityRouteItem>) => {
    handleUpdateRouteRowMultiple(routeId, updatedData);
  };

  const handleOpenAirExpressCostMatrixModal = (route: CapabilityRouteItem) => {
    setAirExpressCostMatrixModalRoute(route);
  };

  const handleSaveAirExpressCostMatrix = (routeId: string, updatedData: Partial<CapabilityRouteItem>) => {
    handleUpdateRouteRowMultiple(routeId, updatedData);
  };

  const handleOpenOceanLclCostMatrixModal = (route: CapabilityRouteItem) => {
    setOceanLclCostMatrixModalRoute(route);
  };

  const handleSaveOceanLclCostMatrix = (routeId: string, updatedData: Partial<CapabilityRouteItem>) => {
    handleUpdateRouteRowMultiple(routeId, updatedData);
  };

  const handleOpenCostMatrixModal = (route: CapabilityRouteItem) => {
    setCostMatrixModalRoute(route);
  };

  const handleSaveCostMatrix = (routeId: string, matrix: VehiclePricingMatrixColumn[]) => {
    if (matrix.length === 0) return;
    const primaryVehicle = matrix[0];
    handleUpdateRouteRowMultiple(routeId, {
      vehiclePricingMatrix: matrix,
      price: primaryVehicle.totalPrice,
      truckBodyType: primaryVehicle.truckBodyType,
      truckTonnage: primaryVehicle.truckTonnage,
      vehicleType: `${primaryVehicle.truckTonnage ? primaryVehicle.truckTonnage.split(' (')[0] : ''} ${primaryVehicle.truckBodyType ? primaryVehicle.truckBodyType.split(' (')[0] : ''}`.trim(),
      departureSchedule: primaryVehicle.departureSchedule || 'Hàng ngày (Daily - Xuất bến 20:00)',
      sla: primaryVehicle.transitTimeDisplay || '2 Ngày',
      validUntil: primaryVehicle.validUntil || '2026-12-31',
    });
  };

  const handleOpenOceanFclCostMatrixModal = (route: CapabilityRouteItem) => {
    setOceanFclCostMatrixModalRoute(route);
  };

  const handleSaveOceanFclCostMatrix = (routeId: string, matrix: ContainerPricingMatrixColumn[]) => {
    if (matrix.length === 0) return;
    const primaryCont = matrix[0];
    handleUpdateRouteRowMultiple(routeId, {
      containerPricingMatrix: matrix,
      price: primaryCont.totalPrice,
      vehicleType: primaryCont.containerType,
      departureSchedule: primaryCont.departureSchedule || 'Thứ 4, Thứ 7 hàng tuần (Cut-off 17:00)',
      sla: primaryCont.transitTimeDisplay || '28 - 32 Ngày',
      transitType: primaryCont.transitType || 'Direct',
      freeDemDetDays: primaryCont.freeDemDetDays ?? 14,
      validUntil: primaryCont.validUntil || '2026-12-31',
    });
  };

  const handleOpenRailFclCostMatrixModal = (route: CapabilityRouteItem) => {
    setRailFclCostMatrixModalRoute(route);
  };

  const handleSaveRailFclCostMatrix = (routeId: string, matrix: RailContainerPricingMatrixColumn[]) => {
    if (matrix.length === 0) return;
    const primaryCont = matrix[0];
    handleUpdateRouteRowMultiple(routeId, {
      railContainerPricingMatrix: matrix,
      price: primaryCont.totalPrice,
      vehicleType: primaryCont.containerType,
      departureSchedule: primaryCont.departureSchedule || 'Thứ 3, Thứ 6 hàng tuần (Cắt bãi ga 18:00)',
      sla: primaryCont.transitTimeDisplay || '65 - 72 Giờ',
      transitType: primaryCont.transitType || 'Direct',
      freeDemDetDays: primaryCont.freeDemDetDays ?? 7,
      validUntil: primaryCont.validUntil || '2026-12-31',
    });
  };

  const handleOpenRailLclCostMatrixModal = (route: CapabilityRouteItem) => {
    setRailLclCostMatrixModalRoute(route);
  };

  const handleSaveRailLclCostMatrix = (routeId: string, updatedData: Partial<CapabilityRouteItem>) => {
    handleUpdateRouteRowMultiple(routeId, updatedData);
  };

  const handleOpenCrossBorderFtlCostMatrixModal = (route: CapabilityRouteItem) => {
    setCrossBorderFtlCostMatrixModalRoute(route);
  };

  const handleSaveCrossBorderFtlCostMatrix = (routeId: string, matrix: any[]) => {
    if (matrix.length === 0) return;
    const primaryVehicle = matrix[0];
    handleUpdateRouteRowMultiple(routeId, {
      vehiclePricingMatrix: matrix,
      price: primaryVehicle.totalPrice,
      truckBodyType: primaryVehicle.truckBodyType,
      truckTonnage: primaryVehicle.truckTonnage,
      vehicleType: `${primaryVehicle.truckTonnage ? primaryVehicle.truckTonnage.split(' (')[0] : ''} ${primaryVehicle.truckBodyType ? primaryVehicle.truckBodyType.split(' (')[0] : ''}`.trim(),
      transitMode: primaryVehicle.transitMode,
      customsScope: primaryVehicle.customsScope,
      pricingUnit: primaryVehicle.pricingUnit || 'Chuyến',
      currency: primaryVehicle.currency || 'VND',
      departureSchedule: primaryVehicle.departureSchedule || 'Hàng ngày (Xuất bến 20:00)',
      sla: primaryVehicle.transitTimeDisplay || '24 - 36 giờ',
      validUntil: primaryVehicle.validUntil || '2026-12-31',
    });
  };

  const handleOpenScheduleModal = (route: CapabilityRouteItem) => {
    const isOcean = activeCategory?.id === 'ocean' || activeModel?.id?.startsWith('sea-');
    const isRail = activeCategory?.id === 'rail' || activeModel?.id?.startsWith('rail-');
    const isAir = activeCategory?.id === 'air' || activeModel?.id?.startsWith('air-');
    const isExpress = activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express');
    const isAirCargo = isAir; // Cả Air Cargo và Express đều áp dụng cấu hình lịch bay & giờ cut-off ga hàng không
    const isLclModel = (isOcean || isRail) && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL');
    const currentSla = route.departureSchedule || route.sla || '';
    let parsedDays = DAYS_OF_WEEK_LOV.filter((d) => currentSla.includes(d.name)).map((d) => d.name);
    if (currentSla.includes('Hàng ngày') || currentSla.includes('hàng ngày') || currentSla.includes('T2 - CN')) {
      parsedDays = DAYS_OF_WEEK_LOV.map((d) => d.name);
    }

    // Extract time from string (e.g. 20:00 or 19:30 or 17:00 or 18:00)
    const timeMatch = currentSla.match(/(\d{1,2}:\d{2})/);
    const departureTime = timeMatch ? timeMatch[1] : (isAirCargo ? '18:00' : (isLclModel ? '17:00' : '20:00'));

    setScheduleModalData({
      routeId: route.id,
      routeName: route.route,
      origin: route.origin,
      destination: route.destination,
      selectedDays: parsedDays.length > 0 ? parsedDays : (isAirCargo ? ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'] : (isLclModel ? ['Thứ 4', 'Thứ 7'] : ['Thứ 2', 'Thứ 4', 'Thứ 6'])),
      departureTime,
      customNote: '',
      isLcl: isLclModel,
      isAirCargo,
    });
  };

  const handleSaveScheduleModal = () => {
    if (!scheduleModalData) return;
    const { routeId, selectedDays, departureTime, customNote, isLcl, isAirCargo } = scheduleModalData;

    let formatted = '';
    const cutOffPrefix = isAirCargo ? 'Cắt TCS' : (isLcl ? 'Cắt hàng CFS' : 'Xuất bến');
    if (selectedDays.length === 7) {
      formatted = `Hàng ngày${departureTime ? ` (${cutOffPrefix} ${departureTime})` : ''}`;
    } else if (selectedDays.length > 0) {
      const sortedDays = DAYS_OF_WEEK_LOV.filter((d) => selectedDays.includes(d.name)).map((d) => d.name);
      formatted = `${sortedDays.join(', ')}${departureTime ? ` (${cutOffPrefix} ${departureTime})` : ''}`;
    } else if (departureTime) {
      formatted = `${cutOffPrefix} ${departureTime}`;
    }

    if (customNote && customNote.trim()) {
      formatted += ` - ${customNote.trim()}`;
    }

    handleUpdateRouteRowMultiple(routeId, {
      sla: formatted,
      departureSchedule: formatted,
    });
    setScheduleModalData(null);
  };

  // STATE & HANDLERS CHO MODAL CHI TIET CO SO KHO (TECH SPECS, PHOTOS, GIA, PHU PHI, VAS)
  const [warehouseDetailModalData, setWarehouseDetailModalData] = useState<WarehouseDetailModalData | null>(null);
  const [activePhotoUploadSlot, setActivePhotoUploadSlot] = useState<{ key: string; label: string } | null>(null);
  const [warehouseDetailActiveTab, setWarehouseDetailActiveTab] = useState<'photos' | 'techSpecs' | 'pricing' | 'surcharges' | 'vas'>('photos');
  const [warehouseTechActiveCategory, setWarehouseTechActiveCategory] = useState<string>('structure');
  const warehousePhotoUploadRef = useRef<HTMLInputElement>(null);

  const handleOpenWarehouseDetailModal = (route: CapabilityRouteItem) => {
    const currentModelId = route.modelId || activeModel?.id;
    const initialCategories = getWarehouseTechSpecCategories(currentModelId, activeCargoGroup?.id);
    if (initialCategories.length > 0) {
      setWarehouseTechActiveCategory(initialCategories[0].id);
    }
    const isColdStorage = activeModel?.id?.includes('ref') || activeCargoGroup?.id?.includes('ref') || activeModel?.name?.includes('lạnh');
    const isChemicalStorage = activeModel?.id?.includes('haz') || activeCargoGroup?.id?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm');
    const isBondedStorage = Boolean(activeModel?.id === 'wh-gen-bon' || activeModel?.id?.includes('bon') || activeModel?.name?.toLowerCase().includes('ngoại quan') || activeModel?.code?.toLowerCase().includes('ngoại quan'));
    const isFulfillment = Boolean(activeModel?.id === 'wh-gen-ful' || activeModel?.id?.includes('ful') || activeModel?.name?.toLowerCase().includes('fulfillment') || activeModel?.name?.toLowerCase().includes('tmđt') || activeModel?.code?.toLowerCase().includes('fulfillment'));

    // Anh mau neu chua co anh
    const existingPhotos: WarehousePhotoItem[] = route.warehousePhotos && route.warehousePhotos.length > 0 
      ? JSON.parse(JSON.stringify(route.warehousePhotos))
      : (isColdStorage ? [
          {
            id: 'ph-cold-1',
            url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
            name: 'Cửa Dock lạnh có đệm trùm khí Inflatable Shelter',
            tag: 'Cửa xuất nhập lạnh',
            isCover: true,
          },
          {
            id: 'ph-cold-2',
            url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
            name: 'Khu vực Racking buồng lạnh âm sâu -25°C',
            tag: 'Buồng đông lạnh',
            isCover: false,
          },
          {
            id: 'ph-cold-3',
            url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80',
            name: 'Phòng đệm Antechamber & Bảng điện tử hiển thị nhiệt độ',
            tag: 'Phòng đệm & Cảm biến',
            isCover: false,
          },
        ] : isChemicalStorage ? [
          {
            id: 'ph-haz-1',
            url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
            name: 'Kho hóa chất tiêu chuẩn PCCC Foam & Bờ bao chống tràn',
            tag: 'Mặt tiền & Sân bãi',
            isCover: true,
          },
          {
            id: 'ph-haz-2',
            url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
            name: 'Khu vực lưu trữ Pallet chống tràn & Bồn IBC Tank 1000L',
            tag: 'Kệ chứa chuyên dụng',
            isCover: false,
          },
          {
            id: 'ph-haz-3',
            url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80',
            name: 'Hệ thống thông gió chống nổ cưỡng bức Ex-proof & Cảm biến khí',
            tag: 'PCCC & Thông gió',
            isCover: false,
          },
        ] : [
          {
            id: 'ph-1',
            url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
            name: 'Mat tien & San bai boc do xe cont',
            tag: 'Mặt tiền & Sân bãi',
            isCover: true,
          },
          {
            id: 'ph-2',
            url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
            name: 'He thong ke Racking Selective 5 tang',
            tag: 'Kệ Racking',
            isCover: false,
          },
          {
            id: 'ph-3',
            url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80',
            name: 'San be tong Epoxy & PCCC Sprinkler',
            tag: 'Sàn & Trần kho',
            isCover: false,
          },
        ]);

    // Thong so ky thuat
    const existingSpecs: WarehouseTechSpecs = route.warehouseTechSpecs 
      ? JSON.parse(JSON.stringify(route.warehouseTechSpecs))
      : {
          clearHeight: 10.5,
          floorLoad: isChemicalStorage ? 7.5 : 5.0,
          floorType: isChemicalStorage 
            ? 'Bê tông phủ Epoxy chịu axit/hóa chất & rãnh thu dung dịch tràn' 
            : 'Bê tông xoa Hardener chống bụi',
          columnGrid: '12m × 18m',
          ventilation: isColdStorage 
            ? 'Dàn quạt đối lưu tuần hoàn không khí lạnh tự động' 
            : (isChemicalStorage ? 'Hệ thống thông gió chống cháy nổ Ex-proof & hút khí nặng 24/7' : 'Quả cầu hút nhiệt & Lam gió tự nhiên'),
          rackingTypes: isChemicalStorage 
            ? ['Kệ Pallet hóa chất', 'Kệ để phuy sắt chuyên dụng'] 
            : ['Kệ Selective', 'Kệ Drive-in'],
          rackingLevels: isColdStorage ? 6 : (isChemicalStorage ? 4 : 5),
          palletLoadLimit: isChemicalStorage ? 1500 : 1000,
          compatiblePalletSizes: ['1m × 1.2m (ISO standard)', '1.1m × 1.1m'],
          dockDoorsCount: 6,
          hasDockLeveler: true,
          hasDockShelter: isColdStorage,
          yardTurnaround: 'Sân rộng 35m, xe cont 40ft/45ft quay đầu 24/7',
          operatingHoursTrucks: isChemicalStorage ? '07:30 - 18:00 xe hóa chất' : '24/7 không cấm giờ',
          fireProtectionSystem: isChemicalStorage 
            ? 'Hệ thống PCCC tự động bọt Foam AFFF chuyên dụng dập cháy dung môi hóa chất' 
            : 'PCCC tự động Sprinkler (Đã nghiệm thu PCCC)',
          fireProtectionApprovalNo: isChemicalStorage ? 'Số 216/TD-PCCC-CN' : 'Số 148/TD-PCCC',
          cctvSurveillance: 'CCTV 24/7 full kho trong & ngoài, lưu trữ 60 ngày',
          securityGuards: 'Bảo vệ chuyên nghiệp 2 lớp 24/7',
          wmsSoftwareName: isColdStorage ? 'WMS ColdChain IoT Real-time' : (isChemicalStorage ? 'WMS Hazmat & MSDS Tracker' : 'WMS Real-time Cloud'),
          scanningTechnologies: ['Barcode 1D/2D', 'QR Code', 'RFID'],
          hasApiIntegration: true,
          realtimeWebPortal: true,
          temperatureRange: isColdStorage ? '-18°C ~ -25°C & +2°C ~ +8°C' : '+18°C ~ +25°C',
          coolingSystemBrand: isColdStorage ? 'Bitzer (Đức) / Dàn lạnh Guentner' : undefined,
          hasAutoDataLogger: isColdStorage,
          hasBackupGeneratorAts: true,
          certifications: isColdStorage 
            ? ['ISO 9001:2015', 'HACCP', 'GDP Dược Phẩm', 'Chuỗi Cung Ứng Lạnh Tiêu Chuẩn'] 
            : (isChemicalStorage ? ['Đủ điều kiện kinh doanh hóa chất', 'ISO 14001:2015', 'Nghiệm thu PCCC phòng nổ', 'Giấy phép BVMT'] : ['ISO 9001:2015', 'HACCP', 'GDP']),
          hasFullInsurance: true,
        };

    const existingFree = route.warehouseFreeSurcharges && route.warehouseFreeSurcharges.length > 0
      ? [...route.warehouseFreeSurcharges]
      : (isBondedStorage
          ? (isColdStorage
              ? BONDED_COLD_FREE_UTILITIES_SUGGESTIONS.slice(0, 4)
              : (isChemicalStorage
                  ? BONDED_HAZMAT_FREE_UTILITIES_SUGGESTIONS.slice(0, 4)
                  : BONDED_GENERAL_FREE_UTILITIES_SUGGESTIONS.slice(0, 4)))
          : (isColdStorage
              ? COLD_FREE_UTILITIES_SUGGESTIONS.slice(0, 4)
              : (isChemicalStorage
                  ? HAZMAT_FREE_UTILITIES_SUGGESTIONS.slice(0, 4)
                  : (activeModel?.defaultFreeSurcharges || WAREHOUSE_FREE_UTILITIES_SUGGESTIONS.slice(0, 4)))));

        const existingPaid: PaidSurchargeItem[] = route.warehousePaidSurcharges && route.warehousePaidSurcharges.length > 0
      ? JSON.parse(JSON.stringify(route.warehousePaidSurcharges))
      : (isFulfillment
          ? FULFILLMENT_WAREHOUSE_SUGGESTED_SURCHARGES.slice(0, 6).map(s => ({
              id: `pwh-${s.code}`,
              code: s.code,
              name: s.name,
              category: s.category,
              unit: s.unit,
              priceText: s.defaultPrice,
              isChecked: true,
            }))
          : (isBondedStorage
          ? (isColdStorage
              ? BONDED_COLD_SUGGESTED_SURCHARGES.slice(0, 6).map(s => ({
                  id: `pwh-${s.code}`,
                  code: s.code,
                  name: s.name,
                  category: s.category,
                  unit: s.unit,
                  priceText: s.defaultPrice,
                  isChecked: true,
                }))
              : isChemicalStorage
                ? BONDED_HAZMAT_SUGGESTED_SURCHARGES.slice(0, 6).map(s => ({
                    id: `pwh-${s.code}`,
                    code: s.code,
                    name: s.name,
                    category: s.category,
                    unit: s.unit,
                    priceText: s.defaultPrice,
                    isChecked: true,
                  }))
                : BONDED_GENERAL_SUGGESTED_SURCHARGES.slice(0, 6).map(s => ({
                    id: `pwh-${s.code}`,
                    code: s.code,
                    name: s.name,
                    category: s.category,
                    unit: s.unit,
                    priceText: s.defaultPrice,
                    isChecked: true,
                  })))
          : (isColdStorage
              ? COLD_WAREHOUSE_SUGGESTED_SURCHARGES.slice(0, 6).map(s => ({
                  id: `pwh-${s.code}`,
                  code: s.code,
                  name: s.name,
                  category: s.category,
                  unit: s.unit,
                  priceText: s.defaultPrice,
                  isChecked: true,
                }))
              : isChemicalStorage
                ? HAZMAT_WAREHOUSE_SUGGESTED_SURCHARGES.slice(0, 6).map(s => ({
                    id: `pwh-${s.code}`,
                    code: s.code,
                    name: s.name,
                    category: s.category,
                    unit: s.unit,
                    priceText: s.defaultPrice,
                    isChecked: true,
                  }))
                : [
                    { id: 'pwh-1', name: 'Phí nâng hạ & dỡ hàng nhập kho (Inbound)', priceText: '35,000 ₫ / Pallet', isChecked: true },
                    { id: 'pwh-2', name: 'Phí lấy hàng & bốc xếp xuất kho (Outbound)', priceText: '35,000 ₫ / Pallet', isChecked: true },
                    { id: 'pwh-3', name: 'Phí rút ruột container 40ft thủ công & lên Pallet', priceText: '1,200,000 ₫ / Cont 40ft', isChecked: true },
                    { id: 'pwh-4', name: 'Phí kiểm đếm chi tiết từng SKU lẻ', priceText: '500 ₫ / SKU', isChecked: false },
                    { id: 'pwh-5', name: 'Phí làm việc ngoài giờ hành chính', priceText: '200,000 ₫ / Giờ', isChecked: false },
                  ])));

        const existingVas: CapabilityVasItem[] = route.warehouseVasItems && route.warehouseVasItems.length > 0
      ? JSON.parse(JSON.stringify(route.warehouseVasItems))
      : (isFulfillment
          ? FULFILLMENT_WAREHOUSE_SUGGESTED_VAS.slice(0, 5).map(v => ({
              id: `vwh-${v.code}`,
              code: v.code,
              name: v.name,
              category: v.category,
              unit: v.unit,
              priceText: v.defaultPrice,
              isChecked: true,
              includedInRate: v.isFree,
            }))
          : (isBondedStorage
          ? (isColdStorage
              ? BONDED_COLD_SUGGESTED_VAS.slice(0, 5).map(v => ({
                  id: `vwh-${v.code}`,
                  code: v.code,
                  name: v.name,
                  category: v.category,
                  unit: v.unit,
                  priceText: v.defaultPrice,
                  isChecked: true,
                }))
              : isChemicalStorage
                ? BONDED_HAZMAT_SUGGESTED_VAS.slice(0, 5).map(v => ({
                    id: `vwh-${v.code}`,
                    code: v.code,
                    name: v.name,
                    category: v.category,
                    unit: v.unit,
                    priceText: v.defaultPrice,
                    isChecked: true,
                  }))
                : BONDED_GENERAL_SUGGESTED_VAS.slice(0, 5).map(v => ({
                    id: `vwh-${v.code}`,
                    code: v.code,
                    name: v.name,
                    category: v.category,
                    unit: v.unit,
                    priceText: v.defaultPrice,
                    isChecked: true,
                  })))
          : (isColdStorage
              ? COLD_WAREHOUSE_SUGGESTED_VAS.slice(0, 5).map(v => ({
                  id: `vwh-${v.code}`,
                  code: v.code,
                  name: v.name,
                  category: v.category,
                  unit: v.unit,
                  priceText: v.defaultPrice,
                  isChecked: true,
                }))
              : isChemicalStorage
                ? HAZMAT_WAREHOUSE_SUGGESTED_VAS.slice(0, 5).map(v => ({
                    id: `vwh-${v.code}`,
                    code: v.code,
                    name: v.name,
                    category: v.category,
                    unit: v.unit,
                    priceText: v.defaultPrice,
                    isChecked: true,
                  }))
                : [
                    { id: 'vwh-1', name: 'Dán tem phụ tiếng Việt / Barcode SKU', category: 'Đóng Gói & Xử Lý', priceText: '400 ₫ / Tem', isChecked: true },
                    { id: 'vwh-2', name: 'Quấn màng co PE Pallet & Đóng đai bảo vệ', category: 'Đóng Gói & Xử Lý', priceText: '35,000 ₫ / Pallet', isChecked: true },
                    { id: 'vwh-3', name: 'Đóng thùng carton kitting combo / Hộp quà', category: 'Đóng Gói & Xử Lý', priceText: '5,000 ₫ / Hộp', isChecked: false },
                    { id: 'vwh-4', name: 'Bảo hiểm cháy nổ tài sản kho bãi', category: 'An Ninh & Bảo Hiểm', priceText: '0.05% giá trị hàng', isChecked: true },
                  ])));

    const capArea = route.capacityArea ?? 2500;
    const capPallet = route.capacityPallets ?? 1800;
    const capVol = route.capacityVolume ?? 3000;
    const availArea = route.availableArea ?? 850;
    const availPallet = route.availablePallets ?? 600;
    const availVol = route.availableVolume ?? 1100;

    setWarehouseDetailModalData({
      routeId: route.id,
      modelId: currentModelId,
      warehouseCode: route.customsWarehouseCode || route.warehouseCode || route.routeCode || 'WH-001',
      warehouseName: route.warehouseName || route.route || 'Kho Phân Phối DC',
      province: route.warehouseProvince || route.origin || 'Bình Dương',
      address: route.warehouseAddress || route.destination || 'KCN Sóng Thần 1, Dĩ An',
      isColdStorage,
      isChemicalStorage,
      isBondedStorage,
      customsWarehouseCode: route.customsWarehouseCode || route.warehouseCode || '02B1B01',
      customsAuthority: route.customsAuthority || CUSTOMS_AUTHORITIES_LOV[0],
      photos: existingPhotos,
      techSpecs: existingSpecs,
      freeSurcharges: existingFree,
      paidSurcharges: existingPaid,
      vasItems: existingVas,
      capacityArea: capArea,
      capacityPallets: capPallet,
      capacityVolume: capVol,
      availableArea: availArea,
      availablePallets: availPallet,
      availableVolume: availVol,
      occupiedArea: route.occupiedArea ?? Math.max(0, capArea - availArea),
      occupiedPallets: route.occupiedPallets ?? Math.max(0, capPallet - availPallet),
      occupiedVolume: route.occupiedVolume ?? Math.max(0, capVol - availVol),
      receptionStatus: route.receptionStatus || 'ready',
      pricePerArea: route.pricePerArea ?? (route.price || 95000),
      pricePerPallet: route.pricePerPallet ?? 110000,
      pricePerVolume: route.pricePerVolume ?? 120000,
      pricePerTon: route.pricePerTon ?? 150000,
      minChargeMonthly: route.minChargeMonthly ?? 3000000,
      currency: route.currency || 'VND',
      validUntil: route.validUntil || '2026-12-31',
      promotionPercent: route.promotionPercent ?? 0,
      sla: route.sla || 'Xuất nhập 2 - 4h',
      operatingHours: route.operatingHours || '24/7 (Không cấm giờ xe cont)',
      cutOffTime: route.cutOffTime || '16:30 hàng ngày',
      paymentTerms: route.paymentTerms || 'Net 30 ngày',
    });
    setWarehouseDetailActiveTab('photos');
    setWarehouseTechActiveCategory(initialCategories[0]?.id || 'structure');
  };

  const handleSaveWarehouseDetailModal = () => {
    if (!warehouseDetailModalData) return;
    const {
      routeId,
      photos,
      techSpecs,
      freeSurcharges,
      paidSurcharges,
      vasItems,
      capacityArea,
      capacityPallets,
      capacityVolume,
      availableArea,
      availablePallets,
      availableVolume,
      occupiedArea,
      occupiedPallets,
      occupiedVolume,
      receptionStatus,
      pricePerArea,
      pricePerPallet,
      pricePerVolume,
      pricePerTon,
      minChargeMonthly,
      currency,
      validUntil,
      promotionPercent,
      sla,
      operatingHours,
      cutOffTime,
      paymentTerms,
    } = warehouseDetailModalData;

    handleUpdateRouteRowMultiple(routeId, {
      warehousePhotos: photos,
      warehouseTechSpecs: techSpecs,
      warehouseFreeSurcharges: freeSurcharges,
      warehousePaidSurcharges: paidSurcharges,
      warehouseVasItems: vasItems,
      capacityArea: capacityArea ?? 0,
      capacityPallets: capacityPallets ?? 0,
      capacityVolume: capacityVolume ?? 0,
      availableArea: availableArea ?? 0,
      availablePallets: availablePallets ?? 0,
      availableVolume: availableVolume ?? 0,
      occupiedArea: occupiedArea ?? 0,
      occupiedPallets: occupiedPallets ?? 0,
      occupiedVolume: occupiedVolume ?? 0,
      receptionStatus: receptionStatus || 'ready',
      pricePerArea: pricePerArea ?? 0,
      price: pricePerArea ?? 0,
      pricePerPallet: pricePerPallet ?? 0,
      pricePerVolume: pricePerVolume ?? 0,
      pricePerTon: pricePerTon ?? 0,
      minChargeMonthly: minChargeMonthly ?? 0,
      currency: currency || 'VND',
      validUntil: validUntil || '2026-12-31',
      promotionPercent: promotionPercent ?? 0,
      sla: sla || 'Xuất nhập 2 - 4h',
      operatingHours: operatingHours || '24/7 (Không cấm giờ xe cont)',
      cutOffTime: cutOffTime || '16:30 hàng ngày',
      paymentTerms: paymentTerms || 'Net 30 ngày',
    });
    setWarehouseDetailModalData(null);
  };

  const handleUploadWarehousePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !warehouseDetailModalData) return;

    const targetSlot = activePhotoUploadSlot;
    const file = files[0]; // 1 ảnh cho mỗi slot cụ thể
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setWarehouseDetailModalData((prev) => {
          if (!prev) return prev;
          const slotTag = targetSlot?.label || 'Ảnh thực tế';
          const slotKey = targetSlot?.key || 'custom';
          
          // Xóa ảnh cũ của slot này nếu có và thay bằng ảnh mới
          const filteredPhotos = prev.photos.filter((p) => p.tag !== slotTag && p.slotKey !== slotKey);
          
          return {
            ...prev,
            photos: [
              ...filteredPhotos,
              {
                id: `wh-img-${Date.now()}`,
                url: res,
                name: targetSlot ? targetSlot.label : file.name,
                tag: slotTag,
                slotKey: slotKey,
              },
            ],
          };
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input để cho phép chọn lại cùng file
  };

  const [tieredPricingModalData, setTieredPricingModalData] = useState<TieredPricingModalData | null>(null);
  const [tieredPricingActiveTab, setTieredPricingActiveTab] = useState<'weight' | 'volume'>('weight');

  const handleOpenTieredPricingModal = (route: CapabilityRouteItem) => {
    const isOcean = activeCategory?.id === 'ocean' || activeModel?.id?.startsWith('sea-');
    const isRail = activeCategory?.id === 'rail' || activeModel?.id?.startsWith('rail-');
    const isAir = activeCategory?.id === 'air' || activeModel?.id?.startsWith('air-');
    const isExpress = activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express');
    const isAirCargo = isAir && !isExpress;
    const isLclModel = (isOcean || isRail) && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL');
    const isWeightBasis = isAirCargo || !route.pricingUnit || route.pricingUnit.toLowerCase().includes('kg') || route.pricingUnit.toLowerCase().includes('tấn');
    const routeCurrency = route.currency || ((isOcean || isAir) ? 'USD' : 'VND');

    let existingConfig = route.ltlPricing;
    if (!existingConfig) {
      if (isAirCargo) {
        existingConfig = createDefaultAirPricingConfig(
          routeCurrency,
          route.price > 0 ? route.price : (routeCurrency === 'USD' ? 4.2 : 105000)
        );
      } else if (isLclModel) {
        existingConfig = createDefaultLclPricingConfig(
          isWeightBasis ? 'weight' : 'volume',
          routeCurrency,
          route.price > 0 ? route.price : (routeCurrency === 'USD' ? 25 : 500000)
        );
      } else {
        existingConfig = createDefaultLtlPricingConfig(
          isWeightBasis ? 'weight' : 'volume',
          route.price > 0 ? (isWeightBasis ? route.price : Math.round(route.price / 250)) : 2000,
          route.price > 0 ? (!isWeightBasis ? route.price : Math.round(route.price * 250)) : 500000
        );
      }
    }

    const isRailLclModel = isRail && isLclModel;
    setTieredPricingModalData({
      routeId: route.id,
      routeName: route.route,
      origin: route.origin,
      destination: route.destination,
      currency: routeCurrency,
      isLcl: isLclModel,
      isAirCargo,
      isExpress,
      isRailLcl: isRailLclModel,
      pricingConfig: JSON.parse(JSON.stringify(existingConfig)),
    });
    setTieredPricingActiveTab('weight');
  };

  const handleSaveTieredPricingModal = () => {
    if (!tieredPricingModalData) return;
    const { routeId, pricingConfig, currency, isLcl, isAirCargo } = tieredPricingModalData;
    const isWeight = pricingConfig.pricingBasis === 'weight';
    const repPrice = isAirCargo
      ? (pricingConfig.weightTiers[2]?.price || pricingConfig.weightTiers[0]?.price || (currency === 'USD' ? 4.2 : 105000))
      : isWeight 
        ? (pricingConfig.weightTiers[1]?.price || pricingConfig.weightTiers[0]?.price || (currency === 'USD' ? 25 : 2000))
        : (pricingConfig.volumeTiers[1]?.price || pricingConfig.volumeTiers[0]?.price || (currency === 'USD' ? 25 : 500000));

    handleUpdateRouteRowMultiple(routeId, {
      ltlPricing: pricingConfig,
      pricingUnit: isWeight ? 'Kg' : (isLcl ? 'CBM' : 'CBM'),
      price: repPrice,
    });
    setTieredPricingModalData(null);
  };

  // Custom Form Data per model: Map model.id -> ModelCapabilityFormData
  const [modelFormData, setModelFormData] = useState<Record<string, ModelCapabilityFormData>>(() => {
    const initial: Record<string, ModelCapabilityFormData> = {};
    CAPABILITY_SERVICE_TREE.forEach((cat) => {
      cat.cargoGroups.forEach((cg) => {
        cg.models.forEach((m) => {
          initial[m.id] = {
            fleet: m.defaultFleet,
            operationCapacity: m.defaultOperation,
            serviceCommitment: m.defaultCommitment,
            routes: JSON.parse(JSON.stringify(m.defaultRoutes)),
            freeSurchargeOptions: [...m.freeSurchargeOptions],
            freeSurcharges: [...m.defaultFreeSurcharges],
            paidSurcharges: JSON.parse(JSON.stringify(m.paidSurchargeOptions)),
            vasOptions: [...m.vasOptions],
            selectedVas: [...m.defaultVas],
            vasItems: getDefaultVasItemsForModel(m.id, cat.id),
          };
        });
      });
    });
    return initial;
  });

  if (!isOpen && !isInline) return null;

  // Find currently active model details
  let activeModel: any = null;
  let activeCategory: ServiceCategoryTree | null = null;
  let activeCargoGroup: any = null;

  for (const cat of CAPABILITY_SERVICE_TREE) {
    for (const cg of cat.cargoGroups) {
      const found = cg.models.find((m) => m.id === activeModelId);
      if (found) {
        activeModel = found;
        activeCategory = cat;
        activeCargoGroup = cg;
        break;
      }
    }
    if (activeModel) break;
  }

  // Toggle Category open/close
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Toggle Cargo Group open/close
  const toggleCargoGroup = (cgId: string) => {
    setExpandedCargoGroups((prev) => ({ ...prev, [cgId]: !prev[cgId] }));
  };

  // Toggle Checkbox for a Model
  const toggleModelCheck = (modelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedModelIds((prev) => {
      const next = { ...prev, [modelId]: !prev[modelId] };
      return next;
    });
    setActiveModelId(modelId);
  };

  // Toggle Checkbox for an entire Cargo Group
  const toggleCargoGroupCheck = (cg: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const allChecked = cg.models.every((m: any) => selectedModelIds[m.id]);
    const nextVal = !allChecked;
    setSelectedModelIds((prev) => {
      const next = { ...prev };
      cg.models.forEach((m: any) => {
        next[m.id] = nextVal;
      });
      return next;
    });
    if (nextVal && cg.models.length > 0) {
      setActiveModelId(cg.models[0].id);
    }
  };

  // Toggle Checkbox for an entire Category
  const toggleCategoryCheck = (cat: ServiceCategoryTree, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const allModels = cat.cargoGroups.flatMap((cg) => cg.models);
    const allChecked = allModels.every((m) => selectedModelIds[m.id]);
    const nextVal = !allChecked;
    setSelectedModelIds((prev) => {
      const next = { ...prev };
      allModels.forEach((m) => {
        next[m.id] = nextVal;
      });
      return next;
    });
    if (nextVal && allModels.length > 0) {
      setActiveModelId(allModels[0].id);
    }
  };

  // Current model data
  const currentData: ModelCapabilityFormData = modelFormData[activeModelId] || {
    fleet: activeModel?.defaultFleet || '',
    operationCapacity: activeModel?.defaultOperation || '',
    serviceCommitment: activeModel?.defaultCommitment || '',
    routes: activeModel ? JSON.parse(JSON.stringify(activeModel.defaultRoutes)) : [],
    freeSurchargeOptions: activeModel?.freeSurchargeOptions || [],
    freeSurcharges: activeModel?.defaultFreeSurcharges || [],
    paidSurcharges: activeModel?.paidSurchargeOptions || [],
    vasOptions: activeModel?.vasOptions || [],
    selectedVas: activeModel?.defaultVas || [],
    vasItems: getDefaultVasItemsForModel(activeModelId, activeCategory?.id),
  };

  // Update field in current model
  const updateCurrentFormData = <K extends keyof ModelCapabilityFormData>(field: K, val: ModelCapabilityFormData[K]) => {
    setModelFormData((prev) => ({
      ...prev,
      [activeModelId]: {
        ...prev[activeModelId],
        [field]: val,
      },
    }));
  };

  // ==========================================
  // SECTION 2: EXCEL TEMPLATE EXPORT & IMPORT ENGINE
  // ==========================================
  const handleDownloadExcelTemplate = () => {
    try {
      setIsExportingTemplate(true);
      const isTrucking = activeCategory?.id === 'trucking';
      const isLtlTrucking = isTrucking && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
      const isWarehousing = activeCategory?.id === 'warehousing';
    const isReeferTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref'));
      const isHazmatTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg'));
      const cargoType: 'general' | 'reefer' | 'hazmat' | 'ltl' = isLtlTrucking ? 'ltl' : (isHazmatTrucking ? 'hazmat' : (isReeferTrucking ? 'reefer' : 'general'));
      const bodyTypes = isLtlTrucking ? LTL_TRUCKING_BODY_TYPES : (isHazmatTrucking ? HAZMAT_TRUCKING_BODY_TYPES : (isReeferTrucking ? REEFER_TRUCKING_BODY_TYPES : TRUCKING_BODY_TYPES));
      const bodyMap = isLtlTrucking ? LTL_TRUCKING_BODY_TYPE_MAP : (isHazmatTrucking ? HAZMAT_TRUCKING_BODY_TYPE_MAP : (isReeferTrucking ? REEFER_TRUCKING_BODY_TYPE_MAP : TRUCKING_BODY_TYPE_MAP));
      const modelCode = activeModel?.code || activeCategory?.id || 'FTL';

      // 1. Data rows for Sheet 1: BANG_GIA_TUYEN_DUONG
      const sampleData = (currentData.routes && currentData.routes.length > 0)
        ? currentData.routes.map((r, i) => ({
            'Mã Tuyến': r.routeCode || `RC-${modelCode.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
            'Tuyến Đường (*)': r.route,
            'Điểm Đi (*)': r.origin,
            'Điểm Đến (*)': r.destination,
            ...(isTrucking ? {
              'Loại Thùng Phương Tiện (*)': r.truckBodyType || bodyTypes[0],
              'Phân Khúc Tải Trọng (*)': r.truckTonnage || getTonnagesForBodyType(r.truckBodyType, cargoType)[0],
            } : {
              'Loại Phương Tiện (*)': r.vehicleType || activeModel?.vehicleLov?.[0] || 'Phương tiện chuẩn',
            }),
            'Đơn Vị Tính (*)': r.pricingUnit || (isLtlTrucking ? 'Kg' : (isTrucking ? 'Chuyến' : 'Tấn')),
            ...(isLtlTrucking ? {
              'Cước Sàn Tối Thiểu (Min Charge)': r.ltlPricing?.minCharge || 100000,
              'Bậc 1 (1 - 50 Kg) [₫/Kg]': r.ltlPricing?.weightTiers[0]?.price || 2500,
              'Bậc 2 (51 - 200 Kg) [₫/Kg]': r.ltlPricing?.weightTiers[1]?.price || 2000,
              'Bậc 3 (201 - 500 Kg) [₫/Kg]': r.ltlPricing?.weightTiers[2]?.price || 1650,
              'Bậc 4 (501 - 1000 Kg) [₫/Kg]': r.ltlPricing?.weightTiers[3]?.price || 1350,
              'Bậc 5 (> 1000 Kg) [₫/Kg]': r.ltlPricing?.weightTiers[4]?.price || 1100,
              'Bậc V1 (< 1 CBM) [₫/CBM]': r.ltlPricing?.volumeTiers[0]?.price || 600000,
              'Bậc V2 (1 - 3 CBM) [₫/CBM]': r.ltlPricing?.volumeTiers[1]?.price || 500000,
              'Bậc V3 (3.1 - 6 CBM) [₫/CBM]': r.ltlPricing?.volumeTiers[2]?.price || 420000,
              'Bậc V4 (6.1 - 10 CBM) [₫/CBM]': r.ltlPricing?.volumeTiers[3]?.price || 380000,
              'Bậc V5 (> 10 CBM) [₫/CBM]': r.ltlPricing?.volumeTiers[4]?.price || 320000,
              'Lịch Chạy Hàng (*)': r.sla || 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)',
            } : {
              'Đơn Giá (VND) (*)': r.price || 15000000,
              'SLA Thời Gian': r.sla || '24 - 48 giờ',
            }),
            'Hạn Giá (YYYY-MM-DD)': r.validUntil || '2026-12-31',
            'Promotion (%)': r.promotionPercent || 0,
          }))
        : isLtlTrucking ? [
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-001`,
              'Tuyến Đường (*)': 'Hà Nội ⇄ TP.HCM',
              'Điểm Đi (*)': 'Hub Thanh Trì (Hà Nội)',
              'Điểm Đến (*)': 'Hub Quận 12 (TP.HCM)',
              'Loại Thùng Phương Tiện (*)': 'Xe Thùng Kín Chuyên Tuyến Ghép LTL',
              'Phân Khúc Tải Trọng (*)': '15.0T (3 Chân thùng kín chạy tuyến cố định) —— (55 – 60 CBM)',
              'Đơn Vị Tính (*)': 'Kg',
              'Cước Sàn Tối Thiểu (Min Charge)': 100000,
              'Bậc 1 (1 - 50 Kg) [₫/Kg]': 2500,
              'Bậc 2 (51 - 200 Kg) [₫/Kg]': 2000,
              'Bậc 3 (201 - 500 Kg) [₫/Kg]': 1650,
              'Bậc 4 (501 - 1000 Kg) [₫/Kg]': 1350,
              'Bậc 5 (> 1000 Kg) [₫/Kg]': 1100,
              'Bậc V1 (< 1 CBM) [₫/CBM]': 600000,
              'Bậc V2 (1 - 3 CBM) [₫/CBM]': 500000,
              'Bậc V3 (3.1 - 6 CBM) [₫/CBM]': 420000,
              'Bậc V4 (6.1 - 10 CBM) [₫/CBM]': 380000,
              'Bậc V5 (> 10 CBM) [₫/CBM]': 320000,
              'Lịch Chạy Hàng (*)': 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 10,
            },
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-002`,
              'Tuyến Đường (*)': 'HCM ⇄ Đà Nẵng',
              'Điểm Đi (*)': 'Hub Bình Tân (TP.HCM)',
              'Điểm Đến (*)': 'Hub Hòa Cầm (Đà Nẵng)',
              'Loại Thùng Phương Tiện (*)': 'Xe Mui Bạt Trục Bắc - Nam (Ghép Hàng Thể Tích)',
              'Phân Khúc Tải Trọng (*)': '8.0T – 9.0T (2 Chân thùng dài 9.8m ghép hàng cồng kềnh) —— (~55 CBM)',
              'Đơn Vị Tính (*)': 'CBM',
              'Cước Sàn Tối Thiểu (Min Charge)': 150000,
              'Bậc 1 (1 - 50 Kg) [₫/Kg]': 2250,
              'Bậc 2 (51 - 200 Kg) [₫/Kg]': 1800,
              'Bậc 3 (201 - 500 Kg) [₫/Kg]': 1500,
              'Bậc 4 (501 - 1000 Kg) [₫/Kg]': 1200,
              'Bậc 5 (> 1000 Kg) [₫/Kg]': 1000,
              'Bậc V1 (< 1 CBM) [₫/CBM]': 500000,
              'Bậc V2 (1 - 3 CBM) [₫/CBM]': 420000,
              'Bậc V3 (3.1 - 6 CBM) [₫/CBM]': 350000,
              'Bậc V4 (6.1 - 10 CBM) [₫/CBM]': 320000,
              'Bậc V5 (> 10 CBM) [₫/CBM]': 270000,
              'Lịch Chạy Hàng (*)': 'Thứ 3, Thứ 5, Thứ 7 (Xuất bến 19:30)',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 0,
            },
          ] : isHazmatTrucking ? [
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-001`,
              'Tuyến Đường (*)': 'Bà Rịa - Vũng Tàu ⇄ Bình Dương',
              'Điểm Đi (*)': 'KCN Phú Mỹ (BR-VT)',
              'Điểm Đến (*)': 'KCN VSIP 2 (Bình Dương)',
              'Loại Thùng Phương Tiện (*)': 'Xe Tải Thùng Kín Chuyên Dụng Hóa Chất (DG Dry Box) - [Sàn chống tĩnh điện / Tiếp địa]',
              'Phân Khúc Tải Trọng (*)': '15.0T (3 Chân chở phuy / IBC Tank) —— (50 – 55 CBM)',
              'Đơn Vị Tính (*)': 'Chuyến',
              'Đơn Giá (VND) (*)': 14500000,
              'SLA Thời Gian': '4 - 6 giờ',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 0,
            },
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-002`,
              'Tuyến Đường (*)': 'Hải Phòng ⇄ Bắc Ninh',
              'Điểm Đi (*)': 'Cảng Đình Vũ (Hải Phòng)',
              'Điểm Đến (*)': 'KCN Yên Phong (Bắc Ninh)',
              'Loại Thùng Phương Tiện (*)': 'Đầu Kéo Kéo Bồn ISO Tank / Cont Hóa Chất (Hazmat Drayage) - [ISO Tank T11/T75 Quốc tế]',
              'Phân Khúc Tải Trọng (*)': 'Đầu kéo + Bồn ISO Tank 20ft (T11 / T50 / T75) —— (24.000 – 26.000 Lít)',
              'Đơn Vị Tính (*)': 'Chuyến',
              'Đơn Giá (VND) (*)': 18000000,
              'SLA Thời Gian': '5 - 7 giờ',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 5,
            },
          ] : isReeferTrucking ? [
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-001`,
              'Tuyến Đường (*)': 'Đà Lạt ⇄ TP.HCM',
              'Điểm Đi (*)': 'Đức Trọng (Lâm Đồng)',
              'Điểm Đến (*)': 'Chợ đầu mối Thủ Đức (TP.HCM)',
              'Loại Thùng Phương Tiện (*)': 'Xe Tải Thùng Đông Lạnh Trung (Regional Reefer) - [Giàn lạnh Thermo King]',
              'Phân Khúc Tải Trọng (*)': '5.0T – 6.5T (Thùng dài 5.8m – 6.2m) —— (24 – 28 CBM)',
              'Đơn Vị Tính (*)': 'Chuyến',
              'Đơn Giá (VND) (*)': 9500000,
              'SLA Thời Gian': '7 - 9 giờ',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 10,
            },
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-002`,
              'Tuyến Đường (*)': 'Cần Thơ ⇄ Hà Nội',
              'Điểm Đi (*)': 'KCN Trà Nóc (Cần Thơ)',
              'Điểm Đến (*)': 'KCN Quang Minh (Hà Nội)',
              'Loại Thùng Phương Tiện (*)': 'Xe Tải Đông Lạnh Tải Nặng 3 Chân (Long-haul Reefer) - [Trục Bắc Nam / 16-18 Pallets]',
              'Phân Khúc Tải Trọng (*)': '12.0T – 15.0T (3 Chân thùng dài 9.2m – 9.6m) —— (48 – 54 CBM)',
              'Đơn Vị Tính (*)': 'Chuyến',
              'Đơn Giá (VND) (*)': 45000000,
              'SLA Thời Gian': '45 - 50 giờ',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 0,
            },
          ] : [
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-001`,
              'Tuyến Đường (*)': 'HCM ⇄ Hà Nội',
              'Điểm Đi (*)': 'KCN Tân Bình (TP.HCM)',
              'Điểm Đến (*)': 'KCN Thăng Long (Hà Nội)',
              'Loại Thùng Phương Tiện (*)': 'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]',
              'Phân Khúc Tải Trọng (*)': '15.0T (Tải nặng 3 chân) —— (55 – 60 CBM)',
              'Đơn Vị Tính (*)': 'Chuyến',
              'Đơn Giá (VND) (*)': 28500000,
              'SLA Thời Gian': '48 - 60 giờ',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 15,
            },
            {
              'Mã Tuyến': `RC-${modelCode.toUpperCase()}-002`,
              'Tuyến Đường (*)': 'HCM ⇄ Đà Nẵng',
              'Điểm Đi (*)': 'KCN Sóng Thần (Bình Dương)',
              'Điểm Đến (*)': 'KCN Hòa Khánh (Đà Nẵng)',
              'Loại Thùng Phương Tiện (*)': 'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]',
              'Phân Khúc Tải Trọng (*)': '8.0T (Tải nặng 2 chân) —— (45 – 50 CBM)',
              'Đơn Vị Tính (*)': 'Chuyến',
              'Đơn Giá (VND) (*)': 16500000,
              'SLA Thời Gian': '24 - 36 giờ',
              'Hạn Giá (YYYY-MM-DD)': '2026-12-31',
              'Promotion (%)': 0,
            },
          ];

      const ws1 = XLSX.utils.json_to_sheet(sampleData);
      ws1['!cols'] = [
        { wch: 15 }, // Mã Tuyến
        { wch: 22 }, // Tuyến Đường
        { wch: 28 }, // Điểm Đi
        { wch: 28 }, // Điểm Đến
        { wch: 38 }, // Loại Thùng
        { wch: 35 }, // Tải Trọng
        { wch: 15 }, // ĐVT
        { wch: 18 }, // Đơn Giá
        { wch: isLtlTrucking ? 32 : 16 }, // Lịch Chạy Hàng / SLA
        { wch: 18 }, // Hạn Giá
        { wch: 15 }, // Promotion
      ];

      // 2. Data rows for Sheet 2: DANH_MUC_CHUAN_LOV
      const lovData: any[] = [];
      if (isTrucking) {
        Object.entries(bodyMap).forEach(([bodyType, tonnages]) => {
          tonnages.forEach((t) => {
            lovData.push({
              'Loại Thùng Phương Tiện': bodyType,
              'Phân Khúc Tải Trọng Hợp Lệ': t,
              'Đơn Vị Tính Khuyên Dùng': isLtlTrucking ? 'Kg, CBM' : 'Chuyến',
            });
          });
        });
      } else {
        (activeModel?.vehicleLov || ['Phương tiện chuẩn']).forEach((veh: string) => {
          lovData.push({
            'Loại Phương Tiện': veh,
            'Đơn Vị Tính Khuyên Dùng': activeModel?.unitLov?.join(', ') || 'Chuyến, Tấn',
          });
        });
      }

      const ws2 = XLSX.utils.json_to_sheet(lovData);
      ws2['!cols'] = [{ wch: 45 }, { wch: 45 }, { wch: 22 }, { wch: 28 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws1, 'BANG_GIA_TUYEN_DUONG');
      XLSX.utils.book_append_sheet(wb, ws2, 'DANH_MUC_CHUAN_LOV');

      XLSX.writeFile(wb, `flexGO_BieuGia_${modelCode}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error('Export Excel Template Error:', err);
      alert('Không thể tạo file template Excel. Vui lòng thử lại.');
    } finally {
      setIsExportingTemplate(false);
    }
  };

  const handleUploadExcelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const sheetName = wb.SheetNames.includes('BANG_GIA_TUYEN_DUONG') 
          ? 'BANG_GIA_TUYEN_DUONG' 
          : wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          alert('File Excel không có dữ liệu hàng nào. Vui lòng kiểm tra lại.');
          return;
        }

        const isTrucking = activeCategory?.id === 'trucking';
        const isLtlTrucking = isTrucking && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
        const isReeferTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref'));
        const isHazmatTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg'));
        const cargoType: 'general' | 'reefer' | 'hazmat' | 'ltl' = isLtlTrucking ? 'ltl' : (isHazmatTrucking ? 'hazmat' : (isReeferTrucking ? 'reefer' : 'general'));
        const bodyTypes = isLtlTrucking ? LTL_TRUCKING_BODY_TYPES : (isHazmatTrucking ? HAZMAT_TRUCKING_BODY_TYPES : (isReeferTrucking ? REEFER_TRUCKING_BODY_TYPES : TRUCKING_BODY_TYPES));
        const modelPrefix = (activeModel?.code || activeCategory?.id || 'RC').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const defaultUnit = isLtlTrucking ? 'Kg' : (isTrucking ? 'Chuyến' : (activeModel?.unitLov?.[0] || 'Chuyến'));
        const defaultBody = bodyTypes[0];
        const defaultTonnages = getTonnagesForBodyType(defaultBody, cargoType);
        const defaultTonnage = defaultTonnages[0];

        const parsedRoutes: CapabilityRouteItem[] = [];
        const warnings: string[] = [];
        let validCount = 0;
        let errorCount = 0;

        rawJson.forEach((row, rIdx) => {
          const rowNum = rIdx + 2; // Excel row numbering
          const routeName = String(row['Tuyến Đường (*)'] || row['Tuyến Đường'] || row['Tuyến'] || '').trim();
          const origin = String(row['Điểm Đi (*)'] || row['Điểm Đi'] || row['Điểm đi'] || '').trim();
          const destination = String(row['Điểm Đến (*)'] || row['Điểm Đến'] || row['Điểm đến'] || '').trim();
          const rawPrice = row['Đơn Giá (VND) (*)'] || row['Đơn Giá'] || row['Đơn giá'] || row['Giá'];
          const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;

          if (!routeName && !origin && !destination && price === 0) {
            // Empty row
            return;
          }

          if (!routeName || !origin || !destination) {
            errorCount++;
            warnings.push(`Dòng ${rowNum}: Thiếu thông tin Tuyến đường, Điểm đi hoặc Điểm đến.`);
            return;
          }

          if (price <= 0) {
            errorCount++;
            warnings.push(`Dòng ${rowNum}: Đơn giá không hợp lệ (phải lớn hơn 0).`);
            return;
          }

          // Body type & tonnage
          let truckBodyType: string | undefined = undefined;
          let truckTonnage: string | undefined = undefined;
          let vehicleType = String(row['Loại Phương Tiện (*)'] || row['Loại Phương Tiện'] || '').trim();

          if (isTrucking) {
            const rawBody = String(row['Loại Thùng Phương Tiện (*)'] || row['Loại Thùng'] || '').trim();
            const matchedBody = bodyTypes.find((b) => b.toLowerCase().includes(rawBody.toLowerCase()) || rawBody.toLowerCase().includes(b.split(' (')[0].toLowerCase()));
            truckBodyType = matchedBody || defaultBody;

            const validTonnages = getTonnagesForBodyType(truckBodyType, cargoType);
            const rawTonnage = String(row['Phân Khúc Tải Trọng (*)'] || row['Phân Khúc Tải Trọng'] || row['Tải Trọng'] || '').trim();
            const matchedTonnage = validTonnages.find((t) => t.toLowerCase().includes(rawTonnage.toLowerCase()) || rawTonnage.toLowerCase().includes(t.split(' (')[0].toLowerCase()));
            truckTonnage = matchedTonnage || validTonnages[0] || defaultTonnage;
            vehicleType = `${truckTonnage.split(' (')[0]} ${truckBodyType.split(' (')[0]}`.trim();
          } else if (!vehicleType) {
            vehicleType = activeModel?.vehicleLov?.[0] || 'Phương tiện chuẩn';
          }

          const pricingUnit = isLtlTrucking
            ? (String(row['Đơn Vị Tính (*)'] || row['Đơn Vị Tính'] || row['ĐVT'] || '').toLowerCase().includes('cbm') ? 'CBM' : 'Kg')
            : (isTrucking ? 'Chuyến' : String(row['Đơn Vị Tính (*)'] || row['Đơn Vị Tính'] || row['ĐVT'] || defaultUnit).trim());
          const sla = String(row['Lịch Chạy Hàng (*)'] || row['Lịch Chạy Hàng'] || row['Lịch Chạy'] || row['Lịch chạy'] || row['SLA Thời Gian'] || row['SLA'] || (isLtlTrucking ? 'Thứ 2, Thứ 4, Thứ 6' : '24 - 48 giờ')).trim();
          const pricingStyle: 'All-in' | 'Chưa gồm phụ phí' = 'All-in';
          
          let validUntil = String(row['Hạn Giá (YYYY-MM-DD)'] || row['Hạn Giá'] || row['Hạn giá'] || '2026-12-31').trim();
          if (!/^\d{4}-\d{2}-\d{2}$/.test(validUntil)) {
            validUntil = '2026-12-31';
          }

          const rawPromo = row['Promotion (%)'] || row['Promotion'] || row['Khuyến mãi (%)'] || 0;
          const promotionPercent = Math.min(50, Math.max(0, parseInt(String(rawPromo)) || 0));

          const rawCode = String(row['Mã Tuyến (Route Code)'] || row['Mã Tuyến'] || '').trim();
          const routeCode = rawCode || `RC-${modelPrefix}-${String(parsedRoutes.length + 1).padStart(3, '0')}`;

          let ltlPricing: LtlTieredPricingConfig | undefined = undefined;
          if (isLtlTrucking) {
            const minCharge = parseFloat(String(row['Cước Sàn Tối Thiểu (Min Charge)'] || row['Cước Tối Thiểu'] || row['Min Charge'] || (pricingUnit === 'CBM' ? 150000 : 100000))) || (pricingUnit === 'CBM' ? 150000 : 100000);
            const w1 = parseFloat(String(row['Bậc 1 (1 - 50 Kg) [₫/Kg]'] || row['Bậc 1 (1 - 50 Kg)'] || '')) || Math.round(price * 1.25) || 2500;
            const w2 = parseFloat(String(row['Bậc 2 (51 - 200 Kg) [₫/Kg]'] || row['Bậc 2 (51 - 200 Kg)'] || '')) || price || 2000;
            const w3 = parseFloat(String(row['Bậc 3 (201 - 500 Kg) [₫/Kg]'] || row['Bậc 3 (201 - 500 Kg)'] || '')) || Math.round(price * 0.825) || 1650;
            const w4 = parseFloat(String(row['Bậc 4 (501 - 1000 Kg) [₫/Kg]'] || row['Bậc 4 (501 - 1000 Kg)'] || '')) || Math.round(price * 0.675) || 1350;
            const w5 = parseFloat(String(row['Bậc 5 (> 1000 Kg) [₫/Kg]'] || row['Bậc 5 (> 1000 Kg)'] || '')) || Math.round(price * 0.55) || 1100;

            const v1 = parseFloat(String(row['Bậc V1 (< 1 CBM) [₫/CBM]'] || row['Bậc V1 (< 1 CBM)'] || '')) || 600000;
            const v2 = parseFloat(String(row['Bậc V2 (1 - 3 CBM) [₫/CBM]'] || row['Bậc V2 (1 - 3 CBM)'] || '')) || 500000;
            const v3 = parseFloat(String(row['Bậc V3 (3.1 - 6 CBM) [₫/CBM]'] || row['Bậc V3 (3.1 - 6 CBM)'] || '')) || 420000;
            const v4 = parseFloat(String(row['Bậc V4 (6.1 - 10 CBM) [₫/CBM]'] || row['Bậc V4 (6.1 - 10 CBM)'] || '')) || 380000;
            const v5 = parseFloat(String(row['Bậc V5 (> 10 CBM) [₫/CBM]'] || row['Bậc V5 (> 10 CBM)'] || '')) || 320000;

            ltlPricing = {
              minCharge,
              pricingBasis: pricingUnit === 'CBM' ? 'volume' : 'weight',
              weightTiers: [
                { id: 'w1', rangeLabel: '1 – 50 Kg', subLabel: 'Hàng lẻ kiện nhỏ', minKg: 1, maxKg: 50, price: w1 },
                { id: 'w2', rangeLabel: '51 – 200 Kg', subLabel: 'Hàng lẻ thông dụng', minKg: 51, maxKg: 200, price: w2 },
                { id: 'w3', rangeLabel: '201 – 500 Kg', subLabel: 'Hàng sỉ kiện trung', minKg: 201, maxKg: 500, price: w3 },
                { id: 'w4', rangeLabel: '501 – 1,000 Kg', subLabel: 'Hàng kiện lớn (0.5 – 1T)', minKg: 501, maxKg: 1000, price: w4 },
                { id: 'w5', rangeLabel: '> 1,000 Kg', subLabel: 'Ghép lô tải nặng (> 1T)', minKg: 1001, maxKg: 999999, price: w5 },
              ],
              volumeTiers: [
                { id: 'v1', rangeLabel: '< 1.0 CBM', subLabel: 'Kiện hàng nhẹ nhỏ', minCbm: 0.1, maxCbm: 1.0, price: v1 },
                { id: 'v2', rangeLabel: '1.0 – 3.0 CBM', subLabel: 'Ghép thể tích phổ biến', minCbm: 1.0, maxCbm: 3.0, price: v2 },
                { id: 'v3', rangeLabel: '3.1 – 6.0 CBM', subLabel: 'Kiện cồng kềnh trung', minCbm: 3.1, maxCbm: 6.0, price: v3 },
                { id: 'v4', rangeLabel: '6.1 – 10.0 CBM', subLabel: 'Lô hàng thể tích lớn', minCbm: 6.1, maxCbm: 10.0, price: v4 },
                { id: 'v5', rangeLabel: '> 10.0 CBM', subLabel: 'Lô siêu khối tích (> 10 m³)', minCbm: 10.1, maxCbm: 999999, price: v5 },
              ],
            };
          }

          parsedRoutes.push({
            id: `r-import-${Date.now()}-${rIdx}`,
            routeCode,
            route: routeName,
            origin,
            destination,
            truckBodyType,
            truckTonnage,
            vehicleType,
            pricingUnit,
            price,
            currency: 'VND',
            sla,
            pricingStyle,
            validUntil,
            promotionPercent,
            ltlPricing,
          });
          validCount++;
        });

        if (parsedRoutes.length === 0) {
          alert('Không tìm thấy dòng dữ liệu hợp lệ nào trong file Excel.');
          return;
        }

        setExcelImportPreview({
          fileName: file.name,
          routes: parsedRoutes,
          validCount,
          errorCount,
          warnings,
        });
      } catch (err) {
        console.error('Parse Excel Error:', err);
        alert('Đã xảy ra lỗi khi đọc file Excel. Vui lòng đảm bảo file theo đúng định dạng template chuẩn.');
      }
    };

    reader.readAsBinaryString(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmExcelImport = () => {
    if (!excelImportPreview) return;
    
    if (excelImportMode === 'replace') {
      updateCurrentFormData('routes', excelImportPreview.routes);
    } else {
      // Append mode - renumber route codes
      const existing = currentData.routes || [];
      const modelPrefix = (activeModel?.code || activeCategory?.id || 'RC').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const renumberedNew = excelImportPreview.routes.map((r, i) => ({
        ...r,
        routeCode: `RC-${modelPrefix}-${String(existing.length + i + 1).padStart(3, '0')}`,
      }));
      updateCurrentFormData('routes', [...existing, ...renumberedNew]);
    }

    setExcelImportPreview(null);
  };

  // ==========================================
  // SECTION 2: ROUTES TABLE OPERATIONS
  // ==========================================
  const handleAddRouteRow = () => {
    const isTrucking = activeCategory?.id === 'trucking';
    const isOcean = activeCategory?.id === 'ocean' || activeModel?.id?.startsWith('sea-');
    const isRail = activeCategory?.id === 'rail' || activeModel?.id?.startsWith('rail-');
    const isAir = activeCategory?.id === 'air' || activeModel?.id?.startsWith('air-');
    const isExpress = activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express');
    const isAirCargo = isAir && !isExpress;
    const isFcl = (isOcean && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL') || activeModel?.code === 'FCL')) || (isRail && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL')));
    const isLcl = (isOcean && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL')) || (isRail && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL')));
    const isLtlTrucking = isTrucking && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
    const isReeferTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref'));
    const isHazmatTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg'));
    const cargoType: 'general' | 'reefer' | 'hazmat' | 'ltl' = isLtlTrucking ? 'ltl' : (isHazmatTrucking ? 'hazmat' : (isReeferTrucking ? 'reefer' : 'general'));
    const bodyTypes = isLtlTrucking ? LTL_TRUCKING_BODY_TYPES : (isHazmatTrucking ? HAZMAT_TRUCKING_BODY_TYPES : (isReeferTrucking ? REEFER_TRUCKING_BODY_TYPES : TRUCKING_BODY_TYPES));
    const defaultBody = bodyTypes[0];
    const defaultTonnages = getTonnagesForBodyType(defaultBody, cargoType);
    const defaultTonnage = isLtlTrucking ? defaultTonnages[2] || defaultTonnages[0] : (isHazmatTrucking ? defaultTonnages[2] || defaultTonnages[0] : (isReeferTrucking ? defaultTonnages[0] : (defaultTonnages[defaultTonnages.length - 2] || defaultTonnages[0])));
    const defaultVehicle = isAirCargo ? 'Vietnam Airlines (VN Cargo)' : (isExpress ? 'DHL Express' : (isLtlTrucking ? 'Xe thùng kín 15T ghép tuyến' : (isLcl ? (isOcean ? 'LCL Hàng lẻ đóng ghép (Consolidation)' : 'Hàng lẻ toa ghép đường sắt') : (isHazmatTrucking ? 'Xe tải hóa chất 15T' : (isReeferTrucking ? 'Xe đông lạnh 5T' : (isTrucking ? 'Xe tải 15T thùng kín' : (activeModel?.vehicleLov?.[0] || (isFcl ? '40ft High Cube (40HC)' : 'Phương tiện chuẩn'))))))));
    const defaultUnit = (isAirCargo || isExpress) ? 'Kg' : (isFcl ? 'Cont' : (isLtlTrucking ? 'Kg' : (isLcl ? (isOcean ? 'CBM' : 'Kg') : (activeModel?.unitLov?.[0] || 'Chuyến'))));
    const modelPrefix = (activeModel?.code || activeCategory?.id || 'RC').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const nextIdx = (currentData.routes || []).length + 1;
    const generatedRouteCode = `RC-${modelPrefix}-${String(nextIdx).padStart(3, '0')}`;

    let defaultRoute = 'Hành Lang Tuyến Mới';
    let defaultOrigin = 'Điểm Lấy Hàng (Kho / Cảng)';
    let defaultDestination = 'Điểm Giao Hàng (Kho / Cảng)';
    let defaultPrice = 15000000;
    let defaultSla = '24 - 48 giờ';

    const isWarehousing = activeCategory?.id === 'warehousing';
    if (isWarehousing) {
      const isBonded = activeModel?.id === 'wh-gen-bon' || activeModel?.id?.includes('bon') || activeModel?.name?.toLowerCase().includes('ngoại quan') || activeModel?.code?.toLowerCase().includes('ngoại quan');
      const isCold = activeModel?.id?.includes('ref') || activeCargoGroup?.name?.includes('lạnh');
      const isHaz = activeModel?.id?.includes('haz') || activeCargoGroup?.name?.includes('nguy hiểm') || activeCargoGroup?.name?.includes('hóa chất');
      const nextIdx = (currentData.routes || []).length + 1;

      if (isBonded) {
        const codeSuffix = isCold ? '-RF' : (isHaz ? '-DG' : '');
        const whCode = `02B1B${String(nextIdx).padStart(2, '0')}${codeSuffix}`;
        const newBondedRoute: CapabilityRouteItem = {
          id: `r-wh-bon-${Date.now()}`,
          routeCode: whCode,
          warehouseCode: whCode,
          customsWarehouseCode: whCode,
          route: isCold ? `Kho Ngoại Quan Lạnh #${nextIdx}` : (isHaz ? `Kho Ngoại Quan Hóa Chất #${nextIdx}` : `Kho Ngoại Quan & CFS #${nextIdx}`),
          warehouseName: isCold ? `Kho Ngoại Quan Lạnh #${nextIdx}` : (isHaz ? `Kho Ngoại Quan Hóa Chất #${nextIdx}` : `Kho Ngoại Quan & CFS #${nextIdx}`),
          customsAuthority: CUSTOMS_AUTHORITIES_LOV[0],
          origin: isCold || isHaz ? 'Hải Phòng' : 'TP. Hồ Chí Minh',
          warehouseProvince: isCold || isHaz ? 'Hải Phòng' : 'TP. Hồ Chí Minh',
          destination: isCold || isHaz ? 'KCN Đình Vũ, P. Đông Hải 2, Q. Hải An' : 'Khu thương mại Cát Lái, P. Cát Lái, TP. Thủ Đức',
          warehouseAddress: isCold || isHaz ? 'KCN Đình Vũ, P. Đông Hải 2, Q. Hải An' : 'Khu thương mại Cát Lái, P. Cát Lái, TP. Thủ Đức',
          vehicleType: isCold ? 'Kho ngoại quan lạnh' : (isHaz ? 'Kho ngoại quan hóa chất' : 'Kho ngoại quan gần cảng biển'),
          pricingUnit: 'CBM / Ngày',
          price: isCold ? 0.55 : (isHaz ? 0.65 : 0.35),
          pricePerVolume: isCold ? 0.55 : (isHaz ? 0.65 : 0.35),
          pricePerPallet: isCold ? 0.75 : (isHaz ? 0.85 : 0.45),
          pricePerArea: isCold ? 9.5 : (isHaz ? 11.0 : 6.5),
          capacityArea: 5000,
          capacityVolume: 8000,
          capacityPallets: 4200,
          minChargeMonthly: 45,
          currency: 'USD',
          sla: 'Tiếp nhận cont 24/7 (HQ 8h-17h)',
          pricingStyle: 'All-in',
          validUntil: '2026-12-31',
          promotionPercent: 0,
        };

        updateCurrentFormData('routes', [...(currentData.routes || []), newBondedRoute]);
        return;
      }

      const whCode = `WH-DC-${String(nextIdx).padStart(3, '0')}`;
      const newWhRoute: CapabilityRouteItem = {
        id: `r-wh-${Date.now()}`,
        routeCode: whCode,
        warehouseCode: whCode,
        route: `Kho Phân Phối DC #${nextIdx}`,
        warehouseName: `Kho Phân Phối DC #${nextIdx}`,
        origin: 'Bình Dương',
        warehouseProvince: 'Bình Dương',
        destination: 'KCN Sóng Thần 1, Dĩ An',
        warehouseAddress: 'KCN Sóng Thần 1, Dĩ An',
        vehicleType: 'Kho tiêu chuẩn Grade A',
        pricingUnit: 'm² / Tháng',
        price: 95000,
        pricePerArea: 95000,
        pricePerPallet: 110000,
        pricePerVolume: 120000,
        capacityArea: 2500,
        capacityPallets: 1800,
        capacityVolume: 3000,
        minChargeMonthly: 3000000,
        currency: 'VND',
        sla: 'Xuất nhập 2 - 4h',
        pricingStyle: 'All-in',
        validUntil: '2026-12-31',
        promotionPercent: 5,
      };

      updateCurrentFormData('routes', [...(currentData.routes || []), newWhRoute]);
      return;
    }

    if (isAirCargo) {
      defaultRoute = 'SGN (Tân Sơn Nhất) ⇄ NRT (Tokyo Narita)';
      defaultOrigin = 'Sân bay Tân Sơn Nhất (SGN)';
      defaultDestination = 'Sân bay Narita Tokyo (NRT)';
      defaultPrice = 4.2;
      defaultSla = 'Hàng ngày (Cắt TCS 18:00)';
    } else if (isExpress) {
      defaultRoute = 'Việt Nam ⇄ Singapore';
      defaultOrigin = 'Hà Nội / TP.HCM';
      defaultDestination = 'Singapore';
      defaultPrice = 6.5;
      defaultSla = '24 - 48 giờ';
    } else if (isLtlTrucking) {
      defaultRoute = 'Hà Nội ⇄ TP.HCM';
      defaultOrigin = 'Hub Thanh Trì (Hà Nội)';
      defaultDestination = 'Hub Quận 12 (TP.HCM)';
      defaultPrice = 1650;
      defaultSla = 'Thứ 2, Thứ 4, Thứ 6 (Xuất bến 20:00)';
    } else if (isOcean) {
      defaultRoute = isFcl ? 'Cát Lái (VNCLI) ⇄ Hamburg (Đức)' : 'Cát Lái (VNCLI) ⇄ Singapore (SGSIN)';
      defaultOrigin = isFcl ? 'Cảng Cát Lái (TP.HCM)' : 'Kho CFS Cát Lái (TP.HCM)';
      defaultDestination = isFcl ? 'Cảng Hamburg (Germany)' : 'Cảng Singapore (SGSIN)';
      defaultPrice = isFcl ? 2450 : 25;
      defaultSla = isFcl ? '28 - 32 ngày' : 'Thứ 4, Thứ 7 (Cắt hàng CFS 17:00)';
    } else if (isHazmatTrucking) {
      defaultRoute = 'Bà Rịa - Vũng Tàu ⇄ Bình Dương';
      defaultOrigin = 'KCN Phú Mỹ (BR-VT)';
      defaultDestination = 'KCN VSIP 2 (Bình Dương)';
      defaultPrice = 14500000;
      defaultSla = '4 - 6 giờ';
    } else if (isReeferTrucking) {
      defaultRoute = 'Đà Lạt ⇄ TP.HCM';
      defaultOrigin = 'Đức Trọng (Lâm Đồng)';
      defaultDestination = 'Chợ đầu mối Thủ Đức (TP.HCM)';
      defaultPrice = 9500000;
      defaultSla = '7 - 9 giờ';
    } else if (isRail) {
      defaultRoute = isFcl ? 'Ga Sóng Thần ⇄ Ga Giáp Bát' : 'Sài Gòn ⇄ Hà Nội';
      defaultOrigin = 'Ga Sóng Thần (Bình Dương)';
      defaultDestination = 'Ga Giáp Bát (Hà Nội)';
      defaultPrice = isFcl ? 21000000 : 1100;
      defaultSla = isFcl ? '65 - 72 giờ' : 'Thứ 3, Thứ 6 (Cắt hàng bãi ga 18:00)';
    }

    const newRoute: CapabilityRouteItem = {
      id: `r-new-${Date.now()}`,
      routeCode: generatedRouteCode,
      region: isAir ? (isAirCargo ? 'Đông Bắc Á (Nhật - Hàn - Trung - Đài)' : 'Đông Nam Á (ASEAN)') : (isOcean ? 'Châu Á' : undefined),
      route: defaultRoute,
      origin: defaultOrigin,
      destination: defaultDestination,
      truckBodyType: isTrucking ? defaultBody : undefined,
      truckTonnage: isTrucking ? defaultTonnage : undefined,
      vehicleType: defaultVehicle,
      pricingUnit: defaultUnit,
      price: defaultPrice,
      currency: (isOcean || isAir) ? 'USD' : 'VND',
      sla: defaultSla,
      transitType: 'Direct',
      freeDemDetDays: isFcl ? 14 : undefined,
      validUntil: '2026-12-31',
      promotionPercent: 0,
      ltlPricing: isAirCargo
        ? createDefaultAirPricingConfig('USD', 4.2)
        : (isLtlTrucking 
          ? createDefaultLtlPricingConfig('weight', 2000, 500000) 
          : (isLcl ? createDefaultLclPricingConfig(isOcean ? 'volume' : 'weight', isOcean ? 'USD' : 'VND', isOcean ? 25 : 1100) : undefined)),
    };

    updateCurrentFormData('routes', [...(currentData.routes || []), newRoute]);
  };

  const handleUpdateRouteRowMultiple = (routeId: string, updates: Partial<CapabilityRouteItem>) => {
    setModelFormData((prev) => {
      const currentModelData = prev[activeModelId] || {
        fleet: activeModel?.defaultFleet || '',
        operationCapacity: activeModel?.defaultOperation || '',
        serviceCommitment: activeModel?.defaultCommitment || '',
        routes: activeModel ? JSON.parse(JSON.stringify(activeModel.defaultRoutes)) : [],
        freeSurchargeOptions: activeModel?.freeSurchargeOptions || [],
        freeSurcharges: activeModel?.defaultFreeSurcharges || [],
        paidSurchargeOptions: activeModel?.paidSurchargeOptions || [],
        vasOptions: activeModel?.vasOptions || [],
        selectedVas: activeModel?.defaultVas || [],
        vasItems: getDefaultVasItemsForModel(activeModelId, activeCategory?.id),
      };
      const updatedRoutes = (currentModelData.routes || []).map((r: CapabilityRouteItem) => {
        if (r.id === routeId) {
          return { ...r, ...updates };
        }
        return r;
      });
      return {
        ...prev,
        [activeModelId]: {
          ...currentModelData,
          routes: updatedRoutes,
        },
      };
    });
  };

  const handleUpdateRouteRow = (routeId: string, field: keyof CapabilityRouteItem, val: any) => {
    handleUpdateRouteRowMultiple(routeId, { [field]: val });
  };

  const handleDeleteRouteRow = (routeId: string) => {
    const updatedRoutes = (currentData.routes || []).filter((r) => r.id !== routeId);
    updateCurrentFormData('routes', updatedRoutes);
  };

  const handleDuplicateRouteRow = (routeId: string) => {
    const currentRoutes = currentData.routes || [];
    const targetIdx = currentRoutes.findIndex((r) => r.id === routeId);
    if (targetIdx === -1) return;

    const sourceRoute = currentRoutes[targetIdx];
    const modelPrefix = (activeModel?.code || activeCategory?.id || 'RC').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const nextIdx = currentRoutes.length + 1;
    const generatedRouteCode = `RC-${modelPrefix}-${String(nextIdx).padStart(3, '0')}`;

    const duplicatedRoute: CapabilityRouteItem = {
      ...JSON.parse(JSON.stringify(sourceRoute)),
      id: `r-dup-${Date.now()}`,
      routeCode: generatedRouteCode,
    };

    const updatedRoutes = [
      ...currentRoutes.slice(0, targetIdx + 1),
      duplicatedRoute,
      ...currentRoutes.slice(targetIdx + 1),
    ];

    updateCurrentFormData('routes', updatedRoutes);
  };

  // ==========================================
  // SECTION 3: SURCHARGES OPERATIONS & CUSTOM ADD
  // ==========================================
  const toggleFreeSurcharge = (item: string) => {
    const current = currentData.freeSurcharges || [];
    const updated = current.includes(item)
      ? current.filter((s) => s !== item)
      : [...current, item];
    updateCurrentFormData('freeSurcharges', updated);
  };

  const handleAddFreeSurcharge = () => {
    const name = newFreeSurchargeName.trim();
    if (!name) return;
    const currentOptions = currentData.freeSurchargeOptions || activeModel?.freeSurchargeOptions || [];
    if (!currentOptions.includes(name)) {
      updateCurrentFormData('freeSurchargeOptions', [...currentOptions, name]);
    }
    const currentChecked = currentData.freeSurcharges || [];
    if (!currentChecked.includes(name)) {
      updateCurrentFormData('freeSurcharges', [...currentChecked, name]);
    }
    setNewFreeSurchargeName('');
    setIsAddingFreeSurcharge(false);
  };

  const handleDeleteFreeSurchargeOption = (item: string) => {
    const currentOptions = currentData.freeSurchargeOptions || activeModel?.freeSurchargeOptions || [];
    updateCurrentFormData('freeSurchargeOptions', currentOptions.filter((o) => o !== item));
    const currentChecked = currentData.freeSurcharges || [];
    updateCurrentFormData('freeSurcharges', currentChecked.filter((o) => o !== item));
  };

  const togglePaidSurcharge = (id: string) => {
    const updated = (currentData.paidSurcharges || []).map((s) => {
      if (s.id === id) {
        return { ...s, isChecked: !s.isChecked };
      }
      return s;
    });
    updateCurrentFormData('paidSurcharges', updated);
  };

  const handleAddPaidSurcharge = () => {
    const name = newPaidSurchargeName.trim();
    if (!name) return;
    const newPaidItem: PaidSurchargeItem = {
      id: `p-custom-${Date.now()}`,
      name,
      priceText: newPaidSurchargePrice.trim() || 'Thỏa thuận',
      isChecked: true,
    };
    updateCurrentFormData('paidSurcharges', [...(currentData.paidSurcharges || []), newPaidItem]);
    setNewPaidSurchargeName('');
    setNewPaidSurchargePrice('');
    setIsAddingPaidSurcharge(false);
  };

  const handleDeletePaidSurcharge = (id: string) => {
    updateCurrentFormData(
      'paidSurcharges',
      (currentData.paidSurcharges || []).filter((s) => s.id !== id)
    );
  };

  const updatePaidSurchargePrice = (id: string, priceText: string) => {
    const updated = (currentData.paidSurcharges || []).map((s) => {
      if (s.id === id) {
        return { ...s, priceText };
      }
      return s;
    });
    updateCurrentFormData('paidSurcharges', updated);
  };

  // ==========================================
  // SECTION 4: VAS OPERATIONS & CUSTOM ADD (CATEGORIZED & WITH PRICE INPUT)
  // ==========================================
  const activeVasItems: CapabilityVasItem[] = currentData.vasItems || getDefaultVasItemsForModel(activeModelId, activeCategory?.id);

  const toggleVasItem = (id: string) => {
    const updated = activeVasItems.map((item) => {
      if (item.id === id) {
        return { ...item, isChecked: !item.isChecked };
      }
      return item;
    });
    updateCurrentFormData('vasItems', updated);
    updateCurrentFormData('selectedVas', updated.filter((v) => v.isChecked).map((v) => v.name));
  };

  const updateVasPrice = (id: string, priceText: string) => {
    const updated = activeVasItems.map((item) => {
      if (item.id === id) {
        return { ...item, priceText };
      }
      return item;
    });
    updateCurrentFormData('vasItems', updated);
  };

  const handleDeleteVas = (id: string) => {
    const updated = activeVasItems.filter((item) => item.id !== id);
    updateCurrentFormData('vasItems', updated);
    updateCurrentFormData('selectedVas', updated.filter((v) => v.isChecked).map((v) => v.name));
  };

  const handleAddVasOption = () => {
    const name = newVasName.trim();
    if (!name) return;
    const category = newVasCategory.trim() || 'Dịch Vụ Phụ Trợ & Tiện Ích';
    const newItem: CapabilityVasItem = {
      id: `vas-custom-${Date.now()}`,
      name,
      category,
      desc: newVasDesc.trim() || 'Dịch vụ phụ trợ tùy chỉnh theo yêu cầu của khách hàng.',
      tag: newVasTag.trim() || 'VAS Tùy chọn',
      priceText: newVasPrice.trim() || 'Thỏa thuận',
      isChecked: true,
      isPopular: false,
    };
    const updated = [...activeVasItems, newItem];
    updateCurrentFormData('vasItems', updated);
    updateCurrentFormData('selectedVas', updated.filter((v) => v.isChecked).map((v) => v.name));
    setNewVasName('');
    setNewVasCategory('');
    setNewVasDesc('');
    setNewVasPrice('');
    setNewVasTag('');
    setIsAddingVas(false);
  };

  // ==========================================
  // SAVE ALL HANDLER
  // ==========================================
  const handleSaveAll = () => {
    const declaredList: any[] = [];
    CAPABILITY_SERVICE_TREE.forEach((cat) => {
      cat.cargoGroups.forEach((cg) => {
        cg.models.forEach((m) => {
          if (selectedModelIds[m.id]) {
            const data = modelFormData[m.id];
            const primaryRoute = data?.routes?.[0];
            const modelVasItems = data?.vasItems || getDefaultVasItemsForModel(m.id, cat.id);
            const activeVasList = modelVasItems.filter((v) => v.isChecked).map((v) => `${v.name} (${v.priceText})`);

            declaredList.push({
              id: `srv-${m.id}`,
              serviceType: cat.serviceType,
              title: `${cat.name.split(' (')[0]} - ${cg.name} - ${m.code}`,
              description: `Năng lực: ${data?.fleet || m.defaultFleet}. Vận hành: ${data?.operationCapacity || m.defaultOperation}.`,
              highlight: data?.serviceCommitment || m.defaultCommitment,
              suitableFor: `${cg.name} (${cat.name})`,
              slaCommitment: primaryRoute?.sla || 'Cam kết SLA chuẩn',
              pricingSummary: primaryRoute 
                ? `${primaryRoute.price.toLocaleString('vi-VN')} ${primaryRoute.currency} / ${primaryRoute.pricingUnit}`
                : 'Liên hệ báo giá',
              modelCode: m.code,
              cargoGroup: cg.name,
              categoryName: cat.name,
              routes: data?.routes || [],
              freeSurcharges: data?.freeSurcharges || [],
              paidSurcharges: data?.paidSurcharges || [],
              vasList: activeVasList.length > 0 ? activeVasList : (data?.selectedVas || []),
            });
          }
        });
      });
    });

    onSave(declaredList);
    if (!isInline && onClose) {
      onClose();
    }
  };

  return (
    <div className={isInline ? "w-full relative" : "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"}>
      <div 
        className={isInline ? "bg-white w-full rounded-3xl shadow-xs border border-slate-200 overflow-hidden flex flex-col text-slate-800" : "bg-white w-full max-w-7xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] text-slate-800"}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            HEADER
        ========================================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              {isInline && <Truck className="w-5 h-5 text-indigo-600" />}
              <span>{isInline ? "Khai Báo Danh Mục Dịch Vụ & Năng Lực Cung Ứng" : "Khai Báo Danh Mục Dịch Vụ Supplier"}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Dữ Liệu</span>
            </button>

            {!isInline && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            SPLIT VIEW BODY (Left: Tree, Right: 4 Structured Sections)
        ========================================================================= */}
        <div className={`grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden ${isInline ? 'min-h-[620px] h-[820px]' : 'min-h-[550px]'}`}>
          
          {/* 🌿 LEFT: CÂY DANH MỤC DỊCH VỤ (MASTER TREE) - 3.5 cols */}
          <div className="md:col-span-4 lg:col-span-3 border-r border-slate-200 bg-slate-50/40 p-3.5 overflow-y-auto space-y-2 select-none">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Danh Mục Dịch Vụ
            </div>

            {CAPABILITY_SERVICE_TREE.map((cat) => {
              const isCatExpanded = Boolean(expandedCategories[cat.id]);
              const allCatModels = cat.cargoGroups.flatMap((cg) => cg.models);
              const catCheckedCount = allCatModels.filter((m) => selectedModelIds[m.id]).length;
              const isCatAllChecked = catCheckedCount === allCatModels.length && allCatModels.length > 0;
              const isCatIndeterminate = catCheckedCount > 0 && !isCatAllChecked;
              const IconComp = cat.icon;

              return (
                <div key={cat.id} className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                  {/* Category Header Row */}
                  <div 
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center justify-between p-2 hover:bg-slate-100/70 cursor-pointer transition-colors ${
                      catCheckedCount > 0 ? 'bg-indigo-50/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {isCatExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>

                      {/* Category Checkbox */}
                      <div 
                        onClick={(e) => toggleCategoryCheck(cat, e)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          isCatAllChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : isCatIndeterminate
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-bold'
                            : 'border-slate-300 bg-white hover:border-indigo-400'
                        }`}
                      >
                        {isCatAllChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        {isCatIndeterminate && <span className="text-[10px] leading-none mb-0.5">-</span>}
                      </div>

                      <IconComp className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 truncate">{getServiceTreeDisplayName(cat.name)}</span>
                    </div>

                    {catCheckedCount > 0 && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full shrink-0">
                        {catCheckedCount}/{allCatModels.length}
                      </span>
                    )}
                  </div>

                  {/* Level 2: Cargo Groups */}
                  {isCatExpanded && (
                    <div className="pl-5 pr-2 py-1 space-y-1 bg-slate-50/50 border-t border-slate-100">
                      {cat.cargoGroups.map((cg) => {
                        const isCgExpanded = Boolean(expandedCargoGroups[cg.id]);
                        const cgCheckedCount = cg.models.filter((m) => selectedModelIds[m.id]).length;
                        const isCgAllChecked = cgCheckedCount === cg.models.length && cg.models.length > 0;
                        const isCgIndeterminate = cgCheckedCount > 0 && !isCgAllChecked;

                        return (
                          <div key={cg.id} className="space-y-0.5">
                            {/* Cargo Group Header */}
                            <div 
                              onClick={() => toggleCargoGroup(cg.id)}
                              className="flex items-center justify-between py-1 px-1 rounded-lg hover:bg-slate-200/50 cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-400">
                                  {isCgExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </span>

                                {/* Cargo Group Checkbox */}
                                <div 
                                  onClick={(e) => toggleCargoGroupCheck(cg, e)}
                                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                    isCgAllChecked
                                      ? 'bg-indigo-600 border-indigo-600 text-white'
                                      : isCgIndeterminate
                                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                      : 'border-slate-300 bg-white hover:border-indigo-400'
                                  }`}
                                >
                                  {isCgAllChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  {isCgIndeterminate && <span className="text-[9px] leading-none mb-0.5">-</span>}
                                </div>

                                <span className="text-xs font-semibold text-slate-700">{getServiceTreeDisplayName(cg.name)}</span>
                              </div>
                            </div>

                            {/* Level 3: Models */}
                            {isCgExpanded && (
                              <div className="pl-5 space-y-0.5">
                                {cg.models.map((m) => {
                                  const isSelected = Boolean(selectedModelIds[m.id]);
                                  const isActive = activeModelId === m.id;

                                  return (
                                    <div
                                      key={m.id}
                                      onClick={() => setActiveModelId(m.id)}
                                      className={`flex items-center justify-between py-1 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                                        isActive
                                          ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                                          : isSelected
                                          ? 'bg-indigo-50 text-indigo-900 font-semibold hover:bg-indigo-100'
                                          : 'text-slate-600 hover:bg-slate-200/60'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <div 
                                          onClick={(e) => toggleModelCheck(m.id, e)}
                                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                            isSelected
                                              ? isActive
                                                ? 'bg-white text-indigo-600 border-white'
                                                : 'bg-indigo-600 border-indigo-600 text-white'
                                              : isActive
                                              ? 'border-white/60 bg-transparent'
                                              : 'border-slate-300 bg-white'
                                          }`}
                                        >
                                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>

                                        <span className="truncate">{getServiceTreeDisplayName(m.name)}</span>
                                      </div>

                                      {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1"></span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 📝 RIGHT: THÔNG TIN KHAI BÁO 4 PHẦN (DETAIL WORKSPACE) - 8.5 cols */}
          <div className="md:col-span-8 lg:col-span-9 p-5 sm:p-6 overflow-y-auto space-y-6 bg-white">
            {activeModel ? (
              <div className="space-y-6">
                
                {/* Header Sub-bar */}
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <span>THÔNG TIN KHAI BÁO ({activeCategory?.name.split(' (')[0]} - {activeCargoGroup?.name} - {activeModel.code || activeModel.name})</span>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModelCheck(activeModel.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      selectedModelIds[activeModel.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{selectedModelIds[activeModel.id] ? 'Đã kích hoạt dịch vụ' : 'Chưa kích hoạt'}</span>
                  </button>
                </div>

                {/* =========================================================================
                    PHẦN 1: THÔNG TIN NĂNG LỰC CHUNG
                ========================================================================= */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">1</span>
                    <span>Thông Tin Năng Lực Chung</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Quy mô phương tiện / Hạ tầng
                      </label>
                      <input
                        type="text"
                        value={currentData.fleet}
                        onChange={(e) => updateCurrentFormData('fleet', e.target.value)}
                        placeholder="VD: 35 xe tải các loại (1.5T - 15T, Đầu kéo)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Năng lực vận hành & Công nghệ
                      </label>
                      <input
                        type="text"
                        value={currentData.operationCapacity}
                        onChange={(e) => updateCurrentFormData('operationCapacity', e.target.value)}
                        placeholder="VD: 2 tài xế/xe, TMS GPS 24/7, đội phản ứng nhanh"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Cam kết dịch vụ & Bồi thường
                      </label>
                      <input
                        type="text"
                        value={currentData.serviceCommitment}
                        onChange={(e) => updateCurrentFormData('serviceCommitment', e.target.value)}
                        placeholder="VD: Giao hàng đúng hẹn 99.5%, bồi thường 100%"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    PHẦN 2: CÁC TUYẾN ĐƯỜNG - ĐƠN GIÁ - ĐƠN VỊ TÍNH - SLA (BẢNG THÊM/BỚT ĐƯỢC)
                ========================================================================= */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">2</span>
                        <span>{activeCategory?.id === 'warehousing' ? 'Danh Sách Cơ Sở Kho & Biểu Phí Lưu Kho' : ((activeCategory?.id === 'project' && (activeModel?.id?.includes('xdock') || activeModel?.name?.toLowerCase().includes('cross-dock') || activeModel?.name?.toLowerCase().includes('x-dock'))) ? 'Danh Sách Trạm Cross-Dock & Biểu Phí Xử Lý Sàn' : ((activeCategory?.id === 'project' && (activeModel?.id?.includes('port') || activeModel?.name?.toLowerCase().includes('cảng') || activeModel?.code?.toLowerCase().includes('port'))) ? 'Danh Sách Cảng / ICD / Depot & Biểu Phí Khai Thác' : (activeCategory?.id === 'customs' ? 'Danh Sách Chi Cục Hải Quan & Biểu Phí Khai Báo' : 'Các Tuyến Đường & Biểu Giá Tham Chiếu')))} ({currentData.routes?.length || 0})</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* LTL Volumetric Conversion Rate Badge */}
                      {(activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL') && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold shadow-2xs">
                          <Package className="w-3.5 h-3.5 text-emerald-600" />
                          <span>1 CBM = 250 Kg (Quy đổi)</span>
                        </div>
                      )}

                      {/* Ocean LCL Volumetric Conversion Rate Badge */}
                      {(activeCategory?.id === 'ocean' || activeModel?.id?.startsWith('sea-')) && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL') && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 border border-sky-300 rounded-xl text-sky-900 text-xs font-bold shadow-2xs">
                          <Ship className="w-3.5 h-3.5 text-sky-600" />
                          <span>🧊 1 CBM = 1.000 Kg (Quy đổi đường biển W/M)</span>
                        </div>
                      )}

                      {/* Air Cargo Volumetric Conversion Rate Badge */}
                      {(activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-cargo' || activeModel?.name?.includes('Cargo') || activeModel?.code === 'Air Cargo')) && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-300 rounded-xl text-sky-900 text-xs font-bold shadow-2xs">
                          <Plane className="w-3.5 h-3.5 text-sky-600" />
                          <span>✈ 1 CBM = 167 Kg (Chuẩn Air Cargo: D×R×C / 6.000)</span>
                        </div>
                      )}

                      {/* Air Express Volumetric Conversion Rate Badge */}
                      {(activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express')) && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold shadow-2xs">
                          <Zap className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>⚡ 1 CBM = 200 Kg (Chuẩn Express: D×R×C / 5.000)</span>
                        </div>
                      )}

                      {/* Hidden File Input for Excel Upload */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadExcelFile}
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                      />

                      {/* Add Single Route Button */}
                      <button
                        type="button"
                        onClick={handleAddRouteRow}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{activeCategory?.id === 'warehousing' ? 'Thêm Kho Mới' : (activeCategory?.id === 'customs' ? 'Thêm Chi Cục / Dịch Vụ' : 'Thêm Tuyến')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Excel-Style Data Grid Table */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          {(() => {
                            const isWarehousingTable = activeCategory?.id === 'warehousing';
                            const isCustomsTable = activeCategory?.id === 'customs' || activeCategory?.serviceType === 'Customs Clearance';
                            const isCrossBorderLtl = (activeCategory?.id === 'cross-border' || activeCategory?.serviceType === 'Cross-border') && (activeModel?.id?.includes('ltl') || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                            const isCrossBorderFtl = (activeCategory?.id === 'cross-border' || activeCategory?.serviceType === 'Cross-border') && !isCrossBorderLtl;
                            const isXdockTable = activeCategory?.id === 'project' && (activeModel?.id?.includes('xdock') || activeModel?.name?.toLowerCase().includes('cross-dock') || activeModel?.name?.toLowerCase().includes('x-dock'));
                            const isPortTable = activeCategory?.id === 'project' && (activeModel?.id?.includes('port') || activeModel?.name?.toLowerCase().includes('cảng') || activeModel?.code?.toLowerCase().includes('port'));
                            const isTruckingTable = activeCategory?.id === 'trucking';
                            const isOceanTable = activeCategory?.id === 'ocean' || activeModel?.id?.startsWith('sea-');
                            const isRailTable = activeCategory?.id === 'rail' || activeModel?.id?.startsWith('rail-');
                            const isAirTable = activeCategory?.id === 'air' || activeModel?.id?.startsWith('air-');
                            const isExpressTable = activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express');
                            const isAirCargoTable = isAirTable && !isExpressTable;
                            const isFclTable = (isOceanTable && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL') || activeModel?.code === 'FCL')) || (isRailTable && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL')));
                            const isOceanLclTable = isOceanTable && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL');
                            const isRailLclTable = isRailTable && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL');
                            const isLclTable = isOceanLclTable || isRailLclTable;
                            const isLtlTable = isTruckingTable && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                            const isLtlOrLclTable = isLtlTable || isLclTable;
                            const isReeferTruckingTable = isTruckingTable && (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref'));
                            const isHazmatTruckingTable = isTruckingTable && (activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg'));
                            const isTruckingFtlTable = isTruckingTable && !isLtlTable;
                            if (isLtlTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-indigo-50/70 text-indigo-950 font-black">Mã Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px] bg-indigo-50/70 text-indigo-950 font-black">Hành Lang Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Điểm Đầu (Điểm Đi)</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Điểm Cuối (Điểm Đến)</th>
                                  <th className="py-2.5 px-2.5 min-w-[190px]">Loại Thùng Phương Tiện</th>
                                  <th className="py-2.5 px-2.5 min-w-[210px]">Phân Khúc Tải Trọng</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px] text-center bg-indigo-100/80 text-indigo-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }
                            if (isTruckingFtlTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-indigo-50/70 text-indigo-950 font-black">Mã Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px] bg-indigo-50/70 text-indigo-950 font-black">Hành Lang Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Điểm Đi</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Điểm Đến</th>
                                  <th className="py-2.5 px-2.5 min-w-[190px] text-center bg-indigo-100/80 text-indigo-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            const isOceanFclTable = isOceanTable && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL') || activeModel?.code === 'FCL');
                            if (isOceanFclTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-sky-50/70 text-sky-950 font-black">Mã Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] bg-sky-50/70 text-sky-950 font-black">Khu Vực</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Cảng Đi (POL)</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Cảng Đến (POD)</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px]">Hãng Tàu</th>
                                  <th className="py-2.5 px-2.5 min-w-[190px] text-center bg-sky-100/80 text-sky-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isOceanLclTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-sky-50/70 text-sky-950 font-black">Mã Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] bg-sky-50/70 text-sky-950 font-black">Khu Vực</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px] bg-sky-50/70 text-sky-950 font-black">Hành Lang Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Kho CFS / Điểm Đi</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Kho CFS / Cảng Đến</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px]">Hãng Tàu / Co-Loader</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px] text-center bg-sky-100/80 text-sky-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isAirCargoTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-sky-50/70 text-sky-950 font-black">Mã Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] bg-sky-50/70 text-sky-950 font-black">Khu Vực</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px] bg-sky-50/70 text-sky-950 font-black">Hành Lang Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Sân Bay Đi (AOD)</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Sân Bay Đến (AOA)</th>
                                  <th className="py-2.5 px-2.5 min-w-[170px]">Hãng Bay (Airline)</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px] text-center bg-sky-100/80 text-sky-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isExpressTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-amber-50/80 text-amber-950 font-black">Mã Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] bg-amber-50/80 text-amber-950 font-black">Khu Vực</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px] bg-amber-50/80 text-amber-950 font-black">Hành Lang Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Lấy (Door Origin)</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Điểm Phát (Door Destination)</th>
                                  <th className="py-2.5 px-2.5 min-w-[170px]">Hãng Chuyển Phát (Carrier)</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px] text-center bg-amber-100/90 text-amber-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            const isRailAnyTable = isRailTable;
                            if (isRailAnyTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-emerald-50/70 text-emerald-950 font-black">Mã Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[170px] bg-emerald-50/70 text-emerald-950 font-black">Hành Lang Tuyến</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Ga Đi (POL)</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Ga Đến (POD)</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px]">Đơn Vị Vận Hành</th>
                                  <th className="py-2.5 px-2.5 min-w-[190px] text-center bg-emerald-100/80 text-emerald-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isWarehousingTable) {
                              const isBonded = activeModel?.id === 'wh-gen-bon' || activeModel?.id?.includes('bon') || activeModel?.name?.toLowerCase().includes('ngoại quan') || activeModel?.code?.toLowerCase().includes('ngoại quan');
                              const isFulfillment = activeModel?.id === 'wh-gen-ful' || activeModel?.id?.includes('ful') || activeModel?.name?.toLowerCase().includes('fulfillment') || activeModel?.name?.toLowerCase().includes('tmđt') || activeModel?.code?.toLowerCase().includes('fulfillment');
                              
                              if (isBonded) {
                                return (
                                  <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                    <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                                    <th className="py-2.5 px-3 min-w-[140px] text-center bg-indigo-50/80 text-indigo-950 font-black">Mã Kho HQ</th>
                                    <th className="py-2.5 px-3 min-w-[220px]">Tên Kho Ngoại Quan / CFS</th>
                                    <th className="py-2.5 px-3 min-w-[240px] bg-amber-50/80 text-amber-950 font-black">Chi Cục Hải Quan Quản Lý</th>
                                    <th className="py-2.5 px-3 min-w-[140px]">Tỉnh / TP</th>
                                    <th className="py-2.5 px-3 min-w-[260px]">Địa Chỉ</th>
                                    <th className="py-2.5 px-3 min-w-[200px] text-center bg-indigo-50/70 text-indigo-950 font-black">Chi Tiết</th>
                                    <th className="py-2.5 px-2 text-center w-20 min-w-[80px]">Action</th>
                                  </tr>
                                );
                              }

                              if (isFulfillment) {
                                return (
                                  <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                    <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                                    <th className="py-2.5 px-3 min-w-[140px] text-center bg-purple-50/80 text-purple-950 font-black">Mã kho</th>
                                    <th className="py-2.5 px-3 min-w-[240px]">Tên</th>
                                    <th className="py-2.5 px-3 min-w-[140px]">Tỉnh/TP</th>
                                    <th className="py-2.5 px-3 min-w-[260px]">Địa chỉ</th>
                                    <th className="py-2.5 px-3 min-w-[200px] text-center bg-purple-50/70 text-purple-950 font-black">Chi tiết</th>
                                    <th className="py-2.5 px-2 text-center w-20 min-w-[80px]">Thao tác</th>
                                  </tr>
                                );
                              }

                              const isSelfStorage = activeModel?.id === 'wh-gen-self' || activeModel?.id?.includes('self') || activeModel?.name?.toLowerCase().includes('tự quản') || activeModel?.code?.toLowerCase().includes('tự quản');
                              if (isSelfStorage) {
                                return (
                                  <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                    <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                                    <th className="py-2.5 px-3 min-w-[140px] text-center bg-amber-50/80 text-amber-950 font-black">Mã Kho</th>
                                    <th className="py-2.5 px-3 min-w-[220px]">Tên Cơ Sở</th>
                                    <th className="py-2.5 px-3 min-w-[140px]">Tỉnh/Thành Phố</th>
                                    <th className="py-2.5 px-3 min-w-[260px]">Địa Chỉ Chi Tiết</th>
                                    <th className="py-2.5 px-3 min-w-[200px] text-center bg-amber-50/70 text-amber-950 font-black">Chi Tiết</th>
                                    <th className="py-2.5 px-2 text-center w-20 min-w-[80px]">Action</th>
                                  </tr>
                                );
                              }

                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-12 min-w-[48px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-3 min-w-[130px] text-center bg-indigo-50/70 text-indigo-950 font-black">Mã Kho</th>
                                  <th className="py-2.5 px-3 min-w-[240px]">Tên Kho</th>
                                  <th className="py-2.5 px-3 min-w-[160px]">Tỉnh</th>
                                  <th className="py-2.5 px-3 min-w-[300px]">Địa Chỉ Chi Tiết</th>
                                  <th className="py-2.5 px-3 min-w-[160px] text-center bg-indigo-50/70 text-indigo-950 font-black">Chi Tiết</th>
                                  <th className="py-2.5 px-2 text-center w-20 min-w-[80px]">Action</th>
                                </tr>
                              );
                            }

                            if (isXdockTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[105px] text-center bg-purple-50/80 text-purple-950 font-black">Mã Trạm X-Dock</th>
                                  <th className="py-2.5 px-2.5 min-w-[195px]">Tên Trạm Cross-Dock / Hub</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px]">Tỉnh / Thành Phố</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">KCN / Vị Trí Trạm</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px] text-right bg-blue-50/70 text-blue-950 font-black">Công Suất Sàn</th>
                                  <th className="py-2.5 px-2 text-right min-w-[110px] bg-emerald-50/90 text-emerald-950 font-black">Đơn Giá Kg</th>
                                  <th className="py-2.5 px-2 text-right min-w-[115px] bg-emerald-50/90 text-emerald-950 font-black">Đơn Giá CBM</th>
                                  <th className="py-2.5 px-2 text-right min-w-[120px] bg-emerald-50/90 text-emerald-950 font-black">Đơn Giá Pallet</th>
                                  <th className="py-2.5 px-2 text-right min-w-[125px] bg-amber-50/80 text-amber-950 font-black">Cước Sàn (Min/Lô)</th>
                                  <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] text-center">SLA Giải Phóng</th>
                                  <th className="py-2.5 px-2.5 min-w-[125px] text-center">Hạn Giá</th>
                                  <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                                  <th className="py-2.5 px-2.5 text-center min-w-[140px] bg-indigo-50/80 text-indigo-950 font-black">Chi Tiết (Specs, Ảnh, VAS)</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isPortTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[105px] text-center bg-sky-50/80 text-sky-950 font-black">Mã Cảng / ICD</th>
                                  <th className="py-2.5 px-2.5 min-w-[200px]">Tên Cảng / Cảng Cạn ICD / Depot</th>
                                  <th className="py-2.5 px-2.5 min-w-[135px]">Tỉnh / Thành Phố</th>
                                  <th className="py-2.5 px-2.5 min-w-[160px]">Vị Trí / Khu Bến Cảng</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] text-right bg-blue-50/70 text-blue-950 font-black">Sức Chứa Bãi (TEU)</th>
                                  <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50/90 text-emerald-950 font-black">Shuttle Cont 20ft</th>
                                  <th className="py-2.5 px-2 text-right min-w-[135px] bg-emerald-50/90 text-emerald-950 font-black">Shuttle Cont 40ft</th>
                                  <th className="py-2.5 px-2 text-right min-w-[130px] bg-amber-50/80 text-amber-950 font-black">Nâng Hạ (Lift On/Off)</th>
                                  <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                                  <th className="py-2.5 px-2.5 min-w-[135px] text-center">SLA Luân Chuyển</th>
                                  <th className="py-2.5 px-2.5 min-w-[125px] text-center">Hạn Giá</th>
                                  <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                                  <th className="py-2.5 px-2.5 text-center min-w-[140px] bg-indigo-50/80 text-indigo-950 font-black">Chi Tiết (Specs, Ảnh, VAS)</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isCrossBorderLtl) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-orange-50/80 text-orange-950 font-black">Mã Tuyến LTL</th>
                                  <th className="py-2.5 px-2.5 min-w-[180px] bg-orange-50/80 text-orange-950 font-black">Hành Lang Tuyến XBG</th>
                                  <th className="py-2.5 px-2.5 min-w-[200px] bg-amber-50/80 text-amber-950 font-black">Cửa Khẩu Biên Giới (Border Gate)</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Kho Gom Hàng (Origin CFS/Hub)</th>
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Kho Giao Hàng (Destination CFS/Hub)</th>
                                  <th className="py-2.5 px-2.5 min-w-[170px] text-center bg-orange-100/80 text-orange-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isCrossBorderFtl) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-orange-50/80 text-orange-950 font-black">Mã Tuyến XBG</th>
                                  <th className="py-2.5 px-2.5 min-w-[180px] bg-orange-50/80 text-orange-950 font-black">Hành Lang Tuyến XBG</th>
                                  <th className="py-2.5 px-2.5 min-w-[200px] bg-amber-50/80 text-amber-950 font-black">Cửa Khẩu Biên Giới (Border Gate)</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Điểm Đi (Origin)</th>
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Điểm Đến (Destination)</th>
                                  <th className="py-2.5 px-2.5 min-w-[170px] text-center bg-orange-100/80 text-orange-950 font-black">Chi Tiết Biểu Phí</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            if (isCustomsTable) {
                              return (
                                <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                  <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                  <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-amber-50/80 text-amber-950 font-black">Mã Dịch Vụ</th>
                                  <th className="py-2.5 px-2.5 min-w-[230px] bg-amber-50/70 text-amber-950 font-black">Chi Cục Hải Quan Mở Tờ Khai</th>
                                  <th className="py-2.5 px-2.5 min-w-[175px]">Khu Vực / Cửa Khẩu / Cảng / KCN</th>
                                  <th className="py-2.5 px-2.5 min-w-[200px]">Loại Hình Tờ Khai Áp Dụng</th>
                                  <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">ĐVT</th>
                                  <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                                  <th className="py-2.5 px-2 text-right min-w-[160px] bg-emerald-50/90 text-emerald-950 font-black">Phí Khai Chuẩn (Xanh/Vàng)</th>
                                  <th className="py-2.5 px-2 text-right min-w-[145px] bg-emerald-50/70 text-emerald-950">Phí Tờ Khai Phụ (/Tờ)</th>
                                  <th className="py-2.5 px-2 text-right min-w-[160px] bg-rose-50/80 text-rose-950 font-bold">Phí Kiểm Hóa Luồng Đỏ (/Lô)</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] text-center">SLA Thông Quan</th>
                                  <th className="py-2.5 px-2.5 min-w-[155px] text-center">Hình Thức Khai Báo</th>
                                  <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                                  <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                                  <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                                </tr>
                              );
                            }

                            return (
                              <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-slate-100">Mã Tuyến</th>
                                {(isOceanTable || isAirTable) && (
                                  <th className="py-2.5 px-2.5 min-w-[140px]">Khu Vực</th>
                                )}
                                <th className="py-2.5 px-2.5 min-w-[135px]">Hành Lang Tuyến</th>
                                <th className="py-2.5 px-2.5 min-w-[130px]">{isRailLclTable ? 'Kho Bãi Ga / Ga Đi' : (isOceanLclTable ? 'Kho CFS / Điểm Đi' : (isAirCargoTable ? 'Sân Bay Đi' : (isExpressTable ? 'Điểm Lấy Hàng (Đi)' : 'Điểm Đi')))}</th>
                                <th className="py-2.5 px-2.5 min-w-[130px]">{isRailLclTable ? 'Kho Bãi Ga / Ga Đến' : (isOceanLclTable ? 'Kho CFS / Cảng Đến' : (isAirCargoTable ? 'Sân Bay Đến' : (isExpressTable ? 'Quốc Gia / Điểm Đến' : 'Điểm Đến')))}</th>
                                {isOceanTable && isFclTable && (
                                  <>
                                    <th className="py-2.5 px-2.5 min-w-[170px]">Hãng Tàu</th>
                                    <th className="py-2.5 px-2.5 min-w-[180px]">Loại Vỏ Container</th>
                                  </>
                                )}
                                {isOceanTable && isOceanLclTable && (
                                  <th className="py-2.5 px-2.5 min-w-[180px]">Hãng Tàu / Co-loader</th>
                                )}
                                {isRailTable && isFclTable && (
                                  <th className="py-2.5 px-2.5 min-w-[180px]">Loại Vỏ Container</th>
                                )}
                                {isRailTable && isRailLclTable && (
                                  <th className="py-2.5 px-2.5 min-w-[180px]">Đơn Vị Vận Hành</th>
                                )}
                                {isAirCargoTable && (
                                  <th className="py-2.5 px-2.5 min-w-[180px]">Hãng Bay (Airline)</th>
                                )}
                                {isExpressTable && (
                                  <th className="py-2.5 px-2.5 min-w-[180px]">Hãng Chuyển Phát</th>
                                )}
                                {isTruckingTable && (
                                  <>
                                    <th className="py-2.5 px-2.5 min-w-[200px]">Loại Thùng Phương Tiện</th>
                                    <th className="py-2.5 px-2.5 min-w-[210px]">Phân Khúc Tải Trọng</th>
                                  </>
                                )}
                                <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">ĐVT</th>
                                <th className="py-2.5 px-2 w-20 min-w-[80px] text-center">Tiền Tệ</th>
                                <th className="py-2.5 px-2.5 min-w-[160px] text-right">
                                  {isAirCargoTable ? 'Đơn Giá (+100kg Base)' : (isExpressTable ? 'Đơn Giá (+45kg Base)' : 'Đơn Giá')}
                                </th>
                                <th className={`py-2.5 px-2 text-center ${(isAirCargoTable || isExpressTable) ? 'min-w-[165px]' : (isLtlOrLclTable ? 'min-w-[160px]' : 'min-w-[90px]')}`}>
                                  {(isAirCargoTable || isExpressTable) ? 'Lịch Bay & Cut-off' : (isLtlOrLclTable ? 'Lịch Chạy & Cut-off' : 'SLA')}
                                </th>
                                {!isExpressTable && (
                                  <th className="py-2.5 px-2.5 min-w-[135px] text-center">Loại Tuyến</th>
                                )}
                                {isFclTable && (
                                  <th className="py-2.5 px-2.5 min-w-[145px] text-center">Free Dem/Det</th>
                                )}
                                <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                                <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                                <th className="py-2.5 px-2 text-center w-16 min-w-[65px]">Action</th>
                              </tr>
                            );
                          })()}
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                          {(!currentData.routes || currentData.routes.length === 0) ? (
                            <tr>
                              <td colSpan={(() => {
                                if (activeCategory?.id === 'warehousing') {
                                  if (activeModel?.id === 'wh-gen-bon' || activeModel?.id?.includes('bon') || activeModel?.name?.toLowerCase().includes('ngoại quan') || activeModel?.code?.toLowerCase().includes('ngoại quan')) return 8;
                                  if (activeModel?.id === 'wh-gen-self') return 17;
                                  return 18;
                                }
                                if (activeCategory?.id === 'customs') return 15;
                                if (activeCategory?.id === 'project') {
                                  if (activeModel?.id?.includes('xdock') || activeModel?.name?.toLowerCase().includes('cross-dock') || activeModel?.name?.toLowerCase().includes('x-dock')) return 16;
                                  return 15;
                                }
                                if (activeCategory?.id === 'trucking') {
                                  const isLtl = activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL';
                                  const isSpecialCargo = activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref') || activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg');
                                  if (!isLtl && !isSpecialCargo) return 7;
                                  return 15;
                                }
                                if (activeCategory?.id === 'ocean') {
                                  const isFcl = activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL') || activeModel?.code === 'FCL';
                                  const isLcl = activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL';
                                  if (isFcl) return 8;
                                  if (isLcl) return 9;
                                  return 15;
                                }
                                if (activeCategory?.id === 'air') {
                                  const isExp = activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express';
                                  return isExp ? 13 : 9;
                                }
                                if (activeCategory?.id === 'rail') {
                                  const isFcl = activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL') || activeModel?.code === 'FCL';
                                  return isFcl ? 8 : 15;
                                }
                                if (activeCategory?.id === 'cross-border' || activeCategory?.serviceType === 'Cross-border') {
                                  const isLtl = activeModel?.id?.includes('ltl') || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL';
                                  return isLtl ? 15 : 8;
                                }
                                return 15;
                              })()} className="py-8 text-center text-slate-400 font-medium">
                                {activeCategory?.id === 'warehousing' ? (
                                  <>Chưa có cơ sở kho nào. Bấm nút <strong className="text-indigo-600 font-bold">+ Thêm Kho Mới</strong> để khai báo năng lực & biểu phí lưu kho.</>
                                ) : activeCategory?.id === 'customs' ? (
                                  <>Chưa có dịch vụ hải quan nào. Bấm nút <strong className="text-indigo-600 font-bold">+ Thêm Chi Cục / Dịch Vụ</strong> để khai báo biểu phí thủ tục.</>
                                ) : (
                                  <>Chưa có tuyến đường nào. Bấm nút <strong className="text-indigo-600 font-bold">+ Thêm Tuyến Mới</strong> để khai báo bảng giá.</>
                                )}
                              </td>
                            </tr>
                          ) : (
                            currentData.routes.map((route, idx) => {
                              const hasPromo = (route.promotionPercent || 0) > 0;
                              const discountedPrice = hasPromo 
                                ? Math.round(route.price * (1 - route.promotionPercent / 100)) 
                                : route.price;
                              const isWarehousingRow = activeCategory?.id === 'warehousing';
                              const isCustomsRow = activeCategory?.id === 'customs' || activeCategory?.serviceType === 'Customs Clearance';
                              const isCrossBorderLtlRow = (activeCategory?.id === 'cross-border' || activeCategory?.serviceType === 'Cross-border') && (activeModel?.id?.includes('ltl') || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                              const isCrossBorderFtlRow = (activeCategory?.id === 'cross-border' || activeCategory?.serviceType === 'Cross-border') && !isCrossBorderLtlRow;
                              const isXdockRow = activeCategory?.id === 'project' && (activeModel?.id?.includes('xdock') || activeModel?.name?.toLowerCase().includes('cross-dock') || activeModel?.name?.toLowerCase().includes('x-dock'));
                              const isPortRow = activeCategory?.id === 'project' && (activeModel?.id?.includes('port') || activeModel?.name?.toLowerCase().includes('cảng') || activeModel?.code?.toLowerCase().includes('port'));

                              if (isXdockRow) {
                                const effXdockCode = route.xdockCode || route.routeCode || `XD-${String(idx + 1).padStart(2, '0')}`;
                                const effXdockName = route.xdockName || route.warehouseName || route.route || `Trạm Cross-Dock #${idx + 1}`;
                                const effProvince = route.xdockProvince || route.warehouseProvince || route.origin || 'Bình Dương';
                                const effAddress = route.xdockAddress || route.warehouseAddress || route.destination || 'KCN Sóng Thần 1, Dĩ An';
                                const effCap = route.floorProcessingCapacity || '150 Tấn / Ngày';
                                const effPriceKg = route.pricePerKg ?? (route.price || 180);
                                const effPriceCbm = route.pricePerCbm ?? 45000;
                                const effPricePallet = route.pricePerPallet ?? 35000;
                                const effMinCharge = route.minChargeXdock ?? (route.minChargeMonthly ?? 150000);
                                const effCurrency = route.currency || 'VND';
                                const effSla = route.sla || '< 4 giờ (Xuất bến ngay)';
                                const effValidUntil = route.validUntil || '2026-12-31';
                                const effPromotionPercent = route.promotionPercent || 0;

                                return (
                                  <tr key={route.id} className="hover:bg-purple-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                    {/* 1. STT */}
                                    <td className="p-1 text-center font-bold text-slate-500 w-9 bg-slate-50/50">
                                      {idx + 1}
                                    </td>

                                    {/* 2. Mã Trạm X-Dock */}
                                    <td className="p-1 text-center font-mono font-bold text-purple-700 bg-purple-50/20">
                                      <input
                                        type="text"
                                        value={effXdockCode}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { xdockCode: e.target.value, routeCode: e.target.value })}
                                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-1 py-1 font-bold text-purple-700 text-xs"
                                      />
                                    </td>

                                    {/* 3. Tên Trạm Cross-Dock */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effXdockName}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { xdockName: e.target.value, warehouseName: e.target.value, route: e.target.value })}
                                        placeholder="Trạm X-Dock Sóng Thần..."
                                        className="w-full px-2 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 4. Tỉnh / Thành Phố */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effProvince}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { xdockProvince: e.target.value, warehouseProvince: e.target.value, origin: e.target.value })}
                                        placeholder="Bình Dương, TP.HCM..."
                                        className="w-full px-2 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 5. KCN / Vị Trí Trạm */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effAddress}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { xdockAddress: e.target.value, warehouseAddress: e.target.value, destination: e.target.value })}
                                        placeholder="KCN, Phường/Xã..."
                                        className="w-full px-2 py-1.5 text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 6. Công Suất Sàn */}
                                    <td className="p-1 align-middle text-right bg-blue-50/20">
                                      <input
                                        type="text"
                                        value={effCap}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'floorProcessingCapacity', e.target.value)}
                                        placeholder="150 Tấn / Ngày"
                                        className="w-full px-2 py-1.5 text-right font-black text-blue-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 7. Đơn Giá Kg */}
                                    <td className="p-1 align-middle text-right bg-emerald-50/30">
                                      <input
                                        type="number"
                                        value={effPriceKg || ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value) || 0;
                                          handleUpdateRouteRowMultiple(route.id, { pricePerKg: val, price: val });
                                        }}
                                        placeholder="180"
                                        className="w-full px-2 py-1.5 text-right font-black text-emerald-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effPriceKg > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effPriceKg * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 8. Đơn Giá CBM */}
                                    <td className="p-1 align-middle text-right bg-emerald-50/20">
                                      <input
                                        type="number"
                                        value={effPriceCbm || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'pricePerCbm', parseFloat(e.target.value) || 0)}
                                        placeholder="45000"
                                        className="w-full px-2 py-1.5 text-right font-bold text-emerald-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effPriceCbm > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effPriceCbm * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 9. Đơn Giá Pallet */}
                                    <td className="p-1 align-middle text-right bg-emerald-50/20">
                                      <input
                                        type="number"
                                        value={effPricePallet || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'pricePerPallet', parseFloat(e.target.value) || 0)}
                                        placeholder="35000"
                                        className="w-full px-2 py-1.5 text-right font-bold text-emerald-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effPricePallet > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effPricePallet * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 10. Cước Sàn Min Charge */}
                                    <td className="p-1 align-middle text-right bg-amber-50/30">
                                      <input
                                        type="number"
                                        value={effMinCharge || ''}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { minChargeXdock: parseFloat(e.target.value) || 0, minChargeMonthly: parseFloat(e.target.value) || 0 })}
                                        placeholder="150000"
                                        className="w-full px-2 py-1.5 text-right font-bold text-amber-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effMinCharge > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effMinCharge * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 11. Tiền Tệ */}
                                    <td className="p-1 align-middle text-center">
                                      <span className="font-bold text-slate-800 text-xs">{effCurrency}</span>
                                    </td>

                                    {/* 12. SLA Giải Phóng Sàn */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="text"
                                        value={effSla}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'sla', e.target.value)}
                                        placeholder="< 4 giờ..."
                                        className="w-full px-2 py-1.5 text-center font-medium text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 13. Hạn Giá */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="date"
                                        value={effValidUntil}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'validUntil', e.target.value)}
                                        className="w-full px-1 py-1.5 text-center text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 14. Promotion */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={effPromotionPercent || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'promotionPercent', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                        placeholder="0%"
                                        className="w-full px-1 py-1.5 text-center font-bold text-rose-600 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 15. Chi Tiết (Specs, Ảnh, VAS) Button */}
                                    <td className="p-1 text-center align-middle bg-indigo-50/40">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenWarehouseDetailModal(route)}
                                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer"
                                        title="Khai báo thông số kỹ thuật sàn, thiết bị chia chọn, album ảnh, phụ phí & VAS cho trạm này"
                                      >
                                        <Sliders className="w-3.5 h-3.5" />
                                        <span>Chi Tiết</span>
                                      </button>
                                    </td>

                                    {/* 16. Action */}
                                    <td className="p-1 text-center align-middle w-16">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                          title="Nhân bản trạm X-Dock này"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                          title="Xóa trạm này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              if (isPortRow) {
                                const effPortCode = route.portIcdCode || route.routeCode || `ICD-${String(idx + 1).padStart(2, '0')}`;
                                const effPortName = route.portIcdName || route.warehouseName || route.route || `Cảng / Cảng Cạn ICD #${idx + 1}`;
                                const effProvince = route.portIcdProvince || route.warehouseProvince || route.origin || 'Bình Dương';
                                const effAddress = route.portIcdAddress || route.warehouseAddress || route.destination || 'TX. Dĩ An, Tỉnh Bình Dương';
                                const effYardTeu = route.yardCapacityTeu ?? 15000;
                                const effShuttle20 = route.priceShuttle20ft ?? (route.price || 1200000);
                                const effShuttle40 = route.priceShuttle40ft ?? 1800000;
                                const effLiftOnOff = route.priceLiftOnOff ?? 350000;
                                const effCurrency = route.currency || 'VND';
                                const effSla = route.sla || '< 6 giờ (Shuttle Cảng - ICD)';
                                const effValidUntil = route.validUntil || '2026-12-31';
                                const effPromotionPercent = route.promotionPercent || 0;

                                return (
                                  <tr key={route.id} className="hover:bg-sky-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                    {/* 1. STT */}
                                    <td className="p-1 text-center font-bold text-slate-500 w-9 bg-slate-50/50">
                                      {idx + 1}
                                    </td>

                                    {/* 2. Mã Cảng / ICD */}
                                    <td className="p-1 text-center font-mono font-bold text-sky-700 bg-sky-50/20">
                                      <input
                                        type="text"
                                        value={effPortCode}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { portIcdCode: e.target.value, routeCode: e.target.value })}
                                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded px-1 py-1 font-bold text-sky-700 text-xs"
                                      />
                                    </td>

                                    {/* 3. Tên Cảng / Cảng Cạn ICD */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effPortName}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { portIcdName: e.target.value, warehouseName: e.target.value, route: e.target.value })}
                                        placeholder="Cảng Cạn ICD Sóng Thần..."
                                        className="w-full px-2 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 4. Tỉnh / Thành Phố */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effProvince}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { portIcdProvince: e.target.value, warehouseProvince: e.target.value, origin: e.target.value })}
                                        placeholder="Bình Dương, Bà Rịa - Vũng Tàu..."
                                        className="w-full px-2 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 5. Vị Trí / Khu Bến Cảng */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effAddress}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { portIcdAddress: e.target.value, warehouseAddress: e.target.value, destination: e.target.value })}
                                        placeholder="TX. Dĩ An, TX. Phú Mỹ..."
                                        className="w-full px-2 py-1.5 text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 6. Sức Chứa Bãi (TEU) */}
                                    <td className="p-1 align-middle text-right bg-blue-50/20">
                                      <input
                                        type="number"
                                        value={effYardTeu || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'yardCapacityTeu', parseInt(e.target.value) || 0)}
                                        placeholder="15000"
                                        className="w-full px-2 py-1.5 text-right font-black text-blue-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 7. Shuttle Cont 20ft */}
                                    <td className="p-1 align-middle text-right bg-emerald-50/30">
                                      <input
                                        type="number"
                                        value={effShuttle20 || ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value) || 0;
                                          handleUpdateRouteRowMultiple(route.id, { priceShuttle20ft: val, price: val });
                                        }}
                                        placeholder="1200000"
                                        className="w-full px-2 py-1.5 text-right font-black text-emerald-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effShuttle20 > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effShuttle20 * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 8. Shuttle Cont 40ft */}
                                    <td className="p-1 align-middle text-right bg-emerald-50/20">
                                      <input
                                        type="number"
                                        value={effShuttle40 || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'priceShuttle40ft', parseFloat(e.target.value) || 0)}
                                        placeholder="1800000"
                                        className="w-full px-2 py-1.5 text-right font-bold text-emerald-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effShuttle40 > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effShuttle40 * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 9. Nâng Hạ (Lift On/Off) */}
                                    <td className="p-1 align-middle text-right bg-amber-50/30">
                                      <input
                                        type="number"
                                        value={effLiftOnOff || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'priceLiftOnOff', parseFloat(e.target.value) || 0)}
                                        placeholder="350000"
                                        className="w-full px-2 py-1.5 text-right font-bold text-amber-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effLiftOnOff > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effLiftOnOff * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 10. Tiền Tệ */}
                                    <td className="p-1 align-middle text-center">
                                      <span className="font-bold text-slate-800 text-xs">{effCurrency}</span>
                                    </td>

                                    {/* 11. SLA Luân Chuyển */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="text"
                                        value={effSla}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'sla', e.target.value)}
                                        placeholder="< 6 giờ..."
                                        className="w-full px-2 py-1.5 text-center font-medium text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 12. Hạn Giá */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="date"
                                        value={effValidUntil}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'validUntil', e.target.value)}
                                        className="w-full px-1 py-1.5 text-center text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 13. Promotion */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={effPromotionPercent || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'promotionPercent', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                        placeholder="0%"
                                        className="w-full px-1 py-1.5 text-center font-bold text-rose-600 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 14. Chi Tiết (Specs, Ảnh, VAS) Button */}
                                    <td className="p-1 text-center align-middle bg-indigo-50/40">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenWarehouseDetailModal(route)}
                                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer"
                                        title="Khai báo năng lực cầu bến, bãi container, cẩu nâng hạ, album ảnh, phụ phí & VAS cho Cảng/ICD này"
                                      >
                                        <Sliders className="w-3.5 h-3.5" />
                                        <span>Chi Tiết</span>
                                      </button>
                                    </td>

                                    {/* 15. Action */}
                                    <td className="p-1 text-center align-middle w-16">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                          title="Nhân bản Cảng/ICD này"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                          title="Xóa Cảng/ICD này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              if (isCrossBorderLtlRow) {
                                const effCode = route.routeCode || `CB-LTL-${String(idx + 1).padStart(2, '0')}`;
                                const effRoute = route.route || 'Hà Nội / Bắc Ninh ⇄ Bằng Tường / Quảng Châu (TQ)';
                                
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
                                const effGate = getInferredGate();
                                const effOrigin = route.origin || 'Kho Hub ICD Mỹ Đình (Hà Nội)';
                                const effDestination = route.destination || 'Kho Hub Bằng Tường / Quảng Châu (TQ)';

                                return (
                                  <tr key={route.id} className="hover:bg-orange-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                    {/* 1. STT */}
                                    <td className="p-1 text-center font-bold text-slate-500 w-9 bg-slate-50/50">
                                      {idx + 1}
                                    </td>

                                    {/* 2. Mã Tuyến LTL */}
                                    <td className="p-1 text-center font-mono font-bold text-orange-800 bg-orange-50/30">
                                      <input
                                        type="text"
                                        value={effCode}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-1 py-1 font-bold text-orange-800 text-xs"
                                      />
                                    </td>

                                    {/* 3. Hành Lang Tuyến Ghép XBG */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effRoute}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                        placeholder="Hà Nội / Bắc Ninh ⇄ Quảng Châu..."
                                        className="w-full px-2 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 4. Cửa Khẩu Biên Giới */}
                                    <td className="p-1 align-middle bg-amber-50/30">
                                      <select
                                        value={effGate}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'borderGate', e.target.value)}
                                        className="w-full px-2 py-1.5 font-bold text-amber-950 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs cursor-pointer"
                                        title={effGate}
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

                                    {/* 5. Kho Gom Hàng (Origin CFS/Hub) */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effOrigin}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                        placeholder="Kho Hub ICD Mỹ Đình (Hà Nội)..."
                                        className="w-full px-2 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 6. Kho Giao Hàng (Destination CFS/Hub) */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effDestination}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                        placeholder="Kho Bằng Tường / Quảng Châu (TQ)..."
                                        className="w-full px-2 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 7. Chi Tiết (Mở Ma Trận Biểu Phí XBG LTL) */}
                                    <td className="p-2 text-center align-middle bg-orange-50/20">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenCrossBorderLtlCostMatrixModal(route)}
                                        className="text-xs font-bold text-orange-600 hover:text-orange-800 hover:underline cursor-pointer transition-colors"
                                        title="Nhấp để mở hộp thoại khai báo chi tiết ma trận đơn giá ghép hàng lẻ XBG (Road LTL Matrix)"
                                      >
                                        Chi tiết
                                      </button>
                                    </td>

                                    {/* 8. Action */}
                                    <td className="p-1 text-center align-middle w-16">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                          title="Nhân bản tuyến ghép LTL này"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                          title="Xóa tuyến này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              if (isCrossBorderFtlRow) {
                                const effCode = route.routeCode || `CB-FTL-${String(idx + 1).padStart(2, '0')}`;
                                const effRoute = route.route || 'TP.HCM ⇄ Phnom Penh (Campuchia)';
                                
                                // Smart gate inference if not set
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
                                const effGate = getInferredGate();
                                const effOrigin = route.origin || 'KCN Tân Bình (TP.HCM) (Door)';
                                const effDestination = route.destination || 'Phnom Penh SEZ (Campuchia) (Door)';

                                return (
                                  <tr key={route.id} className="hover:bg-orange-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                    {/* 1. STT */}
                                    <td className="p-1 text-center font-bold text-slate-500 w-9 bg-slate-50/50">
                                      {idx + 1}
                                    </td>

                                    {/* 2. Mã Tuyến XBG */}
                                    <td className="p-1 text-center font-mono font-bold text-orange-800 bg-orange-50/30">
                                      <input
                                        type="text"
                                        value={effCode}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-1 py-1 font-bold text-orange-800 text-xs uppercase"
                                      />
                                    </td>

                                    {/* 3. Hành Lang Tuyến Xuyên Biên Giới */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effRoute}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                        placeholder="TP.HCM ⇄ Phnom Penh (Campuchia)..."
                                        className="w-full px-2 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 4. Cửa Khẩu Biên Giới */}
                                    <td className="p-1 align-middle bg-amber-50/30">
                                      <select
                                        value={effGate}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'borderGate', e.target.value)}
                                        className="w-full px-2 py-1.5 font-bold text-amber-950 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs cursor-pointer"
                                        title={effGate}
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

                                    {/* 5. Điểm Đi (Origin) */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effOrigin}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                        placeholder="KCN VSIP, Bình Dương (Door)..."
                                        className="w-full px-2 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 6. Điểm Đến (Destination) */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effDestination}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                        placeholder="Phnom Penh SEZ (Door)..."
                                        className="w-full px-2 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 7. Chi Tiết (Mở Ma Trận Biểu Phí XBG) */}
                                    <td className="p-2 text-center align-middle bg-orange-50/20">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenCrossBorderFtlCostMatrixModal(route)}
                                        className="text-xs font-bold text-orange-600 hover:text-orange-800 hover:underline cursor-pointer transition-colors"
                                        title="Nhấp để mở hộp thoại khai báo chi tiết biểu phí phương tiện XBG"
                                      >
                                        Chi tiết
                                      </button>
                                    </td>

                                    {/* 8. Action */}
                                    <td className="p-1 text-center align-middle w-16">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors cursor-pointer"
                                          title="Nhân bản tuyến xuyên biên giới này"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                          title="Xóa tuyến này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              if (isCustomsRow) {
                                const effCode = route.routeCode || `CUS-CL-${String(idx + 1).padStart(2, '0')}`;
                                const effBranch = route.customsBranchName || route.route || route.origin || CUSTOMS_BRANCHES_LOV[0];
                                const effArea = route.customsAreaName || route.destination || 'Cảng Cát Lái (TP.HCM)';
                                const effDeclType = route.customsDeclarationType || route.vehicleType || CUSTOMS_DECLARATION_TYPES_LOV[0];
                                const effUnit = route.pricingUnit || 'Tờ khai';
                                const effCurrency = route.currency || 'VND';
                                const effBasePrice = route.price ?? 850000;
                                const effExtraPrice = route.customsExtraItemPrice ?? 250000;
                                const effRedChannelPrice = route.customsRedChannelPrice ?? 600000;
                                const effSla = route.sla || 'Luồng Vàng 2-4h';
                                const effServiceForm = route.customsServiceForm || CUSTOMS_SERVICE_FORMS_LOV[0];
                                const effValidUntil = route.validUntil || '2026-12-31';
                                const effPromotionPercent = route.promotionPercent || 0;

                                return (
                                  <tr key={route.id} className="hover:bg-amber-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                    {/* 1. STT */}
                                    <td className="p-1 text-center font-bold text-slate-500 w-9 bg-slate-50/50">
                                      {idx + 1}
                                    </td>

                                    {/* 2. Mã Dịch Vụ */}
                                    <td className="p-1 text-center font-mono font-bold text-amber-800 bg-amber-50/30">
                                      <input
                                        type="text"
                                        value={effCode}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 py-1 font-bold text-amber-800 text-xs"
                                      />
                                    </td>

                                    {/* 3. Chi Cục Hải Quan Mở Tờ Khai */}
                                    <td className="p-1 align-middle">
                                      <div className="relative">
                                        <input
                                          type="text"
                                          list={`customs-branches-${route.id}`}
                                          value={effBranch}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { customsBranchName: e.target.value, route: e.target.value, origin: e.target.value })}
                                          placeholder="Chọn hoặc nhập Chi cục Hải quan..."
                                          className="w-full px-2 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                        />
                                        <datalist id={`customs-branches-${route.id}`}>
                                          {CUSTOMS_BRANCHES_LOV.map((branch) => (
                                            <option key={branch} value={branch} />
                                          ))}
                                        </datalist>
                                      </div>
                                    </td>

                                    {/* 4. Khu Vực / Cửa Khẩu / Cảng / KCN */}
                                    <td className="p-1 align-middle">
                                      <input
                                        type="text"
                                        value={effArea}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { customsAreaName: e.target.value, destination: e.target.value })}
                                        placeholder="Cát Lái, Tân Sơn Nhất, Cái Mép..."
                                        className="w-full px-2 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 5. Loại Hình Tờ Khai Áp Dụng */}
                                    <td className="p-1 align-middle">
                                      <select
                                        value={effDeclType}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { customsDeclarationType: e.target.value, vehicleType: e.target.value })}
                                        className="w-full px-2 py-1.5 font-medium text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs cursor-pointer"
                                      >
                                        {CUSTOMS_DECLARATION_TYPES_LOV.map((type) => (
                                          <option key={type} value={type}>{type}</option>
                                        ))}
                                      </select>
                                    </td>

                                    {/* 6. ĐVT */}
                                    <td className="p-1 align-middle text-center">
                                      <select
                                        value={effUnit}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'pricingUnit', e.target.value)}
                                        className="w-full px-1 py-1.5 text-center font-bold text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs cursor-pointer"
                                      >
                                        <option value="Tờ khai">Tờ khai</option>
                                        <option value="Lô hàng">Lô hàng</option>
                                        <option value="Bộ chứng từ">Bộ chứng từ</option>
                                        <option value="Cont">Cont</option>
                                      </select>
                                    </td>

                                    {/* 7. Tiền Tệ */}
                                    <td className="p-1 align-middle text-center">
                                      <select
                                        value={effCurrency}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'currency', e.target.value as 'VND' | 'USD')}
                                        className="w-full px-1 py-1.5 text-center font-bold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs cursor-pointer"
                                      >
                                        <option value="VND">VND</option>
                                        <option value="USD">USD</option>
                                      </select>
                                    </td>

                                    {/* 8. Phí Khai Chuẩn (Xanh/Vàng) */}
                                    <td className="p-1 align-middle text-right bg-emerald-50/30">
                                      <input
                                        type="number"
                                        value={effBasePrice || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'price', parseFloat(e.target.value) || 0)}
                                        placeholder="850000"
                                        className="w-full px-2 py-1.5 text-right font-black text-emerald-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effBasePrice > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effBasePrice * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 9. Phí Tờ Khai Phụ (/Tờ) */}
                                    <td className="p-1 align-middle text-right bg-emerald-50/20">
                                      <input
                                        type="number"
                                        value={effExtraPrice || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'customsExtraItemPrice', parseFloat(e.target.value) || 0)}
                                        placeholder="250000"
                                        className="w-full px-2 py-1.5 text-right font-bold text-emerald-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effExtraPrice > 0 && (
    <div className="text-[9.5px] text-emerald-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effExtraPrice * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 10. Phí Kiểm Hóa Luồng Đỏ (/Lô) */}
                                    <td className="p-1 align-middle text-right bg-rose-50/30">
                                      <input
                                        type="number"
                                        value={effRedChannelPrice || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'customsRedChannelPrice', parseFloat(e.target.value) || 0)}
                                        placeholder="600000"
                                        className="w-full px-2 py-1.5 text-right font-bold text-rose-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                      />
                                    
                                      {effPromotionPercent > 0 && effRedChannelPrice > 0 && (
    <div className="text-[9.5px] text-rose-600 font-bold text-right px-1 mt-0.5">
      Giảm còn: {Math.round(effRedChannelPrice * (1 - effPromotionPercent / 100)).toLocaleString('vi-VN')} {effCurrency}
    </div>
  )}
                                    </td>

                                    {/* 11. SLA Thông Quan */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="text"
                                        value={effSla}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'sla', e.target.value)}
                                        placeholder="4 - 8 giờ..."
                                        className="w-full px-2 py-1.5 text-center font-medium text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 12. Hình Thức Khai Báo */}
                                    <td className="p-1 align-middle text-center">
                                      <select
                                        value={effServiceForm}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'customsServiceForm', e.target.value)}
                                        className="w-full px-1.5 py-1.5 text-center font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs cursor-pointer"
                                      >
                                        {CUSTOMS_SERVICE_FORMS_LOV.map((form) => (
                                          <option key={form} value={form}>{form}</option>
                                        ))}
                                      </select>
                                    </td>

                                    {/* 13. Hạn Giá */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="date"
                                        value={effValidUntil}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'validUntil', e.target.value)}
                                        className="w-full px-1 py-1.5 text-center text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 14. Promotion */}
                                    <td className="p-1 align-middle text-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={effPromotionPercent || ''}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'promotionPercent', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                        placeholder="0%"
                                        className="w-full px-1 py-1.5 text-center font-bold text-rose-600 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 15. Action */}
                                    <td className="p-1 text-center align-middle w-16">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                          title="Nhân bản dịch vụ hải quan này"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRouteRow(route.id)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                          title="Xóa dịch vụ hải quan này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }
                              if (isWarehousingRow) {
                                const isBondedRow = activeModel?.id === 'wh-gen-bon' || activeModel?.id?.includes('bon') || activeModel?.name?.toLowerCase().includes('ngoại quan') || activeModel?.code?.toLowerCase().includes('ngoại quan');

                                if (isBondedRow) {
                                  const effWhCode = route.customsWarehouseCode || route.warehouseCode || route.routeCode || `02B1B${String(idx + 1).padStart(2, '0')}`;
                                  const effWhName = route.warehouseName || route.route || `Kho Ngoại Quan & CFS #${idx + 1}`;
                                  const effCustomsAuth = route.customsAuthority || CUSTOMS_AUTHORITIES_LOV[0];
                                  const effProvince = route.warehouseProvince || route.origin || 'TP. Hồ Chí Minh';
                                  const effAddress = route.warehouseAddress || route.destination || 'Khu thương mại Cát Lái, P. Cát Lái, TP. Thủ Đức';
                                  const photoCount = route.warehousePhotos?.length || 0;
                                  const surchargeCount = ((route as any).paidSurcharges?.length || (route as any).warehousePaidSurcharges?.length || currentData.paidSurcharges?.length || 0) + ((route as any).vasServices?.length || (route as any).warehouseVasItems?.length || 0);

                                  return (
                                    <tr key={route.id} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                      {/* 1. STT */}
                                      <td className="p-2 text-center font-bold text-slate-500 w-12 min-w-[48px] bg-slate-50/50">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã kho HQ */}
                                      <td className="p-2 align-middle bg-indigo-50/20">
                                        <div className="relative">
                                          <input
                                            type="text"
                                            value={effWhCode}
                                            onChange={(e) => handleUpdateRouteRowMultiple(route.id, { 
                                              customsWarehouseCode: e.target.value, 
                                              warehouseCode: e.target.value, 
                                              routeCode: e.target.value 
                                            })}
                                            placeholder="VD: 02B1B01"
                                            className="w-full text-center font-mono font-black text-indigo-700 bg-white border border-indigo-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs tracking-wider"
                                          />
                                        </div>
                                      </td>

                                      {/* 3. Tên kho Ngoại quan/CFS */}
                                      <td className="p-2 align-middle">
                                        <div className="relative flex items-center">
                                          <Warehouse className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                          <input
                                            type="text"
                                            value={effWhName}
                                            onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseName: e.target.value, route: e.target.value })}
                                            placeholder="Tên kho ngoại quan / CFS..."
                                            className="w-full pl-8 pr-2.5 py-1.5 font-bold text-slate-900 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs"
                                          />
                                        </div>
                                      </td>

                                      {/* 4. Chi cục hải quan quản lý */}
                                      <td className="p-2 align-middle bg-amber-50/20">
                                        <div className="space-y-1">
                                          <select
                                            value={CUSTOMS_AUTHORITIES_LOV.includes(effCustomsAuth) ? effCustomsAuth : 'Khác (Nhập chi cục khác)...'}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              if (val === 'Khác (Nhập chi cục khác)...') {
                                                handleUpdateRouteRow(route.id, 'customsAuthority', 'Chi cục HQ khác...');
                                              } else {
                                                handleUpdateRouteRow(route.id, 'customsAuthority', val);
                                              }
                                            }}
                                            className="w-full px-2.5 py-1.5 bg-white border border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg font-semibold text-amber-950 text-xs cursor-pointer truncate shadow-2xs"
                                          >
                                            {CUSTOMS_AUTHORITIES_LOV.map((auth, aIdx) => (
                                              <option key={aIdx} value={auth}>{auth}</option>
                                            ))}
                                            <option value="Khác (Nhập chi cục khác)...">-- Chi cục khác (Tự nhập) --</option>
                                          </select>
                                          {(!CUSTOMS_AUTHORITIES_LOV.includes(effCustomsAuth) || effCustomsAuth === 'Chi cục HQ khác...') && (
                                            <input
                                              type="text"
                                              value={effCustomsAuth === 'Chi cục HQ khác...' ? '' : effCustomsAuth}
                                              onChange={(e) => handleUpdateRouteRow(route.id, 'customsAuthority', e.target.value)}
                                              placeholder="Nhập tên chi cục hải quan..."
                                              className="w-full px-2 py-1 bg-white border border-amber-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 rounded text-[11px] font-semibold text-amber-900"
                                            />
                                          )}
                                        </div>
                                      </td>

                                      {/* 5. Tỉnh/TP */}
                                      <td className="p-2 align-middle">
                                        <div className="relative flex items-center">
                                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                          <input
                                            type="text"
                                            list={`bonded-province-list-${route.id}`}
                                            value={effProvince}
                                            onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseProvince: e.target.value, origin: e.target.value })}
                                            placeholder="TP.HCM, Hải Phòng..."
                                            className="w-full pl-8 pr-2.5 py-1.5 font-semibold text-slate-800 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs"
                                          />
                                          <datalist id={`bonded-province-list-${route.id}`}>
                                            {VIETNAM_PROVINCES_LOV.map((p, pIdx) => (
                                              <option key={pIdx} value={p} />
                                            ))}
                                          </datalist>
                                        </div>
                                      </td>

                                      {/* 6. Địa chỉ */}
                                      <td className="p-2 align-middle">
                                        <input
                                          type="text"
                                          value={effAddress}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseAddress: e.target.value, destination: e.target.value })}
                                          placeholder="Khu thương mại Cát Lái, KCN Đình Vũ, KCN Sóng Thần..."
                                          className="w-full px-2.5 py-1.5 text-slate-700 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs"
                                        />
                                      </td>

                                      {/* 7. Chi tiết */}
                                      <td className="p-2 text-center align-middle bg-indigo-50/10">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenWarehouseDetailModal(route)}
                                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs shadow-xs hover:shadow-md hover:shadow-indigo-600/20 transition-all cursor-pointer group"
                                          title="Mở Modal cấu hình chuyên sâu: Thông số pháp lý HQ, Album ảnh, Biểu giá CBM/Pallet/m², Phụ phí, VAS"
                                        >
                                          <Sliders className="w-3.5 h-3.5 text-indigo-200 group-hover:text-white transition-colors shrink-0" />
                                          <span>Chi Tiết</span>
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/20 rounded-md text-[10px] font-semibold text-white">
                                            {photoCount > 0 && <span>{photoCount}📸 • </span>}
                                            <span>{surchargeCount > 0 ? `${surchargeCount} phụ phí & VAS` : 'Cấu hình giá & VAS'}</span>
                                          </span>
                                        </button>
                                      </td>

                                      {/* 8. Action */}
                                      <td className="p-2 text-center align-middle w-20 min-w-[80px]">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs"
                                            title="Nhân bản cơ sở kho ngoại quan này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
                                            title="Xóa cơ sở kho ngoại quan này"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                                const isFulfillmentRow = activeModel?.id === 'wh-gen-ful' || activeModel?.id?.includes('ful') || activeModel?.name?.toLowerCase().includes('fulfillment') || activeModel?.name?.toLowerCase().includes('tmđt') || activeModel?.code?.toLowerCase().includes('fulfillment');
                                if (isFulfillmentRow) {
                                  const effWhCode = route.warehouseCode || route.routeCode || `FUL-HCM-${String(idx + 1).padStart(2, '0')}`;
                                  const effWhName = route.warehouseName || route.route || `Trung Tâm Fulfillment #${idx + 1}`;
                                  const effProvince = route.warehouseProvince || route.origin || 'TP. Hồ Chí Minh';
                                  const effAddress = route.warehouseAddress || route.destination || 'KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú';
                                  const photoCount = route.warehousePhotos?.length || 0;
                                  const surchargeCount = ((route as any).paidSurcharges?.length || (route as any).warehousePaidSurcharges?.length || currentData.paidSurcharges?.length || 0) + ((route as any).vasServices?.length || (route as any).warehouseVasItems?.length || 0);

                                  return (
                                    <tr key={route.id} className="hover:bg-purple-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                      {/* 1. STT */}
                                      <td className="p-2 text-center font-bold text-slate-500 w-12 bg-slate-50/50 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã kho */}
                                      <td className="p-2 text-center font-mono font-bold text-purple-800 bg-purple-50/30 align-middle">
                                        <input
                                          type="text"
                                          value={effWhCode}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseCode: e.target.value, routeCode: e.target.value })}
                                          className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 font-bold text-purple-800 text-xs"
                                          placeholder="FUL-HCM-01"
                                        />
                                      </td>

                                      {/* 3. Tên */}
                                      <td className="p-2 align-middle">
                                        <input
                                          type="text"
                                          value={effWhName}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseName: e.target.value, route: e.target.value })}
                                          placeholder="Tên trung tâm fulfillment / kho TMĐT..."
                                          className="w-full px-2.5 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-lg text-xs"
                                        />
                                      </td>

                                      {/* 4. Tỉnh/TP */}
                                      <td className="p-2 align-middle">
                                        <div className="relative flex items-center">
                                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                          <input
                                            type="text"
                                            list={`ful-province-list-${route.id}`}
                                            value={effProvince}
                                            onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseProvince: e.target.value, origin: e.target.value })}
                                            placeholder="TP.HCM, Bình Dương, Hà Nội..."
                                            className="w-full pl-8 pr-2.5 py-1.5 font-semibold text-slate-800 bg-white border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg text-xs"
                                          />
                                          <datalist id={`ful-province-list-${route.id}`}>
                                            {VIETNAM_PROVINCES_LOV.map((p, pIdx) => (
                                              <option key={pIdx} value={p} />
                                            ))}
                                          </datalist>
                                        </div>
                                      </td>

                                      {/* 5. Địa chỉ */}
                                      <td className="p-2 align-middle">
                                        <input
                                          type="text"
                                          value={effAddress}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseAddress: e.target.value, destination: e.target.value })}
                                          placeholder="KCN, số nhà, tên đường chi tiết..."
                                          className="w-full px-2.5 py-1.5 text-slate-700 bg-white border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg text-xs"
                                        />
                                      </td>

                                      {/* 6. Chi tiết */}
                                      <td className="p-2 text-center align-middle bg-purple-50/10">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenWarehouseDetailModal(route)}
                                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs hover:shadow-md hover:shadow-purple-600/20 transition-all cursor-pointer group"
                                          title="Mở Modal cấu hình chuyên sâu: Công suất xử lý đơn/ngày, Tích hợp sàn TMĐT (Shopee/TikTok/Lazada), Album ảnh, Biểu giá Pick-Pack, Phụ phí & VAS"
                                        >
                                          <Sliders className="w-3.5 h-3.5 text-purple-200 group-hover:text-white transition-colors shrink-0" />
                                          <span>Chi Tiết</span>
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/20 rounded-md text-[10px] font-semibold text-white">
                                            {photoCount > 0 && <span>{photoCount}📸 • </span>}
                                            <span>{surchargeCount > 0 ? `${surchargeCount} phụ phí & VAS` : 'Cấu hình giá & VAS'}</span>
                                          </span>
                                        </button>
                                      </td>

                                      {/* 7. Thao tác */}
                                      <td className="p-2 text-center align-middle w-20 min-w-[80px]">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-slate-200 hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
                                            title="Nhân bản kho TMĐT này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
                                            title="Xóa kho TMĐT này"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                                const isSelfStorageRow = activeModel?.id === 'wh-gen-self' || activeModel?.id?.includes('self') || activeModel?.name?.toLowerCase().includes('tự quản') || activeModel?.code?.toLowerCase().includes('tự quản');
                                if (isSelfStorageRow) {
                                  const effWhCode = route.warehouseCode || route.routeCode || `SELF-HCM-${String(idx + 1).padStart(2, '0')}`;
                                  const effWhName = route.warehouseName || route.route || `Kho Tự Quản Tân Bình #${idx + 1}`;
                                  const effProvince = route.warehouseProvince || route.origin || 'TP. Hồ Chí Minh';
                                  const effAddress = route.warehouseAddress || route.destination || 'KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú';
                                  const photoCount = route.warehousePhotos?.length || 0;
                                  const surchargeCount = (route.warehousePaidSurcharges?.length || 0) + (route.warehouseVasItems?.length || 0);

                                  return (
                                    <tr key={route.id} className="hover:bg-amber-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                      {/* 1. STT */}
                                      <td className="p-2 text-center font-bold text-slate-500 w-12 bg-slate-50/50 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã kho */}
                                      <td className="p-2 text-center font-mono font-bold text-amber-800 bg-amber-50/30 align-middle">
                                        <input
                                          type="text"
                                          value={effWhCode}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseCode: e.target.value, routeCode: e.target.value })}
                                          className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-2 py-1 font-bold text-amber-800 text-xs"
                                          placeholder="SELF-01"
                                        />
                                      </td>

                                      {/* 3. Tên cơ sở */}
                                      <td className="p-2 align-middle">
                                        <input
                                          type="text"
                                          value={effWhName}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseName: e.target.value, route: e.target.value })}
                                          placeholder="Tên cơ sở kho tự quản..."
                                          className="w-full px-2.5 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-lg text-xs"
                                        />
                                      </td>

                                      {/* 4. Tỉnh/thành phố */}
                                      <td className="p-2 align-middle">
                                        <div className="relative flex items-center">
                                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                          <input
                                            type="text"
                                            list={`self-province-list-${route.id}`}
                                            value={effProvince}
                                            onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseProvince: e.target.value, origin: e.target.value })}
                                            placeholder="TP.HCM, Bình Dương..."
                                            className="w-full pl-8 pr-2.5 py-1.5 font-semibold text-slate-800 bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg text-xs"
                                          />
                                          <datalist id={`self-province-list-${route.id}`}>
                                            {VIETNAM_PROVINCES_LOV.map((p, pIdx) => (
                                              <option key={pIdx} value={p} />
                                            ))}
                                          </datalist>
                                        </div>
                                      </td>

                                      {/* 5. Địa chỉ chi tiết */}
                                      <td className="p-2 align-middle">
                                        <input
                                          type="text"
                                          value={effAddress}
                                          onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseAddress: e.target.value, destination: e.target.value })}
                                          placeholder="KCN, số nhà, tên đường chi tiết..."
                                          className="w-full px-2.5 py-1.5 text-slate-700 bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg text-xs"
                                        />
                                      </td>

                                      {/* 6. Chi Tiết */}
                                      <td className="p-2 text-center align-middle bg-amber-50/10">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenWarehouseDetailModal(route)}
                                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold text-xs shadow-xs hover:shadow-md hover:shadow-amber-600/20 transition-all cursor-pointer group"
                                          title="Mở Modal cấu hình chuyên sâu: Thông số kỹ thuật khoang, Album ảnh, Biểu giá theo m²/Pallet/m³, Phụ phí, Tiện ích & VAS"
                                        >
                                          <Sliders className="w-3.5 h-3.5 text-amber-200 group-hover:text-white transition-colors shrink-0" />
                                          <span>Chi Tiết</span>
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/20 rounded-md text-[10px] font-semibold text-white">
                                            {photoCount > 0 && <span>{photoCount}📸 • </span>}
                                            <span>{surchargeCount > 0 ? `${surchargeCount} phụ phí & VAS` : 'Cấu hình giá & VAS'}</span>
                                          </span>
                                        </button>
                                      </td>

                                      {/* 7. Action */}
                                      <td className="p-2 text-center align-middle w-20 min-w-[80px]">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-200 hover:border-amber-200 transition-all cursor-pointer shadow-2xs"
                                            title="Nhân bản cơ sở kho tự quản này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
                                            title="Xóa cơ sở kho tự quản này"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                                const effWhCode = route.warehouseCode || route.routeCode || `WH-DC-${String(idx + 1).padStart(3, '0')}`;
                                const effWhName = route.warehouseName || route.route || `Kho Phân Phối DC #${idx + 1}`;
                                const effProvince = route.warehouseProvince || route.origin || 'Bình Dương';
                                const effAddress = route.warehouseAddress || route.destination || 'KCN Sóng Thần 1, Dĩ An';
                                const effCapArea = route.capacityArea ?? 2500;
                                const effCapPallet = route.capacityPallets ?? 1800;
                                const effCapVolume = route.capacityVolume ?? 3000;
                                const effPriceArea = route.pricePerArea ?? (route.price || 95000);
                                const effPricePallet = route.pricePerPallet ?? 110000;
                                const effPriceVolume = route.pricePerVolume ?? 120000;
                                const effMinCharge = route.minChargeMonthly ?? 3000000;

                                return (
                                  <tr key={route.id} className="hover:bg-indigo-50/20 transition-colors divide-x divide-slate-100 text-xs">
                                    {/* 1. STT */}
                                    <td className="p-2 text-center font-bold text-slate-500 w-12 bg-slate-50/50">
                                      {idx + 1}
                                    </td>

                                    {/* 2. Mã Kho */}
                                    <td className="p-1.5 text-center font-mono font-bold text-indigo-700 bg-indigo-50/20">
                                      <input
                                        type="text"
                                        value={effWhCode}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseCode: e.target.value, routeCode: e.target.value })}
                                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1.5 font-bold text-indigo-700 text-xs"
                                        placeholder="WH-001"
                                      />
                                    </td>

                                    {/* 3. Tên Kho */}
                                    <td className="p-1.5 align-middle">
                                      <input
                                        type="text"
                                        value={effWhName}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseName: e.target.value, route: e.target.value })}
                                        placeholder="Tên kho / Trung tâm phân phối..."
                                        className="w-full px-2.5 py-1.5 font-bold text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 4. Tỉnh */}
                                    <td className="p-1.5 align-middle">
                                      <input
                                        type="text"
                                        value={effProvince}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseProvince: e.target.value, origin: e.target.value })}
                                        placeholder="Bình Dương, Bắc Ninh..."
                                        className="w-full px-2.5 py-1.5 font-semibold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 5. Địa Chỉ Chi Tiết */}
                                    <td className="p-1.5 align-middle">
                                      <input
                                        type="text"
                                        value={effAddress}
                                        onChange={(e) => handleUpdateRouteRowMultiple(route.id, { warehouseAddress: e.target.value, destination: e.target.value })}
                                        placeholder="KCN, Phường/Xã, Quận/Huyện..."
                                        className="w-full px-2.5 py-1.5 text-slate-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded text-xs"
                                      />
                                    </td>

                                    {/* 6. Chi Tiết */}
                                    <td className="p-1.5 text-center align-middle bg-indigo-50/20">
                                      {(() => {
                                        const photoCount = route.warehousePhotos?.length ?? 3;
                                        const vasCount = (route.warehouseVasItems || []).filter(v => v.isChecked).length || 2;
                                        const paidCount = (route.warehousePaidSurcharges || []).filter(p => p.isChecked).length || 3;
                                        const capArea = route.capacityArea ?? 2500;
                                        const availArea = route.availableArea ?? 850;
                                        return (
                                          <button
                                            type="button"
                                            onClick={() => handleOpenWarehouseDetailModal(route)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                                            title="Bấm để cấu hình Album ảnh, Thông số kỹ thuật/Vận hành và Biểu giá, Phụ phí & VAS"
                                          >
                                            <Sliders className="w-3.5 h-3.5 text-indigo-700 group-hover:scale-110 transition-transform" />
                                            <span>Chi Tiết</span>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-white/90 rounded-md text-indigo-900 border border-indigo-200 font-semibold">
                                              {availArea}/{capArea} m² • {paidCount + vasCount} phí
                                            </span>
                                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-indigo-500" />
                                          </button>
                                        );
                                      })()}
                                    </td>

                                    {/* 7. Action */}
                                    <td className="p-1.5 text-center align-middle w-20">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateRouteRow(route.id)}
                                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                                          title="Nhân bản cơ sở kho này"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRouteRow(route.id)}
                                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                          title="Xóa cơ sở kho này"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              const isTrucking = activeCategory?.id === 'trucking';
                              const isOcean = activeCategory?.id === 'ocean' || activeModel?.id?.startsWith('sea-');
                              const isRail = activeCategory?.id === 'rail' || activeModel?.id?.startsWith('rail-');
                              const isAir = activeCategory?.id === 'air' || activeModel?.id?.startsWith('air-');
                              const isExpress = activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express');
                              const isAirCargo = isAir && !isExpress;
                              const isFcl = (isOcean && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL') || activeModel?.code === 'FCL')) || (isRail && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL')));
                              const isLcl = (isOcean && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL')) || (isRail && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL')));
                              const isLtlTrucking = isTrucking && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                              const isLtlOrLcl = isLtlTrucking || isLcl;
                              const isReeferTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref'));
                              const isHazmatTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg'));
                              const cargoType: 'general' | 'reefer' | 'hazmat' | 'ltl' = isLtlTrucking ? 'ltl' : (isHazmatTrucking ? 'hazmat' : (isReeferTrucking ? 'reefer' : 'general'));
                              const currentTruckBodyTypes = isLtlTrucking ? LTL_TRUCKING_BODY_TYPES : (isHazmatTrucking ? HAZMAT_TRUCKING_BODY_TYPES : (isReeferTrucking ? REEFER_TRUCKING_BODY_TYPES : TRUCKING_BODY_TYPES));
                              const effectiveRouteCode = route.routeCode || `RC-${(isLtlTrucking ? 'LTL' : (activeModel?.code || activeCategory?.id || 'GEN')).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${String(idx + 1).padStart(3, '0')}`;
                              if (isLtlTrucking) {
                                const availableTonnages = route.truckBodyType && LTL_TRUCKING_BODY_TYPE_MAP[route.truckBodyType]
                                  ? LTL_TRUCKING_BODY_TYPE_MAP[route.truckBodyType]
                                  : ALL_DEFAULT_LTL_TONNAGES;

                                const currentBodyType = route.truckBodyType || LTL_TRUCKING_BODY_TYPES[0];
                                const currentTonnage = route.truckTonnage || availableTonnages[1] || availableTonnages[0];

                                return (
                                  <tr key={route.id} className="divide-x divide-slate-200 hover:bg-indigo-50/20 transition-colors">
                                    {/* 1. STT */}
                                    <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                      {idx + 1}
                                    </td>

                                    {/* 2. Mã Tuyến */}
                                    <td className="p-0 align-top bg-slate-50/30">
                                      <input
                                        type="text"
                                        value={effectiveRouteCode}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                        placeholder="RC-LTL-001"
                                        className="w-full px-2 py-2.5 text-center font-mono font-bold text-indigo-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all uppercase"
                                        title="Mã tuyến đường nội bộ"
                                      />
                                    </td>

                                    {/* 3. Hành Lang Tuyến */}
                                    <td className="p-0 align-top">
                                      <input
                                        type="text"
                                        value={route.route}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                        placeholder="VD: Hà Nội ⇄ TP.HCM..."
                                        className="w-full px-2.5 py-2.5 font-bold text-slate-900 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                        title="Hành lang tuyến vận chuyển"
                                      />
                                    </td>

                                    {/* 4. Điểm Đầu (Điểm Đi) */}
                                    <td className="p-0 align-top">
                                      <input
                                        type="text"
                                        value={route.origin}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                        placeholder="Điểm đầu (Điểm đi)..."
                                        className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                      />
                                    </td>

                                    {/* 5. Điểm Cuối (Điểm Đến) */}
                                    <td className="p-0 align-top">
                                      <input
                                        type="text"
                                        value={route.destination}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                        placeholder="Điểm cuối (Điểm đến)..."
                                        className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                      />
                                    </td>

                                    {/* 6. Loại Thùng Phương Tiện */}
                                    <td className="p-0 align-top">
                                      <select
                                        value={currentBodyType}
                                        onChange={(e) => {
                                          const newBody = e.target.value;
                                          const newAvailable = LTL_TRUCKING_BODY_TYPE_MAP[newBody] || ALL_DEFAULT_LTL_TONNAGES;
                                          handleUpdateRouteRowMultiple(route.id, {
                                            truckBodyType: newBody,
                                            truckTonnage: newAvailable[0] || route.truckTonnage,
                                          });
                                        }}
                                        className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                      >
                                        {LTL_TRUCKING_BODY_TYPES.map((bt, btIdx) => (
                                          <option key={btIdx} value={bt}>{bt}</option>
                                        ))}
                                      </select>
                                    </td>

                                    {/* 7. Phân Khúc Tải Trọng */}
                                    <td className="p-0 align-top">
                                      <select
                                        value={currentTonnage}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'truckTonnage', e.target.value)}
                                        className="w-full px-2 py-2.5 text-xs font-semibold text-indigo-900 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all truncate"
                                      >
                                        {availableTonnages.map((ton, tIdx) => (
                                          <option key={tIdx} value={ton}>{ton}</option>
                                        ))}
                                      </select>
                                    </td>

                                    {/* 8. Chi Tiết Biểu Phí */}
                                    <td className="p-2 text-center align-middle bg-indigo-50/20">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenLtlCostMatrixModal(route)}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer transition-colors"
                                        title="Nhấp để mở ma trận khai báo chi tiết biểu phí LTL theo Kg & CBM song song"
                                      >
                                        Chi tiết
                                      </button>
                                    </td>

                                    {/* 9. Action */}
                                    <td className="p-1 text-center align-middle">
                                      <div className="flex items-center justify-center space-x-1">
                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateRouteRow(route.id)}
                                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                          title="Nhân bản tuyến này"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRouteRow(route.id)}
                                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                          title="Xóa tuyến"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              const isTruckingFtlRow = isTrucking && !isLtlTrucking;
                                if (isTruckingFtlRow) {
                                  return (
                                    <tr key={route.id} className="divide-x divide-slate-200 hover:bg-indigo-50/20 transition-colors">
                                      {/* 1. STT */}
                                      <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã Tuyến */}
                                      <td className="p-0 align-top bg-slate-50/30">
                                        <input
                                          type="text"
                                          value={effectiveRouteCode}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                          placeholder="RC-FTL-001"
                                          className="w-full px-2 py-2.5 text-center font-mono font-bold text-indigo-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all uppercase"
                                          title="Mã tuyến đường nội bộ"
                                        />
                                      </td>

                                      {/* 3. Hành Lang Tuyến */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.route}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                          placeholder="VD: Tuyến Bắc - Nam, Tuyến Đông Nam Bộ..."
                                          className="w-full px-2.5 py-2.5 font-bold text-slate-900 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                          title="Hành lang tuyến vận chuyển"
                                        />
                                      </td>

                                      {/* 4. Điểm Đi */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.origin}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                          placeholder="Điểm đi (KCN, Tỉnh/TP)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                        />
                                      </td>

                                      {/* 5. Điểm Đến */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.destination}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                          placeholder="Điểm đến (KCN, Tỉnh/TP)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                        />
                                      </td>

                                      {/* 6. Chi Tiết (Mở Popup Ma Trận Biểu Phí Đa Phương Tiện) */}
                                      <td className="p-2 text-center align-middle bg-indigo-50/20">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCostMatrixModal(route)}
                                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer transition-colors"
                                          title="Nhấp để mở hộp thoại khai báo chi tiết biểu phí phương tiện"
                                        >
                                          Chi tiết
                                        </button>
                                      </td>

                                      {/* 7. Action */}
                                      <td className="p-1 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Nhân bản tuyến này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Xóa tuyến"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                const isAirCargoRow = isAir && !isExpress;
                                if (isAirCargoRow) {
                                  const effectiveRouteCode = route.routeCode || `RC-AIR-${String(idx + 1).padStart(3, '0')}`;
                                  const effectiveRegion = route.region || 'Đông Bắc Á (Nhật - Hàn - Trung - Đài)';
                                  const airLov = AIR_AIRLINES_LOV;
                                  const currentAirline = airLov.includes(route.vehicleType || route.shippingLine || '')
                                    ? (route.vehicleType || route.shippingLine || airLov[0])
                                    : (route.customShippingLine || route.shippingLine === 'Khác (Nhập hãng bay khác)...'
                                      ? 'Khác (Nhập hãng bay khác)...'
                                      : (airLov[0] || 'Vietnam Airlines (VN Cargo)'));

                                  return (
                                    <tr key={route.id} className="divide-x divide-slate-200 hover:bg-sky-50/20 transition-colors">
                                      {/* 1. STT */}
                                      <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã Tuyến */}
                                      <td className="p-0 align-top bg-slate-50/30">
                                        <input
                                          type="text"
                                          value={effectiveRouteCode}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                          placeholder="RC-AIR-001"
                                          className="w-full px-2 py-2.5 text-center font-mono font-bold text-sky-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all uppercase"
                                          title="Mã tuyến hàng không"
                                        />
                                      </td>

                                      {/* 3. Khu Vực */}
                                      <td className="p-0 align-top bg-slate-50/20">
                                        <select
                                          value={effectiveRegion}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'region', e.target.value)}
                                          className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        >
                                          {AIR_TRADE_LANE_REGIONS_LOV.map((r, rIdx) => (
                                            <option key={rIdx} value={r}>{r}</option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* 4. Hành Lang Tuyến */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.route}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                          placeholder="VD: SGN ⇄ NRT / FRA..."
                                          className="w-full px-2.5 py-2.5 font-bold text-slate-900 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                          title="Hành lang tuyến hàng không"
                                        />
                                      </td>

                                      {/* 5. Sân Bay Đi (AOD) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.origin}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                          placeholder="Sân bay Tân Sơn Nhất (SGN)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        />
                                      </td>

                                      {/* 6. Sân Bay Đến (AOA) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.destination}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                          placeholder="Sân bay Tokyo Narita (NRT)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        />
                                      </td>

                                      {/* 7. Hãng Bay (Airline) */}
                                      <td className="p-0 align-top">
                                        <select
                                          value={currentAirline}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            handleUpdateRouteRowMultiple(route.id, {
                                              vehicleType: val,
                                              shippingLine: val,
                                            });
                                          }}
                                          className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        >
                                          {airLov.map((s, sIdx) => (
                                            <option key={sIdx} value={s}>{s}</option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* 8. Chi Tiết Biểu Phí */}
                                      <td className="p-2 text-center align-middle bg-sky-50/20">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenAirCargoCostMatrixModal(route)}
                                          className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer transition-colors"
                                          title="Nhấp để mở ma trận khai báo chi tiết biểu phí Air Cargo theo CBM & Kg song song"
                                        >
                                          Chi tiết
                                        </button>
                                      </td>

                                      {/* 9. Action */}
                                      <td className="p-1 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Nhân bản tuyến này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Xóa tuyến"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                const isExpressRow = isAir && isExpress;
                                if (isExpressRow) {
                                  const effectiveRouteCode = route.routeCode || `RC-EXP-${String(idx + 1).padStart(3, '0')}`;
                                  const effectiveRegion = route.region || 'Đông Nam Á (ASEAN)';
                                  const carrierLov = EXPRESS_CARRIERS_LOV;
                                  const currentCarrier = carrierLov.includes(route.vehicleType || route.shippingLine || '')
                                    ? (route.vehicleType || route.shippingLine || carrierLov[0])
                                    : (route.customShippingLine || route.shippingLine === 'Khác (Nhập hãng khác)...'
                                      ? 'Khác (Nhập hãng khác)...'
                                      : (carrierLov[0] || 'DHL Express'));

                                  return (
                                    <tr key={route.id} className="divide-x divide-slate-200 hover:bg-amber-50/20 transition-colors">
                                      {/* 1. STT */}
                                      <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã Tuyến */}
                                      <td className="p-0 align-top bg-amber-50/30">
                                        <input
                                          type="text"
                                          value={effectiveRouteCode}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                          placeholder="RC-EXP-001"
                                          className="w-full px-2 py-2.5 text-center font-mono font-bold text-amber-800 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600 transition-all uppercase"
                                          title="Mã tuyến chuyển phát nhanh Express"
                                        />
                                      </td>

                                      {/* 3. Khu Vực */}
                                      <td className="p-0 align-top bg-amber-50/20">
                                        <select
                                          value={effectiveRegion}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'region', e.target.value)}
                                          className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600 transition-all"
                                        >
                                          {AIR_TRADE_LANE_REGIONS_LOV.map((r, rIdx) => (
                                            <option key={rIdx} value={r}>{r}</option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* 4. Hành Lang Tuyến */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.route}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                          placeholder="VD: TP.HCM ⇄ Singapore / Tokyo..."
                                          className="w-full px-2.5 py-2.5 font-bold text-slate-900 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600 transition-all"
                                          title="Hành lang tuyến chuyển phát nhanh Express"
                                        />
                                      </td>

                                      {/* 5. Điểm Lấy (Door Origin) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.origin}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                          placeholder="Nội thành TP.HCM (Door Pickup)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600 transition-all"
                                        />
                                      </td>

                                      {/* 6. Điểm Phát (Door Destination) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.destination}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                          placeholder="Singapore (Door Delivery)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600 transition-all"
                                        />
                                      </td>

                                      {/* 7. Hãng Chuyển Phát (Carrier) */}
                                      <td className="p-0 align-top">
                                        <select
                                          value={currentCarrier}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            handleUpdateRouteRowMultiple(route.id, {
                                              vehicleType: val,
                                              shippingLine: val,
                                            });
                                          }}
                                          className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600 transition-all"
                                        >
                                          {carrierLov.map((s, sIdx) => (
                                            <option key={sIdx} value={s}>{s}</option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* 8. Chi Tiết Biểu Phí */}
                                      <td className="p-2 text-center align-middle bg-amber-50/30">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenAirExpressCostMatrixModal(route)}
                                          className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer transition-colors"
                                          title="Nhấp để mở ma trận khai báo chi tiết biểu phí chuyển phát nhanh Express theo các bậc Kg"
                                        >
                                          Chi tiết
                                        </button>
                                      </td>

                                      {/* 9. Action */}
                                      <td className="p-1 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Nhân bản tuyến này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Xóa tuyến"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                const isOceanLclRow = isOcean && isLcl;
                                if (isOceanLclRow) {
                                  const effectiveRouteCode = route.routeCode || `RC-LCL-${String(idx + 1).padStart(3, '0')}`;
                                  const effectiveRegion = route.region || 'Bắc Mỹ';
                                  const shippingLov = LCL_SHIPPING_LINES;
                                  const currentShipping = shippingLov.includes(route.vehicleType || route.shippingLine || '')
                                    ? (route.vehicleType || route.shippingLine || shippingLov[0])
                                    : (route.customShippingLine || route.shippingLine === 'Khác (Nhập hãng tàu khác)...'
                                      ? 'Khác (Nhập hãng tàu khác)...'
                                      : (shippingLov[0] || 'Maersk (Maersk Line)'));

                                  return (
                                    <tr key={route.id} className="divide-x divide-slate-200 hover:bg-sky-50/20 transition-colors">
                                      {/* 1. STT */}
                                      <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã Tuyến */}
                                      <td className="p-0 align-top bg-slate-50/30">
                                        <input
                                          type="text"
                                          value={effectiveRouteCode}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                          placeholder="RC-LCL-001"
                                          className="w-full px-2 py-2.5 text-center font-mono font-bold text-sky-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all uppercase"
                                          title="Mã tuyến đường nội bộ"
                                        />
                                      </td>

                                      {/* 3. Khu Vực */}
                                      <td className="p-0 align-top bg-slate-50/20">
                                        <select
                                          value={effectiveRegion}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'region', e.target.value)}
                                          className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        >
                                          {OCEAN_TRADE_LANE_REGIONS_LOV.map((r, rIdx) => (
                                            <option key={rIdx} value={r}>{r}</option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* 4. Hành Lang Tuyến */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.route}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                          placeholder="VD: Cát Lái ⇄ Singapore (SGSIN)..."
                                          className="w-full px-2.5 py-2.5 font-bold text-slate-900 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                          title="Hành lang tuyến vận chuyển"
                                        />
                                      </td>

                                      {/* 5. Kho CFS / Điểm Đi */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.origin}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                          placeholder="Kho CFS Cát Lái (TP.HCM)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        />
                                      </td>

                                      {/* 6. Kho CFS / Cảng Đến */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.destination}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                          placeholder="Cảng Singapore (SGSIN)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        />
                                      </td>

                                      {/* 7. Hãng Tàu / Co-Loader */}
                                      <td className="p-0 align-top">
                                        <select
                                          value={currentShipping}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            handleUpdateRouteRowMultiple(route.id, {
                                              vehicleType: val,
                                              shippingLine: val,
                                            });
                                          }}
                                          className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        >
                                          {shippingLov.map((s, sIdx) => (
                                            <option key={sIdx} value={s}>{s}</option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* 8. Chi Tiết Biểu Phí */}
                                      <td className="p-2 text-center align-middle bg-sky-50/20">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenOceanLclCostMatrixModal(route)}
                                          className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer transition-colors"
                                          title="Nhấp để mở ma trận khai báo chi tiết biểu phí LCL theo CBM & Kg song song"
                                        >
                                          Chi tiết
                                        </button>
                                      </td>

                                      {/* 9. Action */}
                                      <td className="p-1 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Nhân bản tuyến này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Xóa tuyến"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                const isOceanFclRow = isOcean && isFcl;
                                if (isOceanFclRow) {
                                  const effectiveRouteCode = route.routeCode || `RC-FCL-${String(idx + 1).padStart(3, '0')}`;
                                  const effectiveRegion = route.region || 'Châu Á';
                                  const shippingLov = LCL_SHIPPING_LINES;
                                  const currentShipping = shippingLov.includes(route.shippingLine || '')
                                    ? (route.shippingLine || shippingLov[0])
                                    : (route.customShippingLine || route.shippingLine === 'Khác (Nhập hãng tàu khác)...'
                                      ? 'Khác (Nhập hãng tàu khác)...'
                                      : (shippingLov[0] || route.shippingLine || 'Maersk (Maersk Line)'));

                                  return (
                                    <tr key={route.id} className="divide-x divide-slate-200 hover:bg-sky-50/20 transition-colors">
                                      {/* 1. STT */}
                                      <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã Tuyến */}
                                      <td className="p-0 align-top bg-slate-50/30">
                                        <input
                                          type="text"
                                          value={effectiveRouteCode}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                          placeholder="RC-FCL-001"
                                          className="w-full px-2 py-2.5 text-center font-mono font-bold text-sky-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all uppercase"
                                          title="Mã tuyến đường nội bộ"
                                        />
                                      </td>

                                      {/* 3. Khu Vực */}
                                      <td className="p-0 align-top bg-slate-50/20">
                                        <select
                                          value={effectiveRegion}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'region', e.target.value)}
                                          className="w-full px-2 py-2.5 text-xs font-semibold text-slate-800 bg-transparent cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        >
                                          {OCEAN_TRADE_LANE_REGIONS_LOV.map((r, rIdx) => (
                                            <option key={rIdx} value={r}>{r}</option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* 4. Cảng Đi (POL) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.origin}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                          placeholder="Cảng đi (POL: Cát Lái, Cái Mép...)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        />
                                      </td>

                                      {/* 5. Cảng Đến (POD) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.destination}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                          placeholder="Cảng đến (POD: Hamburg, LA...)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                        />
                                      </td>

                                      {/* 6. Hãng Tàu */}
                                      <td className="p-0 align-top">
                                        <div className="flex flex-col h-full">
                                          <select
                                            value={currentShipping}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              handleUpdateRouteRowMultiple(route.id, {
                                                shippingLine: val,
                                                customShippingLine: '',
                                              });
                                            }}
                                            className="w-full px-2.5 py-2.5 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-600 transition-all"
                                          >
                                            {shippingLov.map((line, lIdx) => (
                                              <option key={lIdx} value={line}>{line}</option>
                                            ))}
                                          </select>

                                          {(currentShipping === 'Khác (Nhập hãng tàu khác)...'
                                            || (!shippingLov.includes(route.shippingLine || '') && route.customShippingLine)) && (
                                            <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                              <input
                                                type="text"
                                                autoFocus
                                                value={route.customShippingLine || ''}
                                                onChange={(e) => {
                                                  const customVal = e.target.value;
                                                  handleUpdateRouteRowMultiple(route.id, {
                                                    customShippingLine: customVal,
                                                    shippingLine: customVal,
                                                  });
                                                }}
                                                placeholder="Nhập tên hãng tàu..."
                                                className="w-full px-1.5 py-1 text-xs bg-white border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      {/* 7. Chi Tiết (Mở Popup Ma Trận Chi Phí Container) */}
                                      <td className="p-2 text-center align-middle bg-sky-50/20">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenOceanFclCostMatrixModal(route)}
                                          className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer transition-colors"
                                          title="Nhấp để mở hộp thoại khai báo chi tiết biểu phí container đường biển"
                                        >
                                          Chi tiết
                                        </button>
                                      </td>

                                      {/* 8. Action */}
                                      <td className="p-1 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Nhân bản tuyến này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Xóa tuyến"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                const isRailLclRow = isRail && (isLcl || !isFcl);
                                if (isRailLclRow) {
                                  const effectiveRouteCode = route.routeCode || `RC-RLCL-${String(idx + 1).padStart(3, '0')}`;
                                  const corridorLov = RAIL_TRADE_LANE_CORRIDORS_LOV;
                                  const currentCorridor = corridorLov.includes(route.route || '')
                                    ? (route.route || corridorLov[0])
                                    : (route.customRoute || route.route === 'Khác (Nhập hành lang tuyến khác)...'
                                      ? 'Khác (Nhập hành lang tuyến khác)...'
                                      : (corridorLov[0] || route.route || 'Tuyến Bắc - Nam (Hà Nội ⇄ TP.HCM / Bình Dương)'));

                                  const operatorLov = RAIL_OPERATORS_LOV;
                                  const currentOperator = operatorLov.includes(route.shippingLine || '')
                                    ? (route.shippingLine || operatorLov[0])
                                    : (route.customShippingLine || route.shippingLine === 'Khác (Nhập đơn vị vận hành khác)...'
                                      ? 'Khác (Nhập đơn vị vận hành khác)...'
                                      : (operatorLov[0] || route.shippingLine || 'Đường Sắt Việt Nam (VNR)'));

                                  return (
                                    <tr key={route.id} className="divide-x divide-slate-200 hover:bg-emerald-50/20 transition-colors">
                                      {/* 1. STT */}
                                      <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã Tuyến */}
                                      <td className="p-0 align-top bg-slate-50/30">
                                        <input
                                          type="text"
                                          value={effectiveRouteCode}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                          placeholder="RC-RLCL-001"
                                          className="w-full px-2 py-2.5 text-center font-mono font-bold text-emerald-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all uppercase"
                                          title="Mã tuyến đường sắt hàng lẻ (LCL)"
                                        />
                                      </td>

                                      {/* 3. Hành Lang Tuyến (Dropdown LOV) */}
                                      <td className="p-0 align-top bg-slate-50/20">
                                        <div className="flex flex-col h-full">
                                          <select
                                            value={currentCorridor}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              handleUpdateRouteRowMultiple(route.id, {
                                                route: val,
                                                customRoute: '',
                                              });
                                            }}
                                            className="w-full px-2.5 py-2.5 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                          >
                                            {corridorLov.map((cor, cIdx) => (
                                              <option key={cIdx} value={cor}>{cor}</option>
                                            ))}
                                          </select>

                                          {(currentCorridor === 'Khác (Nhập hành lang tuyến khác)...'
                                            || (!corridorLov.includes(route.route || '') && route.customRoute)) && (
                                            <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                              <input
                                                type="text"
                                                autoFocus
                                                value={route.customRoute || ''}
                                                onChange={(e) => {
                                                  const customVal = e.target.value;
                                                  handleUpdateRouteRowMultiple(route.id, {
                                                    customRoute: customVal,
                                                    route: customVal,
                                                  });
                                                }}
                                                placeholder="Nhập hành lang tuyến khác..."
                                                className="w-full px-1.5 py-1 text-xs bg-white border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      {/* 4. Ga Đi (POL) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.origin}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                          placeholder="Ga đi (POL: Sóng Thần, Yên Viên...)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                        />
                                      </td>

                                      {/* 5. Ga Đến (POD) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.destination}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                          placeholder="Ga đến (POD: Giáp Bát, Đồng Đăng...)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                        />
                                      </td>

                                      {/* 6. Đơn Vị Vận Hành */}
                                      <td className="p-0 align-top">
                                        <div className="flex flex-col h-full">
                                          <select
                                            value={currentOperator}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              handleUpdateRouteRowMultiple(route.id, {
                                                shippingLine: val,
                                                customShippingLine: '',
                                              });
                                            }}
                                            className="w-full px-2.5 py-2.5 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                          >
                                            {operatorLov.map((line, lIdx) => (
                                              <option key={lIdx} value={line}>{line}</option>
                                            ))}
                                          </select>

                                          {(currentOperator === 'Khác (Nhập đơn vị vận hành khác)...'
                                            || (!operatorLov.includes(route.shippingLine || '') && route.customShippingLine)) && (
                                            <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                              <input
                                                type="text"
                                                autoFocus
                                                value={route.customShippingLine || ''}
                                                onChange={(e) => {
                                                  const customVal = e.target.value;
                                                  handleUpdateRouteRowMultiple(route.id, {
                                                    customShippingLine: customVal,
                                                    shippingLine: customVal,
                                                  });
                                                }}
                                                placeholder="Nhập đơn vị vận hành..."
                                                className="w-full px-1.5 py-1 text-xs bg-white border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      {/* 7. Chi Tiết (Mở Popup Ma Trận Chi Phí Hàng Lẻ Đường Sắt LCL) */}
                                      <td className="p-2 text-center align-middle bg-emerald-50/20">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenRailLclCostMatrixModal(route)}
                                          className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer transition-colors"
                                          title="Nhấp để mở hộp thoại khai báo chi tiết biểu phí ghép hàng đường sắt LCL"
                                        >
                                          Chi tiết
                                        </button>
                                      </td>

                                      {/* 8. Action */}
                                      <td className="p-1 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Nhân bản tuyến này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Xóa tuyến"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                                const isRailFclRow = isRail && isFcl;
                                if (isRailFclRow) {
                                  const effectiveRouteCode = route.routeCode || `RC-RAIL-${String(idx + 1).padStart(3, '0')}`;
                                  const corridorLov = RAIL_TRADE_LANE_CORRIDORS_LOV;
                                  const currentCorridor = corridorLov.includes(route.route || '')
                                    ? (route.route || corridorLov[0])
                                    : (route.customRoute || route.route === 'Khác (Nhập hành lang tuyến khác)...'
                                      ? 'Khác (Nhập hành lang tuyến khác)...'
                                      : (corridorLov[0] || route.route || 'Tuyến Bắc - Nam (Hà Nội ⇄ TP.HCM / Bình Dương)'));

                                  const operatorLov = RAIL_OPERATORS_LOV;
                                  const currentOperator = operatorLov.includes(route.shippingLine || '')
                                    ? (route.shippingLine || operatorLov[0])
                                    : (route.customShippingLine || route.shippingLine === 'Khác (Nhập đơn vị vận hành khác)...'
                                      ? 'Khác (Nhập đơn vị vận hành khác)...'
                                      : (operatorLov[0] || route.shippingLine || 'Đường Sắt Việt Nam (VNR)'));

                                  return (
                                    <tr key={route.id} className="divide-x divide-slate-200 hover:bg-emerald-50/20 transition-colors">
                                      {/* 1. STT */}
                                      <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                        {idx + 1}
                                      </td>

                                      {/* 2. Mã Tuyến */}
                                      <td className="p-0 align-top bg-slate-50/30">
                                        <input
                                          type="text"
                                          value={effectiveRouteCode}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                          placeholder="RC-RAIL-001"
                                          className="w-full px-2 py-2.5 text-center font-mono font-bold text-emerald-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all uppercase"
                                          title="Mã tuyến đường sắt nội bộ"
                                        />
                                      </td>

                                      {/* 3. Hành Lang Tuyến (Dropdown LOV) */}
                                      <td className="p-0 align-top bg-slate-50/20">
                                        <div className="flex flex-col h-full">
                                          <select
                                            value={currentCorridor}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              handleUpdateRouteRowMultiple(route.id, {
                                                route: val,
                                                customRoute: '',
                                              });
                                            }}
                                            className="w-full px-2.5 py-2.5 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                          >
                                            {corridorLov.map((cor, cIdx) => (
                                              <option key={cIdx} value={cor}>{cor}</option>
                                            ))}
                                          </select>

                                          {(currentCorridor === 'Khác (Nhập hành lang tuyến khác)...'
                                            || (!corridorLov.includes(route.route || '') && route.customRoute)) && (
                                            <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                              <input
                                                type="text"
                                                autoFocus
                                                value={route.customRoute || ''}
                                                onChange={(e) => {
                                                  const customVal = e.target.value;
                                                  handleUpdateRouteRowMultiple(route.id, {
                                                    customRoute: customVal,
                                                    route: customVal,
                                                  });
                                                }}
                                                placeholder="Nhập hành lang tuyến khác..."
                                                className="w-full px-1.5 py-1 text-xs bg-white border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      {/* 4. Ga Đi (POL) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.origin}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                          placeholder="Ga đi (POL: Sóng Thần, Yên Viên...)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                        />
                                      </td>

                                      {/* 5. Ga Đến (POD) */}
                                      <td className="p-0 align-top">
                                        <input
                                          type="text"
                                          value={route.destination}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                          placeholder="Ga đến (POD: Giáp Bát, Đồng Đăng...)..."
                                          className="w-full px-2.5 py-2.5 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                        />
                                      </td>

                                      {/* 6. Đơn Vị Vận Hành */}
                                      <td className="p-0 align-top">
                                        <div className="flex flex-col h-full">
                                          <select
                                            value={currentOperator}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              handleUpdateRouteRowMultiple(route.id, {
                                                shippingLine: val,
                                                customShippingLine: '',
                                              });
                                            }}
                                            className="w-full px-2.5 py-2.5 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition-all"
                                          >
                                            {operatorLov.map((line, lIdx) => (
                                              <option key={lIdx} value={line}>{line}</option>
                                            ))}
                                          </select>

                                          {(currentOperator === 'Khác (Nhập đơn vị vận hành khác)...'
                                            || (!operatorLov.includes(route.shippingLine || '') && route.customShippingLine)) && (
                                            <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                              <input
                                                type="text"
                                                autoFocus
                                                value={route.customShippingLine || ''}
                                                onChange={(e) => {
                                                  const customVal = e.target.value;
                                                  handleUpdateRouteRowMultiple(route.id, {
                                                    customShippingLine: customVal,
                                                    shippingLine: customVal,
                                                  });
                                                }}
                                                placeholder="Nhập đơn vị vận hành..."
                                                className="w-full px-1.5 py-1 text-xs bg-white border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      {/* 7. Chi Tiết (Mở Popup Ma Trận Chi Phí Container Đường Sắt) */}
                                      <td className="p-2 text-center align-middle bg-emerald-50/20">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenRailFclCostMatrixModal(route)}
                                          className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer transition-colors"
                                          title="Nhấp để mở hộp thoại khai báo chi tiết biểu phí container đường sắt"
                                        >
                                          Chi tiết
                                        </button>
                                      </td>

                                      {/* 8. Action */}
                                      <td className="p-1 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Nhân bản tuyến này"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRouteRow(route.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Xóa tuyến"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }

                              return (
                                <tr key={route.id} className="divide-x divide-slate-200 hover:bg-indigo-50/20 transition-colors">
                                  {/* 1. STT */}
                                  <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                    {idx + 1}
                                  </td>

                                  {/* 2. Mã Tuyến */}
                                  <td className="p-0 align-top bg-slate-50/30">
                                    <input
                                      type="text"
                                      value={effectiveRouteCode}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'routeCode', e.target.value)}
                                      placeholder="Mã tuyến..."
                                      className="w-full px-2 py-2 text-center font-mono font-bold text-indigo-700 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all uppercase"
                                      title="Mã định danh tuyến đường nội bộ hoặc quốc tế"
                                    />
                                  </td>

                                  {/* 2b. Khu Vực (Đường biển & Hàng không) */}
                                  {(isOcean || isAir) && (
                                    <td className="p-0 align-top">
                                      {(() => {
                                        const regionLov = isAir ? AIR_TRADE_LANE_REGIONS_LOV : OCEAN_TRADE_LANE_REGIONS_LOV;
                                        return (
                                          <select
                                            value={route.region || regionLov[0]}
                                            onChange={(e) => handleUpdateRouteRow(route.id, 'region', e.target.value)}
                                            className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all font-medium"
                                          >
                                            {regionLov.map((reg, rIdx) => (
                                              <option key={rIdx} value={reg}>{reg}</option>
                                            ))}
                                          </select>
                                        );
                                      })()}
                                    </td>
                                  )}

                                  {/* 3. Tuyến Đường */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="text"
                                      value={route.route}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                      placeholder="Tên tuyến..."
                                      className="w-full px-2.5 py-2 font-bold text-slate-900 text-xs bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                    />
                                  </td>

                                  {/* 4. Điểm Đi */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="text"
                                      value={route.origin}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                      placeholder={isAirCargo ? 'Sân bay TSN (SGN) / NBA (HAN)...' : (isExpress ? 'Kho lấy hàng nội thành...' : (isLcl ? 'Kho CFS Cát Lái / Đình Vũ...' : 'Điểm đi...'))}
                                      className="w-full px-2.5 py-2 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                    />
                                  </td>

                                  {/* 5. Điểm Đến */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="text"
                                      value={route.destination}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                      placeholder={isAirCargo ? 'Sân bay Narita (NRT) / LAX / SIN...' : (isExpress ? 'Singapore / USA / Nhật Bản...' : (isLcl ? 'Cảng Singapore / LA...' : 'Điểm đến...'))}
                                      className="w-full px-2.5 py-2 bg-transparent text-slate-700 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                    />
                                  </td>

                                  {/* 5b. Hãng Tàu (Ocean FCL: Hàng thường, Hàng lạnh, Hàng nguy hiểm) */}
                                  {isOcean && isFcl && (
                                    <td className="p-0 align-top">
                                      {(() => {
                                        const shippingLov = LCL_SHIPPING_LINES;
                                        const currentShipping = shippingLov.includes(route.shippingLine || '')
                                          ? (route.shippingLine || shippingLov[0])
                                          : (route.customShippingLine || route.shippingLine === 'Khác (Nhập hãng tàu khác)...'
                                            ? 'Khác (Nhập hãng tàu khác)...'
                                            : (shippingLov[0] || route.shippingLine || 'Maersk (Maersk Line)'));

                                        return (
                                          <div className="flex flex-col h-full">
                                            <select
                                              value={currentShipping}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                handleUpdateRouteRowMultiple(route.id, {
                                                  shippingLine: val,
                                                  customShippingLine: '',
                                                });
                                              }}
                                              className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                            >
                                              {shippingLov.map((line, lIdx) => (
                                                <option key={lIdx} value={line}>{line}</option>
                                              ))}
                                            </select>

                                            {(currentShipping === 'Khác (Nhập hãng tàu khác)...'
                                              || (!shippingLov.includes(route.shippingLine || '') && route.customShippingLine)) && (
                                              <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                                <input
                                                  type="text"
                                                  autoFocus
                                                  value={route.customShippingLine || ''}
                                                  onChange={(e) => {
                                                    const customVal = e.target.value;
                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      customShippingLine: customVal,
                                                      shippingLine: customVal,
                                                    });
                                                  }}
                                                  placeholder="Gõ tên hãng tàu..."
                                                  className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </td>
                                  )}

                                  {/* 5c. Hãng Bay (Air Cargo) */}
                                  {isAirCargo && (
                                    <td className="p-0 align-top">
                                      {(() => {
                                        const airLov = AIR_AIRLINES_LOV;
                                        const currentAirline = airLov.includes(route.vehicleType || '')
                                          ? (route.vehicleType || airLov[0])
                                          : (route.customShippingLine || route.vehicleType === 'Khác (Nhập hãng bay khác)...'
                                            ? 'Khác (Nhập hãng bay khác)...'
                                            : (airLov[0] || 'Vietnam Airlines (VN Cargo)'));

                                        return (
                                          <div className="flex flex-col h-full">
                                            <select
                                              value={currentAirline}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                handleUpdateRouteRowMultiple(route.id, {
                                                  vehicleType: val,
                                                  customShippingLine: '',
                                                });
                                              }}
                                              className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                            >
                                              {airLov.map((line, lIdx) => (
                                                <option key={lIdx} value={line}>{line}</option>
                                              ))}
                                            </select>

                                            {(currentAirline === 'Khác (Nhập hãng bay khác)...'
                                              || (!airLov.includes(route.vehicleType || '') && route.customShippingLine)) && (
                                              <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                                <input
                                                  type="text"
                                                  autoFocus
                                                  value={route.customShippingLine || ''}
                                                  onChange={(e) => {
                                                    const customVal = e.target.value;
                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      customShippingLine: customVal,
                                                      vehicleType: customVal,
                                                    });
                                                  }}
                                                  placeholder="Gõ tên hãng bay..."
                                                  className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </td>
                                  )}

                                  {/* 5d. Hãng Chuyển Phát (Express Courier) */}
                                  {isExpress && (
                                    <td className="p-0 align-top">
                                      {(() => {
                                        const expLov = EXPRESS_CARRIERS_LOV;
                                        const currentCarrier = expLov.includes(route.vehicleType || '')
                                          ? (route.vehicleType || expLov[0])
                                          : (route.customShippingLine || route.vehicleType === 'Khác (Nhập hãng khác)...'
                                            ? 'Khác (Nhập hãng khác)...'
                                            : (expLov[0] || 'DHL Express'));

                                        return (
                                          <div className="flex flex-col h-full">
                                            <select
                                              value={currentCarrier}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                handleUpdateRouteRowMultiple(route.id, {
                                                  vehicleType: val,
                                                  customShippingLine: '',
                                                });
                                              }}
                                              className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-all"
                                            >
                                              {expLov.map((carrier, cIdx) => (
                                                <option key={cIdx} value={carrier}>{carrier}</option>
                                              ))}
                                            </select>

                                            {(currentCarrier === 'Khác (Nhập hãng khác)...'
                                              || (!expLov.includes(route.vehicleType || '') && route.customShippingLine)) && (
                                              <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                                <input
                                                  type="text"
                                                  autoFocus
                                                  value={route.customShippingLine || ''}
                                                  onChange={(e) => {
                                                    const customVal = e.target.value;
                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      customShippingLine: customVal,
                                                      vehicleType: customVal,
                                                    });
                                                  }}
                                                  placeholder="Gõ tên hãng chuyển phát..."
                                                  className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </td>
                                  )}

                                  {/* 6. Loại Thùng + Tải Trọng (Trucking) hoặc Loại Phương Tiện / Cont / Quy Cách Đóng Gói LCL */}
                                  {isTrucking ? (
                                    <>
                                      {/* 6a. Loại Thùng Phương Tiện (LOV + Custom Option) */}
                                      <td className="p-0 align-top">
                                        {(() => {
                                          const currentBodyVal = currentTruckBodyTypes.includes(route.truckBodyType || '') 
                                            ? route.truckBodyType 
                                            : (route.customTruckBodyType || route.truckBodyType === 'Khác (Nhập tùy chọn)...' ? 'Khác (Nhập tùy chọn)...' : currentTruckBodyTypes[0]);

                                          return (
                                            <div className="flex flex-col h-full">
                                              <select
                                                value={currentBodyVal}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  if (val === 'Khác (Nhập tùy chọn)...') {
                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      truckBodyType: val,
                                                      customTruckBodyType: '',
                                                    });
                                                  } else {
                                                    const availableTonnages = getTonnagesForBodyType(val, cargoType);
                                                    const newTonnage = availableTonnages.includes(route.truckTonnage || '') 
                                                      ? route.truckTonnage 
                                                      : (availableTonnages[0] || '15.0T');

                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      truckBodyType: val,
                                                      customTruckBodyType: '',
                                                      truckTonnage: newTonnage,
                                                      vehicleType: `${newTonnage ? newTonnage.split(' (')[0] : ''} ${val.split(' (')[0]}`.trim(),
                                                    });
                                                  }
                                                }}
                                                className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs font-medium cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                              >
                                                {currentTruckBodyTypes.map((body, bIdx) => (
                                                  <option key={bIdx} value={body}>{body}</option>
                                                ))}
                                              </select>

                                              {(currentBodyVal === 'Khác (Nhập tùy chọn)...' || (!currentTruckBodyTypes.includes(route.truckBodyType || '') && route.customTruckBodyType)) && (
                                                <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                                  <input
                                                    type="text"
                                                    autoFocus
                                                    value={route.customTruckBodyType || ''}
                                                    onChange={(e) => {
                                                      const customVal = e.target.value;
                                                      handleUpdateRouteRowMultiple(route.id, {
                                                        customTruckBodyType: customVal,
                                                        vehicleType: `${route.truckTonnage ? route.truckTonnage.split(' (')[0] : ''} ${customVal}`.trim(),
                                                      });
                                                    }}
                                                    placeholder="Gõ loại thùng riêng..."
                                                    className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })()}
                                      </td>

                                      {/* 6b. Phân Khúc Tải Trọng Ràng Buộc Theo Loại Thùng (LOV + Custom Option) */}
                                      <td className="p-0 align-top">
                                        {(() => {
                                          const boundTonnages = getTonnagesForBodyType(route.truckBodyType || currentTruckBodyTypes[0], cargoType);
                                          const currentTonnageVal = boundTonnages.includes(route.truckTonnage || '')
                                            ? route.truckTonnage
                                            : (route.customTruckTonnage || route.truckTonnage === 'Khác (Nhập tùy chọn)...' ? 'Khác (Nhập tùy chọn)...' : boundTonnages[0]);

                                          return (
                                            <div className="flex flex-col h-full">
                                              <select
                                                value={currentTonnageVal}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  if (val === 'Khác (Nhập tùy chọn)...') {
                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      truckTonnage: val,
                                                      customTruckTonnage: '',
                                                    });
                                                  } else {
                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      truckTonnage: val,
                                                      customTruckTonnage: '',
                                                      vehicleType: `${val.split(' (')[0]} ${route.truckBodyType ? route.truckBodyType.split(' (')[0] : ''}`.trim(),
                                                    });
                                                  }
                                                }}
                                                className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs font-medium cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                              >
                                                {boundTonnages.map((t, tIdx) => (
                                                  <option key={tIdx} value={t}>{t}</option>
                                                ))}
                                              </select>

                                              {(currentTonnageVal === 'Khác (Nhập tùy chọn)...' || (!boundTonnages.includes(route.truckTonnage || '') && route.customTruckTonnage)) && (
                                                <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                                  <input
                                                    type="text"
                                                    autoFocus
                                                    value={route.customTruckTonnage || ''}
                                                    onChange={(e) => {
                                                      const customVal = e.target.value;
                                                      handleUpdateRouteRowMultiple(route.id, {
                                                        customTruckTonnage: customVal,
                                                        vehicleType: `${customVal} ${route.truckBodyType ? route.truckBodyType.split(' (')[0] : ''}`.trim(),
                                                      });
                                                    }}
                                                    placeholder="Gõ tải trọng riêng..."
                                                    className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })()}
                                      </td>
                                    </>
                                   ) : isLcl ? (
                                     /* 6c. Đơn Vị Vận Hành (Rail LCL) / Hãng Tàu / Co-loader (Ocean LCL) */
                                     <td className="p-0 align-top">
                                       {(() => {
                                         const isRailLclRow = isRail;
                                         const operatorLov = isRailLclRow ? RAIL_OPERATORS_LOV : LCL_SHIPPING_LINES;
                                         const otherLabel = isRailLclRow ? 'Khác (Nhập đơn vị vận hành khác)...' : 'Khác (Nhập hãng tàu khác)...';
                                         const currentOperator = operatorLov.includes(route.vehicleType)
                                           ? route.vehicleType
                                           : (route.customShippingLine || route.customPackagingType || route.vehicleType === otherLabel ? otherLabel : (operatorLov[0] || route.vehicleType));

                                         return (
                                           <div className="flex flex-col h-full">
                                             <select
                                               value={currentOperator}
                                               onChange={(e) => {
                                                 const val = e.target.value;
                                                 handleUpdateRouteRowMultiple(route.id, {
                                                   vehicleType: val,
                                                   customShippingLine: '',
                                                   customPackagingType: '',
                                                 });
                                               }}
                                               className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                             >
                                               {operatorLov.map((line, lIdx) => (
                                                 <option key={lIdx} value={line}>{line}</option>
                                               ))}
                                             </select>

                                             {(currentOperator === otherLabel || (!operatorLov.includes(route.vehicleType) && (route.customShippingLine || route.customPackagingType))) && (
                                               <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                                 <input
                                                   type="text"
                                                   autoFocus
                                                   value={route.customShippingLine || route.customPackagingType || ''}
                                                   onChange={(e) => {
                                                     const customVal = e.target.value;
                                                     handleUpdateRouteRowMultiple(route.id, {
                                                       customShippingLine: customVal,
                                                       customPackagingType: customVal,
                                                       vehicleType: customVal,
                                                     });
                                                   }}
                                                   placeholder={isRailLclRow ? "Gõ tên đơn vị vận hành..." : "Gõ tên hãng tàu / Co-loader..."}
                                                   className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                 />
                                               </div>
                                             )}
                                           </div>
                                         );
                                       })()}
                                     </td>
                                   ) : !isAir ? (
                                     <td className="p-0 align-top">
                                       {(() => {
                                         const isRailFcl = isRail && isFcl;
                                         const normalizedVeh = isRailFcl
                                           ? (route.vehicleType?.includes('20') ? 'Container 20ft' : (route.vehicleType?.includes('40') ? 'Container 40ft' : (activeModel?.vehicleLov?.[0] || 'Container 20ft')))
                                           : route.vehicleType;
                                         const options = activeModel?.vehicleLov || [route.vehicleType];
                                         return (
                                           <select
                                             value={normalizedVeh}
                                             onChange={(e) => handleUpdateRouteRow(route.id, 'vehicleType', e.target.value)}
                                             className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all cursor-pointer font-medium"
                                           >
                                             {options.map((veh: string, vIdx: number) => (
                                               <option key={vIdx} value={veh}>{veh}</option>
                                             ))}
                                           </select>
                                         );
                                       })()}
                                     </td>
                                   ) : null}

                                   {/* 7. Đơn vị tính (LOV) */}
                                   <td className="p-0 text-center bg-slate-50/40 align-middle">
                                     {(isAirCargo || isExpress) ? (
                                       <span className="font-bold text-sky-900 bg-sky-100/90 px-2 py-0.5 rounded text-xs border border-sky-200">
                                         Kg
                                       </span>
                                     ) : (activeModel?.unitLov?.length === 1 || (isRail && isFcl) || (isRail && isLcl)) ? (
                                       <span className="inline-block font-bold text-slate-800 bg-slate-100/90 px-2.5 py-0.5 rounded text-xs border border-slate-200 shadow-2xs">
                                         {activeModel?.unitLov?.[0] || ((isRail && isFcl) ? 'Cont' : 'Kg')}
                                       </span>
                                    ) : (
                                      <select
                                        value={route.pricingUnit}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'pricingUnit', e.target.value)}
                                        className="w-full px-1.5 py-2 bg-transparent text-slate-800 text-xs font-medium text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all cursor-pointer"
                                      >
                                        {(activeModel?.unitLov || (isLcl ? ['CBM', 'RT (Revenue Ton)', 'Kg', 'Pallet'] : ['Kg', 'CBM', 'Chuyến', 'Tấn', 'Cont', 'Pallet'])).map((u: string, uIdx: number) => (
                                          <option key={uIdx} value={u}>{u}</option>
                                        ))}
                                      </select>
                                    )}
                                  </td>

                                  {/* 8. Tiền Tệ (USD / VND) */}
                                  <td className="p-0 text-center bg-slate-50/30 align-middle">
                                    <select
                                      value={route.currency || ((isOcean || isAir) ? 'USD' : 'VND')}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'currency', e.target.value as 'VND' | 'USD')}
                                      className="w-full px-1.5 py-2 bg-transparent text-slate-800 text-xs font-bold text-center cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                    >
                                      <option value="USD">USD ($)</option>
                                      <option value="VND">VND (₫)</option>
                                    </select>
                                  </td>

                                  {/* 9. Đơn giá (Nhập giá + Live currency conversion tag & Ma Trận Bậc cho Air Cargo / LTL / LCL) */}
                                  <td className="p-1.5 align-middle">
                                    {isExpress ? (
                                      <div className="flex flex-col gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenTieredPricingModal(route)}
                                          className="w-full px-2.5 py-1.5 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50/90 via-white to-orange-50/70 hover:from-amber-100 hover:to-orange-100 text-slate-900 text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-1.5"
                                          title="Nhấp để cấu hình chi tiết ma trận 6 bậc giá chuyển phát nhanh Express (+45kg Base Rate)"
                                        >
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="font-mono font-bold text-xs text-amber-950 truncate">
                                                {route.currency === 'USD' ? (
                                                  `$${route.ltlPricing?.weightTiers?.[5]?.price || 4.9} – $${route.ltlPricing?.weightTiers?.[0]?.price || 14.0}`
                                                ) : (
                                                  `${(route.ltlPricing?.weightTiers?.[5]?.price || 120000).toLocaleString('vi-VN')} – ${(route.ltlPricing?.weightTiers?.[0]?.price || 350000).toLocaleString('vi-VN')} ₫`
                                                )}
                                              </span>
                                              <span className="text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md shrink-0 border border-amber-300/60">
                                                6 Bậc Express
                                              </span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between mt-0.5">
                                              <span>
                                                Base (+45): <strong className="text-amber-900 font-bold">
                                                  {route.currency === 'USD'
                                                    ? `$${route.ltlPricing?.weightTiers?.[3]?.price || route.price || 6.5} / Kg`
                                                    : `${(route.ltlPricing?.weightTiers?.[3]?.price || route.price || 165000).toLocaleString('vi-VN')} ₫ / Kg`}
                                                </strong>
                                              </span>
                                              <span className="text-amber-700 font-bold group-hover:underline">Chi tiết ➔</span>
                                            </div>
                                          </div>
                                        </button>

                                        {/* Live Currency Conversion Tag for Express */}
                                        {(() => {
                                          const baseVal = route.ltlPricing?.weightTiers?.[3]?.price || route.price || (route.currency === 'USD' ? 6.5 : 165000);
                                          return (
                                            <div className="text-[10px] font-semibold px-0.5 flex items-center justify-between">
                                              {route.currency === 'USD' ? (
                                                <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/60">
                                                  ≈ {(baseVal * USD_TO_VND_EXCHANGE_RATE).toLocaleString('vi-VN')} ₫
                                                </span>
                                              ) : (
                                                <span className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">
                                                  ≈ ${(baseVal / USD_TO_VND_EXCHANGE_RATE).toFixed(2)} USD
                                                </span>
                                              )}
                                              {hasPromo && (
                                                <span className="text-rose-600 font-bold text-[9.5px]">
                                                  -{route.promotionPercent}%
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })()}
                                        {hasPromo && (() => {
                                          const baseVal = route.ltlPricing?.weightTiers?.[3]?.price || route.price || (route.currency === 'USD' ? 6.5 : 165000);
                                          const discBase = route.currency === 'USD' ? +(baseVal * (1 - route.promotionPercent / 100)).toFixed(2) : Math.round(baseVal * (1 - route.promotionPercent / 100));
                                          return (
                                            <div className="text-[10px] text-emerald-600 font-bold text-right px-1">
                                              Giảm còn: {route.currency === 'USD' ? `${discBase}` : `${discBase.toLocaleString('vi-VN')} ₫`} / Kg
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    ) : isAirCargo ? (
                                      <div className="flex flex-col gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenTieredPricingModal(route)}
                                          className="w-full px-2.5 py-1.5 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50/90 via-white to-blue-50/70 hover:from-sky-100 hover:to-blue-100 text-slate-900 text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-1.5"
                                          title="Nhấp để cấu hình chi tiết ma trận 6 bậc giá chuẩn IATA (+100kg Base Rate)"
                                        >
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="font-mono font-bold text-xs text-sky-950 truncate">
                                                {route.currency === 'USD' ? (
                                                  `$${route.ltlPricing?.weightTiers?.[5]?.price || 2.8} – $${route.ltlPricing?.weightTiers?.[0]?.price || 5.8}`
                                                ) : (
                                                  `${(route.ltlPricing?.weightTiers?.[5]?.price || 70000).toLocaleString('vi-VN')} – ${(route.ltlPricing?.weightTiers?.[0]?.price || 145000).toLocaleString('vi-VN')} ₫`
                                                )}
                                              </span>
                                              <span className="text-[9.5px] font-bold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded-md shrink-0 border border-sky-300/60">
                                                6 Bậc Air
                                              </span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between mt-0.5">
                                              <span>
                                                Base (+100): <strong className="text-sky-900 font-bold">
                                                  {route.currency === 'USD'
                                                    ? `$${route.ltlPricing?.weightTiers?.[2]?.price || route.price || 4.2} / Kg`
                                                    : `${(route.ltlPricing?.weightTiers?.[2]?.price || route.price || 105000).toLocaleString('vi-VN')} ₫ / Kg`}
                                                </strong>
                                              </span>
                                              <span className="text-sky-700 font-bold group-hover:underline">Chi tiết ➔</span>
                                            </div>
                                          </div>
                                        </button>

                                        {/* Live Currency Conversion Tag for Air Cargo */}
                                        {(() => {
                                          const baseVal = route.ltlPricing?.weightTiers?.[2]?.price || route.price || (route.currency === 'USD' ? 4.2 : 105000);
                                          return (
                                            <div className="text-[10px] font-semibold px-0.5 flex items-center justify-between">
                                              {route.currency === 'USD' ? (
                                                <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/60">
                                                  ≈ {(baseVal * USD_TO_VND_EXCHANGE_RATE).toLocaleString('vi-VN')} ₫
                                                </span>
                                              ) : (
                                                <span className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">
                                                  ≈ ${(baseVal / USD_TO_VND_EXCHANGE_RATE).toFixed(2)} USD
                                                </span>
                                              )}
                                              {hasPromo && (
                                                <span className="text-rose-600 font-bold text-[9.5px]">
                                                  -{route.promotionPercent}%
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })()}
                                        {hasPromo && (() => {
                                          const baseVal = route.ltlPricing?.weightTiers?.[2]?.price || route.price || (route.currency === 'USD' ? 4.2 : 105000);
                                          const discBase = route.currency === 'USD' ? +(baseVal * (1 - route.promotionPercent / 100)).toFixed(2) : Math.round(baseVal * (1 - route.promotionPercent / 100));
                                          return (
                                            <div className="text-[10px] text-emerald-600 font-bold text-right px-1">
                                              Giảm còn: {route.currency === 'USD' ? `${discBase}` : `${discBase.toLocaleString('vi-VN')} ₫`} / Kg
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    ) : isLtlOrLcl ? (
                                      <div className="flex flex-col gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenTieredPricingModal(route)}
                                          className="w-full px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/70 hover:from-indigo-100 hover:to-indigo-50 text-indigo-950 text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-1.5"
                                          title="Nhấp để cấu hình chi tiết ma trận 5 bậc giá chuẩn thị trường (CBM / RT / Kg)"
                                        >
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="font-mono font-bold text-xs text-indigo-900 truncate">
                                                {route.currency === 'USD' ? (
                                                  route.ltlPricing?.pricingBasis === 'weight'
                                                    ? `$${route.ltlPricing.weightTiers[4]?.price || 14} – $${route.ltlPricing.weightTiers[0]?.price || 35}`
                                                    : `$${route.ltlPricing?.volumeTiers[4]?.price || 14} – $${route.ltlPricing?.volumeTiers[0]?.price || 35}`
                                                ) : (
                                                  route.ltlPricing?.pricingBasis === 'volume'
                                                    ? `${(route.ltlPricing.volumeTiers[4]?.price || 320000).toLocaleString('vi-VN')} – ${(route.ltlPricing.volumeTiers[0]?.price || 600000).toLocaleString('vi-VN')} ₫`
                                                    : `${(route.ltlPricing?.weightTiers[4]?.price || 1100).toLocaleString('vi-VN')} – ${(route.ltlPricing?.weightTiers[0]?.price || 2500).toLocaleString('vi-VN')} ₫`
                                                )}
                                              </span>
                                              <span className="text-[9.5px] font-bold text-indigo-700 bg-indigo-100/90 px-1.5 py-0.2 rounded-md shrink-0">
                                                5 Bậc
                                              </span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between mt-0.5">
                                              <span>
                                                Sàn: <strong className="text-slate-800">
                                                  {route.currency === 'USD'
                                                    ? `$${route.ltlPricing?.minCharge || 25} USD`
                                                    : `${(route.ltlPricing?.minCharge || (route.pricingUnit === 'CBM' ? 150000 : 100000)).toLocaleString('vi-VN')} ₫`}
                                                </strong>
                                              </span>
                                              <span className="text-indigo-600 font-semibold group-hover:underline">Chi tiết ➔</span>
                                            </div>
                                          </div>
                                        </button>
                                        
                                        {/* Live Currency Conversion Tag */}
                                        {(() => {
                                          const repPrice = route.currency === 'USD'
                                            ? (route.ltlPricing?.pricingBasis === 'weight' ? (route.ltlPricing?.weightTiers[1]?.price || 25) : (route.ltlPricing?.volumeTiers[1]?.price || 25))
                                            : (route.ltlPricing?.pricingBasis === 'weight' ? (route.ltlPricing?.weightTiers[1]?.price || 2000) : (route.ltlPricing?.volumeTiers[1]?.price || 500000));
                                          return (
                                            <div className="text-[10px] font-semibold px-0.5 flex items-center justify-between">
                                              {route.currency === 'USD' ? (
                                                <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/60">
                                                  ≈ {(repPrice * USD_TO_VND_EXCHANGE_RATE).toLocaleString('vi-VN')} ₫
                                                </span>
                                              ) : (
                                                <span className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">
                                                  ≈ ${Math.round(repPrice / USD_TO_VND_EXCHANGE_RATE).toLocaleString('en-US')} USD
                                                </span>
                                              )}
                                              {hasPromo && (
                                                <span className="text-rose-600 font-bold text-[9.5px]">
                                                  -{route.promotionPercent}%
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })()}
                                        {hasPromo && (() => {
                                          const isWeight = route.ltlPricing?.pricingBasis === 'weight';
                                          const minP = route.currency === 'USD' 
                                            ? (isWeight ? (route.ltlPricing?.weightTiers?.[4]?.price || 14) : (route.ltlPricing?.volumeTiers?.[4]?.price || 14))
                                            : (isWeight ? (route.ltlPricing?.weightTiers?.[4]?.price || 1100) : (route.ltlPricing?.volumeTiers?.[4]?.price || 320000));
                                          const maxP = route.currency === 'USD'
                                            ? (isWeight ? (route.ltlPricing?.weightTiers?.[0]?.price || 35) : (route.ltlPricing?.volumeTiers?.[0]?.price || 35))
                                            : (isWeight ? (route.ltlPricing?.weightTiers?.[0]?.price || 2500) : (route.ltlPricing?.volumeTiers?.[0]?.price || 600000));
                                          const discMin = route.currency === 'USD' ? +(minP * (1 - route.promotionPercent / 100)).toFixed(1) : Math.round(minP * (1 - route.promotionPercent / 100));
                                          const discMax = route.currency === 'USD' ? +(maxP * (1 - route.promotionPercent / 100)).toFixed(1) : Math.round(maxP * (1 - route.promotionPercent / 100));
                                          return (
                                            <div className="text-[10px] text-emerald-600 font-bold text-right px-1">
                                              Giảm còn: {route.currency === 'USD' ? `${discMin} – ${discMax}` : `${discMin.toLocaleString('vi-VN')} – ${discMax.toLocaleString('vi-VN')} ₫`}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      <div className="flex flex-col gap-1">
                                        <input
                                          type="number"
                                          value={route.price || ''}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'price', parseFloat(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full px-2.5 py-1.5 text-right bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                        />

                                        {/* Live Currency Conversion Tag */}
                                        {route.price > 0 && (
                                          <div className="text-[10px] font-semibold px-0.5 flex items-center justify-between">
                                            {route.currency === 'USD' ? (
                                              <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/60">
                                                ≈ {(route.price * USD_TO_VND_EXCHANGE_RATE).toLocaleString('vi-VN')} ₫
                                              </span>
                                            ) : (
                                              <span className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200/60">
                                                ≈ ${Math.round(route.price / USD_TO_VND_EXCHANGE_RATE).toLocaleString('en-US')} USD
                                              </span>
                                            )}
                                            {hasPromo && (
                                              <span className="text-rose-600 font-bold text-[9.5px]">
                                                -{route.promotionPercent}%
                                              </span>
                                            )}
                                          </div>
                                        )}
                                        {hasPromo && route.price > 0 && (
                                          <div className="text-[10px] text-emerald-600 font-bold text-right px-1">
                                            Giảm còn: {discountedPrice.toLocaleString('vi-VN')} {route.currency || (isOcean ? 'USD' : 'VND')}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>

                                  {/* 10. Lịch Bay & Cut-off / SLA */}
                                  <td className="p-1 align-middle">
                                    {(isAirCargo || isExpress || isLtlOrLcl) ? (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenScheduleModal(route)}
                                        className={`w-full min-h-[34px] px-2.5 py-1.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer shadow-2xs group ${
                                          route.sla
                                            ? ((isAirCargo || isExpress) ? 'bg-sky-50/90 border-sky-200 text-sky-950 font-semibold hover:bg-sky-100 hover:border-sky-300' : 'bg-indigo-50/90 border-indigo-200 text-indigo-950 font-semibold hover:bg-indigo-100 hover:border-indigo-300')
                                            : 'bg-slate-50 border-dashed border-slate-300 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                        }`}
                                        title={(isAirCargo || isExpress) ? 'Nhấp để thiết lập lịch bay & giờ cắt hàng tại ga TCS/SCSC/NCTS' : 'Nhấp để thiết lập các thứ trong tuần & thời gian cắt máng / xuất bến'}
                                      >
                                        <span className="truncate block font-semibold leading-tight">
                                          {route.sla || ((isAirCargo || isExpress) ? 'Chọn lịch & giờ bay...' : 'Chọn lịch & giờ chạy...')}
                                        </span>
                                        {(isAirCargo || isExpress) ? (
                                          <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0 group-hover:scale-110 transition-transform" />
                                        ) : (
                                          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
                                        )}
                                      </button>
                                    ) : (
                                      <input
                                        type="text"
                                        value={route.sla}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'sla', e.target.value)}
                                        placeholder="24 - 36h"
                                        className="w-full px-2 py-2 text-center bg-transparent text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                      />
                                    )}
                                  </td>

                                  {/* 10. Loại Tuyến (Direct / Transit) - Sau cột SLA (ẩn đối với Express) */}
                                  {!isExpress && (
                                    <td className="p-0 align-top">
                                      <select
                                        value={route.transitType || 'Direct'}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'transitType', e.target.value as 'Direct' | 'Transit')}
                                        className={`w-full px-2 py-2 bg-transparent text-xs font-bold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all ${
                                          route.transitType === 'Transit' ? 'text-amber-700' : 'text-slate-800'
                                        }`}
                                      >
                                        {TRANSIT_TYPE_LOV.map((opt) => (
                                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                      </select>
                                    </td>
                                  )}

                                  {/* 11. Free Dem/Det (Dành cho Container / FCL) */}
                                  {isFcl && (
                                    <td className="p-0 align-top">
                                      {(() => {
                                        const isCustom = route.freeDemDetDays === 0 || (![7, 10, 14, 21, 28].includes(route.freeDemDetDays || 14) && route.customFreeDemDetDays);
                                        const currentVal = isCustom ? 0 : (route.freeDemDetDays || 14);
                                        return (
                                          <div className="flex flex-col h-full">
                                            <select
                                              value={currentVal}
                                              onChange={(e) => {
                                                const val = parseInt(e.target.value, 10);
                                                if (val === 0) {
                                                  handleUpdateRouteRowMultiple(route.id, { freeDemDetDays: 0, customFreeDemDetDays: '' });
                                                } else {
                                                  handleUpdateRouteRowMultiple(route.id, { freeDemDetDays: val, customFreeDemDetDays: '' });
                                                }
                                              }}
                                              className="w-full px-2 py-2 bg-transparent text-slate-800 text-xs font-semibold cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                            >
                                              {FREE_DEM_DET_LOV.map((lov) => (
                                                <option key={lov.value} value={lov.value}>{lov.label}</option>
                                              ))}
                                            </select>
                                            {isCustom && (
                                              <div className="p-1 bg-amber-50/90 border-t border-amber-200">
                                                <input
                                                  type="text"
                                                  autoFocus
                                                  value={route.customFreeDemDetDays || ''}
                                                  onChange={(e) => handleUpdateRouteRow(route.id, 'customFreeDemDetDays', e.target.value)}
                                                  placeholder="Gõ số ngày..."
                                                  className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </td>
                                  )}

                                  {/* 12. Hạn Giá (Date) */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="date"
                                      value={route.validUntil || '2026-12-31'}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'validUntil', e.target.value)}
                                      className="w-full px-2 py-2 bg-transparent text-slate-800 text-xs font-medium text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all cursor-pointer"
                                      title="Thời hạn hiệu lực của mức giá này"
                                    />
                                  </td>

                                  {/* 13. Promotion (%) */}
                                  <td className="p-0 text-center align-middle">
                                    <div className="flex items-center justify-center h-full">
                                      <input
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={route.promotionPercent || 0}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'promotionPercent', Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                                        className={`w-full py-2 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all ${
                                          hasPromo 
                                            ? 'bg-rose-50 text-rose-700 font-black' 
                                            : 'bg-transparent text-slate-700'
                                        }`}
                                      />
                                    </div>
                                  </td>

                                  {/* 14. Action (Duplicate & Delete) */}
                                  <td className="p-0 text-center bg-slate-50/40 align-middle">
                                    <div className="flex items-center justify-center gap-1 px-1 py-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleDuplicateRouteRow(route.id)}
                                        className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                                        title="Nhân bản (duplicate) tuyến đường này"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteRouteRow(route.id)}
                                        className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                        title="Xóa tuyến đường này"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {(() => {
                  const isTrucking = activeCategory?.id === 'trucking';
                  const isLtlTrucking = isTrucking && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                  const isTruckingFtl = isTrucking && !isLtlTrucking;
                  const isOcean = activeCategory?.id === 'ocean' || activeModel?.id?.startsWith('sea-');
                  const isLclOcean = isOcean && (activeModel?.id?.includes('lcl') || activeModel?.name?.includes('LCL') || activeModel?.code === 'LCL');
                  const isRail = activeCategory?.id === 'rail' || activeModel?.id?.startsWith('rail-');
                  const isFcl = (isOcean && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL') || activeModel?.code === 'FCL')) || (isRail && (activeModel?.id?.includes('fcl') || activeModel?.name?.includes('FCL')));
                  const isCrossBorder = activeCategory?.id === 'cross-border' || activeCategory?.serviceType === 'Cross-border';
                  const isCrossBorderLtl = isCrossBorder && (activeModel?.id?.includes('ltl') || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                  const isCrossBorderFtl = isCrossBorder && !isCrossBorderLtl;
                  const isAir = activeCategory?.id === 'air' || activeModel?.id?.startsWith('air-');
                  const isExpress = activeCategory?.id === 'air' && (activeModel?.id === 'air-gen-exp' || activeModel?.name?.includes('Express') || activeModel?.code === 'Express');
                  const isAirCargo = isAir && !isExpress;

                  const shouldHideBlocks3And4 = isTruckingFtl ||
                    isLtlTrucking ||
                    (isOcean && isFcl) ||
                    isLclOcean ||
                    (isRail && isFcl) ||
                    (isRail && !isFcl) ||
                    isCrossBorderFtl ||
                    isCrossBorderLtl ||
                    isAir ||
                    isAirCargo ||
                    isExpress ||
                    activeCategory?.id === 'warehousing' ||
                    (activeCategory?.id === 'project' && (
                      activeModel?.id?.includes('xdock') ||
                      activeModel?.id?.includes('port') ||
                      activeModel?.name?.toLowerCase().includes('cross-dock') ||
                      activeModel?.name?.toLowerCase().includes('x-dock') ||
                      activeModel?.name?.toLowerCase().includes('cảng') ||
                      activeModel?.code?.toLowerCase().includes('port') ||
                      activeModel?.code?.toLowerCase().includes('cross-dock')
                    ));

                  if (shouldHideBlocks3And4) return null;

                  return (
                  <>
                {/* =========================================================================
                    PHẦN 3: CÁC PHỤ PHÍ MIỄN PHÍ & CÓ PHÍ (HỖ TRỢ THÊM / BỚT TÙY Ý)
                ========================================================================= */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">3</span>
                    <span>Chính Sách Phụ Phí (Miễn Phí & Có Phí Khi Phát Sinh)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Free Surcharges (0đ) */}
                    <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Phụ Phí Miễn Phí (Đã Bao Gồm 0đ)</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingFreeSurcharge(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-all cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm Phụ Phí</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500">
                        Các dịch vụ/tiện ích đã tính trọn gói không thu thêm để tạo lợi thế cạnh tranh.
                      </p>

                      {/* Inline Input Box to Add Custom Free Surcharge */}
                      {isAddingFreeSurcharge && (
                        <div className="p-2.5 bg-emerald-100/90 rounded-xl border border-emerald-300 space-y-2 animate-in fade-in duration-100">
                          <input
                            type="text"
                            autoFocus
                            placeholder="Nhập tên phụ phí miễn phí mới..."
                            value={newFreeSurchargeName}
                            onChange={(e) => setNewFreeSurchargeName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddFreeSurcharge()}
                            className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-600"
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingFreeSurcharge(false);
                                setNewFreeSurchargeName('');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={handleAddFreeSurcharge}
                              className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                            >
                              Thêm Ngay
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5 pt-0.5 max-h-72 overflow-y-auto pr-0.5">
                        {(currentData.freeSurchargeOptions || activeModel?.freeSurchargeOptions || []).map((item: string, fIdx: number) => {
                          const isChecked = currentData.freeSurcharges?.includes(item);
                          return (
                            <div
                              key={fIdx}
                              className={`group flex items-center justify-between gap-1.5 p-2 rounded-xl border transition-all ${
                                isChecked
                                  ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <label
                                onClick={() => toggleFreeSurcharge(item)}
                                className="flex items-center gap-2 cursor-pointer truncate flex-1"
                              >
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                                <span className="truncate">{item}</span>
                              </label>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFreeSurchargeOption(item);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                                title="Xóa phụ phí này khỏi danh mục"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Paid Surcharges */}
                    <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                          <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                          <span>Phụ Phí Có Phí (Tính Khi Phát Sinh Thực Tế)</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingPaidSurcharge(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-all cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm Phụ Phí</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500">
                        Tick chọn và thiết lập mức giá tham chiếu khi phát sinh yêu cầu đặc biệt.
                      </p>

                      {/* Inline Input Box to Add Custom Paid Surcharge */}
                      {isAddingPaidSurcharge && (
                        <div className="p-2.5 bg-amber-100/90 rounded-xl border border-amber-300 space-y-2 animate-in fade-in duration-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              autoFocus
                              placeholder="Tên phụ phí (VD: Phí neo xe chờ hạ hàng)..."
                              value={newPaidSurchargeName}
                              onChange={(e) => setNewPaidSurchargeName(e.target.value)}
                              className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-amber-600"
                            />
                            <input
                              type="text"
                              placeholder="Đơn giá (VD: 400,000 ₫ / Ngày)..."
                              value={newPaidSurchargePrice}
                              onChange={(e) => setNewPaidSurchargePrice(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddPaidSurcharge()}
                              className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-amber-600"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingPaidSurcharge(false);
                                setNewPaidSurchargeName('');
                                setNewPaidSurchargePrice('');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={handleAddPaidSurcharge}
                              className="px-3 py-1 text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                            >
                              Thêm Ngay
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 pt-0.5 max-h-72 overflow-y-auto pr-0.5">
                        {(currentData.paidSurcharges || []).map((surcharge) => (
                          <div
                            key={surcharge.id}
                            className={`flex items-center justify-between gap-2 p-2 rounded-xl border transition-all ${
                              surcharge.isChecked 
                                ? 'bg-amber-100/60 border-amber-300 text-amber-950 font-semibold' 
                                : 'bg-white border-slate-200 text-slate-600 opacity-80'
                            }`}
                          >
                            <label 
                              onClick={() => togglePaidSurcharge(surcharge.id)}
                              className="flex items-center gap-2 cursor-pointer truncate flex-1"
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                surcharge.isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {surcharge.isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="truncate">{surcharge.name}</span>
                            </label>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <input
                                type="text"
                                disabled={!surcharge.isChecked}
                                value={surcharge.priceText}
                                onChange={(e) => updatePaidSurchargePrice(surcharge.id, e.target.value)}
                                className={`w-32 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right ${
                                  surcharge.isChecked ? 'text-amber-900 focus:border-amber-500' : 'text-slate-400 bg-slate-50'
                                }`}
                              />

                              <button
                                type="button"
                                onClick={() => handleDeletePaidSurcharge(surcharge.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Xóa phụ phí này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    PHẦN 4: CÁC DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) (PHÂN LOẠI THEO HẠNG MỤC & NHẬP ĐƠN GIÁ)
                ========================================================================= */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">4</span>
                        <span>Dịch Vụ Giá Trị Gia Tăng Đi Kèm (VAS) ({activeVasItems.filter((v) => v.isChecked).length}/{activeVasItems.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tick chọn các dịch vụ VAS có khả năng đáp ứng và thiết lập đơn giá tham chiếu minh bạch.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingVas(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm VAS Mới</span>
                    </button>
                  </div>

                  {/* Inline Input Box to Add Custom Categorized VAS */}
                  {isAddingVas && (
                    <div className="p-3.5 bg-indigo-50/90 rounded-2xl border border-indigo-200 space-y-2.5 animate-in fade-in duration-100">
                      <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Khai Báo Dịch Vụ Giá Trị Gia Tăng (VAS) Mới</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Tên dịch vụ VAS *
                          </label>
                          <input
                            type="text"
                            autoFocus
                            placeholder="VD: Kiểm đếm chi tiết từng SKU / Serial..."
                            value={newVasName}
                            onChange={(e) => setNewVasName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Hạng mục phân loại
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Dịch Vụ Bốc Xếp & Đóng Gói..."
                            value={newVasCategory}
                            onChange={(e) => setNewVasCategory(e.target.value)}
                            list="vas-category-suggestions"
                            className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600"
                          />
                          <datalist id="vas-category-suggestions">
                            <option value="Dịch Vụ Bốc Xếp & Đóng Gói" />
                            <option value="Phương Tiện & Thiết Bị Phụ Trợ" />
                            <option value="Giám Sát, An Ninh & Chứng Từ" />
                            <option value="Quy Định, Pháp Lý & Bảo Hiểm" />
                            <option value="Thủ Tục Cảng & Chứng Từ Hàng Hải" />
                            <option value="Đóng Gói & Xử Lý Sân Bay" />
                            <option value="Dịch Vụ Khai Thác Kho Bãi" />
                          </datalist>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Đơn giá tham chiếu
                          </label>
                          <input
                            type="text"
                            placeholder="VD: 300,000 ₫ / Điểm, 150,000 ₫ / Pallet, 0 ₫..."
                            value={newVasPrice}
                            onChange={(e) => setNewVasPrice(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Tag nhãn ngắn gọn (Hiển thị badge)
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Kiểm đếm SKU, Cẩu bãi..."
                            value={newVasTag}
                            onChange={(e) => setNewVasTag(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Mô tả chi tiết nội dung VAS
                        </label>
                        <input
                          type="text"
                          placeholder="Mô tả tóm tắt quy trình hoặc phạm vi cung cấp..."
                          value={newVasDesc}
                          onChange={(e) => setNewVasDesc(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddVasOption()}
                          className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingVas(false);
                            setNewVasName('');
                            setNewVasCategory('');
                            setNewVasDesc('');
                            setNewVasPrice('');
                            setNewVasTag('');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleAddVasOption}
                          className="px-3 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          Thêm Ngay
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Grouped VAS by Category */}
                  {(() => {
                    const groupedVas = activeVasItems.reduce((acc, item) => {
                      const cat = item.category || 'Dịch Vụ Phụ Trợ & Tiện Ích';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    }, {} as Record<string, CapabilityVasItem[]>);

                    return (
                      <div className="space-y-4 pt-1">
                        {Object.entries(groupedVas).map(([categoryName, items], gIdx) => {
                          const checkedInGroup = items.filter((i) => i.isChecked).length;
                          return (
                            <div key={gIdx} className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5">
                              {/* Category Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                    {categoryName}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 text-[10.5px] font-bold bg-white text-indigo-700 border border-indigo-200/80 rounded-full shadow-2xs">
                                  Đã chọn: {checkedInGroup}/{items.length}
                                </span>
                              </div>

                              {/* Grid of Items in this Category */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                                {items.map((vasItem) => (
                                  <div
                                    key={vasItem.id}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 rounded-xl border transition-all ${
                                      vasItem.isChecked
                                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-medium shadow-2xs ring-1 ring-indigo-500/20'
                                        : 'bg-white border-slate-200 text-slate-600 opacity-85 hover:opacity-100 hover:border-slate-300'
                                    }`}
                                  >
                                    {/* Left: Checkbox & Info */}
                                    <label
                                      onClick={() => toggleVasItem(vasItem.id)}
                                      className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0"
                                    >
                                      <div
                                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                          vasItem.isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                        }`}
                                      >
                                        {vasItem.isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className={`text-xs font-bold leading-tight ${vasItem.isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {vasItem.name}
                                          </span>
                                          {vasItem.tag && (
                                            <span className="px-1.5 py-0.2 text-[9.5px] font-bold bg-indigo-100/80 text-indigo-800 border border-indigo-200 rounded shrink-0">
                                              {vasItem.tag}
                                            </span>
                                          )}
                                        </div>
                                        {vasItem.desc && (
                                          <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                                            {vasItem.desc}
                                          </p>
                                        )}
                                      </div>
                                    </label>

                                    {/* Right: Price Input & Delete Button */}
                                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pl-6 sm:pl-0">
                                      <div className="relative">
                                        <input
                                          type="text"
                                          disabled={!vasItem.isChecked}
                                          value={vasItem.priceText}
                                          onChange={(e) => updateVasPrice(vasItem.id, e.target.value)}
                                          placeholder="Đơn giá tham chiếu..."
                                          title="Mức giá tham chiếu khi khách hàng yêu cầu dịch vụ này"
                                          className={`w-36 sm:w-40 px-2.5 py-1.5 bg-white border rounded-lg text-xs font-bold text-right transition-all ${
                                            vasItem.isChecked
                                              ? 'border-indigo-300 text-indigo-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs'
                                              : 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
                                          }`}
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteVas(vasItem.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                        title="Xóa VAS này"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </>
            );
          })()}

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedModelIds[activeModel.id]) {
                        toggleModelCheck(activeModel.id);
                      }
                    }}
                    className="px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                  >
                    Xác Nhận Cập Nhật Dịch Vụ Này
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[400px]">
                <Package className="w-12 h-12 text-slate-300 mb-3" />
                <p className="font-bold text-slate-700 text-sm">Chưa chọn dịch vụ nào</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Vui lòng bấm vào bất kỳ dịch vụ nào từ cây danh mục bên trái để khai báo năng lực và biểu giá.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL XEM TRƯỚC VÀ XÁC NHẬN NHẬP DỮ LIỆU TỪ FILE EXCEL
      ========================================================================= */}
      {excelImportPreview && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <FileSpreadsheet className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight flex items-center gap-2">
                    <span>Xác Nhận Nhập Tuyến Đường & Biểu Giá Từ File Excel</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tệp tin tải lên: <span className="text-emerald-400 font-mono font-medium">{excelImportPreview.fileName}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExcelImportPreview(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-500 block font-medium">Tổng số dòng đọc được</span>
                  <span className="text-lg font-black text-slate-800">{excelImportPreview.routes.length + excelImportPreview.errorCount}</span>
                </div>
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                  <span className="text-[11px] text-emerald-700 block font-bold">Dòng hợp lệ sẵn sàng</span>
                  <span className="text-lg font-black text-emerald-700">{excelImportPreview.validCount}</span>
                </div>
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                  <span className="text-[11px] text-amber-700 block font-bold">Dòng lỗi / Bỏ qua</span>
                  <span className="text-lg font-black text-amber-700">{excelImportPreview.errorCount}</span>
                </div>
              </div>

              {/* Warnings List if any */}
              {excelImportPreview.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Cảnh báo dữ liệu trong file:</span>
                  </div>
                  <ul className="text-[11px] text-amber-700 list-disc list-inside space-y-0.5 max-h-24 overflow-y-auto">
                    {excelImportPreview.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Import Mode Selection */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-900 block">
                  Chọn phương thức cập nhật vào bảng biểu giá:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label 
                    onClick={() => setExcelImportMode('replace')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      excelImportMode === 'replace'
                        ? 'bg-white border-indigo-500 shadow-2xs ring-1 ring-indigo-500/20 text-indigo-950 font-bold'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="excelImportMode"
                      checked={excelImportMode === 'replace'}
                      onChange={() => setExcelImportMode('replace')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Ghi đè toàn bộ (Replace)</div>
                      <div className="text-[10.5px] text-slate-500 font-normal">Xóa toàn bộ {currentData.routes?.length || 0} tuyến cũ và thay bằng {excelImportPreview.validCount} tuyến mới từ file</div>
                    </div>
                  </label>

                  <label 
                    onClick={() => setExcelImportMode('append')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      excelImportMode === 'append'
                        ? 'bg-white border-indigo-500 shadow-2xs ring-1 ring-indigo-500/20 text-indigo-950 font-bold'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="excelImportMode"
                      checked={excelImportMode === 'append'}
                      onChange={() => setExcelImportMode('append')}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Thêm nối tiếp (Append)</div>
                      <div className="text-[10.5px] text-slate-500 font-normal">Giữ nguyên {currentData.routes?.length || 0} tuyến hiện tại và thêm {excelImportPreview.validCount} tuyến vào cuối bảng</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Xem trước danh sách ({excelImportPreview.routes.length} tuyến hợp lệ):
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10.5px] font-bold text-slate-700 uppercase">
                        <th className="py-2 px-2 text-center w-8">#</th>
                        <th className="py-2 px-2">Mã Tuyến</th>
                        <th className="py-2 px-2">Tuyến Đường</th>
                        <th className="py-2 px-2">Điểm Đi</th>
                        <th className="py-2 px-2">Điểm Đến</th>
                        <th className="py-2 px-2">Loại Thùng / Phương Tiện</th>
                        <th className="py-2 px-2">Tải Trọng</th>
                        <th className="py-2 px-2 text-right">Đơn Giá</th>
                        <th className="py-2 px-2">SLA</th>
                        <th className="py-2 px-2">Hạn Giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {excelImportPreview.routes.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-1.5 px-2 text-center text-slate-400 font-mono text-[10.5px]">{i + 1}</td>
                          <td className="py-1.5 px-2 font-mono font-bold text-indigo-700 text-[10.5px]">{r.routeCode}</td>
                          <td className="py-1.5 px-2 font-bold text-slate-900">{r.route}</td>
                          <td className="py-1.5 px-2 text-slate-600">{r.origin}</td>
                          <td className="py-1.5 px-2 text-slate-600">{r.destination}</td>
                          <td className="py-1.5 px-2 text-slate-700 truncate max-w-[120px]">{r.truckBodyType?.split(' (')[0] || r.vehicleType}</td>
                          <td className="py-1.5 px-2 text-slate-700 truncate max-w-[100px]">{r.truckTonnage?.split(' (')[0] || '-'}</td>
                          <td className="py-1.5 px-2 text-right font-bold text-emerald-700">{r.price.toLocaleString('vi-VN')} ₫</td>
                          <td className="py-1.5 px-2 text-slate-600">{r.sla}</td>
                          <td className="py-1.5 px-2 text-slate-600 font-mono text-[10.5px]">{r.validUntil}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setExcelImportPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmExcelImport}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận Nhập ({excelImportPreview.validCount} Tuyến)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THIẾT LẬP LỊCH CHẠY HÀNG & THỜI GIAN XUẤT BẾN (LTL / LCL)
      ========================================================================= */}
      {/* =========================================================================
          MODAL: THIẾT LẬP LỊCH CHẠY HÀNG & THỜI GIAN XUẤT BẾN / BAY (LTL / LCL / AIR)
      ========================================================================= */}
      {scheduleModalData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${scheduleModalData.isAirCargo ? 'bg-sky-600 shadow-sky-600/20' : 'bg-indigo-600 shadow-indigo-600/20'} text-white flex items-center justify-center shadow-md shrink-0`}>
                  {scheduleModalData.isAirCargo ? <Plane className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {scheduleModalData.isAirCargo
                      ? 'Cấu Hình Lịch Bay & Giờ Cắt Hàng Ga (Air / Express)'
                      : (scheduleModalData.isLcl
                        ? 'Cấu Hình Lịch Gom Hàng & Cắt Máng CFS (LCL)'
                        : 'Cấu Hình Lịch Chạy & Giờ Xuất Bến (LTL)')}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tuyến: <strong className="text-indigo-700">{scheduleModalData.routeName}</strong> ({scheduleModalData.origin} ⇄ {scheduleModalData.destination})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalData(null)}
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
                  {SCHEDULE_PRESETS.map((preset, pIdx) => {
                    const isSelected = preset.days.every(d => scheduleModalData.selectedDays.includes(d)) && 
                      scheduleModalData.selectedDays.length === preset.days.length;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setScheduleModalData({
                            ...scheduleModalData,
                            selectedDays: [...preset.days],
                          });
                        }}
                        className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                          isSelected
                            ? (scheduleModalData.isAirCargo ? 'bg-sky-600 border-sky-600 text-white shadow-xs' : 'bg-indigo-600 border-indigo-600 text-white shadow-xs')
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. LOV Các Thứ Trong Tuần (7 Ngày) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    2. {scheduleModalData.isAirCargo ? 'Các ngày bay trong tuần' : 'Các ngày chạy trong tuần'} ({scheduleModalData.selectedDays.length}/7 ngày)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (scheduleModalData.selectedDays.length === 7) {
                        setScheduleModalData({ ...scheduleModalData, selectedDays: [] });
                      } else {
                        setScheduleModalData({ ...scheduleModalData, selectedDays: DAYS_OF_WEEK_LOV.map(d => d.name) });
                      }
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {scheduleModalData.selectedDays.length === 7 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DAYS_OF_WEEK_LOV.map((day) => {
                    const isChecked = scheduleModalData.selectedDays.includes(day.name);
                    return (
                      <label
                        key={day.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none ${
                          isChecked 
                            ? (scheduleModalData.isAirCargo ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-2xs ring-1 ring-sky-500/20' : 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs ring-1 ring-indigo-500/20') 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let current = [...scheduleModalData.selectedDays];
                            if (e.target.checked) {
                              if (!current.includes(day.name)) current.push(day.name);
                            } else {
                              current = current.filter(d => d !== day.name);
                            }
                            const sorted = DAYS_OF_WEEK_LOV.filter(d => current.includes(d.name)).map(d => d.name);
                            setScheduleModalData({ ...scheduleModalData, selectedDays: sorted });
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{day.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Thời Gian Cắt Hàng Ga / CFS / Xuất Bến */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  {scheduleModalData.isAirCargo
                    ? '3. Thời gian cắt hàng tại ga TCS / SCSC / NCTS (Cut-off time)'
                    : (scheduleModalData.isLcl
                      ? '3. Thời gian cắt hàng CFS / Cut-off time'
                      : '3. Thời gian xe xuất bến')}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(scheduleModalData.isAirCargo ? AIR_CUTOFF_TIMES_LOV : (scheduleModalData.isLcl ? LCL_DEPARTURE_TIMES_LOV : DEPARTURE_TIMES_LOV)).map((dt, dtIdx) => {
                    const isChosen = scheduleModalData.departureTime === dt.time;
                    return (
                      <button
                        key={dtIdx}
                        type="button"
                        onClick={() => {
                          setScheduleModalData({
                            ...scheduleModalData,
                            departureTime: dt.time,
                          });
                        }}
                        className={`px-2.5 py-1.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                          isChosen
                            ? (scheduleModalData.isAirCargo ? 'bg-sky-600 border-sky-600 text-white font-bold shadow-2xs' : 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-2xs')
                            : 'bg-slate-50 border-slate-200 text-slate-700 font-medium hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold">{dt.time}</span>
                        <span className={`text-[10px] block truncate ${isChosen ? 'text-sky-100' : 'text-slate-500'}`}>
                          {dt.label.replace(`${dt.time} `, '')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {scheduleModalData.isAirCargo ? 'Hoặc nhập giờ Cut-off ga khác:' : (scheduleModalData.isLcl ? 'Hoặc nhập giờ Cut-off khác:' : 'Hoặc nhập giờ khác:')}
                  </span>
                  <input
                    type="time"
                    value={scheduleModalData.departureTime || (scheduleModalData.isAirCargo ? '18:00' : (scheduleModalData.isLcl ? '17:00' : '20:00'))}
                    onChange={(e) => setScheduleModalData({ ...scheduleModalData, departureTime: e.target.value })}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Xem Trước Chuỗi Kết Quả (Live Preview) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Xem trước hiển thị trên biểu giá:
                </span>
                <div className={`text-xs font-bold ${scheduleModalData.isAirCargo ? 'text-sky-900 border-sky-200' : 'text-indigo-900 border-indigo-200'} bg-white border rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs`}>
                  {scheduleModalData.isAirCargo ? <Plane className="w-4 h-4 text-sky-600 shrink-0" /> : <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />}
                  <span>
                    {(() => {
                      const days = scheduleModalData.selectedDays;
                      const time = scheduleModalData.departureTime;
                      const prefix = scheduleModalData.isAirCargo ? 'Cắt TCS' : (scheduleModalData.isLcl ? 'Cắt CFS' : 'Xuất bến');
                      if (days.length === 7) return `Hàng ngày${time ? ` (${prefix} ${time})` : ''}`;
                      if (days.length > 0) return `${days.join(', ')}${time ? ` (${prefix} ${time})` : ''}`;
                      if (time) return `${prefix} ${time}`;
                      return 'Chưa chọn lịch chạy';
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setScheduleModalData(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleSaveScheduleModal}
                className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white ${scheduleModalData.isAirCargo ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'} rounded-xl transition-all shadow-md cursor-pointer`}
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Lưu Lịch {scheduleModalData.isAirCargo ? 'Bay' : (scheduleModalData.isLcl ? 'CFS' : 'Chạy')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CẤU HÌNH MA TRẬN BẬC GIÁ CHUẨN (EXPRESS / AIR CARGO / LTL / LCL)
      ========================================================================= */}
      {tieredPricingModalData && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[90vh]">
            {/* Modal Header */}
            <div className={`px-6 py-4 ${tieredPricingModalData.isExpress ? 'bg-gradient-to-r from-amber-50 via-white to-orange-50/30' : (tieredPricingModalData.isAirCargo ? 'bg-gradient-to-r from-sky-50 via-white to-blue-50/30' : 'bg-gradient-to-r from-indigo-50 via-white to-purple-50/30')} border-b border-slate-200 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${tieredPricingModalData.isExpress ? 'bg-amber-600 shadow-amber-600/20' : (tieredPricingModalData.isAirCargo ? 'bg-sky-600 shadow-sky-600/20' : 'bg-indigo-600 shadow-indigo-600/20')} text-white flex items-center justify-center shadow-md shrink-0`}>
                  {tieredPricingModalData.isExpress ? <Zap className="w-5 h-5" /> : (tieredPricingModalData.isAirCargo ? <Plane className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>
                      {tieredPricingModalData.isExpress
                        ? 'Ma Trận 6 Bậc Đơn Giá Chuyển Phát Nhanh Express (+45kg Base)'
                        : (tieredPricingModalData.isAirCargo
                          ? 'Ma Trận 6 Bậc Đơn Giá Hàng Không Chuẩn IATA (+100kg Base)'
                          : (tieredPricingModalData.isLcl
                            ? 'Ma Trận 5 Bậc Giá Hàng Lẻ CFS / Đóng Ghép (LCL)'
                            : 'Ma Trận 5 Bậc Giá Chuẩn Thị Trường (LTL)'))}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${tieredPricingModalData.isExpress ? 'bg-amber-100 text-amber-900 border border-amber-300/60' : (tieredPricingModalData.isAirCargo ? 'bg-sky-100 text-sky-900 border border-sky-300/60' : 'bg-indigo-100 text-indigo-800')} rounded-full`}>
                      {tieredPricingModalData.currency === 'USD' ? 'USD ($)' : 'VND (₫)'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tuyến: <strong className={tieredPricingModalData.isExpress ? 'text-amber-700' : (tieredPricingModalData.isAirCargo ? 'text-sky-700' : 'text-indigo-700')}>{tieredPricingModalData.routeName}</strong> ({tieredPricingModalData.origin} ⇄ {tieredPricingModalData.destination})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTieredPricingModalData(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Express Volumetric Conversion Rate Banner */}
              {tieredPricingModalData.isExpress && (
                <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950 font-bold">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Tỷ lệ quy đổi thể tích Express: 1 CBM = 200 Kg (D × R × C / 5.000)</span>
                  </div>
                  <span className="text-amber-800 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200 text-[11px] shrink-0">
                    Tính cước theo Chargeable Weight (CW)
                  </span>
                </div>
              )}

              {/* Air Cargo Volumetric Conversion Rate Banner */}
              {tieredPricingModalData.isAirCargo && (
                <div className="p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-950 font-bold">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Tỷ lệ quy đổi thể tích Air Cargo: 1 CBM = 167 Kg (D × R × C / 6.000)</span>
                  </div>
                  <span className="text-sky-800 bg-white/80 px-2.5 py-1 rounded-lg border border-sky-200 text-[11px] shrink-0">
                    Tính cước theo Chargeable Weight (CW)
                  </span>
                </div>
              )}

              {/* Basis Switch & Tabs (Only if not Air / Express) */}
              {(!tieredPricingModalData.isAirCargo && !tieredPricingModalData.isExpress) ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTieredPricingActiveTab('weight')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        tieredPricingActiveTab === 'weight'
                          ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>
                        {tieredPricingModalData.currency === 'USD'
                          ? 'Biểu Giá Trọng Lượng ($ / Kg)'
                          : 'Biểu Giá Theo Trọng Lượng (Kg)'}
                      </span>
                      {tieredPricingModalData.pricingConfig.pricingBasis === 'weight' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đang là đơn vị mặc định của tuyến" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setTieredPricingActiveTab('volume')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        tieredPricingActiveTab === 'volume'
                          ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>
                        {tieredPricingModalData.currency === 'USD'
                          ? 'Biểu Giá Thể Tích ($ / CBM hoặc RT)'
                          : 'Biểu Giá Theo Thể Tích (CBM)'}
                      </span>
                      {tieredPricingModalData.pricingConfig.pricingBasis === 'volume' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đang là đơn vị mặc định của tuyến" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pr-2 text-xs">
                    <span className="text-slate-500 font-medium">Đơn vị chính:</span>
                    <select
                      value={tieredPricingModalData.pricingConfig.pricingBasis}
                      onChange={(e) => {
                        const newBasis = e.target.value as 'weight' | 'volume';
                        setTieredPricingModalData({
                          ...tieredPricingModalData,
                          pricingConfig: {
                            ...tieredPricingModalData.pricingConfig,
                            pricingBasis: newBasis,
                          },
                        });
                        setTieredPricingActiveTab(newBasis);
                      }}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="volume">Tính theo {tieredPricingModalData.isLcl ? 'CBM / RT' : 'CBM'}</option>
                      <option value="weight">Tính theo Kg</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className={`flex items-center justify-between p-2.5 ${tieredPricingModalData.isExpress ? 'bg-amber-50/70 border-amber-200' : (tieredPricingModalData.isRailLcl ? 'bg-indigo-50/70 border-indigo-200' : 'bg-sky-50/70 border-sky-200')} rounded-2xl border text-xs`}>
                  <div className={`flex items-center gap-2 font-bold ${tieredPricingModalData.isExpress ? 'text-amber-950' : (tieredPricingModalData.isRailLcl ? 'text-indigo-950' : 'text-sky-950')}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Đơn vị tính cước tiêu chuẩn: <strong>{tieredPricingModalData.isRailLcl ? 'Kilogram (Kg) - Hàng lẻ Đường sắt' : 'Kilogram (Kg) / Chargeable Weight'}</strong></span>
                  </div>
                  <span className={`text-[11px] font-bold ${tieredPricingModalData.isExpress ? 'text-amber-800 border-amber-300' : (tieredPricingModalData.isRailLcl ? 'text-indigo-800 border-indigo-300' : 'text-sky-700 border-sky-200')} bg-white px-2 py-0.5 rounded-md border`}>
                    {tieredPricingModalData.isExpress ? '6 Bậc Express (+45kg Base)' : (tieredPricingModalData.isRailLcl ? '5 Khung Bậc Trọng Lượng Chuẩn' : '6 Bậc Tiêu Chuẩn (+100kg Base)')}
                  </span>
                </div>
              )}

              {/* Min Charge Setting */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Min
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Cước Sàn Tối Thiểu (Min Charge)
                    </span>
                    <span className="text-[11px] text-amber-800 font-medium">
                      {tieredPricingModalData.isExpress
                        ? 'Áp dụng cho kiện hàng tài liệu/hàng mẫu nhỏ dưới 1kg (Cước sàn tối thiểu)'
                        : (tieredPricingModalData.isAirCargo
                          ? 'Áp dụng cho lô hàng kiện nhỏ dưới 45kg (Mức cước tối thiểu mỗi e-AWB)'
                          : (tieredPricingModalData.isRailLcl
                            ? 'Áp dụng cho mỗi vận đơn đường sắt (Railway Bill) / Lô hàng nhỏ hơn ngưỡng sàn'
                            : (tieredPricingModalData.isLcl
                              ? 'Áp dụng cho mỗi House Bill (HBL) / Lô hàng nhỏ hơn ngưỡng min'
                              : 'Áp dụng khi kiện hàng siêu nhỏ / tổng cước theo đơn giá thấp hơn mức sàn')))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <input
                    type="number"
                    value={tieredPricingModalData.pricingConfig.minCharge || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setTieredPricingModalData({
                        ...tieredPricingModalData,
                        pricingConfig: {
                          ...tieredPricingModalData.pricingConfig,
                          minCharge: val,
                        },
                      });
                    }}
                    placeholder={tieredPricingModalData.currency === 'USD' ? (tieredPricingModalData.isExpress ? '15' : (tieredPricingModalData.isAirCargo ? '45' : '25')) : '100000'}
                    className="w-32 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-right text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-amber-900">
                    {tieredPricingModalData.currency === 'USD' ? (tieredPricingModalData.isExpress ? '$ / Lô' : (tieredPricingModalData.isAirCargo ? '$ / AWB' : '$ / HBL')) : '₫ / Lô'}
                  </span>
                </div>
              </div>

              {/* Tab 1: Weight Tiers (Kg) */}
              {(tieredPricingActiveTab === 'weight' || tieredPricingModalData.isAirCargo || tieredPricingModalData.isExpress) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {tieredPricingModalData.isExpress
                        ? `Bảng 6 Khung Bậc Trọng Lượng Chuyển Phát Nhanh Express (${tieredPricingModalData.currency === 'USD' ? '$/Kg' : '₫/Kg'})`
                        : (tieredPricingModalData.isAirCargo
                          ? `Bảng 6 Khung Bậc Trọng Lượng Chuẩn IATA (${tieredPricingModalData.currency === 'USD' ? '$/Kg' : '₫/Kg'})`
                          : `Bảng 5 Khung Bậc Trọng Lượng Chuẩn (${tieredPricingModalData.currency === 'USD' ? '$/Kg' : '₫/Kg'})`)}
                    </span>
                    {tieredPricingModalData.isExpress ? (
                      <button
                        type="button"
                        onClick={() => {
                          const isUsd = tieredPricingModalData.currency === 'USD';
                          const base = tieredPricingModalData.pricingConfig.weightTiers[3]?.price || (isUsd ? 6.5 : 165000);
                          const newTiers = [
                            { ...tieredPricingModalData.pricingConfig.weightTiers[0], price: isUsd ? Number((base * 2.15).toFixed(2)) : Math.round(base * 2.15) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[1], price: isUsd ? Number((base * 1.54).toFixed(2)) : Math.round(base * 1.54) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[2], price: isUsd ? Number((base * 1.23).toFixed(2)) : Math.round(base * 1.23) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[3], price: base },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[4], price: isUsd ? Number((base * 0.86).toFixed(2)) : Math.round(base * 0.86) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[5], price: isUsd ? Number((base * 0.75).toFixed(2)) : Math.round(base * 0.75) },
                          ];
                          setTieredPricingModalData({
                            ...tieredPricingModalData,
                            pricingConfig: {
                              ...tieredPricingModalData.pricingConfig,
                              weightTiers: newTiers,
                            },
                          });
                        }}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-800 hover:underline cursor-pointer"
                      >
                        ⚡ Tự động tính 6 bậc từ mốc +45kg Base
                      </button>
                    ) : tieredPricingModalData.isAirCargo ? (
                      <button
                        type="button"
                        onClick={() => {
                          const isUsd = tieredPricingModalData.currency === 'USD';
                          const base = tieredPricingModalData.pricingConfig.weightTiers[2]?.price || (isUsd ? 4.2 : 105000);
                          const newTiers = [
                            { ...tieredPricingModalData.pricingConfig.weightTiers[0], price: isUsd ? Number((base * 1.38).toFixed(2)) : Math.round(base * 1.38) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[1], price: isUsd ? Number((base * 1.14).toFixed(2)) : Math.round(base * 1.14) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[2], price: base },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[3], price: isUsd ? Number((base * 0.85).toFixed(2)) : Math.round(base * 0.85) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[4], price: isUsd ? Number((base * 0.76).toFixed(2)) : Math.round(base * 0.76) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[5], price: isUsd ? Number((base * 0.67).toFixed(2)) : Math.round(base * 0.67) },
                          ];
                          setTieredPricingModalData({
                            ...tieredPricingModalData,
                            pricingConfig: {
                              ...tieredPricingModalData.pricingConfig,
                              weightTiers: newTiers,
                            },
                          });
                        }}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
                      >
                        ✈ Tự động tính 6 bậc từ mốc +100kg Base
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const isUsd = tieredPricingModalData.currency === 'USD';
                          const base = tieredPricingModalData.pricingConfig.weightTiers[1]?.price || (isUsd ? 0.15 : 2000);
                          const newTiers = [
                            { ...tieredPricingModalData.pricingConfig.weightTiers[0], price: isUsd ? Number((base * 1.35).toFixed(2)) : Math.round(base * 1.25) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[1], price: base },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[2], price: isUsd ? Number((base * 0.8).toFixed(2)) : Math.round(base * 0.825) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[3], price: isUsd ? Number((base * 0.65).toFixed(2)) : Math.round(base * 0.675) },
                            { ...tieredPricingModalData.pricingConfig.weightTiers[4], price: isUsd ? Number((base * 0.5).toFixed(2)) : Math.round(base * 0.55) },
                          ];
                          setTieredPricingModalData({
                            ...tieredPricingModalData,
                            pricingConfig: {
                              ...tieredPricingModalData.pricingConfig,
                              weightTiers: newTiers,
                            },
                          });
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                      >
                        ⚡ Tự động tính giảm dần từ bậc 2
                      </button>
                    )}
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          <th className="py-2.5 px-3 w-12 text-center">Bậc</th>
                          <th className="py-2.5 px-3 min-w-[140px]">Khoảng Trọng Lượng</th>
                          <th className="py-2.5 px-3 min-w-[150px]">Loại Hàng Khuyên Dùng</th>
                          <th className="py-2.5 px-3 min-w-[150px] text-right">
                            Đơn Giá ({tieredPricingModalData.currency === 'USD' ? '$ / Kg' : '₫ / Kg'})
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {tieredPricingModalData.pricingConfig.weightTiers.map((tier, tIdx) => (
                          <tr key={tier.id} className="hover:bg-indigo-50/20 transition-colors">
                            <td className="py-2.5 px-3 text-center font-bold text-indigo-700 font-mono">
                              #{tIdx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              <span className={`px-2 py-0.5 rounded-lg border ${tier.rangeLabel.includes('Base') ? (tieredPricingModalData.isExpress ? 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold' : 'bg-sky-100 text-sky-900 border-sky-300 font-extrabold') : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                {tier.rangeLabel}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-medium">
                              {tier.subLabel}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <input
                                  type="number"
                                  step={tieredPricingModalData.currency === 'USD' ? '0.01' : '100'}
                                  value={tier.price || ''}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const nextTiers = [...tieredPricingModalData.pricingConfig.weightTiers];
                                    nextTiers[tIdx] = { ...nextTiers[tIdx], price: val };
                                    setTieredPricingModalData({
                                      ...tieredPricingModalData,
                                      pricingConfig: {
                                        ...tieredPricingModalData.pricingConfig,
                                        weightTiers: nextTiers,
                                      },
                                    });
                                  }}
                                  placeholder="0"
                                  className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-right text-xs font-bold text-indigo-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="font-semibold text-slate-500">
                                  {tieredPricingModalData.currency === 'USD' ? '$' : '₫'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Volume Tiers (CBM / RT) - Not shown for Air Cargo & Express */}
              {!tieredPricingModalData.isAirCargo && !tieredPricingModalData.isExpress && tieredPricingActiveTab === 'volume' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {tieredPricingModalData.currency === 'USD'
                        ? 'Bảng 5 Khung Bậc Thể Tích / RT Chuẩn ($ / CBM hoặc RT)'
                        : 'Bảng 5 Khung Bậc Thể Tích Chuẩn (₫ / CBM)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const isUsd = tieredPricingModalData.currency === 'USD';
                        const base = tieredPricingModalData.pricingConfig.volumeTiers[1]?.price || (isUsd ? 25 : 500000);
                        const newTiers = [
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[0], price: isUsd ? Number((base * 1.4).toFixed(2)) : Math.round(base * 1.2) },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[1], price: base },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[2], price: isUsd ? Number((base * 0.8).toFixed(2)) : Math.round(base * 0.84) },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[3], price: isUsd ? Number((base * 0.68).toFixed(2)) : Math.round(base * 0.76) },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[4], price: isUsd ? Number((base * 0.56).toFixed(2)) : Math.round(base * 0.64) },
                        ];
                        setTieredPricingModalData({
                          ...tieredPricingModalData,
                          pricingConfig: {
                            ...tieredPricingModalData.pricingConfig,
                            volumeTiers: newTiers,
                          },
                        });
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                    >
                      ⚡ Tự động tính giảm dần từ bậc 2
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          <th className="py-2.5 px-3 w-12 text-center">Bậc</th>
                          <th className="py-2.5 px-3 min-w-[140px]">Khoảng Thể Tích</th>
                          <th className="py-2.5 px-3 min-w-[150px]">Loại Hàng Khuyên Dùng</th>
                          <th className="py-2.5 px-3 min-w-[150px] text-right">
                            Đơn Giá ({tieredPricingModalData.currency === 'USD' ? '$ / CBM (RT)' : '₫ / CBM'})
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {tieredPricingModalData.pricingConfig.volumeTiers.map((tier, tIdx) => (
                          <tr key={tier.id} className="hover:bg-indigo-50/20 transition-colors">
                            <td className="py-2.5 px-3 text-center font-bold text-indigo-700 font-mono">
                              #{tIdx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-slate-800 border border-slate-200">
                                {tier.rangeLabel}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-medium">
                              {tier.subLabel}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <input
                                  type="number"
                                  step={tieredPricingModalData.currency === 'USD' ? '0.01' : '1000'}
                                  value={tier.price || ''}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const nextTiers = [...tieredPricingModalData.pricingConfig.volumeTiers];
                                    nextTiers[tIdx] = { ...nextTiers[tIdx], price: val };
                                    setTieredPricingModalData({
                                      ...tieredPricingModalData,
                                      pricingConfig: {
                                        ...tieredPricingModalData.pricingConfig,
                                        volumeTiers: nextTiers,
                                      },
                                    });
                                  }}
                                  placeholder="0"
                                  className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-right text-xs font-bold text-indigo-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="font-semibold text-slate-500">
                                  {tieredPricingModalData.currency === 'USD' ? '$' : '₫'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTieredPricingModalData(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleSaveTieredPricingModal}
                className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white ${tieredPricingModalData.isExpress ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' : (tieredPricingModalData.isAirCargo ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20')} rounded-xl transition-all shadow-md cursor-pointer`}
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Lưu Ma Trận Bậc Giá</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL CHI TIẾT CƠ SỞ KHO: ALBUM ẢNH, 2-COLUMN TECH SPECS, PHỤ PHÍ & VAS
      ========================================================================= */}
      {warehouseDetailModalData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl xl:max-w-7xl h-[92vh] min-h-[660px] max-h-[920px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* 1. Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black tracking-tight text-white">
                      {warehouseDetailModalData.warehouseName}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      Mã: {warehouseDetailModalData.warehouseCode}
                    </span>
                    {warehouseDetailModalData.isColdStorage && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-cyan-300" />
                        Kho Lạnh
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{warehouseDetailModalData.address}, {warehouseDetailModalData.province}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-indigo-300 font-medium">Chi tiết Specs, Album ảnh, Phụ phí & Dịch vụ VAS</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWarehouseDetailModalData(null)}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer border border-slate-700/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Top Tab Bar - 3 Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-2.5 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto">
                {/* Tab 1: Album ảnh thực tế */}
                <button
                  type="button"
                  onClick={() => setWarehouseDetailActiveTab('photos')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    warehouseDetailActiveTab === 'photos'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>1. Album Ảnh Thực Tế</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    warehouseDetailActiveTab === 'photos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {warehouseDetailModalData.photos.length}
                  </span>
                </button>

                {/* Tab 2: Thông số kỹ thuật, vận hành, tiện ích */}
                <button
                  type="button"
                  onClick={() => setWarehouseDetailActiveTab('techSpecs')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    warehouseDetailActiveTab === 'techSpecs'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>2. Thông Số Kỹ Thuật, Vận Hành, Tiện Ích</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    warehouseDetailActiveTab === 'techSpecs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {getWarehouseTechSpecCategories(warehouseDetailModalData.modelId || activeModel?.id, activeCargoGroup?.id).length} Nhóm
                  </span>
                </button>

                {/* Tab 3: Giá, phụ phí và vas */}
                <button
                  type="button"
                  onClick={() => setWarehouseDetailActiveTab('pricing')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    warehouseDetailActiveTab === 'pricing'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>3. Giá, Phụ Phí và VAS</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    warehouseDetailActiveTab === 'pricing' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {warehouseDetailModalData.paidSurcharges.filter(s => s.isChecked).length + warehouseDetailModalData.vasItems.filter(v => v.isChecked).length} mục
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Modal Body */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-slate-50/40">
              {/* TAB 1: ALBUM ẢNH KHO THEO TỪNG PHÂN LOẠI GÓC ẢNH GỢI Ý SẴN */}
              {warehouseDetailActiveTab === 'photos' && (() => {
                const currentPhotoSlots = getWarehousePhotoSlots(warehouseDetailModalData.modelId || activeModel?.id, activeCargoGroup?.id);
                const uploadedCount = currentPhotoSlots.filter(s => 
                  warehouseDetailModalData.photos.some(p => p.tag === s.label || p.slotKey === s.key)
                ).length;

                return (
                  <div className="flex-1 min-h-0 p-6 overflow-y-auto space-y-5">
                    <input
                      type="file"
                      ref={warehousePhotoUploadRef}
                      accept="image/*"
                      onChange={handleUploadWarehousePhotos}
                      className="hidden"
                    />

                    {/* Banner Tiêu Đề & Tiến Độ Hoàn Thiện */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <Camera className="w-4 h-4 text-indigo-600" />
                          <span>Hình Ảnh Thực Tế Theo Từng Phân Loại Góc Ảnh</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tải ảnh thực tế vào đúng từng ô phân loại bên dưới tương ứng với mô hình kho này.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                          Đã hoàn thành: <span className="text-indigo-600 font-extrabold">{uploadedCount}</span> / {currentPhotoSlots.length} góc ảnh
                        </span>
                      </div>
                    </div>

                    {/* Pre-defined Slot Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4.5">
                      {currentPhotoSlots.map((slot) => {
                        const matchingPhoto = warehouseDetailModalData.photos.find(
                          (p) => p.tag === slot.label || p.slotKey === slot.key
                        );

                        return (
                          <div
                            key={slot.key}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col transition-all hover:border-slate-300"
                          >
                            {/* Slot Header / Fixed Caption */}
                            <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-100">
                              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <span className="text-sm">{slot.icon}</span>
                                <span className="truncate">{slot.label}</span>
                              </h5>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5" title={slot.description}>
                                {slot.description}
                              </p>
                            </div>

                            {/* Slot Upload / Preview Area */}
                            <div className="p-3.5 flex-1 flex flex-col justify-center">
                              {matchingPhoto ? (
                                <div className="space-y-2">
                                  {/* Uploaded Image Preview */}
                                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                    <img
                                      src={matchingPhoto.url}
                                      alt={slot.label}
                                      className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Action buttons on hover */}
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActivePhotoUploadSlot({ key: slot.key, label: slot.label });
                                          warehousePhotoUploadRef.current?.click();
                                        }}
                                        className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                                      >
                                        <Upload className="w-3 h-3" />
                                        <span>Đổi ảnh</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setWarehouseDetailModalData((prev) => {
                                            if (!prev) return prev;
                                            return {
                                              ...prev,
                                              photos: prev.photos.filter((p) => p.tag !== slot.label && p.slotKey !== slot.key),
                                            };
                                          });
                                        }}
                                        className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                                        title="Xóa ảnh này"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Note input */}
                                  <input
                                    type="text"
                                    value={matchingPhoto.name === slot.label ? '' : matchingPhoto.name}
                                    onChange={(e) => {
                                      const newName = e.target.value;
                                      setWarehouseDetailModalData((prev) => {
                                        if (!prev) return prev;
                                        return {
                                          ...prev,
                                          photos: prev.photos.map((p) =>
                                            (p.tag === slot.label || p.slotKey === slot.key) ? { ...p, name: newName } : p
                                          ),
                                        };
                                      });
                                    }}
                                    placeholder="Ghi chú chi tiết góc chụp (tùy chọn)..."
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                              ) : (
                                /* Empty Upload Dropzone Box */
                                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center min-h-[145px]">
                                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                                    <Camera className="w-4 h-4" />
                                  </div>
                                  <p className="text-[11px] font-semibold text-slate-500 mb-2.5">
                                    Chưa có ảnh cho phân loại này
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActivePhotoUploadSlot({ key: slot.key, label: slot.label });
                                      warehousePhotoUploadRef.current?.click();
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                                  >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Tải Ảnh Lên</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 2: 2-COLUMN MASTER-DETAIL TECH SPECS (CHỈ HIỂN THỊ CÁC THÔNG SỐ TƯƠNG ỨNG VỚI LOẠI KHO) */}
              {warehouseDetailActiveTab === 'techSpecs' && (() => {
                const currentModelId = warehouseDetailModalData.modelId || activeModel?.id;
                const techCategories = getWarehouseTechSpecCategories(currentModelId, activeCargoGroup?.id);
                const activeCatId = techCategories.some(c => c.id === warehouseTechActiveCategory)
                  ? warehouseTechActiveCategory
                  : (techCategories[0]?.id || 'structure');

                return (
                  <div className="flex-1 min-h-0 flex overflow-hidden">
                    {/* Left Column: Category Navigation (Tailored for this warehouse type) */}
                    <div className="w-64 shrink-0 bg-slate-50/90 border-r border-slate-200 p-3 overflow-y-auto space-y-1.5">
                      <div className="px-2 pb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Nhóm Thông Số Kỹ Thuật
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200">
                          {techCategories.length} Nhóm
                        </span>
                      </div>

                      {techCategories.map((cat) => {
                        const isActive = activeCatId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setWarehouseTechActiveCategory(cat.id)}
                            className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                                : 'hover:bg-slate-200/70 text-slate-700'
                            }`}
                          >
                            <span className="text-base mt-0.5">{cat.icon}</span>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                {cat.label}
                              </p>
                              <p className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {cat.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: Active Category Form Fields */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                      {/* =========================================================================
                          A. KHO THƯỜNG TIÊU CHUẨN (STANDARD GENERAL WAREHOUSE)
                      ========================================================================= */}
                      {activeCatId === 'structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Xây Dựng & Mặt Sàn Kho
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Khai báo các thông số cơ bản về độ cao, tải trọng và xử lý bề mặt sàn.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Chiều cao thông thủy trần (Clear Height)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="3"
                                  max="30"
                                  value={warehouseDetailModalData.techSpecs.clearHeight || 10.5}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, clearHeight: val } }) : prev);
                                  }}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Mét (m)</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Kho chuẩn Grade A thường từ 9.0m - 14.0m</span>
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Tải trọng thiết kế mặt sàn (Floor Load)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="1"
                                  max="20"
                                  value={warehouseDetailModalData.techSpecs.floorLoad || 5.0}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, floorLoad: val } }) : prev);
                                  }}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Tấn / m²</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Tiêu chuẩn lưu kho thông thường: 3 - 5 tấn/m²</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Loại hoàn thiện mặt sàn (Floor Type)
                            </label>
                            <select
                              value={warehouseDetailModalData.techSpecs.floorType || 'Bê tông xoa Hardener chống bụi'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, floorType: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                              <option value="Bê tông xoa Hardener chống bụi">Bê tông xoa phẳng phủ phụ gia Hardener (Chống bụi tiêu chuẩn)</option>
                              <option value="Bê tông sơn phủ Epoxy chống tĩnh điện">Bê tông sơn phủ Epoxy 3 lớp (Chống ẩm, kháng khuẩn, bụi tuyệt đối)</option>
                              <option value="Bê tông siêu phẳng Superflat chuyên dụng VNA">Bê tông siêu phẳng Superflat (Phù hợp xe nâng tầm cao VNA)</option>
                              <option value="Bê tông thường láng xi măng">Bê tông láng xi măng thông thường</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Khẩu độ bước cột (Column Grid)
                              </label>
                              <input
                                type="text"
                                value={warehouseDetailModalData.techSpecs.columnGrid || '12m × 18m'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, columnGrid: val } }) : prev);
                                }}
                                placeholder="VD: 12m × 18m, 18m × 24m hoặc Không cột"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Hệ thống thông gió làm mát
                              </label>
                              <input
                                type="text"
                                value={warehouseDetailModalData.techSpecs.ventilation || 'Quả cầu hút nhiệt & Lam gió tự nhiên'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, ventilation: val } }) : prev);
                                }}
                                placeholder="VD: Quạt trần HVLS, Quả cầu xoay, Quạt hút..."
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'racking' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📦</span> Hệ Thống Giá Kệ & Sức Chứa Pallet
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Chi tiết cấu hình kệ Racking, số tầng và giới hạn tải trọng mỗi vị trí pallet.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">
                              Các loại kệ Racking trang bị tại cơ sở:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Kệ Selective', 'Kệ Drive-in', 'Kệ Double Deep', 'Kệ Narrow Aisle (VNA)', 'Kệ Sàn Tầng Lửng (Mezzanine)', 'Sàn xếp khối Floor Block'].map((rack) => {
                                const list = warehouseDetailModalData.techSpecs.rackingTypes || [];
                                const isChecked = list.includes(rack);
                                return (
                                  <label
                                    key={rack}
                                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const updated = e.target.checked
                                          ? [...list, rack]
                                          : list.filter(r => r !== rack);
                                        setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingTypes: updated } }) : prev);
                                      }}
                                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-xs">{rack}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Số tầng kệ lưu trữ (Racking Levels)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="15"
                                value={warehouseDetailModalData.techSpecs.rackingLevels || 5}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingLevels: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Tải trọng thiết kế tối đa mỗi Pallet
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="50"
                                  min="200"
                                  max="3000"
                                  value={warehouseDetailModalData.techSpecs.palletLoadLimit || 1000}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, palletLoadLimit: val } }) : prev);
                                  }}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Kg / Pallet</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Quy cách kích thước Pallet tương thích:
                            </label>
                            <input
                              type="text"
                              value={(warehouseDetailModalData.techSpecs.compatiblePalletSizes || []).join(', ')}
                              onChange={(e) => {
                                const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, compatiblePalletSizes: arr } }) : prev);
                              }}
                              placeholder="VD: 1.0m × 1.2m (ISO standard), 1.1m × 1.1m"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'dock' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚛</span> Cửa Dock Xuất Nhập & Sân Bãi Xe Container
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Cấu hình năng lực tiếp nhận xe tải lớn, container 20ft/40ft và cầu nâng thủy lực.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Số lượng cửa Dock bốc xếp
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={warehouseDetailModalData.techSpecs.dockDoorsCount || 6}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dockDoorsCount: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="space-y-2 pt-4">
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={warehouseDetailModalData.techSpecs.hasDockLeveler ?? true}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasDockLeveler: checked } }) : prev);
                                  }}
                                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-xs font-bold text-slate-800">Trang bị Cầu nâng thủy lực (Dock Leveler)</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Không gian sân bãi quay đầu xe Container
                            </label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.yardTurnaround || 'Sân bê tông rộng 35m, xe cont 40ft/45ft quay đầu dễ dàng 24/7'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, yardTurnaround: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Khung giờ tiếp nhận xe tải & Container
                            </label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.operatingHoursTrucks || 'Tiếp nhận 24/7, không bị cấm giờ tải trọng'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, operatingHoursTrucks: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> Hệ Thống Phòng Cháy Chữa Cháy (PCCC) & An Ninh
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Tiêu chuẩn an toàn PCCC và camera an ninh 24/7.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Hệ thống PCCC trang bị tại kho
                            </label>
                            <select
                              value={warehouseDetailModalData.techSpecs.fireProtectionSystem || 'PCCC tự động Sprinkler (Đã nghiệm thu PCCC)'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fireProtectionSystem: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                              <option value="PCCC tự động Sprinkler (Đã nghiệm thu PCCC)">Hệ thống PCCC tự động đầu phun Sprinkler (Chuẩn QCVN 06:2022)</option>
                              <option value="Họng nước vách tường & Hệ thống cảnh báo khói tự động">Họng nước vách tường & Đầu báo khói báo nhiệt tự động</option>
                              <option value="Bình bọt xách tay & Tiêu lệnh cơ bản">Bình chữa cháy xách tay và tiêu lệnh nội bộ</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Số biên bản / Giấy phép nghiệm thu PCCC (Nếu có)
                            </label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.fireProtectionApprovalNo || 'Số 148/TD-PCCC cấp bởi Cảnh sát PCCC'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fireProtectionApprovalNo: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Camera giám sát an ninh (CCTV)
                            </label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.cctvSurveillance || 'CCTV 24/7 phủ kín lối đi & cửa dock, lưu trữ video 60 ngày'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, cctvSurveillance: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Lực lượng an ninh & Bảo vệ
                            </label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.securityGuards || 'Bảo vệ chuyên nghiệp 2 lớp 24/7, cổng barie kiểm soát'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, securityGuards: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'wms' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>💻</span> Hệ Thống WMS Quản Lý Kho & Công Nghệ Số Hóa
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Số hóa vận hành, quản lý SKU và cổng thông tin khách hàng.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Tên phần mềm Quản lý Kho (WMS) đang ứng dụng
                            </label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.wmsSoftwareName || 'WMS Real-time Cloud'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, wmsSoftwareName: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">
                              Công nghệ quét mã & Nhận diện:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['Barcode 1D/2D', 'Mã QR Code', 'RFID UHF Tự Động', 'Pick-to-Light'].map((tech) => {
                                const list = warehouseDetailModalData.techSpecs.scanningTechnologies || [];
                                const isChecked = list.includes(tech);
                                return (
                                  <label
                                    key={tech}
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const updated = e.target.checked ? [...list, tech] : list.filter(t => t !== tech);
                                        setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, scanningTechnologies: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{tech}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasApiIntegration ?? true}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasApiIntegration: checked } }) : prev);
                                }}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Tích hợp API với ERP</span>
                                <span className="text-[11px] text-slate-500">Hỗ trợ REST API đồng bộ đơn hàng với SAP, Oracle, Odoo...</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.realtimeWebPortal ?? true}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, realtimeWebPortal: checked } }) : prev);
                                }}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Web Portal cho Khách hàng</span>
                                <span className="text-[11px] text-slate-500">Theo dõi tồn kho real-time 24/7.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cert' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📜</span> Giấy Phép, Tiêu Chuẩn Chất Lượng & Bảo Hiểm
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Các chứng nhận quốc tế chứng minh năng lực vận hành.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">
                              Các chứng nhận tiêu chuẩn chất lượng cơ sở đạt được:
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['ISO 9001:2015', 'ISO 14001', 'LEED Gold', 'OHSAS 18001'].map((cert) => {
                                const list = warehouseDetailModalData.techSpecs.certifications || [];
                                const isChecked = list.includes(cert);
                                return (
                                  <label
                                    key={cert}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const updated = e.target.checked ? [...list, cert] : list.filter(c => c !== cert);
                                        setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, certifications: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{cert}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasFullInsurance ?? true}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFullInsurance: checked } }) : prev);
                              }}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-emerald-950 block">Bảo hiểm kho bãi & Trách nhiệm dân sự 100%</span>
                              <span className="text-[11px] text-emerald-800">Cơ sở được mua bảo hiểm cháy nổ bắt buộc và bảo hiểm trách nhiệm trông coi hàng hóa 100%.</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          B. KHO LẠNH & KHO MÁT (COLD STORAGE)
                      ========================================================================= */}
                      {activeCatId === 'cold_temperature' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>❄️</span> Kiểm Soát Dải Nhiệt Độ & Cụm Máy Lạnh
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Dải nhiệt độ, dàn lạnh, cảm biến IoT và máy phát điện dự phòng ATS.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Dải nhiệt độ duy trì</label>
                              <input
                                type="text"
                                value={warehouseDetailModalData.techSpecs.temperatureRange || '-25°C ~ -18°C (Đông) / +2°C ~ +8°C (Mát)'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, temperatureRange: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Thương hiệu máy nén & dàn lạnh</label>
                              <input
                                type="text"
                                value={warehouseDetailModalData.techSpecs.coolingSystemBrand || 'Bitzer (Đức) / Dàn lạnh Guentner'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, coolingSystemBrand: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasAutoDataLogger ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasAutoDataLogger: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Cảm biến IoT & Data Logger</span>
                                <span className="text-[11px] text-slate-500">Tự động ghi biểu đồ nhiệt độ và gửi cảnh báo SMS/Email 24/7.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasBackupGeneratorAts ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasBackupGeneratorAts: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Máy phát điện tự động ATS</span>
                                <span className="text-[11px] text-slate-500">Tự động đóng điện ATS trong vòng 15 giây khi mất điện lưới.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cold_structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Panel & Vỏ Kho Cách Nhiệt
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Panel PIR/PU, sưởi nền chống đông cứng và phòng đệm giữ nhiệt Anteroom.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Loại Panel cách nhiệt vỏ kho</label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.insulationPanelType || 'Panel PIR chống cháy độ dày 125mm - 150mm'}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, insulationPanelType: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasUnderfloorHeating ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasUnderfloorHeating: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Sưởi nền chống đông băng</span>
                                <span className="text-[11px] text-slate-500">Hệ thống sưởi dưới đáy bê tông chống phù nề nứt sàn lạnh.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasAnteroomFastDoor ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasAnteroomFastDoor: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Phòng đệm & Cửa cuốn nhanh</span>
                                <span className="text-[11px] text-slate-500">Phòng đệm Anteroom và cửa trượt cách nhiệt tốc độ cao.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cold_racking' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📦</span> Giá Kệ Kho Lạnh & Quản Lý FIFO/FEFO
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Giá kệ chuyên dụng âm nhiệt và phần mềm quản lý hạn dùng hàng thực phẩm/nông sản.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số tầng kệ kho lạnh</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.rackingLevels || 6}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingLevels: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Tải trọng pallet kho lạnh (kg)</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.palletLoadLimit || 1200}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, palletLoadLimit: parseInt(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasFefoFifoWms ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFefoFifoWms: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">WMS quản lý hạn sử dụng FEFO / FIFO tự động</span>
                              <span className="text-[11px] text-slate-500">Tự động cảnh báo cận date, ưu tiên xuất hàng theo hạn sử dụng và số lô sản xuất (Batch/Lot).</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'cold_dock' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚛</span> Cửa Dock Lạnh & Đệm Khí Dock Shelter
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Tiếp nhận xe cont lạnh không bị thoát nhiệt ra môi trường ngoài.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng cửa Dock lạnh</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.dockDoorsCount || 8}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dockDoorsCount: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="pt-4 space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={warehouseDetailModalData.techSpecs.hasDockShelter ?? true}
                                  onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasDockShelter: e.target.checked } }) : prev)}
                                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-xs font-bold text-slate-800">Trùm đệm khí cửa cont (Dock Shelter)</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cold_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC Kho Lạnh & An Toàn Vận Hành
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              PCCC Sprinkler đường ống khô và chốt mở cửa thoát hiểm khẩn cấp.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasEmergencyChamberRelease ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasEmergencyChamberRelease: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Chốt an toàn mở cửa từ bên trong có sưởi nhiệt</span>
                              <span className="text-[11px] text-slate-500">Bảo đảm an toàn tuyệt đối cho nhân viên vận hành bên trong buồng lạnh âm sâu.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'cold_cert' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📜</span> Chứng Nhận An Toàn Thực Phẩm & Dược Phẩm
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              HACCP, ISO 22000, GDP Dược phẩm và bảo hiểm suy giảm chất lượng.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['HACCP', 'ISO 22000', 'BRC Global Standard', 'GDP Dược Phẩm', 'GSP', 'VietGAP'].map((cert) => {
                              const list = warehouseDetailModalData.techSpecs.certifications || [];
                              const isChecked = list.includes(cert);
                              return (
                                <label
                                  key={cert}
                                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                    isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const updated = e.target.checked ? [...list, cert] : list.filter(c => c !== cert);
                                      setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, certifications: updated } }) : prev);
                                    }}
                                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span>{cert}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          C. KHO HÀNG NGUY HIỂM & HÓA CHẤT (HAZMAT STORAGE)
                      ========================================================================= */}
                      {activeCatId === 'haz_license' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>☣️</span> Giấy Phép & Phân Nhóm Hóa Chất Được Lưu Kho
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Giấy phép Sở Công Thương / Cục Hóa Chất và các Class nguy hiểm.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Số Giấy phép lưu trữ hóa chất</label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.hazmatLicenseNo || 'Số 89/GP-HC do Sở Công Thương cấp'}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hazmatLicenseNo: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">Các Class nguy hiểm được phép lưu kho:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['Class 2 (Khí gas)', 'Class 3 (Chất lỏng dễ cháy)', 'Class 4 (Chất rắn dễ cháy)', 'Class 5 (Chất oxy hóa)', 'Class 8 (Chất ăn mòn)', 'Class 9 (Hàng nguy hiểm khác)'].map((cls) => {
                                const list = warehouseDetailModalData.techSpecs.permittedHazmatClasses || [];
                                const isChecked = list.includes(cls);
                                return (
                                  <label
                                    key={cls}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const updated = e.target.checked ? [...list, cls] : list.filter(c => c !== cls);
                                        setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, permittedHazmatClasses: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>{cls}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'haz_structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Cách Ly & Rãnh Chống Tràn Hóa Chất
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Sàn kháng axit/kiềm, rãnh gom sự cố và tường ngăn cách ly chống cháy.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasSpillContainment ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasSpillContainment: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Rãnh thu gom hóa chất và hố ga sự cố (Spill containment)</span>
                                <span className="text-[11px] text-slate-500">Ngăn chặn 100% rủi ro hóa chất tràn đổ ra cống thoát nước và môi trường xung quanh.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'haz_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC Chuyên Dụng Bọt Foam / Khí CO2
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Hệ thống chữa cháy chuyên dụng cho hóa chất và quạt thông gió chống nổ.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasExplosionProofFans ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasExplosionProofFans: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Quạt thông gió chống cháy nổ (Explosion-proof) 24/7</span>
                              <span className="text-[11px] text-slate-500">Hút khí độc và hơi dung môi liên tục, ngăn ngừa tạo môi trường nổ.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'haz_ppe' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🦺</span> Ứng Phó Sự Cố & Trang Bị Bảo Hộ (PPE)
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Trạm rửa mắt khẩn cấp, bộ Spill kit và nhân sự có chứng chỉ an toàn hóa chất.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasEmergencyEyewashShower ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasEmergencyEyewashShower: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Bồn rửa mắt & Vòi tắm khẩn cấp (Emergency Eyewash)</span>
                                <span className="text-[11px] text-slate-500">Sẵn sàng tại các vị trí lối thoát hiểm kho hóa chất.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasCertifiedHazmatStaff ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasCertifiedHazmatStaff: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">100% Nhân sự có Chứng chỉ Huấn luyện An toàn Hóa chất</span>
                                <span className="text-[11px] text-slate-500">Đào tạo định kỳ theo Nghị định 113/2017/NĐ-CP.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'haz_security' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📜</span> An Ninh & Bảo Hiểm Ô Nhiễm Môi Trường
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Bảo hiểm trách nhiệm bồi thường sự cố môi trường và camera an ninh 24/7.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasEnvironmentalInsurance ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasEnvironmentalInsurance: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Bảo hiểm trách nhiệm ô nhiễm môi trường & Cháy nổ hóa chất</span>
                              <span className="text-[11px] text-slate-500">Bồi thường thiệt hại bên thứ ba và xử lý sự cố tràn đổ hóa chất.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {/* =========================================================================
                          D. KHO NGOẠI QUAN (BONDED WAREHOUSE)
                      ========================================================================= */}
                      {activeCatId === 'bon_customs' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏛️</span> Tiêu Chuẩn Hải Quan & Khu Biệt Lập
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Chi cục Hải quan quản lý, số quyết định thành lập và niêm phong biệt lập.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Chi cục Hải quan quản lý trực tiếp</label>
                              <input
                                type="text"
                                value={warehouseDetailModalData.techSpecs.customsAuthorityName || 'Chi cục Hải quan Cửa khẩu Cảng Cát Lái'}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, customsAuthorityName: e.target.value } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số QĐ thành lập kho ngoại quan</label>
                              <input
                                type="text"
                                value={warehouseDetailModalData.techSpecs.bondedDecisionNo || 'Số 1205/QĐ-TCHQ'}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, bondedDecisionNo: e.target.value } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasCustomsSealingArea ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasCustomsSealingArea: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Hàng rào cách ly kiên cố & Cửa niêm chì Hải quan</span>
                              <span className="text-[11px] text-slate-500">Đạt chuẩn giám sát theo quy định của Tổng cục Hải quan.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'bon_structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Kho & Sân Bãi Container Ngoại Quan
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Chiều cao, tải trọng sàn và khoảng cách kết nối tới cảng biển/cửa khẩu.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Cự ly tới Cảng biển / Cửa khẩu (km)</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.distanceToPortKm || 3.5}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, distanceToPortKm: parseFloat(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Chiều cao trần (m)</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.clearHeight || 11.5}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, clearHeight: parseFloat(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'bon_racking' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📦</span> Quản Lý Lưu Trữ Theo Tờ Khai Hải Quan
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Phân chia khu vực lưu trữ theo từng tờ khai và bàn kiểm hóa HQ.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số tầng kệ Racking</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.rackingLevels || 5}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingLevels: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Tải trọng pallet (kg)</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.palletLoadLimit || 1000}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, palletLoadLimit: parseInt(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'bon_cctv' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📹</span> Camera Giám Sát Hải Quan & Dữ Liệu VASSCM
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Camera 3 lớp lưu trữ tối thiểu 12 tháng và kết nối hệ thống VASSCM.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasCustomsDirectCctvFeed ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasCustomsDirectCctvFeed: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Truyền luồng hình ảnh Camera 24/7 trực tiếp về Chi cục HQ</span>
                                <span className="text-[11px] text-slate-500">Camera 3 lớp bao quát 100% cổng ra vào, cửa kho và từng dãy kệ hàng.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasVasscmConnected ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasVasscmConnected: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">WMS kết nối Hệ thống Giám sát Tự động Hải quan (VASSCM)</span>
                                <span className="text-[11px] text-slate-500">Tự động đồng bộ trạng thái thông quan và trừ lùi tờ khai điện tử.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'bon_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC & An Ninh Bảo Vệ Kho Ngoại Quan
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              PCCC nghiệm thu và cổng kiểm soát bảo vệ barie 2 lớp 24/7.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Hệ thống PCCC</label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.fireProtectionSystem || 'PCCC tự động Sprinkler (Đã nghiệm thu PCCC)'}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fireProtectionSystem: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          E. KHO TMĐT / FULFILLMENT
                      ========================================================================= */}
                      {activeCatId === 'ful_capacity' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>⚡</span> Năng Lực Xử Lý Đơn Hàng & Pick-Pack
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Công suất xử lý đơn/ngày, số bàn đóng gói và SLA bàn giao đơn vị vận chuyển.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Công suất xử lý tối đa (Đơn / Ngày)</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.dailyOrderCapacity || 12000}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dailyOrderCapacity: parseInt(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng bàn đóng gói (Packing Stations)</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.packingStationCount || 16}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, packingStationCount: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Cam kết SLA bàn giao đơn hàng</label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.fulfillmentSlaHours || 'Đóng gói & Bàn giao ĐVVC trong vòng 12 giờ'}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fulfillmentSlaHours: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'ful_tech' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>💻</span> Tích Hợp Đa Sàn TMĐT & WMS/OMS
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Tự động kết nối API Shopee, TikTok Shop, Lazada và quét mã từng sản phẩm.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">Các sàn TMĐT đã tích hợp sẵn API:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['Shopee', 'TikTok Shop', 'Lazada', 'Tiki', 'Shopify', 'WooCommerce'].map((platform) => {
                                const list = warehouseDetailModalData.techSpecs.connectedEcommercePlatforms || ['Shopee', 'TikTok Shop', 'Lazada'];
                                const isChecked = list.includes(platform);
                                return (
                                  <label
                                    key={platform}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const updated = e.target.checked ? [...list, platform] : list.filter(p => p !== platform);
                                        setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, connectedEcommercePlatforms: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{platform}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasItemBarcodeVerification ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasItemBarcodeVerification: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Quét Barcode kiểm tra từng món hàng (Item-level Scan)</span>
                              <span className="text-[11px] text-slate-500">Giảm tỷ lệ đóng nhầm hàng xuống dưới 0.05%.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'ful_reverse' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔄</span> Xử Lý Hàng Hoàn Trả (Reverse Logistics)
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Khu vực kiểm tra ngoại quan, phân loại và nhập lại tồn kho hàng hoàn.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasReverseLogisticsArea ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasReverseLogisticsArea: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Bàn chuyên trách kiểm tra hàng hoàn & Nhập lại kho</span>
                              <span className="text-[11px] text-slate-500">Chụp ảnh đối soát bưu phẩm hư hỏng, cập nhật tồn kho real-time.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'ful_dock' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚛</span> Cửa Giao Nhận Nhanh Đơn Vị Vận Chuyển
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Khu vực tiếp nhận xe tải nhỏ, xe van và nhân viên lấy hàng hỏa tốc.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng cửa giao nhận xe van/xe tải</label>
                              <input
                                type="number"
                                value={warehouseDetailModalData.techSpecs.dockDoorsCount || 6}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dockDoorsCount: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'ful_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC & Giám Sát An Ninh Bàn Đóng Gói
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Hệ thống camera soi từng bàn đóng hàng và PCCC tự động.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Camera soi bàn đóng gói (CCTV Packing)</label>
                            <input
                              type="text"
                              value={warehouseDetailModalData.techSpecs.cctvSurveillance || 'Camera Full HD soi 100% từng bàn đóng gói, lưu trữ 60 ngày'}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, cctvSurveillance: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          F. KHO TỰ QUẢN (SELF-STORAGE)
                      ========================================================================= */}
                      {activeCatId === 'self_units' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚪</span> Quy Cách Khoang Sàn Phân Lô
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Dải diện tích & thể tích khoang sàn tự quản và hệ thống cửa khóa riêng.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">Các kích thước khoang phân lô có sẵn:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['Khoang 1m³ (Mini)', 'Khoang 3m³ (Nhỏ)', 'Khoang 6m³ (Vừa)', 'Khoang 12m³ (Lớn)', 'Khoang 20m³ (Đại)', 'Khoang 30m³ (Doanh nghiệp)'].map((vol) => {
                                const list = warehouseDetailModalData.techSpecs.unitVolumeRanges || ['Khoang 1m³ (Mini)', 'Khoang 3m³ (Nhỏ)', 'Khoang 6m³ (Vừa)', 'Khoang 12m³ (Lớn)'];
                                const isChecked = list.includes(vol);
                                return (
                                  <label
                                    key={vol}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const updated = e.target.checked ? [...list, vol] : list.filter(v => v !== vol);
                                        setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, unitVolumeRanges: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{vol}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'self_access' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔑</span> Ra Vào Tự Do 24/7 & Khóa Độc Lập
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Kiểm soát vào ra bằng thẻ từ/vân tay và khách hàng tự giữ khóa riêng.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.has247CardAccess ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, has247CardAccess: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Cổng kiểm soát ra vào 24/7 bằng Thẻ từ / Vân tay / Mã PIN</span>
                                <span className="text-[11px] text-slate-500">Khách hàng chủ động đến lấy/cất đồ bất kỳ lúc nào kể cả ngày lễ, ban đêm.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasIndependentKeyLock ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasIndependentKeyLock: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Khách hàng giữ chìa khóa/mã số độc lập 100%</span>
                                <span className="text-[11px] text-slate-500">Nhân viên kho không giữ khóa, đảm bảo tính riêng tư tuyệt đối.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'self_amenities' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🧹</span> Tiện Ích Nội Bộ & Vật Tư Đóng Gói
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Xe đẩy bốc dỡ nội bộ miễn phí và máy hút ẩm chống ẩm mốc.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasFreeHandlingTrolleys ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFreeHandlingTrolleys: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Xe đẩy hàng 4 bánh & Xe nâng tay miễn phí</span>
                                <span className="text-[11px] text-slate-500">Sẵn sàng tại lối vào để khách hàng di chuyển đồ đạc dễ dàng.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={warehouseDetailModalData.techSpecs.hasDehumidifierClimateControl ?? true}
                                onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasDehumidifierClimateControl: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Hệ thống máy hút ẩm & Kiểm soát không khí sạch</span>
                                <span className="text-[11px] text-slate-500">Bảo vệ tài sản, sách vở, hồ sơ và đồ gia dụng không bị ẩm mốc.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'self_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC & Bảo Hiểm Tài Sản Khoang Tự Quản
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              PCCC tự động Sprinkler tại từng khoang và bảo hiểm tài sản cá nhân.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={warehouseDetailModalData.techSpecs.hasFullInsurance ?? true}
                              onChange={(e) => setWarehouseDetailModalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFullInsurance: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Bảo hiểm cháy nổ & Mất mát tài sản khoang tự quản</span>
                              <span className="text-[11px] text-slate-500">Được bảo hiểm 100% theo hợp đồng thuê khoang.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {/* NHÓM TIỆN ÍCH MIỄN PHÍ ĐÃ DI CHUYỂN TỪ TAB 3 SANG TAB 2 */}
                      {activeCatId === 'utilities' && (
                        <div className="space-y-5 max-w-3xl animate-in fade-in duration-200">
                          <div className="border-b border-slate-200 pb-3.5 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                                <span>🎁</span> Tiện Ích & Dịch Vụ Miễn Phí (Bao Gồm Trong Giá Thuê)
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">
                                Các dịch vụ phụ trợ, hạ tầng cơ sở và tiện ích được cung cấp miễn phí 100% cho khách hàng thuê kho.
                              </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
                              {warehouseDetailModalData.freeSurcharges.length} Tiện ích đã kích hoạt
                            </span>
                          </div>

                          {/* DANH SÁCH TIỆN ÍCH ĐANG ÁP DỤNG */}
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 shadow-2xs">
                            <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Đang Cung Cấp Miễn Phí ({warehouseDetailModalData.freeSurcharges.length}):</span>
                            </h5>
                            {warehouseDetailModalData.freeSurcharges.length === 0 ? (
                              <p className="text-xs text-slate-500 italic py-2">
                                Chưa có tiện ích miễn phí nào được chọn. Hãy tick chọn các tiện ích đề xuất bên dưới hoặc tự thêm mới.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2.5">
                                {warehouseDetailModalData.freeSurcharges.map((fName, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-2 bg-white text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs group hover:border-emerald-300 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>{fName}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setWarehouseDetailModalData(prev => prev ? ({
                                          ...prev,
                                          freeSurcharges: prev.freeSurcharges.filter(f => f !== fName)
                                        }) : prev);
                                      }}
                                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors ml-0.5"
                                      title="Xóa tiện ích này"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* BẢNG CHỌN TIỆN ÍCH TIÊU CHUẨN 3PL */}
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                {warehouseDetailModalData.isBondedStorage
                                  ? (warehouseDetailModalData.isColdStorage
                                      ? 'Tiện Ích Miễn Phí Kho Ngoại Quan Lạnh & Kiểm Dịch (Tick để bật / tắt):'
                                      : (warehouseDetailModalData.isChemicalStorage
                                          ? 'Tiện Ích Miễn Phí Kho Ngoại Quan Hóa Chất (Tick để bật / tắt):'
                                          : 'Tiện Ích Miễn Phí Kho Ngoại Quan & CFS Tiêu Chuẩn (Tick để bật / tắt):'))
                                  : (warehouseDetailModalData.isColdStorage
                                      ? 'Tiện Ích Tiêu Chuẩn Chuỗi Lạnh (Tick để bật / tắt):'
                                      : (warehouseDetailModalData.isChemicalStorage
                                          ? 'Tiện Ích An Toàn Kho Hóa Chất & Nguy Hiểm (Tick để bật / tắt):'
                                          : 'Tiện Ích Tiêu Chuẩn 3PL Phổ Biến (Tick để bật / tắt):'))}
                              </h5>
                              <span className="text-[11px] text-slate-500">Bấm trực tiếp vào từng ô để kích hoạt nhanh</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(warehouseDetailModalData.isBondedStorage
                                ? (warehouseDetailModalData.isColdStorage
                                    ? BONDED_COLD_FREE_UTILITIES_SUGGESTIONS
                                    : (warehouseDetailModalData.isChemicalStorage
                                        ? BONDED_HAZMAT_FREE_UTILITIES_SUGGESTIONS
                                        : BONDED_GENERAL_FREE_UTILITIES_SUGGESTIONS))
                                : (warehouseDetailModalData.isColdStorage
                                    ? COLD_FREE_UTILITIES_SUGGESTIONS
                                    : (warehouseDetailModalData.isChemicalStorage
                                        ? HAZMAT_FREE_UTILITIES_SUGGESTIONS
                                        : WAREHOUSE_FREE_UTILITIES_SUGGESTIONS))
                              ).map((utilName) => {
                                const isChecked = warehouseDetailModalData.freeSurcharges.includes(utilName);
                                return (
                                  <label
                                    key={utilName}
                                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                                      isChecked
                                        ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-xs font-bold'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setWarehouseDetailModalData(prev => prev ? ({
                                            ...prev,
                                            freeSurcharges: [...prev.freeSurcharges, utilName]
                                          }) : prev);
                                        } else {
                                          setWarehouseDetailModalData(prev => prev ? ({
                                            ...prev,
                                            freeSurcharges: prev.freeSurcharges.filter(f => f !== utilName)
                                          }) : prev);
                                        }
                                      }}
                                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5 accent-emerald-600"
                                    />
                                    <span className="text-xs leading-relaxed">{utilName}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* THÊM TIỆN ÍCH TÙY CHỈNH */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h5 className="text-xs font-bold text-slate-800 mb-2.5">
                              Thêm Tiện Ích / Dịch Vụ Tùy Chỉnh Khác:
                            </h5>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                id="warehouse-custom-utility-input"
                                placeholder="VD: Miễn phí pallet gỗ tiêu chuẩn, Trà cà phê tiếp khách, Khu vực locker cá nhân..."
                                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.currentTarget.value || '').trim();
                                    if (val && !warehouseDetailModalData.freeSurcharges.includes(val)) {
                                      setWarehouseDetailModalData(prev => prev ? ({
                                        ...prev,
                                        freeSurcharges: [...prev.freeSurcharges, val]
                                      }) : prev);
                                      e.currentTarget.value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('warehouse-custom-utility-input') as HTMLInputElement;
                                  if (input && input.value.trim()) {
                                    const val = input.value.trim();
                                    if (!warehouseDetailModalData.freeSurcharges.includes(val)) {
                                      setWarehouseDetailModalData(prev => prev ? ({
                                        ...prev,
                                        freeSurcharges: [...prev.freeSurcharges, val]
                                      }) : prev);
                                      input.value = '';
                                    }
                                  }
                                }}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                              >
                                + Thêm Tiện Ích
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 3: GIÁ, PHỤ PHÍ VÀ VAS (UNIFIED CONTINUOUS TABLE LIKE ROAD FREIGHT) */}
              {warehouseDetailActiveTab === 'pricing' && (
                <WarehousePricingContinuousTable
                  data={warehouseDetailModalData}
                  setData={setWarehouseDetailModalData}
                  surchargesLov={
                    warehouseDetailModalData.isBondedStorage
                      ? (warehouseDetailModalData.isColdStorage
                          ? BONDED_COLD_SUGGESTED_SURCHARGES
                          : (warehouseDetailModalData.isChemicalStorage
                              ? BONDED_HAZMAT_SUGGESTED_SURCHARGES
                              : BONDED_GENERAL_SUGGESTED_SURCHARGES))
                      : (warehouseDetailModalData.isColdStorage
                          ? COLD_WAREHOUSE_SUGGESTED_SURCHARGES
                          : (warehouseDetailModalData.isChemicalStorage
                              ? HAZMAT_WAREHOUSE_SUGGESTED_SURCHARGES
                              : WAREHOUSE_SUGGESTED_SURCHARGES))
                  }
                  vasLov={
                    warehouseDetailModalData.isBondedStorage
                      ? (warehouseDetailModalData.isColdStorage
                          ? BONDED_COLD_SUGGESTED_VAS
                          : (warehouseDetailModalData.isChemicalStorage
                              ? BONDED_HAZMAT_SUGGESTED_VAS
                              : BONDED_GENERAL_SUGGESTED_VAS))
                      : (warehouseDetailModalData.isColdStorage
                          ? COLD_WAREHOUSE_SUGGESTED_VAS
                          : (warehouseDetailModalData.isChemicalStorage
                              ? HAZMAT_WAREHOUSE_SUGGESTED_VAS
                              : WAREHOUSE_SUGGESTED_VAS))
                  }
                />
              )}
            </div>

            {/* 4. Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Toàn bộ ảnh, thông số kỹ thuật, phụ phí & VAS sẽ được tự động đồng bộ vào Hồ Sơ Năng Lực của cơ sở này.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWarehouseDetailModalData(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="button"
                  onClick={handleSaveWarehouseDetailModal}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận & Lưu Chi Tiết Cơ Sở Kho</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Trucking FTL Multi-Vehicle Cost Breakdown Matrix Modal */}
      <TruckingFtlCostMatrixModal
        isOpen={!!costMatrixModalRoute}
        onClose={() => setCostMatrixModalRoute(null)}
        route={costMatrixModalRoute}
        onSave={handleSaveCostMatrix}
        cargoType={
          costMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'reefer'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'hazmat'
            : 'general')
        }
      />

      {/* 5.1 Trucking LTL Dual-Metric (Kg & CBM) Cost Breakdown Matrix Modal */}
      <TruckingLtlCostMatrixModal
        isOpen={!!ltlCostMatrixModalRoute}
        onClose={() => setLtlCostMatrixModalRoute(null)}
        route={ltlCostMatrixModalRoute}
        onSave={handleSaveLtlCostMatrix}
      />

      {/* 6. Ocean FCL Multi-Container Cost Breakdown Matrix Modal */}
      <OceanFclCostMatrixModal
        isOpen={!!oceanFclCostMatrixModalRoute}
        onClose={() => setOceanFclCostMatrixModalRoute(null)}
        route={oceanFclCostMatrixModalRoute}
        onSave={handleSaveOceanFclCostMatrix}
        cargoType={
          oceanFclCostMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'reefer'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'hazmat'
            : 'general')
        }
      />

      {/* 6. Ocean LCL Dual-Metric (CBM & Kg) Cost Matrix Modal */}
      <OceanLclCostMatrixModal
        isOpen={!!oceanLclCostMatrixModalRoute}
        onClose={() => setOceanLclCostMatrixModalRoute(null)}
        route={oceanLclCostMatrixModalRoute}
        onSave={handleSaveOceanLclCostMatrix}
        cargoType={
          oceanLclCostMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'reefer'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'hazmat'
            : 'general')
        }
      />

      {/* 6.1 Air Cargo Dual-Metric (Kg & CBM) Cost Matrix Modal */}
      <AirCargoCostMatrixModal
        isOpen={!!airCargoCostMatrixModalRoute}
        onClose={() => setAirCargoCostMatrixModalRoute(null)}
        route={airCargoCostMatrixModalRoute}
        onSave={handleSaveAirCargoCostMatrix}
        cargoType={
          airCargoCostMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'perishable'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'dangerous'
            : 'general')
        }
      />

      {/* 6.2 Air Express Weight-Tiered (+45kg Base) Cost Matrix Modal */}
      <AirExpressCostMatrixModal
        isOpen={!!airExpressCostMatrixModalRoute}
        onClose={() => setAirExpressCostMatrixModalRoute(null)}
        route={airExpressCostMatrixModalRoute}
        onSave={handleSaveAirExpressCostMatrix}
      />

      {/* 7. Rail FCL Multi-Container/Wagon Cost Breakdown Matrix Modal */}
      <RailFclCostMatrixModal
        isOpen={!!railFclCostMatrixModalRoute}
        onClose={() => setRailFclCostMatrixModalRoute(null)}
        route={railFclCostMatrixModalRoute}
        onSave={handleSaveRailFclCostMatrix}
        cargoType={
          railFclCostMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'reefer'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'hazmat'
            : 'general')
        }
      />

      {/* 7.1 Rail LCL Dual-Metric (CBM & Kg) Multi-Tier Cost Breakdown Matrix Modal */}
      <RailLclCostMatrixModal
        isOpen={!!railLclCostMatrixModalRoute}
        onClose={() => setRailLclCostMatrixModalRoute(null)}
        route={railLclCostMatrixModalRoute}
        onSave={handleSaveRailLclCostMatrix}
        cargoType={
          railLclCostMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'reefer'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'hazmat'
            : 'general')
        }
      />

      {/* 8. Cross-Border FTL Multi-Vehicle Cost Breakdown Matrix Modal */}
      <CrossBorderFtlCostMatrixModal
        isOpen={!!crossBorderFtlCostMatrixModalRoute}
        onClose={() => setCrossBorderFtlCostMatrixModalRoute(null)}
        route={crossBorderFtlCostMatrixModalRoute}
        onSave={handleSaveCrossBorderFtlCostMatrix}
        cargoType={
          crossBorderFtlCostMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'reefer'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'hazmat'
            : 'general')
        }
      />

      {/* 9. Cross-Border LTL Dual-Metric (Kg & CBM) Cost Matrix Modal */}
      <CrossBorderLtlCostMatrixModal
        isOpen={!!crossBorderLtlCostMatrixModalRoute}
        onClose={() => setCrossBorderLtlCostMatrixModalRoute(null)}
        route={crossBorderLtlCostMatrixModalRoute}
        onSave={handleSaveCrossBorderLtlCostMatrix}
        cargoType={
          crossBorderLtlCostMatrixModalRoute?.cargoType ||
          (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref')
            ? 'reefer'
            : activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg')
            ? 'hazmat'
            : 'general')
        }
      />
    </div>
  );
};

