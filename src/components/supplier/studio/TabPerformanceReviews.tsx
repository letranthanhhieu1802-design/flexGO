import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Eye, 
  FileText, 
  Send, 
  Trophy, 
  DollarSign, 
  Users, 
  Activity, 
  Filter, 
  CornerDownRight, 
  ThumbsUp, 
  ArrowUpRight 
} from 'lucide-react';
import { StudioTemplateConfig, THEME_COLOR_OPTIONS } from './studioTypes';

interface TestimonialItem {
  id: string;
  clientName: string;
  clientCompany: string;
  clientTitle: string;
  rating: number;
  date: string;
  serviceUsed: string;
  comment: string;
  supplierReply?: string;
  isFeatured?: boolean;
}

interface TabPerformanceReviewsProps {
  config: StudioTemplateConfig;
}

export const TabPerformanceReviews: React.FC<TabPerformanceReviewsProps> = ({ config }) => {
  const theme = THEME_COLOR_OPTIONS[config.themeColor];

  // 1. Weekly views data
  const weeklyViewsData = [
    { day: 'T2', fullDay: 'Thứ Hai', views: 390, height: 'h-14', isPeak: false },
    { day: 'T3', fullDay: 'Thứ Ba', views: 420, height: 'h-15', isPeak: false },
    { day: 'T4', fullDay: 'Thứ Tư', views: 430, height: 'h-15', isPeak: false },
    { day: 'T5', fullDay: 'Thứ Năm', views: 470, height: 'h-16', isPeak: false },
    { day: 'T6', fullDay: 'Thứ Sáu (Đỉnh điểm)', views: 680, height: 'h-20', isPeak: true },
    { day: 'T7', fullDay: 'Thứ Bảy', views: 380, height: 'h-14', isPeak: false },
    { day: 'CN', fullDay: 'Chủ Nhật', views: 240, height: 'h-10', isPeak: false },
  ];

  // 2. Industry distribution data
  const industryDistribution = [
    { name: 'FDI & Thiết bị điện tử', percentage: 38, color: 'bg-blue-600', textColor: 'text-blue-700' },
    { name: 'Nông sản & Thủy hải sản lạnh', percentage: 27, color: 'bg-sky-500', textColor: 'text-sky-700' },
    { name: 'FMCG & Bán lẻ đa kênh', percentage: 21, color: 'bg-amber-500', textColor: 'text-amber-700' },
    { name: 'Dệt may, Gỗ & Cơ khí', percentage: 14, color: 'bg-purple-600', textColor: 'text-purple-700' },
  ];

  // 3. Testimonials Data
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    {
      id: 'test-1',
      clientName: 'Nguyễn Hải Đăng',
      clientCompany: 'Công Ty Cổ Phần Nông Sản Xuất Khẩu An Phát',
      clientTitle: 'Trưởng Phòng Xuất Nhập Khẩu',
      rating: 5,
      date: '15/08/2025',
      serviceUsed: 'Chuỗi Cung Ứng Lạnh Reefer (Cát Lái ➔ Thượng Hải)',
      comment: 'Anh Minh tư vấn và giữ space tàu cực kỳ uy tín vào đúng mùa cao điểm thanh long. Hàng đi nhiệt độ ổn định -18°C, thông quan hai đầu không phát sinh bất kỳ chi phí ẩn nào. Rất yên tâm hợp tác lâu dài!',
      supplierReply: 'Cảm ơn anh Đăng và công ty An Phát đã tin tưởng VinaTrans! Rất mong được tiếp tục đồng hành cùng các lô hàng trái cây sắp tới.',
      isFeatured: true,
    },
    {
      id: 'test-2',
      clientName: 'Sarah Jenkins',
      clientCompany: 'TechComponents Asia Ltd.',
      clientTitle: 'Global Logistics Procurement Director',
      rating: 5,
      date: '02/07/2025',
      serviceUsed: 'Vận Chuyển FCL Trans-Pacific (Cái Mép ➔ Los Angeles)',
      comment: 'Alex Minh and his operations team delivered exceptional service during the peak retail season. Real-time GPS tracking and zero container rollings. Highly recommended for any multinational enterprise.',
      supplierReply: 'Thank you Sarah! Delivering reliable supply chain SLA is always our top priority.',
      isFeatured: true,
    },
    {
      id: 'test-3',
      clientName: 'Lê Hoàng Nam',
      clientCompany: 'Nhựa Kỹ Thuật Tân Tiến',
      clientTitle: 'Giám Đốc Chuỗi Cung Ứng',
      rating: 5,
      date: '20/05/2025',
      serviceUsed: 'Vận Tải Đường Bộ FTL Tuyến Bắc - Nam (KCN Sóng Thần ➔ KCN Đình Vũ)',
      comment: 'Đội xe 15 tấn thùng kín rất mới và chuyên nghiệp, tài xế cập nhật vị trí đều đặn qua Zalo nhóm. Đạt chuẩn 100% thời gian giao nhận 48 giờ.',
      isFeatured: false,
    },
  ]);

  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, supplierReply: replyText.trim() } : t))
    );
    setReplyingId(null);
    setReplyText('');
  };

  const handleToggleFeatured = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFeatured: !t.isFeatured } : t))
    );
  };

  const filteredTestimonials = testimonials.filter((t) =>
    filterRating === 'ALL' ? true : t.rating === filterRating
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* =========================================================================
          SECTION 1: HỆ THỐNG CHỈ SỐ HOẠT ĐỘNG TRÊN HỆ THỐNG (AS IN REFERENCE)
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        
        {/* Header with verified badge & real-time update dot */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Hệ Thống Chỉ Số Hoạt Động Trên Hệ Thống
                </h2>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full flex items-center gap-1 shadow-2xs">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xác thực Real-time</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiệu suất xử lý yêu cầu, điều phối cước và mức độ tín nhiệm từ cộng đồng chủ hàng doanh nghiệp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0 self-start md:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Cập nhật liên tục từ hệ thống sàn flexGO</span>
          </div>
        </div>

        {/* Row of 6 Distinct Activity Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* Card 1: PROFILE VIEWS */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                PROFILE VIEWS
              </span>
              <Eye className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                12.390
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500 font-medium">Lượt xem hồ sơ</span>
              <span className="font-bold text-emerald-600">+22.7%</span>
            </div>
          </div>

          {/* Card 2: INQUIRIES */}
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                INQUIRIES
              </span>
              <Send className="w-4 h-4 text-blue-500" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                210
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500 font-medium">Yêu cầu RFQ đã nhận</span>
              <span className="font-bold text-blue-600">&lt; 20 Phút</span>
            </div>
          </div>

          {/* Card 3: QUOTES */}
          <div className="rounded-2xl border border-amber-200/80 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                QUOTES
              </span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                263
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500 font-medium">Báo giá đã phát hành</span>
              <span className="font-bold text-amber-700">Độ chuẩn 99.8%</span>
            </div>
          </div>

          {/* Card 4: AWARDED */}
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                AWARDED
              </span>
              <Trophy className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                189
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500 font-medium">Đơn hàng trúng thầu</span>
              <span className="font-bold text-emerald-700">Win rate ~72%</span>
            </div>
          </div>

          {/* Card 5: REVENUE */}
          <div className="rounded-2xl border border-purple-200/80 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                REVENUE
              </span>
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                145 Tỷ
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500 font-medium">Doanh số điều phối</span>
              <span className="font-bold text-purple-700">Tổng giá trị cước</span>
            </div>
          </div>

          {/* Card 6: NO. CUSTOMER */}
          <div className="rounded-2xl border border-teal-200/80 bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">
                NO. CUSTOMER
              </span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                65 DN
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500 font-medium">Khách hàng định kỳ</span>
              <span className="font-bold text-teal-700">Tái ký 98.2%</span>
            </div>
          </div>
        </div>

        {/* Bottom 2 Analytical Columns: Trend 7-Days Chart & Industry Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Panel Left: Xu Hướng Lượt Xem Hồ Sơ & Quan Tâm 7 Ngày Gần Nhất */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-900">
                Xu Hướng Lượt Xem Hồ Sơ & Quan Tâm 7 Ngày Gần Nhất
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Trung bình ~420 lượt/ngày
              </span>
            </div>

            {/* 7-Day Bar Chart */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
              {weeklyViewsData.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap">
                    {item.views} lượt
                  </div>
                  
                  {/* Bar */}
                  <div className="w-full max-w-[34px] flex items-end justify-center h-20">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        item.isPeak 
                          ? 'bg-blue-600 shadow-md ring-2 ring-blue-400/30' 
                          : 'bg-blue-200 hover:bg-blue-300'
                      } ${item.height}`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-[11px] font-bold ${
                    item.isPeak ? 'text-blue-700 font-extrabold' : 'text-slate-500'
                  }`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Right: Phân Bố Ngành Hàng Chủ Hàng Hợp Tác */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-xs font-black text-slate-900">
                Phân Bố Ngành Hàng Chủ Hàng Hợp Tác
              </h3>
            </div>

            {/* Progress Bars List */}
            <div className="space-y-4">
              {industryDistribution.map((ind) => (
                <div key={ind.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{ind.name}</span>
                    <span className="font-black text-slate-900">{ind.percentage}%</span>
                  </div>
                  {/* Progress bar container */}
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${ind.color}`}
                      style={{ width: `${ind.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          SECTION 2: REVIEWS & TESTIMONIALS MANAGEMENT
      ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Đánh Giá & Phản Hồi Của Khách Hàng Doanh Nghiệp ({testimonials.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phản hồi thực tế từ các chủ hàng (Shipper / BCO) sau khi hoàn tất dịch vụ vận chuyển.
            </p>
          </div>

          {/* Rating Filter Tabs */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <button
              type="button"
              onClick={() => setFilterRating('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                filterRating === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất Cả ({testimonials.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterRating(5)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                filterRating === 5 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Star className="w-3 h-3 fill-current" /> 5 Sao
            </button>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                t.isFeatured ? 'bg-amber-50/40 border-amber-200 shadow-2xs' : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">{t.clientName}</h4>
                    <span className="text-xs text-slate-500">• {t.clientTitle}</span>
                    {t.isFeatured && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-md uppercase">
                        ★ Ghim Nổi Bật
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-indigo-900 mt-0.5">{t.clientCompany}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{t.date}</span>
                </div>
              </div>

              {/* Service used badge */}
              <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                  Dịch vụ: {t.serviceUsed}
                </span>
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                "{t.comment}"
              </p>

              {/* Saleman Reply Section */}
              {t.supplierReply && (
                <div className="pl-4 sm:pl-6 border-l-2 border-indigo-300 pt-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <CornerDownRight className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Phản hồi từ Chuyên Viên Saleman:</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-5 leading-relaxed">
                    {t.supplierReply}
                  </p>
                </div>
              )}

              {/* Action Buttons: Reply & Toggle Featured */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="flex items-center gap-2">
                  {!t.supplierReply && replyingId !== t.id && (
                    <button
                      type="button"
                      onClick={() => setReplyingId(t.id)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Trả lời phản hồi này</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(t.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{t.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim nổi bật lên đầu'}</span>
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              {replyingId === t.id && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung cảm ơn và giải đáp cho khách hàng..."
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-hidden"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendReply(t.id)}
                      className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Gửi Phản Hồi
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

