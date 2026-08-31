import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  FileArchive, 
  Paperclip, 
  CheckCircle2, 
  X, 
  Send, 
  Truck, 
  Ship, 
  Plane, 
  Train, 
  Warehouse, 
  Sparkles, 
  Phone, 
  Mail, 
  Clock, 
  Layers, 
  Check, 
  Edit3, 
  Globe, 
  ThermometerSnowflake, 
  Anchor, 
  Share2, 
  Copy, 
  CheckCheck, 
  ShieldAlert, 
  Flame, 
  Snowflake,
  Landmark,
  Flag,
  Scale,
  Box,
  Receipt,
  Zap
} from 'lucide-react';
import { InquiryItem, ServiceType, UserProfile } from '../../types';

interface InquirySummaryConfirmModalProps {
  isOpen: boolean;
  inquiry: InquiryItem | null;
  currentUser?: UserProfile | null;
  matchingSuppliersCount: number;
  isPublished?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const InquirySummaryConfirmModal: React.FC<InquirySummaryConfirmModalProps> = ({
  isOpen,
  inquiry,
  currentUser,
  matchingSuppliersCount,
  isPublished: isPublishedProp,
  onClose,
  onConfirm,
}) => {
  const [internalPublished, setInternalPublished] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const isPublished = isPublishedProp !== undefined ? isPublishedProp : internalPublished;

  // Reset internal state when modal opens with a new inquiry
  React.useEffect(() => {
    if (isOpen) {
      setCopiedLink(false);
      if (isPublishedProp === undefined) {
        setInternalPublished(false);
      }
    }
  }, [isOpen, isPublishedProp]);

  // Scroll to top when published so the user clearly sees the generated Lead Code and Share Banner
  React.useEffect(() => {
    if (isPublished && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isPublished]);

  if (!isOpen || !inquiry) return null;

  // Lead Code and Inquiry Code are 1:1 identical (Mã lead và Mã Inquiry là 1)
  const leadCode = inquiry.leadCode || inquiry.code;

  // Share URL pointing directly to the Lead Board filtered by this Lead Code
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`
    : `https://logistics.vietnam.io/?tab=lead-board&leadCode=${leadCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleConfirmPublish = () => {
    setInternalPublished(true);
    onConfirm();
  };

  const getServiceIcon = (service: ServiceType) => {
    switch (service) {
      case 'Trucking':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'Cold Chain':
        return <ThermometerSnowflake className="w-5 h-5 text-cyan-600" />;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Ship className="w-5 h-5 text-blue-600" />;
      case 'Air Freight':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'Rail Freight':
        return <Train className="w-5 h-5 text-indigo-600" />;
      case 'Warehousing':
        return <Warehouse className="w-5 h-5 text-purple-600" />;
      case 'Customs Clearance':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'Cross-border':
        return <Globe className="w-5 h-5 text-orange-600" />;
      case 'Project Cargo':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      default:
        return <Truck className="w-5 h-5 text-slate-600" />;
    }
  };

  const getServiceNameVi = (service: ServiceType): string => {
    switch (service) {
      case 'Trucking': return 'Vận Tải Đường Bộ (Trucking)';
      case 'Cold Chain': return 'Vận Tải Hàng Lạnh (Cold Chain Logistics)';
      case 'Sea Freight (FCL)': 
      case 'Sea Freight (LCL)': 
        return 'Vận Tải Đường Biển (Ocean Freight)';
      case 'Air Freight': return 'Vận Tải Hàng Không (Air Freight)';
      case 'Rail Freight': return 'Vận Tải Đường Sắt (Rail Freight)';
      case 'Warehousing': return 'Dịch Vụ Kho Bãi & Trung Tâm Phân Phối (3PL)';
      case 'Customs Clearance': return 'Khai Báo Hải Quan & Thông Quan (Customs)';
      case 'Cross-border': return 'Vận Tải Bộ Xuyên Biên Giới (Cross-Border)';
      case 'Project Cargo': return 'Vận Tải Hàng Dự Án / Siêu Trường Siêu Trọng (Project Cargo)';
      default: return service;
    }
  };

  const specs = inquiry.serviceSpecs || {};
  const trucking = specs.trucking;
  const ocean = specs.ocean;
  const air = specs.air;
  const coldChain = specs.coldChain;
  const warehousing = specs.warehousing;
  const customs = specs.customs;
  const crossBorder = specs.crossBorder;
  const rail = specs.rail;
  const project = specs.project;

  // Active pick-up and drop-off points
  const isTrucking = inquiry.serviceType === 'Trucking';
  const isLcl = inquiry.serviceType === 'Sea Freight (LCL)' || ocean?.mode?.includes('LCL') || inquiry.title?.toLowerCase().includes('lcl');
  const isFcl = (inquiry.serviceType === 'Sea Freight (FCL)' || ocean?.mode?.includes('FCL')) && !isLcl;
  const isOcean = isFcl || isLcl;
  const pickupList: string[] = isTrucking && trucking?.pickupLocations && trucking.pickupLocations.length > 0
    ? trucking.pickupLocations.map(l => l.trim()).filter(Boolean)
    : [inquiry.origin].filter(Boolean);

  const deliveryList: string[] = isTrucking && trucking?.deliveryLocations && trucking.deliveryLocations.length > 0
    ? trucking.deliveryLocations.map(l => l.trim()).filter(Boolean)
    : [inquiry.destination].filter(Boolean);

  const totalPickupCount = pickupList.length || 1;
  const totalDeliveryCount = deliveryList.length || 1;
  const isMultiPoint = totalPickupCount > 1 || totalDeliveryCount > 1;

  // Customer Profile Information
  const customerCompanyName = inquiry.customerCompany || currentUser?.companyName || 'ABC Manufacturing Vietnam Co., Ltd.';
  const customerContactName = inquiry.contactPerson || (currentUser ? `${currentUser.name} (${currentUser.roleTitle || 'Logistics & Supply Chain'})` : 'Lê Hoàng Hiếu (Logistics Lead)');
  const customerEmail = currentUser?.email || 'hieu.le@abcmfg.vn';
  const customerPhone = '+84 908 123 456';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="inquiry-summary-confirm-modal"
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${
              isPublished 
                ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                : 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300'
            }`}>
              {isPublished ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
              ) : (
                <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {isPublished ? 'Yêu Cầu Báo Giá Đã Phát Hành Lên Sàn (Lead Board)' : 'Tóm Tắt & Xác Nhận Yêu Cầu Báo Giá'}
                </h3>
                {isPublished && inquiry.code ? (
                  <>
                    <span className="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full font-bold">
                      {inquiry.code}
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] bg-emerald-600 text-white font-bold rounded-full animate-in fade-in">
                      Live trên Lead Board
                    </span>
                  </>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full font-bold flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Bản xem trước (Chờ phát hành)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isPublished 
                  ? 'Yêu cầu RFQ đã được post công khai. Nhà vận tải phù hợp có thể xem và gửi báo giá ngay lập tức.'
                  : 'Kiểm tra lại toàn bộ thông tin bạn đã khai báo trước khi phát hành lên sàn cho các nhà cung cấp.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={scrollContainerRef} className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/60 flex-1">
          
          {/* BANNER KHI ĐÃ PHÁT HÀNH THÀNH CÔNG */}
          {isPublished && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500/40 text-emerald-950 shadow-sm animate-in slide-in-from-top-3 duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shrink-0 mt-0.5">
                    <CheckCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-emerald-950">
                        Đã Tạo Mã Lead & Niêm Yết Lên Sàn (Lead Board)
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-mono font-bold shadow-xs">
                        Mã Lead & RFQ: {inquiry.code}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        Đang Mở Thầu
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                      Yêu cầu báo giá <strong className="font-mono font-bold text-emerald-900">{inquiry.code}</strong> (Mã Lead: <strong className="font-mono font-bold text-emerald-900">{inquiry.code}</strong>) đã được hệ thống niêm yết công khai trên <strong>Lead Board</strong> cho <span className="font-black">{matchingSuppliersCount} nhà vận tải & logistics</span>. Khi chia sẻ liên kết bên dưới, đối tác sẽ được điều hướng thẳng đến Lead Board và tự động lọc chính xác theo mã Lead này.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      copiedLink 
                        ? 'bg-slate-900 text-emerald-300 ring-2 ring-emerald-400' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Đã Sao Chép Link Lead Board!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-white" />
                        <span>Sao Chép Link Lead Board ({leadCode})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share URL Box */}
              <div className="mt-3.5 pt-3 border-t border-emerald-500/20">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1.5">
                  Liên Kết Trực Tiếp Tới Bảng Lead Board (Đã Tự Động Lọc Theo Mã Lead {leadCode}):
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono shadow-inner overflow-hidden">
                    <Globe className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                    <span className="truncate">{shareUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs ${
                      copiedLink 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                    <span>{copiedLink ? 'Đã chép' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* KHỐI 0: THÔNG TIN KHÁCH HÀNG / NGƯỜI TẠO YÊU CẦU (CUSTOMER PROFILE) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-100 shadow-xs ring-1 ring-indigo-500/10">
            <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-950 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Thông Tin Doanh Nghiệp Khách Hàng (Customer Profile)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Đơn Vị Yêu Cầu (Company)
                </span>
                <p className="font-extrabold text-slate-900 leading-snug">
                  {customerCompanyName}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mã Số Thuế: <span className="font-semibold text-slate-700">0314988234</span>
                </p>
              </div>

              <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Người Phụ Trách & Chức Vụ
                </span>
                <p className="font-extrabold text-slate-900 leading-snug">
                  {customerContactName}
                </p>
                <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-indigo-500" /> <span className="font-semibold text-slate-700">{customerPhone}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-indigo-500" /> <span className="font-semibold text-slate-700">{customerEmail}</span>
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Địa Chỉ Trụ Sở & Cơ Sở Sản Xuất
                </span>
                <p className="font-semibold text-slate-800 leading-relaxed">
                  Lô B2-4, Đường Số 3, KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú, TP. Hồ Chí Minh
                </p>
                <p className="text-[10.5px] text-emerald-600 font-bold mt-1">
                  ✓ Tiêu chuẩn ISO 9001:2015 & C-TPAT
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6 HẠNG MỤC TỔNG HỢP TOÀN DIỆN DỮ LIỆU ĐẦU VÀO ĐÚNG THEO FORM KHAI BÁO */}
          {/* ========================================================================= */}

          {/* HẠNG MỤC 1: CHỌN LOẠI HÌNH DỊCH VỤ (SERVICE TYPE) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
                <span>Chọn Loại Hình Dịch Vụ</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                Dịch vụ: {isOcean ? 'Sea Freight' : inquiry.serviceType}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs">
              <div className="p-2 bg-white rounded-lg shadow-2xs border border-indigo-100 shrink-0 mt-0.5">
                {getServiceIcon(inquiry.serviceType)}
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-800 uppercase block">Loại Dịch Vụ Đã Chọn</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{getServiceNameVi(inquiry.serviceType)}</p>
              </div>
            </div>
          </div>

          {/* HẠNG MỤC 2: HÌNH THỨC BÁO GIÁ / LOẠI HÌNH HỢP ĐỒNG (PRICING & CONTRACT TYPE) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
                <span>Hình Thức Báo Giá / Loại Hình Hợp Đồng</span>
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                inquiry.pricingType === 'CONTRACT' 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {inquiry.pricingType === 'CONTRACT' ? 'Hợp Đồng Dài Hạn (CONTRACT)' : 'Giao Ngay Theo Lô (SPOT)'}
              </span>
            </div>

            <div className={`grid grid-cols-1 ${inquiry.pricingType === 'CONTRACT' ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-3 text-xs`}>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Hình Thức Báo Giá</span>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {inquiry.pricingType === 'CONTRACT' ? 'Hợp đồng dài hạn (Contract / Tender)' : 'Chuyến đơn lẻ (Spot)'}
                </p>
              </div>

              {inquiry.pricingType === 'CONTRACT' && (
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                  <span className="text-[10px] font-bold text-purple-800 uppercase block">Thời Hạn Hợp Đồng Ký Kết</span>
                  <p className="font-extrabold text-purple-950 text-sm mt-0.5">
                    {inquiry.contractTerm || specs.trucking?.contractTerm || specs.ocean?.contractTerm || 'Hợp đồng 12 tháng'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* HẠNG MỤC 3: PHÂN NHÓM HÀNG HÓA & QUY CÁCH ĐÓNG GÓI (CARGO & PACKAGING) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
                <span>Phân Nhóm Hàng Hóa & Quy Cách Đóng Gói</span>
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg ${
                inquiry.cargoClassification === 'Reefer' 
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  : inquiry.cargoClassification === 'Hazmat'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                Phân nhóm: {inquiry.cargoClassification === 'General' ? 'Hàng thông thường' : inquiry.cargoClassification === 'Reefer' ? 'Hàng đông lạnh' : 'Hàng nguy hiểm (DG/IMO)'}
              </span>
            </div>

            {/* Core Cargo Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs mb-3.5">
              {/* Ngành hàng khai báo - Đặt trước Tên Hàng Hóa */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Ngành Hàng Khai Báo</span>
                <p className="font-extrabold text-slate-900 mt-0.5 truncate" title={inquiry.industry || 'Hàng hóa tổng hợp'}>
                  {inquiry.industry || 'Hàng hóa tổng hợp'}
                </p>
              </div>

              {/* Tên hàng hóa */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tên Hàng Hóa</span>
                <p className="font-extrabold text-slate-900 mt-0.5 truncate" title={inquiry.cargoType || 'Hàng hóa tổng hợp'}>
                  {inquiry.cargoType || 'Hàng hóa tổng hợp'}
                </p>
              </div>

              {/* Mã HS Code nếu có */}
              {(inquiry.hsCode || inquiry.serviceSpecs?.customs?.hsCodePrimary || inquiry.serviceSpecs?.ocean?.hsCode || inquiry.serviceSpecs?.air?.hsCode || inquiry.serviceSpecs?.crossBorder?.hsCode) && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Mã HS Code</span>
                  <p className="font-mono font-black text-amber-900 mt-0.5 truncate" title={inquiry.hsCode || inquiry.serviceSpecs?.customs?.hsCodePrimary || inquiry.serviceSpecs?.ocean?.hsCode || inquiry.serviceSpecs?.air?.hsCode || inquiry.serviceSpecs?.crossBorder?.hsCode}>
                    {inquiry.hsCode || inquiry.serviceSpecs?.customs?.hsCodePrimary || inquiry.serviceSpecs?.ocean?.hsCode || inquiry.serviceSpecs?.air?.hsCode || inquiry.serviceSpecs?.crossBorder?.hsCode}
                  </p>
                </div>
              )}

              {/* Giá Trị Hàng Hóa Khai Báo */}
              {(inquiry.cargoValue || inquiry.serviceSpecs?.ocean?.cargoValue || inquiry.serviceSpecs?.air?.cargoValue || inquiry.serviceSpecs?.customs?.cargoValue || inquiry.serviceSpecs?.crossBorder?.cargoValue) && (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Giá Trị Hàng Hóa</span>
                  <p className="font-mono font-black text-emerald-950 mt-0.5 truncate">
                    {inquiry.cargoValue || inquiry.serviceSpecs?.ocean?.cargoValue || inquiry.serviceSpecs?.air?.cargoValue || inquiry.serviceSpecs?.customs?.cargoValue || inquiry.serviceSpecs?.crossBorder?.cargoValue} {inquiry.cargoValueCurrency || inquiry.serviceSpecs?.ocean?.cargoValueCurrency || inquiry.serviceSpecs?.air?.cargoValueCurrency || inquiry.serviceSpecs?.customs?.cargoValueCurrency || inquiry.serviceSpecs?.crossBorder?.cargoValueCurrency || 'USD'}
                  </p>
                </div>
              )}

              {/* Quy cách đóng gói */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Quy Cách Đóng Gói</span>
                <p className="font-extrabold text-slate-900 mt-0.5" title={inquiry.packaging || 'Đóng Pallet gỗ tiêu chuẩn'}>
                  {inquiry.packaging || 'Đóng Pallet gỗ tiêu chuẩn'}
                </p>
              </div>

              {/* Nếu là FTL và có trường riêng ftlWeightKg hoặc ftlVolumeCbm */}
              {inquiry.ftlWeightKg || inquiry.ftlVolumeCbm ? (
                <>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Khối Lượng (kg)</span>
                    <p className="font-extrabold text-indigo-900 mt-0.5 truncate">{inquiry.ftlWeightKg ? `${inquiry.ftlWeightKg} kg` : 'Theo xe'}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Thể Tích (cbm)</span>
                    <p className="font-extrabold text-indigo-900 mt-0.5 truncate">{inquiry.ftlVolumeCbm ? `${inquiry.ftlVolumeCbm} CBM` : 'Theo xe'}</p>
                  </div>
                </>
              ) : trucking?.loadType?.includes('LTL') && (trucking.ltlGrossWeightKg || trucking.ltlCbm) ? (
                <>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tổng Trọng Lượng Thực Tế</span>
                    <p className="font-extrabold text-indigo-900 mt-0.5 truncate">{trucking.ltlGrossWeightKg ? `${Number(trucking.ltlGrossWeightKg).toLocaleString('vi-VN')} kg` : 'Theo kiện'}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tổng Thể Tích (CBM)</span>
                    <p className="font-extrabold text-indigo-900 mt-0.5 truncate">{trucking.ltlCbm ? `${trucking.ltlCbm} CBM` : 'Theo kiện'}</p>
                  </div>
                </>
              ) : inquiry.serviceType === 'Project Cargo' ? null : (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Khối Lượng / Thể Tích</span>
                  <p className="font-extrabold text-indigo-900 mt-0.5 truncate">{inquiry.weightVolume || 'Theo thỏa thuận'}</p>
                </div>
              )}

              {/* Yêu cầu bảo quản */}
              {inquiry.preservationRequirement && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Yêu Cầu Bảo Quản</span>
                  <p className="font-extrabold text-slate-900 mt-0.5 truncate" title={inquiry.preservationRequirement}>
                    {inquiry.preservationRequirement}
                  </p>
                </div>
              )}
            </div>

            {/* Dữ liệu hàng đông lạnh & hàng nguy hiểm */}
            {(inquiry.cargoClassification === 'Reefer' || inquiry.cargoClassification === 'Hazmat') && (
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 mb-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Thông Tin Bảo Quản & Quy Chuẩn Nguy Hiểm Đã Khai Báo:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {inquiry.temperatureRequirement && (
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Dải nhiệt độ yêu cầu:</span>
                      <span className="font-bold text-cyan-800">{inquiry.temperatureRequirement}</span>
                    </div>
                  )}
                  {inquiry.dgClassIMO && (
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Phân loại nguy hiểm (DG Class):</span>
                      <span className="font-bold text-rose-800">{inquiry.dgClassIMO}</span>
                    </div>
                  )}
                  {inquiry.unNumber && (
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Mã số UN:</span>
                      <span className="font-bold text-slate-900">{inquiry.unNumber}</span>
                    </div>
                  )}
                  {inquiry.packingGroup && (
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Nhóm đóng gói (Packing Group):</span>
                      <span className="font-bold text-amber-900">{inquiry.packingGroup}</span>
                    </div>
                  )}
                  {inquiry.flashPoint && (
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Điểm chớp cháy (Flash Point):</span>
                      <span className="font-bold text-rose-900">{inquiry.flashPoint}</span>
                    </div>
                  )}
                  {inquiry.msdsFileName && (
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Tài liệu MSDS đính kèm:</span>
                      <span className="font-bold text-slate-900 truncate block">{inquiry.msdsFileName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* HẠNG MỤC 4: THÔNG TIN CHI TIẾT YÊU CẦU (THEO TỪNG LOẠI HÌNH DỊCH VỤ) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">4</span>
                <span>Thông Tin Chi Tiết Yêu Cầu ({isOcean ? 'Sea Freight' : inquiry.serviceType})</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                {inquiry.serviceType === 'Warehousing'
                  ? 'Kho Bãi 3PL'
                  : inquiry.serviceType === 'Customs Clearance'
                  ? 'Khai Báo Hải Quan'
                  : inquiry.serviceType === 'Project Cargo'
                  ? `Dự Án: ${project?.projectCategory || 'DISTRIBUTION'}`
                  : isLcl
                  ? (isMultiPoint ? `${totalPickupCount} Kho CFS Lấy ↔ ${totalDeliveryCount} Kho CFS Giao` : 'Tuyến Kho CFS - Kho CFS (CFS ↔ CFS)')
                  : isFcl
                  ? (isMultiPoint ? `${totalPickupCount} Cảng Bốc (POL) ↔ ${totalDeliveryCount} Cảng Dỡ (POD)` : 'Tuyến Cảng - Cảng (POL - POD)')
                  : (isMultiPoint ? `${totalPickupCount} Điểm Lấy ↔ ${totalDeliveryCount} Điểm Giao` : 'Tuyến Trực Tiếp 1 Điểm')}
              </span>
            </div>

            {/* 4.1. LỘ TRÌNH / ĐỊA ĐIỂM CHUYÊN BIỆT THEO DỊCH VỤ */}
            {inquiry.serviceType === 'Warehousing' ? (
              /* 4.1. DỊCH VỤ KHO BÃI (CHỈ 1 ĐỊA BÀN DUY NHẤT) */
              <div className="mb-4">
                <span className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block mb-2.5">
                  4.1. Khu Vực & Địa Điểm Kho Bãi Mục Tiêu (Warehouse Target Location):
                </span>
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/80">
                  <div className="flex items-center justify-between font-bold text-purple-950 mb-2 pb-2 border-b border-purple-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0 ring-2 ring-purple-300" />
                      <span className="uppercase text-[11px] font-black tracking-wider">
                        Khu Vực / Tỉnh Thành Kho Cần Thuê
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-black bg-purple-100 text-purple-800 rounded-full border border-purple-300">
                      1 Khu Vực Kho Mục Tiêu
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-purple-200/90 shadow-2xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Warehouse className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                        Địa bàn / Khu công nghiệp / Tỉnh thành:
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                        {inquiry.origin || warehousing?.preferredLocation || 'Chưa xác định địa bàn'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : inquiry.serviceType === 'Customs Clearance' ? (
              /* 4.1. THỦ TỤC HẢI QUAN (CHI CỤC HQ & CẢNG / CỬA KHẨU THÔNG QUAN) */
              <div className="mb-4">
                <span className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block mb-2.5">
                  4.1. Địa Điểm Mở Tờ Khai & Cảng / Cửa Khẩu Thông Quan:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1.5">
                      Chi Cục Hải Quan Mở Tờ Khai (Customs Sub-Department)
                    </span>
                    <div className="p-3 rounded-xl bg-white border border-amber-200/90 shadow-2xs font-extrabold text-slate-900 text-sm">
                      {customs?.customsSubDepartment || inquiry.origin || 'Theo thỏa thuận / Toàn quốc'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                      Cảng / Cửa Khẩu / Sân Bay Tiếp Nhận Hàng (Port / Border Gate)
                    </span>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs font-extrabold text-slate-900 text-sm">
                      {inquiry.destination || inquiry.origin || 'Khu vực cảng / cửa khẩu chỉ định'}
                    </div>
                  </div>
                </div>
              </div>
            ) : inquiry.serviceType === 'Project Cargo' ? (
              /* 4.1. HÀNG DỰ ÁN (PHẠM VI MẠNG LƯỚI & LỘ TRÌNH DỰ ÁN) */
              <div className="mb-4">
                <span className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block mb-2.5">
                  4.1. Phạm Vi Triển Khai Mạng Lưới Dự Án (Project Scope & Routing):
                </span>
                {project?.projectCategory === 'DISTRIBUTION' && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-800 uppercase block mb-1">
                        Kho Tổng Xuất Hàng (Origin Warehouses)
                      </span>
                      <div className="p-2.5 bg-white rounded-xl border border-indigo-200 font-extrabold text-slate-900 text-xs">
                        {project.originWarehouses && project.originWarehouses.length > 0 ? project.originWarehouses.join(', ') : inquiry.origin}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-800 uppercase block mb-1">
                        Phạm Vi Phủ Sóng Giao Hàng (Coverage Scope)
                      </span>
                      <div className="p-2.5 bg-white rounded-xl border border-indigo-200 font-extrabold text-slate-900 text-xs">
                        {project.coverageScope || 'Toàn quốc (Bắc - Trung - Nam)'} ({project.distributionChannel || 'Phân phối chuỗi'})
                      </div>
                    </div>
                  </div>
                )}
                {project?.projectCategory === 'CROSS_DOCK' && (
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/80 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-purple-800 uppercase block mb-1">
                        Trạm Gom Hàng Nguồn (Origin X-Dock Hub)
                      </span>
                      <div className="p-2.5 bg-white rounded-xl border border-purple-200 font-extrabold text-slate-900 text-xs">
                        {project.xDockHubLocation || inquiry.origin || 'Hub Trung Tâm'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-800 uppercase block mb-1">
                        Điểm Đích / Kênh Phân Phối Outbound
                      </span>
                      <div className="p-2.5 bg-white rounded-xl border border-purple-200 font-extrabold text-slate-900 text-xs">
                        {project.xDockDestinationHub ? `Hub Đích: ${project.xDockDestinationHub}` : 'Phân phối chuỗi siêu thị'}
                      </div>
                    </div>
                  </div>
                )}
                {project?.projectCategory === 'PORT_ICD' && (
                  <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-sky-800 uppercase block mb-1">
                        Cảng Biển / Cảng Gốc (Origin Seaport / Terminal)
                      </span>
                      <div className="p-2.5 bg-white rounded-xl border border-sky-200 font-extrabold text-slate-900 text-xs">
                        {project.portIcdOriginPort || inquiry.origin || 'Cảng biển quốc tế'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-sky-800 uppercase block mb-1">
                        Cảng Cạn ICD / Depot Đích (Destination ICD / Depot)
                      </span>
                      <div className="p-2.5 bg-white rounded-xl border border-sky-200 font-extrabold text-slate-900 text-xs">
                        {project.portIcdDestinationIcd || inquiry.destination || 'Cảng cạn ICD nội địa'}
                      </div>
                    </div>
                  </div>
                )}
                {project?.projectCategory === 'MULTIMODAL' && (
                  <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase block mb-1">
                        First Mile (Đầu chặng)
                      </span>
                      <div className="p-2 bg-white rounded-xl border border-teal-200 font-extrabold text-slate-900 text-xs">
                        {project.multimodalFirstMile || inquiry.origin || 'Điểm lấy hàng'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase block mb-1">
                        Main Haul (Tuyến trục)
                      </span>
                      <div className="p-2 bg-white rounded-xl border border-teal-200 font-extrabold text-slate-900 text-xs">
                        {project.multimodalMainHaul || project.multimodalCombination || 'Tuyến trục liên vận'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase block mb-1">
                        Last Mile (Cuối chặng)
                      </span>
                      <div className="p-2 bg-white rounded-xl border border-teal-200 font-extrabold text-slate-900 text-xs">
                        {project.multimodalLastMile || inquiry.destination || 'Điểm giao hàng'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 4.1. VẬN TẢI CHẶNG LẺ (TRUCKING, SEA, AIR, RAIL, CROSS-BORDER): TUYẾN GIAO NHẬN 2 ĐẦU */
              <div className="mb-4">
                <span className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block mb-2.5">
                  {isLcl
                    ? '4.1. Địa Chỉ Lấy Hàng Kho CFS (Origin CFS) & Giao Hàng Kho CFS (Destination CFS):'
                    : isFcl
                    ? '4.1. Cảng Bốc Hàng (POL) & Cảng Dỡ Hàng (POD):'
                    : '4.1. Điểm Lấy Hàng & Điểm Giao Hàng:'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* CỘT TRÁI: CÁC ĐIỂM BỐC HÀNG / CẢNG BỐC / KHO CFS */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between font-bold text-emerald-900 mb-2.5 pb-2 border-b border-emerald-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-300" />
                          <span className="uppercase text-[11px] font-black tracking-wider">
                            {isLcl
                              ? 'Địa Chỉ Lấy Hàng Kho CFS (Origin CFS Warehouse)'
                              : isFcl
                              ? 'Cảng Bốc Hàng (Port of Loading - POL)'
                              : 'Điểm Lấy Hàng / Nơi Đi (Origin)'}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                          {isLcl
                            ? `${totalPickupCount} Kho CFS Lấy Hàng`
                            : isFcl
                            ? `${totalPickupCount} Cảng Bốc Hàng (POL)`
                            : `${totalPickupCount} Điểm Lấy Hàng`}
                        </span>
                      </div>

                      {/* Danh sách các điểm bốc hàng / kho CFS thực tế */}
                      <div className="space-y-2">
                        {pickupList.map((loc, idx) => (
                          <div 
                            key={idx} 
                            className="p-3 rounded-xl bg-white border border-emerald-200/90 shadow-2xs flex items-start gap-3 transition-all"
                          >
                            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wide">
                                  {isLcl ? `Kho CFS Lấy #${idx + 1}` : isFcl ? `Cảng Bốc #${idx + 1} (POL)` : `Điểm Lấy #${idx + 1}`}
                                </span>
                                {idx === 0 && (
                                  <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {isLcl ? 'Kho CFS lấy chính' : isFcl ? 'Cảng bốc chính' : 'Điểm bốc chính'}
                                  </span>
                                )}
                              </div>
                              <p className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug mt-0.5 break-words">
                                {loc || (isLcl ? `Kho CFS lấy hàng #${idx + 1}` : isFcl ? `Cảng bốc hàng #${idx + 1}` : `Điểm bốc hàng #${idx + 1}`)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cảng / Ga / Sân bay đi nếu có */}
                      {ocean?.polPort && ocean.polPort !== inquiry.origin && (
                        <div className="mt-2.5 p-2 rounded-xl bg-emerald-100/60 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>{isLcl ? '📦 Kho CFS lấy hàng:' : '⚓ Cảng bốc (POL):'}</span>
                          <span className="font-black text-slate-900">{ocean.polPort}</span>
                        </div>
                      )}
                      {air?.originAirport && (
                        <div className="mt-2.5 p-2 rounded-xl bg-emerald-100/60 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>✈️ Sân bay đi (AOL):</span>
                          <span className="font-black text-slate-900">{air.originAirport}</span>
                        </div>
                      )}
                      {rail?.originStation && (
                        <div className="mt-2.5 p-2 rounded-xl bg-emerald-100/60 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>🚂 Ga đi:</span>
                          <span className="font-black text-slate-900">{rail.originStation}</span>
                        </div>
                      )}
                      {crossBorder?.originCity && (
                        <div className="mt-2.5 p-2 rounded-xl bg-emerald-100/60 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>📍 Thành phố xuất phát:</span>
                          <span className="font-black text-slate-900">{crossBorder.originCity}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CỘT PHẢI: CÁC ĐIỂM DỠ HÀNG / CẢNG DỠ / KHO CFS */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between font-bold text-rose-900 mb-2.5 pb-2 border-b border-rose-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-300" />
                          <span className="uppercase text-[11px] font-black tracking-wider">
                            {isLcl
                              ? 'Địa Chỉ Giao Hàng Kho CFS (Destination CFS Warehouse)'
                              : isFcl
                              ? 'Cảng Dỡ Hàng (Port of Discharge - POD)'
                              : 'Điểm Giao Hàng / Nơi Đến (Destination)'}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 text-[10px] font-black bg-rose-100 text-rose-800 rounded-full border border-rose-300">
                          {isLcl
                            ? `${totalDeliveryCount} Kho CFS Giao Hàng`
                            : isFcl
                            ? `${totalDeliveryCount} Cảng Dỡ Hàng (POD)`
                            : `${totalDeliveryCount} Điểm Dỡ Hàng`}
                        </span>
                      </div>

                      {/* Danh sách các điểm dỡ hàng / kho CFS thực tế */}
                      <div className="space-y-2">
                        {deliveryList.map((loc, idx) => (
                          <div 
                            key={idx} 
                            className="p-3 rounded-xl bg-white border border-rose-200/90 shadow-2xs flex items-start gap-3 transition-all"
                          >
                            <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wide">
                                  {isLcl ? `Kho CFS Giao #${idx + 1}` : isFcl ? `Cảng Dỡ #${idx + 1} (POD)` : `Điểm Giao #${idx + 1}`}
                                </span>
                                {idx === 0 && totalDeliveryCount > 1 && (
                                  <span className="text-[9.5px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                    {isLcl ? 'Kho CFS giao đầu tiên' : isFcl ? 'Cảng dỡ đầu tiên' : 'Điểm dỡ đầu tiên'}
                                  </span>
                                )}
                                {idx === deliveryList.length - 1 && totalDeliveryCount > 1 && (
                                  <span className="text-[9.5px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                    {isLcl ? 'Kho CFS đích cuối' : isFcl ? 'Cảng dỡ cuối chặng' : 'Điểm cuối chặng'}
                                  </span>
                                )}
                              </div>
                              <p className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug mt-0.5 break-words">
                                {loc || (isLcl ? `Kho CFS giao hàng #${idx + 1}` : isFcl ? `Cảng dỡ hàng #${idx + 1}` : `Điểm dỡ hàng #${idx + 1}`)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cảng / Ga / Sân bay đến nếu có */}
                      {ocean?.podPort && ocean.podPort !== inquiry.destination && (
                        <div className="mt-2.5 p-2 rounded-xl bg-rose-100/60 border border-rose-200 text-rose-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>{isLcl ? '📦 Kho CFS giao hàng:' : '⚓ Cảng dỡ (POD):'}</span>
                          <span className="font-black text-slate-900">{ocean.podPort}</span>
                        </div>
                      )}
                      {air?.destinationAirport && (
                        <div className="mt-2.5 p-2 rounded-xl bg-rose-100/60 border border-rose-200 text-rose-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>✈️ Sân bay đến (AOD):</span>
                          <span className="font-black text-slate-900">{air.destinationAirport}</span>
                        </div>
                      )}
                      {rail?.destinationStation && (
                        <div className="mt-2.5 p-2 rounded-xl bg-rose-100/60 border border-rose-200 text-rose-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>🚂 Ga đến:</span>
                          <span className="font-black text-slate-900">{rail.destinationStation}</span>
                        </div>
                      )}
                      {crossBorder?.destinationCity && (
                        <div className="mt-2.5 p-2 rounded-xl bg-rose-100/60 border border-rose-200 text-rose-900 text-[11px] font-bold flex items-center gap-1.5">
                          <span>📍 Thành phố đến:</span>
                          <span className="font-black text-slate-900">{crossBorder.destinationCity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Leadtime nếu user có nhập */}
                {trucking?.requestedLeadtime ? (
                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-500 font-semibold">Thời gian vận chuyển yêu cầu (Leadtime SLA):</span>
                    <span className="font-black text-slate-900">
                      {trucking.requestedLeadtime}
                      {trucking.requestedLeadtimeNote ? ` (${trucking.requestedLeadtimeNote})` : ''}
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* 4.2. CẤU HÌNH KỸ THUẬT & THÔNG SỐ CHUYÊN BIỆT */}
            <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-3">
              <span className="text-[10.5px] font-black text-indigo-900 uppercase tracking-wider block">
                {inquiry.serviceType === 'Warehousing'
                  ? '4.2. Quy Mô & Thông Số Kỹ Thuật Kho Bãi Chi Tiết:'
                  : inquiry.serviceType === 'Customs Clearance'
                  ? '4.2. Loại Hình Tờ Khai & Nghiệp Vụ Hải Quan:'
                  : inquiry.serviceType === 'Project Cargo'
                  ? '4.2. Mô Hình Dự Án & Cơ Cấu Vận Hành:'
                  : '4.2. Cấu Hình Phương Tiện & Kỹ Thuật Vận Tải Chi Tiết:'}
              </span>

              {/* 1. TRUCKING SPECS (FTL & LTL) */}
              {inquiry.serviceType === 'Trucking' && trucking && (
                <div className="space-y-3">
                  {trucking.loadType?.includes('LTL') ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Hình thức vận tải</span>
                        <span className="font-extrabold text-slate-900">{trucking.loadType || 'LTL (Ghép hàng lẻ)'}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Phương tiện ghép tuyến</span>
                        <span className="font-extrabold text-emerald-800">{trucking.truckType || 'Xe Thùng Kín Chuyên Tuyến Ghép LTL'}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng chuyến & Tần suất</span>
                        <span className="font-extrabold text-slate-900">
                          {trucking.ltlShipmentCount || 1} {trucking.ltlFrequencyUnit ? trucking.ltlFrequencyUnit.toLowerCase() : 'chuyến / tháng'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Hình thức vận tải</span>
                        <span className="font-extrabold text-slate-900">{trucking.loadType || 'FTL (Nguyên chuyến)'}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Loại xe / Quy cách thùng</span>
                        <span className="font-extrabold text-slate-900">{trucking.truckType || 'Xe tải thùng kín'}</span>
                      </div>
                      {trucking.tonnageCategory ? (
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Phân khúc tải trọng</span>
                          <span className="font-extrabold text-slate-900">{trucking.tonnageCategory}</span>
                        </div>
                      ) : null}
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng chuyến & Đơn vị</span>
                        <span className="font-extrabold text-slate-900">
                          {trucking.vehicleCount || 1} {trucking.vehicleCountUnit ? trucking.vehicleCountUnit.toLowerCase() : 'chuyến'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Kích thước lọt lòng thùng xe nếu có trong cấu hình */}
                  {trucking.internalDimensions ? (
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs flex items-center justify-between">
                      <span className="text-[10px] text-indigo-700 font-bold">Kích thước lọt lòng thùng xe:</span>
                      <span className="font-extrabold text-slate-900">{trucking.internalDimensions}</span>
                    </div>
                  ) : null}

                  {/* Chi tiết cho LTL nếu là ghép hàng lẻ */}
                  {trucking.loadType?.includes('LTL') && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 bg-white rounded-xl border border-indigo-200/80 shadow-2xs">
                      {trucking.ltlPieces ? (
                        <div>
                          <span className="text-[10px] text-indigo-700 font-semibold block">Số lượng kiện:</span>
                          <span className="font-extrabold text-slate-900">{trucking.ltlPieces} kiện {trucking.ltlPackaging ? `(${trucking.ltlPackaging})` : ''}</span>
                        </div>
                      ) : null}
                      {trucking.ltlDimensions ? (
                        <div>
                          <span className="text-[10px] text-indigo-700 font-semibold block">Kích thước DxRxC:</span>
                          <span className="font-extrabold text-slate-900">
                            {`${trucking.ltlDimensions.lengthCm}x${trucking.ltlDimensions.widthCm}x${trucking.ltlDimensions.heightCm} cm`}
                          </span>
                        </div>
                      ) : null}
                      {trucking.ltlCbm ? (
                        <div>
                          <span className="text-[10px] text-indigo-700 font-semibold block">Thể tích CBM:</span>
                          <span className="font-extrabold text-slate-900">{trucking.ltlCbm} CBM</span>
                        </div>
                      ) : null}
                      {trucking.ltlGrossWeightKg !== undefined && trucking.ltlGrossWeightKg !== null ? (
                        <div>
                          <span className="text-[10px] text-indigo-700 font-semibold block">Trọng lượng thực tế (Gross):</span>
                          <span className="font-extrabold text-slate-900">{Number(trucking.ltlGrossWeightKg).toLocaleString('vi-VN')} kg</span>
                        </div>
                      ) : null}
                      {trucking.ltlChargeableWeightKg !== undefined && trucking.ltlChargeableWeightKg !== null ? (
                        <div>
                          <span className="text-[10px] text-indigo-700 font-semibold block">Trọng lượng tính cước:</span>
                          <span className="font-extrabold text-slate-900">{Number(trucking.ltlChargeableWeightKg).toLocaleString('vi-VN')} kg</span>
                        </div>
                      ) : null}
                      {typeof trucking.ltlStackable === 'boolean' && (
                        <div>
                          <span className="text-[10px] text-indigo-700 font-semibold block">Xếp chồng hàng (Stackable):</span>
                          <span className={`font-extrabold ${trucking.ltlStackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {trucking.ltlStackable ? '✓ Cho phép xếp chồng' : '⚠️ Không được xếp chồng'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Các lựa chọn tùy chọn bốc xếp / phụ trợ nếu khách hàng có chọn */}
                  {(trucking.loadingLaborRequired || trucking.unloadingLaborRequired || trucking.tailLiftRequired || trucking.craneAssistanceRequired || trucking.prohibitedHoursPassNeeded) ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {trucking.loadingLaborRequired ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold shadow-2xs">
                          ✓ Cần nhân công bốc xếp đầu lấy (Kho gửi)
                        </span>
                      ) : null}
                      {trucking.unloadingLaborRequired ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold shadow-2xs">
                          ✓ Cần nhân công bốc xếp đầu giao (Kho nhận)
                        </span>
                      ) : null}
                      {trucking.tailLiftRequired ? (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-bold shadow-2xs">
                          ✓ Yêu cầu xe bửng nâng thủy lực (Tail-lift)
                        </span>
                      ) : null}
                      {trucking.craneAssistanceRequired ? (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold shadow-2xs">
                          ✓ Cần hỗ trợ xe cẩu tự hành (Crane Handling)
                        </span>
                      ) : null}
                      {trucking.prohibitedHoursPassNeeded ? (
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-bold shadow-2xs">
                          ✓ Cần giấy phép giờ cấm / phố cấm
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}

              {/* 2. OCEAN SPECS (FCL & LCL) */}
              {(inquiry.serviceType === 'Sea Freight (FCL)' || inquiry.serviceType === 'Sea Freight (LCL)') && ocean && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                      <span className="font-extrabold text-blue-700">{ocean.tradeRole || inquiry.tradeRole || 'Xuất khẩu (Export)'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Hình thức đường biển</span>
                      <span className="font-extrabold text-slate-900">{ocean.mode || 'FCL (Full Container)'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Điều kiện nhận & giao</span>
                      <span className="font-extrabold text-cyan-950">
                        {ocean.originServiceTerm || (isFcl ? 'CY' : 'CFS')} ➔ {ocean.destinationServiceTerm || (isFcl ? 'CY' : 'CFS')}
                      </span>
                    </div>
                    {ocean.containerType ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Loại Container</span>
                        <span className="font-extrabold text-slate-900">{ocean.containerType}</span>
                      </div>
                    ) : null}
                    {ocean.incoterm ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Điều kiện Incoterms</span>
                        <span className="font-extrabold text-indigo-700">{ocean.incoterm}</span>
                      </div>
                    ) : null}
                    {ocean.freeDemDetDaysRequested ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Miễn phí Dem/Det yêu cầu</span>
                        <span className="font-extrabold text-slate-900">{ocean.freeDemDetDaysRequested} Ngày</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {isFcl && ocean.containerCount ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng & Tần suất Container</span>
                        <span className="font-extrabold text-slate-900">
                          {ocean.containerCount} {ocean.containerCountUnit ? (ocean.containerCountUnit.startsWith('Container') ? ocean.containerCountUnit : `Cont (${ocean.containerCountUnit})`) : 'Container'}
                        </span>
                      </div>
                    ) : null}
                    {isLcl ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng chuyến & Tần suất LCL</span>
                        <span className="font-extrabold text-cyan-950">
                          {ocean.lclShipmentCount || 1} {ocean.lclFrequencyUnit ? ocean.lclFrequencyUnit.toLowerCase() : 'chuyến / tháng'}
                        </span>
                      </div>
                    ) : null}
                    {ocean.cbmVolume ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Thể tích LCL (CBM)</span>
                        <span className="font-extrabold text-slate-900">{ocean.cbmVolume} CBM</span>
                      </div>
                    ) : null}
                    {ocean.polPort ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">{isLcl ? 'Kho CFS lấy hàng (Origin CFS)' : 'Cảng bốc (POL)'}</span>
                        <span className="font-extrabold text-slate-900 truncate block">{ocean.polPort}</span>
                      </div>
                    ) : null}
                    {ocean.podPort ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">{isLcl ? 'Kho CFS giao hàng (Destination CFS)' : 'Cảng dỡ (POD)'}</span>
                        <span className="font-extrabold text-slate-900 truncate block">{ocean.podPort}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Chi tiết cho LCL nếu là gom hàng lẻ CFS */}
                  {(ocean.mode?.includes('LCL') || inquiry.serviceType === 'Sea Freight (LCL)' || ocean.lclCbm || ocean.lclPieces) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 bg-white rounded-xl border border-cyan-200/80 shadow-2xs">
                      <div>
                        <span className="text-[10px] text-cyan-800 font-semibold block">Số lượng kiện LCL:</span>
                        <span className="font-extrabold text-slate-900">{ocean.lclPieces || 1} kiện / pallet</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-800 font-semibold block">Quy cách đóng gói:</span>
                        <span className="font-extrabold text-slate-900 truncate block" title={ocean.lclPackaging || ocean.packageType}>
                          {ocean.lclPackaging || ocean.packageType || 'Pallet chuẩn'}
                        </span>
                      </div>
                      {ocean.lclDimensions ? (
                        <div>
                          <span className="text-[10px] text-cyan-800 font-semibold block">Kích thước 1 kiện (DxRxC):</span>
                          <span className="font-extrabold text-slate-900">
                            {ocean.lclDimensions.lengthCm}x{ocean.lclDimensions.widthCm}x{ocean.lclDimensions.heightCm} cm
                          </span>
                        </div>
                      ) : null}
                      {ocean.lclGrossWeightKg !== undefined && ocean.lclGrossWeightKg !== null ? (
                        <div>
                          <span className="text-[10px] text-cyan-800 font-semibold block">Trọng lượng thực (Gross):</span>
                          <span className="font-extrabold text-slate-900">{Number(ocean.lclGrossWeightKg).toLocaleString('vi-VN')} kg</span>
                        </div>
                      ) : null}
                      {ocean.lclCbm !== undefined && ocean.lclCbm !== null ? (
                        <div>
                          <span className="text-[10px] text-cyan-800 font-semibold block">Tổng thể tích tính toán:</span>
                          <span className="font-extrabold text-cyan-900">{ocean.lclCbm} CBM</span>
                        </div>
                      ) : null}
                      {ocean.lclChargeableWeightKg !== undefined && ocean.lclChargeableWeightKg !== null ? (
                        <div>
                          <span className="text-[10px] text-cyan-800 font-semibold block">Trọng lượng tính cước:</span>
                          <span className="font-extrabold text-indigo-900">
                            {Number(ocean.lclChargeableWeightKg).toLocaleString('vi-VN')} kg ({ocean.lclRevenueTon || (ocean.lclChargeableWeightKg / 1000).toFixed(2)} RT)
                          </span>
                        </div>
                      ) : null}
                      {typeof ocean.lclStackable === 'boolean' && (
                        <div>
                          <span className="text-[10px] text-cyan-800 font-semibold block">Xếp chồng hàng (Stackable):</span>
                          <span className={`font-extrabold ${ocean.lclStackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {ocean.lclStackable ? '✓ Cho phép xếp chồng' : '⚠️ Không được xếp chồng'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {(ocean.pickupAddress || ocean.deliveryAddress) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {ocean.pickupAddress ? (
                        <div className="bg-cyan-50/60 p-2.5 rounded-xl border border-cyan-200/80 shadow-2xs">
                          <span className="text-[10px] text-cyan-800 font-bold block">📍 Kho lấy hàng (Pickup):</span>
                          <span className="font-medium text-xs text-slate-900 block mt-0.5">{ocean.pickupAddress}</span>
                        </div>
                      ) : null}
                      {ocean.deliveryAddress ? (
                        <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/80 shadow-2xs">
                          <span className="text-[10px] text-rose-800 font-bold block">📍 Kho giao hàng (Delivery):</span>
                          <span className="font-medium text-xs text-slate-900 block mt-0.5">{ocean.deliveryAddress}</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* 3. AIR SPECS (AIR CARGO & EXPRESS COURIER) */}
              {inquiry.serviceType === 'Air Freight' && air && (
                <div className="space-y-2.5">
                  {air.airServiceType === 'Express / Courier' ? (
                    /* Express / Courier Layout */
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                        <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                          <span className="text-[10px] text-amber-800 block font-bold">Phân loại hàng không</span>
                          <span className="font-extrabold text-amber-950">⚡ Express / Courier</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Loại bưu kiện</span>
                          <span className="font-extrabold text-slate-900 truncate block">
                            {air.expressPackageType?.includes('Document') ? '📄 Tài liệu / Thư tín' : '📦 Hàng mẫu / Bưu phẩm'}
                          </span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Số gói / hộp</span>
                          <span className="font-extrabold text-slate-900">{air.packageCount || 1} hộp</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Trọng lượng tính cước (CW)</span>
                          <span className="font-extrabold text-indigo-700">{air.chargeableWeightKgs ? `${air.chargeableWeightKgs} kg CW` : `${air.grossWeightKgs || 0} kg`}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Mã Zip Đi → Đến</span>
                          <span className="font-extrabold text-slate-900 truncate block">
                            {air.originPostalCode || 'VN'} → {air.destinationPostalCode || 'Dest'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-[10px] text-slate-500 font-bold block">🚪 Lấy hàng tận nơi (Door Pickup):</span>
                          <span className="font-bold text-xs text-slate-900 block mt-0.5">{air.pickupAddress || inquiry.origin || 'Chưa cung cấp'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-[10px] text-slate-500 font-bold block">🚪 Giao hàng tận nơi (Door Delivery):</span>
                          <span className="font-bold text-xs text-slate-900 block mt-0.5">{air.deliveryAddress || inquiry.destination || 'Chưa cung cấp'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Air Freight / Cargo Layout */
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        <div className="bg-sky-50/80 p-2.5 rounded-xl border border-sky-200 shadow-2xs">
                          <span className="text-[10px] text-sky-800 block font-bold">Phân loại hàng không</span>
                          <span className="font-extrabold text-sky-950">✈️ Air Freight / Cargo</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                          <span className="font-extrabold text-blue-700">{air.tradeRole || inquiry.tradeRole || 'Xuất khẩu (Export)'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Điều kiện nhận & giao</span>
                          <span className="font-extrabold text-sky-900">
                            {air.originServiceTerm || 'Airport'} ➔ {air.destinationServiceTerm || 'Airport'}
                          </span>
                        </div>
                        {(air.originAirport || air.destinationAirport) ? (
                          <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Sân bay đi → đến</span>
                            <span className="font-extrabold text-slate-900 truncate block">{air.originAirport || 'AOL'} → {air.destinationAirport || 'AOD'}</span>
                          </div>
                        ) : null}
                        {air.chargeableWeightKgs || air.grossWeightKgs ? (
                          <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Trọng lượng tính cước (CW)</span>
                            <span className="font-extrabold text-indigo-700">{air.chargeableWeightKgs ? `${air.chargeableWeightKgs} kg` : `${air.grossWeightKgs} kg`}</span>
                          </div>
                        ) : null}
                        {air.volumetricWeightKgs ? (
                          <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Trọng lượng quy đổi (VW)</span>
                            <span className="font-extrabold text-slate-900">{air.volumetricWeightKgs} kg</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {air.packageCount ? (
                          <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Số kiện hàng</span>
                            <span className="font-extrabold text-slate-900">{air.packageCount} kiện</span>
                          </div>
                        ) : null}
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Số lượng chuyến bay</span>
                          <span className="font-extrabold text-indigo-700">{air.shipmentCount || 1} {air.frequencyUnit || 'Chuyến / Tháng'}</span>
                        </div>
                        {typeof air.stackable === 'boolean' ? (
                          <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Xếp chồng (Stackable)</span>
                            <span className={`font-extrabold ${air.stackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {air.stackable ? '✓ Cho phép chồng' : '⚠️ Không chồng'}
                            </span>
                          </div>
                        ) : null}
                        {typeof air.customsAtAirport === 'boolean' ? (
                          <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Thông quan sân bay</span>
                            <span className="font-extrabold text-emerald-700">{air.customsAtAirport ? 'Bao gồm thủ tục' : 'Không yêu cầu'}</span>
                          </div>
                        ) : null}
                      </div>

                      {(air.pickupAddress || air.deliveryAddress) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {air.pickupAddress ? (
                            <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-200/80 shadow-2xs">
                              <span className="text-[10px] text-sky-800 font-bold block">📍 Kho lấy hàng (Pickup):</span>
                              <span className="font-medium text-xs text-slate-900 block mt-0.5">{air.pickupAddress}</span>
                            </div>
                          ) : null}
                          {air.deliveryAddress ? (
                            <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/80 shadow-2xs">
                              <span className="text-[10px] text-rose-800 font-bold block">📍 Kho giao hàng (Delivery):</span>
                              <span className="font-medium text-xs text-slate-900 block mt-0.5">{air.deliveryAddress}</span>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 4. COLD CHAIN SPECS */}
              {inquiry.serviceType === 'Cold Chain' && coldChain && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {coldChain.temperatureCategory ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Dải nhiệt độ yêu cầu</span>
                        <span className="font-extrabold text-cyan-800 truncate block">{coldChain.temperatureCategory}</span>
                      </div>
                    ) : null}
                    {coldChain.vehicleOrContType ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Loại xe / Cont lạnh</span>
                        <span className="font-extrabold text-slate-900">{coldChain.vehicleOrContType}</span>
                      </div>
                    ) : null}
                    {typeof coldChain.preCoolingRequested === 'boolean' ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Làm lạnh trước (Pre-cooling)</span>
                        <span className="font-extrabold text-slate-900">{coldChain.preCoolingRequested ? 'Có' : 'Không'}</span>
                      </div>
                    ) : null}
                    {typeof coldChain.backupGensetIncluded === 'boolean' ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Máy phát điện Genset</span>
                        <span className="font-extrabold text-slate-900">{coldChain.backupGensetIncluded ? 'Có' : 'Không'}</span>
                      </div>
                    ) : null}
                  </div>
                  {coldChain.isPharmaCertifiedGDP ? (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold">
                      ✓ Đạt chứng nhận GDP cho Dược phẩm & Y tế
                    </div>
                  ) : null}
                </div>
              )}

              {/* 5. WAREHOUSING SPECS */}
              {inquiry.serviceType === 'Warehousing' && warehousing && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Mô hình thuê kho</span>
                      <span className="font-extrabold text-purple-900">
                        {warehousing.warehousingLeaseModel === 'OVERFLOW' || inquiry.pricingType === 'SPOT' || warehousing.rentalDurationMonths < 12
                          ? '🌊 Kho Tràn / Mùa Vụ (Overflow)'
                          : '🏢 Kho Dài Hạn (Dedicated Hub)'}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Loại hình kho bãi</span>
                      <span className="font-extrabold text-slate-900 truncate block">{warehousing.warehouseType || 'Kho thường'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Đơn vị tính cước ưa chuộng</span>
                      <span className="font-extrabold text-indigo-700">{warehousing.billingUnitPreference || 'm² (Diện tích sàn)'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Thời hạn hợp đồng</span>
                      <span className="font-extrabold text-slate-900">{inquiry.contractTerm || `${warehousing.rentalDurationMonths || 12} Tháng`}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {warehousing.dailyOrderCount ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Lượng đơn xuất / ngày</span>
                        <span className="font-extrabold text-purple-900">{warehousing.dailyOrderCount} Đơn/ngày</span>
                      </div>
                    ) : null}
                    {(warehousing.bufferStorageQty || warehousing.bufferPalletPositions) ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Trữ đệm Pick & Pack</span>
                        <span className="font-extrabold text-slate-900">
                          {warehousing.bufferStorageQty ? `${warehousing.bufferStorageQty} ${warehousing.bufferStorageUnit || 'Pallets'}` : `${warehousing.bufferPalletPositions} Pallets`}
                        </span>
                      </div>
                    ) : null}
                    {warehousing.storageAreaSqm ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Diện tích thuê kho</span>
                        <span className="font-extrabold text-slate-900">{warehousing.storageAreaSqm} m²</span>
                      </div>
                    ) : null}
                    {warehousing.palletPositions ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng vị trí Pallet</span>
                        <span className="font-extrabold text-slate-900">{warehousing.palletPositions} vị trí (slots)</span>
                      </div>
                    ) : null}
                    {warehousing.cbmVolume ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Thể tích lưu trữ thực tế</span>
                        <span className="font-extrabold text-purple-900">{warehousing.cbmVolume} CBM m³</span>
                      </div>
                    ) : null}
                    {warehousing.skuCount ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng mã SKU</span>
                        <span className="font-extrabold text-slate-900">{warehousing.skuCount} SKUs</span>
                      </div>
                    ) : null}
                  </div>

                  {(warehousing.dailyInboundVolume || warehousing.dailyOutboundVolume || warehousing.inventoryMethod) && (
                    <div className="p-3 bg-white rounded-xl border border-purple-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs shadow-2xs">
                      {warehousing.dailyInboundVolume ? (
                        <div>
                          <span className="text-[10px] text-purple-800 font-semibold block">Lưu lượng Nhập kho:</span>
                          <span className="font-bold text-slate-900">{warehousing.dailyInboundVolume}</span>
                        </div>
                      ) : null}
                      {warehousing.dailyOutboundVolume ? (
                        <div>
                          <span className="text-[10px] text-purple-800 font-semibold block">Lưu lượng Xuất kho:</span>
                          <span className="font-bold text-slate-900">{warehousing.dailyOutboundVolume}</span>
                        </div>
                      ) : null}
                      {warehousing.inventoryMethod ? (
                        <div>
                          <span className="text-[10px] text-purple-800 font-semibold block">Quản lý xuất nhập:</span>
                          <span className="font-bold text-indigo-700">{warehousing.inventoryMethod}</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {(warehousing.humidityRequirement || warehousing.inboundTemperatureState) && (
                    <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs shadow-2xs">
                      {warehousing.humidityRequirement ? (
                        <div>
                          <span className="text-[10px] text-cyan-800 font-bold block">Kiểm soát độ ẩm (% RH):</span>
                          <span className="font-extrabold text-cyan-950">
                            {warehousing.humidityRequirement === 'Tùy chỉnh riêng (% RH)' ? (warehousing.customHumidity || 'Tùy chỉnh riêng') : warehousing.humidityRequirement}
                          </span>
                        </div>
                      ) : null}
                      {warehousing.inboundTemperatureState ? (
                        <div>
                          <span className="text-[10px] text-cyan-800 font-bold block">Trạng thái nhiệt độ hàng nhập:</span>
                          <span className="font-extrabold text-slate-900">
                            {warehousing.inboundTemperatureState === 'NEED_COOLING' ? '⚡ Cần hạ nhiệt / cấp đông tại kho' : '❄️ Đã hạ nhiệt/cấp đông từ trước (Pre-cooled)'}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {(warehousing.bondedPurpose || warehousing.bondedHsCode || warehousing.bondedEstimatedValue) && (
                    <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs shadow-2xs">
                      {warehousing.bondedPurpose ? (
                        <div className="sm:col-span-1">
                          <span className="text-[10px] text-indigo-800 font-bold block">Luồng hàng ngoại quan:</span>
                          <span className="font-extrabold text-indigo-950">{warehousing.bondedPurpose}</span>
                        </div>
                      ) : null}
                      {warehousing.bondedHsCode ? (
                        <div>
                          <span className="text-[10px] text-indigo-800 font-bold block">Mã HS Code đại diện:</span>
                          <span className="font-mono font-bold text-amber-900">{warehousing.bondedHsCode}</span>
                        </div>
                      ) : null}
                      {warehousing.bondedEstimatedValue ? (
                        <div>
                          <span className="text-[10px] text-indigo-800 font-bold block">Trị giá hàng ước tính:</span>
                          <span className="font-extrabold text-emerald-800">
                            {typeof warehousing.bondedEstimatedValue === 'number' ? warehousing.bondedEstimatedValue.toLocaleString('vi-VN') : warehousing.bondedEstimatedValue} {warehousing.bondedEstimatedValueCurrency || 'USD'}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* 6. CUSTOMS CLEARANCE SPECS */}
              {inquiry.serviceType === 'Customs Clearance' && customs && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                    <span className="font-extrabold text-blue-700">{customs.tradeRole || inquiry.tradeRole || 'Nhập khẩu (Import)'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Loại hình tờ khai HQ</span>
                    <span className="font-extrabold text-slate-900 truncate block">{customs.declarationType}</span>
                  </div>
                  {customs.customsSubDepartment ? (
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Chi cục Hải quan</span>
                      <span className="font-extrabold text-slate-900 truncate block">{customs.customsSubDepartment}</span>
                    </div>
                  ) : null}
                  {customs.committedVolume ? (
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Sản lượng cam kết</span>
                      <span className="font-extrabold text-amber-900">{customs.committedVolume} {customs.committedFrequency || 'Tờ khai / Tháng'}</span>
                    </div>
                  ) : null}
                  {customs.coFormRequested && customs.coFormRequested !== 'Không yêu cầu' ? (
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Chứng nhận xuất xứ C/O</span>
                      <span className="font-extrabold text-indigo-700">{customs.coFormRequested}</span>
                    </div>
                  ) : null}
                  {customs.specializedInspectionType && customs.specializedInspectionType !== 'Không có' ? (
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs col-span-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Kiểm tra chuyên ngành</span>
                      <span className="font-extrabold text-blue-800">{customs.specializedInspectionType}</span>
                    </div>
                  ) : null}
                  {customs.redChannelInspectionSupport ? (
                    <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200 shadow-2xs col-span-2 flex items-center gap-1.5">
                      <span className="text-rose-700 font-bold text-xs">🔴 Có yêu cầu hỗ trợ kiểm hóa thực tế Luồng Đỏ tại cảng</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* 7. CROSS-BORDER SPECS */}
              {inquiry.serviceType === 'Cross-border' && crossBorder && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Vai trò & Incoterms</span>
                    <span className="font-extrabold text-blue-700 block truncate">{crossBorder.tradeRole || inquiry.tradeRole || 'Xuất khẩu (Export)'}</span>
                    {crossBorder.incoterms ? <span className="text-[10px] text-slate-600 block truncate">{crossBorder.incoterms.split('-')[0]}</span> : null}
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Hình thức vận chuyển</span>
                    <span className="font-extrabold text-orange-900 block truncate">{crossBorder.loadType || 'FTL (Nguyên chuyến)'}</span>
                  </div>
                  {crossBorder.borderGate ? (
                    <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs col-span-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Cửa khẩu thông quan</span>
                      <span className="font-extrabold text-slate-900 truncate block">{crossBorder.borderGate}</span>
                    </div>
                  ) : null}
                  {crossBorder.cargoMode ? (
                    <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs col-span-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Phương thức qua biên giới</span>
                      <span className="font-extrabold text-slate-900 truncate block">{crossBorder.cargoMode}</span>
                    </div>
                  ) : null}
                  {crossBorder.customsScope ? (
                    <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs col-span-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Phạm vi hải quan cửa khẩu</span>
                      <span className="font-extrabold text-indigo-700 truncate block">{crossBorder.customsScope}</span>
                    </div>
                  ) : null}
                  {crossBorder.vehicleType ? (
                    <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs col-span-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Loại xe / Container</span>
                      <span className="font-extrabold text-slate-900 truncate block">{crossBorder.vehicleType}</span>
                    </div>
                  ) : null}
                  {crossBorder.loadType === 'LTL (Ghép hàng lẻ)' ? (
                    crossBorder.shipmentCount ? (
                      <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs col-span-2">
                        <span className="text-[10px] text-slate-400 block font-medium">Sản lượng ghép hàng</span>
                        <span className="font-extrabold text-slate-900">{crossBorder.shipmentCount} {crossBorder.frequencyUnit || 'Lô hàng'}</span>
                      </div>
                    ) : null
                  ) : (
                    crossBorder.vehicleCount ? (
                      <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs col-span-2">
                        <span className="text-[10px] text-slate-400 block font-medium">Sản lượng chuyến xe</span>
                        <span className="font-extrabold text-slate-900">{crossBorder.vehicleCount} {crossBorder.frequencyUnit || 'Chuyến'}</span>
                      </div>
                    ) : null
                  )}
                  {crossBorder.pickupLocations && crossBorder.pickupLocations.length > 1 ? (
                    <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-2xs col-span-2 sm:col-span-4">
                      <span className="text-[10px] text-slate-400 block font-medium">Lộ trình lấy hàng đa điểm ({crossBorder.pickupLocations.length} Điểm lấy)</span>
                      <ul className="text-xs text-slate-800 list-disc list-inside mt-0.5 space-y-0.5 font-semibold">
                        {crossBorder.pickupLocations.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {crossBorder.deliveryLocations && crossBorder.deliveryLocations.length > 1 ? (
                    <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-2xs col-span-2 sm:col-span-4">
                      <span className="text-[10px] text-slate-400 block font-medium">Lộ trình giao hàng đa điểm ({crossBorder.deliveryLocations.length} Điểm giao / Multi-drop)</span>
                      <ul className="text-xs text-slate-800 list-disc list-inside mt-0.5 space-y-0.5 font-semibold">
                        {crossBorder.deliveryLocations.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {crossBorder.leadtimeSLA ? (
                    <div className="bg-orange-50/80 p-2.5 rounded-xl border border-orange-200 shadow-2xs col-span-2 sm:col-span-4">
                      <span className="text-[10px] text-orange-700 block font-bold">⏱️ Thời gian giao hàng (Leadtime SLA)</span>
                      <span className="font-extrabold text-orange-950 text-xs block">{crossBorder.leadtimeSLA}</span>
                      {crossBorder.leadtimeNote ? <span className="text-[11px] text-slate-600 block mt-0.5">Ghi chú: {crossBorder.leadtimeNote}</span> : null}
                    </div>
                  ) : null}
                </div>
              )}

              {/* 8. RAIL FREIGHT SPECS */}
              {inquiry.serviceType === 'Rail Freight' && rail && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                      <span className="font-extrabold text-blue-700">{rail.tradeRole || inquiry.tradeRole || 'Nội địa Bắc - Nam'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Phương thức đường sắt</span>
                      <span className="font-extrabold text-slate-900">{rail.mode || 'FCL (Nguyên container ga - ga)'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Điều kiện nhận & giao</span>
                      <span className="font-extrabold text-blue-950">
                        {rail.originServiceTerm || 'CY'} ➔ {rail.destinationServiceTerm || 'CY'}
                      </span>
                    </div>
                    {rail.containerType ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Loại Container / Toa</span>
                        <span className="font-extrabold text-slate-900 truncate block">{rail.containerType}</span>
                      </div>
                    ) : null}
                    {rail.incoterm ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Điều kiện Incoterms</span>
                        <span className="font-extrabold text-indigo-700">{rail.incoterm}</span>
                      </div>
                    ) : null}
                    {rail.freeDemDetDaysRequested ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Miễn phí lưu bãi ga</span>
                        <span className="font-extrabold text-slate-900">{rail.freeDemDetDaysRequested} Ngày</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {rail.mode?.includes('FCL') && rail.containerCount ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng & Tần suất Container</span>
                        <span className="font-extrabold text-slate-900">
                          {rail.containerCount} {rail.containerCountUnit || 'Container / Tháng'}
                        </span>
                      </div>
                    ) : null}
                    {rail.mode?.includes('LCL') ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Số lượng chuyến & Tần suất LCL</span>
                        <span className="font-extrabold text-blue-950">
                          {rail.lclShipmentCount || 1} {rail.lclFrequencyUnit || 'chuyến / tháng'}
                        </span>
                      </div>
                    ) : null}
                    {rail.originStation ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Ga xếp hàng (Origin Station)</span>
                        <span className="font-extrabold text-slate-900 truncate block">{rail.originStation}</span>
                      </div>
                    ) : null}
                    {rail.destinationStation ? (
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Ga dỡ hàng (Destination Station)</span>
                        <span className="font-extrabold text-slate-900 truncate block">{rail.destinationStation}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* LCL Rail Details */}
                  {(rail.mode?.includes('LCL') || rail.lclCbm || rail.lclPieces) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 bg-white rounded-xl border border-blue-200/80 shadow-2xs">
                      <div>
                        <span className="text-[10px] text-blue-800 font-semibold block">Số lượng kiện LCL:</span>
                        <span className="font-extrabold text-slate-900">{rail.lclPieces || 1} kiện</span>
                      </div>
                      {rail.lclDimensions ? (
                        <div>
                          <span className="text-[10px] text-blue-800 font-semibold block">Kích thước 1 kiện (DxRxC):</span>
                          <span className="font-extrabold text-slate-900">
                            {rail.lclDimensions.lengthCm}x{rail.lclDimensions.widthCm}x{rail.lclDimensions.heightCm} cm
                          </span>
                        </div>
                      ) : null}
                      {rail.lclGrossWeightKg !== undefined && rail.lclGrossWeightKg !== null ? (
                        <div>
                          <span className="text-[10px] text-blue-800 font-semibold block">Trọng lượng thực (Gross):</span>
                          <span className="font-extrabold text-slate-900">{Number(rail.lclGrossWeightKg).toLocaleString('vi-VN')} kg</span>
                        </div>
                      ) : null}
                      {rail.lclCbm !== undefined && rail.lclCbm !== null ? (
                        <div>
                          <span className="text-[10px] text-blue-800 font-semibold block">Tổng thể tích tính toán:</span>
                          <span className="font-extrabold text-blue-900">{rail.lclCbm} CBM</span>
                        </div>
                      ) : null}
                      {rail.lclChargeableWeightKg !== undefined && rail.lclChargeableWeightKg !== null ? (
                        <div>
                          <span className="text-[10px] text-blue-800 font-semibold block">Trọng lượng tính cước:</span>
                          <span className="font-extrabold text-indigo-900">
                            {Number(rail.lclChargeableWeightKg).toLocaleString('vi-VN')} kg ({rail.lclRevenueTon || (rail.lclChargeableWeightKg / 1000).toFixed(2)} RT)
                          </span>
                        </div>
                      ) : null}
                      {typeof rail.lclStackable === 'boolean' && (
                        <div>
                          <span className="text-[10px] text-blue-800 font-semibold block">Xếp chồng (Stackable):</span>
                          <span className={`font-extrabold ${rail.lclStackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {rail.lclStackable ? '✓ Cho phép chồng' : '⚠️ Không chồng'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {(rail.pickupAddress || rail.deliveryAddress) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {rail.pickupAddress ? (
                        <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-200/80 shadow-2xs">
                          <span className="text-[10px] text-blue-800 font-bold block">📍 Kho lấy hàng (Pickup):</span>
                          <span className="font-medium text-xs text-slate-900 block mt-0.5">{rail.pickupAddress}</span>
                        </div>
                      ) : null}
                      {rail.deliveryAddress ? (
                        <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/80 shadow-2xs">
                          <span className="text-[10px] text-rose-800 font-bold block">📍 Kho giao hàng (Delivery):</span>
                          <span className="font-medium text-xs text-slate-900 block mt-0.5">{rail.deliveryAddress}</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* 9. PROJECT / LOGISTICS SOLUTIONS SPECS */}
              {inquiry.serviceType === 'Project Cargo' && project && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Mô hình dự án</span>
                      <span className="font-extrabold text-indigo-900 block truncate">
                        {project.projectCategory === 'DISTRIBUTION'
                          ? '🏬 Phân Phối Tổng Thể'
                          : project.projectCategory === 'CROSS_DOCK'
                          ? '⚡ Trạm Cross-Dock'
                          : '🌐 Đa Phương Thức'}
                      </span>
                    </div>

                    {project.projectCategory === 'DISTRIBUTION' && (
                      <>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Kênh phân phối</span>
                          <span className="font-extrabold text-slate-900 block truncate">{project.distributionChannel || 'B2B / Siêu thị'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Phạm vi địa lý</span>
                          <span className="font-extrabold text-slate-900 block truncate">{project.coverageScope || 'Toàn quốc'}</span>
                        </div>
                        {project.tripCount || project.monthlyTripsOrVolume ? (
                          <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Sản lượng chuyến</span>
                            <span className="font-extrabold text-slate-900 block truncate">
                              {project.tripCount
                                ? `${project.tripCount} ${project.frequencyUnit || 'Chuyến / Tháng'}`
                                : project.monthlyTripsOrVolume}
                            </span>
                          </div>
                        ) : null}
                      </>
                    )}

                    {project.projectCategory === 'CROSS_DOCK' && (
                      <>
                        <div className="bg-purple-50/80 p-2.5 rounded-xl border border-purple-200 shadow-2xs col-span-2">
                          <span className="text-[10px] text-purple-800 block font-bold">Phạm vi luân chuyển X-Dock</span>
                          <span className="font-extrabold text-purple-950 block truncate">{project.xDockScope || 'Nội Vùng (Intra-region)'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Trạm gom nguồn (Origin Hub)</span>
                          <span className="font-extrabold text-slate-900 block truncate">{project.xDockHubLocation || inquiry.origin || 'Trung tâm'}</span>
                        </div>
                        {project.xDockDestinationHub && (
                          <div className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Trạm phân phối đích</span>
                            <span className="font-extrabold text-slate-900 block truncate">{project.xDockDestinationHub}</span>
                          </div>
                        )}
                        <div className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Nhiệt độ sàn</span>
                          <span className="font-extrabold text-purple-900 block truncate">{project.xDockTemperature || 'Thường'}</span>
                        </div>
                        {(project.xDockInboundVolume || project.inboundDailyVolume) ? (
                          <div className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs col-span-2 sm:col-span-3">
                            <span className="text-[10px] text-slate-400 block font-medium">Sản lượng Inbound & Đơn vị cước</span>
                            <span className="font-extrabold text-slate-900 block truncate">
                              {project.xDockInboundVolume || project.inboundDailyVolume} ({project.xDockPricingMetric || 'VND/kg'}) - {project.xDockInboundFrequencyUnit || 'Hàng ngày'}
                            </span>
                          </div>
                        ) : null}
                      </>
                    )}

                    {project.projectCategory === 'PORT_ICD' && (
                      <>
                        <div className="bg-sky-50/80 p-2.5 rounded-xl border border-sky-200 shadow-2xs col-span-2">
                          <span className="text-[10px] text-sky-800 block font-bold">Hình thức luân chuyển Cảng ↔ ICD</span>
                          <span className="font-extrabold text-sky-950 block truncate">{project.portIcdShuttleMode || 'Đầu kéo chuyên tuyến'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Cảng biển gốc (Origin Port)</span>
                          <span className="font-extrabold text-slate-900 block truncate">{project.portIcdOriginPort || inquiry.origin || 'Cảng biển'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Cảng cạn đích (Destination ICD)</span>
                          <span className="font-extrabold text-slate-900 block truncate">{project.portIcdDestinationIcd || inquiry.destination || 'ICD'}</span>
                        </div>
                        {project.portIcdMonthlyTeuOrVolume ? (
                          <div className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs col-span-2">
                            <span className="text-[10px] text-slate-400 block font-medium">Sản lượng Container cam kết</span>
                            <span className="font-extrabold text-sky-900 block truncate">{project.portIcdMonthlyTeuOrVolume}</span>
                          </div>
                        ) : null}
                      </>
                    )}

                    {project.projectCategory === 'MULTIMODAL' && (
                      <>
                        <div className="bg-white p-2.5 rounded-xl border border-teal-100 shadow-2xs col-span-2">
                          <span className="text-[10px] text-slate-400 block font-medium">Mô hình kết hợp</span>
                          <span className="font-extrabold text-teal-950 block truncate">{project.multimodalCombination}</span>
                        </div>
                        {project.multimodalContainerType ? (
                          <div className="bg-white p-2.5 rounded-xl border border-teal-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Loại Container / Xe</span>
                            <span className="font-extrabold text-slate-900 block truncate">{project.multimodalContainerType}</span>
                          </div>
                        ) : null}
                        {project.multimodalMonthlyTeuOrVolume ? (
                          <div className="bg-white p-2.5 rounded-xl border border-teal-100 shadow-2xs">
                            <span className="text-[10px] text-slate-400 block font-medium">Sản lượng cam kết</span>
                            <span className="font-extrabold text-slate-900 block truncate">{project.multimodalMonthlyTeuOrVolume}</span>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  {/* Budget & Timeline */}
                  {(project.estimatedBudget || project.expectedStartDate) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {project.estimatedBudget ? (
                        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                          <span className="text-[10px] text-emerald-800 font-bold block">💰 Giá trị gói thầu dự kiến (Budget):</span>
                          <span className="font-extrabold text-sm text-emerald-950 font-mono block mt-0.5">
                            {typeof project.estimatedBudget === 'number' ? project.estimatedBudget.toLocaleString('vi-VN') : project.estimatedBudget} {project.budgetCurrency || 'VND'}
                          </span>
                        </div>
                      ) : null}
                      {project.expectedStartDate ? (
                        <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                          <span className="text-[10px] text-slate-400 font-medium block">🗓️ Kế hoạch triển khai (Start Date):</span>
                          <span className="font-bold text-xs text-slate-900 block mt-0.5">{project.expectedStartDate}</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {project.originWarehouses && project.originWarehouses.length > 1 && (
                    <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-200/80 shadow-2xs">
                      <span className="text-[10px] text-indigo-800 font-bold block">Danh sách kho tổng xuất hàng ({project.originWarehouses.length} Kho):</span>
                      <ul className="text-xs text-slate-900 list-disc list-inside mt-0.5 space-y-0.5 font-medium">
                        {project.originWarehouses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.fleetRequirements && project.fleetRequirements.length > 0 && (
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-medium">Cơ cấu đội xe yêu cầu:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.fleetRequirements.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-800 rounded border border-indigo-200">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.targetRetailChains && project.targetRetailChains.length > 0 && (
                    <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-200/80 shadow-2xs">
                      <span className="text-[10px] text-purple-800 font-bold block">Chuỗi Siêu Thị / Kênh Giao Hàng Outbound ({project.targetRetailChains.length} Kênh):</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.targetRetailChains.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-bold bg-white text-purple-900 rounded-md border border-purple-200 shadow-2xs">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.portIcdOperations && project.portIcdOperations.length > 0 && (
                    <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-200/80 shadow-2xs">
                      <span className="text-[10px] text-sky-800 font-bold block">Gói Nghiệp Vụ Bãi Cảng & ICD ({project.portIcdOperations.length} Dịch vụ):</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.portIcdOperations.map((op, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-bold bg-white text-sky-900 rounded-md border border-sky-200 shadow-2xs">
                            {op}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.portIcdContainerTypes && project.portIcdContainerTypes.length > 0 && (
                    <div className="bg-white p-2.5 rounded-xl border border-sky-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-bold block">Chủng loại Container khai thác:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.portIcdContainerTypes.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-800 rounded-md border border-sky-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* HẠNG MỤC 5: YÊU CẦU PHỤ PHÍ & ĐIỀU KHOẢN BÁO GIÁ (LOCAL CHARGES & SURCHARGES) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">5</span>
                <span>
                  {inquiry.serviceType === 'Warehousing'
                    ? 'Yêu Cầu Phụ Phí & Điều Khoản Báo Giá Kho Bãi (Operational Surcharges)'
                    : inquiry.serviceType.startsWith('Sea Freight') || inquiry.serviceType === 'Air Freight'
                    ? 'Yêu Cầu Phụ Phí & Điều Khoản Báo Giá (Local Charges & Surcharges)'
                    : 'Yêu Cầu Phụ Phí & Điều Khoản Báo Giá (Surcharges & Terms)'}
                </span>
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                inquiry.quotationScope === 'ALL_IN' || !inquiry.quotationScope
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {inquiry.quotationScope === 'ALL_IN' || !inquiry.quotationScope ? '✓ Báo Giá Trọn Gói (All-in)' : '📋 Báo Giá Tách Dòng (Itemized)'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-900">
                      Hình thức chào giá yêu cầu: <span className="text-indigo-700 font-extrabold">{inquiry.quotationScope === 'ALL_IN' || !inquiry.quotationScope ? 'Báo giá trọn gói All-in (Không phát sinh chi phí ẩn)' : 'Báo giá tách riêng cước chính & phụ phí'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {inquiry.requestedSurcharges?.length || 0} Phụ phí đã chỉ định
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {inquiry.serviceType === 'Warehousing' ? (
                      inquiry.quotationScope === 'ALL_IN' || !inquiry.quotationScope
                        ? 'Đơn vị vận hành kho bãi phải chào giá tổng bao gồm phí lưu kho chính và đầy đủ các phụ phí vận hành được liệt kê dưới đây.'
                        : 'Đơn vị vận hành kho bãi tách riêng phí lưu kho chính và liệt kê chi tiết đơn giá từng loại phụ phí bốc xếp, nâng hạ, WMS.'
                    ) : (
                      inquiry.quotationScope === 'ALL_IN' || !inquiry.quotationScope
                        ? 'Nhà vận tải phải chào giá tổng bao gồm cước vận chuyển chính và đầy đủ các phụ phí được liệt kê dưới đây.'
                        : 'Nhà vận tải tách riêng cước vận chuyển chính và liệt kê chi tiết đơn giá từng loại phụ phí.'
                    )}
                  </p>
                </div>
              </div>

              {inquiry.requestedSurcharges && inquiry.requestedSurcharges.length > 0 ? (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
                    Danh Sách Phụ Phí Yêu Cầu Bao Gồm / Làm Rõ Trong Báo Giá:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inquiry.requestedSurcharges.map((charge, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-xl bg-indigo-50/40 border border-indigo-100 text-slate-800 font-medium flex items-start gap-2 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{charge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Theo biểu phí phụ phí chuẩn của nhà vận tải.</p>
              )}

              {inquiry.surchargesNotes && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">
                    Ghi Chú Đặc Thù Về Phụ Phí:
                  </span>
                  <p className="text-xs font-semibold">{inquiry.surchargesNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* HẠNG MỤC 6: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">6</span>
                <span>Dịch Vụ Giá Trị Gia Tăng (VAS) Khách Hàng Chọn</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {inquiry.selectedVAS && inquiry.selectedVAS.length > 0 ? `${inquiry.selectedVAS.length} Dịch vụ VAS đã chọn` : 'Không chọn VAS'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {inquiry.selectedVAS && inquiry.selectedVAS.length > 0 ? (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                    Các Dịch Vụ Gia Tăng Đã Khai Báo Cần Báo Giá:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.selectedVAS.map((vas, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg flex items-center gap-1.5 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        {vas}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Không yêu cầu dịch vụ giá trị gia tăng phụ trợ.</p>
              )}
            </div>
          </div>

          {/* HẠNG MỤC 7: ĐƠN GIÁ KỲ VỌNG & THỜI HẠN BÁO GIÁ */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">7</span>
                <span>Đơn Giá Kỳ Vọng & Thời Hạn Báo Giá</span>
              </span>
              <span className="text-xs font-bold text-indigo-600">
                Tiền tệ: {inquiry.currency || 'VND'}
              </span>
            </div>

            {/* Financials & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3.5">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">
                  Đơn Giá Kỳ Vọng
                </span>
                <p className="text-base font-black text-emerald-700">
                  {inquiry.targetBudget}
                </p>
                {inquiry.currency !== 'VND' && inquiry.exchangeRate && (
                  <p className="text-[10.5px] text-emerald-600 mt-0.5">
                    Tỉ giá: 1 {inquiry.currency} = {inquiry.exchangeRate.toLocaleString('vi-VN')} VND
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">
                  Hạn Nhận Báo Giá (Deadline)
                </span>
                <p className="text-sm font-black text-amber-900 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  {inquiry.expiryDate}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                <span className="text-[10px] font-bold text-sky-800 uppercase block mb-0.5">
                  Thời Gian Thực Hiện Dự Kiến
                </span>
                <p className="text-xs font-bold text-sky-900 mt-0.5">
                  Ngày lấy hàng: <span className="font-black">{inquiry.pickupDate}</span>
                </p>
                <p className="text-xs font-bold text-sky-900 mt-0.5">
                  Hạn giao hàng: <span className="font-black">{inquiry.deliveryDate || 'Theo thỏa thuận'}</span>
                </p>
              </div>
            </div>

            {/* Title & Notes */}
            <div className="space-y-2 text-xs">
              {inquiry.title && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                    Tiêu Đề Yêu Cầu:
                  </span>
                  <p className="font-bold text-slate-900">{inquiry.title}</p>
                </div>
              )}

              {inquiry.description && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                    Ghi Chú Yêu Cầu:
                  </span>
                  <p className="text-slate-700 italic font-medium">"{inquiry.description}"</p>
                </div>
              )}
            </div>

            {/* Attached Files List */}
            {inquiry.attachments && inquiry.attachments.length > 0 ? (
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tài Liệu Đính Kèm ({inquiry.attachments.length} Tệp tin)</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {inquiry.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs"
                    >
                      <span className={`p-1.5 rounded-lg shrink-0 ${
                        att.type === 'excel' ? 'bg-emerald-100 text-emerald-700' :
                        att.type === 'pdf' ? 'bg-rose-100 text-rose-700' :
                        att.type === 'image' ? 'bg-purple-100 text-purple-700' :
                        att.type === 'archive' ? 'bg-amber-100 text-amber-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {att.type === 'excel' && <FileSpreadsheet className="w-4 h-4" />}
                        {att.type === 'pdf' && <FileText className="w-4 h-4" />}
                        {att.type === 'image' && <ImageIcon className="w-4 h-4" />}
                        {att.type === 'archive' && <FileArchive className="w-4 h-4" />}
                        {att.type !== 'excel' && att.type !== 'pdf' && att.type !== 'image' && att.type !== 'archive' && (
                          <Paperclip className="w-4 h-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate text-xs" title={att.name}>{att.name}</p>
                        <p className="text-[10.5px] text-slate-400">{att.size} • {att.uploadedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {!isPublished ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Quay Lại Chỉnh Sửa Form</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Đóng & Về Danh Sách RFQ</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isPublished ? (
              <button
                type="button"
                id="btn-share-rfq"
                onClick={handleCopyLink}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-[0.98] ${
                  copiedLink
                    ? 'bg-slate-900 text-emerald-300 ring-2 ring-emerald-400 shadow-slate-900/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30 hover:scale-[1.02]'
                }`}
              >
                {copiedLink ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>Đã Sao Chép Link Lead Board!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-white" />
                    <span>Chia Sẻ RFQ (Gửi Nhà Cung Cấp Ngoài)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                id="btn-confirm-publish-inquiry"
                onClick={handleConfirmPublish}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Xác Nhận Phát Hành Yêu Cầu (Confirm & Publish)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
