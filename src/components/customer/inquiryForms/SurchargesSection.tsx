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
    isPopularDefault: true,
  },
];

interface SurchargesSectionProps {
  serviceType: ServiceType;
  warehouseType?: string;
  cargoClassification?: string;
  quotationScope?: QuotationScope | '';
  onChangeQuotationScope: (scope: QuotationScope) => void;
  selectedSurcharges: string[];
  onChangeSelectedSurcharges: (surcharges: string[]) => void;
  surchargesNotes?: string;
  onChangeSurchargesNotes?: (notes: string) => void;
  themeColor?: 'blue' | 'cyan' | 'teal' | 'sky' | 'emerald' | 'purple' | 'amber' | 'orange' | 'indigo';
}

export const SurchargesSection: React.FC<SurchargesSectionProps> = ({
  serviceType,
  warehouseType,
  cargoClassification,
  quotationScope = 'ALL_IN',
  onChangeQuotationScope,
  selectedSurcharges = [],
  onChangeSelectedSurcharges,
  surchargesNotes = '',
  onChangeSurchargesNotes,
  themeColor = 'indigo',
}) => {
  // Determine relevant surcharges list based on serviceType
  const getSurchargesList = (): SurchargeItemDef[] => {
    switch (serviceType) {
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return OCEAN_SURCHARGES;
      case 'Trucking':
        return TRUCKING_SURCHARGES;
      case 'Air Freight':
        return AIR_SURCHARGES;
      case 'Rail Freight':
        return RAIL_SURCHARGES;
      case 'Customs Clearance':
        return CUSTOMS_SURCHARGES;
      case 'Warehousing': {
        if (warehouseType === 'Kho tự quản (Self-Storage)') {
          return SELF_STORAGE_SURCHARGES;
        }
        if (warehouseType === 'Kho TMĐT / Fulfillment') {
          return ECOMMERCE_WAREHOUSE_SURCHARGES;
        }
        if (warehouseType === 'Kho lạnh / Kho mát (Cold Storage)' || cargoClassification === 'Reefer') {
          return COLD_WAREHOUSE_SURCHARGES;
        }
        if (warehouseType === 'Kho hàng nguy hiểm (DG Warehouse)' || cargoClassification === 'Hazmat') {
          return DG_WAREHOUSE_SURCHARGES;
        }
        if (warehouseType === 'Kho ngoại quan (Bonded)') {
          return BONDED_WAREHOUSE_SURCHARGES;
        }
        return DRY_WAREHOUSE_SURCHARGES;
      }
      default:
        return [
          ...TRUCKING_SURCHARGES.slice(0, 3),
          ...GENERAL_LOGISTICS_SURCHARGES,
        ];
    }
  };

  const surchargesList = getSurchargesList();

  // Group surcharges by category
  const categories = Array.from(new Set(surchargesList.map((item) => item.categoryLabel)));

  const handleToggleSurcharge = (name: string) => {
    if (selectedSurcharges.includes(name)) {
      onChangeSelectedSurcharges(selectedSurcharges.filter((s) => s !== name));
    } else {
      onChangeSelectedSurcharges([...selectedSurcharges, name]);
    }
  };

  const handleSelectPopularDefaults = () => {
    const populars = surchargesList.filter((item) => item.isPopularDefault).map((item) => item.name);
    onChangeSelectedSurcharges(populars);
  };

  const handleSelectAll = () => {
    const all = surchargesList.map((item) => item.name);
    onChangeSelectedSurcharges(all);
  };

  const handleClearAll = () => {
    onChangeSelectedSurcharges([]);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Surcharges Checklist Box */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Danh Mục Phụ Phí Yêu Cầu Báo Giá ({selectedSurcharges.length}/{surchargesList.length})</span>
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {serviceType === 'Warehousing'
                ? 'Tích chọn các loại phụ phí mà bạn muốn đơn vị vận hành kho bãi phải bao gồm hoặc làm rõ trong bảng báo giá.'
                : 'Tích chọn các loại phụ phí mà bạn muốn nhà vận tải phải bao gồm hoặc làm rõ trong bảng báo giá.'}
            </span>
          </div>

          {/* Quick Action Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleSelectPopularDefaults}
              className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              title="Chọn nhanh các phụ phí bắt buộc phổ biến nhất"
            >
              <Zap className="w-3 h-3 text-amber-600" />
              <span>Gói Chuẩn Phổ Biến</span>
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Chọn Tất Cả
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        {/* Grouped Category Surcharges */}
        <div className="space-y-4">
          {categories.map((categoryLabel) => {
            const categoryItems = surchargesList.filter((item) => item.categoryLabel === categoryLabel);
            return (
              <div key={categoryLabel} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase text-indigo-900 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                    {categoryLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({categoryItems.filter((i) => selectedSurcharges.includes(i.name)).length}/{categoryItems.length} đã chọn)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {categoryItems.map((item) => {
                    const isChecked = selectedSurcharges.includes(item.name);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleSurcharge(item.name)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-500/20 text-indigo-950'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/60 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by parent div
                          className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-xs font-bold leading-snug">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                              {item.code}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Surcharges Notes */}
        {onChangeSurchargesNotes && (
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ghi Chú Hoặc Yêu Cầu Phụ Phí Bổ Sung Khác (Nếu có):</span>
            </label>
            <input
              type="text"
              value={surchargesNotes}
              onChange={(e) => onChangeSurchargesNotes(e.target.value)}
              placeholder="VD: Yêu cầu cố định phụ phí THC trong 6 tháng, miễn phí 21 ngày Dem/Det cảng đích..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium text-slate-900"
            />
          </div>
        )}
      </div>
    </div>
  );
};
