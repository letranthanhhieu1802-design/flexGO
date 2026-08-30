import React from 'react';
import { Globe, MapPin, Flag, ArrowLeftRight } from 'lucide-react';
import { CrossBorderInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const CROSS_BORDER_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'cb-vas-1',
    name: 'Xin giấy phép vận tải đường bộ quốc tế liên vận GMS / ASEAN Transit Permit',
    desc: 'Làm sổ theo dõi lộ trình và phù hiệu xe liên vận quốc tế cho xe chạy thẳng không sang tải.',
    tag: 'Giấy phép GMS',
    popular: true,
  },
  {
    id: 'cb-vas-2',
    name: 'Dịch vụ sang tải thùng container & Xe nâng tại bãi chuyển tiếp biên giới',
    desc: 'Bốc chuyển toàn bộ kiện hàng sang xe nước bạn hoặc hạ bãi chờ thủ tục.',
    tag: 'Sang tải biên giới',
    popular: true,
  },
  {
    id: 'cb-vas-3',
    name: 'Thủ tục hải quan xuất nhập cảnh trọn gói 2 đầu cửa khẩu (VN & Nước bạn)',
    desc: 'Đại lý đại diện làm thủ tục hải quan cửa khẩu Việt Nam và đối ứng Campuchia/Trung Quốc/Lào.',
    tag: 'Hải quan 2 đầu',
    popular: true,
  },
  {
    id: 'cb-vas-4',
    name: 'Mở tờ khai hải quan hàng quá cảnh quốc tế qua lãnh thổ Việt Nam',
    desc: 'Thủ tục quá cảnh hàng từ cảng biển VN đi Campuchia hoặc hàng Trung Quốc quá cảnh đi ASEAN.',
    tag: 'Hàng quá cảnh',
  },
  {
    id: 'cb-vas-5',
    name: 'Niêm phong kẹp chì điện tử GPS theo dõi lộ trình xuyên biên giới',
    desc: 'Seal điện tử định vị vệ sinh chống rách niêm phong và theo dõi lộ trình theo chuẩn hải quan.',
    tag: 'Seal định vị GPS',
  },
  {
    id: 'cb-vas-6',
    name: 'Đội xe dẫn đường & Hộ tống an ninh áp tải hàng hóa giá trị cao',
    desc: 'Nhân sự bảo vệ và xe dẫn đoàn suốt hành trình trên các cung đường quốc tế.',
    tag: 'Hộ tống an ninh',
  },
  {
    id: 'cb-vas-7',
    name: 'Thu xếp đổi đầu kéo & Tài xế bản địa thông thạo luật giao thông nước sở tại',
    desc: 'Đổi tài xế tại biên giới đảm bảo tuân thủ luật lái xe và giao tiếp tại nước nhập cảnh.',
    tag: 'Tài xế bản địa',
  },
  {
    id: 'cb-vas-8',
    name: 'Bảo hiểm trách nhiệm vận tải xuyên biên giới quốc tế mở rộng',
    desc: 'Bảo hiểm vật chất xe và rủi ro toàn diện hàng hóa trong phạm vi ngoài lãnh thổ Việt Nam.',
    tag: 'Bảo hiểm quốc tế',
    popular: true,
  },
];

interface CrossBorderInquiryFormProps {
  specs: CrossBorderInquirySpecs;
  onChange: (specs: CrossBorderInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
}

export const CrossBorderInquiryForm: React.FC<CrossBorderInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
}) => {
  const updateSpec = <K extends keyof CrossBorderInquirySpecs>(key: K, value: CrossBorderInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Service Header Info */}
      <div className="p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-orange-600 text-white shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="text-xs text-orange-950 flex-1">
          <span className="font-bold block text-sm text-orange-900">
            Dịch Vụ Vận Tải Xuyên Biên Giới (Cross-Border Road Freight GMS)
          </span>
          <p className="text-orange-800/80 mt-0.5">
            Tuyến kết nối đường bộ giữa Việt Nam và các nước láng giềng (Trung Quốc, Campuchia, Lào, Thái Lan). Chọn rõ cửa khẩu và phương thức chạy thẳng hoặc sang tải.
          </p>
        </div>
      </div>

      {/* Trade Role Selection: Xuất Khẩu vs Nhập Khẩu */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-orange-700" />
            <span>Vai Trò Doanh Nghiệp Trong Tuyến Xuyên Biên Giới *</span>
          </label>
          <span className="text-[10px] font-semibold text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded-md">
            {specs.tradeRole === 'Nhập khẩu (Import)'
              ? '🛬 Vận chuyển hàng nhập từ nước ngoài về VN'
              : '🛫 Vận chuyển hàng xuất từ VN sang nước ngoài'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              role: 'Xuất khẩu (Export)',
              title: '🛫 Tuyến Xuất Khẩu (Export)',
              sub: 'Hàng xuất từ VN qua Cửa khẩu',
            },
            {
              role: 'Nhập khẩu (Import)',
              title: '🛬 Tuyến Nhập Khẩu (Import)',
              sub: 'Hàng nhập qua Cửa khẩu về VN',
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
                    ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-500/25 font-bold text-orange-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.title}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0"></span>
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

      {/* Border Gate Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <Flag className="w-3.5 h-3.5 text-orange-600" />
          <span>Cửa Khẩu Biên Giới Qua Lại (Border Checkpoint) *</span>
        </label>
        <select
          value={specs.borderGate}
          onChange={(e) => updateSpec('borderGate', e.target.value as any)}
          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-bold text-orange-950"
        >
          <option value="Mộc Bài / Xa Mát (VN ↔ Campuchia)">
            🇰🇭 Cửa khẩu Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)
          </option>
          <option value="Hữu Nghị / Tân Thanh (VN ↔ Trung Quốc)">
            🇨🇳 Cửa khẩu Quốc tế Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường Trung Quốc)
          </option>
          <option value="Lao Bảo / Cha Lo (VN ↔ Lào ↔ Thái Lan)">
            🇱🇦 Cửa khẩu Lao Bảo / Cha Lo (Quảng Trị / Quảng Bình VN ↔ Savannakhet Lào ↔ Thái Lan)
          </option>
          <option value="Móng Cái (VN ↔ Quảng Tây)">
            🇨🇳 Cửa khẩu Quốc tế Móng Cái (Quảng Ninh VN ↔ Đông Hưng Quảng Tây TQ)
          </option>
        </select>
      </div>

      {/* Route: Origin & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Địa Điểm Lấy Hàng (Kho Gốc / Thành Phố Xuất Phát) *</span>
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              updateSpec('originCity', e.target.value);
            }}
            placeholder="VD: KCN VSIP 1, TP. Thuận An, Bình Dương, Việt Nam"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-hidden font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Địa Điểm Giao Hàng (Kho Đích / Thành Phố Nước Bạn) *</span>
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              updateSpec('destinationCity', e.target.value);
            }}
            placeholder="VD: Phnom Penh SEZ, Sangkat Phleung Chheh Roteh, Phnom Penh, Campuchia"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-hidden font-medium"
          />
        </div>
      </div>

      {/* Transport Mode & Vehicle Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Phương Thức Vận Chuyển *
          </label>
          <select
            value={specs.cargoMode}
            onChange={(e) => updateSpec('cargoMode', e.target.value as any)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-bold text-orange-950"
          >
            <option value="Xe liên vận chạy thẳng (Direct GMS)">Xe Liên Vận Chạy Thẳng (Direct GMS)</option>
            <option value="Sang tải / Đổi đầu kéo tại cửa khẩu (Transshipment)">Sang Tải / Đổi Đầu Kéo Tại Cửa Khẩu</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Số Lượng Chuyến / Xe
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={specs.vehicleCount !== undefined && specs.vehicleCount !== null ? (specs.vehicleCount === 0 ? '' : specs.vehicleCount) : 1}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              updateSpec('vehicleCount', raw === '' ? 0 : parseInt(raw, 10));
            }}
            onBlur={() => {
              if (!specs.vehicleCount || specs.vehicleCount < 1) {
                updateSpec('vehicleCount', 1);
              }
            }}
            placeholder="Nhập số lượng xe/chuyến..."
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-bold text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
