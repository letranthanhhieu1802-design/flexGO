import React from 'react';
import { FileCheck, Zap, Calendar, TrendingUp, Sparkles, Check } from 'lucide-react';
import { PricingType } from '../../../types';

interface PricingTypeSectionProps {
  pricingType: PricingType;
  onChangePricingType: (val: PricingType) => void;
  contractTerm?: string;
  onChangeContractTerm: (val: string) => void;
  committedFrequency?: string;
  onChangeCommittedFrequency?: (val: string) => void;
  serviceLabel?: string;
  themeColor?: 'blue' | 'cyan' | 'teal' | 'sky' | 'emerald' | 'purple' | 'amber' | 'orange' | 'indigo';
}

export const PricingTypeSection: React.FC<PricingTypeSectionProps> = ({
  pricingType,
  onChangePricingType,
  contractTerm = 'Hợp đồng 12 tháng',
  onChangeContractTerm,
  serviceLabel = 'dịch vụ',
  themeColor = 'indigo',
}) => {
  const isContract = pricingType === 'CONTRACT';

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
    <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>Loại Hình Hợp Đồng / Hình Thức Báo Giá *</span>
            <span className="px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 font-bold rounded-full normal-case">
              {pricingType === 'SPOT' ? 'Theo Lô / Chuyến Lẻ' : 'Hợp Đồng Định Kỳ'}
            </span>
          </label>
        </div>
      </div>

      {/* 2 Main Card Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Option 1: SPOT */}
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
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900">
                Theo Lô / Chuyến Lẻ (Spot Rate)
              </span>
              {!isContract && (
                <span className="p-0.5 rounded-full bg-emerald-500 text-white text-[10px]">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Nhu cầu phát sinh theo từng đợt đơn lẻ, ngày lấy hàng cố định. Nhà xe báo giá chốt ngay theo thời điểm.
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                ⚡ Báo giá tức thì
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                📦 Không ràng buộc sản lượng
              </span>
            </div>
          </div>
        </div>

        {/* Option 2: CONTRACT */}
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
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900">
                Hợp Đồng Định Kỳ / Dài Hạn (Contract / Tender)
              </span>
              {isContract && (
                <span className="p-0.5 rounded-full bg-emerald-500 text-white text-[10px]">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Ký hợp đồng khung/thầu theo tháng/năm, cam kết sản lượng đều đặn. Nhận đơn giá ưu đãi và giữ giá cố định.
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                🔒 Đơn giá ưu đãi cố định
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                🤝 Ưu tiên bố trí phương tiện
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Specific Detail Inputs */}
      {isContract && (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Thông Số Thời Hạn Hợp Đồng ({serviceLabel})</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Thời Hạn Hợp Đồng Ký Kết (Contract Term) *
            </label>
            <select
              value={contractTerm}
              onChange={(e) => onChangeContractTerm(e.target.value)}
              className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white ${colorStyles.focusRing} font-bold text-slate-900`}
            >
              <option value="Hợp đồng 3 tháng (Ngắn hạn / Thử nghiệm)">
                📅 Hợp đồng 3 tháng (Ngắn hạn / Thử nghiệm)
              </option>
              <option value="Hợp đồng 6 tháng (Nửa năm)">
                📅 Hợp đồng 6 tháng (Nửa năm định kỳ)
              </option>
              <option value="Hợp đồng 12 tháng (1 năm chuẩn)">
                📅 Hợp đồng 12 tháng (1 năm tiêu chuẩn doanh nghiệp)
              </option>
              <option value="Hợp đồng 24 tháng (2 năm dài hạn)">
                📅 Hợp đồng 24 tháng (2 năm đối tác chiến lược)
              </option>
              <option value="Hợp đồng 36 tháng (3 năm tổng thể)">
                📅 Hợp đồng 36 tháng (3 năm tổng thể chuỗi cung ứng)
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
