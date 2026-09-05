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
  Check
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

export const MinimalistTemplate: React.FC<TemplateProps> = ({
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
      company: 'Tên Công Ty Logistics',
      position: 'Vị Trí Đảm Nhiệm',
      period: '2023 - Hiện tại',
      description: 'Mô tả tóm tắt vai trò và các tuyến hàng phụ trách...',
      keyAchievement: 'Thành tựu nổi bật...',
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
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-14 space-y-10 animate-in fade-in duration-150 text-slate-800">
      
      {/* Top Header: Classic 1-Column Header */}
      <div className="border-b border-slate-200 pb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              Verified Logistics Specialist
            </span>
            <span className="text-xs text-slate-400">• Hồ Sơ Năng Lực 2025</span>
          </div>

          {isReadOnly ? (
            <div>
              <h1 className="text-3xl font-black text-slate-950 tracking-tight">{profile.name}</h1>
              <p className="text-sm font-bold text-slate-600 mt-0.5">{profile.vietnameseName}</p>
              <p className="text-sm font-semibold mt-1" style={{ color: theme.secondary }}>{profile.title}</p>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <input 
                type="text"
                value={profile.name}
                onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                className="w-full text-2xl font-black text-slate-950 border-b border-slate-300 pb-1 outline-hidden"
                placeholder="Họ Tên Quốc Tế"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text"
                  value={profile.vietnameseName}
                  onChange={(e) => onChangeProfile({ ...profile, vietnameseName: e.target.value })}
                  className="w-full text-xs font-semibold text-slate-600 border-b border-slate-200 pb-1 outline-hidden"
                  placeholder="Tên Tiếng Việt"
                />
                <input 
                  type="text"
                  value={profile.title}
                  onChange={(e) => onChangeProfile({ ...profile, title: e.target.value })}
                  className="w-full text-xs font-bold border-b border-slate-200 pb-1 outline-hidden"
                  style={{ color: theme.secondary }}
                  placeholder="Chức Vụ"
                />
              </div>
            </div>
          )}

          {/* Contact Strip */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <strong>{profile.phone}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{profile.email}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{profile.workingHours || '08:00 - 21:00'}</span>
            </span>
          </div>
        </div>

        {/* Minimal Avatar */}
        <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl font-black shrink-0 overflow-hidden shadow-xs" style={{ color: theme.primary }}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <span>{profile.avatarInitial || 'TM'}</span>
          )}
        </div>
      </div>

      {/* Motto */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <span className="text-[10px] font-black uppercase tracking-wider block mb-1" style={{ color: theme.secondary }}>
          Tuyên Ngôn Phục Vụ
        </span>
        {isReadOnly ? (
          <p className="text-sm font-semibold italic text-slate-800">"{profile.motto}"</p>
        ) : (
          <input 
            type="text"
            value={profile.motto}
            onChange={(e) => onChangeProfile({ ...profile, motto: e.target.value })}
            className="w-full bg-white p-2 rounded-lg text-xs font-semibold italic text-slate-800 border border-slate-200"
          />
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Giới Thiệu Chuyên Môn</h3>
        {isReadOnly ? (
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
        ) : (
          <textarea 
            rows={3}
            value={profile.bio}
            onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
            className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
          />
        )}
      </div>

      {/* Flex Stats */}
      {visibleSections.myProfile.highlightStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100">
          {profile.highlightStats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-xl font-black" style={{ color: theme.primary }}>{stat.value}</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-slate-400">{stat.subtext}</div>
            </div>
          ))}
        </div>
      )}

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
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Quá Trình Công Tác & Dự Án</h3>
            {!isReadOnly && (
              <button 
                type="button" 
                onClick={handleAddExperience}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                + Thêm kinh nghiệm
              </button>
            )}
          </div>

          <div className="space-y-6">
            {profile.experiences.map((exp, idx) => (
              <div key={exp.id} className="space-y-1 relative group">
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveExperience(idx)}
                    className="absolute top-0 right-0 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="flex items-baseline justify-between">
                  <h4 className="text-sm font-black text-slate-900">{exp.position}</h4>
                  <span className="text-xs font-medium text-slate-400">{exp.period}</span>
                </div>
                <div className="text-xs font-bold text-slate-700">{exp.company}</div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
                {exp.keyAchievement && (
                  <div className="mt-1 text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{exp.keyAchievement}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications 2-Col Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Học Vấn & Đào Tạo</h3>
          <div className="space-y-3">
            {profile.educations.map((edu) => (
              <div key={edu.id}>
                <div className="font-black text-slate-900">{edu.school}</div>
                <div className="text-slate-600">{edu.degree}</div>
                <div className="text-[10px] text-slate-400">{edu.period} • {edu.honors}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Chứng Chỉ Quốc Tế</h3>
          <div className="space-y-3">
            {profile.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="font-black text-slate-900">{cert.name}</div>
                <div className="text-[10px] text-slate-500">{cert.issuer} • Năm {cert.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
