import React, { useState } from 'react';
import { Check, CheckCircle2, Eye, Layers, Layout, Palette, Save, Share2 } from 'lucide-react';
import { StudioTemplateConfig, ThemeColorId, THEME_COLOR_OPTIONS } from './studioTypes';

interface StudioToolbarProps {
  config: StudioTemplateConfig;
  onChangeConfig: (newConfig: StudioTemplateConfig) => void;
  onOpenTemplateModal: () => void;
  onPreview: () => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

const profileSections = [
  { key: 'experiences', label: 'Quá trình làm việc / Kinh nghiệm' },
  { key: 'educations', label: 'Học vấn & bằng cấp' },
  { key: 'certifications', label: 'Chứng chỉ logistics quốc tế' },
  { key: 'highlightStats', label: 'Thành tích cá nhân' },
  { key: 'awards', label: 'Giải thưởng & vinh danh' },
  { key: 'skills', label: 'Kỹ năng chuyên môn' },
  { key: 'hobbies', label: 'Sở thích & đời sống' },
  { key: 'targetIndustries', label: 'Nhóm ngành hàng chuyên sâu' },
  { key: 'specialties', label: 'Tuyến đường & thị trường thế mạnh' },
  { key: 'languages', label: 'Ngôn ngữ hỗ trợ' },
];

export const StudioToolbar: React.FC<StudioToolbarProps> = ({ config, onChangeConfig, onOpenTemplateModal, onPreview, onSave, isSaving = false }) => {
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const activeColor = THEME_COLOR_OPTIONS[config.themeColor];

  const toggleSection = (sectionKey: string) => {
    onChangeConfig({
      ...config,
      visibleSections: {
        ...config.visibleSections,
        myProfile: {
          ...config.visibleSections.myProfile,
          [sectionKey]: !(config.visibleSections.myProfile as Record<string, boolean | undefined>)[sectionKey],
        },
      },
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="whitespace-nowrap text-base font-black tracking-tight text-slate-900 sm:text-lg">Profile Studio</h2>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <button type="button" onClick={onOpenTemplateModal} title="Đổi mẫu giao diện PIC profile" aria-label="Đổi mẫu giao diện PIC profile" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"><Layout className="h-4 w-4" /></button>

          <div className="relative">
            <button type="button" onClick={() => { setIsColorDropdownOpen(!isColorDropdownOpen); setIsSectionsDrawerOpen(false); }} title={`Tông màu: ${activeColor.name}`} aria-label={`Tông màu: ${activeColor.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 transition hover:bg-slate-200/80"><Palette className="h-4 w-4" style={{ color: activeColor.primary }} /></button>
            {isColorDropdownOpen && <div className="absolute right-0 z-30 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">Chọn tông màu chủ đạo</div>
              {(Object.keys(THEME_COLOR_OPTIONS) as ThemeColorId[]).map((key) => {
                const option = THEME_COLOR_OPTIONS[key];
                const isSelected = config.themeColor === key;
                return <button key={key} type="button" onClick={() => onChangeConfig({ ...config, themeColor: key })} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold ${isSelected ? 'bg-indigo-50 text-indigo-900' : 'text-slate-700 hover:bg-slate-50'}`}><span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: option.primary }} />{option.name}</span>{isSelected && <Check className="h-3.5 w-3.5 text-indigo-600" />}</button>;
              })}
            </div>}
          </div>

          <div className="relative">
            <button type="button" onClick={() => { setIsSectionsDrawerOpen(!isSectionsDrawerOpen); setIsColorDropdownOpen(false); }} title="Các mục hiển thị của PIC profile" aria-label="Các mục hiển thị của PIC profile" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-indigo-600 transition hover:bg-slate-200/80"><Layers className="h-4 w-4" /></button>
            {isSectionsDrawerOpen && <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-extrabold text-slate-900"><span>Tùy chỉnh các mục PIC profile</span><button type="button" onClick={() => setIsSectionsDrawerOpen(false)} className="font-normal text-slate-400 hover:text-slate-600">Đóng</button></div>
              <div className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1 text-xs">{profileSections.map((item) => <label key={item.key} className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-slate-50"><span className="font-medium text-slate-700">{item.label}</span><input type="checkbox" checked={!!(config.visibleSections.myProfile as Record<string, boolean | undefined>)[item.key]} onChange={() => toggleSection(item.key)} className="cursor-pointer rounded text-indigo-600 focus:ring-indigo-500" /></label>)}</div>
            </div>}
          </div>

          <button type="button" onClick={onPreview} title="Xem trước hồ sơ public" aria-label="Xem trước hồ sơ public" className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100"><Eye className="h-4 w-4" /></button>
          <button type="button" onClick={handleCopyLink} title={copiedLink ? 'Đã chép liên kết' : 'Chia sẻ hồ sơ'} aria-label={copiedLink ? 'Đã chép liên kết' : 'Chia sẻ hồ sơ'} className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${copiedLink ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200/80'}`}>{copiedLink ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}</button>
          <button type="button" onClick={onSave} disabled={isSaving} title={isSaving ? 'Đang lưu hồ sơ' : 'Lưu hồ sơ'} aria-label={isSaving ? 'Đang lưu hồ sơ' : 'Lưu hồ sơ'} className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"><Save className={`h-4 w-4 ${isSaving ? 'animate-pulse' : ''}`} /></button>
        </div>
      </div>
    </div>
  );
};
