import { SalesSpecialistProfile } from '../types';

export const mockSalesSpecialists: SalesSpecialistProfile[] = [
  {
    id: 'sales-minh-tran',
    name: 'Minh Tran',
    vietnameseName: 'Trần Văn Minh',
    title: 'Senior Key Account Manager & Freight Solutions Director',
    companyId: 'supp-01',
    companyName: 'VinaTrans Logistics JSC',
    companyLogo: 'VT',
    avatarInitial: 'TM',
    phone: '+84 (0) 908 123 456',
    zaloPhone: '0908123456',
    email: 'minh.tran@vinatranslogistics.com',
    yearsOfExperience: 9,
    rating: 4.95,
    reviewsCount: 184,
    responseTime: '< 15 Phút',
    location: 'TP. Hồ Chí Minh & Hà Nội (Phụ trách Toàn quốc)',
    languages: ['Tiếng Việt (Bản ngữ)', 'English (Fluent - TOEIC 920)', 'Chinese (H SK 4 - Giao dịch)'],
    verifiedStatus: true,
    onlineStatus: 'ONLINE',
    bio: 'Chào anh/chị! Tôi là Minh Tran, chuyên viên tư vấn logistics cao cấp tại VinaTrans Logistics với hơn 9 năm kinh nghiệm trực tiếp điều phối và tối ưu chuỗi cung ứng cho các doanh nghiệp FDI, sản xuất điện tử, FMCG và xuất nhập khẩu. Cam kết giải pháp linh hoạt, bảo hiểm 100%, phản hồi RFQ trong 15 phút và hỗ trợ công nợ linh hoạt 30-45 ngày.',
    motto: '"Tối ưu chi phí thực tế – Đảm bảo hành trình chuẩn xác từng giờ"',
    specialties: [
      'Vận tải FTL Bắc - Nam (Xe 8T-15T-Container)',
      'Vận chuyển Container Cảng Cát Lái & Cái Mép',
      'Thủ tục Hải quan & C/O Form E, D, EUR.1',
      'Hợp đồng Logistics Dài hạn & Công nợ Net 45'
    ],
    profileViews: 14820,
    monthlyViews: 3450,
    todayViews: 128,
    viewGrowthPercentage: 28.4,
    viewerInteractions: {
      rfqRequestsCount: 245,
      consultationsCount: 92,
      rateDownloadsCount: 890,
      viewsLast7Days: [320, 345, 380, 410, 390, 440, 485]
    },
    keyMetrics: {
      shipmentsCount: '1,450+ TEUs / Chuyến',
      revenueManagedVND: '92.5 Tỷ VND (~$3.8M)',
      onTimeDeliveryRate: '99.6%',
      activeClientsCount: 48,
      satisfactionRate: '4.95 / 5.0',
      rfqResponseAvgMins: 12
    },
    achievements: [
      {
        id: 'ach-01',
        year: '2025',
        title: 'Top 1 Enterprise Key Account Director',
        organization: 'VinaTrans Logistics Annual Excellence Award',
        description: 'Đạt doanh số vận tải 42 tỷ VND năm 2025 với tỷ lệ giữ chân khách hàng (Retention Rate) 98.2%.',
        badgeIcon: 'Trophy'
      },
      {
        id: 'ach-02',
        year: '2024',
        title: 'Giải Pháp Tối Ưu Tuyến Bắc - Nam Xuất Sắc',
        organization: 'Vietnam Logistics Business Association (VLA)',
        description: 'Thiết kế mô hình kết hợp xe rỗng 2 chiều giúp tiết kiệm 16.5% chi phí cước cho nhóm doanh nghiệp cơ khí chính xác.',
        badgeIcon: 'Award'
      },
      {
        id: 'ach-03',
        year: '2023 - 2026',
        title: 'Chứng Chỉ Chuyên Gia Chuỗi Cung Ứng (CSCP) & AEO Customs Broker',
        organization: 'APICS & Tổng Cục Hải Quan Việt Nam',
        description: 'Đạt chứng chỉ thông quan chuyên nghiệp, hỗ trợ thông quan luồng vàng/đỏ nhanh chóng cho hơn 400 lô hàng/năm.',
        badgeIcon: 'ShieldCheck'
      },
      {
        id: 'ach-04',
        year: '2022',
        title: 'Quản Lý Điều Phối Dự Án Nhà Máy Điện Tử Bắc Ninh',
        organization: 'Tier-1 High-Tech Supplier Project',
        description: 'Vận chuyển an toàn 320 container máy móc siêu trường siêu trọng đạt chuẩn ISO 9001:2015 không một sự cố.',
        badgeIcon: 'Star'
      }
    ],
    services: [
      {
        id: 'srv-trucking',
        serviceType: 'Trucking',
        title: 'Vận Tải Đường Bộ FTL/LTL Tuyến Bắc - Trung - Nam',
        highlight: 'Đội xe 240+ chiếc, 2 tài xế/xe, GPS hành trình & cảm biến nhiệt độ 24/7',
        description: 'Cung cấp giải pháp xe tải kín, xe bạt, xe container 40ft/45ft từ TP.HCM, Bình Dương, Đồng Nai đi Đà Nẵng, Hà Nội, Hải Phòng, Bắc Ninh. Cam kết thời gian vận chuyển nhanh nhất thị trường.',
        keySpecs: ['Xe tải 5T, 8T, 15T, Container 40ft/45ft', 'Thời gian HCMC → Hà Nội: 48h cam kết', 'Bảo hiểm hàng hóa 100% đến 5 Tỷ VND/chuyến', 'App theo dõi lộ trình và nhiệt độ real-time'],
        suitableFor: 'Hàng điện tử, linh kiện, FMCG, may mặc, nguyên vật liệu sản xuất',
        slaCommitment: 'Giao hàng đúng hẹn 99.6% | Bồi thường 100% nếu thất thoát',
        pricingSummary: 'Từ 42,000,000 VND / chuyến xe 15T FTL HCMC - Hà Nội'
      },
      {
        id: 'srv-ocean',
        serviceType: 'Sea Freight (FCL)',
        title: 'Vận Tải Đường Biển Nội Địa & Quốc Tế FCL/LCL',
        highlight: 'Hợp đồng chỗ ưu tiên với Maersk, ONE, MSC, Cosco & Tàu nội địa',
        description: 'Vận chuyển container đường biển tuyến Hải Phòng - Cát Lái - Cái Mép - Đà Nẵng và các tuyến xuất nhập khẩu Intra-Asia, US, EU. Miễn phí lưu bãi container (Demurrage) lên đến 14 ngày.',
        keySpecs: ['Container 20ft GP, 40ft GP, 40ft HQ, Reefer', 'Lịch tàu cố định 3 chuyến/tuần', 'Dịch vụ kéo container (Drayage) trọn gói', 'Free Demurrage & Detention 7-14 ngày'],
        suitableFor: 'Hàng khối lượng lớn, nông sản, hóa chất, gốm sứ, hàng nặng tiết kiệm chi phí',
        slaCommitment: 'Không rớt tàu (No Rollover Guarantee) các chuyến cố định',
        pricingSummary: 'Từ 8,500,000 VND / cont 40ft Hải Phòng - Cát Lái'
      },
      {
        id: 'srv-customs',
        serviceType: 'Customs Clearance',
        title: 'Đại Lý Thủ Tục Hải Quan & Kiểm Tra Chuyên Ngành',
        highlight: 'Đại lý Hải quan chứng nhận AEO, thông quan nhanh trong 3 - 6 giờ',
        description: 'Tư vấn mã HS Code chính xác, lập tờ khai hải quan điện tử VNACCS/VCIS, xin giấy phép xuất nhập khẩu, kiểm dịch thực vật/động vật, xin C/O tất cả các form (Form E, D, AK, AJ, EUR.1, CPTPP).',
        keySpecs: ['Thông quan tại Cát Lái, Cái Mép, Hải Phòng, Tân Sơn Nhất, Nội Bài', 'Tư vấn tối ưu thuế suất nhập khẩu', 'Xử lý luồng Vàng, luồng Đỏ chuyên nghiệp', 'Báo cáo quyết toán hải quan định kỳ'],
        suitableFor: 'Doanh nghiệp FDI, nhà máy gia công, công ty thương mại xuất nhập khẩu',
        slaCommitment: 'Thông quan luồng Xanh/Vàng < 4h | Luồng Đỏ < 24h',
        pricingSummary: 'Từ 800,000 VND / tờ khai hải quan'
      },
      {
        id: 'srv-warehousing',
        serviceType: 'Warehousing',
        title: 'Hệ Thống Kho Bãi & Trung Tâm Phân Phối 3PL',
        highlight: '65,000 m² kho tiêu chuẩn & kho ngoại quan tại Sóng Thần, Long Hậu, Bắc Ninh',
        description: 'Hạ tầng kho hiện đại trang bị kệ selective/drive-in, hệ thống quản lý WMS tích hợp API thời gian thực, PCCC tự động, bảo vệ an ninh 24/7, dịch vụ đóng gói, dán tem nhãn phụ, phân phối chặng cuối.',
        keySpecs: ['Sàn kho chịu lực 5 tấn/m², dock leveler tự động', 'Phần mềm WMS quản lý tồn kho theo lô/date/serial', 'Camera an ninh CCTV 24/7 & PCCC đạt chuẩn', 'Dịch vụ cross-docking, pick & pack linh hoạt'],
        suitableFor: 'Hàng tiêu dùng nhanh, nguyên vật liệu dự trữ, hàng bán lẻ đa kênh Omnichannel',
        slaCommitment: 'Độ chính xác tồn kho 99.9% | Xuất kho trong 60 phút',
        pricingSummary: 'Từ 110,000 VND / m² / tháng hoặc theo pallet'
      },
      {
        id: 'srv-air',
        serviceType: 'Air Freight',
        title: 'Vận Tải Hàng Không Hỏa Tốc Quốc Tế & Nội Địa',
        highlight: 'Đại lý IATA chính thức - Booking bay trong ngày tại TSN & Nội Bài',
        description: 'Dịch vụ vận chuyển đường bay ưu tiên cao cho hàng mẫu, linh kiện điện tử khẩn cấp, dược phẩm y tế, chứng từ quan trọng. Kết nối trực tiếp với Vietnam Airlines, Singapore Airlines, Korean Air, Cathay Pacific.',
        keySpecs: ['Dịch vụ Next-Flight-Out (NFO)', 'Đóng gói hàng nguy hiểm (DG) chuẩn IATA', 'Giao nhận Door-to-Door trọn gói', 'Theo dõi chuyến bay trực tiếp qua AWB'],
        suitableFor: 'Linh kiện công nghệ cao, hàng giá trị cao, hàng mẫu khẩn, dược phẩm',
        slaCommitment: 'Nhận hàng và bay trong vòng 12h | Giao tận nơi trong 24h',
        pricingSummary: 'Từ 28,000 VND / kg (Nội địa) hoặc $2.40 / kg (Intra-Asia)'
      },
      {
        id: 'srv-cold',
        serviceType: 'Cold Chain',
        title: 'Chuỗi Cung Ứng Vận Tải Lạnh Đa Nhiệt Độ (-25°C đến +18°C)',
        highlight: 'Thùng xe Thermo King chuẩn Châu Âu, giám sát nhiệt độ GPS IoT liên tục',
        description: 'Vận tải hàng đông lạnh, hàng mát chuyên biệt: thủy hải sản xuất khẩu, thịt nhập khẩu, kem, sữa, trái cây tươi, vaccine và dược phẩm. In biểu đồ nhiệt độ tự động khi giao hàng.',
        keySpecs: ['Dải nhiệt độ cài đặt linh hoạt từ -25°C đến +18°C', 'Thiết bị ghi nhiệt độ tự động Data Logger & IoT', 'Khử trùng thùng xe đạt chuẩn An toàn Vệ sinh Thực phẩm', 'Đội ngũ lái xe đào tạo chuyên môn vận hành máy lạnh'],
        suitableFor: 'Dược phẩm, sinh phẩm y tế, thực phẩm đông lạnh, nông sản tươi xuất khẩu',
        slaCommitment: 'Duy trì nhiệt độ chuẩn 100% hành trình | Bù 100% nếu hỏng nhiệt',
        pricingSummary: 'Từ 56,000,000 VND / chuyến xe lạnh 15T HCMC - Hà Nội'
      }
    ],
    rateCard: [
      // Domestic Trucking
      {
        id: 'rc-trk-01',
        category: 'Trucking',
        tradeLaneRegion: 'Domestic',
        routeOrService: 'TP. Hồ Chí Minh ↔ Hà Nội (FTL Bắc - Nam)',
        vehicleOrUnit: 'Xe tải 15 Tấn (Kín / Bạt)',
        transitTime: '48 Giờ (2 Ngày)',
        benchmarkPriceVND: 42000000,
        benchmarkPriceDisplay: '42,000,000 VND',
        priceNotes: 'Đã bao gồm phí cầu đường, nhiên liệu & 2 tài xế. Chưa gồm VAT.',
        includedPerks: ['GPS Realtime', 'Bảo hiểm 2 Tỷ VND', 'Bốc dỡ 2 đầu hỗ trợ', 'Công nợ Net 30/45'],
        isPopular: true
      },
      {
        id: 'rc-trk-02',
        category: 'Trucking',
        tradeLaneRegion: 'Domestic',
        routeOrService: 'TP. Hồ Chí Minh ↔ Đà Nẵng / Huế',
        vehicleOrUnit: 'Xe tải 10 Tấn (Kín / Bạt)',
        transitTime: '24 - 30 Giờ',
        benchmarkPriceVND: 22500000,
        benchmarkPriceDisplay: '22,500,000 VND',
        priceNotes: 'Chạy thẳng quốc lộ 1A / Cao tốc. Lộ trình cập nhật tự động.',
        includedPerks: ['GPS Realtime', 'Bảo hiểm 1 Tỷ VND', 'Miễn phí lưu ca 12h'],
        isPopular: true
      },
      {
        id: 'rc-trk-03',
        category: 'Trucking',
        tradeLaneRegion: 'Domestic',
        routeOrService: 'Bình Dương / Đồng Nai ↔ Cảng Cát Lái / Cái Mép',
        vehicleOrUnit: 'Kéo Container 40ft / 45ft',
        transitTime: 'Trong ngày (4 - 8 Giờ)',
        benchmarkPriceVND: 3800000,
        benchmarkPriceDisplay: '3,800,000 VND',
        priceNotes: 'Đã bao gồm hạ bãi hoặc nhận cont rỗng tại Depot chỉ định.',
        includedPerks: ['Tài xế chuyên nghiệp', 'Cập nhật số seal ngay khi bấm', 'Hỗ trợ thủ tục cổng cảng'],
        isPopular: false
      },
      {
        id: 'rc-trk-04',
        category: 'Trucking',
        tradeLaneRegion: 'Domestic',
        routeOrService: 'TP. Hồ Chí Minh ↔ Cần Thơ / Đồng bằng Sông Cửu Long',
        vehicleOrUnit: 'Xe tải 8 Tấn Thùng Kín',
        transitTime: '6 - 10 Giờ',
        benchmarkPriceVND: 6200000,
        benchmarkPriceDisplay: '6,200,000 VND',
        priceNotes: 'Tuyến miền Tây hàng ngày, nhận phân phối đại lý chặng cuối.',
        includedPerks: ['Giao nhiều điểm (Multi-drop)', 'Biên bản giao nhận POD điện tử'],
        isPopular: false
      },
      {
        id: 'rc-trk-05',
        category: 'Trucking',
        tradeLaneRegion: 'Domestic',
        routeOrService: 'Hà Nội ↔ Cảng Hải Phòng / Đình Vũ / Lạch Huyện',
        vehicleOrUnit: 'Kéo Container 40ft',
        transitTime: '3 - 5 Giờ',
        benchmarkPriceVND: 4900000,
        benchmarkPriceDisplay: '4,900,000 VND',
        priceNotes: 'Chạy cao tốc Hà Nội - Hải Phòng, điều xe trong 2 giờ.',
        includedPerks: ['Đội xe túc trực 24/7', 'Hỗ trợ lấy DO và cược vỏ'],
        isPopular: false
      },

      // =========================================================================
      // CÁC TUYẾN CHÍNH QUỐC TẾ (7 MAIN INTERNATIONAL TRADE LANES)
      // =========================================================================
      
      // 1. Tuyến Bắc Mỹ (North America) - 2,692 tuyến
      {
        id: 'rc-ocn-na-01',
        category: 'Ocean',
        tradeLaneRegion: 'NorthAmerica',
        shippingLine: 'ONE / COSCO (The Alliance)',
        pol: 'Cái Mép (VNTCK)',
        pod: 'Los Angeles / Long Beach (USLAX/USLGB)',
        routeOrService: 'Cái Mép (VN) ↔ Los Angeles / Long Beach (Bờ Tây Bắc Mỹ)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '16 - 18 Ngày (Tàu Chạy Thẳng Direct)',
        benchmarkPriceVND: 73500000,
        benchmarkPriceDisplay: '73,500,000 VND (~$2,890 USD)',
        usdPrice: 2890,
        priceNotes: 'Đã gồm cước biển O/F, BAF & PSS. Free Dem/Det 14 ngày tại cảng đến.',
        includedPerks: ['Tàu chạy thẳng không chuyển tải', 'Cam kết giữ chỗ mùa cao điểm', 'Free Dem/Det 14 ngày', 'Hỗ trợ khai AMS/ISF 10+2'],
        isPopular: true
      },
      {
        id: 'rc-ocn-na-02',
        category: 'Ocean',
        tradeLaneRegion: 'NorthAmerica',
        shippingLine: 'Maersk / MSC (2M Alliance)',
        pol: 'Cái Mép (VNTCK)',
        pod: 'New York / New Jersey (USNYC)',
        routeOrService: 'Cái Mép (VN) ↔ New York / New Jersey (Bờ Đông Bắc Mỹ qua kênh đào Suez/Panama)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '26 - 29 Ngày',
        benchmarkPriceVND: 98000000,
        benchmarkPriceDisplay: '98,000,000 VND (~$3,850 USD)',
        usdPrice: 3850,
        priceNotes: 'Hợp đồng Service Contract cố định quý. Đảm bảo vỏ cont sạch tiêu chuẩn xuất khẩu.',
        includedPerks: ['Kẹp chì hải quan điện tử', 'Free Dem/Det 10 ngày', 'Cập nhật định vị tàu hàng ngày'],
        isPopular: true
      },
      {
        id: 'rc-ocn-na-03',
        category: 'Ocean',
        tradeLaneRegion: 'NorthAmerica',
        shippingLine: 'ZIM / Evergreen',
        pol: 'Hải Phòng (VNHPH)',
        pod: 'Vancouver (CAVAN - Canada)',
        routeOrService: 'Hải Phòng (VN) ↔ Vancouver / Prince Rupert (Canada - Bắc Mỹ)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '19 - 22 Ngày',
        benchmarkPriceVND: 46000000,
        benchmarkPriceDisplay: '46,000,000 VND (~$1,810 USD)',
        usdPrice: 1810,
        priceNotes: 'Kết nối đường sắt liên vận trực tiếp về Toronto / Montreal.',
        includedPerks: ['Khai báo eManifest Canada', 'Hỗ trợ kiểm dịch gỗ hun trùng'],
        isPopular: false
      },

      // 2. Tuyến Châu Á (Asia / Intra-Asia) - 4,011 tuyến
      {
        id: 'rc-ocn-asia-01',
        category: 'Ocean',
        tradeLaneRegion: 'Asia',
        shippingLine: 'SITC / Wanhai Lines',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Thượng Hải / Ninh Ba (CNSHA/CNNGB)',
        routeOrService: 'Cát Lái (VN) ↔ Thượng Hải / Ninh Ba / Thâm Quyến (Đông Bắc Á)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '4 - 6 Ngày',
        benchmarkPriceVND: 6800000,
        benchmarkPriceDisplay: '6,800,000 VND (~$265 USD)',
        usdPrice: 265,
        priceNotes: 'Lịch tàu 4 chuyến/tuần. Hỗ trợ cấp C/O Form E ưu đãi thuế xuất sang Trung Quốc.',
        includedPerks: ['Free Demurrage 14 ngày', 'Booking phát hành trong 1 giờ', 'Hỗ trợ C/O Form E'],
        isPopular: true
      },
      {
        id: 'rc-ocn-asia-02',
        category: 'Ocean',
        tradeLaneRegion: 'Asia',
        shippingLine: 'CNC (CMA CGM) / ONE',
        pol: 'Cái Mép (VNTCK)',
        pod: 'Singapore Port (SGSIN)',
        routeOrService: 'Cái Mép (VN) ↔ Singapore Hub (Đông Nam Á)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '2 - 3 Ngày',
        benchmarkPriceVND: 4200000,
        benchmarkPriceDisplay: '4,200,000 VND (~$165 USD)',
        usdPrice: 165,
        priceNotes: 'Tuyến Feeder cao tốc kết nối trung tâm chuyển tải Đông Nam Á.',
        includedPerks: ['Xác nhận booking tức thì', 'Hỗ trợ cấp SI & VGM điện tử'],
        isPopular: false
      },
      {
        id: 'rc-ocn-asia-03',
        category: 'Ocean',
        tradeLaneRegion: 'Asia',
        shippingLine: 'KMTC / Sinokor',
        pol: 'Hải Phòng (VNHPH)',
        pod: 'Busan / Incheon (KRPUS/KRINC)',
        routeOrService: 'Hải Phòng (VN) ↔ Busan / Incheon (Hàn Quốc - Đông Bắc Á)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '5 - 7 Ngày',
        benchmarkPriceVND: 8400000,
        benchmarkPriceDisplay: '8,400,000 VND (~$330 USD)',
        usdPrice: 330,
        priceNotes: 'Tuyến chuyên tuyến hàng linh kiện điện tử và may mặc xuất Hàn.',
        includedPerks: ['Free Dem 10 ngày', 'Cấp C/O Form AK/VK ưu đãi thuế quan'],
        isPopular: false
      },
      {
        id: 'rc-ocn-asia-04',
        category: 'Ocean',
        tradeLaneRegion: 'Asia',
        shippingLine: 'RCL / TS Lines',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Nhava Sheva / Mundra (INNSA/INMUN)',
        routeOrService: 'Cát Lái (VN) ↔ Nhava Sheva / Mundra (Ấn Độ & Nam Á)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '12 - 14 Ngày',
        benchmarkPriceVND: 18500000,
        benchmarkPriceDisplay: '18,500,000 VND (~$730 USD)',
        usdPrice: 730,
        priceNotes: 'Bao gồm phụ phí CIC & EBS tại cảng dỡ. Phù hợp hàng nông sản, cao su, hạt tiêu.',
        includedPerks: ['Free Dem/Det 14 ngày tại Ấn Độ', 'Cấp C/O Form AI'],
        isPopular: false
      },

      // 3. Tuyến Châu Âu (Europe) - 3,037 tuyến
      {
        id: 'rc-ocn-eu-01',
        category: 'Ocean',
        tradeLaneRegion: 'Europe',
        shippingLine: 'Hapag-Lloyd / ONE / MSC',
        pol: 'Cái Mép (VNTCK)',
        pod: 'Rotterdam / Hamburg / Antwerp (NLRTM/DEHAM/BEANR)',
        routeOrService: 'Cái Mép (VN) ↔ Rotterdam / Hamburg / Antwerp (Bắc Âu / Tây Âu)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '23 - 26 Ngày (Tàu Chạy Thẳng)',
        benchmarkPriceVND: 89000000,
        benchmarkPriceDisplay: '89,000,000 VND (~$3,500 USD)',
        usdPrice: 3500,
        priceNotes: 'Đã bao gồm phụ phí ETS carbon Châu Âu & LSS. Tuân thủ tiêu chuẩn EU Green Logistics.',
        includedPerks: ['Tàu mẹ đi thẳng không rớt cont', 'Hỗ trợ C/O Form EUR.1', 'Free Dem/Det 10 ngày'],
        isPopular: true
      },
      {
        id: 'rc-ocn-eu-02',
        category: 'Ocean',
        tradeLaneRegion: 'Europe',
        shippingLine: 'CMA CGM / Evergreen',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Genoa / Valencia / Barcelona (ITGOA/ESVLC)',
        routeOrService: 'Cát Lái (VN) ↔ Genoa / Valencia (Khu Vực Địa Trung Hải - Med Ports)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '22 - 25 Ngày',
        benchmarkPriceVND: 52000000,
        benchmarkPriceDisplay: '52,000,000 VND (~$2,050 USD)',
        usdPrice: 2050,
        priceNotes: 'Phù hợp hàng thủy sản đông lạnh, cà phê, hạt điều xuất khẩu Nam Âu.',
        includedPerks: ['Khai báo hải quan ENS Châu Âu', 'Kiểm dịch y tế EU Certificate'],
        isPopular: false
      },

      // 4. Tuyến Châu Đại Dương (Oceania) - 1,523 tuyến
      {
        id: 'rc-ocn-oc-01',
        category: 'Ocean',
        tradeLaneRegion: 'Oceania',
        shippingLine: 'ANL (CMA CGM) / Maersk',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Sydney / Melbourne / Brisbane (AUSYD/AUMEL/AUBNE)',
        routeOrService: 'Cát Lái (VN) ↔ Sydney / Melbourne (Châu Đại Dương - Úc)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '15 - 18 Ngày',
        benchmarkPriceVND: 48000000,
        benchmarkPriceDisplay: '48,000,000 VND (~$1,890 USD)',
        usdPrice: 1890,
        priceNotes: 'Dịch vụ direct hàng tuần. Hỗ trợ xử lý chứng thư sinh học BMSB mùa cao điểm.',
        includedPerks: ['Xử lý chứng thư sinh học BMSB', 'Free Dem/Det 10 ngày', 'C/O Form AANZFTA'],
        isPopular: true
      },
      {
        id: 'rc-ocn-oc-02',
        category: 'Ocean',
        tradeLaneRegion: 'Oceania',
        shippingLine: 'PIL / COSCO',
        pol: 'Hải Phòng (VNHPH)',
        pod: 'Auckland / Tauranga (NZAKL/NZTRG)',
        routeOrService: 'Hải Phòng (VN) ↔ Auckland / Tauranga (New Zealand - Châu Đại Dương)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '20 - 24 Ngày',
        benchmarkPriceVND: 34000000,
        benchmarkPriceDisplay: '34,000,000 VND (~$1,340 USD)',
        usdPrice: 1340,
        priceNotes: 'Bao gồm phụ phí cầu cảng và kiểm dịch nông lâm sản New Zealand MPI.',
        includedPerks: ['C/O Form AANZFTA miễn thuế', 'Theo dõi lộ trình vệ tinh'],
        isPopular: false
      },

      // 5. Tuyến Châu Phi (Africa) - 1,640 tuyến
      {
        id: 'rc-ocn-af-01',
        category: 'Ocean',
        tradeLaneRegion: 'Africa',
        shippingLine: 'Safmarine (Maersk) / MSC',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Durban / Cape Town (ZADUR/ZACPT)',
        routeOrService: 'Cát Lái (VN) ↔ Durban / Cape Town (Nam Phi / Châu Phi)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '24 - 28 Ngày',
        benchmarkPriceVND: 43000000,
        benchmarkPriceDisplay: '43,000,000 VND (~$1,690 USD)',
        usdPrice: 1690,
        priceNotes: 'Chuyên chở gạo, vật liệu xây dựng, săm lốp xe. Free Dem 14 ngày tại Durban.',
        includedPerks: ['Free Demurrage 14 ngày', 'Chứng từ vận tải đích danh gốc BL'],
        isPopular: false
      },
      {
        id: 'rc-ocn-af-02',
        category: 'Ocean',
        tradeLaneRegion: 'Africa',
        shippingLine: 'CMA CGM / Messina Line',
        pol: 'Cái Mép (VNTCK)',
        pod: 'Alexandria / Damietta (EGALY/EGDAM)',
        routeOrService: 'Cái Mép (VN) ↔ Alexandria / Cairo (Ai Cập & Bắc Phi)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '22 - 26 Ngày',
        benchmarkPriceVND: 66000000,
        benchmarkPriceDisplay: '66,000,000 VND (~$2,600 USD)',
        usdPrice: 2600,
        priceNotes: 'Tuyến direct qua Biển Đỏ/Kênh Suez. Hỗ trợ hệ thống ACI Acid Ai Cập.',
        includedPerks: ['Khai báo mã số ACI Acid số', 'Hỗ trợ hợp pháp hóa lãnh sự chứng từ'],
        isPopular: false
      },

      // 6. Tuyến Mỹ La Tinh và Caribê (Latin America & Caribbean) - 1,890 tuyến
      {
        id: 'rc-ocn-la-01',
        category: 'Ocean',
        tradeLaneRegion: 'LatinAmerica',
        shippingLine: 'Hamburg Süd / MSC',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Santos / Paranagua (BRSSZ/BRPNG)',
        routeOrService: 'Cát Lái (VN) ↔ Santos / Paranagua (Brazil - Mỹ La Tinh)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '35 - 40 Ngày',
        benchmarkPriceVND: 78000000,
        benchmarkPriceDisplay: '78,000,000 VND (~$3,070 USD)',
        usdPrice: 3070,
        priceNotes: 'Phù hợp hàng điện gia dụng, dệt may, sợi nhân tạo xuất Brazil.',
        includedPerks: ['Free Dem/Det 14 ngày', 'Kiểm tra chuẩn chứng từ hải quan Mercosur'],
        isPopular: true
      },
      {
        id: 'rc-ocn-la-02',
        category: 'Ocean',
        tradeLaneRegion: 'LatinAmerica',
        shippingLine: 'Hapag-Lloyd / CMA CGM',
        pol: 'Cái Mép (VNTCK)',
        pod: 'Valparaiso / Callao (CLVAP/PECLL)',
        routeOrService: 'Cái Mép (VN) ↔ Valparaiso / Callao (Chile & Peru - Bờ Tây Mỹ La Tinh)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '32 - 36 Ngày',
        benchmarkPriceVND: 49000000,
        benchmarkPriceDisplay: '49,000,000 VND (~$1,930 USD)',
        usdPrice: 1930,
        priceNotes: 'Áp dụng biểu thuế ưu đãi CPTPP giữa Việt Nam và Chile / Peru.',
        includedPerks: ['C/O Form CPTPP hưởng thuế 0%', 'Free Dem 10 ngày'],
        isPopular: false
      },

      // 7. Tuyến Trung Đông (Middle East) - 2,365 tuyến
      {
        id: 'rc-ocn-me-01',
        category: 'Ocean',
        tradeLaneRegion: 'MiddleEast',
        shippingLine: 'Emirates Shipping Line (ESL) / MSC',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Jebel Ali / Dubai (AEJEA)',
        routeOrService: 'Cát Lái (VN) ↔ Jebel Ali / Dubai (UAE - Trung Đông)',
        vehicleOrUnit: 'Container 40ft HQ',
        transitTime: '13 - 16 Ngày',
        benchmarkPriceVND: 44000000,
        benchmarkPriceDisplay: '44,000,000 VND (~$1,730 USD)',
        usdPrice: 1730,
        priceNotes: 'Tuyến direct hàng tuần kết nối trung tâm phân phối thương mại Trung Đông.',
        includedPerks: ['Free Dem/Det 14 ngày tại Jebel Ali', 'Hỗ trợ chứng nhận Halal'],
        isPopular: true
      },
      {
        id: 'rc-ocn-me-02',
        category: 'Ocean',
        tradeLaneRegion: 'MiddleEast',
        shippingLine: 'COSCO / CMA CGM',
        pol: 'Hải Phòng (VNHPH)',
        pod: 'Dammam / Jeddah (SADMM/SAJED)',
        routeOrService: 'Hải Phòng (VN) ↔ Dammam / Jeddah (Saudi Arabia - Trung Đông)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '18 - 22 Ngày',
        benchmarkPriceVND: 31000000,
        benchmarkPriceDisplay: '31,000,000 VND (~$1,220 USD)',
        usdPrice: 1220,
        priceNotes: 'Đã bao gồm phụ phí an ninh Vùng Vịnh. Cung cấp chứng thư SABER xuất khẩu Saudi.',
        includedPerks: ['Hỗ trợ chứng nhận hợp quy SABER', 'Free Dem 12 ngày'],
        isPopular: false
      },

      // Ocean Domestic
      {
        id: 'rc-ocn-dom-01',
        category: 'Ocean',
        tradeLaneRegion: 'Domestic',
        shippingLine: 'Vinalines / Vosco',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Hải Phòng (VNHPH)',
        routeOrService: 'Cảng Cát Lái (HCMC) ↔ Cảng Hải Phòng (Đường Biển Nội Địa)',
        vehicleOrUnit: 'Container 40ft GP / HQ',
        transitTime: '3 - 4 Ngày',
        benchmarkPriceVND: 8500000,
        benchmarkPriceDisplay: '8,500,000 VND',
        priceNotes: 'Bao gồm cước biển (O/F) và phụ phí nhiên liệu BAF. Tiết kiệm 65% so với đường bộ.',
        includedPerks: ['Free Demurrage 7 ngày', 'Lịch tàu 3 chuyến/tuần', 'Theo dõi vị trí tàu'],
        isPopular: true
      },
      {
        id: 'rc-ocn-dom-02',
        category: 'Ocean',
        tradeLaneRegion: 'Domestic',
        shippingLine: 'Glory Maritime',
        pol: 'Cát Lái (VNSGN)',
        pod: 'Đà Nẵng (VNDAD)',
        routeOrService: 'Cảng Cát Lái ↔ Cảng Đà Nẵng (Đường Biển Nội Địa)',
        vehicleOrUnit: 'Container 20ft GP',
        transitTime: '2 - 3 Ngày',
        benchmarkPriceVND: 5200000,
        benchmarkPriceDisplay: '5,200,000 VND',
        priceNotes: 'Tuyến feeder cố định hàng tuần. Thích hợp hàng vật liệu xây dựng, tiêu dùng.',
        includedPerks: ['Free Demurrage 10 ngày', 'Cung cấp vỏ cont sạch đạt chuẩn'],
        isPopular: false
      },

      // Cold Chain
      {
        id: 'rc-cld-01',
        category: 'ColdChain',
        routeOrService: 'TP. Hồ Chí Minh ↔ Hà Nội (Xe Đông Lạnh -18°C)',
        vehicleOrUnit: 'Xe tải Lạnh 15 Tấn (Thermo King)',
        transitTime: '48 Giờ',
        benchmarkPriceVND: 56000000,
        benchmarkPriceDisplay: '56,000,000 VND',
        priceNotes: 'Duy trì liên tục -18°C đến -22°C, có biểu đồ nhiệt độ tự động bàn giao khách hàng.',
        includedPerks: ['Cảm biến nhiệt IoT 5 phút/lần', 'Bảo hiểm hư hỏng nhiệt 100%', 'Tài xế chuyên lạnh'],
        isPopular: true
      },
      {
        id: 'rc-cld-02',
        category: 'ColdChain',
        routeOrService: 'Đà Lạt / Lâm Đồng ↔ TP. Hồ Chí Minh (Rau củ & Hoa tươi +2°C đến +8°C)',
        vehicleOrUnit: 'Xe tải Lạnh 8 Tấn',
        transitTime: '8 - 10 Giờ (Giao sáng sớm)',
        benchmarkPriceVND: 9800000,
        benchmarkPriceDisplay: '9,800,000 VND',
        priceNotes: 'Hút ẩm, kiểm soát độ ẩm và nhiệt độ mát cho nông sản cao cấp.',
        includedPerks: ['Bốc xếp nhẹ tay chuyên nghiệp', 'Giao tận kho lạnh chợ đầu mối hoặc siêu thị'],
        isPopular: false
      },

      // Air Freight
      {
        id: 'rc-air-01',
        category: 'Air',
        routeOrService: 'Tân Sơn Nhất (SGN) ↔ Nội Bài (HAN) - Air Express Hỏa Tốc',
        vehicleOrUnit: 'Theo Kilogram (Lô > 100 kg)',
        transitTime: 'Trong ngày (6 - 12 Giờ)',
        benchmarkPriceVND: 28000,
        benchmarkPriceDisplay: '28,000 VND / kg',
        priceNotes: 'Đã gồm cước bay và phụ phí an ninh soi chiếu. Chưa gồm phí xe lấy/giao tận nơi.',
        includedPerks: ['Ưu tiên xếp hàng bay ngay chuyến kế tiếp', 'Theo dõi AWB thời gian thực'],
        isPopular: true
      },
      {
        id: 'rc-air-02',
        category: 'Air',
        routeOrService: 'Tân Sơn Nhất (SGN) ↔ Tokyo Narita (NRT) / Seoul Incheon (ICN)',
        vehicleOrUnit: 'Theo Kilogram (Lô > 300 kg)',
        transitTime: '24 Giờ (Bay thẳng)',
        benchmarkPriceVND: 65000,
        benchmarkPriceDisplay: '65,000 VND / kg (~$2.55/kg)',
        priceNotes: 'Cước bay thẳng Vietnam Airlines / Korean Air. Khối lượng tính cước theo chuẩn IATA 1:6000.',
        includedPerks: ['Hỗ trợ đóng gói tem nhãn IATA', 'Khai hải quan sân bay trọn gói'],
        isPopular: false
      },

      // Customs
      {
        id: 'rc-cus-01',
        category: 'Customs',
        routeOrService: 'Dịch vụ Khai thuê Hải quan Xuất/Nhập khẩu (Luồng Xanh & Vàng)',
        vehicleOrUnit: 'Theo Bộ Tờ Khai Hải Quan',
        transitTime: '2 - 4 Giờ',
        benchmarkPriceVND: 800000,
        benchmarkPriceDisplay: '800,000 VND / tờ khai',
        priceNotes: 'Áp dụng cho 1 - 3 dòng hàng đầu tiên. Dòng hàng phát sinh 50,000 VND/dòng.',
        includedPerks: ['Kiểm tra HS Code & Thuế miễn phí', 'Truyền tờ khai VNACCS 24/7', 'Bàn giao tờ khai thông quan điện tử'],
        isPopular: true
      },
      {
        id: 'rc-cus-02',
        category: 'Customs',
        routeOrService: 'Dịch vụ Kiểm Hóa Hải Quan (Luồng Đỏ)',
        vehicleOrUnit: 'Theo Container hoặc Lô Hàng',
        transitTime: '12 - 24 Giờ',
        benchmarkPriceVND: 1500000,
        benchmarkPriceDisplay: '1,500,000 VND / cont',
        priceNotes: 'Nhân viên túc trực tại cảng, làm việc với công chức kiểm hóa và giám sát bấm seal mới.',
        includedPerks: ['Rút hàng kiểm tra an toàn', 'Chụp ảnh bằng chứng niêm phong chi tiết'],
        isPopular: false
      },
      {
        id: 'rc-cus-03',
        category: 'Customs',
        routeOrService: 'Xin Giấy Chứng Nhận Xuất Xứ Hàng Hóa (C/O Form E, D, AK, EUR.1)',
        vehicleOrUnit: 'Theo Bộ Hồ Sơ',
        transitTime: '1 - 2 Ngày làm việc',
        benchmarkPriceVND: 600000,
        benchmarkPriceDisplay: '600,000 VND / bộ',
        priceNotes: 'Chuẩn bị hồ sơ hoàn chỉnh nộp VCCI hoặc Phòng Quản lý Xuất nhập khẩu Bộ Công Thương.',
        includedPerks: ['Tư vấn tiêu chí xuất xứ RVC/CTC', 'Giao tận tay bản gốc C/O'],
        isPopular: false
      }
    ],
    testimonials: [
      {
        id: 'tst-01',
        clientName: 'Anh Hieu Le',
        clientRole: 'Head of Procurement & Supply Chain',
        clientCompany: 'ABC Manufacturing Co., Ltd.',
        avatarInitial: 'HL',
        rating: 5,
        date: '15/08/2026',
        routeHandled: 'Tuyến xe 15T FTL TP.HCM → Hà Nội (Định kỳ 12 chuyến/tháng)',
        content: 'Minh Tran là một trong những chuyên viên logistics làm việc tận tâm và chuyên nghiệp nhất mà tôi từng hợp tác. Khi nhà máy chúng tôi gặp sự cố giao hàng gấp cho đối tác điện tử tại Hà Nội, Minh đã điều phối ngay xe 15T trong vòng 45 phút và giao hàng sớm hơn cam kết 4 tiếng. Chi phí minh bạch, không phát sinh phụ phí ẩn.'
      },
      {
        id: 'tst-02',
        clientName: 'Chị Mai Phuong',
        clientRole: 'Logistics Operations Director',
        clientCompany: 'Thang Long Precision Engineering',
        avatarInitial: 'MP',
        rating: 5,
        date: '02/08/2026',
        routeHandled: 'Kéo 85 Cont 40ft Cát Lái ↔ Khu Công Nghiệp Sóng Thần',
        content: 'Làm việc với Minh cực kỳ an tâm. Hệ thống cập nhật GPS và hình ảnh giao hàng tự động giúp team chúng tôi không cần phải liên tục gọi điện kiểm tra tài xế. Hợp đồng và hóa đơn VAT điện tử chuẩn chỉnh theo từng tháng.'
      },
      {
        id: 'tst-03',
        clientName: 'Anh Quoc Bao',
        clientRole: 'Import-Export Senior Manager',
        clientCompany: 'VinaPharma Global Trade',
        avatarInitial: 'QB',
        rating: 5,
        date: '22/07/2026',
        routeHandled: 'Thủ tục hải quan luồng Vàng/Đỏ & Vận tải lạnh dược phẩm',
        content: 'Minh tư vấn mã HS code rất chuẩn xác giúp công ty chúng tôi tiết kiệm được hơn 120 triệu tiền thuế nhập khẩu hợp pháp. Thái độ phục vụ 24/7, luôn sẵn sàng giải đáp thắc mắc bất kể ngày đêm.'
      }
    ],
    certifications: [
      'ISO 9001:2015 Quality Management in Freight Forwarding',
      'AEO Authorized Economic Operator Customs Specialist',
      'APICS Certified Supply Chain Professional (CSCP)',
      'FIATA International Freight Forwarder Certification',
      'IATA Cargo Agent Qualified Professional'
    ]
  },
  {
    id: 'sales-linh-nguyen',
    name: 'Linh Nguyen',
    vietnameseName: 'Nguyễn Thị Mai Linh',
    title: 'Cold Chain & Express Logistics Solution Lead',
    companyId: 'supp-02',
    companyName: 'Mekong Express Logistics',
    companyLogo: 'ME',
    avatarInitial: 'LN',
    phone: '+84 (0) 912 888 999',
    zaloPhone: '0912888999',
    email: 'linh.nguyen@mekongexpress.com',
    yearsOfExperience: 7,
    rating: 4.91,
    reviewsCount: 118,
    responseTime: '< 10 Phút',
    location: 'TP. Hồ Chí Minh & Cần Thơ (Phụ trách Miền Tây & Xuyên Biên Giới)',
    languages: ['Tiếng Việt', 'English (Business)', 'Cambodian Khmer (Giao tiếp cơ bản)'],
    verifiedStatus: true,
    onlineStatus: 'ONLINE',
    bio: 'Chuyên gia giải pháp chuỗi cung ứng lạnh và vận tải xuyên biên giới Việt Nam - Campuchia - Thái Lan. Kinh nghiệm 7 năm phục vụ các doanh nghiệp xuất khẩu thủy hải sản, nông sản tươi sống và dược phẩm GDP.',
    motto: '"Kiểm soát nhiệt độ chuẩn xác – Giữ trọn giá trị tươi ngon cho từng lô hàng"',
    specialties: [
      'Vận tải hàng lạnh đa nhiệt độ (-25°C đến +15°C)',
      'Tuyến xuất nhập khẩu Mộc Bài / Bavet đi Campuchia',
      'Phân phối hàng tiêu dùng nhanh (FMCG) Miền Tây',
      'Chứng chỉ GDP thực hành tốt phân phối thuốc'
    ],
    profileViews: 9640,
    monthlyViews: 2120,
    todayViews: 84,
    viewGrowthPercentage: 19.2,
    viewerInteractions: {
      rfqRequestsCount: 168,
      consultationsCount: 54,
      rateDownloadsCount: 540,
      viewsLast7Days: [210, 230, 245, 260, 280, 310, 340]
    },
    keyMetrics: {
      shipmentsCount: '890+ Chuyến xe lạnh',
      revenueManagedVND: '54.0 Tỷ VND',
      onTimeDeliveryRate: '99.8%',
      activeClientsCount: 32,
      satisfactionRate: '4.91 / 5.0',
      rfqResponseAvgMins: 9
    },
    achievements: [
      {
        id: 'ach-ln-01',
        year: '2025',
        title: 'Top Cold Chain Logistics Specialist 2025',
        organization: 'Vietnam Cold Chain Association',
        description: 'Vận chuyển thành công hơn 800 tấn thủy hải sản xuất khẩu không để xảy ra bất kỳ sự cố chênh lệch nhiệt độ nào.',
        badgeIcon: 'Award'
      },
      {
        id: 'ach-ln-02',
        year: '2024',
        title: 'Chuyên Gia Vận Tải Xuyên Biên Giới Tuyến VN - Cam - Thái',
        organization: 'ASEAN Freight Forwarders Council',
        description: 'Tối ưu thời gian thông quan cửa khẩu Mộc Bài xuống dưới 2.5 giờ cho xe hàng nông sản xuất khẩu tươi.',
        badgeIcon: 'Star'
      }
    ],
    services: [
      {
        id: 'srv-ln-cold',
        serviceType: 'Cold Chain',
        title: 'Vận Tải Lạnh Đa Nhiệt Độ Chuẩn GDP & HACCP',
        highlight: 'Đội xe thùng lạnh Châu Âu Thermo King, giám sát nhiệt độ trực tuyến',
        description: 'Vận chuyển thủy hải sản, trái cây xuất khẩu, thịt đông lạnh và vắc-xin y tế. Cung cấp dữ liệu nhiệt độ realtime qua smartphone.',
        keySpecs: ['Dải nhiệt độ: -25°C đến +15°C', 'Xe tải lạnh 2.5T, 5T, 8T, 15T', 'Hệ thống khử khuẩn định kỳ sau mỗi chuyến', 'Bảo hiểm hàng hóa chuyên dụng rủi ro nhiệt độ'],
        suitableFor: 'Công ty dược phẩm, xuất khẩu thủy sản, chuỗi siêu thị bán lẻ',
        slaCommitment: 'Nhiệt độ ổn định sai số < 0.5°C | Giao hàng đúng giờ 99.8%',
        pricingSummary: 'Từ 9,800,000 VND / chuyến xe 8T'
      },
      {
        id: 'srv-ln-cross',
        serviceType: 'Cross-border',
        title: 'Vận Tải Đường Bộ Xuyên Biên Giới Việt Nam - Campuchia',
        highlight: 'Cửa khẩu Mộc Bài/Bavet - Sang tải hoặc chạy thẳng Door-to-Door',
        description: 'Dịch vụ xe tải liên vận quốc tế kết nối TP.HCM, Bình Dương đi Phnom Penh, Siem Reap, Bavet với thủ tục hải quan 2 đầu trọn gói.',
        keySpecs: ['Thời gian TP.HCM → Phnom Penh: 24 - 36h', 'Đội ngũ đại lý thường trực tại cửa khẩu', 'Thanh toán COD hoặc chuyển khoản linh hoạt', 'Thông quan 2 đầu biên giới'],
        suitableFor: 'Hàng tiêu dùng, bao bì, nguyên phụ liệu may mặc, thiết bị gia dụng',
        slaCommitment: 'Thông quan cửa khẩu trong 3h | Bảo đảm an toàn hàng hóa 100%',
        pricingSummary: 'Từ 18,500,000 VND / chuyến xe 10T TP.HCM - Phnom Penh'
      }
    ],
    rateCard: [
      {
        id: 'rc-ln-01',
        category: 'ColdChain',
        routeOrService: 'TP.HCM ↔ Cần Thơ / Sóc Trăng (Xe Lạnh -18°C Tôm/Cá)',
        vehicleOrUnit: 'Xe tải Lạnh 8 Tấn',
        transitTime: '5 - 7 Giờ',
        benchmarkPriceVND: 7200000,
        benchmarkPriceDisplay: '7,200,000 VND',
        priceNotes: 'Duy trì lạnh sâu, xe chuyên dụng chở thủy hải sản xuất khẩu.',
        includedPerks: ['IoT Temp Logger', 'Bảo hiểm hàng lạnh'],
        isPopular: true
      },
      {
        id: 'rc-ln-02',
        category: 'Trucking',
        routeOrService: 'TP.HCM ↔ Phnom Penh (Campuchia Door to Door)',
        vehicleOrUnit: 'Xe tải 10 Tấn Chạy Thẳng',
        transitTime: '24 - 30 Giờ',
        benchmarkPriceVND: 18500000,
        benchmarkPriceDisplay: '18,500,000 VND',
        priceNotes: 'Đã bao gồm phí cầu đường, phí sang xe cửa khẩu Mộc Bài.',
        includedPerks: ['Hải quan 2 đầu', 'Tài xế biết tiếng Khmer & Việt'],
        isPopular: true
      }
    ],
    testimonials: [
      {
        id: 'tst-ln-01',
        clientName: 'Chị Lan Huong',
        clientRole: 'Supply Chain Director',
        clientCompany: 'Mekong Delta Seafood Corp',
        avatarInitial: 'LH',
        rating: 5,
        date: '08/08/2026',
        routeHandled: 'Vận chuyển tôm đông lạnh Cần Thơ → Cảng Cát Lái',
        content: 'Linh Nguyễn luôn theo sát từng chuyến xe chở hàng xuất khẩu của chúng tôi. Nhiệt độ luôn ổn định -20°C, biên bản bàn giao seal đầy đủ tại cảng. Rất yên tâm khi giao hàng cho Linh!'
      }
    ],
    certifications: [
      'GDP Good Distribution Practice Certified',
      'HACCP Food Safety Transportation Specialist',
      'Cross-Border Road Transport License'
    ]
  },
  {
    id: 'sales-hoang-nam',
    name: 'Hoang Nam',
    vietnameseName: 'Nguyễn Hoàng Nam',
    title: 'Ocean Freight & Global Project Cargo Consultant',
    companyId: 'supp-04',
    companyName: 'Saigon Ocean Freight & Logistics',
    companyLogo: 'SO',
    avatarInitial: 'HN',
    phone: '+84 (0) 903 777 666',
    zaloPhone: '0903777666',
    email: 'nam.nguyen@saigonocean.com',
    yearsOfExperience: 11,
    rating: 4.97,
    reviewsCount: 215,
    responseTime: '< 20 Phút',
    location: 'TP. Hồ Chí Minh & Hải Phòng (Phụ trách Tuyến Cảng Biển Quốc Tế & Nội Địa)',
    languages: ['Tiếng Việt', 'English (Fluent)', 'Japanese (N3)'],
    verifiedStatus: true,
    onlineStatus: 'ONLINE',
    bio: 'Chuyên gia vận tải container đường biển với 11 năm kinh nghiệm tại các hãng tàu và công ty forwarder hàng đầu. Giữ hợp đồng giá cước cố định (Service Contract) trực tiếp với Maersk, ONE, Cosco, Evergreen, Wanhai.',
    motto: '"Hợp đồng cước biển cạnh tranh nhất – Giữ chỗ vững chắc mùa cao điểm"',
    specialties: [
      'Cước biển FCL/LCL tuyến US, EU, Intra-Asia',
      'Vận tải biển nội địa Hải Phòng ↔ Cát Lái ↔ Cái Mép',
      'Hàng siêu trường siêu trọng (Project Cargo / Flat Rack / Open Top)',
      'Miễn phí lưu bãi lưu cont (Free Dem/Det) dài hạn'
    ],
    profileViews: 12390,
    monthlyViews: 2890,
    todayViews: 105,
    viewGrowthPercentage: 22.7,
    viewerInteractions: {
      rfqRequestsCount: 210,
      consultationsCount: 76,
      rateDownloadsCount: 720,
      viewsLast7Days: [280, 295, 310, 340, 360, 390, 420]
    },
    keyMetrics: {
      shipmentsCount: '2,800+ TEUs Ocean',
      revenueManagedVND: '145 Tỷ VND (~$5.8M)',
      onTimeDeliveryRate: '99.4%',
      activeClientsCount: 65,
      satisfactionRate: '4.97 / 5.0',
      rfqResponseAvgMins: 14
    },
    achievements: [
      {
        id: 'ach-hn-01',
        year: '2025',
        title: 'Top Master Broker Ocean Forwarding',
        organization: 'Saigon Ocean Freight & Port Authority',
        description: 'Vận chuyển hơn 2,400 TEUs container xuất khẩu đi thị trường Mỹ và Châu Âu.',
        badgeIcon: 'Trophy'
      },
      {
        id: 'ach-hn-02',
        year: '2024',
        title: 'Chuyên Gia Điều Phối Dự Án Cẩu Tháp & Thiết Bị Điện Gió',
        organization: 'Vietnam Maritime Administration',
        description: 'Vận chuyển an toàn 45 kiện hàng siêu trường siêu trọng cập cảng Cái Mép đi Tây Nguyên.',
        badgeIcon: 'Award'
      }
    ],
    services: [
      {
        id: 'srv-hn-ocean-intl',
        serviceType: 'Sea Freight (FCL)',
        title: 'Vận Tải Container FCL Quốc Tế Tuyến US, Châu Âu & Châu Á',
        highlight: 'Hợp đồng chỗ cố định (Named Account) cam kết không rớt công',
        description: 'Dịch vụ vận tải container đường biển xuất nhập khẩu đi khắp các cảng chính trên thế giới với phụ phí minh bạch, free dem/det dài ngày.',
        keySpecs: ['Container 20ft, 40ft GP/HQ/Reefer/Open Top', 'Cấp booking trực tuyến trong 30 phút', 'Miễn phí Dem/Det 14 - 21 ngày tại cảng đích', 'Hỗ trợ khai AMS, ISF, AFR, ENS'],
        suitableFor: 'Hàng gỗ, dệt may, da giày, nông sản, máy móc linh kiện xuất nhập khẩu',
        slaCommitment: 'Cam kết 100% có chỗ mùa cao điểm | Tối ưu cước O/F',
        pricingSummary: 'Từ $285 USD / cont 40ft đi Intra-Asia'
      },
      {
        id: 'srv-hn-ocean-dom',
        serviceType: 'Sea Freight (FCL)',
        title: 'Vận Tải Container Đường Biển Nội Địa Bắc - Trung - Nam',
        highlight: 'Tàu feeder cố định 3 chuyến/tuần - Tiết kiệm đến 60% chi phí so với đường bộ',
        description: 'Vận chuyển hàng container giữa các cảng Hải Phòng, Cửa Lò, Đà Nẵng, Quy Nhơn, Cát Lái, Cái Mép. Phù hợp cho hàng khối lượng lớn không yêu cầu giao hỏa tốc.',
        keySpecs: ['Lịch tàu cố định Thứ 3 - Thứ 5 - Thứ 7', 'Thời gian vận chuyển Hải Phòng - Cát Lái: 3 - 4 ngày', 'Kéo container drayage 2 đầu tận kho nhà máy', 'Vỏ container đạt chuẩn quốc tế'],
        suitableFor: 'Hàng gạch men, phân bón, thức ăn chăn nuôi, hạt nhựa, giấy cuộn',
        slaCommitment: 'Lịch tàu chuẩn xác | Chi phí tiết kiệm tối đa',
        pricingSummary: 'Từ 8,500,000 VND / cont 40ft'
      }
    ],
    rateCard: [
      {
        id: 'rc-hn-01',
        category: 'Ocean',
        routeOrService: 'Cát Lái (HCMC) ↔ Hải Phòng Port (Feeder Nội Địa)',
        vehicleOrUnit: 'Cont 40ft GP/HQ',
        transitTime: '3 - 4 Ngày',
        benchmarkPriceVND: 8500000,
        benchmarkPriceDisplay: '8,500,000 VND',
        priceNotes: 'Bao gồm cước biển O/F và phụ phí nhiên liệu. Free Dem/Det 7 ngày.',
        includedPerks: ['Free Demurrage', 'Lịch tàu 3 chuyến/tuần'],
        isPopular: true
      },
      {
        id: 'rc-hn-02',
        category: 'Ocean',
        routeOrService: 'Cái Mép (VNM) ↔ Los Angeles (USA)',
        vehicleOrUnit: 'Cont 40ft HQ',
        transitTime: '17 Ngày Direct',
        benchmarkPriceVND: 71500000,
        benchmarkPriceDisplay: '71,500,000 VND ($2,850)',
        priceNotes: 'Hãng tàu chạy thẳng, cam kết có chỗ và vỏ cont.',
        includedPerks: ['Free Dem 14 ngày', 'Khai AMS/ISF miễn phí'],
        isPopular: true
      }
    ],
    testimonials: [
      {
        id: 'tst-hn-01',
        clientName: 'Anh Van Thanh',
        clientRole: 'Logistics Director',
        clientCompany: 'Sai Gon Wooden Furniture Export',
        avatarInitial: 'VT',
        rating: 5,
        date: '10/08/2026',
        routeHandled: 'Xuất khẩu 120 Cont 40ft HQ đi Los Angeles & Houston',
        content: 'Hoàng Nam có mối quan hệ với hãng tàu rất tốt. Đợt cao điểm tháng 7 các bên khác đều hết vỏ cont và tăng giá, nhưng Nam vẫn giữ đúng mức giá hợp đồng và cấp đủ 120 vỏ cont chuẩn cho bên mình xuất xưởng đúng hạn.'
      }
    ],
    certifications: [
      'FMC Licensed Freight Forwarder Consultant',
      'FIATA Multimodal Transport Master',
      'Maritime Dangerous Goods (IMDG) Certified'
    ]
  },
  {
    id: 'sales-mai-do',
    name: 'Mai Do',
    vietnameseName: 'Đỗ Thị Mai',
    title: 'Smart Warehousing & Industrial Contract Logistics Manager',
    companyId: 'supp-03',
    companyName: 'VietLogix Intermodal',
    companyLogo: 'VL',
    avatarInitial: 'MD',
    phone: '+84 (0) 909 333 888',
    zaloPhone: '0909333888',
    email: 'mai.do@vietlogix.vn',
    yearsOfExperience: 8,
    rating: 4.88,
    reviewsCount: 96,
    responseTime: '< 15 Phút',
    location: 'Bình Dương & Bắc Ninh (Khu công nghiệp VSIP, Sóng Thần, Yên Phong)',
    languages: ['Tiếng Việt', 'English (Business)', 'Korean (Giao tiếp sản xuất)'],
    verifiedStatus: true,
    onlineStatus: 'ONLINE',
    bio: 'Chuyên gia tư vấn giải pháp kho bãi thông minh (WMS/EDI), phân phối nội địa và vận tải liên khu công nghiệp Bình Dương, Đồng Nai đi Hải Phòng, Bắc Ninh. 8 năm đồng hành cùng các tập đoàn sản xuất linh kiện, điện gia dụng và bao bì xuất khẩu.',
    motto: '"Quản trị tồn kho chuẩn xác 99.9% – Tối ưu chi phí lưu kho và đóng gói"',
    specialties: [
      'Kho bãi chuẩn Grade A & Kho ngoại quan 90,000 m²',
      'Vận tải tuyến cụm KCN Miền Nam ↔ KCN Miền Bắc',
      'Hệ thống phần mềm quản lý kho WMS tích hợp API',
      'Dịch vụ dán nhãn, đóng gói, kitting & fulfillment'
    ],
    profileViews: 7850,
    monthlyViews: 1680,
    todayViews: 62,
    viewGrowthPercentage: 14.5,
    viewerInteractions: {
      rfqRequestsCount: 124,
      consultationsCount: 42,
      rateDownloadsCount: 410,
      viewsLast7Days: [160, 175, 190, 210, 225, 250, 270]
    },
    keyMetrics: {
      shipmentsCount: '1,120+ Đơn hàng kho & xe',
      revenueManagedVND: '68.0 Tỷ VND',
      onTimeDeliveryRate: '98.9%',
      activeClientsCount: 41,
      satisfactionRate: '4.88 / 5.0',
      rfqResponseAvgMins: 11
    },
    achievements: [
      {
        id: 'ach-md-01',
        year: '2025',
        title: 'Excellence in Smart 3PL Warehousing Solutions',
        organization: 'Vietnam Logistics Association',
        description: 'Triển khai thành công hệ thống chia chọn tự động AGV cho trung tâm phân phối điện máy 25,000m² tại Bình Dương.',
        badgeIcon: 'Award'
      },
      {
        id: 'ach-md-02',
        year: '2024',
        title: 'Top Key Account Leader - Industrial Logistics',
        organization: 'VietLogix Annual Convention',
        description: 'Dẫn đầu doanh số hợp đồng 3PL dài hạn cho 12 doanh nghiệp FDI tại KCN VSIP 1 & 2.',
        badgeIcon: 'Trophy'
      }
    ],
    services: [
      {
        id: 'srv-md-wh',
        serviceType: 'Warehousing',
        title: 'Hệ Thống Kho Bãi Chuẩn Quốc Tế & Phân Phối 3PL (90,000 m²)',
        highlight: 'Kho thường & kho mát có dock leveler, phần mềm WMS theo dõi realtime',
        description: 'Dịch vụ lưu kho ngắn hạn và dài hạn, bốc xếp hàng hóa bằng xe nâng điện, quản lý hạn dùng FIFO/FEFO, đóng gói gia công nhãn phụ và phân phối đến đại lý trên toàn quốc.',
        keySpecs: ['Hệ thống kệ Selective / Drive-in cao 7 tầng', 'PCCC tự động Sprinkler đạt chuẩn Bộ Công An', 'Bảo hiểm cháy nổ kho bãi 50 Tỷ VND', 'Báo cáo xuất nhập tồn EDI hàng ngày'],
        suitableFor: 'Hàng tiêu dùng nhanh FMCG, thiết bị gia dụng, linh kiện điện tử, hóa chất an toàn',
        slaCommitment: 'Độ chính xác tồn kho 99.9% | Xuất hàng trong vòng 2h kể từ khi nhận lệnh',
        pricingSummary: 'Từ 95,000 VND / m² / tháng hoặc 8,500 VND / pallet / ngày'
      },
      {
        id: 'srv-md-truck',
        serviceType: 'Trucking',
        title: 'Vận Tải Liên Khu Công Nghiệp (KCN Hub-to-Hub Express)',
        highlight: 'Xe tải thùng kín chuyên chở linh kiện từ KCN Bình Dương đi Cảng & Miền Bắc',
        description: 'Tuyến xe cố định hàng ngày kết nối VSIP, Sóng Thần, Amata, Nhơn Trạch đến các cảng Cát Lái, Cái Mép và các KCN Bắc Ninh, Hải Dương.',
        keySpecs: ['Xe tải 5T, 8T, 15T thùng kín chống nước 100%', 'Đội tài xế có thẻ an toàn KCN', 'Giao hàng kèm biên bản POD ký nhận điện tử'],
        suitableFor: 'Nhà máy linh kiện, phụ tùng ô tô xe máy, bao bì carton',
        slaCommitment: 'Đúng giờ 99% | Bù cước nếu trễ ca sản xuất',
        pricingSummary: 'Từ 2,800,000 VND / chuyến xe 8T KCN Bình Dương - Cát Lái'
      }
    ],
    rateCard: [
      {
        id: 'rc-md-01',
        category: 'Trucking',
        routeOrService: 'KCN VSIP Bình Dương ↔ Cảng Cát Lái / Hiệp Phước',
        vehicleOrUnit: 'Xe tải 8 Tấn thùng kín',
        transitTime: 'Trong ngày (3 - 5 Giờ)',
        benchmarkPriceVND: 2800000,
        benchmarkPriceDisplay: '2,800,000 VND',
        priceNotes: 'Đã bao gồm bốc dỡ 1 đầu tại kho VietLogix và phí cầu đường.',
        includedPerks: ['Kèm biên bản POD số', 'GPS Realtime', 'Bảo hiểm 1 Tỷ VND'],
        isPopular: true
      },
      {
        id: 'rc-md-02',
        category: 'Customs',
        routeOrService: 'Lưu Kho Tiêu Chuẩn 3PL (Bình Dương / Bắc Ninh)',
        vehicleOrUnit: 'Theo Pallet Tiêu Chuẩn (1.2m x 1.0m x 1.5m)',
        transitTime: 'Linh hoạt theo ngày/tháng',
        benchmarkPriceVND: 8500,
        benchmarkPriceDisplay: '8,500 VND / pallet / ngày',
        priceNotes: 'Miễn phí 3 ngày lưu kho đầu tiên cho hợp đồng từ 6 tháng.',
        includedPerks: ['Báo cáo WMS online', 'Bảo vệ camera 24/7', 'Bảo hiểm kho bãi'],
        isPopular: true
      }
    ],
    testimonials: [
      {
        id: 'tst-md-01',
        clientName: 'Anh Tran Quang',
        clientRole: 'Operations Manager',
        clientCompany: 'TechMaster Electronics VN',
        avatarInitial: 'TQ',
        rating: 5,
        date: '14/08/2026',
        routeHandled: 'Thuê 1,500m² kho phân phối & 40 chuyến xe/tháng KCN VSIP 2',
        content: 'Chị Mai tư vấn rất chi tiết giải pháp WMS giúp công ty chúng tôi giảm thời gian soạn hàng từ 4 tiếng xuống còn 45 phút. Đội xe giao hàng luôn đúng cam kết.'
      }
    ],
    certifications: [
      'HACCP Warehousing Certified',
      'ISO 27001 Information Security in Logistics',
      'WMS / ERP Supply Chain Implementation Specialist'
    ]
  },
  {
    id: 'sales-khang-pham',
    name: 'Khang Pham',
    vietnameseName: 'Phạm Minh Khang',
    title: 'Air Freight Charter & Time-Critical Cargo Director',
    companyId: 'supp-05',
    companyName: 'SkyBridge Cargo Asia',
    companyLogo: 'SB',
    avatarInitial: 'KP',
    phone: '+84 (0) 902 888 999',
    zaloPhone: '0902888999',
    email: 'khang.pham@skybridgeasia.com',
    yearsOfExperience: 10,
    rating: 4.96,
    reviewsCount: 140,
    responseTime: '< 10 Phút',
    location: 'Hà Nội (Sân bay Nội Bài) & TP.HCM (Tân Sơn Nhất)',
    languages: ['Tiếng Việt', 'English (Fluent)', 'German (Giao dịch)'],
    verifiedStatus: true,
    onlineStatus: 'ONLINE',
    bio: 'Chuyên gia vận chuyển hàng không hỏa tốc (AOG, Pharma, High-tech, Dangerous Goods) và bao trọn chuyến bay (Air Charter). Trực tiếp làm việc với các hãng hàng không hàng đầu như Emirates SkyCargo, Qatar Airways Cargo, Singapore Airlines, Vietnam Airlines Cargo.',
    motto: '"Hỏa tốc chuẩn từng phút – Giải cứu mọi đơn hàng khẩn cấp"',
    specialties: [
      'Hàng không hỏa tốc Next-Flight-Out (NFO) 24/7',
      'Thuê trọn chuyến bay chuyên cơ vận tải (Air Charter)',
      'Vận chuyển Vắc-xin & Dược phẩm chuẩn IATA CEIV Pharma',
      'Hàng nguy hiểm IATA DG Class 1 - 9 & Hàng giá trị cao'
    ],
    profileViews: 6540,
    monthlyViews: 1420,
    todayViews: 53,
    viewGrowthPercentage: 31.2,
    viewerInteractions: {
      rfqRequestsCount: 88,
      consultationsCount: 35,
      rateDownloadsCount: 315,
      viewsLast7Days: [140, 155, 160, 180, 195, 220, 240]
    },
    keyMetrics: {
      shipmentsCount: '1,800+ Lô hàng AWB',
      revenueManagedVND: '110 Tỷ VND (~$4.4M)',
      onTimeDeliveryRate: '99.7%',
      activeClientsCount: 52,
      satisfactionRate: '4.96 / 5.0',
      rfqResponseAvgMins: 8
    },
    achievements: [
      {
        id: 'ach-kp-01',
        year: '2025',
        title: 'Outstanding Air Cargo Specialist Award',
        organization: 'IATA Cargo Community Vietnam',
        description: 'Tổ chức thành công chuyến bay thuê bao trọn gói Boeing 777F chở 85 tấn thiết bị điện tử khẩn cấp từ Hà Nội đi Frankfurt trong 36 giờ.',
        badgeIcon: 'Trophy'
      },
      {
        id: 'ach-kp-02',
        year: '2024',
        title: 'Top CEIV Pharma Air Transport Leader',
        organization: 'SkyBridge Global Network',
        description: 'Đảm bảo 100% các lô hàng sinh phẩm y tế và vắc-xin được vận chuyển đúng nhiệt độ 2-8°C không sai lệch.',
        badgeIcon: 'Award'
      }
    ],
    services: [
      {
        id: 'srv-kp-air-exp',
        serviceType: 'Air Freight',
        title: 'Dịch Vụ Hàng Không Hỏa Tốc Quốc Tế & Thuê Bao Chuyến (Air Charter)',
        highlight: 'Booking ưu tiên số 1 - Lấy hàng và cất cánh trong vòng 6 - 12 giờ',
        description: 'Giải pháp vận chuyển siêu tốc cho các đơn hàng khẩn cấp: linh kiện dừng dây chuyền sản xuất (AOG), hàng mẫu đi triển lãm, hàng giá trị cao (trang sức, chip bán dẫn), hồ sơ đấu thầu.',
        keySpecs: ['Đặt chỗ bay thẳng trong ngày', 'Dịch vụ áp tải hàng hóa On-Board Courier (OBC)', 'Thông quan sân bay hỏa tốc 24/7 kể cả ban đêm', 'Cung cấp bảo hiểm hàng không 100% giá trị khai báo'],
        suitableFor: 'Các nhà máy sản xuất điện tử FDI, công ty dược phẩm, thời trang cao cấp',
        slaCommitment: 'Bay đúng chuyến đã cam kết 99.7% | Cập nhật định vị AWB từng giờ',
        pricingSummary: 'Từ $2.85 / kg (Châu Á) hoặc $5.20 / kg (Châu Âu / Mỹ)'
      },
      {
        id: 'srv-kp-pharma',
        serviceType: 'Cold Chain',
        title: 'Vận Tải Hàng Không Dược Phẩm & Y Tế Chuẩn IATA CEIV Pharma',
        highlight: 'Thùng giữ nhiệt Envirotainer / CSafe kiểm soát nhiệt độ từ -70°C đến +25°C',
        description: 'Vận chuyển vắc-xin, tế bào gốc, thuốc thử nghiệm lâm sàng, sinh phẩm y tế bằng đường hàng không với quy trình nghiêm ngặt đạt chuẩn Tổ chức Y tế Thế giới (WHO).',
        keySpecs: ['Sử dụng đá khô (Dry Ice) hoặc thùng chủ động active reefer', 'Cảm biến nhiệt độ và độ ẩm ghi dữ liệu tự động', 'Ưu tiên bốc dỡ qua kho lạnh sân bay nhanh nhất'],
        suitableFor: 'Tập đoàn dược phẩm đa quốc gia, viện nghiên cứu, bệnh viện quốc tế',
        slaCommitment: 'Không gián đoạn chuỗi nhiệt | Bàn giao hồ sơ nhiệt độ đầy đủ',
        pricingSummary: 'Báo giá chuyên biệt theo từng loại dược phẩm và yêu cầu nhiệt độ'
      }
    ],
    rateCard: [
      {
        id: 'rc-kp-01',
        category: 'Air',
        routeOrService: 'Nội Bài (HAN) ↔ Tân Sơn Nhất (SGN) - Express Bay Trong Ngày',
        vehicleOrUnit: 'Theo Kilogram (Lô > 50 kg)',
        transitTime: '4 - 8 Giờ',
        benchmarkPriceVND: 29000,
        benchmarkPriceDisplay: '29,000 VND / kg',
        priceNotes: 'Nhận hàng trước 10h sáng, giao tận tay tại SGN trước 17h cùng ngày.',
        includedPerks: ['Giao nhận Door-to-Door', 'Theo dõi AWB thời gian thực'],
        isPopular: true
      },
      {
        id: 'rc-kp-02',
        category: 'Air',
        routeOrService: 'Nội Bài (HAN) ↔ Frankfurt (FRA) / London (LHR)',
        vehicleOrUnit: 'Theo Kilogram (Lô > 500 kg)',
        transitTime: '24 - 36 Giờ',
        benchmarkPriceVND: 125000,
        benchmarkPriceDisplay: '125,000 VND / kg (~$4.90/kg)',
        priceNotes: 'Hãng bay Qatar Cargo / Vietnam Airlines. Đã gồm phụ phí xăng dầu và an ninh.',
        includedPerks: ['Hải quan xuất khẩu trọn gói', 'Bảo hiểm hàng không'],
        isPopular: true
      }
    ],
    testimonials: [
      {
        id: 'tst-kp-01',
        clientName: 'Ông David Miller',
        clientRole: 'Global Logistics Procurement Director',
        clientCompany: 'AeroTech Systems Europe',
        avatarInitial: 'DM',
        rating: 5,
        date: '18/08/2026',
        routeHandled: 'Vận chuyển khẩn cấp 12 tấn linh kiện điện tử HAN → Frankfurt',
        content: 'Khang Phạm đã xử lý một tình huống cực kỳ khẩn cấp khi dây chuyền lắp ráp tại Đức của chúng tôi có nguy cơ dừng hoạt động. Chỉ trong 28 giờ từ khi gọi điện, toàn bộ 12 tấn linh kiện đã có mặt tại nhà máy. Rất xuất sắc!'
      }
    ],
    certifications: [
      'IATA Dangerous Goods Regulations (DGR) Category 6 Instructor',
      'IATA CEIV Pharma Logistics Specialist',
      'Air Cargo Charter Operations Certified'
    ]
  },
  {
    id: 'sales-tuan-anh',
    name: 'Tuan Anh Le',
    vietnameseName: 'Lê Tuấn Anh',
    title: 'Senior Project Cargo & Heavy Haulage Sales Lead',
    companyId: 'supp-01',
    companyName: 'VinaTrans Logistics JSC',
    companyLogo: 'VT',
    avatarInitial: 'TA',
    phone: '+84 (0) 938 555 777',
    zaloPhone: '0938555777',
    email: 'tuananh.le@vinatranslogistics.com',
    yearsOfExperience: 6,
    rating: 4.92,
    reviewsCount: 88,
    responseTime: '< 10 Phút',
    location: 'Hà Nội & Hải Phòng (Phụ trách Miền Bắc & Dự án Công nghiệp)',
    languages: ['Tiếng Việt', 'English (Fluent)', 'Japanese (N2)'],
    verifiedStatus: true,
    onlineStatus: 'ONLINE',
    bio: 'Chuyên viên Sales mảng Vận tải hàng dự án siêu trường siêu trọng (OOG/Project Cargo) và giải pháp kéo Mooc lùn, Mooc sàn, xe cẩu tự hành tại VinaTrans Logistics. Trực tiếp phục vụ các nhà thầu EPC năng lượng, thiết bị nhà máy công nghiệp.',
    motto: '"An toàn kỹ thuật tuyệt đối – Khảo sát cung đường chuẩn xác 100%"',
    specialties: [
      'Vận chuyển hàng quá khổ quá tải (OOG)',
      'Mooc lùn, Mooc sàn, Fooc rút & Xe cẩu tự hành',
      'Khảo sát tĩnh không, cầu đường & Giấy phép lưu hành đặc biệt',
      'Vận tải máy móc thiết bị nhà máy FDI'
    ],
    profileViews: 8420,
    monthlyViews: 1980,
    todayViews: 76,
    viewGrowthPercentage: 24.1,
    viewerInteractions: {
      rfqRequestsCount: 142,
      consultationsCount: 65,
      rateDownloadsCount: 420,
      viewsLast7Days: [180, 195, 210, 240, 260, 290, 310]
    },
    keyMetrics: {
      shipmentsCount: '320+ Chuyến OOG/Siêu trường',
      revenueManagedVND: '64.0 Tỷ VND',
      onTimeDeliveryRate: '99.2%',
      activeClientsCount: 28,
      satisfactionRate: '4.92 / 5.0',
      rfqResponseAvgMins: 10
    },
    achievements: [
      {
        id: 'ach-ta-01',
        year: '2025',
        title: 'Chuyên Viên Dự Án Năng Lượng Tái Tạo Xuất Sắc',
        organization: 'VinaTrans Annual Awards',
        description: 'Vận chuyển an toàn 48 cánh quạt điện gió và rotor từ Cảng Đình Vũ về dự án Lạng Sơn.',
        badgeIcon: 'Trophy'
      }
    ],
    services: [
      {
        id: 'srv-ta-oog',
        serviceType: 'Trucking',
        title: 'Vận Tải Thiết Bị Siêu Trường Siêu Trọng & Máy Móc Dự Án',
        highlight: 'Đội xe Mooc rút 36m, Mooc lùn tải trọng đến 85 tấn, xin giấy phép lưu hành trọn gói',
        description: 'Giải pháp vận tải chuyên dụng cho các kiện hàng quá khổ quá tải, bồn hóa chất, máy biến áp, cẩu trục, dầm thép xây dựng.',
        keySpecs: ['Mooc lùn 3-6 trục, tải trọng 40T - 85T', 'Xe cứu hộ và dẫn đường chuyên nghiệp', 'Bảo hiểm hàng hóa dự án 20 Tỷ VND', 'Khảo sát cầu đường 24h trước khi khởi hành'],
        suitableFor: 'Nhà thầu xây dựng công nghiệp, nhà máy cơ khí, điện năng lượng mặt trời & gió',
        slaCommitment: 'An toàn 100% | Cam kết tiến độ lắp đặt nhà máy',
        pricingSummary: 'Khảo sát và báo giá chi tiết theo từng kiện hàng thực tế'
      }
    ],
    rateCard: [
      {
        id: 'rc-ta-01',
        category: 'Trucking',
        routeOrService: 'Cảng Hải Phòng ↔ KCN Yên Phong (Bắc Ninh) - Xe Mooc Sàn 40T',
        vehicleOrUnit: 'Mooc Sàn 3 Trục Chở Máy',
        transitTime: 'Trong ngày (4 - 6 Giờ)',
        benchmarkPriceVND: 12500000,
        benchmarkPriceDisplay: '12,500,000 VND',
        priceNotes: 'Đã bao gồm bốc dỡ xe cẩu 1 đầu và xin giấy phép thông hành KCN.',
        includedPerks: ['Kỹ sư an toàn giám sát', 'Bảo hiểm dự án 5 Tỷ'],
        isPopular: true
      }
    ],
    testimonials: [
      {
        id: 'tst-ta-01',
        clientName: 'Anh Doan Dung',
        clientRole: 'Project Logistics Director',
        clientCompany: 'Hyundai Engineering VNM',
        avatarInitial: 'DD',
        rating: 5,
        date: '19/08/2026',
        routeHandled: 'Vận chuyển 18 bồn áp lực Cảng Đình Vũ → KCN Quế Võ',
        content: 'Lê Tuấn Anh làm việc rất cẩn thận, có bản vẽ chằng buộc (Lashing plan) và phương án khảo sát chiều cao tĩnh không chi tiết. Chúng tôi hoàn toàn tin tưởng khi giao các dự án lớn cho Tuấn Anh.'
      }
    ],
    certifications: [
      'Heavy Lift & Project Cargo Specialist Certification',
      'Rigging & Lifting Safety Inspector (Standard OHS)'
    ]
  },
  {
    id: 'sales-huong-giang',
    name: 'Huong Giang Nguyen',
    vietnameseName: 'Nguyễn Thị Hương Giang',
    title: 'Customs Compliance & Chemical Logistics Specialist',
    companyId: 'supp-04',
    companyName: 'Saigon Ocean Freight & Logistics',
    companyLogo: 'SO',
    avatarInitial: 'HG',
    phone: '+84 (0) 906 444 222',
    zaloPhone: '0906444222',
    email: 'giang.nguyen@saigonocean.com',
    yearsOfExperience: 8,
    rating: 4.94,
    reviewsCount: 152,
    responseTime: '< 12 Phút',
    location: 'TP. Hồ Chí Minh & Bà Rịa - Vũng Tàu (Cảng Cái Mép)',
    languages: ['Tiếng Việt', 'English (Fluent)', 'Chinese (HSK 5)'],
    verifiedStatus: true,
    onlineStatus: 'ONLINE',
    bio: 'Chuyên viên tư vấn thủ tục hải quan chuyên sâu cho hàng hóa chất, hạt nhựa, nông sản và dệt may tại Saigon Ocean Freight. 8 năm kinh nghiệm giải quyết luồng Đỏ, kiểm tra chuyên ngành và tối ưu hóa biểu thuế nhập khẩu FTA.',
    motto: '"Thông quan nhanh chóng – Tuân thủ chuẩn mực pháp lý hải quan"',
    specialties: [
      'Thủ tục Hải quan Hóa chất & Hàng nguy hiểm (DG)',
      'Tư vấn C/O Form E, D, CPTPP, EVFTA',
      'Thông quan Cát Lái & Cái Mép trong ngày',
      'Tư vấn mã HS Code & Hoàn thuế nhập khẩu'
    ],
    profileViews: 11200,
    monthlyViews: 2450,
    todayViews: 92,
    viewGrowthPercentage: 26.5,
    viewerInteractions: {
      rfqRequestsCount: 195,
      consultationsCount: 78,
      rateDownloadsCount: 610,
      viewsLast7Days: [220, 240, 270, 310, 330, 360, 390]
    },
    keyMetrics: {
      shipmentsCount: '2,100+ Tờ khai Hải quan',
      revenueManagedVND: '78.0 Tỷ VND',
      onTimeDeliveryRate: '99.8%',
      activeClientsCount: 54,
      satisfactionRate: '4.94 / 5.0',
      rfqResponseAvgMins: 11
    },
    achievements: [
      {
        id: 'ach-hg-01',
        year: '2025',
        title: 'Top Customs Broker Specialist 2025',
        organization: 'Vietnam Customs Brokers Association',
        description: 'Xử lý thành công hơn 1,800 tờ khai thông quan đúng tiến độ không có lỗi phát sinh phạt chậm.',
        badgeIcon: 'Award'
      }
    ],
    services: [
      {
        id: 'srv-hg-customs',
        serviceType: 'Customs Clearance',
        title: 'Dịch Vụ Khai Thuê Hải Quan Trọn Gói Cảng Cát Lái & Cái Mép',
        highlight: 'Truyền tờ khai VNACCS trong 30 phút, xử lý kiểm hóa và lấy hàng trong 4 giờ',
        description: 'Tư vấn biểu thuế, xin giấy phép kiểm tra chuyên ngành, công bố sản phẩm, kiểm dịch thực vật và giao hàng tận kho nhà máy.',
        keySpecs: ['Thông quan nhanh luồng Vàng < 2h, Luồng Đỏ < 12h', 'Đội ngũ túc trực 24/7 tại Cát Lái và Cái Mép', 'Báo cáo chi tiết trạng thái tờ khai qua App'],
        suitableFor: 'Doanh nghiệp nhập khẩu hóa chất, thức ăn chăn nuôi, hạt nhựa, may mặc',
        slaCommitment: 'Thông quan đúng hạn 99.8% | Bảo mật dữ liệu giá vốn',
        pricingSummary: 'Từ 750,000 VND / tờ khai'
      }
    ],
    rateCard: [
      {
        id: 'rc-hg-01',
        category: 'Customs',
        routeOrService: 'Thủ Tục Hải Quan Nhập Khẩu Container Cát Lái / Cái Mép',
        vehicleOrUnit: 'Theo Bộ Tờ Khai',
        transitTime: '2 - 4 Giờ',
        benchmarkPriceVND: 750000,
        benchmarkPriceDisplay: '750,000 VND / tờ khai',
        priceNotes: 'Áp dụng cho 1 - 3 dòng hàng. Đã bao gồm tư vấn mã HS Code và biểu thuế.',
        includedPerks: ['Kiểm tra C/O miễn phí', 'Tư vấn miễn giảm thuế FTA'],
        isPopular: true
      }
    ],
    testimonials: [
      {
        id: 'tst-hg-01',
        clientName: 'Chị Bich Ngoc',
        clientRole: 'Import Director',
        clientCompany: 'Tan A Polymer Industrial',
        avatarInitial: 'BN',
        rating: 5,
        date: '21/08/2026',
        routeHandled: 'Thông quan 40 Cont hạt nhựa nhập khẩu từ Ả Rập Xê Út',
        content: 'Hương Giang rất am hiểu luật hải quan. Lô hàng của bên mình bị hải quan nghi vấn giá, Giang đã chuẩn bị hồ sơ giải trình tham vấn giá rất thuyết phục và được chấp nhận ngay trong ngày. Tuyệt vời!'
      }
    ],
    certifications: [
      'Authorized Customs Broker License (General Department of Vietnam Customs)',
      'Dangerous Goods Declaration Certified'
    ]
  }
];

