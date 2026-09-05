import React, { useRef, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Warehouse, 
  MapPin, 
  Award, 
  FileText, 
  Plus, 
  Trash2, 
  ExternalLink,
  CheckCircle2, 
  Sparkles, 
  Server, 
  Globe, 
  Mail, 
  Phone, 
  Download, 
  Ship, 
  Plane, 
  Boxes, 
  Users, 
  TrendingUp, 
  Anchor, 
  Briefcase, 
  Layers, 
  ChevronRight,
  Compass,
  Target,
  HeartHandshake,
  Calendar,
  Check,
  Camera,
  Upload
} from 'lucide-react';
import { 
  CompanyInfoProfile, 
  StudioTemplateConfig, 
  THEME_COLOR_OPTIONS,
  BranchOfficeItem,
  CaseStudyItem,
  CompanyStatItem,
  AffiliationItem,
  ServicePillarItem,
  CompanyMilestoneItem,
  CompanyCoreValueItem
} from '../../studioTypes';

export interface CompanyTemplateProps {
  company: CompanyInfoProfile;
  onChangeCompany: (company: CompanyInfoProfile) => void;
  config: StudioTemplateConfig;
  isReadOnly?: boolean;
}

export const CorporateFlagshipTemplate: React.FC<CompanyTemplateProps> = ({
  company,
  onChangeCompany,
  config,
  isReadOnly = false,
}) => {
  const theme = THEME_COLOR_OPTIONS[config.themeColor];
  const { visibleSections } = config;

  const logoInputRef = useRef<HTMLInputElement>(null);
  const [newIndustryTag, setNewIndustryTag] = useState('');
  const [newCarrierTag, setNewCarrierTag] = useState('');
  const [newClientTag, setNewClientTag] = useState('');
  const [newSoftwareTag, setNewSoftwareTag] = useState('');
  const [newLicenseTag, setNewLicenseTag] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh logo có dung lượng dưới 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChangeCompany({ ...company, logoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers
  const handleAddMilestone = () => {
    const newMs: CompanyMilestoneItem = {
      id: `ms-${Date.now()}`,
      year: `${new Date().getFullYear()}`,
      title: 'Dấu mốc phát triển mới',
      description: 'Mô tả tóm tắt sự kiện phát triển...'
    };
    onChangeCompany({ ...company, milestones: [...(company.milestones || []), newMs] });
  };

  const handleUpdateMilestone = (index: number, field: keyof CompanyMilestoneItem, val: string) => {
    const list = [...(company.milestones || [])];
    list[index] = { ...list[index], [field]: val };
    onChangeCompany({ ...company, milestones: list });
  };

  const handleRemoveMilestone = (index: number) => {
    const list = [...(company.milestones || [])];
    list.splice(index, 1);
    onChangeCompany({ ...company, milestones: list });
  };

  const handleAddCoreValue = () => {
    const newCv: CompanyCoreValueItem = {
      id: `cv-${Date.now()}`,
      title: 'Giá trị cốt lõi mới',
      description: 'Mô tả nguyên tắc thực thi và hành vi chuẩn mực...'
    };
    onChangeCompany({ ...company, coreValues: [...(company.coreValues || []), newCv] });
  };

  const handleUpdateCoreValue = (index: number, field: keyof CompanyCoreValueItem, val: string) => {
    const list = [...(company.coreValues || [])];
    list[index] = { ...list[index], [field]: val };
    onChangeCompany({ ...company, coreValues: list });
  };

  const handleRemoveCoreValue = (index: number) => {
    const list = [...(company.coreValues || [])];
    list.splice(index, 1);
    onChangeCompany({ ...company, coreValues: list });
  };

  const handleAddStat = () => {
    const newStat: CompanyStatItem = {
      id: `cs-${Date.now()}`,
      label: 'Chỉ số mới',
      value: '100+',
      subtext: 'Đơn vị tính'
    };
    onChangeCompany({ ...company, companyStats: [...(company.companyStats || []), newStat] });
  };

  const handleUpdateStat = (index: number, field: keyof CompanyStatItem, val: string) => {
    const list = [...(company.companyStats || [])];
    list[index] = { ...list[index], [field]: val };
    onChangeCompany({ ...company, companyStats: list });
  };

  const handleRemoveStat = (index: number) => {
    const list = [...(company.companyStats || [])];
    list.splice(index, 1);
    onChangeCompany({ ...company, companyStats: list });
  };

  const handleAddBranch = () => {
    const newBr: BranchOfficeItem = {
      id: `br-${Date.now()}`,
      city: 'Thành Phố / Hub Mới',
      address: 'Địa chỉ chi tiết văn phòng / kho bãi',
      type: 'Chi nhánh',
      phone: '(028) 1234 5678',
    };
    onChangeCompany({ ...company, branches: [...(company.branches || []), newBr] });
  };

  const handleUpdateBranch = (index: number, field: keyof BranchOfficeItem, val: string) => {
    const list = [...(company.branches || [])];
    list[index] = { ...list[index], [field]: val };
    onChangeCompany({ ...company, branches: list });
  };

  const handleRemoveBranch = (index: number) => {
    const list = [...(company.branches || [])];
    list.splice(index, 1);
    onChangeCompany({ ...company, branches: list });
  };

  const handleAddAffiliation = () => {
    const newAf: AffiliationItem = {
      id: `af-${Date.now()}`,
      name: 'Tên Tổ Chức / Hiệp Hội',
      type: 'Hiệp hội Logistics / Mạng lưới toàn cầu',
      codeOrYear: 'Hội viên chính thức'
    };
    onChangeCompany({ ...company, affiliations: [...(company.affiliations || []), newAf] });
  };

  const handleUpdateAffiliation = (index: number, field: keyof AffiliationItem, val: string) => {
    const list = [...(company.affiliations || [])];
    list[index] = { ...list[index], [field]: val };
    onChangeCompany({ ...company, affiliations: list });
  };

  const handleRemoveAffiliation = (index: number) => {
    const list = [...(company.affiliations || [])];
    list.splice(index, 1);
    onChangeCompany({ ...company, affiliations: list });
  };

  const handleAddPillar = () => {
    const newPillar: ServicePillarItem = {
      id: `sp-${Date.now()}`,
      title: 'Tên Trụ Cột Dịch Vụ Mới',
      description: 'Mô tả giải pháp, năng lực vận tải và cam kết SLA...'
    };
    onChangeCompany({ ...company, servicePillars: [...(company.servicePillars || []), newPillar] });
  };

  const handleUpdatePillar = (index: number, field: keyof ServicePillarItem, val: string) => {
    const list = [...(company.servicePillars || [])];
    list[index] = { ...list[index], [field]: val };
    onChangeCompany({ ...company, servicePillars: list });
  };

  const handleRemovePillar = (index: number) => {
    const list = [...(company.servicePillars || [])];
    list.splice(index, 1);
    onChangeCompany({ ...company, servicePillars: list });
  };

  const handleAddCaseStudy = () => {
    const newCs: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      title: 'Dự Án Vận Chuyển Quy Mô Lớn',
      clientIndustry: 'Ngành Hàng Khách Hàng',
      scale: 'Quy mô / Tuyến vận chuyển',
      result: 'Kết quả cam kết hoàn thành...'
    };
    onChangeCompany({ ...company, caseStudies: [...(company.caseStudies || []), newCs] });
  };

  const handleUpdateCaseStudy = (index: number, field: keyof CaseStudyItem, val: string) => {
    const list = [...(company.caseStudies || [])];
    list[index] = { ...list[index], [field]: val };
    onChangeCompany({ ...company, caseStudies: list });
  };

  const handleRemoveCaseStudy = (index: number) => {
    const list = [...(company.caseStudies || [])];
    list.splice(index, 1);
    onChangeCompany({ ...company, caseStudies: list });
  };

  const handleAddLicense = (licText: string) => {
    if (!licText.trim()) return;
    const current = company.licenses || [];
    if (!current.includes(licText.trim())) {
      onChangeCompany({ ...company, licenses: [...current, licText.trim()] });
    }
  };

  const handleRemoveLicense = (index: number) => {
    const current = [...(company.licenses || [])];
    current.splice(index, 1);
    onChangeCompany({ ...company, licenses: current });
  };

  const handleAddTagItem = (field: 'targetIndustries' | 'carrierPartners' | 'clientLogos' | 'softwareSystems', val: string) => {
    if (!val.trim()) return;
    const current = (company[field] as string[]) || [];
    if (!current.includes(val.trim())) {
      onChangeCompany({ ...company, [field]: [...current, val.trim()] });
    }
  };

  const handleRemoveTagItem = (field: 'targetIndustries' | 'carrierPartners' | 'clientLogos' | 'softwareSystems', index: number) => {
    const current = [...((company[field] as string[]) || [])];
    current.splice(index, 1);
    onChangeCompany({ ...company, [field]: current });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* 1. HERO CORPORATE BANNER (Full Width Flagship Portal)     */}
      {/* ========================================================= */}
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition-all"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 flex-1">
            {/* Logo with Upload */}
            <div className="flex flex-col items-center shrink-0">
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <div 
                onClick={() => !isReadOnly && logoInputRef.current?.click()}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 border-white/40 shadow-inner flex items-center justify-center shrink-0 text-white overflow-hidden relative group ${
                  !isReadOnly ? 'cursor-pointer hover:border-white/80 transition-all' : ''
                }`}
                title={!isReadOnly ? 'Bấm để tải lên logo công ty' : undefined}
              >
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-1.5 bg-white/95 rounded-2xl" />
                ) : (
                  <Building2 className="w-9 h-9 text-white/90" />
                )}
                {!isReadOnly && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                    <Camera className="w-5 h-5 mb-0.5 text-white" />
                    <span className="text-[9px] font-bold tracking-tight">{company.logoUrl ? 'Đổi Logo' : 'Tải Logo'}</span>
                  </div>
                )}
              </div>
              {!isReadOnly && (
                <div className="mt-1 flex items-center gap-1.5">
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="text-[10px] text-white/80 hover:text-white underline cursor-pointer font-semibold flex items-center gap-0.5">
                    <Upload className="w-2.5 h-2.5" /> <span>{company.logoUrl ? 'Đổi' : 'Tải logo'}</span>
                  </button>
                  {company.logoUrl && (
                    <>
                      <span className="text-white/40 text-[10px]">•</span>
                      <button type="button" onClick={() => onChangeCompany({ ...company, logoUrl: '' })} className="text-[10px] text-rose-300 hover:text-rose-200 cursor-pointer">Xóa</button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Corporate Name & Legal Info */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-black uppercase rounded-full tracking-wider border border-white/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>Cổng Pháp Nhân Doanh Nghiệp (Flagship)</span>
                </span>
                {isReadOnly ? (
                  <span className="text-xs text-white/85 font-semibold">
                    Năm thành lập: {company.yearEstablished || 2008} • Mã Số Thuế: {company.taxId || 'Chưa cập nhật'}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-white/90">
                    <span>Năm TL:</span>
                    <input type="number" value={company.yearEstablished || ''} onChange={(e) => onChangeCompany({ ...company, yearEstablished: parseInt(e.target.value) || 0 })} className="w-16 bg-white/10 px-2 py-0.5 rounded-lg border border-white/20 text-xs font-bold text-white outline-hidden" placeholder="2008" />
                    <span>• MST:</span>
                    <input type="text" value={company.taxId || ''} onChange={(e) => onChangeCompany({ ...company, taxId: e.target.value })} className="w-28 bg-white/10 px-2 py-0.5 rounded-lg border border-white/20 text-xs font-bold text-white outline-hidden" placeholder="Mã số thuế" />
                  </div>
                )}
              </div>

              {isReadOnly ? (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{company.companyName}</h1>
                  <p className="text-sm sm:text-base text-white/80 font-semibold mt-0.5">{company.companyNameEn}</p>
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-xl sm:text-2xl font-black bg-white/10 px-3 py-1.5 rounded-xl border border-white/30 text-white outline-hidden" placeholder="Tên công ty tiếng Việt" />
                  <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-xs font-semibold bg-white/10 px-3 py-1 rounded-lg border border-white/20 text-white/90 outline-hidden" placeholder="Tên công ty tiếng Anh" />
                </div>
              )}

              {/* Slogan */}
              <div className="pt-1 flex items-center gap-2 text-amber-200">
                <Sparkles className="w-4 h-4 shrink-0" />
                {isReadOnly ? (
                  <span className="text-xs sm:text-sm font-semibold italic text-white/95">"{company.companySlogan}"</span>
                ) : (
                  <input type="text" value={company.companySlogan} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full bg-white/10 px-2.5 py-1 rounded-lg text-xs italic text-white border border-white/20 outline-hidden" placeholder="Khẩu hiệu / Slogan" />
                )}
              </div>

              {/* Quick Links & Contact Bar */}
              {isReadOnly ? (
                <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
                  {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1.5 border border-white/20"><Globe className="w-3.5 h-3.5" /> Website</a>}
                  {company.brochureUrl && <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-amber-400/30 hover:bg-amber-400/40 text-amber-100 font-semibold flex items-center gap-1.5 border border-amber-300/30"><Download className="w-3.5 h-3.5" /> Company Profile (PDF)</a>}
                  {company.hotline && <span className="px-3 py-1 rounded-lg bg-white/10 text-white/90 font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {company.hotline}</span>}
                  {company.email && <span className="px-3 py-1 rounded-lg bg-white/10 text-white/90 font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {company.email}</span>}
                </div>
              ) : (
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/20"><Globe className="w-3.5 h-3.5 text-white/80 shrink-0" /><input type="text" value={company.websiteUrl || ''} onChange={(e) => onChangeCompany({ ...company, websiteUrl: e.target.value })} placeholder="Website..." className="w-full bg-transparent text-white text-xs outline-hidden placeholder-white/50" /></div>
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/20"><Download className="w-3.5 h-3.5 text-amber-200 shrink-0" /><input type="text" value={company.brochureUrl || ''} onChange={(e) => onChangeCompany({ ...company, brochureUrl: e.target.value })} placeholder="Profile PDF..." className="w-full bg-transparent text-white text-xs outline-hidden placeholder-white/50" /></div>
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/20"><Phone className="w-3.5 h-3.5 text-white/80 shrink-0" /><input type="text" value={company.hotline || ''} onChange={(e) => onChangeCompany({ ...company, hotline: e.target.value })} placeholder="Hotline..." className="w-full bg-transparent text-white text-xs outline-hidden placeholder-white/50" /></div>
                  <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/20"><Mail className="w-3.5 h-3.5 text-white/80 shrink-0" /><input type="text" value={company.email || ''} onChange={(e) => onChangeCompany({ ...company, email: e.target.value })} placeholder="Email RFQ..." className="w-full bg-transparent text-white text-xs outline-hidden placeholder-white/50" /></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. HORIZONTAL STATS BAR (Flagship Headline Metrics)        */}
      {/* ========================================================= */}
      {visibleSections.myCompany.highlights !== false && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Thước Đo Năng Lực & Tài Sản Cơ Sở Hạ Tầng
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddStat} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Thêm chỉ số
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(company.companyStats || []).map((stat, idx) => (
              <div key={stat.id || idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 relative group hover:border-indigo-300 transition-all">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveStat(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {isReadOnly ? (
                  <>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">{stat.label}</span>
                    <div className="text-lg font-black text-slate-900 tracking-tight">{stat.value}</div>
                    {stat.subtext && <p className="text-[11px] text-indigo-600 font-medium truncate">{stat.subtext}</p>}
                  </>
                ) : (
                  <div className="space-y-1">
                    <input type="text" value={stat.label} onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)} className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-transparent border-b border-dashed border-slate-300 outline-hidden" placeholder="Tên chỉ số" />
                    <input type="text" value={stat.value} onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)} className="w-full text-sm font-black text-slate-900 bg-transparent border-b border-dashed border-slate-300 outline-hidden" placeholder="Giá trị" />
                    <input type="text" value={stat.subtext || ''} onChange={(e) => handleUpdateStat(idx, 'subtext', e.target.value)} className="w-full text-[11px] text-indigo-600 font-medium bg-transparent border-b border-dashed border-slate-300 outline-hidden" placeholder="Ghi chú" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TWO-COLUMN BALANCED CORPORATE BODY                     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== LEFT SIDEBAR (4 cols) ==================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Branches & Office Network */}
          {visibleSections.myCompany.branches !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" /> Mạng Lưới Chi Nhánh & Hub
                </span>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddBranch} className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(company.branches || []).map((br, idx) => (
                  <div key={br.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 relative group hover:bg-white hover:border-rose-300 transition-all">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveBranch(idx)} className="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <>
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-rose-100 text-rose-800">{br.type}</span>
                        <h5 className="font-black text-slate-900 text-sm mt-0.5">{br.city}</h5>
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">{br.address}</p>
                        {br.phone && <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 pt-1"><Phone className="w-3 h-3 text-slate-400" /> {br.phone}</span>}
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <input type="text" value={br.city} onChange={(e) => handleUpdateBranch(idx, 'city', e.target.value)} className="w-full font-black text-xs text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden" placeholder="Thành phố" />
                        <textarea rows={2} value={br.address} onChange={(e) => handleUpdateBranch(idx, 'address', e.target.value)} className="w-full text-xs text-slate-600 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden" placeholder="Địa chỉ" />
                        <input type="text" value={br.phone || ''} onChange={(e) => handleUpdateBranch(idx, 'phone', e.target.value)} className="w-full text-[11px] text-slate-700 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden" placeholder="Hotline" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affiliations & Licenses */}
          {visibleSections.myCompany.compliance !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" /> Chứng Nhận & Hiệp Hội
                </span>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddAffiliation} className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {(company.affiliations || []).map((af, idx) => (
                  <div key={af.id || idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between text-xs relative group">
                    <div>
                      <div className="font-black text-slate-900">{af.name}</div>
                      <div className="text-[11px] text-slate-600">{af.type}</div>
                      {af.codeOrYear && <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 bg-amber-200/60 text-amber-900 rounded">{af.codeOrYear}</span>}
                    </div>
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveAffiliation(idx)} className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Licenses tags */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Giấy phép vận tải & Pháp lý:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(company.licenses || []).map((lic, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{lic}</span>
                      {!isReadOnly && (
                        <button type="button" onClick={() => handleRemoveLicense(idx)} className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer">×</button>
                      )}
                    </span>
                  ))}
                </div>
                {!isReadOnly && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input type="text" value={newLicenseTag} onChange={(e) => setNewLicenseTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLicense(newLicenseTag); setNewLicenseTag(''); } }} placeholder="Thêm giấy phép..." className="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-hidden" />
                    <button type="button" onClick={() => { handleAddLicense(newLicenseTag); setNewLicenseTag(''); }} className="px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer">Thêm</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technology Systems */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-600" /> Nền Tảng Công Nghệ Điều Vận
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(company.softwareSystems || []).map((sys, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{sys}</span>
                  {!isReadOnly && (
                    <button type="button" onClick={() => handleRemoveTagItem('softwareSystems', idx)} className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer">×</button>
                  )}
                </span>
              ))}
            </div>
            {!isReadOnly && (
              <div className="flex items-center gap-1.5 pt-1">
                <input type="text" value={newSoftwareTag} onChange={(e) => setNewSoftwareTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('softwareSystems', newSoftwareTag); setNewSoftwareTag(''); } }} placeholder="Thêm phần mềm..." className="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-hidden" />
                <button type="button" onClick={() => { handleAddTagItem('softwareSystems', newSoftwareTag); setNewSoftwareTag(''); }} className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer">Thêm</button>
              </div>
            )}
          </div>
        </div>

        {/* ==================== RIGHT MAIN CONTENT (8 cols) ==================== */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* About & Milestones */}
          {visibleSections.myCompany.about !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Câu Chuyện Doanh Nghiệp & Lịch Sử Hình Thành</h3>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddMilestone} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm cột mốc
                  </button>
                )}
              </div>

              {/* Bio Story */}
              {isReadOnly ? (
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200 whitespace-pre-line">{company.companyBio}</p>
              ) : (
                <textarea rows={5} value={company.companyBio} onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} className="w-full p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl leading-relaxed outline-hidden" placeholder="Giới thiệu câu chuyện thương hiệu..." />
              )}

              {/* Timeline Milestones */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Các Dấu Mốc Lịch Sử Tiêu Biểu:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(company.milestones || []).map((ms, idx) => (
                    <div key={ms.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs relative group hover:border-indigo-300 transition-all">
                      {!isReadOnly && (
                        <button type="button" onClick={() => handleRemoveMilestone(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isReadOnly ? (
                        <div>
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black text-xs">{ms.year}</span>
                          <h5 className="font-bold text-slate-900 text-sm mt-1">{ms.title}</h5>
                          {ms.description && <p className="text-slate-600 mt-0.5">{ms.description}</p>}
                        </div>
                      ) : (
                        <div className="space-y-1.5 pr-4">
                          <input type="text" value={ms.year} onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)} className="w-20 font-black text-indigo-800 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded outline-hidden" placeholder="Năm" />
                          <input type="text" value={ms.title} onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)} className="w-full font-bold text-slate-900 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded outline-hidden" placeholder="Tiêu đề" />
                          <textarea rows={2} value={ms.description || ''} onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)} className="w-full text-slate-600 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded outline-hidden" placeholder="Mô tả" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vision, Mission & Core Values */}
          {visibleSections.myCompany.visionMission !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Tầm Nhìn, Sứ Mệnh & Giá Trị Cốt Lõi</h3>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddCoreValue} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm giá trị
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <span className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5"><Compass className="w-4 h-4 text-blue-600" /> Tầm Nhìn (Vision)</span>
                  {isReadOnly ? (
                    <p className="text-xs text-blue-950/80 leading-relaxed font-medium">{company.vision}</p>
                  ) : (
                    <textarea rows={3} value={company.vision || ''} onChange={(e) => onChangeCompany({ ...company, vision: e.target.value })} className="w-full p-2.5 text-xs text-blue-950 bg-white border border-blue-200 rounded-xl outline-hidden" placeholder="Tầm nhìn..." />
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-600" /> Sứ Mệnh (Mission)</span>
                  {isReadOnly ? (
                    <p className="text-xs text-emerald-950/80 leading-relaxed font-medium">{company.mission}</p>
                  ) : (
                    <textarea rows={3} value={company.mission || ''} onChange={(e) => onChangeCompany({ ...company, mission: e.target.value })} className="w-full p-2.5 text-xs text-emerald-950 bg-white border border-emerald-200 rounded-xl outline-hidden" placeholder="Sứ mệnh..." />
                  )}
                </div>
              </div>

              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(company.coreValues || []).map((cv, idx) => (
                  <div key={cv.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs relative group hover:border-purple-300 transition-all">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveCoreValue(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <div>
                        <h5 className="font-black text-slate-900 text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> {cv.title}</h5>
                        {cv.description && <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{cv.description}</p>}
                      </div>
                    ) : (
                      <div className="space-y-1 pr-4">
                        <input type="text" value={cv.title} onChange={(e) => handleUpdateCoreValue(idx, 'title', e.target.value)} className="w-full font-bold text-xs text-slate-900 px-2 py-0.5 bg-white border border-slate-200 rounded outline-hidden" placeholder="Tên giá trị" />
                        <textarea rows={2} value={cv.description || ''} onChange={(e) => handleUpdateCoreValue(idx, 'description', e.target.value)} className="w-full text-xs text-slate-600 px-2 py-0.5 bg-white border border-slate-200 rounded outline-hidden" placeholder="Mô tả" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Pillars & Industries */}
          {visibleSections.myCompany.ecosystem !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">3</div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Trụ Cột Dịch Vụ Cung Cấp & Ngành Hàng</h3>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddPillar} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm dịch vụ
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(company.servicePillars || []).map((sp, idx) => (
                  <div key={sp.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs relative group hover:bg-white hover:border-emerald-300 transition-all">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemovePillar(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">{sp.title}</h4>
                          <p className="text-slate-600 mt-1 leading-relaxed">{sp.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pr-6">
                        <input type="text" value={sp.title} onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)} className="w-full font-black text-xs text-slate-900 px-2.5 py-1 bg-white border border-slate-200 rounded-lg outline-hidden" placeholder="Tên dịch vụ" />
                        <textarea rows={2} value={sp.description} onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)} className="w-full text-xs text-slate-600 px-2.5 py-1 bg-white border border-slate-200 rounded-lg outline-hidden" placeholder="Mô tả năng lực dịch vụ..." />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Target Industries */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ngành hàng chuyên biệt phục vụ:</span>
                <div className="flex flex-wrap gap-2">
                  {(company.targetIndustries || []).map((ind, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{ind}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('targetIndustries', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                </div>
                {!isReadOnly && (
                  <div className="flex items-center gap-2 pt-1 max-w-md">
                    <input type="text" value={newIndustryTag} onChange={(e) => setNewIndustryTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('targetIndustries', newIndustryTag); setNewIndustryTag(''); } }} placeholder="Thêm ngành hàng..." className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden" />
                    <button type="button" onClick={() => { handleAddTagItem('targetIndustries', newIndustryTag); setNewIndustryTag(''); }} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer">Thêm</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Case Studies */}
          {visibleSections.myCompany.caseStudies !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">4</div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Dự Án Logistics Trọng Điểm & Case Studies</h3>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddCaseStudy} className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl border border-teal-200 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm dự án
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {(company.caseStudies || []).map((cs, idx) => (
                  <div key={cs.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 relative group hover:border-teal-300 transition-all">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveCaseStudy(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded">{cs.clientIndustry}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold text-slate-700">{cs.scale}</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">{cs.title}</h4>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{cs.result}</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 pr-6">
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={cs.clientIndustry} onChange={(e) => handleUpdateCaseStudy(idx, 'clientIndustry', e.target.value)} className="text-xs font-bold text-indigo-800 px-2 py-1 bg-white border border-slate-200 rounded outline-hidden" placeholder="Ngành hàng" />
                          <input type="text" value={cs.scale} onChange={(e) => handleUpdateCaseStudy(idx, 'scale', e.target.value)} className="text-xs font-bold text-slate-700 px-2 py-1 bg-white border border-slate-200 rounded outline-hidden" placeholder="Quy mô" />
                        </div>
                        <input type="text" value={cs.title} onChange={(e) => handleUpdateCaseStudy(idx, 'title', e.target.value)} className="w-full text-xs font-black text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded outline-hidden" placeholder="Tên dự án" />
                        <textarea rows={2} value={cs.result} onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)} className="w-full text-xs text-emerald-900 font-semibold px-2 py-1 bg-white border border-emerald-200 rounded outline-hidden" placeholder="Kết quả SLA đạt được" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partners & Clients */}
          {visibleSections.myCompany.partners !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-purple-600" /> Hãng Tàu Đối Tác & Khách Hàng Tiêu Biểu
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Hãng Tàu & Airlines:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(company.carrierPartners || []).map((partner, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 flex items-center gap-1">
                        <span>{partner}</span>
                        {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('carrierPartners', idx)} className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer">×</button>}
                      </span>
                    ))}
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <input type="text" value={newCarrierTag} onChange={(e) => setNewCarrierTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('carrierPartners', newCarrierTag); setNewCarrierTag(''); } }} placeholder="Thêm hãng tàu..." className="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-hidden" />
                      <button type="button" onClick={() => { handleAddTagItem('carrierPartners', newCarrierTag); setNewCarrierTag(''); }} className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer">Thêm</button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Khách Hàng FDI Tiêu Biểu:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(company.clientLogos || []).map((client, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-1">
                        <span>{client}</span>
                        {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('clientLogos', idx)} className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer">×</button>}
                      </span>
                    ))}
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <input type="text" value={newClientTag} onChange={(e) => setNewClientTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('clientLogos', newClientTag); setNewClientTag(''); } }} placeholder="Thêm khách hàng..." className="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-hidden" />
                      <button type="button" onClick={() => { handleAddTagItem('clientLogos', newClientTag); setNewClientTag(''); }} className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer">Thêm</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
