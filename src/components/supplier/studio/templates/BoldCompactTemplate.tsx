import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles,
  ShieldCheck,
  QrCode,
  Share2
} from 'lucide-react';
import { 
  SalemanPersonalProfile, 
  StudioTemplateConfig, 
  THEME_COLOR_OPTIONS,
  WorkExperienceItem
} from '../studioTypes';
import { IndustryVerticalsSection } from '../IndustryVerticalsSection';

interface TemplateProps {
  profile: SalemanPersonalProfile;
  onChangeProfile: (profile: SalemanPersonalProfile) => void;
  config: StudioTemplateConfig;
  isReadOnly?: boolean;
}

export const BoldCompactTemplate: React.FC<TemplateProps> = ({
  profile,
  onChangeProfile,
  config,
  isReadOnly = false,
}) => {
  const theme = THEME_COLOR_OPTIONS[config.themeColor];
  const { visibleSections } = config;

  const handleAddExperience = () => {
    const newExp: WorkExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Công Ty Mới',
      position: 'Vị Trí Công Tác',
      period: '2023 - Hiện tại',
      description: 'Mô tả tóm tắt vai trò và năng lực...',
    };
    onChangeProfile({
      ...profile,
      experiences: [newExp, ...profile.experiences],
    });
  };

  const handleUpdateExperience = (index: number, field: keyof WorkExperienceItem, val: string) => {
    const updated = [...profile.experiences];
    updated[index] = { ...updated[index], [field]: val };
    onChangeProfile({ ...profile, experiences: updated });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = [...profile.experiences];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, experiences: updated });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-150">
      
      {/* 1. Punchy Curved Header Banner with Gradient */}
      <div 
        className="p-6 sm:p-10 text-white relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` 
        }}
      >
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 border-4 border-white/50 shadow-2xl flex items-center justify-center text-3xl font-black shrink-0 overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{profile.avatarInitial || 'TM'}</span>
            )}
          </div>

          <div className="space-y-1">
            <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider border border-white/30">
              Verified Saleman Profile
            </span>
            {isReadOnly ? (
              <div>
                <h1 className="text-2xl sm:text-3xl font-black">{profile.name}</h1>
                <p className="text-xs text-white/80 font-semibold">{profile.vietnameseName}</p>
                <p className="text-xs sm:text-sm text-white/95 font-medium mt-1">{profile.title}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <input 
                  type="text"
                  value={profile.name}
                  onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                  className="text-xl font-black bg-white/10 px-2 py-0.5 rounded border border-white/30 text-white outline-hidden"
                />
                <input 
                  type="text"
                  value={profile.title}
                  onChange={(e) => onChangeProfile({ ...profile, title: e.target.value })}
                  className="w-full text-xs bg-white/10 px-2 py-0.5 rounded border border-white/20 text-white outline-hidden block"
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Connect Badge with QR simulation */}
        <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/30 flex items-center gap-3 shrink-0">
          <div className="w-14 h-14 bg-white rounded-xl p-1 shadow-inner flex items-center justify-center">
            <QrCode className="w-12 h-12 text-slate-900" />
          </div>
          <div className="text-xs">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Quét Zalo / Danh Thiếp</span>
            <div className="font-bold text-white mt-0.5">{profile.phone}</div>
            <span className="text-[10px] text-emerald-300 font-semibold">● Trực tuyến 24/7</span>
          </div>
        </div>
      </div>

      {/* 2. Compact Flex Numbers Bar */}
      {visibleSections.myProfile.highlightStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border-b border-slate-200">
          {profile.highlightStats.map((stat) => (
            <div key={stat.id} className="bg-white p-4 text-center">
              <div className="text-lg font-black" style={{ color: theme.secondary }}>{stat.value}</div>
              <div className="text-xs font-bold text-slate-800">{stat.label}</div>
              <div className="text-[10px] text-slate-400">{stat.subtext}</div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Main Content Split */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
        
        {/* Left Column: Bio & Experience (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Slogan */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs sm:text-sm font-bold italic text-slate-800">
              "{profile.motto}"
            </p>
          </div>

          {/* Bio */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Tiểu Sử & Năng Lực</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Target Industries (Nhóm Ngành Hàng Chuyên Sâu) */}
          {visibleSections.myProfile.targetIndustries !== false && (
            <IndustryVerticalsSection
              selectedIndustryIds={profile.targetIndustries || []}
              onChange={(newIds) => onChangeProfile({ ...profile, targetIndustries: newIds })}
              isReadOnly={isReadOnly}
              theme={theme}
            />
          )}

          {/* Work Experiences */}
          {visibleSections.myProfile.experiences && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Kinh Nghiệm & Thành Tích</h3>
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={handleAddExperience}
                    className="text-xs font-bold text-indigo-600 cursor-pointer"
                  >
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profile.experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 relative group">
                    {!isReadOnly && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveExperience(idx)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{exp.position} • <strong className="text-indigo-600">{exp.company}</strong></span>
                      <span className="text-[10px] text-slate-400">{exp.period}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{exp.description}</p>
                    {exp.keyAchievement && (
                      <div className="text-[11px] font-semibold text-emerald-800 pt-0.5">
                        ★ {exp.keyAchievement}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Contact, Certs, Specialties (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Kênh Kết Nối</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 truncate">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{profile.workingHours}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Chứng Chỉ Quốc Tế</h3>
            <div className="space-y-2 text-xs">
              {profile.certifications.map((cert) => (
                <div key={cert.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">{cert.name}</div>
                  <div className="text-[10px] text-slate-500">{cert.issuer} • {cert.year}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Thế Mạnh Chuyên Sâu</h3>
            <div className="flex flex-wrap gap-1">
              {profile.specialties.map((spec, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {spec}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
