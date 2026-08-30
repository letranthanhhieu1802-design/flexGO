import React from 'react';
import { FileCheck, Zap, Calendar, TrendingUp, Sparkles, Check, Building2, Layers } from 'lucide-react';
import { PricingType, ServiceType } from '../../../types';

interface PricingTypeSectionProps {
  pricingType: PricingType;
  onChangePricingType: (val: PricingType) => void;
  contractTerm?: string;
  onChangeContractTerm: (val: string) => void;
  committedVolume?: number;
  onChangeCommittedVolume?: (val: number | undefined) => void;
  committedFrequency?: string;
  onChangeCommittedFrequency?: (val: string) => void;
  serviceType?: ServiceType;
  serviceLabel?: string;
  themeColor?: 'blue' | 'cyan' | 'teal' | 'sky' | 'emerald' | 'purple' | 'amber' | 'orange' | 'indigo';
}

export const PricingTypeSection: React.FC<PricingTypeSectionProps> = ({
  pricingType,
  onChangePricingType,
  contractTerm,
  onChangeContractTerm,
  committedVolume,
  onChangeCommittedVolume,
  committedFrequency,
  onChangeCommittedFrequency,
  serviceType,
  serviceLabel = 'dịch vụ',
  themeColor = 'indigo',
}) => {
  const isWarehousing = serviceType === 'Warehousing';
  const isCustoms = serviceType === 'Customs Clearance';
  const isProject = serviceType === 'Project Cargo';
  const isContract = isProject ? true : pricingType === 'CONTRACT';

  // Ensure default contract term is appropriate for the selected mode
  React.useEffect(() => {
    if (isProject && pricingType !== 'CONTRACT') {
      onChangePricingType('CONTRACT');
    }
    if (isWarehousing) {
      if (!isContract && (!contractTerm || contractTerm.includes('năm') || contractTerm.includes('12 tháng') || contractTerm.includes('24 tháng'))) {
        onChangeContractTerm('3 Tháng (Quý cao điểm / Vụ mùa)');
      } else if (isContract && (!contractTerm || contractTerm.includes('Lưu đệm') || contractTerm.includes('Vụ mùa') || contractTerm.includes('3 Tháng') || contractTerm.includes('1 Tháng'))) {
        onChangeContractTerm('Hợp đồng 12 tháng (1 năm tiêu chuẩn)');
      }
    }
  }, [isProject, isWarehousing, isContract, pricingType, contractTerm, onChangeContractTerm, onChangePricingType]);

  const colorStyles = {
    blue: {
      activeBorder: 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20',
      badgeActive: 'bg-blue-600 text-white',
      tagBg: 'bg-blue-100/80 text-blue-800 border-blue-200',
      accentText: 'text-blue-700',
      focusRing: 'focus:border-blue-500',
    },
    cyan: {
      activeBorder: 'border-cyan-600 bg-cyan-50/70 text-cyan-950 ring-2 ring-cyan-500/20',
      badgeActive: 'bg-cyan-600 text-white',
      tagBg: 'bg-cyan-100/80 text-cyan-800 border-cyan-200',
      accentText: 'text-cyan-700',
      focusRing: 'focus:border-cyan-500',
    },
    teal: {
      activeBorder: 'border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-500/20',
      badgeActive: 'bg-teal-600 text-white',
      tagBg: 'bg-teal-100/80 text-teal-800 border-teal-200',
      accentText: 'text-teal-700',
      focusRing: 'focus:border-teal-500',
    },
    sky: {
      activeBorder: 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-500/20',
      badgeActive: 'bg-sky-600 text-white',
      tagBg: 'bg-sky-100/80 text-sky-800 border-sky-200',
      accentText: 'text-sky-700',
      focusRing: 'focus:border-sky-500',
    },
    emerald: {
      activeBorder: 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20',
      badgeActive: 'bg-emerald-600 text-white',
      tagBg: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
      accentText: 'text-emerald-700',
      focusRing: 'focus:border-emerald-500',
    },
    purple: {
      activeBorder: 'border-purple-600 bg-purple-50/70 text-purple-950 ring-2 ring-purple-500/20',
      badgeActive: 'bg-purple-600 text-white',
      tagBg: 'bg-purple-100/80 text-purple-800 border-purple-200',
      accentText: 'text-purple-700',
      focusRing: 'focus:border-purple-500',
    },
    amber: {
      activeBorder: 'border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20',
      badgeActive: 'bg-amber-600 text-white',
      tagBg: 'bg-amber-100/80 text-amber-800 border-amber-200',
      accentText: 'text-amber-700',
      focusRing: 'focus:border-amber-500',
    },
    orange: {
      activeBorder: 'border-orange-600 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20',
      badgeActive: 'bg-orange-600 text-white',
      tagBg: 'bg-orange-100/80 text-orange-800 border-orange-200',
      accentText: 'text-orange-700',
      focusRing: 'focus:border-orange-500',
    },
    indigo: {
      activeBorder: 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20',
      badgeActive: 'bg-indigo-600 text-white',
      tagBg: 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
      accentText: 'text-indigo-700',
      focusRing: 'focus:border-indigo-500',
    },
  }[themeColor];

  return (
    <div className="space-y-3">
      {/* If Project Cargo: Single Dedicated Contract Card */}
      {isProject ? (
        <div className={`p-4 rounded-2xl border ${colorStyles.activeBorder} shadow-xs flex items-start gap-3.5 relative`}>
          <div className={`p-2.5 rounded-xl shrink-0 ${colorStyles.badgeActive}`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Hợp Đồng Dự Án & Đấu Thầu Logistics (Project Contract / Tender)
              </span>
              <span className="p-0.5 rounded-full bg-emerald-500 text-white text-[10px]">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Dành riêng cho các gói thầu Phân phối mạng lưới (Distribution), Trạm trung chuyển (Cross-Dock) và Vận tải Đa phương thức (Multimodal). Báo giá cấu trúc thầu và giữ đơn giá ưu đãi cố định theo cam kết hợp đồng.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                🔒 Đơn giá thầu trọn gói cố định
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                🤝 Cam kết SLA & KPI vận hành (&gt; 98%)
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                💻 Tích hợp hệ sinh thái WMS/TMS
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* 2 Options Grid for other services */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: SPOT / THEO LÔ */}
          <div
            onClick={() => onChangePricingType('SPOT')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
              !isContract
                ? `${colorStyles.activeBorder} shadow-xs`
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                !isContract ? colorStyles.badgeActive : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isWarehousing ? <Layers className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900">
                  {isWarehousing
                    ? 'Kho Tràn / Mùa Vụ (Overflow / Seasonal)'
                    : isCustoms
                    ? 'Theo Lô / Tờ Khai Đơn Lẻ (Spot Rate)'
                    : 'Theo Lô / Chuyến Lẻ (Spot Rate)'}
                </span>
                {!isContract && (
                  <span className="p-0.5 rounded-full bg-emerald-500 text-white text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {isWarehousing
                  ? 'Đã có kho chính nhưng chuẩn bị đến mùa cao điểm sản xuất / nhập khẩu dồn dập, cần thuê kho đệm ngắn hạn (1-6 tháng) giải tỏa quá tải.'
                  : isCustoms
                  ? 'Nhu cầu mở tờ khai phát sinh theo từng lô hàng đơn lẻ. Đại lý hải quan báo giá dịch vụ thông quan trọn gói ngay theo thời điểm.'
                  : 'Nhu cầu phát sinh theo từng đợt đơn lẻ, ngày lấy hàng cố định. Nhà xe báo giá chốt ngay theo thời điểm.'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {isWarehousing ? (
                  <>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                      ⚡ Linh hoạt 1 - 6 tháng
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      📦 Theo lượng hàng thực tế
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      🚀 Không ràng buộc dài hạn
                    </span>
                  </>
                ) : isCustoms ? (
                  <>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      ⚡ Báo giá tức thì
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      📑 Không cam kết sản lượng
                    </span>
                  </>
                ) : (
                  <>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      ⚡ Báo giá tức thì
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      📦 Không ràng buộc sản lượng
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Option 2: CONTRACT / KHO DÀI HẠN */}
          <div
            onClick={() => onChangePricingType('CONTRACT')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
              isContract
                ? `${colorStyles.activeBorder} shadow-xs`
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isContract ? colorStyles.badgeActive : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isWarehousing ? <Building2 className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900">
                  {isWarehousing
                    ? 'Kho Dài Hạn (Long-Term / Dedicated Hub)'
                    : isCustoms
                    ? 'Hợp Đồng Khung Định Kỳ (Customs Contract / Tender)'
                    : 'Hợp Đồng Định Kỳ / Dài Hạn (Contract / Tender)'}
                </span>
                {isContract && (
                  <span className="p-0.5 rounded-full bg-emerald-500 text-white text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {isWarehousing
                  ? 'Thuê làm trung tâm phân phối chính (DC) hoặc kho tổng chiến lược tính bằng năm. Đơn giá ưu đãi cố định và hỗ trợ tích hợp WMS chuyên sâu.'
                  : isCustoms
                  ? 'Ký hợp đồng dịch vụ hải quan trọn gói theo tháng/năm, cam kết sản lượng tờ khai đều đặn. Nhận bảng đơn giá thầu ưu đãi và giữ giá cố định.'
                  : 'Ký hợp đồng khung/thầu theo tháng/năm, cam kết sản lượng đều đặn. Nhận đơn giá ưu đãi và giữ giá cố định.'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {isWarehousing ? (
                  <>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      🔒 Đơn giá ưu đãi cố định
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                      📐 Cố định diện tích & Racking
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                      💻 Tích hợp WMS/ERP
                    </span>
                  </>
                ) : isCustoms ? (
                  <>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      🔒 Đơn giá tờ khai ưu đãi
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                      👨‍💼 Đội ngũ OPS chuyên trách tại cảng
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                      ⚡ Cam kết SLA thông quan
                    </span>
                  </>
                ) : (
                  <>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      🔒 Đơn giá ưu đãi cố định
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                      🤝 Ưu tiên bố trí phương tiện
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract & Term Specific Detail Inputs */}
      {(isContract || isWarehousing) && (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {isWarehousing
                ? (!isContract ? 'Thời Hạn Thuê Kho Tràn Mùa Vụ (Overflow Term)' : 'Thời Hạn Hợp Đồng Thuê Kho Dài Hạn (Contract Term)')
                : isProject
                ? 'Thông Số Thời Hạn Hợp Đồng Dự Án (Project Contract Term)'
                : `Thông Số Hợp Đồng Định Kỳ (${serviceLabel})`}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isWarehousing
                  ? (!isContract ? 'Chọn Thời Gian Thuê Kho Tràn Mùa Vụ *' : 'Chọn Thời Hạn Ký Kết Hợp Đồng Kho Dài Hạn *')
                  : isProject
                  ? 'Thời Hạn Hợp Đồng Dự Án (Project Term) *'
                  : '1. Thời Hạn Hợp Đồng Ký Kết (Contract Term) *'}
              </label>
              {isProject ? (
                <select
                  value={contractTerm || 'Hợp đồng 12 tháng (1 năm tiêu chuẩn đấu thầu)'}
                  onChange={(e) => onChangeContractTerm(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${colorStyles.focusRing} font-bold text-slate-900 cursor-pointer`}
                >
                  <option value="Hợp đồng 12 tháng (1 năm tiêu chuẩn đấu thầu)">
                    📅 Hợp đồng 12 tháng (1 năm tiêu chuẩn đấu thầu dự án)
                  </option>
                  <option value="Hợp đồng 24 tháng (2 năm đối tác chiến lược)">
                    📅 Hợp đồng 24 tháng (2 năm đối tác chiến lược)
                  </option>
                  <option value="Hợp đồng 36 tháng (3 năm chuỗi cung ứng dài hạn)">
                    📅 Hợp đồng 36 tháng (3 năm chuỗi cung ứng dài hạn)
                  </option>
                  <option value="Hợp đồng 6 tháng (Ngắn hạn / Giai đoạn thử nghiệm)">
                    📅 Hợp đồng 6 tháng (Ngắn hạn / Giai đoạn thử nghiệm)
                  </option>
                  <option value="Theo tiến độ dự án (Project Milestone Based)">
                    📅 Theo tiến độ dự án (Project Milestone Based)
                  </option>
                </select>
              ) : isWarehousing ? (
                !isContract ? (
                  // Kho tràn: 1 - 6 tháng
                  <select
                    value={contractTerm || '3 Tháng (Quý cao điểm / Vụ mùa)'}
                    onChange={(e) => onChangeContractTerm(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${colorStyles.focusRing} font-bold text-slate-900 cursor-pointer`}
                  >
                    <option value="1 Tháng (Lưu đệm đột xuất / Thời vụ ngắn)">
                      🗓️ 1 Tháng (Lưu đệm đột xuất / Thời vụ ngắn)
                    </option>
                    <option value="2 Tháng (Mùa cao điểm ngắn)">
                      🗓️ 2 Tháng (Mùa cao điểm ngắn)
                    </option>
                    <option value="3 Tháng (Quý cao điểm / Vụ mùa)">
                      🗓️ 3 Tháng (Quý cao điểm / Hàng vụ mùa)
                    </option>
                    <option value="6 Tháng (Bán niên vụ / Nửa năm)">
                      🗓️ 6 Tháng (Bán niên vụ / Nửa năm)
                    </option>
                  </select>
                ) : (
                  // Kho dài hạn: 1 - 5 năm
                  <select
                    value={contractTerm || 'Hợp đồng 12 tháng (1 năm tiêu chuẩn)'}
                    onChange={(e) => onChangeContractTerm(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${colorStyles.focusRing} font-bold text-slate-900 cursor-pointer`}
                  >
                    <option value="Hợp đồng 12 tháng (1 năm tiêu chuẩn)">
                      📅 Hợp đồng 12 tháng (1 năm tiêu chuẩn doanh nghiệp)
                    </option>
                    <option value="Hợp đồng 24 tháng (2 năm dài hạn)">
                      📅 Hợp đồng 24 tháng (2 năm đối tác chiến lược)
                    </option>
                    <option value="Hợp đồng 36 tháng (3 năm tổng thể)">
                      📅 Hợp đồng 36 tháng (3 năm tổng thể chuỗi cung ứng)
                    </option>
                    <option value="Hợp đồng 60 tháng (5 năm chiến lược)">
                      📅 Hợp đồng 60 tháng (5 năm hợp tác chiến lược lâu dài)
                    </option>
                  </select>
                )
              ) : (
                // Các dịch vụ khác
                <select
                  value={contractTerm || 'Hợp đồng 12 tháng (1 năm tiêu chuẩn)'}
                  onChange={(e) => onChangeContractTerm(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${colorStyles.focusRing} font-bold text-slate-900 cursor-pointer`}
                >
                  <option value="Hợp đồng 3 tháng (Ngắn hạn / Thử nghiệm)">
                    📅 Hợp đồng 3 tháng (Ngắn hạn / Thử nghiệm)
                  </option>
                  <option value="Hợp đồng 6 tháng (Nửa năm)">
                    📅 Hợp đồng 6 tháng (Nửa năm định kỳ)
                  </option>
                  <option value="Hợp đồng 12 tháng (1 năm tiêu chuẩn)">
                    📅 Hợp đồng 12 tháng (1 năm tiêu chuẩn doanh nghiệp)
                  </option>
                  <option value="Hợp đồng 24 tháng (2 năm dài hạn)">
                    📅 Hợp đồng 24 tháng (2 năm đối tác chiến lược)
                  </option>
                  <option value="Hợp đồng 36 tháng (3 năm tổng thể)">
                    📅 Hợp đồng 36 tháng (3 năm tổng thể chuỗi cung ứng)
                  </option>
                </select>
              )}
            </div>

            {/* Specialized Committed Volume & Frequency for Customs Clearance */}
            {isCustoms && isContract && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    2. Số Lượng Tờ Khai Ước Tính *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={committedVolume || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                      onChangeCommittedVolume?.(val);
                    }}
                    placeholder="VD: 50"
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${colorStyles.focusRing} font-bold text-slate-900`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    💡 Sản lượng dự kiến để nhận đơn giá thầu ưu đãi.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    3. Đơn Vị Tần Suất Khai Báo (Committed Frequency) *
                  </label>
                  <select
                    value={committedFrequency || 'Tờ khai / Tháng'}
                    onChange={(e) => onChangeCommittedFrequency?.(e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${colorStyles.focusRing} font-bold text-slate-900 cursor-pointer`}
                  >
                    <option value="Tờ khai / Tháng">📑 Tờ khai / Tháng (Phổ biến nhất)</option>
                    <option value="Tờ khai / Tuần">📑 Tờ khai / Tuần</option>
                    <option value="Tờ khai / Quý">📑 Tờ khai / Quý</option>
                    <option value="Tờ khai / Năm">📑 Tờ khai / Năm</option>
                    <option value="Container / Tháng">📦 Container (TEU) / Tháng</option>
                    <option value="Lô hàng / Tháng">🚢 Lô hàng / Tháng</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    💡 Chu kỳ tổng kết và đối soát sản lượng định kỳ.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
