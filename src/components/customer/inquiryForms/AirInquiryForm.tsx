import React, { useEffect } from 'react';
import { Plane, Zap, Scale, Box, AlertTriangle, ShieldCheck, ArrowLeftRight, MapPin, FileText, CheckCircle2, Info, Package, Sparkles } from 'lucide-react';
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
    desc: 'Bảo quản nhiệt độ lạnh cho hàng vắc-xin, dược phẩm GDP và thực phẩm tươi trong suốt chuyến bay.',
    tag: 'Đá khô & Gel lạnh',
    popular: true,
  },
  {
    id: 'a-vas-3',
    name: 'Soi chiếu an ninh X-Ray & Đóng mâm ULD ưu tiên tại kho sân bay',
    desc: 'Rút ngắn thời gian cut-off soi chiếu an ninh tại nhà ga hàng hóa TCS, SCSC, NCTS, ALSC.',
    tag: 'Ưu tiên ULD',
    popular: true,
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
    name: 'Bảo hiểm hàng không toàn diện rủi ro cao (Air Cargo All-Risks)',
    desc: 'Bảo hiểm 100% giá trị hàng công nghệ cao (High-Tech, Chip bán dẫn, Thiết bị y tế).',
    tag: 'Bảo hiểm 100%',
    popular: true,
  },
  {
    id: 'a-vas-8',
    name: 'Dịch vụ On-Board Courier (OBC) / Hand-Carry áp tải trực tiếp',
    desc: 'Nhân viên bay kèm áp tải hành lý xách tay giao nhận tận tay trong 24 giờ.',
    tag: 'Hand-Carry VIP',
  },
  {
    id: 'a-vas-9',
    name: 'Kiểm đếm, chụp ảnh tình trạng kiện & Lập biên bản bất thường (Irregularity Report)',
    desc: 'Kiểm tra niêm phong, chụp ảnh hiện trạng hàng khi nhập kho TCS/SCSC/NCTS để làm căn cứ bảo hiểm.',
    tag: 'Biên bản bất thường',
  },
  {
    id: 'a-vas-10',
    name: 'Dán tem nhãn phụ tiếng Việt / Mã vạch QR / Serial tracking tại kho sân bay',
    desc: 'In và dán nhãn phụ hàng hóa nhập khẩu theo quy chuẩn để đưa thẳng vào kênh lưu thông bán lẻ.',
    tag: 'Tem nhãn phụ',
  },
  {
    id: 'a-vas-11',
    name: 'Thu xếp xe nâng đặc chủng & Main Deck Loader tại chân cầu bay',
    desc: 'Thiết bị chuyên dụng nâng dỡ kiện máy móc siêu trọng (> 1 tấn) lên máy bay Freighter chở hàng.',
    tag: 'Main Deck Loader',
  },
  {
    id: 'a-vas-12',
    name: 'Kiểm dịch thực vật / động vật & Hun trùng khẩn cấp tại cửa khẩu sân bay',
    desc: 'Đăng ký và lấy mẫu kiểm dịch cấp chứng thư Phytosanitary / Veterinary Certificate cho hàng xuất bay ngay.',
    tag: 'Kiểm dịch sân bay',
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
  const isExpress = specs.airServiceType === 'Express / Courier';
  const isCargo = !isExpress;

  const updateSpec = <K extends keyof AirInquirySpecs>(key: K, value: AirInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  // Auto-calculate Volumetric Weight & Chargeable Weight:
  // - Air Cargo: divisor = 6000 (1 CBM = 167 Kg)
  // - Express / Courier: divisor = 5000 (1 CBM = 200 Kg)
  useEffect(() => {
    const divisor = isExpress ? 5000 : 6000;
    const match = specs.dimensionsCm?.match(/(\d+)\s*[xX*]\s*(\d+)\s*[xX*]\s*(\d+)/);
    if (match) {
      const l = parseFloat(match[1]);
      const w = parseFloat(match[2]);
      const h = parseFloat(match[3]);
      const count = specs.packageCount || 1;
      const volPerPkg = (l * w * h) / divisor;
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
  }, [specs.dimensionsCm, specs.packageCount, specs.grossWeightKgs, isExpress]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. TOP SERVICE TYPE SELECTOR: Air Cargo vs Express / Courier */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Loại Hình Dịch Vụ Vận Tải Hàng Không *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onChange({
                ...specs,
                airServiceType: 'Air Freight / Cargo',
                originServiceTerm: specs.originServiceTerm || 'AIRPORT',
                destinationServiceTerm: specs.destinationServiceTerm || 'AIRPORT',
              });
            }}
            className={`p-3 rounded-xl text-left cursor-pointer transition-all flex items-start gap-3 border ${
              isCargo
                ? 'bg-sky-50/70 border-sky-600 text-sky-950 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${isCargo ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Plane className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">1. Air Freight / Cargo</span>
                {isCargo && <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">Đang chọn</span>}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Hàng không thương mại B2B, bay theo lịch MAWB/HAWB.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onChange({
                ...specs,
                airServiceType: 'Express / Courier',
                originServiceTerm: 'DOOR',
                destinationServiceTerm: 'DOOR',
                expressPackageType: specs.expressPackageType || 'Parcel / Package (Bưu phẩm / Hàng mẫu đóng hộp)',
                expressSpeedLevel: specs.expressSpeedLevel || 'Express Tiêu Chuẩn (2-3 ngày)',
              });
            }}
            className={`p-3 rounded-xl text-left cursor-pointer transition-all flex items-start gap-3 border ${
              isExpress
                ? 'bg-amber-50/70 border-amber-500 text-amber-950 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${isExpress ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">2. Express / Courier</span>
                {isExpress && <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">Đang chọn</span>}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Chuyển phát nhanh Door-to-Door bưu phẩm, tài liệu, hàng mẫu.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. TRADE ROLE SELECTION */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-sky-700" />
            <span>Vai Trò Của Doanh Nghiệp Trong Lô Hàng (Trade Role) *</span>
          </label>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
            isExpress ? 'text-amber-900 bg-amber-50 border-amber-200' : 'text-sky-800 bg-sky-50 border-sky-200'
          }`}>
            {specs.tradeRole === 'Nhập khẩu (Import)'
              ? '🛬 Mua / nhập hàng về VN'
              : specs.tradeRole === 'Nội địa (Domestic)'
              ? '🇻🇳 Tuyến bay nội địa'
              : specs.tradeRole === 'Xuất khẩu (Export)'
              ? '🛫 Bán / xuất khẩu ra nước ngoài'
              : 'Chưa chọn'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { role: 'Xuất khẩu (Export)', title: '🛫 Xuất Khẩu (Export)', sub: 'Gửi hàng từ VN đi quốc tế' },
            { role: 'Nhập khẩu (Import)', title: '🛬 Nhập Khẩu (Import)', sub: 'Nhận hàng từ quốc tế về VN' },
            { role: 'Nội địa (Domestic)', title: '🇻🇳 Nội Địa (Domestic)', sub: 'Tuyến HAN ↔ SGN ↔ DAD' },
          ].map((item) => {
            const isSelected = specs.tradeRole === item.role;
            return (
              <button
                type="button"
                key={item.role}
                onClick={() => updateSpec('tradeRole', item.role as any)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? isExpress
                      ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-950 shadow-2xs'
                      : 'border-sky-600 bg-sky-50/70 font-bold text-sky-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.title}</span>
                  {isSelected && (
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isExpress ? 'bg-amber-600' : 'bg-sky-600'}`}></span>
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

      {/* ========================================================================= */}
      {/* SECTION A: AIR FREIGHT / CARGO SPECIFIC FIELDS */}
      {/* ========================================================================= */}
      {isCargo && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Movement Terms: Receiving & Delivery Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
                  <span>Điều Kiện Nhận Hàng (Origin Term) *</span>
                </span>
                <span className="text-[10.5px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Điểm lấy
                </span>
              </label>
              <select
                value={specs.originServiceTerm || ''}
                onChange={(e) => updateSpec('originServiceTerm', e.target.value as any)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">-- Chọn Điều Kiện Nhận Hàng * --</option>
                <option value="Door">🚪 Door (Lấy tận kho người gửi / Shipper)</option>
                <option value="Airport">✈️ Airport (Nhận tại ga hàng hóa sân bay đi / AOD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Điều Kiện Giao Hàng (Destination Term) *</span>
                </span>
                <span className="text-[10.5px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Điểm giao
                </span>
              </label>
              <select
                value={specs.destinationServiceTerm || ''}
                onChange={(e) => updateSpec('destinationServiceTerm', e.target.value as any)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">-- Chọn Điều Kiện Giao Hàng * --</option>
                <option value="Door">🚪 Door (Giao tận kho người nhận / Consignee)</option>
                <option value="Airport">✈️ Airport (Giao tại ga hàng hóa sân bay đến / AOA)</option>
              </select>
            </div>
          </div>

          {/* Warehouse Addresses: Shipper & Consignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Địa Chỉ Kho Lấy Hàng (Shipper Warehouse / Pickup Address)</span>
              </label>
              <input
                type="text"
                value={specs.pickupAddress || ''}
                onChange={(e) => updateSpec('pickupAddress', e.target.value)}
                placeholder="VD: Kho KCN Tân Bình, Tây Thạnh, Tân Phú, TP.HCM..."
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Địa Chỉ Giao Hàng (Consignee Warehouse / Delivery Address)</span>
              </label>
              <input
                type="text"
                value={specs.deliveryAddress || ''}
                onChange={(e) => updateSpec('deliveryAddress', e.target.value)}
                placeholder="VD: 12-4 Haneda Airport Blvd, Ota City, Tokyo, Japan..."
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Airports (AOD & AOA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
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
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
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
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 text-slate-900 shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: EXPRESS / COURIER SPECIFIC FIELDS */}
      {/* ========================================================================= */}
      {isExpress && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Express Package Classification */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Phân Loại Bưu Kiện Chuyển Phát (Express Package Type) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'Document / Letter (Tài liệu / Thư tín)',
                  title: '📄 Tài Liệu / Thư Tín (Document / Letter)',
                  desc: 'Hồ sơ, hợp đồng, chứng từ gốc, passport, không có giá trị thương mại.',
                },
                {
                  id: 'Parcel / Package (Bưu phẩm / Hàng mẫu đóng hộp)',
                  title: '📦 Hàng Mẫu & Bưu Kiện (Parcel / Package)',
                  desc: 'Hàng mẫu thử, linh kiện, quà tặng, bưu phẩm thương mại đóng thùng carton.',
                },
              ].map((item) => {
                const isSelected = specs.expressPackageType === item.id;
                return (
                  <label
                    key={item.id}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="expressPackageType"
                      checked={isSelected}
                      onChange={() => updateSpec('expressPackageType', item.id as any)}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold block">{item.title}</span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{item.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Door-to-Door Pickup & Delivery with Postal Code */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Địa Chỉ Giao Nhận Tận Tay (Door-to-Door Courier)</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa Chỉ Lấy Hàng Tận Nơi (Pickup Address) *
                  </label>
                  <input
                    type="text"
                    required
                    value={origin || specs.pickupAddress || ''}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      updateSpec('pickupAddress', e.target.value);
                    }}
                    placeholder="VD: Số 45 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM..."
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 text-slate-900 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mã Bưu Chính Đi (Origin Zip/Postal Code)
                  </label>
                  <input
                    type="text"
                    value={specs.originPostalCode || ''}
                    onChange={(e) => updateSpec('originPostalCode', e.target.value)}
                    placeholder="VD: 700000 (TP.HCM) hoặc 100000 (Hà Nội)"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 font-mono shadow-2xs"
                  />
                </div>
              </div>

              {/* Delivery info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa Chỉ Giao Hàng Tận Nơi (Delivery Address) *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination || specs.deliveryAddress || ''}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      updateSpec('deliveryAddress', e.target.value);
                    }}
                    placeholder="VD: 100-0001 Chiyoda-ku, Tokyo, Japan (hoặc bang/thành phố đích)..."
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 text-slate-900 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mã Bưu Chính Đến (Destination Zip/Postal Code) *
                  </label>
                  <input
                    type="text"
                    value={specs.destinationPostalCode || ''}
                    onChange={(e) => updateSpec('destinationPostalCode', e.target.value)}
                    placeholder="VD: 90001 (US), 100-0001 (JP), 04510 (KR)..."
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 font-mono shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: PACKAGE SPECS, DIMENSIONS & CHARGEABLE WEIGHT CALCULATION */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-800">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Khai Báo Kích Thước & Trọng Lượng Tính Cước</span>
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {isExpress ? 'Tỷ lệ quy đổi Courier: 1 m³ = 200 kg (/5.000)' : 'Tỷ lệ quy đổi IATA: 1 m³ = 167 kg (/6.000)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isExpress ? 'Số Lượng Hộp *' : 'Số Kiện Hàng *'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={specs.packageCount !== undefined && specs.packageCount !== null ? specs.packageCount : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                updateSpec('packageCount', val ? Number(val) : undefined);
              }}
              placeholder={isExpress ? 'VD: 2' : 'VD: 10'}
              className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 text-center shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kích Thước 1 Kiện (D x R x C cm)
            </label>
            <input
              type="text"
              value={specs.dimensionsCm || ''}
              onChange={(e) => updateSpec('dimensionsCm', e.target.value)}
              placeholder="VD: 50x40x30"
              className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-mono text-center shadow-2xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tổng Trọng Lượng Thực (Gross Kg) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={specs.grossWeightKgs !== undefined && specs.grossWeightKgs !== null ? specs.grossWeightKgs : ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                updateSpec('grossWeightKgs', val ? Number(val) : undefined);
              }}
              placeholder="VD: 25"
              className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 text-center shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Trọng Lượng Tính Cước</span>
              <span className="text-[10px] text-indigo-600 font-normal">Tự tính</span>
            </label>
            <div className="w-full h-10 px-3.5 text-xs bg-indigo-50 border border-indigo-200 rounded-xl font-extrabold text-indigo-950 text-center flex items-center justify-center">
              {specs.chargeableWeightKgs ? `${specs.chargeableWeightKgs.toLocaleString('vi-VN')} Kg CW` : '-- Kg CW'}
            </div>
          </div>
        </div>

        {/* Stackable Toggle */}
        <div className="flex items-center gap-2 h-10 px-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <input
            type="checkbox"
            id="airStackableCheck"
            checked={Boolean(specs.stackable)}
            onChange={(e) => updateSpec('stackable', e.target.checked)}
            className="rounded-sm text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="airStackableCheck" className="text-xs font-semibold text-slate-800 cursor-pointer">
            Hàng có thể chồng tầng (Stackable) <span className="text-slate-500 font-normal">(Nếu không chồng tầng, cước mâm ULD có thể tính thêm phụ phí diện tích sàn)</span>
          </label>
        </div>

        {/* Air Shipment Count & Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số Lượng Chuyến Hàng Không *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={specs.shipmentCount !== undefined && specs.shipmentCount !== null ? specs.shipmentCount : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                updateSpec('shipmentCount', raw === '' ? undefined : parseInt(raw, 10));
              }}
              placeholder="VD: 1"
              className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Đơn Vị (Tần Suất Vận Chuyển) *
            </label>
            <select
              value={specs.frequencyUnit || ''}
              onChange={(e) => updateSpec('frequencyUnit', e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
            >
              <option value="">-- Chọn Đơn Vị Tần Suất --</option>
              <option value="Chuyến / Ngày">Chuyến / Ngày</option>
              <option value="Chuyến / Tuần">Chuyến / Tuần</option>
              <option value="Chuyến / Tháng">Chuyến / Tháng</option>
              <option value="Chuyến / Năm">Chuyến / Năm</option>
              <option value="Chuyến (Một lần)">Chuyến (Một lần / Spot)</option>
            </select>
          </div>
        </div>

        {/* Extra Courier Features */}
        {isExpress && (
          <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={Boolean(specs.signatureRequired)}
                onChange={(e) => updateSpec('signatureRequired', e.target.checked)}
                className="rounded-sm text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <span>Yêu cầu ký nhận tận tay (Proof of Delivery / POD)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={Boolean(specs.expressCustomsSupport)}
                onChange={(e) => updateSpec('expressCustomsSupport', e.target.checked)}
                className="rounded-sm text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <span>Hỗ trợ thủ tục hải quan chuyển phát nhanh trọn gói</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
