import React from 'react';
import { Ship, Anchor, MapPin, ArrowLeftRight, Box, Scale, Info, Layers, Package, CheckCircle2 } from 'lucide-react';
import { OceanInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const OCEAN_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'o-vas-1',
    name: 'Gia hạn thời gian miễn phí lưu bãi lưu cont (Free Dem/Det 14-21 ngày)',
    desc: 'Hỗ trợ xin hãng tàu thêm ngày lưu bãi (Demurrage) và lưu vỏ (Detention) tại cảng đích.',
    tag: 'Free Dem/Det',
    popular: true,
  },
  {
    id: 'o-vas-2',
    name: 'Bảo hiểm hàng hải quốc tế loại A (Institute Cargo Clauses A)',
    desc: 'Bảo hiểm rủi ro toàn diện cho hàng hóa trong suốt hải trình biển quốc tế.',
    tag: 'Bảo hiểm loại A',
    popular: true,
  },
  {
    id: 'o-vas-3',
    name: 'Hun trùng kiểm dịch tiêu chuẩn kiểm dịch quốc tế (Fumigation Certificate)',
    desc: 'Hun trùng Pallet gỗ / Nông sản cấp chứng thư ISPM-15 hợp lệ theo quy định nước nhập khẩu.',
    tag: 'Hun trùng ISPM-15',
    popular: true,
  },
  {
    id: 'o-vas-4',
    name: 'Dịch vụ kẹp chì điện tử GPS & Lashing chằng buộc an toàn trong vỏ cont',
    desc: 'Chèn lót túi khí, chằng buộc xích thép và bấm Seal điện tử định vị hành trình biển.',
    tag: 'Lashing chằng buộc',
    popular: true,
  },
  {
    id: 'o-vas-5',
    name: 'Dịch vụ phát hành Vận đơn điện tử (e-Bill of Lading) & Telex Release',
    desc: 'Thu xếp phát hành vận đơn Surrendered / Sea Waybill hỗ trợ nhận hàng hỏa tốc.',
    tag: 'Telex Release',
  },
  {
    id: 'o-vas-6',
    name: 'Khai báo manifest trước khi xuất cảnh (AFR Nhật, AMS/ISF Mỹ, ENS Châu Âu)',
    desc: 'Khai báo an ninh truyền dữ liệu trước giờ tàu chạy đảm bảo thông quan thuận lợi.',
    tag: 'Khai AMS/ISF/AFR',
  },
];

interface OceanInquiryFormProps {
  specs: OceanInquirySpecs;
  onChange: (specs: OceanInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  cargoClassification?: 'General' | 'Reefer' | 'Hazmat';
}

export const OceanInquiryForm: React.FC<OceanInquiryFormProps> = ({
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
    if (isLclDisabled && specs.mode === 'LCL (Hàng lẻ đóng ghép CFS)') {
      onChange({
        ...specs,
        mode: 'FCL (Full Container)',
        containerType: cargoClassification === 'Reefer' ? (specs.containerType?.includes('Reefer') ? specs.containerType : '40ft Reefer (40RF)') : (specs.containerType || '40ft High Cube (40HC)'),
      });
    }
  }, [isLclDisabled, cargoClassification, specs, onChange]);

  const updateSpec = <K extends keyof OceanInquirySpecs>(key: K, value: OceanInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  const isFCL = specs.mode === 'FCL (Full Container)';

  // Helper for LCL auto calculation
  const handleLclDimChange = (dimKey: 'lengthCm' | 'widthCm' | 'heightCm', val: number) => {
    const currentDims = specs.lclDimensions || { lengthCm: 120, widthCm: 100, heightCm: 150 };
    const newDims = { ...currentDims, [dimKey]: val };
    const pieces = specs.lclPieces || 1;
    
    // Calculate total CBM: (L * W * H / 1,000,000) * pieces
    const singleCbm = (newDims.lengthCm * newDims.widthCm * newDims.heightCm) / 1000000;
    const totalCbm = parseFloat((singleCbm * pieces).toFixed(2));
    
    // Standard Ocean Freight LCL Chargeable Ratio W/M: 1 CBM = 1000 kg (1 RT - Revenue Ton)
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

  const handleLclWeightChange = (grossWeight: number) => {
    const totalCbm = specs.lclCbm || 1.8;
    const volumetricWeight = Math.round(totalCbm * 1000);
    const chargeableWeight = Math.max(grossWeight, volumetricWeight);
    const revenueTon = parseFloat((chargeableWeight / 1000).toFixed(2));

    onChange({
      ...specs,
      lclGrossWeightKg: grossWeight,
      lclChargeableWeightKg: chargeableWeight,
      lclRevenueTon: revenueTon,
      grossWeightKgs: grossWeight,
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Trade Role Selection */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-700" />
            <span>Vai Trò Của Doanh Nghiệp Trong Lô Hàng (Trade Role) *</span>
          </label>
          <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
            {specs.tradeRole === 'Nhập khẩu (Import)'
              ? '🛬 Mua / nhập hàng về VN'
              : specs.tradeRole === 'Nội địa (Domestic)'
              ? '🇻🇳 Vận tải ven biển nội địa'
              : '🛫 Bán / xuất khẩu ra quốc tế'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            {
              role: 'Xuất khẩu (Export)',
              title: '🛫 Xuất Khẩu (Export)',
              sub: 'Bán hàng từ VN ra quốc tế',
            },
            {
              role: 'Nhập khẩu (Import)',
              title: '🛬 Nhập Khẩu (Import)',
              sub: 'Mua hàng từ quốc tế về VN',
            },
            {
              role: 'Nội địa (Domestic)',
              title: '🇻🇳 Nội Địa (Domestic)',
              sub: 'Tuyến Bắc - Trung - Nam',
            },
          ].map((item) => {
            const isSelected = (specs.tradeRole || 'Xuất khẩu (Export)') === item.role;
            return (
              <button
                type="button"
                key={item.role}
                onClick={() => updateSpec('tradeRole', item.role as any)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-600 bg-cyan-50/70 font-bold text-cyan-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.title}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0"></span>
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

      {/* Mode Selector: FCL vs LCL */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800">
          Hình Thức Đóng Hàng Biển (FCL / LCL) *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateSpec('mode', 'FCL (Full Container)')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              isFCL
                ? 'border-cyan-600 bg-cyan-50/70 font-bold text-cyan-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">🚢 FCL (Full Container Load)</span>
              {isFCL && <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-md font-bold">Đang chọn</span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
              Nguyên cont 20ft / 40ft / 40HC / Reefer
            </p>
          </button>

          <button
            type="button"
            disabled={isLclDisabled}
            onClick={() => {
              if (!isLclDisabled) {
                updateSpec('mode', 'LCL (Hàng lẻ đóng ghép CFS)');
              }
            }}
            title={
              isLclDisabled
                ? `Hàng ${cargoClassification === 'Reefer' ? 'Lạnh (Reefer)' : 'Nguy Hiểm (DG/IMO)'} bắt buộc vận chuyển FCL nguyên container, không hỗ trợ ghép LCL CFS`
                : 'Gom hàng lẻ CFS tính theo CBM / Tấn'
            }
            className={`p-3 rounded-xl border text-left transition-all ${
              isLclDisabled
                ? 'border-slate-200 bg-slate-100/80 opacity-60 cursor-not-allowed text-slate-400'
                : !isFCL
                ? 'border-cyan-600 bg-cyan-50/70 font-bold text-cyan-950 cursor-pointer shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">📦 LCL (Hàng lẻ CFS)</span>
              {isLclDisabled ? (
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold border border-rose-200">
                  🚫 Không hỗ trợ
                </span>
              ) : !isFCL ? (
                <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-md font-bold">
                  Đang chọn
                </span>
              ) : null}
            </div>
            <p className={`text-[11px] mt-0.5 font-normal ${isLclDisabled ? 'text-rose-600/90 font-medium' : 'text-slate-500'}`}>
              {isLclDisabled
                ? `Hàng ${cargoClassification === 'Reefer' ? 'Lạnh' : 'Nguy Hiểm'} bắt buộc đi FCL nguyên cont`
                : 'Gom hàng lẻ CFS tính theo CBM / Tấn'}
            </p>
          </button>
        </div>

        {isLclDisabled && (
          <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-center gap-2 text-xs text-amber-900 animate-in fade-in duration-150">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="text-[11px]">
              <span className="font-bold">Quy định an toàn & bảo quản:</span> Hàng <strong>{cargoClassification === 'Reefer' ? 'Lạnh (Reefer)' : 'Nguy Hiểm (DG/IMO)'}</strong> bắt buộc vận chuyển bằng phương thức <strong>FCL (Full Container)</strong> để cắm điện bảo quản lạnh / đảm bảo quy chuẩn phòng chống cháy nổ hàng hải, không thể đóng ghép chung kho CFS (LCL).
            </p>
          </div>
        )}
      </div>

      {/* Movement Terms: Receiving & Delivery Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-600" />
              <span>Điều Kiện Nhận Hàng (Origin Term) *</span>
            </span>
            <span className="text-[10.5px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              Điểm lấy
            </span>
          </label>
          <select
            value={specs.originServiceTerm || (isFCL ? 'CY' : 'CFS')}
            onChange={(e) => updateSpec('originServiceTerm', e.target.value as any)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
          >
            <option value="Door">🚪 Door (Nhận tại kho người gửi / Shipper)</option>
            <option value="CY">⚓ CY (Nhận tại bãi container cảng bốc / CY)</option>
            <option value="CFS">📦 CFS (Nhận tại kho gom hàng lẻ / CFS)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-rose-600" />
              <span>Điều Kiện Giao Hàng (Destination Term) *</span>
            </span>
            <span className="text-[10.5px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Điểm giao
            </span>
          </label>
          <select
            value={specs.destinationServiceTerm || (isFCL ? 'CY' : 'CFS')}
            onChange={(e) => updateSpec('destinationServiceTerm', e.target.value as any)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-rose-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
          >
            <option value="Door">🚪 Door (Giao tại kho người nhận / Consignee)</option>
            <option value="CY">⚓ CY (Giao tại bãi container cảng dỡ / CY)</option>
            <option value="CFS">📦 CFS (Giao tại kho dỡ hàng lẻ / CFS)</option>
          </select>
        </div>
      </div>

      {/* Warehouse Addresses: Pickup & Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
            <span>Địa Chỉ Kho Lấy Hàng (Shipper Warehouse / Pickup Address)</span>
          </label>
          <input
            type="text"
            value={specs.pickupAddress || ''}
            onChange={(e) => updateSpec('pickupAddress', e.target.value)}
            placeholder="VD: Kho KCN Sóng Thần 1, Dĩ An, Bình Dương (hoặc nhà máy người bán)..."
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 text-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Địa Chỉ Giao Hàng (Consignee Warehouse / Delivery Address)</span>
          </label>
          <input
            type="text"
            value={specs.deliveryAddress || ''}
            onChange={(e) => updateSpec('deliveryAddress', e.target.value)}
            placeholder="VD: 1420 Harbor Blvd, Long Beach, CA 90802, USA (hoặc kho người nhận)..."
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-rose-500 text-slate-900 shadow-2xs"
          />
        </div>
      </div>

      {/* Ports / CFS Route */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            {isFCL ? (
              <>
                <Anchor className="w-3.5 h-3.5 text-cyan-600" />
                <span>Cảng Bốc Hàng (Port of Loading - POL) *</span>
              </>
            ) : (
              <>
                <Package className="w-3.5 h-3.5 text-cyan-600" />
                <span>Địa Chỉ Lấy Hàng Kho CFS (Origin CFS Warehouse) *</span>
              </>
            )}
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder={
              isFCL
                ? 'VD: Cảng Cát Lái, Cảng Cái Mép, Cảng Hải Phòng...'
                : 'VD: Kho CFS Cát Lái, CFS Tân Cảng Sóng Thần, CFS Hải Phòng...'
            }
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 text-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            {isFCL ? (
              <>
                <Anchor className="w-3.5 h-3.5 text-rose-600" />
                <span>Cảng Dỡ Hàng (Port of Discharge - POD) *</span>
              </>
            ) : (
              <>
                <Package className="w-3.5 h-3.5 text-rose-600" />
                <span>Địa Chỉ Giao Hàng Kho CFS (Destination CFS Warehouse) *</span>
              </>
            )}
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={
              isFCL
                ? 'VD: Port of Los Angeles (USLAX), Hamburg, Singapore...'
                : 'VD: Kho CFS Port of Los Angeles (USLAX), CFS Singapore, CFS Hamburg...'
            }
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 text-slate-900 shadow-2xs"
          />
        </div>
      </div>

      {/* Container Type, Dem/Det & Quantity/Frequency for FCL */}
      {isFCL && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-cyan-700" />
              <span>Cấu Hình Vỏ Container & Dem/Det (FCL)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loại Vỏ Container *
              </label>
              <select
                value={specs.containerType || '40ft High Cube (40HC)'}
                onChange={(e) => updateSpec('containerType', e.target.value as any)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-semibold text-cyan-950 shadow-2xs cursor-pointer"
              >
                <option value="20ft General (20DC)">20ft General (20DC)</option>
                <option value="40ft General (40DC)">40ft General (40DC)</option>
                <option value="40ft High Cube (40HC)">40ft High Cube (40HC)</option>
                <option value="20ft Reefer (20RF)">20ft Reefer (20RF Lạnh)</option>
                <option value="40ft Reefer (40RF)">40ft Reefer (40RF Lạnh)</option>
                <option value="Open Top / Flat Rack">Open Top / Flat Rack</option>
                <option value="ISO Tank">ISO Tank Bồn chất lỏng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời Gian Miễn Phí Lưu Cont / Bãi (Free Dem/Det)
              </label>
              <select
                value={specs.freeDemDetDaysRequested || 14}
                onChange={(e) => updateSpec('freeDemDetDaysRequested', parseInt(e.target.value) || 14)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value={7}>7 Ngày (Chuẩn hãng tàu)</option>
                <option value={14}>14 Ngày Free Dem/Det (Khuyên dùng)</option>
                <option value={21}>21 Ngày Free Dem/Det</option>
                <option value={28}>28 Ngày Free Dem/Det</option>
              </select>
            </div>
          </div>

          {/* FCL Container Quantity & Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Container Cần Thuê *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={specs.containerCount !== undefined && specs.containerCount !== null ? (specs.containerCount === 0 ? '' : specs.containerCount) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  updateSpec('containerCount', raw === '' ? 0 : parseInt(raw, 10));
                }}
                onBlur={() => {
                  if (!specs.containerCount || specs.containerCount < 1) {
                    updateSpec('containerCount', 1);
                  }
                }}
                placeholder="VD: 1"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đơn Vị (Tần Suất Vận Chuyển) *
              </label>
              <select
                value={specs.containerCountUnit || 'Container / Tháng'}
                onChange={(e) => updateSpec('containerCountUnit', e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="Container / Ngày">Container / Ngày</option>
                <option value="Container / Tuần">Container / Tuần</option>
                <option value="Container / Tháng">Container / Tháng</option>
                <option value="Container / Năm">Container / Năm</option>
                <option value="Container (Một lần)">Container (Một lần / Spot)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* LCL CFS CONFIGURATION (Dimensions, Weight, CBM, Chargeable Weight & Stackable) */}
      {!isFCL && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Box className="w-4 h-4 text-cyan-700" />
              <span>Khai Báo Kích Thước & Trọng Lượng Gom Hàng LCL (CFS)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Tỷ lệ quy đổi hải vận: 1 CBM = 1.000 kg (W/M)
            </span>
          </div>

          {/* Row 1: LCL Pieces & Stackable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Kiện / Pallet Cần Gom Ghép *
              </label>
              <input
                type="text"
                value={specs.lclPieces ? specs.lclPieces.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLclPiecesChange(val ? parseInt(val, 10) : 1);
                }}
                placeholder="VD: 4"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 h-10 px-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  id="lclStackableCheck"
                  checked={specs.lclStackable ?? true}
                  onChange={(e) => updateSpec('lclStackable', e.target.checked)}
                  className="rounded-sm text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-800 font-semibold">
                  Hàng có thể chồng tầng (Stackable)
                </span>
              </label>
            </div>
          </div>

          {/* Row 2: Dimension Inputs (L x W x H cm) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Kích Thước 1 Kiện (Dài x Rộng x Cao cm)</span>
              <span className="text-[11px] text-slate-400">Tự động tính Tổng Thể Tích CBM</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Dài (L) cm</span>
                <input
                  type="text"
                  value={specs.lclDimensions?.lengthCm ? specs.lclDimensions.lengthCm.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLclDimChange('lengthCm', val ? parseInt(val, 10) : 0);
                  }}
                  placeholder="VD: 120"
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:border-cyan-500 shadow-2xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Rộng (W) cm</span>
                <input
                  type="text"
                  value={specs.lclDimensions?.widthCm ? specs.lclDimensions.widthCm.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLclDimChange('widthCm', val ? parseInt(val, 10) : 0);
                  }}
                  placeholder="VD: 100"
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:border-cyan-500 shadow-2xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-1 font-medium">Cao (H) cm</span>
                <input
                  type="text"
                  value={specs.lclDimensions?.heightCm ? specs.lclDimensions.heightCm.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleLclDimChange('heightCm', val ? parseInt(val, 10) : 0);
                  }}
                  placeholder="VD: 150"
                  className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:border-cyan-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Weight & Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng Trọng Lượng Thực Tế (Gross Kg) *
              </label>
              <input
                type="text"
                value={specs.lclGrossWeightKg ? specs.lclGrossWeightKg.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleLclWeightChange(val ? parseFloat(val) : 0);
                }}
                placeholder="VD: 1.200"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng Thể Tích Tính Toán (CBM)
              </label>
              <div className="h-10 px-3.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-extrabold text-slate-800 flex items-center">
                {specs.lclCbm || 0} CBM
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trọng Lượng Tính Cước (Chargeable W/M)
              </label>
              <div className="h-10 px-3.5 text-xs bg-cyan-50 border border-cyan-200 rounded-xl font-extrabold text-cyan-900 flex items-center justify-between">
                <span>{specs.lclChargeableWeightKg ? specs.lclChargeableWeightKg.toLocaleString('vi-VN') : '0'} Kg</span>
                <span className="text-[10px] text-cyan-700 font-normal">({specs.lclRevenueTon || 0} RT W/M)</span>
              </div>
            </div>
          </div>

          {/* Row 4: LCL Shipment Count & Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Chuyến Ghép *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={specs.lclShipmentCount !== undefined && specs.lclShipmentCount !== null ? (specs.lclShipmentCount === 0 ? '' : specs.lclShipmentCount) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  updateSpec('lclShipmentCount', raw === '' ? 0 : parseInt(raw, 10));
                }}
                onBlur={() => {
                  if (!specs.lclShipmentCount || specs.lclShipmentCount < 1) {
                    updateSpec('lclShipmentCount', 1);
                  }
                }}
                placeholder="VD: 1"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đơn Vị (Tần Suất Vận Chuyển) *
              </label>
              <select
                value={specs.lclFrequencyUnit || 'Chuyến / Tháng'}
                onChange={(e) => updateSpec('lclFrequencyUnit', e.target.value)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="Chuyến / Ngày">Chuyến / Ngày</option>
                <option value="Chuyến / Tuần">Chuyến / Tuần</option>
                <option value="Chuyến / Tháng">Chuyến / Tháng</option>
                <option value="Chuyến / Năm">Chuyến / Năm</option>
                <option value="Chuyến (Một lần)">Chuyến (Một lần / Spot)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Incoterms */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Điều Kiện Thương Mại (Incoterms 2020) *
        </label>
        <select
          value={specs.incoterm || 'FOB'}
          onChange={(e) => updateSpec('incoterm', e.target.value as any)}
          className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-cyan-500 font-semibold text-cyan-950 shadow-2xs cursor-pointer"
        >
          <option value="FOB">FOB - Free on Board (Giao lên tàu cảng bốc)</option>
          <option value="CIF">CIF - Cost, Insurance and Freight (Giao cảng dỡ kèm BH)</option>
          <option value="CFR">CFR - Cost and Freight (Tiền hàng và cước biển)</option>
          <option value="EXW">EXW - Ex Works (Nhận tại xưởng người bán)</option>
          <option value="DDP">DDP - Delivered Duty Paid (Giao tận kho đã nộp thuế)</option>
          <option value="DAP">DAP - Delivered at Place (Giao tận nơi chưa thông quan)</option>
          <option value="FCA">FCA - Free Carrier (Giao cho người chuyên chở)</option>
        </select>
      </div>
    </div>
  );
};
