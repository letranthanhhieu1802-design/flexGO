import React from 'react';
import { Train, MapPin, Info } from 'lucide-react';
import { RailInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const RAIL_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'r-vas-1',
    name: 'Kéo xe đầu cuối (First Mile / Last Mile drayage)',
    desc: 'Đầu kéo lấy cont tại kho khách và giao cont từ ga đến kho đích.',
    tag: 'Kéo đầu cuối',
    popular: true,
  },
  {
    id: 'r-vas-2',
    name: 'Cẩu nâng hạ gắp cont tại bãi ga (Rail Terminal Handling)',
    desc: 'Bốc dỡ sang toa và cẩu hạ container tại bãi hàng ga đường sắt.',
    tag: 'Cẩu nâng hạ ga',
    popular: true,
  },
  {
    id: 'r-vas-3',
    name: 'Kẹp chì niêm phong Seal an ninh đường sắt',
    desc: 'Niêm chì bảo mật hàng hóa chống thất thoát trong hành trình xuyên Việt / liên vận.',
    tag: 'Kẹp chì Seal',
    popular: true,
  },
  {
    id: 'r-vas-4',
    name: 'Máy phát điện duy trì cont lạnh trên toa (Rail Genset Power)',
    desc: 'Cắm điện liên tục cho cont 20RF/40RF trên suốt hành trình Bắc - Nam.',
    tag: 'Điện cont lạnh',
  },
  {
    id: 'r-vas-5',
    name: 'Bảo hiểm hàng hóa vận tải đường sắt',
    desc: 'Bảo hiểm trọn gói giá trị hàng hóa theo hợp đồng vận chuyển đường sắt.',
    tag: 'Bảo hiểm đường sắt',
  },
  {
    id: 'r-vas-6',
    name: 'Kiểm đếm và bốc dỡ hàng tại bãi hàng Ga Giáp Bát / Sóng Thần',
    desc: 'Nhân công bốc dỡ ghép hàng cho lô hàng lẻ LCL tại kho hàng ga.',
    tag: 'Bốc dỡ tại Ga',
  },
];

interface RailInquiryFormProps {
  specs: RailInquirySpecs;
  onChange: (specs: RailInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  cargoClassification?: 'General' | 'Reefer' | 'Hazmat';
}

export const RailInquiryForm: React.FC<RailInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
  cargoClassification = 'General',
}) => {
  const isLclDisabled = cargoClassification === 'Reefer' || cargoClassification === 'Hazmat';

  // Auto fallback to FCL if currently LCL but cargo category is Reefer or Hazmat
  React.useEffect(() => {
    if (isLclDisabled && specs.mode === 'LCL (Hàng lẻ ghép toa)') {
      onChange({
        ...specs,
        mode: 'FCL (Nguyên container ga - ga)',
        containerType: cargoClassification === 'Reefer' ? 'Cont Lạnh (Reefer Rail)' : (specs.containerType || 'Cont 40ft HC'),
      });
    }
  }, [isLclDisabled, cargoClassification, specs, onChange]);

  const updateSpec = <K extends keyof RailInquirySpecs>(key: K, value: RailInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Service Header Info */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-700 text-white shrink-0">
          <Train className="w-5 h-5" />
        </div>
        <div className="text-xs text-blue-950 flex-1">
          <span className="font-bold block text-sm text-blue-900">
            Dịch Vụ Vận Tải Đường Sắt (Rail Container & Bulk Freight)
          </span>
          <p className="text-blue-800/80 mt-0.5">
            Tuyến Bắc - Nam và liên vận quốc tế Trung Quốc - Châu Âu qua ga Giáp Bát, Yên Viên, Sóng Thần.
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateSpec('mode', 'FCL (Nguyên container ga - ga)')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              specs.mode === 'FCL (Nguyên container ga - ga)'
                ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-900 block">🚆 FCL (Nguyên Container Ga - Ga)</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Vận chuyển nguyên cont 20ft/40ft/Cont lạnh</span>
          </button>

          <button
            type="button"
            disabled={isLclDisabled}
            onClick={() => {
              if (!isLclDisabled) {
                updateSpec('mode', 'LCL (Hàng lẻ ghép toa)');
              }
            }}
            title={
              isLclDisabled
                ? `Hàng ${cargoClassification === 'Reefer' ? 'Lạnh' : 'Nguy Hiểm'} bắt buộc đi nguyên container/toa FCL`
                : 'Ghép hàng theo kiện/CBM/Tấn toa hàng kín'
            }
            className={`p-3 rounded-xl border text-left transition-all ${
              isLclDisabled
                ? 'border-slate-200 bg-slate-100/80 opacity-60 cursor-not-allowed text-slate-400'
                : specs.mode === 'LCL (Hàng lẻ ghép toa)'
                ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 cursor-pointer'
                : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold block">📦 LCL (Hàng Lẻ Ghép Toa)</span>
              {isLclDisabled && (
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold border border-rose-200">
                  🚫 Không hỗ trợ
                </span>
              )}
            </div>
            <span className={`text-[11px] mt-0.5 block ${isLclDisabled ? 'text-rose-600/90 font-medium' : 'text-slate-500'}`}>
              {isLclDisabled
                ? `Hàng ${cargoClassification === 'Reefer' ? 'Lạnh' : 'Nguy Hiểm'} bắt buộc đi FCL nguyên toa/cont`
                : 'Ghép hàng theo kiện/CBM/Tấn toa hàng kín'}
            </span>
          </button>
        </div>

        {isLclDisabled && (
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-center gap-2 text-xs text-amber-900 animate-in fade-in duration-150">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="text-[11px]">
              <span className="font-bold">Quy định kỹ thuật đường sắt:</span> Hàng <strong>{cargoClassification === 'Reefer' ? 'Lạnh (Reefer)' : 'Nguy Hiểm (DG)'}</strong> bắt buộc vận chuyển bằng toa/container riêng biệt (FCL) để bảo lưu nguồn điện Genset / an toàn vận hành, không hỗ trợ đóng ghép lẻ (LCL).
            </p>
          </div>
        )}
      </div>

      {/* Route / Stations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Ga Xuất Phát / Kho Gửi *</span>
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              updateSpec('originStation', e.target.value);
            }}
            placeholder="VD: Ga Giáp Bát / Ga Yên Viên (Hà Nội)"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Ga Đến / Kho Nhận *</span>
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              updateSpec('destinationStation', e.target.value);
            }}
            placeholder="VD: Ga Sóng Thần (Bình Dương) / Ga Đà Nẵng"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500"
          />
        </div>
      </div>

      {/* Container / Wagon Type & Quantity/Frequency */}
      {specs.mode === 'FCL (Nguyên container ga - ga)' && (
        <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loại Container / Toa Xe *</label>
            <select
              value={specs.containerType || 'Cont 40ft HC'}
              onChange={(e) => updateSpec('containerType', e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-blue-300 rounded-xl focus:border-blue-500 font-bold text-blue-950 shadow-2xs"
            >
              <option value="Cont 40ft HC">Cont 40ft High Cube (40HC)</option>
              <option value="Cont 20ft">Cont 20ft Thường (20DC)</option>
              <option value="Cont Lạnh (Reefer Rail)">Container Lạnh (Reefer Rail có máy phát)</option>
              <option value="Toa xe thùng kín / bạt">Toa xe thùng kín / Toa bạt chuyên dụng</option>
            </select>
          </div>

          <div className="pt-2 border-t border-blue-200/70">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Số Lượng Container Cần Thuê *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={specs.containerCount !== undefined && specs.containerCount !== null ? (specs.containerCount === 0 ? '' : specs.containerCount) : 1}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    updateSpec('containerCount', raw === '' ? 0 : parseInt(raw, 10));
                  }}
                  onBlur={() => {
                    if (!specs.containerCount || specs.containerCount < 1) {
                      updateSpec('containerCount', 1);
                    }
                  }}
                  placeholder="VD: 1, 5, 10, 30..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-blue-300 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Đơn Vị (Tần Suất Vận Chuyển) *
                </label>
                <select
                  value={specs.containerCountUnit || 'Container / Tháng'}
                  onChange={(e) => updateSpec('containerCountUnit', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-blue-300 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs cursor-pointer"
                >
                  <option value="Container / Ngày">📅 Ngày (Container / Ngày)</option>
                  <option value="Container / Tuần">📆 Tuần (Container / Tuần)</option>
                  <option value="Container / Tháng">🗓️ Tháng (Container / Tháng)</option>
                  <option value="Container / Năm">📈 Năm (Container / Năm)</option>
                  <option value="Container (Một lần)">⚡ Container (Một lần / Spot)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
