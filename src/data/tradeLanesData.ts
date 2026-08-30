import { InternationalTradeLaneRegion, InternationalTradeLaneMeta } from '../types';

export const MAIN_INTERNATIONAL_TRADE_LANES: InternationalTradeLaneMeta[] = [
  {
    id: 'NorthAmerica',
    label: 'Bắc Mỹ',
    nameVi: 'Bắc Mỹ',
    nameEn: 'North America (US & Canada)',
    icon: '🗽',
    count: 2692,
    englishLabel: 'North America (US & Canada)',
    popularPorts: [
      'Los Angeles (USLAX)',
      'Long Beach (USLGB)',
      'Oakland (USOAK)',
      'Seattle / Tacoma (USSEA)',
      'New York / New Jersey (USNYC)',
      'Savannah (USSAV)',
      'Houston (USHOU)',
      'Vancouver (CAVAN)',
      'Montreal (CAMTR)',
      'Manzanillo Mexico (MXZLO)'
    ],
    shippingLines: ['Maersk', 'ONE', 'MSC', 'COSCO', 'Evergreen', 'HMM', 'ZIM', 'Yang Ming']
  },
  {
    id: 'Asia',
    label: 'Châu Á',
    nameVi: 'Châu Á',
    nameEn: 'Intra-Asia & Pan-Asia',
    icon: '🌏',
    count: 4011,
    englishLabel: 'Intra-Asia & Pan-Asia',
    popularPorts: [
      'Thượng Hải / Shanghai (CNSHA)',
      'Ninh Ba / Ningbo (CNNGB)',
      'Thâm Quyến / Yantian (CNYTN)',
      'Thanh Đảo / Qingdao (CNTAO)',
      'Tokyo / Yokohama (JPTYO)',
      'Busan / Incheon (KRPUS)',
      'Singapore (SGSIN)',
      'Port Klang / Tanjung Pelepas (MYPKG)',
      'Bangkok / Laem Chabang (THLCH)',
      'Jakarta (IDJKT)',
      'Nhava Sheva / Mundra India (INNSA)'
    ],
    shippingLines: ['Wanhai', 'SITC', 'CNC', 'Sinokor', 'KMTC', 'RCL', 'OOCL', 'TS Lines', 'COSCO']
  },
  {
    id: 'Europe',
    label: 'Châu Âu',
    nameVi: 'Châu Âu',
    nameEn: 'Europe (North & Med)',
    icon: '🏰',
    count: 3037,
    englishLabel: 'Europe (North & Med)',
    popularPorts: [
      'Rotterdam (NLRTM)',
      'Hamburg (DEHAM)',
      'Antwerp (BEANR)',
      'Felixstowe / Southampton (GBFXT)',
      'Le Havre (FRLEH)',
      'Genoa (ITGOA)',
      'Valencia / Barcelona (ESVLC)',
      'Piraeus (GRPIR)',
      'Koper (SIKOP)',
      'Gdansk (PLGDN)'
    ],
    shippingLines: ['MSC', 'Maersk', 'CMA CGM', 'Hapag-Lloyd', 'ONE', 'COSCO', 'Evergreen']
  },
  {
    id: 'Oceania',
    label: 'Châu Đại Dương',
    nameVi: 'Châu Đại Dương',
    nameEn: 'Oceania (Australia & NZ)',
    icon: '🦘',
    count: 1523,
    englishLabel: 'Oceania (Australia & NZ)',
    popularPorts: [
      'Sydney (AUSYD)',
      'Melbourne (AUMEL)',
      'Brisbane (AUBNE)',
      'Fremantle (AUFRE)',
      'Adelaide (AUADL)',
      'Auckland (NZAKL)',
      'Tauranga (NZTRG)',
      'Lyttelton (NZLYT)'
    ],
    shippingLines: ['ANL', 'Maersk', 'MSC', 'PIL', 'OOCL', 'COSCO', 'Swire Shipping']
  },
  {
    id: 'Africa',
    label: 'Châu Phi',
    nameVi: 'Châu Phi',
    nameEn: 'Africa (North, West, South, East)',
    icon: '🌍',
    count: 1640,
    englishLabel: 'Africa (North, West, South, East)',
    popularPorts: [
      'Durban (ZADUR)',
      'Cape Town (ZACPT)',
      'Alexandria (EGALY)',
      'Lagos / Apapa (NGLOS)',
      'Tema (GHTEM)',
      'Mombasa (KEMBA)',
      'Dar es Salaam (TZDAR)',
      'Casablanca (MACAS)',
      'Abidjan (CIABJ)'
    ],
    shippingLines: ['MSC', 'Maersk (Safmarine)', 'CMA CGM', 'PIL', 'COSCO', 'Messina']
  },
  {
    id: 'LatinAmerica',
    label: 'Mỹ La Tinh và Caribê',
    nameVi: 'Mỹ La Tinh & Caribê',
    nameEn: 'Latin America & Caribbean',
    icon: '🌴',
    count: 1890,
    englishLabel: 'Latin America & Caribbean',
    popularPorts: [
      'Santos (BRSSZ)',
      'Paranagua (BRPNG)',
      'Buenos Aires (ARBUE)',
      'Valparaiso / San Antonio (CLVAP)',
      'Callao (PECLL)',
      'Buenaventura (COBUN)',
      'Cartagena (COCTG)',
      'Balboa / Colon Panama (PABLB)',
      'Kingston (JMKIN)'
    ],
    shippingLines: ['Hamburg Süd', 'MSC', 'CMA CGM', 'Maersk', 'Hapag-Lloyd', 'COSCO']
  },
  {
    id: 'MiddleEast',
    label: 'Trung Đông',
    nameVi: 'Trung Đông',
    nameEn: 'Middle East & Red Sea',
    icon: '🕌',
    count: 2365,
    englishLabel: 'Middle East & Red Sea',
    popularPorts: [
      'Jebel Ali / Dubai (AEJEA)',
      'Dammam (SADMM)',
      'Jeddah (SAJED)',
      'Sohar (OMSHR)',
      'Hamad / Doha (QAHMD)',
      'Shuwaikh / Kuwait (KWKWI)',
      'Bahrain (BHKBS)',
      'Aqaba (JOAQB)'
    ],
    shippingLines: ['Emirates Shipping Line (ESL)', 'CMA CGM', 'MSC', 'Hapag-Lloyd', 'COSCO', 'UASC']
  }
];

export const POPULAR_POD_BY_REGION: Record<string, string[]> = {
  NorthAmerica: [
    'Los Angeles (USLAX)',
    'Long Beach (USLGB)',
    'Oakland (USOAK)',
    'Seattle / Tacoma (USSEA)',
    'New York / New Jersey (USNYC)',
    'Savannah (USSAV)',
    'Houston (USHOU)',
    'Vancouver (CAVAN)',
    'Montreal (CAMTR)',
    'Manzanillo Mexico (MXZLO)'
  ],
  Asia: [
    'Thượng Hải / Shanghai (CNSHA)',
    'Ninh Ba / Ningbo (CNNGB)',
    'Thâm Quyến / Yantian (CNYTN)',
    'Thanh Đảo / Qingdao (CNTAO)',
    'Tokyo / Yokohama (JPTYO)',
    'Busan / Incheon (KRPUS)',
    'Singapore (SGSIN)',
    'Port Klang / Tanjung Pelepas (MYPKG)',
    'Bangkok / Laem Chabang (THLCH)',
    'Jakarta (IDJKT)',
    'Nhava Sheva / Mundra India (INNSA)'
  ],
  Europe: [
    'Rotterdam (NLRTM)',
    'Hamburg (DEHAM)',
    'Antwerp (BEANR)',
    'Felixstowe / Southampton (GBFXT)',
    'Le Havre (FRLEH)',
    'Genoa (ITGOA)',
    'Valencia / Barcelona (ESVLC)',
    'Piraeus (GRPIR)',
    'Koper (SIKOP)',
    'Gdansk (PLGDN)'
  ],
  Oceania: [
    'Sydney (AUSYD)',
    'Melbourne (AUMEL)',
    'Brisbane (AUBNE)',
    'Fremantle (AUFRE)',
    'Adelaide (AUADL)',
    'Auckland (NZAKL)',
    'Tauranga (NZTRG)',
    'Lyttelton (NZLYT)'
  ],
  Africa: [
    'Durban (ZADUR)',
    'Cape Town (ZACPT)',
    'Alexandria (EGALY)',
    'Lagos / Apapa (NGLOS)',
    'Tema (GHTEM)',
    'Mombasa (KEMBA)',
    'Dar es Salaam (TZDAR)',
    'Casablanca (MACAS)',
    'Abidjan (CIABJ)'
  ],
  LatinAmerica: [
    'Santos (BRSSZ)',
    'Paranagua (BRPNG)',
    'Buenos Aires (ARBUE)',
    'Valparaiso / San Antonio (CLVAP)',
    'Callao (PECLL)',
    'Buenaventura (COBUN)',
    'Cartagena (COCTG)',
    'Balboa / Colon Panama (PABLB)',
    'Kingston (JMKIN)'
  ],
  MiddleEast: [
    'Jebel Ali / Dubai (AEJEA)',
    'Dammam (SADMM)',
    'Jeddah (SAJED)',
    'Sohar (OMSHR)',
    'Hamad / Doha (QAHMD)',
    'Shuwaikh / Kuwait (KWKWI)',
    'Bahrain (BHKBS)',
    'Aqaba (JOAQB)'
  ]
};

export const POL_VIETNAM_PORTS = [
  'Cát Lái (HCMC - VNSGN)',
  'Cái Mép (Bà Rịa Vũng Tàu - VNTCK)',
  'Hải Phòng (Đình Vũ / Lạch Huyện - VNHPH)',
  'Đà Nẵng (Tiên Sa - VNDAD)',
  'Quy Nhơn (VNUIH)',
  'Cần Thơ (VNVCA)',
  'Sân bay Tân Sơn Nhất (SGN Air Cargo)',
  'Sân bay Nội Bài (HAN Air Cargo)'
];

export const CONTAINER_TYPES = [
  'Container 20ft GP (Tiêu chuẩn)',
  'Container 40ft GP',
  'Container 40ft HQ (Cao)',
  'Container 45ft HQ',
  'Container Lạnh 20ft RF (Reefer)',
  'Container Lạnh 40ft HR (Reefer High Cube)',
  'Flat Rack 20ft/40ft (Hàng OOG quá khổ)',
  'Open Top 20ft/40ft (Mở nóc)',
  'LCL Đường Biển (USD / CBM)',
  'Air Cargo (USD / Kg)'
];

export const ALL_SHIPPING_LINES = [
  'Maersk Line',
  'MSC (Mediterranean Shipping Co.)',
  'CMA CGM Group',
  'COSCO Shipping Lines',
  'Hapag-Lloyd',
  'ONE (Ocean Network Express)',
  'Evergreen Marine Corp.',
  'HMM (Hyundai Merchant Marine)',
  'Yang Ming Marine Transport',
  'ZIM Integrated Shipping',
  'Wan Hai Lines',
  'PIL (Pacific International Lines)',
  'SITC Container Lines',
  'OOCL (Orient Overseas Container Line)',
  'Emirates Shipping Line (ESL)',
  'KMTC Line',
  'Sinokor Merchant Marine',
  'RCL (Regional Container Lines)'
];

