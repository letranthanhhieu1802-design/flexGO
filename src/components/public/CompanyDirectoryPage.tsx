import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Award,
  DollarSign,
  FileText,
  HelpCircle,
  Clock,
  Phone,
  Mail,
  Download,
  Check,
  Zap,
  TrendingUp,
  BarChart3,
  Scale,
  Lock,
  Layers,
  Send,
  Calendar,
  Truck,
  Ship,
  Plane,
  Warehouse,
  Briefcase,
  Share2,
  Copy,
  Percent,
  BadgeCheck,
  Calculator,
  Compass,
  BookOpen
} from 'lucide-react';
import { CurrentView, PublicTab } from '../../types';

interface CompanyDirectoryPageProps {
  onNavigate: (view: CurrentView) => void;
  initialSubTab?: 'about' | 'pricing' | 'resources' | 'trust' | 'contact';
}

export const CompanyDirectoryPage: React.FC<CompanyDirectoryPageProps> = ({ 
  onNavigate,
  initialSubTab = 'about'
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'pricing' | 'resources' | 'trust' | 'contact'>(initialSubTab);
  
  // Pricing tab state: 'shippers' | 'carriers'
  const [pricingTarget, setPricingTarget] = useState<'shippers' | 'carriers'>('shippers');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactTopic, setContactTopic] = useState('Enterprise Demo');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Free Tool Interactive States (CBM & Volumetric Calculator)
  const [toolLength, setToolLength] = useState<number>(120);
  const [toolWidth, setToolWidth] = useState<number>(80);
  const [toolHeight, setToolHeight] = useState<number>(100);
  const [toolQty, setToolQty] = useState<number>(10);
  const [toolActualWeight, setToolActualWeight] = useState<number>(500);

  const cbmResult = useMemo(() => {
    const singleCbm = (toolLength * toolWidth * toolHeight) / 1000000;
    const totalCbm = singleCbm * toolQty;
    const airVolWeight = (toolLength * toolWidth * toolHeight * toolQty) / 6000;
    const courierVolWeight = (toolLength * toolWidth * toolHeight * toolQty) / 5000;
    const seaChargeableWeight = totalCbm * 1000; // 1 CBM = 1,000 kg

    const airChargeable = Math.max(toolActualWeight, airVolWeight);
    const seaChargeable = Math.max(toolActualWeight, seaChargeableWeight);

    return {
      totalCbm: totalCbm.toFixed(3),
      airVolWeight: airVolWeight.toFixed(1),
      courierVolWeight: courierVolWeight.toFixed(1),
      airChargeable: airChargeable.toFixed(1),
      seaChargeable: seaChargeable.toFixed(1),
    };
  }, [toolLength, toolWidth, toolHeight, toolQty, toolActualWeight]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      showToast('Vui lòng nhập họ tên và email liên hệ!');
      return;
    }
    setIsSubmitted(true);
    showToast('Cảm ơn bạn! Chuyên viên FlexGO sẽ liên hệ lại trong vòng 15 phút.');
  };

  return (
    <div id="flexgo-company-page" className="min-h-screen bg-slate-50/70 pb-24 text-slate-800 animate-in fade-in duration-200">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          HERO BANNER: ABOUT FLEXGO ENTERPRISE PLATFORM
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
                FlexGO số hóa toàn diện quy trình đấu thầu RFQ, kết nối 10,000+ Doanh nghiệp Xuất Nhập Khẩu và 2,500+ Nhà vận tải, Hãng tàu uy tín. Giảm 20-35% chi phí logistics và tối ưu 100% tỷ lệ xe rỗng quay đầu.
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
            {[
              { id: 'about', label: '1. Về FlexGO (About Us)', icon: Building2 },
              { id: 'pricing', label: '2. Bảng Giá & Gói Nền Tảng (Pricing)', icon: DollarSign },
              { id: 'resources', label: '3. Tài Nguyên & Cẩm Nang (Resources)', icon: BookOpen },
              { id: 'trust', label: '4. Bảo Mật & Pháp Lý (Trust & Security)', icon: ShieldCheck },
              { id: 'contact', label: '5. Liên Hệ & Văn Phòng (Contact & Offices)', icon: Phone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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
          TAB 1: ABOUT FLEXGO (VỀ CHÚNG TÔI, SỨ MỆNH & ĐỘI NGŨ)
         ========================================================================= */}
      {activeTab === 'about' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in">
          {/* Mission & Vision Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-5">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sứ Mệnh Cốt Lõi</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Xóa bỏ rào cản thông tin và sự phân mảnh trong chuỗi cung ứng Việt Nam. Mang lại nền tảng minh bạch hóa 100% giá cước, giảm thiểu lãng phí xe chạy rỗng và nâng cao năng lực cạnh tranh cho doanh nghiệp xuất nhập khẩu.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tầm Nhìn 2030</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Trở thành Hệ điều hành Logistics (Logistics Operating System) dẫn đầu khu vực Đông Nam Á, kết nối thông suốt vận tải đường bộ xuyên biên giới, cảng biển nước sâu và chuỗi cung ứng lạnh đạt chuẩn quốc tế.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Giá Trị Cam Kết</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                100% Nhà cung cấp được thẩm định giấy phép & bảo hiểm. Bảo hiểm hàng hóa lên đến 5 Tỷ VND/vụ. Cam kết phản hồi RFQ dưới 15 phút và ứng dụng công nghệ IoT giám sát thời gian thực.
              </p>
            </div>
          </div>

          {/* Company Story & Differentiators */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Câu chuyện FlexGO</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Từ Trăn Trở Về Chi Phí Logistics Đến Nền Tảng Số Hóa Đột Phá
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tại Việt Nam, chi phí logistics từng chiếm tới 16.8% GDP — cao hơn đáng kể so với mức trung bình 10-12% của khu vực. Nguyên nhân lớn nhất đến từ việc thông tin phân mảnh, nhà xe chạy rỗng chiều về tới 60%, và quy trình đàm phán cước thủ công qua email/điện thoại tốn hàng giờ đồng hồ.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  FlexGO ra đời với mục tiêu hợp nhất toàn bộ quy trình: Từ <strong>Tạo đơn hỏi hàng (Inquiry/RFQ)</strong>, <strong>Phân tích báo giá đối chiếu tự động (Comparison Matrix)</strong>, đến <strong>Quản lý hợp đồng số & Thanh toán linh hoạt qua FlexCredit</strong>.
                </p>
                
                <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Tiết kiệm 20% - 35% chi phí cước</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Thời gian chốt xe nhanh gấp 4 lần</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Tích hợp bảo hiểm & hóa đơn VAT điện tử</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Đối soát công nợ Net 30/45 minh bạch</span>
                  </div>
                </div>
              </div>

              {/* Ecosystem Architecture Visual */}
              <div className="rounded-2xl bg-linear-to-br from-slate-900 to-indigo-950 p-6 sm:p-8 text-white space-y-4 border border-indigo-900/50 shadow-inner">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-orange-400" />
                  Kiến Trúc Hệ Sinh Thái FlexGO
                </h4>
                
                <div className="space-y-2.5 text-xs">
                  <div className="rounded-xl bg-white/10 p-3 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Truck className="h-4 w-4 text-orange-400" />
                      <span className="font-semibold">Shippers & Cargo Owners Hub</span>
                    </div>
                    <span className="text-indigo-200">Đăng RFQ, So sánh 5 báo giá</span>
                  </div>

                  <div className="rounded-xl bg-white/10 p-3 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span className="font-semibold">Live Freight Lead Board</span>
                    </div>
                    <span className="text-indigo-200">Khớp lệnh cung - cầu tức thời</span>
                  </div>

                  <div className="rounded-xl bg-white/10 p-3 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="h-4 w-4 text-blue-400" />
                      <span className="font-semibold">Vetted Logistics Providers & Sales Specialists</span>
                    </div>
                    <span className="text-indigo-200">Profile chuyên sâu & Rate Card</span>
                  </div>

                  <div className="rounded-xl bg-white/10 p-3 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Scale className="h-4 w-4 text-amber-400" />
                      <span className="font-semibold">FlexCredit & Smart Escrow Settlement</span>
                    </div>
                    <span className="text-indigo-200">Bảo lãnh giao dịch an toàn</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="w-full rounded-xl bg-orange-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-orange-600 transition-colors"
                  >
                    Xem Bảng Giá Dịch Vụ Nền Tảng →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership & Advisors */}
          <div>
            <div className="mb-6 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Đội ngũ sáng lập & Cố vấn</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Kinh Nghiệm Chuyên Gia Vận Hành & Công Nghệ Hàng Đầu
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'TS. Nguyễn Hữu Dũng',
                  role: 'Co-Founder & Chief Executive Officer',
                  exp: '18+ năm kinh nghiệm quản trị chuỗi cung ứng tại Maersk & DHL Global Forwarding.',
                  avatar: 'HD'
                },
                {
                  name: 'Lê Minh Quân',
                  role: 'Co-Founder & Chief Technology Officer',
                  exp: 'Cựu Kiến trúc sư Giải pháp cao cấp tại Grab & Shopee Logistics.',
                  avatar: 'MQ'
                },
                {
                  name: 'Trần Thị Thu Hương',
                  role: 'VP of Commercial & Key Accounts',
                  exp: 'Chuyên gia đàm phán hợp đồng logistics cấp tập đoàn đa quốc gia (FMCG, Điện tử).',
                  avatar: 'TH'
                },
                {
                  name: 'Phạm Đức Hoàng',
                  role: 'Head of Carrier Relations & Quality Audit',
                  exp: 'Chuyên gia giám định chất lượng vận tải & chính sách bảo hiểm vận tải quốc tế.',
                  avatar: 'DH'
                },
              ].map((member, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-300 transition-all text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-lg mb-3 shadow-md">
                    {member.avatar}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{member.exp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FLEXGO PLATFORM PRICING & SUBSCRIPTION (BẢNG GIÁ NỀN TẢNG)
         ========================================================================= */}
      {activeTab === 'pricing' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in">
          {/* Pricing Header & Audience Switcher */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Chính Sách Giá Minh Bạch • Không Chi Phí Ẩn
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Lựa Chọn Gói Dịch Vụ Phù Hợp Cho Doanh Nghiệp
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              FlexGO cung cấp các gói dịch vụ tối ưu riêng biệt cho <strong>Chủ Hàng (Shippers)</strong> và <strong>Nhà Vận Tải (Carriers / 3PLs)</strong> với cam kết hoàn vốn ROI vượt trội.
            </p>

            {/* Audience Toggle & Billing Toggle */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex rounded-xl bg-slate-200/80 p-1">
                <button
                  onClick={() => setPricingTarget('shippers')}
                  className={`rounded-lg px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    pricingTarget === 'shippers'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  📦 Dành Cho Chủ Hàng (Shippers)
                </button>
                <button
                  onClick={() => setPricingTarget('carriers')}
                  className={`rounded-lg px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    pricingTarget === 'carriers'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  🚚 Dành Cho Nhà Vận Tải (Carriers/3PL)
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>Hàng tháng</span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                    billingCycle === 'annual' ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="flex items-center gap-1">
                  <span>Theo năm</span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Tiết kiệm 20%
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          {pricingTarget === 'shippers' ? (
            /* SHIPPERS PLANS */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Starter (Free) */}
              <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gói Khởi Động</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">Miễn phí vĩnh viễn</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Shipper Starter</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dành cho các doanh nghiệp vừa và nhỏ bắt đầu tìm kiếm thêm nhà xe uy tín để tối ưu chi phí cước.
                  </p>

                  <div className="py-2">
                    <span className="text-3xl font-black text-slate-900">0 VND</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Không giới hạn thời gian sử dụng</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Tính năng bao gồm:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Đăng tới <strong>10 RFQ/tháng</strong> lên Lead Board</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Nhận tối đa <strong>3 báo giá</strong> cạnh tranh từ nhà xe</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>So sánh báo giá cơ bản (Giá cước & Thời gian)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Hỗ trợ kỹ thuật qua Email & Help Center</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate({ type: 'workspace', view: 'customer-inquiries' })}
                    className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    Bắt Đầu Miễn Phí Ngay
                  </button>
                </div>
              </div>

              {/* Professional (Popular) */}
              <div className="relative flex flex-col justify-between rounded-3xl border-2 border-indigo-600 bg-white p-7 shadow-xl">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  ⭐ Được Doanh Nghiệp Lựa Chọn Nhiều Nhất
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Doanh Nghiệp Tiêu Chuẩn</span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">Pro Business</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Shipper Pro</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tối ưu toàn diện cho các nhà máy, công ty thương mại và đại lý xuất nhập khẩu có nhu cầu vận chuyển thường xuyên.
                  </p>

                  <div className="py-2">
                    <span className="text-3xl font-black text-indigo-700">
                      {billingCycle === 'annual' ? '1,590,000' : '1,990,000'}
                    </span>
                    <span className="text-xs text-slate-500"> VND / tháng</span>
                    <span className="text-[11px] text-emerald-600 block mt-0.5">
                      {billingCycle === 'annual' ? 'Thanh toán 19,080,000 VND / năm (Tiết kiệm 20%)' : 'Thanh toán linh hoạt từng tháng'}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Đặc quyền nâng cao:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Đăng RFQ không giới hạn</strong> (Đường bộ, Biển, Lạnh, Air)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Nhận <strong>không giới hạn báo giá</strong> từ Verified Carriers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Ma Trận So Sánh Nâng Cao</strong> (Bóc tách THC, BAF, BOT, SLA)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Đấu thầu cước hợp đồng nguyên tắc (Tuyến cố định 6 - 12 tháng)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Hỗ trợ phê duyệt công nợ linh hoạt <strong>Net 30 Ngày</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setContactTopic('Đăng ký Gói Shipper Pro');
                      setActiveTab('contact');
                    }}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    Dùng Thử 14 Ngày Miễn Phí
                  </button>
                </div>
              </div>

              {/* Enterprise Suite */}
              <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tập Đoàn Lớn</span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">Custom SLA</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Shipper Enterprise</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Giải pháp may đo chuyên sâu cho các tập đoàn FMCG, chuỗi bán lẻ và nhà máy sản xuất quy mô lớn.
                  </p>

                  <div className="py-2">
                    <span className="text-3xl font-black text-slate-900">Liên Hệ</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Báo giá theo sản lượng vận tải thực tế</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Toàn bộ tính năng Pro, cộng thêm:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Tích hợp <strong>API / EDI với ERP</strong> (SAP, Oracle, Odoo)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Chuyên viên <strong>Key Account Manager (KAM)</strong> hỗ trợ 24/7</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Hạn mức bảo lãnh công nợ mở rộng <strong>Net 45 - 60 Ngày</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Báo cáo phân tích cước độc quyền & Giảm phát thải CO2 (ESG)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setContactTopic('Tư vấn Gói Shipper Enterprise');
                      setActiveTab('contact');
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    Đặt Lịch Tư Vấn Enterprise 1:1
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* CARRIERS & 3PL PLANS */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Pay-as-you-go */}
              <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Linh Hoạt</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">Nạp FlexCredit</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Carrier FlexPay</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dành cho các chủ xe tải cá thể, đội xe nhỏ muốn chủ động mở khóa các lead RFQ phù hợp khi cần xe.
                  </p>

                  <div className="py-2">
                    <span className="text-3xl font-black text-slate-900">0 VND</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Không phí duy trì hàng tháng • Trả theo đơn mở</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Cơ chế vận hành:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Xem thông tin tóm tắt tuyến hàng trên Lead Board miễn phí</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Mở khóa liên hệ chủ hàng bằng FlexCredit (50k - 200k/lead)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Hoa hồng giao dịch: <strong>0%</strong> (Chủ hàng trả trực tiếp)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-add' })}
                    className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    Nạp FlexCredit Ngay
                  </button>
                </div>
              </div>

              {/* Verified Carrier Partner */}
              <div className="relative flex flex-col justify-between rounded-3xl border-2 border-orange-500 bg-white p-7 shadow-xl">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-0.5 text-[11px] font-bold text-slate-950 shadow-sm">
                  🔥 Tối Ưu Doanh Số & Nhận RFQ Độc Quyền
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Đối Tác Thẩm Định</span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">Verified Partner</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Carrier Pro Partner</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dành cho các công ty vận tải, forwarder, hãng tàu muốn gia tăng nguồn hàng và xây dựng uy tín thương hiệu trên sàn.
                  </p>

                  <div className="py-2">
                    <span className="text-3xl font-black text-orange-600">
                      {billingCycle === 'annual' ? '1,990,000' : '2,490,000'}
                    </span>
                    <span className="text-xs text-slate-500"> VND / tháng</span>
                    <span className="text-[11px] text-emerald-600 block mt-0.5">
                      Tặng ngay <strong>100 FlexCredits</strong> mỗi tháng vào tài khoản
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Đặc quyền dành riêng:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Huy hiệu <strong>Verified Supplier & Preferred Partner</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Ưu tiên hiển thị</strong> tại Thư viện Nhà cung cấp & Báo giá</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Nhận thông báo RFQ độc quyền qua Zalo OA & Email tức thời</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Trang <strong>Profile Chuyên Viên & Bảng Giá Tuyến Riêng Biệt</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setContactTopic('Đăng ký Trở thành Verified Carrier Partner');
                      setActiveTab('contact');
                    }}
                    className="w-full rounded-xl bg-orange-500 py-3 text-xs font-bold text-slate-950 hover:bg-orange-600 shadow-md transition-all"
                  >
                    Đăng Ký Đối Tác Thẩm Định
                  </button>
                </div>
              </div>

              {/* Master Freight Hub */}
              <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Đội Xe Lớn & 3PL</span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">Full Integration</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Fleet Master 3PL</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dành cho các tổng công ty logistics có 50+ đầu xe hoặc hệ thống kho bãi trên 10,000m².
                  </p>

                  <div className="py-2">
                    <span className="text-3xl font-black text-slate-900">Liên Hệ</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Tùy biến theo quy mô đội xe & kho bãi</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Đặc quyền cấp cao:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Tự động phân phối lead vào hệ thống <strong>TMS/CRM riêng</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Được đề xuất ưu tiên trong các gói thầu dự án Enterprise của FlexGO</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Báo cáo dự báo cung - cầu và biến động giá cước tuyến độc quyền</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setContactTopic('Tư vấn Gói Fleet Master 3PL');
                      setActiveTab('contact');
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    Tư Vấn Hợp Tác Chiến Lược
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing FAQ Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              Câu Hỏi Thường Gặp Về Chi Phí & Bảng Giá FlexGO
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">Chủ hàng (Shipper) đăng yêu cầu RFQ có mất phí không?</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Hoàn toàn không. Chủ hàng có thể đăng tìm xe và nhận báo giá miễn phí. Gói Pro dành cho doanh nghiệp muốn tự động hóa so sánh giá chi tiết và quản lý công nợ dài hạn.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">FlexGO có thu hoa hồng trên mỗi chuyến hàng không?</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  FlexGO áp dụng mô hình 0% hoa hồng trên giá trị cước vận chuyển chuẩn. Toàn bộ tiền cước được chủ hàng thanh toán trực tiếp cho nhà xe theo thỏa thuận hợp đồng.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">FlexCredit trong tài khoản có thời hạn sử dụng không?</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Số dư FlexCredit được bảo lưu vĩnh viễn và không bao giờ hết hạn. Nhà xe có thể sử dụng bất cứ lúc nào để mở thông tin các RFQ tiềm năng.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">Làm thế nào để được cấp hạn mức công nợ Net 30/45?</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Doanh nghiệp Shipper chỉ cần tải lên báo cáo tài chính và hồ sơ doanh nghiệp. Ban thẩm định tín dụng của FlexGO sẽ phê duyệt hạn mức trong vòng 24 giờ làm việc.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: RESOURCES & KNOWLEDGE HUB (TÀI NGUYÊN, WHITE PAPERS & CÔNG CỤ FREE)
         ========================================================================= */}
      {activeTab === 'resources' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Thư Viện Tri Thức & Công Cụ</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Tài Nguyên Chuyên Sâu Dành Cho Dân Logistics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cập nhật biểu cước thị trường, mẫu hợp đồng pháp lý và các công cụ tính toán quy đổi cước hoàn toàn miễn phí.
            </p>
          </div>

          {/* Interactive Tool: CBM & Volumetric Weight Calculator */}
          <div className="rounded-3xl border border-indigo-200 bg-white p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                  <Calculator className="h-3.5 w-3.5" />
                  Công Cụ Miễn Phí
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Tính Thể Tích CBM & Trọng Lượng Thể Tích Tính Cước (Chargeable Weight)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Chuẩn IATA & Cước Hàng Không / Đường Biển</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inputs */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chiều Dài (cm):</label>
                  <input
                    type="number"
                    value={toolLength}
                    onChange={(e) => setToolLength(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chiều Rộng (cm):</label>
                  <input
                    type="number"
                    value={toolWidth}
                    onChange={(e) => setToolWidth(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chiều Cao (cm):</label>
                  <input
                    type="number"
                    value={toolHeight}
                    onChange={(e) => setToolHeight(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số Lượng Kiện:</label>
                  <input
                    type="number"
                    value={toolQty}
                    onChange={(e) => setToolQty(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Tổng Trọng Lượng Thực Tế (Gross Weight - kg):</label>
                  <input
                    type="number"
                    value={toolActualWeight}
                    onChange={(e) => setToolActualWeight(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Results Breakdown */}
              <div className="rounded-2xl bg-slate-900 p-5 text-white space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 block">Kết Quả Tính Toán Tự Động:</span>
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-300">Tổng Thể Tích (CBM):</span>
                  <span className="text-base font-black text-white">{cbmResult.totalCbm} m³</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-300">Tính Cước Hàng Không (Air):</span>
                  <span className="text-sm font-bold text-indigo-300">{cbmResult.airChargeable} kg</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-300">Tính Cước Chuyển Phát (Courier):</span>
                  <span className="text-sm font-bold text-emerald-300">{cbmResult.courierVolWeight} kg</span>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block">
                    *Quy tắc cước: Hãng hàng không sẽ tính cước dựa trên số lớn hơn giữa Trọng lượng thực tế và Trọng lượng thể tích.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Whitepapers & Industry Reports */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Báo Cáo & Cẩm Nang Logistics Độc Quyền (Tải Miễn Phí)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Báo Cáo Xu Hướng Giá Cước Logistics Q1/2026',
                  desc: 'Phân tích biến động cước FCL/FTL các tuyến Bắc - Nam, Cảng Cát Lái, Cái Mép và Đình Vũ sau điều chỉnh giá nhiên liệu.',
                  pages: '38 Trang PDF',
                  downloads: '2,400+ Lượt tải',
                  badge: 'Mới nhất 2026'
                },
                {
                  title: 'Cẩm Nang Tối Ưu Chuỗi Cung Ứng Lạnh Nông Sản',
                  desc: 'Hướng dẫn thiết lập dải nhiệt độ -18°C đến +4°C, tiêu chuẩn sơ chế và giám sát Data Logger GPS cho hàng thủy sản và sầu riêng xuất khẩu.',
                  pages: '24 Trang PDF',
                  downloads: '1,850+ Lượt tải',
                  badge: 'Chuyên ngành'
                },
                {
                  title: 'Mẫu Hợp Đồng Nguyên Tắc Vận Tải 2026 Chuẩn Pháp Lý',
                  desc: 'Bộ mẫu hợp đồng chuẩn quy định rõ trách nhiệm bồi thường tổn thất hàng hóa, miễn trừ bất khả kháng và điều khoản công nợ Net 30/45.',
                  pages: 'File Word .docx',
                  downloads: '4,200+ Lượt tải',
                  badge: 'Pháp lý'
                },
              ].map((doc, i) => (
                <div key={i} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        {doc.badge}
                      </span>
                      <span className="text-[11px] text-slate-400">{doc.pages}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{doc.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{doc.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{doc.downloads}</span>
                    <button
                      onClick={() => showToast(`Đang tải tài liệu: ${doc.title}...`)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Tải Về</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TRUST, SECURITY & COMPLIANCE (BẢO MẬT & PHÁP LÝ)
         ========================================================================= */}
      {activeTab === 'trust' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              An Toàn Tuyệt Đối • Đối Tác Được Bảo Chứng
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Tiêu Chuẩn Thẩm Định & Bảo Mật Dữ Liệu FlexGO
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Chúng tôi bảo vệ quyền lợi của cả Chủ Hàng và Nhà Vận Tải bằng quy trình pháp lý nghiêm ngặt và gói bảo hiểm hàng hóa toàn diện.
            </p>
          </div>

          {/* 5-Step Verification Process */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Quy Trình 5 Bước Thẩm Định Nhà Vận Tải (Carrier Vetting Framework)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: '01', title: 'Giấy Phép Kinh Doanh', desc: 'Kiểm tra mã số thuế, giấy phép kinh doanh vận tải bằng xe ô tô và tình trạng hoạt động hợp pháp.' },
                { step: '02', title: 'Kiểm Định & Đăng Ký Xe', desc: 'Xác minh hồ sơ đăng kiểm, phù hiệu xe tải/container hợp lệ và bảo hiểm TNDS bắt buộc.' },
                { step: '03', title: 'Hồ Sơ Tài Xế & Bằng Lái', desc: 'Kiểm tra bằng lái hạng C/FC, lịch sử an toàn giao thông và cam kết không vi phạm nồng độ cồn.' },
                { step: '04', title: 'Gói Bảo Hiểm Trách Nhiệm', desc: 'Ký hợp đồng bảo hiểm hàng hóa vận chuyển nội địa với đối tác Bảo Việt / PTI bảo lãnh tới 5 Tỷ VND.' },
                { step: '05', title: 'Ký Hợp Đồng Nguyên Tắc', desc: 'Ký kết cam kết SLA giao hàng đúng hẹn, quy trình xử lý sự cố và bồi hoàn đền bù 100% trong 48h.' },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 relative">
                  <span className="text-2xl font-black text-indigo-200 block">{item.step}</span>
                  <h4 className="font-bold text-slate-900 text-xs mt-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Data Privacy Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Bảo Mật Dữ Liệu Cấp Ngân Hàng</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Hệ thống tuân thủ chuẩn ISO/IEC 27001 và mã hóa toàn bộ dữ liệu đường truyền bằng giao thức SSL/TLS 256-bit. Tuyệt đối không chia sẻ bảng giá nội bộ của doanh nghiệp cho bên thứ ba.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Cơ Chế Ký Quỹ & Bảo Lãnh Smart Escrow</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Tiền cọc hoặc thanh toán qua FlexCredit được giữ an toàn tại tài khoản bảo lãnh trung gian và chỉ giải ngân cho nhà xe khi có chữ ký xác nhận biên bản giao nhận POD điện tử đầy đủ.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-4">
                <Scale className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Trọng Tài Giải Quyết Khiếu Nại 24/7</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Đội ngũ chuyên viên pháp chế và giám định viên hiện trường của FlexGO có mặt tại các cụm cảng và KCN trọng điểm để giải quyết khiếu nại phát sinh trong vòng 2 giờ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CONTACT & OFFICES (LIÊN HỆ & VĂN PHÒNG ĐẠI DIỆN)
         ========================================================================= */}
      {activeTab === 'contact' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 5 Cols: Contact Information & Office Network */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Mạng Lưới Toàn Quốc</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Liên Hệ Với FlexGO</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đội ngũ chuyên viên tư vấn giải pháp luôn sẵn sàng đồng hành cùng doanh nghiệp 24/7.
                </p>
              </div>

              {/* Contact Channels */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tổng đài hỗ trợ 24/7:</span>
                    <span className="font-bold text-slate-900 text-sm">1900 6868 • 0908 123 456</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email phòng kinh doanh & hỗ trợ:</span>
                    <span className="font-bold text-slate-900">contact@flexgo.vn • enterprise@flexgo.vn</span>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Văn Phòng Đại Diện:</h4>
                
                {[
                  { city: 'Trụ sở chính TP. Hồ Chí Minh', addr: 'Tầng 18, Tòa nhà Landmark 81, 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP.HCM', phone: '028 7300 8888' },
                  { city: 'Chi nhánh Hà Nội', addr: 'Tầng 12, Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội', phone: '024 7300 8888' },
                  { city: 'Văn phòng Cảng Hải Phòng', addr: 'Tòa nhà Cảng Đình Vũ, Lô 1A KCN Đình Vũ, Q. Hải An, Hải Phòng', phone: '0225 730 8888' },
                  { city: 'Chi nhánh Đà Nẵng', addr: 'Tầng 6, Danang Software Park, 02 Quang Trung, Q. Hải Châu, Đà Nẵng', phone: '0236 730 8888' },
                ].map((office, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        {office.city}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">{office.phone}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-5">{office.addr}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 7 Cols: Inquiry & Demo Request Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Gửi Yêu Cầu Tư Vấn Hoặc Đặt Lịch Demo Trực Tiếp
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Điền thông tin bên dưới để chuyên viên giải pháp FlexGO liên hệ và tư vấn phương án tối ưu cước cho doanh nghiệp.
                </p>

                {isSubmitted ? (
                  <div className="rounded-2xl bg-emerald-50 p-8 text-center border border-emerald-200 space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-7 w-7" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-900">Đã Nhận Yêu Cầu Thành Công!</h4>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                      Chuyên viên Key Account của FlexGO sẽ gọi điện thoại hoặc gửi email phản hồi đến bạn trong vòng 15 phút.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Gửi Thêm Yêu Cầu Khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContact} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Họ và Tên *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Email Doanh Nghiệp *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="email@company.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Số Điện Thoại / Zalo *</label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="0908 xxx xxx"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tên Công Ty / Đơn Vị</label>
                        <input
                          type="text"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          placeholder="Công ty TNHH Sản Xuất..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nội Dung Cần Hỗ Trợ</label>
                      <select
                        value={contactTopic}
                        onChange={(e) => setContactTopic(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="Enterprise Demo">Đặt lịch Demo Hệ thống cho Doanh nghiệp</option>
                        <option value="Đăng ký Gói Shipper Pro">Tư vấn Gói Shipper Pro & Đấu thầu RFQ</option>
                        <option value="Trở thành Nhà Vận Tải Thẩm Định">Đăng ký Trở thành Verified Carrier / 3PL Partner</option>
                        <option value="Tích hợp API ERP">Yêu cầu Tích hợp API / EDI với ERP</option>
                        <option value="Khác">Nội dung khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Chi Tiết Nhu Cầu & Sản Lượng Vận Tải Dự Kiến</label>
                      <textarea
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Mô tả các tuyến vận chuyển trọng điểm, loại hàng hóa, tần suất chuyến hoặc các thắc mắc của bạn..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
