import React, { useState } from 'react';
import { 
  Layout, 
  Palette, 
  Eye, 
  Save, 
  Share2, 
  Check, 
  Layers,
  CheckCircle2
} from 'lucide-react';
import { 
  ThemeColorId, 
  THEME_COLOR_OPTIONS, 
  StudioTemplateConfig 
} from './studioTypes';

interface StudioToolbarProps {
  config: StudioTemplateConfig;
  onChangeConfig: (newConfig: StudioTemplateConfig) => void;
  onOpenTemplateModal: () => void;
  onPreview: () => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
  activeEditorTab?: 'profile' | 'company' | 'services' | 'performance';
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  config,
  onChangeConfig,
  onOpenTemplateModal,
  onPreview,
  onSave,
  onReset,
  isSaving = false,
  activeEditorTab = 'profile',
}) => {
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeColor = THEME_COLOR_OPTIONS[config.themeColor];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleSection = (tab: 'myProfile' | 'myCompany', sectionKey: string) => {
    const updated = { ...config };
    const current = (updated.visibleSections[tab] as any)[sectionKey];
    (updated.visibleSections[tab] as any)[sectionKey] = !current;
    onChangeConfig(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 relative">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">
          Profile Studio
        </h2>

        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          
          {/* 1. Button Đổi Mẫu CV/Profile / Company */}
          <button
            type="button"
            onClick={onOpenTemplateModal}
            title={activeEditorTab === 'company' ? 'Đổi mẫu doanh nghiệp' : 'Đổi mẫu giao diện'}
            aria-label={activeEditorTab === 'company' ? 'Đổi mẫu doanh nghiệp' : 'Đổi mẫu giao diện'}
            className="w-9 h-9 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-600 rounded-lg transition-all flex items-center justify-center cursor-pointer"
          >
            <Layout className="w-4 h-4" />
          </button>

          {/* 2. Button Tông Màu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsColorDropdownOpen(!isColorDropdownOpen);
                setIsSectionsDrawerOpen(false);
              }}
              title={`Tông màu: ${activeColor.name}`}
              aria-label={`Tông màu: ${activeColor.name}`}
              aria-expanded={isColorDropdownOpen}
              className="w-9 h-9 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-all flex items-center justify-center cursor-pointer"
            >
              <Palette className="w-4 h-4" style={{ color: activeColor.primary }} />
            </button>

            {isColorDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsColorDropdownOpen(false)}
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">Chọn Tông Màu Chủ Đạo</div>
                {(Object.keys(THEME_COLOR_OPTIONS) as ThemeColorId[]).map((key) => {
                  const opt = THEME_COLOR_OPTIONS[key];
                  const isSelected = config.themeColor === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onChangeConfig({ ...config, themeColor: key })}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shadow-2xs"
                          style={{ backgroundColor: opt.primary }}
                        />
                        <span>{opt.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Button Thêm Mục / Ẩn Hiện Bố Cục */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSectionsDrawerOpen(!isSectionsDrawerOpen);
                setIsColorDropdownOpen(false);
              }}
              title="Bố cục và mục hiển thị"
              aria-label="Bố cục và mục hiển thị"
              aria-expanded={isSectionsDrawerOpen}
              className="w-9 h-9 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-indigo-600 rounded-lg transition-all flex items-center justify-center cursor-pointer"
            >
              <Layers className="w-4 h-4" />
            </button>

            {isSectionsDrawerOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-xs font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Tùy chỉnh các mục hiển thị</span>
                  <button 
                    onClick={() => setIsSectionsDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-normal"
                  >
                    Đóng
                  </button>
                </div>

                <div className="mt-2 space-y-3 max-h-72 overflow-y-auto pr-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mục Tab 1 (My Profile)</span>
                    <div className="space-y-1 text-xs">
                      {[
                        { key: 'experiences', label: 'Quá trình làm việc / Kinh nghiệm' },
                        { key: 'educations', label: 'Học vấn & Bằng cấp' },
                        { key: 'certifications', label: 'Chứng chỉ Logistics quốc tế' },
                        { key: 'highlightStats', label: 'Thành tích cá nhân' },
                        { key: 'awards', label: 'Giải thưởng & Vinh danh' },
                        { key: 'skills', label: 'Kỹ năng chuyên môn' },
                        { key: 'hobbies', label: 'Sở thích & Đời sống' },
                        { key: 'targetIndustries', label: 'Nhóm ngành hàng chuyên sâu' },
                        { key: 'specialties', label: 'Tuyến đường & Thị trường thế mạnh' },
                        { key: 'languages', label: 'Ngôn ngữ hỗ trợ' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <span className="text-slate-700 font-medium">{item.label}</span>
                          <input 
                            type="checkbox"
                            checked={(config.visibleSections.myProfile as any)[item.key]}
                            onChange={() => toggleSection('myProfile', item.key)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mục Tab 2 (Hồ Sơ Doanh Nghiệp)</span>
                    <div className="space-y-1 text-xs">
                      {[
                        { key: 'about', label: '1. Về chúng tôi & Dấu mốc lịch sử' },
                        { key: 'visionMission', label: '2. Tầm nhìn, Sứ mệnh & Giá trị cốt lõi' },
                        { key: 'highlights', label: '3. Thước đo quy mô & Năng lực vận hành' },
                        { key: 'ecosystem', label: '4. Hệ sinh thái dịch vụ & Ngành hàng' },
                        { key: 'partners', label: '5. Khách hàng tiêu biểu & Đối tác' },
                        { key: 'compliance', label: '6. Chứng nhận, Giấy phép & Hiệp hội' },
                        { key: 'branches', label: '7. Mạng lưới chi nhánh & Trụ sở' },
                        { key: 'caseStudies', label: '8. Dự án logistics & Case studies' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <span className="text-slate-700 font-medium">{item.label}</span>
                          <input 
                            type="checkbox"
                            checked={!!(config.visibleSections.myCompany as any)[item.key]}
                            onChange={() => toggleSection('myCompany', item.key)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Button Xem Trước Public Landing Page */}
          <button
            type="button"
            onClick={onPreview}
            title="Xem trước hồ sơ Public"
            aria-label="Xem trước hồ sơ Public"
            className="w-9 h-9 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 rounded-lg transition-all flex items-center justify-center cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* 5. Button Sao Chép Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            title={copiedLink ? 'Đã chép liên kết' : 'Chia sẻ hồ sơ'}
            aria-label={copiedLink ? 'Đã chép liên kết' : 'Chia sẻ hồ sơ'}
            className={`w-9 h-9 border rounded-lg transition-all flex items-center justify-center cursor-pointer ${
              copiedLink
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-600'
            }`}
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* 6. Button Lưu Hồ Sơ */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            title={isSaving ? 'Đang lưu hồ sơ' : 'Lưu hồ sơ'}
            aria-label={isSaving ? 'Đang lưu hồ sơ' : 'Lưu hồ sơ'}
            className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-sm"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
