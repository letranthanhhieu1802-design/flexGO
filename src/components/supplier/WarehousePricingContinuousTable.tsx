import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Check, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Package, 
  Layers, 
  Boxes,
  Percent,
  Clock,
  Calendar,
  AlertCircle,
  X,
  PlusCircle,
  Edit2,
  HelpCircle,
  Maximize2,
  Minimize2,
  ChevronDown
} from 'lucide-react';
import { WarehouseDetailModalData, PaidSurchargeItem, CapabilityVasItem } from './SupplierServiceCapabilityModal';

export interface WarehouseMatrixColumn {
  id: string;
  name: string;
  unit: string;
  typeKey?: 'area' | 'pallets' | 'volume' | 'custom';
  isCustom?: boolean;
}

export const GENERAL_FREE_UTILITIES_SUGGESTIONS = [
  'Bảo vệ 24/7 & Camera an ninh CCTV giám sát',
  'Hệ thống PCCC tự động Sprinkler đạt chuẩn',
  'Phần mềm WMS quản lý tồn kho Real-time',
  'Miễn phí lưu bãi xe container 2 giờ đầu',
  'Bảo hiểm cháy nổ nhà kho 100%',
  'Chiếu sáng LED công nghiệp tiết kiệm điện',
  'Vệ sinh môi trường & Diệt côn trùng định kỳ (Pest Control)',
  'Hệ thống kiểm soát nhiệt độ & độ ẩm tự động',
];

export const COLD_FREE_UTILITIES_SUGGESTIONS = [
  'Bảo vệ 24/7 & Camera an ninh CCTV buồng lạnh',
  'Hệ thống điện 3 pha & máy phát ATS dự phòng cấp điện tức thì',
  'Hệ thống cảm biến IoT giám sát nhiệt độ tự động Real-time',
  'Cửa Dock lạnh có đệm khí che chắn (Dock Shelter) chống thoát nhiệt',
  'Bảo hiểm suy giảm chất lượng chuỗi lạnh 100%',
  'Chiếu sáng LED chuyên dụng môi trường âm sâu chống nổ',
  'Vệ sinh diệt khuẩn buồng lạnh & xả đá định kỳ theo chuẩn HACCP',
  'Phần mềm WMS quản lý hạn sử dụng FIFO/FEFO và xuất biểu đồ nhiệt',
];

export const HAZMAT_FREE_UTILITIES_SUGGESTIONS = [
  'Bảo vệ 2 lớp & Camera giám sát an ninh phòng nổ Ex-proof 24/7',
  'Hệ thống PCCC tự động bọt Foam chuyên dụng đã nghiệm thu',
  'Sàn bê tông Epoxy kháng axit/kiềm & rãnh thu gom chống tràn độc lập',
  'Trang bị bồn rửa mắt và vòi tắm khẩn cấp (Emergency Eyewash & Shower)',
  'Hệ thống thông gió chống nổ cưỡng bức kiểm soát nồng độ LEL 24/7',
  'Bộ Spill-Kit ứng phó sự cố tràn đổ hóa chất túc trực 24/7',
  'Bảo hiểm trách nhiệm bồi thường thiệt hại môi trường 100%',
  'Phần mềm WMS quản lý ma trận tương thích hóa chất & cảnh báo MSDS',
];

export const WAREHOUSE_FREE_UTILITIES_SUGGESTIONS = GENERAL_FREE_UTILITIES_SUGGESTIONS;

export const BONDED_GENERAL_FREE_UTILITIES_SUGGESTIONS = [
  'Hệ thống Camera an ninh CCTV kết nối trực tiếp Chi cục Hải quan 24/7 (TT 38/39/BTC)',
  'Phần mềm WMS quản lý theo dõi tờ khai điện tử VNACCS/VCIS và thời hạn lưu kho ngoại quan',
  'Báo cáo định kỳ tồn kho và hỗ trợ thủ tục thanh khoản tờ khai E52/E54 gửi cơ quan Hải quan',
  'Trang bị phòng làm việc, thiết bị văn phòng và máy vi tính cho công chức Hải quan thường trực',
  'Miễn phí lưu bãi xe container 2 giờ đầu chờ kiểm tra kẹp chì seal hải quan',
  'Hệ thống PCCC tự động Sprinkler và biên bản nghiệm thu an ninh trật tự kho ngoại quan',
  'Bãi đỗ xe container rộng rãi chờ làm thủ tục thông quan và tiếp nhận xe 24/7',
  'Trang bị công cụ quét mã Barcode/QR đối chiếu Master/House Air Waybill & B/L',
];

export const BONDED_COLD_FREE_UTILITIES_SUGGESTIONS = [
  'Hệ thống cảm biến IoT trích xuất biểu đồ nhiệt độ tự động gửi cơ quan Kiểm dịch & Hải quan',
  'Camera buồng lạnh và cửa dock Inflatable Shelter kết nối giám sát Hải quan 24/7',
  'Máy phát điện ATS dự phòng 100% công suất bảo đảm chuỗi lạnh không đứt gãy',
  'Khu vực phòng đệm Antechamber kiểm tra cảm quan hàng đông lạnh phục vụ kiểm dịch',
  'Chiếu sáng LED chuyên dụng môi trường âm sâu chống nổ',
  'Vệ sinh diệt khuẩn buồng lạnh & xả đá định kỳ theo chuẩn HACCP kiểm dịch',
  'Phần mềm WMS quản lý nhiệt độ âm/dương theo từng lô hàng tờ khai hải quan',
  'Báo cáo định kỳ tồn kho hàng lạnh tạm nhập tái xuất gửi Chi cục Hải quan',
];

export const BONDED_HAZMAT_FREE_UTILITIES_SUGGESTIONS = [
  'Camera an ninh phòng nổ Ex-proof kết nối cơ quan Hải quan & PCCC giám sát 24/7',
  'Hệ thống PCCC tự động bọt Foam AFFF chuyên dụng dập cháy dung môi hóa chất',
  'Phần mềm WMS quản lý danh mục hóa chất nguy hiểm, mã UN và lưu trữ hồ sơ MSDS điện tử',
  'Trang bị trạm tắm/rửa mắt khẩn cấp và bộ Spill-Kit ứng phó sự cố hóa chất tại chỗ',
  'Sàn bê tông Epoxy kháng axit/kiềm & rãnh thu gom chống tràn độc lập',
  'Hệ thống thông gió chống nổ cưỡng bức kiểm soát nồng độ LEL 24/7',
  'Bảo hiểm trách nhiệm bồi thường thiệt hại môi trường và kho ngoại quan 100%',
  'Hỗ trợ khai báo hóa chất một cửa quốc gia NSW kết nối tờ khai Hải quan',
];

export const GENERAL_PRESET_WAREHOUSE_COLUMNS: Array<{ name: string; unit: string }> = [
  { name: 'Tải Trọng Sàn (Tấn)', unit: 'Tấn' },
  { name: 'Kệ Selective (Pallet)', unit: 'Pallet' },
  { name: 'Kệ Drive-In (Pallet)', unit: 'Pallet' },
  { name: 'Khu Vực Mezzanine (m²)', unit: 'm²' },
  { name: 'Kho Mát 18°C - 25°C (m²)', unit: 'm²' },
  { name: 'Bãi Đỗ Xe & Kho Hở (m²)', unit: 'm²' },
];

export const COLD_PRESET_WAREHOUSE_COLUMNS: Array<{ name: string; unit: string }> = [
  { name: 'Kho Đông Lạnh (-18°C ~ -25°C) (Pallet)', unit: 'Pallet' },
  { name: 'Kho Mát (+2°C ~ +8°C) (Pallet)', unit: 'Pallet' },
  { name: 'Kho Điều Hòa (+15°C ~ +22°C) (m³)', unit: 'm³' },
  { name: 'Kho Cấp Đông Sâu (-40°C) (Tấn)', unit: 'Tấn' },
  { name: 'Khoang Đệm Tiền Lạnh Antechamber (m²)', unit: 'm²' },
  { name: 'Khoang Lạnh Tự Quản (m³)', unit: 'm³' },
];

export const HAZMAT_PRESET_WAREHOUSE_COLUMNS: Array<{ name: string; unit: string }> = [
  { name: 'Kệ Pallet Hóa Chất Chống Tràn (Pallet)', unit: 'Pallet' },
  { name: 'Khu Bồn IBC Tank 1000L (Bồn / Tank)', unit: 'Bồn' },
  { name: 'Khu Chứa Phuy Sắt 200L (Phuy)', unit: 'Phuy' },
  { name: 'Sàn Khoang Chống Cháy Cách Ly (m²)', unit: 'm²' },
  { name: 'Khu Vực Bảo Ôn Hóa Chất Bay Hơi (m³)', unit: 'm³' },
  { name: 'Khoang Cách Ly Hóa Chất Độc Class 6.1 (Pallet)', unit: 'Pallet' },
];

export const BONDED_GENERAL_PRESET_WAREHOUSE_COLUMNS: Array<{ name: string; unit: string }> = [
  { name: 'Thể Tích Chứa CBM (m³)', unit: 'm³' },
  { name: 'Sức Chứa Pallet (Racking)', unit: 'Pallet' },
  { name: 'Diện Tích Kho Lưu Trữ (m²)', unit: 'm²' },
  { name: 'Khu Vực Đóng Ghép CFS (m²)', unit: 'm²' },
  { name: 'Bãi Cont Ngoại Quan (Cont)', unit: 'Cont' },
  { name: 'Khu Vực Bàn Kiểm Hóa HQ (Bàn)', unit: 'Bàn' },
];

export const BONDED_COLD_PRESET_WAREHOUSE_COLUMNS: Array<{ name: string; unit: string }> = [
  { name: 'Kho Đông Ngoại Quan (-18°C ~ -25°C)', unit: 'Pallet' },
  { name: 'Kho Mát Ngoại Quan (+2°C ~ +8°C)', unit: 'Pallet' },
  { name: 'Khu Đệm Lạnh Lấy Mẫu Kiểm Dịch (m²)', unit: 'm²' },
  { name: 'Bãi Cắm Điện Container Lạnh (Trụ)', unit: 'Trụ' },
  { name: 'Thể Tích Bảo Quản Đông Lạnh (m³)', unit: 'm³' },
  { name: 'Buồng Cấp Đông Tái Xuất (-40°C)', unit: 'Tấn' },
];

export const BONDED_HAZMAT_PRESET_WAREHOUSE_COLUMNS: Array<{ name: string; unit: string }> = [
  { name: 'Kệ Pallet Chống Tràn Ngoại Quan (Pallet)', unit: 'Pallet' },
  { name: 'Khu Bồn Ngoại Quan IBC Tank 1000L (Bồn)', unit: 'Bồn' },
  { name: 'Khu Phuy Sắt Hóa Chất Ngoại Quan (Phuy)', unit: 'Phuy' },
  { name: 'Khoang Cách Ly DG Khí Độc LEL (m²)', unit: 'm²' },
  { name: 'Bãi Cách Ly Container Hóa Chất (Cont)', unit: 'Cont' },
  { name: 'Khu Vực Kiểm Hóa Hóa Chất Phòng Nổ (m²)', unit: 'm²' },
];

export const PRESET_WAREHOUSE_COLUMNS = GENERAL_PRESET_WAREHOUSE_COLUMNS;

interface WarehousePricingContinuousTableProps {
  data: WarehouseDetailModalData;
  setData: React.Dispatch<React.SetStateAction<WarehouseDetailModalData | null>>;
  surchargesLov: Array<{ code: string; name: string; category: string; unit: string; defaultPrice: string; isFree?: boolean }>;
  vasLov: Array<{ code: string; name: string; category: string; unit: string; defaultPrice: string; isFree?: boolean }>;
}

// DANH SÁCH LOV PHỤ PHÍ CỐ ĐỊNH TIÊU CHUẨN (SECTION 1B)
export const GENERAL_FIXED_SURCHARGES_LOV = [
  { code: 'FIX-WMS-ADMIN', name: 'Phí quản lý đơn hàng & báo cáo tồn kho định kỳ (WMS / Admin)', unit: 'VND / Tháng', defaultPrice: 2000000, note: 'Bao gồm phân quyền 5 tài khoản WMS' },
  { code: 'FIX-CYCLE-COUNT', name: 'Phí kiểm kê định kỳ theo chu kỳ (Cycle Count)', unit: 'VND / Lần', defaultPrice: 500000, note: 'Kiểm kê định kỳ 1 lần/tháng' },
  { code: 'FIX-PARKING-MONTHLY', name: 'Phí bến bãi đỗ xe chờ giao nhận hàng tháng', unit: 'VND / Xe / Tháng', defaultPrice: 1500000, note: 'Dành cho xe tải thường trực' },
  { code: 'FIX-API-EDI-INTEG', name: 'Phí kết nối dữ liệu API/EDI hệ thống WMS vào ERP khách hàng', unit: 'VND / Tháng', defaultPrice: 0, note: 'Miễn phí tích hợp chuẩn RESTful API' },
  { code: 'FIX-ACCOUNT-MGR', name: 'Phí chuyên viên quản lý tài khoản & CSKH chuyên trách (Dedicated KAM)', unit: 'VND / Tháng', defaultPrice: 3000000, note: 'Nhân sự vận hành túc trực hỗ trợ riêng' },
  { code: 'FIX-SECURITY-CCTV', name: 'Phí tài khoản giám sát an ninh camera CCTV 24/7 riêng biệt', unit: 'VND / Tháng', defaultPrice: 800000, note: 'Cấp link xem camera khu vực hàng riêng' },
  { code: 'FIX-POWER-BACKUP', name: 'Phí duy trì nguồn điện máy phát dự phòng công suất lớn', unit: 'VND / Tháng', defaultPrice: 1200000, note: 'Đảm bảo hoạt động không gián đoạn' },
  { code: 'FIX-PEST-CONTROL', name: 'Phí dịch vụ kiểm soát côn trùng & khử trùng kho định kỳ', unit: 'VND / Tháng', defaultPrice: 700000, note: 'Theo tiêu chuẩn HACCP / ISO 22000' },
  { code: 'FIX-WASTE-DISPOSAL', name: 'Phí xử lý rác thải công nghiệp & bao bì phế liệu kho', unit: 'VND / Tháng', defaultPrice: 500000, note: 'Thu gom & tiêu hủy định kỳ đúng quy chuẩn' },
  { code: 'FIX-STORAGE-MAINT', name: 'Phí bảo dưỡng pallet, sàn & hệ thống giá kệ định kỳ', unit: 'VND / Tháng', defaultPrice: 600000, note: 'Kiểm định an toàn tải trọng định kỳ' },
];

export const COLD_FIXED_SURCHARGES_LOV = [
  { code: 'FIX-COLD-POWER', name: 'Phí duy trì nguồn điện máy phát ATS dự phòng 100% công suất 24/7', unit: 'VND / Tháng', defaultPrice: 3500000, note: 'Đảm bảo điện máy nén lạnh Bitzer không gián đoạn' },
  { code: 'FIX-COLD-CALIB', name: 'Phí bảo dưỡng dàn lạnh & hiệu chuẩn đầu dò nhiệt độ định kỳ (Calibration)', unit: 'VND / Tháng', defaultPrice: 1500000, note: 'Hiệu chuẩn cảm biến theo tiêu chuẩn HACCP/GDP' },
  { code: 'FIX-COLD-DEFROST', name: 'Phí vệ sinh, xả đá (Defrosting) & kiểm soát ATTP HACCP/ISO 22000', unit: 'VND / Tháng', defaultPrice: 1200000, note: 'Xử lý xả đá dàn lạnh và diệt khuẩn buồng lạnh' },
  { code: 'FIX-COLD-PORTAL', name: 'Phí tài khoản cổng thông tin giám sát nhiệt độ Online Real-time', unit: 'VND / Tháng', defaultPrice: 800000, note: 'Theo dõi biểu đồ nhiệt độ 24/7 từ xa qua App' },
  { code: 'FIX-COLD-WMS-FEFO', name: 'Phí phần mềm WMS chuyên dụng quản lý hạn sử dụng FIFO/FEFO', unit: 'VND / Tháng', defaultPrice: 2000000, note: 'Cảnh báo hạn sử dụng hàng tồn kho tự động' },
  { code: 'FIX-COLD-CYCLE', name: 'Phí kiểm kê định kỳ trong buồng lạnh (Cycle Count)', unit: 'VND / Lần', defaultPrice: 700000, note: 'Kiểm kê định kỳ 1 lần/tháng' },
  { code: 'FIX-COLD-PARKING', name: 'Phí bến bãi đỗ xe tải lạnh có trụ cấp nguồn điện lạnh', unit: 'VND / Xe / Tháng', defaultPrice: 2000000, note: 'Bãi đỗ có cấp nguồn điện lạnh thường trực' },
  { code: 'FIX-COLD-PEST', name: 'Phí kiểm soát sinh vật gây hại chuyên dụng kho thực phẩm', unit: 'VND / Tháng', defaultPrice: 900000, note: 'Đạt chuẩn BRC / HACCP / ISO 22000' },
];

export const HAZMAT_FIXED_SURCHARGES_LOV = [
  { code: 'FIX-HAZ-FOAM', name: 'Phí duy trì hệ thống PCCC tự động bọt Foam chữa cháy dung môi', unit: 'VND / Tháng', defaultPrice: 4500000, note: 'Kiểm tra bồn chứa bọt foam và van xả tự động định kỳ' },
  { code: 'FIX-HAZ-SUMP', name: 'Phí bảo dưỡng hệ thống rãnh gom và bồn trung hòa nước thải hóa chất', unit: 'VND / Tháng', defaultPrice: 2500000, note: 'Bơm hút và xử lý nước thải hóa chất nguy hại' },
  { code: 'FIX-HAZ-VENT', name: 'Phí duy trì hệ thống thông gió chống nổ cưỡng bức Ex-proof 24/7', unit: 'VND / Tháng', defaultPrice: 1800000, note: 'Đảm bảo nồng độ hơi dung môi luôn dưới ngưỡng LEL' },
  { code: 'FIX-HAZ-INSUR', name: 'Phí bảo hiểm trách nhiệm dân sự đối với môi trường & bên thứ ba', unit: 'VND / Tháng', defaultPrice: 3000000, note: 'Bảo hiểm ô nhiễm môi trường và cháy nổ hóa chất' },
  { code: 'FIX-HAZ-DRILL', name: 'Phí tổ chức diễn tập ứng phó sự cố hóa chất định kỳ cấp cơ sở', unit: 'VND / Quý', defaultPrice: 2000000, note: 'Phối hợp cảnh sát PCCC & cơ quan chức năng' },
  { code: 'FIX-HAZ-WMS-DG', name: 'Phí hệ thống WMS kiểm soát ma trận tương thích hóa chất & MSDS', unit: 'VND / Tháng', defaultPrice: 2500000, note: 'Chống xếp lẫn hóa chất phản ứng xung khắc' },
  { code: 'FIX-HAZ-EYEWASH', name: 'Phí kiểm định & duy trì trạm rửa mắt, tắm khẩn cấp Emergency Shower', unit: 'VND / Tháng', defaultPrice: 600000, note: 'Kiểm tra lưu lượng nước và khử trùng định kỳ' },
  { code: 'FIX-HAZ-SECURITY', name: 'Phí giám sát an ninh camera phòng nổ Ex-proof & bảo vệ 2 lớp', unit: 'VND / Tháng', defaultPrice: 1200000, note: 'Tuân thủ nghiêm ngặt kiểm soát vật liệu sinh lửa' },
];

export const BONDED_GENERAL_FIXED_SURCHARGES_LOV = [
  { code: 'FIX-BON-VASSCM', name: 'Phí kết nối dữ liệu phần mềm tự động với hệ thống VASSCM Hải quan', unit: 'VND / Tháng', defaultPrice: 2000000, note: 'Duy trì kết nối truyền số liệu tờ khai 24/7' },
  { code: 'FIX-BON-OFFICE-HQ', name: 'Phí duy trì phòng làm việc và trang thiết bị cho công chức Hải quan', unit: 'VND / Tháng', defaultPrice: 1500000, note: 'Bao gồm điện thoại, máy in, mạng nội bộ' },
  { code: 'FIX-BON-CCTV-HQ', name: 'Phí duy trì máy chủ truyền hình ảnh Camera CCTV trực tiếp về Chi cục Hải quan', unit: 'VND / Tháng', defaultPrice: 1200000, note: 'Lưu trữ video 12 tháng theo chuẩn TT 38/39' },
  { code: 'FIX-BON-WMS-DECLAR', name: 'Phí phần mềm WMS theo dõi số lượng tồn kho theo số tờ khai E52/E54', unit: 'VND / Tháng', defaultPrice: 1800000, note: 'Quản lý hạn lưu kho 12 tháng tự động' },
  { code: 'FIX-BON-CYCLE-COUNT', name: 'Phí kiểm kê định kỳ đối soát số liệu thực tế với cơ quan Hải quan', unit: 'VND / Lần', defaultPrice: 800000, note: 'Bao gồm biên bản đối chiếu liên ngành' },
  { code: 'FIX-BON-PARKING-HQ', name: 'Phí duy trì bến bãi đỗ xe container chờ niêm chì & kiểm hóa hải quan', unit: 'VND / Xe / Tháng', defaultPrice: 1500000, note: 'Bãi đỗ thường trực có mái che' },
];

export const BONDED_COLD_FIXED_SURCHARGES_LOV = [
  { code: 'FIX-BON-COLD-POWER', name: 'Phí duy trì nguồn điện máy phát ATS dự phòng 100% công suất kho lạnh ngoại quan', unit: 'VND / Tháng', defaultPrice: 3500000, note: 'Bảo đảm máy nén Bitzer hoạt động 24/7' },
  { code: 'FIX-BON-COLD-IOT-HQ', name: 'Phí kết nối trạm cảm biến nhiệt độ tự động gửi dữ liệu cho Kiểm dịch & Hải quan', unit: 'VND / Tháng', defaultPrice: 1200000, note: 'Trích xuất đồ thị nhiệt độ liên tục' },
  { code: 'FIX-BON-COLD-VASSCM', name: 'Phí kết nối dữ liệu phần mềm kho lạnh ngoại quan với hệ thống VASSCM', unit: 'VND / Tháng', defaultPrice: 2000000, note: 'Quản lý tờ khai và nhiệt độ lô hàng' },
  { code: 'FIX-BON-COLD-DEFROST', name: 'Phí vệ sinh, xả đá buồng đệm và khử trùng tiêu độc đạt chuẩn kiểm dịch ATTP', unit: 'VND / Tháng', defaultPrice: 1500000, note: 'Tuân thủ nghiêm ngặt vệ sinh thú y' },
  { code: 'FIX-BON-COLD-OFFICE', name: 'Phí duy trì bàn làm việc & thiết bị đo nhiệt độ kiểm dịch cho công chức chuyên ngành', unit: 'VND / Tháng', defaultPrice: 1200000, note: 'Hỗ trợ kiểm dịch động thực vật' },
  { code: 'FIX-BON-COLD-PLUG', name: 'Phí duy trì trụ cắm điện container lạnh chờ thông quan tại bãi kho ngoại quan', unit: 'VND / Trụ / Tháng', defaultPrice: 2500000, note: 'Nguồn điện 3 pha 380V công suất cao' },
];

export const BONDED_HAZMAT_FIXED_SURCHARGES_LOV = [
  { code: 'FIX-BON-HAZ-FOAM', name: 'Phí duy trì hệ thống PCCC tự động bọt Foam chuyên dụng kho ngoại quan hóa chất', unit: 'VND / Tháng', defaultPrice: 4500000, note: 'Kiểm định bồn Foam và van xả tự động định kỳ' },
  { code: 'FIX-BON-HAZ-CCTV-EX', name: 'Phí duy trì camera giám sát phòng nổ Ex-proof truyền dữ liệu trực tiếp về Hải quan', unit: 'VND / Tháng', defaultPrice: 2000000, note: 'Camera chuẩn ATEX chống cháy nổ' },
  { code: 'FIX-BON-HAZ-VASSCM', name: 'Phí kết nối hệ thống WMS phân nhóm hóa chất UN/MSDS với cổng Hải quan & NSW', unit: 'VND / Tháng', defaultPrice: 2500000, note: 'Quản lý mã UN và thời hạn lưu kho' },
  { code: 'FIX-BON-HAZ-SUMP', name: 'Phí bảo dưỡng hệ thống rãnh gom và bồn trung hòa nước thải hóa chất nguy hại', unit: 'VND / Tháng', defaultPrice: 2500000, note: 'Xử lý nước thải hóa chất sự cố' },
  { code: 'FIX-BON-HAZ-INSUR', name: 'Phí bảo hiểm trách nhiệm ô nhiễm môi trường kho ngoại quan hàng nguy hiểm', unit: 'VND / Tháng', defaultPrice: 3500000, note: 'Mức trách nhiệm cao nhất' },
  { code: 'FIX-BON-HAZ-DRILL', name: 'Phí định kỳ diễn tập ứng phó sự cố hóa chất phối hợp lực lượng Hải quan & PCCC', unit: 'VND / Quý', defaultPrice: 2500000, note: 'Thực tập phương án PCCC chuyên nghiệp' },
];

export const FIXED_SURCHARGES_LOV = GENERAL_FIXED_SURCHARGES_LOV;

export const WarehousePricingContinuousTable: React.FC<WarehousePricingContinuousTableProps> = ({
  data,
  setData,
  surchargesLov,
  vasLov,
}) => {
  const isCold = Boolean(data.isColdStorage);
  const isHazmat = Boolean(data.isChemicalStorage);
  const isBonded = Boolean(data.isBondedStorage || data.modelId?.includes('bon') || data.modelId === 'wh-gen-bon');

  const activeFixedLov = isBonded
    ? (isCold
        ? BONDED_COLD_FIXED_SURCHARGES_LOV
        : (isHazmat ? BONDED_HAZMAT_FIXED_SURCHARGES_LOV : BONDED_GENERAL_FIXED_SURCHARGES_LOV))
    : (isCold 
        ? COLD_FIXED_SURCHARGES_LOV 
        : (isHazmat ? HAZMAT_FIXED_SURCHARGES_LOV : GENERAL_FIXED_SURCHARGES_LOV));

  const activePresetColumns = isBonded
    ? (isCold
        ? BONDED_COLD_PRESET_WAREHOUSE_COLUMNS
        : (isHazmat ? BONDED_HAZMAT_PRESET_WAREHOUSE_COLUMNS : BONDED_GENERAL_PRESET_WAREHOUSE_COLUMNS))
    : (isCold
        ? COLD_PRESET_WAREHOUSE_COLUMNS
        : (isHazmat ? HAZMAT_PRESET_WAREHOUSE_COLUMNS : GENERAL_PRESET_WAREHOUSE_COLUMNS));

  // CÁC CỘT MA TRẬN LƯU TRỮ (TỰ ĐỘNG KHỞI TẠO THEO LOẠI HÌNH KHO THƯỜNG / LẠNH / NGUY HIỂM / NGOẠI QUAN)
  const [columns, setColumns] = useState<WarehouseMatrixColumn[]>(() => {
    if (isBonded) {
      if (isCold) {
        return [
          { id: 'col_cold_pallets', name: '1. Kho Đông Ngoại Quan (-18°C ~ -25°C)', unit: 'Pallet', typeKey: 'pallets' },
          { id: 'col_chill_pallets', name: '2. Kho Mát Ngoại Quan (+2°C ~ +8°C)', unit: 'Pallet', typeKey: 'area' },
          { id: 'col_air_cbm', name: '3. Thể Tích Đệm Lạnh (m³)', unit: 'm³', typeKey: 'volume' },
        ];
      }
      if (isHazmat) {
        return [
          { id: 'col_haz_pallets', name: '1. Kệ Pallet Chống Tràn Hóa Chất', unit: 'Pallet', typeKey: 'pallets' },
          { id: 'col_haz_tank', name: '2. Khu Bồn IBC Tank 1000L', unit: 'Bồn', typeKey: 'area' },
          { id: 'col_haz_drum', name: '3. Khu Chứa Phuy Sắt 200L', unit: 'Phuy', typeKey: 'volume' },
        ];
      }
      return [
        { id: 'col_volume', name: '1. Thể Tích Chứa CBM (m³)', unit: 'm³', typeKey: 'volume' },
        { id: 'col_pallets', name: '2. Sức Chứa Pallet (Racking)', unit: 'Pallet', typeKey: 'pallets' },
        { id: 'col_area', name: '3. Diện Tích Sàn (m²)', unit: 'm²', typeKey: 'area' },
      ];
    }
    if (isCold) {
      return [
        { id: 'col_cold_pallets', name: '1. Kho Đông Lạnh (-18°C ~ -25°C)', unit: 'Pallet', typeKey: 'pallets' },
        { id: 'col_chill_pallets', name: '2. Kho Mát (+2°C ~ +8°C)', unit: 'Pallet', typeKey: 'area' },
        { id: 'col_air_cbm', name: '3. Kho Điều Hòa (+15°C ~ +22°C)', unit: 'm³', typeKey: 'volume' },
      ];
    }
    if (isHazmat) {
      return [
        { id: 'col_haz_pallets', name: '1. Kệ Pallet Chống Tràn Hóa Chất', unit: 'Pallet', typeKey: 'pallets' },
        { id: 'col_haz_tank', name: '2. Khu Bồn IBC Tank 1000L', unit: 'Bồn', typeKey: 'area' },
        { id: 'col_haz_drum', name: '3. Khu Chứa Phuy Sắt 200L', unit: 'Phuy', typeKey: 'volume' },
      ];
    }
    return [
      { id: 'col_area', name: '1. Diện Tích Sàn (m²)', unit: 'm²', typeKey: 'area' },
      { id: 'col_pallets', name: '2. Sức Chứa Pallet (Racking)', unit: 'Pallet', typeKey: 'pallets' },
      { id: 'col_volume', name: '3. Thể Tích Chứa (m³ / CBM)', unit: 'm³', typeKey: 'volume' },
    ];
  });

  // Modal / popover thêm cột mới
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnUnit, setNewColumnUnit] = useState('Pallet');

  // Giá trị theo cột mở rộng cho các cột custom
  const [customValues, setCustomValues] = useState<Record<string, {
    capacity?: number;
    occupied?: number;
    available?: number;
    price?: number;
    minCharge?: number;
  }>>({});

  // Ma trận giá phụ phí biến đổi theo từng cột
  const [surchargeColPrices, setSurchargeColPrices] = useState<Record<string, Record<string, number>>>(() => {
    if (isBonded) {
      if (isCold) {
        return {
          'pwh-bon-cold-1': { col_cold_pallets: 95000, col_chill_pallets: 95000, col_air_cbm: 95000 },
          'pwh-bon-cold-2': { col_cold_pallets: 300000, col_chill_pallets: 300000, col_air_cbm: 300000 },
          'pwh-bon-cold-3': { col_cold_pallets: 180000, col_chill_pallets: 180000, col_air_cbm: 180000 },
          'pwh-bon-cold-4': { col_cold_pallets: 55000, col_chill_pallets: 55000, col_air_cbm: 55000 },
          'pwh-bon-cold-5': { col_cold_pallets: 350000, col_chill_pallets: 350000, col_air_cbm: 350000 },
          'pwh-bon-cold-6': { col_cold_pallets: 600000, col_chill_pallets: 600000, col_air_cbm: 600000 },
        };
      }
      if (isHazmat) {
        return {
          'pwh-bon-haz-1': { col_haz_pallets: 300000, col_haz_tank: 300000, col_haz_drum: 300000 },
          'pwh-bon-haz-2': { col_haz_pallets: 600000, col_haz_tank: 600000, col_haz_drum: 600000 },
          'pwh-bon-haz-3': { col_haz_pallets: 450000, col_haz_tank: 450000, col_haz_drum: 450000 },
          'pwh-bon-haz-4': { col_haz_pallets: 95000, col_haz_tank: 95000, col_haz_drum: 90000 },
          'pwh-bon-haz-5': { col_haz_pallets: 35000, col_haz_tank: 35000, col_haz_drum: 35000 },
          'pwh-bon-haz-6': { col_haz_pallets: 1500000, col_haz_tank: 1500000, col_haz_drum: 1500000 },
        };
      }
      return {
        'pwh-bon-gen-1': { col_volume: 500000, col_pallets: 500000, col_area: 500000 },
        'pwh-bon-gen-2': { col_volume: 45000, col_pallets: 45000, col_area: 45000 },
        'pwh-bon-gen-3': { col_volume: 30000, col_pallets: 30000, col_area: 30000 },
        'pwh-bon-gen-4': { col_volume: 850000, col_pallets: 850000, col_area: 850000 },
        'pwh-bon-gen-5': { col_volume: 45000, col_pallets: 45000, col_area: 45000 },
        'pwh-bon-gen-6': { col_volume: 3000, col_pallets: 3000, col_area: 3000 },
      };
    }
    if (isCold) {
      return {
        'pwh-cold-1': { col_cold_pallets: 45000, col_chill_pallets: 45000, col_air_cbm: 40000 },
        'pwh-cold-2': { col_cold_pallets: 45000, col_chill_pallets: 45000, col_air_cbm: 40000 },
        'pwh-cold-3': { col_cold_pallets: 85000, col_chill_pallets: 85000, col_air_cbm: 85000 },
        'pwh-cold-4': { col_cold_pallets: 150000, col_chill_pallets: 150000, col_air_cbm: 150000 },
        'pwh-cold-5': { col_cold_pallets: 65000, col_chill_pallets: 65000, col_air_cbm: 65000 },
        'pwh-cold-6': { col_cold_pallets: 1600000, col_chill_pallets: 1600000, col_air_cbm: 1600000 },
        'pwh-cold-7': { col_cold_pallets: 300000, col_chill_pallets: 300000, col_air_cbm: 300000 },
      };
    }
    if (isHazmat) {
      return {
        'pwh-haz-1': { col_haz_pallets: 65000, col_haz_tank: 65000, col_haz_drum: 60000 },
        'pwh-haz-2': { col_haz_pallets: 65000, col_haz_tank: 65000, col_haz_drum: 60000 },
        'pwh-haz-3': { col_haz_pallets: 80000, col_haz_tank: 80000, col_haz_drum: 80000 },
        'pwh-haz-4': { col_haz_pallets: 50000, col_haz_tank: 50000, col_haz_drum: 50000 },
        'pwh-haz-5': { col_haz_pallets: 350000, col_haz_tank: 350000, col_haz_drum: 350000 },
        'pwh-haz-6': { col_haz_pallets: 250000, col_haz_tank: 250000, col_haz_drum: 250000 },
        'pwh-haz-7': { col_haz_pallets: 350000, col_haz_tank: 350000, col_haz_drum: 350000 },
      };
    }
    return {
      'pwh-1': { col_area: 35000, col_pallets: 35000, col_volume: 30000 },
      'pwh-2': { col_area: 35000, col_pallets: 35000, col_volume: 30000 },
      'pwh-3': { col_area: 1200000, col_pallets: 1200000, col_volume: 1200000 },
      'pwh-4': { col_area: 500, col_pallets: 500, col_volume: 500 },
      'pwh-5': { col_area: 200000, col_pallets: 200000, col_volume: 200000 },
    };
  });

  // Phụ phí cố định (Section 1B)
  const [fixedSurcharges, setFixedSurcharges] = useState<Array<{
    id: string;
    name: string;
    unit: string;
    price: number;
    note?: string;
  }>>(() => {
    if (isBonded) {
      if (isCold) {
        return BONDED_COLD_FIXED_SURCHARGES_LOV.slice(0, 4).map((f, i) => ({
          id: `fix-bon-cold-${i + 1}`,
          name: f.name,
          unit: f.unit,
          price: f.defaultPrice,
          note: f.note,
        }));
      }
      if (isHazmat) {
        return BONDED_HAZMAT_FIXED_SURCHARGES_LOV.slice(0, 4).map((f, i) => ({
          id: `fix-bon-haz-${i + 1}`,
          name: f.name,
          unit: f.unit,
          price: f.defaultPrice,
          note: f.note,
        }));
      }
      return BONDED_GENERAL_FIXED_SURCHARGES_LOV.slice(0, 4).map((f, i) => ({
        id: `fix-bon-gen-${i + 1}`,
        name: f.name,
        unit: f.unit,
        price: f.defaultPrice,
        note: f.note,
      }));
    }
    if (isCold) {
      return [
        { id: 'fix-cold-1', name: 'Phí duy trì nguồn điện máy phát ATS dự phòng 100% công suất 24/7', unit: 'VND / Tháng', price: 3500000, note: 'Đảm bảo điện máy nén lạnh Bitzer không gián đoạn' },
        { id: 'fix-cold-2', name: 'Phí bảo dưỡng dàn lạnh & hiệu chuẩn đầu dò nhiệt độ định kỳ (Calibration)', unit: 'VND / Tháng', price: 1500000, note: 'Hiệu chuẩn cảm biến theo tiêu chuẩn HACCP/GDP' },
        { id: 'fix-cold-3', name: 'Phí vệ sinh, xả đá (Defrosting) & kiểm soát ATTP HACCP/ISO 22000', unit: 'VND / Tháng', price: 1200000, note: 'Xử lý xả đá dàn lạnh và diệt khuẩn buồng lạnh' },
        { id: 'fix-cold-4', name: 'Phí tài khoản cổng thông tin giám sát nhiệt độ Online Real-time', unit: 'VND / Tháng', price: 800000, note: 'Theo dõi biểu đồ nhiệt độ 24/7 từ xa qua App' },
      ];
    }
    if (isHazmat) {
      return [
        { id: 'fix-haz-1', name: 'Phí duy trì hệ thống PCCC tự động bọt Foam chữa cháy dung môi', unit: 'VND / Tháng', price: 4500000, note: 'Kiểm tra bồn chứa bọt foam và van xả tự động định kỳ' },
        { id: 'fix-haz-2', name: 'Phí bảo dưỡng hệ thống rãnh gom và bồn trung hòa nước thải hóa chất', unit: 'VND / Tháng', price: 2500000, note: 'Bơm hút và xử lý nước thải hóa chất nguy hại' },
        { id: 'fix-haz-3', name: 'Phí duy trì hệ thống thông gió chống nổ cưỡng bức Ex-proof 24/7', unit: 'VND / Tháng', price: 1800000, note: 'Đảm bảo nồng độ hơi dung môi luôn dưới ngưỡng LEL' },
        { id: 'fix-haz-4', name: 'Phí bảo hiểm trách nhiệm dân sự đối với môi trường & bên thứ ba', unit: 'VND / Tháng', price: 3000000, note: 'Bảo hiểm ô nhiễm môi trường và cháy nổ hóa chất' },
      ];
    }
    return [
      { id: 'fix-1', name: 'Phí quản lý đơn hàng & báo cáo tồn kho định kỳ (WMS / Admin)', unit: 'VND / Tháng', price: 2000000, note: 'Bao gồm phân quyền 5 tài khoản WMS' },
      { id: 'fix-2', name: 'Phí kiểm kê định kỳ theo chu kỳ (Cycle Count)', unit: 'VND / Lần', price: 500000, note: 'Kiểm kê định kỳ 1 lần/tháng' },
      { id: 'fix-3', name: 'Phí bến bãi đỗ xe chờ giao nhận hàng tháng', unit: 'VND / Xe / Tháng', price: 1500000, note: 'Dành cho xe tải thường trực' },
      { id: 'fix-4', name: 'Phí kết nối dữ liệu API/EDI hệ thống WMS vào ERP khách hàng', unit: 'VND / Tháng', price: 0, note: 'Miễn phí tích hợp chuẩn RESTful API' },
    ];
  });

  // Quản lý chọn thêm từ LOV
  const [selectedSurchargeCode, setSelectedSurchargeCode] = useState<string>('');
  const [selectedVasCode, setSelectedVasCode] = useState<string>('');
  const [selectedFixedCode, setSelectedFixedCode] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modal thêm hạng mục tùy chỉnh (thay thế window.prompt bị chặn bởi sandbox iframe)
  const [customModal, setCustomModal] = useState<{
    isOpen: boolean;
    type: 'variable' | 'fixed' | 'vas';
    name: string;
    unit: string;
    price: string;
    note: string;
  }>({
    isOpen: false,
    type: 'fixed',
    name: '',
    unit: 'VND / Tháng',
    price: '1,000,000',
    note: '',
  });

  const currencySymbol = data.currency === 'USD' ? '$' : '₫';

  // ĐỒNG BỘ THANH CUỘN NGANG GIỮA TOP & BOTTOM (GIỐNG LTL)
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(1350);
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
    const timer = setTimeout(updateWidth, 150);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [columns, data.paidSurcharges, data.vasItems]);

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

  // THÊM CỘT MỚI VÀO MA TRẬN
  const handleAddColumn = (nameToAdd: string, unitToAdd: string) => {
    const trimmedName = (nameToAdd || '').trim();
    if (!trimmedName) return;

    const newId = `col_${Date.now()}`;
    const nextIndex = columns.length + 1;
    const formattedName = `${nextIndex}. ${trimmedName}`;

    const newCol: WarehouseMatrixColumn = {
      id: newId,
      name: formattedName,
      unit: unitToAdd || 'Pallet',
      typeKey: 'custom',
      isCustom: true,
    };

    setColumns([...columns, newCol]);

    // Giá trị khởi tạo mặc định cho cột mới
    setCustomValues(prev => ({
      ...prev,
      [newId]: {
        capacity: 1000,
        occupied: 600,
        available: 400,
        price: 150000,
        minCharge: 5000000,
      }
    }));

    setIsAddColumnModalOpen(false);
    setNewColumnName('');
    setNewColumnUnit('Pallet');
  };

  // XÓA CỘT KHỎI MA TRẬN
  const handleRemoveColumn = (colId: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter(c => c.id !== colId));
  };

  // ĐỔI TÊN CỘT
  const handleRenameColumn = (colId: string, newName: string) => {
    setColumns(columns.map(c => c.id === colId ? { ...c, name: newName } : c));
  };

  // LẤY GIÁ TRỊ THIẾT KẾ
  const getCapacityVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.capacityArea ?? 2500;
    if (col.typeKey === 'pallets') return data.capacityPallets ?? 1800;
    if (col.typeKey === 'volume') return data.capacityVolume ?? 3000;
    return customValues[col.id]?.capacity ?? 1000;
  };

  // LẤY GIÁ TRỊ ĐANG CHỨA
  const getOccupiedVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.occupiedArea ?? 1650;
    if (col.typeKey === 'pallets') return data.occupiedPallets ?? 1200;
    if (col.typeKey === 'volume') return data.occupiedVolume ?? 1900;
    return customValues[col.id]?.occupied ?? 600;
  };

  // LẤY GIÁ TRỊ CÒN TRỐNG
  const getAvailableVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.availableArea ?? 850;
    if (col.typeKey === 'pallets') return data.availablePallets ?? 600;
    if (col.typeKey === 'volume') return data.availableVolume ?? 1100;
    return customValues[col.id]?.available ?? 400;
  };

  // CẬP NHẬT THIẾT KẾ
  const setCapacityVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      const occ = data.occupiedArea ?? 1650;
      setData(prev => prev ? ({
        ...prev,
        capacityArea: val,
        availableArea: Math.max(0, val - occ)
      }) : prev);
    } else if (col.typeKey === 'pallets') {
      const occ = data.occupiedPallets ?? 1200;
      setData(prev => prev ? ({
        ...prev,
        capacityPallets: val,
        availablePallets: Math.max(0, val - occ)
      }) : prev);
    } else if (col.typeKey === 'volume') {
      const occ = data.occupiedVolume ?? 1900;
      setData(prev => prev ? ({
        ...prev,
        capacityVolume: val,
        availableVolume: Math.max(0, val - occ)
      }) : prev);
    } else {
      setCustomValues(prev => {
        const cur = prev[col.id] || { capacity: 1000, occupied: 600, available: 400 };
        return {
          ...prev,
          [col.id]: {
            ...cur,
            capacity: val,
            available: Math.max(0, val - (cur.occupied || 0))
          }
        };
      });
    }
  };

  // CẬP NHẬT ĐANG CHỨA (TỰ TÍNH CÒN TRỐNG)
  const setOccupiedVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      const cap = data.capacityArea ?? 2500;
      setData(prev => prev ? ({
        ...prev,
        occupiedArea: val,
        availableArea: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'pallets') {
      const cap = data.capacityPallets ?? 1800;
      setData(prev => prev ? ({
        ...prev,
        occupiedPallets: val,
        availablePallets: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'volume') {
      const cap = data.capacityVolume ?? 3000;
      setData(prev => prev ? ({
        ...prev,
        occupiedVolume: val,
        availableVolume: Math.max(0, cap - val)
      }) : prev);
    } else {
      setCustomValues(prev => {
        const cur = prev[col.id] || { capacity: 1000, occupied: 600, available: 400 };
        return {
          ...prev,
          [col.id]: {
            ...cur,
            occupied: val,
            available: Math.max(0, (cur.capacity || 1000) - val)
          }
        };
      });
    }
  };

  // CẬP NHẬT CÒN TRỐNG (TỰ TÍNH ĐANG CHỨA)
  const setAvailableVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      const cap = data.capacityArea ?? 2500;
      setData(prev => prev ? ({
        ...prev,
        availableArea: val,
        occupiedArea: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'pallets') {
      const cap = data.capacityPallets ?? 1800;
      setData(prev => prev ? ({
        ...prev,
        availablePallets: val,
        occupiedPallets: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'volume') {
      const cap = data.capacityVolume ?? 3000;
      setData(prev => prev ? ({
        ...prev,
        availableVolume: val,
        occupiedVolume: Math.max(0, cap - val)
      }) : prev);
    } else {
      setCustomValues(prev => {
        const cur = prev[col.id] || { capacity: 1000, occupied: 600, available: 400 };
        return {
          ...prev,
          [col.id]: {
            ...cur,
            available: val,
            occupied: Math.max(0, (cur.capacity || 1000) - val)
          }
        };
      });
    }
  };

  // LẤY ĐƠN GIÁ THUÊ CƠ BẢN
  const getRentalPriceVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.pricePerArea ?? 120000;
    if (col.typeKey === 'pallets') return data.pricePerPallet ?? 160000;
    if (col.typeKey === 'volume') return data.pricePerVolume ?? 110000;
    return customValues[col.id]?.price ?? 150000;
  };

  const setRentalPriceVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      setData(prev => prev ? ({ ...prev, pricePerArea: val }) : prev);
    } else if (col.typeKey === 'pallets') {
      setData(prev => prev ? ({ ...prev, pricePerPallet: val }) : prev);
    } else if (col.typeKey === 'volume') {
      setData(prev => prev ? ({ ...prev, pricePerVolume: val }) : prev);
    } else {
      setCustomValues(prev => ({
        ...prev,
        [col.id]: {
          ...(prev[col.id] || {}),
          price: val
        }
      }));
    }
  };

  // LẤY CƯỚC SÀN TỐI THIỂU (MIN CHARGE / MOQ)
  const getMinChargeVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.minChargeMonthly ?? 15000000;
    if (col.typeKey === 'pallets') return 10000000;
    if (col.typeKey === 'volume') return 8000000;
    return customValues[col.id]?.minCharge ?? 5000000;
  };

  const setMinChargeVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      setData(prev => prev ? ({ ...prev, minChargeMonthly: val }) : prev);
    } else {
      setCustomValues(prev => ({
        ...prev,
        [col.id]: {
          ...(prev[col.id] || {}),
          minCharge: val
        }
      }));
    }
  };

  // LẤY GIÁ PHỤ PHÍ THEO CỘT
  const getSurchargePriceForCol = (surchargeId: string, colId: string, defaultTextPrice: string): number => {
    if (surchargeColPrices[surchargeId]?.[colId] !== undefined) {
      return surchargeColPrices[surchargeId][colId];
    }
    const num = parseInt(defaultTextPrice.replace(/[^\d]/g, ''), 10);
    return isNaN(num) ? 35000 : num;
  };

  const setSurchargePriceForCol = (surchargeId: string, colId: string, val: number) => {
    setSurchargeColPrices(prev => ({
      ...prev,
      [surchargeId]: {
        ...(prev[surchargeId] || {}),
        [colId]: val,
      }
    }));
  };

  // THÊM PHỤ PHÍ BIẾN ĐỔI TỪ LOV
  const handleAddSurchargeFromLov = (code: string) => {
    if (!code) return;
    const item = surchargesLov.find(s => s.code === code);
    if (!item) return;

    const newId = `pwh-${Date.now()}`;
    const defaultNum = parseInt(item.defaultPrice.replace(/[^\d]/g, ''), 10) || 35000;

    setData(prev => {
      if (!prev) return prev;
      if (prev.paidSurcharges.some(p => p.code === item.code || p.name.toLowerCase() === item.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        paidSurcharges: [
          ...prev.paidSurcharges,
          {
            id: newId,
            code: item.code,
            name: item.name,
            category: item.category,
            unit: item.unit,
            priceText: item.defaultPrice,
            note: 'Phụ phí biến đổi theo vận hành kho',
            isChecked: true,
          }
        ]
      };
    });

    // Set default price for all current columns
    const colMap: Record<string, number> = {};
    columns.forEach(c => { colMap[c.id] = defaultNum; });
    setSurchargeColPrices(prev => ({ ...prev, [newId]: colMap }));

    setSelectedSurchargeCode('');
  };

  // THÊM PHỤ PHÍ BIẾN ĐỔI TÙY CHỈNH (MỞ MODAL NHẬP LIỆU)
  const openCustomVariableModal = () => {
    setCustomModal({
      isOpen: true,
      type: 'variable',
      name: '',
      unit: isCold ? 'VND / Pallet' : (isHazmat ? 'VND / Pallet' : 'VND / Pallet'),
      price: isCold ? '45000' : (isHazmat ? '65000' : '35000'),
      note: isCold ? 'Phụ phí bảo quản & vận hành buồng lạnh' : (isHazmat ? 'Phụ phí an toàn hóa chất nguy hiểm' : ''),
    });
  };

  // THÊM PHỤ PHÍ CỐ ĐỊNH TỪ LOV
  const handleAddFixedFromLov = (code: string) => {
    if (!code) return;
    const item = activeFixedLov.find(f => f.code === code);
    if (!item) return;

    if (fixedSurcharges.some(f => f.name.toLowerCase() === item.name.toLowerCase())) {
      setSelectedFixedCode('');
      return;
    }

    setFixedSurcharges(prev => [
      ...prev,
      {
        id: `fix-${Date.now()}`,
        name: item.name,
        unit: item.unit,
        price: item.defaultPrice,
        note: item.note,
      }
    ]);
    setSelectedFixedCode('');
  };

  // THÊM PHỤ PHÍ CỐ ĐỊNH TÙY CHỈNH (MỞ MODAL NHẬP LIỆU)
  const openCustomFixedModal = () => {
    setCustomModal({
      isOpen: true,
      type: 'fixed',
      name: '',
      unit: 'VND / Tháng',
      price: '1000000',
      note: '',
    });
  };

  // THÊM VAS TÙY CHỈNH (MỞ MODAL NHẬP LIỆU)
  const openCustomVasModal = () => {
    setCustomModal({
      isOpen: true,
      type: 'vas',
      name: '',
      unit: 'VND / Kiện',
      price: '30000',
      note: 'Cam kết SLA tiêu chuẩn dịch vụ',
    });
  };

  // XỬ LÝ LƯU HẠNG MỤC TỪ MODAL TÙY CHỈNH (CHO CẢ 1A, 1B VÀ 2)
  const handleSaveCustomItem = () => {
    if (!customModal.name.trim()) return;
    const rawPrice = parseInt(customModal.price.replace(/[^\d]/g, ''), 10) || 0;

    if (customModal.type === 'fixed') {
      setFixedSurcharges(prev => [
        ...prev,
        {
          id: `fix-${Date.now()}`,
          name: customModal.name.trim(),
          unit: customModal.unit.trim() || 'VND / Tháng',
          price: rawPrice,
          note: customModal.note.trim() || undefined,
        }
      ]);
    } else if (customModal.type === 'variable') {
      const newId = `pwh-custom-${Date.now()}`;
      setData(prev => prev ? ({
        ...prev,
        paidSurcharges: [
          ...prev.paidSurcharges,
          {
            id: newId,
            name: customModal.name.trim(),
            category: 'Phụ Phí Vận Hành',
            unit: customModal.unit.trim() || 'VND / Pallet',
            priceText: `${rawPrice.toLocaleString('vi-VN')} ₫`,
            note: customModal.note.trim() || 'Phụ phí biến đổi theo vận hành kho',
            isChecked: true,
          }
        ]
      }) : prev);
      const colMap: Record<string, number> = {};
      columns.forEach(c => { colMap[c.id] = rawPrice; });
      setSurchargeColPrices(prev => ({ ...prev, [newId]: colMap }));
    } else if (customModal.type === 'vas') {
      setData(prev => prev ? ({
        ...prev,
        vasItems: [
          ...prev.vasItems,
          {
            id: `vwh-custom-${Date.now()}`,
            name: customModal.name.trim(),
            category: 'Dịch Vụ Giá Trị Gia Tăng',
            unit: customModal.unit.trim() || 'VND / Kiện',
            priceText: `${rawPrice.toLocaleString('vi-VN')} ₫`,
            slaNote: customModal.note.trim() || 'Cam kết SLA tiêu chuẩn dịch vụ',
            isChecked: true,
          }
        ]
      }) : prev);
    }

    setCustomModal(prev => ({ ...prev, isOpen: false }));
  };

  // XÓA PHỤ PHÍ BIẾN ĐỔI
  const handleRemoveSurcharge = (id: string) => {
    setData(prev => prev ? ({
      ...prev,
      paidSurcharges: prev.paidSurcharges.filter(p => p.id !== id)
    }) : prev);
  };

  // THÊM VAS TỪ LOV
  const handleAddVasFromLov = (code: string) => {
    if (!code) return;
    const item = vasLov.find(v => v.code === code);
    if (!item) return;

    setData(prev => {
      if (!prev) return prev;
      if (prev.vasItems.some(v => v.code === item.code || v.name.toLowerCase() === item.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        vasItems: [
          ...prev.vasItems,
          {
            id: `vwh-${Date.now()}`,
            code: item.code,
            name: item.name,
            category: item.category,
            unit: item.unit,
            priceText: item.defaultPrice,
            slaNote: 'Cam kết SLA tiêu chuẩn dịch vụ',
            isChecked: true,
          }
        ]
      };
    });
    setSelectedVasCode('');
  };

  // XÓA VAS
  const handleRemoveVas = (id: string) => {
    setData(prev => prev ? ({
      ...prev,
      vasItems: prev.vasItems.filter(v => v.id !== id)
    }) : prev);
  };

  // Lọc các item chưa thêm
  const availableSurcharges = surchargesLov.filter(s => 
    !data.paidSurcharges.some(p => p.code === s.code || p.name.toLowerCase() === s.name.toLowerCase())
  );

  const availableFixedLov = activeFixedLov.filter(f => 
    !fixedSurcharges.some(exist => exist.name.toLowerCase() === f.name.toLowerCase())
  );

  const availableVas = vasLov.filter(v => 
    !data.vasItems.some(item => item.code === v.code || item.name.toLowerCase() === v.name.toLowerCase())
  );

  return (
    <div className={`flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-50/50 ${
      isFullscreen ? 'fixed inset-2 z-[9999] bg-white rounded-2xl shadow-2xl border border-slate-300' : ''
    }`}>
      
      {/* 1. TOP BREADCRUMB SUMMARY BAR (THEO PHONG CÁCH VẬN TẢI ĐƯỜNG BỘ & EXCEL) */}
      <div className="px-5 py-2 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mã Kho:</span>
            <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs shadow-2xs">
              {data.warehouseCode || 'WH-001'}
            </span>
          </div>
          <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tên Cơ Sở:</span>
            <strong className="text-slate-900 font-bold">{data.warehouseName}</strong>
          </div>
          <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Địa Điểm:</span>
            <span className="text-slate-700 font-medium">{data.address}, {data.province}</span>
          </div>
          <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tiêu Chuẩn:</span>
            <span className="text-indigo-800 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
              {data.isColdStorage ? 'Kho Lạnh 3PL' : data.isChemicalStorage ? 'Kho Hóa Chất DG' : 'Kho Thường Tiêu Chuẩn 3PL'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-600 uppercase">Tiền tệ:</span>
            <select
              value={data.currency || 'VND'}
              onChange={(e) => setData(prev => prev ? ({ ...prev, currency: e.target.value as 'VND' | 'USD' }) : prev)}
              className="px-2 py-0.5 text-xs font-black bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              <option value="VND">VND (₫)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-600 uppercase">Trạng Thái:</span>
            <select
              value={data.receptionStatus || 'ready'}
              onChange={(e) => setData(prev => prev ? ({ ...prev, receptionStatus: e.target.value as any }) : prev)}
              className={`text-xs font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer shadow-2xs ${
                data.receptionStatus === 'full'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : data.receptionStatus === 'limited'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              <option value="ready">🟢 Sẵn sàng nhận hàng</option>
              <option value="limited">🟡 Sắp đầy sàn</option>
              <option value="full">🔴 Đã lấp đầy 100%</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. TOOLBAR HÀNH ĐỘNG THÊM CỘT MA TRẬN LƯU TRỮ (TƯƠNG TỰ THÊM BẬC TRONG LTL) */}
      <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-2 font-medium">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Bảng ma trận dữ liệu kho 2 chiều (Spreadsheet Matrix): 
            <strong className="text-indigo-900 font-bold ml-1">
              {columns.map(c => c.name.replace(/^\d+\.\s*/, '')).join(' • ')}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* NÚT MỞ RỘNG TOÀN MÀN HÌNH KHUNG NHÌN BẢNG DỮ LIỆU */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
              isFullscreen
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title={isFullscreen ? "Thu nhỏ lại khung nhìn tiêu chuẩn" : "Mở rộng tối đa toàn màn hình khung nhìn bảng ma trận"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? "Thu Nhỏ Khung Nhìn" : "Mở Rộng Khung Nhìn"}</span>
          </button>

          {/* NÚT THÊM CỘT NHƯ TRONG LTL */}
          <button
            type="button"
            onClick={() => setIsAddColumnModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Thêm cột đo lường hoặc loại hình lưu trữ mới vào ma trận bảng"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-700" />
            <span>+ Thêm Cột Đo Lường / Loại Hình Lưu Trữ</span>
          </button>
        </div>
      </div>

      {/* 3. BẢNG DỮ LIỆU LIỀN MẠCH THEO FILE EXCEL VÀ MÔ HÌNH LTL (KHUNG NHÌN TỐI ĐA) */}
      <div className="flex-1 overflow-hidden bg-white p-3 sm:p-4 flex flex-col min-h-0">
        
        {/* THANH CUỘN NGANG PHÍA TRÊN BẢNG DỮ LIỆU (ĐỒNG BỘ VỚI BẢNG GIỐNG LTL) */}
        <div
          ref={topScrollRef}
          onScroll={handleTopScroll}
          className="w-full overflow-x-auto overflow-y-hidden mb-1.5 rounded-lg bg-slate-100 border border-slate-300 shadow-2xs shrink-0"
          title="Thanh cuộn ngang bảng dữ liệu"
        >
          <div style={{ width: `${tableScrollWidth}px`, height: '1px' }} />
        </div>

        {/* CONTAINER BẢNG DỮ LIỆU EXCEL MA TRẬN - KHUNG NHÌN MỞ RỘNG TOÀN DIỆN */}
        <div 
          ref={bottomScrollRef}
          onScroll={handleBottomScroll}
          className="border border-slate-300 rounded-xl overflow-x-auto overflow-y-auto shadow-xs flex-1 h-full [scrollbar-width:thin]"
        >
          <table ref={tableRef} className="w-full border-collapse text-xs text-left min-w-[1100px]">
            
            {/* THEAD: TIÊU ĐỀ CÁC CỘT (CỘT 1: HẠNG MỤC, CỘT 2: ĐVT, CỘT 3..N: CÁC CỘT LƯU TRỮ) */}
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-800 select-none bg-slate-100/90 sticky top-0 z-40">
                
                {/* CỘT 1 CỐ ĐỊNH TRÁI: HẠNG MỤC CHI PHÍ & THÔNG SỐ KHO */}
                <th className="sticky left-0 z-50 bg-slate-100 border-r-2 border-slate-300 px-4 py-3 min-w-[340px] max-w-[340px] font-black text-slate-800 uppercase tracking-wider text-[11px] shadow-[2px_0_5px_rgba(0,0,0,0.06)] align-middle">
                  <div className="flex items-center justify-between">
                    <span>HẠNG MỤC CHI PHÍ BÁO GIÁ & THÔNG SỐ KHO</span>
                  </div>
                </th>

                {/* CỘT 2: ĐVT */}
                <th className="bg-slate-100 border-r border-slate-300 px-3 py-3 text-center w-24 min-w-[90px] font-black text-slate-800 uppercase tracking-wider text-[11px] align-middle">
                  ĐVT
                </th>

                {/* CÁC CỘT ĐO LƯỜNG / LƯU TRỮ (1. DIỆN TÍCH SÀN, 2. SỨC CHỨA PALLET, 3. THỂ TÍCH...) */}
                {columns.map((col, idx) => (
                  <th 
                    key={col.id} 
                    className="bg-indigo-50/60 border-r border-indigo-200 px-3 py-2 text-center min-w-[200px] align-middle"
                  >
                    <div className="flex items-center justify-between text-[10px] text-indigo-900 font-bold mb-1">
                      <span className="uppercase tracking-wide text-indigo-600 font-extrabold">CỘT #{idx + 1}</span>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(col.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                          title="Xóa cột này khỏi ma trận"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Ô NHẬP HOẶC HIỂN THỊ TÊN CỘT */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => handleRenameColumn(col.id, e.target.value)}
                        className="w-full text-center font-black text-indigo-950 bg-white border border-indigo-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                      />
                    </div>
                    <div className="text-[10px] font-semibold text-indigo-700/80 mt-1">
                      Đơn vị đo: <strong className="text-indigo-900">{col.unit}</strong>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* TBODY: NỘI DUNG THEO ĐÚNG CẤU TRÚC FILE EXCEL CỦA USER */}
            <tbody className="divide-y divide-slate-200">

              {/* DÒNG 1: THIẾT KẾ (DESIGN CAPACITY) */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-xs font-black text-slate-800">Thiết kế</span>
                    <span className="text-[10px] text-slate-500 font-normal">(Sức chứa tối đa theo thiết kế sàn)</span>
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-semibold bg-slate-50/40">
                  Theo cột
                </td>
                {columns.map(col => {
                  const cap = getCapacityVal(col);
                  const occ = getOccupiedVal(col);
                  const pct = cap > 0 ? Math.min(100, Math.round((occ / cap) * 100)) : 0;
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="number"
                            value={cap || ''}
                            onChange={(e) => setCapacityVal(col, parseFloat(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                            pct >= 90 ? 'bg-rose-50 text-rose-700 border-rose-200' : pct >= 70 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            Đã lấp đầy: {pct}%
                          </span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* DÒNG 2: ĐANG CHỨA (OCCUPIED CAPACITY) */}
              <tr className="hover:bg-slate-50/70 transition-colors bg-rose-50/20">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-rose-900">Đang chứa</span>
                    <span className="text-[10px] text-rose-600 font-normal">(Hiện hữu thực tế đã nhận)</span>
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-semibold bg-slate-50/40">
                  Theo cột
                </td>
                {columns.map(col => {
                  const occ = getOccupiedVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center bg-rose-50/10">
                      <input
                        type="number"
                        value={occ || ''}
                        onChange={(e) => setOccupiedVal(col, parseFloat(e.target.value) || 0)}
                        className="w-full text-center font-bold text-rose-900 bg-white border border-rose-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                  );
                })}
              </tr>

              {/* DÒNG 3: CÒN TRỐNG (AVAILABLE CAPACITY) */}
              <tr className="hover:bg-slate-50/70 transition-colors bg-emerald-50/20">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-900">Còn trống</span>
                    <span className="text-[10px] text-emerald-700 font-normal">(Sẵn sàng tiếp nhận thêm hàng)</span>
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-semibold bg-slate-50/40">
                  Theo cột
                </td>
                {columns.map(col => {
                  const avail = getAvailableVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center bg-emerald-50/10">
                      <input
                        type="number"
                        value={avail || ''}
                        onChange={(e) => setAvailableVal(col, parseFloat(e.target.value) || 0)}
                        className="w-full text-center font-bold text-emerald-900 bg-white border border-emerald-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                  );
                })}
              </tr>

              {/* PHÂN ĐOẠN 1: CẤU TRÚC ĐƠN GIÁ THUÊ */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>1. CẤU TRÚC ĐƠN GIÁ THUÊ</span>
                </td>
              </tr>

              {/* DÒNG: ĐƠN GIÁ THUÊ */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="text-xs font-black text-slate-900">
                    Đơn giá thuê
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Đơn giá thuê kho cơ bản theo từng hình thức lưu trữ
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-700 font-bold bg-slate-50/40">
                  {currencySymbol} / tháng
                </td>
                {columns.map(col => {
                  const p = getRentalPriceVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          value={p ? p.toLocaleString('vi-VN') : ''}
                          onChange={(e) => {
                            const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                            setRentalPriceVal(col, num);
                          }}
                          className="w-full text-right font-black text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none pr-6 shadow-2xs"
                          placeholder="0"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                          {currencySymbol}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block text-right mt-0.5">
                        /{col.unit}/tháng
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* DÒNG: CƯỚC SÀN TỐI THIỂU HÀNG THÁNG (MIN CHARGE / MOQ) */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="text-xs font-black text-slate-900">
                    Cước sàn tối thiểu hàng tháng (Min Charge / MOQ)
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Mức doanh thu cam kết tối thiểu khi thuê theo từng tiêu chuẩn
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-700 font-bold bg-slate-50/40">
                  {currencySymbol} / tháng
                </td>
                {columns.map(col => {
                  const mc = getMinChargeVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          value={mc ? mc.toLocaleString('vi-VN') : ''}
                          onChange={(e) => {
                            const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                            setMinChargeVal(col, num);
                          }}
                          className="w-full text-right font-black text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none pr-6 shadow-2xs"
                          placeholder="0"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                          {currencySymbol}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* PHÂN ĐOẠN 1A: PHỤ PHÍ BIẾN ĐỔI (VARIABLE SURCHARGES) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-600" />
                    <span>1A. PHỤ PHÍ BIẾN ĐỔI (BỐC XẾP, NÂNG HẠ & THAO TÁC THEO TỪNG CỘT LƯU TRỮ)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH DÒNG PHỤ PHÍ BIẾN ĐỔI (VỚI ICON THÙNG RÁC BÊN TRÁI & BADGE LOV BÊN PHẢI THEO MẪU) */}
              {data.paidSurcharges.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveSurcharge(sch.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Xóa phụ phí này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-xs text-slate-800 truncate">
                          • {sch.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        LOV
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                    {sch.unit}
                  </td>
                  {columns.map(col => {
                    const priceVal = getSurchargePriceForCol(sch.id, col.id, sch.priceText);
                    return (
                      <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                        <div className="relative">
                          <input
                            type="text"
                            value={priceVal ? priceVal.toLocaleString('vi-VN') : ''}
                            onChange={(e) => {
                              const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                              setSurchargePriceForCol(sch.id, col.id, num);
                            }}
                            className="w-full text-right font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none pr-6 shadow-2xs"
                            placeholder="0"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                            {currencySymbol}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* HÀNG HÀNH ĐỘNG DƯỚI CÙNG 1A: CHỌN PHỤ PHÍ THÊM TỪ LOV HOẶC TÙY CHỈNH (THEO THIẾT KẾ VÍ DỤ) */}
              <tr className="bg-slate-50/30 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-3 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    {availableSurcharges.length > 0 ? (
                      <div className="relative flex-1">
                        <select
                          value={selectedSurchargeCode}
                          onChange={(e) => handleAddSurchargeFromLov(e.target.value)}
                          className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50/30 border-2 border-indigo-400 hover:border-indigo-500 rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none shadow-2xs transition-all pr-8 tracking-wide"
                        >
                          <option value="" className="text-indigo-600 font-bold">
                            + Chọn phụ phí thêm từ LOV ({availableSurcharges.length} mục)...
                          </option>
                          {availableSurcharges.map(s => (
                            <option key={s.code} value={s.code} className="text-slate-800 font-medium">
                              {s.name} ({s.unit})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-xs text-slate-400 italic px-3 py-2 border-2 border-dashed border-slate-200 rounded-xl text-center">
                        Đã chọn tất cả phụ phí từ LOV
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openCustomVariableModal}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 border-2 border-indigo-300 hover:border-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap active:scale-95"
                      title="Thêm phụ phí biến đổi tùy chỉnh"
                    >
                      + Tùy chỉnh
                    </button>
                  </div>
                </td>
                <td className="border-r border-slate-200 bg-slate-50/20" />
                {columns.map(col => (
                  <td key={col.id} className="border-r border-slate-200 bg-slate-50/10" />
                ))}
              </tr>

              {/* PHÂN ĐOẠN 1B: PHỤ PHÍ CỐ ĐỊNH (FIXED SURCHARGES) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>1B. PHỤ PHÍ CỐ ĐỊNH (QUẢN LÝ, KIỂM ĐẾM & PHÍ ĐỊNH KỲ HÀNG THÁNG)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH PHỤ PHÍ CỐ ĐỊNH */}
              {fixedSurcharges.map((fix) => (
                <tr key={fix.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => setFixedSurcharges(fixedSurcharges.filter(f => f.id !== fix.id))}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Xóa phụ phí này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-slate-800 truncate">• {fix.name}</span>
                          {fix.note && <span className="text-[10px] text-slate-400 block truncate">{fix.note}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        Cố định
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                    {fix.unit}
                  </td>
                  {columns.map((col, idx) => (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      {idx === 0 ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={fix.price ? fix.price.toLocaleString('vi-VN') : ''}
                            onChange={(e) => {
                              const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                              setFixedSurcharges(fixedSurcharges.map(f => f.id === fix.id ? { ...f, price: num } : f));
                            }}
                            className="w-full text-right font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none pr-6 shadow-2xs"
                            placeholder="0"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                            {currencySymbol}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Dùng chung mức phí
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* HÀNG HÀNH ĐỘNG DƯỚI CÙNG 1B: CHỌN PHỤ PHÍ CỐ ĐỊNH TỪ LOV HOẶC THÊM TÙY CHỈNH (THEO THIẾT KẾ MẪU) */}
              <tr className="bg-slate-50/30 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-3 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    {availableFixedLov.length > 0 ? (
                      <div className="relative flex-1">
                        <select
                          value={selectedFixedCode}
                          onChange={(e) => handleAddFixedFromLov(e.target.value)}
                          className="w-full text-xs font-bold text-amber-700 hover:text-amber-800 bg-white hover:bg-amber-50/30 border-2 border-amber-400 hover:border-amber-500 rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none shadow-2xs transition-all pr-8 tracking-wide"
                        >
                          <option value="" className="text-amber-700 font-bold">
                            + Chọn phụ phí cố định thêm từ LOV ({availableFixedLov.length} mục)...
                          </option>
                          {availableFixedLov.map(f => (
                            <option key={f.code} value={f.code} className="text-slate-800 font-medium">
                              {f.name} ({f.unit})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-700">
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-xs text-slate-400 italic px-3 py-2 border-2 border-dashed border-slate-200 rounded-xl text-center">
                        Đã chọn tất cả phụ phí cố định từ LOV
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openCustomFixedModal}
                      className="px-3 py-2 bg-white hover:bg-amber-50/60 text-amber-700 hover:text-amber-800 border-2 border-amber-400 hover:border-amber-500 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap active:scale-95 flex items-center gap-1.5"
                      title="Thêm phụ phí cố định hàng tháng tùy chỉnh"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>+ Tùy chỉnh</span>
                    </button>
                  </div>
                </td>
                <td className="border-r border-slate-200 bg-slate-50/20" />
                {columns.map(col => (
                  <td key={col.id} className="border-r border-slate-200 bg-slate-50/10" />
                ))}
              </tr>

              {/* PHÂN ĐOẠN 2: GIÁ TRỊ GIA TĂNG (VAS) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>2. BIỂU PHÍ DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH DÒNG VAS (VỚI ICON THÙNG RÁC BÊN TRÁI & BADGE VAS BÊN PHẢI THEO MẪU) */}
              {data.vasItems.map((vas) => (
                <tr key={vas.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveVas(vas.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Xóa dịch vụ VAS này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-xs text-slate-800 truncate">• {vas.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        VAS
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                    {vas.unit}
                  </td>
                  {columns.map((col, idx) => (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          value={vas.priceText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData(prev => prev ? ({
                              ...prev,
                              vasItems: prev.vasItems.map(v => v.id === vas.id ? { ...v, priceText: val } : v)
                            }) : prev);
                          }}
                          className="w-full text-center font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none shadow-2xs"
                          placeholder="Mức thu"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}

              {/* HÀNG HÀNH ĐỘNG DƯỚI CÙNG 2: + CHỌN VAS THÊM TỪ DANH MỤC (THEO THIẾT KẾ VÍ DỤ) */}
              <tr className="bg-slate-50/30 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-3 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    {availableVas.length > 0 ? (
                      <div className="relative flex-1">
                        <select
                          value={selectedVasCode}
                          onChange={(e) => handleAddVasFromLov(e.target.value)}
                          className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50/30 border-2 border-indigo-400 hover:border-indigo-500 rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none shadow-2xs transition-all pr-8 tracking-wide"
                        >
                          <option value="" className="text-indigo-600 font-bold">
                            + Chọn VAS thêm từ danh mục ({availableVas.length} mục)...
                          </option>
                          {availableVas.map(v => (
                            <option key={v.code} value={v.code} className="text-slate-800 font-medium">
                              {v.name} ({v.unit})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-xs text-slate-400 italic px-3 py-2 border-2 border-dashed border-slate-200 rounded-xl text-center">
                        Đã chọn tất cả dịch vụ VAS từ danh mục
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openCustomVasModal}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 border-2 border-indigo-300 hover:border-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap active:scale-95"
                      title="Thêm dịch vụ VAS tùy chỉnh"
                    >
                      + Tùy chỉnh
                    </button>
                  </div>
                </td>
                <td className="border-r border-slate-200 bg-slate-50/20" />
                {columns.map(col => (
                  <td key={col.id} className="border-r border-slate-200 bg-slate-50/10" />
                ))}
              </tr>

              {/* PHÂN ĐOẠN 3: CAM KẾT VẬN HÀNH (SLA & OPERATION) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-600" />
                  <span>3. CAM KẾT VẬN HÀNH</span>
                </td>
              </tr>

              {/* DÒNG: KHUNG GIỜ TIẾP NHẬN XE TẢI & CONTAINER */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Khung giờ tiếp nhận xe tải & container</span>
                  <span className="text-[10px] text-slate-500 block">Thời gian mở cổng giao nhận xe</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Khung giờ
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.operatingHours || (isCold ? '24/7 (Cấp nguồn điện lạnh & trực kỹ thuật 24/7)' : (isHazmat ? '07:30 - 18:00 (Khung giờ vận chuyển hóa chất)' : '24/7 (Không cấm giờ xe cont)'))}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, operatingHours: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder={isCold ? '24/7 (Cấp nguồn điện lạnh & trực kỹ thuật 24/7)' : (isHazmat ? '07:30 - 18:00 (Khung giờ vận chuyển hóa chất)' : '24/7 (Không cấm giờ xe cont)')}
                  />
                </td>
              </tr>

              {/* DÒNG: GIỜ CUT-OFF NHẬN LỆNH XUẤT KHO */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Giờ Cut-off nhận lệnh xuất kho trong ngày</span>
                  <span className="text-[10px] text-slate-500 block">Thời hạn tiếp nhận đơn hàng SO trong ca</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Giờ
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.cutOffTime || (isCold ? '15:30 hàng ngày (bảo đảm xuất kho lạnh)' : (isHazmat ? '16:00 hàng ngày (gửi trước MSDS 2 giờ)' : '16:30 hàng ngày'))}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, cutOffTime: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder={isCold ? '15:30 hàng ngày (bảo đảm xuất kho lạnh)' : (isHazmat ? '16:00 hàng ngày (gửi trước MSDS 2 giờ)' : '16:30 hàng ngày')}
                  />
                </td>
              </tr>

              {/* DÒNG: CAM KẾT SLA THỜI GIAN XỬ LÝ */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Thời gian xử lý nhập/xuất kho (SLA)</span>
                  <span className="text-[10px] text-slate-500 block">Thời gian giải phóng xe tại dock</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Giờ
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.sla || (isCold ? '≤ 45 phút tại Dock lạnh có đệm trùm khí' : (isHazmat ? '≤ 60 phút kiểm tra niêm phong & bốc dỡ an toàn' : '2 - 4 giờ kể từ khi xe vào dock'))}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, sla: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder={isCold ? '≤ 45 phút tại Dock lạnh có đệm trùm khí' : (isHazmat ? '≤ 60 phút kiểm tra niêm phong & bốc dỡ an toàn' : '2 - 4 giờ kể từ khi xe vào dock')}
                  />
                </td>
              </tr>

              {/* PHÂN ĐOẠN 4: HIỆU LỰC GIÁ & ĐIỀU KHOẢN THƯƠNG MẠI */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>HIỆU LỰC GIÁ & ĐIỀU KHOẢN THƯƠNG MẠI</span>
                </td>
              </tr>

              {/* DÒNG: HIỆU LỰC GIÁ */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Hiệu lực giá</span>
                  <span className="text-[10px] text-slate-500 block">Thời hạn áp dụng biểu báo giá này</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Ngày
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="date"
                    value={data.validUntil || '2026-12-31'}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, validUntil: e.target.value }) : prev)}
                    className="font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                  />
                </td>
              </tr>

              {/* DÒNG: CHIẾT KHẤU HỢP ĐỒNG DÀI HẠN */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Ưu đãi / Chiết khấu hợp đồng dài hạn</span>
                  <span className="text-[10px] text-slate-500 block">Giảm giá cho hợp đồng từ 12 tháng trở lên</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  % Giá trị
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={data.promotionPercent || 10}
                      onChange={(e) => setData(prev => prev ? ({ ...prev, promotionPercent: parseFloat(e.target.value) || 0 }) : prev)}
                      className="w-20 text-center font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
                  </div>
                </td>
              </tr>

              {/* DÒNG: ĐIỀU KIỆN THANH TOÁN */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Điều kiện thanh toán & kỳ hạn công nợ</span>
                  <span className="text-[10px] text-slate-500 block">Kỳ hạn đối soát & thanh toán hóa đơn</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Kỳ hạn
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.paymentTerms || 'Net 30 ngày'}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, paymentTerms: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder="Net 30 ngày"
                  />
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL THÊM PHỤ PHÍ / VAS TÙY CHỈNH (CHO CẢ 1A, 1B, 2 - KHÔNG DÙNG WINDOW.PROMPT BỊ CHẶN BỞI IFRAME) */}
      {customModal.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className={`px-5 py-3.5 text-white flex items-center justify-between ${
              customModal.type === 'fixed' 
                ? 'bg-gradient-to-r from-amber-700 to-amber-900' 
                : customModal.type === 'vas' 
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-900'
                  : 'bg-gradient-to-r from-indigo-700 to-slate-900'
            }`}>
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-black tracking-tight">
                  {customModal.type === 'fixed' && 'Thêm Phụ Phí Cố Định Hàng Tháng'}
                  {customModal.type === 'variable' && 'Thêm Phụ Phí Biến Đổi Vận Hành'}
                  {customModal.type === 'vas' && 'Thêm Dịch Vụ Giá Trị Gia Tăng (VAS)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-300 hover:text-white rounded cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              {/* Tên */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {customModal.type === 'fixed' && 'Tên phụ phí cố định (*):'}
                  {customModal.type === 'variable' && 'Tên phụ phí biến đổi (*):'}
                  {customModal.type === 'vas' && 'Tên dịch vụ VAS (*):'}
                </label>
                <input
                  type="text"
                  autoFocus
                  value={customModal.name}
                  onChange={(e) => setCustomModal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={
                    customModal.type === 'fixed'
                      ? 'VD: Phí kiểm đếm WMS & duy trì hệ thống'
                      : customModal.type === 'variable'
                        ? 'VD: Phí phân loại hàng lẻ, quấn màng co'
                        : 'VD: Dán nhãn phụ hàng hóa, đóng gói đặc biệt'
                  }
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                />
              </div>

              {/* Đơn vị tính */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đơn vị tính (ĐVT):
                </label>
                <input
                  type="text"
                  value={customModal.unit}
                  onChange={(e) => setCustomModal(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="VD: VND / Tháng, VND / Lần, VND / Pallet..."
                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none mb-1.5 shadow-2xs"
                />
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] text-slate-400 font-medium py-0.5">Gợi ý nhanh:</span>
                  {(customModal.type === 'fixed'
                    ? ['VND / Tháng', 'VND / Lần', 'VND / Xe / Tháng', 'VND / Quý', 'VND / Năm']
                    : customModal.type === 'variable'
                      ? ['VND / Pallet', 'VND / Kiện', 'VND / Tấn', 'VND / Cont', 'VND / Thùng']
                      : ['VND / Tem', 'VND / Hộp', 'VND / Kiện', 'VND / Pallet', 'VND / Lần']
                  ).map((quickUnit) => (
                    <button
                      key={quickUnit}
                      type="button"
                      onClick={() => setCustomModal(prev => ({ ...prev, unit: quickUnit }))}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      {quickUnit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mức phí */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {customModal.type === 'fixed' ? 'Mức phí định kỳ (VND):' : 'Đơn giá dự kiến (VND):'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customModal.price ? parseInt(customModal.price.replace(/[^\d]/g, ''), 10).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                      setCustomModal(prev => ({ ...prev, price: num.toString() }));
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 text-right pr-8 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* Ghi chú / Phạm vi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {customModal.type === 'vas' ? 'Cam kết SLA dịch vụ:' : 'Ghi chú / Phạm vi áp dụng (tùy chọn):'}
                </label>
                <input
                  type="text"
                  value={customModal.note}
                  onChange={(e) => setCustomModal(prev => ({ ...prev, note: e.target.value }))}
                  placeholder={
                    customModal.type === 'fixed'
                      ? 'VD: Áp dụng định kỳ ngày 1 hàng tháng'
                      : customModal.type === 'vas'
                        ? 'VD: Thời gian hoàn tất trong vòng 24h'
                        : 'VD: Theo thực tế khối lượng phát sinh'
                  }
                  className="w-full px-3 py-1.5 text-xs text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCustomModal(prev => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveCustomItem}
                disabled={!customModal.name.trim()}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-1.5 ${
                  customModal.type === 'fixed'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : customModal.type === 'vas'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Xác nhận thêm</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddColumnModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-300" />
                <h3 className="text-sm font-black tracking-tight">Thêm Cột Đo Lường / Loại Hình Lưu Trữ</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddColumnModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn nhanh từ gợi ý tiêu chuẩn:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {activePresetColumns.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewColumnName(preset.name);
                        setNewColumnUnit(preset.unit);
                      }}
                      className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-medium text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="block font-bold text-[11px] text-indigo-950">{preset.name}</span>
                      <span className="text-[10px] text-slate-500">ĐVT: {preset.unit}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên cột đo lường / loại hình lưu trữ:
                  </label>
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="VD: Kệ Drive-In (Pallet) hoặc Tải trọng sàn (Tấn)"
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đơn vị tính (ĐVT):
                  </label>
                  <input
                    type="text"
                    value={newColumnUnit}
                    onChange={(e) => setNewColumnUnit(e.target.value)}
                    placeholder="VD: m², Pallet, m³, Tấn, Hộp..."
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddColumnModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleAddColumn(newColumnName, newColumnUnit)}
                disabled={!newColumnName.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                Xác nhận thêm cột
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
