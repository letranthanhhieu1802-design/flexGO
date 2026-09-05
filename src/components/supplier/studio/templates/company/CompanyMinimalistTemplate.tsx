import React, { useRef, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Server, 
  Globe, 
  Mail, 
  Phone, 
  Download, 
  Ship, 
  TrendingUp, 
  Compass, 
  Target, 
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
import { CompanyTemplateProps } from './CorporateFlagshipTemplate';

export const CompanyMinimalistTemplate: React.FC<CompanyTemplateProps> = ({
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

  const handleAddMilestone = () => {
    const newMs: CompanyMilestoneItem = {
      id: `ms-${Date.now()}`,
      year: `${new Date().getFullYear()}`,
      title: 'Dấu mốc quan trọng',
      description: 'Ghi chú về thành tựu đạt được...'
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

  const handleAddPillar = () => {
    const newPillar: ServicePillarItem = {
      id: `sp-${Date.now()}`,
      title: 'Mảng Dịch Vụ Mới',
      description: 'Mô tả phạm vi và giải pháp logistics...'
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
      city: 'Thành Phố / Điểm Trạm',
      address: 'Địa chỉ cụ thể',
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

  const handleAddStat = () => {
    const newStat: CompanyStatItem = {
      id: `cs-${Date.now()}`,
      label: 'Chỉ số',
      value: '100+',
      subtext: 'Đơn vị'
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
    <div className="max-w-4xl mx-auto space-y-10 bg-white p-6 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm animate-in fade-in duration-200">
      
      {/* 1. MINIMALIST CENTERED HEADER */}
      <div className="text-center space-y-4 pb-8 border-b border-slate-200">
        <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
        <div className="flex justify-center">
          <div 
            onClick={() => !isReadOnly && logoInputRef.current?.click()}
            className={`w-20 h-20 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden relative group bg-slate-50 ${
              !isReadOnly ? 'cursor-pointer hover:border-slate-400 transition-all' : ''
            }`}
          >
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-2" />
            ) : (
              <Building2 className="w-10 h-10 text-slate-400" />
            )}
            {!isReadOnly && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] font-bold">Logo</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hồ Sơ Năng Lực Doanh Nghiệp (Editorial)</span>
          {isReadOnly ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{company.companyName}</h1>
              <p className="text-sm text-slate-500 font-medium">{company.companyNameEn}</p>
            </>
          ) : (
            <div className="max-w-lg mx-auto space-y-1.5 pt-1">
              <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-center text-xl font-black text-slate-900 border-b border-dashed border-slate-300 outline-hidden pb-1" placeholder="Tên công ty tiếng Việt" />
              <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-center text-xs text-slate-500 border-b border-dashed border-slate-300 outline-hidden pb-1" placeholder="Tên tiếng Anh" />
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-3">
          <span>Năm thành lập: <strong>{company.yearEstablished || 2008}</strong></span>
          <span>•</span>
          <span>MST: <strong>{company.taxId || 'Chưa cập nhật'}</strong></span>
        </div>

        {/* Slogan */}
        <div className="italic text-slate-600 text-sm max-w-md mx-auto">
          {isReadOnly ? (
            <span>"{company.companySlogan}"</span>
          ) : (
            <input type="text" value={company.companySlogan} onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })} className="w-full text-center text-xs text-slate-600 italic border-b border-dashed border-slate-200 outline-hidden" placeholder="Slogan..." />
          )}
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 pt-2">
          {company.websiteUrl && <span className="flex items-center gap-1 font-semibold text-slate-800"><Globe className="w-3.5 h-3.5 text-slate-400" /> {company.websiteUrl}</span>}
          {company.hotline && <span className="flex items-center gap-1 font-semibold text-slate-800"><Phone className="w-3.5 h-3.5 text-slate-400" /> {company.hotline}</span>}
          {company.email && <span className="flex items-center gap-1 font-semibold text-slate-800"><Mail className="w-3.5 h-3.5 text-slate-400" /> {company.email}</span>}
        </div>
      </div>

      {/* 2. MINIMALIST KEY METRICS ROW */}
      {visibleSections.myCompany.highlights !== false && (
        <div className="py-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Các Thước Đo Quy Mô Cốt Lõi</span>
            {!isReadOnly && <button type="button" onClick={handleAddStat} className="text-xs text-slate-500 hover:text-slate-800 font-bold">+ Thêm</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {(company.companyStats || []).slice(0, 4).map((stat, idx) => (
              <div key={stat.id || idx} className="p-3 bg-slate-50 rounded-xl relative group">
                {!isReadOnly && <button type="button" onClick={() => handleRemoveStat(idx)} className="absolute top-1 right-1 text-slate-300 hover:text-rose-600 text-xs">×</button>}
                <div className="text-xl font-black text-slate-900">{stat.value}</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EDITORIAL STORY & TIMELINE */}
      {visibleSections.myCompany.about !== false && (
        <div className="space-y-4 py-4 border-b border-slate-200">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">1. Câu Chuyện & Lịch Sử Hình Thành</h3>
          {isReadOnly ? (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{company.companyBio}</p>
          ) : (
            <textarea rows={4} value={company.companyBio} onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })} className="w-full p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden leading-relaxed" />
          )}

          {/* Timeline Bullets */}
          <div className="space-y-2 pt-2">
            {(company.milestones || []).map((ms, idx) => (
              <div key={ms.id || idx} className="flex items-baseline gap-3 text-xs">
                <span className="font-mono font-black text-slate-900 shrink-0 w-16">{ms.year}</span>
                <div className="flex-1 text-slate-700">
                  <strong className="text-slate-900">{ms.title}</strong> — {ms.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VISION & MISSION CLEAN BLOCK */}
      {visibleSections.myCompany.visionMission !== false && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-b border-slate-200">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Tầm Nhìn Chiến Lược</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{company.vision}</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Sứ Mệnh Doanh Nghiệp</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{company.mission}</p>
          </div>
        </div>
      )}

      {/* 5. DIRECTORY STYLE SERVICE PILLARS */}
      {visibleSections.myCompany.ecosystem !== false && (
        <div className="space-y-4 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">2. Hệ Thống Dịch Vụ Logistics</h3>
            {!isReadOnly && <button type="button" onClick={handleAddPillar} className="text-xs text-slate-500 hover:text-slate-800 font-bold">+ Thêm dịch vụ</button>}
          </div>

          <div className="divide-y divide-slate-100 space-y-3">
            {(company.servicePillars || []).map((sp, idx) => (
              <div key={sp.id || idx} className="pt-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">0{idx + 1}.</span>
                    <h5 className="font-bold text-slate-900 text-sm">{sp.title}</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">{sp.description}</p>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemovePillar(idx)} className="text-slate-300 hover:text-rose-600 text-xs shrink-0">Xóa</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. OFFICE NETWORK TABULAR LIST */}
      {visibleSections.myCompany.branches !== false && (
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">3. Mạng Lưới Điểm Văn Phòng & Hubs</h3>
            {!isReadOnly && <button type="button" onClick={handleAddBranch} className="text-xs text-slate-500 hover:text-slate-800 font-bold">+ Thêm chi nhánh</button>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {(company.branches || []).map((br, idx) => (
              <div key={br.id || idx} className="p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-black text-slate-900">
                  <span>{br.city}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{br.type}</span>
                </div>
                <p className="text-slate-600">{br.address}</p>
                {br.phone && <p className="text-slate-500 font-mono text-[11px]">{br.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
