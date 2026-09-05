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

export const CleanEleganceTemplate: React.FC<TemplateProps> = ({
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
      company: 'Công Ty Quản Lý Chuỗi Cung Ứng',
      position: 'Chuyên Viên Cố Vấn Logistics Cấp Cao',
      period: '2023 - Hiện tại',
      description: 'Chịu trách nhiệm thiết kế giải pháp vận tải đa phương thức...',
      keyAchievement: 'Tối ưu 18% chi phí logistics tổng thể cho khách hàng FDI.',
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
      school: 'Đại Học Kinh Tế Quốc Dân',
      degree: 'Cử Nhân Quản Trị Logistics & Chuỗi Cung Ứng',
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
      name: 'CSCP - Certified Supply Chain Professional',
      issuer: 'APICS / ASCM Association',
      year: '2023',
      code: 'APICS-CSCP-2023',
    };
    onChangeProfile({ ...profile, certifications: [...profile.certifications, newCert] });
  };

  const handleRemoveCertification = (index: number) => {
    const updated = [...profile.certifications];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, certifications: updated });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-14 space-y-9 animate-in fade-in duration-200 text-slate-800">
      
      {/* 1. Header: Clean Harvard Centered/Aligned Header */}
      <div className="border-b border-slate-200 pb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span 
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
            >
              Hồ Sơ Năng Lực Chuẩn Mực
            </span>
            <span className="text-xs text-slate-400">• flexGO Clean Elegance</span>
          </div>

          {isReadOnly ? (
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">{profile.name}</h1>
              <p className="text-sm font-bold text-slate-600 mt-0.5">{profile.vietnameseName}</p>
              <p className="text-sm font-bold mt-1" style={{ color: theme.secondary }}>{profile.title}</p>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <input 
                type="text"
                value={profile.name}
                onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                className="w-full text-2xl sm:text-3xl font-black text-slate-950 border-b border-slate-200 pb-1 outline-hidden"
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
            <div className="text-xs italic text-slate-600 max-w-xl pt-1">
              "{profile.motto}"
            </div>
          )}

          {/* Contact Strip */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-bold text-slate-900">
              <Phone className="w-3.5 h-3.5" style={{ color: theme.primary }} /> {profile.phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" style={{ color: theme.primary }} /> {profile.email}
            </span>
            {profile.workingHours && (
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" style={{ color: theme.primary }} /> {profile.workingHours}
              </span>
            )}
          </div>
        </div>

        {/* Refined Circular Avatar */}
        <div className="shrink-0">
          <div 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-300 shadow-md flex items-center justify-center text-3xl font-black text-white"
            style={{ backgroundColor: theme.primary }}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{profile.avatarInitial || 'TM'}</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Professional Summary (Tóm tắt hồ sơ) */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
          Tóm Tắt Năng Lực Chuyên Môn
        </h3>
        {isReadOnly ? (
          <p className="text-sm leading-relaxed text-slate-700">
            {profile.bio}
          </p>
        ) : (
          <textarea 
            value={profile.bio}
            onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
            rows={3}
            className="w-full text-sm leading-relaxed p-3 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
          />
        )}
      </div>

      {/* 3. Highlight Stats (4 số liệu hàng ngang tinh giản) */}
      {visibleSections.myProfile.highlightStats !== false && profile.highlightStats && profile.highlightStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-200">
          {profile.highlightStats.map((st) => (
            <div key={st.id} className="text-center space-y-0.5">
              <div className="text-2xl font-black" style={{ color: theme.primary }}>{st.value}</div>
              <div className="text-xs font-bold text-slate-800">{st.label}</div>
              {st.subtext && <div className="text-[10px] text-slate-400">{st.subtext}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 4. Quá Trình Kinh Nghiệm (Work Experience Linear Rows) */}
      {visibleSections.myProfile.experiences !== false && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" style={{ color: theme.primary }} /> Quá Trình Công Tác & Kinh Nghiệm
            </h3>
            {!isReadOnly && (
              <button 
                onClick={handleAddExperience}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm mốc
              </button>
            )}
          </div>

          <div className="space-y-5">
            {profile.experiences.map((exp, index) => (
              <div key={exp.id} className="space-y-1.5 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-base font-bold text-slate-950">{exp.position}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">{exp.period}</span>
                    {!isReadOnly && (
                      <button onClick={() => handleRemoveExperience(index)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-700">{exp.company}</div>
                <p className="text-xs leading-relaxed text-slate-600">{exp.description}</p>

                {exp.keyAchievement && (
                  <div className="text-xs text-slate-800 bg-slate-50 border-l-2 p-2 rounded-r-lg font-medium flex items-center gap-1.5" style={{ borderColor: theme.primary }}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Thành tựu: {exp.keyAchievement}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Học Vấn & Chứng Chỉ (2 Cột Thanh Lịch) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
        
        {/* Học Vấn */}
        {visibleSections.myProfile.educations !== false && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" style={{ color: theme.primary }} /> Trình Độ Học Vấn
              </h3>
              {!isReadOnly && (
                <button onClick={handleAddEducation} className="text-xs font-bold text-blue-600 hover:underline">
                  + Thêm
                </button>
              )}
            </div>

            <div className="space-y-3">
              {profile.educations.map((edu) => (
                <div key={edu.id} className="space-y-0.5 text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{edu.school}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{edu.period}</span>
                  </div>
                  <div className="text-slate-600">{edu.degree}</div>
                  {edu.honors && <div className="text-[10px] text-emerald-600 font-semibold">{edu.honors}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chứng Chỉ Quốc Tế */}
        {visibleSections.myProfile.certifications !== false && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4" style={{ color: theme.primary }} /> Chứng Chỉ Quốc Tế
              </h3>
              {!isReadOnly && (
                <button onClick={handleAddCertification} className="text-xs font-bold text-blue-600 hover:underline">
                  + Thêm
                </button>
              )}
            </div>

            <div className="space-y-3">
              {profile.certifications.map((cert) => (
                <div key={cert.id} className="space-y-0.5 text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{cert.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{cert.year}</span>
                  </div>
                  <div className="text-slate-600">{cert.issuer}</div>
                  {cert.code && <div className="text-[10px] font-mono text-blue-600">{cert.code}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 6. Kỹ Năng & Tuyến Dịch Vụ Thế Mạnh */}
      <div className="space-y-4 pt-2">
        {visibleSections.myProfile.specialties !== false && profile.specialties && profile.specialties.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" /> Tuyến Dịch Vụ Thế Mạnh
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((spec, i) => (
                <span key={i} className="text-xs font-medium px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleSections.myProfile.skills !== false && profile.skills && profile.skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Kỹ Năng Thực Chiến
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((sk, idx) => (
                <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. Ngành Hàng Mục Tiêu */}
      {visibleSections.myProfile.targetIndustries !== false && (
        <div className="pt-2 border-t border-slate-200">
          <IndustryVerticalsSection
            targetIndustries={profile.targetIndustries}
            onChangeIndustries={(newIndustries) => onChangeProfile({ ...profile, targetIndustries: newIndustries })}
            isReadOnly={isReadOnly}
          />
        </div>
      )}

      {/* 8. Ngôn Ngữ, Sở Thích & Giải Thưởng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-200">
        {visibleSections.myProfile.languages !== false && profile.languages && profile.languages.length > 0 && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-600" /> Ngôn Ngữ
            </h4>
            <div className="space-y-1 text-slate-600">
              {profile.languages.map((l, i) => <div key={i}>• {l}</div>)}
            </div>
          </div>
        )}

        {visibleSections.myProfile.hobbies !== false && profile.hobbies && profile.hobbies.length > 0 && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Sở Thích
            </h4>
            <div className="space-y-1 text-slate-600">
              {profile.hobbies.map((h, i) => <div key={i}>• {h}</div>)}
            </div>
          </div>
        )}

        {visibleSections.myProfile.awards !== false && profile.awards && profile.awards.length > 0 && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Giải Thưởng
            </h4>
            <div className="space-y-1 text-slate-600">
              {profile.awards.map((aw) => (
                <div key={aw.id} className="font-medium text-slate-900">
                  ★ {aw.title} ({aw.year})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
