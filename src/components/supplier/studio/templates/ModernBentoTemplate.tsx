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
  Globe, 
  Clock, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { 
  SalemanPersonalProfile, 
  StudioTemplateConfig, 
  THEME_COLOR_OPTIONS,
  WorkExperienceItem,
  EducationItem,
  CertificationItem
} from '../studioTypes';
import { IndustryVerticalsSection } from '../IndustryVerticalsSection';

interface TemplateProps {
  profile: SalemanPersonalProfile;
  onChangeProfile: (profile: SalemanPersonalProfile) => void;
  config: StudioTemplateConfig;
  isReadOnly?: boolean;
}

export const ModernBentoTemplate: React.FC<TemplateProps> = ({
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
      description: 'Mô tả tóm tắt vai trò và tuyến hàng...',
      keyAchievement: 'Thành tích đạt được...',
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
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Bento Grid: 12 Columns layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* CARD 1: Identity & Profile Hero (8 cols) */}
        <div 
          className="md:col-span-8 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 border-2 border-white/40 shadow-xl flex items-center justify-center text-3xl font-black shrink-0 overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{profile.avatarInitial || 'TM'}</span>
              )}
            </div>

            <div className="space-y-2 flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-black uppercase rounded-full tracking-wider border border-white/30">
                  Verified Specialist
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-950 text-[10px] font-black uppercase rounded-full">
                  Sẵn Sàng Tư Vấn
                </span>
              </div>

              {isReadOnly ? (
                <div>
                  <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
                  <p className="text-xs text-white/80 font-semibold">{profile.vietnameseName}</p>
                  <p className="text-xs text-white/90 font-medium mt-1">{profile.title}</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                    className="w-full text-xl font-black bg-white/10 px-3 py-1 rounded-lg border border-white/30 text-white outline-hidden"
                    placeholder="Họ tên tiếng Anh"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text"
                      value={profile.vietnameseName}
                      onChange={(e) => onChangeProfile({ ...profile, vietnameseName: e.target.value })}
                      className="w-full text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20 text-white outline-hidden"
                      placeholder="Tên tiếng Việt"
                    />
                    <input 
                      type="text"
                      value={profile.title}
                      onChange={(e) => onChangeProfile({ ...profile, title: e.target.value })}
                      className="w-full text-xs bg-white/10 px-2 py-1 rounded-lg border border-white/20 text-white outline-hidden"
                      placeholder="Chức vụ chuyên môn"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Slogan Banner */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            {isReadOnly ? (
              <p className="text-xs sm:text-sm font-semibold italic text-white/95">
                "{profile.motto}"
              </p>
            ) : (
              <input 
                type="text"
                value={profile.motto}
                onChange={(e) => onChangeProfile({ ...profile, motto: e.target.value })}
                className="w-full bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold italic text-white border border-white/20 outline-hidden"
                placeholder="Nhập slogan / cam kết phục vụ..."
              />
            )}
          </div>
        </div>

        {/* CARD 2: Direct Contact Box (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Kênh Tư Vấn 24/7
            </span>
            <h3 className="text-base font-black text-slate-900">Liên Hệ Trực Tiếp</h3>
            <p className="text-xs text-slate-500 mt-1">Phản hồi báo giá RFQ trong 15 phút</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              {isReadOnly ? (
                <span className="font-bold text-slate-900">{profile.phone}</span>
              ) : (
                <input 
                  type="text"
                  value={profile.phone}
                  onChange={(e) => onChangeProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-transparent font-bold text-xs text-slate-900 outline-hidden"
                />
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              {isReadOnly ? (
                <span className="font-medium text-slate-700 truncate">{profile.email}</span>
              ) : (
                <input 
                  type="text"
                  value={profile.email}
                  onChange={(e) => onChangeProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-transparent text-xs text-slate-700 outline-hidden"
                />
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] text-slate-600">{profile.workingHours || '08:00 - 21:00'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: theme.secondary }}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi Hotline Ngay</span>
            </button>
          </div>
        </div>

        {/* CARD 3: Flex Highlight Stats (12 cols) */}
        {visibleSections.myProfile.highlightStats && (
          <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profile.highlightStats.map((stat, idx) => (
              <div 
                key={stat.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs text-center flex flex-col justify-center items-center hover:shadow-md transition-shadow"
              >
                <div className="text-xl sm:text-2xl font-black" style={{ color: theme.secondary }}>
                  {stat.value}
                </div>
                <div className="text-xs font-black text-slate-800 mt-1">{stat.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{stat.subtext}</div>
              </div>
            ))}
          </div>
        )}

        {/* CARD 4: Professional Bio (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Tiểu Sử Chuyên Môn & Năng Lực Cố Vấn</span>
          </div>
          {isReadOnly ? (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.bio}
            </p>
          ) : (
            <textarea 
              rows={4}
              value={profile.bio}
              onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden leading-relaxed"
            />
          )}

          {/* Specialties Pills */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Thị Trường Thế Mạnh</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.specialties.map((spec, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                  style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
                >
                  ✓ {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 5: Certifications & Education (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Bằng Cấp & Chứng Chỉ Quốc Tế</span>
          </div>

          <div className="space-y-2.5">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">{cert.name}</div>
                  <div className="text-[10px] text-slate-500">{cert.issuer} • {cert.year}</div>
                </div>
              </div>
            ))}

            {profile.educations.map((edu) => (
              <div key={edu.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">{edu.school}</div>
                  <div className="text-[10px] text-slate-500">{edu.degree} ({edu.period})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD: Target Industries (Nhóm Ngành Hàng Chuyên Sâu) */}
        {visibleSections.myProfile.targetIndustries !== false && (
          <div className="md:col-span-12">
            <IndustryVerticalsSection
              selectedIndustryIds={profile.targetIndustries || []}
              onChange={(newIds) => onChangeProfile({ ...profile, targetIndustries: newIds })}
              isReadOnly={isReadOnly}
              theme={theme}
            />
          </div>
        )}

        {/* CARD 6: Work Experiences Timeline (12 cols) */}
        {visibleSections.myProfile.experiences && (
          <div className="md:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Quá Trình Công Tác & Dự Án Đã Thực Hiện</span>
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Mốc
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {profile.experiences.map((exp, idx) => (
                <div 
                  key={exp.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex flex-col justify-between space-y-2 relative group"
                >
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase block">{exp.period}</span>
                    <h4 className="text-sm font-black text-slate-900 mt-1">{exp.position}</h4>
                    <p className="text-xs font-bold text-slate-700">{exp.company}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                  {exp.keyAchievement && (
                    <div className="p-2 rounded-xl bg-emerald-50 text-[11px] font-semibold text-emerald-900 border border-emerald-200">
                      ★ {exp.keyAchievement}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
