import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Layout, 
  Palette, 
  Building2, 
  UserCheck, 
  Truck, 
  ShieldCheck, 
  Globe2, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { 
  TemplateId, 
  CompanyTemplateId, 
  ThemeColorId, 
  THEME_COLOR_OPTIONS 
} from './studioTypes';

interface TemplateOption<T = string> {
  id: T;
  name: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  description: string;
  features: string[];
  mockupPreview: React.ReactNode;
  category?: 'classic' | 'modern' | 'clean' | 'speed';
}

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'profile' | 'company';
  selectedTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  selectedCompanyTemplateId?: CompanyTemplateId;
  onSelectCompanyTemplate?: (templateId: CompanyTemplateId) => void;
  selectedThemeColor: ThemeColorId;
  onSelectThemeColor: (color: ThemeColorId) => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  activeTab = 'profile',
  selectedTemplateId,
  onSelectTemplate,
  selectedCompanyTemplateId = 'corporate-flagship',
  onSelectCompanyTemplate,
  selectedThemeColor,
  onSelectThemeColor,
}) => {
  const [modalTab, setModalTab] = useState<'profile' | 'company'>(activeTab);
  const [salemanCategory, setSalemanCategory] = useState<'all' | 'classic' | 'modern' | 'clean' | 'speed'>('all');

  // Sync internal tab state when activeTab changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setModalTab(activeTab);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // 1. SALEMAN PROFILE TEMPLATES (10 MẪU ĐẲNG CẤP)
  const salemanTemplates: TemplateOption<TemplateId>[] = [
    {
      id: 'executive-elite',
      category: 'classic',
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
      id: 'classic-prestige',
      category: 'classic',
      name: 'Classic Prestige (Cột Bên Thanh Lịch)',
      badge: 'Bán Chạy Nhất ★',
      badgeColor: 'bg-indigo-600 text-white',
      tagline: 'Sidebar màu chủ đạo đậm nét, thanh đo kỹ năng % & chấm ngôn ngữ',
      description: 'Phong cách kinh điển TopCV với cột bên trái mang màu sắc nhận diện nổi bật avatar, kỹ năng dạng tiến trình và mã QR. Cột phải nền trắng thoáng đãng cho dòng thời gian kinh nghiệm.',
      features: ['Thanh đo kỹ năng % trực quan', 'Cột bên tương phản cao sắc nét', 'Dòng thời gian trục dọc mốc tròn'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex p-1.5 gap-1.5 shadow-inner">
          <div className="w-1/3 bg-indigo-900 rounded-lg p-1.5 flex flex-col justify-between text-[6px] text-white">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-amber-400 border border-white mb-1" />
              <div className="h-1.5 bg-white rounded-sm w-3/4 mb-1" />
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-white/40 rounded-full w-full" />
              <div className="h-1 bg-amber-400 rounded-full w-4/5" />
              <div className="h-1 bg-white/40 rounded-full w-2/3" />
            </div>
            <div className="w-full h-3 bg-white/20 rounded-sm flex items-center justify-center text-[5px]">QR</div>
          </div>
          <div className="w-2/3 bg-white rounded-lg p-2 flex flex-col justify-between text-[6px]">
            <div>
              <div className="h-2 bg-indigo-900 rounded-sm w-1/3 mb-1.5" />
              <div className="pl-2 border-l border-indigo-200 space-y-1">
                <div className="h-1 bg-slate-400 rounded-sm w-3/4" />
                <div className="h-1 bg-slate-200 rounded-sm w-full" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-3.5 bg-indigo-50 border border-indigo-100 rounded" />
              <div className="h-3.5 bg-indigo-50 border border-indigo-100 rounded" />
              <div className="h-3.5 bg-indigo-50 border border-indigo-100 rounded" />
              <div className="h-3.5 bg-indigo-50 border border-indigo-100 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prime-experience',
      category: 'classic',
      name: 'Prime Experience (Trải Nghiệm Thực Chiến)',
      badge: 'Năng Lực Cao',
      badgeColor: 'bg-blue-700 text-white',
      tagline: 'Đảo ngược cột: Ưu tiên kinh nghiệm và thành tích lên góc nhìn F',
      description: 'Bố cục đảo cột hiện đại, đưa toàn bộ bề dày kinh nghiệm và số liệu sản lượng TEUs lên cột lớn bên trái. Cột phải nền xám sang trọng chứa ảnh squircle và nút gọi tư vấn cước nhanh.',
      features: ['Thân trái ưu tiên kinh nghiệm & KPI', 'Sidebar phải nền xám sang trọng', 'Nút gọi tư vấn cước trực tiếp'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex p-1.5 gap-1.5 shadow-inner">
          <div className="w-2/3 bg-white rounded-lg p-2 flex flex-col justify-between text-[6px]">
            <div>
              <div className="h-2.5 bg-slate-900 rounded-sm w-2/5 mb-1" />
              <div className="h-1 bg-blue-600 rounded-sm w-1/4 mb-2" />
              <div className="space-y-1">
                <div className="h-3.5 bg-slate-50 border border-slate-200 rounded-sm p-0.5" />
                <div className="h-3.5 bg-slate-50 border border-slate-200 rounded-sm p-0.5" />
              </div>
            </div>
            <div className="h-2 bg-emerald-100 rounded-sm w-4/5" />
          </div>
          <div className="w-1/3 bg-slate-200/70 rounded-lg p-1.5 flex flex-col items-center justify-between text-[6px]">
            <div className="w-7 h-7 rounded-xl bg-blue-600 border border-white mt-0.5" />
            <div className="w-full space-y-1">
              <div className="h-1 bg-slate-400 rounded-sm w-full" />
              <div className="h-1 bg-slate-400 rounded-sm w-3/4" />
            </div>
            <div className="w-full h-3 bg-blue-700 rounded text-white flex items-center justify-center text-[5px]">CALL</div>
          </div>
        </div>
      )
    },
    {
      id: 'modern-bento',
      category: 'modern',
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
      id: 'grand-banner',
      category: 'modern',
      name: 'Grand Flagship (Đầu Trang Đẳng Cấp)',
      badge: 'Ấn Tượng',
      badgeColor: 'bg-purple-600 text-white',
      tagline: 'Khối Banner thương hiệu cá nhân lớn kết hợp 2 cột dữ liệu cân đối',
      description: 'Header trải dài 100% bề ngang với dải màu chủ đạo, avatar nổi bật giao tầng và thanh liên hệ ngang. Thân trang chia 2 cột cân bằng 50/50 giúp bao quát toàn bộ thông tin.',
      features: ['Header Banner tràn viền cực kỳ ấn tượng', 'Bố cục thân 2 cột 50/50 cân đối', 'Dải liên hệ nhanh ngang tinh gọn'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex flex-col shadow-inner">
          <div className="h-14 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 p-1.5 flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-xl bg-purple-400 border-2 border-white shrink-0 shadow" />
            <div className="space-y-0.5 w-full">
              <div className="h-1.5 bg-white rounded-sm w-20" />
              <div className="h-1 bg-purple-200 rounded-sm w-28" />
              <div className="h-1 bg-white/40 rounded-sm w-16" />
            </div>
          </div>
          <div className="p-1.5 flex-1 grid grid-cols-2 gap-1.5 bg-white text-[6px]">
            <div className="border-r border-slate-100 pr-1 space-y-1">
              <div className="h-1.5 bg-slate-800 rounded-sm w-1/2" />
              <div className="h-4 bg-slate-50 border border-slate-200 rounded-sm" />
              <div className="h-4 bg-slate-50 border border-slate-200 rounded-sm" />
            </div>
            <div className="pl-1 space-y-1">
              <div className="h-1.5 bg-purple-700 rounded-sm w-1/2" />
              <div className="h-4 bg-slate-50 border border-slate-200 rounded-sm" />
              <div className="h-4 bg-slate-50 border border-slate-200 rounded-sm" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'modular-matrix',
      category: 'modern',
      name: 'Modular Matrix (Lưới Thẻ Độc Lập)',
      badge: 'Hiện Đại',
      badgeColor: 'bg-teal-600 text-white',
      tagline: 'Đóng gói dữ liệu thành các thẻ bo góc sắc nét, Dashboard 4.0',
      description: 'Từng phần thông tin được cấu trúc thành các thẻ card độc lập có bo góc và bóng đổ nhẹ. Trải nghiệm xem ngăn nắp, thoáng mắt, hiện đại chuẩn phong cách Web 4.0.',
      features: ['Lưới thẻ card đa tầng độc lập', 'Thẻ 4 KPI sản lượng to bản', 'Cấu trúc khối ngăn nắp, dễ đọc lướt'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 p-1.5 flex flex-col gap-1 shadow-inner">
          <div className="h-9 bg-white border border-slate-200 rounded-lg p-1 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-teal-600 shrink-0" />
            <div className="w-full space-y-0.5">
              <div className="h-1 bg-slate-900 rounded-sm w-20" />
              <div className="h-1 bg-teal-600 rounded-sm w-14" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <div className="h-4 bg-white border border-slate-200 rounded" />
            <div className="h-4 bg-white border border-slate-200 rounded" />
            <div className="h-4 bg-white border border-slate-200 rounded" />
            <div className="h-4 bg-white border border-slate-200 rounded" />
          </div>
          <div className="grid grid-cols-12 gap-1 flex-1">
            <div className="col-span-7 bg-white border border-slate-200 rounded-lg" />
            <div className="col-span-5 bg-white border border-slate-200 rounded-lg" />
          </div>
        </div>
      )
    },
    {
      id: 'minimalist',
      category: 'clean',
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
      id: 'clean-elegance',
      category: 'clean',
      name: 'Clean Elegance (Tối Giản Chuẩn Mực)',
      badge: 'Chuẩn Quốc Tế',
      badgeColor: 'bg-slate-800 text-white',
      tagline: '1 cột liền mạch chuẩn mực Harvard, tối ưu tuyệt đối cho in ấn PDF',
      description: 'Thiết kế tao nhã, phân chia các khối bằng đường kẻ hairline mảnh. Thời gian căn phải, vị trí căn trái chuẩn quốc tế, phù hợp làm việc với tập đoàn đa quốc gia.',
      features: ['Bố cục 1 cột liền mạch chuẩn ATS', 'Tối ưu tuyệt đối cho in ấn & xuất PDF', 'Đường kẻ hairline và phân cấp font sắc nét'],
      mockupPreview: (
        <div className="w-full h-36 bg-white rounded-xl overflow-hidden border border-slate-300 p-2 flex flex-col justify-between shadow-inner">
          <div className="border-b border-slate-200 pb-1 flex justify-between items-center">
            <div className="space-y-0.5">
              <div className="h-2 bg-slate-900 rounded-sm w-24" />
              <div className="h-1 bg-slate-500 rounded-sm w-32" />
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300" />
          </div>
          <div className="grid grid-cols-4 gap-1 py-1 border-b border-slate-100">
            <div className="h-3 bg-slate-50 border border-slate-200 rounded" />
            <div className="h-3 bg-slate-50 border border-slate-200 rounded" />
            <div className="h-3 bg-slate-50 border border-slate-200 rounded" />
            <div className="h-3 bg-slate-50 border border-slate-200 rounded" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-1.5 bg-slate-800 rounded-sm w-20" />
              <div className="h-1 bg-slate-400 rounded-sm w-12" />
            </div>
            <div className="h-1 bg-slate-200 rounded-sm w-full" />
            <div className="h-1 bg-slate-200 rounded-sm w-5/6" />
          </div>
        </div>
      )
    },
    {
      id: 'bold-compact',
      category: 'speed',
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
    {
      id: 'speed-hunter',
      category: 'speed',
      name: 'Speed Hunter (Chốt Deal Thần Tốc)',
      badge: 'Chốt Deal Nhanh',
      badgeColor: 'bg-rose-600 text-white',
      tagline: 'Tối ưu chuyển đổi với cam kết SLA 5 phút, nút liên hệ nổi bật & thế mạnh tuyến cước',
      description: 'Thiết kế định hướng hành động (Action-driven) cho Sales thị trường năng động. Nổi bật thanh trạng thái trực tuyến, đồng hồ cam kết phản hồi 5 phút và cụm nút gọi/Zalo chốt giá cước tức thì.',
      features: ['Thanh SLA cam kết phản hồi 5 - 10 phút', 'Nút Hotline & Zalo 1 chạm kích thước lớn', 'Lưới cước cạnh tranh & cam kết vỏ 100%'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex flex-col shadow-inner">
          <div className="h-4 bg-rose-700 p-0.5 px-1 flex items-center justify-between text-white text-[5px]">
            <span className="flex items-center gap-0.5 font-bold">● Trực tuyến 24/7</span>
            <span>SLA 5 phút</span>
          </div>
          <div className="p-1.5 bg-white flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-xl bg-slate-800 shrink-0" />
              <div className="space-y-0.5">
                <div className="h-1.5 bg-slate-900 rounded-sm w-16" />
                <div className="h-1 bg-rose-600 rounded-sm w-12" />
              </div>
            </div>
            <div className="h-5 px-2 bg-rose-600 rounded-lg text-white font-bold text-[6px] flex items-center">
              CALL
            </div>
          </div>
          <div className="p-1.5 bg-slate-50 flex-1 grid grid-cols-2 gap-1 text-[6px]">
            <div className="bg-white border border-slate-200 rounded p-1 space-y-0.5">
              <div className="h-1 bg-rose-600 rounded-sm w-10" />
              <div className="h-1 bg-slate-300 rounded-sm w-full" />
            </div>
            <div className="bg-white border border-slate-200 rounded p-1 space-y-0.5">
              <div className="h-1 bg-rose-600 rounded-sm w-10" />
              <div className="h-1 bg-slate-300 rounded-sm w-full" />
            </div>
          </div>
        </div>
      )
    },
  ];

  // 2. COMPANY LANDING PAGE TEMPLATES (TAB 2)
  const companyTemplates: TemplateOption<CompanyTemplateId>[] = [
    {
      id: 'corporate-flagship',
      name: 'Corporate Flagship Portal (Cổng Doanh Nghiệp)',
      badge: 'Khuyên Dùng ★',
      badgeColor: 'bg-blue-600 text-white',
      tagline: 'Bố cục 2 cột cân bằng: Cột pháp lý & Cột hạ tầng quy mô',
      description: 'Chuẩn mực nhận diện doanh nghiệp B2B với Header Banner thương hiệu, 4 chỉ số sản lượng cam kết, khối hạ tầng và mạng lưới đối tác rộng lớn.',
      features: ['Banner doanh nghiệp & Logo lớn', 'Thanh 4 KPI sản lượng ấn tượng', 'Khối hạ tầng xe tải & kho bãi', 'Mạng lưới đối tác & case studies'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex flex-col shadow-inner">
          {/* Top Banner */}
          <div className="h-10 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-1.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-white border border-blue-300 flex items-center justify-center text-blue-900 font-black text-[7px] shrink-0">
                FGO
              </div>
              <div>
                <div className="h-1.5 bg-white rounded-xs w-20 mb-0.5" />
                <div className="h-1 bg-blue-300 rounded-xs w-14" />
              </div>
            </div>
            <div className="px-1.5 py-0.5 bg-emerald-500 text-white rounded-full text-[6px] font-bold">
              Đã Xác Thực
            </div>
          </div>
          {/* KPI Strip */}
          <div className="bg-blue-50 px-2 py-1 border-b border-blue-100 grid grid-cols-4 gap-1 text-[6px]">
            <div className="bg-white rounded p-0.5 text-center font-bold text-blue-900 border border-blue-200">120K TEU</div>
            <div className="bg-white rounded p-0.5 text-center font-bold text-blue-900 border border-blue-200">450+ NV</div>
            <div className="bg-white rounded p-0.5 text-center font-bold text-blue-900 border border-blue-200">240+ Xe</div>
            <div className="bg-white rounded p-0.5 text-center font-bold text-blue-900 border border-blue-200">65K m²</div>
          </div>
          {/* 2-Column Body */}
          <div className="p-1.5 flex-1 flex gap-1.5 bg-white text-[6px]">
            <div className="w-1/3 bg-slate-50 rounded p-1 space-y-1 border border-slate-200">
              <div className="h-1 bg-slate-700 rounded-xs w-full font-bold" />
              <div className="h-0.5 bg-slate-300 rounded-xs w-4/5" />
              <div className="h-0.5 bg-slate-300 rounded-xs w-full" />
            </div>
            <div className="w-2/3 space-y-1">
              <div className="h-1 bg-indigo-600 rounded-xs w-1/3" />
              <div className="h-0.5 bg-slate-300 rounded-xs w-full" />
              <div className="h-0.5 bg-slate-300 rounded-xs w-5/6" />
              <div className="grid grid-cols-2 gap-1 mt-1">
                <div className="h-3 bg-slate-100 rounded border border-slate-200" />
                <div className="h-3 bg-slate-100 rounded border border-slate-200" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'modern-bento',
      name: 'Modern Bento Ecosystem (Hệ Sinh Thái Tech)',
      badge: 'Xu Hướng Mới',
      badgeColor: 'bg-emerald-600 text-white',
      tagline: 'Lưới Bento Box 12 cột, phân tầng nội dung trực quan sinh động',
      description: 'Phong cách thiết kế công nghệ cao tôn vinh hệ sinh thái dịch vụ, số liệu kỷ lục và các đối tác vận tải lớn như Maersk, Cosco, Vietnam Airlines.',
      features: ['Lưới thẻ Bento bất đối xứng đa tầng', 'Khối Tầm nhìn & Sứ mệnh tương phản', 'Trụ cột dịch vụ logistics động', 'Lưới đối tác & chứng chỉ FIATA/IATA'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-1.5 grid grid-cols-3 gap-1 shadow-inner">
          {/* Bento Header */}
          <div className="col-span-2 bg-slate-800 rounded-lg p-1.5 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[7px] shrink-0">
              LOG
            </div>
            <div className="space-y-0.5">
              <div className="h-1.5 bg-white rounded-xs w-24" />
              <div className="h-1 bg-emerald-400 rounded-xs w-16" />
            </div>
          </div>
          {/* KPI Bento Box */}
          <div className="col-span-1 bg-emerald-950/60 border border-emerald-500/30 rounded-lg p-1 flex flex-col justify-center items-center text-center">
            <div className="text-[8px] font-black text-emerald-400">120K+</div>
            <div className="text-[5px] text-emerald-200/70">TEUs / Year</div>
          </div>
          {/* Bento Vision & Mission */}
          <div className="col-span-1 bg-slate-800/90 border border-slate-700/60 rounded-lg p-1">
            <div className="h-1 bg-indigo-400 rounded-xs w-10 mb-0.5" />
            <div className="h-0.5 bg-slate-500 rounded-xs w-full" />
          </div>
          <div className="col-span-2 bg-slate-800/90 border border-slate-700/60 rounded-lg p-1 space-y-0.5">
            <div className="h-1 bg-emerald-400 rounded-xs w-12 mb-0.5" />
            <div className="h-0.5 bg-slate-400 rounded-xs w-full" />
            <div className="h-0.5 bg-slate-500 rounded-xs w-4/5" />
          </div>
          {/* Bento Pillars Strip */}
          <div className="col-span-3 bg-slate-800/60 rounded-lg p-1 flex gap-1">
            <div className="h-3 bg-slate-700 rounded-xs flex-1 border border-slate-600" />
            <div className="h-3 bg-slate-700 rounded-xs flex-1 border border-slate-600" />
            <div className="h-3 bg-slate-700 rounded-xs flex-1 border border-slate-600" />
          </div>
        </div>
      )
    },
    {
      id: 'minimalist',
      name: 'Minimalist Editorial (Báo Cáo Thường Niên)',
      badge: 'Thanh Lịch',
      badgeColor: 'bg-slate-700 text-white',
      tagline: 'Bố cục 1 cột kiểu Annual Report, tập trung thông điệp và uy tín',
      description: 'Tối giản các chi tiết đồ hoạ rườm rà, tập trung vào chiều sâu triết lý phát triển, bề dày lịch sử và cam kết SLA dịch vụ vận tải.',
      features: ['Typography phong cách tạp chí kinh tế', 'Dòng thời gian cột mốc phát triển', 'Trích dẫn thông điệp ban điều hành', 'Tối ưu trải nghiệm in & lưu PDF'],
      mockupPreview: (
        <div className="w-full h-36 bg-white rounded-xl overflow-hidden border border-slate-300 p-2 flex flex-col justify-between shadow-inner">
          <div className="border-b border-slate-200 pb-1 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[7px] font-serif font-black text-slate-900 tracking-tight">CÔNG TY LOGISTICS QUỐC TẾ</div>
              <div className="text-[5px] text-slate-500 italic">Bản cáo bạch năng lực hoạt động 2026</div>
            </div>
            <div className="w-5 h-5 rounded border border-slate-300 bg-slate-50 flex items-center justify-center text-[6px] font-bold text-slate-700">
              LOGO
            </div>
          </div>
          {/* Quote Block */}
          <div className="bg-slate-50 border-l-2 border-slate-800 p-1.5 my-1 space-y-0.5 text-[5.5px] italic text-slate-700">
            "Kiến tạo mạng lưới vận tải thông suốt kết nối Việt Nam với chuỗi cung ứng toàn cầu."
          </div>
          {/* Stats Bar */}
          <div className="border-t border-slate-100 pt-1 flex justify-between text-[6px] text-slate-800 font-bold">
            <div>120,000 TEU</div>
            <div>240+ Đầu Xe</div>
            <div>65,000 m² Kho</div>
            <div>450+ Nhân Sự</div>
          </div>
        </div>
      )
    },
    {
      id: 'industrial-impact',
      name: 'Industrial Impact (Năng Lực Vận Tải & Hạ Tầng)',
      badge: 'Hạ Tầng Lớn',
      badgeColor: 'bg-amber-600 text-white',
      tagline: 'Độ tương phản cao, tập trung đội xe tải, kho bãi & dự án lớn',
      description: 'Mẫu giao diện mang phong cách công nghiệp mạnh mẽ với gam màu than chì - hổ phách. Làm nổi bật tài sản thiết bị, hệ thống kho bãi và các case study hàng đầu.',
      features: ['Tone màu Heavy Duty mạnh mẽ', 'Card đội xe 240+ & 65,000m² kho', 'Case studies dự án điện mặt trời & lạnh', 'Huy hiệu FMC, C-TPAT & Hải quan'],
      mockupPreview: (
        <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden border border-amber-500/40 flex flex-col shadow-inner">
          {/* Heavy Header */}
          <div className="bg-slate-900 px-2 py-1.5 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[7px] shrink-0">
                FLEX
              </div>
              <div>
                <div className="h-1.5 bg-white rounded-xs w-20" />
                <div className="h-1 bg-amber-400 rounded-xs w-12 mt-0.5" />
              </div>
            </div>
            <div className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[5.5px] font-bold uppercase">
              Heavy Duty
            </div>
          </div>
          {/* Asset Stats Bar */}
          <div className="p-1.5 grid grid-cols-2 gap-1 bg-slate-900/60">
            <div className="bg-slate-800/90 border border-amber-500/30 rounded p-1 flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center text-[7px] shrink-0">🚛</div>
              <div>
                <div className="text-[6px] font-black text-amber-400">240+ Xe</div>
                <div className="text-[5px] text-slate-400">Đầu kéo & Tải</div>
              </div>
            </div>
            <div className="bg-slate-800/90 border border-amber-500/30 rounded p-1 flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[7px] shrink-0">🏢</div>
              <div>
                <div className="text-[6px] font-black text-blue-300">65K m²</div>
                <div className="text-[5px] text-slate-400">Kho thường & lạnh</div>
              </div>
            </div>
          </div>
          {/* Case Study Strip */}
          <div className="p-1.5 flex-1 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[6px]">
            <div className="text-amber-200/90 font-medium">✓ Dự án 600 Container Năng Lượng Mặt Trời</div>
            <div className="px-1 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">100% SLA</div>
          </div>
        </div>
      )
    },
  ];

  const currentSalemanTpl = salemanTemplates.find((t) => t.id === selectedTemplateId);
  const currentCompanyTpl = companyTemplates.find((t) => t.id === selectedCompanyTemplateId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-600" />
              <span>Kho Mẫu Giao Diện Studio (TopCV Style)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bạn có thể tự do chọn giao diện độc lập cho cả <strong className="text-slate-700">Hồ sơ Saleman</strong> và <strong className="text-slate-700">Landing Page Doanh Nghiệp</strong>. Dữ liệu đã nhập giữ nguyên 100%.
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

        {/* Dual Tab Switcher: Tab 1 (Saleman) vs Tab 2 (Company) */}
        <div className="px-6 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setModalTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
              modalTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. Mẫu Hồ Sơ Saleman (Cá Nhân)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              modalTab === 'profile' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {currentSalemanTpl?.name.split(' ')[0]}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('company')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
              modalTab === 'company'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>2. Mẫu Landing Page Doanh Nghiệp (Pháp Nhân)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              modalTab === 'company' ? 'bg-blue-900 text-blue-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {currentCompanyTpl?.name.split(' ')[0]}
            </span>
          </button>
        </div>

        {/* Color Palette Quick Switcher */}
        <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Tông màu chủ đạo đồng bộ:</span>
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

        {/* Category Filters (Chỉ hiển thị cho Tab 1: Mẫu Cá Nhân) */}
        {modalTab === 'profile' && (
          <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 mr-1">Phong cách:</span>
            {[
              { id: 'all', label: 'Tất Cả', count: salemanTemplates.length },
              { id: 'classic', label: 'Kinh Điển & Doanh Nghiệp', count: salemanTemplates.filter(t => t.category === 'classic').length },
              { id: 'modern', label: 'Hiện Đại & Thẻ Khối', count: salemanTemplates.filter(t => t.category === 'modern').length },
              { id: 'clean', label: 'Tối Giản Quốc Tế', count: salemanTemplates.filter(t => t.category === 'clean').length },
              { id: 'speed', label: 'Tốc Độ & Chốt Deal', count: salemanTemplates.filter(t => t.category === 'speed').length },
            ].map((cat) => {
              const isActive = salemanCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSalemanCategory(cat.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Template Grid (Dynamic based on modalTab) */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
          {modalTab === 'profile' ? (
            // ==================== TAB 1: SALEMAN TEMPLATES ====================
            (salemanCategory === 'all' 
              ? salemanTemplates 
              : salemanTemplates.filter(t => t.category === salemanCategory)
            ).map((tpl) => {
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
                        <span>Áp Dụng Mẫu Hồ Sơ Này</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            // ==================== TAB 2: COMPANY TEMPLATES ====================
            companyTemplates.map((tpl) => {
              const isSelected = selectedCompanyTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => onSelectCompanyTemplate?.(tpl.id)}
                  className={`group relative rounded-2xl bg-white p-5 border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                      : 'border-slate-200 hover:border-blue-300'
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
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                      Click để chọn mẫu
                    </span>
                  </div>

                  {/* Visual Mockup Preview */}
                  <div className="mb-3.5">
                    {tpl.mockupPreview}
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">
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
                        onSelectCompanyTemplate?.(tpl.id);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Mẫu Doanh Nghiệp Đang Dùng</span>
                        </>
                      ) : (
                        <span>Áp Dụng Mẫu Doanh Nghiệp Này</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span>
              Mẫu Saleman: <strong className="text-indigo-900">{currentSalemanTpl?.name}</strong>
            </span>
            <span>•</span>
            <span>
              Mẫu Doanh nghiệp: <strong className="text-blue-900">{currentCompanyTpl?.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Đóng & Tiếp Tục Chỉnh Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

