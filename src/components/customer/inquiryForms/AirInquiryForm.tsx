import React, { useEffect } from 'react';
import { Plane, Zap, Scale, Box, AlertTriangle, ShieldCheck, ArrowLeftRight } from 'lucide-react';
import { AirInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const AIR_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'a-vas-1',
    name: 'Đóng gói tiêu chuẩn bay IATA & Dán nhãn hàng nguy hiểm DG',
    desc: 'Xử lý quy cách thùng carton 5-7 lớp, đóng đai siết và dán nhãn chuẩn hàng không IATA DGR.',
    tag: 'Đóng gói IATA',
    popular: true,
  },
  {
    id: 'a-vas-2',
    name: 'Đóng đá khô / Gel lạnh & Bọc màng giữ nhiệt (Thermal Packaging)',
    desc: 'Bảo quản nhiệt độ lạnh cho hàng vắc-xin, dược phẩm và thực phẩm tươi trong suốt chuyến bay.',
    tag: 'Đá khô & Gel lạnh',
    popular: true,
  },
  {
    id: 'a-vas-3',
    name: 'Soi chiếu an ninh X-Ray & Đóng mâm ULD ưu tiên tại kho sân bay',
    desc: 'Rút ngắn thời gian cut-off soi chiếu an ninh tại nhà ga hàng hóa TCS, NCTS, ALSC.',
    tag: 'Ưu tiên ULD',
  },
  {
    id: 'a-vas-4',
    name: 'Dịch vụ Door-to-Airport / Airport-to-Door cấp tốc 24/7',
    desc: 'Xe tải trung chuyển chuyên dụng đón hàng tận xưởng ra thẳng sân bay và giao tận nơi đích.',
    tag: 'Door-to-Airport',
    popular: true,
  },
  {
    id: 'a-vas-5',
    name: 'Khai báo hải quan hỏa tốc tại cửa khẩu sân bay quốc tế',
    desc: 'Thông quan khẩn cấp hàng mẫu, hàng linh kiện máy móc dừng chuyền AOG.',
    tag: 'Hải quan sân bay',
    popular: true,
  },
  {
    id: 'a-vas-6',
    name: 'Phát hành HAWB & Chuyển phát hỏa tốc bộ chứng từ gốc',
    desc: 'Cấp vận đơn hàng không House Airway Bill và gửi nhanh chứng từ bằng thư phát chuyển nhanh.',
    tag: 'HAWB & Chứng từ',
  },
  {
    id: 'a-vas-7',
    name: 'Bảo hiểm hàng không toàn diện rủi ro cao (Air All-Risks)',
    desc: 'Bảo hiểm 100% giá trị hàng công nghệ cao (High-Tech, Chip bán dẫn, Thiết bị y tế).',
    tag: 'Bảo hiểm 100%',
  },
  {
    id: 'a-vas-8',
    name: 'Dịch vụ On-Board Courier (OBC) / Hand-Carry áp tải trực tiếp',
    desc: 'Nhân viên bay kèm áp tải hành lý xách tay giao nhận tận tay trong 24 giờ.',
    tag: 'Hand-Carry VIP',
  },
];

interface AirInquiryFormProps {
  specs: AirInquirySpecs;
  onChange: (specs: AirInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
}

export const AirInquiryForm: React.FC<AirInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
}) => {
  const updateSpec = <K extends keyof AirInquirySpecs>(key: K, value: AirInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  // Auto-calculate Volumetric Weight & Chargeable Weight when dimensions / weight / packages change
  useEffect(() => {
    const match = specs.dimensionsCm?.match(/(\d+)\s*[xX*]\s*(\d+)\s*[xX*]\s*(\d+)/);
    if (match) {
      const l = parseFloat(match[1]);
      const w = parseFloat(match[2]);
      const h = parseFloat(match[3]);
      const count = specs.packageCount || 1;
      const volPerPkg = (l * w * h) / 6000;
      const totalVolWeight = Math.round(volPerPkg * count * 10) / 10;
      const gw = specs.grossWeightKgs || 0;
      const cw = Math.max(gw, totalVolWeight);

      if (totalVolWeight !== specs.volumetricWeightKgs || cw !== specs.chargeableWeightKgs) {
        onChange({
          ...specs,
          volumetricWeightKgs: totalVolWeight,
          chargeableWeightKgs: cw,
        });
      }
    }
  }, [specs.dimensionsCm, specs.packageCount, specs.grossWeightKgs]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Service Header Info */}
      <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0">
          <Plane className="w-5 h-5" />
        </div>
        <div className="text-xs text-sky-950 flex-1">
          <span className="font-bold block text-sm text-sky-900">
            Dịch Vụ Vận Tải Hàng Không (Air Express & Priority Air Cargo)
          </span>
          <p className="text-sky-800/80 mt-0.5">
            Cước hàng không tính trên Trọng Lượng Tính Cước (Chargeable Weight = Max giữa Gross Weight và Thể tích Quy đổi L×W×H/6000).
          </p>
        </div>
      </div>

      {/* Trade Role Selection: Xuất Khẩu vs Nhập Khẩu vs Nội Địa */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-sky-700" />
            <span>Vai Trò Của Doanh Nghiệp Trong Lô Hàng (Trade Role) *</span>
          </label>
          <span className="text-[10px] font-semibold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-md">
            {specs.tradeRole === 'Nhập khẩu (Import)'
              ? '🛬 Doanh nghiệp mua / nhập hàng về VN'
              : specs.tradeRole === 'Nội địa (Domestic)'
              ? '🇻🇳 Hàng không nội địa Bắc - Nam'
              : '🛫 Doanh nghiệp bán / xuất hàng ra nước ngoài'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            {
              role: 'Xuất khẩu (Export)',
              title: '🛫 Xuất Khẩu (Export)',
              sub: 'Hàng bay từ VN đi quốc tế',
            },
            {
              role: 'Nhập khẩu (Import)',
              title: '🛬 Nhập Khẩu (Import)',
              sub: 'Hàng bay từ quốc tế về VN',
            },
            {
              role: 'Nội địa (Domestic)',
              title: '🇻🇳 Nội Địa (Domestic)',
              sub: 'Hàng bay HAN ↔ SGN ↔ DAD',
            },
          ].map((item) => {
            const isSelected = (specs.tradeRole || 'Xuất khẩu (Export)') === item.role;
            return (
              <button
                type="button"
                key={item.role}
                onClick={() => updateSpec('tradeRole', item.role as any)}
                className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/25 font-bold text-sky-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.title}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-normal truncate">
                  {item.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Service Level Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Cấp Độ Dịch Vụ Hàng Không (Air Service Level) *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { level: 'Express Courier (1-2 days)', label: 'Chuyển Phát Nhanh', tag: '1-2 Ngày' },
            { level: 'Standard Air Freight (3-4 days)', label: 'Air Cargo Chuẩn', tag: '3-4 Ngày' },
            { level: 'Economy Air Cargo (5-7 days)', label: 'Air Tiết Kiệm', tag: '5-7 Ngày' },
            { level: 'Air Charter Priority', label: 'Bao Chuyến Bay', tag: 'Khẩn Cấp' },
          ].map((item) => {
            const isSelected = specs.serviceLevel === item.level;
            return (
              <button
                type="button"
                key={item.level}
                onClick={() => updateSpec('serviceLevel', item.level as any)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-500/20 text-sky-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate">{item.label}</span>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-100/70 px-1.5 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Airports (AOD & AOA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-sky-600" />
            <span>Sân Bay Đi (AOD - Airport of Departure) *</span>
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              updateSpec('originAirport', e.target.value);
            }}
            placeholder="VD: SGN (Sân bay Tân Sơn Nhất, TP.HCM) hoặc HAN (Nội Bài)"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-hidden font-medium text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sân Bay Đến (AOA - Airport of Arrival) *</span>
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              updateSpec('destinationAirport', e.target.value);
            }}
            placeholder="VD: NRT (Tokyo Narita) hoặc FRA (Frankfurt), LAX (Los Angeles)"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-hidden font-medium text-slate-800"
          />
        </div>
      </div>

      {/* Weight & Dimensions with Smart Chargeable Weight Auto-Calc */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Số Kiện Hàng (Pieces)
          </label>
          <input
            type="text"
            value={specs.packageCount ? specs.packageCount.toLocaleString('vi-VN') : ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              updateSpec('packageCount', val ? Number(val) : undefined);
            }}
            placeholder="VD: 10"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-bold text-slate-900 text-center"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kích Thước Kiện (D x R x C cm)
          </label>
          <input
            type="text"
            value={specs.dimensionsCm || ''}
            onChange={(e) => updateSpec('dimensionsCm', e.target.value)}
            placeholder="VD: 60x40x50"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-mono text-center"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Trọng Lượng Thực (Gross Kg)
          </label>
          <input
            type="text"
            value={specs.grossWeightKgs ? specs.grossWeightKgs.toLocaleString('vi-VN') : ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              updateSpec('grossWeightKgs', val ? Number(val) : undefined);
            }}
            placeholder="VD: 180"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-bold text-slate-900 text-center"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-sky-900 mb-1 flex items-center justify-between">
            <span>Tính Cước (CW)</span>
            <span className="text-[10px] text-sky-600 font-normal">Tự tính</span>
          </label>
          <div className="w-full px-3.5 py-2.5 text-xs bg-sky-50 border border-sky-200 rounded-xl font-black text-sky-900 text-center">
            {specs.chargeableWeightKgs ? `${specs.chargeableWeightKgs.toLocaleString('vi-VN')} Kg CW` : '-- Kg CW'}
          </div>
        </div>
      </div>
    </div>
  );
};
