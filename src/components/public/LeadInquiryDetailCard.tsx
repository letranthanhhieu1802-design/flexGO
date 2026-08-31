import React, { useState } from 'react';
import {
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  Train,
  Boxes,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Download,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  PhoneCall,
  MessageSquare,
  Mail,
  Copy,
  Check,
  KeyRound,
  Coins,
  Building2,
  Phone,
  Bookmark,
  BookmarkCheck,
  BarChart3,
  Send,
  Sparkles,
  Lock,
  Info,
  Share2,
  BadgePercent,
  Receipt,
  Wrench,
  AlertTriangle,
  Flame,
  Calendar,
  DollarSign,
  PackageCheck,
  Tag,
  CheckCircle
} from 'lucide-react';
import { SupplierLeadItem, ServiceType, ProjectInquirySpecs, InquiryAttachment } from '../../types';

interface LeadInquiryDetailCardProps {
  lead: SupplierLeadItem;
  isUnlocked?: boolean;
  maskCompanyName?: (name: string, unlocked?: boolean) => string;
  maskContactPerson?: (name: string, unlocked?: boolean) => string;
  onUnlockClick?: () => void;
  onOpenCreateQuotation?: (lead: SupplierLeadItem) => void;
  onToggleSaveLead?: (lead: SupplierLeadItem, e?: React.MouseEvent) => void;
  onCompareClick?: (lead: SupplierLeadItem) => void;
  isCustomerView?: boolean;
}

export const LeadInquiryDetailCard: React.FC<LeadInquiryDetailCardProps> = ({
  lead,
  isUnlocked = false,
  maskCompanyName = (name: string) => name,
  maskContactPerson = (name: string) => name,
  onUnlockClick,
  onOpenCreateQuotation,
  onToggleSaveLead,
  onCompareClick,
  isCustomerView = false,
}) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedShareLead, setCopiedShareLead] = useState(false);

  const inq = lead.inquiry;
  const specs = lead.serviceSpecs || inq?.serviceSpecs;
  const sType = lead.serviceType;
  const code = lead.code;

  const phoneValue = lead.contactPhone || inq?.contactPerson || '0908 123 456';
  const emailValue = lead.contactEmail || 'procurement@shipper-logistics.vn';
  const taxIdValue = lead.taxId || '0314892831';

  const handleShareLead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const leadCode = lead.code;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`
      : `https://logistics.vietnam.io/?tab=lead-board&leadCode=${leadCode}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedShareLead(true);
    setTimeout(() => setCopiedShareLead(false), 2500);
  };

  const handleCopyPhone = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleDownloadFile = (fileName: string) => {
    setDownloadToast(`Đang tải tệp tin: ${fileName}`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);
  };

  // Helper for Service Category Config
  const getServiceInfo = () => {
    switch (sType) {
      case 'Trucking':
        return { name: 'Vận Tải Đường Bộ (Trucking)', icon: Truck, color: 'emerald' };
      case 'Sea Freight (FCL)':
        return { name: 'Vận Tải Đường Biển FCL (Nguyên Container)', icon: Ship, color: 'blue' };
      case 'Sea Freight (LCL)':
        return { name: 'Vận Tải Đường Biển LCL (Gom Hàng Lẻ CFS)', icon: Ship, color: 'cyan' };
      case 'Air Freight':
        return { name: 'Vận Tải Hàng Không (Air Freight)', icon: Plane, color: 'sky' };
      case 'Cold Chain':
        return { name: 'Vận Tải Chuỗi Lạnh (Cold Chain Logistics)', icon: Snowflake, color: 'amber' };
      case 'Warehousing':
        return { name: 'Kho Bãi & Hoàn Tất Đơn Hàng (3PL Warehousing)', icon: Warehouse, color: 'purple' };
      case 'Customs Clearance':
        return { name: 'Đại Lý Thủ Tục Hải Quan (Customs Brokerage)', icon: FileCheck2, color: 'violet' };
      case 'Cross-border':
        return { name: 'Vận Tải Liên Vận Xuyên Biên Giới (Cross-Border)', icon: Globe, color: 'rose' };
      case 'Rail Freight':
        return { name: 'Vận Tải Đường Sắt Liên Vận (Rail Freight)', icon: Train, color: 'indigo' };
      case 'Project Cargo':
        return { name: 'Dự Án Logistics & Đấu Thầu Chuỗi Cung Ứng (Project Cargo)', icon: Layers, color: 'indigo' };
      default:
        return { name: `Dịch Vụ Logistics ${sType}`, icon: Boxes, color: 'indigo' };
    }
  };

  const serviceInfo = getServiceInfo();
  const ServiceIconComponent = serviceInfo.icon;

  // Shortcuts to service specs
  const trucking = specs?.trucking;
  const ocean = specs?.ocean;
  const air = specs?.air;
  const coldChain = specs?.coldChain;
  const warehousing = specs?.warehousing;
  const customs = specs?.customs;
  const crossBorder = specs?.crossBorder;
  const rail = specs?.rail;
  const project = specs?.project;

  const isFcl = sType === 'Sea Freight (FCL)' || ocean?.mode?.includes('FCL');
  const isLcl = sType === 'Sea Freight (LCL)' || ocean?.mode?.includes('LCL');
  const isAirExpress = air?.airServiceType === 'Express / Courier';

  // Format list of pickup & delivery locations for trucking / coldchain
  const pickupList = trucking?.pickupLocations?.length ? trucking.pickupLocations : [lead.origin];
  const deliveryList = trucking?.deliveryLocations?.length ? trucking.deliveryLocations : [lead.destination];

  // Requested Surcharges list
  const requestedSurcharges = lead.requestedSurcharges || inq?.requestedSurcharges || [
    'Phí cầu đường & Trạm thu phí BOT toàn tuyến',
    'Phí bốc xếp hàng hóa 2 đầu (Kho gửi & Kho nhận)',
    'Phí nâng hạ bãi / Depot (Lift-on/off)',
  ];

  // VAS list
  const selectedVAS = lead.selectedVAS || inq?.selectedVAS || [
    'Bảo hiểm hàng hóa 100% giá trị',
    'Bọc màng co PE & Đóng gói pallet',
    'Định vị GPS Real-time & Cập nhật tiến độ',
  ];

  const surchargesNotes = lead.surchargesNotes || inq?.surchargesNotes;
  const quotationScope = lead.quotationScope || inq?.quotationScope || 'Báo giá trọn gói All-in (Không phát sinh chi phí ẩn)';
  const customerOperatingNotes = inq?.description || lead.description || lead.cargoDetails || 'Khách hàng yêu cầu đảm bảo chất lượng vận chuyển, tiến độ bàn giao và chứng từ đầy đủ.';

  // Default Attachments
  const attachments: InquiryAttachment[] = lead.attachments || inq?.attachments || [
    { id: 'att-1', name: 'Packing_List_Detailed_Shipment.xlsx', size: '320 KB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
    { id: 'att-2', name: 'Specification_Document.pdf', size: '1.5 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
  ];

  return (
    <div className="bg-slate-50/70 rounded-3xl border border-indigo-200/90 shadow-md overflow-hidden text-slate-900 animate-in fade-in duration-200 space-y-4 p-4 sm:p-6">
      
      {/* ──────────────────────────────────────────────────────────
          0. TOP ACTION & HEADER BAR (LEADBOARD CONTROLS)
          ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-slate-200 bg-white p-4 rounded-2xl border shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-xs shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Chi tiết yêu cầu
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isCustomerView
                ? 'Quy chuẩn kỹ thuật, phụ phí, chứng từ và yêu cầu dịch vụ đã khai báo'
                : 'Thông số kỹ thuật, phụ phí, chứng từ và thông tin liên hệ chủ hàng'}
            </p>
          </div>
        </div>

        {/* CỤM THAO TÁC HÀNH ĐỘNG */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Nút Compare Matrix cho Customer View */}
          {isCustomerView && onCompareClick && (
            <button
              type="button"
              id={`detail-customer-compare-btn-${lead.code}`}
              onClick={() => onCompareClick(lead)}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm"
              title="So sánh ma trận báo giá của các nhà cung cấp và tiến hành trao thầu (Award)"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Compare Matrix (So sánh báo giá)</span>
            </button>
          )}

          {/* Nút Chia sẻ link lead / inquiry */}
          <button
            type="button"
            id={`detail-share-link-btn-${lead.code}`}
            onClick={handleShareLead}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              copiedShareLead
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
            title={`Sao chép link trực tiếp lọc theo mã ID ${lead.code}`}
          >
            {copiedShareLead ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã Chép Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Chia Sẻ ({lead.code})</span>
              </>
            )}
          </button>

          {!isCustomerView && (
            <>
              {/* Nút Mở khóa SĐT & Đối thủ nếu chưa mở khóa */}
              {!isUnlocked ? (
                <button
                  type="button"
                  id={`detail-unlock-btn-${lead.code}`}
                  onClick={onUnlockClick}
                  className="group/unlock inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  title="Mở khóa để xem SĐT Hotline, Zalo, Email và Ma Trận Báo Giá Đối Thủ (50 Credits)"
                >
                  <KeyRound className="w-3.5 h-3.5 group-hover/unlock:rotate-12 transition-transform shrink-0 text-amber-100" />
                  <span>Mở khóa SĐT & Đối thủ</span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 text-amber-100 font-black text-[10px]">
                    <Coins className="w-3 h-3 text-amber-300" />
                    50
                  </span>
                </button>
              ) : (
                onCompareClick && (
                  <button
                    type="button"
                    id={`detail-compare-btn-${lead.code}`}
                    onClick={() => onCompareClick(lead)}
                    className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group/compare"
                    title="So sánh ma trận giá đối thủ & Phân tích thị trường"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-600 group-hover/compare:scale-110 transition-transform" />
                    <span>So Sánh Đối Thủ</span>
                  </button>
                )
              )}

              {/* Nút Tạo Báo Giá */}
              {onOpenCreateQuotation && (
                <button
                  type="button"
                  id={`detail-quote-btn-${lead.code}`}
                  onClick={() => onOpenCreateQuotation(lead)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Tạo và nộp báo giá cho đơn hàng này"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Báo Giá Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Nút Lưu Lead */}
              {onToggleSaveLead && (
                <button
                  type="button"
                  id={`detail-save-btn-${lead.code}`}
                  onClick={(e) => onToggleSaveLead(lead, e)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    lead.isSaved
                      ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                  title={
                    lead.isSaved
                      ? 'Đã lưu trong My Leads (Click để bỏ lưu)'
                      : 'Lưu tuyến tiềm năng vào My Leads'
                  }
                >
                  {lead.isSaved ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                      <span>Đã Lưu</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lưu Lead</span>
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          KHỐI THÔNG TIN DOANH NGHIỆP KHÁCH HÀNG (CUSTOMER PROFILE)
          ────────────────────────────────────────────────────────── */}
      {!isCustomerView && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xs ${
            isUnlocked
              ? 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <Building2 className={`w-4 h-4 ${isUnlocked ? 'text-emerald-700' : 'text-indigo-600'}`} />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                THÔNG TIN DOANH NGHIỆP KHÁCH HÀNG (CUSTOMER PROFILE)
              </span>
            </div>
            <span
              className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
                isUnlocked
                  ? 'bg-emerald-600 text-white border-emerald-600 flex items-center gap-1'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isUnlocked ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ĐÃ MỞ KHÓA THÔNG TIN</span>
                </>
              ) : (
                'ĐANG KHÓA BẢO MẬT'
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Đơn vị yêu cầu */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                Đơn vị yêu cầu (Company):
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm block leading-snug">
                {isUnlocked ? lead.customerCompany : maskCompanyName(lead.customerCompany)}
              </span>
              {isUnlocked ? (
                <div className="mt-1 text-[10.5px] text-slate-600 font-mono font-medium">
                  MST: {taxIdValue}
                </div>
              ) : (
                <div className="mt-1 text-[10.5px] text-slate-400 font-mono">
                  MST: ••••••••••
                </div>
              )}
            </div>

            {/* Người phụ trách */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                Người phụ trách & Chức vụ:
              </span>
              <span className="font-black text-slate-900 text-xs sm:text-sm block">
                {isUnlocked ? lead.contactName : maskContactPerson(lead.contactName)}
              </span>
              <span className="text-[10.5px] text-slate-500 block mt-0.5">
                Chức vụ: <strong>{lead.contactRole}</strong>
              </span>
            </div>

            {/* Hotline / Zalo */}
            <div className={`p-3 rounded-xl border shadow-2xs ${isUnlocked ? 'bg-emerald-50/70 border-emerald-300' : 'bg-white border-slate-200/80'}`}>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                Hotline / Zalo liên hệ:
              </span>
              {isUnlocked ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 font-mono font-black text-emerald-950 text-xs sm:text-sm">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{phoneValue}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(phoneValue)}
                      className="text-slate-400 hover:text-emerald-700 p-0.5 cursor-pointer"
                      title="Copy số điện thoại"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <a
                      href={`https://zalo.me/${phoneValue.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat Zalo</span>
                    </a>
                    <a
                      href={`tel:${phoneValue.replace(/\s+/g, '')}`}
                      className="px-2 py-0.5 text-[10px] font-bold bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors shadow-2xs flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Gọi Điện</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-bold mt-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>0908 ••• ••• (Bảo mật)</span>
                </div>
              )}
            </div>

            {/* Email nhận hồ sơ */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                Email nhận hồ sơ:
              </span>
              {isUnlocked ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mt-1 truncate" title={emailValue}>
                  <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{emailValue}</span>
                </div>
              ) : (
                <span className="text-xs font-mono text-slate-400 mt-1 block">••••••@shipper.vn</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MỤC 1: LOẠI HÌNH DỊCH VỤ
          ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
            1
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            LOẠI HÌNH DỊCH VỤ
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-indigo-600 border border-indigo-100 shadow-2xs">
            <ServiceIconComponent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">
              LOẠI DỊCH VỤ ĐÃ CHỌN
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-900">
              {serviceInfo.name}
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MỤC 2: HÌNH THỨC BÁO GIÁ / LOẠI HÌNH HỢP ĐỒNG
          ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
            2
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            HÌNH THỨC BÁO GIÁ / LOẠI HÌNH HỢP ĐỒNG
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">
              HÌNH THỨC BÁO GIÁ
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
              {lead.pricingType === 'CONTRACT' ? 'Hợp đồng dài hạn (Contract / Tender)' : 'Báo giá theo chuyến lẻ / Lô hàng (Spot)'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">
              THỜI HẠN HỢP ĐỒNG KÝ KẾT
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-indigo-900 block">
              {lead.contractTerm || (lead.pricingType === 'CONTRACT' ? 'Hợp đồng 12 tháng' : 'Giao dịch theo lô')}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">
              SẢN LƯỢNG / TẦN SUẤT CAM KẾT
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-900 block">
              {lead.volumeDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MỤC 3: PHÂN NHÓM HÀNG HÓA & QUY CÁCH ĐÓNG GÓI
          ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
            3
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            PHÂN NHÓM HÀNG HÓA & QUY CÁCH ĐÓNG GÓI
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">NGÀNH HÀNG</span>
            <span className="text-xs font-black text-slate-900 truncate block" title={inq?.industry || lead.industry || 'Dệt may & Hàng tiêu dùng'}>
              {inq?.industry || lead.industry || 'Dệt may & Hàng tiêu dùng'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">PHÂN NHÓM HÀNG</span>
            <span className="text-xs font-black text-amber-900 truncate block">
              {lead.cargoClassification || inq?.cargoClassification || (lead.urgency === 'High Value' ? 'Hàng giá trị cao' : (lead.urgency === 'Urgent' ? 'Hàng hỏa tốc / gấp' : 'Hàng thông thường'))}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">TÊN HÀNG HÓA</span>
            <span className="text-xs font-black text-slate-900 truncate block" title={lead.cargoDetails}>
              {inq?.cargoType || lead.cargoDetails}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">QUY CÁCH ĐÓNG GÓI</span>
            <span className="text-xs font-black text-slate-900 truncate block">
              {lead.packaging || inq?.packaging || 'Pallet chuẩn / Thùng carton'}
            </span>
          </div>

          {/* Dành cho Hàng Không */}
          {sType === 'Air Freight' && air && (
            <>
              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-200/80">
                <span className="text-[10px] text-sky-800 font-bold uppercase block mb-0.5">SỐ LƯỢNG KIỆN</span>
                <span className="text-xs font-black text-sky-950 block">{air.packageCount || 1} Kiện</span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-200/80">
                <span className="text-[10px] text-sky-800 font-bold uppercase block mb-0.5">KHỐI LƯỢNG THỰC (GROSS)</span>
                <span className="text-xs font-black text-sky-950 block">{air.grossWeightKgs ? `${air.grossWeightKgs} kg` : lead.volumeDisplay}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/80">
                <span className="text-[10px] text-indigo-700 font-bold uppercase block mb-0.5">TRỌNG LƯỢNG TÍNH CƯỚC (CW)</span>
                <span className="text-xs font-black text-indigo-900 block">{air.chargeableWeightKgs ? `${air.chargeableWeightKgs} kg` : lead.volumeDisplay}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">XẾP CHỒNG (STACKABLE)</span>
                <span className={`text-xs font-black ${air.stackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {air.stackable ? '✓ Cho phép chồng' : '⚠️ Không được chồng'}
                </span>
              </div>
            </>
          )}

          {/* Dành cho Đường Biển LCL */}
          {sType === 'Sea Freight (LCL)' && ocean && (
            <>
              <div className="p-2.5 rounded-xl bg-cyan-50/60 border border-cyan-200/80">
                <span className="text-[10px] text-cyan-800 font-bold uppercase block mb-0.5">SỐ KIỆN LCL</span>
                <span className="text-xs font-black text-cyan-950 block">{ocean.lclPieces || 10} Kiện</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-50/60 border border-cyan-200/80">
                <span className="text-[10px] text-cyan-800 font-bold uppercase block mb-0.5">THỂ TÍCH (CBM)</span>
                <span className="text-xs font-black text-cyan-950 block">{ocean.lclCbm || 10} CBM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/80">
                <span className="text-[10px] text-indigo-700 font-bold uppercase block mb-0.5">REVENUE TON (RT)</span>
                <span className="text-xs font-black text-indigo-900 block">{ocean.lclRevenueTon || (ocean.lclCbm || 10)} RT</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">XẾP CHỒNG (STACKABLE)</span>
                <span className={`text-xs font-black ${ocean.lclStackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {ocean.lclStackable ? '✓ Cho phép chồng' : '⚠️ Không được chồng'}
                </span>
              </div>
            </>
          )}

          {/* Dành cho Đường Bộ Trucking LTL */}
          {sType === 'Trucking' && trucking?.loadType?.includes('LTL') && (
            <>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-0.5">SỐ LƯỢNG KIỆN</span>
                <span className="text-xs font-black text-emerald-950 block">{trucking.ltlPieces || 5} Kiện</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-0.5">THỂ TÍCH (CBM)</span>
                <span className="text-xs font-black text-emerald-950 block">{trucking.ltlCbm || 4.5} CBM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/80">
                <span className="text-[10px] text-indigo-700 font-bold uppercase block mb-0.5">TRỌNG LƯỢNG TÍNH CƯỚC</span>
                <span className="text-xs font-black text-indigo-900 block">{trucking.ltlChargeableWeightKg ? `${trucking.ltlChargeableWeightKg} kg` : lead.volumeDisplay}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">XẾP CHỒNG</span>
                <span className={`text-xs font-black ${trucking.ltlStackable ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {trucking.ltlStackable ? '✓ Cho phép chồng' : '⚠️ Không được chồng'}
                </span>
              </div>
            </>
          )}

          {/* Các dịch vụ khác */}
          {sType !== 'Air Freight' && sType !== 'Sea Freight (LCL)' && !(sType === 'Trucking' && trucking?.loadType?.includes('LTL')) && (
            <>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">SẢN LƯỢNG / TẢI TRỌNG</span>
                <span className="text-xs font-black text-slate-900 block">{lead.volumeDisplay}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">YÊU CẦU BẢO QUẢN</span>
                <span className="text-xs font-black text-slate-900 block">
                  {inq?.preservationRequirement || coldChain?.temperatureRange || 'Hàng khô tiêu chuẩn'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MỤC 4: THÔNG TIN CHI TIẾT YÊU CẦU ([SERVICE TYPE])
          ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
            4
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            THÔNG TIN CHI TIẾT YÊU CẦU ({sType.toUpperCase()})
          </span>
        </div>

        {/* 4.1. LỘ TRÌNH TUYẾN ĐƯỜNG & ĐIỂM GIAO NHẬN THEO THUẬT NGỮ NGÀNH */}
        <div className="space-y-2.5">
          <span className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">
            4.1. Lộ Trình Tuyến Vận Chuyển & Điểm Giao Nhận Chi Tiết:
          </span>

          {/* A. HÀNG KHÔNG (AIR FREIGHT) */}
          {sType === 'Air Freight' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80">
                <div className="flex items-center justify-between font-bold text-sky-900 mb-2 pb-1.5 border-b border-sky-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-sky-300" />
                    <span className="uppercase text-[11px] font-black">Sân Bay Đi / Cất Cánh (AOD)</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9.5px] font-black bg-sky-100 text-sky-800 rounded-full border border-sky-300 uppercase">
                    {air?.originServiceTerm || 'AIRPORT'}
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {air?.originAirport || lead.origin}
                </p>
                {air?.pickupAddress && (
                  <div className="mt-2 p-2 bg-white rounded-xl border border-sky-200">
                    <span className="text-[10px] text-sky-800 font-bold block">📍 Kho lấy hàng (Shipper Door):</span>
                    <span className="text-xs text-slate-800 block mt-0.5">{air.pickupAddress}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80">
                <div className="flex items-center justify-between font-bold text-indigo-900 mb-2 pb-1.5 border-b border-indigo-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-300" />
                    <span className="uppercase text-[11px] font-black">Sân Bay Đến / Hạ Cánh (AOA)</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9.5px] font-black bg-indigo-100 text-indigo-800 rounded-full border border-indigo-300 uppercase">
                    {air?.destinationServiceTerm || 'AIRPORT'}
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {air?.destinationAirport || lead.destination}
                </p>
                {air?.deliveryAddress && (
                  <div className="mt-2 p-2 bg-white rounded-xl border border-indigo-200">
                    <span className="text-[10px] text-indigo-800 font-bold block">📍 Kho giao hàng (Consignee Door):</span>
                    <span className="text-xs text-slate-800 block mt-0.5">{air.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (sType === 'Sea Freight (FCL)' || sType === 'Sea Freight (LCL)') ? (
            /* B. ĐƯỜNG BIỂN (OCEAN FCL & LCL) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-cyan-50/50 border border-cyan-200/80">
                <div className="flex items-center justify-between font-bold text-cyan-900 mb-2 pb-1.5 border-b border-cyan-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-cyan-300" />
                    <span className="uppercase text-[11px] font-black">{isLcl ? 'Kho CFS Xuất Phát (Origin CFS)' : 'Cảng Bốc Hàng (Port of Loading - POL)'}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9.5px] font-black bg-cyan-100 text-cyan-800 rounded-full border border-cyan-300 uppercase">
                    {ocean?.originServiceTerm || (isFcl ? 'CY' : 'CFS')}
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {ocean?.polPort || lead.origin}
                </p>
                {ocean?.pickupAddress && (
                  <div className="mt-2 p-2 bg-white rounded-xl border border-cyan-200">
                    <span className="text-[10px] text-cyan-800 font-bold block">📍 Kho đóng hàng (Shipper Door):</span>
                    <span className="text-xs text-slate-800 block mt-0.5">{ocean.pickupAddress}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80">
                <div className="flex items-center justify-between font-bold text-blue-900 mb-2 pb-1.5 border-b border-blue-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-300" />
                    <span className="uppercase text-[11px] font-black">{isLcl ? 'Kho CFS Đích (Destination CFS)' : 'Cảng Dỡ Hàng (Port of Discharge - POD)'}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9.5px] font-black bg-blue-100 text-blue-800 rounded-full border border-blue-300 uppercase">
                    {ocean?.destinationServiceTerm || (isFcl ? 'CY' : 'CFS')}
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {ocean?.podPort || lead.destination}
                </p>
                {ocean?.deliveryAddress && (
                  <div className="mt-2 p-2 bg-white rounded-xl border border-blue-200">
                    <span className="text-[10px] text-blue-800 font-bold block">📍 Kho giao nhận (Consignee Door):</span>
                    <span className="text-xs text-slate-800 block mt-0.5">{ocean.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
          ) : sType === 'Warehousing' ? (
            /* C. KHO BÃI (WAREHOUSING) */
            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/80 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-purple-300" />
                <span className="text-[10px] text-purple-800 font-black uppercase tracking-wide">KHU VỰC & ĐỊA BÀN KHO BÃI MỤC TIÊU:</span>
              </div>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm pl-4">
                {warehousing?.targetLocation || lead.origin}
              </p>
            </div>
          ) : sType === 'Customs Clearance' ? (
            /* D. THỦ TỤC HẢI QUAN - 1 banner duy nhất, không có destination */
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300" />
                  <span className="text-[10px] text-amber-900 font-black uppercase tracking-wide">Chi Cục Hải Quan Mở Tờ Khai (Customs Sub-Department)</span>
                </div>
                <span className="px-2 py-0.5 text-[9.5px] font-black bg-amber-100 text-amber-800 rounded-full border border-amber-300 uppercase">Địa Điểm Mở TK</span>
              </div>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm pl-4">
                {customs?.customsSubDepartment || lead.origin}
              </p>
            </div>
          ) : sType === 'Rail Freight' ? (
            /* E. ĐƯỜNG SẮT (GA - GA) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                <div className="flex items-center justify-between font-bold text-amber-900 mb-2 pb-1.5 border-b border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300" />
                    <span className="uppercase text-[11px] font-black">Ga Đi (Origin Railway Station)</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9.5px] font-black bg-amber-100 text-amber-800 rounded-full border border-amber-300">Ga Xuất Phát</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {rail?.originStation || lead.origin}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/80">
                <div className="flex items-center justify-between font-bold text-orange-900 mb-2 pb-1.5 border-b border-orange-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-300" />
                    <span className="uppercase text-[11px] font-black">Ga Đến (Destination Railway Station)</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9.5px] font-black bg-orange-100 text-orange-800 rounded-full border border-orange-300">Ga Đích</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {rail?.destinationStation || lead.destination}
                </p>
              </div>
            </div>
          ) : sType === 'Cross-border' ? (
            /* F. XUYÊN BIÊN GIỚI (3 CHẶNG: XUẤT PHÁT - CỬA KHẨU - ĐÍCH) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-1">📍 Tỉnh / Thành Xuất Phát:</span>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {crossBorder?.originCity || lead.origin}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                <span className="text-[10px] text-amber-800 font-bold uppercase block mb-1">🚧 Cửa Khẩu Thông Quan:</span>
                <p className="font-extrabold text-amber-950 text-xs sm:text-sm">
                  {crossBorder?.borderGate || 'Cửa khẩu thông quan'}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/80">
                <span className="text-[10px] text-rose-800 font-bold uppercase block mb-1">🏁 Quốc Gia / Tỉnh Đích:</span>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {crossBorder?.destinationCity || lead.destination}
                </p>
              </div>
            </div>
          ) : sType === 'Project Cargo' ? (
            /* G. HÀNG DỰ ÁN (PROJECT CARGO) */
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-xs">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-indigo-200/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-300" />
                  <span className="text-[10px] text-indigo-900 font-black uppercase tracking-wide">Phạm Vi Mạng Lưới & Địa Bàn Dự Án:</span>
                </div>
                <span className="px-2 py-0.5 text-[9.5px] font-black bg-indigo-100 text-indigo-800 rounded-full border border-indigo-300 uppercase">
                  {project?.projectCategory || 'DISTRIBUTION'}
                </span>
              </div>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm pl-4">
                {project?.coverageScope || project?.projectName || lead.origin}
              </p>
            </div>
          ) : (
            /* H. ĐƯỜNG BỘ, CHUỖI LẠNH & CÁC DỊCH VỤ KHÁC */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                <div className="flex items-center justify-between font-bold text-emerald-900 mb-2 pb-1.5 border-b border-emerald-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300" />
                    <span className="uppercase text-[11px] font-black">Điểm Lấy Hàng / Nơi Đi (Origin)</span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[9.5px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                    {pickupList.length} Điểm Lấy
                  </span>
                </div>
                <div className="space-y-1.5">
                  {pickupList.map((loc, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-xl border border-emerald-200/80 font-extrabold text-slate-900 text-xs flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black shrink-0">{idx + 1}</span>
                      <span className="truncate">{loc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200/80">
                <div className="flex items-center justify-between font-bold text-rose-900 mb-2 pb-1.5 border-b border-rose-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-300" />
                    <span className="uppercase text-[11px] font-black">Điểm Giao Hàng / Nơi Đến (Destination)</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9.5px] font-black bg-rose-100 text-rose-800 rounded-full border border-rose-300">
                    {deliveryList.length} Điểm Giao
                  </span>
                </div>
                <div className="space-y-1.5">
                  {deliveryList.map((loc, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-xl border border-rose-200/80 font-extrabold text-slate-900 text-xs flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-rose-600 text-white text-[10px] flex items-center justify-center font-black shrink-0">{idx + 1}</span>
                      <span className="truncate">{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4.2. CẤU HÌNH KỸ THUẬT & VẬN HÀNH PHƯƠNG TIỆN */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-2.5">
          <span className="text-[10.5px] font-black text-indigo-950 uppercase tracking-wider block">
            4.2. Cấu Hình Phương Tiện & Kỹ Thuật Vận Tải Chi Tiết:
          </span>

          {/* TRUCKING */}
          {sType === 'Trucking' && trucking && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Hình thức vận tải</span>
                <span className="font-extrabold text-slate-900">{trucking.loadType || 'FTL (Nguyên chuyến)'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Loại xe / Quy cách thùng</span>
                <span className="font-extrabold text-slate-900">{trucking.truckType || 'Xe tải thùng kín'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Phân khúc tải trọng</span>
                <span className="font-extrabold text-slate-900">{trucking.tonnageCategory || '8 - 15 Tấn'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Số lượng chuyến</span>
                <span className="font-extrabold text-slate-900">{trucking.vehicleCount || trucking.ltlShipmentCount || 1} chuyến</span>
              </div>
              {trucking.internalDimensions && (
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Lọt lòng thùng</span>
                  <span className="font-extrabold text-slate-900">{trucking.internalDimensions}</span>
                </div>
              )}
            </div>
          )}

          {/* OCEAN */}
          {(sType === 'Sea Freight (FCL)' || sType === 'Sea Freight (LCL)') && ocean && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                <span className="font-extrabold text-blue-700">{ocean.tradeRole || inq?.tradeRole || 'Xuất khẩu (Export)'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Hình thức đường biển</span>
                <span className="font-extrabold text-slate-900">{isLcl ? 'LCL (Gom hàng lẻ CFS)' : 'FCL (Nguyên container)'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Điều kiện nhận & giao</span>
                <span className="font-extrabold text-cyan-950">
                  {ocean.originServiceTerm || (isFcl ? 'CY' : 'CFS')} ➔ {ocean.destinationServiceTerm || (isFcl ? 'CY' : 'CFS')}
                </span>
              </div>
              {isFcl && ocean.containerType && (
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Loại Container</span>
                  <span className="font-extrabold text-slate-900">{ocean.containerType}</span>
                </div>
              )}
              {ocean.incoterm && (
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Điều kiện Incoterms</span>
                  <span className="font-extrabold text-indigo-700">{ocean.incoterm}</span>
                </div>
              )}
              {isFcl && ocean.freeDemDetDaysRequested && (
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Miễn phí Dem/Det</span>
                  <span className="font-extrabold text-slate-900">{ocean.freeDemDetDaysRequested} Ngày</span>
                </div>
              )}
            </div>
          )}

          {/* AIR */}
          {sType === 'Air Freight' && air && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Phân loại hàng không</span>
                <span className="font-extrabold text-sky-950">{isAirExpress ? '⚡ Express / Courier' : '✈️ Air Cargo Direct'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                <span className="font-extrabold text-blue-700">{air.tradeRole || inq?.tradeRole || 'Xuất khẩu (Export)'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Điều kiện nhận & giao</span>
                <span className="font-extrabold text-sky-900">{air.originServiceTerm || 'Airport'} ➔ {air.destinationServiceTerm || 'Airport'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Số chuyến & Tần suất</span>
                <span className="font-extrabold text-indigo-700">{air.shipmentCount || 1} {air.frequencyUnit || 'Chuyến / Tuần'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Thông quan sân bay</span>
                <span className="font-extrabold text-emerald-700">{air.customsAtAirport ? '✓ Bao gồm thủ tục' : 'Tự thông quan'}</span>
              </div>
            </div>
          )}

          {/* COLD CHAIN */}
          {sType === 'Cold Chain' && coldChain && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Dải nhiệt độ</span>
                <span className="font-extrabold text-amber-900">{coldChain.temperatureCategory || coldChain.temperatureRange || '+2°C đến +8°C'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Loại phương tiện / Dung sai</span>
                <span className="font-extrabold text-slate-900">{coldChain.vehicleOrContType || coldChain.temperatureTolerance || 'Xe tải lạnh chuyên dụng'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Pre-cooling</span>
                <span className="font-extrabold text-emerald-700">{coldChain.preCoolingRequested || coldChain.preCoolingRequired ? '✓ Bắt buộc' : 'Tiêu chuẩn'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">IoT Datalogger</span>
                <span className="font-extrabold text-indigo-700">{coldChain.realtimeGpsTempLogging || coldChain.iotLoggerRequired ? '✓ Cảm biến Real-time' : 'Data Logger USB'}</span>
              </div>
            </div>
          )}

          {/* WAREHOUSING */}
          {sType === 'Warehousing' && warehousing && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Tiêu chuẩn kho</span>
                <span className="font-extrabold text-slate-900">{warehousing.warehouseType || 'Kho Grade A'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Diện tích thuê / Vị trí kệ</span>
                <span className="font-extrabold text-purple-900">
                  {warehousing.storageAreaSqm || warehousing.storageAreaM2 ? `${warehousing.storageAreaSqm || warehousing.storageAreaM2} m²` : ''} 
                  {warehousing.palletPositions ? ` (${warehousing.palletPositions} Pallets)` : ''}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Tích hợp WMS API</span>
                <span className="font-extrabold text-emerald-700">{warehousing.wmsIntegrationNeeded || warehousing.wmsIntegrationRequired ? '✓ API ERP SAP/WMS' : 'Báo cáo Excel định kỳ'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">PCCC Sprinkler</span>
                <span className="font-extrabold text-slate-900">{warehousing.fireSafetyStandard || 'Tự động NFPA'}</span>
              </div>
            </div>
          )}

          {/* CUSTOMS CLEARANCE */}
          {sType === 'Customs Clearance' && customs && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                <span className="font-extrabold text-blue-700">{customs.tradeRole || inq?.tradeRole || 'Nhập khẩu (Import)'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Loại hình tờ khai HQ</span>
                <span className="font-extrabold text-slate-900 truncate block">{customs.declarationType || 'A11 - Nhập kinh doanh'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Chứng nhận C/O</span>
                <span className="font-extrabold text-indigo-700">{customs.coFormRequested || 'Không yêu cầu'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Kiểm tra chuyên ngành</span>
                <span className="font-extrabold text-blue-800">{customs.specializedInspectionType || 'Không yêu cầu'}</span>
              </div>
              {customs.redChannelInspectionSupport && (
                <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200 shadow-2xs col-span-2 flex items-center gap-1.5">
                  <span className="text-rose-700 font-bold text-xs">🔴 Yêu cầu hỗ trợ kiểm hóa thực tế Luồng Đỏ tại cảng</span>
                </div>
              )}
            </div>
          )}

          {/* RAIL FREIGHT */}
          {sType === 'Rail Freight' && rail && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Loại toa / Container</span>
                <span className="font-extrabold text-amber-900">{rail.wagonType || 'Toa kín có khóa'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Dịch vụ kéo cont 2 đầu</span>
                <span className="font-extrabold text-emerald-700">{rail.drayageServiceRequired ? '✓ Trọn gói Door-to-Door' : 'Ga - Ga'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Số chuyến & Tần suất</span>
                <span className="font-extrabold text-indigo-900">{rail.tripCount || 1} {rail.frequencyUnit || 'Chuyến / Tuần'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Điều kiện Incoterms</span>
                <span className="font-extrabold text-slate-900">{rail.incoterms || 'FCA Ga đi'}</span>
              </div>
            </div>
          )}

          {/* CROSS-BORDER */}
          {sType === 'Cross-border' && crossBorder && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Vai trò doanh nghiệp</span>
                <span className="font-extrabold text-blue-700">{crossBorder.tradeRole || inq?.tradeRole || 'Xuất khẩu (Export)'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Phương thức vận tải</span>
                <span className="font-extrabold text-orange-950">{crossBorder.transitMode || 'Xe đi thẳng GMS'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Loại xe & Tải trọng</span>
                <span className="font-extrabold text-slate-900">{crossBorder.vehicleType || 'Đầu kéo cont'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Giấy phép liên vận</span>
                <span className="font-extrabold text-emerald-700">{crossBorder.bilateralPermitRequired ? '✓ Giấy phép GMS' : 'Tiêu chuẩn'}</span>
              </div>
            </div>
          )}

          {/* PROJECT CARGO */}
          {sType === 'Project Cargo' && project && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Phân loại mô hình</span>
                <span className="font-extrabold text-indigo-900">{project.projectCategory || 'DISTRIBUTION'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Tên dự án</span>
                <span className="font-extrabold text-slate-900 truncate block">{project.projectName || 'Gói thầu logistics'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Phạm vi phủ</span>
                <span className="font-extrabold text-slate-900 truncate block">{project.coverageScope || 'Toàn quốc'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">KPI cốt lõi</span>
                <span className="font-extrabold text-emerald-700">{project.keyKPIRequirements?.[0] || 'OTD > 98%'}</span>
              </div>
            </div>
          )}

          {/* Tùy chọn xe tải hỗ trợ nếu có */}
          {trucking && (trucking.loadingLaborRequired || trucking.unloadingLaborRequired || trucking.tailLiftRequired || trucking.craneAssistanceRequired || trucking.prohibitedHoursPassNeeded) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {trucking.loadingLaborRequired && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold shadow-2xs">
                  ✓ Cần nhân công bốc xếp đầu lấy
                </span>
              )}
              {trucking.unloadingLaborRequired && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold shadow-2xs">
                  ✓ Cần nhân công bốc xếp đầu giao
                </span>
              )}
              {trucking.tailLiftRequired && (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-bold shadow-2xs">
                  ✓ Yêu cầu xe bửng nâng thủy lực
                </span>
              )}
              {trucking.craneAssistanceRequired && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold shadow-2xs">
                  ✓ Cần hỗ trợ xe cẩu tự hành
                </span>
              )}
              {trucking.prohibitedHoursPassNeeded && (
                <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-bold shadow-2xs">
                  ✓ Cần giấy phép giờ cấm phố
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MỤC 5: YÊU CẦU PHỤ PHÍ & ĐIỀU KHOẢN BÁO GIÁ (SURCHARGES & TERMS)
          ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
            5
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            YÊU CẦU PHỤ PHÍ & ĐIỀU KHOẢN BÁO GIÁ (SURCHARGES & TERMS)
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">HÌNH THỨC CHÀO GIÁ YÊU CẦU</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">{quotationScope}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase block">
              Danh sách phụ phí yêu cầu bao gồm / làm rõ trong báo giá ({requestedSurcharges.length} phụ phí):
            </span>
            <div className="flex flex-wrap gap-2">
              {requestedSurcharges.map((sur, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 text-xs font-bold bg-white text-slate-800 border border-slate-200 rounded-xl shadow-2xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{sur}</span>
                </span>
              ))}
            </div>

            {surchargesNotes && (
              <div className="mt-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                <span className="text-[10.5px] font-bold text-amber-800 block mb-0.5">Ghi chú phụ phí từ chủ hàng:</span>
                <p className="text-slate-700 italic">"{surchargesNotes}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MỤC 6: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) KHÁCH HÀNG CHỌN
          ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
            6
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) KHÁCH HÀNG CHỌN
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase block">
            Các dịch vụ gia tăng đã khai báo cần báo giá:
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedVAS.map((vas, vIdx) => (
              <span
                key={vIdx}
                className="px-3 py-1.5 text-xs font-bold bg-white text-indigo-950 border border-indigo-200/80 rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{vas}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MỤC 7: ĐƠN GIÁ KỲ VỌNG & THỜI HẠN BÁO GIÁ
          ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
            7
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            ĐƠN GIÁ KỲ VỌNG & THỜI HẠN BÁO GIÁ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Đơn giá & Ngân sách dự toán */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/90">
            <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-1">
              {lead.pricingType === 'CONTRACT' ? 'ĐƠN GIÁ KỲ VỌNG / CHUYẾN' : 'ĐƠN GIÁ KỲ VỌNG (TARGET BUDGET)'}
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-950 font-mono block">
              {lead.unitPriceDisplay}
            </span>
            <span className="text-[10.5px] text-emerald-700 mt-1 block">
              {lead.pricingType === 'CONTRACT' ? 'Tổng ngân sách: ' : 'Tổng dự toán lô: '}
              <strong className="font-extrabold">{lead.estimatedValueDisplay}</strong>
            </span>
          </div>

          {/* Hạn nhận báo giá (Deadline) */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-amber-800 font-bold uppercase block mb-1">
                HẠN NHẬN BÁO GIÁ (DEADLINE)
              </span>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-950 font-mono">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{lead.dueDate || '7 ngày tới'}</span>
              </div>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold mt-1">
              Supplier cần nộp báo giá trước thời hạn
            </span>
          </div>

          {/* Thời gian thực hiện dự kiến */}
          <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/90 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-sky-800 font-bold uppercase block mb-1">
                THỜI GIAN THỰC HIỆN DỰ KIẾN
              </span>
              <div className="text-xs font-extrabold text-sky-950 space-y-0.5">
                <div>Ngày lấy hàng: <strong>{inq?.pickupDate || 'Theo thỏa thuận'}</strong></div>
                <div>Hạn giao hàng: <strong>{inq?.deliveryDate || lead.dueDate || 'Theo thỏa thuận'}</strong></div>
              </div>
            </div>
            <span className="text-[10px] text-sky-700 font-semibold mt-1">
              Lịch trình sẵn sàng vận hành
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MỤC 8: GHI CHÚ VẬN HÀNH & TÀI LIỆU ĐÍNH KÈM
          ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Operating Notes */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-900 tracking-wider pb-2 border-b border-amber-100">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Ghi Chú Vận Hành Chi Tiết Từ Khách Hàng</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/60 italic mt-2.5">
              "{customerOperatingNotes}"
            </p>
          </div>
        </div>

        {/* Right: Attached Documents */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-800 tracking-wider">
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Tài Liệu & Bảng Kê Đính Kèm ({attachments.length} Tệp tin)</span>
            </div>
            <span className="text-[10.5px] text-slate-400">Tải về xem chi tiết</span>
          </div>

          <div className="space-y-2 pt-0.5">
            {attachments.map((file, fIdx) => (
              <div
                key={fIdx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="p-2 rounded-lg bg-white text-indigo-600 border border-slate-200 shrink-0 shadow-2xs">
                    {file.type === 'excel' ? <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-rose-600" />}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 truncate block text-xs">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Dung lượng: {file.size} • {file.uploadedDate || 'Mới cập nhật'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadFile(file.name)}
                  className="px-3 py-1.5 text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 active:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải về</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Notification Toast inside detail */}
      {downloadToast && (
        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadToast}</span>
          </div>
          <span className="text-[10px] text-slate-400">Mô phỏng tải tệp tin đính kèm</span>
        </div>
      )}
    </div>
  );
};
