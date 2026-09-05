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
  Heart,
  ChevronRight
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

export const PrimeExperienceTemplate: React.FC<TemplateProps> = ({
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
      company: 'Tập Đoàn Logistics & Giao Nhận',
      position: 'Trưởng Nhóm Giải Pháp Vận Tải',
      period: '2023 - Hiện tại',
      description: 'Chịu trách nhiệm tư vấn giải pháp cước và hợp đồng logistics...',
      keyAchievement: 'Mở rộng 35 khách hàng doanh nghiệp sản xuất FDI.',
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
      school: 'Đại Học Ngoại Thương',
      degree: 'Cử Nhân Kinh Tế Quốc Tế',
      period: '2016 - 2020',
      honors: 'Hạng Ưu',
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
      name: 'IATA Dangerous Goods Regulations (DGR)',
      issuer: 'Hiệp hội Vận tải Hàng không Quốc tế (IATA)',
      year: '2023',
      code: 'IATA-DG-2023',
    };
    onChangeProfile({ ...profile, certifications: [...profile.certifications, newCert] });
  };

  const handleRemoveCertification = (index: number) => {
    const updated = [...profile.certifications];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, certifications: updated });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200 text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* ============================================================ */}
        {/* 1. CỘT CHÍNH BÊN TRÁI: ƯU TIÊN KINH NGHIỆM THỰC CHIẾN (65%)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-8">
          
          {/* Top Header Card */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: theme.primary }}
              >
                Prime Experience
              </span>
              <span className="text-xs font-semibold text-slate-500">• Bề Dày Kinh Nghiệm & Thành Tích</span>
            </div>

            {isReadOnly ? (
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">{profile.name}</h1>
                <p className="text-base font-bold text-slate-600">{profile.vietnameseName}</p>
                <p className="text-sm font-bold mt-1" style={{ color: theme.secondary }}>{profile.title}</p>
              </div>
            ) : (
              <div className="space-y-2">
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
                    placeholder="Chức Danh"
                  />
                </div>
              </div>
            )}

            {/* Slogan Quote Box */}
            {profile.motto && (
              <div 
                className="p-4 rounded-2xl border-l-4 text-xs italic font-medium leading-relaxed bg-slate-50 text-slate-700"
                style={{ borderColor: theme.primary }}
              >
                "{profile.motto}"
              </div>
            )}

            {/* Bio */}
            <div className="text-sm leading-relaxed text-slate-600">
              {isReadOnly ? (
                profile.bio
              ) : (
                <textarea 
                  value={profile.bio}
                  onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-hidden"
                />
              )}
            </div>
          </div>

          {/* 4 Chỉ Số Nổi Bật (Highlight Stats) */}
          {visibleSections.myProfile.highlightStats !== false && profile.highlightStats && profile.highlightStats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {profile.highlightStats.map((st) => (
                <div 
                  key={st.id} 
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs text-center space-y-1 hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl font-black" style={{ color: theme.primary }}>{st.value}</div>
                  <div className="text-xs font-bold text-slate-800">{st.label}</div>
                  {st.subtext && <div className="text-[10px] text-slate-400">{st.subtext}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Quá Trình Kinh Nghiệm (Timeline Trực Quan) */}
          {visibleSections.myProfile.experiences !== false && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" /> Hành Trình Kinh Nghiệm & Dự Án
                </h3>
                {!isReadOnly && (
                  <button 
                    onClick={handleAddExperience}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm mốc
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profile.experiences.map((exp, index) => (
                  <div 
                    key={exp.id} 
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-2 relative"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-black text-slate-950">{exp.position}</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-black px-2.5 py-0.5 rounded-full"
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

                    <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {exp.company}
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600">
                      {exp.description}
                    </p>

                    {exp.keyAchievement && (
                      <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold">Thành tựu cốt lõi: </span>
                          <span>{exp.keyAchievement}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tuyến Dịch Vụ Thế Mạnh */}
          {visibleSections.myProfile.specialties !== false && profile.specialties && profile.specialties.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" /> Tuyến Hàng Vận Tải Chủ Lực
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.specialties.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                    <span className="truncate pr-2">{spec}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ngành Hàng Mục Tiêu (Industry Verticals) */}
          {visibleSections.myProfile.targetIndustries !== false && (
            <div className="pt-4 border-t border-slate-100">
              <IndustryVerticalsSection
                targetIndustries={profile.targetIndustries}
                onChangeIndustries={(newIndustries) => onChangeProfile({ ...profile, targetIndustries: newIndustries })}
                isReadOnly={isReadOnly}
              />
            </div>
          )}

          {/* Giải Thưởng & Vinh Danh */}
          {visibleSections.myProfile.awards !== false && profile.awards && profile.awards.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Giải Thưởng Vinh Danh
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.awards.map((aw) => (
                  <div key={aw.id} className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs space-y-1">
                    <div className="font-bold text-amber-950 flex justify-between">
                      <span>{aw.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 font-black">{aw.year}</span>
                    </div>
                    <div className="text-amber-800 text-[11px]">{aw.issuer}</div>
                    {aw.description && <div className="text-slate-600 text-[11px]">{aw.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* 2. SIDEBAR PHỤ BÊN PHẢI: NỀN XÁM NHẸ SANG TRỌNG (35%)       */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 sm:p-8 space-y-6">
          
          {/* Squircle Avatar */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div 
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.avatarInitial || 'TM'}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs font-black uppercase text-slate-400">Logistics Verified</div>
              <div className="text-sm font-black text-slate-900">{profile.vietnameseName}</div>
            </div>
          </div>

          {/* Card Thông Tin Liên Hệ Trực Tiếp */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> Kết Nối Nhanh
            </h4>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] text-slate-400">Hotline / Zalo</div>
                  <div className="font-bold text-slate-900">{profile.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] text-slate-400">Email</div>
                  <div className="font-bold text-slate-900 truncate">{profile.email}</div>
                </div>
              </div>

              {profile.workingHours && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">Giờ Làm Việc</div>
                    <div className="font-semibold text-slate-800">{profile.workingHours}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <a 
              href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full mt-2 py-2 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity text-center block"
              style={{ backgroundColor: theme.primary }}
            >
              <Phone className="w-3.5 h-3.5" /> Gọi Tư Vấn Báo Giá
            </a>
          </div>

          {/* Chứng Chỉ Quốc Tế */}
          {visibleSections.myProfile.certifications !== false && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Chứng Chỉ Quốc Tế
                </h4>
                {!isReadOnly && (
                  <button onClick={handleAddCertification} className="text-[10px] font-bold text-blue-600 hover:underline">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="text-[11px] text-slate-500">{cert.issuer}</div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Năm: {cert.year}</span>
                      {cert.code && <span className="font-mono text-blue-600 font-bold">{cert.code}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kỹ Năng & Ngôn Ngữ */}
          {visibleSections.myProfile.skills !== false && profile.skills && profile.skills.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Kỹ Năng Thực Chiến
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((sk, idx) => (
                  <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ngôn Ngữ */}
          {visibleSections.myProfile.languages !== false && profile.languages && profile.languages.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Ngoại Ngữ Thương Mại
              </h4>
              <div className="space-y-1.5">
                {profile.languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800 truncate">{lang}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">Thành thạo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Học Vấn */}
          {visibleSections.myProfile.educations !== false && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Trình Độ Học Vấn
                </h4>
                {!isReadOnly && (
                  <button onClick={handleAddEducation} className="text-[10px] font-bold text-blue-600 hover:underline">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-0.5 shadow-2xs">
                    <div className="font-bold text-slate-900">{edu.school}</div>
                    <div className="text-slate-600 text-[11px]">{edu.degree}</div>
                    <div className="text-[10px] text-slate-400">{edu.period}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sở Thích */}
          {visibleSections.myProfile.hobbies !== false && profile.hobbies && profile.hobbies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Phong Cách & Sở Thích
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.hobbies.map((h, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] font-black uppercase text-slate-800 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-blue-600" /> Danh Thiếp Số
              </div>
              <div className="text-[10px] text-slate-400">Lưu danh bạ tức thì</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center font-black">
              GO
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
