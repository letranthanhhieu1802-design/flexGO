import React, { useRef, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Leaf, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Mail, 
  Phone, 
  Download, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Camera, 
  Upload, 
  Boxes, 
  FileText, 
  Globe,
  Landmark,
  Scale,
  Users,
  Check,
  ExternalLink,
  Truck,
  Warehouse,
  Briefcase,
  Compass,
  Target,
  HeartHandshake,
  Layers
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
import { CompanyTemplateProps } from './CorporateFlagshipTemplate';

export const CorporateHeritageTemplate: React.FC<CompanyTemplateProps> = ({
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
        alert('Vui lòng chọn ảnh logo dưới 5MB');
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

  // Handlers for dynamic lists
  const handleAddMilestone = () => {
    const newMs: CompanyMilestoneItem = {
      id: `ms-${Date.now()}`,
      year: `${new Date().getFullYear()}`,
      title: 'Mốc Phát Triển Lịch Sử Mới',
      description: 'Ghi dấu bước chuyển mình chiến lược hoặc mở rộng quy mô...'
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
      description: 'Mô tả nguyên tắc và tiêu chuẩn vận hành...'
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
      label: 'Chỉ số năng lực',
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

  const handleAddPillar = () => {
    const newPillar: ServicePillarItem = {
      id: `sp-${Date.now()}`,
      title: 'Trụ Cột Dịch Vụ Mới',
      description: 'Giải pháp tích hợp năng lực vận tải và cam kết SLA...'
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

  const handleAddBranch = () => {
    const newBr: BranchOfficeItem = {
      id: `br-${Date.now()}`,
      city: 'Thành Phố / Hub Mới',
      address: 'Địa chỉ trụ sở / trung tâm logistics',
      type: 'Chi nhánh',
      phone: '(028) 3822 8888',
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
      name: 'Tổ Chức / Hiệp Hội Mới',
      type: 'Hiệp hội Logistics & Vận tải Quốc tế',
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

  const handleAddCaseStudy = () => {
    const newCs: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      title: 'Dự Án Trọng Điểm Doanh Nghiệp',
      clientIndustry: 'Ngành Hàng Khách Hàng',
      scale: 'Quy mô vận chuyển / Tuyến trọng điểm',
      result: 'Chỉ số SLA và hiệu quả bàn giao đạt 100%'
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
      {/* 1. ROYAL HERITAGE BANNER (Aristocratic Trust & Legacy)     */}
      {/* ========================================================= */}
      <div 
        className="rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden transition-all border-2 border-amber-300/30"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-2 opacity-10 pointer-events-none">
          <Landmark className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Brand Logo & Heritage Title */}
            <div className="flex items-start sm:items-center gap-5">
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <div 
                onClick={() => !isReadOnly && logoInputRef.current?.click()}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border-2 border-amber-300/50 shadow-inner flex items-center justify-center shrink-0 text-white overflow-hidden relative group backdrop-blur-md ${
                  !isReadOnly ? 'cursor-pointer hover:border-amber-200 transition-all' : ''
                }`}
                title={!isReadOnly ? 'Tải lên logo công ty' : undefined}
              >
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-2 bg-white/95 rounded-2xl" />
                ) : (
                  <Landmark className="w-10 h-10 text-amber-300" />
                )}
                {!isReadOnly && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold tracking-tight">Logo</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 bg-amber-400/20 text-amber-200 text-[10px] font-black uppercase rounded-full tracking-wider border border-amber-300/40 flex items-center gap-1.5 shadow-xs">
                    <Award className="w-3.5 h-3.5 text-amber-300" /> Hồ Sơ Năng Lực Pháp Nhân Bền Vững
                  </span>
                  <span className="text-xs text-amber-100/90 font-mono">
                    Năm thành lập: <strong>{company.yearEstablished || '---'}</strong> • MST: <strong>{company.taxId || 'Chưa cập nhật'}</strong>
                  </span>
                </div>

                {isReadOnly ? (
                  <>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">{company.companyName}</h1>
                    <p className="text-sm sm:text-base text-amber-100/90 font-medium">{company.companyNameEn}</p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-2xl sm:text-3xl font-black bg-white/10 px-3 py-1 rounded-xl border border-white/20 text-white outline-hidden" placeholder="Tên công ty / tập đoàn" />
                    <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-xs sm:text-sm bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-amber-200 outline-hidden" placeholder="Company English Trade Name" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="bg-black/25 border border-white/20 rounded-2xl p-4 backdrop-blur-md space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-300" /> Hồ Sơ Xác Thực & Năng Lực Toàn Diện
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</a>}
                {company.brochureUrl && <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-amber-400/30 text-amber-100 font-semibold flex items-center gap-1.5 border border-amber-300/30"><Download className="w-3.5 h-3.5" /> Hồ Sơ PDF</a>}
                {company.hotline && <span className="px-3 py-1.5 rounded-xl bg-black/30 text-white font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-300" /> {company.hotline}</span>}
                {company.email && <span className="px-3 py-1.5 rounded-xl bg-black/30 text-white font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-300" /> {company.email}</span>}
              </div>
            </div>

          </div>

          {/* Slogan */}
          <div className="p-3 bg-black/30 border-l-4 border-amber-400 rounded-r-2xl text-xs sm:text-sm text-amber-100 italic flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            {isReadOnly ? (
              <span>"{company.companySlogan || 'Đồng hành tin cậy - Vững bước tương lai'}"</span>
            ) : (
              <input 
                type="text" 
                value={company.companySlogan || ''} 
                onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} 
                className="w-full bg-white/10 px-2 py-0.5 rounded border border-white/20 text-amber-100 outline-hidden" 
                placeholder="Khẩu hiệu hành động / Slogan doanh nghiệp" 
              />
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. HIGHLIGHTS & OPERATIONAL CAPACITY STRIP               */}
      {/* ========================================================= */}
      {visibleSections.myCompany.highlights !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-800">
              <TrendingUp className="w-4 h-4" style={{ color: theme.primary }} />
              <span>Năng Lực Vận Hành & Chỉ Số Quy Mô</span>
            </div>
            {!isReadOnly && (
              <button 
                type="button" 
                onClick={handleAddStat} 
                className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80"
                style={{ color: theme.primary }}
              >
                <Plus className="w-3.5 h-3.5" /> Thêm chỉ số
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nhân Lực Chuyên Môn</span>
              {isReadOnly ? (
                <div className="text-xl sm:text-2xl font-black text-slate-900">{company.employeeCount || 'Đang cập nhật'}</div>
              ) : (
                <input 
                  type="text" 
                  value={company.employeeCount || ''} 
                  onChange={(e) => onChangeCompany({ ...company, employeeCount: e.target.value })} 
                  className="w-full text-base font-black bg-white px-2 py-1 rounded border border-slate-200"
                  placeholder="Ví dụ: 350+ Nhân viên"
                />
              )}
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">{company.employeeSubtext || 'Đội ngũ chuyên nghiệp'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Đội Xe & Thiết Bị</span>
              {isReadOnly ? (
                <div className="text-xl sm:text-2xl font-black text-slate-900">{company.truckFleetCount || 'Đang cập nhật'}</div>
              ) : (
                <input 
                  type="text" 
                  value={company.truckFleetCount || ''} 
                  onChange={(e) => onChangeCompany({ ...company, truckFleetCount: e.target.value })} 
                  className="w-full text-base font-black bg-white px-2 py-1 rounded border border-slate-200"
                  placeholder="Ví dụ: 85 Đầu kéo & Xe tải"
                />
              )}
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">{company.fleetSubtext || '100% Giám sát GPS'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Diện Tích Kho Bãi</span>
              {isReadOnly ? (
                <div className="text-xl sm:text-2xl font-black text-slate-900">{company.warehouseArea || 'Đang cập nhật'}</div>
              ) : (
                <input 
                  type="text" 
                  value={company.warehouseArea || ''} 
                  onChange={(e) => onChangeCompany({ ...company, warehouseArea: e.target.value })} 
                  className="w-full text-base font-black bg-white px-2 py-1 rounded border border-slate-200"
                  placeholder="Ví dụ: 25,000 m²"
                />
              )}
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">{company.warehouseSubtext || 'Tiêu chuẩn quốc tế'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Sản Lượng Thường Niên</span>
              {isReadOnly ? (
                <div className="text-xl sm:text-2xl font-black text-slate-900">{company.annualVolume || 'Đang cập nhật'}</div>
              ) : (
                <input 
                  type="text" 
                  value={company.annualVolume || ''} 
                  onChange={(e) => onChangeCompany({ ...company, annualVolume: e.target.value })} 
                  className="w-full text-base font-black bg-white px-2 py-1 rounded border border-slate-200"
                  placeholder="Ví dụ: 80,000+ TEUs"
                />
              )}
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">{company.volumeSubtext || 'Đảm bảo tiến độ SLA'}</span>
            </div>
          </div>

          {/* Dynamic custom company stats */}
          {(company.companyStats || []).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {(company.companyStats || []).map((st, idx) => (
                <div key={st.id || idx} className="p-3 rounded-xl bg-slate-50/80 border border-dashed border-slate-200 relative group text-xs">
                  {!isReadOnly && (
                    <button type="button" onClick={() => handleRemoveStat(idx)} className="absolute top-1.5 right-1.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  {isReadOnly ? (
                    <>
                      <div className="font-bold text-slate-500 text-[10px] uppercase">{st.label}</div>
                      <div className="font-black text-base text-slate-800">{st.value}</div>
                      <div className="text-[10px] text-slate-400">{st.subtext}</div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <input type="text" value={st.label} onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)} className="w-full text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 rounded px-1" placeholder="Nhãn chỉ số" />
                      <input type="text" value={st.value} onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)} className="w-full text-sm font-black text-slate-800 bg-white border border-slate-200 rounded px-1" placeholder="Giá trị" />
                      <input type="text" value={st.subtext || ''} onChange={(e) => handleUpdateStat(idx, 'subtext', e.target.value)} className="w-full text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1" placeholder="Ghi chú" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CENTRAL SPINE TIMELINE & CORPORATE NARRATIVE            */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ABOUT STORY, VISION & MISSION, VALUES (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Block 1: About */}
          {visibleSections.myCompany.about !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4" style={{ color: theme.primary }} />
                <span>Câu Chuyện & Lịch Sử Hình Thành</span>
              </div>
              {isReadOnly ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {company.companyBio || 'Chưa cập nhật thông tin giới thiệu công ty.'}
                </p>
              ) : (
                <textarea 
                  rows={5} 
                  value={company.companyBio || ''} 
                  onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} 
                  className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl outline-hidden" 
                  placeholder="Giới thiệu về bề dày lịch sử, kinh nghiệm và hành trình phát triển..." 
                />
              )}
            </div>
          )}

          {/* Block 2: Vision, Mission & Core Values */}
          {visibleSections.myCompany.visionMission !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Compass className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Tầm Nhìn & Sứ Mệnh Doanh Nghiệp</span>
                </div>
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={handleAddCoreValue} 
                    className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm giá trị
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase">
                    <Target className="w-3.5 h-3.5 text-amber-700" /> Tầm Nhìn Chiến Lược
                  </div>
                  {isReadOnly ? (
                    <p className="text-xs text-slate-700 leading-relaxed">{company.vision || 'Đang cập nhật tầm nhìn...'}</p>
                  ) : (
                    <textarea 
                      rows={3} 
                      value={company.vision || ''} 
                      onChange={(e) => onChangeCompany({ ...company, vision: e.target.value })} 
                      className="w-full p-2 text-xs text-slate-700 bg-white border border-amber-200 rounded-xl outline-hidden" 
                      placeholder="Tầm nhìn dài hạn..." 
                    />
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" /> Sứ Mệnh Phục Vụ
                  </div>
                  {isReadOnly ? (
                    <p className="text-xs text-slate-700 leading-relaxed">{company.mission || 'Đang cập nhật sứ mệnh...'}</p>
                  ) : (
                    <textarea 
                      rows={3} 
                      value={company.mission || ''} 
                      onChange={(e) => onChangeCompany({ ...company, mission: e.target.value })} 
                      className="w-full p-2 text-xs text-slate-700 bg-white border border-emerald-200 rounded-xl outline-hidden" 
                      placeholder="Sứ mệnh phục vụ khách hàng và cộng đồng..." 
                    />
                  )}
                </div>
              </div>

              {/* Core values */}
              {(company.coreValues || []).length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-600 block">Hệ Giá Trị Cốt Lõi:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(company.coreValues || []).map((cv, idx) => (
                      <div key={cv.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs relative group">
                        {!isReadOnly && (
                          <button type="button" onClick={() => handleRemoveCoreValue(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isReadOnly ? (
                          <>
                            <div className="font-black text-slate-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {cv.title}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">{cv.description}</p>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <input type="text" value={cv.title} onChange={(e) => handleUpdateCoreValue(idx, 'title', e.target.value)} className="w-full font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Tên giá trị" />
                            <textarea rows={1} value={cv.description || ''} onChange={(e) => handleUpdateCoreValue(idx, 'description', e.target.value)} className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Mô tả" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Block 4: Service Pillars & Target Industries */}
          {visibleSections.myCompany.ecosystem !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Layers className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Trụ Cột Dịch Vụ Cốt Lõi</span>
                </div>
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={handleAddPillar} 
                    className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm trụ cột
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(company.servicePillars || []).map((sp, idx) => (
                  <div key={sp.id || idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 relative group text-xs hover:border-slate-300 transition-all">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemovePillar(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="font-black text-sm text-slate-900">{sp.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2 pl-8">{sp.description}</p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs shrink-0">{idx + 1}</span>
                          <input type="text" value={sp.title} onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)} className="w-full font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-2 py-1" placeholder="Tên trụ cột dịch vụ" />
                        </div>
                        <textarea rows={2} value={sp.description || ''} onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)} className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded p-2" placeholder="Mô tả năng lực và cam kết..." />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Target industries tags */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Ngành Hàng Trọng Tâm Phục Vụ:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(company.targetIndustries || []).map((ind, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1 border border-slate-200">
                      <span>{ind}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('targetIndustries', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                  {!isReadOnly && (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        value={newIndustryTag} 
                        onChange={(e) => setNewIndustryTag(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('targetIndustries', newIndustryTag); setNewIndustryTag(''); } }}
                        placeholder="+ Ngành hàng..." 
                        className="px-2 py-0.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden w-28"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CENTRAL SPINE CHRONOLOGY, COMPLIANCE, BRANCHES & CASES (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">

          {/* Central Spine Milestones Timeline */}
          {visibleSections.myCompany.about !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Trục Dấu Mốc Lịch Sử (Central Spine)</span>
                </div>
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={handleAddMilestone} 
                    className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm mốc lịch sử
                  </button>
                )}
              </div>

              {/* Spine Visual Layout */}
              <div className="relative pl-6 border-l-2 space-y-6 my-2" style={{ borderColor: theme.primary + '40' }}>
                {(company.milestones || []).map((ms, idx) => (
                  <div key={ms.id || idx} className="relative group text-xs">
                    {/* Spine Dot */}
                    <div 
                      className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span 
                          className="px-2 py-0.5 rounded text-[11px] font-black text-white"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {ms.year}
                        </span>
                        {!isReadOnly && (
                          <button type="button" onClick={() => handleRemoveMilestone(idx)} className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {isReadOnly ? (
                        <>
                          <h4 className="font-bold text-slate-900 text-xs mt-1">{ms.title}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{ms.description}</p>
                        </>
                      ) : (
                        <div className="space-y-1 pt-1">
                          <input type="text" value={ms.year} onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)} className="w-20 font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Năm" />
                          <input type="text" value={ms.title} onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)} className="w-full font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Tiêu đề mốc" />
                          <textarea rows={2} value={ms.description || ''} onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)} className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded p-1.5" placeholder="Mô tả chi tiết sự kiện" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Block 6: Compliance & Legal Governance */}
          {visibleSections.myCompany.compliance !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tuân Thủ Pháp Lý & Hiệp Hội (Compliance)</span>
                </div>
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={handleAddAffiliation} 
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm hiệp hội
                  </button>
                )}
              </div>

              {/* Licenses and Certifications */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Giấy Phép Vận Tải & Chứng Nhận:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(company.licenses || []).map((lic, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{lic}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveLicense(idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                  {!isReadOnly && (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        value={newLicenseTag} 
                        onChange={(e) => setNewLicenseTag(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLicense(newLicenseTag); setNewLicenseTag(''); } }}
                        placeholder="+ Giấy phép..." 
                        className="px-2 py-0.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden w-28"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Affiliations list */}
              {(company.affiliations || []).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổ Chức & Hiệp Hội Thành Viên:</span>
                  <div className="space-y-2">
                    {(company.affiliations || []).map((af, idx) => (
                      <div key={af.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs relative group">
                        {isReadOnly ? (
                          <div>
                            <div className="font-black text-slate-900">{af.name}</div>
                            <div className="text-[10px] text-slate-500">{af.type} • {af.codeOrYear}</div>
                          </div>
                        ) : (
                          <div className="space-y-1 flex-1 pr-6">
                            <input type="text" value={af.name} onChange={(e) => handleUpdateAffiliation(idx, 'name', e.target.value)} className="w-full font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Tên tổ chức" />
                            <div className="grid grid-cols-2 gap-1">
                              <input type="text" value={af.type || ''} onChange={(e) => handleUpdateAffiliation(idx, 'type', e.target.value)} className="text-[10px] text-slate-600 bg-white border border-slate-200 rounded px-1" placeholder="Loại hình" />
                              <input type="text" value={af.codeOrYear || ''} onChange={(e) => handleUpdateAffiliation(idx, 'codeOrYear', e.target.value)} className="text-[10px] text-slate-600 bg-white border border-slate-200 rounded px-1" placeholder="Mã hội viên" />
                            </div>
                          </div>
                        )}
                        {!isReadOnly && (
                          <button type="button" onClick={() => handleRemoveAffiliation(idx)} className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Block 7: Regional Branches & Hubs */}
          {visibleSections.myCompany.branches !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Mạng Lưới Chi Nhánh & Trụ Sở</span>
                </div>
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={handleAddBranch} 
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm điểm
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(company.branches || []).map((br, idx) => (
                  <div key={br.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs relative group">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveBranch(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900 text-xs">{br.city}</span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">{br.type}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{br.address}</p>
                        {br.phone && <p className="text-[10px] text-slate-400 font-mono">Hotline: {br.phone}</p>}
                      </div>
                    ) : (
                      <div className="space-y-1.5 pr-6">
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={br.city} onChange={(e) => handleUpdateBranch(idx, 'city', e.target.value)} className="font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Thành phố" />
                          <select 
                            value={br.type} 
                            onChange={(e) => handleUpdateBranch(idx, 'type', e.target.value as BranchOfficeItem['type'])}
                            className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-1.5 py-0.5"
                          >
                            <option value="Trụ sở chính">Trụ sở chính</option>
                            <option value="Chi nhánh">Chi nhánh</option>
                            <option value="Văn phòng cảng/kho">Văn phòng cảng/kho</option>
                          </select>
                        </div>
                        <input type="text" value={br.address} onChange={(e) => handleUpdateBranch(idx, 'address', e.target.value)} className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Địa chỉ chi tiết" />
                        <input type="text" value={br.phone || ''} onChange={(e) => handleUpdateBranch(idx, 'phone', e.target.value)} className="w-full text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Điện thoại" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Block 5 & 8: Partners & Case Studies */}
          {visibleSections.myCompany.partners !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Mạng Lưới Đối Tác Hãng Vận Chuyển & Khách Hàng</span>
              </div>

              {/* Shipping lines / Airline partners */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Hãng Tàu & Hãng Hàng Không Đối Tác:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(company.carrierPartners || []).map((cp, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1">
                      <span>{cp}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('carrierPartners', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                  {!isReadOnly && (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        value={newCarrierTag} 
                        onChange={(e) => setNewCarrierTag(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('carrierPartners', newCarrierTag); setNewCarrierTag(''); } }}
                        placeholder="+ Thêm hãng tàu..." 
                        className="px-2 py-0.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden w-28"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Client logos */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Khách Hàng Doanh Nghiệp Tiêu Biểu:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(company.clientLogos || []).map((cl, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1">
                      <span>{cl}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('clientLogos', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                  {!isReadOnly && (
                    <div className="flex items-center gap-1">
                      <input 
                        type="text" 
                        value={newClientTag} 
                        onChange={(e) => setNewClientTag(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('clientLogos', newClientTag); setNewClientTag(''); } }}
                        placeholder="+ Tên khách hàng..." 
                        className="px-2 py-0.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden w-28"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Block 8: Case Studies */}
          {visibleSections.myCompany.caseStudies !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Briefcase className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Dự Án Trọng Điểm Đã Thực Hiện</span>
                </div>
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={handleAddCaseStudy} 
                    className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm dự án
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(company.caseStudies || []).map((cs, idx) => (
                  <div key={cs.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 relative group hover:border-slate-300 transition-all">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveCaseStudy(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded">{cs.clientIndustry}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold text-slate-700">{cs.scale}</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">{cs.title}</h4>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cs.result}</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 pr-6">
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={cs.clientIndustry} onChange={(e) => handleUpdateCaseStudy(idx, 'clientIndustry', e.target.value)} className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ngành hàng" />
                          <input type="text" value={cs.scale} onChange={(e) => handleUpdateCaseStudy(idx, 'scale', e.target.value)} className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1" placeholder="Quy mô" />
                        </div>
                        <input type="text" value={cs.title} onChange={(e) => handleUpdateCaseStudy(idx, 'title', e.target.value)} className="w-full font-black text-xs text-slate-900 bg-white border border-slate-200 rounded px-2 py-1" placeholder="Tên dự án" />
                        <input type="text" value={cs.result} onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)} className="w-full text-xs text-emerald-800 bg-white border border-emerald-200 rounded px-2 py-1" placeholder="Kết quả đạt được" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
