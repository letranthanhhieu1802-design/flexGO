import React, { useMemo } from 'react';
import { Globe, MapPin, Flag, ArrowLeftRight, Truck, Package, ShieldCheck, Clock, FileText, Anchor, Sparkles, Plus, Trash2 } from 'lucide-react';
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

const CROSS_BORDER_VEHICLES = [
  {
    id: 'cont-40hc',
    name: 'Đầu Kéo Container 40ft High Cube (40HC) — [Tiêu chuẩn 2.9m / 68 CBM]',
    desc: 'Phổ biến nhất cho hàng tiêu dùng, điện tử, linh kiện, may mặc đóng cont kín',
  },
  {
    id: 'cont-40rf',
    name: 'Đầu Kéo Container Lạnh 40ft Reefer (40RF) — [Dải nhiệt kiểm soát / Genset]',
    desc: 'Trái cây xuất khẩu (sầu riêng, thanh long), nông sản, thủy hải sản, thực phẩm đông lạnh',
  },
  {
    id: 'cont-20gp',
    name: 'Đầu Kéo Container 20ft (20GP / 20RF) — [Hàng nặng / Quặng / Hóa chất 28-30T]',
    desc: 'Hàng có trọng lượng lớn, hóa chất, nguyên liệu công nghiệp nặng',
  },
  {
    id: 'truck-15t-box',
    name: 'Xe Tải Thùng Kín 15.0T (3 Chân liên vận GMS) — [Dài 9.5m / 55 - 60 CBM]',
    desc: 'Chạy thẳng nội đô Campuchia / Lào, an ninh cao có niêm phong kẹp chì',
  },
  {
    id: 'truck-15t-tarpaulin',
    name: 'Xe Tải Mui Bạt 15.0T - 18.0T (3-4 Chân) — [Dễ cẩu nóc / Nông sản]',
    desc: 'Bốc dỡ hàng máy móc từ trên nóc thùng hoặc hàng bao tải',
  },
  {
    id: 'flatbed-lowbed',
    name: 'Đầu Kéo Sơ-mi Rơ-moóc Sàn / Lùn (Flatbed / Lowbed) — [Máy móc, Thiết bị quá khổ]',
    desc: 'Hàng cơ giới, thép cuộn, cấu kiện công trình xây dựng nhà máy',
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

  const isFTL = specs.loadType !== 'LTL (Ghép hàng lẻ)';
  const isLTL = specs.loadType === 'LTL (Ghép hàng lẻ)';

  const pickupLocations = useMemo(() => {
    if (specs.pickupLocations && specs.pickupLocations.length > 0) {
      return isLTL ? [specs.pickupLocations[0]] : specs.pickupLocations;
    }
    return [origin || ''];
  }, [specs.pickupLocations, origin, isLTL]);

  const deliveryLocations = useMemo(() => {
    if (specs.deliveryLocations && specs.deliveryLocations.length > 0) {
      return isLTL ? [specs.deliveryLocations[0]] : specs.deliveryLocations;
    }
    return [destination || ''];
  }, [specs.deliveryLocations, destination, isLTL]);

  const handlePickupLocationChange = (index: number, val: string) => {
    const newLocations = [...pickupLocations];
    newLocations[index] = val;
    onChange({
      ...specs,
      pickupLocations: newLocations,
      pickupPointsCount: newLocations.length,
    });
    if (index === 0) {
      setOrigin(val);
    }
  };

  const addPickupLocation = () => {
    if (isLTL || pickupLocations.length >= 5) return;
    const newLocations = [...pickupLocations, ''];
    onChange({
      ...specs,
      pickupLocations: newLocations,
      pickupPointsCount: newLocations.length,
    });
  };

  const removePickupLocation = (index: number) => {
    if (isLTL || pickupLocations.length <= 1) return;
    const newLocations = pickupLocations.filter((_, i) => i !== index);
    onChange({
      ...specs,
      pickupLocations: newLocations,
      pickupPointsCount: newLocations.length,
    });
    if (newLocations[0] !== undefined) {
      setOrigin(newLocations[0]);
    }
  };

  const handleDeliveryLocationChange = (index: number, val: string) => {
    const newLocations = [...deliveryLocations];
    newLocations[index] = val;
    onChange({
      ...specs,
      deliveryLocations: newLocations,
      deliveryPointsCount: newLocations.length,
      multiDropPoints: newLocations.length,
    });
    if (index === 0) {
      setDestination(val);
    }
  };

  const addDeliveryLocation = () => {
    if (isLTL || deliveryLocations.length >= 5) return;
    const newLocations = [...deliveryLocations, ''];
    onChange({
      ...specs,
      deliveryLocations: newLocations,
      deliveryPointsCount: newLocations.length,
      multiDropPoints: newLocations.length,
    });
  };

  const removeDeliveryLocation = (index: number) => {
    if (isLTL || deliveryLocations.length <= 1) return;
    const newLocations = deliveryLocations.filter((_, i) => i !== index);
    onChange({
      ...specs,
      deliveryLocations: newLocations,
      deliveryPointsCount: newLocations.length,
      multiDropPoints: newLocations.length,
    });
    if (newLocations[0] !== undefined) {
      setDestination(newLocations[0]);
    }
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
            Tuyến kết nối đường bộ quốc tế giữa Việt Nam và các nước láng giềng (Trung Quốc, Campuchia, Lào, Thái Lan). Bao gồm xe nguyên chuyến (FTL) hoặc ghép hàng lẻ (LTL) kết hợp thủ tục hải quan 2 đầu cửa khẩu.
          </p>
        </div>
      </div>

      {/* 1. Load Mode: FTL vs LTL */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-orange-600" />
            <span>1. Hình Thức Vận Chuyển (Load Mode) *</span>
          </span>
          <span className="text-[10px] font-bold text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded-md">
            {isFTL ? '🚚 Vận chuyển nguyên xe / Nguyên cont' : '📦 Ghép hàng lẻ phân phối'}
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              type: 'FTL (Nguyên chuyến / Nguyên cont)',
              title: '🚚 FTL - Bao Nguyên Xe / Nguyên Cont (Full Truckload)',
              desc: 'Thuê trọn cont/xe, bốc dỡ linh hoạt, giao thẳng không sang xe hoặc sang tải cả xe. Hỗ trợ đa điểm lấy/giao.',
            },
            {
              type: 'LTL (Ghép hàng lẻ)',
              title: '📦 LTL - Ghép Hàng Lẻ Xuyên Biên Giới (Less-Than-Truckload)',
              desc: 'Tính cước theo CBM/Kg quy đổi. Cố định 1 điểm lấy - 1 điểm giao qua kho phân phối.',
            },
          ].map((item) => {
            const isSelected = (specs.loadType || 'FTL (Nguyên chuyến / Nguyên cont)') === item.type;
            return (
              <button
                type="button"
                key={item.type}
                onClick={() => {
                  updateSpec('loadType', item.type as any);
                  if (item.type === 'LTL (Ghép hàng lẻ)') {
                    onChange({
                      ...specs,
                      loadType: item.type as any,
                      pickupPointsCount: 1,
                      pickupLocations: [pickupLocations[0] || origin || ''],
                      deliveryPointsCount: 1,
                      deliveryLocations: [deliveryLocations[0] || destination || ''],
                      multiDropPoints: 1,
                    });
                  }
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-500/25 font-bold text-orange-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.title}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0"></span>}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Trade Role & Incoterms 2020 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-orange-700" />
            <span>2. Vai Trò Doanh Nghiệp (Trade Role) *</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { role: 'Xuất khẩu (Export)', title: '🛫 Tuyến Xuất Khẩu (Export)' },
              { role: 'Nhập khẩu (Import)', title: '🛬 Tuyến Nhập Khẩu (Import)' },
            ].map((item) => {
              const isSelected = (specs.tradeRole || 'Xuất khẩu (Export)') === item.role;
              return (
                <button
                  type="button"
                  key={item.role}
                  onClick={() => updateSpec('tradeRole', item.role as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-500/25 font-bold text-orange-950 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.title}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            <span>3. Điều Kiện Thương Mại (Incoterms 2020) *</span>
          </label>
          <select
            value={specs.incoterms || 'DAP - Delivered at Place (Giao tại nơi đến)'}
            onChange={(e) => updateSpec('incoterms', e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
          >
            <option value="DAP - Delivered at Place (Giao tại nơi đến)">DAP - Giao tại nơi đến (Nhà máy người mua)</option>
            <option value="DDP - Delivered Duty Paid (Giao đã nộp thuế trọn gói)">DDP - Giao hàng đã thông quan & nộp thuế</option>
            <option value="FCA - Free Carrier (Giao cho người chuyên chở tại kho xuất)">FCA - Giao cho người chuyên chở</option>
            <option value="FOB - Free on Board (Giao hàng tại bãi cửa khẩu xuất)">FOB / FOT - Giao tại bãi cửa khẩu xuất</option>
            <option value="EXW - Ex Works (Giao tại xưởng người bán)">EXW - Giao tại xưởng người bán</option>
            <option value="CIF / CIP - Carriage and Insurance Paid">CIP / CIF - Cước phí và bảo hiểm trả tới đích</option>
          </select>
        </div>
      </div>

      {/* 3. Border Gate Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-orange-600" />
            <span>4. Cửa Khẩu Biên Giới Qua Lại (Border Checkpoint) *</span>
          </span>
          <span className="text-[10px] text-orange-700 font-normal">Cửa khẩu quốc tế được phép làm thủ tục GMS</span>
        </label>
        <select
          value={specs.borderGate || 'Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)'}
          onChange={(e) => updateSpec('borderGate', e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
        >
          <optgroup label="🇰🇭 Tuyến Cửa Khẩu Campuchia (Cambodia Route)">
            <option value="Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)">
              🇰🇭 Cửa khẩu Quốc tế Mộc Bài / Xa Mát (Tây Ninh VN ↔ Bavet / Phnom Penh Campuchia)
            </option>
            <option value="Hoa Lư (Bình Phước VN ↔ Trapeang Sre Campuchia)">
              🇰🇭 Cửa khẩu Hoa Lư (Bình Phước VN ↔ Trapeang Sre / Kratie Campuchia)
            </option>
            <option value="Bình Hiệp (Long An VN ↔ Prey Vo Campuchia)">
              🇰🇭 Cửa khẩu Quốc tế Bình Hiệp (Long An VN ↔ Prey Vo / Svay Rieng)
            </option>
            <option value="Tịnh Biên / Vĩnh Xương (An Giang VN ↔ Phnom Den / Kaam Samnor)">
              🇰🇭 Cửa khẩu Tịnh Biên / Vĩnh Xương (An Giang VN ↔ Phnom Den / Kandal)
            </option>
          </optgroup>

          <optgroup label="🇨🇳 Tuyến Cửa Khẩu Trung Quốc (China Route)">
            <option value="Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường / Hữu Nghị Quan TQ)">
              🇨🇳 Cửa khẩu Quốc tế Hữu Nghị / Tân Thanh (Lạng Sơn VN ↔ Bằng Tường / Pingxiang Quảng Tây)
            </option>
            <option value="Móng Cái / Cầu Bắc Luân II (Quảng Ninh VN ↔ Đông Hưng Quảng Tây TQ)">
              🇨🇳 Cửa khẩu Quốc tế Móng Cái / Bắc Luân II (Quảng Ninh VN ↔ Đông Hưng / Dongxing TQ)
            </option>
            <option value="Kim Thành (Lào Cai VN ↔ Hà Khẩu Vân Nam TQ)">
              🇨🇳 Cửa khẩu Quốc tế Kim Thành (Lào Cai VN ↔ Hà Khẩu / Hekou Vân Nam TQ)
            </option>
            <option value="Trà Lĩnh (Cao Bằng VN ↔ Long Bang TQ)">
              🇨🇳 Cửa khẩu Quốc tế Trà Lĩnh (Cao Bằng VN ↔ Long Bang Quảng Tây TQ)
            </option>
          </optgroup>

          <optgroup label="🇱🇦 🇹🇭 Tuyến Cửa Khẩu Lào & Thái Lan (Laos & Thailand Route)">
            <option value="Lao Bảo (Quảng Trị VN ↔ Savannakhet Lào ↔ Mukdahan Thái Lan)">
              🇱🇦 🇹🇭 Cửa khẩu Quốc tế Lao Bảo (Quảng Trị VN ↔ Savannakhet Lào ↔ Mukdahan Thái Lan)
            </option>
            <option value="Cha Lo (Quảng Bình VN ↔ Na Phao Lào ↔ Nakhon Phanom Thái Lan)">
              🇱🇦 🇹🇭 Cửa khẩu Quốc tế Cha Lo (Quảng Bình VN ↔ Na Phao Lào ↔ Nakhon Phanom Thái Lan)
            </option>
            <option value="Cầu Treo (Hà Tĩnh VN ↔ Namphao Lào ↔ Bolikhamxay)">
              🇱🇦 Cửa khẩu Quốc tế Cầu Treo (Hà Tĩnh VN ↔ Namphao Lào ↔ Viêng Chăn)
            </option>
            <option value="Bờ Y (Kon Tum VN ↔ Phouvong Lào ↔ Attapeu)">
              🇱🇦 Cửa khẩu Quốc tế Bờ Y (Kon Tum VN ↔ Phouvong Nam Lào)
            </option>
          </optgroup>
        </select>
      </div>

      {/* 4. Origin & Destination Terms & Multi-stop Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Origin / Pickup Points */}
        <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>5. Điểm Lấy Hàng (Pickup) *</span>
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={specs.originTerm || 'Door (Lấy tận nơi)'}
                onChange={(e) => updateSpec('originTerm', e.target.value as any)}
                className="text-[11px] px-2 py-0.5 bg-white border border-slate-300 rounded-md font-bold text-orange-950 cursor-pointer"
              >
                <option value="Door (Lấy tận nơi)">🏠 Door (Lấy tận nơi)</option>
                <option value="Border (Giao tại bãi cửa khẩu)">🚩 Border (Tại bãi cửa khẩu)</option>
              </select>
              {isFTL && (
                <span className="text-[10px] text-slate-500 font-bold bg-slate-200/80 px-1.5 py-0.5 rounded">
                  {pickupLocations.length} Điểm
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {pickupLocations.map((loc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{idx === 0 ? 'Điểm lấy 1 (Kho xuất hàng chính) *' : `Điểm lấy ${idx + 1} (Kho phụ / Gom hàng)`}</span>
                  </span>
                  {isFTL && idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removePickupLocation(idx)}
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-0.5 text-[10px] font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required={idx === 0}
                  value={loc}
                  onChange={(e) => handlePickupLocationChange(idx, e.target.value)}
                  placeholder={idx === 0 ? "VD: Kho VSIP 1, TP. Thuận An, Bình Dương, Việt Nam" : "VD: KCN Amata, TP. Biên Hòa, Đồng Nai (Điểm gom thêm)"}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-medium shadow-2xs"
                />
              </div>
            ))}
          </div>

          {isFTL && pickupLocations.length < 5 && (
            <button
              type="button"
              onClick={addPickupLocation}
              className="w-full py-1.5 text-[11px] font-bold text-orange-700 bg-orange-100/60 hover:bg-orange-100 border border-orange-200/80 border-dashed rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Điểm Lấy Hàng (Gom phụ)</span>
            </button>
          )}
        </div>

        {/* Destination / Delivery Points */}
        <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>6. Điểm Giao Hàng (Delivery) *</span>
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={specs.destinationTerm || 'Door (Giao tận nơi)'}
                onChange={(e) => updateSpec('destinationTerm', e.target.value as any)}
                className="text-[11px] px-2 py-0.5 bg-white border border-slate-300 rounded-md font-bold text-rose-950 cursor-pointer"
              >
                <option value="Door (Giao tận nơi)">🏠 Door (Giao tận nơi)</option>
                <option value="Border (Nhận tại bãi cửa khẩu)">🚩 Border (Tại bãi cửa khẩu)</option>
              </select>
              {isFTL && (
                <span className="text-[10px] text-slate-500 font-bold bg-slate-200/80 px-1.5 py-0.5 rounded">
                  {deliveryLocations.length} Điểm
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {deliveryLocations.map((loc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{idx === 0 ? 'Điểm giao 1 (Kho đích chính) *' : `Điểm giao ${idx + 1} (Ghé hạ hàng / Multi-drop)`}</span>
                  </span>
                  {isFTL && idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeDeliveryLocation(idx)}
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-0.5 text-[10px] font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required={idx === 0}
                  value={loc}
                  onChange={(e) => handleDeliveryLocationChange(idx, e.target.value)}
                  placeholder={idx === 0 ? "VD: Phnom Penh SEZ, Phnom Penh, Campuchia" : "VD: Kho Chroy Changvar, Phnom Penh (Giao bổ sung)"}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-medium shadow-2xs"
                />
              </div>
            ))}
          </div>

          {isFTL && deliveryLocations.length < 5 && (
            <button
              type="button"
              onClick={addDeliveryLocation}
              className="w-full py-1.5 text-[11px] font-bold text-rose-700 bg-rose-100/60 hover:bg-rose-100 border border-rose-200/80 border-dashed rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Điểm Giao Hàng (Multi-drop)</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Transit Mode & Customs Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            7. Phương Thức Vượt Biên Giới *
          </label>
          <select
            value={specs.cargoMode || 'Xe liên vận chạy thẳng (Direct GMS)'}
            onChange={(e) => updateSpec('cargoMode', e.target.value as any)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
          >
            <option value="Xe liên vận chạy thẳng (Direct GMS)">🚛 Xe liên vận chạy thẳng không sang tải (Direct GMS)</option>
            <option value="Sang tải / Đổi đầu kéo tại cửa khẩu (Transshipment)">🔄 Sang tải / Đổi đầu kéo tại bãi cửa khẩu (Transshipment)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            8. Phạm Vi Dịch Vụ Hải Quan Cửa Khẩu *
          </label>
          <select
            value={specs.customsScope || 'Thông quan Trọn gói 2 đầu (VN + Nước bạn)'}
            onChange={(e) => updateSpec('customsScope', e.target.value as any)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
          >
            <option value="Thông quan Trọn gói 2 đầu (VN + Nước bạn)">📑 Trọn gói Hải quan 2 đầu (Hải quan VN + Nước bạn)</option>
            <option value="Thông quan Hải quan đầu VN">📑 Chỉ thông quan Hải quan đầu Việt Nam</option>
            <option value="Chỉ cước vận chuyển (Chủ hàng tự làm HQ)">🚚 Chỉ vận chuyển thuần túy (Chủ hàng tự mở tờ khai)</option>
          </select>
        </div>
      </div>

      {/* 6. Vehicle Type, Trip Volume & Frequency, SLA */}
      <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-2xl space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-orange-600" />
            <span>9. Cấu Hình Phương Tiện & Sản Lượng Chuyến ({isFTL ? 'FTL' : 'LTL'})</span>
          </span>
          <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200">
            GMS Fleet Specs
          </span>
        </div>

        {isFTL ? (
          /* FTL Fleet & Trip Volume */
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Loại Phương Tiện / Container Xuyên Biên Giới *
              </label>
              <select
                value={specs.vehicleType || CROSS_BORDER_VEHICLES[0].name}
                onChange={(e) => updateSpec('vehicleType', e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-orange-300 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
              >
                {CROSS_BORDER_VEHICLES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Số Lượng Chuyến / Xe Cần Thuê *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={specs.vehicleCount !== undefined && specs.vehicleCount !== null ? (specs.vehicleCount === 0 ? '' : specs.vehicleCount) : 1}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    updateSpec('vehicleCount', val);
                  }}
                  placeholder="VD: 1, 2, 5..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-orange-300 rounded-xl focus:border-orange-500 font-bold text-slate-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Đơn Vị (Tần Suất Vận Chuyển) *
                </label>
                <select
                  value={specs.frequencyUnit || 'Chuyến (Một lần duy nhất)'}
                  onChange={(e) => updateSpec('frequencyUnit', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-orange-300 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
                >
                  <option value="Chuyến (Một lần duy nhất)">Chuyến (Một lần duy nhất)</option>
                  <option value="Chuyến / Tuần">Chuyến / Tuần</option>
                  <option value="Chuyến / Tháng">Chuyến / Tháng</option>
                  <option value="Chuyến / Ngày">Chuyến / Ngày (Tần suất cao)</option>
                </select>
              </div>
            </div>

            {/* SLA Leadtime for FTL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-orange-200/60">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Thời Gian Giao Hàng Yêu Cầu (Leadtime / Transit SLA) *</span>
                </label>
                <select
                  value={specs.leadtimeSLA || '⚡ Hỏa Tốc / Express Xuyên Biên Giới (24h - 36h)'}
                  onChange={(e) => updateSpec('leadtimeSLA', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-orange-300 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
                >
                  <option value="⚡ Hỏa Tốc / Express Xuyên Biên Giới (24h - 36h)">
                    ⚡ Hỏa Tốc / Express Xuyên Biên Giới (24h - 36h) — Tuyến gần Campuchia / Bằng Tường
                  </option>
                  <option value="🚚 Tiêu Chuẩn Tuyến Trung Quốc / Lào (3 - 5 Ngày)">
                    🚚 Tiêu Chuẩn Tuyến Trung Quốc / Lào (3 - 5 Ngày) — Quảng Châu, Thâm Quyến, Viêng Chăn
                  </option>
                  <option value="🗺️ Tiêu Chuẩn Tuyến Xa Thái Lan / Nội địa TQ (5 - 7 Ngày)">
                    🗺️ Tiêu Chuẩn Tuyến Xa Thái Lan / Nội địa TQ (5 - 7 Ngày) — Bangkok, Thượng Hải
                  </option>
                  <option value="✏️ Theo thỏa thuận lịch giao nhận riêng">
                    ✏️ Theo thỏa thuận lịch giao nhận riêng
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Ghi Chú Chi Tiết Giờ Giao Nhận
                </label>
                <input
                  type="text"
                  value={specs.leadtimeNote || ''}
                  onChange={(e) => updateSpec('leadtimeNote', e.target.value)}
                  placeholder="VD: Giao trước 09:00 sáng Thứ Hai để kịp mở tờ khai..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-orange-300 rounded-xl focus:border-orange-500 font-medium text-slate-900 shadow-2xs"
                />
              </div>
            </div>
          </div>
        ) : (
          /* LTL Trip Volume */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Số Lượng Lô Hàng / Chuyến Ghép *
              </label>
              <input
                type="number"
                min={1}
                required
                value={specs.shipmentCount !== undefined && specs.shipmentCount !== null ? (specs.shipmentCount === 0 ? '' : specs.shipmentCount) : 1}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  updateSpec('shipmentCount', val);
                }}
                placeholder="VD: 1, 2, 3..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-orange-300 rounded-xl focus:border-orange-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Đơn Vị (Tần Suất Ghép Hàng) *
              </label>
              <select
                value={specs.frequencyUnit || 'Lô hàng (Một lần duy nhất)'}
                onChange={(e) => updateSpec('frequencyUnit', e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-orange-300 rounded-xl focus:border-orange-500 font-bold text-orange-950 shadow-2xs cursor-pointer"
              >
                <option value="Lô hàng (Một lần duy nhất)">Lô hàng (Một lần duy nhất)</option>
                <option value="Lô hàng / Tuần">Lô hàng / Tuần</option>
                <option value="Lô hàng / Tháng">Lô hàng / Tháng</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
