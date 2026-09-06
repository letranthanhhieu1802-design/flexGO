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
  Server, 
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
  Upload,
  Layers,
  Check,
  Users,
  Briefcase,
  LayoutGrid
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

export const CompanyBentoTemplate: React.FC<CompanyTemplateProps> = ({
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
      title: 'Mốc phát triển mới',
      description: 'Mô tả tóm tắt sự kiện mở rộng...'
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
      description: 'Mô tả chuẩn mực hành vi...'
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
      city: 'Hub / Trung Tâm Mới',
      address: 'Địa chỉ kho bãi / văn phòng',
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
      name: 'Tổ Chức / Hiệp Hội',
      type: 'Hiệp hội Logistics Quốc Tế',
      codeOrYear: 'Hội viên'
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
      title: 'Tên Trụ Cột Mới',
      description: 'Mô tả giải pháp chuỗi cung ứng...'
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
      title: 'Dự Án Trọng Điểm Mới',
      clientIndustry: 'Ngành Hàng',
      scale: 'Quy mô',
      result: 'KPI hoàn thành...'
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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* 1. BENTO ROW 1: HERO (8 cols) + CAPACITY HUD (4 cols)     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main Identity Bento Box (8 cols) */}
        <div 
          className="lg:col-span-8 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-4">
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <div 
                onClick={() => !isReadOnly && logoInputRef.current?.click()}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 border-white/40 shadow-inner flex items-center justify-center shrink-0 text-white overflow-hidden relative group ${
                  !isReadOnly ? 'cursor-pointer hover:border-white/80 transition-all' : ''
                }`}
              >
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-1.5 bg-white/95 rounded-2xl" />
                ) : (
                  <Building2 className="w-9 h-9 text-white/90" />
                )}
                {!isReadOnly && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                    <Camera className="w-5 h-5 mb-0.5 text-white" />
                    <span className="text-[9px] font-bold">{company.logoUrl ? 'Đổi' : 'Tải'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-black uppercase rounded-full tracking-wider border border-white/30 flex items-center gap-1">
                    <LayoutGrid className="w-3 h-3" /> Modern Bento Layout
                  </span>
                  <span className="text-xs text-white/80 font-mono">MST: {company.taxId || '---'} • Năm: {company.yearEstablished || '---'}</span>
                </div>
                {isReadOnly ? (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{company.companyName}</h1>
                    <p className="text-xs sm:text-sm text-white/80 font-semibold">{company.companyNameEn}</p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-xl sm:text-2xl font-black bg-white/10 px-2.5 py-1 rounded-lg border border-white/30 text-white outline-hidden" placeholder="Tên công ty" />
                    <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-xs bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white/90 outline-hidden" placeholder="Trade Name" />
                  </div>
                )}
              </div>
            </div>

            {/* Slogan */}
            <div className="flex items-center gap-2 text-amber-200 text-xs sm:text-sm italic">
              <Sparkles className="w-4 h-4 shrink-0" />
              {isReadOnly ? (
                <span>"{company.companySlogan || 'Đồng hành phát triển - Giải pháp tối ưu'}"</span>
              ) : (
                <input type="text" value={company.companySlogan || ''} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full bg-white/10 px-2 py-1 rounded text-xs text-white border border-white/20 outline-hidden" placeholder="Slogan" />
              )}
            </div>

            {/* Links */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1.5"><Globe className="w-3 h-3" /> Website</a>}
              {company.brochureUrl && <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-amber-400/30 text-amber-100 font-semibold flex items-center gap-1.5"><Download className="w-3 h-3" /> PDF Profile</a>}
              {company.hotline && <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5"><Phone className="w-3 h-3" /> {company.hotline}</span>}
              {company.email && <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5"><Mail className="w-3 h-3" /> {company.email}</span>}
            </div>
          </div>
        </div>

        {/* Highlight Metrics Bento Box (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl flex flex-col justify-between border border-slate-700">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Thước Đo Cốt Lõi (Fast SLA)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] uppercase font-bold text-white/60 block">Nhân Sự</span>
                {isReadOnly ? (
                  <div className="text-lg font-black text-white">{company.employeeCount || '---'}</div>
                ) : (
                  <input type="text" value={company.employeeCount || ''} onChange={(e) => onChangeCompany({ ...company, employeeCount: e.target.value })} className="w-full text-xs font-black bg-white/10 px-1.5 py-0.5 rounded text-white outline-hidden mt-0.5" />
                )}
                <span className="text-[9px] text-emerald-400 font-semibold">{company.employeeSubtext || 'CB-CNV'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] uppercase font-bold text-white/60 block">Đội Xe</span>
                {isReadOnly ? (
                  <div className="text-lg font-black text-white">{company.truckFleetCount || '---'}</div>
                ) : (
                  <input type="text" value={company.truckFleetCount || ''} onChange={(e) => onChangeCompany({ ...company, truckFleetCount: e.target.value })} className="w-full text-xs font-black bg-white/10 px-1.5 py-0.5 rounded text-white outline-hidden mt-0.5" />
                )}
                <span className="text-[9px] text-amber-300 font-semibold">{company.fleetSubtext || 'Đầu kéo'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] uppercase font-bold text-white/60 block">Kho Bãi</span>
                {isReadOnly ? (
                  <div className="text-lg font-black text-white">{company.warehouseArea || '---'}</div>
                ) : (
                  <input type="text" value={company.warehouseArea || ''} onChange={(e) => onChangeCompany({ ...company, warehouseArea: e.target.value })} className="w-full text-xs font-black bg-white/10 px-1.5 py-0.5 rounded text-white outline-hidden mt-0.5" />
                )}
                <span className="text-[9px] text-blue-300 font-semibold">{company.warehouseSubtext || 'Tiêu chuẩn'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] uppercase font-bold text-white/60 block">Sản Lượng</span>
                {isReadOnly ? (
                  <div className="text-lg font-black text-white">{company.annualVolume || '---'}</div>
                ) : (
                  <input type="text" value={company.annualVolume || ''} onChange={(e) => onChangeCompany({ ...company, annualVolume: e.target.value })} className="w-full text-xs font-black bg-white/10 px-1.5 py-0.5 rounded text-white outline-hidden mt-0.5" />
                )}
                <span className="text-[9px] text-teal-300 font-semibold">{company.volumeSubtext || 'Thường niên'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. BENTO ROW 2: VISION & MISSION (6 cols each)            */}
      {/* ========================================================= */}
      {visibleSections.myCompany.visionMission !== false && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-black text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 text-blue-600" /> Tầm Nhìn Chiến Lược (Vision)
            </div>
            {isReadOnly ? (
              <p className="text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">{company.vision || 'Chưa cập nhật tầm nhìn.'}</p>
            ) : (
              <textarea rows={3} value={company.vision || ''} onChange={(e) => onChangeCompany({ ...company, vision: e.target.value })} className="w-full p-2.5 text-xs text-blue-950 bg-white border border-blue-200 rounded-xl outline-hidden" />
            )}
          </div>
          <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase tracking-wider">
              <Target className="w-4 h-4 text-emerald-600" /> Sứ Mệnh Doanh Nghiệp (Mission)
            </div>
            {isReadOnly ? (
              <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">{company.mission || 'Chưa cập nhật sứ mệnh.'}</p>
            ) : (
              <textarea rows={3} value={company.mission || ''} onChange={(e) => onChangeCompany({ ...company, mission: e.target.value })} className="w-full p-2.5 text-xs text-emerald-950 bg-white border border-emerald-200 rounded-xl outline-hidden" />
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. BENTO ROW 3: CORE SERVICES INTERACTIVE CARDS           */}
      {/* ========================================================= */}
      {visibleSections.myCompany.ecosystem !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Hệ Sinh Thái Dịch Vụ Cung Cấp
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddPillar} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Thêm dịch vụ
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {(company.servicePillars || []).map((sp, idx) => (
              <div key={sp.id || idx} className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-2xs space-y-2 relative group hover:border-emerald-300 transition-all flex flex-col justify-between">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemovePillar(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {isReadOnly ? (
                  <>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md self-start">#{idx + 1}</span>
                    <h4 className="font-black text-slate-900 text-sm">{sp.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">{sp.description}</p>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">#{idx + 1}</span>
                    <input type="text" value={sp.title} onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)} className="w-full font-bold text-xs text-slate-900 bg-transparent border-b border-dashed border-slate-300 outline-hidden" placeholder="Tên dịch vụ" />
                    <textarea rows={3} value={sp.description} onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)} className="w-full text-[11px] text-slate-600 bg-transparent border-b border-dashed border-slate-300 outline-hidden" placeholder="Mô tả" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Target Industries Tag Cloud */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Ngành hàng:</span>
            {(company.targetIndustries || []).map((ind, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1 border border-slate-200">
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
                className="px-2 py-0.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden w-28"
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. BENTO ROW 4: STORY (7 cols) + TECH & HUBS (5 cols)     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Story Bio & Timeline (7 cols) */}
        {visibleSections.myCompany.about !== false && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> Giới Thiệu & Dấu Mốc Lịch Sử
              </span>
              {!isReadOnly && (
                <button type="button" onClick={handleAddMilestone} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Thêm mốc
                </button>
              )}
            </div>

            {isReadOnly ? (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200 whitespace-pre-line">{company.companyBio}</p>
            ) : (
              <textarea rows={4} value={company.companyBio} onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl outline-hidden" placeholder="Giới thiệu câu chuyện công ty..." />
            )}

            {/* Timeline cards */}
            <div className="space-y-2 pt-2">
              {(company.milestones || []).map((ms, idx) => (
                <div key={ms.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 relative group">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-black text-xs rounded shrink-0">{ms.year}</span>
                  {isReadOnly ? (
                    <div className="text-xs flex-1">
                      <strong className="text-slate-900">{ms.title}:</strong> <span className="text-slate-600">{ms.description}</span>
                    </div>
                  ) : (
                    <div className="space-y-1 flex-1 pr-6">
                      <input type="text" value={ms.title} onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)} className="w-full font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-0.5 outline-hidden" />
                      <textarea rows={1} value={ms.description || ''} onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)} className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5 outline-hidden" />
                    </div>
                  )}
                  {!isReadOnly && (
                    <button type="button" onClick={() => handleRemoveMilestone(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack, Branches & Compliance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Compliance & Licenses */}
          {visibleSections.myCompany.compliance !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Giấy Phép & Tuân Thủ
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(company.licenses || []).map((lic, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{lic}</span>
                    {!isReadOnly && <button type="button" onClick={() => handleRemoveLicense(idx)} className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer">×</button>}
                  </span>
                ))}
                {!isReadOnly && (
                  <input 
                    type="text" 
                    value={newLicenseTag} 
                    onChange={(e) => setNewLicenseTag(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLicense(newLicenseTag); setNewLicenseTag(''); } }}
                    placeholder="+ Thêm giấy phép..." 
                    className="px-2 py-0.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden w-28"
                  />
                )}
              </div>
            </div>
          )}

          {/* Branches Bento Mini */}
          {visibleSections.myCompany.branches !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" /> Mạng Lưới Điểm Hubs
                </span>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddBranch} className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(company.branches || []).map((br, idx) => (
                  <div key={br.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{br.city}</span>
                      <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-semibold">{br.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{br.address}</p>
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

          {/* Partners & Carriers Bento */}
          {visibleSections.myCompany.partners !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" /> Hãng Tàu & Khách Hàng
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(company.carrierPartners || []).map((cp, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1">
                    <span>{cp}</span>
                    {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('carrierPartners', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                  </span>
                ))}
                {(company.clientLogos || []).map((cl, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1">
                    <span>{cl}</span>
                    {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('clientLogos', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. BENTO ROW 5: CASE STUDIES & SOCIAL PROOF               */}
      {/* ========================================================= */}
      {visibleSections.myCompany.caseStudies !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-teal-600" /> Case Studies Thực Chiến (SLA Verified)
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddCaseStudy} className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Thêm dự án
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(company.caseStudies || []).map((cs, idx) => (
              <div key={cs.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 relative group hover:border-teal-300 transition-all">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveCaseStudy(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
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
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
