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
  Heart
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

export const GrandBannerTemplate: React.FC<TemplateProps> = ({
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
      company: 'VinaTrans Global Logistics',
      position: 'Senior Key Account Manager',
      period: '2023 - Hiện tại',
      description: 'Phụ trách đàm phán hợp đồng khối doanh nghiệp và tuyến Bắc Mỹ...',
      keyAchievement: 'Vượt 120% chỉ tiêu doanh thu thường niên.',
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
      school: 'Đại Học Hàng Hải Việt Nam',
      degree: 'Cử Nhân Kinh Tế Vận Tải Biển',
      period: '2015 - 2019',
      honors: 'Tốt nghiệp Xuất sắc',
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
      name: 'FIATA Certificate in Customs Procedures',
      issuer: 'FIATA International Federation',
      year: '2023',
      code: 'FIATA-CUS-2023',
    };
    onChangeProfile({ ...profile, certifications: [...profile.certifications, newCert] });
  };

  const handleRemoveCertification = (index: number) => {
    const updated = [...profile.certifications];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, certifications: updated });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-200 text-slate-800">
      
      {/* ============================================================ */}
      {/* 1. TOP HERO HEADER BANNER: RỘNG 100%, DẢI MÀU CHỦ ĐẠO NỔI BẬT*/}
      {/* ============================================================ */}
      <div 
        className="p-8 sm:p-12 text-white relative overflow-hidden"
        style={{ backgroundColor: theme.primary }}
      >
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Large Avatar */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white/20 border-4 border-white/60 shadow-2xl overflow-hidden flex items-center justify-center text-4xl font-black">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{profile.avatarInitial || 'TM'}</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full shadow-md">
              Verified
            </div>
          </div>

          {/* Profile Name & Title */}
          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/20 border border-white/30 text-[10px] font-black uppercase tracking-wider">
                Grand Flagship Profile
              </span>
              <span className="text-xs text-white/80">• Chuyên Gia Chuỗi Cung Ứng Toàn Cầu</span>
            </div>

            {isReadOnly ? (
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{profile.name}</h1>
                <p className="text-base font-semibold text-white/90">{profile.vietnameseName}</p>
                <p className="text-sm font-bold text-amber-300 mt-1 uppercase tracking-wide">{profile.title}</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-slate-900 max-w-xl">
                <input 
                  type="text"
                  value={profile.name}
                  onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                  className="w-full text-2xl font-black bg-white/95 rounded-lg px-3 py-1 outline-hidden"
                  placeholder="Họ Tên Quốc Tế"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={profile.vietnameseName}
                    onChange={(e) => onChangeProfile({ ...profile, vietnameseName: e.target.value })}
                    className="w-full text-xs font-semibold bg-white/90 rounded-lg px-2 py-1 outline-hidden"
                    placeholder="Tên Tiếng Việt"
                  />
                  <input 
                    type="text"
                    value={profile.title}
                    onChange={(e) => onChangeProfile({ ...profile, title: e.target.value })}
                    className="w-full text-xs font-bold bg-white/90 rounded-lg px-2 py-1 outline-hidden"
                    placeholder="Chức Danh"
                  />
                </div>
              </div>
            )}

            {/* Slogan */}
            {profile.motto && (
              <div className="text-xs sm:text-sm italic text-white/90 max-w-2xl bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
                "{profile.motto}"
              </div>
            )}

            {/* Horizontal Contact Pills Strip */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 text-xs">
              <div className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full border border-white/20 transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-bold">{profile.phone}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full border border-white/20 transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-medium truncate max-w-[200px]">{profile.email}</span>
              </div>

              {profile.workingHours && (
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{profile.workingHours}</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. THÂN BỐ CỤC: 2 CỘT CÂN BẰNG (50% / 50%)                   */}
      {/* ============================================================ */}
      <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* --- CỘT TRÁI (LEFT COLUMN): KINH NGHIỆM & SỐ LIỆU --- */}
        <div className="space-y-8">
          
          {/* Bio Block */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Tổng Quan Năng Lực Cốt Lõi
            </h3>
            {isReadOnly ? (
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {profile.bio}
              </p>
            ) : (
              <textarea 
                value={profile.bio}
                onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 outline-hidden"
              />
            )}
          </div>

          {/* 4 Số Liệu Thành Tích */}
          {visibleSections.myProfile.highlightStats !== false && profile.highlightStats && profile.highlightStats.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {profile.highlightStats.map((st) => (
                <div 
                  key={st.id} 
                  className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 text-center space-y-1 shadow-xs"
                >
                  <div className="text-2xl font-black" style={{ color: theme.primary }}>{st.value}</div>
                  <div className="text-xs font-bold text-slate-800">{st.label}</div>
                  {st.subtext && <div className="text-[10px] text-slate-400">{st.subtext}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Quá Trình Kinh Nghiệm (Timeline) */}
          {visibleSections.myProfile.experiences !== false && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
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
                  <div key={exp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5 relative">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-black text-slate-950">{exp.position}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
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
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span><strong>Thành tích:</strong> {exp.keyAchievement}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ngành Hàng Mục Tiêu (Industry Verticals) */}
          {visibleSections.myProfile.targetIndustries !== false && (
            <div className="pt-2">
              <IndustryVerticalsSection
                targetIndustries={profile.targetIndustries}
                onChangeIndustries={(newIndustries) => onChangeProfile({ ...profile, targetIndustries: newIndustries })}
                isReadOnly={isReadOnly}
              />
            </div>
          )}

        </div>

        {/* --- CỘT PHẢI (RIGHT COLUMN): CHỨNG CHỈ, HỌC VẤN & KỸ NĂNG --- */}
        <div className="space-y-8">
          
          {/* Chứng Chỉ Quốc Tế */}
          {visibleSections.myProfile.certifications !== false && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Bằng Cấp & Chứng Chỉ Quốc Tế
                </h3>
                {!isReadOnly && (
                  <button onClick={handleAddCertification} className="text-xs font-bold text-blue-600 hover:underline">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{cert.name}</div>
                    <div className="text-slate-600 text-xs">{cert.issuer}</div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Năm cấp: {cert.year}</span>
                      {cert.code && <span className="font-mono font-bold text-blue-600">{cert.code}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kỹ Năng Chuyên Môn */}
          {visibleSections.myProfile.skills !== false && profile.skills && profile.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Zap className="w-4 h-4 text-amber-500" /> Kỹ Năng & Giải Pháp
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((sk, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tuyến Hàng Thế Mạnh */}
          {visibleSections.myProfile.specialties !== false && profile.specialties && profile.specialties.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Target className="w-4 h-4 text-emerald-600" /> Tuyến Hàng Vận Tải Thế Mạnh
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.specialties.map((spec, i) => (
                  <div key={i} className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Học Vấn */}
          {visibleSections.myProfile.educations !== false && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" /> Trình Độ Học Vấn
                </h3>
                {!isReadOnly && (
                  <button onClick={handleAddEducation} className="text-xs font-bold text-blue-600 hover:underline">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
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

          {/* Ngôn Ngữ & Sở Thích */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {visibleSections.myProfile.languages !== false && profile.languages && profile.languages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> Ngôn Ngữ
                </h4>
                <div className="space-y-1">
                  {profile.languages.map((l, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visibleSections.myProfile.hobbies !== false && profile.hobbies && profile.hobbies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Sở Thích
                </h4>
                <div className="flex flex-wrap gap-1">
                  {profile.hobbies.map((h, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Giải Thưởng */}
          {visibleSections.myProfile.awards !== false && profile.awards && profile.awards.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Giải Thưởng & Vinh Danh
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

        </div>

      </div>

    </div>
  );
};
