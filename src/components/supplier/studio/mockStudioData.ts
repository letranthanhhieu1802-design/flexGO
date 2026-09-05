import {
  SalemanPersonalProfile,
  CompanyInfoProfile,
  StudioTemplateConfig
} from './studioTypes';

export const initialSalemanProfile: SalemanPersonalProfile = {
  name: 'Minh Tran',
  vietnameseName: 'Trần Văn Minh',
  nickname: 'Alex Minh',
  avatarUrl: '',
  avatarInitial: 'TM',
  coverBannerUrl: '',
  title: 'Senior Key Account Manager & Freight Solutions Director',
  motto: 'Tối ưu chi phí logistics trên từng TEU - Đồng hành và cam kết SLA 24/7 cho mọi chuyến hàng.',
  bio: 'Hơn 11 năm kinh nghiệm chuyên sâu trong điều phối chuỗi cung ứng quốc tế và vận tải đa phương thức. Chuyên gia tư vấn các giải pháp FCL/LCL tuyến Bắc Mỹ, Châu Âu, chuỗi lạnh bảo quản nông thủy sản xuất khẩu và vận tải xuyên biên giới GMS. Đã trực tiếp xây dựng giải pháp logistics trọn gói cho hơn 180+ doanh nghiệp xuất nhập khẩu hàng đầu Việt Nam.',
  phone: '+84 (0) 908 123 456',
  zaloPhone: '0908123456',
  email: 'minh.tran@vinatranslogistics.com',
  linkedinUrl: 'https://linkedin.com/in/alex-minh-logistics',
  workingHours: '08:00 - 21:00 (Thứ 2 - Thứ 7)',
  languages: ['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (IELTS 7.5 - Chuyên ngành Hàng hải)', 'Tiếng Trung (Giao tiếp thương mại)'],
  specialties: [
    'Tuyến Bắc Mỹ (US West/East Coast FCL)',
    'Chuỗi Cung Ứng Lạnh (Reefer Cold Chain)',
    'Hàng Quá Khổ Quá Tải (OOG & Breakbulk)',
    'Hợp đồng Logistics Trọn Gói 3PL',
    'Thủ tục Hải quan Danh mục Khó',
    'Cross-border Việt - Trung - Lào'
  ],
  targetIndustries: ['fmcg', 'electronics', 'textile', 'agri', 'chemicals'],
  skills: [
    'Đàm Phán Cước Tàu & Hợp Đồng Volume Lớn',
    'Tối Ưu Chuỗi Cung Ứng Lạnh (Reefer & Cold Chain)',
    'Quản Trị Rủi Ro & Bảo Hiểm Hàng Hải',
    'Tư Vấn Incoterms 2020 & Biểu Thuế XNK',
    'Vận Hành Hệ Thống WMS & TMS Hiện Đại',
    'Khai Báo Hải Quan Chuyên Ngành Khó'
  ],
  hobbies: [
    'Chạy Bộ Bán Marathon (VnExpress Marathon 21km)',
    'Đọc Sách Kinh Tế & Quản Trị Chuỗi Cung Ứng',
    'Chơi Tennis & Giao Lưu Kết Nối Doanh Nghiệp',
    'Du Lịch Khám Phá Cung Đường Việt Nam'
  ],
  awards: [
    {
      id: 'award-1',
      title: 'Top 1 Sales Director Xuất Sắc Toàn Quốc 2023',
      issuer: 'VinaTrans Global Logistics Corp',
      year: '2023',
      description: 'Đạt doanh thu kỷ lục 120 tỷ VND và tỷ lệ giữ chân khách hàng 96%.'
    },
    {
      id: 'award-2',
      title: 'Giải Nhất Sáng Kiến Chuỗi Cung Ứng Xanh (Green Logistics)',
      issuer: 'Hiệp Hội Doanh Nghiệp Dịch Vụ Logistics Việt Nam (VLA)',
      year: '2022',
      description: 'Giải pháp giảm phát thải rỗng chiều về cho đội xe container Cát Lái - VSIP.'
    },
    {
      id: 'award-3',
      title: 'Chiến Binh Xuất Sắc - Cán Mốc 10,000 TEUs',
      issuer: 'Hiệp Hội Cảng Biển & Forwarder Phía Nam',
      year: '2021'
    }
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'VinaTrans Logistics JSC',
      position: 'Senior Key Account Manager & Solutions Director',
      period: '2020 - Hiện tại (5 năm)',
      description: 'Chịu trách nhiệm phát triển giải pháp logistics tổng thể cho nhóm khách hàng FDI trọng điểm (Điện tử, Dệt may, FMCG). Quản lý danh mục hợp đồng thường niên trị giá trên 120 tỷ VND.',
      keyAchievement: 'Top 1 Doanh thu toàn quốc liên tục 3 năm (2022, 2023, 2024). Xử lý thành công hơn 18,000 TEUs đường biển và 450,000 tấn đường bộ.'
    },
    {
      id: 'exp-2',
      company: 'Kuehne + Nagel Vietnam',
      position: 'Senior Route Development Specialist (Trans-Pacific)',
      period: '2016 - 2020 (4 năm)',
      description: 'Phát triển các tuyến vận chuyển cước biển đi US West Coast và Châu Âu. Đàm phán trực tiếp service contract với Maersk, ONE, COSCO, Evergreen.',
      keyAchievement: 'Tối ưu thời gian booking cao điểm Tết và mùa Black Friday, tỷ lệ giữ space cam kết đạt 99.4%.'
    },
    {
      id: 'exp-3',
      company: 'DMC Transport & Shipping',
      position: 'Logistics Operations Executive',
      period: '2013 - 2016 (3 năm)',
      description: 'Điều phối vận tải bộ FTL nội địa và thông quan cảng Cát Lái / Hải Phòng.',
      keyAchievement: 'Giảm 18% chi phí lưu cont lưu bãi (DEM/DET) cho nhóm khách hàng linh kiện điện tử.'
    }
  ],
  educations: [
    {
      id: 'edu-1',
      school: 'Đại Học Ngoại Thương (FTU TP.HCM)',
      degree: 'Cử Nhân Kinh Tế Đối Ngoại (International Trade & Logistics)',
      period: '2009 - 2013',
      honors: 'Tốt nghiệp loại Giỏi - Đề tài Tối ưu luồng vận tải Container Cát Lái'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'FIATA Higher Diploma in Supply Chain Management',
      issuer: 'International Federation of Freight Forwarders (FIATA)',
      year: '2018',
      code: 'FIATA-VN-2018-091'
    },
    {
      id: 'cert-2',
      name: 'IATA Cargo Introductory & Dangerous Goods (DGR)',
      issuer: 'International Air Transport Association (IATA)',
      year: '2019',
      code: 'IATA-DGR-CAT3'
    },
    {
      id: 'cert-3',
      name: 'Chuyên Viên Khai Báo Hải Quan Điện Tử Hợp Chuẩn',
      issuer: 'Tổng Cục Hải Quan Việt Nam',
      year: '2015',
      code: 'TCHQ-CC-7829'
    }
  ],
  highlightStats: [
    { id: 'stat-1', label: 'Sản lượng FCL điều phối', value: '4,500+ TEUs/năm', subtext: 'Tuyến US, EU & Nội Á' },
    { id: 'stat-2', label: 'Tỷ lệ SLA đúng hẹn', value: '99.6%', subtext: 'Đo lường trên hệ thống TMS' },
    { id: 'stat-3', label: 'Thời gian phản hồi RFQ', value: '< 15 Phút', subtext: 'Hỗ trợ 24/7 kể cả ngày lễ' },
    { id: 'stat-4', label: 'Doanh nghiệp tin chọn', value: '180+ Khách hàng', subtext: 'Tỷ lệ tái ký hợp đồng 94%' }
  ]
};

export const initialCompanyProfile: CompanyInfoProfile = {
  companyName: 'Công Ty Cổ Phần Logistics VinaTrans Quốc Tế',
  companyNameEn: 'VinaTrans Global Logistics Joint Stock Company',
  taxId: '0301456789',
  yearEstablished: 2008,
  logoUrl: '',
  companySlogan: 'Connecting Global Trade - Delivering Reliable Supply Chain',
  companyBio: 'Thành lập từ năm 2008, VinaTrans Global Logistics tự hào là một trong những nhà cung cấp dịch vụ logistics tích hợp hàng đầu Việt Nam. Với hệ thống 240+ đầu xe tải và xe đầu kéo chuyên dụng, 4 trung tâm phân phối kho bãi tổng diện tích 65,000m² tại các KCN trọng điểm (Sóng Thần, VSIP, Bắc Ninh, Đình Vũ), chúng tôi cam kết mang lại giải pháp vận chuyển tối ưu, thông suốt và an toàn tuyệt đối cho chuỗi cung ứng của quý khách.',
  websiteUrl: 'https://vinatrans-global.vn',
  brochureUrl: 'https://vinatrans-global.vn/company-profile-2026.pdf',
  hotline: '(028) 3822 5678',
  email: 'contact@vinatrans-global.vn',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/vinatrans-global',
    facebook: 'https://facebook.com/vinatransglobal',
    youtube: 'https://youtube.com/@vinatranslogistics',
  },

  // 1. Về chúng tôi & Dấu mốc lịch sử
  milestones: [
    {
      id: 'ms-1',
      year: '2008',
      title: 'Khởi đầu với dịch vụ thông quan & vận tải bộ',
      description: 'Thành lập tại TP.HCM với đội xe ban đầu 12 chiếc, tập trung khai báo hải quan cảng Cát Lái.'
    },
    {
      id: 'ms-2',
      year: '2014',
      title: 'Mở rộng mạng lưới Forwarding quốc tế',
      description: 'Gia nhập FIATA, VLA & WCA; mở tuyến cước tàu biển FCL trực tiếp đi US West Coast và Đông Nam Á.'
    },
    {
      id: 'ms-3',
      year: '2019',
      title: 'Khánh thành Trung tâm Kho vận Sóng Thần',
      description: 'Đưa vào vận hành cụm kho 35,000m² đạt chuẩn CFS & Kho lạnh GDP, tích hợp hệ thống WMS Barcode/RFID.'
    },
    {
      id: 'ms-4',
      year: '2023 - Nay',
      title: 'Chuyển đổi số toàn diện & Cán mốc 120,000 TEUs',
      description: 'Triển khai nền tảng TMS định vị GPS 24/7, liên kết đối tác hơn 20 hãng tàu và hãng hàng không quốc tế.'
    }
  ],

  // 2. Tầm nhìn, Sứ mệnh & Giá trị cốt lõi
  vision: 'Trở thành Top 5 tập đoàn logistics tích hợp 3PL/4PL uy tín hàng đầu Việt Nam và vươn tầm khu vực Đông Nam Á vào năm 2030, tiên phong ứng dụng công nghệ chuỗi cung ứng xanh.',
  mission: 'Đơn giản hóa dòng chảy hàng hóa toàn cầu, đồng hành tối ưu hóa chi phí logistics trên từng container và cam kết độ tin cậy SLA cao nhất cho mọi doanh nghiệp xuất nhập khẩu.',
  coreValues: [
    {
      id: 'cv-1',
      title: 'Uy Tín Cam Kết (Integrity)',
      description: 'Luôn giữ chữ tín về tiến độ, giá cước minh bạch và an toàn hàng hóa 100%.'
    },
    {
      id: 'cv-2',
      title: 'Tốc Độ & Linh Hoạt (Agility)',
      description: 'Phản hồi RFQ dưới 15 phút, giải quyết thủ tục thông quan và biến động cảng biển nhanh chóng.'
    },
    {
      id: 'cv-3',
      title: 'Khách Hàng Là Trọng Tâm (Customer-Centric)',
      description: 'Thiết kế giải pháp chuyên biệt may đo theo từng đặc thù ngành hàng (FMCG, Điện tử, Chuỗi lạnh).'
    },
    {
      id: 'cv-4',
      title: 'Ứng Dụng Công Nghệ (Innovation)',
      description: 'Quản trị bằng TMS, WMS hiện đại, tra cứu hành trình real-time và tự động hóa EDI hải quan.'
    }
  ],

  // 3. Thước đo quy mô & năng lực
  companyStats: [
    { id: 'cs-1', label: 'Thâm Niên Hoạt Động', value: '16+ Năm', subtext: 'Từ năm 2008' },
    { id: 'cs-2', label: 'Quy Mô Nhân Sự', value: '450+ Người', subtext: 'Chuyên viên toàn quốc' },
    { id: 'cs-3', label: 'Đội Xe Vận Tải', value: '240+ Đầu Xe', subtext: 'Xe tải 1.5T - 15T & Container' },
    { id: 'cs-4', label: 'Hệ Thống Kho Bãi', value: '65,000 m²', subtext: 'Chuẩn CFS, Bonded & Lạnh' },
    { id: 'cs-5', label: 'Sản Lượng Vận Hành', value: '120,000+ TEUs', subtext: '850,000 Tấn hàng/năm' },
  ],

  // Hệ thống công nghệ quản trị
  softwareSystems: [
    'TMS (Transportation Management System) định vị GPS 24/7',
    'WMS (Warehouse Management System) quét mã Barcode/RFID',
    'Hệ thống EDI kết nối tự động Hải quan điện tử VNACCS'
  ],

  // 2. Mạng lưới chi nhánh & văn phòng
  branches: [
    { id: 'br-1', city: 'TP. Hồ Chí Minh', address: 'Tòa nhà VinaTrans, Số 12 Đại lộ Mai Chí Thọ, TP. Thủ Đức', type: 'Trụ sở chính', phone: '(028) 3822 5678' },
    { id: 'br-2', city: 'Hải Phòng', address: 'Tầng 6, Tòa nhà TD Business Center, Lê Hồng Phong, Q. Ngô Quyền', type: 'Chi nhánh', phone: '(0225) 378 9988' },
    { id: 'br-3', city: 'Hà Nội', address: 'Số 88 Phố Duy Tân, Cầu Giấy', type: 'Chi nhánh', phone: '(024) 3998 1122' },
    { id: 'br-4', city: 'Bình Dương (Hub Kho & X-Dock)', address: 'KCN Sóng Thần 1, Dĩ An', type: 'Văn phòng cảng/kho', phone: '(0274) 379 5566' }
  ],

  // 3. Thành viên hiệp hội & Mạng lưới toàn cầu
  affiliations: [
    { id: 'af-1', name: 'FIATA', type: 'Liên đoàn các Hiệp hội Giao nhận Quốc tế', codeOrYear: 'Thành viên toàn cầu' },
    { id: 'af-2', name: 'VLA (Hiệp hội Doanh nghiệp Logistics VN)', type: 'Hiệp hội Quốc Gia', codeOrYear: 'Hội viên chính thức từ 2010' },
    { id: 'af-3', name: 'WCA (World Cargo Alliance)', type: 'Mạng lưới đại lý toàn cầu', codeOrYear: 'ID: 104522' },
    { id: 'af-4', name: 'IATA Cargo Agent', type: 'Hiệp hội Vận tải Hàng không Quốc tế', codeOrYear: 'Đại lý chỉ định cấp 1' },
    { id: 'af-5', name: 'C-TPAT', type: 'An ninh chuỗi cung ứng Hoa Kỳ', codeOrYear: 'Chứng nhận đạt chuẩn' },
    { id: 'af-6', name: 'ISO 9001:2015', type: 'Quản lý chất lượng quốc tế', codeOrYear: 'TÜV Rheinland cấp chứng nhận' }
  ],

  // 4. Hệ sinh thái dịch vụ & Ngành hàng thế mạnh
  servicePillars: [
    { id: 'sp-1', title: 'Logistics Hàng Không (Air Freight)', description: 'Đại lý cấp 1 của các hãng hàng không hàng đầu, giải pháp bay thẳng & chuyển tải hỏa tốc toàn cầu.' },
    { id: 'sp-2', title: 'Vận Tải Biển FCL & LCL (Ocean Freight)', description: 'Hợp đồng cước dài hạn với top hãng tàu liên minh thế giới, bảo đảm chỗ & vỏ container mùa cao điểm.' },
    { id: 'sp-3', title: 'Vận Tải Nội Địa & Phân Phối (Domestic Trucking)', description: '240+ phương tiện vận tải đa tải trọng, kết nối linh hoạt các KCN, trung tâm phân phối và cửa khẩu.' },
    { id: 'sp-4', title: 'Dịch Vụ Kho Bãi & Fulfillment', description: 'Hệ thống 65,000m² kho CFS, Kho Ngoại Quan & Kho Mát/Lạnh đạt chuẩn GDP quản lý bằng WMS hiện đại.' },
    { id: 'sp-5', title: 'Khai Thuê Hải Quan & Tư Vấn Pháp Lý', description: 'Đội ngũ chuyên viên khai báo điện tử VNACCS dày dạn kinh nghiệm, giải quyết thủ tục thông quan nhanh trong 24h.' }
  ],
  targetIndustries: [
    'Dệt may & Da giày',
    'Điện tử & Linh kiện công nghệ cao',
    'Nông thủy sản & Chuỗi cung ứng lạnh',
    'Hàng tiêu dùng nhanh (FMCG)',
    'Hóa chất & Hàng nguy hiểm (DG)',
    'Hàng dự án siêu trường siêu trọng'
  ],

  // 5. Đối tác chiến lược & Khách hàng tiêu biểu
  carrierPartners: [
    'Maersk Line',
    'ONE (Ocean Network Express)',
    'Cosco Shipping',
    'Evergreen Marine',
    'SITC Container Lines',
    'Vietnam Airlines Cargo',
    'Singapore Airlines Cargo',
    'Qatar Airways Cargo'
  ],
  clientLogos: [
    'Samsung Electronics',
    'Nestlé Vietnam',
    'VinFast Global',
    'LG Display',
    'Unilever',
    'Masan Group'
  ],

  // 6. Dự án & Case studies thành công
  caseStudies: [
    {
      id: 'cs-1',
      title: 'Vận chuyển 600 Containers thiết bị năng lượng mặt trời',
      clientIndustry: 'Năng Lượng Tái Tạo',
      scale: 'Cảng Cát Lái ➔ KCN Phước Đông (Tây Ninh)',
      result: 'Hoàn tất trước hạn 5 ngày, 100% không phát sinh lưu bãi DEM/DET.'
    },
    {
      id: 'cs-2',
      title: 'Giải pháp chuỗi lạnh nông sản xuất khẩu Trung Quốc chính ngạch',
      clientIndustry: 'Trái Cây Tươi (Sầu Riêng, Thanh Long)',
      scale: 'Miền Tây ➔ Cửa khẩu Hữu Nghị / Tân Thanh',
      result: 'Duy trì dải nhiệt độ -18°C đến +4°C ổn định 100%, tỷ lệ hao hụt 0%.'
    }
  ],

  // Trường tương thích ngược
  employeeCount: '450+ Nhân viên',
  employeeSubtext: 'Văn phòng & Hub toàn quốc',
  annualVolume: '120,000+ TEUs & 850,000 Tấn hàng',
  volumeSubtext: 'Thường niên cam kết',
  truckFleetCount: '240+ Đầu xe (Xe tải 1.5T - 15T & Đầu kéo Container)',
  warehouseArea: '65,000 m² (Kho thường, Kho lạnh & Kho Ngoại quan)',
  licenses: [
    'Giấy phép kinh doanh vận tải số 1428/GP-SGTVT',
    'Giấy phép đại lý thủ tục Hải quan Tổng Cục Hải Quan',
    'FMC Bonded NVOCC (Tuyến Hoa Kỳ)',
    'Giấy phép vận chuyển hàng nguy hiểm Hóa chất & Khí đốt'
  ],
  certifications: [
    'ISO 9001:2015 Hệ thống quản lý chất lượng',
    'GDP (Good Distribution Practices) Kho Dược Phẩm',
    'Thành viên chính thức Hiệp hội VLA & FIATA',
    'C-TPAT (Customs-Trade Partnership Against Terrorism)'
  ]
};

export const initialStudioConfig: StudioTemplateConfig = {
  activeTemplateId: 'executive-elite',
  activeCompanyTemplateId: 'corporate-flagship',
  themeColor: 'navy',
  fontFamily: 'Inter',
  visibleSections: {
    myProfile: {
      experiences: true,
      educations: true,
      certifications: true,
      highlightStats: true,
      specialties: true,
      languages: true,
      targetIndustries: true,
      awards: true,
      skills: true,
      hobbies: true,
    },
    myCompany: {
      about: true,
      visionMission: true,
      highlights: true,
      branches: true,
      affiliations: true,
      ecosystem: true,
      partners: true,
      caseStudies: true,
      compliance: true,
      infrastructure: true,
      clients: true,
    },
  },
};
