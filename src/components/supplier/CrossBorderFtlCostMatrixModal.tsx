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
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Globe,
  MapPin,
  Thermometer,
  AlertTriangle,
  ArrowRight
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

// =========================================================================
// 1. HÀNG THÔNG THƯỜNG (GENERAL CARGO) - LOV CHO PHỤ PHÍ & VAS XUYÊN BIÊN GIỚI
// =========================================================================
export const CB_GENERAL_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu biến động (BAF Cross-Border Fuel)', unit: 'VND / Chuyến' },
  { id: 'tollBOT', name: 'Phí cầu đường cao tốc BOT & Bến bãi hạ tầng cửa khẩu', unit: 'VND / Chuyến' },
  { id: 'docManagement', name: 'Phí chứng từ vận tải quốc tế & Quản lý tờ khai', unit: 'VND / Chuyến' },
  { id: 'cb_yard_transshipment', name: 'Phí sang tải & bến bãi hạ tải tại cửa khẩu', unit: 'VND / Chuyến', defaultPrice: 1500000 },
  { id: 'cb_driver_pilot', name: 'Phí hoa tiêu / Đổi tài xế qua barie biên giới', unit: 'VND / Chuyến', defaultPrice: 600000 },
  { id: 'cb_customs_staging', name: 'Phí hạ bãi chờ kiểm hóa hải quan 2 đầu', unit: 'VND / Chuyến', defaultPrice: 500000 },
  { id: 'cb_border_overnight', name: 'Phí bãi đỗ xe chờ xuất/nhập cảnh qua đêm', unit: 'VND / Đêm', defaultPrice: 350000 },
  { id: 'cb_offhour_clearance', name: 'Phụ phí làm thủ tục thông quan ngoài giờ / ban đêm', unit: 'VND / Chuyến', defaultPrice: 400000 },
  { id: 'cb_peak_season', name: 'Phụ phí cao điểm mùa vụ / Ùn tắc cửa khẩu', unit: 'VND / Chuyến', defaultPrice: 1000000 },
];

export const CB_GENERAL_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'vas_cb_customs_2ends', name: 'Thủ tục hải quan trọn gói 2 đầu biên giới (VN ↔ TQ/Lào/Cam)', unit: 'VND / Bộ', defaultPrice: 2000000 },
  { id: 'vas_cb_co', name: 'Dịch vụ xin cấp C/O tại cửa khẩu (Form D, Form E, Song phương)', unit: 'VND / Bộ', defaultPrice: 800000 },
  { id: 'vas_cb_eseal', name: 'Kẹp chì điện tử định vị Hải quan (e-Seal GPS xuyên quốc gia)', unit: 'VND / Chuyến', defaultPrice: 300000 },
  { id: 'vas_cb_roaming_gps', name: 'Thiết bị GPS Roaming quốc tế & Link tracking live 24/7', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_cb_pod', name: 'Thu hồi chứng từ gốc & Biên bản giao nhận quốc tế (e-POD)', unit: 'VND / Bộ', defaultPrice: 0 },
  { id: 'vas_cb_labor', name: 'Nhân công bốc xếp / Sang bao tại bãi kiểm hóa cửa khẩu', unit: 'VND / Chuyến', defaultPrice: 800000 },
  { id: 'vas_cb_insurance', name: 'Bảo hiểm trách nhiệm hàng hóa liên vận quốc tế (All-Risk)', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_cb_detention', name: 'Phí neo xe chờ bốc dỡ tại kho nước bạn (sau giờ miễn phí)', unit: 'VND / Giờ', defaultPrice: 250000 },
  { id: 'vas_cb_fumigation', name: 'Hun trùng / Khử trùng kiện gỗ tiêu chuẩn ISPM 15 tại cửa khẩu', unit: 'VND / Lô', defaultPrice: 600000 },
];

// =========================================================================
// 2. HÀNG BẢO QUẢN LẠNH (REEFER CARGO) - LOV CHO PHỤ PHÍ & VAS XUYÊN BIÊN GIỚI
// =========================================================================
export const CB_REEFER_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu & máy lạnh chạy buồng buốt liên tục', unit: 'VND / Chuyến' },
  { id: 'tollBOT', name: 'Phí cầu đường BOT & Trạm kiểm dịch liên vận quốc tế', unit: 'VND / Chuyến' },
  { id: 'docManagement', name: 'Phí chứng từ, seal kiểm soát lạnh & quản lý nhiệt độ', unit: 'VND / Chuyến' },
  { id: 'cb_ref_genset', name: 'Máy phát điện Genset dự phòng buồng lạnh dọc tuyến đường', unit: 'VND / Ca', defaultPrice: 500000 },
  { id: 'cb_ref_plug_border', name: 'Phí cắm điện buồng lạnh tại bãi chờ cửa khẩu (Plug-in)', unit: 'VND / Đêm', defaultPrice: 600000 },
  { id: 'cb_ref_phyto_sps', name: 'Phí kiểm dịch thực vật / động vật (SPS) tại cửa khẩu 2 đầu', unit: 'VND / Lô', defaultPrice: 900000 },
  { id: 'cb_ref_green_lane', name: 'Phụ phí làn xanh ưu tiên thông quan nhanh nông sản tươi sống', unit: 'VND / Chuyến', defaultPrice: 500000 },
  { id: 'cb_ref_transshipment', name: 'Phí sang tải kho mát / container lạnh chuyên dụng tại bãi', unit: 'VND / Chuyến', defaultPrice: 2200000 },
  { id: 'cb_ref_border_overnight', name: 'Phí lưu ca đêm buồng lạnh tại bãi kiểm hóa', unit: 'VND / Đêm', defaultPrice: 600000 },
  { id: 'cb_peak_season', name: 'Phụ phí mùa vụ cao điểm nông sản (Sầu riêng, thanh long, mít...)', unit: 'VND / Chuyến', defaultPrice: 1500000 },
];

export const CB_REEFER_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'vas_ref_pre_cooling', name: 'Làm lạnh trước container/thùng xe đạt nhiệt độ cài đặt', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_ref_iot_temp', name: 'Cảm biến IoT nhiệt độ & độ ẩm truyền dữ liệu Real-time 24/7', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_ref_pdf_datalogger', name: 'Xuất biểu đồ dữ liệu nhiệt độ PDF toàn trình (Datalogger)', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_ref_customs_sps', name: 'Dịch vụ khai báo hải quan & Kiểm dịch thực vật SPS trọn gói', unit: 'VND / Lô', defaultPrice: 1500000 },
  { id: 'vas_ref_fumigation', name: 'Khử trùng / Hun trùng nông sản xuất khẩu tại cửa khẩu', unit: 'VND / Lô', defaultPrice: 800000 },
  { id: 'vas_ref_plug_overnight', name: 'Cắm điện lưu đêm tại trạm dừng nghỉ liên vận quốc tế', unit: 'VND / Đêm', defaultPrice: 500000 },
  { id: 'vas_ref_insurance', name: 'Bảo hiểm rủi ro sốc nhiệt / Hư hỏng chuỗi lạnh quốc tế', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_ref_detention', name: 'Phí neo xe chờ dỡ hàng lạnh tại kho đối tác nước bạn', unit: 'VND / Giờ', defaultPrice: 300000 },
  { id: 'vas_ref_cold_labor', name: 'Nhân công bốc xếp kho lạnh / bọc lưới cách nhiệt pallet', unit: 'VND / Chuyến', defaultPrice: 900000 },
];

// =========================================================================
// 3. HÀNG NGUY HIỂM (HAZMAT / DG) - LOV CHO PHỤ PHÍ & VAS XUYÊN BIÊN GIỚI
// =========================================================================
export const CB_HAZMAT_SECTION_1_SURCHARGES_LOV: LOVItem[] = [
  { id: 'fuelBAF', name: 'Phụ phí nhiên liệu biến động (BAF Cross-Border)', unit: 'VND / Chuyến' },
  { id: 'tollBOT', name: 'Phí cầu đường BOT & Bến bãi an toàn DG liên vận', unit: 'VND / Chuyến' },
  { id: 'docManagement', name: 'Phí bộ hồ sơ an toàn hóa chất MSDS & Khai báo DG song ngữ', unit: 'VND / Chuyến' },
  { id: 'cb_haz_transit_permit', name: 'Phí giấy phép vận chuyển quá cảnh hàng nguy hiểm liên quốc gia GMS', unit: 'VND / Lô', defaultPrice: 3500000 },
  { id: 'cb_haz_escort', name: 'Phí xe hộ tống an ninh / Hoa tiêu qua barie biên giới', unit: 'VND / Chuyến', defaultPrice: 1500000 },
  { id: 'cb_haz_fire_safety', name: 'Phí kiểm định an toàn PCCC & Niêm phong áp lực bồn xitec', unit: 'VND / Lần', defaultPrice: 800000 },
  { id: 'cb_haz_placard_un', name: 'Dán biển cảnh báo Placard IMO & Số UN 4 chiều quanh xe', unit: 'VND / Chuyến', defaultPrice: 300000 },
  { id: 'cb_haz_spill_kit', name: 'Bộ ứng cứu tràn đổ hóa chất Spill-Kit & Bình bọt Foam PCCC', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'cb_haz_staging_isolated', name: 'Phí hạ bãi chuyên biệt cách ly hàng nguy hiểm tại cửa khẩu', unit: 'VND / Đêm', defaultPrice: 800000 },
  { id: 'cb_peak_season', name: 'Phụ phí cao điểm mùa vụ', unit: 'VND / Chuyến', defaultPrice: 1200000 },
];

export const CB_HAZMAT_SECTION_2_VAS_LOV: LOVItem[] = [
  { id: 'vas_haz_permit_gms', name: 'Thủ tục xin cấp phép quá cảnh quốc tế GMS chở hàng nguy hiểm', unit: 'VND / Lô', defaultPrice: 3500000 },
  { id: 'vas_haz_customs_dg', name: 'Khai báo hải quan & Kiểm hóa chuyên ngành hóa chất 2 đầu', unit: 'VND / Lô', defaultPrice: 1800000 },
  { id: 'vas_haz_certified_crew', name: 'Tài xế & Áp tải 100% có chứng chỉ an toàn hóa chất quốc tế', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_haz_escort_convoy', name: 'Đoàn xe cảnh giới / Hộ tống an toàn qua cửa khẩu & nội địa', unit: 'VND / Chuyến', defaultPrice: 2000000 },
  { id: 'vas_haz_iso_tank_check', name: 'Kiểm tra áp suất, van xả & tiếp địa bồn ISO Tank định kỳ', unit: 'VND / Lần', defaultPrice: 700000 },
  { id: 'vas_haz_dg_lashing', name: 'Chằng buộc lashing chuyên dụng chống xô lệch IBC / Thùng phuy', unit: 'VND / Xe', defaultPrice: 400000 },
  { id: 'vas_haz_liability', name: 'Bảo hiểm trách nhiệm bồi thường ô nhiễm môi trường & cháy nổ', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_haz_gps_tracking', name: 'Định vị GPS vệ tinh 24/7 & Nút khẩn cấp SOS báo động sự cố', unit: 'VND / Chuyến', defaultPrice: 0 },
  { id: 'vas_haz_detention', name: 'Phí neo xe chờ bơm xả hóa chất / hạ bồn ISO Tank tại nhà máy', unit: 'VND / Giờ', defaultPrice: 350000 },
];

// =========================================================================
// CÁC LOẠI XE / CONTAINER VÀ TRỌNG TẢI DÀNH CHO VẬN TẢI XUYÊN BIÊN GIỚI
// =========================================================================
export const CB_GENERAL_BODY_TYPES_LOV = [
  'Đầu Kéo Kéo Cont 40ft / 45ft Dry Box (Liên vận chạy thẳng / Đổi đầu kéo)',
  'Đầu Kéo Kéo Cont 20ft Dry Box (Liên vận chạy thẳng)',
  'Xe Tải Thùng Kín 15T - 18T (Giấy phép liên vận GMS song phương)',
  'Xe Tải Mui Bạt 15T - 18T (Mở bạt 2 bên hông / Sang tải biên giới)',
  'Xe Tải Thùng Kín 8T - 10T (Chạy chặng ngắn qua cửa khẩu)',
  'Sơ-mi Rơ-moóc Sàn / Thùng Lửng (Flatbed / Lowbed)',
];

export const CB_GENERAL_TONNAGE_MAP: Record<string, string[]> = {
  'Đầu Kéo Kéo Cont 40ft / 45ft Dry Box (Liên vận chạy thẳng / Đổi đầu kéo)': [
    'Cont 40ft DC Tiêu Chuẩn (Tải trọng 26 - 28 Tấn) —— (~67 CBM)',
    'Cont 40ft HC Cao (Tải trọng 26 - 28 Tấn) —— (~76 CBM)',
    'Cont 45ft HC Siêu Dài (Tải trọng 27 - 29 Tấn) —— (~86 CBM)',
  ],
  'Đầu Kéo Kéo Cont 20ft Dry Box (Liên vận chạy thẳng)': [
    'Cont 20ft GP Tiêu Chuẩn (Tải trọng 24 - 26 Tấn) —— (~33 CBM)',
  ],
  'Xe Tải Thùng Kín 15T - 18T (Giấy phép liên vận GMS song phương)': [
    '15.0T (Tải nặng 3 chân thùng kín) —— (55 – 60 CBM)',
    '18.0T – 20.0T (Tải nặng 4-5 chân liên vận) —— (~65 CBM)',
  ],
  'Xe Tải Mui Bạt 15T - 18T (Mở bạt 2 bên hông / Sang tải biên giới)': [
    '15.0T (3 chân mui bạt liên vận) —— (~58 CBM)',
    '18.0T – 20.0T (4-5 chân mui bạt) —— (~65 CBM)',
  ],
  'Xe Tải Thùng Kín 8T - 10T (Chạy chặng ngắn qua cửa khẩu)': [
    '8.0T – 9.0T (Thùng kín 2 chân liên vận) —— (45 – 50 CBM)',
  ],
  'Sơ-mi Rơ-moóc Sàn / Thùng Lửng (Flatbed / Lowbed)': [
    'Mooc Sàn 40ft / Rơ-mooc lửng cẩu hạ (28 - 32 Tấn) —— (Không giới hạn chiều cao)',
  ],
};

export const CB_REEFER_BODY_TYPES_LOV = [
  'Đầu Kéo Kéo Cont Lạnh 40RF / 40RH (Máy lạnh Carrier/Thermo King + Genset)',
  'Đầu Kéo Kéo Cont Lạnh 20RF (Chạy buồng lạnh liên tục)',
  'Xe Tải Đông Lạnh 15T (Liên vận chạy thẳng GMS nông sản)',
  'Xe Tải Thùng Lạnh 8T - 10T (Vận tải trái cây / thực phẩm tươi)',
];

export const CB_REEFER_TONNAGE_MAP: Record<string, string[]> = {
  'Đầu Kéo Kéo Cont Lạnh 40RF / 40RH (Máy lạnh Carrier/Thermo King + Genset)': [
    'Cont 40RH Cao Lạnh (Tải trọng 26 - 28 Tấn) —— (~67 CBM)',
    'Cont 40RF Lạnh Thường (Tải trọng 25 - 27 Tấn) —— (~60 CBM)',
  ],
  'Đầu Kéo Kéo Cont Lạnh 20RF (Chạy buồng lạnh liên tục)': [
    'Cont 20RF Lạnh (Tải trọng 22 - 24 Tấn) —— (~28 CBM)',
  ],
  'Xe Tải Đông Lạnh 15T (Liên vận chạy thẳng GMS nông sản)': [
    '15.0T (3 Chân đông lạnh thùng dài 9.5m) —— (48 – 54 CBM)',
  ],
  'Xe Tải Thùng Lạnh 8T - 10T (Vận tải trái cây / thực phẩm tươi)': [
    '8.0T – 10.0T (Thùng lạnh bảo ôn 2 chân) —— (32 – 38 CBM)',
  ],
};

export const CB_HAZMAT_BODY_TYPES_LOV = [
  'Đầu Kéo Kéo Bồn ISO Tank Hóa Chất (T11 / T50 / T75 Quốc tế)',
  'Xe Bồn Xitec Chuyên Dụng Hóa Chất (Chemical Tanker)',
  'Xe Tải Thùng Kín Chuyên Dụng Hàng Nguy Hiểm (DG Dry Box)',
  'Đầu Kéo Kéo Cont 20ft / 40ft chở hóa chất đóng phuy / IBC',
];

export const CB_HAZMAT_TONNAGE_MAP: Record<string, string[]> = {
  'Đầu Kéo Kéo Bồn ISO Tank Hóa Chất (T11 / T50 / T75 Quốc tế)': [
    'Bồn ISO Tank 20ft T11 (Chứa hóa chất lỏng ăn mòn/độc hại 24.000 Lít)',
    'Bồn ISO Tank 20ft T50 (Khí hóa lỏng LPG/Ammonia)',
  ],
  'Xe Bồn Xitec Chuyên Dụng Hóa Chất (Chemical Tanker)': [
    '15.000 – 22.000 Lít (Bồn Inox 316L 3 ngăn)',
    '28.000 – 32.000 Lít (Mooc bồn Axit/Kiềm liên vận)',
  ],
  'Xe Tải Thùng Kín Chuyên Dụng Hàng Nguy Hiểm (DG Dry Box)': [
    '15.0T (3 Chân tiếp địa chống tĩnh điện) —— (50 – 55 CBM)',
    '18.0T – 20.0T (Tải nặng chuyên chở hàng nguy hiểm)',
  ],
  'Đầu Kéo Kéo Cont 20ft / 40ft chở hóa chất đóng phuy / IBC': [
    'Cont 20ft DG (Tải trọng 24 - 26 Tấn)',
    'Cont 40ft DG (Tải trọng 26 - 28 Tấn)',
  ],
};

export const CROSS_BORDER_TRANSIT_MODES_LOV = [
  'Xe liên vận chạy thẳng',
  'Sang tải tại bãi cửa khẩu',
  'Đổi đầu kéo tại mốc biên giới',
];

export const CROSS_BORDER_CUSTOMS_SCOPES_LOV = [
  'Trọn gói thủ tục HQ hai đầu',
  'Chỉ vận chuyển - Khách tự HQ',
  'Hải quan đầu VN',
  'Hải quan đầu TQ / Lào / Campuchia',
];

export const CB_SCHEDULE_PRESETS = [
  'Hàng ngày (Daily - Xuất bến 20:00)',
  'Hàng ngày 2 chuyến (11:00 & 20:00)',
  'Hàng ngày (Xuất bến 18:00 - 22:00)',
  'Thứ 2, 4, 6 (Xuất bến 20:00)',
  'Thứ 3, 5, 7 (Xuất bến 20:00)',
  'T2 đến T7 (Nghỉ Chủ Nhật)',
  '2 Chuyến / Ngày (Sáng & Tối)',
  '24 - 36 giờ (Cố định chuyến)',
  '48 - 60 giờ (Cố định chuyến)',
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

export interface MatrixActiveItem {
  id: string;
  value: number;
}

export interface CrossBorderVehiclePricingMatrixColumn {
  id: string;
  truckBodyType: string;
  truckTonnage: string;
  transitMode: string;
  customsScope: string;
  pricingUnit: string;
  currency: 'VND' | 'USD';
  // 1. Cước chính (Bắt buộc) & phụ phí chọn từ LOV
  baseFreight: number;
  activeSurcharges: MatrixActiveItem[];
  totalPrice: number;
  // 2. VAS chọn từ LOV
  activeVas: MatrixActiveItem[];
  // 3. Cam kết & Điều khoản
  departureSchedule: string;
  transitTimeDisplay: string;
  freeWaitingHours: number;
  paymentTerms: string;
  validUntil: string;
  notes?: string;
}

export const calculateCrossBorderColumnTotalPrice = (col: Partial<CrossBorderVehiclePricingMatrixColumn>): number => {
  const base = Number(col.baseFreight) || 0;
  const surchargesSum = (col.activeSurcharges || []).reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  return base + surchargesSum;
};

export const createDefaultCrossBorderPricingColumn = (
  bodyType?: string,
  tonnage?: string,
  basePrice?: number,
  defaultSchedule?: string,
  defaultSla?: string,
  initialSurcharges?: MatrixActiveItem[],
  initialVas?: MatrixActiveItem[],
  cargoType?: 'general' | 'reefer' | 'hazmat'
): CrossBorderVehiclePricingMatrixColumn => {
  const bodyLov = cargoType === 'reefer'
    ? CB_REEFER_BODY_TYPES_LOV
    : cargoType === 'hazmat'
    ? CB_HAZMAT_BODY_TYPES_LOV
    : CB_GENERAL_BODY_TYPES_LOV;

  const tonnageMap = cargoType === 'reefer'
    ? CB_REEFER_TONNAGE_MAP
    : cargoType === 'hazmat'
    ? CB_HAZMAT_TONNAGE_MAP
    : CB_GENERAL_TONNAGE_MAP;

  const chosenBody = bodyType && bodyLov.includes(bodyType)
    ? bodyType
    : bodyLov[0];

  const availableTonnages = tonnageMap[chosenBody] || [];
  const chosenTonnage = tonnage && availableTonnages.includes(tonnage)
    ? tonnage
    : (availableTonnages[0] || 'Cont 40ft DC Tiêu Chuẩn (Tải trọng 26 - 28 Tấn) —— (~67 CBM)');

  const targetTotal = basePrice && basePrice > 0 ? basePrice : (cargoType === 'reefer' ? 52000000 : cargoType === 'hazmat' ? 58000000 : 44100000);
  const base = Math.round(targetTotal * 0.82);
  const baf = Math.round(targetTotal * 0.08);
  const bot = Math.round(targetTotal * 0.06);
  const doc = targetTotal - (base + baf + bot);

  const defaultSurcharges: MatrixActiveItem[] = initialSurcharges
    ? initialSurcharges.map(s => ({
        id: s.id,
        value: s.id === 'fuelBAF' ? baf : s.id === 'tollBOT' ? bot : s.id === 'docManagement' ? (doc > 0 ? doc : 350000) : (s.value || 0),
      }))
    : cargoType === 'reefer'
    ? [
        { id: 'fuelBAF', value: baf },
        { id: 'tollBOT', value: bot },
        { id: 'docManagement', value: doc > 0 ? doc : 450000 },
        { id: 'cb_ref_genset', value: 500000 },
        { id: 'cb_ref_plug_border', value: 600000 },
        { id: 'cb_ref_phyto_sps', value: 900000 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'fuelBAF', value: baf },
        { id: 'tollBOT', value: bot },
        { id: 'docManagement', value: doc > 0 ? doc : 500000 },
        { id: 'cb_haz_transit_permit', value: 3500000 },
        { id: 'cb_haz_escort', value: 1500000 },
        { id: 'cb_haz_placard_un', value: 300000 },
      ]
    : [
        { id: 'fuelBAF', value: baf },
        { id: 'tollBOT', value: bot },
        { id: 'docManagement', value: doc > 0 ? doc : 350000 },
        { id: 'cb_yard_transshipment', value: 1500000 },
        { id: 'cb_driver_pilot', value: 600000 },
      ];

  const defaultVas: MatrixActiveItem[] = initialVas
    ? initialVas.map(v => ({
        id: v.id,
        value: v.id === 'vas_cb_detention' || v.id === 'vas_ref_detention' || v.id === 'vas_haz_detention' ? 250000 : (v.value || 0),
      }))
    : cargoType === 'reefer'
    ? [
        { id: 'vas_ref_pre_cooling', value: 0 },
        { id: 'vas_ref_iot_temp', value: 0 },
        { id: 'vas_ref_pdf_datalogger', value: 0 },
        { id: 'vas_ref_customs_sps', value: 1500000 },
        { id: 'vas_ref_insurance', value: 0 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'vas_haz_certified_crew', value: 0 },
        { id: 'vas_haz_permit_gms', value: 3500000 },
        { id: 'vas_haz_customs_dg', value: 1800000 },
        { id: 'vas_haz_gps_tracking', value: 0 },
      ]
    : [
        { id: 'vas_cb_roaming_gps', value: 0 },
        { id: 'vas_cb_pod', value: 0 },
        { id: 'vas_cb_eseal', value: 300000 },
        { id: 'vas_cb_customs_2ends', value: 2000000 },
        { id: 'vas_cb_insurance', value: 0 },
        { id: 'vas_cb_detention', value: 250000 },
      ];

  const col: CrossBorderVehiclePricingMatrixColumn = {
    id: `col-cb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    truckBodyType: chosenBody,
    truckTonnage: chosenTonnage,
    transitMode: CROSS_BORDER_TRANSIT_MODES_LOV[0],
    customsScope: CROSS_BORDER_CUSTOMS_SCOPES_LOV[0],
    pricingUnit: 'Chuyến',
    currency: 'VND',
    baseFreight: base,
    activeSurcharges: defaultSurcharges,
    totalPrice: 0,
    activeVas: defaultVas,
    departureSchedule: defaultSchedule || 'Hàng ngày (Daily - Xuất bến 20:00)',
    transitTimeDisplay: defaultSla || '24 - 36 giờ',
    freeWaitingHours: 3,
    paymentTerms: 'Net 45 Days',
    validUntil: '2026-12-31',
    notes: '',
  };
  col.totalPrice = calculateCrossBorderColumnTotalPrice(col);
  return col;
};

interface CrossBorderFtlCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CapabilityRouteItem | null;
  onSave: (routeId: string, matrix: CrossBorderVehiclePricingMatrixColumn[]) => void;
  cargoType?: 'general' | 'reefer' | 'hazmat';
  isReadOnly?: boolean;
}

export const CrossBorderFtlCostMatrixModal: React.FC<CrossBorderFtlCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  cargoType,
  isReadOnly = false,
}) => {
  const [selectedCargoTab, setSelectedCargoTab] = useState<'general' | 'reefer' | 'hazmat'>('general');

  const effectiveCargoType: 'general' | 'reefer' | 'hazmat' = 
    selectedCargoTab ||
    cargoType || 
    (route?.cargoType as 'general' | 'reefer' | 'hazmat') || 
    (route?.truckBodyType?.toLowerCase().includes('lạnh') || route?.route?.toLowerCase().includes('lạnh') || route?.vehicleType?.toLowerCase().includes('lạnh')
      ? 'reefer'
      : route?.truckBodyType?.toLowerCase().includes('hóa chất') || route?.truckBodyType?.toLowerCase().includes('xitec') || route?.truckBodyType?.toLowerCase().includes('iso tank') || route?.route?.toLowerCase().includes('hóa chất') || route?.vehicleType?.toLowerCase().includes('hóa chất')
      ? 'hazmat'
      : 'general');

  const activeBodyTypesLov = effectiveCargoType === 'reefer'
    ? CB_REEFER_BODY_TYPES_LOV
    : effectiveCargoType === 'hazmat'
    ? CB_HAZMAT_BODY_TYPES_LOV
    : CB_GENERAL_BODY_TYPES_LOV;

  const activeTonnageMap = effectiveCargoType === 'reefer'
    ? CB_REEFER_TONNAGE_MAP
    : effectiveCargoType === 'hazmat'
    ? CB_HAZMAT_TONNAGE_MAP
    : CB_GENERAL_TONNAGE_MAP;

  const activeSurchargesLov = effectiveCargoType === 'reefer'
    ? CB_REEFER_SECTION_1_SURCHARGES_LOV
    : effectiveCargoType === 'hazmat'
    ? CB_HAZMAT_SECTION_1_SURCHARGES_LOV
    : CB_GENERAL_SECTION_1_SURCHARGES_LOV;

  const activeVasLov = effectiveCargoType === 'reefer'
    ? CB_REEFER_SECTION_2_VAS_LOV
    : effectiveCargoType === 'hazmat'
    ? CB_HAZMAT_SECTION_2_VAS_LOV
    : CB_GENERAL_SECTION_2_VAS_LOV;

  const [columns, setColumns] = useState<CrossBorderVehiclePricingMatrixColumn[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State cho Bảng Lựa Chọn Lịch Chạy (Schedule Picker Modal) theo xe
  const [vehicleScheduleModal, setVehicleScheduleModal] = useState<{
    colId: string;
    colName: string;
    selectedDays: string[];
    departureTime: string;
    applyToAll: boolean;
  } | null>(null);

  const handleOpenScheduleModalForCol = (col: CrossBorderVehiclePricingMatrixColumn) => {
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

  // Sync cargo tab from route or prop
  useEffect(() => {
    if (route) {
      const detected: 'general' | 'reefer' | 'hazmat' =
        cargoType ||
        (route?.cargoType as 'general' | 'reefer' | 'hazmat') ||
        (route?.truckBodyType?.toLowerCase().includes('lạnh') || route?.route?.toLowerCase().includes('lạnh') || route?.vehicleType?.toLowerCase().includes('lạnh')
          ? 'reefer'
          : route?.truckBodyType?.toLowerCase().includes('hóa chất') || route?.truckBodyType?.toLowerCase().includes('xitec') || route?.truckBodyType?.toLowerCase().includes('iso tank') || route?.route?.toLowerCase().includes('hóa chất') || route?.vehicleType?.toLowerCase().includes('hóa chất')
          ? 'hazmat'
          : 'general');
      setSelectedCargoTab(detected);
    }
  }, [route, cargoType]);

  // Initialize or reload matrix columns from route
  useEffect(() => {
    if (isOpen && route) {
      if (route.vehiclePricingMatrix && route.vehiclePricingMatrix.length > 0) {
        setColumns(
          JSON.parse(JSON.stringify(route.vehiclePricingMatrix)).map((c: any) => {
            let surcharges: MatrixActiveItem[] = [];
            if (Array.isArray(c.activeSurcharges) && c.activeSurcharges.length > 0) {
              surcharges = c.activeSurcharges;
            } else {
              const targetTotal = c.totalPrice || c.price || 44100000;
              surcharges = [
                { id: 'fuelBAF', value: Math.round(targetTotal * 0.08) },
                { id: 'tollBOT', value: Math.round(targetTotal * 0.06) },
                { id: 'docManagement', value: 350000 },
                { id: 'cb_yard_transshipment', value: 1500000 },
                { id: 'cb_driver_pilot', value: 600000 },
              ];
            }

            let vas: MatrixActiveItem[] = [];
            if (Array.isArray(c.activeVas) && c.activeVas.length > 0) {
              vas = c.activeVas;
            } else {
              vas = [
                { id: 'vas_cb_roaming_gps', value: 0 },
                { id: 'vas_cb_pod', value: 0 },
                { id: 'vas_cb_eseal', value: 300000 },
                { id: 'vas_cb_customs_2ends', value: 2000000 },
                { id: 'vas_cb_insurance', value: 0 },
                { id: 'vas_cb_detention', value: 250000 },
              ];
            }

            const col: CrossBorderVehiclePricingMatrixColumn = {
              id: c.id || `col-cb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              truckBodyType: c.truckBodyType || activeBodyTypesLov[0],
              truckTonnage: c.truckTonnage || (activeTonnageMap[c.truckBodyType] || [])[0] || '',
              transitMode: c.transitMode || CROSS_BORDER_TRANSIT_MODES_LOV[0],
              customsScope: c.customsScope || CROSS_BORDER_CUSTOMS_SCOPES_LOV[0],
              pricingUnit: c.pricingUnit || 'Chuyến',
              currency: c.currency || 'VND',
              baseFreight: Number(c.baseFreight) || Math.round((c.totalPrice || 44100000) * 0.82),
              activeSurcharges: surcharges,
              totalPrice: 0,
              activeVas: vas,
              departureSchedule: c.departureSchedule || route.departureSchedule || route.sla || 'Hàng ngày (Daily - Xuất bến 20:00)',
              transitTimeDisplay: c.transitTimeDisplay || route.sla || '24 - 36 giờ',
              freeWaitingHours: c.freeWaitingHours || 3,
              paymentTerms: c.paymentTerms || 'Net 45 Days',
              validUntil: c.validUntil || '2026-12-31',
              notes: c.notes || '',
            };
            col.totalPrice = calculateCrossBorderColumnTotalPrice(col);
            return col;
          })
        );
      } else {
        const col1 = createDefaultCrossBorderPricingColumn(
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
  }, [isOpen, route, selectedCargoTab]);

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

    const newCol = createDefaultCrossBorderPricingColumn(
      chosenBody, 
      chosenTonnage, 
      columns.length > 0 ? Math.round(columns[0].totalPrice * 0.9) : 38000000,
      columns.length > 0 ? columns[0].departureSchedule : route.departureSchedule,
      columns.length > 0 ? columns[0].transitTimeDisplay : route.sla,
      currentSurcharges,
      currentVas,
      effectiveCargoType
    );
    newCol.totalPrice = calculateCrossBorderColumnTotalPrice(newCol);
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

  // Update field in column
  const handleUpdateColField = <K extends keyof CrossBorderVehiclePricingMatrixColumn>(
    colId: string,
    field: K,
    val: CrossBorderVehiclePricingMatrixColumn[K]
  ) => {
    setColumns(prev =>
      prev.map(c => {
        if (c.id !== colId) return c;
        const updated = { ...c, [field]: val };
        if (field === 'baseFreight') {
          updated.totalPrice = calculateCrossBorderColumnTotalPrice(updated);
        }
        return updated;
      })
    );
  };

  // Handle body type change with automatic tonnage realignment
  const handleBodyTypeChange = (colId: string, newBody: string) => {
    const tonnages = activeTonnageMap[newBody] || [];
    const firstTonnage = tonnages[0] || '';
    setColumns(prev =>
      prev.map(c => {
        if (c.id !== colId) return c;
        const updated = {
          ...c,
          truckBodyType: newBody,
          truckTonnage: firstTonnage,
        };
        return updated;
      })
    );
  };

  // Switch cargo group tab and auto-reinitialize template
  const handleSwitchCargoTab = (tab: 'general' | 'reefer' | 'hazmat') => {
    setSelectedCargoTab(tab);
    const newBodyLov = tab === 'reefer'
      ? CB_REEFER_BODY_TYPES_LOV
      : tab === 'hazmat'
      ? CB_HAZMAT_BODY_TYPES_LOV
      : CB_GENERAL_BODY_TYPES_LOV;

    const newTonnageMap = tab === 'reefer'
      ? CB_REEFER_TONNAGE_MAP
      : tab === 'hazmat'
      ? CB_HAZMAT_TONNAGE_MAP
      : CB_GENERAL_TONNAGE_MAP;

    const firstBody = newBodyLov[0];
    const firstTonnage = (newTonnageMap[firstBody] || [])[0] || '';

    const newCol = createDefaultCrossBorderPricingColumn(
      firstBody,
      firstTonnage,
      tab === 'reefer' ? 52000000 : tab === 'hazmat' ? 58000000 : 44100000,
      columns[0]?.departureSchedule,
      columns[0]?.transitTimeDisplay,
      undefined,
      undefined,
      tab
    );
    setColumns([newCol]);
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
          ? Math.round(col.totalPrice * 0.06) 
          : lovId === 'docManagement' 
          ? 350000 
          : (lovItem.defaultPrice || 0);

        const updatedList = [...currentList, { id: lovId, value: defaultVal }];
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        updatedCol.totalPrice = calculateCrossBorderColumnTotalPrice(updatedCol);
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
        updatedCol.totalPrice = calculateCrossBorderColumnTotalPrice(updatedCol);
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
        updatedCol.totalPrice = calculateCrossBorderColumnTotalPrice(updatedCol);
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
        const defaultVal = lovItem.defaultPrice !== undefined ? lovItem.defaultPrice : 0;
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
        return {
          ...col,
          activeVas: currentList.filter(it => it.id !== lovId),
        };
      })
    );
  };

  // Cập nhật giá VAS cho 1 xe cụ thể
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

  // Save and notify parent
  const handleSaveMatrix = () => {
    onSave(route.id, columns);
    onClose();
  };

  return (
    <div
      {...getReadOnlyMatrixInteractionProps(isReadOnly)}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-hidden animate-in fade-in duration-150"
    >
      <div className="w-full max-w-[96vw] 2xl:max-w-[1560px] h-[94vh] max-h-[95vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150">
        
        {/* TOP HEADER - ĐỒNG BỘ PHONG CÁCH TRUCKING FTL STUDIO */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0 select-none">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Biểu Phí Tuyến Vận Tải Xuyên Biên Giới</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* CARGO GROUP SELECTOR TABS */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => handleSwitchCargoTab('general')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCargoTab === 'general'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title="Hàng bách hóa thông thường"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Hàng Thường</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchCargoTab('reefer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCargoTab === 'reefer'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title="Hàng bảo quản lạnh, nông thủy sản"
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>Hàng Lạnh</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchCargoTab('hazmat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCargoTab === 'hazmat'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title="Hàng hóa chất / Hàng nguy hiểm (DG)"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Hàng Nguy Hiểm (DG)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddColumn}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm hover:shadow-indigo-500/30 cursor-pointer"
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
                {route.routeCode || 'CB-FTL-001'}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase">Hành Lang:</span>
              <strong className="text-slate-900 font-bold">{route.route || 'Việt Nam ⇄ Quốc Tế'}</strong>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase">Hành Trình:</span>
              <span className="text-slate-800 font-semibold">{route.origin} ➔ {route.destination}</span>
            </div>
          </div>
        </div>

        {/* UNIFIED SPREADSHEET TABLE (PIVOT MATRIX) */}
        <div 
          ref={scrollContainerRef}
          className="custom-matrix-scroll flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto bg-white relative select-text"
          style={{ scrollbarGutter: 'stable' }}
        >
          <table className="border-collapse text-xs text-left border-spacing-0 table-fixed" style={{ width: 'max-content' }}>
            {/* COLUMN WIDTH DEFINITIONS */}
            <colgroup>
              <col style={{ width: '330px', minWidth: '330px', maxWidth: '330px' }} />
              <col style={{ width: '110px', minWidth: '110px', maxWidth: '110px' }} />
              {columns.map(col => (
                <col key={`col-spec-${col.id}`} style={{ width: '280px', minWidth: '280px', maxWidth: '280px' }} />
              ))}
            </colgroup>

            {/* TABLE HEADERS (2-TIER + SUB-ROW WITH CLEAN FREEZE PANES) */}
            <thead>
              {/* TIER 1: TÊN CỘT + LOẠI THÙNG PHƯƠNG TIỆN */}
              <tr className="bg-slate-100/90 border-b border-slate-200">
                <th className="sticky top-0 left-0 z-40 bg-slate-100 border-r border-b border-slate-200 px-4 py-2.5 text-slate-800 font-bold uppercase text-[11px] select-none">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-700" />
                    <span>CỘT 1: HẠNG MỤC CHI PHÍ BÁO GIÁ</span>
                  </div>
                </th>

                <th className="sticky top-0 left-[330px] z-40 bg-slate-100 border-r-2 border-b border-slate-300 px-3 py-2.5 text-center text-slate-800 font-bold uppercase text-[11px] select-none shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
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
                      className="w-full h-8 px-2 bg-white border border-slate-300 hover:border-indigo-400 text-xs font-bold text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs truncate"
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

              {/* TIER 2: PHÂN KHÚC TẢI TRỌNG / QUY CÁCH CONT */}
              <tr className="bg-slate-50 border-b-2 border-slate-300">
                <th className="sticky top-[66px] left-0 z-40 bg-slate-50 border-r border-b-2 border-slate-300 px-4 py-2 text-slate-600 font-medium text-[11px] italic select-none">
                  Phân khúc tải trọng tương ứng theo loại thùng:
                </th>

                <th className="sticky top-[66px] left-[330px] z-40 bg-slate-50 border-r-2 border-b-2 border-slate-300 px-3 py-2 text-center text-slate-600 font-medium text-[11px] select-none shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
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
                        className="w-full h-8 px-2 bg-white border border-slate-300 hover:border-indigo-400 text-xs font-semibold text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs truncate"
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

              {/* DÒNG TỔNG: ĐƠN GIÁ CHÀO THẦU TỔNG (ALL-IN FREIGHT) */}
              <tr className="bg-emerald-50/50 border-b-2 border-emerald-200 hover:bg-emerald-50/80 transition-colors">
                <td className="sticky left-0 z-20 bg-emerald-50/90 border-r border-slate-200 px-4 py-3 text-slate-900">
                  <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <span>☀️ Đơn Giá Chào Thầu Tổng (All-in Freight)</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-normal">
                    Tự động cộng dồn: Cước chính + {(columns[0]?.activeSurcharges || []).length} phụ phí tuyến đang chọn
                  </div>
                </td>

                <td className="sticky left-[330px] z-20 bg-emerald-50/90 border-r-2 border-slate-300 px-3 py-3 text-center text-emerald-900 font-bold text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
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
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-600 font-semibold text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
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
                    <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2 text-center text-slate-600 font-medium text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
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
                <td className="sticky left-[330px] z-20 bg-slate-50/95 border-r-2 border-slate-300 px-2 py-2 text-center text-slate-400 text-[10px] font-medium italic shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
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
                    <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2 text-center text-slate-600 font-medium text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
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
                              onClick={() => handleUpdateVasValue(col.id, vas.id, isFree ? (lovItem.defaultPrice || 300000) : 0)}
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
                <td className="sticky left-[330px] z-20 bg-slate-50/95 border-r-2 border-slate-300 px-2 py-2 text-center text-slate-400 text-[10px] font-medium italic shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] select-none">
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

              {/* 3.1 Lịch Chạy & Tần Suất Xuất Bến */}
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
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-600 font-semibold text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
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
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Giờ / Ngày
                </td>
                {columns.map((col) => (
                  <td key={`sla-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <input
                      type="text"
                      value={col.transitTimeDisplay || ''}
                      onChange={(e) => handleUpdateColField(col.id, 'transitTimeDisplay', e.target.value)}
                      placeholder="VD: 24 - 36 giờ"
                      className="w-full py-1.5 px-3 text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold shadow-2xs"
                    />
                  </td>
                ))}
              </tr>

              {/* 3.3 Phương thức vượt biên */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  <div className="font-semibold text-slate-900">• Phương thức vượt biên</div>
                  <div className="text-[10.5px] text-slate-500 font-normal">
                    Liên vận chạy thẳng / Sang tải tại bãi / Đổi đầu kéo
                  </div>
                </td>
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-600 font-medium text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Phương thức
                </td>
                {columns.map((col) => (
                  <td key={`transit-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <select
                      value={col.transitMode || CROSS_BORDER_TRANSIT_MODES_LOV[0]}
                      onChange={(e) => handleUpdateColField(col.id, 'transitMode', e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    >
                      {CROSS_BORDER_TRANSIT_MODES_LOV.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>

              {/* 3.4 Phạm vi thủ tục hải quan */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  <div className="font-semibold text-slate-900">• Phạm vi thủ tục hải quan</div>
                  <div className="text-[10.5px] text-slate-500 font-normal">
                    Trọn gói 2 đầu / Khách tự HQ / HQ đầu VN hoặc nước bạn
                  </div>
                </td>
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-600 font-medium text-xs shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Phạm vi HQ
                </td>
                {columns.map((col) => (
                  <td key={`customs-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <select
                      value={col.customsScope || CROSS_BORDER_CUSTOMS_SCOPES_LOV[0]}
                      onChange={(e) => handleUpdateColField(col.id, 'customsScope', e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    >
                      {CROSS_BORDER_CUSTOMS_SCOPES_LOV.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>

              {/* 3.3 Giờ neo xe miễn phí tại bãi/cửa khẩu */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  • Giờ neo xe chờ bốc dỡ & kiểm hóa miễn phí
                </td>
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Giờ
                </td>
                {columns.map((col) => (
                  <td key={`wait-${col.id}`} className="border-r border-slate-200 px-3 py-1.5">
                    <select
                      value={col.freeWaitingHours || 3}
                      onChange={(e) => handleUpdateColField(col.id, 'freeWaitingHours', parseInt(e.target.value) || 3)}
                      className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-indigo-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    >
                      <option value={1}>1 Giờ miễn phí</option>
                      <option value={2}>2 Giờ miễn phí</option>
                      <option value={3}>3 Giờ miễn phí (Chuẩn XBG)</option>
                      <option value={4}>4 Giờ miễn phí</option>
                      <option value={6}>6 Giờ miễn phí (Có làm HQ)</option>
                    </select>
                  </td>
                ))}
              </tr>

              {/* 3.4 Điều khoản thanh toán */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  • Điều khoản thanh toán (Payment Terms)
                </td>
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
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
                      <option value="COD">COD (Thanh toán khi giao nhận biên giới)</option>
                    </select>
                  </td>
                ))}
              </tr>

              {/* 3.5 Hạn giá Valid Until */}
              <tr className="border-b border-slate-200 hover:bg-indigo-50/20 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-medium text-slate-800">
                  • Báo giá có hiệu lực đến ngày (Valid Until)
                </td>
                <td className="sticky left-[330px] z-20 bg-slate-50 border-r-2 border-slate-300 px-3 py-2.5 text-center text-slate-500 font-medium shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
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
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 shadow-lg select-none">
          <div className="text-[11px] text-slate-500 italic">
            * Lưu ý: Biểu phí All-in đã bao gồm Cước chính + Phụ phí cố định đã chọn. VAS tính phí riêng khi phát sinh thực tế.
          </div>

          <div className="flex items-center gap-2">
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
                    Cấu Hình Lịch Chạy & Giờ Xuất Bến Xuyên Biên Giới (Cross-Border FTL)
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 flex-wrap mt-0.5">
                    <span>Tuyến: <strong className="text-indigo-700">{route?.route || route?.name || route?.routeCode}</strong></span>
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
                          {dt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Hoặc tự nhập giờ xuất bến:</span>
                  <input
                    type="time"
                    value={vehicleScheduleModal.departureTime}
                    onChange={(e) => {
                      setVehicleScheduleModal({
                        ...vehicleScheduleModal,
                        departureTime: e.target.value,
                      });
                    }}
                    className="px-2.5 py-1 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* 4. Áp dụng cho tất cả cấu hình xe */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={vehicleScheduleModal.applyToAll}
                    onChange={(e) => {
                      setVehicleScheduleModal({
                        ...vehicleScheduleModal,
                        applyToAll: e.target.checked,
                      });
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Áp dụng lịch chạy này cho tất cả ({columns.length}) cấu hình xe trên tuyến</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setVehicleScheduleModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveVehicleSchedule}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Xác Nhận Lịch Chạy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
