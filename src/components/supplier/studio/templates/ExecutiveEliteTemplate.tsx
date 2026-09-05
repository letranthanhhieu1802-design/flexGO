import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Clock, 
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
  X,
  Heart,
  Zap,
  Trophy
} from 'lucide-react';
import { 
  SalemanPersonalProfile, 
  StudioTemplateConfig, 
  THEME_COLOR_OPTIONS,
  WorkExperienceItem,
  EducationItem,
  CertificationItem,
  HighlightStatItem,
  AwardItem
} from '../studioTypes';
import { IndustryVerticalsSection } from '../IndustryVerticalsSection';

interface TemplateProps {
  profile: SalemanPersonalProfile;
  onChangeProfile: (profile: SalemanPersonalProfile) => void;
  config: StudioTemplateConfig;
  isReadOnly?: boolean;
}

export const ExecutiveEliteTemplate: React.FC<TemplateProps> = ({
  profile,
  onChangeProfile,
  config,
  isReadOnly = false,
}) => {
  const theme = THEME_COLOR_OPTIONS[config.themeColor];
  const { visibleSections } = config;

  // Handlers for dynamic items
  const handleAddExperience = () => {
    const newExp: WorkExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Tên Công Ty Logistics Mới',
      position: 'Vị Trí Đảm Nhiệm',
      period: '2023 - Hiện tại',
      description: 'Mô tả tóm tắt vai trò và các tuyến hàng phụ trách...',
      keyAchievement: 'Thành tích nổi bật: Doanh số / Sản lượng / Dự án...',
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
      school: 'Tên Trường Đại Học / Học Viện',
      degree: 'Cử Nhân / Thạc Sĩ Chuyên Ngành',
      period: '2015 - 2019',
      honors: 'Tốt nghiệp',
    };
    onChangeProfile({
      ...profile,
      educations: [...profile.educations, newEdu],
    });
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, val: string) => {
    const updated = [...profile.educations];
    updated[index] = { ...updated[index], [field]: val };
    onChangeProfile({ ...profile, educations: updated });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = [...profile.educations];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, educations: updated });
  };

  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Chứng chỉ chuyên môn mới (VD: FIATA, IATA...)',
      issuer: 'Tổ chức cấp',
      year: '2024',
    };
    onChangeProfile({
      ...profile,
      certifications: [...profile.certifications, newCert],
    });
  };

  const handleUpdateCert = (index: number, field: keyof CertificationItem, val: string) => {
    const updated = [...profile.certifications];
    updated[index] = { ...updated[index], [field]: val };
    onChangeProfile({ ...profile, certifications: updated });
  };

  const handleRemoveCert = (index: number) => {
    const updated = [...profile.certifications];
    updated.splice(index, 1);
    onChangeProfile({ ...profile, certifications: updated });
  };

  // State & Handlers for Languages
  const [showAddLang, setShowAddLang] = React.useState(false);
  const [newLangInput, setNewLangInput] = React.useState('');

  const handleAddLanguage = () => {
    if (!newLangInput.trim()) return;
    const currentLangs = profile.languages || [];
    if (!currentLangs.includes(newLangInput.trim())) {
      onChangeProfile({
        ...profile,
        languages: [...currentLangs, newLangInput.trim()]
      });
    }
    setNewLangInput('');
    setShowAddLang(false);
  };

  const handleRemoveLanguage = (idx: number) => {
    const updated = (profile.languages || []).filter((_, i) => i !== idx);
    onChangeProfile({ ...profile, languages: updated });
  };

  // State & Handlers for Skills
  const [showAddSkill, setShowAddSkill] = React.useState(false);
  const [newSkillInput, setNewSkillInput] = React.useState('');

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const currentSkills = profile.skills || [];
    if (!currentSkills.includes(newSkillInput.trim())) {
      onChangeProfile({
        ...profile,
        skills: [...currentSkills, newSkillInput.trim()]
      });
    }
    setNewSkillInput('');
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (idx: number) => {
    const updated = (profile.skills || []).filter((_, i) => i !== idx);
    onChangeProfile({ ...profile, skills: updated });
  };

  // State & Handlers for Hobbies
  const [showAddHobby, setShowAddHobby] = React.useState(false);
  const [newHobbyInput, setNewHobbyInput] = React.useState('');

  const handleAddHobby = () => {
    if (!newHobbyInput.trim()) return;
    const currentHobbies = profile.hobbies || [];
    if (!currentHobbies.includes(newHobbyInput.trim())) {
      onChangeProfile({
        ...profile,
        hobbies: [...currentHobbies, newHobbyInput.trim()]
      });
    }
    setNewHobbyInput('');
    setShowAddHobby(false);
  };

  const handleRemoveHobby = (idx: number) => {
    const updated = (profile.hobbies || []).filter((_, i) => i !== idx);
    onChangeProfile({ ...profile, hobbies: updated });
  };

  // Handlers for Awards
  const handleAddAward = () => {
    const newAward: AwardItem = {
      id: `award-${Date.now()}`,
      title: 'Tên giải thưởng / thành tích vinh danh mới',
      issuer: 'Tổ chức / Doanh nghiệp trao tặng',
      year: new Date().getFullYear().toString(),
      description: 'Mô tả tóm tắt đóng góp hoặc thành tích đạt được...'
    };
    onChangeProfile({
      ...profile,
      awards: [newAward, ...(profile.awards || [])]
    });
  };

  const handleUpdateAward = (idx: number, field: keyof AwardItem, val: string) => {
    const updated = [...(profile.awards || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    onChangeProfile({ ...profile, awards: updated });
  };

  const handleRemoveAward = (idx: number) => {
    const updated = (profile.awards || []).filter((_, i) => i !== idx);
    onChangeProfile({ ...profile, awards: updated });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-150">
      
      {/* 2-Column Split: Left Sidebar (35%) & Right Content (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[850px]">
        
        {/* =====================================================================
            LEFT SIDEBAR: Contact, Education, Certs, Skills, Languages
        ===================================================================== */}
        <div 
          className="lg:col-span-4 p-6 sm:p-8 text-white flex flex-col justify-between space-y-8"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="space-y-6">
            
            {/* Avatar & Identifiers */}
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-white/40 shadow-2xl flex items-center justify-center text-3xl font-black bg-white/20 overflow-hidden">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profile.avatarInitial || 'TM'}</span>
                  )}
                </div>
                {!isReadOnly && (
                  <div className="mt-2">
                    <input 
                      type="text" 
                      placeholder="URL Ảnh Đại Diện" 
                      value={profile.avatarUrl}
                      onChange={(e) => onChangeProfile({ ...profile, avatarUrl: e.target.value })}
                      className="w-full px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-[11px] text-white placeholder-white/50 text-center"
                    />
                  </div>
                )}
              </div>

              <div className="mt-3 w-full">
                {isReadOnly ? (
                  <h1 className="text-xl font-black text-white">{profile.name}</h1>
                ) : (
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
                    className="w-full text-center font-black text-xl bg-transparent border-b border-white/30 text-white focus:border-white outline-hidden pb-1"
                    placeholder="Họ Tên Quốc Tế (VD: Minh Tran)"
                  />
                )}

                {isReadOnly ? (
                  <div className="text-xs text-white/80 font-medium">{profile.vietnameseName}</div>
                ) : (
                  <input 
                    type="text"
                    value={profile.vietnameseName}
                    onChange={(e) => onChangeProfile({ ...profile, vietnameseName: e.target.value })}
                    className="w-full text-center text-xs bg-transparent border-b border-white/20 text-white/80 focus:border-white outline-hidden mt-1 pb-0.5"
                    placeholder="Tên Tiếng Việt (VD: Trần Văn Minh)"
                  />
                )}

                {isReadOnly ? (
                  <div className="mt-2 px-3 py-1 bg-white/15 rounded-full text-xs font-bold inline-block border border-white/20">
                    {profile.title}
                  </div>
                ) : (
                  <textarea 
                    rows={2}
                    value={profile.title}
                    onChange={(e) => onChangeProfile({ ...profile, title: e.target.value })}
                    className="w-full text-center text-xs bg-white/10 border border-white/30 rounded-xl text-white mt-2 p-1.5 focus:bg-white/20 outline-hidden font-semibold"
                    placeholder="Chức Vụ Chuyên Môn (VD: Senior Key Account Manager...)"
                  />
                )}
              </div>
            </div>

            {/* Contact Channels */}
            <div className="space-y-3 pt-4 border-t border-white/20 text-xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-white/70 block">
                Thông Tin Kết Nối Trực Tiếp
              </span>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                  {isReadOnly ? (
                    <span className="font-semibold">{profile.phone}</span>
                  ) : (
                    <input 
                      type="text"
                      value={profile.phone}
                      onChange={(e) => onChangeProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-white/10 px-2 py-1 rounded-lg text-xs text-white border border-white/20 outline-hidden"
                      placeholder="Hotline / SĐT"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                  {isReadOnly ? (
                    <span className="font-semibold">{profile.email}</span>
                  ) : (
                    <input 
                      type="text"
                      value={profile.email}
                      onChange={(e) => onChangeProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-white/10 px-2 py-1 rounded-lg text-xs text-white border border-white/20 outline-hidden"
                      placeholder="Email công vụ"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                  {isReadOnly ? (
                    <span className="font-medium text-white/90">{profile.workingHours}</span>
                  ) : (
                    <input 
                      type="text"
                      value={profile.workingHours || ''}
                      onChange={(e) => onChangeProfile({ ...profile, workingHours: e.target.value })}
                      className="w-full bg-white/10 px-2 py-1 rounded-lg text-xs text-white border border-white/20 outline-hidden"
                      placeholder="Giờ trực online (08:00 - 21:00)"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Educations */}
            {visibleSections.myProfile.educations && (
              <div className="space-y-3 pt-4 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Học Vấn & Bằng Cấp</span>
                  </span>
                  {!isReadOnly && (
                    <button 
                      type="button" 
                      onClick={handleAddEducation}
                      className="text-white/80 hover:text-white text-[10px] font-bold flex items-center gap-0.5 bg-white/15 px-2 py-0.5 rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Thêm
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {profile.educations.map((edu, idx) => (
                    <div key={edu.id} className="bg-white/10 p-2.5 rounded-xl border border-white/15 relative group">
                      {!isReadOnly && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveEducation(idx)}
                          className="absolute top-2 right-2 text-white/40 hover:text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isReadOnly ? (
                        <>
                          <div className="font-bold text-white text-xs">{edu.school}</div>
                          <div className="text-[11px] text-white/80">{edu.degree}</div>
                          <div className="text-[10px] text-white/60 mt-0.5">{edu.period} • {edu.honors}</div>
                        </>
                      ) : (
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            value={edu.school} 
                            onChange={(e) => handleUpdateEducation(idx, 'school', e.target.value)}
                            className="w-full bg-white/10 px-1.5 py-0.5 rounded text-xs font-bold text-white border border-white/20 outline-hidden"
                            placeholder="Tên Trường"
                          />
                          <input 
                            type="text" 
                            value={edu.degree} 
                            onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                            className="w-full bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-white/90 border border-white/20 outline-hidden"
                            placeholder="Ngành học / Bằng cấp"
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <input 
                              type="text" 
                              value={edu.period} 
                              onChange={(e) => handleUpdateEducation(idx, 'period', e.target.value)}
                              className="w-full bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/80 border border-white/20 outline-hidden"
                              placeholder="Niên khóa"
                            />
                            <input 
                              type="text" 
                              value={edu.honors || ''} 
                              onChange={(e) => handleUpdateEducation(idx, 'honors', e.target.value)}
                              className="w-full bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/80 border border-white/20 outline-hidden"
                              placeholder="Xếp loại / Ghi chú"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {visibleSections.myProfile.certifications && (
              <div className="space-y-3 pt-4 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Chứng Chỉ Chuyên Ngành</span>
                  </span>
                  {!isReadOnly && (
                    <button 
                      type="button" 
                      onClick={handleAddCert}
                      className="text-white/80 hover:text-white text-[10px] font-bold flex items-center gap-0.5 bg-white/15 px-2 py-0.5 rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Thêm
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {profile.certifications.map((cert, idx) => (
                    <div key={cert.id} className="bg-white/10 p-2.5 rounded-xl border border-white/15 relative">
                      {!isReadOnly && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveCert(idx)}
                          className="absolute top-2 right-2 text-white/40 hover:text-rose-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isReadOnly ? (
                        <>
                          <div className="font-bold text-white text-xs">{cert.name}</div>
                          <div className="text-[10px] text-white/70 mt-0.5">{cert.issuer} • Năm {cert.year}</div>
                        </>
                      ) : (
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            value={cert.name} 
                            onChange={(e) => handleUpdateCert(idx, 'name', e.target.value)}
                            className="w-full bg-white/10 px-1.5 py-0.5 rounded text-xs font-bold text-white border border-white/20 outline-hidden"
                            placeholder="Tên chứng chỉ (FIATA, IATA...)"
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <input 
                              type="text" 
                              value={cert.issuer} 
                              onChange={(e) => handleUpdateCert(idx, 'issuer', e.target.value)}
                              className="w-full bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/80 border border-white/20 outline-hidden"
                              placeholder="Tổ chức cấp"
                            />
                            <input 
                              type="text" 
                              value={cert.year} 
                              onChange={(e) => handleUpdateCert(idx, 'year', e.target.value)}
                              className="w-full bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/80 border border-white/20 outline-hidden"
                              placeholder="Năm cấp"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {visibleSections.myProfile.skills !== false && (
              <div className="space-y-2 pt-4 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Kỹ Năng Chuyên Môn</span>
                  </span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setShowAddSkill(!showAddSkill)}
                      className="text-[10px] text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded transition cursor-pointer font-bold"
                    >
                      + Thêm
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(profile.skills || []).map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 rounded-lg text-[11px] font-medium border border-white/20">
                      <span>{skill}</span>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(idx)}
                          className="hover:text-rose-300 text-white/60 cursor-pointer ml-0.5"
                          title="Xóa kỹ năng"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {!isReadOnly && showAddSkill && (
                  <div className="pt-1.5 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="VD: Đàm phán cước tàu, WMS..."
                      className="flex-1 px-2.5 py-1 text-xs bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={!newSkillInput.trim()}
                      className="px-2.5 py-1 text-xs font-bold bg-white text-slate-800 rounded-lg hover:bg-white/90 cursor-pointer shrink-0"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Languages (Editable) */}
            {visibleSections.myProfile.languages && (
              <div className="space-y-2 pt-4 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sky-300" />
                    <span>Ngôn Ngữ Hỗ Trợ</span>
                  </span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setShowAddLang(!showAddLang)}
                      className="text-[10px] text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded transition cursor-pointer font-bold"
                    >
                      + Thêm
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(profile.languages || []).map((lang, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 rounded-lg text-[11px] font-medium border border-white/20">
                      <span>{lang}</span>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(idx)}
                          className="hover:text-rose-300 text-white/60 cursor-pointer ml-0.5"
                          title="Xóa ngôn ngữ"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {!isReadOnly && showAddLang && (
                  <div className="pt-1.5 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newLangInput}
                      onChange={(e) => setNewLangInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLanguage();
                        }
                      }}
                      placeholder="VD: Tiếng Hàn (Topik 5)..."
                      className="flex-1 px-2.5 py-1 text-xs bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      disabled={!newLangInput.trim()}
                      className="px-2.5 py-1 text-xs font-bold bg-white text-slate-800 rounded-lg hover:bg-white/90 cursor-pointer shrink-0"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hobbies / Interests */}
            {visibleSections.myProfile.hobbies !== false && (
              <div className="space-y-2 pt-4 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-300" />
                    <span>Sở Thích & Đời Sống</span>
                  </span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setShowAddHobby(!showAddHobby)}
                      className="text-[10px] text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded transition cursor-pointer font-bold"
                    >
                      + Thêm
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(profile.hobbies || []).map((hobby, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 rounded-lg text-[11px] font-medium border border-white/20">
                      <span>{hobby}</span>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHobby(idx)}
                          className="hover:text-rose-300 text-white/60 cursor-pointer ml-0.5"
                          title="Xóa sở thích"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {!isReadOnly && showAddHobby && (
                  <div className="pt-1.5 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newHobbyInput}
                      onChange={(e) => setNewHobbyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHobby();
                        }
                      }}
                      placeholder="VD: Chạy bộ, Tennis, Đọc sách..."
                      className="flex-1 px-2.5 py-1 text-xs bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddHobby}
                      disabled={!newHobbyInput.trim()}
                      className="px-2.5 py-1 text-xs font-bold bg-white text-slate-800 rounded-lg hover:bg-white/90 cursor-pointer shrink-0"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-white/20 text-center text-[11px] text-white/60">
            Hồ Sơ Chuyên Viên Định Danh FlexGO
          </div>
        </div>

        {/* =====================================================================
            RIGHT CONTENT: Bio, Motto, Flex Stats, Work Experiences, Specialties
        ===================================================================== */}
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-8 bg-slate-50/40">
          
          {/* Motto / Slogan Callout Box */}
          <div className="p-5 rounded-2xl border-l-4 bg-white shadow-xs" style={{ borderLeftColor: theme.secondary }}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider" style={{ color: theme.secondary }}>
              <Sparkles className="w-4 h-4" />
              <span>Tuyên Ngôn & Cam Kết Phục Vụ</span>
            </div>
            {isReadOnly ? (
              <p className="mt-2 text-sm sm:text-base font-bold text-slate-800 italic">
                "{profile.motto}"
              </p>
            ) : (
              <textarea 
                rows={2}
                value={profile.motto}
                onChange={(e) => onChangeProfile({ ...profile, motto: e.target.value })}
                className="w-full mt-2 p-2.5 text-sm font-bold text-slate-800 italic bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
                placeholder="Nhập slogan / cam kết phục vụ của bạn..."
              />
            )}
          </div>

          {/* Professional Bio */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Tiểu Sử Chuyên Môn & Năng Lực Cố Vấn</span>
            </h3>
            {isReadOnly ? (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <textarea 
                rows={4}
                value={profile.bio}
                onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden leading-relaxed"
                placeholder="Mô tả bề dày kinh nghiệm, thế mạnh các tuyến hàng và năng lực tư vấn giải pháp..."
              />
            )}
          </div>

          {/* Highlight Stats / Flex Numbers */}
          {visibleSections.myProfile.highlightStats && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Thành Tích Cá Nhân</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {profile.highlightStats.map((stat, idx) => (
                  <div 
                    key={stat.id} 
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 text-center flex flex-col justify-between hover:bg-white transition-all shadow-2xs"
                  >
                    {isReadOnly ? (
                      <>
                        <div className="text-base sm:text-lg font-black tracking-tight" style={{ color: theme.primary }}>
                          {stat.value}
                        </div>
                        <div className="text-xs font-bold text-slate-700 mt-1">{stat.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{stat.subtext}</div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <input 
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...profile.highlightStats];
                            updated[idx].value = e.target.value;
                            onChangeProfile({ ...profile, highlightStats: updated });
                          }}
                          className="w-full text-center font-black text-sm bg-white border border-slate-200 rounded p-1"
                          style={{ color: theme.primary }}
                          placeholder="4,500+ TEUs"
                        />
                        <input 
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...profile.highlightStats];
                            updated[idx].label = e.target.value;
                            onChangeProfile({ ...profile, highlightStats: updated });
                          }}
                          className="w-full text-center font-semibold text-[11px] text-slate-800 bg-white border border-slate-200 rounded p-0.5"
                          placeholder="Tên chỉ số"
                        />
                        <input 
                          type="text"
                          value={stat.subtext || ''}
                          onChange={(e) => {
                            const updated = [...profile.highlightStats];
                            updated[idx].subtext = e.target.value;
                            onChangeProfile({ ...profile, highlightStats: updated });
                          }}
                          className="w-full text-center text-[10px] text-slate-500 bg-white border border-slate-200 rounded p-0.5"
                          placeholder="Ghi chú thêm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards & Honors */}
          {visibleSections.myProfile.awards !== false && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Giải Thưởng & Vinh Danh</span>
                </h3>
                {!isReadOnly && (
                  <button 
                    type="button"
                    onClick={handleAddAward}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm giải thưởng</span>
                  </button>
                )}
              </div>

              {(!profile.awards || profile.awards.length === 0) ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  Chưa có thông tin giải thưởng & vinh danh.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {profile.awards.map((award, idx) => (
                    <div 
                      key={award.id || idx}
                      className="p-4 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/40 to-orange-50/20 relative group hover:border-amber-300 transition shadow-2xs"
                    >
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAward(idx)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition cursor-pointer p-1"
                          title="Xóa giải thưởng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isReadOnly ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between pr-6">
                            <span className="text-xs font-black text-slate-900">{award.title}</span>
                            {award.year && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                                {award.year}
                              </span>
                            )}
                          </div>
                          {award.issuer && (
                            <div className="text-[11px] font-semibold text-amber-900/80">{award.issuer}</div>
                          )}
                          {award.description && (
                            <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{award.description}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2 pr-6">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={award.title}
                              onChange={(e) => handleUpdateAward(idx, 'title', e.target.value)}
                              placeholder="Tên giải thưởng / danh hiệu..."
                              className="flex-1 font-bold text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-1.5"
                            />
                            <input
                              type="text"
                              value={award.year || ''}
                              onChange={(e) => handleUpdateAward(idx, 'year', e.target.value)}
                              placeholder="Năm"
                              className="w-16 text-center font-bold text-xs text-amber-800 bg-white border border-slate-200 rounded-lg p-1.5"
                            />
                          </div>
                          <input
                            type="text"
                            value={award.issuer || ''}
                            onChange={(e) => handleUpdateAward(idx, 'issuer', e.target.value)}
                            placeholder="Đơn vị / Tổ chức trao giải..."
                            className="w-full text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg p-1.5"
                          />
                          <textarea
                            rows={2}
                            value={award.description || ''}
                            onChange={(e) => handleUpdateAward(idx, 'description', e.target.value)}
                            placeholder="Mô tả tóm tắt thành tích..."
                            className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg p-1.5 leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Work Experience Timeline */}
          {visibleSections.myProfile.experiences && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Quá Trình Công Tác & Dự Án Đã Thực Hiện</span>
                </h3>
                {!isReadOnly && (
                  <button 
                    type="button"
                    onClick={handleAddExperience}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Mốc Kinh Nghiệm</span>
                  </button>
                )}
              </div>

              {/* Timeline Items */}
              <div className="space-y-6 pt-2">
                {profile.experiences.map((exp, idx) => (
                  <div key={exp.id} className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-2 group">
                    {/* Circle Bullet */}
                    <div 
                      className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: theme.secondary }}
                    />

                    {/* Delete button when editing */}
                    {!isReadOnly && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        className="absolute right-0 top-0 text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Xóa mốc kinh nghiệm này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {isReadOnly ? (
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{exp.position}</h4>
                          <span className="text-xs text-indigo-700 font-bold">• {exp.company}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">{exp.period}</span>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                        {exp.keyAchievement && (
                          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{exp.keyAchievement}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Vị Trí Đảm Nhiệm</label>
                            <input 
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleUpdateExperience(idx, 'position', e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                              placeholder="Vị trí công việc"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Công Ty / Tập Đoàn</label>
                            <input 
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-indigo-900"
                              placeholder="Tên công ty"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Thời Gian Công Tác</label>
                          <input 
                            type="text"
                            value={exp.period}
                            onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                            className="w-full mt-0.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                            placeholder="VD: 2020 - Hiện tại (4 năm)"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Mô Tả Trách Nhiệm & Các Tuyến Phụ Trách</label>
                          <textarea 
                            rows={2}
                            value={exp.description}
                            onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                            className="w-full mt-0.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 leading-relaxed"
                            placeholder="Mô tả công việc..."
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-emerald-700 uppercase">Thành Tựu Nổi Bật / Kỷ Lục Đạt Được</label>
                          <input 
                            type="text"
                            value={exp.keyAchievement || ''}
                            onChange={(e) => handleUpdateExperience(idx, 'keyAchievement', e.target.value)}
                            className="w-full mt-0.5 px-3 py-1.5 bg-emerald-50/50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-950"
                            placeholder="VD: Top 1 Doanh số toàn quốc, điều phối 1,500 TEUs không lỗi..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

          {/* Specialties / Market Focus */}
          {visibleSections.myProfile.specialties && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Thị Trường Thế Mạnh & Giải Pháp Tuyến</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold italic">
                  Đồng bộ từ Danh mục dịch vụ (Tab 3)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((spec, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                    style={{ backgroundColor: `${theme.primary}10`, borderColor: `${theme.primary}30`, color: theme.primary }}
                  >
                    ★ {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
