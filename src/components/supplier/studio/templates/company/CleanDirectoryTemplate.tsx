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
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Mail, 
  Phone, 
  Download, 
  TrendingUp, 
  Compass, 
  Target, 
  HeartHandshake, 
  Calendar, 
  Camera, 
  Layers, 
  Check, 
  Users, 
  Briefcase,
  ListOrdered,
  ChevronRight
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

export const CleanDirectoryTemplate: React.FC<CompanyTemplateProps> = ({
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

  // Handlers
  const handleAddMilestone = () => {
    const newMs: CompanyMilestoneItem = {
      id: `ms-${Date.now()}`,
      year: `${new Date().getFullYear()}`,
      title: 'Mốc hồ sơ mới',
      description: 'Mô tả diễn tiến phát triển...'
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
      title: 'Nguyên tắc vận hành',
      description: 'Cam kết chất lượng thực thi...'
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
      label: 'Chỉ số hồ sơ',
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
      title: 'Hạng Mục Dịch Vụ Mới',
      description: 'Mô tả giải pháp và tiêu chuẩn kỹ thuật...'
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
      city: 'Điểm Chi Nhánh / Hub',
      address: 'Địa chỉ chi tiết văn phòng / kho',
      type: 'Chi nhánh',
      phone: '(028) 3822 6666',
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
      name: 'Tổ Chức / Hiệp Hội Thành Viên',
      type: 'Tổ chức thương mại',
      codeOrYear: 'Chính thức'
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
      title: 'Hồ Sơ Dự Án Tiêu Biểu',
      clientIndustry: 'Ngành Hàng Khách Hàng',
      scale: 'Quy mô',
      result: 'Chỉ số SLA hoàn thành'
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

  const handleAddTagItem = (field: 'targetIndustries' | 'carrierPartners' | 'clientLogos', val: string) => {
    if (!val.trim()) return;
    const current = (company[field] as string[]) || [];
    if (!current.includes(val.trim())) {
      onChangeCompany({ ...company, [field]: [...current, val.trim()] });
    }
  };

  const handleRemoveTagItem = (field: 'targetIndustries' | 'carrierPartners' | 'clientLogos', index: number) => {
    const current = [...((company[field] as string[]) || [])];
    current.splice(index, 1);
    onChangeCompany({ ...company, [field]: current });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* 1. DOSSIER DIRECTORY HEADER BANNER                        */}
      {/* ========================================================= */}
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition-all"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5 flex-1 min-w-0">
            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
            <div 
              onClick={() => !isReadOnly && logoInputRef.current?.click()}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 border-2 border-white/40 shadow-inner flex items-center justify-center shrink-0 text-white overflow-hidden relative group ${
                !isReadOnly ? 'cursor-pointer hover:border-white/80 transition-all' : ''
              }`}
              title={!isReadOnly ? 'Tải lên logo' : undefined}
            >
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-2 bg-white/95 rounded-2xl" />
              ) : (
                <Building2 className="w-10 h-10 text-white/90" />
              )}
              {!isReadOnly && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold">Logo</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 bg-white/20 text-white text-[10px] font-black uppercase rounded-full tracking-wider border border-white/30 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5" /> Dossier Index Directory
                </span>
                <span className="text-xs text-white/80 font-mono">MST: {company.taxId || '---'} • Năm: {company.yearEstablished || '---'}</span>
              </div>

              {isReadOnly ? (
                <>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">{company.companyName}</h1>
                  <p className="text-xs sm:text-sm text-white/80 font-semibold">{company.companyNameEn}</p>
                </>
              ) : (
                <div className="space-y-1">
                  <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-2xl sm:text-3xl font-black bg-white/10 px-3 py-1 rounded-xl border border-white/30 text-white outline-hidden" placeholder="Tên công ty" />
                  <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-xs sm:text-sm bg-white/10 px-3 py-1 rounded-lg border border-white/20 text-white/90 outline-hidden" placeholder="Trade name" />
                </div>
              )}

              {/* Slogan */}
              <div className="flex items-center gap-2 text-amber-200 text-xs sm:text-sm italic pt-1">
                <Sparkles className="w-4 h-4 shrink-0" />
                {isReadOnly ? (
                  <span>"{company.companySlogan || 'Minh bạch năng lực - Chuẩn mực thực thi'}"</span>
                ) : (
                  <input type="text" value={company.companySlogan || ''} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white outline-hidden" placeholder="Slogan doanh nghiệp" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/20 border border-white/20 rounded-2xl p-4 flex flex-wrap lg:flex-col gap-2 text-xs">
            {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</a>}
            {company.brochureUrl && <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-amber-400/30 text-amber-100 font-semibold flex items-center gap-1.5 border border-amber-300/30"><Download className="w-3.5 h-3.5" /> Hồ Sơ PDF</a>}
            {company.hotline && <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-300" /> {company.hotline}</span>}
            {company.email && <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-300" /> {company.email}</span>}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 25/75 SPLIT: INDEX MENU (Left) + DOSSIER PANELS (Right)*/}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: NUMBERED INDEX GUIDE (3 cols = 25%) */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
              Mục Lục Hồ Sơ (Index 01-08)
            </span>
            <nav className="space-y-1.5 text-xs font-bold text-slate-600">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-200">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">01</span>
                  <span>Tổng quan & Dấu mốc</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">02</span>
                  <span>Tầm nhìn & Giá trị</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">03</span>
                  <span>Quy mô & Năng lực</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">04</span>
                  <span>Hệ sinh thái dịch vụ</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">05</span>
                  <span>Hãng vận chuyển & Khách hàng</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">06</span>
                  <span>Pháp lý & Chứng nhận</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">07</span>
                  <span>Mạng lưới chi nhánh</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-black">08</span>
                  <span>Dự án thực chiến</span>
                </span>
              </div>
            </nav>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED DOSSIER PANELS (9 cols = 75%) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Panel 01: About & Milestones */}
          {visibleSections.myCompany.about !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                    01
                  </span>
                  <span className="font-black text-sm uppercase tracking-wider text-slate-900">Giới Thiệu Doanh Nghiệp & Dấu Mốc</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddMilestone} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    + Thêm mốc
                  </button>
                )}
              </div>

              {isReadOnly ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {company.companyBio || 'Chưa cập nhật thông tin giới thiệu.'}
                </p>
              ) : (
                <textarea rows={4} value={company.companyBio || ''} onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl outline-hidden" placeholder="Giới thiệu doanh nghiệp..." />
              )}

              <div className="space-y-2 pt-2">
                {(company.milestones || []).map((ms, idx) => (
                  <div key={ms.id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3 relative group">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs rounded shrink-0">{ms.year}</span>
                    {isReadOnly ? (
                      <div className="space-y-0.5 flex-1">
                        <strong className="text-slate-900">{ms.title}</strong>
                        <p className="text-[11px] text-slate-600">{ms.description}</p>
                      </div>
                    ) : (
                      <div className="space-y-1 flex-1 pr-6">
                        <input type="text" value={ms.title} onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                        <textarea rows={1} value={ms.description || ''} onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)} className="w-full text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                      </div>
                    )}
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveMilestone(idx)} className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panel 02: Vision, Mission & Core Values */}
          {visibleSections.myCompany.visionMission !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                    02
                  </span>
                  <span className="font-black text-sm uppercase tracking-wider text-slate-900">Tầm Nhìn, Sứ Mệnh & Giá Trị</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddCoreValue} className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                    + Thêm giá trị
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-indigo-900 flex items-center gap-1"><Target className="w-3.5 h-3.5 text-indigo-600" /> Tầm Nhìn</span>
                  {isReadOnly ? <p className="text-xs text-slate-700 leading-relaxed">{company.vision || '---'}</p> : <textarea rows={2} value={company.vision || ''} onChange={(e) => onChangeCompany({ ...company, vision: e.target.value })} className="w-full text-xs bg-white border border-slate-200 rounded p-1.5" />}
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-900 flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5 text-emerald-600" /> Sứ Mệnh</span>
                  {isReadOnly ? <p className="text-xs text-slate-700 leading-relaxed">{company.mission || '---'}</p> : <textarea rows={2} value={company.mission || ''} onChange={(e) => onChangeCompany({ ...company, mission: e.target.value })} className="w-full text-xs bg-white border border-slate-200 rounded p-1.5" />}
                </div>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {(company.coreValues || []).map((cv, idx) => (
                  <div key={cv.id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs relative group">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveCoreValue(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <>
                        <div className="font-bold text-slate-900 flex items-center gap-1"><Check className="w-3 h-3 text-emerald-600" /> {cv.title}</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{cv.description}</p>
                      </>
                    ) : (
                      <div className="space-y-1 pr-6">
                        <input type="text" value={cv.title} onChange={(e) => handleUpdateCoreValue(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                        <textarea rows={1} value={cv.description || ''} onChange={(e) => handleUpdateCoreValue(idx, 'description', e.target.value)} className="w-full text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panel 03: Scale & Operational Capacity */}
          {visibleSections.myCompany.highlights !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                    03
                  </span>
                  <span className="font-black text-sm uppercase tracking-wider text-slate-900">Quy Mô & Năng Lực Vận Tải</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddStat} className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                    + Thêm chỉ số
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nhân Sự</span>
                  {isReadOnly ? <div className="text-xl font-black text-slate-900">{company.employeeCount || '---'}</div> : <input type="text" value={company.employeeCount || ''} onChange={(e) => onChangeCompany({ ...company, employeeCount: e.target.value })} className="w-full text-sm font-black bg-white border border-slate-200 rounded px-1.5 py-0.5" />}
                  <span className="text-[10px] text-slate-500 mt-1 block">{company.employeeSubtext || 'Nhân viên'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Đội Xe</span>
                  {isReadOnly ? <div className="text-xl font-black text-slate-900">{company.truckFleetCount || '---'}</div> : <input type="text" value={company.truckFleetCount || ''} onChange={(e) => onChangeCompany({ ...company, truckFleetCount: e.target.value })} className="w-full text-sm font-black bg-white border border-slate-200 rounded px-1.5 py-0.5" />}
                  <span className="text-[10px] text-slate-500 mt-1 block">{company.fleetSubtext || 'Đầu kéo & tải'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Kho Bãi</span>
                  {isReadOnly ? <div className="text-xl font-black text-slate-900">{company.warehouseArea || '---'}</div> : <input type="text" value={company.warehouseArea || ''} onChange={(e) => onChangeCompany({ ...company, warehouseArea: e.target.value })} className="w-full text-sm font-black bg-white border border-slate-200 rounded px-1.5 py-0.5" />}
                  <span className="text-[10px] text-slate-500 mt-1 block">{company.warehouseSubtext || 'Tiêu chuẩn'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Sản Lượng</span>
                  {isReadOnly ? <div className="text-xl font-black text-slate-900">{company.annualVolume || '---'}</div> : <input type="text" value={company.annualVolume || ''} onChange={(e) => onChangeCompany({ ...company, annualVolume: e.target.value })} className="w-full text-sm font-black bg-white border border-slate-200 rounded px-1.5 py-0.5" />}
                  <span className="text-[10px] text-slate-500 mt-1 block">{company.volumeSubtext || 'Hàng năm'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Panel 04: Service Ecosystem */}
          {visibleSections.myCompany.ecosystem !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                    04
                  </span>
                  <span className="font-black text-sm uppercase tracking-wider text-slate-900">Hệ Sinh Thái Dịch Vụ Cung Cấp</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddPillar} className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                    + Thêm dịch vụ
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(company.servicePillars || []).map((sp, idx) => (
                  <div key={sp.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs relative group">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemovePillar(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <>
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <span className="font-mono text-slate-400">0{idx + 1}.</span> {sp.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-6">{sp.description}</p>
                      </>
                    ) : (
                      <div className="space-y-1.5 pr-6">
                        <input type="text" value={sp.title} onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-2 py-1" />
                        <textarea rows={2} value={sp.description || ''} onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)} className="w-full text-xs bg-white border border-slate-200 rounded p-1.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Target industries */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Ngành hàng:</span>
                {(company.targetIndustries || []).map((ind, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1 border border-slate-200">
                    <span>{ind}</span>
                    {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('targetIndustries', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Panel 05: Carrier Partners & Clients */}
          {visibleSections.myCompany.partners !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                  05
                </span>
                <span className="font-black text-sm uppercase tracking-wider text-slate-900">Mạng Lưới Đối Tác & Khách Hàng</span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Hãng Tàu & Hàng Không:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(company.carrierPartners || []).map((cp, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1">
                        <span>{cp}</span>
                        {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('carrierPartners', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Khách Hàng Doanh Nghiệp:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(company.clientLogos || []).map((cl, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1">
                        <span>{cl}</span>
                        {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('clientLogos', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panel 06: Compliance & Certifications */}
          {visibleSections.myCompany.compliance !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                  06
                </span>
                <span className="font-black text-sm uppercase tracking-wider text-slate-900">Pháp Lý & Chứng Nhận Quốc Tế</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(company.licenses || []).map((lic, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{lic}</span>
                    {!isReadOnly && <button type="button" onClick={() => handleRemoveLicense(idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                  </span>
                ))}
                {!isReadOnly && (
                  <input 
                    type="text" 
                    value={newLicenseTag} 
                    onChange={(e) => setNewLicenseTag(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLicense(newLicenseTag); setNewLicenseTag(''); } }}
                    placeholder="+ Thêm giấy phép..." 
                    className="px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden"
                  />
                )}
              </div>
            </div>
          )}

          {/* Panel 07: Branches & Hubs */}
          {visibleSections.myCompany.branches !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                    07
                  </span>
                  <span className="font-black text-sm uppercase tracking-wider text-slate-900">Mạng Lưới Chi Nhánh & Văn Phòng</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddBranch} className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(company.branches || []).map((br, idx) => (
                  <div key={br.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs relative group">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{br.city}</strong>
                      <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold">{br.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{br.address}</p>
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveBranch(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panel 08: Case Studies */}
          {visibleSections.myCompany.caseStudies !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl font-mono font-black text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                    08
                  </span>
                  <span className="font-black text-sm uppercase tracking-wider text-slate-900">Dự Án Vận Tải Thực Chiến</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddCaseStudy} className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                    + Thêm dự án
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(company.caseStudies || []).map((cs, idx) => (
                  <div key={cs.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 relative group">
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
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cs.result}</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5 pr-6">
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={cs.clientIndustry} onChange={(e) => handleUpdateCaseStudy(idx, 'clientIndustry', e.target.value)} className="text-xs font-bold bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                          <input type="text" value={cs.scale} onChange={(e) => handleUpdateCaseStudy(idx, 'scale', e.target.value)} className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                        </div>
                        <input type="text" value={cs.title} onChange={(e) => handleUpdateCaseStudy(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                        <input type="text" value={cs.result} onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)} className="w-full text-xs text-emerald-800 bg-white border border-emerald-200 rounded px-1.5 py-0.5" />
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
