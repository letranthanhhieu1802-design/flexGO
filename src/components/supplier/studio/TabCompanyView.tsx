import React, { useState } from 'react';
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
  ServicePillarItem
} from './studioTypes';

interface TabCompanyViewProps {
  company: CompanyInfoProfile;
  onChangeCompany: (company: CompanyInfoProfile) => void;
  config: StudioTemplateConfig;
  isReadOnly?: boolean;
}

export const TabCompanyView: React.FC<TabCompanyViewProps> = ({
  company,
  onChangeCompany,
  config,
  isReadOnly = false,
}) => {
  const theme = THEME_COLOR_OPTIONS[config.themeColor];
  const { visibleSections } = config;

  // New tag inputs for target industries, carrier partners, client logos
  const [newIndustryTag, setNewIndustryTag] = useState('');
  const [newCarrierTag, setNewCarrierTag] = useState('');
  const [newClientTag, setNewClientTag] = useState('');
  const [newSoftwareTag, setNewSoftwareTag] = useState('');

  // 1. STATS HANDLERS
  const handleAddStat = () => {
    const newStat: CompanyStatItem = {
      id: `cs-${Date.now()}`,
      label: 'Chỉ số mới',
      value: '100+',
      subtext: 'Đơn vị tính / Ghi chú'
    };
    onChangeCompany({
      ...company,
      companyStats: [...(company.companyStats || []), newStat]
    });
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

  // 2. BRANCHES HANDLERS
  const handleAddBranch = () => {
    const newBr: BranchOfficeItem = {
      id: `br-${Date.now()}`,
      city: 'Thành Phố / Trung Tâm Mới',
      address: 'Địa chỉ văn phòng / Kho bãi trung chuyển',
      type: 'Chi nhánh',
      phone: '(028) 1234 5678',
    };
    onChangeCompany({
      ...company,
      branches: [...(company.branches || []), newBr],
    });
  };

  const handleUpdateBranch = (index: number, field: keyof BranchOfficeItem, val: string) => {
    const updated = [...(company.branches || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChangeCompany({ ...company, branches: updated });
  };

  const handleRemoveBranch = (index: number) => {
    const updated = [...(company.branches || [])];
    updated.splice(index, 1);
    onChangeCompany({ ...company, branches: updated });
  };

  // 3. AFFILIATIONS HANDLERS
  const handleAddAffiliation = () => {
    const newAf: AffiliationItem = {
      id: `af-${Date.now()}`,
      name: 'Tên Tổ Chức / Hiệp Hội',
      type: 'Hiệp hội Logistics / Mạng lưới toàn cầu',
      codeOrYear: 'Hội viên chính thức'
    };
    onChangeCompany({
      ...company,
      affiliations: [...(company.affiliations || []), newAf]
    });
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

  // 4. SERVICE PILLARS HANDLERS
  const handleAddPillar = () => {
    const newPillar: ServicePillarItem = {
      id: `sp-${Date.now()}`,
      title: 'Tên Trụ Cột Dịch Vụ Mới',
      description: 'Mô tả năng lực, phạm vi hoạt động và cam kết chất lượng của dịch vụ...'
    };
    onChangeCompany({
      ...company,
      servicePillars: [...(company.servicePillars || []), newPillar]
    });
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

  // 5. CASE STUDIES HANDLERS
  const handleAddCaseStudy = () => {
    const newCs: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      title: 'Tên Dự Án Logistics Trọng Điểm Mới',
      clientIndustry: 'Ngành Hàng',
      scale: 'Quy Mô / Tuyến Vận Chuyển',
      result: 'Kết quả đạt được (KPI / Tiết kiệm chi phí / Đúng giờ)...',
    };
    onChangeCompany({
      ...company,
      caseStudies: [...(company.caseStudies || []), newCs],
    });
  };

  const handleUpdateCaseStudy = (index: number, field: keyof CaseStudyItem, val: string) => {
    const updated = [...(company.caseStudies || [])];
    updated[index] = { ...updated[index], [field]: val };
    onChangeCompany({ ...company, caseStudies: updated });
  };

  const handleRemoveCaseStudy = (index: number) => {
    const updated = [...(company.caseStudies || [])];
    updated.splice(index, 1);
    onChangeCompany({ ...company, caseStudies: updated });
  };

  // TAG LIST HELPERS
  const handleAddTagItem = (field: 'targetIndustries' | 'carrierPartners' | 'clientLogos' | 'softwareSystems', value: string) => {
    if (!value.trim()) return;
    const currentList = company[field] || [];
    onChangeCompany({
      ...company,
      [field]: [...currentList, value.trim()]
    });
  };

  const handleRemoveTagItem = (field: 'targetIndustries' | 'carrierPartners' | 'clientLogos' | 'softwareSystems', index: number) => {
    const currentList = [...(company[field] || [])];
    currentList.splice(index, 1);
    onChangeCompany({
      ...company,
      [field]: currentList
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* ========================================================= */}
      {/* 0. HERO BANNER: BRAND IDENTITY & GLOBAL CONTACTS          */}
      {/* ========================================================= */}
      <div 
        className="rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` 
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider border border-white/30 backdrop-blur-xs flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Pháp Nhân Doanh Nghiệp Logistics
              </span>
              <span className="text-xs text-white/85 font-semibold">
                Năm thành lập: {company.yearEstablished} • Mã Số Thuế: {company.taxId}
              </span>
            </div>

            {isReadOnly ? (
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">{company.companyName}</h1>
                <p className="text-sm sm:text-base text-white/80 font-semibold mt-0.5">{company.companyNameEn}</p>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <input 
                  type="text"
                  value={company.companyName}
                  onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })}
                  className="w-full text-xl sm:text-2xl font-black bg-white/10 px-3 py-1.5 rounded-xl border border-white/30 text-white outline-hidden placeholder-white/50"
                  placeholder="Tên công ty tiếng Việt (VD: CÔNG TY CỔ PHẦN LOGISTICS QUỐC TẾ VINATRANS)"
                />
                <input 
                  type="text"
                  value={company.companyNameEn}
                  onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })}
                  className="w-full text-xs font-semibold bg-white/10 px-3 py-1 rounded-lg border border-white/20 text-white/90 outline-hidden placeholder-white/50"
                  placeholder="Tên công ty tiếng Anh (Global Trade Name)"
                />
              </div>
            )}

            <div className="pt-1 flex items-center gap-2 text-amber-200">
              <Sparkles className="w-4 h-4 shrink-0" />
              {isReadOnly ? (
                <span className="text-xs sm:text-sm font-semibold italic text-white/95">
                  "{company.companySlogan}"
                </span>
              ) : (
                <input 
                  type="text"
                  value={company.companySlogan}
                  onChange={(e) => onChangeCompany({ ...company, companySlogan: e.target.value })}
                  className="w-full bg-white/10 px-2.5 py-1 rounded-lg text-xs italic text-white border border-white/20 outline-hidden placeholder-white/50"
                  placeholder="Khẩu hiệu / Slogan doanh nghiệp"
                />
              )}
            </div>

            {/* Links & Quick Contact Bar */}
            <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
              {company.websiteUrl && (
                <a 
                  href={company.websiteUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
                >
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
              {company.brochureUrl && (
                <a 
                  href={company.brochureUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1 rounded-lg bg-amber-400/30 hover:bg-amber-400/40 text-amber-100 font-semibold flex items-center gap-1.5 transition-colors border border-amber-300/30"
                >
                  <Download className="w-3.5 h-3.5" /> Company Profile (PDF)
                </a>
              )}
              {company.hotline && (
                <span className="px-3 py-1 rounded-lg bg-white/10 text-white/90 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {company.hotline}
                </span>
              )}
              {company.email && (
                <span className="px-3 py-1 rounded-lg bg-white/10 text-white/90 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {company.email}
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/25 flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0 shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold text-white/70 block tracking-wider">Quy Mô Nhân Sự</span>
              <div className="text-xl font-black text-white mt-0.5">{company.employeeCount || '450+ Nhân sự'}</div>
              <span className="text-[10px] text-emerald-300 font-semibold">Văn phòng & Hub toàn quốc</span>
            </div>
            <div className="h-10 w-px bg-white/20 hidden sm:block" />
            <div>
              <span className="text-[10px] uppercase font-bold text-white/70 block tracking-wider">Sản Lượng Vận Hành</span>
              <div className="text-xl font-black text-white mt-0.5">{company.annualVolume || '120,000+ TEUs'}</div>
              <span className="text-[10px] text-amber-300 font-semibold">Thường niên cam kết</span>
            </div>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* 1. THƯỚC ĐO QUY MÔ & NĂNG LỰC CỐT LÕI (HIGHLIGHT STATS)    */}
      {/* ========================================================= */}
      {visibleSections.myCompany.highlights !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Thước Đo Quy Mô & Năng Lực Cốt Lõi</h3>
                <p className="text-xs text-slate-500 font-medium">Các chỉ số định lượng khẳng định quy mô hạ tầng và năng lực thực thi chuỗi cung ứng</p>
              </div>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddStat}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Chỉ Số
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {(company.companyStats || []).map((stat, idx) => (
              <div 
                key={stat.id || idx}
                className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 shadow-2xs space-y-1 relative group hover:border-indigo-300 transition-all"
              >
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {isReadOnly ? (
                  <>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                      {stat.label}
                    </span>
                    <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {stat.value}
                    </div>
                    {stat.subtext && (
                      <p className="text-[11px] text-indigo-600 font-medium truncate">{stat.subtext}</p>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      value={stat.label}
                      onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                      className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-transparent border-b border-dashed border-slate-300 outline-hidden"
                      placeholder="Tên chỉ số"
                    />
                    <input 
                      type="text" 
                      value={stat.value}
                      onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                      className="w-full text-base font-black text-slate-900 bg-transparent border-b border-dashed border-slate-300 outline-hidden"
                      placeholder="Giá trị (VD: 240+ Xe)"
                    />
                    <input 
                      type="text" 
                      value={stat.subtext || ''}
                      onChange={(e) => handleUpdateStat(idx, 'subtext', e.target.value)}
                      className="w-full text-[11px] text-indigo-600 font-medium bg-transparent border-b border-dashed border-slate-300 outline-hidden"
                      placeholder="Ghi chú thêm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Infrastructure Highlights & Technology Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3 border-t border-slate-100">
            {/* Story / Bio */}
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Tóm Lược Năng Lực & Cam Kết Vận Hành
              </span>
              {isReadOnly ? (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                  {company.companyBio}
                </p>
              ) : (
                <textarea 
                  rows={4}
                  value={company.companyBio}
                  onChange={(e) => onChangeCompany({ ...company, companyBio: e.target.value })}
                  className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl leading-relaxed outline-hidden focus:border-indigo-400"
                  placeholder="Giới thiệu năng lực hoạt động, hệ thống kho bãi, quy trình điều vận của doanh nghiệp..."
                />
              )}
            </div>

            {/* Software Systems */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-600" /> Nền Tảng Công Nghệ & Quản Trị
              </span>
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="space-y-1.5">
                  {(company.softwareSystems || []).map((sys, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70 text-xs text-slate-800">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate">{sys}</span>
                      </div>
                      {!isReadOnly && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveTagItem('softwareSystems', idx)}
                          className="text-slate-400 hover:text-rose-600 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input 
                      type="text"
                      value={newSoftwareTag}
                      onChange={(e) => setNewSoftwareTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTagItem('softwareSystems', newSoftwareTag);
                          setNewSoftwareTag('');
                        }
                      }}
                      placeholder="Thêm hệ thống công nghệ (VD: WMS, TMS GPS)..."
                      className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        handleAddTagItem('softwareSystems', newSoftwareTag);
                        setNewSoftwareTag('');
                      }}
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MẠNG LƯỚI CHI NHÁNH & VĂN PHÒNG TOÀN QUỐC (BRANCHES)    */}
      {/* ========================================================= */}
      {visibleSections.myCompany.branches !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Mạng Lưới Chi Nhánh & Văn Phòng Toàn Quốc</h3>
                <p className="text-xs text-slate-500 font-medium">Mạng lưới hiện diện tại các vùng kinh tế trọng điểm, cảng biển và cửa khẩu</p>
              </div>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddBranch}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Chi Nhánh
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(company.branches || []).map((br, idx) => (
              <div 
                key={br.id || idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-rose-300 transition-all space-y-2 relative group shadow-2xs"
              >
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(idx)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {isReadOnly ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        br.type.includes('Trụ sở') 
                          ? 'bg-rose-100 text-rose-800' 
                          : br.type.includes('Kho') || br.type.includes('Hub')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {br.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{br.city}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{br.address}</p>
                    {br.phone && (
                      <div className="text-[11px] font-bold text-slate-700 pt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Hotline: {br.phone}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <select
                      value={br.type}
                      onChange={(e) => handleUpdateBranch(idx, 'type', e.target.value)}
                      className="w-full text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Trụ sở chính">Trụ sở chính</option>
                      <option value="Chi nhánh">Chi nhánh</option>
                      <option value="Văn phòng cảng/kho">Văn phòng cảng/kho</option>
                      <option value="Hub tiếp nhận & X-Dock">Hub tiếp nhận & X-Dock</option>
                      <option value="Văn phòng đại diện">Văn phòng đại diện</option>
                    </select>
                    <input 
                      type="text"
                      value={br.city}
                      onChange={(e) => handleUpdateBranch(idx, 'city', e.target.value)}
                      className="w-full text-xs font-black text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                      placeholder="Thành phố / Tỉnh (VD: TP. Hồ Chí Minh)"
                    />
                    <textarea 
                      rows={2}
                      value={br.address}
                      onChange={(e) => handleUpdateBranch(idx, 'address', e.target.value)}
                      className="w-full text-xs text-slate-600 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden leading-snug"
                      placeholder="Địa chỉ chi tiết văn phòng / kho bãi"
                    />
                    <input 
                      type="text"
                      value={br.phone || ''}
                      onChange={(e) => handleUpdateBranch(idx, 'phone', e.target.value)}
                      className="w-full text-[11px] text-slate-700 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                      placeholder="Số điện thoại liên hệ"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. THÀNH VIÊN HIỆP HỘI & MẠNG LƯỚI TOÀN CẦU (AFFILIATIONS)  */}
      {/* ========================================================= */}
      {visibleSections.myCompany.affiliations !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Thành Viên Hiệp Hội & Mạng Lưới Toàn Cầu</h3>
                <p className="text-xs text-slate-500 font-medium">Bảo chứng uy tín từ các tổ chức giao nhận, liên đoàn vận tải và chứng chỉ an ninh quốc tế</p>
              </div>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddAffiliation}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Tổ Chức
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(company.affiliations || []).map((af, idx) => (
              <div 
                key={af.id || idx}
                className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50/80 transition-all flex items-start gap-3 relative group shadow-2xs"
              >
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAffiliation(idx)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                  <Award className="w-5 h-5" />
                </div>

                {isReadOnly ? (
                  <div className="space-y-0.5 flex-1 min-w-0 pr-4">
                    <h4 className="text-sm font-black text-blue-950 truncate">{af.name}</h4>
                    <p className="text-xs text-blue-800/80 font-medium">{af.type}</p>
                    {af.codeOrYear && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {af.codeOrYear}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 flex-1 pr-4">
                    <input 
                      type="text"
                      value={af.name}
                      onChange={(e) => handleUpdateAffiliation(idx, 'name', e.target.value)}
                      className="w-full text-xs font-black text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                      placeholder="Tên tổ chức (VD: FIATA, VLA, WCA)"
                    />
                    <input 
                      type="text"
                      value={af.type}
                      onChange={(e) => handleUpdateAffiliation(idx, 'type', e.target.value)}
                      className="w-full text-[11px] text-slate-700 px-2 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                      placeholder="Phân loại / Vai trò tổ chức"
                    />
                    <input 
                      type="text"
                      value={af.codeOrYear || ''}
                      onChange={(e) => handleUpdateAffiliation(idx, 'codeOrYear', e.target.value)}
                      className="w-full text-[10px] font-bold text-blue-800 px-2 py-0.5 bg-white border border-slate-200 rounded-lg outline-hidden"
                      placeholder="Mã hội viên / Chứng nhận"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Licenses & Compliance Badges */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Giấy Phép Vận Tải:</span>
            {(company.licenses || []).map((lic, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {lic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. HỆ SINH THÁI DỊCH VỤ & NGÀNH HÀNG THẾ MẠNH (ECOSYSTEM)  */}
      {/* ========================================================= */}
      {visibleSections.myCompany.ecosystem !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Hệ Sinh Thái Dịch Vụ & Ngành Hàng Thế Mạnh</h3>
                <p className="text-xs text-slate-500 font-medium">Chuỗi giải pháp logistics đầu-cuối tích hợp và kinh nghiệm chuyên sâu theo từng phân khúc ngành</p>
              </div>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddPillar}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Trụ Cột Dịch Vụ
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Core Service Pillars (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                5 Trụ Cột Dịch Vụ Cốt Lõi
              </span>

              <div className="space-y-2.5">
                {(company.servicePillars || []).map((sp, idx) => (
                  <div 
                    key={sp.id || idx}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all relative group shadow-2xs"
                  >
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemovePillar(idx)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isReadOnly ? (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-900">{sp.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{sp.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            #{idx + 1}
                          </span>
                          <input 
                            type="text"
                            value={sp.title}
                            onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)}
                            className="flex-1 text-xs font-black text-slate-900 px-2.5 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                            placeholder="Tên trụ cột dịch vụ (VD: Vận tải FCL & LCL)"
                          />
                        </div>
                        <textarea 
                          rows={2}
                          value={sp.description}
                          onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)}
                          className="w-full text-xs text-slate-600 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden leading-relaxed"
                          placeholder="Mô tả năng lực, trang thiết bị và phạm vi cung ứng..."
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Industries (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Ngành Hàng Chuyên Biệt Phục Vụ
              </span>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/90 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Được chuẩn hóa quy trình SOP vận hành đáp ứng tiêu chuẩn khắt khe cho từng nhóm ngành:
                </p>

                <div className="flex flex-wrap gap-2">
                  {(company.targetIndustries || []).map((ind, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-900 flex items-center gap-1.5 shadow-2xs hover:border-indigo-400 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{ind}</span>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTagItem('targetIndustries', idx)}
                          className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                    <input 
                      type="text"
                      value={newIndustryTag}
                      onChange={(e) => setNewIndustryTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTagItem('targetIndustries', newIndustryTag);
                          setNewIndustryTag('');
                        }
                      }}
                      placeholder="Thêm ngành hàng (VD: Dệt may, Điện tử)..."
                      className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddTagItem('targetIndustries', newIndustryTag);
                        setNewIndustryTag('');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. ĐỐI TÁC CHIẾN LƯỢC & KHÁCH HÀNG TIÊU BIỂU (PARTNERS)    */}
      {/* ========================================================= */}
      {visibleSections.myCompany.partners !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Đối Tác Chiến Lược & Khách Hàng Tiêu Biểu</h3>
                <p className="text-xs text-slate-500 font-medium">Mạng lưới liên minh với các hãng vận tải quốc tế và danh sách các tập đoàn tín nhiệm dịch vụ</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Carrier Partners (Shipping Lines & Airlines) (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hãng Tàu & Hãng Hàng Không Đối Tác
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(company.carrierPartners || []).map((partner, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs hover:border-blue-300 transition-colors"
                    >
                      <span className="truncate">{partner}</span>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTagItem('carrierPartners', idx)}
                          className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <input 
                      type="text"
                      value={newCarrierTag}
                      onChange={(e) => setNewCarrierTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTagItem('carrierPartners', newCarrierTag);
                          setNewCarrierTag('');
                        }
                      }}
                      placeholder="Thêm hãng tàu / airline..."
                      className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddTagItem('carrierPartners', newCarrierTag);
                        setNewCarrierTag('');
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Enterprise Clients (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Khách Hàng Doanh Nghiệp Tiêu Biểu
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(company.clientLogos || []).map((client, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <span className="truncate">{client}</span>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTagItem('clientLogos', idx)}
                          className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <input 
                      type="text"
                      value={newClientTag}
                      onChange={(e) => setNewClientTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTagItem('clientLogos', newClientTag);
                          setNewClientTag('');
                        }
                      }}
                      placeholder="Thêm khách hàng tiêu biểu..."
                      className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddTagItem('clientLogos', newClientTag);
                        setNewClientTag('');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. DỰ ÁN & CASE STUDIES THÀNH CÔNG (FEATURED PROJECTS)     */}
      {/* ========================================================= */}
      {visibleSections.myCompany.caseStudies !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Dự Án Logistics Trọng Điểm & Case Studies Thành Công</h3>
                <p className="text-xs text-slate-500 font-medium">Thành tích thực chiến giải quyết các bài toán vận chuyển quy mô lớn và chuỗi lạnh phức tạp</p>
              </div>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddCaseStudy}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Dự Án
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(company.caseStudies || []).map((cs, idx) => (
              <div 
                key={cs.id || idx} 
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-300 transition-all text-xs space-y-3 relative group shadow-2xs"
              >
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCaseStudy(idx)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {isReadOnly ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-md uppercase tracking-wider">
                        {cs.clientIndustry}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-700">{cs.scale}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">{cs.title}</h4>

                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200 flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cs.result}</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 pr-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={cs.clientIndustry}
                        onChange={(e) => handleUpdateCaseStudy(idx, 'clientIndustry', e.target.value)}
                        className="text-xs font-bold text-indigo-800 px-2.5 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                        placeholder="Ngành hàng (VD: Năng Lượng Tái Tạo)"
                      />
                      <input 
                        type="text"
                        value={cs.scale}
                        onChange={(e) => handleUpdateCaseStudy(idx, 'scale', e.target.value)}
                        className="text-xs font-bold text-slate-700 px-2.5 py-1 bg-white border border-slate-200 rounded-lg outline-hidden"
                        placeholder="Hành trình / Quy mô (VD: Cảng Cát Lái ➔ KCN Phước Đông)"
                      />
                    </div>
                    <input 
                      type="text"
                      value={cs.title}
                      onChange={(e) => handleUpdateCaseStudy(idx, 'title', e.target.value)}
                      className="w-full text-xs font-black text-slate-900 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-hidden"
                      placeholder="Tên dự án logistics trọng điểm"
                    />
                    <textarea 
                      rows={2}
                      value={cs.result}
                      onChange={(e) => handleUpdateCaseStudy(idx, 'result', e.target.value)}
                      className="w-full text-xs text-emerald-900 font-semibold px-2.5 py-1 bg-white border border-emerald-200 rounded-lg outline-hidden"
                      placeholder="KPI / Kết quả đạt được (VD: Tiết kiệm chi phí, an toàn tuyệt đối, đúng hạn 100%)"
                    />
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
