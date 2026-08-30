import React, { useState, useMemo } from 'react';
import {
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  Tag,
  Percent,
  Clock,
  CheckCircle2,
  Building2,
  BadgeCheck,
  Phone,
  Send,
  ArrowRight,
  ShieldCheck,
  Star,
  ExternalLink,
  Plus,
  Bookmark,
  Calendar,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Briefcase,
  SlidersHorizontal,
  Flame,
  Check,
  X,
  FileText,
  Boxes
} from 'lucide-react';
import { HotPromotionItem, CurrentView, UserProfile } from '../../types';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';

interface HotPromotionRateDetailCardProps {
  item: HotPromotionItem;
  onNavigate: (view: CurrentView) => void;
  onBookPromotion: (item: HotPromotionItem) => void;
  onToggleBookmark: (id: string, title: string) => void;
  isBookmarked: boolean;
}

export const HotPromotionRateDetailCard: React.FC<HotPromotionRateDetailCardProps> = ({
  item,
  onNavigate,
  onBookPromotion,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Find related specialist details if exists
  const specialist = useMemo(() => {
    return mockSalesSpecialists.find(s => s.id === item.specialistId) || {
      id: item.specialistId,
      vietnameseName: item.specialistVietnameseName,
      title: item.specialistTitle,
      companyName: item.companyName,
      phone: item.specialistPhone,
      email: 'sales@' + item.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.vn',
      avatarInitial: item.specialistAvatarInitial,
      rating: item.specialistRating,
      reviewsCount: item.specialistReviewsCount,
      verifiedStatus: true,
      motto: 'Tối ưu chi phí thực tế – Đảm bảo hành trình chuẩn xác từng giờ',
      specialties: [item.vehicleOrUnit, item.cargoSuitability, item.serviceType],
      keyMetrics: {
        shipmentsCount: '1,200+ TEUs / Chuyến',
        revenueManagedVND: '85 Tỷ VND',
        onTimeDeliveryRate: '99.6%',
        rfqResponseAvgMins: 12,
        activeClientsCount: 45,
        satisfactionRate: '4.95 / 5.0'
      }
    };
  }, [item]);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(item.specialistPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getServiceIcon = () => {
    switch (item.serviceType) {
      case 'Trucking': return Truck;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)': return Ship;
      case 'Air Freight': return Plane;
      case 'Cold Chain': return Snowflake;
      case 'Warehousing': return Warehouse;
      case 'Customs Clearance': return FileCheck2;
      case 'Cross-Border': return Globe;
      default: return Layers;
    }
  };

  const ServiceIcon = getServiceIcon();
  const savingsAmount = item.originalPriceVND - item.promotionalPriceVND;

  return (
    <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-indigo-100 shadow-inner space-y-4 text-xs">
      {/* Top Banner: Service Category & Official Listed By Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold shrink-0">
            <ServiceIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">{item.title}</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-100 text-orange-700 border border-orange-200">
                {item.badgeLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mã Biểu Giá Niêm Yết: <strong className="font-mono text-slate-700">{item.code}</strong> • Ngày công bố: <strong>{item.validFrom}</strong>
            </p>
          </div>
        </div>

        {/* Pricing Summary Quick Pill */}
        <div className="flex items-center gap-3 bg-orange-50/80 px-3.5 py-2 rounded-xl border border-orange-200/90 shrink-0">
          <div className="text-right">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-[11px] text-slate-400 line-through">{item.originalPriceDisplay}</span>
              <span className="text-base font-black text-orange-600">{item.promotionalPriceDisplay}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700">
              Giảm {item.discountPercent}% ({item.pricingUnit})
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Technical Specification Grid (Tương tự LeadInquiryDetailCard) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Col 1 & 2: Technical Parameters & Conditions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Specs Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Thông Số Kỹ Thuật Tuyến & Quy Cách Phương Tiện Niêm Yết</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Tuyến Vận Chuyển:</span>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{item.origin}</span>
                  <ArrowRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>{item.destination}</span>
                </p>
                <span className="text-[10px] text-slate-500 block">{item.routeDisplay}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Phương Tiện / Loại Hình:</span>
                <p className="font-bold text-slate-900">{item.vehicleOrUnit}</p>
                <span className="text-[10px] text-slate-500 block">Sẵn sàng điều phối ngay</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Hàng Hóa Phù Hợp:</span>
                <p className="font-bold text-slate-900">{item.cargoSuitability}</p>
                <span className="text-[10px] text-slate-500 block">Bảo hiểm 100% trách nhiệm hàng hóa</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời Gian Hành Trình (Transit Time):</span>
                <p className="font-bold text-slate-900">{item.transitTime}</p>
                <span className="text-[10px] text-slate-500 block">Cam kết chạy đúng tiến độ SLA</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Sức Chứa / Số Suất Khả Dụng:</span>
                <p className="font-bold text-orange-700">{item.availableCapacity}</p>
                <span className="text-[10px] text-slate-500 block">Còn {item.slotsRemaining} / {item.totalSlots} suất ưu đãi</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Điều Kiện Thanh Toán:</span>
                <p className="font-bold text-slate-900">{item.paymentTerms}</p>
                <span className="text-[10px] text-slate-500 block">Hạn áp dụng đến {item.validUntil}</span>
              </div>
            </div>
          </div>

          {/* Highlights & Included Services */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Đặc Quyền Kèm Theo & Cam Kết Chất Lượng Dịch Vụ</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{h}</span>
                </div>
              ))}
            </div>

            {item.notes && (
              <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed"><strong>Lưu ý:</strong> {item.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Col 3: Specialist Profile & Action Box */}
        <div className="space-y-4">
          {/* Sales Specialist (PIC) Contact Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Chuyên Viên (PIC) Phụ Trách Tuyến
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Specialist</span>
              </span>
            </div>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0">
                {item.specialistAvatarInitial}
              </div>
              <div className="min-w-0">
                <h4 
                  onClick={() => {
                    onNavigate({ 
                      type: 'public', 
                      tab: 'supplier-profile', 
                      params: { specialistId: item.specialistId, viewState: 'detail' } 
                    });
                  }}
                  className="text-sm font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                  title="Bấm để xem hồ sơ năng lực đầy đủ của chuyên viên"
                >
                  {item.specialistVietnameseName}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium truncate">{item.specialistTitle}</p>
                <p className="text-[11px] font-bold text-indigo-900 truncate mt-0.5">{item.companyName}</p>
              </div>
            </div>

            {/* Rating & Response Rate */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Đánh giá</span>
                <span className="font-extrabold text-slate-800 text-xs flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{item.specialistRating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({item.specialistReviewsCount})</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Phản hồi</span>
                <span className="font-extrabold text-emerald-700 text-xs">&lt; 15 Phút</span>
              </div>
            </div>

            {/* Direct Contact Phone & Hotline */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-mono font-bold text-slate-800 text-xs">{item.specialistPhone}</span>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200 cursor-pointer"
                >
                  {copiedPhone ? 'Đã chép!' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${item.specialistPhone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Trực Tiếp</span>
                </a>

                <button
                  onClick={() => {
                    onNavigate({ 
                      type: 'public', 
                      tab: 'supplier-profile', 
                      params: { specialistId: item.specialistId, viewState: 'detail' } 
                    });
                  }}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Xem toàn bộ biểu giá và các tuyến khác của PIC này"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Xem Hồ Sơ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Box: Book Promotion / Create Custom RFQ */}
          <div className="bg-linear-to-b from-orange-500/10 to-amber-500/5 rounded-xl border border-orange-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-orange-900">Khóa Giá Ưu Đãi Ngay</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Còn {item.daysRemaining} ngày
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Áp dụng mức giá khuyến mãi <strong>{item.promotionalPriceDisplay}</strong> cho lô hàng của bạn. Giữ chỗ xe và kết nối trực tiếp với PIC.
            </p>

            <button
              onClick={() => onBookPromotion(item)}
              id={`book-detail-btn-${item.code}`}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Khóa Giá & Đặt Giữ Chỗ Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
