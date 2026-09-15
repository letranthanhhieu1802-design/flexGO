import React from 'react';
import { Check, Layout, Palette, X } from 'lucide-react';
import { TemplateId, ThemeColorId, THEME_COLOR_OPTIONS } from './studioTypes';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  selectedThemeColor: ThemeColorId;
  onSelectThemeColor: (color: ThemeColorId) => void;
}

const templates: { id: TemplateId; name: string; description: string; accent: string }[] = [
  { id: 'executive-elite', name: 'Executive Elite', description: 'Cổ điển, chuyên nghiệp, nhấn mạnh kinh nghiệm.', accent: 'bg-indigo-900' },
  { id: 'classic-prestige', name: 'Classic Prestige', description: 'Thanh lịch với sidebar có điểm nhấn.', accent: 'bg-blue-900' },
  { id: 'prime-experience', name: 'Prime Experience', description: 'Ưu tiên thành tích và năng lực thực chiến.', accent: 'bg-slate-800' },
  { id: 'modern-bento', name: 'Modern Bento', description: 'Các khối nội dung hiện đại, trực quan.', accent: 'bg-emerald-700' },
  { id: 'minimalist', name: 'Minimalist', description: 'Tối giản, tập trung vào nội dung chuyên môn.', accent: 'bg-slate-700' },
  { id: 'bold-compact', name: 'Bold Compact', description: 'Gọn, nổi bật, phù hợp trao đổi nhanh.', accent: 'bg-rose-700' },
  { id: 'grand-banner', name: 'Grand Banner', description: 'Mở đầu bằng nhận diện cá nhân mạnh mẽ.', accent: 'bg-violet-800' },
  { id: 'clean-elegance', name: 'Clean Elegance', description: 'Nền sáng, tinh gọn và dễ đọc.', accent: 'bg-slate-500' },
  { id: 'modular-matrix', name: 'Modular Matrix', description: 'Bố cục mô-đun cho nhiều nhóm năng lực.', accent: 'bg-cyan-800' },
  { id: 'speed-hunter', name: 'Speed Hunter', description: 'Thiết kế giàu năng lượng, hướng tới chốt deal.', accent: 'bg-amber-700' },
];

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({ isOpen, onClose, selectedTemplateId, onSelectTemplate, selectedThemeColor, onSelectThemeColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div><div className="flex items-center gap-2 text-indigo-600"><Layout className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-wider">PIC profile</span></div><h3 className="mt-1 text-lg font-black text-slate-900">Chọn mẫu giao diện hồ sơ</h3><p className="mt-1 text-xs text-slate-500">Các lựa chọn này chỉ áp dụng cho hồ sơ cá nhân của saleman.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50/50 px-5 py-3 sm:px-6"><Palette className="h-4 w-4 text-indigo-600" /><span className="mr-1 text-xs font-bold text-slate-800">Tông màu:</span>{(Object.keys(THEME_COLOR_OPTIONS) as ThemeColorId[]).map((colorId) => { const color = THEME_COLOR_OPTIONS[colorId]; const isSelected = selectedThemeColor === colorId; return <button key={colorId} type="button" onClick={() => onSelectThemeColor(colorId)} className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold ${isSelected ? 'border-indigo-600 bg-white text-indigo-900 ring-2 ring-indigo-600/20' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}><span className="h-3 w-3 rounded-full" style={{ backgroundColor: color.primary }} />{color.name}{isSelected && <Check className="h-3 w-3 text-indigo-600" />}</button>; })}</div>
        <div className="grid max-h-[68vh] grid-cols-1 gap-4 overflow-y-auto bg-slate-50/60 p-5 sm:grid-cols-2 sm:p-6">
          {templates.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            return <button key={template.id} type="button" onClick={() => onSelectTemplate(template.id)} className={`rounded-2xl border-2 bg-white p-4 text-left transition hover:shadow-md ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200 hover:border-indigo-300'}`}>
              <div className={`relative h-28 overflow-hidden rounded-xl ${template.accent}`}><div className="absolute inset-x-3 top-3 flex gap-2"><span className="h-10 w-10 rounded-full border border-white/40 bg-white/20" /><span className="mt-1 h-3 w-28 rounded-full bg-white/80" /></div><div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2"><span className="h-9 rounded-lg bg-white/15" /><span className="h-9 rounded-lg bg-white/15" /><span className="h-9 rounded-lg bg-white/15" /></div>{isSelected && <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm"><Check className="h-4 w-4" /></span>}</div>
              <div className="mt-3 flex items-start justify-between gap-3"><div><h4 className="text-sm font-black text-slate-900">{template.name}</h4><p className="mt-1 text-xs leading-5 text-slate-500">{template.description}</p></div>{isSelected && <span className="shrink-0 text-xs font-bold text-indigo-600">Đang dùng</span>}</div>
            </button>;
          })}
        </div>
      </div>
    </div>
  );
};
