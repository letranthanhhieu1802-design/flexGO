import React, { useRef } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone, 
  Download, 
  TrendingUp, 
  Camera, 
  Upload,
  Boxes,
  Sparkles,
  Layers,
  Check,
  Calendar,
  Compass,
  Target,
  FileCheck2,
  ExternalLink
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

export const GlassmorphismLuxuryTemplate: React.FC<CompanyTemplateProps> = ({
  company,
  onChangeCompany,
  config,
  isReadOnly = false,
}) => {
  const theme = THEME_COLOR_OPTIONS[config.themeColor];
  const { visibleSections } = config;

  const logoInputRef = useRef<HTMLInputElement>(null);

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
      title: 'Mốc son phát triển mới',
      description: 'Mô tả tóm tắt sự kiện phát triển mở rộng...'
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

  const handleAddPillar = () => {
    const newPillar: ServicePillarItem = {
      id: `sp-${Date.now()}`,
      title: 'Trụ cột dịch vụ mới',
      description: 'Mô tả giải pháp logistics, cam kết SLA và năng lực phục vụ...'
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
      city: 'Chi nhánh / Hub mới',
      address: 'Địa chỉ chi tiết văn phòng hoặc kho bãi',
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

  const handleAddCaseStudy = () => {
    const newCs: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      title: 'Dự án logistics tiêu biểu',
      clientIndustry: 'Ngành hàng khách hàng',
      scale: 'Quy mô vận chuyển',
      result: 'Kết quả cam kết hoàn thành đạt chuẩn'
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

  const handleAddTag = (field: 'carrierPartners' | 'clientLogos' | 'licenses' | 'certifications' | 'targetIndustries', val: string) => {
    if (!val.trim()) return;
    const current = (company[field] as string[]) || [];
    if (!current.includes(val.trim())) {
      onChangeCompany({ ...company, [field]: [...current, val.trim()] });
    }
  };

  const handleRemoveTag = (field: 'carrierPartners' | 'clientLogos' | 'licenses' | 'certifications' | 'targetIndustries', index: number) => {
    const current = [...((company[field] as string[]) || [])];
    current.splice(index, 1);
    onChangeCompany({ ...company, [field]: current });
  };

  return (
    <div 
      className="p-4 sm:p-8 rounded-3xl space-y-8 animate-in fade-in duration-200 relative overflow-hidden transition-colors"
      style={{
        background: `radial-gradient(ellipse at top left, ${theme.primary}18, transparent 60%), radial-gradient(ellipse at bottom right, ${theme.secondary}15, transparent 60%), #f8fafc`
      }}
    >
      
      {/* ========================================================= */}
      {/* 0. FLOATING GLASS HERO BANNER                              */}
      {/* ========================================================= */}
      <div 
        className="rounded-3xl p-6 sm:p-10 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl relative overflow-hidden transition-all"
      >
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.primary }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-5 flex-1">
            {/* Logo Upload */}
            <div className="flex flex-col items-center shrink-0">
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <div 
                onClick={() => !isReadOnly && logoInputRef.current?.click()}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/90 border-2 shadow-lg flex items-center justify-center shrink-0 overflow-hidden relative group backdrop-blur-md ${
                  !isReadOnly ? 'cursor-pointer hover:scale-105 transition-all' : ''
                }`}
                style={{ borderColor: `${theme.primary}40` }}
              >
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-2" />
                ) : (
                  <Building2 className="w-10 h-10" style={{ color: theme.primary }} />
                )}
                {!isReadOnly && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold">{company.logoUrl ? 'Đổi Logo' : 'Tải Logo'}</span>
                  </div>
                )}
              </div>
              {!isReadOnly && (
                <div className="mt-1 flex items-center gap-1.5">
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="text-[10px] text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer">
                    {company.logoUrl ? 'Đổi' : 'Tải logo'}
                  </button>
                  {company.logoUrl && (
                    <>
                      <span className="text-slate-300 text-[10px]">•</span>
                      <button type="button" onClick={() => onChangeCompany({ ...company, logoUrl: '' })} className="text-[10px] text-rose-500 hover:text-rose-700 cursor-pointer">Xóa</button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Names & Legal Meta */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span 
                  className="px-3 py-0.5 text-white text-[10px] font-black uppercase rounded-full tracking-wider shadow-xs flex items-center gap-1.5"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" /> Glassmorphism Luxury Portal
                </span>
                {isReadOnly ? (
                  <span className="text-xs text-slate-500 font-medium">
                    Thành lập: <strong className="text-slate-800">{company.yearEstablished || 2008}</strong> • MST: <strong className="text-slate-800 font-mono">{company.taxId || 'Chưa cập nhật'}</strong>
                  </span>
                ) : (
                  <div className="flex items-center gap-2 text-xs bg-slate-100/90 px-2.5 py-0.5 rounded-full border border-slate-200">
                    <span className="text-slate-500">Năm TL:</span>
                    <input type="number" value={company.yearEstablished || ''} onChange={(e) => onChangeCompany({ ...company, yearEstablished: parseInt(e.target.value) || 0 })} className="w-14 bg-transparent border-b border-slate-300 text-xs font-bold text-slate-800 outline-hidden text-center" placeholder="2008" />
                    <span className="text-slate-500">• MST:</span>
                    <input type="text" value={company.taxId || ''} onChange={(e) => onChangeCompany({ ...company, taxId: e.target.value })} className="w-28 bg-transparent border-b border-slate-300 text-xs font-bold text-slate-800 outline-hidden font-mono text-center" placeholder="Mã số thuế" />
                  </div>
                )}
              </div>

              {isReadOnly ? (
                <div className="space-y-0.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">{company.companyName}</h1>
                  <p className="text-sm sm:text-base font-semibold" style={{ color: theme.primary }}>{company.companyNameEn}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-2xl sm:text-3xl font-black text-slate-900 bg-white/70 px-2.5 py-1 rounded-xl border border-slate-200 outline-hidden" placeholder="Tên công ty tiếng Việt..." />
                  <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-xs sm:text-sm font-semibold text-slate-700 bg-white/50 px-2.5 py-0.5 rounded-lg border border-slate-200 outline-hidden" placeholder="Tên tiếng Anh..." />
                </div>
              )}

              {/* Slogan */}
              <div className="pt-1">
                {isReadOnly ? (
                  company.companySlogan && (
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm italic font-medium px-3.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>"{company.companySlogan}"</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-xl border border-slate-200 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <input type="text" value={company.companySlogan} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full bg-transparent text-xs italic text-slate-700 outline-hidden" placeholder="Khẩu hiệu / Slogan doanh nghiệp..." />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 text-xs">
            {company.websiteUrl && (
              <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-xl bg-white shadow-xs border border-slate-200 hover:border-slate-400 font-semibold text-slate-700 flex items-center gap-1.5 transition-all">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Website Doanh Nghiệp
              </a>
            )}
            {company.brochureUrl && (
              <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-xl text-white font-semibold flex items-center gap-1.5 shadow-xs transition-all" style={{ backgroundColor: theme.primary }}>
                <Download className="w-3.5 h-3.5" /> Company Profile (PDF)
              </a>
            )}
            {company.hotline && (
              <span className="px-3.5 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-slate-800 font-bold flex items-center gap-1.5 shadow-xs">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> {company.hotline}
              </span>
            )}
            {company.email && (
              <span className="px-3.5 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5 shadow-xs">
                <Mail className="w-3.5 h-3.5 text-indigo-600" /> {company.email}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. HIGHLIGHTS (Thước Đo Quy Mô & Năng Lực Vận Hành)        */}
      {/* ========================================================= */}
      {visibleSections.myCompany.highlights !== false && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" style={{ color: theme.primary }} /> 3. Thước Đo Quy Mô & Năng Lực Vận Hành
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddStat} className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer" style={{ color: theme.primary }}>
                <Plus className="w-3.5 h-3.5" /> Thêm chỉ số
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Standard stats */}
            <div className="rounded-3xl p-5 backdrop-blur-xl bg-white/80 border border-white/80 shadow-lg relative group">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Quy mô nhân sự</span>
              {isReadOnly ? (
                <div className="text-2xl font-black text-slate-900 mt-1">{company.employeeCount || '450+ Nhân viên'}</div>
              ) : (
                <input type="text" value={company.employeeCount || ''} onChange={(e) => onChangeCompany({ ...company, employeeCount: e.target.value })} className="w-full text-xl font-black text-slate-900 bg-white/60 px-2 py-0.5 rounded border border-slate-200 outline-hidden mt-1" placeholder="450+ Nhân sự" />
              )}
              <span className="text-xs font-semibold block mt-0.5" style={{ color: theme.primary }}>{company.employeeSubtext || 'Toàn quốc'}</span>
            </div>

            <div className="rounded-3xl p-5 backdrop-blur-xl bg-white/80 border border-white/80 shadow-lg relative group">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Đội xe vận tải</span>
              {isReadOnly ? (
                <div className="text-2xl font-black text-slate-900 mt-1">{company.truckFleetCount || '240+ Đầu xe'}</div>
              ) : (
                <input type="text" value={company.truckFleetCount || ''} onChange={(e) => onChangeCompany({ ...company, truckFleetCount: e.target.value })} className="w-full text-xl font-black text-slate-900 bg-white/60 px-2 py-0.5 rounded border border-slate-200 outline-hidden mt-1" placeholder="240+ Đầu xe" />
              )}
              <span className="text-xs font-semibold block mt-0.5" style={{ color: theme.primary }}>{company.truckFleetSubtext || 'Xe tải & Container'}</span>
            </div>

            <div className="rounded-3xl p-5 backdrop-blur-xl bg-white/80 border border-white/80 shadow-lg relative group">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hệ thống kho bãi</span>
              {isReadOnly ? (
                <div className="text-2xl font-black text-slate-900 mt-1">{company.warehouseArea || '65,000 m²'}</div>
              ) : (
                <input type="text" value={company.warehouseArea || ''} onChange={(e) => onChangeCompany({ ...company, warehouseArea: e.target.value })} className="w-full text-xl font-black text-slate-900 bg-white/60 px-2 py-0.5 rounded border border-slate-200 outline-hidden mt-1" placeholder="65,000 m²" />
              )}
              <span className="text-xs font-semibold block mt-0.5" style={{ color: theme.primary }}>{company.warehouseSubtext || 'Kho thường & Kho lạnh'}</span>
            </div>

            {/* Custom KPI stat */}
            {(company.companyStats || []).map((stat, idx) => (
              <div key={stat.id || idx} className="rounded-3xl p-5 backdrop-blur-xl bg-white/80 border border-white/80 shadow-lg relative group">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveStat(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {isReadOnly ? (
                  <>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{stat.label}</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stat.value}</div>
                    <span className="text-xs font-semibold block mt-0.5" style={{ color: theme.primary }}>{stat.subtext}</span>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input type="text" value={stat.label} onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)} className="w-full text-[10px] font-bold text-slate-400 bg-white/60 px-1 rounded border border-slate-200 outline-hidden uppercase" placeholder="Tên chỉ số" />
                    <input type="text" value={stat.value} onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)} className="w-full text-xl font-black text-slate-900 bg-white/60 px-1 rounded border border-slate-200 outline-hidden" placeholder="Số liệu" />
                    <input type="text" value={stat.subtext || ''} onChange={(e) => handleUpdateStat(idx, 'subtext', e.target.value)} className="w-full text-xs font-semibold bg-white/60 px-1 rounded border border-slate-200 outline-hidden" placeholder="Ghi chú phụ" style={{ color: theme.primary }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. ABOUT & MILESTONES (Về Chúng Tôi & Dấu Mốc Lịch Sử)    */}
      {/* ========================================================= */}
      {visibleSections.myCompany.about !== false && (
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" style={{ color: theme.primary }} /> 1. Về Chúng Tôi & Dấu Mốc Lịch Sử
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddMilestone} className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer" style={{ color: theme.primary }}>
                <Plus className="w-3.5 h-3.5" /> Thêm mốc lịch sử
              </button>
            )}
          </div>

          {/* Bio text */}
          <div>
            {isReadOnly ? (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {company.companyBio}
              </p>
            ) : (
              <textarea
                rows={4}
                value={company.companyBio}
                onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-white/70 border border-slate-200 text-sm text-slate-700 outline-hidden focus:border-slate-400 leading-relaxed"
                placeholder="Nhập phần giới thiệu doanh nghiệp, bề dày hoạt động..."
              />
            )}
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {(company.milestones || []).map((ms, idx) => (
              <div key={ms.id || idx} className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs relative group space-y-1.5">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveMilestone(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {isReadOnly ? (
                  <>
                    <span className="px-2 py-0.5 text-xs font-black rounded-lg text-white font-mono" style={{ backgroundColor: theme.primary }}>
                      {ms.year}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{ms.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ms.description}</p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input type="text" value={ms.year} onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)} className="w-16 text-xs font-black bg-white px-2 py-0.5 rounded border border-slate-300 outline-hidden font-mono" placeholder="2018" />
                    <input type="text" value={ms.title} onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)} className="w-full text-sm font-bold bg-white px-2 py-0.5 rounded border border-slate-300 outline-hidden" placeholder="Tên sự kiện" />
                    <textarea rows={2} value={ms.description} onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)} className="w-full text-xs text-slate-600 bg-white p-1 rounded border border-slate-200 outline-hidden" placeholder="Mô tả sự kiện..." />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. VISION, MISSION & CORE VALUES                          */}
      {/* ========================================================= */}
      {visibleSections.myCompany.visionMission !== false && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Compass className="w-4 h-4" style={{ color: theme.primary }} /> Tầm Nhìn Chiến Lược
            </span>
            {isReadOnly ? (
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{company.vision}</p>
            ) : (
              <textarea rows={3} value={company.vision} onChange={(e) => onChangeCompany({ ...company, vision: e.target.value })} className="w-full p-3 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-700 outline-hidden" placeholder="Tầm nhìn doanh nghiệp..." />
            )}
          </div>

          <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Target className="w-4 h-4" style={{ color: theme.primary }} /> Sứ Mệnh & Giá Trị Cốt Lõi
            </span>
            {isReadOnly ? (
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{company.mission}</p>
            ) : (
              <textarea rows={3} value={company.mission} onChange={(e) => onChangeCompany({ ...company, mission: e.target.value })} className="w-full p-3 rounded-xl bg-white/70 border border-slate-200 text-xs text-slate-700 outline-hidden" placeholder="Sứ mệnh doanh nghiệp..." />
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ECOSYSTEM & TARGET INDUSTRIES (Hệ Sinh Thái & Ngành)    */}
      {/* ========================================================= */}
      {visibleSections.myCompany.ecosystem !== false && (
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Boxes className="w-4 h-4" style={{ color: theme.primary }} /> 4. Hệ Sinh Thái Dịch Vụ Logistics & Ngành Hàng
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddPillar} className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer" style={{ color: theme.primary }}>
                <Plus className="w-3.5 h-3.5" /> Thêm trụ cột dịch vụ
              </button>
            )}
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(company.servicePillars || []).map((sp, idx) => (
              <div key={sp.id || idx} className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs space-y-2 relative group hover:border-slate-400 transition-all">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemovePillar(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="w-8 h-8 rounded-xl text-white font-black flex items-center justify-center text-xs shadow-xs" style={{ backgroundColor: theme.primary }}>
                  0{idx + 1}
                </div>
                {isReadOnly ? (
                  <>
                    <h4 className="font-black text-slate-900 text-sm">{sp.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{sp.description}</p>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <input type="text" value={sp.title} onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)} className="w-full text-sm font-black bg-white px-2 py-0.5 rounded border border-slate-300 outline-hidden" placeholder="Tên trụ cột" />
                    <textarea rows={2} value={sp.description} onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)} className="w-full text-xs text-slate-600 bg-white p-1 rounded border border-slate-200 outline-hidden" placeholder="Mô tả năng lực dịch vụ..." />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Target industries tags */}
          {company.targetIndustries && company.targetIndustries.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Ngành hàng phục vụ trọng điểm:</span>
              {company.targetIndustries.map((ind, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/90 text-slate-800 text-xs font-semibold rounded-full border border-slate-200 shadow-2xs">
                  {ind}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. CASE STUDIES (Dự Án Logistics Thực Tế)                 */}
      {/* ========================================================= */}
      {visibleSections.myCompany.caseStudies !== false && (
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 8. Dự Án Logistics & Case Studies Thực Tế
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddCaseStudy} className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer" style={{ color: theme.primary }}>
                <Plus className="w-3.5 h-3.5" /> Thêm dự án
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(company.caseStudies || []).map((cs, idx) => (
              <div key={cs.id || idx} className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs space-y-2.5 relative group">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveCaseStudy(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {isReadOnly ? (
                  <>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: theme.primary }}>
                        {cs.clientIndustry}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono text-slate-700 font-bold">{cs.scale}</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">{cs.title}</h4>
                    <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{cs.result}</span>
                    </p>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={cs.clientIndustry} onChange={(e) => handleUpdateCaseStudy(idx, 'clientIndustry', e.target.value)} className="w-full text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-300 outline-hidden" placeholder="Ngành hàng" />
                      <input type="text" value={cs.scale} onChange={(e) => handleUpdateCaseStudy(idx, 'scale', e.target.value)} className="w-full text-xs bg-white px-2 py-0.5 rounded border border-slate-300 outline-hidden font-mono" placeholder="Quy mô" />
                    </div>
                    <input type="text" value={cs.title} onChange={(e) => handleUpdateCaseStudy(idx, 'title', e.target.value)} className="w-full text-sm font-bold bg-white px-2 py-0.5 rounded border border-slate-300 outline-hidden" placeholder="Tên dự án" />
                    <input type="text" value={cs.result} onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)} className="w-full text-xs text-emerald-800 font-semibold bg-white p-1 rounded border border-emerald-300 outline-hidden" placeholder="Kết quả cam kết..." />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PARTNERS & 6. COMPLIANCE (Đối Tác & Chứng Nhận)         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 5. Partners */}
        {visibleSections.myCompany.partners !== false && (
          <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> 5. Khách Hàng Tiêu Biểu & Đối Tác
            </span>
            <div className="space-y-3">
              {company.carrierPartners && company.carrierPartners.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Đối tác vận tải & Hãng tàu:</span>
                  <div className="flex flex-wrap gap-2">
                    {company.carrierPartners.map((carrier, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs">
                        {carrier}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {company.clientLogos && company.clientLogos.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Khách hàng tin cậy:</span>
                  <div className="flex flex-wrap gap-2">
                    {company.clientLogos.map((client, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. Compliance */}
        {visibleSections.myCompany.compliance !== false && (
          <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> 6. Chứng Nhận, Giấy Phép & Hiệp Hội
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {(company.licenses || []).map((lic, idx) => (
                <span key={idx} className="px-3 py-1 bg-white text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs">
                  ✓ {lic}
                </span>
              ))}
              {(company.certifications || []).map((cert, idx) => (
                <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 shadow-2xs">
                  ★ {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 7. BRANCHES (Mạng Lưới Chi Nhánh & Trụ Sở)                */}
      {/* ========================================================= */}
      {visibleSections.myCompany.branches !== false && (
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600" /> 7. Mạng Lưới Chi Nhánh & Trụ Sở
            </span>
            {!isReadOnly && (
              <button type="button" onClick={handleAddBranch} className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer" style={{ color: theme.primary }}>
                <Plus className="w-3.5 h-3.5" /> Thêm điểm trạm
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(company.branches || []).map((br, idx) => (
              <div key={br.id || idx} className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs space-y-1 relative group">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveBranch(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {isReadOnly ? (
                  <>
                    <span className="px-2 py-0.5 bg-slate-800 text-white text-[9px] font-bold rounded">
                      {br.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{br.city}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{br.address}</p>
                    {br.phone && <p className="text-[11px] font-mono text-slate-700 font-bold pt-1">{br.phone}</p>}
                  </>
                ) : (
                  <div className="space-y-1">
                    <input type="text" value={br.city} onChange={(e) => handleUpdateBranch(idx, 'city', e.target.value)} className="w-full text-sm font-bold bg-white px-2 py-0.5 rounded border border-slate-300 outline-hidden" placeholder="Thành phố/Hub" />
                    <input type="text" value={br.address} onChange={(e) => handleUpdateBranch(idx, 'address', e.target.value)} className="w-full text-xs text-slate-600 bg-white p-1 rounded border border-slate-200 outline-hidden" placeholder="Địa chỉ chi tiết..." />
                    <input type="text" value={br.phone || ''} onChange={(e) => handleUpdateBranch(idx, 'phone', e.target.value)} className="w-full text-xs font-mono bg-white px-1 py-0.5 rounded border border-slate-200 outline-hidden" placeholder="Hotline..." />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
