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
  Package,
  Plus,
  Trash2,
  Flame,
  Percent,
  Tag
} from 'lucide-react';
import { ServiceType } from '../../types';

export interface CapabilityRouteItem {
  id: string;
  route: string;
  origin: string;
  destination: string;
  vehicleType: string;
  pricingUnit: string;
  price: number;
  currency: 'VND' | 'USD';
  sla: string;
  pricingStyle: 'All-in' | 'Chưa gồm phụ phí';
  promotionPercent: number; // 0 - 50%
}

export interface PaidSurchargeItem {
  id: string;
  name: string;
  priceText: string;
  isChecked: boolean;
}

export interface ModelCapabilityFormData {
  fleet: string;
  operationCapacity: string;
  serviceCommitment: string;
  routes: CapabilityRouteItem[];
  freeSurcharges: string[];
  paidSurcharges: PaidSurchargeItem[];
  selectedVas: string[];
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

// 8 Service Categories with Rich Preset Data
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
            unitLov: ['Chuyến', 'Tấn', 'CBM', 'Cont 40ft'],
            defaultRoutes: [
              {
                id: 'r-1',
                route: 'HCM ⇄ Hà Nội',
                origin: 'KCN Tân Bình (TP.HCM)',
                destination: 'KCN Thăng Long (Hà Nội)',
                vehicleType: 'Xe tải 15T thùng kín',
                pricingUnit: 'Chuyến',
                price: 28500000,
                currency: 'VND',
                sla: '48 - 60 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 15,
              },
              {
                id: 'r-2',
                route: 'HCM ⇄ Đà Nẵng',
                origin: 'KCN Sóng Thần (Bình Dương)',
                destination: 'KCN Hòa Khánh (Đà Nẵng)',
                vehicleType: 'Xe tải 8T thùng kín',
                pricingUnit: 'Chuyến',
                price: 16500000,
                currency: 'VND',
                sla: '24 - 36 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
              {
                id: 'r-3',
                route: 'HCM ⇄ Nha Trang',
                origin: 'Bình Tân (TP.HCM)',
                destination: 'Cam Ranh (Khánh Hòa)',
                vehicleType: 'Xe tải 5T thùng kín',
                pricingUnit: 'Chuyến',
                price: 7800000,
                currency: 'VND',
                sla: '10 - 12 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 20,
              },
            ],
            freeSurchargeOptions: [
              'Định vị GPS Real-time & Share Link',
              'Niêm phong chì Seal an ninh & Ảnh đối soát',
              'Thu hồi POD bản gốc trong 24h-48h',
              'Bảo hiểm trách nhiệm dân sự bắt buộc',
              'Hỗ trợ theo dõi hành trình 24/7',
            ],
            defaultFreeSurcharges: [
              'Định vị GPS Real-time & Share Link',
              'Niêm phong chì Seal an ninh & Ảnh đối soát',
              'Thu hồi POD bản gốc trong 24h-48h',
            ],
            paidSurchargeOptions: [
              { id: 'p-1', name: 'Phí lưu đêm / chờ bốc xếp quá giờ', priceText: '500,000 ₫ / Đêm', isChecked: true },
              { id: 'p-2', name: 'Giấy phép vào phố giờ cấm tải', priceText: '350,000 ₫ / Giấy phép', isChecked: true },
              { id: 'p-3', name: 'Hạ bửng nâng thủy lực', priceText: '200,000 ₫ / Điểm', isChecked: false },
              { id: 'p-4', name: 'Cẩu tự hành bốc dỡ', priceText: '1,500,000 ₫ / Ca', isChecked: false },
            ],
            vasOptions: [
              'Bốc xếp nhân công 2 đầu kho',
              'Chèn lót túi khí & Chằng buộc lashing',
              'Đóng gói màng co PE / Pallet',
              'Dịch vụ thu hộ tiền hàng COD',
              'Bảo hiểm trách nhiệm hàng hóa 100%',
              'Đóng thùng gỗ / Khung sắt bảo vệ',
            ],
            defaultVas: [
              'Bốc xếp nhân công 2 đầu kho',
              'Chèn lót túi khí & Chằng buộc lashing',
              'Bảo hiểm trách nhiệm hàng hóa 100%',
            ],
          },
          {
            id: 'trk-gen-ltl',
            name: 'LTL (Ghép hàng lẻ)',
            code: 'LTL',
            defaultFleet: 'Đội xe trung chuyển nội đô & Hub gom hàng liên tỉnh',
            defaultOperation: 'Gom hàng xuất bến mỗi ngày lúc 20:00, mạng lưới phân phối đa điểm',
            defaultCommitment: 'Giao hàng đúng hẹn 99%, đối soát e-POD chụp ảnh trong 12h',
            vehicleLov: ['Xe tải 1.5T', 'Xe tải 2.5T', 'Xe tải 5.0T', 'Hub gom hàng lẻ'],
            unitLov: ['Kg', 'CBM', 'Kiện', 'Pallet'],
            defaultRoutes: [
              {
                id: 'r-ltl-1',
                route: 'Hà Nội ⇄ TP.HCM',
                origin: 'Hub Thanh Trì (Hà Nội)',
                destination: 'Hub Quận 12 (TP.HCM)',
                vehicleType: 'Hub gom hàng lẻ',
                pricingUnit: 'Kg',
                price: 1650,
                currency: 'VND',
                sla: '3 - 4 ngày',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
            ],
            freeSurchargeOptions: ['Định vị kiện hàng theo mã Barcode/QR', 'e-POD chụp ảnh ký nhận tức thì'],
            defaultFreeSurcharges: ['Định vị kiện hàng theo mã Barcode/QR', 'e-POD chụp ảnh ký nhận tức thì'],
            paidSurchargeOptions: [
              { id: 'pltl-1', name: 'Bốc vác lên lầu / Vào hẻm sâu', priceText: '150,000 ₫ / Kiện', isChecked: true },
              { id: 'pltl-2', name: 'Thu hộ COD & Đối soát 24h', priceText: '1% giá trị thu hộ', isChecked: true },
            ],
            vasOptions: ['Giao tận nơi Door-to-Door', 'Đóng gói màng PE / Khung gỗ', 'Thu hộ COD', 'Dán tem nhãn phụ'],
            defaultVas: ['Giao tận nơi Door-to-Door', 'Đóng gói màng PE / Khung gỗ'],
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
            defaultOperation: 'Kiểm soát dải nhiệt độ -25°C đến +15°C, xuất biểu đồ nhiệt PDF sau chuyến đi',
            defaultCommitment: 'Cam kết không đứt gãy chuỗi lạnh, đền bù 100% nếu sốc nhiệt do máy lạnh',
            vehicleLov: ['Xe đông lạnh 15T', 'Xe đông lạnh 8T', 'Xe đông lạnh 5T', 'Xe đông lạnh 2.5T'],
            unitLov: ['Chuyến', 'Tấn', 'Cont 40RF'],
            defaultRoutes: [
              {
                id: 'r-ref-1',
                route: 'Đà Lạt ⇄ TP.HCM',
                origin: 'Đức Trọng (Lâm Đồng)',
                destination: 'Chợ đầu mối Thủ Đức (TP.HCM)',
                vehicleType: 'Xe đông lạnh 8T',
                pricingUnit: 'Chuyến',
                price: 9500000,
                currency: 'VND',
                sla: '7 - 9 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 10,
              },
              {
                id: 'r-ref-2',
                route: 'Cần Thơ ⇄ Hà Nội',
                origin: 'KCN Trà Nóc (Cần Thơ)',
                destination: 'KCN Quang Minh (Hà Nội)',
                vehicleType: 'Xe đông lạnh 15T',
                pricingUnit: 'Chuyến',
                price: 45000000,
                currency: 'VND',
                sla: '45 - 50 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: ['Pre-cooling làm lạnh trước 60 phút', 'IoT Cảm biến nhiệt Real-time', 'Xuất biểu đồ nhiệt PDF'],
            defaultFreeSurcharges: ['Pre-cooling làm lạnh trước 60 phút', 'IoT Cảm biến nhiệt Real-time'],
            paidSurchargeOptions: [
              { id: 'pref-1', name: 'Genset cắm điện dự phòng liên tục', priceText: '400,000 ₫ / Ca', isChecked: true },
              { id: 'pref-2', name: 'Giao hàng đa điểm chuỗi siêu thị', priceText: '300,000 ₫ / Điểm', isChecked: true },
            ],
            vasOptions: ['Pre-cooling buồng lạnh', 'Bốc dỡ kho lạnh 2 đầu', 'Giao đa điểm siêu thị', 'Bảo hiểm đứt gãy chuỗi lạnh'],
            defaultVas: ['Pre-cooling buồng lạnh', 'Bốc dỡ kho lạnh 2 đầu', 'Bảo hiểm đứt gãy chuỗi lạnh'],
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
            defaultFleet: '15 xe chuyên dụng trang bị bọt PCCC, rãnh chống tràn và giấy phép DG',
            defaultOperation: 'Tài xế có chứng chỉ vận chuyển hàng nguy hiểm, trang bị bộ Spill-Kit khẩn cấp',
            defaultCommitment: 'Tuân thủ 100% quy chuẩn an toàn hóa chất Nghị định 34/2024/NĐ-CP',
            vehicleLov: ['Xe tải chở hóa chất 15T', 'Xe tải chở hóa chất 8T', 'Đầu kéo chở bồn ISO Tank'],
            unitLov: ['Chuyến', 'Tấn', 'Cont'],
            defaultRoutes: [
              {
                id: 'r-haz-1',
                route: 'Bà Rịa - Vũng Tàu ⇄ Bình Dương',
                origin: 'KCN Phú Mỹ (BR-VT)',
                destination: 'KCN VSIP 2 (Bình Dương)',
                vehicleType: 'Xe tải chở hóa chất 15T',
                pricingUnit: 'Chuyến',
                price: 14500000,
                currency: 'VND',
                sla: '4 - 6 giờ',
                pricingStyle: 'All-in',
                promotionPercent: 0,
              },
            ],
            freeSurchargeOptions: ['Bộ ứng cứu sự cố hóa chất Spill-Kit', 'Trang bị bảo hộ lao động PPE', 'Bình chữa cháy chuyên dụng'],
            defaultFreeSurcharges: ['Bộ ứng cứu sự cố hóa chất Spill-Kit', 'Trang bị bảo hộ lao động PPE'],
            paidSurchargeOptions: [
              { id: 'phaz-1', name: 'Phí xin giấy phép lưu hành hóa chất', priceText: '1,200,000 ₫ / Chuyến', isChecked: true },
              { id: 'phaz-2', name: 'Hộ tống an toàn qua hầm/đèo', priceText: '800,000 ₫ / Chuyến', isChecked: false },
            ],
            vasOptions: ['Khai báo hóa chất bộ Công Thương', 'Hộ tống an toàn', 'Bảo hiểm rủi ro ô nhiễm môi trường'],
            defaultVas: ['Khai báo hóa chất bộ Công Thương', 'Bảo hiểm rủi ro ô nhiễm môi trường'],
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
            freeSurchargeOptions: ['Free Demurrage/Detention 14-21 ngày', 'Phát hành Telex Release / Seaway Bill', 'Khai báo VGM & Manifest'],
            defaultFreeSurcharges: ['Free Demurrage/Detention 14-21 ngày', 'Phát hành Telex Release / Seaway Bill'],
            paidSurchargeOptions: [
              { id: 'psea-1', name: 'Khai báo an ninh AMS/ISF (Mỹ) / AFR (Nhật)', priceText: '$35 / BL', isChecked: true },
              { id: 'psea-2', name: 'Phí chỉnh sửa vận đơn sau cut-off', priceText: '$40 / Lần', isChecked: false },
            ],
            vasOptions: ['Bảo hiểm hàng hải loại A', 'Lashing chằng buộc an toàn trong cont', 'Hun trùng ISPM 15', 'Khai báo hải quan cảng'],
            defaultVas: ['Bảo hiểm hàng hải loại A', 'Lashing chằng buộc an toàn trong cont'],
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
            freeSurchargeOptions: ['Quấn màng PE bảo vệ kiện lẻ', 'Kiểm đếm chụp ảnh kiện hàng tại kho CFS'],
            defaultFreeSurcharges: ['Quấn màng PE bảo vệ kiện lẻ'],
            paidSurchargeOptions: [
              { id: 'plcl-1', name: 'Phí lưu kho CFS quá 5 ngày', priceText: '$5 / CBM / Ngày', isChecked: true },
            ],
            vasOptions: ['Đóng kiện gỗ bảo vệ', 'Dán tem nhãn vận chuyển', 'Giao tận nơi Door-to-Door nước ngoài'],
            defaultVas: ['Đóng kiện gỗ bảo vệ', 'Dán tem nhãn vận chuyển'],
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
            freeSurchargeOptions: ['PTI Test kiểm tra giàn lạnh trước đóng hàng', 'Data Logger giám sát nhiệt độ'],
            defaultFreeSurcharges: ['PTI Test kiểm tra giàn lạnh trước đóng hàng'],
            paidSurchargeOptions: [
              { id: 'pref-plug', name: 'Phí cắm điện lưu bãi cảng vượt định mức', priceText: '$65 / Ngày', isChecked: true },
            ],
            vasOptions: ['Kiểm dịch thực vật xuất khẩu', 'Làm lạnh trước thùng cont', 'Bảo hiểm đứt gãy nhiệt độ'],
            defaultVas: ['Kiểm dịch thực vật xuất khẩu', 'Bảo hiểm đứt gãy nhiệt độ'],
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
            freeSurchargeOptions: ['Hỗ trợ thẩm định hồ sơ MSDS', 'Dán tem nhãn cảnh báo IMO'],
            defaultFreeSurcharges: ['Hỗ trợ thẩm định hồ sơ MSDS'],
            paidSurchargeOptions: [
              { id: 'phaz-dg', name: 'Phí DG Surcharge của hãng tàu', priceText: '$150 / Cont', isChecked: true },
            ],
            vasOptions: ['Chằng buộc lashing chống dịch chuyển hóa chất', 'Khai báo hải quan hàng nguy hiểm'],
            defaultVas: ['Chằng buộc lashing chống dịch chuyển hóa chất'],
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
            freeSurchargeOptions: ['Soi chiếu an ninh X-Ray ưu tiên', 'Cấp mã vận đơn điện tử e-AWB'],
            defaultFreeSurcharges: ['Soi chiếu an ninh X-Ray ưu tiên'],
            paidSurchargeOptions: [
              { id: 'pair-1', name: 'Phí soi chiếu an ninh & Phí THC sân bay', priceText: '1,200 ₫ / Kg', isChecked: true },
            ],
            vasOptions: ['Đóng gói chuẩn IATA', 'Door-to-Airport cấp tốc', 'Bảo hiểm hàng không All-Risks'],
            defaultVas: ['Đóng gói chuẩn IATA', 'Door-to-Airport cấp tốc'],
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
            freeSurchargeOptions: ['Lấy hàng tận nơi Door-to-Door', 'Cập nhật tracking từng giờ'],
            defaultFreeSurcharges: ['Lấy hàng tận nơi Door-to-Door'],
            paidSurchargeOptions: [
              { id: 'pexp-1', name: 'Phụ phí xăng dầu & Vùng sâu vùng xa', priceText: 'Theo biểu phí hãng', isChecked: true },
            ],
            vasOptions: ['Thông quan khẩn cấp hàng mẫu', 'Hand-Carry bay cùng kiện hàng', 'Bảo hiểm 100%'],
            defaultVas: ['Thông quan khẩn cấp hàng mẫu'],
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
            freeSurchargeOptions: ['Cảm biến nhiệt độ Data Logger', 'Ưu tiên lưu kho lạnh sân bay'],
            defaultFreeSurcharges: ['Cảm biến nhiệt độ Data Logger'],
            paidSurchargeOptions: [
              { id: 'pref-air', name: 'Phí bổ sung đá khô / Gel lạnh tại điểm transit', priceText: '$80 / Thùng', isChecked: true },
            ],
            vasOptions: ['Đóng đá khô & màng giữ nhiệt', 'Thông quan ưu tiên line lạnh', 'Bảo hiểm dược phẩm GDP'],
            defaultVas: ['Đóng đá khô & màng giữ nhiệt', 'Bảo hiểm dược phẩm GDP'],
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
            freeSurchargeOptions: ['Kiểm tra hồ sơ DGR trước khi mang ra sân bay'],
            defaultFreeSurcharges: ['Kiểm tra hồ sơ DGR trước khi mang ra sân bay'],
            paidSurchargeOptions: [
              { id: 'pdg-air', name: 'Phí kiểm tra hàng nguy hiểm Dangerous Goods Fee', priceText: '$75 / AWB', isChecked: true },
            ],
            vasOptions: ['Lập bảng khai báo DGR Shipper Declaration', 'Dán nhãn IATA chuẩn', 'Đóng gói bao bì UN'],
            defaultVas: ['Lập bảng khai báo DGR Shipper Declaration', 'Đóng gói bao bì UN'],
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
            freeSurchargeOptions: ['Niêm phong kẹp chì đường sắt', 'Cẩu hạ 2 đầu ga'],
            defaultFreeSurcharges: ['Niêm phong kẹp chì đường sắt'],
            paidSurchargeOptions: [
              { id: 'prail-1', name: 'Phí lưu bãi ga quá 48h', priceText: '150,000 ₫ / Cont / Ngày', isChecked: true },
            ],
            vasOptions: ['Kéo cont First/Last-mile tận kho', 'Bốc xếp tại ga', 'Chằng buộc lashing toa xe'],
            defaultVas: ['Kéo cont First/Last-mile tận kho', 'Chằng buộc lashing toa xe'],
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
            freeSurchargeOptions: ['Bốc dỡ tại bãi ga'],
            defaultFreeSurcharges: ['Bốc dỡ tại bãi ga'],
            paidSurchargeOptions: [
              { id: 'prail-lcl', name: 'Giao nhận tận nơi Door-to-Door', priceText: 'Theo cự ly km', isChecked: true },
            ],
            vasOptions: ['Vận chuyển tận nhà Door-to-Door', 'Bọc màng PE chống bụi'],
            defaultVas: ['Vận chuyển tận nhà Door-to-Door'],
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
            freeSurchargeOptions: ['Cấp điện liên tục trên toa', 'Kiểm tra nhiệt độ từng chặng'],
            defaultFreeSurcharges: ['Cấp điện liên tục trên toa'],
            paidSurchargeOptions: [
              { id: 'pr-ref', name: 'Phí cắm điện lưu bãi ga', priceText: '350,000 ₫ / Ngày', isChecked: true },
            ],
            vasOptions: ['Thông quan liên vận quốc tế sang Trung Quốc', 'Bảo hiểm hàng lạnh'],
            defaultVas: ['Thông quan liên vận quốc tế sang Trung Quốc'],
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
            freeSurchargeOptions: ['Bình PCCC trên toa', 'Kiểm tra kỹ thuật định kỳ'],
            defaultFreeSurcharges: ['Bình PCCC trên toa'],
            paidSurchargeOptions: [
              { id: 'pr-haz', name: 'Phí áp tải an toàn đường sắt', priceText: '2,000,000 ₫ / Chuyến', isChecked: true },
            ],
            vasOptions: ['Hồ sơ an toàn hóa chất đường sắt', 'Bảo hiểm sự cố môi trường'],
            defaultVas: ['Hồ sơ an toàn hóa chất đường sắt'],
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
            freeSurchargeOptions: ['Bảo vệ 24/7 & Camera an ninh', 'Bảo hiểm cháy nổ kho bãi'],
            defaultFreeSurcharges: ['Bảo vệ 24/7 & Camera an ninh', 'Bảo hiểm cháy nổ kho bãi'],
            paidSurchargeOptions: [
              { id: 'pwh-1', name: 'Phí nâng hạ xe nâng bốc xếp', priceText: '35,000 ₫ / Pallet', isChecked: true },
              { id: 'pwh-2', name: 'Phí làm việc ngoài giờ hành chính', priceText: '200,000 ₫ / Giờ', isChecked: false },
            ],
            vasOptions: ['Dán tem phụ tiếng Việt', 'Quấn màng co PE pallet', 'Đóng gói Kitting combo', 'Đóng kiện gỗ'],
            defaultVas: ['Dán tem phụ tiếng Việt', 'Quấn màng co PE pallet'],
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
            freeSurchargeOptions: ['Báo cáo tồn kho ngoại quan gửi hải quan'],
            defaultFreeSurcharges: ['Báo cáo tồn kho ngoại quan gửi hải quan'],
            paidSurchargeOptions: [
              { id: 'pwh-bon', name: 'Phí thủ tục hải quan mở/thanh khoản tờ khai kho', priceText: '800,000 ₫ / Bộ', isChecked: true },
            ],
            vasOptions: ['Hun trùng ISPM 15', 'Tách ghép hàng xuất khẩu', 'Khai báo hải quan ngoại quan'],
            defaultVas: ['Khai báo hải quan ngoại quan', 'Hun trùng ISPM 15'],
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
            freeSurchargeOptions: ['Đồng bộ API tự động với sàn TMĐT', 'Cập nhật tồn kho real-time'],
            defaultFreeSurcharges: ['Đồng bộ API tự động với sàn TMĐT'],
            paidSurchargeOptions: [
              { id: 'pwh-ful', name: 'Phí xử lý hàng hoàn (Reverse Logistics)', priceText: '5,000 ₫ / Đơn hoàn', isChecked: true },
            ],
            vasOptions: ['Chèn thiệp cảm ơn & Quà tặng', 'Đóng gói Kitting combo', 'Dán tem barcode SKU lẻ'],
            defaultVas: ['Chèn thiệp cảm ơn & Quà tặng', 'Dán tem barcode SKU lẻ'],
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
            freeSurchargeOptions: ['Ra vào tự do 24/7', 'Wifi & Đèn chiếu sáng miễn phí'],
            defaultFreeSurcharges: ['Ra vào tự do 24/7'],
            paidSurchargeOptions: [
              { id: 'pwh-self', name: 'Bộ vật tư thùng carton & băng keo', priceText: '150,000 ₫ / Bộ', isChecked: true },
            ],
            vasOptions: ['Bảo hiểm tài sản khoang', 'Cung cấp vật tư đóng gói tại chỗ'],
            defaultVas: ['Bảo hiểm tài sản khoang'],
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
            freeSurchargeOptions: ['Cảm biến nhiệt độ IoT 24/7', 'Báo cáo nhiệt độ định kỳ'],
            defaultFreeSurcharges: ['Cảm biến nhiệt độ IoT 24/7'],
            paidSurchargeOptions: [
              { id: 'pwh-cold', name: 'Phí cấp đông nhanh (Blast Freezing)', priceText: '500,000 ₫ / Tấn', isChecked: true },
            ],
            vasOptions: ['Cấp đông nhanh Pre-cooling', 'Kiểm soát hạn dùng FEFO', 'Bảo hiểm rủi ro mất nhiệt độ'],
            defaultVas: ['Kiểm soát hạn dùng FEFO', 'Bảo hiểm rủi ro mất nhiệt độ'],
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
            freeSurchargeOptions: ['Báo cáo nhiệt độ gửi cơ quan kiểm dịch'],
            defaultFreeSurcharges: ['Báo cáo nhiệt độ gửi cơ quan kiểm dịch'],
            paidSurchargeOptions: [
              { id: 'pwh-ref-bon', name: 'Phí lấy mẫu kiểm dịch tại kho', priceText: '500,000 ₫ / Lô', isChecked: true },
            ],
            vasOptions: ['Kiểm dịch thực vật / động vật', 'Thủ tục tạm nhập tái xuất'],
            defaultVas: ['Kiểm dịch thực vật / động vật'],
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
            freeSurchargeOptions: ['Điện máy phát dự phòng 24/7', 'Khóa từ độc lập'],
            defaultFreeSurcharges: ['Điện máy phát dự phòng 24/7'],
            paidSurchargeOptions: [
              { id: 'pwh-ref-self', name: 'Thùng xốp & Đá gel bổ sung', priceText: '80,000 ₫ / Bộ', isChecked: true },
            ],
            vasOptions: ['Khóa từ độc lập', 'Backup điện tự động'],
            defaultVas: ['Backup điện tự động'],
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
            freeSurchargeOptions: ['Hệ thống PCCC bọt Foam', 'Rãnh thu gom hóa chất tràn'],
            defaultFreeSurcharges: ['Hệ thống PCCC bọt Foam'],
            paidSurchargeOptions: [
              { id: 'pwh-haz', name: 'Phí xử lý chất thải bao bì nguy hại', priceText: 'Theo khối lượng kg', isChecked: true },
            ],
            vasOptions: ['Bảo hiểm trách nhiệm hóa chất', 'Báo cáo tồn kho hóa chất gửi Sở Công Thương'],
            defaultVas: ['Bảo hiểm trách nhiệm hóa chất'],
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
            freeSurchargeOptions: ['Khai báo hóa chất trên cổng một cửa'],
            defaultFreeSurcharges: ['Khai báo hóa chất trên cổng một cửa'],
            paidSurchargeOptions: [
              { id: 'pwh-haz-bon', name: 'Phí giám định chất lượng hóa chất', priceText: 'Theo biểu phí Vinacontrol', isChecked: true },
            ],
            vasOptions: ['Khai báo hóa chất cổng một cửa', 'Giám định chất lượng'],
            defaultVas: ['Khai báo hóa chất cổng một cửa'],
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
            freeSurchargeOptions: ['Tủ an toàn chống cháy nổ', 'Cảm biến khí rò rỉ'],
            defaultFreeSurcharges: ['Tủ an toàn chống cháy nổ'],
            paidSurchargeOptions: [
              { id: 'pwh-haz-self', name: 'Phí kiểm tra an toàn định kỳ', priceText: '200,000 ₫ / Tháng', isChecked: true },
            ],
            vasOptions: ['Tủ an toàn chống cháy nổ', 'Cảm biến nồng độ khí'],
            defaultVas: ['Tủ an toàn chống cháy nổ'],
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
            freeSurchargeOptions: ['Tư vấn mã HS Code chính xác', 'Kiểm tra trước bộ chứng từ Invoice/Packing List'],
            defaultFreeSurcharges: ['Tư vấn mã HS Code chính xác', 'Kiểm tra trước bộ chứng từ Invoice/Packing List'],
            paidSurchargeOptions: [
              { id: 'pcus-1', name: 'Phí hỗ trợ kiểm hóa luồng Đỏ tại cảng', priceText: '500,000 ₫ / Cont', isChecked: true },
              { id: 'pcus-2', name: 'Phí xin C/O các Form D, E, EUR.1', priceText: '600,000 ₫ / Bộ', isChecked: false },
            ],
            vasOptions: ['Xin cấp C/O các form', 'Tham vấn giá & Kiểm hóa hộ', 'Thủ tục hoàn thuế', 'Báo cáo quyết toán năm'],
            defaultVas: ['Xin cấp C/O các form', 'Tham vấn giá & Kiểm hóa hộ'],
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
            freeSurchargeOptions: ['Nộp hồ sơ kiểm dịch trực tuyến trước giờ tàu cập'],
            defaultFreeSurcharges: ['Nộp hồ sơ kiểm dịch trực tuyến trước giờ tàu cập'],
            paidSurchargeOptions: [
              { id: 'pchk-1', name: 'Lệ phí kiểm nghiệm mẫu phòng Lab', priceText: 'Theo biên lai nhà nước', isChecked: true },
            ],
            vasOptions: ['Đăng ký kiểm dịch trực tuyến', 'Đưa hàng về kho bảo quản chờ kết quả', 'Xin giấy phép ATTP'],
            defaultVas: ['Đăng ký kiểm dịch trực tuyến', 'Đưa hàng về kho bảo quản chờ kết quả'],
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
            freeSurchargeOptions: ['Thẩm định phân loại hóa chất theo Nghị định 113/2017/NĐ-CP'],
            defaultFreeSurcharges: ['Thẩm định phân loại hóa chất theo Nghị định 113/2017/NĐ-CP'],
            paidSurchargeOptions: [
              { id: 'phaz-cus', name: 'Phí xin giấy phép nhập khẩu tiền chất', priceText: '1,500,000 ₫ / Giấy phép', isChecked: true },
            ],
            vasOptions: ['Thẩm định bảng MSDS', 'Khai báo hóa chất một cửa quốc gia', 'Xin giấy phép tiền chất'],
            defaultVas: ['Thẩm định bảng MSDS', 'Khai báo hóa chất một cửa quốc gia'],
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
            freeSurchargeOptions: ['Thủ tục thông quan xuất cảnh biên giới', 'Định vị GPS hành trình quốc tế'],
            defaultFreeSurcharges: ['Thủ tục thông quan xuất cảnh biên giới'],
            paidSurchargeOptions: [
              { id: 'pcb-1', name: 'Phí sang tải tại bãi kiểm hóa cửa khẩu', priceText: '1,500,000 ₫ / Xe', isChecked: true },
            ],
            vasOptions: ['Thủ tục hải quan 2 đầu biên giới', 'Sang tải sang xe đối tác nước ngoài', 'Bảo hiểm hàng hóa quốc tế'],
            defaultVas: ['Thủ tục hải quan 2 đầu biên giới', 'Sang tải sang xe đối tác nước ngoài'],
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
            freeSurchargeOptions: ['Cập nhật trạng thái giao nhận qua App'],
            defaultFreeSurcharges: ['Cập nhật trạng thái giao nhận qua App'],
            paidSurchargeOptions: [
              { id: 'pcb-ltl', name: 'Phí thu hộ tiền hàng nước ngoài (COD)', priceText: '1.5% giá trị thu hộ', isChecked: true },
            ],
            vasOptions: ['Giao hàng Door-to-Door', 'Thu hộ tiền hàng tại Phnom Penh', 'Dán tem nhãn tiếng bản địa'],
            defaultVas: ['Giao hàng Door-to-Door', 'Thu hộ tiền hàng tại Phnom Penh'],
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
            freeSurchargeOptions: ['Thông quan nhanh làn xanh nông sản', 'Theo dõi nhiệt độ thùng xe real-time'],
            defaultFreeSurcharges: ['Thông quan nhanh làn xanh nông sản'],
            paidSurchargeOptions: [
              { id: 'pcb-ref', name: 'Phí cắm điện buồng lạnh tại bãi chờ cửa khẩu', priceText: '500,000 ₫ / Đêm', isChecked: true },
            ],
            vasOptions: ['Kiểm dịch thực vật biên giới', 'Theo dõi nhiệt độ real-time', 'Sang tải lạnh chuyên dụng'],
            defaultVas: ['Kiểm dịch thực vật biên giới', 'Theo dõi nhiệt độ real-time'],
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
            freeSurchargeOptions: ['Bộ ứng cứu sự cố hóa chất quốc tế'],
            defaultFreeSurcharges: ['Bộ ứng cứu sự cố hóa chất quốc tế'],
            paidSurchargeOptions: [
              { id: 'pcb-haz', name: 'Phí giấy phép quá cảnh liên quốc gia', priceText: '3,500,000 ₫ / Giấy phép', isChecked: true },
            ],
            vasOptions: ['Giấy phép vận chuyển quá cảnh liên quốc gia', 'Hộ tống an toàn qua cửa khẩu'],
            defaultVas: ['Giấy phép vận chuyển quá cảnh liên quốc gia'],
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
            freeSurchargeOptions: ['Báo cáo KPI giao nhận hàng ngày', 'Quản lý thu hồi vỏ pallet'],
            defaultFreeSurcharges: ['Báo cáo KPI giao nhận hàng ngày'],
            paidSurchargeOptions: [
              { id: 'pproj-1', name: 'Giao hàng hẹn giờ chính xác (Time-slot)', priceText: '200,000 ₫ / Điểm', isChecked: true },
            ],
            vasOptions: ['Báo cáo KPI giao nhận hàng ngày', 'Quản lý thu hồi vỏ pallet', 'Bảo hiểm tổng thể'],
            defaultVas: ['Báo cáo KPI giao nhận hàng ngày', 'Bảo hiểm tổng thể'],
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
            freeSurchargeOptions: ['Quét mã barcode tự động'],
            defaultFreeSurcharges: ['Quét mã barcode tự động'],
            paidSurchargeOptions: [
              { id: 'pproj-xdock', name: 'Phí phân loại chi tiết theo mã SKU', priceText: '500 ₫ / Sản phẩm', isChecked: true },
            ],
            vasOptions: ['Phân loại mã SKU nhanh', 'Quét barcode tự động'],
            defaultVas: ['Phân loại mã SKU nhanh'],
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
            freeSurchargeOptions: ['Hạ vỏ cont rỗng về bãi chỉ định'],
            defaultFreeSurcharges: ['Hạ vỏ cont rỗng về bãi chỉ định'],
            paidSurchargeOptions: [
              { id: 'pproj-port', name: 'Phí nâng hạ cẩu bãi ngoài giờ', priceText: '400,000 ₫ / Cont', isChecked: true },
            ],
            vasOptions: ['Nâng hạ cẩu bờ chuyên dụng', 'Bảo quản container bãi cảng'],
            defaultVas: ['Nâng hạ cẩu bờ chuyên dụng'],
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
            freeSurchargeOptions: ['Quản lý chuỗi cung ứng trọn gói 4PL', 'Một vận đơn duy nhất xuyên suốt'],
            defaultFreeSurcharges: ['Quản lý chuỗi cung ứng trọn gói 4PL'],
            paidSurchargeOptions: [
              { id: 'pproj-multi', name: 'Bảo hiểm hàng hóa đa phương thức mở rộng', priceText: '0.15% giá trị hàng', isChecked: true },
            ],
            vasOptions: ['Quản lý chuỗi cung ứng trọn gói 4PL', 'Một vận đơn duy nhất xuyên suốt hành trình'],
            defaultVas: ['Quản lý chuỗi cung ứng trọn gói 4PL'],
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
            freeSurchargeOptions: ['Bàn giao kiểm đếm nhiệt độ từng điểm'],
            defaultFreeSurcharges: ['Bàn giao kiểm đếm nhiệt độ từng điểm'],
            paidSurchargeOptions: [
              { id: 'pproj-cold', name: 'Phí giao hàng trước 6h sáng', priceText: '250,000 ₫ / Chuyến', isChecked: true },
            ],
            vasOptions: ['Bàn giao kiểm đếm nhiệt độ từng điểm', 'Biên bản nghiệm thu chất lượng hàng tươi'],
            defaultVas: ['Bàn giao kiểm đếm nhiệt độ từng điểm'],
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
            freeSurchargeOptions: ['Cảm biến nhiệt độ buồng đệm'],
            defaultFreeSurcharges: ['Cảm biến nhiệt độ buồng đệm'],
            paidSurchargeOptions: [
              { id: 'pproj-ice', name: 'Phí bổ sung đá gel / đá khô', priceText: '50,000 ₫ / Kg', isChecked: true },
            ],
            vasOptions: ['Cảm biến nhiệt độ buồng đệm', 'Bảo quản đá gel bổ sung'],
            defaultVas: ['Cảm biến nhiệt độ buồng đệm'],
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
            freeSurchargeOptions: ['Cắm điện bãi cảng 24/7'],
            defaultFreeSurcharges: ['Cắm điện bãi cảng 24/7'],
            paidSurchargeOptions: [
              { id: 'pproj-reefer-genset', name: 'Phí chạy Genset trên đường bộ', priceText: '600,000 ₫ / Chuyến', isChecked: true },
            ],
            vasOptions: ['Cắm điện bãi cảng 24/7', 'Theo dõi nhiệt độ giàn lạnh Reefer liên tục'],
            defaultVas: ['Cắm điện bãi cảng 24/7'],
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
            freeSurchargeOptions: ['Giám sát chuỗi lạnh Cold Chain 100%'],
            defaultFreeSurcharges: ['Giám sát chuỗi lạnh Cold Chain 100%'],
            paidSurchargeOptions: [
              { id: 'pproj-cold-ins', name: 'Bảo hiểm hư hỏng nông sản lạnh', priceText: '0.25% giá trị hàng', isChecked: true },
            ],
            vasOptions: ['Giám sát chuỗi lạnh Cold Chain 100% không đứt gãy', 'Bảo hiểm rủi ro mất nhiệt độ'],
            defaultVas: ['Giám sát chuỗi lạnh Cold Chain 100% không đứt gãy'],
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
            freeSurchargeOptions: ['Kẹp chì seal an toàn', 'Biên bản bàn giao hóa chất nghiêm ngặt'],
            defaultFreeSurcharges: ['Kẹp chì seal an toàn'],
            paidSurchargeOptions: [
              { id: 'pproj-haz-pccc', name: 'Phí xe chữa cháy bảo vệ hiện trường', priceText: '2,500,000 ₫ / Ca', isChecked: true },
            ],
            vasOptions: ['Kẹp chì seal an toàn', 'Biên bản bàn giao hóa chất nghiêm ngặt'],
            defaultVas: ['Kẹp chì seal an toàn'],
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
            freeSurchargeOptions: ['Trang thiết bị ứng phó sự cố hóa chất'],
            defaultFreeSurcharges: ['Trang thiết bị ứng phó sự cố hóa chất'],
            paidSurchargeOptions: [
              { id: 'pproj-haz-spill', name: 'Phí xử lý bồn rửa hóa chất', priceText: '800,000 ₫ / Lần', isChecked: true },
            ],
            vasOptions: ['Trang thiết bị ứng phó sự cố hóa chất', 'Đội ứng cứu phản ứng nhanh'],
            defaultVas: ['Trang thiết bị ứng phó sự cố hóa chất'],
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
            freeSurchargeOptions: ['Xe chữa cháy trực tại hiện trường'],
            defaultFreeSurcharges: ['Xe chữa cháy trực tại hiện trường'],
            paidSurchargeOptions: [
              { id: 'pproj-haz-port-fee', name: 'Lệ phí an ninh hàng nguy hiểm cảng vụ', priceText: '$45 / Cont', isChecked: true },
            ],
            vasOptions: ['Xe chữa cháy trực tại hiện trường', 'Thủ tục an ninh cảng vụ'],
            defaultVas: ['Xe chữa cháy trực tại hiện trường'],
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
            freeSurchargeOptions: ['Giấy phép vận chuyển liên tỉnh & liên bộ'],
            defaultFreeSurcharges: ['Giấy phép vận chuyển liên tỉnh & liên bộ'],
            paidSurchargeOptions: [
              { id: 'pproj-haz-multi-ins', name: 'Bảo hiểm trách nhiệm ô nhiễm môi trường', priceText: '0.3% giá trị lô hàng', isChecked: true },
            ],
            vasOptions: ['Giấy phép vận chuyển liên tỉnh & liên bộ', 'Bảo hiểm bồi thường ô nhiễm môi trường'],
            defaultVas: ['Giấy phép vận chuyển liên tỉnh & liên bộ'],
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
            freeSurcharges: [...m.defaultFreeSurcharges],
            paidSurcharges: JSON.parse(JSON.stringify(m.paidSurchargeOptions)),
            selectedVas: [...m.defaultVas],
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
    freeSurcharges: activeModel?.defaultFreeSurcharges || [],
    paidSurcharges: activeModel?.paidSurchargeOptions || [],
    selectedVas: activeModel?.defaultVas || [],
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
  // SECTION 2: ROUTES TABLE OPERATIONS
  // ==========================================
  const handleAddRouteRow = () => {
    const defaultVehicle = activeModel?.vehicleLov?.[0] || 'Phương tiện chuẩn';
    const defaultUnit = activeModel?.unitLov?.[0] || 'Chuyến';
    const newRoute: CapabilityRouteItem = {
      id: `r-new-${Date.now()}`,
      route: 'Hành Lang Tuyến Mới',
      origin: 'Điểm Lấy Hàng (Kho / Cảng)',
      destination: 'Điểm Giao Hàng (Kho / Cảng)',
      vehicleType: defaultVehicle,
      pricingUnit: defaultUnit,
      price: 15000000,
      currency: defaultUnit.includes('USD') ? 'USD' : 'VND',
      sla: '24 - 48 giờ',
      pricingStyle: 'All-in',
      promotionPercent: 0,
    };

    updateCurrentFormData('routes', [...(currentData.routes || []), newRoute]);
  };

  const handleUpdateRouteRow = (routeId: string, field: keyof CapabilityRouteItem, val: any) => {
    const updatedRoutes = (currentData.routes || []).map((r) => {
      if (r.id === routeId) {
        return { ...r, [field]: val };
      }
      return r;
    });
    updateCurrentFormData('routes', updatedRoutes);
  };

  const handleDeleteRouteRow = (routeId: string) => {
    const updatedRoutes = (currentData.routes || []).filter((r) => r.id !== routeId);
    updateCurrentFormData('routes', updatedRoutes);
  };

  // ==========================================
  // SECTION 3 & 4: SURCHARGES & VAS OPERATIONS
  // ==========================================
  const toggleFreeSurcharge = (item: string) => {
    const current = currentData.freeSurcharges || [];
    const updated = current.includes(item)
      ? current.filter((s) => s !== item)
      : [...current, item];
    updateCurrentFormData('freeSurcharges', updated);
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

  const updatePaidSurchargePrice = (id: string, priceText: string) => {
    const updated = (currentData.paidSurcharges || []).map((s) => {
      if (s.id === id) {
        return { ...s, priceText };
      }
      return s;
    });
    updateCurrentFormData('paidSurcharges', updated);
  };

  const toggleVasItem = (vas: string) => {
    const current = currentData.selectedVas || [];
    const updated = current.includes(vas)
      ? current.filter((v) => v !== vas)
      : [...current, vas];
    updateCurrentFormData('selectedVas', updated);
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
              vasList: data?.selectedVas || [],
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
                                  {isCgExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
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
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">2</span>
                      <span>Các Tuyến Đường & Biểu Giá Tham Chiếu ({currentData.routes?.length || 0})</span>
                    </h4>

                    <button
                      type="button"
                      onClick={handleAddRouteRow}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Tuyến Mới</span>
                    </button>
                  </div>

                  {/* Dynamic Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            <th className="py-2.5 px-2 text-center w-8">STT</th>
                            <th className="py-2.5 px-2.5 min-w-[130px]">Tuyến Đường</th>
                            <th className="py-2.5 px-2.5 min-w-[120px]">Điểm Đi</th>
                            <th className="py-2.5 px-2.5 min-w-[120px]">Điểm Đến</th>
                            <th className="py-2.5 px-2.5 min-w-[140px]">Loại Phương Tiện</th>
                            <th className="py-2.5 px-2 w-24">ĐVT</th>
                            <th className="py-2.5 px-2.5 min-w-[110px]">Đơn Giá</th>
                            <th className="py-2.5 px-2 min-w-[85px]">SLA</th>
                            <th className="py-2.5 px-2 w-28">Quy Cách Giá</th>
                            <th className="py-2.5 px-2 min-w-[90px] text-center">Promotion</th>
                            <th className="py-2.5 px-1.5 text-center w-8">Xóa</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {(!currentData.routes || currentData.routes.length === 0) ? (
                            <tr>
                              <td colSpan={11} className="py-6 text-center text-slate-400">
                                Chưa có tuyến đường nào. Bấm nút <strong>"+ Thêm Tuyến Mới"</strong> để khai báo bảng giá.
                              </td>
                            </tr>
                          ) : (
                            currentData.routes.map((route, idx) => {
                              const hasPromo = (route.promotionPercent || 0) > 0;
                              const discountedPrice = hasPromo 
                                ? Math.round(route.price * (1 - route.promotionPercent / 100)) 
                                : route.price;

                              return (
                                <tr key={route.id} className="hover:bg-slate-50/80 transition-colors">
                                  {/* 1. STT */}
                                  <td className="py-2 px-1 text-center font-mono text-slate-400 font-bold text-[11px]">
                                    {idx + 1}
                                  </td>

                                  {/* 2. Tuyến */}
                                  <td className="py-2 px-1.5">
                                    <input
                                      type="text"
                                      value={route.route}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'route', e.target.value)}
                                      placeholder="HCM ⇄ Hà Nội"
                                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-xs focus:bg-white focus:border-indigo-500"
                                    />
                                  </td>

                                  {/* 3. Điểm Đi */}
                                  <td className="py-2 px-1.5">
                                    <input
                                      type="text"
                                      value={route.origin}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'origin', e.target.value)}
                                      placeholder="Bình Tân (TP.HCM)"
                                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500"
                                    />
                                  </td>

                                  {/* 4. Điểm Đến */}
                                  <td className="py-2 px-1.5">
                                    <input
                                      type="text"
                                      value={route.destination}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'destination', e.target.value)}
                                      placeholder="Cam Ranh (Khánh Hòa)"
                                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500"
                                    />
                                  </td>

                                  {/* 5. Loại Phương Tiện (LOV) */}
                                  <td className="py-2 px-1.5">
                                    <select
                                      value={route.vehicleType}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'vehicleType', e.target.value)}
                                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500"
                                    >
                                      {(activeModel?.vehicleLov || [route.vehicleType]).map((veh: string, vIdx: number) => (
                                        <option key={vIdx} value={veh}>{veh}</option>
                                      ))}
                                    </select>
                                  </td>

                                  {/* 6. Đơn vị tính (LOV) */}
                                  <td className="py-2 px-1">
                                    <select
                                      value={route.pricingUnit}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'pricingUnit', e.target.value)}
                                      className="w-full px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500 font-medium"
                                    >
                                      {(activeModel?.unitLov || ['Chuyến', 'Tấn', 'Kg', 'CBM', 'Cont 40ft', 'Pallet']).map((u: string, uIdx: number) => (
                                        <option key={uIdx} value={u}>{u}</option>
                                      ))}
                                    </select>
                                  </td>

                                  {/* 7. Đơn giá */}
                                  <td className="py-2 px-1.5">
                                    <input
                                      type="number"
                                      value={route.price || ''}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'price', parseFloat(e.target.value) || 0)}
                                      placeholder="18500000"
                                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-xs focus:bg-white focus:border-indigo-500"
                                    />
                                    {hasPromo && (
                                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5 whitespace-nowrap">
                                        Giá sau giảm: {discountedPrice.toLocaleString('vi-VN')} {route.currency}
                                      </div>
                                    )}
                                  </td>

                                  {/* 8. SLA */}
                                  <td className="py-2 px-1">
                                    <input
                                      type="text"
                                      value={route.sla}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'sla', e.target.value)}
                                      placeholder="24 - 36h"
                                      className="w-full px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500 font-medium"
                                    />
                                  </td>

                                  {/* 9. Quy cách giá */}
                                  <td className="py-2 px-1">
                                    <select
                                      value={route.pricingStyle}
                                      onChange={(e) => handleUpdateRouteRow(route.id, 'pricingStyle', e.target.value)}
                                      className="w-full px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500"
                                    >
                                      <option value="All-in">Trọn gói All-in</option>
                                      <option value="Chưa gồm phụ phí">+ Phụ phí ngoài</option>
                                    </select>
                                  </td>

                                  {/* 10. Promotion (%) */}
                                  <td className="py-2 px-1 text-center">
                                    <div className="relative inline-flex items-center">
                                      <input
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={route.promotionPercent || 0}
                                        onChange={(e) => handleUpdateRouteRow(route.id, 'promotionPercent', Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                                        className={`w-16 px-1.5 py-1.5 border rounded-lg text-xs font-bold text-center focus:bg-white focus:border-indigo-500 ${
                                          hasPromo 
                                            ? 'bg-rose-50 border-rose-300 text-rose-700' 
                                            : 'bg-slate-50 border-slate-200 text-slate-700'
                                        }`}
                                      />
                                      {hasPromo && (
                                        <span className="absolute -top-1.5 -right-1 text-[9px] bg-rose-500 text-white font-black px-1 rounded-full flex items-center shadow-xs">
                                          🔥
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* 11. Thao tác Xóa */}
                                  <td className="py-2 px-1 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRouteRow(route.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
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
                    PHẦN 3: CÁC PHỤ PHÍ MIỄN PHÍ & CÓ PHÍ
                ========================================================================= */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">3</span>
                    <span>Chính Sách Phụ Phí (Miễn Phí & Có Phí Khi Phát Sinh)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Free Surcharges (0đ) */}
                    <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Phụ Phí Miễn Phí (Đã Bao Gồm 0đ)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Các dịch vụ/tiện ích đã tính trọn gói không thu thêm để tạo lợi thế cạnh tranh.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        {(activeModel?.freeSurchargeOptions || []).map((item: string, fIdx: number) => {
                          const isChecked = currentData.freeSurcharges?.includes(item);
                          return (
                            <label
                              key={fIdx}
                              onClick={() => toggleFreeSurcharge(item)}
                              className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="truncate">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Paid Surcharges */}
                    <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                        <span>Phụ Phí Có Phí (Tính Khi Phát Sinh Thực Tế)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Tick chọn và thiết lập mức giá tham chiếu khi phát sinh yêu cầu đặc biệt.
                      </p>

                      <div className="space-y-2 pt-1">
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

                            <input
                              type="text"
                              disabled={!surcharge.isChecked}
                              value={surcharge.priceText}
                              onChange={(e) => updatePaidSurchargePrice(surcharge.id, e.target.value)}
                              className={`w-36 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right ${
                                surcharge.isChecked ? 'text-amber-900 focus:border-amber-500' : 'text-slate-400 bg-slate-50'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    PHẦN 4: CÁC DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS)
                ========================================================================= */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10.5px] font-bold">4</span>
                    <span>Dịch Vụ Giá Trị Gia Tăng Đi Kèm (VAS)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    {(activeModel?.vasOptions || []).map((vas: string, idx: number) => {
                      const isChecked = currentData.selectedVas?.includes(vas);
                      return (
                        <label
                          key={idx}
                          onClick={() => toggleVasItem(vas)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-indigo-50/60 border-indigo-300 text-indigo-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="truncate">{vas}</span>
                        </label>
                      );
                    })}
                  </div>
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
    </div>
  );
};
