import React, { useState } from 'react';
import { 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  Eye, 
  FileText, 
  Plus, 
  Trash2, 
  CornerDownRight,
  ThumbsUp,
  Filter
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
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. TOP HEADER: Operational KPIs Dashboard (Platform Auto-generated) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-md tracking-wider">
              Hệ Thống FlexGO Tự Động Đo Lường
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">Chỉ Số Hiệu Suất Vận Hành & Cam Kết SLA</h2>
            <p className="text-xs text-slate-500">
              Các chỉ số này được tính toán khách quan từ các đơn hàng, báo giá RFQ và hợp đồng thực hiện trên sàn.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Xác thực bởi FlexGO Audit 2025</span>
          </div>
        </div>

        {/* 4 Core KPIs Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Thời Gian Phản Hồi RFQ</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">12 Phút</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Nhanh hơn 85% thị trường
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Tỷ Lệ Giao Hàng Đúng Giờ</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">99.6%</div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Dựa trên 2,450 chuyến hoàn tất
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Tỷ Lệ Giữ Chỗ Tàu/Xe (Space)</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">99.2%</div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Không phát sinh hoãn chuyến
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Điểm Đánh Giá Bình Quân</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">4.9 / 5.0</div>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">
              Từ 142 Đánh giá khách hàng
            </span>
          </div>
        </div>
      </div>

      {/* 2. REVIEWS & TESTIMONIALS MANAGEMENT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
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
