import React from 'react';
import { 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  Trophy,
  CheckCircle2,
  AlertCircle
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

export const SpeedHunterTemplate: React.FC<TemplateProps> = ({
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
      company: 'Tập Đoàn Logistics Nhanh Toàn Cầu',
      position: 'Senior Sales Deal Hunter',
      period: '2023 - Hiện tại',
      description: 'Chuyên trách chốt cước hỏa tốc FCL/LCL và giải quyết nhu cầu vận chuyển cấp bách...',
      keyAchievement: 'Tỷ lệ chốt deal thành công đạt 78%, phản hồi RFQ trung bình dưới 6 phút.',
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
      honors: 'Tốt nghiệp',
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
      name: 'FMC Bonded NVOCC Freight Specialist',
      issuer: 'Federal Maritime Commission',
      year: '2023',
      code: 'FMC-NVOCC-2023',
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
      
      {/* ============================================================ */}
      {/* TIER 1: HERO ACTION BAR (TỐI ƯU HÓA CHUYỂN ĐỔI NHANH)        */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
        
        {/* Top SLA Alert Strip */}
        <div 
          className="px-6 py-2.5 text-white flex flex-wrap items-center justify-between gap-3 text-xs font-bold"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Đang trực tuyến sẵn sàng báo giá</span>
          </div>

          <div className="flex items-center gap-2 text-amber-300">
            <Clock className="w-4 h-4" />
            <span>Cam kết SLA: Phản hồi báo giá trong 5 - 10 phút</span>
          </div>
        </div>

        {/* Hero Profile Body */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <div 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-lg flex items-center justify-center text-3xl font-black text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.avatarInitial || 'TM'}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  ⚡ Deal Closer
                </span>
                <span className="text-xs text-slate-400">• Chuyên Viên Báo Giá Cước Tốc Độ</span>
              </div>

              {isReadOnly ? (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{profile.name}</h1>
                  <p className="text-sm font-bold text-slate-600">{profile.vietnameseName}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: theme.secondary }}>{profile.title}</p>
                </div>
              ) : (
                <div className="space-y-1 pt-1">
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
                <div className="text-xs italic text-slate-600 max-w-md pt-1">
                  "{profile.motto}"
                </div>
              )}
            </div>
          </div>

          {/* Direct CTA Buttons Box */}
          <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <a 
              href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
              className="px-6 py-3 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-102 transition-all text-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Phone className="w-4 h-4" /> Gọi Báo Cước Ngay ({profile.phone})
            </a>

            <a 
              href={`https://zalo.me/${profile.zaloPhone || profile.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 transition-colors text-center"
            >
              <Zap className="w-4 h-4 text-blue-600" /> Nhắn Zalo Chốt Giá Sớm
            </a>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* TIER 2: HOT FREIGHT LANES & STATS (THẾ MẠNH & SẢN LƯỢNG)     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Highlight Stats (5 cols) */}
        {visibleSections.myProfile.highlightStats !== false && profile.highlightStats && profile.highlightStats.length > 0 && (
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            {profile.highlightStats.map((st) => (
              <div 
                key={st.id} 
                className="bg-white rounded-3xl border border-slate-200 p-4 text-center shadow-xs space-y-1 hover:border-slate-300 transition-colors"
              >
                <div className="text-2xl font-black" style={{ color: theme.primary }}>{st.value}</div>
                <div className="text-xs font-bold text-slate-900 leading-tight">{st.label}</div>
                {st.subtext && <div className="text-[10px] text-slate-400">{st.subtext}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Hot Freight Lanes (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-500" /> Các Tuyến Vận Tải Thế Mạnh Giá Sàn
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Có Chỗ Sẵn
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.specialties && profile.specialties.slice(0, 6).map((spec, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="truncate">{spec}</span>
              </div>
            ))}
          </div>

          {/* 3 Cam Kết Vận Tải */}
          <div className="pt-2 grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-600 text-center">
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              ✓ Bảo đảm vỏ 100%
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              ✓ Cước trực tiếp hãng tàu
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              ✓ Bảo hiểm rủi ro SLA
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* TIER 3: WORK EXPERIENCE & VERIFIED CREDENTIALS (UY TÍN)      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kinh nghiệm làm việc (7 cols) */}
        {visibleSections.myProfile.experiences !== false && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Hồ Sơ Dự Án Đã Thực Hiện
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
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
                    <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl flex items-start gap-1.5 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span><strong>Kết quả:</strong> {exp.keyAchievement}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase">Tóm Tắt Năng Lực</div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {profile.bio}
              </p>
            </div>
          </div>
        )}

        {/* Chứng chỉ, Học vấn & Kỹ năng (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Certifications */}
          {visibleSections.myProfile.certifications !== false && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> Bằng Cấp & Chứng Chỉ
                </h3>
                {!isReadOnly && (
                  <button onClick={handleAddCertification} className="text-[10px] font-bold text-blue-600 hover:underline">
                    + Thêm
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-0.5">
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="text-slate-500 text-[11px]">{cert.issuer}</div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Năm cấp: {cert.year}</span>
                      {cert.code && <span className="font-mono text-blue-600 font-bold">{cert.code}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {visibleSections.myProfile.educations !== false && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
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
                    <div className="text-[10px] text-slate-400">{edu.period}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kỹ Năng & Ngôn Ngữ */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Zap className="w-4 h-4 text-amber-500" /> Kỹ Năng Đàm Phán & Chốt Deal
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills && profile.skills.map((sk, idx) => (
                <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Awards */}
          {visibleSections.myProfile.awards !== false && profile.awards && profile.awards.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Thành Tích Nổi Bật
              </h3>
              <div className="space-y-2">
                {profile.awards.map((aw) => (
                  <div key={aw.id} className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-0.5">
                    <div className="font-bold text-amber-950 flex justify-between">
                      <span>{aw.title}</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-amber-200 font-bold">{aw.year}</span>
                    </div>
                    <div className="text-amber-800 text-[11px]">{aw.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Target Industries */}
      {visibleSections.myProfile.targetIndustries !== false && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <IndustryVerticalsSection
            targetIndustries={profile.targetIndustries}
            onChangeIndustries={(newIndustries) => onChangeProfile({ ...profile, targetIndustries: newIndustries })}
            isReadOnly={isReadOnly}
          />
        </div>
      )}

    </div>
  );
};
