import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  BookOpen, 
  ShieldCheck, 
  Phone, 
  ChevronRight,
  Sparkles,
  Clock
} from 'lucide-react';
import { CurrentView } from '../../types';

interface CompanyDirectoryPageProps {
  onNavigate: (view: CurrentView) => void;
  initialSubTab?: 'about' | 'pricing' | 'resources' | 'trust' | 'contact';
}

export const CompanyDirectoryPage: React.FC<CompanyDirectoryPageProps> = ({ 
  initialSubTab = 'about'
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'pricing' | 'resources' | 'trust' | 'contact'>(initialSubTab);

  const tabList = [
    { id: 'about', label: '1. Về flexGO', icon: Building2 },
    { id: 'pricing', label: '2. Bảng Giá', icon: DollarSign },
    { id: 'resources', label: '3. Tài Nguyên', icon: BookOpen },
    { id: 'trust', label: '4. Điều khoản & Pháp Lý', icon: ShieldCheck },
    { id: 'contact', label: '5. Liên Hệ', icon: Phone },
  ] as const;

  const currentTab = tabList.find((t) => t.id === activeTab) || tabList[0];

  return (
    <div id="flexgo-company-page" className="min-h-screen bg-slate-50/70 pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* =========================================================================
          HERO BANNER: COMPANY & ECOSYSTEM HUB
         ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-950 text-white border-b border-indigo-950/60 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        
        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300/80 mb-4 uppercase tracking-wider">
            <span>FlexGO Network</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-400">Company & Ecosystem Hub</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-semibold text-indigo-300 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Nền tảng Quản trị & Sàn Giao Dịch Vận Tải Logistics B2B Số 1 Việt Nam</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Kiến tạo Hệ sinh thái Logistics{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-300">
                  Minh bạch & Tối ưu năng lực
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                FlexGO số hóa toàn diện quy trình đấu thầu RFQ, kết nối Doanh nghiệp Xuất Nhập Khẩu và Nhà vận tải, Hãng tàu uy tín. Giảm thiểu chi phí logistics và tối ưu năng lực vận hành.
              </p>
            </div>

            {/* Quick Metrics Badge Card */}
            <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-md shrink-0 lg:w-96">
              <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                <span className="text-xs text-indigo-200 block">Doanh nghiệp Shippers</span>
                <span className="text-xl sm:text-2xl font-black text-white mt-1 block">10,000+</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                <span className="text-xs text-orange-200 block">Đội xe & Kho thẩm định</span>
                <span className="text-xl sm:text-2xl font-black text-orange-400 mt-1 block">2,500+</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                <span className="text-xs text-emerald-200 block">Tỷ lệ đúng hẹn (SLA)</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">99.4%</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                <span className="text-xs text-blue-200 block">Giá trị giao dịch (GMV)</span>
                <span className="text-xl sm:text-2xl font-black text-blue-400 mt-1 block">$500M+</span>
              </div>
            </div>
          </div>

          {/* Core Sub-Tabs Navigation Bar */}
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            {tabList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`company-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20'
                      : 'bg-white/10 text-slate-200 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTENT SECTION: UPDATING PLACEHOLDER
         ========================================================================= */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 sm:p-14 shadow-xs text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
            <Clock className="w-8 h-8 animate-pulse text-orange-500" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentTab.label}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mt-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Updating... (Nội dung đang được cập nhật)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed pt-2">
            Trang thông tin chính thức của mục <strong>{currentTab.label}</strong> đang được ban quản trị FlexGO hoàn thiện và sẽ sớm phát hành tới Quý khách hàng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDirectoryPage;
