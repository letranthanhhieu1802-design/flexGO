import React, { useState } from 'react';
import {
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  Boxes,
  CheckCircle2,
  Download,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  PhoneCall,
  MessageSquare,
  Mail,
  Copy,
  Check,
  KeyRound,
  Coins,
  Building2,
  ExternalLink,
  Phone,
  Bookmark,
  BookmarkCheck,
  BarChart3,
  Send,
  Sparkles,
  Lock,
  Info,
  Share2
} from 'lucide-react';
import { SupplierLeadItem } from '../../types';

interface LeadInquiryDetailCardProps {
  lead: SupplierLeadItem;
  isUnlocked?: boolean;
  maskCompanyName?: (name: string, unlocked?: boolean) => string;
  maskContactPerson?: (name: string, unlocked?: boolean) => string;
  onUnlockClick?: () => void;
  onOpenCreateQuotation?: (lead: SupplierLeadItem) => void;
  onToggleSaveLead?: (lead: SupplierLeadItem, e?: React.MouseEvent) => void;
  onCompareClick?: (lead: SupplierLeadItem) => void;
  isCustomerView?: boolean;
}

export const LeadInquiryDetailCard: React.FC<LeadInquiryDetailCardProps> = ({
  lead,
  isUnlocked = false,
  maskCompanyName = (name: string) => name,
  maskContactPerson = (name: string) => name,
  onUnlockClick,
  onOpenCreateQuotation,
  onToggleSaveLead,
  onCompareClick,
  isCustomerView = false,
}) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTax, setCopiedTax] = useState(false);
  const [copiedShareLead, setCopiedShareLead] = useState(false);

  const phoneValue = lead.contactPhone || '0908 123 456';
  const emailValue = lead.contactEmail || 'procurement@shipper-logistics.vn';
  const taxIdValue = lead.taxId || '0314892831';

  const handleShareLead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const leadCode = lead.code;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`
      : `https://logistics.vietnam.io/?tab=lead-board&leadCode=${leadCode}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedShareLead(true);
    setTimeout(() => setCopiedShareLead(false), 2500);
  };

  const handleCopy = (type: 'phone' | 'email' | 'tax', value: string) => {
    navigator.clipboard?.writeText(value);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'tax') {
      setCopiedTax(true);
      setTimeout(() => setCopiedTax(false), 2000);
    }
  };

  const handleDownloadFile = (fileName: string) => {
    setDownloadToast(`Đang tải tệp tin: ${fileName}`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);
  };

  // Helper to extract or synthesize full inquiry declaration specs tailored to the specific lead and service type
  const getSpecs = () => {
    const s = lead.serviceType;
    const code = lead.code;

    // 1. TRUCKING SPECS
    if (s === 'Trucking') {
      const isNorthStar = code === 'LG-00166';
      const isABC = code === 'LG-00124';
      const isDongNai = code === 'LG-00137';

      return {
        serviceCategory: 'Vận tải nội địa đường bộ (Domestic Trucking)',
        serviceIcon: Truck,
        colorTheme: 'blue',
        // Technical specs declared by customer
        specsGrid: [
          {
            label: 'Hình thức vận chuyển',
            value: isDongNai ? 'Drayage Kéo Container 40ft' : (isABC ? 'FTL - Bao nguyên xe (Full Truckload)' : 'FTL - Bao nguyên xe 8 Tấn'),
            sub: 'Xe chuyên tuyến cố định',
            highlight: true,
          },
          {
            label: 'Loại phương tiện & Thùng xe',
            value: isDongNai ? 'Đầu kéo Rơ-moóc xương Cont 40ft' : (isABC ? 'Xe tải 15T Thùng kín (Chống nước)' : 'Xe tải 8T Thùng kín / Mui bạt'),
            sub: 'Đạt chuẩn kiểm định khí thải',
          },
          {
            label: 'Tải trọng & Kích thước lòng thùng',
            value: isDongNai ? 'Tải trọng 30 - 32 Tấn' : (isABC ? '15.4 Tấn (D 9.6m x R 2.4m x C 2.6m)' : '8.0 Tấn (D 7.5m x R 2.35m x C 2.5m)'),
            sub: 'Thể tích khả dụng > 42 CBM',
          },
          {
            label: 'Quy cách đóng gói hàng hóa',
            value: isDongNai ? 'Hàng đóng sẵn trong Container xuất khẩu' : (isABC ? '18 Pallets linh kiện đóng màng co PE' : '12 Kiện gỗ & Khay sắt xếp pallet'),
            sub: 'Xếp dỡ cẩn thận, chống rung lắc',
          },
          {
            label: 'Điểm lấy hàng (Pickup Hub)',
            value: lead.origin,
            sub: 'Kho xuất hàng nhà máy chính',
          },
          {
            label: 'Điểm giao hàng (Delivery Hub)',
            value: lead.destination,
            sub: 'Bãi hạ cảng / Nhà máy tiếp nhận',
          },
          {
            label: 'Số điểm bốc / trả hàng (Drops)',
            value: '1 Điểm bốc → 1 Điểm giao (Direct Point-to-Point)',
            sub: 'Không phát sinh điểm gom phụ',
          },
          {
            label: 'Yêu cầu bốc xếp nhân công',
            value: isDongNai ? 'Cẩu hạ container tại Depot cảng' : (isABC ? 'Nhà máy có xe nâng Forklift 2 đầu' : 'Tài xế & phụ xe hỗ trợ kiểm đếm kiện'),
            sub: 'Không yêu cầu bốc vác thủ công',
          },
          {
            label: 'Khung giờ giao nhận & Phố cấm',
            value: isNorthStar ? 'Giao ca đêm (20:00 - 05:00) theo lịch cắt máng' : 'Giờ hành chính & Khung giờ thấp điểm đường cao tốc',
            sub: 'Có giấy phép lưu hành phù hợp',
          },
          {
            label: 'Cự ly vận chuyển dự kiến',
            value: isABC ? '1,720 km (Xuyên Việt QL1A / Cao tốc)' : (isNorthStar ? '115 km (Cao tốc HN - HP - QL5B)' : '42 km (Tuyến nội vùng ĐN - Cát Lái)'),
            sub: 'Đã bao gồm chi phí trạm thu phí BOT',
          },
        ],
        // Special Operating Requirements declared by customer
        slaChecklist: [
          'GPS Real-time Tracking: Bắt buộc cung cấp tài khoản giám sát định vị hành trình xe 24/7',
          'Đội ngũ lái xe: Có đầy đủ chứng chỉ lái xe hạng C/E, trang bị bảo hộ lao động PPE (Giày mũi thép, áo phản quang, mũ cứng)',
          'Bảo hiểm trách nhiệm hàng hóa: Bảo hiểm 100% giá trị hàng hóa trong suốt quá trình vận chuyển',
          'Biên bản giao nhận hàng (POD): Trả bản cứng có đầy đủ chữ ký & con dấu người nhận trong vòng 3 ngày làm việc',
          'Thời gian dừng chờ bốc xếp: Tối đa 2 giờ miễn phí tại mỗi đầu kho bốc/dỡ hàng',
          isNorthStar ? 'Cam kết hạ bãi cảng đúng hạn Closing Time trước 04:00 sáng' : 'Niêm phong kẹp chì seal điện tử / seal nhà máy trước khi xe lăn bánh',
        ],
        // Operating Notes from customer
        customerNotes: isNorthStar
          ? 'Hàng linh kiện đúc cơ khí chính xác xuất khẩu. Xe cần có mặt tại kho KCN Đình Trám lúc 18h30 để bắt đầu bốc hàng lên xe, đóng bạt chống nước cẩn thận. Giao hàng đến cảng Tân Vũ/Lạch Huyện hạ bãi trước 04h00 sáng hôm sau để kịp tiến độ làm thủ tục thông quan vào tàu. Nhà xe cần chủ động lệnh hạ bãi và nộp phí nâng hạ cảng.'
          : (isABC 
              ? 'Lô hàng linh kiện điện tử độ chính xác cao, nghiêm cấm xếp chồng vật nặng lên bề mặt pallet. Thùng xe phải sạch sẽ, không có mùi hôi, sàn gỗ khô ráo. Yêu cầu 2 lái xe đổi ca chạy liên tục Bắc - Nam cam kết thời gian hành trình dưới 48 tiếng.'
              : 'Container hàng xuất khẩu thành phẩm giày dép, cần xe đầu kéo có moóc tốt, tài xế có kinh nghiệm lấy rỗng tại bãi Depot Tân Cảng và giao hạ bãi Cát Lái đúng giờ cắt máng.'),
        // Attached files uploaded by customer
        attachments: [
          { name: 'Packing_List_Detailed_Shipment.xlsx', size: '280 KB', type: 'excel', date: 'Vừa cập nhật' },
          { name: 'So_Do_Xep_Hang_Pallet_Layout.pdf', size: '1.4 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Quy_Chuan_An_Toan_Giao_Nhan_PPE.pdf', size: '920 KB', type: 'pdf', date: 'Vừa cập nhật' },
        ],
      };
    }

    // 2. SEA FREIGHT (FCL) SPECS
    if (s === 'Sea Freight (FCL)') {
      const isSolar = code === 'LG-00133';
      return {
        serviceCategory: 'Vận tải đường biển quốc tế & nội địa nguyên Container (Ocean FCL)',
        serviceIcon: Ship,
        colorTheme: 'cyan',
        specsGrid: [
          {
            label: 'Phương thức vận tải',
            value: 'FCL (Full Container Load) - Hàng nguyên container',
            sub: 'Đóng ghép tại nhà máy / Cảng biển',
            highlight: true,
          },
          {
            label: 'Quy cách & Loại Container',
            value: isSolar ? '25x Container 40ft High Cube (40HC)' : '4x Container 40ft High Cube (40HC)',
            sub: 'Vỏ cont tiêu chuẩn Cargo Worthy',
          },
          {
            label: 'Cảng bốc hàng (POL)',
            value: isSolar ? 'Qingdao Port (CNTAO), Trung Quốc' : 'Hai Phong Port (Lạch Huyện / Tân Vũ), VN',
            sub: 'Port of Loading',
          },
          {
            label: 'Cảng dỡ hàng (POD)',
            value: isSolar ? 'Cai Mep Deep Sea Port (VNCMP), VN' : 'Da Nang Port (VNDAD), VN',
            sub: 'Port of Discharge',
          },
          {
            label: 'Điều kiện thương mại (Incoterms)',
            value: isSolar ? 'CIF Cai Mep Port (Incoterms 2020)' : 'FOB Hai Phong Port (Incoterms 2020)',
            sub: 'Phân định chi phí & rủi ro',
          },
          {
            label: 'Hạn lưu bãi & Vỏ cont (Free Dem/Det)',
            value: isSolar ? 'Yêu cầu tối thiểu 14 ngày Free Demurrage & Detention tại POD' : 'Yêu cầu 7 ngày Free Dem/Det tại cảng đích',
            sub: 'Hỗ trợ thời gian làm thủ tục hải quan',
          },
          {
            label: 'Tổng trọng lượng & Thể tích',
            value: isSolar ? 'Gross Weight: 24.5 Tấn / Cont (~612 Tấn tổng)' : 'Gross Weight: 22 Tấn / Cont (~88 Tấn tổng)',
            sub: 'Thể tích: ~68 CBM / Cont 40HC',
          },
          {
            label: 'Phân loại hàng & Nguy hiểm',
            value: isSolar ? 'Tấm pin năng lượng mặt trời PV & Biến tần Inverter (Non-DG)' : 'Thiết bị cơ khí máy móc & Cuộn nhôm công nghiệp',
            sub: 'Hàng hóa thông thường, có chứng chỉ MSDS',
          },
          {
            label: 'Ngày sẵn sàng hàng (Cargo Ready Date)',
            value: 'Hàng sẵn sàng đóng cont trong vòng 3 ngày tới',
            sub: 'Ưu tiên chuyến tàu Direct không chuyển tải',
          },
          {
            label: 'Loại vận đơn yêu cầu (Bill of Lading)',
            value: 'Original Bill of Lading (3/3) hoặc Surrendered / Telex Release',
            sub: 'Phát hành điện tử sau khi tàu rời bến',
          },
        ],
        slaChecklist: [
          'Hãng tàu uy tín: Ưu tiên các line tàu lớn (Maersk, MSC, ONE, CMA-CGM, Cosco, SITC) có lịch tàu ổn định',
          'Free Dem/Det: Cam kết tối thiểu 14 ngày Free Demurrage + Detention tại cảng Cái Mép để phục vụ thông quan',
          'Bảo hiểm vận chuyển hàng hải quốc tế: Institute Cargo Clauses (A) 110% giá trị CIF',
          'VGM & Closing Time: Forwarder phụ trách khai báo VGM và theo dõi sát lịch đóng hàng trước cut-off',
          'Cập nhật tiến độ: Cung cấp Tracking link theo dõi vị trí tàu và dự kiến cập cảng (ETA) tự động',
        ],
        customerNotes: isSolar
          ? 'Lô hàng thiết bị điện mặt trời phục vụ dự án trang trại năng lượng tái tạo, giá trị cao. Yêu cầu container sạch sẽ, không rò rỉ nước, có dây đai chằng buộc lashing cẩn thận bên trong cont. Forwarder cần báo trọn gói bao gồm cước biển (Ocean Freight) và Local Charges 2 đầu.'
          : 'Lô hàng máy móc công nghiệp cuộn nhôm, trọng lượng nặng, yêu cầu phân bổ đều tải trọng trên sàn container và chèn lót gỗ cố định chống va đập.',
        attachments: [
          { name: 'Commercial_Invoice_Solar_Project.pdf', size: '1.8 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Packing_List_25x40HC_Modules.xlsx', size: '450 KB', type: 'excel', date: 'Vừa cập nhật' },
          { name: 'Technical_Spec_PV_Inverter.pdf', size: '3.2 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'MSDS_Non_Hazardous_Declaration.pdf', size: '610 KB', type: 'pdf', date: 'Vừa cập nhật' },
        ],
      };
    }

    // 3. SEA FREIGHT (LCL) SPECS
    if (s === 'Sea Freight (LCL)') {
      return {
        serviceCategory: 'Vận tải đường biển đóng ghép hàng lẻ kho CFS (Ocean LCL)',
        serviceIcon: Ship,
        colorTheme: 'teal',
        specsGrid: [
          {
            label: 'Phương thức gom hàng',
            value: 'LCL (Less than Container Load) - Hàng lẻ đóng ghép kho CFS',
            sub: 'Tính cước theo CBM hoặc Tấn (W/M)',
            highlight: true,
          },
          {
            label: 'Tổng thể tích & Trọng lượng',
            value: '12.0 CBM / Tổng trọng lượng thô: 4,500 kg (4.5 Tấn)',
            sub: 'Tỷ lệ thể tích / trọng lượng: 1 CBM : 375 kg',
          },
          {
            label: 'Kho gom hàng bốc (POL CFS)',
            value: 'Kho CFS Cảng Cát Lái (HCMC CFS Warehouse)',
            sub: 'Điểm tiếp nhận đóng ghép',
          },
          {
            label: 'Kho gom hàng dỡ (POD CFS)',
            value: 'Busan Port CFS Warehouse, Hàn Quốc',
            sub: 'Điểm phân phối cho Consignee',
          },
          {
            label: 'Điều kiện giao hàng Incoterms',
            value: 'FOB Cat Lai Port CFS (Incoterms 2020)',
            sub: 'Người bán giao hàng vào kho CFS',
          },
          {
            label: 'Số lượng kiện & Quy cách đóng',
            value: '12 Pallets gỗ tiêu chuẩn (1.1m x 1.1m x 1.2m)',
            sub: 'Mỗi pallet gồm 25 bao hạt nhựa nguyên sinh',
          },
          {
            label: 'Tính chất xếp chồng (Stackability)',
            value: 'Hàng Stackable (Cho phép xếp chồng tối đa 2 tầng)',
            sub: 'Đóng gói chắc chắn, bọc màng PE',
          },
          {
            label: 'Mặt hàng & Mã HS Code',
            value: 'Hạt nhựa sinh học phân hủy tự nhiên (HS: 3907.99)',
            sub: 'Hàng không nguy hiểm (Non-DG)',
          },
          {
            label: 'Thủ tục hải quan kho CFS',
            value: 'Chủ hàng tự mở tờ khai xuất khẩu B11 tại Hải quan Cát Lái',
            sub: 'Forwarder hỗ trợ vào sổ tàu & kiểm đếm CFS',
          },
          {
            label: 'Thời gian hàng vào kho CFS',
            value: 'Hàng sẽ vào kho CFS trước ngày Closing Time 24 giờ',
            sub: 'Cần Booking Confirmation sớm',
          },
        ],
        slaChecklist: [
          'Phí CFS Local Charges rõ ràng: Báo giá minh bạch các khoản CFS fee, D/O, Handling, B/L fee tại 2 đầu cảng',
          'Hun trùng Pallet gỗ: Pallet gỗ đã có chứng nhận hun trùng nhiệt ISPM 15 và đóng dấu kiểm định đạt chuẩn nhập khẩu Hàn Quốc',
          'Thời gian hành trình: Tuyến Direct Cat Lai → Busan từ 5 - 7 ngày hải trình',
          'Kiểm đếm tại kho: Forwarder chụp ảnh tình trạng kiện hàng khi nhập kho CFS và gửi biên bản kiểm đếm',
        ],
        customerNotes:
          'Lô hàng hạt nhựa sinh học xuất khẩu sang đối tác tại Busan Hàn Quốc. Yêu cầu pallet được bọc màng co PE chống ẩm tuyệt đối. Cần forwarder có line gom LCL trực tiếp đi Busan hàng tuần với mức Local Charges hợp lý, không có phụ phí ẩn.',
        attachments: [
          { name: 'Packing_List_12_Pallets_Plastic_Pellets.xlsx', size: '210 KB', type: 'excel', date: 'Vừa cập nhật' },
          { name: 'ISPM15_Fumigation_Certificate.pdf', size: '750 KB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Technical_Data_Sheet_Bio_Resin.pdf', size: '1.1 MB', type: 'pdf', date: 'Vừa cập nhật' },
        ],
      };
    }

    // 4. AIR FREIGHT SPECS
    if (s === 'Air Freight') {
      return {
        serviceCategory: 'Vận tải hàng không quốc tế & Chuyển phát nhanh (Air Freight Express)',
        serviceIcon: Plane,
        colorTheme: 'sky',
        specsGrid: [
          {
            label: 'Cấp độ dịch vụ hàng không',
            value: 'Standard Air Freight (Bay thẳng trực tiếp 1-2 ngày)',
            sub: 'Ưu tiên chuyến bay thẳng không transit',
            highlight: true,
          },
          {
            label: 'Sân bay đi (POL Airport)',
            value: 'Tan Son Nhat International Airport Cargo Terminal (SGN / TCS / SCSC)',
            sub: 'Hồ Chí Minh, Việt Nam',
          },
          {
            label: 'Sân bay đến (POD Airport)',
            value: 'Narita International Airport (NRT), Tokyo, Nhật Bản',
            sub: 'Kho hàng không Narita Cargo',
          },
          {
            label: 'Số lượng kiện & Kích thước',
            value: '18 Thùng carton đặc chủng (60cm x 50cm x 40cm / thùng)',
            sub: 'Tổng thể tích kiện: ~2.16 CBM',
          },
          {
            label: 'Trọng lượng thực tế (Gross Weight)',
            value: '650.0 kg (Gross Weight cân thực tế)',
            sub: 'Trọng lượng cân tại kho TCS',
          },
          {
            label: 'Trọng lượng thể tích (Volumetric Weight)',
            value: '360.0 kg (Tính theo công thức CBM × 167)',
            sub: 'Kích thước / 6,000 theo chuẩn IATA',
          },
          {
            label: 'Trọng lượng tính cước (Chargeable Weight)',
            value: '650.0 kg (Áp dụng mức Gross Weight lớn hơn)',
            sub: 'Mức cước tính theo nấc +500kg',
          },
          {
            label: 'Tính chất hàng & Pin Lithium',
            value: 'Linh kiện thiết bị y tế nội soi quang học chính xác (Non-DG / No Battery)',
            sub: 'Có biên bản xác nhận không chứa pin Lithium độc lập',
          },
          {
            label: 'Yêu cầu soi chiếu & An ninh sân bay',
            value: 'Hàng nhạy cảm va đập, dán nhãn FRAGILE & THIS SIDE UP',
            sub: 'Soi chiếu an ninh X-Ray tại ga TCS',
          },
          {
            label: 'Dịch vụ hải quan tại sân bay',
            value: 'Yêu cầu Forwarder hỗ trợ làm thủ tục hải quan xuất khẩu tại ga hàng không',
            sub: 'Thông quan nhanh trước giờ cắt máng bay',
          },
        ],
        slaChecklist: [
          'Hãng hàng không ưu tiên: Vietnam Airlines, Japan Airlines (JAL), All Nippon Airways (ANA) bay thẳng SGN → NRT',
          'Thời gian quá cảnh: Tuyệt đối không nhận chuyến bay chuyển tải qua bên thứ 3 (Direct Flight Only)',
          'Khai báo vận đơn hàng không (Master / House AWB): Phát hành AWB điện tử ngay sau khi cân hàng',
          'Chứng chỉ an toàn Non-DG: Cung cấp đầy đủ giấy chứng nhận hàng không nguy hiểm theo quy định IATA',
          'Bảo hiểm hàng hóa giá trị cao: Bảo hiểm 100% giá trị khai báo trên Invoice thương mại',
        ],
        customerNotes:
          'Lô hàng linh kiện đầu dò nội soi y tế chính xác gửi cho bệnh viện và nhà máy tại Tokyo. Hàng giá trị cao và nhạy cảm cơ học. Yêu cầu chuyển giao cẩn thận, không quăng ném, không để ngoài trời mưa ướt tại sân bay. Booking chuyến bay cất cánh trong vòng 24h tới.',
        attachments: [
          { name: 'Commercial_Invoice_Medical_Sensors.pdf', size: '1.2 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Air_Waybill_Draft_Instructions.pdf', size: '580 KB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Non_Dangerous_Goods_Declaration_IATA.pdf', size: '890 KB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Detailed_Carton_Dimension_Breakdown.xlsx', size: '195 KB', type: 'excel', date: 'Vừa cập nhật' },
        ],
      };
    }

    // 5. COLD CHAIN SPECS
    if (s === 'Cold Chain') {
      const isDalat = code === 'LG-00162';
      return {
        serviceCategory: 'Vận tải chuỗi lạnh & Kiểm soát nhiệt độ chuyên sâu (Cold Chain Logistics)',
        serviceIcon: Snowflake,
        colorTheme: 'amber',
        specsGrid: [
          {
            label: 'Dải nhiệt độ bảo quản nghiêm ngặt',
            value: isDalat ? 'Nhiệt độ Mát: +2°C đến +8°C (Rau củ hữu cơ & Hoa tươi)' : 'Nhiệt độ Đông sâu: -18°C đến -22°C (Thanh long & Xoài cấp đông xuất khẩu)',
            sub: 'Dao động nhiệt tối đa cho phép: ±1.5°C',
            highlight: true,
          },
          {
            label: 'Quy cách phương tiện lạnh',
            value: isDalat ? 'Xe tải lạnh chuyên dụng 5.0 Tấn có bửng nâng thủy lực' : 'Xe tải lạnh 20 Tấn / Container Lạnh 40RF',
            sub: 'Thùng composite cách nhiệt foam đúc',
          },
          {
            label: 'Yêu cầu làm lạnh trước (Pre-cooling)',
            value: isDalat ? 'Bắt buộc chạy máy lạnh hạ thùng xe xuống +4°C trước khi nhận hàng' : 'Bắt buộc Pre-cooling thùng đạt -18°C trước khi chất hàng',
            sub: 'Kiểm tra nhiệt độ thùng trước khi bốc',
          },
          {
            label: 'Máy phát điện duy trì lạnh (Genset)',
            value: 'Máy lạnh Thermo King / Carrier chạy liên tục 100% suốt hành trình',
            sub: 'Không tắt máy lạnh khi dừng đỗ',
          },
          {
            label: 'Giám sát hành trình & Nhiệt độ IoT',
            value: 'Cảm biến nhiệt độ IoT Real-time + Thiết bị ghi nhiệt USB Data Logger',
            sub: 'Xuất biểu đồ nhiệt độ sau mỗi chuyến giao',
          },
          {
            label: 'Kiểm soát độ ẩm tương đối (RH)',
            value: isDalat ? 'Độ ẩm duy trì 85% - 90% RH (Chống héo hoa & rau)' : 'Không yêu cầu kiểm soát độ ẩm cho hàng đông sâu',
            sub: 'Bảo đảm độ tươi nguyên bản',
          },
          {
            label: 'Điểm lấy hàng lạnh',
            value: lead.origin,
            sub: 'Kho lạnh sơ chế tại nông trường / nhà máy',
          },
          {
            label: 'Điểm giao hàng lạnh',
            value: lead.destination,
            sub: 'Kho lạnh trung tâm phân phối / Sân bay / Cảng biển',
          },
          {
            label: 'Quy cách đóng gói & Pallet',
            value: isDalat ? 'Thùng carton đục lỗ thông khí đặt trên Pallet nhựa' : 'Thùng carton 5 lớp bọc túi PE hút chân không',
            sub: 'Xếp hàng tạo khe thoáng luồng khí lạnh',
          },
          {
            label: 'Tiêu chuẩn chất lượng & Vệ sinh',
            value: 'Tuân thủ tiêu chuẩn HACCP, ISO 22000, vệ sinh khử trùng thùng xe',
            sub: 'Không chở chung hàng có mùi hoặc hóa chất',
          },
        ],
        slaChecklist: [
          'Cam kết nhiệt độ liên tục: Nếu nhiệt độ thùng xe vượt quá ngưỡng cho phép quá 30 phút, Supplier chịu trách nhiệm đền bù hư hỏng nông sản',
          'Biểu đồ nhiệt độ điện tử: Cung cấp file xuất dữ liệu nhiệt độ từ thiết bị Data Logger kèm theo biên bản giao nhận',
          'Tài xế chuyên nghiệp: Được đào tạo quy trình vận hành máy lạnh thùng xe, kiểm tra nhiệt độ mỗi 2 giờ hành trình',
          'Thời gian trung chuyển: Giao hàng nhanh trong vòng 6 - 8 tiếng từ lúc nhận hàng tại Lâm Đồng / Tiền Giang về TP.HCM',
        ],
        customerNotes: isDalat
          ? 'Hàng rau củ sạch và hoa tươi xuất khẩu cao cấp sang thị trường Nhật Bản. Hoa và rau rất nhạy cảm với nhiệt độ, thùng xe phải được khử khuẩn sạch sẽ, sàn xe khô ráo. Bắt buộc có bửng nâng thủy lực ở đuôi xe để hạ pallet nhẹ nhàng, chống dập nát.'
          : 'Lô thanh long và puree xoài cấp đông xuất khẩu đường biển. Yêu cầu container lạnh giữ ổn định -18°C suốt tuyến đường từ Tiền Giang đến bãi Cát Lái, cắm điện reefer ngay khi hạ bãi.',
        attachments: [
          { name: 'Quy_Trinh_Kiem_Soat_Nhiet_Do_ColdChain.pdf', size: '1.5 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Packing_List_Dalat_Fresh_Produce.xlsx', size: '320 KB', type: 'excel', date: 'Vừa cập nhật' },
          { name: 'HACCP_Food_Safety_Certificate.pdf', size: '890 KB', type: 'pdf', date: 'Vừa cập nhật' },
        ],
      };
    }

    // 6. WAREHOUSING SPECS
    if (s === 'Warehousing') {
      return {
        serviceCategory: 'Dịch vụ kho bãi, lưu trữ & Hoàn tất đơn hàng 3PL (Warehousing & 3PL)',
        serviceIcon: Warehouse,
        colorTheme: 'purple',
        specsGrid: [
          {
            label: 'Loại hình kho bãi yêu cầu',
            value: 'Kho tiêu chuẩn Grade A (Kho thường có trần cao cách nhiệt)',
            sub: 'Sàn bê tông xoa phẳng phủ Epoxy chịu tải',
            highlight: true,
          },
          {
            label: 'Diện tích & Sức chứa cần thuê',
            value: '2,500 m² sàn kho chuyên dụng + 1,200 vị trí Pallet Racking (Kệ Selective)',
            sub: 'Chiều cao thông thủy trần kho: > 10.5m',
          },
          {
            label: 'Thời hạn hợp đồng cam kết',
            value: 'Hợp đồng dài hạn 24 tháng (Có điều khoản gia hạn thêm 12 tháng)',
            sub: 'Đơn giá cố định theo từng năm',
          },
          {
            label: 'Tải trọng sàn thiết kế',
            value: 'Tải trọng sàn tối thiểu 4.0 Tấn / m²',
            sub: 'Phù hợp xe nâng Reach Truck 2.5T hoạt động',
          },
          {
            label: 'Sản lượng nhập kho (Inbound Flow)',
            value: 'Trung bình 4 - 6 xe tải 15T / ngày (Khoảng 80 - 120 Pallet/ngày)',
            sub: 'Nhập hàng từ nhà máy linh kiện',
          },
          {
            label: 'Sản lượng xuất kho (Outbound Flow)',
            value: 'Khoảng 150 - 200 đơn hàng / ngày (Phân phối B2B và kênh bán lẻ)',
            sub: 'Soạn hàng theo nguyên tắc FIFO',
          },
          {
            label: 'Dịch vụ giá trị gia tăng (VAS)',
            value: 'Dán tem nhãn phụ tiếng Việt, Đóng gói Co-packing, Quét mã Barcode, Bọc màng co Pallet',
            sub: 'Soạn hàng Pick & Pack theo SKU chi tiết',
          },
          {
            label: 'Tích hợp hệ thống quản lý kho (WMS)',
            value: 'Bắt buộc tích hợp phần mềm WMS qua REST API / Webhook kết nối ERP SAP',
            sub: 'Báo cáo tồn kho real-time 24/7',
          },
          {
            label: 'Hệ thống PCCC & An ninh',
            value: 'Hệ thống chữa cháy tự động Sprinkler NFPA tiêu chuẩn quốc tế + Camera CCTV 24/7',
            sub: 'Đầy đủ giấy phép nghiệm thu PCCC công an cấp',
          },
          {
            label: 'Bảo hiểm cháy nổ & Rủi ro hàng hóa',
            value: 'Bảo hiểm cháy nổ nhà kho & Bảo hiểm hàng tồn kho giá trị 30 Tỷ VNĐ',
            sub: 'Bảo vệ quyền lợi chủ hàng',
          },
        ],
        slaChecklist: [
          'Độ chính xác tồn kho (Inventory Accuracy): Cam kết đạt mức tối thiểu 99.8% qua các kỳ kiểm kê định kỳ',
          'Thời gian hoàn tất đơn hàng (Order Fulfillment SLA): Đơn hàng tiếp nhận trước 12:00 phải được đóng gói và bàn giao nhà xe trong ngày',
          'Báo cáo kiểm kê chu kỳ (Cycle Count): Cung cấp báo cáo xuất nhập tồn hàng ngày và kiểm kê tổng thể mỗi quý',
          'Hạ tầng bốc dỡ: Có tối thiểu 4 cửa Dock Leveler nâng hạ tự động cho xe container cập sàn',
        ],
        customerNotes:
          'Chúng tôi cần thuê kho chứa linh kiện và thiết bị hoàn thiện tại khu vực VSIP II Bình Dương để làm trung tâm phân phối cho toàn miền Nam. Yêu cầu kho mới, sạch sẽ, không bị dột nước, có bảo vệ 24/7. Nhà cung cấp cần chứng minh năng lực đội ngũ thủ kho và hệ thống WMS vận hành chuyên nghiệp.',
        attachments: [
          { name: 'Yeu_Cau_Ky_Thuat_Thue_Kho_GradeA.pdf', size: '2.4 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Danh_Muc_150_SKU_San_Pham.xlsx', size: '640 KB', type: 'excel', date: 'Vừa cập nhật' },
          { name: 'Tai_Lieu_Tich_Hop_API_WMS_SAP.pdf', size: '1.9 MB', type: 'pdf', date: 'Vừa cập nhật' },
        ],
      };
    }

    // 7. CUSTOMS CLEARANCE SPECS
    if (s === 'Customs Clearance') {
      return {
        serviceCategory: 'Dịch vụ khai báo hải quan, C/O & Kiểm tra chuyên ngành (Customs Brokerage)',
        serviceIcon: FileCheck2,
        colorTheme: 'violet',
        specsGrid: [
          {
            label: 'Loại hình tờ khai hải quan',
            value: 'Nhập khẩu Sản xuất Xuất khẩu (Mã loại hình: E31)',
            sub: 'Miễn thuế nhập khẩu linh kiện phục vụ SXXK',
            highlight: true,
          },
          {
            label: 'Chi cục Hải quan làm thủ tục',
            value: 'Chi cục Hải quan Cửa khẩu Cảng Cát Lái (Mã Hải quan: 02CI)',
            sub: 'Cục Hải quan TP. Hồ Chí Minh',
          },
          {
            label: 'Số lượng dòng hàng & HS Code',
            value: '18 Dòng hàng linh kiện điện tử (Nhóm HS Code chính: 8504.40, 8542.31, 8536.90)',
            sub: 'Khai báo chuẩn xác tên hàng theo biểu thuế',
          },
          {
            label: 'Trị giá hóa đơn thương mại (Invoice Value)',
            value: '$145,000 USD (Hóa đơn thương mại từ đối tác Hàn Quốc)',
            sub: 'Đầy đủ hợp đồng gia công & SXXK',
          },
          {
            label: 'Chứng nhận xuất xứ hàng hóa (C/O)',
            value: 'Yêu cầu kiểm tra & Hưởng thuế ưu đãi đặc biệt C/O Form AK (ASEAN - Korea)',
            sub: 'Bản gốc C/O điện tử AK',
          },
          {
            label: 'Kiểm tra chuyên ngành',
            value: 'Đăng ký Kiểm tra Hiệu suất Năng lượng tối thiểu & Hợp chuẩn QCVN tại Quatest 3',
            sub: 'Thủ tục mang hàng về kho bảo quản',
          },
          {
            label: 'Phân luồng tờ khai dự kiến',
            value: 'Hỗ trợ xử lý thông quan nếu hệ thống VNACCS phân luồng Vàng hoặc luồng Đỏ',
            sub: 'Có nhân viên hiện trường túc trực tại cảng',
          },
          {
            label: 'Số lượng container & Loại hàng',
            value: '02x Container 40HC (Hàng nguyên cont đóng pallet)',
            sub: 'Kèm theo dịch vụ kéo cont về nhà máy SHTP',
          },
        ],
        slaChecklist: [
          'Thời gian thông quan: Hoàn tất thông quan và giải phóng hàng trong vòng 24 - 36 giờ kể từ khi tàu cập cảng',
          'Độ chính xác hồ sơ: Đảm bảo khớp mã HS, thuế suất và định mức tiêu hao nguyên phụ liệu tránh bị phạt truy thu',
          'Hỗ trợ kiểm hóa hiện trường: Nhân viên giao nhận hiện trường có mặt trực tiếp tại bãi kiểm hóa Cát Lái mở cont và tiếp hải quan kiểm hàng',
          'Bàn giao chứng từ gốc: Bàn giao toàn bộ tờ khai thông quan, biên lai thuế và chứng từ kèm theo trong 48h',
        ],
        customerNotes:
          'Doanh nghiệp hoạt động tại Khu Công Nghệ Cao (SHTP) nhập khẩu nguyên vật liệu sản xuất xuất khẩu theo loại hình E31. Cần đại lý hải quan có kinh nghiệm chuyên sâu về linh kiện điện tử bán dẫn, xử lý nhanh thủ tục kiểm tra hiệu suất năng lượng và C/O Form AK để thông quan sớm đưa vào dây chuyền sản xuất.',
        attachments: [
          { name: 'Commercial_Invoice_Packing_List_E31.pdf', size: '1.6 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Draft_Customs_Declaration_HS_List.xlsx', size: '380 KB', type: 'excel', date: 'Vừa cập nhật' },
          { name: 'Certificate_of_Origin_Form_AK_Sample.pdf', size: '920 KB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Catalog_Ky_Thuat_Linh_Kien_Ban_Dan.pdf', size: '2.8 MB', type: 'pdf', date: 'Vừa cập nhật' },
        ],
      };
    }

    // 8. CROSS-BORDER SPECS
    if (s === 'Cross-border') {
      return {
        serviceCategory: 'Vận tải liên vận quốc tế đường bộ xuyên biên giới (Cross-Border Trucking)',
        serviceIcon: Globe,
        colorTheme: 'rose',
        specsGrid: [
          {
            label: 'Cửa khẩu quốc tế thông quan',
            value: 'Cửa khẩu Quốc tế Mộc Bài (Tây Ninh, VN) ↔ Cửa khẩu Bavet (Svay Rieng, Campuchia)',
            sub: 'Hành lang kinh tế phía Nam',
            highlight: true,
          },
          {
            label: 'Phương thức vận tải liên vận',
            value: 'Xe liên vận chạy thẳng GMS (Direct Cross-Border Transit) không sang tải',
            sub: 'Xe mang biển số liên vận được cấp phép',
          },
          {
            label: 'Đội xe & Tải trọng huy động',
            value: 'Đội 8 xe tải 15 Tấn thùng kín chạy định kỳ 2 chuyến / tuần',
            sub: 'Tổng sản lượng 32 chuyến / tháng',
          },
          {
            label: 'Địa điểm xuất phát (Origin Hub)',
            value: 'Kho trung tâm logistics Bình Dương & TP. Hồ Chí Minh',
            sub: 'Lấy hàng tại các nhà máy phụ trợ',
          },
          {
            label: 'Địa điểm giao hàng đích (Destination)',
            value: 'Khu Kinh Tế Đặc Quyền Phnom Penh (Phnom Penh SEZ, Campuchia)',
            sub: 'Giao trực tiếp vào kho nhà máy đối tác',
          },
          {
            label: 'Thủ tục hải quan 2 đầu biên giới',
            value: 'Trọn gói thủ tục hải quan xuất khẩu tại VN & Nhập khẩu tiểu ngạch/chính ngạch tại Campuchia',
            sub: 'Đại lý lo toàn bộ phí bến bãi cửa khẩu',
          },
          {
            label: 'Giấy phép liên vận thương mại',
            value: 'Xe có đầy đủ Giấy phép vận tải đường bộ song phương Việt Nam - Campuchia',
            sub: 'Lái xe có hộ chiếu và bằng lái quốc tế',
          },
          {
            label: 'Mặt hàng vận chuyển',
            value: 'Vật tư phụ liệu ngành may mặc, cúc khóa, cuộn vải & bao bì đóng gói',
            sub: 'Hàng khô, không cần nhiệt độ đặc biệt',
          },
        ],
        slaChecklist: [
          'Thời gian hành trình: Xe xuất phát từ Bình Dương lúc 06:00 sáng, thông quan qua cửa khẩu Mộc Bài và giao hàng tại Phnom Penh SEZ trước 17:00 cùng ngày',
          'Đội ngũ nhân sự cửa khẩu: Có văn phòng đại diện và nhân viên giao nhận song ngữ (Việt - Khmer) túc trực 24/7 tại 2 bên cửa khẩu Mộc Bài/Bavet',
          'Bảo hiểm vận tải quốc tế: Bảo hiểm hàng hóa toàn tuyến từ cửa kho VN đến cửa kho Campuchia',
          'Hỗ trợ nộp thuế nhập khẩu Campuchia: Đại lý hỗ trợ thanh toán thuế nhập khẩu và phí hải quan Cam theo ủy quyền',
        ],
        customerNotes:
          'Chúng tôi cần hợp đồng vận tải liên vận ổn định 12 tháng phục vụ chuỗi cung ứng nhà máy gia công may mặc tại Phnom Penh SEZ. Yêu cầu xe chạy thẳng không sang tải tại bãi cửa khẩu để tránh hư hỏng, rách bao bì và thất lạc phụ liệu. Nhà xe cần có giấy phép liên vận hợp lệ và hóa đơn VAT đầy đủ.',
        attachments: [
          { name: 'Cross_Border_Transport_Service_Scope.pdf', size: '2.1 MB', type: 'pdf', date: 'Vừa cập nhật' },
          { name: 'Packing_List_Garment_Accessories.xlsx', size: '410 KB', type: 'excel', date: 'Vừa cập nhật' },
          { name: 'Customs_Clearance_Checklist_Bavet_MocBai.pdf', size: '1.3 MB', type: 'pdf', date: 'Vừa cập nhật' },
        ],
      };
    }

    // Default Fallback Specs
    return {
      serviceCategory: `Dịch vụ Logistics ${lead.serviceType}`,
      serviceIcon: Boxes,
      colorTheme: 'indigo',
      specsGrid: [
        { label: 'Loại hình dịch vụ', value: lead.serviceType, sub: 'Dịch vụ chính', highlight: true },
        { label: 'Điểm lấy hàng', value: lead.origin, sub: 'Pickup point' },
        { label: 'Điểm giao hàng', value: lead.destination, sub: 'Delivery point' },
        { label: 'Hàng hóa chi tiết', value: lead.cargoDetails, sub: 'Quy cách đóng gói' },
      ],
      slaChecklist: [
        'Bảo hiểm trách nhiệm hàng hóa 100%',
        'GPS Real-time Tracking 24/7',
        'Biên bản bàn giao POD trong vòng 3 ngày',
      ],
      customerNotes: lead.cargoDetails,
      attachments: [
        { name: 'Inquiry_Detailed_Specification.pdf', size: '1.2 MB', type: 'pdf', date: 'Vừa cập nhật' },
      ],
    };
  };

  const specs = getSpecs();
  const ServiceIcon = specs.serviceIcon;

  return (
    <div className="bg-white rounded-2xl border border-indigo-200/90 shadow-sm overflow-hidden text-slate-900 animate-in fade-in duration-200 space-y-5 p-5">
      {/* 1. TOP ACTION & HEADER BAR: ĐẦU DÒNG CHI TIẾT TRÊN THÔNG TIN LIÊN HỆ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Thông tin chi tiết</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {isCustomerView
                ? 'Quy chuẩn kỹ thuật, phụ phí, chứng từ và yêu cầu dịch vụ'
                : 'Quy chuẩn kỹ thuật, phụ phí, chứng từ và liên hệ chủ hàng'}
            </p>
          </div>
        </div>

        {/* CỤM THAO TÁC HÀNH ĐỘNG */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Nút Sao Chép Link Lead Board để chia sẻ */}
          <button
            type="button"
            id={`detail-share-link-btn-${lead.code}`}
            onClick={handleShareLead}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              copiedShareLead
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
            title={`Sao chép link trực tiếp Lead Board lọc theo mã ${lead.code}`}
          >
            {copiedShareLead ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã Chép Link Lead!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Chia Sẻ Lead ({lead.code})</span>
              </>
            )}
          </button>

          {!isCustomerView && (
            <>
              {/* Nút Mở khóa SĐT & Đối thủ nếu chưa mở khóa */}
              {!isUnlocked ? (
                <button
                  type="button"
                  id={`detail-unlock-btn-${lead.code}`}
                  onClick={onUnlockClick}
                  className="group/unlock inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  title="Mở khóa để xem SĐT Hotline, Zalo, Email và Ma Trận Báo Giá Đối Thủ (50 Credits)"
                >
                  <KeyRound className="w-3.5 h-3.5 group-hover/unlock:rotate-12 transition-transform shrink-0 text-amber-100" />
                  <span>Mở khóa SĐT & Đối thủ</span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 text-amber-100 font-black text-[10px]">
                    <Coins className="w-3 h-3 text-amber-300" />
                    50
                  </span>
                </button>
              ) : (
                onCompareClick && (
                  <button
                    type="button"
                    id={`detail-compare-btn-${lead.code}`}
                    onClick={() => onCompareClick(lead)}
                    className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group/compare"
                    title="So sánh ma trận giá đối thủ & Phân tích thị trường"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-600 group-hover/compare:scale-110 transition-transform" />
                    <span>So Sánh Đối Thủ</span>
                  </button>
                )
              )}

              {/* Nút Tạo Báo Giá */}
              {onOpenCreateQuotation && (
                <button
                  type="button"
                  id={`detail-quote-btn-${lead.code}`}
                  onClick={() => onOpenCreateQuotation(lead)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Tạo và nộp báo giá cho đơn hàng này"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Báo Giá Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Nút Lưu Lead */}
              {onToggleSaveLead && (
                <button
                  type="button"
                  id={`detail-save-btn-${lead.code}`}
                  onClick={(e) => onToggleSaveLead(lead, e)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    lead.isSaved
                      ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                  title={
                    lead.isSaved
                      ? 'Đã lưu trong My Leads (Click để bỏ lưu)'
                      : 'Lưu tuyến tiềm năng vào My Leads'
                  }
                >
                  {lead.isSaved ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                      <span>Đã Lưu</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lưu Lead</span>
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. CÁC THÔNG TIN TRỌNG TÂM: TUYẾN ĐƯỜNG, HÀNG HÓA, SẢN LƯỢNG & ĐƠN GIÁ DỰ KIẾN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Tuyến Đường & Địa Điểm */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-indigo-200/80 shadow-2xs hover:border-indigo-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Tuyến Đường & Địa Điểm</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
              {lead.serviceType}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 leading-snug">
              {lead.route}
            </div>
            <div className="text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Giao: <strong>{lead.origin}</strong>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                Nhận: <strong>{lead.destination}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Hàng Hóa & Quy Cách */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/30 border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Hàng Hóa / Quy Cách</span>
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              {lead.urgency === 'Urgent' ? 'Gấp' : lead.urgency === 'High Value' ? 'Giá trị cao' : 'Tiêu chuẩn'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-slate-900 leading-snug">
              {lead.cargoDetails}
            </div>
            <div className="text-[11px] text-slate-600">
              Quy cách đóng gói & yêu cầu bảo quản theo tiêu chuẩn chủ hàng
            </div>
          </div>
        </div>

        {/* 3. Sản Lượng & Tần Suất */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/30 border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sản Lượng / Tần Suất</span>
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
              lead.pricingType === 'CONTRACT'
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {lead.pricingType === 'CONTRACT' ? 'Hợp Đồng' : 'Theo Lô / Chuyến'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-emerald-950 font-mono leading-snug">
              {lead.volumeDisplay}
            </div>
            <div className="text-[11px] text-slate-600">
              {lead.pricingType === 'CONTRACT' ? (lead.contractTerm || 'Hợp đồng định kỳ dài hạn') : 'Chuyến lẻ / Giao dịch đơn lẻ'}
            </div>
          </div>
        </div>

        {/* 4. Đơn Giá Dự Kiến (Đơn Giá DK) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-200/80 shadow-2xs hover:border-violet-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-900 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              <span>Đơn Giá DK</span>
            </span>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
              Target Budget
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-indigo-900 font-mono leading-snug">
              {lead.unitPriceDisplay}
            </div>
            <div className="text-[11px] text-slate-600 flex items-center justify-between">
              <span>Tổng dự kiến:</span>
              <strong className="text-slate-900 font-mono font-bold">{lead.estimatedValueDisplay}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CUSTOMER VERIFIED CONTACT INFORMATION BAR (CHỈ HIỂN THỊ TRÊN GIAO DIỆN SUPPLIER) */}
      {!isCustomerView && (
        <div
          className={`p-5 rounded-2xl border transition-all shadow-xs ${
            isUnlocked
              ? 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-emerald-300 text-emerald-950 ring-2 ring-emerald-400/30'
              : 'bg-gradient-to-br from-slate-50 to-indigo-50/30 border-slate-200 text-slate-800'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10.5px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  isUnlocked
                    ? 'bg-emerald-600 text-white border-emerald-600 flex items-center gap-1'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ĐÃ MỞ KHÓA THÔNG TIN LIÊN HỆ CHỦ HÀNG</span>
                  </>
                ) : (
                  'THÔNG TIN LIÊN HỆ CHỦ HÀNG (ĐANG KHÓA)'
                )}
              </span>

              {isUnlocked && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Doanh nghiệp đã xác thực pháp nhân & MST
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
              {/* Doanh nghiệp & MST */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Doanh nghiệp phát hành:
                </span>
                <span className="font-extrabold text-slate-900 text-xs block leading-snug">
                  {isUnlocked ? lead.customerCompany : maskCompanyName(lead.customerCompany)}
                </span>
                {isUnlocked && (
                  <div className="mt-1 flex items-center gap-1 text-[10.5px] text-slate-600 font-mono">
                    <span>MST: {taxIdValue}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('tax', taxIdValue)}
                      className="text-slate-400 hover:text-indigo-600 p-0.5"
                      title="Copy mã số thuế"
                    >
                      {copiedTax ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Người phụ trách */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Đầu mối phụ trách mua hàng:
                </span>
                <span className="font-extrabold text-slate-900 text-xs block">
                  {isUnlocked ? lead.contactName : maskContactPerson(lead.contactName)}
                </span>
                <span className="text-[10.5px] text-slate-500 block mt-0.5">
                  Chức vụ: <strong>{lead.contactRole}</strong>
                </span>
              </div>

              {/* SĐT Hotline & Zalo */}
              <div className={`p-3 rounded-xl border ${isUnlocked ? 'bg-emerald-50 border-emerald-300' : 'bg-white/80 border-slate-200/80'}`}>
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Hotline / Zalo liên hệ:
                </span>
                {isUnlocked ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 font-mono font-black text-emerald-950 text-sm">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{phoneValue}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('phone', phoneValue)}
                        className="text-slate-400 hover:text-emerald-700 p-0.5"
                        title="Copy số điện thoại"
                      >
                        {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <a
                        href={`https://zalo.me/${phoneValue.replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat Zalo</span>
                      </a>
                      <a
                        href={`tel:${phoneValue.replace(/\s+/g, '')}`}
                        className="px-2 py-0.5 text-[10px] font-bold bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Gọi Điện</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-bold mt-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>0908 ••• ••• (Bảo mật)</span>
                  </div>
                )}
              </div>

              {/* Email nhận báo giá */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Email nhận hồ sơ:
                </span>
                {isUnlocked ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 truncate" title={emailValue}>
                      <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{emailValue}</span>
                    </div>
                    <a
                      href={`mailto:${emailValue}?subject=Báo giá vận chuyển cho Lead ${lead.code}`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      <ExternalLink className="w-2.5 h-2.5" /> Gửi Email trực tiếp
                    </a>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-slate-400 mt-1 block">••••••@shipper.vn</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE TECHNICAL & OPERATIONAL SPECIFICATIONS (DỮ LIỆU KHÁCH HÀNG KHAI BÁO) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Thông Số Kỹ Thuật & Nghiệp Vụ Do Khách Hàng Khai Báo Cho Dịch Vụ Này</span>
          </h4>
          <span className="text-[11px] text-slate-500 italic">
            Dữ liệu tiêu chuẩn phục vụ tính toán định mức & lập báo giá chi tiết
          </span>
        </div>

        {/* Dynamic Bento Grid of Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-xs">
          {specs.specsGrid.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all ${
                item.highlight
                  ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200'
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="text-[10.5px] uppercase font-bold text-slate-400 block mb-1 tracking-tight">
                {item.label}
              </span>
              <span className="font-extrabold text-slate-900 block text-xs leading-snug">
                {item.value}
              </span>
              {item.sub && (
                <span className="text-[10.5px] text-slate-500 block mt-1 leading-tight">
                  {item.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. SPECIAL OPERATING REQUIREMENTS & SLA CRITERIA (TIÊU CHÍ VẬN HÀNH BẮT BUỘC) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: SLA Checklist */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-800 tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Yêu Cầu Vận Hành & Tiêu Chí Cam Kết (Customer SLA Requirements)</span>
          </div>

          <div className="space-y-2 text-xs">
            {specs.slaChecklist.map((req, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Customer Operating Notes & Attached Documents */}
        <div className="space-y-4">
          {/* Customer Instruction Notes */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-900 tracking-wider">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Ghi Chú Vận Hành Chi Tiết Từ Khách Hàng (Operating Notes)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-100 italic">
              "{specs.customerNotes}"
            </p>
          </div>

          {/* Attached Files & Drawings */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-800 tracking-wider">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Tài Liệu & Bảng Kê Đính Kèm ({specs.attachments.length} Tệp tin)</span>
              </div>
              <span className="text-[10.5px] text-slate-400">Tải về để xem chi tiết kích thước</span>
            </div>

            <div className="space-y-1.5">
              {specs.attachments.map((file, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                      {file.type === 'excel' ? <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-rose-600" />}
                    </span>
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 truncate block text-xs">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Dung lượng: {file.size} • {file.date}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file.name)}
                    className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải về</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download Notification Toast inside detail */}
      {downloadToast && (
        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadToast}</span>
          </div>
          <span className="text-[10px] text-slate-400">Mô phỏng tải tệp tin đính kèm</span>
        </div>
      )}
    </div>
  );
};
