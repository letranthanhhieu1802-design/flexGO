import { InquiryItem, SupplierLeadItem, LeadStatus } from '../types';

export const comprehensiveInquiries: InquiryItem[] = [
  // ==========================================
  // 1. ĐƯỜNG BỘ: FTL / LTL (Lead 1: FTL - 3 báo giá)
  // ==========================================
  {
    id: 'inq-trk-01',
    code: 'FG-2608310001',
    leadCode: 'FG-2608310001',
    title: 'Vận chuyển Đường bộ FTL 15T: KCN Tân Bình (TP.HCM) → KCN Thăng Long II (Hà Nội)',
    customerCompany: 'Tập đoàn Điện tử ABC Precision Việt Nam',
    contactPerson: 'Lê Trần Thanh Hiếu (Trưởng phòng Mua hàng & Supply Chain)',
    serviceType: 'Trucking',
    pricingType: 'SPOT',
    tradeRole: 'DOMESTIC',
    cargoClassification: 'General',
    cargoType: 'Linh kiện điện tử & Bo mạch vi xử lý đóng thùng Carton',
    industry: 'Điện tử - Công nghệ cao',
    packaging: 'Pallet gỗ quấn màng PE (24 Pallet)',
    weightVolume: '14.5 Tấn (48 CBM)',
    ftlWeightKg: 14500,
    ftlVolumeCbm: 48,
    cargoValue: 3500000000,
    cargoValueCurrency: 'VND',
    origin: 'KCN Tân Bình, Tây Thạnh, Tân Phú, TP.HCM',
    destination: 'KCN Thăng Long II, Yên Mỹ, Tỉnh Hưng Yên (Hà Nội)',
    route: 'TP.HCM → Hà Nội (Trục Quốc lộ 1A / Cao tốc Bắc Nam)',
    pickupDate: '2026-09-05',
    deliveryDate: '2026-09-08',
    createdDate: 'Aug 31, 2026',
    expiryDate: 'Sep 12, 2026',
    status: 'Open',
    responsesCount: 3,
    viewsCount: 142,
    targetBudget: '48,000,000 ₫',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Phí cầu đường & Trạm thu phí BOT toàn tuyến',
      'Phí bốc xếp hàng hóa 2 đầu (Kho gửi & Kho nhận)',
      'Bảo hiểm vận chuyển hàng hóa giá trị cao'
    ],
    selectedVAS: [
      'GPS Live Tracking giám sát xe 24/7',
      'Bảo hiểm hàng hóa 100% giá trị khai báo',
      'Biên bản giao nhận POD gốc chuyển phát nhanh 48h'
    ],
    serviceSpecs: {
      trucking: {
        loadType: 'FTL (Nguyên chuyến)',
        truckType: 'Xe tải thùng kín (Box Truck)',
        tonnageCategory: '15 Tấn',
        vehicleCount: 1,
        ftlWeightKg: 14500,
        ftlVolumeCbm: 48,
        pickupLocations: ['Kho Tổng ABC Logistics Hub - Cổng 2 KCN Tân Bình, TP.HCM'],
        deliveryLocations: ['Nhà máy Lắp ráp Bo mạch Thăng Long II, Yên Mỹ, Hưng Yên'],
        loadingLaborRequired: true,
        unloadingLaborRequired: true,
        tailLiftRequired: true,
        craneAssistanceRequired: false,
        prohibitedHoursPassNeeded: false,
        multiDropPoints: 0,
      }
    },
    description: 'Vận chuyển nguyên xe tải thùng kín 15T tuyến TP.HCM đi Hà Nội. Yêu cầu xe đời mới có bửng nâng hạ thủy lực, tài xế có kinh nghiệm chở hàng linh kiện điện tử giá trị cao.'
  },

  // ==========================================
  // 2. ĐƯỜNG BIỂN: FCL / LCL (Lead 2: FCL - 2 báo giá)
  // ==========================================
  {
    id: 'inq-sea-01',
    code: 'FG-2608310002',
    leadCode: 'FG-2608310002',
    title: 'Vận tải Đường biển FCL (2x40HC): Cảng Cát Lái (TP.HCM) → Cảng Los Angeles (Mỹ)',
    customerCompany: 'Công ty CP Nội Thất Gỗ Quốc Tế Việt Đức (VDFurniture)',
    contactPerson: 'Trần Thị Mai (Phó Giám đốc Xuất Nhập Khẩu)',
    serviceType: 'Sea Freight (FCL)',
    pricingType: 'CONTRACT',
    contractTerm: 'Hợp đồng 12 tháng',
    committedVolume: '8 - 10 Cont 40HC / tháng',
    tradeRole: 'EXPORT',
    incoterms: 'FOB',
    cargoClassification: 'General',
    cargoType: 'Bàn ghế sofa cao cấp & Tủ gỗ tự nhiên xuất khẩu Bắc Mỹ',
    industry: 'Gỗ & Nội thất mỹ nghệ',
    packaging: 'Thùng carton chèn xốp EPS đóng kiện gỗ pallet',
    weightVolume: '2x40HC (52 Tấn / 144 CBM)',
    cargoValue: 180000,
    cargoValueCurrency: 'USD',
    origin: 'Cảng Cát Lái, TP. Thủ Đức, TP.HCM (VNCLI)',
    destination: 'Cảng Los Angeles, California, USA (USLAX)',
    route: 'TP.HCM (VNCLI) → Los Angeles (USLAX)',
    pickupDate: '2026-09-15',
    deliveryDate: '2026-10-05',
    createdDate: 'Aug 31, 2026',
    expiryDate: 'Sep 10, 2026',
    status: 'Open',
    responsesCount: 2,
    viewsCount: 215,
    targetBudget: '185,000,000 ₫',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Phí xếp dỡ bến bãi THC đầu bốc Cát Lái (Origin THC)',
      'Phí phát hành vận đơn đường biển (Bill of Lading / Sea Waybill)',
      'Phí chứng từ & khai báo hải quan tự động Mỹ (AMS / ISF Filing)',
      'Phụ phí giảm thải lưu huỳnh nhiên liệu sạch (LSS / Low Sulphur)'
    ],
    selectedVAS: [
      'Hun trùng kiểm dịch thực vật nhiệt độ cao ISPM-15',
      'Hun trùng container có chứng thư quốc tế cấp tốc',
      'Cam kết 21 ngày miễn phí lưu bãi lưu container (Free Dem/Det)'
    ],
    serviceSpecs: {
      ocean: {
        mode: 'FCL (Full Container)',
        containerType: '40ft High Cube (40HC)',
        containerCount: 2,
        grossWeightKgs: 52000,
        cbmVolume: 144,
        polPort: 'Cảng Cát Lái, TP.HCM (VNCLI)',
        podPort: 'Cảng Los Angeles, USA (USLAX)',
        incoterm: 'FOB',
        commodityCategory: 'Furniture & Wood',
        freeDemDetDaysRequested: 21,
        packageType: 'Palletized',
      }
    },
    description: 'Xuất khẩu 2 cont 40HC nội thất gỗ cao cấp đi Cảng Los Angeles theo điều kiện FOB Cát Lái. Yêu cầu dịch vụ tàu direct không chuyển tải, cam kết 21 ngày Free Demurrage/Detention tại cảng đến.'
  },

  // ==========================================
  // 3. HÀNG KHÔNG: Cargo / Express (Lead 3: Cargo - 0 BÁO GIÁ ĐỂ TEST TH1)
  // ==========================================
  {
    id: 'inq-air-01',
    code: 'FG-2608310003',
    leadCode: 'FG-2608310003',
    title: 'Vận chuyển Hàng Không Air Cargo: Sân bay Tân Sơn Nhất (SGN) → Frankfurt (FRA)',
    customerCompany: 'Tập đoàn Dược Phẩm & Sinh Học BioPharm Vina',
    contactPerson: 'Nguyễn Đăng Khoa (Chuyên viên Mua sắm Dược phẩm)',
    serviceType: 'Air Freight',
    pricingType: 'SPOT',
    tradeRole: 'EXPORT',
    incoterms: 'CIP',
    cargoClassification: 'General',
    cargoType: 'Chế phẩm sinh học y tế & Thiết bị chẩn đoán kháng thể',
    industry: 'Y tế - Dược phẩm',
    packaging: 'Hộp cách nhiệt Envirotainer tiêu chuẩn IATA (6 kiện)',
    weightVolume: '850 kg CW (4.2 CBM)',
    cargoValue: 120000,
    cargoValueCurrency: 'USD',
    origin: 'Kho hàng SGN Cargo Terminal, Sân bay Tân Sơn Nhất (TP.HCM)',
    destination: 'Frankfurt Airport CargoCity South, Đức (FRA)',
    route: 'Tân Sơn Nhất (SGN) → Frankfurt (FRA)',
    pickupDate: '2026-09-06',
    deliveryDate: '2026-09-08',
    createdDate: 'Aug 31, 2026',
    expiryDate: 'Sep 06, 2026',
    status: 'Open',
    responsesCount: 0,
    viewsCount: 48,
    targetBudget: '98,000,000 ₫',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Phí soi chiếu an ninh sân bay đầu xuất SGN (X-Ray Security Fee)',
      'Phí xử lý hàng hóa ga hàng không TCS / SCSC (Terminal Handling Fee)',
      'Phụ phí xăng dầu hàng không (FSC) & Phụ phí an ninh (SSC)'
    ],
    selectedVAS: [
      'Thiết bị giám sát nhiệt độ GPS & Độ ẩm thời gian thực IoT',
      'Ưu tiên bốc dỡ nhanh Priority Cargo tại Frankfurt',
      'Đại lý thông quan khẩn cấp tại sân bay đến FRA'
    ],
    serviceSpecs: {
      air: {
        airServiceType: 'Air Freight / Cargo',
        serviceLevel: 'Priority Direct Flight (1-2 days)',
        chargeableWeightKgs: 850,
        grossWeightKgs: 720,
        volumetricWeightKgs: 700,
        packageCount: 6,
        dimensionsCm: '120x80x100 cm',
        isDangerousGoods: false,
        isTemperatureSensitive: false,
        customsAtAirport: false,
        originAirport: 'SGN',
        destinationAirport: 'FRA',
      }
    },
    description: 'Lô hàng dược phẩm giá trị cao xuất khẩu đi Frankfurt. Yêu cầu nhà cung cấp có chứng chỉ IATA CEIV Pharma hoặc kinh nghiệm vận chuyển hàng y sinh đảm bảo nhiệt độ ổn định.'
  },

  // ==========================================
  // 4. ĐƯỜNG SẮT: FCL / LCL (Lead 4: FCL - 2 báo giá)
  // ==========================================
  {
    id: 'inq-rail-01',
    code: 'FG-2608310004',
    leadCode: 'FG-2608310004',
    title: 'Vận chuyển Đường Sắt FCL (3 Cont 40ft): Ga Sóng Thần (Bình Dương) → Ga Yên Viên (Hà Nội)',
    customerCompany: 'Công ty CP Gốm Sứ & Vật Liệu Xây Dựng Prime Đồng Nai',
    contactPerson: 'Đặng Tuấn Anh (Trưởng phòng Điều phối Vận tải Bắc Nam)',
    serviceType: 'Rail Freight',
    pricingType: 'SPOT',
    tradeRole: 'DOMESTIC',
    cargoClassification: 'General',
    cargoType: 'Gạch men ốp lát cao cấp đóng hộp carton trên pallet sắt',
    industry: 'Vật liệu xây dựng & Gốm sứ',
    packaging: 'Pallet tiêu chuẩn chằng buộc đai thép (60 Pallet)',
    weightVolume: '3 Cont 40ft (78 Tấn / 180 CBM)',
    cargoValue: 1200000000,
    cargoValueCurrency: 'VND',
    origin: 'Ga Sóng Thần, TP. Dĩ An, Tỉnh Bình Dương',
    destination: 'Ga Yên Viên, Gia Lâm, TP. Hà Nội',
    route: 'Bình Dương (Ga Sóng Thần) → Hà Nội (Ga Yên Viên)',
    pickupDate: '2026-09-08',
    deliveryDate: '2026-09-11',
    createdDate: 'Aug 31, 2026',
    expiryDate: 'Sep 09, 2026',
    status: 'Open',
    responsesCount: 2,
    viewsCount: 95,
    targetBudget: '65,000,000 ₫',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Phí xếp dỡ container tại bãi ga Sóng Thần (Inbound Crane Handling)',
      'Phí hạ bãi và cẩu dỡ container tại Ga Yên Viên',
      'Bảo hiểm vận chuyển rủi ro chấn động đường ray Bắc Nam'
    ],
    selectedVAS: [
      'Dịch vụ kéo xe đầu kéo Door-to-Station đầu gửi',
      'Kiểm đếm niêm phong chì Seal đường sắt 2 đầu'
    ],
    serviceSpecs: {
      rail: {
        mode: 'FCL (Nguyên container ga - ga)',
        containerType: 'Cont 40ft HC',
        containerCount: 3,
        originStation: 'Ga Sóng Thần, Bình Dương',
        destinationStation: 'Ga Yên Viên, Hà Nội',
      }
    },
    description: 'Vận chuyển 3 container 40ft gạch men nặng 78 tấn bằng tàu hỏa nhanh hành trình Bắc Nam Sóng Thần - Yên Viên. Cam kết thời gian chạy tàu 65-72 giờ.'
  },

  // ==========================================
  // 5. KHO BÃI 3PL: Kho thường / Lạnh / Nguy hiểm... (Lead 5: Kho thường - 0 BÁO GIÁ ĐỂ TEST TH1)
  // ==========================================
  {
    id: 'inq-wh-01',
    code: 'FG-2608310005',
    leadCode: 'FG-2608310005',
    title: 'Hợp đồng Thuê Kho Bãi 3PL Kho Thường Grade A: KCN VSIP 1 (Bình Dương) - 1.200 Pallet',
    customerCompany: 'Tập đoàn Hóa Mỹ Phẩm & Tiêu Dùng Unistar Vietnam',
    contactPerson: 'Vũ Bích Ngọc (Giám đốc Vận hành Kho vận Miền Nam)',
    serviceType: 'Warehousing',
    pricingType: 'CONTRACT',
    contractTerm: 'Hợp đồng 12 tháng',
    committedVolume: '1.200 Pallet vị trí cố định (Racking)',
    tradeRole: 'DOMESTIC',
    cargoClassification: 'General',
    cargoType: 'Hàng tiêu dùng nhanh FMCG, dầu gội, sữa tắm và chất tẩy rửa gia dụng',
    industry: 'Hàng tiêu dùng nhanh (FMCG)',
    packaging: 'Pallet tiêu chuẩn 1.2m x 1.0m chiều cao tối đa 1.6m',
    weightVolume: '1.200 Pallet (~ 750 Tấn)',
    cargoValue: 15000000000,
    cargoValueCurrency: 'VND',
    origin: 'KCN VSIP 1, Thuận An, Tỉnh Bình Dương (Bán kính 25km từ TP.HCM)',
    destination: 'Hệ thống siêu thị & đại lý phân phối toàn miền Nam',
    route: 'Bình Dương (Hub phân phối trung tâm)',
    pickupDate: '2026-10-01',
    deliveryDate: '2027-10-01',
    createdDate: 'Aug 31, 2026',
    expiryDate: 'Sep 15, 2026',
    status: 'Open',
    responsesCount: 0,
    viewsCount: 64,
    targetBudget: '145,000,000 ₫ / tháng',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Phí xếp dỡ nhập kho (Inbound Handling) bằng xe nâng chuyên dụng',
      'Phí xuất kho soạn đơn hàng (Outbound Order Picking & Staging)',
      'Phí quản lý phần mềm hệ thống WMS và báo cáo tồn kho tự động'
    ],
    selectedVAS: [
      'Dán tem nhãn phụ tiếng Việt và barcode quản lý QR code',
      'Đóng gói co màng PE bảo vệ pallet theo đơn xuất lẻ',
      'Kiểm kê hàng hóa đối soát tồn kho định kỳ mỗi tháng'
    ],
    serviceSpecs: {
      warehousing: {
        warehouseType: 'Kho thường (Grade A Dry)',
        billingUnitPreference: 'Pallet (Vị trí Pallet/tháng)',
        palletPositions: 1200,
        storageAreaSqm: 2500,
        rentalDurationMonths: 12,
      }
    },
    description: 'Cần thuê 1.200 vị trí pallet kho 3PL tiêu chuẩn Grade A tại KCN VSIP 1 Bình Dương. Yêu cầu sàn Epoxy chịu tải, hệ thống PCCC tự động sprinkler đã nghiệm thu và phần mềm WMS kết nối EDI/API.'
  },

  // ==========================================
  // 6. THỦ TỤC HẢI QUAN: Nhập khẩu / Xuất khẩu (Lead 6: Nhập khẩu - 4 báo giá)
  // ==========================================
  {
    id: 'inq-cus-01',
    code: 'FG-2608310006',
    leadCode: 'FG-2608310006',
    title: 'Dịch vụ Khai báo Hải quan Trọn gói: Nhập khẩu A11 Cảng Cát Lái & ICD Phước Long',
    customerCompany: 'Công ty TNHH Nhựa & Hóa Chất Công Nghiệp Polychem Vina',
    contactPerson: 'Hoàng Minh Trí (Trưởng phòng Khai báo Hải quan & Pháp chế)',
    serviceType: 'Customs Clearance',
    pricingType: 'CONTRACT',
    contractTerm: 'Hợp đồng 12 tháng',
    committedVolume: '30 Tờ khai / tháng',
    tradeRole: 'IMPORT',
    cargoClassification: 'General',
    cargoType: 'Hạt nhựa nguyên sinh tái sinh PE, PP và phụ gia hóa chất dạng hạt',
    industry: 'Nhựa & Hóa chất công nghiệp',
    packaging: 'Bao 25kg đóng trên pallet bọc màng co (Cont 20ft & 40ft)',
    weightVolume: '30 Tờ khai / tháng (Trung bình 45 Cont/tháng)',
    cargoValue: 850000,
    cargoValueCurrency: 'USD',
    origin: 'Chi cục Hải quan Cửa khẩu Cảng Sài Gòn Khu Vực 4 (ICD Phước Long)',
    destination: 'Nhà máy Sản xuất Bao bì Polychem, KCN Sóng Thần 2, Bình Dương',
    route: 'Cảng TP.HCM → Nhà máy Bình Dương',
    pickupDate: '2026-09-08',
    deliveryDate: '2026-09-10',
    createdDate: 'Aug 30, 2026',
    expiryDate: 'Sep 10, 2026',
    status: 'Open',
    responsesCount: 4,
    viewsCount: 180,
    targetBudget: '45,000,000 ₫ / tháng',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Phí mở tờ khai hải quan điện tử VNACCS/VCIS chính ngạch',
      'Phí truyền tờ khai và phân luồng (Luồng xanh / Luồng vàng / Luồng đỏ)',
      'Phí nâng hạ kiểm hóa và tiếp nhận cán bộ công chức hải quan'
    ],
    selectedVAS: [
      'Tư vấn tham vấn giá & hỗ trợ bảo lưu mã HS Code hải quan',
      'Xin giấy phép kiểm tra chuyên ngành và hợp quy chất lượng',
      'Chuyển phát hồ sơ chứng từ gốc và tờ khai thông quan hoàn tất'
    ],
    serviceSpecs: {
      customs: {
        tradeRole: 'Nhập khẩu (Import)',
        declarationType: 'Tờ khai Nhập khẩu Kinh doanh Tiêu dùng (A11)',
        hsCodePrimary: '3901.10.12',
        itemDescription: 'Hạt nhựa nguyên sinh PE dạng hạt',
        customsSubDepartment: 'Chi cục Hải quan Cảng Sài Gòn KV4',
        portOrBorderGate: 'Cảng Cát Lái & Cụm ICD Phước Long',
        redChannelInspectionSupport: true,
      }
    },
    description: 'Hợp đồng dịch vụ đại lý hải quan trọn gói 1 năm cho doanh nghiệp sản xuất bao bì nhựa. Yêu cầu đại lý có chữ ký số đại lý hải quan hợp pháp, xử lý thông quan luồng vàng trong 2 giờ và luồng đỏ trong ngày.'
  },

  // ==========================================
  // 7. XUYÊN BIÊN GIỚI: FTL / LTL (Lead 7: FTL - 2 báo giá)
  // ==========================================
  {
    id: 'inq-cb-01',
    code: 'FG-2608310007',
    leadCode: 'FG-2608310007',
    title: 'Vận tải Đường bộ Xuyên Biên Giới FTL: KCN VSIP Bắc Ninh → Cửa khẩu Hữu Nghị → Nam Ninh (TQ)',
    customerCompany: 'Tập đoàn Công nghệ Vi điện tử Foxconn - Luxshare Logistics',
    contactPerson: 'Đỗ Thị Hồng Nhung (Giám đốc Điều phối Chuỗi Cung Ứng Xuyên Biên Giới)',
    serviceType: 'Cross-border',
    pricingType: 'SPOT',
    tradeRole: 'EXPORT',
    incoterms: 'DAP',
    cargoClassification: 'General',
    cargoType: 'Cụm mô-đun cáp quang & Linh kiện tai nghe không dây xuất khẩu',
    industry: 'Điện tử - Viễn thông',
    packaging: 'Thùng carton chống tĩnh điện ESD trên pallet nhựa (30 Pallet)',
    weightVolume: '1 Xe FTL 15T (12 Tấn / 55 CBM)',
    cargoValue: 4200000000,
    cargoValueCurrency: 'VND',
    origin: 'KCN VSIP Bắc Ninh, Phường Phù Chẩn, TP. Từ Sơn, Tỉnh Bắc Ninh',
    destination: 'Khu Ngoại quan Công nghệ Cao Nam Ninh, Quảng Tây, Trung Quốc',
    route: 'Bắc Ninh → Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn) → Bằng Tường → Nam Ninh',
    pickupDate: '2026-09-07',
    deliveryDate: '2026-09-09',
    createdDate: 'Aug 31, 2026',
    expiryDate: 'Sep 08, 2026',
    status: 'Open',
    responsesCount: 2,
    viewsCount: 130,
    targetBudget: '52,000,000 ₫',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Phí sang tải bãi kiểm hóa cửa khẩu hoặc xe chạy thẳng liên vận GMS',
      'Phí khử trùng kiểm dịch kiểm hóa biên mậu Trung Quốc CIQ',
      'Lệ phí kiểm soát biên phòng cửa khẩu quốc tế Hữu Nghị'
    ],
    selectedVAS: [
      'Đại lý thông quan hai đầu Việt Nam và Bằng Tường (Trung Quốc)',
      'Niêm phong seal điện tử định vị GPS theo dõi lộ trình thời gian thực'
    ],
    serviceSpecs: {
      crossBorder: {
        loadType: 'FTL (Nguyên chuyến / Nguyên cont)',
        cargoMode: 'Xe liên vận chạy thẳng (Direct GMS)',
        vehicleType: 'Xe tải thùng kín liên vận GMS có giấy phép chạy thẳng',
        tonnageCategory: '15 Tấn',
        borderGate: 'Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)',
        originCity: 'Bắc Ninh',
        destinationCity: 'Nam Ninh (Quảng Tây, TQ)',
      }
    },
    description: 'Vận chuyển nguyên xe tải thùng kín 15T linh kiện tai nghe cao cấp xuất khẩu sang Trung Quốc qua Cửa khẩu Hữu Nghị. Yêu cầu ưu tiên xe liên vận giấy phép GMS chạy thẳng không cần hạ bãi sang xe.'
  },

  // ==========================================
  // 8. DỰ ÁN: Phân phối / X-dock / Cảng / Đa phương thức (Lead 8: Đa phương thức - 0 BÁO GIÁ ĐỂ TEST TH1)
  // ==========================================
  {
    id: 'inq-prj-01',
    code: 'FG-2608310008',
    leadCode: 'FG-2608310008',
    title: 'Vận chuyển Hàng Dự Án Siêu Trường Siêu Trọng Đa Phương Thức: Cảng PTSC Phú Mỹ → Điện Gió Đắk Lắk',
    customerCompany: 'Tổng Công ty Năng Lượng Tái Tạo WindPower Global Vietnam',
    contactPerson: 'Kỹ sư Trưởng Phan Thanh Tùng (Quản lý Dự án Điện Gió Tây Nguyên)',
    serviceType: 'Project Cargo',
    pricingType: 'CONTRACT',
    contractTerm: 'Gói thầu dự án 6 tháng',
    committedVolume: '12 Trụ cánh Tuabin gió & 4 Máy biến áp 120 Tấn',
    tradeRole: 'DOMESTIC',
    cargoClassification: 'General',
    cargoType: 'Cánh quạt Tuabin gió dài 76 mét và Máy biến áp siêu trường siêu trọng 120 tấn',
    industry: 'Năng lượng tái tạo - Điện gió',
    packaging: 'Giá đỡ chuyên dụng theo thiết kế nhà sản xuất Vestas',
    weightVolume: '16 Kiện siêu trường siêu trọng (Tổng 1.450 Tấn)',
    cargoValue: 120000000000,
    cargoValueCurrency: 'VND',
    origin: 'Cảng Quốc Tế PTSC Phú Mỹ, TX. Phú Mỹ, Tỉnh Bà Rịa - Vũng Tàu',
    destination: 'Công trường Nhà máy Điện gió Krông Búk, Huyện Krông Búk, Tỉnh Đắk Lắk',
    route: 'Bà Rịa - Vũng Tàu (Sà lan ven biển) → Quy Nhơn → QL19/QL14 → Đắk Lắk',
    pickupDate: '2026-09-20',
    deliveryDate: '2026-11-30',
    createdDate: 'Aug 31, 2026',
    expiryDate: 'Sep 18, 2026',
    status: 'Open',
    responsesCount: 0,
    viewsCount: 112,
    targetBudget: '850,000,000 ₫ / tháng',
    quotationScope: 'ALL_IN',
    requestedSurcharges: [
      'Chi phí khảo sát tuyến đường, tĩnh không cầu vượt và gia cố cầu đường bộ',
      'Chi phí xe chuyên dụng dẫn đường, xe cảnh sát giao thông hộ tống',
      'Phí nâng hạ thiết bị bằng cẩu bánh xích chuyên dụng 500 tấn tại công trường'
    ],
    selectedVAS: [
      'Lập phương án kỹ thuật vận chuyển (Method Statement) thẩm định Bộ GTVT',
      'Bảo hiểm trách nhiệm bồi thường hạ tầng giao thông và hàng dự án 100%'
    ],
    serviceSpecs: {
      project: {
        projectCategory: 'MULTIMODAL',
        projectName: 'Vận chuyển thiết bị điện gió Đắk Lắk',
        multimodalCombination: 'Đường Biển + Đường Bộ (Sea - Road Freight)',
        multimodalFirstMile: 'Cảng PTSC Phú Mỹ',
        multimodalMainHaul: 'Sà lan biển ven bờ đến Cảng Quy Nhơn',
        multimodalLastMile: 'Rơ-moóc thủy lực SPMT lên Đắk Lắk',
      }
    },
    description: 'Vận chuyển gói thiết bị dự án nhà máy điện gió bao gồm 12 cánh tuabin dài 76m và 4 máy biến áp 120T từ Cảng PTSC Phú Mỹ về công trường Đắk Lắk bằng phương án đa phương thức thủy bộ kết hợp rơ-moóc SPMT.'
  }
];

export const comprehensiveSupplierLeads: SupplierLeadItem[] = comprehensiveInquiries.map((inq, idx) => {
  const leadStatus: LeadStatus = inq.status === 'Closed' ? 'Closed' : inq.status === 'Quoted' ? 'Quoted' : 'Open';
  const isContract = inq.pricingType === 'CONTRACT';
  
  // Clean raw numeric value from budget
  const rawNum = parseInt(inq.targetBudget?.replace(/\D/g, '') || '50000000', 10);
  
  // Format standard Vietnamese Currency
  const formattedVND = rawNum.toLocaleString('vi-VN') + ' ₫';
  const displayTotal = isContract ? `${formattedVND} / tháng` : formattedVND;

  return {
    id: `lead-${String(idx + 1).padStart(2, '0')}`,
    code: inq.code,
    inquiryCode: inq.code,
    customerCompany: inq.customerCompany,
    contactName: inq.contactPerson,
    contactRole: idx % 2 === 0 ? 'Giám đốc Chuỗi Cung Ứng' : 'Trưởng phòng Mua hàng & Logistics',
    contactPhone: idx === 0 ? '0908 123 456' : idx === 1 ? '0912 345 888' : idx === 2 ? '0978 999 222' : idx === 3 ? '0909 555 333' : '0933 666 888',
    contactEmail: idx === 0 ? 'hieu.le@abcprecision.com.vn' : idx === 1 ? 'mai.tran@vdfurniture.com' : 'procurement@shipper-logistics.vn',
    taxId: idx === 0 ? '0314892831' : idx === 1 ? '0309876543' : '0102938475',
    serviceType: inq.serviceType,
    origin: inq.origin,
    destination: inq.destination,
    route: inq.route || `${inq.origin} → ${inq.destination}`,
    pricingType: inq.pricingType || 'SPOT',
    contractTerm: inq.contractTerm || (isContract ? 'Hợp đồng 12 tháng' : 'Theo lô / Chuyến lẻ'),
    volumeDisplay: inq.committedVolume ? `${inq.committedVolume} Tờ khai / tháng` : inq.weightVolume,
    unitPriceVND: isContract ? Math.round(rawNum / 10) : rawNum,
    unitPriceDisplay: isContract ? `${Math.round(rawNum / 10).toLocaleString('vi-VN')} ₫ / kỳ` : formattedVND,
    estimatedValueVND: rawNum,
    estimatedValueDisplay: displayTotal,
    createdDate: inq.createdDate,
    dueDate: inq.expiryDate,
    status: leadStatus,
    cargoDetails: `${inq.cargoType} (${inq.weightVolume})`,
    urgency: idx === 0 || idx === 1 ? 'High Value' : idx === 2 ? 'Urgent' : 'Standard',
    matchScore: 94 + (idx % 5),
    quotesCount: inq.responsesCount,
    viewsCount: inq.viewsCount || 100,
    isUnlocked: false,
    isSaved: idx === 0,
    savedAt: inq.createdDate,
    source: idx === 0 ? 'SAVED' : 'UNLOCKED',
    sourceOrigin: 'LEAD_BOARD',
    sourceNotes: 'Lưu từ sàn Lead Board công khai',
    cargoClassification: inq.cargoClassification,
    packaging: inq.packaging,
    requestedSurcharges: inq.requestedSurcharges,
    selectedVAS: inq.selectedVAS,
    serviceSpecs: inq.serviceSpecs,
    inquiry: inq,
  };
});
