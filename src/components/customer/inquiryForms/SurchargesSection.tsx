import React from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  Layers, 
  Anchor, 
  Truck, 
  Plane, 
  Sparkles, 
  Info, 
  Check, 
  HelpCircle,
  FileText,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { ServiceType, QuotationScope, SurchargeItemDef } from '../../../types';

// Ocean Freight Surcharges LOV
export const OCEAN_SURCHARGES: SurchargeItemDef[] = [
  // POL Origin
  {
    id: 'sc-ocean-thc-pol',
    code: 'THC (POL)',
    name: 'Phí xếp dỡ tại cảng bốc (Terminal Handling Charge - POL)',
    desc: 'Phí bốc xếp container từ cầu cảng lên tàu tại cảng xuất khẩu.',
    category: 'POL',
    categoryLabel: 'Đầu Bốc (POL - Origin)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-doc-pol',
    code: 'B/L & DOC',
    name: 'Phí chứng từ & Vận đơn đường biển (Bill of Lading / Documentation Fee)',
    desc: 'Phí phát hành bộ vận đơn đường biển gốc hoặc e-B/L hợp lệ.',
    category: 'POL',
    categoryLabel: 'Đầu Bốc (POL - Origin)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-seal',
    code: 'SEAL FEE',
    name: 'Phí kẹp chì niêm phong (Container Seal Fee)',
    desc: 'Phí cấp chì thép an toàn định danh theo tiêu chuẩn hải quan quốc tế.',
    category: 'POL',
    categoryLabel: 'Đầu Bốc (POL - Origin)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-vgm',
    code: 'VGM FEE',
    name: 'Phí khai báo tải trọng xác thực (Verified Gross Mass - VGM)',
    desc: 'Phí cân cont và truyền dữ liệu VGM theo công ước SOLAS quốc tế.',
    category: 'POL',
    categoryLabel: 'Đầu Bốc (POL - Origin)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-telex',
    code: 'TELEX RELEASE',
    name: 'Phí điện giao hàng / Surrendered (Telex Release Fee)',
    desc: 'Phí chỉ thị phát hành giao hàng nhanh không cần xuất trình B/L gốc.',
    category: 'POL',
    categoryLabel: 'Đầu Bốc (POL - Origin)',
    isPopularDefault: false,
  },
  {
    id: 'sc-ocean-liftoff-pol',
    code: 'LIFT ON/OFF (POL)',
    name: 'Phí hạ bãi / nâng hạ cont tại cảng bốc (Lift on/off at POL)',
    desc: 'Chi phí xe nâng bốc vỏ cont từ xe tải xuống bãi chờ xuất cảng.',
    category: 'POL',
    categoryLabel: 'Đầu Bốc (POL - Origin)',
    isPopularDefault: false,
  },

  // POD Destination
  {
    id: 'sc-ocean-do-pod',
    code: 'D/O FEE',
    name: 'Lệnh giao hàng đầu dỡ (Delivery Order - D/O Fee)',
    desc: 'Phí đại lý phát hành lệnh D/O để nhận hàng tại cảng đích/kho CFS.',
    category: 'POD',
    categoryLabel: 'Đầu Dỡ (POD - Destination)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-thc-pod',
    code: 'THC (POD)',
    name: 'Phí xếp dỡ tại cảng dỡ (Terminal Handling Charge - POD)',
    desc: 'Phí dỡ container từ boong tàu xuống bãi cảng đích.',
    category: 'POD',
    categoryLabel: 'Đầu Dỡ (POD - Destination)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-cleaning',
    code: 'CLEANING FEE',
    name: 'Phí vệ sinh container (Container Cleaning / Washing Fee)',
    desc: 'Phí kiểm tra, tẩy rửa khử khuẩn vỏ cont sau khi rút hàng trả bãi.',
    category: 'POD',
    categoryLabel: 'Đầu Dỡ (POD - Destination)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-handling-cfs',
    code: 'HANDLING / CFS',
    name: 'Phí đại lý & khai thác kho CFS (CFS / Handling Charge - Với LCL)',
    desc: 'Phí bốc dỡ, phân loại và lưu giữ hàng lẻ tại kho gom CFS cảng đích.',
    category: 'POD',
    categoryLabel: 'Đầu Dỡ (POD - Destination)',
    isPopularDefault: false,
  },

  // Ocean Freight Surcharges
  {
    id: 'sc-ocean-baf-lss',
    code: 'BAF / LSS',
    name: 'Phụ phí biến động nhiên liệu xanh (Bunker Adjustment / Low Sulphur)',
    desc: 'Phụ phí nhiên liệu dầu hàm lượng lưu huỳnh thấp theo chuẩn IMO 2020.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Cước Biển (Carrier Surcharges)',
    isPopularDefault: true,
  },
  {
    id: 'sc-ocean-pss',
    code: 'PSS',
    name: 'Phụ phí mùa cao điểm (Peak Season Surcharge - PSS)',
    desc: 'Phụ phí hãng tàu áp dụng trong các tháng cao điểm xuất nhập khẩu.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Cước Biển (Carrier Surcharges)',
    isPopularDefault: false,
  },
  {
    id: 'sc-ocean-cic',
    code: 'CIC / EBS',
    name: 'Phụ phí mất cân bằng vỏ container (Container Imbalance Charge)',
    desc: 'Bù đắp chi phí điều vỏ rỗng giữa các khu vực khan hiếm container.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Cước Biển (Carrier Surcharges)',
    isPopularDefault: false,
  },
];

// Trucking Surcharges LOV
export const TRUCKING_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-truck-bot',
    code: 'BOT TOLL',
    name: 'Phí cầu đường & Trạm thu phí BOT toàn tuyến (Toll Fees)',
    desc: 'Đã bao gồm toàn bộ vé thu phí tự động VETC/ePass trên hành trình.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Hành Trình',
    isPopularDefault: true,
  },
  {
    id: 'sc-truck-loading-labor',
    code: 'LOADING LABOR',
    name: 'Nhân công bốc xếp đầu gửi (Loading Labor Support)',
    desc: 'Hỗ trợ công nhân khuân vác, bốc hàng hóa từ sàn kho lên thùng xe.',
    category: 'INLAND',
    categoryLabel: 'Dịch Vụ Bốc Xếp & Phương Tiện',
    isPopularDefault: false,
  },
  {
    id: 'sc-truck-unloading-labor',
    code: 'UNLOADING LABOR',
    name: 'Nhân công bốc xếp đầu nhận (Unloading Labor Support)',
    desc: 'Hỗ trợ công nhân dỡ hàng từ xe xuống vị trí kho đích của người nhận.',
    category: 'INLAND',
    categoryLabel: 'Dịch Vụ Bốc Xếp & Phương Tiện',
    isPopularDefault: false,
  },
  {
    id: 'sc-truck-tail-lift',
    code: 'TAIL-LIFT / CRANE',
    name: 'Phụ phí xe bửng nâng thủy lực / Xe cẩu tự hành',
    desc: 'Phương tiện có bàn nâng hạ thủy lực hỗ trợ pallet hoặc thiết bị cẩu.',
    category: 'INLAND',
    categoryLabel: 'Dịch Vụ Bốc Xếp & Phương Tiện',
    isPopularDefault: false,
  },
  {
    id: 'sc-truck-permit',
    code: 'CITY PERMIT',
    name: 'Phí giấy phép vào đường cấm / Giờ cấm nội đô (Prohibited Hours Pass)',
    desc: 'Thu xếp giấy phép lưu hành xe tải vào các tuyến phố cấm ban ngày.',
    category: 'INLAND',
    categoryLabel: 'Quy Định & Pháp Lý',
    isPopularDefault: false,
  },
  {
    id: 'sc-truck-detention',
    code: 'DETENTION / OVERNIGHT',
    name: 'Phí lưu ca xe / Chờ bốc dỡ qua đêm (Truck Detention Fee)',
    desc: 'Chi phí bồi dưỡng thời gian xe phải chờ quá số giờ định mức tại kho.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Thời Gian',
    isPopularDefault: false,
  },
];

// Air Freight Surcharges LOV
export const AIR_SURCHARGES: SurchargeItemDef[] = [
  // I. Phụ Phí Cước Bay & Hãng Bay
  {
    id: 'sc-air-fsc',
    code: 'FSC (FUEL)',
    name: 'Phụ phí nhiên liệu hàng không (Fuel Surcharge - FSC)',
    desc: 'Phụ phí xăng máy bay biến động theo giá dầu thế giới tính theo kg cước.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Cước Bay',
    isPopularDefault: true,
  },
  {
    id: 'sc-air-ssc',
    code: 'SSC (SECURITY)',
    name: 'Phụ phí an ninh soi chiếu (Security Surcharge - SSC / ISS)',
    desc: 'Phí soi chiếu an ninh hành lý hàng hóa và kiểm tra X-Ray tại ga hàng không.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Cước Bay',
    isPopularDefault: true,
  },
  {
    id: 'sc-air-wrs',
    code: 'WRS (WAR RISK)',
    name: 'Phụ phí rủi ro chiến tranh hàng không (War Risk Surcharge - WRS)',
    desc: 'Phụ phí bảo hiểm rủi ro an ninh khi chuyến bay bay qua vùng không phận nhạy cảm.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Cước Bay',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-pss',
    code: 'PSS (PEAK SEASON)',
    name: 'Phụ phí mùa cao điểm hàng không (Peak Season Surcharge - PSS)',
    desc: 'Phụ phí áp dụng trong giai đoạn cao điểm quý 4 / giáp Tết / Black Friday tải bay khan hiếm.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Cước Bay',
    isPopularDefault: false,
  },

  // II. Phí Chứng Từ & Nhà Ga Sân Bay
  {
    id: 'sc-air-awb',
    code: 'AWB FEE',
    name: 'Phí phát hành vận đơn hàng không (Air Waybill Fee)',
    desc: 'Phí cấp vận đơn Master AWB / House AWB truyền dữ liệu hãng bay e-AWB.',
    category: 'POL',
    categoryLabel: 'Phí Chứng Từ & Sân Bay',
    isPopularDefault: true,
  },
  {
    id: 'sc-air-thc',
    code: 'AIRPORT THC / TERMINAL',
    name: 'Phí phục vụ hàng hóa tại ga sân bay (Terminal Handling Charge - THC)',
    desc: 'Phí kho TCS, SCSC, NCTS, ASc, ALSC phục vụ bốc xếp, cân đo và đóng ULD.',
    category: 'POL',
    categoryLabel: 'Phí Chứng Từ & Sân Bay',
    isPopularDefault: true,
  },
  {
    id: 'sc-air-edi',
    code: 'EDI / AMS / FWB',
    name: 'Phí truyền dữ liệu Manifest hải quan điện tử (Customs Manifest / EDI Fee)',
    desc: 'Phí truyền dữ liệu thông tin lô hàng trước giờ bay cho cơ quan hải quan (AMS/AFR/ENS/FWB).',
    category: 'POL',
    categoryLabel: 'Phí Chứng Từ & Sân Bay',
    isPopularDefault: true,
  },
  {
    id: 'sc-air-storage',
    code: 'TERMINAL STORAGE',
    name: 'Phí lưu kho ga hàng không (Air Terminal Storage & Demurrage)',
    desc: 'Phí lưu giữ hàng tại nhà ga hàng không vượt quá thời gian miễn phí cho phép.',
    category: 'POL',
    categoryLabel: 'Phí Chứng Từ & Sân Bay',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-do-breakbulk',
    code: 'D/O & BREAK-BULK',
    name: 'Phí chia tách Bill & Lệnh giao hàng D/O (Break-bulk & Delivery Order Fee)',
    desc: 'Phí tách Master/House AWB và phát hành lệnh nhận hàng cho hàng không nhập khẩu.',
    category: 'POL',
    categoryLabel: 'Phí Chứng Từ & Sân Bay',
    isPopularDefault: false,
  },

  // III. Phụ Phí Hàng Hóa Đặc Biệt (Special Cargo)
  {
    id: 'sc-air-dgr',
    code: 'DGR FEE',
    name: 'Phụ phí kiểm tra & tiếp nhận hàng nguy hiểm (Dangerous Goods Handling Fee)',
    desc: 'Phí kiểm tra checklist an toàn IATA DGR, dán nhãn UN và phân loại hàng hóa dễ cháy/pin.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Hàng Đặc Biệt',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-cool-storage',
    code: 'COOL / PHARMA STORAGE',
    name: 'Phí bảo quản kho lạnh / Phòng mát dược phẩm GDP (Cool Storage Fee)',
    desc: 'Phí cắm điện container lạnh chuyên dụng / phòng lạnh 2-8°C, 15-25°C cho vắc-xin, sinh phẩm.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Hàng Đặc Biệt',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-heavy-piece',
    code: 'HEAVY / OVERHANG',
    name: 'Phụ phí kiện hàng nặng & quá khổ (Heavy Piece / Out-of-Gauge Surcharge)',
    desc: 'Phụ phí cho kiện hàng nặng trên 150-300kg hoặc quá kích thước cửa hầm máy bay.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Hàng Đặc Biệt',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-val',
    code: 'VAL FEE (HIGH-VALUE)',
    name: 'Phụ phí giám sát an ninh hàng giá trị cao (Valuable Cargo Surcharge - VAL)',
    desc: 'Phí bố trí bảo vệ giám sát riêng tại kho an ninh cho hàng chip bán dẫn, vàng bạc, linh kiện cao cấp.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Hàng Đặc Biệt',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-avi-per',
    code: 'AVI / PER FEE',
    name: 'Phụ phí hàng động vật sống & nông sản mau hỏng (Live Animals / Perishables Fee)',
    desc: 'Phí phục vụ kiểm dịch, bố trí nhiệt độ và chăm sóc đặc biệt cho động vật / hàng tươi sống.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Hàng Đặc Biệt',
    isPopularDefault: false,
  },

  // IV. Phụ Phí Chuyển Phát Nhanh Door-to-Door (Express / Courier)
  {
    id: 'sc-air-ras',
    code: 'RAS (REMOTE AREA)',
    name: 'Phụ phí giao nhận vùng sâu vùng xa (Remote Area Surcharge - RAS)',
    desc: 'Phụ phí phát hàng ngoài vùng phục vụ tiêu chuẩn của mạng lưới chuyển phát nhanh.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Chuyển Phát Nhanh',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-addr-correct',
    code: 'ADDRESS CORRECTION',
    name: 'Phụ phí hiệu chỉnh & bổ sung địa chỉ bưu kiện (Address Correction Surcharge)',
    desc: 'Chi phí xử lý khi cần thay đổi địa chỉ người nhận sau khi bưu phẩm đã xuất bay.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Chuyển Phát Nhanh',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-oversize-box',
    code: 'OVERSIZE PACKAGE',
    name: 'Phụ phí bưu kiện vượt kích thước quy chuẩn (Non-Standard Package Surcharge)',
    desc: 'Phụ phí áp dụng cho kiện hàng hình trụ tròn, hàng dài trên 120cm hoặc không thể xếp băng chuyền tự động.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Chuyển Phát Nhanh',
    isPopularDefault: false,
  },
  {
    id: 'sc-air-emergency-net',
    code: 'EMERGENCY NETWORK',
    name: 'Phụ phí điều phối khẩn cấp mạng lưới Express (Emergency Situation Surcharge)',
    desc: 'Phụ phí mùa cao điểm hoặc tình huống khẩn cấp bảo đảm ưu tiên tải bay hỏa tốc.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Chuyển Phát Nhanh',
    isPopularDefault: false,
  },
];

// Rail Freight Surcharges LOV
export const RAIL_SURCHARGES: SurchargeItemDef[] = [
  // I. Phụ Phí Vận Tải & Chạy Tàu
  {
    id: 'sc-rail-freight',
    code: 'RAIL FREIGHT',
    name: 'Cước vận chuyển chính trên đường ray (Main Rail Freight Rate)',
    desc: 'Cước vận chuyển container/toa xe theo chiều dài tuyến đường sắt Bắc - Nam / liên vận.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Vận Tải & Chạy Tàu',
    isPopularDefault: true,
  },
  {
    id: 'sc-rail-fuel',
    code: 'RAIL FUEL',
    name: 'Phụ phí biến động giá dầu đầu máy tàu (Rail Fuel Surcharge)',
    desc: 'Phụ phí nhiên liệu diesel đầu kéo đường sắt biến động theo thị trường.',
    category: 'FREIGHT',
    categoryLabel: 'Phụ Phí Vận Tải & Chạy Tàu',
    isPopularDefault: false,
  },

  // II. Phí Bãi Ga & Thủ Tục Ga
  {
    id: 'sc-rail-lolo',
    code: 'RAIL LOLO / TERMINAL',
    name: 'Phí nâng hạ container tại bãi ga (Rail Terminal Handling / Lift on - Lift off)',
    desc: 'Phí cẩu gắp container từ xe đầu kéo lên toa xe và ngược lại tại bãi ga Giáp Bát, Sóng Thần, Yên Viên.',
    category: 'POL',
    categoryLabel: 'Phí Bãi Ga & Chứng Từ',
    isPopularDefault: true,
  },
  {
    id: 'sc-rail-bill',
    code: 'RAILWAY BILL (CIM/SMGS)',
    name: 'Phí vận đơn đường sắt liên vận (CIM / SMGS Consignment Note Fee)',
    desc: 'Phí phát hành chứng từ vận tải đường sắt nội địa và liên vận quốc tế.',
    category: 'POL',
    categoryLabel: 'Phí Bãi Ga & Chứng Từ',
    isPopularDefault: true,
  },
  {
    id: 'sc-rail-genset',
    code: 'RAIL GENSET POWER',
    name: 'Phí cắm điện & máy phát điện Genset cont lạnh trên toa xe',
    desc: 'Chi phí duy trì nguồn điện liên tục cho container lạnh 20RF/40RF trong suốt hành trình đoàn tàu.',
    category: 'POL',
    categoryLabel: 'Phí Bãi Ga & Chứng Từ',
    isPopularDefault: false,
  },
  {
    id: 'sc-rail-transshipment',
    code: 'GAUGE TRANSSHIPMENT',
    name: 'Phí sang toa chuyển tải tại ga biên giới (Transshipment Fee)',
    desc: 'Phí chuyển tải hàng hóa giữa khổ ray 1.000mm (Việt Nam) và 1.435mm (Trung Quốc) tại ga Đồng Đăng / Bằng Tường.',
    category: 'POL',
    categoryLabel: 'Phí Bãi Ga & Chứng Từ',
    isPopularDefault: false,
  },
  {
    id: 'sc-rail-seal',
    code: 'RAILWAY SEAL',
    name: 'Phí kẹp chì niêm phong Seal an ninh đường sắt',
    desc: 'Chi phí cấp chì niêm phong bảo mật của ngành đường sắt chống cạy mở trên đường chạy.',
    category: 'POL',
    categoryLabel: 'Phí Bãi Ga & Chứng Từ',
    isPopularDefault: true,
  },
  {
    id: 'sc-rail-demurrage',
    code: 'WAGON DEMURRAGE / STORAGE',
    name: 'Phí lưu bãi ga & lưu toa xe quá hạn (Wagon Demurrage & Storage Fee)',
    desc: 'Phí lưu giữ container/hàng hóa tại bãi hàng ga đường sắt vượt quá thời gian miễn phí thỏa thuận.',
    category: 'POL',
    categoryLabel: 'Phí Bãi Ga & Chứng Từ',
    isPopularDefault: false,
  },
  {
    id: 'sc-rail-do',
    code: 'RAIL D/O & UNLOAD',
    name: 'Phí lệnh giao hàng D/O & dỡ hàng kho ga đích',
    desc: 'Phí phát hành lệnh nhận hàng và sang dỡ hàng tại kho ga nhận hàng.',
    category: 'POL',
    categoryLabel: 'Phí Bãi Ga & Chứng Từ',
    isPopularDefault: false,
  },
];

// 1. Kho Thường Grade A (Dry Warehouse) - 5 mục
export const DRY_WAREHOUSE_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-wh-inbound-handling',
    code: 'INBOUND HANDLING',
    name: 'Phí nâng hạ & dỡ hàng nhập kho (Inbound Handling Fee)',
    desc: 'Phí xe nâng và nhân công tiếp nhận, kiểm đếm mã vạch và xếp hàng lên kệ Racking.',
    category: 'POL',
    categoryLabel: 'Phí Vận Hành Bốc Xếp',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-outbound-handling',
    code: 'OUTBOUND HANDLING',
    name: 'Phí lấy hàng & bốc xếp xuất kho (Outbound Handling Fee)',
    desc: 'Phí hạ hàng từ giá kệ, đối soát phiếu xuất và bốc xếp lên xe tải/container.',
    category: 'POL',
    categoryLabel: 'Phí Vận Hành Bốc Xếp',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-devanning',
    code: 'CONTAINER DEVANNING',
    name: 'Phí rút ruột container thủ công & lên Pallet (Devanning Fee)',
    desc: 'Phí bốc dỡ hàng rời trong container 20ft/40ft, phân loại và xếp lên pallet tiêu chuẩn quấn màng PE.',
    category: 'POL',
    categoryLabel: 'Phí Vận Hành Bốc Xếp',
    isPopularDefault: false,
  },
  {
    id: 'sc-wh-wms-mgmt',
    code: 'WMS & REALTIME API',
    name: 'Phí phần mềm WMS & Báo cáo tồn kho thời gian thực (WMS API Portal)',
    desc: 'Phí cấp tài khoản portal quản lý xuất-nhập-tồn trực tuyến, kết nối API đồng bộ với ERP/SAP của khách.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-overtime',
    code: 'OVERTIME & HOLIDAY',
    name: 'Phụ phí xuất nhập ngoài giờ / Chủ Nhật & Ngày Lễ (Overtime Surcharge)',
    desc: 'Phụ phí bố trí thủ kho và tài xế xe nâng làm việc ca đêm, ngoài giờ hành chính hoặc ngày nghỉ lễ.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: false,
  },
];

// 2. Kho Lạnh / Mát (Cold Storage) - 5 mục
export const COLD_WAREHOUSE_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-wh-cold-inbound',
    code: 'COLD INBOUND HANDLING',
    name: 'Phí bốc xếp & nâng hạ phòng đệm kho lạnh (Cold Inbound Handling)',
    desc: 'Phí bốc dỡ qua phòng đệm nhiệt độ (Antechamber) và đưa hàng vào buồng đông sâu/kho mát.',
    category: 'POL',
    categoryLabel: 'Phí Vận Hành Kho Lạnh',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-cold-outbound',
    code: 'COLD OUTBOUND HANDLING',
    name: 'Phí soạn hàng & bốc xếp xe đông lạnh (Cold Outbound Handling)',
    desc: 'Phí xuất hàng nhanh qua cửa Dock cách nhiệt chuyên dụng lên thùng xe tải lạnh.',
    category: 'POL',
    categoryLabel: 'Phí Vận Hành Kho Lạnh',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-plugin-power',
    code: 'REEFER PLUG-IN POWER',
    name: 'Phí cắm điện container lạnh tại bãi kho (Reefer Plug-in Fee)',
    desc: 'Chi phí duy trì nguồn điện 3 pha cho container lạnh 20RF/40RF lưu bãi chờ rút ruột bảo quản nhiệt độ.',
    category: 'POL',
    categoryLabel: 'Phụ Phí Nhiệt Độ Chuyên Biệt',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-cold-wms',
    code: 'WMS & TEMP LOGGING 24/7',
    name: 'Phí phần mềm WMS & Giám sát nhiệt độ tự động 24/7 (Temp Datalogger)',
    desc: 'Báo cáo biểu đồ dải nhiệt độ lưu kho liên tục theo tiêu chuẩn HACCP / GDP Dược phẩm.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-overtime',
    code: 'COLD OVERTIME HANDLING',
    name: 'Phụ phí vận hành kho lạnh ca đêm & Ngày Lễ (Cold Overtime Surcharge)',
    desc: 'Phụ phí bố trí nhân sự và thiết bị bảo hộ kho lạnh làm việc ngoài khung giờ tiêu chuẩn.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: false,
  },
];

// 3. Kho Hàng Nguy Hiểm (DG Warehouse) - 5 mục
export const DG_WAREHOUSE_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-wh-dg-safety',
    code: 'DG SAFETY & COMPLIANCE',
    name: 'Phụ phí an toàn & giám sát PCCC kho hóa chất (DG Safety Surcharge)',
    desc: 'Chi phí duy trì hệ thống PCCC bọt foam chuyên dụng, cảm biến khí độc và đội ngũ ứng phó tràn đổ hóa chất.',
    category: 'POL',
    categoryLabel: 'An Toàn & Giám Sát DG',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-dg-inbound',
    code: 'DG INBOUND HANDLING',
    name: 'Phí nâng hạ & dỡ hàng nguy hiểm nhập kho (DG Inbound Handling)',
    desc: 'Phí xe nâng đạt chuẩn chống cháy nổ tiếp nhận và kiểm soát bảng mã UN / MSDS.',
    category: 'POL',
    categoryLabel: 'Vận Hành Bốc Xếp DG',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-dg-outbound',
    code: 'DG OUTBOUND HANDLING',
    name: 'Phí soạn hàng & bốc xếp xuất kho hàng nguy hiểm (DG Outbound Handling)',
    desc: 'Phí lấy hàng, kiểm tra tem nhãn IMO 9 nhóm và bốc xếp an toàn lên phương tiện chuyên dụng.',
    category: 'POL',
    categoryLabel: 'Vận Hành Bốc Xếp DG',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-dg-wms',
    code: 'WMS DG & MSDS TRACKING',
    name: 'Phí phần mềm WMS quản lý hồ sơ MSDS & Phân khu cách ly hóa chất',
    desc: 'Quản lý cách ly hóa chất kỵ nhau, đối soát bảng dữ liệu an toàn hóa chất MSDS.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-empty-storage',
    code: 'EMPTY DG CONTAINER STORAGE',
    name: 'Phí lưu bãi vỏ container chuyên dụng chứa hàng DG tại depot kho',
    desc: 'Phí lưu giữ vỏ container rỗng tại bãi đệm sau khi rút ruột chờ lệnh trả vỏ.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: false,
  },
];

// 4. Kho Ngoại Quan (Bonded Warehouse) - 5 mục
export const BONDED_WAREHOUSE_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-wh-bonded-ledger',
    code: 'BONDED CUSTOMS LEDGER',
    name: 'Phí mở sổ hải quan & báo cáo quyết toán kho ngoại quan (Bonded Ledger Fee)',
    desc: 'Phí lập hồ sơ theo dõi hải quan, quản lý chứng từ XNK và báo cáo thanh khoản định kỳ theo quy định hải quan.',
    category: 'POL',
    categoryLabel: 'Thủ Tục Hải Quan Ngoại Quan',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-bonded-inbound',
    code: 'BONDED INBOUND HANDLING',
    name: 'Phí tiếp nhận & kiểm tra chì niêm phong hải quan (Bonded Inbound Handling)',
    desc: 'Phí dỡ hàng nhập kho dưới sự giám sát niêm phong và đối chiếu số Seal hải quan.',
    category: 'POL',
    categoryLabel: 'Vận Hành Kho Ngoại Quan',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-bonded-outbound',
    code: 'BONDED OUTBOUND HANDLING',
    name: 'Phí bốc xếp xuất hàng theo tờ khai hải quan (Bonded Outbound Handling)',
    desc: 'Phí hạ hàng và xuất kho theo đúng số tờ khai thông quan chuyển khẩu hoặc nhập nội địa.',
    category: 'POL',
    categoryLabel: 'Vận Hành Kho Ngoại Quan',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-devanning',
    code: 'CONTAINER DEVANNING / VANNING',
    name: 'Phí rút ruột / đóng ghép container hàng ngoại quan',
    desc: 'Phí bốc dỡ, phân loại và đóng ghép hàng hóa giữa các container trung chuyển.',
    category: 'POL',
    categoryLabel: 'Vận Hành Kho Ngoại Quan',
    isPopularDefault: false,
  },
  {
    id: 'sc-wh-wms-mgmt',
    code: 'WMS BONDED CUSTOMS API',
    name: 'Phí phần mềm WMS kết nối dữ liệu hải quan kho ngoại quan',
    desc: 'Hệ thống WMS quản lý xuất nhập tồn theo định dạng chuẩn của Tổng Cục Hải Quan.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: true,
  },
];

// 5. Kho TMĐT / Fulfillment (E-Commerce B2C) - 4 mục
export const ECOMMERCE_WAREHOUSE_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-wh-pick-pack',
    code: 'PICK & PACK FULFILLMENT',
    name: 'Phí chia chọn & đóng gói đơn hàng TMĐT (Pick & Pack Fee)',
    desc: 'Phí nhặt hàng từng SKU theo đơn B2C, đóng gói hộp carton và dán phiếu gửi hàng đa sàn.',
    category: 'POL',
    categoryLabel: 'Xử Lý Đơn Hàng B2C',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-wms-ecom',
    code: 'WMS & OMNICHANNEL OMS API',
    name: 'Phí phần mềm WMS & API đồng bộ đa sàn (Shopee/TikTok/Lazada/Haravan)',
    desc: 'Tự động kéo đơn hàng, đẩy mã vận đơn và đồng bộ tồn kho thời gian thực giữa các gian hàng.',
    category: 'GENERAL',
    categoryLabel: 'Hệ Thống Đa Sàn',
    isPopularDefault: true,
  },
  {
    id: 'sc-wh-cycle-count',
    code: 'STOCK CYCLE COUNT',
    name: 'Phí kiểm kê định kỳ & đối soát tồn kho từng SKU (Cycle Count Fee)',
    desc: 'Kiểm kê định kỳ hàng tháng theo từng mã hàng SKU nhằm giảm thiểu tỷ lệ thất thoát.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: false,
  },
  {
    id: 'sc-wh-overtime-peak',
    code: 'PEAK SEASON OVERTIME',
    name: 'Phụ phí tăng ca xử lý đơn Mega Sale (11.11, 12.12, Giáp Tết)',
    desc: 'Phụ phí bố trí nhân sự làm việc 24/7 để hoàn tất đơn hỏa tốc trong các ngày siêu sale lớn.',
    category: 'GENERAL',
    categoryLabel: 'Quản Lý & Tiện Ích Kho',
    isPopularDefault: false,
  },
];

// 6. Kho Tự Quản (Self-Storage) - 1 mục
export const SELF_STORAGE_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-wh-access-card',
    code: '24/7 ACCESS KEY & CARD',
    name: 'Phí cấp thẻ từ / Chìa khóa phụ truy cập khoang tự quản 24/7',
    desc: 'Phí cấp mã định danh thẻ từ hoặc chìa khóa phụ cho nhân sự khách hàng ra vào khoang riêng.',
    category: 'GENERAL',
    categoryLabel: 'Tiện Ích Khoang Tự Quản',
    isPopularDefault: false,
  },
];

// Default list for fallback / generic reuse
export const WAREHOUSING_SURCHARGES: SurchargeItemDef[] = DRY_WAREHOUSE_SURCHARGES;

// Other Generic Logistics Surcharges LOV
export const GENERAL_LOGISTICS_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-gen-customs-transmit',
    code: 'EDI TRANSMISSION',
    name: 'Phí truyền dữ liệu tờ khai hải quan điện tử VNACCS/VCIS',
    desc: 'Phí bản quyền phần mềm và đường truyền khai báo hải quan thông quan.',
    category: 'GENERAL',
    categoryLabel: 'Thủ Tục & Chứng Từ',
    isPopularDefault: true,
  },
  {
    id: 'sc-gen-handling',
    code: 'HANDLING & MANAGEMENT',
    name: 'Phí quản lý & dịch vụ điều phối logistics (Handling Fee)',
    desc: 'Chi phí chăm sóc đơn hàng, theo dõi lộ trình và giải quyết phát sinh.',
    category: 'GENERAL',
    categoryLabel: 'Thủ Tục & Chứng Từ',
    isPopularDefault: true,
  },
  {
    id: 'sc-gen-storage',
    code: 'DEPOT / WAREHOUSE STORAGE',
    name: 'Phí lưu kho bãi / Cắm điện bảo quản tạm thời',
    desc: 'Chi phí lưu kho bãi ngắn hạn trong thời gian chờ thủ tục giao nhận.',
    category: 'INLAND',
    categoryLabel: 'Kho Bãi & Lưu Bãi',
    isPopularDefault: false,
  },
];

// Customs Clearance Surcharges LOV
export const CUSTOMS_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-customs-edi',
    code: 'VNACCS / EDI',
    name: 'Phí truyền dữ liệu tờ khai hải quan điện tử (VNACCS/VCIS)',
    desc: 'Phí bản quyền đường truyền số hóa dữ liệu tờ khai vào hệ thống Tổng cục Hải quan.',
    category: 'POL',
    categoryLabel: 'Phí Khai Báo & Truyền Dữ Liệu',
    isPopularDefault: true,
  },
  {
    id: 'sc-customs-red-channel',
    code: 'RED CHANNEL',
    name: 'Phí kiểm hóa thực tế bãi kiểm (Luồng Đỏ - Red Channel)',
    desc: 'Chi phí cử nhân sự hiện trường đăng ký kiểm hóa, cắt seal, bốc xếp kiểm đếm cùng công chức hải quan.',
    category: 'POL',
    categoryLabel: 'Phí Hiện Trường & Kiểm Hóa',
    isPopularDefault: true,
  },
  {
    id: 'sc-customs-devanning',
    code: 'DEVANNING / LIFT',
    name: 'Phí nâng hạ & rút ruột container phục vụ kiểm hóa',
    desc: 'Phí cẩu gắp và bốc dỡ hàng mẫu ra khỏi container tại bãi kiểm hóa cảng/ICD.',
    category: 'POL',
    categoryLabel: 'Phí Hiện Trường & Kiểm Hóa',
    isPopularDefault: false,
  },
  {
    id: 'sc-customs-inspection',
    code: 'SPECIALIZED PERMIT',
    name: 'Phí thủ tục kiểm tra chuyên ngành (Kiểm dịch / VSATTP / Hợp quy CR)',
    desc: 'Chi phí đăng ký hồ sơ, phối hợp cơ quan chuyên ngành lấy mẫu thử nghiệm tại cảng.',
    category: 'POD',
    categoryLabel: 'Kiểm Tra Chuyên Ngành & C/O',
    isPopularDefault: true,
  },
  {
    id: 'sc-customs-co',
    code: 'C/O APPLICATION',
    name: 'Phí thủ tục xin cấp Chứng nhận xuất xứ hàng hóa (C/O Fee)',
    desc: 'Chi phí chuẩn bị bộ chứng từ, nộp hồ sơ điện tử và nhận phôi C/O gốc tại VCCI / Phòng QLXNK.',
    category: 'POD',
    categoryLabel: 'Kiểm Tra Chuyên Ngành & C/O',
    isPopularDefault: false,
  },
  {
    id: 'sc-customs-consultation',
    code: 'VALUATION & HS',
    name: 'Phí tư vấn tham vấn trị giá hải quan & giải trình mã HS Code',
    desc: 'Chi phí đại diện chuẩn bị hồ sơ kỹ thuật, chứng minh mức giá giao dịch và áp mã HS chuẩn xác.',
    category: 'POD',
    categoryLabel: 'Tư Vấn & Pháp Lý Hải Quan',
    isPopularDefault: false,
  },
  {
    id: 'sc-customs-doc-delivery',
    code: 'DOC HANDOVER',
    name: 'Phí bàn giao bộ tờ khai thông quan gốc tận nơi & lưu trữ hồ sơ',
    desc: 'Chi phí giao nhận chuyển phát bảo đảm bộ chứng từ gốc có xác nhận thông quan về trụ sở khách hàng.',
    category: 'POD',
    categoryLabel: 'Tư Vấn & Pháp Lý Hải Quan',
    isPopularDefault: false,
  },
];

// Cold Chain Surcharges LOV
export const COLD_CHAIN_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-cold-genset',
    code: 'GENSET & PLUG-IN',
    name: 'Phí chạy máy phát điện lạnh liên tục & Cắm điện bãi (Genset / Plug-in)',
    desc: 'Phí duy trì nhiệt độ bảo quản chuẩn trong suốt hành trình và thời gian chờ hạ bãi.',
    category: 'INLAND',
    categoryLabel: 'Bảo Quản & Nhiệt Độ',
    isPopularDefault: true,
  },
  {
    id: 'sc-cold-datalogger',
    code: 'DATALOGGER & IOT',
    name: 'Phí giám sát nhiệt độ cảm biến IoT thời gian thực & Xuất dữ liệu Datalogger',
    desc: 'Cung cấp biểu đồ dải nhiệt độ chi tiết từng phút từ lúc đóng hàng đến khi giao nhận.',
    category: 'INLAND',
    categoryLabel: 'Bảo Quản & Nhiệt Độ',
    isPopularDefault: true,
  },
  {
    id: 'sc-cold-dry-ice',
    code: 'DRY ICE / GEL PACKS',
    name: 'Phí bổ sung đá khô / Gel lạnh bảo quản thứ cấp chuyên dụng',
    desc: 'Duy trì độ lạnh sâu cho các mặt hàng vaccine, sinh phẩm, kem, hoặc hải sản tươi sống.',
    category: 'INLAND',
    categoryLabel: 'Vật Tư & Đóng Gói Lạnh',
    isPopularDefault: false,
  },
  {
    id: 'sc-cold-sanitization',
    code: 'SANITIZATION',
    name: 'Phí khử trùng, xịt ozone & Vệ sinh khoang lạnh chuẩn VSATTP / GDP',
    desc: 'Khử mùi, diệt khuẩn thùng xe trước khi tiếp nhận lô hàng thực phẩm hoặc dược phẩm.',
    category: 'INLAND',
    categoryLabel: 'Vệ Sinh & Tiêu Chuẩn',
    isPopularDefault: false,
  },
  {
    id: 'sc-cold-detention',
    code: 'COLD DETENTION',
    name: 'Phí lưu ca xe bảo quản lạnh qua đêm (Cold Detention Fee)',
    desc: 'Bồi dưỡng thời gian xe phải nổ máy lạnh chờ bốc dỡ quá số giờ quy định tại kho.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Thời Gian',
    isPopularDefault: false,
  },
  {
    id: 'sc-cold-bot',
    code: 'BOT TOLL',
    name: 'Phí cầu đường & Trạm thu phí BOT toàn tuyến (Toll Fees)',
    desc: 'Vé trạm thu phí tự động VETC/ePass trên hành trình vận tải lạnh.',
    category: 'INLAND',
    categoryLabel: 'Phụ Phí Hành Trình',
    isPopularDefault: true,
  },
];

// Cross-Border Surcharges LOV
export const CROSS_BORDER_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-cb-transshipment',
    code: 'BORDER TRANSSHIPMENT',
    name: 'Phí sang tải / Đổi đầu kéo tại bãi chuyển tải cửa khẩu biên giới',
    desc: 'Phí nhân công và xe nâng bốc chuyển hàng từ xe Việt Nam sang xe nước bạn hoặc đổi đầu kéo.',
    category: 'POL',
    categoryLabel: 'Chuyển Tải Cửa Khẩu',
    isPopularDefault: true,
  },
  {
    id: 'sc-cb-depot-storage',
    code: 'BORDER DEPOT STORAGE',
    name: 'Phí lưu bãi & Nâng hạ container tại bãi đệm cửa khẩu (Border Depot)',
    desc: 'Chi phí lưu xe/cont tại bãi chờ mở tờ khai hải quan và thông quan biên giới.',
    category: 'POL',
    categoryLabel: 'Bến Bãi Cửa Khẩu',
    isPopularDefault: true,
  },
  {
    id: 'sc-cb-permit',
    code: 'GMS PERMIT',
    name: 'Phí giấy phép liên vận quốc tế GMS / Hiệp định CAM-LAO-VN',
    desc: 'Thủ tục xin cấp phù hiệu và giấy phép vận tải đường bộ qua biên giới hợp pháp.',
    category: 'POL',
    categoryLabel: 'Giấy Phép & Thủ Tục',
    isPopularDefault: true,
  },
  {
    id: 'sc-cb-quarantine',
    code: 'BORDER QUARANTINE',
    name: 'Phí kiểm dịch thực vật / Động vật & Khử trùng tại trạm kiểm soát biên giới',
    desc: 'Thực hiện lấy mẫu kiểm tra và cấp chứng thư kiểm dịch xuất nhập khẩu tại cửa khẩu.',
    category: 'POD',
    categoryLabel: 'Kiểm Dịch & Chuyên Ngành',
    isPopularDefault: false,
  },
  {
    id: 'sc-cb-pilot',
    code: 'BORDER PILOT & RUNNER',
    name: 'Phí hoa tiêu / Nhân sự giao nhận điều phối qua barie cửa khẩu 2 đầu',
    desc: 'Hỗ trợ tài xế làm thủ tục xuất cảnh phương tiện và hướng dẫn xe vào bãi nhận hàng.',
    category: 'POL',
    categoryLabel: 'Điều Phối Hiện Trường',
    isPopularDefault: false,
  },
  {
    id: 'sc-cb-overtime',
    code: 'OVERTIME CUSTOMS',
    name: 'Phí làm thủ tục hải quan cửa khẩu ngoài giờ hành chính & Ngày nghỉ',
    desc: 'Chi phí mở tờ khai và thông quan gấp buổi tối hoặc cuối tuần để giải phóng xe nhanh.',
    category: 'POL',
    categoryLabel: 'Dịch Vụ Ngoài Giờ',
    isPopularDefault: false,
  },
];

// Project Cargo Surcharges LOV
export const PROJECT_CARGO_SURCHARGES: SurchargeItemDef[] = [
  {
    id: 'sc-proj-survey',
    code: 'ROUTE SURVEY',
    name: 'Phí khảo sát tuyến đường & Đánh giá kết cấu cầu đường (Route Survey)',
    desc: 'Đo đạc tĩnh không cầu vượt, dây điện, bán kính cua và kiểm tra tải trọng cầu yếu.',
    category: 'GENERAL',
    categoryLabel: 'Khảo Sát & Kỹ Thuật',
    isPopularDefault: true,
  },
  {
    id: 'sc-proj-permit',
    code: 'SPECIAL PERMIT',
    name: 'Phí xin giấy phép lưu hành đặc biệt hàng siêu trường siêu trọng (Oversize)',
    desc: 'Hồ sơ cấp phép của Cục Đường Bộ cho phương tiện chở hàng vượt quá khổ giới hạn.',
    category: 'GENERAL',
    categoryLabel: 'Pháp Lý & Cấp Phép',
    isPopularDefault: true,
  },
  {
    id: 'sc-proj-escort',
    code: 'PILOT ESCORT',
    name: 'Phí xe hộ tống dẫn đường & Điều tiết giao thông chuyên dụng (Pilot Cars)',
    desc: 'Xe chuyên dùng có đèn tín hiệu cảnh báo đi trước và sau đoàn xe rơ-moóc chở hàng nặng.',
    category: 'GENERAL',
    categoryLabel: 'An Toàn Hành Trình',
    isPopularDefault: true,
  },
  {
    id: 'sc-proj-lashing',
    code: 'LASHING & SECURING',
    name: 'Phí chèn lót, chằng buộc & Giằng néo an toàn hàng dự án (Lashing & Securing)',
    desc: 'Sử dụng cáp thép, xích chuyên dụng, gỗ chèn lót chịu lực và cấp chứng thư chằng buộc an toàn.',
    category: 'GENERAL',
    categoryLabel: 'Chằng Buộc & Gia Cố',
    isPopularDefault: true,
  },
  {
    id: 'sc-proj-crane',
    code: 'HEAVY MOBILE CRANE',
    name: 'Phí cẩu tự hành / Cẩu bánh lốp chuyên dụng bốc dỡ hàng siêu trọng',
    desc: 'Huy động cẩu 50T - 250T nâng hạ kết cấu máy móc thiết bị đặt vào vị trí bệ móng.',
    category: 'GENERAL',
    categoryLabel: 'Nâng Hạ Hiện Trường',
    isPopularDefault: false,
  },
  {
    id: 'sc-proj-obstacle',
    code: 'OBSTACLE REMOVAL',
    name: 'Phí nâng hạ tạm thời chướng ngại vật (dây điện, cổng chào, biển báo giao thông)',
    desc: 'Phối hợp đơn vị điện lực và quản lý đường bộ xử lý vật cản trên hành trình di chuyển.',
    category: 'GENERAL',
    categoryLabel: 'Hạ Tầng Hành Trình',
    isPopularDefault: false,
  },
];

export const getSurchargesForService = (serviceType: ServiceType, warehouseType?: string): SurchargeItemDef[] => {
  switch (serviceType) {
    case 'Sea Freight (FCL)':
    case 'Sea Freight (LCL)':
      return OCEAN_SURCHARGES;
    case 'Trucking':
      return TRUCKING_SURCHARGES;
    case 'Cold Chain':
      return COLD_CHAIN_SURCHARGES;
    case 'Air Freight':
      return AIR_SURCHARGES;
    case 'Rail Freight':
      return RAIL_SURCHARGES;
    case 'Warehousing':
      if (warehouseType?.includes('Lạnh') || warehouseType?.includes('Mát')) return COLD_WAREHOUSE_SURCHARGES;
      if (warehouseType?.includes('Nguy Hiểm') || warehouseType?.includes('Hóa Chất')) return DG_WAREHOUSE_SURCHARGES;
      if (warehouseType?.includes('Ngoại Quan')) return BONDED_WAREHOUSE_SURCHARGES;
      if (warehouseType?.includes('Thương Mại Điện Tử') || warehouseType?.includes('Fulfillment')) return ECOMMERCE_WAREHOUSE_SURCHARGES;
      if (warehouseType?.includes('Tự Quản')) return SELF_STORAGE_SURCHARGES;
      return DRY_WAREHOUSE_SURCHARGES;
    case 'Customs Clearance':
      return CUSTOMS_SURCHARGES;
    case 'Cross-border':
      return CROSS_BORDER_SURCHARGES;
    case 'Project Cargo':
      return PROJECT_CARGO_SURCHARGES;
    default:
      return GENERAL_LOGISTICS_SURCHARGES;
  }
};

interface SurchargesSectionProps {
  serviceType: ServiceType;
  warehouseType?: string;
  cargoClassification?: string;
  quotationScope?: QuotationScope | '';
  onChangeQuotationScope: (scope: QuotationScope) => void;
  selectedSurcharges?: string[];
  onChangeSelectedSurcharges?: (surcharges: string[]) => void;
  surchargesNotes?: string;
  onChangeSurchargesNotes?: (notes: string) => void;
  themeColor?: 'blue' | 'cyan' | 'teal' | 'sky' | 'emerald' | 'purple' | 'amber' | 'orange' | 'indigo';
}

export const SurchargesSection: React.FC<SurchargesSectionProps> = ({
  serviceType,
  warehouseType,
  quotationScope,
  onChangeQuotationScope,
  selectedSurcharges = [],
  onChangeSelectedSurcharges,
  surchargesNotes = '',
  onChangeSurchargesNotes,
}) => {
  const availableSurcharges = getSurchargesForService(serviceType, warehouseType);

  const handleToggleSurcharge = (name: string) => {
    if (!onChangeSelectedSurcharges) return;
    if (selectedSurcharges.includes(name)) {
      onChangeSelectedSurcharges(selectedSurcharges.filter((s) => s !== name));
    } else {
      onChangeSelectedSurcharges([...selectedSurcharges, name]);
    }
  };

  const handleSelectPopular = () => {
    if (!onChangeSelectedSurcharges) return;
    const popularNames = availableSurcharges.filter((s) => s.isPopularDefault).map((s) => s.name);
    onChangeSelectedSurcharges(popularNames);
  };

  const handleSelectAll = () => {
    if (!onChangeSelectedSurcharges) return;
    onChangeSelectedSurcharges(availableSurcharges.map((s) => s.name));
  };

  const handleClearAll = () => {
    if (!onChangeSelectedSurcharges) return;
    onChangeSelectedSurcharges([]);
  };

  // Group surcharges by categoryLabel
  const groupedSurcharges: { [key: string]: SurchargeItemDef[] } = {};
  availableSurcharges.forEach((item) => {
    const cat = item.categoryLabel || 'Phụ Phí Khác';
    if (!groupedSurcharges[cat]) {
      groupedSurcharges[cat] = [];
    }
    groupedSurcharges[cat].push(item);
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Quotation Scope Selection Header */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div>
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Phạm Vi Báo Giá & Phụ Phí (Quotation Scope) <span className="text-red-500">*</span>
          </span>
        </div>

        {/* 2 Khối Nhỏ Gọn Lựa Chọn Phạm Vi Báo Giá */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Khối 1: ALL_IN */}
          <button
            type="button"
            onClick={() => onChangeQuotationScope('ALL_IN')}
            className={`p-3 sm:p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left flex items-center gap-3 select-none ${
              quotationScope === 'ALL_IN'
                ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-1 ring-indigo-500/20'
                : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-100/70 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                quotationScope === 'ALL_IN'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-500'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Báo Giá Trọn Gói (All-in Rate)
              </h4>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                Đơn giá tổng hợp duy nhất
              </span>
            </div>
          </button>

          {/* Khối 2: ITEMIZED */}
          <button
            type="button"
            onClick={() => onChangeQuotationScope('ITEMIZED')}
            className={`p-3 sm:p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left flex items-center gap-3 select-none ${
              quotationScope === 'ITEMIZED'
                ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-1 ring-indigo-500/20'
                : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-100/70 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                quotationScope === 'ITEMIZED'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-500'
              }`}
            >
              <Receipt className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Báo Giá Bóc Tách (Itemized Breakdown)
              </h4>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                Tách bạch cước chính & phụ phí
              </span>
            </div>
          </button>
        </div>

        {/* Dynamic Area based on Quotation Scope */}
        {quotationScope === 'ALL_IN' ? (
          /* ALL_IN BANNER */
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900 animate-in fade-in duration-150">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-emerald-950 text-xs">
                Chế độ Báo Giá Trọn Gói (All-in Rate) đã được chọn
              </div>
              <p className="text-emerald-800 leading-relaxed text-[11.5px]">
                Nhà cung cấp sẽ chịu trách nhiệm tính toán và bao trọn toàn bộ chi phí hành trình vào đơn giá cuối cùng. Khi gửi báo giá, nhà cung cấp sẽ tự kê khai danh sách phụ phí đi kèm tương ứng để bạn nắm rõ. Bạn không cần chọn từng phụ phí.
              </p>
            </div>
          </div>
        ) : quotationScope === 'ITEMIZED' ? (
          /* ITEMIZED SURCHARGES SELECTION BLOCK */
          <div className="space-y-3.5 pt-2 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
              <div>
                <span className="text-xs font-bold text-indigo-950">
                  Danh Mục Phụ Phí Yêu Cầu Bóc Tách ({serviceType}) <span className="text-red-500">*</span>
                </span>
                <span className="text-[10.5px] text-indigo-700 block mt-0.5">
                  Đã chọn <strong>{selectedSurcharges.length}</strong> / {availableSurcharges.length} phụ phí yêu cầu nhà cung cấp báo giá riêng
                </span>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSelectPopular}
                  className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-2xs cursor-pointer transition-all active:scale-95"
                >
                  Chọn Phổ Biến
                </button>
              </div>
            </div>

            {/* Surcharge Groups */}
            <div className="space-y-3">
              {Object.entries(groupedSurcharges).map(([category, items]) => (
                <div key={category} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                    • {category} ({items.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {items.map((item) => {
                      const isChecked = selectedSurcharges.includes(item.name);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleSurcharge(item.name)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            isChecked
                              ? 'border-indigo-600 bg-indigo-50/80 shadow-2xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by container onClick
                            className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className={`font-bold leading-tight ${isChecked ? 'text-indigo-950' : 'text-slate-800'}`}>
                                {item.name}
                              </span>
                              <span className="text-[9px] font-black px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded shrink-0 border border-slate-200">
                                LOV
                              </span>
                            </div>
                            {item.desc && (
                              <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Surcharges Notes & Specific Requirements */}
        {onChangeSurchargesNotes && (
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ghi Chú & Thỏa Thuận Phụ Phí Cụ Thể (Nếu có)</span>
            </label>
            <input
              type="text"
              value={surchargesNotes}
              onChange={(e) => onChangeSurchargesNotes(e.target.value)}
              placeholder="VD: Yêu cầu cố định phụ phí trong 6 tháng, miễn phí 21 ngày Dem/Det cảng đích, miễn phí lưu ca 24h..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium text-slate-900 transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
};
