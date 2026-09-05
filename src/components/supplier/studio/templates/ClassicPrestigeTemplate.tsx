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
  QrCode,
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

export const ClassicPrestigeTemplate: React.FC<TemplateProps> = ({
  profile,
  onChangeProfile,
  config,
  isReadOnly = false,
}) => {
  const theme = THEME_COLOR_OPTIONS[config.themeColor];
  const { visibleSections } = config;

  // Handlers
  const handleAddExperience = () => {
    const newExp: WorkExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Công Ty Logistics Quốc Tế',
      position: 'Senior Key Account Manager',
      period: '2023 - Hiện tại',
      description: 'Điều phối các hợp đồng vận tải FCL/LCL, quản trị tuyến dịch vụ...',
      keyAchievement: 'Đạt doanh số 100% KPI cam kết thường niên.',
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

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: 'Trường Đại Học Kinh Tế / Hàng Hải',
      degree: 'Cử Nhân Kinh Tế Ngoại Thương / Logistics',
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
      name: 'FIATA Higher Diploma in Supply Chain Management',
      issuer: 'Hiệp hội Giao nhận Vận tải Quốc tế (FIATA)',
      year: '2022',
      code: 'FIATA-VN-889',
    };
    onChangeProfile({ ...profile, certifications: [...profile.certifications, newCert] });
  };

  const handleRemoveCertification = (index: number) => {
    const updated = [...profile.certifications];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, certifications: updated });
  };

  // Mock percentage for skill bars
  const skillPercentages = [95, 90, 88, 92, 85, 89];

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* ============================================================ */}
        {/* 1. SIDEBAR TRÁI: NỀN MÀU CHỦ ĐẠO TƯƠNG PHẢN CAO (4/12 COLS) */}
        {/* ============================================================ */}
        <div 
          className="lg:col-span-4 p-6 sm:p-8 text-white flex flex-col justify-between space-y-8 relative"
          style={{ backgroundColor: theme.primary }}
        >
          {/* Subtle patterned overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />

          <div className="relative z-10 space-y-7">
            
            {/* Avatar & Online status */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/20 border-4 border-white/60 shadow-xl overflow-hidden flex items-center justify-center text-3xl font-black">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profile.avatarInitial || 'TM'}</span>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white shadow-sm flex items-center justify-center" title="Đang trực tuyến">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-1 w-full">
                {isReadOnly ? (
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">{profile.name}</h2>
                    <p className="text-sm font-semibold text-white/80">{profile.vietnameseName}</p>
                    <p className="text-xs font-bold text-amber-300 mt-1 uppercase tracking-wider">{profile.title}</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-slate-900">
                    <input 
                      type="text"
                      value={profile.name}
                      onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                      className="w-full text-center text-lg font-black bg-white/90 rounded-lg px-2 py-1 outline-hidden"
                      placeholder="Họ Tên Quốc Tế"
                    />
                    <input 
                      type="text"
                      value={profile.vietnameseName}
                      onChange={(e) => onChangeProfile({ ...profile, vietnameseName: e.target.value })}
                      className="w-full text-center text-xs font-medium bg-white/90 rounded-lg px-2 py-0.5 outline-hidden"
                      placeholder="Họ Tên Tiếng Việt"
                    />
                    <input 
                      type="text"
                      value={profile.title}
                      onChange={(e) => onChangeProfile({ ...profile, title: e.target.value })}
                      className="w-full text-center text-xs font-semibold bg-white/90 rounded-lg px-2 py-0.5 outline-hidden"
                      placeholder="Chức Danh Nghề Nghiệp"
                    />
                  </div>
                )}
              </div>

              {/* Personal Slogan / Motto */}
              {profile.motto && (
                <div className="w-full bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-xs italic text-white/90 leading-relaxed text-center">
                  "{profile.motto}"
                </div>
              )}
            </div>

            {/* Quick Contact Block */}
            <div className="border-t border-white/20 pt-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Thông Tin Kết Nối
              </h3>
              
              <div className="space-y-2 text-xs text-white/90">
                <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 p-2 rounded-xl transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-white/60">Hotline / Zalo</div>
                    <div className="font-bold">{profile.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 p-2 rounded-xl transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-white/60">Email Doanh Nghiệp</div>
                    <div className="font-bold truncate">{profile.email}</div>
                  </div>
                </div>

                {profile.workingHours && (
                  <div className="flex items-center gap-2.5 bg-white/10 p-2 rounded-xl">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-white/60">Giờ Phục Vụ SLA</div>
                      <div className="font-bold">{profile.workingHours}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills with Progress Bars */}
            {visibleSections.myProfile.skills !== false && profile.skills && profile.skills.length > 0 && (
              <div className="border-t border-white/20 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Kỹ Năng Chuyên Môn
                  </h3>
                  <span className="text-[10px] text-white/60">Đánh giá SLA</span>
                </div>

                <div className="space-y-2.5">
                  {profile.skills.slice(0, 5).map((sk, idx) => {
                    const pct = skillPercentages[idx % skillPercentages.length];
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="truncate pr-2">{sk}</span>
                          <span className="text-[10px] font-bold text-amber-300">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Languages with 5-dot ratings */}
            {visibleSections.myProfile.languages !== false && profile.languages && profile.languages.length > 0 && (
              <div className="border-t border-white/20 pt-5 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Ngôn Ngữ Thương Mại
                </h3>
                <div className="space-y-2 text-xs">
                  {profile.languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-white/90 truncate pr-2">{lang}</span>
                      <div className="flex gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <span 
                            key={dot} 
                            className={`w-1.5 h-1.5 rounded-full ${dot <= (idx === 0 ? 5 : 4) ? 'bg-amber-400' : 'bg-white/30'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies / Sở thích */}
            {visibleSections.myProfile.hobbies !== false && profile.hobbies && profile.hobbies.length > 0 && (
              <div className="border-t border-white/20 pt-5 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Phong Cách & Sở Thích
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.hobbies.map((h, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/90 border border-white/20">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Bottom QR Zalo Badge */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between bg-black/20 p-2.5 rounded-2xl">
            <div className="space-y-0.5">
              <div className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                <QrCode className="w-3 h-3" /> Danh Thiếp Số
              </div>
              <div className="text-[10px] text-white/70">Quét Zalo kết nối tức thì</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center text-slate-900 font-black text-[9px]">
              flexGO
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. THÂN CHÍNH BÊN PHẢI: NỀN TRẮNG THOÁNG ĐÃNG (8/12 COLS)    */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-8 bg-white text-slate-800">
          
          {/* Header Tagline & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span 
                className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1"
                style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Chuyên Viên Xác Thực
              </span>
              <span className="text-xs text-slate-400">• Hồ Sơ B2B flexGO</span>
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Cam kết dịch vụ: <span className="font-bold text-slate-900">SLA 24/7</span>
            </div>
          </div>

          {/* Giới thiệu tóm tắt (Bio) */}
          <div className="space-y-2">
            <h3 
              className="text-base font-black uppercase tracking-wider flex items-center gap-2 border-l-4 pl-3"
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              Hồ Sơ Năng Lực & Kinh Nghiệm
            </h3>
            {isReadOnly ? (
              <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {profile.bio}
              </p>
            ) : (
              <textarea 
                value={profile.bio}
                onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full text-sm leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 outline-hidden focus:border-blue-600"
                placeholder="Mô tả tóm tắt kinh nghiệm và năng lực chuyên môn..."
              />
            )}
          </div>

          {/* Khối 4 Số Liệu Thành Tích (Highlight Stats) */}
          {visibleSections.myProfile.highlightStats !== false && profile.highlightStats && profile.highlightStats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {profile.highlightStats.map((st) => (
                <div 
                  key={st.id} 
                  className="p-3.5 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-xs hover:border-slate-300 transition-all text-center space-y-1"
                >
                  <div className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.primary }}>
                    {st.value}
                  </div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">{st.label}</div>
                  {st.subtext && <div className="text-[10px] text-slate-400">{st.subtext}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Tuyến Hàng & Dịch Vụ Thế Mạnh */}
          {visibleSections.myProfile.specialties !== false && profile.specialties && profile.specialties.length > 0 && (
            <div className="space-y-3">
              <h3 
                className="text-base font-black uppercase tracking-wider flex items-center gap-2 border-l-4 pl-3"
                style={{ borderColor: theme.primary, color: theme.primary }}
              >
                <Target className="w-4 h-4" /> Tuyến Dịch Vụ Thế Mạnh
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.specialties.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dòng Thời Gian Kinh Nghiệm (Timeline Trục Dọc) */}
          {visibleSections.myProfile.experiences !== false && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 
                  className="text-base font-black uppercase tracking-wider flex items-center gap-2 border-l-4 pl-3"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  <Briefcase className="w-4 h-4" /> Quá Trình Công Tác & Dự Án
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

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {profile.experiences.map((exp, index) => (
                  <div key={exp.id} className="relative group space-y-1.5">
                    {/* Circle dot on vertical line */}
                    <div 
                      className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: theme.primary }}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{exp.position}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {exp.period}
                        </span>
                      </div>

                      {!isReadOnly && (
                        <button 
                          onClick={() => handleRemoveExperience(index)}
                          className="text-rose-500 hover:text-rose-700 p-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="text-xs font-bold text-blue-900" style={{ color: theme.secondary }}>
                      {exp.company}
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600">
                      {exp.description}
                    </p>

                    {exp.keyAchievement && (
                      <div className="text-xs bg-amber-50/80 border border-amber-200/80 text-amber-900 p-2 rounded-xl flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-semibold">Thành tích: {exp.keyAchievement}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Học Vấn & Chứng Chỉ (2 Cột Cân Bằng) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            
            {/* Học vấn */}
            {visibleSections.myProfile.educations !== false && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-600" /> Trình Độ Học Vấn
                  </h4>
                  {!isReadOnly && (
                    <button onClick={handleAddEducation} className="text-[10px] font-bold text-blue-600 hover:underline">
                      + Thêm
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {profile.educations.map((edu) => (
                    <div key={edu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{edu.school}</div>
                      <div className="text-slate-600">{edu.degree}</div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{edu.period}</span>
                        {edu.honors && <span className="font-semibold text-emerald-600">{edu.honors}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chứng chỉ nghề nghiệp */}
            {visibleSections.myProfile.certifications !== false && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> Chứng Chỉ Quốc Tế
                  </h4>
                  {!isReadOnly && (
                    <button onClick={handleAddCertification} className="text-[10px] font-bold text-blue-600 hover:underline">
                      + Thêm
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{cert.name}</div>
                      <div className="text-slate-600 text-[11px]">{cert.issuer}</div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Năm cấp: {cert.year}</span>
                        {cert.code && <span className="font-mono text-blue-600 font-bold">{cert.code}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Ngành hàng phục vụ (Industry Verticals) */}
          {visibleSections.myProfile.targetIndustries !== false && (
            <div className="pt-2 border-t border-slate-100">
              <IndustryVerticalsSection
                targetIndustries={profile.targetIndustries}
                onChangeIndustries={(newIndustries) => onChangeProfile({ ...profile, targetIndustries: newIndustries })}
                isReadOnly={isReadOnly}
              />
            </div>
          )}

          {/* Giải thưởng / Thành tựu */}
          {visibleSections.myProfile.awards !== false && profile.awards && profile.awards.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 
                className="text-base font-black uppercase tracking-wider flex items-center gap-2 border-l-4 pl-3"
                style={{ borderColor: theme.primary, color: theme.primary }}
              >
                <Trophy className="w-4 h-4 text-amber-500" /> Giải Thưởng & Vinh Danh
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.awards.map((aw) => (
                  <div key={aw.id} className="p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-2xl text-xs space-y-1">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span>{aw.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 font-black">{aw.year}</span>
                    </div>
                    <div className="text-amber-800/80 text-[11px]">{aw.issuer}</div>
                    {aw.description && <div className="text-slate-600 text-[11px] mt-1">{aw.description}</div>}
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
