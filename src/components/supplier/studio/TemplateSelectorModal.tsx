import React from 'react';
import { X, Check, Sparkles, Layout, Palette, ShieldCheck } from 'lucide-react';
import { TemplateId, ThemeColorId, THEME_COLOR_OPTIONS } from './studioTypes';

interface TemplateOption {
  id: TemplateId;
  name: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  description: string;
  features: string[];
  mockupPreview: React.ReactNode;
}

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  selectedThemeColor: ThemeColorId;
  onSelectThemeColor: (color: ThemeColorId) => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateId,
  onSelectTemplate,
  selectedThemeColor,
  onSelectThemeColor,
}) => {
  if (!isOpen) return null;

  const templates: TemplateOption[] = [
    {
      id: 'executive-elite',
      name: 'Executive Elite (Cổ Điển Đẳng Cấp)',
      badge: 'Khuyên Dùng ★',
      badgeColor: 'bg-blue-600 text-white',
      tagline: 'Bố cục 2 cột với Cột bên Sidebar chuyên nghiệp',
      description: 'Cân bằng hoàn hảo giữa nhận diện cá nhân Saleman và uy tín pháp nhân công ty. Thích hợp để tiếp cận tập đoàn đa quốc gia và khách hàng FDI.',
      features: ['Sidebar màu chủ đạo sang trọng', 'Dòng thời gian kinh nghiệm trực quan', 'Bảng thành tích số liệu nổi bật'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex p-1.5 gap-1.5 shadow-inner">
          <div className="w-1/3 bg-blue-900 rounded-lg p-1 flex flex-col items-center justify-between text-[6px] text-white">
            <div className="w-6 h-6 rounded-full bg-blue-400 border border-white mt-1" />
            <div className="w-full text-center font-bold">MINH TRAN</div>
            <div className="w-full space-y-0.5">
              <div className="h-1 bg-white/40 rounded-sm w-full" />
              <div className="h-1 bg-white/40 rounded-sm w-3/4" />
            </div>
            <div className="w-full h-4 bg-white/10 rounded-sm mb-1" />
          </div>
          <div className="w-2/3 bg-white rounded-lg p-1.5 flex flex-col justify-between text-[6px]">
            <div>
              <div className="h-2 bg-slate-800 rounded-sm w-1/2 mb-1" />
              <div className="h-1 bg-blue-600 rounded-sm w-1/3 mb-1.5" />
              <div className="space-y-0.5">
                <div className="h-1 bg-slate-200 rounded-sm w-full" />
                <div className="h-1 bg-slate-200 rounded-sm w-5/6" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 my-1">
              <div className="h-4 bg-slate-50 border border-slate-200 rounded-sm" />
              <div className="h-4 bg-slate-50 border border-slate-200 rounded-sm" />
            </div>
            <div className="space-y-0.5">
              <div className="h-1.5 bg-slate-300 rounded-sm w-2/3" />
              <div className="h-1 bg-slate-100 rounded-sm w-full" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'modern-bento',
      name: 'Modern Bento (Khối Thẻ Công Nghệ)',
      badge: 'Xu Hướng Mới',
      badgeColor: 'bg-emerald-600 text-white',
      tagline: 'Lưới Bento Box hiện đại, hiển thị trực quan các năng lực',
      description: 'Thiết kế theo phong cách Apple/Stripe với các khối thẻ bo góc độc lập. Tôn vinh các con số kỷ lục sản lượng và chứng chỉ logistics quốc tế.',
      features: ['Lưới thẻ nổi bật 3D', 'Card số liệu Flex Box to rõ', 'Badge chứng chỉ FIATA/IATA sắc sảo'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 p-1.5 grid grid-cols-3 gap-1 shadow-inner">
          <div className="col-span-2 bg-slate-800 rounded-lg p-1.5 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500 shrink-0" />
            <div className="w-full space-y-0.5">
              <div className="h-1.5 bg-white rounded-sm w-3/4" />
              <div className="h-1 bg-emerald-400 rounded-sm w-1/2" />
            </div>
          </div>
          <div className="col-span-1 bg-emerald-950 border border-emerald-500/40 rounded-lg p-1 flex flex-col justify-center items-center">
            <div className="h-2.5 w-6 bg-emerald-400 rounded-sm mb-0.5" />
            <div className="h-1 bg-emerald-200/50 rounded-sm w-3/4" />
          </div>
          <div className="col-span-1 bg-slate-800 rounded-lg p-1" />
          <div className="col-span-2 bg-slate-800 rounded-lg p-1 space-y-0.5">
            <div className="h-1 bg-slate-600 rounded-sm w-full" />
            <div className="h-1 bg-slate-600 rounded-sm w-4/5" />
          </div>
          <div className="col-span-3 bg-slate-800/80 rounded-lg p-1 flex gap-1">
            <div className="h-3 bg-slate-700 rounded-sm flex-1" />
            <div className="h-3 bg-slate-700 rounded-sm flex-1" />
            <div className="h-3 bg-slate-700 rounded-sm flex-1" />
          </div>
        </div>
      )
    },
    {
      id: 'minimalist',
      name: 'Minimalist Storyteller (Tối Giản Quốc Tế)',
      badge: 'Thanh Lịch',
      badgeColor: 'bg-slate-700 text-white',
      tagline: '1 cột tinh giản kiểu Cố vấn / Chuyên gia cấp cao',
      description: 'Tập trung sâu vào chiều sâu câu chuyện chuyên môn, bề dày kinh nghiệm và giải pháp. Tạo cảm giác đáng tin cậy tuyệt đối cho các hợp đồng lớn.',
      features: ['Typography thoáng đãng chuẩn quốc tế', 'Tập trung vào kinh nghiệm và năng lực', 'Tối ưu tốc độ tải và in ấn PDF'],
      mockupPreview: (
        <div className="w-full h-36 bg-white rounded-xl overflow-hidden border border-slate-300 p-2 flex flex-col justify-between shadow-inner">
          <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
            <div>
              <div className="h-2 bg-slate-900 rounded-sm w-20 mb-0.5" />
              <div className="h-1 bg-slate-500 rounded-sm w-28" />
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-300" />
          </div>
          <div className="space-y-1 my-1">
            <div className="h-1 bg-slate-300 rounded-sm w-full" />
            <div className="h-1 bg-slate-200 rounded-sm w-11/12" />
            <div className="h-1 bg-slate-200 rounded-sm w-4/5" />
          </div>
          <div className="border-t border-slate-100 pt-1 flex gap-2">
            <div className="w-1/2 space-y-0.5">
              <div className="h-1 bg-slate-800 rounded-sm w-12" />
              <div className="h-1 bg-slate-300 rounded-sm w-full" />
            </div>
            <div className="w-1/2 space-y-0.5">
              <div className="h-1 bg-slate-800 rounded-sm w-12" />
              <div className="h-1 bg-slate-300 rounded-sm w-full" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bold-compact',
      name: 'Bold Compact (Danh Thiếp Số Hiện Đại)',
      badge: 'Năng Động',
      badgeColor: 'bg-rose-600 text-white',
      tagline: 'Header Card vòm cong lớn, tối ưu kết nối nhanh qua Zalo & QR',
      description: 'Mẫu giao diện thời thượng với Header nổi bật và tích hợp nhanh mã QR liên hệ. Rất phù hợp khi gửi link cho khách hàng xem trên điện thoại thông minh.',
      features: ['Header Banner bo cong ấn tượng', 'Tích hợp sẵn QR Zalo / Danh thiếp số', 'Bố cục tinh gọn, chốt RFQ nhanh'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex flex-col shadow-inner">
          <div className="h-12 bg-gradient-to-r from-rose-800 via-rose-600 to-amber-600 p-1.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-rose-300 shrink-0" />
              <div className="space-y-0.5">
                <div className="h-1.5 bg-white rounded-sm w-14" />
                <div className="h-1 bg-rose-200 rounded-sm w-10" />
              </div>
            </div>
            <div className="w-6 h-6 bg-white rounded-md p-0.5 flex items-center justify-center">
              <div className="w-4 h-4 bg-slate-900 rounded-xs" />
            </div>
          </div>
          <div className="p-1.5 flex-1 flex flex-col justify-between bg-white text-[6px]">
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="bg-rose-50 border border-rose-200 rounded p-0.5 h-4" />
              <div className="bg-rose-50 border border-rose-200 rounded p-0.5 h-4" />
              <div className="bg-rose-50 border border-rose-200 rounded p-0.5 h-4" />
              <div className="bg-rose-50 border border-rose-200 rounded p-0.5 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="h-1 bg-slate-200 rounded-sm w-full" />
              <div className="h-1 bg-slate-200 rounded-sm w-5/6" />
            </div>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-600" />
              <span>Kho Mẫu Giao Diện Profile Saleman (TopCV Style)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn mẫu hiển thị bạn yêu thích. Mọi thông tin bạn đã nhập được giữ nguyên 100% khi đổi mẫu.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Palette Quick Switcher */}
        <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Tông màu chủ đạo giao diện:</span>
          </div>

          <div className="flex items-center gap-2">
            {(Object.keys(THEME_COLOR_OPTIONS) as ThemeColorId[]).map((colorKey) => {
              const option = THEME_COLOR_OPTIONS[colorKey];
              const isSelected = selectedThemeColor === colorKey;
              return (
                <button
                  key={colorKey}
                  type="button"
                  onClick={() => onSelectThemeColor(colorKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-white shadow-xs border-indigo-600 ring-2 ring-indigo-600/30'
                      : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: option.primary }}
                  />
                  <span>{option.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-indigo-600 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
          {templates.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl.id)}
                className={`group relative rounded-2xl bg-white p-5 border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full tracking-wider ${tpl.badgeColor}`}>
                      {tpl.badge}
                    </span>
                    {isSelected && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Đang Áp Dụng</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Click để chọn mẫu
                  </span>
                </div>

                {/* Visual Mockup Preview */}
                <div className="mb-3.5">
                  {tpl.mockupPreview}
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                    {tpl.tagline}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {tpl.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {tpl.features.map((feat, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Select Button Indicator */}
                <div className="mt-4 pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(tpl.id);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Mẫu Đang Được Sử Dụng</span>
                      </>
                    ) : (
                      <span>Áp Dụng Mẫu Này</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Mẫu đang chọn: <strong className="text-slate-900">{templates.find(t => t.id === selectedTemplateId)?.name}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Đóng & Tiếp Tục Chỉnh Sửa
          </button>
        </div>
      </div>
    </div>
  );
};
