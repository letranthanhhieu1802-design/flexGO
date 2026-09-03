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
  Plus,
  Trash2,
  Flame,
  Percent,
  Tag,
  Download,
  Upload,
  FileSpreadsheet,
  FileUp,
  AlertTriangle,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { ServiceType } from '../../types';

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

export interface ScheduleModalData {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  selectedDays: string[];
  departureTime: string;
  customNote: string;
}

// =========================================================================
// LTL TIERED PRICING DEFINITIONS (KHUNG BẬC GIÁ CHUẨN THỊ TRƯỜNG CỐ ĐỊNH)
// =========================================================================
export interface LtlWeightTier {
  id: string;
  rangeLabel: string;
  subLabel: string;
  minKg: number;
  maxKg: number;
  price: number; // VND per Kg
}

export interface LtlVolumeTier {
  id: string;
  rangeLabel: string;
  subLabel: string;
  minCbm: number;
  maxCbm: number;
  price: number; // VND per CBM
}

export interface LtlTieredPricingConfig {
  minCharge: number; // Cước tối thiểu (VND)
  pricingBasis: 'weight' | 'volume'; // Đơn vị tính chính
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

export interface TieredPricingModalData {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  pricingConfig: LtlTieredPricingConfig;
}

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

export interface CapabilityRouteItem {
  id: string;
  routeCode?: string; // Mã tuyến tự sinh (VD: RC-FTL-001)
  route: string;
  origin: string;
  destination: string;
  truckBodyType?: string;
  customTruckBodyType?: string;
  truckTonnage?: string;
  customTruckTonnage?: string;
  vehicleType: string;
  pricingUnit: string;
  price: number;
  currency: 'VND' | 'USD';
  sla: string;
  pricingStyle: 'All-in' | 'Chưa gồm phụ phí';
  validUntil?: string; // Hạn giá (Date giá)
  promotionPercent: number; // 0 - 50%
  ltlPricing?: LtlTieredPricingConfig; // Biểu giá ma trận 5 bậc chuẩn LTL (Kg & CBM)
}

export interface PaidSurchargeItem {
  id: string;
  name: string;
  priceText: string;
  isChecked: boolean;
}

export interface CapabilityVasItem {
  id: string;
  name: string;
  desc?: string;
  category: string; // VD: 'Dịch Vụ Bốc Xếp & Đóng Gói', 'Phương Tiện & Thiết Bị Phụ Trợ', 'Giám Sát, An Ninh & Chứng Từ', 'Quy Định, Pháp Lý & Bảo Hiểm'
  tag?: string;
  priceText: string;
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
            vehicleLov: ['Cont 20ft Dry (20GP)', 'Cont 40ft Dry (40GP)', 'Cont 40ft High Cube (40HC)', 'Cont 45HC', 'Cont Open Top', 'Cont Flat Rack'],
            unitLov: ['Cont 20GP (USD)', 'Cont 40HC (USD)', 'Cont 45HC (USD)'],
            defaultRoutes: [
              {
                id: 'r-sea-1',
                route: 'Cát Lái (VNCLI) ⇄ Hamburg (Đức)',
                origin: 'Cảng Cát Lái (TP.HCM)',
                destination: 'Cảng Hamburg (Germany)',
                vehicleType: 'Cont 40ft High Cube (40HC)',
                pricingUnit: 'Cont 40HC (USD)',
                price: 2450,
                currency: 'USD',
                sla: '28 - 32 ngày',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 12,
              },
              {
                id: 'r-sea-2',
                route: 'Cái Mép (VNCMT) ⇄ Los Angeles (USLAX)',
                origin: 'Cảng Cái Mép (Bà Rịa - Vũng Tàu)',
                destination: 'Cảng Los Angeles (USA)',
                vehicleType: 'Cont 40ft High Cube (40HC)',
                pricingUnit: 'Cont 40HC (USD)',
                price: 2850,
                currency: 'USD',
                sla: '16 - 18 ngày',
                pricingStyle: 'Chưa gồm phụ phí',
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
            vehicleLov: ['LCL Hàng lẻ đóng ghép', 'Pallet tiêu chuẩn CFS'],
            unitLov: ['CBM (USD)', 'RT (Revenue Ton)'],
            defaultRoutes: [
              {
                id: 'r-sea-lcl-1',
                route: 'Cát Lái ⇄ Singapore (SGSIN)',
                origin: 'Kho CFS Cát Lái (TP.HCM)',
                destination: 'Cảng Singapore',
                vehicleType: 'LCL Hàng lẻ đóng ghép',
                pricingUnit: 'CBM (USD)',
                price: 25,
                currency: 'USD',
                sla: '3 - 5 ngày',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 20,
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
            vehicleLov: ['Cont 20ft Reefer (20RF)', 'Cont 40ft Reefer (40RF/40RH)'],
            unitLov: ['Cont 40RF (USD)', 'Cont 20RF (USD)'],
            defaultRoutes: [
              {
                id: 'r-sea-ref-1',
                route: 'Cát Lái ⇄ Thượng Hải (CNSHA)',
                origin: 'Cảng Cát Lái (TP.HCM)',
                destination: 'Cảng Thượng Hải (China)',
                vehicleType: 'Cont 40ft Reefer (40RF/40RH)',
                pricingUnit: 'Cont 40RF (USD)',
                price: 1850,
                currency: 'USD',
                sla: '6 - 8 ngày',
                pricingStyle: 'Chưa gồm phụ phí',
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
            unitLov: ['Cont 20ft (USD)', 'Cont 40ft (USD)'],
            defaultRoutes: [
              {
                id: 'r-sea-haz-1',
                route: 'Cái Mép ⇄ Rotterdam (NLRTM)',
                origin: 'Cảng Cái Mép (BR-VT)',
                destination: 'Cảng Rotterdam (Hà Lan)',
                vehicleType: 'Cont 40ft DG IMO',
                pricingUnit: 'Cont 40ft (USD)',
                price: 3650,
                currency: 'USD',
                sla: '26 - 30 ngày',
                pricingStyle: 'Chưa gồm phụ phí',
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
            defaultFleet: 'Hợp đồng Block Space Agreement (BSA) Vietnam Airlines, Singapore Airlines, EVA Air',
            defaultOperation: 'Book tải bay hàng ngày, ưu tiên qua soi chiếu an ninh TCS/SCSC/NCTS',
            defaultCommitment: 'Bay đúng lịch trình, đền bù 100% nếu trễ chuyến ảnh hưởng dây chuyền sản xuất',
            vehicleLov: ['Air Cargo Tiêu Chuẩn', 'Mâm ULD PMC/PAG', 'Thùng AKE'],
            unitLov: ['Kg', 'Tấn'],
            defaultRoutes: [
              {
                id: 'r-air-1',
                route: 'SGN (Tân Sơn Nhất) ⇄ NRT (Tokyo)',
                origin: 'Sân bay Tân Sơn Nhất (TP.HCM)',
                destination: 'Sân bay Narita (Tokyo, Nhật Bản)',
                vehicleType: 'Air Cargo Tiêu Chuẩn',
                pricingUnit: 'Kg',
                price: 88000,
                currency: 'VND',
                sla: '2 - 3 ngày',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 10,
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
            vehicleLov: ['Container 40ft đường sắt', 'Toa hàng kín (Toa G)', 'Toa thành cao (Toa H)'],
            unitLov: ['Container 40ft', 'Toa xe', 'Tấn'],
            defaultRoutes: [
              {
                id: 'r-rail-1',
                route: 'Ga Sóng Thần ⇄ Ga Giáp Bát',
                origin: 'Ga Sóng Thần (Bình Dương)',
                destination: 'Ga Giáp Bát (Hà Nội)',
                vehicleType: 'Container 40ft đường sắt',
                pricingUnit: 'Container 40ft',
                price: 21000000,
                currency: 'VND',
                sla: '65 - 72 giờ',
                pricingStyle: 'All-in',
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
            vehicleLov: ['Hàng lẻ toa ghép đường sắt'],
            unitLov: ['Kg', 'Tấn', 'CBM'],
            defaultRoutes: [
              {
                id: 'r-rail-lcl-1',
                route: 'Sài Gòn ⇄ Hà Nội',
                origin: 'Ga Sóng Thần (TP.HCM / Bình Dương)',
                destination: 'Ga Giáp Bát (Hà Nội)',
                vehicleType: 'Hàng lẻ toa ghép đường sắt',
                pricingUnit: 'Kg',
                price: 1100,
                currency: 'VND',
                sla: '4 - 5 ngày',
                pricingStyle: 'All-in',
                promotionPercent: 0,
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
                route: 'Sóng Thần ⇄ Đồng Đăng (Lạng Sơn)',
                origin: 'Ga Sóng Thần (Bình Dương)',
                destination: 'Ga Đồng Đăng (Lạng Sơn)',
                vehicleType: 'Container 40RF đường sắt',
                pricingUnit: 'Cont 40RF',
                price: 34000000,
                currency: 'VND',
                sla: '72 giờ',
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
                route: 'Sóng Thần ⇄ Yên Viên',
                origin: 'Ga Sóng Thần (Bình Dương)',
                destination: 'Ga Yên Viên (Hà Nội)',
                vehicleType: 'Container nguy hiểm đường sắt',
                pricingUnit: 'Cont 40ft',
                price: 38000000,
                currency: 'VND',
                sla: '4 - 5 ngày',
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
                route: 'Kho KCN Sóng Thần (Bình Dương)',
                origin: 'KCN Sóng Thần',
                destination: 'Phân phối toàn quốc',
                vehicleType: 'Kho thường Grade A',
                pricingUnit: 'm² / Tháng',
                price: 95000,
                currency: 'VND',
                sla: 'Xuất nhập 2 - 4h',
                pricingStyle: 'All-in',
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
                route: 'Kho Ngoại Quan Cát Lái',
                origin: 'Khu thương mại Cát Lái (TP.HCM)',
                destination: 'Tạm nhập tái xuất / Nhập nội địa',
                vehicleType: 'Kho ngoại quan gần cảng biển',
                pricingUnit: 'm² / Tháng',
                price: 140000,
                currency: 'VND',
                sla: 'Thủ tục HQ 24h',
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
                route: 'Kho Fulfillment Tân Bình (TP.HCM)',
                origin: 'Tân Bình (TP.HCM)',
                destination: 'Giao hàng nội thành & toàn quốc',
                vehicleType: 'Kho TMĐT E-Commerce',
                pricingUnit: 'Đơn hàng',
                price: 8500,
                currency: 'VND',
                sla: 'Xử lý đơn < 12h',
                pricingStyle: 'All-in',
                promotionPercent: 15,
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
                route: 'Self-Storage Quận 7 (TP.HCM)',
                origin: 'Quận 7 (TP.HCM)',
                destination: 'Lưu trữ cá nhân/doanh nghiệp',
                vehicleType: 'Khoang tự quản Mini Storage',
                pricingUnit: 'm³ / Tháng',
                price: 450000,
                currency: 'VND',
                sla: 'Truy cập 24/7',
                pricingStyle: 'All-in',
                promotionPercent: 20,
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
                route: 'Kho Ngoại Quan Lạnh Hải Phòng',
                origin: 'Đình Vũ (Hải Phòng)',
                destination: 'Tạm nhập tái xuất',
                vehicleType: 'Kho ngoại quan lạnh',
                pricingUnit: 'Pallet / Ngày',
                price: 28000,
                currency: 'VND',
                sla: 'Thủ tục 24h',
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
                route: 'Kho Ngoại Quan Hóa Chất Đình Vũ (Hải Phòng)',
                origin: 'KCN Đình Vũ (Hải Phòng)',
                destination: 'Tạm nhập tái xuất / Nhập khẩu',
                vehicleType: 'Kho ngoại quan hóa chất',
                pricingUnit: 'm² / Tháng',
                price: 220000,
                currency: 'VND',
                sla: 'Thủ tục 24h',
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
                route: 'Chi cục HQ Cửa khẩu Cảng Cát Lái',
                origin: 'Cảng Cát Lái (TP.HCM)',
                destination: 'Thông quan hàng hóa',
                vehicleType: 'Tờ khai Xuất/Nhập Kinh Doanh',
                pricingUnit: 'Tờ khai',
                price: 850000,
                currency: 'VND',
                sla: '4 - 8 giờ',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 15,
              },
              {
                id: 'r-cus-2',
                route: 'Chi cục HQ Sân bay Tân Sơn Nhất',
                origin: 'Sân bay Tân Sơn Nhất (TP.HCM)',
                destination: 'Thông quan hàng không',
                vehicleType: 'Tờ khai Xuất/Nhập Kinh Doanh',
                pricingUnit: 'Tờ khai',
                price: 950000,
                currency: 'VND',
                sla: '2 - 4 giờ',
                pricingStyle: 'Chưa gồm phụ phí',
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
            defaultFleet: 'Chuyên viên xử lý thủ tục kiểm tra chuyên ngành nông thủy sản và thực phẩm tươi',
            defaultOperation: 'Đăng ký kiểm dịch trực tuyến trên Cổng một cửa quốc gia, lấy mẫu kiểm dịch tại bến cảng',
            defaultCommitment: 'Lấy mẫu và có chứng thư kiểm dịch trong 24h - 48h, hỗ trợ đưa hàng về kho bảo quản',
            vehicleLov: ['Kiểm dịch thực vật', 'Kiểm dịch động vật', 'Kiểm tra An toàn thực phẩm'],
            unitLov: ['Lô hàng', 'Tờ khai'],
            defaultRoutes: [
              {
                id: 'r-cus-ref-1',
                route: 'Chi cục Kiểm dịch Thực vật Vùng VI (TP.HCM)',
                origin: 'Cảng Cát Lái / Hiệp Phước',
                destination: 'Cấp chứng thư kiểm dịch',
                vehicleType: 'Kiểm dịch thực vật',
                pricingUnit: 'Lô hàng',
                price: 1450000,
                currency: 'VND',
                sla: '24 - 48 giờ',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Nộp hồ sơ kiểm dịch trực tuyến trước giờ tàu cập cảng',
              'Theo dõi tiến độ cấp chứng thư trực tuyến',
            ],
            defaultFreeSurcharges: [
              'Nộp hồ sơ kiểm dịch trực tuyến trước giờ tàu cập cảng',
            ],
            paidSurchargeOptions: [
              { id: 'pchk-1', name: 'Lệ phí kiểm nghiệm mẫu phòng Lab (Nhà nước)', priceText: 'Theo biên lai thu', isChecked: true },
              { id: 'pchk-2', name: 'Phí đưa hàng về kho bảo quản chờ kết quả', priceText: '800,000 ₫ / Lô', isChecked: true },
            ],
            vasOptions: [
              'Đăng ký kiểm dịch thực vật / Động vật trực tuyến',
              'Đưa hàng về kho bảo quản chờ kết quả kiểm nghiệm',
              'Xin giấy phép vệ sinh An toàn thực phẩm (ATTP)',
              'Lấy mẫu kiểm tra tại cảng nhanh trong 24h',
              'Cấp chứng thư thông quan kiểm dịch',
            ],
            defaultVas: [
              'Đăng ký kiểm dịch thực vật / Động vật trực tuyến',
              'Đưa hàng về kho bảo quản chờ kết quả kiểm nghiệm',
              'Cấp chứng thư thông quan kiểm dịch',
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
            defaultFleet: 'Đại lý khai báo hóa chất Cục Hóa chất (Bộ Công Thương) & Giấy phép chuyên ngành',
            defaultOperation: 'Thẩm định bảng dữ liệu an toàn MSDS, khai báo hóa chất tự động trong 2 giờ',
            defaultCommitment: 'Hồ sơ hợp lệ 100%, không bị ách tắc hải quan do thiếu giấy phép hóa chất',
            vehicleLov: ['Khai báo hóa chất Bộ Công Thương', 'Giấy phép tiền chất công nghiệp'],
            unitLov: ['Tờ khai / Giấy phép', 'Lô hàng'],
            defaultRoutes: [
              {
                id: 'r-cus-haz-1',
                route: 'Chi cục HQ Cửa khẩu Cảng Hải Phòng',
                origin: 'Cảng Đình Vũ (Hải Phòng)',
                destination: 'Thông quan hóa chất nhập khẩu',
                vehicleType: 'Khai báo hóa chất Bộ Công Thương',
                pricingUnit: 'Tờ khai / Giấy phép',
                price: 2200000,
                currency: 'VND',
                sla: '24 - 48 giờ',
                pricingStyle: 'Chưa gồm phụ phí',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: [
              'Thẩm định bảng dữ liệu an toàn hóa chất MSDS',
              'Khai báo hóa chất trên cổng một cửa quốc gia',
            ],
            defaultFreeSurcharges: [
              'Thẩm định bảng dữ liệu an toàn hóa chất MSDS',
              'Khai báo hóa chất trên cổng một cửa quốc gia',
            ],
            paidSurchargeOptions: [
              { id: 'phaz-cus-1', name: 'Phí xin giấy phép tiền chất công nghiệp', priceText: '1,500,000 ₫ / Giấy phép', isChecked: true },
              { id: 'phaz-cus-2', name: 'Phí đăng ký kiểm tra chất lượng hóa chất', priceText: '600,000 ₫ / Bộ', isChecked: false },
            ],
            vasOptions: [
              'Thẩm định bảng dữ liệu an toàn MSDS',
              'Khai báo hóa chất trên Cổng một cửa quốc gia',
              'Xin giấy phép nhập khẩu tiền chất công nghiệp',
              'Đăng ký kiểm tra chất lượng nhà nước hóa chất',
              'Giấy phép vận chuyển quá cảnh hàng nguy hiểm',
            ],
            defaultVas: [
              'Thẩm định bảng dữ liệu an toàn MSDS',
              'Khai báo hóa chất trên Cổng một cửa quốc gia',
              'Xin giấy phép nhập khẩu tiền chất công nghiệp',
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
                route: 'Hà Nội ⇄ Bằng Tường / Quảng Châu (TQ)',
                origin: 'KCN Bắc Ninh / Hà Nội',
                destination: 'Quảng Châu (Trung Quốc)',
                vehicleType: 'Xe tải liên vận 15T',
                pricingUnit: 'Chuyến',
                price: 42000000,
                currency: 'VND',
                sla: '36 - 48 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
              {
                id: 'r-cb-2',
                route: 'TP.HCM ⇄ Phnom Penh (Campuchia)',
                origin: 'KCN Tân Bình (TP.HCM)',
                destination: 'Phnom Penh (Cambodia)',
                vehicleType: 'Xe tải liên vận 15T',
                pricingUnit: 'Chuyến',
                price: 18500000,
                currency: 'VND',
                sla: '18 - 24 giờ',
                pricingStyle: 'All-in',
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
            defaultFleet: 'Tuyến xe gom hàng lẻ định kỳ hàng ngày đi Campuchia & Trung Quốc',
            defaultOperation: 'Gom hàng tại kho trung tâm Hà Nội & TP.HCM, giao tận tay người nhận ở nước ngoài',
            defaultCommitment: 'Giao hàng Door-to-Door, đối soát thu hộ tiền hàng tại Phnom Penh',
            vehicleLov: ['Tuyến gom hàng lẻ biên giới'],
            unitLov: ['Kg', 'CBM', 'Kiện'],
            defaultRoutes: [
              {
                id: 'r-cb-ltl-1',
                route: 'TP.HCM ⇄ Phnom Penh',
                origin: 'Kho trung tâm TP.HCM',
                destination: 'Thủ đô Phnom Penh (Campuchia)',
                vehicleType: 'Tuyến gom hàng lẻ biên giới',
                pricingUnit: 'Kg',
                price: 3500,
                currency: 'VND',
                sla: '24 - 36 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: [
              'Cập nhật trạng thái giao nhận trực tuyến qua App',
              'Quấn màng co bảo vệ kiện hàng',
            ],
            defaultFreeSurcharges: [
              'Cập nhật trạng thái giao nhận trực tuyến qua App',
            ],
            paidSurchargeOptions: [
              { id: 'pcb-ltl-1', name: 'Phí thu hộ tiền hàng ngoại tệ (COD tại Phnom Penh)', priceText: '1.5% giá trị thu hộ', isChecked: true },
              { id: 'pcb-ltl-2', name: 'Phí giao hàng vùng sâu vùng xa Campuchia', priceText: '200,000 ₫ / Kiện', isChecked: false },
            ],
            vasOptions: [
              'Giao hàng Door-to-Door tại Phnom Penh / Quảng Châu',
              'Dịch vụ thu hộ tiền hàng ngoại tệ (COD)',
              'Dán tem nhãn tiếng bản địa theo luật sở tại',
              'Bọc màng co bảo vệ kiện lẻ',
            ],
            defaultVas: [
              'Giao hàng Door-to-Door tại Phnom Penh / Quảng Châu',
              'Dịch vụ thu hộ tiền hàng ngoại tệ (COD)',
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
                route: 'Tiền Giang ⇄ Bằng Tường / Gia Hưng (TQ)',
                origin: 'Cái Bè (Tiền Giang)',
                destination: 'Chợ đầu mối Bằng Tường (Trung Quốc)',
                vehicleType: 'Đầu kéo Cont lạnh liên vận',
                pricingUnit: 'Chuyến',
                price: 65000000,
                currency: 'VND',
                sla: '48 - 60 giờ',
                pricingStyle: 'All-in',
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
                route: 'Hà Nội ⇄ Viêng Chăn (Lào)',
                origin: 'Hà Nội',
                destination: 'Thủ đô Viêng Chăn (Lào)',
                vehicleType: 'Xe chuyên dụng hóa chất liên vận',
                pricingUnit: 'Chuyến',
                price: 75000000,
                currency: 'VND',
                sla: '3 - 5 ngày',
                pricingStyle: 'All-in',
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
            unitLov: ['Tấn', 'Pallet'],
            defaultRoutes: [
              {
                id: 'r-proj-xdock-1',
                route: 'Hub Cross-dock TP.HCM ⇄ Các tỉnh Miền Tây',
                origin: 'Hub Bình Chánh (TP.HCM)',
                destination: '13 tỉnh Đồng Bằng Sông Cửu Long',
                vehicleType: 'Sàn trung chuyển Cross-dock',
                pricingUnit: 'Tấn',
                price: 85000,
                currency: 'VND',
                sla: '4 - 6 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 15,
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
            unitLov: ['Cont', 'Chuyến'],
            defaultRoutes: [
              {
                id: 'r-proj-port-1',
                route: 'Cảng Cái Mép ⇄ KCN Phú Mỹ / KCN Nhơn Trạch',
                origin: 'Cảng Cái Mép (BR-VT)',
                destination: 'Các KCN lân cận',
                vehicleType: 'Xe đầu kéo bãi cảng',
                pricingUnit: 'Cont',
                price: 3200000,
                currency: 'VND',
                sla: '6 - 12 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 10,
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

interface SupplierServiceCapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (declaredServices: any[]) => void;
  existingServices?: any[];
}

export const SupplierServiceCapabilityModal: React.FC<SupplierServiceCapabilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingServices = [],
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

  const handleOpenScheduleModal = (route: CapabilityRouteItem) => {
    const currentSla = route.sla || '';
    let parsedDays = DAYS_OF_WEEK_LOV.filter((d) => currentSla.includes(d.name)).map((d) => d.name);
    if (currentSla.includes('Hàng ngày') || currentSla.includes('hàng ngày') || currentSla.includes('T2 - CN')) {
      parsedDays = DAYS_OF_WEEK_LOV.map((d) => d.name);
    }

    // Extract time from string (e.g. 20:00 or 19:30)
    const timeMatch = currentSla.match(/(\d{1,2}:\d{2})/);
    const departureTime = timeMatch ? timeMatch[1] : '20:00';

    setScheduleModalData({
      routeId: route.id,
      routeName: route.route,
      origin: route.origin,
      destination: route.destination,
      selectedDays: parsedDays.length > 0 ? parsedDays : ['Thứ 2', 'Thứ 4', 'Thứ 6'],
      departureTime,
      customNote: '',
    });
  };

  const handleSaveScheduleModal = () => {
    if (!scheduleModalData) return;
    const { routeId, selectedDays, departureTime, customNote } = scheduleModalData;

    let formatted = '';
    if (selectedDays.length === 7) {
      formatted = `Hàng ngày${departureTime ? ` (Xuất bến ${departureTime})` : ''}`;
    } else if (selectedDays.length > 0) {
      const sortedDays = DAYS_OF_WEEK_LOV.filter((d) => selectedDays.includes(d.name)).map((d) => d.name);
      formatted = `${sortedDays.join(', ')}${departureTime ? ` (Xuất bến ${departureTime})` : ''}`;
    } else if (departureTime) {
      formatted = `Xuất bến ${departureTime}`;
    }

    if (customNote && customNote.trim()) {
      formatted += ` - ${customNote.trim()}`;
    }

    handleUpdateRouteRow(routeId, 'sla', formatted);
    setScheduleModalData(null);
  };

  const [tieredPricingModalData, setTieredPricingModalData] = useState<TieredPricingModalData | null>(null);
  const [tieredPricingActiveTab, setTieredPricingActiveTab] = useState<'weight' | 'volume'>('weight');

  const handleOpenTieredPricingModal = (route: CapabilityRouteItem) => {
    const isWeightBasis = !route.pricingUnit || route.pricingUnit.toLowerCase().includes('kg');
    const existingConfig = route.ltlPricing || createDefaultLtlPricingConfig(
      isWeightBasis ? 'weight' : 'volume',
      route.price > 0 ? (isWeightBasis ? route.price : Math.round(route.price / 250)) : 2000,
      route.price > 0 ? (!isWeightBasis ? route.price : Math.round(route.price * 250)) : 500000
    );

    setTieredPricingModalData({
      routeId: route.id,
      routeName: route.route,
      origin: route.origin,
      destination: route.destination,
      pricingConfig: JSON.parse(JSON.stringify(existingConfig)),
    });
    setTieredPricingActiveTab(isWeightBasis ? 'weight' : 'volume');
  };

  const handleSaveTieredPricingModal = () => {
    if (!tieredPricingModalData) return;
    const { routeId, pricingConfig } = tieredPricingModalData;
    const isWeight = pricingConfig.pricingBasis === 'weight';
    const repPrice = isWeight 
      ? (pricingConfig.weightTiers[2]?.price || pricingConfig.weightTiers[0]?.price || 1650)
      : (pricingConfig.volumeTiers[2]?.price || pricingConfig.volumeTiers[0]?.price || 420000);

    handleUpdateRouteRowMultiple(routeId, {
      ltlPricing: pricingConfig,
      pricingUnit: isWeight ? 'Kg' : 'CBM',
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

  if (!isOpen) return null;

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
    const isLtlTrucking = isTrucking && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
    const isReeferTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref'));
    const isHazmatTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg'));
    const cargoType: 'general' | 'reefer' | 'hazmat' | 'ltl' = isLtlTrucking ? 'ltl' : (isHazmatTrucking ? 'hazmat' : (isReeferTrucking ? 'reefer' : 'general'));
    const bodyTypes = isLtlTrucking ? LTL_TRUCKING_BODY_TYPES : (isHazmatTrucking ? HAZMAT_TRUCKING_BODY_TYPES : (isReeferTrucking ? REEFER_TRUCKING_BODY_TYPES : TRUCKING_BODY_TYPES));
    const defaultBody = bodyTypes[0];
    const defaultTonnages = getTonnagesForBodyType(defaultBody, cargoType);
    const defaultTonnage = isLtlTrucking ? defaultTonnages[2] || defaultTonnages[0] : (isHazmatTrucking ? defaultTonnages[2] || defaultTonnages[0] : (isReeferTrucking ? defaultTonnages[0] : (defaultTonnages[defaultTonnages.length - 2] || defaultTonnages[0])));
    const defaultVehicle = isLtlTrucking ? 'Xe thùng kín 15T ghép tuyến' : (isHazmatTrucking ? 'Xe tải hóa chất 15T' : (isReeferTrucking ? 'Xe đông lạnh 5T' : (isTrucking ? 'Xe tải 15T thùng kín' : (activeModel?.vehicleLov?.[0] || 'Phương tiện chuẩn'))));
    const defaultUnit = isLtlTrucking ? 'Kg' : (activeModel?.unitLov?.[0] || 'Chuyến');
    const modelPrefix = (activeModel?.code || activeCategory?.id || 'RC').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const nextIdx = (currentData.routes || []).length + 1;
    const generatedRouteCode = `RC-${modelPrefix}-${String(nextIdx).padStart(3, '0')}`;

    const newRoute: CapabilityRouteItem = {
      id: `r-new-${Date.now()}`,
      routeCode: generatedRouteCode,
      route: isLtlTrucking ? 'Hà Nội ⇄ TP.HCM' : (isHazmatTrucking ? 'Bà Rịa - Vũng Tàu ⇄ Bình Dương' : (isReeferTrucking ? 'Đà Lạt ⇄ TP.HCM' : 'Hành Lang Tuyến Mới')),
      origin: isLtlTrucking ? 'Hub Thanh Trì (Hà Nội)' : (isHazmatTrucking ? 'KCN Phú Mỹ (BR-VT)' : (isReeferTrucking ? 'Đức Trọng (Lâm Đồng)' : 'Điểm Lấy Hàng (Kho / Cảng)')),
      destination: isLtlTrucking ? 'Hub Quận 12 (TP.HCM)' : (isHazmatTrucking ? 'KCN VSIP 2 (Bình Dương)' : (isReeferTrucking ? 'Chợ đầu mối Thủ Đức (TP.HCM)' : 'Điểm Giao Hàng (Kho / Cảng)')),
      truckBodyType: isTrucking ? defaultBody : undefined,
      truckTonnage: isTrucking ? defaultTonnage : undefined,
      vehicleType: defaultVehicle,
      pricingUnit: defaultUnit,
      price: isLtlTrucking ? 1650 : (isHazmatTrucking ? 14500000 : (isReeferTrucking ? 9500000 : 15000000)),
      currency: 'VND',
      sla: isLtlTrucking ? 'Thứ 2, Thứ 4, Thứ 6' : (isHazmatTrucking ? '4 - 6 giờ' : (isReeferTrucking ? '7 - 9 giờ' : '24 - 48 giờ')),
      pricingStyle: 'All-in',
      validUntil: '2026-12-31',
      promotionPercent: 0,
      ltlPricing: isLtlTrucking ? createDefaultLtlPricingConfig('weight', 2000, 500000) : undefined,
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            HEADER
        ========================================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Khai Báo Danh Mục Dịch Vụ Supplier
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tick chọn các dịch vụ có thể cung ứng và thiết lập năng lực & biểu giá tham chiếu.
            </p>
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

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SPLIT VIEW BODY (Left: Tree, Right: 4 Structured Sections)
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[550px]">
          
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
                      <span className="text-xs font-bold text-slate-800 truncate">{cat.name}</span>
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

                                <span className="text-xs font-semibold text-slate-700">{cg.name}</span>
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

                                        <span className="truncate">{m.name}</span>
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
                    <p className="text-xs text-slate-500 mt-0.5">
                      Điền thông số năng lực vận hành và mức giá tham chiếu chuẩn để hiển thị cho khách hàng.
                    </p>
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
                        <span>Các Tuyến Đường & Biểu Giá Tham Chiếu ({currentData.routes?.length || 0})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Chỉnh sửa trực tiếp trên bảng biểu giá hoặc tải template Excel để nhập liệu hàng loạt.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* LTL Volumetric Conversion Rate Badge */}
                      {(activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL') && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold shadow-2xs">
                          <Package className="w-3.5 h-3.5 text-emerald-600" />
                          <span>1 CBM = 250 Kg (Quy đổi)</span>
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

                      {/* Download Excel Template Button */}
                      <button
                        type="button"
                        onClick={handleDownloadExcelTemplate}
                        disabled={isExportingTemplate}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-slate-400"
                        title="Tải file Excel mẫu chuẩn hóa kèm danh mục LOV tra cứu"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tải Mẫu Excel</span>
                      </button>

                      {/* Upload Excel Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs"
                        title="Upload file Excel bảng giá tuyến đường để nhập hàng loạt"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Nhập Từ Excel</span>
                      </button>

                      {/* Add Single Route Button */}
                      <button
                        type="button"
                        onClick={handleAddRouteRow}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Tuyến</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Excel-Style Data Grid Table */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          {(() => {
                            const isLtlTable = activeCategory?.id === 'trucking' && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                            return (
                              <tr className="bg-slate-100 border-b border-slate-300 divide-x divide-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                                <th className="py-2.5 px-2 text-center w-9 min-w-[36px] bg-slate-100">STT</th>
                                <th className="py-2.5 px-2.5 min-w-[110px] text-center bg-slate-100">Mã Tuyến</th>
                                <th className="py-2.5 px-2.5 min-w-[135px]">Tuyến Đường</th>
                                <th className="py-2.5 px-2.5 min-w-[130px]">Điểm Đi</th>
                                <th className="py-2.5 px-2.5 min-w-[130px]">Điểm Đến</th>
                                {activeCategory?.id === 'trucking' ? (
                                  <>
                                    <th className="py-2.5 px-2.5 min-w-[200px]">Loại Thùng Phương Tiện</th>
                                    <th className="py-2.5 px-2.5 min-w-[210px]">Phân Khúc Tải Trọng</th>
                                  </>
                                ) : (
                                  <th className="py-2.5 px-2.5 min-w-[150px]">Loại Phương Tiện</th>
                                )}
                                <th className="py-2.5 px-2 w-20 min-w-[75px] text-center">ĐVT</th>
                                <th className="py-2.5 px-2.5 min-w-[140px] text-right">Đơn Giá</th>
                                <th className={`py-2.5 px-2 text-center ${isLtlTable ? 'min-w-[150px]' : 'min-w-[90px]'}`}>
                                  {isLtlTable ? 'Lịch Chạy Hàng' : 'SLA'}
                                </th>
                                <th className="py-2.5 px-2.5 min-w-[130px] text-center">Hạn Giá</th>
                                <th className="py-2.5 px-2 min-w-[85px] text-center">Promotion</th>
                                <th className="py-2.5 px-1.5 text-center w-9 min-w-[36px]">Xóa</th>
                              </tr>
                            );
                          })()}
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                          {(!currentData.routes || currentData.routes.length === 0) ? (
                            <tr>
                              <td colSpan={activeCategory?.id === 'trucking' ? 13 : 12} className="py-8 text-center text-slate-400 font-medium">
                                Chưa có tuyến đường nào. Bấm nút <strong className="text-indigo-600 font-bold">+ Thêm Tuyến Mới</strong> để khai báo bảng giá.
                              </td>
                            </tr>
                          ) : (
                            currentData.routes.map((route, idx) => {
                              const hasPromo = (route.promotionPercent || 0) > 0;
                              const discountedPrice = hasPromo 
                                ? Math.round(route.price * (1 - route.promotionPercent / 100)) 
                                : route.price;
                              const isTrucking = activeCategory?.id === 'trucking';
                              const isLtlTrucking = isTrucking && (activeModel?.id === 'trk-gen-ltl' || activeModel?.name?.includes('LTL') || activeModel?.code === 'LTL');
                              const isReeferTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('lạnh') || activeModel?.name?.includes('lạnh') || activeModel?.id?.includes('ref'));
                              const isHazmatTrucking = isTrucking && !isLtlTrucking && (activeCargoGroup?.name?.includes('nguy hiểm') || activeModel?.name?.includes('nguy hiểm') || activeModel?.id?.includes('haz') || activeModel?.id?.includes('dg'));
                              const cargoType: 'general' | 'reefer' | 'hazmat' | 'ltl' = isLtlTrucking ? 'ltl' : (isHazmatTrucking ? 'hazmat' : (isReeferTrucking ? 'reefer' : 'general'));
                              const currentTruckBodyTypes = isLtlTrucking ? LTL_TRUCKING_BODY_TYPES : (isHazmatTrucking ? HAZMAT_TRUCKING_BODY_TYPES : (isReeferTrucking ? REEFER_TRUCKING_BODY_TYPES : TRUCKING_BODY_TYPES));
                              const effectiveRouteCode = route.routeCode || `RC-${(activeModel?.code || activeCategory?.id || 'GEN').toUpperCase().replace(/[^A-Z0-9]/g, '')}-${String(idx + 1).padStart(3, '0')}`;

                              return (
                                <tr key={route.id} className="divide-x divide-slate-200 hover:bg-indigo-50/20 transition-colors">
                                  {/* 1. STT */}
                                  <td className="p-0 text-center font-mono text-slate-400 font-semibold text-[11px] bg-slate-50/60 align-middle">
                                    {idx + 1}
                                  </td>

                                  {/* 2. Mã Tuyến (Tự sinh) */}
                                  <td className="p-0 text-center bg-indigo-50/30 align-middle">
                                    <span 
                                      className="font-mono font-bold text-indigo-700 text-xs select-all px-2 block"
                                      title="Mã tuyến định danh tự sinh của hệ thống"
                                    >
                                      {effectiveRouteCode}
                                    </span>
                                  </td>

                                  {/* 3. Tuyến */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="text"
                                      value={route.route}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                      placeholder="HCM ⇄ Hà Nội"
                                      className="w-full px-2.5 py-2 bg-transparent text-slate-900 font-bold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                    />
                                  </td>

                                  {/* 4. Điểm Đi */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="text"
                                      value={route.origin}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                      placeholder="Bình Tân (TP.HCM)"
                                      className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                    />
                                  </td>

                                  {/* 5. Điểm Đến */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="text"
                                      value={route.destination}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                      placeholder="Cam Ranh (Khánh Hòa)"
                                      className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                    />
                                  </td>

                                  {/* 6. Cột Phương Tiện: Tách 2 cột nếu là Đường Bộ */}
                                  {isTrucking ? (
                                    <>
                                      {/* 6a. Loại Thùng Phương Tiện (LOV + Custom Option) */}
                                      <td className="p-0 align-top">
                                        {(() => {
                                          const currentBodyTypeVal = currentTruckBodyTypes.includes(route.truckBodyType || '')
                                            ? route.truckBodyType
                                            : (route.customTruckBodyType || route.truckBodyType === 'Khác (Nhập tùy chọn)...' ? 'Khác (Nhập tùy chọn)...' : currentTruckBodyTypes[0]);

                                          return (
                                            <div className="flex flex-col h-full">
                                              <select
                                                value={currentBodyTypeVal}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  if (val === 'Khác (Nhập tùy chọn)...') {
                                                    handleUpdateRouteRowMultiple(route.id, {
                                                      truckBodyType: val,
                                                      customTruckBodyType: '',
                                                    });
                                                  } else {
                                                    const validTonnages = getTonnagesForBodyType(val, cargoType);
                                                    const newTonnage = (route.truckTonnage && validTonnages.includes(route.truckTonnage))
                                                      ? route.truckTonnage
                                                      : validTonnages[0];
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
                                                {currentTruckBodyTypes.map((b, bIdx) => (
                                                  <option key={bIdx} value={b}>{b}</option>
                                                ))}
                                              </select>
                                              {(currentBodyTypeVal === 'Khác (Nhập tùy chọn)...' || (!currentTruckBodyTypes.includes(route.truckBodyType || '') && route.customTruckBodyType)) && (
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
                                  ) : (
                                    <td className="p-0 align-top">
                                      <select
                                        value={route.vehicleType}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'vehicleType', e.target.value)}
                                        className="w-full px-2.5 py-2 bg-transparent text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all cursor-pointer"
                                      >
                                        {(activeModel?.vehicleLov || [route.vehicleType]).map((veh: string, vIdx: number) => (
                                          <option key={vIdx} value={veh}>{veh}</option>
                                        ))}
                                      </select>
                                    </td>
                                  )}

                                  {/* 7. Đơn vị tính (LOV) */}
                                  <td className="p-0 text-center bg-slate-50/40 align-middle">
                                    {activeModel?.unitLov?.length === 1 ? (
                                      <span className="font-bold text-slate-700 text-xs">
                                        {activeModel.unitLov[0]}
                                      </span>
                                    ) : (
                                      <select
                                        value={route.pricingUnit}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'pricingUnit', e.target.value)}
                                        className="w-full px-1.5 py-2 bg-transparent text-slate-800 text-xs font-medium text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all cursor-pointer"
                                      >
                                        {(activeModel?.unitLov || ['Kg', 'CBM', 'Chuyến', 'Tấn', 'Cont 40ft', 'Pallet']).map((u: string, uIdx: number) => (
                                          <option key={uIdx} value={u}>{u}</option>
                                        ))}
                                      </select>
                                    )}
                                  </td>

                                  {/* 8. Đơn giá (Hỗ trợ Ma Trận 5 Bậc Giá Chuẩn cho LTL) */}
                                  <td className="p-1 align-middle">
                                    {isLtlTrucking ? (
                                      <div className="flex flex-col gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenTieredPricingModal(route)}
                                          className="w-full px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/70 hover:from-indigo-100 hover:to-indigo-50 text-indigo-950 text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-1.5"
                                          title="Nhấp để cấu hình chi tiết ma trận 5 bậc giá chuẩn thị trường (Kg / CBM)"
                                        >
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="font-mono font-bold text-xs text-indigo-900 truncate">
                                                {route.ltlPricing?.pricingBasis === 'volume'
                                                  ? `${(route.ltlPricing.volumeTiers[4]?.price || 320000).toLocaleString('vi-VN')} – ${(route.ltlPricing.volumeTiers[0]?.price || 600000).toLocaleString('vi-VN')} ₫`
                                                  : `${(route.ltlPricing?.weightTiers[4]?.price || 1100).toLocaleString('vi-VN')} – ${(route.ltlPricing?.weightTiers[0]?.price || 2500).toLocaleString('vi-VN')} ₫`}
                                              </span>
                                              <span className="text-[9.5px] font-bold text-indigo-700 bg-indigo-100/90 px-1.5 py-0.2 rounded-md shrink-0">
                                                5 Bậc
                                              </span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between mt-0.5">
                                              <span>Sàn (Min): <strong className="text-slate-800">{((route.ltlPricing?.minCharge) || (route.pricingUnit === 'CBM' ? 150000 : 100000)).toLocaleString('vi-VN')} ₫</strong></span>
                                              <span className="text-indigo-600 font-semibold group-hover:underline">Chi tiết ➔</span>
                                            </div>
                                          </div>
                                        </button>
                                        {hasPromo && (
                                          <div className="text-[10px] text-emerald-600 font-bold text-right px-1 whitespace-nowrap">
                                            Giảm cước: -{route.promotionPercent}%
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex flex-col h-full">
                                        <input
                                          type="number"
                                          value={route.price || ''}
                                          onChange={(e) => handleUpdateRouteRow(route.id, 'price', parseFloat(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full px-2.5 py-2 text-right bg-transparent text-slate-900 font-bold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all"
                                        />
                                        {hasPromo && (
                                          <div className="text-[10.5px] text-emerald-600 font-bold text-right px-2.5 pb-1 bg-emerald-50/60 border-t border-emerald-100 whitespace-nowrap">
                                            Giảm còn: {discountedPrice.toLocaleString('vi-VN')} {route.currency}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>

                                  {/* 9. SLA / Lịch Chạy Hàng (Multi-select Days of Week & Time for LTL) */}
                                  <td className="p-1 align-middle">
                                    {isLtlTrucking ? (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenScheduleModal(route)}
                                        className={`w-full min-h-[34px] px-2.5 py-1.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer shadow-2xs group ${
                                          route.sla
                                            ? 'bg-indigo-50/90 border-indigo-200 text-indigo-950 font-semibold hover:bg-indigo-100 hover:border-indigo-300'
                                            : 'bg-slate-50 border-dashed border-slate-300 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                        }`}
                                        title="Nhấp để thiết lập các thứ trong tuần & thời gian xuất bến"
                                      >
                                        <span className="truncate block font-semibold leading-tight">
                                          {route.sla || 'Chọn lịch & giờ chạy...'}
                                        </span>
                                        <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
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

                                  {/* 10. Hạn Giá (Date) */}
                                  <td className="p-0 align-top">
                                    <input
                                      type="date"
                                      value={route.validUntil || '2026-12-31'}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'validUntil', e.target.value)}
                                      className="w-full px-2 py-2 bg-transparent text-slate-800 text-xs font-medium text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-all cursor-pointer"
                                      title="Thời hạn hiệu lực của mức giá này"
                                    />
                                  </td>

                                  {/* 12. Promotion (%) */}
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

                                  {/* 13. Thao tác Xóa */}
                                  <td className="p-0 text-center bg-slate-50/40 align-middle">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRouteRow(route.id)}
                                      className="w-full h-full py-2.5 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                      title="Xóa tuyến đường này"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
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

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] text-slate-400">
                    * Bấm "Lưu Dữ Liệu" ở góc trên để cập nhật toàn bộ vào Showcase & Rate Cards.
                  </span>

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
          MODAL: THIẾT LẬP LỊCH CHẠY HÀNG & THỜI GIAN XUẤT BẾN (LTL)
      ========================================================================= */}
      {scheduleModalData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cấu Hình Lịch Chạy & Giờ Xuất Bến
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

              {/* 2. LOV Các Thứ Trong Tuần (7 Ngày) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    2. Các thứ trong tuần ({scheduleModalData.selectedDays.length}/7 ngày)
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
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs ring-1 ring-indigo-500/20' 
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

              {/* 3. Thời Gian Xuất Bến (Departure Time LOV) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  3. Thời gian xe xuất bến
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {DEPARTURE_TIMES_LOV.map((dt, dtIdx) => {
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
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Hoặc nhập giờ khác:</span>
                  <input
                    type="time"
                    value={scheduleModalData.departureTime || '20:00'}
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
                <div className="text-xs font-bold text-indigo-900 bg-white border border-indigo-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {(() => {
                      const days = scheduleModalData.selectedDays;
                      const time = scheduleModalData.departureTime;
                      if (days.length === 7) return `Hàng ngày${time ? ` (Xuất bến ${time})` : ''}`;
                      if (days.length > 0) return `${days.join(', ')}${time ? ` (Xuất bến ${time})` : ''}`;
                      if (time) return `Xuất bến ${time}`;
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
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Lưu Lịch Chạy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CẤU HÌNH MA TRẬN 5 BẬC GIÁ CHUẨN LTL (KG & CBM)
      ========================================================================= */}
      {tieredPricingModalData && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 via-white to-purple-50/30 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Ma Trận 5 Bậc Giá Chuẩn Thị Trường (LTL)</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded-full">Khung Cố Định</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tuyến: <strong className="text-indigo-700">{tieredPricingModalData.routeName}</strong> ({tieredPricingModalData.origin} ⇄ {tieredPricingModalData.destination})
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
              {/* Basis Switch & Tabs */}
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
                    <span>Biểu Giá Theo Trọng Lượng (Kg)</span>
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
                    <span>Biểu Giá Theo Thể Tích (CBM)</span>
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
                    <option value="weight">Tính theo Kg</option>
                    <option value="volume">Tính theo CBM</option>
                  </select>
                </div>
              </div>

              {/* Min Charge Setting */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Min
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Cước Sàn Tối Thiểu (Min Charge)</span>
                    <span className="text-[11px] text-amber-800 font-medium">Áp dụng khi kiện hàng siêu nhỏ / tổng cước theo đơn giá thấp hơn mức sàn</span>
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
                    placeholder="100000"
                    className="w-32 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-right text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-amber-900">₫ / Lô</span>
                </div>
              </div>

              {/* Tab 1: Weight Tiers (Kg) */}
              {tieredPricingActiveTab === 'weight' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Bảng 5 Khung Bậc Trọng Lượng Chuẩn (₫/Kg)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const base = tieredPricingModalData.pricingConfig.weightTiers[1]?.price || 2000;
                        const newTiers = [
                          { ...tieredPricingModalData.pricingConfig.weightTiers[0], price: Math.round(base * 1.25) },
                          { ...tieredPricingModalData.pricingConfig.weightTiers[1], price: base },
                          { ...tieredPricingModalData.pricingConfig.weightTiers[2], price: Math.round(base * 0.825) },
                          { ...tieredPricingModalData.pricingConfig.weightTiers[3], price: Math.round(base * 0.675) },
                          { ...tieredPricingModalData.pricingConfig.weightTiers[4], price: Math.round(base * 0.55) },
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
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          <th className="py-2.5 px-3 w-12 text-center">Bậc</th>
                          <th className="py-2.5 px-3 min-w-[140px]">Khoảng Trọng Lượng</th>
                          <th className="py-2.5 px-3 min-w-[150px]">Loại Hàng Khuyên Dùng</th>
                          <th className="py-2.5 px-3 min-w-[150px] text-right">Đơn Giá (₫ / Kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {tieredPricingModalData.pricingConfig.weightTiers.map((tier, tIdx) => (
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
                                <span className="font-semibold text-slate-500">₫</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Volume Tiers (CBM) */}
              {tieredPricingActiveTab === 'volume' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Bảng 5 Khung Bậc Thể Tích Chuẩn (₫/CBM)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const base = tieredPricingModalData.pricingConfig.volumeTiers[1]?.price || 500000;
                        const newTiers = [
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[0], price: Math.round(base * 1.2) },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[1], price: base },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[2], price: Math.round(base * 0.84) },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[3], price: Math.round(base * 0.76) },
                          { ...tieredPricingModalData.pricingConfig.volumeTiers[4], price: Math.round(base * 0.64) },
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
                          <th className="py-2.5 px-3 min-w-[150px] text-right">Đơn Giá (₫ / CBM)</th>
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
                                <span className="font-semibold text-slate-500">₫</span>
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
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Lưu Ma Trận Bậc Giá</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
