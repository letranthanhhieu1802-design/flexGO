// Studio Types for Supplier & Saleman Profile Builder (TopCV Style)

export type TemplateId = 
  | 'executive-elite' 
  | 'modern-bento' 
  | 'minimalist' 
  | 'bold-compact'
  | 'classic-prestige'
  | 'prime-experience'
  | 'grand-banner'
  | 'clean-elegance'
  | 'modular-matrix'
  | 'speed-hunter';

export type CompanyTemplateId = 'corporate-flagship' | 'modern-bento' | 'minimalist' | 'industrial-impact';

export type ThemeColorId = 'navy' | 'emerald' | 'crimson' | 'amber' | 'slate';

export interface ThemeColorOption {
  id: ThemeColorId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  ring: string;
}

export const THEME_COLOR_OPTIONS: Record<ThemeColorId, ThemeColorOption> = {
  navy: {
    id: 'navy',
    name: 'Xanh Navy Classic',
    primary: '#1e3a8a',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
    badgeText: 'text-blue-900',
    border: 'border-blue-600',
    ring: 'ring-blue-600',
  },
  emerald: {
    id: 'emerald',
    name: 'Xanh Ngọc Emerald',
    primary: '#065f46',
    secondary: '#10b981',
    accent: '#34d399',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    badgeText: 'text-emerald-900',
    border: 'border-emerald-600',
    ring: 'ring-emerald-600',
  },
  crimson: {
    id: 'crimson',
    name: 'Đỏ Rượu Crimson',
    primary: '#881337',
    secondary: '#e11d48',
    accent: '#f43f5e',
    badgeBg: 'bg-rose-50 text-rose-900 border-rose-200',
    badgeText: 'text-rose-900',
    border: 'border-rose-600',
    ring: 'ring-rose-600',
  },
  amber: {
    id: 'amber',
    name: 'Cam Hổ Phách Amber',
    primary: '#78350f',
    secondary: '#f59e0b',
    accent: '#fbbf24',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    badgeText: 'text-amber-900',
    border: 'border-amber-600',
    ring: 'ring-amber-600',
  },
  slate: {
    id: 'slate',
    name: 'Xám Titan Dark Slate',
    primary: '#0f172a',
    secondary: '#475569',
    accent: '#94a3b8',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
    badgeText: 'text-slate-900',
    border: 'border-slate-800',
    ring: 'ring-slate-800',
  },
};

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  keyAchievement?: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  period: string;
  honors?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  code?: string;
}

export interface HighlightStatItem {
  id: string;
  label: string;
  value: string;
  subtext?: string;
}

export interface BranchOfficeItem {
  id: string;
  city: string;
  address: string;
  type: 'Trụ sở chính' | 'Chi nhánh' | 'Văn phòng cảng/kho';
  phone?: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  clientIndustry: string;
  scale: string;
  result: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description?: string;
}

export interface SalemanPersonalProfile {
  name: string;
  vietnameseName: string;
  nickname?: string;
  avatarUrl: string;
  avatarInitial: string;
  coverBannerUrl?: string;
  title: string;
  motto: string;
  bio: string;
  phone: string;
  zaloPhone?: string;
  email: string;
  linkedinUrl?: string;
  workingHours?: string;
  languages: string[];
  specialties: string[];
  targetIndustries?: string[];
  skills?: string[];
  hobbies?: string[];
  awards?: AwardItem[];
  
  // Structured items
  experiences: WorkExperienceItem[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  highlightStats: HighlightStatItem[];
}

export interface CompanyStatItem {
  id: string;
  label: string;
  value: string;
  subtext?: string;
}

export interface CompanyAffiliationItem {
  id: string;
  name: string;
  type: string;
  codeOrYear?: string;
}

export interface CompanyServicePillarItem {
  id: string;
  title: string;
  description: string;
}

export interface CompanyMilestoneItem {
  id: string;
  year: string;
  title: string;
  description?: string;
}

export interface CompanyCoreValueItem {
  id: string;
  title: string;
  description?: string;
}

// Type aliases cho tương thích ngược
export type AffiliationItem = CompanyAffiliationItem;
export type ServicePillarItem = CompanyServicePillarItem;

export interface CompanyInfoProfile {
  companyName: string;
  companyNameEn: string;
  yearEstablished: number;
  logoUrl: string;
  coverBannerUrl?: string;
  companySlogan: string;
  companyBio: string;
  websiteUrl?: string;
  brochureUrl?: string;
  hotline?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };

  // Block 1: Về chúng tôi & Dấu mốc lịch sử
  milestones?: CompanyMilestoneItem[];

  // Block 2: Tầm nhìn, Sứ mệnh & Giá trị cốt lõi
  vision?: string;
  mission?: string;
  coreValues?: CompanyCoreValueItem[];
  
  // Block 3: Thước đo quy mô & năng lực cốt lõi (Có thể thêm/sửa/xóa từng chỉ số)
  companyStats: CompanyStatItem[];
  
  // Hệ thống công nghệ quản trị (TMS, WMS, EDI...)
  softwareSystems: string[];
  
  // Block 7: Mạng lưới chi nhánh & văn phòng (Thêm/sửa/xóa)
  branches: BranchOfficeItem[];
  
  // Block 6: Thành viên hiệp hội & Mạng lưới toàn cầu (Thêm/sửa/xóa)
  affiliations: CompanyAffiliationItem[];
  
  // Block 4: Hệ sinh thái dịch vụ & Ngành hàng thế mạnh (Thêm/sửa/xóa)
  servicePillars: CompanyServicePillarItem[];
  targetIndustries: string[];
  
  // Block 5: Đối tác chiến lược & Khách hàng tiêu biểu (Thêm/sửa/xóa)
  carrierPartners: string[];
  clientLogos: string[];
  
  // Block 8: Dự án & Case studies thành công (Thêm/sửa/xóa)
  caseStudies: CaseStudyItem[];

  // Trường tương thích ngược & Bổ sung
  taxId?: string;
  employeeCount?: string;
  employeeSubtext?: string;
  annualVolume?: string;
  volumeSubtext?: string;
  truckFleetCount?: string;
  warehouseArea?: string;
  licenses?: string[];
  certifications?: string[];
}

export interface StudioTemplateConfig {
  activeTemplateId: TemplateId;
  activeCompanyTemplateId?: CompanyTemplateId;
  themeColor: ThemeColorId;
  fontFamily: 'Inter' | 'Roboto' | 'Montserrat';
  visibleSections: {
    myProfile: {
      experiences: boolean;
      educations: boolean;
      certifications: boolean;
      highlightStats: boolean;
      specialties: boolean;
      languages: boolean;
      targetIndustries: boolean;
      awards?: boolean;
      skills?: boolean;
      hobbies?: boolean;
    };
    myCompany: {
      about?: boolean;
      visionMission?: boolean;
      highlights: boolean;
      branches: boolean;
      affiliations: boolean;
      ecosystem: boolean;
      partners: boolean;
      caseStudies: boolean;
      compliance?: boolean;
      infrastructure?: boolean;
      clients?: boolean;
    };
  };
}
