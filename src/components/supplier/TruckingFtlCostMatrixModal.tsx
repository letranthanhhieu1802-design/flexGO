import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Truck, 
  FileText, 
  Save, 
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Check
} from 'lucide-react';
import { CapabilityRouteItem } from './SupplierServiceCapabilityModal';
import { getReadOnlyMatrixInteractionProps } from './readOnlyCostMatrix';

export interface LOVItem {
  id: string;
  name: string;
  unit: string;
  defaultPrice?: number;
  description?: string;
}

export const TRUCKING_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu (BAF Fuel Surcharge)', unit: 'VND / Chuyến' },
  { id: 'tollBOT', name: 'Phí vé cầu đường BOT & Bốc xếp hạ tầng', unit: 'VND / Chuyến' },
  { id: 'docManagement', name: 'Phí chứng từ, seal & quản lý đơn', unit: 'VND / Chuyến' },
  { id: 'night_delivery', name: 'Phụ phí giao hàng ban đêm / giờ cấm tải', unit: 'VND / Chuyến' },
  { id: 'narrow_road', name: 'Phụ phí trung chuyển đường hẹp (xe nhỏ / boong)', unit: 'VND / Chuyến' },
  { id: 'ferry_terminal', name: 'Phụ phí cầu phà đặc thù, bến bãi & kiểm dịch', unit: 'VND / Chuyến' },
  { id: 'customs_staging', name: 'Phụ phí hạ bãi chờ kiểm hóa hải quan', unit: 'VND / Chuyến' },
  { id: 'remote_mountain', name: 'Phụ phí vùng sâu vùng xa / đường đèo dốc', unit: 'VND / Chuyến' },
  { id: 'peak_season', name: 'Phụ phí cao điểm mùa vụ (Peak Season Surcharge)', unit: 'VND / Chuyến' },
];

export const TRUCKING_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'vasGps', name: 'Định vị GPS Real-time & Link tracking live', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vasSeal', name: 'Kẹp chì Seal & Chụp ảnh biên bản giao nhận', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vasPod', name: 'Thu hồi chứng từ gốc (POD) về văn phòng', unit: 'VND / Bộ', defaultPrice: 0 },
  { id: 'vasLabor', name: 'Nhân công bốc xếp 2 đầu kho', unit: 'VND / Lần', defaultPrice: 0 },
  { id: 'vasTailLift', name: 'Xe bửng nâng thủy lực hạ pallet', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vasMultiDrop', name: 'Phụ phí giao đa điểm (Multi-drop)', unit: 'VND / Điểm', defaultPrice: 0 },
  { id: 'vasDetention', name: 'Phí neo xe chờ bốc dỡ (sau giờ miễn phí)', unit: 'VND / Giờ', defaultPrice: 150000 },
  { id: 'vasInsurance', name: 'Bảo hiểm hàng hóa vận chuyển (All-Risk)', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vasPalletWrap', name: 'Quấn màng co PE & đóng nẹp pallet', unit: 'VND / Pallet', defaultPrice: 0 },
  { id: 'vasSkuCheck', name: 'Kiểm đếm chi tiết số lượng SKU / Mã vạch', unit: 'VND / Kiện', defaultPrice: 0 },
  { id: 'vasFloorLift', name: 'Bốc xếp lên tầng cao / vào sâu trong kho', unit: 'VND / Lần', defaultPrice: 0 },
  { id: 'vasCod', name: 'Dịch vụ thu hộ tiền mặt (COD)', unit: 'VND / Đơn', defaultPrice: 0 },
  { id: 'vasSpecialCrane', name: 'Hỗ trợ xe cẩu chuyên dụng nâng hạ hàng', unit: 'VND / Chuyến', defaultPrice: 0 },
];

// REEFER (HÀNG LẠNH) SURCHARGES & VAS LOV
export const REEFER_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu (BAF Fuel Surcharge)', unit: 'VND / Chuyến' },
  { id: 'tollBOT', name: 'Phí cầu đường BOT & Trạm kiểm soát dịch', unit: 'VND / Chuyến' },
  { id: 'docManagement', name: 'Phí chứng từ, seal an ninh & quản lý nhiệt', unit: 'VND / Chuyến' },
  { id: 'pref_genset', name: 'Máy phát điện Genset cắm điện dự phòng liên tục', unit: 'VND / Ca', defaultPrice: 400000 },
  { id: 'pref_plug_park', name: 'Phí cắm điện duy trì tại bãi / lưu ca đêm', unit: 'VND / Đêm', defaultPrice: 500000 },
  { id: 'pref_multi_store', name: 'Giao hàng đa điểm chuỗi siêu thị / đại lý lẻ', unit: 'VND / Điểm', defaultPrice: 300000 },
  { id: 'pref_dock_seal', name: 'Bốc dỡ qua Dock trùm túi khí phòng lạnh', unit: 'VND / Điểm', defaultPrice: 250000 },
  { id: 'pref_dry_ice', name: 'Cung cấp đá gel bảo ôn / Đá khô bổ trợ', unit: 'VND / Kiện', defaultPrice: 150000 },
  { id: 'night_delivery', name: 'Phụ phí giao hàng ban đêm / giờ cấm tải', unit: 'VND / Chuyến', defaultPrice: 350000 },
  { id: 'narrow_road', name: 'Phụ phí trung chuyển xe lạnh nhỏ đường hẹp', unit: 'VND / Chuyến' },
  { id: 'peak_season', name: 'Phụ phí cao điểm mùa vụ nông thủy sản', unit: 'VND / Chuyến' },
];

export const REEFER_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'vas_pre_cooling', name: 'Làm lạnh trước thùng xe 30-60 phút (Pre-cooling)', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_iot_temp', name: 'Thiết bị IoT GPS & Cảm biến nhiệt Real-time 24/7', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_pdf_chart', name: 'Xuất biểu đồ dữ liệu nhiệt độ PDF toàn trình', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_cold_labor', name: 'Bốc dỡ & Bốc xếp kho lạnh 2 đầu gửi/nhận', unit: 'VND / Lần', defaultPrice: 300000 },
  { id: 'vas_cold_insurance', name: 'Bảo hiểm rủi ro đứt gãy chuỗi lạnh 100%', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_tail_lift', name: 'Xe bửng nâng thủy lực giao hàng chuỗi siêu thị', unit: 'VND / Chuyến', defaultPrice: 200000 },
  { id: 'vas_pod_temp', name: 'Thu hồi chứng từ gốc POD & Biên bản nghiệm thu nhiệt', unit: 'VND / Bộ', defaultPrice: 0 },
  { id: 'vas_cold_detention', name: 'Phí neo xe chờ dỡ lạnh (sau giờ miễn phí)', unit: 'VND / Giờ', defaultPrice: 200000 },
  { id: 'vas_pallet_wrap', name: 'Quấn màng co PE màng dày chống thoát nhiệt', unit: 'VND / Pallet', defaultPrice: 50000 },
  { id: 'vas_sku_cold', name: 'Kiểm đếm chi tiết hạn sử dụng & SKU từng thùng hàng lạnh', unit: 'VND / Kiện', defaultPrice: 0 },
];

// HAZMAT (HÀNG NGUY HIỂM / DG) SURCHARGES & VAS LOV
export const HAZMAT_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu (BAF Fuel Surcharge)', unit: 'VND / Chuyến' },
  { id: 'tollBOT', name: 'Phí cầu đường BOT & Bến bãi an toàn DG', unit: 'VND / Chuyến' },
  { id: 'docManagement', name: 'Phí hồ sơ an toàn hóa chất & MSDS theo xe', unit: 'VND / Chuyến' },
  { id: 'phaz_permit', name: 'Phí xin giấy phép lưu hành hàng nguy hiểm (PCCC & BCA)', unit: 'VND / Lô', defaultPrice: 1200000 },
  { id: 'phaz_tunnel_escort', name: 'Phí hộ tống an toàn qua hầm Hải Vân / đèo dốc đặc biệt', unit: 'VND / Chuyến', defaultPrice: 1500000 },
  { id: 'phaz_tank_pressure', name: 'Phí kiểm tra nồng độ khí / Thử áp lực bồn xitec trước khi nạp', unit: 'VND / Lần', defaultPrice: 600000 },
  { id: 'phaz_lashing_dunnage', name: 'Phí chèn lót túi khí & khóa tăng đơ sàn chống xô lệch phuy/IBC', unit: 'VND / Xe', defaultPrice: 250000 },
  { id: 'phaz_spill_ppe', name: 'Bộ ứng cứu tràn đổ hóa chất Spill-Kit & Bình bọt Foam PCCC', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'phaz_placard', name: 'Dán biển cảnh báo số UN & Placard IMO 4 chiều quanh xe', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'night_delivery', name: 'Phụ phí giao hàng ban đêm / luồng ưu tiên hóa chất', unit: 'VND / Chuyến' },
  { id: 'peak_season', name: 'Phụ phí cao điểm mùa vụ', unit: 'VND / Chuyến' },
];

export const HAZMAT_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'vas_dg_permit', name: 'Xin Giấy phép vận chuyển hàng nguy hiểm (PCCC & Bộ Công An)', unit: 'VND / Lô', defaultPrice: 1200000 },
  { id: 'vas_dg_declaration', name: 'Khai báo hóa chất Bộ Công Thương & Kiểm tra an toàn', unit: 'VND / Lô', defaultPrice: 500000 },
  { id: 'vas_dg_crew', name: 'Tài xế & Áp tải 100% có chứng chỉ nghiệp vụ an toàn DG', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_spill_kit', name: 'Bộ trang bị xử lý sự cố tràn đổ Spill Kit & Bình cứu hỏa', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_dg_lashing', name: 'Chằng buộc & Khóa lashing chuyên dụng Thùng phuy / IBC Tank', unit: 'VND / Xe', defaultPrice: 250000 },
  { id: 'vas_escort_convoy', name: 'Xe hộ tống an ninh / Xe hoa tiêu dẫn đường (Escort Convoy)', unit: 'VND / Chuyến', defaultPrice: 1500000 },
  { id: 'vas_dg_liability', name: 'Bảo hiểm trách nhiệm môi trường & Cháy nổ hóa chất (Liability)', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_dg_gps', name: 'Định vị GPS Real-time & Share link theo dõi lộ trình an toàn 24/7', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_dg_pod', name: 'Thu hồi chứng từ gốc POD & Giấy biên nhận bàn giao hóa chất', unit: 'VND / Bộ', defaultPrice: 0 },
  { id: 'vas_dg_detention', name: 'Phí lưu xe chờ hạ bồn xitec / bơm hóa chất vào bồn chứa', unit: 'VND / Giờ', defaultPrice: 250000 },
];

export interface MatrixActiveItem {
  id: string; // id from LOVItem
  value: number; // price for this vehicle
}

export const calculateColumnTotalPrice = (col: Partial<VehiclePricingMatrixColumn>): number => {
  const base = Number(col.baseFreight) || 0;
  const surchargesSum = (col.activeSurcharges || []).reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  return base + surchargesSum;
};

export interface VehiclePricingMatrixColumn {
  id: string;
  truckBodyType: string;
  customTruckBodyType?: string;
  truckTonnage: string;
  customTruckTonnage?: string;
  // 1. Cước chính (Bắt buộc) & phụ phí chọn từ LOV
  baseFreight: number;
  activeSurcharges: MatrixActiveItem[]; // Danh sách các phụ phí đang chọn từ LOV
  totalPrice: number; // baseFreight + sum(activeSurcharges.value)
  // 2. VAS chọn từ LOV
  activeVas: MatrixActiveItem[]; // Danh sách các tiện ích VAS đang chọn từ LOV
  // 3. Cam kết & Điều khoản
  departureSchedule: string; // Lịch chạy & giờ xuất bến theo từng cấu hình xe
  transitTimeDisplay: string;
  freeWaitingHours: number; // Giờ chờ miễn phí (VD: 2 giờ)
  paymentTerms: string;
  validUntil: string;
  notes?: string;

  // Legacy fallback properties for backward compatibility
  fuelBAF?: number;
  tollBOT?: number;
  docManagement?: number;
  customSection1?: any[];
  customSection2?: any[];
  vasGps?: number;
  vasSeal?: number;
  vasPod?: number;
  vasLabor?: number;
  vasTailLift?: number;
  vasMultiDrop?: number;
  vasDetention?: number;
}

export const TRUCKING_SCHEDULE_PRESETS = [
  'Hàng ngày (Daily - Xuất bến 20:00)',
  'Hàng ngày 2 chuyến (11:00 & 20:00)',
  'Hàng ngày (Xuất bến 18:00 - 22:00)',
  'Thứ 2, 4, 6 (Xuất bến 20:00)',
  'Thứ 3, 5, 7 (Xuất bến 20:00)',
  'T2 đến T7 (Nghỉ Chủ Nhật)',
  '2 Chuyến / Ngày (Sáng & Tối)',
  '48 - 60 giờ (Cố định chuyến)',
  '24 - 36 giờ (Cố định chuyến)',
  '10 - 12 giờ (Hỏa tốc liên tỉnh)',
  'Theo yêu cầu khách hàng (On-demand)',
];

export const SCHEDULE_DAYS_OF_WEEK = [
  { id: 'mon', name: 'Thứ 2' },
  { id: 'tue', name: 'Thứ 3' },
  { id: 'wed', name: 'Thứ 4' },
  { id: 'thu', name: 'Thứ 5' },
  { id: 'fri', name: 'Thứ 6' },
  { id: 'sat', name: 'Thứ 7' },
  { id: 'sun', name: 'Chủ Nhật' },
];

export const SCHEDULE_FREQUENCY_PRESETS = [
  { label: 'Hàng ngày (T2 - CN)', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'] },
  { label: 'Thứ 2, 4, 6', days: ['Thứ 2', 'Thứ 4', 'Thứ 6'] },
  { label: 'Thứ 3, 5, 7', days: ['Thứ 3', 'Thứ 5', 'Thứ 7'] },
  { label: 'T2 - T6 (Nghỉ T7, CN)', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'] },
  { label: 'T2 - T7 (Nghỉ CN)', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] },
];

export const SCHEDULE_DEPARTURE_TIMES = [
  { time: '08:00', label: '08:00 Sáng' },
  { time: '11:00', label: '11:00 Trưa' },
  { time: '14:00', label: '14:00 Chiều' },
  { time: '17:00', label: '17:00 Chiều' },
  { time: '19:00', label: '19:00 Tối' },
  { time: '20:00', label: '20:00 Đêm' },
  { time: '22:00', label: '22:00 Khuya' },
];

export const TRUCKING_BODY_TYPES_LOV = [
  'Xe Tải Thùng Kín (Dry Box Truck) - [An ninh cao / Chống ướt]',
  'Xe Tải Mui Bạt (Tarpaulin Truck) - [Mở bạt 2 bên hông]',
  'Xe Tải Có Bửng Nâng Thủy Lực (Tail-lift) - [Bửng nâng tự động]',
  'Xe Tải Thùng Lửng / Mooc Sàn (Flatbed) - [Cẩu hạ từ trên nóc]',
  'Đầu Kéo Kéo Container (Tractor Drayage) - [Kéo vỏ Cont Cảng / ICD]',
];

export const TRUCKING_TONNAGE_BY_BODY_MAP: Record<string, string[]> = {
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
  ],
};

// REEFER BODY TYPES & TONNAGES LOV
export const REEFER_TRUCKING_BODY_TYPES_LOV = [
  'Xe Tải Thùng Đông Lạnh Nhỏ (City Reefer) - [Vào phố / Giao siêu thị]',
  'Xe Tải Thùng Đông Lạnh Trung (Regional Reefer) - [Giàn lạnh Thermo King]',
  'Xe Tải Đông Lạnh Tải Nặng 3 Chân (Long-haul Reefer) - [Trục Bắc Nam / 16-18 Pallets]',
  'Đầu Kéo Kéo Container Lạnh (Reefer Drayage) - [Cont 20RF / 40RF + Genset]',
];

export const REEFER_TRUCKING_TONNAGE_MAP: Record<string, string[]> = {
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

// HAZMAT BODY TYPES & TONNAGES LOV
export const HAZMAT_TRUCKING_BODY_TYPES_LOV = [
  'Xe Tải Thùng Kín Chuyên Dụng Hóa Chất (DG Dry Box) - [Sàn chống tĩnh điện / Tiếp địa]',
  'Xe Bồn Xitec Chuyên Dụng (Chemical Tanker) - [Bồn Inox 316L / Chống tràn]',
  'Đầu Kéo Kéo Bồn ISO Tank / Cont Hóa Chất (Hazmat Drayage) - [ISO Tank T11/T75 Quốc tế]',
];

export const HAZMAT_TRUCKING_TONNAGE_MAP: Record<string, string[]> = {
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

export const createDefaultVehiclePricingColumn = (
  bodyType?: string,
  tonnage?: string,
  basePrice?: number,
  defaultSchedule?: string,
  defaultSla?: string,
  initialSurcharges?: MatrixActiveItem[],
  initialVas?: MatrixActiveItem[],
  cargoType?: 'general' | 'reefer' | 'hazmat'
): VehiclePricingMatrixColumn => {
  const bodyLov = cargoType === 'reefer'
    ? REEFER_TRUCKING_BODY_TYPES_LOV
    : cargoType === 'hazmat'
    ? HAZMAT_TRUCKING_BODY_TYPES_LOV
    : TRUCKING_BODY_TYPES_LOV;

  const tonnageMap = cargoType === 'reefer'
    ? REEFER_TRUCKING_TONNAGE_MAP
    : cargoType === 'hazmat'
    ? HAZMAT_TRUCKING_TONNAGE_MAP
    : TRUCKING_TONNAGE_BY_BODY_MAP;

  const chosenBody = bodyType && bodyLov.includes(bodyType)
    ? bodyType
    : bodyLov[0];

  const availableTonnages = tonnageMap[chosenBody] || [];
  const chosenTonnage = tonnage && availableTonnages.includes(tonnage)
    ? tonnage
    : (availableTonnages[availableTonnages.length - 1] || availableTonnages[0] || '15.0T (Tải nặng 3 chân)');

  const targetTotal = basePrice && basePrice > 0 ? basePrice : (cargoType === 'reefer' ? 22000000 : cargoType === 'hazmat' ? 25000000 : 18500000);
  const base = Math.round(targetTotal * 0.85);
  const baf = Math.round(targetTotal * 0.08);
  const bot = Math.round(targetTotal * 0.05);
  const doc = targetTotal - (base + baf + bot);

  const defaultSurcharges: MatrixActiveItem[] = initialSurcharges
    ? initialSurcharges.map(s => ({
        id: s.id,
        value: s.id === 'fuelBAF' ? baf : s.id === 'tollBOT' ? bot : s.id === 'docManagement' ? (doc > 0 ? doc : 150000) : (s.value || 0),
      }))
    : cargoType === 'reefer'
    ? [
        { id: 'fuelBAF', value: baf },
        { id: 'tollBOT', value: bot },
        { id: 'docManagement', value: doc > 0 ? doc : 150000 },
        { id: 'pref_genset', value: 400000 },
        { id: 'pref_plug_park', value: 500000 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'fuelBAF', value: baf },
        { id: 'tollBOT', value: bot },
        { id: 'docManagement', value: doc > 0 ? doc : 150000 },
        { id: 'phaz_permit', value: 1200000 },
        { id: 'phaz_spill_ppe', value: 0 },
      ]
    : [
        { id: 'fuelBAF', value: baf },
        { id: 'tollBOT', value: bot },
        { id: 'docManagement', value: doc > 0 ? doc : 150000 },
      ];

  const defaultVas: MatrixActiveItem[] = initialVas
    ? initialVas.map(v => ({
        id: v.id,
        value: v.id === 'vasDetention' || v.id === 'vas_cold_detention' || v.id === 'vas_dg_detention' ? 150000 : (v.value || 0),
      }))
    : cargoType === 'reefer'
    ? [
        { id: 'vas_pre_cooling', value: 0 },
        { id: 'vas_iot_temp', value: 0 },
        { id: 'vas_pdf_chart', value: 0 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'vas_dg_crew', value: 0 },
        { id: 'vas_spill_kit', value: 0 },
        { id: 'vas_dg_gps', value: 0 },
      ]
    : [
        { id: 'vasGps', value: 0 },
        { id: 'vasSeal', value: 0 },
        { id: 'vasPod', value: 0 },
        { id: 'vasLabor', value: 0 },
        { id: 'vasTailLift', value: 0 },
        { id: 'vasMultiDrop', value: 0 },
        { id: 'vasDetention', value: 150000 },
      ];

  const col: VehiclePricingMatrixColumn = {
    id: `veh-col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    truckBodyType: chosenBody,
    truckTonnage: chosenTonnage,
    baseFreight: base,
    activeSurcharges: defaultSurcharges,
    totalPrice: 0,
    activeVas: defaultVas,
    departureSchedule: defaultSchedule || 'Hàng ngày (Daily - Xuất bến 20:00)',
    transitTimeDisplay: defaultSla || '2 Ngày (48 Giờ cam kết)',
    freeWaitingHours: 2,
    paymentTerms: 'Net 45 Days',
    validUntil: '2026-12-31',
    notes: '',
    fuelBAF: baf,
    tollBOT: bot,
    docManagement: doc > 0 ? doc : 150000,
    vasGps: 0,
    vasSeal: 0,
    vasPod: 0,
    vasLabor: 0,
    vasTailLift: 0,
    vasMultiDrop: 0,
    vasDetention: 150000,
  };
  col.totalPrice = calculateColumnTotalPrice(col);
  return col;
};

interface TruckingFtlCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CapabilityRouteItem | null;
  onSave: (routeId: string, matrix: VehiclePricingMatrixColumn[]) => void;
  cargoType?: 'general' | 'reefer' | 'hazmat';
  isReadOnly?: boolean;
}

export const TruckingFtlCostMatrixModal: React.FC<TruckingFtlCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  cargoType,
  isReadOnly = false,
}) => {
  const effectiveCargoType: 'general' | 'reefer' | 'hazmat' = 
    cargoType || 
    (route?.cargoType as 'general' | 'reefer' | 'hazmat') || 
    (route?.truckBodyType?.toLowerCase().includes('lạnh') || route?.route?.toLowerCase().includes('lạnh') || route?.vehicleType?.toLowerCase().includes('lạnh')
      ? 'reefer'
      : route?.truckBodyType?.toLowerCase().includes('hóa chất') || route?.truckBodyType?.toLowerCase().includes('xitec') || route?.truckBodyType?.toLowerCase().includes('iso tank') || route?.route?.toLowerCase().includes('hóa chất') || route?.vehicleType?.toLowerCase().includes('hóa chất')
      ? 'hazmat'
      : 'general');

  const activeBodyTypesLov = effectiveCargoType === 'reefer'
    ? REEFER_TRUCKING_BODY_TYPES_LOV
    : effectiveCargoType === 'hazmat'
    ? HAZMAT_TRUCKING_BODY_TYPES_LOV
    : TRUCKING_BODY_TYPES_LOV;

  const activeTonnageMap = effectiveCargoType === 'reefer'
    ? REEFER_TRUCKING_TONNAGE_MAP
    : effectiveCargoType === 'hazmat'
    ? HAZMAT_TRUCKING_TONNAGE_MAP
    : TRUCKING_TONNAGE_BY_BODY_MAP;

  const activeSurchargesLov = effectiveCargoType === 'reefer'
    ? REEFER_SECTION_1_SURCHARGES_LOV
    : effectiveCargoType === 'hazmat'
    ? HAZMAT_SECTION_1_SURCHARGES_LOV
    : TRUCKING_SECTION_1_SURCHARGES_LOV;

  const activeVasLov = effectiveCargoType === 'reefer'
    ? REEFER_SECTION_2_VAS_LOV
    : effectiveCargoType === 'hazmat'
    ? HAZMAT_SECTION_2_VAS_LOV
    : TRUCKING_SECTION_2_VAS_LOV;
  const [columns, setColumns] = useState<VehiclePricingMatrixColumn[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State cho Bảng Lựa Chọn Lịch Chạy (Schedule Picker Modal) theo xe
  const [vehicleScheduleModal, setVehicleScheduleModal] = useState<{
    colId: string;
    colName: string;
    selectedDays: string[];
    departureTime: string;
    applyToAll: boolean;
  } | null>(null);

  const handleOpenScheduleModalForCol = (col: VehiclePricingMatrixColumn) => {
    const currentSchedule = col.departureSchedule || '';
    let days: string[] = [];
    if (currentSchedule.includes('Hàng ngày') || currentSchedule.includes('Daily')) {
      days = SCHEDULE_DAYS_OF_WEEK.map(d => d.name);
    } else {
      days = SCHEDULE_DAYS_OF_WEEK.filter(d => currentSchedule.includes(d.name)).map(d => d.name);
    }
    if (days.length === 0) {
      days = SCHEDULE_DAYS_OF_WEEK.map(d => d.name);
    }

    const timeMatch = currentSchedule.match(/\b(\d{1,2}:\d{2})\b/);
    const time = timeMatch ? timeMatch[1].padStart(5, '0') : '20:00';

    const colName = `${col.truckTonnage ? col.truckTonnage.split(' (')[0] : ''} - ${col.truckBodyType ? col.truckBodyType.split(' (')[0] : ''}`.trim() || 'Cấu hình xe';

    setVehicleScheduleModal({
      colId: col.id,
      colName,
      selectedDays: days,
      departureTime: time,
      applyToAll: false,
    });
  };

  const handleSaveVehicleSchedule = () => {
    if (!vehicleScheduleModal) return;
    const { colId, selectedDays, departureTime, applyToAll } = vehicleScheduleModal;

    const sortedDays = SCHEDULE_DAYS_OF_WEEK.filter(d => selectedDays.includes(d.name)).map(d => d.name);
    let formatted = '';
    if (sortedDays.length === 7) {
      formatted = `Hàng ngày${departureTime ? ` (Xuất bến ${departureTime})` : ''}`;
    } else if (sortedDays.length > 0) {
      formatted = `${sortedDays.join(', ')}${departureTime ? ` (Xuất bến ${departureTime})` : ''}`;
    } else if (departureTime) {
      formatted = `Xuất bến ${departureTime}`;
    } else {
      formatted = 'Hàng ngày (Xuất bến 20:00)';
    }

    if (applyToAll) {
      setColumns(prev => prev.map(c => ({
        ...c,
        departureSchedule: formatted,
      })));
    } else {
      handleUpdateColField(colId, 'departureSchedule', formatted);
    }

    setVehicleScheduleModal(null);
  };

  // Initialize or reload matrix columns from route
  useEffect(() => {
    if (isOpen && route) {
      if (route.vehiclePricingMatrix && route.vehiclePricingMatrix.length > 0) {
        setColumns(
          JSON.parse(JSON.stringify(route.vehiclePricingMatrix)).map((c: any) => {
            // Restore or migrate activeSurcharges from legacy or current data
            let surcharges: MatrixActiveItem[] = [];
            if (Array.isArray(c.activeSurcharges) && c.activeSurcharges.length > 0) {
              surcharges = c.activeSurcharges;
            } else {
              // Migrate from legacy fields if present
              if (c.fuelBAF !== undefined && c.fuelBAF !== null) {
                surcharges.push({ id: 'fuelBAF', value: Number(c.fuelBAF) || 0 });
              }
              if (c.tollBOT !== undefined && c.tollBOT !== null) {
                surcharges.push({ id: 'tollBOT', value: Number(c.tollBOT) || 0 });
              }
              if (c.docManagement !== undefined && c.docManagement !== null) {
                surcharges.push({ id: 'docManagement', value: Number(c.docManagement) || 0 });
              }
              // If empty, initialize standard 3
              if (surcharges.length === 0) {
                const targetTotal = c.totalPrice || c.price || 18500000;
                surcharges = [
                  { id: 'fuelBAF', value: Math.round(targetTotal * 0.08) },
                  { id: 'tollBOT', value: Math.round(targetTotal * 0.05) },
                  { id: 'docManagement', value: 150000 },
                ];
              }
            }

            // Restore or migrate activeVas from legacy or current data
            let vas: MatrixActiveItem[] = [];
            if (Array.isArray(c.activeVas) && c.activeVas.length > 0) {
              vas = c.activeVas;
            } else {
              vas = [
                { id: 'vasGps', value: Number(c.vasGps) || 0 },
                { id: 'vasSeal', value: Number(c.vasSeal) || 0 },
                { id: 'vasPod', value: Number(c.vasPod) || 0 },
                { id: 'vasLabor', value: Number(c.vasLabor) || 0 },
                { id: 'vasTailLift', value: Number(c.vasTailLift) || 0 },
                { id: 'vasMultiDrop', value: Number(c.vasMultiDrop) || 0 },
                { id: 'vasDetention', value: c.vasDetention !== undefined ? Number(c.vasDetention) : 150000 },
              ];
            }

            const col: VehiclePricingMatrixColumn = {
              ...c,
              activeSurcharges: surcharges,
              activeVas: vas,
              departureSchedule: c.departureSchedule || route.departureSchedule || route.sla || 'Hàng ngày (Daily - Xuất bến 20:00)',
            };
            col.totalPrice = calculateColumnTotalPrice(col);
            return col;
          })
        );
      } else {
        const col1 = createDefaultVehiclePricingColumn(
          route.truckBodyType, 
          route.truckTonnage, 
          route.price,
          route.departureSchedule || route.sla,
          route.sla,
          undefined,
          undefined,
          effectiveCargoType
        );
        setColumns([col1]);
      }
    }
  }, [isOpen, route]);

  if (!isOpen || !route) return null;

  // Add new vehicle column
  const handleAddColumn = () => {
    const usedTonnages = columns.map(c => c.truckTonnage);
    let chosenBody = activeBodyTypesLov[0];
    let chosenTonnage = (activeTonnageMap[chosenBody] || [])[0] || '';

    for (const body of activeBodyTypesLov) {
      const tonnages = activeTonnageMap[body] || [];
      const unused = tonnages.find(t => !usedTonnages.includes(t));
      if (unused) {
        chosenBody = body;
        chosenTonnage = unused;
        break;
      }
    }

    const currentSurcharges = columns.length > 0 && columns[0].activeSurcharges
      ? columns[0].activeSurcharges.map(it => ({ ...it, value: 0 }))
      : undefined;
    const currentVas = columns.length > 0 && columns[0].activeVas
      ? columns[0].activeVas.map(it => ({ ...it, value: 0 }))
      : undefined;

    const newCol = createDefaultVehiclePricingColumn(
      chosenBody, 
      chosenTonnage, 
      columns.length > 0 ? Math.round(columns[0].totalPrice * 0.8) : 15000000,
      columns.length > 0 ? columns[0].departureSchedule : route.departureSchedule,
      columns.length > 0 ? columns[0].transitTimeDisplay : route.sla,
      currentSurcharges,
      currentVas,
      effectiveCargoType
    );
    newCol.totalPrice = calculateColumnTotalPrice(newCol);
    setColumns(prev => [...prev, newCol]);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: 'smooth',
        });
      }
    }, 120);
  };

  // Remove vehicle column
  const handleRemoveColumn = (colId: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter(c => c.id !== colId));
  };

  // Update field in column (such as baseFreight, transitTimeDisplay, etc.)
  const handleUpdateColField = <K extends keyof VehiclePricingMatrixColumn>(
    colId: string,
    field: K,
    val: VehiclePricingMatrixColumn[K]
  ) => {
    setColumns(prev =>
      prev.map(c => {
        if (c.id !== colId) return c;
        const updated = { ...c, [field]: val };
        if (field === 'baseFreight') {
          updated.totalPrice = calculateColumnTotalPrice(updated);
        }
        return updated;
      })
    );
  };

  // Thêm phụ phí từ LOV vào tất cả các cột xe
  const handleAddSurchargeFromLOV = (lovId: string) => {
    const lovItem = activeSurchargesLov.find(it => it.id === lovId);
    if (!lovItem) return;

    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeSurcharges || [];
        if (currentList.some(it => it.id === lovId)) return col;
        const defaultVal = lovId === 'fuelBAF' 
          ? Math.round(col.totalPrice * 0.08) 
          : lovId === 'tollBOT' 
          ? Math.round(col.totalPrice * 0.05) 
          : lovId === 'docManagement' 
          ? 150000 
          : (lovItem.defaultPrice || 0);

        const updatedList = [...currentList, { id: lovId, value: defaultVal }];
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        if (lovId === 'fuelBAF') updatedCol.fuelBAF = defaultVal;
        if (lovId === 'tollBOT') updatedCol.tollBOT = defaultVal;
        if (lovId === 'docManagement') updatedCol.docManagement = defaultVal;

        updatedCol.totalPrice = calculateColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Xóa phụ phí khỏi tất cả các cột xe
  const handleDeleteSurcharge = (lovId: string) => {
    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeSurcharges || [];
        const updatedList = currentList.filter(it => it.id !== lovId);
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        if (lovId === 'fuelBAF') updatedCol.fuelBAF = 0;
        if (lovId === 'tollBOT') updatedCol.tollBOT = 0;
        if (lovId === 'docManagement') updatedCol.docManagement = 0;

        updatedCol.totalPrice = calculateColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Cập nhật giá phụ phí cho 1 xe cụ thể
  const handleUpdateSurchargeValue = (colId: string, lovId: string, val: number) => {
    setColumns(prev =>
      prev.map(col => {
        if (col.id !== colId) return col;
        const currentList = col.activeSurcharges || [];
        const updatedList = currentList.map(it =>
          it.id === lovId ? { ...it, value: val } : it
        );
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        if (lovId === 'fuelBAF') updatedCol.fuelBAF = val;
        if (lovId === 'tollBOT') updatedCol.tollBOT = val;
        if (lovId === 'docManagement') updatedCol.docManagement = val;

        updatedCol.totalPrice = calculateColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Thêm dịch vụ VAS từ LOV vào tất cả các cột xe
  const handleAddVasFromLOV = (lovId: string) => {
    const lovItem = activeVasLov.find(it => it.id === lovId);
    if (!lovItem) return;

    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeVas || [];
        if (currentList.some(it => it.id === lovId)) return col;
        const defaultVal = lovItem.defaultPrice || 0;
        const updatedList = [...currentList, { id: lovId, value: defaultVal }];
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Xóa dịch vụ VAS khỏi tất cả các cột xe
  const handleDeleteVas = (lovId: string) => {
    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeVas || [];
        const updatedList = currentList.filter(it => it.id !== lovId);
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Cập nhật giá dịch vụ VAS cho 1 xe cụ thể
  const handleUpdateVasValue = (colId: string, lovId: string, val: number) => {
    setColumns(prev =>
      prev.map(col => {
        if (col.id !== colId) return col;
        const currentList = col.activeVas || [];
        const updatedList = currentList.map(it =>
          it.id === lovId ? { ...it, value: val } : it
        );
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Update body type & reset tonnage to first available
  const handleBodyTypeChange = (colId: string, newBody: string) => {
    const availableTonnages = activeTonnageMap[newBody] || [];
    const firstTonnage = availableTonnages[availableTonnages.length - 1] || availableTonnages[0] || '';
    setColumns(prev =>
      prev.map(c => {
        if (c.id !== colId) return c;
        return {
          ...c,
          truckBodyType: newBody,
          truckTonnage: firstTonnage,
        };
      })
    );
  };

  // Save handler
  const handleSaveMatrix = () => {
    onSave(route.id, columns);
    onClose();
  };

  return (
    <>
      <div
        {...getReadOnlyMatrixInteractionProps(isReadOnly)}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-hidden animate-in fade-in duration-200"
      >
      <style>{`
        .custom-matrix-scroll::-webkit-scrollbar {
          width: 10px;
          height: 12px;
        }
        .custom-matrix-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-top: 1px solid #e2e8f0;
        }
        .custom-matrix-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 6px;
          border: 2px solid #f1f5f9;
        }
        .custom-matrix-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div 
        id="trucking-ftl-cost-matrix-modal"
        className="w-full max-w-[1520px] xl:max-w-[96vw] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col h-[94vh] max-h-[96vh]"
      >
        {/* MODAL HEADER: SLEEK ENTERPRISE DARK INDIGO GRADIENT */}
        <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/50 select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.2 text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 rounded uppercase tracking-wider">
                  Biểu Phí Chi Tiết
                </span>
                <span className="text-xs text-slate-300">Trucking FTL Studio</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <span>Bảng Khai Báo Biểu Phí Đa Phương Tiện Tuyến Vận Tải</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddColumn}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm hover:shadow-indigo-500/30 cursor-pointer"
              title="Thêm một cột cấu hình phương tiện / phân khúc tải trọng khác"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Cấu Hình Xe</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              data-readonly-allow="true"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ROUTE SUMMARY BREADCRUMB BANNER */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase">Mã Tuyến:</span>
              <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs shadow-2xs">
                {route.routeCode || 'RC-FTL-001'}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase">Hành Lang:</span>
              <strong className="text-slate-900 font-bold">{route.route || 'Bắc - Nam'}</strong>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase">Hành Trình:</span>
              <span className="text-slate-800 font-semibold">{route.origin} ➔ {route.destination}</span>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase">Lịch Chạy:</span>
              <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                {route.departureSchedule || route.sla || 'Hàng ngày'}
              </span>
            </div>
          </div>
        </div>

        {/* UNIFIED SPREADSHEET TABLE */}
        <div 
          ref={scrollContainerRef}
          className="custom-matrix-scroll flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto bg-white relative select-text"
          style={{ scrollbarGutter: 'stable' }}
        >
          <table className="border-collapse text-xs text-left border-spacing-0 w-max min-w-full table-fixed">
            {/* COLUMN WIDTH DEFINITIONS */}
            <colgroup>
              <col style={{ width: '320px', minWidth: '320px' }} />
              <col style={{ width: '110px', minWidth: '110px' }} />
              {columns.map(col => (
                <col key={`col-spec-${col.id}`} style={{ width: '270px', minWidth: '270px' }} />
              ))}
            </colgroup>

            {/* TABLE HEADERS (2-TIER WITH CLEAN FREEZE PANES) */}
            <thead>
              {/* TIER 1: TÊN CỘT + LOẠI THÙNG */}
              <tr className="bg-slate-100/90 border-b border-slate-200">
                <th className="sticky top-0 left-0 z-40 bg-slate-100 border-r border-b border-slate-200 px-4 py-2.5 text-slate-800 font-bold uppercase text-[11px] select-none">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-700" />
                    <span>CỘT 1: HẠNG MỤC CHI PHÍ BÁO GIÁ</span>
                  </div>
                </th>

                <th className="sticky top-0 left-[320px] z-40 bg-slate-100 border-r-2 border-b border-slate-300 px-3 py-2.5 text-center text-slate-800 font-bold uppercase text-[11px] select-none shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  CỘT 2: ĐVT
                </th>

                {columns.map((col, idx) => (
                  <th 
                    key={`head-tier1-${col.id}`}
                    className="sticky top-0 z-30 bg-indigo-50/60 border-r border-b border-slate-200 p-2.5 align-top"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-black uppercase text-indigo-950 tracking-wide">
                        CẤU HÌNH XE #{idx + 1}
                      </span>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(col.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa cột xe này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] text-indigo-800 font-bold mb-0.5">LOẠI THÙNG PHƯƠNG TIỆN:</div>
                    <select
                      value={col.truckBodyType}
                      onChange={(e) => handleBodyTypeChange(col.id, e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-slate-300 hover:border-indigo-400 text-xs font-bold text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                      title={col.truckBodyType}
                    >
                      {activeBodyTypesLov.map((body, bIdx) => (
                        <option key={bIdx} value={body}>
                          {body}
                        </option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>

              {/* TIER 2: PHÂN KHÚC TẢI TRỌNG */}
              <tr className="bg-slate-50 border-b-2 border-slate-300">
                <th className="sticky top-[66px] left-0 z-40 bg-slate-50 border-r border-b-2 border-slate-300 px-4 py-2 text-slate-600 font-medium text-[11px] italic select-none">
                  Phân khúc tải trọng tương ứng theo loại thùng:
                </th>

                <th className="sticky top-[66px] left-[320px] z-40 bg-slate-50 border-r-2 border-b-2 border-slate-300 px-3 py-2 text-center text-slate-600 font-medium text-[11px] select-none shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Tấn / CBM
                </th>

                {columns.map((col) => {
                  const availableTonnages = activeTonnageMap[col.truckBodyType] || activeTonnageMap[activeBodyTypesLov[0]] || [];
                  return (
                    <th 
                      key={`head-tier2-${col.id}`}
                      className="sticky top-[66px] z-30 bg-indigo-50/30 border-r border-b-2 border-slate-300 p-2 align-middle"
                    >
                      <div className="text-[10px] text-slate-500 font-bold mb-0.5">PHÂN KHÚC TẢI TRỌNG (TONNAGE):</div>
                      <select
                        value={col.truckTonnage}
                        onChange={(e) => handleUpdateColField(col.id, 'truckTonnage', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-slate-300 hover:border-indigo-400 text-xs font-semibold text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                        title={col.truckTonnage}
                      >
                        {availableTonnages.map((t, tIdx) => (
                          <option key={tIdx} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-200 text-xs">
              {/* ─────────────────────────────────────────────────────────────
                  SECTION 1: CẤU TRÚC ĐƠN GIÁ CƯỚC VẬN CHUYỂN & PHỤ PHÍ CỐ ĐỊNH TUYẾN
              ───────────────────────────────────────────────────────────── */}
              <tr className="bg-indigo-50/70 border-b border-indigo-200">
                <td 
                  colSpan={2 + columns.length} 
                  className="py-2 px-4 text-xs font-black uppercase tracking-wider text-indigo-950 bg-indigo-50/70"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>1. CẤU TRÚC ĐƠN GIÁ CƯỚC VẬN CHUYỂN & PHỤ PHÍ CỐ ĐỊNH TUYẾN</span>
                  </div>
                </td>
              </tr>

              {/* DÒNG TỔNG: ĐƠN GIÁ CHÀO THẦU TỔNG (SEAMLESS ROW) */}
              <tr className="bg-emerald-50/50 border-b-2 border-emerald-200 hover:bg-emerald-50/80 transition-colors">
                <td className="sticky left-0 z-20 bg-emerald-50/90 border-r border-slate-200 px-4 py-3 text-slate-900">
                  <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <span>☀️ Đơn Giá Chào Thầu Tổng (All-in Freight)</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-normal">
                    Tự động cộng dồn: Cước chính + {(columns[0]?.activeSurcharges || []).length} phụ phí tuyến đang chọn
                  </div>
                </td>

                <td className="sticky left-[320px] z-20 bg-emerald-50/90 border-r-2 border-slate-300 px-3 py-3 text-center text-emerald-900 font-bold text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  VND / Chuyến
                </td>

                {columns.map((col) => (
                  <td 
                    key={`total-${col.id}`} 
                    className="border-r border-slate-200 px-4 py-3 text-right bg-emerald-50/40"
                  >
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="font-mono font-black text-base text-emerald-700 tracking-tight">
                        {col.totalPrice.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-600/80">₫ / Chuyến</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 1.1 CƯỚC VẬN CHUYỂN CHÍNH (BẮT BUỘC - KHÔNG THỂ XÓA) */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors bg-white">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span className="truncate">Cước vận chuyển chính (Base Freight)</span>
                      <span className="text-rose-500 font-black">*</span>
                    </div>
                    <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 shrink-0 select-none uppercase tracking-wide">
                      Bắt buộc
                    </span>
                  </div>
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-600 font-semibold text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
                  VND / Chuyến
                </td>
                {columns.map((col) => (
                  <td key={`base-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={col.baseFreight || ''}
                        onChange={(e) => handleUpdateColField(col.id, 'baseFreight', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full py-1.5 pl-3 pr-7 text-right font-mono font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                      />
                      <span className="absolute right-2.5 text-[11px] font-semibold text-slate-400 pointer-events-none">₫</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* CÁC PHỤ PHÍ TUYẾN CHỌN TỪ LOV (CÓ THỂ XÓA - TÊN VÀ ĐVT CỐ ĐỊNH THEO LOV) */}
              {(columns[0]?.activeSurcharges || []).map((surcharge) => {
                const lovItem = activeSurchargesLov.find(it => it.id === surcharge.id) || {
                  id: surcharge.id,
                  name: surcharge.id,
                  unit: 'VND / Chuyến',
                };

                return (
                  <tr key={`surcharge-row-${surcharge.id}`} className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                    <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2 font-medium text-slate-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteSurcharge(surcharge.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                            title={`Xóa phụ phí "${lovItem.name}"`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-slate-400 text-xs shrink-0">•</span>
                          <span className="text-xs font-semibold text-slate-800 truncate" title={lovItem.name}>
                            {lovItem.name}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0 select-none">
                          LOV
                        </span>
                      </div>
                    </td>
                    <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2 text-center text-slate-600 font-medium text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
                      {lovItem.unit}
                    </td>
                    {columns.map((col) => {
                      const itemVal = (col.activeSurcharges || []).find(it => it.id === surcharge.id)?.value || 0;
                      return (
                        <td key={`surcharge-val-${surcharge.id}-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              value={itemVal || ''}
                              onChange={(e) => handleUpdateSurchargeValue(col.id, surcharge.id, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full py-1.5 pl-3 pr-7 text-right font-mono font-medium text-xs text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                            />
                            <span className="absolute right-2.5 text-[11px] font-semibold text-slate-400 pointer-events-none">₫</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* HÀNG THÊM PHỤ PHÍ TỪ DANH MỤC LOV */}
              <tr data-readonly-hide="true" className="bg-slate-50/80 border-b border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r border-slate-200 px-4 py-2">
                  {(() => {
                    const activeIds = (columns[0]?.activeSurcharges || []).map(a => a.id);
                    const unadded = activeSurchargesLov.filter(l => !activeIds.includes(l.id));

                    if (unadded.length === 0) {
                      return (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 py-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Đã thêm toàn bộ phụ phí từ danh mục chuẩn</span>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSurchargeFromLOV(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="w-full px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:border-indigo-400 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                        >
                          <option value="" disabled>+ Chọn phụ phí thêm từ LOV ({unadded.length} mục)...</option>
                          {unadded.map(item => (
                            <option key={item.id} value={item.id}>
                              + {item.name} — [{item.unit}]
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50/95 border-r-2 border-slate-300 px-2 py-2 text-center text-slate-400 text-[10px] font-medium italic shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
                  Theo LOV
                </td>
                <td colSpan={columns.length} className="px-3 py-2 bg-slate-50/40"></td>
              </tr>

              {/* ─────────────────────────────────────────────────────────────
                  SECTION 2: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO
              ───────────────────────────────────────────────────────────── */}
              <tr className="bg-indigo-50/70 border-b border-indigo-200">
                <td 
                  colSpan={2 + columns.length} 
                  className="py-2 px-4 text-xs font-black uppercase tracking-wider text-indigo-950 bg-indigo-50/70"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2. BIỂU PHÍ DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO</span>
                  </div>
                </td>
              </tr>

              {/* CÁC DỊCH VỤ VAS CHỌN TỪ LOV (CÓ THỂ XÓA - TÊN VÀ ĐVT CỐ ĐỊNH THEO LOV) */}
              {(columns[0]?.activeVas || []).map((vas) => {
                const lovItem = activeVasLov.find(it => it.id === vas.id) || {
                  id: vas.id,
                  name: vas.id,
                  unit: 'VND / Chuyến',
                  defaultPrice: 0,
                };

                return (
                  <tr key={`vas-row-${vas.id}`} className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                    <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2 font-medium text-slate-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteVas(vas.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                            title={`Xóa dịch vụ VAS "${lovItem.name}"`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-slate-400 text-xs shrink-0">•</span>
                          <span className="text-xs font-semibold text-slate-800 truncate" title={lovItem.name}>
                            {lovItem.name}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 select-none">
                          VAS
                        </span>
                      </div>
                    </td>
                    <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2 text-center text-slate-600 font-medium text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
                      {lovItem.unit}
                    </td>
                    {columns.map((col) => {
                      const itemVal = (col.activeVas || []).find(it => it.id === vas.id)?.value || 0;
                      const isFree = itemVal === 0;

                      return (
                        <td key={`vas-val-${vas.id}-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="relative flex-1">
                              <input
                                type="number"
                                value={itemVal || ''}
                                onChange={(e) => handleUpdateVasValue(col.id, vas.id, parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full py-1 pl-2.5 pr-5 text-right font-mono text-xs text-slate-800 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">₫</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdateVasValue(col.id, vas.id, isFree ? (lovItem.defaultPrice || 100000) : 0)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer shrink-0 ${
                                isFree
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                              }`}
                              title="Chuyển đổi Miễn phí / Có phí"
                            >
                              {isFree ? 'Miễn phí' : 'Có phí'}
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* HÀNG THÊM DỊCH VỤ VAS TỪ DANH MỤC LOV */}
              <tr data-readonly-hide="true" className="bg-slate-50/80 border-b border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r border-slate-200 px-4 py-2">
                  {(() => {
                    const activeIds = (columns[0]?.activeVas || []).map(a => a.id);
                    const unadded = activeVasLov.filter(l => !activeIds.includes(l.id));

                    if (unadded.length === 0) {
                      return (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 py-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Đã thêm toàn bộ dịch vụ VAS từ danh mục chuẩn</span>
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
                          className="w-full px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:border-indigo-400 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
                        >
                          <option value="" disabled>+ Chọn tiện ích VAS thêm từ LOV ({unadded.length} dịch vụ)...</option>
                          {unadded.map(item => (
                            <option key={item.id} value={item.id}>
                              + {item.name} — [{item.unit}]
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50/95 border-r-2 border-slate-300 px-2 py-2 text-center text-slate-400 text-[10px] font-medium italic shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
                  Theo LOV
                </td>
                <td colSpan={columns.length} className="px-3 py-2 bg-slate-50/40"></td>
              </tr>

{/* ─────────────────────────────────────────────────────────────
                  SECTION 3: CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI
              ───────────────────────────────────────────────────────────── */}
              <tr className="bg-indigo-50/70 border-b border-indigo-200">
                <td 
                  colSpan={2 + columns.length} 
                  className="py-2 px-4 text-xs font-black uppercase tracking-wider text-indigo-950 bg-indigo-50/70"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>3. CAM KẾT VẬN HÀNH & ĐIỀU KHOẢN THƯƠNG MẠI</span>
                  </div>
                </td>
              </tr>

              {/* 3.1 Lịch Chạy & Tần Suất Xuất Bến (Theo từng cấu hình xe) */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors bg-indigo-50/15">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-indigo-950">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>• Lịch chạy & Tần suất xuất bến *</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal pl-5">
                    Nhấp vào ô từng xe để thiết lập bảng lựa chọn
                  </div>
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-600 font-semibold text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Lịch / Giờ
                </td>
                {columns.map((col) => {
                  const hasSched = !!col.departureSchedule;
                  return (
                    <td key={`sched-${col.id}`} className="border-r border-slate-200 px-3 py-2 bg-indigo-50/20">
                      <button
                        type="button"
                        onClick={() => handleOpenScheduleModalForCol(col)}
                        className={`w-full min-h-[40px] px-2.5 py-1.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer shadow-2xs group ${
                          hasSched
                            ? 'bg-white border-indigo-300 text-indigo-950 font-bold hover:border-indigo-500 hover:bg-indigo-50/50 hover:shadow-xs'
                            : 'bg-white border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-600'
                        }`}
                        title="Nhấp để thiết lập bảng lựa chọn lịch chạy và giờ xuất bến"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="truncate block font-bold text-[11.5px] leading-snug">
                            {col.departureSchedule || 'Chọn lịch & giờ chạy...'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium group-hover:text-indigo-600 flex items-center gap-1 mt-0.5">
                            <span>Thiết lập bảng lựa chọn</span>
                            <span className="text-[9px]">✎</span>
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    </td>
                  );
                })}
              </tr>

              {/* 3.2 SLA Thời Gian Vận Chuyển */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  • Thời gian vận chuyển cam kết (SLA)
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Giờ / Ngày
                </td>
                {columns.map((col) => (
                  <td key={`sla-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <input
                      type="text"
                      value={col.transitTimeDisplay || ''}
                      onChange={(e) => handleUpdateColField(col.id, 'transitTimeDisplay', e.target.value)}
                      placeholder="VD: 2 Ngày (48 Giờ cam kết)"
                      className="w-full py-1.5 px-3 text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold shadow-2xs"
                    />
                  </td>
                ))}
              </tr>

              {/* 3.2 Giờ neo xe miễn phí */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  • Giờ neo xe chờ bốc dỡ miễn phí
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Giờ
                </td>
                {columns.map((col) => (
                  <td key={`wait-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <select
                      value={col.freeWaitingHours || 2}
                      onChange={(e) => handleUpdateColField(col.id, 'freeWaitingHours', parseInt(e.target.value) || 2)}
                      className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-indigo-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    >
                      <option value={1}>1 Giờ miễn phí</option>
                      <option value={2}>2 Giờ miễn phí (Chuẩn)</option>
                      <option value={3}>3 Giờ miễn phí</option>
                      <option value={4}>4 Giờ miễn phí</option>
                    </select>
                  </td>
                ))}
              </tr>

              {/* 3.3 Điều khoản thanh toán */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  • Điều khoản thanh toán (Payment Terms)
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Ngày
                </td>
                {columns.map((col) => (
                  <td key={`pay-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <select
                      value={col.paymentTerms || 'Net 45 Days'}
                      onChange={(e) => handleUpdateColField(col.id, 'paymentTerms', e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    >
                      <option value="Net 30 Days">Net 30 Days (30 Ngày sau POD)</option>
                      <option value="Net 45 Days">Net 45 Days (45 Ngày)</option>
                      <option value="Net 60 Days">Net 60 Days (Key Account)</option>
                      <option value="COD">COD (Thanh toán khi giao hàng)</option>
                    </select>
                  </td>
                ))}
              </tr>

              {/* 3.4 Hạn giá Valid Until */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  • Báo giá có hiệu lực đến ngày (Valid Until)
                </td>
                <td className="sticky left-[320px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Ngày
                </td>
                {columns.map((col) => (
                  <td key={`valid-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <input
                      type="date"
                      value={col.validUntil || '2026-12-31'}
                      onChange={(e) => handleUpdateColField(col.id, 'validUntil', e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-end gap-2 shrink-0 shadow-lg select-none">
          <button
            type="button"
            onClick={onClose}
            data-readonly-allow="true"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            {isReadOnly ? 'Đóng' : 'Hủy Bỏ'}
          </button>
          <button
            type="button"
            onClick={handleSaveMatrix}
            data-readonly-hide="true"
            className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow hover:shadow-emerald-600/30 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Cấu Hình Biểu Phí</span>
          </button>
        </div>
      </div>
    </div>

      {/* MODAL: THIẾT LẬP LỊCH CHẠY & GIỜ XUẤT BẾN THEO CẤU HÌNH XE */}
      {vehicleScheduleModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 shadow-indigo-600/20 text-white flex items-center justify-center shadow-md shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cấu Hình Lịch Chạy & Giờ Xuất Bến (Trucking FTL)
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 flex-wrap mt-0.5">
                    <span>Tuyến: <strong className="text-indigo-700">{route?.route || route?.name || route?.routeCode}</strong> ({route?.origin} ⇄ {route?.destination})</span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                      Xe: {vehicleScheduleModal.colName}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVehicleScheduleModal(null)}
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
                    const isSelected = preset.days.every(d => vehicleScheduleModal.selectedDays.includes(d)) && 
                      vehicleScheduleModal.selectedDays.length === preset.days.length;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setVehicleScheduleModal({
                            ...vehicleScheduleModal,
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

              {/* 2. Các Ngày Chạy Trong Tuần (7 Ngày) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    2. Các ngày chạy trong tuần ({vehicleScheduleModal.selectedDays.length}/7 ngày)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (vehicleScheduleModal.selectedDays.length === 7) {
                        setVehicleScheduleModal({ ...vehicleScheduleModal, selectedDays: [] });
                      } else {
                        setVehicleScheduleModal({ ...vehicleScheduleModal, selectedDays: SCHEDULE_DAYS_OF_WEEK.map(d => d.name) });
                      }
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {vehicleScheduleModal.selectedDays.length === 7 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SCHEDULE_DAYS_OF_WEEK.map((day) => {
                    const isChecked = vehicleScheduleModal.selectedDays.includes(day.name);
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
                            let current = [...vehicleScheduleModal.selectedDays];
                            if (e.target.checked) {
                              if (!current.includes(day.name)) current.push(day.name);
                            } else {
                              current = current.filter(d => d !== day.name);
                            }
                            const sorted = SCHEDULE_DAYS_OF_WEEK.filter(d => current.includes(d.name)).map(d => d.name);
                            setVehicleScheduleModal({ ...vehicleScheduleModal, selectedDays: sorted });
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
                    const isChosen = vehicleScheduleModal.departureTime === dt.time;
                    return (
                      <button
                        key={dtIdx}
                        type="button"
                        onClick={() => {
                          setVehicleScheduleModal({
                            ...vehicleScheduleModal,
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
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Hoặc nhập giờ xuất bến khác:
                  </span>
                  <input
                    type="time"
                    value={vehicleScheduleModal.departureTime || '20:00'}
                    onChange={(e) => setVehicleScheduleModal({ ...vehicleScheduleModal, departureTime: e.target.value })}
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
                    {(() => {
                      const days = vehicleScheduleModal.selectedDays;
                      const time = vehicleScheduleModal.departureTime;
                      if (days.length === 7) return `Hàng ngày${time ? ` (Xuất bến ${time})` : ''}`;
                      if (days.length > 0) return `${days.join(', ')}${time ? ` (Xuất bến ${time})` : ''}`;
                      if (time) return `Xuất bến ${time}`;
                      return 'Chưa chọn lịch chạy';
                    })()}
                  </span>
                </div>
              </div>

              {/* 5. Tùy Chọn Áp Dụng Cho Toàn Bộ Cấu Hình Xe */}
              {columns.length > 1 && (
                <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="applyToAllVehicles"
                    checked={vehicleScheduleModal.applyToAll}
                    onChange={(e) => setVehicleScheduleModal({ ...vehicleScheduleModal, applyToAll: e.target.checked })}
                    className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="applyToAllVehicles" className="text-xs font-bold text-indigo-950 cursor-pointer select-none">
                    Áp dụng lịch chạy này cho tất cả {columns.length} cấu hình xe của tuyến
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setVehicleScheduleModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleSaveVehicleSchedule}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Lưu Lịch Chạy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
