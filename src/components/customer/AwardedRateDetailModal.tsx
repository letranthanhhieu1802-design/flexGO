import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Truck, 
  Ship, 
  Plane, 
  ThermometerSnowflake, 
  Warehouse, 
  Globe, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Layers, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  ExternalLink,
  Package,
  Phone,
  Mail,
  User,
  Check
} from 'lucide-react';
import { CustomerRateItem, InquiryItem, QuotationItem, CurrentView } from '../../types';

interface AwardedRateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rate: CustomerRateItem | null;
  inquiry?: InquiryItem | null;
  quotation?: QuotationItem | null;
  onOpenCreateInquiryWithBenchmark?: (benchmarkData: any) => void;
  onNavigate?: (view: CurrentView) => void;
}

export const AwardedRateDetailModal: React.FC<AwardedRateDetailModalProps> = ({
  isOpen,
  onClose,
  rate,
  inquiry,
  quotation,
  onOpenCreateInquiryWithBenchmark,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'inquiry_summary' | 'awarded_quote'>('inquiry_summary');

  if (!isOpen || !rate) return null;

  // Resolve service icon
  const getServiceIcon = () => {
    const s = (rate.serviceType || '').toLowerCase();
    if (s.includes('sea') || s.includes('biển')) return <Ship className="w-4 h-4 text-cyan-600" />;
    if (s.includes('air') || s.includes('hàng không')) return <Plane className="w-4 h-4 text-sky-600" />;
    if (s.includes('cold') || s.includes('lạnh')) return <ThermometerSnowflake className="w-4 h-4 text-blue-600" />;
    if (s.includes('ware') || s.includes('kho')) return <Warehouse className="w-4 h-4 text-amber-600" />;
    if (s.includes('customs') || s.includes('hải quan')) return <Globe className="w-4 h-4 text-emerald-600" />;
    return <Truck className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Trao thầu RFQ
                </span>
                {rate.linkedInquiryCode && (
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Mã RFQ: {rate.linkedInquiryCode}
                  </span>
                )}
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">
                  {rate.code}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5" title={rate.title}>
                {rate.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-TAB NAVIGATION BAR */}
        <div className="px-6 py-2.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              id="tab-btn-inquiry-summary"
              onClick={() => setActiveTab('inquiry_summary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'inquiry_summary'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tab 1: Tóm tắt yêu cầu (RFQ)</span>
            </button>

            <button
              type="button"
              id="tab-btn-awarded-quote"
              onClick={() => setActiveTab('awarded_quote')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'awarded_quote'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Tab 2: Giá của Supplier đã trúng thầu</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Hiệu lực đến:</span>
            <span className="font-mono font-bold text-slate-200">{rate.validTo}</span>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/70 flex-1 text-xs">
          {/* ========================================================================= */}
          {/* TAB 1: TÓM TẮT YÊU CẦU CỦA KHÁCH HÀNG (RFQ SUMMARY)                       */}
          {/* ========================================================================= */}
          {activeTab === 'inquiry_summary' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Nhóm 1: Thông tin phiên RFQ */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>1. Thông Tin Yêu Cầu Mở Thầu RFQ</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Đã Trao Thầu Hoàn Tất</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Mã yêu cầu (Lead):</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {rate.linkedInquiryCode || inquiry?.code || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Dịch vụ yêu cầu:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      {getServiceIcon()}
                      <span>{rate.serviceType}</span>
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hình thức hợp đồng:</span>
                    <span className="font-semibold text-slate-700">
                      {inquiry?.pricingType === 'CONTRACT' ? 'Hợp đồng định kỳ (Contract / Tender)' : 'Theo chuyến / Lô lẻ (Spot Quote)'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời hạn hợp đồng:</span>
                    <span className="font-semibold text-slate-800">
                      {inquiry?.contractTerm || '12 tháng (Hợp đồng năm)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nhóm 2: Tuyến đường & Địa điểm */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>2. Tuyến Đường & Địa Điểm Giao Nhận</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điểm lấy hàng (Origin):</span>
                    <span className="font-semibold text-slate-900">{rate.origin}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điểm giao hàng (Dest):</span>
                    <span className="font-semibold text-slate-900">{rate.destination}</span>
                  </div>
                  {rate.routeDisplay && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Lộ trình hiển thị:</span>
                      <span className="font-medium text-slate-700">{rate.routeDisplay}</span>
                    </div>
                  )}
                  {rate.transitTime && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời gian yêu cầu (SLA):</span>
                      <span className="font-bold text-indigo-700">{rate.transitTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Nhóm 3: Thông tin Hàng hóa & Cấu hình Kỹ thuật */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    <span>3. Thông Tin Hàng Hóa & Cấu Hình Yêu Cầu</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại hàng hóa:</span>
                    <span className="font-semibold text-slate-900">{rate.cargoType}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Quy cách tải / cont:</span>
                    <span className="font-semibold text-slate-800">{rate.loadType || 'FTL / FCL'}</span>
                  </div>
                  {rate.equipmentOrVehicleType && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Phương tiện yêu cầu:</span>
                      <span className="font-bold text-slate-900">{rate.equipmentOrVehicleType}</span>
                    </div>
                  )}
                  {rate.truckingSpecs?.palletQuantity && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Số lượng Pallet:</span>
                      <span className="font-bold text-indigo-600">{rate.truckingSpecs.palletQuantity} Pallets</span>
                    </div>
                  )}
                  {rate.oceanSpecs?.containerType && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Loại container:</span>
                      <span className="font-bold text-indigo-600">{rate.oceanSpecs.containerType}</span>
                    </div>
                  )}
                  {rate.airSpecs?.chargeableWeightKgs && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Trọng lượng tính cước:</span>
                      <span className="font-bold text-indigo-600">{rate.airSpecs.chargeableWeightKgs} Kgs</span>
                    </div>
                  )}
                  {rate.warehousingSpecs?.storageAreaSqm && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Diện tích thuê:</span>
                      <span className="font-bold text-indigo-600">{rate.warehousingSpecs.storageAreaSqm} m²</span>
                    </div>
                  )}
                </div>

                {/* Yêu cầu dịch vụ phụ trợ (VAS) */}
                {rate.truckingSpecs?.selectedVAS && rate.truckingSpecs.selectedVAS.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                      Dịch vụ giá trị gia tăng yêu cầu (VAS):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rate.truckingSpecs.selectedVAS.map((vas, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
                          ✓ {vas}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: GIÁ CỦA SUPPLIER ĐÃ TRÚNG THẦU (AWARDED QUOTATION)                  */}
          {/* ========================================================================= */}
          {activeTab === 'awarded_quote' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Card 1: Banner Nhà cung cấp trúng thầu & Đơn giá chốt */}
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-800/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Nhà Cung Cấp Trúng Thầu (Awarded Supplier)</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white">
                      {rate.supplierName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-indigo-200">
                      {rate.supplierTaxId && (
                        <span>MST: <strong>{rate.supplierTaxId}</strong></span>
                      )}
                      {rate.supplierContact && (
                        <span>Liên hệ: <strong>{rate.supplierContact}</strong></span>
                      )}
                      {rate.supplierPhone && (
                        <span>SĐT: <strong>{rate.supplierPhone}</strong></span>
                      )}
                    </div>

                    {rate.contractCode && (
                      <div className="text-[11px] text-indigo-300 font-mono">
                        Số HĐ / Phụ lục: <strong>{rate.contractCode}</strong>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-right shrink-0">
                    <div className="text-[10.5px] uppercase font-bold text-indigo-200 tracking-wider">
                      Đơn Giá Trúng Thầu (Awarded Rate)
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
                      {rate.rateDisplay}
                    </div>
                    <div className="text-[11px] text-indigo-200 mt-0.5 font-medium">
                      {rate.allInclusive ? 'Trọn gói All-in' : 'Bóc tách phụ phí'} • VAT {rate.vatPercent ?? 8}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Bóc tách Cước cơ sở & Danh mục Phụ phí chi tiết */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5">
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bóc Tách Cước Cơ Sở & Danh Mục Phụ Phí Đã Chốt</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    ĐVT: <strong>{rate.pricingUnit}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10.5px] block font-medium">Cước cơ sở (Base Freight):</span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                      {rate.baseRateAmount > 0 
                        ? `${rate.baseRateAmount.toLocaleString('vi-VN')} ${rate.baseRateCurrency}`
                        : rate.rateDisplay}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10.5px] block font-medium">Điều khoản cước:</span>
                    <span className="text-sm font-extrabold text-indigo-700 block mt-0.5">
                      {rate.allInclusive ? 'Đã trọn gói (All-inclusive)' : 'Bóc tách phụ phí'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10.5px] block font-medium">Thuế suất VAT:</span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                      {rate.vatPercent ?? 8}%
                    </span>
                  </div>
                </div>

                {/* Danh mục Phụ phí chi tiết */}
                {rate.surcharges && rate.surcharges.length > 0 ? (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                      Chi tiết các khoản phụ phí kèm theo:
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                            <th className="py-2.5 px-3">Tên Phụ Phí</th>
                            <th className="py-2.5 px-3 text-center">Tình Trạng</th>
                            <th className="py-2.5 px-3 text-center">ĐVT</th>
                            <th className="py-2.5 px-3 text-right">Mức Phí</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rate.surcharges.map((sc) => (
                            <tr key={sc.id} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 font-medium text-slate-800">
                                {sc.name}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                                  sc.includedInBaseRate 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {sc.includedInBaseRate ? 'Đã gồm trong cước' : 'Tính ngoài cước'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center text-slate-500">
                                {sc.unit}
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-slate-900">
                                {sc.amount > 0 ? `${sc.amount.toLocaleString('vi-VN')} ${sc.currency}` : 'Miễn phí'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-1">
                    Biểu giá trọn gói, không phát sinh phụ phí ngoài.
                  </div>
                )}
              </div>

              {/* Card 3: Điều khoản thanh toán & Cam kết SLA */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Điều Khoản Thương Mại & Cam Kết SLA Của Supplier</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Điều khoản thanh toán:</span>
                    <span className="font-bold text-slate-900">{rate.paymentTerms}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Thời gian vận chuyển:</span>
                    <span className="font-bold text-indigo-700">{rate.transitTime || 'Thỏa thuận'}</span>
                  </div>

                  {rate.freeDemDetDays && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Miễn phí Dem/Det:</span>
                      <span className="font-bold text-emerald-600">{rate.freeDemDetDays} ngày</span>
                    </div>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 font-medium min-w-[130px] shrink-0">Hiệu lực áp dụng:</span>
                    <span className="font-semibold text-slate-800">Từ {rate.validFrom} đến {rate.validTo}</span>
                  </div>
                </div>

                {rate.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10.5px] uppercase tracking-wider mb-1">
                      Ghi chú vận hành & Cam kết của Supplier:
                    </span>
                    <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-slate-700 italic">
                      "{rate.notes}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="text-slate-500 text-xs">
            Nguồn giá: <strong>Trao thầu RFQ</strong> ({rate.linkedInquiryCode || 'flexGO'})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenCreateInquiryWithBenchmark) {
                  onOpenCreateInquiryWithBenchmark(rate);
                }
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đăng RFQ Mới Từ Giá Này</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
