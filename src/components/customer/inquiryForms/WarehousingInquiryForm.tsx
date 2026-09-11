import React from 'react';
import { Building2, MapPin, Layers, Box, Cpu, FileText, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, BarChart2, ThermometerSnowflake, Droplets, Flame, Tag, DollarSign } from 'lucide-react';
import { WarehousingInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

// 1. Kho Thường Grade A (5 mục)
export const DRY_WH_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'w-vas-dry-1',
    name: 'Dán tem phụ tiếng Việt & In mã vạch Barcode/QR SKU (Sub-labeling)',
    desc: 'Dán tem nhãn phụ hợp quy theo NĐ 43/2017/NĐ-CP, dán tem mã vạch định danh từng sản phẩm.',
    tag: 'Dán tem phụ',
    popular: true,
  },
  {
    id: 'w-vas-dry-2',
    name: 'Quấn màng co PE & Đai nẹp pallet xuất khẩu (Stretch Wrapping & Strapping)',
    desc: 'Quấn màng PE nhiều lớp chống bụi ẩm, gia cố dây đai nẹp góc bảo vệ an toàn pallet.',
    tag: 'Quấn màng PE',
    popular: true,
  },
  {
    id: 'w-vas-dry-3',
    name: 'Đóng gói Kitting, chia chọn combo & Co màng nhiệt (Kitting & Bundling)',
    desc: 'Gom nhiều mã SKU thành bộ quà tặng, bọc màng co nhiệt và dán băng keo thương hiệu.',
    tag: 'Đóng gói Kitting',
  },
  {
    id: 'w-vas-dry-4',
    name: 'Đóng kiện gỗ / Khung gỗ chịu lực cho máy móc (Wooden Crating)',
    desc: 'Đóng khung gỗ chống va đập cho máy móc công nghiệp, thiết bị dễ vỡ và cấp chứng thư hun trùng.',
    tag: 'Đóng kiện gỗ',
  },
  {
    id: 'w-vas-dry-5',
    name: 'Bảo hiểm cháy nổ & Rủi ro tài sản hàng hóa kho bãi 100%',
    desc: 'Bảo hiểm rủi ro tài sản hàng hóa lưu kho theo giá trị thực tế khai báo đối soát hàng tháng.',
    tag: 'Bảo hiểm kho 100%',
    popular: true,
  },
];

// 2. Kho Lạnh / Mát (4 mục)
export const COLD_WH_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'w-vas-cold-1',
    name: 'Cấp đông nhanh & Hạ nhiệt tiền lưu kho (Pre-cooling / Blast Freezing)',
    desc: 'Hạ nhiệt cấp tốc cho nông thủy sản tươi sống trước khi đưa vào phòng đông sâu -20°C.',
    tag: 'Cấp đông lạnh',
    popular: true,
  },
  {
    id: 'w-vas-cold-2',
    name: 'Quấn màng PE cách nhiệt & Đai nẹp pallet lạnh xuất khẩu',
    desc: 'Bọc màng PE chuyên dụng chịu âm độ và gia cố đai nẹp chống xô lệch hàng đông lạnh.',
    tag: 'Pallet kho lạnh',
    popular: true,
  },
  {
    id: 'w-vas-cold-3',
    name: 'Kiểm tra chất lượng (KCS) & Phân loại phẩm cấp nông thủy sản',
    desc: 'Kiểm tra độ tươi, màu sắc, phân size và loại bỏ sản phẩm dập nát trước khi cấp đông.',
    tag: 'Kiểm định KCS',
  },
  {
    id: 'w-vas-cold-4',
    name: 'Bảo hiểm rủi ro mất nhiệt & Cháy nổ kho lạnh toàn diện 100%',
    desc: 'Bảo hiểm bồi thường rủi ro sự cố gián đoạn nhiệt độ lạnh làm hư hỏng hàng hóa.',
    tag: 'Bảo hiểm kho lạnh',
    popular: true,
  },
];

// 3. Kho Hàng Nguy Hiểm DG (4 mục)
export const DG_WH_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'w-vas-dg-1',
    name: 'Đóng gói bao bì thứ cấp chống tràn & Khay hứng tràn (DG Overpack)',
    desc: 'Đóng thùng overpack tiêu chuẩn UN, đệm vật liệu hấp thụ chống rò rỉ hóa chất ra môi trường.',
    tag: 'Bao bì DG Overpack',
    popular: true,
  },
  {
    id: 'w-vas-dg-2',
    name: 'Dán nhãn cảnh báo nguy hiểm GHS / IMO 9 nhóm tiêu chuẩn quốc tế',
    desc: 'In và dán nhãn kim cương cảnh báo nguy hiểm độc hại, ăn mòn, dễ cháy theo chuẩn IMO.',
    tag: 'Nhãn cảnh báo GHS',
    popular: true,
  },
  {
    id: 'w-vas-dg-3',
    name: 'Đóng kiện gỗ đặc chủng chống tĩnh điện & Chống tia lửa',
    desc: 'Đóng pallet/thùng gỗ phủ lớp chống tĩnh điện cho pin Lithium và hóa chất dễ bắt lửa.',
    tag: 'Kiện gỗ an toàn',
  },
  {
    id: 'w-vas-dg-4',
    name: 'Bảo hiểm rủi ro sự cố hóa chất, cháy nổ & Môi trường kho 100%',
    desc: 'Gói bảo hiểm trách nhiệm pháp lý môi trường và bồi thường tài sản hóa chất đặc thù.',
    tag: 'Bảo hiểm DG 100%',
    popular: true,
  },
];

// 4. Kho Ngoại Quan Bonded (4 mục)
export const BONDED_WH_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'w-vas-bon-1',
    name: 'Dán tem nhãn phụ hàng hóa nhập khẩu theo NĐ 43/2017/NĐ-CP',
    desc: 'In dán tem phụ tiếng Việt đầy đủ thông tin xuất xứ, thành phần, đơn vị nhập khẩu.',
    tag: 'Tem phụ XNK',
    popular: true,
  },
  {
    id: 'w-vas-bon-2',
    name: 'Phân loại, chia lô, dán nhãn mã hàng & Đóng gói lại bao bì xuất khẩu',
    desc: 'Chia nhỏ kiện hàng, thay bao bì thương hiệu hoặc ghép lô hàng chuyển khẩu quốc tế.',
    tag: 'Đóng gói XNK',
    popular: true,
  },
  {
    id: 'w-vas-bon-3',
    name: 'Hun trùng kiểm dịch thực vật & Cấp chứng thư ISPM 15',
    desc: 'Xử lý hun trùng pallet gỗ xuất khẩu theo tiêu chuẩn kiểm dịch thực vật quốc tế.',
    tag: 'Hun trùng ISPM 15',
  },
  {
    id: 'w-vas-bon-4',
    name: 'Bảo hiểm tài sản hàng hóa kho ngoại quan toàn diện 100%',
    desc: 'Bảo hiểm rủi ro mất mát, hư hỏng hàng hóa trong suốt thời gian lưu giữ ngoại quan.',
    tag: 'Bảo hiểm ngoại quan',
    popular: true,
  },
];

// 5. Kho TMĐT / Fulfillment (4 mục)
export const ECOMMERCE_WH_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'w-vas-ecom-1',
    name: 'Xử lý hàng đổi trả & Quản lý hàng hoàn TMĐT (Reverse Logistics)',
    desc: 'Tiếp nhận hàng hoàn từ đơn vị vận chuyển, kiểm tra tình trạng, tân trang đóng gói lại để tái nhập kho.',
    tag: 'Xử lý hàng hoàn',
    popular: true,
  },
  {
    id: 'w-vas-ecom-2',
    name: 'Chèn thiệp cảm ơn, Voucher khuyến mãi & Quà tặng kèm đơn hàng (Inserts)',
    desc: 'Chèn thiệp cảm ơn, thẻ bảo hành, voucher giảm giá hoặc quà tặng mẫu thử theo chiến dịch bán lẻ.',
    tag: 'Thiệp & Quà tặng',
    popular: true,
  },
  {
    id: 'w-vas-ecom-3',
    name: 'Đóng gói Kitting combo quà tặng / Co màng lốc sản phẩm',
    desc: 'Ghép nối nhiều SKU thành combo ưu đãi cho các chiến dịch Mega Sale trên sàn TMĐT.',
    tag: 'Combo Kitting',
  },
  {
    id: 'w-vas-ecom-4',
    name: 'Dán tem Barcode mã vạch từng sản phẩm lẻ (Item-level Tagging)',
    desc: 'In dán mã vạch định danh từng sản phẩm giúp nhặt hàng không bị sai sót mã hàng.',
    tag: 'Dán tem SKU lẻ',
    popular: true,
  },
];

// 6. Kho Tự Quản Self-Storage (3 mục)
export const SELF_STORAGE_WH_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'w-vas-self-1',
    name: 'Bảo hiểm cháy nổ tài sản khoang tự quản toàn diện 100%',
    desc: 'Bảo hiểm rủi ro tài sản hàng hóa được lưu giữ trong khoang cá nhân tự quản.',
    tag: 'Bảo hiểm khoang 100%',
    popular: true,
  },
  {
    id: 'w-vas-self-2',
    name: 'Cung cấp vật tư đóng gói tại chỗ (Thùng carton, màng PE, băng keo)',
    desc: 'Cung cấp bộ kit vật tư đóng gói tiện lợi ngay tại quầy lễ tân nhà kho.',
    tag: 'Vật tư đóng gói',
    popular: true,
  },
  {
    id: 'w-vas-self-3',
    name: 'Cho thuê xe nâng tay & Xe đẩy hàng nội bộ tại khoang',
    desc: 'Hỗ trợ xe đẩy hàng 4 bánh và xe nâng tay cơ khí di chuyển hàng hóa thuận tiện.',
    tag: 'Xe đẩy nội bộ',
  },
];

export const getWarehousingVASItems = (warehouseType?: string, cargoClassification?: string): VASItemDef[] => {
  if (warehouseType === 'Kho tự quản (Self-Storage)') {
    return SELF_STORAGE_WH_VAS_ITEMS;
  }
  if (warehouseType === 'Kho TMĐT / Fulfillment') {
    return ECOMMERCE_WH_VAS_ITEMS;
  }
  if (warehouseType === 'Kho lạnh / Kho mát (Cold Storage)' || cargoClassification === 'Reefer') {
    return COLD_WH_VAS_ITEMS;
  }
  if (warehouseType === 'Kho hàng nguy hiểm (DG Warehouse)' || cargoClassification === 'Hazmat') {
    return DG_WH_VAS_ITEMS;
  }
  if (warehouseType === 'Kho ngoại quan (Bonded)') {
    return BONDED_WH_VAS_ITEMS;
  }
  return DRY_WH_VAS_ITEMS;
};

// Default fallback list
export const WAREHOUSING_VAS_ITEMS: VASItemDef[] = DRY_WH_VAS_ITEMS;

interface WarehousingInquiryFormProps {
  specs: WarehousingInquirySpecs;
  onChange: (specs: WarehousingInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  cargoClassification?: 'General' | 'Reefer' | 'Hazmat';
  pricingType?: 'SPOT' | 'CONTRACT';
}

export const WarehousingInquiryForm: React.FC<WarehousingInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
  cargoClassification = 'General',
  pricingType = 'SPOT',
}) => {
  // Chỉ coi là thuê dài hạn khi pricingType là CONTRACT VÀ mô hình là LONG_TERM
  const effectivePricingType = pricingType || specs.pricingType || 'SPOT';
  const isContractLease = effectivePricingType === 'CONTRACT' && specs.warehousingLeaseModel !== 'OVERFLOW';

  // Logic kiểm tra loại hình kho có bị vô hiệu hóa tương ứng với phân nhóm hàng hóa không
  const isTypeDisabled = (type: string): boolean => {
    // Ràng buộc 1: Kho ngoại quan chỉ bị khóa khi khách hàng chọn Hợp đồng dài hạn (CONTRACT / Dedicated Hub)
    if (type === 'Kho ngoại quan (Bonded)' || type === 'Kho ngoại quan (Bonded Warehouse)') {
      if (isContractLease) {
        return true;
      }
    }

    if (cargoClassification === 'General') {
      return type === 'Kho lạnh / Kho mát (Cold Storage)' || type === 'Kho hàng nguy hiểm (DG Warehouse)';
    }
    if (cargoClassification === 'Reefer') {
      return type !== 'Kho lạnh / Kho mát (Cold Storage)' && type !== 'Kho tự quản (Self-Storage)' && type !== 'Kho ngoại quan (Bonded)';
    }
    if (cargoClassification === 'Hazmat') {
      return type !== 'Kho hàng nguy hiểm (DG Warehouse)' && type !== 'Kho ngoại quan (Bonded)' && type !== 'Kho tự quản (Self-Storage)';
    }
    return false;
  };

  const getDisabledReason = (type: string): string => {
    if (type === 'Kho ngoại quan (Bonded)' || type === 'Kho ngoại quan (Bonded Warehouse)') {
      if (isContractLease) {
        return '🚫 Kho ngoại quan chỉ áp dụng thuê theo lô/mùa vụ (SPOT, tối đa 12 tháng)';
      }
    }
    if (cargoClassification === 'General') {
      if (type === 'Kho lạnh / Kho mát (Cold Storage)') return '🚫 Hàng thường không lưu kho lạnh';
      if (type === 'Kho hàng nguy hiểm (DG Warehouse)') return '🚫 Hàng thường không lưu kho DG';
    }
    if (cargoClassification === 'Reefer') {
      return '🚫 Hàng lạnh chỉ lưu kho lạnh/tự quản/ngoại quan';
    }
    if (cargoClassification === 'Hazmat') {
      return '🚫 Hàng DG chỉ lưu kho nguy hiểm/ngoại quan/tự quản';
    }
    return '🚫 Không phù hợp nhóm hàng';
  };

  // Tự động chuyển đổi fallback khi user đổi nhóm hàng hóa ở Mục 3 hoặc đổi loại hình kho
  React.useEffect(() => {
    // 0. Fallback nếu đang là Kho Ngoại Quan nhưng hình thức báo giá là CONTRACT / Dài Hạn
    if (isContractLease && (specs.warehouseType === 'Kho ngoại quan (Bonded)' || specs.warehouseType === 'Kho ngoại quan (Bonded Warehouse)')) {
      onChange({
        ...specs,
        warehouseType: 'Kho thường (Grade A Dry)',
      });
      return;
    }

    // 1. Fallback theo nhóm hàng hóa
    if (cargoClassification === 'General') {
      if (specs.warehouseType === 'Kho lạnh / Kho mát (Cold Storage)' || specs.warehouseType === 'Kho hàng nguy hiểm (DG Warehouse)') {
        onChange({
          ...specs,
          warehouseType: 'Kho thường (Grade A Dry)',
        });
        return;
      }
    } else if (cargoClassification === 'Reefer') {
      if (specs.warehouseType !== 'Kho lạnh / Kho mát (Cold Storage)' && specs.warehouseType !== 'Kho tự quản (Self-Storage)' && specs.warehouseType !== 'Kho ngoại quan (Bonded)') {
        onChange({
          ...specs,
          warehouseType: 'Kho lạnh / Kho mát (Cold Storage)',
        });
        return;
      }
    } else if (cargoClassification === 'Hazmat') {
      if (specs.warehouseType !== 'Kho hàng nguy hiểm (DG Warehouse)' && specs.warehouseType !== 'Kho ngoại quan (Bonded)' && specs.warehouseType !== 'Kho tự quản (Self-Storage)') {
        onChange({
          ...specs,
          warehouseType: 'Kho hàng nguy hiểm (DG Warehouse)',
        });
        return;
      }
    }

    // 2. Ràng buộc giữa Kho TMĐT / Kho Tự Quản và Đơn Vị Tính Phí
    if (specs.warehouseType === 'Kho TMĐT / Fulfillment') {
      if (specs.billingUnitPreference !== 'Order (Hoàn tất đơn hàng TMĐT)') {
        onChange({
          ...specs,
          billingUnitPreference: 'Order (Hoàn tất đơn hàng TMĐT)',
          dailyOrderCount: specs.dailyOrderCount || 100,
          bufferPalletPositions: specs.bufferPalletPositions || 20,
        });
      }
    } else if (specs.warehouseType === 'Kho tự quản (Self-Storage)') {
      if (specs.billingUnitPreference !== 'm² (Diện tích sàn)' && specs.billingUnitPreference !== 'CBM (Thể tích thực m³)') {
        onChange({
          ...specs,
          billingUnitPreference: 'm² (Diện tích sàn)',
          storageAreaSqm: specs.storageAreaSqm || 500,
        });
      }
    } else {
      if (specs.billingUnitPreference === 'Order (Hoàn tất đơn hàng TMĐT)') {
        onChange({
          ...specs,
          billingUnitPreference: 'm² (Diện tích sàn)',
          storageAreaSqm: specs.storageAreaSqm || 500,
        });
      }
    }
  }, [cargoClassification, specs, onChange]);

  const updateSpec = <K extends keyof WarehousingInquirySpecs>(key: K, value: WarehousingInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  const isEcommerceWarehouse = specs.warehouseType === 'Kho TMĐT / Fulfillment';
  const isSelfStorage = specs.warehouseType === 'Kho tự quản (Self-Storage)';

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Warehouse Model (6 Models with Conditional Restrictions) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>Mô Hình & Loại Hình Kho Bãi Chuyên Biệt (Warehouse Category) *</span>
          </label>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
            {cargoClassification === 'General'
              ? '📦 Hàng Thường'
              : cargoClassification === 'Reefer'
              ? '❄️ Hàng Lạnh'
              : '⚠️ Hàng Nguy Hiểm'}
          </span>
        </div>

        {/* Compatibility notification alerts */}
        {cargoClassification === 'General' && (
          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
            <span className="font-bold">ℹ️ Quy định phân nhóm hàng thường:</span> Kho Thường Grade A, Kho Ngoại Quan, Kho TMĐT Fulfillment và Kho Tự Quản được mở. Kho Lạnh và Kho Hàng Nguy Hiểm bị khóa.
          </div>
        )}

        {cargoClassification === 'Reefer' && (
          <div className="p-2.5 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-950 flex items-center gap-2">
            <span className="font-bold">❄️ Quy định phân nhóm hàng lạnh:</span> Chỉ cho phép lưu kho tại <strong>Kho Lạnh / Mát</strong>, <strong>Kho Ngoại Quan</strong> (có phân khu lạnh) hoặc <strong>Kho Tự Quản</strong>.
          </div>
        )}

        {cargoClassification === 'Hazmat' && (
          <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center gap-2">
            <span className="font-bold">⚠️ Quy định phân nhóm hàng nguy hiểm (DG):</span> Chỉ cho phép lưu kho tại <strong>Kho Hàng Nguy Hiểm (DG)</strong>, <strong>Kho Ngoại Quan</strong> (đạt chuẩn DG) hoặc <strong>Kho Tự Quản</strong>.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            {
              type: 'Kho thường (Grade A Dry)',
              title: '🏬 Kho Thường Grade A',
              desc: 'Hàng bách hóa, tiêu dùng FMCG, máy móc công nghiệp, sàn bê tông chịu lực 5T/m2',
            },
            {
              type: 'Kho ngoại quan (Bonded)',
              title: '🔒 Kho Ngoại Quan (Bonded)',
              desc: 'Tạm hoãn thuế XNK, lưu trữ hàng chờ xuất khẩu hoặc chuyển khẩu quốc tế',
            },
            {
              type: 'Kho lạnh / Kho mát (Cold Storage)',
              title: '❄️ Kho Lạnh / Mát (Reefer)',
              desc: 'Dải nhiệt kiểm soát -20°C đến +15°C cho thực phẩm, hóa mỹ phẩm & thuốc GDP',
            },
            {
              type: 'Kho hàng nguy hiểm (DG Warehouse)',
              title: '⚠️ Kho Hàng Nguy Hiểm (DG)',
              desc: 'Hóa chất, sơn, dung môi, pin Lithium đạt chuẩn PCCC hóa chất chuyên dụng',
            },
            {
              type: 'Kho TMĐT / Fulfillment',
              title: '📦 Kho Fulfillment TMĐT',
              desc: 'Tích hợp hệ thống WMS, chia chọn Pick & Pack xử lý đơn hàng B2C đa sàn',
            },
            {
              type: 'Kho tự quản (Self-Storage)',
              title: '🔑 Kho Tự Quản (Self-Storage)',
              desc: 'Phân lô khoang riêng biệt có khóa riêng cho khách hàng tự quản lý xuất nhập',
            },
          ].map((item) => {
            const isSelected = specs.warehouseType === item.type;
            const disabled = isTypeDisabled(item.type);
            const disabledReason = disabled ? getDisabledReason(item.type) : '';

            return (
              <div
                key={item.type}
                onClick={() => {
                  if (!disabled) {
                    updateSpec('warehouseType', item.type as any);
                  }
                }}
                title={disabled ? disabledReason : item.title}
                className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  disabled
                    ? 'border-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed text-slate-400'
                    : isSelected
                    ? 'border-purple-600 bg-purple-50/70 font-bold text-purple-950 shadow-2xs cursor-pointer'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${disabled ? 'text-slate-400' : 'text-slate-900'}`}>
                      {item.title}
                    </span>
                    {disabled ? (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold border border-rose-200">
                        🚫 Khóa
                      </span>
                    ) : isSelected ? (
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    ) : null}
                  </div>
                  <p className={`text-[11px] mt-1 leading-snug font-normal ${disabled ? 'text-slate-400' : 'text-slate-500'}`}>
                    {disabled ? disabledReason : item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1.5 Thông Tin Hải Quan & Luồng Hàng Kho Ngoại Quan (Chỉ hiển thị khi chọn Kho Ngoại Quan) */}
      {(specs.warehouseType === 'Kho ngoại quan (Bonded)' || specs.warehouseType === 'Kho ngoại quan (Bonded Warehouse)') && (
        <div className="space-y-3.5 pt-1 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Thông Tin Hải Quan & Luồng Hàng Kho Ngoại Quan</span>
            </span>
            <span className="text-[10px] font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Bonded Specs
            </span>
          </div>

          {/* Row 1: Bonded Flow Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mục Đích / Luồng Hàng Gửi Kho Ngoại Quan *
            </label>
            <select
              value={specs.bondedPurpose || ''}
              onChange={(e) => updateSpec('bondedPurpose', e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
            >
              <option value="">-- Chọn Mục Đích / Luồng Hàng Gửi Kho Ngoại Quan * --</option>
              <option value="Hàng nhập khẩu chờ hoàn tất thủ tục thông quan vào nội địa">
                📥 Hàng nhập khẩu chờ hoàn tất thủ tục thông quan vào nội địa (Giải tỏa dần)
              </option>
              <option value="Hàng chuyển khẩu, quá cảnh hoặc tái xuất sang nước thứ ba">
                🔄 Hàng chuyển khẩu, quá cảnh hoặc tái xuất sang nước thứ ba
              </option>
              <option value="Hàng sản xuất trong nước đã làm xong thủ tục HQ xuất khẩu">
                📤 Hàng sản xuất trong nước đã xong thủ tục HQ xuất khẩu chờ xuất
              </option>
              <option value="Cung ứng nguyên vật liệu/linh kiện cho doanh nghiệp EPE / SXXK (VMI)">
                🏭 Cung ứng nguyên liệu cho DN chế xuất EPE / SXXK (VMI - JIT Delivery)
              </option>
            </select>
          </div>

          {/* Row 2: HS Code & Cargo Value with Currency selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2. HS Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Mã HS Code Đại Diện (HS Code)</span>
              </label>
              <input
                type="text"
                value={specs.bondedHsCode || ''}
                onChange={(e) => updateSpec('bondedHsCode', e.target.value)}
                placeholder="VD: 8471.30.20, 8504.40..."
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-mono font-bold text-slate-900 shadow-2xs placeholder:font-sans placeholder:font-normal"
              />
            </div>

            {/* 3. Estimated Cargo Value with Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tổng Giá Trị Hàng Hóa Lưu Kho (Cargo Value) *</span>
              </label>
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    value={specs.bondedEstimatedValue !== undefined ? (typeof specs.bondedEstimatedValue === 'number' ? specs.bondedEstimatedValue.toLocaleString('vi-VN') : specs.bondedEstimatedValue) : ''}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\./g, '').replace(/,/g, '').replace(/\D/g, '');
                      const num = clean ? parseInt(clean, 10) : undefined;
                      updateSpec('bondedEstimatedValue', num);
                    }}
                    placeholder="VD: 250.000 hoặc 5.000.000.000"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs"
                  />
                </div>
                <div className="w-24 shrink-0">
                  <select
                    value={specs.bondedEstimatedValueCurrency || 'USD'}
                    onChange={(e) => updateSpec('bondedEstimatedValueCurrency', e.target.value)}
                    className="w-full h-10 px-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="VND">VND (₫)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Billing Unit Preference */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800">
            Đơn Vị Tính Phí Thuê Kho Ưa Chuộng (Billing Preference) *
          </label>
          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            {specs.billingUnitPreference || 'm² (Diện tích sàn)'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            {
              unit: 'm² (Diện tích sàn)',
              title: '📐 Theo Diện Tích (m²)',
              sub: 'Khoanh vùng sàn cố định',
              disabled: isEcommerceWarehouse,
              disabledReason: '🚫 Kho TMĐT chỉ tính theo Đơn hàng',
            },
            {
              unit: 'Pallet (Vị trí Pallet/tháng)',
              title: '🪵 Theo Pallet (Vị trí)',
              sub: 'Tính theo lượng tồn thực',
              disabled: isEcommerceWarehouse || isSelfStorage,
              disabledReason: isEcommerceWarehouse 
                ? '🚫 Kho TMĐT chỉ tính theo Đơn hàng' 
                : '🚫 Kho tự quản bàn giao mặt sàn riêng biệt',
            },
            {
              unit: 'CBM (Thể tích thực m³)',
              title: '📦 Theo Thể Tích (CBM)',
              sub: 'Hàng rời linh hoạt kích thước',
              disabled: isEcommerceWarehouse,
              disabledReason: '🚫 Kho TMĐT chỉ tính theo Đơn hàng',
            },
            {
              unit: 'Order (Hoàn tất đơn hàng TMĐT)',
              title: '⚡ Theo Đơn Hàng (B2C)',
              sub: 'Lưu kho đệm + Pick + Pack + Giao',
              disabled: !isEcommerceWarehouse,
              disabledReason: '🚫 Chỉ dành riêng cho Kho TMĐT / Fulfillment',
            },
          ].map((item) => {
            const isSelected = (specs.billingUnitPreference || 'm² (Diện tích sàn)') === item.unit;
            return (
              <button
                type="button"
                key={item.unit}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    updateSpec('billingUnitPreference', item.unit as any);
                  }
                }}
                title={item.disabled ? item.disabledReason : item.title}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  item.disabled
                    ? 'border-slate-200 bg-slate-100/70 opacity-50 cursor-not-allowed text-slate-400'
                    : isSelected
                    ? 'border-purple-600 bg-purple-50/70 font-bold text-purple-950 shadow-2xs cursor-pointer'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${item.disabled ? 'text-slate-400' : ''}`}>{item.title}</span>
                  {item.disabled ? (
                    <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-semibold">Khóa</span>
                  ) : isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  ) : null}
                </div>
                <p className={`text-[10px] mt-0.5 font-normal truncate ${item.disabled ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.disabled ? item.disabledReason : item.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Storage Volume: Dynamically Bound to Billing Preference */}
      <div className="space-y-3 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-800">
          <Box className="w-4 h-4 text-purple-700" />
          <span>Khai Báo Quy Mô & Dung Lượng Lưu Trữ</span>
        </span>

        {/* TH 1: THEO DIỆN TÍCH (M²) */}
        {(specs.billingUnitPreference === 'm² (Diện tích sàn)' || (!specs.billingUnitPreference && !isEcommerceWarehouse)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diện Tích Sàn Cần Thuê (m²) *
              </label>
              <input
                type="text"
                required
                value={specs.storageAreaSqm ? specs.storageAreaSqm.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  updateSpec('storageAreaSqm', val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 500"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Mã Hàng Quản Lý (SKUs) *
              </label>
              <input
                type="text"
                required
                value={specs.skuCount ? specs.skuCount.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  updateSpec('skuCount', val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 150"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* TH 2: THEO VỊ TRÍ PALLET */}
        {specs.billingUnitPreference === 'Pallet (Vị trí Pallet/tháng)' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Vị Trí Pallet Cần Thuê (Slots) *
              </label>
              <input
                type="text"
                required
                value={specs.palletPositions ? specs.palletPositions.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  updateSpec('palletPositions', val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 350"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Mã Hàng (SKUs) *
              </label>
              <input
                type="text"
                required
                value={specs.skuCount ? specs.skuCount.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  updateSpec('skuCount', val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 150"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quy Cách & Chiều Cao 1 Pallet
              </label>
              <input
                type="text"
                value={specs.palletSpecsDescription || ''}
                onChange={(e) => updateSpec('palletSpecsDescription', e.target.value)}
                placeholder="VD: 1.2m x 1.0m, cao 1.5m, max 800kg"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-medium text-slate-800 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* TH 3: THEO THỂ TÍCH (CBM M³) */}
        {specs.billingUnitPreference === 'CBM (Thể tích thực m³)' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổng Thể Tích Lưu Trữ Dự Kiến (CBM m³) *
              </label>
              <input
                type="text"
                required
                value={specs.cbmVolume ? specs.cbmVolume.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  updateSpec('cbmVolume', val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 800"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Mã Hàng Quản Lý (SKUs) *
              </label>
              <input
                type="text"
                required
                value={specs.skuCount ? specs.skuCount.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  updateSpec('skuCount', val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 150"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* TH 4: THEO ĐƠN HÀNG HOÀN TẤT TMĐT (FULFILLMENT) */}
        {(specs.billingUnitPreference === 'Order (Hoàn tất đơn hàng TMĐT)' || isEcommerceWarehouse) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Lượng Mã Hàng Quản Lý (SKUs) *
              </label>
              <input
                type="text"
                required
                value={specs.skuCount ? specs.skuCount.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  updateSpec('skuCount', val ? parseInt(val, 10) : undefined);
                }}
                placeholder="VD: 150"
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dung Lượng Lưu Kho Đệm (Buffer Stock) *
              </label>
              <div className="flex items-center gap-1.5">
                <div className="w-2/5">
                  <input
                    type="text"
                    required
                    value={specs.bufferStorageQty !== undefined ? specs.bufferStorageQty.toLocaleString('vi-VN') : (specs.bufferPalletPositions ? specs.bufferPalletPositions.toLocaleString('vi-VN') : '')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const num = val ? parseInt(val, 10) : undefined;
                      const unit = specs.bufferStorageUnit || 'Pallet (Vị trí)';
                      onChange({
                        ...specs,
                        bufferStorageQty: num,
                        bufferStorageUnit: unit,
                        bufferPalletPositions: unit.includes('Pallet') ? num : specs.bufferPalletPositions,
                      });
                    }}
                    placeholder="VD: 20"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
                  />
                </div>

                <div className="w-3/5">
                  <select
                    value={specs.bufferStorageUnit || 'Pallet (Vị trí)'}
                    onChange={(e) => {
                      const unit = e.target.value;
                      onChange({
                        ...specs,
                        bufferStorageUnit: unit,
                        bufferPalletPositions: unit.includes('Pallet') ? specs.bufferStorageQty : specs.bufferPalletPositions,
                      });
                    }}
                    className="w-full h-10 px-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
                  >
                    <option value="Pallet (Vị trí)">🪵 Pallet (Vị trí)</option>
                    <option value="Ngăn Kệ / Ô Kệ (Shelving Bins)">🗄️ Ngăn Kệ / Ô Kệ</option>
                    <option value="Khay Nhựa / Thùng Tote (Totes)">🧺 Khay Nhựa / Thùng Tote</option>
                    <option value="m² (Diện tích sàn)">📐 Diện Tích Sàn (m²)</option>
                    <option value="CBM (Thể tích thực m³)">📦 Thể Tích (CBM m³)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Operations & Inventory Method: Hidden for Self-Storage */}
      {isSelfStorage ? (
        <div className="h-auto p-3.5 bg-white border border-slate-200 rounded-xl flex items-start gap-3 shadow-2xs animate-in fade-in duration-150">
          <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-800 flex-1">
            <span className="font-bold block text-xs text-slate-900">
              🔑 Đặc Thù Vận Hành Mô Hình Kho Tự Quản (Self-Storage)
            </span>
            <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
              Bàn giao khoang sàn riêng biệt, khách hàng giữ chìa khóa / thẻ từ riêng và chủ động ra vào 24/7. Không tính phí bốc xếp nâng hạ hay phí phần mềm WMS.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-800">
            <RefreshCw className="w-4 h-4 text-purple-600" />
            <span>Thông Số Vận Hành Nhập - Xuất & Tồn Kho</span>
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 4.1 Inbound Flow */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Lưu Lượng Nhập Kho (Inbound)
              </label>
              <div className="flex items-center gap-1.5">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={specs.inboundQty ? specs.inboundQty.toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const qty = val ? parseInt(val, 10) : undefined;
                      const unit = specs.inboundUnit || 'Pallet';
                      const period = specs.inboundPeriod || 'Tuần';
                      onChange({
                        ...specs,
                        inboundQty: qty,
                        inboundUnit: unit,
                        inboundPeriod: period,
                        dailyInboundVolume: qty ? `${qty.toLocaleString('vi-VN')} ${unit} / ${period}` : '',
                      });
                    }}
                    placeholder="VD: 2"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs text-center"
                  />
                </div>

                <div className="w-5/12">
                  <select
                    value={specs.inboundUnit || 'Pallet'}
                    onChange={(e) => {
                      const unit = e.target.value;
                      const qty = specs.inboundQty;
                      const period = specs.inboundPeriod || 'Tuần';
                      onChange({
                        ...specs,
                        inboundUnit: unit,
                        dailyInboundVolume: qty ? `${qty.toLocaleString('vi-VN')} ${unit} / ${period}` : '',
                      });
                    }}
                    className="w-full h-10 px-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
                  >
                    <option value="Pallet">🪵 Pallet</option>
                    <option value="Container 40ft (FEU)">🚢 Container 40ft</option>
                    <option value="Container 20ft (TEU)">⚓ Container 20ft</option>
                    <option value="Chuyến xe tải (Trucks)">🚚 Chuyến xe tải</option>
                    <option value="Thùng / Kiện (Cartons)">📦 Thùng / Kiện</option>
                    <option value="Tấn (Tons)">⚖️ Tấn (Tons)</option>
                    <option value="Thể tích (CBM m³)">📦 Thể tích CBM</option>
                    <option value="Đơn hàng (Orders)">⚡ Đơn hàng</option>
                  </select>
                </div>

                <div className="w-1/4">
                  <select
                    value={specs.inboundPeriod || 'Tuần'}
                    onChange={(e) => {
                      const period = e.target.value as any;
                      const qty = specs.inboundQty;
                      const unit = specs.inboundUnit || 'Pallet';
                      onChange({
                        ...specs,
                        inboundPeriod: period,
                        dailyInboundVolume: qty ? `${qty.toLocaleString('vi-VN')} ${unit} / ${period}` : '',
                      });
                    }}
                    className="w-full h-10 px-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
                  >
                    <option value="Ngày">/ Ngày</option>
                    <option value="Tuần">/ Tuần</option>
                    <option value="Tháng">/ Tháng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4.2 Outbound Flow */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Lưu Lượng Xuất Kho (Outbound)
              </label>
              <div className="flex items-center gap-1.5">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={specs.outboundQty ? specs.outboundQty.toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const qty = val ? parseInt(val, 10) : undefined;
                      const unit = specs.outboundUnit || (isEcommerceWarehouse ? 'Đơn hàng (Orders)' : 'Pallet');
                      const period = specs.outboundPeriod || 'Ngày';
                      onChange({
                        ...specs,
                        outboundQty: qty,
                        outboundUnit: unit,
                        outboundPeriod: period,
                        dailyOrderCount: (isEcommerceWarehouse || unit === 'Đơn hàng (Orders)') ? qty : specs.dailyOrderCount,
                        dailyOutboundVolume: qty ? `${qty.toLocaleString('vi-VN')} ${unit} / ${period}` : '',
                      });
                    }}
                    placeholder="VD: 40"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs text-center"
                  />
                </div>

                <div className="w-5/12">
                  <select
                    value={specs.outboundUnit || (isEcommerceWarehouse ? 'Đơn hàng (Orders)' : 'Pallet')}
                    onChange={(e) => {
                      const unit = e.target.value;
                      const qty = specs.outboundQty;
                      const period = specs.outboundPeriod || 'Ngày';
                      onChange({
                        ...specs,
                        outboundUnit: unit,
                        dailyOrderCount: (isEcommerceWarehouse || unit === 'Đơn hàng (Orders)') ? qty : specs.dailyOrderCount,
                        dailyOutboundVolume: qty ? `${qty.toLocaleString('vi-VN')} ${unit} / ${period}` : '',
                      });
                    }}
                    className="w-full h-10 px-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
                  >
                    <option value="Pallet">🪵 Pallet</option>
                    <option value="Container 40ft (FEU)">🚢 Container 40ft</option>
                    <option value="Container 20ft (TEU)">⚓ Container 20ft</option>
                    <option value="Chuyến xe tải (Trucks)">🚚 Chuyến xe tải</option>
                    <option value="Thùng / Kiện (Cartons)">📦 Thùng / Kiện</option>
                    <option value="Tấn (Tons)">⚖️ Tấn (Tons)</option>
                    <option value="Thể tích (CBM m³)">📦 Thể tích CBM</option>
                    <option value="Đơn hàng (Orders)">⚡ Đơn hàng</option>
                  </select>
                </div>

                <div className="w-1/4">
                  <select
                    value={specs.outboundPeriod || 'Ngày'}
                    onChange={(e) => {
                      const period = e.target.value as any;
                      const qty = specs.outboundQty;
                      const unit = specs.outboundUnit || (isEcommerceWarehouse ? 'Đơn hàng (Orders)' : 'Pallet');
                      onChange({
                        ...specs,
                        outboundPeriod: period,
                        dailyOutboundVolume: qty ? `${qty.toLocaleString('vi-VN')} ${unit} / ${period}` : '',
                      });
                    }}
                    className="w-full h-10 px-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
                  >
                    <option value="Ngày">/ Ngày</option>
                    <option value="Tuần">/ Tuần</option>
                    <option value="Tháng">/ Tháng</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4.3 Inventory Rule & WMS API */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nguyên Tắc Quản Lý Hạn Dùng
              </label>
              <select
                value={specs.inventoryMethod || ''}
                onChange={(e) => updateSpec('inventoryMethod', e.target.value as any)}
                className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="">-- Chọn Nguyên Tắc Quản Lý --</option>
                <option value="FIFO (Nhập trước xuất trước)">FIFO (Nhập trước - Xuất trước)</option>
                <option value="FEFO (Hạn gần xuất trước)">FEFO (Hạn gần - Xuất trước)</option>
                <option value="Serial / Lot Tracking">Serial / Lot Tracking</option>
                <option value="Tiêu chuẩn">Quản lý tiêu chuẩn theo mã SKU</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center h-10 px-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs mt-auto">
              <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer select-none truncate">
                <input
                  type="checkbox"
                  id="warehousingWmsIntegrationCheck"
                  checked={specs.wmsIntegrationNeeded ?? false}
                  onChange={(e) => updateSpec('wmsIntegrationNeeded', e.target.checked)}
                  className="rounded-sm text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer shrink-0"
                />
                <span className="font-medium truncate">
                  Yêu cầu kết nối cổng API / EDI giữa phần mềm WMS kho với hệ thống ERP / SAP / TMĐT
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 5. Location Requirements: Desired Warehouse Location & Distribution Radius */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Khu Vực / Tỉnh Thành Mong Muốn Đặt Kho *</span>
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="VD: KCN Sóng Thần 1, Dĩ An, Bình Dương hoặc KCN Hiệp Phước, TP.HCM"
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 text-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Phạm Vi & Bán Kính Phân Phối Trọng Tâm *</span>
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="VD: Toàn bộ khu vực TP.HCM, Bình Dương, Đồng Nai & Miền Tây"
            className="w-full h-10 px-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 text-slate-900 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
