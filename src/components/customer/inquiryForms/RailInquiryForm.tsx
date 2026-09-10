import React from 'react';
import { Train, MapPin, ArrowLeftRight, Box, Scale, Info, Layers, Package, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RailInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const RAIL_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'r-vas-1',
    name: 'Kéo xe container đầu cuối (First Mile / Last Mile Drayage)',
    desc: 'Xe đầu kéo chuyên dụng lấy cont tại kho nhà máy và giao cont từ ga đến tận kho đích.',
    tag: 'Kéo đầu cuối',
    popular: true,
  },
  {
    id: 'r-vas-2',
    name: 'Cẩu nâng hạ gắp cont tại bãi ga (Rail Terminal Handling - LoLo)',
    desc: 'Bốc dỡ sang toa và cẩu hạ container tại bãi hàng ga Giáp Bát, Sóng Thần, Yên Viên.',
    tag: 'Cẩu nâng hạ ga',
    popular: true,
  },
  {
    id: 'r-vas-3',
    name: 'Kẹp chì Seal an ninh & Định vị GPS theo dõi hành trình đoàn tàu',
    desc: 'Niêm phong bảo mật chống thất thoát trong suốt hành trình xuyên Việt / liên vận quốc tế.',
    tag: 'Kẹp chì & GPS',
    popular: true,
  },
  {
    id: 'r-vas-4',
    name: 'Máy phát điện Genset duy trì cont lạnh trên toa (Rail Genset Power)',
    desc: 'Cắm điện liên tục cho cont 20RF/40RF trên suốt hành trình Bắc - Nam hoặc liên vận TQ.',
    tag: 'Điện cont lạnh',
    popular: true,
  },
  {
    id: 'r-vas-5',
    name: 'Khai báo hải quan liên vận quốc tế tại cửa khẩu ga đường sắt',
    desc: 'Thông quan xuất nhập khẩu chính ngạch tại Ga đường sắt quốc tế Đồng Đăng, Lào Cai.',
    tag: 'Hải quan ga',
    popular: true,
  },
  {
    id: 'r-vas-6',
    name: 'Chằng buộc chèn lót gia cố toa xe (Lashing & Dunnage chuyên dụng)',
    desc: 'Đai cáp, gỗ chèn và túi khí chống xô lệch hàng hóa trên toa bạt / toa xe thùng kín.',
    tag: 'Chằng buộc toa xe',
  },
  {
    id: 'r-vas-7',
    name: 'Bảo hiểm hàng hóa vận tải đường sắt toàn diện (Rail All-Risks)',
    desc: 'Bảo hiểm 100% giá trị hàng hóa theo hợp đồng vận chuyển đường sắt.',
    tag: 'Bảo hiểm đường sắt',
  },
  {
    id: 'r-vas-8',
    name: 'Nhân công bốc xếp, kiểm đếm tại bãi hàng Ga Giáp Bát / Sóng Thần',
    desc: 'Bốc dỡ, kiểm đếm và phân loại kiện hàng cho lô hàng lẻ LCL tại kho ga.',
    tag: 'Bốc xếp kho ga',
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
    if (isLclDisabled && specs.mode === 'LCL (Hàng lẻ đóng ghép kho ga)') {
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

  const isFCL = specs.mode === 'FCL (Nguyên container ga - ga)';

  // Helper for LCL auto calculation
  const handleLclDimChange = (dimKey: 'lengthCm' | 'widthCm' | 'heightCm', val: number) => {
    const currentDims = specs.lclDimensions || { lengthCm: 120, widthCm: 100, heightCm: 150 };
    const newDims = { ...currentDims, [dimKey]: val };
    const pieces = specs.lclPieces || 1;
    
    // Calculate total CBM: (L * W * H / 1,000,000) * pieces
    const singleCbm = (newDims.lengthCm * newDims.widthCm * newDims.heightCm) / 1000000;
    const totalCbm = parseFloat((singleCbm * pieces).toFixed(2));
    
    // Standard Rail Freight LCL Chargeable Ratio W/M: 1 CBM = 1000 kg (1 RT - Revenue Ton)
    const volumetricWeight = Math.round(totalCbm * 1000);
    const grossWeight = specs.lclGrossWeightKg || 0;
    const chargeableWeight = Math.max(grossWeight, volumetricWeight);
    const revenueTon = parseFloat((chargeableWeight / 1000).toFixed(2));

    onChange({
      ...specs,
      lclDimensions: newDims,
      lclCbm: totalCbm,
      lclChargeableWeightKg: chargeableWeight,
      lclRevenueTon: revenueTon,
      cbmVolume: totalCbm,
    });
  };

  const handleLclPiecesChange = (pieces: number) => {
    const dims = specs.lclDimensions || { lengthCm: 120, widthCm: 100, heightCm: 150 };
    const singleCbm = (dims.lengthCm * dims.widthCm * dims.heightCm) / 1000000;
    const totalCbm = parseFloat((singleCbm * pieces).toFixed(2));
    const volumetricWeight = Math.round(totalCbm * 1000);
    const grossWeight = specs.lclGrossWeightKg || 0;
    const chargeableWeight = Math.max(grossWeight, volumetricWeight);
    const revenueTon = parseFloat((chargeableWeight / 1000).toFixed(2));

    onChange({
      ...specs,
      lclPieces: pieces,
      lclCbm: totalCbm,
      lclChargeableWeightKg: chargeableWeight,
      lclRevenueTon: revenueTon,
      cbmVolume: totalCbm,
    });
  };

  const handleLclGrossWeightChange = (gwKg: number) => {
    const cbm = specs.lclCbm || 0;
    const volumetricWeight = Math.round(cbm * 1000);
    const chargeableWeight = Math.max(gwKg, volumetricWeight);
    const revenueTon = parseFloat((chargeableWeight / 1000).toFixed(2));

    onChange({
      ...specs,
      lclGrossWeightKg: gwKg,
      lclChargeableWeightKg: chargeableWeight,
      lclRevenueTon: revenueTon,
      grossWeightKgs: gwKg,
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Trade Role Selection */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-700" />
            <span>Vai Trò Của Doanh Nghiệp Trong Lô Hàng (Trade Role) *</span>
          </label>
          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            {specs.tradeRole === 'Liên vận xuất khẩu (Export Rail)'
              ? '🇨🇳 Liên vận xuất khẩu đi TQ / Châu Âu'
              : specs.tradeRole === 'Liên vận nhập khẩu (Import Rail)'
              ? '🇻🇳 Liên vận nhập khẩu về VN'
              : '🚆 Tuyến đường sắt nội địa Bắc - Nam'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              role: 'Nội địa Bắc - Nam (Domestic Rail)',
              title: '🚆 Nội Địa Bắc - Nam',
              sub: 'Tuyến Giáp Bát / Yên Viên ↔ Sóng Thần',
            },
            {
              role: 'Liên vận xuất khẩu (Export Rail)',
              title: '🇨🇳 Liên Vận Xuất Khẩu',
              sub: 'Hàng xuất đi TQ / Trung Á / Châu Âu',
            },
            {
              role: 'Liên vận nhập khẩu (Import Rail)',
              title: '🇻🇳 Liên Vận Nhập Khẩu',
              sub: 'Hàng nhập khẩu từ ga quốc tế về VN',
            },
          ].map((item) => {
            const isSelected = (specs.tradeRole || 'Nội địa Bắc - Nam (Domestic Rail)') === item.role;
            return (
              <button
                type="button"
                key={item.role}
                onClick={() => updateSpec('tradeRole', item.role as any)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.title}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
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

      {/* 2. Mode Selector: FCL vs LCL */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Phương Thức Vận Chuyển Đường Sắt (Mode of Rail Transport) *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateSpec('mode', 'FCL (Nguyên container ga - ga)')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              isFCL
                ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">🚆 FCL (Nguyên Container / Toa Xe)</span>
              {isFCL && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold">Đang chọn</span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-normal">
              Cont 20ft / 40HC / Cont Lạnh / Toa bạt kín nguyên toa
            </p>
          </button>

          <button
            type="button"
            disabled={isLclDisabled}
            onClick={() => {
              if (!isLclDisabled) {
                updateSpec('mode', 'LCL (Hàng lẻ đóng ghép kho ga)');
              }
            }}
            title={
              isLclDisabled
                ? `Hàng ${cargoClassification === 'Reefer' ? 'Lạnh' : 'Nguy Hiểm'} bắt buộc đi nguyên container FCL`
                : 'Gom ghép hàng lẻ tại kho bãi ga tính theo CBM / Tấn'
            }
            className={`p-3 rounded-xl border text-left transition-all ${
              isLclDisabled
                ? 'border-slate-200 bg-slate-100/80 opacity-60 cursor-not-allowed text-slate-400'
                : !isFCL
                ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-950 cursor-pointer shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">📦 LCL (Hàng Lẻ Ghép Kho Ga)</span>
              {isLclDisabled ? (
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold border border-rose-200">
                  🚫 Không hỗ trợ
                </span>
              ) : !isFCL ? (
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold">
                  Đang chọn
                </span>
              ) : null}
            </div>
            <p className={`text-[11px] mt-1 font-normal ${isLclDisabled ? 'text-rose-600/90 font-medium' : 'text-slate-500'}`}>
              {isLclDisabled
                ? `Hàng ${cargoClassification === 'Reefer' ? 'Lạnh' : 'Nguy Hiểm'} bắt buộc đi nguyên cont FCL`
                : 'Gom hàng lẻ tại kho bãi ga tính theo CBM / Tấn'}
            </p>
          </button>
        </div>

        {isLclDisabled && (
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-center gap-2 text-xs text-amber-900 animate-in fade-in duration-150">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="text-[11px]">
              <span className="font-bold">Quy định kỹ thuật đường sắt:</span> Hàng <strong>{cargoClassification === 'Reefer' ? 'Lạnh (Reefer)' : 'Nguy Hiểm (Hazmat)'}</strong> bắt buộc vận chuyển bằng phương thức <strong>FCL (Nguyên Container / Toa riêng)</strong> để cắm điện máy phát Genset / đảm bảo an toàn chạy tàu.
            </p>
          </div>
        )}
      </div>

      {/* 3. Movement Terms: Receiving & Delivery Terms */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
          <span>Điều Kiện Giao Nhận Đường Sắt (Movement Terms) *</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Điều Kiện Nhận Hàng (Origin Term) *
            </label>
            <select
              value={specs.originServiceTerm || (isFCL ? 'CY' : 'CFS')}
              onChange={(e) => updateSpec('originServiceTerm', e.target.value as any)}
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs cursor-pointer"
            >
              <option value="Door">🚪 Door (Lấy tận kho người gửi / Shipper)</option>
              <option value="CY">⚓ CY (Nhận tại bãi container ga xuất phát)</option>
              <option value="CFS">📦 CFS (Nhận tại kho hàng lẻ ga xuất phát)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Điều Kiện Giao Hàng (Destination Term) *
            </label>
            <select
              value={specs.destinationServiceTerm || (isFCL ? 'CY' : 'CFS')}
              onChange={(e) => updateSpec('destinationServiceTerm', e.target.value as any)}
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs cursor-pointer"
            >
              <option value="Door">🚪 Door (Giao tận kho người nhận / Consignee)</option>
              <option value="CY">⚓ CY (Giao tại bãi container ga đích đến)</option>
              <option value="CFS">📦 CFS (Giao tại kho hàng lẻ ga đích đến)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Rail Stations (Ga Xếp Hàng & Ga Dỡ Hàng) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Train className="w-3.5 h-3.5 text-blue-600" />
          <span>Ga Xếp Dỡ Đường Sắt (Rail Stations) *</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isFCL ? 'Ga Xếp Hàng (Origin Rail Station / POL Ga) *' : 'Địa Chỉ Kho Ga Nhận Hàng (Origin CFS Rail Station) *'}
            </label>
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                updateSpec('originStation', e.target.value);
              }}
              placeholder="VD: Ga Yên Viên / Ga Giáp Bát (Hà Nội) hoặc Ga Đồng Đăng"
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {isFCL ? 'Ga Dỡ Hàng (Destination Rail Station / POD Ga) *' : 'Địa Chỉ Kho Ga Trả Hàng (Destination CFS Rail Station) *'}
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                updateSpec('destinationStation', e.target.value);
              }}
              placeholder="VD: Ga Sóng Thần (Bình Dương) / Ga Trảng Bom (Đồng Nai)"
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 5. Warehouse Addresses: Shipper & Consignee */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-600" />
          <span>Địa Chỉ Kho Đầu & Kho Cuối (Pickup / Delivery Addresses)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Địa Chỉ Kho Lấy Hàng (Shipper Warehouse / Pickup Address)
            </label>
            <input
              type="text"
              value={specs.pickupAddress || ''}
              onChange={(e) => updateSpec('pickupAddress', e.target.value)}
              placeholder="VD: Nhà máy KCN Quang Minh, Mê Linh, Hà Nội..."
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-medium text-slate-800 shadow-2xs placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Địa Chỉ Giao Hàng (Consignee Warehouse / Delivery Address)
            </label>
            <input
              type="text"
              value={specs.deliveryAddress || ''}
              onChange={(e) => updateSpec('deliveryAddress', e.target.value)}
              placeholder="VD: Kho KCN VSIP 1, Thuận An, Bình Dương..."
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-medium text-slate-800 shadow-2xs placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 6. FCL SPECIFIC CONFIGURATION */}
      {isFCL && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>Cấu Hình Container / Toa Xe & Số Lượng Chuyến FCL *</span>
            </label>
            <span className="text-[10px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              FCL / Nguyên Toa Xe
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Loại Container / Toa Xe *</label>
              <select
                value={specs.containerType || 'Cont 40ft HC'}
                onChange={(e) => updateSpec('containerType', e.target.value as any)}
                className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-blue-950 shadow-2xs cursor-pointer"
              >
                <option value="Cont 40ft HC">Cont 40ft High Cube (40HC - Phổ biến nhất)</option>
                <option value="Cont 20ft">Cont 20ft Thường (20DC)</option>
                <option value="Cont Lạnh (Reefer Rail)">Container Lạnh 40RF (Có máy phát điện Genset)</option>
                <option value="Toa xe thùng kín / bạt">Toa xe thùng kín / Toa bạt chuyên dụng (Covered Wagon)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Điều Khoản Thương Mại (Incoterms)</label>
              <select
                value={specs.incoterm || 'DAP'}
                onChange={(e) => updateSpec('incoterm', e.target.value)}
                className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-medium text-slate-800 shadow-2xs cursor-pointer"
              >
                <option value="DAP">DAP (Delivered at Place - Giao tại ga đích)</option>
                <option value="FCA">FCA (Free Carrier - Giao cho bên vận chuyển ga đi)</option>
                <option value="CPT">CPT (Carriage Paid To - Cước trả tới ga đến)</option>
                <option value="CIP">CIP (Carriage and Insurance Paid To)</option>
                <option value="DDP">DDP (Delivered Duty Paid - Giao trọn gói gồm thuế)</option>
                <option value="EXW">EXW (Ex Works - Nhận tại xưởng)</option>
              </select>
            </div>
          </div>

          {/* FCL Quantity & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                1. Số Lượng Container / Toa *
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
                className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                2. Đơn Vị (Tần Suất Vận Chuyển) *
              </label>
              <select
                value={specs.containerCountUnit || 'Container / Tháng'}
                onChange={(e) => updateSpec('containerCountUnit', e.target.value)}
                className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="Container / Ngày">📅 Ngày (Container / Ngày)</option>
                <option value="Container / Tuần">📆 Tuần (Container / Tuần)</option>
                <option value="Container / Tháng">🗓️ Tháng (Container / Tháng)</option>
                <option value="Container / Năm">📈 Năm (Container / Năm)</option>
                <option value="Container (Một lần)">⚡ Container (Một lần / Spot)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                3. Miễn Phí Lưu Bãi Ga (Free Dem/Det)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={specs.freeDemDetDaysRequested || 7}
                  onChange={(e) => updateSpec('freeDemDetDaysRequested', parseInt(e.target.value, 10) || 7)}
                  className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-800 pr-12 shadow-2xs"
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">Ngày</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. LCL SPECIFIC CONFIGURATION (Dimensions, Weight, CBM, Chargeable Weight & Stackable) */}
      {!isFCL && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-blue-700" />
              <span>Khai Báo Kích Thước & Trọng Lượng Gom Hàng Lẻ Ga (CFS) *</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-blue-900 bg-blue-50 border border-blue-200 font-bold px-2 py-0.5 rounded-md">
                1 CBM = 1.000 Kg (W/M Đường Sắt)
              </span>
            </div>
          </div>

          {/* LCL Package Details: Number of pieces */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Số Lượng Kiện / Pallet Cần Ghép *
              </label>
              <input
                type="text"
                value={specs.lclPieces ? specs.lclPieces.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLclPiecesChange(val ? parseInt(val, 10) : 1);
                }}
                placeholder="VD: 4"
                className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Kích Thước 1 Kiện (Dài x Rộng x Cao cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={specs.lclDimensions?.lengthCm ? specs.lclDimensions.lengthCm.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLclDimChange('lengthCm', val ? parseInt(val, 10) : 0);
                  }}
                  placeholder="Dài 120cm"
                  className="w-full h-10 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 shadow-2xs"
                />
                <input
                  type="text"
                  value={specs.lclDimensions?.widthCm ? specs.lclDimensions.widthCm.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLclDimChange('widthCm', val ? parseInt(val, 10) : 0);
                  }}
                  placeholder="Rộng 100cm"
                  className="w-full h-10 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 shadow-2xs"
                />
                <input
                  type="text"
                  value={specs.lclDimensions?.heightCm ? specs.lclDimensions.heightCm.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLclDimChange('heightCm', val ? parseInt(val, 10) : 0);
                  }}
                  placeholder="Cao 150cm"
                  className="w-full h-10 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Weight & Computed CBM, Chargeable Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tổng Trọng Lượng Thực (Gross Kg) *
              </label>
              <input
                type="text"
                value={specs.lclGrossWeightKg ? specs.lclGrossWeightKg.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLclGrossWeightChange(val ? parseInt(val, 10) : 0);
                }}
                placeholder="VD: 1.000"
                className="w-full h-10 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tổng Thể Tích Tính Toán (CBM)
              </label>
              <div className="h-10 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-900 flex items-center">
                {specs.lclCbm || 1.8} CBM
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Trọng Lượng Tính Cước (Chargeable W/M)
              </label>
              <div className="h-10 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-900 flex items-center justify-between">
                <span>{specs.lclChargeableWeightKg ? specs.lclChargeableWeightKg.toLocaleString('vi-VN') : '1.800'} Kg</span>
                <span className="text-[10px] text-indigo-600 font-medium">({specs.lclRevenueTon || 1.8} RT)</span>
              </div>
            </div>
          </div>

          {/* Stackable Toggle */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="railLclStackableCheck"
              checked={specs.lclStackable ?? true}
              onChange={(e) => updateSpec('lclStackable', e.target.checked)}
              className="rounded-sm text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="railLclStackableCheck" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Hàng có thể chồng tầng (Stackable) <span className="text-slate-500 font-normal">(Nếu không chồng tầng có thể tính thêm hệ số sàn)</span>
            </label>
          </div>

          {/* LCL Shipment Count & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                1. Số Lượng Chuyến Ghép *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={specs.lclShipmentCount !== undefined && specs.lclShipmentCount !== null ? (specs.lclShipmentCount === 0 ? '' : specs.lclShipmentCount) : 1}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  updateSpec('lclShipmentCount', raw === '' ? 0 : parseInt(raw, 10));
                }}
                onBlur={() => {
                  if (!specs.lclShipmentCount || specs.lclShipmentCount < 1) {
                    updateSpec('lclShipmentCount', 1);
                  }
                }}
                placeholder="VD: 1, 2, 5, 10..."
                className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                2. Đơn Vị (Tần Suất Vận Chuyển) *
              </label>
              <select
                value={specs.lclFrequencyUnit || 'Chuyến / Tháng'}
                onChange={(e) => updateSpec('lclFrequencyUnit', e.target.value)}
                className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 font-bold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="Chuyến / Ngày">📅 Ngày (Chuyến / Ngày)</option>
                <option value="Chuyến / Tuần">📆 Tuần (Chuyến / Tuần)</option>
                <option value="Chuyến / Tháng">🗓️ Tháng (Chuyến / Tháng)</option>
                <option value="Chuyến / Năm">📈 Năm (Chuyến / Năm)</option>
                <option value="Chuyến (Một lần)">⚡ Chuyến (Một lần / Spot)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
