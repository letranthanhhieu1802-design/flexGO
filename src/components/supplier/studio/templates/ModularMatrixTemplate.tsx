import React from 'react';
import { 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  Trash2, 
  Globe, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  Trophy,
  Heart,
  LayoutGrid
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

export const ModularMatrixTemplate: React.FC<TemplateProps> = ({
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
      company: 'Logistics Matrix Solution',
      position: 'Freight Operations Lead',
      period: '2023 - Hiện tại',
      description: 'Điều hành các tuyến FCL/LCL chủ lực và mở rộng dịch vụ kho bãi...',
      keyAchievement: 'Tăng trưởng 30% volume hàng xuất khẩu Bắc Mỹ.',
    };
    onChangeProfile({
      ...profile,
      experiences: [newExp, ...profile.experiences],
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = [...profile.experiences];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, experiences: updated });
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: 'Đại Học Giao Thông Vận Tải TP.HCM',
      degree: 'Kỹ Sư Kinh Tế Vận Tải',
      period: '2016 - 2020',
      honors: 'Tốt nghiệp Loại Giỏi',
    };
    onChangeProfile({ ...profile, educations: [...profile.educations, newEdu] });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = [...profile.educations];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, educations: updated });
  };

  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'FIATA International Freight Forwarder Certificate',
      issuer: 'FIATA Federation',
      year: '2023',
      code: 'FIATA-FWD-2023',
    };
    onChangeProfile({ ...profile, certifications: [...profile.certifications, newCert] });
  };

  const handleRemoveCertification = (index: number) => {
    const updated = [...profile.certifications];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, certifications: updated });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      
      {/* 1. HERO PROFILE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative shrink-0">
          <div 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-white"
            style={{ backgroundColor: theme.primary }}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{profile.avatarInitial || 'TM'}</span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-xl shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-3 flex-1 text-center md:text-left w-full">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span 
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
            >
              <LayoutGrid className="w-3 h-3 inline mr-1" /> Modular Matrix Profile
            </span>
            <span className="text-xs text-slate-400">• Chuyên Viên Logistics Cấp Cao</span>
          </div>

          {isReadOnly ? (
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{profile.name}</h1>
              <p className="text-sm font-bold text-slate-600">{profile.vietnameseName}</p>
              <p className="text-sm font-bold mt-1" style={{ color: theme.secondary }}>{profile.title}</p>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <input 
                type="text"
                value={profile.name}
                onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                className="w-full text-xl font-black text-slate-950 border-b border-slate-200 pb-1 outline-hidden"
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
                  placeholder="Chức Danh"
                />
              </div>
            </div>
          )}

          {profile.motto && (
            <p className="text-xs italic text-slate-600 leading-relaxed">
              "{profile.motto}"
            </p>
          )}

          {/* Quick Contact Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> {profile.phone}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Mail className="w-3.5 h-3.5 text-blue-600" /> {profile.email}
            </span>
            {profile.workingHours && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {profile.workingHours}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. HIGHLIGHT STATS MATRIX (4 Ô TO BẢN) */}
      {visibleSections.myProfile.highlightStats !== false && profile.highlightStats && profile.highlightStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {profile.highlightStats.map((st) => (
            <div 
              key={st.id} 
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-center space-y-1 hover:border-slate-300 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-black" style={{ color: theme.primary }}>{st.value}</div>
              <div className="text-xs font-bold text-slate-900">{st.label}</div>
              {st.subtext && <div className="text-[10px] text-slate-400">{st.subtext}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 3. TWO COLUMNS MATRIX: EXPERIENCES (LEFT) & CREDENTIALS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (7 COLS): WORK EXPERIENCE CARD */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Quá Trình Công Tác & Dự Án
            </h3>
            {!isReadOnly && (
              <button 
                onClick={handleAddExperience}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm mốc
              </button>
            )}
          </div>

          <div className="space-y-4">
            {profile.experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-black text-slate-950">{exp.position}</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[11px] font-black px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
                    >
                      {exp.period}
                    </span>
                    {!isReadOnly && (
                      <button onClick={() => handleRemoveExperience(index)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-600">{exp.company}</div>
                <p className="text-xs leading-relaxed text-slate-600">{exp.description}</p>

                {exp.keyAchievement && (
                  <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 p-2 rounded-xl flex items-start gap-1.5 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Thành tích:</strong> {exp.keyAchievement}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bio block inside Left Card */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Giới Thiệu Chuyên Môn</h4>
            <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* RIGHT (5 COLS): STACK OF MINI CARDS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card A: Certifications */}
          {visibleSections.myProfile.certifications !== false && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> Chứng Chỉ Quốc Tế
                </h3>
                {!isReadOnly && (
                  <button onClick={handleAddCertification} className="text-[10px] font-bold text-blue-600 hover:underline">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-0.5">
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="text-[11px] text-slate-500">{cert.issuer}</div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Năm: {cert.year}</span>
                      {cert.code && <span className="font-mono font-bold text-blue-600">{cert.code}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card B: Skills & Languages */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            {visibleSections.myProfile.skills !== false && profile.skills && profile.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Kỹ Năng Cốt Lõi
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((sk, idx) => (
                    <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {visibleSections.myProfile.languages !== false && profile.languages && profile.languages.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" /> Ngôn Ngữ Thương Mại
                </h3>
                <div className="space-y-1">
                  {profile.languages.map((l, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card C: Education */}
          {visibleSections.myProfile.educations !== false && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" /> Học Vấn
                </h3>
                {!isReadOnly && (
                  <button onClick={handleAddEducation} className="text-[10px] font-bold text-blue-600 hover:underline">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-0.5">
                    <div className="font-bold text-slate-900">{edu.school}</div>
                    <div className="text-slate-600">{edu.degree}</div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>{edu.period}</span>
                      {edu.honors && <span className="font-semibold text-emerald-600">{edu.honors}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. FREIGHT SPECIALTIES & TARGET INDUSTRIES CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {visibleSections.myProfile.specialties !== false && profile.specialties && profile.specialties.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" /> Tuyến Dịch Vụ Vận Tải Thế Mạnh
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profile.specialties.map((spec, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                  <span className="truncate">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleSections.myProfile.targetIndustries !== false && (
          <div className="pt-4 border-t border-slate-100">
            <IndustryVerticalsSection
              targetIndustries={profile.targetIndustries}
              onChangeIndustries={(newIndustries) => onChangeProfile({ ...profile, targetIndustries: newIndustries })}
              isReadOnly={isReadOnly}
            />
          </div>
        )}
      </div>

      {/* 5. AWARDS & HOBBIES CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visibleSections.myProfile.awards !== false && profile.awards && profile.awards.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Giải Thưởng Vinh Danh
            </h3>
            <div className="space-y-2">
              {profile.awards.map((aw) => (
                <div key={aw.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-0.5">
                  <div className="font-bold text-amber-950 flex justify-between">
                    <span>{aw.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 font-bold">{aw.year}</span>
                  </div>
                  <div className="text-amber-800 text-[11px]">{aw.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleSections.myProfile.hobbies !== false && profile.hobbies && profile.hobbies.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Heart className="w-4 h-4 text-rose-500" /> Phong Cách & Sở Thích
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.hobbies.map((h, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
