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
  Users,
  Check,
  Truck,
  Warehouse,
  Briefcase,
  Compass,
  Target,
  HeartHandshake,
  Layers,
  Columns
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

export const ExecutivePillarTemplate: React.FC<CompanyTemplateProps> = ({
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
      title: 'Mốc mở rộng trọng điểm',
      description: 'Ghi nhận tăng trưởng quy mô hạ tầng logistics...'
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
      title: 'Chuẩn mực giá trị',
      description: 'Nguyên tắc cam kết chất lượng dịch vụ...'
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
      label: 'Chỉ số đo lường',
      value: '99.9%',
      subtext: 'Đúng hạn chuẩn xác'
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
      title: 'Mảng Dịch Vụ Chiến Lược',
      description: 'Giải pháp chuỗi cung ứng chuyên biệt theo ngành hàng...'
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
      city: 'Hub / Thành Phố Mới',
      address: 'Địa chỉ văn phòng / kho bãi',
      type: 'Chi nhánh',
      phone: '(028) 3822 9999',
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
      name: 'Tổ Chức Logistics Quốc Tế',
      type: 'Hiệp hội Vận Tải Toàn Cầu',
      codeOrYear: 'Thành viên'
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
      title: 'Hợp Đồng Cung Ứng Logistics Toàn Diện',
      clientIndustry: 'Ngành Hàng Trọng Điểm',
      scale: 'Quy mô hợp đồng',
      result: 'Chỉ số SLA hoàn thành 100%'
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
      {/* 1. PANORAMIC EXECUTIVE HEADER BANNER                      */}
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
                  <Columns className="w-3.5 h-3.5" /> Executive Pillar Structure
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
                  <span>"{company.companySlogan || 'Vững vàng năng lực - Vươn xa vị thế'}"</span>
                ) : (
                  <input type="text" value={company.companySlogan || ''} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white outline-hidden" placeholder="Slogan doanh nghiệp" />
                )}
              </div>
            </div>
          </div>

          {/* Quick links & contact */}
          <div className="bg-black/20 border border-white/20 rounded-2xl p-4 flex flex-wrap lg:flex-col gap-2 text-xs">
            {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</a>}
            {company.brochureUrl && <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-amber-400/30 text-amber-100 font-semibold flex items-center gap-1.5 border border-amber-300/30"><Download className="w-3.5 h-3.5" /> Hồ Sơ Năng Lực (PDF)</a>}
            {company.hotline && <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-300" /> {company.hotline}</span>}
            {company.email && <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-300" /> {company.email}</span>}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THE 3-COLUMN PANORAMIC CORE GRID (25% / 50% / 25%)      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================== */}
        {/* LEFT PILLAR (3 Cols = 25%): GOVERNANCE     */}
        {/* ========================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Block 6: Compliance & Licenses */}
          {visibleSections.myCompany.compliance !== false && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pháp Lý & Chuẩn Hóa</span>
                </div>
              </div>

              {/* Licenses */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Chứng nhận / Giấy phép:</span>
                <div className="space-y-1.5">
                  {(company.licenses || []).map((lic, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="text-[11px]">{lic}</span>
                      </div>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveLicense(idx)} className="text-slate-400 hover:text-rose-600 cursor-pointer">×</button>}
                    </div>
                  ))}
                  {!isReadOnly && (
                    <input 
                      type="text" 
                      value={newLicenseTag} 
                      onChange={(e) => setNewLicenseTag(e.target.value)} 
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLicense(newLicenseTag); setNewLicenseTag(''); } }}
                      placeholder="+ Thêm giấy phép..." 
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden"
                    />
                  )}
                </div>
              </div>

              {/* Affiliations */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Hiệp hội & Tổ chức:</span>
                  {!isReadOnly && (
                    <button type="button" onClick={handleAddAffiliation} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer">
                      + Thêm
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {(company.affiliations || []).map((af, idx) => (
                    <div key={af.id || idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs relative group">
                      {!isReadOnly && (
                        <button type="button" onClick={() => handleRemoveAffiliation(idx)} className="absolute top-1.5 right-1.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      {isReadOnly ? (
                        <>
                          <div className="font-bold text-slate-900 text-[11px]">{af.name}</div>
                          <div className="text-[10px] text-slate-500">{af.type}</div>
                        </>
                      ) : (
                        <div className="space-y-1 pr-4">
                          <input type="text" value={af.name} onChange={(e) => handleUpdateAffiliation(idx, 'name', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-1" placeholder="Tên tổ chức" />
                          <input type="text" value={af.type || ''} onChange={(e) => handleUpdateAffiliation(idx, 'type', e.target.value)} className="w-full text-[10px] bg-white border border-slate-200 rounded px-1" placeholder="Loại hình" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Block 7: Branches & Network */}
          {visibleSections.myCompany.branches !== false && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-slate-900">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Mạng Lưới Chi Nhánh</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddBranch} className="text-[10px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(company.branches || []).map((br, idx) => (
                  <div key={br.id || idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs relative group">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemoveBranch(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 text-xs">{br.city}</strong>
                          <span className="text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold">{br.type}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">{br.address}</p>
                      </div>
                    ) : (
                      <div className="space-y-1 pr-4">
                        <div className="flex gap-1">
                          <input type="text" value={br.city} onChange={(e) => handleUpdateBranch(idx, 'city', e.target.value)} className="w-1/2 font-bold text-xs bg-white border border-slate-200 rounded px-1" placeholder="Thành phố" />
                          <select value={br.type} onChange={(e) => handleUpdateBranch(idx, 'type', e.target.value as BranchOfficeItem['type'])} className="w-1/2 text-[10px] bg-white border border-slate-200 rounded px-1">
                            <option value="Trụ sở chính">Trụ sở chính</option>
                            <option value="Chi nhánh">Chi nhánh</option>
                            <option value="Văn phòng cảng/kho">Văn phòng cảng/kho</option>
                          </select>
                        </div>
                        <input type="text" value={br.address} onChange={(e) => handleUpdateBranch(idx, 'address', e.target.value)} className="w-full text-[10px] bg-white border border-slate-200 rounded px-1" placeholder="Địa chỉ" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ========================================== */}
        {/* CENTER PILLAR (6 Cols = 50%): NARRATIVE    */}
        {/* ========================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Block 1: About Story */}
          {visibleSections.myCompany.about !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4" style={{ color: theme.primary }} />
                <span>Câu Chuyện Doanh Nghiệp & Sứ Mệnh</span>
              </div>
              {isReadOnly ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {company.companyBio || 'Chưa cập nhật nội dung giới thiệu.'}
                </p>
              ) : (
                <textarea rows={4} value={company.companyBio || ''} onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl outline-hidden" placeholder="Giới thiệu về doanh nghiệp..." />
              )}
            </div>
          )}

          {/* Block 2: Vision, Mission, Core Values */}
          {visibleSections.myCompany.visionMission !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Compass className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Tầm Nhìn, Sứ Mệnh & Giá Trị</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddCoreValue} className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                    + Thêm giá trị
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1">
                  <span className="text-[10px] font-black text-amber-900 uppercase flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-amber-600" /> Tầm Nhìn
                  </span>
                  {isReadOnly ? (
                    <p className="text-xs text-slate-700 leading-relaxed">{company.vision || 'Chưa có thông tin.'}</p>
                  ) : (
                    <textarea rows={2} value={company.vision || ''} onChange={(e) => onChangeCompany({ ...company, vision: e.target.value })} className="w-full p-1.5 text-xs text-slate-700 bg-white border border-amber-200 rounded-lg" />
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                  <span className="text-[10px] font-black text-emerald-900 uppercase flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" /> Sứ Mệnh
                  </span>
                  {isReadOnly ? (
                    <p className="text-xs text-slate-700 leading-relaxed">{company.mission || 'Chưa có thông tin.'}</p>
                  ) : (
                    <textarea rows={2} value={company.mission || ''} onChange={(e) => onChangeCompany({ ...company, mission: e.target.value })} className="w-full p-1.5 text-xs text-slate-700 bg-white border border-emerald-200 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Core Values list */}
              {(company.coreValues || []).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(company.coreValues || []).map((cv, idx) => (
                    <div key={cv.id || idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs relative group">
                      {!isReadOnly && (
                        <button type="button" onClick={() => handleRemoveCoreValue(idx)} className="absolute top-1.5 right-1.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      {isReadOnly ? (
                        <>
                          <div className="font-bold text-slate-900 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> {cv.title}</div>
                          <p className="text-[10px] text-slate-600">{cv.description}</p>
                        </>
                      ) : (
                        <div className="space-y-1 pr-4">
                          <input type="text" value={cv.title} onChange={(e) => handleUpdateCoreValue(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-1" />
                          <textarea rows={1} value={cv.description || ''} onChange={(e) => handleUpdateCoreValue(idx, 'description', e.target.value)} className="w-full text-[10px] bg-white border border-slate-200 rounded px-1" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Block 4: Service Pillars */}
          {visibleSections.myCompany.ecosystem !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Layers className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Trụ Cột Dịch Vụ Cốt Lõi</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddPillar} className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                    + Thêm trụ cột
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
                          <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-black flex items-center justify-center">{idx + 1}</span>
                          {sp.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">{sp.description}</p>
                      </>
                    ) : (
                      <div className="space-y-1.5 pr-6">
                        <input type="text" value={sp.title} onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-2 py-1" placeholder="Tên dịch vụ" />
                        <textarea rows={2} value={sp.description || ''} onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)} className="w-full text-xs bg-white border border-slate-200 rounded p-1.5" placeholder="Mô tả" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Block 8: Major Case Studies */}
          {visibleSections.myCompany.caseStudies !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Briefcase className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Hồ Sơ Dự Án Thực Chiến</span>
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
                        <h4 className="font-black text-slate-900 text-xs">{cs.title}</h4>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cs.result}</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5 pr-6">
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={cs.clientIndustry} onChange={(e) => handleUpdateCaseStudy(idx, 'clientIndustry', e.target.value)} className="text-xs font-bold bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Ngành hàng" />
                          <input type="text" value={cs.scale} onChange={(e) => handleUpdateCaseStudy(idx, 'scale', e.target.value)} className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Quy mô" />
                        </div>
                        <input type="text" value={cs.title} onChange={(e) => handleUpdateCaseStudy(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5" placeholder="Tên dự án" />
                        <input type="text" value={cs.result} onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)} className="w-full text-xs text-emerald-800 bg-white border border-emerald-200 rounded px-1.5 py-0.5" placeholder="Kết quả" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ========================================== */}
        {/* RIGHT PILLAR (3 Cols = 25%): CAPACITY      */}
        {/* ========================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Block 3: Operational Stats & Capacity */}
          {visibleSections.myCompany.highlights !== false && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-slate-900">
                  <TrendingUp className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Quy Mô Năng Lực</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Nhân Sự</span>
                  {isReadOnly ? (
                    <div className="text-base font-black text-slate-900">{company.employeeCount || '---'}</div>
                  ) : (
                    <input type="text" value={company.employeeCount || ''} onChange={(e) => onChangeCompany({ ...company, employeeCount: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1.5 py-0.5 mt-1" />
                  )}
                  <span className="text-[10px] text-slate-500">{company.employeeSubtext || 'CB-CNV'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Đội Xe Vận Tải</span>
                  {isReadOnly ? (
                    <div className="text-base font-black text-slate-900">{company.truckFleetCount || '---'}</div>
                  ) : (
                    <input type="text" value={company.truckFleetCount || ''} onChange={(e) => onChangeCompany({ ...company, truckFleetCount: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1.5 py-0.5 mt-1" />
                  )}
                  <span className="text-[10px] text-slate-500">{company.fleetSubtext || 'Phương tiện'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Kho Bãi</span>
                  {isReadOnly ? (
                    <div className="text-base font-black text-slate-900">{company.warehouseArea || '---'}</div>
                  ) : (
                    <input type="text" value={company.warehouseArea || ''} onChange={(e) => onChangeCompany({ ...company, warehouseArea: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1.5 py-0.5 mt-1" />
                  )}
                  <span className="text-[10px] text-slate-500">{company.warehouseSubtext || 'Tiêu chuẩn'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Sản Lượng</span>
                  {isReadOnly ? (
                    <div className="text-base font-black text-slate-900">{company.annualVolume || '---'}</div>
                  ) : (
                    <input type="text" value={company.annualVolume || ''} onChange={(e) => onChangeCompany({ ...company, annualVolume: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1.5 py-0.5 mt-1" />
                  )}
                  <span className="text-[10px] text-slate-500">{company.volumeSubtext || 'Cam kết SLA'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Block 4: Target Industries */}
          {visibleSections.myCompany.ecosystem !== false && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider block">Ngành Hàng Mục Tiêu:</span>
              <div className="flex flex-wrap gap-1.5">
                {(company.targetIndustries || []).map((ind, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1 border border-slate-200">
                    <span>{ind}</span>
                    {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('targetIndustries', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                  </span>
                ))}
                {!isReadOnly && (
                  <input 
                    type="text" 
                    value={newIndustryTag} 
                    onChange={(e) => setNewIndustryTag(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('targetIndustries', newIndustryTag); setNewIndustryTag(''); } }}
                    placeholder="+ Thêm ngành..." 
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden"
                  />
                )}
              </div>
            </div>
          )}

          {/* Block 5: Carrier & Client Partners */}
          {visibleSections.myCompany.partners !== false && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Hãng Tàu & Khách Hàng</span>
              </div>

              {/* Carrier partners */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Hãng tàu / Hàng không:</span>
                <div className="flex flex-wrap gap-1">
                  {(company.carrierPartners || []).map((cp, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold flex items-center gap-1">
                      <span>{cp}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('carrierPartners', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                  {!isReadOnly && (
                    <input 
                      type="text" 
                      value={newCarrierTag} 
                      onChange={(e) => setNewCarrierTag(e.target.value)} 
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('carrierPartners', newCarrierTag); setNewCarrierTag(''); } }}
                      placeholder="+ Hãng tàu..." 
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden"
                    />
                  )}
                </div>
              </div>

              {/* Client logos */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Khách hàng tiêu biểu:</span>
                <div className="flex flex-wrap gap-1">
                  {(company.clientLogos || []).map((cl, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold flex items-center gap-1">
                      <span>{cl}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('clientLogos', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                  {!isReadOnly && (
                    <input 
                      type="text" 
                      value={newClientTag} 
                      onChange={(e) => setNewClientTag(e.target.value)} 
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('clientLogos', newClientTag); setNewClientTag(''); } }}
                      placeholder="+ Khách hàng..." 
                      className="w-full px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden"
                    />
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
