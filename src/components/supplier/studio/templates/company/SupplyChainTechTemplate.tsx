import React, { useRef, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Activity, 
  Globe, 
  MapPin, 
  Award, 
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
  Zap,
  Terminal,
  Database,
  Layers,
  Code,
  Check,
  Briefcase,
  Users,
  Compass,
  Target,
  FileText
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

export const SupplyChainTechTemplate: React.FC<CompanyTemplateProps> = ({
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
  const [newSoftware, setNewSoftware] = useState('');
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
      title: 'Nâng Cấp Hệ Thống / Mốc Công Nghệ',
      description: 'Triển khai hạ tầng số hóa chuỗi cung ứng...'
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
      title: 'Tiêu chuẩn công nghệ',
      description: 'Chính xác - Minh bạch dữ liệu thời gian thực...'
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
      label: 'Chỉ số SLA / API',
      value: '99.9%',
      subtext: 'Uptime vận hành'
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
      title: 'Module Giải Pháp Chuỗi Cung Ứng Số',
      description: 'Tích hợp EDI/API, điều phối đa phương thức và cảnh báo lộ trình tự động...'
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
      city: 'Hub / Trung Tâm Điều Hành',
      address: 'Địa chỉ kho bãi / trung tâm điều độ',
      type: 'Chi nhánh',
      phone: '(028) 3822 5555',
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
      name: 'Tổ Chức Logistics Công Nghệ',
      type: 'Liên minh Chuỗi Cung Ứng Số',
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

  const handleAddCaseStudy = () => {
    const newCs: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      title: 'Triển Khai Chuỗi Cung Ứng Tự Động Hóa',
      clientIndustry: 'Ngành Công Nghệ / Bán Lẻ',
      scale: 'Quy mô phân phối toàn quốc',
      result: 'Tiết giảm 22% lead time, SLA đạt 99.8%'
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
      {/* 1. CONTROL TOWER HEADER HUD BANNER                        */}
      {/* ========================================================= */}
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden transition-all border border-cyan-500/30"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-6 bottom-4 opacity-10 pointer-events-none">
          <Terminal className="w-56 h-56 text-cyan-300" />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Identity & Logo */}
            <div className="flex items-start sm:items-center gap-4">
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <div 
                onClick={() => !isReadOnly && logoInputRef.current?.click()}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/40 border-2 border-cyan-400/50 shadow-inner flex items-center justify-center shrink-0 text-white overflow-hidden relative group backdrop-blur-md ${
                  !isReadOnly ? 'cursor-pointer hover:border-cyan-300 transition-all' : ''
                }`}
                title={!isReadOnly ? 'Tải lên logo' : undefined}
              >
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-2 bg-white/95 rounded-2xl" />
                ) : (
                  <Cpu className="w-10 h-10 text-cyan-300" />
                )}
                {!isReadOnly && (
                  <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                    <Camera className="w-5 h-5 mb-0.5 text-cyan-300" />
                    <span className="text-[9px] font-bold">Logo</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-200 text-[10px] font-black uppercase rounded-full tracking-wider border border-cyan-400/40 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-300" /> Control Tower Dashboard
                  </span>
                  <span className="text-xs text-white/80 font-mono">MST: <strong>{company.taxId || '---'}</strong> • Khởi lập: <strong>{company.yearEstablished || '---'}</strong></span>
                </div>

                {isReadOnly ? (
                  <>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">{company.companyName}</h1>
                    <p className="text-xs sm:text-sm text-cyan-100/90 font-medium">{company.companyNameEn}</p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-2xl sm:text-3xl font-black bg-black/30 px-3 py-1 rounded-xl border border-white/20 text-white outline-hidden" placeholder="Tên công ty" />
                    <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-xs sm:text-sm bg-black/20 px-3 py-1 rounded-lg border border-white/10 text-cyan-200 outline-hidden" placeholder="Corporate Trade Name" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="bg-black/30 border border-cyan-400/30 rounded-2xl p-4 backdrop-blur-md space-y-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Telemetry & Real-Time Tracking Ready
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Portal</a>}
                {company.brochureUrl && <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-xl bg-cyan-500/30 text-cyan-100 font-semibold flex items-center gap-1.5 border border-cyan-400/30"><Download className="w-3.5 h-3.5" /> Tech Specs PDF</a>}
                {company.hotline && <span className="px-3 py-1 rounded-xl bg-black/40 text-white font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-cyan-300" /> {company.hotline}</span>}
                {company.email && <span className="px-3 py-1 rounded-xl bg-black/40 text-white font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-cyan-300" /> {company.email}</span>}
              </div>
            </div>

          </div>

          {/* Slogan */}
          <div className="p-3 bg-black/40 border-l-4 border-cyan-400 rounded-r-2xl text-xs sm:text-sm text-cyan-100 italic flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
            {isReadOnly ? (
              <span>"{company.companySlogan || 'Vận hành thông minh - Kiểm soát chuẩn xác từng chuyến hàng'}"</span>
            ) : (
              <input type="text" value={company.companySlogan || ''} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full bg-black/30 px-2 py-0.5 rounded border border-white/20 text-cyan-100 outline-hidden font-mono" placeholder="Slogan công nghệ" />
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TELEMETRY GAUGES STRIP (KPIs & Scale)                  */}
      {/* ========================================================= */}
      {visibleSections.myCompany.highlights !== false && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Hạ Tầng Nhân Lực</span>
              <Users className="w-4 h-4" />
            </div>
            {isReadOnly ? (
              <div className="text-2xl font-black font-mono">{company.employeeCount || '---'}</div>
            ) : (
              <input type="text" value={company.employeeCount || ''} onChange={(e) => onChangeCompany({ ...company, employeeCount: e.target.value })} className="w-full text-base font-black bg-slate-800 border border-slate-700 rounded px-2 py-0.5 font-mono" />
            )}
            <span className="text-[10px] text-slate-400 block font-mono">{company.employeeSubtext || 'Đội ngũ kỹ thuật & điều độ'}</span>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Thiết Bị & Đội Xe</span>
              <Boxes className="w-4 h-4" />
            </div>
            {isReadOnly ? (
              <div className="text-2xl font-black font-mono">{company.truckFleetCount || '---'}</div>
            ) : (
              <input type="text" value={company.truckFleetCount || ''} onChange={(e) => onChangeCompany({ ...company, truckFleetCount: e.target.value })} className="w-full text-base font-black bg-slate-800 border border-slate-700 rounded px-2 py-0.5 font-mono" />
            )}
            <span className="text-[10px] text-slate-400 block font-mono">{company.fleetSubtext || '100% Giám sát IoT'}</span>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Kho Bãi Thông Minh</span>
              <Database className="w-4 h-4" />
            </div>
            {isReadOnly ? (
              <div className="text-2xl font-black font-mono">{company.warehouseArea || '---'}</div>
            ) : (
              <input type="text" value={company.warehouseArea || ''} onChange={(e) => onChangeCompany({ ...company, warehouseArea: e.target.value })} className="w-full text-base font-black bg-slate-800 border border-slate-700 rounded px-2 py-0.5 font-mono" />
            )}
            <span className="text-[10px] text-slate-400 block font-mono">{company.warehouseSubtext || 'WMS kết nối tự động'}</span>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Sản Lượng Điều Độ</span>
              <Activity className="w-4 h-4" />
            </div>
            {isReadOnly ? (
              <div className="text-2xl font-black font-mono">{company.annualVolume || '---'}</div>
            ) : (
              <input type="text" value={company.annualVolume || ''} onChange={(e) => onChangeCompany({ ...company, annualVolume: e.target.value })} className="w-full text-base font-black bg-slate-800 border border-slate-700 rounded px-2 py-0.5 font-mono" />
            )}
            <span className="text-[10px] text-slate-400 block font-mono">{company.volumeSubtext || 'Throughput hàng năm'}</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT (2 Columns: 65% / 35%)           */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT MAIN PANEL (8 Cols = ~65%) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Block 1: Tech Narrative & History */}
          {visibleSections.myCompany.about !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span>Tổng Quan Năng Lực & Dấu Mốc Chuyển Đổi Số</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddMilestone} className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm mốc số hóa
                  </button>
                )}
              </div>

              {isReadOnly ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {company.companyBio || 'Chưa cập nhật tổng quan.'}
                </p>
              ) : (
                <textarea rows={4} value={company.companyBio || ''} onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl outline-hidden" placeholder="Mô tả năng lực công nghệ và chuỗi giải pháp..." />
              )}

              {/* Milestones in Tech Terminal Style */}
              <div className="space-y-2 pt-2">
                {(company.milestones || []).map((ms, idx) => (
                  <div key={ms.id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3 relative group">
                    <span className="px-2 py-0.5 bg-slate-900 text-cyan-300 font-mono font-bold text-xs rounded shrink-0">
                      v.{ms.year}
                    </span>
                    {isReadOnly ? (
                      <div className="space-y-0.5 flex-1">
                        <h4 className="font-bold text-slate-900">{ms.title}</h4>
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

          {/* Block 4: Service Pillars */}
          {visibleSections.myCompany.ecosystem !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  <span>Các Module Dịch Vụ Cung Cấp</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddPillar} className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm module
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(company.servicePillars || []).map((sp, idx) => (
                  <div key={sp.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 relative group hover:border-cyan-400 transition-all">
                    {!isReadOnly && (
                      <button type="button" onClick={() => handleRemovePillar(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isReadOnly ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                            0{idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{sp.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-8">{sp.description}</p>
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
            </div>
          )}

          {/* Block 8: Case Studies */}
          {visibleSections.myCompany.caseStudies !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Dự Án Đo Lường Hiệu Suất SLA</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddCaseStudy} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Thêm case study
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
                          <span className="px-2 py-0.5 bg-cyan-100 text-cyan-900 text-[10px] font-mono font-bold rounded">{cs.clientIndustry}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold text-slate-700">{cs.scale}</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">{cs.title}</h4>
                        <div className="p-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs flex items-center gap-2 border border-slate-800">
                          <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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
                        <input type="text" value={cs.result} onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)} className="w-full text-xs font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT TECH HUD PANEL (4 Cols = ~35%) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Software & Systems */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-cyan-600" /> Hệ Thống & WMS / TMS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(company.softwareSystems || []).map((sys, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-900 font-mono text-xs font-bold flex items-center gap-1 border border-cyan-200">
                  <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                  <span>{sys}</span>
                  {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('softwareSystems', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                </span>
              ))}
              {!isReadOnly && (
                <input 
                  type="text" 
                  value={newSoftware} 
                  onChange={(e) => setNewSoftware(e.target.value)} 
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('softwareSystems', newSoftware); setNewSoftware(''); } }}
                  placeholder="+ Thêm phần mềm..." 
                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden font-mono mt-1"
                />
              )}
            </div>
          </div>

          {/* Compliance & Licenses */}
          {visibleSections.myCompany.compliance !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Chứng Chỉ & Tuân Thủ
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(company.licenses || []).map((lic, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-1 border border-emerald-200">
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
                    placeholder="+ Thêm chứng chỉ..." 
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg outline-hidden mt-1"
                  />
                )}
              </div>
            </div>
          )}

          {/* Branches Network */}
          {visibleSections.myCompany.branches !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" /> Mạng Lưới Điểm Hub
                </span>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddBranch} className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer">
                    + Thêm
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(company.branches || []).map((br, idx) => (
                  <div key={br.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs relative group">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{br.city}</strong>
                      <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold">{br.type}</span>
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

          {/* Partners & Carriers */}
          {visibleSections.myCompany.partners !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" /> Hãng Vận Chuyển & Đối Tác
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

    </div>
  );
};
