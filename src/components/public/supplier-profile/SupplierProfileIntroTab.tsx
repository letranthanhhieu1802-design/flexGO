import React, { useState } from 'react';
import { 
  Eye, 
  Send, 
  FileText, 
  Trophy, 
  DollarSign, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  ThumbsUp, 
  Calendar, 
  Clock, 
  Award, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Globe, 
  Activity, 
  Flame, 
  Download, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { SalesSpecialistProfile } from '../../../types';

interface SupplierProfileIntroTabProps {
  specialist: SalesSpecialistProfile;
  onOpenRFQ: () => void;
  onOpenConsult: () => void;
  onCopy: (text: string, label: string) => void;
}

export const SupplierProfileIntroTab: React.FC<SupplierProfileIntroTabProps> = ({
  specialist,
  onOpenRFQ,
  onOpenConsult,
  onCopy,
}) => {
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<'ALL' | '5star' | '4star'>('ALL');

  // Compute the 6 specific metrics requested by user
  const profileViewsCount = specialist.profileViews || 14820;
  const inquiriesCount = specialist.viewerInteractions?.rfqRequestsCount || 342;
  const quotesCount = Math.round(inquiriesCount * 1.25) || 428;
  const awardedCount = Math.round(quotesCount * 0.72) || 308;
  const revenueDisplay = specialist.keyMetrics?.revenueManagedVND || '92.5 Tỷ VND';
  const noCustomer = specialist.keyMetrics?.activeClientsCount || 48;

  // Filter reviews
  const filteredTestimonials = (specialist.testimonials || []).filter((t) => {
    if (selectedReviewFilter === '5star') return t.rating === 5;
    if (selectedReviewFilter === '4star') return t.rating === 4;
    return true;
  });

  return (
    <div id="supplier-profile-intro-tab" className="space-y-8 animate-in fade-in duration-300">
      
      {/* =========================================================================
          SECTION 1: HỆ THỐNG CHỈ SỐ HOẠT ĐỘNG TRÊN HỆ THỐNG (6 METRICS REQUESTED)
          1. Profile Views, 2. Inquiries, 3. Quotes, 4. Awarded, 5. Revenue, 6. No. Customer
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Hệ Thống Chỉ Số Hoạt Động Trên Hệ Thống
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <TrendingUp className="h-3 w-3" />
                  Xác thực Real-time
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiệu suất xử lý yêu cầu, điều phối cước và mức độ tín nhiệm từ cộng đồng chủ hàng doanh nghiệp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cập nhật liên tục từ hệ thống sàn flexGO</span>
          </div>
        </div>

        {/* 6 Grid Metrics */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          
          {/* 1. Profile Views */}
          <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-indigo-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Profile Views</span>
              <Eye className="h-4 w-4" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-indigo-950">
              {profileViewsCount.toLocaleString('vi-VN')}
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Lượt xem hồ sơ</span>
              <span className="font-bold text-emerald-700">+{specialist.viewGrowthPercentage || 28.4}%</span>
            </div>
          </div>

          {/* 2. Inquiries */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-blue-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Inquiries</span>
              <Send className="h-4 w-4" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-blue-950">
              {inquiriesCount.toLocaleString('vi-VN')}
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Yêu cầu RFQ đã nhận</span>
              <span className="font-bold text-blue-700">{specialist.responseTime}</span>
            </div>
          </div>

          {/* 3. Quotes */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[11px] font-bold uppercase tracking-wider">Quotes</span>
              <FileText className="h-4 w-4" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-amber-950">
              {quotesCount.toLocaleString('vi-VN')}
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Báo giá đã phát hành</span>
              <span className="font-bold text-amber-700">Độ chuẩn 99.8%</span>
            </div>
          </div>

          {/* 4. Awarded */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[11px] font-bold uppercase tracking-wider">Awarded</span>
              <Trophy className="h-4 w-4" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-emerald-950">
              {awardedCount.toLocaleString('vi-VN')}
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Đơn hàng trúng thầu</span>
              <span className="font-bold text-emerald-700">Win rate ~72%</span>
            </div>
          </div>

          {/* 5. Revenue */}
          <div className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-purple-800">
              <span className="text-[11px] font-bold uppercase tracking-wider">Revenue</span>
              <DollarSign className="h-4 w-4" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-purple-950">
              {revenueDisplay.split(' ')[0]} {revenueDisplay.split(' ')[1]}
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Doanh số điều phối</span>
              <span className="font-bold text-purple-700">Tổng giá trị cước</span>
            </div>
          </div>

          {/* 6. No. Customer */}
          <div className="rounded-2xl border border-teal-200/80 bg-teal-50/50 p-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-teal-800">
              <span className="text-[11px] font-bold uppercase tracking-wider">No. Customer</span>
              <Users className="h-4 w-4" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-teal-950">
              {noCustomer} <span className="text-sm font-semibold text-teal-700">DN</span>
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Khách hàng định kỳ</span>
              <span className="font-bold text-teal-700">Tái ký 98.2%</span>
            </div>
          </div>
        </div>

        {/* 7-Day Traffic & Shipper Engagement Mini Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div className="lg:col-span-2 rounded-xl bg-slate-50/80 p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">
                Xu Hướng Lượt Xem Hồ Sơ & Quan Tâm 7 Ngày Gần Nhất
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Trung bình ~420 lượt/ngày
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-20 pt-2">
              {[
                { day: 'T2', views: 320, height: '65%' },
                { day: 'T3', views: 345, height: '70%' },
                { day: 'T4', views: 380, height: '78%' },
                { day: 'T5', views: 410, height: '84%' },
                { day: 'T6', views: 490, height: '100%', isPeak: true },
                { day: 'T7', views: 260, height: '53%' },
                { day: 'CN', views: 180, height: '37%' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.views}
                  </span>
                  <div
                    style={{ height: item.height }}
                    className={`w-full max-w-[36px] rounded-t-md transition-all ${
                      item.isPeak
                        ? 'bg-blue-600 shadow-xs'
                        : 'bg-indigo-300/80 group-hover:bg-indigo-400'
                    }`}
                  ></div>
                  <span className="text-[10px] font-medium text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              Phân Bổ Ngành Hàng Chủ Hàng Hợp Tác
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>FDI & Thiết bị điện tử</span>
                  <span className="font-bold text-slate-900">38%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: '38%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Nông sản & Thủy hải sản lạnh</span>
                  <span className="font-bold text-slate-900">27%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '27%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>FMCG & Bán lẻ đa kênh</span>
                  <span className="font-bold text-slate-900">21%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: '21%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Dệt may, Gỗ & Cơ khí</span>
                  <span className="font-bold text-slate-900">14%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: '14%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: THÔNG TIN CÁ NHÂN, THÔNG TIN LIÊN HỆ & THẾ MẠNH CHUYÊN SÂU
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Thông tin cá nhân & Thế mạnh + Chứng chỉ */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thế mạnh & Lĩnh vực phụ trách */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <span>Thế Mạnh Vận Hành & Năng Lực Giải Pháp</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specialist.specialties.map((spec, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{spec}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Cam kết đáp ứng chuẩn SLA, tối ưu chi phí và điều phối phương tiện trực tiếp.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Thành tựu & Giải thưởng */}
            {specialist.achievements && specialist.achievements.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Thành Tựu & Giải Thưởng Nổi Bật
                </h4>
                <div className="space-y-2.5">
                  {specialist.achievements.map((ach) => (
                    <div key={ach.id} className="flex items-start gap-3 rounded-xl bg-amber-50/40 p-3 border border-amber-200/60">
                      <Trophy className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{ach.title}</p>
                          <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                            {ach.year}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chứng chỉ năng lực */}
            {specialist.certifications && specialist.certifications.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Chứng Chỉ Quốc Tế & Chuyên Ngành
                </h4>
                <div className="flex flex-wrap gap-2">
                  {specialist.certifications.map((cert, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Thông tin liên hệ & Kênh tương tác trực tiếp */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-linear-to-b from-blue-50/50 via-white to-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              <span>Thông Tin Liên Hệ Trực Tiếp</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Hotline / Zalo:</span>
                    <span className="font-bold text-slate-900">{specialist.phone}</span>
                  </div>
                </div>
                <button
                  onClick={() => onCopy(specialist.zaloPhone, 'Zalo')}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200"
                >
                  Sao chép
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div className="truncate max-w-[150px]">
                    <span className="text-[10px] text-slate-400 block font-semibold">Email công vụ:</span>
                    <span className="font-bold text-slate-900 truncate block">{specialist.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => onCopy(specialist.email, 'Email')}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200"
                >
                  Sao chép
                </button>
              </div>

              <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Khu vực phụ trách chính:</span>
                <p className="font-medium text-slate-800 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  {specialist.location}
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Ngôn ngữ hỗ trợ:</span>
                <p className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  {specialist.languages.join(', ')}
                </p>
              </div>
            </div>

            {/* Quick Action CTA inside Contact Card */}
            <div className="pt-2 space-y-2">
              <button
                onClick={onOpenRFQ}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gửi RFQ Báo Giá Ngay</span>
              </button>

              <button
                onClick={onOpenConsult}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>Đặt Lịch Tư Vấn 1:1</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 3: FEEDBACK & ĐÁNH GIÁ TỪ KHÁCH HÀNG (CUSTOMER FEEDBACK & REVIEWS)
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-blue-600" />
              <span>Đánh Giá & Feedback Thực Tế Từ Doanh Nghiệp Khách Hàng</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              100% đánh giá xác thực từ các chuyến hàng và hợp đồng đã giao nhận thành công
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 border border-amber-200">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{specialist.rating} / 5.0 Rating</span>
              <span className="text-amber-700 font-normal">({specialist.reviewsCount} reviews)</span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedReviewFilter('ALL')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  selectedReviewFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedReviewFilter('5star')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  selectedReviewFilter === '5star' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                5 Sao ⭐
              </button>
            </div>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredTestimonials.map((test) => (
            <div 
              key={test.id} 
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm">
                      {test.avatarInitial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{test.clientName}</p>
                      <p className="text-xs text-slate-500">{test.clientRole} • <span className="font-medium text-slate-700">{test.clientCompany}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{test.content}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate mr-2">Tuyến: <strong className="text-slate-700">{test.routeHandled}</strong></span>
                <span className="shrink-0">{test.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
