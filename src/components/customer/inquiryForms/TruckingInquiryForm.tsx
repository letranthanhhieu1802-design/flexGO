import React, { useEffect, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  Layers, 
  Scale, 
  Box, 
  Snowflake, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  FileText, 
  Sliders, 
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  Navigation,
  Plus,
  Trash2,
  Timer
} from 'lucide-react';
import { TruckingInquirySpecs, CargoClassification } from '../../../types';
import { VASItemDef } from './VASSection';

// --- VAS DEFINITIONS BY SEGMENT ---

export const TRUCKING_GENERAL_FTL_VAS: VASItemDef[] = [
  {
    id: 't-ftl-return',
    name: 'Tìm xe quay đầu / Ghép chiều về (Backhaul / Return Trucking)',
    desc: 'Ưu tiên kết nối xe rỗng chiều về tuyến này để tối ưu 25% - 40% chi phí cước vận chuyển.',
    tag: 'Xe quay đầu giá tốt',
    freeTag: '⚡ Giảm 25-40% cước',
    isFreeOrIncluded: true,
    popular: true,
  },
  {
    id: 't-ftl-1',
    name: 'Bốc xếp nhân công 2 đầu (Loading / Unloading Labor)',
    desc: 'Cung cấp đội ngũ bốc xếp chuyên nghiệp tại kho gửi và kho nhận hàng.',
    tag: 'Nhân công bốc dỡ',
    popular: true,
  },
  {
    id: 't-ftl-2',
    name: 'Định vị GPS Real-time & Chia sẻ Link hành trình (Live GPS Tracking)',
    desc: 'Cung cấp đường link GPS theo dõi trực tuyến 24/7 lộ trình xe di chuyển cho chủ hàng và kho nhận.',
    tag: 'GPS Real-time',
    freeTag: '🎁 Thường tặng kèm 0đ',
    isFreeOrIncluded: true,
    popular: true,
  },
  {
    id: 't-ftl-3',
    name: 'Giấy phép vào phố giờ cấm tải (City Day Entry Permit)',
    desc: 'Thu xếp giấy phép lưu thông nội đô giờ cấm tải cho xe tải vào ban ngày (HN / HCM).',
    tag: 'Giấy phép phố cấm',
    popular: true,
  },
  {
    id: 't-ftl-4',
    name: 'Hạ bửng nâng thủy lực thùng xe (Hydraulic Tail-lift Truck)',
    desc: 'Xe tải trang bị bửng nâng thủy lực phía sau hỗ trợ lên/xuống hàng nặng hoặc pallet không cần xe nâng.',
    tag: 'Bửng nâng thủy lực',
    popular: true,
  },
  {
    id: 't-ftl-5',
    name: 'Niêm phong kẹp chì an ninh Seal & Chụp ảnh đối soát (Security Seal & Inspection)',
    desc: 'Kẹp chì an ninh bảo mật thùng xe và chụp ảnh nghiệm thu kiện hàng 2 đầu gửi/nhận trước khi xuất bến.',
    tag: 'Niêm phong Seal & Ảnh',
    freeTag: '🎁 Thường tặng kèm 0đ',
    isFreeOrIncluded: true,
  },
  {
    id: 't-ftl-6',
    name: 'Thu hồi chứng từ gốc POD 24-48h (POD Return Express)',
    desc: 'Bàn giao lại biên bản giao nhận có chữ ký đóng dấu gốc về văn phòng chủ hàng hỏa tốc.',
    tag: 'Thu hồi POD gốc',
    popular: true,
  },
  {
    id: 't-ftl-7',
    name: 'Chèn lót túi khí & Chằng buộc tăng đơ chuyên dụng (Lashing & Dunnage)',
    desc: 'Dây cáp chịu lực, đệm lót túi khí chèn khe hở thùng xe chống xô lệch va đập hàng.',
    tag: 'Chằng buộc an toàn',
  },
  {
    id: 't-ftl-8',
    name: 'Dịch vụ cẩu tự hành / Xe cẩu hạ bãi (Mobile Crane Handling)',
    desc: 'Xe cẩu tự hành 3.5T - 15T cẩu hạ máy móc thiết bị nặng tại hiện trường.',
    tag: 'Cẩu tự hành',
  },
  {
    id: 't-ftl-9',
    name: 'Phí lưu đêm / Chờ bốc xếp quá giờ tại kho (Overnight Demurrage)',
    desc: 'Hỗ trợ lưu bãi xe qua đêm hoặc chờ đợi trên 4 tiếng tại kho bãi nhà máy.',
    tag: 'Lưu đêm bãi',
  },
  {
    id: 't-ftl-10',
    name: 'Bảo hiểm hàng hóa vận tải nội địa (Cargo Insurance)',
    desc: 'Bảo hiểm trách nhiệm vận chuyển bồi thường 100% giá trị khai báo khi xảy ra sự cố.',
    tag: 'Bảo hiểm 100%',
  },
];

export const TRUCKING_GENERAL_LTL_VAS: VASItemDef[] = [
  {
    id: 't-ltl-1',
    name: 'Lấy & Giao hàng tận nơi Door-to-Door (Last-Mile Delivery)',
    desc: 'Xe tải nhỏ trung chuyển nhận hàng tận kho gửi và giao tận địa chỉ người nhận.',
    tag: 'Door-to-Door',
    popular: true,
  },
  {
    id: 't-ltl-2',
    name: 'Định vị GPS & Cập nhật trạng thái từng trạm Hub (Real-time Status Tracking)',
    desc: 'Cập nhật thông báo tiến độ giao nhận và định vị kiện hàng trực tuyến qua hệ thống.',
    tag: 'Tracking GPS & Trạng thái',
    freeTag: '🎁 Thường tặng kèm 0đ',
    isFreeOrIncluded: true,
    popular: true,
  },
  {
    id: 't-ltl-3',
    name: 'Thu hồi biên bản giao nhận e-POD / Bản chụp ký nhận (e-POD Instant Return)',
    desc: 'Chụp ảnh biên bản giao nhận có chữ ký gửi ngay qua Zalo/Email ngay khi giao xong.',
    tag: 'e-POD Chụp ảnh',
    freeTag: '🎁 Thường tặng kèm 0đ',
    isFreeOrIncluded: true,
  },
  {
    id: 't-ltl-4',
    name: 'Bốc xếp kiện lẻ tận nơi / Lên lầu / Vào hẻm sâu (Hand Carry / Floor Delivery)',
    desc: 'Nhân công bốc vác lên tầng lầu hoặc chuyển vào ngõ hẻm xe tải không vào được.',
    tag: 'Bốc vác tận nơi',
  },
  {
    id: 't-ltl-5',
    name: 'Đóng gói quấn màng PE, bọc xốp & Đóng khung gỗ (Packaging & Wooden Crates)',
    desc: 'Quấn màng co chống trầy xước và đóng khung gỗ bảo vệ cho hàng dễ vỡ khi ghép xe.',
    tag: 'Đóng kiện gỗ/PE',
    popular: true,
  },
  {
    id: 't-ltl-6',
    name: 'Dịch vụ thu hộ tiền hàng (COD) & Đối soát trong 24h (Cash On Delivery)',
    desc: 'Thu hộ tiền mặt hoặc chuyển khoản từ người nhận và đối soát chuyển tiền nhanh chóng.',
    tag: 'Thu hộ COD',
    popular: true,
  },
  {
    id: 't-ltl-7',
    name: 'Dán nhãn phụ tiếng Việt & In mã vạch phân loại kiện lẻ (Barcode & Labeling)',
    desc: 'In dán tem nhãn nhận diện từng kiện hàng tránh thất lạc và nhầm lẫn khi ghép qua Hub.',
    tag: 'Tem nhãn mã vạch',
  },
  {
    id: 't-ltl-8',
    name: 'Lưu kho trung chuyển tạm thời tại Hub 48-72h (Hub Consolidation Holding)',
    desc: 'Lưu kho hỗ trợ tại Hub trước khi xuất bến hoặc chờ người nhận đến lấy hàng.',
    tag: 'Lưu kho Hub',
  },
  {
    id: 't-ltl-9',
    name: 'Giao hàng hẹn giờ chính xác / Ngoài giờ hành chính (Off-hour Appointment Delivery)',
    desc: 'Giao hàng vào khung giờ tối hoặc cuối tuần theo lịch hẹn của người nhận.',
    tag: 'Hẹn giờ giao',
  },
  {
    id: 't-ltl-10',
    name: 'Bảo hiểm hàng lẻ theo giá trị khai báo (LTL Declared Value Insurance)',
    desc: 'Bảo hiểm trách nhiệm bồi thường 100% giá trị kiện lẻ khi xảy ra rủi ro va đập, thất lạc.',
    tag: 'Bảo hiểm 100%',
  },
];

export const TRUCKING_REEFER_VAS: VASItemDef[] = [
  {
    id: 't-rf-load',
    name: 'Bốc dỡ & Bốc xếp hàng hóa 2 đầu kho bãi (Loading & Unloading Labor)',
    desc: 'Đội ngũ nhân công bốc dỡ, chuyển hàng từ kho lạnh lên/xuống thùng xe nhanh chóng, đúng quy trình.',
    tag: 'Bốc dỡ 2 đầu',
    popular: true,
  },
  {
    id: 't-rf-1',
    name: 'Làm lạnh trước thùng xe 30-60 phút (Pre-cooling)',
    desc: 'Đưa nhiệt độ buồng lạnh về đúng Set-point trước khi mở cửa nhận hàng, chống sốc nhiệt.',
    tag: 'Pre-cooling',
    popular: true,
  },
  {
    id: 't-rf-2',
    name: 'Thiết bị IoT GPS & Cảm biến nhiệt Real-time 24/7 (Live Temp Log)',
    desc: 'Cung cấp link theo dõi nhiệt độ trực tuyến và xuất biểu đồ nhiệt PDF có mốc thời gian khi kết thúc chuyến.',
    tag: 'IoT Cảm biến nhiệt',
    popular: true,
  },
  {
    id: 't-rf-multidrop',
    name: 'Giao hàng đa điểm & Kiểm đếm chi tiết từng điểm dỡ lạnh (Multi-drop & Counting)',
    desc: 'Giao hàng phân tán nhiều điểm (chuỗi siêu thị, đại lý, kho phụ) và kiểm đếm chi tiết từng thùng/kiện.',
    tag: 'Giao đa điểm',
    popular: true,
  },
  {
    id: 't-rf-3',
    name: 'Máy phát điện dự phòng Clip-on Genset (Continuous Power)',
    desc: 'Đảm bảo giàn lạnh cont/xe chạy liên tục suốt tuyến Bắc - Nam không gián đoạn nguồn điện.',
    tag: 'Genset liên tục',
    popular: true,
  },
  {
    id: 't-rf-7',
    name: 'Bảo hiểm rủi ro đứt gãy chuỗi lạnh (Temperature Excursion Policy)',
    desc: 'Cam kết bồi thường 100% nếu xảy ra sự cố suy giảm chất lượng do máy lạnh trục trặc hoặc mất nhiệt độ.',
    tag: 'Bảo hiểm chuỗi lạnh',
    popular: true,
  },
  {
    id: 't-rf-4',
    name: 'Cắm điện duy trì tại bãi / kho trung chuyển (Yard Plug-in Fee)',
    desc: 'Cung cấp nguồn điện 3 pha tại bãi đỗ xe khi xe chờ dỡ hàng qua đêm hoặc lưu ca chờ thủ tục.',
    tag: 'Cắm điện bãi',
  },
  {
    id: 't-rf-6',
    name: 'Bốc dỡ nhanh qua Dock trùm túi khí (Inflatable Shelter Cold Dock)',
    desc: 'Bốc dỡ qua cửa đệm khí phòng lạnh cách nhiệt, ngăn thoát nhiệt và chống đọng sương bề mặt hàng.',
    tag: 'Dock trùm túi khí',
  },
  {
    id: 't-rf-5',
    name: 'Cung cấp đá gel bảo ôn, đá khô / Thùng xốp bổ trợ (Gel Ice Packs & Foam Box)',
    desc: 'Trang bị phụ trợ duy trì độ lạnh cho các kiện hàng lấy dỡ phân tán hoặc giao hàng chặng cuối.',
    tag: 'Đá gel / Thùng xốp',
  },
  {
    id: 't-rf-pod',
    name: 'Bàn giao chứng từ gốc & Biểu đồ nhiệt có ký nhận (Cold Chain POD & Sign-off)',
    desc: 'Ký biên bản xác nhận nhiệt độ lúc nhận/giao và chuyển phát nhanh chứng từ POD gốc về doanh nghiệp.',
    tag: 'POD & Nhật ký nhiệt',
  },
  {
    id: 't-rf-seal',
    name: 'Niêm phong chì bảo mật & Dán tem giám sát thùng lạnh (Security Seal & Temp Tag)',
    desc: 'Niêm phong kẹp chì cửa thùng xe và dán tem nhiệt độ niêm phong chống mở cửa trái phép trên đường.',
    tag: 'Niêm phong chì',
  },
];

export const TRUCKING_HAZMAT_VAS: VASItemDef[] = [
  {
    id: 't-dg-1',
    name: 'Xin Giấy phép vận chuyển hàng nguy hiểm (PCCC & Bộ Công An)',
    desc: 'Hoàn tất hồ sơ thẩm định và xin giấy phép lưu hành theo Nghị định 34/2024/NĐ-CP.',
    tag: 'Giấy phép PCCC',
    popular: true,
  },
  {
    id: 't-dg-2',
    name: 'Bộ trang bị xử lý sự cố tràn đổ Spill Kit (Spill Kit Response)',
    desc: 'Bộ dụng cụ khẩn cấp trên xe gồm cát trơ, tấm thấm hóa chất và xẻng chống tia lửa.',
    tag: 'Spill Kit khẩn cấp',
    popular: true,
  },
  {
    id: 't-dg-3',
    name: 'Dán biển cảnh báo Placard IMO / UN 4 chiều (IMO Placarding)',
    desc: 'Dán bảng số UN và nhãn cảnh báo nguy hiểm 4 mặt xe theo quy chuẩn quốc tế.',
    tag: 'Dán biển Placard',
    popular: true,
  },
  {
    id: 't-dg-4',
    name: 'Tài xế & Áp tải có chứng chỉ nghiệp vụ an toàn DG (Certified Crew)',
    desc: 'Đội ngũ đã được đào tạo và cấp thẻ an toàn vận chuyển hóa chất / PCCC hợp lệ.',
    tag: 'Chứng chỉ DG',
  },
  {
    id: 't-dg-5',
    name: 'Chằng buộc & Khóa lashing chuyên dụng Thùng phuy / IBC Tank',
    desc: 'Khóa tăng đơ sàn và thanh chống xô lệch đặc dụng cho bồn 1000L và phuy hóa chất.',
    tag: 'Khóa lashing IBC/Phuy',
  },
  {
    id: 't-dg-6',
    name: 'Xe hộ tống an ninh / Xe hoa tiêu dẫn đường (Escort Convoy)',
    desc: 'Xe dẫn đường chuyên dụng cho các lô hàng hóa chất cực kỳ nguy hiểm.',
    tag: 'Xe hộ tống',
  },
  {
    id: 't-dg-7',
    name: 'Bảo hiểm trách nhiệm môi trường & Cháy nổ hóa chất (Liability)',
    desc: 'Bảo hiểm bao gồm chi phí tẩy rửa khắc phục ô nhiễm môi trường và cháy nổ.',
    tag: 'Bảo hiểm môi trường',
  },
];

// Fallback for general lookup
export const TRUCKING_VAS_ITEMS: VASItemDef[] = TRUCKING_GENERAL_FTL_VAS;

// --- TRUCK BODY & TONNAGE MATRICES ---

export interface TruckBodyOption {
  id: string;
  name: string;
  desc: string;
  badge: string;
  tonnages: {
    id: string;
    label: string;
    cbm: string;
    dimensions: string;
    payloadKg: number;
    recommended: string;
  }[];
}

// 1. GENERAL CARGO - FTL TRUCK OPTIONS
export const GENERAL_FTL_TRUCK_BODIES: TruckBodyOption[] = [
  {
    id: 'box_truck',
    name: 'Xe Tải Thùng Kín (Dry Box Truck)',
    desc: 'Chống nước, chống bụi tuyệt đối, có khóa seal an ninh. Phù hợp hàng tiêu dùng, điện tử, carton.',
    badge: 'An ninh cao / Chống ướt',
    tonnages: [
      { id: 'box_1t_1.9t', label: '1.0T – 1.9T (Vào phố ban ngày)', cbm: '7 – 9 CBM', dimensions: 'D 3.1 - 4.3m x R 1.7m x C 1.8m', payloadKg: 1900, recommended: 'Nội đô ban ngày, 2-3 Pallets' },
      { id: 'box_2.5t_3.5t', label: '2.5T – 3.5T (Tải nhẹ liên tỉnh)', cbm: '14 – 16 CBM', dimensions: 'D 4.3m x R 1.9m x C 2.0m', payloadKg: 3500, recommended: 'Tuyến ngắn, 4-5 Pallets' },
      { id: 'box_5t_6.5t', label: '5.0T – 6.5T (Tải trung)', cbm: '25 – 30 CBM', dimensions: 'D 5.8 - 6.2m x R 2.1m x C 2.2m', payloadKg: 6500, recommended: 'Liên tỉnh, 8-10 Pallets' },
      { id: 'box_8t', label: '8.0T (Tải nặng 2 chân)', cbm: '45 – 50 CBM', dimensions: 'D 7.8 - 8.2m x R 2.35m x C 2.4m', payloadKg: 8000, recommended: 'Bắc Nam, 14-16 Pallets' },
      { id: 'box_15t', label: '15.0T (Tải nặng 3 chân)', cbm: '55 – 60 CBM', dimensions: 'D 9.4 - 9.8m x R 2.35m x C 2.5m', payloadKg: 15000, recommended: 'Khối tích lớn, 18-20 Pallets' },
    ],
  },
  {
    id: 'tarpaulin_truck',
    name: 'Xe Tải Mui Bạt (Tarpaulin Truck)',
    desc: 'Linh hoạt mở bạt hông để xe nâng xúc pallet 2 bên, thông thoáng, chở hàng máy móc, sắt thép.',
    badge: 'Mở bạt 2 bên hông',
    tonnages: [
      { id: 'tarp_2.5t_3.5t', label: '2.5T – 3.5T (Mui bạt tiêu chuẩn)', cbm: '~15 CBM', dimensions: 'D 4.3m x R 1.9m x C 2.0m', payloadKg: 3500, recommended: '4-5 Pallets xếp hông' },
      { id: 'tarp_5t_7t', label: '5.0T – 7.0T (Mui bạt trung)', cbm: '~32 CBM', dimensions: 'D 6.2m x R 2.2m x C 2.3m', payloadKg: 7000, recommended: '10-12 Pallets' },
      { id: 'tarp_8t_9t', label: '8.0T – 9.0T (2 chân thùng dài 9.8m cồng kềnh)', cbm: '~55 CBM', dimensions: 'D 9.8m x R 2.35m x C 2.5m', payloadKg: 8500, recommended: 'Hàng nhẹ cồng kềnh, mút xốp' },
      { id: 'tarp_15t', label: '15.0T (3 chân mui bạt)', cbm: '~58 CBM', dimensions: 'D 9.5m x R 2.35m x C 2.5m', payloadKg: 15000, recommended: 'Trục Bắc Nam, 18-20 Pallets' },
      { id: 'tarp_18t_20t', label: '18.0T – 20.0T (4 chân - 5 chân tải nặng)', cbm: '~65 CBM', dimensions: 'D 9.8m x R 2.38m x C 2.6m', payloadKg: 20000, recommended: 'Tải nặng đường dài, vật liệu' },
    ],
  },
  {
    id: 'tail_lift_truck',
    name: 'Xe Tải Có Bửng Nâng Thủy Lực (Tail-lift)',
    desc: 'Trang bị bàn nâng hạ phía sau, phục vụ điểm giao/lấy không có Dock Leveler hoặc không có xe nâng.',
    badge: 'Bửng nâng tự động',
    tonnages: [
      { id: 'tail_1.9t_2.5t', label: '1.9T – 2.5T (Bửng nâng tải 500kg)', cbm: '9 – 12 CBM', dimensions: 'D 4.3m x R 1.9m x C 2.0m', payloadKg: 2200, recommended: 'Giao siêu thị, phố hẹp' },
      { id: 'tail_5t', label: '5.0T (Bửng nâng tải 1.0T – 1.5T)', cbm: '~26 CBM', dimensions: 'D 5.8m x R 2.1m x C 2.2m', payloadKg: 4800, recommended: 'Giao showroom, máy móc' },
      { id: 'tail_8t_15t', label: '8.0T – 15.0T (Bửng nâng tải nặng 2.0T)', cbm: '45 – 55 CBM', dimensions: 'D 8.2 - 9.5m x R 2.35m x C 2.4m', payloadKg: 14000, recommended: 'Thiết bị công nghiệp, tủ điện' },
    ],
  },
  {
    id: 'flatbed_truck',
    name: 'Xe Tải Thùng Lửng / Mooc Sàn (Flatbed)',
    desc: 'Không nóc, bốc dỡ linh hoạt bằng cẩu tự hành hoặc cẩu trục nhà xưởng từ trên xuống.',
    badge: 'Cẩu hạ từ trên nóc',
    tonnages: [
      { id: 'flat_5t_8t', label: '5.0T – 8.0T (Thùng lửng cẩu hàng)', cbm: 'Không giới hạn nóc', dimensions: 'D 6.2 - 7.5m x R 2.3m x C 0.6m', payloadKg: 8000, recommended: 'Sắt thép cây, đá ốp lát' },
      { id: 'flat_15t', label: '15.0T (Thùng lửng 3 chân)', cbm: 'Không giới hạn nóc', dimensions: 'D 9.5m x R 2.4m x C 0.6m', payloadKg: 15000, recommended: 'Cấu kiện sắt, ống nhựa, thép cuộn' },
    ],
  },
  {
    id: 'container_tractor',
    name: 'Đầu Kéo Kéo Container (Tractor Drayage)',
    desc: 'Kéo vỏ container 20ft/40ft/45ft từ Cảng, ICD, Depot về kho đóng hàng hoặc xuất khẩu.',
    badge: 'Kéo vỏ Cont Cảng / ICD',
    tonnages: [
      { id: 'cont_20ft', label: 'Đầu kéo + Rơ-mooc 20ft (Tải trọng 26 - 28 Tấn)', cbm: '~33 CBM', dimensions: 'D 6.06m x R 2.44m x C 2.59m', payloadKg: 28000, recommended: 'Hàng nặng, nông sản, khoáng sản' },
      { id: 'cont_40ft', label: 'Đầu kéo + Rơ-mooc 40ft (Xương / Cổ cò - Tải trọng 28 - 30 Tấn)', cbm: '~67 CBM', dimensions: 'D 12.19m x R 2.44m x C 2.59m', payloadKg: 30000, recommended: 'Hàng xuất nhập khẩu tổng hợp' },
      { id: 'cont_45ft', label: 'Đầu kéo + Rơ-mooc 45ft High Cube', cbm: '~85 CBM', dimensions: 'D 13.71m x R 2.44m x C 2.89m', payloadKg: 28000, recommended: 'Thể tích cực lớn, dệt may, nội thất' },
    ],
  },
];

// 2. REEFER CARGO - FTL TRUCK OPTIONS (100% FTL)
export const REEFER_FTL_TRUCK_BODIES: TruckBodyOption[] = [
  {
    id: 'reefer_small',
    name: 'Xe Tải Thùng Đông Lạnh Nhỏ (City Reefer)',
    desc: 'Trang bị giàn lạnh Hwasung/Thermal Master. Phục vụ nội đô ban ngày, giao chuỗi siêu thị/nhà hàng.',
    badge: 'Vào phố / Giao siêu thị',
    tonnages: [
      { id: 'rf_1t_1.4t', label: '1.0T – 1.4T (Vào phố ban ngày)', cbm: '6 – 7 CBM', dimensions: 'D 3.1m x R 1.65m x C 1.65m', payloadKg: 1400, recommended: 'Giao kem, sữa tươi nội thành' },
      { id: 'rf_1.9t_2.4t', label: '1.9T – 2.4T (Thùng lạnh 3-4 Pallets)', cbm: '9 – 11 CBM', dimensions: 'D 4.3m x R 1.85m x C 1.85m', payloadKg: 2400, recommended: 'Chuỗi cửa hàng tiện lợi, 3-4 Pallets' },
    ],
  },
  {
    id: 'reefer_medium',
    name: 'Xe Tải Thùng Đông Lạnh Trung (Regional Reefer)',
    desc: 'Giàn lạnh Thermo King/Carrier Transicold đạt chuẩn âm sâu -20°C cho tuyến liên tỉnh.',
    badge: 'Giàn lạnh Thermo King',
    tonnages: [
      { id: 'rf_3.5t', label: '3.5T (Thùng dài 4.3m – 5.2m)', cbm: '15 – 18 CBM', dimensions: 'D 5.2m x R 2.0m x C 2.0m', payloadKg: 3500, recommended: '6-8 Pallets, trái cây, thịt tươi' },
      { id: 'rf_5t_6.5t', label: '5.0T – 6.5T (Thùng dài 5.8m – 6.2m)', cbm: '24 – 28 CBM', dimensions: 'D 6.2m x R 2.1m x C 2.1m', payloadKg: 6500, recommended: '10-12 Pallets, thủy hải sản' },
    ],
  },
  {
    id: 'reefer_heavy',
    name: 'Xe Tải Đông Lạnh Tải Nặng 3 Chân (Long-haul Reefer)',
    desc: 'Chuyên tuyến Bắc Nam, giàn lạnh nóc công suất lớn, cách nhiệt composite foam Polyurethane 80mm.',
    badge: 'Trục Bắc Nam / 16-18 Pallets',
    tonnages: [
      { id: 'rf_12t_15t', label: '12.0T – 15.0T (3 Chân thùng dài 9.2m – 9.6m)', cbm: '48 – 54 CBM', dimensions: 'D 9.4m x R 2.3m x C 2.3m', payloadKg: 15000, recommended: '16-18 Pallets thủy sản, dược phẩm' },
    ],
  },
  {
    id: 'reefer_container',
    name: 'Đầu Kéo Kéo Container Lạnh (Reefer Drayage)',
    desc: 'Kéo container lạnh 20RF / 40RF từ cảng hoặc kho lạnh xuất khẩu, trang bị máy phát Genset.',
    badge: 'Cont 20RF / 40RF + Genset',
    tonnages: [
      { id: 'cont_20rf', label: 'Đầu kéo + Cont 20RF Lạnh (22 – 24 Tấn)', cbm: '~28 CBM', dimensions: 'D 5.44m x R 2.29m x C 2.27m', payloadKg: 24000, recommended: 'Hàng cấp đông nặng, thịt cá' },
      { id: 'cont_40rf_40rh', label: 'Đầu kéo + Cont 40RF / 40RH Cao Lạnh (26 – 28 Tấn)', cbm: '~67 CBM', dimensions: 'D 11.58m x R 2.29m x C 2.55m', payloadKg: 28000, recommended: 'Trái cây xuất khẩu, kem, vắc xin' },
    ],
  },
];

// 3. HAZMAT CARGO - FTL TRUCK OPTIONS (100% FTL)
export const HAZMAT_FTL_TRUCK_BODIES: TruckBodyOption[] = [
  {
    id: 'dg_box_truck',
    name: 'Xe Tải Thùng Kín Chuyên Dụng Hóa Chất (DG Dry Box)',
    desc: 'Thùng kín có quạt thông gió chống tích tụ khí, sàn chống tĩnh điện, tiếp địa xích đồng, dán bảng số UN.',
    badge: 'Sàn chống tĩnh điện / Tiếp địa',
    tonnages: [
      { id: 'dg_box_1.9t_3.5t', label: '1.9T – 3.5T (Hóa chất nội đô)', cbm: '12 – 15 CBM', dimensions: 'D 4.3m x R 1.9m x C 2.0m', payloadKg: 3500, recommended: 'Giao hóa chất nhà máy, phòng lab' },
      { id: 'dg_box_5t_8t', label: '5.0T – 8.0T (Hóa chất liên tỉnh)', cbm: '28 – 40 CBM', dimensions: 'D 6.8 - 7.8m x R 2.3m x C 2.3m', payloadKg: 8000, recommended: 'Hóa chất bao tải, thùng sơn, can nhựa' },
      { id: 'dg_box_15t', label: '15.0T (3 Chân chở phuy / IBC Tank)', cbm: '50 – 55 CBM', dimensions: 'D 9.4m x R 2.35m x C 2.4m', payloadKg: 15000, recommended: 'Chở 16-18 Thùng IBC 1000L hoặc 80 Phuy' },
    ],
  },
  {
    id: 'chemical_tanker',
    name: 'Xe Bồn Xitec Chuyên Dụng (Chemical Tanker)',
    desc: 'Bồn Inox 316L hoặc lót Composite chống ăn mòn, van ngắt khẩn cấp, cảm biến chống tràn.',
    badge: 'Bồn Inox 316L / Chống tràn',
    tonnages: [
      { id: 'tanker_10k_18k', label: '10.000 Lít – 18.000 Lít (Bồn 3-4 ngăn)', cbm: '10 – 18 m³', dimensions: 'Xe bồn 3 chân chuyên dụng', payloadKg: 18000, recommended: 'Dung môi công nghiệp, Cồn ethanol' },
      { id: 'tanker_25k_32k', label: '25.000 Lít – 32.000 Lít (Mooc bồn Axit/Kiềm)', cbm: '25 – 32 m³', dimensions: 'Sơ-mi rơ-mooc bồn Inox', payloadKg: 32000, recommended: 'Axit H2SO4, HCl, Xút lỏng NaOH' },
    ],
  },
  {
    id: 'iso_tank_drayage',
    name: 'Đầu Kéo Kéo Bồn ISO Tank / Cont Hóa Chất',
    desc: 'Kéo bồn ISO Tank tiêu chuẩn T11/T50/T75 hoặc cont chở hóa chất đóng phuy có tài xế chứng chỉ DG.',
    badge: 'ISO Tank T11/T75 Quốc tế',
    tonnages: [
      { id: 'iso_tank_20ft', label: 'Đầu kéo + Bồn ISO Tank 20ft (T11 / T50 / T75)', cbm: '24.000 – 26.000 Lít', dimensions: 'Khung thép 20ft tiêu chuẩn UN', payloadKg: 28000, recommended: 'Hóa chất lỏng xuất nhập khẩu' },
      { id: 'cont_dg_20_40', label: 'Đầu kéo + Cont 20ft / 40ft chở hàng đóng phuy', cbm: '33 – 67 CBM', dimensions: 'Container dán nhãn Placard DG', payloadKg: 30000, recommended: 'Pin Lithium, hóa chất đóng gói' },
    ],
  },
];

// 4. LTL TRUCK OPTIONS (Constrained)
export const LTL_TRUCK_OPTIONS = [
  {
    id: 'ltl_dry_box',
    name: 'Xe Thùng Kín Chuyên Tuyến Ghép LTL',
    desc: 'Chạy lịch cố định hàng ngày giữa các Hub trung chuyển, đảm bảo an toàn tuyệt đối cho kiện lẻ.',
    badge: 'Chạy tuyến cố định / An toàn',
  },
  {
    id: 'ltl_tarpaulin',
    name: 'Xe Mui Bạt Trục Bắc - Nam (Ghép Hàng Thể Tích)',
    desc: 'Phù hợp kiện hàng dài, máy móc thiết bị hoặc hàng cần xe nâng đưa vào từ hông.',
    badge: 'Ghép hàng dài / Cồng kềnh',
  },
];

interface TruckingInquiryFormProps {
  specs: TruckingInquirySpecs;
  onChange: (specs: TruckingInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  cargoClassification?: CargoClassification;
  weightKg?: string;
  setWeightKg?: (val: string) => void;
  volumeCbm?: string;
  setVolumeCbm?: (val: string) => void;
}

export const TruckingInquiryForm: React.FC<TruckingInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
  cargoClassification = 'General',
  weightKg = '',
  setWeightKg,
  volumeCbm = '',
  setVolumeCbm,
}) => {
  const isReefer = cargoClassification === 'Reefer';
  const isHazmat = cargoClassification === 'Hazmat';
  const isGeneral = !isReefer && !isHazmat;

  // If Reefer or Hazmat, force FTL mode
  useEffect(() => {
    if (isReefer || isHazmat) {
      if (specs.loadType !== 'FTL (Nguyên chuyến)') {
        onChange({
          ...specs,
          loadType: 'FTL (Nguyên chuyến)',
        });
      }
    }
  }, [isReefer, isHazmat, specs, onChange]);

  // Multi-pickup and Multi-drop resolution
  const isFTL = specs.loadType === 'FTL (Nguyên chuyến)';
  const isLTL = specs.loadType === 'LTL (Ghép hàng lẻ)';

  // Determine current truck bodies available based on cargoClassification
  const currentTruckBodies = useMemo(() => {
    if (isReefer) return REEFER_FTL_TRUCK_BODIES;
    if (isHazmat) return HAZMAT_FTL_TRUCK_BODIES;
    return GENERAL_FTL_TRUCK_BODIES;
  }, [isReefer, isHazmat]);

  // Find active truck body (only if specs.truckType is selected)
  const selectedBody = useMemo(() => {
    if (!specs.truckType) return undefined;
    return currentTruckBodies.find((b) => b.name === specs.truckType);
  }, [currentTruckBodies, specs.truckType]);

  // Ensure truck type is reset if no longer valid when switching cargo category or loadType
  useEffect(() => {
    if (!specs.truckType) return;

    if (isLTL) {
      const isValidLTL = LTL_TRUCK_OPTIONS.some((b) => b.name === specs.truckType);
      if (!isValidLTL) {
        onChange({
          ...specs,
          truckType: '',
          tonnageCategory: '',
        });
      }
      return;
    }

    const isValidType = currentTruckBodies.some((b) => b.name === specs.truckType);
    if (!isValidType) {
      onChange({
        ...specs,
        truckType: '',
        tonnageCategory: '',
      });
    }
  }, [currentTruckBodies, specs.truckType, onChange, isLTL]);

  const updateSpec = <K extends keyof TruckingInquirySpecs>(key: K, value: TruckingInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  const pickupLocations = useMemo(() => {
    if (isLTL) {
      return [(specs.pickupLocations && specs.pickupLocations[0]) || origin || ''];
    }
    if (specs.pickupLocations && specs.pickupLocations.length > 0) {
      return specs.pickupLocations;
    }
    return [origin || ''];
  }, [specs.pickupLocations, origin, isLTL]);

  const deliveryLocations = useMemo(() => {
    if (isLTL) {
      return [(specs.deliveryLocations && specs.deliveryLocations[0]) || destination || ''];
    }
    if (specs.deliveryLocations && specs.deliveryLocations.length > 0) {
      return specs.deliveryLocations;
    }
    return [destination || ''];
  }, [specs.deliveryLocations, destination, isLTL]);

  const pickupCount = isLTL ? 1 : (specs.pickupPointsCount || pickupLocations.length || 1);
  const deliveryCount = isLTL ? 1 : (specs.deliveryPointsCount || deliveryLocations.length || specs.multiDropPoints || 1);

  const handleSelectLoadType = (newLoadType: 'FTL (Nguyên chuyến)' | 'LTL (Ghép hàng lẻ)') => {
    if (newLoadType === 'LTL (Ghép hàng lẻ)') {
      const firstPickup = (specs.pickupLocations && specs.pickupLocations[0]) || origin || '';
      const firstDelivery = (specs.deliveryLocations && specs.deliveryLocations[0]) || destination || '';
      const isCurrentTruckTypeLTL = LTL_TRUCK_OPTIONS.some((opt) => opt.name === specs.truckType);
      onChange({
        ...specs,
        loadType: newLoadType,
        truckType: isCurrentTruckTypeLTL ? specs.truckType : '',
        tonnageCategory: 'Theo kiện ghép LTL',
        pickupPointsCount: 1,
        pickupLocations: [firstPickup],
        deliveryPointsCount: 1,
        deliveryLocations: [firstDelivery],
        multiDropPoints: 1,
      });
      setOrigin(firstPickup);
      setDestination(firstDelivery);
    } else {
      const isCurrentTruckTypeFTL = currentTruckBodies.some((opt) => opt.name === specs.truckType);
      onChange({
        ...specs,
        loadType: newLoadType,
        truckType: isCurrentTruckTypeFTL ? specs.truckType : '',
        tonnageCategory: isCurrentTruckTypeFTL ? specs.tonnageCategory : '',
      });
    }
  };

  const handlePickupCountChange = (newCount: number) => {
    if (isLTL) return;
    const validCount = Math.max(1, Math.min(10, newCount));
    let newLocations = [...pickupLocations];
    if (validCount > newLocations.length) {
      while (newLocations.length < validCount) {
        newLocations.push('');
      }
    } else if (validCount < newLocations.length) {
      newLocations = newLocations.slice(0, validCount);
    }
    onChange({
      ...specs,
      pickupPointsCount: validCount,
      pickupLocations: newLocations,
    });
    if (newLocations[0] !== undefined) {
      setOrigin(newLocations[0]);
    }
  };

  const handlePickupLocationChange = (index: number, val: string) => {
    const newLocations = [...pickupLocations];
    newLocations[index] = val;
    onChange({
      ...specs,
      pickupLocations: newLocations,
      pickupPointsCount: newLocations.length,
    });
    if (index === 0) {
      setOrigin(val);
    }
  };

  const addPickupLocation = () => {
    if (isLTL) return;
    handlePickupCountChange(pickupCount + 1);
  };

  const removePickupLocation = (index: number) => {
    if (isLTL || pickupLocations.length <= 1) return;
    const newLocations = pickupLocations.filter((_, i) => i !== index);
    onChange({
      ...specs,
      pickupLocations: newLocations,
      pickupPointsCount: newLocations.length,
    });
    if (newLocations[0] !== undefined) {
      setOrigin(newLocations[0]);
    }
  };

  const handleDeliveryCountChange = (newCount: number) => {
    if (isLTL) return;
    const validCount = Math.max(1, Math.min(10, newCount));
    let newLocations = [...deliveryLocations];
    if (validCount > newLocations.length) {
      while (newLocations.length < validCount) {
        newLocations.push('');
      }
    } else if (validCount < newLocations.length) {
      newLocations = newLocations.slice(0, validCount);
    }
    onChange({
      ...specs,
      deliveryPointsCount: validCount,
      multiDropPoints: validCount,
      deliveryLocations: newLocations,
    });
    if (newLocations[0] !== undefined) {
      setDestination(newLocations[0]);
    }
  };

  const handleDeliveryLocationChange = (index: number, val: string) => {
    const newLocations = [...deliveryLocations];
    newLocations[index] = val;
    onChange({
      ...specs,
      deliveryLocations: newLocations,
      deliveryPointsCount: newLocations.length,
      multiDropPoints: newLocations.length,
    });
    if (index === 0) {
      setDestination(val);
    }
  };

  const addDeliveryLocation = () => {
    if (isLTL) return;
    handleDeliveryCountChange(deliveryCount + 1);
  };

  const removeDeliveryLocation = (index: number) => {
    if (isLTL || deliveryLocations.length <= 1) return;
    const newLocations = deliveryLocations.filter((_, i) => i !== index);
    onChange({
      ...specs,
      deliveryLocations: newLocations,
      deliveryPointsCount: newLocations.length,
      multiDropPoints: newLocations.length,
    });
    if (newLocations[0] !== undefined) {
      setDestination(newLocations[0]);
    }
  };

  // Helper for LTL auto calculation
  const handleLtlDimChange = (dimKey: 'lengthCm' | 'widthCm' | 'heightCm', val: number | undefined) => {
    const currentDims = specs.ltlDimensions || { lengthCm: 0, widthCm: 0, heightCm: 0 };
    const newDims = { ...currentDims, [dimKey]: val || 0 };
    const pieces = specs.ltlPieces || 0;
    
    // Calculate total CBM: (L * W * H / 1,000,000) * pieces
    const hasAnyDim = (newDims.lengthCm > 0 || newDims.widthCm > 0 || newDims.heightCm > 0);
    const singleCbm = (newDims.lengthCm * newDims.widthCm * newDims.heightCm) / 1000000;
    const totalCbm = (singleCbm > 0 && pieces > 0) ? parseFloat((singleCbm * pieces).toFixed(2)) : undefined;
    
    // Standard Road Freight Chargeable Ratio: 1 CBM = 250 kg
    const volumetricWeight = totalCbm ? Math.round(totalCbm * 250) : 0;
    const grossWeight = specs.ltlGrossWeightKg || 0;
    const chargeableWeight = Math.max(grossWeight, volumetricWeight);

    onChange({
      ...specs,
      ltlDimensions: hasAnyDim ? newDims : undefined,
      ltlCbm: totalCbm,
      ltlChargeableWeightKg: chargeableWeight > 0 ? chargeableWeight : (grossWeight > 0 ? grossWeight : undefined),
    });
  };

  const handleLtlPiecesChange = (pieces: number | undefined) => {
    const dims = specs.ltlDimensions;
    let totalCbm: number | undefined = undefined;
    if (dims && pieces && pieces > 0) {
      const singleCbm = (dims.lengthCm * dims.widthCm * dims.heightCm) / 1000000;
      if (singleCbm > 0) {
        totalCbm = parseFloat((singleCbm * pieces).toFixed(2));
      }
    }
    const volumetricWeight = totalCbm ? Math.round(totalCbm * 250) : 0;
    const grossWeight = specs.ltlGrossWeightKg || 0;
    const chargeableWeight = Math.max(grossWeight, volumetricWeight);

    onChange({
      ...specs,
      ltlPieces: pieces,
      ltlCbm: totalCbm,
      ltlChargeableWeightKg: chargeableWeight > 0 ? chargeableWeight : (grossWeight > 0 ? grossWeight : undefined),
    });
  };

  const handleLtlWeightChange = (grossWeight: number | undefined) => {
    const totalCbm = specs.ltlCbm || 0;
    const volumetricWeight = Math.round(totalCbm * 250);
    const chargeableWeight = Math.max(grossWeight || 0, volumetricWeight);

    onChange({
      ...specs,
      ltlGrossWeightKg: grossWeight,
      ltlChargeableWeightKg: chargeableWeight > 0 ? chargeableWeight : undefined,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Load Mode Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Hình Thức Vận Chuyển (Load Mode) *</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* FTL Option */}
          <button
            type="button"
            onClick={() => handleSelectLoadType('FTL (Nguyên chuyến)')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
              isFTL
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-2xs'
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
              isFTL ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold block">FTL - Bao Nguyên Chuyến (Full Truckload)</span>
                {isFTL && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Thuê trọn xe, bốc dỡ linh hoạt, giao thẳng không sang xe. <strong className="text-indigo-700 font-semibold">Hỗ trợ đa điểm lấy/giao.</strong>
              </p>
            </div>
          </button>

          {/* LTL Option (Disabled if Reefer or Hazmat) */}
          <button
            type="button"
            disabled={!isGeneral}
            onClick={() => handleSelectLoadType('LTL (Ghép hàng lẻ)')}
            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
              !isGeneral 
                ? 'border-slate-200 bg-slate-100/70 text-slate-400 cursor-not-allowed opacity-60' 
                : isLTL
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold cursor-pointer shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium cursor-pointer'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
              !isGeneral 
                ? 'bg-slate-200 text-slate-400' 
                : isLTL 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-600'
            }`}>
              <Box className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold block">LTL - Ghép Hàng Lẻ (Less Than Truckload)</span>
                {isLTL && isGeneral && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {!isGeneral 
                  ? 'Không áp dụng cho hàng bảo quản đặc biệt hoặc hóa chất.' 
                  : 'Tính cước CBM/Kg quy đổi. Cố định 1 điểm lấy - 1 điểm giao.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Corridor & Route (Multi-pickup and Multi-drop Dynamic Rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* PICKUP LOCATIONS */}
        <div className="space-y-2.5">
          {/* Header with Number of Pickup Points */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Điểm Lấy Hàng (Pickup)</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Số điểm:</span>
              {isFTL ? (
                <select
                  value={pickupCount}
                  onChange={(e) => handlePickupCountChange(parseInt(e.target.value) || 1)}
                  className="px-2 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-blue-900 shadow-2xs focus:border-blue-500 cursor-pointer"
                >
                  <option value={1}>1 Điểm (Kho chính)</option>
                  <option value={2}>2 Điểm lấy</option>
                  <option value={3}>3 Điểm lấy</option>
                  <option value={4}>4 Điểm lấy</option>
                  <option value={5}>5 Điểm lấy</option>
                </select>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                  1 Điểm (Cố định)
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Rows for Pickup */}
          <div className="space-y-2">
            {pickupLocations.map((loc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600">
                    {idx === 0 ? 'Địa chỉ kho xuất hàng chính *' : `Điểm lấy ${idx + 1} (Kho phụ / Gom thêm) *`}
                  </span>
                  {isFTL && idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removePickupLocation(idx)}
                      className="text-[10px] text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={loc}
                  onChange={(e) => handlePickupLocationChange(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? 'VD: Kho Sotrans, KCN Tân Bình, Tây Thạnh, Tân Phú, TP.HCM'
                      : `VD: Kho phụ ${idx + 1}, KCN Sóng Thần 1, Dĩ An, Bình Dương`
                  }
                  className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-medium text-slate-900 shadow-2xs"
                />
              </div>
            ))}
          </div>

          {isFTL ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addPickupLocation}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm điểm lấy hàng</span>
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              * Tuyến ghép LTL gom hàng tại 1 kho tập kết chính
            </p>
          )}
        </div>

        {/* DELIVERY / DROP LOCATIONS */}
        <div className="space-y-2.5">
          {/* Header with Number of Delivery / Drop Points */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>Điểm Giao Hàng (Delivery)</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Số điểm:</span>
              {isFTL ? (
                <select
                  value={deliveryCount}
                  onChange={(e) => handleDeliveryCountChange(parseInt(e.target.value) || 1)}
                  className="px-2 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-rose-900 shadow-2xs focus:border-rose-500 cursor-pointer"
                >
                  <option value={1}>1 Điểm (Đích chính)</option>
                  <option value={2}>2 Điểm giao</option>
                  <option value={3}>3 Điểm giao</option>
                  <option value={4}>4 Điểm giao</option>
                  <option value={5}>5 Điểm giao</option>
                </select>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                  1 Điểm (Cố định)
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Rows for Delivery */}
          <div className="space-y-2">
            {deliveryLocations.map((loc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600">
                    {idx === 0 ? 'Địa chỉ kho đích chính *' : `Điểm giao ${idx + 1} (Đại lý / Cửa hàng phụ) *`}
                  </span>
                  {isFTL && idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeDeliveryLocation(idx)}
                      className="text-[10px] text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={loc}
                  onChange={(e) => handleDeliveryLocationChange(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? 'VD: Tổng Kho ICD Thăng Long, Đông Anh, Hà Nội'
                      : `VD: Đại lý ${idx + 1}, Cửa hàng 128 Nguyễn Trãi, Thanh Xuân, Hà Nội`
                  }
                  className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-rose-500 font-medium text-slate-900 shadow-2xs"
                />
              </div>
            ))}
          </div>

          {isFTL ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addDeliveryLocation}
                className="text-[11px] font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm điểm giao hàng</span>
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              * Tuyến ghép LTL trả hàng tại 1 kho đích chỉ định
            </p>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE A: FTL CONFIGURATION (Cascading Dropdown by Vehicle Type & Tonnage) */}
      {/* ========================================================================= */}
      {specs.loadType === 'FTL (Nguyên chuyến)' && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cấu Hình Phương Tiện & Tải Trọng FTL</span>
            </span>
          </div>

          {/* Row: Weight & Volume for FTL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng Khối Lượng (kg) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={weightKg || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    if (raw === '') {
                      setWeightKg?.('');
                      return;
                    }
                    const num = Number(raw);
                    if (!isNaN(num)) {
                      setWeightKg?.(num.toLocaleString('vi-VN'));
                    }
                  }}
                  placeholder="VD: 15.000"
                  className="w-full h-10 pl-3.5 pr-10 text-xs bg-white border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-bold text-slate-900 transition-colors shadow-2xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  kg
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng Thể Tích (cbm) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={volumeCbm || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, '');
                    if (raw === '') {
                      setVolumeCbm?.('');
                      return;
                    }
                    setVolumeCbm?.(raw);
                  }}
                  placeholder="VD: 50"
                  className="w-full h-10 pl-3.5 pr-12 text-xs bg-white border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-bold text-slate-900 transition-colors shadow-2xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  cbm
                </span>
              </div>
            </div>
          </div>

          {/* Row 1: Body Type & Tonnage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loại Thùng Phương Tiện *
              </label>
              <select
                value={specs.truckType || ''}
                onChange={(e) => {
                  const newType = e.target.value;
                  onChange({
                    ...specs,
                    truckType: newType,
                    tonnageCategory: '',
                  });
                }}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">-- Chọn Loại Thùng Phương Tiện --</option>
                {currentTruckBodies.map((body) => (
                  <option key={body.id} value={body.name}>
                    {body.name} - [{body.badge}]
                  </option>
                ))}
              </select>
              {selectedBody && (
                <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">
                  {selectedBody.desc}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phân Khúc Tải Trọng & Thể Tích Khả Dụng *
              </label>
              <select
                value={specs.tonnageCategory || ''}
                onChange={(e) => updateSpec('tonnageCategory', e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-indigo-900 shadow-2xs cursor-pointer"
              >
                <option value="">
                  {selectedBody ? '-- Chọn Phân Khúc Tải Trọng --' : '-- Vui lòng chọn Loại Thùng Phương Tiện trước --'}
                </option>
                {selectedBody?.tonnages.map((t) => (
                  <option key={t.id} value={t.label}>
                    {t.label} ── ({t.cbm})
                  </option>
                ))}
              </select>

              {/* Tonnage Detail Inline Note */}
              {(() => {
                if (!selectedBody) return null;
                const currentTonnageObj = selectedBody.tonnages.find((t) => t.label === specs.tonnageCategory);
                if (!currentTonnageObj) return null;
                return (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Lọt lòng: <strong className="text-slate-700">{currentTonnageObj.dimensions}</strong></span>
                    <span className="text-indigo-600 font-medium">{currentTonnageObj.recommended}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Row 2: Transit SLA & Leadtime Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời Gian Giao Hàng Yêu Cầu (Leadtime SLA) *
              </label>
              <select
                value={specs.requestedLeadtime || ''}
                onChange={(e) => updateSpec('requestedLeadtime', e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">-- Chọn Thời Gian Giao Hàng Yêu Cầu --</option>
                <option value="Tiêu chuẩn Bắc Nam (60 - 72 giờ)">
                  Tiêu chuẩn Bắc Nam (60 - 72 giờ)
                </option>
                <option value="Hỏa tốc Bắc Nam 24 - 36 giờ (2 tài xế thay phiên)">
                  Hỏa tốc Bắc Nam 24 - 36 giờ (2 tài xế thay phiên)
                </option>
                <option value="Giao trong ngày / Nội tỉnh (< 8 giờ)">
                  Giao trong ngày / Nội tỉnh (&lt; 8 giờ)
                </option>
                <option value="Giao ngày kế tiếp / Next-Day (24 giờ)">
                  Giao ngày kế tiếp / Next-Day (24 giờ)
                </option>
                <option value="Chính xác theo giờ hẹn trước (Fixed Slot Appointment)">
                  Chính xác theo giờ hẹn trước (Fixed Slot Appointment)
                </option>
                <option value="Tùy chỉnh theo thỏa thuận">
                  Tùy chỉnh theo thỏa thuận...
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi Chú Chi Tiết Thời Gian Giao Nhận
              </label>
              <input
                type="text"
                value={specs.requestedLeadtimeNote || ''}
                onChange={(e) => updateSpec('requestedLeadtimeNote', e.target.value)}
                placeholder="VD: Giao trước 09:00 sáng Thứ Hai, giao giờ hành chính..."
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-medium text-slate-800 shadow-2xs"
              />
            </div>
          </div>

          {/* Row 3: Số Lượng Chuyến & Đơn Vị Tần Suất */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Chuyến Cần Thuê *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={specs.vehicleCount !== undefined && specs.vehicleCount !== null ? (specs.vehicleCount === 0 ? '' : specs.vehicleCount) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  updateSpec('vehicleCount', raw === '' ? undefined : parseInt(raw, 10));
                }}
                placeholder="VD: 1"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đơn Vị (Tần Suất Vận Chuyển) *
              </label>
              <select
                value={specs.vehicleCountUnit || ''}
                onChange={(e) => updateSpec('vehicleCountUnit', e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">-- Chọn Đơn Vị Tần Suất --</option>
                <option value="Chuyến / Ngày">Chuyến / Ngày</option>
                <option value="Chuyến / Tuần">Chuyến / Tuần</option>
                <option value="Chuyến / Tháng">Chuyến / Tháng</option>
                <option value="Chuyến / Năm">Chuyến / Năm</option>
                <option value="Chuyến (Một lần)">Chuyến (Một lần / Spot)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE B: LTL CONFIGURATION (Volume, Gross Weight & Chargeable Weight) */}
      {/* ========================================================================= */}
      {specs.loadType === 'LTL (Ghép hàng lẻ)' && isGeneral && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Box className="w-4 h-4 text-emerald-600" />
              <span>Khai Báo Kích Thước & Trọng Lượng Ghép Hàng LTL</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Tỷ lệ quy đổi tiêu chuẩn: 1 CBM = 250 kg
            </span>
          </div>

          {/* LTL Vehicle Carrier Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phương Tiện Ghép Tuyến *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LTL_TRUCK_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                    specs.truckType === opt.name
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="ltlTruckType"
                    checked={specs.truckType === opt.name}
                    onChange={() => updateSpec('truckType', opt.name)}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold block">{opt.name}</span>
                    <span className="text-[11px] text-slate-500 block leading-tight mt-0.5 font-normal">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Row 1: Pieces & Stackable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Kiện / Pallet Cần Ghép *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={specs.ltlPieces !== undefined && specs.ltlPieces !== null ? specs.ltlPieces : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLtlPiecesChange(val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 4"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 h-10 px-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  id="ltlStackableCheck"
                  checked={specs.ltlStackable ?? true}
                  onChange={(e) => updateSpec('ltlStackable', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-800 font-semibold">
                  Hàng có thể chồng tầng (Stackable)
                </span>
              </label>
            </div>
          </div>

          {/* Row 2: Dimension Inputs (L x W x H cm) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Kích Thước 1 Kiện (Dài x Rộng x Cao cm)
              </label>
              <span className="text-[11px] text-slate-400">Tự động tính Tổng Thể Tích CBM</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Dài (L) cm</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={specs.ltlDimensions?.lengthCm !== undefined && specs.ltlDimensions.lengthCm !== null && specs.ltlDimensions.lengthCm > 0 ? specs.ltlDimensions.lengthCm : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLtlDimChange('lengthCm', val ? parseInt(val, 10) : undefined);
                  }}
                  placeholder="VD: 120"
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:border-emerald-500 shadow-2xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Rộng (W) cm</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={specs.ltlDimensions?.widthCm !== undefined && specs.ltlDimensions.widthCm !== null && specs.ltlDimensions.widthCm > 0 ? specs.ltlDimensions.widthCm : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLtlDimChange('widthCm', val ? parseInt(val, 10) : undefined);
                  }}
                  placeholder="VD: 100"
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:border-emerald-500 shadow-2xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Cao (H) cm</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={specs.ltlDimensions?.heightCm !== undefined && specs.ltlDimensions.heightCm !== null && specs.ltlDimensions.heightCm > 0 ? specs.ltlDimensions.heightCm : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLtlDimChange('heightCm', val ? parseInt(val, 10) : undefined);
                  }}
                  placeholder="VD: 150"
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:border-emerald-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Weight & Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng Trọng Lượng Thực Tế (Gross Kg) *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={specs.ltlGrossWeightKg !== undefined && specs.ltlGrossWeightKg !== null && specs.ltlGrossWeightKg > 0 ? specs.ltlGrossWeightKg : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLtlWeightChange(val ? parseFloat(val) : undefined);
                }}
                placeholder="VD: 1200"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng Thể Tích Tính Toán (CBM)
              </label>
              <div className="h-10 px-3.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-extrabold text-slate-800 flex items-center">
                {specs.ltlCbm !== undefined && specs.ltlCbm !== null ? `${specs.ltlCbm} CBM` : '-- CBM'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trọng Lượng Tính Cước (Chargeable Kg)
              </label>
              <div className="h-10 px-3.5 text-xs bg-emerald-50 border border-emerald-200 rounded-xl font-extrabold text-emerald-900 flex items-center justify-between">
                <span>{specs.ltlChargeableWeightKg !== undefined && specs.ltlChargeableWeightKg !== null ? `${specs.ltlChargeableWeightKg.toLocaleString('vi-VN')} Kg` : '-- Kg'}</span>
                <span className="text-[10px] text-emerald-700 font-normal">(Max thực vs quy đổi)</span>
              </div>
            </div>
          </div>

          {/* Row 4: LTL Shipment Count & Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Chuyến Ghép *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={specs.ltlShipmentCount !== undefined && specs.ltlShipmentCount !== null ? specs.ltlShipmentCount : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  updateSpec('ltlShipmentCount', raw === '' ? undefined : parseInt(raw, 10));
                }}
                placeholder="VD: 1"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đơn Vị (Tần Suất Vận Chuyển) *
              </label>
              <select
                value={specs.ltlFrequencyUnit || ''}
                onChange={(e) => updateSpec('ltlFrequencyUnit', e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">-- Chọn Đơn Vị Tần Suất --</option>
                <option value="Chuyến / Ngày">Chuyến / Ngày</option>
                <option value="Chuyến / Tuần">Chuyến / Tuần</option>
                <option value="Chuyến / Tháng">Chuyến / Tháng</option>
                <option value="Chuyến / Năm">Chuyến / Năm</option>
                <option value="Chuyến (Một lần)">Chuyến (Một lần / Spot)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
