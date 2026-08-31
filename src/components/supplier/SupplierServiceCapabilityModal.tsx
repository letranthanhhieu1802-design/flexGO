import React, { useState } from 'react';
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
  MapPin,
  DollarSign,
  ShieldCheck,
  Package
} from 'lucide-react';
import { ServiceType, SalesSpecialistProfile } from '../../types';

export interface ServiceNodeDef {
  id: string;
  name: string;
  category: ServiceType;
  cargoGroup: 'Hàng thường' | 'Hàng lạnh' | 'Hàng nguy hiểm';
  model?: string;
  defaultTitle: string;
  defaultFleet: string;
  defaultRoutes: string;
  defaultSla: string;
  defaultPrice: number;
  defaultUnit: string;
  defaultVas: string[];
}

// Full 8 Service Categories Structure with exact strict constraints
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
      defaultRoutes: string;
      defaultSla: string;
      defaultPrice: number;
      defaultUnit: string;
      defaultVas: string[];
    }[];
  }[];
}

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
            defaultRoutes: 'Tuyến Bắc Nam, TP.HCM ⇄ Miền Tây, Đà Nẵng, KCN Bình Dương',
            defaultSla: '48 - 60 giờ (Tuyến Bắc Nam)',
            defaultPrice: 28500000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Bốc xếp 2 đầu kho', 'Định vị GPS Real-time', 'Hạ bửng nâng thủy lực', 'Thu hồi POD gốc 24h'],
          },
          {
            id: 'trk-gen-ltl',
            name: 'LTL (Ghép hàng lẻ)',
            code: 'LTL',
            defaultFleet: 'Đội xe trung chuyển nội đô & Hub phân loại',
            defaultRoutes: 'Hà Nội ⇄ TP.HCM, Đà Nẵng, Hải Phòng',
            defaultSla: '3 - 4 ngày',
            defaultPrice: 1650,
            defaultUnit: 'Kg',
            defaultVas: ['Giao nhận Door-to-Door', 'Đóng gói màng co/kiện gỗ', 'Thu hộ COD'],
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
            defaultFleet: '20 xe đông lạnh chuyên dụng (2.5T - 15T, Thermo King kép)',
            defaultRoutes: 'Đà Lạt ⇄ TP.HCM, Miền Tây ⇄ Hà Nội, Cửa khẩu',
            defaultSla: '18 - 24 giờ (Tuyến chuyên biệt)',
            defaultPrice: 9500000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Pre-cooling trước 60 phút', 'IoT Cảm biến nhiệt Real-time', 'Clip-on Genset liên tục'],
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
            defaultFleet: 'Xe tải trang bị PCCC & Giấy phép vận chuyển hóa chất/DG',
            defaultRoutes: 'KCN Đồng Nai, Bà Rịa Vũng Tàu ⇄ TP.HCM, Hải Phòng',
            defaultSla: '24 - 36 giờ',
            defaultPrice: 32000000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Tài xế chứng chỉ DG/PCCC', 'Bộ ứng cứu sự cố hóa chất Spill-Kit', 'Giấy phép lưu hành'],
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
            defaultFleet: 'Hợp đồng Service Contract trực tiếp với Maersk, ONE, COSCO, MSC',
            defaultRoutes: 'Cát Lái, Hải Phòng ⇄ Intra-Asia, US West Coast, Châu Âu',
            defaultSla: '12 - 28 ngày tùy tuyến',
            defaultPrice: 2450,
            defaultUnit: 'Cont 40HC (USD)',
            defaultVas: ['Free Dem/Det 14-21 ngày', 'Bảo hiểm hàng hải loại A', 'Lashing chằng buộc cont'],
          },
          {
            id: 'sea-gen-lcl',
            name: 'LCL (Hàng lẻ đóng ghép CFS)',
            code: 'LCL',
            defaultFleet: 'Hệ thống kho CFS gom hàng tại Cát Lái, Tân Cảng, Đình Vũ',
            defaultRoutes: 'Hồ Chí Minh, Hải Phòng ⇄ Singapore, Tokyo, Busan, Los Angeles',
            defaultSla: '14 - 30 ngày',
            defaultPrice: 35,
            defaultUnit: 'CBM (USD)',
            defaultVas: ['Đóng màng co Pallet', 'Khai báo manifest an ninh', 'Vận đơn điện tử e-BL'],
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
            defaultFleet: 'Booking cont lạnh Reefer (-25°C đến +15°C) cắm điện suốt hải trình',
            defaultRoutes: 'Hải Phòng, Cát Lái ⇄ Trung Quốc, Nhật Bản, Mỹ, EU',
            defaultSla: '10 - 25 ngày',
            defaultPrice: 3850,
            defaultUnit: 'Cont 40RF (USD)',
            defaultVas: ['PTI Test kiểm tra giàn lạnh', 'Cảm biến giám sát nhiệt độ Data Logger', 'Kiểm dịch thực vật'],
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
            defaultFleet: 'Slot vận chuyển cont IMO Class 3, 6.1, 8, 9 với các hãng tàu quốc tế',
            defaultRoutes: 'Hồ Chí Minh, Cái Mép ⇄ Singapore, Rotterdam, Thượng Hải',
            defaultSla: '15 - 32 ngày',
            defaultPrice: 4200,
            defaultUnit: 'Cont 20/40 (USD)',
            defaultVas: ['Duyệt MSDS với Hãng tàu', 'Dán nhãn nguy hiểm IMO', 'Lashing chống dịch chuyển'],
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
            defaultFleet: 'Hợp đồng Block Space Agreement (BSA) với Vietnam Airlines, Singapore Airlines, EVA Air',
            defaultRoutes: 'SGN, HAN ⇄ NRT (Tokyo), ICN (Seoul), FRA (Frankfurt), LAX (Mỹ)',
            defaultSla: '2 - 4 ngày',
            defaultPrice: 88000,
            defaultUnit: 'Kg',
            defaultVas: ['Soi chiếu an ninh ưu tiên ULD', 'Đóng gói thùng carton IATA', 'Door-to-Airport cấp tốc'],
          },
          {
            id: 'air-gen-exp',
            name: 'Express (Hỏa tốc / Chuyển phát nhanh)',
            code: 'Express',
            defaultFleet: 'Đại lý cấp 1 DHL Express, FedEx, UPS',
            defaultRoutes: 'Toàn cầu 220+ quốc gia và vùng lãnh thổ',
            defaultSla: '24 - 48 giờ',
            defaultPrice: 320000,
            defaultUnit: 'Kg',
            defaultVas: ['Thông quan khẩn cấp hàng mẫu AOG', 'Phát hành HAWB điện tử', 'Hand-Carry áp tải VIP'],
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
            defaultFleet: 'Thùng giữ nhiệt Envirotainer / Va-Q-tec, đá khô & Gel lạnh chuyên dụng',
            defaultRoutes: 'SGN, HAN ⇄ Châu Âu, Mỹ, Nhật Bản',
            defaultSla: '24 - 48 giờ',
            defaultPrice: 145000,
            defaultUnit: 'Kg',
            defaultVas: ['Đóng đá khô & Màng giữ nhiệt', 'Giám sát nhiệt độ GDP', 'Thông quan ưu tiên line lạnh'],
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
            defaultFleet: 'Nhân sự có chứng chỉ IATA Dangerous Goods Regulations certified',
            defaultRoutes: 'SGN, HAN ⇄ Châu Á, Châu Âu, Mỹ',
            defaultSla: '2 - 3 ngày',
            defaultPrice: 175000,
            defaultUnit: 'Kg',
            defaultVas: ['Khai báo Shipper Declaration DG', 'Bao bì chuẩn UN certified', 'Dán nhãn IATA Class'],
          },
        ],
      },
    ],
  },
  {
    id: 'rail',
    name: 'Đường sắt (Rail Freight)',
    serviceType: 'Trucking', // Mapping to Rail
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
            defaultFleet: 'Đoàn tàu chuyên tuyến Bắc - Nam & Ga Sóng Thần, Yên Viên, Đồng Đăng',
            defaultRoutes: 'Ga Sóng Thần (Bình Dương) ⇄ Ga Giáp Bát / Yên Viên (Hà Nội)',
            defaultSla: '65 - 72 giờ',
            defaultPrice: 21000000,
            defaultUnit: 'Container 40ft',
            defaultVas: ['Cẩu hạ container 2 đầu ga', 'Chằng buộc lashing toa xe', 'Kẹp chì an ninh đường sắt'],
          },
          {
            id: 'rail-gen-lcl',
            name: 'LCL (Hàng lẻ đóng ghép Ga-Ga)',
            code: 'LCL',
            defaultFleet: 'Toa xe hàng kín ghép hàng liên tỉnh',
            defaultRoutes: 'Hồ Chí Minh ⇄ Nha Trang, Đà Nẵng, Vinh, Hà Nội',
            defaultSla: '4 - 5 ngày',
            defaultPrice: 1100,
            defaultUnit: 'Kg',
            defaultVas: ['Bốc xếp tại kho bãi ga', 'Vận chuyển First-mile / Last-mile tận kho'],
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
            defaultFleet: 'Container tự hành chạy máy phát điện suốt hành trình Bắc - Nam',
            defaultRoutes: 'Bình Dương, Đồng Nai ⇄ Ga Đồng Đăng (Lạng Sơn), Hà Nội',
            defaultSla: '72 giờ',
            defaultPrice: 34000000,
            defaultUnit: 'Cont 40RF',
            defaultVas: ['Cấp điện liên tục trên toa', 'Kiểm tra nhiệt độ từng chặng ga', 'Thông quan liên vận quốc tế'],
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
            defaultFleet: 'Toa xe chuyên dụng cách ly an toàn theo quy chuẩn Đường sắt VN',
            defaultRoutes: 'Khu công nghiệp miền Nam ⇄ Miền Bắc',
            defaultSla: '4 - 5 ngày',
            defaultPrice: 38000000,
            defaultUnit: 'Container 40ft',
            defaultVas: ['Khai báo hóa chất đường sắt', 'Áp tải kỹ thuật an toàn'],
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
            defaultFleet: 'Hệ thống kho 15,000m² tại KCN Sóng Thần, VSIP, KCN Tân Bình',
            defaultRoutes: 'TP.HCM, Bình Dương, Bắc Ninh, Đồng Nai',
            defaultSla: 'Xuất nhập hàng trong 2 - 4 giờ',
            defaultPrice: 95000,
            defaultUnit: 'm² / Tháng',
            defaultVas: ['Dán tem phụ tiếng Việt', 'Quấn màng co PE', 'Bảo hiểm cháy nổ kho bãi 100%'],
          },
          {
            id: 'wh-gen-bon',
            name: 'Kho ngoại quan (Bonded Warehouse)',
            code: 'Kho ngoại quan',
            defaultFleet: 'Kho ngoại quan đạt chuẩn hải quan gần cảng Cát Lái & Đình Vũ',
            defaultRoutes: 'Cảng Cát Lái, Cảng Đình Vũ, Sân bay Nội Bài',
            defaultSla: 'Thủ tục hải quan kho ngoại quan trong 24h',
            defaultPrice: 140000,
            defaultUnit: 'm² / Tháng',
            defaultVas: ['Khai báo hải quan ngoại quan', 'Hun trùng kiểm dịch ISPM 15', 'Tách ghép hàng xuất khẩu'],
          },
          {
            id: 'wh-gen-ful',
            name: 'Kho TMĐT / Fulfillment',
            code: 'Kho Fulfillment',
            defaultFleet: 'Kho fulfillment trang bị băng chuyền nhặt hàng & phần mềm WMS Real-time',
            defaultRoutes: 'Trung tâm TP.HCM & Hà Nội',
            defaultSla: 'Đóng gói và giao đơn TMĐT trong 12 giờ',
            defaultPrice: 8500,
            defaultUnit: 'Đơn hàng / SKU',
            defaultVas: ['Xử lý hàng đổi trả TMĐT', 'Chèn thiệp cảm ơn & Quà tặng', 'Đóng gói Kitting combo'],
          },
          {
            id: 'wh-gen-self',
            name: 'Kho tự quản (Self-Storage)',
            code: 'Kho tự quản',
            defaultFleet: 'Khoang mini tự quản cá nhân và doanh nghiệp có khóa số & camera 24/7',
            defaultRoutes: 'Quận 7, TP. Thủ Đức (TP.HCM), Cầu Giấy (Hà Nội)',
            defaultSla: 'Truy cập 24/7 linh hoạt',
            defaultPrice: 450000,
            defaultUnit: 'm³ / Tháng',
            defaultVas: ['Bảo hiểm tài sản khoang tự quản', 'Vật tư đóng gói tại chỗ'],
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
            defaultFleet: 'Kho lạnh đa nhiệt độ (-25°C đến +15°C) sức chứa 8,000 Pallets',
            defaultRoutes: 'Bình Dương, Long An, Hưng Yên',
            defaultSla: 'Quản lý FIFO / FEFO hạn sử dụng chuẩn xác',
            defaultPrice: 22000,
            defaultUnit: 'Pallet / Ngày',
            defaultVas: ['Cấp đông nhanh Pre-cooling', 'Kiểm soát nhiệt độ IoT 24/7', 'Báo cáo tồn kho Real-time'],
          },
          {
            id: 'wh-ref-bon',
            name: 'Kho ngoại quan (Bonded Cold)',
            code: 'Kho ngoại quan lạnh',
            defaultFleet: 'Kho ngoại quan lạnh chuyên dụng gần cảng biển',
            defaultRoutes: 'Cảng Cát Lái, Cảng Hải Phòng',
            defaultSla: 'Thủ tục ngoại quan & kiểm dịch 24h',
            defaultPrice: 28000,
            defaultUnit: 'Pallet / Ngày',
            defaultVas: ['Kiểm dịch động thực vật', 'Thủ tục hải quan tạm nhập tái xuất'],
          },
          {
            id: 'wh-ref-self',
            name: 'Kho tự quản (Self-Storage Lạnh)',
            code: 'Khoang lạnh tự quản',
            defaultFleet: 'Khoang mini trữ lạnh cá nhân (-18°C đến +5°C)',
            defaultRoutes: 'TP.HCM & Hà Nội',
            defaultSla: 'Ra vào tự do 24/7',
            defaultPrice: 850000,
            defaultUnit: 'm³ / Tháng',
            defaultVas: ['Khóa từ độc lập', 'Backup điện máy phát tự động'],
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
            defaultFleet: 'Kho chứa hóa chất chuyên dụng PCCC tự động bọt Foam & giấy phép liên bộ',
            defaultRoutes: 'KCN Nhơn Trạch (Đồng Nai), KCN Đình Vũ (Hải Phòng)',
            defaultSla: 'Quy trình lưu trữ an toàn nghiêm ngặt',
            defaultPrice: 180000,
            defaultUnit: 'm² / Tháng',
            defaultVas: ['Rãnh thu gom hóa chất rò rỉ', 'Hệ thống thông gió chống nổ', 'Bảo hiểm trách nhiệm DG'],
          },
          {
            id: 'wh-haz-bon',
            name: 'Kho ngoại quan (Bonded Hazmat)',
            code: 'Ngoại quan hóa chất',
            defaultFleet: 'Kho ngoại quan chuyên dụng cho nguyên liệu hóa chất, hạt nhựa nhập khẩu',
            defaultRoutes: 'Hải Phòng, Bà Rịa - Vũng Tàu',
            defaultSla: 'Khai báo hóa chất ngoại quan trong ngày',
            defaultPrice: 220000,
            defaultUnit: 'm² / Tháng',
            defaultVas: ['Giám định chất lượng hóa chất', 'Khai báo hóa chất trên Cổng thông tin một cửa'],
          },
          {
            id: 'wh-haz-self',
            name: 'Kho tự quản (Self-Storage Nguy hiểm)',
            code: 'Khoang nguy hiểm tự quản',
            defaultFleet: 'Khoang cách ly mini cho mẫu hóa chất thử nghiệm & vật liệu đặc thù',
            defaultRoutes: 'Khu công nghệ cao TP.HCM & Bắc Ninh',
            defaultSla: 'Kiểm soát ra vào vân tay',
            defaultPrice: 1200000,
            defaultUnit: 'Khoang / Tháng',
            defaultVas: ['Tủ an toàn chống cháy nổ', 'Cảm biến nồng độ khí rò rỉ'],
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
            defaultFleet: 'Đội ngũ khai báo hải quan có chứng chỉ Tổng cục Hải quan tại 18 chi cục',
            defaultRoutes: 'Chi cục HQ Cát Lái, Tân Cảng, Nội Bài, Tân Sơn Nhất, Đình Vũ, Hữu Nghị',
            defaultSla: 'Thông quan trong 4 - 8 giờ (Luồng Xanh/Vàng)',
            defaultPrice: 850000,
            defaultUnit: 'Tờ khai',
            defaultVas: ['Xin cấp C/O các form (Form D, E, EUR.1, VK...)', 'Tham vấn giá & Kiểm hóa hộ', 'Thủ tục hoàn thuế'],
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
            defaultFleet: 'Chuyên viên xử lý thủ tục kiểm tra chuyên ngành nông thủy sản, thực phẩm tươi',
            defaultRoutes: 'Chi cục kiểm dịch vùng II (Hải Phòng), vùng VI (TP.HCM)',
            defaultSla: 'Lấy mẫu & có kết quả trong 24 - 48 giờ',
            defaultPrice: 1450000,
            defaultUnit: 'Lô hàng',
            defaultVas: ['Đăng ký kiểm dịch trực tuyến', 'Đưa hàng về kho bảo quản chờ kết quả', 'Xin giấy phép ATTP'],
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
            defaultRoutes: 'Các cửa khẩu quốc tế đường biển, hàng không, đường bộ',
            defaultSla: '24 - 48 giờ',
            defaultPrice: 2200000,
            defaultUnit: 'Tờ khai / Giấy phép',
            defaultVas: ['Thẩm định bảng MSDS', 'Khai báo hóa chất một cửa quốc gia', 'Xin giấy phép tiền chất'],
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
            defaultFleet: 'Xe liên vận quốc tế giấy phép GMS & sang tải tại cặp cửa khẩu',
            defaultRoutes: 'Hà Nội ⇄ Bằng Tường / Đông Hưng (TQ), TP.HCM ⇄ Phnom Penh (Campuchia)',
            defaultSla: '36 - 48 giờ',
            defaultPrice: 42000000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Thủ tục hải quan 2 đầu biên giới', 'Sang tải sang xe đối tác nước ngoài', 'Bảo hiểm hàng hóa quốc tế'],
          },
          {
            id: 'cb-gen-ltl',
            name: 'LTL (Ghép hàng lẻ xuyên biên giới)',
            code: 'LTL',
            defaultFleet: 'Tuyến xe gom hàng lẻ định kỳ hàng ngày đi Campuchia & Trung Quốc',
            defaultRoutes: 'TP.HCM ⇄ Phnom Penh, Hà Nội ⇄ Quảng Châu',
            defaultSla: '2 - 4 ngày',
            defaultPrice: 3500,
            defaultUnit: 'Kg',
            defaultVas: ['Giao hàng Door-to-Door', 'Thu hộ tiền hàng tại Phnom Penh', 'Dán tem nhãn tiếng bản địa'],
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
            defaultFleet: 'Xe lạnh liên vận chạy thẳng qua cửa khẩu Hữu Nghị, Tân Thanh, Mộc Bài',
            defaultRoutes: 'Nông sản miền Nam / Tây Nguyên ⇄ Chợ đầu mối Trung Quốc',
            defaultSla: '48 - 60 giờ',
            defaultPrice: 65000000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Thông quan nhanh làn xanh nông sản', 'Theo dõi nhiệt độ thùng xe real-time'],
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
            defaultRoutes: 'Việt Nam ⇄ Lào, Campuchia, Trung Quốc',
            defaultSla: '3 - 5 ngày',
            defaultPrice: 75000000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Giấy phép vận chuyển quá cảnh liên quốc gia', 'Hộ tống an toàn qua cửa khẩu'],
          },
        ],
      },
    ],
  },
  {
    id: 'project',
    name: 'Dịch vụ dự án & Tích hợp (Project Cargo)',
    serviceType: 'Trucking', // Project mapping
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
            defaultRoutes: 'Trung tâm phân phối (DC) ⇄ 63 tỉnh thành',
            defaultSla: 'Theo lịch phân phối định kỳ',
            defaultPrice: 18000000,
            defaultUnit: 'Gói / Tuyến',
            defaultVas: ['Báo cáo KPI giao nhận hàng ngày', 'Quản lý thu hồi vỏ pallet', 'Bảo hiểm tổng thể'],
          },
          {
            id: 'proj-gen-xdock',
            name: 'Cross-dock (X-Dock)',
            code: 'Cross-dock',
            defaultFleet: 'Sàn trung chuyển cross-docking không lưu kho, phân luồng xuất bến ngay',
            defaultRoutes: 'Hub trung chuyển miền Bắc & miền Nam',
            defaultSla: 'Xử lý sang xe trong vòng 4 - 6 giờ',
            defaultPrice: 85000,
            defaultUnit: 'Tấn',
            defaultVas: ['Phân loại mã SKU nhanh', 'Quét barcode tự động'],
          },
          {
            id: 'proj-gen-port',
            name: 'Cảng (Port Logistics)',
            code: 'Port Logistics',
            defaultFleet: 'Hạ tầng bến bãi, sà lan & xe đầu kéo rút hàng tại các cụm cảng nước sâu',
            defaultRoutes: 'Cụm cảng Cái Mép - Thị Vải, Cát Lái, Lạch Huyện',
            defaultSla: 'Rút hàng và giải phóng cont trong 12h',
            defaultPrice: 3200000,
            defaultUnit: 'Cont',
            defaultVas: ['Nâng hạ cẩu bờ chuyên dụng', 'Bảo quản container bãi cảng'],
          },
          {
            id: 'proj-gen-multi',
            name: 'Đa phương thức (Multimodal)',
            code: 'Đa phương thức',
            defaultFleet: 'Giải pháp kết hợp Biển + Sắt + Bộ + Sông tối ưu 25% chi phí logistics',
            defaultRoutes: 'Tuyến Bắc Nam & Hành lang kinh tế Đông Tây',
            defaultSla: 'Cam kết tiến độ tổng thể',
            defaultPrice: 22500000,
            defaultUnit: 'Lô hàng',
            defaultVas: ['Quản lý chuỗi cung ứng trọn gói 4PL', 'Một vận đơn duy nhất xuyên suốt hành trình'],
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
            defaultRoutes: 'Kho DC Lạnh ⇄ Hệ thống siêu thị WinMart, Co.opmart, AEON',
            defaultSla: 'Giao hàng đúng khung giờ hẹn (Time-slot)',
            defaultPrice: 12500000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Bàn giao kiểm đếm nhiệt độ từng điểm', 'Biên bản nghiệm thu chất lượng hàng tươi'],
          },
          {
            id: 'proj-ref-xdock',
            name: 'Cross-dock (Cold X-Dock)',
            code: 'X-Dock Lạnh',
            defaultFleet: 'Sàn trung chuyển duy trì nhiệt độ mát (+10°C đến +15°C) chống sốc nhiệt',
            defaultRoutes: 'Kho trung tâm miền Nam ⇄ Xe tỏa đi các tỉnh',
            defaultSla: 'Sang xe lạnh trong 2 giờ',
            defaultPrice: 160000,
            defaultUnit: 'Tấn',
            defaultVas: ['Cảm biến nhiệt độ buồng đệm', 'Bảo quản đá gel bổ sung'],
          },
          {
            id: 'proj-ref-port',
            name: 'Cảng (Port Cold Logistics)',
            code: 'Cảng hàng lạnh',
            defaultFleet: 'Bãi cắm điện cont lạnh Reefer plug & xe kéo cont lạnh chuyên dụng',
            defaultRoutes: 'Cảng Cát Lái, Tân Cảng Hiệp Phước ⇄ Nhà máy chế biến thủy sản',
            defaultSla: 'Kéo cont lạnh về xưởng trong 6h sau khi dỡ tàu',
            defaultPrice: 4500000,
            defaultUnit: 'Cont 40RF',
            defaultVas: ['Cắm điện bãi cảng 24/7', 'Theo dõi nhiệt độ giàn lạnh Reefer liên tục'],
          },
          {
            id: 'proj-ref-multi',
            name: 'Đa phương thức (Cold Multimodal)',
            code: 'Đa phương thức lạnh',
            defaultFleet: 'Chuỗi logistics lạnh kết hợp Tàu biển lạnh + Đường sắt lạnh + Xe tải lạnh',
            defaultRoutes: 'Vùng nguyên liệu nông sản Tây Nam Bộ ⇄ Xuất khẩu Trung Quốc',
            defaultSla: 'Kiểm soát dải nhiệt độ khép kín 100%',
            defaultPrice: 48000000,
            defaultUnit: 'Container lạnh',
            defaultVas: ['Giám sát chuỗi lạnh Cold Chain 100% không đứt gãy', 'Bảo hiểm rủi ro mất nhiệt độ'],
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
            defaultRoutes: 'Kho hóa chất trung tâm ⇄ Các nhà máy tại KCN',
            defaultSla: 'Theo lịch an toàn',
            defaultPrice: 26000000,
            defaultUnit: 'Chuyến',
            defaultVas: ['Kẹp chì seal an toàn', 'Biên bản bàn giao hóa chất nghiêm ngặt'],
          },
          {
            id: 'proj-haz-xdock',
            name: 'Cross-dock (Hazmat X-Dock)',
            code: 'X-Dock Hóa chất',
            defaultFleet: 'Bãi sang tải ngoài trời đạt tiêu chuẩn cách ly an toàn hóa chất',
            defaultRoutes: 'Khu vực bãi trung chuyển chuyên biệt',
            defaultSla: '4 giờ',
            defaultPrice: 190000,
            defaultUnit: 'Tấn',
            defaultVas: ['Trang thiết bị ứng phó sự cố hóa chất', 'Đội ứng cứu phản ứng nhanh'],
          },
          {
            id: 'proj-haz-port',
            name: 'Cảng (Port Hazmat Logistics)',
            code: 'Cảng hóa chất',
            defaultFleet: 'Hạ tầng tiếp nhận và vận chuyển container nguy hiểm tại cảng biển',
            defaultRoutes: 'Cảng Cái Mép, Cảng Đình Vũ ⇄ Bồn chứa hóa chất chuyên dụng',
            defaultSla: 'Rút hàng giải phóng cont nguy hiểm theo giờ quy định',
            defaultPrice: 5800000,
            defaultUnit: 'Cont',
            defaultVas: ['Xe chữa cháy trực tại hiện trường', 'Thủ tục an ninh cảng vụ'],
          },
          {
            id: 'proj-haz-multi',
            name: 'Đa phương thức (Hazmat Multimodal)',
            code: 'Đa phương thức DG',
            defaultFleet: 'Vận chuyển hóa chất nguy hiểm kết hợp Biển + Đường sắt chuyên biệt',
            defaultRoutes: 'Nhà máy lọc hóa dầu ⇄ Các trạm phân phối toàn quốc',
            defaultSla: 'Đảm bảo hành lang an toàn tuyệt đối',
            defaultPrice: 55000000,
            defaultUnit: 'Lô hàng',
            defaultVas: ['Giấy phép vận chuyển liên tỉnh & liên bộ', 'Bảo hiểm bồi thường ô nhiễm môi trường'],
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
  // Tree expansion state: Map category id or cargo id to boolean
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
    // Pre-select some models or map from existingServices
    if (existingServices.length > 0) {
      existingServices.forEach((srv) => {
        // match by title or serviceType
        const matched = CAPABILITY_SERVICE_TREE.flatMap((c) =>
          c.cargoGroups.flatMap((g) => g.models)
        ).find((m) => m.name.includes(srv.title) || srv.title.includes(m.name) || m.code === srv.title);
        if (matched) {
          initial[matched.id] = true;
        }
      });
    } else {
      // Default initial selected
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

  // Custom Form Data per model: Map model.id -> FormData
  const [modelFormData, setModelFormData] = useState<Record<string, {
    fleet: string;
    routes: string;
    sla: string;
    price: number;
    currency: 'VND' | 'USD';
    unit: string;
    isAllInclusive: boolean;
    vatPercent: number;
    selectedVas: string[];
    customHighlight: string;
  }>>(() => {
    const initial: any = {};
    CAPABILITY_SERVICE_TREE.forEach((cat) => {
      cat.cargoGroups.forEach((cg) => {
        cg.models.forEach((m) => {
          initial[m.id] = {
            fleet: m.defaultFleet,
            routes: m.defaultRoutes,
            sla: m.defaultSla,
            price: m.defaultPrice,
            currency: m.defaultUnit.includes('USD') ? 'USD' : 'VND',
            unit: m.defaultUnit,
            isAllInclusive: true,
            vatPercent: 8,
            selectedVas: [...m.defaultVas],
            customHighlight: '',
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

  // Form Change Handler
  const updateCurrentFormData = (field: string, val: any) => {
    setModelFormData((prev) => ({
      ...prev,
      [activeModelId]: {
        ...prev[activeModelId],
        [field]: val,
      },
    }));
  };

  // Toggle VAS item
  const toggleVasItem = (vasName: string) => {
    const current = modelFormData[activeModelId]?.selectedVas || [];
    const updated = current.includes(vasName)
      ? current.filter((v) => v !== vasName)
      : [...current, vasName];
    updateCurrentFormData('selectedVas', updated);
  };

  // Handle Save All
  const handleSaveAll = () => {
    const declaredList: any[] = [];
    CAPABILITY_SERVICE_TREE.forEach((cat) => {
      cat.cargoGroups.forEach((cg) => {
        cg.models.forEach((m) => {
          if (selectedModelIds[m.id]) {
            const data = modelFormData[m.id];
            declaredList.push({
              id: `srv-${m.id}`,
              serviceType: cat.serviceType,
              title: `${cat.name.split(' (')[0]} - ${cg.name} - ${m.code}`,
              description: `Năng lực vận hành: ${data?.fleet || m.defaultFleet}. Tuyến thế mạnh: ${data?.routes || m.defaultRoutes}.`,
              highlight: data?.customHighlight || (data?.selectedVas?.length ? `Đã bao gồm: ${data.selectedVas.slice(0, 2).join(', ')}` : 'Cam kết SLA đúng hẹn'),
              suitableFor: `${cg.name} (${cat.name})`,
              slaCommitment: data?.sla || m.defaultSla,
              pricingSummary: `${(data?.price || m.defaultPrice).toLocaleString('vi-VN')} ${data?.currency || 'VND'} / ${data?.unit || m.defaultUnit}`,
              modelCode: m.code,
              cargoGroup: cg.name,
              categoryName: cat.name,
              vasList: data?.selectedVas || [],
            });
          }
        });
      });
    });

    onSave(declaredList);
    onClose();
  };

  const currentData = modelFormData[activeModelId] || {
    fleet: activeModel?.defaultFleet || '',
    routes: activeModel?.defaultRoutes || '',
    sla: activeModel?.defaultSla || '',
    price: activeModel?.defaultPrice || 0,
    currency: 'VND',
    unit: activeModel?.defaultUnit || 'Chuyến',
    isAllInclusive: true,
    vatPercent: 8,
    selectedVas: activeModel?.defaultVas || [],
    customHighlight: '',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-800"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl transition-all shadow-sm cursor-pointer"
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
            SPLIT VIEW BODY (Left: Tree, Right: Clean Form)
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[500px]">
          
          {/* 🌿 LEFT: CÂY DANH MỤC DỊCH VỤ (MASTER TREE) */}
          <div className="md:col-span-5 border-r border-slate-200 bg-slate-50/40 p-4 overflow-y-auto space-y-2 select-none">
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
                    className={`flex items-center justify-between p-2.5 hover:bg-slate-100/70 cursor-pointer transition-colors ${
                      catCheckedCount > 0 ? 'bg-indigo-50/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {isCatExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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

                      <IconComp className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                    </div>

                    {catCheckedCount > 0 && (
                      <span className="text-[10.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {catCheckedCount}/{allCatModels.length}
                      </span>
                    )}
                  </div>

                  {/* Level 2: Cargo Groups */}
                  {isCatExpanded && (
                    <div className="pl-6 pr-2 py-1.5 space-y-1.5 bg-slate-50/50 border-t border-slate-100">
                      {cat.cargoGroups.map((cg) => {
                        const isCgExpanded = Boolean(expandedCargoGroups[cg.id]);
                        const cgCheckedCount = cg.models.filter((m) => selectedModelIds[m.id]).length;
                        const isCgAllChecked = cgCheckedCount === cg.models.length && cg.models.length > 0;
                        const isCgIndeterminate = cgCheckedCount > 0 && !isCgAllChecked;

                        return (
                          <div key={cg.id} className="space-y-1">
                            {/* Cargo Group Header */}
                            <div 
                              onClick={() => toggleCargoGroup(cg.id)}
                              className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
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
                              <div className="pl-6 space-y-1">
                                {cg.models.map((m) => {
                                  const isSelected = Boolean(selectedModelIds[m.id]);
                                  const isActive = activeModelId === m.id;

                                  return (
                                    <div
                                      key={m.id}
                                      onClick={() => setActiveModelId(m.id)}
                                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                                        isActive
                                          ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                                          : isSelected
                                          ? 'bg-indigo-50 text-indigo-900 font-semibold hover:bg-indigo-100'
                                          : 'text-slate-600 hover:bg-slate-200/60'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
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

          {/* 📝 RIGHT: THÔNG TIN KHAI BÁO (DETAIL WORKSPACE) */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white">
            {activeModel ? (
              <div className="space-y-6">
                {/* Clean Title */}
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      Thông Tin Khai Báo ({activeCategory?.name.split(' (')[0]} - {activeCargoGroup?.name} - {activeModel.code || activeModel.name})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Điền thông số năng lực vận hành và mức giá tham chiếu chuẩn để hiển thị cho khách hàng.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModelCheck(activeModel.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      selectedModelIds[activeModel.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{selectedModelIds[activeModel.id] ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</span>
                  </button>
                </div>

                {/* 1️⃣ NĂNG LỰC CUNG ỨNG */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>1. Năng Lực Cung Ứng</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Quy mô phương tiện / Hạ tầng kỹ thuật
                      </label>
                      <input
                        type="text"
                        value={currentData.fleet}
                        onChange={(e) => updateCurrentFormData('fleet', e.target.value)}
                        placeholder="VD: 35 xe tải các loại (1.5T - 15T, Đầu kéo container)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Tuyến đường / Khu vực thế mạnh
                        </label>
                        <input
                          type="text"
                          value={currentData.routes}
                          onChange={(e) => updateCurrentFormData('routes', e.target.value)}
                          placeholder="VD: Tuyến Bắc Nam, TP.HCM ⇄ Miền Tây, Đà Nẵng"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Cam kết thời gian (SLA)
                        </label>
                        <input
                          type="text"
                          value={currentData.sla}
                          onChange={(e) => updateCurrentFormData('sla', e.target.value)}
                          placeholder="VD: 48 - 60 giờ (Tuyến Bắc Nam)"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2️⃣ ĐƠN GIÁ THAM CHIẾU */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>2. Đơn Giá Tham Chiếu</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-6">
                      <label className="block font-bold text-slate-700 mb-1">Mức giá đề xuất</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={currentData.price || ''}
                          onChange={(e) => updateCurrentFormData('price', parseFloat(e.target.value) || 0)}
                          placeholder="28500000"
                          className="w-full pl-3.5 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                        />
                        <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                          {currentData.currency}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-bold text-slate-700 mb-1">Tiền tệ</label>
                      <select
                        value={currentData.currency}
                        onChange={(e) => updateCurrentFormData('currency', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-hidden focus:border-indigo-500"
                      >
                        <option value="VND">₫ (VND)</option>
                        <option value="USD">$ (USD)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-bold text-slate-700 mb-1">Đơn vị tính</label>
                      <input
                        type="text"
                        value={currentData.unit}
                        onChange={(e) => updateCurrentFormData('unit', e.target.value)}
                        placeholder="Chuyến"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isAllInclusive"
                          checked={currentData.isAllInclusive}
                          onChange={() => updateCurrentFormData('isAllInclusive', true)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="font-semibold text-slate-700">Đã gồm trọn gói All-in</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isAllInclusive"
                          checked={!currentData.isAllInclusive}
                          onChange={() => updateCurrentFormData('isAllInclusive', false)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="font-semibold text-slate-700">Chưa gồm phụ phí</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">Thuế VAT:</span>
                      <select
                        value={currentData.vatPercent}
                        onChange={(e) => updateCurrentFormData('vatPercent', parseInt(e.target.value))}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={8}>8%</option>
                        <option value={10}>10%</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3️⃣ DỊCH VỤ ĐI KÈM (VAS) */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>3. Dịch Vụ Đi Kèm</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeModel.defaultVas.map((vas: string, idx: number) => {
                      const isChecked = currentData.selectedVas?.includes(vas);
                      return (
                        <label
                          key={idx}
                          onClick={() => toggleVasItem(vas)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-indigo-50/50 border-indigo-300 text-indigo-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{vas}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
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
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                  >
                    Xác Nhận Dịch Vụ Này
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
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
    </div>
  );
};
