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
  Upload,
  Zap,
  Boxes
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

export const CompanyIndustrialTemplate: React.FC<CompanyTemplateProps> = ({
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

  const handleAddCaseStudy = () => {
    const newCs: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      title: 'Chiến Dịch Vận Tải Mới',
      clientIndustry: 'Ngành Hàng',
      scale: 'Cung đường',
      result: '100% Hoàn thành đúng hạn, an toàn tuyệt đối'
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

  const handleAddBranch = () => {
    const newBr: BranchOfficeItem = {
      id: `br-${Date.now()}`,
      city: 'Hub / Bến Bãi Mới',
      address: 'Địa chỉ kho bãi',
      type: 'Văn phòng cảng/kho',
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

  const handleAddPillar = () => {
    const newPillar: ServicePillarItem = {
      id: `sp-${Date.now()}`,
      title: 'Tên Dịch Vụ Cơ Giới',
      description: 'Mô tả đội xe và quy trình...'
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

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. INDUSTRIAL IMPACT HERO (High Contrast Steel & Amber) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-slate-950 text-white shadow-2xl border-2 border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
            <div 
              onClick={() => !isReadOnly && logoInputRef.current?.click()}
              className={`w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 shadow-inner flex items-center justify-center shrink-0 text-white overflow-hidden relative group ${
                !isReadOnly ? 'cursor-pointer hover:border-amber-400 transition-all' : ''
              }`}
            >
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain p-1.5 bg-white/95 rounded-2xl" />
              ) : (
                <Truck className="w-10 h-10 text-amber-400" />
              )}
              {!isReadOnly && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Camera className="w-5 h-5 mb-0.5 text-amber-400" />
                  <span className="text-[9px] font-bold">Upload</span>
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Năng Lực Cơ Giới & Hạ Tầng Vận Tải
                </span>
                <span className="text-xs text-slate-400">MST: {company.taxId || '---'} • Từ {company.yearEstablished || 2008}</span>
              </div>

              {isReadOnly ? (
                <>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">{company.companyName}</h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-semibold">{company.companyNameEn}</p>
                </>
              ) : (
                <div className="space-y-1">
                  <input type="text" value={company.companyName} onChange={(e) => onChangeCompany({ ...company, companyName: e.target.value })} className="w-full text-xl sm:text-2xl font-black bg-white/10 px-3 py-1 rounded-lg border border-slate-700 text-white outline-hidden" placeholder="Tên công ty" />
                  <input type="text" value={company.companyNameEn} onChange={(e) => onChangeCompany({ ...company, companyNameEn: e.target.value })} className="w-full text-xs bg-white/10 px-2 py-0.5 rounded border border-slate-700 text-slate-300 outline-hidden" placeholder="Trade name" />
                </div>
              )}

              <p className="text-xs text-amber-300 font-bold italic">"{company.companySlogan}"</p>

              <div className="flex flex-wrap gap-2 text-xs pt-1">
                {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 flex items-center gap-1"><Globe className="w-3 h-3" /> Website</a>}
                {company.brochureUrl && <a href={company.brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1"><Download className="w-3 h-3" /> Hồ Sơ Năng Lực (PDF)</a>}
                {company.hotline && <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 font-mono font-bold">{company.hotline}</span>}
              </div>
            </div>
          </div>

          {/* ASSET SPOTLIGHT: FLEET & WAREHOUSES */}
          <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl flex flex-col sm:flex-row gap-5 shrink-0 shadow-lg">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Đội Xe Cơ Giới
              </span>
              <div className="text-2xl font-black text-white mt-0.5">{company.truckFleetCount || '240+ Đầu Xe'}</div>
              <span className="text-[10px] text-slate-400">Container & Tải nặng</span>
            </div>
            <div className="h-12 w-px bg-slate-800 hidden sm:block" />
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block flex items-center gap-1">
                <Warehouse className="w-3.5 h-3.5" /> Hệ Thống Kho
              </span>
              <div className="text-2xl font-black text-white mt-0.5">{company.warehouseArea || '65,000 m²'}</div>
              <span className="text-[10px] text-slate-400">CFS, Bonded & Lạnh</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VERIFIED SLA CASE STUDIES (PROMINENT SPOTLIGHT) */}
      {visibleSections.myCompany.caseStudies !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm">SLA</span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Thực Chiến Tuyến Vận Tải Trọng Điểm</h3>
            </div>
            {!isReadOnly && (
              <button type="button" onClick={handleAddCaseStudy} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Thêm Dự Án
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(company.caseStudies || []).map((cs, idx) => (
              <div key={cs.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group hover:border-emerald-400 transition-all">
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveCaseStudy(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded uppercase">{cs.clientIndustry}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-xs font-bold text-slate-800">{cs.scale}</span>
                </div>
                <h4 className="font-black text-slate-900 text-sm">{cs.title}</h4>
                <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-950 font-bold text-xs flex items-center gap-2 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{cs.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. HEAVY INFRASTRUCTURE HUBS & BRANCHES */}
      {visibleSections.myCompany.branches !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" /> Hệ Thống Hubs Tiếp Nhận, X-Dock & Bến Bãi Cảng
            </h3>
            {!isReadOnly && (
              <button type="button" onClick={handleAddBranch} className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Thêm trạm
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {(company.branches || []).map((br, idx) => (
              <div key={br.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 relative group hover:border-slate-400 transition-all">
                <span className="px-2 py-0.5 bg-slate-800 text-white text-[9px] font-black rounded">{br.type}</span>
                <h4 className="font-black text-slate-900 text-sm mt-1">{br.city}</h4>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{br.address}</p>
                {br.phone && <div className="text-[11px] font-mono font-bold text-slate-700 pt-1">Tel: {br.phone}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INDUSTRIAL LOGISTICS SERVICES */}
      {visibleSections.myCompany.ecosystem !== false && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Boxes className="w-4 h-4 text-blue-600" /> Giải Pháp Dịch Vụ Vận Tải Trọng Lượng Lớn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(company.servicePillars || []).map((sp, idx) => (
              <div key={sp.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-mono text-xs font-black text-amber-600">0{idx + 1} //</span>
                <h4 className="font-black text-slate-900 text-sm">{sp.title}</h4>
                <p className="text-slate-600 leading-relaxed">{sp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
