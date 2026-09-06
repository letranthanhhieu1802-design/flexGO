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
  Send,
  Zap,
  ArrowRight
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

export const CommercialSpotlightTemplate: React.FC<CompanyTemplateProps> = ({
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
      title: 'Mốc Phát Triển Mới',
      description: 'Mở rộng thị phần và năng lực phục vụ...'
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
      title: 'Cam Kết Vượt Trội',
      description: 'Chất lượng cam kết đi đầu...'
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
      label: 'Tỷ Lệ SLA Đúng Hạn',
      value: '99.8%',
      subtext: 'Bảo chứng hợp đồng'
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
      title: 'Gói Dịch Vụ Cung Ứng Toàn Diện',
      description: 'Tối ưu chi phí từ 15-20%, cam kết tiến độ và minh bạch thủ tục hải quan...'
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
      city: 'Hub / Trung Tâm Giao Nhận',
      address: 'Địa chỉ tiếp nhận hàng hóa',
      type: 'Chi nhánh',
      phone: '(028) 3822 3333',
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
      name: 'Tổ Chức / Hiệp Hội Uy Tín',
      type: 'Hiệp hội Logistics',
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
      title: 'Hợp Đồng Cung Cấp Chuỗi Logistics Trọn Gói',
      clientIndustry: 'Khối Doanh Nghiệp Xuất Nhập Khẩu',
      scale: 'Vận chuyển 200+ TEUs/tháng',
      result: 'Tiết kiệm 18% chi phí vận hành cho khách hàng'
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
      {/* 1. COMMERCIAL HERO BANNER (Proof-First & Conversion Focus)*/}
      {/* ========================================================= */}
      <div 
        className="rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden transition-all"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Main Brand Info */}
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
                <span className="px-3 py-0.5 bg-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase rounded-full tracking-wider border border-emerald-400/50 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-300" /> Commercial Spotlight Partner
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
                  <span>"{company.companySlogan || 'Báo giá nhanh chóng - Vận hành an tâm - Tiết kiệm chi phí'}"</span>
                ) : (
                  <input type="text" value={company.companySlogan || ''} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white outline-hidden" placeholder="Slogan doanh nghiệp" />
                )}
              </div>
            </div>
          </div>

          {/* Sticky Commercial RFQ Card */}
          <div className="bg-black/30 border border-white/20 rounded-3xl p-5 backdrop-blur-md space-y-3 shrink-0 lg:w-72">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Yêu Cầu Báo Giá Nhanh
              </span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">SLA 15 Phút</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              Kết nối trực tiếp chuyên viên logistics để nhận tư vấn lộ trình và biểu giá tối ưu.
            </p>
            <div className="space-y-1.5 pt-1 text-xs">
              {company.hotline && (
                <div className="p-2.5 rounded-xl bg-white/10 flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-amber-200"><Phone className="w-3.5 h-3.5" /> Hotline:</span>
                  <span>{company.hotline}</span>
                </div>
              )}
              {company.email && (
                <div className="p-2.5 rounded-xl bg-white/10 flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5 text-amber-200"><Mail className="w-3.5 h-3.5" /> Email:</span>
                  <span className="truncate max-w-[140px]">{company.email}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SOCIAL PROOF STRIP (Immediate Client & Carrier Badges) */}
      {/* ========================================================= */}
      {visibleSections.myCompany.partners !== false && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" /> Được Tin Tưởng Bởi Hơn 500+ Doanh Nghiệp & Hãng Tàu Đối Tác
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">100% Đối tác xác thực</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(company.carrierPartners || []).map((cp, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1">
                <span>{cp}</span>
                {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('carrierPartners', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
              </span>
            ))}
            {(company.clientLogos || []).map((cl, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1">
                <span>{cl}</span>
                {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('clientLogos', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
              </span>
            ))}
            {!isReadOnly && (
              <div className="flex items-center gap-1">
                <input 
                  type="text" 
                  value={newCarrierTag} 
                  onChange={(e) => setNewCarrierTag(e.target.value)} 
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTagItem('carrierPartners', newCarrierTag); setNewCarrierTag(''); } }}
                  placeholder="+ Hãng tàu / Đối tác..." 
                  className="px-2 py-1 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-xl outline-hidden"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CASE STUDIES SPOTLIGHT (Proof & ROI First)              */}
      {/* ========================================================= */}
      {visibleSections.myCompany.caseStudies !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                <Briefcase className="w-4 h-4" style={{ color: theme.primary }} />
                <span>Các Dự Án Thành Công Điển Hình (Proof of Delivery)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Minh chứng năng lực qua từng chuyến hàng và chỉ số tiết kiệm chi phí</p>
            </div>
            {!isReadOnly && (
              <button type="button" onClick={handleAddCaseStudy} className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80" style={{ color: theme.primary }}>
                <Plus className="w-3.5 h-3.5" /> Thêm dự án
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(company.caseStudies || []).map((cs, idx) => (
              <div key={cs.id || idx} className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200/80 text-xs space-y-3 relative group hover:border-emerald-400 transition-all">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveCaseStudy(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {isReadOnly ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-md">{cs.clientIndustry}</span>
                      <span className="font-bold text-slate-600">{cs.scale}</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">{cs.title}</h4>
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-950 font-bold border border-emerald-200 flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cs.result}</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 pr-6">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={cs.clientIndustry} onChange={(e) => handleUpdateCaseStudy(idx, 'clientIndustry', e.target.value)} className="text-xs font-bold bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ngành hàng" />
                      <input type="text" value={cs.scale} onChange={(e) => handleUpdateCaseStudy(idx, 'scale', e.target.value)} className="text-xs bg-white border border-slate-200 rounded px-2 py-1" placeholder="Quy mô" />
                    </div>
                    <input type="text" value={cs.title} onChange={(e) => handleUpdateCaseStudy(idx, 'title', e.target.value)} className="w-full font-bold text-xs bg-white border border-slate-200 rounded px-2 py-1" placeholder="Tên dự án" />
                    <input type="text" value={cs.result} onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)} className="w-full text-xs text-emerald-800 bg-white border border-emerald-200 rounded px-2 py-1" placeholder="Kết quả hoàn thành" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CAPACITY & SERVICE ECOSYSTEM                            */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: SERVICE ECOSYSTEM (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Ecosystem */}
          {visibleSections.myCompany.ecosystem !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <Layers className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Dịch Vụ Cung Cấp & Cam Kết SLA</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddPillar} className="text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-80" style={{ color: theme.primary }}>
                    <Plus className="w-3.5 h-3.5" /> Thêm dịch vụ
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
                          <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">{idx + 1}</span>
                          {sp.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 pl-7 leading-relaxed">{sp.description}</p>
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
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Ngành Hàng Khách Hàng Trọng Điểm:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(company.targetIndustries || []).map((ind, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1 border border-slate-200">
                      <span>{ind}</span>
                      {!isReadOnly && <button type="button" onClick={() => handleRemoveTagItem('targetIndustries', idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* About */}
          {visibleSections.myCompany.about !== false && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-900">
                  <FileText className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>Tổng Quan Năng Lực & Kinh Nghiệm Thực Tế</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={handleAddMilestone} className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
                    + Thêm mốc
                  </button>
                )}
              </div>

              {isReadOnly ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {company.companyBio || 'Chưa cập nhật thông tin năng lực.'}
                </p>
              ) : (
                <textarea rows={4} value={company.companyBio || ''} onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl outline-hidden" placeholder="Giới thiệu năng lực..." />
              )}
            </div>
          )}

        </div>

        {/* RIGHT PANEL: SCALE, BRANCHES & COMPLIANCE (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Highlights */}
          {visibleSections.myCompany.highlights !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" style={{ color: theme.primary }} /> Quy Mô Năng Lực Vận Hành
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Nhân Sự</span>
                  {isReadOnly ? <div className="text-lg font-black text-slate-900">{company.employeeCount || '---'}</div> : <input type="text" value={company.employeeCount || ''} onChange={(e) => onChangeCompany({ ...company, employeeCount: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1 mt-0.5" />}
                  <span className="text-[10px] text-slate-500">{company.employeeSubtext || 'CB-CNV'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Đội Xe</span>
                  {isReadOnly ? <div className="text-lg font-black text-slate-900">{company.truckFleetCount || '---'}</div> : <input type="text" value={company.truckFleetCount || ''} onChange={(e) => onChangeCompany({ ...company, truckFleetCount: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1 mt-0.5" />}
                  <span className="text-[10px] text-slate-500">{company.fleetSubtext || 'Đầu kéo & tải'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Kho Bãi</span>
                  {isReadOnly ? <div className="text-lg font-black text-slate-900">{company.warehouseArea || '---'}</div> : <input type="text" value={company.warehouseArea || ''} onChange={(e) => onChangeCompany({ ...company, warehouseArea: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1 mt-0.5" />}
                  <span className="text-[10px] text-slate-500">{company.warehouseSubtext || 'Tiêu chuẩn'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Sản Lượng</span>
                  {isReadOnly ? <div className="text-lg font-black text-slate-900">{company.annualVolume || '---'}</div> : <input type="text" value={company.annualVolume || ''} onChange={(e) => onChangeCompany({ ...company, annualVolume: e.target.value })} className="w-full text-xs font-black bg-white border border-slate-200 rounded px-1 mt-0.5" />}
                  <span className="text-[10px] text-slate-500">{company.volumeSubtext || 'Thường niên'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Compliance */}
          {visibleSections.myCompany.compliance !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Giấy Phép & Bảo Chứng Pháp Lý
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(company.licenses || []).map((lic, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{lic}</span>
                    {!isReadOnly && <button type="button" onClick={() => handleRemoveLicense(idx)} className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer">×</button>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Branches */}
          {visibleSections.myCompany.branches !== false && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" /> Mạng Lưới Chi Nhánh Giao Nhận
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
                    <p className="text-[11px] text-slate-600 mt-0.5">{br.address}</p>
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

        </div>

      </div>

    </div>
  );
};
